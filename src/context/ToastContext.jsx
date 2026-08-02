import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, Sparkles, XCircle, Bell } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now().toString();
    // Cap the visible stack (keep the last ~4) to prevent viewport overflow.
    setToasts(prev => [...prev, { id, message, type }].slice(-4));

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="toast-viewport"
        role="status"
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          pointerEvents: 'none' // Let clicks pass through if empty
        }}
      >
        {toasts.map(t => (
          <div key={t.id} role={t.type === 'error' ? 'alert' : undefined} className="toast-anim" style={{
            background: 'linear-gradient(165deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
            border: `1px solid ${t.type === 'success' ? 'rgba(52, 211, 153, 0.3)' : t.type === 'error' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            padding: '12px 20px',
            borderRadius: 'var(--r-md)',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            pointerEvents: 'auto', // Re-enable clicks for the toast
            backdropFilter: 'blur(10px)',
          }}>
            {t.type === 'success' && <Sparkles size={16} color="#34d399" />}
            {t.type === 'error' && <XCircle size={16} color="#f43f5e" />}
            {t.type === 'info' && <Bell size={16} color="#f59e0b" />}
            <span style={{ fontWeight: 500 }}>{t.message}</span>
            <button 
              onClick={() => removeToast(t.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', marginLeft: 8 }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
