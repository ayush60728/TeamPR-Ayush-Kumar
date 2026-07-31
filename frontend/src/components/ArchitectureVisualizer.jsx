import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GitFork, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const NODES = [
  {
    id: 'input',
    title: '1. User Text Submission',
    type: 'Input Ingestion',
    tech: 'FastAPI / Pydantic',
    description: 'Ingests raw text payload via REST API or Client SDK. Sanitizes inputs, removes URLs, and computes word counts.',
    details: [
      'Accepts UTF-8 encoded text of 4 to 500+ words',
      'Instant pre-flight sanity checks to reject empty strings',
      'Normalizes unicode space breaks and punctuation'
    ],
    code: `class TextInput(BaseModel):\n    text: str\n\n@app.post("/predict")\ndef predict(input: TextInput):\n    text = input.text.strip()`
  },
  {
    id: 'router',
    title: '2. Heuristic Language Router',
    type: 'Classification Gate',
    tech: 'LID Heuristic / Fast Token Matcher',
    description: 'Evaluates Romanized Hindi dictionary token frequency against threshold (0.12). Routes text to dedicated model branch.',
    details: [
      'High-speed O(N) word token lookup',
      'Prevents expensive transformer calls on mismatched languages',
      'Calculates Hindi vs English token ratio'
    ],
    code: `def detect_language(text, threshold=0.12):\n    words = text.lower().split()\n    hindi_count = sum(1 for w in words if w in HINDI_WORDS)\n    return "hinglish" if (hindi_count/len(words)) >= threshold else "english"`
  },
  {
    id: 'hinglish_branch',
    title: '3A. HingRoBERTa Branch',
    type: 'Hinglish Classifier',
    tech: 'l3cube-pune/hing-roberta',
    description: 'Fine-tuned RoBERTa transformer specialized in Hinglish (Hindi-English code-mixed Roman script) human vs AI detection.',
    details: [
      'Trained on 2,000+ Hinglish samples (Human HingCorpus + Claude Sonnet AI generations)',
      'Layer freezing: top 2 layers unfrozen for fast fine-tuning',
      'Achieves 94.8% F1 accuracy on code-switched text'
    ],
    code: `from transformers import pipeline\nhing_clf = pipeline("text-classification", model="./hinglish-detector")\nresult = hing_clf(text)[0]`
  },
  {
    id: 'english_branch',
    title: '3B. RoBERTa Base Branch',
    type: 'English Classifier',
    tech: 'roberta-base',
    description: 'Pre-trained RoBERTa model fine-tuned on benchmark English AI vs Human datasets.',
    details: [
      'Evaluates perplexity and syntactic cohesion',
      'Optimized for formal, academic, and casual English text',
      'Reduces false positives on technical jargon'
    ],
    code: `eng_clf = pipeline("text-classification", model="./english-detector")\nresult = eng_clf(text)[0]`
  },
  {
    id: 'telemetry',
    title: '4. Code-Switch Telemetry Engine',
    type: 'Linguistic Analysis',
    tech: 'N-gram Switch Counter',
    description: 'Analyzes token-level language transitions, Hindi-English code-switch ratios, and sentence burstiness metrics.',
    details: [
      'Computes switch_count / total_tokens ratio',
      'Per-token language tags for UI visualizer',
      'Evaluates structural naturalness'
    ],
    code: `def code_switch_stats(text):\n    # Calculates transition density between Hindi & English tokens\n    return {"hindi_token_pct": hindi_pct, "code_switch_ratio": round(switches/total, 2)}`
  },
  {
    id: 'output',
    title: '5. Combined Verdict Payload',
    type: 'JSON Result',
    tech: 'REST / WebSocket',
    description: 'Aggregates probability score, detected branch, code-switching ratio, and token annotations into a unified response.',
    details: [
      'Sub-50ms total latency',
      'Includes human readable breakdown & confidence interval',
      'Ready for web apps, API gateways, and anti-spam plugins'
    ],
    code: `return {\n  "label": "Human",\n  "confidence": 0.94,\n  "language_detected": "hinglish",\n  "code_switch_ratio": 0.38\n}`
  }
];

const flowStyles = `
  @keyframes fcDotFlow {
    0% { stroke-dashoffset: 40; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes fcNodePop {
    0% { transform: scale(0.82); opacity: 0; }
    70% { transform: scale(1.04); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  .fc-node { animation: fcNodePop 0.42s ease-out both; }
  .fc-1 { animation-delay: 0.0s; }
  .fc-2 { animation-delay: 0.15s; }
  .fc-3a { animation-delay: 0.3s; }
  .fc-3b { animation-delay: 0.42s; }
  .fc-4 { animation-delay: 0.56s; }
  .fc-5 { animation-delay: 0.7s; }
  .fc-line { animation: fcDotFlow 1.4s linear infinite; stroke-dasharray: 6 4; }
`;

export default function ArchitectureVisualizer() {
  const [selectedNode, setSelectedNode] = useState(NODES[1]);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.arch-header',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.arch-header', start: 'top 85%', once: true }
        }
      );
      gsap.fromTo(
        '.arch-left-col',
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.75, ease: 'power3.out', delay: 0.1,
          scrollTrigger: { trigger: '.arch-left-col', start: 'top 85%', once: true }
        }
      );
      gsap.fromTo(
        '.arch-right-col',
        { x: 50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.75, ease: 'power3.out', delay: 0.2,
          scrollTrigger: { trigger: '.arch-right-col', start: 'top 85%', once: true }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="architecture-section" style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '4rem 1.5rem'
    }}>
      <style>{flowStyles}</style>

      {/* Header */}
      <div className="arch-header" style={{ marginBottom: '2.5rem' }}>
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
          <GitFork size={14} />
          DUAL-BRANCH ARCHITECTURE PIPELINE
        </div>
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '2.25rem',
          fontWeight: '800',
          color: '#ffffff',
          letterSpacing: '-0.02em'
        }}>
          How IndicDetect Eliminates False Positives
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '1rem', marginTop: '0.25rem' }}>
          Interactive workflow diagram. Click any pipeline stage to inspect code and technical specifications.
        </p>
      </div>

      {/* Grid: Flowchart & Detail Inspector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {/* Left Side: Animated Flowchart */}
        <div className="arch-left-col dark-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem 1.25rem', overflow: 'hidden' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '1.25rem' }}>
            Pipeline Flowchart
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '0' }}>

            {/* NODE 1: Input */}
            <div className="fc-node fc-1" onClick={() => setSelectedNode(NODES[0])} style={{
              cursor: 'pointer', width: '100%',
              backgroundColor: selectedNode.id === 'input' ? 'rgba(213,250,120,0.1)' : '#0e1016',
              border: `1.5px solid ${selectedNode.id === 'input' ? '#d5fa78' : '#2b303c'}`,
              borderRadius: '10px', padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.22s ease',
            }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: '#d5fa78', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.6rem', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>IN</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: selectedNode.id === 'input' ? '#d5fa78' : '#f3f4f6' }}>User Text Submission</div>
                <div style={{ fontSize: '0.65rem', color: '#6b7280', fontFamily: 'JetBrains Mono, monospace', marginTop: '1px' }}>FastAPI / Pydantic</div>
              </div>
            </div>

            {/* Connector 1→2 */}
            <svg width="14" height="30" viewBox="0 0 14 30" fill="none" style={{ flexShrink: 0 }}>
              <line x1="7" y1="0" x2="7" y2="21" stroke="#d5fa78" strokeWidth="1.5" className="fc-line" />
              <polygon points="7,30 2,19 12,19" fill="#d5fa78" />
            </svg>

            {/* NODE 2: Router */}
            <div className="fc-node fc-2" onClick={() => setSelectedNode(NODES[1])} style={{
              cursor: 'pointer', width: '100%',
              backgroundColor: selectedNode.id === 'router' ? 'rgba(59,130,246,0.1)' : '#0e1016',
              border: `1.5px solid ${selectedNode.id === 'router' ? '#3b82f6' : '#1e3a5f'}`,
              borderRadius: '10px', padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.22s ease',
            }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: '#1d4ed8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.6rem', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>RT</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: selectedNode.id === 'router' ? '#60a5fa' : '#f3f4f6' }}>Heuristic Language Router</div>
                <div style={{ fontSize: '0.65rem', color: '#6b7280', fontFamily: 'JetBrains Mono, monospace', marginTop: '1px' }}>Hindi ratio ≥ 0.12 → Hinglish branch</div>
              </div>
              <div style={{ fontSize: '0.55rem', color: '#60a5fa', border: '1px solid #1d4ed8', borderRadius: '4px', padding: '2px 5px', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>GATE</div>
            </div>

            {/* Fork SVG: splits into two branches */}
            <svg width="100%" height="44" viewBox="0 0 240 44" preserveAspectRatio="none" style={{ flexShrink: 0 }}>
              <line x1="120" y1="0" x2="120" y2="14" stroke="#4b5563" strokeWidth="1.5" className="fc-line" />
              <line x1="60" y1="14" x2="180" y2="14" stroke="#4b5563" strokeWidth="1.5" />
              <line x1="60" y1="14" x2="60" y2="35" stroke="#eab308" strokeWidth="1.5" className="fc-line" />
              <polygon points="60,43 55,33 65,33" fill="#eab308" />
              <line x1="180" y1="14" x2="180" y2="35" stroke="#38bdf8" strokeWidth="1.5" className="fc-line" />
              <polygon points="180,43 175,33 185,33" fill="#38bdf8" />
            </svg>

            {/* BRANCHES ROW */}
            <div style={{ display: 'flex', gap: '0.6rem', width: '100%' }}>
              {/* 3A: HingRoBERTa */}
              <div className="fc-node fc-3a" onClick={() => setSelectedNode(NODES[2])} style={{
                cursor: 'pointer', flex: 1,
                backgroundColor: selectedNode.id === 'hinglish_branch' ? 'rgba(234,179,8,0.1)' : '#0e1016',
                border: `1.5px solid ${selectedNode.id === 'hinglish_branch' ? '#eab308' : '#422006'}`,
                borderRadius: '10px', padding: '10px 10px', transition: 'all 0.22s ease',
              }}>
                <div style={{ fontSize: '0.58rem', color: '#eab308', fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', marginBottom: '4px' }}>3A · HINGLISH</div>
                <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#f3f4f6', lineHeight: '1.25' }}>HingRoBERTa</div>
                <div style={{ fontSize: '0.6rem', color: '#78716c', fontFamily: 'JetBrains Mono, monospace', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>l3cube-pune/hing-roberta</div>
                <div style={{ marginTop: '5px', display: 'inline-block', fontSize: '0.58rem', backgroundColor: 'rgba(234,179,8,0.12)', color: '#eab308', border: '1px solid #78350f', borderRadius: '4px', padding: '1px 5px', fontFamily: 'JetBrains Mono, monospace' }}>94.8% F1</div>
              </div>

              {/* 3B: RoBERTa-Base */}
              <div className="fc-node fc-3b" onClick={() => setSelectedNode(NODES[3])} style={{
                cursor: 'pointer', flex: 1,
                backgroundColor: selectedNode.id === 'english_branch' ? 'rgba(56,189,248,0.1)' : '#0e1016',
                border: `1.5px solid ${selectedNode.id === 'english_branch' ? '#38bdf8' : '#0c4a6e'}`,
                borderRadius: '10px', padding: '10px 10px', transition: 'all 0.22s ease',
              }}>
                <div style={{ fontSize: '0.58rem', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', marginBottom: '4px' }}>3B · ENGLISH</div>
                <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#f3f4f6', lineHeight: '1.25' }}>RoBERTa-Base</div>
                <div style={{ fontSize: '0.6rem', color: '#78716c', fontFamily: 'JetBrains Mono, monospace', marginTop: '3px' }}>roberta-base</div>
                <div style={{ marginTop: '5px', display: 'inline-block', fontSize: '0.58rem', backgroundColor: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid #0c4a6e', borderRadius: '4px', padding: '1px 5px', fontFamily: 'JetBrains Mono, monospace' }}>Fine-tuned</div>
              </div>
            </div>

            {/* Merge SVG: two branches → telemetry */}
            <svg width="100%" height="44" viewBox="0 0 240 44" preserveAspectRatio="none" style={{ flexShrink: 0 }}>
              <line x1="60" y1="0" x2="60" y2="14" stroke="#4b5563" strokeWidth="1.5" className="fc-line" />
              <line x1="180" y1="0" x2="180" y2="14" stroke="#4b5563" strokeWidth="1.5" className="fc-line" />
              <line x1="60" y1="14" x2="180" y2="14" stroke="#4b5563" strokeWidth="1.5" />
              <line x1="120" y1="14" x2="120" y2="35" stroke="#a855f7" strokeWidth="1.5" className="fc-line" />
              <polygon points="120,43 115,33 125,33" fill="#a855f7" />
            </svg>

            {/* NODE 4: Telemetry */}
            <div className="fc-node fc-4" onClick={() => setSelectedNode(NODES[4])} style={{
              cursor: 'pointer', width: '100%',
              backgroundColor: selectedNode.id === 'telemetry' ? 'rgba(168,85,247,0.1)' : '#0e1016',
              border: `1.5px solid ${selectedNode.id === 'telemetry' ? '#a855f7' : '#3b0764'}`,
              borderRadius: '10px', padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.22s ease',
            }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.6rem', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>TM</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: selectedNode.id === 'telemetry' ? '#c084fc' : '#f3f4f6' }}>Code-Switch Telemetry</div>
                <div style={{ fontSize: '0.65rem', color: '#6b7280', fontFamily: 'JetBrains Mono, monospace', marginTop: '1px' }}>Hindi% · English% · Switch ratio</div>
              </div>
            </div>

            {/* Connector 4→5 */}
            <svg width="14" height="30" viewBox="0 0 14 30" fill="none" style={{ flexShrink: 0 }}>
              <line x1="7" y1="0" x2="7" y2="21" stroke="#22c55e" strokeWidth="1.5" className="fc-line" />
              <polygon points="7,30 2,19 12,19" fill="#22c55e" />
            </svg>

            {/* NODE 5: Output */}
            <div className="fc-node fc-5" onClick={() => setSelectedNode(NODES[5])} style={{
              cursor: 'pointer', width: '100%',
              backgroundColor: selectedNode.id === 'output' ? 'rgba(34,197,94,0.1)' : '#0e1016',
              border: `1.5px solid ${selectedNode.id === 'output' ? '#22c55e' : '#14532d'}`,
              borderRadius: '10px', padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.22s ease',
            }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: '#15803d', color: '#d5fa78', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.55rem', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>OUT</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: selectedNode.id === 'output' ? '#22c55e' : '#f3f4f6' }}>Combined Verdict Payload</div>
                <div style={{ fontSize: '0.65rem', color: '#6b7280', fontFamily: 'JetBrains Mono, monospace', marginTop: '1px' }}>label · confidence · language_detected</div>
              </div>
              <div style={{ fontSize: '0.55rem', color: '#22c55e', border: '1px solid #15803d', borderRadius: '4px', padding: '2px 5px', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>JSON</div>
            </div>

            <div style={{ marginTop: '0.9rem', fontSize: '0.65rem', color: '#374151', fontFamily: 'JetBrains Mono, monospace', textAlign: 'center' }}>
              ↑ Click any node to inspect details →
            </div>
          </div>
        </div>

        {/* Right Side: Selected Node Technical Deep Dive */}
        <div className="arch-right-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="dark-card"
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid #d5fa78', height: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #22262e', paddingBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#d5fa78', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                    {selectedNode.type}
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif', marginTop: '2px' }}>
                    {selectedNode.title}
                  </h3>
                </div>

                <div style={{
                  backgroundColor: '#1a1d24',
                  color: '#d5fa78',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  {selectedNode.tech}
                </div>
              </div>

              <p style={{ color: '#d1d5db', fontSize: '1rem', lineHeight: '1.6' }}>
                {selectedNode.description}
              </p>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', display: 'block', marginBottom: '0.5rem' }}>
                  Key Technical Features
                </label>
                <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedNode.details.map((detail, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.07, duration: 0.35 }}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: '#9ca3af' }}
                    >
                      <Zap size={14} color="#d5fa78" style={{ marginTop: '3px', flexShrink: 0 }} />
                      <span>{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Code Snippet Box */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', display: 'block', marginBottom: '0.5rem' }}>
                  Implementation Snippet
                </label>
                <pre style={{
                  backgroundColor: '#0a0b0d',
                  border: '1px solid #22262e',
                  borderRadius: '8px',
                  padding: '1rem',
                  color: '#d5fa78',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.825rem',
                  overflowX: 'auto',
                  lineHeight: '1.5'
                }}>
                  {selectedNode.code}
                </pre>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
