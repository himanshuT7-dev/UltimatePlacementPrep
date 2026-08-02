import React, { useState } from 'react';
import { Play, RotateCcw, Terminal, CheckCircle2, AlertTriangle, XCircle, Code2 } from 'lucide-react';

const DEFAULT_JS = `// JavaScript Execution Sandbox
// Try modifying this code and click Run

const topics = ["Java", "SQL", "JavaScript", "React", "Communication"];
const student = { name: "Placement Candidate", targetOffer: "Software Engineer" };

console.log("Candidate:", student.name);
console.log("Mastering tracks:", topics.join(", "));

// Arrow function & Map demonstration
const doubled = [10, 20, 30].map(n => n * 2);
console.log("Doubled values:", doubled);
`;

export default function JSPlayground({ initialCode }) {
  const [code, setCode]       = useState(initialCode || DEFAULT_JS);
  const [logs, setLogs]       = useState([]);
  const [error, setError]     = useState(null);
  const [running, setRunning] = useState(false);

  const runCode = () => {
    setRunning(true);
    setLogs([]);
    setError(null);

    const captured = [];
    const customConsole = {
      log:   (...a) => captured.push({ t: 'log',   v: a.map(x => typeof x === 'object' ? JSON.stringify(x, null, 2) : String(x)).join(' ') }),
      warn:  (...a) => captured.push({ t: 'warn',  v: a.map(x => typeof x === 'object' ? JSON.stringify(x, null, 2) : String(x)).join(' ') }),
      error: (...a) => captured.push({ t: 'error', v: a.map(x => typeof x === 'object' ? JSON.stringify(x, null, 2) : String(x)).join(' ') }),
      info:  (...a) => captured.push({ t: 'info',  v: a.map(x => typeof x === 'object' ? JSON.stringify(x, null, 2) : String(x)).join(' ') }),
    };

    try {
      // Shadow browser globals (window, document, localStorage, fetch, etc.) so
      // user code that touches them throws instead of running in the page scope.
      const fn = new Function(
        'console', 'window', 'document', 'localStorage', 'sessionStorage', 'fetch', 'XMLHttpRequest', 'alert',
        '"use strict";\n' + code
      );
      fn(customConsole, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
      setLogs(captured);
    } catch (err) {
      setError(err.message);
    } finally {
      setRunning(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode || DEFAULT_JS);
    setLogs([]);
    setError(null);
  };

  return (
    <div className="glass sandbox-card" style={{ marginTop: 20 }}>
      <div className="sandbox-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Code2 size={18} style={{ color: '#a78bfa' }} />
          <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Live JavaScript Playground</span>
          <span className="badge badge-violet" style={{ fontSize: '0.62rem' }}>ES6+ Engine</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={resetCode}>
            <RotateCcw size={13} /> Reset Code
          </button>
          <button className="btn btn-emerald" style={{ padding: '6px 16px', fontSize: '0.78rem' }} onClick={runCode} disabled={running}>
            <Play size={13} /> Run JS
          </button>
        </div>
      </div>

      <div className="playground-grid">
        {/* Editor */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>
            JavaScript Source
          </label>
          <textarea
            className="glass-input"
            value={code}
            onChange={e => setCode(e.target.value)}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.82rem',
              lineHeight: 1.6,
              minHeight: 220,
              resize: 'vertical',
            }}
          />
        </div>

        {/* Output Console */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>
            Console Output
          </label>
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--r-md)',
            padding: 14,
            minHeight: 220,
            fontFamily: 'var(--mono)',
            fontSize: '0.8rem',
            overflowY: 'auto',
            maxHeight: 300,
          }}>
            {error && (
              <div style={{ color: 'var(--rose)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <XCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Runtime Error: {error}</span>
              </div>
            )}

            {!error && logs.length === 0 && (
              <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Console logs will appear here after clicking "Run JS"...
              </span>
            )}

            {!error && logs.map((l, i) => (
              <div key={i} style={{
                marginBottom: 6,
                color: l.t === 'error' ? 'var(--rose)' : l.t === 'warn' ? 'var(--amber)' : '#6ee7b7',
                whiteSpace: 'pre-wrap',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                {l.t === 'warn' && <AlertTriangle size={12} />}
                {l.t === 'error' && <XCircle size={12} />}
                {l.t === 'log' && <Terminal size={12} style={{ opacity: 0.7 }} />}
                <span>{l.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
