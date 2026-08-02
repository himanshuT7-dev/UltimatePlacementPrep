import React, { useState, useEffect, useRef } from 'react';
import { UPPLogo } from './TrackIcons';
import { Languages, LogOut, Menu, Flame, Search, BarChart2, BookOpen, Mic, Award, Lock, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LANGS = ['English','Hindi','Tamil','Telugu','Kannada','Marathi','Bengali','Gujarati'];
const LANG_CODES = {
  'English': 'en', 'Hindi': 'hi', 'Tamil': 'ta', 'Telugu': 'te',
  'Kannada': 'kn', 'Marathi': 'mr', 'Bengali': 'bn', 'Gujarati': 'gu'
};

const TABS = [
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'interview', label: 'Mock Interview', icon: Mic },
  { id: 'prepared', label: 'Prepared Mode', icon: Award, locked: true },
  { id: 'about', label: 'About', icon: User },
];

export default function CommandBar({
  activeTab,
  onTabChange,
  onMenuToggle,
  onSearchClick,
  onProgressClick,
  xpLevel,
  completedTopics = 0,
  variant = 'dashboard',
  onSignIn,
  onSignUp,
  onGuest
}) {
  const { user, progress, logout } = useAuth();
  const [currentLang, setCurrentLang] = useState('English');
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef(null);
  const rafRef = useRef(null);

  // rAF-throttled shine: writes CSS custom properties straight to the DOM so
  // React never re-renders on mousemove (previously setShine every move).
  const handleMouseMove = (e) => {
    if (rafRef.current) return; // at most one update per frame
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = navRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--shine-x', `${x}%`);
      el.style.setProperty('--shine-y', `${y}%`);
      el.style.setProperty('--shine-opacity', '1');
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const el = navRef.current;
    if (!el) return;
    el.style.setProperty('--shine-opacity', '0');
  };

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match) {
      const code = match[1];
      const langName = Object.keys(LANG_CODES).find(k => LANG_CODES[k] === code);
      if (langName) setCurrentLang(langName);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLangChange = (lang) => {
    setCurrentLang(lang);
    setLangOpen(false);
    const code = LANG_CODES[lang] || 'en';
    if (code === 'en') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
    } else {
      document.cookie = `googtrans=/en/${code}; path=/;`;
    }
    setTimeout(() => window.location.reload(), 50);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`command-bar liquid-metal-nav ${scrolled ? 'scrolled' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Liquid Metal Specular Glare (Contained) */}
        <div className="cb-glare-container">
          <div
            aria-hidden="true"
            className="cb-specular-glare"
            style={{
              background: 'radial-gradient(400px circle at var(--shine-x, 50%) var(--shine-y, 50%), rgba(255, 255, 255, 0.18) 0%, rgba(56, 189, 248, 0.08) 35%, transparent 75%)',
              opacity: 'var(--shine-opacity, 0)'
            }}
          />
        </div>

        <div className="cb-inner">

          {/* Left: Logo + Name */}
          <div className="cb-left">
            {onMenuToggle && (
              <button className="cb-icon-btn cb-mobile-menu" onClick={onMenuToggle} aria-label="Toggle sidebar">
                <Menu size={18} />
              </button>
            )}
            <div className="cb-logo">
              <UPPLogo size={26} />
            </div>
            <span className="cb-brand">
              UPP<span className="cb-brand-dot">.</span>
            </span>
            {variant === 'dashboard' && progress?.streakDays > 0 && (
              <div className="cb-streak">
                <Flame size={13} fill="#f97316" /> {progress.streakDays}
              </div>
            )}
            {variant === 'dashboard' && xpLevel && (
              <div className="cb-level">
                {xpLevel.name}
              </div>
            )}
          </div>

          {/* Center: Mode Tabs (Dashboard only) */}
          {variant === 'dashboard' && (
            <div className="cb-tabs">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isLocked = tab.locked && completedTopics < 100;
                return (
                  <button
                    key={tab.id}
                    className={`cb-tab ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                  >
                    <Icon size={16} />
                    <span className="cb-tab-label">{tab.label}</span>
                    {isLocked && <Lock size={11} className="cb-lock-icon" />}
                    {isActive && <div className="cb-tab-indicator" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Right: Actions */}
          <div className="cb-right">
            {variant === 'dashboard' ? (
              <>
                {onSearchClick && (
                  <button className="cb-icon-btn cb-search-btn" onClick={onSearchClick} title="Search (Ctrl+K)">
                    <Search size={16} />
                    <span className="cb-btn-text">Search</span>
                  </button>
                )}

                {onProgressClick && (
                  <button className="cb-icon-btn cb-progress-btn" onClick={onProgressClick} title="View Progress">
                    <BarChart2 size={16} />
                    <span className="cb-btn-text">Progress</span>
                  </button>
                )}

                <button
                  type="button"
                  className="cb-lang-wrap"
                  onClick={() => setLangOpen(!langOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={langOpen}
                  style={{ border: 'none', font: 'inherit', textAlign: 'left' }}
                >
                  <Languages size={14} />
                  <span className="cb-btn-text">{currentLang}</span>
                  <ChevronDown size={12} style={{ opacity: 0.5, transition: 'transform 0.2s', transform: langOpen ? 'rotate(180deg)' : 'none' }} />

                  {langOpen && (
                    <div className="cb-lang-dropdown" role="listbox" aria-label="Choose language" onClick={e => e.stopPropagation()}>
                      {LANGS.map(l => (
                        <button
                          key={l}
                          role="option"
                          aria-selected={currentLang === l}
                          className={`cb-lang-option ${currentLang === l ? 'active' : ''}`}
                          onClick={() => handleLangChange(l)}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  )}
                </button>

                {user?.name && (
                  <div className="cb-user-avatar" title={user.name}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <button className="cb-icon-btn cb-logout-btn" onClick={logout} title="Logout">
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <>
                <button
                  className="cb-action-btn ghost"
                  onClick={() => {
                    const el = document.getElementById('about-developer');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else window.open('https://himanshu-tokekar-dev.netlify.app', '_blank');
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <User size={14} /> About Developer
                </button>
                <button className="cb-action-btn" onClick={onSignIn} style={{ '--btn-color': '56, 189, 248' }}>Sign In</button>
                <button className="cb-action-btn primary" onClick={onSignUp} style={{ '--btn-color': '251, 191, 36' }}>Get Started Free</button>
                <button className="cb-action-btn ghost" onClick={onGuest}>Guest Demo</button>
              </>
            )}
          </div>

        </div>
      </nav>

      {/* Click-away for lang dropdown */}
      {langOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setLangOpen(false)} />}
    </>
  );
}
