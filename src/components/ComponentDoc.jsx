import { useState, useRef, useEffect } from 'react';
import { COMPONENT_DOCS, SPACING_MAP, CATEGORIES, TIERS } from '../data/components';
import { Icon } from './icons';

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
            backgroundColor: '#1751D9',
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
            backgroundColor: '#1751D9',
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
            <div style={{ padding: '3px 6px', backgroundColor: '#1751D9', color: '#fff', fontSize: '7px', borderRadius: '8px', fontWeight: 'bold' }}>Chip</div>
            <div style={{ padding: '3px 6px', backgroundColor: '#e4e4e7', color: '#71717a', fontSize: '7px', borderRadius: '8px' }}>Chip</div>
            <div style={{ padding: '3px 6px', backgroundColor: '#e4e4e7', color: '#71717a', fontSize: '7px', borderRadius: '8px' }}>Chip</div>
          </div>
        </BrowserFrame>
      );
    case 'button-text':
      return (
        <BrowserFrame>
          <div style={{ fontSize: '9px', color: '#1751D9', fontWeight: 'bold' }}>
            Text button
          </div>
        </BrowserFrame>
      );
    case 'button-tab':
      return (
        <BrowserFrame>
          <div style={{ fontSize: '9px', color: '#1751D9', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}>
            Tab button <span style={{ fontSize: '7px' }}>&gt;</span>
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
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#3471FF', color: '#fff', fontSize: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #ffffff', marginLeft: '-6px', zIndex: 2 }}>B</div>
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
            <div style={{ padding: '3px 7px', backgroundColor: '#1751D9', color: '#fff', fontSize: '7px', borderRadius: '5px', fontWeight: 'bold' }}>Category</div>
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
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#1751D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #1751D9', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#1751D9' }} />
            </div>
            <span style={{ fontSize: '8px', color: '#18181b' }}>Radio</span>
          </div>
        </BrowserFrame>
      );
    case 'control-switch':
      return (
        <BrowserFrame>
          <div style={{ width: '40px', height: '22px', borderRadius: '11px', backgroundColor: '#1751D9', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '2px', right: '2px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff' }} />
          </div>
        </BrowserFrame>
      );
    case 'control-slider':
      return (
        <BrowserFrame>
          <div style={{ width: '120px', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{ height: '4px', flex: 1, borderRadius: '2px', backgroundColor: '#e4e4e7' }} />
            <div style={{ position: 'absolute', left: 0, height: '4px', width: '55%', borderRadius: '2px', backgroundColor: '#1751D9' }} />
            <div style={{ position: 'absolute', left: '55%', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#fff', border: '2px solid #1751D9', transform: 'translateX(-50%)', boxSizing: 'border-box' }} />
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
            <div style={{ width: '120px', height: '22px', border: '1px solid #1751D9', borderRadius: '6px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', padding: '0 6px', boxSizing: 'border-box' }}>
              <div style={{ width: '1.5px', height: '12px', backgroundColor: '#1751D9' }} />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', border: '1px solid #1751D9', borderRadius: '6px', color: '#1751D9', fontSize: '8px', fontWeight: 'bold' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
            필터
            <span style={{ backgroundColor: '#1751D9', color: '#fff', borderRadius: '50%', width: '12px', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px' }}>3</span>
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
    case 'control-timepicker':
      return (
        <BrowserFrame>
          <div style={{ width: '110px', height: '24px', border: '1px solid #e4e4e7', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px', padding: '0 8px', backgroundColor: '#fff', boxSizing: 'border-box' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2.2"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>
            <span style={{ fontSize: '8px', color: '#18181b' }}>09:30</span>
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
                        e.currentTarget.style.borderColor = '#1751D9';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(23, 81, 217, 0.15)';
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
                <p style={{ fontSize: '15px', color: '#aaa', lineHeight: 1.7, marginBottom: '28px', maxWidth: '760px' }}>{doc.overview}</p>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                {(doc.icons || []).map((ic) => (
                  <div key={ic.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 12px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px' }}>
                    <Icon name={ic.name} size={28} />
                    <div style={{ fontSize: '12px', color: '#fff', fontFamily: 'monospace' }}>{ic.name}</div>
                    {ic.label && <div style={{ fontSize: '11px', color: '#888' }}>{ic.label}</div>}
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
                      <div className="doc-typo-value" style={{ fontFamily: 'monospace', fontSize: '12px', color: '#1751D9' }}>{color.variable}</div>
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
            <p style={{ color: '#cccccc', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
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
                    <div className="doc-typo-value" style={{ fontFamily: 'monospace', color: '#1751D9' }}>{token.value}</div>
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
                    <div className="doc-typo-value" style={{ fontFamily: 'monospace', color: '#1751D9' }}>{prop.type}</div>
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
                      <div className="doc-typo-value" style={{ fontFamily: 'monospace', color: '#1751D9' }}>
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
                  border: '1px solid #1751D9',
                  borderRadius: '4px',
                  color: '#1751D9',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(23,81,217,0.1)' }}
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
                    color: isHovered ? '#1751D9' : '#1f2937',
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
                  color: '#1751D9',
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
  if (componentId === 'alert-default') {
    return <AlertPlayground activeSubTab={activeSubTab} />;
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
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'inline-flex', backgroundColor: '#1e1e1e', padding: '4px', borderRadius: '6px' }}>
          <div style={{ padding: '6px 16px', color: '#1751D9', backgroundColor: '#2b2b2b', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>일별</div>
          <div style={{ padding: '6px 16px', color: '#888', fontSize: '14px' }}>주별</div>
          <div style={{ padding: '6px 16px', color: '#888', fontSize: '14px' }}>월별</div>
        </div>
      </div>
    );
  }
  if (componentId === 'control-datepicker') {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#1e1e1e', padding: '8px 16px', borderRadius: '4px', color: '#888', fontSize: '14px', border: '1px solid #333' }}>
          사용자 지정
          <FigCalendarToday size={16} color="#00A9FF" style={{ marginLeft: '12px' }} />
        </div>
      </div>
    );
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
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#1a1a1a', width: '250px', padding: '16px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', color: '#1751D9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1751D9"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              <span style={{ fontSize: '14px' }}>지점 B</span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>13</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
              <span style={{ fontSize: '14px' }}>지점 C</span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>13</span>
          </div>
        </div>
      </div>
    );
  }
  if (componentId === 'list-cell-default') {
    return <ListCellPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'list-card-default') {
    return <ListCardPlayground activeSubTab={activeSubTab} />;
  }
  if (componentId === 'chart-mixed') {
    return (
      <div style={{ padding: '32px', backgroundColor: '#2b2b2b', borderRadius: '8px', width: '100%', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginBottom: '40px', fontSize: '13px', color: '#bbb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1751D9' }}></div> 평균</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b' }}></div> 전일 차이</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '16px', height: '0px', borderTop: '2px dashed #bbb', position: 'relative' }}><div style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#fff', top: '-3px', left: '6px' }}></div></div> 비교 기준</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px' }}>
          <div style={{ width: '8%', height: '40%', background: 'linear-gradient(to bottom, rgba(23,81,217,0.8), transparent)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
          <div style={{ width: '8%', height: '60%', background: 'linear-gradient(to bottom, rgba(23,81,217,0.8), transparent)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
          <div style={{ width: '8%', height: '80%', background: 'linear-gradient(to bottom, rgba(23,81,217,0.8), transparent)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
          <div style={{ width: '8%', height: '50%', background: 'linear-gradient(to bottom, rgba(23,81,217,0.8), transparent)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
          <div style={{ position: 'relative', width: '8%', height: '75%', background: '#f59e0b', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
            <span style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', color: '#f59e0b', fontSize: '14px', fontWeight: 'bold' }}>23</span>
          </div>
          <div style={{ width: '8%', height: '45%', background: 'linear-gradient(to bottom, rgba(23,81,217,0.8), transparent)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
          <div style={{ width: '8%', height: '30%', background: 'linear-gradient(to bottom, rgba(23,81,217,0.8), transparent)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
          <div style={{ width: '8%', height: '20%', background: 'linear-gradient(to bottom, rgba(23,81,217,0.8), transparent)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
        </div>
      </div>
    );
  }
  if (componentId === 'card-panel') {
    return <CardPlayground activeSubTab={activeSubTab} />;
  }

  if (componentId === 'button-tab') {
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
            {/* 탭 컴포넌트 — 중앙 */}
            <div style={{
              position: 'absolute',
              left: '240px',
              top: '150px',
              width: '240px',
              height: '40px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1.5px solid #e4e4e7',
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
              padding: '4px',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              zIndex: 3,
            }}>
              {/* Active Tab Item (1) */}
              <div style={{
                width: '74px',
                height: '32px',
                backgroundColor: '#18181b',
                color: '#ffffff',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'default',
                userSelect: 'none'
              }}>Text 1</div>
              {/* Inactive Tab Item 1 (2) */}
              <div style={{
                width: '74px',
                height: '32px',
                color: '#71717a',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'default',
                userSelect: 'none'
              }}>Text 2</div>
              {/* Inactive Tab Item 2 */}
              <div style={{
                width: '74px',
                height: '32px',
                color: '#71717a',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'default',
                userSelect: 'none'
              }}>Text 3</div>
            </div>

            {/* SVG 직선 */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
            >
              {/* 1. Active Tab -> 수직선 위로 */}
              <line x1="280" y1="90" x2="280" y2="146" stroke="#999" strokeWidth="1.2" />
              {/* 2. Inactive Tab -> 수평선 우측으로 */}
              <line x1="540" y1="170" x2="360" y2="170" stroke="#999" strokeWidth="1.2" />
              <circle cx="360" cy="170" r="1.5" fill="#999" />
              {/* 3. Tab Container -> 수직선 아래로 */}
              <line x1="360" y1="250" x2="360" y2="194" stroke="#999" strokeWidth="1.2" />
            </svg>

            {/* Callouts */}
            <div style={{ position: 'absolute', left: '280px', top: '90px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
            <div style={{ position: 'absolute', left: '540px', top: '170px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
            <div style={{ position: 'absolute', left: '360px', top: '250px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>
          </div>

          {/* Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 0' }}>
            {[
              { num: 1, label: 'Active Tab (활성 탭 아이템)' },
              { num: 2, label: 'Inactive Tab (비활성 탭 아이템)' },
              { num: 3, label: 'Tab Container (전체 용기)' },
            ].map(item => (
              <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
                {item.num}. {item.label}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%', textAlign: 'left' }}>
        <div style={{ fontSize: '13px', color: '#888', fontWeight: 'bold', width: '100%', marginBottom: '8px' }}>대시보드 세그먼트 탭 버튼 (Segmented Controls)</div>
        
        {/* 단위 세그먼트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <span style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>단위 필터 탭 (일별 / 주별 / 월별)</span>
          <div style={{ display: 'inline-flex', backgroundColor: '#1e1e1e', padding: '3px', borderRadius: '6px', alignSelf: 'flex-start' }}>
            <span style={{ padding: '6px 16px', color: '#fff', backgroundColor: '#1751D9', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>일별</span>
            <span style={{ padding: '6px 16px', color: '#888', fontSize: '13px', cursor: 'pointer' }}>주별</span>
            <span style={{ padding: '6px 16px', color: '#888', fontSize: '13px', cursor: 'pointer' }}>월별</span>
          </div>
        </div>

        {/* 기간 세그먼트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <span style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>기간 필터 탭 (7일 / 14일 / 30일)</span>
          <div style={{ display: 'inline-flex', backgroundColor: '#1e1e1e', padding: '3px', borderRadius: '6px', alignSelf: 'flex-start' }}>
            <span style={{ padding: '6px 16px', color: '#fff', backgroundColor: '#3471FF', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>7일</span>
            <span style={{ padding: '6px 16px', color: '#888', fontSize: '13px', cursor: 'pointer' }}>14일</span>
            <span style={{ padding: '6px 16px', color: '#888', fontSize: '13px', cursor: 'pointer' }}>30일</span>
          </div>
        </div>

        {/* 지표 세그먼트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <span style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>지표 필터 탭 (활용도 / 평균시간 / 건수)</span>
          <div style={{ display: 'inline-flex', backgroundColor: '#1e1e1e', padding: '3px', borderRadius: '6px', alignSelf: 'flex-start' }}>
            <span style={{ padding: '6px 16px', color: '#fff', backgroundColor: '#1751D9', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>활용도</span>
            <span style={{ padding: '6px 16px', color: '#888', fontSize: '13px', cursor: 'pointer' }}>평균시간</span>
            <span style={{ padding: '6px 16px', color: '#888', fontSize: '13px', cursor: 'pointer' }}>건수</span>
          </div>
        </div>
      </div>
    );
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

function ContentBadgePlayground({ activeSubTab }) {
  const [color, setColor] = useState('accent');
  const [leadingIcon, setLeadingIcon] = useState(true);
  const [trailingIcon, setTrailingIcon] = useState(true);

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
          {/* 배지 컴포넌트 — 중앙 */}
          <div style={{
            position: 'absolute',
            left: '300px',
            top: '156px',
            width: '120px',
            height: '28px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
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
            <div style={{ width: '12px', height: '12px', border: '1.5px solid #a1a1aa', borderRadius: '2px', flexShrink: 0 }} />
            <span style={{ fontWeight: 500, lineHeight: 1 }}>Label</span>
            <span style={{ fontSize: '14px', color: '#a1a1aa', flexShrink: 0, marginLeft: 'auto', lineHeight: 1, userSelect: 'none' }}>×</span>
          </div>

          {/* SVG 직선 */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
          >
            {/* 1. Leading icon -> 수평선 좌측으로 */}
            <line x1="230" y1="170" x2="308" y2="170" stroke="#999" strokeWidth="1.2" />
            {/* 2. Label -> 수직선 위로 */}
            <line x1="360" y1="90" x2="360" y2="150" stroke="#999" strokeWidth="1.2" />
            {/* 3. Trailing icon -> 수평선 우측으로 */}
            <line x1="490" y1="170" x2="412" y2="170" stroke="#999" strokeWidth="1.2" />
            {/* 4. Container -> 수직선 아래로 */}
            <line x1="360" y1="250" x2="360" y2="189" stroke="#999" strokeWidth="1.2" />
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '230px', top: '170px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '360px', top: '90px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '490px', top: '170px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>
          <div style={{ position: 'absolute', left: '360px', top: '250px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>4</div>
        </div>

        {/* Legend — 심플 텍스트, 3열 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Leading icon' },
            { num: 2, label: 'Label' },
            { num: 3, label: 'Trailing icon' },
            { num: 4, label: 'Container' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>
      </div>
    );
  }


  // Interactive Tab Content
  const isAccent = color === 'accent';
  const badgeBg = isAccent ? 'rgba(0, 194, 255, 0.08)' : 'rgba(255, 255, 255, 0.05)';
  const badgeBorder = isAccent ? '1px solid rgba(0, 194, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.2)';
  const badgeColor = isAccent ? '#00C2FF' : '#E5E7EB';
  const iconBorderColor = isAccent ? 'rgba(0, 194, 255, 0.4)' : 'rgba(255, 255, 255, 0.3)';

  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>

      {/* ── Size 섹션 ── */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '20px' }}>Size</div>

        {/* 라이트 카드 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '48px 40px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '96px',
          marginBottom: '16px',
        }}>
          {[
            { label: 'XSmall', h: 20, fs: 11, px: '0 6px',  annotSize: 20 },
            { label: 'Small',  h: 24, fs: 12, px: '0 8px',  annotSize: 22 },
            { label: 'Medium', h: 28, fs: 13, px: '0 10px', annotSize: 24 },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              {/* 컬럼 라벨 */}
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#888' }}>{item.label}</div>

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
                  fontWeight: 500,
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
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 4px rgba(239,68,68,0.4)',
                  border: '1.5px solid #fff',
                  zIndex: 2,
                }}>{item.h}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 설명 */}
        <div style={{ fontSize: '14px', color: '#888', lineHeight: '1.7' }}>
          좌우 사이즈는 자유롭게 커스터마이징하여 사용할 수 있으나{' '}
          <span style={{ color: '#60a5fa', fontWeight: '600' }}>높이는 고정하여 사용합니다.</span>
        </div>
      </div>

      {/* ── Variants 섹션 ── */}
      <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>Variants</div>

      
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Preview Panel */}
        <div style={{ flex: 1.8, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '6px',
            background: badgeBg,
            border: badgeBorder,
            color: badgeColor,
            fontSize: '14px',
            fontWeight: 500,
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
                fontWeight: 'bold',
                opacity: 0.8
              }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', border: `1.5px solid ${badgeColor}`, borderRadius: '1px', opacity: 0.7 }}></span>
              </div>
            )}
            
            <span>Label</span>
            
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
                fontWeight: 'bold',
                opacity: 0.8
              }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', lineHeight: '1' }}>×</span>
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
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px',
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
                    backgroundColor: checked ? '#3471FF' : '#1b1b1d',
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
                {/* Color Option */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Color</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <RadioOption 
                      label="Neutral" 
                      checked={color === 'neutral'} 
                      onChange={() => setColor('neutral')} 
                    />
                    <RadioOption 
                      label="Accent" 
                      checked={color === 'accent'} 
                      onChange={() => setColor('accent')} 
                    />
                  </div>
                </div>

                {/* Leading Icon Option */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Leading icon</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#888', marginBottom: '12px' }}>Trailing icon</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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

function ChipPlayground({ activeSubTab }) {
  const [styleMode, setStyleMode] = useState('outlined'); // 'solid' or 'outlined'
  const [leadingOption, setLeadingOption] = useState('icon'); // 'none', 'icon', 'image'
  const [trailingOption, setTrailingOption] = useState('icon'); // 'none', 'icon', 'image'

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
            <span>보별관제</span>
            {/* Trailing Close slot */}
            <span style={{ fontSize: '14px', color: '#a1a1aa', fontWeight: 'bold', marginLeft: 'auto', userSelect: 'none' }}>×</span>
          </div>

          {/* SVG 직선 */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
          >
            {/* 1. Leading content -> 수평선 좌측으로 */}
            <line x1="210" y1="168" x2="288" y2="168" stroke="#999" strokeWidth="1.2" />
            {/* 2. Label Text -> 수직선 위로 */}
            <line x1="360" y1="90" x2="360" y2="144" stroke="#999" strokeWidth="1.2" />
            {/* 3. Trailing close -> 수평선 우측으로 */}
            <line x1="510" y1="168" x2="424" y2="168" stroke="#999" strokeWidth="1.2" />
            {/* 4. Container -> 수직선 아래로 */}
            <line x1="360" y1="250" x2="360" y2="190" stroke="#999" strokeWidth="1.2" />
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '210px', top: '168px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '360px', top: '90px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '510px', top: '168px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>
          <div style={{ position: 'absolute', left: '360px', top: '250px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>4</div>
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Leading Content' },
            { num: 2, label: 'Label Text' },
            { num: 3, label: 'Trailing Action' },
            { num: 4, label: 'Chip Container' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>
      </div>
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
                    backgroundColor: checked ? '#3471FF' : '#1b1b1d',
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

function AlertPlayground({ activeSubTab }) {
  const [alertType, setAlertType] = useState('warning');
  const [showTitle, setShowTitle] = useState(true);
  const [showClose, setShowClose] = useState(true);
  const [showAction, setShowAction] = useState(true);
  const [customTitle, setCustomTitle] = useState('장비 상태 통신 감지 경고');
  const [customMsg, setCustomMsg] = useState('지점 C의 보행자 감지 카메라에 10초 이상의 레이턴시 지연이 발생하고 있습니다.');

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
          {/* 얼럿 컴포넌트 — 중앙 */}
          <div style={{
            position: 'absolute',
            left: '150px',
            top: '100px',
            width: '420px',
            height: '120px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1.5px solid #e4e4e7',
            borderLeft: '4px solid #F59E0B',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            padding: '16px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            gap: '12px',
            zIndex: 3,
          }}>
            {/* Status Icon (1) */}
            <div style={{ color: '#F59E0B', flexShrink: 0, display: 'flex', alignItems: 'flex-start', marginTop: '2px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            {/* Content 영역 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
              {/* Title (2) */}
              <div style={{ color: '#18181b', fontWeight: 700, fontSize: '14px' }}>교통 정체 감지 알림</div>
              {/* Message (3) */}
              <div style={{ color: '#71717a', fontSize: '12px', lineHeight: '1.4' }}>
                시흥대로 하행 방향 신천역 인근 교차로에서 200m 대기 차량 정체가 감지되었습니다.
              </div>
              {/* Action (4) */}
              <div style={{ marginTop: '4px' }}>
                <button style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid #F59E0B',
                  color: '#b45309',
                  borderRadius: '4px',
                  cursor: 'default',
                  fontWeight: 600
                }}>CCTV 실시간 확인</button>
              </div>
            </div>
            {/* Close Button (5) */}
            <div style={{ color: '#a1a1aa', cursor: 'default', fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>×</div>
          </div>

          {/* SVG 직선 */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
          >
            {/* 1. Status Icon -> 수평선 좌측으로 */}
            <line x1="100" y1="130" x2="174" y2="130" stroke="#999" strokeWidth="1.2" />
            {/* 2. Title Text -> 수직선 위로 */}
            <line x1="270" y1="50" x2="270" y2="116" stroke="#999" strokeWidth="1.2" />
            {/* 3. Message Content -> 수직선 위로 */}
            <line x1="380" y1="50" x2="380" y2="136" stroke="#999" strokeWidth="1.2" />
            {/* 4. Action Button -> 수직선 아래로 */}
            <line x1="260" y1="290" x2="260" y2="206" stroke="#999" strokeWidth="1.2" />
            {/* 5. Close Button -> 수평선 우측으로 */}
            <line x1="620" y1="130" x2="552" y2="130" stroke="#999" strokeWidth="1.2" />
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '100px', top: '130px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '270px', top: '50px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '380px', top: '50px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>
          <div style={{ position: 'absolute', left: '260px', top: '290px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>4</div>
          <div style={{ position: 'absolute', left: '620px', top: '130px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>5</div>
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Status Icon (상태 아이콘)' },
            { num: 2, label: 'Title Text (알림 제목)' },
            { num: 3, label: 'Message Content (본문 설명)' },
            { num: 4, label: 'Action Button (행동 유도 버튼)' },
            { num: 5, label: 'Close Button (닫기 버튼)' }
          ].map(item => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>
      </div>
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
          <div className={`ds-alert-simulated ${alertType}`} style={{ 
            display: 'flex', 
            width: '100%', 
            maxWidth: '480px', 
            background: alertType === 'success' ? 'rgba(16, 185, 129, 0.08)' : 
                        alertType === 'error' ? 'rgba(239, 68, 68, 0.08)' : 
                        alertType === 'warning' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(59, 130, 246, 0.08)',
            border: '1px solid',
            borderColor: alertType === 'success' ? '#10B981' : 
                         alertType === 'error' ? '#EF4444' : 
                         alertType === 'warning' ? '#F59E0B' : '#3B82F6',
            borderLeftWidth: '4px',
            borderRadius: '6px',
            padding: '12px 16px',
            color: '#fff'
          }}>
            <div className="ds-alert-icon" style={{ 
              marginRight: '12px', 
              color: alertType === 'success' ? '#10B981' : 
                     alertType === 'error' ? '#EF4444' : 
                     alertType === 'warning' ? '#F59E0B' : '#3B82F6' 
            }}>
              {getIcon(alertType)}
            </div>
            <div className="ds-alert-content" style={{ flex: 1 }}>
              {showTitle && <div className="ds-alert-title" style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{customTitle}</div>}
              <div className="ds-alert-message" style={{ fontSize: '12px', color: '#ccc', lineHeight: '1.5' }}>{customMsg}</div>
              {showAction && (
                <div style={{ marginTop: '10px' }}>
                  <button className="ds-alert-action-btn" style={{ 
                    padding: '4px 10px', 
                    fontSize: '11px', 
                    backgroundColor: alertType === 'success' ? 'rgba(16, 185, 129, 0.2)' : 
                                      alertType === 'error' ? 'rgba(239, 68, 68, 0.2)' : 
                                      alertType === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid',
                    borderColor: alertType === 'success' ? '#10B981' : 
                                 alertType === 'error' ? '#EF4444' : 
                                 alertType === 'warning' ? '#F59E0B' : '#3B82F6',
                    color: alertType === 'success' ? '#A7F3D0' : 
                           alertType === 'error' ? '#FECACA' : 
                           alertType === 'warning' ? '#FDE68A' : '#BFDBFE',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }} onClick={() => alert(`${alertType.toUpperCase()} action clicked!`)}>
                    실행 동작 (Action)
                  </button>
                </div>
              )}
            </div>
            {showClose && (
              <div className="ds-alert-close-btn" style={{ 
                color: '#888', 
                fontSize: '18px', 
                cursor: 'pointer', 
                lineHeight: '1', 
                marginLeft: '12px' 
              }} onClick={() => alert('Alert closed!')}>
                ×
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

          {/* SVG 직선 (콜아웃 가장자리 → 카드 가장자리로 정확히 연결) */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
          >
            {/* 1. Item -> 좌변 중앙 (카드 좌변 x=180, 세로 중앙 y=170) */}
            <line x1="123" y1="170" x2="180" y2="170" stroke="#999" strokeWidth="1.2" />
            {/* 2. Trigger -> 상단 중앙 (카드 상단 y=90) */}
            <line x1="360" y1="61" x2="360" y2="90" stroke="#999" strokeWidth="1.2" />
            {/* 3. Content -> 하단 중앙 (카드 하단 y=250) */}
            <line x1="360" y1="250" x2="360" y2="279" stroke="#999" strokeWidth="1.2" />
          </svg>

          {/* Callouts (선과 정확히 맞물리는 위치) */}
          <div style={{ position: 'absolute', left: '110px', top: '170px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '360px', top: '48px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '360px', top: '292px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Accordion.Item (항목 컨테이너)' },
            { num: 2, label: 'Accordion.Trigger (트리거 영역)' },
            { num: 3, label: 'Accordion.Content (상세 정보 콘텐츠)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>
      </div>
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
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#3471FF' }}>17개 지점</span>
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
        <span style={{ ...cellName, fontSize: '12px', fontWeight: 600, color: '#3471FF' }}>지점명</span>
        <span style={{ ...cellUsage, fontSize: '12px', fontWeight: 600, color: '#3471FF' }}>연장 활용도</span>
        <span style={{ ...cellTime, fontSize: '12px', fontWeight: 600, color: '#3471FF' }}>평균 연장 시간</span>
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
                position: 'absolute', inset: '-4px -6px', border: '2px dashed #3471FF', borderRadius: '8px',
                pointerEvents: 'none', zIndex: 1010,
              }}>
                <span className="anatomy-badge" style={{ position: 'absolute', left: '-10px', top: '-10px', zIndex: 1020, backgroundColor: '#3471FF', fontSize: '10px', padding: '2px 6px' }}>Item</span>
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
      backgroundColor: '#3a3a3a',
      color: '#fff',
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
          backgroundColor: checked ? '#3471FF' : '#1b1b1d',
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

          {/* SVG 직선 */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
          >
            {/* 1. Container -> 수평선 좌측으로 */}
            <line x1="230" y1="170" x2="324" y2="170" stroke="#999" strokeWidth="1.2" />
            {/* 2. Avatar image -> 수직선 위로 */}
            <line x1="360" y1="70" x2="360" y2="134" stroke="#999" strokeWidth="1.2" />
            {/* 3. Initials fallback -> 대각선 우측 위로 */}
            <line x1="490" y1="130" x2="379" y2="160" stroke="#999" strokeWidth="1.2" />
            <circle cx="379" cy="160" r="1.5" fill="#999" />
            {/* 4. Status indicator -> 수직선 아래로 */}
            <line x1="382" y1="270" x2="382" y2="198" stroke="#999" strokeWidth="1.2" />
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '230px', top: '170px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '360px', top: '70px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '490px', top: '130px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>
          <div style={{ position: 'absolute', left: '382px', top: '270px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>4</div>
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Container (아바타 외곽 영역)' },
            { num: 2, label: 'Avatar image (프로필 이미지)' },
            { num: 3, label: 'Initials fallback (대체 이니셜)' },
            { num: 4, label: 'Status indicator (접속 상태 표시)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>
      </div>
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

          {/* SVG 직선 */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
          >
            {/* 1. Group Container -> 수평선 좌측으로 */}
            <line x1="180" y1="170" x2="270" y2="170" stroke="#999" strokeWidth="1.2" />
            {/* 2. Avatar Item -> 수직선 위로 */}
            <line x1="296" y1="70" x2="296" y2="144" stroke="#999" strokeWidth="1.2" />
            {/* 3. Overlap Gap -> 수직선 아래로 */}
            <line x1="338" y1="270" x2="338" y2="192" stroke="#999" strokeWidth="1.2" />
            {/* 4. Overflow Badge -> 수평선 우측으로 */}
            <line x1="540" y1="170" x2="450" y2="170" stroke="#999" strokeWidth="1.2" />
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '180px', top: '170px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '296px', top: '70px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '338px', top: '270px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>
          <div style={{ position: 'absolute', left: '540px', top: '170px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>4</div>
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Group container (아바타 그룹 용기)' },
            { num: 2, label: 'Avatar item (개별 아바타)' },
            { num: 3, label: 'Overlap gap (중첩 간격)' },
            { num: 4, label: 'Overflow badge (오버플로 배지)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>
      </div>
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
              borderColor: value === opt.value ? '#3471FF' : '#2a2a2a',
              background: 'transparent',
              color: value === opt.value ? '#3471FF' : '#666',
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
          borderColor: value ? '#3471FF' : '#2a2a2a',
          background: 'transparent',
          color: value ? '#3471FF' : '#666',
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
          background: value ? '#3471FF' : '#333',
          border: '1px solid',
          borderColor: value ? '#3471FF' : '#444',
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
  backgroundColor: '#3a3a3a',
  color: '#fff',
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

const calloutStyleSm = {
  ...calloutStyle,
  width: '22px',
  height: '22px',
  fontSize: '10px',
  flexShrink: 0,
};

function CategoryPlayground({ activeSubTab }) {
  const [activeIdx, setActiveIdx] = useState(0);
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
              backgroundColor: idx === activeIdx ? '#1751D9' : 'transparent',
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
      </div>
    );
  }

  const renderTrailingElement = (type) => {
    switch (type) {
      case 'Badge':
        return (
          <div style={{
            padding: '3px 8px',
            backgroundColor: '#3471FF',
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
            backgroundColor: '#3471FF',
            border: '1.5px solid #3471FF',
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
            color: '#3471FF',
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

function ListCardPlayground({ activeSubTab }) {
  const [thumbnail, setThumbnail] = useState(true);
  const [leading, setLeading] = useState(true);
  const [heading, setHeading] = useState('차량 번호판 검지');
  const [caption, setCaption] = useState('2026-05-27 11:30:22');
  const [extraCaption, setExtraCaption] = useState('신뢰도: 98.5% • 속도: 62km/h');
  const [topContent, setTopContent] = useState(true);
  const [trailing, setTrailing] = useState(true);
  const [bottomContent, setBottomContent] = useState(true);

  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
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
            padding: '20px',
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
              background: '#eae6ff',
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
                background: '#eae6ff',
                borderRadius: '2px',
                flexShrink: 0
              }} />

              {/* Thumbnail (2) */}
              <div style={{
                width: '80px',
                height: '60px',
                background: '#f4f4f5',
                borderRadius: '6px',
                border: '1px solid #e4e4e7',
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
                {/* Heading (4) */}
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#18181b' }}>Heading</span>
                {/* Caption (5) */}
                <span style={{ fontSize: '12px', color: '#71717a' }}>Caption</span>
                {/* Extra caption (6) */}
                <span style={{ fontSize: '11px', color: '#a1a1aa' }}>Extra caption</span>
              </div>

              {/* Trailing content (8) */}
              <div style={{
                width: '16px',
                height: '16px',
                background: '#eae6ff',
                borderRadius: '2px',
                flexShrink: 0
              }} />
            </div>

            {/* Bottom Content (9) */}
            <div style={{
              width: '180px',
              height: '12px',
              background: '#eae6ff',
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
            <line x1="224" y1="50" x2="224" y2="136" stroke="#999" strokeWidth="1.2" />
            {/* 3. Leading content */}
            <line x1="100" y1="190" x2="160" y2="190" stroke="#999" strokeWidth="1.2" />
            {/* 4. Heading */}
            <line x1="410" y1="148" x2="350" y2="148" stroke="#999" strokeWidth="1.2" />
            <circle cx="350" cy="148" r="1.5" fill="#999" />
            {/* 5. Caption */}
            <line x1="410" y1="172" x2="330" y2="166" stroke="#999" strokeWidth="1.2" />
            <circle cx="330" cy="166" r="1.5" fill="#999" />
            {/* 6. Extra caption */}
            <line x1="410" y1="196" x2="360" y2="184" stroke="#999" strokeWidth="1.2" />
            <circle cx="360" cy="184" r="1.5" fill="#999" />
            {/* 7. Top content */}
            <line x1="380" y1="50" x2="380" y2="116" stroke="#999" strokeWidth="1.2" />
            {/* 8. Trailing content */}
            <line x1="620" y1="190" x2="560" y2="190" stroke="#999" strokeWidth="1.2" />
            {/* 9. Bottom content */}
            <line x1="440" y1="330" x2="440" y2="264" stroke="#999" strokeWidth="1.2" />
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '360px', top: '330px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '224px', top: '50px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '100px', top: '190px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>
          <div style={{ position: 'absolute', left: '410px', top: '148px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyleSm }}>4</div>
          <div style={{ position: 'absolute', left: '410px', top: '172px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyleSm }}>5</div>
          <div style={{ position: 'absolute', left: '410px', top: '196px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyleSm }}>6</div>
          <div style={{ position: 'absolute', left: '380px', top: '50px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>7</div>
          <div style={{ position: 'absolute', left: '620px', top: '190px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>8</div>
          <div style={{ position: 'absolute', left: '440px', top: '330px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>9</div>
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
          ].map(item => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>
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

            {/* Main Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
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
                  border: '1px solid #333',
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

  if (activeSubTab === 'anatomy') {
    return (
      <div style={{ width: '100%' }}>
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
            padding: '20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 3,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#18181b' }}>Card Header</span>
              <div style={{
                padding: '4px 10px',
                borderRadius: '4px',
                border: '1px solid #1ED45A',
                color: '#1ED45A',
                fontSize: '11px',
                fontWeight: 'bold',
                backgroundColor: 'rgba(30, 212, 90, 0.05)'
              }}>Action</div>
            </div>
            <div style={{
              width: '100%',
              height: '12px',
              background: '#eae6ff',
              borderRadius: '2px',
              marginTop: '10px',
              marginBottom: '10px',
              flexShrink: 0
            }} />
            <div style={{
              flex: 1,
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
          borderColor: '#3471FF',
          color: '#3471FF',
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
          {/* 토스트 컴포넌트 — 중앙 */}
          <div style={{
            position: 'absolute',
            left: '220px',
            top: '146px',
            width: '280px',
            height: '48px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 16px',
            borderRadius: '12px',
            background: '#707580',
            color: '#ffffff',
            boxSizing: 'border-box',
            zIndex: 3,
          }}>
            {/* Leading Icon Slot (Dotted box) */}
            <div style={{
              width: '18px',
              height: '18px',
              border: '1.5px dashed rgba(255, 255, 255, 0.7)',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }} />
            <span style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1 }}>Message</span>
          </div>

          {/* SVG 직선 */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
          >
            {/* 1. Container -> 수직선 위로 */}
            <line x1="360" y1="70" x2="360" y2="144" stroke="#999" strokeWidth="1.2" />
            {/* 2. Leading icon -> 수평선 좌측으로 */}
            <line x1="150" y1="170" x2="235" y2="170" stroke="#999" strokeWidth="1.2" />
            {/* 3. Message -> 수직선 아래로 */}
            <line x1="295" y1="270" x2="295" y2="182" stroke="#999" strokeWidth="1.2" />
          </svg>

          {/* Callouts */}
          <div style={{ position: 'absolute', left: '360px', top: '70px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>1</div>
          <div style={{ position: 'absolute', left: '150px', top: '170px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>2</div>
          <div style={{ position: 'absolute', left: '295px', top: '270px', transform: 'translate(-50%, -50%)', zIndex: 4, ...calloutStyle }}>3</div>
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Container (컨테이너)' },
            { num: 2, label: 'Leading icon (좌측 아이콘)' },
            { num: 3, label: 'Message (메시지)' }
          ].map(item => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>
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
            gap: '10px',
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '10px 16px',
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
            <circle cx="90" cy="55" r="7" fill={activeArea === 'cctv' ? '#3471FF' : '#1751D9'} style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setActiveArea('cctv')} />
            <circle cx="150" cy="125" r="7" fill={activeArea === 'cctv' ? '#3471FF' : '#1751D9'} style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setActiveArea('cctv')} />
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
            <div key={a.id} onClick={() => setActiveArea(a.id)} style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', border: '1px solid', backgroundColor: activeArea === a.id ? 'rgba(23,81,217,0.1)' : '#1e1e1e', borderColor: activeArea === a.id ? '#1751D9' : '#2e2e2e', transition: 'all 0.2s' }}>
              <h4 style={{ color: activeArea === a.id ? '#3471FF' : '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 4px 0' }}>{a.title}</h4>
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
                    <rect x="80" y="165" width="50" height="30" rx="3" fill="none" stroke="#1751D9" strokeWidth="2" />
                    <text x="80" y="160" fill="#1751D9" fontSize="10" fontWeight="bold">승용차 98%</text>
                    <rect x="180" y="155" width="45" height="28" rx="3" fill="none" stroke="#1751D9" strokeWidth="2" />
                    <text x="180" y="150" fill="#1751D9" fontSize="10" fontWeight="bold">승용차 94%</text>
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
            const barColor = isDanger ? '#FF6363' : isWarning ? '#FFA938' : '#1751D9';
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
            <button onClick={simulateTraffic} style={{ width: '100%', padding: '10px 14px', border: '1px solid #1751D9', background: 'transparent', color: '#3471FF', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s' }}>
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
                    <div style={{ position: 'absolute', top: '-60px', backgroundColor: '#000', border: '1px solid #1751D9', color: '#fff', borderRadius: '4px', padding: '6px 8px', fontSize: '11px', whiteSpace: 'nowrap', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
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
                        ? 'linear-gradient(to top, #3471FF, #1751D9)'
                        : 'linear-gradient(to top, rgba(23,81,217,0.8), rgba(23,81,217,0.3))',
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
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#1751D9' }} />
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
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#1e1e1e', padding: '10px 14px', borderRadius: '8px', border: '1px solid #2e2e2e', borderLeft: `4px solid ${item.severity === 'danger' ? '#FF6363' : item.severity === 'warning' ? '#FFA938' : '#3471FF'}` }}>
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
            <button onClick={addDetection} style={{ width: '100%', padding: '10px 14px', border: 'none', background: '#1751D9', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
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

          <div style={{ zIndex: 3, width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#1751D9', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px #1751D9' }}>
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
                      <button onClick={() => resolveEvent(ev.id)} style={{ padding: '2px 6px', border: '1px solid #1751D9', background: 'transparent', color: '#3471FF', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
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
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#1751D9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', boxShadow: '0 0 16px rgba(23,81,217,0.4)' }}>
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
                <button onClick={triggerActuation} style={{ width: '100%', padding: '10px 14px', border: 'none', background: '#1751D9', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
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
                    backgroundColor: broadcastState ? '#3471FF' : '#555',
                    borderRadius: '2.5px',
                    transition: 'height 0.15s ease'
                  }} />
                );
              })}
            </div>
          </div>

          {broadcastState && (
            <div style={{ backgroundColor: 'rgba(23,81,217,0.1)', border: '1px solid #1751D9', borderRadius: '4px', padding: '10px', textAlign: 'center', color: '#3471FF', fontSize: '12px', fontWeight: 'bold' }}>
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
            <input type="range" min="30" max="95" value={volume} onChange={e => setVolume(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#1751D9', cursor: 'pointer' }} />
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

  const calloutStyle = {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#18181b',
    color: '#fff',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

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
            <FigCheckCircle size={18} color="#00A9FF" />
            <span>Checkmark</span>
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
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 0' }}>
          {[
            { num: 1, label: 'Control (선택 컨트롤)' },
            { num: 2, label: 'Label (텍스트 라벨)' },
          ].map(item => (
            <div key={item.num} style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {item.num}. {item.label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Interactive Tab Content
  return (
    <div style={{ width: '100%', textAlign: 'left', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
      <div style={{ display: 'flex', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', height: '360px' }}>
        {/* Left: Preview Panel */}
        <div style={{ flex: 1.8, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
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
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
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
              <FigCheckCircle
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

  const buttonColor = color === 'primary' ? '#3471FF' : '#8e8e93';

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


