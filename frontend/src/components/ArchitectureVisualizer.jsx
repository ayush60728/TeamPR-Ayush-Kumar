import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GitFork, Zap, ArrowRight } from 'lucide-react';

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
          scrollTrigger: {
            trigger: '.arch-header',
            start: 'top 85%',
            once: true
          }
        }
      );
      gsap.fromTo(
        '.arch-left-col',
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.75, ease: 'power3.out', delay: 0.1,
          scrollTrigger: {
            trigger: '.arch-left-col',
            start: 'top 85%',
            once: true
          }
        }
      );
      gsap.fromTo(
        '.arch-right-col',
        { x: 50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.75, ease: 'power3.out', delay: 0.2,
          scrollTrigger: {
            trigger: '.arch-right-col',
            start: 'top 85%',
            once: true
          }
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
          Interactive workflow diagram. Click on any pipeline stage to inspect code and technical specifications.
        </p>
      </div>

      {/* Grid: Workflow Diagram & Detail Inspector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {/* Left Side: Pipeline Nodes Visual Flow */}
        <div className="arch-left-col dark-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '0.5rem' }}>
            Pipeline Topology
          </h3>

          {NODES.map((node, i) => {
            const isSelected = selectedNode.id === node.id;
            const isBranchNode = node.id.includes('branch');
            return (
              <motion.div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  backgroundColor: isSelected ? 'rgba(212, 252, 52, 0.08)' : '#0a0b0d',
                  border: `1px solid ${isSelected ? '#d5fa78' : '#22262e'}`,
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.25s ease, background-color 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginLeft: isBranchNode ? '1.5rem' : '0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <motion.div
                    animate={{
                      backgroundColor: isSelected ? '#d5fa78' : '#1a1d24',
                      color: isSelected ? '#0a0a0a' : '#d5fa78'
                    }}
                    transition={{ duration: 0.25 }}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    {node.id === 'input' ? 'IN' : node.id === 'router' ? 'RT' : node.id === 'telemetry' ? 'TM' : node.id === 'output' ? 'OUT' : 'ML'}
                  </motion.div>

                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: isSelected ? '#d5fa78' : '#f3f4f6', transition: 'color 0.2s ease' }}>
                      {node.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'JetBrains Mono, monospace' }}>
                      {node.tech}
                    </div>
                  </div>
                </div>

                <motion.div animate={{ x: isSelected ? 4 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <ArrowRight size={16} color={isSelected ? '#d5fa78' : '#4b5563'} />
                </motion.div>
              </motion.div>
            );
          })}
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
