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
  const tk = designTokens();
  const colorCount = Object.values(tk.colors).reduce((n, arr) => n + (Array.isArray(arr) ? arr.length : 0), 0);
  console.error('[selftest] token colors   :', colorCount, '(primary:', tk.colors.primary.length,
    'status:', tk.colors.status.length, 'accent:', tk.colors.accent.length, 'neutral:', tk.colors.neutral.length + ')');
  console.error('[selftest] token primary  :', tk.colors.primary[0].value, '(expect #0066FF)');
  console.error('[selftest] typography     :', tk.typography.length, 'styles; spacing foundation:', tk.spacing.foundation.length);
  const semSlots = Object.keys(tk.semantic);
  const semCount = Object.values(tk.semantic).reduce((n, arr) => n + (Array.isArray(arr) ? arr.length : 0), 0);
  console.error('[selftest] semantic tokens :', semCount, 'in', semSlots.length, 'slots (' + semSlots.join('/') + '); primary[0]:', tk.semantic.primary[0].value, '(expect #0066FF)');
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
