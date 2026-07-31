import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Linkedin, Globe, Users } from 'lucide-react';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Ayush Kumar',
    role: 'Team Lead & UI/UX Specialist',
    avatar: '/avatars/cc.jpeg',
    bio: 'Leads the project vision and shapes the full user experience — from interaction design and motion systems to overall product direction. Ensures every UI component feels intuitive, premium, and cohesive.',
    skills: ['UI/UX Design', 'React', 'Framer Motion', 'System Design'],
    socials: {
      github: 'https://github.com/ayush60728',
      linkedin: 'https://www.linkedin.com/in/ayush-kumar-13a0b2336/',
    },
  },
  {
    id: 2,
    name: 'Prasanna Pratap Singh',
    role: 'Full Stack & Devops Engineer',
    avatar: '/avatars/Prasanna_pic.jpeg',
    bio: 'Builds the end-to-end application stack — connecting the AI backend to a responsive, high-performance frontend. Owns API integration, state management, and the real-time telemetry pipeline.',
    skills: ['React', 'Node.js', 'REST APIs', 'Vite'],
    socials: {
      github: 'https://github.com/prasannaPratapSingh',
      linkedin: 'https://www.linkedin.com/in/prasanna-pratap-singh-323238318/',
    },
  },
  {
    id: 3,
    name: 'Divyanshu Kumar Gupta',
    role: 'ML Engineer',
    avatar: '/avatars/divyanshu_pic.jpeg',
    bio: 'Designs and trains the dual-branch transformer models for Hinglish and English AI detection. Handles dataset curation, fine-tuning on RoBERTa checkpoints, and model evaluation pipelines.',
    skills: ['PyTorch', 'Transformers', 'NLP', 'Fine-tuning'],
    socials: {
      github: 'https://github.com/DivyanshuKumarGupta',
      linkedin: 'https://www.linkedin.com/in/divyanshu-kumar-gupta-093805308/',
    },
  },
  {
    id: 4,
    name: 'Jay Chaturvedi',
    role: 'Backend Engineer',
    avatar: '/avatars/jay_pic.jpeg',
    bio: 'Engineers the high-performance inference server and deployment infrastructure. Responsible for FastAPI endpoints, Docker containerization, and optimizing model serving latency at scale.',
    skills: ['FastAPI', 'Docker', 'Python', 'ONNX Runtime'],
    socials: {
      github: 'https://github.com/jayredis',
      linkedin: 'https://www.linkedin.com/in/jay-chaturvedi-8a731b33b/',
    },
  },
];

export default function SystemInfoModal({ isOpen, onClose }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.84)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            overflow: 'hidden',
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            style={{
              backgroundColor: '#101216',
              border: '1px solid rgba(213, 250, 120, 0.4)',
              borderRadius: '20px',
              maxWidth: '1360px',
              width: '95vw',
              maxHeight: 'min(92vh, 820px)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 30px rgba(213, 250, 120, 0.08)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* ── Header inside modal ── */}
            <div style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid #1e222a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              flexShrink: 0,
              backgroundColor: '#0c0e11',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#d5fa78',
                  color: '#0a0a0a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '900',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '1.3rem',
                  flexShrink: 0,
                  boxShadow: '0 0 16px rgba(213, 250, 120, 0.4)',
                }}>
                  <Users size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.01em' }}>
                    Project Team &amp; Contributors
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '2px' }}>
                    The engineering team building the IndicDetect Dual-Branch AI Engine
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  backgroundColor: '#181b22',
                  border: '1px solid #2b303c',
                  color: '#9ca3af',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#d5fa78';
                  e.currentTarget.style.color = '#0a0a0a';
                  e.currentTarget.style.borderColor = '#d5fa78';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#181b22';
                  e.currentTarget.style.color = '#9ca3af';
                  e.currentTarget.style.borderColor = '#2b303c';
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Scrollable Body Area - 4 Cards Widescreen ── */}
            <div
              style={{
                overflowY: 'auto',
                flex: 1,
                padding: '1.75rem',
              }}
              className="modal-scroll-body"
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.25rem',
              }}>
                {TEAM_MEMBERS.map((member) => (
                  <motion.div
                    key={member.id}
                    whileHover={{ y: -4, borderColor: '#d5fa78' }}
                    transition={{ duration: 0.2 }}
                    style={{
                      backgroundColor: '#0b0d10',
                      border: '1px solid #1f242e',
                      borderRadius: '16px',
                      padding: '1.35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Member Top Profile */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                          <img
                            src={member.avatar}
                            alt={member.name}
                            style={{
                              width: '64px',
                              height: '64px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid #d5fa78',
                              boxShadow: '0 0 14px rgba(213, 250, 120, 0.3)',
                            }}
                          />
                          <span style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#22c55e',
                            borderRadius: '50%',
                            border: '2px solid #0b0d10',
                          }} />
                        </div>

                        <div>
                          <h5 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
                            {member.name}
                          </h5>
                          <span style={{
                            display: 'inline-block',
                            marginTop: '4px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(213, 250, 120, 0.12)',
                            color: '#d5fa78',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            fontFamily: 'JetBrains Mono, monospace',
                            border: '1px solid rgba(213, 250, 120, 0.25)',
                          }}>
                            {member.role}
                          </span>
                        </div>
                      </div>

                      {/* Member Bio */}
                      <p style={{
                        fontSize: '0.83rem',
                        color: '#9ca3af',
                        lineHeight: '1.55',
                        marginBottom: '1rem',
                        minHeight: '52px',
                      }}>
                        {member.bio}
                      </p>

                    </div>

                    {/* Social Links Footer */}
                    <div style={{
                      borderTop: '1px solid #1b2029',
                      paddingTop: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <span style={{ fontSize: '0.72rem', color: '#6b7280', fontFamily: 'JetBrains Mono, monospace' }}>
                        CONNECT:
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {member.socials.github && (
                          <a
                            href={member.socials.github}
                            target="_blank"
                            rel="noreferrer"
                            title="GitHub Profile"
                            style={{
                              color: '#9ca3af',
                              backgroundColor: '#161922',
                              border: '1px solid #262b38',
                              borderRadius: '6px',
                              padding: '5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.color = '#ffffff';
                              e.currentTarget.style.borderColor = '#d5fa78';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.color = '#9ca3af';
                              e.currentTarget.style.borderColor = '#262b38';
                            }}
                          >
                            <Github size={15} />
                          </a>
                        )}

                        {member.socials.linkedin && (
                          <a
                            href={member.socials.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            title="LinkedIn Profile"
                            style={{
                              color: '#9ca3af',
                              backgroundColor: '#161922',
                              border: '1px solid #262b38',
                              borderRadius: '6px',
                              padding: '5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.color = '#38bdf8';
                              e.currentTarget.style.borderColor = '#38bdf8';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.color = '#9ca3af';
                              e.currentTarget.style.borderColor = '#262b38';
                            }}
                          >
                            <Linkedin size={15} />
                          </a>
                        )}

                        {member.socials.portfolio && (
                          <a
                            href={member.socials.portfolio}
                            target="_blank"
                            rel="noreferrer"
                            title="Personal Website"
                            style={{
                              color: '#9ca3af',
                              backgroundColor: '#161922',
                              border: '1px solid #262b38',
                              borderRadius: '6px',
                              padding: '5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.color = '#d5fa78';
                              e.currentTarget.style.borderColor = '#d5fa78';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.color = '#9ca3af';
                              e.currentTarget.style.borderColor = '#262b38';
                            }}
                          >
                            <Globe size={15} />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Slim scrollbar style scoped to modal body */}
          <style>{`
            .modal-scroll-body::-webkit-scrollbar {
              width: 6px;
            }
            .modal-scroll-body::-webkit-scrollbar-track {
              background: transparent;
              margin-block: 10px;
              border-radius: 4px;
            }
            .modal-scroll-body::-webkit-scrollbar-thumb {
              background: #2b303c;
              border-radius: 9999px;
            }
            .modal-scroll-body::-webkit-scrollbar-thumb:hover {
              background: #d5fa78;
            }
            .modal-scroll-body {
              scrollbar-width: thin;
              scrollbar-color: #2b303c transparent;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

