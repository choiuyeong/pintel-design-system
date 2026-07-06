/**
 * Pintel Design System — 디자인 토큰 단일 출처 (Single Source of Truth)
 * ─────────────────────────────────────────────────────────────────────────
 * color / spacing / typography(+weight) 토큰을 한 곳에서 정의합니다.
 * 화면(Library.jsx · PermissionSettings.jsx)·MCP(mcp/tools.mjs)·WPF 포팅이
 * 모두 이 모듈을 기준으로 삼습니다.
 *
 * 핵심 기반(Foundation):
 *   - SPACING        : 여백·간격·패딩의 4/8pt 스케일. 모든 레이아웃의 기준.
 *   - TYPOGRAPHY     : Typography.Style 19종. 모든 텍스트 위계의 기준.
 * 이 두 토큰이 디자인 시스템의 가장 핵심적인 기반이며, 다른 모든 토큰/컴포넌트는
 * 이 두 토큰을 기준으로 설계됩니다.
 *
 * 각 토큰은 값(value)뿐 아니라 코드 키(key) · xamlKey(WPF) · role(의미)을 병기합니다.
 *
 * 사용 단축 객체(화면 인라인 스타일용): T · TYPE · W · SP · PALETTE_DARK · PALETTE_LIGHT
 *  - T    : 시맨틱 색상(primary/positive/cautionary/error + font)
 *  - TYPE : Typography.Style 19종 ({fontSize, lineHeight, letterSpacing})
 *  - W    : font-weight 위계
 *  - SP   : Spacing 스케일(4/8pt) — '2px' 등 CSS 문자열
 */

// ─────────────────────────────────────────────────────────────────────────
// COLOR (Foundation > Color)
//  Primary 정답값은 #0066FF (오너 확정). 모든 출처를 #0066FF 계열로 통일.
// ─────────────────────────────────────────────────────────────────────────

// 브랜드(Primary) 3단계 — Normal / Strong(hover) / Heavy(pressed)
export const COLOR_PRIMARY = [
  { key: 'primary',       value: '#0066FF', xamlKey: 'Pintel.Color.Primary',       variable: '--pintel-color-primary',        role: '브랜드 대표색, 주요 버튼 및 활성 상태 하이라이트' },
  { key: 'primaryStrong', value: '#3385FF', xamlKey: 'Pintel.Color.PrimaryStrong', variable: '--pintel-color-primary-strong', role: '호버(Hover) 또는 강조가 필요한 텍스트/아이콘' },
  { key: 'primaryHeavy',  value: '#0052CC', xamlKey: 'Pintel.Color.PrimaryHeavy',  variable: '--pintel-color-primary-heavy',  role: '클릭(Active) 또는 배경과의 높은 대비가 필요한 요소' },
];

// 상태(Status) — 교통 신호 체계와 일치
export const COLOR_STATUS = [
  { key: 'positive',   value: '#1ED45A', xamlKey: 'Pintel.Color.Positive',   variable: '--pintel-color-positive',   role: '성공, 안전, 연결됨, 정상 작동 상태' },
  { key: 'cautionary', value: '#FFA938', xamlKey: 'Pintel.Color.Cautionary', variable: '--pintel-color-cautionary', role: '주의, 대기, 데이터 지연, 이상 징후' },
  { key: 'error',      value: '#FF6363', xamlKey: 'Pintel.Color.Native',     variable: '--pintel-color-native',     role: '위험, 장애, 사고 발생, 긴급 조치 필요' },
];

// 강조(Accent) 11색 — 데이터 계열·범례·태그 "구별"용 (의미 고정 아님)
export const COLOR_ACCENT = [
  { key: 'accentRed',       value: '#FF5C5C', xamlKey: 'Pintel.Color.AccentRed',       variable: '--pintel-color-accent-red',        role: '전경 강조 — 빨강' },
  { key: 'accentRedOrange', value: '#FF7847', xamlKey: 'Pintel.Color.AccentRedOrange', variable: '--pintel-color-accent-red-orange', role: '전경 강조 — 레드 오렌지' },
  { key: 'accentOrange',    value: '#FF9F2E', xamlKey: 'Pintel.Color.AccentOrange',    variable: '--pintel-color-accent-orange',    role: '전경 강조 — 주황' },
  { key: 'accentLime',      value: '#8CD929', xamlKey: 'Pintel.Color.AccentLime',      variable: '--pintel-color-accent-lime',      role: '전경 강조 — 라임' },
  { key: 'accentGreen',     value: '#2ED45A', xamlKey: 'Pintel.Color.AccentGreen',     variable: '--pintel-color-accent-green',     role: '전경 강조 — 초록' },
  { key: 'accentCyan',      value: '#1FC8E6', xamlKey: 'Pintel.Color.AccentCyan',      variable: '--pintel-color-accent-cyan',      role: '전경 강조 — 시안' },
  { key: 'accentLightBlue', value: '#45A6F5', xamlKey: 'Pintel.Color.AccentLightBlue', variable: '--pintel-color-accent-light-blue', role: '전경 강조 — 라이트 블루' },
  { key: 'accentBlue',      value: '#5B8DEF', xamlKey: 'Pintel.Color.AccentBlue',      variable: '--pintel-color-accent-blue',      role: '전경 강조 — 파랑' },
  { key: 'accentViolet',    value: '#9B8CFA', xamlKey: 'Pintel.Color.AccentViolet',    variable: '--pintel-color-accent-violet',    role: '전경 강조 — 바이올렛' },
  { key: 'accentPurple',    value: '#C77DFF', xamlKey: 'Pintel.Color.AccentPurple',    variable: '--pintel-color-accent-purple',    role: '전경 강조 — 퍼플' },
  { key: 'accentPink',      value: '#FF7AD4', xamlKey: 'Pintel.Color.AccentPink',      variable: '--pintel-color-accent-pink',      role: '전경 강조 — 핑크' },
];

// 무채색(Neutral) 14단계 — 배경/표면/테두리/텍스트 명도 위계
export const COLOR_NEUTRAL = [
  { key: 'neutral99', value: '#FCFCFC', xamlKey: 'Pintel.Color.Neutral99', variable: '--pintel-color-neutral-99', role: '최상위 전경 텍스트 / 라이트 표면' },
  { key: 'neutral95', value: '#F2F2F2', xamlKey: 'Pintel.Color.Neutral95', variable: '--pintel-color-neutral-95', role: '강조 텍스트 / 밝은 표면' },
  { key: 'neutral90', value: '#E6E6E6', xamlKey: 'Pintel.Color.Neutral90', variable: '--pintel-color-neutral-90', role: '기본 텍스트(다크 위)' },
  { key: 'neutral80', value: '#CCCCCC', xamlKey: 'Pintel.Color.Neutral80', variable: '--pintel-color-neutral-80', role: '본문 텍스트' },
  { key: 'neutral70', value: '#B3B3B3', xamlKey: 'Pintel.Color.Neutral70', variable: '--pintel-color-neutral-70', role: '보조 텍스트' },
  { key: 'neutral60', value: '#999999', xamlKey: 'Pintel.Color.Neutral60', variable: '--pintel-color-neutral-60', role: '비활성 텍스트 / 플레이스홀더' },
  { key: 'neutral50', value: '#808080', xamlKey: 'Pintel.Color.Neutral50', variable: '--pintel-color-neutral-50', role: '중간 그레이 (아이콘·디바이더 강)' },
  { key: 'neutral40', value: '#666666', xamlKey: 'Pintel.Color.Neutral40', variable: '--pintel-color-neutral-40', role: '약한 아이콘 / 테두리 강조' },
  { key: 'neutral30', value: '#4D4D4D', xamlKey: 'Pintel.Color.Neutral30', variable: '--pintel-color-neutral-30', role: '테두리 / 구분선(밝은 편)' },
  { key: 'neutral22', value: '#383838', xamlKey: 'Pintel.Color.Neutral22', variable: '--pintel-color-neutral-22', role: '테두리 / 컨트롤 외곽' },
  { key: 'neutral20', value: '#333333', xamlKey: 'Pintel.Color.Neutral20', variable: '--pintel-color-neutral-20', role: '카드·패널 테두리' },
  { key: 'neutral15', value: '#262626', xamlKey: 'Pintel.Color.Neutral15', variable: '--pintel-color-neutral-15', role: '카드·표면 배경' },
  { key: 'neutral10', value: '#1A1A1A', xamlKey: 'Pintel.Color.Neutral10', variable: '--pintel-color-neutral-10', role: '패널 배경 / 베이스 서피스' },
  { key: 'neutral5',  value: '#0D0D0D', xamlKey: 'Pintel.Color.Neutral5',  variable: '--pintel-color-neutral-5',  role: '최하위 딥 배경' },
];

// 색상 토큰 통합(MCP 노출용) — 의미별 그룹
export const COLORS = {
  primary: COLOR_PRIMARY,
  status: COLOR_STATUS,
  accent: COLOR_ACCENT,
  neutral: COLOR_NEUTRAL,
};

// 폰트 패밀리
export const FONT_FAMILY = "'Pretendard GOV', sans-serif";

// ─────────────────────────────────────────────────────────────────────────
// FONT WEIGHT (글자 굵기 위계, Pretendard GOV)
// ─────────────────────────────────────────────────────────────────────────
export const WEIGHTS = [
  { key: 'light',     value: 300, xamlKey: 'Pintel.Weight.Light',     role: '보조 설명 (가장 약한 위계)' },
  { key: 'regular',   value: 400, xamlKey: 'Pintel.Weight.Regular',   role: '본문·입력·라벨' },
  { key: 'medium',    value: 500, xamlKey: 'Pintel.Weight.Medium',    role: '강조 라벨 (구조 식별)' },
  { key: 'semibold',  value: 600, xamlKey: 'Pintel.Weight.SemiBold',  role: '인터랙티브 강조: 버튼·링크 (DS Button 스펙)' },
  { key: 'bold',      value: 700, xamlKey: 'Pintel.Weight.Bold',      role: '카드 타이틀 (히어로)' },
  { key: 'extrabold', value: 800, xamlKey: 'Pintel.Weight.ExtraBold', role: '페이지 타이틀 (최상위)' },
];

// ─────────────────────────────────────────────────────────────────────────
// ICON (Foundation > Icon) — 렌더 가능한 아이콘 세트 (icons.jsx 레지스트리와 1:1)
//  Figma "디자인 시스템 3" Icon 섹션에서 추출. name=코드 식별자, label=의미, usage=사용처.
//  상태 색: 활성 #0066FF · 주의 #FFA938 · 위험 #FF6363 · 비활성 #B1B1B2 (size 기본 20px)
// ─────────────────────────────────────────────────────────────────────────
export const ICONS = [
  { name: 'search',             label: '검색',             usage: '검색 입력·필터 영역' },
  { name: 'calendar_today',     label: '기간 / 날짜',      usage: '날짜·기간 선택(Date picker)' },
  { name: 'schedule',           label: '시간 / 일정',      usage: '시간 입력·스케줄' },
  { name: 'arrow_drop_down',    label: '드롭다운',         usage: '셀렉트·드롭다운 펼침' },
  { name: 'arrow_back_ios',     label: '이전 / 뒤로',      usage: '뒤로가기·페이지네이션 이전' },
  { name: 'arrow_forward',      label: '다음 / 앞으로',    usage: '페이지네이션 다음·앞으로(arrow_back_ios 180° 회전)' },
  { name: 'cancel',             label: '취소 / 지우기',    usage: '입력 지우기·닫기' },
  { name: 'check_circle',       label: '확인 / 완료',      usage: '완료·성공 표시' },
  { name: 'check',              label: '체크',             usage: '체크된 콘텐츠 표시(동그라미 없는 순수 체크마크, Control.Checkmark)' },
  { name: 'check_on',           label: '체크 ON',          usage: '체크박스 선택 상태' },
  { name: 'check_off',          label: '체크 OFF',         usage: '체크박스 미선택 상태' },
  { name: 'sort_updown',        label: '정렬',             usage: '표 정렬(오름/내림)' },
  { name: 'cycle',              label: '새로고침 / 순환',  usage: '데이터 갱신·재조회' },
  { name: 'trending_up',        label: '추세 상승',        usage: '통계·증감 지표' },
  { name: 'sensors',            label: '센서 / 탐지',      usage: '센서·이벤트 탐지' },
  { name: 'error',              label: '오류 / 위험',      usage: '오류·위험 상태(위험 색 #FF6363)' },
  { name: 'warning',            label: '경고 / 주의',      usage: '경고·주의 상태(주의 색 #FFA938, error와 동일 글리프)' },
  { name: 'nest_cam_outdoor',   label: 'CCTV 카메라',      usage: '카메라·영상 장비' },
  { name: 'nest_cam_outdoor_in', label: 'CCTV 카메라 (실내)', usage: '실내 카메라·영상 장비(외곽선형)' },
  { name: 'location_searching', label: '위치 추적 / 경로', usage: '위치·경로 탐색' },
  { name: 'brightness_4',       label: '다크 모드 / 밝기', usage: '테마·밝기 전환' },
  { name: 'analyzer',           label: '분석기 / 데이터베이스', usage: '분석기 장비·데이터 저장소(Figma 분석기_icon)' },
  { name: 'keep',               label: '고정 / 핀',        usage: '카메라·항목 고정(pin) 상태 표시(Figma keep)' },
  { name: 'edit',               label: '수정 / 편집',      usage: '항목 편집·이름 변경' },
  { name: 'visibility',         label: '보기 / 표시',      usage: '비밀번호·내용 표시(눈)' },
  { name: 'visibility_off',     label: '숨김',             usage: '비밀번호·내용 가리기(눈 빗금)' },
  { name: 'delete_forever',     label: '영구 삭제',        usage: '항목 완전 삭제(휴지통)' },
  { name: 'folder_open',        label: '폴더 열기',        usage: '폴더·디렉터리 열기' },
  { name: 'code',               label: '코드',             usage: '코드·개발자 메뉴(<>)' },
  { name: 'menu',               label: '메뉴 / 목록',      usage: '메뉴 펼침·목록 보기(햄버거)' },
  { name: 'settings',           label: '설정',             usage: '영상 분석 설정 등 설정 메뉴(톱니, Figma settings)' },
  { name: 'settings_video_camera', label: '카메라 설정',   usage: '카메라 연동 분석 설정(톱니+비디오카메라, Figma settings_video_camera)' },
  { name: 'replace_video',      label: '영상 재연결 / 교체', usage: '선택 영상 재연결(화면+회전 화살표, Figma replace_video)' },
  { name: 'automation',         label: '자동화 / 연동',    usage: '카메라 연결 테스트 등 자동화·연동(이중 나선, Figma automation)' },
  { name: 'language',           label: '웹 / 언어',        usage: '카메라 웹 연결(지구본, Figma language)' },
  { name: 'flip_camera_ios',    label: '카메라 전환',      usage: '카메라 점검모드로 전환(카메라+회전, Figma flip_camera_ios)' },
];

// ─────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY (Foundation > Typography.Style) — 핵심 기반 토큰 19종
//  각 항목: 코드키(key) · fontSize · lineHeight · letterSpacing · xamlSizeKey · xamlLineKey · role
// ─────────────────────────────────────────────────────────────────────────
export const TYPOGRAPHY = [
  { key: 'display1',      name: 'Display 1',      fontSize: '56px', lineHeight: '72px', letterSpacing: '-0.0319em', xamlSizeKey: 'Pintel.Size.Display1', xamlLineKey: 'Pintel.Line.Display1', role: '최상위 디스플레이' },
  { key: 'display2',      name: 'Display 2',      fontSize: '40px', lineHeight: '52px', letterSpacing: '-0.0282em', xamlSizeKey: 'Pintel.Size.Display2', xamlLineKey: 'Pintel.Line.Display2', role: '대형 디스플레이' },
  { key: 'display3',      name: 'Display 3',      fontSize: '36px', lineHeight: '48px', letterSpacing: '-0.027em',  xamlSizeKey: 'Pintel.Size.Display3', xamlLineKey: 'Pintel.Line.Display3', role: '디스플레이' },
  { key: 'title1',        name: 'Title 1',        fontSize: '32px', lineHeight: '44px', letterSpacing: '-0.0253em', xamlSizeKey: 'Pintel.Size.Title1',   xamlLineKey: 'Pintel.Line.Title1',   role: '페이지 타이틀' },
  { key: 'title2',        name: 'Title 2',        fontSize: '28px', lineHeight: '38px', letterSpacing: '-0.0236em', xamlSizeKey: 'Pintel.Size.Title2',   xamlLineKey: 'Pintel.Line.Title2',   role: '섹션 타이틀' },
  { key: 'title3',        name: 'Title 3',        fontSize: '24px', lineHeight: '32px', letterSpacing: '-0.023em',  xamlSizeKey: 'Pintel.Size.Title3',   xamlLineKey: 'Pintel.Line.Title3',   role: '서브 섹션 타이틀' },
  { key: 'heading1',      name: 'Heading 1',      fontSize: '22px', lineHeight: '30px', letterSpacing: '-0.0194em', xamlSizeKey: 'Pintel.Size.Heading1', xamlLineKey: 'Pintel.Line.Heading1', role: '헤딩' },
  { key: 'heading2',      name: 'Heading 2',      fontSize: '20px', lineHeight: '28px', letterSpacing: '-0.012em',  xamlSizeKey: 'Pintel.Size.Heading2', xamlLineKey: 'Pintel.Line.Heading2', role: '헤딩' },
  { key: 'headline1',     name: 'Headline 1',     fontSize: '18px', lineHeight: '26px', letterSpacing: '-0.002em',  xamlSizeKey: 'Pintel.Size.Headline1', xamlLineKey: 'Pintel.Line.Headline1', role: '헤드라인' },
  { key: 'headline2',     name: 'Headline 2',     fontSize: '17px', lineHeight: '26px', letterSpacing: '0em',       xamlSizeKey: 'Pintel.Size.Headline2', xamlLineKey: 'Pintel.Line.Headline2', role: '헤드라인' },
  { key: 'body1',         name: 'Body 1/Normal',  fontSize: '16px', lineHeight: '24px', letterSpacing: '0.0057em',  xamlSizeKey: 'Pintel.Size.Body1',   xamlLineKey: 'Pintel.Line.Body1',   role: '본문(기본)' },
  { key: 'body1Reading',  name: 'Body 1/Reading', fontSize: '16px', lineHeight: '26px', letterSpacing: '0.0057em',  xamlSizeKey: 'Pintel.Size.Body1',   xamlLineKey: null,                  role: '본문(가독형, 넓은 행간)' },
  { key: 'body2',         name: 'Body 2/Normal',  fontSize: '15px', lineHeight: '22px', letterSpacing: '0.0096em',  xamlSizeKey: 'Pintel.Size.Body2',   xamlLineKey: 'Pintel.Line.Body2',   role: '본문(보조)' },
  { key: 'body2Reading',  name: 'Body 2/Reading', fontSize: '15px', lineHeight: '24px', letterSpacing: '0.0096em',  xamlSizeKey: 'Pintel.Size.Body2',   xamlLineKey: null,                  role: '본문(보조, 가독형)' },
  { key: 'label1',        name: 'Label 1/Normal', fontSize: '14px', lineHeight: '20px', letterSpacing: '0.0145em',  xamlSizeKey: 'Pintel.Size.Label1',  xamlLineKey: 'Pintel.Line.Label1',  role: '라벨' },
  { key: 'label1Reading', name: 'Label 1/Reading',fontSize: '14px', lineHeight: '22px', letterSpacing: '0.0145em',  xamlSizeKey: 'Pintel.Size.Label1',  xamlLineKey: null,                  role: '라벨(가독형)' },
  { key: 'label2',        name: 'Label 2',        fontSize: '13px', lineHeight: '18px', letterSpacing: '0.0194em',  xamlSizeKey: 'Pintel.Size.Label2',  xamlLineKey: 'Pintel.Line.Label2',  role: '라벨(작음)' },
  { key: 'caption1',      name: 'Caption 1',      fontSize: '12px', lineHeight: '16px', letterSpacing: '0.0252em',  xamlSizeKey: 'Pintel.Size.Caption1', xamlLineKey: 'Pintel.Line.Caption1', role: '캡션' },
  { key: 'caption2',      name: 'Caption 2',      fontSize: '11px', lineHeight: '14px', letterSpacing: '0.0311em',  xamlSizeKey: 'Pintel.Size.Caption2', xamlLineKey: 'Pintel.Line.Caption2', role: '캡션(작음)' },
];

// ─────────────────────────────────────────────────────────────────────────
// SPACING (Foundation > Spacing) — 핵심 기반 토큰, 4/8pt 스케일
//  각 항목: 코드키(key, SP[key]로 접근) · px · rem · xamlKey · usage
// ─────────────────────────────────────────────────────────────────────────
export const SPACING = [
  { key: 2,  px: 2,  rem: '0.125rem', xamlKey: 'Pintel.Space.02', usage: '헤어라인 인접 미세 여백, 보더 간격' },
  { key: 4,  px: 4,  rem: '0.25rem',  xamlKey: 'Pintel.Space.04', usage: '미세한 컴포넌트 내부 여백' },
  { key: 8,  px: 8,  rem: '0.5rem',   xamlKey: 'Pintel.Space.08', usage: '기본적인 아이템 간격' },
  { key: 12, px: 12, rem: '0.75rem',  xamlKey: 'Pintel.Space.12', usage: '아이콘·라벨 간격, 조밀한 내부 여백' },
  { key: 16, px: 16, rem: '1rem',     xamlKey: 'Pintel.Space.16', usage: '일반적인 섹션 내부 간격' },
  { key: 24, px: 24, rem: '1.5rem',   xamlKey: 'Pintel.Space.24', usage: '컴포넌트 그룹 간 간격' },
  { key: 32, px: 32, rem: '2rem',     xamlKey: 'Pintel.Space.32', usage: '대형 섹션 여백' },
  { key: 40, px: 40, rem: '2.5rem',   xamlKey: 'Pintel.Space.40', usage: '관제 대시보드 패널 간 여백' },
  { key: 48, px: 48, rem: '3rem',     xamlKey: 'Pintel.Space.48', usage: '페이지 주요 영역 구분 여백' },
  { key: 64, px: 64, rem: '4rem',     xamlKey: 'Pintel.Space.64', usage: '전체 페이지 상하 여백, 최상위 레이아웃' },
];

export const SPACING_NOTE =
  '※ 스페이싱 레이어 구분\n' +
  '· 레이아웃·문서 기준 여백: 위 Foundation 스케일(4/8pt, px·rem)을 사용합니다.\n' +
  '· 컴포넌트 prop 입력 여백: 별도의 SpacingMap 토큰을 사용하며, WPF에서는 Thickness로 바인딩됩니다.\n' +
  '· SpacingMap은 px와 선형 비례하지 않는 독립 스케일이므로(예: \'300\' → 24px, \'250\' → 10px) Foundation 표(4/8pt)와 수치를 혼용하지 마세요.';

// ─────────────────────────────────────────────────────────────────────────
// SPACING MAP (컴포넌트 prop 입력 여백 — WPF Thickness 바인딩용 독립 스케일)
//  token → px 매핑. px가 확인되지 않은 항목은 null(추정 금지). 확정 시 채울 것.
//  ※ 알려진 매핑: '300' → 24px, '250' → 10px (spacing-style note 근거). 그 외 미확정.
// ─────────────────────────────────────────────────────────────────────────
export const SPACING_MAP = [
  { token: 'none', px: 0 },
  { token: 'px',   px: 1 },
  { token: '25',   px: null },
  { token: '50',   px: null },
  { token: '100',  px: null },
  { token: '200',  px: null },
  { token: '250',  px: 10 },   // note 근거
  { token: '300',  px: 24 },   // note 근거
  { token: '400',  px: null },
  { token: '500',  px: null },
  { token: '600',  px: null },
  { token: '800',  px: null },
  { token: '1000', px: null },
  { token: '1200', px: null },
  { token: '1300', px: null },
  { token: '1400', px: null },
  { token: '1500', px: null },
];

// SpacingMap의 토큰 키 배열 (기존 SPACING_MAP 문자열 배열 형태 호환용)
export const SPACING_MAP_TOKENS = SPACING_MAP.map((s) => s.token);

// ─────────────────────────────────────────────────────────────────────────
// 화면 인라인 스타일용 단축 객체 — 위 토큰에서 파생(중복 정의 금지)
// ─────────────────────────────────────────────────────────────────────────

// T: 시맨틱 색상 + 폰트. (기존 Library.jsx/PermissionSettings.jsx의 T와 동일 형태)
//    primary 계열은 오너 확정값 #0066FF로 통일.
export const T = {
  primary:       COLOR_PRIMARY[0].value,
  primaryStrong: COLOR_PRIMARY[1].value,
  primaryHeavy:  COLOR_PRIMARY[2].value,
  positive:      COLOR_STATUS[0].value,
  cautionary:    COLOR_STATUS[1].value,
  error:         COLOR_STATUS[2].value,
  font:          FONT_FAMILY,
};

// W: font-weight 위계
export const W = WEIGHTS.reduce((acc, w) => { acc[w.key] = w.value; return acc; }, {});

// TYPE: Typography.Style — {fontSize, lineHeight, letterSpacing}만 추려 인라인 스프레드용
export const TYPE = TYPOGRAPHY.reduce((acc, t) => {
  acc[t.key] = { fontSize: t.fontSize, lineHeight: t.lineHeight, letterSpacing: t.letterSpacing };
  return acc;
}, {});

// SP: Spacing 스케일 — CSS 문자열('2px' 등). 여백·간격·패딩은 항상 이 토큰으로.
export const SP = SPACING.reduce((acc, s) => { acc[s.key] = `${s.px}px`; return acc; }, {});

// WRAP: 줄바꿈 정본 — 웹에서 가장 보편적·안전한 기본값.
//  · word-break: keep-all  → 한글은 어절(단어) 단위로만 줄바꿈(중간에서 끊기지 않음), 영문 단어도 통째 유지
//  · overflow-wrap: break-word → 컨테이너보다 긴 단일 토큰(URL·식별자 등)은 끊어서 오버플로 방지
//  전역 기본은 index.css body에 적용(상속). 강제 적용이 필요한 인라인 요소엔 {...WRAP}.
export const WRAP = { wordBreak: 'keep-all', overflowWrap: 'break-word' };

// ─────────────────────────────────────────────────────────────────────────
// 화면 팔레트 (다크/라이트) — 다크 테마 관제 UI가 실제 렌더에 사용.
//  Primary/Status는 위 시맨틱 토큰(T) 기준. 표면/테두리 등 다크 전용값은 Neutral 기반.
// ─────────────────────────────────────────────────────────────────────────
export const PALETTE_LIGHT = {
  cardBg: '#FFFFFF', cardBorder: 'rgba(112,115,124,0.22)', divider: 'rgba(112,115,124,0.22)',
  brandText: '#171719', title: '#171719', subtitle: 'rgba(55,56,60,0.61)', muted: 'rgba(55,56,60,0.61)',
  fieldLabel: '#171719', inputBg: '#FFFFFF', inputBorder: 'rgba(112,115,124,0.22)', inputText: '#171719',
  clearBg: 'rgba(112,115,124,0.16)', clearIcon: '#37383C', eyeColor: 'rgba(55,56,60,0.61)',
  primary: T.primary, primaryStrong: T.primaryStrong, primaryHeavy: T.primaryHeavy, onPrimary: '#FFFFFF', link: T.primary,
  errorBorder: '#FF4242', errorText: '#E52222', focusRing: 'rgba(0,102,255,0.20)', errorRing: 'rgba(255,66,66,0.18)',
  tooltipBg: '#FFFFFF', tooltipBorder: 'rgba(112,115,124,0.22)', tooltipText: '#171719', tooltipIcon: '#FF4242',
  checkBorderOff: 'rgba(112,115,124,0.52)', checkLabel: 'rgba(55,56,60,0.61)',
  positive: T.positive, cardShadow: '0 24px 64px rgba(15,23,42,0.28)',
};
export const PALETTE_DARK = {
  cardBg: '#1e1e1e', cardBorder: '#2c2c30', divider: '#2a2a2e',
  brandText: '#ffffff', title: '#ffffff', subtitle: '#9a9a9f', muted: '#8a8a8f',
  fieldLabel: '#888', inputBg: '#161618', inputBorder: '#2e2e2e', inputText: '#ffffff',
  clearBg: '#3a3a40', clearIcon: '#d4d4d8', eyeColor: '#888',
  primary: T.primary, primaryStrong: T.primaryStrong, primaryHeavy: T.primaryHeavy, onPrimary: '#FFFFFF', link: T.primaryStrong,
  errorBorder: '#FF4242', errorText: '#FF6B6B', focusRing: 'rgba(0,102,255,0.25)', errorRing: 'rgba(255,66,66,0.20)',
  tooltipBg: '#2b2b31', tooltipBorder: '#3a3a42', tooltipText: '#eaeaec', tooltipIcon: '#FF4242',
  checkBorderOff: '#4a4a4f', checkLabel: '#bbb',
  positive: T.positive, cardShadow: '0 24px 64px rgba(0,0,0,0.5)',
};

// ─────────────────────────────────────────────────────────────────────────
// SEMANTIC TOKENS (Foundation > Semantic) — Wanted 디자인 시스템 구조 채택
// ─────────────────────────────────────────────────────────────────────────
//  Wanted의 시맨틱 계층 "구조"를 채택하고, PREVAX(다크 테마 관제 시스템)에 맞춰
//  **다크값을 기본(value)** 으로 사용합니다. 라이트값은 향후 라이트 테마 대응을 위해
//  semanticLight 메타로 함께 기록합니다(현재 렌더에는 미사용, 참고용).
//
//  ※ 이 계층은 기존 T/TYPE/W/SP/PALETTE_* 와 독립된 **추가(additive)** 계층입니다.
//    기존 화면 렌더는 기존 단축 객체를 그대로 사용하므로 무영향입니다.
//
//  ※ Primary 계열은 Wanted 다크값이 아니라 **Pintel 오너 확정값** 을 사용합니다
//    (Normal #0066FF / Strong #3385FF / Heavy #0052CC). COLOR_PRIMARY 를 재사용.
//
//  각 색상 토큰: { key, value(다크 기본), xamlKey, role, semanticLight(라이트 참고값) }
// ─────────────────────────────────────────────────────────────────────────

// Label — 텍스트 강조 6단계 (Strong → Disable, 점차 약해지는 위계)
export const SEMANTIC_LABEL = [
  { key: 'strong',      value: '#ffffff',   xamlKey: 'Pintel.Semantic.Label.Strong',      role: '최상위 강조 텍스트(타이틀/핵심 수치)',     semanticLight: '#000000' },
  { key: 'normal',      value: '#f7f7f8',   xamlKey: 'Pintel.Semantic.Label.Normal',      role: '기본 본문 텍스트',                          semanticLight: '#171719' },
  { key: 'neutral',     value: '#c2c4c8e0', xamlKey: 'Pintel.Semantic.Label.Neutral',     role: '중간 위계 텍스트',                          semanticLight: '#2E2F33' },
  { key: 'alternative', value: '#aeb0b69c', xamlKey: 'Pintel.Semantic.Label.Alternative', role: '보조 텍스트(부가 설명)',                    semanticLight: '#37383C' },
  { key: 'assistive',   value: '#aeb0b647', xamlKey: 'Pintel.Semantic.Label.Assistive',   role: '도움 텍스트(가장 약한 활성 위계)',          semanticLight: '#37383C' },
  { key: 'disable',     value: '#989ba229', xamlKey: 'Pintel.Semantic.Label.Disable',     role: '비활성 텍스트',                             semanticLight: '#37383C' },
];

// Primary — Pintel 오너 확정값 재사용(다크/라이트 동일 정책: #0066FF 계열)
export const SEMANTIC_PRIMARY = [
  { key: 'normal', value: COLOR_PRIMARY[0].value, xamlKey: 'Pintel.Semantic.Primary.Normal', role: '주요 액션·활성 하이라이트(브랜드 대표색)', semanticLight: COLOR_PRIMARY[0].value },
  { key: 'strong', value: COLOR_PRIMARY[1].value, xamlKey: 'Pintel.Semantic.Primary.Strong', role: '강조/호버 단계',                            semanticLight: COLOR_PRIMARY[1].value },
  { key: 'heavy',  value: COLOR_PRIMARY[2].value, xamlKey: 'Pintel.Semantic.Primary.Heavy',  role: '눌림/고대비 단계',                          semanticLight: COLOR_PRIMARY[2].value },
];

// Status — 다크값 기본 (Positive/Cautionary/Negative)
export const SEMANTIC_STATUS = [
  { key: 'positive',   value: '#1ed45a', xamlKey: 'Pintel.Semantic.Status.Positive',   role: '성공·정상·연결됨',         semanticLight: '#00BF40' },
  { key: 'cautionary', value: '#ffa938', xamlKey: 'Pintel.Semantic.Status.Cautionary', role: '주의·대기·이상 징후',      semanticLight: '#FF9200' },
  { key: 'negative',   value: '#ff6363', xamlKey: 'Pintel.Semantic.Status.Negative',   role: '위험·장애·긴급 조치',      semanticLight: '#FF4242' },
];

// Background — Normal/Elevated × Normal/Alternative
export const SEMANTIC_BACKGROUND = [
  { key: 'normalNormal',      value: '#1b1c1e', xamlKey: 'Pintel.Semantic.Background.Normal.Normal',      role: '기본 페이지 배경',                  semanticLight: '#FFFFFF' },
  { key: 'normalAlternative', value: '#0f0f10', xamlKey: 'Pintel.Semantic.Background.Normal.Alternative', role: '기본 배경의 대체(더 깊은) 영역',     semanticLight: '#F7F7F8' },
  { key: 'elevatedNormal',      value: '#212225', xamlKey: 'Pintel.Semantic.Background.Elevated.Normal',      role: '떠 있는 표면(카드/패널/모달)',     semanticLight: '#FFFFFF' },
  { key: 'elevatedAlternative', value: '#141415', xamlKey: 'Pintel.Semantic.Background.Elevated.Alternative', role: '떠 있는 표면의 대체 영역',         semanticLight: '#F7F7F8' },
];

// Line — Normal(투명 보더) / Solid(불투명 보더) 각 단계
export const SEMANTIC_LINE = [
  { key: 'normalNormal',      value: '#70737c52', xamlKey: 'Pintel.Semantic.Line.Normal.Normal',      role: '기본 보더(투명형)',          semanticLight: '#70737C' },
  { key: 'normalStrong',      value: '#c2c4c885', xamlKey: 'Pintel.Semantic.Line.Normal.Strong',      role: '강조 보더(투명형)',          semanticLight: '#70737C' },
  { key: 'normalNeutral',     value: '#70737c47', xamlKey: 'Pintel.Semantic.Line.Normal.Neutral',     role: '중간 보더(투명형)',          semanticLight: '#70737C' },
  { key: 'normalAlternative', value: '#70737c38', xamlKey: 'Pintel.Semantic.Line.Normal.Alternative', role: '약한 보더(투명형)',          semanticLight: '#70737C' },
  { key: 'solidNormal',       value: '#37383c',   xamlKey: 'Pintel.Semantic.Line.Solid.Normal',       role: '기본 보더(불투명형)',        semanticLight: '#E1E2E4' },
  { key: 'solidNeutral',      value: '#333438',   xamlKey: 'Pintel.Semantic.Line.Solid.Neutral',      role: '중간 보더(불투명형)',        semanticLight: '#EAEBEC' },
  { key: 'solidAlternative',  value: '#2e2f33',   xamlKey: 'Pintel.Semantic.Line.Solid.Alternative',  role: '약한 보더(불투명형)',        semanticLight: '#F4F4F5' },
];

// Fill — 표면 채움(3단계)
export const SEMANTIC_FILL = [
  { key: 'normal',      value: '#70737c38', xamlKey: 'Pintel.Semantic.Fill.Normal',      role: '기본 채움(컨트롤 배경)',  semanticLight: '#70737C' },
  { key: 'strong',      value: '#70737c47', xamlKey: 'Pintel.Semantic.Fill.Strong',      role: '강조 채움',               semanticLight: '#70737C' },
  { key: 'alternative', value: '#70737c1f', xamlKey: 'Pintel.Semantic.Fill.Alternative', role: '약한 채움',               semanticLight: '#70737C' },
];

// Interaction — 상호작용 상태색
export const SEMANTIC_INTERACTION = [
  { key: 'inactive', value: '#5a5c63', xamlKey: 'Pintel.Semantic.Interaction.Inactive', role: '비활성(미선택) 인터랙션', semanticLight: '#989BA2' },
  { key: 'disable',  value: '#2e2f33', xamlKey: 'Pintel.Semantic.Interaction.Disable',  role: '사용 불가(disabled)',     semanticLight: '#F4F4F5' },
];

// Inverse — 반전(배경 대비) 토큰
export const SEMANTIC_INVERSE = [
  { key: 'background', value: '#ffffff', xamlKey: 'Pintel.Semantic.Inverse.Background', role: '반전 배경(다크 위 밝은 표면)', semanticLight: '#1B1C1E' },
  { key: 'label',      value: '#171719', xamlKey: 'Pintel.Semantic.Inverse.Label',      role: '반전 텍스트',                  semanticLight: '#F7F7F8' },
  { key: 'primary',    value: '#0066ff', xamlKey: 'Pintel.Semantic.Inverse.Primary',    role: '반전 위 브랜드색',             semanticLight: '#3385FF' },
];

// Static — 테마 무관 고정색
export const SEMANTIC_STATIC = [
  { key: 'white', value: '#ffffff', xamlKey: 'Pintel.Semantic.Static.White', role: '고정 흰색(테마 무관)', semanticLight: '#ffffff' },
  { key: 'black', value: '#000000', xamlKey: 'Pintel.Semantic.Static.Black', role: '고정 검정(테마 무관)', semanticLight: '#000000' },
];

// Material — 오버레이/딤 등 재질 효과
export const SEMANTIC_MATERIAL = [
  { key: 'dimmer', value: '#171719bd', xamlKey: 'Pintel.Semantic.Material.Dimmer', role: '모달/오버레이 뒤 딤 처리', semanticLight: '#171719' },
];

// Shadow — 그림자 단계. value는 CSS box-shadow 문자열(다크 기본).
//  Wanted Effect의 DROP_SHADOW 합성을 CSS box-shadow 다중값으로 매핑.
export const SEMANTIC_SHADOW = [
  {
    key: 'normal',
    value: '0 0 1px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12)',
    xamlKey: 'Pintel.Semantic.Shadow.Normal',
    role: '기본 그림자(작은 표면 부양)',
  },
  {
    key: 'emphasize',
    value: '0 0 1px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.12)',
    xamlKey: 'Pintel.Semantic.Shadow.Emphasize',
    role: '강조 그림자(카드/팝오버)',
  },
  {
    key: 'heavy',
    value: '0 0 8px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.08), 0 16px 20px rgba(0,0,0,0.12)',
    xamlKey: 'Pintel.Semantic.Shadow.Heavy',
    role: '강한 그림자(모달/플로팅)',
  },
  {
    key: 'elevation4',
    value: '0 0 4px rgba(0,0,0,0.05), 0 8px 16px rgba(0,0,0,0.15), 0 6px 12px -4px rgba(0,0,0,0.10)',
    xamlKey: 'Pintel.Semantic.Shadow.Elevation4',
    role: '엘리베이션 4단계(높이 강조)',
  },
];

// 시맨틱 토큰 통합(MCP 노출용) — 슬롯별 그룹
export const SEMANTIC = {
  label: SEMANTIC_LABEL,
  primary: SEMANTIC_PRIMARY,
  status: SEMANTIC_STATUS,
  background: SEMANTIC_BACKGROUND,
  line: SEMANTIC_LINE,
  fill: SEMANTIC_FILL,
  interaction: SEMANTIC_INTERACTION,
  inverse: SEMANTIC_INVERSE,
  static: SEMANTIC_STATIC,
  material: SEMANTIC_MATERIAL,
  shadow: SEMANTIC_SHADOW,
};

// SEM: 화면 인라인 스타일용 단축 객체 — 슬롯.단계 → 다크값 문자열.
//  예: SEM.label.normal, SEM.background.elevatedNormal, SEM.line.solidNormal, SEM.shadow.emphasize
//  (기존 T/TYPE/W/SP 와 독립. 시맨틱 계층을 직접 쓰고 싶을 때만 사용.)
export const SEM = Object.entries(SEMANTIC).reduce((acc, [slot, arr]) => {
  acc[slot] = arr.reduce((m, t) => { m[t.key] = t.value; return m; }, {});
  return acc;
}, {});
