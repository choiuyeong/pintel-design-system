/**
 * Pintel DS 정본 컴포넌트 — Video (id: media-video)
 * 이 파일이 단일 출처입니다. 화면에서 import 해 재사용하세요(재작성 금지).
 * 선별관제 미배치 채널 실시간 확인(F-2)의 "영상 표출 셀" 레이아웃을 정본화한 것.
 *
 * 구성: 영상 프레임(연결상태 4종) + 오버레이(선택 칩·검지 박스·타임스탬프) + 하단 정보 바(카메라명/번호 + 연결상태 칩).
 * 연결상태: ok(정상=positive) / error(오류=error) / wait(응답없음=cautionary) / nostream(스트림없음=neutral).
 *  - ok: 라이브 화면 + 하단 중앙 타임스탬프(+검지 박스 옵션). error/wait/nostream: 상태 얼굴(빈 박스 채움 금지) + 아이콘·문구.
 * 색은 상태 토큰만 사용(색맹 접근성 — 색 + 아이콘 + 글자 병기). 폐기 Primary 미사용.
 */
import { T, SP, TYPE, W } from '../data/tokens';
import { Icon } from '../components/icons';

// 연결상태 4종 — 색은 상태 토큰. tint/bd/tx = 정보바 칩, face = 문제 상태 배경, nt/ns = 상태 문구.
export const VIDEO_STATE = {
  ok:       { label: '정상',      token: T.positive,   tint: 'rgba(30,212,90,0.14)',   bd: 'rgba(30,212,90,0.42)',   tx: '#66e08f', icon: 'check_circle' },
  error:    { label: '오류',      token: T.error,      tint: 'rgba(255,99,99,0.16)',   bd: 'rgba(255,99,99,0.5)',    tx: '#ff8f8f', icon: 'error',            nt: '연결 오류 · 영상 없음', ns: '카메라 응답이 없습니다', face: 'linear-gradient(180deg,#231416 0%,#120c0d 100%)' },
  wait:     { label: '응답없음',   token: T.cautionary, tint: 'rgba(255,169,56,0.16)',  bd: 'rgba(255,169,56,0.48)',  tx: '#ffc272', icon: 'cycle',            nt: '응답 지연',            ns: '20초 이상 신호 없음',   face: 'linear-gradient(180deg,#231e12 0%,#12100a 100%)' },
  nostream: { label: '스트림없음',  token: '#8a8a92',    tint: 'rgba(138,138,146,0.16)', bd: 'rgba(138,138,146,0.5)',  tx: '#b3b3bb', icon: 'nest_cam_outdoor', nt: '스트림 없음',          ns: '스트림 미설정 (신규 등록)', face: 'linear-gradient(180deg,#1a1a1f 0%,#101013 100%)' },
};
const OK_SCENE = 'linear-gradient(160deg,#1c2230 0%,#12161f 45%,#0c0f16 100%)';

// 연결상태 칩 — 색 + 아이콘 + 글자(색만으로 가르지 않음). 정상은 조용히(중립 + 초록 체크).
function StatusChip({ state }) {
  const s = VIDEO_STATE[state] || VIDEO_STATE.ok;
  const neutral = state === 'ok' || state === 'nostream';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: SP[4], height: '20px', padding: `0 ${SP[8]}`, flexShrink: 0,
      borderRadius: '6px', ...TYPE.caption2, fontWeight: W.bold, whiteSpace: 'nowrap',
      color: neutral ? '#d4d4d8' : s.tx,
      background: neutral ? '#202027' : s.tint,
      border: `1px solid ${neutral ? '#2e2e35' : s.bd}`,
    }}>
      <Icon name={s.icon} size={12} color={state === 'ok' ? '#66e08f' : s.token} />{s.label}
    </span>
  );
}

/**
 * 영상 표출 컴포넌트.
 * @param state    'ok' | 'error' | 'wait' | 'nostream' (기본 ok)
 * @param name/no  카메라명·번호(하단 정보 바). showInfo=false면 정보 바 숨김
 * @param timestamp ok일 때 하단 중앙 시각
 * @param selected 선택(배치 대상) — 청색 테두리 + "선택" 칩
 * @param event    미처리 이벤트 수(있으면 좌상단 이벤트 배지)
 * @param bbox     검지 박스 라벨(있으면 positive 박스, ok에서만)
 * @param aspect   영상 비율(기본 '16 / 9')
 */
export function Video({
  state = 'ok', name, no, timestamp = '2026.07.01 14:22:07',
  selected = false, event, bbox, aspect = '16 / 9', showInfo = true,
}) {
  const s = VIDEO_STATE[state] || VIDEO_STATE.ok;
  const attn = state !== 'ok';
  const border = selected ? T.primaryStrong : (attn ? s.bd : '#2a2a30');
  return (
    <div style={{
      width: '100%', display: 'flex', flexDirection: 'column', minWidth: 0,
      background: '#0a0a0c', border: `1px solid ${border}`, borderRadius: '6px', overflow: 'hidden',
      boxShadow: selected ? `0 0 0 1px ${T.primaryStrong}, 0 0 16px rgba(0,102,255,0.35)` : 'none',
      fontFamily: T.font,
    }}>
      {/* 영상 프레임 */}
      <div style={{ position: 'relative', aspectRatio: aspect, background: state === 'ok' ? OK_SCENE : s.face, overflow: 'hidden' }}>
        {/* 선택(배치 대상) 칩 */}
        {selected && (
          <span style={{ position: 'absolute', top: SP[8], left: SP[8], zIndex: 4, display: 'inline-flex', alignItems: 'center', gap: SP[4], height: '22px', padding: `0 ${SP[8]}`, borderRadius: '7px', background: `linear-gradient(135deg, ${T.primaryStrong} 0%, ${T.primaryHeavy} 100%)`, color: '#fff', ...TYPE.caption1, lineHeight: 1, fontWeight: W.bold, boxShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
            <Icon name="check" size={13} color="#fff" />선택
          </span>
        )}
        {/* 이벤트 배지(좌상단, 선택 칩과 위계 분리) */}
        {event != null && (
          <span style={{ position: 'absolute', top: selected ? '38px' : SP[8], left: SP[8], zIndex: 4, display: 'inline-flex', alignItems: 'center', gap: SP[4], height: '20px', padding: `0 ${SP[8]}`, borderRadius: '6px', ...TYPE.caption2, fontWeight: W.bold, color: '#8fb8ff', background: 'rgba(0,102,255,0.14)', border: '1px solid rgba(0,102,255,0.4)' }}>
            <Icon name="warning" size={11} color="#8fb8ff" />이벤트 {event}
          </span>
        )}
        {state === 'ok' ? (
          <>
            {/* 비네팅 스크림 */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 120% at 50% 38%, transparent 52%, rgba(0,0,0,0.34) 100%)' }} />
            {/* 검지 박스(positive) */}
            {bbox && (
              <div style={{ position: 'absolute', left: '34%', top: '30%', width: '30%', height: '44%', border: `1.5px solid ${T.positive}`, borderRadius: '2px', zIndex: 2 }}>
                <span style={{ position: 'absolute', top: '-14px', left: '-1px', ...TYPE.caption2, fontWeight: W.bold, background: 'rgba(30,212,90,0.92)', color: '#04210f', padding: `0 ${SP[4]}`, borderRadius: '2px', whiteSpace: 'nowrap' }}>{bbox}</span>
              </div>
            )}
            {/* 하단 중앙 타임스탬프 */}
            <span style={{ position: 'absolute', bottom: SP[4], left: '50%', transform: 'translateX(-50%)', zIndex: 3, ...TYPE.caption2, fontWeight: W.medium, color: '#fff', fontVariantNumeric: 'tabular-nums', textShadow: '0 1px 3px rgba(0,0,0,0.85)', whiteSpace: 'nowrap' }}>{timestamp}</span>
          </>
        ) : (
          /* 문제 상태 — 실제 상태 화면(빈 박스 채움 금지) */
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: SP[4], textAlign: 'center', padding: SP[8] }}>
            <Icon name={s.icon} size={28} color={s.token} />
            <span style={{ ...TYPE.caption1, fontWeight: W.semibold, color: s.token }}>{s.nt}</span>
            <span style={{ ...TYPE.caption2, color: '#8a8a92' }}>{s.ns}</span>
          </div>
        )}
      </div>
      {/* 하단 정보 바 — 카메라명·번호 + 연결상태 칩 */}
      {showInfo && (name || no) && (
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: SP[8], padding: SP[8], background: '#16161a', borderTop: '1px solid #232329' }}>
          <span style={{ minWidth: 0, flex: 1 }}>
            {name && <span style={{ display: 'block', ...TYPE.caption1, fontWeight: W.semibold, color: '#d4d4d8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>}
            {no && <span style={{ display: 'block', ...TYPE.caption2, color: '#8a8a92', fontVariantNumeric: 'tabular-nums' }}>{no}</span>}
          </span>
          <StatusChip state={state} />
        </div>
      )}
    </div>
  );
}
