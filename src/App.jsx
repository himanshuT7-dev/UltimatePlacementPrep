import React, { useState, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
function lazyWithRetry(componentImport) {
  return React.lazy(async () => {
    const pageHasAlreadyBeenReloaded = JSON.parse(
      sessionStorage.getItem('page_reloaded_for_new_build') || 'false'
    );
    try {
      const component = await componentImport();
      sessionStorage.setItem('page_reloaded_for_new_build', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenReloaded) {
        sessionStorage.setItem('page_reloaded_for_new_build', 'true');
        window.location.reload();
      }
      throw error;
    }
  });
}

const LandingPage = lazyWithRetry(() => import('./components/LandingPage'));
import LearnMode     from './components/LearnMode';
const PreparedMode = lazyWithRetry(() => import('./components/PreparedMode'));
import FounderSettings from './components/FounderSettings';
import { UPPLogo } from './components/TrackIcons';
import LiquidMetalFilters from './components/LiquidMetalFilters';
import Tilt3D from './components/Tilt3D';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import SearchModal from './components/SearchModal';
import { BookOpen, Award, Settings, LogOut, Languages, Heart, User, Lock, AlertTriangle, Mic, Search, Menu, X as XIcon, BarChart2 } from 'lucide-react';
import StudyPlanSelector from './components/StudyPlanSelector';
import ProgressDashboard, { getXpLevel } from './components/ProgressDashboard';
import { playSound } from './utils/sounds';

import AboutSection from './components/AboutSection';

const MockInterview = lazyWithRetry(() => import('./components/MockInterview'));
const AdminPortal = lazyWithRetry(() => import('./components/AdminPortal'));
import CommandBar from './components/CommandBar';

const LANGS = ['Hinglish','Hindi','Tamil','Telugu','Kannada','Marathi','Bengali','Gujarati'];

/* ─────────────────────────────────────────────────────────
   Dashboard — shown after login
───────────────────────────────────────────────────────── */
function Dashboard() {
  const { user, logout, progress, nativeLang, setNativeLang, voiceGender, setVoiceGender, initDone } = useAuth();
  const [tab,         setTab]         = useState('learn');
  const [founderOpen, setFounderOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchSelection, setSearchSelection] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const level = getXpLevel(progress.xp || 0);

  useKeyboardShortcuts([
    { key: 'k', ctrl: true, action: () => setSearchOpen(true) },
    { key: 'A', ctrl: true, action: () => setFounderOpen(true) } // Ctrl+Shift+A
  ]);

  return (
    <div className="app-container">
      <CommandBar
        activeTab={tab}
        onTabChange={setTab}
        onMenuToggle={() => setMobileMenuOpen(prev => !prev)} 
        onSearchClick={() => setSearchOpen(true)}
        onProgressClick={() => setProgressOpen(true)}
        xpLevel={level}
        completedTopics={progress.completedTopics.length}
      />

      {/* ── Main ───────────────────────────────────────────── */}
      <main style={{ flex: 1 }}>
        <div className="max-w" style={{ paddingTop: 80, paddingBottom: 48 }}>

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
            ? <LearnMode searchSelection={searchSelection} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
            : tab === 'about'
              ? <AboutSection />
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
      {initDone && !progress.studyPlan && <StudyPlanSelector forceSelection={true} />}
      {progressOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', overflowY: 'auto', padding: '16px' }}>
          <div style={{ width: '100%', maxWidth: 900, maxHeight: '90vh', overflowY: 'auto' }}>
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
  const { isLoggedIn, login, initDone } = useAuth();

  // If the user has a token but their session isn't fully cached/verified yet,
  // show a seamless loading state instead of flashing the Landing Page.
  if (!initDone && !isLoggedIn && localStorage.getItem('upp_auth_token')) {
    return (
      <div className="loading-pulse" style={{ padding: '60px 0', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner" />Loading workspace...
      </div>
    );
  }

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
  const isAdmin = window.location.pathname === '/admin';

  if (isAdmin) {
    return (
      <Suspense fallback={<div className="loading-pulse" style={{ padding: '60px 0', justifyContent: 'center', height: '100vh' }}><div className="spinner" />Loading...</div>}>
        <AdminPortal />
      </Suspense>
    );
  }

  return (
    <ToastProvider>
      <AuthProvider>
        <LiquidMetalFilters />
        <Root />
      </AuthProvider>
    </ToastProvider>
  );
}
