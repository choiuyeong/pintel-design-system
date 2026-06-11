# PINTEL DESIGN SYSTEM

핀텔 관제 시스템(PREVAX 4)을 위한 디자인 시스템 문서 사이트입니다. 디자인 토큰 · 컴포넌트 · 실제 관제 화면 예시를 한곳에서 탐색할 수 있는 React + Vite 기반 웹 애플리케이션입니다.

## 개요

이 사이트는 디자인 토큰부터 실제 제품 화면까지의 위계를 4개의 탭으로 구성합니다.

| 탭 | 내용 |
|----|------|
| **Get Started** | 디자인 시스템 소개 및 시작 가이드 (3D 인터랙션 포함) |
| **Foundation** | 디자인 토큰 — Color, Typography, Icon, Spacing, Elevation, Motion |
| **Component** | 기본 컴포넌트 — Action area, Button, Chip, Text button 등 |
| **Service Domains** | 서비스 도메인별 패턴 |
| **Library** | 디자인 시스템만으로 재현한 실제 관제 화면 예시(Templates) |

## Library 화면 예시 (Templates)

디자인 토큰과 컴포넌트만으로 PREVAX 4 관제 콘솔 화면을 재현한 예시 모음입니다.

- **Login / Sign up** — 로그인 · 회원가입 화면
- **GIS Monitoring(CS)** — GIS 관제 콘솔 (지도 + 카메라 트리 + 선택 카메라 이벤트 패널 + 하단 실시간 이벤트 캐러셀)
- **Selective Monitoring(CS)** — 선별관제 모니터링
- **Live Video(CS)** — 실시간영상 (카메라 트리 + 영상 옵션 + 2×2 영상 그리드)
- **Settings(장비관리)** — 장비 관리 (분석기/카메라/외부 장비 목록)
- **Settings(이벤트 관리)** — 이벤트 정의 및 스케줄 관리
- **History(CS)** — 변경 이력
- **Statistics(CS)** — 통계

## 디자인 토큰

### Color

| 토큰 | 값 | 용도 |
|------|-----|------|
| `primary` | `#1751D9` | 기본 액션 |
| `primaryStrong` | `#3471FF` | hover |
| `primaryHeavy` | `#004DFF` | pressed |
| `positive` | `#1ED45A` | 긍정/성공 |
| `cautionary` | `#FFA938` | 경고 |
| `error` | `#FF6363` | 위험/오류 |

### Typography

- 서체: **Pretendard GOV**
- 굵기 위계: Light(300) · Regular(400) · Medium(500) · SemiBold(600) · Bold(700) · ExtraBold(800)
- 타이포 스타일 토큰 19종 (Display / Heading / Title / Body / Label / Caption) — `fontSize · lineHeight · letterSpacing` 정의

## 기술 스택

- **React** 19 + **Vite** 8 (JSX, TypeScript 미사용 — 인라인 스타일 기반)
- **Three.js** / `@react-three/fiber` · `drei` · `cannon` · `postprocessing` — Get Started 3D 인터랙션
- 디자인 토큰은 JS 객체(`T`, `W`, `TYPE`)로 관리

## 프로젝트 구조

```
pintel-design-system/
├── public/                 # 정적 에셋 (로고, 배너, 파비콘)
├── src/
│   ├── App.jsx             # 루트 — 탭 라우팅 + 레이아웃
│   ├── main.jsx            # 엔트리
│   ├── index.css           # 전역 스타일 · 커스텀 클래스
│   ├── components/
│   │   ├── Header.jsx       # 상단 탭 네비게이션
│   │   ├── Sidebar.jsx      # 좌측 카테고리 트리
│   │   ├── GetStarted.jsx   # Get Started 페이지
│   │   ├── ComponentDoc.jsx # Foundation/Component/Service 문서 렌더러
│   │   ├── Library.jsx      # Library 탭 — 화면 예시(Templates)
│   │   ├── InteractiveClump3D.jsx # 3D 인터랙션
│   │   └── icons.jsx        # 아이콘 정의 + Icon 컴포넌트
│   └── data/
│       └── components.js    # TIERS — 탭/카테고리/항목 트리 구조
├── mcp/                    # MCP 서버 (디자인 시스템 조회)
├── wpf/                    # DevExpress WPF 포팅 작업
├── index.html
├── package.json
└── vite.config (Vite 8)
```

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 화면 예시 추가 방법

Library 탭에 새 화면을 추가하려면:

1. **`src/components/Library.jsx`**
   - 화면 컴포넌트 작성 (예: `PrevaxXxxScreen`)
   - `EXAMPLES` 레지스트리에 항목 등록
     ```js
     'library-xxx': {
       title: 'Xxx(CS)',
       description: '...',
       uses: ['Tab', 'Tree/List', ...],
       render: () => <PrevaxXxxScreen />,
     }
     ```

2. **`src/data/components.js`**
   - `library` TIER의 `library-templates` 그룹에 항목 추가
     ```js
     { id: 'tpl-xxx', name: 'Xxx(CS)',
       children: [{ id: 'library-xxx', name: 'Xxx(CS)' }] }
     ```

> 화면 전환 시 컴포넌트 상태 초기화가 필요하면 `key={componentId}` + `display: contents` 래퍼 패턴을 사용합니다.

## 컨벤션

- **인라인 스타일** 기반 (CSS-in-JS 라이브러리 미사용). 공통 인터랙션·애니메이션만 `index.css`에 클래스로 정의
- 색상·타이포·굵기는 항상 토큰(`T`, `TYPE`, `W`)을 통해 사용 — 하드코딩 지양
- 텍스트는 한국어 기준
