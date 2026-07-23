# 디자인 가이드 준수 점검 — 이탈 기록 & 재발 방지

> 목적: 작업 중 **안 지켜진 디자인 가이드/정본**을 기록해 재발을 막는다.
> 정본(定本) = 디자인 시스템의 표준. 코드로 만들기 전 **MCP `get_component(id)` 로 정본을 먼저 받아 구조·토큰을 그대로 따른다.**
> 최초 작성 2026-07-01. 이 문서는 새 이탈을 발견할 때마다 갱신한다.

---

## 0. 최우선 원칙 (매 작업 전 확인)

1. **정본 우선** — 컴포넌트가 필요하면 즉흥으로 만들지 말고 MCP `get_component`로 정본을 받는다. (control-checkbox · control-radio · button-icon · feedback-section-message · content-badge 등)
2. **배지/칩/버튼을 인라인으로 새로 만들지 말 것** — 이미 있는 정본/공용을 재사용: `Tbtn`(버튼), `CBadge`(상태 칩), Icon button, `Section message`(영역 경고).
3. **Primary = `#0066FF`(T.primary) / `#3385FF`(T.primaryStrong) / `#0052CC`(T.primaryHeavy)** 만. 폐기값 `#1751D9 · #3471FF · #004DFF` 금지.
4. **색·타이포·간격·굵기는 토큰** — `T` / `TYPE` / `SP` / `W`. 하드코딩·off-palette 색 지양.
5. **수동 상태(텍스트) ↔ 액션(버튼) 시각 위계 분리** — 경과시간·미열람 등 메타데이터는 버튼처럼 보이는 박스로 만들지 않는다.
6. **정본과 사용자 요청이 충돌하면** 임의로 진행하지 말고 먼저 짚어 확인한다. (예: "배경 빼줘" vs Section message 정본은 배경 있음)

---

## 1. 정정 완료 (이번 세션에서 바로잡은 이탈)

| 항목 | 이탈(잘못) | 정본/정정 | 위치 |
|---|---|---|---|
| Primary 색 | 폐기값 `#1751D9/#3471FF/#004DFF` 사용 | `#0066FF/#3385FF/#0052CC`로 교체 | pc-adaptive-ui-hifi(복사본).html, 파생 rgba 포함 |
| 체크박스 제각각 | Foundation `check_on/off` 원형 아이콘 등 화면마다 상이 | **13×13 둥근 사각(Primary 채움+흰 체크)** 로 통일 | 이벤트활성화(CS)·분석서버·이벤트관리표·장비 카메라목록·권한설정·Event Search·Statistics·Selective |
| 라디오 | 테두리만 두고 안에 작은 파란 점 | control-radio 정본: **외곽 원 전체 #0066FF 채움 + 흰 점**, Small 16/6/라벨13/간격6 | Statistics(CS) 집계 단위 |
| 페이지 타이포 | `fontSize:'32px'` 등 하드코딩 | `TYPE.title1/body2Reading/caption1/caption2` | Library 페이지 래퍼(ComponentDoc/Library 헤더·칩·워터마크) |
| 임의 배지/칩 | 경고·필터·상태를 인라인 span으로 즉흥 제작 | 정본 재사용: `CBadge`(위험/경고/주의), Icon button(삭제), `Tbtn`(관리/모니터링) | Settings(알림 설정) 팝업·헤더 |
| off-palette 색 | 주의 칩 `#b7a233` | 선별관제 밴드색 `#9C9C5C` | 알림 설정 팝업 필터 칩 |
| 상태 vs 액션 혼동 | "N분 경과"를 테두리+배경 박스(버튼처럼) | 박스 제거 → 보조 텍스트(`#8a8a92`) | 알림 설정 팝업 이벤트 피드 |
| 경고 배치 | 시스템 경고를 탭 타이틀바/적용 버튼 옆 등 부적절 위치 | 화면 전역 상태 → 메인 헤더 우측(무배경 텍스트) | Settings(알림 설정) |
| 카메라 셀 이벤트색 off-palette | 위험 `#F0436A`·주의 `#9C9C5C`(비토큰) | **상태 토큰**: 위험 `T.error #FF6363` · 경고 `T.cautionary #FFA938` · 주의 `#999999`(neutral60) | 실시간 영상 Focus 셀 이벤트 배지 |
| PTZ·고정 핀 틸 off-palette | `#52ebff` + 배경 `rgba(20,104,147,.4)`(비토큰 레거시) | Foundation **accentCyan `#1FC8E6`** + 중립 스크림 `rgba(0,0,0,.55)` | 실시간 영상 기본/Focus PTZ 배지·고정 핀·테두리 |

---

## 2. 남은 미준수 / 부채 (아직 안 고침 — 착수 시 처리)

- **체크박스 규격 미세 불일치**: 화면 통일본은 13~15px 사각인데, DS `control-checkbox` 정본은 **16px / 1.5px 보더 / #4a4a52**(또는 `check_on` 18px). 정본으로 재정렬 필요.
- **`numField` 입력 어포던스 없음**: 알림 설정의 숫자 입력칸이 커서·호버 등 "입력 가능" 신호 부족.
- **전역 하드코딩(중립색·rgba 헬퍼·shadow)**: Library 전반에 `rgba(...)`·중립 hex·box-shadow 하드코딩 다수. 단독 화면만 고치면 오히려 불일치 → **SEM 토큰화 리팩터로 일괄** 처리 권장.
- **폐기 Primary 잔존 가능성**: `prevax_gui` HI-FI 원본 파일들(복사본이 아닌 원본 등)에 `#1751D9` 계열이 남아있을 수 있음 → 점검 필요.

---

## 2-1. 산출물 일관성 스키마 (MCP get_component 확장 — 파일럿)

"누가 어떻게 말하든 같은 산출물"을 위해 컴포넌트 doc에 아래 필드를 추가한다. `get_component`가 그대로 반환하고, `name` 인자·`search_components`는 `aliases`로도 매칭한다(띄어쓰기 무시).

| 필드 | 목적 |
|---|---|
| `code` | drop-in 정본 JSX — 새로 짜지 말고 복사·치환 |
| `tokensUsed` | 이 컴포넌트가 쓰는 T/TYPE/SP/W 토큰 |
| `aliases` | 자연어 별칭("다중 선택","삭제 버튼" 등) → 표현 달라도 같은 컴포넌트로 라우팅 |
| `usage` | 이럴 때 사용 |
| `antiPatterns` | 하지 말 것(예: 임의 배지 제작 금지) |
| `examples` | 올바른 사용 스니펫 1~2개 |

- **적용 완료(파일럿 5종)**: `control-checkbox` · `control-radio` · `button-primary` · `button-icon` · `feedback-section-message`.
- **검증**: 다른 표현("다중 선택/복수선택","삭제 버튼/아이콘 버튼","택일","영역 경고/주의 배너")이 모두 동일 정본으로 수렴 확인.
- **다음**: 나머지 컴포넌트로 확장(우선순위: 자주 쓰는 입력·버튼·피드백), MCP 배포 반영.
- ※ `aliases`는 "정확히 같음 또는 별칭이 질의를 포함"만 매칭 → 짧은 별칭("버튼")이 "삭제 버튼"을 삼키지 않게 함.

## 3. 재발 방지 체크리스트 (새 화면/컴포넌트 추가 시)

- [ ] 필요한 컴포넌트의 MCP 정본을 먼저 조회했는가
- [ ] 배지/칩/버튼을 새로 만들지 않고 정본(CBadge/Tbtn/Icon button/Section message)을 썼는가
- [ ] 색은 T·SEM 토큰인가 (Primary #0066FF 세트, 폐기값 없음, off-palette 없음)
- [ ] 타이포/간격/굵기는 TYPE·SP·W인가
- [ ] 상태 텍스트와 액션 버튼의 시각 위계가 분리됐는가
- [ ] 기존 Library 화면(특히 History/Settings 계열)과 헤더·필터 바·패널 규격이 일관되는가
- [ ] 정본과 요청이 충돌하면 사용자에게 먼저 확인했는가
