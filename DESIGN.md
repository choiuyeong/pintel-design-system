---
version: alpha
name: Pintel Design System
description: 핀텔 관제 시스템(PREVAX 4)을 위한 다크 우선 디자인 시스템. Spacing과 Typography를 핵심 기반으로 하는 4/8pt 스케일과 교통 신호 체계 상태색을 사용한다.
colors:
  # Primary — 브랜드 3단계 (Normal / Strong(hover) / Heavy(pressed))
  primary: "#0066FF"
  primaryStrong: "#3385FF"
  primaryHeavy: "#0052CC"
  # Status — 교통 신호 체계와 일치
  positive: "#1ED45A"
  cautionary: "#FFA938"
  error: "#FF6363"
  # Accent — 데이터 계열·범례·태그 구별용(의미 고정 아님) 11색
  accentRed: "#FF5C5C"
  accentRedOrange: "#FF7847"
  accentOrange: "#FF9F2E"
  accentLime: "#8CD929"
  accentGreen: "#2ED45A"
  accentCyan: "#1FC8E6"
  accentLightBlue: "#45A6F5"
  accentBlue: "#5B8DEF"
  accentViolet: "#9B8CFA"
  accentPurple: "#C77DFF"
  accentPink: "#FF7AD4"
  # Neutral — 배경/표면/테두리/텍스트 명도 위계 14단계
  neutral99: "#FCFCFC"
  neutral95: "#F2F2F2"
  neutral90: "#E6E6E6"
  neutral80: "#CCCCCC"
  neutral70: "#B3B3B3"
  neutral60: "#999999"
  neutral50: "#808080"
  neutral40: "#666666"
  neutral30: "#4D4D4D"
  neutral22: "#383838"
  neutral20: "#333333"
  neutral15: "#262626"
  neutral10: "#1A1A1A"
  neutral5: "#0D0D0D"
typography:
  # Foundation 핵심 토큰 19종 (Pretendard GOV). lineHeight·letterSpacing 원본 유지.
  display1:      { fontFamily: Pretendard GOV, fontSize: 56px, lineHeight: 72px, letterSpacing: -0.0319em }
  display2:      { fontFamily: Pretendard GOV, fontSize: 40px, lineHeight: 52px, letterSpacing: -0.0282em }
  display3:      { fontFamily: Pretendard GOV, fontSize: 36px, lineHeight: 48px, letterSpacing: -0.027em }
  title1:        { fontFamily: Pretendard GOV, fontSize: 32px, lineHeight: 44px, letterSpacing: -0.0253em }
  title2:        { fontFamily: Pretendard GOV, fontSize: 28px, lineHeight: 38px, letterSpacing: -0.0236em }
  title3:        { fontFamily: Pretendard GOV, fontSize: 24px, lineHeight: 32px, letterSpacing: -0.023em }
  heading1:      { fontFamily: Pretendard GOV, fontSize: 22px, lineHeight: 30px, letterSpacing: -0.0194em }
  heading2:      { fontFamily: Pretendard GOV, fontSize: 20px, lineHeight: 28px, letterSpacing: -0.012em }
  headline1:     { fontFamily: Pretendard GOV, fontSize: 18px, lineHeight: 26px, letterSpacing: -0.002em }
  headline2:     { fontFamily: Pretendard GOV, fontSize: 17px, lineHeight: 26px, letterSpacing: 0em }
  body1:         { fontFamily: Pretendard GOV, fontSize: 16px, lineHeight: 24px, letterSpacing: 0.0057em }
  body1Reading:  { fontFamily: Pretendard GOV, fontSize: 16px, lineHeight: 26px, letterSpacing: 0.0057em }
  body2:         { fontFamily: Pretendard GOV, fontSize: 15px, lineHeight: 22px, letterSpacing: 0.0096em }
  body2Reading:  { fontFamily: Pretendard GOV, fontSize: 15px, lineHeight: 24px, letterSpacing: 0.0096em }
  label1:        { fontFamily: Pretendard GOV, fontSize: 14px, lineHeight: 20px, letterSpacing: 0.0145em }
  label1Reading: { fontFamily: Pretendard GOV, fontSize: 14px, lineHeight: 22px, letterSpacing: 0.0145em }
  label2:        { fontFamily: Pretendard GOV, fontSize: 13px, lineHeight: 18px, letterSpacing: 0.0194em }
  caption1:      { fontFamily: Pretendard GOV, fontSize: 12px, lineHeight: 16px, letterSpacing: 0.0252em }
  caption2:      { fontFamily: Pretendard GOV, fontSize: 11px, lineHeight: 14px, letterSpacing: 0.0311em }
rounded:
  # 컴포넌트 코드에서 관찰된 반경(현재 tokens.js에 정식 토큰 없음 — 형식화 후보)
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
spacing:
  # Foundation 4/8pt 스케일 (SP[key] = '<px>px'). 모든 레이아웃 여백의 기준.
  "2": 2px
  "4": 4px
  "8": 8px
  "12": 12px
  "16": 16px
  "24": 24px
  "32": 32px
  "40": 40px
  "48": 48px
  "64": 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    typography: "{typography.label2}"
    rounded: "{rounded.md}"
    padding: 0 12px
    height: 34px
  button-primary-hover:
    backgroundColor: "{colors.primaryStrong}"
  button-primary-pressed:
    backgroundColor: "{colors.primaryHeavy}"
  filter-button:
    backgroundColor: "{colors.neutral10}"
    textColor: "{colors.neutral80}"
    typography: "{typography.label2}"
    rounded: "{rounded.md}"
    padding: 0 12px
    height: 34px
  filter-button-active:
    backgroundColor: "rgba(0,102,255,0.1)"
    textColor: "{colors.primary}"
  checkbox-checked:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    size: 16px
  context-menu:
    backgroundColor: "#1E2229"
    textColor: "{colors.neutral80}"
    typography: "{typography.caption1}"
    rounded: "{rounded.md}"
    width: 216px
  context-menu-emphasis:
    textColor: "{colors.cautionary}"
---

> **이 파일의 역할 (중요)**
> 이 DESIGN.md는 **포터블·외부용**입니다 — 빠른 프로토타이핑, 외부 에이전트, 고객 리포트/대시보드 테마링처럼 우리 코드베이스가 없는 환경에서 브랜드 맥락을 전달하는 용도입니다.
> **사내 프로덕션 정본은 MCP `pintel-design-system` 입니다.** 실제 화면·컴포넌트를 만들 때는 `plan_screen(intent)` → `get_component(id)`로 **정본 코드**를 받아 그대로 사용하고, 색 조합은 `check_contrast`로 검증하세요. DESIGN.md의 값을 보고 컴포넌트를 임의로 재작성하지 마세요(일관성·유지보수 저하). 두 소스는 경쟁이 아니라 보완 관계입니다.

## Overview

Pintel Design System은 핀텔 관제 시스템(PREVAX 4)의 다크 우선(dark-first) 인터페이스를 위한 토큰·컴포넌트 체계입니다. 정보 밀도가 높은 관제 화면에서 상태를 빠르게 판단하고 조작할 수 있도록, **Spacing**과 **Typography**를 가장 핵심적인 기반으로 두고 다른 모든 토큰·컴포넌트를 이 둘 위에 설계합니다.

토큰 단일 출처는 `src/data/tokens.js`이며, 화면(React 인라인 스타일)·MCP 서버·WPF(XAML) 포팅이 모두 이 모듈을 기준으로 삼습니다. 이 DESIGN.md는 그 토큰을 코딩 에이전트가 이해할 수 있는 형식으로 옮긴 것입니다.

## Colors

Primary는 오너 확정값 **#0066FF** 계열로 통일합니다(폐기값 #1751D9·#3471FF·#004DFF 금지).

- **Primary 3단계** — `primary`(#0066FF, 대표색·주요 버튼·활성 하이라이트) / `primaryStrong`(#3385FF, Hover) / `primaryHeavy`(#0052CC, Pressed).
- **Status** — 교통 신호 체계와 일치: `positive`(정상·연결됨) / `cautionary`(주의·대기·지연) / `error`(위험·장애·긴급).
- **Accent 11색** — 데이터 계열·범례·태그를 "구별"하기 위한 팔레트로 의미가 고정되지 않습니다.
- **Neutral 14단계** — 딥 배경(`neutral5`)부터 최상위 전경 텍스트(`neutral99`)까지의 명도 위계. 다크 표면·테두리·텍스트 대비를 이 스케일로 구성합니다.

## Typography

전 위계 **Pretendard GOV**를 사용하며 Display → Title → Heading → Headline → Body → Label → Caption 순으로 위계를 내립니다. 각 스타일은 `fontSize`·`lineHeight`·`letterSpacing`을 원본 그대로 보존합니다(예: Display 1 = 56/72, letter-spacing −0.0319em).

굵기(weight) 위계는 별도 스케일을 사용합니다: light 300(보조 설명) · regular 400(본문·입력·라벨) · medium 500(강조 라벨) · semibold 600(버튼·링크 등 인터랙티브 강조) · bold 700(카드 타이틀) · extrabold 800(페이지 타이틀).

한글 웹 텍스트는 어절 단위 자동 줄바꿈을 기본으로 합니다(`word-break: keep-all` + `overflow-wrap: break-word`). 강제 줄바꿈을 지정하지 않습니다.

## Spacing

레이아웃·문서 여백은 4/8pt 스케일(2·4·8·12·16·24·32·40·48·64px)을 사용합니다. 코드에서는 `SP[8]`처럼 접근합니다.

> ⚠️ 컴포넌트 prop 입력 여백은 별도의 SpacingMap 토큰(WPF Thickness 바인딩용, px와 비선형 — 예: '300'→24px, '250'→10px)을 쓰며, 위 Foundation 스케일과 수치를 혼용하지 않습니다. 그래서 SpacingMap은 이 front matter의 `spacing`에 포함하지 않았습니다.

## Rounded

`rounded`는 컴포넌트 코드에서 실제 사용된 반경을 정리한 것으로, 아직 `tokens.js`에 정식 토큰이 아닙니다(형식화 후보). 관례상 컨트롤=4px, 버튼·필터·패널=8px, 카드·팝오버·모달=12px, 대형 카드=16px을 사용하며, 관제 화면 프레임 등 일부는 10px 같은 일회성 값을 씁니다.

## Icons

Foundation 아이콘 세트는 `src/data/tokens.js`의 `ICONS` 배열과 렌더러 `src/components/icons.jsx`가 1:1로 대응합니다(20×20 그리드, 상태색 활성 #0066FF·주의 #FFA938·위험 #FF6363·비활성 #B1B1B2). 코드에서는 `<Icon name="search" size={20} />`로 사용합니다. 임의 SVG 대신 항상 이 세트를 사용하세요.

## Components

컴포넌트는 위 토큰을 참조(`{colors.*}`, `{typography.*}`, `{rounded.*}`)해 정의합니다. 정본 코드는 MCP `get_component(id)`로 제공되며(control-checkbox·filter-button-default·control-datepicker·table-default 등), 새 화면은 기존 Library 화면들과 시각적 일관성을 유지해야 합니다.

- **button-primary** — 브랜드색 배경 + 흰 텍스트, 반경 8px, 높이 34px. Hover는 `primaryStrong`, Pressed는 `primaryHeavy`로 전환.
- **filter-button** — 중립 배경의 트리거. 필터 적용 시(`filter-button-active`) 배경 rgba(0,102,255,0.1) + 텍스트 `primary`로 강조하고 적용 개수를 배지로 표시.
- **checkbox** — 선택 시 `primary` 채움 + 흰 체크마크, 반경 4px.
- **context-menu** — 커서 위치에 열리는 우클릭 메뉴(#1E2229 패널, 폭 216px). 대표 토글 동작(고정)은 최상단에 `cautionary` 강조(`context-menu-emphasis`)로 배치하고, 각 항목은 의미가 맞는 Foundation 아이콘 + 한국어 라벨로 구성합니다.
