# Pintel Design System — MCP Server

`src/data/components.js`(디자인 시스템 데이터)를 읽어 컴포넌트 정보를 **MCP 도구**로 노출하는 무의존성(zero-dependency) 서버입니다. Claude Code 같은 MCP 클라이언트가 이 도구로 정확한 핀텔 컴포넌트 스펙/코드를 가져와 페이지를 생성할 수 있습니다.

**두 가지 연결 방식**
- **로컬(stdio)** — 내 PC에서 `mcp/server.mjs` 직접 실행. (아래 "Claude Code 연결")
- **원격(HTTP)** — Netlify에 배포된 `/mcp` 엔드포인트로 **누구나** 자기 Claude Code에서 연결. 로직은 `mcp/tools.mjs` 공유, transport만 다름. (아래 "원격 연결")

## 도구 (Tools)

| 도구 | 입력 | 설명 |
|---|---|---|
| `list_components` | — | 전체 컴포넌트 목록(그룹/카테고리/문서화 여부) |
| `get_component` | `id` 또는 `name` | 특정 컴포넌트 상세 명세(description·overview·properties(Design Specs)·behavior·usage·code) |
| `search_components` | `query` | 이름/설명/Overview 키워드 검색 |
| `get_design_tokens` | — | 색상·타이포그래피·간격(Spacing) 토큰 |

## 실행 / 검증

```bash
node mcp/server.mjs --selftest     # 데이터 로드 + 도구 동작 확인
node mcp/server.mjs                # stdio MCP 서버로 실행 (Claude Code가 자동 기동)
```

## Claude Code 연결 (이미 설정됨)

사용자 범위(`~/.claude.json`)에 등록되어 있습니다:

```json
{
  "mcpServers": {
    "pintel-design-system": {
      "command": "node",
      "args": ["C:/Users/user/antigravity/pintel-design-system/mcp/server.mjs"]
    }
  }
}
```

권한은 `~/.claude/settings.json`의 `permissions.allow`에 `mcp__pintel-design-system`로 허용됨.

> ⚠️ MCP 서버는 **Claude Code 시작 시 로드**됩니다. 등록 후에는 Claude Code를 **재시작**해야 연결됩니다. 연결 확인: `/mcp` 또는 `claude mcp list`.

## 원격 연결 (다른 사람의 Claude Code → 공개 HTTP 엔드포인트)

배포 사이트와 같은 도메인에 MCP HTTP 엔드포인트가 함께 올라갑니다:

```
https://stellular-monstera-3e44fd.netlify.app/mcp
```

다른 사용자는 자신의 터미널에서 아래 한 줄이면 연결됩니다 (설치/클론 불필요):

```bash
claude mcp add --transport http pintel-ds https://stellular-monstera-3e44fd.netlify.app/mcp
```

연결 확인은 Claude Code 안에서 `/mcp` 또는 `claude mcp list`. 동작 점검(브라우저/curl):

```bash
# 헬스체크
curl https://stellular-monstera-3e44fd.netlify.app/mcp
# 도구 목록 (JSON-RPC)
curl -X POST https://stellular-monstera-3e44fd.netlify.app/mcp \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

### 구조 / 배포

| 파일 | 역할 |
|---|---|
| `mcp/tools.mjs` | 도구·데이터·JSON-RPC 핸들러 (transport 비의존, 공유) |
| `mcp/server.mjs` | 로컬 **stdio** 서버 (tools.mjs 사용) |
| `netlify/functions/mcp.mjs` | 원격 **HTTP** 엔드포인트 (Streamable HTTP, `path:/mcp`) |
| `netlify.toml` | 빌드(`dist`) + functions 디렉터리 설정 |

- 무상태(stateless): 매 POST를 독립 처리하고 `application/json` 단건 응답. 세션/SSE 불필요.
- 배포: 이 저장소를 연결한 Netlify가 push 시 자동 재빌드 → `/mcp` 갱신. (수동: `netlify deploy --prod`)
- ⚠️ 데이터(`src/data/components.js`)를 그대로 노출하므로 **공개해도 되는 정보만** 담겨 있어야 합니다.

## 사용 예

연결 후 Claude에게: *"pintel-design-system MCP로 Button과 Text field를 조회해서 로그인 페이지를 만들어줘"* → Claude가 `get_component`로 정확한 스펙/코드를 가져와 생성합니다.
