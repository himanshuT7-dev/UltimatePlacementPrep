import React, { useState, useEffect, useRef } from 'react';
import { Code2, ChevronDown, ChevronUp, Copy, Check, Play, Terminal } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-javascript';

export default function CodeDrawer({ code, lang = 'java', onRunSandbox }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    if (isOpen && codeRef.current) {
      // Highlight only this element instead of re-scanning the whole DOM
      Prism.highlightElement(codeRef.current);
    }
  }, [isOpen, code, lang]);

  if (!code) return null;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = code.trim().split('\n').length;

  return (
    <div style={{
      background: 'rgba(14, 19, 32, 0.75)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--r-2xl)',
      overflow: 'hidden',
      transition: 'all 0.25s var(--ease-gpu)',
      marginTop: 16,
      marginBottom: 16,
    }}>
      {/* Drawer Header Toggle */}
      <button
        onClick={() => setIsOpen(v => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          background: isOpen ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.02)',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          fontSize: '0.86rem',
          fontWeight: 700,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            padding: '6px 8px',
            borderRadius: 'var(--r-md)',
            background: 'rgba(245, 158, 11, 0.12)',
            color: 'var(--amber)',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Code2 size={16} />
          </div>
          <span>{isOpen ? 'Hide Annotated Code' : 'Show Annotated Code Example'}</span>
          <span className="badge badge-amber" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
            {lang.toUpperCase()} · {lineCount} lines
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isOpen ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
        </div>
      </button>

      {/* Drawer Content */}
      {isOpen && (
        <div className="anim-fade" style={{ borderTop: '1px solid var(--glass-border)' }}>
          {/* Action Toolbar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderBottom: '1px solid var(--glass-border)',
            fontSize: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
              <Terminal size={13} />
              <span>Production Code Snippet</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {onRunSandbox && (
                <button
                  className="btn btn-ghost"
                  style={{ padding: '4px 10px', fontSize: '0.72rem', height: 28 }}
                  onClick={onRunSandbox}
                >
                  <Play size={12} style={{ color: 'var(--emerald)' }} /> Run in Sandbox
                </button>
              )}

              <button
                className="btn btn-ghost"
                style={{ padding: '4px 10px', fontSize: '0.72rem', height: 28 }}
                onClick={handleCopy}
              >
                {copied ? (
                  <><Check size={12} style={{ color: 'var(--emerald)' }} /> Copied!</>
                ) : (
                  <><Copy size={12} /> Copy Code</>
                )}
              </button>
            </div>
          </div>

          {/* Code Container */}
          <div className="code-block" style={{ margin: 0, borderRadius: 0, border: 'none' }}>
            <div className="code-block-body" style={{ maxHeight: 420, overflowY: 'auto' }}>
              <pre style={{ margin: 0, padding: 0, background: 'transparent' }}>
                <code ref={codeRef} className={`language-${lang}`}>{code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
