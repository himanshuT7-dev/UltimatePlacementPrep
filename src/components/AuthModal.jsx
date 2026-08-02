import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Check, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { UPPLogo } from './TrackIcons';
import useDialog from '../hooks/useDialog';

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

  const { dialogProps } = useDialog({ onClose });

  /* Guest */
  const handleGuest = () => {
    onSuccess({ name: 'Guest Student', email: 'guest@upp.local', isGuest: true });
  };

  /* Sign In Submit */
  const handleSignIn = async (e) => {
    e.preventDefault();
    setSiErr('');
    if (!siEmail.trim() || !siPass.trim()) { setSiErr('Please fill in all fields.'); return; }
    setSiLoad(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: siEmail, password: siPass })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      localStorage.setItem('upp_auth_token', data.token);
      onSuccess({ ...data.user, isGuest: false });
    } catch (err) {
      setSiErr(err.message);
    } finally {
      setSiLoad(false);
    }
  };

  /* Password validation helper */
  const validatePassword = (pass) => {
    return {
      hasMinLength: pass.length >= 8,
      hasUpper: /[A-Z]/.test(pass),
      hasNumber: /[0-9]/.test(pass),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };
  };

  /* Computed once per render (was called 4× per keystroke by the checklist). */
  const suPassValid = validatePassword(suPass);

  /* Derived per-field validation state (from the submit-time top-level error). */
  const siEmailInvalid = Boolean(siErr && !siEmail.trim());
  const siPassInvalid  = Boolean(siErr && !siPass.trim());
  const suNameInvalid  = Boolean(suErr && !suName.trim());
  const suEmailInvalid = Boolean(suErr && !suEmail.trim());
  const suPassInvalid  = Boolean(
    suErr && (suPass.length === 0 || !Object.values(suPassValid).every(Boolean))
  );

  /* Sign Up Submit */
  const handleSignUp = async (e) => {
    e.preventDefault();
    setSuErr('');
    if (!suName.trim() || !suEmail.trim() || !suPass.trim()) { setSuErr('Please fill in all fields.'); return; }
    
    const rules = validatePassword(suPass);
    if (!rules.hasMinLength) { setSuErr('Password must be at least 8 characters long.'); return; }
    if (!rules.hasUpper) { setSuErr('Password must contain at least 1 uppercase letter.'); return; }
    if (!rules.hasNumber) { setSuErr('Password must contain at least 1 number.'); return; }
    if (!rules.hasSpecial) { setSuErr('Password must contain at least 1 special character (!@#$%^&*).'); return; }

    setSuLoad(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: suEmail, password: suPass, name: suName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      localStorage.setItem('upp_auth_token', data.token);
      setStep('success');
    } catch (err) {
      setSuErr(err.message);
    } finally {
      setSuLoad(false);
    }
  };

  const handleSuccessDone = () => {
    onSuccess({ name: suName.trim(), email: suEmail.trim(), isGuest: false });
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div
        className="auth-card glass"
        {...dialogProps}
        aria-labelledby={step === 'success' ? 'auth-modal-success-title' : 'auth-modal-title'}
        style={{ maxWidth: 440, padding: 36, position: 'relative' }}
      >
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

            <h2 id="auth-modal-success-title" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Welcome, {suName}!</h2>
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
              <h2 id="auth-modal-title" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
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
                  <div className="info-box error" role="alert" aria-live="assertive" style={{ marginBottom: 4, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={14} /> {siErr}
                  </div>
                )}

                <div>
                  <label htmlFor="si-email" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="si-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      aria-required="true"
                      aria-invalid={siEmailInvalid}
                      aria-describedby={siEmailInvalid ? 'si-email-error' : undefined}
                      className="glass-input"
                      placeholder="you@college.edu"
                      value={siEmail}
                      onChange={e => setSiEmail(e.target.value)}
                      style={{ paddingLeft: 38 }}
                    />
                    <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                  {siEmailInvalid && (
                    <div id="si-email-error" style={{ fontSize: '0.72rem', color: 'var(--rose)', marginTop: 4 }}>
                      Email is required.
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="si-pass" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="si-pass"
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      aria-required="true"
                      aria-invalid={siPassInvalid}
                      aria-describedby={siPassInvalid ? 'si-pass-error' : undefined}
                      className="glass-input"
                      placeholder="••••••••"
                      value={siPass}
                      onChange={e => setSiPass(e.target.value)}
                      style={{ paddingLeft: 38 }}
                    />
                    <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                  {siPassInvalid && (
                    <div id="si-pass-error" style={{ fontSize: '0.72rem', color: 'var(--rose)', marginTop: 4 }}>
                      Password is required.
                    </div>
                  )}
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
                  <div className="info-box error" role="alert" aria-live="assertive" style={{ marginBottom: 4, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={14} /> {suErr}
                  </div>
                )}

                <div>
                  <label htmlFor="su-name" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Your Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="su-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      required
                      aria-required="true"
                      aria-invalid={suNameInvalid}
                      aria-describedby={suNameInvalid ? 'su-name-error' : undefined}
                      className="glass-input"
                      placeholder="Rahul Sharma"
                      value={suName}
                      onChange={e => setSuName(e.target.value)}
                      style={{ paddingLeft: 38 }}
                    />
                    <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                  {suNameInvalid && (
                    <div id="su-name-error" style={{ fontSize: '0.72rem', color: 'var(--rose)', marginTop: 4 }}>
                      Name is required.
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="su-email" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="su-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      aria-required="true"
                      aria-invalid={suEmailInvalid}
                      aria-describedby={suEmailInvalid ? 'su-email-error' : undefined}
                      className="glass-input"
                      placeholder="rahul@college.edu"
                      value={suEmail}
                      onChange={e => setSuEmail(e.target.value)}
                      style={{ paddingLeft: 38 }}
                    />
                    <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                  {suEmailInvalid && (
                    <div id="su-email-error" style={{ fontSize: '0.72rem', color: 'var(--rose)', marginTop: 4 }}>
                      Email is required.
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="su-pass" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Create Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="su-pass"
                      type="password"
                      name="new-password"
                      autoComplete="new-password"
                      required
                      aria-required="true"
                      aria-invalid={suPassInvalid}
                      aria-describedby={suPassInvalid ? 'su-pass-error' : undefined}
                      className="glass-input"
                      placeholder="Min 8 chars (A-Z, 0-9, !@#$)"
                      value={suPass}
                      onChange={e => setSuPass(e.target.value)}
                      style={{ paddingLeft: 38 }}
                    />
                    <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                  {suPassInvalid && (
                    <div id="su-pass-error" style={{ fontSize: '0.72rem', color: 'var(--rose)', marginTop: 4 }}>
                      Password must meet all the requirements below.
                    </div>
                  )}

                  {/* Password Requirements Checklist */}
                  {suPass.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 8, padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--r-md)', fontSize: '0.7rem' }}>
                      <div style={{ color: suPassValid.hasMinLength ? 'var(--emerald)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {suPassValid.hasMinLength ? <Check size={12} /> : '○'} 8+ Characters
                      </div>
                      <div style={{ color: suPassValid.hasUpper ? 'var(--emerald)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {suPassValid.hasUpper ? <Check size={12} /> : '○'} Uppercase (A-Z)
                      </div>
                      <div style={{ color: suPassValid.hasNumber ? 'var(--emerald)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {suPassValid.hasNumber ? <Check size={12} /> : '○'} Number (0-9)
                      </div>
                      <div style={{ color: suPassValid.hasSpecial ? 'var(--emerald)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {suPassValid.hasSpecial ? <Check size={12} /> : '○'} Special (!@#$)
                      </div>
                    </div>
                  )}
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
