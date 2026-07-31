import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './components/Header';
import Hero from './components/Hero';
import Playground from './components/Playground';
import ArchitectureVisualizer from './components/ArchitectureVisualizer';
import CodeSwitchingSuite from './components/CodeSwitchingSuite';
import BenchmarkComparison from './components/BenchmarkComparison';
import FloatingPillNav from './components/FloatingPillNav';
import SystemInfoModal from './components/SystemInfoModal';
import CustomCursor from './components/CustomCursor';

gsap.registerPlugin(ScrollTrigger);

// Map section IDs to pill tab IDs
const SECTIONS = [
  'playground',
  'architecture',
  'code-switching',
  'benchmarks',
];

export default function App() {
  const [activeTab, setActiveTab] = useState('playground');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  // Flag to suppress observer during programmatic scroll
  const isProgrammaticScroll = useRef(false);

  // Page-load entrance animation
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      'header',
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    ).fromTo(
      '.hero-canvas',
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' },
      '-=0.3'
    );
  }, []);

  // IntersectionObserver & Scroll Listener: update active pill tab as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;

      // When near top of page (Hero area), activate 'playground' tab
      if (window.scrollY < 250) {
        setActiveTab('playground');
        return;
      }

      // When at bottom of page, activate 'api' tab
      const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
      if (isAtBottom) {
        setActiveTab('api');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const observers = [];
    SECTIONS.forEach((sectionId) => {
      const el = document.getElementById(`${sectionId}-section`);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (isProgrammaticScroll.current) return;
          if (window.scrollY < 250) {
            setActiveTab('playground');
            return;
          }
          if (entry.isIntersecting) {
            setActiveTab(sectionId);
          }
        },
        {
          root: null,
          rootMargin: '-15% 0px -35% 0px',
          threshold: 0.2,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    // Suppress observer during programmatic smooth scroll (~800ms)
    isProgrammaticScroll.current = true;
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 900);

    if (tabId === 'playground') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const targetSection = document.getElementById(`${tabId}-section`);
      if (targetSection) {
        const yOffset = -70; // sticky header height offset
        const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0b0d', color: '#f3f4f6' }}>
      {/* Premium Custom Cursor */}
      <CustomCursor />

      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenConsole={() => setIsInfoModalOpen(true)}
      />

      {/* Hero Header Section matching Image Reference */}
      <Hero
        onExplorePlayground={() => handleTabChange('playground')}
        onOpenConsole={() => setIsInfoModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main style={{ paddingBottom: '4rem' }}>
        <Playground />

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ height: '1px', backgroundColor: '#1a1d24', margin: '2rem 0', transformOrigin: 'center' }}
        />

        <ArchitectureVisualizer />

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ height: '1px', backgroundColor: '#1a1d24', margin: '2rem 0', transformOrigin: 'center' }}
        />

        <CodeSwitchingSuite />

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ height: '1px', backgroundColor: '#1a1d24', margin: '2rem 0', transformOrigin: 'center' }}
        />

        <BenchmarkComparison />

      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        style={{
          borderTop: '1px solid #1a1d24',
          padding: '3rem 2rem 6rem 2rem',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.9rem',
          backgroundColor: '#07080a'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
            <motion.span
              whileHover={{ scale: 1.1, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{ backgroundColor: '#d5fa78', color: '#0a0a0a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', display: 'inline-block', cursor: 'default' }}
            >I</motion.span>
            IndicDetect Dual-Branch AI Engine
          </div>
          <p style={{ maxWidth: '600px', fontSize: '0.85rem' }}>
            Built for Hinglish &amp; English AI text detection with code-switching telemetry. Trained on L3Cube-Pune corpus &amp; RoBERTa checkpoints.
          </p>
          <div style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: '#4b5563', marginTop: '0.5rem' }}>
            IndicDetect v2.0 · Open Console for System Specs
          </div>
        </div>
      </motion.footer>

      {/* Signature Floating Bottom Pill Navigation (Image Reference) */}
      <FloatingPillNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
      />

      {/* Technical Specifications Modal Drawer */}
      <SystemInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}
