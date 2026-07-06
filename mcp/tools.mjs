/**
 * Pintel Design System — MCP 공유 로직 (transport 비의존)
 *
 * 데이터(components.js)에서 컴포넌트/토큰을 읽어 MCP 도구로 노출하는 순수 로직.
 * stdio 서버(server.mjs)와 HTTP 함수(netlify/functions/mcp.mjs)가 함께 사용합니다.
 */
import { TIERS, COMPONENT_DOCS } from '../src/data/components.js';
import { LIBRARY_TEMPLATES } from '../src/data/templates.js';
import { TEMPLATE_CODE } from '../src/data/templates-code.js';
import {
  COLORS, TYPOGRAPHY, WEIGHTS, SPACING, SPACING_NOTE, SPACING_MAP, FONT_FAMILY, ICONS, SEMANTIC,
} from '../src/data/tokens.js';
import { contrastRatio, wcagLevel } from '../src/data/contrast.js';

// 컴포넌트 문서 + Library 화면 예시(Templates) 통합 문서 맵.
// Library 페이지는 화면 예시이므로 kind='template' 로 구분, 실제 JSX 소스(code)도 포함합니다.
const DOCS = { ...COMPONENT_DOCS };
for (const [id, meta] of Object.entries(LIBRARY_TEMPLATES)) {
  const src = TEMPLATE_CODE[id];
  DOCS[id] = {
    name: meta.title,
    kind: 'template',
    description: meta.description,
    uses: meta.uses,
    ...(src ? { sourceFile: src.file, code: src.code } : {}),
  };
}

export const SERVER_INFO = { name: 'pintel-design-system', version: '1.0.0' };
export const DEFAULT_PROTOCOL = '2025-06-18';

// ───────────────────────── 데이터 헬퍼 ─────────────────────────
export function allComponentEntries() {
  const out = [];
  for (const [tierId, tier] of Object.entries(TIERS)) {
    const groups = tier.groups
      || (tier.categories ? [{ id: tierId, label: tier.label || tierId, categories: tier.categories }] : []);
    for (const g of groups) {
      for (const cat of (g.categories || [])) {
        for (const child of (cat.children || [])) {
          out.push({
            id: child.id,
            name: child.name,
            category: cat.name,
            group: g.label || g.id,
            tier: tier.label || tierId,
            kind: (DOCS[child.id] && DOCS[child.id].kind) || 'component',
            documented: Boolean(DOCS[child.id]),
          });
        }
      }
    }
  }
  return out;
}

export function findComponent({ id, name } = {}) {
  if (id && DOCS[id]) return { id, doc: DOCS[id] };
  const entries = allComponentEntries();
  if (id) {
    const e = entries.find((x) => x.id === id);
    if (e && DOCS[e.id]) return { id: e.id, doc: DOCS[e.id] };
  }
  if (name) {
    const lc = String(name).toLowerCase();
    const e = entries.find((x) => x.name.toLowerCase() === lc)
      || entries.find((x) => x.name.toLowerCase().includes(lc));
    if (e && DOCS[e.id]) return { id: e.id, doc: DOCS[e.id] };
    for (const [k, d] of Object.entries(DOCS)) {
      if (d.name && d.name.toLowerCase() === lc) return { id: k, doc: d };
    }
    // 별칭(aliases) 매칭 — 자연어 표현("다중 선택","삭제 버튼" 등)으로도 정본에 도달.
    //  과매칭 방지를 위해 "정확히 같음" 또는 "별칭이 질의를 포함"만 허용(띄어쓰기 무시).
    //  (질의가 별칭을 포함하는 방향은 제외 → 짧은 별칭 "버튼"이 "삭제 버튼"을 삼키지 않음)
    const norm = (x) => x.toLowerCase().replace(/\s+/g, '');
    const lcn = norm(lc);
    const aliasHit = Object.entries(DOCS).find(([, d]) =>
      Array.isArray(d.aliases) && d.aliases.some((a) => {
        const al = norm(String(a));
        return al === lcn || al.includes(lcn);
      }));
    if (aliasHit) return { id: aliasHit[0], doc: aliasHit[1] };
  }
  return null;
}

export function designTokens() {
  // 단일 출처(src/data/tokens.js)에서 토큰을 노출합니다.
  // 각 토큰은 값(value)뿐 아니라 코드 키(key)·xamlKey·role(의미)을 함께 반환합니다.
  return {
    // 색상: 의미별 그룹(Primary·Status·Accent·Neutral). 각 항목 {key, value, xamlKey, variable, role}
    colors: {
      primary: COLORS.primary,
      status: COLORS.status,
      accent: COLORS.accent,
      neutral: COLORS.neutral,
    },
    fontFamily: FONT_FAMILY,
    // 글자 굵기 위계: {key, value, xamlKey, role}
    weights: WEIGHTS,
    // 타이포그래피(핵심 기반): Typography.Style 19종 {key, name, fontSize, lineHeight, letterSpacing, xamlSizeKey, xamlLineKey, role}
    typography: TYPOGRAPHY,
    spacing: {
      // 핵심 기반: 4/8pt 스케일 {key, px, rem, xamlKey, usage}
      foundation: SPACING,
      note: SPACING_NOTE,
      // 컴포넌트 prop 입력용(WPF Thickness) — token→px 매핑. px=null은 미확정(추정 금지).
      spacingMap: SPACING_MAP,
    },
    // 아이콘 세트(Foundation > Icon) — 렌더 가능한 아이콘 {name, label, usage}. <Icon name=.../>로 사용.
    icons: ICONS,
    // 시맨틱 토큰 계층(Wanted 구조 채택, PREVAX 다크값 기본). 슬롯별 그룹.
    //  각 색상 항목 {key, value(다크 기본), xamlKey, role, semanticLight(라이트 참고값)}.
    //  shadow는 value가 CSS box-shadow 문자열(semanticLight 없음).
    //  Primary는 Pintel 오너 확정값(#0066FF/#3385FF/#0052CC) 사용.
    semantic: {
      label: SEMANTIC.label,
      primary: SEMANTIC.primary,
      status: SEMANTIC.status,
      background: SEMANTIC.background,
      line: SEMANTIC.line,
      fill: SEMANTIC.fill,
      interaction: SEMANTIC.interaction,
      inverse: SEMANTIC.inverse,
      static: SEMANTIC.static,
      material: SEMANTIC.material,
      shadow: SEMANTIC.shadow,
    },
  };
}

// 화면 설계 플랜 — 의도(intent)에 맞는 화면/컴포넌트 "포인터"만 최소로 반환(온디맨드 로딩).
//  전체 문서·토큰을 미리 붓지 않고, 관련 id + 다음 단계만 돌려줘 토큰 소비를 줄인다.
export function planScreen({ intent = '', limit = 8 } = {}) {
  const q = String(intent).toLowerCase();
  const kws = Array.from(new Set(q.split(/[^a-z0-9가-힣]+/i).filter((w) => w && w.length >= 2)));
  const score = (text) => {
    if (!text) return 0;
    const t = String(text).toLowerCase();
    let s = 0;
    for (const k of kws) if (t.includes(k)) s += 1;
    return s;
  };

  // 1) 관련 화면(Templates) — 출발점으로 삼을 정본 화면
  const templates = Object.entries(LIBRARY_TEMPLATES)
    .map(([id, m]) => ({ id, title: m.title, uses: m.uses || [], _s: score([m.title, m.description, ...(m.uses || [])].join(' ')) + score(m.title) }))
    .filter((t) => t._s > 0)
    .sort((a, b) => b._s - a._s)
    .slice(0, 3);

  // 화면 구성에 쓰인 컴포넌트 이름 → 가중치 부여용
  const usesNames = new Set();
  templates.forEach((t) => (t.uses || []).forEach((u) => usesNames.add(String(u).toLowerCase())));

  // 2) 관련 컴포넌트 — id + 정본 코드 유무 플래그만
  const components = allComponentEntries()
    .filter((e) => e.kind === 'component')
    .map((e) => {
      const d = DOCS[e.id] || {};
      const hay = [e.name, e.category, e.group, d.description, d.overview, d.usage, ...(d.aliases || [])].join(' ');
      let s = score(hay);
      if (usesNames.has(String(e.name).toLowerCase())) s += 3;
      return { id: e.id, name: e.name, category: e.category, hasCanonicalCode: Boolean(d.code), importPath: d.importPath || null, documented: Boolean(DOCS[e.id]), _s: s };
    })
    .filter((c) => c._s > 0)
    .sort((a, b) => b._s - a._s)
    .slice(0, Math.max(1, limit));

  return {
    intent,
    foundation: {
      priority: 'Spacing(SP)·Typography(TYPE)가 최우선 기반입니다. 색은 T, 굵기는 W 토큰을 사용하고 하드코딩하지 마세요.',
      tokens: '전체 토큰은 필요할 때 get_design_tokens 로 로드하세요(전량 미리 로드 금지).',
    },
    startFrom: templates.map((t) => ({ id: t.id, title: t.title, note: 'get_component(id)로 이 화면의 정본 JSX 소스를 받아 출발점으로 삼으세요.' })),
    recommendedComponents: components.map(({ _s, ...c }) => c),
    nextSteps: [
      'importPath 가 있는 항목은 그 경로에서 import 해 그대로 사용하세요(예: import { FilterButton } from "../ds"). 재작성 금지.',
      'importPath 가 없고 hasCanonicalCode=true 면 get_component(id)의 정본 코드를 붙여넣어 일관성을 유지하세요.',
      '색 조합은 check_contrast 로 WCAG AA를 확인하고, 기존 Library 화면들과 시각적 일관성을 유지하세요.',
    ],
  };
}

// ───────────────────────── 도구 정의 ─────────────────────────
export const TOOLS = [
  {
    name: 'list_components',
    description: '핀텔 디자인 시스템의 모든 항목 목록을 반환합니다. 각 항목은 kind 로 구분됩니다 — "component"(UI 컴포넌트) 또는 "template"(Library 화면 예시 페이지). 그룹/카테고리/문서화 여부 포함.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'list_templates',
    description: 'Library 화면 예시(Templates) 페이지 목록을 반환합니다. 각 페이지의 제목·설명·구성 컴포넌트(uses)를 포함합니다. (예: Login, Dashboard(CS), Event Search(CS), History(CS), Settings(권한 설정) 등)',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_component',
    description: '특정 컴포넌트 또는 Library 화면 예시(template) 문서를 반환합니다. 컴포넌트는 name/description/overview/properties/behavior/usage/code에 더해, 일부 컴포넌트는 정본 일관성 필드 — tokensUsed(쓰는 토큰 목록)·aliases(자연어 별칭)·antiPatterns(하지 말 것)·examples(올바른 사용 스니펫) — 를 함께 반환합니다. 템플릿(kind:template)은 title/description/uses + 실제 화면 JSX 소스(code, sourceFile)를 반환합니다. name 인자는 컴포넌트 이름뿐 아니라 aliases(예: "다중 선택","삭제 버튼")로도 매칭됩니다. id 또는 name 중 하나를 지정하세요.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: '컴포넌트 id (예: button-primary, control-checkbox)' },
        name: { type: 'string', description: '컴포넌트 이름 (예: Button, Checkbox, Tooltip)' },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'search_components',
    description: '이름/설명/Overview에서 키워드로 컴포넌트를 검색합니다.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string', description: '검색어' } },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'plan_screen',
    description: '화면/기능을 만들 때 필요한 것만 최소로 안내하는 설계 플랜 도구입니다. 자연어 의도(intent, 예: "로그인 화면", "관제 대시보드", "카메라 우클릭 메뉴")를 받아 ① 출발점으로 삼을 관련 Library 화면(startFrom, id) ② 필요한 컴포넌트 목록(recommendedComponents — id/name/category/hasCanonicalCode/documented) ③ Foundation 우선순위·다음 단계만 반환합니다. 전체 문서/토큰을 미리 붓지 않으므로, 반환된 id를 get_component(id)·get_design_tokens 로 필요할 때 로드하세요(온디맨드, 토큰 절약). 새 화면·컴포넌트 작업 전에 먼저 호출하는 것을 권장합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        intent: { type: 'string', description: '만들려는 화면/기능의 자연어 설명 (예: "로그인 화면", "카메라 우클릭 메뉴")' },
        limit: { type: 'number', description: '추천 컴포넌트 최대 개수 (기본 8)' },
      },
      required: ['intent'],
      additionalProperties: false,
    },
  },
  {
    name: 'check_contrast',
    description: '두 색의 WCAG 대비비(contrast ratio)를 계산하고 접근성 등급을 판정합니다. 텍스트 색(foreground)과 배경 색(background)을 hex(#RRGGBB 또는 #RGB)로 받아 ratio(1~21)와 AA/AAA 통과 여부를 반환합니다. large=true 는 큰 텍스트(굵은 14pt/일반 18pt↑) 기준(AA 3.0). 색 조합을 고르거나 텍스트 색을 정할 때 호출하세요. 다크 표면 위 텍스트는 일반적으로 neutral70 이상을 권장합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        foreground: { type: 'string', description: '텍스트/전경 색 hex (예: #CCCCCC)' },
        background: { type: 'string', description: '배경 색 hex (예: #1A1A1A)' },
        large: { type: 'boolean', description: '큰 텍스트 기준 여부(기본 false)' },
      },
      required: ['foreground', 'background'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_design_tokens',
    description: '디자인 토큰을 단일 출처(src/data/tokens.js)에서 반환합니다. 모든 토큰은 코드 키(key)·xamlKey·role(의미)을 함께 가집니다. colors는 의미별 그룹 객체 { primary(3) · status(3) · accent(11) · neutral(14) } (각 항목 key/value/xamlKey/variable/role, Primary는 #0066FF). weights(굵기 6종 key/value/xamlKey/role), typography(핵심 기반 Typography.Style 19종 — key/fontSize/lineHeight/letterSpacing/xamlSizeKey/xamlLineKey/role), spacing.foundation(핵심 기반 4/8pt 스케일 — key/px/rem/xamlKey/usage) + spacing.spacingMap(컴포넌트 prop용 token→px 매핑, px=null은 미확정). icons(Foundation 아이콘 세트 27종 — name/label/usage, 코드에서 <Icon name=.../>로 사용). semantic(시맨틱 토큰 계층 — Wanted 구조 채택, PREVAX 다크값 기본: label(6)·primary(3, Pintel #0066FF 계열)·status(3)·background(4)·line(7)·fill(3)·interaction(2)·inverse(3)·static(2)·material(1)·shadow(4). 각 색상 항목 key/value(다크)/xamlKey/role/semanticLight(라이트 참고값), shadow는 CSS box-shadow 문자열). 더 자세한 표·설명은 get_component(color-primary|color-status|color-accent|color-neutral|typo-style|spacing-style|icon-symbol).',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
];

export function textResult(obj) {
  const text = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
  return { content: [{ type: 'text', text }] };
}

export function callTool(name, args = {}) {
  switch (name) {
    case 'list_components': {
      const components = allComponentEntries();
      return textResult({ count: components.length, components });
    }
    case 'get_component': {
      const found = findComponent(args);
      if (!found) return { ...textResult(`컴포넌트를 찾을 수 없습니다: ${JSON.stringify(args)}`), isError: true };
      return textResult({ id: found.id, ...found.doc });
    }
    case 'search_components': {
      const q = String(args.query || '').toLowerCase();
      const qn = q.replace(/\s+/g, '');
      const matches = allComponentEntries().filter((e) => {
        const d = DOCS[e.id] || {};
        const hay = [e.name, d.description, d.overview, d.usage, ...(d.aliases || [])]
          .filter(Boolean).join(' \n ').toLowerCase();
        // 원문 + 공백 제거본 둘 다로 대조(띄어쓰기 차이 흡수)
        return hay.includes(q) || hay.replace(/\s+/g, '').includes(qn);
      }).map((e) => ({ id: e.id, name: e.name, group: e.group, kind: e.kind, description: (DOCS[e.id] || {}).description, aliases: (DOCS[e.id] || {}).aliases }));
      return textResult({ query: args.query, count: matches.length, matches });
    }
    case 'list_templates': {
      const templates = Object.entries(LIBRARY_TEMPLATES).map(([id, m]) => ({ id, title: m.title, description: m.description, uses: m.uses }));
      return textResult({ count: templates.length, templates });
    }
    case 'plan_screen':
      return textResult(planScreen(args));
    case 'check_contrast': {
      const { foreground, background, large = false } = args || {};
      const ratio = contrastRatio(foreground, background);
      if (ratio == null) {
        return { ...textResult(`색상 hex를 해석할 수 없습니다: foreground=${foreground}, background=${background}`), isError: true };
      }
      const lvl = wcagLevel(ratio, { large });
      return textResult({
        foreground, background, large,
        ratio: lvl.ratio,
        passes: { AA: lvl.aa, AAA: lvl.aaa, AA_large: lvl.aaLarge },
        recommendation: lvl.aa
          ? 'AA 통과'
          : (lvl.aaLarge ? 'AA 미달 — 큰 텍스트에만 사용 가능. 일반 텍스트면 전경색을 밝게 조정하세요.' : 'AA 미달 — 대비가 낮습니다. 전경색을 밝게 하거나 배경을 어둡게 조정하세요.'),
      });
    }
    case 'get_design_tokens':
      return textResult(designTokens());
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ───────────────────────── JSON-RPC 핸들러 (transport 공통) ─────────────────────────
// 단일 메시지를 받아 응답 객체(또는 null=알림이라 응답 없음)를 반환합니다.
export function handleRpc(msg) {
  const { id, method, params } = msg || {};
  const ok = (result) => ({ jsonrpc: '2.0', id, result });
  const err = (code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });

  switch (method) {
    case 'initialize':
      return ok({
        protocolVersion: (params && params.protocolVersion) || DEFAULT_PROTOCOL,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });
    case 'ping':
      return ok({});
    case 'tools/list':
      return ok({ tools: TOOLS });
    case 'tools/call':
      try {
        return ok(callTool(params && params.name, (params && params.arguments) || {}));
      } catch (e) {
        return ok({ content: [{ type: 'text', text: 'Error: ' + e.message }], isError: true });
      }
    default:
      if (method && method.startsWith('notifications/')) return null; // 알림은 응답 없음
      if (id !== undefined) return err(-32601, `Method not found: ${method}`);
      return null;
  }
}
