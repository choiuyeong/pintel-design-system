/**
 * Pintel DS 정본 컴포넌트 — Checkbox (id: control-checkbox)
 * 이 파일이 단일 출처입니다. 화면에서 import 해 재사용하세요(재작성 금지).
 * 문서/ MCP code 는 gen-component-code.mjs 가 이 파일에서 생성합니다.
 */
import { Icon } from '../components/icons';
import { SP } from '../data/tokens';

// 표준 체크박스 — Foundation Icon(check_on/check_off, 18px) + 라벨
// 간격: 아이콘-라벨 gap = SP[8]. 색 토큰: 체크 #e8e8ec · 해제 #9a9aa2. (18px=아이콘 기하상수)
export function Checkbox({ checked = false, disabled = false, onChange, children }) {
  return (
    <span
      onClick={disabled ? undefined : () => onChange && onChange(!checked)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: SP[8],
        cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none',
        opacity: disabled ? 0.4 : 1, fontSize: 14,
        color: checked ? '#e8e8ec' : '#9a9aa2',
      }}
    >
      <Icon name={checked ? 'check_on' : 'check_off'} size={18} />
      {children}
    </span>
  );
}
