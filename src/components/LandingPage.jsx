import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Award, Sparkles, Zap, Brain, Mic, Database, Star, Check, Globe, ShieldCheck, UserCheck, LogIn } from 'lucide-react';
import AuthModal from './AuthModal';
import Tilt3D from './Tilt3D';
import { UPPLogo, TrackIcon, JavaIcon, SQLIcon, JSIcon, ReactIcon, CommIcon } from './TrackIcons';
import '../landing.css';

/* ─── Feature cards data ─── */
const FEATURES = [
  {
    icon: <Brain size={24} style={{ color: 'var(--amber)' }} />,
    title: 'Adaptive AI Mentor',
    desc: 'Wrong answer? Gemini Pro instantly diagnoses your exact misconception, explains why your choice was flawed, and provides a step-by-step correction — in your native language.',
    accent: 'rgba(245,158,11,1)',
    bg: 'rgba(245,158,11,0.10)',
  },
  {
    icon: <JavaIcon size={24} style={{ color: 'var(--emerald)' }} />,
    title: 'Java — 0 to Spring Boot',
    desc: 'JVM internals → OOP → Collections → Multithreading → JDBC → Hibernate → Spring Boot REST APIs & Microservices. 30 deep topics with annotated code.',
    accent: 'rgba(16,185,129,1)',
    bg: 'rgba(16,185,129,0.10)',
  },
  {
    icon: <SQLIcon size={24} style={{ color: '#38bdf8' }} />,
    title: 'SQL with Live Sandbox',
    desc: 'Learn JOINs, CTEs, Window Functions, Triggers, Anti-Patterns & Partitioning with a live in-browser SQLite engine — run real queries instantly.',
    accent: 'rgba(14,165,233,1)',
    bg: 'rgba(14,165,233,0.10)',
  },
  {
    icon: <JSIcon size={24} style={{ color: 'var(--violet)' }} />,
    title: 'JavaScript Mastery',
    desc: 'V8 Engine, Event Loop, Closures, Prototypes, WeakMap/WeakSet, TypeScript & ES6+ — all deeply explained with an editable live playground.',
    accent: 'rgba(139,92,246,1)',
    bg: 'rgba(139,92,246,0.10)',
  },
  {
    icon: <ReactIcon size={24} style={{ color: 'var(--rose)' }} />,
    title: 'React & Ecosystem',
    desc: 'Virtual DOM, Fiber reconciler, all Hooks, useMemo/useCallback, React Query, Error Boundaries, Testing Library, and Next.js App Router.',
    accent: 'rgba(244,63,94,1)',
    bg: 'rgba(244,63,94,0.10)',
  },
  {
    icon: <CommIcon size={24} style={{ color: 'var(--amber)' }} />,
    title: 'AI Voice Mock Interviews',
    desc: 'Speak your answer aloud. Gemini Pro evaluates your technical accuracy, English fluency, grammar, filler words, and provides a polished response.',
    accent: 'rgba(245,158,11,1)',
    bg: 'rgba(245,158,11,0.10)',
  },
  {
    icon: <Globe size={24} style={{ color: 'var(--emerald)' }} />,
    title: 'Native Language Support',
    desc: 'Every concept explained in Hinglish, Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, or Gujarati — with a listen-aloud audio button for each.',
    accent: 'rgba(16,185,129,1)',
    bg: 'rgba(16,185,129,0.10)',
  },
  {
    icon: <ShieldCheck size={24} style={{ color: 'var(--violet)' }} />,
    title: 'Placement-Ready Certification',
    desc: 'Complete all 105 topics to unlock Prepared Mode — a timed, full-length placement exam with HR rounds, SQL challenges, and readiness scoring.',
    accent: 'rgba(139,92,246,1)',
    bg: 'rgba(139,92,246,0.10)',
  },
];

const TRACKS = [
  { id: 'java', label: 'Java Ecosystem' },
  { id: 'sql', label: 'SQL & Databases' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'react', label: 'React.js' },
  { id: 'communication', label: 'Communication & HR' },
];

const TESTIMONIALS = [
  {
    text: "I had 2 months to prepare and zero Java knowledge. This platform took me from printing Hello World to building Spring Boot APIs. I got placed at a product-based company in Hyderabad.",
    author: "Aishwarya M.",
    role: "Placed at Oracle India",
  },
  {
    text: "The SQL sandbox is something else. I ran actual JOINs and saw the output immediately. Window functions finally clicked after the Gemini breakdown explained the exact difference between RANK and DENSE_RANK.",
    author: "Karan V.",
    role: "Data Analyst — Infosys BPM",
  },
  {
    text: "The voice mock interview feature gave me an 84/100 fluency score and pointed out my exact grammar mistakes. My real HR round felt like a replay.",
    author: "Priyanka S.",
    role: "Software Engineer — TCS Digital",
  },
];

/* ─────────────────────────────────────────────────────────
   Landing Page — Prominent Sign In & Sign Up Options
───────────────────────────────────────────────────────── */
export default function LandingPage({ onEnter }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab,  setAuthTab]  = useState('signin');
  const [scrolled, setScrolled] = useState(false);
  const [testIdx,  setTestIdx]  = useState(0);

  /* Testimonial auto-rotate */
  useEffect(() => {
    const t = setInterval(() => setTestIdx(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  /* Nav scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleInstantGuest = () => {
    onEnter({ name: 'Student Guest', email: 'guest@upp.local', isGuest: true });
  };

  const openSignIn = () => { setAuthTab('signin'); setAuthOpen(true); };
  const openSignUp = () => { setAuthTab('signup'); setAuthOpen(true); };

  return (
    <div className="landing-page">
      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <a className="nav-logo" href="#" onClick={(e) => { e.preventDefault(); handleInstantGuest(); }}>
            <div className="nav-logo-icon">
              <UPPLogo size={36} />
            </div>
            <span className="nav-logo-text">Ultimate Placement Prep</span>
          </a>
          <div className="nav-actions">
            <button className="btn btn-ghost" style={{ padding: '9px 16px', fontSize: '0.83rem' }} onClick={openSignIn}>
              <LogIn size={14} /> Sign In
            </button>
            <button className="btn btn-amber" style={{ padding: '9px 20px', fontSize: '0.83rem' }} onClick={openSignUp}>
              Get Started Free
            </button>
            <button className="btn btn-ghost" style={{ padding: '9px 14px', fontSize: '0.81rem', opacity: 0.8 }} onClick={handleInstantGuest}>
              Guest Demo
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-grid" />

        <div className="hero-eyebrow">
          <Sparkles size={13} /> Free · AI-Powered · 0 to Hero
        </div>

        <h1 className="hero-title">
          Your shortcut from{' '}
          <span className="gradient-text">confused student</span>
          <br />to confident engineer.
        </h1>

        <p className="hero-sub">
          Java, SQL, JavaScript, React and Communication — 105 in-depth topics mastered in weeks.
          AI explains why you're wrong, teaches in your native language, and coaches your voice.
        </p>

        <div className="hero-actions">
          <button className="btn-hero-primary" onClick={openSignUp}>
            Start Learning Free <ArrowRight size={18} />
          </button>
          <button className="btn-hero-secondary" onClick={openSignIn}>
            <LogIn size={16} /> Sign In to Account
          </button>
        </div>

        <div className="hero-track-pills">
          {TRACKS.map(t => (
            <div
              key={t.label}
              className="track-pill"
              onClick={handleInstantGuest}
              style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}
            >
              <TrackIcon trackId={t.id} size={15} /> {t.label}
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <div className="stats-strip">
        <div className="stat-item" onClick={handleInstantGuest} style={{ cursor: 'pointer' }}>
          <span className="big-num" style={{ color: 'var(--amber)' }}>105+</span>
          <span className="stat-lbl">In-Depth Topics</span>
        </div>
        <div className="stat-item" onClick={handleInstantGuest} style={{ cursor: 'pointer' }}>
          <span className="big-num" style={{ color: 'var(--emerald)' }}>8</span>
          <span className="stat-lbl">Native Languages</span>
        </div>
        <div className="stat-item" onClick={handleInstantGuest} style={{ cursor: 'pointer' }}>
          <span className="big-num" style={{ color: 'var(--sky)' }}>Live</span>
          <span className="stat-lbl">SQL & JS Sandbox</span>
        </div>
        <div className="stat-item" onClick={handleInstantGuest} style={{ cursor: 'pointer' }}>
          <span className="big-num" style={{ color: 'var(--violet)' }}>AI</span>
          <span className="stat-lbl">Powered Mentor</span>
        </div>
        <div className="stat-item" onClick={handleInstantGuest} style={{ cursor: 'pointer' }}>
          <span className="big-num" style={{ color: 'var(--rose)' }}>100%</span>
          <span className="stat-lbl">Free Forever</span>
        </div>
      </div>

      {/* ── FEATURES GRID ────────────────────────────────────── */}
      <section className="features-section">
        <div className="section-label">What's Inside</div>
        <h2 className="section-heading">Everything a placement candidate needs</h2>
        <p className="section-sub">
          Curated from hundreds of real placement interviews at top Indian product & service companies.
        </p>

        <div className="features-grid">
          {FEATURES.map(f => (
            <Tilt3D key={f.title} depth={20}>
              <div
                className="feature-card"
                onClick={handleInstantGuest}
                style={{ '--fc-accent': f.accent, height: '100%', cursor: 'pointer' }}
              >
                <div className="feature-icon" style={{ background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </Tilt3D>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="quote-section">
        <div className="section-label">Student Stories</div>
        <h2 className="section-heading">Placed. Confident. Prepared.</h2>

        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <Tilt3D depth={30}>
            <div className="quote-card">
              <div className="quote-mark">"</div>
              <p className="quote-text" key={testIdx} style={{ animation: 'fadeSlide 0.4s ease' }}>
                {TESTIMONIALS[testIdx].text}
              </p>
              <div className="quote-author">{TESTIMONIALS[testIdx].author}</div>
              <div className="quote-role">{TESTIMONIALS[testIdx].role}</div>

              {/* Dot indicators */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestIdx(i)}
                    style={{
                      width: i === testIdx ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      background: i === testIdx ? 'var(--amber)' : 'rgba(255, 255, 255, 0.05)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </Tilt3D>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <UPPLogo size={28} />
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Ultimate Placement Prep</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Empowering every student to crack their dream software placement offer.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-amber" style={{ padding: '12px 28px', fontSize: '0.88rem' }} onClick={openSignUp}>
              Start Free <ArrowRight size={16} />
            </button>
            <button className="btn btn-ghost" style={{ padding: '12px 24px', fontSize: '0.88rem' }} onClick={openSignIn}>
              Sign In
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {authOpen && (
        <AuthModal
          initialTab={authTab}
          onClose={() => setAuthOpen(false)}
          onSuccess={(user) => {
            setAuthOpen(false);
            onEnter(user);
          }}
        />
      )}
    </div>
  );
}
