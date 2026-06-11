# Pintel Design System — MCP Server

`src/data/components.js`(디자인 시스템 데이터)를 읽어 컴포넌트 정보를 **MCP 도구**로 노출하는 무의존성(zero-dependency) 서버입니다. Claude Code 같은 MCP 클라이언트가 이 도구로 정확한 핀텔 컴포넌트 스펙/코드를 가져와 페이지를 생성할 수 있습니다.

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

## 사용 예

연결 후 Claude에게: *"pintel-design-system MCP로 Button과 Text field를 조회해서 로그인 페이지를 만들어줘"* → Claude가 `get_component`로 정확한 스펙/코드를 가져와 생성합니다.
