/**
 * 핀텔공방 - 디자인 시스템 컴포넌트 데이터
 */
import { ICONS } from './tokens.js';
import { COMPONENT_CODE } from './components-code.js';

/** 계층 정의 */
export const TIERS = {
  'get-started': {
    id: 'get-started',
    label: 'Get Started',
    description: '핀텔 디자인 시스템 시작하기',
    categories: [],
  },
  foundation: {
    id: 'foundation',
    label: 'Foundation',
    description: '디자인 시스템의 기초가 되는 토큰과 스타일 가이드',
    groups: [
      {
        id: 'foundation-overview-group',
        label: '개요 (Overview)',
        categories: [
          {
            id: 'foundation-overview', name: 'Overview',
            children: [{ id: 'foundation-overview-default', name: 'Overview' }]
          }
        ]
      },
      {
        id: 'design-tokens',
        label: '디자인 토큰 (Design Tokens)',
        categories: [
          {
            id: 'color', name: 'Color',
            children: [
              { id: 'color-primary', name: 'Color.Primary' },
              { id: 'color-status', name: 'Color.Status' },
              { id: 'color-accent', name: 'Color.Accent' },
              { id: 'color-neutral', name: 'Color.Neutral' },
            ],
          },
          {
            id: 'typography', name: 'Typography',
            children: [
              { id: 'typo-style', name: 'Typography.Style' },
              { id: 'typo-wordbreak', name: 'Word break' },
            ],
          },
          {
            id: 'iconography', name: 'Icon',
            children: [
              { id: 'icon-symbol', name: 'Icon' },
            ],
          },
        ]
      },
      {
        id: 'layout-depth',
        label: '레이아웃 및 깊이 (Layout \u0026 Depth)',
        categories: [
          { 
            id: 'layout-spacing', name: 'Spacing',
            children: [{ id: 'spacing-style', name: 'Spacing.Style' }] 
          },
          { 
            id: 'layout-elevation', name: 'Elevation',
            children: [{ id: 'elevation-style', name: 'Elevation.Style' }]
          },
        ]
      },
      {
        id: 'motion',
        label: '모션 (Motion)',
        categories: [
          {
            id: 'animation', name: 'Animation',
            children: [
              { id: 'anim-duration', name: 'Animation.Duration' },
              { id: 'anim-easing', name: 'Animation.Easing' },
            ],
          },
        ]
      }
    ],
  },
  component: {
    id: 'component',
    label: 'Component',
    description: '서비스를 구성하는 UI 컴포넌트',
    groups: [
      {
        id: 'actions',
        label: 'Actions',
        categories: [
          {
            id: 'action-area', name: 'Action area',
            children: [{ id: 'action-area-default', name: 'Action area' }]
          },
          {
            id: 'button', name: 'Button',
            children: [{ id: 'button-primary', name: 'Button' }]
          },
          {
            id: 'chip', name: 'Chip',
            children: [{ id: 'chip-closeable', name: 'Chip' }]
          },
          {
            id: 'text-button', name: 'Text button',
            children: [{ id: 'button-text', name: 'Text button' }]
          },
          {
            id: 'icon-button', name: 'Icon button',
            children: [{ id: 'button-icon', name: 'Icon button' }]
          }
        ]
      },
      {
        id: 'contents',
        label: 'Contents',
        categories: [
          {
            id: 'accordion', name: 'Accordion',
            children: [{ id: 'accordion-default', name: 'Accordion' }]
          },
          {
            id: 'avatar', name: 'Avatar',
            children: [{ id: 'avatar-default', name: 'Avatar' }]
          },
          {
            id: 'avatar-group', name: 'Avatar group',
            children: [{ id: 'avatar-group-default', name: 'Avatar group' }]
          },
          {
            id: 'card', name: 'Card',
            children: [{ id: 'card-panel', name: 'Card' }]
          },
          {
            id: 'content-badge', name: 'Content badge',
            children: [{ id: 'content-badge-default', name: 'Content badge' }]
          },
          {
            id: 'list-card', name: 'List card',
            children: [{ id: 'list-card-default', name: 'List card' }]
          },
          {
            id: 'list-cell', name: 'List cell',
            children: [{ id: 'list-cell-default', name: 'List cell' }]
          },
          {
            id: 'section-header', name: 'Section header',
            children: [{ id: 'section-header-default', name: 'Section header' }]
          },
          {
            id: 'table', name: 'Table',
            children: [{ id: 'table-default', name: 'Table' }]
          }
        ]
      },
      {
        id: 'selection-input',
        label: 'Selection and input',
        categories: [
          { id: 'checkmark', name: 'Check mark', children: [{ id: 'control-checkmark', name: 'Check mark' }] },
          { id: 'checkbox', name: 'Checkbox', children: [{ id: 'control-checkbox', name: 'Checkbox' }] },
          { id: 'date-picker', name: 'Date picker', children: [{ id: 'control-datepicker', name: 'Date picker' }] },
          { id: 'filter-button', name: 'Filter button', children: [{ id: 'filter-button-default', name: 'Filter button' }] },
          { id: 'framed-style', name: 'Framed style', children: [{ id: 'framed-style-default', name: 'Framed style' }] },
          { id: 'radio', name: 'Radio', children: [{ id: 'control-radio', name: 'Radio' }] },
          { id: 'search-field', name: 'Search field', children: [{ id: 'field-search', name: 'Search field' }] },
          { id: 'segmented-control', name: 'Segmented control', children: [{ id: 'control-segmented', name: 'Segmented control' }] },
          { id: 'select', name: 'Select', children: [{ id: 'control-select', name: 'Select' }] },
          { id: 'slider', name: 'Slider', children: [{ id: 'control-slider', name: 'Slider' }] },
          { id: 'switch', name: 'Switch', children: [{ id: 'control-switch', name: 'Switch' }] },
          { id: 'text-area', name: 'Text area', children: [{ id: 'field-textarea', name: 'Text area' }] },
          { id: 'text-field', name: 'Text field', children: [{ id: 'field-text', name: 'Text field' }] },
        ]
      },
      {
        id: 'feedback',
        label: 'Feedback',
        categories: [
          { id: 'alert', name: 'Alert', children: [{ id: 'alert-default', name: 'Alert' }] },
          { id: 'fallback-view', name: 'Fallback view', children: [{ id: 'feedback-fallback', name: 'Fallback view' }] },
          { id: 'push-badge', name: 'Push badge', children: [{ id: 'feedback-pushbadge', name: 'Push badge' }] },
          { id: 'section-message', name: 'Section message', children: [{ id: 'feedback-section-message', name: 'Section message' }] },
          { id: 'toast', name: 'Toast', children: [{ id: 'toast-default', name: 'Toast' }] },
        ]
      },
      {
        id: 'loading',
        label: 'Loading',
        categories: [
          { id: 'loading', name: 'Loading', children: [{ id: 'loading-default', name: 'Loading' }] },
          { id: 'skeleton', name: 'Skeleton', children: [{ id: 'loading-skeleton', name: 'Skeleton' }] },
        ]
      },
      {
        id: 'navigations',
        label: 'Navigations',
        categories: [
          { id: 'category', name: 'Category', children: [{ id: 'category-default', name: 'Category' }] },
          { id: 'page-counter', name: 'Page counter', children: [{ id: 'nav-page-counter', name: 'Page counter' }] },
          { id: 'pagination', name: 'Pagination', children: [{ id: 'nav-pagination', name: 'Pagination' }] },
          { id: 'pagination-dots', name: 'Pagination dots', children: [{ id: 'nav-pagination-dots', name: 'Pagination dots' }] },
          { id: 'progress-indicator', name: 'Progress indicator', children: [{ id: 'nav-progress-indicator', name: 'Progress indicator' }] },
          { id: 'progress-tracker', name: 'Progress tracker', children: [{ id: 'nav-progress-tracker', name: 'Progress tracker' }] },
          { id: 'tab', name: 'Tab', children: [{ id: 'nav-tab', name: 'Tab' }] },
          { id: 'top-navigation', name: 'Top navigation', children: [{ id: 'nav-top', name: 'Top navigation' }] },
        ]
      },
      {
        id: 'presentation',
        label: 'Presentation',
        categories: [
          { id: 'autocomplete', name: 'Autocomplete', children: [{ id: 'present-autocomplete', name: 'Autocomplete' }] },
          { id: 'menu', name: 'Menu', children: [{ id: 'present-menu', name: 'Menu' }] },
          { id: 'popover', name: 'Popover', children: [{ id: 'present-popover', name: 'Popover' }] },
          { id: 'popup', name: 'Popup', children: [{ id: 'present-popup', name: 'Popup' }] },
          { id: 'tooltip', name: 'Tooltip', children: [{ id: 'present-tooltip', name: 'Tooltip' }] },
        ]
      }
    ],
  },
  'service-domain': {
    id: 'service-domain',
    label: 'Service Domains',
    description: '서비스 도메인별 특화 가이드 및 컴포넌트 명세',
    groups: [
      {
        id: 'smart-intersection',
        label: '스마트 교차로 (Smart Intersection)',
        categories: [
          {
            id: 'intersection-overview', name: 'Overview',
            children: [{ id: 'intersection-overview-default', name: 'Overview' }]
          },
          {
            id: 'intersection-overlay', name: 'Detection Overlay',
            children: [{ id: 'intersection-overlay-default', name: 'CCTV Detection Overlay' }]
          },
          {
            id: 'signal-queue', name: 'Signal Queue Indicator',
            children: [{ id: 'signal-queue-default', name: 'Signal Queue Indicator' }]
          },
          {
            id: 'traffic-flow', name: 'Traffic Flow Chart',
            children: [{ id: 'traffic-flow-default', name: 'Traffic Flow Chart' }]
          }
        ]
      },
      {
        id: 'selective-control',
        label: '선별관제 (Selective Control)',
        categories: [
          {
            id: 'selective-overview', name: 'Overview',
            children: [{ id: 'selective-overview-default', name: 'Overview' }]
          },
          {
            id: 'detected-targets', name: 'Detected Target List',
            children: [{ id: 'detected-targets-default', name: 'Detected Target List' }]
          },
          {
            id: 'camera-radius', name: 'Camera Range Controller',
            children: [{ id: 'camera-radius-default', name: 'Camera Range Controller' }]
          },
          {
            id: 'event-grid', name: 'Event Grid',
            children: [{ id: 'event-grid-default', name: 'Event Grid' }]
          }
        ]
      },
      {
        id: 'pedestrian-actuated',
        label: '보행자 감응 (Pedestrian Actuated)',
        categories: [
          {
            id: 'pedestrian-overview', name: 'Overview',
            children: [{ id: 'pedestrian-overview-default', name: 'Overview' }]
          },
          {
            id: 'pedestrian-sensor', name: 'Sensor Status',
            children: [{ id: 'pedestrian-sensor-default', name: 'Sensor Status' }]
          },
          {
            id: 'actuated-countdown', name: 'Countdown Timer',
            children: [{ id: 'actuated-countdown-default', name: 'Countdown Timer' }]
          },
          {
            id: 'audio-control', name: 'Audio Control Panel',
            children: [{ id: 'audio-control-default', name: 'Audio Control Panel' }]
          }
        ]
      },
      {
        id: 'smart-schoolzone',
        label: '스마트 스쿨존 (Smart School Zone)',
        categories: [
          {
            id: 'schoolzone-overview', name: 'Overview',
            children: [{ id: 'schoolzone-overview-default', name: 'Overview' }]
          },
          {
            id: 'speed-limit', name: 'Speed Limit Sign',
            children: [{ id: 'speed-limit-default', name: 'Speed Limit Sign' }]
          },
          {
            id: 'illegal-parking', name: 'Illegal Parking Detection',
            children: [{ id: 'illegal-parking-default', name: 'Illegal Parking Detection' }]
          },
          {
            id: 'crosswalk-warning', name: 'Crosswalk Warning Sign',
            children: [{ id: 'crosswalk-warning-default', name: 'Crosswalk Warning Sign' }]
          }
        ]
      }
    ]
  },
  library: {
    id: 'library',
    label: 'Library',
    description: '컴포넌트 구성 라이브러리',
    groups: [
      {
        id: 'library-account', label: '계정',
        categories: [
          { id: 'tpl-login', name: '로그인', children: [{ id: 'library-login', name: '로그인' }] },
          { id: 'tpl-signup', name: '회원가입', children: [{ id: 'library-signup', name: '회원가입' }] },
        ]
      },
      {
        id: 'library-monitoring', label: '관제 화면',
        categories: [
          { id: 'tpl-dashboard', name: '대시보드', children: [{ id: 'library-dashboard', name: '대시보드' }] },
          {
            id: 'tpl-live', name: '실시간 영상',
            children: [
              { id: 'library-live', name: '기본' },
              { id: 'library-live-focus', name: 'Focus (고정)' },
              { id: 'library-unassigned', name: '미배치 채널 확인 (F-2)' },
              { id: 'library-event-popup', name: '이벤트 자동 팝업 (D-3)' },
              { id: 'library-event-popup-live', name: '이벤트 자동 팝업 (화면)' },
            ]
          },
          { id: 'tpl-selective', name: '선별관제 모니터링', children: [
            { id: 'library-selective', name: '선별관제 모니터링' },
            { id: 'library-selective-away', name: '자리비움 수신자' },
          ] },
          { id: 'tpl-gis', name: 'GIS 관제', children: [{ id: 'library-gis-monitor', name: 'GIS 관제' }] },
        ]
      },
      {
        id: 'library-event', label: '이벤트',
        categories: [
          { id: 'tpl-event-search', name: '이벤트 조회', children: [{ id: 'library-event-search', name: '이벤트 조회' }] },
          { id: 'tpl-event-activation', name: '이벤트 활성화 관리', children: [{ id: 'library-event-activation', name: '이벤트 활성화 관리' }] },
          { id: 'tpl-event-def-add', name: '이벤트 정의 추가', children: [{ id: 'library-event-def-add', name: '이벤트 정의 추가' }] },
        ]
      },
      {
        id: 'library-settings', label: '설정',
        categories: [
          { id: 'tpl-settings', name: '장비 관리', children: [{ id: 'library-settings', name: '장비 관리' }] },
          {
            id: 'tpl-camera-form', name: '카메라 정보 관리',
            children: [
              { id: 'library-camera-form', name: '기본 (단일 스크롤)' },
              { id: 'library-camera-form2', name: '탭형' },
            ]
          },
          { id: 'tpl-camera-group', name: '카메라 그룹 관리', children: [{ id: 'library-camera-group', name: '카메라 그룹 관리' }] },
          { id: 'tpl-events', name: '이벤트 관리', children: [{ id: 'library-events', name: '이벤트 관리' }] },
          { id: 'tpl-alarm', name: '알림 설정', children: [{ id: 'library-alarm-settings', name: '알림 설정' }] },
          { id: 'tpl-permission', name: '권한 설정', children: [{ id: 'library-permission', name: '권한 설정' }] },
        ]
      },
      {
        id: 'library-report', label: '이력·통계',
        categories: [
          { id: 'tpl-history', name: '이력 조회', children: [{ id: 'library-history', name: '이력 조회' }] },
          { id: 'tpl-stats', name: '통계 보고서', children: [{ id: 'library-stats', name: '통계 보고서' }] },
        ]
      },
    ]
  },
  'ai-agent': {
    id: 'ai-agent',
    label: 'AI Agent',
    description: 'AI 에이전트 기반 UX 자동화 분석 및 활용성 리뷰',
    groups: [
      {
        id: 'ai-agent-review',
        label: 'UX Review',
        categories: [
          {
            id: 'tpl-ux-agent', name: 'UX Agent 활용성 리뷰',
            children: [{ id: 'library-ux-agent', name: 'UX Agent 활용성 리뷰' }]
          }
        ]
      }
    ]
  }
};

/** 유틸: 모든 카테고리를 flat 배열로 (nameToId 안에서 사용) */
export const CATEGORIES = Object.values(TIERS).flatMap(tier => 
  tier.groups ? tier.groups.flatMap(g => g.categories) : (tier.categories || [])
);

export const SPACING_MAP = ['none', 'px', '25', '50', '100', '200', '250', '300', '400', '500', '600', '800', '1000', '1200', '1300', '1400', '1500'];

export const COMPONENT_DOCS = {
  "feedback-fallback": {
    "name": "Fallback view",
    "description": "데이터 로드 실패, 빈 상태, 권한 없음 등 정상 콘텐츠를 표시할 수 없을 때 안내 일러스트와 문구, 액션 버튼을 제공하는 대체 화면 컴포넌트입니다.",
    "overview": "Fallback view는 일러스트(또는 상태 아이콘)와 안내 제목, 보조 설명 문구, 재시도 또는 후속 액션 버튼으로 구성된 대체 화면입니다. variant 속성으로 에러(error), 빈 상태(empty), 권한 없음(forbidden) 등 상황별 변형을 지원하며, 각 변형은 상태색과 문구가 달라집니다. 관제 대시보드의 패널 단위 영역과 전체 페이지 영역 모두에 배치할 수 있도록 컴팩트(compact)와 풀(full) 크기 변형을 제공합니다.",
    "properties": [
      {
        "name": "variant",
        "title": "변형 (Variant)",
        "type": "enum",
        "conditions": [
          {
            "condition": "error: 위험색 Native(#FF6363) 아이콘과 재시도 버튼을 노출하며 데이터 로드 실패 상황에 사용"
          },
          {
            "condition": "empty: 보조텍스트(#888) 톤의 일러스트로 표시 데이터 없음 상태를 안내"
          },
          {
            "condition": "forbidden: 주의색 Cautionary(#FFA938) 아이콘으로 접근 권한 없음을 표시"
          },
          {
            "condition": "기본값은 empty이며 변형에 따라 아이콘 색상과 문구 구성이 전환됨"
          }
        ]
      },
      {
        "name": "size",
        "title": "크기 (Size)",
        "type": "enum",
        "conditions": [
          {
            "condition": "compact: 패널(#1a1a1a) 내부 배치용으로 아이콘 40px, 제목 14px, 상하 여백 24px (Spacing 24)"
          },
          {
            "condition": "full: 전체 페이지 영역용으로 아이콘 72px, 제목 18px, 상하 여백 64px (Spacing 64)"
          },
          {
            "condition": "공통적으로 다크 배경(#121212) 또는 패널(#1a1a1a) 위에 가운데 정렬되며 모서리 둥글기 8px 적용"
          }
        ]
      },
      {
        "name": "action",
        "title": "액션 버튼 (Action)",
        "type": "ReactNode",
        "conditions": [
          {
            "condition": "주요 액션은 Primary(#0066FF) 채움 버튼, 호버 시 Primary Strong(#3385FF)로 전환"
          },
          {
            "condition": "버튼 높이 36px, 모서리 둥글기 8px, 라벨 14px"
          },
          {
            "condition": "error 변형에서는 재시도 라벨이 기본 제공되며 onRetry 콜백과 연결"
          },
          {
            "condition": "액션이 없으면 버튼 영역은 렌더링되지 않음"
          }
        ]
      }
    ],
    "behavior": "정상 콘텐츠가 없을 때 부모 영역을 가득 채워 가운데 정렬로 표시되며, 액션 버튼 클릭 시 연결된 콜백(재시도 등)을 호출합니다. 재시도 진행 중에는 버튼이 로딩 상태로 전환되어 중복 호출을 방지합니다.",
    "usage": "교차로 영상 분석 패널의 데이터 로드 실패 시 compact error 변형으로 재시도 버튼을, 권한이 없는 단속 통계 페이지에는 full forbidden 변형을 배치하세요. 검색 결과가 없는 차량 조회 목록처럼 정상이지만 표시할 데이터가 없는 경우에는 empty 변형을 사용합니다.",
    "code": "function CameraPanel({ status, onRetry }) {\n  if (status === 'error') {\n    return (\n      <FallbackView\n        variant='error'\n        size='compact'\n        title={'영상 데이터를 불러오지 못했습니다'}\n        description={'네트워크 상태를 확인한 뒤 다시 시도하세요'}\n        actionLabel={'재시도'}\n        onRetry={onRetry}\n      />\n    );\n  }\n  return <CameraStream />;\n}"
  },
  "feedback-pushbadge": {
    "name": "Push badge",
    "description": "아이콘이나 메뉴 항목 위에 겹쳐 미확인 알림 개수나 새 이벤트 발생을 표시하는 Primary(브랜드색) 기반의 작은 오버레이 배지이다.",
    "overview": "Push badge는 관제 대시보드의 사이드 메뉴, 툴바 아이콘, 탭 헤더 위에 절대 위치로 겹쳐 미확인 항목을 강조하는 소형 알림 표식이다. 숫자형(count)과 점형(dot, 단순 발생 표시)의 두 가지 변형을 제공한다. 신규·미확인 알림은 Primary(#0066FF)를 배경으로 사용하고, 위험·긴급(예: 장애·사고)을 알릴 때는 상태색(error #FF6363)으로 매핑한다. 개수가 99를 초과하면 99+ 형태로 축약하고, 미확인 항목이 없으면(0) 비표시(hidden) 상태로 전환된다.",
    "properties": [
      {
        "name": "variant",
        "title": "변형(Variant)",
        "type": "enum",
        "conditions": [
          {
            "condition": "count(숫자형)과 dot(점형) 두 가지 값을 가진다"
          },
          {
            "condition": "count는 미확인 개수를 중앙 정렬로 표시하고 dot은 발생 여부만 표시한다"
          },
          {
            "condition": "기본 배경은 Primary(#0066FF). 위험·긴급 알림은 상태색 error(#FF6363)로 매핑"
          }
        ]
      },
      {
        "name": "count",
        "title": "알림 개수(Count)",
        "type": "number",
        "conditions": [
          {
            "condition": "숫자형 변형에서 표시되는 미확인 항목 수"
          },
          {
            "condition": "값이 0이면 배지를 비표시 처리한다"
          },
          {
            "condition": "99 초과 시 99+ 로 축약 표기하며 최소 너비 18px 를 유지한다"
          },
          {
            "condition": "글자 색상은 흰색 FFFFFF, 글자 크기 11px 굵게"
          }
        ]
      },
      {
        "name": "size",
        "title": "크기(Size)",
        "type": "enum",
        "conditions": [
          {
            "condition": "dot 변형은 지름 8px 원형"
          },
          {
            "condition": "count 변형은 높이 18px 에 모서리 둥글기 9px(완전 둥근 형태)"
          },
          {
            "condition": "아이콘 우측 상단 모서리에 겹치도록 오프셋 배치(top -4px, right -4px)"
          },
          {
            "condition": "다크 패널(1a1a1a) 위 대비를 위해 1px 보더(2e2e2e) 적용 가능"
          }
        ]
      }
    ],
    "behavior": "새 이벤트 수신 시 배지가 페이드인으로 나타나고 개수가 실시간 갱신되며, 사용자가 항목을 확인해 카운트가 0이 되면 자동으로 비표시 상태로 전환된다.",
    "usage": "미확인 돌발관제 이벤트나 신규 교통 사고 접수처럼 운영자의 즉각 대응이 필요한 메뉴 또는 아이콘에 사용한다(예: 좌측 메뉴 돌발관제 항목 위에 미확인 3건을 숫자형으로 표시). 단순 변경 알림에는 점형을 쓰고 정보성 안내에는 위험색 배지를 남용하지 않는다.",
    "code": "import { PushBadge } from '@pintel/ui';\n\nfunction MenuIcon() {\n  return (\n    <div style={{ position: 'relative', display: 'inline-block' }}>\n      <AlertIcon />\n      <PushBadge variant='count' count={3} />\n    </div>\n  );\n}\n\nfunction StatusDot() {\n  return (\n    <div style={{ position: 'relative', display: 'inline-block' }}>\n      <CctvIcon />\n      <PushBadge variant='dot' />\n    </div>\n  );\n}"
  },
  "feedback-section-message": {
    "name": "Section message",
    "description": "특정 영역 내부에 인라인으로 표시되어 정보, 주의, 오류, 성공 상태를 좌측 아이콘과 제목 및 본문으로 전달하는 메시지 박스입니다.",
    "overview": "Section message는 관제 대시보드의 패널이나 폼 영역 안에 인라인으로 배치되어 사용자에게 맥락 기반 안내를 전달하는 컴포넌트입니다. 좌측 상태 아이콘과 제목, 본문 텍스트로 구성되며 정보(파랑), 주의(주황), 오류(빨강), 성공(초록)의 네 가지 변형을 제공합니다. 각 변형은 핀텔 다크 테마 토큰을 기반으로 상태별 색상을 적용해 교통 관제 화면에서 위험도를 직관적으로 구분하도록 설계되었습니다.",
    "properties": [
      {
        "name": "variant",
        "title": "변형(Variant)",
        "type": "enum",
        "conditions": [
          {
            "condition": "info(정보)는 Primary Strong(3385FF) 아이콘과 좌측 보더, 본문 텍스트는 기본 흰색 계열 적용"
          },
          {
            "condition": "caution(주의)는 Cautionary(FFA938) 아이콘과 좌측 보더로 경고성 상황을 표시"
          },
          {
            "condition": "error(오류)는 Native 위험(FF6363) 아이콘과 좌측 보더로 장애 또는 실패 상황을 표시"
          },
          {
            "condition": "success(성공)는 Status Positive(1ED45A) 아이콘과 좌측 보더로 정상 처리 완료를 표시"
          }
        ]
      },
      {
        "name": "title",
        "title": "제목",
        "type": "string",
        "conditions": [
          {
            "condition": "변형 상태 색상과 동일한 강조 색상으로 표기되는 한 줄 제목"
          },
          {
            "condition": "Body 기준보다 굵은 가중치를 사용하며 좌측 아이콘과 수직 정렬"
          },
          {
            "condition": "비워 두면 본문만 단독 노출"
          }
        ]
      },
      {
        "name": "children",
        "title": "본문(Content)",
        "type": "ReactNode",
        "conditions": [
          {
            "condition": "Body 14px 크기에 보조 텍스트 색상(888) 또는 기본 텍스트 색상으로 표시"
          },
          {
            "condition": "컨테이너 배경은 패널(1a1a1a) 위 입력(1e1e1e) 톤, 보더는 2e2e2e, 모서리 둥글기 8px"
          },
          {
            "condition": "좌측 패딩으로 아이콘 영역과 본문 영역을 분리해 가독성 확보"
          }
        ]
      }
    ],
    "behavior": "변형 값에 따라 좌측 아이콘과 강조 색상이 자동으로 전환되며, 본문은 여러 줄로 늘어나도 박스 높이가 내용에 맞춰 확장됩니다. 인라인 요소이므로 부모 영역의 너비를 따라 가득 차도록 배치됩니다.",
    "usage": "신호 연동 실패나 CCTV 연결 끊김 같은 장애 상황에는 error 변형을, 차량 정체 임계치 접근 등 주의가 필요한 상황에는 caution 변형을 사용하세요. 폼 영역 내 입력 안내에는 info를, 설정 저장 완료 알림에는 success를 활용하면 관제 흐름에서 상태를 일관되게 전달할 수 있습니다.",
    "tokensUsed": ["variant 색: info #3385FF · caution #FFA938 · error #FF6363 · success #1ED45A", "컨테이너 배경 #1e1e1e · 보더 #2e2e2e · radius 8", "좌측 상태색 accent 보더", "본문 Body 14px · 보조 #888"],
    "aliases": ["영역 경고", "인라인 알림", "상태 메시지", "주의 배너", "오류 안내", "정보 안내", "section message", "inline alert", "banner"],
    "antiPatterns": ["타이틀바·탭 위 전역 경고 배너로 사용 금지(영역 내부 인라인 전용)", "작은 인라인 칩/배지를 즉흥 제작하지 말 것 → 이 컴포넌트 사용", "잠깐 떴다 사라지는 일시 알림용으로 사용하지 말 것(인라인 지속 메시지 전용)"],
    "examples": ["<SectionMessage variant='caution' title='정체 임계치 접근'>강변북로 평균 속도가 기준치 이하입니다.</SectionMessage>", "<SectionMessage variant='error' title='신호 연동 실패'>제어기 연결이 끊어졌습니다. 네트워크를 확인하세요.</SectionMessage>"],
    "code": "import { SectionMessage } from '@pintel/ui';\n\nfunction SignalPanel() {\n  return (\n    <div>\n      <SectionMessage variant='error' title='신호 연동 실패'>\n        교차로 12번 신호 제어기와의 연결이 끊어졌습니다. 네트워크 상태를 확인하세요.\n      </SectionMessage>\n\n      <SectionMessage variant='caution' title='정체 임계치 접근'>\n        강변북로 구간의 평균 속도가 기준치 이하로 떨어지고 있습니다.\n      </SectionMessage>\n\n      <SectionMessage variant='success' title='설정 저장 완료'>\n        관제 구역 설정이 정상적으로 반영되었습니다.\n      </SectionMessage>\n    </div>\n  );\n}"
  },
  "loading-default": {
    "name": "Loading",
    "description": "처리 또는 데이터 수신 중임을 시각적으로 알리는 로딩 인디케이터 컴포넌트입니다.",
    "overview": "Loading은 관제 대시보드에서 교통 영상 분석, 검지 데이터 조회, 보고서 생성 등 비동기 처리가 진행되는 동안 사용자에게 진행 상태를 전달하는 컴포넌트입니다. 원형 스피너(circular)와 선형 진행 바(linear) 두 가지 변형을 제공하며, 전체화면 오버레이/특정 영역/버튼 인라인 등 적용 범위에 따라 크기와 배치가 달라집니다. 스피너는 핀텔 브랜드 컬러로 회전하여 시스템이 정상 동작 중임을 직관적으로 표현합니다.",
    "properties": [
      {
        "name": "variant",
        "title": "변형 (Variant)",
        "type": "enum",
        "conditions": [
          {
            "condition": "circular(원형 스피너) · linear(선형 진행 바) · wave(물 채움) 세 가지 값을 가짐"
          },
          {
            "condition": "circular은 회전 트랙으로 트랙은 보더색 #2e2e2e, 활성 호는 Primary Strong #3385FF 적용"
          },
          {
            "condition": "linear은 높이 4px 바로 배경 #1e1e1e 위에 Primary #0066FF 진행색 채움"
          },
          {
            "condition": "wave는 원형 컨테이너(테두리 Primary)에 value%까지 물이 차오르고 표면이 출렁이며 중앙에 퍼센트 표기 — 진행률 시각화에 사용"
          },
          {
            "condition": "무한 회전 또는 진행 시 모서리 둥글기 8px 기준의 라운드 처리"
          }
        ]
      },
      {
        "name": "scope",
        "title": "적용 범위 (Scope)",
        "type": "enum",
        "conditions": [
          {
            "condition": "fullscreen은 배경 #121212 기준 70퍼센트 불투명도 딤 레이어 위 중앙 정렬"
          },
          {
            "condition": "inline은 버튼 내부 텍스트 좌측에 16px 크기 스피너로 배치"
          },
          {
            "condition": "region은 패널 #1a1a1a 내부 중앙에 위치하며 권장 크기 40px"
          },
          {
            "condition": "보조 안내 문구는 보조텍스트 #888, Body 14px로 스피너 하단 표기"
          }
        ]
      },
      {
        "name": "status",
        "title": "상태 색상 (Status)",
        "type": "enum",
        "conditions": [
          {
            "condition": "기본 처리 중은 Primary 계열 (Primary Strong #3385FF) 회전색 사용"
          },
          {
            "condition": "경고성 대기(지연 발생)는 Cautionary #FFA938로 스피너색 전환"
          },
          {
            "condition": "오류 발생 직전 재시도 대기는 Native 위험 #FF6363 적용 가능"
          },
          {
            "condition": "정상 완료 직전 전환 피드백은 Status Positive #1ED45A 사용"
          }
        ]
      }
    ],
    "behavior": "마운트되는 즉시 스피너 회전 또는 바 진행 애니메이션을 시작하며, 처리가 완료되어 언마운트될 때 자연스럽게 사라집니다. 전체화면 변형은 반투명 딤 레이어로 하단 콘텐츠 조작을 차단하고, 영역 변형은 해당 패널 내부 중앙에 정렬됩니다.",
    "usage": "교차로 CCTV 영상 로딩이나 검지 통계 집계처럼 수 초 이상 걸리는 작업에는 원형 스피너를 영역 또는 전체화면으로 사용하고, 진행률을 알 수 있는 데이터 내보내기에는 선형 바를 권장합니다. 조회 버튼 클릭 후 응답 대기 시에는 버튼 인라인 변형으로 중복 클릭을 방지하세요.",
  },
  "loading-skeleton": {
    "name": "Skeleton",
    "description": "콘텐츠 로드 전 실제 레이아웃 형태의 회색 플레이스홀더를 표시하고 shimmer 애니메이션으로 로딩 상태를 암시하는 컴포넌트입니다.",
    "overview": "Skeleton은 데이터가 도착하기 전 화면이 비어 보이는 것을 막기 위해 실제 위젯과 동일한 형태의 회색 블록을 미리 그려 줍니다. 텍스트줄(text), 원형(circle), 카드형(card) 세 가지 변형을 제공하며, 패널 배경(#1a1a1a) 위에서 보더(#2e2e2e)와 자연스럽게 어울리는 명도로 표현됩니다. 로딩 중에는 좌우로 흐르는 shimmer가 반복되고 데이터 수신 시 실제 콘텐츠로 교체됩니다.",
    "properties": [
      {
        "name": "variant",
        "title": "변형 (Variant)",
        "type": "enum",
        "conditions": [
          {
            "condition": "text 변형은 높이 14px(Body 기준)에 모서리 4px의 가로 막대로 표현하며 width prop으로 폭을 조절한다"
          },
          {
            "condition": "circle 변형은 정원 형태로 관제 운영자 아바타나 상태 아이콘 자리에 사용한다"
          },
          {
            "condition": "card 변형은 모서리 둥글기 8px의 사각 블록으로 교통 흐름 카드나 CCTV 썸네일 영역을 대체한다"
          }
        ]
      },
      {
        "name": "loading",
        "title": "로딩 상태 (Loading)",
        "type": "boolean",
        "conditions": [
          {
            "condition": "true일 때 플레이스홀더와 shimmer를 노출하고 false일 때 자식 콘텐츠를 렌더링한다"
          },
          {
            "condition": "기본 베이스 색은 패널(#1a1a1a)보다 한 단계 밝은 회색 톤으로 보더(#2e2e2e) 근방의 명도를 사용한다"
          },
          {
            "condition": "shimmer 하이라이트는 보조텍스트(#888) 계열의 저채도 광원으로 좌에서 우로 약 1.4초 주기 반복한다"
          }
        ]
      },
      {
        "name": "size",
        "title": "크기 (Size)",
        "type": "string",
        "conditions": [
          {
            "condition": "width와 height를 px 또는 백분율로 받아 대체할 실제 위젯과 동일한 박스 크기로 맞춘다"
          },
          {
            "condition": "값을 생략하면 부모 폭을 100%로 채우고 height는 변형 기본값(text 14px)을 따른다"
          },
          {
            "condition": "여러 줄 텍스트는 마지막 줄 폭을 약 60%로 줄여 자연스러운 단락 형태를 만든다"
          }
        ]
      }
    ],
    "behavior": "loading이 true인 동안 회색 플레이스홀더 위로 shimmer가 반복 재생되며, 데이터가 도착해 loading이 false로 바뀌면 동일한 박스 위치에 실제 콘텐츠가 즉시 교체되어 레이아웃 이동(레이아웃 시프트)을 막습니다.",
    "usage": "관제 대시보드 진입 직후 교통량 차트, CCTV 썸네일, 이벤트 로그 테이블처럼 비동기로 채워지는 영역에 실제 위젯과 같은 크기로 배치해 빈 화면 깜빡임을 줄이세요. 데이터 지연이 길어질 수 있는 영상 스트림 패널에는 card 변형, 운영자 목록에는 circle과 text 조합을 권장합니다.",
    "code": "import { Skeleton } from '@pintel/ui';\n\nfunction TrafficPanel({ loading, data }) {\n  if (loading) {\n    return (\n      <div style={{ padding: 16 }}>\n        <Skeleton variant='card' width='100%' height={180} />\n        <Skeleton variant='text' width='70%' />\n        <Skeleton variant='text' width='40%' />\n      </div>\n    );\n  }\n  return <TrafficChart data={data} />;\n}\n\nfunction OperatorRow({ loading }) {\n  return (\n    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>\n      <Skeleton variant='circle' width={32} height={32} loading={loading} />\n      <Skeleton variant='text' width={120} loading={loading} />\n    </div>\n  );\n}"
  },
  "nav-page-counter": {
    "name": "Page counter",
    "description": "현재 페이지와 전체 페이지 수를 (3 / 12) 형태로 간결히 표시하는 위치 인디케이터 컴포넌트입니다.",
    "overview": "Page counter는 현재 페이지 값, 구분자(슬래시), 전체 페이지 값으로 구성되어 캐러셀이나 리스트, 문서 뷰에서의 현재 위치를 한눈에 안내합니다. 현재 값은 기본 텍스트로, 전체 값과 구분자는 보조 텍스트(#888)로 처리하여 위계를 둡니다. 활성(기본), 비활성(단일 페이지), 강조(현재 값 Primary Strong #3385FF) 변형을 지원하며 다크 패널(#1a1a1a) 위에서 사용됩니다.",
    "properties": [
      {
        "name": "current",
        "title": "현재 페이지 (Current)",
        "type": "number",
        "conditions": [
          {
            "condition": "1 이상 total 이하의 정수값을 표시"
          },
          {
            "condition": "기본 텍스트 14px, 강조 변형 시 Primary Strong #3385FF 적용"
          },
          {
            "condition": "total 초과 값 입력 시 total로 클램프 처리"
          }
        ]
      },
      {
        "name": "total",
        "title": "전체 페이지 (Total)",
        "type": "number",
        "conditions": [
          {
            "condition": "전체 페이지 수를 보조 텍스트(#888)로 표시"
          },
          {
            "condition": "구분자 슬래시도 동일하게 보조 텍스트(#888) 적용"
          },
          {
            "condition": "값이 1일 때 비활성 변형으로 전환되어 흐리게(#888) 단일 표기"
          }
        ]
      },
      {
        "name": "size",
        "title": "크기 (Size)",
        "type": "enum",
        "conditions": [
          {
            "condition": "sm(12px), md(14px 기본), lg(16px) 세 단계 제공"
          },
          {
            "condition": "컨테이너 패딩은 좌우 8px (Spacing 08) 기준 모서리 둥글기 8px 적용"
          },
          {
            "condition": "패널 배경(#1a1a1a) 위 보더(#2e2e2e) 선택적으로 사용"
          }
        ]
      }
    ],
    "behavior": "current 값이 변경되면 숫자만 즉시 갱신되며 구분자와 total은 고정된 채 위치 위계를 유지합니다. total이 1이면 자동으로 비활성 변형이 적용되어 보조 텍스트 색(#888)으로 흐리게 표시됩니다.",
    "usage": "교통 관제 화면에서 다중 CCTV 스냅샷 캐러셀이나 돌발상황 이벤트 리스트의 페이지네이션 위치 안내에 사용합니다. 현재 페이지를 강조해야 하는 경우(예: 우선순위 이벤트 페이지)에는 강조 변형으로 current 값에 Primary Strong(#3385FF)을 적용하세요.",
    "code": "function PageCounter({ current, total, size = 'md' }) {\n  const fontSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;\n  const muted = { color: '#888' };\n  return (\n    <span\n      style={{\n        display: 'inline-flex',\n        alignItems: 'center',\n        gap: 4,\n        padding: '0 8px',\n        borderRadius: 8,\n        background: '#1a1a1a',\n        fontSize,\n        color: '#fff',\n      }}\n    >\n      <strong>{Math.min(current, total)}</strong>\n      <span style={muted}>/</span>\n      <span style={muted}>{total}</span>\n    </span>\n  );\n}\n\n// 사용 예 (교통 관제 CCTV 캐러셀)\n<PageCounter current={3} total={12} size='md' />"
  },
  "nav-pagination": {
    "name": "Pagination",
    "description": "여러 페이지로 나뉜 목록에서 번호 버튼과 이전/다음 화살표로 페이지를 이동하고 현재 페이지를 강조하는 페이지 컨트롤이다.",
    "overview": "Pagination은 페이지 번호 버튼, 이전/다음 화살표, 생략 표시(...)로 구성되며 활성 페이지를 강조해 현재 위치를 알려준다. 다크 테마의 관제 대시보드에서 대량의 이벤트 로그나 장비 목록을 분할 탐색할 때 사용한다. 기본, 활성(선택), 호버, 비활성(첫/끝 페이지의 화살표) 상태를 가진다.",
    "properties": [
      {
        "name": "current-page",
        "title": "현재 페이지 (Current Page)",
        "type": "number",
        "conditions": [
          {
            "condition": "활성 페이지 버튼은 배경 Primary(#0066FF) 흰색 텍스트로 강조한다"
          },
          {
            "condition": "호버 시 Primary Strong(#3385FF)로 밝아진다"
          },
          {
            "condition": "비활성 번호 버튼은 패널 배경(#1a1a1a) 보조텍스트(#888)를 사용한다"
          },
          {
            "condition": "버튼 크기는 32px 정사각, 모서리 둥글기 8px를 적용한다"
          }
        ]
      },
      {
        "name": "sibling-count",
        "title": "표시 번호 개수 (Sibling Count)",
        "type": "number",
        "conditions": [
          {
            "condition": "현재 페이지 좌우로 노출할 번호 개수를 지정한다(기본 1)"
          },
          {
            "condition": "범위를 벗어난 구간은 생략 표시(...)로 접는다"
          },
          {
            "condition": "생략 표시는 보조텍스트(#888) 색상으로 표기한다"
          },
          {
            "condition": "번호 사이 간격은 4px (Spacing 04)로 정렬한다"
          }
        ]
      },
      {
        "name": "on-page-change",
        "title": "페이지 변경 콜백 (On Page Change)",
        "type": "function",
        "conditions": [
          {
            "condition": "번호나 화살표 클릭 시 선택된 페이지 번호를 전달한다"
          },
          {
            "condition": "첫 페이지에서는 이전 화살표, 끝 페이지에서는 다음 화살표를 비활성(보더 #2e2e2e, 텍스트 #888)으로 처리한다"
          },
          {
            "condition": "비활성 화살표는 콜백을 발생시키지 않는다"
          }
        ]
      }
    ],
    "behavior": "번호나 화살표를 클릭하면 해당 페이지로 이동하며 활성 버튼이 Primary(#0066FF)로 강조된다. 페이지 수가 많아 표시 범위를 넘어서면 중간 구간을 생략 표시(...)로 접고 첫/끝 페이지는 항상 노출한다.",
    "usage": "교통 돌발 이벤트 로그나 CCTV 장비 목록처럼 수백 건 이상의 행을 다루는 테이블 하단에 배치해 페이지 단위로 탐색하게 한다. 한 화면 행 수(예: 20건)에 맞춰 총 페이지를 산출하고, 모바일 협폭 화면에서는 sibling-count를 줄여 번호 노출을 최소화한다.",
    "code": "import { Pagination } from '@pintel/ui';\n\nfunction EventLogFooter() {\n  const [page, setPage] = useState(1);\n\n  return (\n    <Pagination\n      currentPage={page}\n      totalPages={42}\n      siblingCount={1}\n      onPageChange={(next) => setPage(next)}\n    />\n  );\n}"
  },
  "nav-pagination-dots": {
    "name": "Pagination dots",
    "description": "캐러셀이나 온보딩 흐름의 현재 페이지 위치를 점(dot) 묶음으로 표시하고 활성 점을 브랜드 컬러로 강조하는 인디케이터입니다.",
    "overview": "Pagination dots는 전체 페이지 수만큼의 점과 현재 위치를 나타내는 활성 점으로 구성되며, 다크 패널(#1a1a1a) 위에서 위치 맥락을 가볍게 전달합니다. 점은 기본(비활성), 활성, 호버/포커스 상태를 가지며 활성 점은 Primary Strong(#3385FF)로 확대 또는 가로 확장되어 강조됩니다. 관제 대시보드의 좁은 카드형 슬라이드나 온보딩 단계 표시처럼 정보 밀도가 높은 화면에서 최소한의 시각 요소로 진행 상황을 알려 줍니다.",
    "properties": [
      {
        "name": "count",
        "title": "전체 점 개수 (count)",
        "type": "number",
        "conditions": [
          {
            "condition": "슬라이드 또는 온보딩 단계 수만큼 점을 렌더링"
          },
          {
            "condition": "점 사이 간격 8px (Spacing 08) 고정 가로 정렬"
          },
          {
            "condition": "점이 8개를 넘으면 양 끝 점을 축소(4px)해 말줄임 형태로 표시 권장"
          }
        ]
      },
      {
        "name": "activeIndex",
        "title": "활성 인덱스 (activeIndex)",
        "type": "number",
        "conditions": [
          {
            "condition": "현재 페이지에 해당하는 점을 활성 상태로 지정"
          },
          {
            "condition": "활성 점 색상 Primary Strong(#3385FF), 비활성 점 보조텍스트(#888)"
          },
          {
            "condition": "활성 점은 6px 원에서 18px 너비의 라운드 바(둥글기 8px)로 확장되며 전환 200ms"
          },
          {
            "condition": "비활성 점 기본 크기 6px 원형"
          }
        ]
      },
      {
        "name": "interactive",
        "title": "클릭 이동 여부 (interactive)",
        "type": "boolean",
        "conditions": [
          {
            "condition": "true이면 점 클릭으로 해당 페이지 이동, false이면 표시 전용"
          },
          {
            "condition": "호버 시 비활성 점 색상이 보더(#2e2e2e)에서 Primary(#0066FF)로 변경"
          },
          {
            "condition": "키보드 포커스 링 Primary Heavy(#0052CC) 2px"
          }
        ]
      }
    ],
    "behavior": "activeIndex가 변경되면 이전 활성 점은 6px 원으로 축소되고 새 활성 점은 18px 라운드 바로 확장되며 색상이 Primary Strong(#3385FF)로 200ms 전환됩니다. interactive가 true일 때 점 클릭이나 방향키 입력으로 페이지를 이동하고 포커스 링(Primary Heavy #0052CC)으로 현재 대상을 표시합니다.",
    "usage": "교통 관제 카드 슬라이드(예: 교차로별 혼잡도 요약 페이지 전환)나 초기 온보딩 단계 안내에서 페이지 위치를 가볍게 보여줄 때 사용하며, 점 개수가 8개를 넘으면 숫자 페이지네이션으로 대체하는 것을 권장합니다. 표시 전용이 기본이고, 사용자가 직접 페이지를 넘겨야 하는 경우에만 interactive를 활성화하세요.",
    "code": "import { PaginationDots } from '@pintel/ui';\n\nfunction CongestionCarousel() {\n  const [page, setPage] = useState(0);\n\n  return (\n    <PaginationDots\n      count={5}\n      activeIndex={page}\n      interactive\n      onChange={setPage}\n    />\n  );\n}"
  },
  "nav-progress-indicator": {
    "name": "Progress indicator",
    "description": "작업 진행률(0~100%)을 선형 또는 원형 형태로 시각화하여 처리 상태를 직관적으로 전달하는 인디케이터입니다.",
    "overview": "Progress indicator는 트랙(배경 바)과 채움(progress fill)으로 구성되며, 선형(Linear)과 원형(Circular) 두 가지 변형을 제공합니다. 진행률이 확정된 작업에는 determinate 상태를, 종료 시점을 알 수 없는 작업에는 흐름 애니메이션이 반복되는 indeterminate 상태를 사용합니다. 채움색은 핀텔 Primary(#0066FF)를 기본으로 하며, 다크 패널(#1a1a1a) 위에서 진행 상태를 명확히 구분합니다.",
    "properties": [
      {
        "name": "variant",
        "title": "변형 (Variant)",
        "type": "enum",
        "conditions": [
          {
            "condition": "linear(선형) 또는 circular(원형) 중 선택"
          },
          {
            "condition": "선형 트랙 높이는 6px, 모서리 둥글기 8px 적용"
          },
          {
            "condition": "원형은 지름 40px 기준, 스트로크 두께 4px"
          },
          {
            "condition": "트랙 배경은 보더 색(#2e2e2e), 채움은 Primary(#0066FF)"
          }
        ]
      },
      {
        "name": "mode",
        "title": "진행 모드 (Mode)",
        "type": "enum",
        "conditions": [
          {
            "condition": "determinate는 value(0~100) 비율만큼 채움색(#0066FF)으로 표시"
          },
          {
            "condition": "indeterminate는 채움 막대가 트랙을 반복 이동하는 흐름 애니메이션"
          },
          {
            "condition": "완료(100%)는 Status Positive(#1ED45A)로 전환 가능"
          },
          {
            "condition": "지연 또는 경고 상태는 Cautionary(#FFA938)로 채움색 대체"
          }
        ]
      },
      {
        "name": "value",
        "title": "진행 값 (Value)",
        "type": "number",
        "conditions": [
          {
            "condition": "0에서 100 사이의 정수로 진행 비율 지정"
          },
          {
            "condition": "선형 변형에서는 우측에 보조텍스트(#888) 14px로 퍼센트 병기 가능"
          },
          {
            "condition": "determinate 모드에서만 유효하며 indeterminate에서는 무시됨"
          }
        ]
      }
    ],
    "behavior": "determinate 모드에서는 value 변경 시 채움 폭(또는 원호 길이)이 부드럽게 전환되며, indeterminate 모드에서는 채움 막대가 트랙을 따라 반복 이동하는 애니메이션이 동작합니다. 작업 완료 시 채움색을 Primary(#0066FF)에서 Status Positive(#1ED45A)로 바꿔 종료 상태를 시각적으로 강조할 수 있습니다.",
    "usage": "진행 비율을 알 수 있는 작업(예: 교통 영상 분석 작업 큐 처리율, 누적 데이터 마이그레이션)에는 determinate 선형 변형을, 응답 대기처럼 종료 시점을 알 수 없는 작업(예: 관제 서버 연결 시도)에는 indeterminate 원형 변형을 사용합니다. 진행 지연이나 임계 초과가 감지되면 채움색을 Cautionary(#FFA938)로 바꿔 운영자가 즉시 인지하도록 합니다.",
    "code": "import { ProgressIndicator } from '@pintel/ui';\n\nfunction AnalysisQueueStatus() {\n  return (\n    <div>\n      <ProgressIndicator\n        variant='linear'\n        mode='determinate'\n        value={72}\n        showLabel\n      />\n\n      <ProgressIndicator\n        variant='circular'\n        mode='indeterminate'\n      />\n    </div>\n  );\n}"
  },
  "nav-progress-tracker": {
    "name": "Progress tracker",
    "description": "다단계 절차의 진행 상태를 단계 원형과 연결선으로 시각화하는 스텝퍼 컴포넌트입니다.",
    "overview": "Progress tracker는 단계 원형(노드), 노드를 잇는 연결선, 단계 라벨로 구성된 스텝퍼입니다. 각 노드는 완료(체크 아이콘), 현재(강조), 대기(회색) 세 가지 상태를 가지며 가로 또는 세로 방향 변형을 지원합니다. 관제 대시보드의 다단계 작업 흐름에서 사용자가 전체 절차 중 현재 위치를 한눈에 파악하도록 돕습니다.",
    "properties": [
      {
        "name": "steps",
        "title": "단계 목록 (Steps)",
        "type": "array",
        "conditions": [
          {
            "condition": "각 단계 객체는 label(단계명)과 선택적 description(보조 설명)을 가짐"
          },
          {
            "condition": "노드 원형은 지름 28px 둥근 원형이며 노드 간 연결선 두께 2px"
          },
          {
            "condition": "라벨은 Body 14px, 보조 설명은 12px 보조텍스트 색상 (#888) 적용"
          },
          {
            "condition": "가로 방향은 노드와 라벨 세로 정렬, 세로 방향은 노드 우측에 라벨 배치"
          }
        ]
      },
      {
        "name": "activeStep",
        "title": "현재 단계 (Active step)",
        "type": "number",
        "conditions": [
          {
            "condition": "0부터 시작하는 인덱스로 현재 진행 중인 단계를 지정"
          },
          {
            "condition": "완료 단계 노드는 Status Positive (#1ED45A) 배경에 흰색 체크 아이콘 표시"
          },
          {
            "condition": "현재 단계 노드는 Primary Strong (#3385FF) 배경과 0066FF 외곽 글로우로 강조"
          },
          {
            "condition": "대기 단계 노드는 입력 배경 (#1e1e1e)에 보더 (#2e2e2e), 번호 텍스트는 보조텍스트 (#888)"
          }
        ]
      },
      {
        "name": "orientation",
        "title": "배치 방향 (Orientation)",
        "type": "enum",
        "conditions": [
          {
            "condition": "horizontal(기본) 또는 vertical 중 선택"
          },
          {
            "condition": "패널 배경 (#1a1a1a) 위에 배치하며 컨테이너 모서리 둥글기 8px 적용"
          },
          {
            "condition": "완료된 구간의 연결선은 Status Positive (#1ED45A), 미완료 구간은 보더 색 (#2e2e2e)"
          },
          {
            "condition": "좁은 패널이나 사이드 영역에서는 vertical, 상단 헤더 영역에서는 horizontal 권장"
          }
        ]
      }
    ],
    "behavior": "activeStep 값이 변경되면 해당 단계까지의 노드와 연결선이 완료 상태로 전환되고 현재 단계 노드가 강조됩니다. 완료 단계 노드를 클릭하면 onStepClick 콜백으로 이전 단계 이동을 트리거할 수 있습니다.",
    "usage": "교통 신호 제어 배포, 장비 점검 절차, 사고 대응 워크플로우처럼 순차 단계가 명확한 관제 작업에서 화면 상단에 배치해 진행 상황을 표시하세요. 단계 수는 3개에서 6개 사이를 권장하며 라벨은 간결한 명사형으로 작성합니다.",
    "code": "import { ProgressTracker } from '@pintel/ui';\n\nfunction IncidentFlow() {\n  const steps = [\n    { label: 'Detect', description: 'Anomaly detected' },\n    { label: 'Verify', description: 'Confirm event' },\n    { label: 'Dispatch', description: 'Notify units' },\n    { label: 'Resolve', description: 'Clear scene' },\n  ];\n\n  return (\n    <ProgressTracker\n      steps={steps}\n      activeStep={1}\n      orientation='horizontal'\n      onStepClick={(index) => console.log('go to', index)}\n    />\n  );\n}"
  },
  "nav-tab": {
    "name": "Tab",
    "description": "같은 화면 안에서 콘텐츠 섹션을 전환하는 가로형 탭 내비게이션으로, 활성 탭 하단에 브랜드 컬러 언더라인을 표시합니다.",
    "overview": "Tab은 가로로 나열된 라벨과 활성 탭 하단의 브랜드 컬러 언더라인으로 구성되며, 페이지 내 섹션 전환에 사용합니다. 기본(비활성), 활성, 호버, 비활성화(disabled) 상태를 가지며 라벨에 카운트 배지를 함께 표기하는 변형을 지원합니다. 필터 목적의 세그먼트 컨트롤과 달리 화면 레이아웃 수준의 콘텐츠 묶음을 전환하는 용도로 구분해 사용합니다.",
    "properties": [
      {
        "name": "active",
        "title": "활성 상태 (Active State)",
        "type": "boolean",
        "conditions": [
          {
            "condition": "활성 탭 라벨은 기본 텍스트(흰색 계열)와 하단 언더라인 2px 브랜드 컬러(#3385FF Primary Strong) 적용"
          },
          {
            "condition": "비활성 탭 라벨은 보조텍스트(#888) 색상에 언더라인 없음"
          },
          {
            "condition": "호버 시 라벨 색상이 밝아지며 #0066FF(Primary) 톤의 미세한 하단 인디케이터 노출"
          },
          {
            "condition": "disabled 탭은 #888보다 흐린 톤으로 표시되고 포인터 이벤트 차단"
          }
        ]
      },
      {
        "name": "label",
        "title": "탭 라벨 (Label)",
        "type": "string",
        "conditions": [
          {
            "condition": "Body 14px 기준 가로 라벨, 좌우 패딩 16px (Spacing 16) 상하 패딩 8px (Spacing 08)"
          },
          {
            "condition": "라벨 옆 카운트 배지는 패널 톤(#1a1a1a) 위 모서리 둥글기 8px 적용"
          },
          {
            "condition": "이벤트 발생 강조가 필요한 배지는 위험(#FF6363) 또는 주의(#FFA938) 컬러로 표기"
          }
        ]
      },
      {
        "name": "variant",
        "title": "변형 (Variant)",
        "type": "enum",
        "conditions": [
          {
            "condition": "default: 텍스트 라벨만 가진 기본형, 다크 배경(#121212) 위 사용"
          },
          {
            "condition": "with-badge: 라벨 우측에 카운트/상태 배지를 결합한 형태"
          },
          {
            "condition": "underline: 활성 탭 하단 언더라인을 보더(#2e2e2e) 기준선 위에 브랜드 컬러로 강조하는 형태"
          }
        ]
      }
    ],
    "behavior": "탭 라벨을 클릭하면 해당 탭이 활성으로 전환되어 하단 언더라인이 선택 위치로 이동하고 연결된 콘텐츠 패널이 즉시 교체됩니다. 비활성화(disabled)된 탭은 클릭에 반응하지 않고 흐린 톤으로 표시됩니다.",
    "usage": "관제 상세 화면에서 실시간 영상, 검지 이력, 장비 상태처럼 한 화면에 묶인 섹션을 전환할 때 사용합니다(예: 교차로 상세 패널 상단의 영상 / 통계 / 이벤트 전환). 동시에 노출하는 탭은 5개 이내로 유지하는 것을 권장합니다.",
    "code": "import { Tab, TabList, TabPanel } from '@pintel/ui';\n\nfunction IntersectionDetail() {\n  const [active, setActive] = useState('video');\n\n  return (\n    <TabList value={active} onChange={setActive}>\n      <Tab value='video' label='실시간 영상' />\n      <Tab value='stats' label='검지 통계' />\n      <Tab value='events' label='이벤트' badge={3} badgeTone='native' />\n      <Tab value='device' label='장비 상태' disabled />\n\n      <TabPanel value='video'>{/* CCTV 스트림 */}</TabPanel>\n      <TabPanel value='stats'>{/* 검지 통계 차트 */}</TabPanel>\n      <TabPanel value='events'>{/* 이벤트 목록 */}</TabPanel>\n    </TabList>\n  );\n}"
  },
  "nav-top": {
    "name": "Top navigation",
    "description": "PREVAX 전 화면이 공유하는 상단 크롬(앱바)입니다. 정본은 Library의 PrevaxTitleBar 컴포넌트이며, 브랜드·권한(좌) · 경고 배너(중앙) · 상태·시각·언어·계정·창 컨트롤(우)로 구성됩니다.",
    "overview": "Top navigation은 PREVAX의 모든 화면이 공유하는 상단 타이틀바 크롬으로, 정본은 Library.jsx의 PrevaxTitleBar 컴포넌트입니다(타이틀바·탭바 공통 크롬). 구성은 ① 좌측 브랜드 로고·'PREVAX 4'·현재 권한(예: 마스터) ② 중앙 경고 배너(Cautionary, 선택) ③ 우측 상태 표시등·현재 시각·언어 선택·계정 메뉴(자리비움/사용자정보/로그아웃)·창 컨트롤(— ▢ ✕)입니다. 높이 40px, 배경 #141417, 하단 보더로 본문과 구분됩니다. 새 화면을 만들 때는 이 앱바를 새로 그리지 말고 PrevaxTitleBar를 그대로 가져와 시각 일관성을 유지하세요.",
    "properties": [
      {
        "name": "title",
        "title": "타이틀 (Title)",
        "type": "string",
        "conditions": [
          {
            "condition": "좌측에 현재 화면 위치를 표시하는 기본 텍스트"
          },
          {
            "condition": "글자 크기 16px, 색상 기본 텍스트(#fff 계열)로 강조"
          },
          {
            "condition": "뒤로가기 아이콘이 있을 경우 아이콘 우측 8px 간격으로 배치"
          },
          {
            "condition": "교통 관제 맥락에서 교차로 상세나 CCTV 채널명 등을 표기"
          }
        ]
      },
      {
        "name": "showBack",
        "title": "뒤로가기 버튼 (Back button)",
        "type": "boolean",
        "conditions": [
          {
            "condition": "true일 때 좌측에 24px 크기의 뒤로가기 아이콘 노출"
          },
          {
            "condition": "기본 아이콘 색상은 보조 텍스트(#888), 호버 시 Primary Strong(#3385FF)"
          },
          {
            "condition": "상위 화면으로 이동하는 진입점 역할"
          },
          {
            "condition": "최상위 화면에서는 false로 두어 타이틀만 표시"
          }
        ]
      },
      {
        "name": "actions",
        "title": "우측 액션 (Right actions)",
        "type": "ReactNode",
        "conditions": [
          {
            "condition": "우측 정렬되는 아이콘 버튼 그룹(권장 최대 3개)"
          },
          {
            "condition": "아이콘 24px, 버튼 영역 둥글기 8px, 아이콘 간 간격 12px (Spacing 12)"
          },
          {
            "condition": "위험 상태 알림 배지는 Native(위험) #FF6363, 주의 알림은 Cautionary #FFA938 사용"
          },
          {
            "condition": "활성(눌림) 상태는 Primary(#0066FF) 배경으로 표시"
          }
        ]
      }
    ],
    "behavior": "뒤로가기 버튼을 누르면 이전 화면으로 이동하고, 우측 액션 아이콘은 호버 시 보조 텍스트(#888)에서 Primary Strong(#3385FF)으로 전환되며 클릭 시 화면 단위 동작(새로고침, 알림 열기 등)을 실행합니다. 화면 스크롤과 무관하게 상단에 고정되어 항상 현재 위치를 노출합니다.",
    "usage": "모든 PREVAX 화면의 최상단에 PrevaxTitleBar를 배치해 통일된 크롬을 유지합니다. 좌측은 브랜드·권한 표시, 중앙은 서버 지연·미조치 등 전역 경고(Cautionary 배너), 우측은 접속 상태·시각·언어·계정 메뉴·창 컨트롤을 담당합니다. 새 화면에서 상단 바를 임의로 다시 만들지 말고 PrevaxTitleBar를 가져와 재사용하세요. 화면 안 콘텐츠 전환은 Top navigation이 아니라 탭(Tab)·Category를 사용합니다.",
    "antiPatterns": ["상단 바를 화면마다 새로 그리지 말 것 → PrevaxTitleBar 재사용", "화면 내 콘텐츠 섹션 전환에는 사용 금지 → Tab/Category 사용", "우측 계정·창 컨트롤 영역을 임의 커스텀하지 말 것(전 화면 통일 유지)"],
    "code": "import { TopNavigation } from '@pintel/ui';\n\nfunction IntersectionDetailHeader() {\n  return (\n    <TopNavigation\n      showBack\n      title='강남대로 12번 교차로'\n      onBack={() => history.back()}\n      actions={[\n        <IconButton key='refresh' icon='refresh' onClick={handleRefresh} />,\n        <IconButton key='alert' icon='alert' badge='danger' onClick={openAlerts} />,\n      ]}\n    />\n  );\n}"
  },
  "present-autocomplete": {
    "name": "Autocomplete",
    "description": "사용자가 입력하는 동안 일치하는 추천 항목을 드롭다운으로 제시해 빠르게 선택하도록 돕는 입력 컴포넌트입니다.",
    "overview": "Autocomplete는 텍스트 입력 필드와 그 아래 펼쳐지는 추천 목록 드롭다운, 그리고 각 추천 항목으로 구성됩니다. 입력 디바운스를 통해 불필요한 호출을 줄이고, 입력값과 일치하는 부분을 강조해 표시하며 키보드 위아래 화살표로 항목을 탐색할 수 있습니다. 기본(닫힘), 입력중(드롭다운 열림), 항목 강조(hover/focus), 비활성, 결과 없음 등의 상태와 단일 선택 변형을 지원합니다.",
    "properties": [
      {
        "name": "input-field",
        "title": "입력 필드 (Input Field)",
        "type": "string",
        "conditions": [
          {
            "condition": "배경 입력 #1e1e1e, 보더 #2e2e2e 1px, 모서리 둥글기 8px"
          },
          {
            "condition": "본문 글자 14px, 입력 텍스트 흰색 계열, 플레이스홀더 보조텍스트 #888"
          },
          {
            "condition": "포커스 시 보더가 Primary Strong #3385FF 로 강조"
          },
          {
            "condition": "비활성 상태에서는 보더 #2e2e2e 유지하고 텍스트 #888 로 흐리게 처리"
          }
        ]
      },
      {
        "name": "suggestion-list",
        "title": "추천 목록 드롭다운 (Suggestion List)",
        "type": "ReactNode",
        "conditions": [
          {
            "condition": "패널 배경 #1a1a1a, 보더 #2e2e2e, 모서리 둥글기 8px"
          },
          {
            "condition": "항목 hover 또는 키보드 선택 시 배경 Primary #0066FF"
          },
          {
            "condition": "입력값과 일치하는 텍스트는 Primary Strong #3385FF 로 강조"
          },
          {
            "condition": "결과가 없을 때 보조텍스트 #888 로 안내 문구(검색 결과 없음) 표시"
          }
        ]
      },
      {
        "name": "debounce",
        "title": "입력 디바운스 (Debounce)",
        "type": "number",
        "conditions": [
          {
            "condition": "입력 후 추천 호출까지 대기 시간을 밀리초 단위로 지정 (기본 250)"
          },
          {
            "condition": "연속 입력 시 마지막 입력 기준으로만 추천 목록 갱신"
          },
          {
            "condition": "호출 대기 중에는 기존 목록 유지 또는 로딩 표시 가능"
          }
        ]
      }
    ],
    "behavior": "사용자가 입력하면 디바운스 시간 경과 후 추천 목록을 갱신하고, 위아래 화살표로 항목을 이동하며 Enter 로 선택하고 Esc 로 드롭다운을 닫습니다. 선택된 항목의 값이 입력 필드에 반영되며 드롭다운은 자동으로 닫힙니다.",
    "usage": "교통 관제 대시보드에서 교차로명이나 CCTV 지점명을 빠르게 찾을 때 사용하며(예: 강남대로 입력 시 일치 지점 추천), 항목 수가 많아 일일이 스크롤하기 어려운 검색 입력에 권장합니다.",
    "code": "import { Autocomplete } from '@pintel/ui';\n\nfunction IntersectionSearch() {\n  const options = ['강남대로 교차로', '강남역 사거리', '강변북로 IC'];\n\n  return (\n    <Autocomplete\n      placeholder='교차로 또는 CCTV 지점 검색'\n      options={options}\n      debounce={250}\n      highlightMatch\n      onSelect={(value) => focusOnMap(value)}\n    />\n  );\n}"
  },
  "present-popover": {
    "name": "Popover",
    "description": "여러 오버레이 컴포넌트(Menu·Select·Autocomplete·Filter 패널)가 공유하는 기반 오버레이 프리미티브입니다. 앵커 요소에 위치를 맞춰 떠오르고 임의 콘텐츠를 담으며 외부 클릭 시 닫힙니다.",
    "overview": "Popover는 '앵커에 붙어 뜨는 소형 오버레이'라는 기반 패턴이며, 이 디자인 시스템의 Menu(우클릭 액션 목록)·Select(선택 드롭다운)·Autocomplete(추천 드롭다운)·Filter button(필터 패널)이 모두 이 패턴의 특수형입니다. 구성은 앵커(기준 요소)·본문 콘텐츠·방향 화살표(arrow)이며, 열림/닫힘 상태와 상하좌우 배치(placement)를 지원합니다. 위 특수형에 해당하지 않는 '클릭 시 뜨는 임의 콘텐츠'(빠른 상세 카드·설정 팝 등)가 필요할 때 Popover를 직접 사용하고, 목적이 분명하면 해당 전용 컴포넌트를 우선 사용하세요. 다크 패널(1a1a1a)·보더(2e2e2e)·8px 둥글기로 다른 패널과 시각적 일관성을 맞춥니다.",
    "properties": [
      {
        "name": "placement",
        "title": "배치 방향 (Placement)",
        "type": "enum",
        "conditions": [
          {
            "condition": "top, bottom, left, right 네 방향과 각 모서리 정렬(start/end)을 지원"
          },
          {
            "condition": "화살표(arrow)는 앵커 중심을 향하도록 8px 크기로 패널 보더(2e2e2e)와 동일 색으로 렌더링"
          },
          {
            "condition": "화면 경계 충돌 시 반대 방향으로 자동 플립되며 앵커와 본문 사이 간격은 8px (Spacing 08) 유지"
          }
        ]
      },
      {
        "name": "open",
        "title": "열림 상태 (Open State)",
        "type": "boolean",
        "conditions": [
          {
            "condition": "true일 때 패널 배경 1a1a1a, 보더 1px 2e2e2e, 둥글기 8px로 페이드인"
          },
          {
            "condition": "본문 기본 텍스트는 14px, 보조 설명은 보조텍스트 색 888 적용"
          },
          {
            "condition": "외부 클릭 또는 Esc 입력 시 false로 전환되며 화살표와 함께 페이드아웃"
          }
        ]
      },
      {
        "name": "variant",
        "title": "강조 변형 (Variant)",
        "type": "enum",
        "conditions": [
          {
            "condition": "default는 패널 배경(1a1a1a) 기반의 정보 표시용"
          },
          {
            "condition": "info 강조 시 좌측 보더 또는 헤더에 Primary Strong(3385FF) 사용"
          },
          {
            "condition": "상태 알림용으로 정상 Positive(1ED45A), 주의 Cautionary(FFA938), 위험 Native(FF6363) 토큰으로 화살표와 헤더 강조 가능"
          }
        ]
      }
    ],
    "behavior": "앵커를 클릭하거나 호버하면 지정된 placement 방향으로 부드럽게 페이드인되며, 화살표가 앵커를 가리키도록 자동 정렬됩니다. 오버레이 외부를 클릭하거나 Esc 키를 누르면 닫히고, 화면 경계에 닿으면 반대 방향으로 위치가 자동 보정됩니다.",
    "usage": "전용 컴포넌트가 없는 범용 오버레이에 직접 사용합니다 — 예: 지도/차트 마커 클릭 시 뜨는 교통 이벤트 상세 카드, 빠른 설정 팝. 목적이 분명한 경우에는 전용 컴포넌트를 쓰세요: 목록 선택=Select, 입력 추천=Autocomplete, 필터 조건 패널=Filter button, 우클릭 액션=Menu. 넓은 정보나 입력 폼이 필요하면 Popover 대신 모달(Popup)을 사용합니다. 본문은 14px Body 텍스트와 8px 둥글기 기준을 유지해 다른 패널과 시각적 일관성을 맞춥니다.",
    "antiPatterns": ["드롭다운 선택을 raw Popover로 다시 만들지 말 것 → Select 사용", "추천 드롭다운은 Autocomplete · 필터 패널은 Filter button · 우클릭 메뉴는 Menu 사용", "넓은 콘텐츠·입력 폼에는 Popover 대신 모달(Popup) 사용"],
    "code": "import { Popover } from '@pintel/ui';\n\nfunction IntersectionMarker() {\n  return (\n    <Popover\n      placement='top'\n      variant='info'\n      anchor={<CctvIcon id='C-204' />}\n    >\n      <Popover.Header>교차로 C-204 상태</Popover.Header>\n      <Popover.Body>\n        <p>혼잡도: 높음</p>\n        <p>최근 이벤트: 신호 위반 감지</p>\n      </Popover.Body>\n    </Popover>\n  );\n}"
  },
  "present-popup": {
    "name": "Popup",
    "description": "화면 중앙에 딤 배경과 함께 떠오르며 타이틀, 본문, 확인/취소 액션을 제공하는 모달 대화상자(Dialog) 컴포넌트입니다.",
    "overview": "Popup은 관제 화면 위에 반투명 딤 레이어를 깔고 그 중앙에 패널을 띄워 사용자의 즉각적인 결정을 요구하는 모달입니다. 헤더(타이틀), 본문(메시지 또는 커스텀 콘텐츠), 푸터(확인/취소 액션 버튼)의 3단 구조로 이루어집니다. 변형으로는 일반 안내형과 위험 작업을 강조하는 위험(danger)형이 있으며, 열림/닫힘 상태에 따라 페이드와 스케일 전환 애니메이션을 가집니다.",
    "properties": [
      {
        "name": "variant",
        "title": "변형 (Variant)",
        "type": "enum",
        "conditions": [
          {
            "condition": "default(기본)는 확인 버튼 배경에 Primary(파랑 0066FF)를 사용"
          },
          {
            "condition": "danger(위험)는 확인 버튼 배경에 Native 위험색(빨강 FF6363)을 사용하며 교통 차단이나 장비 강제 종료 같은 비가역 작업에 적용"
          },
          {
            "condition": "타이틀 텍스트는 흰색, 본문 메시지는 보조텍스트(888) 14px"
          },
          {
            "condition": "패널 배경 패널색(1a1a1a), 보더 1px 2e2e2e, 모서리 둥글기 8px"
          }
        ]
      },
      {
        "name": "open",
        "title": "열림 상태 (Open)",
        "type": "boolean",
        "conditions": [
          {
            "condition": "true일 때 딤 배경(검정 60퍼센트 불투명)과 패널이 함께 표시"
          },
          {
            "condition": "열림 시 페이드 인과 함께 패널이 살짝 확대(스케일 0.96에서 1.0)되는 전환"
          },
          {
            "condition": "닫힘 시 동일 전환의 역방향으로 사라짐"
          }
        ]
      },
      {
        "name": "actions",
        "title": "액션 (Actions)",
        "type": "ReactNode",
        "conditions": [
          {
            "condition": "푸터 우측 정렬, 취소 버튼은 보더형(보더 2e2e2e, 텍스트 888)"
          },
          {
            "condition": "확인 버튼은 variant에 따라 Primary(0066FF) 또는 Native(FF6363) 채움, 호버 시 Primary Strong(3385FF)으로 강조"
          },
          {
            "condition": "버튼 높이 36px, 모서리 둥글기 8px, 글자 14px"
          }
        ]
      }
    ],
    "behavior": "배경 딤 영역 클릭 또는 ESC 키 입력 시 onClose가 호출되어 모달이 닫히며, 열려 있는 동안 뒤쪽 관제 화면의 스크롤과 포커스는 차단됩니다. 확인/취소 버튼은 각각 onConfirm, onClose 콜백을 실행합니다.",
    "usage": "교차로 신호 강제 전환이나 CCTV 채널 일괄 종료처럼 되돌리기 어려운 작업 전 확인을 받을 때 사용하며, 이때는 위험(danger) 변형으로 경각심을 높이는 것을 권장합니다. 단순 안내나 설정 저장 확인 등 일반적인 상황에는 기본(default) 변형을 사용합니다.",
    "code": "function ConfirmBlockRoad() {\n  const [open, setOpen] = useState(false);\n\n  return (\n    <>\n      <Button onClick={() => setOpen(true)}>도로 차단</Button>\n      <Popup\n        open={open}\n        variant='danger'\n        title='도로 차단 확인'\n        onClose={() => setOpen(false)}\n        onConfirm={() => {\n          blockRoad();\n          setOpen(false);\n        }}\n        actions={\n          <>\n            <Button variant='outline' onClick={() => setOpen(false)}>\n              취소\n            </Button>\n            <Button variant='danger' onClick={() => setOpen(false)}>\n              차단 실행\n            </Button>\n          </>\n        }\n      >\n        선택한 교차로의 모든 진입로를 차단합니다. 계속하시겠습니까?\n      </Popup>\n    </>\n  );\n}"
  },
  "present-tooltip": {
    "name": "Tooltip",
    "description": "요소에 호버 또는 포커스했을 때 짧은 설명을 어두운 말풍선으로 잠깐 보여주는 보조 안내 컴포넌트입니다.",
    "overview": "Tooltip은 어두운 배경의 말풍선 본문과 가리키는 대상을 향한 화살표로 구성되며, 관제 대시보드의 아이콘 버튼이나 축약된 지표 위에 추가 설명을 제공합니다. 표시 방향은 top, bottom, left, right 네 가지 변형을 지원하고, 기본은 숨김 상태에서 지연(delay) 후 페이드 인으로 노출되며 호버 또는 키보드 포커스 해제 시 사라집니다.",
    "properties": [
      {
        "name": "placement",
        "title": "표시 방향",
        "type": "enum",
        "conditions": [
          {
            "condition": "top, bottom, left, right 중 하나를 지정 (기본값 top)"
          },
          {
            "condition": "말풍선 본문은 배경 패널(#1a1a1a), 보더 #2e2e2e, 모서리 둥글기 8px"
          },
          {
            "condition": "대상 요소와 말풍선 사이 간격은 8px (Spacing 08), 화살표 크기는 가로세로 8px"
          },
          {
            "condition": "화살표는 본문과 동일한 배경(#1a1a1a)으로 지정 방향의 대상을 향함"
          }
        ]
      },
      {
        "name": "content",
        "title": "내용 텍스트",
        "type": "ReactNode",
        "conditions": [
          {
            "condition": "Body 14px 기준, 보조 안내 시 보조텍스트(#888) 사용 가능"
          },
          {
            "condition": "위험 경고 맥락에서는 Native 색상(#FF6363) 강조 텍스트 허용"
          },
          {
            "condition": "좌우 여백 12px (Spacing 12), 상하 여백 8px (Spacing 08), 최대 너비 220px에서 줄바꿈"
          },
          {
            "condition": "교통 상황 같은 본문 텍스트는 밝은 기본 텍스트로 표기"
          }
        ]
      },
      {
        "name": "delay",
        "title": "표시 지연",
        "type": "number",
        "conditions": [
          {
            "condition": "호버 또는 포커스 후 노출까지 대기 시간(ms), 기본값 300ms"
          },
          {
            "condition": "노출은 페이드 인, 해제는 즉시 또는 짧은 페이드 아웃"
          },
          {
            "condition": "지연이 0이면 즉시 표시되며 짧은 상호작용 안내에 적합"
          }
        ]
      }
    ],
    "behavior": "대상 요소에 마우스 호버 또는 키보드 포커스가 들어오면 지정한 지연 시간 후 말풍선이 페이드 인으로 나타나고, 호버나 포커스가 해제되면 사라집니다. 화면 경계에 닿으면 지정 방향에서 반대쪽으로 자동 전환하여 항상 화면 안에 표시됩니다.",
    "usage": "아이콘만 있는 버튼이나 축약된 지표(예: 교차로 혼잡도 아이콘, CCTV 상태 배지)의 의미를 보충 설명할 때 사용하며, 길거나 필수적인 정보는 Tooltip 대신 패널이나 모달에 노출하세요. 위험 상태(Native, #FF6363) 안내처럼 즉시 인지가 필요한 경우 지연을 0에 가깝게 낮춰 빠르게 표시합니다.",
    "code": "import { Tooltip } from '@pintel/ui';\n\nfunction TrafficStatusIcon() {\n  return (\n    <Tooltip placement='top' delay={300} content={'교차로 혼잡도 높음 (평균 대기 90초)'}>\n      <button className='icon-btn' aria-label='혼잡도'>\n        <CongestionIcon color='#FFA938' />\n      </button>\n    </Tooltip>\n  );\n}"
  },
  'foundation-overview-default': {
    name: 'Foundation Overview',
    description: '핀텔 디자인 시스템의 Foundation은 브랜드의 가치와 일관된 사용자 경험을 전달하기 위한 시각적 기초 자산(Token)들의 정의입니다.',
    overview: 'Foundation에서는 핀텔 디자인의 기본이 되는 Color, Typography, Spacing, Elevation, Animation(Motion) 등의 시각 가이드를 정의하며, 서비스 개발 시 일관성 있는 화면을 신속하게 설계할 수 있는 기반이 됩니다. 상단의 탭을 통해 개별 명세를 확인하거나, 상단 우측 버튼을 통해 Foundation 전체 마크다운 명세서를 통합 다운로드하실 수 있습니다.',
    usage: '모든 컴포넌트와 화면 레이아웃 정의는 본 Foundation에 기초하여 설계되어야 하며, 정의되지 않은 규격이나 색상을 임의로 사용하는 것을 금지합니다.'
  },
  // ─── Core: Color ──────────────────────────────────
  'color-primary': {
    name: 'Color.Primary',
    description: '화면 내에서 중요한 요소를 표현할 때 사용되는 브랜드 컬러입니다.',
    overview: '핀텔의 브랜드 아이덴티티를 상징하는 프라이머리 컬러는 지능형 영상 분석 시스템의 전문성과 공공 서비스의 신뢰성을 시각적으로 대변합니다. 대시보드의 복잡한 데이터 속에서 사용자가 시각적 질서를 빠르게 파악할 수 있도록 돕는 기준점이 됩니다.',
    customLayout: 'color-palette',
    colors: [
      { name: 'Primary / Normal', hex: '#0066FF', role: '브랜드 대표색, 주요 버튼 및 활성 상태 하이라이트', variable: '--pintel-color-primary' },
      { name: 'Primary / Strong', hex: '#3385FF', role: '호버(Hover) 또는 강조가 필요한 텍스트/아이콘', variable: '--pintel-color-primary-strong' },
      { name: 'Primary / Heavy', hex: '#0052CC', role: '클릭(Active) 또는 배경과의 높은 대비가 필요한 요소', variable: '--pintel-color-primary-heavy' },
    ],
    behavior: '브랜드 컬러는 인터랙티브 요소(버튼, 선택 탭)의 활성 상태를 나타내며, 대시보드의 주요 지표나 강조해야 할 장비의 하이라이트에 적용됩니다. 관제 서비스 특성상 배경색과의 명도 대비를 4.5:1 이상으로 유지하여 시각적 피로도를 최소화하고 집중도를 높입니다.',
    usage: '공공기관의 신뢰성을 강조하는 주요 지점 마커, 메뉴 활성바, 데이터 강조 등에 사용합니다. 스마트 시티 대시보드의 전문성과 안정감을 전달하는 핵심 시각 요소입니다.',
    code: `/* CSS Variables */\n:root {\n  --pintel-color-primary: #0066FF;\n  --pintel-color-primary-strong: #3385FF;\n  --pintel-color-primary-heavy: #0052CC;\n}\n\n/* Usage Example */\n.ds-button-primary {\n  background-color: var(--pintel-color-primary);\n  color: #ffffff;\n  border: none;\n  padding: 8px 16px;\n  border-radius: 4px;\n  cursor: pointer;\n}`
  },
  'color-status': {
    name: 'Color.Status',
    description: '요소의 상태를 표현할 때 사용합니다.',
    overview: '상태 컬러는 도로 위의 안전 상태와 장비의 가동 현황을 즉각적으로 인지할 수 있게 하는 시스템의 언어입니다. 범용적인 교통 신호 체계와 일치하는 색상 설정을 통해 관제 요원이 별도의 학습 없이도 긴급 상황을 한눈에 식별할 수 있도록 최적화되었습니다.',
    customLayout: 'color-palette',
    colors: [
      { name: 'Status / Positive', hex: '#1ED45A', role: '성공, 안전, 연결됨, 정상 작동 상태', variable: '--pintel-color-positive' },
      { name: 'Status / Cautionary', hex: '#FFA938', role: '주의, 대기, 데이터 지연, 이상 징후', variable: '--pintel-color-cautionary' },
      { name: 'Status / Native', hex: '#FF6363', role: '위험, 장애, 사고 발생, 긴급 조치 필요', variable: '--pintel-color-native' },
    ],
    behavior: '실시간 관제 피드백을 직관적으로 전달합니다. 정상(Positive)은 연결됨/안전/정상 작동을, 경고(Cautionary)는 주의/지체/이상 징후를, 위험(Native)은 사고/신호 위반/장비 장애 등 즉각적 조치가 필요한 상황을 의미합니다. 색상 외에도 심볼(아이콘)을 병기하여 정보 전달의 오류를 방지합니다.',
    usage: '도로 교통 신호 상태, 장비 연결 가용성, 도시 안전 이벤트 발생 여부 등 시스템의 상태를 구분하는 모든 영역에 적용합니다.',
    code: `/* Status Colors Usage */\n.status-positive { color: #1ED45A; }   /* 정상 / 안전 */\n.status-cautionary { color: #FFA938; } /* 주의 / 지체 */\n.status-native { color: #FF6363; }     /* 위험 / 장애 */\n\n/* Indicator Example */\n.status-dot {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  display: inline-block;\n}\n.status-dot.positive { background-color: #1ED45A; }`
  },
  'color-accent': {
    name: 'Color.Accent',
    description: '데이터 시각화·범례·태그 등에서 항목을 구분하기 위해 쓰는 전경(Foreground) 강조 색상 팔레트입니다.',
    overview: 'Accent는 시각적 대비를 명확히 유지하기 위해 앞쪽 요소(차트 계열, 카테고리 칩, 다중 범례)에 사용하는 11색 팔레트입니다. 빨강~핑크까지 색상환을 따라 배치되어, 여러 항목을 동시에 구분해야 할 때 인접 색과 충분히 구별됩니다. 상태(Status)와 달리 의미가 고정돼 있지 않으며, 데이터 계열 구분 등 "구별"이 목적입니다.',
    customLayout: 'color-palette',
    colors: [
      { name: 'Accent / Red', hex: '#FF5C5C', role: '전경 강조 — 빨강', variable: '--pintel-color-accent-red' },
      { name: 'Accent / Red Orange', hex: '#FF7847', role: '전경 강조 — 레드 오렌지', variable: '--pintel-color-accent-red-orange' },
      { name: 'Accent / Orange', hex: '#FF9F2E', role: '전경 강조 — 주황', variable: '--pintel-color-accent-orange' },
      { name: 'Accent / Lime', hex: '#8CD929', role: '전경 강조 — 라임', variable: '--pintel-color-accent-lime' },
      { name: 'Accent / Green', hex: '#2ED45A', role: '전경 강조 — 초록', variable: '--pintel-color-accent-green' },
      { name: 'Accent / Cyan', hex: '#1FC8E6', role: '전경 강조 — 시안', variable: '--pintel-color-accent-cyan' },
      { name: 'Accent / Light Blue', hex: '#45A6F5', role: '전경 강조 — 라이트 블루', variable: '--pintel-color-accent-light-blue' },
      { name: 'Accent / Blue', hex: '#5B8DEF', role: '전경 강조 — 파랑', variable: '--pintel-color-accent-blue' },
      { name: 'Accent / Violet', hex: '#9B8CFA', role: '전경 강조 — 바이올렛', variable: '--pintel-color-accent-violet' },
      { name: 'Accent / Purple', hex: '#C77DFF', role: '전경 강조 — 퍼플', variable: '--pintel-color-accent-purple' },
      { name: 'Accent / Pink', hex: '#FF7AD4', role: '전경 강조 — 핑크', variable: '--pintel-color-accent-pink' },
    ],
    behavior: '여러 데이터 계열·카테고리를 동시에 표시할 때 팔레트 순서대로 배정해 인접 항목이 구별되게 합니다. 상태 의미(정상/주의/위험)는 Status 색을 쓰고, Accent는 "의미 없는 구분"에만 사용합니다. 다크 배경 위 대비를 고려해 채도·명도를 조정한 값입니다.',
    usage: '차트 계열 색, 다중 범례, 카테고리 태그/칩, 지도 레이어 구분 등 "항목 구별"이 필요한 곳에 사용합니다. 단일 강조나 브랜드 표현에는 Primary를 사용하세요.',
    code: `/* CSS Variables — Accent palette */\n:root {\n  --pintel-color-accent-red: #FF5C5C;\n  --pintel-color-accent-orange: #FF9F2E;\n  --pintel-color-accent-green: #2ED45A;\n  --pintel-color-accent-blue: #5B8DEF;\n  --pintel-color-accent-purple: #C77DFF;\n  /* …red-orange · lime · cyan · light-blue · violet · pink */\n}\n\n/* Chart series example */\nconst SERIES = [\n  'var(--pintel-color-accent-blue)',\n  'var(--pintel-color-accent-green)',\n  'var(--pintel-color-accent-orange)',\n];`
  },
  'color-neutral': {
    name: 'Color.Neutral',
    description: '배경·표면·테두리·텍스트의 명도 위계를 만드는 무채색(그레이) 스케일입니다.',
    overview: 'Neutral은 밝음(99)에서 어둠(5)까지 14단계로 구성된 그레이 램프입니다. 숫자는 명도(Lightness, %)에 대응하며, 다크 테마 관제 UI의 배경·패널·구분선·보조 텍스트 위계를 일관되게 쌓는 기반입니다. 큰 숫자일수록 밝고(텍스트·전경), 작은 숫자일수록 어둡습니다(배경·딥 서피스).',
    customLayout: 'color-palette',
    colors: [
      { name: 'Neutral / 99', hex: '#FCFCFC', role: '최상위 전경 텍스트 / 라이트 표면', variable: '--pintel-color-neutral-99' },
      { name: 'Neutral / 95', hex: '#F2F2F2', role: '강조 텍스트 / 밝은 표면', variable: '--pintel-color-neutral-95' },
      { name: 'Neutral / 90', hex: '#E6E6E6', role: '기본 텍스트(다크 위)', variable: '--pintel-color-neutral-90' },
      { name: 'Neutral / 80', hex: '#CCCCCC', role: '본문 텍스트', variable: '--pintel-color-neutral-80' },
      { name: 'Neutral / 70', hex: '#B3B3B3', role: '보조 텍스트', variable: '--pintel-color-neutral-70' },
      { name: 'Neutral / 60', hex: '#999999', role: '비활성 텍스트 / 플레이스홀더', variable: '--pintel-color-neutral-60' },
      { name: 'Neutral / 50', hex: '#808080', role: '중간 그레이 (아이콘·디바이더 강)', variable: '--pintel-color-neutral-50' },
      { name: 'Neutral / 40', hex: '#666666', role: '약한 아이콘 / 테두리 강조', variable: '--pintel-color-neutral-40' },
      { name: 'Neutral / 30', hex: '#4D4D4D', role: '테두리 / 구분선(밝은 편)', variable: '--pintel-color-neutral-30' },
      { name: 'Neutral / 22', hex: '#383838', role: '테두리 / 컨트롤 외곽', variable: '--pintel-color-neutral-22' },
      { name: 'Neutral / 20', hex: '#333333', role: '카드·패널 테두리', variable: '--pintel-color-neutral-20' },
      { name: 'Neutral / 15', hex: '#262626', role: '카드·표면 배경', variable: '--pintel-color-neutral-15' },
      { name: 'Neutral / 10', hex: '#1A1A1A', role: '패널 배경 / 베이스 서피스', variable: '--pintel-color-neutral-10' },
      { name: 'Neutral / 5',  hex: '#0D0D0D', role: '최하위 딥 배경', variable: '--pintel-color-neutral-5' },
    ],
    behavior: '숫자(명도)가 클수록 전경(텍스트·아이콘), 작을수록 배경(서피스)에 사용합니다. 인접 단계 간 대비가 작으므로 텍스트/배경 조합은 충분한 명도 차(권장 4.5:1 이상)를 두고 선택합니다. 단일 의미(예: "패널 배경")에는 같은 단계를 일관되게 재사용합니다.',
    usage: '다크 테마의 배경(5~15)·카드/패널(15~22)·테두리/구분선(20~40)·보조~본문 텍스트(60~90)·강조 텍스트(95~99) 위계에 사용합니다. 화면마다 다른 회색을 임의로 쓰지 말고 이 스케일에서 선택하세요.',
    code: `/* CSS Variables — Neutral scale */\n:root {\n  --pintel-color-neutral-99: #FCFCFC;\n  --pintel-color-neutral-90: #E6E6E6;\n  --pintel-color-neutral-60: #999999;\n  --pintel-color-neutral-20: #333333;\n  --pintel-color-neutral-10: #1A1A1A;\n  --pintel-color-neutral-5:  #0D0D0D;\n}\n\n/* Usage */\n.panel { background: var(--pintel-color-neutral-10); border: 1px solid var(--pintel-color-neutral-20); }\n.text-secondary { color: var(--pintel-color-neutral-70); }`
  },

  // ─── Core: Typography ──────────────────────────────
  'icon-symbol': {
    name: 'Icon',
    description: '연상되는 유사한 기능이나 콘텐츠를 시각적으로 표현하는 요소로, 사용자가 인터페이스를 빠르게 탐색할 수 있도록 돕습니다.',
    customLayout: 'iconography',
    overview: 'Figma "디자인 시스템 3" Icon 섹션에서 추출한 핀텔 아이콘 세트입니다. 모든 아이콘은 20×20 그리드에 정렬되며, 활성(#0066FF) · 주의(#FFA938) · 위험(#FF6363) · 비활성(#B1B1B2) 상태 색을 사용합니다. 토큰 단일 출처(tokens.js ICONS)에서 정의되어 화면·MCP가 동일 목록을 공유합니다.',
    icons: ICONS,
    usage: '버튼 · 입력 · 리스트 · 맵 마커 등에서 기능을 직관적으로 전달할 때 사용합니다. 같은 의미에는 같은 아이콘을 일관되게 적용하세요. 코드에서는 <Icon name="search" size={20} /> 형태로 사용합니다.',
  },
  'typo-style': {
    name: 'Typography.Style',
    description: '타이포그래피는 텍스트를 읽기 쉽고 아름답게 표현하는 시각적 체계로 폰트 선택, 크기, 행간, 자간 등의 요소들을 조합하여 정보의 위계와 가독성을 만들어냅니다.',
    customLayout: 'typography',
    fonts: [
      { name: 'Display 1', size: '56px', lineHeight: '72px (1.286)', letterSpacing: '-0.0319em' },
      { name: 'Display 2', size: '40px', lineHeight: '52px (1.3)', letterSpacing: '-0.0282em' },
      { name: 'Display 3', size: '36px', lineHeight: '48px (1.334)', letterSpacing: '-0.027em' },
      { name: 'Title 1', size: '32px', lineHeight: '44px (1.375)', letterSpacing: '-0.0253em' },
      { name: 'Title 2', size: '28px', lineHeight: '38px (1.358)', letterSpacing: '-0.0236em' },
      { name: 'Title 3', size: '24px', lineHeight: '32px (1.334)', letterSpacing: '-0.023em' },
      { name: 'Heading 1', size: '22px', lineHeight: '30px (1.364)', letterSpacing: '-0.0194em' },
      { name: 'Heading 2', size: '20px', lineHeight: '28px (1.4)', letterSpacing: '-0.012em' },
      { name: 'Headline 1', size: '18px', lineHeight: '26px (1.444)', letterSpacing: '-0.002em' },
      { name: 'Headline 2', size: '17px', lineHeight: '26px (1.412)', letterSpacing: '0em' },
      { name: 'Body 1/Normal', size: '16px', lineHeight: '24px (1.5)', letterSpacing: '0.0057em' },
      { name: 'Body 1/Reading', size: '16px', lineHeight: '26px (1.625)', letterSpacing: '0.0057em' },
      { name: 'Body 2/Normal', size: '15px', lineHeight: '22px (1.467)', letterSpacing: '0.0096em' },
      { name: 'Body 2/Reading', size: '15px', lineHeight: '24px (1.6)', letterSpacing: '0.0096em' },
      { name: 'Label 1/Normal', size: '14px', lineHeight: '20px (1.429)', letterSpacing: '0.0145em' },
      { name: 'Label 1/Reading', size: '14px', lineHeight: '22px (1.571)', letterSpacing: '0.0145em' },
      { name: 'Label 2', size: '13px', lineHeight: '18px (1.385)', letterSpacing: '0.0194em' },
      { name: 'Caption 1', size: '12px', lineHeight: '16px (1.334)', letterSpacing: '0.0252em' },
      { name: 'Caption 2', size: '11px', lineHeight: '14px (1.273)', letterSpacing: '0.0311em' }
    ],
    usage: '정보의 위계에 따라 적절한 텍스트 스타일을 적용합니다. 제목(Title, Display)은 시각적 주목도를 높이고, 본문(Body, Label, Caption)은 가독성을 최우선으로 고려합니다.'
  },
  'typo-wordbreak': {
    name: 'Word break',
    description: '웹(개발) 환경에서는 텍스트가 어절(단어) 단위로 나뉘어 자동으로 줄바꿈됩니다. 따라서 디자인할 때 별도로 줄바꿈을 지정하지 않아도 됩니다.',
    customLayout: 'word-break',
    overview: '줄바꿈 정본 토큰 WRAP = { word-break: keep-all; overflow-wrap: break-word; } 을 전역(body) 기본으로 적용합니다. ① keep-all — 한글은 단어(어절)가 중간에서 끊기지 않고 어절 단위로 줄바꿈되며(아래 예시의 분홍색 덩어리가 최소 단위), 영문 단어도 통째로 유지됩니다. ② overflow-wrap: break-word — 컨테이너보다 긴 단일 토큰(URL·식별자 등)만 예외적으로 끊어 오버플로를 막습니다. 이 조합이 한글 포함 웹 텍스트에서 가장 보편적이고 안전한 기본값입니다.',
    words: ['분석을', '넘어', '실행으로,', '도시의', '내일을', '운영합니다'],
    usage: '제목·본문 등 모든 텍스트에 WRAP 토큰(keep-all + overflow-wrap: break-word)이 전역 기본으로 적용됩니다. 강제 줄바꿈(<br>)이나 고정 너비로 줄을 나누지 말고, 컨테이너 너비에 따라 어절 단위로 자연스럽게 흐르도록 둡니다. 단일 줄 고정이 필요한 곳(라벨·표 셀 등)에서만 white-space: nowrap 으로 개별 예외 처리합니다. 코드에서 개별 강제 적용이 필요하면 인라인에 {...WRAP} 를 스프레드합니다.'
  },

  // ─── Core: Layout & Depth ──────────────────────────
  'spacing-style': {
    name: 'Spacing',
    description: '컴포넌트 및 레이아웃 간의 여백을 정의하는 4pt/8pt 기반 스페이싱 시스템입니다.',
    customLayout: 'custom-table',
    gridTemplate: '1fr 1fr 1fr 2fr',
    tableHeaders: ['명칭 (Name)', '크기 (px)', 'REM 환산', '사용처 (Usage)'],
    tableRows: [
      ['Spacing 02', '2px', '0.125rem', '헤어라인 인접 미세 여백, 보더 간격'],
      ['Spacing 04', '4px', '0.25rem', '미세한 컴포넌트 내부 여백'],
      ['Spacing 08', '8px', '0.5rem', '기본적인 아이템 간격'],
      ['Spacing 12', '12px', '0.75rem', '아이콘·라벨 간격, 조밀한 내부 여백'],
      ['Spacing 16', '16px', '1rem', '일반적인 섹션 내부 간격'],
      ['Spacing 24', '24px', '1.5rem', '컴포넌트 그룹 간 간격'],
      ['Spacing 32', '32px', '2rem', '대형 섹션 여백'],
      ['Spacing 40', '40px', '2.5rem', '관제 대시보드 패널 간 여백'],
      ['Spacing 48', '48px', '3rem', '페이지 주요 영역 구분 여백'],
      ['Spacing 64', '64px', '4rem', '전체 페이지 상하 여백, 최상위 레이아웃']
    ],
    usage: '요소 간의 논리적 그룹화를 위해 4px/8px 단위의 여백을 사용합니다. 관련 있는 요소는 좁게, 다른 그룹과는 넓게 배치하여 구조를 명확히 합니다.',
    note: '※ 스페이싱 레이어 구분\n· 레이아웃·문서 기준 여백: 위 Foundation 스케일(4/8pt, px·rem)을 사용합니다.\n· 컴포넌트 prop 입력 여백: 별도의 SpacingMap 토큰(\'none\' · \'px\' · \'25\' … \'1500\')을 사용하며, WPF에서는 Thickness로 바인딩됩니다.\n· SpacingMap은 px와 선형 비례하지 않는 독립 스케일이므로(예: \'300\' → 24px, \'250\' → 10px) Foundation 표(4/8pt)와 수치를 혼용하지 마세요.'
  },
  'elevation-style': {
    name: 'Elevation',
    description: 'Z-index와 그림자를 통해 사용자에게 컴포넌트의 시각적 위계(깊이)를 직관적으로 전달합니다.',
    customLayout: 'custom-table',
    gridTemplate: '1fr 1fr 2fr 2fr',
    tableHeaders: ['명칭 (Name)', 'Z-Index', '그림자 (Box Shadow)', '사용처 (Usage)'],
    tableRows: [
      ['Level 1', '100', '0 2px 4px rgba(0,0,0,0.08)', '기본 카드, 리스트 아이템'],
      ['Level 2', '200', '0 4px 8px rgba(0,0,0,0.12)', '드롭다운 메뉴, 툴팁'],
      ['Level 3', '300', '0 8px 16px rgba(0,0,0,0.16)', '모달(Modal), 팝업 창'],
      ['Level 4', '400', '0 12px 24px rgba(0,0,0,0.2)', '시스템 경고, 최상단 플로팅']
    ],
    usage: '그림자를 사용하여 요소의 시각적 층위를 조절합니다. 사용자 상호작용이 필요한 팝업이나 모달 등은 높은 Elevation 레벨을 부여하여 주목도를 높입니다.'
  },

  // ─── Core: Animation ──────────────────────────────
  'anim-duration': {
    name: 'Animation.Duration',
    description: '애니메이션이 완료되는 데 걸리는 지속 시간(Duration) 토큰입니다.',
    customLayout: 'custom-table',
    previewType: 'animation-duration',
    gridTemplate: '1.5fr 1fr 2fr 2fr',
    tableHeaders: ['명칭 (Name)', '시간 (ms)', '설명 (Description)', '사용처 (Usage)'],
    tableRows: [
      ['Duration.Fast', '150ms', '아주 빠른 속도', '호버(Hover), 토글, 버튼 눌림'],
      ['Duration.Normal', '250ms', '자연스러운 속도', '툴팁 등장, 드롭다운 메뉴'],
      ['Duration.Slow', '350ms', '부드럽고 여유있는 속도', '모달(Modal) 등장, 페이지 전환']
    ],
    usage: '인터랙션의 성격에 맞는 시간을 선택합니다. 단순한 호버는 빠르게, 모달 등장과 같은 중요한 변화는 조금 더 부드럽게 표현하여 사용자에게 적절한 피드백을 제공합니다.'
  },
  'anim-easing': {
    name: 'Animation.Easing',
    description: '애니메이션의 가속과 감속을 제어하는 가속도 곡선(Easing) 토큰입니다.',
    customLayout: 'custom-table',
    previewType: 'animation-easing',
    gridTemplate: '1fr 1.5fr 1.5fr 1.5fr',
    tableHeaders: ['명칭 (Name)', '곡선 (Cubic-bezier)', '시각적 느낌', '사용처 (Usage)'],
    tableRows: [
      ['Easing.Standard', 'cubic-bezier(0.4, 0, 0.2, 1)', '부드러운 가속과 감속', '대부분의 일반적인 상태 변화'],
      ['Easing.Snappy', 'cubic-bezier(0.17, 0.89, 0.32, 1.28)', '통통 튀는 경쾌한 느낌', '팝업 등장, 좋아요 등 강조 액션'],
      ['Easing.Decel', 'cubic-bezier(0, 0, 0.2, 1)', '빠르게 시작해 부드럽게 멈춤', '화면 밖에서 안으로 들어오는 요소']
    ],
    usage: '움직임의 자연스러움을 위해 베지어 곡선을 활용합니다. Standard는 일반적인 이동에, Snappy는 빠른 반응이 필요한 경우에 적용하여 생동감을 부여합니다.'
  },

  // ─── Clay: Accordion ──────────────────────────────
  'accordion-default': {
    name: 'Accordion',
    description: '아코디언(Accordion)은 한정된 공간 안에서 여러 정보를 접고 펼치며 효율적으로 탐색 및 조작할 수 있는 컨테이너 컴포넌트군입니다. 이 컴포넌트는 개별 항목을 감싸는 Accordion.Item, 클릭 시 상태를 토글하는 Accordion.Trigger, 그리고 펼쳐지는 세부 내용을 품는 Accordion.Content로 이루어집니다.',
    tabs: [
      { id: 'design', label: 'Design' },
      { id: 'web', label: 'Web' },
      { id: 'cs', label: 'Cs' }
    ],
    overview: '스마트 시티 및 교통 관제 모듈 대시보드의 사이드바 등에서 장비 목록(CCTV), 지점 상세 정보 및 계층적 지표 등을 깔끔하게 배치해 조작 편의성과 정보의 밀도를 극대화할 때 활용됩니다.',
    designTokens: [
      { name: 'Height (Trigger)', value: '40px', role: '트리거 클릭 영역의 세로 규격' },
      { name: 'Padding (Trigger)', value: '10px 16px', role: '트리거 내부 여백' },
      { name: 'Padding (Content)', value: '16px', role: '세부 내용 콘텐츠 안쪽 여백' },
      { name: 'Background (Item)', value: '#1e1e1e', role: '기본 어두운 테마 배경 색상' },
      { name: 'Background (Content)', value: '#161618', role: '세부 내용 구분을 위해 더 짙게 처리한 배경색' },
      { name: 'Border (Item)', value: '1px solid #2e2e2e', role: '아코디언 아이템 간의 하단 경계선' },
      { name: 'Chevron Transition', value: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)', role: '화살표 회전 애니메이션' }
    ],
    webProps: [
      { name: 'Accordion.Item - isExpanded', type: 'boolean', defaultValue: 'false', desc: '해당 아코디언 항목의 펼침 상태 관리' },
      { name: 'Accordion.Trigger - onClick', type: '(e) => void', defaultValue: 'required', desc: '트리거 클릭 시 동작하는 토글 이벤트 핸들러' },
      { name: 'Accordion.Content - isExpanded', type: 'boolean', defaultValue: 'false', desc: '세부 내용 영역의 높이를 조절하기 위한 상태값' }
    ],
    csProperties: [
      { name: 'AccordionItem.IsExpanded', type: 'bool', desc: 'WPF Custom Control 열림 여부 종속성 속성' },
      { name: 'AccordionTrigger.Command', type: 'ICommand', desc: '버튼 클릭 시 실행할 뷰모델 명령' },
      { name: 'AccordionContent.Height', type: 'Double', desc: '트리거 체크 여부에 따라 0에서 200 등으로 가변되는 높이 속성' }
    ],
    webCode: `// React Accordion 통합 사용 예제
import React, { useState } from 'react';
import './Accordion.css';

export function AccordionItem({ isExpanded, children }) {
  return (
    <div className={\`ds-accordion-item \${isExpanded ? 'expanded' : ''}\`}>
      {children}
    </div>
  );
}

export function AccordionTrigger({ isExpanded, onClick, children }) {
  return (
    <button 
      type="button" 
      className="ds-accordion-trigger"
      onClick={onClick}
    >
      <span className="ds-accordion-trigger-title">{children}</span>
      <svg 
        className={\`ds-accordion-chevron \${isExpanded ? 'expanded' : ''}\`}
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      >
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  );
}

export function AccordionContent({ isExpanded, children }) {
  return (
    <div className={\`ds-accordion-content-wrapper \${isExpanded ? 'open' : ''}\`}>
      <div className="ds-accordion-content">
        {children}
      </div>
    </div>
  );
}`,
    csCode: `<!-- C# WPF / XAML Collapsible Accordion & Trigger Style -->
<Style TargetType="{x:Type ToggleButton}" x:Key="AccordionTriggerStyle">
    <Setter Property="Height" Value="40"/>
    <Setter Property="Padding" Value="16,10"/>
    <Setter Property="Background" Value="Transparent"/>
    <Setter Property="Template">
        <Setter.Value>
            <ControlTemplate TargetType="{x:Type ToggleButton}">
                <Border Background="{TemplateBinding Background}" Padding="{TemplateBinding Padding}">
                    <Grid>
                        <ContentPresenter HorizontalAlignment="Left" VerticalAlignment="Center"/>
                        <Path x:Name="Arrow" Data="M9 18 L15 12 L9 6" Stroke="#888888" StrokeThickness="2"
                              Width="10" Height="10" HorizontalAlignment="Right" VerticalAlignment="Center"
                              RenderTransformOrigin="0.5,0.5">
                            <Path.RenderTransform>
                                <RotateTransform Angle="0"/>
                            </Path.RenderTransform>
                        </Path>
                    </Grid>
                </Border>
                <ControlTemplate.Triggers>
                    <Trigger Property="IsChecked" Value="True">
                        <Setter TargetName="Arrow" Property="RenderTransform">
                            <Setter.Value>
                                <RotateTransform Angle="90"/>
                            </Setter.Value>
                        </Setter>
                    </Trigger>
                </ControlTemplate.Triggers>
            </ControlTemplate>
        </Setter.Value>
    </Setter>
</Style>`
  },

  // ─── Clay: Avatar ──────────────────────────────
  'avatar-default': {
    name: 'Avatar',
    description: '사용자 또는 엔티티를 시각적으로 표현하는 원형/라운드 사각형 컴포넌트입니다. 프로필 이미지, 이니셜 Fallback, 접속 상태(Status Indicator)를 포함합니다.',
    tabs: [
      { id: 'design', label: 'Design' },
      { id: 'web', label: 'Web' },
      { id: 'cs', label: 'Cs' }
    ],
    overview: '아바타(Avatar)는 사람이나 조직 등 식별 가능한 주체를 대표하는 시각 요소입니다. 관제 대시보드 내 담당자 표시, 팀 구성원 목록, 알림 발신자 식별 등에 사용되며, 이미지가 없을 때 이니셜로 자연스럽게 대체되어 일관된 UI 경험을 유지합니다.',
    properties: [
      {
        name: 'size',
        title: '크기 (Size)',
        type: 'string',
        conditions: [
          { condition: 'Small: 32×32px' },
          { condition: 'Medium: 40×40px (기본)' },
          { condition: 'Large: 48×48px' },
          { condition: 'XL: 56×56px' },
        ],
      },
      {
        name: 'shape',
        title: '형태 (Shape)',
        type: 'string',
        conditions: [
          { condition: 'Circle: border-radius 50% (기본)' },
          { condition: 'Rounded: border-radius 28%' },
        ],
      },
      {
        name: 'status-indicator',
        title: '상태 인디케이터 (Status Indicator)',
        type: 'ColorToken',
        conditions: [
          { condition: 'Online: #1ED45A (Status / Positive)' },
          { condition: 'Idle: #FFA938 (Status / Cautionary)' },
          { condition: 'Busy: #FF6363 (Status / Native)' },
          { condition: 'Offline: #aaaaaa (비활성)' },
          { condition: '인디케이터 크기: avatarPx × 0.22 (최소 9px)' },
        ],
      },
      {
        name: 'fallback',
        title: '이니셜 Fallback',
        type: 'string',
        conditions: [
          { condition: '이미지 미존재 시 이니셜(예: JD) 자동 표시' },
          { condition: '글자 크기: Small 13px / Medium 16px / Large 20px' },
          { condition: '폰트 굵기: 700 (Bold)' },
        ],
      },
      {
        name: 'transition',
        title: '상태 전이 효과',
        type: 'CSS',
        conditions: [
          { condition: 'transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' },
        ],
      },
    ],
    behavior: '이미지가 로드되면 프로필 사진을, 로드 실패 또는 미제공 시 이니셜 Fallback을 자동으로 표시합니다. Status Indicator는 우측 하단에 작은 원형 점(dot)으로 표시되며, 핀텔 Status 컬러 시스템과 연계하여 사용자 접속 상태를 즉각적으로 전달합니다.',
    usage: '관제 대시보드의 담당자 표시, 알림 발신자 식별, 팀 구성원 목록, 채팅 UI의 프로필 표시 등에 사용합니다. 단독 또는 Avatar group과 함께 사용할 수 있습니다.',
    webProps: [
      { name: 'src', type: 'string', defaultValue: 'undefined', desc: '프로필 이미지 URL. 미제공 시 이니셜 Fallback 표시.' },
      { name: 'initials', type: 'string', defaultValue: 'required', desc: '이미지 미존재 시 표시할 이니셜 텍스트 (예: "JD").' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", defaultValue: "'md'", desc: '아바타 크기. sm=32px, md=40px, lg=48px, xl=56px.' },
      { name: 'shape', type: "'circle' | 'rounded'", defaultValue: "'circle'", desc: '외형 모양. circle=50%, rounded=28% border-radius.' },
      { name: 'status', type: "'online' | 'idle' | 'busy' | 'offline' | 'none'", defaultValue: "'none'", desc: '우하단 상태 인디케이터 표시 여부 및 색상.' },
    ],
    webCode: `// React Avatar 컴포넌트 예제
import React from 'react';

const STATUS_COLORS = {
  online:  '#1ED45A',
  idle:    '#FFA938',
  busy:    '#FF6363',
  offline: '#aaaaaa',
};

const SIZES = { sm: 32, md: 40, lg: 48, xl: 56 };

export function Avatar({ src, initials, size = 'md', shape = 'circle', status = 'none' }) {
  const px = SIZES[size];
  const borderRadius = shape === 'circle' ? '50%' : '28%';
  const dotSize = Math.max(9, Math.round(px * 0.22));

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: px, height: px }}>
      <div style={{
        width: px, height: px,
        borderRadius,
        background: src ? 'transparent' : 'linear-gradient(135deg, #3a4a7a, #5a6a9e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        fontSize: px > 48 ? 20 : px > 36 ? 16 : 13,
        fontWeight: 700, color: '#fff',
      }}>
        {src ? <img src={src} alt={initials} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
      </div>
      {status !== 'none' && (
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: dotSize, height: dotSize,
          borderRadius: '50%',
          background: STATUS_COLORS[status],
          border: '2px solid #fff',
        }} />
      )}
    </div>
  );
}`,
    csProperties: [
      { name: 'Avatar.Source', type: 'ImageSource', desc: '프로필 이미지 소스. null 또는 미로드 시 이니셜 표시.' },
      { name: 'Avatar.Initials', type: 'string', desc: '이미지 미존재 시 표시할 이니셜 텍스트.' },
      { name: 'Avatar.Size', type: 'AvatarSize (enum)', desc: 'Small(32) / Medium(40) / Large(48) / XL(56) 열거형.' },
      { name: 'Avatar.Shape', type: 'AvatarShape (enum)', desc: 'Circle / Rounded 열거형으로 외형 제어.' },
      { name: 'Avatar.Status', type: 'UserStatus (enum)', desc: 'Online / Idle / Busy / Offline / None 상태 표시.' },
    ],
  },

  'avatar-group-default': {
    name: 'Avatar group',
    description: '여러 Avatar를 일정 간격으로 중첩(Overlap) 배치하여 팀 또는 참여자 목록을 시각적으로 표현하는 컴포넌트입니다. 표시 한도를 초과하면 +N 배지로 나머지 인원수를 나타냅니다.',
    tabs: [
      { id: 'design', label: 'Design' },
      { id: 'web', label: 'Web' },
      { id: 'cs', label: 'Cs' }
    ],
    overview: '아바타 그룹(Avatar group)은 한정된 공간 안에서 복수의 사용자를 간결하게 표현합니다. 관제 대시보드의 담당팀 구성, 알림 구독자 목록, 협업 도구의 참여자 표시 등에 활용됩니다. 최대 표시 개수(max)를 지정하면 초과분은 자동으로 +N 버블로 압축됩니다.',
    properties: [
      {
        name: 'max',
        title: '최대 표시 개수 (Max Visible)',
        type: 'number',
        conditions: [
          { condition: '기본값: 4' },
          { condition: '초과 시 +N 배지 자동 표시' },
        ],
      },
      {
        name: 'overlap',
        title: '중첩 간격 (Overlap Gap)',
        type: 'string',
        conditions: [
          { condition: 'Small: -8px (촘촘한 배치)' },
          { condition: 'Medium: -14px (기본)' },
          { condition: 'Large: -20px (넓은 중첩)' },
        ],
      },
      {
        name: 'overflow-badge',
        title: '+N 오버플로 배지',
        type: 'ColorToken',
        conditions: [
          { condition: '배경: #e0e0eb (라이트 테마), #2e2e2e (다크 테마)' },
          { condition: '텍스트: +{초과 인원수}' },
          { condition: '폰트 크기: 13px, 굵기: 700' },
        ],
      },
      {
        name: 'border',
        title: '구분 테두리',
        type: 'string',
        conditions: [
          { condition: '각 아바타: border 2px solid {배경색}' },
          { condition: '중첩 시 겹치는 부분을 자연스럽게 분리' },
        ],
      },
    ],
    behavior: '왼쪽부터 오른쪽으로 쌓이며 z-index가 순차적으로 낮아집니다. 최대 표시 개수를 초과하면 +N 배지가 마지막에 나타납니다. 아바타 위에 호버 시 툴팁으로 이름을 표시하는 것을 권장합니다.',
    usage: '팀원 현황 패널, 이벤트 참여자 미리보기, 채팅방 멤버 표시, 알림 수신자 목록 등에 적용합니다. 최대 5~6개를 초과하는 경우에는 반드시 max 속성으로 제한하여 레이아웃 붕괴를 방지합니다.',
    webProps: [
      { name: 'avatars', type: 'AvatarProps[]', defaultValue: 'required', desc: '표시할 아바타 데이터 배열 (src, initials, status 등).' },
      { name: 'max', type: 'number', defaultValue: '4', desc: '최대 표시 아바타 수. 초과분은 +N 배지로 압축.' },
      { name: 'overlap', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", desc: '아바타 간 중첩 간격. sm=-8px, md=-14px, lg=-20px.' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", defaultValue: "'md'", desc: '그룹 내 모든 아바타의 공통 크기.' },
    ],
    webCode: `// React AvatarGroup 컴포넌트 예제
import React from 'react';
import { Avatar } from './Avatar';

const OVERLAP = { sm: -8, md: -14, lg: -20 };

export function AvatarGroup({ avatars = [], max = 4, overlap = 'md', size = 'md' }) {
  const shown  = avatars.slice(0, max);
  const extra  = avatars.length - shown.length;
  const gap    = OVERLAP[overlap];

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {shown.map((avatar, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : gap, zIndex: shown.length - i }}>
          <Avatar {...avatar} size={size} />
        </div>
      ))}
      {extra > 0 && (
        <div style={{
          marginLeft: gap,
          width: { sm:32, md:40, lg:48, xl:56 }[size],
          height: { sm:32, md:40, lg:48, xl:56 }[size],
          borderRadius: '50%',
          background: '#e0e0eb',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#555',
          border: '2px solid #fff',
          zIndex: 0,
        }}>
          +{extra}
        </div>
      )}
    </div>
  );
}`,
    csProperties: [
      { name: 'AvatarGroup.Avatars', type: 'ObservableCollection<AvatarVM>', desc: '표시할 아바타 뷰모델 컬렉션.' },
      { name: 'AvatarGroup.Max', type: 'int', desc: '최대 표시 아바타 수. 기본값 4.' },
      { name: 'AvatarGroup.Overlap', type: 'AvatarOverlap (enum)', desc: 'Small(-8) / Medium(-14) / Large(-20) 중첩 간격.' },
      { name: 'AvatarGroup.Size', type: 'AvatarSize (enum)', desc: '그룹 내 아바타의 공통 크기 열거형.' },
    ],
  },

  // ─── Search ──────────────────────────────────

  'search-box': {
    name: 'Search.Box',
    description: '검색에 필요한 텍스트를 입력하는 박스입니다.',
    properties: [
      {
        name: '내부 padding',
        title: '내부 padding',
        type: 'SpacingMap',
        spacingMap: true,
        conditions: [
          { condition: "= size가 small ->내부  8, 4" },
          { condition: "= size가 medium ->내부  8, 12" },
          { condition: "= size가 large ->내부  12, 16" },
        ],
      },
      {
        name: 'background',
        title: '배경 색상',
        type: 'ColorToken',
        conditions: [
          { condition: "기본: #262626" },
          { condition: "focus: #2a2a2a" },
        ],
      },
      {
        name: 'border',
        title: '테두리',
        type: 'string',
        conditions: [
          { condition: "기본: 1px solid #333" },
          { condition: "focus: 1px solid #555" },
        ],
      },
      {
        name: 'font-size',
        title: '글자 크기',
        type: 'number',
        conditions: [
          { condition: "13px" },
        ],
      },
    ],
  },
  'search-button': {
    name: 'Search.Button',
    description: '검색을 실행하는 버튼이에요. Search.Box 옆에 배치됩니다.',
    properties: [
      {
        name: 'padding',
        title: '내부 여백',
        type: 'SpacingMap',
        spacingMap: true,
        conditions: [
          { condition: "= size가 small ->내부  6, 12" },
          { condition: "= size가 medium ->내부  8, 16" },
        ],
      },
    ],
  },

  // ─── Button ──────────────────────────────────
  'button-primary': {
    name: 'Button.Primary',
    description: '주요 액션을 실행하고 다양한 상태 변화를 전달하는 기본 버튼입니다. Primary/Secondary 및 Solid/Outline의 조합으로 구성됩니다.',
    overview: '핀텔 디자인 시스템의 핵심 버튼 컴포넌트입니다. 정보 구조와 사용자 조작의 중요도에 맞춰 Primary Solid, Secondary Solid, Primary Outline, Secondary Outline 4가지 종류의 버튼 타입을 제공합니다. 각 타입은 Normal, Hovered, Pressed, Disabled 4가지 시각적 상태(State)가 브랜드 컬러 규격에 따라 정교하게 정의되어 있습니다.',
    properties: [
      {
        name: 'layout',
        title: '기본 규격',
        type: 'string',
        conditions: [
          { condition: "높이: 40px (Display Matrix) / 44px (Playground)" },
          { condition: "모서리 둥글기 (Border-radius): 8px" },
        ],
      },
      {
        name: 'padding',
        title: '내부 여백',
        type: 'SpacingMap',
        spacingMap: true,
        conditions: [
          { condition: "가로 패딩: 24px (여백 300)" },
          { condition: "세로 패딩: 10px (여백 250)" },
        ],
      },
      {
        name: 'typography',
        title: '글꼴 사양',
        type: 'string',
        conditions: [
          { condition: "글꼴: Pretendard GOV" },
          { condition: "크기: 14px (Body 1)" },
          { condition: "굵기: 600 (SemiBold)" },
        ],
      },
      {
        name: 'colors-primary-solid',
        title: 'Primary Solid (브랜드 솔리드)',
        type: 'ColorToken',
        conditions: [
          { condition: "Normal: 배경 #0066FF (--pintel-color-primary), 글자 #FFFFFF" },
          { condition: "Hovered: 배경 #3385FF (--pintel-color-primary-strong), 글자 #FFFFFF" },
          { condition: "Pressed: 배경 #0052CC (--pintel-color-primary-heavy), 글자 #FFFFFF" },
          { condition: "Disabled: 배경 #F0F0F0, 글자 #B0B0B0" },
        ],
      },
      {
        name: 'colors-secondary-solid',
        title: 'Secondary Solid (뉴트럴 솔리드)',
        type: 'ColorToken',
        conditions: [
          { condition: "Normal: 배경 #F3F4F6, 글자 #1F2937" },
          { condition: "Hovered: 배경 #E5E7EB, 글자 #1F2937" },
          { condition: "Pressed: 배경 #D1D5DB, 글자 #1F2937" },
          { condition: "Disabled: 배경 #F9FAFB, 글자 #D1D5DB" },
        ],
      },
      {
        name: 'colors-primary-outline',
        title: 'Primary Outline (브랜드 아웃라인)',
        type: 'ColorToken',
        conditions: [
          { condition: "Normal: 배경 #FFFFFF, 테두리 #0066FF, 글자 #0066FF" },
          { condition: "Hovered: 배경 #EBF2FF, 테두리 #3385FF, 글자 #3385FF" },
          { condition: "Pressed: 배경 #DCE9FF, 테두리 #0052CC, 글자 #0052CC" },
          { condition: "Disabled: 배경 #FFFFFF, 테두리 #E5E7EB, 글자 #D1D5DB" },
        ],
      },
      {
        name: 'colors-secondary-outline',
        title: 'Secondary Outline (뉴트럴 아웃라인)',
        type: 'ColorToken',
        conditions: [
          { condition: "Normal: 배경 #FFFFFF, 테두리 #E5E7EB, 글자 #1F2937" },
          { condition: "Hovered: 배경 #F9FAFB, 테두리 #D1D5DB, 글자 #1F2937" },
          { condition: "Pressed: 배경 #F3F4F6, 테두리 #9CA3AF, 글자 #1F2937" },
          { condition: "Disabled: 배경 #FFFFFF, 테두리 #E5E7EB, 글자 #D1D5DB" },
        ],
      },
      {
        name: 'transition',
        title: '상태 전이 효과',
        type: 'CSS',
        conditions: [
          { condition: "transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)" },
        ],
      },
    ],
    behavior: '마우스가 버튼 영역에 들어가면 호버(Hovered) 피드백을 통해 컴포넌트가 활성화되었음을 시각적으로 알려주며, 마우스 포인터가 포인팅 형태가 됩니다. 클릭 및 탭 동작 시점(Pressed)에는 명도를 낮춰 즉각적인 상태 반응을 전달합니다. 비활성(Disabled) 상태의 경우 시스템 동작을 보증할 수 없는 조건에서 상호작용 및 포커스가 차단됩니다.',
    usage: 'Primary Solid: 한 화면에서 시각적으로 가장 강력해야 하는 단 하나의 결정적 액션(예: 저장, 등록, 분석 시작)에 활용합니다.\nSecondary Solid: 일반적인 긍정 혹은 주요 동작과 무관한 다수 버튼(예: 새로고침, 목록보기)에 사용합니다.\nPrimary Outline: 메인 솔리드 버튼에 대한 서브 동작(예: 장비 편집, 필터 지정)에 사용하여 시각적 위계를 관리합니다.\nSecondary Outline: 취소, 닫기, 이전 화면 이동 등 정보의 중요도가 가장 낮거나 취소 성격의 액션에 매칭합니다.',
    tokensUsed: ['Primary Solid: #0066FF / hover #3385FF / press #0052CC', '텍스트 #fff', 'TYPE.label1/caption1', 'W.semibold(Primary)/medium', 'SP 패딩 · radius 4~8'],
    aliases: ['버튼', '저장', '등록', '적용', '확인', '실행', '분석 시작', '액션 버튼', 'button', 'primary button', 'submit'],
    antiPatterns: ['한 화면에 Primary Solid 여러 개 금지 → 결정적 액션 하나만', '폐기된 구 파랑 Primary 값 사용 금지 → 확정 #0066FF 세트만', '수동 상태 표시(경과 시간·미열람 등)를 버튼처럼 보이게 만들지 말 것(보조 텍스트로)'],
    examples: [
      "<button className='ds-btn ds-btn-primary'>저장</button>",
      "// 서브 동작은 Outline, 취소/닫기는 Secondary Outline로 위계 관리",
    ],
    code: `/* CSS Variables */
:root {
  --pintel-color-primary: #0066FF;
  --pintel-color-primary-strong: #3385FF;
  --pintel-color-primary-heavy: #0052CC;
}

/* 1. Primary Solid */
.ds-button.primary-solid {
  background-color: var(--pintel-color-primary);
  color: #FFFFFF;
}
.ds-button.primary-solid:hover {
  background-color: var(--pintel-color-primary-strong);
}
.ds-button.primary-solid:active {
  background-color: var(--pintel-color-primary-heavy);
}
.ds-button.primary-solid:disabled {
  background-color: #F0F0F0;
  color: #B0B0B0;
  cursor: not-allowed;
}

/* 2. Secondary Solid */
.ds-button.secondary-solid {
  background-color: #F3F4F6;
  color: #1F2937;
}
.ds-button.secondary-solid:hover {
  background-color: #E5E7EB;
}
.ds-button.secondary-solid:active {
  background-color: #D1D5DB;
}
.ds-button.secondary-solid:disabled {
  background-color: #F9FAFB;
  color: #D1D5DB;
  cursor: not-allowed;
}

/* 3. Primary Outline */
.ds-button.primary-outline {
  background-color: #FFFFFF;
  border: 1px solid var(--pintel-color-primary);
  color: var(--pintel-color-primary);
}
.ds-button.primary-outline:hover {
  background-color: #EBF2FF;
  border-color: var(--pintel-color-primary-strong);
  color: var(--pintel-color-primary-strong);
}
.ds-button.primary-outline:active {
  background-color: #DCE9FF;
  border-color: var(--pintel-color-primary-heavy);
  color: var(--pintel-color-primary-heavy);
}
.ds-button.primary-outline:disabled {
  background-color: #FFFFFF;
  border-color: #E5E7EB;
  color: #D1D5DB;
  cursor: not-allowed;
}

/* 4. Secondary Outline */
.ds-button.secondary-outline {
  background-color: #FFFFFF;
  border: 1px solid #E5E7EB;
  color: #1F2937;
}
.ds-button.secondary-outline:hover {
  background-color: #F9FAFB;
  border-color: #D1D5DB;
  color: #1F2937;
}
.ds-button.secondary-outline:active {
  background-color: #F3F4F6;
  border-color: #9CA3AF;
  color: #1F2937;
}
.ds-button.secondary-outline:disabled {
  background-color: #FFFFFF;
  border-color: #E5E7EB;
  color: #D1D5DB;
  cursor: not-allowed;
}`
  },
  'button-icon': {
    name: 'Icon button',
    description: '라벨 없이 아이콘만으로 단일 동작을 실행하는 버튼입니다. 좁은 공간이나 도구 모음에서 사용합니다.',
    overview: '아이콘 버튼은 동작을 나타내는 단일 아이콘과 이를 감싸는 컨테이너(원형 또는 둥근 사각)로 구성됩니다. 의미가 명확한 아이콘(검색·편집·삭제·재생 등)에 한해 라벨을 생략하며, 접근성을 위해 aria-label을 반드시 제공합니다.',
    properties: [
      {
        name: 'anatomy',
        title: '구성 (Anatomy)',
        type: 'string',
        conditions: [
          { condition: "1. Icon: 동작을 나타내는 단일 아이콘 — Foundation 아이콘 세트, 18~20px" },
          { condition: "2. Container: 아이콘을 감싸는 클릭 영역 — 원형 또는 둥근 사각, 권장 크기 32~40px" },
        ],
      },
      {
        name: 'variants',
        title: '변형 (Variants)',
        type: 'string',
        conditions: [
          { condition: "Normal: 컨테이너 없는 평면 아이콘 — 호버 시에만 연한 배경" },
          { condition: "Outlined: 1px 테두리 + 투명 배경" },
          { condition: "Solid: 채움 — 핀텔 Primary(Normal #0066FF / Hovered #3385FF / Pressed #0052CC)" },
          { condition: "Background/Normal: 연한 중립 채움 + 중립 아이콘" },
          { condition: "Background/Alternative: 진한 중립 채움 + 흰색 아이콘" },
        ],
      },
      {
        name: 'states',
        title: '상태 (States)',
        type: 'enum',
        conditions: [
          { condition: "Normal: 기본" },
          { condition: "Hovered: 배경을 한 단계 진하게 (Solid는 #3385FF)" },
          { condition: "Pressed: 더 진하게 (Solid는 #0052CC)" },
          { condition: "Disabled: 투명도 낮춤, 클릭 차단" },
        ],
      },
    ],
    behavior: '클릭 시 연결된 단일 동작을 즉시 실행합니다. 아이콘 의미가 모호할 수 있는 경우 Tooltip을 함께 제공합니다.',
    usage: '툴바, 테이블 행 액션, 카드 우상단 동작(편집/삭제/더보기) 등 라벨을 둘 공간이 부족한 곳에 사용합니다.',
    tokensUsed: ['컨테이너 32~40px(조밀 시 축소)', '아이콘 18~20px', 'Solid: #0066FF / #3385FF / #0052CC', 'Normal: 투명 + 호버 시 연한 배경', 'aria-label 필수'],
    aliases: ['아이콘 버튼', '삭제 버튼', '편집 버튼', '더보기', '아이콘만', '툴바 버튼', 'icon button', 'delete button', 'edit button'],
    antiPatterns: ['aria-label 없이 사용 금지(접근성)', '의미가 모호한 아이콘 단독 사용 금지 → Tooltip 동반', '라벨이 필요하면 아이콘+텍스트 버튼(Button/Tbtn) 사용'],
    examples: [
      "<button className='ds-icon-button' aria-label='삭제'><svg>{/* trash */}</svg></button>",
      "// 컨테이너 원형(50%) 또는 둥근 사각(8) · 조밀한 팝업에선 26~28px로 축소",
    ],
    code: `<button className="ds-icon-button" aria-label="재생">
  <svg>{/* play icon */}</svg>
</button>

/* CSS */
.ds-icon-button {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #3a3a42;
  border-radius: 8px;            /* 원형은 50% */
  background: #2a2a30;
  color: #d4d4d8;
  cursor: pointer;
}
.ds-icon-button:hover { background: #34343c; }
.ds-icon-button:disabled { opacity: 0.4; cursor: not-allowed; }`,
  },
  'category-default': {
    name: 'Category',
    description: '메인 카테고리 탭 아래에서 콘텐츠를 더욱 세분화하여 구분하는 하위 네비게이션 요소입니다. 사용자가 대분류에서 소분류로 자연스럽게 탐색할 수 있도록 돕고, 정보 구조를 명확하게 전달하는 역할을 합니다.',
    overview: '상위 카테고리 탭 하위에서 콘텐츠를 한 단계 더 세분화하는 칩(Chip) 형태의 하위 네비게이션입니다. 선택된 항목은 브랜드 컬러 또는 다크 배경으로 강조(Active)되고 나머지는 비활성(Inactive) 상태로 나열되며, 항목이 가로 영역을 넘어설 경우 우측의 아이콘 버튼을 통해 더보기/펼쳐보기로 확장할 수 있습니다.',
    properties: [
      {
        name: 'layout',
        title: '레이아웃 사양',
        type: 'string',
        conditions: [
          { condition: "칩 내부 여백: 가로 16px (Spacing 16), 세로 8px (Spacing 08)" },
          { condition: "칩 간 간격: 8px (Spacing 08)" },
          { condition: "글자 크기: 14px (Body 1)" },
          { condition: "모서리 둥글기: 8px" },
        ],
      },
      {
        name: 'colors-active',
        title: '활성 칩 (Active Chip)',
        type: 'ColorToken',
        conditions: [
          { condition: "배경 #0066FF (--pintel-color-primary), 글자 #FFFFFF (Bold)" },
          { condition: "대체 스타일: 배경 #18181B, 글자 #FFFFFF (다크 강조형)" },
        ],
      },
      {
        name: 'colors-inactive',
        title: '비활성 칩 (Inactive Chip)',
        type: 'ColorToken',
        conditions: [
          { condition: "배경 #F3F4F6, 글자 #71717A" },
          { condition: "호버 시 배경 #E5E7EB" },
        ],
      },
      {
        name: 'icon-button',
        title: '아이콘 버튼 (Icon Button)',
        type: 'ReactNode',
        conditions: [
          { condition: "카테고리 목록 확장/더보기 트리거 (32x32 ~ 36x36)" },
          { condition: "테두리 없는 투명 배경, 호버 시 배경 #F3F4F6" },
        ],
      },
    ],
    behavior: '항목을 클릭하면 활성(Active) 상태가 해당 칩으로 이동하며, 연결된 콘텐츠 영역이 선택된 하위 카테고리에 맞게 전환됩니다. 한 번에 하나의 항목만 활성화되는 단일 선택(Single-select) 방식이며, 표시 영역을 초과하는 항목은 우측 아이콘 버튼을 통해 펼쳐 볼 수 있습니다.',
    usage: '대시보드 상단의 대분류 탭 아래에서 세부 보기(예: 지점별 / 장비별 / 이벤트별)를 전환하거나, 콘텐츠 페이지에서 하위 분류를 빠르게 이동할 때 사용합니다. 항목 수가 많아 가로 스크롤이 필요한 경우 아이콘 버튼으로 더보기를 제공하세요.',
    code: `<nav className="ds-category">
  <button className="ds-category-chip is-active">Category</button>
  <button className="ds-category-chip">Category</button>
  <button className="ds-category-chip">Category</button>
  <button className="ds-category-more" aria-label="더보기">⋯</button>
</nav>

/* CSS */
.ds-category { display: flex; align-items: center; gap: 8px; }
.ds-category-chip {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #71717a;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
}
.ds-category-chip.is-active {
  background: var(--pintel-color-primary, #0066FF);
  color: #fff;
  font-weight: 700;
}
.ds-category-more {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
}`,
  },
  'button-text': {
    name: 'Text button',
    description: '어두운 대시보드 테두리 없이 텍스트 자체에 마우스 호버 및 클릭 인터랙션을 부여하여 가볍고 깔끔한 유틸리티 액션을 수행하는 버튼입니다.',
    overview: '대시보드 내에서 강조 수준이 낮은 부가 유틸리티 동작(예: 내보내기, 정렬 기준 변경 등)이나 보조 텍스트 링크에 주로 사용됩니다. 불필요한 테두리나 배경 없이 순수한 텍스트와 폰트 가중치, 그리고 호버 효과를 통해 시각적 복잡도를 최소화하면서도 명확한 피드백을 선사합니다.',
    properties: [
      {
        name: 'excel-download',
        title: 'EXCEL 내보내기 텍스트 버튼 사양',
        type: 'string',
        conditions: [
          { condition: "배경 및 테두리 없음 (투명)" },
          { condition: "글자 색상: #1ED45A (Positive), 호버 시 밝기 증가" },
          { condition: "크기: 12px 글자 (Bold)" },
          { condition: "폰트 가중치: 600" },
        ],
      },
      {
        name: 'datepicker-trigger',
        title: '사용자 지정 기간 선택 텍스트 버튼 사양',
        type: 'string',
        conditions: [
          { condition: "배경 및 테두리 없음 (투명)" },
          { condition: "글자 색상: #cccccd, 호버 시 밝은 화이트(#ffffff)" },
          { condition: "크기: 12px 글자" },
          { condition: "폰트 가중치: 500" },
        ],
      },
    ],
  },

  // ─── Tree ──────────────────────────────────
  'tree-item': {
    name: 'Tree.Item',
    description: '트리 구조에서 개별 항목을 나타내는 아이템이에요. 좌측 사이드바 지점/카메라 목록에 사용됩니다.',
    properties: [
      {
        name: 'padding',
        title: '내부 여백',
        type: 'SpacingMap',
        spacingMap: true,
        conditions: [
          { condition: "기본: 8px 4px (Spacing 08 / Spacing 04)" },
          { condition: "indent-1 (1단계): padding-left 24px (Spacing 24)" },
          { condition: "indent-2 (2단계): padding-left 48px (Spacing 48)" },
        ],
      },
      {
        name: 'hover',
        title: '호버 효과',
        type: 'CSS',
        conditions: [
          { condition: "background-color: #262626" },
          { condition: "color: #fff" },
        ],
      },
      {
        name: 'font-size',
        title: '글자 크기',
        type: 'number',
        conditions: [
          { condition: "13px" },
        ],
      },
    ],
  },
  'tree-accordion': {
    name: 'Tree.Accordion',
    description: '트리 아이템의 하위 목록을 열고 닫히는 래퍼에요. CSS grid 기반 슬라이드 애니메이션을 제공합니다.',
    properties: [
      {
        name: 'animation',
        title: '애니메이션',
        type: 'CSS',
        conditions: [
          { condition: "접힘: grid-template-rows: 0fr" },
          { condition: "열림: grid-template-rows: 1fr" },
          { condition: "transition: 0.35s ease-in-out" },
        ],
      },
      {
        name: 'content-effect',
        title: '콘텐츠 전환 효과',
        type: 'CSS',
        conditions: [
          { condition: "opacity: 0 ->1 (0.3s ease-out)" },
          { condition: "transform: translateY(-6px) ->translateY(0)" },
        ],
      },
    ],
  },

  // ─── Card ──────────────────────────────────
  'card-section': {
    name: 'Card.Section',
    description: '좌측 사이드바의 정보 섹션 영역이에요. 지점정보, 횡단보도 목록 등의 블록을 구성합니다.',
    properties: [
      {
        name: 'padding',
        title: '내부 여백',
        type: 'SpacingMap',
        spacingMap: true,
        conditions: [
          { condition: "24px" },
        ],
      },
      {
        name: 'border-bottom',
        title: '하단 구분선',
        type: 'string',
        conditions: [
          { condition: "1px solid #2a2a2a" },
        ],
      },
    ],
  },
  'card-panel': {
    name: 'Card',
    description: '데이터와 필터 컨트롤을 논리적인 영역으로 묶고, 상태 변화에 따라 좌측 컬러 바 지시선 등을 활용하여 정보를 계층적으로 전달하는 기본 컨테이너 카드입니다.',
    overview: '통계 대시보드의 전체 배경 위에 여러 개별 카드 영역을 배치해 정보 구조를 형성합니다. 제목과 엑셀 내보내기 유틸리티를 상단에 배치하는 통계 필터 카드(모서리 둥글기 12px)와, 위험/지체 통계의 이상 징후 등 주의를 끌기 위해 좌측에 4px의 상태 지시선(Border Left #FFA938)을 장착한 요약 알림 배너 카드(모서리 둥글기 4px) 형식을 포함합니다.',
    properties: [
      {
        name: 'layout-stats',
        title: '통계 필터 카드 사양',
        type: 'string',
        conditions: [
          { condition: "배경색: #1a1a1a, 테두리 1px solid #2a2a2a" },
          { condition: "모서리 둥글기 (Border-radius): 12px" },
          { condition: "내부 여백 (Padding): 24px (Spacing 24) 16px (Spacing 16)" },
        ],
      },
      {
        name: 'layout-banner',
        title: '알림 배너 카드 사양',
        type: 'string',
        conditions: [
          { condition: "배경색: #1a1a1a, 테두리 1px solid #2a2a2a" },
          { condition: "좌측 상태 지시선: 4px solid #FFA938 (Cautionary)" },
          { condition: "모서리 둥글기 (Border-radius): 4px" },
          { condition: "내부 여백 (Padding): 16px 16px (Spacing 16)" },
        ],
      },
    ],
    code: `{/* 통계 필터 카드 */}
<section className="ds-card">
  <header className="ds-card-head">
    <h3>위험 통계</h3>
    <button className="ds-card-action">Excel</button>
  </header>
  <div className="ds-card-body">{children}</div>
</section>

{/* 알림 배너 카드 */}
<aside className="ds-card ds-card--banner">
  <p>지체 구간 3건이 감지되었습니다.</p>
</aside>

/* CSS */
.ds-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 24px 16px;        /* Spacing 24 / Spacing 16 */
}
.ds-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ds-card--banner {
  border-left: 4px solid #FFA938;   /* Cautionary */
  border-radius: 4px;
  padding: 16px;             /* Spacing 16 */
}`,
  },

  // ─── Table ──────────────────────────────────
  'table-default': {
    name: 'Table',
    description: '테이블(Table)은 행과 열로 구조화된 데이터를 표시하는 컴포넌트입니다. 헤더, 셀, 선택용 체크박스(Input), 하단 페이지네이션으로 구성되며 장비 목록·이벤트 이력 등 대량 데이터 탐색에 사용됩니다.',
    tabs: [
      { id: 'design', label: 'Design' },
      { id: 'web', label: 'Web' },
      { id: 'cs', label: 'Cs' }
    ],
    overview: 'Content 옵션으로 행 선택용 체크박스(Input) 노출 여부를, Pagination 옵션으로 하단 페이지네이션 형태(None · Extended · Compact · Minimize)를 전환할 수 있습니다.',
    designTokens: [
      { name: 'Header Font', value: '13px / 600 / #8a8a8f', role: '헤더(Head) 텍스트' },
      { name: 'Cell Font', value: '14px / #ffffff', role: '본문 셀(Cell) 텍스트' },
      { name: 'Row Divider', value: '1px solid #232325', role: '행 사이 구분선' },
      { name: 'Checkbox', value: '18px / 1.5px #4a4a4e', role: '행 선택 체크박스(Input)' },
      { name: 'Active Page', value: '#3a3a3c / radius 6px', role: '현재 페이지 강조 배경' }
    ],
    properties: [
      {
        name: 'content',
        title: '콘텐츠 형태',
        type: "'Normal' | 'Input'",
        conditions: [
          { condition: "Normal: 헤더 + 셀만 표시" },
          { condition: "Input: 행 좌측에 선택 체크박스 추가" },
        ],
      },
      {
        name: 'pagination',
        title: '페이지네이션',
        type: "'None' | 'Extended' | 'Compact' | 'Minimize'",
        conditions: [
          { condition: "None: 페이지네이션 없음" },
          { condition: "Extended: 모든 페이지 번호 노출" },
          { condition: "Compact: 현재 페이지 주변 + 생략(…) + 마지막" },
          { condition: "Minimize: 현재/전체 페이지만 표시" },
        ],
      },
    ],
  },
  'table-row': {
    name: 'Table.Row',
    description: '테이블의 행 컨테이너에요. 장비 목록 등의 아이템을 표시합니다.',
    properties: [
      {
        name: 'padding',
        title: '내부 여백',
        type: 'SpacingMap',
        spacingMap: true,
        conditions: [
          { condition: "10px" },
        ],
      },
      {
        name: 'background',
        title: '배경 색상',
        type: 'ColorToken',
        conditions: [
          { condition: "짝수행: #262626" },
          { condition: "홀수행: transparent" },
        ],
      },
      {
        name: 'border-radius',
        title: '모서리',
        type: 'number',
        conditions: [
          { condition: "4px" },
        ],
      },
    ],
  },
  'table-col': {
    name: 'Table.Col',
    description: '테이블의 열이에요. flex: 1로 균등 분배됩니다.',
    properties: [
      {
        name: 'flex',
        title: '크기 비율',
        type: 'number',
        conditions: [
          { condition: "flex: 1 (균등 분배)" },
        ],
      },
    ],
  },

  // ─── Popup ──────────────────────────────────
  'popup-container': {
    name: 'Popup.Container',
    description: '지도 마커 클릭 시 나타나는 팝업 컨테이너에요. 다크 테마에 맞는 커스텀 스타일을 사용합니다.',
    properties: [
      {
        name: 'background',
        title: '배경 색상',
        type: 'ColorToken',
        conditions: [
          { condition: "#262626" },
        ],
      },
      {
        name: 'border',
        title: '테두리',
        type: 'string',
        conditions: [
          { condition: "1px solid #3a3a3a" },
          { condition: "border-radius: 8px" },
        ],
      },
      {
        name: 'shadow',
        title: '그림자',
        type: 'CSS',
        conditions: [
          { condition: "0 8px 24px rgba(0,0,0,0.7)" },
        ],
      },
      {
        name: 'width',
        title: '콘텐츠 너비',
        type: 'number',
        conditions: [
          { condition: "220px" },
        ],
      },
    ],
  },
  'popup-header': {
    name: 'Popup.Header',
    description: '팝업 상단 영역이에요. 제목, 부제목, 닫기 버튼을 포함합니다.',
    properties: [
      {
        name: 'padding',
        title: '내부 여백',
        type: 'SpacingMap',
        spacingMap: true,
        conditions: [
          { condition: "12px" },
        ],
      },
      {
        name: 'title',
        title: '제목 구성',
        type: 'CSS',
        conditions: [
          { condition: "font-size: 13px, font-weight: 700, color: #fff" },
        ],
      },
      {
        name: 'subtitle',
        title: '부제목 구성',
        type: 'CSS',
        conditions: [
          { condition: "font-size: 10px, color: #aaa" },
        ],
      },
    ],
  },
  'popup-tab': {
    name: 'Popup.Tab',
    description: '팝업 탭 전환 버튼이에요.',
    properties: [
      {
        name: 'padding',
        title: '내부 여백',
        type: 'SpacingMap',
        spacingMap: true,
        conditions: [
          { condition: "4px 10px" },
        ],
      },
      {
        name: 'active style',
        title: '활성 상태 스타일',
        type: 'CSS',
        conditions: [
          { condition: "background: #4a5461" },
          { condition: "color: #fff" },
          { condition: "font-weight: 500" },
        ],
      },
    ],
  },
  'popup-list-item': {
    name: 'Popup.ListItem',
    description: '팝업 내 장비 목록의 개별 아이템이에요. 아이콘 + 텍스트 레이아웃을 제공합니다.',
    properties: [
      {
        name: 'icon-wrapper',
        title: '아이콘 래퍼',
        type: 'CSS',
        conditions: [
          { condition: "width: 32px, height: 32px" },
          { condition: "border-radius: 16px (원형)" },
          { condition: "background: #1e2b45, border: 1px solid #3b82f6" },
        ],
      },
      {
        name: 'status-dot',
        title: '상태 표시 점',
        type: 'CSS',
        conditions: [
          { condition: "width: 6px, height: 6px" },
          { condition: "background: #10b981 (초록->= 색상)" },
          { condition: "position: 좌상단 (-2px, -2px)" },
        ],
      },
    ],
  },

  // ───  ──────────────────────────────────->->->->->->->->->->->->->->->->
  'form-field': {
    name: 'Form.Field',
    description: '필드명(레이블) + 입력 영역 컨테이너예요.',
    properties: [
      {
        name: 'layout',
        title: '레이아웃',
        type: 'CSS',
        conditions: [
          { condition: "display: flex, flex-direction: column" },
          { condition: "gap: 8px (Spacing 08)" },
        ],
      },
      {
        name: 'label',
        title: '라벨 스타일',
        type: 'CSS',
        conditions: [
          { condition: "font-size: 12px, color: #888" },
        ],
      },
    ],
    code: `<div className="ds-field">
  <label className="ds-field-label">지점명</label>
  <input className="ds-input" value={v} onChange={e => setV(e.target.value)} />
</div>

/* CSS */
.ds-field {
  display: flex;
  flex-direction: column;
  gap: 8px;                  /* Spacing 08 */
}
.ds-field-label {
  font-size: 12px;
  color: #888;
}`,
  },
  'form-input': {
    name: 'Form.Input',
    description: '입력 필드 플레이스홀더 영역이에요. 편집 모드에서 깜빡이는 애니메이션을 지원합니다.',
    properties: [
      {
        name: 'padding',
        title: '내부 여백',
        type: 'SpacingMap',
        spacingMap: true,
        conditions: [
          { condition: "6px" },
        ],
      },
      {
        name: 'background',
        title: '배경 색상',
        type: 'ColorToken',
        conditions: [
          { condition: "기본: #222" },
          { condition: "blinking: #222 ->#2a2a2a (0.6s infinite)" },
        ],
      },
      {
        name: 'border',
        title: '테두리',
        type: 'string',
        conditions: [
          { condition: "기본: 1px solid #333" },
          { condition: "blinking: #333 ->#888 (box-shadow 포함)" },
        ],
      },
      {
        name: 'animation',
        title: '깜빡임 애니메이션',
        type: 'CSS',
        conditions: [
          { condition: "blinkFocus 0.6s infinite" },
          { condition: "border-color 전환 + box-shadow glow 효과" },
        ],
      },
    ],
  },
  'form-grid': {
    name: 'Form.Grid',
    description: '필드를 2열 그리드로 배치하는 레이아웃이에요',
    properties: [
      {
        name: 'layout',
        title: '그리드 구성',
        type: 'CSS',
        conditions: [
          { condition: "display: grid" },
          { condition: "grid-template-columns: 1fr 1fr" },
          { condition: "gap: 12px (Spacing 12)" },
        ],
      },
    ],
  },

  // ───  ──────────────────────────────────->->->->->->->->->->->->->->->->
  'icon-camera': {
    name: 'Icon.Camera',
    description: '카메라 장비를 나타내는 아이콘이에요. 지점 마커와 팝업 등에 사용됩니다.',
    properties: [
      {
        name: 'size',
        title: '크기',
        type: 'number',
        conditions: [
          { condition: "지점 마커: 40px × 40px" },
          { condition: "팝업 내부 22px × 22px (SVG)" },
        ],
      },
      {
        name: 'color',
        title: '색상',
        type: 'ColorToken',
        conditions: [
          { condition: "stroke: currentColor (#93c5fd)" },
          { condition: "fill: none" },
        ],
      },
    ],
  },
  'icon-status': {
    name: 'Icon.Status',
    description: '장비의 연결 상태를 나타내는 원형 인디케이터예요.',
    properties: [
      {
        name: 'size',
        title: '크기',
        type: 'number',
        conditions: [
          { condition: "width: 6px, height: 6px" },
        ],
      },
      {
        name: 'color',
        title: '상태색상',
        type: 'ColorToken',
        conditions: [
          { condition: "색상: #10b981 (초록)" },
          { condition: "연결 끊김: #dc3545 (빨강)" },
        ],
      },
    ],
  },
  'icon-checkbox': {
    name: 'Icon.Checkbox',
    description: '트리 목록에서 선택 상태를 나타내는 체크박스 아이콘이에요.',
    properties: [
      {
        name: 'size',
        title: '크기',
        type: 'number',
        conditions: [
          { condition: "14px × 14px" },
        ],
      },
      {
        name: 'states',
        title: '상태 이미지',
        type: 'image',
        conditions: [
          { condition: "체크 시 Frame 2117905829.png" },
          { condition: "미체크 시 Frame 2117905825.png" },
        ],
      },
    ],
  },

  // ───  ──────────────────────────────────->->->->->->->->->->->->->->->->
  'iconography': {
    name: 'Iconography',
    description: '아이콘은 개념 또는 픽토그램으로 표현된 시각적 기호입니다. 한눈에 메시지를 전달할 수 있고, 상호작용이 가능한 중요한 정보에 주의를 끄는 역할을 합니다.',
    customLayout: 'iconography',
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'how-to-make', label: 'How to make' },
      { id: 'usage', label: 'Usage' },
    ],
    terms: [
      {
        title: 'Grid',
        description: '아이콘을 그릴 도화지입니다.\n크기: 24 x 24px',
      },
      {
        title: 'Angle',
        description: '기울어짐이나 상태를 나타내기 위해 각도를 준수해야 합니다.\nAngle: 45° 기반 (15° 단위로 조정하여 사용)',
      },
      {
        title: 'Trim area',
        description: '시각적 균형을 위해 비워두어야 하는 영역으로 아이콘이 침범하지 않도록 합니다.\n여백: 상하좌우 2px (Spacing 02)',
      },
      {
        title: 'Safe area',
        description: '시각적 균형을 위한 안전 영역으로 아이콘이 이 영역 안에서 위치하도록 합니다.\n영역: 20x20px',
      },
    ],
  },

  // ───  ──────────────────────────────────->->->->->->->->->->->->->->->->
  'chip-closeable': {
    name: 'Chip.Closeable',
    description: '상단 필터 조건 등에 사용되는 닫기 가능한 칩 컴포넌트예요. (예: "보별관제", "전체 초기화")',
    overview: '사용자가 지정한 필터 조건이나 현재 열려있는 뷰를 나타내는 시각적 인디케이터입니다. 닫기(X) 아이콘을 포함하여 사용자가 직접 해당 조건을 제거하거나 창을 닫을 수 있도록 지원합니다.',
    behavior: '마우스 오버 시 배경색이 살짝 밝아지며(Hover), 닫기 아이콘을 클릭하면 해당 칩이 목록에서 사라짐과 동시에 관련된 필터나 뷰가 해제됩니다.',
    usage: '정보 패널 상단에서 다중 관리 창을 띄운 상태를 보여주거나 사용자가 선택한 여러 필터 조건들을 나열할 때 사용합니다.',
    properties: [
      {
        name: 'background',
        title: '배경 색상',
        type: 'ColorToken',
        conditions: [
          { condition: '기본: #262626' },
          { condition: 'Hover: #333333' }
        ]
      },
      {
        name: 'icon',
        title: '크기 아이콘',
        type: 'Icon',
        conditions: [
          { condition: '측 ->아이콘(크기 12px)' }
        ]
      }
    ]
  },

  'section-header-default': {
    name: 'Section header',
    description: '섹션·패널·카드의 상단을 구성하는 헤더입니다. 제목 + 제목 옆 보조 정보(상태·개수 Chip) + 우측 트레일링(액션·메타) 슬롯으로 이루어집니다.',
    overview: '관제 대시보드의 위젯·패널마다 반복되는 가장 사용 빈도가 높은 헤더 패턴입니다. 좌측 Heading으로 영역을 식별하고, 그 옆 Heading content 슬롯에 상태·개수 등 보조 정보(주로 Chip)를 두며, 우측 Trailing content 슬롯에는 "더보기" 링크·새로고침 아이콘·갱신 시각 같은 액션/메타를 배치합니다. 세 슬롯 모두 선택적이며, 트레일링은 항상 우측 끝으로 정렬됩니다.',
    behavior: 'Heading content와 Trailing content는 선택 슬롯으로, 없으면 영역을 차지하지 않습니다(트레일링은 marginLeft:auto 로 항상 우측 끝 정렬). Trailing이 링크·아이콘 버튼 등 인터랙티브 요소이면 Hover/Active 피드백은 해당 컴포넌트(Text button·Icon button)의 규칙을 따릅니다. 헤더 자체는 상태를 갖지 않는 레이아웃 컨테이너입니다.',
    usage: '카드/패널 타이틀("알림" + 개수 Chip + "모두 보기"), 위젯 헤더("이벤트" + LIVE 상태 + 새로고침), 테이블 섹션 제목("접속 기기" + 정상 + 내보내기) 등에 사용합니다. Trailing은 단순 장식 텍스트보다 더보기·필터·갱신 시각 같은 실사용 액션/메타로 채우는 것을 권장합니다. Heading content의 Chip은 자유 텍스트보다 상태·개수·카테고리로 용도를 한정해 Library 화면 간 일관성을 유지하세요.',
    properties: [
      {
        name: 'heading',
        title: '제목 (Heading)',
        type: 'ReactNode',
        conditions: [
          { condition: '타이포: Typography.Style Heading 2 (20px / 28px)' },
          { condition: '굵기: Bold(700)' },
          { condition: '색상: Label.Strong (#ffffff, 다크 표면 위 최상위 텍스트)' }
        ]
      },
      {
        name: 'headingContent',
        title: '헤딩 콘텐츠 (Heading content)',
        type: 'ReactNode',
        conditions: [
          { condition: '제목 우측에 배치되는 보조 정보 슬롯 (선택)' },
          { condition: '주 사용처: 상태·개수·카테고리 Chip' },
          { condition: '제목과의 간격: SP[8] (8px)' }
        ]
      },
      {
        name: 'trailing',
        title: '트레일링 콘텐츠 (Trailing content)',
        type: 'ReactNode',
        conditions: [
          { condition: '우측 끝 정렬(marginLeft: auto)되는 액션·메타 슬롯 (선택)' },
          { condition: '주 사용처: 더보기·필터(Text button) · 새로고침(Icon button) · 갱신 시각(메타 텍스트)' },
          { condition: '메타 텍스트 타이포: Body 2 (15px / 22px), Medium, 보조 텍스트 색' }
        ]
      }
    ]
  },

  // ───  ──────────────────────────────────->->->->->->->->->->->->->->->->
  'control-checkbox': {
    name: 'Checkbox',
    description: '여러 항목 중 다수를 동시에 선택하거나, 단일 항목의 동의 여부를 표시하는 다중 선택 컨트롤입니다.',
    overview: '체크박스는 독립적인 다중 선택(Multi-select)에 사용됩니다. Library 화면(이벤트 조회·권한 설정 등)은 디자인 시스템 아이콘 check_on/check_off를 그대로 써서 선택(Checked)·미선택(Unchecked)을 표현합니다. 표·그리드의 일괄 선택 헤더와 셀에도 동일 아이콘을 사용하며, 부모(전체 선택)–자식 토글 구조를 지원합니다.',
    properties: [
      {
        name: 'states',
        title: '상태 (States)',
        type: 'enum',
        conditions: [
          { condition: "Unchecked: 아이콘 check_off" },
          { condition: "Checked: 아이콘 check_on (브랜드 컬러 #0066FF 채움 + 흰색 체크)" },
          { condition: "Disabled: 투명도 40%, 클릭 차단" },
          { condition: "Indeterminate(일부 선택): 전용 아이콘 미제공 — 필요 시 매트릭스 사각 변형에서 커스텀 처리" },
        ],
      },
      {
        name: 'variant',
        title: '구현 변형 (Variant)',
        type: 'enum',
        conditions: [
          { condition: "표준: Icon check_on/check_off (라벨과 함께면 18px, 단독이면 16px)" },
          { condition: "매트릭스 사각형: 16px 사각 + 1.5px 테두리(미선택 #4a4a52) → 선택 시 #0066FF 채움 + 흰 체크 (권한 설정 매트릭스 PCell)" },
        ],
      },
      {
        name: 'size',
        title: '크기 (Size)',
        type: 'string',
        conditions: [
          { condition: "라벨 동반 18px / 단독 16px" },
          { condition: "라벨과의 간격 8px (Spacing 08), 글자 14px, 색 미선택 #9a9aa2 · 선택 #e8e8ec" },
        ],
      },
    ],
    behavior: '체크 영역 또는 라벨을 클릭하면 선택 상태가 토글됩니다. "전체 선택"은 하위 항목을 일괄 토글하고, 하위가 모두 선택되면 부모도 선택(check_on)으로 반영됩니다. (아이콘 방식은 일부 선택 상태를 별도 표현하지 않으므로, 일부 선택 시 부모는 미선택으로 둡니다.)',
    usage: '관제 항목 다중 필터(이벤트 종류), 권한 매트릭스, 약관 동의, 옵션 설정 등 두 개 이상을 동시에 선택하는 영역에 사용합니다. 상호 배타적인 단일 택일에는 Radio를 사용하세요.',
    tokensUsed: ['T.primary #0066FF (선택 채움)', '색 선택 #e8e8ec · 미선택 #9a9aa2', 'SP[8] (아이콘-라벨 간격)', 'TYPE.label1/caption1 (라벨)', 'Icon check_on / check_off'],
    aliases: ['체크박스', '체크 목록', '다중 선택', '여러 개 선택', '복수 선택', '옵션 선택', '약관 동의', '전체 선택', 'checkbox', 'multi select'],
    antiPatterns: ['상호 배타적 단일 선택에 사용 금지 → Radio 사용', '즉시 적용되는 On/Off 설정에 사용 금지 → Switch 사용', '사각형·색을 하드코딩해 새 체크박스를 임의 제작하지 말 것 → 정본 아이콘 또는 매트릭스 사각 변형(16px/1.5px #4a4a52 → 선택 시 #0066FF) 사용'],
    examples: [
      "<Checkbox checked={on} onChange={setOn}>이벤트 알림</Checkbox>",
      "// 매트릭스 셀(권한 설정): 16px 사각 + 1.5px 테두리, 선택 시 #0066FF 채움 + 흰 체크",
    ],
  },
  'control-radio': {
    name: 'Radio',
    description: '서로 배타적인 여러 선택지 중 하나만 선택하는 단일 선택(Single-select) 컨트롤입니다.',
    overview: '라디오 버튼은 같은 그룹(name) 내에서 단 하나만 선택되도록 보장합니다. 외곽 원(Control)과 라벨(Label)로 구성되며, 선택 시 외곽 원 전체가 브랜드 컬러(#0066FF)로 채워지고 가운데 흰 점이 표시되며, 다른 항목을 선택하면 이전 선택은 자동으로 해제됩니다.',
    properties: [
      {
        name: 'anatomy',
        title: '구성 (Anatomy)',
        type: 'string',
        conditions: [
          { condition: "1. Control: 외곽 원 + 내부 점 — 선택 상태를 나타내는 선택 컨트롤" },
          { condition: "2. Label: 옵션을 설명하는 텍스트 라벨 (라벨 클릭으로도 선택)" },
        ],
      },
      {
        name: 'states',
        title: '상태 (States)',
        type: 'enum',
        conditions: [
          { condition: "Unchecked: 외곽 원 2px #71717A 테두리, 내부 비움(투명)" },
          { condition: "Checked: 외곽 원 전체 #0066FF 채움 + 가운데 흰색 점" },
          { condition: "Hovered: 컨트롤 뒤 연한 원형 상태 레이어" },
          { condition: "Pressed: 컨트롤 뒤 진한 원형 상태 레이어" },
          { condition: "Disabled: 투명도 40%, 클릭 차단" },
        ],
      },
      {
        name: 'size',
        title: '크기 (Size)',
        type: 'enum',
        conditions: [
          { condition: "Small: 외곽 원 16x16px, 내부 점 6x6px, 라벨 13px, 간격 6px" },
          { condition: "Medium: 외곽 원 20x20px, 내부 점 8x8px, 라벨 14px, 간격 8px (Spacing 08)" },
        ],
      },
    ],
    behavior: '한 그룹에서 하나만 선택되며, 새 항목 선택 시 기존 선택이 해제됩니다. 라벨 클릭으로도 선택할 수 있습니다.',
    usage: '단위/지표 택일, 정렬 기준, 설정값 단일 선택 등 상호 배타적인 옵션 중 하나를 고를 때 사용합니다. 다중 선택에는 Checkbox를 사용하세요.',
    tokensUsed: ['T.primary #0066FF (선택 외곽 원 전체 채움)', '내부 점 #fff', '미선택 테두리 2px #71717A', '라벨 TYPE.label2 13px', '간격 6px (Small) / SP[8] (Medium)'],
    aliases: ['라디오', '라디오 버튼', '단일 선택', '택일', '하나만 선택', '집계 단위 선택', '정렬 기준 선택', 'radio', 'single select'],
    antiPatterns: ['다중 선택에 사용 금지 → Checkbox 사용', '선택 시 테두리만 두고 작은 점을 넣지 말 것 → 외곽 원 전체 #0066FF 채움 + 흰 점(정본)', '옵션이 많아 좁으면 Select 사용 고려'],
    examples: [
      "<label className='ds-radio'><input type='radio' name='unit' /> <span className='ds-radio-dot' /> 일별</label>",
      "// Small: 외곽 16px · 내부 점 6px · 라벨 13px · 간격 6px",
    ],
    code: `<label className="ds-radio">
  <input type="radio" name="unit" value="day" />
  <span className="ds-radio-dot" /> 일별
</label>`,
  },
  'control-switch': {
    name: 'Switch',
    description: '켜짐/꺼짐(On/Off) 두 상태를 즉시 전환하는 토글 컨트롤입니다.',
    overview: '스위치는 설정의 활성/비활성을 즉각 반영하는 토글입니다. 좌우로 움직이는 손잡이(Thumb)와 이를 담는 트랙(Container)으로 구성되며, On 상태에서는 트랙이 브랜드 컬러(#0066FF)로 채워지고 손잡이가 우측으로 이동합니다. 별도의 저장 동작 없이 즉시 적용되는 설정에 적합합니다.',
    properties: [
      {
        name: 'anatomy',
        title: '구성 (Anatomy)',
        type: 'string',
        conditions: [
          { condition: "1. Thumb: 좌우로 이동하는 원형 손잡이 — 18px 흰색 + 그림자" },
          { condition: "2. Container: On/Off를 담는 트랙(pill) — Off #3a3a3a / On #0066FF, 40x22px, 둥글기 11px" },
        ],
      },
      {
        name: 'states',
        title: '상태 (States)',
        type: 'enum',
        conditions: [
          { condition: "Off: 트랙 #3a3a3a, 손잡이 좌측" },
          { condition: "On: 트랙 #0066FF, 손잡이 우측" },
          { condition: "Hover: 트랙 색 한 단계 강조 (On → #3385FF / Off → 밝은 그레이)" },
          { condition: "Disabled: 투명도 40%, 클릭 차단 (On/Off 모두)" },
        ],
      },
      {
        name: 'size',
        title: '크기 (Size)',
        type: 'enum',
        conditions: [
          { condition: "Small: 트랙 36x20px, 손잡이 16px 원형" },
          { condition: "Medium(기본): 트랙 40x22px, 손잡이 18px 원형" },
          { condition: "전환 애니메이션 150ms ease" },
        ],
      },
    ],
    behavior: '클릭하면 상태가 즉시 토글되고 변경이 곧바로 시스템에 반영됩니다. 손잡이는 부드러운 슬라이드 애니메이션으로 이동합니다.',
    usage: '오버레이 표시 여부, 알림 수신, 자동 새로고침 등 즉시 적용되는 On/Off 설정에 사용합니다. 제출이 필요한 폼 항목에는 Checkbox를 사용하세요.',
    code: `<button role="switch" aria-checked={on} onClick={() => setOn(!on)}
  className={'ds-switch' + (on ? ' is-on' : '')}>
  <span className="ds-switch-thumb" />
</button>`,
  },
  'control-slider': {
    name: 'Slider',
    description: '트랙 위 손잡이를 드래그해 수치나 구간(범위)을 조절하는 컨트롤입니다. 손잡이 2개로 시작~끝 구간을 고르는 범위(Range) 모드를 지원하며, 녹화 영상의 구간 선택 등에 사용합니다.',
    overview: '슬라이더는 트랙(Track), 채워진 구간(Fill), 조절 손잡이(Thumb), 현재 값/구간을 보여주는 Heading과 Value 라벨로 구성됩니다. 손잡이를 드래그하면 채워진 구간이 브랜드 컬러(#0066FF)로 표시되며, 범위 모드에서는 두 손잡이 사이가 선택 구간이 됩니다.',
    properties: [
      {
        name: 'anatomy',
        title: '구성 (Anatomy)',
        type: 'string',
        conditions: [
          { condition: "1. Thumb: 드래그 손잡이 — 18x18 원형 #0066FF + 흰 테두리/그림자 (범위 모드는 2개)" },
          { condition: "2. Heading: 현재 선택 값/구간 표시 (예: 02:18 ~ 12:40)" },
          { condition: "3. Track: 전체 범위 바 — 채워진 구간 #0066FF, 나머지 #3a3a3a(다크)/#d4d4d8(라이트), 높이 4px" },
          { condition: "4. Value: 각 손잡이의 현재 값 라벨" },
        ],
      },
      {
        name: 'mode',
        title: '모드 (Mode)',
        type: 'enum',
        conditions: [
          { condition: "Single: 손잡이 1개로 단일 값 조절(탐지 반경·임계치·재생 위치 등)" },
          { condition: "Highlight(녹화 영상): 시작점(0) 고정 + 손잡이 1개 — 시작부터 손잡이까지 채워진 구간이 하이라이트 시간대" },
          { condition: "Range: 손잡이 2개로 시작~끝 구간 선택" },
        ],
      },
      {
        name: 'value',
        title: '값 (Value)',
        type: 'number',
        conditions: [
          { condition: "min / max / step 지정, 드래그 시 현재 값/시간을 Heading·Value에 표시" },
          { condition: "범위 모드: 두 손잡이가 교차하지 않도록 최소 간격 유지" },
        ],
      },
    ],
    behavior: '손잡이를 드래그하거나 트랙을 클릭하면 값이 변경되며, 키보드 방향키로 step 단위 미세 조정이 가능합니다. 범위 모드에서는 두 손잡이 사이가 선택 구간이 되고, 시작 손잡이가 끝 손잡이를 넘지 못하도록 제한됩니다.',
    usage: '녹화 영상의 구간(시작~끝) 선택, 탐지 반경, 임계치, 투명도, 영상 재생 위치 등 범위 내 수치를 직관적으로 조절할 때 사용합니다.',
    code: `<input type="range" min={0} max={100} step={1}
  value={v} onChange={e => setV(Number(e.target.value))} className="ds-slider" />`,
  },
  'control-select': {
    name: 'Select',
    description: '드롭다운 목록을 펼쳐 여러 옵션 중 하나를 선택하는 컨트롤입니다.',
    overview: '셀렉트는 라벨(Heading)·필수 표시·보조 설명을 갖춘 필드와, 현재 선택값/플레이스홀더와 펼침 아이콘(▾)을 표시하는 트리거, 클릭 시 열리는 옵션 목록으로 구성됩니다. 좁은 공간에서 많은 옵션을 깔끔하게 제공하며, 선택값은 트리거에 반영됩니다.',
    properties: [
      {
        name: 'anatomy',
        title: '구성 (Anatomy)',
        type: 'string',
        conditions: [
          { condition: "1. Heading: 필드 상단 라벨" },
          { condition: "2. Required badge: 필수 입력 표시(빨강 * #FF6363)" },
          { condition: "3. Leading icon: 입력 영역 좌측 아이콘(선택)" },
          { condition: "4. Dropdown icon: 우측 펼침 chevron(▾), 펼침 시 180° 회전" },
          { condition: "5. Placeholder: 선택 전 안내 문구 #71717A" },
          { condition: "6. Description: 필드 하단 보조 설명" },
          { condition: "7. Field: 트리거 컨테이너 — 배경 #1e1e1e, 테두리 1px #2e2e2e, 둥글기 8px, 높이 40px" },
        ],
      },
      {
        name: 'trigger',
        title: '트리거 (Trigger)',
        type: 'string',
        conditions: [
          { condition: "배경 #1e1e1e, 테두리 1px #2e2e2e, 둥글기 8px, 높이 40px" },
          { condition: "우측 chevron 아이콘(▾), 펼침 시 180° 회전" },
        ],
      },
      {
        name: 'menu',
        title: '옵션 목록 (Menu)',
        type: 'string',
        conditions: [
          { condition: "선택 항목 강조: 글자 #0066FF 또는 배경 하이라이트" },
          { condition: "호버 항목 배경 #262626, 그림자 Elevation 2" },
        ],
      },
    ],
    behavior: '트리거를 클릭하면 옵션 목록이 열리고, 항목 선택 시 목록이 닫히며 값이 트리거에 반영됩니다. 외부 클릭이나 ESC로 닫힙니다.',
    usage: '기간/지점/카테고리 선택 등 옵션 수가 많아 Segmented control이나 Radio로 표현하기 어려운 단일 선택에 사용합니다.',
    code: `<div className="ds-select" onClick={toggle}>
  <span>{value ?? '선택'}</span>
  <svg className={open ? 'is-open' : ''}>{/* chevron */}</svg>
  {open && <ul className="ds-select-menu">{/* options */}</ul>}
</div>`,
  },
  'field-text': {
    name: 'Text field',
    description: '한 줄의 짧은 텍스트나 숫자를 입력받는 기본 입력 필드입니다.',
    overview: '텍스트 필드는 폼의 가장 기본이 되는 단일 행 입력 컨트롤입니다. 라벨, 입력 영역, 보조 설명/오류 메시지로 구성되며, 포커스·오류·비활성 상태를 명확한 색상으로 구분해 입력 흐름을 안내합니다.',
    properties: [
      {
        name: 'anatomy',
        title: '구성 (Anatomy)',
        type: 'string',
        conditions: [
          { condition: "라벨(12px #888) + 입력 박스 + 보조 텍스트" },
          { condition: "박스: 배경 #1e1e1e, 테두리 1px #2e2e2e, 둥글기 8px, 높이 40px" },
        ],
      },
      {
        name: 'states',
        title: '상태 (States)',
        type: 'enum',
        conditions: [
          { condition: "Focus: 테두리 #0066FF + 포커스 링" },
          { condition: "Error: 테두리 및 메시지 #FF6363, Disabled: 투명도 40%" },
        ],
      },
    ],
    behavior: '포커스 시 테두리가 브랜드 컬러로 강조되고, 유효성 검증 실패 시 오류 색상과 메시지를 표시합니다. placeholder는 입력 시 사라집니다.',
    usage: '명칭, 수치, 코드 등 한 줄 입력이 필요한 모든 폼 항목에 사용합니다. 여러 줄 입력에는 Text area를 사용하세요.',
    code: `<div className="ds-field">
  <label>지점명</label>
  <input className="ds-input" value={v} onChange={e => setV(e.target.value)} />
</div>`,
  },
  'field-textarea': {
    name: 'Text area',
    description: '여러 줄의 긴 텍스트를 입력받는 멀티라인 입력 필드입니다.',
    overview: '텍스트 영역은 메모, 설명, 조치 사유 등 여러 줄 입력에 사용합니다. 구성은 ① Heading(라벨) + ⑤ Required badge(*), ⑥ Field(입력 박스) 안의 ② Placeholder · ③ Leading content(글자수 카운터) · ⑦ Trailing content(액션 버튼), 그리고 ④ Description(보조 설명)으로 이루어집니다. 어두운 테마에서 충분한 내부 여백과 행간으로 가독성을 확보하고, maxLength 지정 시 카운터로 한도를 안내합니다.',
    properties: [
      {
        name: 'anatomy',
        title: '구성 (Anatomy)',
        type: 'string',
        conditions: [
          { condition: "1. Heading: 입력 항목 라벨 — Label 1(14px), SemiBold, #e8e8ec" },
          { condition: "2. Placeholder: 입력 전 안내 문구 — #a1a1aa" },
          { condition: "3. Leading content: 좌측 하단 글자수 카운터(N/MAX) — Caption 1, #7a7a7a (초과 시 #FF6363)" },
          { condition: "4. Description: 필드 하단 보조 설명 — Label 2, #8a8a8f (Error 시 메시지로 전환, #FF6363)" },
          { condition: "5. Required badge: Heading 우측 필수 표시(*) — #FF6363" },
          { condition: "6. Field: 입력 박스 — 배경 #161618, 테두리 1px #2e2e2e, 둥글기 8px, 내부 여백 12px(Spacing 12), 행간 1.6, 글자 14px" },
          { condition: "7. Trailing content: 우측 하단 액션 슬롯(텍스트 버튼 등) — #3385FF" },
        ],
      },
      {
        name: 'states',
        title: '상태 (States)',
        type: 'enum',
        conditions: [
          { condition: "Focus: 테두리 #0066FF + 포커스 링 rgba(0,102,255,0.25)" },
          { condition: "Error: 테두리 #FF6363 + 링 rgba(255,99,99,0.22), Description를 오류 메시지로 표시" },
          { condition: "Disabled: 입력 차단, 투명도 저하" },
        ],
      },
    ],
    webProps: [
      { name: 'label', type: 'string', defaultValue: 'undefined', desc: 'Heading(라벨) 텍스트' },
      { name: 'required', type: 'boolean', defaultValue: 'false', desc: 'Heading 우측 필수 표시(*) 노출' },
      { name: 'value', type: 'string', defaultValue: "''", desc: '입력 값 (controlled)' },
      { name: 'onChange', type: '(e) => void', defaultValue: 'undefined', desc: '입력 변경 콜백' },
      { name: 'placeholder', type: 'string', defaultValue: 'undefined', desc: '입력 전 안내 문구' },
      { name: 'maxLength', type: 'number', defaultValue: 'undefined', desc: '최대 글자수. 지정 시 좌측 하단 카운터(N/max) 표시' },
      { name: 'description', type: 'string', defaultValue: 'undefined', desc: '필드 하단 보조 설명' },
      { name: 'error', type: 'boolean', defaultValue: 'false', desc: '오류 상태(테두리·링·메시지 색 전환)' },
      { name: 'errorMessage', type: 'string', defaultValue: 'undefined', desc: 'error=true일 때 Description 자리에 표시할 메시지' },
      { name: 'trailing', type: 'ReactNode', defaultValue: 'undefined', desc: '우측 하단 Trailing content 슬롯(액션 버튼 등)' },
      { name: 'rows', type: 'number', defaultValue: '3', desc: '기본 표시 줄 수(이후 resize:vertical)' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', desc: '비활성화' },
    ],
    behavior: '입력에 따라 높이를 수동(드래그, resize:vertical) 또는 자동(auto-grow)으로 조절할 수 있으며, maxLength 지정 시 초과 입력을 막고 카운터로 안내합니다. 포커스 시 테두리가 브랜드 컬러(#0066FF)로 강조되고, Error 상태에서는 Description이 오류 메시지로 전환됩니다.',
    usage: '관제 일지, 조치 사유, 메모, 신고 내용 등 한 줄을 넘는 자유 텍스트 입력에 사용합니다. 글자수 제한이 있으면 Leading content 카운터를, 입력과 함께 즉시 동작(등록·첨부 등)이 필요하면 Trailing content를 사용합니다.',
    webCode: `import { useState } from 'react';
import { SP, TYPE, W, T } from '../data/tokens';

// 멀티라인 입력 — 라벨(필수) + 필드(글자수·액션) + 설명
export function TextArea({
  label, required, value, onChange, placeholder,
  maxLength = 2000, description, error, errorMessage, trailing, rows = 3, disabled,
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? T.error : focused ? T.primary : '#2e2e2e';
  return (
    <div>
      {label && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: SP[8], ...TYPE.label1, fontWeight: W.semibold, color: '#e8e8ec' }}>
          {label}
          {required && <span style={{ color: T.error, fontWeight: W.bold }}>*</span>}
        </label>
      )}
      <div style={{
        background: '#161618', border: \`1px solid \${borderColor}\`, borderRadius: 8,
        boxShadow: error ? '0 0 0 3px rgba(255,99,99,0.22)' : focused ? '0 0 0 3px rgba(0,102,255,0.25)' : 'none',
        padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: SP[8],
      }}>
        <textarea
          value={value} onChange={onChange} placeholder={placeholder}
          rows={rows} maxLength={maxLength} disabled={disabled}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ width: '100%', resize: 'vertical', background: 'transparent', border: 'none', outline: 'none', color: '#fff', ...TYPE.label1, lineHeight: 1.6 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ ...TYPE.caption1, color: (value?.length ?? 0) > maxLength ? T.error : '#7a7a7a' }}>
            {value?.length ?? 0}/{maxLength}
          </span>
          {trailing}
        </div>
      </div>
      {(error ? errorMessage : description) && (
        <div style={{ marginTop: SP[8], ...TYPE.label2, color: error ? T.error : '#8a8a8f' }}>
          {error ? errorMessage : description}
        </div>
      )}
    </div>
  );
}`,
  },
  'field-search': {
    name: 'Search field',
    description: '키워드를 입력해 목록이나 데이터를 실시간으로 검색·필터링하는 입력 필드입니다.',
    overview: '검색 필드는 좌측 돋보기 아이콘과 입력 영역, 우측 초기화(×) 버튼으로 구성됩니다. 입력에 따라 결과를 즉시 좁히며, 어두운 대시보드에서 가독성을 위해 옅은 배경(#1e1e1e)과 명확한 포커스 링을 제공합니다.',
    properties: [
      {
        name: 'anatomy',
        title: '구성 (Anatomy)',
        type: 'string',
        conditions: [
          { condition: "1. Search icon: 좌측 돋보기 아이콘 16~18px, #888" },
          { condition: "2. Placeholder: 입력 전 안내 문구, #71717A" },
          { condition: "3. Value: 입력된 키워드 텍스트, #FFFFFF(다크) / #18181B(라이트)" },
          { condition: "4. Field: 입력 영역 컨테이너 — 배경 #1e1e1e, 테두리 1px #2e2e2e, 둥글기 8px, 높이 40px" },
          { condition: "5. Clear button: 입력값이 있을 때만 노출되는 우측 초기화(×) 버튼" },
        ],
      },
      {
        name: 'states',
        title: '상태 (States)',
        type: 'enum',
        conditions: [
          { condition: "Empty: Placeholder 글자 #71717A, Clear 버튼 숨김" },
          { condition: "Focus: 테두리 #0066FF + 포커스 링" },
          { condition: "Filled: Value 표기 + 우측 Clear(×) 버튼 노출" },
        ],
      },
    ],
    behavior: '입력 시 결과가 실시간(또는 디바운스 후) 필터링되며, 내용이 있을 때만 우측 초기화 버튼이 나타납니다. Enter로 검색을 확정하거나 ESC로 비울 수 있습니다.',
    usage: '지점/장비 목록, 이벤트 로그, 대용량 테이블 등에서 항목을 빠르게 찾을 때 사용합니다.',
    code: `<div className="ds-search">
  <svg>{/* search icon */}</svg>
  <input value={q} onChange={e => setQ(e.target.value)} placeholder="검색" />
  {q && <button onClick={() => setQ('')}>×</button>}
</div>`,
  },
  'filter-button-default': {
    name: 'Filter button',
    description: '목록이나 대시보드 데이터에 적용할 필터 조건을 열고, 적용된 필터 개수를 표시하는 버튼입니다.',
    overview: '필터 버튼은 클릭 시 필터 패널(드롭다운/팝오버)을 열어 조건을 설정하게 합니다. 필터가 적용되면 활성 상태로 강조되고, 적용된 조건 수를 배지로 표시하여 현재 필터링 상태를 명확히 전달합니다.',
    properties: [
      {
        name: 'states',
        title: '상태 (States)',
        type: 'enum',
        conditions: [
          { condition: "Default: 테두리 1px #3a3a3a, 글자 #cccccc" },
          { condition: "Active(필터 적용): 테두리 및 글자 #0066FF, 배경 rgba(0, 102, 255,0.1)" },
        ],
      },
      {
        name: 'badge',
        title: '카운트 배지 (Count Badge)',
        type: 'number',
        conditions: [
          { condition: "적용된 필터 수를 우측 원형 배지(#0066FF, 흰 글자)로 표시" },
          { condition: "0건이면 배지 미표시" },
        ],
      },
    ],
    behavior: '클릭하면 필터 옵션 패널이 열리고, 조건을 적용하면 버튼이 활성 상태로 바뀌며 적용 개수가 배지에 반영됩니다. 다시 눌러 패널을 닫거나 필터를 초기화할 수 있습니다.',
    usage: '관제 리스트, 이벤트 로그, 통계 테이블 상단에서 표시 데이터를 조건별로 좁힐 때 사용합니다.',
  },
  'framed-style-default': {
    name: 'Framed style',
    description: '입력 요소나 콘텐츠 영역을 테두리(Frame)로 감싸 시각적으로 구획하는 컨테이너 스타일입니다.',
    overview: '프레임드 스타일은 배경을 채우지 않고 테두리만으로 영역을 구분하는 아웃라인 방식의 표현입니다. 어두운 대시보드에서 입력 그룹이나 설정 영역을 과도한 색 없이 정돈된 박스로 묶어, 정보 밀도가 높은 화면에서도 구조를 명확히 유지합니다.',
    properties: [
      {
        name: 'frame',
        title: '프레임 사양 (Frame)',
        type: 'string',
        conditions: [
          { condition: "테두리: 1px solid #2e2e2e (기본), 포커스/활성 시 #0066FF" },
          { condition: "모서리 둥글기 8px, 내부 여백 16px (Spacing 16)" },
          { condition: "배경: 투명 또는 #1a1a1a" },
        ],
      },
      {
        name: 'frameLabel',
        title: '프레임 라벨 (Frame label)',
        type: 'ReactNode',
        conditions: [
          { condition: "상단 테두리에 걸치는 라벨 선택적 표기, 글자 12px #888" },
        ],
      },
      {
        name: 'states',
        title: '상태 (States)',
        type: 'string',
        conditions: [
          { condition: "Normal: 기본 — 테두리 #2e2e2e(다크) / 연한 회색(라이트)" },
          { condition: "Hovered: 마우스 오버 — 내부 fill을 한 단계 진하게 표현" },
          { condition: "Selected: 포커스/활성 — 테두리 브랜드 컬러 #0066FF" },
          { condition: "Negative: 오류/경고 — 테두리 #FF6363" },
          { condition: "Disabled: 비활성 — 명도 낮춤, 상호작용 없음" },
          { condition: "Selected는 Normal · Hovered와 조합, Negative · Disabled는 단독 상태" },
        ],
      },
    ],
    behavior: '내부 요소가 포커스되면 프레임 테두리가 브랜드 컬러로 강조되어 현재 작업 중인 영역을 알려줍니다. 펼침/접힘 영역에 적용할 수도 있습니다.',
    usage: '설정 폼의 항목 그룹, 입력 필드 묶음, 필터 조건 영역 등 관련 요소를 하나의 단위로 구획할 때 사용합니다.',
    code: `<fieldset className="ds-framed">
  <legend>설정 그룹</legend>
  {/* inputs */}
</fieldset>`,
  },
  'control-segmented': {
    name: 'Control.Segmented',
    description: '여러 옵션 중 하나를 빠르게 선택하는 세그먼트 버튼 컨트롤입니다. (예: 일별/주별/월별)',
    overview: '기간이나 보기 방식 등 2~4개의 옵션 중 하나를 즉시 선택하는 컨트롤입니다. 드롭다운보다 직관적으로 모든 옵션을 한눈에 보여줍니다.',
    behavior: '선택되지 않은 옵션을 클릭하면 해당 위치로 하이라이트 박스가 부드럽게 이동(Sliding)하며 활성 상태가 변경됩니다.',
    usage: '차트의 데이터 집계 단위(일별/주별/월별)나 목록의 보기 방식 등을 전환할 때 사용합니다.',
    properties: [
      {
        name: 'anatomy',
        title: '구성 (Anatomy)',
        type: 'string',
        conditions: [
          { condition: "1. Segment: 개별 선택 항목 — 활성 시 흰 배경(다크: #2b2b2b) + 브랜드 컬러 라벨" },
          { condition: "2. Label: 세그먼트 텍스트 — 활성 #0066FF, 비활성 #888" },
          { condition: "3. Container: 세그먼트를 감싸는 트랙 — 배경 #1e1e1e, 내부 padding 2px(Spacing 02), 둥글기 6~8px" },
        ]
      },
      {
        name: 'background',
        title: '컨테너 배경',
        type: 'ColorToken',
        conditions: [
          { condition: '#1e1e1e (내부 padding 2px / Spacing 02)' }
        ]
      },
      {
        name: 'activeItem',
        title: '선택 아이템',
        type: 'CSS',
        conditions: [
          { condition: 'background: #2b2b2b, color: #0066FF' },
          { condition: 'border-radius: 4px' }
        ]
      }
    ]
  },
  'control-datepicker': {
    name: 'Control.DatePicker',
    description: '날짜 또는 기간을 선택하는 캘린더 팝오버 컨트롤이에요. 시간 입력이 필요하면 달력 하단에 시·분 입력 행을 결합해 일시(日時)를 함께 지정합니다.',
    overview: '월 이동(‹ ›)·요일 헤더(월~일)·날짜 그리드·하단 푸터(오늘/적용)로 구성됩니다. 단일 날짜와 기간(시작~종료)을 모두 지원하며, 시작·종료 끝점은 Primary(#0066FF) 원형, 사이 구간은 연한 파랑 밴드로 표시합니다. 시간까지 필요할 때는 날짜 그리드와 푸터 사이에 시간 입력 행(시작·종료 HH:MM)을 끼워 넣어 한 팝오버에서 일시를 함께 확정합니다.',
    behavior: '버튼을 클릭하면 캘린더 팝오버가 열립니다. 날짜를 한 번 클릭하면 시작, 다시 클릭하면 종료가 지정되어 기간이 선택됩니다. 시간 행에서 시·분을 입력한 뒤 [적용]을 누르면 선택한 날짜+시간이 함께 확정됩니다.',
    usage: '통계·이벤트 조회 등에서 사용자 지정 기간(Custom Range)을 지정할 때 사용합니다. 초 단위까지 필요하거나 기존 관제 화면(Statistics·Event Search)과 통일하려면 날짜 필드 + 시·분·초 드롭다운 방식을 쓰고, 단일 팝오버로 끝내려면 이 시간 결합 방식을 씁니다.',
    properties: [
      {
        name: 'icon',
        title: '입력 아이콘',
        type: 'Icon',
        conditions: [
          { condition: '우측 배치 (크기 16px)' }
        ]
      },
      {
        name: 'mode',
        title: '선택 모드',
        type: 'enum',
        conditions: [
          { condition: 'single(단일 날짜) / range(기간: 시작~종료)' },
          { condition: 'range는 끝점 Primary 원형 + 사이 구간 연한 파랑(#EAF0FF) 밴드' },
        ]
      },
      {
        name: 'time',
        title: '시간 결합 (Time row)',
        type: 'boolean',
        conditions: [
          { condition: '활성 시 날짜 그리드와 푸터 사이에 시간 입력 행(시작·종료 HH:MM) 노출' },
          { condition: '시·분(HH:MM) 입력 · 24시간제 · [적용]으로 날짜+시간 동시 확정' },
        ]
      }
    ]
  },

  // ───  ──────────────────────────────────->->->->->->->->->->->->->->->->
  'banner-summary': {
    name: 'Banner.Summary',
    description: '주요 통계나 알림을 요약해서 보여주는 배너 컴포넌트예요. 좌측에 두꺼운 라인 디자인이 들어갑니다.',
    overview: '아이콘의 증감률이나 핵심 인사이트를에 가게 강조크기 가해 사용는 가로형 배너입니다 좌측의 컬러 라인으로 정보의 성격이나 중요도를 시각적으로 나타냅니다.',
    behavior: '특별한 인터랙션보다는 페이지 로드 시 서서히 나타나(Fade-in) 사용자의 시선을 끄는 목적으로 동작합니다.',
    usage: '통계 차트 상단에 배치하여 "16건 +77% 증가"와 같이 차트를 분석하는 주요 결론을 요약 전달할 때 사용합니다.',
    properties: [
      {
        name: 'borderLeft',
        title: '좌측 라인 디자인',
        type: 'ColorToken',
        conditions: [
          { condition: '4px solid #f59e0b (주황->' }
        ]
      },
      {
        name: 'layout',
        title: '레이아웃',
        type: 'Flex',
        conditions: [
          { condition: '내부 요소 가로 정렬 (gap 8px / Spacing 08)' }
        ]
      }
    ]
  },

  // ───  ──────────────────────────────────->->->->->->->->->->->->->->->->
  'list-checkable': {
    name: 'List.Checkable',
    description: '좌측 사이드바에서 사용하는 체크박스와 텍스트, 숫자 배지가 결합된 리스트 아이템이에요.',
    overview: '다중 선택이 가능한 트리 목록을 표시할 때 사용합니다. 아이템의 이름과 상태(선택 여부), 그리고 부가적인 데이터 건수 등을 한 줄에 압축적으로 보여줍니다.',
    behavior: '행 전체 영역나 체크박스를 클릭하면 선택 상태가 ->며, 선택 시 텍스트와 체크박스 색상->브랜드 컬러(#0066FF)로 하이라이트됩니다.',
    usage: '관제 리스트나 통계 정보 보별에서 여러 개의 지점이나 장비 등을 개별적으로 선택 및 해제하여 메인 차트나 지도의 데이터를 필터링할 때 사용합니다.',
    properties: [
      {
        name: 'components',
        title: '구성 요소',
        type: 'Composition',
        conditions: [
          { condition: '좌측: Checkbox 아이콘' },
          { condition: '중앙: 지점명 텍스트' },
          { condition: '우측: 개수 배지 (숫자)' }
        ]
      },
      {
        name: 'checkedState',
        title: '선택 상태',
        type: 'CSS',
        conditions: [
          { condition: '체크 ->아이템을텍스트색상: #0066FF (브랜드 컬러' }
        ]
      }
    ]
  },

  // ───  ──────────────────────────────────->->->->->->->->->->->->->->->->
  'chart-mixed': {
    name: 'Chart.Mixed',
    description: '막대그래프(Bar)와 꺾은선그래프(Line)가 결합된 복합 통계 차트예요. 특정 데이터의 최대/최소 포인트를 강조할 수 있습니다.',
    overview: '정보 보별의 메인 시각화 컴포넌트로, 막대그래프(Bar)와 꺾은선그래프(Line)를 결합하여 현재 데이터와 비교 기준 데이터를 한눈에 대조할 수 있도록 설계된 복합 차트입니다. 상단 필터와 상호작용하여 데이터를 동적으로 표시합니다.',
    behavior: '상단 필터(전체/평일/주말 등) 클릭 시 데이터가 부드럽게 전환(Transition)됩니다. 비교 기준치와 차이가 큰 데이터 지점은 시스템이 자동으로 계산하여 시각적으로 하이라이트(주황색) 처리하며, 마우스 오버 시 상세 툴팁을 제공할 수 있습니다.',
    usage: '통계, 분석 ->보이에요2색상->지->내부 가재 사용자가vs 과거 4->균)시간대별로 빠르게 비교 분석->->주요 컴포트사용됩니다.',
    properties: [
      {
        name: 'barStyle',
        title: '막대 스타일',
        type: 'CSS',
        conditions: [
          { condition: '기본: 브랜드 컬러 그라데이션 (상단 불투명 -> 하단 투명)' },
          { condition: '강조(전일 차이): 주황색 막대 (#f59e0b)' },
          { condition: '상단 둥근 모서리 적용 (border-top-radius: 4px)' }
        ]
      },
      {
        name: 'lineStyle',
        title: '꺾은선 스타일',
        type: 'CSS',
        conditions: [
          { condition: '비교 기준: 흰색 점선 (dashed)' },
          { condition: '데이터 포인트(Dot) 표시' }
        ]
      },
      {
        name: 'legend',
        title: '범례 표시',
        type: 'Content',
        conditions: [
          { condition: '평균(원형 점), 전일 차이(주황 사각형), 비교 기준(점선) 등을 상단 우측에 배치' }
        ]
      }
    ]
  },
  'alert-default': {
    name: 'Alert',
    description: '시스템 상태 변화나 인지해야 하는 주요 이벤트를 사용자에게 즉각 전달하는 피드백 컴포넌트입니다.',
    tabs: [
      { id: 'design', label: 'Design' },
      { id: 'web', label: 'Web' },
      { id: 'cs', label: 'Cs' }
    ],
    overview: '알럿(Alert) 컴포넌트는 도시 안전, 신호 상태 변화, 장비 장애 등 관제 화면에서 즉각적이고 정확한 확인이 필요한 상황을 시각적으로 인지시키기 위해 사용됩니다. 상태의 긴급도에 따라 4가지 의미적 색상(Success, Info, Warning, Error)을 부여하여 정보 가독성을 제어합니다.',
    designTokens: [
      { name: 'Border Radius', value: '6px', role: '컴포넌트 테두리 둥글기' },
      { name: 'Spacing (Inner Padding)', value: '12px 16px (상하 12px, 좌우 16px)', role: '내부 여백 구성' },
      { name: 'Typography (Title)', value: 'Pretendard GOV Title (14px, SemiBold)', role: '알럿 제목 위계' },
      { name: 'Typography (Message)', value: 'Pretendard GOV Body 2 (12px, Regular)', role: '알럿 메시지 본문' }
    ],
    webProps: [
      { name: 'type', type: "'success' | 'info' | 'warning' | 'error'", defaultValue: "'info'", desc: '알럿의 피드백 유형 및 테마 색상 설정' },
      { name: 'title', type: 'string', defaultValue: 'undefined', desc: '알럿 상단에 굵게 노출될 제목 텍스트' },
      { name: 'message', type: 'string', defaultValue: 'required', desc: '알럿 본문에 들어갈 설명 메시지 텍스트' },
      { name: 'isCloseable', type: 'boolean', defaultValue: 'true', desc: "닫기 버튼 제공 여부 (bottom: 하단 footer의 '닫기' 버튼 / inline: 우측 상단 × )" },
      { name: 'onClose', type: '() => void', defaultValue: 'undefined', desc: '닫기 버튼 클릭 시 호출되는 콜백 함수' },
      { name: 'actionLabel', type: 'string', defaultValue: 'undefined', desc: '추가 조치 액션 버튼 텍스트' },
      { name: 'onAction', type: '() => void', defaultValue: 'undefined', desc: '액션 버튼 클릭 시 호출되는 콜백 함수' },
      { name: 'actionLayout', type: "'bottom' | 'inline'", defaultValue: "'bottom'", desc: "액션 버튼 배치 — 'bottom'은 본문 아래 footer 행 우측 정렬(기본), 'inline'은 닫기 버튼과 같은 우측 열에 배치" }
    ],
    csProperties: [
      { name: 'AlertType', type: 'AlertType (Enum)', desc: '알럿 종류 설정 (Success, Info, Warning, Error)' },
      { name: 'Title', type: 'string', desc: '알럿 제목 문자열' },
      { name: 'Message', type: 'string', desc: '상세 알림 내용 본문 문자열' },
      { name: 'IsCloseable', type: 'bool', desc: '닫기(X) 버튼을 화면에 표시할지 여부' },
      { name: 'CloseCommand', type: 'ICommand', desc: '닫기 버튼 클릭 시 실행될 ViewModel 바인딩 커맨드' },
      { name: 'ActionLabel', type: 'string', desc: '액션 실행을 위한 버튼의 텍스트 콘텐츠' },
      { name: 'ActionCommand', type: 'ICommand', desc: '액션 버튼 클릭 시 실행될 ViewModel 바인딩 커맨드' },
      { name: 'ActionPlacement', type: 'AlertActionPlacement (Enum)', desc: '액션 버튼 배치 (Bottom: 본문 하단 footer 우측 정렬 / Inline: 닫기와 같은 우측 열)' }
    ],
    webCode: `// React Alert Component Example
import React from 'react';
import './Alert.css';

export function Alert({ type = 'info', title, message, isCloseable = true, onClose, actionLabel, onAction, actionLayout = 'bottom' }) {
  const action = actionLabel && onAction && (
    <button className="ds-alert-action" onClick={onAction}>{actionLabel}</button>
  );
  const isBottom = actionLayout === 'bottom';
  return (
    <div className={\`ds-alert \${type} layout-\${actionLayout}\`}>
      {/* 상단 행: 아이콘 + 본문 (+ inline일 땐 우측 상단 × · 액션) */}
      <div className="ds-alert-row">
        <div className="ds-alert-icon" />
        <div className="ds-alert-content">
          {title && <div className="ds-alert-title">{title}</div>}
          <div className="ds-alert-message">{message}</div>
        </div>
        {!isBottom && (
          <div className="ds-alert-aside">
            {isCloseable && (
              <button className="ds-alert-close" onClick={onClose} aria-label="Close alert">×</button>
            )}
            {action}
          </div>
        )}
      </div>
      {/* 하단 footer 행(기본): [닫기][액션] 우측 정렬 */}
      {isBottom && (isCloseable || action) && (
        <div className="ds-alert-footer">
          {isCloseable && (
            <button className="ds-alert-close-text" onClick={onClose}>닫기</button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}`,
    csCode: `<!-- C# WPF / XAML Alert Control Template -->
<ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
                    xmlns:local="clr-namespace:Pintel.DesignSystem.Controls">

    <Style TargetType="{x:Type local:Alert}">
        <Setter Property="Background" Value="#1E2B45"/>
        <Setter Property="BorderThickness" Value="1"/>
        <Setter Property="BorderBrush" Value="#3B82F6"/>
        <Setter Property="Padding" Value="12,16"/>
        <Setter Property="Template">
            <Setter.Value>
                <ControlTemplate TargetType="{x:Type local:Alert}">
                    <Border CornerRadius="6"
                            Background="{TemplateBinding Background}"
                            BorderBrush="{TemplateBinding BorderBrush}"
                            BorderThickness="{TemplateBinding BorderThickness}"
                            Padding="{TemplateBinding Padding}">
                        <Grid>
                            <Grid.ColumnDefinitions>
                                <ColumnDefinition Width="Auto"/>
                                <ColumnDefinition Width="*"/>
                                <ColumnDefinition Width="Auto"/>
                            </Grid.ColumnDefinitions>
                            
                            <!-- Status Icon Accent -->
                            <Path x:Name="IconPath" Grid.Column="0" Margin="0,0,12,0" 
                                  VerticalAlignment="Top" Width="18" Height="18" ... />
                                  
                            <!-- Content Area -->
                            <StackPanel Grid.Column="1" VerticalAlignment="Center">
                                <TextBlock Text="{TemplateBinding Title}" FontWeight="SemiBold" 
                                           FontSize="14" Foreground="#FFFFFF" Margin="0,0,0,4"
                                           Visibility="{TemplateBinding TitleVisibility}"/>
                                <TextBlock Text="{TemplateBinding Message}" FontSize="12" 
                                           Foreground="#CCCCCC" TextWrapping="Wrap"/>
                                           
                                <Button Content="{TemplateBinding ActionLabel}" Margin="0,8,0,0"
                                        Command="{TemplateBinding ActionCommand}"
                                        Visibility="{TemplateBinding ActionVisibility}"/>
                            </StackPanel>
                            
                            <!-- Close Button -->
                            <Button Grid.Column="2" Command="{TemplateBinding CloseCommand}"
                                    Visibility="{TemplateBinding CloseButtonVisibility}"/>
                        </Grid>
                    </Border>
                </ControlTemplate>
            </Setter.Value>
        </Setter>
    </Style>
</ResourceDictionary>`
  },
  'content-badge-default': {
    name: 'Content badge',
    description: '객체나 상태에 메타 데이터 태그나 추가 상태 정보를 부여할 때 사용되는 컴포넌트입니다.',
    tabs: [
      { id: 'design', label: 'Design' },
      { id: 'web', label: 'Web' },
      { id: 'cs', label: 'Cs' }
    ],
    overview: '콘텐츠 배지(Content badge)는 지점 정보, 장비 목록 등 대시보드 내 리스트나 카드에서 부가적인 분류 태그나 경고/정상 상태 등을 시각적으로 라벨링하여 가독성을 높여줍니다. 전면 아이콘과 후면 아이콘 슬롯을 활성화하여 닫기 액션이나 다양한 식별 심볼을 병기할 수 있습니다.',
    properties: [
      {
        name: 'color',
        title: '색상 테마',
        type: 'string',
        conditions: [
          { condition: "Neutral: 회색조 비활성/태그" },
          { condition: "Accent: 핀텔 브랜드 컬러 강조 배지" }
        ]
      },
      {
        name: 'size',
        title: '크기',
        type: 'string',
        conditions: [
          { condition: "XSmall (높이 20px): 테이블 셀·리스트 등 조밀한 영역의 인라인 카운트/상태 표시" },
          { condition: "Small (높이 24px): 기본값. 카드·폼·필터 등 대부분의 일반 UI에서 가장 널리 사용" },
          { condition: "Medium (높이 28px): 헤더·툴바 등 단독으로 노출되어 높은 주목도가 필요한 영역" },
          { condition: "좌우 너비는 콘텐츠에 맞춰 가변, 높이는 위 3단계로 고정하여 사용" }
        ]
      },
      {
        name: 'gap',
        title: '나열 간격',
        type: 'string',
        conditions: [
          { condition: "Badge를 여러 개 나열할 때 간격을 일정하게 사용" },
          { condition: "XSmall · Small: 6px 권장" },
          { condition: "Medium: 8px (Spacing 08) 권장" }
        ]
      },
      {
        name: 'leadingIcon',
        title: '전면 아이콘 여부',
        type: 'boolean',
        conditions: [
          { condition: "True: 라벨 앞 상태/카테고리 아이콘 노출" },
          { condition: "False: 아이콘 숨김" }
        ]
      },
      {
        name: 'trailingIcon',
        title: '후면 아이콘 여부',
        type: 'boolean',
        conditions: [
          { condition: "True: 라벨 뒤 제거 버튼 또는 닫기 아이콘 노출" },
          { condition: "False: 아이콘 숨김" }
        ]
      },
      {
        name: 'padding',
        title: '내부 여백',
        type: 'SpacingMap',
        spacingMap: true,
        conditions: [
          { condition: "아이콘 있을 때: 가로 8px (Spacing 08), 세로 4px (Spacing 04)" },
          { condition: "아이콘 없을 때: 가로 12px (Spacing 12), 세로 4px (Spacing 04)" }
        ]
      },
      {
        name: 'border-radius',
        title: '테두리 반경',
        type: 'string',
        conditions: [
          { condition: "6px" }
        ]
      }
    ],
    webProps: [
      { name: 'color', type: "'neutral' | 'accent'", defaultValue: "'accent'", desc: '배지 색상 테마' },
      { name: 'leadingIcon', type: "boolean", defaultValue: "false", desc: '전면 아이콘 노출 여부' },
      { name: 'trailingIcon', type: "boolean", defaultValue: "false", desc: '후면 아이콘 노출 여부' }
    ],
    webCode: `// React Content Badge Component Example
import React from 'react';
import './ContentBadge.css';

export function ContentBadge({ color = 'accent', leadingIcon, trailingIcon, label, onRemove }) {
  const isAccent = color === 'accent';
  return (
    <div className={\`ds-content-badge \${isAccent ? 'accent' : 'neutral'}\`}>
      {leadingIcon && (
        <span className="ds-content-badge-icon leading">
          <span className="dot" />
        </span>
      )}
      <span className="ds-content-badge-label">{label}</span>
      {trailingIcon && (
        <button type="button" className="ds-content-badge-icon trailing" onClick={onRemove}>
          ×
        </button>
      )}
    </div>
  );
}`,
    csProperties: [
      { name: 'ContentBadge.ColorMode', type: 'ColorModeEnum', desc: '배지의 색상 모드(Neutral, Accent)' },
      { name: 'ContentBadge.HasLeadingIcon', type: 'bool', desc: '전면 아이콘 가시성 여부' },
      { name: 'ContentBadge.HasTrailingIcon', type: 'bool', desc: '후면 아이콘 가시성 여부' }
    ],
    csCode: `<!-- C# WPF / XAML Content Badge Custom Control Template -->
<Style TargetType="{x:Type controls:ContentBadge}">
    <Setter Property="Background" Value="rgba(0, 194, 255, 0.08)"/>
    <Setter Property="BorderBrush" Value="rgba(0, 194, 255, 0.4)"/>
    <Setter Property="BorderThickness" Value="1"/>
    <Setter Property="Padding" Value="8,4"/>
    <Setter Property="CornerRadius" Value="6"/>
    <Setter Property="Template">
        <Setter.Value>
            <ControlTemplate TargetType="{x:Type controls:ContentBadge}">
                <Border Background="{TemplateBinding Background}"
                        BorderBrush="{TemplateBinding BorderBrush}"
                        BorderThickness="{TemplateBinding BorderThickness}"
                        CornerRadius="{TemplateBinding CornerRadius}"
                        Padding="{TemplateBinding Padding}">
                    <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
                        <!-- Leading Icon -->
                        <ContentPresenter x:Name="LeadingIconPresenter" 
                                          Content="{TemplateBinding LeadingIcon}"
                                          Visibility="{TemplateBinding LeadingIconVisibility}"/>
                        
                        <!-- Text Label -->
                        <TextBlock Text="{TemplateBinding Label}" 
                                   Foreground="{TemplateBinding Foreground}"
                                   Margin="4,0" VerticalAlignment="Center"/>
                        
                        <!-- Trailing Icon / Close Button -->
                        <Button x:Name="CloseButton" 
                                Command="{TemplateBinding CloseCommand}"
                                Visibility="{TemplateBinding TrailingIconVisibility}"/>
                    </StackPanel>
                </Border>
            </ControlTemplate>
        </Setter.Value>
    </Setter>
</Style>`
  },
  'list-cell-default': {
    name: 'List cell',
    description: '리스트 셀(List cell)은 수직 리스트 안에서 반복되는 가장 기초적인 행 단위 컴포넌트입니다. 왼쪽의 아이콘/체크박스 등의 Leading 영역, 제목과 설명의 텍스트 영역, 오른쪽의 부가 정보나 액션의 Trailing 영역으로 구성됩니다.',
    tabs: [
      { id: 'design', label: 'Design' },
      { id: 'web', label: 'Web' },
      { id: 'cs', label: 'Cs' }
    ],
    overview: '주로 CCTV 리스트, 이벤트 이력, 설정 목록 등에서 각 개별 정보를 표시할 때 사용하며, 핀텔 디자인 가이드를 준수하여 텍스트의 정렬과 여백을 규격화했습니다.',
    designTokens: [
      { name: 'Height (Default)', value: '56px', role: '셀의 기본 세로 크기' },
      { name: 'Padding (Container)', value: '12px 16px', role: '셀 내부 상하좌우 여백' },
      { name: 'Font Size (Label)', value: '14px', role: '주요 텍스트의 크기' },
      { name: 'Font Color (Description)', value: '#888888', role: '부연 설명 텍스트 색상' },
      { name: 'Border (Divider)', value: '1px solid #2e2e2e', role: '하단 경계선 색상' }
    ],
    webProps: [
      { name: 'leading', type: 'ReactNode', defaultValue: 'undefined', desc: '좌측 정렬 영역에 들어갈 아이콘 또는 컴포넌트' },
      { name: 'label', type: 'string', defaultValue: 'required', desc: '메인 텍스트 제목' },
      { name: 'description', type: 'string', defaultValue: 'undefined', desc: '하단 부연 설명 텍스트' },
      { name: 'trailing', type: 'ReactNode', defaultValue: 'undefined', desc: '우측 정렬 영역에 들어갈 텍스트 또는 퀵 액션' },
      { name: 'divider', type: 'boolean', defaultValue: 'true', desc: '하단 구분선 노출 여부' }
    ],
    webCode: `// React ListCell 컴포넌트 예제
import React from 'react';

export function ListCell({ leading, label, description, trailing, divider = true }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      backgroundColor: '#1a1a1a',
      fontFamily: 'Pretendard, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        minHeight: '56px',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          {leading && <div style={{ display: 'flex', alignItems: 'center' }}>{leading}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{label}</span>
            {description && <span style={{ fontSize: '12px', color: '#888888' }}>{description}</span>}
          </div>
        </div>
        {trailing && <div style={{ display: 'flex', alignItems: 'center', color: '#aaaaaa' }}>{trailing}</div>}
      </div>
      {divider && <div style={{ height: '1px', backgroundColor: '#2e2e2e', margin: '0 16px' }} />}
    </div>
  );
}`,
    csProperties: [
      { name: 'ListCell.Leading', type: 'object', desc: '좌측 영역의 컨텐츠 바인딩' },
      { name: 'ListCell.Label', type: 'string', desc: '메인 타이틀 문자열' },
      { name: 'ListCell.Description', type: 'string', desc: '하단 상세 설명 문자열' },
      { name: 'ListCell.Trailing', type: 'object', desc: '우측 영역의 컨텐츠 바인딩' },
      { name: 'ListCell.HasDivider', type: 'bool', desc: '하단 디바이더선 표시 여부' }
    ]
  },
  'list-card-default': {
    name: 'List card',
    description: '리스트 카드(List card)는 리스트 셀에 비해 더 풍부한 정보를 담을 수 있는 카드 형태의 컴포넌트입니다. 썸네일 이미지, 다양한 텍스트 라인(Heading, Caption, Extra caption), 그리고 상단/하단/좌측/우측의 다목적 컨텐츠 영역을 지원합니다.',
    tabs: [
      { id: 'design', label: 'Design' },
      { id: 'web', label: 'Web' },
      { id: 'cs', label: 'Cs' }
    ],
    overview: '주로 차량 번호 인식 이벤트, 지능형 선별 관제에서 검지된 객체 정보(차량, 사람)를 이미지 썸네일과 함께 그리드나 리스트 형식으로 표출할 때 핵심적으로 사용됩니다.',
    designTokens: [
      { name: 'Border Radius (Container)', value: '8px', role: '전체 외곽선의 둥글기 값' },
      { name: 'Background (Container)', value: '#1a1a1a', role: '카드 기본 다크 테마 배경 색상' },
      { name: 'Width (Thumbnail)', value: '80px', role: '이미지 썸네일의 고정 너비' },
      { name: 'Font Size (Heading)', value: '14px', role: '헤딩 텍스트의 크기 및 Bold 적용' },
      { name: 'Font Color (Caption)', value: '#888888', role: '캡션 및 추가 캡션 텍스트 색상' }
    ],
    webProps: [
      { name: 'thumbnail', type: 'string', defaultValue: 'undefined', desc: '썸네일 이미지 URL' },
      { name: 'leading', type: 'ReactNode', defaultValue: 'undefined', desc: '좌측 영역 아이콘 또는 체크박스 등' },
      { name: 'heading', type: 'string', defaultValue: 'required', desc: '핵심 타이틀' },
      { name: 'caption', type: 'string', defaultValue: 'undefined', desc: '보조 설명' },
      { name: 'extraCaption', type: 'string', defaultValue: 'undefined', desc: '추가 설명' },
      { name: 'topContent', type: 'ReactNode', defaultValue: 'undefined', desc: '상단 뱃지 또는 레이블 영역' },
      { name: 'trailing', type: 'ReactNode', defaultValue: 'undefined', desc: '우측 퀵 액션 버튼 영역' },
      { name: 'bottomContent', type: 'ReactNode', defaultValue: 'undefined', desc: '하단 메타 텍스트 또는 꼬리말 영역' }
    ],
    webCode: `// React ListCard 컴포넌트 예제
import React from 'react';

export function ListCard({
  thumbnail,
  leading,
  heading,
  caption,
  extraCaption,
  topContent,
  trailing,
  bottomContent
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      border: '1px solid #2e2e2e',
      padding: '12px',
      boxSizing: 'border-box',
      fontFamily: 'Pretendard, sans-serif'
    }}>
      {/* Top Content */}
      {topContent && (
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          {topContent}
        </div>
      )}

      {/* Main Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Leading Content */}
        {leading && <div style={{ display: 'flex', alignItems: 'center' }}>{leading}</div>}

        {/* Thumbnail */}
        {thumbnail && (
          <div style={{
            width: '80px',
            height: '60px',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#2b2b2b'
          }}>
            <img src={thumbnail} alt={heading} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        {/* Text Contents */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{heading}</span>
          {caption && <span style={{ fontSize: '12px', color: '#888888' }}>{caption}</span>}
          {extraCaption && <span style={{ fontSize: '11px', color: '#aaaaaa' }}>{extraCaption}</span>}
        </div>

        {/* Trailing Content */}
        {trailing && <div style={{ display: 'flex', alignItems: 'center' }}>{trailing}</div>}
      </div>

      {/* Bottom Content */}
      {bottomContent && (
        <div style={{ marginTop: '8px', borderTop: '1px solid #2e2e2e', paddingTop: '8px' }}>
          {bottomContent}
        </div>
      )}
    </div>
  );
}`,
    csProperties: [
      { name: 'ListCard.Thumbnail', type: 'ImageSource', desc: '썸네일 이미지 소스' },
      { name: 'ListCard.Leading', type: 'object', desc: '좌측 컨텐츠 영역' },
      { name: 'ListCard.Heading', type: 'string', desc: '메인 헤딩 문자열' },
      { name: 'ListCard.Caption', type: 'string', desc: '서브 캡션 문자열' },
      { name: 'ListCard.ExtraCaption', type: 'string', desc: '추가 캡션 문자열' },
      { name: 'ListCard.TopContent', type: 'object', desc: '상단 영역 바인딩' },
      { name: 'ListCard.Trailing', type: 'object', desc: '우측 영역 바인딩' },
      { name: 'ListCard.BottomContent', type: 'object', desc: '하단 영역 바인딩' }
    ]
  },
  'action-area-default': {
    name: 'Action area',
    description: '화면 하단이나 특정 영역에서 사용자의 최종 의사결정을 유도하는 액션 버튼들의 배치 그룹입니다. 중요도에 따라 Main action, Alternative action, Sub action으로 위계를 나누어 정렬합니다.',
    tabs: [
      { id: 'design', label: 'Design' },
      { id: 'web', label: 'Web' },
      { id: 'cs', label: 'Cs' }
    ],
    overview: '모달 창 하단, 시트 하단 등에서 의사결정을 유도할 때 정렬 규칙을 제시합니다. 중요도가 가장 높은 Main action은 단 하나만 존재해야 하며, 대체 액션(Alternative action)과 보조 액션(Sub action)은 상황에 따라 유연하게 배치합니다.',
    designTokens: [
      { name: 'Height', value: '52px', role: '액션 영역 세로 크기' },
      { name: 'Button Width', value: '100%', role: '전체 너비 대응' },
      { name: 'Gap', value: '12px', role: '버튼 간 간격' }
    ],
    webProps: [
      { name: 'mainAction', type: 'string', defaultValue: '확인', desc: '가장 강조되는 메인 액션 버튼 텍스트' },
      { name: 'alternativeAction', type: 'string', defaultValue: '취소', desc: '대체 동작을 수행하는 아웃라인 버튼 텍스트' },
      { name: 'subAction', type: 'string', defaultValue: '건너뛰기', desc: '보조적인 동작을 수행하는 텍스트 버튼 텍스트' }
    ],
    csProperties: [
      { name: 'ActionArea.MainAction', type: 'string', desc: '메인 액션 버튼의 XAML Content 문자열' },
      { name: 'ActionArea.AlternativeAction', type: 'string', desc: '대체 액션 버튼의 XAML Content 문자열' },
      { name: 'ActionArea.SubAction', type: 'string', desc: '보조 액션 버튼의 XAML Content 문자열' }
    ],
    behavior: '가장 중요한 1순위 액션(Main)은 우측 또는 상단에 오도록 하며, 시각적 주목도가 가장 높은 채워진(Solid) 형태를 사용합니다. 2순위 액션(Alternative)은 아웃라인 스타일을, 3순위 액션(Sub)은 테두리가 없는 텍스트 스타일을 적용하여 시각적 간섭을 줄입니다. (5단계 가이드라인에 따라 파란색 계열 대신 블랙 계열을 메인 스타일로 차용합니다.)',
    usage: '모달 대화상자 하단 액션 바, 폼 입력 완료 영역, 설정 페이지 하단 저장 영역 등에 사용합니다.',
    webCode: `// React ActionArea 예제 코드
import React from 'react';
import './ActionArea.css';

export function ActionArea({ onMain, onAlternative, onSub }) {
  return (
    <div className="ds-action-area">
      <button className="ds-btn-main" onClick={onMain}>확인</button>
      <button className="ds-btn-alternative" onClick={onAlternative}>취소</button>
      <button className="ds-btn-sub" onClick={onSub}>건너뛰기</button>
    </div>
  );
}`,
    csCode: `<!-- WPF ActionArea Style & Layout -->
<StackPanel Orientation="Vertical" Margin="20">
    <Button Style="{StaticResource MainActionButtonStyle}" Content="확인" Command="{Binding MainCommand}"/>
    <Button Style="{StaticResource AlternativeButtonStyle}" Content="취소" Command="{Binding AlternativeCommand}" Margin="0,12,0,0"/>
    <Button Style="{StaticResource SubActionButtonStyle}" Content="건너뛰기" Command="{Binding SubCommand}" Margin="0,12,0,0"/>
</StackPanel>`
  },
  'toast-default': {
    name: 'Toast',
    description: '화면의 특정 위치에 플로팅 형태로 표시되어, 사용자의 조작에 대한 즉각적인 피드백이나 간단한 시스템 상태 메시지를 알려주는 일시적 알림 컴포넌트입니다.',
    tabs: [
      { id: 'design', label: 'Design' },
      { id: 'web', label: 'Web' },
      { id: 'cs', label: 'Cs' }
    ],
    overview: '토스트(Toast)는 화면 상단 중앙이나 우측 하단 등에 일정 시간 동안 나타났다 자동으로 사라지는 경량 알림 컴포넌트입니다. 화면 흐름을 방해하지 않는 비침입성(Non-disruptive) 설계가 특징이며, 좌측의 상태별 의미 아이콘(Leading Icon)과 메시지(Message)를 결합하여 상태 변화를 명확하게 지시합니다.',
    designTokens: [
      { name: 'Padding', value: '10px 16px', role: '토스트 내부 패딩' },
      { name: 'Height', value: '최소 40px', role: '토스트 높이 규격' },
      { name: 'Border Radius', value: '8px', role: '토스트 테두리 곡률' },
      { name: 'Elevation', value: '0px 4px 12px rgba(0,0,0,0.15)', role: '공중에 떠 있는 효과를 위한 그림자' }
    ],
    webProps: [
      { name: 'type', type: "'neutral' | 'success' | 'warning' | 'error'", defaultValue: "'neutral'", desc: '토스트 유형 및 상태 테마' },
      { name: 'message', type: 'string', defaultValue: "''", desc: '출력할 피드백 메시지 텍스트' },
      { name: 'showIcon', type: 'boolean', defaultValue: 'true', desc: '좌측 상태 아이콘 표시 여부' }
    ],
    csProperties: [
      { name: 'Toast.Type', type: 'ToastType (Enum)', desc: '토스트 메시지 유형 지정' },
      { name: 'Toast.Message', type: 'string', desc: '토스트에 표시할 문자열 바인딩' },
      { name: 'Toast.ShowIcon', type: 'bool', desc: '좌측 상태 아이콘 보이기 속성' }
    ],
    behavior: '토스트는 사용자가 확인 버튼을 누르지 않아도 약 3초에서 5초 이내에 모션 애니메이션과 함께 자동으로 페이드아웃되어 사라집니다. 교통 관제 대시보드 화면에서는 여러 알림이 겹쳐서 표시될 경우 아래에서 위로(혹은 위에서 아래로) 순차적으로 적층(Stacking)되어 나열되는 것이 원칙입니다.',
    usage: '데이터 수동 동기화 완료 알림, 장비 연결 성공/실패 팝업 피드백, 설정값 임시 저장 등 사용자의 실시간 작업에 대한 빠른 안내가 필요할 때 사용합니다.',
    webCode: `// React Toast Component Example
import React, { useEffect } from 'react';
import './Toast.css';

export function Toast({ type = 'neutral', message, showIcon = true, duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={\`ds-toast \${type}\`}>
      {showIcon && <div className="ds-toast-icon" />}
      <span className="ds-toast-message">{message}</span>
    </div>
  );
}`,
    csCode: `<!-- C# WPF / XAML Toast Control Template -->
<Style TargetType="{x:Type local:Toast}">
    <Setter Property="Background" Value="#707580"/>
    <Setter Property="BorderThickness" Value="0"/>
    <Setter Property="Padding" Value="16,10"/>
    <Setter Property="Template">
        <Setter.Value>
            <ControlTemplate TargetType="{x:Type local:Toast}">
                <Border Background="{TemplateBinding Background}"
                        CornerRadius="8"
                        Padding="{TemplateBinding Padding}"
                        Effect="{StaticResource DropShadowEffectLarge}">
                    <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
                        <ContentPresenter x:Name="LeadingIcon" Margin="0,0,8,0" Visibility="Collapsed"/>
                        <TextBlock Text="{TemplateBinding Message}" Foreground="#FFFFFF" VerticalAlignment="Center"/>
                    </StackPanel>
                </Border>
            </ControlTemplate>
        </Setter.Value>
    </Setter>
</Style>`
  },
  'intersection-overview-default': {
    name: '스마트 교차로 개요 (Smart Intersection Overview)',
    description: '교차로 내 차량, 보행자 등의 교통 객체를 실시간 감지/분석하여 최적의 신호 효율을 구축하기 위한 가이드라인입니다.',
    overview: '스마트 교차로 서비스는 교차로에 접근하는 방향별 교통량을 수집하고 대기행렬 길이를 산출하여 교통 신호 운영체계를 최적화하는 데 기여합니다. CCTV 영상 분석 엔진에서 검출한 교통 정보를 시각적으로 직관적으로 가시화하는 것이 중요합니다.',
    usage: '스마트 교차로 모듈의 전반적인 레이아웃 및 맵 매핑 기준에 적용합니다.'
  },
  'intersection-overlay-default': {
    name: 'CCTV 감지 영역 오버레이 (CCTV Detection Overlay)',
    description: '실시간 CCTV 영상 프레임 위에 딥러닝 감지 엔진이 찾아낸 차량, 보행자 등의 바운딩 박스를 중첩 표시하는 오버레이 컴포넌트입니다.',
    overview: 'CCTV 화면 내 교통 객체의 탐지 여부를 실시간으로 보여줍니다. 각 객체 유형에 따라 핀텔 고유의 상태 색상 및 테두리 두께 규격을 사용하여 가독성을 보장하고, 화면 전환이나 랙 발생 시에도 떨림 현상이 없도록 모션을 매끄럽게 처리합니다.',
    behavior: '사용자는 오버레이 스위치를 눌러 차량(Car), 버스(Bus), 보행자(Pedestrian) 등의 객체 타입별 바운딩 박스를 개별적으로 켜고 끌 수 있습니다.',
    usage: '실시간 영상 분석 페이지 및 스마트 모니터링 화면에서 CCTV 피드 제어에 사용됩니다.',
    webCode: `// React CCTV Detection Overlay Component Example\nimport React, { useState } from 'react';\n\nexport function CCTVOverlay({ streamUrl, showCar = true, showBus = true, showPed = true }) {\n  return (\n    <div className="cctv-overlay-container">\n      <video src={streamUrl} autoPlay loop muted />\n      <svg className="detection-boxes-layer">\n        {showCar && <rect x="50" y="80" width="120" height="80" className="box-car" />}\n        {showBus && <rect x="220" y="40" width="200" height="140" className="box-bus" />}\n        {showPed && <rect x="450" y="110" width="40" height="90" className="box-pedestrian" />}\n      </svg>\n    </div>\n  );\n}`
  },
  'signal-queue-default': {
    name: '신호 대기 행렬 인디케이터 (Signal Queue Indicator)',
    description: '교차로 차선별 신호등 상태와 대기 중인 차량의 대기행렬 길이를 실시간 수치 및 상태 게이지로 보여주는 UI입니다.',
    overview: '현재 신호 상태(적색/녹색)와 연동되어 차선별 대기 차량 수 및 대기 행렬 길이(미터 단위)를 실시간 업데이트하여 표현합니다. 위험 수준의 대기 행렬이 지속될 시에는 경고(Cautionary/Native) 상태 색상이 적용됩니다.',
    usage: '스마트 교차로 혼잡도 요약 패널 및 모니터링 대시보드 사이드바에 탑재됩니다.',
    webCode: `// React Signal Queue Indicator Component Example\nimport React from 'react';\n\nexport function SignalQueue({ laneName, signal = 'red', queueLengthMeters = 0, vehicleCount = 0 }) {\n  const isWarning = queueLengthMeters > 50;\n  return (\n    <div className="signal-queue-row">\n      <div className="lane-info">{laneName}</div>\n      <div className={\`signal-light \${signal}\`} />\n      <div className="queue-bar-container">\n        <div \n          className={\`queue-bar \${isWarning ? 'warning' : 'normal'}\`} \n          style={{ width: \`\${Math.min(100, queueLengthMeters)}%\` }} \n        />\n      </div>\n      <div className="queue-text">{queueLengthMeters}m ({vehicleCount}대)</div>\n    </div>\n  );\n}`
  },
  'traffic-flow-default': {
    name: '교통량 흐름 차트 (Traffic Flow Chart)',
    description: '시간대별 차량 교통량(직진, 좌회전, 우회전) 및 보행자 통행량을 혼합 막대/선 차트로 시각화하는 위젯입니다.',
    overview: '교차로 분석 데이터의 핵심인 시간별 교통 트렌드를 시각화합니다. 핀텔의 Primary Color를 메인으로 하고 보조 지표는 대비되는 뉴트럴 톤으로 배치하여 핵심 트렌드가 한눈에 파악되도록 정밀 조정합니다.',
    usage: '스마트 교차로 지점별 데이터 분석 및 리포트 화면에 고정식 위젯으로 활용됩니다.',
    webCode: `// React Traffic Flow Chart component mock\nimport React from 'react';\n\nexport function TrafficFlowChart({ data }) {\n  return (\n    <div className="traffic-chart-card">\n      <h3>시간별 통행량 트렌드</h3>\n      {/* SVG or Canvas render block */}\n    </div>\n  );\n}`
  },
  'selective-overview-default': {
    name: '선별관제 개요 (Selective Control Overview)',
    description: '수많은 관제 화면 중 위험 상황이나 특정 감지 규칙을 위반한 이벤트 화면만 자동 선별하여 관제 요원에게 노출하는 스마트 시스템 가이드입니다.',
    overview: '지능형 영상 분석 시스템을 활용하여 이상 행동(쓰러짐, 침입, 배회 등)이나 수색 대상 객체가 포착되었을 때 관제 요원이 가장 빠르게 대응할 수 있는 화면 배치를 구성하는 가이드라인을 제공합니다.',
    usage: '선별관제 서비스 화면 설계 및 이벤트 모니터링 센터 구축 기준이 됩니다.'
  },
  'detected-targets-default': {
    name: '관심 객체 감지 리스트 (Detected Target List)',
    description: '수색 조건(성별, 의상 색상, 가방 소지 여부 등)에 일치하는 대상이 감지되었을 때 해당 스냅샷과 시간 정보를 실시간 갱신하는 피드형 리스트입니다.',
    overview: '검출된 객체의 스냅샷 썸네일과 장비 ID, 감지 시각 정보를 피드 리스트 형태로 하향식 스크롤 갱신합니다. 스냅샷은 호버 시 줌 애니메이션 효과와 함께 확대 보기가 지원됩니다.',
    behavior: '실시간 피드가 추가될 때 리스트 상단에 슬라이드-인 애니메이션이 작동하며 관제 요원의 시선을 유도합니다.',
    usage: '미아/치매노인 수색, 용의 차량 실시간 관제 사이드 패널에 적용합니다.',
    webCode: `// React Detected Target List Component\nimport React from 'react';\n\nexport function DetectedTargetItem({ timestamp, cameraId, targetType, snapshotUrl }) {\n  return (\n    <div className="target-item-card fade-in">\n      <img src={snapshotUrl} alt="Target snapshot" className="target-thumb" />\n      <div className="target-info">\n        <div className="target-meta">{timestamp} | {cameraId}</div>\n        <div className="target-label">{targetType} 검출됨</div>\n      </div>\n    </div>\n  );\n}`
  },
  'camera-radius-default': {
    name: '카메라 반경 제어기 (Camera Range Controller)',
    description: 'GIS 지도 위에 마커로 표시된 CCTV 카메라의 탐지 및 분석 유효 반경(Radius)을 가변 제어하는 대화형 도구입니다.',
    overview: '지도 연동 시 카메라의 분석 경계를 시각적인 서클로 시각화하고, 슬라이더나 직접 핸들을 드래그하여 감지 거리를 미터(m) 단위로 조절할 수 있습니다. 범위 확장 시 지도의 고도 및 투영비에 맞추어 스케일이 정교하게 보간됩니다.',
    usage: '관제 구역 설정, GIS 지도기반 카메라 분석 조건 설정 툴에 내장됩니다.',
    webCode: `// React Camera Range Slider component\nimport React, { useState } from 'react';\n\nexport function CameraRangeController({ min = 10, max = 200, defaultValue = 50, onChange }) {\n  const [val, setVal] = useState(defaultValue);\n  return (\n    <div className="range-ctrl-widget">\n      <label>분석 유효 반경 설정: {val}m</label>\n      <input \n        type="range" \n        min={min} \n        max={max} \n        value={val} \n        onChange={(e) => {\n          const v = parseInt(e.target.value);\n          setVal(v);\n          if (onChange) onChange(v);\n        }}\n      />\n    </div>\n  );\n}`
  },
  'event-grid-default': {
    name: '이상행동 이벤트 그리드 (Event Grid)',
    description: '배회, 침입, 투척, 차량 단속 등 긴급 상황 이벤트를 목록화하고, 경보 상태 및 조치 결과를 모니터링하는 실시간 데이터 테이블입니다.',
    overview: '실시간으로 감지되는 보안 이상 이벤트들을 중요도(높음, 보통, 낮음)에 따라 그리드로 배열하고 경보음 및 깜박임 모션으로 긴급성을 환기합니다. 각 로우에는 조치 및 CCTV 영상 보기 퀵 액션이 제공됩니다.',
    usage: '통합관제실 실시간 상황 모니터링 및 이벤트 로그 조회 페이지의 중심을 구성합니다.',
    webCode: `// React Event Grid Table\nimport React from 'react';\n\nexport function EventGrid({ events, onAcknowledge }) {\n  return (\n    <table className="ds-event-table">\n      <thead>\n        <tr>\n          <th>시간</th>\n          <th>유형</th>\n          <th>카메라</th>\n          <th>상태</th>\n          <th>액션</th>\n        </tr>\n      </thead>\n      <tbody>\n        {events.map(ev => (\n          <tr key={ev.id} className={\`event-row \${ev.severity}\`}>\n            <td>{ev.time}</td>\n            <td>{ev.type}</td>\n            <td>{ev.location}</td>\n            <td>{ev.status}</td>\n            <td>\n              <button onClick={() => onAcknowledge(ev.id)}>확인</button>\n            </td>\n          </tr>\n        ))}\n      </tbody>\n    </table>\n  );\n}`
  },
  'pedestrian-overview-default': {
    name: '보행자 감응 개요 (Pedestrian Actuated Overview)',
    description: '보행자 통행량이 적은 횡단보도에서 대기 중인 보행자가 있을 때만 감지하여 횡단 신호를 활성화하는 보행자 중심 교통 제어 시스템 가이드입니다.',
    overview: '보행자 감응 시스템은 무분별한 차량 신호 정체를 막는 동시에 보행자 안전을 돕습니다. 보행 대기 구역 검지 상태를 모니터링 시스템에서 직관적으로 파악할 수 있도록 표준 색상 및 알림 상태를 규정합니다.',
    usage: '보행자 감응 횡단보도 모니터링 화면 및 신호 제어 인터페이스 설계에 사용됩니다.'
  },
  'pedestrian-sensor-default': {
    name: '보행 대기 구역 센서 상태 (Sensor Status)',
    description: '횡단보도 진입 전 대기 구역 내에 보행자의 진입 여부를 감지하는 가상 센서 존의 실시간 점유 상태를 시각화합니다.',
    overview: '보행자 대기 구역에 객체 진입 시 활성 상태로 표시되며, 감지 시간 누적 게이지 및 감지 구역(Zone A/B) 채우기 모션을 통해 센서 가동 현황을 나타냅니다.',
    usage: '보행자 감응 시스템 개별 지점 상세 모니터링 UI 및 센서 디버깅 패널에 사용됩니다.',
    webCode: `// React Pedestrian Sensor Zone Status\nimport React from 'react';\n\nexport function SensorZone({ isOccupied, zoneName = 'A' }) {\n  return (\n    <div className={\`sensor-zone-card \${isOccupied ? 'occupied' : 'empty'}\`}>\n      <h4>Zone {zoneName}</h4>\n      <span className="status-label">{isOccupied ? '감지됨 (Occupied)' : '대기 (Clear)'}</span>\n    </div>\n  );\n}`
  },
  'actuated-countdown-default': {
    name: '감응 신호 활성화 타이머 (Countdown Timer)',
    description: '보행자 감지 완료 후 횡단 보도 보행 신호등이 녹색으로 켜지기까지 남은 대기 시간 및 신호 유지 시간을 큰 디지털 카운트다운 타이머로 표현합니다.',
    overview: '감응 시스템이 보행자를 확인하고 신호 컨트롤러에 전달하는 과정을 "대기 중", "감지됨", "카운트다운 중" 상태로 명확히 분리하여 시각화합니다. 디지털 숫자는 글씨 크기와 높은 명도 대비를 주어 멀리서도 식별이 쉽도록 설계되었습니다.',
    usage: '현장 제어기 키오스크 화면 피드백 및 원격 관제 대시보드 상태 모니터링용 카드로 장착됩니다.',
    webCode: `// React Actuation Countdown Timer\nimport React, { useState, useEffect } from 'react';\n\nexport function CountdownTimer({ activeSeconds = 15, onFinished }) {\n  const [seconds, setSeconds] = useState(activeSeconds);\n  useEffect(() => {\n    if (seconds <= 0) {\n      if (onFinished) onFinished();\n      return;\n    }\n    const timer = setInterval(() => setSeconds(s => s - 1), 1000);\n    return () => clearInterval(timer);\n  }, [seconds]);\n\n  return (\n    <div className="countdown-box">\n      <div className="number">{seconds}</div>\n      <div className="unit">초 후 보행신호 전환</div>\n    </div>\n  );\n}`
  },
  'audio-control-default': {
    name: '음성 안내 제어 패널 (Audio Control Panel)',
    description: '무단횡단 방지 및 안전 보행 유도를 위해 현장 스피커에서 송출되는 안내 음성의 소스 선택, 볼륨 크기 조절, 실시간 수동 송출 기능이 결합된 제어 위젯입니다.',
    overview: '횡단보도 대기선 침범 시 자동 경고방송이 나가는 스피커를 제어합니다. 데시벨 수준을 시각 게이지로 제공하며, 경고 메시지 카테고리별로 원클릭 퀵 테스트 방송 전송 기능이 구현되어 있습니다.',
    usage: '교통 보행자 안전 관리용 현장 스피커 조절 화면에 삽입되어 가동을 돕습니다.',
    webCode: `// React Audio Volume and Trigger Panel\nimport React, { useState } from 'react';\n\nexport function AudioControlPanel({ deviceId }) {\n  const [volume, setVolume] = useState(70);\n  return (\n    <div className="audio-ctrl-card">\n      <h4>음성스피커 {deviceId}</h4>\n      <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(e.target.value)} />\n      <span>볼륨: {volume}%</span>\n    </div>\n  );\n}`
  },
  'schoolzone-overview-default': {
    name: '스마트 스쿨존 개요 (Smart School Zone Overview)',
    description: '어린이 보호구역 내 보행 안전을 확보하고 교통사고를 방지하기 위해 속도 감지, 불법주정차 단속, 횡단보도 위험 경보 등의 가이드를 정의합니다.',
    overview: '스마트 스쿨존 서비스는 어린이들이 안전하게 등하교할 수 있는 안심 보행환경 조성을 목적으로 합니다. 어린이 보호구역 내 차량 속도를 시각화하여 감속을 유도하고, 불법 주정차 차량을 즉시 검지하여 안전 사각지대를 해소하는 기능을 모니터링 시스템에서 직관적으로 나타냅니다.',
    usage: '스마트 스쿨존 모듈의 표준 레이아웃 가이드 및 속도/주차 단속 현황판 설계에 적용합니다.'
  },
  'speed-limit-default': {
    name: '제한속도 준수 모니터링 (Speed Limit Sign)',
    description: '스쿨존 진입 차량의 실시간 주행 속도를 탐지하여 LED 안내 전광판처럼 도로 위 차량 감속을 유도하는 디지털 신호 패널입니다.',
    overview: '어린이 보호구역 제한 속도 규격(30km/h)과 연동됩니다. 규정 속도 이하로 주행 시 녹색 안전 알림을, 30km/h 초과 과속 시 적색 경고 알림을 표시하여 운전자와 관제 요원에게 위험 상황을 실시간 환기합니다.',
    usage: '스쿨존 주요 진입로 모니터링 화면 및 차량 감속 피드백 대시보드 카드로 장착합니다.',
    webCode: `// React Speed Limit Indicator Mock\nimport React from 'react';\n\nexport function SpeedLimitSign({ currentSpeed, limit = 30 }) {\n  const isOver = currentSpeed > limit;\n  return (\n    <div className={\`speed-sign-card \${isOver ? 'danger' : 'normal'}\`}>\n      <div className="speed-limit-circle">{limit}</div>\n      <div className="speed-number">{currentSpeed} km/h</div>\n      <span className="alert-text">{isOver ? '과속 경고 (SLOW DOWN)' : '안전 운행 중'}</span>\n    </div>\n  );\n}`
  },
  'illegal-parking-default': {
    name: '불법주정차 단속 상태 (Illegal Parking Detection)',
    description: '스쿨존 내 주정차 금지 구역에 차량이 정차했을 때 시간을 누적 측정하고, 단속 경고 및 과태료 부과 대기 상태를 관리하는 알림 컴포넌트입니다.',
    overview: '주정차 금지 영역에 차량 진입 시 카메라 센서가 이를 즉시 감지하여 옐로우 경고 테두리를 표시하고, 단속 유예 시간(예: 5분) 타이머 카운트다운을 표시합니다. 유예 시간 초과 시 자동으로 단속 확정 상태로 전이됩니다.',
    usage: '스쿨존 불법주정차 실시간 단속 뷰 및 단속 차량 내역 데이터 그리드에 적용합니다.',
    webCode: `// React Illegal Parking Watcher\nimport React, { useState, useEffect } from 'react';\n\nexport function ParkingWatcher({ vehicleNo, parkingDurationSeconds, limitSeconds = 300 }) {\n  const remaining = Math.max(0, limitSeconds - parkingDurationSeconds);\n  return (\n    <div className="parking-alert-bar">\n      <div className="vehicle-num">{vehicleNo}</div>\n      <div className="timer">단속 대기: {remaining}초</div>\n      <span className="badge">경고방송 송출 중</span>\n    </div>\n  );\n}`
  },
  'crosswalk-warning-default': {
    name: '보행자 횡단 위험 경보 (Crosswalk Warning Sign)',
    description: '스쿨존 내 신호등이 없는 횡단보도나 맹점 구역에서 어린이가 도로변으로 다가올 때 활성화되는 위험 방지 알림 부재판입니다.',
    overview: '인도 측 어린이 감지 센서가 차량 접근 시점과 연동하여 운전자 전방 전광판에 "보행자 감지" 점멸 경보를 보냄과 동시에, 어린이에게는 "차량 접근 중" 음성 경보를 내보내는 횡단 안전 보조 시스템 상태를 시각화합니다.',
    usage: '스쿨존 교차로 안전 마커 연동 및 실시간 경보 로그 대시보드에 탑재됩니다.',
    webCode: `// React Crosswalk Collision Warning Sign\nimport React from 'react';\n\nexport function CrosswalkWarning({ childDetected = false, carApproaching = false }) {\n  const triggerAlert = childDetected && carApproaching;\n  return (\n    <div className={\`warning-sign \${triggerAlert ? 'active-pulse' : 'idle'}\`}>\n      <div className="icon">⚠️</div>\n      <h3>어린이 보행자 주의</h3>\n      {triggerAlert && <div className="blink-label">보행자 감지 / 차량 접근 위험!</div>}\n    </div>\n  );\n}`
  },
  'control-checkmark': {
    name: 'Control.Checkmark',
    description: 'Checkbox 하위에서 체크된 콘텐츠임을 나타내는 체크(✓) 표시 컴포넌트입니다. 사각형 박스 없이 체크마크만으로 "선택됨" 상태를 보여줍니다.',
    overview: '체크마크는 Checkbox 컨트롤의 선택(checked) 상태를 표현하는 표시 요소입니다. 박스 테두리를 두지 않고 체크마크의 유무만으로 해당 콘텐츠가 선택·완료되었음을 정돈된 비주얼로 전달합니다. 사용자가 직접 켜고 끄는 단독 토글 컨트롤이 아니라, Checkbox의 상태에 종속되어 "체크된 콘텐츠"를 라벨/항목과 함께 나타낼 때 사용합니다. 단독으로 켜고 끄는 입력이 필요하면 Checkbox를 사용하세요.',
    behavior: 'Checkbox의 checked 상태에 연동되어 표시/숨김됩니다. 체크된 콘텐츠에는 체크마크가 노출되고, 해제되면 숨겨지며 라벨 색상도 비활성 톤으로 반전됩니다. 비활성화(Disabled) 상태에서는 투명하게 흐려지고 상호작용이 차단됩니다.',
    usage: '체크박스로 선택된 리스트 항목·옵션·약관 동의 등 "체크된 콘텐츠"에 선택됨/완료 표시를 노출할 때 사용합니다. 켜고 끄는 입력 컨트롤 자체가 필요하면 Checkbox(control-checkbox)를 사용하세요.',
    properties: [
      {
        name: 'checked',
        title: '체크 상태 (Checkbox 연동)',
        type: 'boolean',
        conditions: [
          { condition: 'true (체크된 콘텐츠 - 시안 블루 혹은 화이트 체크마크 노출)' },
          { condition: 'false (미선택 - 체크마크 숨김 및 라벨 색상 비활성 반전)' }
        ]
      },
      {
        name: 'color',
        title: '체크마크 색상',
        type: 'Enum',
        conditions: [
          { condition: 'Accent (#00A9FF 계열 - 일반 선택 강조)' },
          { condition: 'Neutral (화이트/그레이 - 강조가 불필요한 맥락)' }
        ]
      },
      {
        name: 'size',
        title: '크기 분류',
        type: 'Enum',
        conditions: [
          { condition: 'Small (텍스트 13px, 체크마크 14px)' },
          { condition: 'Medium (텍스트 15px, 체크마크 18px)' },
          { condition: 'Large (텍스트 17px, 체크마크 22px)' }
        ]
      }
    ]
  },
  'present-menu': {
    name: 'Menu',
    description: '요소를 마우스 오른쪽 버튼으로 클릭했을 때 커서 위치에 뜨는 컨텍스트(우클릭) 메뉴입니다. 해당 대상에 실행 가능한 동작을 아이콘 + 라벨 목록으로 제공합니다.',
    overview: '컨텍스트 메뉴는 대상(영상 셀, 카메라 등)에 대한 동작을 커서 근처에 모아 보여주는 팝업 목록입니다. 각 항목은 의미가 맞는 Foundation 아이콘과 한국어 라벨로 구성되며, 성격이 다른 동작 그룹 사이에는 구분선을 두어 위계를 정리합니다. 상태를 토글하는 대표 동작(예: 고정)은 강조색으로 최상단에 배치합니다.',
    behavior: '대상 위에서 마우스 오른쪽 버튼을 누르면 커서 위치에 열리고, 컨테이너 경계를 벗어나지 않도록 위치가 보정됩니다. 항목을 선택하거나 바깥 영역을 클릭하면 닫힙니다. 상태 토글 항목(고정 ↔ 고정 해제)은 현재 상태에 따라 라벨이 바뀝니다.',
    usage: '실시간 영상 셀의 동작 메뉴(영상 분석 설정·재연결·웹 연결·점검모드 전환 등)처럼, 특정 대상에 종속된 동작을 커서 근처에서 빠르게 실행할 때 사용합니다. 화면 전역 동작이나 폼 제출용 버튼 묶음에는 사용하지 않습니다.',
    properties: [
      {
        name: 'anatomy',
        title: '구성 (Anatomy)',
        type: 'string',
        conditions: [
          { condition: '패널: 배경 #1E2229, 테두리 1px #2c3540, 모서리 8px, 그림자 0 18px 48px rgba(0,0,0,0.72), 폭 216px' },
          { condition: '항목: 좌측 14px 아이콘 + 라벨, 좌우 padding SP[12] · 상하 7px, 아이콘·라벨 간격 SP[8]' },
          { condition: '아이콘: Foundation 아이콘 세트(Icon), 뉴트럴 #8a8a92' },
          { condition: '구분선: 동작 그룹 사이 1px #2c3540' },
        ],
      },
      {
        name: 'emphasis',
        title: '강조 항목 (Emphasis)',
        type: 'string',
        conditions: [
          { condition: '대표 토글 동작은 최상단 배치 + 주의색(#ffd699 라벨, keep 아이콘 T.cautionary)' },
          { condition: '상태에 따라 라벨 전환: 고정 ↔ 고정 해제' },
        ],
      },
      {
        name: 'items',
        title: '항목 구성 (Items)',
        type: 'Array',
        conditions: [
          { condition: '{ label, icon, sepBefore?, sepAfter? } 형태의 항목 배열' },
          { condition: '아이콘·순서는 Figma "Component 24"(783:1750) videoContext 세트를 따름' },
        ],
      },
    ],
  }
};

// 정본 컴포넌트(src/ds/*.jsx) → code·importPath 병합(단일 출처).
//  src/ds 모듈이 원본이며, gen-component-code.mjs 가 생성한 COMPONENT_CODE 로
//  문서 사이트·MCP가 동일한 정본 코드를 공유합니다. (아래 병합이 인라인 값보다 우선)
for (const [id, c] of Object.entries(COMPONENT_CODE)) {
  if (COMPONENT_DOCS[id]) {
    COMPONENT_DOCS[id].code = c.code;
    COMPONENT_DOCS[id].importPath = c.file;
  }
}

