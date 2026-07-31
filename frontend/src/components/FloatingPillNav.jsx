import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function FloatingPillNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'playground', label: 'Playground' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'code-switching', label: 'Code-Switching' },
    { id: 'benchmarks', label: 'Benchmarks' },
  ];

  const pillContainerRef = useRef(null);

  // Auto-scroll the active tab into center view inside the floating pill container
  useEffect(() => {
    if (!pillContainerRef.current) return;
    const activeBtn = pillContainerRef.current.querySelector('.pill-tab.active');
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab]);

  return (
    <motion.div 
      className="floating-nav-container"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <div className="floating-pill" ref={pillContainerRef}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pill-tab ${isActive ? 'active' : ''}`}
              style={{ position: 'relative' }}
            >
              {isActive && (
                <motion.div
                  layoutId="activePillTab"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: '#ffffff',
                    borderRadius: '9999px',
                    zIndex: 0
                  }}
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1, color: isActive ? '#0a0a0a' : undefined }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
