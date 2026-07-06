/**
 * Pintel DS 정본 컴포넌트(src/ds/*.jsx)의 소스를 추출해 src/data/components-code.js 로 생성합니다.
 *
 * src/ds/*.jsx 가 단일 출처이며, 이 파일이 생성한 code/importPath 를
 * components.js 가 COMPONENT_DOCS 에 병합합니다(문서 사이트·MCP 공통).
 *   직접 실행:  node mcp/gen-component-code.mjs
 *   빌드 시 자동 실행(package.json prebuild).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

// 컴포넌트 id → src/ds 모듈 파일명
const MODULES = {
  'control-checkbox': 'Checkbox.jsx',
  'filter-button-default': 'FilterButton.jsx',
  'control-datepicker': 'DateField.jsx',
  'table-default': 'DataTable.jsx',
  'present-menu': 'ContextMenu.jsx',
  'section-header-default': 'SectionHeader.jsx',
  'loading-default': 'Loading.jsx',
};

// 선두 JSDoc 헤더(단일 출처 안내) 1개를 제거해 표시용 코드를 정돈.
function stripHeader(src) {
  const m = src.match(/^\s*\/\*\*[\s\S]*?\*\/\s*\n/);
  return (m ? src.slice(m[0].length) : src).trim();
}

const out = {};
for (const [id, file] of Object.entries(MODULES)) {
  const rel = `src/ds/${file}`;
  const raw = readFileSync(join(root, rel), 'utf8');
  out[id] = { file: rel, code: stripHeader(raw) };
}

const banner = '// ⚠️ 자동 생성 파일 — 직접 수정하지 마세요. 원본: src/ds/*.jsx (생성: mcp/gen-component-code.mjs)\n';
writeFileSync(
  join(root, 'src/data/components-code.js'),
  `${banner}export const COMPONENT_CODE = ${JSON.stringify(out, null, 2)};\n`,
);
console.log(`[gen-component-code] ✅ ${Object.keys(out).length}개 정본 컴포넌트 코드 생성 → src/data/components-code.js`);
