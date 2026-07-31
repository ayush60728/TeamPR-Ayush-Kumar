import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { predictText } from '../utils/detectorEngine';
import { Sparkles, RefreshCw, Cpu, Laptop, Server, Copy, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PRESETS = [
  {
    label: 'Hinglish Human',
    category: 'Hinglish',
    type: 'Human',
    text: 'yaar aaj mausam bahut accha hai, chal shaam ko chai peene chaltay hain bhai! waise kal wali party ka kya hua?'
  },
  {
    label: 'Hinglish AI',
    category: 'Hinglish',
    type: 'AI',
    text: 'Yeh nayi AI technology aapke daily work routine ko streamline karti hai aur overall efficiency ko maximize karne me help karti hai.'
  },
  {
    label: 'English AI',
    category: 'English',
    type: 'AI',
    text: 'Furthermore, the implementation of neural transformer architectures plays a pivotal role in optimizing text feature extraction across multilingual corpora.'
  },
  {
    label: 'English Human',
    category: 'English',
    type: 'Human',
    text: 'Honestly I was just sitting at my desk trying to finish up the quarterly updates before grabbing some dinner with the team.'
  }
];

export default function Playground() {
  const [text, setText] = useState(PRESETS[0].text);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useBackend, setUseBackend] = useState(false);
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.playground-header',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.playground-header', start: 'top 88%', once: true }
        }
      );
      gsap.fromTo(
        '.playground-grid',
        { y: 25, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', delay: 0.12,
          scrollTrigger: { trigger: '.playground-grid', start: 'top 88%', once: true }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleAnalyze = async (textToAnalyze = text) => {
    if (!textToAnalyze.trim()) {
      setResult(null);
      return;
    }
    setLoading(true);
    try {
      const res = await predictText(textToAnalyze, "http://localhost:8000/predict", useBackend);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAnalyze(text);
  }, [useBackend]);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Unable to copy text:', err);
    }
  };

  return (
    <section ref={sectionRef} id="playground-section" style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '3rem 1.25rem'
    }}>
      {/* Section Header */}
      <div className="playground-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#d5fa78',
            fontSize: '0.8rem',
            fontWeight: '700',
            fontFamily: 'JetBrains Mono, monospace',
            marginBottom: '0.5rem'
          }}>
            <Sparkles size={14} className="pulse-glow" />
            INTERACTIVE DETECTION PLAYGROUND
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
            fontWeight: '800',
            color: '#ffffff',
            letterSpacing: '-0.02em'
          }}>
            Test Any Text in Real-Time
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Paste English or Hinglish text to observe instant language routing &amp; dual-model probability scoring.
          </p>
        </div>

        {/* Backend / Client toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#121418',
          border: '1px solid #22262e',
          padding: '6px 10px',
          borderRadius: '10px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'JetBrains Mono, monospace' }}>Engine Mode:</span>
          <button
            onClick={() => setUseBackend(false)}
            style={{
              backgroundColor: !useBackend ? '#d5fa78' : 'transparent',
              color: !useBackend ? '#0a0a0a' : '#9ca3af',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <Laptop size={12} />
            Client JS
          </button>
          <button
            onClick={() => setUseBackend(true)}
            style={{
              backgroundColor: useBackend ? '#d5fa78' : 'transparent',
              color: useBackend ? '#0a0a0a' : '#9ca3af',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <Server size={12} />
            FastAPI Server
          </button>
        </div>
      </div>

        {/* Main Grid: Input Console & Output Results */}
        <div className="playground-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
        {/* Left Side: Input Box & Sample Presets */}
        <div className="dark-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Preset Buttons */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', display: 'block', marginBottom: '0.5rem' }}>
              Load Sample Presets
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {PRESETS.map((preset, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setText(preset.text);
                    handleAnalyze(preset.text);
                  }}
                  className="dark-chip"
                  style={{
                    borderColor: text === preset.text ? '#d5fa78' : undefined,
                    color: text === preset.text ? '#d5fa78' : undefined
                  }}
                >
                  {preset.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Textarea Input */}
          <div style={{ position: 'relative', flex: 1 }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste text here (in English or Hinglish)..."
              rows={7}
              style={{
                width: '100%',
                backgroundColor: '#0a0b0d',
                color: '#f3f4f6',
                border: '1px solid #282c37',
                borderRadius: '10px',
                padding: '0.85rem',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                resize: 'vertical',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#d5fa78'}
              onBlur={(e) => e.target.style.borderColor = '#282c37'}
            />

            {/* Bottom bar of textarea */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem',
              marginBottom: '0.25rem',
              fontSize: '0.75rem',
              color: '#6b7280',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              <div>
                <span>{text.split(/\s+/).filter(Boolean).length} words</span> - <span>{text.length} chars</span>
              </div>
              
              <button
                onClick={handleCopyText}
                style={{
                  backgroundColor: '#161920',
                  border: '1px solid #2b303c',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  color: copied ? '#22c55e' : '#d5fa78',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  marginLeft: 'auto',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#232834';
                  e.currentTarget.style.borderColor = '#d5fa78';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#161920';
                  e.currentTarget.style.borderColor = '#2b303c';
                }}
              >
                {copied ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnalyze(text)}
              disabled={loading || !text.trim()}
              className="btn-chartreuse"
              style={{ flex: 1, justifyContent: 'center', opacity: (!text.trim() || loading) ? 0.6 : 1 }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Running Routers...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Analyze Text Now
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Right Side: Verdict & Detailed Analysis Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div 
                key="result-card"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="dark-card" 
                style={{ border: `1px solid ${result.label === 'AI' ? '#ef4444' : '#22c55e'}` }}
              >
                {/* Verdict Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #22262e', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#9ca3af', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                      Classification Result
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px', flexWrap: 'wrap' }}>
                      <h3 style={{
                        fontSize: '1.65rem',
                        fontWeight: '900',
                        color: result.label === 'AI' ? '#ef4444' : '#22c55e',
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}>
                        {result.label === 'AI' ? 'AI GENERATED' : 'HUMAN WRITTEN'}
                      </h3>
                      <span style={{
                        backgroundColor: result.label === 'AI' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                        color: result.label === 'AI' ? '#ef4444' : '#22c55e',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}>
                        {Math.round(result.confidence * 100)}% Confident
                      </span>
                    </div>
                  </div>

                  {/* Routing Badge */}
                  <div style={{
                    backgroundColor: '#1a1d24',
                    border: '1px solid #2b303c',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    textAlign: 'right'
                  }}>
                    <div style={{ fontSize: '0.65rem', color: '#9ca3af', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                      Routed Branch
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#d5fa78', textTransform: 'capitalize' }}>
                      {result.language_detected}
                    </div>
                  </div>
                </div>

                {/* Confidence Progress Bar */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px', color: '#9ca3af' }}>
                    <span>Probability Meter</span>
                    <span>{result.label === 'AI' ? `AI: ${(result.confidence * 100).toFixed(1)}%` : `Human: ${(result.confidence * 100).toFixed(1)}%`}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#1a1d24', borderRadius: '9999px', overflow: 'hidden', display: 'flex' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.label === 'AI' ? result.confidence * 100 : (1 - result.confidence) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      style={{
                        backgroundColor: '#ef4444',
                      }}
                    />
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.label === 'Human' ? result.confidence * 100 : (1 - result.confidence) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      style={{
                        backgroundColor: '#22c55e',
                      }}
                    />
                  </div>
                </div>

                {/* Telemetry Metrics Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                  backgroundColor: '#0a0b0d',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  border: '1px solid #1a1d24'
                }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                      Code-Switch Ratio
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f3f4f6', marginTop: '2px', fontFamily: 'JetBrains Mono, monospace' }}>
                      {result.code_switch_ratio}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                      Hindi Token %
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#eab308', marginTop: '2px', fontFamily: 'JetBrains Mono, monospace' }}>
                      {result.hindi_token_pct}%
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                      English Token %
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#38bdf8', marginTop: '2px', fontFamily: 'JetBrains Mono, monospace' }}>
                      {result.english_token_pct}%
                    </div>
                  </div>
                </div>

                {/* Interactive Token Highlighting Section */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                      Token-Level Language Breakdown
                    </label>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace' }}>
                      <span style={{ color: '#eab308', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#eab308' }}></span> Hindi
                      </span>
                      <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#38bdf8' }}></span> English
                      </span>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#0a0b0d',
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #1f2229',
                    lineHeight: '1.8',
                    fontSize: '0.9rem'
                  }}>
                    {result.annotated_tokens && result.annotated_tokens.map((tok, idx) => {
                      if (tok.isSpace) return <span key={idx}>{tok.text}</span>;
                      return (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.015 }}
                          style={{
                            backgroundColor: tok.isHindi ? 'rgba(234, 179, 8, 0.18)' : 'rgba(56, 189, 248, 0.12)',
                            color: tok.isHindi ? '#facc15' : '#7dd3fc',
                            borderBottom: tok.isHindi ? '2px solid #eab308' : '1px dashed #38bdf8',
                            padding: '1px 3px',
                            borderRadius: '3px',
                            margin: '0 1px',
                            display: 'inline-block',
                            fontWeight: tok.isHindi ? '700' : '400',
                            fontFamily: tok.isHindi ? 'JetBrains Mono, monospace' : 'inherit'
                          }}
                          title={tok.isHindi ? 'Hindi Token' : 'English Token'}
                        >
                          {tok.text}
                        </motion.span>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="dark-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '260px', textAlign: 'center', color: '#6b7280' }}>
                <Cpu size={36} color="#374151" style={{ marginBottom: '0.75rem' }} />
                <p style={{ fontSize: '0.95rem', color: '#9ca3af' }}>Ready for analysis.</p>
                <p style={{ fontSize: '0.8rem' }}>Type text on the left or select a preset to begin.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

