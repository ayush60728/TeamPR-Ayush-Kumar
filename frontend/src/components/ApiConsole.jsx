import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, Copy, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SNIPPETS = {
  curl: `curl -X POST "http://localhost:8000/predict" \\
     -H "Content-Type: application/json" \\
     -d '{"text": "yaar aaj mausam bahut accha hai, chal chai peene chaltay hain"}'`,
  python: `import requests

url = "http://localhost:8000/predict"
payload = {"text": "yaar aaj mausam bahut accha hai, chal chai peene chaltay hain"}

response = requests.post(url, json=payload)
data = response.json()

print(f"Verdict: {data['label']} ({data['confidence']*100}% confidence)")
print(f"Detected Branch: {data['language_detected']}")
print(f"Code-Switch Ratio: {data['code_switch_ratio']}")`,
  javascript: `const response = await fetch("http://localhost:8000/predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "yaar aaj mausam bahut accha hai, chal chai peene chaltay hain"
  })
});

const data = await response.json();
console.log(data);`
};

const LANGS = ['curl', 'python', 'javascript'];

export default function ApiConsole() {
  const [lang, setLang] = useState('curl');
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SNIPPETS[lang]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Unable to copy code:', err);
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.api-header',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.api-header', start: 'top 85%', once: true }
        }
      );
      gsap.fromTo(
        '.api-code-card',
        { y: 30, opacity: 0, scale: 0.97 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out', delay: 0.15,
          scrollTrigger: { trigger: '.api-code-card', start: 'top 88%', once: true }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="api-section" style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '4rem 1.5rem'
    }}>
      {/* Header */}
      <div className="api-header" style={{ marginBottom: '2.5rem' }}>
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
          <Terminal size={14} />
          DEVELOPER API & SDK INTEGRATION
        </div>
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '2.25rem',
          fontWeight: '800',
          color: '#ffffff',
          letterSpacing: '-0.02em'
        }}>
          Integrate IndicDetect in 3 Lines of Code
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '1rem', marginTop: '0.25rem' }}>
          RESTful API endpoint accepting JSON payloads with low-latency sub-50ms inference times.
        </p>
      </div>

      {/* Code Snippet Box */}
      <div className="api-code-card dark-card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Code Bar Header */}
        <div style={{
          backgroundColor: '#0a0b0d',
          padding: '0.75rem 1.25rem',
          borderBottom: '1px solid #22262e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
            {LANGS.map((l) => (
              <motion.button
                key={l}
                onClick={() => setLang(l)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  backgroundColor: lang === l ? '#1f242d' : 'transparent',
                  color: lang === l ? '#d5fa78' : '#9ca3af',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.825rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: '700',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'color 0.2s ease, background-color 0.2s ease'
                }}
              >
                {l === 'curl' ? 'cURL' : l === 'python' ? 'Python' : 'JavaScript'}
                {lang === l && (
                  <motion.div
                    layoutId="activeTab"
                    style={{
                      position: 'absolute',
                      bottom: -1,
                      left: '20%',
                      right: '20%',
                      height: '2px',
                      backgroundColor: '#d5fa78',
                      borderRadius: '2px'
                    }}
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={copied ? { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: '#22c55e' } : {}}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: 'transparent',
              color: copied ? '#22c55e' : '#9ca3af',
              border: `1px solid ${copied ? '#22c55e' : '#282c37'}`,
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s ease, border-color 0.2s ease'
            }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Check size={14} color="#22c55e" /> Copied!
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Copy size={14} /> Copy Code
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Code Content */}
        <AnimatePresence mode="wait">
          <motion.pre
            key={lang}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              backgroundColor: '#0a0b0d',
              color: '#f3f4f6',
              padding: '1.5rem',
              margin: 0,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              overflowX: 'auto'
            }}
          >
            {SNIPPETS[lang]}
          </motion.pre>
        </AnimatePresence>
      </div>
    </section>
  );
}

