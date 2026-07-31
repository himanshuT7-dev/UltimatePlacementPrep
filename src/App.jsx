import React, { useState, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
const LandingPage = React.lazy(() => import('./components/LandingPage'));
import LearnMode     from './components/LearnMode';
const PreparedMode = React.lazy(() => import('./components/PreparedMode'));
import FounderSettings from './components/FounderSettings';
import { UPPLogo } from './components/TrackIcons';
import LiquidMetalFilters from './components/LiquidMetalFilters';
import LiquidMetal3DCanvas from './components/LiquidMetal3DCanvas';
import CyberBackground from './components/CyberBackground';
import Tilt3D from './components/Tilt3D';
import ExportProgress from './components/ExportProgress';
import { getFounderKey } from './agents/pipeline';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import SearchModal from './components/SearchModal';
import { BookOpen, Award, Settings, LogOut, Languages, Heart, User, Lock, AlertTriangle, Mic, Search } from 'lucide-react';
import StudyPlanSelector from './components/StudyPlanSelector';
import ProgressDashboard, { getXpLevel } from './components/ProgressDashboard';
import { playSound } from './utils/sounds';

const MockInterview = React.lazy(() => import('./components/MockInterview'));

const LANGS = ['Hinglish','Hindi','Tamil','Telugu','Kannada','Marathi','Bengali','Gujarati'];

/* ─────────────────────────────────────────────────────────
   Dashboard — shown after login
───────────────────────────────────────────────────────── */
function Dashboard() {
  const { user, logout, progress, nativeLang, setNativeLang } = useAuth();
  const [tab,         setTab]         = useState('learn');
  const [founderOpen, setFounderOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchSelection, setSearchSelection] = useState(null);
  const hasKey = Boolean(getFounderKey());
  const level = getXpLevel(progress.xp || 0);

  useKeyboardShortcuts([
    { key: 'k', ctrl: true, action: () => setSearchOpen(true) }
  ]);

  return (
    <div className="app-container">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="header">
        <div className="max-w header-inner">
          {/* Logo */}
          <div className="logo">
            <div className="logo-icon" style={{ background: 'none', padding: 0, display: 'flex', alignItems: 'center' }}>
              <UPPLogo size={38} />
            </div>
            <div>
              <div className="logo-title">Ultimate Placement Prep</div>
              <div className="logo-sub">Java · SQL · JavaScript · React · Communication</div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="mode-tabs">
            <button
              className={`mode-tab ${tab === 'learn' ? 'active-learn' : ''}`}
              onClick={() => { playSound.click(); setTab('learn'); }}
            >
              <BookOpen size={14} /> Learn Mode
            </button>
            <button
              className={`mode-tab ${tab === 'prepared' ? 'active-prepared' : ''}`}
              onClick={() => { playSound.click(); setTab('prepared'); }}
            >
              <Award size={14} /> Prepared Mode
              {!progress.preparedModeUnlocked && <Lock size={12} style={{ marginLeft: 4 }} />}
            </button>
            <button
              className={`mode-tab ${tab === 'interview' ? 'active-prepared' : ''}`}
              onClick={() => { playSound.click(); setTab('interview'); }}
            >
              <Mic size={14} /> Mock Interview
            </button>
          </div>

          {/* Right */}
          <div className="header-right">
            <button
              className="btn btn-ghost"
              onClick={() => { playSound.click(); setSearchOpen(true); }}
              title="Search (Ctrl+K)"
              style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Search size={14} />
              <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>⌨️ Ctrl+K</span>
            </button>

            <div className="lang-selector">
              <Languages size={13} style={{ color: 'var(--amber)', flexShrink: 0 }} />
              <select value={nativeLang} onChange={e => setNativeLang(e.target.value)}>
                {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <button
              className="btn btn-ghost"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              onClick={() => { playSound.click(); setProgressOpen(true); }}
            >
              📊 Progress
            </button>

            <button
              className="btn btn-ghost"
              style={{
                padding: '8px 14px', fontSize: '0.8rem',
                ...(!hasKey ? { borderColor: 'rgba(245,158,11,0.4)', color: 'var(--amber)' } : {}),
              }}
              onClick={() => { playSound.click(); setFounderOpen(true); }}
              title="Founder Settings"
            >
              <Settings size={14} />
              {!hasKey && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', display: 'inline-block' }} />}
            </button>

            <ExportProgress />

            <div className="user-pill" style={{ gap: 6, display: 'flex', alignItems: 'center' }}>
              <span title={level.label} style={{ fontSize: '1rem', cursor: 'help' }}>{level.icon}</span>
              <User size={12} />
              <span>{user?.name}</span>
              {!user?.isGuest && (
                <button
                  title="Log out"
                  onClick={logout}
                  style={{ background: 'none', border: 'none', color: 'var(--amber)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, marginLeft: 4 }}
                >
                  <LogOut size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────── */}
      <main style={{ flex: 1 }}>
        <div className="max-w" style={{ paddingTop: 24, paddingBottom: 48 }}>

          {/* Welcome Banner */}
          <Tilt3D maxTilt={6} scale={1.01} style={{ marginBottom: 28 }}>
            <div className="welcome-banner">
              <div className="welcome-text">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Heart size={14} style={{ color: '#fb7185', fill: '#fb7185' }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Your Personal Mentor
                  </span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Welcome back, {user?.name || 'Student'}!</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.65, maxWidth: 520 }}>
                  Take a deep breath. You don't need to know everything today.
                  Every concept you master right now is one step closer to your placement offer. You've got this.
                </p>
                {user?.isGuest && (
                  <div className="info-box neutral" style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 14px', fontSize: '0.8rem' }}>
                    <AlertTriangle size={13} style={{ color: '#fbbf24' }} /> You're in Guest Mode — progress won't be saved. Sign up to track your journey.
                  </div>
                )}
                {!hasKey && !user?.isGuest && (
                  <div className="info-box neutral" style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 14px', fontSize: '0.8rem' }}>
                    <Settings size={13} /> Open ⚙ Founder Settings to enable AI-powered explanations.
                  </div>
                )}
              </div>

              <div className="welcome-stats">
                <div className="stat-pill">
                  <span className="num" style={{ color: '#fbbf24' }}>{progress.completedTopics.length}</span>
                  <span className="label">Topics Done</span>
                </div>
                <div className="stat-pill">
                  <span className="num" style={{ color: '#34d399' }}>{progress.masteryScore}%</span>
                  <span className="label">Mastery</span>
                </div>
              </div>
            </div>
          </Tilt3D>

          {/* Content */}
          {tab === 'learn'
            ? <LearnMode searchSelection={searchSelection} />
            : tab === 'prepared' 
              ? <Suspense fallback={<div className="loading-pulse" style={{ padding: '60px 0', justifyContent: 'center' }}><div className="spinner" />Loading...</div>}><PreparedMode onSwitchLearn={() => setTab('learn')} /></Suspense>
              : (
                <Suspense fallback={<div className="loading-pulse" style={{ padding: '60px 0', justifyContent: 'center' }}><div className="spinner" />Loading...</div>}>
                  <MockInterview />
                </Suspense>
              )
          }
        </div>
      </main>

      {founderOpen && <FounderSettings onClose={() => setFounderOpen(false)} />}
      {searchOpen && (
        <SearchModal
          onClose={() => setSearchOpen(false)}
          onSelect={(trackId, topicId) => {
            setTab('learn');
            setSearchSelection({ trackId, topicId, ts: Date.now() });
            setSearchOpen(false);
          }}
        />
      )}
      {!progress.studyPlan && <StudyPlanSelector forceSelection={true} />}
      {progressOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
          <div style={{ width: '100%', padding: '1rem' }}>
            <ProgressDashboard onClose={() => setProgressOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Root — gate between Landing and Dashboard
───────────────────────────────────────────────────────── */
function Root() {
  const { isLoggedIn, login } = useAuth();

  if (!isLoggedIn) {
    return (
      <Suspense fallback={<div className="loading-pulse" style={{ padding: '60px 0', justifyContent: 'center', height: '100vh' }}><div className="spinner" />Loading...</div>}>
        <LandingPage onEnter={(user) => login(user)} />
      </Suspense>
    );
  }

  return <Dashboard />;
}
import { ToastProvider } from './context/ToastContext';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <LiquidMetalFilters />
        <Root />
      </AuthProvider>
    </ToastProvider>
  );
}
