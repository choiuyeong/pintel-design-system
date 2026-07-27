/**
 * Pintel DS 정본 컴포넌트 — Event Badge (id: event-badge-default)
 * 이 파일이 단일 출처입니다. 화면에서 import 해 재사용하세요(재작성 금지).
 * 선별관제 영상 그리드에서 이벤트 발생과 위험 단계를 알리는 오버레이 배지.
 *
 * 표기법(고정): (1) 위치 = 항상 좌상단(카메라 식별 정보는 우상단으로 분리),
 *               (2) 색상 = 위험 단계(위험/경고/주의)를 배경·글씨 색으로 표현,
 *               (3) 여백 = 셀 가장자리에서 12px(SP[12]).
 * ※ 배치는 부모가 position:absolute 컨텍스트에서 top/left = SP[12]로 지정(카메라 식별·타임스탬프 등 OSD 오버레이도 동일 12px).
 * 스타일: 위험 단계별 컬러 채움 배경 + 대비 글씨(밝은색이면 어두운 글씨). 테두리·그림자 없음.
 * 색만으로 구분하지 않도록 한글 라벨을 항상 병기(색맹 접근성). 기본 텍스트 전용, showIcon으로 아이콘 옵션.
 * 위험 단계 3색은 선별관제 모니터링 위험도 3밴드(위험/경고/주의)와 동일 팔레트를 사용.
 */
import { SP, TYPE, W } from '../data/tokens';
import { Icon } from '../components/icons';

// 위험 단계 — 선별관제 3밴드 팔레트. token(기준색=배경) · tx(글씨: 밝은 배경엔 어두운 글씨) · icon(showIcon 시)
export const EVENT_BADGE_SEV = {
  danger:  { key: 'danger',  label: '위험', token: '#F0436A', tx: '#fff',     icon: 'error',   desc: '침입·사고 등 즉시 조치' },
  warning: { key: 'warning', label: '경고', token: '#C9847A', tx: '#fff',     icon: 'warning', desc: '배회·이상 징후 확인 필요' },
  caution: { key: 'caution', label: '주의', token: '#F5EFE0', tx: '#1a1a1f', icon: 'warning', desc: '참고·낮은 우선순위' },
};
// 사이즈 2종 — M(기본, 1×1·2×2 뷰) / S(밀집 3×3+ 그리드). 토큰 스케일만 사용.
export const EVENT_BADGE_SIZE = {
  M: { key: 'M', h: 28, type: TYPE.caption1, radius: 10, icon: 14, spec: '높이 28 · 12px · r10' },
  S: { key: 'S', h: 24, type: TYPE.caption2, radius: 10, icon: 14, spec: '높이 24 · 11px · r10' },
};

/**
 * 이벤트 배지 — 항상 좌상단에 배치(부모가 position:absolute 컨텍스트). 색 = 위험 단계.
 * @param severity 'danger' | 'warning' | 'caution' (기본 danger)
 * @param size     'M' | 'S' (기본 M) — 셀 밀도에 맞춰 선택
 * @param label    미지정 시 위험 단계 기본 라벨(위험/경고/주의). 예: "침입 · 위험"
 * @param showIcon 기본 false(텍스트 전용). true일 때만 상태 아이콘 표시
 */
export function EventBadge({ severity = 'danger', size = 'M', label, showIcon = false }) {
  const s = EVENT_BADGE_SEV[severity] || EVENT_BADGE_SEV.danger;
  const z = EVENT_BADGE_SIZE[size] || EVENT_BADGE_SIZE.M;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: SP[4], flexShrink: 0,
      height: z.h, padding: `${SP[2]} ${SP[8]}`, borderRadius: z.radius,
      background: s.token, color: s.tx,
      ...z.type, lineHeight: 1, fontWeight: W.medium, whiteSpace: 'nowrap',
    }}>
      {showIcon && <Icon name={s.icon} size={z.icon} color={s.tx} />}{label || s.label}
    </span>
  );
}
