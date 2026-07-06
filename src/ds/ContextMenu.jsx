/**
 * Pintel DS 정본 컴포넌트 — ContextMenu (id: present-menu)
 * 이 파일이 단일 출처입니다. 화면에서 import 해 재사용하세요(재작성 금지).
 * 문서/ MCP code 는 gen-component-code.mjs 가 이 파일에서 생성합니다.
 */
import { useState } from 'react';
import { SP, T, W, TYPE } from '../data/tokens';
import { Icon } from '../components/icons';

// 우클릭 컨텍스트 메뉴 — 커서 위치에 열리는 동작 목록
// 아이콘·순서는 Figma "Component 24"(783:1750) videoContext 세트를 따른다.
const ITEMS = [
  { label: '영상 분석 설정', icon: 'settings' },
  { label: '카메라 연동 분석 설정', sepAfter: true, icon: 'settings_video_camera' },
  { label: '선택 영상 재연결', icon: 'replace_video' },
  { label: '카메라 연결 테스트', sepBefore: true, icon: 'automation' },
  { label: '카메라 웹 연결', icon: 'language' },
  { label: '카메라 점검모드로 전환', icon: 'flip_camera_ios' },
];
const item = (extra) => ({ display: 'flex', alignItems: 'center', gap: SP[8], padding: `7px ${SP[12]}`, ...TYPE.caption1, color: '#d4d4d8', cursor: 'pointer', whiteSpace: 'nowrap', ...extra });

export function ContextMenu() {
  const [menu, setMenu] = useState(null); // { x, y }
  const [pinned, setPinned] = useState(false);
  const openAt = (e) => {
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    setMenu({ x: Math.min(e.clientX - r.left, r.width - 224), y: Math.min(e.clientY - r.top, r.height - 250) });
  };
  return (
    <div onContextMenu={openAt} onClick={() => setMenu(null)} style={{ position: 'relative', height: '100%' }}>
      {menu && (
        <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', left: menu.x, top: menu.y, zIndex: 40, width: 216, background: '#1E2229', border: '1px solid #2c3540', borderRadius: 8, boxShadow: '0 18px 48px rgba(0,0,0,0.72)', padding: `${SP[4]} 0`, overflow: 'hidden' }}>
          <div onClick={() => { setPinned((v) => !v); setMenu(null); }} style={item({ color: '#ffd699', fontWeight: W.bold, borderBottom: '1px solid #2c3540' })}>
            <span style={{ width: 14, height: 14, flexShrink: 0, display: 'inline-flex' }}><Icon name="keep" size={14} color={T.cautionary} /></span>
            {pinned ? '고정 해제' : '고정'}
          </div>
          {ITEMS.map((m) => (
            <div key={m.label} onClick={() => setMenu(null)} style={item({ ...(m.sepBefore ? { borderTop: '1px solid #2c3540' } : {}), ...(m.sepAfter ? { borderBottom: '1px solid #2c3540' } : {}) })}>
              <span style={{ width: 14, height: 14, flexShrink: 0, display: 'inline-flex' }}><Icon name={m.icon} size={14} color="#8a8a92" /></span>
              {m.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
