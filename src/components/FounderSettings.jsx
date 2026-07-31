import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Activity, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { getFounderKey, setFounderKey, testConnection } from '../agents/pipeline';

export default function FounderSettings({ onClose }) {
  const [key,     setKey]     = useState('');
  const [show,    setShow]    = useState(false);
  const [status,  setStatus]  = useState(null); // { ok, msg }
  const [testing, setTesting] = useState(false);

  useEffect(() => { setKey(getFounderKey()); }, []);

  const handleTest = async () => {
    if (!key.trim()) { setStatus({ ok: false, msg: 'Please enter a key first.' }); return; }
    setTesting(true); setStatus(null);
    const r = await testConnection(key.trim());
    setStatus(r); setTesting(false);
  };

  const handleSave = () => {
    setFounderKey(key.trim());
    setStatus({ ok: true, msg: 'API Key saved! All AI features (Deep Dive, Quiz Gen, Voice Eval) are now active.' });
  };

  const handleClear = () => {
    setFounderKey('');
    setKey('');
    setStatus({ ok: false, msg: 'Key cleared. AI features are disabled.' });
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box founder-modal">
        <button className="modal-close" onClick={onClose}><X size={16} /></button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <Key size={22} style={{ color: 'var(--amber)' }} />
          <h2 className="modal-title">Founder & Platform Settings</h2>
        </div>
        <p className="modal-sub">Configure your Master Gemini Pro API Key — powers all AI features</p>

        <div className="settings-grid">
          {/* Key Input */}
          <div className="input-group">
            <label>Master Gemini Pro API Key</label>
            <div className="input-wrap">
              <input
                type={show ? 'text' : 'password'}
                className="glass-input"
                value={key}
                onChange={e => setKey(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                placeholder="AIzaSy…"
                style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem' }}
              />
              <button className="input-eye" onClick={() => setShow(!show)}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.55 }}>
              Powers: Deep Dive explanations · AI Quiz Generator · Voice Interview Evaluator · Diagnostic feedback.
              Get a free key at <strong style={{ color: 'var(--amber)' }}>aistudio.google.com</strong>
            </p>
          </div>

          {/* Rate-Limit Banner */}
          <div className="info-box neutral">
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontWeight: 700, marginBottom: 6 }}>
              <ShieldCheck size={15} /> Rate-Limit Protection Active
            </div>
            Requests are throttled (≤ 13 req/min) and cached locally. Your key stays within Gemini's free tier — no unexpected costs.
          </div>

          {/* Status */}
          {status && (
            <div className={`info-box ${status.ok ? 'success' : 'error'}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              {status.ok
                ? <CheckCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                : <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} />}
              {status.msg}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end', paddingTop: 4, flexWrap: 'wrap' }}>
            {key && (
              <button className="btn btn-ghost" onClick={handleClear} style={{ fontSize: '0.78rem', color: 'var(--rose)' }}>
                Clear Key
              </button>
            )}
            <button className="btn btn-ghost" onClick={handleTest} disabled={testing}>
              <Activity size={14} /> {testing ? 'Testing…' : 'Test Connection'}
            </button>
            <button className="btn btn-amber" onClick={handleSave}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
