import { useState, useRef, useEffect, Fragment } from 'react';
import { COMPONENT_DOCS, SPACING_MAP, CATEGORIES, TIERS } from '../data/components';
import { COMPONENT_PROPS } from '../data/components-props';
import { T, SP, TYPE, W, COLOR_ACCENT, COLOR_STATUS } from '../data/tokens';
import { Icon } from './icons';
import { SectionHeader } from '../ds/SectionHeader';

/**
 * 컴포넌트 이름 (예: "Accordion.Item")을 ID (예: "accordion-item")로 변환 */
function nameToId(name) {
  // CATEGORIES에서 children을 순회하며 이름이 일치하는 항목의 id를 반환
  for (const cat of CATEGORIES) {
    for (const child of cat.children) {
      if (child.name === name) return child.id;
    }
  }
  return null;
}

function isDownloadableTierId(id) {
  if (!id) return false;
  const isComp = TIERS.component.groups.some(group => 
    group.categories.some(cat => 
      cat.children.some(child => child.id === id)
    )
  );
  const isService = TIERS['service-domain']?.groups.some(group => 
    group.categories.some(cat => 
      cat.children.some(child => child.id === id)
    )
  );
  return isComp || isService;
}

/**
 * 렌더된 <svg> DOM 노드를 PNG로 변환해 다운로드한다.
 * viewBox를 유지한 채 export 크기(기본 256px)로 캔버스에 그려 투명 배경 PNG로 저장.
 */
function downloadSvgAsPng(svgEl, fileName, exportSize = 256) {
  if (!svgEl) return;
  const clone = svgEl.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', exportSize);
  clone.setAttribute('height', exportSize);
  const svgString = new XMLSerializer().serializeToString(clone);
  const svgUrl = URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' }));
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = exportSize;
    canvas.height = exportSize;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, exportSize, exportSize);
    URL.revokeObjectURL(svgUrl);
    canvas.toBlob((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${fileName}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    }, 'image/png');
  };
  img.src = svgUrl;
}

/**
 * Figma 디자인 시스템 아이콘 세트 (frame "디자인 시스템 4" / Icon)
 * 모든 path는 Figma export(viewBox 0 0 20 20) 원본 그대로이며,
 * size·color prop으로 크기/색상만 조정한다. 기본 color는 Figma 정의값.
 */
// check_circle (동그라미 + 체크) — active #00A9FF
function FigCheckCircle({ size = 20, color = '#00A9FF', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M8.12623 13.1262C8.51675 13.5168 9.14992 13.5168 9.54044 13.1262L14.125 8.54167C14.4472 8.2195 14.4472 7.69717 14.125 7.375C13.8028 7.05283 13.2805 7.05283 12.9583 7.375L9.54044 10.7929C9.14992 11.1834 8.51675 11.1834 8.12623 10.7929L7.04167 9.70833C6.7195 9.38617 6.19717 9.38617 5.875 9.70833C5.55283 10.0305 5.55283 10.5528 5.875 10.875L8.12623 13.1262ZM10 18.3333C8.84722 18.3333 7.76389 18.1146 6.75 17.6771C5.73611 17.2396 4.85417 16.6458 4.10417 15.8958C3.35417 15.1458 2.76042 14.2639 2.32292 13.25C1.88542 12.2361 1.66667 11.1528 1.66667 10C1.66667 8.84722 1.88542 7.76389 2.32292 6.75C2.76042 5.73611 3.35417 4.85417 4.10417 4.10417C4.85417 3.35417 5.73611 2.76042 6.75 2.32292C7.76389 1.88542 8.84722 1.66667 10 1.66667C11.1528 1.66667 12.2361 1.88542 13.25 2.32292C14.2639 2.76042 15.1458 3.35417 15.8958 4.10417C16.6458 4.85417 17.2396 5.73611 17.6771 6.75C18.1146 7.76389 18.3333 8.84722 18.3333 10C18.3333 11.1528 18.1146 12.2361 17.6771 13.25C17.2396 14.2639 16.6458 15.1458 15.8958 15.8958C15.1458 16.6458 14.2639 17.2396 13.25 17.6771C12.2361 18.1146 11.1528 18.3333 10 18.3333Z" fill={color} />
    </svg>
  );
}

// check_circle 의 체크 곡선만 (사각형 체크박스 내부용)
function FigCheckmark({ size = 20, color = '#ffffff', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M8.12623 13.1262C8.51675 13.5168 9.14992 13.5168 9.54044 13.1262L14.125 8.54167C14.4472 8.2195 14.4472 7.69717 14.125 7.375C13.8028 7.05283 13.2805 7.05283 12.9583 7.375L9.54044 10.7929C9.14992 11.1834 8.51675 11.1834 8.12623 10.7929L7.04167 9.70833C6.7195 9.38617 6.19717 9.38617 5.875 9.70833C5.55283 10.0305 5.55283 10.5528 5.875 10.875L8.12623 13.1262Z" fill={color} />
    </svg>
  );
}

// arrow_drop_down (아래 삼각형) — active #00A9FF
function FigArrowDropDown({ size = 20, color = '#00A9FF', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M10.7071 11.7929C10.3166 12.1834 9.68342 12.1834 9.29289 11.7929L7.54044 10.0404C6.91047 9.41047 7.35664 8.33333 8.24755 8.33333H11.7525C12.6434 8.33333 13.0895 9.41048 12.4596 10.0404L10.7071 11.7929Z" fill={color} />
    </svg>
  );
}

// calendar_today (달력) — active #00A9FF
function FigCalendarToday({ size = 20, color = '#00A9FF', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M4.16667 18.3333C3.70833 18.3333 3.31597 18.1701 2.98958 17.8437C2.66319 17.5174 2.5 17.125 2.5 16.6667V5C2.5 4.54167 2.66319 4.14931 2.98958 3.82292C3.31597 3.49653 3.70833 3.33333 4.16667 3.33333C4.6269 3.33333 5 2.96024 5 2.5C5 2.03976 5.3731 1.66667 5.83333 1.66667C6.29357 1.66667 6.66667 2.03976 6.66667 2.5C6.66667 2.96024 7.03976 3.33333 7.5 3.33333H12.5C12.9602 3.33333 13.3333 2.96024 13.3333 2.5C13.3333 2.03976 13.7064 1.66667 14.1667 1.66667C14.6269 1.66667 15 2.03976 15 2.5C15 2.96024 15.3731 3.33333 15.8333 3.33333C16.2917 3.33333 16.684 3.49653 17.0104 3.82292C17.3368 4.14931 17.5 4.54167 17.5 5V16.6667C17.5 17.125 17.3368 17.5174 17.0104 17.8437C16.684 18.1701 16.2917 18.3333 15.8333 18.3333H4.16667ZM4.16667 15.6667C4.16667 16.219 4.61438 16.6667 5.16667 16.6667H14.8333C15.3856 16.6667 15.8333 16.219 15.8333 15.6667V9.33333C15.8333 8.78105 15.3856 8.33333 14.8333 8.33333H5.16667C4.61438 8.33333 4.16667 8.78105 4.16667 9.33333V15.6667ZM4.16667 5.83333C4.16667 6.29357 4.53976 6.66667 5 6.66667H15C15.4602 6.66667 15.8333 6.29357 15.8333 5.83333C15.8333 5.3731 15.4602 5 15 5H5C4.53976 5 4.16667 5.3731 4.16667 5.83333Z" fill={color} />
    </svg>
  );
}

// search (돋보기) — inactive #B1B1B2
function FigSearch({ size = 20, color = '#B1B1B2', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M16.9167 16.9167C16.5945 17.2388 16.0722 17.2388 15.75 16.9167L11.7162 12.8829C11.3559 12.5226 10.7858 12.501 10.3353 12.739C10.118 12.8538 9.88816 12.9547 9.64583 13.0417C9.10417 13.2361 8.52778 13.3333 7.91667 13.3333C6.40278 13.3333 5.12153 12.809 4.07292 11.7604C3.02431 10.7118 2.5 9.43056 2.5 7.91667C2.5 6.40278 3.02431 5.12153 4.07292 4.07292C5.12153 3.02431 6.40278 2.5 7.91667 2.5C9.43056 2.5 10.7118 3.02431 11.7604 4.07292C12.809 5.12153 13.3333 6.40278 13.3333 7.91667C13.3333 8.52778 13.2361 9.10417 13.0417 9.64583C12.9547 9.88816 12.8538 10.118 12.739 10.3353C12.501 10.7858 12.5226 11.3559 12.8829 11.7162L16.9167 15.75C17.2388 16.0722 17.2388 16.5945 16.9167 16.9167ZM7.91667 11.6667C8.95833 11.6667 9.84375 11.3021 10.5729 10.5729C11.3021 9.84375 11.6667 8.95833 11.6667 7.91667C11.6667 6.875 11.3021 5.98958 10.5729 5.26042C9.84375 4.53125 8.95833 4.16667 7.91667 4.16667C6.875 4.16667 5.98958 4.53125 5.26042 5.26042C4.53125 5.98958 4.16667 6.875 4.16667 7.91667C4.16667 8.95833 4.53125 9.84375 5.26042 10.5729C5.98958 11.3021 6.875 11.6667 7.91667 11.6667Z" fill={color} />
    </svg>
  );
}

// trending_up (상승 추세) — #FFAC3A
function FigTrendingUp({ size = 20, color = '#FFAC3A', opacity = 0.6, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M2.83415 15L1.66748 13.8333L7.83415 7.625L11.1675 10.9583L15.5008 6.66667H13.3341V5H18.3341V10H16.6675V7.83333L11.1675 13.3333L7.83415 10L2.83415 15Z" fill={color} fillOpacity={opacity} />
    </svg>
  );
}

function renderComponentThumbnail(id) {
  // 웹 브라우저 창 모형 래퍼 (Browser Window Frame)
  const BrowserFrame = ({ children }) => (
    <div style={{
      width: '160px',
      height: '100px',
      border: '1.5px solid transparent',
      borderRadius: '8px',
      backgroundImage: 'linear-gradient(#ffffff, #ffffff), linear-gradient(135deg, #ff007f, #7f00ff, #00f0ff)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'content-box, border-box',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      boxSizing: 'border-box'
    }}>
      {/* Browser Header Bar */}
      <div style={{
        height: '14px',
        backgroundColor: '#f4f4f5',
        borderBottom: '1px solid #e4e4e7',
        display: 'flex',
        alignItems: 'center',
        padding: '0 6px',
        gap: '3px',
        flexShrink: 0
      }}>
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
        <div style={{ height: '5px', width: '60px', backgroundColor: '#e4e4e7', borderRadius: '2.5px', marginLeft: '6px' }} />
      </div>
      {/* Browser Content Area */}
      <div style={{
        flex: 1,
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '6px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {children}
      </div>
    </div>
  );

  switch (id) {
    case 'action-area-default':
      return (
        <BrowserFrame>
          <div style={{ flex: 1 }} />
          <div style={{
            width: '110px',
            padding: '5px',
            backgroundColor: '#0066FF',
            color: '#fff',
            fontSize: '8px',
            fontWeight: 'bold',
            borderRadius: '4px',
            textAlign: 'center',
            marginBottom: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
          }}>Action area</div>
        </BrowserFrame>
      );
    case 'alert-default':
      return (
        <BrowserFrame>
          <div style={{
            width: '110px',
            backgroundColor: '#ffffff',
            border: '1px solid #e4e4e7',
            borderLeft: '2.5px solid #F59E0B',
            borderRadius: '4px',
            padding: '4px 6px',
            boxSizing: 'border-box',
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ color: '#F59E0B', flexShrink: 0, display: 'flex' }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ width: '32px', height: '3px', borderRadius: '1.5px', backgroundColor: '#18181b' }} />
              <div style={{ width: '56px', height: '2.5px', borderRadius: '1px', backgroundColor: '#71717a' }} />
            </div>
          </div>
        </BrowserFrame>
      );
    case 'toast-default':
      return (
        <BrowserFrame>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#707580',
            borderRadius: '5px',
            padding: '4px 8px',
            color: '#fff',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '110px',
            boxSizing: 'border-box'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              border: '0.8px dashed rgba(255, 255, 255, 0.8)',
              borderRadius: '1px',
              flexShrink: 0
            }} />
            <div style={{ width: '44px', height: '3px', borderRadius: '1.5px', backgroundColor: '#ffffff' }} />
          </div>
        </BrowserFrame>
      );
    case 'button-primary':
      return (
        <BrowserFrame>
          <div style={{
            padding: '5px 12px',
            backgroundColor: '#0066FF',
            color: '#fff',
            fontSize: '8px',
            fontWeight: 'bold',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
          }}>Button</div>
        </BrowserFrame>
      );
    case 'chip-closeable':
      return (
        <BrowserFrame>
          <div style={{ display: 'flex', gap: '3px' }}>
            <div style={{ padding: '3px 6px', backgroundColor: '#0066FF', color: '#fff', fontSize: '7px', borderRadius: '8px', fontWeight: 'bold' }}>Chip</div>
            <div style={{ padding: '3px 6px', backgroundColor: '#e4e4e7', color: '#71717a', fontSize: '7px', borderRadius: '8px' }}>Chip</div>
            <div style={{ padding: '3px 6px', backgroundColor: '#e4e4e7', color: '#71717a', fontSize: '7px', borderRadius: '8px' }}>Chip</div>
          </div>
        </BrowserFrame>
      );
    case 'button-text':
      return (
        <BrowserFrame>
          <div style={{ fontSize: '9px', color: '#0066FF', fontWeight: 'bold' }}>
            Text button
          </div>
        </BrowserFrame>
      );
    case 'button-icon':
      return (
        <BrowserFrame>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0066FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><polygon points="8,5 19,12 8,19" /></svg>
          </div>
        </BrowserFrame>
      );
    case 'accordion-default':
      return (
        <BrowserFrame>
          <div style={{ width: '110px', border: '1px solid #e4e4e7', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#fff' }}>
            <div style={{ padding: '4px 6px', fontSize: '7px', borderBottom: '1px solid #e4e4e7', display: 'flex', justifyContent: 'space-between', color: '#18181b', fontWeight: 'bold' }}>
              <span>Accordion</span>
              <span>▼</span>
            </div>
            <div style={{ padding: '4px 6px', fontSize: '7px', backgroundColor: '#f9f9f9', color: '#71717a' }}>
              Expanded contents
            </div>
          </div>
        </BrowserFrame>
      );
    case 'avatar-default':
      return (
        <BrowserFrame>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#18181b', color: '#fff', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>JD</div>
            <div style={{ position: 'absolute', bottom: '0', right: '0', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1ED45A', border: '1.5px solid #ffffff' }} />
          </div>
        </BrowserFrame>
      );
    case 'avatar-group-default':
      return (
        <BrowserFrame>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#18181b', color: '#fff', fontSize: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #ffffff', zIndex: 3 }}>A</div>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#3385FF', color: '#fff', fontSize: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #ffffff', marginLeft: '-6px', zIndex: 2 }}>B</div>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e4e4e7', color: '#555', fontSize: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #ffffff', marginLeft: '-6px', zIndex: 1 }}>+2</div>
          </div>
        </BrowserFrame>
      );
    case 'card-panel':
      return (
        <BrowserFrame>
          <div style={{ width: '110px', height: '54px', border: '1px solid #e4e4e7', borderRadius: '6px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '4px 6px', borderBottom: '1px solid #f4f4f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '7px', fontWeight: 'bold', color: '#18181b' }}>Card</span>
              <div style={{ width: '12px', height: '4px', borderRadius: '2px', backgroundColor: '#e4e4e7' }} />
            </div>
            <div style={{ flex: 1, backgroundColor: '#f9f9f9', margin: '3px', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '60px', height: '4px', borderRadius: '2px', backgroundColor: '#e4e4e7' }} />
            </div>
          </div>
        </BrowserFrame>
      );
    case 'content-badge-default':
      return (
        <BrowserFrame>
          <div style={{ padding: '3px 8px', backgroundColor: '#e4e4e7', color: '#18181b', fontSize: '8px', fontWeight: 'bold', borderRadius: '3px', border: '1px solid #d4d4d8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Badge</span>
            <span style={{ color: '#a1a1aa' }}>×</span>
          </div>
        </BrowserFrame>
      );
    case 'play-button-default':
      return (
        <BrowserFrame>
          <div style={{ position: 'relative', width: '84px', aspectRatio: '16 / 9', borderRadius: '4px', overflow: 'hidden', background: 'linear-gradient(135deg, #5b6472, #2a2f38)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)' }} />
            <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.92)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
              <Icon name="play" size={10} color="#0066FF" style={{ marginLeft: '1px' }} />
            </span>
          </div>
        </BrowserFrame>
      );
    case 'list-card-default':
      return (
        <BrowserFrame>
          <div style={{ width: '110px', border: '1px solid #e4e4e7', borderRadius: '6px', backgroundColor: '#fff', padding: '6px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <div style={{ width: '24px', height: '18px', borderRadius: '3px', backgroundColor: '#f4f4f5' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ width: '40px', height: '4px', borderRadius: '2px', backgroundColor: '#18181b' }} />
                <div style={{ width: '20px', height: '3px', borderRadius: '1.5px', backgroundColor: '#a1a1aa' }} />
              </div>
            </div>
          </div>
        </BrowserFrame>
      );
    case 'list-cell-default':
      return (
        <BrowserFrame>
          <div style={{ width: '110px', border: '1px solid #e4e4e7', borderRadius: '4px', backgroundColor: '#fff', padding: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#18181b' }} />
              <div style={{ width: '32px', height: '4px', borderRadius: '2px', backgroundColor: '#18181b' }} />
            </div>
            <div style={{ width: '8px', height: '4px', borderRadius: '2px', backgroundColor: '#a1a1aa' }} />
          </div>
        </BrowserFrame>
      );
    case 'category-default':
      return (
        <BrowserFrame>
          <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
            <div style={{ padding: '3px 7px', backgroundColor: '#0066FF', color: '#fff', fontSize: '7px', borderRadius: '5px', fontWeight: 'bold' }}>Category</div>
            <div style={{ padding: '3px 7px', backgroundColor: '#f3f4f6', color: '#71717a', fontSize: '7px', borderRadius: '5px' }}>Category</div>
            <div style={{ padding: '3px 7px', backgroundColor: '#f3f4f6', color: '#71717a', fontSize: '7px', borderRadius: '5px' }}>Category</div>
            <div style={{ width: '12px', height: '12px', border: '1px dashed #a1a1aa', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa', fontSize: '9px', lineHeight: 1 }}>+</div>
          </div>
        </BrowserFrame>
      );
    case 'control-checkbox':
      return (
        <BrowserFrame>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#0066FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FigCheckmark size={14} color="#fff" />
            </div>
            <span style={{ fontSize: '8px', color: '#18181b' }}>Checkbox</span>
          </div>
        </BrowserFrame>
      );
    case 'control-radio':
      return (
        <BrowserFrame>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#0066FF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fff' }} />
            </div>
            <span style={{ fontSize: '8px', color: '#18181b' }}>Radio</span>
          </div>
        </BrowserFrame>
      );
    case 'control-switch':
      return (
        <BrowserFrame>
          <div style={{ width: '40px', height: '22px', borderRadius: '11px', backgroundColor: '#0066FF', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '2px', right: '2px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff' }} />
          </div>
        </BrowserFrame>
      );
    case 'control-slider':
      return (
        <BrowserFrame>
          <div style={{ width: '120px', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{ height: '4px', flex: 1, borderRadius: '2px', backgroundColor: '#e4e4e7' }} />
            <div style={{ position: 'absolute', left: 0, height: '4px', width: '55%', borderRadius: '2px', backgroundColor: '#0066FF' }} />
            <div style={{ position: 'absolute', left: '55%', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#fff', border: '2px solid #0066FF', transform: 'translateX(-50%)', boxSizing: 'border-box' }} />
          </div>
        </BrowserFrame>
      );
    case 'control-select':
      return (
        <BrowserFrame>
          <div style={{ width: '120px', height: '24px', border: '1px solid #e4e4e7', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', backgroundColor: '#fff', boxSizing: 'border-box' }}>
            <span style={{ fontSize: '8px', color: '#18181b' }}>선택</span>
            <FigArrowDropDown size={16} color="#00A9FF" />
          </div>
        </BrowserFrame>
      );
    case 'field-text':
      return (
        <BrowserFrame>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '7px', color: '#71717a' }}>지점명</span>
            <div style={{ width: '120px', height: '22px', border: '1px solid #0066FF', borderRadius: '6px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', padding: '0 6px', boxSizing: 'border-box' }}>
              <div style={{ width: '1.5px', height: '12px', backgroundColor: '#0066FF' }} />
            </div>
          </div>
        </BrowserFrame>
      );
    case 'field-textarea':
      return (
        <BrowserFrame>
          <div style={{ width: '120px', height: '50px', border: '1px solid #e4e4e7', borderRadius: '6px', backgroundColor: '#fff', padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px', boxSizing: 'border-box' }}>
            <div style={{ width: '90%', height: '3px', borderRadius: '1.5px', backgroundColor: '#d4d4d8' }} />
            <div style={{ width: '75%', height: '3px', borderRadius: '1.5px', backgroundColor: '#d4d4d8' }} />
            <div style={{ width: '82%', height: '3px', borderRadius: '1.5px', backgroundColor: '#d4d4d8' }} />
          </div>
        </BrowserFrame>
      );
    case 'field-search':
      return (
        <BrowserFrame>
          <div style={{ width: '120px', height: '24px', border: '1px solid #e4e4e7', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px', backgroundColor: '#fff', boxSizing: 'border-box' }}>
            <FigSearch size={13} color="#B1B1B2" />
            <span style={{ fontSize: '8px', color: '#a1a1aa' }}>검색</span>
          </div>
        </BrowserFrame>
      );
    case 'filter-button-default':
      return (
        <BrowserFrame>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', border: '1px solid #0066FF', borderRadius: '6px', color: '#0066FF', fontSize: '8px', fontWeight: 'bold' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
            필터
            <span style={{ backgroundColor: '#0066FF', color: '#fff', borderRadius: '50%', width: '12px', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px' }}>3</span>
          </div>
        </BrowserFrame>
      );
    case 'framed-style-default':
      return (
        <BrowserFrame>
          <div style={{ width: '110px', height: '44px', border: '1px solid #c4c4c8', borderRadius: '6px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
            <span style={{ position: 'absolute', top: '-6px', left: '8px', background: '#fff', padding: '0 4px', fontSize: '7px', color: '#888' }}>Frame</span>
            <div style={{ width: '70px', height: '4px', borderRadius: '2px', backgroundColor: '#e4e4e7' }} />
          </div>
        </BrowserFrame>
      );
    default:
      return (
        <BrowserFrame>
          <div style={{ fontSize: '11px', color: '#52525b', fontWeight: 600, textAlign: 'center', padding: '0 10px', lineHeight: 1.3 }}>
            {COMPONENT_DOCS[id]?.name || id}
          </div>
        </BrowserFrame>
      );
  }
}

export default function ComponentDoc({ componentId, activeTier, onNavigate }) {
  const doc = componentId ? COMPONENT_DOCS[componentId] : null;
  const initialTab = 'design';
  const [activeInnerTab, setActiveInnerTab] = useState(initialTab);
  const [animPlay, setAnimPlay] = useState(false);
  const scrollContainerRef = useRef(null);



  useEffect(() => {
    if (componentId) {
      setActiveInnerTab(initialTab);
      // 신규 컴포넌트 로드 시 컨테이너 스크롤 상단으로
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo(0, 0);
      }
    }
  }, [componentId, initialTab]);

  if (!componentId) {
    const isService = activeTier === 'service-domain';
    const groups = isService ? (TIERS['service-domain']?.groups || []) : TIERS.component.groups;
    const titleText = isService ? 'Service Domains' : 'Components';
    const descText = isService 
      ? '핀텔 스마트 시티 및 교통 솔루션의 각 도메인별 특화 가이드와 전용 컴포넌트입니다.' 
      : '스마트 시티 및 교통 관제 모듈을 구성하는 표준 UI 컴포넌트 명세입니다.';

    return (
      <div className="ds-main" ref={scrollContainerRef} style={{ padding: '40px 48px', color: '#fff', fontFamily: "'Pretendard', sans-serif", overflowY: 'auto' }}>
        <div className="fade-in">
          <div style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '12px' }}>
            {titleText}
          </div>
          <div style={{ fontSize: '15px', color: '#888', marginBottom: '48px' }}>
            {descText}
          </div>

          {groups.map(group => (
            <div key={group.id} style={{ marginBottom: '48px' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, borderBottom: '1px solid #2e2e2e', paddingBottom: '12px', marginBottom: '24px', letterSpacing: '-0.5px' }}>
                {group.label}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                gap: '24px'
              }}>
                {group.categories.map(cat => {
                  const child = cat.children[0];
                  return (
                    <div
                      key={child.id}
                      onClick={() => onNavigate(child.id)}
                      style={{
                        backgroundColor: '#1a1a1a',
                        borderRadius: '12px',
                        border: '1px solid #2a2a2a',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.borderColor = '#0066FF';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 102, 255, 0.15)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.borderColor = '#2a2a2a';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Thumbnail Container */}
                      <div style={{
                        height: '140px',
                        backgroundColor: '#f5f5f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                        borderBottom: '1px solid #2a2a2a'
                      }}>
                        {renderComponentThumbnail(child.id)}
                      </div>
                      
                      {/* Component Label */}
                      <div style={{
                        padding: '14px 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#151517'
                      }}>
                        <span>{cat.name}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="ds-main" ref={scrollContainerRef}>
        <div className="doc-welcome fade-in">
          <div className="doc-welcome-title" style={{ fontFamily: 'Pretendard GOV', fontWeight: 900, fontSize: '56px', letterSpacing: '-2px' }}>
            선택한 컴포넌트 정보가 없습니다.
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'design', label: 'Design' },
    { id: 'web', label: 'Web' },
    { id: 'cs', label: 'Cs' },
  ];

  // 특정 탭의 내용을 렌더링하는 헬퍼 함수
  const renderTabContent = (tabId) => {
    // ──────────────────────────────────────────────
    // 1. DESIGN TAB
    // ──────────────────────────────────────────────
    if (tabId === 'design') {
      // 1A. 특수한 레이아웃이 있는 경우 (Foundation)
      if (doc.customLayout === 'iconography') {
        return (
          <div className="doc-tab-content-inner fade-in" style={{ textAlign: 'left' }}>
            <div className="doc-tab-content">
              {doc.overview && (
                <p style={{ ...TYPE.body2Reading, color: '#aaa', marginBottom: '28px', maxWidth: '760px' }}>{doc.overview}</p>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                {(doc.icons || []).map((ic) => (
                  <div key={ic.name} data-icon-card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 12px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px' }}>
                    <span data-icon-svg style={{ display: 'flex' }}><Icon name={ic.name} size={28} /></span>
                    <div style={{ fontSize: '12px', color: '#fff', fontFamily: "'Pretendard GOV', monospace" }}>{ic.name}</div>
                    {ic.label && <div style={{ fontSize: '11px', color: '#888' }}>{ic.label}</div>}
                    <button
                      onClick={(e) => downloadSvgAsPng(e.currentTarget.closest('[data-icon-card]').querySelector('[data-icon-svg] svg'), ic.name)}
                      title={`${ic.name}.png 다운로드`}
                      style={{ marginTop: '2px', padding: '5px 12px', fontSize: '11px', fontWeight: 600, color: '#cfd2d6', background: '#222428', border: '1px solid #34373c', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#0066FF'; e.currentTarget.style.borderColor = '#0066FF'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#222428'; e.currentTarget.style.borderColor = '#34373c'; e.currentTarget.style.color = '#cfd2d6'; }}
                    >
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v8M4.5 7l3.5 3.5L11.5 7M3 13.5h10" /></svg>
                      PNG
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      if (doc.customLayout === 'typography') {
        return (
          <div className="doc-tab-content-inner fade-in" style={{ textAlign: 'left' }}>
            <div className="doc-tab-content">
              <div className="doc-typography-preview" style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '48px', color: '#111' }}>
                프리텐다드 GOV Pretendard GOV
              </div>
              <div className="doc-typography-table">
                <div className="doc-typography-header" style={{ gridTemplateColumns: '2.5fr 1fr 1.5fr 1.2fr' }}>
                  <div>명칭 (Name)</div>
                  <div>크기 (Size)</div>
                  <div>행간 (Line Height)</div>
                  <div>자간 (Letter Spacing)</div>
                </div>
                {doc.fonts?.map((font, idx) => (
                  <div key={idx} className="doc-typography-row" style={{ gridTemplateColumns: '2.5fr 1fr 1.5fr 1.2fr' }}>
                    <div className="doc-typo-name" style={{ fontSize: font.size, fontWeight: 'normal', letterSpacing: font.letterSpacing, lineHeight: font.lineHeight?.split('  ')[0]?.split(' ')[0] || font.lineHeight }}>{font.name}</div>
                    <div className="doc-typo-value">{font.size}</div>
                    <div className="doc-typo-value">{font.lineHeight}</div>
                    <div className="doc-typo-value">{font.letterSpacing}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      if (doc.customLayout === 'word-break') {
        return (
          <div className="doc-tab-content-inner fade-in" style={{ textAlign: 'left' }}>
            <div className="doc-tab-content">
              {doc.overview && (
                <p style={{ ...TYPE.body2Reading, color: '#aaa', marginBottom: '28px', maxWidth: '760px', wordBreak: 'keep-all' }}>{doc.overview}</p>
              )}
              <div style={{
                background: '#ffffff', borderRadius: '16px', padding: '64px 40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px'
              }}>
                <div style={{
                  fontSize: '40px', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.5,
                  letterSpacing: '-0.02em', textAlign: 'center', maxWidth: '660px', wordBreak: 'keep-all'
                }}>
                  {(doc.words || []).map((w, i) => (
                    <span key={i}>
                      <span
                        style={{
                          background: '#FAD4D4', borderRadius: '5px', padding: '2px 4px',
                          boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'
                        }}
                      >{w}</span>
                      {i < (doc.words.length - 1) ? ' ' : ''}
                    </span>
                  ))}
                </div>
              </div>
              {doc.usage && (
                <p style={{ fontSize: '14px', color: '#cccccc', lineHeight: 1.7, marginTop: '24px', maxWidth: '760px', wordBreak: 'keep-all' }}>{doc.usage}</p>
              )}
            </div>
          </div>
        );
      }
      if (doc.customLayout === 'custom-table') {
        return (
          <div className="doc-tab-content-inner fade-in" style={{ textAlign: 'left' }}>
            <div className="doc-tab-content">
              <div className="doc-typography-table">
                <div className="doc-typography-header" style={{ gridTemplateColumns: doc.gridTemplate || `repeat(${doc.tableHeaders?.length || 1}, 1fr)` }}>
                  {doc.tableHeaders?.map((header, idx) => (
                    <div key={idx}>{header}</div>
                  ))}
                </div>
                {doc.tableRows?.map((row, idx) => (
                  <div key={idx} className="doc-typography-row" style={{ gridTemplateColumns: doc.gridTemplate || `repeat(${doc.tableHeaders?.length || 1}, 1fr)` }}>
                    {row?.map((cell, cellIdx) => (
                      <div key={cellIdx} className={cellIdx === 0 ? "doc-typo-name" : "doc-typo-value"}>
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {doc.note && (
                <div className="doc-token-note" style={{ marginTop: '24px', padding: '16px 20px', backgroundColor: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: '8px', fontSize: '13px', lineHeight: '1.7', color: '#888', whiteSpace: 'pre-line' }}>
                  {doc.note}
                </div>
              )}
              {doc.previewType === 'animation-duration' && (
                <div className="anim-preview-container fade-in">
                  <button className="anim-play-btn" onClick={() => setAnimPlay(!animPlay)}>
                    ▶️ {animPlay ? '되돌리기 (Reverse)' : '재생 (Play)'}
                  </button>
                  {[
                    { label: 'Fast (150ms)', duration: '150ms' },
                    { label: 'Normal (250ms)', duration: '250ms' },
                    { label: 'Slow (350ms)', duration: '350ms' }
                  ].map((anim, idx) => (
                    <div key={idx} className="anim-track" style={{ paddingLeft: '160px', paddingRight: '160px' }}>
                      <span className="anim-track-label">{anim.label}</span>
                      <div className="anim-box" style={{ 
                        transition: `transform ${anim.duration} cubic-bezier(0.4, 0, 0.2, 1)`,
                        transform: animPlay ? 'translateX(400px)' : 'translateX(0px)' 
                      }}></div>
                    </div>
                  ))}
                </div>
              )}
              {doc.previewType === 'animation-easing' && (
                <div className="anim-preview-container fade-in">
                  <button className="anim-play-btn" onClick={() => setAnimPlay(!animPlay)}>
                    ▶️ {animPlay ? '되돌리기 (Reverse)' : '재생 (Play)'}
                  </button>
                  {[
                    { label: 'Standard', easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
                    { label: 'Snappy', easing: 'cubic-bezier(0.17, 0.89, 0.32, 1.28)' },
                    { label: 'Decel', easing: 'cubic-bezier(0, 0, 0.2, 1)' }
                  ].map((anim, idx) => (
                    <div key={idx} className="anim-track" style={{ paddingLeft: '160px', paddingRight: '160px' }}>
                      <span className="anim-track-label">{anim.label}</span>
                      <div className="anim-box" style={{ 
                        transition: `transform 600ms ${anim.easing}`,
                        transform: animPlay ? 'translateX(400px)' : 'translateX(0px)' 
                      }}></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }
      if (doc.customLayout === 'color-palette') {
        return (
          <div className="doc-tab-content-inner fade-in" style={{ textAlign: 'left' }}>
            <div className="doc-tab-content">
              <div className="doc-color-palette">
                <div className="doc-color-bar">
                  {doc.colors?.map((color, idx) => (
                    <div key={idx} className="doc-color-swatch" style={{ backgroundColor: color.hex }}></div>
                  ))}
                </div>
                <div className="doc-color-info-row">
                  {doc.colors?.map((color, idx) => (
                    <div key={idx} className="doc-color-info">
                      <div className="doc-color-name">{color.name}</div>
                      <div className="doc-color-hex">{color.hex}</div>
                    </div>
                  ))}
                </div>
                <div className="doc-typography-table" style={{ marginTop: '48px' }}>
                  <div className="doc-typography-header" style={{ gridTemplateColumns: '1.5fr 1fr 2fr 1.5fr' }}>
                    <div>토큰 명칭 (Token)</div>
                    <div>색상 값 (Hex)</div>
                    <div>역할 및 용도 (Role)</div>
                    <div>CSS 변수 (Variable)</div>
                  </div>
                  {doc.colors?.map((color, idx) => (
                    <div key={idx} className="doc-typography-row" style={{ gridTemplateColumns: '1.5fr 1fr 2fr 1.5fr' }}>
                      <div className="doc-typo-name">{color.name}</div>
                      <div className="doc-typo-value" style={{ fontFamily: 'monospace', color: color.hex, fontWeight: 'bold' }}>{color.hex}</div>
                      <div className="doc-typo-value" style={{ fontSize: '13px' }}>{color.role}</div>
                      <div className="doc-typo-value" style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0066FF' }}>{color.variable}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (componentId === 'foundation-overview-default') {
        return (
          <div className="doc-tab-content-inner fade-in" style={{ textAlign: 'left' }}>
            <MockUI componentId={componentId} componentName={doc.name} activeSubTab="anatomy" onNavigate={onNavigate} />
          </div>
        );
      }

      // 1B. 일반 UI 컴포넌트의 Design 탭 내용
      return (
        <div className="doc-tab-content-inner fade-in" style={{ textAlign: 'left' }}>
          {/* Overview / Design Slogan */}
          {doc.overview && (
            <p style={{ ...TYPE.body2Reading, color: '#cccccc', marginBottom: '32px' }}>
              {doc.overview}
            </p>
          )}

          {/* Anatomy Preview */}
          <div className="doc-anatomy-section">
            <h2 className="doc-anatomy-title">Anatomy</h2>
            <div className="doc-anatomy-box" style={{ background: '#111111', borderColor: '#222', padding: '32px' }}>
              <MockUI componentId={componentId} componentName={doc.name} activeSubTab="anatomy" onNavigate={onNavigate} />
            </div>
          </div>
          
          {/* Interactive Playground */}
          <div className="doc-anatomy-section">
            <h2 className="doc-anatomy-title">Interactive Playground</h2>
            <div style={{ background: '#171717', padding: '32px', borderRadius: '8px', border: '1px solid #222', marginBottom: '24px' }}>
              <MockUI componentId={componentId} componentName={doc.name} activeSubTab="interactive" onNavigate={onNavigate} />
            </div>
          </div>

          {/* Properties / Specs */}
          {doc.properties && doc.properties.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h2 className="doc-anatomy-title">Design Specs</h2>
              {doc.properties.map((prop, idx) => (
                <div key={idx} className="doc-property">
                  <div className="doc-prop-header">
                    <span className="doc-prop-name">{prop.name}</span>
                    <span className="doc-prop-title">{prop.title}</span>
                    {prop.type && (
                      <span className="doc-type-badge">{prop.type}</span>
                    )}
                  </div>
                  {prop.conditions && (
                    <div className="doc-conditions">
                      {prop.conditions.map((cond, i) => (
                        <div key={i} className="doc-condition">
                          {cond.detail ? (
                            <>
                              <span>{cond.condition}</span>
                              <br />
                              <span style={{ color: '#888' }}>{cond.detail}</span>
                            </>
                          ) : (
                            <span>{cond.condition}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {prop.spacingMap && (
                    <div className="doc-spacing-map">
                      <div className="doc-spacing-map-label">
                        SpacingMap&lt;'none' | 'px' | '25' | '50' | ... | '1500'&gt;
                      </div>
                      {SPACING_MAP.map((val) => (
                        <span key={val} className="doc-spacing-chip">
                          '{val}'
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Props (소스 자동 도출) — src/ds/*.jsx 시그니처를 AST로 추출한 실제 API (gen-component-props.mjs) */}
          {COMPONENT_PROPS[componentId] && COMPONENT_PROPS[componentId].props.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h2 className="doc-anatomy-title">Props (소스 자동 도출)</h2>
              <p style={{ color: '#999', fontSize: '13px', lineHeight: 1.6, margin: '0 0 14px', maxWidth: '760px', wordBreak: 'keep-all' }}>
                정본 소스 <code style={{ color: '#bdbdc4' }}>{COMPONENT_PROPS[componentId].file}</code>의 시그니처에서 AST로 자동 추출한 실제 prop입니다 — 코드와 항상 일치합니다(위 Design Specs는 사람이 쓴 개념 설명).
              </p>
              <div style={{ maxWidth: '760px', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '1px', background: '#2a2a30', fontSize: '13px' }}>
                  {['Prop', 'Type', 'Default'].map((h) => (
                    <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '9px 12px' }}>{h}</div>
                  ))}
                  {COMPONENT_PROPS[componentId].props.flatMap((p) => ([
                    <div key={`${p.name}-n`} style={{ background: '#141416', color: '#e4e4e7', fontWeight: 600, padding: '9px 12px', fontFamily: 'monospace' }}>{p.name}</div>,
                    <div key={`${p.name}-t`} style={{ background: '#141416', color: '#60a5fa', padding: '9px 12px', fontFamily: 'monospace' }}>{p.type}</div>,
                    <div key={`${p.name}-d`} style={{ background: '#141416', color: p.default != null ? '#b5ce8e' : '#555', padding: '9px 12px', fontFamily: 'monospace' }}>{p.default != null ? p.default : '—'}</div>,
                  ]))}
                </div>
              </div>
            </div>
          )}

          {/* Design Behavior guidelines */}
          {doc.behavior && (
            <div style={{ marginTop: '40px' }}>
              <h2 className="doc-anatomy-title">Behavior</h2>
              <p style={{ color: '#cccccc', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {doc.behavior}
              </p>
            </div>
          )}

          {/* Design Usage guidelines */}
          {doc.usage && (
            <div style={{ marginTop: '40px' }}>
              <h2 className="doc-anatomy-title">Usage</h2>
              <p style={{ color: '#cccccc', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {doc.usage}
              </p>
            </div>
          )}

          {/* When to use — 컴포넌트 간 선택(whenToUse/related)·조합(combineRule) 규칙 */}
          {(doc.whenToUse || (doc.related && doc.related.length > 0) || doc.combineRule) && (
            <div style={{ marginTop: '40px' }}>
              <h2 className="doc-anatomy-title">언제 쓰나 (When to use)</h2>
              {doc.whenToUse && (
                <p style={{ color: '#cccccc', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap', maxWidth: '760px', wordBreak: 'keep-all' }}>
                  {doc.whenToUse}
                </p>
              )}
              {doc.related && doc.related.length > 0 && (
                <div style={{ marginTop: '16px', maxWidth: '760px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>대신 고려할 컴포넌트</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {doc.related.map((r) => (
                      <div key={r.id} style={{ display: 'flex', gap: '10px', alignItems: 'baseline', fontSize: '14px', lineHeight: 1.6, wordBreak: 'keep-all' }}>
                        <span style={{ flexShrink: 0, fontWeight: 600, color: '#60a5fa' }}>{COMPONENT_DOCS[r.id]?.name || r.id}</span>
                        <span style={{ color: '#666' }}>—</span>
                        <span style={{ color: '#cccccc' }}>{r.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {doc.combineRule && (
                <div style={{ marginTop: '16px', maxWidth: '760px', padding: '12px 14px', borderRadius: '8px', background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.24)', wordBreak: 'keep-all' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#60a5fa', letterSpacing: '0.03em' }}>함께 쓰기 </span>
                  <span style={{ fontSize: '14px', color: '#cccccc', lineHeight: 1.6 }}>{doc.combineRule}</span>
                </div>
              )}
            </div>
          )}

          {/* Design Tokens Table (if present, backup fallback) */}
          {doc.designTokens && (
            <div style={{ marginTop: '40px' }}>
              <h2 className="doc-anatomy-title">Design Tokens</h2>
              <div className="doc-typography-table" style={{ background: '#ffffff', borderColor: '#e0e0e0' }}>
                <div className="doc-typography-header" style={{ gridTemplateColumns: '1.5fr 1.5fr 2fr', color: '#555', background: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                  <div>토큰 명칭 (Token)</div>
                  <div>설정 값 (Value)</div>
                  <div>역할 (Role)</div>
                </div>
                {doc.designTokens.map((token, idx) => (
                  <div key={idx} className="doc-typography-row" style={{ gridTemplateColumns: '1.5fr 1.5fr 2fr', borderBottom: '1px solid #f0f0f0', color: '#666' }}>
                    <div className="doc-typo-name" style={{ color: '#111', fontWeight: 600 }}>{token.name}</div>
                    <div className="doc-typo-value" style={{ fontFamily: 'monospace', color: '#0066FF' }}>{token.value}</div>
                    <div className="doc-typo-value" style={{ color: '#666' }}>{token.role}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // ──────────────────────────────────────────────
    // 2. WEB TAB
    // ──────────────────────────────────────────────
    if (tabId === 'web') {
      const activeProps = doc.webProps || [];
      const activeCode = doc.webCode || doc.code;

      return (
        <div className="doc-tab-content-inner fade-in" style={{ textAlign: 'left' }}>
          {/* Web Implementation Overview */}
          <p style={{ color: '#cccccc', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
            웹 표준 환경(React, HTML5, CSS3)에서 사용할 수 있는 {doc.name} 컴포넌트 명세입니다.
          </p>

          {/* React Props Table */}
          {activeProps.length > 0 ? (
            <div style={{ marginBottom: '40px' }}>
              <h2 className="doc-anatomy-title">React Props</h2>
              <div className="doc-typography-table" style={{ background: '#ffffff', borderColor: '#e0e0e0' }}>
                <div className="doc-typography-header" style={{ gridTemplateColumns: '1.2fr 1.5fr 1fr 2fr', background: '#f5f5f5', borderBottom: '1px solid #e0e0e0', color: '#555' }}>
                  <div>Prop 이름</div>
                  <div>타입 (Type)</div>
                  <div>기본값 (Default)</div>
                  <div>설명 (Description)</div>
                </div>
                {activeProps.map((prop, idx) => (
                  <div key={idx} className="doc-typography-row" style={{ gridTemplateColumns: '1.2fr 1.5fr 1fr 2fr', borderBottom: '#f0f0f0' }}>
                    <div className="doc-typo-name" style={{ fontWeight: 600, color: '#111' }}>{prop.name}</div>
                    <div className="doc-typo-value" style={{ fontFamily: 'monospace', color: '#d91751' }}>{prop.type}</div>
                    <div className="doc-typo-value" style={{ fontFamily: 'monospace', color: '#666' }}>{prop.defaultValue}</div>
                    <div className="doc-typo-value" style={{ color: '#666' }}>{prop.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // webProps가 없는 경우 일반 properties를 활용해 연동 표시해줍니다! (예: Button, Chip 등)
            doc.properties && doc.properties.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h2 className="doc-anatomy-title">Design Specs & properties</h2>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>아래 명세를 참조하여 Web 환경에 동일하게 속성(Attribute)을 선언할 수 있습니다.</p>
                <div className="doc-typography-table" style={{ background: '#ffffff', borderColor: '#e0e0e0' }}>
                  <div className="doc-typography-header" style={{ gridTemplateColumns: '1.5fr 1.5fr 3fr', background: '#f5f5f5', borderBottom: '1px solid #e0e0e0', color: '#555' }}>
                    <div>속성 (Property)</div>
                    <div>분류 (Type)</div>
                    <div>기준 정의 (Design Spec)</div>
                  </div>
                  {doc.properties.map((prop, idx) => (
                    <div key={idx} className="doc-typography-row" style={{ gridTemplateColumns: '1.5fr 1.5fr 3fr', borderBottom: '1px solid #f0f0f0', color: '#666' }}>
                      <div className="doc-typo-name" style={{ fontWeight: 600, color: '#111' }}>{prop.name}</div>
                      <div className="doc-typo-value" style={{ fontFamily: 'monospace', color: '#d91751' }}>{prop.type}</div>
                      <div style={{ fontSize: '13px' }}>
                        {prop.conditions?.map((c, ci) => (
                          <div key={ci}>• {c.condition}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* Implementation Code */}
          {activeCode && (
            <div>
              <h2 className="doc-anatomy-title">React / CSS Implementation</h2>
              <div style={{ position: 'relative' }}>
                <pre style={{ 
                  backgroundColor: '#1a1a1a', 
                  padding: '24px', 
                  borderRadius: '8px', 
                  color: '#e0e0e0',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  overflowX: 'auto',
                  border: '1px solid #333',
                  fontFamily: 'Consolas, Monaco, monospace'
                }}>
                  <code>{activeCode}</code>
                </pre>
                <button 
                  onClick={(e) => {
                    navigator.clipboard.writeText(activeCode);
                    const btn = e.currentTarget;
                    btn.innerText = 'Copied!';
                    setTimeout(() => btn.innerText = 'Copy', 2000);
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '6px 12px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // ──────────────────────────────────────────────
    // 3. CS TAB
    // ──────────────────────────────────────────────
    if (tabId === 'cs') {
      const activeCsProps = doc.csProperties || [];
      const activeCsCode = doc.csCode;

      return (
        <div className="doc-tab-content-inner fade-in" style={{ textAlign: 'left' }}>
          {/* Cs Implementation Overview */}
          <p style={{ color: '#cccccc', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
            C# 클라이언트 환경(WPF, XAML)에서 사용할 수 있는 {doc.name} 컴포넌트 명세입니다.
          </p>

          {/* Dependency Properties Table */}
          {activeCsProps.length > 0 ? (
            <div style={{ marginBottom: '40px' }}>
              <h2 className="doc-anatomy-title">Dependency Properties</h2>
              <div className="doc-typography-table" style={{ background: '#ffffff', borderColor: '#e0e0e0' }}>
                <div className="doc-typography-header" style={{ gridTemplateColumns: '1.5fr 1.2fr 2fr', background: '#f5f5f5', borderBottom: '1px solid #e0e0e0', color: '#555' }}>
                  <div>Property 이름</div>
                  <div>타입 (Type)</div>
                  <div>설명 (Description)</div>
                </div>
                {activeCsProps.map((prop, idx) => (
                  <div key={idx} className="doc-typography-row" style={{ gridTemplateColumns: '1.5fr 1.2fr 2fr', borderBottom: '#f0f0f0' }}>
                    <div className="doc-typo-name" style={{ fontWeight: 600, color: '#111' }}>{prop.name}</div>
                    <div className="doc-typo-value" style={{ fontFamily: 'monospace', color: '#0066FF' }}>{prop.type}</div>
                    <div className="doc-typo-value" style={{ color: '#666' }}>{prop.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // csProperties가 없는 경우 일반 properties를 활용해 WPF 바인딩 대응 표를 자동 제공합니다! (예: Button, Chip 등)
            doc.properties && doc.properties.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h2 className="doc-anatomy-title">WPF Dependency Properties</h2>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>WPF 커스텀 컨트롤 구현 시 바인딩(Binding) 가능해야 하는 의존성 속성 목록입니다.</p>
                <div className="doc-typography-table" style={{ background: '#ffffff', borderColor: '#e0e0e0' }}>
                  <div className="doc-typography-header" style={{ gridTemplateColumns: '1.5fr 1.5fr 3fr', background: '#f5f5f5', borderBottom: '1px solid #e0e0e0', color: '#555' }}>
                    <div>의존성 속성 (Dependency Property)</div>
                    <div>데이터 타입 (Type)</div>
                    <div>디자인 가이드라인 (Design Standard)</div>
                  </div>
                  {doc.properties.map((prop, idx) => (
                    <div key={idx} className="doc-typography-row" style={{ gridTemplateColumns: '1.5fr 1.5fr 3fr', borderBottom: '1px solid #f0f0f0', color: '#666' }}>
                      <div className="doc-typo-name" style={{ fontWeight: 600, color: '#111' }}>{prop.name}Property</div>
                      <div className="doc-typo-value" style={{ fontFamily: 'monospace', color: '#0066FF' }}>
                        {prop.type === 'ColorToken' ? 'Brush' : prop.type === 'SpacingMap' ? 'Thickness' : 'String'}
                      </div>
                      <div style={{ fontSize: '13px' }}>
                        {prop.conditions?.map((c, ci) => (
                          <div key={ci}>• {c.condition}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* XAML Style Template Code */}
          {activeCsCode ? (
            <div>
              <h2 className="doc-anatomy-title">XAML Style Template</h2>
              <div style={{ position: 'relative' }}>
                <pre style={{ 
                  backgroundColor: '#1a1a1a', 
                  padding: '24px', 
                  borderRadius: '8px', 
                  color: '#e0e0e0',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  overflowX: 'auto',
                  border: '1px solid #333',
                  fontFamily: 'Consolas, Monaco, monospace'
                }}>
                  <code>{activeCsCode}</code>
                </pre>
                <button 
                  onClick={(e) => {
                    navigator.clipboard.writeText(activeCsCode);
                    const btn = e.currentTarget;
                    btn.innerText = 'Copied!';
                    setTimeout(() => btn.innerText = 'Copy', 2000);
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '6px 12px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          ) : (
            // csCode가 없는 경우 WPF 개발 편의를 위해 WPF용 기본 ControlTemplate XAML 코드를 자동 제네레이션해서 보여줍니다! (예: Button, Chip 등)
            <div style={{ marginTop: '24px' }}>
              <h2 className="doc-anatomy-title">XAML Style Template (WPF)</h2>
              <div style={{ position: 'relative' }}>
                <pre style={{ 
                  backgroundColor: '#1a1a1a', 
                  padding: '24px', 
                  borderRadius: '8px', 
                  color: '#e0e0e0',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  overflowX: 'auto',
                  border: '1px solid #333',
                  fontFamily: 'Consolas, Monaco, monospace'
                }}>
                  <code>{`<!-- WPF Custom Control Style Template for ${doc.name} -->\n<Style TargetType="{x:Type controls:${doc.name.replace('.', '')}}">\n    <Setter Property="Background" Value="#1A1A1A"/>\n    <Setter Property="BorderBrush" Value="#2A2A2A"/>\n    <Setter Property="BorderThickness" Value="1"/>\n    <Setter Property="Padding" Value="12"/>\n    <Setter Property="Template">\n        <Setter.Value>\n            <ControlTemplate TargetType="{x:Type controls:${doc.name.replace('.', '')}}">\n                <Border Background="{TemplateBinding Background}"\n                        BorderBrush="{TemplateBinding BorderBrush}"\n                        BorderThickness="{TemplateBinding BorderThickness}"\n                        CornerRadius="8">\n                    <!-- Content Presenter for nested dashboard widgets -->\n                    <ContentPresenter HorizontalAlignment="Stretch" VerticalAlignment="Stretch"/>\n                </Border>\n            </ControlTemplate>\n        </Setter.Value>\n    </Setter>\n</Style>`}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const isDarkComponent = true;

  return (
    <div className={`ds-main ${isDarkComponent ? 'ds-dark-theme' : ''}`} key={componentId} ref={scrollContainerRef}>
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="doc-title">{doc.name}</h1>
            <p className="doc-description">
              {renderDescriptionWithCode(doc.description, onNavigate)}
            </p>
          </div>
          {/* Web usage example preview (브라우저 목업) */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
            <div style={{ width: '208px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ transform: 'scale(1.3)' }}>
                {renderComponentThumbnail(componentId)}
              </div>
            </div>
            <span style={{ fontSize: '11px', color: '#666', letterSpacing: '0.3px' }}>웹 적용 예시</span>
          </div>
        </div>

        {/* Unified Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          borderBottom: '1px solid #2e2e2e', 
          marginBottom: '24px',
          position: 'sticky',
          top: -80,
          backgroundColor: '#121212',
          zIndex: 10,
          paddingTop: '8px'
        }}>
          <div className="doc-inner-tabs" style={{ borderBottom: 'none', marginBottom: '-1px' }}>
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={`doc-inner-tab ${activeInnerTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveInnerTab(tab.id);
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo(0, 0);
                  }
                }}
              >
                {tab.label}
              </div>
            ))}
          </div>
          
          {(componentId === 'foundation-overview-default' || isDownloadableTierId(componentId)) && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button 
                onClick={() => {
                  let md = '';
                  let filename = '';

                  if (componentId === 'foundation-overview-default') {
                    md = `# Pintel Design System - Foundation Spec\n\n`;
                    md += `핀텔 디자인 시스템의 Foundation 명세서 모음입니다.\\n\\n---\\n\\n`;

                    const FOUNDATION_IDS = [
                      'foundation-overview-default',
                      'color-primary',
                      'color-status',
                      'typo-style',
                      'spacing-style',
                      'elevation-style',
                      'anim-duration',
                      'anim-easing'
                    ];

                    FOUNDATION_IDS.forEach(id => {
                      const targetDoc = COMPONENT_DOCS[id];
                      if (!targetDoc) return;

                      md += `# ${targetDoc.name}\n\n`;
                      if (targetDoc.description) md += `${targetDoc.description}\n\n`;
                      if (targetDoc.overview) md += `## Overview\n${targetDoc.overview}\n\n`;

                      if (targetDoc.customLayout === 'typography') {
                        md += `### Typography Scale\n\n`;
                        md += `| 명칭 | 크기 | 행간 | 자간 |\n`;
                        md += `| --- | --- | --- | --- |\n`;
                        targetDoc.fonts?.forEach(font => {
                          md += `| ${font.name} | ${font.size} | ${font.lineHeight} | ${font.letterSpacing} |\n`;
                        });
                        md += `\n`;
                      } else if (targetDoc.customLayout === 'color-palette') {
                        md += `### Color Palette\n\n`;
                        md += `| 토큰 명칭 | 색상 값 | 역할 및 용도 | CSS 변수 |\n`;
                        md += `| --- | --- | --- | --- |\n`;
                        targetDoc.colors?.forEach(color => {
                          md += `| ${color.name} | ${color.hex} | ${color.role} | ${color.variable} |\n`;
                        });
                        md += `\n`;
                      } else if (targetDoc.customLayout === 'custom-table') {
                        md += `### Specification\n\n`;
                        if (targetDoc.tableHeaders) {
                          md += `| ${targetDoc.tableHeaders.join(' | ')} |\n`;
                          md += `| ${targetDoc.tableHeaders.map(() => '---').join(' | ')} |\n`;
                          targetDoc.tableRows?.forEach(row => {
                            md += `| ${row.join(' | ')} |\n`;
                          });
                          md += `\n`;
                        }
                      }

                      if (targetDoc.behavior) md += `### Behavior\n${targetDoc.behavior}\n\n`;
                      if (targetDoc.usage) md += `### Usage\n${targetDoc.usage}\n\n`;
                      if (targetDoc.code) md += `### Code Reference\n\n\`\`\`css\n${targetDoc.code}\n\`\`\`\n\n`;

                      md += `\n---\n\n`;
                    });

                    filename = `pintel-foundation-spec.md`;
                  } else {
                    const targetDoc = COMPONENT_DOCS[componentId];
                    if (!targetDoc) return;

                    md = `# ${targetDoc.name}\n\n`;
                    if (targetDoc.description) md += `${targetDoc.description}\n\n`;
                    if (targetDoc.overview) md += `## Overview\n${targetDoc.overview}\n\n`;

                    // Design Tokens
                    if (targetDoc.designTokens && targetDoc.designTokens.length > 0) {
                      md += `## Design Tokens\n\n`;
                      md += `| 토큰 명칭 | 값 | 역할 및 용도 |\n`;
                      md += `| --- | --- | --- |\n`;
                      targetDoc.designTokens.forEach(t => {
                        md += `| ${t.name || ''} | ${t.value || ''} | ${t.role || ''} |\n`;
                      });
                      md += `\n`;
                    }

                    // Properties (Web / General)
                    const webProps = targetDoc.webProps || targetDoc.properties;
                    if (webProps && webProps.length > 0) {
                      md += `## Properties (Web)\n\n`;
                      md += `| 속성명 | 타입 | 기본값 | 설명 |\n`;
                      md += `| --- | --- | --- | --- |\n`;
                      webProps.forEach(p => {
                        const name = p.name || '';
                        const type = p.type || '';
                        const defaultValue = p.defaultValue || '-';
                        const desc = p.desc || (p.conditions ? p.conditions.map(c => c.condition).join(', ') : '');
                        md += `| ${name} | ${type} | ${defaultValue} | ${desc} |\n`;
                      });
                      md += `\n`;
                    }

                    // Properties (C# / WPF)
                    if (targetDoc.csProperties && targetDoc.csProperties.length > 0) {
                      md += `## Properties (C# / WPF)\n\n`;
                      md += `| 속성명 | 타입 | 설명 |\n`;
                      md += `| --- | --- | --- |\n`;
                      targetDoc.csProperties.forEach(p => {
                        md += `| ${p.name || ''} | ${p.type || ''} | ${p.desc || ''} |\n`;
                      });
                      md += `\n`;
                    }

                    // Code Web
                    const webCode = targetDoc.webCode;
                    if (webCode) {
                      md += `## Code Reference (Web)\n\n\`\`\`javascript\n${webCode}\n\`\`\`\n\n`;
                    }

                    if (targetDoc.csCode) {
                      md += `## Code Reference (C# / WPF)\n\n\`\`\`xml\n${targetDoc.csCode}\n\`\`\`\n\n`;
                    }

                    filename = `pintel-${componentId}-spec.md`;
                  }

                  const blob = new Blob([md], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = filename;
                  link.click();
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  border: '1px solid #0066FF',
                  borderRadius: '4px',
                  color: '#0066FF',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 102, 255,0.1)' }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                {componentId === 'foundation-overview-default' ? '파운데이션 명세 다운로드 (MD)' : '명세서 다운로드 (MD)'}
              </button>

              <button 
                onClick={() => {
                  let jsonContent = '';
                  let filename = '';

                  if (componentId === 'foundation-overview-default') {
                    const FOUNDATION_IDS = [
                      'foundation-overview-default',
                      'color-primary',
                      'color-status',
                      'typo-style',
                      'spacing-style',
                      'elevation-style',
                      'anim-duration',
                      'anim-easing'
                    ];

                    const jsonSpec = {};
                    FOUNDATION_IDS.forEach(id => {
                      const targetDoc = COMPONENT_DOCS[id];
                      if (!targetDoc) return;

                      jsonSpec[id] = {
                        name: targetDoc.name,
                        description: targetDoc.description || '',
                        overview: targetDoc.overview || '',
                        behavior: targetDoc.behavior || '',
                        usage: targetDoc.usage || '',
                        ...(targetDoc.colors ? { colors: targetDoc.colors } : {}),
                        ...(targetDoc.fonts ? { fonts: targetDoc.fonts } : {}),
                        ...(targetDoc.tableHeaders ? { tableHeaders: targetDoc.tableHeaders, tableRows: targetDoc.tableRows } : {}),
                        ...(targetDoc.code ? { code: targetDoc.code } : {})
                      };
                    });

                    jsonContent = JSON.stringify(jsonSpec, null, 2);
                    filename = `pintel-foundation-spec.json`;
                  } else {
                    const targetDoc = COMPONENT_DOCS[componentId];
                    if (!targetDoc) return;

                    const jsonSpec = {
                      id: componentId,
                      name: targetDoc.name,
                      description: targetDoc.description || '',
                      overview: targetDoc.overview || '',
                      behavior: targetDoc.behavior || '',
                      usage: targetDoc.usage || '',
                      ...(targetDoc.whenToUse ? { whenToUse: targetDoc.whenToUse } : {}),
                      ...(targetDoc.related ? { related: targetDoc.related } : {}),
                      ...(targetDoc.combineRule ? { combineRule: targetDoc.combineRule } : {}),
                      designTokens: targetDoc.designTokens || [],
                      properties: targetDoc.webProps || targetDoc.properties || [],
                      csProperties: targetDoc.csProperties || [],
                      codeReferenceWeb: targetDoc.webCode || '',
                      codeReferenceCs: targetDoc.csCode || ''
                    };

                    jsonContent = JSON.stringify(jsonSpec, null, 2);
                    filename = `pintel-${componentId}-spec.json`;
                  }

                  const blob = new Blob([jsonContent], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = filename;
                  link.click();
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  border: '1px solid #00A3FF',
                  borderRadius: '4px',
                  color: '#00A3FF',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,163,255,0.1)' }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                {componentId === 'foundation-overview-default' ? '파운데이션 명세 다운로드 (JSON)' : '명세서 다운로드 (JSON)'}
              </button>
            </div>
          )}
        </div>

        {/* Content Rendering - Active Tab Only */}
        <div className="doc-unified-content" style={{ marginTop: '24px' }}>
          {renderTabContent(activeInnerTab)}
        </div>
      </div>
    </div>
  );
}

/**
 * 설명 텍스트 안의 코드 구문 (PascalCase.PascalCase 패턴)을 클릭 가능한 <code> 링크로 변환 */
function renderDescriptionWithCode(text, onNavigate) {
  if (!text) return null;
  const parts = text.split(/([A-Z][a-z]+(?:\.[A-Z][a-z]+)+)/g);
  return parts.map((part, i) => {
    if (/^[A-Z][a-z]+(?:\.[A-Z][a-z]+)+$/.test(part)) {
      const targetId = nameToId(part);
      if (targetId && onNavigate) {
        return (
          <code
            key={i}
            className="doc-code-link"
            onClick={() => onNavigate(targetId)}
          >
            {part}
          </code>
        );
      }
      return <code key={i}>{part}</code>;
    }
    return part;
  });
}

/**
 * 각 컴포넌트별 실제 UI 구조를 그려주는 모의 컴포넌트
 */
function MockUI({ componentId, componentName, activeSubTab, onNavigate }) {
  if (componentId === 'foundation-overview-default') {
    const [hoveredItem, setHoveredItem] = useState(null);

    const baseMaterials = [
      {
        id: 'color',
        title: 'Color',
        description: '색상의 시각적 일관성을 유지하고 효율적인 디자인 작업을 돕습니다.',
        targetId: 'color-primary'
      },
      {
        id: 'typo',
        title: 'Typography',
        description: '화면의 텍스트를 읽기 쉽고 아름답게 표현하도록 돕습니다.',
        targetId: 'typo-style'
      },
      {
        id: 'grid',
        title: 'Grid',
        description: '일관된 간격 체계를 사용하여 조화로운 비율과 정렬을 만들어냅니다.',
        targetId: 'spacing-style'
      },
      {
        id: 'icons',
        title: 'Icons',
        description: '아이콘을 사용하여 인터페이스를 빠르게 이해하고 탐색할 수 있도록 돕습니다.',
        targetId: 'elevation-style'
      }
    ];

    return (
      <div style={{
        padding: '24px 32px',
        backgroundColor: '#1e1e1e',
        color: '#eeeeee',
        fontFamily: "'Pretendard', 'Inter', sans-serif",
        textAlign: 'left',
        borderRadius: '16px',
        border: '1px solid #2e2e2e',
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
      }}>
        {/* Foundations Header */}
        <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1.5px', color: '#ffffff' }}>Foundations</h1>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#aaaaaa', marginBottom: '36px', maxWidth: '640px' }}>
          모든 디자인 요소의 기반이 되는 가장 원자적인 단위들로 컬러, 타이포그래피, 스페이싱, 그리드 등 시각적 언어의 최소 단위들로 구성됩니다.
        </p>

        {/* 3D Abstract Banner (Pure CSS & SVG Vector Graphic) */}
        <div style={{
          width: '100%',
          height: '180px',
          backgroundColor: '#121212',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          marginBottom: '48px',
          border: '1px solid #2e2e2e'
        }}>
          <svg width="600" height="120" viewBox="0 0 600 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="clayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#c3daf2" />
              </linearGradient>
              <radialGradient id="claySphere" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#dbebfa" />
                <stop offset="100%" stopColor="#abc2db" />
              </radialGradient>
              <linearGradient id="slateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#b3cce6" />
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#4a5568" floodOpacity="0.12"/>
              </filter>
            </defs>

            {/* 1. Star Object */}
            <g transform="translate(80, 60)" filter="url(#shadow)">
              <circle cx="0" cy="0" r="30" fill="#e6f0fa" opacity="0.5"/>
              <path d="M-5 -25 L5 -25 L5 25 L-5 25 Z" fill="url(#clayGrad)" stroke="#4a5568" strokeWidth="1.2" transform="rotate(0)"/>
              <path d="M-5 -25 L5 -25 L5 25 L-5 25 Z" fill="url(#clayGrad)" stroke="#4a5568" strokeWidth="1.2" transform="rotate(45)"/>
              <path d="M-5 -25 L5 -25 L5 25 L-5 25 Z" fill="url(#clayGrad)" stroke="#4a5568" strokeWidth="1.2" transform="rotate(90)"/>
              <path d="M-5 -25 L5 -25 L5 25 L-5 25 Z" fill="url(#clayGrad)" stroke="#4a5568" strokeWidth="1.2" transform="rotate(135)"/>
              <circle cx="0" cy="0" r="7" fill="#f8fafc" stroke="#4a5568" strokeWidth="1.2"/>
            </g>

            {/* Wireframe Overlap circle */}
            <g transform="translate(160, 60)" filter="url(#shadow)">
              <circle cx="0" cy="0" r="28" stroke="#4a5568" strokeWidth="1.2" fill="none" opacity="0.7"/>
              <ellipse cx="0" cy="0" rx="28" ry="10" stroke="#4a5568" strokeWidth="1.2" fill="none" opacity="0.5"/>
              <ellipse cx="0" cy="0" rx="10" ry="28" stroke="#4a5568" strokeWidth="1.2" fill="none" opacity="0.5"/>
            </g>

            {/* 2. Blue Sphere */}
            <circle cx="220" cy="60" r="30" fill="url(#claySphere)" stroke="#4a5568" strokeWidth="1.2" filter="url(#shadow)"/>

            {/* 3. Pink Half Circles */}
            <g transform="translate(310, 60)" filter="url(#shadow)">
              <path d="M-22 -30 C-10 -30 -2 -15 -2 0 C-2 15 -10 30 -22 30 C-22 30 -22 -30 -22 -30 Z" fill="url(#slateGrad)" stroke="#4a5568" strokeWidth="1.2" opacity="0.6"/>
              <path d="M-10 -30 C2 -30 10 -15 10 0 C10 15 2 30 -10 30 C-10 30 -10 -30 -10 -30 Z" fill="url(#slateGrad)" stroke="#4a5568" strokeWidth="1.2" opacity="0.8"/>
              <path d="M2 -30 C14 -30 22 -15 22 0 C22 15 14 30 2 30 C2 30 2 -30 2 -30 Z" fill="url(#clayGrad)" stroke="#4a5568" strokeWidth="1.2"/>
            </g>

            {/* 4. Orange Hourglass/Curve */}
            <g transform="translate(400, 60)" filter="url(#shadow)">
              <path d="M-28 -28 L28 -28 C10 0 10 0 28 28 L-28 28 C-10 0 -10 0 -28 -28 Z" fill="url(#clayGrad)" stroke="#4a5568" strokeWidth="1.2" opacity="0.8"/>
              <path d="M-28 -28 C-10 -10 10 -10 28 -28 L28 -18 C10 0 -10 0 -28 -18 Z" fill="url(#clayGrad)" stroke="#4a5568" strokeWidth="1.2"/>
              <path d="M-28 28 C-10 10 10 10 28 28 L28 18 C10 0 -10 0 -28 18 Z" fill="url(#clayGrad)" stroke="#4a5568" strokeWidth="1.2"/>
            </g>

            {/* 5. Purple Sphere */}
            <circle cx="490" cy="60" r="30" fill="url(#claySphere)" stroke="#4a5568" strokeWidth="1.2" filter="url(#shadow)"/>
          </svg>
        </div>

        {/* Base Material List */}
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#0f0f11', letterSpacing: '-0.5px' }}>Base material</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {baseMaterials.map((item) => {
            const isHovered = hoveredItem === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => onNavigate && onNavigate(item.targetId)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  margin: '6px 0',
                  cursor: 'pointer',
                  backgroundColor: isHovered ? '#f0f7ff' : 'transparent',
                  transition: 'background-color 0.2s, transform 0.2s'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: isHovered ? '#0066FF' : '#1f2937',
                    transition: 'color 0.2s'
                  }}>
                    {item.title}
                  </span>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    {item.description}
                  </span>
                </div>
                
                {/* Arrow indicator (only visible on hover) */}
                <div style={{
                  fontSize: '20px',
                  color: '#0066FF',
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateX(0)' : 'translateX(-8px)',
                  transition: 'opacity 0.25s ease, transform 0.25s ease',
                  paddingRight: '8px'
                }}>
                  ➔
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (componentId === 'intersection-overview-default') {
    return <IntersectionOverviewPlayground />;
  }
  if (componentId === 'intersection-overlay-default') {
    return <IntersectionOverlayPlayground />;
  }
  if (componentId === 'signal-queue-default') {
    return <SignalQueuePlayground />;
  }
  if (componentId === 'traffic-flow-default') {
    return <TrafficFlowChartPlayground />;
  }
  if (componentId === 'selective-overview-default') {
    return <SelectiveOverviewPlayground />;
  }
  if (componentId === 'detected-targets-default') {
    return <DetectedTargetsPlayground />;
  }
  if (componentId === 'camera-radius-default') {
    return <CameraRadiusPlayground />;
  }
  if (componentId === 'event-grid-default') {
    return <EventGridPlayground />;
  }
  if (componentId === 'pedestrian-overview-default') {
    return <PedestrianOverviewPlayground />;
  }
  if (componentId === 'pedestrian-sensor-default') {
    return <PedestrianSensorPlayground />;
  }
  if (componentId === 'actuated-countdown-default') {
    return <ActuatedCountdownPlayground />;
  }
  if (componentId === 'audio-control-default') {
    return <AudioControlPlayground />;
  }
  if (componentId === 'schoolzone-overview-default') {
    return <SchoolzoneOverviewPlayground />;
  }
  if (componentId === 'speed-limit-default') {
    return <SpeedLimitPlayground />;
  }
  if (componentId === 'illegal-parking-default') {
    return <IllegalParkingPlayground />;
  }
  if (componentId === 'crosswalk-warning-default') {
    return <CrosswalkWarningPlayground />;
  }
  if (componentId === 'content-badge-default') {
    return <ContentBadgePlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'play-button-default') {
    return <PlayButtonPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'framed-style-default') {
    return <FramedStylePlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'field-search') {
    return <SearchFieldPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'field-textarea') {
    return <TextAreaPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'field-text') {
    return <TextFieldPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'control-radio') {
    return <RadioPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'control-select') {
    return <SelectPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'control-slider') {
    return <SliderPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'control-switch') {
    return <SwitchPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'present-tooltip') {
    return <TooltipPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'present-popup') {
    return <PopupPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'present-menu') {
    return <ContextMenuPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'present-popover') {
    return <PopoverPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'nav-progress-tracker') {
    return <ProgressTrackerPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'nav-top') {
    return <TopNavigationPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'nav-pagination-dots') {
    return <PaginationDotsPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'nav-tab') {
    return <TabPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'nav-page-counter') {
    return <PageCounterPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'nav-pagination') {
    return <PaginationPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'nav-progress-indicator') {
    return <ProgressIndicatorPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'present-autocomplete') {
    return <AutocompletePlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'feedback-fallback') {
    return <FallbackViewPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'loading-skeleton') {
    return <SkeletonPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'feedback-section-message') {
    return <SectionMessagePlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'alert-default') {
    return <AlertPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'feedback-pushbadge') {
    return <PushBadgePlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'loading-default') {
    return <LoadingPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId && componentId.startsWith('accordion-')) {
    return <AccordionPlayground componentId={componentId} activeSubTab={activeSubTab} />;
  }
  if (componentId === 'avatar-default') {
    return <AvatarPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'avatar-group-default') {
    return <AvatarGroupPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'action-area-default') {
    return <ActionAreaPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'toast-default') {
    return <ToastPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'button-primary') {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '32px', padding: '16px' }}>
        <div className="btn-matrix-container">
          <div className="btn-matrix-grid">
            {/* Headers */}
            <div className="btn-matrix-label"></div>
            <div className="btn-matrix-label" style={{ textAlign: 'center' }}>Primary Solid</div>
            <div className="btn-matrix-label" style={{ textAlign: 'center' }}>Secondary Solid</div>
            <div className="btn-matrix-label" style={{ textAlign: 'center' }}>Primary Outline</div>
            <div className="btn-matrix-label" style={{ textAlign: 'center' }}>Secondary Outline</div>

            {/* Normal Row */}
            <div className="btn-matrix-label">Normal</div>
            <div className="btn-matrix-cell">
              <div className="ds-btn-demo primary-solid state-normal">Normal</div>
            </div>
            <div className="btn-matrix-cell">
              <div className="ds-btn-demo secondary-solid state-normal">Normal</div>
            </div>
            <div className="btn-matrix-cell">
              <div className="ds-btn-demo primary-outline state-normal">Normal</div>
            </div>
            <div className="btn-matrix-cell">
              <div className="ds-btn-demo secondary-outline state-normal">Normal</div>
            </div>

            {/* Hovered Row */}
            <div className="btn-matrix-label">Hovered</div>
            <div className="btn-matrix-cell">
              <div className="ds-btn-demo primary-solid state-hovered">Hovered</div>
            </div>
            <div className="btn-matrix-cell">
              <div className="ds-btn-demo secondary-solid state-hovered">Hovered</div>
            </div>
            <div className="btn-matrix-cell">
              <div className="ds-btn-demo primary-outline state-hovered">Hovered</div>
            </div>
            <div className="btn-matrix-cell">
              <div className="ds-btn-demo secondary-outline state-hovered">Hovered</div>
            </div>

            {/* Pressed Row */}
            <div className="btn-matrix-label">Pressed</div>
            <div className="btn-matrix-cell">
              <div className="ds-btn-demo primary-solid state-pressed">Pressed</div>
            </div>
            <div className="btn-matrix-cell">
              <div className="ds-btn-demo secondary-solid state-pressed">Pressed</div>
            </div>
            <div className="btn-matrix-cell">
              <div className="ds-btn-demo primary-outline state-pressed">Pressed</div>
            </div>
            <div className="btn-matrix-cell">
              <div className="ds-btn-demo secondary-outline state-pressed">Pressed</div>
            </div>

            {/* Disabled Row */}
            <div className="btn-matrix-label">Disabled</div>
            <div className="btn-matrix-cell">
              <div className="ds-btn-demo primary-solid state-disabled">Disabled</div>
            </div>
            <div className="btn-matrix-cell">
              <div className="ds-btn-demo secondary-solid state-disabled">Disabled</div>
            </div>
            <div className="btn-matrix-cell">
              <div className="ds-btn-demo primary-outline state-disabled">Disabled</div>
            </div>
            <div className="btn-matrix-cell">
              <div className="ds-btn-demo secondary-outline state-disabled">Disabled</div>
            </div>
          </div>
        </div>

        <div className="btn-playground-container">
          <div className="btn-playground-title">Interactive Playground (Hover & Click to test)</div>
          <div className="btn-playground-row">
            <button className="ds-btn-interactive primary-solid">Primary Solid</button>
            <button className="ds-btn-interactive secondary-solid">Secondary Solid</button>
            <button className="ds-btn-interactive primary-outline">Primary Outline</button>
            <button className="ds-btn-interactive secondary-outline">Secondary Outline</button>
          </div>
        </div>
      </div>
    );
  }
  if (componentId === 'chip-closeable') {
    return <ChipPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'control-checkmark') {
    return <CheckmarkPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'control-segmented') {
    return <SegmentedControlPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'control-datepicker') {
    return <DatePickerPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'control-checkbox') {
    return <CheckboxPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'filter-button-default') {
    return <FilterButtonPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'banner-summary') {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ borderLeft: '4px solid #f59e0b', backgroundColor: '#2b2b2b', padding: '16px 20px', color: '#fff', width: '100%', maxWidth: '400px', borderRadius: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#f59e0b', fontSize: '15px', fontWeight: 'bold', marginBottom: '8px' }}><FigTrendingUp size={18} style={{ marginRight: '6px' }} /> 16건 +77% 증가 <span style={{ fontSize: '12px', color: '#888', fontWeight: 'normal', marginLeft: '8px' }}>야간 집중</span></div>
          <div style={{ fontSize: '12px', color: '#888' }}>비교 기준: 직전 4주 같은 요일 평균 (2026.04.02 - 04.29)</div>
        </div>
      </div>
    );
  }
  if (componentId === 'list-checkable') {
    return <ListCheckablePlayground />;
  }
  if (componentId === 'list-cell-default') {
    return <ListCellPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'list-card-default') {
    return <ListCardPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'section-header-default') {
    return <SectionHeaderPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'table-default') {
    return <TablePlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'chart-mixed') {
    return (
      <div style={{ padding: '32px', backgroundColor: '#2b2b2b', borderRadius: '8px', width: '100%', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginBottom: '40px', fontSize: '13px', color: '#bbb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0066FF' }}></div> 평균</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b' }}></div> 전일 차이</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '16px', height: '0px', borderTop: '2px dashed #bbb', position: 'relative' }}><div style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#fff', top: '-3px', left: '6px' }}></div></div> 비교 기준</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px' }}>
          <div style={{ width: '8%', height: '40%', background: 'linear-gradient(to bottom, rgba(0, 102, 255,0.8), transparent)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
          <div style={{ width: '8%', height: '60%', background: 'linear-gradient(to bottom, rgba(0, 102, 255,0.8), transparent)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
          <div style={{ width: '8%', height: '80%', background: 'linear-gradient(to bottom, rgba(0, 102, 255,0.8), transparent)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
          <div style={{ width: '8%', height: '50%', background: 'linear-gradient(to bottom, rgba(0, 102, 255,0.8), transparent)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
          <div style={{ position: 'relative', width: '8%', height: '75%', background: '#f59e0b', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
            <span style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', color: '#f59e0b', fontSize: '14px', fontWeight: 'bold' }}>23</span>
          </div>
          <div style={{ width: '8%', height: '45%', background: 'linear-gradient(to bottom, rgba(0, 102, 255,0.8), transparent)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
          <div style={{ width: '8%', height: '30%', background: 'linear-gradient(to bottom, rgba(0, 102, 255,0.8), transparent)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
          <div style={{ width: '8%', height: '20%', background: 'linear-gradient(to bottom, rgba(0, 102, 255,0.8), transparent)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
        </div>
      </div>
    );
  }
  if (componentId === 'card-panel') {
    return <CardPlayground activeSubTab={activeSubTab} />;
  }

  if (componentId === 'button-icon') {
    return <IconButtonPlayground activeSubTab={activeSubTab} />;
  }

  if (componentId === 'category-default') {
    return <CategoryPlayground activeSubTab={activeSubTab} />;
  }

  if (componentId === 'button-text') {
    if (activeSubTab === 'anatomy') {
      return (
        <div style={{ width: '100%' }}>
          {/* 라이트 카드 */}
          <div style={{
            position: 'relative',
            background: '#efefef',
            borderRadius: '16px',
            width: '720px',
            height: '340px',
            margin: '0 auto 24px',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}>
            {/* 텍스트 버튼 컴포넌트 — 중앙 */}
            <div style={{
              position: 'absolute',
              left: '300px',
              top: '150px',
              width: '120px',
              height: '36px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: '#1ED45A',
              fontSize: '12px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box',
              zIndex: 3,
            }}>
              EXCEL
            </div>

            {/* SVG 직선 */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
            >
              {/* 1. Area Bounds -> 수평선 좌측으로 */}
              <line x1="220" y1="168" x2="298" y2="168" stroke="#999" strokeWidth="1.2" />
              {/* 2. Text Style -> 수직선 위로 */}
              <line x1="360" y1="70" x2="360" y2="148" stroke="#999" strokeWidth="1.2" />
              {/* 3. Hover Effect -> 수직선 아래로 */}
              <line x1="360" y1="270" x2="360" y2="188" stroke="#999" strokeWidth="1.2" />
            </svg>

            {/* Callouts */}
            <div style={{ position: 'absolute', left: '220px', top: '168px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
            <div style={{ position: 'absolute', left: '360px', top: '70px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
            <div style={{ position: 'absolute', left: '360px', top: '270px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>
          </div>

          {/* Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 0' }}>
            {[
              { num: 1, label: 'Interactive Area (배경 및 테두리 없는 투명 영역)' },
              { num: 2, label: 'Text Style (12px, Bold, Positive 색상 #1ED45A)' },
              { num: 3, label: 'Hover Feedback (호버 시 불투명도 조절 또는 밝기 피드백)' }
            ].map(item => (
              <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
                {item.num}. {item.label}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <TextButtonPlayground activeSubTab={activeSubTab} />;
  }

  // default fallback
  return (
    <div className="doc-anatomy-placeholder">
      [ {componentName} ]<br /><br />
      <span style={{ fontSize: '12px', fontWeight: 400 }}>
        실제 컴포넌트 구조의 Anatomy 이미지가 들어갈 영역입니다.<br />
        현재는 플레이스홀더 박스로 대체되었습니다.
      </span>
    </div>
  );
}

// 공원 관제 CCTV 스냅샷(벡터) — 하늘·잔디·산책로·나무·벤치·보행자 + 디텍션 박스·타임스탬프·카메라 라벨.
function ParkCctvScene() {
  return (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="pkSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b9d4ef" /><stop offset="1" stopColor="#d9e8f4" /></linearGradient>
        <linearGradient id="pkGrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#88b563" /><stop offset="1" stopColor="#5f9243" /></linearGradient>
      </defs>
      {/* 하늘 */}
      <rect width="320" height="78" fill="url(#pkSky)" />
      {/* 원경 나무 능선 */}
      <path d="M0 70 Q 40 52 80 66 T 160 60 T 240 66 T 320 58 L320 84 L0 84 Z" fill="#9cc07f" opacity="0.85" />
      {/* 잔디 */}
      <rect y="72" width="320" height="108" fill="url(#pkGrass)" />
      {/* 산책로 */}
      <path d="M-10 182 C 70 150 120 150 175 120 C 215 98 245 92 265 90 L 300 92 L 300 104 C 250 104 210 112 180 132 C 130 162 90 176 40 182 Z" fill="#dccfb2" />
      {/* 나무(좌) */}
      <rect x="42" y="70" width="5" height="22" rx="1" fill="#7a5a3a" />
      <circle cx="44.5" cy="58" r="18" fill="#5a8f42" /><circle cx="34" cy="64" r="12" fill="#659a4b" /><circle cx="55" cy="64" r="12" fill="#548a3e" />
      {/* 나무(우) */}
      <rect x="278" y="66" width="5" height="24" rx="1" fill="#7a5a3a" />
      <circle cx="280.5" cy="52" r="20" fill="#568b40" /><circle cx="268" cy="60" r="13" fill="#639848" /><circle cx="293" cy="60" r="13" fill="#4f8a3c" />
      {/* 벤치 */}
      <g transform="translate(232 116)"><rect x="0" y="4" width="26" height="4" rx="1" fill="#8a6b45" /><rect x="0" y="-4" width="26" height="4" rx="1" fill="#9a7a52" /><rect x="1" y="8" width="3" height="7" fill="#6b5335" /><rect x="22" y="8" width="3" height="7" fill="#6b5335" /></g>
      {/* 보행자 B(원경) */}
      <g transform="translate(176 92)"><circle cx="0" cy="0" r="3" fill="#3a3f47" /><path d="M-3 3 Q0 2 3 3 L2 15 L-2 15 Z" fill="#4a86c9" /></g>
      {/* 보행자 A(근경) */}
      <g transform="translate(78 118)"><circle cx="0" cy="0" r="4.5" fill="#3a3f47" /><path d="M-5 4 Q0 3 5 4 L4 24 L-4 24 Z" fill="#c96a5a" /><rect x="-4" y="24" width="3.2" height="10" fill="#3a4048" /><rect x="0.8" y="24" width="3.2" height="10" fill="#3a4048" /></g>
      {/* 관제 디텍션 박스 */}
      <rect x="66" y="110" width="24" height="50" rx="2" fill="none" stroke="#22d3ee" strokeWidth="1.4" strokeDasharray="4 2.5" />
      <rect x="66" y="102.5" width="34" height="8" rx="1.5" fill="#22d3ee" />
      <text x="69" y="108.8" fontFamily="monospace" fontSize="6" fontWeight="bold" fill="#06333b">PERSON</text>
      {/* CCTV 타임스탬프·카메라 라벨 */}
      <text x="8" y="172" fontFamily="monospace" fontSize="8" fill="#ffffff" opacity="0.92">2026.07.10 14:22:31</text>
      <text x="312" y="172" textAnchor="end" fontFamily="monospace" fontSize="7.5" fill="#e6f0ff" opacity="0.85">PARK-CAM 03</text>
    </svg>
  );
}
// Play button(play-button-default) — 영상 스냅샷(썸네일) 위에 올라오는 원형 재생 버튼 오버레이.
//  프로스트 화이트 원 + Primary play 삼각형. 재생 시 pause로 전환. 스냅샷 클릭 = 영상 재생 진입점.
function PlayButton({ size = 56, playing = false, hovered = false }) {
  const ic = Math.round(size * 0.42);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      width: `${size}px`, height: `${size}px`, borderRadius: '50%',
      background: hovered ? '#ffffff' : 'rgba(255,255,255,0.92)',
      boxShadow: hovered ? '0 6px 20px rgba(0,0,0,0.35)' : '0 4px 14px rgba(0,0,0,0.28)',
      transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'all 0.16s ease',
      backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
    }}>
      <Icon name={playing ? 'pause' : 'play'} size={ic} color={T.primary} style={{ marginLeft: playing ? 0 : `${Math.round(size * 0.03)}px` }} />
    </span>
  );
}
function VideoThumb({ w = 320, size = 56, playing = false, hovered = false, onClick, onEnter, onLeave, label, schematic = false }) {
  return (
    <div onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave} style={{
      position: 'relative', width: `${w}px`, aspectRatio: '16 / 9', borderRadius: '10px', overflow: 'hidden',
      background: schematic ? 'linear-gradient(135deg, #cdd4dc, #aab3bd)' : '#2a2f38',
      cursor: onClick ? 'pointer' : 'default', flexShrink: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
    }}>
      {schematic ? (
        <>
          {/* 스냅샷 플레이스홀더(추상) — 점선 프레임 + 흐린 이미지 아이콘 */}
          <div style={{ position: 'absolute', inset: '8px', border: '1.5px dashed rgba(255,255,255,0.5)', borderRadius: '6px' }} />
          <svg style={{ position: 'absolute', left: '10px', top: '10px', opacity: 0.5 }} width={Math.round(w * 0.11)} height={Math.round(w * 0.11)} viewBox="0 0 24 24" fill="none" stroke="#5c6773" strokeWidth="1.4"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.6" /><path d="M21 15l-5-5L5 21" /></svg>
        </>
      ) : <ParkCctvScene />}
      <div style={{ position: 'absolute', inset: 0, background: schematic ? 'rgba(0,0,0,0.10)' : 'rgba(0,0,0,0.22)' }} />
      {label && !schematic && <span style={{ position: 'absolute', left: SP[8], top: SP[8], padding: `2px ${SP[8]}`, borderRadius: '4px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '11px', fontWeight: W.semibold, letterSpacing: '0.02em' }}>{label}</span>}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PlayButton size={size} playing={playing} hovered={hovered} />
      </div>
    </div>
  );
}
function PlayButtonPlayground({ activeSubTab }) {
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);

  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
        {/* Anatomy — 표준 템플릿(AnatomyFrame) 사용 */}
        <AnatomyFrame
          card={{ w: 720, h: 360 }}
          callouts={[
            { n: 1, x: 300, y: 52, line: { x1: 300, y1: 66, x2: 300, y2: 94 } },
            { n: 2, x: 150, y: 130, line: { x1: 164, y1: 130, x2: 208, y2: 130 } },
            { n: 3, x: 580, y: 180, line: { x1: 566, y1: 180, x2: 394, y2: 180 }, dot: true },
            { n: 4, x: 360, y: 316, line: { x1: 360, y1: 302, x2: 360, y2: 197 }, dot: true },
          ]}
          legend={[
            { n: 1, label: 'Snapshot (영상 스냅샷)' },
            { n: 2, label: 'Scrim (가독성 오버레이)' },
            { n: 3, label: 'Play button (원형 재생 버튼)' },
            { n: 4, label: 'Play icon (재생 삼각형)' },
          ]}
          legendCols={4}
          dims={[{ dir: 'h', x: 328, y: 180, length: 64, label: '64px' }]}
          spec={{ rows: [
            ['버튼 지름', '—', '56', '기본 Medium(Small 40·Large 72)'],
            ['아이콘 크기', '—', '≈42%', '버튼 지름 대비'],
            ['스크림 불투명도', '—', '18%', 'rgba(0,0,0,0.18) 가독성 확보'],
            ['모서리 반경', 'radius', '10', '썸네일 border-radius'],
          ], note: '※ 버튼은 SP 스케일이 아닌 미디어 컨트롤 규격(지름 40/56/72)입니다.' }}
        >
          <div style={{ position: 'absolute', left: '210px', top: '96px', zIndex: 2 }}>
            <VideoThumb w={300} size={64} schematic />
          </div>
        </AnatomyFrame>
        <div style={{ fontSize: TYPE.label1.fontSize, color: '#888', lineHeight: '1.7', marginBottom: SP[48] }}>
          영상 스냅샷 위에 <span style={{ color: '#60a5fa', fontWeight: W.semibold }}>원형 재생 버튼</span>이 중앙 정렬로 올라옵니다. 클릭 시 해당 채널 영상 재생으로 진입하며, 스냅샷 위에서도 잘 보이도록 어두운 스크림을 함께 사용합니다. 프로스트 화이트 원 + Primary 재생 삼각형(재생 중 pause 전환).
        </div>
        {/* Size — sm/md/lg */}
        <div style={{ marginBottom: SP[48] }}>
          <div style={{ fontSize: TYPE.heading2.fontSize, fontWeight: W.bold, color: '#fff', marginBottom: '20px' }}>Size</div>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '40px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: SP[40], flexWrap: 'wrap' }}>
            {[
              { name: 'Small', w: 200, size: 40, use: '리스트 썸네일·조밀한 그리드' },
              { name: 'Medium', w: 280, size: 56, use: '기본값 · 카드/패널 미리보기' },
              { name: 'Large', w: 340, size: 72, use: '단독 히어로·상세 뷰' },
            ].map((s) => (
              <div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP[12], maxWidth: `${s.w}px` }}>
                <VideoThumb w={s.w} size={s.size} schematic />
                <span style={{ fontSize: TYPE.label2.fontSize, color: '#888', textAlign: 'center', lineHeight: 1.5 }}>{s.name} · {s.size}px<br /><span style={{ color: '#666' }}>{s.use}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Interactive — 스냅샷 클릭 시 재생(play)↔일시정지(pause), 호버 시 버튼 강조
  return (
    <div style={{ width: '100%' }}>
      <div style={{ background: '#202024', borderRadius: '20px', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: SP[16], padding: '32px 0' }}>
        <VideoThumb w={420} size={64} playing={playing} hovered={hovered}
          onClick={() => setPlaying((v) => !v)}
          onEnter={() => setHovered(true)} onLeave={() => setHovered(false)} />
        <div style={{ fontSize: TYPE.label2.fontSize, color: '#8a8a92' }}>썸네일 클릭 = 재생 ↔ 일시정지 · 호버 시 버튼 강조</div>
      </div>
    </div>
  );
}
function ContentBadgePlayground({ activeSubTab }) {
  const [level, setLevel] = useState(4); // Variants = Hierarchy Level(1~4)
  const [leadingIcon, setLeadingIcon] = useState(true);
  const [trailingIcon, setTrailingIcon] = useState(true);

  if (activeSubTab === 'anatomy') {
    return (
      <AnatomyFrame
        card={{ w: 720, h: 340 }}
        linesBehind
        callouts={[
          { n: 1, x: 230, y: 170, line: { x1: 230, y1: 170, x2: 308, y2: 170 } },
          { n: 2, x: 360, y: 90, line: { x1: 360, y1: 90, x2: 360, y2: 150 } },
          { n: 3, x: 490, y: 170, line: { x1: 490, y1: 170, x2: 412, y2: 170 } },
          { n: 4, x: 360, y: 250, line: { x1: 360, y1: 250, x2: 360, y2: 189 } },
        ]}
        dims={[
          { pad: { x: 301, y: 157, w: 118, h: 26, t: 4, l: 8 } },
          { dir: 'h', x: 301.5, y: 170, sp: 8 },
          { dir: 'v', x: 392, y: 157.5, sp: 4 },
        ]}
        legend={[
          { n: 1, label: 'Leading icon' },
          { n: 2, label: 'Label' },
          { n: 3, label: 'Trailing icon' },
          { n: 4, label: 'Container' },
        ]}
        spec={{ rows: [
          ['가로 패딩(아이콘 有)', 'SP[8]', '8', '좌우 내부 여백'],
          ['가로 패딩(아이콘 無)', 'SP[12]', '12', '아이콘 없을 때 좌우'],
          ['세로 패딩', 'SP[4]', '4', '상하 내부 여백'],
          ['아이콘↔라벨 간격', 'SP[4]', '4', '내부 요소 간격'],
          ['모서리 반경', 'radius', '6', 'border-radius'],
          ['높이', 'xs20 / sm24 / md28', '28', '이 예시 = Medium'],
        ], note: '※ 정본: MCP get_component(Content badge). 간격 전부 SP 스케일(4/8pt)로 정규화 완료.' }}
      >
          {/* 배지 컴포넌트 — 중앙 */}
          <div style={{
            position: 'absolute',
            left: '300px',
            top: '156px',
            width: '120px',
            height: '28px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: SP[4],
            padding: '4px 8px',
            borderRadius: '6px',
            background: '#ffffff',
            border: '1.5px solid #e4e4e7',
            color: '#18181b',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            zIndex: 3,
          }}>
            <div style={{ width: '12px', height: '12px', border: '1.5px dashed #a1a1aa', borderRadius: '2px', flexShrink: 0 }} />
            <span style={{ fontWeight: W.medium, lineHeight: 1 }}>Label</span>
            <span style={{ fontSize: TYPE.label1.fontSize, color: '#a1a1aa', flexShrink: 0, marginLeft: 'auto', lineHeight: 1, userSelect: 'none' }}>×</span>
          </div>

      </AnatomyFrame>
    );
  }


  // Interactive Tab Content
  // 위계(Hierarchy) 4단계 — 강조도 내림차순. Accent(브랜드)/Neutral × 채움/외곽 조합.
  const HIER = [
    { level: 4, variant: 'accent-filled',   desc: '화면 내에서 가장 중요하고 주목도 높은 정보를 강조하여 전달합니다.' },
    { level: 3, variant: 'accent-outline',  desc: '주요 정보 다음으로 사용자의 주목을 끌 필요가 있는 긍정적이거나 중요한 상태를 나타냅니다.' },
    { level: 2, variant: 'neutral-filled',  desc: '콘텐츠의 일반적인 상태나 분류 정보를 중립적으로 표시합니다.' },
    { level: 1, variant: 'neutral-outline', desc: '가장 낮은 우선순위의 부가 정보를 표시할 때 사용합니다.' },
  ];
  const hierBadgeStyle = (variant) => {
    const base = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '24px', minWidth: '52px', padding: '0 10px', borderRadius: '6px', fontSize: TYPE.caption1.fontSize, fontWeight: W.semibold, whiteSpace: 'nowrap', boxSizing: 'border-box', flexShrink: 0 };
    switch (variant) {
      case 'accent-filled':   return { ...base, background: T.primary, color: '#fff', border: `1px solid ${T.primary}` };
      case 'accent-outline':  return { ...base, background: 'transparent', color: T.primaryStrong, border: `1px solid ${T.primaryStrong}` };
      case 'neutral-filled':  return { ...base, background: '#3f3f46', color: '#e4e4e7', border: '1px solid #3f3f46' };
      case 'neutral-outline': return { ...base, background: 'transparent', color: '#a1a1aa', border: '1px solid #52525b' };
      default: return base;
    }
  };

  // Variants 프리뷰 색 = 선택한 Level의 위계 스타일을 그대로 반영(채움/외곽 × Accent/Neutral)
  const lvObj = HIER.find(h => h.level === level) || HIER[0];
  const bs = hierBadgeStyle(lvObj.variant);
  const badgeBg = bs.background;
  const badgeBorder = bs.border;
  const badgeColor = bs.color;
  const iconBorderColor = bs.color;

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>

      {/* ── Hierarchy 섹션 ── */}
      <div style={{ marginBottom: SP[48] }}>
        <div style={{ fontSize: TYPE.heading2.fontSize, fontWeight: W.bold, color: '#fff', marginBottom: '20px' }}>Hierarchy</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {HIER.map((lv, i) => (
            <div key={lv.level} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '14px 4px', borderTop: i === 0 ? 'none' : '1px solid #232323' }}>
              <span style={hierBadgeStyle(lv.variant)}>Badge</span>
              <span style={{ fontSize: TYPE.label1.fontSize, color: '#c9c9cf', lineHeight: '1.6' }}>
                <b style={{ color: '#fff', fontWeight: W.bold }}>Level.{lv.level}</b> → {lv.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Color 섹션 ── */}
      <div style={{ marginBottom: SP[48] }}>
        <div style={{ fontSize: TYPE.heading2.fontSize, fontWeight: W.bold, color: '#fff', marginBottom: '20px' }}>Color customize</div>

        {/* 라이트 카드 — Neutral / Accent / Status 행 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '36px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: SP[24],
          marginBottom: SP[16],
        }}>
          {(() => {
            // 토큰 기반 배지: 배경 = 색상 13% 틴트, 전경 = 색상값(Accent/Foreground)
            const tint = (hex) => `${hex}22`;
            const colorBadge = (bg, fg, label) => (
              <span key={label} style={{
                display: 'inline-flex', alignItems: 'center', height: '26px', padding: '0 12px',
                borderRadius: '8px', background: bg, color: fg,
                fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, whiteSpace: 'nowrap', letterSpacing: '-0.1px',
              }}>{label}</span>
            );

            // Neutral — 명도 위계 (Assistive → Strong)
            const NEUTRAL = [
              { label: 'Assistive',   bg: '#f1f1f3', fg: '#bcbcc2' },
              { label: 'Alternative', bg: '#eeeef0', fg: '#9a9aa2' },
              { label: 'Neutral',     bg: '#e9e9ec', fg: '#71717a' },
              { label: 'Normal',      bg: '#e4e4e7', fg: '#3f3f46' },
              { label: 'Strong',      bg: '#e0e0e4', fg: '#18181b' },
            ];
            // Accent — 토큰에서 선택 (구별용 강조색)
            const accentLabels = {
              accentRedOrange: 'Red Orange', accentLime: 'Lime', accentCyan: 'Cyan',
              accentLightBlue: 'Light Blue', accentViolet: 'Violet',
            };
            const ACCENT = Object.keys(accentLabels).map((key) => {
              const c = COLOR_ACCENT.find((a) => a.key === key);
              return { label: accentLabels[key], bg: tint(c.value), fg: c.value };
            });
            // Status — 상태 시맨틱 (Positive / Cautionary / Negative) + 정보(Primary)
            const STATUS = [
              { label: 'Positive',    color: COLOR_STATUS[0].value },
              { label: 'Cautionary',  color: COLOR_STATUS[1].value },
              { label: 'Negative',    color: COLOR_STATUS[2].value },
              { label: 'Information', color: T.primary },
            ].map((s) => ({ label: s.label, bg: tint(s.color), fg: s.color }));

            const Row = ({ name, items }) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: SP[40] }}>
                <span style={{ width: '64px', flexShrink: 0, fontSize: TYPE.label1.fontSize, fontWeight: W.medium, color: '#9a9aa2' }}>{name}</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP[12] }}>
                  {items.map((it) => colorBadge(it.bg, it.fg, it.label))}
                </div>
              </div>
            );

            return (
              <>
                <Row name="Neutral" items={NEUTRAL} />
                <Row name="Accent" items={ACCENT} />
                <Row name="Status" items={STATUS} />
              </>
            );
          })()}
        </div>

        {/* 설명 */}
        <div style={{ fontSize: TYPE.label1.fontSize, color: '#888', lineHeight: '1.7' }}>
          Neutral, Accent, Status 컬러를 사용하여 부가 정보를 제공하거나 상태를 더욱 명확하게 표현합니다.{' '}
          Accent 컬러를 사용할 때 배경과 텍스트의 최소 명도 대비를 보장하기 위해{' '}
          <span style={{ color: '#60a5fa', fontWeight: W.semibold }}>Accent/Foreground 색상</span>을 사용합니다.
        </div>
      </div>

      {/* ── Size 섹션 ── */}
      <div style={{ marginBottom: SP[48] }}>
        <div style={{ fontSize: TYPE.heading2.fontSize, fontWeight: W.bold, color: '#fff', marginBottom: '20px' }}>Size</div>

        {/* 라이트 카드 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '48px 40px 40px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: SP[40],
          marginBottom: SP[16],
        }}>
          {[
            { label: 'XSmall', h: 20, fs: 11, px: '0 6px',  annotSize: 20, use: '테이블 셀·리스트 등 조밀한 영역의 인라인 카운트/상태 표시' },
            { label: 'Small',  h: 24, fs: 12, px: '0 8px',  annotSize: 22, use: '기본값. 카드·폼·필터 등 대부분의 일반 UI에서 가장 널리 사용' },
            { label: 'Medium', h: 28, fs: 13, px: '0 10px', annotSize: 24, use: '헤더·툴바 등 단독으로 노출되어 높은 주목도가 필요한 영역' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP[16], width: '180px' }}>
              {/* 컬럼 라벨 */}
              <div style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#888' }}>{item.label}</div>

              {/* 배지 + annotation */}
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                {/* 배지 컴포넌트 */}
                <div style={{
                  height: `${item.h}px`,
                  padding: item.px,
                  borderRadius: '4px',
                  background: '#f4f4f5',
                  border: '1px solid #e4e4e7',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: `${item.fs}px`,
                  fontWeight: W.medium,
                  color: '#666',
                  whiteSpace: 'nowrap',
                  letterSpacing: '-0.1px',
                }}>Badge</div>

                {/* 높이 annotation 뱃지 */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  right: `-${item.annotSize / 2 + 4}px`,
                  transform: 'translateY(-50%)',
                  width: `${item.annotSize}px`,
                  height: `${item.annotSize}px`,
                  borderRadius: '50%',
                  background: '#EF4444',
                  color: '#fff',
                  fontSize: `${item.fs - 2}px`,
                  fontWeight: W.bold,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 4px rgba(239,68,68,0.4)',
                  border: '1.5px solid #fff',
                  zIndex: 2,
                }}>{item.h}</div>
              </div>

              {/* 사이즈별 용처 */}
              <div style={{ marginTop: SP[4], fontSize: TYPE.caption1.fontSize, color: '#9a9aa2', lineHeight: '1.5', textAlign: 'center' }}>
                {item.use}
              </div>
            </div>
          ))}
        </div>

        {/* 설명 */}
        <div style={{ fontSize: TYPE.label1.fontSize, color: '#888', lineHeight: '1.7' }}>
          좌우 사이즈는 자유롭게 커스터마이징하여 사용할 수 있으나{' '}
          <span style={{ color: '#60a5fa', fontWeight: W.semibold }}>높이는 고정하여 사용합니다.</span>
        </div>
      </div>

      {/* ── Spacing 섹션 ── */}
      <div style={{ marginBottom: SP[48] }}>
        <div style={{ fontSize: TYPE.heading2.fontSize, fontWeight: W.bold, color: '#fff', marginBottom: '20px' }}>Spacing</div>

        {/* 라이트 카드 — 사이즈별 나열 간격 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '48px 40px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: SP[40],
          marginBottom: SP[16],
        }}>
          {[
            { label: 'XSmall', h: 20, fs: 11, px: '0 6px', gap: 6, annotSize: 20 },
            { label: 'Small',  h: 24, fs: 12, px: '0 8px', gap: 6, annotSize: 22 },
            { label: 'Medium', h: 28, fs: 13, px: '0 10px', gap: 8, annotSize: 24 },
          ].map(item => {
            const badge = (
              <div style={{
                height: `${item.h}px`,
                padding: item.px,
                borderRadius: '4px',
                background: '#f4f4f5',
                border: '1px solid #e4e4e7',
                display: 'flex',
                alignItems: 'center',
                fontSize: `${item.fs}px`,
                fontWeight: W.medium,
                color: '#666',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.1px',
              }}>Badge</div>
            );
            return (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '180px' }}>
                {/* 컬럼 라벨 */}
                <div style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#888' }}>{item.label}</div>

                {/* 배지 2개 + 간격 마커/annotation */}
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: `${item.gap}px` }}>
                  {badge}
                  {/* 간격 마커(빨간 세로선) */}
                  <span style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '2px',
                    height: `${item.h}px`,
                    background: '#EF4444',
                    borderRadius: '1px',
                  }} />
                  {badge}
                  {/* 간격 값 annotation 뱃지 */}
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: `calc(100% + ${item.annotSize / 2}px)`,
                    transform: 'translate(-50%, -50%)',
                    width: `${item.annotSize}px`,
                    height: `${item.annotSize}px`,
                    borderRadius: '50%',
                    background: '#EF4444',
                    color: '#fff',
                    fontSize: `${item.fs - 2}px`,
                    fontWeight: W.bold,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(239,68,68,0.4)',
                    border: '1.5px solid #fff',
                    zIndex: 2,
                  }}>{item.gap}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 설명 */}
        <div style={{ fontSize: TYPE.label1.fontSize, color: '#888', lineHeight: '1.7' }}>
          Badge를 여러 개 나열하는 경우 간격을 일정하게 사용합니다.{' '}
          <span style={{ color: '#60a5fa', fontWeight: W.semibold }}>XSmall · Small 일 때 6px, Medium 일 때 8px</span>{' '}
          간격을 사용하는 것을 권장합니다.
        </div>
      </div>

      {/* ── Variants 섹션 ── */}
      <div style={{ fontSize: TYPE.heading2.fontSize, fontWeight: W.bold, color: '#fff', marginBottom: SP[16] }}>Variants</div>

      
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Preview Panel */}
        <div style={{ flex: 1.8, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: SP[8],
            padding: '6px 12px',
            borderRadius: '6px',
            background: badgeBg,
            border: badgeBorder,
            color: badgeColor,
            fontSize: TYPE.label1.fontSize,
            fontWeight: W.medium,
            lineHeight: 1,
            transition: 'all 0.2s'
          }}>
            {leadingIcon && (
              <div style={{
                width: '16px',
                height: '16px',
                border: `1.5px dashed ${iconBorderColor}`,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: W.bold,
                opacity: 0.8
              }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', border: `1.5px solid ${badgeColor}`, borderRadius: '1px', opacity: 0.7 }}></span>
              </div>
            )}
            
            <span style={{ lineHeight: 1 }}>Label</span>

            {trailingIcon && (
              <div style={{
                width: '16px',
                height: '16px',
                border: `1.5px dashed ${iconBorderColor}`,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: W.bold,
                opacity: 0.8
              }}>
                <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke={badgeColor} strokeWidth="1.5" strokeLinecap="round" style={{ display: 'block' }}><path d="M1 1l6 6M7 1L1 7" /></svg>
              </div>
            )}
          </div>
        </div>

        {/* Right: Control Panel */}
        <div 
          className="ds-playground-controls"
          style={{ 
            flex: 1,
            background: '#141414',
            borderLeft: '1px solid #2a2a2a',
            padding: SP[24],
            display: 'flex',
            flexDirection: 'column',
            gap: SP[24],
            maxHeight: '360px',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}
        >
          
          {/* Custom Radio Option Component matching the user's mockup */}
          {(() => {
            const RadioOption = ({ label, checked, onChange }) => (
              <div 
                onClick={onChange}
                className="ds-radio-option"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                  padding: '2px 0'
                }}
              >
                <div 
                  className="ds-radio-circle"
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: checked ? '2px solid #111' : '2px solid #3e3e42',
                    backgroundColor: checked ? '#3385FF' : '#1b1b1d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s'
                  }}
                >
                  {checked && (
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff'
                    }} />
                  )}
                </div>
                <span style={{
                  marginLeft: '10px',
                  fontSize: TYPE.label1.fontSize,
                  color: checked ? '#ffffff' : '#a1a1aa',
                  fontWeight: checked ? W.semibold : W.regular,
                  transition: 'color 0.15s'
                }}>
                  {label}
                </span>
              </div>
            );

            return (
              <>
                {/* Hierarchy (Level) Option */}
                <div>
                  <div style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#888', marginBottom: SP[12] }}>Hierarchy</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: SP[12] }}>
                    {[
                      { lv: 4, t: 'Level.4 · Accent 채움' },
                      { lv: 3, t: 'Level.3 · Accent 외곽' },
                      { lv: 2, t: 'Level.2 · Neutral 채움' },
                      { lv: 1, t: 'Level.1 · Neutral 외곽' },
                    ].map((o) => (
                      <RadioOption key={o.lv} label={o.t} checked={level === o.lv} onChange={() => setLevel(o.lv)} />
                    ))}
                  </div>
                </div>

                {/* Leading Icon Option */}
                <div>
                  <div style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#888', marginBottom: SP[12] }}>Leading icon</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: SP[12] }}>
                    <RadioOption 
                      label="False" 
                      checked={!leadingIcon} 
                      onChange={() => setLeadingIcon(false)} 
                    />
                    <RadioOption 
                      label="True" 
                      checked={leadingIcon} 
                      onChange={() => setLeadingIcon(true)} 
                    />
                  </div>
                </div>

                {/* Trailing Icon Option */}
                <div>
                  <div style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#888', marginBottom: SP[12] }}>Trailing icon</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: SP[12] }}>
                    <RadioOption 
                      label="False" 
                      checked={!trailingIcon} 
                      onChange={() => setTrailingIcon(false)} 
                    />
                    <RadioOption 
                      label="True" 
                      checked={trailingIcon} 
                      onChange={() => setTrailingIcon(true)} 
                    />
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// Framed style — 테두리(Frame) 컨테이너. Anatomy(구조) + Interactive(States 매트릭스).
function FramedStylePlayground({ activeSubTab }) {
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '720px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 */}
        <div style={{
          position: 'relative', background: '#efefef', borderRadius: '16px',
          width: '720px', height: '300px', margin: '0 auto 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box',
        }}>
          {/* 프레임 컨테이너 (콘텐츠 여백 SP[24] 정규화) */}
          <div style={{ position: 'relative', width: '320px', height: '108px', border: '1.5px solid #c4c4c8', borderRadius: '10px', background: '#fff', boxSizing: 'border-box' }}>
            <span style={{ position: 'absolute', top: '-9px', left: '16px', background: '#efefef', padding: '0 8px', fontSize: TYPE.caption1.fontSize, color: '#888' }}>Frame label</span>
            <div style={{ margin: '24px', height: '60px', background: '#ececf3', borderRadius: '6px' }} />
          </div>

          {/* 간격 치수선 — 프레임은 중앙 배치(left 200 / top 96), 콘텐츠 여백 SP[24] */}
          {showSpacing && (
            <>
              <PaddingFill x={200} y={96} w={320} h={108} t={24} />
              <DimLine dir="h" x={200} y={150} sp={24} />{/* 좌측 여백 */}
              <DimLine dir="v" x={272} y={96} sp={24} />{/* 상단 여백 */}
            </>
          )}
        </div>

        {/* Legend — 3열 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Frame (테두리 컨테이너)' },
            { num: 2, label: 'Frame label (상단 라벨, 선택)' },
            { num: 3, label: 'Content area (내부 콘텐츠)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>

        {/* 간격 스펙 표 */}
        {showSpacing && (
        <div style={{ maxWidth: '720px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (<div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>))}
            {[
              ['콘텐츠 여백', 'SP[24]', '24', '프레임 안쪽 4변 여백'],
              ['라벨 좌측 오프셋', 'SP[16]', '16', '상단 라벨 시작 위치'],
              ['라벨 패딩', 'SP[8]', '8', '라벨 좌우 여백'],
              ['프레임 반경', 'radius', '10', '테두리 border-radius'],
              ['콘텐츠 반경', 'radius', '6', '내부 콘텐츠 border-radius'],
            ].map((r, i) => r.map((c, j) => (<div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>)))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ anatomy 여백 22→SP[24] · 라벨 패딩 6→SP[8] 정규화. 반경은 radius 토큰(간격 스케일 아님).</div>
        </div>
        )}
      </div>
    );
  }

  // Interactive — States 매트릭스 (Normal/Selected × Normal/Hovered/Negative/Disabled)
  const violet = (COLOR_ACCENT.find(a => a.key === 'accentViolet') || {}).value || '#9B8CFA';
  const fillN = `${violet}1A`; // Normal fill (10%)
  const fillH = `${violet}30`; // Hovered fill (더 진하게)
  const fillD = `${violet}12`; // Disabled fill (약하게)

  const ROWS = [
    { key: 'Normal',   label: 'Normal' },
    { key: 'Hovered',  label: 'Hovered' },
    { key: 'Negative', label: 'Negative' },
    { key: 'Disabled', label: 'Disabled' },
  ];
  const COLS = ['Normal', 'Selected'];

  // 각 (행, 열) 조합의 프레임 스타일 — null이면 해당 조합 미사용(빈 칸)
  const styleFor = (rowKey, col) => {
    const selected = col === 'Selected';
    // Selected는 Normal·Hovered 상태와만 조합 (Negative·Disabled는 단독)
    if (selected && (rowKey === 'Negative' || rowKey === 'Disabled')) return null;
    switch (rowKey) {
      case 'Normal':   return { border: selected ? T.primary : '#e2e2e8', fill: fillN };
      case 'Hovered':  return { border: selected ? T.primary : '#cbcbd4', fill: fillH };
      case 'Negative': return { border: T.error, fill: fillN };
      case 'Disabled': return { border: '#e8e8ec', fill: fillD, opacity: 0.55 };
      default: return null;
    }
  };

  const BOX_W = 240, BOX_H = 64;
  const Frame = ({ st }) => {
    if (!st) return <div style={{ width: `${BOX_W}px` }} />;
    return (
      <div style={{
        width: `${BOX_W}px`, height: `${BOX_H}px`, border: `1.5px solid ${st.border}`,
        borderRadius: '12px', background: '#fff', padding: '10px',
        display: 'flex', alignItems: 'stretch', boxSizing: 'border-box', opacity: st.opacity || 1,
      }}>
        <div style={{ flex: 1, background: st.fill, borderRadius: '6px' }} />
      </div>
    );
  };

  const colHeader = { fontSize: TYPE.label1.fontSize, fontWeight: W.medium, color: '#9a9aa2', textAlign: 'center' };
  const rowLabel = { fontSize: TYPE.label1.fontSize, fontWeight: W.medium, color: '#9a9aa2' };

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ fontSize: TYPE.heading2.fontSize, fontWeight: W.bold, color: '#fff', marginBottom: '20px' }}>States</div>

      {/* 라이트 카드 — States 매트릭스 */}
      <div style={{ background: '#ffffff', borderRadius: '16px', padding: SP[40], display: 'flex', justifyContent: 'center', marginBottom: SP[16] }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `90px ${BOX_W}px ${BOX_W}px`,
          columnGap: SP[48], rowGap: '28px', alignItems: 'center',
        }}>
          {/* 헤더 행 */}
          <div />
          <div style={colHeader}>Normal</div>
          <div style={colHeader}>Selected</div>

          {/* 상태 행 */}
          {ROWS.map(r => (
            <Fragment key={r.key}>
              <div style={rowLabel}>{r.label}</div>
              {COLS.map(c => <Frame key={c} st={styleFor(r.key, c)} />)}
            </Fragment>
          ))}
        </div>
      </div>

      {/* 설명 */}
      <div style={{ fontSize: TYPE.label1.fontSize, color: '#888', lineHeight: '1.7' }}>
        프레임 컨테이너의 상호작용 상태를 정의합니다. Normal(기본) · Hovered(마우스 오버, fill을 한 단계 진하게) ·{' '}
        <span style={{ color: '#60a5fa', fontWeight: W.semibold }}>Selected(포커스/활성, 테두리 {T.primary})</span> ·{' '}
        <span style={{ color: '#f87171', fontWeight: W.semibold }}>Negative(오류, 테두리 {T.error})</span> · Disabled(비활성, 명도 낮춤).{' '}
        Selected는 Normal · Hovered 상태와 조합되며, Negative · Disabled는 단독 상태입니다.
      </div>
    </div>
  );
}

// Text field(field-text) — 한 줄 입력. Anatomy(8요소 구조 도식) + Interactive(실동작).
function TextFieldPlayground({ activeSubTab }) {
  if (activeSubTab === 'anatomy') {
    const fieldBox = {
      position: 'absolute', left: '250px', width: '300px', height: '44px',
      display: 'flex', alignItems: 'center', gap: SP[8], padding: '0 12px',
      background: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', boxSizing: 'border-box', zIndex: 3,
    };
    const ph = { fontSize: TYPE.label1.fontSize, color: '#a1a1aa' };
    return (
      <AnatomyFrame
        card={{ w: 760, h: 500, bg: '#f4f4f5' }}
        legendGap="14px 0"
        callouts={[
          { n: 1, x: 190, y: 132, line: { x1: 248, y1: 132, x2: 204, y2: 132 } },
          { n: 2, x: 190, y: 172, line: { x1: 248, y1: 172, x2: 204, y2: 172 } },
          { n: 3, x: 190, y: 213, line: { x1: 248, y1: 213, x2: 204, y2: 213 } },
          { n: 4, x: 190, y: 272, line: { x1: 248, y1: 272, x2: 204, y2: 272 } },
          { n: 5, x: 400, y: 426, line: { x1: 400, y1: 374, x2: 400, y2: 412 } },
          { n: 6, x: 320, y: 82, line: { x1: 320, y1: 120, x2: 320, y2: 96 } },
          { n: 7, x: 614, y: 272, line: { x1: 552, y1: 272, x2: 600, y2: 272 } },
          { n: 8, x: 614, y: 352, line: { x1: 552, y1: 352, x2: 600, y2: 352 } },
        ]}
        dims={[
          { pad: { x: 251, y: 151, w: 298, h: 42, l: 12, r: 12 } },
          { dir: 'h', x: 251, y: 172, sp: 12 },
          { dir: 'v', x: 558, y: 150, length: 44, label: '44' },
          { dir: 'h', x: 281, y: 272, sp: 8 },
        ]}
        legend={[
          { n: 1, label: 'Heading' },
          { n: 2, label: 'Placeholder' },
          { n: 3, label: 'Description' },
          { n: 4, label: 'Leading icon' },
          { n: 5, label: 'Field' },
          { n: 6, label: 'Required badge' },
          { n: 7, label: 'Trailing contents' },
          { n: 8, label: 'Trailing button' },
        ]}
        spec={{ rows: [
          ['필드 가로 패딩', 'SP[12]', '12', '입력 내부 좌우'],
          ['아이콘·버튼 ↔ 입력', 'SP[8]', '8', '필드 내부 요소'],
          ['라벨·설명 세로 간격', 'SP[8]', '8', 'Heading↔Field↔Description'],
          ['필드 높이', '44', '44', '컨트롤 높이(고정)'],
          ['모서리 반경', 'radius', '8', 'border-radius'],
        ], note: '※ 간격 SP 스케일(4/8pt)로 정규화 완료. 필드 높이 44는 컨트롤 규격(스케일 예외).' }}
      >
          {/* 필드 묶음 뒤 흰 패널(레이어드 룩) */}
          <div style={{ position: 'absolute', left: '220px', top: '92px', width: '360px', height: '320px', background: '#fff', borderRadius: '12px', zIndex: 2 }} />

          {/* Heading + Required badge */}
          <div style={{ position: 'absolute', left: '250px', top: '120px', display: 'inline-flex', alignItems: 'center', gap: '3px', zIndex: 3 }}>
            <span style={{ fontSize: TYPE.label1.fontSize, fontWeight: W.bold, color: '#18181b' }}>Heading</span>
            <span style={{ fontSize: TYPE.label1.fontSize, fontWeight: W.bold, color: T.error }}>*</span>
          </div>

          {/* 기본 필드 — Placeholder */}
          <div style={{ ...fieldBox, top: '150px' }}>
            <span style={ph}>Placeholder</span>
          </div>

          {/* Description */}
          <div style={{ position: 'absolute', left: '250px', top: '206px', fontSize: TYPE.label2.fontSize, color: '#a1a1aa', zIndex: 3 }}>Description</div>

          {/* Leading icon + Trailing contents 필드 */}
          <div style={{ ...fieldBox, top: '250px' }}>
            <span style={{ width: '18px', height: '18px', borderRadius: '4px', border: '1.5px dashed #a1a1aa', flexShrink: 0 }} />
            <span style={{ ...ph, flex: 1 }}>Placeholder</span>
            <span style={{ width: '22px', height: '22px', borderRadius: '5px', background: 'rgba(0,102,255,0.14)', flexShrink: 0 }} />
          </div>

          {/* Trailing button 필드 */}
          <div style={{ ...fieldBox, top: '330px', padding: 0 }}>
            <span style={{ ...ph, flex: 1, padding: '0 12px' }}>Placeholder</span>
            <span style={{ alignSelf: 'stretch', width: '1px', background: '#e4e4e7' }} />
            <span style={{ fontSize: TYPE.label1.fontSize, fontWeight: W.semibold, color: T.primary, padding: '0 14px', whiteSpace: 'nowrap' }}>Button</span>
          </div>

      </AnatomyFrame>
    );
  }

  return <TextFieldInteractive />;
}

// Interactive — 다크 폼용 실동작 텍스트 필드(Heading·Required·Description·포커스·Trailing 지우기)
function TextFieldInteractive() {
  const [v, setV] = useState('');
  const [focused, setFocused] = useState(false);
  const empty = v.trim() === '';
  const error = focused === false && empty; // blur 시 비어 있으면 오류
  const borderColor = error ? T.error : focused ? T.primary : '#2e2e2e';
  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2a2a2a', borderRadius: '12px', minHeight: '220px', background: '#1e1e1e', padding: '24px' }}>
        <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: SP[8] }}>
          {/* Heading + Required badge */}
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#a1a1aa' }}>
            지점명 <span style={{ color: T.error }}>*</span>
          </label>
          {/* Field */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 12px',
            background: '#161618', borderRadius: '8px', boxSizing: 'border-box',
            border: `1px solid ${borderColor}`,
            boxShadow: focused ? '0 0 0 3px rgba(0,102,255,0.25)' : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}>
            <input
              value={v}
              onChange={(e) => setV(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="지점명을 입력하세요"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: TYPE.label1.fontSize, fontFamily: 'inherit' }}
            />
            {v && (
              <button type="button" aria-label="지우기" onClick={() => setV('')}
                style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#3a3a40', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0 }}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#d4d4d8" strokeWidth="1.6" strokeLinecap="round"><path d="M1 1l6 6M7 1L1 7" /></svg>
              </button>
            )}
          </div>
          {/* Description / Error */}
          <span style={{ fontSize: TYPE.caption1.fontSize, color: error ? T.error : '#7a7a7a' }}>
            {error ? '필수 입력 항목입니다.' : '관제 지점의 표시 이름을 입력합니다.'}
          </span>
        </div>
      </div>
      <div style={{ marginTop: SP[12], fontSize: TYPE.caption1.fontSize, color: '#7a7a7a' }}>
        포커스 시 테두리가 브랜드 컬러(#0066FF)로 강조되고, 비운 채로 포커스를 벗어나면 오류(#FF6363)로 표시됩니다.
      </div>
    </div>
  );
}

// Search field(field-search) — 키워드 검색 입력. Anatomy(구조 도식) + Interactive(실동작).
function SearchFieldPlayground({ activeSubTab }) {
  if (activeSubTab === 'anatomy') {
    // 입력 필드 한 줄(placeholder/value 두 가지 예시) 공통 스타일 — gap/padding/반경 SP 정규화
    const fieldBase = {
      position: 'absolute', left: '230px', width: '300px', height: '52px',
      display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px',
      borderRadius: '8px', boxSizing: 'border-box', zIndex: 3,
    };
    return (
      <AnatomyFrame
        card={{ w: 760, h: 420, bg: '#f4f4f5' }}
        legendGap="14px 0"
        callouts={[
          { n: 1, x: 178, y: 176, line: { x1: 192, y1: 176, x2: 238, y2: 176 } },
          { n: 2, x: 440, y: 110, line: { x1: 440, y1: 124, x2: 440, y2: 150 } },
          { n: 3, x: 370, y: 334, line: { x1: 370, y1: 320, x2: 370, y2: 278 } },
          { n: 4, x: 600, y: 176, line: { x1: 586, y1: 176, x2: 530, y2: 176 } },
          { n: 5, x: 600, y: 252, line: { x1: 586, y1: 252, x2: 516, y2: 252 } },
        ]}
        dims={[
          { pad: { x: 231, y: 227, w: 298, h: 50, t: 0, l: 12, r: 12, b: 0 } },
          { dir: 'h', x: 231, y: 252, sp: 12 },
          { dir: 'v', x: 230, y: 202, sp: 24 },
        ]}
        legend={[
          { n: 1, label: 'Search icon' },
          { n: 2, label: 'Placeholder' },
          { n: 3, label: 'Value' },
          { n: 4, label: 'Field' },
          { n: 5, label: 'Clear button' },
        ]}
        spec={{ rows: [
          ['필드 좌우 패딩', 'SP[12]', '12', '아이콘/텍스트 좌우 여백'],
          ['아이콘 ↔ 텍스트', 'SP[8]', '8', '내부 요소 간격'],
          ['필드 간 간격', 'SP[24]', '24', '필드 사이 세로 간격'],
          ['모서리 반경', 'radius', '8', 'border-radius'],
          ['필드 높이', '—', '52', '컨트롤 높이(실동작 40)'],
        ], note: '※ anatomy 패딩 14→SP[12] · gap 10→SP[8] · 반경 10→8 정규화. 실동작 렌더: 높이 40 · 패딩 SP[12] · gap SP[8].' }}
      >
          {/* 필드 뒤 흰 패널(레이어드 룩) */}
          <div style={{ position: 'absolute', left: '195px', top: '124px', width: '370px', height: '172px', background: '#fff', borderRadius: '12px', zIndex: 2 }} />

          {/* 필드 1 — Placeholder(입력 전) */}
          <div style={{ ...fieldBase, top: '150px', background: '#f1f1f4', border: '1px solid #e4e4e7' }}>
            <Icon name="search" size={18} color="#a1a1aa" />
            <span style={{ fontSize: TYPE.label1.fontSize, color: '#a1a1aa' }}>Please enter your search term.</span>
          </div>

          {/* 필드 2 — Value(입력 후) + Clear 버튼 */}
          <div style={{ ...fieldBase, top: '226px', background: '#fff', border: '1px solid #e4e4e7' }}>
            <Icon name="search" size={18} color="#71717a" />
            <span style={{ fontSize: TYPE.label1.fontSize, color: '#18181b', flex: 1 }}>Entered keyword</span>
            <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#c4c4c8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"><path d="M1 1l6 6M7 1L1 7" /></svg>
            </span>
          </div>

      </AnatomyFrame>
    );
  }

  // Interactive — 다크 대시보드용 실동작 검색 필드(입력값 있을 때만 Clear 노출)
  return <SearchFieldInteractive />;
}

function SearchFieldInteractive() {
  const [q, setQ] = useState('상수도 누수');
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2a2a2a', borderRadius: '12px', height: '220px', background: '#1e1e1e' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px', width: '360px', height: '40px', padding: '0 12px',
          background: '#161618', borderRadius: '8px', boxSizing: 'border-box',
          border: `1px solid ${focused ? T.primary : '#2e2e2e'}`,
          boxShadow: focused ? `0 0 0 3px rgba(0,102,255,0.25)` : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}>
          <Icon name="search" size={18} color={focused ? T.primaryStrong : '#71717a'} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="검색어를 입력하세요"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: TYPE.label1.fontSize, fontFamily: 'inherit' }}
          />
          {q && (
            <button
              type="button"
              aria-label="지우기"
              onClick={() => setQ('')}
              style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#3a3a40', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0 }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#d4d4d8" strokeWidth="1.6" strokeLinecap="round"><path d="M1 1l6 6M7 1L1 7" /></svg>
            </button>
          )}
        </div>
      </div>
      <div style={{ marginTop: SP[12], fontSize: TYPE.caption1.fontSize, color: '#7a7a7a' }}>
        입력값이 있을 때만 우측 Clear(×) 버튼이 나타납니다. 포커스 시 테두리가 브랜드 컬러(#0066FF)로 강조됩니다.
      </div>
    </div>
  );
}

// Text area(field-textarea) — 멀티라인 입력. Anatomy(7요소) + Interactive(글자수·액션·상태).
function TextAreaPlayground({ activeSubTab }) {
  if (activeSubTab === 'anatomy') {
    return (
      <AnatomyFrame
        card={{ w: 760, h: 420, bg: '#f4f4f5' }}
        legendGap="14px 0"
        callouts={[
          { n: 1, x: 160, y: 172, line: { x1: 174, y1: 172, x2: 218, y2: 172 } },
          { n: 5, x: 284, y: 116, line: { x1: 284, y1: 130, x2: 284, y2: 162 } },
          { n: 2, x: 160, y: 208, line: { x1: 174, y1: 208, x2: 218, y2: 208 } },
          { n: 3, x: 160, y: 252, line: { x1: 174, y1: 252, x2: 230, y2: 252 } },
          { n: 7, x: 605, y: 252, line: { x1: 591, y1: 252, x2: 530, y2: 252 } },
          { n: 6, x: 390, y: 340, line: { x1: 390, y1: 326, x2: 390, y2: 274 } },
          { n: 4, x: 260, y: 340, line: { x1: 260, y1: 326, x2: 260, y2: 292 } },
        ]}
        dims={[
          { pad: { x: 221, y: 189, w: 318, h: 82, t: 12, r: 12, b: 12, l: 12 } },
          { dir: 'h', x: 221, y: 210, sp: 12 },
          { dir: 'v', x: 548, y: 188, length: 84, label: '84' },
          { dir: 'v', x: 232, y: 180, sp: 8 },
        ]}
        legend={[
          { n: 1, label: 'Heading' },
          { n: 2, label: 'Placeholder' },
          { n: 3, label: 'Leading content' },
          { n: 4, label: 'Description' },
          { n: 5, label: 'Required badge' },
          { n: 6, label: 'Field' },
          { n: 7, label: 'Trailing content' },
        ]}
        spec={{ rows: [
          ['필드 패딩', 'SP[12]', '12', '입력 내부 상하·좌우'],
          ['라벨 ↔ 필드', 'SP[8]', '8', 'Heading↔Field'],
          ['필드 ↔ 설명', 'SP[12]', '12', 'Field↔Description'],
          ['필드 높이', '84', '84', '멀티라인 최소 높이'],
          ['모서리 반경', 'radius', '8', 'border-radius'],
        ], note: '※ 간격 SP 스케일(4/8pt)로 정규화 완료. 필드 높이 84는 멀티라인 규격(스케일 예외).' }}
      >
          {/* 뒤 흰 패널(레이어드 룩) */}
          <div style={{ position: 'absolute', left: '195px', top: '146px', width: '380px', height: '150px', background: '#fff', borderRadius: '16px', zIndex: 2 }} />

          {/* Heading + Required badge */}
          <div style={{ position: 'absolute', left: '220px', top: '162px', zIndex: 3, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ fontSize: TYPE.label1.fontSize, fontWeight: W.bold, color: '#18181b' }}>Heading</span>
            <span style={{ fontSize: TYPE.label1.fontSize, fontWeight: W.bold, color: '#FF6363', lineHeight: 1 }}>*</span>
          </div>

          {/* Field 박스 */}
          <div style={{
            position: 'absolute', left: '220px', top: '188px', width: '320px', height: '84px',
            background: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', zIndex: 3,
            display: 'flex', flexDirection: 'column', padding: SP[12], boxSizing: 'border-box',
          }}>
            <span style={{ fontSize: TYPE.label1.fontSize, color: '#a1a1aa', flex: 1 }}>Placeholder</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: TYPE.caption1.fontSize, color: '#a1a1aa' }}>6/2000</span>
              <span style={{ fontSize: TYPE.label1.fontSize, fontWeight: W.semibold, color: T.primary }}>Button</span>
            </div>
          </div>

          {/* Description */}
          <div style={{ position: 'absolute', left: '220px', top: '284px', zIndex: 3, fontSize: TYPE.label2.fontSize, color: '#71717a' }}>Description</div>

      </AnatomyFrame>
    );
  }

  return <TextAreaInteractive />;
}

function TextAreaInteractive() {
  const [val, setVal] = useState('상수도 누수 의심 구간 점검 완료. 후속 조치 필요.');
  const [focused, setFocused] = useState(false);
  const [required, setRequired] = useState(true);
  const [error, setError] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const MAX = 2000;

  const RadioOption = ({ label, checked, onChange }) => (
    <div onClick={onChange} className="ds-radio-option" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none', padding: '2px 0' }}>
      <div className="ds-radio-circle" style={{
        width: '20px', height: '20px', borderRadius: '50%',
        border: checked ? '2px solid #111' : '2px solid #3e3e42',
        backgroundColor: checked ? '#3385FF' : '#1b1b1d',
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', transition: 'all 0.15s',
      }}>
        {checked && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }} />}
      </div>
      <span style={{ marginLeft: '10px', fontSize: '14px', color: checked ? '#ffffff' : '#a1a1aa', fontWeight: checked ? '600' : '400' }}>{label}</span>
    </div>
  );

  const over = val.length > MAX;
  const borderColor = error ? T.error : (focused ? T.primary : '#2e2e2e');
  const ring = error ? '0 0 0 3px rgba(255,99,99,0.22)' : (focused ? '0 0 0 3px rgba(0,102,255,0.25)' : 'none');

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Preview */}
        <div style={{ flex: 1.8, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ width: '100%', maxWidth: '380px' }}>
            {/* Heading + Required */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: SP[8], fontSize: TYPE.label1.fontSize, fontWeight: W.semibold, color: '#e8e8ec' }}>
              조치 내용
              {required && <span style={{ color: T.error, fontWeight: W.bold, lineHeight: 1 }}>*</span>}
            </label>
            {/* Field */}
            <div style={{
              background: '#161618', border: `1px solid ${borderColor}`, borderRadius: '8px',
              boxShadow: ring, transition: 'border-color 0.15s, box-shadow 0.15s',
              padding: SP[12], display: 'flex', flexDirection: 'column', gap: SP[8], boxSizing: 'border-box',
            }}>
              <textarea
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                rows={3}
                maxLength={MAX}
                placeholder="조치 내용을 입력하세요"
                style={{
                  width: '100%', minHeight: '64px', resize: 'vertical', background: 'transparent', border: 'none', outline: 'none',
                  color: '#fff', fontSize: TYPE.label1.fontSize, lineHeight: 1.6, fontFamily: 'inherit', padding: 0,
                }}
              />
              {/* Leading(글자수) + Trailing(액션) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: TYPE.caption1.fontSize, color: over ? T.error : '#7a7a7a' }}>{val.length}/{MAX}</span>
                {showButton && (
                  <button
                    type="button"
                    onClick={() => alert('등록')}
                    style={{ background: 'transparent', border: 'none', color: T.primaryStrong, fontSize: TYPE.label1.fontSize, fontWeight: W.semibold, cursor: 'pointer', padding: 0 }}
                  >등록</button>
                )}
              </div>
            </div>
            {/* Description / Error message */}
            <div style={{ marginTop: SP[8], fontSize: TYPE.label2.fontSize, color: error ? T.error : '#8a8a8f' }}>
              {error ? '필수 입력 항목입니다.' : '관제 일지에 기록될 조치 내용을 입력합니다.'}
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="ds-playground-controls" style={{ flex: 1, background: '#141414', borderLeft: '1px solid #2a2a2a', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Required badge</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <RadioOption label="True" checked={required} onChange={() => setRequired(true)} />
              <RadioOption label="False" checked={!required} onChange={() => setRequired(false)} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>State</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <RadioOption label="Default" checked={!error} onChange={() => setError(false)} />
              <RadioOption label="Error" checked={error} onChange={() => setError(true)} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Trailing content</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <RadioOption label="Button" checked={showButton} onChange={() => setShowButton(true)} />
              <RadioOption label="None" checked={!showButton} onChange={() => setShowButton(false)} />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#777', lineHeight: 1.5 }}>
            · 글자수(Leading)는 {MAX}자 한도 안내<br />· 포커스 시 테두리 #0066FF, Error 시 #FF6363
          </div>
        </div>
      </div>
    </div>
  );
}

// Segmented control(control-segmented) — 세그먼트 버튼. Anatomy(구조) + Interactive(전환).
function SegmentedControlPlayground({ activeSubTab }) {
  if (activeSubTab === 'anatomy') {
    const segBase = { width: '100px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: TYPE.body2.fontSize, boxSizing: 'border-box' };
    return (
      <AnatomyFrame
        card={{ w: 760, h: 400, bg: '#f4f4f5' }}
        legendGap="14px 0"
        callouts={[
          { n: 1, x: 215, y: 220, line: { x1: 228, y1: 220, x2: 267, y2: 220 } },
          { n: 2, x: 319, y: 165, line: { x1: 319, y1: 178, x2: 319, y2: 199 } },
          { n: 3, x: 435, y: 280, line: { x1: 435, y1: 267, x2: 435, y2: 244 } },
        ]}
        dims={[
          { dir: 'h', x: 265, y: 216, sp: 4 },
          { dir: 'v', x: 369, y: 196, sp: 4 },
        ]}
        legend={[
          { n: 1, label: 'Segment' },
          { n: 2, label: 'Label' },
          { n: 3, label: 'Container' },
        ]}
        spec={{ rows: [
          ['컨테이너 패딩', 'SP[4]', '4', '트랙 안쪽 4변 여백'],
          ['세그먼트 너비', '—', '100', '개별 세그먼트 폭'],
          ['세그먼트 높이', '—', '40', '개별 세그먼트 높이'],
          ['컨테이너 반경', 'radius', '8', '트랙 border-radius'],
          ['세그먼트 반경', 'radius', '6', '활성 배경 border-radius'],
        ], note: '※ 컨테이너 패딩 SP[4] 이미 준수. 실동작 세그먼트 패딩 6/18 → SP[8]/SP[16].' }}
      >
          {/* 세그먼트 컨테이너 */}
          <div style={{
            position: 'absolute', left: '265px', top: '196px',
            display: 'inline-flex', padding: SP[4], background: '#dcdce0', borderRadius: '8px', zIndex: 3, boxSizing: 'border-box',
          }}>
            <div style={{ ...segBase, background: '#fff', color: '#18181b', fontWeight: W.semibold, borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>Active</div>
            <div style={{ ...segBase, color: '#8a8a90' }}>Inactive</div>
            <div style={{ ...segBase, color: '#8a8a90' }}>Inactive</div>
          </div>

      </AnatomyFrame>
    );
  }

  // Interactive — 실동작 전환(다크). 데이터 스펙: 컨테이너 #1e1e1e, 활성 #2b2b2b + #0066FF.
  return <SegmentedControlInteractive />;
}

function SegmentedControlInteractive() {
  const OPTS = ['일별', '주별', '월별'];
  const [sel, setSel] = useState('일별');
  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2a2a2a', borderRadius: '12px', height: '220px', background: '#161618' }}>
        <div style={{ display: 'inline-flex', padding: SP[4], background: '#1e1e1e', borderRadius: '8px' }}>
          {OPTS.map((o) => {
            const on = sel === o;
            return (
              <button
                key={o}
                type="button"
                onClick={() => setSel(o)}
                style={{
                  padding: '6px 18px', border: 'none', cursor: 'pointer', borderRadius: '6px',
                  fontSize: TYPE.label1.fontSize, fontFamily: 'inherit', transition: 'background 0.15s, color 0.15s',
                  background: on ? '#2b2b2b' : 'transparent',
                  color: on ? T.primary : '#888',
                  fontWeight: on ? W.bold : W.medium,
                }}
              >{o}</button>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: SP[12], fontSize: TYPE.caption1.fontSize, color: '#7a7a7a' }}>
        선택한 세그먼트만 활성 배경(#2b2b2b) + 브랜드 컬러(#0066FF) 라벨로 강조됩니다. 현재 선택: <span style={{ color: '#bdbdc4' }}>{sel}</span>
      </div>
    </div>
  );
}

// Icon button(button-icon) — 아이콘만으로 동작. Anatomy(구조) + Interactive(실동작).
function IconButtonPlayground({ activeSubTab }) {
  if (activeSubTab === 'anatomy') {
    return (
      <AnatomyFrame
        card={{ w: 720, h: 340 }}
        linesBehind
        callouts={[
          { n: 1, x: 250, y: 170, line: { x1: 263, y1: 170, x2: 348, y2: 170 } },
          { n: 2, x: 470, y: 170, line: { x1: 457, y1: 170, x2: 390, y2: 170 } },
        ]}
        dims={[
          { dir: 'h', x: 332, y: 170, sp: 16 },
        ]}
        legend={[
          { n: 1, label: 'Icon' },
          { n: 2, label: 'Container' },
        ]}
        spec={{ rows: [
          ['아이콘 여백', 'SP[16]', '16', '(지름−아이콘)/2 = 17→SP[16]'],
          ['컨테이너 지름', '—', '56', '원형 버튼 크기'],
          ['아이콘 크기', '—', '22', '내부 글리프'],
        ], note: '※ off-grid 17→SP[16] 정규화. 실동작: 지름 44 · 아이콘 18 · 여백 13→SP[12].' }}
      >
          {/* 아이콘 버튼 — 중앙 (원형 Primary + 재생 아이콘) */}
          <div style={{
            position: 'absolute', left: '332px', top: '142px', width: '56px', height: '56px',
            borderRadius: '50%', background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><polygon points="8,5 19,12 8,19" /></svg>
          </div>

      </AnatomyFrame>
    );
  }

  // Interactive — Primary(원형) + Ghost(사각) 변형 + Disabled
  return <IconButtonInteractive />;
}

function IconButtonInteractive() {
  const BTN = 44, ICON = 18;
  const ROWS = ['Normal', 'Outlined', 'Solid', 'Background/Normal', 'Background/Alternative'];
  const COLS = ['Normal', 'Hovered', 'Pressed', 'Disabled'];

  // 변형(행) × 상태(열) → 컨테이너/아이콘 스타일. Solid는 핀텔 Primary 위계 사용.
  const styleFor = (variant, state) => {
    const dis = state === 'Disabled';
    switch (variant) {
      case 'Normal': {
        const bg = dis ? 'transparent' : state === 'Hovered' ? '#f0f0f3' : state === 'Pressed' ? '#e4e4e7' : 'transparent';
        return { bg, border: 'none', iconColor: dis ? '#c8c8ce' : '#18181b' };
      }
      case 'Outlined': {
        const bg = dis ? 'transparent' : state === 'Hovered' ? '#f4f4f5' : state === 'Pressed' ? '#e8e8ec' : 'transparent';
        return { bg, border: `1px solid ${dis ? '#e8e8ec' : '#d4d4d8'}`, iconColor: dis ? '#c8c8ce' : '#18181b' };
      }
      case 'Solid': {
        const bg = state === 'Hovered' ? T.primaryStrong : state === 'Pressed' ? T.primaryHeavy : T.primary;
        return { bg, border: 'none', iconColor: '#fff', opacity: dis ? 0.4 : 1 };
      }
      case 'Background/Normal': {
        const bg = dis ? '#f4f4f5' : state === 'Hovered' ? '#e8e8ec' : state === 'Pressed' ? '#dcdce0' : '#f0f0f3';
        return { bg, border: 'none', iconColor: dis ? '#c8c8ce' : '#71717a' };
      }
      case 'Background/Alternative': {
        const bg = dis ? '#c4c4c8' : state === 'Hovered' ? '#86868e' : state === 'Pressed' ? '#71717a' : '#9a9aa2';
        return { bg, border: 'none', iconColor: '#fff', opacity: dis ? 0.6 : 1 };
      }
      default: return { bg: 'transparent', border: 'none', iconColor: '#18181b' };
    }
  };

  // 변형별 대표 아이콘 (이미지와 동일: 시계 / 공유 / 전송 / ×)
  const renderIcon = (variant, color) => {
    if (variant === 'Normal') return <Icon name="schedule" size={ICON} color={color} />;
    if (variant === 'Outlined') {
      return (
        <svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15V4" /><path d="M8 8l4-4 4 4" /><path d="M5 13v6a1 1 0 001 1h12a1 1 0 001-1v-6" />
        </svg>
      );
    }
    if (variant === 'Solid') return <svg width={ICON} height={ICON} viewBox="0 0 24 24" fill={color}><polygon points="6,4 20,12 6,20" /></svg>;
    // Background 행 → ×
    return (
      <svg width={ICON - 2} height={ICON - 2} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
    );
  };

  const Cell = ({ variant, state }) => {
    const st = styleFor(variant, state);
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: `${BTN}px`, height: `${BTN}px`, borderRadius: '50%', background: st.bg, border: st.border, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: st.opacity || 1, boxSizing: 'border-box' }}>
          {renderIcon(variant, st.iconColor)}
        </div>
      </div>
    );
  };

  const colHeader = { fontSize: TYPE.label1.fontSize, fontWeight: W.medium, color: '#9a9aa2', textAlign: 'center' };
  const rowLabel = { fontSize: TYPE.label1.fontSize, fontWeight: W.medium, color: '#9a9aa2' };

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      {/* 라이트 카드 — States 매트릭스 */}
      <div style={{ background: '#ffffff', borderRadius: '16px', padding: SP[40], display: 'flex', justifyContent: 'center', marginBottom: SP[16] }}>
        <div style={{ display: 'grid', gridTemplateColumns: `170px repeat(4, 90px)`, columnGap: SP[24], rowGap: '26px', alignItems: 'center' }}>
          {/* 헤더 행 */}
          <div />
          {COLS.map(c => <div key={c} style={colHeader}>{c}</div>)}

          {/* 변형 행 */}
          {ROWS.map(r => (
            <Fragment key={r}>
              <div style={rowLabel}>{r}</div>
              {COLS.map(c => <Cell key={c} variant={r} state={c} />)}
            </Fragment>
          ))}
        </div>
      </div>

      {/* 설명 */}
      <div style={{ fontSize: TYPE.label1.fontSize, color: '#888', lineHeight: '1.7' }}>
        변형(Normal · Outlined · Solid · Background)별 상호작용 상태입니다.{' '}
        <span style={{ color: '#60a5fa', fontWeight: W.semibold }}>Solid는 핀텔 Primary 위계 — Normal {T.primary} · Hovered {T.primaryStrong} · Pressed {T.primaryHeavy}</span>{' '}
        를 따르며, Disabled는 투명도를 낮춰 표현합니다. 라벨이 없으므로 <code style={{ color: '#9a9aa2' }}>aria-label</code>을 반드시 제공합니다.
      </div>
    </div>
  );
}

// Radio(control-radio) — 단일 선택 컨트롤. Anatomy(구조) + Interactive(2가지 사이즈 + 선택).
function RadioPlayground({ activeSubTab }) {
  const [sel, setSel] = useState('day');
  const [size, setSize] = useState('medium');

  // 핀텔 가이드 — 라디오 2가지 사이즈
  const SIZES = {
    small:  { name: 'Small',  outer: 16, dot: 6, font: 13, gap: 6 },
    medium: { name: 'Medium', outer: 20, dot: 8, font: 14, gap: 8 },
  };

  // 라디오 원 (selected/disabled + 사이즈)
  // 선택 시: 외곽 원 전체를 T.primary로 채우고 가운데 흰 점 / 미선택: 투명 + 2px 회색 테두리
  const Radio = ({ selected, disabled, outer, dot }) => (
    <div style={{
      width: `${outer}px`, height: `${outer}px`, borderRadius: '50%', boxSizing: 'border-box', flexShrink: 0,
      background: selected ? T.primary : 'transparent',
      border: selected ? 'none' : '2px solid #71717A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: disabled ? 0.4 : 1, transition: 'background 0.15s, border-color 0.15s',
    }}>
      {selected && <div style={{ width: `${dot}px`, height: `${dot}px`, borderRadius: '50%', background: '#fff' }} />}
    </div>
  );

  if (activeSubTab === 'anatomy') {
    return (
      <AnatomyFrame
        card={{ w: 720, h: 340 }}
        linesBehind
        legendCols={2}
        callouts={[
          { n: 1, x: 230, y: 160, line: { x1: 240, y1: 160, x2: 298, y2: 160 }, dot: true },
          { n: 2, x: 450, y: 160, line: { x1: 440, y1: 160, x2: 382, y2: 160 }, dot: true },
        ]}
        dims={[
          { dir: 'h', x: 320, y: 160, sp: 8 },
        ]}
        legend={[
          { n: 1, label: 'Control (선택 컨트롤 — 외곽 원 + 내부 점)' },
          { n: 2, label: 'Label (텍스트 라벨)' },
        ]}
        spec={{ rows: [
          ['컨트롤 ↔ 라벨', 'SP[8]', '8', '원↔텍스트(Medium)'],
          ['컨트롤 크기', '—', '20·16', 'Medium·Small 외곽원'],
          ['내부 점', '—', '8·6', '선택 표시'],
        ], note: '※ Medium gap SP[8] 준수. Small은 컴팩트 변형.' }}
      >
          {/* 라디오 컴포넌트 — 중앙 (선택 상태) */}
          <div style={{
            position: 'absolute', left: '300px', top: '150px',
            display: 'inline-flex', alignItems: 'center', gap: SP[8],
            fontSize: TYPE.body1.fontSize, fontWeight: W.bold, color: '#18181b', zIndex: 3, userSelect: 'none',
          }}>
            <Radio selected outer={20} dot={8} />
            <span>Radio</span>
          </div>

      </AnatomyFrame>
    );
  }

  // Interactive — 2가지 사이즈 비교 + 단일 선택 데모
  const OPTS = [{ v: 'day', t: '일별' }, { v: 'week', t: '주별' }, { v: 'month', t: '월별' }];
  const sz = SIZES[size];

  // States 매트릭스용 — 컨트롤 뒤 원형 상태 레이어(hover/press)
  const stateLayer = (st) => st === 'Hovered' ? '#f0f0f3' : st === 'Pressed' ? '#e0e0e6' : 'transparent';
  const STATE_ROWS = ['Normal', 'Hovered', 'Pressed', 'Disabled'];
  const StateCell = ({ state, checked }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: state === 'Disabled' ? 0.4 : 1 }}>
      <div style={{ position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: stateLayer(state) }} />
        <Radio selected={checked} outer={20} dot={8} />
      </div>
      <span style={{ fontSize: TYPE.label1.fontSize, color: '#18181b' }}>{checked ? 'Checked' : 'Unchecked'}</span>
    </div>
  );

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      {/* ── Size 섹션 (2가지 사이즈) ── */}
      <div style={{ marginBottom: SP[48] }}>
        <div style={{ fontSize: TYPE.heading2.fontSize, fontWeight: W.bold, color: '#fff', marginBottom: '20px' }}>Size</div>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: SP[40], display: 'flex', justifyContent: 'center', gap: '96px', marginBottom: SP[16] }}>
          {Object.values(SIZES).map((s) => (
            <div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: SP[16] }}>
              <div style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#888' }}>{s.name} · 외곽 {s.outer}px</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: `${s.gap}px` }}>
                <Radio selected outer={s.outer} dot={s.dot} />
                <span style={{ fontSize: `${s.font}px`, color: '#18181b', fontWeight: W.medium }}>Radio</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: `${s.gap}px` }}>
                <Radio selected={false} outer={s.outer} dot={s.dot} />
                <span style={{ fontSize: `${s.font}px`, color: '#71717a', fontWeight: W.medium }}>Radio</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: TYPE.label1.fontSize, color: '#888', lineHeight: '1.7' }}>
          핀텔 가이드 기준 <span style={{ color: '#60a5fa', fontWeight: W.semibold }}>두 가지 사이즈 — Small(외곽 16 · 점 6 · 라벨 13px) / Medium(외곽 20 · 점 8 · 라벨 14px)</span>. 선택 시 외곽 원이 {T.primary}로 채워지고 가운데 흰 점이 표시됩니다.
        </div>
      </div>

      {/* ── States 섹션 ── */}
      <div style={{ marginBottom: SP[48] }}>
        <div style={{ fontSize: TYPE.heading2.fontSize, fontWeight: W.bold, color: '#fff', marginBottom: '20px' }}>States</div>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: SP[40], display: 'flex', justifyContent: 'center', marginBottom: SP[16] }}>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 200px 200px', columnGap: SP[24], rowGap: '22px', alignItems: 'center' }}>
            {/* 헤더 행 */}
            <div />
            <div style={{ fontSize: TYPE.label1.fontSize, fontWeight: W.medium, color: '#9a9aa2' }}>Unchecked</div>
            <div style={{ fontSize: TYPE.label1.fontSize, fontWeight: W.medium, color: '#9a9aa2' }}>Checked</div>
            {/* 상태 행 */}
            {STATE_ROWS.map((r) => (
              <Fragment key={r}>
                <div style={{ fontSize: TYPE.label1.fontSize, fontWeight: W.medium, color: '#9a9aa2' }}>{r}</div>
                <StateCell state={r} checked={false} />
                <StateCell state={r} checked={true} />
              </Fragment>
            ))}
          </div>
        </div>
        <div style={{ fontSize: TYPE.label1.fontSize, color: '#888', lineHeight: '1.7' }}>
          Normal · Hovered(연한 원형 상태 레이어) · Pressed(진한 원형 상태 레이어) ·{' '}
          <span style={{ color: '#60a5fa', fontWeight: W.semibold }}>Disabled(투명도 40% · 클릭 차단)</span>. Hover/Press 시 컨트롤 뒤에 원형 상태 레이어가 표시됩니다.
        </div>
      </div>

      {/* ── Interactive (단일 선택) ── */}
      <div style={{ fontSize: TYPE.heading2.fontSize, fontWeight: W.bold, color: '#fff', marginBottom: SP[16] }}>Interactive</div>
      {/* 사이즈 토글 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], marginBottom: SP[16] }}>
        <span style={{ fontSize: TYPE.caption1.fontSize, color: '#9a9aa2' }}>Size</span>
        {['small', 'medium'].map((k) => (
          <button key={k} type="button" onClick={() => setSize(k)} style={{
            minWidth: '64px', height: '26px', padding: '0 10px', borderRadius: '6px', cursor: 'pointer',
            fontSize: TYPE.caption1.fontSize, fontWeight: W.semibold, fontFamily: 'inherit',
            color: size === k ? '#fff' : '#c9c9cf',
            background: size === k ? T.primary : '#2a2a30',
            border: `1px solid ${size === k ? T.primary : '#3a3a42'}`,
          }}>{SIZES[k].name}</button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP[32], background: '#202024', borderRadius: '20px', height: '180px' }}>
        {OPTS.map((o) => (
          <div key={o.v} onClick={() => setSel(o.v)} style={{ display: 'inline-flex', alignItems: 'center', gap: `${sz.gap}px`, cursor: 'pointer', userSelect: 'none' }}>
            <Radio selected={sel === o.v} outer={sz.outer} dot={sz.dot} />
            <span style={{ fontSize: `${sz.font}px`, color: sel === o.v ? '#fff' : '#9a9aa2', fontWeight: sel === o.v ? W.semibold : W.regular }}>{o.t}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: SP[12], fontSize: TYPE.caption1.fontSize, color: '#7a7a7a' }}>
        같은 그룹에서 하나만 선택됩니다. 현재 선택: <span style={{ color: '#bdbdc4' }}>{OPTS.find(o => o.v === sel)?.t}</span>
      </div>
    </div>
  );
}

// Select(control-select) — 드롭다운 단일 선택. Anatomy(7개 구성) + Interactive(펼침/선택).
function SelectPlayground({ activeSubTab }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(null);

  if (activeSubTab === 'anatomy') {
    const dash = '1.5px dashed #a1a1aa';
    return (
      <AnatomyFrame
        card={{ w: 760, h: 420, bg: '#f4f4f5' }}
        legendGap="14px 0"
        callouts={[
          { n: 1, x: 168, y: 230, line: { x1: 182, y1: 230, x2: 236, y2: 230 }, dot: true },
          { n: 2, x: 300, y: 150, line: { x1: 300, y1: 164, x2: 300, y2: 222 }, dot: true },
          { n: 3, x: 168, y: 272, line: { x1: 182, y1: 272, x2: 246, y2: 272 }, dot: true },
          { n: 4, x: 638, y: 272, line: { x1: 624, y1: 272, x2: 566, y2: 272 }, dot: true },
          { n: 5, x: 314, y: 393, line: { x1: 314, y1: 379, x2: 314, y2: 296 }, dot: true },
          { n: 6, x: 168, y: 312, line: { x1: 182, y1: 312, x2: 232, y2: 312 }, dot: true },
          { n: 7, x: 404, y: 393, line: { x1: 404, y1: 379, x2: 404, y2: 296 }, dot: true },
        ]}
        dims={[
          { pad: { x: 241, y: 251, w: 328, h: 42, t: 0, l: 12, r: 12, b: 0 } },
          { dir: 'v', x: 240, y: 242, sp: 8 },
          { dir: 'v', x: 240, y: 294, sp: 12 },
        ]}
        legend={[
          { n: 1, label: 'Heading' },
          { n: 2, label: 'Required badge' },
          { n: 3, label: 'Leading icon' },
          { n: 4, label: 'Dropdown icon' },
          { n: 5, label: 'Placeholder' },
          { n: 6, label: 'Description' },
          { n: 7, label: 'Field' },
        ]}
        spec={{ rows: [
          ['필드 좌우 패딩', 'SP[12]', '12', '아이콘/텍스트 좌우 여백'],
          ['아이콘 ↔ 텍스트', 'SP[8]', '8', '내부 요소 간격'],
          ['Heading ↔ Field', 'SP[8]', '8', '라벨과 트리거 간격'],
          ['Field ↔ Description', 'SP[12]', '12', '트리거와 설명 간격'],
          ['필드 높이', '—', '44', '컨트롤 높이'],
          ['모서리 반경', 'radius', '8', 'border-radius'],
        ], note: '※ off-grid gap 10→SP[8] · 설명 간격 11→SP[12] 정규화.' }}
      >
          {/* 필드 묶음 패널 */}
          <div style={{ position: 'absolute', left: '220px', top: '185px', width: '370px', height: '140px', background: '#fff', borderRadius: '12px', zIndex: 2 }} />

          {/* Heading + Required badge */}
          <div style={{ position: 'absolute', left: '240px', top: '222px', fontSize: TYPE.label1.fontSize, fontWeight: W.bold, color: '#18181b', zIndex: 3 }}>
            Heading <span style={{ color: '#FF6363' }}>*</span>
          </div>

          {/* Field (트리거) */}
          <div style={{
            position: 'absolute', left: '240px', top: '250px', width: '330px', height: '44px',
            background: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px',
            display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', boxSizing: 'border-box', zIndex: 3,
          }}>
            {/* Leading icon (점선 슬롯) */}
            <div style={{ width: '18px', height: '18px', border: dash, borderRadius: '4px', flexShrink: 0 }} />
            {/* Placeholder */}
            <span style={{ flex: 1, fontSize: TYPE.label1.fontSize, color: '#a1a1aa' }}>Placeholder</span>
            {/* Dropdown icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </div>

          {/* Description */}
          <div style={{ position: 'absolute', left: '240px', top: '305px', fontSize: TYPE.caption1.fontSize, color: '#a1a1aa', zIndex: 3 }}>Description</div>

      </AnatomyFrame>
    );
  }

  // Interactive — 실동작 셀렉트(Heading/Field/Description + 펼침 메뉴)
  const OPTS = ['강남구', '서초구', '송파구'];
  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: '#202024', borderRadius: '20px', minHeight: '300px', padding: '48px 0' }}>
        <div style={{ width: '320px', position: 'relative' }}>
          {/* Heading + Required */}
          <div style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#e8e8ec', marginBottom: SP[8] }}>지점 선택 <span style={{ color: T.error }}>*</span></div>

          {/* Field (트리거) */}
          <div
            onClick={() => setOpen(!open)}
            style={{
              display: 'flex', alignItems: 'center', gap: SP[8], height: '40px', padding: '0 12px', cursor: 'pointer',
              background: '#161618', borderRadius: '8px', boxSizing: 'border-box',
              border: `1px solid ${open ? T.primary : '#2e2e35'}`, transition: 'border-color 0.15s',
            }}
          >
            <Icon name="location_searching" size={16} color="#71717a" />
            <span style={{ flex: 1, fontSize: TYPE.label1.fontSize, color: val ? '#fff' : '#71717a' }}>{val || '지점을 선택하세요'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={open ? T.primaryStrong : '#8a8a92'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}><polyline points="6 9 12 15 18 9" /></svg>
          </div>

          {/* Description */}
          <div style={{ fontSize: TYPE.caption1.fontSize, color: '#7a7a7a', marginTop: '6px' }}>관제할 지점을 선택하세요</div>

          {/* 옵션 목록 */}
          {open && (
            <div style={{ position: 'absolute', left: 0, right: 0, top: '62px', background: '#1e1e22', border: '1px solid #2e2e35', borderRadius: '8px', boxShadow: '0 12px 32px rgba(0,0,0,0.5)', overflow: 'hidden', zIndex: 10 }}>
              {OPTS.map((o) => {
                const on = val === o;
                return (
                  <div
                    key={o}
                    onClick={() => { setVal(o); setOpen(false); }}
                    style={{ padding: '10px 12px', fontSize: TYPE.label1.fontSize, cursor: 'pointer', color: on ? T.primaryStrong : '#d4d4d8', fontWeight: on ? W.semibold : W.regular, background: on ? 'rgba(0,102,255,0.1)' : 'transparent' }}
                    onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = '#262626'; }}
                    onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}
                  >{o}</div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: SP[12], fontSize: TYPE.caption1.fontSize, color: '#7a7a7a' }}>
        트리거 클릭 시 옵션 목록이 열리고, 선택하면 닫히며 값이 반영됩니다. 펼침 시 chevron이 180° 회전합니다.
      </div>
    </div>
  );
}

// Slider(control-slider) — 범위(2-thumb) 슬라이더. Anatomy(구조) + Interactive(녹화 영상 구간 선택).
function SliderPlayground({ activeSubTab }) {
  if (activeSubTab === 'anatomy') {
    // 트랙: x 170~600 (width 430), y 268. 손잡이 2개(좌 253 / 우 400)
    const TRACK_L = 170, TRACK_R = 600, TRACK_Y = 268;
    const LO = 253, HI = 400;
    const thumb = (x) => ({
      position: 'absolute', left: `${x}px`, top: `${TRACK_Y}px`, transform: 'translate(-50%, -50%)',
      width: '18px', height: '18px', borderRadius: '50%', background: T.primary,
      border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.25)', boxSizing: 'border-box', zIndex: 3,
    });
    return (
      <AnatomyFrame
        card={{ w: 760, h: 400, bg: '#f4f4f5' }}
        legendGap="14px 0"
        callouts={[
          { n: 1, x: 183, y: 268, line: { x1: 196, y1: 268, x2: 242, y2: 268 }, dot: true },
          { n: 2, x: 410, y: 170, line: { x1: 410, y1: 184, x2: 410, y2: 205 }, dot: true },
          { n: 3, x: 628, y: 268, line: { x1: 614, y1: 268, x2: 602, y2: 268 }, dot: true },
          { n: 4, x: 400, y: 352, line: { x1: 400, y1: 338, x2: 400, y2: 312 }, dot: true },
        ]}
        dims={[
          { dir: 'v', x: 253, y: 277, sp: 24 },
        ]}
        legend={[
          { n: 1, label: 'Thumb' },
          { n: 2, label: 'Heading' },
          { n: 3, label: 'Track' },
          { n: 4, label: 'Value' },
        ]}
        spec={{ rows: [
          ['Thumb ↔ Value 라벨', 'SP[24]', '24', '손잡이와 값 라벨 세로 간격'],
          ['트랙 두께', '—', '4', '트랙/Fill 높이'],
          ['손잡이 지름', '—', '18', 'Thumb 크기'],
          ['트랙 반경', 'radius', '2', 'border-radius'],
        ], note: '※ off-grid 21→SP[24] 정규화. 트랙/손잡이는 컨트롤 고정 규격.' }}
      >
          {/* Heading (Value ~ Value) */}
          <div style={{ position: 'absolute', left: '410px', top: '217px', transform: 'translate(-50%, -50%)', fontSize: TYPE.headline1.fontSize, fontWeight: W.bold, color: '#18181b', whiteSpace: 'nowrap', zIndex: 3 }}>
            Value ~ Value
          </div>

          {/* Track 베이스(전체) */}
          <div style={{ position: 'absolute', left: `${TRACK_L}px`, top: `${TRACK_Y}px`, transform: 'translateY(-50%)', width: `${TRACK_R - TRACK_L}px`, height: '4px', borderRadius: '2px', background: '#d4d4d8', zIndex: 1 }} />
          {/* Fill(선택 구간) */}
          <div style={{ position: 'absolute', left: `${LO}px`, top: `${TRACK_Y}px`, transform: 'translateY(-50%)', width: `${HI - LO}px`, height: '4px', borderRadius: '2px', background: T.primary, zIndex: 2 }} />
          {/* Thumb 2개 */}
          <div style={thumb(LO)} />
          <div style={thumb(HI)} />

          {/* Value 라벨 (각 손잡이 아래) */}
          <div style={{ position: 'absolute', left: `${LO}px`, top: '298px', transform: 'translateX(-50%)', fontSize: TYPE.label2.fontSize, color: '#18181b', zIndex: 3 }}>Value</div>
          <div style={{ position: 'absolute', left: `${HI}px`, top: '298px', transform: 'translateX(-50%)', fontSize: TYPE.label2.fontSize, color: '#18181b', zIndex: 3 }}>Value</div>

      </AnatomyFrame>
    );
  }

  // Interactive — 녹화 영상 구간 선택용 범위 슬라이더
  return <VideoRangeSlider />;
}

// 녹화 영상 하이라이트 슬라이더 — 시작점(0)은 고정, 손잡이 1개로 하이라이트 끝 조절
function VideoRangeSlider() {
  const DURATION = 2700; // 녹화 길이 45:00 (초)
  const [value, setValue] = useState(0.42); // 하이라이트 끝 위치 (시작은 0 고정)
  const MARK = (11 * 60) / DURATION; // 11:00 지점 표시 (≈ 24.4%)
  const trackRef = useRef(null);
  const dragging = useRef(false);

  const fmt = (frac) => {
    const t = Math.max(0, Math.round(frac * DURATION));
    const m = Math.floor(t / 60), s = t % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  useEffect(() => {
    const move = (e) => {
      if (!dragging.current || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      let frac = (e.clientX - rect.left) / rect.width;
      frac = Math.max(0.02, Math.min(1, frac));
      setValue(frac);
    };
    const up = () => { dragging.current = false; };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, []);

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ background: '#202024', borderRadius: '20px', padding: '40px 48px 48px' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto' }}>
        {/* Heading — 하이라이트 시간대(시작 고정 ~ 손잡이) + 길이 */}
        <div style={{ textAlign: 'center', marginBottom: SP[32] }}>
          <div style={{ fontSize: TYPE.heading2.fontSize, fontWeight: W.bold, color: '#fff', letterSpacing: '-0.2px', fontVariantNumeric: 'tabular-nums' }}>
            {fmt(0)} ~ {fmt(value)}
          </div>
          <div style={{ fontSize: TYPE.label2.fontSize, color: '#9a9aa2', marginTop: SP[4] }}>
            하이라이트 <span style={{ color: T.primaryStrong, fontWeight: W.semibold }}>{fmt(value)}</span> · 전체 {fmt(1)}
          </div>
        </div>

        {/* Track + Thumb (시작 고정) */}
        <div ref={trackRef} style={{ position: 'relative', height: '18px', margin: '0 9px' }}>
          {/* 눈금(타임라인 느낌) */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => (
            <div key={t} style={{ position: 'absolute', left: `${t * 100}%`, top: '50%', transform: 'translate(-50%, -50%)', width: '1px', height: '10px', background: '#3a3a42' }} />
          ))}
          {/* Track 베이스 */}
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', height: '4px', borderRadius: '2px', background: '#3a3a42' }} />
          {/* Highlight Fill — 시작(0)부터 손잡이까지 */}
          <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0, width: `${value * 100}%`, height: '4px', borderRadius: '2px', background: T.primary }} />
          {/* 고정 시작점 표시 (드래그 불가) */}
          <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translate(-50%, -50%)', width: '4px', height: '12px', borderRadius: '2px', background: T.primary }} />
          {/* 11:00 지점 표시 — 세로 가이드선 + 위쪽 화살표 */}
          <div style={{ position: 'absolute', left: `${MARK * 100}%`, top: '50%', transform: 'translate(-50%, -50%)', width: '2px', height: '18px', background: '#fff', opacity: 0.9, zIndex: 4 }} />
          <div style={{ position: 'absolute', left: `${MARK * 100}%`, top: '-6px', transform: 'translate(-50%, -100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', zIndex: 5, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
            <span style={{ fontSize: TYPE.caption2.fontSize, color: '#fff', fontWeight: W.semibold }}>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>11:00</span> 싸움
            </span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="#fff"><polygon points="0,0 10,0 5,6" /></svg>
          </div>
          {/* 단일 손잡이 (하이라이트 끝) */}
          <div
            onMouseDown={(e) => { dragging.current = true; e.preventDefault(); }}
            style={{
              position: 'absolute', left: `${value * 100}%`, top: '50%', transform: 'translate(-50%, -50%)',
              width: '18px', height: '18px', borderRadius: '50%', background: T.primary, border: '2px solid #fff',
              boxShadow: '0 1px 6px rgba(0,0,0,0.4)', cursor: 'grab', boxSizing: 'border-box', zIndex: 3,
            }}
          />
        </div>

        {/* 값 라벨 — 시작(고정) / 손잡이 */}
        <div style={{ position: 'relative', height: '20px', margin: '8px 9px 0' }}>
          <span style={{ position: 'absolute', left: 0, transform: 'translateX(-50%)', fontSize: TYPE.caption1.fontSize, color: '#7a7a7a', fontVariantNumeric: 'tabular-nums' }}>{fmt(0)}</span>
          <span style={{ position: 'absolute', left: `${value * 100}%`, transform: 'translateX(-50%)', fontSize: TYPE.caption1.fontSize, color: '#c9c9cf', fontVariantNumeric: 'tabular-nums' }}>{fmt(value)}</span>
        </div>
        </div>
      </div>
      <div style={{ marginTop: SP[12], fontSize: TYPE.caption1.fontSize, color: '#7a7a7a' }}>
        시작 지점(00:00)은 고정이며, 손잡이를 드래그해 하이라이트 구간의 끝을 조절합니다. 채워진 파란 구간이 하이라이트 시간대입니다.
      </div>
    </div>
  );
}

// 토글 스위치 — 2가지 사이즈 + hover. On=T.primary(hover T.primaryStrong) / Off=#3a3a42(hover #4a4a52)
const SWITCH_SIZES = {
  small:  { w: 36, h: 20, thumb: 16 },
  medium: { w: 40, h: 22, thumb: 18 },
};
function SwitchToggle({ checked, disabled, onClick, size = 'medium', forceHover = false }) {
  const [hover, setHover] = useState(false);
  const s = SWITCH_SIZES[size];
  const isHover = !disabled && (hover || forceHover);
  const bg = disabled
    ? (checked ? T.primary : '#3a3a42')
    : checked
      ? (isHover ? T.primaryStrong : T.primary)
      : (isHover ? '#4a4a52' : '#3a3a42');
  return (
    <button
      type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={onClick}
      onMouseEnter={() => !disabled && setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', width: `${s.w}px`, height: `${s.h}px`, borderRadius: `${s.h / 2}px`, border: 'none', padding: 0,
        background: bg, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1, transition: 'background 0.15s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: '2px', left: checked ? `${s.w - s.thumb - 2}px` : '2px', width: `${s.thumb}px`, height: `${s.thumb}px`,
        borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', transition: 'left 0.15s',
      }} />
    </button>
  );
}

// Switch(control-switch) — On/Off 토글. Anatomy(Thumb·Container) + Interactive(토글 + 상태 + 사이즈).
function SwitchPlayground({ activeSubTab }) {
  const [on, setOn] = useState(true);

  if (activeSubTab === 'anatomy') {
    return (
      <AnatomyFrame
        card={{ w: 760, h: 300, bg: '#f4f4f5' }}
        linesBehind
        callouts={[
          { n: 1, x: 300, y: 150, line: { x1: 313, y1: 150, x2: 356, y2: 150 }, dot: true },
          { n: 2, x: 470, y: 150, line: { x1: 457, y1: 150, x2: 410, y2: 150 }, dot: true },
        ]}
        dims={[
          { dir: 'h', x: 352, y: 150, length: 3, label: '3' },
        ]}
        legend={[
          { n: 1, label: 'Thumb (손잡이)' },
          { n: 2, label: 'Container (트랙)' },
        ]}
        spec={{ rows: [
          ['트랙 크기', '—', '40×22', '컨테이너(실제)'],
          ['썸(Thumb)', '—', '18', '손잡이 지름(실제)'],
          ['썸 인셋', '—', '2', '트랙↔썸 여백'],
          ['모서리 반경', '—', 'h/2', '완전 라운드'],
        ], note: '※ Switch는 컨트롤 규격(트랙·썸·인셋)으로 고정 — SP 간격 토큰 대상 아님. anatomy는 크게 그린 도식.' }}
      >
          {/* Container(트랙) — 중앙, Off 상태 예시 */}
          <div style={{ position: 'absolute', left: '352px', top: '135px', width: '56px', height: '30px', borderRadius: '15px', background: '#c4c4c8', zIndex: 2 }} />
          {/* Thumb */}
          <div style={{ position: 'absolute', left: '355px', top: '138px', width: '24px', height: '24px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.25)', zIndex: 3 }} />

      </AnatomyFrame>
    );
  }

  // Interactive — 토글 + 상태(Off/On/Disabled) 참고
  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ background: '#202024', borderRadius: '20px', padding: '40px 48px' }}>
        {/* 인터랙티브 토글 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '320px', margin: '0 auto' }}>
          <span style={{ fontSize: TYPE.label1.fontSize, color: '#e8e8ec', fontWeight: W.medium }}>오버레이 표시</span>
          <SwitchToggle checked={on} onClick={() => setOn(!on)} />
        </div>
        <div style={{ height: '1px', background: '#2e2e35', margin: '28px 0' }} />
        {/* 상태 참고 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '24px 24px' }}>
          {[
            { label: 'Off', checked: false },
            { label: 'On', checked: true },
            { label: 'Off · Hover', checked: false, hover: true },
            { label: 'On · Hover', checked: true, hover: true },
            { label: 'On · Disabled', checked: true, disabled: true },
            { label: 'Off · Disabled', checked: false, disabled: true },
          ].map((s) => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP[8] }}>
              <SwitchToggle checked={s.checked} disabled={s.disabled} forceHover={s.hover} />
              <span style={{ fontSize: TYPE.caption1.fontSize, color: '#9a9aa2', whiteSpace: 'nowrap' }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ height: '1px', background: '#2e2e35', margin: '28px 0' }} />
        {/* 사이즈 (2가지) */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '48px' }}>
          {[
            { label: 'Small · 36×20', size: 'small' },
            { label: 'Medium · 40×22', size: 'medium' },
          ].map((s) => (
            <div key={s.size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP[8] }}>
              <SwitchToggle checked size={s.size} onClick={() => {}} />
              <span style={{ fontSize: TYPE.caption1.fontSize, color: '#9a9aa2' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: SP[12], fontSize: TYPE.caption1.fontSize, color: '#7a7a7a' }}>
        클릭하면 즉시 토글되어 설정이 바로 적용됩니다. On 상태는 트랙이 {T.primary}로 채워지고 손잡이가 우측으로 이동하며, Hover 시 트랙 색이 한 단계 진해집니다(On → {T.primaryStrong}). 두 가지 사이즈(Small 36×20 / Medium 40×22)를 제공합니다.
      </div>
    </div>
  );
}

function ChipPlayground({ activeSubTab }) {
  const [styleMode, setStyleMode] = useState('outlined'); // 'solid' or 'outlined'
  const [leadingOption, setLeadingOption] = useState('icon'); // 'none', 'icon', 'image'
  const [trailingOption, setTrailingOption] = useState('icon'); // 'none', 'icon', 'image'

  if (activeSubTab === 'anatomy') {
    return (
      <AnatomyFrame
        card={{ w: 720, h: 340 }}
        linesBehind
        legendCols={4}
        callouts={[
          { n: 1, x: 210, y: 168, line: { x1: 210, y1: 168, x2: 288, y2: 168 } },
          { n: 2, x: 360, y: 90, line: { x1: 360, y1: 90, x2: 360, y2: 144 } },
          { n: 3, x: 510, y: 168, line: { x1: 510, y1: 168, x2: 424, y2: 168 } },
          { n: 4, x: 360, y: 250, line: { x1: 360, y1: 250, x2: 360, y2: 190 } },
        ]}
        dims={[
          { pad: { x: 280, y: 150, w: 160, h: 36, t: 6, l: 14, r: 14, b: 6 } },
          { dir: 'h', x: 280, y: 178, sp: 12 },
          { dir: 'v', x: 360, y: 150, sp: 8 },
        ]}
        legend={[
          { n: 1, label: 'Leading Content' },
          { n: 2, label: 'Label Text' },
          { n: 3, label: 'Trailing Action' },
          { n: 4, label: 'Chip Container' },
        ]}
        spec={{ rows: [
          ['가로 패딩', 'SP[12]', '14', '칩 좌우 여백'],
          ['세로 패딩', 'SP[8]', '6', '칩 상하 여백'],
          ['요소 간 간격', 'SP[8]', '8', '아이콘/라벨/× 간격'],
          ['모서리 반경', 'radius', '18', 'pill border-radius'],
          ['칩 높이', '—', '36', '컨트롤 높이'],
        ], note: '※ off-grid 가로 14→SP[12] · 세로 6→SP[8] 정규화. gap SP[8] 준수.' }}
      >
          {/* 칩 컴포넌트 — 중앙 */}
          <div style={{
            position: 'absolute',
            left: '280px',
            top: '150px',
            width: '160px',
            height: '36px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '18px',
            background: '#ffffff',
            border: '1.5px solid #e4e4e7',
            color: '#18181b',
            fontSize: '13px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            zIndex: 3,
          }}>
            {/* Leading Icon slot */}
            <div style={{ width: '16px', height: '16px', border: '1.5px dashed #a1a1aa', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#a1a1aa', borderRadius: '50%' }}></span>
            </div>
            <span>Label</span>
            {/* Trailing Close slot */}
            <span style={{ fontSize: '14px', color: '#a1a1aa', fontWeight: 'bold', marginLeft: 'auto', userSelect: 'none' }}>×</span>
          </div>

      </AnatomyFrame>
    );
  }

  // Interactive Playground (activeSubTab !== 'anatomy')
  const isSolid = styleMode === 'solid';
  const chipBg = isSolid ? '#262626' : 'transparent';
  const chipBorder = isSolid ? '1.5px solid transparent' : '1.5px solid rgba(255, 255, 255, 0.4)';
  const chipColor = '#ffffff';

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Preview Panel */}
        <div style={{ flex: 1.8, background: '#121214', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '16px',
            background: chipBg,
            border: chipBorder,
            color: chipColor,
            fontSize: '13px',
            fontWeight: 600,
            transition: 'all 0.2s',
            cursor: 'default',
            userSelect: 'none'
          }}>
            {/* Leading content slot rendering */}
            {leadingOption === 'icon' && (
              <div style={{
                width: '16px',
                height: '16px',
                border: '1.5px dashed rgba(255, 255, 255, 0.5)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box'
              }}>
                <div style={{ width: '6px', height: '6px', border: '1.5px solid rgba(255, 255, 255, 0.5)', borderRadius: '1px' }} />
              </div>
            )}
            {leadingOption === 'image' && (
              <div style={{
                width: '18px',
                height: '18px',
                border: '1.5px dashed rgba(255, 255, 255, 0.5)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box'
              }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: '50%' }} />
              </div>
            )}

            <span>Chip</span>

            {/* Trailing content slot rendering */}
            {trailingOption === 'icon' && (
              <div style={{
                width: '16px',
                height: '16px',
                border: '1.5px dashed rgba(255, 255, 255, 0.5)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box'
              }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1 }}>×</span>
              </div>
            )}
            {trailingOption === 'image' && (
              <div style={{
                width: '18px',
                height: '18px',
                border: '1.5px dashed rgba(255, 255, 255, 0.5)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box'
              }} />
            )}
          </div>
        </div>

        {/* Right: Control Panel */}
        <div 
          className="ds-playground-controls"
          style={{ 
            flex: 1, 
            background: '#1e1e20', 
            borderLeft: '1px solid #2a2a2c', 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
            maxHeight: '360px',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}
        >
          {(() => {
            const RadioOption = ({ label, checked, onChange }) => (
              <div 
                onClick={onChange}
                className="ds-radio-option"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                  padding: '2px 0'
                }}
              >
                <div 
                  className="ds-radio-circle"
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: checked ? '2px solid #111' : '2px solid #3e3e42',
                    backgroundColor: checked ? '#3385FF' : '#1b1b1d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s'
                  }}
                >
                  {checked && (
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff'
                    }} />
                  )}
                </div>
                <span style={{
                  marginLeft: '10px',
                  fontSize: '14px',
                  color: checked ? '#ffffff' : '#a1a1aa',
                  fontWeight: checked ? '600' : '400',
                  transition: 'color 0.15s'
                }}>
                  {label}
                </span>
              </div>
            );

            return (
              <>
                {/* Style Group */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Style</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <RadioOption 
                      label="Solid" 
                      checked={styleMode === 'solid'} 
                      onChange={() => setStyleMode('solid')} 
                    />
                    <RadioOption 
                      label="Outlined" 
                      checked={styleMode === 'outlined'} 
                      onChange={() => setStyleMode('outlined')} 
                    />
                  </div>
                </div>

                {/* Leading Content Option Group */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Leading content option</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <RadioOption 
                      label="None" 
                      checked={leadingOption === 'none'} 
                      onChange={() => setLeadingOption('none')} 
                    />
                    <RadioOption 
                      label="Icon" 
                      checked={leadingOption === 'icon'} 
                      onChange={() => setLeadingOption('icon')} 
                    />
                    <RadioOption 
                      label="Image" 
                      checked={leadingOption === 'image'} 
                      onChange={() => setLeadingOption('image')} 
                    />
                  </div>
                </div>

                {/* Trailing Content Option Group */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Trailing content option</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <RadioOption 
                      label="None" 
                      checked={trailingOption === 'none'} 
                      onChange={() => setTrailingOption('none')} 
                    />
                    <RadioOption 
                      label="Icon" 
                      checked={trailingOption === 'icon'} 
                      onChange={() => setTrailingOption('icon')} 
                    />
                    <RadioOption 
                      label="Image" 
                      checked={trailingOption === 'image'} 
                      onChange={() => setTrailingOption('image')} 
                    />
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// Section header(section-header-default) — 섹션/패널 상단 헤더.
// Anatomy(Heading + Heading content + Trailing content) + Interactive(슬롯 토글).
function SectionHeaderPlayground({ activeSubTab }) {
  const [showHeadingContent, setShowHeadingContent] = useState(true);
  const [trailingOption, setTrailingOption] = useState('link'); // 'none' | 'link' | 'meta' | 'icon'
  const [loading, setLoading] = useState(false);

  // 미니 Chip (헤딩 콘텐츠 슬롯 예시)
  const MiniChip = ({ dark = false }) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 8px', borderRadius: '12px',
      background: dark ? 'rgba(0,102,255,0.16)' : '#eef4ff',
      color: dark ? '#3385FF' : '#0066FF',
      fontSize: '12px', fontWeight: 600, lineHeight: '16px', whiteSpace: 'nowrap',
    }}>Chip ▾</span>
  );

  if (activeSubTab === 'anatomy') {
    return (
      <AnatomyFrame
        card={{ w: 720, h: 340 }}
        linesBehind
        callouts={[
          { n: 1, x: 170, y: 150, line: { x1: 170, y1: 150, x2: 226, y2: 150 } },
          { n: 2, x: 364, y: 250, line: { x1: 364, y1: 250, x2: 364, y2: 172 } },
          { n: 3, x: 610, y: 150, line: { x1: 610, y1: 150, x2: 556, y2: 150 } },
        ]}
        dims={[
          { pad: { x: 210, y: 128, w: 360, h: 44, t: 0, l: 16, r: 16, b: 0 } },
          { dir: 'h', x: 210, y: 160, sp: 16 },
          { dir: 'h', x: 554, y: 160, sp: 16 },
        ]}
        legend={[
          { n: 1, label: 'Heading' },
          { n: 2, label: 'Heading content' },
          { n: 3, label: 'Trailing content' },
        ]}
        spec={{ rows: [
          ['좌우 패딩', 'SP[16]', '16', '스트립 좌우 여백'],
          ['요소 간 간격', 'SP[8]', '8', 'Heading/Chip/Text 간격'],
          ['스트립 높이', '—', '44', '헤더 높이'],
          ['모서리 반경', 'radius', '6', 'border-radius'],
          ['제목 크기', '—', '18', 'Heading font-size'],
        ], note: '※ 이미 SP 준수(패딩 SP[16] · gap SP[8]).' }}
      >
          {/* 헤더 컴포넌트 — 중앙 흰 스트립 */}
          <div style={{
            position: 'absolute',
            left: '210px',
            top: '128px',
            width: '360px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0 16px',
            background: '#ffffff',
            borderRadius: '6px',
            boxSizing: 'border-box',
            zIndex: 3,
          }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#111111', whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>Heading</span>
            <MiniChip />
            <span style={{ marginLeft: 'auto', fontSize: '14px', fontWeight: 500, color: '#9a9aa2', whiteSpace: 'nowrap' }}>Text</span>
          </div>

      </AnatomyFrame>
    );
  }

  // Interactive Playground (activeSubTab !== 'anatomy')
  const RadioOption = ({ label, checked, onChange }) => (
    <div onClick={onChange} className="ds-radio-option" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none', padding: '2px 0' }}>
      <div className="ds-radio-circle" style={{
        width: '20px', height: '20px', borderRadius: '50%',
        border: checked ? '2px solid #111' : '2px solid #3e3e42',
        backgroundColor: checked ? '#3385FF' : '#1b1b1d',
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', transition: 'all 0.15s',
      }}>
        {checked && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }} />}
      </div>
      <span style={{ marginLeft: '10px', fontSize: '14px', color: checked ? '#ffffff' : '#a1a1aa', fontWeight: checked ? '600' : '400', transition: 'color 0.15s' }}>{label}</span>
    </div>
  );

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Preview Panel */}
        <div style={{ flex: 1.8, background: '#121214', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
          {/* 패널 카드 안의 섹션 헤더 */}
          <div style={{ width: '100%', maxWidth: '420px', background: '#1b1c1e', border: '1px solid #2c2c30', borderRadius: '10px', padding: '20px' }}>
            <SectionHeader
              loading={loading}
              heading={loading ? undefined : '알림'}
              headingContent={loading ? undefined : (showHeadingContent ? <MiniChip dark /> : undefined)}
              trailing={loading ? undefined : (
                trailingOption === 'link' ? <span style={{ fontSize: '15px', fontWeight: 500, color: '#3385FF', cursor: 'pointer' }}>모두 보기</span> :
                trailingOption === 'meta' ? <span style={{ fontSize: '13px', fontWeight: 500, color: '#8a8a8f' }}>방금 갱신</span> :
                trailingOption === 'icon' ? <Icon name="cycle" size={16} /> : undefined
              )}
            />
            {/* 본문 자리 표시(헤더와 본문의 관계를 보여주는 더미) */}
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ height: '10px', borderRadius: '4px', background: '#26272b', width: '92%' }} />
              <div style={{ height: '10px', borderRadius: '4px', background: '#26272b', width: '78%' }} />
            </div>
          </div>
        </div>

        {/* Right: Control Panel */}
        <div className="ds-playground-controls" style={{ flex: 1, background: '#1e1e20', borderLeft: '1px solid #2a2a2c', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}>
          {/* Heading content */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Heading content</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <RadioOption label="None" checked={!showHeadingContent} onChange={() => setShowHeadingContent(false)} />
              <RadioOption label="Chip" checked={showHeadingContent} onChange={() => setShowHeadingContent(true)} />
            </div>
          </div>

          {/* Loading state */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Loading state</div>
            <button type="button" onClick={() => setLoading(!loading)} style={{
              height: 30, padding: `0 ${SP[12]}`, borderRadius: 6, cursor: 'pointer', fontFamily: T.font,
              fontSize: TYPE.caption1.fontSize, fontWeight: W.regular,
              background: loading ? 'rgba(0,102,255,0.12)' : '#2a2a30',
              border: `1px solid ${loading ? T.primary : '#3a3a42'}`, color: loading ? T.primaryStrong : '#d4d4d8',
            }}>
              {loading ? '✓ loading' : '○ normal'}
            </button>
          </div>

          {/* Trailing content */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Trailing content</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <RadioOption label="None" checked={trailingOption === 'none'} onChange={() => setTrailingOption('none')} />
              <RadioOption label="Text button (모두 보기)" checked={trailingOption === 'link'} onChange={() => setTrailingOption('link')} />
              <RadioOption label="Meta text (갱신 시각)" checked={trailingOption === 'meta'} onChange={() => setTrailingOption('meta')} />
              <RadioOption label="Icon button (새로고침)" checked={trailingOption === 'icon'} onChange={() => setTrailingOption('icon')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Push badge(feedback-pushbadge) — 아이콘/메뉴 위 오버레이 알림 표식.
// Anatomy(Dot badge / Container / Label) + Interactive(dot·count 변형 + 개수).
function PushBadgePlayground({ activeSubTab }) {
  const [variant, setVariant] = useState('count'); // 'count' | 'dot'
  const [count, setCount] = useState(3);

  if (activeSubTab === 'anatomy') {
    // count 배지(컨테이너 + 라벨) — 좌측 ②, 우측 ③ 콜아웃 대상
    const countBadge = (label, top) => (
      <div style={{
        position: 'absolute', left: '457px', top, width: '26px', height: '26px',
        borderRadius: '50%', background: T.primary, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', fontWeight: W.bold, zIndex: 3,
      }}>{label}</div>
    );
    return (
      <AnatomyFrame
        card={{ w: 720, h: 340, bg: '#f4f4f5' }}
        linesBehind
        callouts={[
          { n: 1, x: 165, y: 170, line: { x1: 180, y1: 170, x2: 240, y2: 170 } },
          { n: 2, x: 380, y: 142, line: { x1: 395, y1: 142, x2: 455, y2: 142 } },
          { n: 3, x: 560, y: 142, line: { x1: 545, y1: 142, x2: 485, y2: 142 } },
          { n: 2, x: 380, y: 198, line: { x1: 395, y1: 198, x2: 455, y2: 198 } },
          { n: 3, x: 560, y: 198, line: { x1: 545, y1: 198, x2: 485, y2: 198 } },
        ]}
        dims={[
          { dir: 'h', x: 457, y: 142, length: 26, label: '26px' },
          { dir: 'h', x: 245, y: 170, length: 10, label: '10px' },
        ]}
        legend={[
          { n: 1, label: 'Dot badge' },
          { n: 2, label: 'Container' },
          { n: 3, label: 'Label' },
        ]}
        spec={{ rows: [
          ['Count 좌우 패딩', 'SP[4]', '5', '라벨 좌우 여백(실동작)'],
          ['Count 지름', '—', '26', 'anatomy 배지 크기'],
          ['Dot 지름', '—', '10', '점형 배지'],
          ['라벨 크기', '—', '13', '숫자 font-size'],
        ], note: '※ 실동작 count 높이 18 · 패딩 5→SP[4] · pill 반경 9. anatomy는 가독성 위해 확대 표기.' }}
      >
          {/* Dot badge (1) — 세로 중심 170 */}
          <div style={{ position: 'absolute', left: '245px', top: '165px', width: '10px', height: '10px', borderRadius: '50%', background: T.primary, zIndex: 3 }} />
          {/* Count badge — N (중심 470,142) */}
          {countBadge('N', '129px')}
          {/* Count badge — 1 (중심 470,198) */}
          {countBadge('1', '185px')}

      </AnatomyFrame>
    );
  }

  // Interactive Playground (activeSubTab !== 'anatomy')
  const panelBg = '#121214';
  const display = count > 99 ? '99+' : String(count);
  const hidden = variant === 'count' && count === 0;

  const RadioOption = ({ label, checked, onChange }) => (
    <div onClick={onChange} className="ds-radio-option" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none', padding: '2px 0' }}>
      <div className="ds-radio-circle" style={{
        width: '20px', height: '20px', borderRadius: '50%',
        border: checked ? '2px solid #111' : '2px solid #3e3e42',
        backgroundColor: checked ? '#3385FF' : '#1b1b1d',
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', transition: 'all 0.15s',
      }}>
        {checked && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }} />}
      </div>
      <span style={{ marginLeft: '10px', fontSize: '14px', color: checked ? '#ffffff' : '#a1a1aa', fontWeight: checked ? '600' : '400', transition: 'color 0.15s' }}>{label}</span>
    </div>
  );

  const stepBtn = {
    width: '28px', height: '28px', borderRadius: '6px', background: '#222', border: '1px solid #333',
    color: '#ddd', fontSize: '16px', lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Preview Panel */}
        <div style={{ flex: 1.8, background: panelBg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* 배지가 우상단으로 삐져나오는 만큼 호스트를 좌하단으로 보정해 조합(호스트+배지)의
              바운딩 박스를 패널 정중앙에 맞춘다. (오버플로 ≈ 링 포함 count 8px / dot 4px → 절반 보정) */}
          <div style={{ position: 'relative', display: 'inline-flex', transform: hidden ? 'none' : (variant === 'dot' ? 'translate(-2px, 2px)' : 'translate(-4px, 4px)') }}>
            {/* Host (아이콘) — 배지가 얹히는 대상 */}
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#1f2024', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2c4c8' }}>
              <Icon name="sensors" size={26} />
            </div>
            {/* Badge 오버레이 */}
            {!hidden && (variant === 'dot' ? (
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '12px', height: '12px', borderRadius: '50%', background: T.primary, boxShadow: `0 0 0 2px ${panelBg}` }} />
            ) : (
              <span style={{
                position: 'absolute', top: '-6px', right: '-6px', minWidth: '18px', height: '18px', padding: '0 5px',
                borderRadius: '9px', background: T.primary, color: '#fff', fontSize: '11px', fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', boxShadow: `0 0 0 2px ${panelBg}`,
              }}>{display}</span>
            ))}
          </div>
          {hidden && (
            <span style={{ position: 'absolute', bottom: '16px', left: 0, right: 0, textAlign: 'center', fontSize: '12px', color: '#7a7a7a' }}>
              count 0 → 배지 비표시(hidden)
            </span>
          )}
        </div>

        {/* Right: Control Panel */}
        <div className="ds-playground-controls" style={{ flex: 1, background: '#141414', borderLeft: '1px solid #2a2a2a', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}>
          {/* Variant */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Variant</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <RadioOption label="Count (숫자형)" checked={variant === 'count'} onChange={() => setVariant('count')} />
              <RadioOption label="Dot (점형)" checked={variant === 'dot'} onChange={() => setVariant('dot')} />
            </div>
          </div>

          {/* Count (count 변형일 때만) */}
          <div style={{ opacity: variant === 'count' ? 1 : 0.4, pointerEvents: variant === 'count' ? 'auto' : 'none' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Count</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <button style={stepBtn} onClick={() => setCount(c => Math.max(0, c - 1))}>−</button>
              <span style={{ minWidth: '36px', textAlign: 'center', fontSize: '15px', fontWeight: 600, color: '#fff' }}>{count}</span>
              <button style={stepBtn} onClick={() => setCount(c => Math.min(999, c + 1))}>+</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[0, 1, 3, 12, 120].map(p => (
                <button key={p} onClick={() => setCount(p)} style={{
                  padding: '4px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                  background: count === p ? '#0066FF' : '#222', border: '1px solid', borderColor: count === p ? '#0066FF' : '#333', color: '#fff',
                }}>{p}</button>
              ))}
            </div>
            <div style={{ fontSize: '12px', color: '#777', marginTop: '12px', lineHeight: 1.5 }}>
              · 99 초과 시 <b style={{ color: '#aaa' }}>99+</b> 로 축약<br />· 0이면 배지 비표시
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading 보조 컴포넌트 — 모듈 스코프 고정(렌더마다 재정의되면 React가 remount해 CSS 애니메이션이 매번 처음부터 다시 시작됨)
function Spinner({ size, color, thickness = 4, center }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `${thickness}px solid #2e2e2e`, borderTopColor: color, animation: 'pds-spin 0.8s linear infinite', boxSizing: 'border-box' }} />
      {center != null && (
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: W.bold, fontSize: `${Math.round(size * 0.34)}px`, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
          {center}
        </span>
      )}
    </div>
  );
}
function LinearBar({ color }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '320px', height: '4px', borderRadius: '8px', background: '#1e1e1e', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, bottom: 0, borderRadius: '8px', background: color, animation: 'pds-bar 1.2s ease-in-out infinite' }} />
    </div>
  );
}
function WaterSurface({ d, fill, dur, op = 1, reverse }) {
  return (
    <div style={{ position: 'absolute', top: '-15px', left: 0, width: '100%', height: '22px', overflow: 'hidden' }}>
      <svg viewBox="0 0 240 28" preserveAspectRatio="none" style={{ display: 'block', width: '200%', height: '100%', animation: `pds-wave-x ${dur}s linear infinite${reverse ? ' reverse' : ''}` }}>
        <path d={d} fill={fill} fillOpacity={op} />
      </svg>
    </div>
  );
}
// 물 채움(wave) — value%까지 차오르며, 수면이 위아래로 출렁(bob) + 반대 방향 파도 2겹 간섭
function WaterCircle({ value, color }) {
  const SIZE = 132;
  // viewBox 240폭. translateX(-50%)로 viewBox 120 이동 → 주기가 120을 나누면 seamless.
  const wave1 = 'M0 12 q 30 -9 60 0 t 60 0 t 60 0 t 60 0 L240 28 L0 28 Z';            // 주기 120, 진폭 9
  const wave2 = 'M0 12 q 15 -6 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 L240 28 L0 28 Z'; // 주기 60, 진폭 6
  return (
    <div style={{ position: 'relative', width: `${SIZE}px`, height: `${SIZE}px`, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${color}`, background: '#15151a', boxSizing: 'border-box' }}>
      {/* 물 (바닥 기준 value% 높이) — 위아래 출렁(bob), 물 컬러 투명도 0.6 */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${value}%`, opacity: 0.6, transition: 'height 0.18s linear', animation: 'pds-bob 2.6s ease-in-out infinite' }}>
        {/* 본체 — 아래로 넉넉히 늘려 bob 시 바닥 틈 방지(원이 클리핑) */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '-40px', background: color }} />
        {/* 수면: 본체색 파도(정방향) + 흰색 하이라이트 파도(반대방향·짧은 파장) */}
        <WaterSurface d={wave1} fill={color} dur={2.6} />
        <WaterSurface d={wave2} fill="#ffffff" op={0.22} dur={4.2} reverse />
      </div>
      {/* 퍼센트 */}
      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: TYPE.headline1.fontSize, fontWeight: W.bold, zIndex: 3, textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}>
        {Math.round(value)}%
      </span>
    </div>
  );
}

// Loading 컨트롤 라디오 — 모듈 스코프 고정(wave는 55ms마다 리렌더되어, 렌더 내부 정의 시 매번 remount→클릭 유실)
function LoadingRadio({ label, checked, onChange, disabled }) {
  return (
    <div onClick={disabled ? undefined : onChange} className="ds-radio-option" style={{ display: 'flex', alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none', padding: '2px 0', opacity: disabled ? 0.4 : 1 }}>
      <div className="ds-radio-circle" style={{
        width: '20px', height: '20px', borderRadius: '50%',
        border: checked ? '2px solid #111' : '2px solid #3e3e42',
        backgroundColor: checked ? '#3385FF' : '#1b1b1d',
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', transition: 'all 0.15s',
      }}>
        {checked && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }} />}
      </div>
      <span style={{ marginLeft: '10px', fontSize: '14px', color: checked ? '#ffffff' : '#a1a1aa', fontWeight: checked ? '600' : '400' }}>{label}</span>
    </div>
  );
}

// Loading(loading-default) — 처리 중 인디케이터. Anatomy(Track/Indicator/Label) + Interactive(circular/linear · status · scope).
function LoadingPlayground({ activeSubTab }) {
  const [variant, setVariant] = useState('circular');
  const [status, setStatus] = useState('default');
  const [scope, setScope] = useState('region');
  const [showLabel, setShowLabel] = useState(true);
  const [waveValue, setWaveValue] = useState(0);
  const [elapsed, setElapsed] = useState(1);
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)

  // wave 변형: 0→100% 자동 채움 루프(인터랙션 시연)
  useEffect(() => {
    if (variant !== 'wave') return undefined;
    const id = setInterval(() => setWaveValue((v) => (v >= 100 ? 0 : v + 1)), 55);
    return () => clearInterval(id);
  }, [variant]);

  // circular 변형: 스피너 가운데 경과 시간(초, 숫자만) 카운트
  useEffect(() => {
    if (variant !== 'circular') return undefined;
    setElapsed(1);
    const id = setInterval(() => setElapsed((e) => (e >= 30 ? 1 : e + 1)), 1000);
    return () => clearInterval(id);
  }, [variant]);

  if (activeSubTab === 'anatomy') {
    const C = 36, R = 30, CIRC = 2 * Math.PI * R; // 둘레 ≈ 188.5
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '720px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 */}
        <div style={{
          position: 'relative', background: '#f4f4f5', borderRadius: '16px',
          width: '720px', height: '340px', margin: '0 auto 24px', overflow: 'hidden', boxSizing: 'border-box',
        }}>
          {/* 원형 스피너(정적) — 트랙 + 인디케이터 호 */}
          <div style={{ position: 'absolute', left: '324px', top: '114px', zIndex: 3 }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx={C} cy={C} r={R} fill="none" stroke="#e4e4e7" strokeWidth="6" />
              <circle cx={C} cy={C} r={R} fill="none" stroke={T.primaryStrong} strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${CIRC * 0.25} ${CIRC * 0.75}`} transform={`rotate(-90 ${C} ${C})`} />
            </svg>
          </div>
          {/* Label */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: '206px', textAlign: 'center', zIndex: 3, fontSize: TYPE.label1.fontSize, fontWeight: W.regular, color: '#888' }}>Loading</div>

          {/* SVG 연결선 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
            {/* 1. Track -> 좌측 */}
            <line x1="250" y1="150" x2="326" y2="150" stroke="#999" strokeWidth="1.2" />
            {/* 2. Indicator -> 위 */}
            <line x1="360" y1="86" x2="360" y2="116" stroke="#999" strokeWidth="1.2" />
            {/* 3. Label -> 아래 */}
            <line x1="360" y1="262" x2="360" y2="224" stroke="#999" strokeWidth="1.2" />
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '235px', top: '150px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '360px', top: '72px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '360px', top: '262px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>

          {/* 간격 치수선 — Spinner ↔ Label 세로 간격 SP[24](23→24) */}
          {showSpacing && (
            <DimLine dir="v" x={360} y={183} sp={24} />
          )}
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Track (배경 트랙)' },
            { num: 2, label: 'Indicator (활성 호)' },
            { num: 3, label: 'Label (보조 안내)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>

        {/* 간격 스펙 표 */}
        {showSpacing && (
        <div style={{ maxWidth: '720px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (<div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>))}
            {[
              ['Spinner ↔ Label', 'SP[24]', '24', '스피너와 라벨 세로 간격'],
              ['스피너 지름', '—', '66', '트랙 외경(r30+stroke6)'],
              ['트랙 두께', '—', '6', 'stroke-width'],
            ].map((r, i) => r.map((c, j) => (<div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>)))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ off-grid 23→SP[24] 정규화. 실동작 region 스피너 40 · gap SP[16].</div>
        </div>
        )}
      </div>
    );
  }

  // ── Interactive ──
  const statusColor = { default: T.primaryStrong, cautionary: T.cautionary, negative: T.error, positive: T.positive }[status];
  const linearFill = { default: T.primary, cautionary: T.cautionary, negative: T.error, positive: T.positive }[status];
  const labelText = '데이터를 불러오는 중…';

  // 미리보기 구성
  let preview;
  if (variant === 'wave') {
    preview = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP[16] }}>
        <WaterCircle value={waveValue} color={linearFill} />
        {showLabel && <span style={{ fontSize: TYPE.body2.fontSize, fontWeight: W.regular, color: '#888' }}>{labelText}</span>}
      </div>
    );
  } else if (variant === 'linear') {
    preview = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP[12], width: '100%' }}>
        <LinearBar color={linearFill} />
        {showLabel && <span style={{ fontSize: TYPE.body2.fontSize, fontWeight: W.regular, color: '#888' }}>{labelText}</span>}
      </div>
    );
  } else if (scope === 'inline') {
    preview = (
      <button type="button" disabled style={{
        display: 'inline-flex', alignItems: 'center', gap: SP[8], padding: '10px 18px', borderRadius: '8px',
        background: T.primary, color: '#fff', border: 'none', fontSize: TYPE.label1.fontSize, fontWeight: W.semibold,
        opacity: 0.7, cursor: 'not-allowed',
      }}>
        <Spinner size={16} color="#fff" thickness={2} />
        검지 데이터 조회
      </button>
    );
  } else if (scope === 'fullscreen') {
    preview = (
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(18,18,18,0.7)', backdropFilter: 'blur(1px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: SP[16] }}>
        <Spinner size={48} color={statusColor} thickness={4} center={elapsed} />
        {showLabel && <span style={{ fontSize: TYPE.body1.fontSize, fontWeight: W.regular, color: '#e8e8ec' }}>보고서 생성 중…</span>}
      </div>
    );
  } else { // region
    preview = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: SP[16], width: '280px', height: '160px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px' }}>
        <Spinner size={40} color={statusColor} thickness={4} center={elapsed} />
        {showLabel && <span style={{ fontSize: TYPE.body2.fontSize, fontWeight: W.regular, color: '#888' }}>{labelText}</span>}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Preview */}
        <div style={{ flex: 1.8, background: '#121214', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
          {preview}
        </div>

        {/* Right: Controls */}
        <div className="ds-playground-controls" style={{ flex: 1, background: '#141414', borderLeft: '1px solid #2a2a2a', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Variant</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <LoadingRadio label="Circular (스피너)" checked={variant === 'circular'} onChange={() => setVariant('circular')} />
              <LoadingRadio label="Linear (진행 바)" checked={variant === 'linear'} onChange={() => setVariant('linear')} />
              <LoadingRadio label="Wave (물 채움)" checked={variant === 'wave'} onChange={() => setVariant('wave')} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <LoadingRadio label="Default (Primary)" checked={status === 'default'} onChange={() => setStatus('default')} />
              <LoadingRadio label="Cautionary (지연)" checked={status === 'cautionary'} onChange={() => setStatus('cautionary')} />
              <LoadingRadio label="Negative (재시도)" checked={status === 'negative'} onChange={() => setStatus('negative')} />
              <LoadingRadio label="Positive (완료 직전)" checked={status === 'positive'} onChange={() => setStatus('positive')} />
            </div>
          </div>
          <div style={{ opacity: variant === 'circular' ? 1 : 0.4 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Scope (circular)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <LoadingRadio label="Region (영역)" checked={scope === 'region'} onChange={() => setScope('region')} disabled={variant !== 'circular'} />
              <LoadingRadio label="Inline (버튼)" checked={scope === 'inline'} onChange={() => setScope('inline')} disabled={variant !== 'circular'} />
              <LoadingRadio label="Fullscreen (오버레이)" checked={scope === 'fullscreen'} onChange={() => setScope('fullscreen')} disabled={variant !== 'circular'} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Label</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <LoadingRadio label="True" checked={showLabel} onChange={() => setShowLabel(true)} />
              <LoadingRadio label="False" checked={!showLabel} onChange={() => setShowLabel(false)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertPlayground({ activeSubTab }) {
  const [alertType, setAlertType] = useState('warning');
  const [showTitle, setShowTitle] = useState(true);
  const [showClose, setShowClose] = useState(true);
  const [showAction, setShowAction] = useState(true);
  const [actionLayout, setActionLayout] = useState('bottom'); // 'bottom' | 'inline'
  const [customTitle, setCustomTitle] = useState('장비 상태 통신 감지 경고');
  const [customMsg, setCustomMsg] = useState('지점 C의 보행자 감지 카메라에 10초 이상의 레이턴시 지연이 발생하고 있습니다.');

  if (activeSubTab === 'anatomy') {
    return (
      <AnatomyFrame
        card={{ w: 720, h: 340, bg: '#f4f4f5' }}
        linesBehind
        callouts={[
          { n: 1, x: 100, y: 134, line: { x1: 100, y1: 134, x2: 176, y2: 134 } },
          { n: 2, x: 230, y: 56, line: { x1: 230, y1: 56, x2: 230, y2: 128 } },
          { n: 3, x: 400, y: 56, line: { x1: 400, y1: 56, x2: 400, y2: 152 } },
          { n: 5, x: 454, y: 292, line: { x1: 454, y1: 292, x2: 454, y2: 216 } },
          { n: 4, x: 524, y: 292, line: { x1: 524, y1: 292, x2: 524, y2: 216 } },
        ]}
        dims={[
          { pad: { x: 150, y: 113, w: 420, h: 114, t: 12, l: 16, r: 16, b: 12 } },
          { dir: 'h', x: 150, y: 200, sp: 16 },
          { dir: 'v', x: 200, y: 113, sp: 12 },
        ]}
        legend={[
          { n: 1, label: 'Status Icon (상태 아이콘)' },
          { n: 2, label: 'Title (알림 제목)' },
          { n: 3, label: 'Message (본문 설명)' },
          { n: 4, label: 'Action (하단 footer 버튼)' },
          { n: 5, label: 'Close (Action 좌측 닫기 버튼)' },
        ]}
        spec={{ rows: [
          ['좌우 패딩', 'SP[16]', '16', '컨테이너 좌우 여백'],
          ['상하 패딩', 'SP[12]', '12', '컨테이너 상하 여백'],
          ['행 간 간격', 'SP[12]', '12', '상단 행 ↔ footer'],
          ['아이콘 ↔ 콘텐츠', 'SP[12]', '12', '상단 행 내부 간격'],
          ['Title ↔ Message', 'SP[8]', '8', '콘텐츠 내부 간격'],
          ['버튼 간 간격', 'SP[8]', '8', 'Close ↔ Action'],
          ['모서리 반경', 'radius', '8', 'border-radius'],
        ], note: '※ 이미 SP 준수(12/16/8). 좌측 상태 강조선 4px.' }}
      >
          {/* 얼럿 컴포넌트 — 중앙 (구조 스켈레톤, 액션 = 하단 footer) */}
          <div style={{
            position: 'absolute',
            left: '150px',
            top: '113px',
            width: '420px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e4e4e7',
            borderLeft: '4px solid #d4d4d8',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            padding: '12px 16px', /* 스펙: 상하 12 / 좌우 16 */
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 3,
          }}>
            {/* 상단 행 — 아이콘 + 콘텐츠 */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Status Icon (1) — 아이콘 placeholder(네모 점선) */}
              <div style={{ flexShrink: 0, marginTop: '1px', width: '20px', height: '20px', border: '1.5px dashed #a1a1aa', borderRadius: '4px' }} />
              {/* Content 영역 — 제목 + 본문 플레이스홀더 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: SP[8], textAlign: 'left' }}>
                {/* Title (2) */}
                <div style={{ color: '#18181b', fontWeight: W.bold, fontSize: TYPE.label1.fontSize }}>Title</div>
                {/* Message (3) — 본문 플레이스홀더 바 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ height: '8px', width: '100%', borderRadius: '4px', background: '#e4e4e7' }} />
                  <div style={{ height: '8px', width: '62%', borderRadius: '4px', background: '#e4e4e7' }} />
                </div>
              </div>
            </div>
            {/* 하단 footer 행 — [Close][Action] 우측 정렬 (5, 4) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
              {/* Close (5) — 보조 위계: 테두리만 있는 ghost */}
              <span style={{
                display: 'inline-block', padding: '5px 12px', fontSize: TYPE.caption1.fontSize, fontWeight: W.semibold,
                background: 'transparent', border: '1px solid #d4d4d8', color: '#71717a', borderRadius: '4px', whiteSpace: 'nowrap',
              }}>Close</span>
              {/* Action (4) */}
              <span style={{
                display: 'inline-block', padding: '5px 12px', fontSize: TYPE.caption1.fontSize, fontWeight: W.semibold,
                backgroundColor: '#f4f4f5', border: '1px solid #d4d4d8', color: '#71717a', borderRadius: '4px', whiteSpace: 'nowrap',
              }}>Action</span>
            </div>
          </div>

      </AnatomyFrame>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
      case 'error':
        return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>;
      case 'warning':
        return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
      case 'info':
      default:
        return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
    }
  };

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '380px' }}>
        {/* Left: Preview Panel */}
        <div style={{ flex: 1.8, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>
          {(() => {
            const accent = alertType === 'success' ? '#10B981' :
                           alertType === 'error' ? '#EF4444' :
                           alertType === 'warning' ? '#F59E0B' : '#3B82F6';
            // 공통 버튼 베이스 — 두 버튼 동일 규격(패딩/타이포/라운드/높이). Button 정본: SemiBold 600.
            const footerBtnBase = {
              padding: '6px 14px',
              fontSize: TYPE.label2.fontSize,      // 13px
              lineHeight: TYPE.label2.lineHeight,  // 18px
              fontWeight: W.semibold,              // 600
              borderRadius: '6px',
              border: '1px solid',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              boxSizing: 'border-box',
            };
            const actionTint = alertType === 'success' ? 'rgba(16, 185, 129, 0.2)' :
                               alertType === 'error' ? 'rgba(239, 68, 68, 0.2)' :
                               alertType === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)';
            const actionTextColor = alertType === 'success' ? '#A7F3D0' :
                                    alertType === 'error' ? '#FECACA' :
                                    alertType === 'warning' ? '#FDE68A' : '#BFDBFE';
            // 실행 동작 — 강조(채움+테두리)
            const actionBtn = showAction && (
              <button className="ds-alert-action-btn" style={{
                ...footerBtnBase,
                backgroundColor: actionTint,
                borderColor: accent,
                color: actionTextColor,
              }} onClick={() => alert(`${alertType.toUpperCase()} action clicked!`)}>
                실행 동작 (Action)
              </button>
            );
            // 우측 상단 × (inline 레이아웃 전용)
            const closeBtn = showClose && (
              <div className="ds-alert-close-btn" style={{ color: '#888', fontSize: '18px', cursor: 'pointer', lineHeight: '1' }} onClick={() => alert('Alert closed!')}>
                ×
              </div>
            );
            // 하단 footer '닫기' — Action과 동일 규격, Secondary Outline 위계(테두리만)
            const closeFooterBtn = showClose && (
              <button className="ds-alert-action-btn" style={{
                ...footerBtnBase,
                background: 'transparent',
                borderColor: 'rgba(255,255,255,0.24)',
                color: '#d4d4d8',
              }} onClick={() => alert('Alert closed!')}>
                닫기
              </button>
            );
            return (
              <div className={`ds-alert-simulated ${alertType}`} style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '480px',
                background: alertType === 'success' ? 'rgba(16, 185, 129, 0.08)' :
                            alertType === 'error' ? 'rgba(239, 68, 68, 0.08)' :
                            alertType === 'warning' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(59, 130, 246, 0.08)',
                border: '1px solid',
                borderColor: accent,
                borderLeftWidth: '4px',
                borderRadius: '6px',
                padding: '12px 16px',
                color: '#fff'
              }}>
                {/* 상단 행 — 아이콘 + 본문 + (닫기, inline일 땐 액션) */}
                <div style={{ display: 'flex' }}>
                  <div className="ds-alert-icon" style={{ marginRight: '12px', color: accent, flexShrink: 0 }}>
                    {getIcon(alertType)}
                  </div>
                  <div className="ds-alert-content" style={{ flex: 1 }}>
                    {showTitle && <div className="ds-alert-title" style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{customTitle}</div>}
                    <div className="ds-alert-message" style={{ fontSize: '12px', color: '#ccc', lineHeight: '1.5' }}>{customMsg}</div>
                  </div>
                  {/* inline 레이아웃: 우측 상단 × + 액션 */}
                  {actionLayout === 'inline' && (showClose || showAction) && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', marginLeft: '12px', flexShrink: 0, gap: '8px' }}>
                      {closeBtn}
                      {actionBtn}
                    </div>
                  )}
                </div>
                {/* 하단 footer 행 — [닫기] [실행 동작] 우측 정렬 (기본) */}
                {actionLayout === 'bottom' && (showClose || showAction) && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    {closeFooterBtn}
                    {actionBtn}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Right: Control Panel */}
        <div 
          className="ds-playground-controls"
          style={{ 
            flex: 1, 
            background: '#141414', 
            borderLeft: '1px solid #2a2a2a', 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
            maxHeight: '380px',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}
        >
          {/* Alert Type Option */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Alert Type</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['success', 'info', 'warning', 'error'].map(type => (
                <PlaygroundRadioOption 
                  key={type}
                  label={type.charAt(0).toUpperCase() + type.slice(1)} 
                  checked={alertType === type} 
                  onChange={() => {
                    setAlertType(type);
                    if (type === 'success') {
                      setCustomTitle('제어 명령 실행 성공');
                      setCustomMsg('교차로 지점 A에 전달한 수동 신호 제어 명령이 정상 수행되었습니다.');
                    } else if (type === 'info') {
                      setCustomTitle('CCTV 실시간 스트리밍 알림');
                      setCustomMsg('지점 B의 카메라 3대에서 초당 30프레임 FHD 화질 스트리밍이 원활히 제공 중입니다.');
                    } else if (type === 'warning') {
                      setCustomTitle('장비 상태 통신 감지 경고');
                      setCustomMsg('지점 C의 보행자 감지 카메라에 10초 이상의 레이턴시 지연이 발생하고 있습니다.');
                    } else if (type === 'error') {
                      setCustomTitle('심각: 네트워크 연결 유실 오류');
                      setCustomMsg('지점 D의 보행자 안전 제어 모듈과의 통신이 두절되었습니다. 즉시 확인을 요합니다.');
                    }
                  }} 
                />
              ))}
            </div>
          </div>

          {/* Show Title Option */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Show title</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption 
                label="True" 
                checked={showTitle} 
                onChange={() => setShowTitle(true)} 
              />
              <PlaygroundRadioOption 
                label="False" 
                checked={!showTitle} 
                onChange={() => setShowTitle(false)} 
              />
            </div>
          </div>

          {/* Closeable Option */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Closeable</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption 
                label="True" 
                checked={showClose} 
                onChange={() => setShowClose(true)} 
              />
              <PlaygroundRadioOption 
                label="False" 
                checked={!showClose} 
                onChange={() => setShowClose(false)} 
              />
            </div>
          </div>

          {/* Show Action Option */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Show action</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption 
                label="True" 
                checked={showAction} 
                onChange={() => setShowAction(true)} 
              />
              <PlaygroundRadioOption
                label="False"
                checked={!showAction}
                onChange={() => setShowAction(false)}
              />
            </div>
          </div>

          {/* Action Layout Option */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Action layout</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption
                label="Bottom (하단 footer)"
                checked={actionLayout === 'bottom'}
                onChange={() => setActionLayout('bottom')}
              />
              <PlaygroundRadioOption
                label="Inline (우측 정렬)"
                checked={actionLayout === 'inline'}
                onChange={() => setActionLayout('inline')}
              />
            </div>
          </div>

          {/* Edit Title */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '8px' }}>Title text</div>
            <input 
              type="text" 
              value={customTitle} 
              onChange={(e) => setCustomTitle(e.target.value)} 
              style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', backgroundColor: '#222', border: '1px solid #333', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }} 
            />
          </div>

          {/* Edit Message */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '8px' }}>Message text</div>
            <textarea 
              value={customMsg} 
              onChange={(e) => setCustomMsg(e.target.value)} 
              rows={3}
              style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', backgroundColor: '#222', border: '1px solid #333', color: '#fff', fontSize: '12px', boxSizing: 'border-box', resize: 'vertical' }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AccordionPlayground({ componentId, activeSubTab }) {
  const [openItems, setOpenItems] = useState({ 'item-4': true });
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTime, setActiveTime] = useState('1h');

  const toggleItem = (id) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (activeSubTab === 'anatomy') {
    return (
      <AnatomyFrame
        card={{ w: 720, h: 340 }}
        linesBehind
        callouts={[
          { n: 1, x: 110, y: 170, line: { x1: 123, y1: 170, x2: 180, y2: 170 } },
          { n: 2, x: 360, y: 48, line: { x1: 360, y1: 61, x2: 360, y2: 90 } },
          { n: 3, x: 360, y: 292, line: { x1: 360, y1: 250, x2: 360, y2: 279 } },
        ]}
        dims={[
          { pad: { x: 180, y: 90, w: 360, h: 48, t: 12, l: 16, r: 16, b: 12 } },
          { dir: 'h', x: 180, y: 114, sp: 16 },
          { dir: 'v', x: 200, y: 90, sp: 12 },
        ]}
        legend={[
          { n: 1, label: 'Accordion.Item (항목 컨테이너)' },
          { n: 2, label: 'Accordion.Trigger (트리거 영역)' },
          { n: 3, label: 'Accordion.Content (상세 정보 콘텐츠)' },
        ]}
        spec={{ rows: [
          ['좌우 패딩', 'SP[16]', '16', 'Trigger/Content 좌우 여백'],
          ['상하 패딩', 'SP[12]', '12', 'Trigger/Content 상하 여백'],
          ['콘텐츠 행 간격', 'SP[8]', '8', 'Content 내부 행 간격'],
          ['Trigger 높이', '—', '48', '트리거 행 높이'],
          ['모서리 반경', 'radius', '8', 'border-radius'],
        ], note: '※ 이미 SP 준수(패딩 12/16 · gap 8).' }}
      >
          {/* 아코디언 컴포넌트 — 중앙 */}
          <div style={{
            position: 'absolute',
            left: '180px',
            top: '90px',
            width: '360px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1.5px solid #e4e4e7',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 3,
          }}>
            {/* Accordion.Trigger */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              height: '48px',
              borderBottom: '1px solid #e4e4e7',
              boxSizing: 'border-box',
              backgroundColor: '#ffffff'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#18181b' }}>Text 1 2</span>
              {/* Chevron icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            {/* Accordion.Content */}
            <div style={{
              padding: '12px 16px',
              background: '#f9f9fb',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              height: '112px',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#71717a' }}>
                <span>Text 2</span>
                <span>Value</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#71717a' }}>
                <span>Text 3</span>
                <span>Value</span>
              </div>
            </div>
          </div>

      </AnatomyFrame>
    );
  }

  const rows = [
    { id: 'item-1', name: '예원유치원 앞', usage: '23%', avgTime: '6.4초', alert: false, children: [] },
    { id: 'item-2', name: '큰말 버스 정류장', usage: '12%', avgTime: '8.3초', alert: false, children: [] },
    { id: 'item-3', name: '은빛 초등학교', usage: '26%', avgTime: '2.1초', alert: true, children: [] },
    { id: 'item-4', name: '배곤 초등학교 2', usage: '13%', avgTime: '3.4초', alert: false, children: [
      { label: '#1 횡단보도', usage: '26%', avgTime: '4.2초' },
      { label: '#2 횡단보도', usage: '18%', avgTime: '2.8초' },
    ]},
  ];

  const cellName = { flex: '1.4', fontSize: '13px' };
  const cellUsage = { flex: '1', fontSize: '13px', textAlign: 'center' };
  const cellTime = { flex: '1', fontSize: '13px', textAlign: 'center' };

  const renderPanel = (showAnatomy) => (
    <div style={{
      width: '100%',
      maxWidth: '440px',
      background: '#1a1a1a',
      borderRadius: '12px',
      padding: '24px 20px 16px',
      fontFamily: "'Inter', 'Pretendard', sans-serif",
      position: 'relative',
      border: '1px solid #2a2a2a',
      overflow: showAnatomy ? 'visible' : undefined,
    }}>
      {/* ── 헤더 ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
        <span style={{ fontSize: '17px', fontWeight: 700, color: '#FF4D4D' }}>보행신호 연장</span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#3385FF' }}>17개 지점</span>
      </div>

      {/* ── 검색 ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: '#111', border: '1px solid #333', borderRadius: '8px',
        padding: '8px 12px', marginBottom: '12px',
      }}>
        <span style={{ flex: 1, fontSize: '12px', color: '#666' }}>지점명 또는 횡단보도를 입력해주세요</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>

      {/* ── 필터 칩 ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span onClick={() => setActiveFilter('all')} style={{
            fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', cursor: 'pointer',
            background: activeFilter === 'all' ? '#2a2a2a' : 'transparent',
            color: activeFilter === 'all' ? '#fff' : '#666',
            border: '1px solid #333',
          }}>전체 4</span>
          <span onClick={() => setActiveFilter('alert')} style={{
            fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', cursor: 'pointer',
            background: activeFilter === 'alert' ? 'rgba(255,77,77,0.15)' : 'transparent',
            color: activeFilter === 'alert' ? '#FF4D4D' : '#666',
            border: activeFilter === 'alert' ? '1px solid #FF4D4D' : '1px solid #333',
          }}>장애 1</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span onClick={() => setActiveTime('1h')} style={{
            fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', cursor: 'pointer',
            background: activeTime === '1h' ? '#2a2a2a' : 'transparent',
            color: activeTime === '1h' ? '#fff' : '#666',
            border: '1px solid #333',
          }}>1시간</span>
          <span onClick={() => setActiveTime('day')} style={{
            fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', cursor: 'pointer',
            background: activeTime === 'day' ? '#2a2a2a' : 'transparent',
            color: activeTime === 'day' ? '#fff' : '#666',
            border: '1px solid #333',
          }}>금일</span>
        </div>
      </div>

      {/* ── 테이블 헤더 ── */}
      <div style={{
        display: 'flex', padding: '8px 4px', borderBottom: '1px solid #333', marginBottom: '2px',
      }}>
        <span style={{ ...cellName, fontSize: '12px', fontWeight: 600, color: '#3385FF' }}>지점명</span>
        <span style={{ ...cellUsage, fontSize: '12px', fontWeight: 600, color: '#3385FF' }}>연장 활용도</span>
        <span style={{ ...cellTime, fontSize: '12px', fontWeight: 600, color: '#3385FF' }}>평균 연장 시간</span>
      </div>

      {/* ── 행 목록 ── */}
      {rows.map((row) => {
        const isOpen = !!openItems[row.id];
        const hasChildren = row.children && row.children.length > 0;
        const isExpandable = hasChildren;
        const isAnatomyTarget = showAnatomy && row.id === 'item-4';

        return (
          <div key={row.id} style={{ position: 'relative', zIndex: isAnatomyTarget ? 100 : 'auto', overflow: isAnatomyTarget ? 'visible' : undefined }}>
            {isAnatomyTarget && (
              <div style={{
                position: 'absolute', inset: '-4px -6px', border: '2px dashed #3385FF', borderRadius: '8px',
                pointerEvents: 'none', zIndex: 1010,
              }}>
                <span className="anatomy-badge" style={{ position: 'absolute', left: '-10px', top: '-10px', zIndex: 1020, backgroundColor: '#3385FF', fontSize: '10px', padding: '2px 6px' }}>Item</span>
              </div>
            )}

            {/* ── Trigger (row) ── */}
            <div
              onClick={() => isExpandable && toggleItem(row.id)}
              style={{
                display: 'flex', alignItems: 'center', padding: '10px 4px',
                borderBottom: isOpen && hasChildren ? 'none' : '1px solid #222',
                cursor: isExpandable ? 'pointer' : 'default', userSelect: 'none',
                background: isOpen && hasChildren ? '#222' : 'transparent',
                fontWeight: isOpen && hasChildren ? 700 : 400,
                position: 'relative',
                borderRadius: isOpen && hasChildren ? '6px 6px 0 0' : '0',
                transition: 'background 0.2s',
              }}
            >
              {isAnatomyTarget && (
                <div style={{
                  position: 'absolute', inset: '-2px -3px', border: '2px dashed #22c55e', borderRadius: '6px',
                  pointerEvents: 'none', zIndex: 999,
                }}>
                  <span className="anatomy-badge" style={{ position: 'absolute', right: '-10px', top: '-10px', zIndex: 1000, backgroundColor: '#22c55e', fontSize: '10px', padding: '2px 6px' }}>Trigger</span>
                </div>
              )}

              <span style={{ ...cellName, color: row.alert ? '#FF4D4D' : '#ccc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {row.alert && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#FF4D4D" stroke="none"><circle cx="12" cy="12" r="5"/></svg>
                )}
                {row.name}
              </span>
              <span style={{ ...cellUsage, color: '#888' }}>{row.usage}</span>
              <span style={{ ...cellTime, color: '#888' }}>{row.avgTime}</span>
            </div>

            {/* ── Content (sub-rows) ── */}
            {hasChildren && (
              <div style={{
                maxHeight: isOpen ? `${row.children.length * 42 + 8}px` : '0px',
                overflow: isAnatomyTarget ? 'visible' : 'hidden',
                transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: '#1e1e1e',
                borderBottom: isOpen ? '1px solid #222' : 'none',
                borderRadius: '0 0 6px 6px',
                position: 'relative',
              }}>
                {isAnatomyTarget && (
                  <div style={{
                    position: 'absolute', inset: '-2px -3px', border: '2px dashed #f59e0b', borderRadius: '0 0 6px 6px',
                    pointerEvents: 'none', zIndex: 999,
                  }}>
                    <span className="anatomy-badge" style={{ position: 'absolute', right: '-10px', bottom: '-10px', zIndex: 1000, backgroundColor: '#f59e0b', fontSize: '10px', padding: '2px 6px' }}>Content</span>
                  </div>
                )}
                <div style={{ padding: '4px 0' }}>
                  {row.children.map((child, ci) => (
                    <div key={ci} style={{
                      display: 'flex', alignItems: 'center', padding: '8px 4px 8px 20px',
                      borderTop: ci > 0 ? '1px solid #1a1a1a' : 'none',
                    }}>
                      <span style={{ ...cellName, fontSize: '12px', color: '#777' }}>{child.label}</span>
                      <span style={{ ...cellUsage, fontSize: '12px', color: '#666' }}>{child.usage}</span>
                      <span style={{ ...cellTime, fontSize: '12px', color: '#666' }}>{child.avgTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '520px' }}>
        {/* Left: Preview Panel */}
        <div style={{ flex: 1.8, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'auto' }}>
          {renderPanel(false)}
        </div>

        {/* Right: Control Panel */}
        <div 
          className="ds-playground-controls"
          style={{ 
            flex: 1, 
            background: '#141414', 
            borderLeft: '1px solid #2a2a2a', 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
            maxHeight: '520px',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}
        >
          {/* Filter Option */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Filter Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption 
                label="All (전체)" 
                checked={activeFilter === 'all'} 
                onChange={() => setActiveFilter('all')} 
              />
              <PlaygroundRadioOption 
                label="Alert (장애)" 
                checked={activeFilter === 'alert'} 
                onChange={() => setActiveFilter('alert')} 
              />
            </div>
          </div>

          {/* Time Option */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Time Range</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption 
                label="1 Hour (1시간)" 
                checked={activeTime === '1h'} 
                onChange={() => setActiveTime('1h')} 
              />
              <PlaygroundRadioOption 
                label="Today (금일)" 
                checked={activeTime === 'day'} 
                onChange={() => setActiveTime('day')} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Avatar Anatomy Callout Helper
───────────────────────────────────────────────────────────────── */
function AnatomyCallout({ num, x, y }) {
  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: 'translate(-50%, -50%)',
      width: '26px',
      height: '26px',
      borderRadius: '50%',
      backgroundColor: '#fff',
      color: '#111',
      fontSize: '11px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
      zIndex: 10,
      userSelect: 'none',
      flexShrink: 0,
    }}>
      {num}
    </div>
  );
}

function PlaygroundRadioOption({ label, checked, onChange }) {
  return (
    <div 
      onClick={onChange}
      className="ds-radio-option"
      style={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        padding: '2px 0'
      }}
    >
      <div 
        className="ds-radio-circle"
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: checked ? '2px solid #111' : '2px solid #3e3e42',
          backgroundColor: checked ? '#3385FF' : '#1b1b1d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          transition: 'all 0.15s'
        }}
      >
        {checked && (
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#ffffff'
          }} />
        )}
      </div>
      <span style={{
        marginLeft: '10px',
        fontSize: '14px',
        color: checked ? '#ffffff' : '#a1a1aa',
        fontWeight: checked ? '600' : '400',
        transition: 'color 0.15s'
      }}>
        {label}
      </span>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────
   AvatarPlayground
───────────────────────────────────────────────────────────────── */
function AvatarPlayground({ activeSubTab }) {
  const [size, setSize] = useState('md');
  const [shape, setShape] = useState('circle');
  const [status, setStatus] = useState('online');
  const [showImage, setShowImage] = useState(false);

  const sizes = { sm: 32, md: 40, lg: 48, xl: 56 };
  const px = sizes[size];
  const statusColors = { online: '#1ED45A', idle: '#FFA938', offline: '#aaa', busy: '#FF6363' };
  const statusColor = statusColors[status];

  if (activeSubTab === 'anatomy') {
    return (
      <AnatomyFrame
        card={{ w: 720, h: 340 }}
        linesBehind
        callouts={[
          { n: 1, x: 230, y: 170, line: { x1: 230, y1: 170, x2: 324, y2: 170 } },
          { n: 2, x: 360, y: 70, line: { x1: 360, y1: 70, x2: 360, y2: 134 } },
          { n: 3, x: 490, y: 130, line: { x1: 490, y1: 130, x2: 379, y2: 160 }, dot: true },
          { n: 4, x: 382, y: 270, line: { x1: 382, y1: 270, x2: 382, y2: 198 } },
        ]}
        dims={[
          { dir: 'h', x: 328, y: 170, length: 64, label: '64px' },
          { dir: 'h', x: 389, y: 192, sp: 4 },
        ]}
        legend={[
          { n: 1, label: 'Container (아바타 외곽 영역)' },
          { n: 2, label: 'Avatar image (프로필 이미지)' },
          { n: 3, label: 'Initials fallback (대체 이니셜)' },
          { n: 4, label: 'Status indicator (접속 상태 표시)' },
        ]}
        spec={{ rows: [
          ['상태 표시 여백', 'SP[4]', '3', '상태 점 모서리 오프셋'],
          ['Container 지름', '—', '64', 'anatomy 아바타 크기'],
          ['상태 점 지름', '—', '14', 'Status indicator'],
        ], note: '※ off-grid 3→SP[4] 정규화. 실동작 사이즈 sm32 · md40 · lg48 · xl56.' }}
      >
          {/* 아바타 — 중앙 */}
          <div style={{
            position: 'absolute',
            left: '328px',
            top: '138px',
            width: '64px',
            height: '64px',
            zIndex: 3,
          }}>
            <div style={{
              position: 'relative',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#cdd0e0',
              border: '1.5px solid #b0b5cc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box'
            }}>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#6070a0', lineHeight: 1 }}>JD</span>
              {/* Status dot */}
              <div style={{
                position: 'absolute',
                bottom: '3px',
                right: '3px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#1ED45A',
                border: '2px solid #efefef',
              }} />
            </div>
          </div>

      </AnatomyFrame>
    );
  }

  const avatarPx = px;
  const radius = shape === 'circle' ? '50%' : shape === 'rounded' ? '28%' : '12px';
  const fontSize = px > 48 ? '20px' : px > 36 ? '16px' : '13px';

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard GOV', sans-serif" }}>
      <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>Variants</div>

      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* 좌: 미리보기 */}
        <div style={{ flex: 1.8, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{
              width: `${avatarPx}px`,
              height: `${avatarPx}px`,
              borderRadius: radius,
              background: showImage
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #3a4a7a 0%, #5a6a9e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}>
              {showImage ? (
                <svg width={avatarPx * 0.55} height={avatarPx * 0.55} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.9)" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) : (
                <span style={{ fontSize, fontWeight: '700', color: '#fff', letterSpacing: '-0.5px' }}>JD</span>
              )}
            </div>

            {/* Status indicator */}
            {status !== 'none' && (
              <div style={{
                position: 'absolute',
                bottom: shape === 'circle' ? '3%' : '4px',
                right: shape === 'circle' ? '3%' : '4px',
                width: `${Math.max(9, avatarPx * 0.22)}px`,
                height: `${Math.max(9, avatarPx * 0.22)}px`,
                borderRadius: '50%',
                background: statusColor,
                border: '2px solid #1e1e1e',
                transition: 'all 0.25s ease',
                boxShadow: `0 0 0 1px rgba(0,0,0,0.2)`,
              }} />
            )}
          </div>

          {/* 크기 레이블 */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '11px',
            color: '#555',
            background: '#2a2a2a',
            padding: '3px 10px',
            borderRadius: '20px',
            whiteSpace: 'nowrap',
          }}>
            {avatarPx}×{avatarPx}px
          </div>
        </div>

        {/* 우: 컨트롤 */}
        <div 
          className="ds-playground-controls"
          style={{ 
            width: '240px', 
            background: '#141414', 
            borderLeft: '1px solid #2a2a2a', 
            padding: '24px 20px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
            maxHeight: '360px',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}
        >
          {/* Size */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Size</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="Small (32px)" checked={size === 'sm'} onChange={() => setSize('sm')} />
              <PlaygroundRadioOption label="Medium (40px)" checked={size === 'md'} onChange={() => setSize('md')} />
              <PlaygroundRadioOption label="Large (48px)" checked={size === 'lg'} onChange={() => setSize('lg')} />
              <PlaygroundRadioOption label="XL (56px)" checked={size === 'xl'} onChange={() => setSize('xl')} />
            </div>
          </div>

          {/* Shape */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Shape</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="Circle" checked={shape === 'circle'} onChange={() => setShape('circle')} />
              <PlaygroundRadioOption label="Rounded" checked={shape === 'rounded'} onChange={() => setShape('rounded')} />
            </div>
          </div>

          {/* Status */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="None" checked={status === 'none'} onChange={() => setStatus('none')} />
              <PlaygroundRadioOption label="● Online" checked={status === 'online'} onChange={() => setStatus('online')} />
              <PlaygroundRadioOption label="● Idle" checked={status === 'idle'} onChange={() => setStatus('idle')} />
              <PlaygroundRadioOption label="● Busy" checked={status === 'busy'} onChange={() => setStatus('busy')} />
              <PlaygroundRadioOption label="● Offline" checked={status === 'offline'} onChange={() => setStatus('offline')} />
            </div>
          </div>

          {/* Type */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Type</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="Initials" checked={!showImage} onChange={() => setShowImage(false)} />
              <PlaygroundRadioOption label="Image" checked={showImage} onChange={() => setShowImage(true)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   AvatarGroupPlayground
───────────────────────────────────────────────────────────────── */
function AvatarGroupPlayground({ activeSubTab }) {
  const [count, setCount] = useState(5);
  const [max, setMax] = useState(4);
  const [overlap, setOverlap] = useState('md');

  const overlapPx = { sm: 8, md: 14, lg: 20 };
  const gap = -overlapPx[overlap];
  const AVATAR_SIZE = 40;
  const colors = [
    'linear-gradient(135deg,#667eea,#764ba2)',
    'linear-gradient(135deg,#f093fb,#f5576c)',
    'linear-gradient(135deg,#4facfe,#00f2fe)',
    'linear-gradient(135deg,#43e97b,#38f9d7)',
    'linear-gradient(135deg,#fa709a,#fee140)',
  ];
  const initials = ['JD', 'AK', 'SM', 'PL', 'RK'];
  const shown = Math.min(count, max);
  const extra = count - shown;

  if (activeSubTab === 'anatomy') {
    return (
      <AnatomyFrame
        card={{ w: 720, h: 340 }}
        linesBehind
        callouts={[
          { n: 1, x: 180, y: 170, line: { x1: 180, y1: 170, x2: 270, y2: 170 } },
          { n: 2, x: 296, y: 70, line: { x1: 296, y1: 70, x2: 296, y2: 144 } },
          { n: 3, x: 338, y: 270, line: { x1: 338, y1: 270, x2: 338, y2: 192 } },
          { n: 4, x: 540, y: 170, line: { x1: 540, y1: 170, x2: 450, y2: 170 } },
        ]}
        dims={[
          { dir: 'h', x: 338, y: 192, sp: 12 },
        ]}
        legend={[
          { n: 1, label: 'Group container (아바타 그룹 용기)' },
          { n: 2, label: 'Avatar item (개별 아바타)' },
          { n: 3, label: 'Overlap gap (중첩 간격)' },
          { n: 4, label: 'Overflow badge (오버플로 배지)' },
        ]}
        spec={{ rows: [
          ['중첩 간격', 'SP[12]', '12', '아바타 겹침(anatomy 기준)'],
          ['아바타 지름', '—', '44', '개별 아바타'],
          ['테두리', '—', '2', '링 border'],
        ], note: '※ 실동작 overlap sm8 · md14 · lg20 · 아바타 40. anatomy는 겹침 12 · 지름 44.' }}
      >
          {/* 아바타 그룹 — 카드 중앙 */}
          <div style={{
            position: 'absolute',
            left: '274px',
            top: '148px',
            width: '172px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            zIndex: 3,
          }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: colors[i],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '700',
                color: '#fff',
                border: '2px solid #efefef',
                marginLeft: i === 0 ? 0 : '-12px',
                zIndex: 4 - i,
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}>
                {initials[i]}
              </div>
            ))}
            {/* +N 버블 */}
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#d8d8e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: '700',
              color: '#666',
              border: '2px solid #efefef',
              marginLeft: '-12px',
              zIndex: 0,
            }}>+2</div>
          </div>

      </AnatomyFrame>
    );
  }

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard GOV', sans-serif" }}>
      <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>Variants</div>

      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* 좌: 미리보기 */}
        <div style={{ flex: 1.8, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {Array.from({ length: shown }).map((_, i) => (
              <div key={i} style={{
                width: `${AVATAR_SIZE}px`,
                height: `${AVATAR_SIZE}px`,
                borderRadius: '50%',
                background: colors[i % colors.length],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '700',
                color: '#fff',
                border: '2px solid #1e1e1e',
                marginLeft: i === 0 ? 0 : `${gap}px`,
                zIndex: shown - i,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.25s ease',
                flexShrink: 0,
              }}>
                {initials[i % initials.length]}
              </div>
            ))}
            {extra > 0 && (
              <div style={{
                width: `${AVATAR_SIZE}px`,
                height: `${AVATAR_SIZE}px`,
                borderRadius: '50%',
                background: '#2e2e2e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '700',
                color: '#888',
                border: '2px solid #1e1e1e',
                marginLeft: `${gap}px`,
                zIndex: 0,
                transition: 'all 0.25s ease',
                flexShrink: 0,
              }}>
                +{extra}
              </div>
            )}
          </div>
        </div>

        {/* 우: 컨트롤 */}
        <div 
          className="ds-playground-controls"
          style={{ 
            width: '240px', 
            background: '#141414', 
            borderLeft: '1px solid #2a2a2a', 
            padding: '24px 20px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
            maxHeight: '360px',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}
        >
          {/* Total Count */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Total Count</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[3, 4, 5, 6, 7].map(n => (
                <PlaygroundRadioOption 
                  key={n}
                  label={`${n}명`} 
                  checked={count === n} 
                  onChange={() => setCount(n)} 
                />
              ))}
            </div>
          </div>

          {/* Max Visible */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Max Visible</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[2, 3, 4, 5].map(n => (
                <PlaygroundRadioOption 
                  key={n}
                  label={`최대 ${n}개`} 
                  checked={max === n} 
                  onChange={() => setMax(n)} 
                />
              ))}
            </div>
          </div>

          {/* Overlap */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Overlap</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { value: 'sm', label: 'Small (8px)' },
                { value: 'md', label: 'Medium (14px)' },
                { value: 'lg', label: 'Large (20px)' },
              ].map(opt => (
                <PlaygroundRadioOption 
                  key={opt.value}
                  label={opt.label} 
                  checked={overlap === opt.value} 
                  onChange={() => setOverlap(opt.value)} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 공통 Playground 컨트롤 컴포넌트 */
function PlayControl({ label, value, onChange, options }) {
  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: value === opt.value ? '#3385FF' : '#2a2a2a',
              background: 'transparent',
              color: value === opt.value ? '#3385FF' : '#666',
              fontSize: '12px',
              fontWeight: value === opt.value ? '600' : '400',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
              fontFamily: "'Pretendard GOV', sans-serif",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PlayToggle({ label, value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{label}</div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: '100%',
          padding: '7px 10px',
          borderRadius: '6px',
          border: '1px solid',
          borderColor: value ? '#3385FF' : '#2a2a2a',
          background: 'transparent',
          color: value ? '#3385FF' : '#666',
          fontSize: '12px',
          fontWeight: value ? '600' : '400',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.15s',
          fontFamily: "'Pretendard GOV', sans-serif",
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{
          display: 'inline-block',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: value ? '#3385FF' : '#333',
          border: '1px solid',
          borderColor: value ? '#3385FF' : '#444',
          flexShrink: 0,
          transition: 'all 0.15s',
        }} />
        {value ? 'Image' : 'Initials'}
      </button>
    </div>
  );
}

/* callout 스타일 상수 */
const calloutStyle = {
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  backgroundColor: '#fff',
  color: '#111',
  fontSize: '11px',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 6px rgba(0,0,0,0.22)',
  userSelect: 'none',
  flexShrink: 0,
  cursor: 'default',
};

// ── anatomy 간격 명세용 치수선(dimension line) ────────────────────────────
//  간격 바(#eae6ff)와 통일된 보라 계열. dir 'h'=(x,y)→오른쪽 length / 'v'=(x,y)→아래 length.
//  양끝 tick + SP 토큰 라벨. 라벨은 SP 토큰값을 그대로 표기해 토큰과 동기화(리빙 스펙).
const DIM_C = '#8b5cf6';
function DimLabel({ children, style }) {
  return (
    <span style={{ position: 'absolute', fontSize: '10px', fontWeight: 700, color: '#6d28d9', background: '#fff', border: '1px solid #ddd6fe', borderRadius: '4px', padding: '0 4px', lineHeight: '15px', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.10)', zIndex: 7, ...style }}>{children}</span>
  );
}
// SP 토큰(Foundation 스케일, tokens.js)에서 px 파생 — 단일 출처 바인딩
const spNum = (key) => parseInt(SP[key], 10);
// 스펙 표 px 열 파생: 토큰 셀이 'SP[n]'이면 SP 토큰에서 px 계산(하드코딩 값 무시)
function spPxCell(row, j, cell) {
  if (j === 2 && typeof row[1] === 'string') {
    const m = row[1].match(/^SP\[(\d+)\]$/);
    if (m) return String(spNum(m[1]));
  }
  return cell;
}
function DimLine({ x, y, length, dir = 'h', label, sp }) {
  const t = 4; // tick 반길이
  if (sp != null) { length = spNum(sp); label = `SP[${sp}]`; } // sp 지정 시 토큰에서 길이·라벨 파생(단일 출처)
  if (dir === 'v') {
    return (
      <>
        <div style={{ position: 'absolute', left: x, top: y, width: 0, height: length, borderLeft: `1px solid ${DIM_C}`, zIndex: 6 }} />
        <div style={{ position: 'absolute', left: x - t, top: y, width: t * 2, height: 0, borderTop: `1px solid ${DIM_C}`, zIndex: 6 }} />
        <div style={{ position: 'absolute', left: x - t, top: y + length, width: t * 2, height: 0, borderTop: `1px solid ${DIM_C}`, zIndex: 6 }} />
        <DimLabel style={{ left: x + 7, top: y + length / 2, transform: 'translateY(-50%)' }}>{label}</DimLabel>
      </>
    );
  }
  return (
    <>
      <div style={{ position: 'absolute', left: x, top: y, width: length, height: 0, borderTop: `1px solid ${DIM_C}`, zIndex: 6 }} />
      <div style={{ position: 'absolute', left: x, top: y - t, width: 0, height: t * 2, borderLeft: `1px solid ${DIM_C}`, zIndex: 6 }} />
      <div style={{ position: 'absolute', left: x + length, top: y - t, width: 0, height: t * 2, borderLeft: `1px solid ${DIM_C}`, zIndex: 6 }} />
      <DimLabel style={{ left: x + length / 2, top: y - 17, transform: 'translateX(-50%)' }}>{label}</DimLabel>
    </>
  );
}

// anatomy 여백(padding) 하이라이트 — 컴포넌트 박스(x,y,w,h) + 패딩값(t/r/b/l)으로 4변 여백을 보라 반투명 표시.
//  치수선(DimLine)과 함께 "간격 표시" 토글에서 노출. List card 콘텐츠 바와 동일 보라 계열.
function PaddingFill({ x, y, w, h, t = 0, r, b, l }) {
  const rr = r ?? t, bb = b ?? t, ll = l ?? (r ?? t);
  const fill = 'rgba(139,92,246,0.20)';
  const strip = (s) => ({ position: 'absolute', background: fill, zIndex: 5, pointerEvents: 'none', ...s });
  return (
    <>
      {t > 0 && <div style={strip({ left: x, top: y, width: w, height: t })} />}
      {bb > 0 && <div style={strip({ left: x, top: y + h - bb, width: w, height: bb })} />}
      {ll > 0 && <div style={strip({ left: x, top: y + t, width: ll, height: h - t - bb })} />}
      {rr > 0 && <div style={strip({ left: x + w - rr, top: y + t, width: rr, height: h - t - bb })} />}
    </>
  );
}

// ── 간격 스펙 표 — 토큰 셀이 SP[n]이면 px 자동 파생(spPxCell). AnatomyFrame이 사용 ──
function SpacingSpecTable({ rows, note, maxW = 720 }) {
  return (
    <div style={{ maxWidth: `${maxW}px`, margin: '20px auto 0' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
        {['항목', '토큰', 'px', '용도'].map((h) => (<div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>))}
        {rows.map((r, i) => r.map((c, j) => (<div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>)))}
      </div>
      {note && <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>{note}</div>}
    </div>
  );
}

// ── AnatomyFrame — anatomy 표준 형식 단일 템플릿(디폴트). 새 anatomy는 이걸로만 만든다 ──
//  간격 표시 토글(기본 ON) + 라이트 카드 + 목업(children) + 번호 콜아웃/연결선
//  + 게이트 치수선/여백 하이라이트(dims) + 범례(legend) + 게이트 스펙 표(spec).
//  callouts: [{ n, x, y, line:{x1,y1,x2,y2}?, to:{x,y}?, dot?, sm? }] (line=정확선, to=원중심→끝점)
//  dims: [{ dir:'h'|'v', x, y, sp } | { ..., length, label } | { pad:{x,y,w,h,t,r,b,l} }]
//  legend: [{ n, label }]   spec: { rows:[[항목, 'SP[n]'|토큰문자열, 용도]], note }
//  legendGap: 범례 row-gap(기본 '12px 0', 일부 원본은 '14px 0') · linesBehind: 연결선 svg를 목업 뒤(zIndex 1)에 그림(원본이 svg zIndex 1일 때, 오버슛 가림 유지)
function AnatomyFrame({ card = {}, callouts = [], dims = [], legend = [], legendCols = 3, legendGap = '12px 0', linesBehind = false, spec = null, children }) {
  const [showSpacing, setShowSpacing] = useState(true);
  const w = card.w || 720, h = card.h || 360, bg = card.bg || '#efefef';
  return (
    <div style={{ width: '100%' }}>
      {/* 간격 표시 토글 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: `${w}px`, margin: '0 auto 10px' }}>
        <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
        </button>
      </div>
      {/* 라이트 카드 */}
      <div style={{ position: 'relative', background: bg, borderRadius: '16px', width: `${w}px`, height: `${h}px`, margin: '0 auto 24px', overflow: 'hidden', boxSizing: 'border-box' }}>
        {children}
        {callouts.some((c) => c.line || c.to) && (
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: linesBehind ? 1 : 3 }}>
            {callouts.map((c, i) => {
              const ln = c.line || (c.to ? { x1: c.x, y1: c.y, x2: c.to.x, y2: c.to.y } : null);
              if (!ln) return null;
              return (<g key={i}><line x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2} stroke="#999" strokeWidth="1.2" />{c.dot && <circle cx={ln.x2} cy={ln.y2} r="1.6" fill="#999" />}</g>);
            })}
          </svg>
        )}
        {callouts.map((c, i) => (
          <div key={i} style={{ position: 'absolute', left: `${c.x}px`, top: `${c.y}px`, transform: 'translate(-50%, -50%)', zIndex: 4, ...(c.sm ? calloutStyleSm : calloutStyle) }}>{c.n}</div>
        ))}
        {showSpacing && dims.map((d, i) => d.pad
          ? <PaddingFill key={i} {...d.pad} />
          : <DimLine key={i} dir={d.dir} x={d.x} y={d.y} length={d.length} label={d.label} sp={d.sp} />)}
      </div>
      {legend.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${legendCols}, 1fr)`, gap: legendGap, marginBottom: SP[16] }}>
          {legend.map((item) => (<div key={item.n} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>{item.n}. {item.label}</div>))}
        </div>
      )}
      {spec && showSpacing && <SpacingSpecTable rows={spec.rows} note={spec.note} maxW={w} />}
    </div>
  );
}

/**
 * Tooltip(present-tooltip) — Anatomy + Interactive.
 * 정본 토큰: 본문 #1a1a1a · 보더 #2e2e2e · radius 8 · 패딩 8/12 · 대상과 8px 간격 · 화살표 8px(본문 동일 배경) · 본문 14px.
 * 구성: 1 Container · 2 Arrow · 3 Label · 4 Shortcut.
 */
function TooltipPlayground({ activeSubTab }) {
  const [show, setShow] = useState(true);
  const [size, setSize] = useState('M'); // 툴팁 사이즈: S(컴팩트) / M(정본 기본)

  if (activeSubTab === 'anatomy') {
    return (
      <AnatomyFrame
        card={{ w: 720, h: 340 }}
        linesBehind
        callouts={[
          { n: 1, x: 360, y: 250, line: { x1: 360, y1: 232, x2: 360, y2: 188 }, dot: true },
          { n: 2, x: 360, y: 90, line: { x1: 360, y1: 108, x2: 360, y2: 146 }, dot: true },
          { n: 3, x: 230, y: 170, line: { x1: 243, y1: 170, x2: 322, y2: 170 }, dot: true },
          { n: 4, x: 490, y: 170, line: { x1: 477, y1: 170, x2: 398, y2: 170 }, dot: true },
        ]}
        dims={[
          { pad: { x: 310, y: 154, w: 100, h: 36, t: 8, l: 12, r: 12, b: 8 } },
          { dir: 'h', x: 310, y: 172, sp: 12 },
          { dir: 'v', x: 345, y: 155, sp: 8 },
        ]}
        legend={[
          { n: 1, label: 'Container' },
          { n: 2, label: 'Arrow' },
          { n: 3, label: 'Label' },
          { n: 4, label: 'Shortcut' },
        ]}
        spec={{ rows: [
          ['가로 패딩', 'SP[12]', '12', '본문 좌우'],
          ['세로 패딩', 'SP[8]', '8', '본문 상하'],
          ['라벨 ↔ 단축키', 'SP[8]', '8', '내부 요소 간격'],
          ['대상과 간격', 'SP[8]', '8', '툴팁↔대상(화살표 포함)'],
          ['화살표', '—', '8', '8×8 회전 사각'],
          ['모서리 반경', 'radius', '8', 'border-radius'],
        ], note: '※ 정본: MCP get_component(Tooltip). 이미 SP 스케일(8/12) 준수 — 정규화 불필요.' }}
      >
        {/* Tooltip 컴포넌트 — 중앙(anatomy는 화이트 톤으로 표현) */}
        <div style={{
          position: 'absolute', left: '50%', top: '154px', transform: 'translateX(-50%)',
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
          borderRadius: '8px', background: '#fff', border: '1px solid #e4e4e7',
          color: '#18181b', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', zIndex: 3,
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
        }}>
          <span>Label</span>
          <span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 500 }}>Ctrl+C</span>
          {/* 화살표: 본문과 동일 배경 8px, 위쪽 대상을 향함 */}
          <span style={{ position: 'absolute', left: '50%', top: '-5px', marginLeft: '-4px', width: '8px', height: '8px', background: '#fff', borderLeft: '1px solid #e4e4e7', borderTop: '1px solid #e4e4e7', transform: 'rotate(45deg)' }} />
        </div>
      </AnatomyFrame>
    );
  }

  // Interactive — 사이즈(S/M) 토글 + 정본 양식 툴팁(위쪽, 아래로 향한 화살표)
  // 툴팁이 일반적으로 쓰이는 두 사이즈: M = 정본 기본(Body 14px · 패딩 8×12 · radius 8),
  // S = 컴팩트 변형(12px · 패딩 5×9 · radius 6) — 좁은 공간의 짧은 라벨용.
  const SIZES = {
    S: { name: 'Small', pad: '5px 9px', font: '12px', gap: '6px', sc: '11px', radius: '6px' },
    M: { name: 'Medium', pad: '8px 12px', font: '14px', gap: '8px', sc: '12px', radius: '8px' },
  };
  const sz = SIZES[size];
  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      {/* 사이즈 토글 (S / M) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '12px', color: '#9a9aa2' }}>Size</span>
        {['S', 'M'].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setSize(k)}
            style={{
              minWidth: '34px', height: '26px', padding: '0 10px', borderRadius: '6px', cursor: 'pointer',
              fontSize: '12px', fontWeight: 600, fontFamily: 'inherit',
              color: size === k ? '#fff' : '#c9c9cf',
              background: size === k ? T.primary : '#2a2a30',
              border: `1px solid ${size === k ? T.primary : '#3a3a42'}`,
            }}
          >{k}</button>
        ))}
        <span style={{ fontSize: '11px', color: '#7a7a7a', marginLeft: '4px' }}>{sz.name} · {sz.font}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2a2a2a', borderRadius: '12px', height: '320px', background: '#1e1e1e', position: 'relative' }}>
        <div
          style={{ position: 'relative', display: 'inline-flex' }}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          {show && (
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
              display: 'inline-flex', alignItems: 'center', gap: sz.gap, padding: sz.pad,
              borderRadius: sz.radius, background: '#1a1a1a', border: '1px solid #2e2e2e',
              color: '#fff', fontSize: sz.font, fontWeight: 600, whiteSpace: 'nowrap',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}>
              복사 <span style={{ fontSize: sz.sc, color: '#9a9aa2', fontWeight: 500 }}>Ctrl+C</span>
              <span style={{ position: 'absolute', left: '50%', bottom: '-5px', marginLeft: '-4px', width: '8px', height: '8px', background: '#1a1a1a', borderRight: '1px solid #2e2e2e', borderBottom: '1px solid #2e2e2e', transform: 'rotate(45deg)' }} />
            </div>
          )}
          <button
            type="button"
            aria-label="복사"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '8px', background: '#2a2a30', border: '1px solid #3a3a42', color: '#e8e8ec', cursor: 'pointer' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 012-2h10" />
            </svg>
          </button>
        </div>
        <span style={{ position: 'absolute', bottom: '14px', left: 0, right: 0, textAlign: 'center', fontSize: '12px', color: '#7a7a7a' }}>
          버튼에 호버하면 Tooltip이 표시됩니다 (placement: top · size: {size})
        </span>
      </div>
    </div>
  );
}

const calloutStyleSm = {
  ...calloutStyle,
  width: '22px',
  height: '22px',
  fontSize: '10px',
  flexShrink: 0,
};

// Popup(present-popup) — 모달 대화상자. Anatomy(구조 도식) + Interactive(열기/닫기).
function PopupPlayground({ activeSubTab }) {
  const [open, setOpen] = useState(true);
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)

  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '720px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 */}
        <div style={{ position: 'relative', background: '#efefef', borderRadius: '16px', width: '720px', height: '360px', margin: '0 auto 24px', overflow: 'hidden', boxSizing: 'border-box' }}>
          {/* 3. Scrim (딤 배경) */}
          <div style={{ position: 'absolute', inset: '28px', borderRadius: '12px', background: '#8a8a90' }} />

          {/* 모달 본체 */}
          <div style={{
            position: 'absolute', left: '210px', top: '64px', width: '300px',
            background: '#ffffff', borderRadius: '12px', boxShadow: '0 12px 32px rgba(0,0,0,0.22)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 3, boxSizing: 'border-box',
          }}>
            {/* 1. Navigation (헤더: 타이틀 + 닫기) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid #ececef' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#18181b' }}>snap shot pop up</span>
              <Icon name="cancel" size={16} color="#18181b" />
            </div>
            {/* 2. Contents area */}
            <div style={{ margin: '14px 16px', height: '96px', background: '#eef0fb', borderRadius: '8px' }} />
            {/* 4. Action area */}
            <div style={{ padding: '0 16px 16px' }}>
              <div style={{ height: '40px', borderRadius: '8px', background: '#0066FF', color: '#fff', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Action</div>
            </div>
          </div>

          {/* 연결선 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4 }}>
            <line x1="184" y1="88" x2="208" y2="88" stroke="#999" strokeWidth="1.2" /><circle cx="208" cy="88" r="1.6" fill="#999" />
            <line x1="184" y1="172" x2="208" y2="172" stroke="#999" strokeWidth="1.2" /><circle cx="208" cy="172" r="1.6" fill="#999" />
            <line x1="120" y1="300" x2="120" y2="286" stroke="#999" strokeWidth="1.2" /><circle cx="120" cy="286" r="1.6" fill="#999" />
            <line x1="538" y1="254" x2="512" y2="254" stroke="#999" strokeWidth="1.2" /><circle cx="512" cy="254" r="1.6" fill="#999" />
          </svg>

          {/* 콜아웃 */}
          <div style={{ position: 'absolute', left: '168px', top: '88px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '168px', top: '172px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '120px', top: '314px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle }}>3</div>
          <div style={{ position: 'absolute', left: '552px', top: '254px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle }}>4</div>

          {/* 간격 치수선 — 모든 섹션 좌우 패딩 SP[16] · 헤더 상하 패딩 SP[12](13→12) */}
          {showSpacing && (
            <>
              <PaddingFill x={210} y={64} w={300} h={226} t={0} l={16} r={16} b={0} />
              <DimLine dir="h" x={210} y={200} sp={16} />{/* 좌우 패딩 */}
              <DimLine dir="v" x={250} y={64} sp={12} />{/* 헤더 상단 패딩 */}
            </>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Navigation' },
            { num: 2, label: 'Contents area' },
            { num: 3, label: 'Scrim' },
            { num: 4, label: 'Action area' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>

        {/* 간격 스펙 표 */}
        {showSpacing && (
        <div style={{ maxWidth: '720px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (<div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>))}
            {[
              ['좌우 패딩', 'SP[16]', '16', '모든 섹션 좌우 여백'],
              ['헤더 상하 패딩', 'SP[12]', '13', 'Navigation 상하'],
              ['콘텐츠 여백', 'SP[12]', '14', 'Contents 상하 margin'],
              ['하단 여백', 'SP[16]', '16', 'Action area 하단'],
              ['버튼 간 간격', 'SP[8]', '8', '액션 버튼 간격(실동작)'],
              ['모서리 반경', 'radius', '12', 'border-radius'],
            ].map((r, i) => r.map((c, j) => (<div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>)))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ off-grid 헤더 13→SP[12] · 콘텐츠 14→SP[12] 정규화. 좌우 16 = SP[16] 준수.</div>
        </div>
        )}
      </div>
    );
  }

  // Interactive — 트리거로 모달 열기/닫기(정본 다크 룩: 딤 배경 + 패널 #1a1a1a)
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2a2a2a', borderRadius: '12px', height: '360px', background: '#1e1e1e', position: 'relative', overflow: 'hidden' }}>
        {!open && (
          <button type="button" onClick={() => setOpen(true)}
            style={{ height: '36px', padding: '0 16px', borderRadius: '8px', background: '#2a2a30', border: '1px solid #3a3a42', color: '#e8e8ec', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            팝업 열기
          </button>
        )}
        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
            <div style={{ position: 'relative', zIndex: 2, width: '320px', background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: '8px', boxShadow: '0 16px 48px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #2e2e2e' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>snap shot pop up</span>
                <span onClick={() => setOpen(false)} style={{ display: 'inline-flex', cursor: 'pointer' }}><Icon name="cancel" size={16} color="#9a9aa2" /></span>
              </div>
              <div style={{ padding: '16px', fontSize: '14px', lineHeight: 1.6, color: '#888' }}>현재 화면을 스냅샷으로 저장할까요?</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '0 16px 16px' }}>
                <button type="button" onClick={() => setOpen(false)} style={{ height: '36px', padding: '0 14px', borderRadius: '8px', background: 'transparent', border: '1px solid #2e2e2e', color: '#888', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>취소</button>
                <button type="button" onClick={() => setOpen(false)} style={{ height: '36px', padding: '0 14px', borderRadius: '8px', background: T.primary, border: `1px solid ${T.primary}`, color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>확인</button>
              </div>
            </div>
          </>
        )}
        <span style={{ position: 'absolute', bottom: '14px', left: 0, right: 0, textAlign: 'center', fontSize: '12px', color: '#7a7a7a' }}>
          딤 영역 클릭 또는 취소/확인으로 닫힙니다
        </span>
      </div>
    </div>
  );
}

// 우클릭 컨텍스트 메뉴(Menu) — PREVAX 실시간 영상 videoContext 정본.
// 아이콘·순서는 Figma "Component 24"(783:1750) 세트를 따른다(keep → settings → …).
const CTX_MENU_ITEMS = [
  { label: '영상 분석 설정', icon: 'settings' },
  { label: '카메라 연동 분석 설정', sepAfter: true, icon: 'settings_video_camera' },
  { label: '선택 영상 재연결', icon: 'replace_video' },
  { label: '카메라 연결 테스트', sepBefore: true, icon: 'automation' },
  { label: '카메라 웹 연결', icon: 'language' },
  { label: '카메라 점검모드로 전환', icon: 'flip_camera_ios' },
];
const ctxMenuItemStyle = (extra) => ({ display: 'flex', alignItems: 'center', gap: SP[8], padding: `${SP[8]} ${SP[12]}`, ...TYPE.caption1, color: '#d4d4d8', cursor: 'pointer', whiteSpace: 'nowrap', ...extra });

function ContextMenuBody({ pinned = false, onPin, onPick }) {
  return (
    <div onClick={(e) => e.stopPropagation()} style={{ width: '216px', background: '#1E2229', border: '1px solid #2c3540', borderRadius: '8px', boxShadow: '0 18px 48px rgba(0,0,0,0.72)', padding: `${SP[4]} 0`, overflow: 'hidden' }}>
      <div onClick={onPin} style={ctxMenuItemStyle({ color: '#ffd699', fontWeight: W.bold, borderBottom: '1px solid #2c3540' })}>
        <span style={{ width: '14px', height: '14px', flexShrink: 0, display: 'inline-flex' }}><Icon name="keep" size={14} color={T.cautionary} /></span>
        {pinned ? '고정 해제' : '고정'}
      </div>
      {CTX_MENU_ITEMS.map((m) => (
        <div key={m.label} onClick={onPick} style={ctxMenuItemStyle({ ...(m.sepBefore ? { borderTop: '1px solid #2c3540' } : {}), ...(m.sepAfter ? { borderBottom: '1px solid #2c3540' } : {}) })}>
          <span style={{ width: '14px', height: '14px', flexShrink: 0, display: 'inline-flex' }}><Icon name={m.icon} size={14} color="#8a8a92" /></span>
          {m.label}
        </div>
      ))}
    </div>
  );
}

function ContextMenuPlayground({ activeSubTab }) {
  const [menu, setMenu] = useState(null); // {x,y}
  const [pinned, setPinned] = useState(false);
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)

  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '760px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 — Text field anatomy와 동일 시각 언어(흰 패널 + 흰 콜아웃) */}
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '760px', height: '340px', margin: '0 auto 24px', boxSizing: 'border-box' }}>
          {/* 5. 컨테이너 — 메뉴 패널(흰 패널), center x=380 */}
          <div style={{ position: 'absolute', left: '260px', top: '52px', width: '240px', height: '232px', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', zIndex: 2 }} />
          {/* 1. 강조 항목 — 강조 색상으로 부각된 행(미세 하이라이트) */}
          <div style={{ position: 'absolute', left: '261px', top: '60px', width: '238px', height: '40px', background: 'rgba(255,169,56,0.08)', borderRadius: '7px 7px 0 0', zIndex: 2 }} />
          <div style={{ position: 'absolute', left: '272px', top: '73px', width: '14px', height: '14px', borderRadius: '4px', background: 'rgba(255,169,56,0.5)', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '294px', top: '71px', zIndex: 3, fontSize: TYPE.label2.fontSize, fontWeight: W.bold, color: '#8a6d3b' }}>Label</div>
          {/* 4. 구분선 */}
          <div style={{ position: 'absolute', left: '260px', top: '100px', width: '240px', height: '1px', background: '#e4e4e7', zIndex: 3 }} />
          {/* 일반 행 — 아이콘(점선 placeholder) + 라벨(스켈레톤 바) */}
          <div style={{ position: 'absolute', left: '272px', top: '119px', width: '14px', height: '14px', border: '1.5px dashed #a1a1aa', borderRadius: '4px', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '294px', top: '122px', width: '140px', height: '9px', background: '#d4d4d8', borderRadius: '4px', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '272px', top: '159px', width: '14px', height: '14px', border: '1.5px dashed #a1a1aa', borderRadius: '4px', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '294px', top: '162px', width: '120px', height: '9px', background: '#d4d4d8', borderRadius: '4px', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '272px', top: '199px', width: '14px', height: '14px', border: '1.5px dashed #a1a1aa', borderRadius: '4px', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '294px', top: '202px', width: '150px', height: '9px', background: '#d4d4d8', borderRadius: '4px', zIndex: 3 }} />

          {/* SVG 연결선 — 요소 경계까지 정확히 그음 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4 }}>
            {/* 1. 고정 항목 좌측 경계(x=260) y=80 */}
            <line x1="240" y1="80" x2="260" y2="80" stroke="#999" strokeWidth="1.2" /><circle cx="260" cy="80" r="1.6" fill="#999" />
            {/* 2. 아이콘 좌측 경계(x=272) y=126 */}
            <line x1="240" y1="126" x2="272" y2="126" stroke="#999" strokeWidth="1.2" /><circle cx="272" cy="126" r="1.6" fill="#999" />
            {/* 3. 라벨 우측 경계(x=414) y=166 */}
            <line x1="520" y1="166" x2="414" y2="166" stroke="#999" strokeWidth="1.2" /><circle cx="414" cy="166" r="1.6" fill="#999" />
            {/* 4. 구분선 우측 경계(x=500) y=100 */}
            <line x1="520" y1="100" x2="500" y2="100" stroke="#999" strokeWidth="1.2" /><circle cx="500" cy="100" r="1.6" fill="#999" />
            {/* 5. 컨테이너 상단 경계(y=52) x=380 */}
            <line x1="380" y1="36" x2="380" y2="52" stroke="#999" strokeWidth="1.2" /><circle cx="380" cy="52" r="1.6" fill="#999" />
          </svg>
          {/* Callouts — 흰 원 + 검정 텍스트 */}
          <div style={{ position: 'absolute', left: '226px', top: '80px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>1</div>
          <div style={{ position: 'absolute', left: '226px', top: '126px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>2</div>
          <div style={{ position: 'absolute', left: '534px', top: '166px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>3</div>
          <div style={{ position: 'absolute', left: '534px', top: '100px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>4</div>
          <div style={{ position: 'absolute', left: '380px', top: '28px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>5</div>

          {/* 간격 치수선 — 토글 시 표시(SP 토큰). 실제 메뉴 스펙에 맞춤(행 가로 SP[12]·아이콘↔라벨 SP[8]) */}
          {showSpacing && (
            <>
              <DimLine dir="h" x={260} y={126} sp={12} />{/* 행 좌측 패딩(아이콘 들여쓰기) */}
              <DimLine dir="h" x={286} y={166} sp={8} />{/* 아이콘↔라벨 */}
            </>
          )}
        </div>
        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 0' }}>
          {[
            { num: 1, label: '강조 기능 (Emphasis)' },
            { num: 2, label: '아이콘 (Icon)' },
            { num: 3, label: '라벨 (Label)' },
            { num: 4, label: '구분선 (Divider)' },
            { num: 5, label: '컨테이너 (메뉴 패널)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>{item.num}. {item.label}</div>
          ))}
        </div>

        {/* 간격 스펙 표 — 실제 메뉴(ctxMenuItem) 기준. 세로 패딩 7→SP[8] 정규화 */}
        {showSpacing && (
        <div style={{ maxWidth: '760px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (
              <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>
            ))}
            {[
              ['행 세로 패딩', 'SP[8]', '8', '항목 상하(7→8 정규화)'],
              ['행 가로 패딩', 'SP[12]', '12', '항목 좌우·아이콘 들여쓰기'],
              ['아이콘 ↔ 라벨', 'SP[8]', '8', '내부 요소 간격'],
              ['패널 세로 패딩', 'SP[4]', '4', '메뉴 상하 여백'],
              ['모서리 반경', 'radius', '8', 'Panel border-radius'],
            ].map((r, i) => r.map((c, j) => (
              <div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>
            )))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 실제 메뉴 행 세로 패딩 7→SP[8] 정규화, anatomy 들여쓰기도 실제(SP[12])에 맞춤 → 스펙 일치.</div>
        </div>
        )}
      </div>
    );
  }

  // Interactive — 캔버스 우클릭으로 메뉴 열기
  const openAt = (e) => {
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    setMenu({ x: Math.min(e.clientX - r.left, r.width - 224), y: Math.min(e.clientY - r.top, r.height - 250) });
  };
  return (
    <div style={{ width: '100%' }}>
      <div onContextMenu={openAt} onClick={() => setMenu(null)}
        style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2a2a2a', borderRadius: '12px', height: '360px', background: '#0e0e10', overflow: 'hidden', cursor: 'context-menu' }}>
        <span style={{ fontSize: TYPE.label2.fontSize, color: '#7a7a7a' }}>영상 영역에서 마우스 오른쪽 버튼을 클릭하세요{pinned ? ' · 현재 고정됨' : ''}</span>
        {menu && (
          <div style={{ position: 'absolute', left: `${menu.x}px`, top: `${menu.y}px`, zIndex: 40 }}>
            <ContextMenuBody pinned={pinned} onPin={() => { setPinned((v) => !v); setMenu(null); }} onPick={() => setMenu(null)} />
          </div>
        )}
      </div>
    </div>
  );
}

// Progress indicator(nav-progress-indicator) — 진행률(0~100%)을 선형/원형으로 시각화.
//  구성: 트랙 · 채움 · 퍼센트 라벨 · 원형 변형.
function ProgressIndicatorPlayground({ activeSubTab }) {
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  if (activeSubTab === 'anatomy') {
    const R = 18, C = 2 * Math.PI * R;
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '760px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '760px', height: '300px', margin: '0 auto 24px', boxSizing: 'border-box' }}>
          {/* 선형: 1. 트랙 + 2. 채움 (top 128, height 8) */}
          <div style={{ position: 'absolute', left: '210px', top: '128px', width: '320px', height: '8px', borderRadius: '4px', background: '#e4e4e7', zIndex: 2 }} />
          <div style={{ position: 'absolute', left: '210px', top: '128px', width: '192px', height: '8px', borderRadius: '4px', background: T.primary, zIndex: 3 }} />
          {/* 3. 퍼센트 라벨 */}
          <div style={{ position: 'absolute', left: '548px', top: '121px', zIndex: 3, fontSize: TYPE.label1.fontSize, color: '#6a6a6a' }}>60%</div>
          {/* 4. 원형 변형 (center 320,208) */}
          <svg width="40" height="40" viewBox="0 0 40 40" style={{ position: 'absolute', left: '300px', top: '188px', zIndex: 3 }}>
            <circle cx="20" cy="20" r={R} fill="none" stroke="#e4e4e7" strokeWidth="4" />
            <circle cx="20" cy="20" r={R} fill="none" stroke={T.primary} strokeWidth="4" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * 0.4} transform="rotate(-90 20 20)" />
          </svg>

          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4 }}>
            {/* 2. 채움 상단(y=128) x=300 */}
            <line x1="300" y1="80" x2="300" y2="128" stroke="#999" strokeWidth="1.2" /><circle cx="300" cy="128" r="1.6" fill="#999" />
            {/* 1. 트랙 상단(y=128) x=470 (미채움부) */}
            <line x1="470" y1="80" x2="470" y2="128" stroke="#999" strokeWidth="1.2" /><circle cx="470" cy="128" r="1.6" fill="#999" />
            {/* 3. 퍼센트 상단(y=118) x=562 */}
            <line x1="562" y1="80" x2="562" y2="118" stroke="#999" strokeWidth="1.2" /><circle cx="562" cy="118" r="1.6" fill="#999" />
            {/* 4. 원형 하단(y=228) x=320 */}
            <line x1="320" y1="262" x2="320" y2="228" stroke="#999" strokeWidth="1.2" /><circle cx="320" cy="228" r="1.6" fill="#999" />
          </svg>
          <div style={{ position: 'absolute', left: '300px', top: '68px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>2</div>
          <div style={{ position: 'absolute', left: '470px', top: '68px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>1</div>
          <div style={{ position: 'absolute', left: '562px', top: '68px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>3</div>
          <div style={{ position: 'absolute', left: '320px', top: '274px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>4</div>

          {/* 간격 치수선 — 토글 시 표시(SP 토큰). 트랙 높이 SP[8] */}
          {showSpacing && (
            <DimLine dir="v" x={540} y={128} sp={8} />
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px 0' }}>
          {[
            { num: 1, label: '트랙 (Track)' },
            { num: 2, label: '채움 (Fill)' },
            { num: 3, label: '퍼센트 라벨 (Percent)' },
            { num: 4, label: '원형 변형 (Circular)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>{item.num}. {item.label}</div>
          ))}
        </div>

        {/* 간격 스펙 표 — Progress indicator. 이미 SP 준수(트랙 8·radius 4) */}
        {showSpacing && (
        <div style={{ maxWidth: '760px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (
              <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>
            ))}
            {[
              ['선형 트랙/채움 높이', 'SP[8]', '8', '바 두께'],
              ['모서리 반경', 'SP[4]', '4', '트랙·채움'],
              ['원형 지름', 'SP[40]', '40', '원형 변형'],
              ['원형 스트로크', 'SP[4]', '4', '원형 두께'],
            ].map((r, i) => r.map((c, j) => (
              <div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>
            )))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 이미 SP 스케일(8/4/40) 준수 — 정규화 불필요.</div>
        </div>
        )}
      </div>
    );
  }

  // Interactive — variant(선형/원형) × mode(determinate/indeterminate) × value
  const [variant, setVariant] = useState('linear');
  const [indet, setIndet] = useState(false);
  const [value, setValue] = useState(60);
  const R = 18, C = 2 * Math.PI * R;
  const fillColor = value >= 100 ? T.positive : T.primary;
  const seg = (val, cur, set, label) => (
    <button key={label} type="button" onClick={() => set(val)} style={{
      height: 30, padding: `0 ${SP[12]}`, borderRadius: 6, cursor: 'pointer', fontFamily: T.font,
      fontSize: TYPE.caption1.fontSize, fontWeight: cur === val ? W.semibold : W.regular,
      background: cur === val ? 'rgba(0,102,255,0.12)' : '#2a2a30',
      border: `1px solid ${cur === val ? T.primary : '#3a3a42'}`, color: cur === val ? T.primaryStrong : '#d4d4d8',
    }}>{label}</button>
  );
  return (
    <div style={{ width: '100%' }}>
      <style>{'@keyframes piBar{0%{left:-40%}100%{left:100%}}@keyframes piSpin{to{transform:rotate(360deg)}}'}</style>
      <div style={{ display: 'flex', gap: SP[16], flexWrap: 'wrap', alignItems: 'center', marginBottom: SP[16] }}>
        <div style={{ display: 'flex', gap: SP[4], alignItems: 'center' }}>
          <span style={{ fontSize: TYPE.caption1.fontSize, color: '#9a9aa2', marginRight: SP[4] }}>variant</span>
          {seg('linear', variant, setVariant, 'linear')}{seg('circular', variant, setVariant, 'circular')}
        </div>
        <button type="button" onClick={() => setIndet((v) => !v)} style={{
          height: 30, padding: `0 ${SP[12]}`, borderRadius: 6, cursor: 'pointer', fontFamily: T.font,
          fontSize: TYPE.caption1.fontSize, background: indet ? 'rgba(0,102,255,0.12)' : '#2a2a30',
          border: `1px solid ${indet ? T.primary : '#3a3a42'}`, color: indet ? T.primaryStrong : '#d4d4d8',
        }}>{indet ? '✓ indeterminate' : '○ determinate'}</button>
        {!indet && (
          <input type="range" min={0} max={100} value={value} onChange={(e) => setValue(Number(e.target.value))} style={{ width: 160, accentColor: T.primary }} />
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '160px', border: '1px solid #2a2a2a', borderRadius: '12px', background: '#1a1a1a', padding: SP[24] }}>
        {variant === 'linear' ? (
          <div style={{ width: '320px', display: 'flex', alignItems: 'center', gap: SP[12] }}>
            <div style={{ position: 'relative', flex: 1, height: 6, borderRadius: 4, background: '#2e2e2e', overflow: 'hidden' }}>
              {indet
                ? <div style={{ position: 'absolute', top: 0, width: '40%', height: '100%', borderRadius: 4, background: T.primary, animation: 'piBar 1.4s linear infinite' }} />
                : <div style={{ width: `${value}%`, height: '100%', borderRadius: 4, background: fillColor, transition: 'width 0.2s' }} />}
            </div>
            {!indet && <span style={{ fontSize: TYPE.label1.fontSize, color: '#888', minWidth: 40, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{value}%</span>}
          </div>
        ) : (
          <div style={{ position: 'relative', width: 40, height: 40 }}>
            <svg width="40" height="40" viewBox="0 0 40 40" style={indet ? { animation: 'piSpin 0.9s linear infinite' } : undefined}>
              <circle cx="20" cy="20" r={R} fill="none" stroke="#2e2e2e" strokeWidth="4" />
              <circle cx="20" cy="20" r={R} fill="none" stroke={fillColor} strokeWidth="4" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={indet ? C * 0.75 : C * (1 - value / 100)} transform="rotate(-90 20 20)" />
            </svg>
            {!indet && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: TYPE.caption2.fontSize, fontWeight: W.bold, color: '#e8e8ec' }}>{value}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

// Pagination(nav-pagination) — 번호 버튼 + 이전/다음으로 페이지 이동, 현재 페이지 강조.
//  구성: 이전 화살표 · 활성 페이지 · 비활성 번호 · 생략 표시 · 다음 화살표.
function paginationRange(cur, total, sib = 1) {
  const set = new Set([1, total]);
  for (let i = cur - sib; i <= cur + sib; i++) if (i >= 1 && i <= total) set.add(i);
  const arr = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of arr) { if (p - prev > 1) out.push('...'); out.push(p); prev = p; }
  return out;
}
function PaginationPlayground({ activeSubTab }) {
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  if (activeSubTab === 'anatomy') {
    // 버튼 top 124(32px) · 중심 y=140
    const cellBase = { position: 'absolute', top: '124px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', zIndex: 3, fontSize: TYPE.label1.fontSize };
    const inactive = { ...cellBase, width: '32px', background: '#fff', border: '1px solid #e4e4e7', color: '#a1a1aa' };
    const arrow = { ...inactive };
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '760px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '760px', height: '280px', margin: '0 auto 24px', boxSizing: 'border-box' }}>
          {/* 셀 피치 36 = 32(셀) + SP[4](간격), 실제 pagination과 일치 */}
          {/* 1. 이전 화살표 */}
          <div style={{ ...arrow, left: '248px' }}>‹</div>
          {/* 3. 비활성 번호 */}
          <div style={{ ...inactive, left: '284px' }}>1</div>
          {/* 2. 활성 페이지 */}
          <div style={{ ...cellBase, left: '320px', width: '32px', background: T.primary, color: '#fff', fontWeight: W.bold }}>2</div>
          <div style={{ ...inactive, left: '356px' }}>3</div>
          {/* 4. 생략 표시 */}
          <div style={{ ...cellBase, left: '392px', width: '24px', color: '#a1a1aa' }}>…</div>
          <div style={{ ...inactive, left: '420px' }}>12</div>
          {/* 5. 다음 화살표 */}
          <div style={{ ...arrow, left: '456px' }}>›</div>

          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4 }}>
            {/* 2. 활성 상단(y=124) x=336 */}
            <line x1="336" y1="72" x2="336" y2="124" stroke="#999" strokeWidth="1.2" /><circle cx="336" cy="124" r="1.6" fill="#999" />
            {/* 4. 생략 상단(y=124) x=404 */}
            <line x1="404" y1="72" x2="404" y2="124" stroke="#999" strokeWidth="1.2" /><circle cx="404" cy="124" r="1.6" fill="#999" />
            {/* 5. 다음 상단(y=124) x=472 */}
            <line x1="472" y1="72" x2="472" y2="124" stroke="#999" strokeWidth="1.2" /><circle cx="472" cy="124" r="1.6" fill="#999" />
            {/* 1. 이전 하단(y=156) x=264 */}
            <line x1="264" y1="208" x2="264" y2="156" stroke="#999" strokeWidth="1.2" /><circle cx="264" cy="156" r="1.6" fill="#999" />
            {/* 3. 비활성 하단(y=156) x=372 */}
            <line x1="372" y1="208" x2="372" y2="156" stroke="#999" strokeWidth="1.2" /><circle cx="372" cy="156" r="1.6" fill="#999" />
          </svg>
          <div style={{ position: 'absolute', left: '336px', top: '60px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>2</div>
          <div style={{ position: 'absolute', left: '404px', top: '60px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>4</div>
          <div style={{ position: 'absolute', left: '472px', top: '60px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>5</div>
          <div style={{ position: 'absolute', left: '264px', top: '220px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>1</div>
          <div style={{ position: 'absolute', left: '372px', top: '220px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>3</div>

          {/* 간격 치수선 — 토글 시 표시(SP 토큰). 셀 32 + 셀 간격 SP[4] */}
          {showSpacing && (
            <>
              <DimLine dir="h" x={284} y={172} length={32} label="32" />{/* 셀 폭 */}
              <DimLine dir="h" x={316} y={140} sp={4} />{/* 셀 간격 */}
            </>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 0' }}>
          {[
            { num: 1, label: '이전 화살표 (Prev)' },
            { num: 2, label: '활성 페이지 (Active)' },
            { num: 3, label: '비활성 번호 (Inactive)' },
            { num: 4, label: '생략 표시 (Ellipsis)' },
            { num: 5, label: '다음 화살표 (Next)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>{item.num}. {item.label}</div>
          ))}
        </div>

        {/* 간격 스펙 표 — 실제 Pagination 기준. 셀 간격 anatomy 8→SP[4]로 정합 */}
        {showSpacing && (
        <div style={{ maxWidth: '760px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (
              <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>
            ))}
            {[
              ['셀 간격', 'SP[4]', '4', '번호·화살표 사이(8→4 정합)'],
              ['셀 크기', '—', '32', '번호·화살표 버튼'],
              ['생략 표시 폭', '—', '24', 'Ellipsis'],
              ['모서리 반경', 'radius', '8', 'border-radius'],
            ].map((r, i) => r.map((c, j) => (
              <div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>
            )))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 실제 pagination은 셀 간격 SP[4] — anatomy(8)를 SP[4]로 맞춰 일치.</div>
        </div>
        )}
      </div>
    );
  }

  // Interactive — 번호/화살표로 페이지 이동(생략 표시 포함)
  const TOTAL = 12;
  const [cur, setCur] = useState(1);
  const cell = (content, { active = false, disabled = false, onClick } = {}) => (
    <button type="button" onClick={onClick} disabled={disabled} style={{
      width: 32, height: 32, borderRadius: 8, cursor: disabled ? 'default' : onClick ? 'pointer' : 'default', fontFamily: T.font,
      fontSize: TYPE.label1.fontSize, fontWeight: active ? W.bold : W.regular,
      background: active ? T.primary : 'transparent',
      border: `1px solid ${active ? T.primary : disabled ? '#2a2a2a' : '#2e2e2e'}`,
      color: active ? '#fff' : disabled ? '#5a5a62' : '#8a8a92',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box',
    }}>{content}</button>
  );
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP[4], minHeight: '160px', border: '1px solid #2a2a2a', borderRadius: '12px', background: '#1a1a1a', padding: SP[24] }}>
        {cell('‹', { disabled: cur === 1, onClick: cur === 1 ? undefined : () => setCur((v) => v - 1) })}
        {paginationRange(cur, TOTAL).map((p, i) => (
          p === '...'
            ? <span key={`e${i}`} style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#8a8a92', fontSize: TYPE.label1.fontSize }}>…</span>
            : <span key={p}>{cell(p, { active: p === cur, onClick: () => setCur(p) })}</span>
        ))}
        {cell('›', { disabled: cur === TOTAL, onClick: cur === TOTAL ? undefined : () => setCur((v) => v + 1) })}
      </div>
    </div>
  );
}

// Page counter(nav-page-counter) — 콘텐츠 내 현재 위치를 숫자로 알리는 정보성(수동) 인디케이터.
//  구성: 현재 값 · 구분자(/) · 전체 값. 인터랙션 없음 — 갤러리·슬라이더·문서 뷰어 진행 표시.
function PageCounterPlayground({ activeSubTab }) {
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)

  // 정본(nav-page-counter) 수동 인디케이터 — 현재 값(강조 가능) / 구분자 / 전체 값
  const PageCounter = ({ current, total, size = 'md', emphasis = false, onLight = false }) => {
    const fs = size === 'sm' ? TYPE.caption1.fontSize : size === 'lg' ? TYPE.body1.fontSize : TYPE.label1.fontSize;
    const single = total <= 1;
    const muted = onLight ? '#9a9aa2' : '#888';
    const curColor = emphasis ? T.primaryStrong : (onLight ? '#18181b' : '#e8e8ec');
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP[4], padding: `${SP[4]} ${SP[8]}`, borderRadius: 8, fontFamily: T.font, fontSize: fs, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
        {single ? (
          <span style={{ color: muted, fontWeight: W.medium }}>{Math.min(current, total)}</span>
        ) : (
          <>
            <strong style={{ color: curColor, fontWeight: W.bold }}>{Math.min(current, total)}</strong>
            <span style={{ color: muted, fontWeight: W.regular }}>/</span>
            <span style={{ color: muted, fontWeight: W.regular }}>{total}</span>
          </>
        )}
      </span>
    );
  };

  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '760px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 */}
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '760px', height: '280px', margin: '0 auto 24px', boxSizing: 'border-box', overflow: 'hidden' }}>
          {/* 4. 컨테이너 pill */}
          <div style={{ position: 'absolute', left: '296px', top: '104px', width: '168px', height: '68px', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '14px', zIndex: 2 }} />
          {/* 1. 현재 값 */}
          <div style={{ position: 'absolute', left: '328px', top: '120px', zIndex: 3, fontSize: '32px', fontWeight: W.bold, color: '#18181b', lineHeight: 1 }}>6</div>
          {/* 2. 구분자 */}
          <div style={{ position: 'absolute', left: '366px', top: '121px', zIndex: 3, fontSize: '30px', color: '#a1a1aa', lineHeight: 1 }}>/</div>
          {/* 3. 전체 값 */}
          <div style={{ position: 'absolute', left: '392px', top: '120px', zIndex: 3, fontSize: '32px', color: '#a1a1aa', lineHeight: 1 }}>32</div>

          {/* SVG 연결선 — 요소 경계까지 정확히 그음 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4 }}>
            {/* 1. 현재 값 위 (x=337) */}
            <line x1="337" y1="66" x2="337" y2="104" stroke="#999" strokeWidth="1.2" /><circle cx="337" cy="104" r="1.6" fill="#999" />
            {/* 3. 전체 값 위 (x=408) */}
            <line x1="408" y1="66" x2="408" y2="104" stroke="#999" strokeWidth="1.2" /><circle cx="408" cy="104" r="1.6" fill="#999" />
            {/* 2. 구분자 아래 (x=372) */}
            <line x1="372" y1="214" x2="372" y2="172" stroke="#999" strokeWidth="1.2" /><circle cx="372" cy="172" r="1.6" fill="#999" />
            {/* 4. 컨테이너 우측 (y=138) */}
            <line x1="490" y1="138" x2="464" y2="138" stroke="#999" strokeWidth="1.2" /><circle cx="464" cy="138" r="1.6" fill="#999" />
          </svg>
          <div style={{ position: 'absolute', left: '337px', top: '58px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>1</div>
          <div style={{ position: 'absolute', left: '408px', top: '58px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>3</div>
          <div style={{ position: 'absolute', left: '372px', top: '224px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>2</div>
          <div style={{ position: 'absolute', left: '508px', top: '138px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>4</div>

          {/* 간격 치수선 — 토글 시 표시(SP 토큰). 값↔구분자 gap SP[4] */}
          {showSpacing && (
            <DimLine dir="h" x={347} y={188} sp={4} />
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px 0' }}>
          {[
            { num: 1, label: '현재 값 (Current)' },
            { num: 2, label: '구분자 (Separator)' },
            { num: 3, label: '전체 값 (Total)' },
            { num: 4, label: '컨테이너 (Container)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>{item.num}. {item.label}</div>
          ))}
        </div>

        {/* 간격 스펙 표 — Page counter (정보성 요소, 값 사이 SP[4] / 컨테이너 패딩 SP[8]) */}
        {showSpacing && (
        <div style={{ maxWidth: '760px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (
              <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>
            ))}
            {[
              ['요소 간격(값↔구분자)', 'SP[4]', '4', '현재·구분자·전체 사이'],
              ['컨테이너 좌우 패딩', 'SP[8]', '8', 'padding 0 8px'],
              ['모서리 반경', 'radius', '8', 'border-radius'],
              ['크기(기본 md)', '—', '14', 'sm 12 / md 14 / lg 16'],
            ].map((r, i) => r.map((c, j) => (
              <div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>
            )))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 정보성(수동) 요소 — 인터랙션 없음. anatomy는 값을 크게 그린 도식(실제 md=14px). 현재 값은 기본 텍스트, 구분자·전체 값은 보조 텍스트(#888).</div>
        </div>
        )}
      </div>
    );
  }

  // Usage/Variants — 인터랙션 없는 정보성 요소이므로 변형·크기 + 실제 사용 맥락을 보여준다
  const CARD = '#16161a';
  const BORDER = '#2a2a30';
  const panel = { background: CARD, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '20px' };
  const sectionLabel = { fontSize: '12px', color: '#6a6a72', marginBottom: '14px', letterSpacing: '0.04em' };
  const vRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP[16], padding: `${SP[8]} 0` };
  const vLabel = { fontSize: TYPE.label2.fontSize, color: '#8a8a92' };
  const divider = <div style={{ height: 1, background: '#232329' }} />;
  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: T.font }}>
      <div style={{ fontSize: '13px', color: '#999', marginBottom: '20px' }}>
        Page counter는 콘텐츠 내 현재 위치를 숫자로 안내하는 <b style={{ color: '#bdbdc4' }}>정보성(수동)</b> 요소입니다. 클릭·이동 같은 인터랙션 없이 갤러리·슬라이더·문서 뷰어 등에서 진행 상황을 간결히 전달합니다.
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', background: '#0f0f12', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '32px' }}>
        {/* 변형 */}
        <div style={{ ...panel, flex: '1 1 260px' }}>
          <div style={sectionLabel}>변형 (Variants)</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={vRow}><span style={vLabel}>활성 (기본)</span><PageCounter current={6} total={32} /></div>
            {divider}
            <div style={vRow}><span style={vLabel}>강조 (Primary Strong)</span><PageCounter current={6} total={32} emphasis /></div>
            {divider}
            <div style={vRow}><span style={vLabel}>비활성 (단일 페이지)</span><PageCounter current={1} total={1} /></div>
          </div>
        </div>

        {/* 크기 */}
        <div style={{ ...panel, flex: '1 1 260px' }}>
          <div style={sectionLabel}>크기 (Sizes)</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={vRow}><span style={vLabel}>sm — 12px</span><PageCounter current={3} total={12} size="sm" /></div>
            {divider}
            <div style={vRow}><span style={vLabel}>md — 14px (기본)</span><PageCounter current={3} total={12} size="md" /></div>
            {divider}
            <div style={vRow}><span style={vLabel}>lg — 16px</span><PageCounter current={3} total={12} size="lg" /></div>
          </div>
        </div>
      </div>

      {/* 사용 맥락 */}
      <div style={{ fontSize: '12px', color: '#6a6a72', margin: '24px 0 12px', letterSpacing: '0.04em' }}>사용 맥락 (Usage)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* 1. CCTV 스냅샷 캐러셀 — 카운터 오버레이(우하단) */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ position: 'relative', height: '130px', background: 'linear-gradient(135deg, #2a3340, #171c24)' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%', background: 'linear-gradient(180deg, rgba(60,70,84,0), rgba(23,28,36,0.9))' }} />
            <div style={{ position: 'absolute', left: SP[8], top: SP[8], fontSize: TYPE.caption2.fontSize, color: 'rgba(255,255,255,0.7)', fontWeight: W.semibold, letterSpacing: '0.04em' }}>ROAD-CAM 03</div>
            <div style={{ position: 'absolute', right: SP[8], bottom: SP[8], background: 'rgba(0,0,0,0.55)', borderRadius: 8 }}>
              <PageCounter current={3} total={12} />
            </div>
          </div>
          <div style={{ padding: `${SP[12]} ${SP[16]}`, fontSize: TYPE.label2.fontSize, color: '#8a8a92' }}>CCTV 스냅샷 캐러셀</div>
        </div>

        {/* 2. 문서 뷰어 — 라이트 배경, 하단 중앙 카운터 */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ height: '130px', background: '#f4f4f5', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '7px', boxSizing: 'border-box' }}>
            {[100, 88, 94, 70, 82, 60].map((w, i) => (<div key={i} style={{ height: '6px', width: `${w}%`, borderRadius: '3px', background: '#d9d9de' }} />))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `${SP[8]} 0`, borderTop: `1px solid ${BORDER}` }}>
            <PageCounter current={12} total={248} />
          </div>
        </div>

        {/* 3. 이벤트 리스트 — 하단 우측 카운터 */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ height: '130px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px', boxSizing: 'border-box' }}>
            {['침입 감지', '무단횡단', '배회 경고'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: SP[8], fontSize: TYPE.label2.fontSize, color: '#c4c4cc' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: i === 0 ? T.error : '#4a4a52' }} />{t}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: `${SP[8]} ${SP[16]}`, borderTop: `1px solid ${BORDER}` }}>
            <PageCounter current={2} total={8} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab(nav-tab) — 같은 화면 안에서 콘텐츠 섹션 전환. 활성 탭 하단 브랜드 언더라인.
//  구성: 활성 탭 · 비활성 탭 · 언더라인 · 카운트 배지 · 기준선.
const TAB_ITEMS = [
  { label: '실시간', badge: 0 },
  { label: '이벤트', badge: 3 },
  { label: '통계', badge: 0 },
  { label: '설정', badge: 0 },
];
function TabPlayground({ activeSubTab }) {
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '760px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '760px', height: '280px', margin: '0 auto 24px', boxSizing: 'border-box' }}>
          {/* 컨테이너 패널 */}
          <div style={{ position: 'absolute', left: '130px', top: '100px', width: '500px', height: '100px', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', zIndex: 2 }} />
          {/* 5. 기준선 (Baseline) */}
          <div style={{ position: 'absolute', left: '150px', top: '156px', width: '460px', height: '1px', background: '#d4d4d8', zIndex: 3 }} />
          {/* 1. 활성 탭 라벨 + 3. 언더라인 */}
          <div style={{ position: 'absolute', left: '162px', top: '128px', zIndex: 3, fontSize: TYPE.label1.fontSize, fontWeight: W.semibold, color: '#18181b' }}>Tab 1</div>
          <div style={{ position: 'absolute', left: '162px', top: '154px', width: '48px', height: '2px', background: T.primaryStrong, zIndex: 4 }} />
          {/* 2. 비활성 탭 + 4. 카운트 배지 */}
          <div style={{ position: 'absolute', left: '244px', top: '128px', zIndex: 3, fontSize: TYPE.label1.fontSize, color: '#a1a1aa' }}>Tab 2</div>
          <div style={{ position: 'absolute', left: '294px', top: '126px', minWidth: '18px', height: '18px', padding: '0 5px', borderRadius: '9px', background: T.error, color: '#fff', fontSize: TYPE.caption2.fontSize, fontWeight: W.bold, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', zIndex: 4 }}>3</div>
          <div style={{ position: 'absolute', left: '340px', top: '128px', zIndex: 3, fontSize: TYPE.label1.fontSize, color: '#a1a1aa' }}>Tab 3</div>
          <div style={{ position: 'absolute', left: '404px', top: '128px', zIndex: 3, fontSize: TYPE.label1.fontSize, color: '#a1a1aa' }}>Tab 4</div>

          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 5 }}>
            {/* 1. 활성 탭 상단(y=126) x=186 */}
            <line x1="186" y1="66" x2="186" y2="126" stroke="#999" strokeWidth="1.2" /><circle cx="186" cy="126" r="1.6" fill="#999" />
            {/* 4. 배지 상단(y=124) x=303 */}
            <line x1="303" y1="66" x2="303" y2="124" stroke="#999" strokeWidth="1.2" /><circle cx="303" cy="124" r="1.6" fill="#999" />
            {/* 2. 비활성 탭 상단(y=126) x=358 (통계) */}
            <line x1="358" y1="66" x2="358" y2="126" stroke="#999" strokeWidth="1.2" /><circle cx="358" cy="126" r="1.6" fill="#999" />
            {/* 3. 언더라인 하단(y=156) x=186 — 아래에서 위로 */}
            <line x1="186" y1="222" x2="186" y2="156" stroke="#999" strokeWidth="1.2" /><circle cx="186" cy="156" r="1.6" fill="#999" />
            {/* 5. 기준선 하단(y=156) x=520 */}
            <line x1="520" y1="222" x2="520" y2="156" stroke="#999" strokeWidth="1.2" /><circle cx="520" cy="156" r="1.6" fill="#999" />
          </svg>
          <div style={{ position: 'absolute', left: '186px', top: '58px', transform: 'translate(-50%, -50%)', zIndex: 6, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>1</div>
          <div style={{ position: 'absolute', left: '303px', top: '58px', transform: 'translate(-50%, -50%)', zIndex: 6, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>4</div>
          <div style={{ position: 'absolute', left: '358px', top: '58px', transform: 'translate(-50%, -50%)', zIndex: 6, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>2</div>
          <div style={{ position: 'absolute', left: '186px', top: '234px', transform: 'translate(-50%, -50%)', zIndex: 6, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>3</div>
          <div style={{ position: 'absolute', left: '520px', top: '234px', transform: 'translate(-50%, -50%)', zIndex: 6, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>5</div>

          {/* 간격 치수선 — 토글 시 표시(SP 토큰). 라벨↔배지 SP[8] */}
          {showSpacing && (
            <DimLine dir="h" x={286} y={135} sp={8} />
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 0' }}>
          {[
            { num: 1, label: '활성 탭 (Active)' },
            { num: 2, label: '비활성 탭 (Inactive)' },
            { num: 3, label: '언더라인 (Underline)' },
            { num: 4, label: '카운트 배지 (Badge)' },
            { num: 5, label: '기준선 (Baseline)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>{item.num}. {item.label}</div>
          ))}
        </div>

        {/* 간격 스펙 표 — Tab. 탭 간격은 탭 패딩 기반(SP[16] 권장), 라벨↔배지 SP[8] */}
        {showSpacing && (
        <div style={{ maxWidth: '760px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (
              <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>
            ))}
            {[
              ['탭 패딩(간격)', 'SP[16]', '16', '탭 좌우 여백(권장)'],
              ['라벨 ↔ 카운트 배지', 'SP[8]', '8', '탭 라벨↔배지'],
              ['언더라인 높이', '—', '2', '활성 탭 강조'],
              ['기준선', '—', '1', 'Baseline'],
            ].map((r, i) => r.map((c, j) => (
              <div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>
            )))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 탭 간격은 개별 탭 패딩(SP[16])으로 조절, 라벨↔배지는 SP[8].</div>
        </div>
        )}
      </div>
    );
  }

  // Interactive — 탭 클릭으로 섹션 전환 (언더라인 + 배지)
  const [active, setActive] = useState(0);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ border: '1px solid #2a2a2a', borderRadius: '12px', background: '#121212', overflow: 'hidden' }}>
        {/* 탭 바 */}
        <div style={{ display: 'flex', gap: SP[4], padding: `0 ${SP[8]}`, borderBottom: '1px solid #2e2e2e' }}>
          {TAB_ITEMS.map((t, i) => {
            const on = i === active;
            return (
              <button key={t.label} type="button" onClick={() => setActive(i)} style={{
                position: 'relative', display: 'inline-flex', alignItems: 'center', gap: SP[8],
                padding: `${SP[8]} ${SP[16]}`, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font,
                fontSize: TYPE.label1.fontSize, fontWeight: on ? W.semibold : W.regular, color: on ? '#fff' : '#8a8a92',
              }}>
                {t.label}
                {t.badge > 0 && (
                  <span style={{ minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9, background: T.error, color: '#fff', fontSize: TYPE.caption2.fontSize, fontWeight: W.bold, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>{t.badge}</span>
                )}
                {on && <span style={{ position: 'absolute', left: SP[16], right: SP[16], bottom: -1, height: 2, background: T.primaryStrong }} />}
              </button>
            );
          })}
        </div>
        {/* 콘텐츠 영역 */}
        <div style={{ padding: SP[24], minHeight: '120px', fontSize: TYPE.label1.fontSize, color: '#d4d4d8' }}>
          <span style={{ color: '#8a8a92' }}>선택된 섹션: </span>{TAB_ITEMS[active].label}
        </div>
      </div>
    </div>
  );
}

// Pagination dots(nav-pagination-dots) — 캐러셀/온보딩 현재 위치 점 인디케이터.
//  구성: 활성 점(브랜드색 확장 pill) · 비활성 점 · 점 묶음(컨테이너).
function PaginationDotsPlayground({ activeSubTab }) {
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '760px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '760px', height: '260px', margin: '0 auto 24px', boxSizing: 'border-box' }}>
          {/* 3. 점 묶음 (컨테이너) */}
          <div style={{ position: 'absolute', left: '230px', top: '108px', width: '300px', height: '64px', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', zIndex: 2 }} />
          {/* 점들 — 중앙 정렬, y center 140 (top 136) */}
          <div style={{ position: 'absolute', left: '338px', top: '136px', width: '8px', height: '8px', borderRadius: '50%', background: '#d4d4d8', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '354px', top: '136px', width: '8px', height: '8px', borderRadius: '50%', background: '#d4d4d8', zIndex: 3 }} />
          {/* 1. 활성 점 — 브랜드색 확장 pill */}
          <div style={{ position: 'absolute', left: '370px', top: '136px', width: '20px', height: '8px', borderRadius: '4px', background: T.primary, zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '398px', top: '136px', width: '8px', height: '8px', borderRadius: '50%', background: '#d4d4d8', zIndex: 3 }} />
          {/* 2. 비활성 점 (우측 끝) */}
          <div style={{ position: 'absolute', left: '414px', top: '136px', width: '8px', height: '8px', borderRadius: '50%', background: '#d4d4d8', zIndex: 3 }} />

          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4 }}>
            {/* 1. 활성 점 상단(y=136) x=380 */}
            <line x1="380" y1="94" x2="380" y2="136" stroke="#999" strokeWidth="1.2" /><circle cx="380" cy="136" r="1.6" fill="#999" />
            {/* 2. 비활성 점 하단(y=144) x=418 */}
            <line x1="418" y1="196" x2="418" y2="144" stroke="#999" strokeWidth="1.2" /><circle cx="418" cy="144" r="1.6" fill="#999" />
            {/* 3. 점 묶음 좌측 경계(x=230) y=140 */}
            <line x1="196" y1="140" x2="230" y2="140" stroke="#999" strokeWidth="1.2" /><circle cx="230" cy="140" r="1.6" fill="#999" />
          </svg>
          <div style={{ position: 'absolute', left: '380px', top: '82px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>1</div>
          <div style={{ position: 'absolute', left: '418px', top: '208px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>2</div>
          <div style={{ position: 'absolute', left: '182px', top: '140px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>3</div>

          {/* 간격 치수선 — 토글 시 표시(SP 토큰). 점 간격 SP[8] */}
          {showSpacing && (
            <DimLine dir="h" x={346} y={140} sp={8} />
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 0' }}>
          {[
            { num: 1, label: '활성 점 (Active dot)' },
            { num: 2, label: '비활성 점 (Inactive dot)' },
            { num: 3, label: '점 묶음 (Container)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>{item.num}. {item.label}</div>
          ))}
        </div>

        {/* 간격 스펙 표 — Pagination dots (gap SP[8] 준수) */}
        {showSpacing && (
        <div style={{ maxWidth: '760px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (
              <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>
            ))}
            {[
              ['점 간격', 'SP[8]', '8', '점 사이'],
              ['점 크기', '—', '8', '비활성 점 지름'],
              ['활성 pill', '—', '20×8', '활성 점 확장'],
              ['모서리 반경', 'radius', '8', 'Container'],
            ].map((r, i) => r.map((c, j) => (
              <div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>
            )))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 이미 SP 준수(gap SP[8]) — 정규화 불필요.</div>
        </div>
        )}
      </div>
    );
  }

  // Interactive — 점 클릭/이전·다음으로 활성 인덱스 전환
  const COUNT = 5;
  const [active, setActive] = useState(2);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: SP[8], marginBottom: SP[16] }}>
        <button type="button" onClick={() => setActive((v) => Math.max(0, v - 1))} disabled={active === 0} style={{
          height: 32, padding: `0 ${SP[12]}`, borderRadius: 6, cursor: active === 0 ? 'default' : 'pointer', fontFamily: T.font,
          fontSize: TYPE.caption1.fontSize, background: '#2a2a30', border: '1px solid #3a3a42', color: active === 0 ? '#5a5a62' : '#d4d4d8',
        }}>이전</button>
        <button type="button" onClick={() => setActive((v) => Math.min(COUNT - 1, v + 1))} disabled={active === COUNT - 1} style={{
          height: 32, padding: `0 ${SP[12]}`, borderRadius: 6, cursor: active === COUNT - 1 ? 'default' : 'pointer', fontFamily: T.font,
          fontSize: TYPE.caption1.fontSize, fontWeight: W.semibold, background: active === COUNT - 1 ? '#2a2a30' : T.primary, border: `1px solid ${active === COUNT - 1 ? '#3a3a42' : T.primary}`, color: active === COUNT - 1 ? '#5a5a62' : '#fff',
        }}>다음</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '160px', border: '1px solid #2a2a2a', borderRadius: '12px', background: '#1a1a1a', padding: SP[24] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP[8] }}>
          {Array.from({ length: COUNT }, (_, i) => (
            <span key={i} onClick={() => setActive(i)} style={{
              width: i === active ? 20 : 8, height: 8, borderRadius: i === active ? 4 : '50%',
              background: i === active ? T.primary : '#3a3a42', cursor: 'pointer', transition: 'width 0.2s, background 0.2s',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Top navigation(nav-top) — PREVAX 전 화면 공유 상단 크롬. 정본: Library의 PrevaxTitleBar.
//  구성: 브랜드·권한(좌) · 경고 배너(중앙) · 상태·시각·언어·계정·창 컨트롤(우).
function TopNavigationPlayground({ activeSubTab }) {
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '760px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '760px', height: '300px', margin: '0 auto 24px', boxSizing: 'border-box' }}>
          {/* 타이틀바 스트립(흰 패널) — 실제 PrevaxTitleBar 구조 */}
          <div style={{ position: 'absolute', left: '100px', top: '118px', width: '560px', height: '44px', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', zIndex: 2 }} />
          {/* 1. 브랜드·권한(좌) */}
          <div style={{ position: 'absolute', left: '116px', top: '132px', width: '16px', height: '16px', borderRadius: '50%', background: `linear-gradient(135deg, ${T.primary}, ${T.primaryStrong})`, zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '140px', top: '131px', zIndex: 3, fontSize: TYPE.label2.fontSize, fontWeight: W.bold, color: '#18181b' }}>PREVAX 4</div>
          <div style={{ position: 'absolute', left: '210px', top: '135px', width: '72px', height: '8px', background: '#d4d4d8', borderRadius: '4px', zIndex: 3 }} />
          {/* 2. 경고 배너(중앙) */}
          <div style={{ position: 'absolute', left: '320px', top: '128px', height: '24px', display: 'inline-flex', alignItems: 'center', gap: SP[4], padding: `0 ${SP[8]}`, background: 'rgba(255,169,56,0.12)', border: `1px solid ${T.cautionary}`, borderRadius: '6px', zIndex: 3 }}>
            <Icon name="error" size={12} color={T.cautionary} />
            <span style={{ fontSize: TYPE.caption2.fontSize, fontWeight: W.semibold, color: T.cautionary }}>Alert</span>
          </div>
          {/* 3. 상태·시각·언어(우) */}
          <div style={{ position: 'absolute', left: '452px', top: '137px', display: 'inline-flex', gap: SP[4], zIndex: 3 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.positive }} />
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.positive }} />
          </div>
          <div style={{ position: 'absolute', left: '478px', top: '135px', width: '58px', height: '9px', background: '#d4d4d8', borderRadius: '4px', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '546px', top: '131px', zIndex: 3, fontSize: TYPE.caption1.fontSize, color: '#6f6f77' }}>EN ▾</div>
          {/* 4. 계정·창 컨트롤(우) */}
          <div style={{ position: 'absolute', left: '580px', top: '130px', width: '18px', height: '18px', borderRadius: '50%', border: '1.5px dashed #a1a1aa', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '608px', top: '131px', zIndex: 3, fontSize: TYPE.caption1.fontSize, color: '#a1a1aa', letterSpacing: '2px' }}>— ▢ ✕</div>

          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4 }}>
            {/* 1. 브랜드 하단(y=162) x=150 */}
            <line x1="150" y1="196" x2="150" y2="162" stroke="#999" strokeWidth="1.2" /><circle cx="150" cy="162" r="1.6" fill="#999" />
            {/* 2. 경고 배너 상단(y=118) x=372 */}
            <line x1="372" y1="88" x2="372" y2="118" stroke="#999" strokeWidth="1.2" /><circle cx="372" cy="118" r="1.6" fill="#999" />
            {/* 3. 상태·시각·언어 하단(y=162) x=500 */}
            <line x1="500" y1="196" x2="500" y2="162" stroke="#999" strokeWidth="1.2" /><circle cx="500" cy="162" r="1.6" fill="#999" />
            {/* 4. 계정·창 컨트롤 상단(y=118) x=615 */}
            <line x1="615" y1="88" x2="615" y2="118" stroke="#999" strokeWidth="1.2" /><circle cx="615" cy="118" r="1.6" fill="#999" />
          </svg>
          <div style={{ position: 'absolute', left: '150px', top: '208px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>1</div>
          <div style={{ position: 'absolute', left: '372px', top: '76px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>2</div>
          <div style={{ position: 'absolute', left: '500px', top: '208px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>3</div>
          <div style={{ position: 'absolute', left: '615px', top: '76px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>4</div>

          {/* 간격 치수선 — 토글 시 표시(SP 토큰). 경고 배너 좌측 패딩 SP[8] */}
          {showSpacing && (
            <DimLine dir="h" x={320} y={140} sp={8} />
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px 0' }}>
          {[
            { num: 1, label: '브랜드 · 권한 (좌측)' },
            { num: 2, label: '경고 배너 (중앙)' },
            { num: 3, label: '상태 · 시각 · 언어 (우측)' },
            { num: 4, label: '계정 · 창 컨트롤' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>{item.num}. {item.label}</div>
          ))}
        </div>
        <div style={{ marginTop: SP[16], fontSize: TYPE.caption1.fontSize, color: '#9a9aa2' }}>정본: <span style={{ color: '#d4d4d8' }}>PrevaxTitleBar</span> (Library.jsx 공통 크롬) — 새 화면에서 재사용하세요.</div>

        {/* 간격 스펙 표 — 정본 PrevaxTitleBar 기준 */}
        {showSpacing && (
        <div style={{ maxWidth: '760px', margin: '16px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (
              <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>
            ))}
            {[
              ['타이틀바 높이', '—', '40', '상단 크롬 높이'],
              ['가로 패딩', 'SP[12]', '12', '좌우 여백'],
              ['요소 간격', 'SP[8]', '8', '브랜드·상태·계정 사이'],
              ['경고 배너 패딩', 'SP[8]', '8', '배너 좌우'],
              ['모서리 반경', 'radius', '6', '배너·버튼'],
            ].map((r, i) => r.map((c, j) => (
              <div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>
            )))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 정본 PrevaxTitleBar(padding SP[12]·gap SP[8]) 기준. anatomy는 요소 배치 도식.</div>
        </div>
        )}
      </div>
    );
  }

  // Interactive — 실제 PrevaxTitleBar 크롬 재현(경고 배너 토글)
  const [warn, setWarn] = useState(true);
  const winBtn = { width: 22, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#8a8a92', fontSize: TYPE.caption2.fontSize, cursor: 'pointer' };
  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: SP[16] }}>
        <button type="button" onClick={() => setWarn((v) => !v)} style={{
          height: 30, padding: `0 ${SP[12]}`, borderRadius: 6, cursor: 'pointer', fontFamily: T.font,
          fontSize: TYPE.caption1.fontSize, fontWeight: W.regular,
          background: warn ? 'rgba(0,102,255,0.12)' : '#2a2a30', border: `1px solid ${warn ? T.primary : '#3a3a42'}`, color: warn ? T.primaryStrong : '#d4d4d8',
        }}>{warn ? '✓ 경고 배너' : '○ 경고 배너'}</button>
      </div>
      <div style={{ border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', background: '#0e0e10' }}>
        {/* PrevaxTitleBar 재현 */}
        <div style={{ height: 40, background: '#141417', borderBottom: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${SP[12]}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], flex: 1, minWidth: 0 }}>
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: `linear-gradient(135deg, ${T.primary}, ${T.primaryStrong})`, flexShrink: 0 }} />
            <span style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.bold, color: '#fff' }}>PREVAX 4</span>
            <span style={{ fontSize: TYPE.caption1.fontSize, color: '#6f6f77', whiteSpace: 'nowrap' }}>| 마스터 ( 최고 관리자 )</span>
          </div>
          {warn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], background: 'rgba(255,169,56,0.14)', border: `1px solid ${T.cautionary}`, borderRadius: 6, padding: `3px 5px 3px ${SP[8]}`, flexShrink: 0 }}>
              <Icon name="error" size={14} color={T.cautionary} />
              <span style={{ fontSize: TYPE.caption1.fontSize, fontWeight: W.semibold, color: T.cautionary }}>영상 분석 서버 지연</span>
              <span style={{ fontSize: TYPE.caption2.fontSize, color: '#e8e8ec', background: '#33333a', borderRadius: 4, padding: `${SP[2]} ${SP[8]}` }}>관리</span>
            </div>
          ) : <span />}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: SP[12], fontSize: TYPE.caption1.fontSize, color: '#bdbdc4', flex: 1 }}>
            <span style={{ display: 'inline-flex', gap: SP[4] }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.positive }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.positive }} />
            </span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>2026.07.07 14:30:00</span>
            <span style={{ cursor: 'pointer' }}>한국어 ▾</span>
            <span style={{ display: 'inline-flex', color: T.primaryStrong }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6.5 8-6.5s8 2.5 8 6.5" /></svg>
            </span>
            <span style={{ display: 'inline-flex', gap: SP[8], marginLeft: SP[4] }}>
              <span style={winBtn}>—</span><span style={winBtn}>▢</span><span style={winBtn}>✕</span>
            </span>
          </div>
        </div>
        {/* 본문 자리(크롬 구분용 더미) */}
        <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: TYPE.caption1.fontSize, color: '#5a5a62' }}>본문 영역</div>
      </div>
    </div>
  );
}

// Progress tracker(nav-progress-tracker) — 다단계 절차 진행 상태 스텝퍼.
//  구성: 완료/현재/대기 노드 · 연결선 · 라벨/보조설명.
const PT_STEPS = [
  { label: '감지', desc: '이상 감지' },
  { label: '확인', desc: '이벤트 검증' },
  { label: '출동', desc: '인원 배치' },
  { label: '종료', desc: '상황 종료' },
];
function ProgressTrackerPlayground({ activeSubTab }) {
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  if (activeSubTab === 'anatomy') {
    // 노드 중심 x좌표(4단계) · 노드 중심 y=150
    const NX = [200, 320, 440, 560];
    const node = (cx, kind, num) => {
      const base = { position: 'absolute', left: `${cx - 14}px`, top: '136px', width: '28px', height: '28px', borderRadius: '50%', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' };
      if (kind === 'done') return <div style={{ ...base, background: T.positive }}><Icon name="check" size={14} color="#fff" /></div>;
      if (kind === 'current') return <div style={{ ...base, background: T.primaryStrong, boxShadow: '0 0 0 4px rgba(0,102,255,0.25)', color: '#fff', fontSize: TYPE.caption1.fontSize, fontWeight: W.bold }}>{num}</div>;
      return <div style={{ ...base, background: '#fff', border: '1px solid #d4d4d8', color: '#a1a1aa', fontSize: TYPE.caption1.fontSize, fontWeight: W.semibold }}>{num}</div>;
    };
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '760px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '760px', height: '320px', margin: '0 auto 24px', boxSizing: 'border-box' }}>
          {/* 컨테이너 패널 */}
          <div style={{ position: 'absolute', left: '110px', top: '104px', width: '540px', height: '116px', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', zIndex: 1 }} />
          {/* 연결선 — 완료 구간(positive)/미완료(회색) */}
          <div style={{ position: 'absolute', left: '200px', top: '149px', width: '120px', height: '2px', background: T.positive, zIndex: 2 }} />
          <div style={{ position: 'absolute', left: '320px', top: '149px', width: '120px', height: '2px', background: T.positive, zIndex: 2 }} />
          <div style={{ position: 'absolute', left: '440px', top: '149px', width: '120px', height: '2px', background: '#d4d4d8', zIndex: 2 }} />
          {/* 노드: 완료·완료·현재·대기 */}
          {node(NX[0], 'done')}
          {node(NX[1], 'done')}
          {node(NX[2], 'current', '3')}
          {node(NX[3], 'pending', '4')}
          {/* 라벨 + 보조설명 */}
          {NX.map((cx, i) => (
            <div key={i} style={{ position: 'absolute', left: `${cx - 40}px`, top: '176px', width: '80px', textAlign: 'center', zIndex: 3 }}>
              <div style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#18181b' }}>{`Step ${i + 1}`}</div>
              <div style={{ fontSize: TYPE.caption2.fontSize, color: '#a1a1aa', marginTop: '2px' }}>Description</div>
            </div>
          ))}

          {/* SVG 연결선 — 요소 경계까지 정확히 그음 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4 }}>
            {/* 1. 완료 노드 상단(y=136) x=200 */}
            <line x1="200" y1="84" x2="200" y2="136" stroke="#999" strokeWidth="1.2" /><circle cx="200" cy="136" r="1.6" fill="#999" />
            {/* 2. 현재 노드 상단(y=136) x=440 */}
            <line x1="440" y1="84" x2="440" y2="136" stroke="#999" strokeWidth="1.2" /><circle cx="440" cy="136" r="1.6" fill="#999" />
            {/* 3. 대기 노드 상단(y=136) x=560 */}
            <line x1="560" y1="84" x2="560" y2="136" stroke="#999" strokeWidth="1.2" /><circle cx="560" cy="136" r="1.6" fill="#999" />
            {/* 4. 연결선(y=150) 중간 x=260 — 아래에서 위로 */}
            <line x1="260" y1="252" x2="260" y2="150" stroke="#999" strokeWidth="1.2" /><circle cx="260" cy="150" r="1.6" fill="#999" />
            {/* 5. 라벨/보조설명(x=320) y=192 */}
            <line x1="320" y1="252" x2="320" y2="192" stroke="#999" strokeWidth="1.2" /><circle cx="320" cy="192" r="1.6" fill="#999" />
          </svg>
          <div style={{ position: 'absolute', left: '200px', top: '72px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>1</div>
          <div style={{ position: 'absolute', left: '440px', top: '72px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>2</div>
          <div style={{ position: 'absolute', left: '560px', top: '72px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>3</div>
          <div style={{ position: 'absolute', left: '260px', top: '264px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>4</div>
          <div style={{ position: 'absolute', left: '320px', top: '264px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>5</div>

          {/* 간격 치수선 — 토글 시 표시(SP 토큰). 노드↔라벨 SP[12] */}
          {showSpacing && (
            <DimLine dir="v" x={200} y={164} sp={12} />
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 0' }}>
          {[
            { num: 1, label: '완료 노드 (Completed)' },
            { num: 2, label: '현재 노드 (Current)' },
            { num: 3, label: '대기 노드 (Pending)' },
            { num: 4, label: '연결선 (Connector)' },
            { num: 5, label: '라벨 / 보조설명' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>{item.num}. {item.label}</div>
          ))}
        </div>

        {/* 간격 스펙 표 — Progress tracker */}
        {showSpacing && (
        <div style={{ maxWidth: '760px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (
              <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>
            ))}
            {[
              ['노드 ↔ 라벨', 'SP[12]', '12', '노드 하단↔라벨'],
              ['라벨 ↔ 보조설명', 'SP[2]', '2', '텍스트 줄 간격'],
              ['노드 크기', '—', '28', '단계 노드 지름'],
              ['연결선', '—', '2', 'Connector 두께'],
            ].map((r, i) => r.map((c, j) => (
              <div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>
            )))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 이미 SP 준수(노드↔라벨 SP[12]·줄간격 SP[2]) — 정규화 불필요. 단계 간격은 폭 균등 분배.</div>
        </div>
        )}
      </div>
    );
  }

  // Interactive — 단계 진행/후퇴로 상태 전환 시연
  const [active, setActive] = useState(1);
  const nodeEl = (i) => {
    const state = i < active ? 'done' : i === active ? 'current' : 'pending';
    const base = { width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxSizing: 'border-box', fontSize: TYPE.caption1.fontSize, fontWeight: W.bold };
    if (state === 'done') return <div style={{ ...base, background: T.positive, color: '#fff' }}><Icon name="check" size={14} color="#fff" /></div>;
    if (state === 'current') return <div style={{ ...base, background: T.primaryStrong, color: '#fff', boxShadow: '0 0 0 4px rgba(0,102,255,0.25)' }}>{i + 1}</div>;
    return <div style={{ ...base, background: '#1e1e1e', border: '1px solid #2e2e2e', color: '#8a8a92' }}>{i + 1}</div>;
  };
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: SP[8], marginBottom: SP[16] }}>
        <button type="button" onClick={() => setActive((v) => Math.max(0, v - 1))} disabled={active === 0} style={{
          height: 32, padding: `0 ${SP[12]}`, borderRadius: 6, cursor: active === 0 ? 'default' : 'pointer', fontFamily: T.font,
          fontSize: TYPE.caption1.fontSize, background: '#2a2a30', border: '1px solid #3a3a42', color: active === 0 ? '#5a5a62' : '#d4d4d8',
        }}>이전</button>
        <button type="button" onClick={() => setActive((v) => Math.min(PT_STEPS.length - 1, v + 1))} disabled={active === PT_STEPS.length - 1} style={{
          height: 32, padding: `0 ${SP[12]}`, borderRadius: 6, cursor: active === PT_STEPS.length - 1 ? 'default' : 'pointer', fontFamily: T.font,
          fontSize: TYPE.caption1.fontSize, fontWeight: W.semibold, background: active === PT_STEPS.length - 1 ? '#2a2a30' : T.primary, border: `1px solid ${active === PT_STEPS.length - 1 ? '#3a3a42' : T.primary}`, color: active === PT_STEPS.length - 1 ? '#5a5a62' : '#fff',
        }}>다음 단계</button>
      </div>
      <div style={{ border: '1px solid #2a2a2a', borderRadius: '12px', background: '#1a1a1a', padding: `${SP[32]} ${SP[24]} 56px` }}>
        {/* Anatomy와 동일: 연결선이 노드에 붙고, 라벨/설명은 노드 아래 중앙 정렬 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {PT_STEPS.map((s, i) => (
            <Fragment key={s.label}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {nodeEl(i)}
                <div style={{ position: 'absolute', top: '34px', left: '50%', transform: 'translateX(-50%)', width: '96px', textAlign: 'center' }}>
                  <div style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: i <= active ? '#e8e8ec' : '#8a8a92' }}>{s.label}</div>
                  <div style={{ marginTop: '2px', fontSize: TYPE.caption2.fontSize, color: '#8a8a92' }}>{s.desc}</div>
                </div>
              </div>
              {i < PT_STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < active ? T.positive : '#2e2e2e' }} />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// Popover(present-popover) — 앵커에 붙어 뜨는 기반 오버레이 프리미티브.
//  구성: 앵커 · 화살표(arrow) · 콘텐츠 · 컨테이너.
function PopoverPlayground({ activeSubTab }) {
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '760px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '760px', height: '320px', margin: '0 auto 24px', boxSizing: 'border-box' }}>
          {/* 1. 앵커 (Anchor) — 트리거 요소 */}
          <div style={{ position: 'absolute', left: '330px', top: '58px', width: '100px', height: '34px', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#18181b' }}>Anchor</div>
          {/* 2. 화살표 (Arrow) — 앵커를 가리키는 삼각형 (회전 사각형) */}
          <div style={{ position: 'absolute', left: '372px', top: '106px', width: '12px', height: '12px', background: '#fff', borderLeft: '1px solid #e4e4e7', borderTop: '1px solid #e4e4e7', transform: 'rotate(45deg)', zIndex: 4 }} />
          {/* 4. 컨테이너 (Popover 패널) */}
          <div style={{ position: 'absolute', left: '300px', top: '112px', width: '160px', height: '128px', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', zIndex: 2 }} />
          {/* 3. 콘텐츠 — 스켈레톤 바 (패널 패딩 SP[16]) */}
          <div style={{ position: 'absolute', left: '316px', top: '128px', width: '120px', height: '11px', background: '#d4d4d8', borderRadius: '4px', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '316px', top: '152px', width: '100px', height: '9px', background: '#e4e4e7', borderRadius: '4px', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '316px', top: '172px', width: '110px', height: '9px', background: '#e4e4e7', borderRadius: '4px', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '316px', top: '192px', width: '80px', height: '9px', background: '#e4e4e7', borderRadius: '4px', zIndex: 3 }} />

          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 5 }}>
            {/* 1. 앵커 상단(y=58) x=380 */}
            <line x1="380" y1="36" x2="380" y2="58" stroke="#999" strokeWidth="1.2" /><circle cx="380" cy="58" r="1.6" fill="#999" />
            {/* 2. 화살표 좌측(x=372) y=112 */}
            <line x1="244" y1="112" x2="372" y2="112" stroke="#999" strokeWidth="1.2" /><circle cx="372" cy="112" r="1.6" fill="#999" />
            {/* 3. 콘텐츠 좌측 경계(x=316) y=180 */}
            <line x1="244" y1="180" x2="316" y2="180" stroke="#999" strokeWidth="1.2" /><circle cx="316" cy="180" r="1.6" fill="#999" />
            {/* 4. 컨테이너 우측 경계(x=460) y=200 */}
            <line x1="520" y1="200" x2="460" y2="200" stroke="#999" strokeWidth="1.2" /><circle cx="460" cy="200" r="1.6" fill="#999" />
          </svg>
          <div style={{ position: 'absolute', left: '380px', top: '28px', transform: 'translate(-50%, -50%)', zIndex: 6, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>1</div>
          <div style={{ position: 'absolute', left: '230px', top: '112px', transform: 'translate(-50%, -50%)', zIndex: 6, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>2</div>
          <div style={{ position: 'absolute', left: '230px', top: '180px', transform: 'translate(-50%, -50%)', zIndex: 6, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>3</div>
          <div style={{ position: 'absolute', left: '534px', top: '200px', transform: 'translate(-50%, -50%)', zIndex: 6, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>4</div>

          {/* 간격 치수선 — 토글 시 표시(SP 토큰). 패널 패딩 SP[16] */}
          {showSpacing && (
            <>
              <PaddingFill x={301} y={113} w={158} h={126} t={16} l={16} r={16} b={16} />
              <DimLine dir="h" x={300} y={180} sp={16} />
            </>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px 0' }}>
          {[
            { num: 1, label: '앵커 (Anchor)' },
            { num: 2, label: '화살표 (Arrow)' },
            { num: 3, label: '콘텐츠 (Content)' },
            { num: 4, label: '컨테이너 (Popover 패널)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>{item.num}. {item.label}</div>
          ))}
        </div>

        {/* 간격 스펙 표 — Popover. 앵커 간격 10→SP[8] 정규화, anatomy 패딩 20→SP[16] 정합 */}
        {showSpacing && (
        <div style={{ maxWidth: '760px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (
              <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>
            ))}
            {[
              ['패널 패딩', 'SP[16]', '16', '팝오버 내부 여백'],
              ['콘텐츠 줄 간격', 'SP[8]', '8', '제목↔본문'],
              ['앵커 ↔ 팝오버', 'SP[8]', '8', '트리거↔패널(10→8 정규화)'],
              ['화살표', '—', '12', '12×12 회전 사각'],
              ['모서리 반경', 'radius', '8', 'border-radius'],
            ].map((r, i) => r.map((c, j) => (
              <div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>
            )))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 실제 앵커 간격 10→SP[8] 정규화, anatomy 패딩(20)도 SP[16]로 정합.</div>
        </div>
        )}
      </div>
    );
  }

  // Interactive — 앵커 클릭 → 팝오버, 외부 클릭 시 닫힘
  const [open, setOpen] = useState(false);
  return (
    <div style={{ width: '100%' }}>
      <div onClick={() => setOpen(false)} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', border: '1px solid #2a2a2a', borderRadius: '12px', background: '#121212', padding: SP[24] }}>
        <div style={{ position: 'relative' }}>
          <button type="button" onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }} style={{
            height: 36, padding: `0 ${SP[16]}`, borderRadius: 8, cursor: 'pointer', fontFamily: T.font,
            fontSize: TYPE.label1.fontSize, fontWeight: W.semibold, color: '#fff',
            background: open ? T.primaryHeavy : T.primary, border: 'none',
          }}>이벤트 상세</button>
          {open && (
            <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: `calc(100% + ${SP[8]})`, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
              <div style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: 12, height: 12, background: '#1a1a1a', borderLeft: '1px solid #2e2e2e', borderTop: '1px solid #2e2e2e' }} />
              <div style={{ width: 240, background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: 8, boxShadow: '0 16px 40px rgba(0,0,0,0.5)', padding: SP[16] }}>
                <div style={{ fontSize: TYPE.label1.fontSize, fontWeight: W.semibold, color: '#e8e8ec', marginBottom: SP[8] }}>교차로 A-12</div>
                <div style={{ fontSize: TYPE.caption1.fontSize, color: '#9a9aa2', lineHeight: 1.6 }}>혼잡도 78% · 최근 이벤트 3건<br />신호 제어기 정상</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Autocomplete(present-autocomplete) — 입력 중 일치 항목을 드롭다운으로 추천.
//  구성: 입력 필드 · 추천 목록 · 추천 항목 · 일치 강조. (Popover 특수형)
const AC_ITEMS = ['강변북로', '강남대로', '경부고속도로', '올림픽대로', '내부순환로', '동부간선도로'];
function AutocompletePlayground({ activeSubTab }) {
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '760px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '760px', height: '360px', margin: '0 auto 24px', boxSizing: 'border-box' }}>
          {/* 1. 입력 필드 (Input field) */}
          <div style={{ position: 'absolute', left: '260px', top: '60px', width: '240px', height: '40px', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', zIndex: 3, display: 'flex', alignItems: 'center', padding: `0 ${SP[12]}`, fontSize: TYPE.label1.fontSize, color: '#18181b' }}>Search</div>
          {/* 2. 추천 목록 패널 (Suggestion list) */}
          <div style={{ position: 'absolute', left: '260px', top: '104px', width: '240px', height: '168px', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', zIndex: 2 }} />
          {/* 4. 일치 강조 항목(첫 행) — 하이라이트 배경 + 일치 텍스트 */}
          <div style={{ position: 'absolute', left: '261px', top: '110px', width: '238px', height: '36px', background: 'rgba(0,102,255,0.08)', borderRadius: '7px 7px 0 0', zIndex: 2 }} />
          <div style={{ position: 'absolute', left: '272px', top: '120px', zIndex: 3, fontSize: TYPE.label2.fontSize, color: '#18181b' }}><span style={{ color: T.primary, fontWeight: W.bold }}>Search</span> result</div>
          {/* 3. 추천 항목(일반 행) — 스켈레톤 바 (항목 좌측 패딩 SP[12]) */}
          <div style={{ position: 'absolute', left: '272px', top: '160px', width: '130px', height: '9px', background: '#d4d4d8', borderRadius: '4px', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '272px', top: '196px', width: '150px', height: '9px', background: '#d4d4d8', borderRadius: '4px', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '272px', top: '232px', width: '110px', height: '9px', background: '#d4d4d8', borderRadius: '4px', zIndex: 3 }} />

          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4 }}>
            {/* 1. 입력 필드 좌측(x=260) y=80 */}
            <line x1="240" y1="80" x2="260" y2="80" stroke="#999" strokeWidth="1.2" /><circle cx="260" cy="80" r="1.6" fill="#999" />
            {/* 3. 추천 항목 좌측(x=272) y=164 */}
            <line x1="240" y1="164" x2="272" y2="164" stroke="#999" strokeWidth="1.2" /><circle cx="272" cy="164" r="1.6" fill="#999" />
            {/* 4. 일치 강조 우측(x=328) y=128 */}
            <line x1="520" y1="128" x2="328" y2="128" stroke="#999" strokeWidth="1.2" /><circle cx="328" cy="128" r="1.6" fill="#999" />
            {/* 2. 추천 목록 우측(x=500) y=210 */}
            <line x1="520" y1="210" x2="500" y2="210" stroke="#999" strokeWidth="1.2" /><circle cx="500" cy="210" r="1.6" fill="#999" />
          </svg>
          <div style={{ position: 'absolute', left: '226px', top: '80px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>1</div>
          <div style={{ position: 'absolute', left: '226px', top: '164px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>3</div>
          <div style={{ position: 'absolute', left: '534px', top: '128px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>4</div>
          <div style={{ position: 'absolute', left: '534px', top: '210px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>2</div>

          {/* 간격 치수선 — 토글 시 표시(SP 토큰). 입력·항목 가로 패딩 SP[12] */}
          {showSpacing && (
            <>
              <PaddingFill x={261} y={61} w={238} h={38} l={12} r={12} />
              <DimLine dir="h" x={260} y={80} sp={12} />{/* 입력 좌측 패딩 */}
              <DimLine dir="h" x={260} y={210} sp={12} />{/* 항목 좌측 패딩 */}
            </>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px 0' }}>
          {[
            { num: 1, label: '입력 필드 (Input)' },
            { num: 2, label: '추천 목록 (Dropdown)' },
            { num: 3, label: '추천 항목 (Item)' },
            { num: 4, label: '일치 강조 (Match)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>{item.num}. {item.label}</div>
          ))}
        </div>

        {/* 간격 스펙 표 — 실제 Autocomplete 기준(입력·항목 SP 준수). anatomy 항목 들여쓰기만 SP[12]로 정합 */}
        {showSpacing && (
        <div style={{ maxWidth: '760px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (
              <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>
            ))}
            {[
              ['입력 가로 패딩', 'SP[12]', '12', '입력 필드 좌우'],
              ['입력 아이콘↔텍스트', 'SP[8]', '8', '검색 아이콘↔입력'],
              ['목록 항목 패딩', 'SP[8] × SP[12]', '8·12', '드롭다운 항목'],
              ['입력↔목록 간격', 'SP[4]', '4', 'marginTop'],
              ['높이', '40', '40', '입력 컨트롤 높이'],
              ['모서리 반경', 'radius', '8', 'border-radius'],
            ].map((r, i) => r.map((c, j) => (
              <div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>
            )))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 실제 Autocomplete는 이미 SP 준수 — anatomy 항목 들여쓰기(24)만 SP[12]로 맞춰 일치.</div>
        </div>
        )}
      </div>
    );
  }

  // Interactive — 입력에 따라 실시간 필터 + 일치 강조
  const [q, setQ] = useState('강');
  const [picked, setPicked] = useState('');
  const matches = q ? AC_ITEMS.filter((x) => x.includes(q)) : [];
  return (
    <div style={{ width: '100%' }}>
      <div style={{ border: '1px solid #2a2a2a', borderRadius: '12px', background: '#121212', padding: SP[24], minHeight: '280px' }}>
        <div style={{ maxWidth: '320px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP[8], height: 40, padding: `0 ${SP[12]}`, background: '#161618', border: `1px solid ${T.primary}`, borderRadius: 8 }}>
            <Icon name="search" size={16} color="#8a8a92" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPicked(''); }} placeholder="도로명 검색"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#e8e8ec', fontSize: TYPE.label1.fontSize, fontFamily: T.font }} />
          </div>
          {matches.length > 0 && !picked && (
            <div style={{ marginTop: SP[4], background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: 8, overflow: 'hidden' }}>
              {matches.map((m) => {
                const i = m.indexOf(q);
                return (
                  <div key={m} onClick={() => { setPicked(m); setQ(m); }} style={{ padding: `${SP[8]} ${SP[12]}`, cursor: 'pointer', fontSize: TYPE.label1.fontSize, color: '#d4d4d8' }}>
                    {i >= 0 ? (<>{m.slice(0, i)}<span style={{ color: T.primaryStrong, fontWeight: W.bold }}>{m.slice(i, i + q.length)}</span>{m.slice(i + q.length)}</>) : m}
                  </div>
                );
              })}
            </div>
          )}
          {picked && <div style={{ marginTop: SP[12], fontSize: TYPE.caption1.fontSize, color: '#9a9aa2' }}>선택됨: <span style={{ color: '#e8e8ec' }}>{picked}</span></div>}
        </div>
      </div>
    </div>
  );
}


// Section message(feedback-section-message) — 영역 내부 인라인 메시지 박스.
//  variant(info/caution/error/success) × 좌측 보더 + 아이콘 + 제목 + 본문.
// Foundation 아이콘 세트 기준 매핑(info 전용 글리프 부재 → error 원형 심볼을 Primary 색으로 사용).
const SECTIONMSG_VARIANTS = {
  info:    { icon: 'error',        color: T.primaryStrong, title: '정보 안내', body: '참고할 정보를 전달하는 메시지입니다.' },
  caution: { icon: 'warning',      color: T.cautionary,    title: '주의 필요', body: '주의가 필요한 상황을 안내합니다.' },
  error:   { icon: 'error',        color: T.error,         title: '오류 발생', body: '장애 또는 실패 상황을 알립니다.' },
  success: { icon: 'check_circle', color: T.positive,      title: '처리 완료', body: '정상적으로 처리되었습니다.' },
};

function SectionMessageContent({ variant = 'info', title, body }) {
  const v = SECTIONMSG_VARIANTS[variant];
  return (
    <div style={{
      display: 'flex', gap: SP[12], padding: `${SP[12]} ${SP[16]}`, width: '100%', boxSizing: 'border-box',
      background: '#1e1e1e', border: '1px solid #2e2e2e', borderLeft: `3px solid ${v.color}`, borderRadius: 8,
    }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}><Icon name={v.icon} size={18} color={v.color} /></span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP[4], minWidth: 0 }}>
        {(title ?? v.title) && <div style={{ fontSize: TYPE.label1.fontSize, fontWeight: W.semibold, color: v.color }}>{title ?? v.title}</div>}
        <div style={{ fontSize: TYPE.caption1.fontSize, color: '#c4c4c8', lineHeight: 1.5 }}>{body ?? v.body}</div>
      </div>
    </div>
  );
}

function SectionMessagePlayground({ activeSubTab }) {
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '760px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 — Text field anatomy와 동일 시각 언어 */}
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '760px', height: '320px', margin: '0 auto 24px', boxSizing: 'border-box' }}>
          {/* 5. 컨테이너 — 메시지 박스. 좌측 강조 보더(4)를 컨테이너 자체 borderLeft로 통합(모서리 8px에 맞게 클립) */}
          <div style={{ position: 'absolute', left: '230px', top: '108px', width: '340px', height: '96px', background: '#fff', border: '1px solid #e4e4e7', borderLeft: `3px solid ${T.primaryStrong}`, borderRadius: '8px', zIndex: 2 }} />
          {/* 1. 아이콘 — 점선 placeholder (20×20, center y=143 · 좌측 패딩 SP[16]) */}
          <div style={{ position: 'absolute', left: '246px', top: '133px', width: '20px', height: '20px', border: '1.5px dashed #a1a1aa', borderRadius: '4px', zIndex: 3 }} />
          {/* 2. 제목(Title) — 굵은 다크 텍스트 (아이콘↔텍스트 SP[12]) */}
          <div style={{ position: 'absolute', left: '278px', top: '133px', zIndex: 3, fontSize: TYPE.label1.fontSize, fontWeight: W.bold, color: '#18181b' }}>Title</div>
          {/* 3. 본문(Content) — 회색 텍스트 */}
          <div style={{ position: 'absolute', left: '278px', top: '161px', width: '260px', zIndex: 3, fontSize: TYPE.label2.fontSize, color: '#a1a1aa' }}>Body</div>

          {/* SVG 연결선 — 요소 경계까지 정확히 그음 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4 }}>
            {/* 1. 아이콘 좌측 경계(x=246, y=143) */}
            <line x1="182" y1="143" x2="246" y2="143" stroke="#999" strokeWidth="1.2" /><circle cx="246" cy="143" r="1.6" fill="#999" />
            {/* 2. 제목 상단(y=133) — 위에서 아래로 */}
            <line x1="298" y1="88" x2="298" y2="133" stroke="#999" strokeWidth="1.2" /><circle cx="298" cy="133" r="1.6" fill="#999" />
            {/* 3. 본문 우측 경계(x=538, y=170) */}
            <line x1="632" y1="170" x2="538" y2="170" stroke="#999" strokeWidth="1.2" /><circle cx="538" cy="170" r="1.6" fill="#999" />
            {/* 4. 좌측 강조 보더(x=230) — 하단부(모서리 회피) */}
            <line x1="182" y1="184" x2="230" y2="184" stroke="#999" strokeWidth="1.2" /><circle cx="230" cy="184" r="1.6" fill="#999" />
            {/* 5. 컨테이너 하단 경계(y=204) — 아래에서 위로 */}
            <line x1="400" y1="240" x2="400" y2="204" stroke="#999" strokeWidth="1.2" /><circle cx="400" cy="204" r="1.6" fill="#999" />
          </svg>
          {/* Callouts — 흰 원 + 검정 텍스트 */}
          <div style={{ position: 'absolute', left: '172px', top: '143px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>1</div>
          <div style={{ position: 'absolute', left: '298px', top: '78px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>2</div>
          <div style={{ position: 'absolute', left: '642px', top: '170px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>3</div>
          <div style={{ position: 'absolute', left: '172px', top: '184px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>4</div>
          <div style={{ position: 'absolute', left: '400px', top: '250px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>5</div>

          {/* 간격 치수선 — 토글 시 표시(SP 토큰). 실제 스펙(가로 SP[16]·아이콘↔텍스트 SP[12]) */}
          {showSpacing && (
            <>
              <PaddingFill x={231} y={109} w={338} h={94} t={12} l={16} r={16} b={12} />
              <DimLine dir="h" x={230} y={143} sp={16} />{/* 컨테이너 좌측 패딩 */}
              <DimLine dir="h" x={266} y={186} sp={12} />{/* 아이콘↔텍스트 */}
            </>
          )}
        </div>
        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 0' }}>
          {[
            { num: 1, label: '상태 아이콘 (Icon)' },
            { num: 2, label: '제목 (Title)' },
            { num: 3, label: '본문 (Content)' },
            { num: 4, label: '좌측 강조 보더' },
            { num: 5, label: '컨테이너 (메시지 박스)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>{item.num}. {item.label}</div>
          ))}
        </div>

        {/* 간격 스펙 표 — 실제 Section message 기준(이미 SP 준수). anatomy 들여쓰기/gap을 실제에 맞춤 */}
        {showSpacing && (
        <div style={{ maxWidth: '760px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (
              <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>
            ))}
            {[
              ['가로 패딩', 'SP[16]', '16', '컨테이너 좌우'],
              ['세로 패딩', 'SP[12]', '12', '컨테이너 상하'],
              ['아이콘 ↔ 텍스트', 'SP[12]', '12', '내부 요소 간격'],
              ['제목 ↔ 본문', 'SP[4]', '4', '텍스트 줄 간격'],
              ['좌측 강조 보더', '—', '3', 'variant 색 강조'],
              ['모서리 반경', 'radius', '8', 'border-radius'],
            ].map((r, i) => r.map((c, j) => (
              <div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>
            )))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 실제 Section message는 이미 SP 준수(gap 12·padding 12/16). anatomy 들여쓰기·gap을 실제(SP[16]/SP[12])에 맞춰 일치.</div>
        </div>
        )}
      </div>
    );
  }

  // Interactive — variant 토글
  const [variant, setVariant] = useState('info');
  const seg = (val) => (
    <button key={val} type="button" onClick={() => setVariant(val)} style={{
      height: 30, padding: `0 ${SP[12]}`, borderRadius: 6, cursor: 'pointer', fontFamily: T.font,
      fontSize: TYPE.caption1.fontSize, fontWeight: variant === val ? W.semibold : W.regular,
      background: variant === val ? 'rgba(0,102,255,0.12)' : '#2a2a30',
      border: `1px solid ${variant === val ? T.primary : '#3a3a42'}`, color: variant === val ? T.primaryStrong : '#d4d4d8',
    }}>{val}</button>
  );
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: SP[4], alignItems: 'center', marginBottom: SP[16] }}>
        <span style={{ fontSize: TYPE.caption1.fontSize, color: '#9a9aa2', marginRight: SP[4] }}>variant</span>
        {['info', 'caution', 'error', 'success'].map(seg)}
      </div>
      <div style={{ border: '1px solid #2a2a2a', borderRadius: '12px', background: '#121212', padding: SP[24] }}>
        <div style={{ maxWidth: '460px' }}>
          <SectionMessageContent variant={variant} />
        </div>
        {/* 전체 변형 미리보기 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP[8], marginTop: SP[24], maxWidth: '460px' }}>
          {['info', 'caution', 'error', 'success'].filter(v => v !== variant).map(v => (
            <div key={v} style={{ opacity: 0.5 }}><SectionMessageContent variant={v} /></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Skeleton(Loading) — 콘텐츠 로드 전 실제 레이아웃 형태의 회색 플레이스홀더 + shimmer.
//  variant(text/circle/card) × loading(true/false), shimmer 애니메이션.
function SkeletonPlayground({ activeSubTab }) {
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '760px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 — Text field anatomy와 동일 시각 언어(레이어드 흰 패널 + 흰 콜아웃) */}
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '760px', height: '360px', margin: '0 auto 24px', boxSizing: 'border-box' }}>
          {/* 흰 패널(레이어드 룩) */}
          <div style={{ position: 'absolute', left: '220px', top: '56px', width: '360px', height: '250px', background: '#fff', borderRadius: '12px', zIndex: 2 }} />

          {/* 1. Text 변형 — 가로 막대 2줄(제목+본문) */}
          <div style={{ position: 'absolute', left: '250px', top: '84px', width: '280px', height: '14px', background: '#d4d4d8', borderRadius: '4px', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '250px', top: '106px', width: '190px', height: '14px', background: '#d4d4d8', borderRadius: '4px', zIndex: 3 }} />
          {/* 4. Shimmer — 제목 막대 위 좌→우 하이라이트 광원 */}
          <div style={{ position: 'absolute', left: '380px', top: '84px', width: '64px', height: '14px', background: 'linear-gradient(90deg, rgba(244,244,246,0), #f4f4f6, rgba(244,244,246,0))', borderRadius: '4px', zIndex: 3 }} />
          {/* 2. Circle 변형 — 정원(아바타) */}
          <div style={{ position: 'absolute', left: '250px', top: '140px', width: '60px', height: '60px', background: '#d4d4d8', borderRadius: '50%', zIndex: 3 }} />
          {/* 3. Card 변형 — 둥근 사각형(썸네일) */}
          <div style={{ position: 'absolute', left: '250px', top: '222px', width: '240px', height: '72px', background: '#e4e4e7', borderRadius: '8px', zIndex: 3 }} />

          {/* SVG 연결선 — 요소 경계까지 정확히 그음 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4 }}>
            {/* 1. 텍스트 막대 좌측 경계(x=250) */}
            <line x1="195" y1="95" x2="250" y2="95" stroke="#999" strokeWidth="1.2" /><circle cx="250" cy="95" r="1.6" fill="#999" />
            {/* 2. 원 좌측 경계(x=250) */}
            <line x1="195" y1="170" x2="250" y2="170" stroke="#999" strokeWidth="1.2" /><circle cx="250" cy="170" r="1.6" fill="#999" />
            {/* 3. 카드 좌측 경계(x=250) */}
            <line x1="195" y1="258" x2="250" y2="258" stroke="#999" strokeWidth="1.2" /><circle cx="250" cy="258" r="1.6" fill="#999" />
            {/* 4. Shimmer 상단 경계(y=84) — 위에서 아래로 */}
            <line x1="412" y1="52" x2="412" y2="84" stroke="#999" strokeWidth="1.2" /><circle cx="412" cy="84" r="1.6" fill="#999" />
          </svg>
          {/* Callouts — 흰 원 + 검정 텍스트 */}
          <div style={{ position: 'absolute', left: '185px', top: '95px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>1</div>
          <div style={{ position: 'absolute', left: '185px', top: '170px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>2</div>
          <div style={{ position: 'absolute', left: '185px', top: '258px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>3</div>
          <div style={{ position: 'absolute', left: '412px', top: '42px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>4</div>

          {/* 간격 치수선 — 토글 시 표시(SP 토큰). 텍스트 막대 줄 간격 SP[8] */}
          {showSpacing && (
            <DimLine dir="v" x={452} y={98} sp={8} />
          )}
        </div>
        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px 0' }}>
          {[
            { num: 1, label: 'Text 변형 (막대)' },
            { num: 2, label: 'Circle 변형 (아바타)' },
            { num: 3, label: 'Card 변형 (썸네일)' },
            { num: 4, label: 'Shimmer (하이라이트)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>{item.num}. {item.label}</div>
          ))}
        </div>

        {/* 간격 스펙 표 — Skeleton */}
        {showSpacing && (
        <div style={{ maxWidth: '760px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (
              <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>
            ))}
            {[
              ['텍스트 막대 줄 간격', 'SP[8]', '8', '제목↔본문 막대'],
              ['막대 모서리 반경', 'SP[4]', '4', 'Text 변형'],
              ['카드 변형 반경', 'radius', '8', 'Card 변형'],
              ['아바타', '원형', '—', 'Circle 변형'],
            ].map((r, i) => r.map((c, j) => (
              <div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>
            )))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 이미 SP 스케일 준수 — 정규화 불필요.</div>
        </div>
        )}
      </div>
    );
  }

  // Interactive — variant 토글 + loading 애니메이션
  const [variant, setVariant] = useState('text');
  const [loading, setLoading] = useState(true);
  const seg = (val, cur, set, label) => (
    <button type="button" onClick={() => set(val)} style={{
      height: 30, padding: `0 ${SP[12]}`, borderRadius: 6, cursor: 'pointer', fontFamily: T.font,
      fontSize: TYPE.caption1.fontSize, fontWeight: cur === val ? W.semibold : W.regular,
      background: cur === val ? 'rgba(0,102,255,0.12)' : '#2a2a30',
      border: `1px solid ${cur === val ? T.primary : '#3a3a42'}`, color: cur === val ? T.primaryStrong : '#d4d4d8',
    }}>{label}</button>
  );

  const skeletonEl = loading ? (
    <div style={{
      display: variant === 'circle' ? 'flex' : 'block',
      gap: variant === 'circle' ? SP[8] : 'auto',
      alignItems: variant === 'circle' ? 'center' : 'auto',
    }}>
      {variant === 'text' && (
        <>
          <div style={{ width: '100%', height: '14px', background: '#2e2e2e', borderRadius: '4px', marginBottom: SP[8] }} />
          <div style={{ width: '80%', height: '14px', background: '#2e2e2e', borderRadius: '4px' }} />
        </>
      )}
      {variant === 'circle' && (
        <div style={{ width: '60px', height: '60px', background: '#2e2e2e', borderRadius: '50%', flexShrink: 0 }} />
      )}
      {variant === 'card' && (
        <div style={{ width: '100%', height: '120px', background: '#2e2e2e', borderRadius: '8px' }} />
      )}
    </div>
  ) : variant === 'text' ? (
    <div>
      <div style={{ fontSize: TYPE.label1.fontSize, fontWeight: W.semibold, color: '#e8e8ec', marginBottom: SP[8] }}>교차로 12번 카메라</div>
      <div style={{ fontSize: TYPE.caption1.fontSize, color: '#9a9aa2', lineHeight: 1.6 }}>정상 작동 중 · 최근 이벤트 3건 · 마지막 갱신 방금 전</div>
    </div>
  ) : variant === 'circle' ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: SP[12] }}>
      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name="nest_cam_outdoor" size={28} color="#fff" />
      </div>
      <div>
        <div style={{ fontSize: TYPE.label1.fontSize, fontWeight: W.semibold, color: '#e8e8ec' }}>관제 카메라</div>
        <div style={{ fontSize: TYPE.caption1.fontSize, color: '#9a9aa2' }}>온라인</div>
      </div>
    </div>
  ) : (
    <div style={{ background: '#1e1e1e', border: '1px solid #2e2e2e', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ height: '72px', background: 'linear-gradient(135deg, #1f2a44, #12203f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="nest_cam_outdoor" size={28} color={T.primaryStrong} />
      </div>
      <div style={{ padding: SP[12] }}>
        <div style={{ fontSize: TYPE.label1.fontSize, fontWeight: W.semibold, color: '#e8e8ec' }}>강변북로 CCTV</div>
        <div style={{ marginTop: SP[4], fontSize: TYPE.caption1.fontSize, color: '#9a9aa2' }}>실시간 영상 스트리밍 중</div>
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: SP[16], flexWrap: 'wrap', marginBottom: SP[16], alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: SP[4], alignItems: 'center' }}>
          <span style={{ fontSize: TYPE.caption1.fontSize, color: '#9a9aa2', marginRight: SP[4] }}>variant</span>
          {['text', 'circle', 'card'].map(x => seg(x, variant, setVariant, x))}
        </div>
        <button type="button" onClick={() => setLoading(!loading)} style={{
          height: 30, padding: `0 ${SP[12]}`, borderRadius: 6, cursor: 'pointer', fontFamily: T.font,
          fontSize: TYPE.caption1.fontSize, fontWeight: W.regular,
          background: '#2a2a30', border: '1px solid #3a3a42', color: '#d4d4d8',
        }}>
          {loading ? 'loading (스켈레톤)' : 'loaded (콘텐츠)'}
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '240px', border: '1px solid #2a2a2a', borderRadius: '12px', background: '#121212', padding: SP[24] }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          {skeletonEl}
        </div>
      </div>
    </div>
  );
}

// Fallback view — 정상 콘텐츠를 표시할 수 없을 때의 대체 화면.
//  variant(error/empty/forbidden) × size(compact/full), 액션 버튼(주요=Primary).
const FALLBACK_VARIANTS = {
  error:     { icon: 'error',       color: T.error,      title: '데이터를 불러오지 못했습니다',   desc: '네트워크 상태를 확인한 뒤 다시 시도하세요', action: '재시도' },
  empty:     { icon: 'folder_open', color: '#8a8a92',    title: '표시할 데이터가 없습니다',       desc: '검색 조건을 변경해 다시 시도해 보세요',   action: null },
  forbidden: { icon: 'warning',     color: T.cautionary, title: '접근 권한이 없습니다',           desc: '관리자에게 권한을 요청하세요',           action: null },
};
const FALLBACK_SIZES = {
  compact: { icon: 40, title: TYPE.label1.fontSize, desc: TYPE.caption1.fontSize, pad: SP[24], gap: SP[8] },
  full:    { icon: 72, title: TYPE.headline1.fontSize, desc: TYPE.label1.fontSize, pad: SP[64], gap: SP[12] },
};

function FallbackViewContent({ variant = 'empty', size = 'compact', loading = false, onRetry }) {
  const v = FALLBACK_VARIANTS[variant];
  const s = FALLBACK_SIZES[size];
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', gap: s.gap, padding: `${s.pad} ${SP[24]}`, width: '100%', boxSizing: 'border-box',
    }}>
      <Icon name={v.icon} size={s.icon} color={v.color} />
      <div style={{ fontSize: s.title, fontWeight: W.semibold, color: '#e8e8ec' }}>{v.title}</div>
      <div style={{ fontSize: s.desc, color: '#8a8a92', lineHeight: 1.5 }}>{v.desc}</div>
      {v.action && (
        <button type="button" onClick={onRetry} disabled={loading} style={{
          marginTop: SP[8], height: 36, padding: `0 ${SP[16]}`, borderRadius: 8, cursor: loading ? 'default' : 'pointer',
          fontSize: TYPE.label1.fontSize, fontWeight: W.semibold, fontFamily: T.font, color: '#fff',
          background: loading ? T.primaryHeavy : T.primary, border: 'none', opacity: loading ? 0.8 : 1,
          display: 'inline-flex', alignItems: 'center', gap: SP[8],
        }}>
          {loading && <Icon name="cycle" size={14} color="#fff" />}
          {loading ? '재시도 중…' : v.action}
        </button>
      )}
    </div>
  );
}

function FallbackViewPlayground({ activeSubTab }) {
  const [variant, setVariant] = useState('error');
  const [size, setSize] = useState('compact');
  const [loading, setLoading] = useState(false);
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  const retry = () => { setLoading(true); };

  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '760px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 — Text field anatomy와 동일 시각 언어(레이어드 흰 패널 + 실제 요소 + 흰 콜아웃) */}
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '760px', height: '400px', margin: '0 auto 24px', boxSizing: 'border-box' }}>
          {/* 5. 컨테이너 — Fallback 영역 흰 패널(레이어드 룩), center x=410 */}
          <div style={{ position: 'absolute', left: '240px', top: '56px', width: '340px', height: '288px', background: '#fff', borderRadius: '12px', zIndex: 2 }} />

          {/* 1. 일러스트/아이콘 — 점선 placeholder (76×76, center x=410, center y=130) */}
          <div style={{ position: 'absolute', left: '372px', top: '92px', width: '76px', height: '76px', border: '1.5px dashed #a1a1aa', borderRadius: '12px', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#c4c4c8" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.6" /><path d="M21 15l-5-5L5 21" /></svg>
          </div>
          {/* 2. 제목(Title) — 실제 텍스트(굵게) */}
          <div style={{ position: 'absolute', left: '340px', top: '190px', width: '140px', textAlign: 'center', zIndex: 3, fontSize: TYPE.label1.fontSize, fontWeight: W.bold, color: '#18181b' }}>Title</div>
          {/* 3. 보조 설명(Description) — 실제 텍스트(회색) */}
          <div style={{ position: 'absolute', left: '300px', top: '220px', width: '220px', textAlign: 'center', zIndex: 3, fontSize: TYPE.label2.fontSize, color: '#a1a1aa' }}>Description</div>
          {/* 4. 액션 버튼(Action) — Button (96×36, center x=410, center y=280) */}
          <div style={{ position: 'absolute', left: '362px', top: '262px', width: '96px', height: '36px', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: TYPE.label1.fontSize, fontWeight: W.semibold, color: T.primary }}>Button</div>

          {/* SVG 연결선 — 요소 경계까지 정확히 그음 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4 }}>
            {/* 1. 아이콘 좌측 경계(x=372) */}
            <line x1="185" y1="130" x2="372" y2="130" stroke="#999" strokeWidth="1.2" /><circle cx="372" cy="130" r="1.6" fill="#999" />
            {/* 2. 제목 좌측 경계(x=340) */}
            <line x1="185" y1="200" x2="340" y2="200" stroke="#999" strokeWidth="1.2" /><circle cx="340" cy="200" r="1.6" fill="#999" />
            {/* 3. 설명 좌측 경계(x=300) */}
            <line x1="185" y1="230" x2="300" y2="230" stroke="#999" strokeWidth="1.2" /><circle cx="300" cy="230" r="1.6" fill="#999" />
            {/* 4. 버튼 우측 경계(x=458) */}
            <line x1="630" y1="280" x2="458" y2="280" stroke="#999" strokeWidth="1.2" /><circle cx="458" cy="280" r="1.6" fill="#999" />
            {/* 5. 컨테이너 상단 경계(y=56) */}
            <line x1="410" y1="40" x2="410" y2="56" stroke="#999" strokeWidth="1.2" /><circle cx="410" cy="56" r="1.6" fill="#999" />
          </svg>
          {/* Callouts — 흰 원 + 검정 텍스트 */}
          <div style={{ position: 'absolute', left: '175px', top: '130px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>1</div>
          <div style={{ position: 'absolute', left: '175px', top: '200px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>2</div>
          <div style={{ position: 'absolute', left: '175px', top: '230px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>3</div>
          <div style={{ position: 'absolute', left: '640px', top: '280px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>4</div>
          <div style={{ position: 'absolute', left: '410px', top: '30px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>5</div>

          {/* 간격 치수선 — 세로 리듬(아이콘↔제목 SP[24] · 설명↔버튼 SP[24]), x=490 오른쪽 여백열 */}
          {showSpacing && (
            <>
              <DimLine dir="v" x={490} y={168} sp={24} />{/* 아이콘 ↔ 제목 */}
              <DimLine dir="v" x={490} y={238} sp={24} />{/* 설명 ↔ 버튼 */}
            </>
          )}
        </div>
        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 0' }}>
          {[
            { num: 1, label: '일러스트 / 아이콘' },
            { num: 2, label: '제목 (Title)' },
            { num: 3, label: '보조 설명 (Description)' },
            { num: 4, label: '액션 버튼 (Action)' },
            { num: 5, label: '컨테이너 (Fallback 영역)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>{item.num}. {item.label}</div>
          ))}
        </div>

        {/* 간격 스펙 표 */}
        {showSpacing && (
        <div style={{ maxWidth: '760px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (<div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>))}
            {[
              ['아이콘 ↔ 제목', 'SP[24]', '24', '일러스트와 제목 간격'],
              ['제목 ↔ 설명', 'SP[8]', '8', '제목과 보조 설명 간격'],
              ['설명 ↔ 버튼', 'SP[24]', '24', '설명과 액션 버튼 간격'],
              ['아이콘 크기', '—', '76', '일러스트 placeholder'],
              ['버튼 크기', '—', '96×36', '액션 버튼'],
            ].map((r, i) => r.map((c, j) => (<div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>)))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ off-grid 22→SP[24] 정규화. 세로 리듬 SP[8]/SP[24] 기준.</div>
        </div>
        )}
      </div>
    );
  }

  // Interactive — variant × size 전환 + 재시도 로딩
  const seg = (val, cur, set, label) => (
    <button type="button" onClick={() => { set(val); setLoading(false); }} style={{
      height: 30, padding: `0 ${SP[12]}`, borderRadius: 6, cursor: 'pointer', fontFamily: T.font,
      fontSize: TYPE.caption1.fontSize, fontWeight: cur === val ? W.semibold : W.regular,
      background: cur === val ? 'rgba(0,102,255,0.12)' : '#2a2a30',
      border: `1px solid ${cur === val ? T.primary : '#3a3a42'}`, color: cur === val ? T.primaryStrong : '#d4d4d8',
    }}>{label}</button>
  );
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: SP[16], flexWrap: 'wrap', marginBottom: SP[16] }}>
        <div style={{ display: 'flex', gap: SP[4], alignItems: 'center' }}>
          <span style={{ fontSize: TYPE.caption1.fontSize, color: '#9a9aa2', marginRight: SP[4] }}>variant</span>
          {['error', 'empty', 'forbidden'].map(x => seg(x, variant, setVariant, x))}
        </div>
        <div style={{ display: 'flex', gap: SP[4], alignItems: 'center' }}>
          <span style={{ fontSize: TYPE.caption1.fontSize, color: '#9a9aa2', marginRight: SP[4] }}>size</span>
          {['compact', 'full'].map(x => seg(x, size, setSize, x))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '340px', border: '1px solid #2a2a2a', borderRadius: '12px', background: '#121212', padding: SP[16] }}>
        <div style={{ width: size === 'full' ? '100%' : '320px', background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: '8px' }}>
          <FallbackViewContent variant={variant} size={size} loading={loading} onRetry={retry} />
        </div>
      </div>
    </div>
  );
}

function CategoryPlayground({ activeSubTab }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  const items = ['전체', '지점별', '장비별', '이벤트별'];

  // ── Anatomy ──────────────────────────────────────
  if (activeSubTab === 'anatomy') {
    const inactiveChipStyle = {
      width: '84px',
      height: '36px',
      backgroundColor: '#ffffff',
      color: '#71717a',
      border: '1px solid #e4e4e7',
      borderRadius: '8px',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      flexShrink: 0,
    };
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '720px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 */}
        <div style={{
          position: 'relative',
          background: '#efefef',
          borderRadius: '16px',
          width: '720px',
          height: '340px',
          margin: '0 auto 24px',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* 카테고리 컴포넌트 — 칩 행 */}
          <div style={{
            position: 'absolute',
            left: '164px',
            top: '150px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 3,
          }}>
            {/* Active chip (1) */}
            <div style={{
              width: '72px',
              height: '36px',
              backgroundColor: '#18181b',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              flexShrink: 0,
            }}>Active</div>
            {/* Inactive chips (2) */}
            <div style={inactiveChipStyle}>Inactive</div>
            <div style={inactiveChipStyle}>Inactive</div>
            <div style={inactiveChipStyle}>Inactive</div>
            {/* Icon button (3) — 점선 */}
            <div style={{
              width: '36px',
              height: '36px',
              marginLeft: '24px',
              border: '1.5px dashed #a1a1aa',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#71717a',
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><line x1="12" y1="5" x2="12" y2="19" /></svg>
            </div>
          </div>

          {/* SVG 직선 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
            {/* 1. Active chip -> 수직선 아래로 */}
            <line x1="200" y1="190" x2="200" y2="238" stroke="#999" strokeWidth="1.2" />
            {/* 2. Inactive chip -> 수직선 아래로 (2번째 칩) */}
            <line x1="286" y1="190" x2="286" y2="238" stroke="#999" strokeWidth="1.2" />
            {/* 3. Icon button -> 수직선 위로 */}
            <line x1="562" y1="146" x2="562" y2="103" stroke="#999" strokeWidth="1.2" />
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '200px', top: '250px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '286px', top: '250px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '562px', top: '90px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>

          {/* 간격 치수선 — 칩 간격 SP[8] · 아이콘 버튼 분리 SP[24] */}
          {showSpacing && (
            <>
              <DimLine dir="h" x={236} y={168} sp={8} />{/* 칩 간격 */}
              <DimLine dir="h" x={512} y={168} sp={24} />{/* 아이콘 버튼 분리 */}
            </>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Active chip (활성 카테고리 칩)' },
            { num: 2, label: 'Inactive chip (비활성 카테고리 칩)' },
            { num: 3, label: 'Icon button (더보기 / 펼쳐보기 버튼)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>

        {/* 간격 스펙 표 */}
        {showSpacing && (
        <div style={{ maxWidth: '720px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (<div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>))}
            {[
              ['칩 간격', 'SP[8]', '8', '카테고리 칩 사이 간격'],
              ['아이콘 버튼 분리', 'SP[24]', '24', '칩 그룹 ↔ 아이콘 버튼'],
              ['칩 높이', '—', '36', '칩/버튼 높이'],
              ['칩 반경', 'radius', '8', 'border-radius'],
            ].map((r, i) => r.map((c, j) => (<div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>)))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 이미 SP 준수(gap SP[8] · 분리 SP[24]). 실동작 칩 패딩 8/16 = SP[8]/SP[16].</div>
        </div>
        )}
      </div>
    );
  }

  // ── Interactive Playground ───────────────────────
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start', width: '100%', textAlign: 'left' }}>
      <div style={{ fontSize: '13px', color: '#888', fontWeight: 'bold' }}>하위 카테고리 네비게이션 (Category)</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {items.map((label, idx) => (
          <button
            key={label}
            onClick={() => setActiveIdx(idx)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              border: idx === activeIdx ? 'none' : '1px solid #3a3a3a',
              backgroundColor: idx === activeIdx ? '#0066FF' : 'transparent',
              color: idx === activeIdx ? '#fff' : '#aaa',
              fontWeight: idx === activeIdx ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >{label}</button>
        ))}
        {/* Icon button (더보기) */}
        <button
          aria-label="더보기"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1px solid #3a3a3a',
            backgroundColor: 'transparent',
            color: '#aaa',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
        </button>
      </div>
      <div style={{ fontSize: '13px', color: '#666' }}>
        선택됨: <span style={{ color: '#fff', fontWeight: 600 }}>{items[activeIdx]}</span>
      </div>
    </div>
  );
}

function ListCellPlayground({ activeSubTab }) {
  const [trailingType, setTrailingType] = useState('Switch'); // 'Badge' | 'Checkbox' | 'Icon button' | 'Switch' | 'Text button' | 'Value'
  const [hasDivider, setHasDivider] = useState(false);
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '720px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 */}
        <div style={{
          position: 'relative',
          background: '#efefef',
          borderRadius: '16px',
          width: '720px',
          height: '340px',
          margin: '0 auto 24px',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* 리스트 셀 컴포넌트 — 중앙 */}
          <div style={{
            position: 'absolute',
            left: '150px',
            top: '138px',
            width: '420px',
            height: '64px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1.5px solid #e4e4e7',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            padding: '12px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 3,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* 1. Leading content (점선 사각형) */}
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '1.5px dashed #a1a1aa',
                  borderRadius: '4px',
                  backgroundColor: '#f4f4f5'
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {/* 2. Label */}
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#18181b', lineHeight: 1 }}>Label</span>
                  {/* 4. Description */}
                  <span style={{ fontSize: '11px', color: '#71717a', lineHeight: 1 }}>Description</span>
                </div>
              </div>
              {/* 3. Trailing content (Value 텍스트) */}
              <span style={{ fontSize: '13px', color: '#71717a', fontWeight: '500' }}>Value</span>
            </div>
            {/* 5. Divider */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: '20px',
              right: '20px',
              height: '1.5px',
              backgroundColor: '#e4e4e7'
            }} />
          </div>

          {/* SVG 직선 */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
          >
            {/* 1. Leading content -> 수직선 위로 */}
            <line x1="180" y1="100" x2="180" y2="155" stroke="#999" strokeWidth="1.2" />
            {/* 2. Label -> 수직선 위로 */}
            <line x1="215" y1="100" x2="215" y2="151" stroke="#999" strokeWidth="1.2" />
            {/* 3. Trailing content -> 수평선 우측으로 */}
            <line x1="600" y1="168" x2="554" y2="168" stroke="#999" strokeWidth="1.2" />
            <circle cx="554" cy="168" r="1.5" fill="#999" />
            {/* 4. Description -> 수평선 좌측으로 */}
            <line x1="130" y1="183" x2="198" y2="183" stroke="#999" strokeWidth="1.2" />
            <circle cx="198" cy="183" r="1.5" fill="#999" />
            {/* 5. Divider -> 수직선 아래로 */}
            <line x1="360" y1="250" x2="360" y2="204" stroke="#999" strokeWidth="1.2" />
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '180px', top: '100px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '215px', top: '100px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '600px', top: '168px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>
          <div style={{ position: 'absolute', left: '130px', top: '183px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>4</div>
          <div style={{ position: 'absolute', left: '360px', top: '250px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>5</div>

          {/* 간격 치수선 — 셀 패딩 좌우 SP[16](20→16) · 상하 SP[12] */}
          {showSpacing && (
            <>
              <PaddingFill x={150} y={138} w={420} h={64} t={12} l={20} r={20} b={12} />
              <DimLine dir="h" x={150} y={170} sp={16} />{/* 좌우 패딩 */}
              <DimLine dir="v" x={300} y={138} sp={12} />{/* 상하 패딩 */}
            </>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Leading content' },
            { num: 2, label: 'Label' },
            { num: 3, label: 'Trailing content' },
            { num: 4, label: 'Description' },
            { num: 5, label: 'Divider' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>

        {/* 간격 스펙 표 */}
        {showSpacing && (
        <div style={{ maxWidth: '720px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (<div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>))}
            {[
              ['좌우 패딩', 'SP[16]', '20', '셀 좌우 여백'],
              ['상하 패딩', 'SP[12]', '12', '셀 상하 여백'],
              ['Leading ↔ 텍스트', 'SP[12]', '12', '아이콘과 라벨 간격'],
              ['Label ↔ Description', 'SP[4]', '2', '텍스트 세로 간격'],
              ['Divider 인셋', 'SP[16]', '20', '구분선 좌우 여백'],
              ['셀 높이', '—', '64', '리스트 셀 높이'],
              ['모서리 반경', 'radius', '8', 'border-radius'],
            ].map((r, i) => r.map((c, j) => (<div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>)))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ off-grid 좌우 패딩·Divider 20→SP[16] · Label/Desc 2→SP[4] 정규화.</div>
        </div>
        )}
      </div>
    );
  }

  const renderTrailingElement = (type) => {
    switch (type) {
      case 'Badge':
        return (
          <div style={{
            padding: '3px 8px',
            backgroundColor: '#3385FF',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: 'bold',
            borderRadius: '4px',
            lineHeight: 1
          }}>
            Badge
          </div>
        );
      case 'Checkbox':
        return (
          <div style={{
            width: '18px',
            height: '18px',
            backgroundColor: '#3385FF',
            border: '1.5px solid #3385FF',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        );
      case 'Icon button':
        return (
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#2a2a2c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#8a8a8f'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
            </svg>
          </div>
        );
      case 'Switch':
        return (
          <div style={{
            width: '34px',
            height: '18px',
            borderRadius: '9px',
            backgroundColor: '#3a3a3c',
            position: 'relative',
            cursor: 'pointer'
          }}>
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              position: 'absolute',
              top: '2px',
              right: '2px'
            }} />
          </div>
        );
      case 'Text button':
        return (
          <span style={{
            color: '#3385FF',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Button
          </span>
        );
      case 'Value':
      default:
        return (
          <span style={{
            color: '#8a8a8f',
            fontSize: '13px',
            fontWeight: '500'
          }}>
            Value
          </span>
        );
    }
  };

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '24px' }}>Interactive Demo</div>
      
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left Side: Preview */}
        <div style={{
          flex: 1.8,
          background: '#1e1e1e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          boxSizing: 'border-box'
        }}>
          {/* Card container */}
          <div style={{
            width: '100%',
            maxWidth: '320px',
            backgroundColor: '#151517',
            border: '1px solid #2a2a2a',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.24)'
          }}>
            {/* List cell 1 */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                minHeight: '56px',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Leading icon dashed placeholder */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '1.5px dashed rgba(255, 255, 255, 0.4)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Label</span>
                    <span style={{ fontSize: '11px', color: '#888888' }}>Description</span>
                  </div>
                </div>
                
                {renderTrailingElement(trailingType)}
              </div>
              {hasDivider && <div style={{ height: '1px', backgroundColor: '#2a2a2a', margin: '0 16px' }} />}
            </div>

            {/* List cell 2 */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                minHeight: '56px',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Leading icon dashed placeholder */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '1.5px dashed rgba(255, 255, 255, 0.4)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Label</span>
                    <span style={{ fontSize: '11px', color: '#888888' }}>Description</span>
                  </div>
                </div>
                
                {renderTrailingElement(trailingType)}
              </div>
              {hasDivider && <div style={{ height: '1px', backgroundColor: '#2a2a2a', margin: '0 16px' }} />}
            </div>

            {/* List cell 3 */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                minHeight: '56px',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Leading icon dashed placeholder */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '1.5px dashed rgba(255, 255, 255, 0.4)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Label</span>
                    <span style={{ fontSize: '11px', color: '#888888' }}>Description</span>
                  </div>
                </div>
                
                {renderTrailingElement(trailingType)}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Control panel */}
        <div 
          className="ds-playground-controls"
          style={{
            flex: 1,
            background: '#141414',
            borderLeft: '1px solid #2a2a2a',
            padding: '24px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxHeight: '360px',
            overflowY: 'auto'
          }}
        >
          {/* Trailing Element Selection */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Trailing Element</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Badge', 'Checkbox', 'Icon button', 'Switch', 'Text button', 'Value'].map(type => (
                <PlaygroundRadioOption
                  key={type}
                  label={type}
                  checked={trailingType === type}
                  onChange={() => setTrailingType(type)}
                />
              ))}
            </div>
          </div>

          {/* Divider selection */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Divider</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption
                label="True"
                checked={hasDivider}
                onChange={() => setHasDivider(true)}
              />
              <PlaygroundRadioOption
                label="False"
                checked={!hasDivider}
                onChange={() => setHasDivider(false)}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TablePlayground — Content(Normal/Input) · Pagination(None/Extended/Compact/Minimize)
   ───────────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────────────
   CheckboxPlayground — Library 화면(Event Search·권한 설정 등)에서 쓰는
   check_on/check_off 아이콘 기반 체크박스. 상태(기본/체크/비활성) + 전체선택 트리.
   ───────────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────────────
   FilterButtonPlayground — 필터 버튼 → 팝오버 패널 UX
   트리거(기본/활성+카운트) + 칩 다중선택 / 라디오 단일선택 + 검색 + 초기화·보기
   ───────────────────────────────────────────────────────────────── */
function FilterButtonPlayground({ activeSubTab }) {
  const PRIMARY = '#0066FF';
  const PANEL = '#16161a';
  const BORDER = '#2a2a30';
  const FONT = "'Inter','Pretendard','맑은 고딕',sans-serif";

  // ── Anatomy: 라이트 카드 + 번호 콜아웃(1 Label · 2 Count badge · 3 Dropdown caret · 4 Container) ──
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '720px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 */}
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '720px', height: '300px', margin: '0 auto 24px', overflow: 'hidden', boxSizing: 'border-box' }}>
          {/* 필터 트리거(활성) — 중앙 */}
          <div style={{ position: 'absolute', left: '286px', top: '132px', width: '148px', height: '36px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0 14px', borderRadius: '8px', background: 'rgba(0,102,255,0.10)', border: '1px solid #0066FF', color: '#0066FF', fontSize: '13px', fontWeight: 600, boxSizing: 'border-box', whiteSpace: 'nowrap', zIndex: 3 }}>
            이벤트 종류
            <span style={{ minWidth: '16px', height: '16px', padding: '0 4px', borderRadius: '8px', background: '#0066FF', color: '#fff', fontSize: '10px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
            <span style={{ fontSize: '9px' }}>▾</span>
          </div>

          {/* 연결선 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
            {/* 1. Label -> 좌측 */}
            <line x1="258" y1="150" x2="284" y2="150" stroke="#999" strokeWidth="1.2" />
            {/* 2. Count badge -> 위 */}
            <line x1="379" y1="86" x2="379" y2="132" stroke="#999" strokeWidth="1.2" />
            <circle cx="379" cy="132" r="2.6" fill="#999" />
            {/* 3. Dropdown caret -> 우측 */}
            <line x1="500" y1="150" x2="436" y2="150" stroke="#999" strokeWidth="1.2" />
            {/* 4. Container -> 아래 */}
            <line x1="360" y1="250" x2="360" y2="170" stroke="#999" strokeWidth="1.2" />
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '240px', top: '150px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '379px', top: '70px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '510px', top: '150px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>
          <div style={{ position: 'absolute', left: '360px', top: '250px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>4</div>

          {/* 간격 치수선 — 트리거 좌우 패딩 SP[12](14→12) */}
          {showSpacing && (
            <>
              <PaddingFill x={287} y={133} w={146} h={34} t={0} l={14} r={14} b={0} />{/* border 1px 보정 */}
              <DimLine dir="h" x={286} y={158} sp={12} />{/* 좌우 패딩 */}
            </>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Label' },
            { num: 2, label: 'Count badge' },
            { num: 3, label: 'Dropdown caret' },
            { num: 4, label: 'Container' },
          ].map((item) => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>

        {/* 간격 스펙 표 */}
        {showSpacing && (
        <div style={{ maxWidth: '720px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (<div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>))}
            {[
              ['좌우 패딩', 'SP[12]', '14', '트리거 좌우 여백'],
              ['요소 간 간격', 'SP[8]', '6', '라벨/배지/캐럿 간격'],
              ['카운트 배지 패딩', 'SP[4]', '4', '배지 좌우 여백'],
              ['트리거 높이', '—', '36', '컨트롤 높이'],
              ['모서리 반경', 'radius', '8', 'border-radius'],
            ].map((r, i) => r.map((c, j) => (<div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>)))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ off-grid 패딩 14→SP[12] · gap 6→SP[8] 정규화.</div>
        </div>
        )}
      </div>
    );
  }

  const [variant, setVariant] = useState('event'); // 'event'(칩·다중선택) | 'device'(라디오·단일선택)
  const [stateMode, setStateMode] = useState('active'); // 'default' | 'active'
  const [popover, setPopover] = useState('open'); // 'open' | 'closed'
  const [cats, setCats] = useState({ 침입: true, 배회: true });
  const [cap, setCap] = useState('전체');
  const catCount = Object.values(cats).filter(Boolean).length;
  const toggleCat = (k) => setCats((s) => ({ ...s, [k]: !s[k] }));

  // 이벤트 종류 — 위험도 밴드별 그룹(다중선택) / 장비 종류(단일선택)
  const GROUPS = [
    { name: '위험', items: ['화재', '싸움', '무단횡단(공간적)'] },
    { name: '경고', items: ['침입', '침입경고', '쓰러짐', '불법 주정차'] },
    { name: '주의', items: ['배회', '횡단대기'] },
  ];
  const CAPS = ['전체', '분석기', '카메라', 'ITS 검지기'];

  // 트리거 — Default(테두리 #3a3a3a·글자 #cccccc) / Active(#0066FF·rgba(0,102,255,.1)) + 카운트 배지
  const Trigger = ({ label, active, count, onClick }) => {
    const on = active;
    return (
      <button type="button" onClick={onClick} style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px', height: '34px', padding: '0 12px',
        borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: FONT,
        background: on ? 'rgba(0,102,255,0.1)' : '#1a1a1f',
        border: `1px solid ${on ? PRIMARY : '#3a3a3a'}`,
        color: on ? PRIMARY : '#cccccc', fontWeight: on ? 600 : 500,
      }}>
        {label}
        {count > 0 && (
          <span style={{ minWidth: '16px', height: '16px', padding: '0 4px', borderRadius: '8px', background: PRIMARY, color: '#fff', fontSize: '10px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>
        )}
        <span style={{ fontSize: '9px' }}>▾</span>
      </button>
    );
  };

  const Chip = ({ label }) => {
    const on = cats[label];
    return (
      <button type="button" onClick={() => toggleCat(label)} style={{
        height: '30px', padding: '0 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: FONT,
        background: on ? 'rgba(0,102,255,0.14)' : '#23232a', border: `1px solid ${on ? PRIMARY : '#3a3a42'}`,
        color: on ? '#3385FF' : '#bdbdc4', fontWeight: on ? 600 : 400, whiteSpace: 'nowrap',
      }}>{label}</button>
    );
  };

  const Radio = ({ label }) => {
    const on = cap === label;
    return (
      <div onClick={() => setCap(label)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 4px', cursor: 'pointer' }}>
        <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${on ? PRIMARY : '#4a4a52'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxSizing: 'border-box' }}>
          {on && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: PRIMARY }} />}
        </span>
        <span style={{ fontSize: '13px', color: on ? '#fff' : '#bdbdc4', fontWeight: on ? 600 : 400 }}>{label}</span>
      </div>
    );
  };

  const Footer = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', padding: '12px 14px', borderTop: `1px solid ${BORDER}` }}>
      <button type="button" style={{ height: '30px', padding: '0 12px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#9a9aa2', fontSize: '12px', cursor: 'pointer', fontFamily: FONT }}>초기화</button>
      <button type="button" style={{ height: '30px', padding: '0 18px', borderRadius: '6px', border: 'none', background: PRIMARY, color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>보기</button>
    </div>
  );

  const panelWrap = { width: '300px', background: PANEL, border: `1px solid ${BORDER}`, borderRadius: '12px', boxShadow: '0 16px 40px rgba(0,0,0,0.5)', overflow: 'hidden' };
  const panelHead = { padding: '14px 14px 4px', fontSize: '14px', fontWeight: 700, color: '#fff' };
  const popPos = { position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 20 }; // 클릭한 버튼의 왼쪽 끝에 맞춰 아래로

  const categoryPanel = (
    <div style={panelWrap}>
      <div style={panelHead}>이벤트 종류</div>
      <div style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '36px', padding: '0 10px', background: '#141417', border: '1px solid #2e2e35', borderRadius: '8px' }}>
          <Icon name="search" size={15} color="#6f6f77" />
          <span style={{ fontSize: '13px', color: '#6f6f77' }}>이벤트 이름으로 검색</span>
        </div>
      </div>
      <div style={{ maxHeight: '210px', overflowY: 'auto', padding: '0 14px 8px' }} className="ds-playground-controls">
        {GROUPS.map((g) => (
          <div key={g.name} style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#2a2a30' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#e8e8ec' }}>{g.name}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {g.items.map((it) => <Chip key={it} label={it} />)}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );

  const capPanel = (
    <div style={panelWrap}>
      <div style={panelHead}>장비 종류 <span style={{ fontSize: '11px', fontWeight: 400, color: '#6a6a72' }}>· 현장 설치 장비</span></div>
      <div style={{ padding: '8px 14px' }}>
        {CAPS.map((c) => <Radio key={c} label={c} />)}
      </div>
      <Footer />
    </div>
  );

  // 상태/구성에 따른 트리거 표기 + 활성 팝오버
  const isActive = stateMode === 'active';
  const isEvent = variant === 'event';
  const triggerLabel = isEvent
    ? (isActive ? `이벤트 종류 · ${catCount}개` : '이벤트 종류')
    : (isActive ? `장비 종류 · ${cap}` : '장비 종류');
  const triggerCount = isEvent && !isActive ? catCount : 0;
  const activePanel = isEvent ? categoryPanel : capPanel;

  const RadioOption = ({ label, checked, onChange }) => (
    <div onClick={onChange} className="ds-radio-option" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none', padding: '2px 0' }}>
      <div className="ds-radio-circle" style={{ width: '20px', height: '20px', borderRadius: '50%', border: checked ? '2px solid #111' : '2px solid #3e3e42', backgroundColor: checked ? '#3385FF' : '#1b1b1d', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', transition: 'all 0.15s' }}>
        {checked && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffffff' }} />}
      </div>
      <span style={{ marginLeft: '10px', fontSize: '14px', color: checked ? '#ffffff' : '#a1a1aa', fontWeight: checked ? 600 : 400, transition: 'color 0.15s' }}>{label}</span>
    </div>
  );
  const GroupTitle = ({ children }) => <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>{children}</div>;

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: FONT }}>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '480px' }}>
        {/* Left: Preview */}
        <div style={{ flex: 1.8, background: '#121214', display: 'flex', alignItems: popover === 'open' ? 'flex-start' : 'center', justifyContent: 'center', position: 'relative', padding: '40px 24px', boxSizing: 'border-box', overflow: 'auto' }}>
          <div style={{ position: 'relative' }}>
            <Trigger label={triggerLabel} active={isActive} count={triggerCount} onClick={() => setPopover((p) => (p === 'open' ? 'closed' : 'open'))} />
            {popover === 'open' && <div style={popPos}>{activePanel}</div>}
          </div>
        </div>
        {/* Right: Controls */}
        <div className="ds-playground-controls" style={{ flex: 1, background: '#1e1e20', borderLeft: '1px solid #2a2a2c', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '480px', overflowY: 'auto', boxSizing: 'border-box' }}>
          <div>
            <GroupTitle>구성 (Selection)</GroupTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <RadioOption label="이벤트 종류 (다중 · 칩)" checked={isEvent} onChange={() => setVariant('event')} />
              <RadioOption label="장비 종류 (단일 · 라디오)" checked={!isEvent} onChange={() => setVariant('device')} />
            </div>
          </div>
          <div>
            <GroupTitle>상태 (State)</GroupTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <RadioOption label="Default" checked={stateMode === 'default'} onChange={() => setStateMode('default')} />
              <RadioOption label="Active (적용됨)" checked={stateMode === 'active'} onChange={() => setStateMode('active')} />
            </div>
          </div>
          <div>
            <GroupTitle>팝오버 (Popover)</GroupTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <RadioOption label="열림" checked={popover === 'open'} onChange={() => setPopover('open')} />
              <RadioOption label="닫힘" checked={popover === 'closed'} onChange={() => setPopover('closed')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckboxPlayground({ activeSubTab }) {
  const PRIMARY = T.primary;
  const CARD = '#16161a';
  const BORDER = '#2a2a30';
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)

  // ── Anatomy: 라이트 카드 + 번호 콜아웃(1 Control · 2 Label) ──
  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '720px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 */}
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '720px', height: '300px', margin: '0 auto 24px', overflow: 'hidden', boxSizing: 'border-box' }}>
          {/* 체크박스 컴포넌트 — 중앙 */}
          <div style={{ position: 'absolute', left: '345px', top: '139px', display: 'inline-flex', alignItems: 'center', gap: SP[8], zIndex: 3 }}>
            <Icon name="check_on" size={22} />
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#18181b', whiteSpace: 'nowrap' }}>Checkbox</span>
          </div>

          {/* 연결선 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
            {/* 1. Control(박스) -> 좌측 */}
            <line x1="284" y1="150" x2="345" y2="150" stroke="#999" strokeWidth="1.2" />
            <circle cx="345" cy="150" r="2.6" fill="#999" />
            {/* 2. Label(텍스트) -> 우측 */}
            <line x1="448" y1="150" x2="502" y2="150" stroke="#999" strokeWidth="1.2" />
            <circle cx="448" cy="150" r="2.6" fill="#999" />
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '266px', top: '150px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '520px', top: '150px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>

          {/* 간격 치수선 — 토글 시 표시(SP 토큰). Control↔Label = SP[8] */}
          {showSpacing && (
            <DimLine dir="h" x={367} y={150} sp={8} />
          )}
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Control' },
            { num: 2, label: 'Label' },
          ].map((item) => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>

        {/* 간격 스펙 표 — 실제 체크박스(Chk) 기준. 간격 SP[8], 컨트롤 16/18px */}
        {showSpacing && (
        <div style={{ maxWidth: '720px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (
              <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>
            ))}
            {[
              ['Control ↔ Label 간격', 'SP[8]', '8', '박스↔라벨(anatomy 10→8 정규화)'],
              ['컨트롤 크기(라벨 동반)', '—', '18', 'check_on/off 아이콘'],
              ['컨트롤 크기(단독)', '—', '16', '라벨 없이 그리드·헤더'],
              ['항목 간 세로 간격', 'SP[12]~SP[16]', '12·16', '목록 나열(권장)'],
            ].map((r, i) => r.map((c, j) => (
              <div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>
            )))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 실제 체크박스는 이미 gap SP[8] — anatomy만 10이라 정규화해 일치. 컨트롤 크기는 라벨 동반 18 / 단독 16.</div>
        </div>
        )}
      </div>
    );
  }

  // Library 표준 체크박스 — Icon check_on/check_off + 라벨 (Event Search Chk 패턴)
  const Chk = ({ on, onClick, disabled, children }) => (
    <span
      onClick={disabled ? undefined : onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none',
        opacity: disabled ? 0.4 : 1,
        fontSize: '14px', color: on ? '#e8e8ec' : '#9a9aa2',
      }}
    >
      <Icon name={on ? 'check_on' : 'check_off'} size={18} />
      {children}
    </span>
  );

  // 인터랙티브: 전체 선택 + 하위 항목 (Event Search 이벤트 필터 패턴)
  const ITEMS = ['침입', '무단횡단(공간적)', '침입경고', '배회'];
  const [checked, setChecked] = useState({ 침입: true, '무단횡단(공간적)': true, 침입경고: false, 배회: true });
  const allOn = ITEMS.every((k) => checked[k]);
  const toggle = (k) => setChecked((s) => ({ ...s, [k]: !s[k] }));
  const toggleAll = () => { const v = !allOn; const next = {}; ITEMS.forEach((k) => { next[k] = v; }); setChecked(next); };

  const panel = { background: CARD, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '20px' };
  const sectionLabel = { fontSize: '12px', color: '#6a6a72', marginBottom: '14px', letterSpacing: '0.04em' };

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter','Pretendard',sans-serif" }}>
      <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Checkbox</div>
      <div style={{ fontSize: '13px', color: '#999', marginBottom: '20px' }}>Library 화면에서 쓰는 표준 체크박스입니다. 디자인 시스템 아이콘 <code style={{ color: '#bdbdc4' }}>check_on / check_off</code>(18px)와 라벨로 구성합니다.</div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', background: '#0f0f12', border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '32px' }}>
        {/* 상태 */}
        <div style={{ ...panel, flex: '1 1 260px' }}>
          <div style={sectionLabel}>상태 (States)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Chk on={false}>미선택 (Default)</Chk>
            <Chk on>선택됨 (Checked)</Chk>
            <Chk on={false} disabled>비활성 — 미선택</Chk>
            <Chk on disabled>비활성 — 선택</Chk>
          </div>
        </div>

        {/* 인터랙티브 — 전체 선택 트리 */}
        <div style={{ ...panel, flex: '1 1 260px' }}>
          <div style={sectionLabel}>전체 선택 + 하위 항목 (인터랙티브)</div>
          <Chk on={allOn} onClick={toggleAll}><span style={{ fontWeight: 600 }}>전체</span></Chk>
          <div style={{ height: '1px', background: '#232329', margin: '12px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '6px' }}>
            {ITEMS.map((k) => <Chk key={k} on={checked[k]} onClick={() => toggle(k)}>{k}</Chk>)}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', fontSize: '12px', color: '#6a6a72' }}>
        ※ 그리드/표 안의 일괄 선택 헤더에도 동일한 <code style={{ color: '#9a9aa2' }}>check_on/check_off</code>를 씁니다(권한 설정 매트릭스·이벤트 목록). 라벨 없는 단독 사용 시 16px, 라벨과 함께면 18px 권장.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   DatePickerPlayground — 달력(기간 선택) + 시간 입력 행 + 적용
   날짜·시간을 한 팝오버에서 함께 지정하는 Date+Time 결합 피커.
   ───────────────────────────────────────────────────────────────── */
function DatePickerPlayground({ activeSubTab }) {
  // 다크 팔레트 — Library 화면 계열에 맞춤
  const PRIMARY = T.primary;
  const PRIMARY_L = T.primaryStrong;
  const CARD = '#16161a';
  const BORDER = '#2a2a30';
  const DIVIDER = '#232329';
  const CTRL = '#141417';
  const CTRL_BORDER = '#2e2e35';
  const TEXT = '#e8e8ec';
  const MUTED = '#9a9aa2';
  const FAINT = '#5a5a62';
  const RANGE_BG = 'rgba(0, 102, 255,0.20)';
  const TODAY_BG = 'rgba(0, 102, 255,0.28)';

  // ── Anatomy: 라이트 카드 + 번호 콜아웃(1 Value · 2 Label · 3 Calendar icon · 4 Container) ──
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '720px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 */}
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '720px', height: '300px', margin: '0 auto 24px', overflow: 'hidden', boxSizing: 'border-box' }}>
          {/* 라벨 캡션 */}
          <div style={{ position: 'absolute', left: '242px', top: '110px', fontSize: '12px', fontWeight: 500, color: '#6b6b6b', zIndex: 3 }}>Label</div>
          {/* 트리거 입력 필드 — 중앙 */}
          <div style={{ position: 'absolute', left: '242px', top: '134px', width: '236px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', borderRadius: '8px', background: '#ffffff', border: '1px solid #d4d4d8', boxSizing: 'border-box', zIndex: 3 }}>
            <span style={{ fontSize: '15px', color: '#18181b', fontVariantNumeric: 'tabular-nums' }}>2026.09.22</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8a92" strokeWidth="1.8">
              <rect x="3" y="4.5" width="18" height="16" rx="2" /><line x1="3" y1="9" x2="21" y2="9" />
              <line x1="8" y1="2.5" x2="8" y2="6" /><line x1="16" y1="2.5" x2="16" y2="6" />
            </svg>
          </div>

          {/* 연결선 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
            {/* 1. Value -> 좌측 */}
            <line x1="200" y1="156" x2="242" y2="156" stroke="#999" strokeWidth="1.2" />
            {/* 2. Label -> 위 */}
            <line x1="257" y1="90" x2="257" y2="108" stroke="#999" strokeWidth="1.2" />
            <circle cx="257" cy="108" r="2.6" fill="#999" />
            {/* 3. Calendar icon -> 우측 */}
            <line x1="520" y1="156" x2="480" y2="156" stroke="#999" strokeWidth="1.2" />
            {/* 4. Container -> 아래 */}
            <line x1="360" y1="250" x2="360" y2="180" stroke="#999" strokeWidth="1.2" />
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '186px', top: '156px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '257px', top: '74px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '534px', top: '156px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>
          <div style={{ position: 'absolute', left: '360px', top: '250px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>4</div>

          {/* 간격 치수선 — 필드 좌우 패딩 SP[12](14→12) · Label↔Field SP[8] */}
          {showSpacing && (
            <>
              <PaddingFill x={243} y={135} w={234} h={42} t={0} l={14} r={14} b={0} />{/* border 1px 보정 */}
              <DimLine dir="h" x={242} y={166} sp={12} />{/* 좌우 패딩 */}
              <DimLine dir="v" x={242} y={126} sp={8} />{/* Label ↔ Field */}
            </>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Value' },
            { num: 2, label: 'Label' },
            { num: 3, label: 'Calendar icon' },
            { num: 4, label: 'Container' },
          ].map((item) => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>

        {/* 간격 스펙 표 */}
        {showSpacing && (
        <div style={{ maxWidth: '720px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (<div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>))}
            {[
              ['필드 좌우 패딩', 'SP[12]', '14', '값/아이콘 좌우 여백'],
              ['Label ↔ Field', 'SP[8]', '8', '캡션과 입력 간격'],
              ['필드 높이', '—', '44', '컨트롤 높이'],
              ['모서리 반경', 'radius', '8', 'border-radius'],
            ].map((r, i) => r.map((c, j) => (<div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>)))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ off-grid 패딩 14→SP[12] 정규화.</div>
        </div>
        )}
      </div>
    );
  }

  const [view, setView] = useState({ y: 2026, m: 8 }); // 2026년 9월 (m: 0-indexed)
  const [range, setRange] = useState({ start: 22, end: 29 }); // 같은 달 기준 일(day)
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [open, setOpen] = useState(true); // 트리거 클릭 → 팝오버 펼침
  const [withTime, setWithTime] = useState(true); // 시간 포함 / 날짜만

  const WD = ['월', '화', '수', '목', '금', '토', '일'];
  const monthLabel = `${view.y}년 ${view.m + 1}월`;

  // 월 그리드(월요일 시작, 6주 42칸)
  const buildGrid = (y, m) => {
    const first = new Date(y, m, 1);
    const startDow = (first.getDay() + 6) % 7; // 0=월
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const daysInPrev = new Date(y, m, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push({ day: daysInPrev - startDow + 1 + i, cur: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
    let n = 1;
    while (cells.length < 42) cells.push({ day: n++, cur: false });
    return cells;
  };
  const cells = buildGrid(view.y, view.m);

  const shiftMonth = (delta) => {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
    setRange({ start: null, end: null });
  };

  const pickDay = (day) => {
    setRange((r) => {
      if (r.start == null || r.end != null) return { start: day, end: null };
      if (day < r.start) return { start: day, end: null };
      return { start: r.start, end: day };
    });
  };

  const today = 9; // 시안 기준 '오늘' 표기 샘플 (2026년 9월 9일)
  const inRange = (day, cur) => cur && range.start != null && range.end != null && day > range.start && day < range.end;
  const isEnd = (day, cur) => cur && (day === range.start || day === range.end);

  const Clock = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6f6f77" strokeWidth="2">
      <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" />
    </svg>
  );
  // 24시간제 시·분 드롭다운 (네이티브 type=time의 오전/오후 잘림·중복 아이콘 회피)
  const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const MINS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const selStyle = { appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', border: 'none', outline: 'none', background: 'transparent', color: TEXT, fontSize: '14px', fontFamily: 'inherit', cursor: 'pointer', textAlign: 'center', padding: '0 2px', colorScheme: 'dark', fontVariantNumeric: 'tabular-nums' };
  const TimeField = ({ label, value, onChange }) => {
    const [h, m] = (value || '00:00').split(':');
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span style={{ fontSize: '13px', color: MUTED }}>{label}</span>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', height: '32px', padding: '0 10px', background: CTRL, border: `1px solid ${CTRL_BORDER}`, borderRadius: '6px' }}>
          <Clock />
          <select value={h} onChange={(e) => onChange(`${e.target.value}:${m}`)} style={selStyle}>
            {HOURS.map((hh) => <option key={hh} value={hh}>{hh}</option>)}
          </select>
          <span style={{ color: MUTED, fontSize: '14px' }}>:</span>
          <select value={m} onChange={(e) => onChange(`${h}:${e.target.value}`)} style={selStyle}>
            {MINS.map((mm) => <option key={mm} value={mm}>{mm}</option>)}
          </select>
        </div>
      </div>
    );
  };

  // 트리거(닫힘) 필드 — 이미지처럼 다크 라운드 입력. 클릭 시 팝오버 펼침.
  const Cal = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8a92" strokeWidth="1.8">
      <rect x="3" y="4.5" width="18" height="16" rx="2" /><line x1="3" y1="9" x2="21" y2="9" />
      <line x1="8" y1="2.5" x2="8" y2="6" /><line x1="16" y1="2.5" x2="16" y2="6" />
    </svg>
  );
  const Trigger = ({ label, placeholder, value, icon, onClick, active }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={{ fontSize: '12px', color: MUTED }}>{label}</span>
      <div
        onClick={onClick}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '260px', height: '42px', padding: '0 14px', boxSizing: 'border-box',
          background: CTRL, border: `1px solid ${active ? PRIMARY : CTRL_BORDER}`, borderRadius: '8px',
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        <span style={{ fontSize: '15px', color: value ? TEXT : '#6f6f77', fontVariantNumeric: 'tabular-nums' }}>
          {value || placeholder}
        </span>
        {icon === 'clock' ? <Clock /> : <Cal />}
      </div>
    </div>
  );

  const triggers = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Trigger label="날짜 (시간 없음)" placeholder="YYYY.MM.DD" value="2026.09.22"
        active={open && !withTime} onClick={() => { setWithTime(false); setOpen(true); }} />
      <Trigger label="연·월" placeholder="YYYY.MM" value="2026.09" />
      <Trigger label="날짜 + 시간" placeholder="YYYY.MM.DD HH:mm" value="2026.09.22 14:30"
        active={open && withTime} onClick={() => { setWithTime(true); setOpen(true); }} />
      <Trigger label="시간" placeholder="HH:mm" value="14:30" icon="clock" />
    </div>
  );

  const picker = (
    <div style={{ width: '300px', background: CARD, borderRadius: '12px', border: `1px solid ${BORDER}`, boxShadow: '0 16px 40px rgba(0,0,0,0.5)', overflow: 'hidden', fontFamily: "'Inter','Pretendard','맑은 고딕',sans-serif" }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 8px' }}>
        <button type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '15px', fontWeight: 700, color: '#fff' }}>
          {monthLabel}<span style={{ fontSize: '9px', color: '#7f7f87' }}>▾</span>
        </button>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['‹', '›'].map((c, i) => (
            <button key={c} type="button" onClick={() => shiftMonth(i === 0 ? -1 : 1)}
              style={{ width: '28px', height: '28px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '6px', color: '#c4c4cc', fontSize: '16px' }}>{c}</button>
          ))}
        </div>
      </div>
      {/* 요일 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '4px 10px' }}>
        {WD.map((w) => <div key={w} style={{ textAlign: 'center', fontSize: '12px', color: '#8a8a92', padding: '4px 0' }}>{w}</div>)}
      </div>
      {/* 날짜 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '0 10px 8px' }}>
        {cells.map((c, i) => {
          const end = isEnd(c.day, c.cur);
          const mid = inRange(c.day, c.cur);
          const isToday = c.cur && c.day === today && !end;
          return (
            <div key={i} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '38px', background: mid ? RANGE_BG : 'transparent' }}>
              <div
                onClick={() => c.cur && pickDay(c.day)}
                style={{
                  width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%', fontSize: '14px', cursor: c.cur ? 'pointer' : 'default',
                  background: end ? PRIMARY : isToday ? TODAY_BG : 'transparent',
                  color: end ? '#fff' : !c.cur ? FAINT : isToday ? PRIMARY_L : '#d4d4d8',
                  fontWeight: end || isToday ? 700 : 400,
                }}
              >{c.day}</div>
            </div>
          );
        })}
      </div>
      {/* 시간 입력 행 (시작·종료 세로 2줄) — 시간 없는 버전(withTime=false)에서는 숨김 */}
      {withTime && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px 16px', borderTop: `1px solid ${DIVIDER}` }}>
          <TimeField label="시작 시간" value={startTime} onChange={setStartTime} />
          <TimeField label="종료 시간" value={endTime} onChange={setEndTime} />
        </div>
      )}
      {/* 푸터 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: `1px solid ${DIVIDER}` }}>
        <button type="button" onClick={() => { const d = new Date(); setView({ y: d.getFullYear(), m: d.getMonth() }); setRange({ start: d.getDate(), end: null }); }}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#8a8a92' }}>오늘</button>
        <button type="button"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: PRIMARY_L }}>적용</button>
      </div>
    </div>
  );

  // 선택 요약
  const fmt = (day) => day == null ? '—' : `${view.y}-${String(view.m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const summary = withTime
    ? `${fmt(range.start)} ${startTime}  ~  ${fmt(range.end)} ${endTime}`
    : `${fmt(range.start)}  ~  ${fmt(range.end)}`;

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter','Pretendard',sans-serif" }}>
      <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Date + Time Picker</div>
      <div style={{ fontSize: '13px', color: '#999', marginBottom: '20px' }}>트리거 필드(닫힘)에서 형식을 보여주고, 클릭하면 달력+시간 팝오버(펼침)가 열립니다. 시간 표기는 24시간제 <code style={{ color: '#bdbdc4' }}>YYYY.MM.DD HH:mm</code>(초 필요 시 :ss).</div>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap', background: '#0f0f12', border: '1px solid #2a2a30', borderRadius: '12px', padding: '32px' }}>
        {/* 닫힘 — 트리거 필드 4종 */}
        <div>
          <div style={{ fontSize: '12px', color: '#6a6a72', marginBottom: '14px', letterSpacing: '0.04em' }}>닫힘 — 트리거 필드</div>
          {triggers}
        </div>
        {/* 펼침 — 팝오버 (시간 포함 / 날짜만) */}
        <div>
          <div style={{ fontSize: '12px', color: '#6a6a72', marginBottom: '14px', letterSpacing: '0.04em' }}>
            펼침 — {withTime ? '달력 + 시간 팝오버' : '달력 팝오버 (시간 없음)'}
          </div>
          {open ? picker : (
            <div style={{ width: '300px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #2e2e35', borderRadius: '12px', color: '#5a5a62', fontSize: '13px' }}>
              좌측 트리거를 클릭하세요
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px' }}>
          <span style={{ fontSize: '12px', color: '#888' }}>선택된 일시</span>
          <span style={{ fontSize: '14px', color: '#fff', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{summary}</span>
        </div>
      </div>
    </div>
  );
}

function TablePlayground({ activeSubTab }) {
  // ── Anatomy: 라이트 카드 + 번호 콜아웃(1 Header · 2 Cell · 3 Pagination · 4 Container) ──
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)
  if (activeSubTab === 'anatomy') {
    const thS = { padding: '8px 10px', textAlign: 'left', whiteSpace: 'nowrap' };
    const tdS = { padding: '8px 10px', color: '#18181b', borderTop: '1px solid #f0f0f2', whiteSpace: 'nowrap' };
    const ckS = { width: '12px', height: '12px', border: '1.5px solid #b8b8c0', borderRadius: '3px', boxSizing: 'border-box', display: 'inline-block' };
    const cols = '28px 1fr 64px';
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '720px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 */}
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '720px', height: '300px', margin: '0 auto 24px', overflow: 'hidden', boxSizing: 'border-box' }}>
          {/* 미니 테이블 — 중앙 */}
          <div style={{ position: 'absolute', left: '190px', top: '72px', width: '340px', background: '#fff', border: '1px solid #d9d9de', borderRadius: '8px', overflow: 'hidden', fontSize: '11px', zIndex: 3 }}>
            {/* 헤더 */}
            <div style={{ display: 'grid', gridTemplateColumns: cols, background: '#f0f0f2', borderBottom: '1px solid #e2e2e6', color: '#6b6b72', fontWeight: 600 }}>
              <div style={thS}><span style={ckS} /></div>
              <div style={thS}>Name</div>
              <div style={{ ...thS, textAlign: 'right' }}>Status</div>
            </div>
            {/* 행 */}
            {[['SH0019C001', 'Normal'], ['SH0019C003', 'Check']].map(([nm, st]) => (
              <div key={nm} style={{ display: 'grid', gridTemplateColumns: cols, alignItems: 'center' }}>
                <div style={tdS}><span style={ckS} /></div>
                <div style={tdS}>{nm}</div>
                <div style={{ ...tdS, textAlign: 'right', color: '#6b6b72' }}>{st}</div>
              </div>
            ))}
            {/* 푸터 — 페이지네이션 (Pagination 컴포넌트 반영: 박스형 셀, active=파란 채움) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', padding: '7px 10px', borderTop: '1px solid #eee' }}>
              {[
                { t: '‹' },
                { t: '1', active: true },
                { t: '2' },
                { t: '3' },
                { t: '›' },
              ].map((c, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '18px', height: '18px', borderRadius: '4px', boxSizing: 'border-box',
                  background: c.active ? '#0066FF' : 'transparent',
                  border: `1px solid ${c.active ? '#0066FF' : '#e2e2e6'}`,
                  color: c.active ? '#fff' : '#9a9aa2', fontWeight: c.active ? 700 : 400,
                }}>{c.t}</span>
              ))}
            </div>
          </div>

          {/* 연결선 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
            {/* 1. Header -> 위 */}
            <line x1="255" y1="46" x2="255" y2="73" stroke="#999" strokeWidth="1.2" />
            {/* 2. Cell -> 좌측 */}
            <line x1="168" y1="119" x2="190" y2="119" stroke="#999" strokeWidth="1.2" />
            {/* 3. Pagination -> 아래 */}
            <line x1="440" y1="232" x2="440" y2="198" stroke="#999" strokeWidth="1.2" />
            <circle cx="440" cy="198" r="2.6" fill="#999" />
            {/* 4. Container -> 우측 */}
            <line x1="554" y1="135" x2="530" y2="135" stroke="#999" strokeWidth="1.2" />
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '255px', top: '42px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '152px', top: '119px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '440px', top: '248px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>
          <div style={{ position: 'absolute', left: '572px', top: '135px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>4</div>

          {/* 간격 치수선 — 셀 패딩 좌우 SP[8](10→8) · 상하 SP[8] (미니 테이블) */}
          {showSpacing && (
            <>
              <DimLine dir="h" x={190} y={85} sp={8} />{/* 셀 좌우 패딩 */}
              <DimLine dir="v" x={230} y={72} sp={8} />{/* 셀 상하 패딩 */}
            </>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Header' },
            { num: 2, label: 'Cell' },
            { num: 3, label: 'Pagination' },
            { num: 4, label: 'Container' },
          ].map((item) => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>

        {/* 간격 스펙 표 */}
        {showSpacing && (
        <div style={{ maxWidth: '720px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (<div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>))}
            {[
              ['셀 좌우 패딩', 'SP[8]', '10', '헤더/셀 좌우 여백'],
              ['셀 상하 패딩', 'SP[8]', '8', '헤더/셀 상하 여백'],
              ['페이지네이션 간격', 'SP[8]', '6', '페이지 항목 간격'],
              ['테이블 반경', 'radius', '8', 'border-radius'],
            ].map((r, i) => r.map((c, j) => (<div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>)))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ off-grid 10→SP[8] · 페이지 6→SP[8] 정규화. 실동작 셀 패딩 14/16 → SP[12]/SP[16].</div>
        </div>
        )}
      </div>
    );
  }

  const [contentType, setContentType] = useState('Input'); // 'Normal' | 'Input'
  const [pagination, setPagination] = useState('Compact');  // 'None' | 'Extended' | 'Compact' | 'Minimize'
  const [page, setPage] = useState(1);
  const totalPages = 10;
  const rows = [1, 2, 3];
  const [checkedRows, setCheckedRows] = useState(() => new Set());
  const allChecked = checkedRows.size === rows.length;
  const toggleRow = (i) => setCheckedRows((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const toggleAll = () => setCheckedRows((s) => (s.size === rows.length ? new Set() : new Set(rows.map((_, i) => i))));

  const thStyle = { textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#8a8a8f' };
  const tdStyle = { textAlign: 'left', padding: '14px 16px', fontSize: '14px', color: '#ffffff' };

  const Checkbox = ({ checked, onClick }) => (
    <div
      onClick={onClick}
      style={{
        width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0, boxSizing: 'border-box', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: `1.5px solid ${checked ? '#0066FF' : '#4a4a4e'}`, background: checked ? '#0066FF' : 'transparent',
      }}
    >
      {checked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
    </div>
  );

  const Pager = () => {
    if (pagination === 'None') return null;

    // Pagination 컴포넌트(nav-pagination)와 동일한 박스형 셀 — active=파란 채움(#0066FF), 그 외 테두리 셀
    const cellBase = {
      minWidth: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: '6px', userSelect: 'none', boxSizing: 'border-box',
    };
    const arrow = (label, onClick, disabled) => (
      <span
        onClick={disabled ? undefined : onClick}
        style={{
          ...cellBase, fontSize: '15px',
          border: `1px solid ${disabled ? '#242428' : '#2e2e2e'}`,
          color: disabled ? '#3e3e42' : '#8a8a92', cursor: disabled ? 'default' : 'pointer',
        }}
      >{label}</span>
    );
    const pageChip = (n) => {
      const active = n === page;
      return (
        <span
          key={`p${n}`}
          onClick={() => setPage(n)}
          style={{
            ...cellBase, fontSize: '13px', cursor: 'pointer',
            fontWeight: active ? 700 : 500,
            color: active ? '#fff' : '#8a8a92',
            backgroundColor: active ? '#0066FF' : 'transparent',
            border: `1px solid ${active ? '#0066FF' : '#2e2e2e'}`,
          }}
        >{n}</span>
      );
    };
    const ellipsis = (key) => <span key={key} style={{ minWidth: '20px', textAlign: 'center', color: '#52525b', fontSize: '13px', userSelect: 'none' }}>…</span>;

    if (pagination === 'Minimize') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          {arrow('‹', () => setPage((p) => Math.max(1, p - 1)), page === 1)}
          <span style={{ fontSize: '13px', color: '#71717a' }}>
            <b style={{ color: '#fff', fontWeight: 700 }}>{page}</b> / {totalPages}
          </span>
          {arrow('›', () => setPage((p) => Math.min(totalPages, p + 1)), page === totalPages)}
        </div>
      );
    }

    let items;
    if (pagination === 'Extended') {
      items = Array.from({ length: totalPages }, (_, i) => pageChip(i + 1));
    } else { // Compact
      const seq = [];
      if (page <= 5) seq.push(1, 2, 3, 4, 5, '…', totalPages);
      else if (page >= totalPages - 3) seq.push(1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      else seq.push(1, '…', page - 1, page, page + 1, '…', totalPages);
      items = seq.map((s, i) => (s === '…' ? ellipsis(`e${i}`) : pageChip(s)));
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        {arrow('‹', () => setPage((p) => Math.max(1, p - 1)), page === 1)}
        {items}
        {arrow('›', () => setPage((p) => Math.min(totalPages, p + 1)), page === totalPages)}
      </div>
    );
  };

  const TablePreview = () => (
    <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#151517', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.24)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
            {contentType === 'Input' && <th style={{ width: '44px', padding: '12px 0 12px 16px' }}><Checkbox checked={allChecked} onClick={toggleAll} /></th>}
            <th style={thStyle}>Head</th>
            <th style={thStyle}>Head</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r} style={{ borderBottom: idx < rows.length - 1 ? '1px solid #232325' : 'none' }}>
              {contentType === 'Input' && (
                <td style={{ padding: '14px 0 14px 16px' }}><Checkbox checked={checkedRows.has(idx)} onClick={() => toggleRow(idx)} /></td>
              )}
              <td style={tdStyle}>Cell</td>
              <td style={tdStyle}>Cell</td>
            </tr>
          ))}
        </tbody>
      </table>
      {pagination !== 'None' && (
        <div style={{ borderTop: '1px solid #2a2a2a', padding: '12px' }}>
          <Pager />
        </div>
      )}
    </div>
  );

  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
        <TablePreview />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '24px' }}>Interactive Demo</div>

      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', minHeight: '360px' }}>
        {/* Left: Preview */}
        <div style={{ flex: 1.8, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box' }}>
          <TablePreview />
        </div>

        {/* Right: Controls */}
        <div
          className="ds-playground-controls"
          style={{ flex: 1, background: '#141414', borderLeft: '1px solid #2a2a2a', padding: '24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '420px', overflowY: 'auto' }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Content</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Normal', 'Input'].map((t) => (
                <PlaygroundRadioOption key={t} label={t} checked={contentType === t} onChange={() => setContentType(t)} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Pagination</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['None', 'Extended', 'Compact', 'Minimize'].map((t) => (
                <PlaygroundRadioOption key={t} label={t} checked={pagination === t} onChange={() => setPagination(t)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListCheckablePlayground() {
  // 사이트(지점) 리스트 — 행 클릭 시 체크 토글(채운 체크써클 ↔ 빈 원)
  const ITEMS = [{ name: '지점 B', count: 13 }, { name: '지점 C', count: 13 }];
  const [checked, setChecked] = useState(() => new Set([0])); // 지점 B 기본 체크
  const toggle = (i) => setChecked((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  return (
    <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#1a1a1a', width: '250px', padding: '16px', borderRadius: '8px' }}>
        {ITEMS.map((it, i) => {
          const on = checked.has(i);
          return (
            <div key={it.name} onClick={() => toggle(i)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', color: on ? '#0066FF' : '#fff', cursor: 'pointer', userSelect: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {on
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="#0066FF"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>}
                <span style={{ fontSize: '14px' }}>{it.name}</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{it.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ListCardPlayground({ activeSubTab }) {
  const [thumbnail, setThumbnail] = useState(true);
  const [leading, setLeading] = useState(true);
  const [heading, setHeading] = useState('차량 번호판 검지');
  const [caption, setCaption] = useState('2026.05.27 11:30:22');
  const [extraCaption, setExtraCaption] = useState('신뢰도: 98.5% • 속도: 62km/h');
  const [topContent, setTopContent] = useState(true);
  const [trailing, setTrailing] = useState(true);
  const [bottomContent, setBottomContent] = useState(true);
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)

  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '720px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 */}
        <div style={{
          position: 'relative',
          background: '#efefef',
          borderRadius: '16px',
          width: '720px',
          height: '380px',
          margin: '0 auto 24px',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* 리스트 카드 컴포넌트 — 중앙 */}
          <div style={{
            position: 'absolute',
            left: '140px',
            top: '100px',
            width: '440px',
            height: '180px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1.5px solid #e4e4e7',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            padding: SP[16],
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 3,
          }}>
            {/* Top Content (7) */}
            <div style={{
              width: '180px',
              height: '12px',
              background: showSpacing ? '#eae6ff' : 'transparent',
              borderRadius: '2px',
              alignSelf: 'flex-start',
              marginLeft: '120px' /* 썸네일 영역 뒤부터 시작 */
            }} />

            {/* Main Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              {/* Leading content (3) */}
              <div style={{
                width: '16px',
                height: '16px',
                background: showSpacing ? '#eae6ff' : 'transparent',
                borderRadius: '2px',
                flexShrink: 0
              }} />

              {/* Thumbnail (2) — 이미지 placeholder(점선) */}
              <div style={{
                width: '80px',
                height: '60px',
                background: '#f4f4f5',
                borderRadius: '6px',
                border: '1.5px dashed #a1a1aa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>

              {/* Texts */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {/* Heading (4) — 줄 중심 y≈170 */}
                <span style={{ fontSize: '14px', lineHeight: '20px', fontWeight: '700', color: '#18181b' }}>Heading</span>
                {/* Caption (5) — 줄 중심 y≈192 */}
                <span style={{ fontSize: '12px', lineHeight: '16px', color: '#71717a' }}>Caption</span>
                {/* Extra caption (6) — 줄 중심 y≈212 */}
                <span style={{ fontSize: '11px', lineHeight: '15px', color: '#a1a1aa' }}>Extra caption</span>
              </div>

              {/* Trailing content (8) */}
              <div style={{
                width: '16px',
                height: '16px',
                background: showSpacing ? '#eae6ff' : 'transparent',
                borderRadius: '2px',
                flexShrink: 0
              }} />
            </div>

            {/* Bottom Content (9) */}
            <div style={{
              width: '180px',
              height: '12px',
              background: showSpacing ? '#eae6ff' : 'transparent',
              borderRadius: '2px',
              alignSelf: 'flex-start',
              marginLeft: '120px'
            }} />
          </div>

          {/* SVG 직선 */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
          >
            {/* 1. Container */}
            <line x1="360" y1="330" x2="360" y2="280" stroke="#999" strokeWidth="1.2" />
            {/* 2. Thumbnail */}
            <line x1="224" y1="50" x2="224" y2="158" stroke="#999" strokeWidth="1.2" />
            {/* 3. Leading content — 간격 표시 시에만 */}
            {showSpacing && <line x1="100" y1="190" x2="160" y2="190" stroke="#999" strokeWidth="1.2" />}
            {/* 4. Heading (줄 중심 y≈170) */}
            <line x1="400" y1="168" x2="348" y2="170" stroke="#999" strokeWidth="1.2" />
            <circle cx="348" cy="170" r="1.5" fill="#999" />
            {/* 5. Caption (줄 중심 y≈192) */}
            <line x1="400" y1="192" x2="334" y2="192" stroke="#999" strokeWidth="1.2" />
            <circle cx="334" cy="192" r="1.5" fill="#999" />
            {/* 6. Extra caption (줄 중심 y≈212) */}
            <line x1="400" y1="216" x2="366" y2="212" stroke="#999" strokeWidth="1.2" />
            <circle cx="366" cy="212" r="1.5" fill="#999" />
            {/* 7·8·9. Top/Trailing/Bottom content — 간격 표시 시에만 */}
            {showSpacing && <line x1="380" y1="50" x2="380" y2="116" stroke="#999" strokeWidth="1.2" />}
            {showSpacing && <line x1="620" y1="190" x2="560" y2="190" stroke="#999" strokeWidth="1.2" />}
            {showSpacing && <line x1="440" y1="330" x2="440" y2="264" stroke="#999" strokeWidth="1.2" />}
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '360px', top: '330px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '224px', top: '50px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          {showSpacing && <div style={{ position: 'absolute', left: '100px', top: '190px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>}
          <div style={{ position: 'absolute', left: '410px', top: '168px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyleSm }}>4</div>
          <div style={{ position: 'absolute', left: '410px', top: '192px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyleSm }}>5</div>
          <div style={{ position: 'absolute', left: '410px', top: '216px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyleSm }}>6</div>
          {showSpacing && <div style={{ position: 'absolute', left: '380px', top: '50px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>7</div>}
          {showSpacing && <div style={{ position: 'absolute', left: '620px', top: '190px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>8</div>}
          {showSpacing && <div style={{ position: 'absolute', left: '440px', top: '330px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>9</div>}

          {/* 간격 치수선 — 토글 시 표시(SP 토큰 라벨, 카드 좌표 기준) */}
          {showSpacing && (
            <>
              <PaddingFill x={140} y={100} w={440} h={180} t={16} l={16} r={16} b={16} />
              <DimLine dir="h" x={141} y={190} sp={16} />{/* 좌측 내부 여백 */}
              <DimLine dir="v" x={277} y={100} sp={16} />{/* 상단 내부 여백 */}
              <DimLine dir="h" x={173} y={222} sp={16} />{/* leading↔썸네일 */}
              <DimLine dir="h" x={269} y={222} sp={16} />{/* 썸네일↔텍스트 */}
              <DimLine dir="v" x={348} y={180} sp={4} />{/* 텍스트 줄 간격(Heading↔Caption, 텍스트 우측 여백에 배치) */}
              <DimLine dir="v" x={252} y={128} length={32} label="space-between" />{/* 상단 콘텐츠↔본문 세로 간격(자동 분배) */}
              <DimLine dir="v" x={252} y={220} length={32} label="space-between" />{/* 본문↔하단 콘텐츠 세로 간격(자동 분배) */}
            </>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Container' },
            { num: 2, label: 'Thumbnail' },
            { num: 3, label: 'Leading content' },
            { num: 4, label: 'Heading' },
            { num: 5, label: 'Caption' },
            { num: 6, label: 'Extra caption' },
            { num: 7, label: 'Top content' },
            { num: 8, label: 'Trailing content' },
            { num: 9, label: 'Bottom content' },
          ].filter(item => showSpacing || ![3, 7, 8, 9].includes(item.num)).map(item => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>

        {/* 간격 스펙 표 — SP 토큰 기준(리빙 스펙). 토큰 열 보라 강조, off-grid 값은 권장 토큰 병기 */}
        {showSpacing && (
        <div style={{ maxWidth: '720px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (
              <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>
            ))}
            {[
              ['카드 내부 여백', 'SP[16]', '16', 'Container padding'],
              ['요소 간격', 'SP[16]', '16', 'leading·썸네일·텍스트 사이'],
              ['텍스트 줄 간격', 'SP[4]', '4', 'Heading·Caption·Extra caption'],
              ['상·하 콘텐츠 여백', 'space-between', '—', 'Top/Bottom content 분배'],
            ].map((r, i) => r.map((c, j) => (
              <div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>
            )))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 간격 SP 스케일(4/8pt)로 정규화(카드 여백 SP[16]). 상·하 콘텐츠(보라 바)의 세로 간격은 <b style={{ color: '#c4b5fd' }}>space-between</b>(자동 분배)이라 고정 토큰 없음 — 치수선에 "space-between"으로 표기.</div>
        </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '24px' }}>Interactive Demo</div>

      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '400px' }}>
        {/* Left: Preview Panel (flex: 1.8) */}
        <div style={{ flex: 1.8, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative' }}>
          
          {/* Card container */}
          <div style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: '#111',
            border: '1px solid #222',
            borderRadius: '8px',
            padding: '16px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.24)'
          }}>
            {/* Top content */}
            {topContent && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                alignSelf: 'flex-start',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(235, 94, 40, 0.15)',
                border: '1px solid rgba(235, 94, 40, 0.3)',
                color: '#eb5e28',
                fontSize: '11px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                속도 위반 의심
              </div>
            )}

            {/* Main Row — 썸네일 top이 제목 top과 맞도록 상단 정렬(멀티라인 텍스트 대비) */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', width: '100%' }}>
              {/* Leading content */}
              {leading && (
                <div style={{ color: '#eb5e28', display: 'flex', alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
              )}

              {/* Thumbnail */}
              {thumbnail && (
                <div style={{
                  width: '80px',
                  height: '60px',
                  background: '#222',
                  borderRadius: '6px',
                  border: '1.5px dashed #3a3a42',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}

              {/* Texts */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{heading}</span>
                {caption && <span style={{ fontSize: '12px', color: '#888888' }}>{caption}</span>}
                {extraCaption && <span style={{ fontSize: '11px', color: '#aaaaaa' }}>{extraCaption}</span>}
              </div>

              {/* Trailing content */}
              {trailing && (
                <button style={{
                  alignSelf: 'center',
                  background: '#222',
                  border: '1px solid #333',
                  color: '#fff',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  cursor: 'default'
                }}>
                  상세
                </button>
              )}
            </div>

            {/* Bottom content */}
            {bottomContent && (
              <div style={{
                marginTop: '10px',
                borderTop: '1px solid #222',
                paddingTop: '8px',
                fontSize: '11px',
                color: '#888',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>카메라 ID: CAM-042</span>
                <span>수집엔진 v2.1</span>
              </div>
            )}
          </div>

        </div>

        {/* Right: Control Panel */}
        <div 
          className="ds-playground-controls"
          style={{
            width: '240px',
            background: '#141414',
            borderLeft: '1px solid #2a2a2a',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxSizing: 'border-box',
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          {/* Thumbnail */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Thumbnail</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="Show" checked={thumbnail} onChange={() => setThumbnail(true)} />
              <PlaygroundRadioOption label="Hide" checked={!thumbnail} onChange={() => setThumbnail(false)} />
            </div>
          </div>

          {/* Leading */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Leading</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="Show" checked={leading} onChange={() => setLeading(true)} />
              <PlaygroundRadioOption label="Hide" checked={!leading} onChange={() => setLeading(false)} />
            </div>
          </div>

          {/* Top Content */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Top Content</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="Show" checked={topContent} onChange={() => setTopContent(true)} />
              <PlaygroundRadioOption label="Hide" checked={!topContent} onChange={() => setTopContent(false)} />
            </div>
          </div>

          {/* Trailing */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Trailing</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="Show" checked={trailing} onChange={() => setTrailing(true)} />
              <PlaygroundRadioOption label="Hide" checked={!trailing} onChange={() => setTrailing(false)} />
            </div>
          </div>

          {/* Bottom Content */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Bottom Content</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="Show" checked={bottomContent} onChange={() => setBottomContent(true)} />
              <PlaygroundRadioOption label="Hide" checked={!bottomContent} onChange={() => setBottomContent(false)} />
            </div>
          </div>

          {/* Text Inputs */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '8px' }}>Heading Text</div>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                backgroundColor: '#222',
                border: '1px solid #333',
                color: '#fff',
                fontSize: '12px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '8px' }}>Caption Text</div>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                backgroundColor: '#222',
                border: '1px solid #333',
                color: '#fff',
                fontSize: '12px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '8px' }}>Extra Caption Text</div>
            <input
              type="text"
              value={extraCaption}
              onChange={(e) => setExtraCaption(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                backgroundColor: '#222',
                border: '1px solid #333',
                color: '#fff',
                fontSize: '12px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


function CardPlayground({ activeSubTab }) {
  const [cardType, setCardType] = useState('banner');
  const [bannerState, setBannerState] = useState('warning');
  const [bannerTitle, setBannerTitle] = useState('시간 % 증가 피크 타임입니다.');
  const [bannerBadge, setBannerBadge] = useState('집중 요일');
  
  const [filterUnit, setFilterUnit] = useState('day');
  const [filterPeriod, setFilterPeriod] = useState('7d');
  const [filterMetric, setFilterMetric] = useState('usage');

  const [showUnit, setShowUnit] = useState(true);
  const [showPeriod, setShowPeriod] = useState(true);
  const [showMetric, setShowMetric] = useState(true);
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)

  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '720px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        <div style={{
          position: 'relative',
          background: '#efefef',
          borderRadius: '16px',
          width: '720px',
          height: '340px',
          margin: '0 auto 24px',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          <div style={{
            position: 'absolute',
            left: '160px',
            top: '80px',
            width: '400px',
            height: '180px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1.5px solid #e4e4e7',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            padding: SP[16],
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 3,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#18181b' }}>Card Header</span>
              <div style={{
                padding: `${SP[4]} ${SP[8]}`,
                borderRadius: '4px',
                border: '1px solid #1ED45A',
                color: '#1ED45A',
                fontSize: '11px',
                fontWeight: 'bold',
                backgroundColor: 'rgba(30, 212, 90, 0.05)'
              }}>Action</div>
            </div>
            <div style={{
              flex: 1,
              marginTop: SP[8],
              background: '#f4f4f5',
              border: '1px dashed #d4d4d8',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#71717a',
              fontSize: '12px'
            }}>
              Card Body Content (지표, 그래프 등)
            </div>
          </div>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
            <line x1="100" y1="80" x2="154" y2="80" stroke="#999" strokeWidth="1.2" />
            <line x1="240" y1="30" x2="240" y2="94" stroke="#999" strokeWidth="1.2" />
            <line x1="620" y1="100" x2="536" y2="100" stroke="#999" strokeWidth="1.2" />
            <line x1="360" y1="290" x2="360" y2="218" stroke="#999" strokeWidth="1.2" />
            <line x1="620" y1="140" x2="540" y2="140" stroke="#999" strokeWidth="1.2" />
          </svg>
          <div style={{ position: 'absolute', left: '100px', top: '80px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '240px', top: '30px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '620px', top: '100px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>
          <div style={{ position: 'absolute', left: '360px', top: '290px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>4</div>
          <div style={{ position: 'absolute', left: '620px', top: '140px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>5</div>

          {/* 간격 치수선 — 토글 시 표시(SP 토큰). 카드 padding SP[16], 섹션 간격 SP[8] */}
          {showSpacing && (
            <>
              <PaddingFill x={161} y={81} w={398} h={178} t={16} l={16} r={16} b={16} />
              <DimLine dir="h" x={161} y={110} sp={16} />{/* 좌측 내부 여백 */}
              <DimLine dir="v" x={205} y={81} sp={16} />{/* 상단 내부 여백 */}
              <DimLine dir="v" x={190} y={119} sp={8} />{/* 헤더↔바디 섹션 간격(바디 상단 좌측에 연결) */}
            </>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Container (외곽 컨테이너)' },
            { num: 2, label: 'Card Header (제목/구분 영역)' },
            { num: 3, label: 'Header Action (헤더 우측 액션)' },
            { num: 4, label: 'Card Body (콘텐츠 영역)' },
            { num: 5, label: 'Spacing (내부 여백)' }
          ].map(item => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>

        {/* 간격 스펙 표 — 카드 내부 간격(SP 토큰). 정규화 완료 */}
        {showSpacing && (
        <div style={{ maxWidth: '720px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (
              <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>
            ))}
            {[
              ['카드 내부 여백', 'SP[16]', '16', 'Container padding'],
              ['섹션 간격(헤더·바디)', 'SP[8]', '8', '헤더↔바디'],
              ['헤더 액션 배지 패딩', 'SP[4] × SP[8]', '4·8', 'Content badge 규격'],
              ['모서리 반경', 'radius', '12', 'Card border-radius'],
            ].map((r, i) => r.map((c, j) => (
              <div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>
            )))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 간격 SP 스케일(4/8pt)로 정규화 완료(카드 여백 SP[16], 섹션 간격 SP[8], 액션 배지 SP[4]×SP[8]).</div>
        </div>
        )}
      </div>
    );
  }

  const getBannerDetails = () => {
    switch (bannerState) {
      case 'danger':
        return {
          borderColor: '#FF6363',
          color: '#FF6363',
          defaultTitle: '보행자 사고 발생 위험 시간대입니다.',
          defaultBadge: '사고 분석',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          )
        };
      case 'success':
        return {
          borderColor: '#1ED45A',
          color: '#1ED45A',
          defaultTitle: '보행자 통행 안전성이 향상되었습니다.',
          defaultBadge: '개선 완료',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          )
        };
      case 'info':
        return {
          borderColor: '#3385FF',
          color: '#3385FF',
          defaultTitle: '신규 보행신호 연장 알고리즘이 적용되었습니다.',
          defaultBadge: '안내 정보',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          )
        };
      case 'warning':
      default:
        return {
          borderColor: '#FFA938',
          color: '#FFA938',
          defaultTitle: '시간 % 증가 피크 타임입니다.',
          defaultBadge: '집중 요일',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
          )
        };
    }
  };

  const bannerDetails = getBannerDetails();

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '540px' }}>
        {/* Left Panel */}
        <div style={{ flex: 1.8, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box' }}>
          {cardType === 'banner' ? (
            <div style={{
              width: '100%',
              maxWidth: '540px',
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderLeft: `4px solid ${bannerDetails.borderColor}`,
              borderRadius: '4px',
              padding: '16px 20px',
              transition: 'all 0.3s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
                <span style={{ color: bannerDetails.borderColor, display: 'flex', alignItems: 'center' }}>
                  {bannerDetails.icon}
                </span>
                <span>{bannerTitle || bannerDetails.defaultTitle}</span>
                <span style={{ color: '#777', fontSize: '11px', fontWeight: 'normal', marginLeft: '8px' }}>
                  {bannerBadge || bannerDetails.defaultBadge}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: '#888', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ color: '#666', marginRight: '8px' }}>비교 기준</span>
                  <span style={{ color: '#aaa' }}>직전 4주 같은 요일 평균</span>
                </div>
                <div style={{ color: '#666' }}>
                  변화율 계산: (현재-비교 기준) / 비교 기준 x 100
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              width: '100%',
              maxWidth: '680px',
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
              padding: '24px 20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>보행신호 연장 통계</span>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  backgroundColor: 'transparent', border: '1px solid #1ED45A', borderRadius: '4px',
                  padding: '6px 12px', color: '#1ED45A', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer'
                }}>
                  EXCEL
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </button>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '24px',
                flexWrap: 'wrap',
                background: '#131314',
                border: '1px solid #2c2c2e',
                borderRadius: '6px',
                padding: '12px 16px',
                color: '#bbb',
                fontSize: '13px'
              }}>
                {!showUnit && !showPeriod && !showMetric && (
                  <div style={{ color: '#666', textAlign: 'center', width: '100%', padding: '8px' }}>노출할 필터를 선택해주세요.</div>
                )}

                {showUnit && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#888', fontWeight: 600, flexShrink: 0 }}>단위</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['day', 'week', 'month'].map(unit => {
                        const label = unit === 'day' ? '일별' : unit === 'week' ? '주별' : '월별';
                        const isActive = filterUnit === unit;
                        return (
                          <span
                            key={unit}
                            onClick={() => setFilterUnit(unit)}
                            style={{
                              padding: '6px 12px',
                              background: '#252528',
                              color: isActive ? '#00A3FF' : '#8e8e93',
                              borderRadius: '4px',
                              fontWeight: isActive ? 'bold' : 'normal',
                              fontSize: '12px',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              userSelect: 'none'
                            }}
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {showPeriod && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#888', fontWeight: 600, flexShrink: 0 }}>기간</span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {['7d', '14d', '30d'].map(p => {
                        const label = p === '7d' ? '7일' : p === '14d' ? '14일' : '30일';
                        const isActive = filterPeriod === p;
                        return (
                          <span
                            key={p}
                            onClick={() => setFilterPeriod(p)}
                            style={{
                              padding: '6px 12px',
                              background: '#252528',
                              color: isActive ? '#00A3FF' : '#8e8e93',
                              borderRadius: '4px',
                              fontWeight: isActive ? 'bold' : 'normal',
                              fontSize: '12px',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              userSelect: 'none'
                            }}
                          >
                            {label}
                          </span>
                        );
                      })}
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#252528',
                        border: '1px solid #3a3a3c',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#00A3FF',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        03.25 - 04.25
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {showMetric && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#888', fontWeight: 600, flexShrink: 0 }}>지표</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['usage', 'avgTime', 'count'].map(m => {
                        const label = m === 'usage' ? '활용도' : m === 'avgTime' ? '평균시간' : '건수';
                        const isActive = filterMetric === m;
                        return (
                          <span
                            key={m}
                            onClick={() => setFilterMetric(m)}
                            style={{
                              padding: '6px 12px',
                              background: '#252528',
                              color: isActive ? '#00A3FF' : '#8e8e93',
                              borderRadius: '4px',
                              fontWeight: isActive ? 'bold' : 'normal',
                              fontSize: '12px',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              userSelect: 'none'
                            }}
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div 
          className="ds-playground-controls"
          style={{
            flex: 1,
            background: '#141414',
            borderLeft: '1px solid #2a2a2a',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            maxHeight: '540px',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Card Type</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption 
                label="Banner Card (알림 배너)" 
                checked={cardType === 'banner'} 
                onChange={() => setCardType('banner')} 
              />
              <PlaygroundRadioOption 
                label="Filter Card (지표 필터)" 
                checked={cardType === 'filter'} 
                onChange={() => setCardType('filter')} 
              />
            </div>
          </div>

          {cardType === 'banner' ? (
            <>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Banner State</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <PlaygroundRadioOption 
                    label="Warning (주의 - 주황)" 
                    checked={bannerState === 'warning'} 
                    onChange={() => {
                      setBannerState('warning');
                      setBannerTitle('시간 % 증가 피크 타임입니다.');
                      setBannerBadge('집중 요일');
                    }} 
                  />
                  <PlaygroundRadioOption 
                    label="Danger (경고 - 빨강)" 
                    checked={bannerState === 'danger'} 
                    onChange={() => {
                      setBannerState('danger');
                      setBannerTitle('보행자 사고 발생 위험 시간대입니다.');
                      setBannerBadge('사고 분석');
                    }} 
                  />
                  <PlaygroundRadioOption 
                    label="Success (정상 - 초록)" 
                    checked={bannerState === 'success'} 
                    onChange={() => {
                      setBannerState('success');
                      setBannerTitle('보행자 통행 안전성이 향상되었습니다.');
                      setBannerBadge('개선 완료');
                    }} 
                  />
                  <PlaygroundRadioOption 
                    label="Info (정보 - 파랑)" 
                    checked={bannerState === 'info'} 
                    onChange={() => {
                      setBannerState('info');
                      setBannerTitle('신규 보행신호 연장 알고리즘이 적용되었습니다.');
                      setBannerBadge('안내 정보');
                    }} 
                  />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '8px' }}>Title text</div>
                <input 
                  type="text" 
                  value={bannerTitle} 
                  onChange={(e) => setBannerTitle(e.target.value)} 
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', backgroundColor: '#222', border: '1px solid #333', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }} 
                />
              </div>

              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '8px' }}>Badge text</div>
                <input 
                  type="text" 
                  value={bannerBadge} 
                  onChange={(e) => setBannerBadge(e.target.value)} 
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', backgroundColor: '#222', border: '1px solid #333', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }} 
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>필터 노출 설정</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <PlaygroundRadioOption 
                    label="단위 (Unit) 표시" 
                    checked={showUnit} 
                    onChange={() => setShowUnit(!showUnit)} 
                  />
                  <PlaygroundRadioOption 
                    label="기간 (Period) 표시" 
                    checked={showPeriod} 
                    onChange={() => setShowPeriod(!showPeriod)} 
                  />
                  <PlaygroundRadioOption 
                    label="지표 (Metric) 표시" 
                    checked={showMetric} 
                    onChange={() => setShowMetric(!showMetric)} 
                  />
                </div>
              </div>

              {showUnit && (
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>단위 설정 (Unit)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <PlaygroundRadioOption 
                      label="일별 (Day)" 
                      checked={filterUnit === 'day'} 
                      onChange={() => setFilterUnit('day')} 
                    />
                    <PlaygroundRadioOption 
                      label="주별 (Week)" 
                      checked={filterUnit === 'week'} 
                      onChange={() => setFilterUnit('week')} 
                    />
                    <PlaygroundRadioOption 
                      label="월별 (Month)" 
                      checked={filterUnit === 'month'} 
                      onChange={() => setFilterUnit('month')} 
                    />
                  </div>
                </div>
              )}

              {showPeriod && (
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>기간 설정 (Period)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <PlaygroundRadioOption 
                      label="7일 (7 Days)" 
                      checked={filterPeriod === '7d'} 
                      onChange={() => setFilterPeriod('7d')} 
                    />
                    <PlaygroundRadioOption 
                      label="14일 (14 Days)" 
                      checked={filterPeriod === '14d'} 
                      onChange={() => setFilterPeriod('14d')} 
                    />
                    <PlaygroundRadioOption 
                      label="30일 (30 Days)" 
                      checked={filterPeriod === '30d'} 
                      onChange={() => setFilterPeriod('30d')} 
                    />
                  </div>
                </div>
              )}

              {showMetric && (
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>지표 설정 (Metric)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <PlaygroundRadioOption 
                      label="활용도 (Usage)" 
                      checked={filterMetric === 'usage'} 
                      onChange={() => setFilterMetric('usage')} 
                    />
                    <PlaygroundRadioOption 
                      label="평균시간 (Avg Time)" 
                      checked={filterMetric === 'avgTime'} 
                      onChange={() => setFilterMetric('avgTime')} 
                    />
                    <PlaygroundRadioOption 
                      label="건수 (Count)" 
                      checked={filterMetric === 'count'} 
                      onChange={() => setFilterMetric('count')} 
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}


function ActionAreaPlayground({ activeSubTab }) {
  const [mainText, setMainText] = useState('Main action');
  const [altText, setAltText] = useState('Alternative');
  const [subText, setSubText] = useState('Sub action');
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '720px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 */}
        <div style={{
          position: 'relative',
          background: '#efefef',
          borderRadius: '16px',
          width: '720px',
          height: '340px',
          margin: '0 auto 24px',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* 중앙 가상 디바이스/바텀시트 하단 영역 */}
          <div style={{
            position: 'absolute',
            left: '210px',
            top: '30px',
            width: '300px',
            height: '280px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            padding: '24px 20px 16px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            zIndex: 3,
          }}>
            {/* 1. Main Action Button (Black theme applied as per user preference) */}
            <div style={{
              width: '100%',
              height: '40px',
              backgroundColor: '#18181b',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              userSelect: 'none',
              cursor: 'default'
            }}>
              Main action
            </div>

            {/* 2. Alternative Button (Outline theme, text color black) */}
            <div style={{
              width: '100%',
              height: '40px',
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              color: '#18181b',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              userSelect: 'none',
              cursor: 'default'
            }}>
              Alternative
            </div>

            {/* 3. Sub Action (Link style) */}
            <div style={{
              color: '#71717a',
              fontSize: '13px',
              fontWeight: '500',
              padding: '6px 12px',
              userSelect: 'none',
              cursor: 'default'
            }}>
              Sub action
            </div>
          </div>

          {/* SVG 직선 */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
          >
            {/* 1. Main action -> 수평선 좌측으로 */}
            <line x1="130" y1="190" x2="228" y2="190" stroke="#999" strokeWidth="1.2" />
            {/* 2. Alternative -> 수평선 우측으로 */}
            <line x1="590" y1="240" x2="492" y2="240" stroke="#999" strokeWidth="1.2" />
            {/* 3. Sub action -> 수직선 아래로 */}
            <line x1="360" y1="310" x2="360" y2="276" stroke="#999" strokeWidth="1.2" />
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '130px', top: '190px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '590px', top: '240px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '360px', top: '310px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>

          {/* 간격 치수선 — 컨테이너 패딩(상 SP[24] · 좌우 SP[16] · 하 SP[16]) + 버튼 간격 SP[12] */}
          {showSpacing && (
            <>
              <PaddingFill x={210} y={30} w={300} h={280} t={24} l={20} r={20} b={16} />
              <DimLine dir="v" x={460} y={30} sp={24} />{/* 상단 패딩 */}
              <DimLine dir="h" x={210} y={237} sp={16} />{/* 좌우 패딩 */}
              <DimLine dir="v" x={230} y={205} sp={12} />{/* 버튼 간격 */}
            </>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Main action' },
            { num: 2, label: 'Alternative' },
            { num: 3, label: 'Sub action' }
          ].map(item => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>

        {/* 간격 스펙 표 */}
        {showSpacing && (
        <div style={{ maxWidth: '720px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (<div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>))}
            {[
              ['상단 패딩', 'SP[24]', '24', '컨테이너 상단 여백'],
              ['좌우 패딩', 'SP[16]', '20', '컨테이너 좌우 여백'],
              ['하단 패딩', 'SP[16]', '16', '컨테이너 하단 여백'],
              ['버튼 간격', 'SP[12]', '12', '액션 버튼 사이 간격'],
              ['버튼 높이', '—', '40', '액션 버튼 높이'],
              ['모서리 반경', 'radius', '8', '버튼 border-radius'],
            ].map((r, i) => r.map((c, j) => (<div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>)))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ off-grid 좌우 20→SP[16] 정규화. Sub action 패딩 6/12 = SP[8]/SP[12].</div>
        </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '380px' }}>
        {/* Left Side: Preview */}
        <div style={{ flex: 1.8, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative' }}>
          {/* Floating Toast Notification */}
          {toastMessage && (
            <div 
              onClick={() => setToastMessage(null)}
              style={{
                position: 'absolute',
                top: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: toastType === 'success' ? '#10B981' : toastType === 'warning' ? '#FFA938' : '#2C2C2E',
                border: `1px solid ${toastType === 'success' ? '#10B981' : toastType === 'warning' ? '#FFA938' : '#3A3A3C'}`,
                borderRadius: '8px',
                padding: '10px 16px',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                zIndex: 10,
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                cursor: 'pointer',
                animation: 'fadeSlideIn 0.3s ease-out'
              }}
            >
              {/* Leading status icon */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {toastType === 'success' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : toastType === 'warning' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, lineHeight: 1.4 }}>{toastMessage}</span>
            </div>
          )}

          <div style={{
            width: '320px',
            backgroundColor: '#1a1a1a',
            padding: '24px 20px 16px 20px',
            borderRadius: '12px',
            border: '1px solid #2a2a2a',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <button style={{
              width: '100%',
              height: '40px',
              backgroundColor: '#18181b',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '12px',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = 0.8}
            onMouseOut={(e) => e.currentTarget.style.opacity = 1}
            onClick={() => {
              setToastType('success');
              setToastMessage(`${mainText}가 전송되었습니다!`);
            }}
            >
              {mainText}
            </button>
            
            <button style={{
              width: '100%',
              height: '40px',
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              color: '#18181b',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '12px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f4f4f5'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
            onClick={() => {
              setToastType('neutral');
              setToastMessage(`${altText} 작업이 선택되었습니다.`);
            }}
            >
              {altText}
            </button>

            <button style={{
              width: '100%',
              height: '32px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#888888',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '8px',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseOut={(e) => e.currentTarget.style.color = '#888888'}
            onClick={() => {
              setToastType('warning');
              setToastMessage(`${subText} 처리가 수행되었습니다.`);
            }}
            >
              {subText}
            </button>
          </div>
        </div>

        {/* Right Side: Control panel */}
        <div 
          className="ds-playground-controls"
          style={{
            width: '240px',
            background: '#141414',
            borderLeft: '1px solid #2a2a2a',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxSizing: 'border-box',
            maxHeight: '380px',
            overflowY: 'auto'
          }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '8px' }}>Main Action Text</div>
            <input
              type="text"
              value={mainText}
              onChange={(e) => setMainText(e.target.value)}
              style={{
                padding: '7px 10px',
                borderRadius: '6px',
                backgroundColor: '#222',
                color: '#fff',
                border: '1px solid #333',
                fontSize: '12px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '8px' }}>Alternative Text</div>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              style={{
                padding: '7px 10px',
                borderRadius: '6px',
                backgroundColor: '#222',
                color: '#fff',
                border: '1px solid #333',
                fontSize: '12px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '8px' }}>Sub Action Text</div>
            <input
              type="text"
              value={subText}
              onChange={(e) => setSubText(e.target.value)}
              style={{
                padding: '7px 10px',
                borderRadius: '6px',
                backgroundColor: '#222',
                color: '#fff',
                border: '1px solid #333',
                fontSize: '12px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToastPlayground({ activeSubTab }) {
  const [toastType, setToastType] = useState('neutral');
  const [message, setMessage] = useState('장비 정상 가동 중: 정상 연결 상태가 복구되었습니다.');
  const [showIcon, setShowIcon] = useState(true);
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)

  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '760px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 — Section message anatomy와 동일 시각 언어 */}
        <div style={{ position: 'relative', background: '#f4f4f5', borderRadius: '16px', width: '760px', height: '320px', margin: '0 auto 24px', boxSizing: 'border-box' }}>
          {/* 1. 컨테이너 — 토스트 pill(흰 패널), center x=380 · center y=160 */}
          <div style={{ position: 'absolute', left: '240px', top: '134px', width: '280px', height: '52px', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '12px', zIndex: 2 }} />
          {/* 2. 좌측 아이콘 — 점선 placeholder (좌측 패딩 SP[16]) */}
          <div style={{ position: 'absolute', left: '256px', top: '151px', width: '18px', height: '18px', border: '1.5px dashed #a1a1aa', borderRadius: '4px', zIndex: 3 }} />
          {/* 3. 메시지 — 스켈레톤 바 (아이콘↔메시지 SP[8]) */}
          <div style={{ position: 'absolute', left: '282px', top: '155px', width: '148px', height: '10px', background: '#d4d4d8', borderRadius: '4px', zIndex: 3 }} />

          {/* SVG 연결선 — 요소 경계까지 정확히 그음 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4 }}>
            {/* 1. 컨테이너 상단 경계(y=134) x=380 */}
            <line x1="380" y1="114" x2="380" y2="134" stroke="#999" strokeWidth="1.2" /><circle cx="380" cy="134" r="1.6" fill="#999" />
            {/* 2. 좌측 아이콘 좌측 경계(x=256) y=160 */}
            <line x1="214" y1="160" x2="256" y2="160" stroke="#999" strokeWidth="1.2" /><circle cx="256" cy="160" r="1.6" fill="#999" />
            {/* 3. 메시지 우측 경계(x=430) y=160 */}
            <line x1="546" y1="160" x2="430" y2="160" stroke="#999" strokeWidth="1.2" /><circle cx="430" cy="160" r="1.6" fill="#999" />
          </svg>
          {/* Callouts — 흰 원 + 검정 텍스트 */}
          <div style={{ position: 'absolute', left: '380px', top: '98px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>1</div>
          <div style={{ position: 'absolute', left: '200px', top: '160px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>2</div>
          <div style={{ position: 'absolute', left: '560px', top: '160px', transform: 'translate(-50%, -50%)', zIndex: 5, ...calloutStyle, backgroundColor: '#fff', color: '#111' }}>3</div>

          {/* 간격 치수선 — 토글 시 표시(SP 토큰). 실제 토스트 스펙(가로 SP[16]·아이콘↔메시지 SP[8]) */}
          {showSpacing && (
            <>
              <PaddingFill x={241} y={135} w={278} h={50} t={8} l={16} r={16} b={8} />
              <DimLine dir="h" x={240} y={160} sp={16} />{/* 컨테이너 좌측 패딩 */}
              <DimLine dir="h" x={274} y={175} sp={8} />{/* 아이콘↔메시지 */}
            </>
          )}
        </div>
        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 0' }}>
          {[
            { num: 1, label: '컨테이너 (Container)' },
            { num: 2, label: '좌측 아이콘 (Leading icon)' },
            { num: 3, label: '메시지 (Message)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: TYPE.label2.fontSize, fontWeight: W.semibold, color: '#fff' }}>{item.num}. {item.label}</div>
          ))}
        </div>

        {/* 간격 스펙 표 — 실제 토스트 기준. gap 10→SP[8]·세로 패딩 10→SP[8] 정규화 */}
        {showSpacing && (
        <div style={{ maxWidth: '760px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (
              <div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>
            ))}
            {[
              ['가로 패딩', 'SP[16]', '16', '토스트 좌우'],
              ['세로 패딩', 'SP[8]', '8', '토스트 상하(10→8 정규화)'],
              ['아이콘 ↔ 메시지', 'SP[8]', '8', '내부 요소 간격(10/14→8 정규화)'],
              ['모서리 반경', 'radius', '8', 'border-radius'],
            ].map((r, i) => r.map((c, j) => (
              <div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>
            )))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 실제 토스트 gap 10·세로 패딩 10 → SP[8] 정규화, anatomy 들여쓰기·gap도 실제(SP[16]/SP[8])에 맞춤.</div>
        </div>
        )}
      </div>
    );
  }

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case 'error':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      case 'neutral':
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
    }
  };

  const getToastColors = (type) => {
    switch (type) {
      case 'success':
        return { bg: '#10B981', border: '#10B981', text: '#ffffff', iconColor: '#ffffff' };
      case 'warning':
        return { bg: '#FFA938', border: '#FFA938', text: '#ffffff', iconColor: '#ffffff' };
      case 'error':
        return { bg: '#FF6363', border: '#FF6363', text: '#ffffff', iconColor: '#ffffff' };
      case 'neutral':
      default:
        return { bg: '#2C2C2E', border: '#3A3A3C', text: '#ffffff', iconColor: '#a1a1aa' };
    }
  };

  const colors = getToastColors(toastType);

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Preview Panel */}
        <div style={{
          flex: 1.8,
          background: '#1e1e1e',
          padding: '48px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Mock background layout */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            opacity: 0.5,
            zIndex: 1
          }} />

          {/* Floating Toast */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: SP[8],
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: `${SP[8]} ${SP[16]}`,
            color: colors.text,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
            maxWidth: '480px',
            zIndex: 2,
            boxSizing: 'border-box',
            animation: 'fade-slide-in 0.3s ease-out'
          }}>
            {showIcon && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.iconColor,
                flexShrink: 0
              }}>
                {getToastIcon(toastType)}
              </div>
            )}
            <span style={{ fontSize: '13px', fontWeight: 500, lineHeight: 1.4 }}>{message}</span>
          </div>
        </div>

        {/* Right: Control Panel */}
        <div 
          className="ds-playground-controls"
          style={{
            flex: 1,
            background: '#141414',
            borderLeft: '1px solid #2a2a2a',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxHeight: '360px',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}
        >
          {/* Toast Type */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Toast Type</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['neutral', 'success', 'warning', 'error'].map(type => (
                <PlaygroundRadioOption
                  key={type}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  checked={toastType === type}
                  onChange={() => {
                    setToastType(type);
                    if (type === 'neutral') {
                      setMessage('장비 정상 가동 중: 정상 연결 상태가 복구되었습니다.');
                    } else if (type === 'success') {
                      setMessage('설정 변경 사항이 서버에 성공적으로 동기화되었습니다.');
                    } else if (type === 'warning') {
                      setMessage('주의: 네트워크 대역폭 제한으로 인해 프레임 저하가 발생할 수 있습니다.');
                    } else if (type === 'error') {
                      setMessage('서버 연결 실패: 원격 호스트에 도달할 수 없습니다.');
                    }
                  }}
                />
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '8px' }}>Message Text</div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                backgroundColor: '#222',
                border: '1px solid #333',
                color: '#fff',
                fontSize: '12px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Options */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Options</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption
                label="Show Leading Icon"
                checked={showIcon}
                onChange={() => setShowIcon(true)}
              />
              <PlaygroundRadioOption
                label="Hide Leading Icon"
                checked={!showIcon}
                onChange={() => setShowIcon(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Pintel Service Domains Playground Components
// ----------------------------------------------------

function IntersectionOverviewPlayground() {
  const [activeArea, setActiveArea] = useState(null);
  const areas = [
    { id: 'cctv', title: '지능형 CCTV 카메라', desc: '교차로 진입 4개 방향에 설치되어 차량 대기 행렬 및 교통량 정보를 실시간 영상 추출합니다.' },
    { id: 'controller', title: '신호 제어기 연동', desc: '경찰청 표준 신호제어기와 연동하여 차선별 현재 신호 상태를 실시간 수신합니다.' },
    { id: 'center', title: '로컬 엣지 컴퓨터', desc: '현장에서 수집된 영상 데이터를 실시간 객체 분석하여 1초 이내에 차선별 혼잡도를 계산합니다.' }
  ];
  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
      <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>스마트 교차로 인프라 구성도</h3>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left Panel */}
        <div style={{ flex: 1.8, background: '#121214', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexDirection: 'column' }}>
          <svg width="240" height="180" viewBox="0 0 240 180" style={{ opacity: 0.85 }}>
            <line x1="0" y1="90" x2="240" y2="90" stroke="#2a2a2c" strokeWidth="30" />
            <line x1="120" y1="0" x2="120" y2="180" stroke="#2a2a2c" strokeWidth="30" />
            <line x1="0" y1="90" x2="240" y2="90" stroke="#444" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="120" y1="0" x2="120" y2="180" stroke="#444" strokeWidth="1" strokeDasharray="5,5" />
            <rect x="75" y="65" width="10" height="50" fill="#555" />
            <rect x="155" y="65" width="10" height="50" fill="#555" />
            <rect x="95" y="45" width="50" height="10" fill="#555" />
            <rect x="95" y="125" width="50" height="10" fill="#555" />
            <circle cx="90" cy="55" r="7" fill={activeArea === 'cctv' ? '#3385FF' : '#0066FF'} style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setActiveArea('cctv')} />
            <circle cx="150" cy="125" r="7" fill={activeArea === 'cctv' ? '#3385FF' : '#0066FF'} style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setActiveArea('cctv')} />
            <rect x="145" y="50" width="12" height="12" rx="2" fill={activeArea === 'controller' ? '#1ED45A' : '#15803d'} style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setActiveArea('controller')} />
            <polygon points="90,120 96,132 84,132" fill={activeArea === 'center' ? '#c084fc' : '#6d28d9'} style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setActiveArea('center')} />
          </svg>
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', fontSize: '11px', color: '#666' }}>* 구성 요소를 클릭하여 상세 사양 확인</div>
        </div>
        {/* Right Panel */}
        <div 
          className="ds-playground-controls"
          style={{ flex: 1, background: '#161618', borderLeft: '1px solid #2a2a2e', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}
        >
          {areas.map(a => (
            <div key={a.id} onClick={() => setActiveArea(a.id)} style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', border: '1px solid', backgroundColor: activeArea === a.id ? 'rgba(0, 102, 255,0.1)' : '#1e1e1e', borderColor: activeArea === a.id ? '#0066FF' : '#2e2e2e', transition: 'all 0.2s' }}>
              <h4 style={{ color: activeArea === a.id ? '#3385FF' : '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 4px 0' }}>{a.title}</h4>
              <p style={{ color: '#aaa', fontSize: '12px', margin: 0, lineHeight: 1.4 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IntersectionOverlayPlayground() {
  const [showCar, setShowCar] = useState(true);
  const [showBus, setShowBus] = useState(true);
  const [showPed, setShowPed] = useState(true);
  const [enableDetections, setEnableDetections] = useState(true);

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left Panel */}
        <div style={{ flex: 1.8, background: '#09090b', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #1b1b1f 0%, #0d0d0f 100%)' }} />
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <line x1="0" y1="180" x2="640" y2="180" stroke="#222" strokeWidth="60" />
            <line x1="320" y1="0" x2="320" y2="360" stroke="#222" strokeWidth="60" />
            <line x1="0" y1="180" x2="640" y2="180" stroke="#444" strokeWidth="1" strokeDasharray="6,6" />
            <line x1="320" y1="0" x2="320" y2="360" stroke="#444" strokeWidth="1" strokeDasharray="6,6" />

            {enableDetections && (
              <>
                {showCar && (
                  <>
                    <rect x="80" y="165" width="50" height="30" rx="3" fill="none" stroke="#0066FF" strokeWidth="2" />
                    <text x="80" y="160" fill="#0066FF" fontSize="10" fontWeight="bold">승용차 98%</text>
                    <rect x="180" y="155" width="45" height="28" rx="3" fill="none" stroke="#0066FF" strokeWidth="2" />
                    <text x="180" y="150" fill="#0066FF" fontSize="10" fontWeight="bold">승용차 94%</text>
                  </>
                )}
                {showBus && (
                  <>
                    <rect x="360" y="160" width="110" height="42" rx="3" fill="none" stroke="#c084fc" strokeWidth="2" />
                    <text x="360" y="155" fill="#c084fc" fontSize="10" fontWeight="bold">버스 99%</text>
                  </>
                )}
                {showPed && (
                  <>
                    <rect x="295" y="90" width="12" height="24" rx="2" fill="none" stroke="#1ED45A" strokeWidth="2" />
                    <text x="295" y="85" fill="#1ED45A" fontSize="9" fontWeight="bold">보행자 92%</text>
                    <rect x="308" y="100" width="10" height="22" rx="2" fill="none" stroke="#1ED45A" strokeWidth="2" />
                    <text x="308" y="95" fill="#1ED45A" fontSize="9" fontWeight="bold">보행자 89%</text>
                  </>
                )}
              </>
            )}
          </svg>
          <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
            <span style={{ padding: '4px 8px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '11px', borderRadius: '4px', border: '1px solid #333' }}>CAM_01_교차로북측</span>
            <span style={{ padding: '4px 8px', backgroundColor: 'rgba(30,212,90,0.2)', color: '#1ED45A', fontSize: '11px', borderRadius: '4px', fontWeight: 'bold' }}>● LIVE</span>
          </div>
        </div>
        {/* Right Panel */}
        <div 
          className="ds-playground-controls"
          style={{ flex: 1, background: '#161618', borderLeft: '1px solid #2a2a2e', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Detections Overlay</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="Enable Overlay" checked={enableDetections} onChange={() => setEnableDetections(true)} />
              <PlaygroundRadioOption label="Disable Overlay" checked={!enableDetections} onChange={() => setEnableDetections(false)} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Object Filters</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="Show Cars" checked={showCar && enableDetections} onChange={() => enableDetections && setShowCar(!showCar)} />
              <PlaygroundRadioOption label="Show Buses" checked={showBus && enableDetections} onChange={() => enableDetections && setShowBus(!showBus)} />
              <PlaygroundRadioOption label="Show Pedestrians" checked={showPed && enableDetections} onChange={() => enableDetections && setShowPed(!showPed)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalQueuePlayground() {
  const [lanes, setLanes] = useState([
    { id: 1, name: '1차선 (좌회전)', signal: 'red', queue: 68, cars: 12 },
    { id: 2, name: '2차선 (직진 A)', signal: 'green', queue: 12, cars: 2 },
    { id: 3, name: '3차선 (직진 B)', signal: 'green', queue: 18, cars: 3 },
    { id: 4, name: '4차선 (우회전)', signal: 'red', queue: 45, cars: 8 }
  ]);

  const simulateTraffic = () => {
    setLanes(prev => prev.map(lane => {
      const nextSignal = Math.random() > 0.5 ? 'green' : 'red';
      const nextQueue = nextSignal === 'green' 
        ? Math.max(0, Math.floor(Math.random() * 20))
        : Math.floor(Math.random() * 85);
      return { ...lane, signal: nextSignal, queue: nextQueue, cars: Math.ceil(nextQueue / 6) };
    }));
  };

  const toggleLaneSignal = (id) => {
    setLanes(prev => prev.map(lane => {
      if (lane.id !== id) return lane;
      const nextSignal = lane.signal === 'green' ? 'red' : 'green';
      const nextQueue = nextSignal === 'green' ? Math.max(0, lane.queue - 25) : lane.queue + 20;
      return { ...lane, signal: nextSignal, queue: nextQueue, cars: Math.ceil(nextQueue / 6) };
    }));
  };

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left Panel */}
        <div style={{ flex: 1.8, background: '#111', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', boxSizing: 'border-box' }}>
          <h3 style={{ color: '#fff', fontSize: '15px', margin: '0 0 8px 0', fontWeight: 700 }}>실시간 차선별 대기행렬 현황</h3>
          {lanes.map(lane => {
            const isDanger = lane.queue > 50;
            const isWarning = lane.queue > 30 && lane.queue <= 50;
            const barColor = isDanger ? '#FF6363' : isWarning ? '#FFA938' : '#0066FF';
            return (
              <div key={lane.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#1e1e1e', padding: '10px 14px', borderRadius: '6px', border: '1px solid #2e2e2e' }}>
                <div style={{ width: '100px', color: '#fff', fontSize: '12px', fontWeight: 600 }}>{lane.name}</div>
                
                <div onClick={() => toggleLaneSignal(lane.id)} style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: lane.signal === 'green' ? '#1ED45A' : '#FF6363', cursor: 'pointer', boxShadow: lane.signal === 'green' ? '0 0 8px rgba(30,212,90,0.6)' : '0 0 8px rgba(255,99,99,0.6)', transition: 'all 0.2s', flexShrink: 0 }} />

                <div style={{ flex: 1, height: '8px', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (lane.queue / 90) * 100)}%`, height: '100%', backgroundColor: barColor, borderRadius: '4px', transition: 'all 0.4s' }} />
                </div>

                <div style={{ width: '100px', textAlign: 'right', fontSize: '12px', fontWeight: 'bold', color: isDanger ? '#FF6363' : '#fff' }}>
                  {lane.queue}m <span style={{ color: '#888', fontWeight: 'normal', fontSize: '11px' }}>({lane.cars}대)</span>
                </div>
              </div>
            );
          })}
        </div>
        {/* Right Panel */}
        <div 
          className="ds-playground-controls"
          style={{ flex: 1, background: '#161618', borderLeft: '1px solid #2a2a2e', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Simulation Controls</div>
            <button onClick={simulateTraffic} style={{ width: '100%', padding: '10px 14px', border: '1px solid #0066FF', background: 'transparent', color: '#3385FF', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s' }}>
              🔄 교통상황 업데이트
            </button>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Signal Controls</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lanes.map(lane => (
                <PlaygroundRadioOption
                  key={lane.id}
                  label={`${lane.name}: ${lane.signal.toUpperCase()}`}
                  checked={lane.signal === 'green'}
                  onChange={() => toggleLaneSignal(lane.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrafficFlowChartPlayground() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState('all'); // 'all', 'vehicles', 'pedestrians'
  const data = [
    { hour: '08시', vehicles: 840, pedestrians: 240 },
    { hour: '10시', vehicles: 620, pedestrians: 180 },
    { hour: '12시', vehicles: 710, pedestrians: 310 },
    { hour: '14시', vehicles: 580, pedestrians: 280 },
    { hour: '16시', vehicles: 890, pedestrians: 350 },
    { hour: '18시', vehicles: 1240, pedestrians: 420 }
  ];

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
      <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px', fontWeight: 700 }}>교량 지점 시간대별 교통량 (혼합 그래프)</h3>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left Panel */}
        <div style={{ flex: 1.8, background: '#111', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
          <div style={{ width: '100%', height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '8px', position: 'relative' }}>
            {data.map((item, idx) => {
              const maxVehicles = 1400;
              const barHeight = (item.vehicles / maxVehicles) * 160;
              const lineDotY = 160 - (item.pedestrians / maxVehicles) * 320;
              const isHovered = hoveredIndex === idx;

              return (
                <div 
                  key={idx} 
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ width: '14%', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', position: 'relative' }}
                >
                  {isHovered && (
                    <div style={{ position: 'absolute', top: '-60px', backgroundColor: '#000', border: '1px solid #0066FF', color: '#fff', borderRadius: '4px', padding: '6px 8px', fontSize: '11px', whiteSpace: 'nowrap', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                      🚗 차량: {item.vehicles}대<br />
                      🚶 보행자: {item.pedestrians}명
                    </div>
                  )}
                  {(selectedItem === 'all' || selectedItem === 'pedestrians') && (
                    <div style={{
                      position: 'absolute',
                      bottom: `${180 - lineDotY}px`,
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#1ED45A',
                      border: '2px solid #111',
                      zIndex: 2,
                      boxShadow: '0 0 6px #1ED45A',
                      transition: 'all 0.2s'
                    }} />
                  )}
                  {(selectedItem === 'all' || selectedItem === 'vehicles') && (
                    <div style={{
                      width: '100%',
                      height: `${barHeight}px`,
                      background: isHovered 
                        ? 'linear-gradient(to top, #3385FF, #0066FF)'
                        : 'linear-gradient(to top, rgba(0, 102, 255,0.8), rgba(0, 102, 255,0.3))',
                      borderRadius: '4px 4px 0 0',
                      transition: 'all 0.2s'
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: '#888', fontSize: '12px' }}>
            {data.map((item, idx) => (
              <div key={idx} style={{ width: '14%', textAlign: 'center', color: hoveredIndex === idx ? '#fff' : '#888' }}>
                {item.hour}
              </div>
            ))}
          </div>
        </div>
        {/* Right Panel */}
        <div 
          className="ds-playground-controls"
          style={{ flex: 1, background: '#161618', borderLeft: '1px solid #2a2a2e', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Chart Data Filter</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="Show All (차량 & 보행자)" checked={selectedItem === 'all'} onChange={() => setSelectedItem('all')} />
              <PlaygroundRadioOption label="Vehicles Only (차량 통행량)" checked={selectedItem === 'vehicles'} onChange={() => setSelectedItem('vehicles')} />
              <PlaygroundRadioOption label="Pedestrians Only (보행자 수)" checked={selectedItem === 'pedestrians'} onChange={() => setSelectedItem('pedestrians')} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Legend</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ccc' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#0066FF' }} />
                차량 통행량 (바)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ccc' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1ED45A' }} />
                보행자 수 (포인트)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectiveOverviewPlayground() {
  const [activeRule, setActiveRule] = useState(0);
  const rules = [
    { title: '가상 침입 감지 (Intrusion)', cond: '관제 설정 구역 내 차량/사람 기물 파손 및 출입 제한 지역 무단 침입 시 화면 자동 팝업.', visual: '🔴 Intrusion Triggered' },
    { title: '배회 행동 분석 (Loitering)', cond: '동일 객체가 특정 카메라 화각 영역 내에 15초 이상 머무를 경우 배회 이벤트로 등재.', visual: '🟡 Loitering Checked' },
    { title: '이상 안전 사고 (Fall Down)', cond: '행인이 급격한 높이 강하 후 일정 시간 거동을 정지하여 쓰러짐 상황 의심 시 경고.', visual: '🔴 Fall Down Alarm' }
  ];

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
      <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px', fontWeight: 700 }}>선별관제 자동 필터링 룰 엔진</h3>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Preview */}
        <div style={{ flex: 1.5, background: '#121214', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', position: 'relative' }}>
          <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: '0 0 16px 0' }}>{rules[activeRule].title}</h4>
          <div style={{ backgroundColor: '#09090b', borderRadius: '8px', padding: '24px 48px', textAlign: 'center', color: '#ff6363', fontSize: '16px', fontWeight: 'bold', border: '2px dashed #EF4444', boxShadow: '0 0 12px rgba(239, 68, 68, 0.2)' }}>
            {rules[activeRule].visual}
          </div>
          <p style={{ color: '#888', fontSize: '12px', marginTop: '16px', maxWidth: '300px', textAlign: 'center', lineHeight: 1.4 }}>{rules[activeRule].cond}</p>
        </div>
        {/* Right: Controls */}
        <div 
          className="ds-playground-controls"
          style={{ flex: 1, background: '#161618', borderLeft: '1px solid #2a2a2e', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Select Rule</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {rules.map((rule, idx) => (
                <PlaygroundRadioOption
                  key={idx}
                  label={rule.title.split(' ')[0]}
                  checked={activeRule === idx}
                  onChange={() => setActiveRule(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetectedTargetsPlayground() {
  const [feed, setFeed] = useState([
    { id: 1, time: '14:12:05', camera: 'CCTV_12', target: '무단 쓰레기 투척', severity: 'danger', icon: '🗑️' },
    { id: 2, time: '14:09:44', camera: 'CCTV_03', target: '구역 내 거동배회', severity: 'warning', icon: '👤' },
    { id: 3, time: '13:58:12', camera: 'CCTV_21', target: '가상 펜스 선로침입', severity: 'danger', icon: '🚧' }
  ]);

  const addDetection = () => {
    const alerts = [
      { target: '차량 인도 불법 주정차', severity: 'warning', icon: '🚗' },
      { target: '보행자 도로 쓰러짐 사고', severity: 'danger', icon: '🚑' },
      { target: '자전거 무단진입 경보', severity: 'info', icon: '🚲' }
    ];
    const pick = alerts[Math.floor(Math.random() * alerts.length)];
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newAlert = {
      id: Date.now(),
      time: timeStr,
      camera: `CCTV_0${Math.floor(Math.random() * 8) + 1}`,
      ...pick
    };
    setFeed(prev => [newAlert, ...prev.slice(0, 5)]);
  };

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Feed Panel */}
        <div style={{ flex: 1.8, background: '#111', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', boxSizing: 'border-box' }}>
          <h3 style={{ color: '#fff', fontSize: '15px', margin: '0 0 8px 0', fontWeight: 700 }}>관심 객체 실시간 디텍션 피드</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
            {feed.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#1e1e1e', padding: '10px 14px', borderRadius: '8px', border: '1px solid #2e2e2e', borderLeft: `4px solid ${item.severity === 'danger' ? '#FF6363' : item.severity === 'warning' ? '#FFA938' : '#3385FF'}` }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{item.target}</span>
                    <span style={{ fontSize: '11px', color: '#666' }}>{item.time}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>발생 카메라: {item.camera}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Right: Controls */}
        <div 
          className="ds-playground-controls"
          style={{ flex: 1, background: '#161618', borderLeft: '1px solid #2a2a2e', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Feed Actions</div>
            <button onClick={addDetection} style={{ width: '100%', padding: '10px 14px', border: 'none', background: '#0066FF', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
              ⚡ 가상 이벤트 발생
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CameraRadiusPlayground() {
  const [radius, setRadius] = useState(60);

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
      <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px', fontWeight: 700 }}>CCTV 탐지 커버리지 제어 (GIS 레이더)</h3>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Preview */}
        <div style={{ flex: 1.8, background: '#09090b', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: '40px', height: '40px', borderRadius: '50%', border: '1px dashed #222' }} />
          <div style={{ position: 'absolute', width: '100px', height: '100px', borderRadius: '50%', border: '1px dashed #222' }} />
          <div style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', border: '1px dashed #222' }} />

          <div style={{ zIndex: 3, width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#0066FF', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px #0066FF' }}>
            <span style={{ fontSize: '9px', color: '#fff' }}>📹</span>
          </div>

          <div style={{
            position: 'absolute',
            width: `${radius * 1.5}px`,
            height: `${radius * 1.5}px`,
            borderRadius: '50%',
            backgroundColor: 'rgba(30, 212, 90, 0.08)',
            border: '1.5px solid #1ED45A',
            transition: 'width 0.05s ease, height 0.05s ease',
            zIndex: 1,
            pointerEvents: 'none'
          }} />
          <div style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '11px', color: '#1ED45A', fontWeight: 'bold' }}>탐지 반경: {radius}m</div>
        </div>
        {/* Right: Controls */}
        <div 
          className="ds-playground-controls"
          style={{ flex: 1, background: '#161618', borderLeft: '1px solid #2a2a2e', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Coverage Control</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                <span>최소: 20m</span>
                <span>최대: 120m</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="120" 
                value={radius} 
                onChange={e => setRadius(parseInt(e.target.value))} 
                style={{ width: '100%', accentColor: '#1ED45A', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventGridPlayground() {
  const [events, setEvents] = useState([
    { id: 1, time: '14:08:12', type: '침입 감지', camera: 'CAM_08', resolved: false },
    { id: 2, time: '14:02:44', type: '불법 적치물', camera: 'CAM_02', resolved: false },
    { id: 3, time: '13:58:19', type: '배회 경보', camera: 'CAM_15', resolved: true }
  ]);
  const [filterMode, setFilterMode] = useState('all');

  const resolveEvent = (id) => {
    setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, resolved: true } : ev));
  };

  const filteredEvents = events.filter(ev => {
    if (filterMode === 'active') return !ev.resolved;
    if (filterMode === 'resolved') return ev.resolved;
    return true;
  });

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
      <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px', fontWeight: 700 }}>이상 행동 탐지 관제 그리드</h3>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Table */}
        <div style={{ flex: 1.8, background: '#111', padding: '20px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '360px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2e2e2e', color: '#888', fontSize: '11px' }}>
                <th style={{ padding: '8px' }}>감지시각</th>
                <th style={{ padding: '8px' }}>이벤트 유형</th>
                <th style={{ padding: '8px' }}>카메라 ID</th>
                <th style={{ padding: '8px' }}>처리상태</th>
                <th style={{ padding: '8px', textAlign: 'center' }}>조치</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(ev => (
                <tr key={ev.id} style={{ borderBottom: '1px solid #2e2e2e', fontSize: '12px', color: ev.resolved ? '#555' : '#fff', textDecoration: ev.resolved ? 'line-through' : 'none' }}>
                  <td style={{ padding: '10px 8px' }}>{ev.time}</td>
                  <td style={{ padding: '10px 8px', fontWeight: 'bold' }}>{ev.type}</td>
                  <td style={{ padding: '10px 8px' }}>{ev.camera}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: ev.resolved ? '#1ED45A' : '#FF6363' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: ev.resolved ? '#1ED45A' : '#FF6363' }} />
                      {ev.resolved ? '완료' : '미확인'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                    {!ev.resolved ? (
                      <button onClick={() => resolveEvent(ev.id)} style={{ padding: '2px 6px', border: '1px solid #0066FF', background: 'transparent', color: '#3385FF', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                        확인
                      </button>
                    ) : (
                      <span style={{ fontSize: '10px', color: '#444' }}>종료됨</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Right: Controls */}
        <div 
          className="ds-playground-controls"
          style={{ flex: 1, background: '#161618', borderLeft: '1px solid #2a2a2e', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Event Filters</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="Show All (전체)" checked={filterMode === 'all'} onChange={() => setFilterMode('all')} />
              <PlaygroundRadioOption label="Active Warnings (미확인)" checked={filterMode === 'active'} onChange={() => setFilterMode('active')} />
              <PlaygroundRadioOption label="Resolved (조치 완료)" checked={filterMode === 'resolved'} onChange={() => setFilterMode('resolved')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PedestrianOverviewPlayground() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { num: 1, title: '대기자 점유 검지 (Presence Detection)', desc: '보행대기선 안쪽에 사람이 진입할 경우 열화상/카메라 센서가 대상자를 자동 점유합니다.' },
    { num: 2, title: '감응 제어기 신호 요청 (Actuated Request)', desc: '센서가 보행 상태를 인식한 후, 신호 대기 시간 카운터를 작동하고 제어 장치에 횡단 보행신호 개설을 요구합니다.' },
    { num: 3, title: '보행 신호 및 음성 안내 (Signaling & Guide)', desc: '횡단 녹색불로 전환되며, 시각적 안전 안내와 스피커 음성을 송출하여 안전한 통행을 돕습니다.' }
  ];

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
      <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '12px', fontWeight: 700 }}>보행자 감응 횡단보도 동작 프로세스</h3>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Visual simulation */}
        <div style={{ flex: 1.5, background: '#121214', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#0066FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', boxShadow: '0 0 16px rgba(0, 102, 255,0.4)' }}>
            {activeStep + 1}
          </div>
          <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: '0 0 8px 0', textAlign: 'center' }}>{steps[activeStep].title}</h4>
          <p style={{ color: '#aaa', fontSize: '12px', margin: 0, textAlign: 'center', maxWidth: '300px', lineHeight: 1.5 }}>{steps[activeStep].desc}</p>
        </div>
        {/* Right: Steps controls */}
        <div 
          className="ds-playground-controls"
          style={{ flex: 1, background: '#161618', borderLeft: '1px solid #2a2a2e', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Process Steps</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {steps.map((step, idx) => (
                <PlaygroundRadioOption
                  key={idx}
                  label={`Step ${step.num}. ${step.title.split(' ')[0]}`}
                  checked={activeStep === idx}
                  onChange={() => setActiveStep(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PedestrianSensorPlayground() {
  const [zoneA, setZoneA] = useState(false);
  const [zoneB, setZoneB] = useState(false);

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
      <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px', fontWeight: 700 }}>진입 대기구역 센서 실시간 모니터링</h3>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Preview Panel */}
        <div style={{ flex: 1.8, background: '#111', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', boxSizing: 'border-box' }}>
          <div style={{ flex: 1, maxWidth: '160px', backgroundColor: '#1e1e1e', border: '1px solid', borderColor: zoneA ? '#1ED45A' : '#2e2e2e', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: zoneA ? '0 0 12px rgba(30,212,90,0.15)' : 'none' }}>
            <span style={{ fontSize: '11px', color: '#888' }}>보행 대기 존 A (북측)</span>
            <div style={{ fontSize: '24px' }}>{zoneA ? '🚶' : '⚪'}</div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: zoneA ? '#1ED45A' : '#555' }}>
              {zoneA ? '검지됨' : 'Clear'}
            </span>
          </div>

          <div style={{ flex: 1, maxWidth: '160px', backgroundColor: '#1e1e1e', border: '1px solid', borderColor: zoneB ? '#1ED45A' : '#2e2e2e', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: zoneB ? '0 0 12px rgba(30,212,90,0.15)' : 'none' }}>
            <span style={{ fontSize: '11px', color: '#888' }}>보행 대기 존 B (남측)</span>
            <div style={{ fontSize: '24px' }}>{zoneB ? '🚶' : '⚪'}</div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: zoneB ? '#1ED45A' : '#555' }}>
              {zoneB ? '검지됨' : 'Clear'}
            </span>
          </div>
        </div>
        {/* Right: Controls */}
        <div 
          className="ds-playground-controls"
          style={{ flex: 1, background: '#161618', borderLeft: '1px solid #2a2a2e', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Sensor Override</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="Zone A: Pedestrian" checked={zoneA} onChange={() => setZoneA(!zoneA)} />
              <PlaygroundRadioOption label="Zone B: Pedestrian" checked={zoneB} onChange={() => setZoneB(!zoneB)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActuatedCountdownPlayground() {
  const [state, setState] = useState('idle');
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    let timer;
    if (state === 'actuating') {
      if (seconds <= 0) {
        setState('green');
        setSeconds(8);
        return;
      }
      timer = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (state === 'green') {
      if (seconds <= 0) {
        setState('idle');
        setSeconds(10);
        return;
      }
      timer = setInterval(() => setSeconds(s => s - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [state, seconds]);

  const triggerActuation = () => {
    if (state !== 'idle') return;
    setState('actuating');
    setSeconds(10);
  };

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
      <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px', fontWeight: 700 }}>감응 신호 주기 카운트다운</h3>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Signal Preview */}
        <div style={{ flex: 1.8, background: '#111', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: state === 'idle' ? '#FF6363' : '#333', boxShadow: state === 'idle' ? '0 0 10px #FF6363' : 'none' }} />
              <span style={{ fontSize: '10px', color: state === 'idle' ? '#FF6363' : '#666' }}>적색 (대기)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: state === 'actuating' ? '#FFA938' : '#333', boxShadow: state === 'actuating' ? '0 0 10px #FFA938' : 'none' }} />
              <span style={{ fontSize: '10px', color: state === 'actuating' ? '#FFA938' : '#666' }}>감지 완료</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: state === 'green' ? '#1ED45A' : '#333', boxShadow: state === 'green' ? '0 0 10px #1ED45A' : 'none' }} />
              <span style={{ fontSize: '10px', color: state === 'green' ? '#1ED45A' : '#666' }}>녹색 (보행)</span>
            </div>
          </div>

          <div style={{ fontSize: '40px', fontWeight: 900, color: state === 'green' ? '#1ED45A' : state === 'actuating' ? '#FFA938' : '#888', letterSpacing: '-1px' }}>
            {state === 'idle' ? '--' : `${seconds}s`}
          </div>

          <div style={{ fontSize: '11px', color: '#aaa', fontWeight: 500, textAlign: 'center', maxWidth: '280px', lineHeight: 1.4 }}>
            {state === 'idle' && '대기선 내 보행자 접근 대기 중'}
            {state === 'actuating' && '감지 수락: 보행 신호 예약 대기 중'}
            {state === 'green' && '보행 신호 활성화! 안전하게 횡단하십시오'}
          </div>
        </div>
        {/* Right: Simulation Controls */}
        <div 
          className="ds-playground-controls"
          style={{ flex: 1, background: '#161618', borderLeft: '1px solid #2a2a2e', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Simulator Trigger</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {state === 'idle' ? (
                <button onClick={triggerActuation} style={{ width: '100%', padding: '10px 14px', border: 'none', background: '#0066FF', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  🚶 보행자 접근 시뮬레이션
                </button>
              ) : (
                <button disabled style={{ width: '100%', padding: '10px 14px', border: 'none', background: '#333', color: '#666', borderRadius: '6px', fontSize: '12px' }}>
                  제어 동작 중...
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AudioControlPlayground() {
  const [volume, setVolume] = useState(65);
  const [broadcastState, setBroadcastState] = useState(null);

  const triggerBroadcast = (msgType) => {
    setBroadcastState(msgType);
    setTimeout(() => {
      setBroadcastState(null);
    }, 3000);
  };

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
      <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px', fontWeight: 700 }}>현장 원격 지향성 스피커 제어</h3>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Speaker Status & Sound Wave Animation */}
        <div style={{ flex: 1.8, background: '#111', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', boxSizing: 'border-box' }}>
          <div style={{ backgroundColor: '#1e1e1e', padding: '16px', borderRadius: '8px', border: '1px solid #2e2e2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '14px' }}>횡단보도 스피커 #1</h4>
              <span style={{ fontSize: '12px', color: '#888' }}>볼륨: {volume}dB</span>
            </div>

            <div style={{ display: 'flex', gap: '4px', height: '24px', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map(bar => {
                const activeHeight = broadcastState ? Math.floor(Math.random() * 20) + 4 : 4;
                return (
                  <div key={bar} style={{
                    width: '3px',
                    height: `${activeHeight}px`,
                    backgroundColor: broadcastState ? '#3385FF' : '#555',
                    borderRadius: '2.5px',
                    transition: 'height 0.15s ease'
                  }} />
                );
              })}
            </div>
          </div>

          {broadcastState && (
            <div style={{ backgroundColor: 'rgba(0, 102, 255,0.1)', border: '1px solid #0066FF', borderRadius: '4px', padding: '10px', textAlign: 'center', color: '#3385FF', fontSize: '12px', fontWeight: 'bold' }}>
              {broadcastState === 'curb' ? '📢 "위험하오니 차도로 들어가지 마세요"' : '📢 "신호가 켜졌습니다. 좌우를 살핀 후 건너세요"'}
            </div>
          )}
        </div>
        {/* Right: Controls */}
        <div 
          className="ds-playground-controls"
          style={{ flex: 1, background: '#161618', borderLeft: '1px solid #2a2a2e', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '8px' }}>음량 크기 조절</div>
            <input type="range" min="30" max="95" value={volume} onChange={e => setVolume(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#0066FF', cursor: 'pointer' }} />
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Remotely Broadcast</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                disabled={broadcastState !== null}
                onClick={() => triggerBroadcast('curb')} 
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #FF6363', background: 'transparent', color: '#FF6363', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
              >
                🚨 대기선 침범 경고 송출
              </button>
              <button 
                disabled={broadcastState !== null}
                onClick={() => triggerBroadcast('safe')} 
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #1ED45A', background: 'transparent', color: '#1ED45A', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
              >
                🔊 안전보행 유도방송 송출
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Pintel Smart School Zone Playground Components
// ----------------------------------------------------

function SchoolzoneOverviewPlayground() {
  const [activeTab, setActiveTab] = useState('speed');
  const details = {
    speed: { title: '제한 속도 모니터링 (30km/h)', desc: '스쿨존 전역의 차량 속도를 모니터링하여 LED 전광판을 통해 과속 경고를 운전자에게 표출합니다.' },
    parking: { title: '어린이 보호구역 불법 주정차', desc: '횡단보도 주변 25m 내 차량 정차 시 즉시 감지하여 관제 알람을 생성하고 자동 단속 처리를 유도합니다.' },
    warning: { title: '어린이 횡단 위험 예보', desc: '맹점 구역(불법 차량 등)에 의해 차량과 어린이의 가시선이 가려졌을 때 충돌 위험을 스마트 전광판으로 조기 경보합니다.' }
  };

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
      <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>스마트 스쿨존 통합 안전 가이드</h3>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Details Content Box */}
        <div style={{ flex: 1.5, background: '#121214', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box' }}>
          <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, margin: '0 0 12px 0' }}>{details[activeTab].title}</h4>
          <p style={{ color: '#aaa', fontSize: '13px', margin: 0, lineHeight: 1.6, maxWidth: '300px' }}>{details[activeTab].desc}</p>
        </div>
        {/* Right: Tabs Selection */}
        <div 
          className="ds-playground-controls"
          style={{ flex: 1, background: '#161618', borderLeft: '1px solid #2a2a2e', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Schoolzone Rules</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.keys(details).map(k => (
                <PlaygroundRadioOption
                  key={k}
                  label={details[k].title.split(' ')[0]}
                  checked={activeTab === k}
                  onChange={() => setActiveTab(k)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpeedLimitPlayground() {
  const [speed, setSpeed] = useState(25);
  const isOver = speed > 30;

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
      <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px', fontWeight: 700 }}>과속 경보 LED 전광판 시뮬레이터</h3>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Sign Panel */}
        <div style={{ flex: 1.8, background: '#111', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
          <div style={{
            width: '240px',
            padding: '16px 24px',
            backgroundColor: '#09090b',
            border: '4px solid #3f3f46',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            boxShadow: isOver ? '0 0 20px rgba(239, 68, 68, 0.2)' : '0 0 20px rgba(30, 212, 90, 0.2)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '6px solid #EF4444',
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: '900',
              color: '#111'
            }}>30</div>

            <div style={{
              fontFamily: 'monospace',
              fontSize: '32px',
              fontWeight: 'bold',
              color: isOver ? '#FF6363' : '#1ED45A',
              transition: 'color 0.2s'
            }}>
              {speed} km/h
            </div>

            <div style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: isOver ? '#FF6363' : '#1ED45A'
            }}>
              {isOver ? '🚨 SLOW DOWN' : '🟢 제한속도 준수'}
            </div>
          </div>
        </div>
        {/* Right: Controls */}
        <div 
          className="ds-playground-controls"
          style={{ flex: 1, background: '#161618', borderLeft: '1px solid #2a2a2e', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '8px' }}>속도 설정 (슬라이더 조절)</div>
            <input 
              type="range" 
              min="10" 
              max="60" 
              value={speed} 
              onChange={e => setSpeed(parseInt(e.target.value))} 
              style={{ width: '100%', accentColor: isOver ? '#FF6363' : '#1ED45A', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Preset Speed</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="25 km/h (Normal)" checked={speed === 25} onChange={() => setSpeed(25)} />
              <PlaygroundRadioOption label="45 km/h (Speeding)" checked={speed === 45} onChange={() => setSpeed(45)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IllegalParkingPlayground() {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(10);
  const [status, setStatus] = useState('warning');

  useEffect(() => {
    let timer;
    if (active) {
      if (seconds <= 0) {
        setStatus('ticketed');
        return;
      }
      timer = setInterval(() => setSeconds(s => s - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [active, seconds]);

  const triggerDetection = () => {
    setActive(true);
    setSeconds(10);
    setStatus('warning');
  };

  const resetDetection = () => {
    setActive(false);
    setSeconds(10);
    setStatus('warning');
  };

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
      <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px', fontWeight: 700 }}>스쿨존 불법주정차 실시간 단속</h3>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Preview Panel */}
        <div style={{ flex: 1.8, background: '#111', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
          {active ? (
            <div style={{
              width: '100%',
              maxWidth: '320px',
              textAlign: 'center',
              padding: '20px',
              borderRadius: '8px',
              backgroundColor: '#09090b',
              border: '2px solid',
              borderColor: status === 'ticketed' ? '#FF6363' : '#FFA938',
              boxShadow: status === 'ticketed' ? '0 0 10px rgba(255,99,99,0.2)' : 'none',
              transition: 'all 0.3s'
            }}>
              <h4 style={{ color: '#fff', fontSize: '14px', margin: '0 0 8px 0' }}>차량 검출: 경기 34가 9012</h4>
              {status === 'warning' ? (
                <>
                  <span style={{ fontSize: '11px', color: '#FFA938', fontWeight: 'bold' }}>⚠️ 단속 구역 불법 정차 중 (이동방송 송출)</span>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#fff', marginTop: '10px' }}>단속 유예 잔여: {seconds}초</div>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '12px', color: '#FF6363', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF6363' }} />
                    🚨 과태료 대상 차량 등록 완료
                  </span>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '6px' }}>자동 벌점 및 과태료 고지서 전송 상태</div>
                </>
              )}
            </div>
          ) : (
            <div style={{ color: '#666', fontSize: '13px', padding: '32px 0' }}>
              감지 구역 내 정차 차량 없음 (안전함)
            </div>
          )}
        </div>
        {/* Right: Controls */}
        <div 
          className="ds-playground-controls"
          style={{ flex: 1, background: '#161618', borderLeft: '1px solid #2a2a2e', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Simulation Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {!active ? (
                <button onClick={triggerDetection} style={{ width: '100%', padding: '8px 12px', border: 'none', background: '#EF4444', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  스쿨존 정차 차량 감지
                </button>
              ) : (
                <button onClick={resetDetection} style={{ width: '100%', padding: '8px 12px', border: '1px solid #444', background: '#222', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                  차량 이탈 처리 (초기화)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CrosswalkWarningPlayground() {
  const [child, setChild] = useState(false);
  const [car, setCar] = useState(false);
  const isDanger = child && car;

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
      <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px', fontWeight: 700 }}>횡단보도 어린이 진입 조기 경보</h3>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Visual Sign */}
        <div style={{ flex: 1.8, background: '#09090b', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: '100%', height: '30px', backgroundColor: '#333' }} />
          <div style={{ position: 'absolute', width: '20px', height: '30px', backgroundColor: '#fff', left: '40%' }} />
          <div style={{ position: 'absolute', width: '20px', height: '30px', backgroundColor: '#fff', left: '50%' }} />
          
          <div style={{
            position: 'absolute',
            left: child ? '45%' : '20%',
            top: '75px',
            fontSize: '24px',
            transition: 'all 0.3s'
          }}>🎒</div>

          <div style={{
            position: 'absolute',
            left: car ? '55%' : '80%',
            top: '15px',
            fontSize: '24px',
            transition: 'all 0.3s'
          }}>🚗</div>

          {isDanger && (
            <div style={{
              position: 'absolute',
              backgroundColor: 'rgba(239,68,68,0.9)',
              border: '2px solid #fff',
              borderRadius: '6px',
              padding: '6px 12px',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 'bold',
              boxShadow: '0 0 10px #EF4444'
            }}>
              ⚠️ 어린이 감지! 차량 서행 유도
            </div>
          )}
        </div>
        {/* Right: Simulation Controls */}
        <div 
          className="ds-playground-controls"
          style={{ flex: 1, background: '#161618', borderLeft: '1px solid #2a2a2e', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '360px', overflowY: 'auto', boxSizing: 'border-box' }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Pedestrian State</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="어린이 대기선 진입" checked={child} onChange={() => setChild(!child)} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Traffic State</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption label="차량 접근 중" checked={car} onChange={() => setCar(!car)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckmarkPlayground({ activeSubTab }) {
  const [checked, setChecked] = useState(true);
  const [size, setSize] = useState('medium'); // 'small' | 'medium' | 'large'
  const [color, setColor] = useState('accent'); // 'accent' | 'neutral'
  const [disabled, setDisabled] = useState(false);
  const [showSpacing, setShowSpacing] = useState(true); // anatomy 간격 치수선 토글(기본 표시)

  const calloutStyle = {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    color: '#111',
    fontSize: '11px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.22)',
  };

  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
        {/* 간격 표시 토글 — 치수선(SP 토큰) on/off */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '720px', margin: '0 auto 10px' }}>
          <button type="button" onClick={() => setShowSpacing((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px', borderRadius: '6px', border: `1px solid ${showSpacing ? '#8b5cf6' : '#3a3a42'}`, background: showSpacing ? 'rgba(139,92,246,0.16)' : '#202024', color: showSpacing ? '#c4b5fd' : '#a1a1aa', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} />간격 {showSpacing ? '숨기기' : '표시'}
          </button>
        </div>
        {/* 라이트 카드 */}
        <div style={{
          position: 'relative',
          background: '#efefef',
          borderRadius: '16px',
          width: '720px',
          height: '340px',
          margin: '0 auto 24px',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* 체크마크 컴포넌트 — 중앙 */}
          <div style={{
            position: 'absolute',
            left: '300px',
            top: '150px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#18181b',
            zIndex: 3,
            userSelect: 'none'
          }}>
            <Icon name="check" size={18} color="#00A9FF" />
            <span>체크된 콘텐츠</span>
          </div>

          {/* SVG 직선 */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
          >
            {/* 1. Control -> 수평선 좌측으로 */}
            <line x1="240" y1="160" x2="302" y2="160" stroke="#999" strokeWidth="1.2" />
            <circle cx="302" cy="160" r="1.5" fill="#999" />
            {/* 2. Label -> 수평선 우측으로 */}
            <line x1="440" y1="160" x2="395" y2="160" stroke="#999" strokeWidth="1.2" />
            <circle cx="395" cy="160" r="1.5" fill="#999" />
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '230px', top: '160px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '450px', top: '160px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>

          {/* 간격 치수선 — 체크마크 ↔ 라벨 간격 SP[8] */}
          {showSpacing && (
            <DimLine dir="h" x={318} y={160} sp={8} />
          )}
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Check mark (체크 표시 — Checkbox 상태 연동)' },
            { num: 2, label: 'Content (체크된 콘텐츠 / 라벨)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>

        {/* 간격 스펙 표 */}
        {showSpacing && (
        <div style={{ maxWidth: '720px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>간격 스펙 (Spacing)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.4fr 1.5fr', gap: '1px', background: '#2a2a30', border: '1px solid #2a2a30', borderRadius: '8px', overflow: 'hidden', fontSize: '12px' }}>
            {['항목', '토큰', 'px', '용도'].map((h) => (<div key={h} style={{ background: '#1b1b1d', color: '#a1a1aa', fontWeight: 700, padding: '7px 10px' }}>{h}</div>))}
            {[
              ['체크마크 ↔ 라벨', 'SP[8]', '8', '아이콘과 콘텐츠 간격'],
              ['체크 아이콘', '—', '18', 'check 글리프'],
            ].map((r, i) => r.map((c, j) => (<div key={`${i}-${j}`} style={{ background: '#161618', color: j === 1 ? '#c4b5fd' : '#d4d4d8', fontWeight: j === 1 ? 700 : 400, padding: '7px 10px', fontVariantNumeric: 'tabular-nums' }}>{spPxCell(r, j, c)}</div>)))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#71717a' }}>※ 이미 SP 준수(gap SP[8]). 실동작 사이즈별 gap 8/10/12 · 패딩 12/24.</div>
        </div>
        )}
      </div>
    );
  }

  // Interactive Tab Content
  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', gap: '14px', background: '#202024', borderRadius: '20px', overflow: 'hidden', height: '360px', padding: '14px', boxSizing: 'border-box' }}>
        {/* Left: Preview Panel */}
        <div style={{ flex: 1.8, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div
            onClick={() => !disabled && setChecked(!checked)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: size === 'small' ? '8px' : size === 'medium' ? '10px' : '12px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              userSelect: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              opacity: disabled ? 0.4 : 1,
              transition: 'all 0.15s'
            }}
          >
            <span style={{ 
              color: checked ? (color === 'accent' ? '#00A3FF' : '#ffffff') : '#4e4e52',
              fontSize: size === 'small' ? '16px' : size === 'medium' ? '20px' : '24px',
              fontWeight: 'bold',
              transition: 'all 0.15s',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: size === 'small' ? '16px' : size === 'medium' ? '20px' : '24px',
              height: size === 'small' ? '16px' : size === 'medium' ? '20px' : '24px',
              visibility: checked ? 'visible' : 'hidden'
            }}>
              <Icon
                name="check"
                size={size === 'small' ? 16 : size === 'medium' ? 20 : 24}
                color={checked ? (color === 'accent' ? '#00A9FF' : '#ffffff') : '#4e4e52'}
              />
            </span>
            <span style={{ 
              fontSize: size === 'small' ? '13px' : size === 'medium' ? '15px' : '17px',
              color: checked ? '#ffffff' : '#8e8e93',
              fontWeight: checked ? '600' : '400',
              transition: 'color 0.15s'
            }}>
              Checkmark
            </span>
          </div>
        </div>

        {/* Right: Control Panel */}
        <div 
          className="ds-playground-controls"
          style={{ 
            flex: 1, 
            background: '#2a2a30',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxHeight: '332px',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}
        >
          {/* Checked Option */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>State</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption 
                label="Checked" 
                checked={checked} 
                onChange={() => setChecked(true)} 
              />
              <PlaygroundRadioOption 
                label="Unchecked" 
                checked={!checked} 
                onChange={() => setChecked(false)} 
              />
            </div>
          </div>

          {/* Color Option */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Color</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption 
                label="Accent (시안 블루)" 
                checked={color === 'accent'} 
                onChange={() => setColor('accent')} 
              />
              <PlaygroundRadioOption 
                label="Neutral (화이트)" 
                checked={color === 'neutral'} 
                onChange={() => setColor('neutral')} 
              />
            </div>
          </div>

          {/* Size Option */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Size</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption 
                label="Small" 
                checked={size === 'small'} 
                onChange={() => setSize('small')} 
              />
              <PlaygroundRadioOption 
                label="Medium" 
                checked={size === 'medium'} 
                onChange={() => setSize('medium')} 
              />
              <PlaygroundRadioOption 
                label="Large" 
                checked={size === 'large'} 
                onChange={() => setSize('large')} 
              />
            </div>
          </div>

          {/* Disabled Option */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Disabled</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption 
                label="False" 
                checked={!disabled} 
                onChange={() => setDisabled(false)} 
              />
              <PlaygroundRadioOption 
                label="True" 
                checked={disabled} 
                onChange={() => setDisabled(true)} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextButtonPlayground({ activeSubTab }) {
  const [color, setColor] = useState('assistive'); // 'primary' | 'assistive'
  const [leadingIcon, setLeadingIcon] = useState(true);
  const [trailingIcon, setTrailingIcon] = useState(true);

  const buttonColor = color === 'primary' ? '#3385FF' : '#8e8e93';

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Preview Panel */}
        <div style={{ flex: 1.8, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '15px',
            color: buttonColor,
            fontWeight: '600',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'color 0.2s',
          }}>
            {leadingIcon && (
              <div style={{
                width: '16px',
                height: '16px',
                border: '1.5px dashed rgba(255,255,255,0.4)',
                borderRadius: '4px',
                display: 'inline-block',
                boxSizing: 'border-box'
              }} />
            )}
            <span>Button</span>
            {trailingIcon && (
              <div style={{
                width: '16px',
                height: '16px',
                border: '1.5px dashed rgba(255,255,255,0.4)',
                borderRadius: '4px',
                display: 'inline-block',
                boxSizing: 'border-box'
              }} />
            )}
          </div>
        </div>

        {/* Right: Control Panel */}
        <div 
          className="ds-playground-controls"
          style={{ 
            flex: 1, 
            background: '#18181a', 
            borderLeft: '1px solid #2a2a2e', 
            padding: '24px 20px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
            maxHeight: '360px',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}
        >
          {/* Color Option */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Color</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption 
                label="Primary" 
                checked={color === 'primary'} 
                onChange={() => setColor('primary')} 
              />
              <PlaygroundRadioOption 
                label="Assistive" 
                checked={color === 'assistive'} 
                onChange={() => setColor('assistive')} 
              />
            </div>
          </div>

          {/* Leading Icon Option */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Leading icon</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption 
                label="False" 
                checked={!leadingIcon} 
                onChange={() => setLeadingIcon(false)} 
              />
              <PlaygroundRadioOption 
                label="True" 
                checked={leadingIcon} 
                onChange={() => setLeadingIcon(true)} 
              />
            </div>
          </div>

          {/* Trailing Icon Option */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Trailing icon</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <PlaygroundRadioOption 
                label="False" 
                checked={!trailingIcon} 
                onChange={() => setTrailingIcon(false)} 
              />
              <PlaygroundRadioOption 
                label="True" 
                checked={trailingIcon} 
                onChange={() => setTrailingIcon(true)} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


