# PINTEL 디자인 시스템 — 디자인 프롬프트 가이드

PREVAX 4 관제 화면·컴포넌트를 **MCP(정본 코드·토큰·판단 규칙)를 최대한 활용해** 만들도록
프롬프트를 작성하는 방법입니다. 핵심 원칙 하나:

> **에이전트가 상상해서 만들지 말고, 정본을 먼저 불러오게 강제한다.**

토큰·정본·Library 일관성은 이미 규칙으로 주입되지만, 프롬프트가 이를 명시하면 결과가 훨씬 안정적입니다.

---

## 1. 좋은 프롬프트의 5요소

| 요소 | 왜 필요한가 | 예시 |
|---|---|---|
| ① **도메인·목적** | 관제 맥락을 고정 | "교차로 돌발 이벤트 목록 화면" |
| ② **기준 Library 화면** | 시각·간격 일관성 앵커 | "이벤트 조회 화면과 통일되게" |
| ③ **필요 컴포넌트(또는 역할)** | 정본 fetch 유도 | "Table + Pagination + FilterButton" / "위치 표시가 필요" |
| ④ **데이터·상태** | 실제 콘텐츠 반영 | "컬럼: 시간·종류·위치·상태 / 20건·8페이지" |
| ⑤ **제약** | 토큰·정본 강제 | "토큰만, get_component 정본 그대로" |

컴포넌트 이름을 몰라도 됩니다 — ③에 **역할**만 써도 `plan_screen`/`search_components`가 후보를 찾아줍니다.

---

## 2. 에이전트가 따라야 할 정본 순서

프롬프트로 이 흐름을 유도하세요(또는 "정본 순서대로 진행"이라고 명시):

```
1. plan_screen("화면 목적")            → 추천 컴포넌트·템플릿·토큰
2. list_templates → get_component(템플릿 id)  → 기준 Library 화면 소스로 출발
3. get_component(각 컴포넌트 id)       → 정본 코드 + derivedProps(실제 prop) + whenToUse/related/combineRule
4. get_design_tokens                  → 정확한 토큰 값(T/TYPE/W/SP)
5. check_contrast(fg, bg)             → 색 대비(WCAG) 검증
```

---

## 3. 복붙용 템플릿

```
[화면] 교차로 돌발 이벤트 목록
[기준] Library "이벤트 조회" 화면과 시각·간격 일관성 유지
[구성] 상단 FilterButton(이벤트 종류) + DataTable(시간·종류·위치·상태) + 하단 Pagination
[데이터] 20건/페이지, 총 8페이지, 상태 = 정상/점검
[규칙] 먼저 plan_screen 후, 각 컴포넌트는 get_component 정본 코드·derivedProps 그대로,
       색/타이포/간격은 토큰(T/TYPE/W/SP)만, 새 배지·색 임의 생성 금지,
       정본에 없는 건 만들지 말고 없으면 물어볼 것
```

빈 슬롯만 바꿔 재사용하세요.

---

## 4. 좋은 예 vs 나쁜 예

**❌ 나쁨** — 상상으로 하드코딩, 일관성 붕괴
```
예쁜 관제 대시보드 하나 만들어줘
```

**✅ 좋음** — 정본·판단규칙·기준화면을 명시
```
CCTV 요약 카드 슬라이드를 만들어줘. 항목이 5개라 위치 표시는 어떤 게 맞는지
combineRule/whenToUse 보고 정하고(dots vs counter vs pagination),
정한 컴포넌트는 get_component 정본으로. 기준은 Library 대시보드 카드.
```
→ `whenToUse`가 "적은 항목·시각 콘텐츠 → Pagination dots"를 자동 판단.

---

## 5. 상황별 한 줄 팁

- **컴포넌트를 모를 때** → "이런 역할이 필요" 라고만 쓰기 → `plan_screen`/`search_components`가 후보 제시
- **뭘 쓸지·섞어도 되나 판단** → "위치 인디케이터 뭐 쓸지 `combineRule` 보고 정해줘"
- **정확한 prop이 궁금** → "`derivedProps` 기준으로 실제 prop만 써" (상상 prop 방지)
- **색 대비 걱정** → "`check_contrast`로 본문/배경 대비 확인해줘"
- **일관성 안전장치** → "기존 Library 화면과 어긋나면 그쪽에 맞춰줘"
- **만능 안전장치** → "정본에 없는 건 만들지 말고, 없으면 물어봐"

---

## 6. MCP 도구 빠른 참조

| 도구 | 언제 |
|---|---|
| `plan_screen` | 화면을 처음 구상할 때 — 추천 컴포넌트·템플릿·토큰 |
| `list_components` / `search_components` | 어떤 컴포넌트가 있는지 / 역할로 검색 |
| `get_component(id)` | 정본 코드 + `derivedProps`(실제 API) + `whenToUse`/`related`/`combineRule` |
| `list_templates` | Library 화면 예시 목록(출발점) |
| `get_design_tokens` | 색·타이포·간격·굵기·아이콘 정확한 값 |
| `check_contrast(fg, bg)` | 색 대비 WCAG 검증 |

---

## 7. 기억할 것

- **정본이 항상 우선** — `src/ds/*.jsx`(코드) · `src/data/*`(토큰·문서)가 단일 출처. 프롬프트는 이를 "불러오게" 하는 역할.
- **판단 규칙도 데이터** — "언제 쓰나 / 섞어도 되나"는 `whenToUse`/`related`/`combineRule`에 정본으로 있음.
- **실제 API는 `derivedProps`** — 소스에서 AST로 자동 추출되어 코드와 항상 일치.
- **Library 일관성은 타협 불가** — 새 화면은 기존 Library 화면과 시각적으로 통일.
