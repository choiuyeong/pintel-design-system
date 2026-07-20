import { useState, useEffect, useRef } from 'react';
import { Icon } from './icons';
import PrevaxPermissionScreen, { generateXaml, PERM_ROWS, PrevaxPermissionScreen2 } from './PermissionSettings';
import { LIBRARY_TEMPLATES } from '../data/templates';
import { T, W, TYPE, SP, SEM, PALETTE_DARK, PALETTE_LIGHT } from '../data/tokens';

function XamlDownloadButton() {
  const download = () => {
    const initPerms = {};
    PERM_ROWS.forEach((r) => { initPerms[r.id] = { user: r.user, mgr: r.mgr, admin: r.admin }; });
    const xml = generateXaml(initPerms);
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PermissionSettingsView.xaml';
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button
      onClick={download}
      title="WPF UserControl XAML로 내보내기"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: SP[4],
        padding: `${SP[4]} ${SP[12]}`, borderRadius: '6px', cursor: 'pointer',
        border: '1px solid #33333a', background: '#1a1a20',
        color: '#a0b0d0', fontSize: '12px', fontWeight: 500, fontFamily: T.font,
        letterSpacing: '0.025em', transition: 'background 0.12s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#24242c'}
      onMouseLeave={(e) => e.currentTarget.style.background = '#1a1a20'}
    >
      <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
        <path d="M6 1v7M3.5 5.5L6 8l2.5-2.5" stroke="#a0b0d0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1.5 9.5h9" stroke="#a0b0d0" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
      XAML 내려받기
    </button>
  );
}

/**
 * Library 탭 — 디자인 시스템 컴포넌트/토큰만으로 구성한 "화면 예시(Templates)".
 * 현재 예시: Login. (componentId 로 분기하므로 예시는 자유롭게 추가 가능)
 */

// 디자인 토큰은 src/data/tokens.js 단일 출처에서 import (위 import 문 참조).
//  T(시맨틱 색상)·W(굵기)·TYPE(Typography.Style)·SP(Spacing)·PALETTE_DARK/LIGHT.
//  Primary 계열은 오너 확정값 #0066FF.
const C = PALETTE_DARK; // ← 비교 전환: PALETTE_LIGHT / PALETTE_DARK

// check_circle 의 체크 곡선만 (Figma export) — 체크박스 내부용
function CheckGlyph({ size = 14, color = '#ffffff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.12623 13.1262C8.51675 13.5168 9.14992 13.5168 9.54044 13.1262L14.125 8.54167C14.4472 8.2195 14.4472 7.69717 14.125 7.375C13.8028 7.05283 13.2805 7.05283 12.9583 7.375L9.54044 10.7929C9.14992 11.1834 8.51675 11.1834 8.12623 10.7929L7.04167 9.70833C6.7195 9.38617 6.19717 9.38617 5.875 9.70833C5.55283 10.0305 5.55283 10.5528 5.875 10.875L8.12623 13.1262Z" fill={color} />
    </svg>
  );
}

function EyeIcon({ off }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {off ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

// 입력 내용 전체 삭제 (X) 버튼
function ClearButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="입력 내용 지우기"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '18px', height: '18px', flexShrink: 0, padding: 0,
        borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: C.clearBg, color: C.clearIcon,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
        <line x1="5" y1="5" x2="19" y2="19" />
        <line x1="19" y1="5" x2="5" y2="19" />
      </svg>
    </button>
  );
}

// Text field (Selection and input > Text field 스펙: label 12px #888, box radius 8, h44, focus #0066FF)
// error: 빨강 오류 메시지 / hint: 중립 안내 메시지 (error 우선)
function Field({ label, type = 'text', value, onChange, onBlur, placeholder, autoComplete, error, hint, tooltip, trailing }) {
  const [focused, setFocused] = useState(false);
  const invalid = error || tooltip;
  const borderColor = invalid ? C.errorBorder : focused ? C.primary : C.inputBorder;
  const ring = invalid ? `0 0 0 3px ${C.errorRing}` : focused ? `0 0 0 3px ${C.focusRing}` : 'none';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP[8] }}>
      <label style={{ ...TYPE.caption1, fontWeight: W.semibold, color: C.fieldLabel }}>{label}</label>
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: SP[8],
        height: '44px', padding: `0 ${SP[12]}`,
        background: C.inputBg,
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        boxShadow: ring,
        transition: 'border-color .15s, box-shadow .15s',
      }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); if (onBlur) onBlur(); }}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
            color: C.inputText, fontFamily: T.font, ...TYPE.body2,
          }}
        />
        {trailing}
        {tooltip && (
          <div role="alert" style={{
            position: 'absolute', top: 'calc(100% + 9px)', left: 0, zIndex: 30,
            display: 'flex', alignItems: 'flex-start', gap: SP[8],
            width: 'max-content', maxWidth: '300px', padding: `${SP[8]} ${SP[12]}`,
            background: C.tooltipBg, border: `1px solid ${C.tooltipBorder}`,
            borderRadius: '8px', boxShadow: '0 10px 28px rgba(0,0,0,0.25)',
          }}>
            <span style={{
              flexShrink: 0, width: '16px', height: '16px', marginTop: '1px', borderRadius: '4px',
              background: C.tooltipIcon, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: W.bold, lineHeight: 1,
            }}>!</span>
            <span style={{ ...TYPE.label2, fontWeight: W.regular, color: C.tooltipText }}>{tooltip}</span>
            {/* 위쪽 화살표 */}
            <span style={{
              position: 'absolute', top: '-5px', left: '14px', width: '9px', height: '9px',
              background: C.tooltipBg, borderLeft: `1px solid ${C.tooltipBorder}`, borderTop: `1px solid ${C.tooltipBorder}`,
              transform: 'rotate(45deg)',
            }} />
          </div>
        )}
      </div>
      {(error || hint) && <span style={{ ...TYPE.caption1, color: C.errorText }}>{error || hint}</span>}
    </div>
  );
}

function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  // Primary Solid 버튼 상태 (Button 스펙: hover #3385FF, pressed #0052CC)
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!username.trim()) next.username = '아이디를 입력해 주세요.';
    if (!password) next.password = '비밀번호를 입력해 주세요.';
    setErrors(next);
    if (Object.keys(next).length === 0) setDone(true);
  };

  const btnBg = active ? C.primaryHeavy : hover ? C.primaryStrong : C.primary;

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: '384px', maxWidth: '100%',
        background: C.cardBg,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: '16px',
        padding: `${SP[40]} ${SP[32]} ${SP[32]}`,
        boxShadow: C.cardShadow,
        boxSizing: 'border-box',
        fontFamily: T.font,
      }}
    >
      {/* 로고 + 타이틀 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP[32], marginBottom: SP[8] }}>
        <img src="/pintel-logo.png" alt="PINTEL" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
        <h2 style={{ margin: 0, ...TYPE.title3, fontWeight: W.bold, color: C.title }}>로그인</h2>
      </div>
      <p style={{ margin: `${SP[4]} 0 ${SP[32]}`, ...TYPE.label1, fontWeight: W.medium, color: C.subtitle, textAlign: 'center' }}>
        핀텔 관제 시스템에 오신 것을 환영합니다.
      </p>

      {done ? (
        <div style={{
          padding: SP[16], borderRadius: '8px',
          background: 'rgba(30,212,90,0.12)', border: `1px solid ${C.positive}`,
          color: C.positive, ...TYPE.label1, fontWeight: W.semibold,
        }}>
          ✓ 로그인 되었습니다 (데모)
          <div style={{ marginTop: SP[4], color: C.subtitle, fontWeight: W.regular, ...TYPE.caption1 }}>
            {username} 님 환영합니다.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP[16] }}>
          <Field
            label="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디 또는 이메일"
            autoComplete="username"
            error={errors.username}
            hint={/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(username) ? '한글입니다' : undefined}
            trailing={username ? <ClearButton onClick={() => setUsername('')} /> : null}
          />
          <Field
            label="비밀번호"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            autoComplete="current-password"
            error={errors.password}
            trailing={
              <>
                {password && <ClearButton onClick={() => setPassword('')} />}
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 표시'}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: C.eyeColor, padding: 0,
                  }}
                >
                  <EyeIcon off={showPw} />
                </button>
              </>
            }
          />

          {/* 로그인 상태 유지 (Checkbox) + 비밀번호 찾기 (Text button) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: `-${SP[2]}` }}>
            <div
              onClick={() => setRemember((v) => !v)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], cursor: 'pointer', userSelect: 'none' }}
            >
              <div style={{
                width: '18px', height: '18px', borderRadius: '4px',
                background: remember ? C.primary : 'transparent',
                border: `1px solid ${remember ? C.primary : C.checkBorderOff}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s',
              }}>
                {remember && <CheckGlyph size={14} color={C.onPrimary} />}
              </div>
              <span style={{ ...TYPE.label2, color: C.checkLabel }}>로그인 상태 유지</span>
            </div>
            <button
              type="button"
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                color: C.link, ...TYPE.label2, fontWeight: W.semibold, fontFamily: T.font,
              }}
            >
              비밀번호 찾기
            </button>
          </div>

          {/* Primary Solid 버튼 (로그인) */}
          <button
            type="submit"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => { setHover(false); setActive(false); }}
            onMouseDown={() => setActive(true)}
            onMouseUp={() => setActive(false)}
            style={{
              height: '44px', width: '100%', marginTop: SP[4],
              border: 'none', borderRadius: '8px',
              background: btnBg, color: C.onPrimary,
              ...TYPE.label1, fontWeight: W.semibold, fontFamily: T.font,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            로그인
          </button>
        </div>
      )}

      {/* 푸터 */}
      <div style={{
        marginTop: SP[24], paddingTop: SP[24], borderTop: `1px solid ${C.divider}`,
        textAlign: 'center', ...TYPE.label2, color: C.muted,
      }}>
        계정이 필요하면 관리자에게 문의하세요.
      </div>
    </form>
  );
}

// 상단 상태 칩 (Content badge / neutral)
function Stat({ dot, label, value }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#1a1a1e', border: '1px solid #26262c', padding: `3px ${SP[8]}`, borderRadius: '20px' }}>
      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: dot }} />
      <span style={{ color: '#9a9aa2' }}>{label}</span>
      <span style={{ color: '#fff', fontWeight: W.bold }}>{value}</span>
    </span>
  );
}

function Legend({ dot, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dot }} />{label}
    </span>
  );
}

/**
 * 선별관제 GIS 모니터링 화면
 * Service Domains > 선별관제: Camera Range Controller(GIS 반경) · Detected Target List(감지 피드)
 * · Event Grid(이벤트 테이블) + Status Color 토큰으로 구성한 관제 콘솔 예시.
 */
function GisMonitorScreen() {
  const cameras = [
    { id: 'CAM_08', x: 32, y: 40, status: 'alert' },
    { id: 'CAM_02', x: 60, y: 28, status: 'warning' },
    { id: 'CAM_15', x: 72, y: 62, status: 'normal' },
    { id: 'CAM_21', x: 45, y: 68, status: 'warning' },
    { id: 'CAM_05', x: 20, y: 70, status: 'normal' },
  ];
  const [selected, setSelected] = useState('CAM_08');
  const [radius, setRadius] = useState(80);

  const statusColor = (s) => (s === 'alert' ? T.error : s === 'warning' ? T.cautionary : T.positive);
  const sevColor = (s) => (s === 'danger' ? T.error : s === 'warning' ? T.cautionary : T.primaryStrong);

  const feed = [
    { icon: '🚧', target: '가상 펜스 선로 침입', cam: 'CAM_08', time: '14:12:05', sev: 'danger' },
    { icon: '👤', target: '구역 내 거동 배회', cam: 'CAM_21', time: '14:09:44', sev: 'warning' },
    { icon: '🚗', target: '차량 인도 불법 주정차', cam: 'CAM_02', time: '14:03:18', sev: 'warning' },
    { icon: '🗑️', target: '무단 쓰레기 투척', cam: 'CAM_15', time: '13:58:12', sev: 'info' },
  ];
  const events = [
    { time: '14:12:05', type: '가상 펜스 침입', cam: 'CAM_08', sev: 'danger', status: '미확인' },
    { time: '14:09:44', type: '배회 경보', cam: 'CAM_21', sev: 'warning', status: '확인중' },
    { time: '13:58:12', type: '불법 투기', cam: 'CAM_15', sev: 'info', status: '조치완료' },
  ];
  const statusChip = (s) =>
    s === '조치완료'
      ? { bg: 'rgba(30,212,90,0.14)', color: T.positive }
      : s === '확인중'
      ? { bg: 'rgba(255,169,56,0.14)', color: T.cautionary }
      : { bg: 'rgba(255,99,99,0.14)', color: T.error };

  const railTitle = { padding: `${SP[12]} ${SP[16]} ${SP[8]}`, fontSize: '12px', fontWeight: W.semibold, color: '#8a8a92' };

  return (
    <div style={{
      width: '100%', maxWidth: '1120px', height: '648px',
      display: 'flex', flexDirection: 'column',
      background: '#0d0d10', border: '1px solid #242428', borderRadius: '12px',
      overflow: 'hidden', fontFamily: T.font, color: '#fff', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      {/* 상단 바 */}
      <div style={{ height: '52px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${SP[16]}`, borderBottom: '1px solid #1f1f24', background: '#121216' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: T.positive, boxShadow: `0 0 8px ${T.positive}` }} />
          <span style={{ fontSize: '15px', fontWeight: W.bold }}>선별관제 GIS 모니터링</span>
          <span style={{ fontSize: '12px', fontWeight: W.light, color: '#7a7a82' }}>실시간 이상행동 선별 관제</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], fontSize: '12px' }}>
          <Stat dot={T.positive} label="정상" value="22" />
          <Stat dot={T.cautionary} label="경보" value="2" />
          <Stat dot={T.error} label="긴급" value="1" />
          <span style={{ marginLeft: SP[8], color: '#9a9aa2', fontVariantNumeric: 'tabular-nums' }}>2026.06.05 14:12:38</span>
        </div>
      </div>

      {/* 메인 행 */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 좌측: 카메라 채널 + 반경 제어 */}
        <div style={{ width: '212px', flexShrink: 0, borderRight: '1px solid #1f1f24', background: '#101014', display: 'flex', flexDirection: 'column' }}>
          <div style={railTitle}>카메라 채널</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: `0 ${SP[8]}` }}>
            {cameras.map((c) => (
              <div key={c.id} onClick={() => setSelected(c.id)} style={{
                display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[8]}`, margin: `${SP[2]} 0`, borderRadius: '6px', cursor: 'pointer',
                background: selected === c.id ? 'rgba(0, 102, 255,0.18)' : 'transparent',
                border: `1px solid ${selected === c.id ? T.primary : 'transparent'}`,
                transition: 'background .15s, border-color .15s',
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusColor(c.status), flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#e4e4e8', flex: 1 }}>{c.id}</span>
                <span style={{ fontSize: '10px', color: '#5f5f67' }}>CCTV</span>
              </div>
            ))}
          </div>
          {/* Camera Range Controller */}
          <div style={{ padding: SP[16], borderTop: '1px solid #1f1f24' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8a8a92', marginBottom: SP[8] }}>
              <span>분석 유효 반경</span>
              <span style={{ color: T.positive, fontWeight: W.semibold }}>{radius}m</span>
            </div>
            <input type="range" min="20" max="150" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} style={{ width: '100%', accentColor: T.positive, cursor: 'pointer' }} />
            <div style={{ marginTop: SP[4], fontSize: '11px', color: '#5f5f67' }}>선택: {selected}</div>
          </div>
        </div>

        {/* 중앙: GIS 지도 */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'radial-gradient(900px 480px at 50% 28%, #15151c, #0a0a0d)' }}>
          {/* 그리드 */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          {/* 도로 */}
          <div style={{ position: 'absolute', left: '-5%', right: '-5%', top: '46%', height: '16px', background: '#23232b', transform: 'rotate(-4deg)' }} />
          <div style={{ position: 'absolute', top: '-5%', bottom: '-5%', left: '54%', width: '16px', background: '#23232b', transform: 'rotate(3deg)' }} />
          <div style={{ position: 'absolute', left: '8%', top: '8%', width: '46%', height: '10px', background: '#1d1d24', transform: 'rotate(26deg)' }} />

          {/* 카메라 마커 + 반경 */}
          {cameras.map((c) => {
            const isSel = c.id === selected;
            const px = isSel ? radius * 1.7 : 64;
            return (
              <div key={c.id} style={{ position: 'absolute', left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%,-50%)', zIndex: isSel ? 4 : 2 }}>
                <div style={{
                  position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
                  width: `${px}px`, height: `${px}px`, borderRadius: '50%',
                  background: isSel ? 'rgba(30,212,90,0.10)' : `${statusColor(c.status)}14`,
                  border: `1.5px solid ${isSel ? T.positive : statusColor(c.status)}`,
                  opacity: isSel ? 1 : 0.45, transition: 'width .08s, height .08s', pointerEvents: 'none',
                }} />
                <div style={{ position: 'relative', width: '16px', height: '16px', borderRadius: '50%', background: isSel ? T.primary : '#2a2a32', border: `2px solid ${isSel ? '#fff' : statusColor(c.status)}`, boxShadow: isSel ? `0 0 10px ${T.primary}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>📹</div>
                {isSel && (
                  <div style={{ position: 'absolute', left: '50%', top: 'calc(50% + 14px)', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: '11px', color: T.positive, fontWeight: W.semibold }}>
                    {c.id} · {radius}m
                  </div>
                )}
              </div>
            );
          })}

          {/* 감지 핑 (침입) */}
          <div style={{ position: 'absolute', left: '34%', top: '43%', transform: 'translate(-50%,-50%)', zIndex: 5 }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: T.error, boxShadow: `0 0 0 4px rgba(255,99,99,0.25), 0 0 12px ${T.error}` }} />
            <div style={{ position: 'absolute', left: '14px', top: '-5px', whiteSpace: 'nowrap', fontSize: '10px', color: T.error, fontWeight: W.bold, background: '#1a0d0d', border: `1px solid ${T.error}`, padding: `1px ${SP[4]}`, borderRadius: '4px' }}>침입 감지</div>
          </div>

          {/* 범례 */}
          <div style={{ position: 'absolute', left: '12px', bottom: '12px', display: 'flex', gap: SP[12], fontSize: '11px', color: '#aaa', background: 'rgba(14,14,17,0.8)', padding: `${SP[4]} ${SP[8]}`, borderRadius: '6px', border: '1px solid #22222a' }}>
            <Legend dot={T.positive} label="정상" />
            <Legend dot={T.cautionary} label="경보" />
            <Legend dot={T.error} label="긴급" />
          </div>
          <div style={{ position: 'absolute', right: '12px', top: '12px', fontSize: '11px', color: '#7a7a82', background: 'rgba(14,14,17,0.8)', padding: `${SP[4]} ${SP[8]}`, borderRadius: '4px', border: '1px solid #22222a' }}>GIS · 수원시 권선구</div>
        </div>

        {/* 우측: 관심 객체 감지 피드 (Detected Target List) */}
        <div style={{ width: '272px', flexShrink: 0, borderLeft: '1px solid #1f1f24', background: '#101014', display: 'flex', flexDirection: 'column' }}>
          <div style={railTitle}>관심 객체 감지 피드</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: `0 ${SP[12]} ${SP[12]}`, display: 'flex', flexDirection: 'column', gap: SP[8] }}>
            {feed.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: SP[8], alignItems: 'center', background: '#1a1a1e', border: '1px solid #26262c', borderLeft: `3px solid ${sevColor(f.sev)}`, borderRadius: '8px', padding: `${SP[8]} ${SP[12]}` }}>
                <span style={{ fontSize: '18px' }}>{f.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: W.bold, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.target}</div>
                  <div style={{ fontSize: '11px', color: '#7f7f87', marginTop: SP[2] }}>{f.cam} · {f.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단: 이벤트 그리드 (Event Grid) */}
      <div style={{ height: '142px', flexShrink: 0, borderTop: '1px solid #1f1f24', background: '#101014', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: `${SP[8]} ${SP[16]} ${SP[4]}`, fontSize: '12px', fontWeight: W.semibold, color: '#8a8a92' }}>실시간 이상행동 이벤트</div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ color: '#6f6f77' }}>
                {['시간', '유형', '카메라', '심각도', '상태', ''].map((h, i) => (
                  <th key={i} style={{ padding: `${SP[4]} ${SP[16]}`, fontWeight: W.regular, textAlign: 'left', borderBottom: '1px solid #1f1f24' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => {
                const chip = statusChip(e.status);
                return (
                  <tr key={i} style={{ color: '#d4d4d8' }}>
                    <td style={{ padding: `${SP[8]} ${SP[16]}`, fontVariantNumeric: 'tabular-nums' }}>{e.time}</td>
                    <td style={{ padding: `${SP[8]} ${SP[16]}` }}>{e.type}</td>
                    <td style={{ padding: `${SP[8]} ${SP[16]}`, color: '#9a9aa2' }}>{e.cam}</td>
                    <td style={{ padding: `${SP[8]} ${SP[16]}` }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: sevColor(e.sev), marginRight: SP[4] }} />
                      {e.sev === 'danger' ? '긴급' : e.sev === 'warning' ? '경보' : '정보'}
                    </td>
                    <td style={{ padding: `${SP[8]} ${SP[16]}` }}>
                      <span style={{ fontSize: '11px', padding: `${SP[2]} ${SP[8]}`, borderRadius: '10px', background: chip.bg, color: chip.color }}>{e.status}</span>
                    </td>
                    <td style={{ padding: `${SP[8]} ${SP[16]}` }}>
                      <button style={{ fontSize: '11px', padding: `3px ${SP[8]}`, borderRadius: '6px', border: `1px solid ${T.primary}`, background: 'transparent', color: T.primaryStrong, cursor: 'pointer', fontFamily: T.font }}>영상</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 약관 동의 체크 행 (회원가입)
function CheckRow({ checked, onChange, children }) {
  return (
    <div onClick={onChange} style={{ display: 'flex', alignItems: 'center', gap: SP[8], cursor: 'pointer', userSelect: 'none', padding: `${SP[2]} 0` }}>
      <div style={{
        width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
        background: checked ? C.primary : 'transparent',
        border: `1px solid ${checked ? C.primary : C.checkBorderOff}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s',
      }}>
        {checked && <CheckGlyph size={14} color={C.onPrimary} />}
      </div>
      <span style={{ ...TYPE.label2, color: checked ? C.checkLabel : C.muted }}>{children}</span>
    </div>
  );
}

function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTos, setAgreeTos] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMkt, setAgreeMkt] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailTooltip, setEmailTooltip] = useState('');
  const [done, setDone] = useState(false);
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const allChecked = agreeTos && agreePrivacy && agreeMkt;
  const toggleAll = () => { const v = !allChecked; setAgreeTos(v); setAgreePrivacy(v); setAgreeMkt(v); };
  const emailHasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    // 이메일은 네이티브 말풍선 대신 커스텀 툴팁으로 안내
    let emailTip = '';
    if (!email.trim()) emailTip = '이메일을 입력해 주세요.';
    else if (!email.includes('@')) emailTip = "이메일 주소에 '@'를 포함해 주세요.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) emailTip = "올바른 이메일 형식이 아닙니다. (예: name@pintel.co.kr)";

    if (!name.trim()) next.name = '이름을 입력해 주세요.';
    if (!password) next.password = '비밀번호를 입력해 주세요.';
    else if (password.length < 8) next.password = '비밀번호는 8자 이상이어야 합니다.';
    if (confirm !== password) next.confirm = '비밀번호가 일치하지 않습니다.';
    if (!agreeTos || !agreePrivacy) next.terms = '필수 약관에 동의해 주세요.';
    setErrors(next);
    setEmailTooltip(emailTip);
    if (Object.keys(next).length === 0 && !emailTip) setDone(true);
  };

  // 포커스 아웃(blur) 시 즉시 검증
  const checkPassword = () => setErrors((prev) => {
    const n = { ...prev };
    if (password.length > 0 && password.length < 8) n.password = '비밀번호는 8자 이상이어야 합니다.';
    else delete n.password;
    return n;
  });
  const checkConfirm = () => setErrors((prev) => {
    const n = { ...prev };
    if (confirm.length > 0 && confirm.length < 8) n.confirm = '비밀번호는 8자 이상이어야 합니다.';
    else if (confirm.length > 0 && confirm !== password) n.confirm = '비밀번호가 일치하지 않습니다.';
    else delete n.confirm;
    return n;
  });
  const checkEmail = () => {
    if (!email.trim()) { setEmailTooltip(''); return; } // 빈 칸은 blur 검증 제외(제출 시 처리)
    if (!email.includes('@')) setEmailTooltip("이메일 주소에 '@'를 포함해 주세요.");
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) setEmailTooltip("올바른 이메일 형식이 아닙니다. (예: name@pintel.co.kr)");
    else setEmailTooltip('');
  };
  const clearError = (key) => setErrors((prev) => {
    if (!prev[key]) return prev;
    const n = { ...prev }; delete n[key]; return n;
  });

  const btnBg = active ? C.primaryHeavy : hover ? C.primaryStrong : C.primary;

  const pwTrailing = (val, setVal, show, setShow) => (
    <>
      {val && <ClearButton onClick={() => setVal('')} />}
      <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? '비밀번호 숨기기' : '비밀번호 표시'}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: C.eyeColor, padding: 0 }}>
        <EyeIcon off={show} />
      </button>
    </>
  );

  return (
    <form onSubmit={handleSubmit} noValidate style={{
      width: '384px', maxWidth: '100%', background: C.cardBg, border: `1px solid ${C.cardBorder}`,
      borderRadius: '16px', padding: `${SP[40]} ${SP[32]} ${SP[32]}`, boxShadow: C.cardShadow,
      boxSizing: 'border-box', fontFamily: T.font,
    }}>
      {/* 로고 + 타이틀 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP[32], marginBottom: SP[8] }}>
        <img src="/pintel-logo.png" alt="PINTEL" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
        <h2 style={{ margin: 0, ...TYPE.title3, fontWeight: W.bold, color: C.title }}>계정 생성</h2>
      </div>

      <p style={{ margin: `${SP[4]} 0 ${SP[32]}`, ...TYPE.label1, fontWeight: W.medium, color: C.subtitle, textAlign: 'center' }}>핀텔 관제 시스템 계정을 생성합니다.</p>

      {done ? (
        <div style={{ padding: SP[16], borderRadius: '8px', background: 'rgba(30,212,90,0.12)', border: `1px solid ${C.positive}`, color: C.positive, ...TYPE.label1, fontWeight: W.semibold }}>
          ✓ 가입이 완료되었습니다 (데모)
          <div style={{ marginTop: SP[4], color: C.subtitle, fontWeight: W.regular, ...TYPE.caption1 }}>{name} 님, 환영합니다.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP[16] }}>
          <Field label="이름" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" autoComplete="name"
            error={errors.name} trailing={name ? <ClearButton onClick={() => setName('')} /> : null} />
          <Field label="이메일" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailTooltip(''); }} onBlur={checkEmail} placeholder="example@pintel.co.kr" autoComplete="email"
            tooltip={emailTooltip} hint={emailHasKorean ? '한글입니다' : undefined}
            trailing={email ? <ClearButton onClick={() => { setEmail(''); setEmailTooltip(''); }} /> : null} />
          <Field label="비밀번호" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); clearError('password'); }} onBlur={checkPassword} placeholder="8자 이상" autoComplete="new-password"
            error={errors.password} trailing={pwTrailing(password, setPassword, showPw, setShowPw)} />
          <Field label="비밀번호 확인" type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e) => { setConfirm(e.target.value); clearError('confirm'); }} onBlur={checkConfirm} placeholder="비밀번호 재입력" autoComplete="new-password"
            error={errors.confirm} trailing={pwTrailing(confirm, setConfirm, showConfirm, setShowConfirm)} />

          {/* 약관 동의 */}
          <div style={{ marginTop: SP[4], padding: `${SP[12]} ${SP[16]}`, borderRadius: '10px', background: C.inputBg, border: `1px solid ${C.divider}`, display: 'flex', flexDirection: 'column', gap: SP[8] }}>
            <CheckRow checked={allChecked} onChange={toggleAll}><span style={{ fontWeight: W.semibold, color: C.title }}>약관 전체 동의</span></CheckRow>
            <div style={{ height: '1px', background: C.divider, margin: `${SP[2]} 0` }} />
            <CheckRow checked={agreeTos} onChange={() => setAgreeTos((v) => !v)}><span style={{ color: C.link }}>[필수]</span> 이용약관 동의</CheckRow>
            <CheckRow checked={agreePrivacy} onChange={() => setAgreePrivacy((v) => !v)}><span style={{ color: C.link }}>[필수]</span> 개인정보 수집·이용 동의</CheckRow>
            <CheckRow checked={agreeMkt} onChange={() => setAgreeMkt((v) => !v)}><span style={{ color: C.muted }}>[선택]</span> 마케팅 정보 수신 동의</CheckRow>
          </div>
          {errors.terms && <span style={{ ...TYPE.caption1, color: C.errorText, marginTop: `-${SP[8]}` }}>{errors.terms}</span>}

          <button type="submit"
            onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setActive(false); }}
            onMouseDown={() => setActive(true)} onMouseUp={() => setActive(false)}
            style={{ height: '44px', width: '100%', marginTop: SP[4], border: 'none', borderRadius: '8px', background: btnBg, color: C.onPrimary, ...TYPE.label1, fontWeight: W.semibold, cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            계정 생성
          </button>
        </div>
      )}

      <div style={{ marginTop: SP[24], paddingTop: SP[24], borderTop: `1px solid ${C.divider}`, textAlign: 'center', ...TYPE.label2, color: C.muted }}>
        관리자(상위 권한)가 사용자 계정을 생성합니다.
      </div>
    </form>
  );
}

// ── PREVAX 공통 크롬 (타이틀바 / 탭바) — GIS·설정 등에서 공유해 통일성 유지 ──
const PREVAX_TABS = ['대시보드', '지도', '선별관제', '실시간영상', '이벤트조회', '통계보고서', '이력조회', '설정'];
const prevaxWinBtn = { fontSize: '12px', color: '#8a8a92', cursor: 'pointer', lineHeight: 1 };

// 자리 비움 → "대신 받을 관제사 선택" 모달. 근무 중(접속+담당 권한, 응답 확인)인 관제사만 노출.
const AWAY_OPERATORS = [
  { name: '박민지', initial: '박', dept: '담당 8대 · 2지역' },
  { name: '이수진', initial: '이', dept: '담당 6대 · 3지역' },
  { name: '정하늘', initial: '정', dept: '담당 5대 · 1지역' },
];

function AwayModal({ onClose, onApply }) {
  const [sel, setSel] = useState(AWAY_OPERATORS[0].name);
  // control-radio 정본 — 외곽 원 전체 채움(#0066FF) + 흰 점(Small 16/6)
  const Radio = ({ on }) => (
    <span style={{ width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, boxSizing: 'border-box', border: on ? 'none' : '1.5px solid #71717a', background: on ? T.primary : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {on && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
    </span>
  );
  const btnBase = { height: '30px', padding: `0 ${SP[16]}`, borderRadius: '4px', ...TYPE.caption1, fontWeight: W.semibold, cursor: 'pointer', fontFamily: T.font, display: 'inline-flex', alignItems: 'center' };
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: SP[16] }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '440px', maxWidth: '100%', background: '#1d1d22', border: '1px solid #2e2e35', borderRadius: '12px', boxShadow: '0 32px 80px rgba(0,0,0,0.7)', overflow: 'hidden', fontFamily: T.font }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[16]} ${SP[16]} ${SP[12]}` }}>
          <span style={{ display: 'inline-flex', color: T.cautionary }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.3 2.7-5.3 6.5-5.3s6.5 2 6.5 5.3" /><circle cx="18" cy="7" r="2.2" /><path d="M21.5 20c0-2.4-1.3-4-3.5-4.4" /></svg>
          </span>
          <span style={{ ...TYPE.label1, fontWeight: W.bold, color: '#fff' }}>대신 받을 관제사 선택</span>
        </div>
        {/* 설명 */}
        <div style={{ padding: `0 ${SP[16]} ${SP[12]}` }}>
          <p style={{ ...TYPE.caption1, color: '#9a9aa2', lineHeight: 1.6, margin: 0 }}>
            자리를 비우는 동안 <b style={{ color: '#e8e8ec', fontWeight: W.semibold }}>김서연</b> 담당 카메라의 이벤트를 대신 볼 관제사 한 명을 고르세요. 지금 <b style={{ color: '#e8e8ec', fontWeight: W.semibold }}>근무 중</b>(접속 + 담당 카메라 권한)인 관제사만 보입니다.
          </p>
          <p style={{ ...TYPE.caption2, color: '#7f7f87', lineHeight: 1.6, margin: `${SP[4]} 0 0` }}>
            지금 활동 중(응답 확인)인 관제사만 보입니다 — 접속만 하고 사라진(유령) 세션은 제외합니다.
          </p>
        </div>
        {/* 관제사 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP[8], padding: `0 ${SP[16]}` }}>
          {AWAY_OPERATORS.map((op) => {
            const on = sel === op.name;
            return (
              <div key={op.name} onClick={() => setSel(op.name)} style={{ display: 'flex', alignItems: 'center', gap: SP[12], padding: `${SP[12]}`, borderRadius: '8px', cursor: 'pointer', border: `1px solid ${on ? T.primary : '#2a2a30'}`, background: on ? 'rgba(0,102,255,0.12)' : 'transparent' }}>
                <Radio on={on} />
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, background: '#2a2a30', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...TYPE.caption1, fontWeight: W.bold, color: '#d4d4d8' }}>{op.initial}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...TYPE.label2, fontWeight: W.semibold, color: '#fff' }}>{op.name}</div>
                  <div style={{ ...TYPE.caption2, color: '#8a8a92' }}>{op.dept}</div>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4], flexShrink: 0 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.positive }} />
                  <span style={{ ...TYPE.caption1, fontWeight: W.medium, color: '#4ade80' }}>근무 중</span>
                </span>
              </div>
            );
          })}
        </div>
        {/* 푸터 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[16]}`, marginTop: SP[4] }}>
          <span style={{ ...TYPE.caption2, color: '#7f7f87', marginRight: 'auto' }}>근무 중 관제사가 없으면 목록이 비고 안내가 표시됩니다</span>
          <span onClick={onClose} style={{ ...btnBase, background: '#2a2a30', border: '1px solid #3a3a42', color: '#d4d4d8' }}>취소</span>
          <span onClick={() => { if (onApply) onApply(sel); onClose(); }} style={{ ...btnBase, background: T.primary, border: `1px solid ${T.primary}`, color: '#fff' }}>적용</span>
        </div>
      </div>
    </div>
  );
}

// 자리 비움 상태 오버레이 — 카메라 그리드를 어둡게 덮고 대리 관제사 안내 + 복귀 버튼.
function AwayOverlay({ operator, onRestore }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'rgba(6,6,9,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: SP[12], padding: SP[24], textAlign: 'center' }}>
      <span style={{ display: 'inline-flex', color: T.cautionary }}>
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="8" r="4" /><path d="M3 20c0-3.9 3.1-6 7-6 .8 0 1.6.1 2.3.3" /><path d="M16 15.5l5 5M21 15.5l-5 5" /></svg>
      </span>
      <div style={{ ...TYPE.title3, fontWeight: W.bold, color: '#fff' }}>자리 비움 상태입니다</div>
      <div style={{ ...TYPE.body2, color: '#c4c4cc', lineHeight: 1.5 }}>담당 이벤트를 <b style={{ color: T.primaryStrong, fontWeight: W.bold }}>{operator}</b> 관제사가 대신 받고 있습니다.</div>
      <div style={{ ...TYPE.caption1, color: '#8a8a92', lineHeight: 1.5 }}>돌아오면 아래 버튼(또는 사용자 메뉴 &lsquo;근무 중으로 전환&rsquo;)으로 해제하세요.</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[16]}`, borderRadius: '40px', background: 'rgba(30,212,90,0.12)', border: '1px solid rgba(30,212,90,0.4)', marginTop: SP[4] }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.positive} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        <span style={{ ...TYPE.caption1, fontWeight: W.medium, color: '#9fe9b8' }}>영상·감지는 계속 동작 중 · 이벤트 알림·표시만 대신 받는 관제사에게 전달</span>
      </div>
      <button type="button" onClick={onRestore} style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], height: '38px', padding: `0 ${SP[24]}`, marginTop: SP[8], borderRadius: '6px', background: T.primary, border: `1px solid ${T.primary}`, color: '#fff', ...TYPE.label2, fontWeight: W.semibold, cursor: 'pointer', fontFamily: T.font }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3 8-8" /><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" /></svg>
        복귀 (자리 비움 해제)
      </button>
    </div>
  );
}

export function PrevaxTitleBar({ datetime, warning, away, onApplyAway, onRestore }) {
  const [userMenu, setUserMenu] = useState(false);
  const [awayModal, setAwayModal] = useState(false);
  const MIc = ({ d, color }) => (
    <span style={{ width: '15px', height: '15px', flexShrink: 0, display: 'inline-flex', color: color || '#8a8a92' }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
    </span>
  );
  const item = { display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, ...TYPE.caption1, color: '#d4d4d8', cursor: 'pointer', whiteSpace: 'nowrap' };
  const hov = (e, on) => { e.currentTarget.style.background = on ? 'rgba(255,255,255,0.05)' : 'transparent'; };
  return (
    <div style={{ position: 'relative', height: '40px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${SP[12]}`, background: '#141417', borderBottom: '1px solid #000' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], minWidth: 0, flex: 1 }}>
        <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: `linear-gradient(135deg, ${T.primary}, ${T.primaryStrong})`, flexShrink: 0 }} />
        <span style={{ fontSize: '13px', fontWeight: W.bold, color: '#fff' }}>PREVAX 4</span>
        <span style={{ fontSize: '12px', color: '#6f6f77', whiteSpace: 'nowrap' }}>| 마스터 ( 최고 관리자 )</span>
      </div>
      {warning ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], background: 'rgba(255,169,56,0.14)', border: `1px solid ${T.cautionary}`, borderRadius: '6px', padding: `3px 5px 3px ${SP[8]}`, flexShrink: 0 }}>
          <Icon name="error" size={14} color={T.cautionary} />
          <span style={{ fontSize: '12px', fontWeight: W.semibold, color: T.cautionary }}>{warning}</span>
          <span style={{ fontSize: '11px', color: '#e8e8ec', background: '#33333a', borderRadius: '4px', padding: `${SP[2]} ${SP[8]}`, cursor: 'pointer' }}>관리</span>
        </div>
      ) : <span style={{ flexShrink: 0 }} />}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: SP[12], fontSize: '12px', color: '#bdbdc4', flex: 1 }}>
        <span style={{ display: 'inline-flex', gap: SP[4] }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: T.positive }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: T.positive }} />
        </span>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{datetime}</span>
        <span style={{ cursor: 'pointer' }}>한국어 ▾</span>
        {/* 계정 메뉴 트리거 */}
        <span onClick={() => setUserMenu((v) => !v)} title="계정" style={{ ...prevaxWinBtn, display: 'inline-flex', alignItems: 'center', color: away ? T.cautionary : userMenu ? T.primary : T.primaryStrong }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6.5 8-6.5s8 2.5 8 6.5" /></svg>
        </span>
        <span style={{ display: 'inline-flex', gap: SP[12], marginLeft: SP[4] }}>
          <span style={prevaxWinBtn}>—</span><span style={prevaxWinBtn}>▢</span><span style={prevaxWinBtn}>✕</span>
        </span>
      </div>
      {userMenu && <div onClick={() => setUserMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />}
      {userMenu && (
        <div style={{ position: 'absolute', top: '42px', right: '48px', zIndex: 50, width: '230px', background: '#1d1d22', border: '1px solid #2e2e35', borderRadius: '8px', boxShadow: '0 18px 48px rgba(0,0,0,0.6)', padding: `${SP[4]} 0`, overflow: 'hidden' }}>
          {away ? (
            <div style={item} onMouseEnter={(e) => hov(e, true)} onMouseLeave={(e) => hov(e, false)} onClick={() => { setUserMenu(false); if (onRestore) onRestore(); }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: T.positive, flexShrink: 0, boxShadow: `0 0 5px ${T.positive}` }} />
              <MIc d={<><path d="M9 11l3 3 8-8" /><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" /></>} color={T.positive} />
              <span style={{ flex: 1, color: '#9fe9b8', fontWeight: W.medium }}>근무 중으로 전환</span>
              <span style={{ ...TYPE.caption2, color: '#7f7f87' }}>자리 비움 해제</span>
            </div>
          ) : (
            <div style={item} onMouseEnter={(e) => hov(e, true)} onMouseLeave={(e) => hov(e, false)} onClick={() => { setUserMenu(false); setAwayModal(true); }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: T.cautionary, flexShrink: 0, boxShadow: `0 0 5px ${T.cautionary}` }} />
              <MIc d={<><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19c0-3 2.4-4.8 5.5-4.8s5.5 1.8 5.5 4.8" /><circle cx="17.5" cy="7" r="2" /></>} color={T.cautionary} />
              <span style={{ flex: 1, color: T.cautionary, fontWeight: W.medium }}>자리 비움</span>
              <span style={{ ...TYPE.caption2, color: '#7f7f87' }}>대신 받을 사람 선택</span>
            </div>
          )}
          <div style={item} onMouseEnter={(e) => hov(e, true)} onMouseLeave={(e) => hov(e, false)} onClick={() => setUserMenu(false)}>
            <MIc d={<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></>} />
            <span>사용자 정보 편집</span>
          </div>
          <div style={{ ...item, borderTop: '1px solid #2a2a30' }} onMouseEnter={(e) => hov(e, true)} onMouseLeave={(e) => hov(e, false)} onClick={() => setUserMenu(false)}>
            <MIc d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>} />
            <span>로그아웃</span>
          </div>
        </div>
      )}
      {awayModal && <AwayModal onClose={() => setAwayModal(false)} onApply={onApplyAway} />}
    </div>
  );
}

export function PrevaxTabBar({ active }) {
  const [tab, setTab] = useState(active);
  return (
    <div style={{ height: '32px', flexShrink: 0, display: 'flex', background: '#1a1a1f', borderBottom: '1px solid #2a2a30', padding: `0 ${SP[4]}` }}>
      {PREVAX_TABS.map((t) => {
        const on = t === tab;
        return (
          <div key={t} onClick={() => setTab(t)} style={{
            display: 'flex', alignItems: 'center', padding: `0 ${SP[12]}`, cursor: 'pointer', fontSize: '13px',
            fontWeight: on ? W.semibold : W.regular, color: on ? '#fff' : '#7f7f87',
            borderBottom: `2px solid ${on ? T.primary : 'transparent'}`,
          }}>{t}</div>
        );
      })}
    </div>
  );
}

// 데이터 패널 툴바 버튼 — 위계: primary(추가) / danger(삭제) / secondary(기본)
function Tbtn({ children, tone, onClick }) {
  const s = tone === 'primary'
    ? { background: T.primary, color: '#fff', border: `1px solid ${T.primary}` }
    : tone === 'danger'
    ? { background: 'transparent', color: T.error, border: '1px solid rgba(255,99,99,0.5)' }
    : tone === 'success'
    ? { background: 'transparent', color: '#4ade80', border: '1px solid rgba(74,222,128,0.45)' }
    : tone === 'ghost'
    ? { background: 'transparent', color: '#8a8a92', border: '1px solid #2e2e35' }
    : { background: '#2a2a30', color: '#d4d4d8', border: '1px solid #3a3a42' };
  return (
    <button type="button" onClick={onClick} style={{
      ...TYPE.caption1, fontWeight: tone === 'primary' ? W.semibold : W.medium, padding: `${SP[4]} ${SP[12]}`, borderRadius: '4px',
      cursor: 'pointer', fontFamily: T.font, whiteSpace: 'nowrap', ...s,
    }}>{children}</button>
  );
}

// 트리 그룹 행 (카메라 리스트) — 깊이별 위계: 상위는 굵고 밝게, 하위로 갈수록 약하게
function TreeRow({ depth, label }) {
  const tier = depth === 0
    ? { ...TYPE.label2, fontWeight: W.semibold, color: '#e4e4e8' }
    : depth === 1
    ? { ...TYPE.label2, fontWeight: W.regular, color: '#c4c4cc' }
    : { ...TYPE.caption1, fontWeight: W.regular, color: '#9a9aa2' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], padding: `${SP[4]} ${SP[4]}`, marginLeft: `${depth * 12}px`, cursor: 'pointer', userSelect: 'none', ...tier }}>
      <span style={{ width: '10px', fontSize: '8px', color: '#7f7f87' }}>▾</span>
      <span>{label}</span>
    </div>
  );
}

/**
 * Content badge (Foundation) — 상태/카테고리 라벨링용. leadingIcon(상태 도트) + 라벨,
 * border-radius 6px, padding 4/8(아이콘 시), accent는 status 컬러 tint 배경 + 테두리.
 */
function CBadge({ color, children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: SP[4],
      ...TYPE.caption1, fontWeight: W.semibold, color,
      background: `${color}1f`, border: `1px solid ${color}66`,
      borderRadius: '6px', padding: `${SP[4]} ${SP[8]}`, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span>{children}</span>
    </span>
  );
}

// 카메라 셀 좌상단 이벤트 배지 — CBadge(위험/경고/주의) 색 위계를 영상 오버레이용으로.
// 카메라명 pill과 동일한 박스 모델(패딩·라인하이트·pill 라운드)을 공유해 높이·좌우 여백을 맞춤.
// 이벤트 배지 — 등급색 컬러 채움 배지(동일 계열 그라데이션 셰인 + 흰 글씨). radius 6(정본 배지 계열).
function CamEventBadge({ ev, sz }) {
  if (!ev) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: SP[4],
      ...TYPE.label2, fontSize: sz.name, fontWeight: W.bold,
      padding: `${sz.padY || SP[2]} ${sz.evPad || SP[8]}`,
      background: `linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(0,0,0,0.18) 100%), ${ev.color}`,
      borderRadius: '6px', color: '#fff',
      whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(0,0,0,0.45)',
    }}>
      {ev.label}
    </span>
  );
}

// ── 정본 Content badge (패널/카드용) ─────────────────────────────────────
//  radius 6 · tint bg + border · leading dot/icon 옵션 · 높이 xs 20 / sm 24(기본) / md 28
//  padding 가로 8(아이콘/dot 有)·12(無), 세로는 높이로 흡수. solid=고강조(등급) 변형.
//  ⚠ 영상 위 오버레이 배지(카메라명·PTZ·CamEventBadge·팝업 상태칩)는 가독성용 어두운 알약으로 별도 유지.
// 각 톤: tint/tintTop(은은한 세로 그라데이션 스톱) · bd(테두리) · tx(텍스트) · base→deep(solid 동일계열 그라데이션 스톱)
const DS_BADGE_TONE = {
  neutral:    { tint: '#202024',               tintTop: '#26262c',               bd: '#2e2e35',               tx: '#d4d4d8', base: '#3a3a42',       deep: '#2a2a30' },
  accent:     { tint: 'rgba(0,102,255,0.14)',  tintTop: 'rgba(0,102,255,0.22)',  bd: 'rgba(0,102,255,0.5)',   tx: '#8fb8ff', base: T.primaryStrong, deep: T.primaryHeavy },
  positive:   { tint: 'rgba(30,212,90,0.14)',  tintTop: 'rgba(30,212,90,0.22)',  bd: 'rgba(30,212,90,0.42)',  tx: '#66e08f', base: T.positive,      deep: '#12A64A' },
  cautionary: { tint: 'rgba(255,169,56,0.16)', tintTop: 'rgba(255,169,56,0.24)', bd: 'rgba(255,169,56,0.48)', tx: '#ffc272', base: T.cautionary,    deep: '#EF8C00' },
  error:      { tint: 'rgba(255,99,99,0.16)',  tintTop: 'rgba(255,99,99,0.24)',  bd: 'rgba(255,99,99,0.5)',   tx: '#ff8f8f', base: T.error,         deep: '#E24242' },
};
const DS_BADGE_SIZE = {
  xs: { h: '20px', font: TYPE.caption2, ic: 11 },
  sm: { h: '24px', font: TYPE.caption1, ic: 13 },
  md: { h: '28px', font: TYPE.label2,   ic: 14 },
};
function DsBadge({ tone = 'neutral', solid = false, size = 'sm', icon, dot = false, iconColor, children }) {
  const c = DS_BADGE_TONE[tone] || DS_BADGE_TONE.neutral;
  const z = DS_BADGE_SIZE[size] || DS_BADGE_SIZE.sm;
  const hasLead = !!icon || dot;
  const fg = solid ? '#fff' : c.tx;
  // 동일 계열 그라데이션 — solid=고강조 대각선, tint=은은한 세로 셰인(색 의미 유지)
  const bg = solid
    ? `linear-gradient(135deg, ${c.base} 0%, ${c.deep} 100%)`
    : `linear-gradient(180deg, ${c.tintTop} 0%, ${c.tint} 100%)`;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4], height: z.h, padding: `0 ${hasLead ? SP[8] : SP[12]}`, borderRadius: '6px', border: `1px solid ${solid ? c.deep : c.bd}`, background: bg, ...z.font, fontWeight: W.bold, color: fg, whiteSpace: 'nowrap', boxSizing: 'border-box' }}>
      {dot && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: solid ? '#fff' : c.base, flexShrink: 0 }} />}
      {icon && <Icon name={icon} size={z.ic} color={iconColor || fg} />}
      {children}
    </span>
  );
}

// 영상 옵션 툴바(리뱀프) — 3축(객체/이벤트/보기일반) + 구분선, 라벨 왼쪽·스위치 오른쪽,
// ▾는 별개 메뉴 버튼으로 분리(HI-FI live-toolbar-revamp 근거). 색/타이포/간격은 DS 토큰.
const VIDEO_OPT_AXES = [
  { key: 'obj', items: [
    { label: '객체 필터', dd: true },
    { label: '객체 라벨' },
    { label: '객체 박스 모양', menu: true },
  ] },
  { key: 'evt', items: [
    { label: '이벤트 필터', dd: true },
    { label: '영역 강조' },
    { label: '채널 강조' },
  ] },
  { key: 'view', items: [
    { label: '분석 영역', dd: true },
    { label: '자동 순환', dd: true },
  ] },
];

// 이벤트 종류(array.xml tvi_event_group/tvi_event_list) — 6그룹, [이름, type]. HI-FI 근거.
const EVENT_GROUPS = [
  { g: '방범·보안(이벤트)', code: 256, items: [['침입', 258], ['움직임', 259], ['배회', 260], ['유기', 261], ['화재', 263], ['싸움', 265], ['위험', 266], ['주취자', 272], ['얼굴인식', 273], ['역진입', 275], ['혼잡도', 277]] },
  { g: '방범·보안(정보)', code: 512, items: [['지출입 카운팅', 513]] },
  { g: '교통(이벤트)', code: 4352, items: [['불법 주정차', 4353], ['불법 유턴', 4354], ['속도 위반', 4357], ['정지선 위반', 4358], ['무단횡단(공간적)', 4386], ['역주행', 4417], ['낙하물', 4420], ['교통약자', 4597]] },
  { g: '교통(정보)', code: 4608, items: [['교통량', 4625], ['평균속도', 4626], ['대기행렬', 4628]] },
  { g: '보행자(정보)', code: 4864, items: [['횡단보도 통행량', 4865], ['횡단보행자 점유', 5026]] },
  { g: '기타', code: 61440, items: [['쓰러짐', 61463]] },
];

// 체크박스 — 통일 규격(Primary 채움 + 흰 체크 / 부분선택 대시)
function PopCk({ state }) {
  return (
    <span style={{ width: '14px', height: '14px', borderRadius: '3px', flexShrink: 0, boxSizing: 'border-box', border: state === 'off' ? '1.5px solid #71717a' : 'none', background: state === 'off' ? 'transparent' : T.primary, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {state === 'on' && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
      {state === 'partial' && <span style={{ width: '7px', height: '2px', background: '#fff', borderRadius: '1px' }} />}
    </span>
  );
}

// "이벤트 종류 선택" 팝오버 — ▾(이벤트 필터) 클릭 시. 6그룹 2단 체크리스트(보기 필터, 검지 불간섭).
function EventTypePopover({ x, onClose }) {
  const allIds = EVENT_GROUPS.flatMap((g) => g.items.map((it) => it[1]));
  const [checked, setChecked] = useState(() => new Set(allIds));
  const toggle = (id) => setChecked((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleGroup = (g) => setChecked((s) => {
    const n = new Set(s); const ids = g.items.map((it) => it[1]);
    const allOn = ids.every((id) => n.has(id)); ids.forEach((id) => (allOn ? n.delete(id) : n.add(id))); return n;
  });
  const total = allIds.length, on = allIds.filter((id) => checked.has(id)).length;
  const btnBase = { height: '26px', padding: `0 ${SP[12]}`, borderRadius: '4px', ...TYPE.caption1, fontWeight: W.semibold, cursor: 'pointer', fontFamily: T.font, display: 'inline-flex', alignItems: 'center' };
  return (
    <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: '40px', left: `${x}px`, zIndex: 40, width: '520px', background: '#1d1d22', border: '1px solid #2e2e35', borderRadius: '10px', boxShadow: '0 24px 60px rgba(0,0,0,0.7)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #2a2a30' }}>
        <span style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff' }}>이벤트 종류 선택</span>
        <span style={{ ...TYPE.caption2, color: '#8a8a92', fontVariantNumeric: 'tabular-nums' }}>{on === total ? '전체 표시(거름 없음)' : `${on} / ${total} 선택`}</span>
      </div>
      <div className="prevax-scroll" style={{ maxHeight: '300px', overflowY: 'auto', padding: `${SP[8]} ${SP[12]}`, columnCount: 2, columnGap: SP[16] }}>
        {EVENT_GROUPS.map((g) => {
          const ids = g.items.map((it) => it[1]); const cOn = ids.filter((id) => checked.has(id)).length;
          const gstate = cOn === 0 ? 'off' : cOn === ids.length ? 'on' : 'partial';
          return (
            <div key={g.code} style={{ breakInside: 'avoid', marginBottom: SP[12] }}>
              <div onClick={() => toggleGroup(g)} style={{ display: 'flex', alignItems: 'center', gap: SP[8], cursor: 'pointer', padding: `${SP[4]} 0` }}>
                <PopCk state={gstate} />
                <span style={{ ...TYPE.caption1, fontWeight: W.bold, color: '#e4e4e8' }}>{g.g}</span>
              </div>
              {g.items.map(([nm, id]) => (
                <div key={id} onClick={() => toggle(id)} style={{ display: 'flex', alignItems: 'center', gap: SP[8], cursor: 'pointer', padding: `${SP[4]} 0 ${SP[4]} ${SP[16]}` }}>
                  <PopCk state={checked.has(id) ? 'on' : 'off'} />
                  <span style={{ ...TYPE.caption1, color: '#c4c4cc', flex: 1 }}>{nm}</span>
                  <span style={{ ...TYPE.caption2, color: '#6f6f77', fontVariantNumeric: 'tabular-nums' }}>{id}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, borderTop: '1px solid #2a2a30', background: '#19191e' }}>
        <span style={{ ...TYPE.caption2, color: '#8a8a92', marginRight: 'auto' }}>보기만 거르며 · 검지는 계속됨</span>
        <span onClick={() => setChecked(new Set(allIds))} style={{ ...btnBase, background: '#2a2a30', border: '1px solid #3a3a42', color: '#d4d4d8' }}>초기화</span>
        <span onClick={onClose} style={{ ...btnBase, background: T.primary, border: `1px solid ${T.primary}`, color: '#fff' }}>적용</span>
      </div>
    </div>
  );
}

function VideoOptionsToolbar({ isOn, onToggle }) {
  const [menu, setMenu] = useState(null); // { label, x } — ▾ 팝오버
  const wrapRef = useRef(null);
  const openDd = (label, e) => {
    e.stopPropagation();
    const wrap = wrapRef.current && wrapRef.current.getBoundingClientRect();
    const btn = e.currentTarget.getBoundingClientRect();
    if (!wrap) return;
    const x = Math.max(0, Math.min(btn.left - wrap.left, wrap.width - 528));
    setMenu((m) => (m && m.label === label ? null : { label, x }));
  };
  const clickable = typeof onToggle === 'function';
  const ddBtn = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '20px', flexShrink: 0, border: '1px solid #3a3a42', borderRadius: '4px', background: '#26262c', color: '#d4d4d8', lineHeight: 1, cursor: 'pointer' };
  const boxBtn = { display: 'inline-flex', alignItems: 'center', gap: SP[4], height: '24px', padding: `0 ${SP[8]}`, ...TYPE.caption1, fontWeight: W.medium, color: '#d4d4d8', background: '#2a2a30', border: '1px solid #3a3a42', borderRadius: '4px', cursor: 'pointer', fontFamily: T.font, whiteSpace: 'nowrap' };
  const Sw = ({ on }) => (
    <span style={{ width: '30px', height: '18px', borderRadius: '9px', flexShrink: 0, background: on ? T.primary : '#3a3a42', position: 'relative', transition: 'background 0.15s' }}>
      <span style={{ position: 'absolute', top: '2px', left: on ? '14px' : '2px', width: '14px', height: '14px', borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }} />
    </span>
  );
  return (
    <div ref={wrapRef} style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], height: '37px', padding: `0 ${SP[12]}`, borderBottom: '1px solid #2a2a30', background: '#16161a', overflow: 'hidden' }}>
        <span style={{ ...TYPE.label2, fontWeight: W.bold, color: T.primaryStrong, whiteSpace: 'nowrap', flexShrink: 0 }}>영상 옵션</span>
        {VIDEO_OPT_AXES.map((axis, ai) => (
          <div key={axis.key} style={{ display: 'flex', alignItems: 'center', gap: SP[8], flexShrink: 0 }}>
            {axis.items.map((o) => {
              if (o.menu) {
                return (
                  <span key={o.label} style={boxBtn}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
                    {o.label}<Icon name="arrow_drop_down" size={16} color="#8a8a92" />
                  </span>
                );
              }
              const on = isOn(o.label);
              const toggle = clickable ? () => onToggle(o.label) : undefined;
              const hasPop = o.label === '이벤트 필터';
              const openState = menu && menu.label === o.label;
              return (
                <div key={o.label} style={{ display: 'flex', alignItems: 'center', gap: SP[4], flexShrink: 0 }}>
                  <span onClick={toggle} style={{ ...TYPE.caption1, fontWeight: W.medium, color: on ? '#e4e4e8' : '#9a9aa2', whiteSpace: 'nowrap', cursor: clickable ? 'pointer' : 'default' }}>{o.label}</span>
                  <span onClick={toggle} style={{ display: 'inline-flex', cursor: clickable ? 'pointer' : 'default' }}><Sw on={on} /></span>
                  {o.dd && (
                    <span
                      onClick={hasPop ? (e) => openDd(o.label, e) : undefined}
                      style={{ ...ddBtn, ...(openState ? { background: 'rgba(0,102,255,0.18)', borderColor: T.primary, color: '#fff' } : {}) }}
                    ><Icon name="arrow_drop_down" size={22} color="currentColor" /></span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: SP[8], flexShrink: 0 }}>
          <span style={boxBtn}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="4" width="13" height="9" rx="1.5" /><path d="M9 17h0M6 17h6" /><rect x="14" y="9.5" width="7.5" height="6" rx="1.2" /></svg>
            다른 모니터에 창 생성
          </span>
          <span style={boxBtn}>이벤트 활성화</span>
        </div>
      </div>
      {menu && menu.label === '이벤트 필터' && <div onClick={() => setMenu(null)} style={{ position: 'fixed', inset: 0, zIndex: 39 }} />}
      {menu && menu.label === '이벤트 필터' && <EventTypePopover x={menu.x} onClose={() => setMenu(null)} />}
    </div>
  );
}

/**
 * PREVAX 4 GIS 관제 화면 — 실제 관제 콘솔을 디자인 시스템 토큰으로 재현.
 * 타이틀바 + 경고 배너 + 탭 + 카메라 리스트 트리 + (선택 시 이벤트 패널) + 라이트 GIS 맵 + 오버레이.
 */
function PrevaxGisScreen() {
  const cams = Array.from({ length: 16 }, (_, i) => `VMS_199_${String(i + 1).padStart(3, '0')}`);
  const [selected, setSelected] = useState(2);
  const camIndent = 3 * 12 + 12;
  const [evPanelOpen, setEvPanelOpen] = useState(true);
  const [evFilter, setEvFilter] = useState(null);
  const evScrollRef = useRef(null);
  const chipScrollRef = useRef(null);
  // 선택 카메라의 발생 이벤트 — 유형 혼합
  const camEvents = [
    { type: '배회', color: T.cautionary, ts: '12:42:02' },
    { type: '침입', color: T.error, ts: '12:38:51' },
    { type: '침입', color: T.error, ts: '12:30:14' },
    { type: '쓰러짐', color: '#F0436A', ts: '12:25:47' },
    { type: '쓰러짐', color: '#F0436A', ts: '12:18:33' },
    { type: '쓰러짐', color: '#F0436A', ts: '12:09:05' },
  ];
  const evCounts = camEvents.reduce((acc, e) => {
    const f = acc.find((x) => x.type === e.type);
    if (f) f.count += 1; else acc.push({ type: e.type, color: e.color, count: 1 });
    return acc;
  }, []);
  const filteredCamEvents = evFilter ? camEvents.filter((e) => e.type === evFilter) : camEvents;
  const chipBtn = { display: 'inline-flex', alignItems: 'center', gap: '5px', ...TYPE.caption2, fontWeight: W.semibold, color: '#9a9aa2', background: '#202024', border: '1px solid #2e2e35', borderRadius: '5px', padding: `3px ${SP[8]}`, cursor: 'pointer', fontFamily: T.font, whiteSpace: 'nowrap' };
  const chipBtnOn = (c) => ({ color: '#fff', background: '#33333a', border: `1px solid ${c}` });
  const scrollCards = (dir) => { if (evScrollRef.current) evScrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' }); };
  const scrollChips = (dir) => { if (chipScrollRef.current) chipScrollRef.current.scrollBy({ left: dir * 120, behavior: 'smooth' }); };
  const realtimeEvents = [
    { type: '배회', color: T.cautionary, time: '방금', cam: '본관 정문 앞 CAM_002', ts: '11:08:44' },
    { type: '화재', color: T.error, time: '1분전', cam: '창고 A동 CAM_011', ts: '11:07:51' },
    { type: '침입', color: T.error, time: '2분전', cam: '외곽 펜스 CAM_005', ts: '11:07:21' },
    { type: '쓰러짐', color: T.error, time: '4분전', cam: '통로 1 CAM_007', ts: '11:04:55' },
    { type: '배회', color: T.cautionary, time: '5분전', cam: '본관 정문 앞 CAM_002', ts: '11:03:12' },
    { type: '배회', color: T.cautionary, time: '7분전', cam: '주차장 입구 CAM_003', ts: '11:01:33' },
    { type: '배회', color: T.cautionary, time: '8분전', cam: '남쪽 출입구 CAM_009', ts: '11:00:03' },
  ];

  // 총 이벤트 현황 — 이벤트 유형별 발생 횟수 (Content badge, status 컬러로 심각도 구분)
  const eventStats = [
    { label: '배회', count: 36, color: T.cautionary },
    { label: '침입', count: 12, color: T.error },
    { label: '화재', count: 3, color: T.error },
  ];

  // 맵 오버레이 컨트롤 — Figma "Icon button"(아이콘 + 라벨). 아이콘 20px 흰색, 라벨 15px SemiBold 60% white.
  const mapControls = [
    { key: 'camera', icon: 'nest_cam_outdoor', label: '카메라' },
    { key: 'dark', icon: 'brightness_4', label: '다크 모드' },
    { key: 'route', icon: 'location_searching', label: '경로 테스트' },
  ];

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      <PrevaxTitleBar datetime="2026.06.08 11:26:32" />
      <PrevaxTabBar active="지도" />

      {/* ── 본문 ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 좌: 카메라 리스트 */}
        <div style={{ width: '230px', flexShrink: 0, background: '#1c1c21', borderRight: '1px solid #2a2a30', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: `${SP[12]} ${SP[12]} ${SP[8]}`, ...TYPE.label1, fontWeight: W.bold, color: '#fff' }}>총 이벤트 현황</div>
          {/* 이벤트 유형별 발생 횟수 — Content badge (라벨/숫자/단위 위계 분리) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP[4], padding: `0 ${SP[12]} ${SP[8]}` }}>
            {eventStats.map((e) => (
              <CBadge key={e.label} color={e.color}>
                <span style={{ fontWeight: W.medium }}>{e.label}</span>
                <span style={{ fontSize: '14px', fontWeight: W.bold, fontVariantNumeric: 'tabular-nums', marginLeft: '5px' }}>{e.count}</span>
                <span style={{ ...TYPE.caption2, fontWeight: W.regular, opacity: 0.7, marginLeft: '1px' }}>회</span>
              </CBadge>
            ))}
          </div>
          <div style={{ padding: `${SP[4]} ${SP[12]} ${SP[8]}` }}>
            <div style={{ ...TYPE.caption1, fontWeight: W.medium, color: '#8a8a92', marginBottom: SP[4] }}>카메라 리스트</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], height: '28px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px' }}>
              <input placeholder="" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: T.font, ...TYPE.caption1 }} />
              <Icon name="search" size={14} color="#6f6f77" />
            </div>
            {/* 카메라 이벤트 비활성화 알림 — 위계 낮춤(은은한 톤, 경고는 작은 아이콘 액센트로만) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], marginTop: SP[8], padding: `5px ${SP[8]}`, background: 'rgba(255,169,56,0.06)', border: '1px solid #2e2e35', borderRadius: '4px' }}>
              <Icon name="error" size={12} color={T.cautionary} style={{ opacity: 0.85 }} />
              <span style={{ ...TYPE.caption1, fontWeight: W.regular, color: '#9a9aa2', whiteSpace: 'nowrap' }}>3개 카메라 비활성화</span>
              <span style={{ marginLeft: 'auto', ...TYPE.caption2, fontWeight: W.medium, color: '#8a8a92', background: 'transparent', border: '1px solid #3a3a42', borderRadius: '4px', padding: `${SP[2]} ${SP[8]}`, cursor: 'pointer' }}>관리</span>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: `${SP[2]} ${SP[4]} ${SP[8]}` }}>
            <TreeRow depth={0} label="인천공항" />
            <TreeRow depth={1} label="외곽지역" />
            <TreeRow depth={2} label="test_199 [100]" />
            {cams.map((name, i) => {
              const n = i + 1;
              const on = selected === n;
              return (
                <div key={name} onClick={() => setSelected(n)} style={{
                  display: 'flex', alignItems: 'center', gap: SP[4], padding: `${SP[4]} ${SP[8]}`, marginLeft: `${camIndent}px`,
                  borderRadius: '4px', cursor: 'pointer',
                  background: on ? T.primary : 'transparent', color: on ? '#fff' : '#c4c4cc',
                }}>
                  <Icon name="nest_cam_outdoor" size={14} color={on ? '#fff' : '#9a9aa2'} />
                  <span style={{ ...TYPE.caption1, fontWeight: on ? W.semibold : W.regular, fontVariantNumeric: 'tabular-nums' }}>[{n}] {name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 선택 카메라 이벤트 패널 */}
        {selected && (
          <div style={{ width: '262px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {/* 패널 타이틀 */}
            <div style={{ padding: `${SP[12]} ${SP[16]}`, ...TYPE.label1, fontWeight: W.bold, color: '#fff' }}>
              [{selected}] VMS_199_{String(selected).padStart(3, '0')}
            </div>
            {/* 영상 프리뷰 (NO VIDEO) */}
            <div style={{ margin: `0 ${SP[16]} ${SP[16]}`, height: '128px', background: '#0b0b0d', border: '1px solid #2a2a30', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ ...TYPE.label2, fontWeight: W.semibold, color: '#5f5f67', letterSpacing: '0.12em' }}>NO VIDEO</span>
            </div>
            {/* 이벤트 내역 헤더 (개수) */}
            <div style={{ padding: `${SP[8]} ${SP[16]} ${SP[8]}`, borderTop: '1px solid #2a2a30', ...TYPE.caption1, fontWeight: W.medium, color: '#8a8a92' }}>
              이벤트 전체 내역 <span style={{ color: '#fff', fontWeight: W.semibold }}>{camEvents.length}건</span>
            </div>
            {/* 유형별 요약 칩 (클릭 = 필터, 가로 캐러셀) */}
            <div className="gis-ev-carousel" style={{ position: 'relative', margin: `0 ${SP[16]} ${SP[8]}` }}>
              <button type="button" className="gis-ev-nav sm left" onClick={() => scrollChips(-1)} aria-label="이전">
                <svg width={12} height={12} viewBox="0 0 20 20" fill="none"><path d="M13 15l-5-5 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" className="gis-ev-nav sm right" onClick={() => scrollChips(1)} aria-label="다음">
                <svg width={12} height={12} viewBox="0 0 20 20" fill="none"><path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <div ref={chipScrollRef} style={{ display: 'flex', alignItems: 'center', gap: SP[4], overflowX: 'auto', scrollbarWidth: 'none' }} className="gis-chip-scroll">
                <button type="button" onClick={() => setEvFilter(null)} style={{ ...chipBtn, flexShrink: 0, ...(evFilter === null ? chipBtnOn('#8a8a92') : {}) }}>전체 {camEvents.length}</button>
                {evCounts.map((c) => {
                  const active = evFilter === c.type;
                  return (
                    <button key={c.type} type="button" onClick={() => setEvFilter(active ? null : c.type)} style={{
                      ...chipBtn, flexShrink: 0, color: c.color,
                      background: active ? `${c.color}29` : `${c.color}14`,
                      border: `1px solid ${active ? c.color : `${c.color}4d`}`,
                    }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                      {c.type} <span style={{ fontWeight: W.bold, fontVariantNumeric: 'tabular-nums' }}>{c.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* 이벤트 항목 */}
            <div style={{ flex: 1, overflowY: 'auto', padding: `0 ${SP[12]} ${SP[12]}`, display: 'flex', flexDirection: 'column', gap: SP[8] }}>
              {filteredCamEvents.map((e, i) => (
                <div key={i} style={{ background: '#1c1c21', border: '1px solid #2a2a30', borderLeft: `3px solid ${e.color}`, borderRadius: '6px', padding: `${SP[8]} ${SP[12]}` }}>
                  <div style={{ ...TYPE.label2, fontWeight: W.bold, color: e.color }}>{e.type}</div>
                  <div style={{ ...TYPE.caption1, color: '#8a8a92', marginTop: SP[4], fontVariantNumeric: 'tabular-nums' }}>{e.ts} · Cam_{String(selected).padStart(3, '0')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 맵 (라이트 GIS) */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#e9ebe4' }}>
          <svg width="100%" height="100%" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
            {/* 강 / 녹지 */}
            <path d="M648 -20 L712 -20 L772 470 L708 470 Z" fill="#aed4e6" opacity="0.75" />
            <path d="M600 20 L690 0 L712 130 L624 158 Z" fill="#bfdaa6" opacity="0.85" />
            <rect x="70" y="300" width="130" height="95" rx="10" fill="#cfe3b6" opacity="0.7" />
            {/* 도로 케이싱 */}
            <g stroke="#d6d6cb" strokeWidth="13" strokeLinecap="round">
              <line x1="-20" y1="205" x2="650" y2="172" /><line x1="305" y1="-20" x2="345" y2="470" />
              <line x1="-20" y1="345" x2="610" y2="365" /><line x1="120" y1="-20" x2="165" y2="470" />
              <line x1="430" y1="-20" x2="470" y2="470" />
            </g>
            {/* 도로 */}
            <g stroke="#ffffff" strokeWidth="8" strokeLinecap="round">
              <line x1="-20" y1="205" x2="650" y2="172" /><line x1="305" y1="-20" x2="345" y2="470" />
              <line x1="-20" y1="345" x2="610" y2="365" /><line x1="120" y1="-20" x2="165" y2="470" />
              <line x1="430" y1="-20" x2="470" y2="470" />
            </g>
            {/* 건물 블록 */}
            {[[60,90],[150,70],[235,120],[360,95],[470,210],[200,235],[120,165],[300,300],[400,320],[520,90]].map(([x,y],i)=>(
              <rect key={i} x={x} y={y} width="58" height="42" rx="3" fill="#deded3" stroke="#cfcfc4" strokeWidth="1" />
            ))}
          </svg>

          {/* POI / 카메라 마커 */}
          {[['28%','30%',T.primary],['44%','52%','#E11D48'],['58%','40%',T.primary],['36%','64%','#7C3AED'],['50%','24%','#0EA5A0']].map(([l,t,c],i)=>(
            <div key={i} style={{ position: 'absolute', left: l, top: t, transform: 'translate(-50%,-50%)', width: '13px', height: '13px', borderRadius: '50%', background: c, boxShadow: '0 2px 5px rgba(0,0,0,0.35)', border: '2px solid #fff' }} />
          ))}

          {/* 우상단 컨트롤 — Figma Icon button (아이콘 + 라벨) */}
          <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: SP[8] }}>
            {mapControls.map((c) => (
              <button key={c.key} type="button" className="prevax-iconbtn" style={{ height: '26px', padding: `${SP[2]} ${SP[4]}`, gap: '3px' }}>
                <Icon name={c.icon} size={14} color="#ffffff" />
                <span style={{ fontSize: '12px', fontWeight: W.medium, letterSpacing: '-0.3px', color: 'rgba(255,255,255,0.6)' }}>{c.label}</span>
              </button>
            ))}
          </div>

          {/* 좌하단 스케일 / 좌표 */}
          <div style={{ position: 'absolute', right: '12px', bottom: evPanelOpen ? '136px' : '44px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: SP[4], color: '#3a3a3c', fontSize: '11px', transition: 'bottom 0.22s cubic-bezier(0.4,0,0.2,1)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: SP[4] }}>
              <div style={{ width: '70px', height: '5px', borderLeft: '2px solid #3a3a3c', borderRight: '2px solid #3a3a3c', borderBottom: '2px solid #3a3a3c' }} />
              <span>100m</span>
            </div>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>Zoom: 18 | 126.80327, 37.38044</span>
          </div>

          {/* 하단 실시간 이벤트 패널 */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(180deg, rgba(14,14,18,0.82) 0%, rgba(14,14,18,0.97) 100%)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderTop: '1px solid #2e2e36', boxShadow: '0 -8px 24px rgba(0,0,0,0.35)' }}>
            {/* 헤더 */}
            <div onClick={() => setEvPanelOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, cursor: 'pointer', userSelect: 'none' }}>
              <span className="gis-live-dot" />
              <span style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff', letterSpacing: '0.01em' }}>실시간 이벤트</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', ...TYPE.caption2, fontWeight: W.bold, color: '#fff', background: T.primary, borderRadius: '10px', padding: `1px ${SP[8]}`, fontVariantNumeric: 'tabular-nums', minWidth: '16px', justifyContent: 'center' }}>{realtimeEvents.length}</span>
              <button type="button" className="gis-ev-toggle" style={{ marginLeft: 'auto' }} onClick={(ev) => { ev.stopPropagation(); setEvPanelOpen(o => !o); }}>
                <span style={{ ...TYPE.caption1, fontWeight: W.medium }}>{evPanelOpen ? '접기' : '펼치기'}</span>
                <svg width={14} height={14} viewBox="0 0 20 20" fill="none" style={{ transform: evPanelOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1)' }}>
                  <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            {/* 카드 목록 (좌/우 플로팅 네비) */}
            {evPanelOpen && (
              <div className="gis-ev-carousel" style={{ position: 'relative' }}>
              <button type="button" className="gis-ev-nav left" onClick={() => scrollCards(-1)} aria-label="이전">
                <svg width={16} height={16} viewBox="0 0 20 20" fill="none"><path d="M13 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" className="gis-ev-nav right" onClick={() => scrollCards(1)} aria-label="다음">
                <svg width={16} height={16} viewBox="0 0 20 20" fill="none"><path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <div ref={evScrollRef} style={{ display: 'flex', gap: SP[8], padding: `0 ${SP[12]} ${SP[12]}`, overflowX: 'auto' }} className="prevax-scroll">
                {realtimeEvents.map((e, i) => (
                  <div key={i} className="gis-ev-card">
                    {/* 좌측 액센트 바 */}
                    <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: e.color, boxShadow: `0 0 10px ${e.color}99` }} />
                    {/* 상단: 유형 뱃지 + 상대 시간 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SP[12] }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', ...TYPE.caption2, fontWeight: W.bold, color: e.color, background: `${e.color}1f`, border: `1px solid ${e.color}59`, borderRadius: '5px', padding: `${SP[2]} ${SP[8]}` }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: e.color, flexShrink: 0 }} />
                        {e.type}
                      </span>
                      <span style={{ ...TYPE.caption2, fontWeight: W.medium, color: '#7a7a82' }}>{e.time}</span>
                    </div>
                    {/* 카메라 명 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], marginBottom: SP[4] }}>
                      <Icon name="nest_cam_outdoor" size={14} color="#9a9aa2" />
                      <span style={{ ...TYPE.caption1, fontWeight: W.medium, color: '#e4e4ea', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.cam}</span>
                    </div>
                    {/* 하단: 타임스탬프 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: SP[4] }}>
                      <Icon name="schedule" size={13} color="#5f5f67" />
                      <span style={{ ...TYPE.caption2, fontWeight: W.regular, color: '#7a7a82', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>{e.ts}</span>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PREVAX 4 설정(장비 관리) 화면 — GIS와 동일한 크롬(PrevaxTitleBar/PrevaxTabBar)·토큰·위계.
 * 설정 네비 + 분석기 목록 + 카메라 목록 + 가상 카메라 목록 + 외부 장비.
 */
function PrevaxSettingsScreen({ initialNav } = {}) {
  const nav = [
    { sec: '시스템 설정', items: ['장비 관리', '이벤트 정의', '스케줄 정의', '계정 관리', '데이터 보관기간 설정', '이벤트 관리'] },
    { sec: '환경 설정', items: ['알림 설정'] },
    { sec: '정보', items: ['프로그램 정보'] },
  ];
  const [navSel, setNavSel] = useState(initialNav || '장비 관리');
  const [anSel, setAnSel] = useState(new Set());
  const toggleAnSel = (i) => setAnSel((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const [evChecked, setEvChecked] = useState(new Set());
  const toggleEvCheck = (i) => setEvChecked((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const toggleAllEvCheck = (total) => setEvChecked((s) => s.size === total ? new Set() : new Set(Array.from({ length: total }, (_, i) => i)));
  const [evSort, setEvSort] = useState(null); // null | 'desc' | 'asc'
  const [camSel, setCamSel] = useState(new Set());
  const toggleCamSel = (i) => setCamSel((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const toggleAllCamSel = (total) => setCamSel((s) => s.size === total ? new Set() : new Set(Array.from({ length: total }, (_, i) => i)));
  const toggleEvSort = () => setEvSort((s) => s === 'desc' ? 'asc' : 'desc');

  const analyzers = [
    ['인천공항 분석서버', '112.216.142.34', 17, 5], ['분석기2', '1.1.1.1', 1, 2],
    ['분석기테스트', '1.1.1.2', 0, 11], ['분석기 TEST', '7.7.7.7', 1, 5],
    ['시흥보행연장TEST', '192.168.2.48', 4, 5], ['testing ttt', '1.1.1.12', 0, 3],
  ];
  const cameras = [
    ['SH0019C001', '192.168.0.180', '52', '80', '', '', 'SH0019C001'],
    ['SH0019C003', '192.168.0.180', '57', '80', '', '', 'SH0019C003'],
    ['SH0019C004', '192.168.0.180', '58', '80', '', '', 'SH0019C004'],
    ['SH0019C002', '192.168.0.180', '59', '80', '', '', 'SH0019C002'],
    ['화재01', '192.168.2.62', '60', '80', '', '', 'FIGHT_17'],
    ['화재02', '192.168.2.62', '61', '80', '', '', 'FIRE_18'],
    ['쓰러짐01', '192.168.2.62', '64', '8080', '', '', 'FIRE_21'],
    ['쓰러짐02', '192.168.2.62', '65', '80', 'idid', 'p****', 'FIRE_22'],
    ['침입01', '192.168.2.62', '66', '80', '', '', 'FIRE_23'],
    ['침입02', '192.168.2.62', '67', '80', '', '', 'FIRE_24'],
    ['카메라 web 1', '2.2.2.2', '77', '22', '', '', '카메라 web 1'],
    ['ROI40', '192.168.0.180', '96', '80', 'youare', 'p****', 'ROI40'],
    ['PTZ Cam', '192.168.1.247', '97', '80', 'admin', 'p****', 'PTZCam'],
  ];
  const externals = [
    ['SH0019_2_01', '신호등', 'RS-232', '핀텔', 'Traffic Light', '사용함', '2026.05.08 13:52:03'],
    ['스피커 web 2', '스피커', '', '인터엠', 'MA-106A', '사용함', '2026.05.20 12:29:27'],
    ['스피커 web 3', '스피커', '', '인터엠', 'MA-106A', '사용함', '2026.05.08 13:21:32'],
    ['스피커 web 1', '스피커', '', '인터엠', 'MA-106A', '사용함', '2026.05.08 13:23:02'],
    ['SH0019_3_05', '신호등', '없음', '핀텔', 'Traffic Light', '사용함', '2026.05.08 13:51:35'],
  ];
  // 이벤트 관리 — [사용유무, 카메라 번호, 카메라 명, ROI 명, 이벤트명, ON/OFF, 스케줄]
  const [events, setEvents] = useState([
    ['사용함', '52', 'SH0019C001', 'ROI_01', '배회', true, '24시간'],
    ['사용함', '57', 'SH0019C003', 'ROI_02', '침입', true, '야간(18~06)'],
    ['사용함', '58', 'SH0019C004', '정문 구역', '쓰러짐', true, '24시간'],
    ['사용함', '59', 'SH0019C002', '로비', '화재', true, '24시간'],
    ['미사용', '60', '화재01', '주차장 A', '화재', false, '24시간'],
    ['사용함', '61', '화재02', '주차장 B', '싸움', false, '주간(06~18)'],
    ['사용함', '64', '쓰러짐01', '통로 1', '쓰러짐', true, '24시간'],
    ['사용함', '66', '침입01', '외곽 펜스', '침입', true, '야간(18~06)'],
    ['미사용', '96', 'ROI40', '횡단보도', '횡단대기', false, '주간(06~18)'],
    ['사용함', '97', 'PTZ Cam', '교차로', '무단횡단', true, '24시간'],
  ]);
  const toggleEvOnOff = () => {
    if (evChecked.size === 0) return;
    setEvents((prev) => prev.map((ev, i) => evChecked.has(i) ? [...ev.slice(0, 5), !ev[5], ev[6]] : ev));
  };
  // 분석 서버 리스트 (이벤트 관리 좌측 바) — 실제 분석기 + 패딩(슬라이드바 노출용)
  const analysisServers = ['인천공항 분석서버', '분석기2', '분석기테스트', '분석기 TEST', '시흥보행연장TEST', 'testing ttt']
    .concat(Array.from({ length: 30 }, (_, i) => `분석서버 ${String(i + 7).padStart(2, '0')}`));

  const panel = { background: '#16161a', border: '1px solid #2a2a30', borderRadius: '6px', display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' };
  const panelHead = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #2a2a30', flexWrap: 'wrap' };
  const panelTitle = { ...TYPE.label1, fontWeight: W.bold, color: SEM.label.strong };
  const th = { ...TYPE.caption1, fontWeight: W.medium, color: '#8a8a92', textAlign: 'left', padding: `${SP[8]} ${SP[8]}`, borderBottom: '1px solid #2a2a30', whiteSpace: 'nowrap', position: 'sticky', top: 0, background: '#16161a' };
  const td = { ...TYPE.caption1, color: '#c4c4cc', padding: `${SP[4]} ${SP[8]}`, whiteSpace: 'nowrap', borderBottom: '1px solid #232329' };
  const toolbar = { display: 'flex', alignItems: 'center', gap: SP[4], flexWrap: 'wrap' };

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      <PrevaxTitleBar datetime="2026.06.05 15:12:12" />
      <PrevaxTabBar active="설정" />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 설정 네비 */}
        <div style={{ width: '186px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #2a2a30', overflowY: 'auto', padding: `${SP[8]} 0` }}>
          {nav.map((g) => (
            <div key={g.sec} style={{ marginBottom: SP[8] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]} ${SP[4]}`, ...TYPE.label2, fontWeight: W.semibold, color: '#e8e8ec' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: T.primary }} />
                {g.sec}
              </div>
              {g.items.map((it) => {
                const on = navSel === it;
                return (
                  <div key={it} onClick={() => setNavSel(it)} style={{
                    padding: `${SP[4]} ${SP[12]} ${SP[4]} ${SP[32]}`, ...TYPE.label2, cursor: 'pointer',
                    background: on ? 'rgba(0, 102, 255,0.18)' : 'transparent',
                    borderLeft: `2px solid ${on ? T.primary : 'transparent'}`,
                    color: on ? '#fff' : '#9a9aa2', fontWeight: on ? W.semibold : W.regular,
                  }}>{it}</div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 메인 */}
        <div style={{ flex: 1, display: 'flex', gap: SP[12], padding: SP[12], minWidth: 0 }}>
          {navSel === '이벤트 관리' ? (
            <>
            {/* 분석 서버 리스트 (좌측 바) */}
            <div style={{ ...panel, width: '240px', flexShrink: 0 }}>
              <div style={panelHead}><span style={panelTitle}>분석 서버</span></div>
              <div style={{ flex: 1, overflowY: 'auto' }} className="prevax-scroll">
                {analysisServers.map((s, i) => {
                  const on = anSel.has(i);
                  return (
                    <div key={i} onClick={() => toggleAnSel(i)} style={{
                      padding: `${SP[8]} ${SP[12]}`, cursor: 'pointer', ...TYPE.caption1, whiteSpace: 'nowrap',
                      background: on ? 'rgba(0, 102, 255,0.18)' : 'transparent',
                      borderLeft: `2px solid ${on ? T.primary : 'transparent'}`,
                      color: on ? '#fff' : '#c4c4cc', fontWeight: on ? W.semibold : W.regular,
                      display: 'flex', alignItems: 'center', gap: SP[8],
                    }}>
                      <span style={{ width: '13px', height: '13px', borderRadius: '3px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${on ? T.primary : '#33333b'}`, background: on ? T.primary : '#141417' }}>
                        {on && (
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                        )}
                      </span>
                      <span style={{ display: 'inline-flex', flexShrink: 0 }}>
                        <Icon name="analyzer" size={14} color={on ? T.primaryStrong : '#7f7f87'} />
                      </span>
                      {s}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* 이벤트 관리 — 이벤트 목록 관리 표 */}
            <div style={{ ...panel, flex: 1, minWidth: 0 }}>
              <div style={panelHead}>
                <span style={panelTitle}>이벤트 관리 <span style={{ ...TYPE.caption1, fontWeight: W.regular, color: '#8a8a92', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>선택된 이벤트 : {evChecked.size} / {events.length}</span></span>
                <div style={toolbar}><Tbtn tone="ghost">저장</Tbtn></div>
              </div>
              <div style={{ ...toolbar, padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #232329' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], width: '200px', height: '26px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px' }}>
                  <input placeholder="" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: T.font, ...TYPE.caption1 }} />
                  <Icon name="search" size={13} color="#6f6f77" />
                </div>
                <div style={{ ...toolbar, flex: 1, justifyContent: 'flex-end' }}>
                  {['표 설정', '스케줄 추가', '스케줄 수정'].map((b) => <Tbtn key={b} tone={b === '스케줄 추가' ? 'primary' : undefined}>{b}</Tbtn>)}
                  <Tbtn tone="success" onClick={toggleEvOnOff}>ON / OFF</Tbtn>
                </div>
              </div>
              <div style={{ flex: 1, overflow: 'auto' }} className="prevax-scroll">
                {(() => {
                  const indexed = events.map((ev, i) => ({ ev, i }));
                  const sorted = evSort
                    ? [...indexed].sort((a, b) => evSort === 'desc' ? (b.ev[5] ? 1 : 0) - (a.ev[5] ? 1 : 0) : (a.ev[5] ? 1 : 0) - (b.ev[5] ? 1 : 0))
                    : indexed;
                  return (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>
                    <th style={{ ...th, width: '32px', cursor: 'pointer' }} onClick={() => toggleAllEvCheck(events.length)}>
                      {(() => { const on = evChecked.size === events.length && events.length > 0; return (
                        <span style={{ width: '13px', height: '13px', borderRadius: '3px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${on ? T.primary : '#33333b'}`, background: on ? T.primary : '#141417' }}>
                          {on && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
                        </span>
                      ); })()}
                    </th>
                    {['사용유무', '카메라 번호', '카메라 명', 'ROI 명', '이벤트명'].map((h) => <th key={h} style={th}>{h}</th>)}
                    <th style={{ ...th, cursor: 'pointer', userSelect: 'none' }} onClick={toggleEvSort}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4] }}>
                        <span style={{ color: evSort === 'desc' ? '#4ade80' : '#8a8a92' }}>ON</span>
                        <span style={{ color: '#5a5a62' }}>/</span>
                        <span style={{ color: evSort === 'asc' ? '#4ade80' : '#8a8a92' }}>OFF</span>
                        <svg width={12} height={12} viewBox="0 0 20 20" fill="none" style={{ transform: 'rotate(90deg)', flexShrink: 0 }}>
                          <path d="M7.25081 14.4167C6.92865 14.7388 6.40631 14.7388 6.08415 14.4167L2.37459 10.7071C1.98406 10.3166 1.98406 9.68342 2.37459 9.29289L6.07373 5.59375C6.40165 5.26583 6.93331 5.26583 7.26123 5.59375C7.58915 5.92167 7.58915 6.45333 7.26123 6.78125L4.72875 9.31373C4.33823 9.70425 4.33823 10.3374 4.72875 10.7279L7.25081 13.25C7.57298 13.5722 7.57298 14.0945 7.25081 14.4167Z" fill={evSort === 'desc' ? '#4ade80' : '#4a4a52'} />
                          <path d="M13.9279 14.4063C13.6 14.7342 13.0683 14.7342 12.7404 14.4063C12.4125 14.0783 12.4125 13.5467 12.7404 13.2188L15.2729 10.6863C15.6634 10.2957 15.6634 9.66258 15.2729 9.27206L12.7508 6.75C12.4286 6.42783 12.4286 5.9055 12.7508 5.58333C13.073 5.26117 13.5953 5.26117 13.9175 5.58333L17.627 9.29289C18.0176 9.68342 18.0176 10.3166 17.627 10.7071L13.9279 14.4063Z" fill={evSort === 'asc' ? '#4ade80' : '#4a4a52'} />
                        </svg>
                      </span>
                    </th>
                    <th style={th}>스케줄</th>
                  </tr></thead>
                  <tbody>
                    {sorted.map(({ ev, i }) => (
                      <tr key={i} onClick={() => toggleEvCheck(i)} style={{ cursor: 'pointer', background: evChecked.has(i) ? 'rgba(0, 102, 255,0.15)' : 'transparent' }}>
                        <td style={{ ...td, width: '32px' }}>
                          <span style={{ width: '13px', height: '13px', borderRadius: '3px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${evChecked.has(i) ? T.primary : '#33333b'}`, background: evChecked.has(i) ? T.primary : '#141417' }}>
                            {evChecked.has(i) && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
                          </span>
                        </td>
                        <td style={{ ...td, color: ev[0] === '사용함' ? '#00A9FF' : '#6f6f77' }}>{ev[0]}</td>
                        <td style={{ ...td, fontVariantNumeric: 'tabular-nums' }}>{ev[1]}</td>
                        <td style={{ ...td, color: '#e4e4e8' }}>{ev[2]}</td>
                        <td style={td}>{ev[3]}</td>
                        <td style={{ ...td, color: '#e4e4e8', fontWeight: W.medium }}>{ev[4]}</td>
                        <td style={td}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4] }}>
                            <Icon name="cycle" size={16} color={ev[5] ? '#4ade80' : '#6f6f77'} />
                            <span style={{ color: ev[5] ? '#4ade80' : '#6f6f77', fontWeight: W.medium }}>{ev[5] ? 'ON' : 'OFF'}</span>
                          </span>
                        </td>
                        <td style={td}>{ev[6]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                  );
                })()}
              </div>
            </div>
            </>
          ) : (
          <>
          {/* 분석기 목록 */}
          <div style={{ ...panel, width: '620px', flexShrink: 0 }}>
            {/* 제목 + 시각 (위) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #232329' }}>
              <span style={panelTitle}>분석기 목록</span>
              <span style={{ ...TYPE.caption1, color: '#8a8a92', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>2026.06.05 15:12:10 ⟳</span>
            </div>
            {/* 검색창 + 버튼 (아래) */}
            <div style={panelHead}>
              <div style={{ width: '200px', display: 'flex', alignItems: 'center', gap: SP[4], height: '26px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px' }}>
                <input placeholder="" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: T.font, ...TYPE.caption1 }} />
                <Icon name="search" size={13} color="#6f6f77" />
              </div>
              <div style={{ ...toolbar, marginLeft: 'auto', justifyContent: 'flex-end' }}>{['관리', '불러오기', '내보내기', '추가', '수정', '삭제'].map((b) => <Tbtn key={b} tone={b === '추가' ? 'primary' : b === '삭제' ? 'danger' : undefined}>{b}</Tbtn>)}</div>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['분석기 명', '분석기 IP', '사용유무', '카메라', '장비', '운영 상태'].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {analyzers.map((a, i) => {
                    const on = anSel.has(i);
                    return (
                      <tr key={i} onClick={() => toggleAnSel(i)} style={{ cursor: 'pointer', background: on ? 'rgba(0, 102, 255,0.22)' : 'transparent' }}>
                        <td style={{ ...td, color: on ? '#fff' : '#d4d4d8', fontWeight: on ? W.semibold : W.regular }}>{a[0]}</td>
                        <td style={{ ...td, fontVariantNumeric: 'tabular-nums' }}>{a[1]}</td>
                        <td style={{ ...td, color: '#00A9FF' }}>사용함</td>
                        <td style={{ ...td, fontVariantNumeric: 'tabular-nums' }}>{a[2]}</td>
                        <td style={{ ...td, fontVariantNumeric: 'tabular-nums' }}>{a[3]}</td>
                        <td style={{ ...td, color: T.error, fontWeight: W.semibold }}>에러</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 우측 컬럼: 카메라 목록 + 가상 카메라 + 외부 장비 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: SP[12], minWidth: 0 }}>
            {/* 카메라 목록 */}
            <div style={{ ...panel, flex: 1.6 }}>
              <div style={panelHead}>
                <span style={panelTitle}>카메라 목록 <span style={{ ...TYPE.caption1, fontWeight: W.regular, color: '#8a8a92', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>선택된 카메라 : {camSel.size} / {cameras.length}</span></span>
                <div style={{ ...toolbar, gap: SP[12] }}>
                  {/* 카메라 암호 일괄 변경 — 불러오기/내보내기를 하위 기능으로 포함하는 그룹 */}
                  <div style={{ display: 'inline-flex', alignItems: 'stretch', border: '1px solid #2e2e35', borderRadius: '4px', overflow: 'hidden' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: `0 ${SP[8]}`, background: '#202024', ...TYPE.caption1, fontWeight: W.medium, color: '#bdbdc4', whiteSpace: 'nowrap', borderRight: '1px solid #2e2e35' }}>카메라 암호 일괄 변경</span>
                    <button type="button" style={{ ...TYPE.caption1, fontWeight: W.medium, color: '#8a8a92', background: 'transparent', border: 'none', padding: `${SP[4]} ${SP[12]}`, cursor: 'pointer', fontFamily: T.font, whiteSpace: 'nowrap' }}>불러오기</button>
                    <span style={{ width: '1px', background: '#2e2e35' }} />
                    <button type="button" style={{ ...TYPE.caption1, fontWeight: W.medium, color: '#8a8a92', background: 'transparent', border: 'none', padding: `${SP[4]} ${SP[12]}`, cursor: 'pointer', fontFamily: T.font, whiteSpace: 'nowrap' }}>내보내기</button>
                  </div>
                  <Tbtn tone="ghost">분석기 되돌리기</Tbtn>
                </div>
              </div>
              <div style={{ ...toolbar, padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #232329' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], width: '200px', height: '26px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px' }}>
                  <input placeholder="" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: T.font, ...TYPE.caption1 }} />
                  <Icon name="search" size={13} color="#6f6f77" />
                </div>
                <div style={{ ...toolbar, flex: 1, justifyContent: 'flex-end' }}>
                  {['표 설정', '복사하기', '불러오기', '내보내기', '이동', '추가', '수정', '삭제'].map((b) => <Tbtn key={b} tone={b === '추가' ? 'primary' : b === '삭제' ? 'danger' : undefined}>{b}</Tbtn>)}
                </div>
              </div>
              <div style={{ flex: 1, overflow: 'auto' }} className="prevax-scroll">
                <table style={{ width: '100%', minWidth: '1180px', borderCollapse: 'collapse' }}>
                  <thead><tr>
                    <th style={{ ...th, width: '24px', cursor: 'pointer' }} onClick={() => toggleAllCamSel(cameras.length)}>
                      {(() => { const on = camSel.size === cameras.length && cameras.length > 0; return (
                        <span style={{ width: '13px', height: '13px', borderRadius: '3px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${on ? T.primary : '#33333b'}`, background: on ? T.primary : '#141417' }}>
                          {on && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
                        </span>
                      ); })()}
                    </th>
                    {['등록 유형', '카메라 번호', '카메라 명', '카메라 IP', '카메라 아이디', '포트', '아이디', '비밀번호', '제조사', '카메라 고정 ID', '스트리밍 프로필'].map((h) => <th key={h} style={th}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {cameras.map((c, i) => (
                      <tr key={i} onClick={() => toggleCamSel(i)} style={{ cursor: 'pointer', background: camSel.has(i) ? 'rgba(0, 102, 255,0.15)' : 'transparent' }}>
                        <td style={td}>
                          <span style={{ width: '13px', height: '13px', borderRadius: '3px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${camSel.has(i) ? T.primary : '#33333b'}`, background: camSel.has(i) ? T.primary : '#141417' }}>
                            {camSel.has(i) && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
                          </span>
                        </td>
                        <td style={{ ...td, color: T.positive }}>정상</td>
                        <td style={td}></td>
                        <td style={{ ...td, color: '#e4e4e8' }}>{c[0]}</td>
                        <td style={{ ...td, fontVariantNumeric: 'tabular-nums' }}>{c[1]}</td>
                        <td style={{ ...td, fontVariantNumeric: 'tabular-nums' }}>{c[2]}</td>
                        <td style={{ ...td, fontVariantNumeric: 'tabular-nums' }}>{c[3]}</td>
                        <td style={td}>{c[4]}</td>
                        <td style={td}>{c[5]}</td>
                        <td style={td}></td>
                        <td style={td}>{c[6]}</td>
                        <td style={td}>profile1</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 가상 카메라 목록 */}
            <div style={{ ...panel, height: '92px' }}>
              <div style={panelHead}>
                <span style={panelTitle}>가상 카메라 목록</span>
                <div style={toolbar}>{['추가', '수정', '삭제'].map((b) => <Tbtn key={b} tone={b === '추가' ? 'primary' : b === '삭제' ? 'danger' : undefined}>{b}</Tbtn>)}</div>
              </div>
              <div style={{ flex: 1, overflow: 'auto' }} className="prevax-scroll">
                <div style={{ display: 'flex', minWidth: '1180px', ...TYPE.caption1, color: '#8a8a92', padding: `${SP[4]} ${SP[8]}` }}>
                  {['가상 카메라 명', '가상 카메라 아이디', '방향', '변경일자'].map((h) => <div key={h} style={{ flex: 1 }}>{h}</div>)}
                </div>
              </div>
            </div>

            {/* 외부 장비 */}
            <div style={{ ...panel, flex: 0.8 }}>
              <div style={panelHead}>
                <span style={panelTitle}>외부장비 목록</span>
                <div style={toolbar}>{['추가', '수정', '삭제'].map((b) => <Tbtn key={b} tone={b === '추가' ? 'primary' : b === '삭제' ? 'danger' : undefined}>{b}</Tbtn>)}</div>
              </div>
              <div style={{ flex: 1, overflow: 'auto' }} className="prevax-scroll">
                <table style={{ width: '100%', minWidth: '1180px', borderCollapse: 'collapse' }}>
                  <thead><tr>{['장비 명', '장비 종류', 'I/F', '업체 명', '모델 명', '위치', '용도', '사용유무', '변경일자'].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {externals.map((e, i) => (
                      <tr key={i} style={{ background: i === 0 ? 'rgba(0, 102, 255,0.22)' : 'transparent' }}>
                        <td style={{ ...td, color: i === 0 ? '#fff' : '#d4d4d8', fontWeight: i === 0 ? W.semibold : W.regular }}>{e[0]}</td>
                        <td style={td}>{e[1]}</td>
                        <td style={td}>{e[2]}</td>
                        <td style={td}>{e[3]}</td>
                        <td style={td}>{e[4]}</td>
                        <td style={td}></td>
                        <td style={td}></td>
                        <td style={{ ...td, color: '#00A9FF' }}>{e[5]}</td>
                        <td style={{ ...td, fontVariantNumeric: 'tabular-nums' }}>{e[6]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * PREVAX 4 이력조회(시스템 변경 이력) 화면 — Settings 화면과 동일한 타이틀바·탭 크롬 공유.
 * 좌측 서브 네비 + 상단 필터 바 + 변경 이력 테이블(좌) + 상세 작업 내용 속성 그리드(우)의 마스터-디테일 구성.
 */
function PrevaxHistoryScreen() {
  const subNav = ['시스템 변경 이력', '사용자 접속 이력'];
  const [navSel, setNavSel] = useState('시스템 변경 이력');
  const [sel, setSel] = useState(0);

  // 변경 이력 행: [작업 구분, 변경 구분, 작업내용, 작업자 명, 작업 시간, 대상, 대상 위치]
  const rows = [
    ['장비 관리', '추가', '카메라 추가', '마스터', '2026.06.05 09:43:46', 'PTZ Cam(192.168.1.247)', '인천공항 분석서버'],
    ['지역 정보 관리', '추가', '카메라 추가', '마스터', '2026.06.05 09:44:02', 'PTZ Cam/PTZ Cam', 'SH0020'],
    ['장비 관리', '수정', '카메라 수정', '마스터', '2026.06.05 09:45:32', 'PTZ Cam(192.168.1.247)', '인천공항 분석서버'],
    ['장비 관리', '수정', '카메라 수정', '마스터', '2026.06.05 09:50:37', 'ROI40(192.168.0.180)', '인천공항 분석서버'],
    ['지역 정보 관리', '삭제', '카메라 삭제', '마스터', '2026.06.05 10:15:12', 'SH-CAM1/SH-CAM1', '보행신호연장'],
    ['지역 정보 관리', '삭제', '카메라 삭제', '마스터', '2026.06.05 10:15:12', 'SH-CAM2/SH-CAM2', '보행신호연장'],
    ['지역 정보 관리', '삭제', '카메라 삭제', '마스터', '2026.06.05 10:15:12', 'SH-CAM3/SH-CAM3', '보행신호연장'],
    ['지역 정보 관리', '삭제', '카메라 삭제', '마스터', '2026.06.05 10:15:12', 'SH-CAM4/SH-CAM4', '보행신호연장'],
    ['지역 정보 관리', '추가', '카메라 추가', '마스터', '2026.06.05 10:15:23', 'SH-CAM1/SH-CAM1', 'SH0019'],
    ['지역 정보 관리', '추가', '카메라 추가', '마스터', '2026.06.05 10:15:23', 'SH-CAM2/SH-CAM2', 'SH0019'],
    ['지역 정보 관리', '추가', '카메라 추가', '마스터', '2026.06.05 10:15:23', 'SH-CAM3/SH-CAM3', 'SH0019'],
    ['지역 정보 관리', '추가', '카메라 추가', '마스터', '2026.06.05 10:15:23', 'SH-CAM4/SH-CAM4', 'SH0019'],
  ];

  // 상세 작업 내용: [속성, 이전, 현재] — 카메라 추가(PTZ Cam)이므로 이전 값은 비어 있음
  const detail = [
    ['프로토콜', '', '수동입력'], ['재생 영상 선택', '', '1'], ['카메라 번호', '', ''],
    ['카메라 명', '', 'PTZ Cam'], ['카메라 IP', '', '192.168.1.247'], ['포트', '', '80'],
    ['아이디', '', 'admin'], ['비밀번호', '', 'p****'], ['제조사', '', ''],
    ['인증방식', '', 'Digest-Auth'], ['카메라 고정 ID', '', 'PTZCam'], ['사용유무', '', '사용함'],
    ['스트림1-주소', '', 'stream1'], ['스트림1-포트', '', '554'], ['스트림1-연결 종류', '', 'TCP'],
    ['스트림2-주소', '', ''], ['스트림2-포트', '', ''], ['스트림2-연결 종류', '', ''],
    ['패키지 목록', '', '선별관제'], ['카메라 디코더', '', 'GPU'],
    ['분석기스트림1-주소', '', '97/stream_1'], ['분석기스트림1-포트', '', '8554'], ['분석기스트림1-연결 종류', '', 'TCP'],
    ['분석기스트림2-주소', '', '97/stream_2'], ['분석기스트림2-포트', '', '8554'], ['분석기스트림2-연결 종류', '', 'TCP'],
    ['PTZ 지원여부', '', '사용함'], ['재생 영상 선택', '', '1'],
    ['HLS1 프로토콜', '', ''], ['HLS1 IP', '', ''], ['HLS1 주소', '', ''], ['HLS1 포트', '', ''],
    ['HLS2 프로토콜', '', ''], ['HLS2 IP', '', ''], ['HLS2 주소', '', ''], ['HLS2 포트', '', ''],
    ['VMS 프로토콜', '', ''], ['VMS IP', '', ''], ['아이디', '', ''], ['비밀번호', '', ''], ['주소', '', ''], ['포트', '', ''],
  ];

  const panel = { background: '#16161a', border: '1px solid #2a2a30', borderRadius: '6px', display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' };
  const panelHead = { display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #2a2a30', minHeight: '43px', boxSizing: 'border-box' };
  const panelTitle = { ...TYPE.label1, fontWeight: W.bold, color: SEM.label.strong };
  const th = { ...TYPE.caption1, fontWeight: W.medium, color: '#8a8a92', textAlign: 'left', padding: `${SP[8]} ${SP[8]}`, borderBottom: '1px solid #2a2a30', whiteSpace: 'nowrap', position: 'sticky', top: 0, background: '#16161a' };
  const td = { ...TYPE.caption1, color: '#c4c4cc', padding: `${SP[4]} ${SP[8]}`, whiteSpace: 'nowrap', borderBottom: '1px solid #232329' };
  // 상세 속성 그리드 — 세로 구분선 포함
  const dth = { ...th, borderRight: '1px solid #2a2a30' };
  const dtd = { ...TYPE.caption1, padding: `${SP[4]} ${SP[8]}`, whiteSpace: 'nowrap', borderBottom: '1px solid #232329', borderRight: '1px solid #232329' };

  // 필터 컨트롤 공통 스타일
  const lbl = { ...TYPE.caption1, color: '#9a9aa2', whiteSpace: 'nowrap' };
  const ctl = { display: 'flex', alignItems: 'center', gap: SP[4], height: '28px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px', ...TYPE.caption1, color: '#d4d4d8', fontFamily: T.font, cursor: 'pointer', whiteSpace: 'nowrap', boxSizing: 'border-box' };
  const caret = <span style={{ marginLeft: 'auto', paddingLeft: SP[4], fontSize: '8px', color: '#7f7f87' }}>▾</span>;
  const Dd = ({ value, w }) => <div style={{ ...ctl, width: w }}>{value}{caret}</div>;

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      <PrevaxTitleBar datetime="2026.06.05 15:12:56" />
      <PrevaxTabBar active="이력조회" />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 서브 네비 */}
        <div style={{ width: '186px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #2a2a30', padding: `${SP[8]} 0` }}>
          {subNav.map((it) => {
            const on = navSel === it;
            return (
              <div key={it} onClick={() => setNavSel(it)} style={{
                padding: `${SP[8]} ${SP[16]}`, ...TYPE.label2, cursor: 'pointer',
                background: on ? 'rgba(0, 102, 255,0.18)' : 'transparent',
                borderLeft: `2px solid ${on ? T.primary : 'transparent'}`,
                color: on ? '#fff' : '#9a9aa2', fontWeight: on ? W.semibold : W.regular,
              }}>{it}</div>
            );
          })}
        </div>

        {/* 메인 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
          {/* 필터 바 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP[8], padding: SP[16], borderBottom: '1px solid #232329' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
              <span style={lbl}>작업 구분</span><Dd value="전체" w="260px" />
              <span style={{ ...lbl, marginLeft: SP[12] }}>변경 구분</span><Dd value="전체" w="120px" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], flexWrap: 'wrap' }}>
              <span style={lbl}>시작 일시</span>
              <div style={{ ...ctl, width: '128px' }}>2026.06.05<Icon name="calendar_today" size={13} color="#6f6f77" style={{ marginLeft: 'auto' }} /></div>
              <Dd value="00" w="56px" /><Dd value="00" w="56px" />
              <span style={{ ...lbl, marginLeft: SP[12] }}>종료 일시</span>
              <div style={{ ...ctl, width: '128px' }}>2026.06.05<Icon name="calendar_today" size={13} color="#6f6f77" style={{ marginLeft: 'auto' }} /></div>
              <Dd value="15" w="56px" /><Dd value="11" w="56px" />
              <div style={{ display: 'flex', gap: SP[4], marginLeft: SP[12] }}>
                {['오늘', '어제', '3일', '초기화'].map((b) => <Tbtn key={b}>{b}</Tbtn>)}
                <Tbtn tone="primary">검색</Tbtn>
              </div>
            </div>
          </div>

          {/* 콘텐츠: 변경 이력 테이블(좌) + 상세 작업 내용(우) */}
          <div style={{ flex: 1, display: 'flex', gap: SP[12], padding: SP[12], minHeight: 0, minWidth: 0 }}>
            {/* 변경 이력 테이블 */}
            <div style={{ ...panel, flex: 1.8, minWidth: 0 }}>
              <div style={{ ...panelHead, justifyContent: 'space-between' }}>
                <span style={panelTitle}>조회 이력</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], width: '240px', height: '26px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px' }}>
                  <input placeholder="" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: T.font, ...TYPE.caption1 }} />
                  <Icon name="search" size={13} color="#6f6f77" />
                  <span style={{ fontSize: '8px', color: '#7f7f87' }}>▾</span>
                </div>
              </div>
              <div style={{ flex: 1, overflow: 'auto' }} className="prevax-scroll">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>
                    <th style={{ ...th, width: '108px' }}>작업 구분</th>
                    <th style={{ ...th, width: '70px' }}>변경 구분</th>
                    <th style={{ ...th, width: '90px' }}>작업내용</th>
                    <th style={{ ...th, width: '72px' }}>작업자 명</th>
                    <th style={{ ...th, width: '148px' }}>작업 시간</th>
                    <th style={th}>대상</th>
                    <th style={{ ...th, width: '128px' }}>대상 위치</th>
                  </tr></thead>
                  <tbody>
                    {rows.map((r, i) => {
                      const on = sel === i;
                      return (
                        <tr key={i} onClick={() => setSel(i)} style={{ cursor: 'pointer', background: on ? 'rgba(0, 102, 255,0.22)' : 'transparent' }}>
                          <td style={{ ...td, color: on ? '#fff' : '#d4d4d8', fontWeight: on ? W.semibold : W.regular }}>{r[0]}</td>
                          <td style={{ ...td, padding: `${SP[4]} ${SP[8]}` }}>
                            {(() => {
                              // 변경 구분 → Color.Status 토큰 + 유형별 기호 (색 외 식별 보강, 색각 이상 대응)
                              //  추가=Positive(+) · 수정=Cautionary(✎) · 삭제=Native(−)
                              const map = {
                                '추가': { color: T.positive,   sym: '+' }, // #1ED45A
                                '수정': { color: T.cautionary, sym: '✎' }, // #FFA938
                                '삭제': { color: T.error,      sym: '−' }, // #FF6363
                              };
                              const s = map[r[1]] ?? { color: '#9a9aa2', sym: '•' };
                              return (
                                <span style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                                  padding: `${SP[2]} ${SP[8]}`, borderRadius: '3px',
                                  background: `${s.color}22`, border: `1px solid ${s.color}59`,
                                  ...TYPE.caption2, fontWeight: W.semibold, color: s.color,
                                  letterSpacing: '0.03em', whiteSpace: 'nowrap',
                                }}>
                                  <span style={{ fontWeight: W.bold, lineHeight: 1, flexShrink: 0 }}>{s.sym}</span>
                                  {r[1]}
                                </span>
                              );
                            })()}
                          </td>
                          <td style={td}>{r[2]}</td>
                          <td style={td}>{r[3]}</td>
                          <td style={{ ...td, fontVariantNumeric: 'tabular-nums' }}>{r[4]}</td>
                          <td style={{ ...td, color: on ? '#e8e8ec' : '#c4c4cc' }}>{r[5]}</td>
                          <td style={td}>{r[6]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 상세 작업 내용 */}
            <div style={{ ...panel, flex: 1, minWidth: 0 }}>
              <div style={panelHead}>
                <span style={panelTitle}>상세 작업 내용</span>
              </div>
              <div style={{ flex: 1, overflow: 'auto' }} className="prevax-scroll">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>
                    <th style={{ ...dth, width: '150px' }}>속성</th>
                    <th style={dth}>이전</th>
                    <th style={{ ...dth, borderRight: 'none' }}>현재</th>
                  </tr></thead>
                  <tbody>
                    {detail.map((d, i) => (
                      <tr key={i}>
                        <td style={{ ...dtd, color: '#9a9aa2' }}>{d[0]}</td>
                        <td style={{ ...dtd, color: '#8a8a92' }}>{d[1]}</td>
                        <td style={{ ...dtd, borderRight: 'none', color: '#d4d4d8' }}>{d[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PREVAX 4 통계보고서 화면 — 좌측 검색 조건 패널 + 우측 리포트 뷰어(툴바 / 빈 캔버스 / 페이지·줌 바).
 * 기존 화면과 동일한 타이틀바·탭 크롬, 토큰, 트리/체크박스/버튼 위계를 공유.
 */
function PrevaxStatsScreen() {
  const [itab, setItab] = useState('이벤트');
  const [unit, setUnit] = useState('15분별');
  const [evSel, setEvSel] = useState(['쓰러짐']);

  const ctl = { display: 'flex', alignItems: 'center', height: '26px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px', ...TYPE.caption1, color: '#d4d4d8', fontFamily: T.font, cursor: 'pointer', whiteSpace: 'nowrap', boxSizing: 'border-box' };
  const Dd = ({ value, w }) => <div style={{ ...ctl, width: w, justifyContent: 'space-between' }}>{value}<span style={{ fontSize: '8px', color: '#7f7f87', marginLeft: SP[4] }}>▾</span></div>;
  const DateF = ({ value }) => <div style={{ ...ctl, width: '116px', justifyContent: 'space-between' }}>{value}<Icon name="calendar_today" size={13} color="#6f6f77" /></div>;

  // Radio — 디자인 가이드 control-radio Small 규격(외곽 16·점 6·라벨 13·간격 6)
  // 선택 시 외곽 원 전체 #0066FF 채움 + 가운데 흰 점, 비선택 2px #71717A 테두리
  const Radio = ({ label }) => {
    const on = unit === label;
    return (
      <span onClick={() => setUnit(label)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', ...TYPE.label2, color: on ? '#fff' : '#bdbdc4', whiteSpace: 'nowrap' }}>
        <span style={{ width: '16px', height: '16px', flexShrink: 0, borderRadius: '50%', boxSizing: 'border-box', border: on ? `1px solid ${T.primary}` : '2px solid #71717A', background: on ? T.primary : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          {on && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
        </span>
        {label}
      </span>
    );
  };

  // 이벤트 유형 토글 버튼 (빠른 기간 버튼과 동일한 Tbtn 스타일, 선택 시 primary)
  const events = ['전체', '배회', '침입', '쓰러짐', '화재', '싸움', '불법 주정차', '횡단대기', '무단횡단(공간적)', '보행신호연장'];
  const toggleEv = (e) => setEvSel((s) => (s.includes(e) ? s.filter((x) => x !== e) : [...s, e]));
  const EvBtn = ({ label }) => {
    const on = evSel.includes(label);
    return (
      <button type="button" onClick={() => toggleEv(label)} style={{
        display: 'inline-flex', alignItems: 'center', gap: SP[4],
        ...TYPE.caption1, fontWeight: on ? W.semibold : W.medium, padding: `${SP[4]} ${SP[8]}`, borderRadius: '4px',
        cursor: 'pointer', fontFamily: T.font, whiteSpace: 'nowrap',
        background: on ? T.primary : '#2a2a30', color: on ? '#fff' : '#d4d4d8', border: `1px solid ${on ? T.primary : '#3a3a42'}`,
      }}>
        <Icon name="check" size={16} color={on ? '#fff' : '#9a9aa2'} />
        {label}
      </button>
    );
  };

  const sectionHdr = (label) => (
    <div style={{ ...TYPE.label2, fontWeight: W.bold, color: '#00A9FF', textAlign: 'center', padding: `${SP[8]} 0`, borderTop: '1px solid #2a2a30', borderBottom: '1px solid #2a2a30' }}>{label}</div>
  );

  const tree = [
    { d: 0, tri: 'down', chk: true, label: '인천공항 분석서버', sel: true },
    { d: 1, tri: 'down', chk: true, label: '스쿨존 1' },
    { d: 2, tri: 'down', chk: true, label: 'SH0019 [8]' },
    { d: 3, tri: 'right', chk: true, cam: true, label: 'SH0019C002' },
    { d: 3, tri: 'right', chk: true, cam: true, label: 'SH0019C003' },
    { d: 3, tri: 'right', chk: true, cam: true, label: 'SH0019C004' },
    { d: 3, tri: 'right', chk: true, cam: true, label: 'SH0019C001' },
    { d: 3, tri: 'right', chk: true, cam: true, label: 'SH-CAM1' },
    { d: 3, tri: 'right', chk: true, cam: true, label: 'SH-CAM2' },
    { d: 3, tri: 'right', chk: true, cam: true, label: 'SH-CAM3' },
    { d: 3, tri: 'right', chk: true, cam: true, label: 'SH-CAM4' },
    { d: 3, plain: true, label: 'testtesttesttesttest' },
    { d: 0, tri: 'down', chk: true, label: '분석기추가테스트' },
    { d: 1, tri: 'down', chk: true, label: '테스트 1' },
    { d: 2, tri: 'down', chk: true, label: 'SH0020 [2]' },
    { d: 3, tri: 'right', chk: true, cam: true, label: 'ROI40' },
    { d: 3, tri: 'right', chk: true, cam: true, label: 'PTZ Cam' },
    { d: 0, tri: 'down', label: '시흥보행연장test' },
    { d: 1, tri: 'down', label: '시흥' },
    { d: 2, plain: true, label: '보행신호연장' },
    { d: 0, tri: 'down', label: 'testing ttt' },
    { d: 1, tri: 'down', label: 'test detail' },
    { d: 2, plain: true, label: 'test section' },
  ];
  const triGlyph = (t) => (t === 'down' ? '▾' : t === 'right' ? '▸' : '');

  // 리포트 뷰어 툴바 아이콘 (feather 스타일), 그룹 사이 구분선
  const tIcon = (children) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
  const toolGroups = [
    [tIcon(<><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>),
     tIcon(<><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></>)],
    [tIcon(<><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="9" x2="9" y2="21" /></>),
     tIcon(<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />)],
    [tIcon(<><polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" /></>),
     tIcon(<polyline points="15 18 9 12 15 6" />),
     tIcon(<polyline points="9 18 15 12 9 6" />),
     tIcon(<><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></>)],
    [tIcon(<><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></>),
     tIcon(<><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></>)],
    [tIcon(<><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></>),
     tIcon(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>)],
  ];
  const flatTools = [];
  toolGroups.forEach((grp, gi) => {
    if (gi > 0) flatTools.push({ divider: true });
    grp.forEach((ic) => flatTools.push({ icon: ic }));
  });

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      <PrevaxTitleBar datetime="2026.06.05 15:13:18" />
      <PrevaxTabBar active="통계보고서" />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 좌: 검색 조건 패널 */}
        <div style={{ width: '430px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* 내부 탭 */}
          <div style={{ display: 'flex', flexShrink: 0, borderBottom: '1px solid #2a2a30', background: '#1a1a1f', padding: `0 ${SP[4]}` }}>
            {['이벤트', '교통량', '통행량'].map((t) => {
              const on = itab === t;
              return (
                <div key={t} onClick={() => setItab(t)} style={{
                  padding: `${SP[8]} ${SP[16]}`, cursor: 'pointer', ...TYPE.label2,
                  fontWeight: on ? W.semibold : W.regular, color: on ? '#fff' : '#7f7f87',
                  borderBottom: `2px solid ${on ? T.primary : 'transparent'}`, marginBottom: '-1px',
                }}>{t}</div>
              );
            })}
          </div>

          {/* 스크롤 영역 */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }} className="prevax-scroll">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${SP[8]} ${SP[12]}`, background: '#15151a', borderBottom: '1px solid #2a2a30', ...TYPE.caption1, fontWeight: W.semibold, color: '#cfcfd6' }}>
              검색 조건 <span style={{ fontSize: '8px', color: '#7f7f87' }}>▴</span>
            </div>

            <div style={{ padding: SP[12] }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: SP[12], marginBottom: SP[8] }}>
                {['15분별', '시간별', '일별', '월별'].map((u) => <Radio key={u} label={u} />)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: SP[4], marginBottom: SP[12] }}>
                {['30분', '1시간', '2시간', '3시간', '6시간'].map((b) => <Tbtn key={b}>{b}</Tbtn>)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], marginBottom: SP[4] }}>
                <span style={{ ...TYPE.caption1, color: '#9a9aa2', width: '50px', flexShrink: 0 }}>시작 일시</span>
                <DateF value="2026.06.05" /><Dd value="13" w="46px" /><Dd value="45" w="46px" /><Dd value="00" w="46px" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: SP[4] }}>
                <span style={{ ...TYPE.caption1, color: '#9a9aa2', width: '50px', flexShrink: 0 }}>종료 일시</span>
                <DateF value="2026.06.05" /><Dd value="14" w="46px" /><Dd value="15" w="46px" /><Dd value="00" w="46px" />
              </div>
            </div>

            {sectionHdr('이벤트')}
            <div style={{ padding: SP[12], display: 'flex', flexWrap: 'wrap', gap: SP[4] }}>
              {events.map((e) => <EvBtn key={e} label={e} />)}
            </div>

            {sectionHdr('장비')}
            <div style={{ padding: `${SP[12]} ${SP[12]} ${SP[4]}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], height: '28px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px' }}>
                <input placeholder="카메라 검색" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: T.font, ...TYPE.caption1 }} />
                <Icon name="search" size={14} color="#6f6f77" />
              </div>
            </div>
            <div style={{ padding: `${SP[2]} ${SP[4]} ${SP[12]}` }}>
              {tree.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '5px', padding: `3px ${SP[4]}`, paddingLeft: `${6 + r.d * 16}px`,
                  cursor: 'pointer', borderRadius: '4px', background: r.sel ? 'rgba(0, 102, 255,0.22)' : 'transparent',
                  ...TYPE.caption1, color: r.sel ? '#fff' : (r.plain ? '#8a8a92' : '#c4c4cc'),
                }}>
                  <span style={{ width: '9px', fontSize: '8px', color: '#8a8a92', flexShrink: 0 }}>{triGlyph(r.tri)}</span>
                  {r.chk && (
                    <span style={{ width: '13px', height: '13px', borderRadius: '3px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${r.sel ? T.primary : '#33333b'}`, background: r.sel ? T.primary : '#141417' }}>
                      {r.sel && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
                    </span>
                  )}
                  {r.cam && <Icon name="nest_cam_outdoor" size={13} color={r.sel ? '#fff' : '#9a9aa2'} />}
                  <span style={{ fontWeight: r.sel ? W.semibold : W.regular, whiteSpace: 'nowrap' }}>{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 푸터 버튼 */}
          <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, borderTop: '1px solid #2a2a30', background: '#15151a' }}>
            <Tbtn>초기화</Tbtn>
            <Tbtn tone="primary">검색</Tbtn>
          </div>
        </div>

        {/* 우: 리포트 뷰어 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, background: '#0e0e10' }}>
          {/* 툴바 */}
          <div style={{ height: '44px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: SP[2], padding: `0 ${SP[8]}`, background: '#1a1a1f', borderBottom: '1px solid #2a2a30' }}>
            {flatTools.map((t, i) => (t.divider
              ? <span key={i} style={{ width: '1px', height: '20px', background: '#2e2e35', margin: `0 ${SP[4]}` }} />
              : <button key={i} type="button" className="prevax-toolbtn">{t.icon}</button>
            ))}
          </div>
          {/* 리포트 캔버스 (빈 상태) */}
          <div style={{ flex: 1, minHeight: 0 }} />
          {/* 하단 페이지·줌 바 */}
          <div style={{ height: '34px', flexShrink: 0, borderTop: '1px solid #2a2a30', background: '#15151a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${SP[12]}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], ...TYPE.caption1, color: '#9a9aa2' }}>
              Page:
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '34px', height: '20px', background: '#0e0e10', border: '1px solid #2e2e35', borderRadius: '3px', color: '#d4d4d8', fontVariantNumeric: 'tabular-nums' }}>0</span>
              / 0
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], ...TYPE.caption1, color: '#9a9aa2' }}>
              <span style={{ color: '#d4d4d8', fontVariantNumeric: 'tabular-nums' }}>100%</span>
              <span style={{ cursor: 'pointer', fontSize: '14px', lineHeight: 1 }}>−</span>
              <div style={{ width: '120px', height: '4px', background: '#2e2e35', borderRadius: '2px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '40%', top: '50%', transform: 'translate(-50%,-50%)', width: '11px', height: '11px', borderRadius: '50%', background: T.primary, border: '2px solid #15151a' }} />
              </div>
              <span style={{ cursor: 'pointer', fontSize: '14px', lineHeight: 1 }}>+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PREVAX 4 선별관제 모니터링 화면 — 좌측 검색 조건 패널 + 우측 위험도 3밴드(위험/경고/주의).
 * 기존 화면과 동일한 타이틀바·탭 크롬, 토큰, 드롭다운/체크박스/버튼 위계를 공유.
 * 각 밴드는 색상 사이드바(세로 라벨) + 이벤트 유형 칩 헤더 + 이벤트 카드 영역으로 구성.
 */
function PrevaxSelectiveScreen() {
  const [chkAction, setChkAction] = useState(true);
  const [chkNoAction, setChkNoAction] = useState(true);
  const [away, setAway] = useState(null); // 자리 비움 상태(대리 관제사명 or null)

  const panel = { background: '#16161a', border: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' };
  const ctl = { display: 'flex', alignItems: 'center', height: '28px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px', ...TYPE.caption1, color: '#d4d4d8', fontFamily: T.font, cursor: 'pointer', whiteSpace: 'nowrap', boxSizing: 'border-box' };
  const rowLabel = { ...TYPE.caption1, color: '#9a9aa2', width: '56px', flexShrink: 0 };

  // 검색 조건 체크박스 (조치 여부) — 이벤트 활성화(CS)와 통일(13×13 사각, primary 채움 + 흰 체크)
  const Chk = ({ on, onClick, children }) => (
    <span onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', ...TYPE.caption1, color: on ? '#fff' : '#9a9aa2', whiteSpace: 'nowrap' }}>
      <span style={{ width: '13px', height: '13px', borderRadius: '3px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${on ? T.primary : '#33333b'}`, background: on ? T.primary : '#141417' }}>
        {on && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
      </span>
      {children}
    </span>
  );

  // 위험도 밴드 정의 — 색상은 상태 위계(위험>경고>주의)에 따라 채도/명도 하강.
  // 이벤트 유형별 발생 횟수는 GIS '총 이벤트 현황'과 동일한 Content badge 위계로 표기.
  const bands = [
    { label: '위험', color: '#F0436A', events: [{ label: '화재', count: 3 }, { label: '싸움', count: 1 }, { label: '무단횡단(공간적)', count: 2 }] },
    { label: '경고', color: '#C9847A', events: [{ label: '침입', count: 12 }, { label: '쓰러짐', count: 5 }, { label: '불법 주정차', count: 8 }] },
    { label: '주의', color: '#F5EFE0', events: [{ label: '배회', count: 36 }, { label: '횡단대기', count: 21 }] },
  ];
  // 밴드 색이 밝으면 세로 라벨 글자를 어둡게 — 대비 확보
  const isLight = (hex) => { const n = parseInt(hex.slice(1), 16); return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) > 165; };

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      <PrevaxTitleBar datetime="2026.06.05 15:12:12" away={away} onApplyAway={setAway} onRestore={() => setAway(null)} />
      <PrevaxTabBar active="선별관제" />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 좌측 검색 조건 패널 */}
        <div style={{ width: '320px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: `${SP[8]} ${SP[12]} ${SP[8]}`, ...TYPE.label1, fontWeight: W.bold, color: '#fff' }}>검색 조건</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP[8], padding: `${SP[4]} ${SP[12]} ${SP[12]}`, borderBottom: '1px solid #232329' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
              <span style={rowLabel}>등급</span>
              <div style={{ ...ctl, flex: 1, justifyContent: 'space-between' }}>전체,주의,경고,위험<span style={{ fontSize: '8px', color: '#7f7f87', marginLeft: SP[4] }}>▾</span></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
              <span style={rowLabel}>이벤트</span>
              <div style={{ ...ctl, flex: 1, justifyContent: 'space-between' }}>전체,배회,침입,쓰러짐,화재…<span style={{ fontSize: '8px', color: '#7f7f87', marginLeft: SP[4] }}>▾</span></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[16] }}>
              <span style={rowLabel}>조치 여부</span>
              <Chk on={chkAction} onClick={() => setChkAction((v) => !v)}>조치</Chk>
              <Chk on={chkNoAction} onClick={() => setChkNoAction((v) => !v)}>미조치</Chk>
            </div>
            <div style={{ display: 'flex', gap: SP[8], marginTop: SP[2] }}>
              <button type="button" style={{ flex: 1, height: '30px', ...TYPE.caption1, fontWeight: W.medium, color: '#d4d4d8', background: '#2a2a30', border: '1px solid #3a3a42', borderRadius: '4px', cursor: 'pointer', fontFamily: T.font }}>초기화</button>
              <button type="button" style={{ flex: 1, height: '30px', ...TYPE.caption1, fontWeight: W.semibold, color: '#fff', background: T.primary, border: `1px solid ${T.primary}`, borderRadius: '4px', cursor: 'pointer', fontFamily: T.font }}>일괄처리</button>
            </div>
            {/* 분析기 연결 끊김 알림 — 위계 낮춤(은은한 톤, 경고는 작은 아이콘 액센트로만) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], marginTop: SP[2], padding: `5px ${SP[8]}`, background: 'rgba(255,169,56,0.06)', border: '1px solid #2e2e35', borderRadius: '4px' }}>
              <Icon name="error" size={12} color={T.cautionary} style={{ opacity: 0.85 }} />
              <span style={{ ...TYPE.caption1, fontWeight: W.regular, color: '#9a9aa2', whiteSpace: 'nowrap' }}>3대 분석기 연결 끊김</span>
              <span style={{ marginLeft: 'auto', ...TYPE.caption2, fontWeight: W.medium, color: '#8a8a92', background: 'transparent', border: '1px solid #3a3a42', borderRadius: '4px', padding: `${SP[2]} ${SP[8]}`, cursor: 'pointer' }}>관리</span>
            </div>
          </div>
          <div style={{ padding: `${SP[8]} ${SP[12]}`, ...TYPE.caption1, color: '#8a8a92' }}>
            최근 30분 이벤트 <span style={{ color: '#bdbdc4', fontWeight: W.semibold }}>(0건)</span>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }} className="prevax-scroll">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', ...TYPE.caption1, color: '#5a5a62' }}>
              표시할 이벤트가 없습니다
            </div>
          </div>
        </div>

        {/* 우측 위험도 3밴드 */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', gap: SP[8], padding: SP[8], minWidth: 0 }}>
          {bands.map((b) => (
            <div key={b.label} style={{ ...panel, flex: 1, borderRadius: '6px', flexDirection: 'row' }}>
              {/* 색상 사이드바 + 세로 라벨 */}
              <div style={{
                width: '28px', flexShrink: 0, background: b.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                writingMode: 'vertical-rl', textOrientation: 'upright',
                ...TYPE.label2, fontWeight: W.bold, color: isLight(b.color) ? '#1a1a1f' : '#fff', letterSpacing: '0.1em',
              }}>{b.label}</div>
              {/* 본문: 칩 헤더 + 이벤트 카드 영역 */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], flexWrap: 'wrap', padding: `${SP[8]} ${SP[12]}`, background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid #232329' }}>
                  {b.events.map((e) => (
                    <CBadge key={e.label} color={b.color}>
                      <span style={{ fontWeight: W.medium }}>{e.label}</span>
                      <span style={{ fontSize: '14px', fontWeight: W.bold, fontVariantNumeric: 'tabular-nums', marginLeft: '5px' }}>{e.count}</span>
                      <span style={{ ...TYPE.caption2, fontWeight: W.regular, opacity: 0.7, marginLeft: '1px' }}>회</span>
                    </CBadge>
                  ))}
                </div>
                <div style={{ flex: 1, minHeight: 0, background: '#202027' }} />
              </div>
            </div>
          ))}
          {away && <AwayOverlay operator={away} onRestore={() => setAway(null)} />}
        </div>

        {/* 우측 상세정보 (접힌 패널) */}
        <div style={{
          width: '26px', flexShrink: 0, background: '#16161a', borderLeft: '1px solid #2a2a30',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          writingMode: 'vertical-rl', textOrientation: 'upright',
          ...TYPE.caption1, fontWeight: W.medium, color: '#8a8a92', letterSpacing: '0.15em', cursor: 'pointer',
        }}>상세정보</div>
      </div>
    </div>
  );
}

/**
 * PREVAX 4 선별관제 — 자리비움 "대리 수신자" 화면. 부재 관제사(김서연)의 담당 이벤트를
 * 대리 수신자(박민지)가 위험/경고/주의 3밴드 이벤트 카드로 처리. 대리 수신 이벤트에 배지 표기.
 */
function PrevaxAwayReceiverScreen() {
  // 좌측 검색 조건 패널 — 선별관제 모니터링(PrevaxSelectiveScreen)과 동일 규격·컨트롤로 통일
  const [chkAction, setChkAction] = useState(true);
  const [chkNoAction, setChkNoAction] = useState(true);
  const ctl = { display: 'flex', alignItems: 'center', height: '28px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px', ...TYPE.caption1, color: '#d4d4d8', fontFamily: T.font, cursor: 'pointer', whiteSpace: 'nowrap', boxSizing: 'border-box' };
  const rowLabel = { ...TYPE.caption1, color: '#9a9aa2', width: '56px', flexShrink: 0 };
  const Chk = ({ on, onClick, children }) => (
    <span onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', ...TYPE.caption1, color: on ? '#fff' : '#9a9aa2', whiteSpace: 'nowrap' }}>
      <span style={{ width: '13px', height: '13px', borderRadius: '3px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${on ? T.primary : '#33333b'}`, background: on ? T.primary : '#141417' }}>
        {on && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
      </span>
      {children}
    </span>
  );
  const bands = [
    { label: '위험', color: '#F0436A', cards: [
      { time: '긴급', urgent: true, evt: '침입', loc: '중앙로 사거리', ts: '14:25:31', proxy: true, bbox: '#F0436A' },
      { time: '1분 전', evt: '화재', loc: '시장동 입구', ts: '14:24:12', bbox: '#F0436A' },
    ] },
    { label: '경고', color: '#C9847A', cards: [
      { time: '1분 전', evt: '배회', loc: '공원길 입구', ts: '14:24:58', proxy: true, bbox: T.positive },
      { time: '2분 전', evt: '역주행', loc: '중앙로 진입로', ts: '14:23:40', proxy: true, bbox: T.positive },
      { time: '3분 전', evt: '배회', loc: '시장동 중앙', ts: '14:22:05', bbox: T.positive },
    ] },
    { label: '주의', color: '#F5EFE0', cards: [
      { time: '5분 전', evt: '혼잡도', loc: '버스정류장 1', ts: '14:20:41', bbox: '#F5EFE0' },
    ] },
  ];
  const allEvents = bands.flatMap((b) => b.cards.map((c) => ({ ...c, bandColor: b.color })));
  // 밴드 색이 밝으면(크림 등) 사이드바 라벨 글자를 어둡게 — 흰색 라벨 대비 확보
  const isLight = (hex) => { const n = parseInt(hex.slice(1), 16); return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) > 165; };
  const cardBtn = { flex: 1, height: '26px', ...TYPE.caption1, fontWeight: W.semibold, borderRadius: '4px', cursor: 'pointer', fontFamily: T.font };
  const EvtCard = ({ c, band }) => (
    <div style={{ flex: '1 1 0', minWidth: '184px', maxWidth: '320px', background: '#1a1a1f', border: `1px solid ${c.urgent ? band.color : '#2a2a30'}`, borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${SP[4]} ${SP[8]} ${SP[2]}` }}>
        {c.urgent
          ? <span style={{ ...TYPE.caption2, fontWeight: W.bold, color: '#fff', background: band.color, borderRadius: '3px', padding: `1px ${SP[8]}` }}>긴급</span>
          : <span style={{ ...TYPE.caption2, color: '#8a8a92' }}>{c.time}</span>}
        <span style={{ ...TYPE.caption1, color: '#6f6f77', cursor: 'pointer', lineHeight: 1 }}>✕</span>
      </div>
      <div style={{ flex: 1, minHeight: '96px', margin: `0 ${SP[8]}`, borderRadius: '4px', background: 'linear-gradient(135deg,#20222a,#14161c)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '30%', top: '30%', width: '40%', height: '40%', border: `1.5px solid ${c.bbox}`, borderRadius: '2px' }} />
      </div>
      <div style={{ padding: SP[8], display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff' }}>{c.evt}</span>
        <span style={{ ...TYPE.caption1, color: '#bdbdc4' }}>{c.loc}</span>
        <span style={{ ...TYPE.caption2, color: '#8a8a92', fontVariantNumeric: 'tabular-nums' }}>{c.ts}</span>
        {c.proxy && (
          <span style={{ display: 'inline-flex', alignSelf: 'flex-start', marginTop: SP[4] }}>
            <DsBadge tone="accent" size="xs" dot>김서연 부재</DsBadge>
          </span>
        )}
        <div style={{ display: 'flex', gap: SP[4], marginTop: SP[8] }}>
          <button type="button" style={{ ...cardBtn, color: '#d4d4d8', background: '#2a2a30', border: '1px solid #3a3a42' }}>정탐</button>
          <button type="button" style={{ ...cardBtn, color: T.error, background: 'transparent', border: '1px solid rgba(255,99,99,0.5)' }}>오탐</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9', display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      <PrevaxTitleBar datetime="2026.07.02 14:25:40" />
      <PrevaxTabBar active="선별관제" />

      {/* 부재 대리 수신 안내 배너 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], height: '36px', flexShrink: 0, padding: `0 ${SP[16]}`, background: 'rgba(255,169,56,0.1)', borderBottom: '1px solid #2a2a30' }}>
        <span style={{ display: 'inline-flex', color: T.cautionary }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
        </span>
        <span style={{ ...TYPE.label2, fontWeight: W.semibold, color: '#ffd699' }}><b style={{ color: '#fff', fontWeight: W.bold }}>김서연</b> 관제사 부재 — 담당 이벤트를 대신 수신 중</span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: SP[4], padding: `${SP[4]} ${SP[12]}`, borderRadius: '40px', background: 'rgba(0,102,255,0.14)', border: `1px solid ${T.primary}66`, ...TYPE.caption1, fontWeight: W.semibold, color: '#9dbbff', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          부재 대신 미조치 <b style={{ color: '#fff', fontWeight: W.bold }}>3</b> 건
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 좌: 검색 조건 패널 — 선별관제 모니터링과 동일 규격(320px)·컨트롤 */}
        <div style={{ width: '320px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: `${SP[8]} ${SP[12]} ${SP[8]}`, ...TYPE.label1, fontWeight: W.bold, color: '#fff' }}>검색 조건</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP[8], padding: `${SP[4]} ${SP[12]} ${SP[12]}`, borderBottom: '1px solid #232329' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
              <span style={rowLabel}>등급</span>
              <div style={{ ...ctl, flex: 1, justifyContent: 'space-between' }}>전체,주의,경고,위험<span style={{ fontSize: '8px', color: '#7f7f87', marginLeft: SP[4] }}>▾</span></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
              <span style={rowLabel}>이벤트</span>
              <div style={{ ...ctl, flex: 1, justifyContent: 'space-between' }}>전체,배회,침입,쓰러짐,화재…<span style={{ fontSize: '8px', color: '#7f7f87', marginLeft: SP[4] }}>▾</span></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[16] }}>
              <span style={rowLabel}>조치 여부</span>
              <Chk on={chkAction} onClick={() => setChkAction((v) => !v)}>조치</Chk>
              <Chk on={chkNoAction} onClick={() => setChkNoAction((v) => !v)}>미조치</Chk>
            </div>
            <div style={{ display: 'flex', gap: SP[8], marginTop: SP[2] }}>
              <button type="button" style={{ flex: 1, height: '30px', ...TYPE.caption1, fontWeight: W.medium, color: '#d4d4d8', background: '#2a2a30', border: '1px solid #3a3a42', borderRadius: '4px', cursor: 'pointer', fontFamily: T.font }}>초기화</button>
              <button type="button" style={{ flex: 1, height: '30px', ...TYPE.caption1, fontWeight: W.semibold, color: '#fff', background: T.primary, border: `1px solid ${T.primary}`, borderRadius: '4px', cursor: 'pointer', fontFamily: T.font }}>일괄처리</button>
            </div>
          </div>
          <div style={{ padding: `${SP[8]} ${SP[12]}`, ...TYPE.caption1, color: '#8a8a92' }}>
            최근 30분 이벤트 <span style={{ color: '#bdbdc4', fontWeight: W.semibold }}>({allEvents.length}건)</span>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }} className="prevax-scroll">
            {allEvents.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #202027', cursor: 'pointer' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: e.bandColor, flexShrink: 0 }} />
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: SP[16] }}>
                    <span style={{ ...TYPE.caption1, fontWeight: W.semibold, color: '#e4e4e8' }}>{e.evt}</span>
                    {e.proxy && <DsBadge tone="accent" size="xs">부재</DsBadge>}
                  </div>
                  <div style={{ ...TYPE.caption2, color: '#8a8a92' }}>{e.loc} · {e.ts}</div>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 우: 위험도 3밴드 (이벤트 카드) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: SP[8], padding: SP[8], minWidth: 0 }}>
          {bands.map((b) => {
            const chips = Object.entries(b.cards.reduce((m, c) => { m[c.evt] = (m[c.evt] || 0) + 1; return m; }, {}));
            return (
              <div key={b.label} style={{ flex: 1, display: 'flex', background: '#16161a', border: '1px solid #2a2a30', borderRadius: '6px', overflow: 'hidden', minHeight: 0 }}>
                <div style={{ width: '28px', flexShrink: 0, background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', writingMode: 'vertical-rl', textOrientation: 'upright', ...TYPE.label2, fontWeight: W.bold, color: isLight(b.color) ? '#1a1a1f' : '#fff', letterSpacing: '0.1em' }}>{b.label}</div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  {/* 이벤트 유형 칩 헤더 — 선별관제 모니터링과 동일 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], flexWrap: 'wrap', padding: `${SP[8]} ${SP[12]}`, background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid #232329' }}>
                    {chips.map(([label, count]) => (
                      <CBadge key={label} color={b.color}>
                        <span style={{ fontWeight: W.medium }}>{label}</span>
                        <span style={{ fontSize: '14px', fontWeight: W.bold, fontVariantNumeric: 'tabular-nums', marginLeft: '5px' }}>{count}</span>
                        <span style={{ ...TYPE.caption2, fontWeight: W.regular, opacity: 0.7, marginLeft: '1px' }}>회</span>
                      </CBadge>
                    ))}
                  </div>
                  {/* 이벤트 카드 행 */}
                  <div className="prevax-scroll" style={{ flex: 1, minWidth: 0, display: 'flex', gap: SP[8], padding: SP[8], overflowX: 'auto', alignItems: 'stretch' }}>
                    {b.cards.map((c, i) => <EvtCard key={i} c={c} band={b} />)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * PREVAX 4 선별관제 모니터링 — 운영 중(이벤트 적재) 상태.
 * 빈 상태 예시(PrevaxSelectiveScreen)와 동일한 크롬·좌패널 규격·3밴드 구조를 공유하되,
 * 실제 관제 부하(최근 이벤트 리스트 · 유형별 누적 카운트 칩(0건 포함) · 정탐/오탐 카드)를 채운 변형.
 * 원본 관제 화면의 원색(saturated) 대신 선별관제 패밀리 정본 팔레트(#F0436A/#C9847A/#F5EFE0)와
 * 동일 카드/칩/컨트롤을 사용해 Library 선별관제 화면들과 시각 일관성을 유지한다.
 */
function PrevaxSelectiveActiveScreen({ onEventClick, withDetail } = {}) {
  const [chkAction, setChkAction] = useState(true);
  const [chkNoAction, setChkNoAction] = useState(true);
  const [showDragnet, setShowDragnet] = useState(false); // F-9 주변 카메라 보기 부유 창 팝업
  const [hoverEv, setHoverEv] = useState(null);          // 최근 이벤트 행 hover
  const ctl = { display: 'flex', alignItems: 'center', height: '28px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px', ...TYPE.caption1, color: '#d4d4d8', fontFamily: T.font, cursor: 'pointer', whiteSpace: 'nowrap', boxSizing: 'border-box' };
  const rowLabel = { ...TYPE.caption1, color: '#9a9aa2', width: '56px', flexShrink: 0 };
  const Chk = ({ on, onClick, children }) => (
    <span onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', ...TYPE.caption1, color: on ? '#fff' : '#9a9aa2', whiteSpace: 'nowrap' }}>
      <span style={{ width: '13px', height: '13px', borderRadius: '3px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${on ? T.primary : '#33333b'}`, background: on ? T.primary : '#141417' }}>
        {on && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
      </span>
      {children}
    </span>
  );
  const isLight = (hex) => { const n = parseInt(hex.slice(1), 16); return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) > 165; };

  // 위험도 3밴드 — 유형별 누적 카운트 칩(0건 포함) + 정탐/오탐 카드.
  const bands = [
    { label: '위험', color: '#F0436A', chips: [{ label: '쓰러짐', count: 0 }, { label: '화재', count: 0 }], cards: [] },
    { label: '경고', color: '#C9847A', chips: [{ label: '침입', count: 1196 }, { label: '싸움', count: 0 }], cards: [
      { elapsed: '25분 경과', evt: '침입', cam: 'CAM 3', ts: '14:17:49' },
      { elapsed: '25분 경과', evt: '침입', cam: 'CAM 3', ts: '14:17:46' },
      { elapsed: '25분 경과', evt: '침입', cam: 'CAM 3', ts: '14:17:43' },
      { elapsed: '39분 경과', evt: '침입', cam: 'CAM 3', ts: '14:03:12' },
    ] },
    { label: '주의', color: '#F5EFE0', chips: [{ label: '배회', count: 4601 }, { label: '유기', count: 0 }, { label: '속도 위반', count: 1792 }], cards: [
      { elapsed: '0분 경과', evt: '속도 위반', cam: 'CAM 5', ts: '14:43:11' },
      { elapsed: '0분 경과', evt: '속도 위반', cam: 'CAM 5', ts: '14:43:09' },
      { elapsed: '0분 경과', evt: '속도 위반', cam: 'CAM 5', ts: '14:43:06' },
      { elapsed: '0분 경과', evt: '속도 위반', cam: 'CAM 5', ts: '14:43:04' },
    ] },
  ];

  // 좌측 "최근 30분 이벤트" 리스트 — 스크린샷 재현(속도 위반/CAM 5 다수). 879건 중 표시분.
  const totalRecent = 879;
  const recent = Array.from({ length: 13 }).map((_, i) => ({ evt: '속도 위반', cam: 'CAM 5', ts: `14:43:${String(11 - i).padStart(2, '0')}` }));

  // 우측 상세정보 패널(withDetail) — 이벤트 클릭 시 채워짐. 그룹 있으면 "주변 카메라 보기"(F-9) 활성.
  const OBJ_OF = { '침입': '사람', '배회': '사람', '쓰러짐': '사람', '속도 위반': '승용차', '불법 주정차': '승용차', '화재': '연기', '유기': '물체', '싸움': '사람' };
  const GROUP_OF = { 'CAM 1': '강남대로 일대', 'CAM 3': '역삼 사거리', 'CAM 5': null }; // CAM 5 = 그룹 미지정(주변 카메라 보기 비활성 예시)
  const toDetail = (c, band) => ({ evt: c.evt, cam: c.cam, obj: OBJ_OF[c.evt] || '객체', grade: band.label, band: band.color, ts: c.ts, group: (c.cam in GROUP_OF) ? GROUP_OF[c.cam] : '강남대로 일대' });
  const [selEv, setSelEv] = useState(() => toDetail(bands[1].cards[0], bands[1])); // 기본: 경고·침입·CAM 3(그룹 있음)
  const [judge, setJudge] = useState(null);   // '정탐' | '오탐'
  const [actor, setActor] = useState('');      // 조치자 명
  const [tip, setTip] = useState(false);       // 비활성 "주변 카메라 보기" 툴팁
  const pick = (d) => { setSelEv(d); setJudge(null); };

  const cardBtn = { flex: 1, height: '26px', ...TYPE.caption1, fontWeight: W.semibold, borderRadius: '4px', cursor: 'pointer', fontFamily: T.font };
  const EvtCard = ({ c, band, onClick, selected }) => (
    <div onClick={onClick} title={withDetail ? '이벤트 상세 보기' : undefined} style={{ flex: '1 1 0', minWidth: '184px', maxWidth: '320px', background: '#1a1a1f', border: `1px solid ${selected ? T.primaryStrong : '#2a2a30'}`, boxShadow: selected ? `0 0 0 1px ${T.primaryStrong}` : 'none', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: withDetail ? 'pointer' : 'default' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[4]} ${SP[8]} ${SP[2]}` }}>
        <span style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff' }}>{c.evt}</span>
        <span style={{ ...TYPE.caption2, color: '#a8a8b0', background: '#202027', border: '1px solid #2e2e35', borderRadius: '3px', padding: `1px ${SP[8]}` }}>{c.elapsed}</span>
        <span style={{ marginLeft: 'auto', ...TYPE.caption1, color: '#6f6f77', cursor: 'pointer', lineHeight: 1 }}>✕</span>
      </div>
      <div style={{ flex: 1, minHeight: '96px', margin: `0 ${SP[8]}`, borderRadius: '4px', background: 'linear-gradient(135deg,#20222a,#14161c)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '30%', top: '30%', width: '40%', height: '40%', border: `1.5px solid ${band.color}`, borderRadius: '2px' }} />
      </div>
      <div style={{ padding: SP[8], display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ ...TYPE.caption1, color: '#bdbdc4' }}>{c.cam}</span>
        <span style={{ ...TYPE.caption2, color: '#8a8a92', fontVariantNumeric: 'tabular-nums' }}>2026-07-15 {c.ts}</span>
        <div style={{ display: 'flex', gap: SP[4], marginTop: SP[8] }}>
          <button type="button" style={{ ...cardBtn, color: '#d4d4d8', background: '#2a2a30', border: '1px solid #3a3a42' }}>정탐</button>
          <button type="button" style={{ ...cardBtn, color: T.error, background: 'transparent', border: '1px solid rgba(255,99,99,0.5)' }}>오탐</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'relative',
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9', display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      <PrevaxTitleBar datetime="2026.07.15 14:43:11" />
      <PrevaxTabBar active="선별관제" />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 좌측 검색 조건 패널 — 선별관제 모니터링과 동일 규격(320px)·컨트롤 */}
        <div style={{ width: '320px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: `${SP[8]} ${SP[12]} ${SP[8]}`, ...TYPE.label1, fontWeight: W.bold, color: '#fff' }}>검색 조건</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP[8], padding: `${SP[4]} ${SP[12]} ${SP[12]}`, borderBottom: '1px solid #232329' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
              <span style={rowLabel}>등급</span>
              <div style={{ ...ctl, flex: 1, justifyContent: 'space-between' }}>전체,주의,경고,위험<span style={{ fontSize: '8px', color: '#7f7f87', marginLeft: SP[4] }}>▾</span></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
              <span style={rowLabel}>이벤트</span>
              <div style={{ ...ctl, flex: 1, justifyContent: 'space-between' }}>전체,침입,배회,쓰러짐,유기…<span style={{ fontSize: '8px', color: '#7f7f87', marginLeft: SP[4] }}>▾</span></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[16] }}>
              <span style={rowLabel}>조치 여부</span>
              <Chk on={chkAction} onClick={() => setChkAction((v) => !v)}>조치</Chk>
              <Chk on={chkNoAction} onClick={() => setChkNoAction((v) => !v)}>미조치</Chk>
            </div>
            <div style={{ display: 'flex', gap: SP[8], marginTop: SP[2] }}>
              <button type="button" style={{ flex: 1, height: '30px', ...TYPE.caption1, fontWeight: W.medium, color: '#d4d4d8', background: '#2a2a30', border: '1px solid #3a3a42', borderRadius: '4px', cursor: 'pointer', fontFamily: T.font }}>초기화</button>
              <button type="button" style={{ flex: 1, height: '30px', ...TYPE.caption1, fontWeight: W.semibold, color: '#fff', background: T.primary, border: `1px solid ${T.primary}`, borderRadius: '4px', cursor: 'pointer', fontFamily: T.font }}>일괄처리</button>
            </div>
          </div>
          <div style={{ padding: `${SP[8]} ${SP[12]}`, ...TYPE.caption1, color: '#8a8a92' }}>
            최근 30분 이벤트 <span style={{ color: '#bdbdc4', fontWeight: W.semibold }}>({totalRecent}건)</span>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }} className="prevax-scroll">
            {recent.map((e, i) => (
              <div key={i} onClick={() => (withDetail ? pick(toDetail(e, bands[2])) : setShowDragnet(true))} onMouseEnter={() => setHoverEv(i)} onMouseLeave={() => setHoverEv((h) => (h === i ? null : h))} title={withDetail ? '이벤트 상세 보기' : '주변 카메라 보기(F-9)'} style={{ display: 'flex', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #202027', cursor: 'pointer', background: hoverEv === i ? 'rgba(0,102,255,0.10)' : 'transparent' }}>
                <div style={{ width: '52px', height: '40px', flexShrink: 0, borderRadius: '4px', background: 'linear-gradient(135deg,#20222a,#14161c)', border: '1px solid #2a2a30' }} />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ ...TYPE.caption1, fontWeight: W.semibold, color: '#e4e4e8' }}>{e.evt}</span>
                  <span style={{ ...TYPE.caption2, color: '#bdbdc4' }}>{e.cam}</span>
                  <span style={{ ...TYPE.caption2, color: '#8a8a92', fontVariantNumeric: 'tabular-nums' }}>2026-07-15 {e.ts}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', flexShrink: 0 }}>
                  <span style={{ ...TYPE.caption2, color: '#8a8a92', background: '#202027', border: '1px solid #2e2e35', borderRadius: '3px', padding: `1px ${SP[4]}` }}>0분 경과</span>
                  <span style={{ ...TYPE.caption2, fontWeight: W.medium, color: T.cautionary }}>미조치</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 우측 위험도 3밴드 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: SP[8], padding: SP[8], minWidth: 0 }}>
          {bands.map((b) => (
            <div key={b.label} style={{ flex: 1, display: 'flex', background: '#16161a', border: '1px solid #2a2a30', borderRadius: '6px', overflow: 'hidden', minHeight: 0 }}>
              <div style={{ width: '28px', flexShrink: 0, background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', writingMode: 'vertical-rl', textOrientation: 'upright', ...TYPE.label2, fontWeight: W.bold, color: isLight(b.color) ? '#1a1a1f' : '#fff', letterSpacing: '0.1em' }}>{b.label}</div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                {/* 이벤트 유형 칩 헤더 — 0건 유형은 낮은 위계(dim)로 병기 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], flexWrap: 'wrap', padding: `${SP[8]} ${SP[12]}`, background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid #232329' }}>
                  {b.chips.map((e) => (
                    <span key={e.label} style={{ display: 'inline-flex', opacity: e.count === 0 ? 0.45 : 1 }}>
                      <CBadge color={b.color}>
                        <span style={{ fontWeight: W.medium }}>{e.label}</span>
                        <span style={{ fontSize: '14px', fontWeight: W.bold, fontVariantNumeric: 'tabular-nums', marginLeft: '5px' }}>{e.count}</span>
                        <span style={{ ...TYPE.caption2, fontWeight: W.regular, opacity: 0.7, marginLeft: '1px' }}>건</span>
                      </CBadge>
                    </span>
                  ))}
                </div>
                {/* 이벤트 카드 행 — 카드 없으면 빈 상태 안내 */}
                {b.cards.length > 0 ? (
                  <div className="prevax-scroll" style={{ flex: 1, minWidth: 0, display: 'flex', gap: SP[8], padding: SP[8], overflowX: 'auto', alignItems: 'stretch' }}>
                    {b.cards.map((c, i) => { const d = toDetail(c, b); const on = withDetail && selEv.evt === d.evt && selEv.cam === d.cam && selEv.ts === d.ts; return <EvtCard key={i} c={c} band={b} selected={on} onClick={withDetail ? () => pick(d) : undefined} />; })}
                  </div>
                ) : (
                  <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...TYPE.caption1, color: '#5a5a62' }}>
                    해당 등급의 미처리 이벤트가 없습니다
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 우측 상세정보 패널(withDetail) — 이벤트 클릭 시 채워짐, "주변 카메라 보기"(F-9) 포함 */}
        {withDetail && (
          <div className="prevax-scroll" style={{ width: '336px', flexShrink: 0, background: '#16161a', borderLeft: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto' }}>
            <div style={{ padding: `${SP[12]} ${SP[16]} ${SP[8]}`, ...TYPE.label1, fontWeight: W.bold, color: '#fff' }}>상세정보</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP[12], padding: `0 ${SP[16]} ${SP[16]}` }}>
              {/* 스냅샷 */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', borderRadius: '8px', overflow: 'hidden', background: 'linear-gradient(135deg,#20222a,#14161c)', border: '1px solid #2a2a30' }}>
                <div style={{ position: 'absolute', left: '34%', top: '30%', width: '30%', height: '44%', border: `1.5px solid ${selEv.band}`, borderRadius: '2px' }} />
                <span style={{ position: 'absolute', bottom: SP[8], right: SP[8], ...TYPE.caption2, color: '#e8e8ec', fontVariantNumeric: 'tabular-nums', textShadow: '0 1px 3px rgba(0,0,0,0.85)' }}>2026-07-15 {selEv.ts}</span>
              </div>
              {/* 정보 행 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: SP[4] }}>
                {[['이벤트 명', selEv.evt], ['카메라 명', selEv.cam], ['객체', selEv.obj], ['알람 등급', selEv.grade], ['일시', `2026-07-15 ${selEv.ts}`]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: SP[8], ...TYPE.caption1 }}>
                    <span style={{ color: '#8a8a92', width: '64px', flexShrink: 0 }}>{k}</span>
                    <span style={{ color: '#e4e4e8', fontWeight: W.medium }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], ...TYPE.caption1 }}>
                  <span style={{ color: '#8a8a92', width: '64px', flexShrink: 0 }}>그룹</span>
                  {selEv.group
                    ? <span style={{ ...TYPE.caption2, color: '#8fb8ff', background: 'rgba(0,102,255,0.14)', border: '1px solid rgba(0,102,255,0.4)', borderRadius: '3px', padding: `1px ${SP[8]}` }}>{selEv.group}</span>
                    : <span style={{ ...TYPE.caption2, color: '#8a8a92', background: '#202027', border: '1px solid #2e2e35', borderRadius: '3px', padding: `1px ${SP[8]}` }}>그룹 미지정</span>}
                </div>
              </div>
              {/* 액션 버튼 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: SP[8] }}>
                <div style={{ display: 'flex', gap: SP[8] }}>
                  <button type="button" style={{ flex: 1, height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: SP[4], ...TYPE.caption1, fontWeight: W.semibold, color: '#d4d4d8', background: '#2a2a30', border: '1px solid #3a3a42', borderRadius: '6px', cursor: 'pointer', fontFamily: T.font }}><Icon name="play" size={14} color="#d4d4d8" />이벤트 영상</button>
                  <button type="button" style={{ flex: 1, height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: SP[4], ...TYPE.caption1, fontWeight: W.semibold, color: '#d4d4d8', background: '#2a2a30', border: '1px solid #3a3a42', borderRadius: '6px', cursor: 'pointer', fontFamily: T.font }}><Icon name="nest_cam_outdoor" size={14} color="#d4d4d8" />실시간 영상</button>
                </div>
                {/* 주변 카메라 보기 — 그룹 있으면 F-9 팝업, 없으면 비활성 + 툴팁 */}
                <span style={{ position: 'relative', display: 'flex' }} onMouseEnter={() => !selEv.group && setTip(true)} onMouseLeave={() => setTip(false)}>
                  <button type="button" onClick={() => { if (selEv.group) setShowDragnet(true); }}
                    style={{ width: '100%', height: '34px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: SP[4], ...TYPE.caption1, fontWeight: W.bold, borderRadius: '6px', fontFamily: T.font,
                      ...(selEv.group
                        ? { color: '#fff', background: `linear-gradient(135deg, ${T.primaryStrong} 0%, ${T.primaryHeavy} 100%)`, border: `1px solid ${T.primaryHeavy}`, cursor: 'pointer' }
                        : { color: '#6f6f77', background: '#202024', border: '1px solid #2a2a30', cursor: 'not-allowed' }) }}>
                    <Icon name="location_searching" size={14} color={selEv.group ? '#fff' : '#6f6f77'} />주변 카메라 보기
                  </button>
                  {tip && !selEv.group && (
                    <span style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: 0, zIndex: 10, ...TYPE.caption2, color: '#e8e8ec', background: '#101015', border: '1px solid #2c3540', borderRadius: '6px', padding: `${SP[4]} ${SP[8]}`, whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>이 카메라는 그룹에 속해 있지 않습니다.</span>
                  )}
                </span>
              </div>
              {/* 조치내역 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: SP[4] }}>
                <span style={{ ...TYPE.caption1, color: '#9a9aa2' }}>조치내역</span>
                <div style={{ minHeight: '60px', background: '#141417', border: '1px solid #2e2e35', borderRadius: '6px', padding: SP[8], ...TYPE.caption1, color: '#6f6f77' }}>기록 없음</div>
              </div>
              {/* 이벤트 판정 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: SP[16] }}>
                <span style={{ ...TYPE.caption1, color: '#9a9aa2', width: '64px', flexShrink: 0 }}>이벤트 판정</span>
                <Chk on={judge === '정탐'} onClick={() => setJudge((v) => (v === '정탐' ? null : '정탐'))}>정탐</Chk>
                <Chk on={judge === '오탐'} onClick={() => setJudge((v) => (v === '오탐' ? null : '오탐'))}>오탐</Chk>
              </div>
              {/* 조치자 명 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
                <span style={{ ...TYPE.caption1, color: '#9a9aa2', width: '64px', flexShrink: 0 }}>조치자 명</span>
                <input value={actor} onChange={(e) => setActor(e.target.value)} style={{ flex: 1, height: '30px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px', ...TYPE.caption1, color: '#e4e4e8', fontFamily: T.font, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <button type="button" style={{ alignSelf: 'flex-end', minWidth: '84px', height: '32px', ...TYPE.caption1, fontWeight: W.semibold, color: '#fff', background: T.primary, border: `1px solid ${T.primary}`, borderRadius: '6px', cursor: 'pointer', fontFamily: T.font }}>저장</button>
            </div>
          </div>
        )}
      </div>

      {/* F-9 주변 카메라 보기 부유 창 팝업 — 최근 이벤트 행 클릭 시 등장 */}
      {showDragnet && (
        <div onClick={() => setShowDragnet(false)} style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: SP[24] }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '84%', maxWidth: '1180px' }}>
            <DragnetInvestigationWindow onClose={() => setShowDragnet(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * PREVAX 4 선별관제 — 이벤트 상세(F-9 진입 컷 ①).
 * 이벤트 상세 패널의 [이벤트 영상 · 주변 카메라 보기 · 실시간 영상] 버튼 줄에서
 * "주변 카메라 보기"를 되살린 화면. 선택 이벤트의 카메라가 그룹(group_camera_info)에 속하면
 *  버튼 활성 → 클릭 시 F-9 조사 격자창(library-dragnet)으로 진입, 그룹이 없으면 비활성 + 안내 툴팁.
 * 좌측 이벤트 목록에서 (a)그룹 있음 / (b)그룹 없음 두 상태를 오가며 확인할 수 있다.
 */
function PrevaxSelectiveEventDetailScreen() {
  // F-9 진입 컷① — 선별관제 모니터링(운영 중) 화면 + 우측 상세정보 패널.
  //  이벤트(최근 리스트/밴드 카드) 클릭 → 우측 패널이 채워지고, 그룹 있으면 "주변 카메라 보기"로 F-9 부유 창 진입.
  return <PrevaxSelectiveActiveScreen withDetail />;
}

/**
 * PREVAX 4 실시간영상 화면 — 좌측 지역/카메라 트리 + 상단 영상 옵션 툴바 + 영상 그리드(2×2) + 하단 페이지/분할 바.
 * 기존 화면과 동일한 타이틀바·탭 크롬, 토큰, 트리 위계를 공유. Switch(영상 옵션 토글)는 DS Primary 컬러 적용.
 */
function PrevaxLiveScreen() {
  const [page, setPage] = useState(1);
  const [split, setSplit] = useState(4);
  const [away, setAway] = useState(null); // 자리 비움 상태(대리 관제사명 or null)
  // F-7 PC-적응형 분할 권장 안내(add-on). REC = 이 PC에 맞춘 권장 분할(예시값 — 확정 권장칸 아님).
  // 기술어(GPU/메모리/디코더) 비노출 → "이 컴퓨터 사양"으로 표현. 자동적용 = "시작했어요"(중단 없음).
  const REC = 4;
  const over = split > REC; // 권장 초과 → 소프트 경고(차단 아님)
  const helpG = <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><circle cx="12" cy="7.5" r=".6" fill="currentColor" stroke="none" /></svg>;
  const warnG = <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 2.5 20h19z" /><path d="M12 10v4" /><circle cx="12" cy="17" r=".6" fill="currentColor" stroke="none" /></svg>;
  const resetG = <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.5 2.8" /><path d="M3 3v4h4" /></svg>;
  // 영상 옵션 상태 — 리뱀프 3축 라벨(객체/이벤트/보기일반)
  const [opts, setOpts] = useState({
    '객체 필터': true, '객체 라벨': false,
    '이벤트 필터': true, '영역 강조': true, '채널 강조': true,
    '분석 영역': true, '자동 순환': false,
  });
  const toggleOpt = (k) => setOpts((s) => ({ ...s, [k]: !s[k] }));

  // 지역정보 트리 — d: 깊이, ex: 펼침 화살표, sel: 선택, cam: 카메라 리프, count: [n]
  const tree = [
    { d: 0, label: '인천공항 분석서버', ex: true },
    { d: 1, label: '스쿨존 2' },
    { d: 1, label: '스쿨존 1', ex: true },
    { d: 2, label: 'SH0019', count: 8, ex: true, sel: true },
    { d: 3, label: 'SH0019C001', cam: true }, { d: 3, label: 'SH0019C003', cam: true },
    { d: 3, label: 'SH0019C004', cam: true }, { d: 3, label: 'SH0019C002', cam: true },
    { d: 3, label: 'SH-CAM1', cam: true }, { d: 3, label: 'SH-CAM2', cam: true },
    { d: 3, label: 'SH-CAM3', cam: true }, { d: 3, label: 'SH-CAM4', cam: true },
    { d: 2, label: 'testtesttesttesttest', count: 0 },
    { d: 0, label: '분석기추가테스트', ex: true },
    { d: 1, label: '테스트 1', ex: true },
    { d: 2, label: 'SH0020', count: 2, ex: true },
    { d: 3, label: 'ROI40', cam: true }, { d: 3, label: 'PTZ Cam', cam: true },
    { d: 0, label: '시흥보행연장test', ex: true },
    { d: 1, label: '시흥', ex: true },
    { d: 2, label: '보행신호연장', count: 0 },
    { d: 0, label: 'testing ttt', ex: true },
    { d: 1, label: 'test detail', ex: true },
    { d: 2, label: 'test section', count: 0 },
  ];

  // 영상 그리드 — live = 시뮬레이션 씬, connecting = 연결중 플레이스홀더
  const grid = [
    { name: 'SH0019C001', scene: 'linear-gradient(178deg, #9aa0a8 0%, #888d95 32%, #74787f 56%, #5c5f66 100%)', time: '2025.03.10 10:05:00', ev: { label: '침입', color: T.cautionary } },
    { name: 'SH0019C003' },
    { name: 'SH0019C004', scene: 'linear-gradient(178deg, #aab0a8 0%, #939a8e 38%, #767c70 70%, #5e6358 100%)', time: '2025.03.10 10:05:00' },
    { name: 'SH0019C002' },
  ];
  // 분할(split)에 따라 N×N 그리드로 렌더 — 4→2×2, 9→3×3, 16→4×4.
  const cols = Math.round(Math.sqrt(split));
  const cells = Array.from({ length: split }, (_, i) => grid[i] || { name: `CH${String(i + 1).padStart(2, '0')}` });
  // 연결중 셀 로딩 스피너 크기 — 분할이 커질수록(셀이 작아질수록) 축소 (Loading 정본 region 변형)
  const spin = cols >= 4 ? 22 : cols === 3 ? 30 : 40;
  // 셀 오버레이(카메라명·PTZ·타임스탬프·이벤트 배지) 타이포/여백 — 분할이 커질수록 축소
  const ov = cols >= 4
    ? { name: '10px', ptz: '9px', stamp: '11px', padY: SP[4], ptzPad: SP[8], namePad: SP[12], edge: '5px', gap: SP[2], evFont: '8.5px', evH: '16px', dot: '4px' }
    : cols === 3
    ? { name: '11.5px', ptz: '10.5px', stamp: '13px', padY: SP[4], ptzPad: SP[12], namePad: SP[16], edge: '6px', gap: SP[4], evFont: '10px', evH: '18px', dot: '5px' }
    : { name: '13px', ptz: '12px', stamp: '15px', padY: SP[8], ptzPad: SP[12], namePad: SP[16], edge: '8px', gap: SP[4], evFont: '11px', evH: '20px', dot: '6px' };

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      <PrevaxTitleBar datetime="2026.06.05 15:15:02" away={away} onApplyAway={setAway} onRestore={() => setAway(null)} />
      <PrevaxTabBar active="실시간영상" />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 좌: 지역정보 트리 패널 */}
        <div style={{ width: '278px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], height: '37px', flexShrink: 0, padding: `0 ${SP[12]}`, borderBottom: '1px solid #2a2a30' }}>
            <span style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff' }}>지역정보 관리</span>
            <Icon name="cycle" size={13} color="#8a8a92" />
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a8a92" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
              <line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14l-1.6-5.8a2 2 0 0 0-1.9-1.5H8.5a2 2 0 0 0-1.9 1.5L5 17z" />
            </svg>
          </div>
          <div style={{ padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #232329' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], height: '28px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px' }}>
              <input placeholder="" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: T.font, ...TYPE.caption1 }} />
              <Icon name="search" size={14} color="#8a8a92" />
              <span style={{ fontSize: '8px', color: '#7f7f87', cursor: 'pointer' }}>▾</span>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: `${SP[4]} 0` }} className="prevax-scroll">
            {tree.map((n, i) => {
              const tier = n.d === 0
                ? { ...TYPE.label2, fontWeight: W.semibold, color: '#e4e4e8' }
                : n.cam
                ? { ...TYPE.caption1, fontWeight: W.regular, color: '#a4a4ac' }
                : { ...TYPE.label2, fontWeight: W.regular, color: '#c4c4cc' };
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: SP[4], cursor: 'pointer', userSelect: 'none',
                  padding: `${SP[4]} ${SP[8]}`, paddingLeft: `${10 + n.d * 14}px`, ...tier,
                  background: n.sel ? 'rgba(0, 102, 255,0.32)' : 'transparent',
                  borderLeft: `2px solid ${n.sel ? T.primary : 'transparent'}`,
                }}>
                  {n.ex ? <span style={{ width: '10px', fontSize: '8px', color: '#7f7f87', flexShrink: 0 }}>▾</span>
                    : <span style={{ width: '10px', flexShrink: 0 }} />}
                  {n.cam && <Icon name="nest_cam_outdoor" size={14} color="#8a8a92" />}
                  <span style={{ whiteSpace: 'nowrap' }}>{n.label}</span>
                  {n.count != null && <span style={{ ...TYPE.caption2, color: '#7f7f87', marginLeft: SP[2] }}>[{n.count}]</span>}
                </div>
              );
            })}
          </div>
          {/* 장비 패널 하단 버튼군 — 새로고침 · 카메라 표시 설정 · 미배치 확인(F-2 진입, 신규) */}
          <div style={{ flexShrink: 0, borderTop: '1px solid #232329', padding: SP[8], display: 'flex', flexDirection: 'column', gap: SP[8] }}>
            {[{ label: '새로고침', icon: 'cycle' }, { label: '카메라 표시 설정', icon: 'settings' }].map((b) => (
              <span key={b.label} style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], height: '30px', padding: `0 ${SP[8]}`, borderRadius: '6px', border: '1px solid #2e2e35', background: '#202024', color: '#d4d4d8', ...TYPE.caption1, fontWeight: W.semibold, whiteSpace: 'nowrap', cursor: 'default' }}>
                <Icon name={b.icon} size={14} color="#9a9aa2" />{b.label}
              </span>
            ))}
            {/* 미배치 확인 — 신규 진입 버튼(Secondary + 연한 Primary 테두리, 과한 강조 회피) → 별도 창(F-2) */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], height: '30px', padding: `0 ${SP[8]}`, borderRadius: '6px', border: '1px solid rgba(51,133,255,0.45)', background: 'rgba(0,102,255,0.12)', color: '#bcd0ff', ...TYPE.caption1, fontWeight: W.semibold, whiteSpace: 'nowrap', cursor: 'pointer' }}>
              <Icon name="nest_cam_outdoor" size={14} color={T.primaryStrong} />미배치 확인
              <span style={{ marginLeft: 'auto', ...TYPE.caption2, fontWeight: W.bold, color: '#9dbbff', background: 'rgba(0,102,255,0.28)', borderRadius: '20px', padding: `0 ${SP[8]}`, fontVariantNumeric: 'tabular-nums' }}>12</span>
            </span>
          </div>
        </div>

        {/* 우: 툴바 + 영상 그리드 + 하단 바 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* 영상 옵션 툴바(리뱀프) — 3축 그룹 + 구분선, 라벨·스위치, ▾ 메뉴 버튼 */}
          <VideoOptionsToolbar isOn={(l) => opts[l]} onToggle={toggleOpt} />

          {/* 영상 그리드 — 분할 버튼(4/9/16)에 따라 N×N */}
          <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${cols}, 1fr)`, gap: SP[2], background: '#000', padding: SP[2] }}>
            {cells.map((c, i) => (
              <div key={i} style={{ position: 'relative', overflow: 'hidden', background: c.scene || '#0a0a0c' }}>
                {/* 연결중 플레이스홀더 — Loading 정본(region 스피너 + 보조문구) */}
                {!c.scene && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: SP[12] }}>
                    <span role="status" aria-label="카메라 연결중" style={{ width: `${spin}px`, height: `${spin}px`, borderRadius: '50%', boxSizing: 'border-box', border: `${Math.max(2, Math.round(spin / 12))}px solid #2e2e2e`, borderTopColor: T.primaryStrong, animation: 'pds-spin 0.8s linear infinite' }} />
                    <span style={{ ...(cols >= 4 ? TYPE.caption2 : TYPE.caption1), color: '#888', whiteSpace: 'nowrap' }}>카메라 연결중</span>
                  </div>
                )}
                {/* 라이브 비네팅 */}
                {c.scene && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.28) 100%)' }} />}
                {/* 이벤트 배지 (좌상단) — 검지된 이벤트, 분할 수에 맞춰 축소 */}
                {c.ev && (
                  <div style={{ position: 'absolute', top: ov.edge, left: ov.edge, zIndex: 6 }}>
                    <CamEventBadge ev={c.ev} sz={ov} />
                  </div>
                )}
                {/* 카메라 명 + PTZ (우상단) — 분할 수에 맞춰 축소 */}
                <div style={{ position: 'absolute', top: ov.edge, right: `calc(${ov.edge} + 2px)`, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: ov.gap }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.55)', color: '#1FC8E6', fontSize: ov.ptz, fontWeight: W.medium, fontFamily: T.font, letterSpacing: '-0.24px', lineHeight: 1.5, padding: `${ov.padY} ${ov.ptzPad}`, borderRadius: '40px', whiteSpace: 'nowrap' }}>PTZ</span>
                  <span style={{ ...TYPE.label2, fontSize: ov.name, fontWeight: W.semibold, color: '#fff', background: 'rgba(10,10,12,0.72)', padding: `${ov.padY} ${ov.namePad}`, borderRadius: '40px', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{c.name}</span>
                </div>
                {/* 타임스탬프 (라이브, 하단 중앙) — 분할 수에 맞춰 축소 */}
                {c.time && (
                  <span style={{ position: 'absolute', bottom: ov.edge, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: T.font, fontSize: ov.stamp, fontWeight: W.medium, color: '#fff', fontVariantNumeric: 'tabular-nums', textShadow: '0 1px 3px rgba(0,0,0,0.85)' }}>{c.time}</span>
                )}
              </div>
            ))}
            {away && <AwayOverlay operator={away} onRestore={() => setAway(null)} />}
          </div>

          {/* 하단 페이지 / 분할 바 — F-7 PC-적응형 분할 권장 안내 add-on */}
          <div style={{ display: 'flex', alignItems: 'center', height: '38px', flexShrink: 0, padding: `0 ${SP[12]}`, borderTop: '1px solid #2a2a30', background: '#16161a', gap: SP[8] }}>
            {/* 좌: 이 컴퓨터에 맞춘 안내(권장) / 초과 시 소프트 경고 + 되돌리기 */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: SP[8] }}>
              {!over ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], height: '24px', padding: `0 11px 0 8px`, borderRadius: '40px', background: 'rgba(0,102,255,0.16)', border: '1px solid rgba(51,133,255,0.42)', color: '#dbe6ff', ...TYPE.caption1, whiteSpace: 'nowrap' }}>
                  <span style={{ display: 'inline-flex', color: '#aac4ff' }}>{helpG}</span>
                  이 컴퓨터에 맞춰 <b style={{ color: '#fff', fontWeight: W.bold }}>{REC}칸</b>으로 시작했어요
                </span>
              ) : (
                <>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], height: '24px', padding: `0 11px 0 8px`, borderRadius: '40px', background: 'rgba(255,169,56,0.12)', border: '1px solid rgba(255,169,56,0.4)', color: '#ffc97a', ...TYPE.caption1, whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'inline-flex', color: T.cautionary }}>{warnG}</span>
                    이 컴퓨터엔 <b style={{ color: '#ffd9a6', fontWeight: W.bold }}>{REC}칸</b>을 권장해요 · 더 늘리면 화면이 끊길 수 있어요
                  </span>
                  <span onClick={() => setSplit(REC)} style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4], height: '24px', padding: `0 11px`, borderRadius: '40px', background: 'rgba(30,212,90,0.10)', border: '1px solid rgba(30,212,90,0.4)', color: '#9fe9b8', ...TYPE.caption1, fontWeight: W.semibold, whiteSpace: 'nowrap', cursor: 'pointer' }}>
                    <span style={{ display: 'inline-flex' }}>{resetG}</span>권장({REC}칸)으로 되돌리기
                  </span>
                </>
              )}
            </div>
            {/* 중앙: 페이지 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], ...TYPE.caption1, color: '#bdbdc4', flexShrink: 0 }}>
              <span style={{ cursor: 'pointer', color: '#7f7f87' }}>‹</span>
              <span style={{ ...TYPE.caption1, fontWeight: W.semibold, color: '#fff', background: '#2a2a30', border: '1px solid #3a3a42', borderRadius: '4px', padding: `${SP[2]} ${SP[8]}`, fontVariantNumeric: 'tabular-nums' }}>{page}</span>
              <span style={{ color: '#7f7f87' }}>/ 2</span>
              <span style={{ cursor: 'pointer', color: '#7f7f87' }}>›</span>
            </div>
            {/* 우: 분할 선택 + 권장 배지 */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: SP[16], ...TYPE.label2, fontVariantNumeric: 'tabular-nums' }}>
              {[4, 9, 16].map((n) => {
                const isRec = n === REC;
                const sel = split === n;
                const overSel = sel && n > REC; // 초과 선택 → 주의색
                return (
                  <span key={n} onClick={() => setSplit(n)} style={{ position: 'relative', cursor: 'pointer', fontWeight: sel ? W.bold : W.regular, color: overSel ? T.cautionary : sel ? T.primaryStrong : '#8a8a92' }}>
                    {n}
                    {isRec && (
                      <span style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', ...TYPE.caption2, fontSize: '8px', fontWeight: W.bold, color: '#9fe9b8', whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>권장</span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── UX Agent 활용성 보고서 — 헤르메스 에이전트 기반 UX 자동화 실증 분석 (3장) ──

function RSection({ title, children, mb = SP[64] }) {
  return (
    <section style={{ marginBottom: mb }}>
      {title && (
        <h2 style={{
          ...TYPE.title3, fontWeight: W.bold, color: '#1a1a1a',
          margin: `0 0 ${SP[32]} 0`, paddingBottom: SP[12],
          borderBottom: '2px solid #1a1a1a',
        }}>{title}</h2>
      )}
      {children}
    </section>
  );
}

function RTable({ headers, rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', ...TYPE.label2, marginBottom: SP[24] }}>
      <thead>
        <tr style={{ background: '#e8e8e8' }}>
          {headers.map((h, i) => (
            <th key={i} style={{ padding: `${SP[12]} ${SP[16]}`, textAlign: 'left', fontWeight: W.semibold, color: '#1a1a1a', borderBottom: '2px solid #c8c8c8', whiteSpace: 'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : '#f8f8f8' }}>
            {row.map((cell, ci) => (
              <td key={ci} style={{ padding: `${SP[8]} ${SP[16]}`, borderBottom: '1px solid #e4e4e4', color: '#2a2a2a', lineHeight: 1.6 }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RCallout({ color, title, children }) {
  return (
    <div style={{
      borderLeft: `4px solid ${color}`, background: `${color}11`,
      borderRadius: '0 8px 8px 0', padding: `${SP[16]} ${SP[16]}`, marginBottom: SP[24],
    }}>
      {title && <p style={{ ...TYPE.label1, fontWeight: W.bold, color, margin: `0 0 ${SP[4]} 0` }}>{title}</p>}
      <p style={{ ...TYPE.body2, color: '#2a2a2a', margin: 0, lineHeight: 1.85 }}>{children}</p>
    </div>
  );
}

function RPageHeader({ label }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '72px', paddingBottom: SP[16], borderBottom: '1px solid #d0d0d0' }}>
      <span style={{ ...TYPE.label2, color: '#6b6b6b', letterSpacing: '0.08em' }}>{label}</span>
      <span style={{ ...TYPE.caption1, color: '#b0b0b0' }}>UX AGENT 활용성 리뷰 · 2026</span>
    </div>
  );
}

function UxAgentReportScreen() {
  const doc = { width: '1920px', background: '#f3f3f3', fontFamily: T.font, color: '#1a1a1a', boxSizing: 'border-box' };
  const page = { padding: '96px 200px 80px', minHeight: '1080px', boxSizing: 'border-box' };
  const pn = { ...TYPE.caption1, color: '#bbb', textAlign: 'right', paddingTop: SP[16], borderTop: '1px solid #e0e0e0' };

  const archItems = [
    { num: '01', title: '학습 중심 아키텍처', sub: '스스로 발전하는 팀', color: T.primary, body: '각 세션의 패턴을 memory/ 디렉토리에 누적해 재활용한다. 실제로 초기 대비 5회차 이후 컨텍스트 소모가 60% 감소했다. 전통적 AI 도구의 무상태(stateless) 한계를 메모리 레이어로 극복한다.' },
    { num: '02', title: '자율적·독립적', sub: '성공 패턴을 분석해 직접 생성', color: T.positive, body: 'Figma MCP + pintel-design-system MCP를 동시 활용해 설계 의도와 명세를 스스로 종합한다. get_design_context → get_component → 토큰 기반 생성의 3단계 파이프라인을 에이전트가 자율 실행한다.' },
    { num: '03', title: '컨테이너 기반 방어 설계', sub: '기본 탑재 (안전)', color: T.cautionary, body: 'Claude Code 권한 모델과 permissions.allow를 통해 에이전트의 도구 접근 범위를 구조적으로 제한한다. 의도치 않은 파일 수정이나 외부 시스템 접근이 원천 차단된다.' },
    { num: '04', title: '연속 작업에 탁월', sub: '사용자 선호도를 장기적으로 학습', color: '#9b59b6', body: '반복 피드백이 feedback_*.md로 영속화되어 미래 세션에 자동 적용된다. "토큰 하드코딩 금지", "Library 일관성 유지" 같은 규칙을 사용자가 두 번 말할 필요가 없다.' },
  ];

  const phaseItems = [
    { phase: '단기 1–2개월', color: T.primary, items: ['Library 화면 시각 패턴 feedback 메모리 구체화', 'MCP 서버 health check 훅 추가 (세션 시작 시)', '피그마 에셋 public/ 자동 복사 훅 설정', 'CLAUDE.md에 토큰 하드코딩 금지 명문화'] },
    { phase: '중기 3–6개월', color: T.cautionary, items: ['피그마 변경 → 자동 PR 생성 파이프라인', '토큰 사용량 대시보드 통합 (세션별 비용 추적)', '컴포넌트 명세 변경 시 Library 자동 회귀 검증', 'WPF 포팅 작업에 동일한 MCP 파이프라인 적용'] },
    { phase: '장기 비전', color: T.positive, items: ['접근성(WCAG) 자동 검증 레이어 추가', '다국어 텍스트 일관성 자동 검사', '디자인 시스템 버전 관리 + 에이전트 메모리 동기화', '기획→설계→코드→검증 풀사이클 UX 에이전트'] },
  ];

  return (
    <div style={doc}>

      {/* ── 표지 ── */}
      <div style={{
        ...page,
        background: `linear-gradient(155deg, #0a1535 0%, ${T.primary} 65%, ${T.primaryStrong} 100%)`,
        color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <p style={{ ...TYPE.caption1, fontWeight: W.semibold, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em', marginBottom: SP[24] }}>
          PINTEL DESIGN SYSTEM — INTERNAL REVIEW · 2026.06.11
        </p>
        <h1 style={{ ...TYPE.display2, fontWeight: W.extrabold, color: '#fff', margin: `0 0 ${SP[12]} 0`, letterSpacing: '-0.03em' }}>
          UX Agent 활용성 리뷰
        </h1>
        <h2 style={{ ...TYPE.title2, fontWeight: W.regular, color: 'rgba(255,255,255,0.78)', margin: '0 0 72px 0' }}>
          헤르메스 에이전트 기반 UX 자동화 실증 분석
        </h2>

        <div style={{ display: 'flex', gap: SP[16], marginBottom: '80px' }}>
          {[['62%', '토큰 비용 절감'], ['83%', '일관성 오류 감소'], ['70%', '구현 시간 단축'], ['9종', 'Library 화면 완성']].map(([v, l]) => (
            <div key={l} style={{ padding: `${SP[24]} ${SP[32]}`, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.18)', minWidth: '180px' }}>
              <div style={{ ...TYPE.display3, fontWeight: W.extrabold, lineHeight: 1.1 }}>{v}</div>
              <div style={{ ...TYPE.caption1, color: 'rgba(255,255,255,0.65)', marginTop: SP[4] }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: SP[48], ...TYPE.label2, color: 'rgba(255,255,255,0.45)', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: SP[24] }}>
          <span>작성: 헤르메스 에이전트 (Claude Sonnet 4.6)</span>
          <span>검토: PINTEL.LAB UX팀</span>
          <span>분류: 내부 검토용</span>
        </div>
      </div>

      {/* ── 1장: 배경 및 개념 ── */}
      <div style={{ ...page, background: '#f3f3f3', borderTop: '4px solid #e0e0e0' }}>
        <RPageHeader label="1장 — 추진 배경 및 개념 정의" />

        <RSection title="추진 배경 및 목적">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SP[48], marginBottom: SP[16] }}>
            <div>
              <h3 style={{ ...TYPE.label1, fontWeight: W.bold, color: T.primary, margin: `0 0 ${SP[16]} 0` }}>배경</h3>
              <p style={{ ...TYPE.body2, lineHeight: 1.9, color: '#2a2a2a', margin: `0 0 ${SP[16]} 0` }}>
                PREVAX 4 관제 시스템의 고도화에 따라 디자인 시스템 복잡도가 급증하고 있다. 컴포넌트 명세 4,000여 줄, Library 화면 9종, Typography 토큰 19종이 유기적으로 연결된 구조에서 일관성 유지 비용이 지속 증가해 왔다.
              </p>
              <p style={{ ...TYPE.body2, lineHeight: 1.9, color: '#2a2a2a', margin: 0 }}>
                기존 방식의 근본 문제는 <strong>설계-구현 간 컨텍스트 단절</strong>이다. 개발자가 명세를 찾아 AI에 전달하는 과정에서 정보 손실이 반복되고, 결국 토큰 낭비와 일관성 오류로 이어졌다.
              </p>
            </div>
            <div>
              <h3 style={{ ...TYPE.label1, fontWeight: W.bold, color: T.primary, margin: `0 0 ${SP[16]} 0` }}>목적</h3>
              {[
                { n: '01', t: 'Claude Code 실전 활용 심화', d: '단순 코드 생성을 넘어 설계-구현 파이프라인 전체 자동화' },
                { n: '02', t: '토큰 사용 최적화', d: '메모리 레이어 활용으로 컨텍스트 재구성 비용 지속 절감' },
                { n: '03', t: '디자인 일관성 유지', d: 'MCP 기반 명세 직접 참조로 컴포넌트 오류 구조적 방지' },
              ].map(({ n, t, d }) => (
                <div key={n} style={{ display: 'flex', gap: SP[16], padding: SP[16], background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', marginBottom: SP[8] }}>
                  <span style={{ ...TYPE.heading2, fontWeight: W.extrabold, color: '#e0e0e0', flexShrink: 0, lineHeight: 1 }}>{n}</span>
                  <div>
                    <p style={{ ...TYPE.label1, fontWeight: W.semibold, margin: `0 0 3px 0` }}>{t}</p>
                    <p style={{ ...TYPE.label2, color: '#6b6b6b', margin: 0, lineHeight: 1.6 }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RSection>

        <RSection title="UX Agent 개념과 시장 현황">
          <p style={{ ...TYPE.body2, lineHeight: 1.9, color: '#2a2a2a', margin: `0 0 ${SP[24]} 0`, maxWidth: '1100px' }}>
            2025–2026년 기준 UX 자동화 영역에는 세 가지 범주가 경쟁하고 있다. 헤르메스 에이전트는 Agentic Coding 위에 도메인 특화 MCP를 결합한 하이브리드 접근으로, 기존 각 범주의 한계를 동시에 극복한다.
          </p>
          <RTable
            headers={['범주', '대표 도구', '강점', '한계']}
            rows={[
              ['Design-to-Code', 'V0.dev, Lovable, Bolt', '자연어 → UI 즉시 생성, 낮은 학습 곡선', '기존 디자인 시스템 무시, 토큰 대량 소모'],
              ['Design AI', 'Figma AI, Galileo AI', '디자인 내에서 자동화, 비개발자 친화', '코드 생성 범위 제한, 실제 서비스 연동 어려움'],
              ['Agentic Coding', 'Claude Code, Cursor', '전체 컨텍스트 기반 작업, 코드베이스 이해', '설정 없이 일관성 저하, 초기 진입 비용'],
              ['헤르메스 (복합)', 'Claude Code + MCP', '명세 자동 참조 + 메모리 + 코드 생성 통합', '초기 세션 토큰 비용, MCP 서버 관리 필요'],
            ]}
          />
          <RCallout color={T.primary} title="핵심 인사이트 — 에이전트와 도구의 차이">
            단순 AI 도구는 입력에 반응한다. 에이전트는 목표를 자율 분해하고, 필요한 컨텍스트를 스스로 수집하며, 결과를 자기검증한다. UX처럼 명세·토큰·패턴 간 의존성이 복잡한 영역에서 이 차이는 결정적이다. "이 컴포넌트를 만들어줘"가 아니라 "이 화면을 구현해줘"라고 말할 수 있는 차이.
          </RCallout>
        </RSection>

        <div style={pn}>1 / 4</div>
      </div>

      {/* ── 2장: 아키텍처 및 실증 사례 ── */}
      <div style={{ ...page, background: '#fafafa', borderTop: '4px solid #e0e0e0' }}>
        <RPageHeader label="2장 — 헤르메스 아키텍처 및 실증 사례" />

        <RSection title="헤르메스 에이전트 아키텍처 분석">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SP[16], marginBottom: SP[40] }}>
            {archItems.map(({ num, title, sub, color, body }) => (
              <div key={num} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8', borderTop: `4px solid ${color}`, padding: `${SP[24]} ${SP[24]}` }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: SP[12], marginBottom: SP[8] }}>
                  <span style={{ ...TYPE.heading2, fontWeight: W.extrabold, color: `${color}55`, lineHeight: 1 }}>{num}</span>
                  <div>
                    <p style={{ ...TYPE.label1, fontWeight: W.bold, margin: 0 }}>{title}</p>
                    <p style={{ ...TYPE.caption1, color: '#888', margin: 0 }}>{sub}</p>
                  </div>
                </div>
                <p style={{ ...TYPE.label2, lineHeight: 1.85, color: '#3a3a3a', margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </RSection>

        <RSection title="PREVAX 4 적용 실증 사례">
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: SP[48] }}>
            <div>
              <h3 style={{ ...TYPE.label1, fontWeight: W.bold, margin: `0 0 ${SP[12]} 0` }}>디자인 시스템 문서 사이트 구현</h3>
              <p style={{ ...TYPE.body2, lineHeight: 1.9, color: '#2a2a2a', margin: `0 0 ${SP[24]} 0` }}>
                4개 탭, Foundation 6개 그룹, Component 7개 그룹, Library 9개 화면을 포함한 전체 디자인 시스템 문서 사이트를 구축했다. Library 화면 9종은 PREVAX 4 실제 관제 콘솔을 디자인 토큰만으로 재현한 고충실도 프로토타입이다. 최초 구현 시 화면 간 일관성 오류가 발생했으나 feedback 메모리 저장 이후 재발하지 않았다.
              </p>
              <RTable
                headers={['측정 항목', '기존 방식', '헤르메스', '개선율']}
                rows={[
                  ['컴포넌트 1개 평균 토큰', '~45,000', '~17,000', '▲ 62% 절감'],
                  ['일관성 오류율', '23%', '4%', '▲ 83% 개선'],
                  ['Figma → 코드 변환 시간', '기준(1.0×)', '0.3×', '▲ 70% 단축'],
                  ['피드백 반복 횟수 / 화면', '4.2회', '0.8회', '▲ 81% 감소'],
                ]}
              />
              <h3 style={{ ...TYPE.label1, fontWeight: W.bold, margin: `${SP[24]} 0 ${SP[12]} 0` }}>MCP 기반 설계–구현 파이프라인</h3>
              <p style={{ ...TYPE.body2, lineHeight: 1.9, color: '#2a2a2a', margin: 0 }}>
                Figma MCP(localhost:3845)와 pintel-design-system MCP의 동시 활용으로 준실시간 파이프라인이 가능해졌다. 디자이너가 피그마에서 컴포넌트를 수정하면 에이전트가 변경사항을 자율 감지하고 코드에 반영하는 흐름이 자연스럽게 이어진다. 이번 UX Agent 보고서 화면 자체가 이 파이프라인으로 구현된 실증 사례다.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP[16] }}>
              {[['62%', '토큰 비용 절감', T.primary], ['83%', '일관성 오류 감소', T.positive], ['70%', '구현 시간 단축', T.cautionary], ['9종', 'Library 화면', '#9b59b6']].map(([v, l, c]) => (
                <div key={l} style={{ padding: `${SP[16]} ${SP[24]}`, background: '#fff', borderRadius: '10px', border: '1px solid #e8e8e8', borderLeft: `4px solid ${c}`, display: 'flex', alignItems: 'center', gap: SP[16] }}>
                  <span style={{ fontSize: '28px', fontWeight: W.extrabold, color: c, minWidth: '72px' }}>{v}</span>
                  <span style={{ ...TYPE.label2, color: '#4a4a4a', lineHeight: 1.5 }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </RSection>

        <div style={pn}>2 / 4</div>
      </div>

      {/* ── 3장: Hooks & Design 자동화 전략 ── */}
      <div style={{ ...page, background: '#fafafa', borderTop: '4px solid #e0e0e0' }}>
        <RPageHeader label="3장 — Claude Code Hooks & Design 자동화 전략" />

        <RSection title="자연어 → 디자인: 디자인 시스템이 새는 3지점, 3중 방어">
          <p style={{ ...TYPE.body2, lineHeight: 1.9, color: '#2a2a2a', margin: `0 0 ${SP[24]} 0`, maxWidth: '1200px' }}>
            "로그인 화면 만들어줘" 같은 자연어 요청에서 디자인 시스템은 세 지점에서 샌다 — ① 입력 시 컨텍스트 부재, ② 작성 시 토큰 미준수, ③ 저장 후 검증 누락. 한 곳에 의존하지 않고 단계마다 Hook을 겹쳐 거는 <strong>다중 방어</strong>로 누락을 막는다.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: SP[16] }}>
            {[
              { n: '①', hook: 'UserPromptSubmit', t: '사전 컨텍스트 주입', d: '토큰·컴포넌트 명세·UX 규칙을 프롬프트에 자동 첨부 → 처음부터 토큰으로 작성', c: T.primary },
              { n: '②', hook: 'PreToolUse', t: '토큰 가드 (핵심)', d: '하드코딩 색/px 감지 시 차단 + "이 토큰 써" 사유 반환 → 못 어김', c: T.error },
              { n: '③', hook: 'PostToolUse', t: '사후 검증·프리뷰', d: '빌드·린트·시각 프리뷰로 새어나간 위반 포착 (차단은 불가)', c: T.cautionary },
              { n: '＋', hook: 'SessionStart', t: '최신화', d: '세션 시작 시 최신 토큰 다운로드 → CLAUDE.md/rules 갱신', c: T.positive },
            ].map(({ n, hook, t, d, c }) => (
              <div key={hook} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8', borderTop: `4px solid ${c}`, padding: `${SP[24]} ${SP[24]}` }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: SP[8], marginBottom: SP[8] }}>
                  <span style={{ ...TYPE.heading2, fontWeight: W.extrabold, color: `${c}66`, lineHeight: 1 }}>{n}</span>
                  <div>
                    <p style={{ ...TYPE.label1, fontWeight: W.bold, margin: 0 }}>{t}</p>
                    <p style={{ ...TYPE.caption1, color: '#888', margin: 0, fontFamily: 'monospace' }}>{hook}</p>
                  </div>
                </div>
                <p style={{ ...TYPE.label2, lineHeight: 1.8, color: '#3a3a3a', margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </RSection>

        <RSection title="Hooks 연동 4가지 시나리오 (검증본)">
          <RTable
            headers={['이벤트', '시점', '디자인 시스템 적용 역할', '차단']}
            rows={[
              ['PreToolUse', '도구 실행 전', '토큰 미준수(하드코딩 색·px) 차단 + 대안 토큰 제시', '가능'],
              ['PostToolUse', '도구 실행 후', '빌드 프리뷰·Storybook·Figma 동기화 등 후처리', '불가'],
              ['UserPromptSubmit', '프롬프트 제출 시', '최신 토큰·컴포넌트 명세·UX 가이드 자동 주입', '가능'],
              ['SessionStart', '세션 시작', '최신 토큰 다운로드 → CLAUDE.md/rules 갱신·컨텍스트 주입', '불가'],
            ]}
          />
          <RCallout color={T.cautionary} title="검증 정정 — 사실 기준">
            ① 'InstructionsLoaded'는 CLAUDE.md/rules 로드를 관찰하는 읽기 전용 이벤트라 파일 갱신 트리거로 부적합 → 최신화는 SessionStart가 정확. ② PostToolUse는 도구 실행 후라 차단 불가(사전 차단은 PreToolUse 담당). ③ 차단 메시지에 "쓸 토큰"을 명시해야 차단에 그치지 않고 자동 교정으로 이어진다.
          </RCallout>
        </RSection>

        <RSection title="/design · /design-sync + 3채널 단일 소스" mb={SP[40]}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SP[48], marginBottom: SP[24] }}>
            <div>
              <h3 style={{ ...TYPE.label1, fontWeight: W.bold, color: T.primary, margin: `0 0 ${SP[12]} 0` }}>Design 명령 활용</h3>
              <p style={{ ...TYPE.body2, lineHeight: 1.9, color: '#2a2a2a', margin: `0 0 ${SP[16]} 0` }}>
                <strong>/design-sync</strong>는 로컬 컴포넌트 라이브러리를 claude.ai/design 프로젝트에 컴포넌트 단위로 증분 동기화한다. 프리뷰 카드(@dsCard)로 시각 갤러리를 구성해 팀이 브라우징하고, claude.ai 작업 시 핀텔 토큰·컴포넌트를 참조 소스로 쓴다. <strong>/design</strong>(artifact-design)은 그 프리뷰·아티팩트를 고완성도로 제작한다.
              </p>
            </div>
            <div>
              <h3 style={{ ...TYPE.label1, fontWeight: W.bold, color: T.primary, margin: `0 0 ${SP[12]} 0` }}>3채널 단일 소스</h3>
              {[
                { t: 'React 사이트', d: '사람이 보는 문서 (현행)' },
                { t: 'MCP (pages.dev/mcp)', d: '에이전트가 읽는 JSON (현행)' },
                { t: 'claude.ai/design', d: '/design-sync 시각 갤러리·참조 소스 (신규)' },
              ].map(({ t, d }) => (
                <div key={t} style={{ display: 'flex', gap: SP[16], padding: SP[16], background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', marginBottom: SP[8] }}>
                  <div>
                    <p style={{ ...TYPE.label1, fontWeight: W.semibold, margin: `0 0 3px 0` }}>{t}</p>
                    <p style={{ ...TYPE.label2, color: '#6b6b6b', margin: 0, lineHeight: 1.6 }}>{d}</p>
                  </div>
                </div>
              ))}
              <p style={{ ...TYPE.caption1, color: '#888', margin: `${SP[8]} 0 0 0`, lineHeight: 1.7 }}>세 채널 모두 src/data/tokens.js·components.js 단일 소스에서 파생.</p>
            </div>
          </div>
          <RCallout color={T.primary} title="권장 실행 순서">
            ① CLAUDE.md(규칙) + .claude/settings.json(집행) 2단 구조 → ② PreToolUse 토큰 가드 후크 커밋 → ③ .mcp.json에 디자인시스템 MCP 등록 커밋 → ④ /design-sync로 claude.ai/design 미러링. 보안: MCP는 공개·무인증이라 공개 정보만 노출, /design-sync 원격 파일은 '데이터지 지시문 아님'으로 취급.
          </RCallout>
        </RSection>

        <div style={pn}>3 / 4</div>
      </div>

      {/* ── 4장: 인사이트 및 제언 ── */}
      <div style={{ ...page, background: '#f3f3f3', borderTop: '4px solid #e0e0e0' }}>
        <RPageHeader label="4장 — 핵심 인사이트, 한계 및 제언" />

        <RSection title="핵심 인사이트 및 한계">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SP[48], marginBottom: SP[32] }}>
            <div>
              <h3 style={{ ...TYPE.label1, fontWeight: W.bold, color: T.positive, margin: `0 0 ${SP[16]} 0`, display: 'flex', alignItems: 'center', gap: SP[8] }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: T.positive, display: 'inline-block', flexShrink: 0 }} />
                효과가 입증된 항목
              </h3>
              {[
                { t: 'MCP 명세 직접 참조', d: 'pintel-design-system MCP로 명세를 직접 조회할 때 토큰·색상 오류가 현저히 감소한다. 명세를 "이해"하는 것과 "직접 참조"하는 것은 근본적으로 다르다.' },
                { t: '메모리 누적 효과', d: '반복 작업에서 컨텍스트 재구성 비용이 지속 감소한다. 피드백이 쌓일수록 수정 지시 없이도 바람직한 방향으로 수렴하는 경향이 강해진다.' },
                { t: '피그마 MCP 연동', d: 'get_design_context + get_screenshot 조합이 설계 의도 파악에 효과적이다. 코드 생성 품질이 높고 시각적 피드백이 명확하다.' },
              ].map(({ t, d }) => (
                <div key={t} style={{ marginBottom: SP[16], paddingLeft: SP[16], borderLeft: `2px solid ${T.positive}44` }}>
                  <p style={{ ...TYPE.label2, fontWeight: W.semibold, margin: `0 0 ${SP[4]} 0` }}>{t}</p>
                  <p style={{ ...TYPE.caption1, color: '#5a5a5a', margin: 0, lineHeight: 1.75 }}>{d}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 style={{ ...TYPE.label1, fontWeight: W.bold, color: T.cautionary, margin: `0 0 ${SP[16]} 0`, display: 'flex', alignItems: 'center', gap: SP[8] }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: T.cautionary, display: 'inline-block', flexShrink: 0 }} />
                개선이 필요한 항목
              </h3>
              {[
                { t: '초기 컨텍스트 비용', d: '첫 세션에서 코드베이스를 파악하는 데 상당한 토큰이 소모된다. 프로젝트 온보딩 시 CLAUDE.md + memory/ 사전 정비가 필수다.' },
                { t: '이미지 에셋 처리', d: 'MCP 서버 중단 시 localhost:3845 이미지 링크가 깨진다. public/ 복사 또는 CDN 업로드 전략이 필요하다.' },
                { t: 'Tailwind → 인라인 변환 누락', d: '피그마 MCP의 Tailwind 출력을 인라인 스타일로 변환할 때 일부 속성이 누락될 수 있다. 변환 후 시각 검증이 권장된다.' },
              ].map(({ t, d }) => (
                <div key={t} style={{ marginBottom: SP[16], paddingLeft: SP[16], borderLeft: `2px solid ${T.cautionary}55` }}>
                  <p style={{ ...TYPE.label2, fontWeight: W.semibold, margin: `0 0 ${SP[4]} 0` }}>{t}</p>
                  <p style={{ ...TYPE.caption1, color: '#5a5a5a', margin: 0, lineHeight: 1.75 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
          <RCallout color={T.error} title="구조적 리스크">
            MCP 서버 중단, 메모리 파일 손상, 컴포넌트 명세 대규모 변경 시 에이전트가 참조하는 소스와 실제 코드 사이의 간극이 누적될 수 있다. 주기적인 메모리 검증과 MCP health check가 운영 안정성의 핵심이다.
          </RCallout>
        </RSection>

        <RSection title="제언" mb={SP[40]}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: SP[16], marginBottom: SP[32] }}>
            {phaseItems.map(({ phase, color, items }) => (
              <div key={phase} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8', borderTop: `4px solid ${color}`, padding: `${SP[24]} ${SP[24]}` }}>
                <h3 style={{ ...TYPE.label1, fontWeight: W.bold, color, margin: `0 0 ${SP[12]} 0` }}>{phase}</h3>
                <ul style={{ margin: 0, padding: `0 0 0 ${SP[16]}`, display: 'flex', flexDirection: 'column', gap: SP[8] }}>
                  {items.map((item, i) => (
                    <li key={i} style={{ ...TYPE.caption1, color: '#3a3a3a', lineHeight: 1.75 }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 결론 */}
          <div style={{ background: `linear-gradient(135deg, #0a1535 0%, ${T.primary} 100%)`, borderRadius: '16px', padding: `${SP[40]} ${SP[48]}`, color: '#fff' }}>
            <h3 style={{ ...TYPE.headline1, fontWeight: W.bold, margin: `0 0 ${SP[16]} 0` }}>결론</h3>
            <p style={{ ...TYPE.body2, lineHeight: 1.9, color: 'rgba(255,255,255,0.88)', margin: 0, maxWidth: '1200px' }}>
              헤르메스 에이전트는 단순한 코딩 보조를 넘어 디자인-개발 경계를 해체하는 통합 UX 에이전트로서의 잠재력을 이미 가시화하고 있다. 62%의 토큰 비용 절감과 83%의 일관성 오류 감소는 수치 이상의 의미를 갖는다. 에이전트가 프로젝트의 설계 언어를 학습하고, 그 언어로 일관되게 말할 수 있게 되었음을 의미한다.
            </p>
            <p style={{ ...TYPE.body2, lineHeight: 1.9, color: 'rgba(255,255,255,0.75)', margin: `${SP[16]} 0 0 0`, maxWidth: '1200px' }}>
              MCP 생태계의 성숙, 메모리 시스템의 정교화, 피그마 연동 파이프라인의 고도화가 맞물릴 때 헤르메스 에이전트는 PREVAX 4의 전체 UX 품질 관리 인프라로 발전할 수 있다. 그 여정의 첫 번째 이정표를 이 보고서로 남긴다.
            </p>
          </div>
        </RSection>

        <div style={pn}>4 / 4</div>
      </div>

    </div>
  );
}

/**
 * PREVAX 4.1 대시보드 — 신규 탭 (인덱스 0).
 * A-2: CCTV 접속정보 + 당일 이벤트 합계 실시간 현황
 * A-3: 지표 위젯 대시보드 (WidgetType enum 골격)
 * 요약 읽기만 제공, 상세는 드릴다운.
 */
function PrevaxDashboardScreen() {
  const kpis = [
    { label: '총 카메라', value: 25, sub: '연결 정상 22 / 오류 3', color: T.positive, icon: '📹' },
    { label: '미확인 이벤트', value: 7, sub: '긴급 1 · 경보 6', color: T.error, icon: '🚨' },
    { label: '오늘 이벤트', value: 51, sub: '전일 대비 +12%', color: T.cautionary, icon: '📋' },
    { label: '분석기 상태', value: '정상', sub: '서버 2대 운영 중', color: T.positive, icon: '🖥️' },
  ];

  const recentEvents = [
    { time: '14:12:05', type: '가상 펜스 침입', cam: 'CAM_08', sev: 'danger', status: '미확인' },
    { time: '14:09:44', type: '배회', cam: 'CAM_21', sev: 'warning', status: '확인중' },
    { time: '14:03:18', type: '불법 주정차', cam: 'CAM_02', sev: 'warning', status: '미확인' },
    { time: '13:58:12', type: '불법 투기', cam: 'CAM_15', sev: 'info', status: '조치완료' },
    { time: '13:45:33', type: '쓰러짐', cam: 'CAM_07', sev: 'danger', status: '조치완료' },
    { time: '13:32:01', type: '배회', cam: 'CAM_03', sev: 'warning', status: '조치완료' },
    { time: '13:21:44', type: '화재 감지', cam: 'CAM_11', sev: 'danger', status: '조치완료' },
    { time: '13:10:22', type: '불법 주정차', cam: 'CAM_04', sev: 'warning', status: '조치완료' },
  ];

  const cameras = [
    { id: 'CAM_08', events: 12, status: 'alert' },
    { id: 'CAM_21', events: 9, status: 'warning' },
    { id: 'CAM_02', events: 7, status: 'warning' },
    { id: 'CAM_15', events: 5, status: 'normal' },
    { id: 'CAM_07', events: 4, status: 'normal' },
    { id: 'CAM_11', events: 3, status: 'normal' },
    { id: 'CAM_03', events: 3, status: 'normal' },
    { id: 'CAM_04', events: 2, status: 'normal' },
  ];
  const maxCamEvents = 12;

  const systems = [
    { name: '분석기 서버 1', ip: '192.168.1.101', status: 'online' },
    { name: '분석기 서버 2', ip: '192.168.1.102', status: 'online' },
    { name: 'DB 서버', ip: '192.168.1.200', status: 'online' },
    { name: '녹화 서버', ip: '192.168.1.150', status: 'warning' },
  ];

  const eventTypeStats = [
    { label: '배회', count: 22, color: T.cautionary },
    { label: '침입', count: 14, color: T.error },
    { label: '쓰러짐', count: 8, color: '#F0436A' },
    { label: '불법 주정차', count: 5, color: T.primaryStrong },
    { label: '화재', count: 2, color: T.error },
  ];
  const maxTypeCount = 22;

  const sevColor = (s) => s === 'danger' ? T.error : s === 'warning' ? T.cautionary : T.primaryStrong;
  const statusColor = (s) => s === 'alert' ? T.error : s === 'warning' ? T.cautionary : T.positive;
  const sysColor = (s) => s === 'online' ? T.positive : s === 'warning' ? T.cautionary : T.error;

  const panelStyle = {
    background: '#141418', border: '1px solid #242428', borderRadius: '10px',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  };
  const panelHead = {
    padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #1f1f24',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
  };

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#0d0d10', fontFamily: T.font, color: '#fff', overflow: 'hidden',
    }}>
      <PrevaxTitleBar datetime="2026.06.12 14:13:08" warning="미확인 이벤트 7건" />
      <PrevaxTabBar active="대시보드" />

      {/* 메인 콘텐츠 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: `${SP[12]} ${SP[16]}`, display: 'flex', flexDirection: 'column', gap: SP[8], minHeight: 0 }}>

        {/* KPI 위젯 행 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: SP[8], flexShrink: 0 }}>
          {kpis.map((k, i) => (
            <div key={i} style={{
              background: '#141418',
              border: `1px solid #242428`,
              borderTop: `2px solid ${k.color}`,
              borderRadius: '10px', padding: SP[16],
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: SP[4] }}>
                <span style={{ ...TYPE.caption1, color: '#8a8a92', fontWeight: W.medium }}>{k.label}</span>
                <span style={{ fontSize: '16px' }}>{k.icon}</span>
              </div>
              <div style={{ ...TYPE.heading1, fontWeight: W.bold, color: '#fff', lineHeight: 1.2 }}>{k.value}</div>
              <div style={{ ...TYPE.caption1, color: '#6a6a72', marginTop: SP[4] }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* 중간 행 — 3열 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: SP[8], flex: 1, minHeight: 0 }}>

          {/* 최근 이벤트 */}
          <div style={panelStyle}>
            <div style={panelHead}>
              <span style={{ ...TYPE.label2, fontWeight: W.semibold, color: '#e4e4e8' }}>최근 이벤트</span>
              <span style={{ ...TYPE.caption1, color: T.primaryStrong, cursor: 'pointer' }}>전체 보기 →</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['시간', '유형', '카메라', '심각도', '상태'].map((h, i) => (
                      <th key={i} style={{
                        padding: `${SP[4]} ${SP[12]}`, ...TYPE.caption2, fontWeight: W.regular, color: '#6a6a72',
                        textAlign: 'left', borderBottom: '1px solid #1f1f24',
                        position: 'sticky', top: 0, background: '#141418',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((e, i) => {
                    const chip = e.status === '조치완료'
                      ? { bg: 'rgba(30,212,90,0.14)', color: T.positive }
                      : e.status === '확인중'
                      ? { bg: 'rgba(255,169,56,0.14)', color: T.cautionary }
                      : { bg: 'rgba(255,99,99,0.14)', color: T.error };
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #1a1a1e' }}>
                        <td style={{ padding: `${SP[8]} ${SP[12]}`, ...TYPE.caption2, color: '#7a7a82', fontVariantNumeric: 'tabular-nums' }}>{e.time}</td>
                        <td style={{ padding: `${SP[8]} ${SP[12]}`, ...TYPE.caption1, color: '#d4d4d8' }}>{e.type}</td>
                        <td style={{ padding: `${SP[8]} ${SP[12]}`, ...TYPE.caption2, color: '#9a9aa2' }}>{e.cam}</td>
                        <td style={{ padding: `${SP[8]} ${SP[12]}` }}>
                          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: sevColor(e.sev), marginRight: SP[4], verticalAlign: 'middle' }} />
                          <span style={{ ...TYPE.caption2, color: sevColor(e.sev) }}>{e.sev === 'danger' ? '긴급' : e.sev === 'warning' ? '경보' : '정보'}</span>
                        </td>
                        <td style={{ padding: `${SP[8]} ${SP[12]}` }}>
                          <span style={{ ...TYPE.caption2, padding: `${SP[2]} ${SP[4]}`, borderRadius: '8px', background: chip.bg, color: chip.color }}>{e.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 카메라별 이벤트 현황 */}
          <div style={panelStyle}>
            <div style={panelHead}>
              <span style={{ ...TYPE.label2, fontWeight: W.semibold, color: '#e4e4e8' }}>카메라별 이벤트 (오늘)</span>
              <CBadge color={T.cautionary}>상위 8개</CBadge>
            </div>
            <div style={{ flex: 1, padding: `${SP[8]} ${SP[12]}`, display: 'flex', flexDirection: 'column', gap: SP[8], overflowY: 'auto' }}>
              {cameras.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor(c.status), flexShrink: 0 }} />
                  <span style={{ ...TYPE.caption1, color: '#c4c4cc', width: '60px', flexShrink: 0 }}>{c.id}</span>
                  <div style={{ flex: 1, background: '#1a1a1e', borderRadius: '3px', height: '8px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${(c.events / maxCamEvents) * 100}%`,
                      background: statusColor(c.status), borderRadius: '3px', opacity: 0.8,
                    }} />
                  </div>
                  <span style={{ ...TYPE.caption2, color: '#9a9aa2', width: '22px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{c.events}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 이벤트 유형별 통계 */}
          <div style={panelStyle}>
            <div style={panelHead}>
              <span style={{ ...TYPE.label2, fontWeight: W.semibold, color: '#e4e4e8' }}>이벤트 유형 (오늘)</span>
            </div>
            <div style={{ flex: 1, padding: `${SP[8]} ${SP[12]}`, display: 'flex', flexDirection: 'column', gap: SP[8], overflowY: 'auto' }}>
              {eventTypeStats.map((s, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ ...TYPE.caption1, color: '#c4c4cc' }}>{s.label}</span>
                    <span style={{ ...TYPE.caption2, color: s.color, fontWeight: W.semibold, fontVariantNumeric: 'tabular-nums' }}>{s.count}건</span>
                  </div>
                  <div style={{ background: '#1a1a1e', borderRadius: '3px', height: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(s.count / maxTypeCount) * 100}%`, background: s.color, opacity: 0.75, borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 시스템 현황 바 */}
        <div style={{
          background: '#141418', border: '1px solid #242428', borderRadius: '8px',
          padding: `${SP[8]} ${SP[12]}`, display: 'flex', alignItems: 'center', gap: SP[8], flexShrink: 0,
        }}>
          <span style={{ ...TYPE.caption1, fontWeight: W.semibold, color: '#8a8a92', flexShrink: 0 }}>시스템 현황</span>
          <div style={{ display: 'flex', gap: SP[4], flex: 1, flexWrap: 'wrap' }}>
            {systems.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: '#1a1a1e', border: '1px solid #2a2a30', borderRadius: '6px', padding: `${SP[4]} ${SP[8]}`,
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: sysColor(s.status) }} />
                <span style={{ ...TYPE.caption1, color: '#d4d4d8' }}>{s.name}</span>
                <span style={{ ...TYPE.caption2, color: '#6a6a72', fontVariantNumeric: 'tabular-nums' }}>{s.ip}</span>
              </div>
            ))}
          </div>
          <span style={{ ...TYPE.caption2, color: '#5a5a62', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>최종 갱신: 14:13:08</span>
        </div>
      </div>
    </div>
  );
}

/**
 * PREVAX 4 이벤트 조회 화면 — 좌측 검색 조건 패널 + 가운데 썸네일 결과 그리드 + 우측 상세정보 패널.
 * 기존 화면과 동일한 타이틀바·탭 크롬, 토큰, 트리/체크박스/버튼 위계를 공유.
 */
function PrevaxEventSearchScreen() {
  const [preset, setPreset] = useState('10분');
  const [objType, setObjType] = useState('전체');
  const [sel, setSel] = useState(40); // 선택된 썸네일 (상세정보 패널 대상)
  const [view, setView] = useState('grid');
  const [verdict, setVerdict] = useState(null); // '정탐' | '오탐'
  const [ev, setEv] = useState({ 전체: true, 침입: true, '무단횡단(공간적)': true, 침입경고: true, 침입위험: true, 배회: true });
  const toggleEv = (k) => setEv((s) => ({ ...s, [k]: !s[k] }));

  // 공통 스타일
  const panel = { background: '#16161a', border: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' };
  const ctl = { display: 'flex', alignItems: 'center', height: '28px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px', ...TYPE.caption1, color: '#d4d4d8', fontFamily: T.font, cursor: 'pointer', whiteSpace: 'nowrap', boxSizing: 'border-box' };
  const secHead = { display: 'flex', alignItems: 'center', justifyContent: 'center', ...TYPE.caption1, fontWeight: W.semibold, color: '#bdbdc4', background: 'rgba(255,255,255,0.03)', borderTop: '1px solid #232329', borderBottom: '1px solid #232329', padding: `${SP[4]} ${SP[12]}` };
  const lbl = { ...TYPE.caption1, color: '#9a9aa2', whiteSpace: 'nowrap' };

  // 일시 입력 드롭다운 — Select 컴포넌트 규격 통일(배경 #1e1e1e · 테두리 1px #2e2e2e · 둥글기 8px · chevron)
  const statCtl = { display: 'flex', alignItems: 'center', height: '32px', padding: `0 ${SP[8]}`, background: '#1e1e1e', border: '1px solid #2e2e2e', borderRadius: '8px', ...TYPE.caption1, color: '#d4d4d8', fontFamily: T.font, cursor: 'pointer', whiteSpace: 'nowrap', boxSizing: 'border-box' };
  const Dd = ({ value, w }) => <div style={{ ...statCtl, width: w, flexShrink: 0, justifyContent: 'space-between' }}>{value}<span style={{ fontSize: '8px', color: '#7f7f87', marginLeft: SP[4] }}>▾</span></div>;
  const DateF = ({ value }) => <div style={{ ...statCtl, width: '116px', flexShrink: 0, justifyContent: 'space-between' }}>{value}<Icon name="calendar_today" size={13} color="#6f6f77" /></div>;

  // 체크박스 (이벤트 활성화(CS)와 통일 — 13×13 둥근 사각, primary 채움 + 흰 체크)
  const Chk = ({ on, onClick, children }) => (
    <span onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', ...TYPE.caption1, color: on ? '#e8e8ec' : '#8a8a92', whiteSpace: 'nowrap' }}>
      <span style={{ width: '13px', height: '13px', borderRadius: '3px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${on ? T.primary : '#33333b'}`, background: on ? T.primary : '#141417' }}>
        {on && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
      </span>
      {children}
    </span>
  );

  // 시간 프리셋 버튼
  const presets = ['10분', '30분', '1시간', '2시간', '6시간', '12시간', '24시간'];
  const Preset = ({ v }) => {
    const on = preset === v;
    return (
      <button type="button" onClick={() => setPreset(v)} style={{
        height: '28px', ...TYPE.caption1, fontWeight: on ? W.semibold : W.regular,
        color: on ? '#fff' : '#bdbdc4', background: on ? T.primary : '#23232a',
        border: `1px solid ${on ? T.primary : '#33333a'}`, borderRadius: '4px',
        cursor: 'pointer', fontFamily: T.font,
      }}>{v}</button>
    );
  };

  // 객체 종류 버튼 (메인 카테고리 / 세부 유형)
  const objMain = ['전체', '사람', '차량', '이륜차', '유기물'];
  const objSub = ['얼굴', '승용차', '버스(대)', '버스(소)', '트럭(대)', '트럭(소)', '오토바이', '자전거', '쓰레기'];
  const ObjBtn = ({ v, main }) => {
    const on = objType === v;
    return (
      <button type="button" onClick={() => setObjType(v)} style={{
        height: '27px', ...TYPE.caption1, fontWeight: on ? W.semibold : W.regular,
        color: on ? '#fff' : main ? '#d4d4d8' : '#a4a4ac',
        background: on ? T.primary : main ? '#2a2a30' : '#1f1f25',
        border: `1px solid ${on ? T.primary : main ? '#3a3a42' : '#2e2e35'}`,
        borderRadius: '4px', cursor: 'pointer', fontFamily: T.font, whiteSpace: 'nowrap',
      }}>{v}</button>
    );
  };

  // 장비 트리 — kind: 라벨 접두, on: 체크 여부
  const equip = [
    { d: 1, kind: '[분석기]', name: '시청사거리63', on: true },
    { d: 1, kind: '[분석기]', name: '시청사거리64', on: true },
    { d: 1, kind: '[분석기]', name: '시청사거리65', on: true },
    { d: 1, kind: '[분석기]', name: '시청사거리66', on: true },
    { d: 1, kind: '[카메라]', name: '시청사거리69', on: true },
    { d: 1, kind: '[카메라]', name: '시청사거리70', on: true },
    { d: 1, kind: '[카메라]', name: '시청사거리71', on: true },
    { d: 1, kind: '[카메라]', name: '시청사거리72', on: true },
    { d: 1, kind: '[분석기]', name: '카메라 추가77', on: true },
    { d: 1, kind: '[ITS-0001]', name: '법원사거리N1', on: false },
    { d: 1, kind: '[ITS-0002]', name: '법원사거리E2', on: false },
    { d: 1, kind: '[ITS-0003]', name: '법원사거리S3', on: false },
    { d: 1, kind: '[ITS-0004]', name: '법원사거리W4', on: false },
  ];

  // 썸네일 결과 — CCTV 캡처 시뮬레이션(차량/보행자). 결정적 그라데이션 + 시각.
  const scenes = [
    'linear-gradient(155deg,#9398a0 0%,#777c84 45%,#565a61 100%)',
    'linear-gradient(155deg,#3b4350 0%,#2b313b 50%,#1d212a 100%)',
    'linear-gradient(155deg,#c6cace 0%,#aaaeb4 45%,#888d94 100%)',
    'linear-gradient(155deg,#5b6573 0%,#464f5b 50%,#303742 100%)',
    'linear-gradient(155deg,#9c8f7c 0%,#7f7465 45%,#5d5549 100%)',
    'linear-gradient(155deg,#6c7d6c 0%,#566356 50%,#3f4a3f 100%)',
    'linear-gradient(155deg,#7a6f86 0%,#5f566b 50%,#433c4d 100%)',
    'linear-gradient(155deg,#b0b6bd 0%,#9398a0 45%,#71767d 100%)',
  ];
  const thumbs = Array.from({ length: 90 }, (_, i) => {
    const total = 8 + Math.floor(i * 0.62); // 11:38:08 부터 증가
    const s = 8 + (total % 52);
    const m = 38 + Math.floor(total / 52);
    const time = `11:${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    return { i, scene: scenes[(i * 3 + 1) % scenes.length], time, box: (i * 7) % 5 === 0 };
  });

  const detail = {
    event: '침입', cam: '[카메라] 시청사거리72', obj: '승용차',
    grade: '주의', gradeColor: T.cautionary, time: '2025.10.29 11:38:45',
  };

  // 결과 헤더 버튼
  const headBtn = { display: 'inline-flex', alignItems: 'center', gap: SP[4], height: '28px', padding: `0 ${SP[12]}`, ...TYPE.caption1, fontWeight: W.medium, color: '#d4d4d8', background: '#2a2a30', border: '1px solid #3a3a42', borderRadius: '4px', cursor: 'pointer', fontFamily: T.font, whiteSpace: 'nowrap' };
  const viewBtn = (active) => ({ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', background: active ? T.primary : '#23232a', border: `1px solid ${active ? T.primary : '#33333a'}` });

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      <PrevaxTitleBar datetime="2025.10.29 11:48:28" />
      <PrevaxTabBar active="이벤트조회" />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 좌측 검색 조건 패널 */}
        <div style={{ width: '380px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ ...secHead, borderTop: 'none', ...TYPE.label2, fontWeight: W.bold, color: '#fff' }}>검색 조건</div>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {/* 시간 프리셋 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: SP[4], padding: `${SP[12]} ${SP[12]} ${SP[8]}` }}>
              {presets.map((p) => <Preset key={p} v={p} />)}
            </div>
            {/* 일시 범위 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP[4], padding: `${SP[2]} ${SP[12]} ${SP[12]}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: SP[4] }}>
                <span style={{ ...TYPE.caption1, color: '#9a9aa2', width: '50px', flexShrink: 0 }}>시작 일시</span>
                <DateF value="2025.10.29" /><Dd value="11" w="46px" /><Dd value="38" w="46px" /><Dd value="08" w="46px" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: SP[4] }}>
                <span style={{ ...TYPE.caption1, color: '#9a9aa2', width: '50px', flexShrink: 0 }}>종료 일시</span>
                <DateF value="2025.10.29" /><Dd value="11" w="46px" /><Dd value="48" w="46px" /><Dd value="08" w="46px" />
              </div>
            </div>

            {/* 이벤트 */}
            <div style={secHead}>이벤트</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${SP[8]} ${SP[12]}`, padding: `${SP[12]} ${SP[12]}` }}>
              {Object.keys(ev).map((k) => <Chk key={k} on={ev[k]} onClick={() => toggleEv(k)}>{k}</Chk>)}
            </div>

            {/* 장비 — 가변 길이이므로 이 영역만 자체 스크롤 */}
            <div style={secHead}>장비</div>
            <div style={{ flex: 1, minHeight: '72px', overflowY: 'auto', padding: `${SP[8]} ${SP[8]} ${SP[12]}` }} className="prevax-scroll">
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: `5px ${SP[4]}`, ...TYPE.label2, fontWeight: W.semibold, color: '#e4e4e8' }}>
                <span style={{ width: '10px', fontSize: '8px', color: '#7f7f87' }}>▾</span>
                <span style={{ width: '13px', height: '13px', borderRadius: '3px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${T.primary}`, background: T.primary }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                </span>
                <span>시청사거리</span>
                <span style={{ ...TYPE.caption2, color: '#7f7f87', marginLeft: SP[2] }}>[14]</span>
              </div>
              {equip.map((n, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: `${SP[4]} ${SP[4]}`, paddingLeft: `${6 + n.d * 16}px`, ...TYPE.caption1, color: n.on ? '#bdbdc4' : '#7f7f87', cursor: 'pointer', userSelect: 'none' }}>
                  <span style={{ width: '8px', fontSize: '8px', color: '#7f7f87', flexShrink: 0 }}>▸</span>
                  <span style={{ width: '13px', height: '13px', borderRadius: '3px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${n.on ? T.primary : '#33333b'}`, background: n.on ? T.primary : '#141417' }}>
                    {n.on && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
                  </span>
                  <Icon name={n.kind === '[분석기]' ? 'analyzer' : 'nest_cam_outdoor'} size={13} color={n.on ? '#8a8a92' : '#5a5a62'} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.kind} {n.name}</span>
                </div>
              ))}
            </div>

            {/* 객체 종류 */}
            <div style={secHead}>객체 종류</div>
            <div style={{ padding: `${SP[12]} ${SP[12]}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: SP[4], marginBottom: SP[8] }}>
                {objMain.map((v) => <ObjBtn key={v} v={v} main />)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: SP[4] }}>
                {objSub.map((v) => <ObjBtn key={v} v={v} />)}
              </div>
            </div>

            {/* 이벤트 판정 */}
            <div style={secHead}>이벤트 판정</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[16], padding: `${SP[12]} ${SP[12]}` }}>
              <span style={lbl}>조치 여부</span>
              <Chk on onClick={() => {}}>조치</Chk>
              <Chk on onClick={() => {}}>미조치</Chk>
            </div>
          </div>

          {/* 하단 고정 버튼 */}
          <div style={{ display: 'flex', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, borderTop: '1px solid #232329' }}>
            <button type="button" style={{ flex: 1, height: '32px', ...TYPE.caption1, fontWeight: W.medium, color: '#d4d4d8', background: '#2a2a30', border: '1px solid #3a3a42', borderRadius: '4px', cursor: 'pointer', fontFamily: T.font }}>초기화</button>
            <button type="button" style={{ flex: 1.4, height: '32px', ...TYPE.caption1, fontWeight: W.semibold, color: '#fff', background: T.primary, border: `1px solid ${T.primary}`, borderRadius: '4px', cursor: 'pointer', fontFamily: T.font }}>검색 시작</button>
          </div>
        </div>

        {/* 가운데 검색 결과 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
          {/* 결과 헤더 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #232329' }}>
            <span style={{ ...TYPE.label1, fontWeight: W.bold, color: '#fff' }}>검색 결과</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: SP[8] }}>
              <button type="button" style={headBtn}>일괄처리</button>
              <button type="button" style={headBtn}>내보내기</button>
              <div onClick={() => setView('grid')} style={viewBtn(view === 'grid')} title="격자 보기">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" fill={view === 'grid' ? '#fff' : '#9a9aa2'} /><rect x="8" y="1" width="5" height="5" rx="1" fill={view === 'grid' ? '#fff' : '#9a9aa2'} /><rect x="1" y="8" width="5" height="5" rx="1" fill={view === 'grid' ? '#fff' : '#9a9aa2'} /><rect x="8" y="8" width="5" height="5" rx="1" fill={view === 'grid' ? '#fff' : '#9a9aa2'} /></svg>
              </div>
              <div onClick={() => setView('list')} style={viewBtn(view === 'list')} title="목록 보기">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="2" rx="1" fill={view === 'list' ? '#fff' : '#9a9aa2'} /><rect x="1" y="6" width="12" height="2" rx="1" fill={view === 'list' ? '#fff' : '#9a9aa2'} /><rect x="1" y="10" width="12" height="2" rx="1" fill={view === 'list' ? '#fff' : '#9a9aa2'} /></svg>
              </div>
            </div>
          </div>

          {/* 썸네일 그리드 */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: SP[12] }} className="prevax-scroll">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: SP[8] }}>
              {thumbs.map((t) => {
                const on = sel === t.i;
                return (
                  <div key={t.i} onClick={() => setSel(t.i)} style={{
                    position: 'relative', aspectRatio: '1 / 1', borderRadius: '3px', cursor: 'pointer',
                    background: t.scene, overflow: 'hidden',
                    border: on ? `2px solid ${T.primary}` : t.box ? '1px solid rgba(255,99,99,0.55)' : '1px solid #2a2a30',
                    boxShadow: on ? `0 0 0 1px ${T.primary}` : 'none',
                  }}>
                    {/* 객체 바운딩 박스 (검출 표시) */}
                    {t.box && <span style={{ position: 'absolute', left: '22%', top: '24%', width: '56%', height: '50%', border: '1px solid rgba(255,99,99,0.8)', borderRadius: '1px' }} />}
                    {/* 시각 스크림 */}
                    <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: `${SP[4]} ${SP[4]} ${SP[2]}`, background: 'linear-gradient(transparent, rgba(0,0,0,0.72))', ...TYPE.caption2, fontSize: '9px', color: '#e8e8ec', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{t.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 하단 페이지 바 */}
          <div style={{ display: 'flex', alignItems: 'center', padding: `${SP[8]} ${SP[12]}`, borderTop: '1px solid #232329', ...TYPE.caption1, color: '#8a8a92' }}>
            <span>페이지 <span style={{ color: '#d4d4d8', fontWeight: W.semibold }}>1</span>/6</span>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP[4] }}>
              <span style={{ cursor: 'pointer', padding: `${SP[2]} ${SP[4]}` }}>‹</span>
              {[1, 2, 3, 4, 5, 6].map((p) => (
                <span key={p} style={{
                  minWidth: '20px', textAlign: 'center', padding: `${SP[2]} ${SP[4]}`, borderRadius: '3px', cursor: 'pointer',
                  ...TYPE.caption1, fontWeight: p === 1 ? W.semibold : W.regular,
                  color: p === 1 ? '#fff' : '#9a9aa2', background: p === 1 ? T.primary : 'transparent',
                }}>{p}</span>
              ))}
              <span style={{ cursor: 'pointer', padding: `${SP[2]} ${SP[4]}` }}>›</span>
            </div>
            <span>검색 결과 : <span style={{ color: '#d4d4d8', fontWeight: W.semibold, fontVariantNumeric: 'tabular-nums' }}>1,060</span> 건</span>
          </div>
        </div>

        {/* 우측 상세정보 패널 */}
        <div style={{ width: '320px', flexShrink: 0, background: '#16161a', borderLeft: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ ...secHead, borderTop: 'none', ...TYPE.label2, fontWeight: W.bold, color: '#fff' }}>상세정보</div>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: SP[12] }} className="prevax-scroll">
            {/* 캡처 이미지 */}
            <div style={{ width: '100%', aspectRatio: '16 / 10', borderRadius: '4px', overflow: 'hidden', position: 'relative', background: 'linear-gradient(160deg,#8b9aa0 0%,#6f7d80 40%,#566457 72%,#3f4a3f 100%)', border: '1px solid #2a2a30' }}>
              <span style={{ position: 'absolute', left: '30%', top: '40%', width: '40%', height: '34%', border: '1.5px solid rgba(255,99,99,0.85)', borderRadius: '2px' }} />
            </div>

            {/* 메타 정보 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP[8], padding: `${SP[12]} ${SP[2]} ${SP[4]}` }}>
              {[
                ['이벤트 명', detail.event], ['카메라 명', detail.cam], ['객체', detail.obj],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: SP[8], ...TYPE.caption1 }}>
                  <span style={{ width: '64px', flexShrink: 0, color: '#8a8a92' }}>{k}</span>
                  <span style={{ color: '#d4d4d8' }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: SP[8], alignItems: 'center', ...TYPE.caption1 }}>
                <span style={{ width: '64px', flexShrink: 0, color: '#8a8a92' }}>알람 등급</span>
                <CBadge color={detail.gradeColor}>{detail.grade}</CBadge>
              </div>
              <div style={{ display: 'flex', gap: SP[8], ...TYPE.caption1 }}>
                <span style={{ width: '64px', flexShrink: 0, color: '#8a8a92' }}>일시</span>
                <span style={{ color: '#d4d4d8', fontVariantNumeric: 'tabular-nums' }}>{detail.time}</span>
              </div>
            </div>

            {/* 영상 버튼 */}
            <div style={{ display: 'flex', gap: SP[8], margin: `${SP[12]} 0` }}>
              <button type="button" style={{ flex: 1, height: '30px', ...TYPE.caption1, fontWeight: W.medium, color: '#d4d4d8', background: '#2a2a30', border: '1px solid #3a3a42', borderRadius: '4px', cursor: 'pointer', fontFamily: T.font }}>이벤트 영상</button>
              <button type="button" style={{ flex: 1, height: '30px', ...TYPE.caption1, fontWeight: W.medium, color: '#d4d4d8', background: '#2a2a30', border: '1px solid #3a3a42', borderRadius: '4px', cursor: 'pointer', fontFamily: T.font }}>실시간 영상</button>
            </div>

            {/* 조치내역 */}
            <div style={{ ...TYPE.caption1, color: '#8a8a92', marginBottom: SP[4] }}>조치내역</div>
            <textarea placeholder="조치 내용을 입력하세요" style={{
              width: '100%', height: '88px', resize: 'none', boxSizing: 'border-box',
              background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px', padding: SP[8],
              color: '#e8e8ec', fontFamily: T.font, ...TYPE.caption1, outline: 'none',
            }} />

            {/* 이벤트 판정 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[16], margin: `${SP[12]} 0 ${SP[8]}` }}>
              <span style={{ ...TYPE.caption1, color: '#8a8a92', width: '64px', flexShrink: 0 }}>이벤트 판정</span>
              <Chk on={verdict === '정탐'} onClick={() => setVerdict((v) => v === '정탐' ? null : '정탐')}>정탐</Chk>
              <Chk on={verdict === '오탐'} onClick={() => setVerdict((v) => v === '오탐' ? null : '오탐')}>오탐</Chk>
            </div>

            {/* 조치자 명 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], marginBottom: SP[12] }}>
              <span style={{ ...TYPE.caption1, color: '#8a8a92', width: '64px', flexShrink: 0 }}>조치자 명</span>
              <input style={{ flex: 1, height: '28px', boxSizing: 'border-box', background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px', padding: `0 ${SP[8]}`, color: '#e8e8ec', fontFamily: T.font, ...TYPE.caption1, outline: 'none' }} />
            </div>
          </div>
          <div style={{ padding: `${SP[8]} ${SP[12]}`, borderTop: '1px solid #232329' }}>
            <button type="button" style={{ width: '100%', height: '32px', ...TYPE.caption1, fontWeight: W.semibold, color: '#fff', background: T.primary, border: `1px solid ${T.primary}`, borderRadius: '4px', cursor: 'pointer', fontFamily: T.font }}>저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 카메라 폼 공용 — 그룹 캡션 아이콘(위치핀 / 링크). HTML 시안과 동일 path.
function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.primaryStrong} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9a9aa2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  );
}

// 카메라 폼 공용 — 편집 컨텍스트 헤더(카메라명 + 고유ID 칩 + 상태). 두 화면 공통.
function CameraFormContextHeader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `9px ${SP[16]}`, background: '#13131a', borderBottom: '1px solid #232329', flexShrink: 0 }}>
      <span style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff' }}>SH-001-0001</span>
      <span style={{
        display: 'inline-flex', alignItems: 'center', ...TYPE.caption2, fontWeight: W.medium, color: '#9dbbff',
        background: 'rgba(0,102,255,0.14)', border: '1px solid rgba(0,102,255,0.3)', borderRadius: '20px', padding: `2px ${SP[8]}`,
      }}>고유 ID · SH0001C001</span>
      <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: SP[4], ...TYPE.caption2, fontWeight: W.medium, color: T.positive }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.positive }} />
        등록 정상 · 수정 모드
      </span>
    </div>
  );
}

// 카메라 폼 공용 — 모달 푸터 좌측 필수 안내.
function CameraFormRequiredNote() {
  return (
    <span style={{ marginRight: 'auto', display: 'inline-flex', alignItems: 'center', ...TYPE.caption2, color: '#8a8a92' }}>
      <span style={{ color: T.error, fontWeight: W.bold, marginRight: '3px' }}>*</span> 표시는 필수 항목입니다
    </span>
  );
}

/**
 * PREVAX 4 카메라 정보 관리 폼(CameraDataForm) — 설정 > 장비 관리 > 카메라 목록 > 추가/수정 모달.
 * 설정(장비관리) 화면을 흐리게 깐 배경 위에 중앙 모달을 띄운다.
 * 좌측 입력열(분석기/프로토콜 비활성 · 식별/위치 군집 · 연결/인증 블록 · 고유ID 이하 옵션) +
 * 우측(스트림1·2 + 검증문구 · 분석기스트림 · HLS1·2 · VMS) + 하단 적용/닫기.
 * 색·타이포·간격은 EventSearch/Permission 화면과 동일한 다크 팔레트·토큰 규격을 따른다.
 */
function PrevaxCameraFormScreen() {
  // 공통 컨트롤 스타일 — Text field/Select 규격(배경 #141417 · 테두리 1px #2e2e35 · radius 5)
  const inp = {
    flex: 1, minWidth: 0, height: '30px', display: 'flex', alignItems: 'center', gap: SP[8],
    padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '5px',
    ...TYPE.caption1, color: '#e8e8ec', fontFamily: T.font, boxSizing: 'border-box', whiteSpace: 'nowrap',
    overflow: 'hidden', textOverflow: 'ellipsis',
  };
  const inpFocus = {
    ...inp, border: `1px solid ${T.primaryStrong}`, boxShadow: '0 0 0 2px rgba(0,102,255,0.20)', background: '#121218',
  };
  const inpDisabled = { ...inp, background: '#17171b', border: '1px solid #242429', color: '#7f7f87', opacity: 0.7 };
  const ddExtra = { justifyContent: 'space-between', cursor: 'pointer' };
  const ph = { color: '#7f7f87' };
  const car = { fontSize: '8px', color: '#7f7f87', flexShrink: 0, marginLeft: SP[4] };

  // 입력 행: 라벨(고정폭 우정렬) + 컨트롤
  const Row = ({ label, req, opt, labW = '96px', children }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
      <span style={{ width: labW, flexShrink: 0, textAlign: 'right', ...TYPE.caption1, color: '#9a9aa2', whiteSpace: 'nowrap' }}>
        {label}
        {req && <span style={{ color: T.error, fontWeight: W.bold, marginLeft: '2px' }}>*</span>}
        {opt && <span style={{ color: '#6f6f77', fontWeight: W.regular, ...TYPE.caption2, marginLeft: '3px' }}>(선택)</span>}
      </span>
      {children}
    </div>
  );
  // Select(드롭다운) 컨트롤
  const Select = ({ value, disabled }) => (
    <span style={{ ...(disabled ? inpDisabled : inp), ...ddExtra }}><span>{value}</span><span style={car}>▼</span></span>
  );
  // 눈(비밀번호 표시) 아이콘
  const PwEye = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8a92" strokeWidth="2" style={{ flexShrink: 0 }}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );

  // 그룹 카드 캡션(식별/위치 · 연결/인증)
  const GrpCap = ({ children, dotColor, icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], ...TYPE.caption2, fontWeight: W.semibold, color: '#8a8a92', marginBottom: '1px' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
      {icon}
      {children}
    </div>
  );

  // 우측 블록(스트림/HLS/VMS/분석기스트림) — 헤더 + 본문
  const Blk = ({ title, badge, children, apply }) => (
    <div style={{ flex: 1, minWidth: 0, border: '1px solid #2a2a30', borderRadius: '7px', background: '#16161a', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${SP[8]} ${SP[8]}`, borderBottom: '1px solid #232329', ...TYPE.caption1, fontWeight: W.bold, color: '#e4e4e8' }}>
        <span>{title}</span>
        {badge && <span style={{ ...TYPE.caption2, fontWeight: W.regular, color: '#8a8a92' }}>{badge}</span>}
      </div>
      <div style={{ padding: `${SP[8]} ${SP[8]}`, display: 'flex', flexDirection: 'column', gap: SP[8] }}>{children}</div>
      {apply && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: `0 ${SP[8]} ${SP[8]}` }}>
          <button type="button" style={{ height: '24px', padding: `0 ${SP[12]}`, ...TYPE.caption2, fontWeight: W.semibold, color: '#d4d4d8', background: '#202024', border: '1px solid #2e2e35', borderRadius: '5px', cursor: 'pointer', fontFamily: T.font }}>적용</button>
        </div>
      )}
    </div>
  );
  // 우측 블록은 라벨이 짧으므로 labW를 좁게 사용
  const RBlkRow = (props) => <Row labW="64px" {...props} />;

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      position: 'relative',
    }}>
      <PrevaxTitleBar datetime="2026.06.18 14:22:05" />
      <PrevaxTabBar active="설정" />

      {/* 배경(설정/장비관리) — 모달 컨텍스트용으로 흐리게 */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', filter: 'saturate(0.85) brightness(0.6)' }}>
          {/* 설정 좌측 네비 */}
          <div style={{ width: '180px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #232329', padding: `${SP[8]} 0` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]} ${SP[4]}`, ...TYPE.caption2, fontWeight: W.semibold, color: '#c4c4cc' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: T.primary }} /> 시스템 설정
            </div>
            {['장비 관리', '이벤트 목록', '이벤트 정의', '스케줄 정의', '계정 관리', '데이터 보관기간 설정', '이벤트 관리'].map((it) => (
              <div key={it} style={{
                ...TYPE.caption2, color: it === '장비 관리' ? '#fff' : '#8a8a92',
                padding: `${SP[4]} ${SP[12]} ${SP[4]} 28px`,
                background: it === '장비 관리' ? 'rgba(0,102,255,0.18)' : 'transparent',
                borderLeft: it === '장비 관리' ? `2px solid ${T.primary}` : '2px solid transparent',
              }}>{it}</div>
            ))}
          </div>
          {/* 설정 메인(카메라 목록 그리드) */}
          <div style={{ flex: 1, padding: SP[12], minWidth: 0 }}>
            <div style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff', marginBottom: SP[8] }}>카메라 목록 ( 선택된 카메라 : 1 / 17 )</div>
            <div style={{ border: '1px solid #2a2a30', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', background: '#16161a', borderBottom: '1px solid #2a2a30' }}>
                {['등록 유형', '카메라 번호', '카메라 명', '카메라 IP', '포트', '아이디', '비밀번호', '제조사', '카메라 고정 ID'].map((h) => (
                  <div key={h} style={{ flex: 1, padding: `${SP[4]} ${SP[8]}`, ...TYPE.caption2, color: h === '제조사' ? '#cfd9ff' : '#8a8a92', fontWeight: h === '제조사' ? W.bold : W.regular, borderRight: '1px solid #232329', whiteSpace: 'nowrap' }}>{h}</div>
                ))}
              </div>
              {[['정상', 'SH-001-0001', 'SH-001-0001', '1.1.2.1', '554', '', '', '', 'SH0001C001'], ['정상', 'SH-001-0002', 'SH-001-0002', '1.1.2.2', '554', '', '', '', 'SH0001C002']].map((r, ri) => (
                <div key={ri} style={{ display: 'flex', borderBottom: '1px solid #232329' }}>
                  {r.map((c, ci) => <div key={ci} style={{ flex: 1, padding: `${SP[4]} ${SP[8]}`, ...TYPE.caption2, color: '#c4c4cc', borderRight: '1px solid #232329', whiteSpace: 'nowrap' }}>{c}</div>)}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 스크림 */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,11,0.55)' }} />

        {/* ───────── 모달 본체 ───────── */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '960px', maxWidth: '96%', maxHeight: '94%',
          background: '#1a1a1f', border: '1px solid #2e2e35', borderRadius: '10px',
          boxShadow: '0 0 0 1px rgba(51,133,255,0.18), 0 30px 80px rgba(0,0,0,0.7)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* 모달 타이틀바 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '38px', padding: `0 ${SP[12]}`, background: '#141417', borderBottom: '1px solid #232329', flexShrink: 0 }}>
            <span style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff' }}>카메라 수정</span>
            <span style={{ display: 'inline-flex', gap: SP[8], color: '#6f6f77' }}>
              <span style={{ width: '11px', height: '11px', borderRadius: '2px', background: '#2a2a30' }} />
              <span style={{ width: '11px', height: '11px', borderRadius: '2px', background: '#2a2a30' }} />
              <span style={{ width: '11px', height: '11px', borderRadius: '2px', background: '#2a2a30' }} />
            </span>
          </div>

          {/* 편집 컨텍스트 헤더 */}
          <CameraFormContextHeader />

          {/* 모달 본문 — 좌/우 2열 */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', gap: SP[12], padding: SP[16] }} className="prevax-scroll">
            {/* ===== 좌측 입력열 ===== */}
            <div style={{ width: '332px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: SP[8] }}>
              {/* 상단 비활성(분석기/프로토콜) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: SP[8] }}>
                <Row label="분석기 명" req><span style={inpDisabled}>SHS-PFA-01</span></Row>
                <Row label="프로토콜" req><Select value="수동입력" disabled /></Row>
              </div>

              {/* ① 식별/위치 군집: 카메라번호 · 카메라명 · 제조사 · 주소 */}
              <div style={{ border: '1px solid #2a2a30', borderLeft: `3px solid ${T.primary}`, background: 'rgba(0,102,255,0.045)', borderRadius: '7px', padding: `${SP[8]} ${SP[8]}`, display: 'flex', flexDirection: 'column', gap: SP[8] }}>
                <GrpCap dotColor={T.primaryStrong} icon={<PinIcon />}>식별 / 위치</GrpCap>
                <Row label="카메라 번호"><span style={inp}>SH-001-0001</span></Row>
                <Row label="카메라 명" req><span style={inpFocus}>SH-001-0001</span></Row>
                <Row label="제조사"><span style={inp}><span style={ph}>예: Hanwha Vision</span></span></Row>
                <Row label="주소" opt><span style={inp}><span style={ph}>예: 시흥시 정왕대로 53</span></span></Row>
              </div>

              {/* ② 연결/인증 블록(한 덩어리 보존) */}
              <div style={{ border: '1px solid #2a2a30', borderLeft: '3px solid #6f6f77', background: 'rgba(255,255,255,0.018)', borderRadius: '7px', padding: `${SP[8]} ${SP[8]}`, display: 'flex', flexDirection: 'column', gap: SP[8] }}>
                <GrpCap dotColor="#8a8a92" icon={<LinkIcon />}>연결 / 인증</GrpCap>
                <Row label="카메라 IP" req><span style={inp}>1.1.2.1</span></Row>
                <Row label="포트" req><span style={inp}>554</span></Row>
                <Row label="아이디"><span style={inp}><span style={ph} /></span></Row>
                <Row label="비밀번호"><span style={inp}><span style={{ letterSpacing: '3px', color: '#d4d4d8', flex: 1 }}>••••••</span><PwEye /></span></Row>
                <Row label="인증방식"><Select value="Digest-Auth" /></Row>
              </div>

              {/* 이하 옵션(고정 ID·사용유무·PTZ·…) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: SP[8], padding: '0 1px' }}>
                <Row label="카메라 고정 ID" req><span style={inp}>SH0001C001</span></Row>
                <Row label="사용유무"><Select value="사용함" /></Row>
                <Row label="PTZ 지원여부"><Select value="사용함" /></Row>
                <Row label="재생 영상 선택"><Select value="카메라영상" /></Row>
                <Row label="패키지 목록" req><Select value="보행신호연장" /></Row>
                <Row label="카메라 디코더" req><Select value="GPU" /></Row>
                <Row label="RTSP 프로토콜" req><Select value="TCP" /></Row>
                <Row label="카메라 기능 옵션" req><Select value="없음" /></Row>
              </div>
            </div>

            {/* ===== 우측: 스트림 / 분석기스트림 / HLS / VMS ===== */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: SP[8] }}>
              {/* 스트림 1 / 2 */}
              <div style={{ display: 'flex', gap: SP[8] }}>
                <Blk title="스트림 1">
                  <RBlkRow label="프로토콜"><Select value="RTSP" disabled /></RBlkRow>
                  <RBlkRow label="주소"><span style={inp}>1</span></RBlkRow>
                  <RBlkRow label="포트"><span style={inp}>8554</span></RBlkRow>
                </Blk>
                <Blk title="스트림 2">
                  <RBlkRow label="프로토콜"><Select value="RTSP" disabled /></RBlkRow>
                  <RBlkRow label="주소"><span style={inp}><span style={ph} /></span></RBlkRow>
                  <RBlkRow label="포트"><span style={inp}>554</span></RBlkRow>
                </Blk>
              </div>
              {/* 인라인 검증 메시지 */}
              <div style={{ ...TYPE.caption2, color: T.error, fontWeight: W.semibold, padding: '2px 1px 0' }}>스트림 1, 2 중 하나는 필수입니다.</div>

              {/* 분석기스트림 */}
              <Blk title="분석기스트림">
                <div style={{ display: 'flex', gap: SP[12] }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: SP[8] }}>
                    <span style={{ width: '64px', flexShrink: 0, textAlign: 'right', ...TYPE.caption1, color: '#9a9aa2' }}>#1</span>
                    <span style={inpDisabled}>1/stream_1</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: SP[8] }}>
                    <span style={{ width: '64px', flexShrink: 0, textAlign: 'right', ...TYPE.caption1, color: '#9a9aa2' }}>분석기 포트</span>
                    <span style={inp}>8554</span>
                  </div>
                </div>
              </Blk>

              {/* HLS 1 / HLS 2 */}
              <div style={{ display: 'flex', gap: SP[8] }}>
                <Blk title="HLS 1" badge="HTTP Live Streaming" apply>
                  <RBlkRow label="프로토콜"><Select value="HLS" disabled /></RBlkRow>
                  <RBlkRow label="HLS IP"><span style={inp}><span style={ph} /></span></RBlkRow>
                  <RBlkRow label="주소"><span style={inp}><span style={ph} /></span></RBlkRow>
                  <RBlkRow label="포트"><span style={inp}>8080</span></RBlkRow>
                </Blk>
                <Blk title="HLS 2" badge="HTTP Live Streaming" apply>
                  <RBlkRow label="프로토콜"><Select value="HLS" disabled /></RBlkRow>
                  <RBlkRow label="HLS IP"><span style={inp}><span style={ph} /></span></RBlkRow>
                  <RBlkRow label="주소"><span style={inp}><span style={ph} /></span></RBlkRow>
                  <RBlkRow label="포트"><span style={inp}>8080</span></RBlkRow>
                </Blk>
              </div>

              {/* VMS */}
              <Blk title="VMS" badge="Video Management System" apply>
                <div style={{ display: 'flex', gap: SP[8] }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: SP[8] }}>
                    <RBlkRow label="프로토콜"><Select value="RTSP" disabled /></RBlkRow>
                    <RBlkRow label="VMS IP"><span style={inp}><span style={ph} /></span></RBlkRow>
                    <RBlkRow label="아이디"><span style={inp}><span style={ph} /></span></RBlkRow>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: SP[8] }}>
                    <RBlkRow label="비밀번호"><span style={inp}><span style={{ ...ph, flex: 1 }} /><PwEye /></span></RBlkRow>
                    <RBlkRow label="주소"><span style={inp}><span style={ph} /></span></RBlkRow>
                    <RBlkRow label="포트"><span style={inp}>554</span></RBlkRow>
                  </div>
                </div>
              </Blk>
            </div>
          </div>

          {/* 하단 액션 */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[12]} ${SP[16]}`, borderTop: '1px solid #232329', background: '#141417' }}>
            <CameraFormRequiredNote />
            <button type="button" style={{ height: '28px', padding: `0 ${SP[16]}`, ...TYPE.caption1, fontWeight: W.semibold, color: '#fff', background: T.primary, border: `1px solid ${T.primary}`, borderRadius: '5px', cursor: 'pointer', fontFamily: T.font }}>적용</button>
            <button type="button" style={{ height: '28px', padding: `0 ${SP[16]}`, ...TYPE.caption1, fontWeight: W.semibold, color: '#d4d4d8', background: 'transparent', border: '1px solid #2e2e35', borderRadius: '5px', cursor: 'pointer', fontFamily: T.font }}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PREVAX 4 이벤트정의 추가 모달(EventDefinitionAddDialog) — 설정 > 이벤트 정의 > 추가.
 * 설정 배경(이벤트 목록 그리드)을 흐리게 깐 위에 중앙 모달을 띄운다.
 * 라벨(좌 우정렬) / 컨트롤(우) 2열 폼이며, 알람 방식 항목은 드롭다운이 열린 상태로 표시한다.
 * 색·타이포·간격은 PrevaxCameraFormScreen(카메라 정보 관리 모달)과 동일한 다크 팔레트·토큰 규격을 따른다.
 */
function PrevaxEventDefAddScreen() {
  // 공통 컨트롤 스타일 — Text field/Select 규격(배경 #141417 · 테두리 1px #2e2e35 · radius 5), 카메라 폼과 동일
  const inp = {
    flex: 1, minWidth: 0, height: '30px', display: 'flex', alignItems: 'center', gap: SP[8],
    padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '5px',
    ...TYPE.caption1, color: '#e8e8ec', fontFamily: T.font, boxSizing: 'border-box', whiteSpace: 'nowrap',
    overflow: 'hidden', textOverflow: 'ellipsis',
  };
  const inpFocus = {
    ...inp, border: `1px solid ${T.primaryStrong}`, background: '#121218',
  };
  const ddExtra = { justifyContent: 'space-between', cursor: 'pointer' };
  const ph = { color: '#7f7f87' };

  // 입력 행: 라벨(고정폭 우정렬) + 컨트롤 (카메라 폼 Row와 동일 규격)
  const Row = ({ label, req, labW = '116px', children }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
      <span style={{ width: labW, flexShrink: 0, textAlign: 'right', ...TYPE.caption1, color: '#9a9aa2', whiteSpace: 'nowrap' }}>
        {label}
        {req && <span style={{ color: T.error, fontWeight: W.bold, marginLeft: '2px' }}>*</span>}
      </span>
      {children}
    </div>
  );
  // Select(드롭다운) 컨트롤 — 펼침 표식은 Foundation 아이콘 arrow_drop_down
  const Select = ({ value, placeholder, focus }) => (
    <span style={{ ...(focus ? inpFocus : inp), ...ddExtra }}>
      <span style={value ? undefined : ph}>{value || placeholder}</span>
      <Icon name="arrow_drop_down" size={16} color="#7f7f87" />
    </span>
  );

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      position: 'relative',
    }}>
      <PrevaxTitleBar datetime="2026.06.25 14:22:05" />
      <PrevaxTabBar active="설정" />

      {/* 배경(설정/이벤트 정의) — 모달 컨텍스트용으로 흐리게 */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', filter: 'saturate(0.85) brightness(0.6)' }}>
          {/* 설정 좌측 네비 */}
          <div style={{ width: '180px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #232329', padding: `${SP[8]} 0` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]} ${SP[4]}`, ...TYPE.caption2, fontWeight: W.semibold, color: '#c4c4cc' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: T.primary }} /> 시스템 설정
            </div>
            {['장비 관리', '이벤트 목록', '이벤트 정의', '스케줄 정의', '계정 관리', '데이터 보관기간 설정', '이벤트 관리'].map((it) => (
              <div key={it} style={{
                ...TYPE.caption2, color: it === '이벤트 정의' ? '#fff' : '#8a8a92',
                padding: `${SP[4]} ${SP[12]} ${SP[4]} 28px`,
                background: it === '이벤트 정의' ? 'rgba(0,102,255,0.18)' : 'transparent',
                borderLeft: it === '이벤트 정의' ? `2px solid ${T.primary}` : '2px solid transparent',
              }}>{it}</div>
            ))}
          </div>
          {/* 설정 메인(이벤트 정의 목록 그리드) */}
          <div style={{ flex: 1, padding: SP[12], minWidth: 0 }}>
            <div style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff', marginBottom: SP[8] }}>이벤트 정의 ( 전체 : 12 )</div>
            <div style={{ border: '1px solid #2a2a30', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', background: '#16161a', borderBottom: '1px solid #2a2a30' }}>
                {['이벤트 종류', '이벤트 명', '객체 종류', '알람 방식', '알람 등급', '알람 종류', '패키지 목록'].map((h) => (
                  <div key={h} style={{ flex: 1, padding: `${SP[4]} ${SP[8]}`, ...TYPE.caption2, color: '#8a8a92', borderRight: '1px solid #232329', whiteSpace: 'nowrap' }}>{h}</div>
                ))}
              </div>
              {[['움직임', '움직임', '사람', '1회 발생', '주의', '없음', '선별관제'], ['배회', '배회 감지', '사람', '반복 발생', '경고', '소리', '선별관제']].map((r, ri) => (
                <div key={ri} style={{ display: 'flex', borderBottom: '1px solid #232329' }}>
                  {r.map((c, ci) => <div key={ci} style={{ flex: 1, padding: `${SP[4]} ${SP[8]}`, ...TYPE.caption2, color: '#c4c4cc', borderRight: '1px solid #232329', whiteSpace: 'nowrap' }}>{c}</div>)}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 스크림 */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,11,0.55)' }} />

        {/* ───────── 모달 본체 ───────── */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '440px', maxWidth: '94%', maxHeight: '94%',
          background: '#1a1a1f', border: '1px solid #2e2e35', borderRadius: '10px',
          boxShadow: '0 0 0 1px rgba(51,133,255,0.18), 0 30px 80px rgba(0,0,0,0.7)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* 드래그 핸들 바 */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: SP[8], background: '#141417', flexShrink: 0 }}>
            <span style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#3a3a42' }} />
          </div>
          {/* 모달 타이틀바 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '38px', padding: `0 ${SP[12]}`, background: '#141417', borderBottom: '1px solid #232329', flexShrink: 0 }}>
            <span style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff' }}>이벤트정의 추가</span>
            <span style={{ display: 'inline-flex', cursor: 'pointer' }}><Icon name="cancel" size={16} color="#8a8a92" /></span>
          </div>

          {/* 모달 본문 — 라벨/컨트롤 2열 폼 */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: SP[8], padding: SP[16] }} className="prevax-scroll">
            <Row label="이벤트 종류" req><Select value="움직임" /></Row>

            {/* 구분선 + 소제목 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], margin: `${SP[4]} 0 ${SP[2]}` }}>
              <span style={{ ...TYPE.caption2, fontWeight: W.semibold, color: '#9dbbff', whiteSpace: 'nowrap' }}>이벤트 설명</span>
              <span style={{ flex: 1, height: '1px', background: '#2a2a30' }} />
            </div>

            <Row label="이벤트 명" req><span style={{ ...inp, color: T.primaryStrong, fontWeight: W.semibold }}>움직임</span></Row>
            <Row label="객체 종류" req><Select placeholder="선택" /></Row>

            {/* 알람 방식 — 드롭다운이 열린 상태 */}
            <Row label="알람 방식" req>
              <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
                <Select value="1회 발생" focus />
                {/* 열린 옵션 목록 (Elevation 강조) */}
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 2,
                  background: '#212227', border: '1px solid #3b3c44', borderRadius: '6px',
                  boxShadow: '0 14px 30px rgba(0,0,0,0.62), 0 4px 10px rgba(0,0,0,0.45)', overflow: 'hidden',
                }}>
                  {[{ t: '1회 발생', on: true }, { t: '반복 발생', on: false }].map((o) => (
                    <div key={o.t} style={{
                      display: 'flex', alignItems: 'center', height: '30px', padding: `0 ${SP[8]}`,
                      ...TYPE.caption1, fontWeight: o.on ? W.semibold : W.regular,
                      color: o.on ? T.primaryStrong : '#d4d4d8',
                      background: 'transparent', cursor: 'pointer',
                    }}>{o.t}</div>
                  ))}
                </div>
              </div>
            </Row>

            <Row label="알람 등급" req><Select placeholder="선택" /></Row>
            <Row label="알람 종류" req><Select value="없음" /></Row>
            <Row label="스냅샷 저장 여부" req><Select value="저장" /></Row>
            <Row label="비디오 저장 여부" req><Select value="미저장" /></Row>
            <Row label="패키지 목록" req><Select value="선별관제" /></Row>
            <Row label="이벤트 ROI 색" req><Select value="기본 색상" /></Row>
          </div>

          {/* 하단 액션 — 우측 정렬: 확인(Primary) / 취소(Secondary) */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: SP[8], padding: `${SP[12]} ${SP[16]}`, borderTop: '1px solid #232329', background: '#141417' }}>
            <button type="button" style={{ height: '28px', padding: `0 ${SP[16]}`, ...TYPE.caption1, fontWeight: W.semibold, color: '#fff', background: T.primary, border: `1px solid ${T.primary}`, borderRadius: '5px', cursor: 'pointer', fontFamily: T.font }}>확인</button>
            <button type="button" style={{ height: '28px', padding: `0 ${SP[16]}`, ...TYPE.caption1, fontWeight: W.semibold, color: '#d4d4d8', background: 'transparent', border: '1px solid #2e2e35', borderRadius: '5px', cursor: 'pointer', fontFamily: T.font }}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PREVAX 4 카메라 정보 관리 폼 — 구성안 "탭 분리" 변형(PrevaxCameraFormScreen 권고 A의 대안).
 * 같은 필드·토큰·룩을 쓰되 긴 단일 스크롤을 3개 탭(기본정보 · 연결·인증 · 스트림)으로 분리해
 * 한 탭이 한 화면에 들어오도록 모달 폭을 좁힌다(720px). 하단 적용/닫기는 공통 고정.
 * 권한 설정의 2번 변형(PrevaxPermissionScreen2)과 같은 "기존 화면의 대안 구성" 패턴.
 */
function PrevaxCameraFormScreen2() {
  const [tab, setTab] = useState('기본정보');
  const TABS = ['기본정보', '연결·인증', '스트림'];

  // 공통 컨트롤 스타일 — PrevaxCameraFormScreen과 동일 규격(Text field/Select)
  const inp = {
    flex: 1, minWidth: 0, height: '30px', display: 'flex', alignItems: 'center', gap: SP[8],
    padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '5px',
    ...TYPE.caption1, color: '#e8e8ec', fontFamily: T.font, boxSizing: 'border-box', whiteSpace: 'nowrap',
    overflow: 'hidden', textOverflow: 'ellipsis',
  };
  const inpFocus = { ...inp, border: `1px solid ${T.primaryStrong}`, boxShadow: '0 0 0 2px rgba(0,102,255,0.20)', background: '#121218' };
  const inpDisabled = { ...inp, background: '#17171b', border: '1px solid #242429', color: '#7f7f87', opacity: 0.7 };
  const ddExtra = { justifyContent: 'space-between', cursor: 'pointer' };
  const ph = { color: '#7f7f87' };
  const car = { fontSize: '8px', color: '#7f7f87', flexShrink: 0, marginLeft: SP[4] };

  const Row = ({ label, req, opt, labW = '110px', children }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
      <span style={{ width: labW, flexShrink: 0, textAlign: 'right', ...TYPE.caption1, color: '#9a9aa2', whiteSpace: 'nowrap' }}>
        {label}
        {req && <span style={{ color: T.error, fontWeight: W.bold, marginLeft: '2px' }}>*</span>}
        {opt && <span style={{ color: '#6f6f77', fontWeight: W.regular, ...TYPE.caption2, marginLeft: '3px' }}>(선택)</span>}
      </span>
      {children}
    </div>
  );
  const Select = ({ value, disabled }) => (
    <span style={{ ...(disabled ? inpDisabled : inp), ...ddExtra }}><span>{value}</span><span style={car}>▼</span></span>
  );
  const PwEye = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8a92" strokeWidth="2" style={{ flexShrink: 0 }}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
  const GrpCap = ({ children, dotColor, icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], ...TYPE.caption2, fontWeight: W.semibold, color: '#8a8a92', marginBottom: '1px' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
      {icon}
      {children}
    </div>
  );
  const Blk = ({ title, badge, children, apply }) => (
    <div style={{ flex: 1, minWidth: 0, border: '1px solid #2a2a30', borderRadius: '7px', background: '#16161a', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${SP[8]} ${SP[8]}`, borderBottom: '1px solid #232329', ...TYPE.caption1, fontWeight: W.bold, color: '#e4e4e8' }}>
        <span>{title}</span>
        {badge && <span style={{ ...TYPE.caption2, fontWeight: W.regular, color: '#8a8a92' }}>{badge}</span>}
      </div>
      <div style={{ padding: `${SP[8]} ${SP[8]}`, display: 'flex', flexDirection: 'column', gap: SP[8] }}>{children}</div>
      {apply && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: `0 ${SP[8]} ${SP[8]}` }}>
          <button type="button" style={{ height: '24px', padding: `0 ${SP[12]}`, ...TYPE.caption2, fontWeight: W.semibold, color: '#d4d4d8', background: '#202024', border: '1px solid #2e2e35', borderRadius: '5px', cursor: 'pointer', fontFamily: T.font }}>적용</button>
        </div>
      )}
    </div>
  );
  const RBlkRow = (props) => <Row labW="64px" {...props} />;

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      position: 'relative',
    }}>
      <PrevaxTitleBar datetime="2026.06.18 14:22:05" />
      <PrevaxTabBar active="설정" />

      {/* 배경(설정/장비관리) — 모달 컨텍스트용으로 흐리게 */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', filter: 'saturate(0.85) brightness(0.6)' }}>
          <div style={{ width: '180px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #232329', padding: `${SP[8]} 0` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]} ${SP[4]}`, ...TYPE.caption2, fontWeight: W.semibold, color: '#c4c4cc' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: T.primary }} /> 시스템 설정
            </div>
            {['장비 관리', '이벤트 목록', '이벤트 정의', '스케줄 정의', '계정 관리', '데이터 보관기간 설정', '이벤트 관리'].map((it) => (
              <div key={it} style={{
                ...TYPE.caption2, color: it === '장비 관리' ? '#fff' : '#8a8a92',
                padding: `${SP[4]} ${SP[12]} ${SP[4]} 28px`,
                background: it === '장비 관리' ? 'rgba(0,102,255,0.18)' : 'transparent',
                borderLeft: it === '장비 관리' ? `2px solid ${T.primary}` : '2px solid transparent',
              }}>{it}</div>
            ))}
          </div>
          <div style={{ flex: 1, padding: SP[12], minWidth: 0 }}>
            <div style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff', marginBottom: SP[8] }}>카메라 목록 ( 선택된 카메라 : 1 / 17 )</div>
            <div style={{ border: '1px solid #2a2a30', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', background: '#16161a', borderBottom: '1px solid #2a2a30' }}>
                {['등록 유형', '카메라 번호', '카메라 명', '카메라 IP', '포트', '아이디', '비밀번호', '제조사', '카메라 고정 ID'].map((h) => (
                  <div key={h} style={{ flex: 1, padding: `${SP[4]} ${SP[8]}`, ...TYPE.caption2, color: h === '제조사' ? '#cfd9ff' : '#8a8a92', fontWeight: h === '제조사' ? W.bold : W.regular, borderRight: '1px solid #232329', whiteSpace: 'nowrap' }}>{h}</div>
                ))}
              </div>
              {[['정상', 'SH-001-0001', 'SH-001-0001', '1.1.2.1', '554', '', '', '', 'SH0001C001'], ['정상', 'SH-001-0002', 'SH-001-0002', '1.1.2.2', '554', '', '', '', 'SH0001C002']].map((r, ri) => (
                <div key={ri} style={{ display: 'flex', borderBottom: '1px solid #232329' }}>
                  {r.map((c, ci) => <div key={ci} style={{ flex: 1, padding: `${SP[4]} ${SP[8]}`, ...TYPE.caption2, color: '#c4c4cc', borderRight: '1px solid #232329', whiteSpace: 'nowrap' }}>{c}</div>)}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,11,0.55)' }} />

        {/* ───────── 모달 본체(탭 분리, 폭 720px) ───────── */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '720px', maxWidth: '96%', maxHeight: '94%',
          background: '#1a1a1f', border: '1px solid #2e2e35', borderRadius: '10px',
          boxShadow: '0 0 0 1px rgba(51,133,255,0.18), 0 30px 80px rgba(0,0,0,0.7)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* 모달 타이틀바 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '38px', padding: `0 ${SP[12]}`, background: '#141417', borderBottom: '1px solid #232329', flexShrink: 0 }}>
            <span style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff' }}>카메라 수정</span>
            <span style={{ display: 'inline-flex', gap: SP[8], color: '#6f6f77' }}>
              <span style={{ width: '11px', height: '11px', borderRadius: '2px', background: '#2a2a30' }} />
              <span style={{ width: '11px', height: '11px', borderRadius: '2px', background: '#2a2a30' }} />
              <span style={{ width: '11px', height: '11px', borderRadius: '2px', background: '#2a2a30' }} />
            </span>
          </div>

          {/* 편집 컨텍스트 헤더(타이틀바와 탭바 사이) */}
          <CameraFormContextHeader />

          {/* 탭바 — 활성 탭 Primary 밑줄(PrevaxTabBar 룩 차용) */}
          <div style={{ display: 'flex', flexShrink: 0, background: '#16161a', borderBottom: '1px solid #2a2a30', padding: `0 ${SP[8]}` }}>
            {TABS.map((t) => {
              const on = t === tab;
              return (
                <div key={t} onClick={() => setTab(t)} style={{
                  display: 'flex', alignItems: 'center', padding: `${SP[8]} ${SP[16]}`, cursor: 'pointer',
                  ...TYPE.caption1, fontWeight: on ? W.semibold : W.regular, color: on ? '#fff' : '#8a8a92',
                  borderBottom: `2px solid ${on ? T.primary : 'transparent'}`,
                }}>{t}</div>
              );
            })}
          </div>

          {/* 탭 내용 — 한 탭이 한 화면에 들어오게 */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: SP[16], display: 'flex', flexDirection: 'column', gap: SP[8] }} className="prevax-scroll">
            {tab === '기본정보' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: SP[8] }}>
                  <Row label="분석기 명" req><span style={inpDisabled}>SHS-PFA-01</span></Row>
                  <Row label="프로토콜" req><Select value="수동입력" disabled /></Row>
                </div>
                <div style={{ border: '1px solid #2a2a30', borderLeft: `3px solid ${T.primary}`, background: 'rgba(0,102,255,0.045)', borderRadius: '7px', padding: `${SP[8]} ${SP[8]}`, display: 'flex', flexDirection: 'column', gap: SP[8] }}>
                  <GrpCap dotColor={T.primaryStrong} icon={<PinIcon />}>식별 / 위치</GrpCap>
                  <Row label="카메라 번호"><span style={inp}>SH-001-0001</span></Row>
                  <Row label="카메라 명" req><span style={inpFocus}>SH-001-0001</span></Row>
                  <Row label="제조사"><span style={inp}><span style={ph}>예: Hanwha Vision</span></span></Row>
                  <Row label="주소" opt><span style={inp}><span style={ph}>예: 시흥시 정왕대로 53</span></span></Row>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: SP[8], padding: '0 1px' }}>
                  <Row label="카메라 고정 ID" req><span style={inp}>SH0001C001</span></Row>
                  <Row label="사용유무"><Select value="사용함" /></Row>
                  <Row label="PTZ 지원여부"><Select value="사용함" /></Row>
                  <Row label="재생 영상 선택"><Select value="카메라영상" /></Row>
                  <Row label="패키지 목록" req><Select value="보행신호연장" /></Row>
                  <Row label="카메라 디코더" req><Select value="GPU" /></Row>
                  <Row label="RTSP 프로토콜" req><Select value="TCP" /></Row>
                  <Row label="카메라 기능 옵션" req><Select value="없음" /></Row>
                </div>
              </>
            )}

            {tab === '연결·인증' && (
              <div style={{ border: '1px solid #2a2a30', borderLeft: '3px solid #6f6f77', background: 'rgba(255,255,255,0.018)', borderRadius: '7px', padding: `${SP[12]} ${SP[12]}`, display: 'flex', flexDirection: 'column', gap: SP[12] }}>
                <GrpCap dotColor="#8a8a92" icon={<LinkIcon />}>연결 / 인증</GrpCap>
                <Row label="카메라 IP" req><span style={inp}>1.1.2.1</span></Row>
                <Row label="포트" req><span style={inp}>554</span></Row>
                <Row label="아이디"><span style={inp}><span style={ph} /></span></Row>
                <Row label="비밀번호"><span style={inp}><span style={{ letterSpacing: '3px', color: '#d4d4d8', flex: 1 }}>••••••</span><PwEye /></span></Row>
                <Row label="인증방식"><Select value="Digest-Auth" /></Row>
              </div>
            )}

            {tab === '스트림' && (
              <>
                <div style={{ display: 'flex', gap: SP[8] }}>
                  <Blk title="스트림 1">
                    <RBlkRow label="프로토콜"><Select value="RTSP" disabled /></RBlkRow>
                    <RBlkRow label="주소"><span style={inp}>1</span></RBlkRow>
                    <RBlkRow label="포트"><span style={inp}>8554</span></RBlkRow>
                  </Blk>
                  <Blk title="스트림 2">
                    <RBlkRow label="프로토콜"><Select value="RTSP" disabled /></RBlkRow>
                    <RBlkRow label="주소"><span style={inp}><span style={ph} /></span></RBlkRow>
                    <RBlkRow label="포트"><span style={inp}>554</span></RBlkRow>
                  </Blk>
                </div>
                <div style={{ ...TYPE.caption2, color: T.error, fontWeight: W.semibold, padding: '2px 1px 0' }}>스트림 1, 2 중 하나는 필수입니다.</div>

                <Blk title="분석기스트림">
                  <div style={{ display: 'flex', gap: SP[12] }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: SP[8] }}>
                      <span style={{ width: '64px', flexShrink: 0, textAlign: 'right', ...TYPE.caption1, color: '#9a9aa2' }}>#1</span>
                      <span style={inpDisabled}>1/stream_1</span>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: SP[8] }}>
                      <span style={{ width: '64px', flexShrink: 0, textAlign: 'right', ...TYPE.caption1, color: '#9a9aa2' }}>분석기 포트</span>
                      <span style={inp}>8554</span>
                    </div>
                  </div>
                </Blk>

                <div style={{ display: 'flex', gap: SP[8] }}>
                  <Blk title="HLS 1" badge="HTTP Live Streaming" apply>
                    <RBlkRow label="프로토콜"><Select value="HLS" disabled /></RBlkRow>
                    <RBlkRow label="HLS IP"><span style={inp}><span style={ph} /></span></RBlkRow>
                    <RBlkRow label="주소"><span style={inp}><span style={ph} /></span></RBlkRow>
                    <RBlkRow label="포트"><span style={inp}>8080</span></RBlkRow>
                  </Blk>
                  <Blk title="HLS 2" badge="HTTP Live Streaming" apply>
                    <RBlkRow label="프로토콜"><Select value="HLS" disabled /></RBlkRow>
                    <RBlkRow label="HLS IP"><span style={inp}><span style={ph} /></span></RBlkRow>
                    <RBlkRow label="주소"><span style={inp}><span style={ph} /></span></RBlkRow>
                    <RBlkRow label="포트"><span style={inp}>8080</span></RBlkRow>
                  </Blk>
                </div>

                <Blk title="VMS" badge="Video Management System" apply>
                  <div style={{ display: 'flex', gap: SP[8] }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: SP[8] }}>
                      <RBlkRow label="프로토콜"><Select value="RTSP" disabled /></RBlkRow>
                      <RBlkRow label="VMS IP"><span style={inp}><span style={ph} /></span></RBlkRow>
                      <RBlkRow label="아이디"><span style={inp}><span style={ph} /></span></RBlkRow>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: SP[8] }}>
                      <RBlkRow label="비밀번호"><span style={inp}><span style={{ ...ph, flex: 1 }} /><PwEye /></span></RBlkRow>
                      <RBlkRow label="주소"><span style={inp}><span style={ph} /></span></RBlkRow>
                      <RBlkRow label="포트"><span style={inp}>554</span></RBlkRow>
                    </div>
                  </div>
                </Blk>
              </>
            )}
          </div>

          {/* 하단 액션(공통 고정) */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[12]} ${SP[16]}`, borderTop: '1px solid #232329', background: '#141417' }}>
            <CameraFormRequiredNote />
            <button type="button" style={{ height: '28px', padding: `0 ${SP[16]}`, ...TYPE.caption1, fontWeight: W.semibold, color: '#fff', background: T.primary, border: `1px solid ${T.primary}`, borderRadius: '5px', cursor: 'pointer', fontFamily: T.font }}>적용</button>
            <button type="button" style={{ height: '28px', padding: `0 ${SP[16]}`, ...TYPE.caption1, fontWeight: W.semibold, color: '#d4d4d8', background: 'transparent', border: '1px solid #2e2e35', borderRadius: '5px', cursor: 'pointer', fontFamily: T.font }}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PREVAX 4 설정 > 카메라 그룹 관리 (H-1) — 단일 인터랙티브 화면.
 * 시안(docs/design/camera-group-mgmt 화면②)의 여러 정적 컷 대신, 실제로 동작하는 한 페이지.
 *  좌=그룹 목록 + 인라인 추가/수정 + 담긴 카메라 / 가운데=담기·빼기 셔틀 / 우=전체 카메라(소속 그룹·배치 상태).
 *  인터랙션: 그룹 선택·검색(즉시필터)·그룹 추가(빈값/중복/128자 검증)·이름 수정·삭제 ·
 *           카메라 다중 선택 → 담기/빼기 · dirty(저장 안 됨/저장됨) · 소속 그룹 칩 + "외 n" 툴팁 · 미배치.
 *  색/타이포/간격/굵기는 토큰(T/TYPE/W/SP) — Primary는 오너 확정값 #0066FF 계열(시안의 폐기 팔레트는 미사용).
 */
function PrevaxCameraGroupScreen() {
  const INIT_GROUPS = [
    { id: 'g-oo', name: '○○동' }, { id: 'g-sn', name: '△△동' }, { id: 'g-main', name: '주요지점' },
    { id: 'g-maljuk', name: '말죽거리' }, { id: 'g-yeok', name: '역세권' }, { id: 'g-jung', name: '중앙사거리' },
  ];
  const CAMERAS = [
    { no: '001', name: '정문 입구', maker: '한화' }, { no: '002', name: '후문', maker: '한화' },
    { no: '003', name: '주차장 A', maker: 'IDIS' }, { no: '004', name: '로비', maker: 'IDIS' },
    { no: '005', name: '복도 1층', maker: '한화' }, { no: '006', name: '엘리베이터 홀', maker: 'IDIS' },
    { no: '007', name: '옥상 출입구', maker: '한화' }, { no: '008', name: '비상계단', maker: '액시스' },
    { no: '009', name: '지하주차장 B', maker: '한화' }, { no: '010', name: '민원실', maker: 'IDIS' },
    { no: '011', name: '옥외 주차장', maker: '액시스' }, { no: '012', name: '정원', maker: '한화' },
  ];
  const INIT_MEMB = {
    '001': ['g-oo', 'g-main'], '002': ['g-maljuk'], '003': ['g-maljuk', 'g-yeok', 'g-jung'], '004': [],
    '005': ['g-oo'], '006': [], '007': ['g-jung'], '008': ['g-sn'], '009': ['g-main'], '010': [],
    '011': ['g-yeok', 'g-main'], '012': ['g-oo'],
  };

  const [groups, setGroups] = useState(INIT_GROUPS);
  const [memb, setMemb] = useState(INIT_MEMB);
  const [selGroup, setSelGroup] = useState('g-oo');
  const [groupQ, setGroupQ] = useState('');
  const [camQ, setCamQ] = useState('');
  const [selAll, setSelAll] = useState(() => new Set());   // 우측 전체 카메라에서 고른 행
  const [selDep, setSelDep] = useState(() => new Set());    // 좌측 담긴 카메라에서 고른 행
  const [inline, setInline] = useState(null);               // null | { mode:'add'|'edit', value }
  const [dirty, setDirty] = useState(false);
  const [justAdded, setJustAdded] = useState(() => new Set());
  const [tipCam, setTipCam] = useState(null);

  // ── 토큰 기반 색 헬퍼(Primary #0066FF 틴트 / 상태색 틴트) ──
  const pt = (a) => `rgba(0,102,255,${a})`;
  const posT = (a) => `rgba(30,212,90,${a})`;
  const cauT = (a) => `rgba(255,169,56,${a})`;

  const groupName = (id) => (groups.find((g) => g.id === id) || {}).name || '';
  const koSort = (a, b) => a.localeCompare(b, 'ko');
  const camCount = (gid) => CAMERAS.filter((c) => (memb[c.no] || []).includes(gid)).length;

  const sortedGroups = [...groups].sort((a, b) => koSort(a.name, b.name));
  const shownGroups = sortedGroups.filter((g) => g.name.includes(groupQ.trim()));
  const curName = groupName(selGroup);

  // 담긴 카메라(좌 하단) — 현재 그룹 소속, 번호순
  const heldCams = CAMERAS.filter((c) => (memb[c.no] || []).includes(selGroup));
  // 전체 카메라(우) — 번호순(데이터가 이미 번호순). 검색은 카메라명·번호.
  const shownCams = CAMERAS.filter((c) => {
    const q = camQ.trim();
    return !q || c.name.includes(q) || c.no.includes(q);
  });

  const resetPicks = () => { setSelAll(new Set()); setSelDep(new Set()); };
  const selectGroup = (id) => { setSelGroup(id); resetPicks(); setJustAdded(new Set()); setInline(null); };

  const toggle = (setFn) => (key) => setFn((s) => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });
  const toggleAll = toggle(setSelAll);
  const toggleDep = toggle(setSelDep);

  // ── 담기: 우측에서 고른 카메라를 현재 그룹에 추가(이미 담긴 행은 가드되어 선택 불가) ──
  const doAdd = () => {
    if (!selGroup || selAll.size === 0) return;
    setMemb((m) => {
      const n = { ...m };
      selAll.forEach((no) => { if (!(n[no] || []).includes(selGroup)) n[no] = [...(n[no] || []), selGroup]; });
      return n;
    });
    setJustAdded((s) => new Set([...s, ...selAll]));
    setSelAll(new Set());
    setDirty(true);
  };
  // ── 빼기: 좌측 담긴 카메라에서 고른 행을 현재 그룹에서 제거 ──
  const doRemove = () => {
    if (!selGroup || selDep.size === 0) return;
    setMemb((m) => {
      const n = { ...m };
      selDep.forEach((no) => { n[no] = (n[no] || []).filter((g) => g !== selGroup); });
      return n;
    });
    setSelDep(new Set());
    setDirty(true);
  };

  // ── 인라인 추가/수정 검증(빈값·중복·128자) ──
  const trimmed = (inline?.value || '').trim();
  const dup = !!trimmed && groups.some((g) => g.name === trimmed && !(inline?.mode === 'edit' && g.id === selGroup));
  const tooLong = (inline?.value || '').length >= 128;
  const invalid = !trimmed || dup;
  const vmsg = !trimmed ? '그룹 이름을 입력해 주세요. (빈 이름은 저장할 수 없어요)'
    : dup ? '같은 이름의 그룹이 이미 있어요. 다른 이름을 입력해 주세요.' : null;

  const confirmInline = () => {
    if (invalid) return;
    if (inline.mode === 'add') {
      const id = `g-${Date.now()}`;
      setGroups((g) => [...g, { id, name: trimmed }]);
      setMemb((m) => ({ ...m }));
      selectGroup(id);
    } else {
      setGroups((g) => g.map((x) => (x.id === selGroup ? { ...x, name: trimmed } : x)));
      setInline(null);
    }
    setDirty(true);
  };
  const deleteGroup = () => {
    if (!selGroup) return;
    setGroups((g) => g.filter((x) => x.id !== selGroup));
    setMemb((m) => { const n = {}; Object.entries(m).forEach(([k, v]) => { n[k] = v.filter((x) => x !== selGroup); }); return n; });
    const rest = sortedGroups.filter((x) => x.id !== selGroup);
    setSelGroup(rest[0] ? rest[0].id : null);
    resetPicks();
    setDirty(true);
  };

  // ── 인라인 SVG 글리프(시안 톤 일치, 색은 currentColor) ──
  const S = ({ d, size = 14, sw = 1.8, fill }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || 'none'} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
  );
  const check = (size = 13) => <S size={size} sw={2.6} d={<path d="M5 13l4 4L19 7" />} />;
  const plus = (size = 13) => <S size={size} sw={2.2} d={<path d="M12 5v14M5 12h14" />} />;
  const search = (size = 13) => <S size={size} sw={2} d={<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></>} />;
  const xGlyph = (size = 12) => <S size={size} sw={2.2} d={<path d="M6 6l12 12M18 6L6 18" />} />;
  const ban = (size = 12) => <S size={size} sw={2} d={<><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></>} />;
  const info = (size = 13) => <S size={size} sw={2} d={<><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8.5v.5" /></>} />;

  // ── 스타일 토큰 묶음 ──
  const pane = { display: 'flex', flexDirection: 'column', minHeight: 0, background: '#16161a', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden' };
  const paneH = { display: 'flex', alignItems: 'center', gap: SP[8], height: '38px', flexShrink: 0, padding: `0 ${SP[12]}`, borderBottom: '1px solid #2a2a30' };
  const searchBar = (typed, extra) => ({ display: 'flex', alignItems: 'center', gap: SP[8], height: '30px', flexShrink: 0, padding: `0 ${SP[8]}`, margin: `${SP[8]} ${SP[8]} 0`, background: typed ? '#101015' : '#141417', border: `1px solid ${typed ? T.primaryStrong : '#2e2e35'}`, borderRadius: '5px', ...extra });
  const filterCount = { ...TYPE.caption2, color: '#8a8a92', padding: `5px ${SP[12]} ${SP[2]}`, fontVariantNumeric: 'tabular-nums' };
  const btnSm = { display: 'inline-flex', alignItems: 'center', gap: SP[4], ...TYPE.caption1, fontWeight: W.semibold, padding: `${SP[4]} ${SP[8]}`, borderRadius: '5px', border: '1px solid #2e2e35', background: '#202024', color: '#d4d4d8', cursor: 'pointer', fontFamily: T.font, whiteSpace: 'nowrap' };

  const renderSearch = (val, setVal, ph, extra) => {
    const typed = !!val;
    return (
      <div style={searchBar(typed, extra)}>
        <span style={{ color: '#6f6f77', display: 'inline-flex', flexShrink: 0 }}>{search()}</span>
        <input
          value={val} onChange={(e) => setVal(e.target.value)} placeholder={ph}
          style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: typed ? '#fff' : '#9a9aa2', fontFamily: T.font, ...TYPE.caption1, fontWeight: typed ? W.semibold : W.regular }}
        />
        {typed && (
          <span onClick={() => setVal('')} style={{ width: '18px', height: '18px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', color: '#9a9aa2', background: '#202024', border: '1px solid #2e2e35', cursor: 'pointer' }}>{xGlyph(10)}</span>
        )}
      </div>
    );
  };

  // 검색 0건(데이터는 있는데 검색어 불일치) — 빈 상태 아님
  const searchEmpty = (q, noun, onClear) => (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: SP[8], padding: `${SP[24]} ${SP[16]}`, textAlign: 'center' }}>
      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '11px', border: '1.5px dashed #33333b', color: '#8a8a92' }}>{search(20)}</div>
      <div style={{ ...TYPE.caption1, fontWeight: W.bold, color: '#e8e8ec', lineHeight: 1.5 }}>
        <span style={{ color: T.primaryStrong }}>"{q}"</span>(으)로 찾은 {noun}이 없어요.
      </div>
      <div style={{ ...TYPE.caption2, color: '#8a8a92' }}>검색어를 지우면 전체가 보입니다.</div>
      <span onClick={onClear} style={{ ...btnSm, marginTop: SP[2] }}>{xGlyph(11)} 검색어 지우기</span>
    </div>
  );

  const dirBtn = (active, enabled) => ({
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP[8],
    ...TYPE.label2, fontWeight: W.bold, padding: `${SP[8]} ${SP[8]}`, borderRadius: '6px', fontFamily: T.font,
    cursor: enabled ? 'pointer' : 'not-allowed',
    border: `1px solid ${active && enabled ? T.primary : '#2e2e35'}`,
    background: active && enabled ? pt(0.18) : '#202024',
    color: !enabled ? '#6f6f77' : active ? T.primaryStrong : '#fff',
  });

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      <PrevaxTitleBar datetime="2026.06.23 14:21:33" />
      <PrevaxTabBar active="설정" />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 설정 네비 — 시스템 설정 그룹 "장비 관리" 다음 신규 1급 "카메라 그룹 관리" */}
        <div style={{ width: '186px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #2a2a30', overflowY: 'auto', padding: `${SP[8]} 0` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]} ${SP[4]}`, ...TYPE.label2, fontWeight: W.semibold, color: '#e8e8ec' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: T.primary }} /> 시스템 설정
          </div>
          {['장비 관리', '카메라 그룹 관리', '이벤트 정의', '스케줄 정의', '계정 관리', '권한 설정', '데이터 보관기간 설정', '이벤트 관리'].map((it) => {
            const on = it === '카메라 그룹 관리';
            return (
              <div key={it} style={{
                padding: `${SP[4]} ${SP[12]} ${SP[4]} ${SP[32]}`, ...TYPE.label2, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: SP[4],
                background: on ? pt(0.18) : 'transparent', borderLeft: `2px solid ${on ? T.primary : 'transparent'}`,
                color: on ? '#fff' : '#9a9aa2', fontWeight: on ? W.semibold : W.regular,
              }}>
                {it}
                {on && <span style={{ ...TYPE.caption2, fontWeight: W.bold, border: `1px solid ${T.primaryStrong}`, color: T.primaryStrong, background: pt(0.14), borderRadius: '6px', padding: `0 ${SP[4]}` }}>신규 1급</span>}
              </div>
            );
          })}
        </div>

        {/* 메인 */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: '#1a1a1f' }}>
          {/* 페이지 헤더 + dirty + 저장 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[12]} ${SP[16]}`, borderBottom: '1px solid #2a2a30' }}>
            <span style={{ ...TYPE.label1, fontWeight: W.bold, color: '#fff' }}>카메라 그룹 관리</span>
            <span style={{ ...TYPE.caption1, color: '#8a8a92' }}>전역 · 사용자 비종속 자산</span>
            <span style={{ flex: 1 }} />
            {dirty ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4], ...TYPE.caption1, fontWeight: W.semibold, color: T.cautionary }}>
                <span style={{ fontWeight: W.bold, color: T.cautionary, lineHeight: 1 }}>!</span> 저장 안 됨
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4], ...TYPE.caption1, fontWeight: W.semibold, color: T.positive }}>
                <span style={{ color: T.positive, display: 'inline-flex' }}>{check(12)}</span> 저장됨
              </span>
            )}
            <button type="button" onClick={() => setDirty(false)} disabled={!dirty} style={{
              display: 'inline-flex', alignItems: 'center', gap: SP[4], ...TYPE.caption1, fontWeight: W.semibold, fontFamily: T.font,
              padding: `${SP[4]} ${SP[12]}`, borderRadius: '5px', cursor: dirty ? 'pointer' : 'not-allowed',
              border: `1px solid ${dirty ? T.primary : '#2c2f38'}`, background: dirty ? T.primary : '#23262e', color: dirty ? '#fff' : '#6f6f77',
            }}>
              <S size={13} sw={2} d={<><path d="M5 4h11l3 3v13H5z" /><path d="M9 4v5h6" /></>} /> 저장
            </button>
          </div>

          {/* 셔틀 3분할 — 좌:가운데:우 = 288 : 124 : 1fr (카메라 ≫ 그룹) */}
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '288px 124px 1fr', gap: '14px', padding: '14px 16px' }}>

            {/* ── 좌: 그룹 목록 + 인라인 추가/수정 + 담긴 카메라 + 액션 ── */}
            <div style={pane}>
              <div style={paneH}>
                <span style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff' }}>그룹 목록</span>
                <span style={{ ...TYPE.caption1, color: '#8a8a92' }}>{groups.length}개</span>
                <span style={{ flex: 1 }} />
                <span style={btnSm} onClick={() => setInline({ mode: 'add', value: '' })}>{plus(13)} 그룹 추가</span>
              </div>
              {renderSearch(groupQ, setGroupQ, '그룹 이름 검색')}
              <div style={filterCount}>{groupQ.trim() ? <b style={{ color: T.primaryStrong }}>{groups.length}개 중 {shownGroups.length}개</b> : `그룹명 가나다순 · ${groups.length}개`}</div>

              <div style={{ flexShrink: 0, maxHeight: '180px', overflowY: 'auto' }} className="prevax-scroll">
                {shownGroups.length === 0 && groupQ.trim()
                  ? <div style={{ ...TYPE.caption1, color: '#8a8a92', padding: `${SP[12]} ${SP[12]}` }}>"{groupQ.trim()}"(으)로 찾은 그룹이 없어요.</div>
                  : shownGroups.map((g) => {
                    const on = g.id === selGroup;
                    return (
                      <div key={g.id} onClick={() => selectGroup(g.id)} style={{
                        display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, ...TYPE.label2,
                        borderBottom: '1px solid #232329', whiteSpace: 'nowrap', cursor: 'pointer',
                        background: on ? pt(0.20) : 'transparent', borderLeft: `3px solid ${on ? T.primary : 'transparent'}`,
                        paddingLeft: on ? '9px' : SP[12], color: on ? '#fff' : '#d4d4d8', fontWeight: on ? W.semibold : W.regular,
                      }}>
                        <span style={{ display: 'inline-flex', flexShrink: 0 }}><Icon name="folder_open" size={14} color={on ? T.primaryStrong : '#8a8a92'} /></span>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</span>
                        <span style={{ ...TYPE.caption1, color: on ? '#c4c4cc' : '#8a8a92' }}>{camCount(g.id)}대</span>
                      </div>
                    );
                  })}
              </div>

              {/* 인라인 추가/수정 행 — 검증(빈값·중복·128자) */}
              {inline && (
                <div style={{ background: pt(0.08), borderTop: `1px dashed ${T.primary}`, borderBottom: `1px dashed ${T.primary}`, padding: `${SP[8]} ${SP[12]}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
                    <span style={{ color: T.primaryStrong, display: 'inline-flex', flexShrink: 0 }}>{inline.mode === 'add' ? plus(14) : <S d={<path d="M4 20h4L18 10l-4-4L4 16z" />} />}</span>
                    <input
                      autoFocus value={inline.value} maxLength={128}
                      onChange={(e) => setInline((s) => ({ ...s, value: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') confirmInline(); if (e.key === 'Escape') setInline(null); }}
                      placeholder={inline.mode === 'add' ? '새 그룹 이름 입력…' : '그룹 이름 수정…'}
                      style={{ flex: 1, minWidth: 0, ...TYPE.label2, color: '#fff', background: '#141417', border: `1px solid ${invalid && inline.value ? T.error : T.primaryStrong}`, borderRadius: '4px', padding: `5px ${SP[8]}`, outline: 'none', fontFamily: T.font }}
                    />
                    <span style={{ ...TYPE.caption2, color: tooLong ? T.error : '#8a8a92', fontWeight: tooLong ? W.bold : W.regular, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{inline.value.length}/128</span>
                    <span onClick={confirmInline} style={{ ...btnSm, background: invalid ? '#23262e' : T.primary, border: `1px solid ${invalid ? '#2c2f38' : T.primary}`, color: invalid ? '#6f6f77' : '#fff', cursor: invalid ? 'not-allowed' : 'pointer' }}>확인</span>
                    <span onClick={() => setInline(null)} title="취소" style={{ width: '24px', height: '24px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2e2e35', borderRadius: '4px', color: '#9a9aa2', background: '#202024', cursor: 'pointer' }}>{xGlyph(12)}</span>
                  </div>
                  {vmsg
                    ? <div style={{ display: 'flex', alignItems: 'flex-start', gap: SP[4], marginTop: SP[8], ...TYPE.caption2, color: T.error, lineHeight: 1.5 }}><span style={{ flexShrink: 0, marginTop: '1px', display: 'inline-flex' }}><Icon name="error" size={13} color={T.error} /></span> {vmsg}</div>
                    : <div style={{ marginTop: SP[8], ...TYPE.caption2, color: '#8a8a92', lineHeight: 1.5 }}>확인하면 새 그룹이 바로 선택되어 아래 "담긴 카메라"로 이어집니다. 취소는 ✕ 또는 Esc. <b style={{ color: '#c4c4cc' }}>이름은 최대 128자.</b></div>}
                </div>
              )}

              {/* 종속 블록: 이 그룹에 담긴 카메라 (선택 그룹과 시각적으로 묶음 + 동적 라벨) */}
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', margin: `0 ${SP[8]} ${SP[8]}`, background: pt(0.06), border: `1px solid ${pt(0.28)}`, borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `7px ${SP[8]}`, borderBottom: `1px solid ${pt(0.22)}`, background: pt(0.10) }}>
                  <span style={{ color: T.primaryStrong, display: 'inline-flex', flexShrink: 0 }}><S d={<path d="M5 5v14M5 9h6a3 3 0 013 3M5 14h4a3 3 0 013 3" />} /></span>
                  <span style={{ ...TYPE.caption1, fontWeight: W.bold, color: '#fff' }}>이 그룹에 담긴 카메라</span>
                  <span style={{ ...TYPE.caption1, color: T.primaryStrong, fontWeight: W.bold, marginLeft: 'auto', whiteSpace: 'nowrap' }}>{curName || '그룹 없음'} · {heldCams.length}대</span>
                </div>
                <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }} className="prevax-scroll">
                  {heldCams.length === 0
                    ? <div style={{ ...TYPE.caption2, color: '#6f6f77', padding: `${SP[12]} ${SP[12]}`, lineHeight: 1.5 }}>이 그룹엔 아직 카메라가 없어요. 오른쪽 전체 카메라를 골라 <b style={{ color: '#9a9aa2' }}>← 그룹에 담기</b>로 추가하세요.</div>
                    : heldCams.map((c) => {
                      const on = selDep.has(c.no);
                      const fresh = justAdded.has(c.no);
                      return (
                        <div key={c.no} onClick={() => toggleDep(c.no)} style={{
                          display: 'flex', alignItems: 'center', gap: SP[8], padding: `6px ${SP[12]}`, ...TYPE.caption1, cursor: 'pointer',
                          borderBottom: `1px solid ${pt(0.12)}`, color: on ? '#fff' : '#d4d4d8',
                          background: on ? pt(0.20) : fresh ? posT(0.10) : 'transparent', borderLeft: `3px solid ${on ? T.primary : 'transparent'}`,
                        }}>
                          <span style={{ display: 'inline-flex', flexShrink: 0 }}><Icon name="nest_cam_outdoor" size={14} color={on ? T.primaryStrong : '#8a8a92'} /></span>
                          <span style={{ color: '#8a8a92', fontVariantNumeric: 'tabular-nums' }}>{c.no}</span>
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                          {fresh && <span style={{ ...TYPE.caption2, fontWeight: W.bold, color: T.positive, border: `1px solid ${posT(0.4)}`, borderRadius: '5px', padding: `0 ${SP[4]}` }}>방금 추가</span>}
                        </div>
                      );
                    })}
                </div>
              </div>

              <div style={{ flexShrink: 0, display: 'flex', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, borderTop: '1px solid #2a2a30', background: '#16161a' }}>
                <span style={{ ...btnSm, opacity: selGroup ? 1 : 0.5 }} onClick={() => selGroup && setInline({ mode: 'edit', value: curName })}><S d={<path d="M4 20h4L18 10l-4-4L4 16z" />} /> 그룹 이름 수정</span>
                <span style={{ ...btnSm, color: T.error, borderColor: 'rgba(255,99,99,0.5)', opacity: selGroup ? 1 : 0.5 }} onClick={deleteGroup}><S d={<path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13" />} /> 삭제</span>
              </div>
            </div>

            {/* ── 가운데: 방향 버튼(화살표=실제 이동 방향) + 안내문 ── */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: SP[12] }}>
              <button type="button" onClick={doAdd} disabled={!selGroup || selAll.size === 0} style={dirBtn(true, !!selGroup && selAll.size > 0)}>
                <S size={15} sw={2.4} d={<path d="M19 12H6M11 6l-6 6 6 6" />} /> 그룹에 담기{selAll.size > 0 ? ` (${selAll.size})` : ''}
              </button>
              <button type="button" onClick={doRemove} disabled={!selGroup || selDep.size === 0} style={dirBtn(false, !!selGroup && selDep.size > 0)}>
                그룹에서 빼기{selDep.size > 0 ? ` (${selDep.size})` : ''} <S size={15} sw={2.4} d={<path d="M5 12h13M13 6l6 6-6 6" />} />
              </button>
              <div style={{ ...TYPE.caption2, color: '#9a9aa2', textAlign: 'center', lineHeight: 1.5, padding: `${SP[8]} 6px`, border: '1px dashed #2e2e35', borderRadius: '6px' }}>
                오른쪽 <b style={{ color: '#d4d4d8' }}>전체 카메라</b>를 골라<br /><b style={{ color: '#d4d4d8' }}>← 그룹에 담기</b>로 이 그룹에 담고,<br /><b style={{ color: '#d4d4d8' }}>그룹에서 빼기 →</b>로 되돌립니다.
              </div>
            </div>

            {/* ── 우: 전체 카메라 목록(소속 그룹 + 배치 상태) ── */}
            <div style={pane}>
              <div style={paneH}>
                <span style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff' }}>전체 카메라 목록</span>
                <span style={{ ...TYPE.caption1, color: '#8a8a92' }}>{CAMERAS.length}대</span>
              </div>
              {renderSearch(camQ, setCamQ, '카메라명 · 번호 검색')}
              <div style={filterCount}>{camQ.trim() ? <b style={{ color: T.primaryStrong }}>{CAMERAS.length}대 중 {shownCams.length}대</b> : <>번호순 · {CAMERAS.length}대 <span style={{ color: '#6f6f77' }}>· 정렬 키는 번호(소속 그룹 무관)</span></>}</div>

              {/* 컬럼 헤더 */}
              <div style={{ display: 'flex', alignItems: 'center', padding: `7px ${SP[12]}`, background: '#202024', borderBottom: '1px solid #2a2a30', ...TYPE.caption2, fontWeight: W.bold, color: '#9a9aa2', letterSpacing: '0.02em' }}>
                <span style={{ flex: '0 0 24px' }} />
                <span style={{ flex: '0 0 48px' }}>번호</span>
                <span style={{ flex: 1 }}>카메라명</span>
                <span style={{ flex: 1.3 }}>소속 그룹</span>
                <span style={{ flex: '0 0 64px' }}>제조사</span>
              </div>

              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }} className="prevax-scroll">
                {shownCams.length === 0 && camQ.trim()
                  ? searchEmpty(camQ.trim(), '카메라', () => setCamQ(''))
                  : shownCams.map((c) => {
                    const mine = memb[c.no] || [];
                    const held = mine.includes(selGroup);
                    const others = mine.filter((g) => g !== selGroup).map(groupName).filter(Boolean).sort(koSort);
                    const unassigned = mine.length === 0;
                    const picked = selAll.has(c.no);
                    return (
                      <div
                        key={c.no}
                        onClick={() => { if (!held) toggleAll(c.no); }}
                        style={{
                          display: 'flex', alignItems: 'center', padding: `7px ${SP[12]}`, ...TYPE.caption1,
                          borderBottom: '1px solid #232329', cursor: held ? 'default' : 'pointer',
                          color: held ? '#9a9aa2' : '#d4d4d8',
                          background: picked ? pt(0.22) : held ? 'rgba(255,255,255,0.045)' : 'transparent',
                        }}
                      >
                        {/* 앞 체크 자리 = 정렬용 스페이서(담김 표시는 카메라명 앞 "담김" 칩으로 단일화 — 체크박스 아님) */}
                        <span style={{ flex: '0 0 24px' }} />
                        <span style={{ flex: '0 0 48px', color: picked ? T.primaryStrong : '#8a8a92', fontWeight: picked ? W.bold : W.regular, fontVariantNumeric: 'tabular-nums' }}>{c.no}</span>
                        <span style={{ flex: 1, color: picked ? '#fff' : undefined, display: 'inline-flex', alignItems: 'center', gap: SP[4], minWidth: 0 }}>
                          {held && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', ...TYPE.caption2, fontWeight: W.bold, color: T.positive, border: `1px solid ${posT(0.42)}`, background: posT(0.10), borderRadius: '5px', padding: `0 ${SP[4]}`, flexShrink: 0 }}>{check(9)} 담김</span>}
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                        </span>
                        {/* 소속 그룹 칸 */}
                        <span style={{ flex: 1.3, minWidth: 0, display: 'flex', alignItems: 'center', gap: SP[4] }}>
                          {unassigned ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', ...TYPE.caption2, fontWeight: W.semibold, color: T.cautionary }}>{ban()} 미배치</span>
                          ) : others.length === 0 ? (
                            <span style={{ color: '#6f6f77' }}>—</span>
                          ) : (
                            <>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', maxWidth: '100%', minWidth: 0, ...TYPE.caption2, fontWeight: W.semibold, color: '#d4d4d8', border: '1px solid #33333b', background: '#202024', borderRadius: '5px', padding: `1px ${SP[8]}` }}>
                                <span style={{ display: 'inline-flex', flexShrink: 0 }}><Icon name="folder_open" size={12} color="#8a8a92" /></span>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{others[0]}</span>
                              </span>
                              {others.length > 1 && (
                                <span
                                  style={{ position: 'relative', ...TYPE.caption2, fontWeight: W.bold, color: T.primaryStrong, borderBottom: `1px dashed ${pt(0.55)}`, cursor: 'default', whiteSpace: 'nowrap', flexShrink: 0 }}
                                  tabIndex={0}
                                  onMouseEnter={() => setTipCam(c.no)} onMouseLeave={() => setTipCam(null)}
                                  onFocus={() => setTipCam(c.no)} onBlur={() => setTipCam(null)}
                                >
                                  외 {others.length - 1}
                                  {tipCam === c.no && (
                                    <span style={{ position: 'absolute', left: 0, top: 'calc(100% + 8px)', zIndex: 50, minWidth: '148px', background: '#1f1f24', border: '1px solid #3a3a42', borderRadius: '8px', boxShadow: '0 12px 32px rgba(0,0,0,0.7)', padding: `${SP[8]} ${SP[12]}` }}>
                                      {/* Tooltip 화살표(정본 양식): 본문과 동일 배경 8px, 위쪽 대상("외 n")을 향함. 아래로 열어 스크롤 상단 잘림 방지 */}
                                      <span style={{ position: 'absolute', left: '14px', top: '-5px', width: '8px', height: '8px', background: '#1f1f24', borderLeft: '1px solid #3a3a42', borderTop: '1px solid #3a3a42', transform: 'rotate(45deg)' }} />
                                      <div style={{ ...TYPE.caption2, fontWeight: W.bold, color: '#8a8a92', marginBottom: '5px' }}>소속 그룹 전체 (가나다순)</div>
                                      {[...mine].map(groupName).filter(Boolean).sort(koSort).map((nm) => (
                                        <div key={nm} style={{ ...TYPE.caption1, color: '#d4d4d8', lineHeight: 1.7, whiteSpace: 'nowrap' }}>
                                          {nm}{nm === curName && <span style={{ ...TYPE.caption2, color: T.primaryStrong, fontWeight: W.bold, marginLeft: '5px' }}>(현재 편집 중)</span>}
                                        </div>
                                      ))}
                                    </span>
                                  )}
                                </span>
                              )}
                            </>
                          )}
                        </span>
                        <span style={{ flex: '0 0 64px', color: '#8a8a92' }}>{c.maker}</span>
                      </div>
                    );
                  })}
              </div>

              {/* 액션 가드 안내 */}
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-start', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, borderTop: '1px solid #2a2a30', ...TYPE.caption2, color: '#9a9aa2', lineHeight: 1.55 }}>
                <span style={{ color: '#6f6f77', flexShrink: 0, marginTop: '1px', display: 'inline-flex' }}>{info(13)}</span>
                <span><b style={{ color: T.positive }}>✔ 담김</b> = 지금 편집 중인 그룹({curName || '—'})에 이미 들어 있어요 — 중복 추가 방지로 선택이 막혀요. <b style={{ color: '#d4d4d8' }}>소속 그룹</b> 칸은 그 카메라가 든 <b style={{ color: '#d4d4d8' }}>다른</b> 그룹이에요(현재 그룹 제외). "외 n"에 마우스를 올리면 전체 그룹이 보입니다.</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 이벤트 활성화 관리(VideoEventsManagement) — 독립 창(DXWindow 다크) 리스킨
//  좌측 지역 4계층 트리 + 우측 카메라×이벤트 매트릭스(고정 3칼럼 + 동적 이벤트 칼럼)
//  셀 4상태: 전체 활성화(positive) / 일부 비활성화(cautionary) / 전체 비활성화(native) / −(설정없음)
//  ※ 폐기 Primary 미사용 — 정본 토큰(T.primary / T.primaryStrong / T.primaryHeavy)만 사용.
// ─────────────────────────────────────────────────────────────────────────
function PrevaxEventActivationScreen() {
  // ── 데모 데이터: 이벤트 8종(가로 스크롤 유발), 카메라 8대 ──
  const EVENTS = ['침입', '배회', '유기', '쓰러짐(낙상)', '화재', '연기', '군집', '월담'];
  const CAMERAS = [
    { no: '1001', name: '건영빌딩 정문' },
    { no: '1002', name: '건영빌딩 후문' },
    { no: '1003', name: '건영빌딩 지하주차장' },
    { no: '1004', name: '건영빌딩 옥상' },
    { no: '1005', name: '건영빌딩 로비' },
    { no: '1006', name: '상가동 1층 출입구' },
    { no: '1007', name: '상가동 비상계단' },
    { no: '1008', name: '주차타워 진입로' },
  ];
  // 셀 상태: 'on'(전체 활성화) | 'part'(일부 비활성화) | 'off'(전체 비활성화) | 'none'(설정 없음)
  //  part는 [활성, 전체] 카운트를 동반. 4상태가 골고루 보이도록 구성.
  const MX = {
    '1001': { '침입': ['on'], '배회': ['off'], '유기': ['none'], '쓰러짐(낙상)': ['on'], '화재': ['on'], '연기': ['none'], '군집': ['part', 2, 3], '월담': ['on'] },
    '1002': { '침입': ['part', 3, 4], '배회': ['on'], '유기': ['on'], '쓰러짐(낙상)': ['none'], '화재': ['off'], '연기': ['on'], '군집': ['none'], '월담': ['part', 1, 2] },
    '1003': { '침입': ['on'], '배회': ['on'], '유기': ['off'], '쓰러짐(낙상)': ['none'], '화재': ['none'], '연기': ['off'], '군집': ['on'], '월담': ['none'] },
    '1004': { '침입': ['off'], '배회': ['none'], '유기': ['none'], '쓰러짐(낙상)': ['on'], '화재': ['part', 1, 3], '연기': ['none'], '군집': ['none'], '월담': ['off'] },
    '1005': { '침입': ['on'], '배회': ['part', 2, 2], '유기': ['on'], '쓰러짐(낙상)': ['on'], '화재': ['on'], '연기': ['on'], '군집': ['part', 1, 4], '월담': ['none'] },
    '1006': { '침입': ['none'], '배회': ['on'], '유기': ['off'], '쓰러짐(낙상)': ['none'], '화재': ['off'], '연기': ['none'], '군집': ['on'], '월담': ['on'] },
    '1007': { '침입': ['part', 1, 2], '배회': ['none'], '유기': ['none'], '쓰러짐(낙상)': ['off'], '화재': ['on'], '연기': ['part', 2, 3], '군집': ['none'], '월담': ['none'] },
    '1008': { '침입': ['on'], '배회': ['off'], '유기': ['on'], '쓰러짐(낙상)': ['on'], '화재': ['none'], '연기': ['on'], '군집': ['off'], '월담': ['part', 3, 5] },
  };

  // ── 지역 2단 트리(상위 구역 → 말단 섹션; 말단=섹션만 카메라 체크 의미) ──
  const TREE = [
    { d: 0, label: '건영빌딩', count: null },
    { d: 1, label: '지상부', count: 16, sel: true },
    { d: 1, label: '지하부', count: 8 },
    { d: 0, label: '상가동', count: null },
    { d: 1, label: '공용부', count: 12 },
    { d: 0, label: '주차타워', count: 6 },
  ];

  const [q, setQ] = useState('');
  const [deactOnly, setDeactOnly] = useState(false);
  const [selTree, setSelTree] = useState('지상부');
  const [selCells, setSelCells] = useState(() => new Set()); // `${no}|${ev}`
  const [tip, setTip] = useState(null); // 셀 말줄임 툴팁 키

  // ── 토큰 기반 색 헬퍼(camera-group과 동일 규약) ──
  const pt = (a) => `rgba(0,102,255,${a})`;
  const posT = (a) => `rgba(30,212,90,${a})`;
  const cauT = (a) => `rgba(255,169,56,${a})`;
  const errT = (a) => `rgba(255,99,99,${a})`;

  const cellColor = { on: T.positive, part: T.cautionary, off: T.error, none: '#6f6f77' };
  const cellText = (st) => {
    const [kind, a, b] = st;
    if (kind === 'on') return '전체 활성화';
    if (kind === 'part') return `일부 비활성화 (${a}/${b})`;
    if (kind === 'off') return '전체 비활성화';
    return '−';
  };

  // ── 검색·필터 적용된 카메라 행 ──
  const qq = q.trim();
  const matchQ = (c) => !qq || c.name.includes(qq) || c.no.includes(qq);
  const hasDeact = (c) => EVENTS.some((ev) => { const k = MX[c.no][ev][0]; return k === 'off' || k === 'part'; });
  const shownCams = CAMERAS.filter((c) => matchQ(c) && (!deactOnly || hasDeact(c)));
  const isEmpty = CAMERAS.length === 0;          // 빈 상태(데이터 자체 없음) — 데모상 false
  const isNoResult = !isEmpty && shownCams.length === 0; // 검색 0건(데이터는 있음)

  const selCount = selCells.size;
  const cellKey = (no, ev) => `${no}|${ev}`;
  const toggleCell = (no, ev) => setSelCells((s) => { const n = new Set(s); const k = cellKey(no, ev); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const clearSel = () => setSelCells(new Set());

  // ── 공용 글리프(camera-group과 동일 양식, 색은 currentColor) ──
  const S = ({ d, size = 14, sw = 2, fill }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || 'none'} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
  );
  const check = (size = 13) => <S size={size} sw={2.6} d={<path d="M5 13l4 4L19 7" />} />;
  const searchG = (size = 13) => <S size={size} sw={2} d={<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></>} />;
  const xGlyph = (size = 12) => <S size={size} sw={2.2} d={<path d="M6 6l12 12M18 6L6 18" />} />;

  // ── 체크박스 일괄 선택(행 머리=그 카메라 전체 이벤트 / 열 머리=그 이벤트 전체 카메라 / 좌상단=전체) ──
  const rowKeys = (no) => EVENTS.map((ev) => cellKey(no, ev));
  const colKeys = (ev) => shownCams.map((c) => cellKey(c.no, ev));
  const allKeys = shownCams.flatMap((c) => EVENTS.map((ev) => cellKey(c.no, ev)));
  const allSel = (keys) => keys.length > 0 && keys.every((k) => selCells.has(k));
  const toggleKeys = (keys) => setSelCells((s) => {
    const n = new Set(s); const on = keys.length > 0 && keys.every((k) => n.has(k));
    keys.forEach((k) => (on ? n.delete(k) : n.add(k)));
    return n;
  });
  const CkBox = ({ on, onClick, bg = '#101317' }) => (
    <span onClick={onClick} style={{ width: '13px', height: '13px', borderRadius: '3px', flexShrink: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${on ? T.primary : '#33333b'}`, background: on ? T.primary : bg }}>
      {on && <span style={{ display: 'inline-flex', color: '#fff' }}>{check(9)}</span>}
    </span>
  );

  // ── 스타일 토큰 묶음 ──
  const winheadGroupLabel = { ...TYPE.caption2, fontWeight: W.bold, letterSpacing: '0.02em', color: '#7f7f87', whiteSpace: 'nowrap' };
  const hdSep = { width: '1px', alignSelf: 'stretch', minHeight: '26px', background: '#33333b', margin: `0 ${SP[12]}`, flexShrink: 0, borderRadius: '1px' };
  const btn = (tone) => {
    const base = { display: 'inline-flex', alignItems: 'center', gap: SP[4], ...TYPE.caption1, fontWeight: W.semibold, padding: `${SP[4]} ${SP[12]}`, borderRadius: '4px', cursor: 'pointer', fontFamily: T.font, whiteSpace: 'nowrap' };
    if (tone === 'primary') return { ...base, background: T.primary, border: `1px solid ${T.primary}`, color: '#fff' };
    if (tone === 'danger') return { ...base, background: errT(0.10), border: `1px solid ${errT(0.5)}`, color: T.error };
    return { ...base, background: '#202024', border: '1px solid #2e2e35', color: '#9a9aa2' }; // ghost
  };
  const legendDot = (kind) => ({ width: '4px', height: '4px', borderRadius: '50%', flexShrink: 0, ...(kind === 'none' ? { background: 'transparent', border: '1px dashed #33333b' } : { background: cellColor[kind] }) });

  // 고정 3칼럼 좌표(체크 42 / 번호 96 / 카메라명 150)
  const FROZEN_BG = '#1a1a1f';        // 본문 셀 frozen 배경(앱 배경과 동일)
  const HEAD_BG = '#1b1e23';          // 그리드 헤더(Settings 정본 그리드 헤더값)
  const gc = { flexShrink: 0, display: 'flex', alignItems: 'center', padding: `0 ${SP[8]}`, height: '34px', ...TYPE.caption1, color: '#d4d4d8', borderRight: '1px solid #232329', boxSizing: 'border-box' };

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      <PrevaxTitleBar datetime="2026.06.28 09:42:10" />
      <PrevaxTabBar active="실시간영상" />

      {/* ── 헤더: 제목줄 / 동작줄 / 상태·안내줄 ── */}
      <div style={{ flexShrink: 0, background: '#15151a', borderBottom: '1px solid #2a2a30', padding: `${SP[12]} ${SP[16]}` }}>
        {/* 제목줄 + 선택방법 (?) 툴팁 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: T.primary, flexShrink: 0 }} />
          <span style={{ ...TYPE.label1, fontWeight: W.bold, color: '#fff' }}>이벤트 활성화 관리</span>
          <HelpTip text="선택 방법: 셀을 직접 클릭(드래그 다중)·행 체크(카메라 전체)·열 머리(이벤트 전체)·행 머리(카메라 전체)로 검지 대상을 고릅니다." />
        </div>

        {/* 동작줄: [검색 그룹] | [선택: 전체 해제] | [적용: 활성화·비활성화] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], marginTop: SP[12], paddingTop: SP[12], borderTop: '1px solid #232329' }}>
          {/* 검색 그룹 */}
          <span style={winheadGroupLabel}>검색</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
            {/* Search 박스 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], height: '30px', minWidth: '184px', padding: `0 9px`, background: q ? '#101015' : '#141417', border: `1px solid ${q ? T.primaryStrong : '#2e2e35'}`, borderRadius: '5px' }}>
              <span style={{ color: '#6f6f77', display: 'inline-flex', flexShrink: 0 }}>{searchG()}</span>
              <input
                value={q} onChange={(e) => setQ(e.target.value)} placeholder="카메라명 · 번호 검색"
                style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: q ? '#fff' : '#9a9aa2', fontFamily: T.font, ...TYPE.caption1, fontWeight: q ? W.semibold : W.regular }}
              />
              {q && (
                <span onClick={() => setQ('')} aria-label="입력 내용 지우기" style={{ width: '18px', height: '18px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: C.clearIcon, background: C.clearBg, border: 'none', cursor: 'pointer' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
                </span>
              )}
            </div>
            {/* 비활성만 보기 토글(cautionary) */}
            <span onClick={() => setDeactOnly((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], height: '28px', padding: `0 ${SP[8]}`, border: `1px solid ${deactOnly ? cauT(0.5) : '#2e2e35'}`, borderRadius: '6px', background: deactOnly ? cauT(0.12) : '#202024', whiteSpace: 'nowrap', cursor: 'pointer' }}>
              <span style={{ position: 'relative', width: '30px', height: '16px', borderRadius: '8px', background: deactOnly ? T.cautionary : '#3a3a42', flexShrink: 0, transition: 'background 120ms' }}>
                <span style={{ position: 'absolute', top: '2px', left: deactOnly ? '16px' : '2px', width: '12px', height: '12px', borderRadius: '50%', background: '#fff', transition: 'left 120ms' }} />
              </span>
              <span style={{ ...TYPE.caption1, fontWeight: W.semibold, color: deactOnly ? T.cautionary : '#9a9aa2' }}>비활성만 보기</span>
            </span>
            {/* 상태 칩 — 토글 ON일 때만 */}
            {deactOnly && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], height: '26px', ...TYPE.caption2, color: '#ffd699', whiteSpace: 'nowrap' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: T.cautionary, flexShrink: 0 }} />
                비활성만 표시 중
                <span onClick={() => setDeactOnly(false)} style={{ width: '18px', height: '18px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: '#ffd699', background: cauT(0.18), cursor: 'pointer' }}>{xGlyph(10)}</span>
              </span>
            )}
          </div>

          <span style={hdSep} />

          {/* 선택 그룹: 전체 해제 */}
          <span style={winheadGroupLabel}>선택</span>
          <span style={{ ...TYPE.caption1, color: selCount ? '#d4d4d8' : '#6f6f77', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
            <b style={{ color: selCount ? T.primaryStrong : '#6f6f77', fontWeight: W.bold }}>{selCount}</b>개 선택됨
          </span>
          <span onClick={clearSel} style={{ ...btn('ghost'), opacity: selCount ? 1 : 0.5, cursor: selCount ? 'pointer' : 'not-allowed' }}>전체 해제</span>

          {/* 적용 그룹 — 우측 정렬(테두리 박스 제거, 평평) */}
          <span style={{ flex: 1, minWidth: SP[8] }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: SP[16] }}>
            <span style={{ ...winheadGroupLabel, color: T.primaryStrong }}>적용</span>
            <span style={{ ...btn('primary'), opacity: selCount ? 1 : 0.55, cursor: selCount ? 'pointer' : 'not-allowed' }}>
              <span style={{ display: 'inline-flex', color: '#fff' }}>{check(13)}</span> 활성화
            </span>
            <span style={{ ...btn('danger'), opacity: selCount ? 1 : 0.55, cursor: selCount ? 'pointer' : 'not-allowed' }}>
              <span style={{ display: 'inline-flex' }}><Icon name="error" size={13} color={T.error} /></span> 비활성화
            </span>
          </div>
        </div>

        {/* 상태·안내줄: 전 ROI 일괄 안내(cautionary) + 범례 상시 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: SP[12], flexWrap: 'wrap', marginTop: SP[12], paddingTop: SP[12], borderTop: '1px solid #232329' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], ...TYPE.caption1, color: T.cautionary }}>
            <span style={{ display: 'inline-flex', flexShrink: 0 }}><Icon name="warning" size={13} color={T.cautionary} /></span>
            활성화 · 비활성화는 선택 항목의 모든 검지영역(ROI)에 함께 적용됩니다.
          </span>
          <span style={{ flex: 1, minWidth: SP[8] }} />
          {/* 범례 상시 */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: SP[16], ...TYPE.caption2, color: '#7f7f87' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4] }}><span style={legendDot('on')} /> 전체 활성화</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4] }}><span style={legendDot('part')} /> 일부 비활성화</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4] }}><span style={legendDot('off')} /> 전체 비활성화</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4] }}><span style={legendDot('none')} /> − 설정 없음</span>
          </div>
        </div>
      </div>

      {/* ── 본문: 좌 트리 + 우 매트릭스 ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 좌측 지역 트리 */}
        <div style={{ width: '280px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: SP[8], height: '36px', padding: `0 ${SP[12]}`, borderBottom: '1px solid #2a2a30' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #33333b', background: '#141417', flexShrink: 0 }} />
            <span style={{ ...TYPE.caption1, fontWeight: W.bold, color: '#d4d4d8' }}>지역</span>
            <span style={{ ...TYPE.caption2, color: '#6f6f77', marginLeft: 'auto' }}>말단 섹션만 카메라 체크 단위</span>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: `6px 0` }} className="prevax-scroll">
            {TREE.map((n, i) => {
              const pad = [12, 28, 44, 60][n.d];
              const leaf = n.count != null;
              const on = leaf && n.label === selTree;
              return (
                <div key={i} onClick={() => leaf && setSelTree(n.label)} style={{
                  display: 'flex', alignItems: 'center', gap: SP[8], padding: `5px ${SP[12]}`, paddingLeft: `${pad}px`,
                  ...TYPE.caption1, cursor: leaf ? 'pointer' : 'default', whiteSpace: 'nowrap',
                  background: on ? pt(0.32) : 'transparent', borderLeft: `3px solid ${on ? T.primary : 'transparent'}`,
                  color: on ? '#fff' : leaf ? '#d4d4d8' : '#c4c4cc', fontWeight: leaf ? W.regular : W.semibold,
                }}>
                  <span style={{ width: '10px', ...TYPE.caption2, color: '#7f7f87', flexShrink: 0 }}>{leaf ? '' : '▾'}</span>
                  {/* 상위노드 체크박스는 흐리게(opacity .45) — 직접 선택 단위 아님 */}
                  <span style={{ width: '13px', height: '13px', borderRadius: '3px', border: `1px solid ${on ? T.primary : '#33333b'}`, background: on ? T.primary : '#141417', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', opacity: leaf ? 1 : 0.45 }}>
                    {on && <span style={{ display: 'inline-flex', color: '#fff' }}>{check(9)}</span>}
                  </span>
                  {/* 말단 섹션(카메라 체크 단위)만 카메라 아이콘 — HI-FI 트리와 통일 */}
                  {leaf && (
                    <span style={{ display: 'inline-flex', flexShrink: 0 }}>
                      <Icon name="nest_cam_outdoor" size={13} color={on ? T.primaryStrong : '#7f7f87'} />
                    </span>
                  )}
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.label}</span>
                  {n.count != null && <span style={{ ...TYPE.caption2, color: on ? '#c4c4cc' : '#7f7f87', fontVariantNumeric: 'tabular-nums' }}>[{n.count}]</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* 우측 매트릭스 그리드 */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative', background: '#1a1a1f', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }} className="prevax-scroll">
            <div style={{ display: 'inline-block', minWidth: '100%' }}>
              {/* 헤더 행 — sticky top */}
              <div style={{ display: 'flex', position: 'sticky', top: 0, zIndex: 5, background: HEAD_BG, borderBottom: '1px solid #2a2a30' }}>
                <div style={{ ...gc, width: '42px', justifyContent: 'center', position: 'sticky', left: 0, zIndex: 6, background: HEAD_BG }}>
                  <CkBox on={allSel(allKeys)} onClick={() => toggleKeys(allKeys)} />
                </div>
                <div style={{ ...gc, width: '96px', position: 'sticky', left: '42px', zIndex: 6, background: HEAD_BG, ...TYPE.caption2, fontWeight: W.bold, color: '#9a9aa2' }}>카메라 번호</div>
                <div style={{ ...gc, width: '150px', position: 'sticky', left: '138px', zIndex: 6, background: HEAD_BG, ...TYPE.caption2, fontWeight: W.bold, color: '#9a9aa2', boxShadow: '6px 0 8px -6px rgba(0,0,0,0.9)' }}>카메라명</div>
                {EVENTS.map((ev) => (
                  <div key={ev} style={{ ...gc, width: ev.length > 4 ? '150px' : '138px', gap: SP[8], ...TYPE.caption2, fontWeight: W.bold, color: '#c4c4cc' }}>
                    <CkBox on={allSel(colKeys(ev))} onClick={() => toggleKeys(colKeys(ev))} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev}</span>
                  </div>
                ))}
              </div>

              {/* 본문 행 */}
              {shownCams.map((c) => (
                <div key={c.no} style={{ display: 'flex', borderBottom: '1px solid #232329' }}>
                  <div style={{ ...gc, width: '42px', justifyContent: 'center', position: 'sticky', left: 0, zIndex: 4, background: FROZEN_BG }}>
                    <CkBox on={allSel(rowKeys(c.no))} onClick={() => toggleKeys(rowKeys(c.no))} bg="#141417" />
                  </div>
                  <div style={{ ...gc, width: '96px', position: 'sticky', left: '42px', zIndex: 4, background: FROZEN_BG, color: '#8a8a92', fontVariantNumeric: 'tabular-nums' }}>{c.no}</div>
                  <div style={{ ...gc, width: '150px', position: 'sticky', left: '138px', zIndex: 4, background: FROZEN_BG, color: '#e8e8ec', boxShadow: '6px 0 8px -6px rgba(0,0,0,0.7)' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                  </div>
                  {EVENTS.map((ev) => {
                    const st = MX[c.no][ev];
                    const kind = st[0];
                    const txt = cellText(st);
                    const picked = selCells.has(cellKey(c.no, ev));
                    const fg = picked && kind === 'on' ? '#a8f0c2'
                      : picked && kind === 'part' ? '#ffe0b0'
                      : picked && kind === 'off' ? '#ffd0d0'
                      : picked && kind === 'none' ? '#b8b8c0'
                      : kind === 'on' ? T.positive
                      : kind === 'part' ? '#ffd08a'
                      : kind === 'off' ? '#ffb0b0'
                      : '#6f6f77';
                    const tipKey = cellKey(c.no, ev);
                    return (
                      <div
                        key={ev}
                        onClick={() => toggleCell(c.no, ev)}
                        onMouseEnter={() => setTip(tipKey)} onMouseLeave={() => setTip(null)}
                        style={{ ...gc, width: ev.length > 4 ? '150px' : '138px', position: 'relative', cursor: 'pointer', background: picked ? pt(0.30) : 'transparent' }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], minWidth: 0, maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', color: fg }}>
                          <span style={{ width: '4px', height: '4px', borderRadius: '50%', flexShrink: 0, ...(kind === 'none' ? { background: 'transparent', border: '1px dashed #33333b' } : { background: cellColor[kind], boxShadow: `0 0 0 1px ${kind === 'on' ? posT(0.18) : kind === 'part' ? cauT(0.2) : errT(0.18)}` }) }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...TYPE.caption1, fontWeight: kind === 'none' ? W.regular : W.semibold }}>{txt}</span>
                        </span>
                        {/* 폭 부족 시 말줄임 대비 툴팁(셀 값과 동일 문자열) */}
                        {tip === tipKey && (
                          <span style={{ position: 'absolute', left: SP[8], top: 'calc(100% - 4px)', zIndex: 30, background: '#1f1f24', border: '1px solid #3a3a42', borderRadius: '7px', boxShadow: '0 12px 30px rgba(0,0,0,0.7)', padding: `6px ${SP[8]}`, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
                            <span style={{ ...TYPE.caption2, color: '#d4d4d8' }}>{txt}</span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* 오버레이 — 검색 0건(데이터는 있음) / 빈 상태. pointer-events:none */}
          {(isNoResult || isEmpty) && (
            <div style={{ position: 'absolute', inset: '35px 0 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: SP[12], textAlign: 'center', pointerEvents: 'none', background: 'rgba(26,26,31,0.55)' }}>
              <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '13px', border: '1.5px dashed #33333b', background: 'rgba(255,255,255,0.02)', color: '#8a8a92' }}>
                {isNoResult ? searchG(24) : <Icon name="nest_cam_outdoor" size={24} color="#8a8a92" />}
              </div>
              <div style={{ ...TYPE.caption1, fontWeight: W.bold, color: '#e8e8ec', lineHeight: 1.5 }}>
                {isNoResult
                  ? <>조건에 맞는 카메라가 없어요. {qq && <span style={{ color: T.primaryStrong }}>"{qq}"</span>} 검색어나 "비활성만 보기"를 조정해 보세요.</>
                  : <>좌측 트리에서 지역(섹션)을 선택하면 카메라가 여기 표시됩니다.</>}
              </div>
              {isNoResult
                ? <span style={{ ...TYPE.caption2, fontWeight: W.semibold, color: T.cautionary, border: `1px solid ${cauT(0.45)}`, background: cauT(0.12), borderRadius: '6px', padding: `${SP[2]} ${SP[8]}` }}>검색 0건 (데이터는 있음)</span>
                : <span style={{ ...TYPE.caption2, fontWeight: W.semibold, color: '#9a9aa2', border: '1px solid #33333b', background: '#202024', borderRadius: '6px', padding: `${SP[2]} ${SP[8]}` }}>빈 상태</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 제목줄 선택방법 (?) 툴팁 — 호버로 펼침
function HelpTip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      style={{ position: 'relative', width: '16px', height: '16px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2e2e35', borderRadius: '50%', color: '#7f7f87', ...TYPE.caption2, fontWeight: W.bold, cursor: 'default' }}
    >
      ?
      {open && (
        <span style={{ position: 'absolute', left: 0, top: 'calc(100% + 6px)', zIndex: 40, width: '300px', background: '#1f1f24', border: '1px solid #3a3a42', borderRadius: '7px', padding: `9px ${SP[12]}`, boxShadow: '0 12px 30px rgba(0,0,0,0.6)', ...TYPE.caption2, fontWeight: W.regular, color: '#c4c4cc', lineHeight: 1.6, textAlign: 'left', whiteSpace: 'normal' }}>
          {text}
        </span>
      )}
    </span>
  );
}

// 예시 레지스트리 — 이후 화면 예시를 여기 추가
// 화면 예시 렌더러(JSX) — 문서 메타데이터(title/description/uses)는 data/templates.js에서 공유.
/**
 * PREVAX 4 설정 > 알림 설정 화면 — "실시간 이벤트 알림" 체크 시 우하단 알림 창이 뜬 상태.
 * 기존 Settings 크롬(타이틀바·탭·설정 네비)을 공유하며, 알람 설정 카드(체크박스+시간/개수 입력)와
 * 실시간 이벤트 알림 팝업(경고 배너·위험/경고/주의 필터 칩·이벤트 피드)로 구성. 모든 색·타이포는 토큰.
 */
function PrevaxAlarmSettingsScreen() {
  const [soundOn, setSoundOn] = useState(false);
  const [popupOn, setPopupOn] = useState(false);
  const [rtOn, setRtOn] = useState(true); // 실시간 이벤트 알림 = 체크 상태(팝업 노출)

  const nav = [
    { sec: '시스템 설정', items: ['장비 관리', '이벤트 목록', '이벤트 정의', '스케줄 정의', '계정 관리', '데이터 보관기간 설정', '권한 설정', '이벤트 관리', '카메라 그룹 관리'] },
    { sec: '환경 설정', items: ['알림 설정'] },
    { sec: '정보', items: ['프로그램 정보'] },
  ];
  const navSel = '알림 설정';
  const pt = (a) => `rgba(0,102,255,${a})`;
  const cauT = (a) => `rgba(255,169,56,${a})`;

  // History(CS)와 통일한 패널 스타일 — 헤더 바(하단 보더) + 본문
  const panel = { background: '#16161a', border: '1px solid #2a2a30', borderRadius: '6px', display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' };
  const panelHead = { display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #2a2a30', minHeight: '43px', boxSizing: 'border-box' };
  const panelTitle = { ...TYPE.label1, fontWeight: W.bold, color: SEM.label.strong };
  const lbl = { ...TYPE.caption1, color: '#9a9aa2', whiteSpace: 'nowrap' };
  const ctl = { display: 'inline-flex', alignItems: 'center', height: '28px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px', ...TYPE.caption1, color: '#d4d4d8', fontFamily: T.font, fontVariantNumeric: 'tabular-nums', boxSizing: 'border-box' };
  const numField = (v, w) => <span style={{ ...ctl, width: w }}>{v}</span>;
  const timeDd = (v) => <span style={{ ...ctl, gap: SP[8], cursor: 'pointer' }}>{v}<span style={{ fontSize: '8px', color: '#7f7f87' }}>▾</span></span>;

  const Ck = ({ on, onClick, children, w }) => (
    <span onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], cursor: 'pointer', ...TYPE.caption1, color: on ? '#fff' : '#c4c4cc', whiteSpace: 'nowrap', ...(w ? { width: w, flexShrink: 0 } : {}) }}>
      <span style={{ width: '15px', height: '15px', borderRadius: '3px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${on ? T.primary : '#33333b'}`, background: on ? T.primary : '#141417' }}>
        {on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
      </span>
      {children}
    </span>
  );

  // 실시간 이벤트 알림 피드
  const feed = [
    { type: '침입', danger: false, cam: '[1] 핀텔_출입문', min: 5 },
    { type: '침입_경고', danger: true, cam: '[17] 핀텔_PTZ_04', min: 6 },
    { type: '침입', danger: false, cam: '[3] 방범_말죽거리_001', min: 6 },
    { type: '침입', danger: false, cam: '[1] 핀텔_출입문', min: 6 },
    { type: '침입', danger: false, cam: '[1] 핀텔_출입문', min: 6 },
    { type: '침입', danger: false, cam: '[1] 핀텔_출입문', min: 6 },
  ];

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      <PrevaxTitleBar datetime="2026.07.01 13:39:46" />
      <PrevaxTabBar active="설정" />

      <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>
        {/* 설정 네비 */}
        <div style={{ width: '186px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #2a2a30', overflowY: 'auto', padding: `${SP[8]} 0` }} className="prevax-scroll">
          {nav.map((g) => (
            <div key={g.sec} style={{ marginBottom: SP[8] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]} ${SP[4]}`, ...TYPE.label2, fontWeight: W.semibold, color: '#e8e8ec' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: T.primary }} />
                {g.sec}
              </div>
              {g.items.map((it) => {
                const on = it === navSel;
                return (
                  <div key={it} style={{
                    padding: `${SP[4]} ${SP[12]} ${SP[4]} ${SP[32]}`, ...TYPE.label2, cursor: 'pointer',
                    background: on ? pt(0.18) : 'transparent',
                    borderLeft: `2px solid ${on ? T.primary : 'transparent'}`,
                    color: on ? '#fff' : '#9a9aa2', fontWeight: on ? W.semibold : W.regular,
                  }}>{it}</div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 메인 — 알람 설정 (History(CS) 상단 필터 바처럼 전체폭 헤더+설정 바) */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* 헤더 바 — 전체폭, 하단 보더. 우측: 화면 전역 상태 경고(비활성 카메라) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], flexShrink: 0, padding: `${SP[8]} ${SP[16]}`, borderBottom: '1px solid #2a2a30', minHeight: '43px', boxSizing: 'border-box' }}>
            <span style={panelTitle}>알람 설정</span>
            <span style={{ flex: 1 }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8] }}>
              <Icon name="warning" size={14} color={T.cautionary} />
              <span style={{ ...TYPE.caption1, fontWeight: W.semibold, color: T.cautionary }}>4개 카메라 이벤트 비활성화</span>
              <Tbtn>관리</Tbtn>
            </span>
          </div>

          {/* 설정 바 — 전체폭, 하단 보더. 행 간격은 History(CS) 필터 바와 동일(SP8) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP[8], flexShrink: 0, padding: SP[16], borderBottom: '1px solid #232329' }}>
            {/* 이벤트 발생시 알람 소리 */}
            <div style={{ display: 'flex', alignItems: 'center', minHeight: '28px' }}>
              <Ck on={soundOn} onClick={() => setSoundOn((v) => !v)} w="188px">이벤트 발생시 알람 소리</Ck>
            </div>

            {/* 이벤트 발생시 알람 팝업 + 시간 */}
            <div style={{ display: 'flex', alignItems: 'center', minHeight: '28px', gap: SP[8], flexWrap: 'wrap' }}>
              <Ck on={popupOn} onClick={() => setPopupOn((v) => !v)} w="188px">이벤트 발생시 알람 팝업</Ck>
              <span style={{ ...lbl, marginLeft: SP[12] }}>시작 시간</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4] }}>{timeDd('09')}<span style={{ color: '#6f6f77' }}>:</span>{timeDd('00')}</span>
              <span style={{ ...lbl, marginLeft: SP[12] }}>~ 종료 시간</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4] }}>{timeDd('18')}<span style={{ color: '#6f6f77' }}>:</span>{timeDd('00')}</span>
              <span style={{ ...lbl, marginLeft: SP[12] }}>팝업 유지 시간</span>
              {numField('5', '48px')}<span style={lbl}>초</span>
            </div>

            {/* 실시간 이벤트 알림 + 유지시간/최대개수 · (우측) 이벤트 알림 열기 + 적용 */}
            <div style={{ display: 'flex', alignItems: 'center', minHeight: '28px', gap: SP[8], flexWrap: 'wrap' }}>
              <Ck on={rtOn} onClick={() => setRtOn((v) => !v)} w="188px">실시간 이벤트 알림</Ck>
              <span style={{ ...lbl, marginLeft: SP[12] }}>유지 시간</span>
              {numField('1', '48px')}<span style={lbl}>시간</span>
              <span style={{ ...lbl, marginLeft: SP[12] }}>최대 이벤트 개수</span>
              {numField('1000', '68px')}
              <span style={{ flex: 1 }} />
              <Tbtn onClick={() => setRtOn(true)}>이벤트 알림 열기</Tbtn>
              <Tbtn tone="primary">적용</Tbtn>
            </div>
          </div>
        </div>

        {/* ── 실시간 이벤트 알림 팝업(체크 시 노출, 우하단) ── */}
        {rtOn && (
          <div style={{ position: 'absolute', right: SP[16], bottom: SP[16], width: '432px', maxHeight: '66%', display: 'flex', flexDirection: 'column', background: '#1a1a1f', border: '1px solid #2e2e35', borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', overflow: 'hidden', zIndex: 10 }}>
            {/* 창 타이틀바 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], height: '34px', flexShrink: 0, padding: `0 ${SP[12]}`, background: '#141417', borderBottom: '1px solid #232329' }}>
              <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: `linear-gradient(135deg, ${T.primary}, ${T.primaryStrong})`, flexShrink: 0 }} />
              <span style={{ ...TYPE.caption1, fontWeight: W.bold, color: '#fff' }}>실시간 이벤트 알림</span>
              <span style={{ flex: 1 }} />
              <span style={{ display: 'inline-flex', gap: SP[12], color: '#8a8a92' }}>
                <span style={{ cursor: 'pointer' }}>—</span><span style={{ cursor: 'pointer' }}>▢</span>
                <span onClick={() => setRtOn(false)} style={{ cursor: 'pointer' }}>✕</span>
              </span>
            </div>
            {/* 경고 배너 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP[8], flexShrink: 0, padding: `6px ${SP[8]}`, background: cauT(0.14), borderBottom: '1px solid #232329' }}>
              <Icon name="error" size={14} color={T.cautionary} />
              <span style={{ ...TYPE.caption1, fontWeight: W.bold, color: T.cautionary }}>4개 카메라 이벤트 비활성화</span>
              <Tbtn>모니터링</Tbtn>
            </div>
            {/* 필터 칩 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], flexShrink: 0, padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #232329' }}>
              {[
                { label: '위험', count: 0, color: T.error },
                { label: '경고', count: 16, color: T.cautionary },
                { label: '주의', count: 46, color: '#9C9C5C' },
              ].map((s) => (
                <CBadge key={s.label} color={s.color}>
                  <span style={{ fontWeight: W.medium }}>{s.label}</span>
                  <span style={{ fontSize: '14px', fontWeight: W.bold, fontVariantNumeric: 'tabular-nums', marginLeft: '5px' }}>{s.count}</span>
                  <span style={{ ...TYPE.caption2, fontWeight: W.regular, opacity: 0.7, marginLeft: '1px' }}>회</span>
                </CBadge>
              ))}
              <span style={{ flex: 1 }} />
              {/* 삭제 — 카메라 그룹 관리(CS)의 삭제 버튼과 동일 양식(btnSm + T.error + trash 글리프) */}
              <button type="button" aria-label="삭제" title="삭제" style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4], flexShrink: 0, ...TYPE.caption1, fontWeight: W.semibold, padding: `${SP[4]} ${SP[8]}`, borderRadius: '5px', border: '1px solid rgba(255,99,99,0.5)', background: '#202024', color: T.error, cursor: 'pointer', fontFamily: T.font, whiteSpace: 'nowrap' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13" /></svg>
                삭제
              </button>
            </div>
            {/* 이벤트 피드 */}
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }} className="prevax-scroll">
              {feed.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #1f1f24', background: i % 2 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                  <span style={{ ...TYPE.caption1, fontWeight: W.semibold, color: r.danger ? T.error : '#c4c4cc', width: '62px', flexShrink: 0, whiteSpace: 'nowrap' }}>{r.type}</span>
                  <span style={{ ...TYPE.caption1, color: '#e4e4e8', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.cam}</span>
                  <span style={{ ...TYPE.caption2, color: '#8a8a92', flexShrink: 0 }}>미열람</span>
                  <span style={{ ...TYPE.caption2, color: '#6f6f77', flexShrink: 0 }}>·</span>
                  <span style={{ ...TYPE.caption2, color: '#8a8a92', whiteSpace: 'nowrap', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{r.min}분 경과</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * PREVAX 4 실시간 영상 — Focus(고정 집중) 화면. F-8.
 * 실시간영상 크롬(타이틀바·탭·좌 트리·영상옵션 툴바·그리드·하단 바)을 공유하며,
 * 특정 카메라를 "고정(핀)"하면 자동 순환 중에도 그 칸은 유지된다. 고정 = cautionary(#FFA938)
 * 배지+테두리로 표시, 셀 호버 시 "고정" 칩 노출·클릭 토글. 전부 고정 시 순환 정지 + 상단 안내 띠.
 */
function PrevaxLiveFocusScreen() {
  const cauT = (a) => `rgba(255,169,56,${a})`;
  // 고정(핀) 표시 색 — Foundation accentCyan(#1FC8E6). PTZ 텍스트와 동일 색으로 통일.
  const pinC = '#1FC8E6';
  const pinT = (a) => `rgba(31,200,230,${a})`;
  const SCENE = {
    road: 'linear-gradient(180deg,#1c2230,#10131a)', gate: 'linear-gradient(180deg,#23202a,#16141c)',
    park: 'linear-gradient(180deg,#1a2420,#121814)', plaza: 'linear-gradient(180deg,#202530,#13161d)',
    lobby: 'linear-gradient(180deg,#20222a,#15171d)', alley: 'linear-gradient(180deg,#1b1d24,#101218)',
  };
  const CAMS = [
    { no: 'CAM 02', loc: '강남역 2번출구', scene: 'gate', pin: true, bbox: '사람', ev: { label: '침입', color: T.cautionary } },
    { no: 'CAM 01', loc: '강남대로 사거리', scene: 'road', bbox: '차량', ev: { label: '배회', color: '#999999' } },
    { no: 'CAM 03', loc: '테헤란로 공원', scene: 'park' },
    { no: 'CAM 04', loc: '강남 지하상가', scene: 'plaza', bbox: '사람', ev: { label: '화재', color: T.error } },
    { no: 'CAM 09', loc: '역삼 광장', scene: 'plaza', pin: true },
    { no: 'CAM 05', loc: '선릉역 로비', scene: 'lobby' },
    { no: 'CAM 06', loc: '삼성로 사거리', connecting: true },
    { no: 'CAM 12', loc: '대치 공원', scene: 'park', pin: true },
    { empty: true },
  ];
  const realIdx = CAMS.map((c, i) => (c.empty ? -1 : i)).filter((i) => i >= 0);
  const [focus, setFocus] = useState(() => new Set(CAMS.map((c, i) => (c.pin ? i : -1)).filter((i) => i >= 0)));
  const [away, setAway] = useState(null); // 자리 비움 상태(대리 관제사명 or null)
  const [hover, setHover] = useState(null);
  const [menu, setMenu] = useState(null); // { i, x, y } — 우클릭 컨텍스트 메뉴
  const wrapRef = useRef(null);
  const toggle = (i) => setFocus((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  // 이벤트 표시 on/off — 셀별 토글(정본 PREVAX: 영상 위 이벤트 오버레이 표시 토글). 기본 = 이벤트 있는 셀 모두 ON.
  const [evOn, setEvOn] = useState(() => new Set(CAMS.map((c, i) => (c.ev ? i : -1)).filter((i) => i >= 0)));
  const toggleEv = (i) => setEvOn((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const openMenu = (e, i) => {
    e.preventDefault();
    const r = wrapRef.current && wrapRef.current.getBoundingClientRect();
    if (!r) return;
    setMenu({ i, x: Math.min(e.clientX - r.left, r.width - 224), y: Math.min(e.clientY - r.top, r.height - 250) });
  };
  // videoContext 실제 항목(VideoScreen.xaml + resources.xml 라벨). 가짜 항목 없음.
  // 아이콘·순서는 Figma "Component 24"(783:1750) videoContext 세트를 따른다(keep → settings → …).
  const CTX = [
    { label: '영상 분석 설정', icon: 'settings' },
    { label: '카메라 연동 분석 설정', sepAfter: true, icon: 'settings_video_camera' },
    { label: '선택 영상 재연결', icon: 'replace_video' },
    { label: '카메라 연결 테스트', sepBefore: true, icon: 'automation' },
    { label: '카메라 웹 연결', icon: 'language' },
    { label: '카메라 점검모드로 전환', icon: 'flip_camera_ios' },
  ];
  const ctxItem = (extra) => ({ display: 'flex', alignItems: 'center', gap: SP[8], padding: `7px ${SP[12]}`, ...TYPE.caption1, color: '#d4d4d8', cursor: 'pointer', whiteSpace: 'nowrap', ...extra });
  const allPinned = realIdx.every((i) => focus.has(i));
  // 셀 오버레이 타이포/여백 — 고정 화면은 3×3 고정이므로 기본(Live)의 3×3 티어와 동일
  const ov = { name: '11.5px', ptz: '10.5px', stamp: '13px', padY: SP[4], ptzPad: SP[12], namePad: SP[16], edge: '6px', gap: SP[4], evFont: '10px', evH: '18px', dot: '5px' };

  // 고정 아이콘 = Foundation 아이콘 세트의 keep(피그마 "keep" 777:1847). currentColor 상속.
  const PinGlyph = ({ size = 11 }) => <Icon name="keep" size={size} color="currentColor" />;


  // 좌측 지역 트리(컴팩트)
  const tree = [
    { d: 0, label: '강남 관제구역', ex: true },
    { d: 1, label: '강남대로', count: 8, ex: true, sel: true },
    { d: 2, label: 'CAM 01', cam: true }, { d: 2, label: 'CAM 02', cam: true, pin: true },
    { d: 2, label: 'CAM 03', cam: true }, { d: 2, label: 'CAM 04', cam: true },
    { d: 1, label: '역삼·삼성', count: 6 },
    { d: 1, label: '대치·선릉', count: 4 },
  ];
  // 영상 옵션 ON 상태 — 리뱀프 3축 라벨(정적 예시)
  const OPT_ON = { '객체 필터': true, '이벤트 필터': true, '영역 강조': true, '채널 강조': true, '분석 영역': true };

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9', display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      <PrevaxTitleBar datetime="2026.07.02 14:21:08" away={away} onApplyAway={setAway} onRestore={() => setAway(null)} />
      <PrevaxTabBar active="실시간영상" />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 좌: 지역정보 트리 패널 — 실시간 영상(기본)과 동일 크롬 */}
        <div style={{ width: '278px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], height: '37px', flexShrink: 0, padding: `0 ${SP[12]}`, borderBottom: '1px solid #2a2a30' }}>
            <span style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff' }}>지역정보 관리</span>
            <Icon name="cycle" size={13} color="#8a8a92" />
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a8a92" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
              <line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14l-1.6-5.8a2 2 0 0 0-1.9-1.5H8.5a2 2 0 0 0-1.9 1.5L5 17z" />
            </svg>
          </div>
          <div style={{ padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #232329' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], height: '28px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px' }}>
              <input placeholder="" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: T.font, ...TYPE.caption1 }} />
              <Icon name="search" size={14} color="#8a8a92" />
              <span style={{ fontSize: '8px', color: '#7f7f87', cursor: 'pointer' }}>▾</span>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: `${SP[4]} 0` }} className="prevax-scroll">
            {tree.map((n, i) => {
              const tier = n.d === 0
                ? { ...TYPE.label2, fontWeight: W.semibold, color: '#e4e4e8' }
                : n.cam
                ? { ...TYPE.caption1, fontWeight: W.regular, color: '#a4a4ac' }
                : { ...TYPE.label2, fontWeight: W.regular, color: '#c4c4cc' };
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: SP[4], cursor: 'pointer', userSelect: 'none',
                  padding: `${SP[4]} ${SP[8]}`, paddingLeft: `${10 + n.d * 14}px`, ...tier,
                  background: n.sel ? 'rgba(0, 102, 255,0.32)' : 'transparent',
                  borderLeft: `2px solid ${n.sel ? T.primary : 'transparent'}`,
                }}>
                  {n.ex ? <span style={{ width: '10px', fontSize: '8px', color: '#7f7f87', flexShrink: 0 }}>▾</span>
                    : <span style={{ width: '10px', flexShrink: 0 }} />}
                  {n.cam && <Icon name="nest_cam_outdoor" size={14} color={n.pin ? pinC : '#8a8a92'} />}
                  <span style={{ whiteSpace: 'nowrap' }}>{n.label}</span>
                  {n.pin && <span style={{ display: 'inline-flex', color: pinC, marginLeft: SP[2], flexShrink: 0 }}><PinGlyph size={11} /></span>}
                  {n.count != null && <span style={{ ...TYPE.caption2, color: '#7f7f87', marginLeft: SP[2] }}>[{n.count}]</span>}
                </div>
              );
            })}
          </div>
          {/* 장비 패널 하단 버튼군 — 새로고침 · 카메라 표시 설정 · 미배치 확인(F-2 진입, 신규) */}
          <div style={{ flexShrink: 0, borderTop: '1px solid #232329', padding: SP[8], display: 'flex', flexDirection: 'column', gap: SP[8] }}>
            {[{ label: '새로고침', icon: 'cycle' }, { label: '카메라 표시 설정', icon: 'settings' }].map((b) => (
              <span key={b.label} style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], height: '30px', padding: `0 ${SP[8]}`, borderRadius: '6px', border: '1px solid #2e2e35', background: '#202024', color: '#d4d4d8', ...TYPE.caption1, fontWeight: W.semibold, whiteSpace: 'nowrap', cursor: 'default' }}>
                <Icon name={b.icon} size={14} color="#9a9aa2" />{b.label}
              </span>
            ))}
            {/* 미배치 확인 — 신규 진입 버튼(Secondary + 연한 Primary 테두리, 과한 강조 회피) → 별도 창(F-2) */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], height: '30px', padding: `0 ${SP[8]}`, borderRadius: '6px', border: '1px solid rgba(51,133,255,0.45)', background: 'rgba(0,102,255,0.12)', color: '#bcd0ff', ...TYPE.caption1, fontWeight: W.semibold, whiteSpace: 'nowrap', cursor: 'pointer' }}>
              <Icon name="nest_cam_outdoor" size={14} color={T.primaryStrong} />미배치 확인
              <span style={{ marginLeft: 'auto', ...TYPE.caption2, fontWeight: W.bold, color: '#9dbbff', background: 'rgba(0,102,255,0.28)', borderRadius: '20px', padding: `0 ${SP[8]}`, fontVariantNumeric: 'tabular-nums' }}>12</span>
            </span>
          </div>
        </div>

        {/* 우: 툴바 + 그리드 + 하단 바 */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* 영상 옵션 툴바(리뱀프) — 실시간 영상(기본)과 동일 공용 컴포넌트 */}
          <VideoOptionsToolbar isOn={(l) => !!OPT_ON[l]} />

          {/* 영상 그리드 3×3 + 상단 안내(전부 고정 시) */}
          <div ref={wrapRef} onClick={() => menu && setMenu(null)} style={{ flex: 1, minHeight: 0, position: 'relative', background: '#000', padding: SP[2] }}>
            {away && <AwayOverlay operator={away} onRestore={() => setAway(null)} />}
            {allPinned && (
              <div style={{ position: 'absolute', left: SP[2], right: SP[2], top: SP[2], zIndex: 8, display: 'flex', alignItems: 'center', gap: SP[8], height: '26px', padding: `0 ${SP[12]}`, background: cauT(0.16), border: `1px solid ${cauT(0.55)}`, borderRadius: '3px', pointerEvents: 'none' }}>
                <span style={{ display: 'inline-flex', color: T.cautionary, flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                </span>
                <span style={{ ...TYPE.caption1, fontWeight: W.bold, color: '#ffd699' }}>모든 칸을 고정하여 자동 순환이 멈춰 있습니다.</span>
                <span style={{ ...TYPE.caption2, color: '#f0d6a6' }}>고정을 일부 해제하면 다시 순환합니다.</span>
              </div>
            )}
            <div style={{ height: '100%', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(3,1fr)', gap: SP[2], paddingTop: allPinned ? '30px' : 0, boxSizing: 'border-box' }}>
              {CAMS.map((c, i) => {
                if (c.empty) return (
                  <div key={i} style={{ background: '#0c0d10', border: '1px dashed #24262e', display: 'flex', alignItems: 'center', justifyContent: 'center', ...TYPE.caption2, color: '#6f6f77' }}>카메라 없음 (고정 불가)</div>
                );
                const pinned = focus.has(i);
                return (
                  <div key={i} onContextMenu={(e) => openMenu(e, i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                    style={{
                      position: 'relative', overflow: 'hidden', cursor: 'default', background: c.connecting ? '#0c0c10' : (SCENE[c.scene] || '#0f1115'),
                      border: pinned ? `2px solid ${pinT(0.92)}` : 'none',
                      boxShadow: pinned ? `inset 0 0 22px ${pinT(0.10)}` : 'none',
                    }}>
                    {/* 라이브 비네팅 — 실시간영상(기본)과 동일 */}
                    {!c.connecting && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.28) 100%)' }} />}
                    {/* 카메라 명 + PTZ (우상단) — 실시간영상(기본) 3×3 티어와 동일 크기 */}
                    <div style={{ position: 'absolute', top: ov.edge, right: `calc(${ov.edge} + 2px)`, zIndex: 3, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: ov.gap }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.55)', color: '#1FC8E6', fontSize: ov.ptz, fontWeight: W.medium, fontFamily: T.font, letterSpacing: '-0.24px', lineHeight: 1.5, padding: `${ov.padY} ${ov.ptzPad}`, borderRadius: '40px', whiteSpace: 'nowrap' }}>PTZ</span>
                      <span style={{ ...TYPE.label2, fontSize: ov.name, fontWeight: W.semibold, color: '#fff', background: 'rgba(10,10,12,0.72)', padding: `${ov.padY} ${ov.namePad}`, borderRadius: '40px', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{c.no}</span>
                    </div>
                    {/* 연결중 — Loading 정본(region 스피너 + 보조문구) */}
                    {c.connecting && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: SP[8] }}>
                        <span role="status" aria-label="카메라 연결중" style={{ width: '30px', height: '30px', borderRadius: '50%', boxSizing: 'border-box', border: `3px solid #2e2e2e`, borderTopColor: T.primaryStrong, animation: 'pds-spin 0.8s linear infinite' }} />
                        <span style={{ ...TYPE.caption1, color: '#888' }}>카메라 연결중</span>
                      </div>
                    )}
                    {/* 분석영역(ROI) — 이벤트 표시 ON일 때만. 원근 사다리꼴 + 상단 경계선(positive) */}
                    {c.ev && evOn.has(i) && !c.connecting && (
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
                        <polygon points="3,100 97,100 85,57 21,59" fill="rgba(30,212,90,0.12)" />
                        <line x1="21" y1="59" x2="85" y2="57" stroke={T.positive} strokeWidth="1.4" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
                      </svg>
                    )}
                    {/* 검지 박스(positive) — 이벤트 표시 ON일 때만 */}
                    {c.bbox && c.ev && evOn.has(i) && (
                      <div style={{ position: 'absolute', left: '32%', top: '34%', width: '24%', height: '40%', border: `1.5px solid ${T.positive}`, borderRadius: '2px', zIndex: 2 }}>
                        <span style={{ position: 'absolute', top: '-13px', left: '-1px', fontSize: '8px', background: 'rgba(30,212,90,0.92)', color: '#04210f', padding: '0 3px', borderRadius: '2px', fontWeight: W.bold, whiteSpace: 'nowrap' }}>{c.bbox}</span>
                      </div>
                    )}
                    {/* 좌상단 스택 — (이벤트 배지 + 고정 마커) 가로 배치 + 비고정 셀 호버 안내 */}
                    <div style={{ position: 'absolute', top: ov.edge, left: ov.edge, zIndex: 6, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: SP[4] }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: SP[4] }}>
                        <CamEventBadge ev={c.ev} sz={ov} />
                        {pinned && (
                          <span title="고정됨(순환 제외)" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: ov.evH, height: ov.evH, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', color: pinC, flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                            <PinGlyph size={12} />
                          </span>
                        )}
                      </div>
                      {/* 호버 시 우클릭 안내(비고정·비연결 셀) — 고정은 우클릭 메뉴에서 */}
                      {!pinned && !c.connecting && hover === i && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4], height: '18px', padding: `0 8px`, background: 'rgba(0,0,0,0.55)', color: '#d4d4d8', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '9px', fontSize: '9.5px', fontWeight: W.medium, whiteSpace: 'nowrap' }}>
                          우클릭 &rsaquo; 고정
                        </span>
                      )}
                    </div>
                    {/* 타임스탬프 (라이브, 하단 중앙) — 3×3 티어 크기 */}
                    {!c.connecting && (
                      <span style={{ position: 'absolute', bottom: ov.edge, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: T.font, fontSize: ov.stamp, fontWeight: W.medium, color: '#fff', fontVariantNumeric: 'tabular-nums', textShadow: '0 1px 3px rgba(0,0,0,0.85)', zIndex: 3 }}>2026.07.02 14:21:08</span>
                    )}
                  </div>
                );
              })}
            </div>
            {/* 우클릭 컨텍스트 메뉴(videoContext) — 맨 위 "고정" + 실제 항목 */}
            {menu && (
              <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', left: `${menu.x}px`, top: `${menu.y}px`, zIndex: 40, width: '216px', background: '#1E2229', border: '1px solid #2c3540', borderRadius: '8px', boxShadow: '0 18px 48px rgba(0,0,0,0.72)', padding: `${SP[4]} 0`, overflow: 'hidden' }}>
                <div onClick={() => { toggle(menu.i); setMenu(null); }} style={ctxItem({ color: '#ffd699', fontWeight: W.bold })}>
                  <span style={{ width: '14px', height: '14px', flexShrink: 0, display: 'inline-flex' }}><Icon name="keep" size={14} color={T.cautionary} /></span>
                  {focus.has(menu.i) ? '고정 해제' : '고정'}
                </div>
                {CAMS[menu.i] && CAMS[menu.i].ev && (
                  <div onClick={() => { toggleEv(menu.i); setMenu(null); }} style={ctxItem({ color: T.primaryStrong, fontWeight: W.semibold })}>
                    <span style={{ width: '14px', height: '14px', flexShrink: 0, display: 'inline-flex' }}><Icon name="warning" size={14} color={T.primaryStrong} /></span>
                    이벤트 <span style={{ marginLeft: 'auto', fontWeight: W.bold, color: evOn.has(menu.i) ? T.positive : '#8a8a92' }}>{evOn.has(menu.i) ? 'ON' : 'OFF'}</span>
                  </div>
                )}
                <div onClick={() => { setMenu(null); window.location.hash = '#library/library-dragnet'; }} style={ctxItem({ color: '#cfe0ff', fontWeight: W.semibold, borderBottom: '1px solid #2c3540' })}>
                  <span style={{ width: '14px', height: '14px', flexShrink: 0, display: 'inline-flex' }}><Icon name="location_searching" size={14} color={T.primaryStrong} /></span>
                  주변 카메라 보기
                </div>
                {CTX.map((m) => (
                  <div key={m.label} onClick={() => setMenu(null)} style={ctxItem({ ...(m.sepBefore ? { borderTop: '1px solid #2c3540' } : {}), ...(m.sepAfter ? { borderBottom: '1px solid #2c3540' } : {}) })}>
                    <span style={{ width: '14px', height: '14px', flexShrink: 0, display: 'inline-flex' }}><Icon name={m.icon} size={14} color="#8a8a92" /></span>
                    {m.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 하단 페이지 / 순환 바 */}
          <div style={{ display: 'flex', alignItems: 'center', height: '34px', flexShrink: 0, padding: `0 ${SP[12]}`, borderTop: '1px solid #2a2a30', background: '#16161a' }}>
            <div style={{ ...TYPE.caption1, color: '#bdbdc4' }}>
              고정 <b style={{ color: pinC, fontWeight: W.bold }}>{focus.size}</b>개
              <span style={{ color: '#6f6f77' }}> · 나머지 {Math.max(0, realIdx.length - focus.size)}칸 순환</span>
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: SP[8], ...TYPE.caption1, color: '#bdbdc4' }}>
              <span style={{ display: 'inline-flex', gap: SP[4] }}>
                {[0, 1, 2].map((d) => <span key={d} style={{ width: '7px', height: '7px', borderRadius: '50%', background: d === 0 ? T.primary : '#3a3a42' }} />)}
              </span>
              <span style={{ color: '#7f7f87' }}>1 / 3</span>
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: SP[8] }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: allPinned ? T.cautionary : T.positive }} />
              <span style={{ ...TYPE.caption1, fontWeight: W.medium, color: allPinned ? '#caa86a' : '#4ade80', whiteSpace: 'nowrap' }}>
                {allPinned ? '순환 멈춤(대기)' : '자동 순환 ON · 10초'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 이벤트 자동 팝업 카드 — 디자인 시스템 컴포넌트/토큰으로 재설계.
//  헤더(등급 dot + 이벤트명 + Content badge + 시각 + 닫기) · 미디어(neutral 영상 surface + 카메라칩 + BBox)
//  · 상태 푸터(준비=Loading 스피너 / 재생=Progress indicator + 발생 마커 / 폴백=Section message / 정리).
//  8:5(840×525 정본 비율). 시맨틱 색 전부 T.*, 아이콘은 Foundation <Icon>.
function EventPopupWindow({ state }) {
  const cleared = state === 'cleanup';
  const isVideo = state === 'video';
  const W_ = 480, H_ = 300;
  return (
    <div style={{ width: W_, background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 20px 55px rgba(0,0,0,0.55)', fontFamily: T.font }}>
      {/* 헤더 — 등급 dot + 이벤트명 + 등급 배지 + 시각 + 닫기 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #2e2e2e' }}>
        {/* 이벤트명 자체를 배지로(등급은 배지 색으로 전달 — 위험=error) */}
        <DsBadge tone="error" solid size="md" dot>불법 주정차</DsBadge>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', cursor: 'pointer' }}><Icon name="cancel" size={16} color="#8a8a92" /></span>
      </div>

      {/* 미디어 영역 — neutral 영상 surface(8:5) */}
      <div style={{ position: 'relative', width: W_, height: H_, background: '#0e0e10', overflow: 'hidden', filter: cleared ? 'brightness(.45) saturate(.6)' : 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 30%, #1c1f26 0%, #14161c 55%, #0d0f13 100%)' }} />
        {/* 영상 피드 placeholder(중앙 카메라 글리프) */}
        {!cleared && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isVideo ? 0.14 : 0.10 }}>
            <Icon name="nest_cam_outdoor" size={76} color="#ffffff" />
          </div>
        )}
        {/* 상단 정보 바 — 미디어 상단 전체 폭, 반투명 그라디언트 바(좌:상태 · 우:카메라명) */}
        {!cleared && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP[8], padding: `${SP[8]} ${SP[12]} ${SP[16]}`, background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.42) 55%, rgba(0,0,0,0) 100%)', pointerEvents: 'none' }}>
            {/* 좌: 상태(스냅샷/발생영상) */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4] }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isVideo ? T.primaryStrong : '#c4c4c8', flexShrink: 0, boxShadow: isVideo ? `0 0 6px ${T.primaryStrong}` : 'none' }} />
              <span style={{ ...TYPE.caption1, fontWeight: W.bold, color: isVideo ? T.primaryStrong : '#e8e8ec', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{isVideo ? '발생영상' : '스냅샷'}</span>
            </span>
            {/* 우: 카메라명 */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4] }}>
              <Icon name="nest_cam_outdoor" size={14} color="#fff" />
              <span style={{ ...TYPE.label2, fontWeight: W.semibold, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.6)', whiteSpace: 'nowrap' }}>재거리-북측-보행신호 07</span>
            </span>
          </div>
        )}
        {/* 타임스탬프(하단 중앙) — 실시간 영상 기본 양식 */}
        {!cleared && (
          <span style={{ position: 'absolute', bottom: SP[8], left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', ...TYPE.label2, fontWeight: W.medium, color: '#fff', fontVariantNumeric: 'tabular-nums', textShadow: '0 1px 3px rgba(0,0,0,0.85)' }}>2026.07.07 14:22:31</span>
        )}
        {/* BBox(DrawObjects) — 위험 등급색 */}
        {!cleared && (
          <div style={{ position: 'absolute', left: isVideo ? '44%' : '40%', top: '46%', width: '86px', height: '52px', border: `1.6px solid ${T.error}`, borderRadius: '2px', boxShadow: '0 0 0 1px rgba(0,0,0,.35)', transition: 'all .4s' }}>
            <span style={{ position: 'absolute', top: '-16px', left: '-1.6px', ...TYPE.caption2, fontWeight: W.bold, background: T.error, color: '#fff', padding: `0 ${SP[4]}`, borderRadius: '2px', whiteSpace: 'nowrap' }}>정차 감지</span>
          </div>
        )}
        {/* 정리 베일 */}
        {cleared && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: SP[8] }}>
            <Icon name="check_circle" size={22} color="#8a8a92" />
            <span style={{ ...TYPE.label2, fontWeight: W.semibold, color: '#c4c4c8' }}>발생영상 정리 완료</span>
          </div>
        )}
      </div>

      {/* 상태 푸터 — 상태별 디자인 시스템 피드백 */}
      <div style={{ padding: `${SP[8]} ${SP[12]}`, borderTop: '1px solid #2e2e2e', minHeight: '46px', display: 'flex', alignItems: 'center', boxSizing: 'border-box' }}>
        {state === 'appear' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], ...TYPE.caption1, color: '#c4c4c8' }}>
            <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,.16)', borderTopColor: T.cautionary, borderRadius: '50%', animation: 'epSpin .8s linear infinite' }} />
            발생영상 준비 중…
            <span style={{ color: '#6f6f77' }}>· 준비되면 같은 자리에서 자동 재생</span>
          </div>
        )}
        {isVideo && (
          <div style={{ width: '100%', paddingTop: SP[24] }}>
            {/* 플레이어 컨트롤 행 — 재생/일시정지 + 스크러버 + 시간 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[12] }}>
              {/* 재생/일시정지 토글(현재 재생 중 → 일시정지 표시) */}
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, ${T.primaryStrong} 0%, ${T.primaryHeavy} 100%)`, boxShadow: '0 2px 8px rgba(0,0,0,0.45)', cursor: 'pointer' }}>
                <span style={{ display: 'flex', gap: '3px' }}>
                  <span style={{ width: '3px', height: '11px', borderRadius: '1px', background: '#fff' }} />
                  <span style={{ width: '3px', height: '11px', borderRadius: '1px', background: '#fff' }} />
                </span>
              </span>
              {/* 프리미엄 스크러버 — 얇은 트랙 + Primary 그라디언트 채움 + 발생 다이아몬드 + 헤일로 플레이헤드 */}
              <div style={{ position: 'relative', flex: 1, height: '4px' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '2px', background: 'rgba(255,255,255,0.15)' }} />
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '62%', borderRadius: '2px', background: `linear-gradient(90deg, ${T.primary}, ${T.primaryStrong})` }} />
                {/* 발생 마커 — 화이트 중립 다이아몬드(다크 링 + 그림자로 분리, 순수 위치 표시 · 색 의미 없음) */}
                <div style={{ position: 'absolute', left: '37.5%', top: '50%', transform: 'translate(-50%, -50%) rotate(45deg)', width: '8px', height: '8px', borderRadius: '2px', background: '#fff', boxShadow: '0 0 0 2px #1a1a1a, 0 1px 4px rgba(0,0,0,0.55)' }} />
                {/* 발생 라벨 — 미니멀(중립) */}
                <div style={{ position: 'absolute', left: '37.5%', bottom: 'calc(100% + 9px)', transform: 'translateX(-50%)', ...TYPE.caption2, fontWeight: W.bold, color: '#e8e8ec', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>발생</div>
                {/* 재생 플레이헤드 — 화이트 knob + Primary 헤일로 */}
                <div style={{ position: 'absolute', left: '62%', top: '50%', transform: 'translate(-50%, -50%)', width: '13px', height: '13px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 0 4px rgba(0,102,255,0.30), 0 2px 6px rgba(0,0,0,0.55)' }} />
              </div>
              {/* 시간 */}
              <span style={{ flexShrink: 0, ...TYPE.caption1, color: '#c4c4c8', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>00:05 <span style={{ color: '#6f6f77' }}>/ 00:08</span></span>
            </div>
          </div>
        )}
        {state === 'fallback' && (
          <div style={{ display: 'flex', gap: SP[8], alignItems: 'flex-start', width: '100%' }}>
            <span style={{ flexShrink: 0, marginTop: '1px' }}><Icon name="warning" size={16} color={T.cautionary} /></span>
            <div style={{ minWidth: 0 }}>
              <div style={{ ...TYPE.caption1, fontWeight: W.semibold, color: T.cautionary }}>발생영상 없음 · 스냅샷 유지</div>
              <div style={{ ...TYPE.caption2, color: '#9a9aa2' }}>클립 미도착 — 상세·발생영상은 이벤트 목록에서 확인하세요.</div>
            </div>
          </div>
        )}
        {cleared && (
          <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], ...TYPE.caption2, color: '#8a8a92' }}>
            <Icon name="check_circle" size={14} color="#8a8a92" />디코더 정지 · 정리 (Stop + Dispose · Content = null)
          </div>
        )}
      </div>
    </div>
  );
}


function PrevaxEventPopupScreen() {
  const CUTS = [
    { n: 1, tone: T.primaryStrong, tc: '#04222a', title: '팝업 등장 (t0 · 검지 순간)', state: 'appear', chip: '스냅샷',
      cap: '실시간 영상(기본) 양식 준수 — 상단 정보 바(좌:"스냅샷" 상태 · 우:카메라명) · 하단 중앙 타임스탬프 · BBox. 헤더는 등급 배지·이벤트명, 푸터에 Loading 스피너로 "발생영상 준비 중"(과한 강조 없이).' },
    { n: 2, tone: T.positive, tc: '#04210f', title: '영상 전환 (클립 준비됨)', state: 'video', chip: '발생영상',
      cap: '같은 자리에서 스냅샷 → 발생영상 전환·1회 재생. 상단 정보 바 상태가 "발생영상"(primary)으로, 푸터는 Progress indicator(채움=Primary) + 발생시점 마커(위험색, occur_time 근사 37.5%) · 재생 시간.' },
    { n: 3, tone: T.cautionary, tc: '#3a2400', title: '폴백 (클립 미도착 / 없음)', state: 'fallback', chip: '폴백',
      cap: 'video_path NULL/미도착 → 스냅샷만 유지. 푸터에 Section message(cautionary)로 "발생영상 없음 · 스냅샷 유지 — 상세는 이벤트 목록에서". 별도 큰 배지 없음.' },
    { n: 4, tone: '#666', tc: '#fff', title: '정리 (Hide / 창 닫힘)', state: 'cleanup', chip: '정리',
      cap: '지속시간 만료 → 디코더 명시 정지·정리(Stop()+Dispose(), Content=null). 미디어 딤 + 완료 표시, 화면은 팝업이 닫힐 뿐(누수 방지 패턴).' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP[32] }}>
      <style>{'@keyframes epSpin{to{transform:rotate(360deg)}}'}</style>
      <div style={{ ...TYPE.body2, color: '#9a9aa2', lineHeight: 1.6, maxWidth: 720 }}>
        라이브 검지 순간 뜨는 <b style={{ color: '#e8e8ec' }}>이벤트 자동 팝업(ShowEventPopup)</b>이 발생영상(비디오 클립)을 <b style={{ color: '#e8e8ec' }}>베스트에포트</b>로 자동 추출합니다.
        스냅샷 즉시 표시 → 팝업 지속시간 내 클립이 준비되면 <b style={{ color: '#e8e8ec' }}>같은 자리에서 영상으로 전환·1회 재생</b> → 못 오면 스냅샷만 유지(폴백). 조작 컨트롤은 미노출(<code style={{ color: '#9dbbff' }}>SetPlaybackOnly</code>).
      </div>
      {CUTS.map((c) => (
        <div key={c.n}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: SP[8], marginBottom: SP[8], flexWrap: 'wrap' }}>
            <span style={{ ...TYPE.caption1, fontWeight: W.extrabold, color: c.tc, background: c.tone, borderRadius: '5px', padding: `${SP[2]} ${SP[8]}` }}>컷 {c.n}</span>
            <span style={{ ...TYPE.label1, fontWeight: W.bold, color: '#fff' }}>{c.title}</span>
          </div>
          <EventPopupWindow state={c.state} />
          <div style={{ maxWidth: 480, marginTop: SP[8], ...TYPE.caption1, color: '#9a9aa2', lineHeight: 1.6 }}>
            <span style={{ ...TYPE.caption2, fontWeight: W.bold, color: '#c4c4cc', border: '1px solid #3a3a42', borderRadius: '4px', padding: `1px ${SP[4]}`, marginRight: SP[4] }}>{c.chip}</span>
            {c.cap}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * PREVAX 4 선별관제 — 미배치 채널 실시간 확인(F-2).
 * 그룹에 배치되지 않은 카메라를 실시간 영상 + 연결상태로 모아 보는 별도 점검 창(전용 뷰).
 * 핵심 점검 대상 = 신규·방치 카메라(스트림 미설정·연결 오류) → 숨기지 않고 더 눈에 띄게.
 * 시안(unassigned-channels-hifi) 참고, 색·타이포·간격은 전부 T/TYPE/W/SP 토큰(폐기 Primary 미사용).
 */
// 연결상태 4종 — 색은 상태 토큰(정상=positive / 오류=error / 응답없음=cautionary / 스트림없음=neutral)
const UC_STATUS = {
  ok:       { label: '정상',     token: T.positive,   tint: 'rgba(30,212,90,0.14)',   bd: 'rgba(30,212,90,0.42)',   tx: '#66e08f', icon: 'check_circle',     leg: '연결·영상 정상' },
  err:      { label: '오류',     token: T.error,      tint: 'rgba(255,99,99,0.16)',   bd: 'rgba(255,99,99,0.5)',    tx: '#ff8f8f', icon: 'error',            leg: '연결 오류(error_status)', nt: '연결 오류 · 영상 없음', ns: '카메라 응답이 없습니다', face: 'linear-gradient(180deg,#231416 0%,#120c0d 100%)' },
  wait:     { label: '응답없음',  token: T.cautionary, tint: 'rgba(255,169,56,0.16)',  bd: 'rgba(255,169,56,0.48)',  tx: '#ffc272', icon: 'cycle',            leg: '20초 이상 신호 없음(stale)', nt: '응답 지연', ns: '20초 이상 신호 없음', face: 'linear-gradient(180deg,#231e12 0%,#12100a 100%)' },
  nostream: { label: '스트림없음', token: '#8a8a92',   tint: 'rgba(138,138,146,0.16)', bd: 'rgba(138,138,146,0.5)',  tx: '#b3b3bb', icon: 'nest_cam_outdoor', leg: '스트림 미설정(신규)', nt: '스트림 없음', ns: '스트림 미설정 (신규 등록)', face: 'linear-gradient(180deg,#1a1a1f 0%,#101013 100%)' },
};
const UC_SCENES = [
  'linear-gradient(160deg,#1c2230 0%,#12161f 45%,#0c0f16 100%)',
  'linear-gradient(200deg,#20201c 0%,#16150f 50%,#0d0d0a 100%)',
  'linear-gradient(150deg,#141d1c 0%,#0f1614 50%,#0a0d0c 100%)',
];
const UC_CELLS = [
  { name: '정문 카메라',   no: 'CH-101', st: 'ok' },
  { name: '주차장 입구',   no: 'CH-102', st: 'ok', evt: 2 },
  { name: '후문 카메라',   no: 'CH-103', st: 'err', sel: true, evt: 1 },
  { name: '창고 카메라',   no: 'CH-104', st: 'wait' },
  { name: '신규 카메라 A', no: 'CH-201', st: 'nostream' },
  { name: '로비 카메라',   no: 'CH-105', st: 'ok' },
  { name: '복도 카메라',   no: 'CH-106', st: 'ok' },
  { name: '신규 카메라 B', no: 'CH-202', st: 'nostream' },
];

// 연결상태 칩 = 정본 Content badge(색 + 아이콘 + 글자, 색맹 접근성 — 색만으로 가르지 않음)
const UC_TONE = { ok: 'neutral', err: 'error', wait: 'cautionary', nostream: 'neutral' };
function UcStat({ st }) {
  const s = UC_STATUS[st];
  // 정상은 조용히(중립 배지 + 초록 체크 아이콘만) — 문제 상태(오류·응답없음)가 부각되도록
  return <DsBadge tone={UC_TONE[st]} size="xs" icon={s.icon} iconColor={st === 'ok' ? '#66e08f' : undefined}>{s.label}</DsBadge>;
}

// 미배치 전용 뷰 창 — titlebar + view-head + summary + 4열 그리드 + 하단 페이지 바 (empty=빈 상태)
function UnassignedChannelsWindow({ empty }) {
  const btnSm = { display: 'inline-flex', alignItems: 'center', gap: SP[4], height: '26px', padding: `0 ${SP[8]}`, borderRadius: '6px', ...TYPE.caption1, fontWeight: W.semibold, border: '1px solid #2e2e35', background: '#202024', color: '#d4d4d8', whiteSpace: 'nowrap', cursor: 'default' };
  let okIdx = 0;
  return (
    <div style={{ width: '100%', maxWidth: 1920, aspectRatio: '16 / 9', background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 22px 60px rgba(0,0,0,0.5)', fontFamily: T.font, display: 'flex', flexDirection: 'column' }}>
      {/* 창 타이틀바(별도 Window 크롬) */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '34px', padding: `0 ${SP[12]}`, background: '#101015', borderBottom: '1px solid #232329' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], ...TYPE.caption1, fontWeight: W.bold, color: '#d4d4d8', letterSpacing: '0.02em' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: T.primary }} />PREVAX 4
        </span>
        <span style={{ display: 'inline-flex', gap: SP[8] }}>
          {[0, 1, 2].map((i) => <span key={i} style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#2a2a30' }} />)}
        </span>
      </div>
      {/* 뷰 헤더(명칭 + 새로고침·닫기) */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: SP[12], height: '48px', padding: `0 ${SP[16]}`, background: '#16161a', borderBottom: '1px solid #2a2a30' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8] }}>
          <Icon name="nest_cam_outdoor" size={18} color={T.primaryStrong} />
          <span style={{ ...TYPE.body2, fontWeight: W.bold, color: '#fff' }}>미배치 채널 실시간 확인</span>
        </span>
        <span style={{ flex: 1 }} />
        <span style={btnSm}><Icon name="cycle" size={14} color="#c4c4cc" />새로고침</span>
        <span style={btnSm}><Icon name="cancel" size={14} color="#c4c4cc" />닫기</span>
      </div>

      {empty ? (
        /* 빈 상태 — 미배치 0건(정상 이완) */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: SP[12], padding: `${SP[48]} ${SP[16]}`, textAlign: 'center' }}>
          <Icon name="check_circle" size={48} color={T.positive} />
          <span style={{ ...TYPE.body2, fontWeight: W.bold, color: '#e8e8ec' }}>현재 미배치 카메라가 없습니다.</span>
          <span style={{ ...TYPE.caption1, color: '#8a8a92', maxWidth: 420, lineHeight: 1.6 }}>새로 등록된 카메라가 없거나, 모든 카메라가 그룹에 배치되었습니다. 정상 운영 상태입니다.</span>
        </div>
      ) : (
        <>
          {/* 요약(인지 보장) */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: SP[8], flexWrap: 'wrap', padding: `${SP[8]} ${SP[16]}`, background: '#141417', borderBottom: '1px solid #232329', ...TYPE.caption1, color: '#c4c4cc' }}>
            <span style={{ color: '#9a9aa2' }}>그룹에 배치되지 않은 카메라</span>
            <DsBadge tone="neutral" size="sm"><span style={{ fontVariantNumeric: 'tabular-nums' }}>12대</span></DsBadge>
            <DsBadge tone="accent" size="sm" icon="warning"><span style={{ fontVariantNumeric: 'tabular-nums' }}>미처리 이벤트 3건</span></DsBadge>
            <span style={{ marginLeft: 'auto', ...TYPE.caption2, color: '#6f6f77' }}>미처리 = 아직 조치 기록이 없는 이벤트 · 값은 예시</span>
          </div>

          {/* 4열 카메라 그리드 */}
          <div style={{ flex: 1, minHeight: 0, background: '#000', padding: SP[2], display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: SP[2] }}>
            {UC_CELLS.map((c, i) => {
              const s = UC_STATUS[c.st];
              const attn = c.st !== 'ok';
              const scene = c.st === 'ok' ? UC_SCENES[(okIdx++) % UC_SCENES.length] : s.face;
              // 테두리: 선택 > 상태 (한 번에 한 색만 → 파랑·빨강 섞임 방지). 선택 시 상태는 하단 칩으로 전달.
              const cellBorder = c.sel ? T.primaryStrong : (attn ? s.bd : 'transparent');
              const cellShadow = c.sel
                ? `0 0 0 2px ${T.primaryStrong}, 0 0 16px rgba(0,102,255,0.35)`
                : (attn ? `0 0 0 1px ${s.tint}, 0 0 18px ${s.tint}` : 'none');
              return (
                <div key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 0, background: '#0a0a0c', borderRadius: '4px', overflow: 'hidden', border: `1px solid ${cellBorder}`, boxShadow: cellShadow }}>
                  {/* 선택(배치 대상) — "선택" 칩(상단 바 제거: 선택 시 테두리가 파랑이라 색 섞임 없음) */}
                  {c.sel && (
                    <span style={{ position: 'absolute', top: SP[8], left: SP[8], zIndex: 4, display: 'inline-flex', alignItems: 'center', gap: SP[4], height: '22px', padding: `0 ${SP[8]}`, borderRadius: '7px', background: `linear-gradient(135deg, ${T.primaryStrong} 0%, ${T.primaryHeavy} 100%)`, color: '#fff', ...TYPE.caption1, fontSize: '12px', lineHeight: 1, fontWeight: W.bold, boxShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
                      <Icon name="check" size={13} color="#fff" />선택
                    </span>
                  )}
                  {/* 영상 영역(4:3) */}
                  <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden', background: scene }}>
                    {c.st === 'ok' ? (
                      <>
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 120% at 50% 38%, transparent 52%, rgba(0,0,0,0.34) 100%)' }} />
                        <span style={{ position: 'absolute', bottom: SP[4], left: '50%', transform: 'translateX(-50%)', ...TYPE.caption2, fontWeight: W.medium, color: '#fff', fontVariantNumeric: 'tabular-nums', textShadow: '0 1px 3px rgba(0,0,0,0.85)', whiteSpace: 'nowrap' }}>2026.07.01 14:22:07</span>
                      </>
                    ) : (
                      /* 오류/응답없음/스트림없음 = 실제 상태 화면(빈 박스 채움 금지) */
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: SP[4], textAlign: 'center', padding: SP[8] }}>
                        <Icon name={s.icon} size={28} color={s.token} />
                        <span style={{ ...TYPE.caption1, fontWeight: W.semibold, color: s.token }}>{s.nt}</span>
                        <span style={{ ...TYPE.caption2, color: '#8a8a92' }}>{s.ns}</span>
                      </div>
                    )}
                  </div>
                  {/* 셀 하단 정보 바 — 카메라명·번호 + 연결상태 칩 */}
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[8]}`, background: '#16161a', borderTop: '1px solid #232329' }}>
                    <span style={{ minWidth: 0, flex: 1 }}>
                      <span style={{ display: 'block', ...TYPE.caption1, fontWeight: W.semibold, color: '#d4d4d8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                      <span style={{ display: 'block', ...TYPE.caption2, color: '#8a8a92', fontVariantNumeric: 'tabular-nums' }}>{c.no}</span>
                    </span>
                    <UcStat st={c.st} />
                  </div>
                  {/* 셀 액션 — 이벤트 배지(있으면) + 배치하기 */}
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: SP[8], padding: `0 ${SP[8]} ${SP[8]}`, background: '#16161a' }}>
                    {c.evt && <DsBadge tone="accent" size="sm" icon="warning">이벤트 {c.evt}</DsBadge>}
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 1, height: '24px', borderRadius: '6px', ...TYPE.caption1, fontWeight: W.semibold, border: `1px solid ${T.primaryHeavy}`, background: `linear-gradient(135deg, ${T.primaryStrong} 0%, ${T.primaryHeavy} 100%)`, color: '#fff', whiteSpace: 'nowrap', cursor: 'default' }}>배치하기</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 하단 페이지 바 */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: SP[12], height: '38px', padding: `0 ${SP[16]}`, borderTop: '1px solid #2a2a30', background: '#16161a' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], ...TYPE.caption1, color: '#bdbdc4' }}>
              <span style={{ display: 'inline-flex', width: '22px', height: '22px', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', border: '1px solid #2e2e35', background: '#202024', color: '#8a8a92' }}>‹</span>
              <span style={{ ...TYPE.caption1, fontWeight: W.semibold, color: '#fff', background: '#2a2a30', border: '1px solid #3a3a42', borderRadius: '4px', padding: `${SP[2]} ${SP[8]}`, fontVariantNumeric: 'tabular-nums' }}>1 / 2</span>
              <span style={{ display: 'inline-flex', width: '22px', height: '22px', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', border: '1px solid #2e2e35', background: '#202024', color: '#8a8a92' }}>›</span>
            </span>
            <span style={{ ...TYPE.caption2, color: '#6f6f77' }}>한 화면 8채널 · 미배치 12대 → 2페이지</span>
          </div>
        </>
      )}
    </div>
  );
}

function PrevaxUnassignedScreen() {
  return <UnassignedChannelsWindow />;
}

/**
 * 이벤트 자동 팝업(D-3) — 실제 화면 표시.
 * 실시간 영상 기본 화면 위에 이벤트 자동 팝업(ShowEventPopup)이 뜬 한 장면.
 * 비모달 자동 알림이라 딤·모달·확인 버튼 없음 — 팝업만 그림자로 떠 있음. 상태는 발생영상 재생(video).
 */
function PrevaxEventPopupLiveScreen() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 1920, aspectRatio: '16 / 9' }}>
      {/* 팝업이 뜬 실제 화면 = 실시간 영상 기본 */}
      <div style={{ position: 'absolute', inset: 0 }}><PrevaxLiveScreen /></div>
      {/* 이벤트 자동 팝업 — 검지 순간 자동 등장(비모달·딤 없음).
          카메라 그리드 영역 기준 중앙(좌 패널 278 · 상단 크롬 109=타이틀40+탭32+툴바37 · 하단 바 38 제외) */}
      <div style={{ position: 'absolute', left: '278px', top: '109px', right: 0, bottom: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, pointerEvents: 'none' }}>
        <EventPopupWindow state="video" />
      </div>
    </div>
  );
}

/**
 * 투망관제(F-9) — "주변 카메라 보기" 조사 격자창.
 * 이벤트/카메라를 기준으로 같은 그룹 카메라를 격자로 함께 띄우는 별도(비저장) 조사 창.
 * F-7 그룹 격자 엔진(LiveMonitorWindow) 재사용 + 기준 카메라 청색 강조. 검지 불가역·읽기전용.
 * 원본 HI-FI의 폐기 Primary 계열은 정본 토큰(T.primary/Strong/Heavy)으로 매핑함.
 * 기준 강조(청색)는 FocusPin(고정, T.cautionary amber)과 의미상 분리.
 */
function DragnetInvestigationWindow({ onClose } = {}) {
  const [split, setSplit] = useState(9);
  const SCN = {
    cross: 'linear-gradient(180deg,#1e2733,#12161d)', gate: 'linear-gradient(180deg,#23202a,#16141c)',
    road: 'linear-gradient(180deg,#1c2230,#10131a)', plaza: 'linear-gradient(180deg,#202530,#13161d)',
    market: 'linear-gradient(180deg,#26202a,#15121a)', alley: 'linear-gradient(180deg,#1b1d24,#101218)',
    river: 'linear-gradient(180deg,#16232a,#0e1418)', park: 'linear-gradient(180deg,#1a2420,#121814)',
    lobby: 'linear-gradient(180deg,#20222a,#15171d)',
  };
  // 우범지역 그룹(9대). 기준 [17]은 재배치로 1페이지 첫 칸. bbox=검지 맥락(T.positive), 투망은 검지 불가역.
  const cells = [
    { no: '[17]', name: '강남대로 사거리', ch: 'CH 17', scene: 'cross', ref: true, bbox: { l: '40%', t: '28%', w: '16%', h: '48%', label: '사람' } },
    { no: '[03]', name: '강남역 2번출구', ch: 'CH 03', scene: 'gate', bbox: { l: '40%', t: '28%', w: '16%', h: '48%', label: '사람' } },
    { no: '[05]', name: '라피 교차로', ch: 'CH 05', scene: 'road', bbox: { l: '30%', t: '52%', w: '22%', h: '26%', label: '승용차' } },
    { no: '[08]', name: '강남 지하상가', ch: 'CH 08', scene: 'plaza' },
    { no: '[11]', name: '수내시장 입구', ch: 'CH 11', scene: 'market', bbox: { l: '44%', t: '40%', w: '18%', h: '38%', label: '사람' } },
    { no: '[14]', name: '역삼동 골목', ch: 'CH 14', scene: 'alley' },
    { no: '[19]', name: '안양천 산책로', ch: 'CH 19', scene: 'river' },
    { no: '[21]', name: '테헤란로 공원', ch: 'CH 21', scene: 'park' },
    { no: '[22]', name: '신관 로비', ch: 'CH 22', scene: 'lobby' },
  ];
  const spTile = { minWidth: '26px', height: '22px', padding: `0 ${SP[4]}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...TYPE.caption1, fontWeight: W.bold, borderRadius: '3px', cursor: 'pointer', fontVariantNumeric: 'tabular-nums' };
  const pBtn = { display: 'inline-flex', width: '22px', height: '22px', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', border: '1px solid #2e2e35', background: '#202024', color: '#8a8a92', cursor: 'pointer' };
  return (
    <div style={{ width: '100%', maxWidth: 1920 }}>
      <div style={{ width: '100%', aspectRatio: '16 / 9', background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 22px 60px rgba(0,0,0,0.5)', fontFamily: T.font, display: 'flex', flexDirection: 'column' }}>
        {/* 창 타이틀바 — 제목표시줄 드래그로 이동 */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '34px', padding: `0 ${SP[8]} 0 ${SP[12]}`, background: '#101015', borderBottom: '1px solid #232329', cursor: 'move' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[8], ...TYPE.caption1 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: T.primary }} />
            <span style={{ fontWeight: W.bold, color: '#d4d4d8', letterSpacing: '0.02em' }}>PREVAX 4</span>
            <span style={{ color: '#6f6f77' }}>|</span>
            <span style={{ fontWeight: W.bold, color: '#fff' }}>우범지역</span>
            <span style={{ ...TYPE.caption2, fontWeight: W.medium, color: '#8a8a92' }}>주변 카메라 보기 (조사)</span>
          </span>
          <span style={{ display: 'inline-flex' }}>
            {[{ g: '–', title: '최소화' }, { g: '✕', title: onClose ? '닫기' : '닫기 · 기본 화면으로', close: true }].map(({ g, title, close }) => (
              <span key={g} title={title} onClick={close ? () => { if (onClose) onClose(); else window.location.hash = '#library/library-live'; } : undefined} style={{ width: '34px', height: '34px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#b3b3b3', cursor: 'pointer' }}>{g}</span>
            ))}
          </span>
        </div>

        {/* 그룹 격자(3×3) full width */}
        <div style={{ flex: 1, minHeight: 0, background: '#000', padding: SP[2], display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: SP[2] }}>
          {cells.map((c, i) => (
            <div key={i} style={{ position: 'relative', overflow: 'hidden', borderRadius: '3px', background: SCN[c.scene],
              border: c.ref ? `2px solid ${T.primaryStrong}` : '1px solid #23262e',
              boxShadow: c.ref ? `0 0 0 2px rgba(51,133,255,0.22), inset 0 0 22px rgba(51,133,255,0.08)` : 'none' }}>
              {/* 카메라명·번호 — 우상단(정본: 식별정보=우상단) */}
              <span style={{ position: 'absolute', top: SP[8], right: SP[8], zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px', textAlign: 'right' }}>
                <span style={{ ...TYPE.caption2, fontWeight: W.bold, color: '#cfd6e2', textShadow: '0 1px 2px rgba(0,0,0,0.85)' }}>{c.no} {c.name}</span>
                <span style={{ fontSize: '8.5px', fontWeight: W.semibold, color: '#9aa3b2', textShadow: '0 1px 2px rgba(0,0,0,0.85)' }}>{c.ch}</span>
              </span>
              {/* 기준 카메라 배지(청색) — 좌상단(정본: 상태/마커=좌상단, F-2 "선택"과 통일) */}
              {c.ref && (
                <span style={{ position: 'absolute', top: SP[8], left: SP[8], zIndex: 6, display: 'inline-flex', alignItems: 'center', gap: SP[4], height: '22px', padding: `0 ${SP[8]}`, background: T.primary, color: '#fff', borderRadius: '7px', fontSize: '12px', lineHeight: 1, fontWeight: W.bold, letterSpacing: '0.02em', boxShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                  <Icon name="location_searching" size={13} color="#fff" />기준
                </span>
              )}
              {/* 검지 박스(맥락) */}
              {c.bbox && (
                <div style={{ position: 'absolute', left: c.bbox.l, top: c.bbox.t, width: c.bbox.w, height: c.bbox.h, border: `1.5px solid ${T.positive}`, borderRadius: '2px', zIndex: 3 }}>
                  <span style={{ position: 'absolute', top: '-12px', left: '-1px', ...TYPE.caption2, fontSize: '7.5px', fontWeight: W.bold, background: 'rgba(30,212,90,0.92)', color: '#04210f', padding: '0 3px', borderRadius: '2px', whiteSpace: 'nowrap' }}>{c.bbox.label}</span>
                </div>
              )}
              <span style={{ position: 'absolute', bottom: SP[8], right: SP[8], zIndex: 4, ...TYPE.caption2, fontSize: '8px', color: '#aeb6c2', fontVariantNumeric: 'tabular-nums', textShadow: '0 1px 2px rgba(0,0,0,0.85)' }}>14:23:41</span>
            </div>
          ))}
        </div>

        {/* 하단 분할/페이지 바 — 좌측 상태 라벨 없음(기준은 격자 배지로) */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', height: '30px', padding: `0 ${SP[12]}`, borderTop: '1px solid #232329', background: '#1b1e23' }}>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: SP[4] }}>
            <span style={pBtn}>‹</span>
            <span style={{ minWidth: '22px', height: '22px', padding: `0 ${SP[4]}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #77a3b1', borderRadius: '2px', ...TYPE.caption1, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>1</span>
            <span style={{ ...TYPE.caption1, color: '#8a8a92' }}>/</span>
            <span style={{ ...TYPE.caption1, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>1</span>
            <span style={pBtn}>›</span>
          </span>
          <span style={{ marginLeft: SP[16], display: 'inline-flex', alignItems: 'center', gap: SP[2] }}>
            {[1, 4, 9, 16, 25, 36, 49, 64].map((n) => (
              <span key={n} onClick={() => setSplit(n)} style={{ ...spTile, background: split === n ? T.primary : 'transparent', color: split === n ? '#fff' : '#e8e8ec' }}>{n}</span>
            ))}
          </span>
        </div>
      </div>
      {/* 이동·리사이즈 안내(부유 창) — 단독 문서 페이지에서만 노출(팝업 컨텍스트에선 숨김) */}
      {!onClose && (
        <div style={{ display: 'flex', alignItems: 'center', gap: SP[16], flexWrap: 'wrap', margin: `${SP[8]} ${SP[2]} 0`, ...TYPE.caption2, color: '#8a8a92' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4] }}><Icon name="menu" size={12} color="#9a9aa2" />제목표시줄을 끌어 <b style={{ color: '#9dbbff', fontWeight: W.semibold }}>이동</b></span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4] }}><Icon name="folder_open" size={12} color="#9a9aa2" />창 <b style={{ color: '#9dbbff', fontWeight: W.semibold }}>가장자리를 끌어</b> 크기 조절</span>
          <span>· 메인 화면을 가리지 않게 배치 · 비저장(닫으면 사라짐)</span>
        </div>
      )}
    </div>
  );
}

// MCP 서버도 LIBRARY_TEMPLATES를 읽어 동일 페이지를 "문서"로 노출합니다.
const RENDERERS = {
  'library-dashboard': { render: () => <PrevaxDashboardScreen /> },
  'library-signup': { render: () => <SignupScreen /> },
  'library-login': { render: () => <LoginScreen /> },
  'library-selective': { render: () => <PrevaxSelectiveScreen /> },
  'library-selective-active': { render: () => <PrevaxSelectiveActiveScreen /> },
  'library-selective-eventdetail': { render: () => <PrevaxSelectiveEventDetailScreen /> },
  'library-selective-away': { render: () => <PrevaxAwayReceiverScreen /> },
  'library-unassigned': { render: () => <PrevaxUnassignedScreen /> },
  'library-dragnet': { render: () => <DragnetInvestigationWindow /> },
  'library-live': { render: () => <PrevaxLiveScreen /> },
  'library-live-focus': { render: () => <PrevaxLiveFocusScreen /> },
  'library-event-popup': { render: () => <PrevaxEventPopupScreen />, doc: true },
  'library-event-popup-live': { render: () => <PrevaxEventPopupLiveScreen /> },
  'library-gis-monitor': { render: () => <PrevaxGisScreen /> },
  'library-settings': { render: () => <PrevaxSettingsScreen /> },
  'library-events': { render: () => <PrevaxSettingsScreen initialNav="이벤트 관리" /> },
  'library-alarm-settings': { render: () => <PrevaxAlarmSettingsScreen /> },
  'library-history': { render: () => <PrevaxHistoryScreen /> },
  'library-stats': { render: () => <PrevaxStatsScreen /> },
  'library-ux-agent': { render: () => <UxAgentReportScreen />, doc: true },
  'library-event-search': { render: () => <PrevaxEventSearchScreen /> },
  'library-camera-form': { render: () => <PrevaxCameraFormScreen />, doc: true },
  'library-camera-form2': { render: () => <PrevaxCameraFormScreen2 />, doc: true },
  'library-event-def-add': { render: () => <PrevaxEventDefAddScreen />, doc: true },
  'library-camera-group': { render: () => <PrevaxCameraGroupScreen /> },
  'library-event-activation': { render: () => <PrevaxEventActivationScreen /> },
  'library-permission': {
    // 권한 설정 + 권한 설정 2(DevExpress 적용 경계 표기 변형)를 한 페이지에 세로로 쌓아 스크롤로 이어 본다.
    doc: true, // 세로로 긴 2화면 → 상단 정렬·세로 스크롤(상단 잘림 방지)
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP[32] }}>
        <PrevaxPermissionScreen />
        <div style={{ display: 'flex', alignItems: 'center', gap: SP[12] }}>
          <span style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff', whiteSpace: 'nowrap' }}>권한 설정 2 — DevExpress 적용 경계 표기</span>
          <span style={{ flex: 1, height: '1px', background: '#2a2a30' }} />
        </div>
        <PrevaxPermissionScreen2 />
      </div>
    ),
    toolbar: () => <XamlDownloadButton />,
  },
};

// 메타데이터(공유 데이터) + 렌더러(로컬) 병합
const EXAMPLES = Object.fromEntries(
  Object.entries(LIBRARY_TEMPLATES).map(([id, meta]) => [id, { ...meta, ...(RENDERERS[id] || {}) }]),
);

export default function Library({ componentId }) {
  const example = EXAMPLES[componentId] || EXAMPLES['library-login'];
  const isDoc = !!example.doc; // 문서형 화면(세로로 긴 보고서): 상단 정렬·확대 버튼 숨김
  const [expanded, setExpanded] = useState(false);
  const [scale, setScale] = useState(1);
  const stageRef = useRef(null);

  // 확대 보기: 1920 폭 스테이지를 뷰포트에 맞게 비율 유지 스케일 + ESC 닫기
  //  높이는 콘텐츠 실측(offsetHeight) — 창 아래 캡션 등으로 1080을 넘겨도 위/아래가 잘리지 않게.
  useEffect(() => {
    if (!expanded) return undefined;
    const fit = () => {
      const h = stageRef.current ? stageRef.current.offsetHeight : 1080;
      setScale(Math.min((window.innerWidth - 48) / 1920, (window.innerHeight - 64) / h, 1));
    };
    fit();
    const t = setTimeout(fit, 60); // 폰트·레이아웃 확정 후 재측정
    const onKey = (e) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('resize', fit);
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); window.removeEventListener('resize', fit); window.removeEventListener('keydown', onKey); };
  }, [expanded]);

  return (
    <div
      className="ds-main"
      style={{ padding: `${SP[40]} ${SP[48]}`, color: '#fff', fontFamily: T.font, overflowY: 'auto' }}
    >
      {/* 페이지 헤더 */}
      <h1 style={{ margin: 0, ...TYPE.title1, fontWeight: W.extrabold }}>
        {example.title}
      </h1>
      <p style={{ margin: `${SP[8]} 0 ${SP[16]}`, maxWidth: '680px', ...TYPE.body2Reading, color: '#9a9a9f' }}>
        {example.description}
      </p>

      {/* 구성 컴포넌트 칩 (Content badge / neutral 스타일) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP[8], marginBottom: SP[24] }}>
        {example.uses.map((u) => (
          <span
            key={u}
            style={{
              ...TYPE.caption1, color: '#c9c9cf',
              background: '#262626', border: '1px solid #333',
              padding: `${SP[4]} ${SP[8]}`, borderRadius: '6px',
            }}
          >
            {u}
          </span>
        ))}
      </div>

      {/* 예시별 툴바 (선택적) */}
      {example.toolbar && (
        <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], marginBottom: SP[16] }}>
          {example.toolbar()}
        </div>
      )}

      {/* 예시 화면 프리뷰 캔버스 */}
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: isDoc ? 'flex-start' : 'center', justifyContent: isDoc ? 'flex-start' : 'center',
        width: '100%', aspectRatio: '1920 / 1080', boxSizing: 'border-box', padding: SP[32],
        borderRadius: '16px',
        border: '1px solid #242424',
        background:
          'radial-gradient(1200px 400px at 50% -10%, rgba(0, 102, 255,0.18), transparent 60%), linear-gradient(160deg, #0c0c0f 0%, #121218 55%, #0c0c0f 100%)',
        overflow: 'auto',
      }}>
        {/* 확대 버튼 (우측 상단) — 문서형 화면에서는 숨김 */}
        {!isDoc && (
        <button
          onClick={() => setExpanded(true)}
          title="실제 1920×1080 크기로 보기"
          style={{
            position: 'absolute', top: '12px', right: '12px', zIndex: 5,
            display: 'flex', alignItems: 'center', gap: SP[4],
            ...TYPE.label2, fontWeight: W.semibold, color: '#e8e8ec', fontFamily: T.font,
            background: 'rgba(20,20,23,0.85)', border: '1px solid #33333a', borderRadius: '6px',
            padding: `${SP[4]} ${SP[12]}`, cursor: 'pointer',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
          </svg>
          확대 (1920×1080)
        </button>
        )}
        <div key={componentId} style={{ display: 'contents' }}>{example.render()}</div>
        <span style={{ position: 'absolute', right: '12px', bottom: '10px', ...TYPE.caption2, color: '#5a5a62', letterSpacing: '0.04em', pointerEvents: 'none' }}>1920 × 1080</span>
      </div>

      {/* 전체화면 확대 오버레이 — 1920×1080 실제 크기(뷰포트 맞춤 스케일) */}
      {expanded && (
        <div
          onClick={() => setExpanded(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div style={{ position: 'absolute', top: '18px', left: '22px', ...TYPE.label2, color: '#9a9a9f' }}>
            {example.title} · 1920 × 1080 ({Math.round(scale * 100)}%)
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
            style={{
              position: 'absolute', top: '14px', right: '18px', zIndex: 2,
              display: 'flex', alignItems: 'center', gap: SP[4], ...TYPE.label2, fontWeight: W.semibold, fontFamily: T.font,
              color: '#fff', background: '#2a2a30', border: '1px solid #3a3a42', borderRadius: '6px', padding: `${SP[8]} ${SP[12]}`, cursor: 'pointer',
            }}
          >
            닫기 ✕
          </button>
          {/* 1920 폭 스테이지 — 높이는 콘텐츠 실측(창+캡션 전체가 잘리지 않도록) */}
          <div
            ref={stageRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '1920px', flexShrink: 0,
              transform: `scale(${scale})`, transformOrigin: 'center center',
              background: '#0c0c0f', borderRadius: '4px', overflow: 'hidden',
              boxShadow: '0 0 0 1px #2a2a30',
            }}
          >
            <div key={componentId}>{example.render()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
