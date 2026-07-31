import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ArrowRight, Cpu, CheckCircle2, Zap } from 'lucide-react';

export default function Hero({ onExplorePlayground, onOpenConsole }) {
  const heroRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-hero-title',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
      );
      gsap.fromTo(
        '.gsap-hero-badge',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.05 }
      );
      gsap.fromTo(
        '.gsap-hero-copy',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.25 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero-canvas" style={{
      padding: '4.5rem 2rem 5.5rem 2rem',
      borderBottom: '2px solid #0a0a0a'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '4rem',
        alignItems: 'center'
      }}>
        {/* Left Column: Huge Neo-Brutalist Headline */}
        <div>
          <div className="gsap-hero-badge" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#0a0a0a',
            color: '#d5fa78',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: '800',
            fontFamily: 'JetBrains Mono, monospace',
            marginBottom: '1.5rem',
            letterSpacing: '0.05em',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <Zap size={14} fill="#d5fa78" className="pulse-glow" />
            DUAL-BRANCH ROUTING ENGINE (v2.0)
          </div>

          <h1 className="gsap-hero-title" style={{
            fontFamily: 'Space Grotesk, Syne, sans-serif',
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: '800',
            lineHeight: 1.05,
            color: '#0a0a0a',
            letterSpacing: '-0.03em',
            marginBottom: '1.75rem'
          }}>
            Detect AI text in English &amp; Hinglish without false positives
          </h1>

          {/* Quick Stats Pill Row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.25rem',
            marginTop: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '700', color: '#0a0a0a' }}>
              <CheckCircle2 size={18} fill="#0a0a0a" stroke="#d5fa78" />
              <span>94.8% Hinglish F1-Score</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '700', color: '#0a0a0a' }}>
              <CheckCircle2 size={18} fill="#0a0a0a" stroke="#d5fa78" />
              <span>Dual RoBERTa Routing</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '700', color: '#0a0a0a' }}>
              <CheckCircle2 size={18} fill="#0a0a0a" stroke="#d5fa78" />
              <span>Code-Switch Telemetry</span>
            </div>
          </div>
        </div>

        {/* Right Column: Paragraph Copy & CTA Buttons with Framer Motion */}
        <div className="gsap-hero-copy" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1.5rem'
        }}>
          <p style={{
            fontSize: '1.25rem',
            lineHeight: 1.5,
            color: '#171717',
            fontWeight: '500',
            fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>
            Standard AI detectors produce <b>over 40% false positives</b> on Hinglish and code-mixed Indian social text. 
            IndicDetect wraps state-of-the-art dual-branch <b>RoBERTa</b> &amp; <b>HingRoBERTa</b> classifiers with real-time heuristic language routing to inspect code-switching ratios under one roof.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '0.5rem'
          }}>
            <motion.button 
              onClick={onExplorePlayground}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                backgroundColor: '#0a0a0a',
                color: '#ffffff',
                border: '2px solid #0a0a0a',
                borderRadius: '8px',
                padding: '0.95rem 2.2rem',
                fontWeight: '800',
                fontSize: '1.05rem',
                fontFamily: 'Space Grotesk, sans-serif',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}
            >
              <span>Try Playground</span>
              <ArrowRight size={18} />
            </motion.button>

            <motion.button 
              onClick={onOpenConsole}
              whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.85)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.55)',
                color: '#0a0a0a',
                border: '2px solid rgba(0,0,0,0.35)',
                borderRadius: '8px',
                padding: '0.95rem 1.75rem',
                fontWeight: '700',
                fontSize: '1rem',
                fontFamily: 'Space Grotesk, sans-serif',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            >
              Know About The Developers
            </motion.button>
          </div>

          {/* Micro Card Feature Callout */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              marginTop: '1rem',
              padding: '1.25rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(255,255,255,0.75)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#0a0a0a', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', marginBottom: '0.6rem', letterSpacing: '0.06em' }}>
                🤗 Base Models · Hugging Face Hosted
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(213,250,120,0.15)', borderRadius: '6px', padding: '5px 10px', border: '1px solid rgba(213,250,120,0.35)' }}>
                  <Cpu size={14} color='#0a0a0a' style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0a0a0a', fontFamily: 'JetBrains Mono, monospace' }}>l3cube-pune/hing-roberta</div>
                    <div style={{ fontSize: '0.72rem', color: '#333', fontWeight: '500' }}>Hinglish branch · code-mixed text</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '6px', padding: '5px 10px', border: '1px solid rgba(0,0,0,0.12)' }}>
                  <Cpu size={14} color='#0a0a0a' style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0a0a0a', fontFamily: 'JetBrains Mono, monospace' }}>roberta-base</div>
                    <div style={{ fontSize: '0.72rem', color: '#333', fontWeight: '500' }}>English branch · pure English text</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
