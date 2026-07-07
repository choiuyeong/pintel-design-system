/**
 * Library 화면 예시(Templates)의 JSX 소스를 추출해 src/data/templates-code.js 로 생성합니다.
 *
 * MCP가 각 화면의 "실제 코드"를 문서로 노출하기 위한 데이터입니다.
 * 빌드 시 자동 실행되어(package.json build 훅) 원본과 어긋나지 않습니다.
 *   직접 실행:  node mcp/gen-template-code.mjs
 *
 * 추출 방식: 이 코드베이스는 모든 최상위 함수가 0열(column 0)의 `}` 로 닫히므로,
 *   `function Name(` 부터 그 뒤 첫 번째 0열 `}` 까지를 잘라냅니다. (중첩 블록의 닫는 괄호는 들여쓰기됨)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

// 템플릿 id → { 소스 파일, 함수명 }
const SCREENS = {
  'library-dashboard':    { file: 'src/components/Library.jsx', fn: 'PrevaxDashboardScreen' },
  'library-signup':       { file: 'src/components/Library.jsx', fn: 'SignupScreen' },
  'library-login':        { file: 'src/components/Library.jsx', fn: 'LoginScreen' },
  'library-selective':    { file: 'src/components/Library.jsx', fn: 'PrevaxSelectiveScreen' },
  'library-live':         { file: 'src/components/Library.jsx', fn: 'PrevaxLiveScreen' },
  'library-gis-monitor':  { file: 'src/components/Library.jsx', fn: 'PrevaxGisScreen' },
  'library-settings':     { file: 'src/components/Library.jsx', fn: 'PrevaxSettingsScreen' },
  'library-events':       { file: 'src/components/Library.jsx', fn: 'PrevaxSettingsScreen' },
  'library-history':      { file: 'src/components/Library.jsx', fn: 'PrevaxHistoryScreen' },
  'library-stats':        { file: 'src/components/Library.jsx', fn: 'PrevaxStatsScreen' },
  'library-ux-agent':     { file: 'src/components/Library.jsx', fn: 'UxAgentReportScreen' },
  'library-event-search': { file: 'src/components/Library.jsx', fn: 'PrevaxEventSearchScreen' },
  'library-camera-form':  { file: 'src/components/Library.jsx', fn: 'PrevaxCameraFormScreen' },
  'library-camera-form2': { file: 'src/components/Library.jsx', fn: 'PrevaxCameraFormScreen2' },
  'library-event-def-add': { file: 'src/components/Library.jsx', fn: 'PrevaxEventDefAddScreen' },
  'library-camera-group': { file: 'src/components/Library.jsx', fn: 'PrevaxCameraGroupScreen' },
  'library-event-activation': { file: 'src/components/Library.jsx', fn: 'PrevaxEventActivationScreen' },
  'library-permission':   { file: 'src/components/PermissionSettings.jsx', fn: 'PrevaxPermissionScreen' },
  'library-permission2':  { file: 'src/components/PermissionSettings.jsx', fn: 'PrevaxPermissionScreen2' },
};

function extractFn(src, fn) {
  const re = new RegExp(`function\\s+${fn}\\s*\\(`);
  const m = re.exec(src);
  if (!m) return null;
  // 함수 시작(앞에 export default 등이 있으면 줄 시작까지 포함)
  const lineStart = src.lastIndexOf('\n', m.index) + 1;
  // 본문 이후 첫 0열 `}` (= 이 최상위 함수의 닫는 괄호)
  const end = src.indexOf('\n}\n', m.index);
  const stop = end === -1 ? src.length : end + 2; // `}` 포함
  return src.slice(lineStart, stop).trimEnd();
}

const fileCache = {};
const TEMPLATE_CODE = {};
for (const [id, { file, fn }] of Object.entries(SCREENS)) {
  const src = fileCache[file] || (fileCache[file] = readFileSync(join(root, file), 'utf8'));
  const code = extractFn(src, fn);
  if (!code) { console.error(`[gen-template-code] ⚠️  ${id}: ${fn} 추출 실패`); continue; }
  TEMPLATE_CODE[id] = { fn, file, code };
}

const out = `/* 자동 생성 파일 — 직접 수정 금지. 'node mcp/gen-template-code.mjs' 로 재생성됩니다. */
/* Library 화면 예시(Templates)의 JSX 소스. MCP get_component(code) 로 노출됩니다. */
export const TEMPLATE_CODE = ${JSON.stringify(TEMPLATE_CODE, null, 2)};
`;
writeFileSync(join(root, 'src/data/templates-code.js'), out, 'utf8');
console.error(`[gen-template-code] ✅ ${Object.keys(TEMPLATE_CODE).length}개 화면 코드 생성 → src/data/templates-code.js`);
