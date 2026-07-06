/**
 * Pintel DS 정본 컴포넌트 — Loading (id: loading-default)
 * 이 파일이 단일 출처입니다. 화면에서 import 해 재사용하세요(재작성 금지).
 * 문서/ MCP code 는 gen-component-code.mjs 가 이 파일에서 생성합니다.
 */
import { T, TYPE, SP } from '../data/tokens';
// 전역 keyframes 필요(index.css): pds-spin, pds-bar

const ARC  = { default: T.primaryStrong, cautionary: T.cautionary, negative: T.error, positive: T.positive };
const FILL = { default: T.primary,       cautionary: T.cautionary, negative: T.error, positive: T.positive };

// 원형 스피너 — 트랙 #2e2e2e + 활성 호(status 색)
export function Spinner({ size = 40, status = 'default', thickness = 4 }) {
  return (
    <div role='status' aria-label='로딩 중' style={{
      width: size, height: size, borderRadius: '50%', boxSizing: 'border-box',
      border: `${thickness}px solid #2e2e2e`, borderTopColor: ARC[status],
      animation: 'pds-spin 0.8s linear infinite',
    }} />
  );
}

// 선형 바 — indeterminate(value 생략) / determinate(value 0~100)
export function LinearLoading({ value, status = 'default' }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: 4, borderRadius: 8, background: '#1e1e1e', overflow: 'hidden' }}>
      {value == null
        ? <div style={{ position: 'absolute', top: 0, bottom: 0, borderRadius: 8, background: FILL[status], animation: 'pds-bar 1.2s ease-in-out infinite' }} />
        : <div style={{ height: '100%', width: `${value}%`, borderRadius: 8, background: FILL[status], transition: 'width 0.2s' }} />}
    </div>
  );
}

// 영역(region) 로딩 예시
function CctvPanel({ isLoading, children }) {
  if (!isLoading) return children;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP[16], padding: SP[24] }}>
      <Spinner size={40} />
      <span style={{ ...TYPE.body2, color: '#888' }}>영상 분석 중…</span>
    </div>
  );
}

// 인라인(버튼) — 중복 클릭 방지
<button disabled={pending} style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8] }}>
  {pending && <Spinner size={16} thickness={2} />} 검지 데이터 조회
</button>
