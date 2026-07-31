import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart3, Check, X, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const BENCHMARKS = [
  {
    name: 'IndicDetect (Dual-Router)',
    isUs: true,
    hinglishF1: '94.8%',
    falsePositiveRate: '3.2%',
    englishF1: '95.2%',
    latency: '35 ms',
    codeSwitchAware: true
  },
  {
    name: 'GPTZero Standard',
    isUs: false,
    hinglishF1: '58.4%',
    falsePositiveRate: '41.8%',
    englishF1: '96.1%',
    latency: '420 ms',
    codeSwitchAware: false
  },
  {
    name: 'Turnitin AI Detector',
    isUs: false,
    hinglishF1: '52.1%',
    falsePositiveRate: '46.5%',
    englishF1: '94.0%',
    latency: '850 ms',
    codeSwitchAware: false
  },
  {
    name: 'Single RoBERTa Baseline',
    isUs: false,
    hinglishF1: '64.2%',
    falsePositiveRate: '31.0%',
    englishF1: '91.5%',
    latency: '85 ms',
    codeSwitchAware: false
  }
];

const rowVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' }
  })
};

export default function BenchmarkComparison() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.bench-header',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.bench-header', start: 'top 85%', once: true }
        }
      );
      gsap.fromTo(
        '.bench-table-wrap',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.15,
          scrollTrigger: { trigger: '.bench-table-wrap', start: 'top 88%', once: true }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="benchmarks-section" style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '4rem 1.5rem'
    }}>
      {/* Header */}
      <div className="bench-header" style={{ marginBottom: '2.5rem' }}>
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
          <BarChart3 size={14} />
          EMPIRICAL EVALUATION & BENCHMARKS
        </div>
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '2.25rem',
          fontWeight: '800',
          color: '#ffffff',
          letterSpacing: '-0.02em'
        }}>
          Comparative Accuracy Matrix
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '1rem', marginTop: '0.25rem' }}>
          Tested on 2,000+ Hinglish and English social media samples (L3Cube-Pune corpus + synthetic Sonnet AI data).
        </p>
      </div>

      {/* Comparison Table */}
      <div className="bench-table-wrap dark-card" style={{ overflowX: 'auto', padding: '1rem' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.95rem'
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #22262e', color: '#9ca3af', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem' }}>Detector Engine</th>
              <th style={{ padding: '1rem' }}>Hinglish F1-Score</th>
              <th style={{ padding: '1rem' }}>Hinglish False Positive Rate</th>
              <th style={{ padding: '1rem' }}>English F1-Score</th>
              <th style={{ padding: '1rem' }}>Avg Latency</th>
              <th style={{ padding: '1rem' }}>Code-Switch Aware</th>
            </tr>
          </thead>
          <tbody>
            {BENCHMARKS.map((row, idx) => (
              <motion.tr
                key={idx}
                custom={idx}
                variants={rowVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                style={{
                  borderBottom: '1px solid #1a1d24',
                  backgroundColor: row.isUs ? 'rgba(212, 252, 52, 0.06)' : 'transparent',
                  fontWeight: row.isUs ? '700' : '400'
                }}
              >
                <td style={{ padding: '1.25rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: row.isUs ? '#d5fa78' : '#f3f4f6' }}>
                    {row.isUs && (
                      <motion.div
                        animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                        transition={{ duration: 1.2, delay: 0.5, repeat: 0 }}
                      >
                        <Award size={18} color="#d5fa78" />
                      </motion.div>
                    )}
                    <span>{row.name}</span>
                  </div>
                </td>

                <td style={{ padding: '1rem', fontFamily: 'JetBrains Mono, monospace', color: row.isUs ? '#22c55e' : '#f3f4f6' }}>
                  {row.hinglishF1}
                </td>

                <td style={{ padding: '1rem', fontFamily: 'JetBrains Mono, monospace', color: row.isUs ? '#22c55e' : '#ef4444' }}>
                  {row.falsePositiveRate}
                </td>

                <td style={{ padding: '1rem', fontFamily: 'JetBrains Mono, monospace' }}>
                  {row.englishF1}
                </td>

                <td style={{ padding: '1rem', fontFamily: 'JetBrains Mono, monospace', color: row.isUs ? '#d5fa78' : '#9ca3af' }}>
                  {row.latency}
                </td>

                <td style={{ padding: '1rem' }}>
                  {row.codeSwitchAware ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15, delay: idx * 0.1 + 0.3 }}
                      style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', fontSize: '0.85rem' }}
                    >
                      <Check size={16} /> YES
                    </motion.span>
                  ) : (
                    <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                      <X size={16} /> NO
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
