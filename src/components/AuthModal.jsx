import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Check, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { UPPLogo } from './TrackIcons';

export default function AuthModal({ initialTab = 'signup', onClose, onSuccess }) {
  const [tab,      setTab]      = useState(initialTab); // 'signin' | 'signup'
  const [step,     setStep]     = useState('form');     // 'form' | 'success'

  /* Sign In Form */
  const [siEmail,  setSiEmail]  = useState('');
  const [siPass,   setSiPass]   = useState('');
  const [siErr,    setSiErr]    = useState('');
  const [siLoad,   setSiLoad]   = useState(false);

  /* Sign Up Form */
  const [suName,   setSuName]   = useState('');
  const [suEmail,  setSuEmail]  = useState('');
  const [suPass,   setSuPass]   = useState('');
  const [suErr,    setSuErr]    = useState('');
  const [suLoad,   setSuLoad]   = useState(false);

  /* Guest */
  const handleGuest = () => {
    onSuccess({ name: 'Guest Student', email: 'guest@upp.local', isGuest: true });
  };

  /* Sign In Submit */
  const handleSignIn = (e) => {
    e.preventDefault();
    setSiErr('');
    if (!siEmail.trim() || !siPass.trim()) { setSiErr('Please fill in all fields.'); return; }
    setSiLoad(true);
    setTimeout(() => {
      setSiLoad(false);
      onSuccess({ name: siEmail.split('@')[0], email: siEmail, isGuest: false });
    }, 600);
  };

  /* Sign Up Submit */
  const handleSignUp = (e) => {
    e.preventDefault();
    setSuErr('');
    if (!suName.trim() || !suEmail.trim() || !suPass.trim()) { setSuErr('Please fill in all fields.'); return; }
    if (suPass.length < 6) { setSuErr('Password must be at least 6 characters.'); return; }
    setSuLoad(true);
    setTimeout(() => {
      setSuLoad(false);
      setStep('success');
    }, 700);
  };

  const handleSuccessDone = () => {
    onSuccess({ name: suName.trim(), email: suEmail.trim(), isGuest: false });
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-card glass" style={{ maxWidth: 440, padding: 36, position: 'relative' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>

        {step === 'success' ? (
          <div className="anim-fade" style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
              color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <CheckCircle2 size={28} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Welcome, {suName}!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 24 }}>
              Your Ultimate Placement Prep account is ready. Your progress will be saved automatically as you complete topics.
            </p>

            <button className="btn btn-amber" style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }} onClick={handleSuccessDone}>
              Start Learning Now <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <UPPLogo size={42} />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                {tab === 'signin' ? 'Welcome Back' : 'Join the Journey'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: 4 }}>
                {tab === 'signin'
                  ? 'Sign in to sync your topics, quizzes and voice mock interview scores'
                  : 'Start your journey from 0 to placed software engineer'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div style={{
              display: 'flex', background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--glass-border)', borderRadius: 'var(--r-xl)',
              padding: 4, marginBottom: 24, gap: 4,
            }}>
              <button
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 'var(--r-lg)',
                  fontSize: '0.82rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                  background: tab === 'signin' ? 'linear-gradient(135deg, var(--amber), var(--amber-dark))' : 'transparent',
                  color: tab === 'signin' ? 'var(--text-on-amber)' : 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => { setTab('signin'); setSiErr(''); }}
              >
                Sign In
              </button>
              <button
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 'var(--r-lg)',
                  fontSize: '0.82rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                  background: tab === 'signup' ? 'linear-gradient(135deg, var(--amber), var(--amber-dark))' : 'transparent',
                  color: tab === 'signup' ? 'var(--text-on-amber)' : 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => { setTab('signup'); setSuErr(''); }}
              >
                Sign Up Free
              </button>
            </div>

            {/* Sign In Form */}
            {tab === 'signin' && (
              <form onSubmit={handleSignIn} className="anim-fade" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {siErr && (
                  <div className="info-box error" style={{ marginBottom: 4, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={14} /> {siErr}
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="glass-input"
                      placeholder="you@college.edu"
                      value={siEmail}
                      onChange={e => setSiEmail(e.target.value)}
                      style={{ paddingLeft: 38 }}
                    />
                    <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      className="glass-input"
                      placeholder="••••••••"
                      value={siPass}
                      onChange={e => setSiPass(e.target.value)}
                      style={{ paddingLeft: 38 }}
                    />
                    <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <button type="submit" className="btn btn-amber" style={{ width: '100%', padding: '12px', marginTop: 6, fontSize: '0.88rem' }} disabled={siLoad}>
                  {siLoad ? 'Signing In…' : 'Sign In'}
                </button>
              </form>
            )}

            {/* Sign Up Form */}
            {tab === 'signup' && (
              <form onSubmit={handleSignUp} className="anim-fade" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {suErr && (
                  <div className="info-box error" style={{ marginBottom: 4, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={14} /> {suErr}
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Your Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="Rahul Sharma"
                      value={suName}
                      onChange={e => setSuName(e.target.value)}
                      style={{ paddingLeft: 38 }}
                    />
                    <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="glass-input"
                      placeholder="rahul@college.edu"
                      value={suEmail}
                      onChange={e => setSuEmail(e.target.value)}
                      style={{ paddingLeft: 38 }}
                    />
                    <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Create Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      className="glass-input"
                      placeholder="At least 6 characters"
                      value={suPass}
                      onChange={e => setSuPass(e.target.value)}
                      style={{ paddingLeft: 38 }}
                    />
                    <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <button type="submit" className="btn btn-amber" style={{ width: '100%', padding: '12px', marginTop: 6, fontSize: '0.88rem' }} disabled={suLoad}>
                  {suLoad ? 'Creating Account…' : 'Create Free Account'}
                </button>
              </form>
            )}

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 16px' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--glass-border)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'var(--glass-border)' }} />
            </div>

            {/* Guest Mode CTA */}
            <button
              className="btn btn-ghost"
              style={{ width: '100%', padding: '10px', fontSize: '0.82rem', justifyContent: 'center' }}
              onClick={handleGuest}
            >
              Continue as Guest (No Sign Up Needed)
            </button>
          </>
        )}
      </div>
    </div>
  );
}
