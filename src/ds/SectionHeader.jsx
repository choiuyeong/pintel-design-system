/**
 * Pintel DS 정본 컴포넌트 — SectionHeader (id: section-header-default)
 * 이 파일이 단일 출처입니다. 화면에서 import 해 재사용하세요(재작성 금지).
 * 문서/ MCP code 는 gen-component-code.mjs 가 이 파일에서 생성합니다.
 */
import { SP, TYPE, W, T } from '../data/tokens';

// 섹션·패널·카드 상단 헤더 — 제목 + 헤딩 콘텐츠(상태·개수 등) + 트레일링(액션·메타)
// 간격: 제목과 헤딩 콘텐츠 사이 SP[8], 트레일링은 marginLeft:auto 로 우측 정렬.
export function SectionHeader({ heading, headingContent, trailing }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP[8],
      width: '100%', minHeight: 32,
    }}>
      <h2 style={{
        margin: 0,
        ...TYPE.heading2,            // 20px / 28px — 섹션 헤딩
        fontWeight: W.bold,
        color: '#ffffff',           // Label.Strong (다크 표면 위 최상위 텍스트)
      }}>
        {heading}
      </h2>

      {/* 헤딩 콘텐츠 슬롯 — 상태/개수 Chip 등 (선택) */}
      {headingContent}

      {/* 트레일링 슬롯 — 더보기·새로고침·갱신시각 등 (선택) */}
      {trailing && (
        <div style={{
          marginLeft: 'auto',
          display: 'inline-flex', alignItems: 'center', gap: SP[4],
          ...TYPE.body2,            // 15px / 22px — 보조 메타·액션
          fontWeight: W.medium,
          color: '#9a9aa2',         // 보조 텍스트 (neutral)
        }}>
          {trailing}
        </div>
      )}
    </div>
  );
}
