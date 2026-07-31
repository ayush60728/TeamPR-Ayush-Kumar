import React from 'react';
import { Users } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenConsole }) {
  return (
    <header style={{
      backgroundColor: '#0a0a0a',
      borderBottom: '1px solid #1f2229',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.75rem 1.25rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {/* Brand Logo & Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('playground')}>
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#d5fa78',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '1.15rem',
            color: '#0a0a0a',
            fontFamily: 'Space Grotesk, sans-serif',
            flexShrink: 0
          }}>
            I
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: '800',
                fontSize: '1.15rem',
                color: '#ffffff',
                letterSpacing: '-0.02em'
              }}>
                IndicDetect
              </span>
              <span style={{
                display: 'inline-block',
                padding: '2px 5px',
                borderRadius: '4px',
                backgroundColor: '#1f2937',
                color: '#d5fa78',
                fontSize: '0.625rem',
                fontWeight: '700',
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                v2.0
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button 
            onClick={() => setActiveTab('playground')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'playground' ? '#d5fa78' : '#9ca3af',
              fontSize: '0.875rem',
              fontWeight: activeTab === 'playground' ? '700' : '500',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
          >
            Playground
          </button>

          <button 
            onClick={() => setActiveTab('architecture')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'architecture' ? '#d5fa78' : '#9ca3af',
              fontSize: '0.875rem',
              fontWeight: activeTab === 'architecture' ? '700' : '500',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
          >
            Architecture
          </button>

          <button 
            onClick={() => setActiveTab('code-switching')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'code-switching' ? '#d5fa78' : '#9ca3af',
              fontSize: '0.875rem',
              fontWeight: activeTab === 'code-switching' ? '700' : '500',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
          >
            Code-Switching
          </button>

          <button 
            onClick={() => setActiveTab('benchmarks')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'benchmarks' ? '#d5fa78' : '#9ca3af',
              fontSize: '0.875rem',
              fontWeight: activeTab === 'benchmarks' ? '700' : '500',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
          >
            Benchmarks
          </button>
        </nav>

        {/* Action Button: Info Circle Icon Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={onOpenConsole}
            title="Meet our Developers"
            style={{
              backgroundColor: '#121212',
              color: '#d5fa78',
              border: '1px solid #333333',
              borderRadius: '8px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.8rem',
              fontWeight: '700',
              fontFamily: 'Space Grotesk, sans-serif',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#d5fa78';
              e.currentTarget.style.color = '#0a0a0a';
              e.currentTarget.style.borderColor = '#d5fa78';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#121212';
              e.currentTarget.style.color = '#d5fa78';
              e.currentTarget.style.borderColor = '#333333';
            }}
          >
            <Users size={14} />
            Meet our Developers
          </button>
        </div>
      </div>
    </header>
  );
}
