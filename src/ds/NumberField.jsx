/**
 * Pintel DS 정본 컴포넌트 — NumberField (id: field-number)
 * 이 파일이 단일 출처입니다. 화면에서 import 해 재사용하세요(재작성 금지).
 * 문서/ MCP code 는 gen-component-code.mjs 가 이 파일에서 생성합니다.
 */
import { useState } from 'react';
import { SP } from '../data/tokens';

// 스텝 셰브런 — 정본 스텝 글리프(가벼운 stroke, 채운 삼각형 금지). up=위/아래.
function StepChevron({ up }) {
  return (
    <svg width="9" height="6" viewBox="0 0 9 6" fill="none" stroke="#8a8a92" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      {up ? <path d="M1.5 4.5 L4.5 1.5 L7.5 4.5" /> : <path d="M1.5 1.5 L4.5 4.5 L7.5 1.5" />}
    </svg>
  );
}

/**
 * 숫자 입력 + 증감(스텝) 필드.
 *  - 값 영역: 가운데 정렬 tabular-nums / 우측 스텝 컬럼(▲▼ = 가벼운 셰브런, height 절반 분할)
 *  - min/max 클램프, step 증감, 단위(unit) 슬롯, 보조 hint 슬롯
 *  - 컨트롤 상수: height 32 · borderRadius 7 · 스텝 컬럼 22 (간격은 SP 토큰)
 * value 미지정 시 내부 상태로 동작(uncontrolled).
 */
export function NumberField({
  label, value, defaultValue, onChange, min = 0, max = Infinity, step = 1,
  unit, hint, width = 96, disabled = false,
}) {
  const [inner, setInner] = useState(
    typeof value === 'number' ? value
      : typeof defaultValue === 'number' ? defaultValue
      : (min || 0),
  );
  const val = value == null ? inner : value;
  const clamp = (n) => Math.min(max, Math.max(min, n));
  const set = (n) => { const c = clamp(n); (onChange || setInner)(c); };
  const stepBtn = (up) => ({
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: disabled ? 'default' : 'pointer', ...(up ? { borderBottom: '1px solid #2e2e35' } : {}),
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP[8] }}>
      {label && <span style={{ fontSize: 12, color: '#9a9aa2' }}>{label}</span>}
      <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', width, height: 32,
          background: '#141417', border: '1px solid #2e2e35', borderRadius: 7,
          overflow: 'hidden', boxSizing: 'border-box', opacity: disabled ? 0.5 : 1,
        }}>
          <input
            type="text" inputMode="numeric" value={val} disabled={disabled}
            onChange={(e) => {
              const raw = String(e.target.value).replace(/[^0-9]/g, '');
              set(raw === '' ? min : parseInt(raw, 10));
            }}
            style={{
              flex: 1, minWidth: 0, height: '100%', textAlign: 'center',
              background: 'transparent', border: 'none', outline: 'none',
              color: '#fff', fontSize: 14, fontWeight: 700,
              fontVariantNumeric: 'tabular-nums', fontFamily: 'inherit',
            }}
          />
          <span style={{ display: 'flex', flexDirection: 'column', width: 22, height: '100%', borderLeft: '1px solid #2e2e35', flexShrink: 0 }}>
            <span role="button" aria-label="증가" onClick={() => !disabled && set(val + step)} style={stepBtn(true)}><StepChevron up /></span>
            <span role="button" aria-label="감소" onClick={() => !disabled && set(val - step)} style={stepBtn(false)}><StepChevron /></span>
          </span>
        </div>
        {unit && <span style={{ fontSize: 13, color: '#d4d4d8' }}>{unit}</span>}
        {hint && <span style={{ fontSize: 11, color: '#6f6f77' }}>{hint}</span>}
      </div>
    </div>
  );
}
