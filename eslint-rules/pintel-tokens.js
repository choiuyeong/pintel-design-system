/**
 * Pintel Design System — 커스텀 ESLint 규칙 (토큰 강제)
 * ─────────────────────────────────────────────────────────────
 * 프롬프트 hook의 "지향"을 lint의 "강제"로 승격합니다(사람·AI 공통).
 * 이 코드베이스는 Neutral 계열을 의도적으로 raw hex로 쓰므로,
 * 전체 hex 금지가 아니라 아래 두 가지 고신호 케이스만 대상으로 합니다.
 *
 *  1) no-deprecated-primary : 폐기된 Primary 값(#1751D9·#3471FF·#004DFF) → 에러
 *  2) prefer-color-token    : T 토큰이 존재하는 시맨틱 색을 raw hex로 쓴 경우 → 경고
 *
 * tokens.js(팔레트 정의처)는 flat config에서 제외합니다.
 */

// 폐기값 — 어디서도 쓰면 안 됨(오너 확정: Primary는 #0066FF 계열로 통일)
const DEPRECATED = {
  '#1751D9': 'T.primary(#0066FF)',
  '#3471FF': 'T.primaryStrong(#3385FF)',
  '#004DFF': 'T.primaryHeavy(#0052CC)',
};

// T 토큰이 존재하는 시맨틱 색 — raw hex 대신 토큰 사용 유도
const TOKEN_MAP = {
  '#0066FF': 'T.primary',
  '#3385FF': 'T.primaryStrong',
  '#0052CC': 'T.primaryHeavy',
  '#1ED45A': 'T.positive',
  '#FFA938': 'T.cautionary',
  '#FF6363': 'T.error',
};

// 문자열에서 6자리 hex를 모두 뽑아 대문자로 정규화
function hexesIn(str) {
  const out = [];
  const re = /#[0-9a-fA-F]{6}\b/g;
  let m;
  while ((m = re.exec(str)) !== null) out.push(m[0].toUpperCase());
  return out;
}

function makeRule({ table, severityMsg }) {
  return {
    meta: { type: 'problem', schema: [], docs: { description: severityMsg } },
    create(context) {
      const check = (node, raw) => {
        for (const hex of hexesIn(raw)) {
          if (table[hex]) {
            context.report({ node, message: `${severityMsg}: '${hex}' → ${table[hex]}` });
          }
        }
      };
      return {
        Literal(node) {
          if (typeof node.value === 'string') check(node, node.value);
        },
        TemplateElement(node) {
          if (node.value && node.value.raw) check(node, node.value.raw);
        },
      };
    },
  };
}

export default {
  rules: {
    'no-deprecated-primary': makeRule({
      table: DEPRECATED,
      severityMsg: '폐기된 Primary 색상입니다. 토큰을 사용하세요',
    }),
    'prefer-color-token': makeRule({
      table: TOKEN_MAP,
      severityMsg: '색상 하드코딩 대신 토큰을 사용하세요',
    }),
  },
};
