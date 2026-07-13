/**
 * 정본 컴포넌트(src/ds/*.jsx)의 함수 시그니처를 AST로 파싱해 prop 스펙을 추출,
 * src/data/components-props.js (COMPONENT_PROPS) 로 생성합니다.
 *
 * 목적: 손으로 쓴 COMPONENT_DOCS.properties 와 실제 컴포넌트 prop 사이의 드리프트 방지.
 *       실제 소스가 단일 출처 — prop 이름·기본값·타입을 여기서 자동 도출합니다.
 * 파서: espree(eslint 내장, JSX 지원) — 새 의존성 없음.
 * 타입 추론 우선순위: 기본값 리터럴 → 강한 이름 신호 → 본문 사용 패턴(AST) → any.
 *   직접 실행:  node mcp/gen-component-props.mjs
 *   빌드 시 자동 실행(package.json prebuild).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as espree from 'espree';
import { DS_MODULES as MODULES } from './ds-modules.mjs';
import { COMPONENT_DOCS } from '../src/data/components.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

// ── 범용 ESTree 워커(모든 자식 노드 방문) ──
function walk(node, visit) {
  if (!node || typeof node.type !== 'string') return;
  visit(node);
  for (const key of Object.keys(node)) {
    if (key === 'type' || key === 'loc' || key === 'range' || key === 'start' || key === 'end' || key === 'parent') continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const c of child) if (c && typeof c.type === 'string') walk(c, visit);
    } else if (child && typeof child.type === 'string') {
      walk(child, visit);
    }
  }
}

// ── 기본값 노드 → [type, defaultLiteral] ──
function fromDefault(node) {
  if (!node) return [null, null];
  if (node.type === 'Literal') {
    if (typeof node.value === 'boolean') return ['boolean', String(node.value)];
    if (typeof node.value === 'number') return ['number', String(node.value)];
    if (typeof node.value === 'string') return ['string', JSON.stringify(node.value)];
    if (node.value === null) return [null, 'null'];
  }
  if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') return ['function', '() => {}'];
  if (node.type === 'ObjectExpression') return ['object', '{}'];
  if (node.type === 'ArrayExpression') return ['Array', '[]'];
  if (node.type === 'Identifier' && node.name === 'undefined') return [null, 'undefined'];
  return [null, null];
}

// ── 강한 이름 신호(확신 가능한 것만; 아니면 null) ──
function strongType(name) {
  if (/^on[A-Z]/.test(name)) return 'function';
  if (name === 'children') return 'ReactNode';
  if (name === 'style') return 'object';
  if (name === 'className') return 'string';
  if (/^(is|has|show|can|allow)[A-Z]/.test(name)) return 'boolean';
  if (/^(disabled|checked|open|active|selected|loading|readonly|required|hovered|playing|editable|visible)$/.test(name)) return 'boolean';
  return null;
}

// ── 식(expression) 안에 특정 식별자가 들어있는지 ──
function containsIdent(node, name) {
  let found = false;
  walk(node, (n) => { if (n.type === 'Identifier' && n.name === name) found = true; });
  return found;
}

// ── 컴포넌트 본문에서 prop 사용 패턴으로 타입 추론(Array / ReactNode) ──
const ARR_METHODS = new Set(['map', 'filter', 'forEach', 'reduce', 'slice', 'length', 'some', 'every', 'find', 'concat', 'join', 'flatMap', 'includes']);
function inferByUsage(body, name) {
  if (!body) return null;
  let arrayLike = false;
  let nodeLike = false;
  walk(body, (n) => {
    // prop.map(...) / prop.length 등 → 배열
    if (n.type === 'MemberExpression' && n.object && n.object.type === 'Identifier' && n.object.name === name) {
      const key = n.property && (n.property.name ?? n.property.value);
      if (ARR_METHODS.has(key)) arrayLike = true;
    }
    // JSX 자식으로 렌더( {prop} / {prop && ...} / {prop || ...} ) → ReactNode
    if (n.type === 'JSXElement' && Array.isArray(n.children)) {
      for (const ch of n.children) {
        if (ch.type === 'JSXExpressionContainer' && containsIdent(ch.expression, name)) nodeLike = true;
      }
    }
  });
  if (arrayLike) return 'Array';       // 배열 사용이 우선(예: rows.map)
  if (nodeLike) return 'ReactNode';    // 렌더 슬롯
  return null;
}

// ── ObjectPattern(구조분해 파라미터) → prop 배열 ──
function propsFromPattern(pattern, body) {
  if (!pattern || pattern.type !== 'ObjectPattern') return { props: [], destructured: false };
  const props = [];
  for (const p of pattern.properties) {
    if (p.type === 'RestElement') {
      props.push({ name: p.argument?.name || 'rest', type: 'rest' });
      continue;
    }
    const name = p.key?.name ?? p.key?.value;
    if (!name) continue;
    const val = p.value;
    let defType = null;
    let def = null;
    if (val && val.type === 'AssignmentPattern') [defType, def] = fromDefault(val.right);
    // 우선순위: 기본값 리터럴 → 강한 이름 신호 → 본문 사용 패턴 → any
    const type = defType || strongType(name) || inferByUsage(body, name) || 'any';
    props.push({ name, type, ...(def != null ? { default: def } : {}) });
  }
  return { props, destructured: true };
}

// ── 파일에서 export된 첫 컴포넌트(대문자 시작 함수)의 시그니처+본문 추출 ──
function extractComponent(code) {
  const ast = espree.parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  });
  const candidates = [];
  const push = (name, params, body) => {
    if (name && /^[A-Z]/.test(name)) candidates.push({ name, param0: params?.[0], body });
  };
  for (const node of ast.body) {
    if (node.type === 'ExportNamedDeclaration' && node.declaration) {
      const d = node.declaration;
      if (d.type === 'FunctionDeclaration') push(d.id?.name, d.params, d.body);
      if (d.type === 'VariableDeclaration') {
        for (const decl of d.declarations) {
          const init = decl.init;
          if (init && (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression')) push(decl.id?.name, init.params, init.body);
        }
      }
    } else if (node.type === 'ExportDefaultDeclaration') {
      const d = node.declaration;
      if (d.type === 'FunctionDeclaration') push(d.id?.name || 'default', d.params, d.body);
      if (d.type === 'ArrowFunctionExpression' || d.type === 'FunctionExpression') push('default', d.params, d.body);
    }
  }
  if (!candidates.length) return null;
  const c = candidates[0];
  return { component: c.name, ...propsFromPattern(c.param0, c.body) };
}

// ── 손문서 properties 와 소스 prop 이름 드리프트 리포트(경고만, 빌드 실패 아님) ──
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const IGNORE = new Set(['children']); // 문서에 잘 안 적는 표준 슬롯
function driftReport(id, derivedProps) {
  const docProps = COMPONENT_DOCS[id]?.properties;
  if (!Array.isArray(docProps) || docProps.length === 0) return null; // 손문서 없음 → 비교 생략
  const docSet = new Set(docProps.map((p) => norm(p.name)).filter(Boolean));
  const srcSet = new Set(derivedProps.map((p) => norm(p.name)));
  const onlySource = derivedProps.filter((p) => !IGNORE.has(p.name) && !docSet.has(norm(p.name))).map((p) => p.name);
  const onlyDoc = docProps.filter((p) => !srcSet.has(norm(p.name))).map((p) => p.name);
  if (!onlySource.length && !onlyDoc.length) return null;
  return { onlySource, onlyDoc };
}

const out = {};
const summary = [];
const drifts = [];
for (const [id, file] of Object.entries(MODULES)) {
  const rel = `src/ds/${file}`;
  const raw = readFileSync(join(root, rel), 'utf8');
  const info = extractComponent(raw);
  if (!info) {
    summary.push(`${id}: ⚠ export 컴포넌트를 찾지 못함`);
    continue;
  }
  out[id] = { component: info.component, file: rel, props: info.props };
  summary.push(`${id} (${info.component}): ${info.destructured ? `${info.props.length} props` : 'props 구조분해 아님(추출 0)'}`);
  const d = driftReport(id, info.props);
  if (d) drifts.push({ id, ...d });
}

const banner = '// ⚠️ 자동 생성 파일 — 직접 수정하지 마세요. 원본: src/ds/*.jsx (생성: mcp/gen-component-props.mjs)\n';
writeFileSync(
  join(root, 'src/data/components-props.js'),
  `${banner}export const COMPONENT_PROPS = ${JSON.stringify(out, null, 2)};\n`,
);
console.log(`[gen-component-props] ✅ ${Object.keys(out).length}개 컴포넌트 prop 추출 → src/data/components-props.js`);
for (const s of summary) console.log(`  · ${s}`);
if (drifts.length) {
  console.log('[gen-component-props] ⚠ 손문서(properties) ↔ 소스(derivedProps) 이름 드리프트:');
  for (const d of drifts) {
    if (d.onlySource.length) console.log(`  · ${d.id}: 소스에만 있음 → ${d.onlySource.join(', ')}`);
    if (d.onlyDoc.length) console.log(`  · ${d.id}: 손문서에만 있음 → ${d.onlyDoc.join(', ')}`);
  }
} else {
  console.log('[gen-component-props] 드리프트 없음(이름 정규화 대조 기준).');
}
