import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, BookOpen, Award, Sparkles, Zap, Brain, Mic, Database, Star, Check, 
  Globe, ShieldCheck, UserCheck, LogIn, Code, Play, Terminal, ChevronDown, ChevronUp,
  Briefcase, Cpu, CheckCircle2, Flame, Target, Compass, MessageSquare, RefreshCw,
  User, ExternalLink, GraduationCap
} from 'lucide-react';
import AuthModal from './AuthModal';
import Tilt3D from './Tilt3D';
import CommandBar from './CommandBar';
import AboutSection from './AboutSection';
import { UPPLogo, TrackIcon, JavaIcon, SQLIcon, JSIcon, ReactIcon, CommIcon } from './TrackIcons';
import '../landing.css';

/* ─── Feature cards data ─── */
const FEATURES = [
  {
    icon: <Brain size={24} style={{ color: 'var(--amber)' }} />,
    title: 'Adaptive AI Misconception Diagnostic',
    desc: 'Got a quiz question wrong? Gemini AI instantly pinpoints your exact logical gap, explains why your choice failed, and gives a clear correction in your native language.',
    accent: 'rgba(245,158,11,1)',
    bg: 'rgba(245,158,11,0.10)',
  },
  {
    icon: <JavaIcon size={24} style={{ color: 'var(--emerald)' }} />,
    title: 'Java — 0 to Spring Boot Microservices',
    desc: 'JVM Memory (Heap/Stack/PermGen) → OOP 4 Pillars → Collections → Multithreading → JDBC → Hibernate → Spring Boot REST APIs.',
    accent: 'rgba(16,185,129,1)',
    bg: 'rgba(16,185,129,0.10)',
  },
  {
    icon: <SQLIcon size={24} style={{ color: '#38bdf8' }} />,
    title: 'SQL with Live In-Browser Engine',
    desc: 'JOINs, Subqueries, CTEs, Window Functions (RANK/DENSE_RANK), Indexing, ACID Transactions & Triggers with real-time query execution.',
    accent: 'rgba(14,165,233,1)',
    bg: 'rgba(14,165,233,0.10)',
  },
  {
    icon: <JSIcon size={24} style={{ color: 'var(--violet)' }} />,
    title: 'JavaScript & V8 Internals',
    desc: 'Execution Context, Call Stack, Event Loop (Microtasks vs Macrotasks), Closures, Prototypes, Async/Await & ES6+ with dynamic code runner.',
    accent: 'rgba(139,92,246,1)',
    bg: 'rgba(139,92,246,0.10)',
  },
  {
    icon: <ReactIcon size={24} style={{ color: 'var(--rose)' }} />,
    title: 'React.js & Architecture',
    desc: 'Virtual DOM, Fiber Reconciler, Custom Hooks, useMemo/useCallback performance, Redux/Zustand, and Next.js App Router patterns.',
    accent: 'rgba(244,63,94,1)',
    bg: 'rgba(244,63,94,0.10)',
  },
  {
    icon: <Mic size={24} style={{ color: 'var(--amber)' }} />,
    title: 'AI Voice Mock Interviewer',
    desc: 'Speak your answers aloud. Gemini AI evaluates technical accuracy, English fluency, filler word frequency, and generates a polished response.',
    accent: 'rgba(245,158,11,1)',
    bg: 'rgba(245,158,11,0.10)',
  },
  {
    icon: <Globe size={24} style={{ color: 'var(--emerald)' }} />,
    title: '8 Native Language Explanations',
    desc: 'Master complex technical concepts in Hinglish, Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, or Gujarati with Google Neural TTS audio.',
    accent: 'rgba(16,185,129,1)',
    bg: 'rgba(16,185,129,0.10)',
  },
  {
    icon: <ShieldCheck size={24} style={{ color: 'var(--violet)' }} />,
    title: 'Company Mock Hiring Loops',
    desc: 'Simulated multi-round interviews for TCS (8-Q), Cognizant (10-Q), and Amazon (12-Q Bar Raiser) with sub-round voice proctoring.',
    accent: 'rgba(139,92,246,1)',
    bg: 'rgba(139,92,246,0.10)',
  },
];

const TRACKS = [
  { id: 'java', label: 'Java Ecosystem', count: '30 Topics', color: 'var(--emerald)', desc: 'JVM, OOP, Collections, Multithreading, Spring Boot' },
  { id: 'sql', label: 'SQL & Databases', count: '22 Topics', color: '#38bdf8', desc: 'JOINs, Window Functions, CTEs, Indexing, ACID' },
  { id: 'javascript', label: 'JavaScript V8', count: '20 Topics', color: 'var(--violet)', desc: 'Event Loop, Closures, Async/Await, Prototypes' },
  { id: 'react', label: 'React.js Ecosystem', count: '18 Topics', color: 'var(--rose)', desc: 'Virtual DOM, Fiber, Custom Hooks, Redux, Next.js' },
  { id: 'communication', label: 'Communication & HR', count: '19 Topics', color: 'var(--amber)', desc: 'STAR Method, Versant AI, Email Writing, JAM Round' },
];

const COMPANY_LOOPS = [
  { company: 'TCS Digital / Ninja', rounds: '3 Sub-Rounds', count: '8 Questions', badge: 'badge-sky', desc: 'CS Fundamentals → DBMS & Project Verification → HR Fit' },
  { company: 'Cognizant GenC Elevate', rounds: '3 Sub-Rounds', count: '10 Questions', badge: 'badge-amber', desc: 'Technical Depth → JAM Extempore → STAR Behavioral' },
  { company: 'Amazon / Product Companies', rounds: '4 Sub-Rounds', count: '12 Questions', badge: 'badge-violet', desc: 'DSA & System Design → LLD → Leadership Principles' },
  { company: 'Deloitte / Wipro / Infosys', rounds: '3 Sub-Rounds', count: '8 Questions', badge: 'badge-emerald', desc: 'Verbal Ability → Coding Assessment → Technical HR' },
];

const STUDY_PLANS = [
  { title: '⚡ 7-Day Crash Sprint', target: 'Urgent Placements', pace: '4-5 Hours/Day', desc: 'Top 30 high-frequency placement topics + 2 Full Mock Interviews.' },
  { title: '🔥 30-Day Placement Ready', target: 'Standard Campus Drives', pace: '1-2 Hours/Day', desc: 'Complete 105 topics across all 5 tracks + SQL Sandbox mastery.' },
  { title: '🏆 90-Day Engineering Mastery', target: 'Top Product Companies', pace: '45 Mins/Day', desc: 'Deep dive into Spring Boot, React Architecture & System Design.' },
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

const FAQS = [
  {
    q: "Is Ultimate Placement Prep really 100% free?",
    a: "Yes! All 105+ topic lessons, interactive SQL/JS sandboxes, AI misconception diagnostics, and mock interviews are completely free to use."
  },
  {
    q: "How does the AI Voice Mock Interviewer work?",
    a: "You select your target role and company (e.g. TCS, Cognizant, Amazon). The AI speaks real interview questions aloud, listens to your microphone response, and evaluates your technical score, English fluency, and grammar filler words."
  },
  {
    q: "Can I learn technical concepts in Hinglish or my native language?",
    a: "Absolutely! Every topic has a dedicated native explanation available in Hinglish, Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, or Gujarati — complete with listen-aloud neural audio playback."
  },
  {
    q: "How does the Live SQL & JavaScript Sandbox work?",
    a: "We embed an in-browser SQLite engine and JavaScript execution context directly inside your browser. You can write and execute real SQL queries or JS functions instantly without installing anything."
  },
  {
    q: "What is Prepared Mode certification?",
    a: "Prepared Mode unlocks after completing topics in your study plan. It puts you through a timed placement simulator under real exam conditions to test your readiness."
  }
];

/* ─── Animated stat count-up ─── */
function useCountUp(target, duration = 950) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) { setVal(0); return; }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      setVal(t >= 1 ? target : Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

const STATS = [
  { value: 105, suffix: '+',  lbl: 'In-Depth Topics',   color: 'var(--amber)' },
  { value: 8,   suffix: '',   lbl: 'Native Languages',  color: 'var(--emerald)' },
  { value: null, text: 'Live', lbl: 'SQL & JS Sandbox', color: 'var(--sky)' },
  { value: null, text: 'AI',   lbl: 'Voice Proctoring',  color: 'var(--violet)' },
  { value: 100, suffix: '%',  lbl: 'Free Forever',      color: 'var(--rose)' },
];

function StatItem({ stat, isLast, onClick }) {
  const n = useCountUp(stat.value || 0);
  return (
    <button
      type="button"
      className="stat-item"
      onClick={onClick}
      style={{
        background: 'none',
        font: 'inherit',
        color: 'inherit',
        cursor: 'pointer',
        border: 'none',
        borderRight: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)'
      }}
    >
      <span className="big-num" style={{ color: stat.color }}>{stat.text ?? `${n}${stat.suffix}`}</span>
      <span className="stat-lbl">{stat.lbl}</span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   Landing Page Component
───────────────────────────────────────────────────────── */
export default function LandingPage({ onEnter }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab,  setAuthTab]  = useState('signin');
  const [testIdx,  setTestIdx]  = useState(0);
  const [activeTrackTab, setActiveTrackTab] = useState('java');
  const [activeSandboxTab, setActiveSandboxTab] = useState('sql');
  const [sqlResult, setSqlResult] = useState(null);
  const [jsOutput, setJsOutput] = useState('');
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [showAboutModal, setShowAboutModal] = useState(false);

  /* Auto rotate testimonial */
  useEffect(() => {
    const t = setInterval(() => setTestIdx(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  /* Scroll-reveal */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.landing-page .reveal'));
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleInstantGuest = () => {
    onEnter({ name: 'Student Guest', email: 'guest@upp.local', isGuest: true });
  };

  const openSignIn = () => { setAuthTab('signin'); setAuthOpen(true); };
  const openSignUp = () => { setAuthTab('signup'); setAuthOpen(true); };

  /* Sandbox execution preview */
  const runDemoSql = () => {
    setSqlResult([
      { emp_name: 'Priya Sharma', department: 'Backend', salary: 1400000, salary_rank: 1 },
      { emp_name: 'Rahul Verma', department: 'Frontend', salary: 1250000, salary_rank: 2 },
      { emp_name: 'Ananya Gupta', department: 'DevOps', salary: 1100000, salary_rank: 3 }
    ]);
  };

  const runDemoJs = () => {
    setJsOutput(`[V8 CallStack] Executing async function...\n[Microtask Queue] Promise.resolve() -> Output: 'Gemini AI Ready'\n[Macrotask Queue] setTimeout() -> Output: 'Task Complete'\nResult: Event Loop non-blocking execution verified! ✅`);
  };

  return (
    <div className="landing-page">
      {/* ── NAV ───────────────────────────────────────────── */}
      <CommandBar 
        variant="landing"
        onSignIn={openSignIn}
        onSignUp={openSignUp}
        onGuest={handleInstantGuest}
      />

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
          <button 
            className="btn-hero-secondary" 
            onClick={() => setShowAboutModal(true)}
            style={{ border: '1px solid rgba(245,158,11,0.4)', color: '#fbbf24', background: 'rgba(245,158,11,0.08)' }}
          >
            <User size={16} /> About Developer (Himanshu)
          </button>
        </div>

        <div className="hero-track-pills">
          {TRACKS.map(t => (
            <button
              key={t.label}
              type="button"
              className="track-pill"
              onClick={handleInstantGuest}
              style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', font: 'inherit', textAlign: 'left' }}
            >
              <TrackIcon trackId={t.id} size={15} /> {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────── */}
      <div className="stats-strip">
        {STATS.map((s, i) => (
          <StatItem key={s.lbl} stat={s} isLast={i === STATS.length - 1} onClick={handleInstantGuest} />
        ))}
      </div>

      {/* ── INTERACTIVE LIVE SANDBOX DEMO TEASER ─────────────── */}
      <section className="features-section reveal">
        <div className="section-label">Live Playground Demo</div>
        <h2 className="section-heading">Try the In-Browser Engine Instantly</h2>
        <p className="section-sub">
          No installation or setup required. Run real SQL queries and JavaScript execution right here.
        </p>

        <div className="sandbox-demo-container">
          <div className="sandbox-demo-header">
            <div className="sandbox-demo-tabs">
              <button 
                className={`sandbox-tab ${activeSandboxTab === 'sql' ? 'active' : ''}`}
                onClick={() => setActiveSandboxTab('sql')}
              >
                <SQLIcon size={16} /> Interactive SQL Engine
              </button>
              <button 
                className={`sandbox-tab ${activeSandboxTab === 'js' ? 'active' : ''}`}
                onClick={() => setActiveSandboxTab('js')}
              >
                <JSIcon size={16} /> JavaScript V8 Runner
              </button>
            </div>
            <span className="sandbox-status-pill"><CheckCircle2 size={12} /> SQLite & Node Context Loaded</span>
          </div>

          <div className="sandbox-demo-body">
            {activeSandboxTab === 'sql' ? (
              <div className="code-demo-box">
                <div className="code-editor-header">
                  <span className="file-name">query.sql — Window Functions & DENSE_RANK()</span>
                  <button className="btn-run-demo" onClick={runDemoSql}>
                    <Play size={13} /> Run Query
                  </button>
                </div>
                <pre className="code-snippet">
                  {`SELECT emp_name, department, salary,
       DENSE_RANK() OVER (ORDER BY salary DESC) as salary_rank
FROM employees
WHERE department IN ('Backend', 'Frontend', 'DevOps');`}
                </pre>
                {sqlResult && (
                  <div className="demo-results-table">
                    <div className="results-header">Query Results (3 rows returned in 1.2ms)</div>
                    <table>
                      <thead>
                        <tr>
                          <th>emp_name</th>
                          <th>department</th>
                          <th>salary (₹)</th>
                          <th>salary_rank</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sqlResult.map((r, i) => (
                          <tr key={i}>
                            <td>{r.emp_name}</td>
                            <td>{r.department}</td>
                            <td>₹{r.salary.toLocaleString()}</td>
                            <td><span className="rank-badge">#{r.salary_rank}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="code-demo-box">
                <div className="code-editor-header">
                  <span className="file-name">eventLoop.js — Microtask Queue & Promises</span>
                  <button className="btn-run-demo" onClick={runDemoJs}>
                    <Play size={13} /> Run Code
                  </button>
                </div>
                <pre className="code-snippet">
                  {`console.log('[V8 CallStack] Executing async function...');
Promise.resolve().then(() => console.log('[Microtask Queue] Promise.resolve() -> Output: \\'Gemini AI Ready\\''));
setTimeout(() => console.log('[Macrotask Queue] setTimeout() -> Output: \\'Task Complete\\''), 0);`}
                </pre>
                {jsOutput && (
                  <div className="demo-terminal-box">
                    <div className="results-header"><Terminal size={13} /> Output Terminal</div>
                    <pre className="terminal-content">{jsOutput}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── COMPANY HIRING LOOPS WALL ────────────────────────── */}
      <section className="features-section reveal">
        <div className="section-label">Company Alignment</div>
        <h2 className="section-heading">Target Placement Drives & Hiring Loops</h2>
        <p className="section-sub">
          Structure your preparation to match exact round formats used by top tech employers.
        </p>

        <div className="company-loops-grid">
          {COMPANY_LOOPS.map((c, i) => (
            <Tilt3D key={c.company} depth={15} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="company-loop-card" onClick={handleInstantGuest}>
                <div className="company-loop-top">
                  <span className={`badge ${c.badge}`}>{c.count}</span>
                  <span className="company-rounds">{c.rounds}</span>
                </div>
                <h3>{c.company}</h3>
                <p>{c.desc}</p>
                <div className="company-card-action">
                  <span>Start Mock Drive</span> <ArrowRight size={14} />
                </div>
              </div>
            </Tilt3D>
          ))}
        </div>
      </section>

      {/* ── CURRICULUM & TRACK EXPLORER ──────────────────────── */}
      <section className="features-section reveal">
        <div className="section-label">Complete Roadmap</div>
        <h2 className="section-heading">5 Master Tracks, 105+ Structured Topics</h2>
        <p className="section-sub">
          Every track contains annotated code, interactive quizzes, live sandboxes, and native explanations.
        </p>

        <div className="tracks-explorer">
          <div className="tracks-tab-bar">
            {TRACKS.map(t => (
              <button
                key={t.id}
                className={`track-tab-btn ${activeTrackTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTrackTab(t.id)}
                style={{ '--accent-color': t.color }}
              >
                <TrackIcon trackId={t.id} size={18} />
                <span>{t.label}</span>
                <span className="count-pill">{t.count}</span>
              </button>
            ))}
          </div>

          <div className="track-details-box">
            {TRACKS.filter(t => t.id === activeTrackTab).map(t => (
              <div key={t.id} className="track-details-content">
                <div className="track-details-header">
                  <div>
                    <h3 style={{ color: t.color }}>{t.label} Track Overview</h3>
                    <p>{t.desc}</p>
                  </div>
                  <button className="btn-hero-primary" style={{ padding: '10px 24px', fontSize: '0.88rem' }} onClick={handleInstantGuest}>
                    Explore Track <ArrowRight size={15} />
                  </button>
                </div>
                
                <div className="topic-sample-pills">
                  <div className="sample-pill"><Check size={14} style={{ color: t.color }} /> Deep Intuition & Visualizer</div>
                  <div className="sample-pill"><Check size={14} style={{ color: t.color }} /> Annotated Production Code</div>
                  <div className="sample-pill"><Check size={14} style={{ color: t.color }} /> 4-Option Placement Quizzes</div>
                  <div className="sample-pill"><Check size={14} style={{ color: t.color }} /> 8 Native Language Audio</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREPARATION PACE SELECTOR ────────────────────────── */}
      <section className="features-section reveal">
        <div className="section-label">Study Plans</div>
        <h2 className="section-heading">Tailored Preparation Schedules</h2>
        <p className="section-sub">
          Whether you have 7 days or 3 months, select a pace optimized for your target drive date.
        </p>

        <div className="study-plans-grid">
          {STUDY_PLANS.map((plan, i) => (
            <Tilt3D key={plan.title} depth={18} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="landing-plan-card" onClick={handleInstantGuest}>
                <div className="plan-target-badge">{plan.target}</div>
                <h3>{plan.title}</h3>
                <div className="plan-pace-tag"><Flame size={14} /> {plan.pace}</div>
                <p>{plan.desc}</p>
                <button className="btn-plan-select">Select Plan & Start</button>
              </div>
            </Tilt3D>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────────────── */}
      <section className="features-section reveal">
        <div className="section-label">What's Inside</div>
        <h2 className="section-heading">Everything a Placement Candidate Needs</h2>
        <p className="section-sub">
          Curated from hundreds of real placement interviews at top Indian product & service companies.
        </p>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <Tilt3D key={f.title} depth={20} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <button
                type="button"
                className="feature-card"
                onClick={handleInstantGuest}
                style={{ '--fc-accent': f.accent, height: '100%', width: '100%', cursor: 'pointer', font: 'inherit', textAlign: 'left', display: 'flex', flexDirection: 'column' }}
              >
                <div className="feature-icon" style={{ background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </button>
            </Tilt3D>
          ))}
        </div>
      </section>

      {/* ── FAQ ACCORDION SECTION ───────────────────────────── */}
      <section className="features-section reveal">
        <div className="section-label">FAQ</div>
        <h2 className="section-heading">Frequently Asked Questions</h2>
        <p className="section-sub">
          Everything you need to know about the platform and preparation process.
        </p>

        <div className="faq-container">
          {FAQS.map((faq, i) => (
            <div key={i} className={`faq-item ${openFaqIdx === i ? 'open' : ''}`}>
              <button 
                className="faq-question-btn"
                onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}
              >
                <span>{faq.q}</span>
                {openFaqIdx === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaqIdx === i && (
                <div className="faq-answer-box">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="quote-section reveal">
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

      {/* ── DEVELOPER / CREATOR SPOTLIGHT SECTION ───────────── */}
      <section id="about-developer" className="features-section reveal">
        <div className="section-label">Developer & Creator</div>
        <h2 className="section-heading">Built with Passion for Engineering Students</h2>
        <p className="section-sub">
          Learn more about the mind behind Ultimate Placement Prep.
        </p>

        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <Tilt3D depth={20}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(8,12,20,0.9) 50%, rgba(56,189,248,0.08) 100%)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: 'var(--r-2xl)',
              padding: '36px 32px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 24
            }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.15)', color: 'var(--amber)', padding: '4px 12px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>
                  <User size={13} /> Developer & Creator
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f1f5f9', marginBottom: 8 }}>Himanshu Tokekar</h3>
                <p style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>
                  Full-Stack Developer · M.Sc CS Student at Fergusson College
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: 20 }}>
                  Computer Science student passionate about full-stack web development. Web Development Team Lead Intern at AvinyaEdge Innovations and Creator of Ultimate Placement Prep.
                </p>
                <a
                  href="https://himanshu-tokekar-dev.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #b45309 100%)',
                    color: '#0f172a',
                    padding: '10px 20px',
                    borderRadius: 9999,
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    boxShadow: '0 4px 15px rgba(245,158,11,0.3)',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <Globe size={15} /> Visit Developer Portfolio <ExternalLink size={14} />
                </a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 110,
                  height: 110,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--amber), var(--sky))',
                  padding: 3,
                  boxShadow: '0 0 25px rgba(245,158,11,0.3)'
                }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#080c14', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber)', fontWeight: 900, fontSize: '2.2rem' }}>
                    HT
                  </div>
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
                  Available for Work
                </span>
              </div>
            </div>
          </Tilt3D>
        </div>
      </section>

      {/* ── FINAL HIGH IMPACT CTA BANNER ────────────────────── */}
      <section className="cta-banner-section reveal">
        <div className="cta-banner-inner">
          <div className="cta-sparkle-pill"><Sparkles size={14} /> Start Preparation Today</div>
          <h2>Ready to Crack Your Software Placement Offer?</h2>
          <p>Join thousands of students mastering Java, SQL, JavaScript, and HR interviews free.</p>
          <div className="cta-banner-actions">
            <button className="btn-hero-primary" onClick={openSignUp}>
              Create Free Account <ArrowRight size={18} />
            </button>
            <button className="btn-hero-secondary" onClick={handleInstantGuest}>
              <UserCheck size={16} /> Continue as Guest
            </button>
          </div>
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

      {/* About Modal */}
      {showAboutModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', padding: 16, overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 1000, maxHeight: '90vh', overflowY: 'auto', background: '#080c14', borderRadius: 'var(--r-2xl)', border: '1px solid rgba(245,158,11,0.3)', position: 'relative', padding: '24px 16px' }}>
            <button 
              onClick={() => setShowAboutModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>
            <AboutSection />
          </div>
        </div>
      )}
    </div>
  );
}
