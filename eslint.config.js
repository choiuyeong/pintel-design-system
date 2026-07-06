import js from '@eslint/js';
import pintelTokens from './eslint-rules/pintel-tokens.js';

const LANG = {
  ecmaVersion: 'latest',
  sourceType: 'module',
  parserOptions: { ecmaFeatures: { jsx: true } },
};

// 팔레트를 "설명·표시"하는 문서 표면 — hex 리터럴이 정당하므로 prefer-color-token 제외.
//  (tokens.js가 팔레트 "정의처"라 제외되는 것과 같은 원리)
const DOC_SURFACES = [
  'src/data/tokens.js',
  'src/data/templates-code.js', // 자동 생성물(원본 Library.jsx가 이미 린트됨)
  'src/data/components.js',      // 컴포넌트 문서 데이터(색 설명 산문)
  'src/data/templates.js',      // 화면 문서 데이터(설명 산문)
  'src/components/ComponentDoc.jsx', // 문서 렌더러(색상 견본·토큰 표 표시)
];

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'wpf/**', 'hermes-agent/**', 'functions/**'],
  },
  {
    // 폐기 Primary 값은 문서·프로덕션 어디서도 금지(팔레트 정의처만 제외)
    files: ['src/**/*.{js,jsx}'],
    ignores: ['src/data/tokens.js'],
    languageOptions: LANG,
    plugins: { pintel: pintelTokens },
    rules: { 'pintel/no-deprecated-primary': 'error' },
  },
  {
    // 시맨틱 색 토큰 유도는 실제 스타일 코드에만 적용(문서 표면 제외)
    files: ['src/**/*.{js,jsx}'],
    ignores: DOC_SURFACES,
    languageOptions: LANG,
    plugins: { pintel: pintelTokens },
    rules: { 'pintel/prefer-color-token': 'warn' },
  },
];
