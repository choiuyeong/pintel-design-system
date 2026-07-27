import { Suspense } from 'react';
import InteractiveClump3D from './InteractiveClump3D';
import { T } from '../data/tokens';
import { TIERS, COMPONENT_DOCS } from '../data/components';

// Get Started 탭 가이드 목록 — 사이드바(TIERS['get-started'])와 동일 출처로 카드 렌더.
const GUIDE_ITEMS = (TIERS['get-started']?.categories || []).flatMap((cat) => cat.children || []);

const skeletonStyle = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.65; }
    50% { opacity: 1; }
  }
  .skeleton-hero {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(120% 90% at 50% 0%, #1a1a21 0%, #131317 50%, #0e0e11 100%);
    border-radius: 24px;
    z-index: 5;
    overflow: hidden;
  }
  .skeleton-gem {
    animation: pulse 1.6s infinite ease-in-out;
    filter: drop-shadow(0 0 18px rgba(0, 102, 255, 0.35));
  }
  .skeleton-text-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 6;
    pointer-events: none;
  }
  .skeleton-title {
    width: 55%;
    height: 44px;
    background: rgba(15, 15, 17, 0.07);
    border-radius: 8px;
    animation: pulse 1.5s infinite ease-in-out;
  }
  .skeleton-sphere {
    position: absolute;
    border-radius: 50%;
    background: rgba(195, 218, 242, 0.4);
    animation: pulse 1.5s infinite ease-in-out;
    z-index: 7;
    pointer-events: none;
  }
`;

function HeroSkeleton() {
  return (
    <div className="skeleton-hero">
      <style dangerouslySetInnerHTML={{ __html: skeletonStyle }} />
      {/* 파랑색 보석 실루엣 하나 — 로딩 플레이스홀더(브랜드 히어로 보석 암시) */}
      <svg className="skeleton-gem" width="120" height="120" viewBox="0 0 100 100" fill="none">
        <polygon points="50,8 84,32 70,90 30,90 16,32" fill={T.primary} fillOpacity="0.42" />
        <g stroke={T.primaryStrong} strokeOpacity="0.55" strokeWidth="1.3" strokeLinejoin="round">
          <polygon points="50,8 84,32 70,90 30,90 16,32" fill="none" />
          <line x1="50" y1="8" x2="50" y2="90" />
          <line x1="16" y1="32" x2="84" y2="32" />
          <line x1="16" y1="32" x2="50" y2="90" />
          <line x1="84" y1="32" x2="50" y2="90" />
        </g>
      </svg>
    </div>
  );
}

export default function GetStarted({ onNavigate }) {
  return (
    <div className="ds-main">
      <div className="fade-in">
        {/* Hero Section */}
        <section style={{ marginBottom: '100px', borderBottom: '1px solid #2e2e2e', paddingBottom: '80px' }}>
          <h1 className="doc-title" style={{ fontSize: '72px', marginBottom: '24px', fontWeight: 700, color: '#ffffff' }}>
            Designing <br /> Better Together
          </h1>
          <p style={{ fontSize: '18px', color: '#aaaaaa', lineHeight: 1.6, maxWidth: '800px', marginBottom: '40px', fontWeight: 400 }}>
            핀텔 디자인 시스템은 스마트 시티 및 교통 서비스의 일관된 사용자 경험을 위해 설계되었습니다.
            <br />
            원칙과 가이드를 준수하여 디자인과 개발 환경을 구축하세요.
          </p>
          <div style={{
            width: '100%',
            height: '450px',
            borderRadius: '24px',
            overflow: 'hidden',
            position: 'relative',
            background: '#1e1e1e', // premium dark card-panel background
            border: '1px solid #2e2e2e', // matching dark border
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
          }}>
            {/* WebGL 3D Canvas container */}
            <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
              <Suspense fallback={<HeroSkeleton />}>
                <InteractiveClump3D />
              </Suspense>
            </div>
            
            {/* Minimalist 3D Scene HTML Overlays */}
            <div style={{
              position: 'absolute',
              top: '24px',
              left: '24px',
              fontFamily: 'monospace',
              fontSize: '11px',
              color: '#8e8e93',
              letterSpacing: '0.1em',
              pointerEvents: 'none',
              zIndex: 2
            }}>
              PINTEL D.S. / STAGE 02
            </div>
            
            <div style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              fontFamily: 'monospace',
              fontSize: '11px',
              color: '#8e8e93',
              letterSpacing: '0.1em',
              pointerEvents: 'none',
              zIndex: 2
            }}>
              40+ INTERACTIVE NODES
            </div>

            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              fontFamily: 'monospace',
              fontSize: '11px',
              color: '#8e8e93',
              letterSpacing: '0.05em',
              pointerEvents: 'none',
              zIndex: 2
            }}>
              PHYSICS ENGINE SIMULATION
            </div>

            <div style={{
              position: 'absolute',
              bottom: '24px',
              right: '24px',
              fontFamily: 'monospace',
              fontSize: '11px',
              color: '#00A3FF',
              fontWeight: 600,
              letterSpacing: '0.05em',
              pointerEvents: 'none',
              zIndex: 2
            }}>
              CLICK & DRAG TO CLUMP
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '80px' }}>
          <h2 className="doc-section-title" style={{ color: '#ffffff' }}>소개 (Introduction)</h2>
          <p className="doc-description" style={{ color: '#aaaaaa' }}>
            핀텔공방은 스마트 시티 및 교통 서비스의 디자인 시스템입니다.
            <br />
            일관된 사용자 경험을 제공하고, 디자이너와 개발자 간의 협업 효율을 높이기 위해 만들어졌습니다.
          </p>
        </section>

        <section style={{ marginBottom: '80px' }}>
          <h2 className="doc-section-title" style={{ color: '#ffffff' }}>시스템 구조 (Structure)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { title: 'Foundations', desc: '색상, 타이포그래피, 간격 등 시스템의 근간이 되는 디자인 토큰입니다.', art: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ fontSize: '44px', fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>Aa</span>
                    <span style={{ fontSize: '30px', fontWeight: 500, color: '#9aa0a8', lineHeight: 1 }}>가</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {/* eslint-disable-next-line pintel/prefer-color-token -- 팔레트 견본 표시: 색상 값 자체를 보여주는 용도 */}
                    {['#0066FF', '#1ED45A', '#FFA938', '#FF6363', '#00A9FF'].map((c) => (
                      <span key={c} style={{ width: '26px', height: '26px', borderRadius: '8px', background: c, boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '150px' }}>
                    {[52, 80, 108, 140].map((w) => (
                      <span key={w} style={{ height: '6px', width: `${w}px`, borderRadius: '3px', background: '#333' }} />
                    ))}
                  </div>
                </div>
              ) },
              { title: 'Components', desc: '버튼, 폼, 테이블 등 실제 화면 구성에 사용되는 재사용 UI 컴포넌트입니다.', art: (
                <div style={{ width: '100%', maxWidth: '224px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ height: '30px', borderRadius: '6px', background: '#1a1a1a', border: '1px solid #333', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                    <span style={{ fontSize: '11px', color: '#666' }}>텍스트 입력</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: T.primary, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                      </span>
                      <span style={{ fontSize: '12px', color: '#ccc' }}>선택</span>
                    </span>
                    <span style={{ height: '30px', padding: '0 16px', borderRadius: '6px', background: T.primary, color: '#fff', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>확인</span>
                  </div>
                  <div style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid #333' }}>
                    <div style={{ display: 'flex', height: '22px', background: '#242424' }}>
                      <span style={{ flex: 1, borderRight: '1px solid #333' }} /><span style={{ flex: 1 }} />
                    </div>
                    {[0, 1].map((r) => (
                      <div key={r} style={{ display: 'flex', height: '20px', borderTop: '1px solid #2a2a2a' }}>
                        <span style={{ flex: 1, borderRight: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', padding: '0 8px' }}><span style={{ width: '40%', height: '5px', borderRadius: '3px', background: '#3a3a3a' }} /></span>
                        <span style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 8px' }}><span style={{ width: '55%', height: '5px', borderRadius: '3px', background: '#3a3a3a' }} /></span>
                      </div>
                    ))}
                  </div>
                </div>
              ) },
            ].map((item) => (
              <div key={item.title} style={{
                borderRadius: '24px',
                border: '1px solid #2e2e2e', background: '#1e1e1e',
                boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                boxSizing: 'border-box'
              }}
              onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)'; e.currentTarget.style.borderColor = T.primary; }}
              onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#2e2e2e'; }}
              >
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  borderRadius: '16px', 
                  background: '#121212', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '24px',
                  boxSizing: 'border-box',
                  marginBottom: '24px'
                }}>
                  {item.art}
                </div>
                <div style={{ padding: '0 8px 8px' }}>
                  <h3 style={{
                    fontSize: '22px', fontWeight: 600, color: '#ffffff', marginBottom: '12px',
                  }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: '#aaaaaa', lineHeight: 1.6, fontWeight: 400 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '80px' }}>
          <h2 className="doc-section-title" style={{ color: '#ffffff' }}>사용법 (Usage)</h2>
          <div style={{
            background: '#1e1e1e', borderRadius: '16px', padding: '40px',
            border: '1px solid #2e2e2e'
          }}>
            <p style={{ fontSize: '16px', color: '#eeeeee', marginBottom: '24px', fontWeight: 500 }}>
              상단 헤더의 카테고리를 선택하여 원하는 가이드라인으로 이동하세요.
            </p>
            <div style={{ display: 'flex', gap: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>Foundations</span>
                <span style={{ fontSize: '14px', color: '#aaaaaa' }}>디자인 시스템의 기본 원칙과 토큰</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>Components</span>
                <span style={{ fontSize: '14px', color: '#aaaaaa' }}>상세 컴포넌트 스펙 및 코드</span>
              </div>
            </div>
          </div>
        </section>

        {GUIDE_ITEMS.length > 0 && (
          <section style={{ marginBottom: '80px' }}>
            <h2 className="doc-section-title" style={{ color: '#ffffff' }}>가이드 (Guides)</h2>
            <p className="doc-description" style={{ color: '#aaaaaa', marginBottom: '24px' }}>
              디자인 시스템을 실무에 적용할 때 참고하는 가이드 문서입니다. 카드를 눌러 이동하세요.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {GUIDE_ITEMS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate && onNavigate(item.id)}
                  style={{
                    borderRadius: '16px', border: '1px solid #2e2e2e', background: '#1e1e1e',
                    padding: '24px', cursor: 'pointer', transition: 'all 0.3s ease',
                    display: 'flex', flexDirection: 'column', gap: '10px',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 102, 255, 0.12)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = '#2e2e2e'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>{item.name}</span>
                  <span style={{ fontSize: '14px', color: '#aaaaaa', lineHeight: 1.6 }}>
                    {COMPONENT_DOCS[item.id]?.description || ''}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section style={{ marginBottom: '100px' }}>
          <h2 className="doc-section-title" style={{ color: '#ffffff' }}>기술 스택 (Tech Stack)</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { name: 'React', bg: '#1e293b', color: '#60a5fa' },
              { name: 'Vite', bg: '#2e1065', color: '#c084fc' },
              { name: 'Pretendard GOV', bg: '#1e293b', color: '#94a3b8' },
              { name: 'Leaflet', bg: '#064e3b', color: '#4ade80' },
              { name: 'Vanilla CSS', bg: '#172554', color: '#60a5fa' }
            ].map((tech) => (
              <span key={tech.name} style={{
                padding: '10px 24px', 
                background: tech.bg, 
                borderRadius: '30px',
                fontSize: '15px', 
                color: tech.color, 
                fontWeight: 600,
                border: `1px solid ${tech.color}33`
              }}>{tech.name}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
