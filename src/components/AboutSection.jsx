import React from 'react';
import { 
  User, GraduationCap, Award, Code, Globe, Terminal, Sparkles, ExternalLink, 
  CheckCircle2, Cpu, Rocket, Layers, Briefcase
} from 'lucide-react';
import Tilt3D from './Tilt3D';
import { UPPLogo } from './TrackIcons';

export default function AboutSection() {
  return (
    <div className="about-container anim-fade" style={{ maxWidth: 950, margin: '0 auto', padding: '20px 12px 60px' }}>
      
      {/* ── HEADER BANNER ────────────────────────────────────────── */}
      <Tilt3D depth={15}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(8,12,22,0.94) 50%, rgba(56,189,248,0.10) 100%)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 'var(--r-2xl)',
          padding: '36px 28px',
          marginBottom: 32,
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 24
        }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(245,158,11,0.15)',
              color: 'var(--amber)',
              padding: '5px 13px',
              borderRadius: 9999,
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 14
            }}>
              <Sparkles size={14} /> Developer & Creator
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#f1f5f9', marginBottom: 10, lineHeight: 1.1 }}>
              Himanshu Tokekar
            </h1>

            <p style={{ fontSize: '1rem', color: '#38bdf8', fontWeight: 700, marginBottom: 14 }}>
              Full-Stack Developer · M.Sc CS Student at Fergusson College
            </p>

            <p style={{ color: '#94a3b8', lineHeight: 1.65, fontSize: '0.92rem', maxWidth: 600 }}>
              Computer Science student passionate about building clean, performant web applications. Built <strong>Ultimate Placement Prep</strong> to help engineering candidates master technical interview concepts for campus placement drives.
            </p>

            {/* Direct Link to Portfolio */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
              <a
                href="https://himanshu-tokekar-dev.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-primary"
                style={{ textDecoration: 'none', padding: '10px 22px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Globe size={15} /> Visit My Portfolio <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 115,
              height: 115,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--amber), var(--sky))',
              padding: 3,
              boxShadow: '0 0 25px rgba(245,158,11,0.3)'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: '#080c14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--amber)',
                fontWeight: 900,
                fontSize: '2.2rem'
              }}>
                HT
              </div>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '0.74rem', padding: '5px 12px' }}>
              <CheckCircle2 size={12} /> Available for Work
            </span>
          </div>
        </div>
      </Tilt3D>

      {/* ── GRID: EDUCATION & TECH STACK ────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 32 }}>
        
        {/* Education & Experience Card */}
        <Tilt3D depth={15}>
          <div style={{
            background: 'linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(8,12,20,0.85) 50%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 'var(--r-xl)',
            padding: 24,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sky)' }}>
                <GraduationCap size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f1f5f9' }}>Education & Experience</h3>
                <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Background</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                <strong style={{ color: '#f1f5f9', fontSize: '0.88rem', display: 'block', marginBottom: 2 }}>M.Sc in Computer Science</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--amber)', fontWeight: 600 }}>Fergusson College, Pune (Currently Pursuing)</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                <strong style={{ color: '#f1f5f9', fontSize: '0.88rem', display: 'block', marginBottom: 2 }}>B.Sc in Computer Science</strong>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>NACASCA, Savitribai Phule Pune University</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                <strong style={{ color: '#f1f5f9', fontSize: '0.88rem', display: 'block', marginBottom: 2 }}>Web Dev Team Lead Intern</strong>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>AvinyaEdge Innovations</div>
              </div>
            </div>
          </div>
        </Tilt3D>

        {/* Tech Stack Card */}
        <Tilt3D depth={15}>
          <div style={{
            background: 'linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(8,12,20,0.85) 50%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 'var(--r-xl)',
            padding: 24,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald)' }}>
                <Cpu size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f1f5f9' }}>Technical Skills</h3>
                <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Tools & Technologies</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {['Java', 'Spring Boot', 'React.js', 'Node.js', 'MongoDB', 'SQL', 'JavaScript ES6+', 'React Native', 'Vite', 'Gemini AI API'].map(skill => (
                <span key={skill} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0',
                  padding: '5px 11px',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}>
                  {skill}
                </span>
              ))}
            </div>

            <div style={{ marginTop: 'auto', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', padding: 12, borderRadius: 10 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--amber)', fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Rocket size={14} /> Building for Students
              </div>
              <p style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Focused on creating practical learning platforms that bridge academic theory with placement interview requirements.
              </p>
            </div>
          </div>
        </Tilt3D>
      </div>

      {/* ── PORTFOLIO FOOTER LINK ────────────────────────────────────────── */}
      <div style={{
        textAlign: 'center',
        padding: 24,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 'var(--r-xl)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <UPPLogo size={22} />
          <span style={{ fontWeight: 800, color: '#f1f5f9', fontSize: '0.95rem' }}>Created by Himanshu Tokekar</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: 480, margin: '0 auto 16px' }}>
          Check out my portfolio for more projects and web development work.
        </p>
        <a
          href="https://himanshu-tokekar-dev.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(56,189,248,0.12)',
            border: '1px solid rgba(56,189,248,0.3)',
            color: 'var(--sky)',
            padding: '9px 20px',
            borderRadius: 9999,
            fontSize: '0.82rem',
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          <Globe size={14} /> himanshu-tokekar-dev.netlify.app <ExternalLink size={13} />
        </a>
      </div>

    </div>
  );
}
