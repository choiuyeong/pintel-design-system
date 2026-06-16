/**
 * Pintel Design System — MCP 공유 로직 (transport 비의존)
 *
 * 데이터(components.js)에서 컴포넌트/토큰을 읽어 MCP 도구로 노출하는 순수 로직.
 * stdio 서버(server.mjs)와 HTTP 함수(netlify/functions/mcp.mjs)가 함께 사용합니다.
 */
import { TIERS, COMPONENT_DOCS, SPACING_MAP } from '../src/data/components.js';
import { LIBRARY_TEMPLATES } from '../src/data/templates.js';
import { TEMPLATE_CODE } from '../src/data/templates-code.js';

// 컴포넌트 문서 + Library 화면 예시(Templates) 통합 문서 맵.
// Library 페이지는 화면 예시이므로 kind='template' 로 구분, 실제 JSX 소스(code)도 포함합니다.
const DOCS = { ...COMPONENT_DOCS };
for (const [id, meta] of Object.entries(LIBRARY_TEMPLATES)) {
  const src = TEMPLATE_CODE[id];
  DOCS[id] = {
    name: meta.title,
    kind: 'template',
    description: meta.description,
    uses: meta.uses,
    ...(src ? { sourceFile: src.file, code: src.code } : {}),
  };
}

export const SERVER_INFO = { name: 'pintel-design-system', version: '1.0.0' };
export const DEFAULT_PROTOCOL = '2025-06-18';

// ───────────────────────── 데이터 헬퍼 ─────────────────────────
export function allComponentEntries() {
  const out = [];
  for (const [tierId, tier] of Object.entries(TIERS)) {
    const groups = tier.groups
      || (tier.categories ? [{ id: tierId, label: tier.label || tierId, categories: tier.categories }] : []);
    for (const g of groups) {
      for (const cat of (g.categories || [])) {
        for (const child of (cat.children || [])) {
          out.push({
            id: child.id,
            name: child.name,
            category: cat.name,
            group: g.label || g.id,
            tier: tier.label || tierId,
            kind: (DOCS[child.id] && DOCS[child.id].kind) || 'component',
            documented: Boolean(DOCS[child.id]),
          });
        }
      }
    }
  }
  return out;
}

export function findComponent({ id, name } = {}) {
  if (id && DOCS[id]) return { id, doc: DOCS[id] };
  const entries = allComponentEntries();
  if (id) {
    const e = entries.find((x) => x.id === id);
    if (e && DOCS[e.id]) return { id: e.id, doc: DOCS[e.id] };
  }
  if (name) {
    const lc = String(name).toLowerCase();
    const e = entries.find((x) => x.name.toLowerCase() === lc)
      || entries.find((x) => x.name.toLowerCase().includes(lc));
    if (e && DOCS[e.id]) return { id: e.id, doc: DOCS[e.id] };
    for (const [k, d] of Object.entries(DOCS)) {
      if (d.name && d.name.toLowerCase() === lc) return { id: k, doc: d };
    }
  }
  return null;
}

export function designTokens() {
  const tokens = { colors: [], typography: [], spacing: SPACING_MAP };
  for (const key of ['color-primary', 'color-status']) {
    const d = COMPONENT_DOCS[key];
    if (d && Array.isArray(d.colors)) tokens.colors.push(...d.colors);
  }
  const ty = COMPONENT_DOCS['typo-style'];
  if (ty && Array.isArray(ty.fonts)) tokens.typography = ty.fonts;
  return tokens;
}

// ───────────────────────── 도구 정의 ─────────────────────────
export const TOOLS = [
  {
    name: 'list_components',
    description: '핀텔 디자인 시스템의 모든 항목 목록을 반환합니다. 각 항목은 kind 로 구분됩니다 — "component"(UI 컴포넌트) 또는 "template"(Library 화면 예시 페이지). 그룹/카테고리/문서화 여부 포함.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'list_templates',
    description: 'Library 화면 예시(Templates) 페이지 목록을 반환합니다. 각 페이지의 제목·설명·구성 컴포넌트(uses)를 포함합니다. (예: Login, Dashboard(CS), Event Search(CS), History(CS), Settings(권한 설정) 등)',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_component',
    description: '특정 컴포넌트 또는 Library 화면 예시(template) 문서를 반환합니다. 컴포넌트는 name/description/overview/properties/behavior/usage/code, 템플릿(kind:template)은 title/description/uses(구성 컴포넌트) + 실제 화면 JSX 소스(code, sourceFile)를 반환합니다. id 또는 name 중 하나를 지정하세요.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: '컴포넌트 id (예: button-primary, control-checkbox)' },
        name: { type: 'string', description: '컴포넌트 이름 (예: Button, Checkbox, Tooltip)' },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'search_components',
    description: '이름/설명/Overview에서 키워드로 컴포넌트를 검색합니다.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string', description: '검색어' } },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_design_tokens',
    description: '디자인 토큰(색상 Color, 타이포그래피 Typography, 간격 Spacing)을 반환합니다.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
];

export function textResult(obj) {
  const text = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
  return { content: [{ type: 'text', text }] };
}

export function callTool(name, args = {}) {
  switch (name) {
    case 'list_components': {
      const components = allComponentEntries();
      return textResult({ count: components.length, components });
    }
    case 'get_component': {
      const found = findComponent(args);
      if (!found) return { ...textResult(`컴포넌트를 찾을 수 없습니다: ${JSON.stringify(args)}`), isError: true };
      return textResult({ id: found.id, ...found.doc });
    }
    case 'search_components': {
      const q = String(args.query || '').toLowerCase();
      const matches = allComponentEntries().filter((e) => {
        const d = DOCS[e.id] || {};
        return [e.name, d.description, d.overview].filter(Boolean).some((s) => s.toLowerCase().includes(q));
      }).map((e) => ({ id: e.id, name: e.name, group: e.group, kind: e.kind, description: (DOCS[e.id] || {}).description }));
      return textResult({ query: args.query, count: matches.length, matches });
    }
    case 'list_templates': {
      const templates = Object.entries(LIBRARY_TEMPLATES).map(([id, m]) => ({ id, title: m.title, description: m.description, uses: m.uses }));
      return textResult({ count: templates.length, templates });
    }
    case 'get_design_tokens':
      return textResult(designTokens());
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ───────────────────────── JSON-RPC 핸들러 (transport 공통) ─────────────────────────
// 단일 메시지를 받아 응답 객체(또는 null=알림이라 응답 없음)를 반환합니다.
export function handleRpc(msg) {
  const { id, method, params } = msg || {};
  const ok = (result) => ({ jsonrpc: '2.0', id, result });
  const err = (code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });

  switch (method) {
    case 'initialize':
      return ok({
        protocolVersion: (params && params.protocolVersion) || DEFAULT_PROTOCOL,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });
    case 'ping':
      return ok({});
    case 'tools/list':
      return ok({ tools: TOOLS });
    case 'tools/call':
      try {
        return ok(callTool(params && params.name, (params && params.arguments) || {}));
      } catch (e) {
        return ok({ content: [{ type: 'text', text: 'Error: ' + e.message }], isError: true });
      }
    default:
      if (method && method.startsWith('notifications/')) return null; // 알림은 응답 없음
      if (id !== undefined) return err(-32601, `Method not found: ${method}`);
      return null;
  }
}
