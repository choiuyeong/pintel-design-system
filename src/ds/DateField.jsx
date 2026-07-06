/**
 * Pintel DS 정본 컴포넌트 — DateField (id: control-datepicker)
 * 이 파일이 단일 출처입니다. 화면에서 import 해 재사용하세요(재작성 금지).
 * 문서/ MCP code 는 gen-component-code.mjs 가 이 파일에서 생성합니다.
 */
import { SP } from '../data/tokens';

// 날짜/일시 트리거 필드 — 라벨 + 값(YYYY.MM.DD HH:mm) + 달력 아이콘
// 클릭 시 달력 + 시간(24시간제 HH:mm) 팝오버를 연다.
// 간격 토큰: 라벨-필드 gap=SP[8], 필드 좌우 padding=SP[12]. (width 260·height 42·borderRadius 8 = 컨트롤 상수)
export function DateField({ label, value, placeholder = 'YYYY.MM.DD', onClick }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP[8] }}>
      {label && <span style={{ fontSize: 12, color: '#9a9aa2' }}>{label}</span>}
      <div onClick={onClick} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: 260, height: 42, padding: '0 ' + SP[12], boxSizing: 'border-box',
        background: '#141417', border: '1px solid #2e2e35', borderRadius: 8, cursor: 'pointer',
      }}>
        <span style={{ fontSize: 15, color: value ? '#e8e8ec' : '#6f6f77', fontVariantNumeric: 'tabular-nums' }}>
          {value || placeholder}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8a92" strokeWidth="1.8">
          <rect x="3" y="4.5" width="18" height="16" rx="2" /><line x1="3" y1="9" x2="21" y2="9" />
          <line x1="8" y1="2.5" x2="8" y2="6" /><line x1="16" y1="2.5" x2="16" y2="6" />
        </svg>
      </div>
    </div>
  );
}
