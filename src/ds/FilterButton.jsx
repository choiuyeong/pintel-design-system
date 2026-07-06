/**
 * Pintel DS 정본 컴포넌트 — FilterButton (id: filter-button-default)
 * 이 파일이 단일 출처입니다. 화면에서 import 해 재사용하세요(재작성 금지).
 * 문서/ MCP code 는 gen-component-code.mjs 가 이 파일에서 생성합니다.
 */
import { useState } from 'react';
import { SP, T } from '../data/tokens';

// 필터 버튼 — 트리거(Default/Active + 카운트 배지) + 팝오버
// children 자리에 칩(다중 선택) 또는 라디오(단일 선택) 목록 + 초기화·보기 푸터를 넣는다.
// 간격 토큰: 요소 gap=SP[8], 좌우 padding=SP[12], 배지 padding=SP[4], 팝오버 offset=SP[8].
// (height 34·badge 16·borderRadius 8·12·width 300 = 컨트롤/기하 상수 → raw 유지)
const PRIMARY = T.primary;
export function FilterButton({ label, count = 0, active = false, children }) {
  const [open, setOpen] = useState(false);
  const on = active || open;
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <button type="button" onClick={() => setOpen(!open)} style={{
        display: 'inline-flex', alignItems: 'center', gap: SP[8], height: 34, padding: '0 ' + SP[12],
        borderRadius: 8, cursor: 'pointer', fontSize: 13,
        background: on ? 'rgba(0,102,255,0.1)' : '#1a1a1f',
        border: '1px solid ' + (on ? PRIMARY : '#3a3a3a'),
        color: on ? PRIMARY : '#cccccc', fontWeight: on ? 600 : 500,
      }}>
        {label}
        {count > 0 && (
          <span style={{ minWidth: 16, height: 16, padding: '0 ' + SP[4], borderRadius: 8,
            background: PRIMARY, color: '#fff', fontSize: 10, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>
        )}
        <span style={{ fontSize: 9 }}>▾</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + ' + SP[8] + ')', left: 0, zIndex: 20,
          width: 300, background: '#16161a', border: '1px solid #2a2a30', borderRadius: 12,
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
          {children}
        </div>
      )}
    </span>
  );
}
