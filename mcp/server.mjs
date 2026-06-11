#!/usr/bin/env node
/**
 * Pintel Design System — MCP Server (stdio, JSON-RPC 2.0, newline-delimited)
 *
 * 의존성 없음(zero-dependency). 디자인 시스템 데이터(components.js)를 읽어
 * 컴포넌트 목록 / 상세 명세 / 검색 / 디자인 토큰을 MCP 도구로 노출합니다.
 *
 * 도구:
 *   - list_components   : 전체 컴포넌트 목록(그룹/카테고리 포함)
 *   - get_component     : 특정 컴포넌트 상세 명세(설명/Overview/Specs/Behavior/Usage/코드)
 *   - search_components : 키워드 검색
 *   - get_design_tokens : 색상/타이포그래피/간격 토큰
 *
 * 셀프테스트:  node server.mjs --selftest
 */
import { TIERS, COMPONENT_DOCS, SPACING_MAP } from '../src/data/components.js';

const SERVER_INFO = { name: 'pintel-design-system', version: '1.0.0' };
const DEFAULT_PROTOCOL = '2025-06-18';

// ───────────────────────── 데이터 헬퍼 ─────────────────────────
function allComponentEntries() {
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
            documented: Boolean(COMPONENT_DOCS[child.id]),
          });
        }
      }
    }
  }
  return out;
}

function findComponent({ id, name } = {}) {
  if (id && COMPONENT_DOCS[id]) return { id, doc: COMPONENT_DOCS[id] };
  const entries = allComponentEntries();
  if (id) {
    const e = entries.find((x) => x.id === id);
    if (e && COMPONENT_DOCS[e.id]) return { id: e.id, doc: COMPONENT_DOCS[e.id] };
  }
  if (name) {
    const lc = String(name).toLowerCase();
    let e = entries.find((x) => x.name.toLowerCase() === lc)
      || entries.find((x) => x.name.toLowerCase().includes(lc));
    if (e && COMPONENT_DOCS[e.id]) return { id: e.id, doc: COMPONENT_DOCS[e.id] };
    for (const [k, d] of Object.entries(COMPONENT_DOCS)) {
      if (d.name && d.name.toLowerCase() === lc) return { id: k, doc: d };
    }
  }
  return null;
}

function designTokens() {
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
const TOOLS = [
  {
    name: 'list_components',
    description: '핀텔 디자인 시스템의 모든 컴포넌트 목록(그룹/카테고리/문서화 여부 포함)을 반환합니다.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_component',
    description: '특정 컴포넌트의 상세 명세(name, description, overview, properties(Design Specs), behavior, usage, code)를 반환합니다. id 또는 name 중 하나를 지정하세요.',
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

function textResult(obj) {
  const text = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
  return { content: [{ type: 'text', text }] };
}

function callTool(name, args = {}) {
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
        const d = COMPONENT_DOCS[e.id] || {};
        return [e.name, d.description, d.overview].filter(Boolean).some((s) => s.toLowerCase().includes(q));
      }).map((e) => ({ id: e.id, name: e.name, group: e.group, description: (COMPONENT_DOCS[e.id] || {}).description }));
      return textResult({ query: args.query, count: matches.length, matches });
    }
    case 'get_design_tokens':
      return textResult(designTokens());
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ───────────────────────── 셀프테스트 ─────────────────────────
if (process.argv.includes('--selftest')) {
  const comps = allComponentEntries();
  console.error('[selftest] tools         :', TOOLS.map((t) => t.name).join(', '));
  console.error('[selftest] component count:', comps.length, '(documented:', comps.filter((c) => c.documented).length + ')');
  console.error('[selftest] get Button     :', JSON.stringify(callTool('get_component', { name: 'Button' })).slice(0, 100), '...');
  console.error('[selftest] search "tab"   :', JSON.parse(callTool('search_components', { query: 'tab' }).content[0].text).count, 'matches');
  console.error('[selftest] token colors   :', designTokens().colors.length);
  process.exit(0);
}

// ───────────────────────── JSON-RPC over stdio ─────────────────────────
function send(msg) { process.stdout.write(JSON.stringify(msg) + '\n'); }
function reply(id, result) { send({ jsonrpc: '2.0', id, result }); }
function replyError(id, code, message) { send({ jsonrpc: '2.0', id, error: { code, message } }); }

function handle(msg) {
  const { id, method, params } = msg;
  switch (method) {
    case 'initialize':
      reply(id, {
        protocolVersion: (params && params.protocolVersion) || DEFAULT_PROTOCOL,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });
      break;
    case 'ping':
      reply(id, {});
      break;
    case 'tools/list':
      reply(id, { tools: TOOLS });
      break;
    case 'tools/call':
      try {
        reply(id, callTool(params && params.name, (params && params.arguments) || {}));
      } catch (e) {
        reply(id, { content: [{ type: 'text', text: 'Error: ' + e.message }], isError: true });
      }
      break;
    default:
      // notifications (initialized 등)은 응답하지 않음. id 있는 미지원 메서드만 에러.
      if (method && method.startsWith('notifications/')) break;
      if (id !== undefined) replyError(id, -32601, `Method not found: ${method}`);
  }
}

let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  let idx;
  while ((idx = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    handle(msg);
  }
});
process.stdin.on('end', () => process.exit(0));
process.stderr.write('[pintel-ds-mcp] ready\n');
