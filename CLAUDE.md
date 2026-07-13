# PINTEL DESIGN SYSTEM — Claude 지침

## 최우선 항목

Foundation의 **Spacing** 과 **Typography.Style** 이 이 디자인 시스템의 가장 핵심적인 기반입니다.
다른 모든 컴포넌트와 화면 예시는 이 두 토큰을 기준으로 설계됩니다.

## 프로젝트 개요

핀텔 관제 시스템(PREVAX 4)을 위한 디자인 시스템 문서 사이트입니다.
React + Vite 기반 웹 애플리케이션이며, 디자인 토큰 · 컴포넌트 · 실제 관제 화면 예시를 한곳에서 탐색할 수 있습니다.

## 디자인 일관성

Library 탭의 화면 예시(Templates)와 통일성이 깨지지 않아야 합니다.
새 컴포넌트나 화면을 추가할 때 반드시 기존 Library 화면들과 시각적 일관성을 유지하세요.

## 디자인 프롬프트 (MCP 정본 활용)

화면·컴포넌트를 설계할 때는 **상상해서 만들지 말고 정본을 먼저 불러오세요**:
`plan_screen` → `get_component(id)`(정본 코드 + `derivedProps`(실제 API) + `whenToUse`/`combineRule`)
→ `get_design_tokens` → `check_contrast`. 컴포넌트를 모르면 역할만 적어 `plan_screen`/`search_components`로 후보를 찾습니다.

- 최적 프롬프트 작성법 정본: **[docs/prompting-guide.md](docs/prompting-guide.md)** (문서 사이트 Get Started → 프롬프트 가이드에도 동일 내용 노출).

## 컨벤션

- **인라인 스타일** 기반 (CSS-in-JS 라이브러리 미사용)
- 색상·타이포·굵기는 항상 토큰(`T`, `TYPE`, `W`)을 통해 사용 — 하드코딩 지양
- 텍스트는 한국어 기준
- TypeScript 미사용 (JSX)

## 개발 서버

```bash
npm run dev  # http://localhost:5173
```
