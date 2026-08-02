import React, { useState } from 'react';
import { X, ShieldCheck, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { testConnection } from '../services/geminiService';
import useDialog from '../hooks/useDialog';

export default function FounderSettings({ onClose }) {
  const [status,  setStatus]  = useState(null);
  const [testing, setTesting] = useState(false);

  const { dialogProps } = useDialog({ onClose });

  const handleTest = async () => {
    setTesting(true); setStatus(null);
    const r = await testConnection();
    setStatus(r); setTesting(false);
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box founder-modal" {...dialogProps} aria-labelledby="founder-settings-title">
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={16} /></button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <ShieldCheck size={22} style={{ color: 'var(--amber)' }} />
          <h2 id="founder-settings-title" className="modal-title">AI Backend Settings</h2>
        </div>
        <p className="modal-sub">API keys are securely managed server-side. Test connection below.</p>

        <div className="settings-grid">
          <div className="info-box neutral">
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontWeight: 700, marginBottom: 6 }}>
              <ShieldCheck size={15} /> Secure Server-Side AI
            </div>
            Gemini Pro API keys are securely stored in backend environment variables and are never exposed to the client.
          </div>

          {status && (
            <div className={`info-box ${status.ok ? 'success' : 'error'}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              {status.ok
                ? <CheckCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                : <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} />}
              {status.msg}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end', paddingTop: 4, flexWrap: 'wrap' }}>
            <button className="btn btn-amber" onClick={handleTest} disabled={testing}>
              <Activity size={14} /> {testing ? 'Testing…' : 'Test AI Connection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
