import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, AlertCircle, CheckCircle } from 'lucide-react';
import { getCodeSwitchStats } from '../utils/detectorEngine';

gsap.registerPlugin(ScrollTrigger);

export default function CodeSwitchingSuite() {
  const [sampleText, setSampleText] = useState("yaar kal wali assignment ka scene kya hai? prof ne submission extended kiya ya waat lagne wali hai?");
  const stats = getCodeSwitchStats(sampleText);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cs-header',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75, ease: 'power3.out',
          scrollTrigger: { trigger: '.cs-header', start: 'top 85%', once: true }
        }
      );
      gsap.fromTo(
        '.cs-card',
        { y: 35, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: '.cs-card', start: 'top 85%', once: true }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const statItems = [
    { label: 'Language Switches', value: stats.switchCount, unit: 'times', color: '#d5fa78' },
    { label: 'Switch Density', value: stats.codeSwitchRatio, unit: 'switches/token', color: '#d5fa78' },
  ];

  return (
    <section ref={sectionRef} id="code-switching-section" style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '4rem 1.5rem'
    }}>
      {/* Header */}
      <div className="cs-header" style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#d5fa78',
          fontSize: '0.825rem',
          fontWeight: '700',
          fontFamily: 'JetBrains Mono, monospace',
          marginBottom: '0.5rem'
        }}>
          <Layers size={14} />
          CODE-SWITCHING & LINGUISTIC TELEMETRY
        </div>
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '2.25rem',
          fontWeight: '800',
          color: '#ffffff',
          letterSpacing: '-0.02em'
        }}>
          Decoding Hinglish Code-Mixing
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '1rem', marginTop: '0.25rem' }}>
          Explore how IndicDetect calculates token transition frequency to prevent false positives on conversational Indian text.
        </p>
      </div>

      {/* Interactive Telemetry Box */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {/* Left Side: Live Sandbox Input */}
        <div className="cs-card dark-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflow: 'hidden', minWidth: 0 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
            Code-Switching Simulator
          </h3>

          <textarea
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            rows={5}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              backgroundColor: '#0a0b0d',
              color: '#f3f4f6',
              border: '1px solid #282c37',
              borderRadius: '10px',
              padding: '1rem',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              outline: 'none',
              resize: 'vertical',
              overflowX: 'hidden',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#d5fa78'}
            onBlur={(e) => e.target.style.borderColor = '#282c37'}
          />

          {/* Realtime token progress meter */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
              <span style={{ color: '#eab308' }}>Hindi Tokens: {stats.hindiTokenPct}%</span>
              <span style={{ color: '#38bdf8' }}>English Tokens: {stats.englishTokenPct}%</span>
            </div>

            <div style={{ height: '12px', backgroundColor: '#1a1d24', borderRadius: '9999px', overflow: 'hidden', display: 'flex' }}>
              <motion.div
                animate={{ width: `${stats.hindiTokenPct}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ backgroundColor: '#eab308', height: '100%' }}
              />
              <motion.div
                animate={{ width: `${stats.englishTokenPct}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ backgroundColor: '#38bdf8', height: '100%' }}
              />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            backgroundColor: '#0a0b0d',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #1f2229'
          }}>
            {statItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.35 }}
              >
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'JetBrains Mono, monospace' }}>{item.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>
                  {item.value} <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{item.unit}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Why Standard Detectors Fail Explanation */}
        <div className="cs-card dark-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
            Why Generic AI Detectors Fail on Hinglish
          </h3>

          <motion.div
            whileHover={{ scale: 1.015, x: 4 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{ display: 'flex', gap: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '10px' }}
          >
            <AlertCircle size={24} color="#ef4444" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: '700', color: '#ef4444', fontSize: '0.95rem' }}>The Out-of-Vocabulary (OOV) Trap</div>
              <div style={{ fontSize: '0.875rem', color: '#d1d5db', marginTop: '4px' }}>
                Standard detectors (GPTZero, Turnitin) tokenize Romanized Hindi words like <i>"mausam"</i>, <i>"batao"</i>, or <i>"chaltay"</i> as rare subword fragments. This distorts perplexity calculations and falsely flags human writing as AI.
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.015, x: 4 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{ display: 'flex', gap: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '1rem', borderRadius: '10px' }}
          >
            <CheckCircle size={24} color="#22c55e" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: '700', color: '#22c55e', fontSize: '0.95rem' }}>IndicDetect Dual-Branch Solution</div>
              <div style={{ fontSize: '0.875rem', color: '#d1d5db', marginTop: '4px' }}>
                IndicDetect uses a dedicated <b>HingRoBERTa</b> transformer trained on Romanized Hindi corpora alongside code-switching ratio extractors, achieving <b>94.8% F1 accuracy</b>.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
