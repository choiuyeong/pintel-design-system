import { Suspense } from 'react';
import InteractiveClump3D from './InteractiveClump3D';

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
    background: linear-gradient(90deg, #e8ecf3 25%, #f4f6fa 50%, #e8ecf3 75%);
    background-size: 200% 100%;
    animation: shimmer 1.8s infinite linear;
    border-radius: 24px;
    z-index: 5;
    overflow: hidden;
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
      <div className="skeleton-text-container">
        <div className="skeleton-title" />
      </div>
      <div className="skeleton-sphere" style={{ width: '70px', height: '70px', top: '30%', left: '22%', animationDelay: '0.1s' }} />
      <div className="skeleton-sphere" style={{ width: '45px', height: '45px', top: '58%', left: '72%', animationDelay: '0.3s' }} />
      <div className="skeleton-sphere" style={{ width: '85px', height: '85px', top: '40%', left: '46%', animationDelay: '0.5s' }} />
      <div className="skeleton-sphere" style={{ width: '55px', height: '55px', top: '18%', left: '58%', animationDelay: '0.7s' }} />
    </div>
  );
}

export default function GetStarted() {
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
              { title: 'Foundations', desc: '색상, 타이포그래피, 간격 등 시스템의 근간이 되는 디자인 토큰입니다.', img: '/foundations_banner_light.png' },
              { title: 'Components', desc: '버튼, 폼, 테이블 등 실제 화면 구성에 사용되는 재사용 UI 컴포넌트입니다.', img: '/components_banner_light.png' },
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
              onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)'; e.currentTarget.style.borderColor = '#1751D9'; }}
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
                  <img src={item.img} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
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
