#!/usr/bin/env node
/**
 * Pintel Design System — MCP Server (stdio, JSON-RPC 2.0, newline-delimited)
 *
 * 로컬 Claude Code 연결용 stdio 서버입니다. 도구/데이터 로직은 tools.mjs 공유.
 * 원격(다른 사람의 Claude Code) 연결은 HTTP 엔드포인트(netlify/functions/mcp.mjs)를 사용하세요.
 *
 * 도구: list_components · get_component · search_components · get_design_tokens
 * 셀프테스트:  node server.mjs --selftest
 */
import {
  TOOLS, callTool, allComponentEntries, designTokens, handleRpc,
} from './tools.mjs';

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
    const res = handleRpc(msg);
    if (res) send(res);
  }
});
process.stdin.on('end', () => process.exit(0));
process.stderr.write('[pintel-ds-mcp] ready (stdio)\n');
