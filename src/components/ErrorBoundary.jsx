import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  static getDerivedStateFromProps(props, state) {
    // Allow a route change (resetKey change) to recover without a full reload.
    if (props.resetKey !== undefined && props.resetKey !== state.prevResetKey) {
      return { hasError: false, error: null, prevResetKey: props.resetKey };
    }
    return { prevResetKey: props.resetKey };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base, #080c14)', padding: '24px' }}>
          <div style={{ maxWidth: 440, width: '100%', background: 'var(--bg-layer1, #0e1320)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: 34, fontWeight: 700, color: '#f59e0b', marginBottom: 12, lineHeight: 1 }}>!</div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: 8, fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif" }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: 20, fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif" }}>
              {this.state.error ? String(this.state.error.message || this.state.error) : 'An unexpected error occurred.'}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{ background: '#f59e0b', color: '#0f172a', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              Reload app
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
