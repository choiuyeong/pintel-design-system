/**
 * 핀텔 디자인 시스템 — Library 화면 예시(Templates) 메타데이터
 *
 * Library 탭의 각 화면 예시는 JSX 렌더 함수(Library.jsx)로 구현되지만,
 * 그 "문서 메타데이터"(제목·설명·구성 컴포넌트)는 여기 순수 데이터로 둡니다.
 * → Library.jsx(렌더)와 MCP 서버(문서 노출)가 동일 출처를 공유합니다.
 */
export const LIBRARY_TEMPLATES = {
  'library-dashboard': {
    title: '대시보드',
    description: 'PREVAX 4.1 신규 대시보드 탭을 디자인 시스템 토큰으로 재현한 예시입니다. A-2(CCTV 접속정보 + 당일 이벤트 현황)와 A-3(지표 위젯)을 반영하며, KPI 위젯 4종·최근 이벤트 피드·카메라별 이벤트 바·이벤트 유형 통계·시스템 현황 바로 구성됩니다. 요약 읽기만 제공하고 상세는 드릴다운으로 연결됩니다.',
    uses: ['Tab', 'KPI Widget', 'Data table', 'Status Color', 'Content badge', 'Progress bar'],
  },
  'library-signup': {
    title: '회원가입',
    description: '관리자(상위 권한)가 사용자 계정을 생성하는 화면입니다. 로그인과 동일한 Text field · Checkbox · Button · Text button 컴포넌트와 Typography 토큰으로 구성하며, 이메일 형식·비밀번호 길이·비밀번호 확인 일치 검증과 필수 약관 동의를 포함합니다. (자가 회원가입 흐름은 없음)',
    uses: ['Text field', 'Checkbox', 'Button (Primary Solid)', 'Text button'],
  },
  'library-login': {
    title: '로그인',
    description: '디자인 시스템의 Text field · Checkbox · Button · Text button 컴포넌트와 Color/Typography 토큰만으로 구성한 로그인 화면 예시입니다.',
    uses: ['Text field', 'Checkbox', 'Button (Primary Solid)', 'Text button'],
  },
  'library-selective': {
    title: '선별관제 모니터링',
    description: 'PREVAX 4 선별관제 모니터링 화면을 디자인 시스템 토큰으로 재현한 예시입니다. 기존 화면과 동일한 타이틀바·탭 크롬을 공유하며, 좌측 검색 조건 패널(등급·이벤트 드롭다운, 조치 여부 체크박스, 초기화/일괄처리, 최근 이벤트 리스트)과 우측 위험도 3밴드(위험·경고·주의)로 구성됩니다. 각 밴드는 상태 색상 사이드바·이벤트 유형 칩 헤더·이벤트 카드 영역을 가집니다.',
    uses: ['Tab', 'Dropdown', 'Check ON/OFF', 'Content badge', 'Status Color', 'Button'],
  },
  'library-unassigned': {
    title: '선별관제 — 미배치 채널 실시간 확인 (F-2)',
    description: 'PREVAX 4 선별관제의 "미배치 채널 실시간 확인(F-2)" 전용 뷰를 디자인 시스템 토큰으로 재현한 예시입니다. 그룹에 배치되지 않은(group_camera_info 미부여) 카메라를 실시간 영상 + 연결상태로 모아 보는 별도 점검 창으로, 실시간영상 좌측 장비 패널 하단 [미배치 확인] 버튼으로 열립니다(메인 관제 그리드와 별개 창, 읽기 전용). 별도 창 크롬(타이틀바 + 명칭·새로고침·닫기 헤더) + 인지 보장 요약(미배치 N대·미처리 이벤트 M건) + 4열 카메라 그리드 + 하단 페이지 바로 구성됩니다. 각 셀은 영상(정상=실제 스트림 맥락 / 오류·응답없음·스트림없음=실제 상태 화면) + 하단 정보 바(카메라명·번호 + 연결상태 칩) + [배치하기] 버튼을 가집니다. 연결상태 4종은 색+아이콘+글자로 병기해 색만으로 가르지 않으며(정상=positive·오류=error·응답없음=cautionary·스트림없음=neutral), 신규·방치 카메라(스트림 미설정·연결 오류)는 숨기지 않고 테두리·글로우로 강조합니다. 빈 상태(미배치 0건)도 포함합니다.',
    uses: ['Status Color', 'Content badge', 'Button', 'Video grid', 'Pagination', 'Typography tokens'],
  },
  'library-selective-away': {
    title: '선별관제 — 자리비움 수신자',
    description: 'PREVAX 4 선별관제의 "자리비움 대리 수신" 화면 예시입니다. 특정 관제사(김서연)가 자리를 비우면, 그 담당 이벤트를 대리 수신자(박민지)가 대신 처리합니다. 선별관제 크롬(타이틀바·탭)을 공유하며, 상단에 부재 대리 수신 안내 배너(부재 대신 미조치 건수 pill), 좌측 장비·영역 트리, 우측 위험/경고/주의 3밴드에 이벤트 카드(시간 배지·썸네일·검지 박스·이벤트명·위치·시각·정탐/오탐 버튼)를 배치합니다. 부재 관제사에게서 넘어온 이벤트에는 "대신 받음 · 김서연 부재" Primary 배지를 표기합니다.',
    uses: ['Tab', 'Tree/List', 'Status Color', 'Content badge', 'Button', 'Card'],
  },
  'library-live': {
    title: '실시간 영상',
    description: 'PREVAX 4 실시간영상 화면을 디자인 시스템 토큰으로 재현한 예시입니다. 기존 화면과 동일한 타이틀바·탭 크롬을 공유하며, 좌측 지역정보/카메라 트리 패널, 상단 영상 옵션 툴바(Switch 토글·드롭다운), 2×2 영상 그리드(카메라 명·PTZ·연결중 상태·타임스탬프), 하단 페이지·화면 분할(4/9/16) 바로 구성됩니다.',
    uses: ['Tab', 'Tree/List', 'Switch', 'Toolbar', 'Video grid', 'Pagination'],
  },
  'library-live-focus': {
    title: '실시간 영상 — Focus(고정)',
    description: 'PREVAX 4 실시간영상 화면의 F-8 "고정 집중" 변형을 디자인 시스템 토큰으로 재현한 인터랙티브 예시입니다. 실시간영상 크롬(타이틀바·탭·좌 지역 트리·영상 옵션 툴바·영상 그리드·하단 순환 바)을 공유하며, 관제사가 특정 카메라를 "고정(핀)"하면 자동 순환 중에도 그 칸은 유지됩니다. 고정 표시는 cautionary(#FFA938) 핀 배지 + 2px 테두리로 하고, 비고정 셀은 마우스를 올리면 "고정" 칩이 나타나 클릭으로 토글됩니다(정본 상호작용). 모든 칸을 고정하면 순환이 멈추고 격자 상단에 반투명 안내 띠("모든 칸을 고정하여 자동 순환이 멈춰 있습니다")가 뜨며, 고정 0개면 일반 실시간영상과 동일(무변화)합니다. 고정은 화면 표시/레이아웃만 바꾸고 검지·순환 엔진은 건드리지 않습니다.',
    uses: ['Tab', 'Tree/List', 'Switch', 'Toolbar', 'Video grid', 'Status Color', 'Content badge', 'Typography tokens'],
  },
  'library-event-popup': {
    title: '이벤트 자동 팝업 — 발생영상 자동 추출 (D-3)',
    description: 'PREVAX 4 라이브 검지 순간 뜨는 이벤트 자동 팝업(ShowEventPopup)이 발생영상(비디오 클립)을 베스트에포트로 자동 추출하는 흐름을 디자인 시스템 토큰으로 재현한 예시입니다. 4컷 라이프사이클: ① 팝업 등장(스냅샷 즉시 표시 + BBox·이벤트명·카메라명, 우하단 "영상 준비 중" 미세 표시) ② 영상 전환(같은 자리에서 스냅샷→발생영상 in-place 전환·1회 재생, 하단에 조작 불가 발생시점 인지 오버레이 — 전·발생 구간(band)·후) ③ 폴백(video_path NULL/미도착 시 스냅샷만 유지) ④ 정리(지속시간 만료 시 디코더 Stop+Dispose 명시 정리). 팝업 패널은 정본 Popup 토큰(배경 #1a1a1a·보더 #2e2e2e·radius 8), 이벤트 등급색은 위험(native) 계열, 재생 표시는 positive를 사용합니다. 조작 컨트롤은 미노출(SetPlaybackOnly)이며 비모달 자동 알림이라 딤·모달·확인 버튼은 두지 않습니다.',
    uses: ['Popover', 'Status Color', 'Content badge', 'Progress indicator', 'Loading', 'Typography tokens'],
  },
  'library-event-popup-live': {
    title: '이벤트 자동 팝업 — 화면 표시 (D-3)',
    description: '이벤트 자동 팝업(D-3, ShowEventPopup)이 실시간 영상 기본 화면 위에 실제로 뜬 한 장면입니다. 라이브 검지 순간 발생영상(비디오 클립)을 자동 추출해 같은 자리에서 재생하는 팝업이 비모달(딤·모달 없음)로 등장한 상태를 보여줍니다. 배경은 실시간 영상 기본 화면(타이틀바·탭·좌 지역 트리·영상 그리드), 그 위에 이벤트 자동 팝업(상단 정보 바: 상태·카메라명 / 미디어: BBox·발생시점 / 푸터: Progress indicator 재생·발생 마커)이 얹혀 있습니다. 팝업 자체의 4컷 라이프사이클(등장·전환·폴백·정리)은 별도 페이지 "이벤트 자동 팝업 — 발생영상 자동 추출"을 참고하세요.',
    uses: ['Popover', 'Status Color', 'Progress indicator', 'Video grid', 'Typography tokens'],
  },
  'library-gis-monitor': {
    title: 'GIS 관제',
    description: 'PREVAX 4 GIS 관제 콘솔을 디자인 시스템 토큰으로 재현한 예시입니다. 타이틀바·경고 배너·탭 네비게이션·카메라 리스트 트리·라이트 GIS 맵·맵 오버레이 컨트롤로 구성되며, 좌측 카메라를 선택하면 이벤트 패널이 열립니다.',
    uses: ['Tab', 'Tree/List', 'Status Color', 'Map overlay', 'Content badge'],
  },
  'library-settings': {
    title: '장비 관리',
    description: 'PREVAX 4 설정(장비 관리) 화면을 디자인 시스템 토큰으로 재현한 예시입니다. GIS 화면과 동일한 타이틀바·탭 크롬을 공유하며, 설정 네비·분석기 목록·카메라 목록·외부 장비 등 데이터 밀집 패널과 툴바로 구성됩니다.',
    uses: ['Tab', 'Data table', 'Toolbar', 'Tree/List', 'Status Color'],
  },
  'library-events': {
    title: '이벤트 관리',
    description: 'PREVAX 4 설정 > 이벤트 관리 화면을 디자인 시스템 토큰으로 재현한 예시입니다. Settings(CS)와 동일한 타이틀바·탭·설정 네비 크롬을 공유하며(이벤트 관리 선택 상태), 이벤트 목록 관리 표(이벤트 명·유형·대상 카메라·사용유무·알림 ON/OFF·스케줄·민감도·등록일자·운영 상태)와 검색/추가/수정/삭제 툴바로 구성됩니다.',
    uses: ['Tab', 'Data table', 'Toolbar', 'Check ON/OFF', 'Status Color'],
  },
  'library-alarm-settings': {
    title: '알림 설정',
    description: 'PREVAX 4 설정 > 환경 설정 > 알림 설정 화면을 디자인 시스템 토큰으로 재현한 예시입니다. 특히 "실시간 이벤트 알림"을 체크했을 때 우하단에 실시간 이벤트 알림 창이 뜬 상태를 담습니다. 기존 Settings 크롬(타이틀바·경고 배너·탭·설정 네비)을 공유하며, 알람 설정 카드(이벤트 발생시 알람 소리 · 알람 팝업[시작/종료 시간·팝업 유지 시간] · 실시간 이벤트 알림[유지 시간·최대 이벤트 개수·이벤트 알림 열기] 체크박스와 시간/개수 입력)와 하단 적용 버튼으로 구성됩니다. 실시간 이벤트 알림 팝업은 창 타이틀바·경고 배너(비활성 카메라)·위험/경고/주의 필터 칩(Status Color)·이벤트 피드(유형·카메라·미열람·경과 시간)로 이루어집니다.',
    uses: ['Tab', 'Checkbox', 'Select', 'Text field', 'Button', 'Status Color', 'Content badge', 'Typography tokens'],
  },
  'library-history': {
    title: '이력 조회',
    description: 'PREVAX 4 이력조회(시스템 변경 이력) 화면을 디자인 시스템 토큰으로 재현한 예시입니다. Settings 화면과 동일한 타이틀바·탭 크롬을 공유하며, 서브 네비·필터 바·변경 이력 테이블과 상세 작업 내용(속성/이전/현재) 속성 그리드의 마스터-디테일 구성으로 이루어집니다. 변경 구분(추가/수정/삭제)은 Color.Status 토큰 배지+기호로 표시됩니다.',
    uses: ['Tab', 'Data table', 'Filter bar', 'Property grid', 'Toolbar'],
  },
  'library-stats': {
    title: '통계 보고서',
    description: 'PREVAX 4 통계보고서 화면을 디자인 시스템 토큰으로 재현한 예시입니다. 좌측 검색 조건 패널(이벤트/교통량/통행량 탭, 집계 단위 라디오, 빠른 기간·일시 선택, 이벤트 유형 체크박스, 장비 트리)과 우측 리포트 뷰어(아이콘 툴바·빈 캔버스·페이지/줌 바)로 구성되며, 기존 화면과 동일한 크롬·토큰·트리·버튼 위계를 공유합니다.',
    uses: ['Tab', 'Radio', 'Checkbox', 'Tree/List', 'Toolbar', 'Button'],
  },
  'library-ux-agent': {
    title: 'UX Agent 활용성 리뷰',
    description: '헤르메스 에이전트 기반 UX 자동화 실증 분석 보고서 (3장). 추진 배경·시장 현황·아키텍처 분석·PREVAX 4 실증 사례·핵심 인사이트·제언으로 구성됩니다.',
    uses: ['Typography tokens', 'Color tokens', 'Grid layout', 'Data table', 'Callout'],
  },
  'library-event-search': {
    title: '이벤트 조회',
    description: 'PREVAX 4 이벤트조회 화면을 디자인 시스템 토큰으로 재현한 예시입니다. 기존 화면과 동일한 타이틀바·탭 크롬을 공유하며, 좌측 검색 조건 패널(시간 프리셋·일시 범위·이벤트 체크박스·장비 트리·객체 종류 버튼·이벤트 판정), 가운데 썸네일 결과 그리드(객체 검출 박스·시각 오버레이·격자/목록 토글·페이지네이션), 우측 상세정보 패널(캡처 이미지·메타 정보·조치내역·정탐/오탐 판정·저장)로 구성됩니다.',
    uses: ['Tree/List', 'Checkbox', 'Button', 'Thumbnail grid', 'Content badge', 'Pagination', 'Text field'],
  },
  'library-camera-form': {
    title: '카메라 정보 관리',
    description: 'PREVAX 4 설정 > 장비 관리 > 카메라 목록 > 추가/수정 모달(카메라 정보 관리 폼)을 디자인 시스템 토큰으로 재현한 예시입니다. 기존 Settings 크롬(타이틀바·탭·설정 네비·카메라 목록 그리드)을 흐리게 깐 배경 위에 중앙 모달을 띄우며, 좌측 입력열(분석기/프로토콜 비활성 · 식별/위치 군집[카메라번호·카메라명·제조사·주소] · 연결/인증 블록[IP·포트·아이디·비밀번호·인증방식] · 고유ID/사용여부/PTZ/패키지/디코더/RTSP/기능옵션)과 우측 스트림 1·2(하나는 필수 검증문구)·분석기스트림·HLS 1·2·VMS 블록, 하단 적용/닫기 액션으로 구성됩니다.',
    uses: ['Modal', 'Text field', 'Select', 'Button', 'Status Color', 'Typography tokens'],
  },
  'library-camera-form2': {
    title: '카메라 정보 관리 (탭형)',
    description: '카메라 정보 관리 폼의 대안 구성안(탭 분리)입니다. PrevaxCameraFormScreen(권고 A 단일 스크롤)과 동일한 필드·토큰·다크 룩을 쓰되, 긴 좌측 단일 스크롤을 기본정보 · 연결·인증 · 스트림 3개 탭으로 분리해 한 탭이 한 화면에 들어오도록 모달 폭을 720px로 좁혔습니다. 모달 타이틀 아래 탭바(활성 탭 Primary 밑줄, PrevaxTabBar 룩 차용)로 내용만 전환하며, 하단 적용/닫기는 공통 고정입니다. 권한 설정의 2번 변형과 같은 "기존 화면의 대안 구성" 패턴입니다.',
    uses: ['Modal', 'Tab', 'Text field', 'Select', 'Button', 'Status Color', 'Typography tokens'],
  },
  'library-event-def-add': {
    title: '이벤트 정의 추가',
    description: 'PREVAX 4 설정 > 이벤트 정의 > 추가 모달(이벤트정의 추가 다이얼로그)을 디자인 시스템 토큰으로 재현한 예시입니다. 설정(이벤트 정의 목록 그리드)을 흐리게 깐 배경 위에 중앙 모달을 띄우며, 카메라 정보 관리 모달과 동일한 다크 팔레트·컨트롤 규격을 공유합니다. 라벨(좌 우정렬, 필수 항목 빨강 *) / 컨트롤(우) 2열 폼으로 이벤트 종류 · 이벤트 설명 소제목 · 이벤트 명 · 객체 종류 · 알람 방식(드롭다운 열린 상태로 표시) · 알람 등급 · 알람 종류 · 스냅샷/비디오 저장 여부 · 패키지 목록 · 이벤트 ROI 색을 구성하고, 하단 우측에 확인(Primary)/취소(Secondary) 버튼을 둡니다. 닫기 X와 드롭다운 화살표는 Foundation 아이콘(cancel · arrow_drop_down)을 사용합니다.',
    uses: ['Modal', 'Select', 'Text field', 'Button', 'Status Color', 'Typography tokens'],
  },
  'library-camera-group': {
    title: '카메라 그룹 관리',
    description: 'PREVAX 4 설정 > 카메라 그룹 관리(H-1) 화면을 디자인 시스템 토큰으로 재현한 단일 인터랙티브 예시입니다. 시안의 여러 정적 컷(기본·빈 상태·다수·F-2 직진입) 대신, 실제로 동작하는 한 페이지로 구현했습니다. 기존 Settings 크롬(타이틀바·탭·설정 네비, "카메라 그룹 관리"는 신규 1급)을 공유하며, 좌측(그룹 목록 + 인라인 추가/이름수정/삭제 + 선택 그룹에 담긴 카메라), 가운데(← 그룹에 담기 · 그룹에서 빼기 →, 화살표=실제 데이터 이동 방향), 우측(전체 카메라 목록 + 소속 그룹 1급 컬럼 + 담김/소속/미배치 배치 상태)로 구성됩니다. 그룹·카메라 검색 즉시필터, 다중 선택 셔틀, 그룹명 빈값/중복/128자 검증, dirty(저장 안 됨/저장됨), "외 n" 소속 그룹 호버 툴팁이 실제로 작동합니다.',
    uses: ['Tab', 'Tree/List', 'Text field', 'Button', 'Checkbox', 'Status Color', 'Content badge', 'Typography tokens'],
  },
  'library-event-activation': {
    title: '이벤트 활성화 관리',
    description: 'PREVAX 4 영상 화면 설정 > "이벤트 활성화" 진입 시 열리는 이벤트 활성화 관리(VideoEventsManagement) 독립 창을 디자인 시스템 토큰으로 재현한 단일 인터랙티브 예시입니다. 시안의 여러 정적 컷(기본·툴팁·가로 스크롤·빈/검색0건) 대신 동작하는 한 페이지로 구현했습니다. 헤더는 제목줄(선택방법 ? 툴팁) / 동작줄([검색 그룹: 카메라명·번호 검색 + 비활성만 보기 토글 + 상태 칩] · [선택: 전체 해제] · [적용: 활성화=Primary · 비활성화=danger]를 세로 구분선으로 분리, 적용 그룹은 우측 연한 Primary 박스로 부각) / 상태·안내줄(전 ROI 일괄 상시 안내 + 셀 4상태 범례 상시)로 재편됩니다. 좌측은 지역 4계층 트리(들여쓰기 12/28/44/60px, 말단 섹션만 카메라 체크 단위 → 상위노드 체크박스 opacity .45, 섹션 카운트 [n]), 우측은 카메라×이벤트 매트릭스로 체크·카메라번호·카메라명 3칼럼을 position:sticky로 frozen 고정(카메라명 우측 경계 그림자)하고 동적 이벤트 칼럼(MinWidth 138)이 가로 스크롤됩니다. 셀은 색점(8px)+전경색만으로 전체 활성화(positive)/일부 비활성화 (n/m)(cautionary)/전체 비활성화(native)/−(설정없음, 회색 점선)의 4상태를 한 줄(nowrap)+말줄임+툴팁으로 표시하며, 선택 셀은 배경 파랑과 전경 상태색이 공존합니다. 검색·비활성만 필터로 행 0건이 되면 그리드 위 검색 0건 오버레이(pointer-events:none)가 뜹니다.',
    uses: ['Tree/List', 'Data table', 'Checkbox', 'Text field', 'Button', 'Status Color', 'Content badge', 'Typography tokens'],
  },
  'library-permission2': {
    title: '권한 설정 (개발 경계 표기)',
    description: '권한 설정 화면에 DevExpress 적용 경계를 영역별로 표기한 개발 인계용 변형입니다. 토큰 직접 적용(적용/녹색)·DevExpress 컨트롤 근사(근사/황색)·테마 DLL·크롬 제외(제외/적색)를 점선 테두리 + 코너 태그 + 범례로 시각화합니다. 좌측 설정 네비·헤더·범례는 적용, 매트릭스(GridControl)·체크박스(CheckEdit)·버튼(SimpleButton)은 근사, 타이틀바·탭 크롬은 제외로 구분됩니다.',
    uses: ['Status Color', 'Data table', 'Checkbox', 'Button', 'Typography tokens', 'Tree/List'],
  },
  'library-permission': {
    title: '권한 설정',
    description: 'PREVAX 4 설정 > 권한 설정 화면을 디자인 시스템 토큰으로 재현한 예시입니다. 기존 Settings 크롬(타이틀바·탭·설정 네비)을 공유하며, 권한 설정이 기존 모달 방식에서 설정 탭 1층 인라인 페이지로 전환된 설계(permission-settings-inline.md)를 반영합니다. 등급별(사용자·관리자·상위관리자) 메뉴 접근 권한을 체크박스 매트릭스로 구성하며, 계층 트리 구조(깊이 0~2)와 변경 감지·저장/취소 인터랙션을 포함합니다.',
    uses: ['Checkbox', 'Data table', 'Tree/List', 'Button', 'Status Color', 'Typography tokens'],
  },
};
