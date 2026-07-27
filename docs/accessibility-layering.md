# 접근성 · 레이어링 원칙 (Accessibility & Layering)

PINTEL 디자인 시스템의 **접근성 4원칙 + 레이어(z-index) 규칙** 정본.
범위는 **웹 · WPF 두 플랫폼**입니다(현재 웹 착수 전이나 동일 원칙 적용). 각 규칙은 두 플랫폼 매핑을 함께 적었습니다.

> 근거: 업계 표준(WCAG) + Pro Max UX 가이드라인(ux-guidelines.csv) 중 관제에 유효한 항목을 PINTEL 토큰/컴포넌트로 흡수.

---

## 1. 색 대비 (Color Contrast)
- **규칙**: 본문 텍스트 **최소 4.5:1**, 큰 텍스트(굵은 ~19px↑/일반 ~24px↑)·UI 경계·아이콘은 **3:1**.
- **검증**: MCP `check_contrast(foreground, background[, large])` 로 확정 후 색 결정. (예: 이벤트 배지 글씨색을 대비 미달 시 조정한 선례.)
- **웹**: 인라인 `color`/`background` 토큰 조합을 배포 전 검증.
- **WPF**: 동일 대비 기준. `Foreground`/`Background` 브러시가 토큰에서 파생되므로 값은 웹과 일치.

## 2. 색-단독 금지 (Not Color Alone)
- **규칙**: 상태·의미를 **색만으로 전달 금지** — 항상 **아이콘/글자 병기**. (정상=check+positive, 주의/경고=warning glyph+cautionary, 위험=error glyph+error, 이벤트 배지=한글 라벨 병기.)
- 이미 PINTEL 전반에 적용된 강한 규칙 — 신규 화면도 필수.

## 3. 아이콘 전용 버튼 라벨 (Icon-only Labels)
- **규칙**: 텍스트 없이 아이콘만인 인터랙티브 요소(PTZ·창 컨트롤·새로고침·닫기·스텝퍼 등)는 **접근성 이름**을 반드시 부여.
- **웹**: `aria-label="..."` (또는 `title`). 예: `<span aria-label="닫기">`.
- **WPF**: `AutomationProperties.Name="..."` (스크린리더/UIA). 웹 aria-label ↔ WPF AutomationProperties.Name 1:1 대응.

## 4. 포커스 상태 (Visible Focus)
- **규칙**: 키보드 포커스가 **눈에 보여야** 함(상시 운영·키보드 조작 대비). 포커스 링은 Primary(#0066FF) 계열 아웃라인.
- **웹**: `:focus-visible { outline: 2px solid #0066FF; outline-offset: 2px }` (마우스 클릭엔 안 뜨고 키보드 탐색에만).
- **WPF**: `FocusVisualStyle` 또는 포커스 시 테두리 브러시 전환. 색은 T.primary 파생.

---

## 5. 레이어 위계 (Z-Index) — 토큰 `Z` 사용
- **규칙**: z-index는 **`Z.*` 토큰만** 사용(tokens.js `Z_LAYERS`). **임의 정수 금지.** 관제는 오버레이(팝업·창·배지·툴팁)가 많아 겹침 순서가 어긋나기 쉬움.
- **스케일**:

| 토큰 | 값 | 용도 |
|---|---|---|
| `Z.base` | 0 | 기본 흐름 |
| `Z.raised` | 1 | 셀·카드 내부 오버레이(검지 박스·OSD 라벨) |
| `Z.sticky` | 100 | 고정 헤더·툴바 |
| `Z.dropdown` | 1000 | 드롭다운·셀렉트·영상옵션 팝오버 |
| `Z.overlayBackdrop` | 1100 | 모달·팝오버 뒤 백드롭 |
| `Z.modal` | 1200 | 모달·확대(전체화면) 오버레이 |
| `Z.popover` | 1300 | 컨텍스트 메뉴·팝오버(모달 위 포함) |
| `Z.toast` | 1400 | 토스트·실시간 알림 |
| `Z.tooltip` | 1500 | 툴팁(항상 최상단) |

- **웹**: `style={{ zIndex: Z.popover }}`.
- **WPF**: `Panel.ZIndex` (정수) — 값이 그대로 매핑. xamlKey `Pintel.Layer.*`.

---

## 웹 착수 시 추가 적용 (지금은 보류, 웹 빌드 때 필수)
관제 데스크톱(마우스·고밀도)엔 과하지만, **웹(특히 터치/반응형) 착수 시** 아래를 적용:
- **터치 타깃 최소 44×44px** — 터치 대상. 데스크톱 고밀도 뷰는 예외(밀도 우선).
- **본문 라인 길이 65~75자** — 설명·문서형 텍스트에 한함(표·영상 그리드 제외).
- **호버 vs 탭** — 터치에선 hover 의존 금지(1차 동작은 tap/click).
