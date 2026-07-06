/**
 * Pintel DS 정본 컴포넌트 — DataTable (id: table-default)
 * 이 파일이 단일 출처입니다. 화면에서 import 해 재사용하세요(재작성 금지).
 * 문서/ MCP code 는 gen-component-code.mjs 가 이 파일에서 생성합니다.
 */
import { SP } from '../data/tokens';

// 표준 테이블 — Header + Cell + Pagination. 다크 서피스, 토큰 기반.
// columns: [{ key, label, align? }], rows: [{ [key]: value }]
// 셀 패딩 토큰: 헤더 SP[12] SP[16], 본문 SP[12] SP[16](세로 14→12 그리드 정렬). (borderRadius 10 = 상수)
export function DataTable({ columns, rows }) {
  return (
    <div style={{ border: '1px solid #2a2a30', borderRadius: 10, overflow: 'hidden', background: '#16161a' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: c.align || 'left', padding: SP[12] + ' ' + SP[16],
                fontSize: 13, fontWeight: 600, color: '#8a8a8f', borderBottom: '1px solid #2a2a30' }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key} style={{ textAlign: c.align || 'left', padding: SP[12] + ' ' + SP[16],
                  fontSize: 14, color: '#ffffff', borderTop: i ? '1px solid #232329' : 'none' }}>{r[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
