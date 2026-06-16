/**
 * 핀텔 디자인 시스템 — Library 화면 예시(Templates) 메타데이터
 *
 * Library 탭의 각 화면 예시는 JSX 렌더 함수(Library.jsx)로 구현되지만,
 * 그 "문서 메타데이터"(제목·설명·구성 컴포넌트)는 여기 순수 데이터로 둡니다.
 * → Library.jsx(렌더)와 MCP 서버(문서 노출)가 동일 출처를 공유합니다.
 */
export const LIBRARY_TEMPLATES = {
  'library-dashboard': {
    title: 'Dashboard(CS)',
    description: 'PREVAX 4.1 신규 대시보드 탭을 디자인 시스템 토큰으로 재현한 예시입니다. A-2(CCTV 접속정보 + 당일 이벤트 현황)와 A-3(지표 위젯)을 반영하며, KPI 위젯 4종·최근 이벤트 피드·카메라별 이벤트 바·이벤트 유형 통계·시스템 현황 바로 구성됩니다. 요약 읽기만 제공하고 상세는 드릴다운으로 연결됩니다.',
    uses: ['Tab', 'KPI Widget', 'Data table', 'Status Color', 'Content badge', 'Progress bar'],
  },
  'library-signup': {
    title: 'Sign up',
    description: '로그인과 동일한 Text field · Checkbox · Button · Text button 컴포넌트와 Typography 토큰으로 구성한 회원가입 화면입니다. 이메일 형식·비밀번호 길이·비밀번호 확인 일치 검증과 필수 약관 동의를 포함합니다.',
    uses: ['Text field', 'Checkbox', 'Button (Primary Solid)', 'Text button'],
  },
  'library-login': {
    title: 'Login',
    description: '디자인 시스템의 Text field · Checkbox · Button · Text button 컴포넌트와 Color/Typography 토큰만으로 구성한 로그인 화면 예시입니다.',
    uses: ['Text field', 'Checkbox', 'Button (Primary Solid)', 'Text button'],
  },
  'library-selective': {
    title: 'Selective Monitoring(CS)',
    description: 'PREVAX 4 선별관제 모니터링 화면을 디자인 시스템 토큰으로 재현한 예시입니다. 기존 화면과 동일한 타이틀바·탭 크롬을 공유하며, 좌측 검색 조건 패널(등급·이벤트 드롭다운, 조치 여부 체크박스, 초기화/일괄처리, 최근 이벤트 리스트)과 우측 위험도 3밴드(위험·경고·주의)로 구성됩니다. 각 밴드는 상태 색상 사이드바·이벤트 유형 칩 헤더·이벤트 카드 영역을 가집니다.',
    uses: ['Tab', 'Dropdown', 'Check ON/OFF', 'Content badge', 'Status Color', 'Button'],
  },
  'library-live': {
    title: 'Live Video(CS)',
    description: 'PREVAX 4 실시간영상 화면을 디자인 시스템 토큰으로 재현한 예시입니다. 기존 화면과 동일한 타이틀바·탭 크롬을 공유하며, 좌측 지역정보/카메라 트리 패널, 상단 영상 옵션 툴바(Switch 토글·드롭다운), 2×2 영상 그리드(카메라 명·PTZ·연결중 상태·타임스탬프), 하단 페이지·화면 분할(4/9/16) 바로 구성됩니다.',
    uses: ['Tab', 'Tree/List', 'Switch', 'Toolbar', 'Video grid', 'Pagination'],
  },
  'library-gis-monitor': {
    title: 'GIS Monitoring(CS)',
    description: 'PREVAX 4 GIS 관제 콘솔을 디자인 시스템 토큰으로 재현한 예시입니다. 타이틀바·경고 배너·탭 네비게이션·카메라 리스트 트리·라이트 GIS 맵·맵 오버레이 컨트롤로 구성되며, 좌측 카메라를 선택하면 이벤트 패널이 열립니다.',
    uses: ['Tab', 'Tree/List', 'Status Color', 'Map overlay', 'Content badge'],
  },
  'library-settings': {
    title: 'Settings(장비관리)',
    description: 'PREVAX 4 설정(장비 관리) 화면을 디자인 시스템 토큰으로 재현한 예시입니다. GIS 화면과 동일한 타이틀바·탭 크롬을 공유하며, 설정 네비·분석기 목록·카메라 목록·외부 장비 등 데이터 밀집 패널과 툴바로 구성됩니다.',
    uses: ['Tab', 'Data table', 'Toolbar', 'Tree/List', 'Status Color'],
  },
  'library-events': {
    title: 'Settings(이벤트 관리)',
    description: 'PREVAX 4 설정 > 이벤트 관리 화면을 디자인 시스템 토큰으로 재현한 예시입니다. Settings(CS)와 동일한 타이틀바·탭·설정 네비 크롬을 공유하며(이벤트 관리 선택 상태), 이벤트 목록 관리 표(이벤트 명·유형·대상 카메라·사용유무·알림 ON/OFF·스케줄·민감도·등록일자·운영 상태)와 검색/추가/수정/삭제 툴바로 구성됩니다.',
    uses: ['Tab', 'Data table', 'Toolbar', 'Check ON/OFF', 'Status Color'],
  },
  'library-history': {
    title: 'History(CS)',
    description: 'PREVAX 4 이력조회(시스템 변경 이력) 화면을 디자인 시스템 토큰으로 재현한 예시입니다. Settings 화면과 동일한 타이틀바·탭 크롬을 공유하며, 서브 네비·필터 바·변경 이력 테이블과 상세 작업 내용(속성/이전/현재) 속성 그리드의 마스터-디테일 구성으로 이루어집니다. 변경 구분(추가/수정/삭제)은 Color.Status 토큰 배지+기호로 표시됩니다.',
    uses: ['Tab', 'Data table', 'Filter bar', 'Property grid', 'Toolbar'],
  },
  'library-stats': {
    title: 'Statistics(CS)',
    description: 'PREVAX 4 통계보고서 화면을 디자인 시스템 토큰으로 재현한 예시입니다. 좌측 검색 조건 패널(이벤트/교통량/통행량 탭, 집계 단위 라디오, 빠른 기간·일시 선택, 이벤트 유형 체크박스, 장비 트리)과 우측 리포트 뷰어(아이콘 툴바·빈 캔버스·페이지/줌 바)로 구성되며, 기존 화면과 동일한 크롬·토큰·트리·버튼 위계를 공유합니다.',
    uses: ['Tab', 'Radio', 'Checkbox', 'Tree/List', 'Toolbar', 'Button'],
  },
  'library-ux-agent': {
    title: 'UX Agent 활용성 리뷰',
    description: '헤르메스 에이전트 기반 UX 자동화 실증 분석 보고서 (3장). 추진 배경·시장 현황·아키텍처 분석·PREVAX 4 실증 사례·핵심 인사이트·제언으로 구성됩니다.',
    uses: ['Typography tokens', 'Color tokens', 'Grid layout', 'Data table', 'Callout'],
  },
  'library-event-search': {
    title: 'Event Search(CS)',
    description: 'PREVAX 4 이벤트조회 화면을 디자인 시스템 토큰으로 재현한 예시입니다. 기존 화면과 동일한 타이틀바·탭 크롬을 공유하며, 좌측 검색 조건 패널(시간 프리셋·일시 범위·이벤트 체크박스·장비 트리·객체 종류 버튼·이벤트 판정), 가운데 썸네일 결과 그리드(객체 검출 박스·시각 오버레이·격자/목록 토글·페이지네이션), 우측 상세정보 패널(캡처 이미지·메타 정보·조치내역·정탐/오탐 판정·저장)로 구성됩니다.',
    uses: ['Tree/List', 'Checkbox', 'Button', 'Thumbnail grid', 'Content badge', 'Pagination', 'Text field'],
  },
  'library-permission': {
    title: 'Settings(권한 설정)',
    description: 'PREVAX 4 설정 > 권한 설정 화면을 디자인 시스템 토큰으로 재현한 예시입니다. 기존 Settings 크롬(타이틀바·탭·설정 네비)을 공유하며, 권한 설정이 기존 모달 방식에서 설정 탭 1층 인라인 페이지로 전환된 설계(permission-settings-inline.md)를 반영합니다. 등급별(사용자·관리자·상위관리자) 메뉴 접근 권한을 체크박스 매트릭스로 구성하며, 계층 트리 구조(깊이 0~2)와 변경 감지·저장/취소 인터랙션을 포함합니다.',
    uses: ['Checkbox', 'Data table', 'Tree/List', 'Button', 'Status Color', 'Typography tokens'],
  },
};
