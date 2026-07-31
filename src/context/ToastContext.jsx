import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    
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
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        pointerEvents: 'none' // Let clicks pass through if empty
      }}>
        {toasts.map(t => (
          <div key={t.id} className="toast-anim" style={{
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
            {t.type === 'success' && <span style={{ color: '#34d399' }}>✨</span>}
            {t.type === 'error' && <span style={{ color: '#f43f5e' }}>❌</span>}
            {t.type === 'info' && <span style={{ color: '#f59e0b' }}>🔔</span>}
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
