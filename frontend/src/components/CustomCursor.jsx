import React, { useEffect, useRef, useState } from 'react';

// Multi-color gradient combinations for cursor
export const CURSOR_COMBINATIONS = [
  {
    id: 'aurora',
    name: 'Aurora Cyan-Mint',
    gradient: 'linear-gradient(135deg, #00f2fe 0%, #00ff9d 100%)',
    primaryHex: '#00f2fe',
    secondaryHex: '#00ff9d',
    glowRgb: '0, 242, 254',
    dotShadow: '0 0 10px #00f2fe, 0 0 20px #00ff9d',
  },
  {
    id: 'synthwave',
    name: 'Synthwave Magenta-Purple',
    gradient: 'linear-gradient(135deg, #ff007f 0%, #7928ca 100%)',
    primaryHex: '#ff007f',
    secondaryHex: '#7928ca',
    glowRgb: '255, 0, 127',
    dotShadow: '0 0 10px #ff007f, 0 0 20px #7928ca',
  },
  {
    id: 'solar',
    name: 'Solar Flare Orange-Rose',
    gradient: 'linear-gradient(135deg, #ff8c00 0%, #ff2a7e 100%)',
    primaryHex: '#ff8c00',
    secondaryHex: '#ff2a7e',
    glowRgb: '255, 140, 0',
    dotShadow: '0 0 10px #ff8c00, 0 0 20px #ff2a7e',
  },
  {
    id: 'quantum',
    name: 'Quantum Blue-Indigo',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
    primaryHex: '#38bdf8',
    secondaryHex: '#6366f1',
    glowRgb: '56, 189, 248',
    dotShadow: '0 0 10px #38bdf8, 0 0 20px #6366f1',
  },
  {
    id: 'cosmic',
    name: 'Cosmic Lime-Teal',
    gradient: 'linear-gradient(135deg, #d5fa78 0%, #06b6d4 100%)',
    primaryHex: '#d5fa78',
    secondaryHex: '#06b6d4',
    glowRgb: '213, 250, 120',
    dotShadow: '0 0 10px #d5fa78, 0 0 20px #06b6d4',
  },
  {
    id: 'invert',
    name: 'Inverted Spotlight',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
    primaryHex: '#ffffff',
    secondaryHex: '#ffffff',
    glowRgb: '255, 255, 255',
    dotShadow: '0 0 10px #ffffff, 0 0 20px rgba(255,255,255,0.8)',
    isInvert: true,
  },
];

export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);

  const ringPos = useRef({ x: -200, y: -200 });
  const dotPos  = useRef({ x: -200, y: -200 });
  const glowPos = useRef({ x: -200, y: -200 });
  const target  = useRef({ x: -200, y: -200 });
  const rafId   = useRef(null);

  const [mode, setMode] = useState('default'); // 'default' | 'hover' | 'text' | 'click'
  const [ripples, setRipples] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedCombo, setSelectedCombo] = useState(() => {
    return localStorage.getItem('indic_cursor_combo') || 'aurora';
  });

  // lerp helper
  const lerp = (a, b, t) => a + (b - a) * t;

  // Active color combo object
  const activeCombo = CURSOR_COMBINATIONS.find(c => c.id === selectedCombo) || CURSOR_COMBINATIONS[0];

  useEffect(() => {
    // Hide default cursor on desktop, allow pointer fallback on coarse touch screens
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    document.documentElement.style.cursor = 'none';

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onDown = (e) => {
      setMode('click');
      const id = Date.now() + Math.random();
      setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 650);
    };

    const onUp = () => {
      setMode(prev => (prev === 'click' ? 'default' : prev));
    };

    const onOver = (e) => {
      const isText = e.target.matches('input, textarea, [contenteditable="true"]');
      const isBtn  = !!e.target.closest('button, a, [role="button"], .pill-tab, label, input[type="checkbox"], input[type="radio"]');
      if (isText)      setMode('text');
      else if (isBtn)  setMode('hover');
      else             setMode('default');
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth physics loop
    const loop = () => {
      const { x: tx, y: ty } = target.current;

      dotPos.current.x  = lerp(dotPos.current.x,  tx, 0.88);
      dotPos.current.y  = lerp(dotPos.current.y,  ty, 0.88);

      ringPos.current.x = lerp(ringPos.current.x, tx, 0.16);
      ringPos.current.y = lerp(ringPos.current.y, ty, 0.16);

      glowPos.current.x = lerp(glowPos.current.x, tx, 0.08);
      glowPos.current.y = lerp(glowPos.current.y, ty, 0.08);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowPos.current.x}px, ${glowPos.current.y}px)`;
      }

      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  const handleSelectCombo = (comboId) => {
    setSelectedCombo(comboId);
    localStorage.setItem('indic_cursor_combo', comboId);
  };

  // ── Sleek, compact dimensions per mode ──────────────────────────────────────
  const cfg = {
    default: {
      ringW: 24, ringH: 24,
      ringBg: 'transparent',
      ringRadius: '50%',
      dotW: 5, dotH: 5,
      dotBg: activeCombo.primaryHex,
      dotRadius: '50%',
      dotShadow: activeCombo.dotShadow,
      glowOpacity: 0.18,
      glowSize: 64,
    },
    hover: {
      ringW: 36, ringH: 36,
      ringBg: `rgba(${activeCombo.glowRgb}, 0.15)`,
      ringRadius: '50%',
      dotW: 4, dotH: 4,
      dotBg: activeCombo.secondaryHex,
      dotRadius: '50%',
      dotShadow: activeCombo.dotShadow,
      glowOpacity: 0.30,
      glowSize: 84,
    },
    text: {
      ringW: 2, ringH: 18,
      ringBg: activeCombo.primaryHex,
      ringRadius: '1px',
      dotW: 0, dotH: 0,
      dotBg: 'transparent',
      dotRadius: '50%',
      dotShadow: 'none',
      glowOpacity: 0.0,
      glowSize: 40,
    },
    click: {
      ringW: 16, ringH: 16,
      ringBg: `rgba(${activeCombo.glowRgb}, 0.32)`,
      ringRadius: '50%',
      dotW: 8, dotH: 8,
      dotBg: '#ffffff',
      dotRadius: '50%',
      dotShadow: `0 0 14px #ffffff, ${activeCombo.dotShadow}`,
      glowOpacity: 0.40,
      glowSize: 64,
    },
  };

  const c = cfg[mode] || cfg.default;

  return (
    <>
      {/* ── Ambient compact glow blob (slow lag) ── */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: `${c.glowSize}px`,
          height: `${c.glowSize}px`,
          marginLeft: `-${c.glowSize / 2}px`,
          marginTop:  `-${c.glowSize / 2}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${activeCombo.glowRgb}, 0.28) 0%, transparent 70%)`,
          opacity: isVisible ? c.glowOpacity : 0,
          pointerEvents: 'none',
          zIndex: 99996,
          willChange: 'transform, opacity',
          transition: 'opacity 0.3s ease, width 0.3s ease, height 0.3s ease',
        }}
      />

      {/* ── Outer ring with gradient border ── */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width:  `${c.ringW}px`,
          height: `${c.ringH}px`,
          marginLeft: `-${c.ringW / 2}px`,
          marginTop:  `-${c.ringH / 2}px`,
          borderRadius: c.ringRadius,
          backgroundColor: c.ringBg,
          padding: '1.5px', // Creates the border thickness for gradient
          background: activeCombo.gradient,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: isVisible ? 1 : 0,
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          mixBlendMode: activeCombo.isInvert ? 'difference' : (mode === 'hover' ? 'screen' : 'normal'),
          boxShadow: `0 0 10px rgba(${activeCombo.glowRgb}, 0.4)`,
          transition: [
            'width 0.24s cubic-bezier(0.34, 1.56, 0.64, 1)',
            'height 0.24s cubic-bezier(0.34, 1.56, 0.64, 1)',
            'border-radius 0.2s ease',
            'background-color 0.2s ease',
            'opacity 0.2s ease',
          ].join(', '),
        }}
      />

      {/* ── Inner precision dot ── */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width:  `${c.dotW}px`,
          height: `${c.dotH}px`,
          marginLeft: `-${c.dotW / 2}px`,
          marginTop:  `-${c.dotH / 2}px`,
          background: activeCombo.gradient,
          borderRadius: c.dotRadius,
          boxShadow: c.dotShadow,
          opacity: isVisible ? 1 : 0,
          pointerEvents: 'none',
          zIndex: 100000,
          willChange: 'transform',
          transition: [
            'width 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
            'height 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
            'opacity 0.2s ease',
          ].join(', '),
        }}
      />

      {/* ── Click ripple wave bursts ── */}
      {ripples.map(r => (
        <div
          key={r.id}
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '4px', height: '4px',
            marginLeft: `${r.x - 2}px`,
            marginTop:  `${r.y - 2}px`,
            borderRadius: '50%',
            background: activeCombo.gradient,
            pointerEvents: 'none',
            zIndex: 99998,
            animation: 'cursorRipple 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        />
      ))}

      {/* ── Quick Cursor Color Combination Bar (Floating Bottom-Right) ── */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99990,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'rgba(17, 19, 24, 0.88)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '24px',
        padding: '6px 14px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(16px)',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: '700',
          fontFamily: 'JetBrains Mono, monospace',
          color: '#9ca3af',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          marginRight: '2px',
        }}>
          Gradient Combo:
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {CURSOR_COMBINATIONS.map(cCombo => (
            <button
              key={cCombo.id}
              onClick={() => handleSelectCombo(cCombo.id)}
              title={cCombo.name}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: cCombo.gradient,
                border: selectedCombo === cCombo.id ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.25)',
                cursor: 'pointer',
                boxShadow: selectedCombo === cCombo.id ? `0 0 12px ${cCombo.primaryHex}` : 'none',
                transform: selectedCombo === cCombo.id ? 'scale(1.3)' : 'scale(1)',
                transition: 'transform 0.2s ease, border 0.2s ease, box-shadow 0.2s ease',
                padding: 0,
                outline: 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Global cursor style + keyframe ── */}
      <style>{`
        *, *::before, *::after { cursor: none !important; }

        @keyframes cursorRipple {
          0%   { transform: scale(1);  opacity: 0.9; }
          100% { transform: scale(8); opacity: 0; }
        }
      `}</style>
    </>
  );
}
