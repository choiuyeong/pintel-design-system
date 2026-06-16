/**
 * Pintel Design System — MCP over HTTP (Netlify Function, Streamable HTTP transport)
 *
 * 원격 Claude Code 연결용 공개 엔드포인트입니다.
 *   연결:  claude mcp add --transport http pintel-ds https://<site>/mcp
 *
 * 무상태(stateless) 구현 — 매 POST 요청을 독립적으로 처리하고
 * JSON-RPC 응답을 application/json 단건으로 반환합니다. (세션/SSE 불필요)
 */
import { handleRpc } from '../../mcp/tools.mjs';

// Functions API v2: 커스텀 경로로 /mcp 에 직접 매핑 (SPA fallback보다 우선)
export const config = { path: '/mcp' };

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id, MCP-Protocol-Version, Authorization',
};

export default async function handler(req) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  // GET: 단순 헬스체크 / 안내 (SSE 스트림은 미사용)
  if (req.method === 'GET') {
    return Response.json(
      { server: 'pintel-design-system', transport: 'streamable-http', status: 'ok' },
      { headers: CORS },
    );
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: CORS });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } },
      { status: 400, headers: CORS },
    );
  }

  // 배치(배열) 또는 단일 메시지 모두 지원
  const messages = Array.isArray(body) ? body : [body];
  const responses = messages.map(handleRpc).filter(Boolean);

  // 알림만 있어 응답이 없으면 202 Accepted (본문 없음)
  if (responses.length === 0) {
    return new Response(null, { status: 202, headers: CORS });
  }

  const payload = Array.isArray(body) ? responses : responses[0];
  return Response.json(payload, { headers: { ...CORS, 'Content-Type': 'application/json' } });
}
