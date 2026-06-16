import { useState, useEffect, useRef } from 'react';
import { Icon } from './icons';
import PrevaxPermissionScreen, { generateXaml, PERM_ROWS } from './PermissionSettings';
import { LIBRARY_TEMPLATES } from '../data/templates';

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

// 디자인 토큰 (Foundation > Color / Typography)
const T = {
  primary: '#1751D9',        // --pintel-color-primary
  primaryStrong: '#3471FF',  // hover
  primaryHeavy: '#004DFF',   // pressed
  positive: '#1ED45A',       // --pintel-color-positive
  cautionary: '#FFA938',     // --pintel-color-cautionary
  error: '#FF6363',          // --pintel-color-native
  font: "'Pretendard GOV', sans-serif",
};

// 글자 굵기 위계 (Pretendard GOV) — 역할별로 단계를 고정
const W = {
  light: 300,      // 보조 설명 (가장 약한 위계)
  regular: 400,    // 본문·입력·라벨
  medium: 500,     // 강조 라벨 (구조 식별)
  semibold: 600,   // 인터랙티브 강조: 버튼·링크 (DS Button 스펙)
  bold: 700,       // 카드 타이틀 (히어로)
  extrabold: 800,  // 페이지 타이틀 (최상위)
};

// Foundation > Typography.Style 토큰 19종 (fontSize / lineHeight / letterSpacing) — Style 표 그대로
const TYPE = {
  display1:      { fontSize: '56px', lineHeight: '72px', letterSpacing: '-0.0319em' },
  display2:      { fontSize: '40px', lineHeight: '52px', letterSpacing: '-0.0282em' },
  display3:      { fontSize: '36px', lineHeight: '48px', letterSpacing: '-0.027em' },
  title1:        { fontSize: '32px', lineHeight: '44px', letterSpacing: '-0.0253em' },
  title2:        { fontSize: '28px', lineHeight: '38px', letterSpacing: '-0.0236em' },
  title3:        { fontSize: '24px', lineHeight: '32px', letterSpacing: '-0.023em' },
  heading1:      { fontSize: '22px', lineHeight: '30px', letterSpacing: '-0.0194em' },
  heading2:      { fontSize: '20px', lineHeight: '28px', letterSpacing: '-0.012em' },
  headline1:     { fontSize: '18px', lineHeight: '26px', letterSpacing: '-0.002em' },
  headline2:     { fontSize: '17px', lineHeight: '26px', letterSpacing: '0em' },
  body1:         { fontSize: '16px', lineHeight: '24px', letterSpacing: '0.0057em' }, // Body 1/Normal
  body1Reading:  { fontSize: '16px', lineHeight: '26px', letterSpacing: '0.0057em' },
  body2:         { fontSize: '15px', lineHeight: '22px', letterSpacing: '0.0096em' }, // Body 2/Normal
  body2Reading:  { fontSize: '15px', lineHeight: '24px', letterSpacing: '0.0096em' },
  label1:        { fontSize: '14px', lineHeight: '20px', letterSpacing: '0.0145em' }, // Label 1/Normal
  label1Reading: { fontSize: '14px', lineHeight: '22px', letterSpacing: '0.0145em' },
  label2:        { fontSize: '13px', lineHeight: '18px', letterSpacing: '0.0194em' },
  caption1:      { fontSize: '12px', lineHeight: '16px', letterSpacing: '0.0252em' },
  caption2:      { fontSize: '11px', lineHeight: '14px', letterSpacing: '0.0311em' },
};

// Foundation > Spacing 토큰 (4/8pt 시스템) — Spacing 02~64. 여백·간격·패딩은 항상 이 토큰으로.
const SP = {
  2: '2px', 4: '4px', 8: '8px', 12: '12px', 16: '16px',
  24: '24px', 32: '32px', 40: '40px', 48: '48px', 64: '64px',
};

// 컬러 팔레트 — Figma MCP 변수 기반. 비교용 2종. 아래 C 를 바꿔 전환.
//  LIGHT = 피그마 그대로(라이트), DARK = 다크 유지 + Primary/Status만 피그마 액센트
const PALETTE_LIGHT = {
  cardBg: '#FFFFFF', cardBorder: 'rgba(112,115,124,0.22)', divider: 'rgba(112,115,124,0.22)',
  brandText: '#171719', title: '#171719', subtitle: 'rgba(55,56,60,0.61)', muted: 'rgba(55,56,60,0.61)',
  fieldLabel: '#171719', inputBg: '#FFFFFF', inputBorder: 'rgba(112,115,124,0.22)', inputText: '#171719',
  clearBg: 'rgba(112,115,124,0.16)', clearIcon: '#37383C', eyeColor: 'rgba(55,56,60,0.61)',
  primary: '#0066FF', primaryStrong: '#3385FF', primaryHeavy: '#0052CC', onPrimary: '#FFFFFF', link: '#0066FF',
  errorBorder: '#FF4242', errorText: '#E52222', focusRing: 'rgba(0,102,255,0.20)', errorRing: 'rgba(255,66,66,0.18)',
  tooltipBg: '#FFFFFF', tooltipBorder: 'rgba(112,115,124,0.22)', tooltipText: '#171719', tooltipIcon: '#FF4242',
  checkBorderOff: 'rgba(112,115,124,0.52)', checkLabel: 'rgba(55,56,60,0.61)',
  positive: '#1ED45A', cardShadow: '0 24px 64px rgba(15,23,42,0.28)',
};
const PALETTE_DARK = {
  cardBg: '#1e1e1e', cardBorder: '#2c2c30', divider: '#2a2a2e',
  brandText: '#ffffff', title: '#ffffff', subtitle: '#9a9a9f', muted: '#8a8a8f',
  fieldLabel: '#888', inputBg: '#161618', inputBorder: '#2e2e2e', inputText: '#ffffff',
  clearBg: '#3a3a40', clearIcon: '#d4d4d8', eyeColor: '#888',
  primary: '#0066FF', primaryStrong: '#3385FF', primaryHeavy: '#0052CC', onPrimary: '#FFFFFF', link: '#3385FF',
  errorBorder: '#FF4242', errorText: '#FF6B6B', focusRing: 'rgba(0,102,255,0.25)', errorRing: 'rgba(255,66,66,0.20)',
  tooltipBg: '#2b2b31', tooltipBorder: '#3a3a42', tooltipText: '#eaeaec', tooltipIcon: '#FF4242',
  checkBorderOff: '#4a4a4f', checkLabel: '#bbb',
  positive: '#1ED45A', cardShadow: '0 24px 64px rgba(0,0,0,0.5)',
};
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

// Text field (Selection and input > Text field 스펙: label 12px #888, box radius 8, h44, focus #1751D9)
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

  // Primary Solid 버튼 상태 (Button 스펙: hover #3471FF, pressed #004DFF)
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
        계정이 없으신가요?{' '}
        <span style={{ color: C.link, fontWeight: W.semibold, cursor: 'pointer' }}>회원가입</span>
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
          <span style={{ marginLeft: SP[8], color: '#9a9aa2', fontVariantNumeric: 'tabular-nums' }}>2026-06-05 14:12:38</span>
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
                background: selected === c.id ? 'rgba(23,81,217,0.18)' : 'transparent',
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
        <h2 style={{ margin: 0, ...TYPE.title3, fontWeight: W.bold, color: C.title }}>회원가입</h2>
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
            회원가입
          </button>
        </div>
      )}

      <div style={{ marginTop: SP[24], paddingTop: SP[24], borderTop: `1px solid ${C.divider}`, textAlign: 'center', ...TYPE.label2, color: C.muted }}>
        이미 계정이 있으신가요?{' '}
        <span style={{ color: C.link, fontWeight: W.semibold, cursor: 'pointer' }}>로그인</span>
      </div>
    </form>
  );
}

// ── PREVAX 공통 크롬 (타이틀바 / 탭바) — GIS·설정 등에서 공유해 통일성 유지 ──
const PREVAX_TABS = ['대시보드', '지도', '선별관제', '실시간영상', '이벤트조회', '통계보고서', '이력조회', '설정'];
const prevaxWinBtn = { fontSize: '12px', color: '#8a8a92', cursor: 'pointer', lineHeight: 1 };

export function PrevaxTitleBar({ datetime, warning }) {
  return (
    <div style={{ height: '40px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${SP[12]}`, background: '#141417', borderBottom: '1px solid #000' }}>
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
        <span style={prevaxWinBtn}>⎋</span>
        <span style={{ display: 'inline-flex', gap: SP[12], marginLeft: SP[4] }}>
          <span style={prevaxWinBtn}>—</span><span style={prevaxWinBtn}>▢</span><span style={prevaxWinBtn}>✕</span>
        </span>
      </div>
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
      <PrevaxTitleBar datetime="2026-06-08 11:26:32" />
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
          {[['28%','30%','#1751D9'],['44%','52%','#E11D48'],['58%','40%','#1751D9'],['36%','64%','#7C3AED'],['50%','24%','#0EA5A0']].map(([l,t,c],i)=>(
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
    ['SH0019_2_01', '신호등', 'RS-232', '핀텔', 'Traffic Light', '사용함', '2026-05-08 13:52:03'],
    ['스피커 web 2', '스피커', '', '인터엠', 'MA-106A', '사용함', '2026-05-20 12:29:27'],
    ['스피커 web 3', '스피커', '', '인터엠', 'MA-106A', '사용함', '2026-05-08 13:21:32'],
    ['스피커 web 1', '스피커', '', '인터엠', 'MA-106A', '사용함', '2026-05-08 13:23:02'],
    ['SH0019_3_05', '신호등', '없음', '핀텔', 'Traffic Light', '사용함', '2026-05-08 13:51:35'],
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
  const panelTitle = { ...TYPE.label1, fontWeight: W.bold, color: '#fff' };
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
      <PrevaxTitleBar datetime="2026-06-05 15:12:12" />
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
                    background: on ? 'rgba(23,81,217,0.18)' : 'transparent',
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
                      background: on ? 'rgba(23,81,217,0.18)' : 'transparent',
                      borderLeft: `2px solid ${on ? T.primary : 'transparent'}`,
                      color: on ? '#fff' : '#c4c4cc', fontWeight: on ? W.semibold : W.regular,
                      display: 'flex', alignItems: 'center', gap: SP[8],
                    }}>
                      <Icon name={on ? 'check_on' : 'check_off'} size={16} />
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
                      <Icon name={evChecked.size === events.length && events.length > 0 ? 'check_on' : 'check_off'} size={16} />
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
                      <tr key={i} onClick={() => toggleEvCheck(i)} style={{ cursor: 'pointer', background: evChecked.has(i) ? 'rgba(23,81,217,0.15)' : 'transparent' }}>
                        <td style={{ ...td, width: '32px' }}>
                          <Icon name={evChecked.has(i) ? 'check_on' : 'check_off'} size={16} />
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
              <span style={{ ...TYPE.caption1, color: '#8a8a92', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>2026-06-05 15:12:10 ⟳</span>
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
                      <tr key={i} onClick={() => toggleAnSel(i)} style={{ cursor: 'pointer', background: on ? 'rgba(23,81,217,0.22)' : 'transparent' }}>
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
                <span style={panelTitle}>카메라 목록 <span style={{ ...TYPE.caption1, fontWeight: W.regular, color: '#8a8a92', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>선택된 카메라 : 0 / 17</span></span>
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
                    <th style={{ ...th, width: '24px' }}><Icon name="check_off" size={16} /></th>
                    {['등록 유형', '카메라 번호', '카메라 명', '카메라 IP', '카메라 아이디', '포트', '아이디', '비밀번호', '제조사', '카메라 고정 ID', '스트리밍 프로필'].map((h) => <th key={h} style={th}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {cameras.map((c, i) => (
                      <tr key={i}>
                        <td style={td}><Icon name="check_off" size={16} /></td>
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
                      <tr key={i} style={{ background: i === 0 ? 'rgba(23,81,217,0.22)' : 'transparent' }}>
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
    ['장비 관리', '추가', '카메라 추가', '마스터', '2026-06-05 09:43:46', 'PTZ Cam(192.168.1.247)', '인천공항 분석서버'],
    ['지역 정보 관리', '추가', '카메라 추가', '마스터', '2026-06-05 09:44:02', 'PTZ Cam/PTZ Cam', 'SH0020'],
    ['장비 관리', '수정', '카메라 수정', '마스터', '2026-06-05 09:45:32', 'PTZ Cam(192.168.1.247)', '인천공항 분석서버'],
    ['장비 관리', '수정', '카메라 수정', '마스터', '2026-06-05 09:50:37', 'ROI40(192.168.0.180)', '인천공항 분석서버'],
    ['지역 정보 관리', '삭제', '카메라 삭제', '마스터', '2026-06-05 10:15:12', 'SH-CAM1/SH-CAM1', '보행신호연장'],
    ['지역 정보 관리', '삭제', '카메라 삭제', '마스터', '2026-06-05 10:15:12', 'SH-CAM2/SH-CAM2', '보행신호연장'],
    ['지역 정보 관리', '삭제', '카메라 삭제', '마스터', '2026-06-05 10:15:12', 'SH-CAM3/SH-CAM3', '보행신호연장'],
    ['지역 정보 관리', '삭제', '카메라 삭제', '마스터', '2026-06-05 10:15:12', 'SH-CAM4/SH-CAM4', '보행신호연장'],
    ['지역 정보 관리', '추가', '카메라 추가', '마스터', '2026-06-05 10:15:23', 'SH-CAM1/SH-CAM1', 'SH0019'],
    ['지역 정보 관리', '추가', '카메라 추가', '마스터', '2026-06-05 10:15:23', 'SH-CAM2/SH-CAM2', 'SH0019'],
    ['지역 정보 관리', '추가', '카메라 추가', '마스터', '2026-06-05 10:15:23', 'SH-CAM3/SH-CAM3', 'SH0019'],
    ['지역 정보 관리', '추가', '카메라 추가', '마스터', '2026-06-05 10:15:23', 'SH-CAM4/SH-CAM4', 'SH0019'],
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
  const panelTitle = { ...TYPE.label1, fontWeight: W.bold, color: '#fff' };
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
      <PrevaxTitleBar datetime="2026-06-05 15:12:56" />
      <PrevaxTabBar active="이력조회" />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 서브 네비 */}
        <div style={{ width: '186px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #2a2a30', padding: `${SP[8]} 0` }}>
          {subNav.map((it) => {
            const on = navSel === it;
            return (
              <div key={it} onClick={() => setNavSel(it)} style={{
                padding: `${SP[8]} ${SP[16]}`, ...TYPE.label2, cursor: 'pointer',
                background: on ? 'rgba(23,81,217,0.18)' : 'transparent',
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
              <div style={{ ...ctl, width: '128px' }}>2026-06-05<Icon name="calendar_today" size={13} color="#6f6f77" style={{ marginLeft: 'auto' }} /></div>
              <Dd value="00" w="56px" /><Dd value="00" w="56px" />
              <span style={{ ...lbl, marginLeft: SP[12] }}>종료 일시</span>
              <div style={{ ...ctl, width: '128px' }}>2026-06-05<Icon name="calendar_today" size={13} color="#6f6f77" style={{ marginLeft: 'auto' }} /></div>
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
                        <tr key={i} onClick={() => setSel(i)} style={{ cursor: 'pointer', background: on ? 'rgba(23,81,217,0.22)' : 'transparent' }}>
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

  const Radio = ({ label }) => {
    const on = unit === label;
    return (
      <span onClick={() => setUnit(label)} style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4], cursor: 'pointer', ...TYPE.caption1, color: on ? '#fff' : '#bdbdc4', whiteSpace: 'nowrap' }}>
        <span style={{ width: '14px', height: '14px', flexShrink: 0, borderRadius: '50%', border: `1px solid ${on ? T.primary : '#4a4a52'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          {on && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: T.primary }} />}
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
        <Icon name={on ? 'check_on' : 'check_off'} size={16} />
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
      <PrevaxTitleBar datetime="2026-06-05 15:13:18" />
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
              <div style={{ display: 'flex', gap: SP[12], marginBottom: SP[8] }}>
                {['15분별', '시간별', '일별', '월별'].map((u) => <Radio key={u} label={u} />)}
              </div>
              <div style={{ display: 'flex', gap: SP[4], marginBottom: SP[12] }}>
                {['30분', '1시간', '2시간', '3시간', '6시간'].map((b) => <Tbtn key={b}>{b}</Tbtn>)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], marginBottom: SP[4] }}>
                <span style={{ ...TYPE.caption1, color: '#9a9aa2', width: '50px', flexShrink: 0 }}>시작 일시</span>
                <DateF value="2026-06-05" /><Dd value="13" w="46px" /><Dd value="45" w="46px" /><Dd value="00" w="46px" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: SP[4] }}>
                <span style={{ ...TYPE.caption1, color: '#9a9aa2', width: '50px', flexShrink: 0 }}>종료 일시</span>
                <DateF value="2026-06-05" /><Dd value="14" w="46px" /><Dd value="15" w="46px" /><Dd value="00" w="46px" />
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
                  cursor: 'pointer', borderRadius: '4px', background: r.sel ? 'rgba(23,81,217,0.22)' : 'transparent',
                  ...TYPE.caption1, color: r.sel ? '#fff' : (r.plain ? '#8a8a92' : '#c4c4cc'),
                }}>
                  <span style={{ width: '9px', fontSize: '8px', color: '#8a8a92', flexShrink: 0 }}>{triGlyph(r.tri)}</span>
                  {r.chk && <Icon name={r.sel ? 'check_on' : 'check_off'} size={16} />}
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

  const panel = { background: '#16161a', border: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' };
  const ctl = { display: 'flex', alignItems: 'center', height: '28px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px', ...TYPE.caption1, color: '#d4d4d8', fontFamily: T.font, cursor: 'pointer', whiteSpace: 'nowrap', boxSizing: 'border-box' };
  const rowLabel = { ...TYPE.caption1, color: '#9a9aa2', width: '56px', flexShrink: 0 };

  // 검색 조건 체크박스 (조치 여부) — DS 통합 check_on/check_off 사용
  const Chk = ({ on, onClick, children }) => (
    <span onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', ...TYPE.caption1, color: on ? '#fff' : '#9a9aa2', whiteSpace: 'nowrap' }}>
      <Icon name={on ? 'check_on' : 'check_off'} size={16} />
      {children}
    </span>
  );

  // 위험도 밴드 정의 — 색상은 상태 위계(위험>경고>주의)에 따라 채도/명도 하강.
  // 이벤트 유형별 발생 횟수는 GIS '총 이벤트 현황'과 동일한 Content badge 위계로 표기.
  const bands = [
    { label: '위험', color: '#F0436A', events: [{ label: '화재', count: 3 }, { label: '싸움', count: 1 }, { label: '무단횡단(공간적)', count: 2 }] },
    { label: '경고', color: T.cautionary, events: [{ label: '침입', count: 12 }, { label: '쓰러짐', count: 5 }, { label: '불법 주정차', count: 8 }] },
    { label: '주의', color: '#9C9C5C', events: [{ label: '배회', count: 36 }, { label: '횡단대기', count: 21 }] },
  ];

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      <PrevaxTitleBar datetime="2026-06-05 15:12:12" />
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: SP[8], padding: SP[8], minWidth: 0 }}>
          {bands.map((b) => (
            <div key={b.label} style={{ ...panel, flex: 1, borderRadius: '6px', flexDirection: 'row' }}>
              {/* 색상 사이드바 + 세로 라벨 */}
              <div style={{
                width: '28px', flexShrink: 0, background: b.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                writingMode: 'vertical-rl', textOrientation: 'upright',
                ...TYPE.label2, fontWeight: W.bold, color: '#fff', letterSpacing: '0.1em',
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
 * PREVAX 4 실시간영상 화면 — 좌측 지역/카메라 트리 + 상단 영상 옵션 툴바 + 영상 그리드(2×2) + 하단 페이지/분할 바.
 * 기존 화면과 동일한 타이틀바·탭 크롬, 토큰, 트리 위계를 공유. Switch(영상 옵션 토글)는 DS Primary 컬러 적용.
 */
function PrevaxLiveScreen() {
  const [page, setPage] = useState(1);
  const [split, setSplit] = useState(4);
  const [opts, setOpts] = useState({
    '분석 구역': false, '이벤트 구역 강조': true, '이벤트 정보': false,
    '이벤트 채널 강조': true, '객체 추적': false, '객체 종류': true, '페이지 순환': false,
  });
  const toggleOpt = (k) => setOpts((s) => ({ ...s, [k]: !s[k] }));

  // 영상 옵션 항목 — 일부는 드롭다운(세부 설정) 동반
  const optItems = [
    { label: '분석 구역', dd: true }, { label: '이벤트 구역 강조' }, { label: '이벤트 정보' },
    { label: '이벤트 채널 강조' }, { label: '객체 추적', dd: true }, { label: '객체 종류' }, { label: '페이지 순환', dd: true },
  ];

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

  // 영상 그리드 — 2×2. live = 시뮬레이션 씬, connecting = 연결중 플레이스홀더
  const grid = [
    { name: 'SH0019C001', scene: 'linear-gradient(178deg, #9aa0a8 0%, #888d95 32%, #74787f 56%, #5c5f66 100%)', time: '2025년03월10일 10:05:00' },
    { name: 'SH0019C003' },
    { name: 'SH0019C004', scene: 'linear-gradient(178deg, #aab0a8 0%, #939a8e 38%, #767c70 70%, #5e6358 100%)', time: '2025년03월10일 10:05:00' },
    { name: 'SH0019C002' },
  ];

  const Switch = ({ on, onClick }) => (
    <span onClick={onClick} style={{
      width: '28px', height: '16px', borderRadius: '8px', flexShrink: 0, cursor: 'pointer',
      background: on ? T.primary : '#3a3a42', position: 'relative', transition: 'background 0.15s',
    }}>
      <span style={{ position: 'absolute', top: '2px', left: on ? '14px' : '2px', width: '12px', height: '12px', borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }} />
    </span>
  );

  const toolBtn = { display: 'inline-flex', alignItems: 'center', gap: SP[4], height: '26px', padding: `0 ${SP[8]}`, ...TYPE.caption1, fontWeight: W.medium, color: '#d4d4d8', background: '#2a2a30', border: '1px solid #3a3a42', borderRadius: '4px', cursor: 'pointer', fontFamily: T.font, whiteSpace: 'nowrap' };

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      <PrevaxTitleBar datetime="2026-06-05 15:15:02" />
      <PrevaxTabBar active="실시간영상" />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 좌: 지역정보 트리 패널 */}
        <div style={{ width: '278px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], height: '37px', flexShrink: 0, padding: `0 ${SP[12]}`, borderBottom: '1px solid #2a2a30' }}>
            <span style={{ ...TYPE.label2, fontWeight: W.bold, color: '#fff' }}>지역정보 관리</span>
            <Icon name="cycle" size={13} color="#8a8a92" />
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7f7f87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
              <line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14l-1.6-5.8a2 2 0 0 0-1.9-1.5H8.5a2 2 0 0 0-1.9 1.5L5 17z" />
            </svg>
          </div>
          <div style={{ padding: `${SP[8]} ${SP[12]}`, borderBottom: '1px solid #232329' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[4], height: '28px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px' }}>
              <input placeholder="" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: T.font, ...TYPE.caption1 }} />
              <Icon name="search" size={14} color="#6f6f77" />
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
                  background: n.sel ? 'rgba(23,81,217,0.32)' : 'transparent',
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
        </div>

        {/* 우: 툴바 + 영상 그리드 + 하단 바 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* 영상 옵션 툴바 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: SP[12], height: '37px', flexShrink: 0, padding: `0 ${SP[12]}`, borderBottom: '1px solid #2a2a30', background: '#16161a', overflow: 'hidden' }}>
            <span style={{ ...TYPE.label2, fontWeight: W.bold, color: T.primaryStrong, whiteSpace: 'nowrap' }}>영상 옵션</span>
            {optItems.map((o) => {
              const on = opts[o.label];
              return (
                <div key={o.label} style={{ display: 'flex', alignItems: 'center', gap: SP[4], flexShrink: 0 }}>
                  <Switch on={on} onClick={() => toggleOpt(o.label)} />
                  <span onClick={() => toggleOpt(o.label)} style={{ ...TYPE.caption1, fontWeight: W.medium, color: on ? '#e4e4e8' : '#9a9aa2', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                    {o.label}{o.dd && <span style={{ fontSize: '8px', color: '#7f7f87', marginLeft: SP[4] }}>▾</span>}
                  </span>
                </div>
              );
            })}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: SP[8], flexShrink: 0 }}>
              <span style={toolBtn}>이벤트 관리</span>
              <span style={toolBtn}>객체 박스 모양 설정<span style={{ fontSize: '8px', color: '#7f7f87' }}>▾</span></span>
            </div>
          </div>

          {/* 영상 그리드 2×2 */}
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: SP[2], background: '#000', padding: SP[2] }}>
            {grid.map((c, i) => (
              <div key={i} style={{ position: 'relative', overflow: 'hidden', background: c.scene || '#0a0a0c' }}>
                {/* 연결중 플레이스홀더 */}
                {!c.scene && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...TYPE.heading2, fontWeight: W.regular, color: '#d4d4d8' }}>
                    카메라 연결중.
                  </div>
                )}
                {/* 라이브 비네팅 */}
                {c.scene && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.28) 100%)' }} />}
                {/* 카메라 명 + PTZ (우상단) */}
                <div style={{ position: 'absolute', top: '8px', right: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: SP[4] }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(20,104,147,0.4)', color: '#52ebff', fontSize: '12px', fontWeight: W.medium, fontFamily: T.font, letterSpacing: '-0.24px', lineHeight: 1.5, padding: `${SP[2]} ${SP[8]}`, borderRadius: '40px', whiteSpace: 'nowrap' }}>PTZ</span>
                  <span style={{ ...TYPE.label2, fontWeight: W.semibold, color: '#fff', background: 'rgba(10,10,12,0.72)', padding: `${SP[2]} ${SP[12]}`, borderRadius: '40px', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{c.name}</span>
                </div>
                {/* 타임스탬프 (라이브, 하단 중앙) */}
                {c.time && (
                  <span style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: T.font, fontSize: '15px', fontWeight: W.medium, color: '#fff', fontVariantNumeric: 'tabular-nums', textShadow: '0 1px 3px rgba(0,0,0,0.85)' }}>{c.time}</span>
                )}
              </div>
            ))}
          </div>

          {/* 하단 페이지 / 분할 바 */}
          <div style={{ display: 'flex', alignItems: 'center', height: '34px', flexShrink: 0, padding: `0 ${SP[12]}`, borderTop: '1px solid #2a2a30', background: '#16161a' }}>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], ...TYPE.caption1, color: '#bdbdc4' }}>
              <span style={{ cursor: 'pointer', color: '#7f7f87' }}>‹</span>
              <span style={{ ...TYPE.caption1, fontWeight: W.semibold, color: '#fff', background: '#2a2a30', border: '1px solid #3a3a42', borderRadius: '4px', padding: `${SP[2]} ${SP[8]}`, fontVariantNumeric: 'tabular-nums' }}>{page}</span>
              <span style={{ color: '#7f7f87' }}>/ 2</span>
              <span style={{ cursor: 'pointer', color: '#7f7f87' }}>›</span>
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: SP[16], ...TYPE.label2, fontVariantNumeric: 'tabular-nums' }}>
              {[4, 9, 16].map((n) => (
                <span key={n} onClick={() => setSplit(n)} style={{ cursor: 'pointer', fontWeight: split === n ? W.bold : W.regular, color: split === n ? T.primaryStrong : '#8a8a92' }}>{n}</span>
              ))}
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
        background: 'linear-gradient(155deg, #0a1535 0%, #1751D9 65%, #3471FF 100%)',
        color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <p style={{ ...TYPE.caption1, fontWeight: W.semibold, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em', marginBottom: SP[24] }}>
          PINTEL DESIGN SYSTEM — INTERNAL REVIEW · 2026-06-11
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

        <div style={pn}>1 / 3</div>
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

        <div style={pn}>2 / 3</div>
      </div>

      {/* ── 3장: 인사이트 및 제언 ── */}
      <div style={{ ...page, background: '#f3f3f3', borderTop: '4px solid #e0e0e0' }}>
        <RPageHeader label="3장 — 핵심 인사이트, 한계 및 제언" />

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
          <div style={{ background: 'linear-gradient(135deg, #0a1535 0%, #1751D9 100%)', borderRadius: '16px', padding: `${SP[40]} ${SP[48]}`, color: '#fff' }}>
            <h3 style={{ ...TYPE.headline1, fontWeight: W.bold, margin: `0 0 ${SP[16]} 0` }}>결론</h3>
            <p style={{ ...TYPE.body2, lineHeight: 1.9, color: 'rgba(255,255,255,0.88)', margin: 0, maxWidth: '1200px' }}>
              헤르메스 에이전트는 단순한 코딩 보조를 넘어 디자인-개발 경계를 해체하는 통합 UX 에이전트로서의 잠재력을 이미 가시화하고 있다. 62%의 토큰 비용 절감과 83%의 일관성 오류 감소는 수치 이상의 의미를 갖는다. 에이전트가 프로젝트의 설계 언어를 학습하고, 그 언어로 일관되게 말할 수 있게 되었음을 의미한다.
            </p>
            <p style={{ ...TYPE.body2, lineHeight: 1.9, color: 'rgba(255,255,255,0.75)', margin: `${SP[16]} 0 0 0`, maxWidth: '1200px' }}>
              MCP 생태계의 성숙, 메모리 시스템의 정교화, 피그마 연동 파이프라인의 고도화가 맞물릴 때 헤르메스 에이전트는 PREVAX 4의 전체 UX 품질 관리 인프라로 발전할 수 있다. 그 여정의 첫 번째 이정표를 이 보고서로 남긴다.
            </p>
          </div>
        </RSection>

        <div style={pn}>3 / 3</div>
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
      <PrevaxTitleBar datetime="2026-06-12 14:13:08" warning="미확인 이벤트 7건" />
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

  // 일시 입력 — Statistics(CS)와 동일한 DateF(날짜+캘린더) / Dd(시·분·초 드롭다운) UI
  const statCtl = { display: 'flex', alignItems: 'center', height: '26px', padding: `0 ${SP[8]}`, background: '#141417', border: '1px solid #2e2e35', borderRadius: '4px', ...TYPE.caption1, color: '#d4d4d8', fontFamily: T.font, cursor: 'pointer', whiteSpace: 'nowrap', boxSizing: 'border-box' };
  const Dd = ({ value, w }) => <div style={{ ...statCtl, width: w, flexShrink: 0, justifyContent: 'space-between' }}>{value}<span style={{ fontSize: '8px', color: '#7f7f87', marginLeft: SP[4] }}>▾</span></div>;
  const DateF = ({ value }) => <div style={{ ...statCtl, width: '116px', flexShrink: 0, justifyContent: 'space-between' }}>{value}<Icon name="calendar_today" size={13} color="#6f6f77" /></div>;

  // 체크박스 (DS 통합 check_on/check_off)
  const Chk = ({ on, onClick, children }) => (
    <span onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', ...TYPE.caption1, color: on ? '#e8e8ec' : '#8a8a92', whiteSpace: 'nowrap' }}>
      <Icon name={on ? 'check_on' : 'check_off'} size={15} />
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
    grade: '주의', gradeColor: T.cautionary, time: '2025-10-29 11:38:45',
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
      <PrevaxTitleBar datetime="2025-10-29 11:48:28" />
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
                <DateF value="2025-10-29" /><Dd value="11" w="46px" /><Dd value="38" w="46px" /><Dd value="08" w="46px" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: SP[4] }}>
                <span style={{ ...TYPE.caption1, color: '#9a9aa2', width: '50px', flexShrink: 0 }}>종료 일시</span>
                <DateF value="2025-10-29" /><Dd value="11" w="46px" /><Dd value="48" w="46px" /><Dd value="08" w="46px" />
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
                <Icon name="check_on" size={15} />
                <span>시청사거리</span>
                <span style={{ ...TYPE.caption2, color: '#7f7f87', marginLeft: SP[2] }}>[14]</span>
              </div>
              {equip.map((n, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: `${SP[4]} ${SP[4]}`, paddingLeft: `${6 + n.d * 16}px`, ...TYPE.caption1, color: n.on ? '#bdbdc4' : '#7f7f87', cursor: 'pointer', userSelect: 'none' }}>
                  <span style={{ width: '8px', fontSize: '8px', color: '#7f7f87', flexShrink: 0 }}>▸</span>
                  <Icon name={n.on ? 'check_on' : 'check_off'} size={14} />
                  <Icon name="nest_cam_outdoor" size={13} color={n.on ? '#8a8a92' : '#5a5a62'} />
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

// 예시 레지스트리 — 이후 화면 예시를 여기 추가
// 화면 예시 렌더러(JSX) — 문서 메타데이터(title/description/uses)는 data/templates.js에서 공유.
// MCP 서버도 LIBRARY_TEMPLATES를 읽어 동일 페이지를 "문서"로 노출합니다.
const RENDERERS = {
  'library-dashboard': { render: () => <PrevaxDashboardScreen /> },
  'library-signup': { render: () => <SignupScreen /> },
  'library-login': { render: () => <LoginScreen /> },
  'library-selective': { render: () => <PrevaxSelectiveScreen /> },
  'library-live': { render: () => <PrevaxLiveScreen /> },
  'library-gis-monitor': { render: () => <PrevaxGisScreen /> },
  'library-settings': { render: () => <PrevaxSettingsScreen /> },
  'library-events': { render: () => <PrevaxSettingsScreen initialNav="이벤트 관리" /> },
  'library-history': { render: () => <PrevaxHistoryScreen /> },
  'library-stats': { render: () => <PrevaxStatsScreen /> },
  'library-ux-agent': { render: () => <UxAgentReportScreen /> },
  'library-event-search': { render: () => <PrevaxEventSearchScreen /> },
  'library-permission': { render: () => <PrevaxPermissionScreen />, toolbar: () => <XamlDownloadButton /> },
};

// 메타데이터(공유 데이터) + 렌더러(로컬) 병합
const EXAMPLES = Object.fromEntries(
  Object.entries(LIBRARY_TEMPLATES).map(([id, meta]) => [id, { ...meta, ...(RENDERERS[id] || {}) }]),
);

export default function Library({ componentId }) {
  const example = EXAMPLES[componentId] || EXAMPLES['library-login'];
  const [expanded, setExpanded] = useState(false);
  const [scale, setScale] = useState(1);

  // 확대 보기: 1920×1080 스테이지를 뷰포트에 맞게 비율 유지 스케일 + ESC 닫기
  useEffect(() => {
    if (!expanded) return undefined;
    const fit = () => setScale(Math.min((window.innerWidth - 48) / 1920, (window.innerHeight - 64) / 1080, 1));
    fit();
    const onKey = (e) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('resize', fit);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('resize', fit); window.removeEventListener('keydown', onKey); };
  }, [expanded]);

  return (
    <div
      className="ds-main"
      style={{ padding: `${SP[40]} ${SP[48]}`, color: '#fff', fontFamily: T.font, overflowY: 'auto' }}
    >
      {/* 페이지 헤더 */}
      <h1 style={{ margin: 0, fontSize: '32px', lineHeight: '44px', fontWeight: W.extrabold, letterSpacing: '-0.025em' }}>
        {example.title}
      </h1>
      <p style={{ margin: `${SP[8]} 0 ${SP[16]}`, maxWidth: '680px', fontSize: '15px', lineHeight: '24px', color: '#9a9a9f' }}>
        {example.description}
      </p>

      {/* 구성 컴포넌트 칩 (Content badge / neutral 스타일) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP[8], marginBottom: SP[24] }}>
        {example.uses.map((u) => (
          <span
            key={u}
            style={{
              fontSize: '12px', color: '#c9c9cf',
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
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%', aspectRatio: '1920 / 1080', boxSizing: 'border-box', padding: SP[32],
        borderRadius: '16px',
        border: '1px solid #242424',
        background:
          'radial-gradient(1200px 400px at 50% -10%, rgba(23,81,217,0.18), transparent 60%), linear-gradient(160deg, #0c0c0f 0%, #121218 55%, #0c0c0f 100%)',
        overflow: 'auto',
      }}>
        {/* 확대 버튼 (우측 상단) */}
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
        <div key={componentId} style={{ display: 'contents' }}>{example.render()}</div>
        <span style={{ position: 'absolute', right: '12px', bottom: '10px', fontSize: '11px', color: '#5a5a62', letterSpacing: '0.04em', pointerEvents: 'none' }}>1920 × 1080</span>
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
          {/* 1920×1080 스테이지 */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '1920px', height: '1080px', flexShrink: 0,
              transform: `scale(${scale})`, transformOrigin: 'center center',
              background: '#0c0c0f', borderRadius: '4px', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 1px #2a2a30',
            }}
          >
            <div key={componentId} style={{ display: 'contents' }}>{example.render()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
