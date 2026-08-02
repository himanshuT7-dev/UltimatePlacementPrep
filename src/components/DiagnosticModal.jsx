import React, { useState, useEffect, useRef } from 'react';
import { X, AlertTriangle, CheckCircle2, Languages, Volume2, VolumeX, Sparkles, Lightbulb, BookOpen, Heart, RefreshCw } from 'lucide-react';
import { DiagnosticNode } from '../agents/pipeline';
import { useAuth } from '../context/AuthContext';
import { speakText, stopSpeech } from '../utils/speech';

export default function DiagnosticModal({ track, topic, question, chosenIdx, onClose }) {
  const { nativeLang, voiceGender } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setSpeaking(false);
    stopSpeech();

    const chosen = question.options[chosenIdx];
    const correct = question.options[question.correct];

    DiagnosticNode.run(track || 'General', topic, question.question, chosen, correct, nativeLang)
      .then(res => {
        if (mounted) { setData(res); setLoading(false); }
      })
      .catch(err => {
        if (mounted) {
          setError(err?.message || 'The AI diagnostic could not be generated. Please try again.');
          setLoading(false);
        }
      });

    return () => { mounted = false; stopSpeech(); };
  }, [track, topic, question, chosenIdx, nativeLang, retryKey]);

  // Escape-to-close + basic focus management (keep it lightweight)
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeBtnRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [onClose]);

  const toggleSpeech = () => {
    const text = data?.nativeAudio || data?.native;
    if (!text) return;
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      speakText(text, {
        nativeLang,
        voiceGender,
        rate: 0.95,
        onEnd: () => setSpeaking(false),
        onError: () => setSpeaking(false)
      });
    }
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="diagnostic-modal-title">
        <button className="modal-close" ref={closeBtnRef} onClick={onClose} aria-label="Close diagnostic"><X size={16} /></button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <Sparkles size={22} style={{ color: 'var(--amber)' }} />
          <h2 className="modal-title" id="diagnostic-modal-title">Why Was That Wrong?</h2>
        </div>
        <p className="modal-sub">Gemini Pro Diagnostic Breakdown · {nativeLang} Explanation Available</p>

        {loading && (
          <div className="loading-pulse" style={{ padding: '32px 0', justifyContent: 'center' }}>
            <div className="spinner" />
            Analysing your reasoning via Gemini Pro…
          </div>
        )}

        {error && !loading && (
          <div className="diag-section flaw">
            <div className="diag-label"><AlertTriangle size={13} /> Error</div>
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => setRetryKey(k => k + 1)}
              style={{ marginTop: 10, padding: '8px 16px', fontSize: '0.8rem' }}
            >
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        )}

        {data && !loading && (
          <>
            {/* Encouragement */}
            <div className="diag-section encourage">
              <div className="diag-label"><Heart size={12} style={{ color: 'var(--amber)', fill: 'var(--amber)' }} /> You're Doing Great</div>
              <p>"{data.encouragement}"</p>
            </div>

            {/* Logical Flaw */}
            <div className="diag-section flaw">
              <div className="diag-label"><AlertTriangle size={12} /> The Logical Flaw in Your Answer</div>
              <p>{data.flaw}</p>
              {data.misconception_root && (
                <p style={{ marginTop: 8, color: '#fca5a5', fontSize: '0.82rem' }}>
                  <strong>Root misconception: </strong>{data.misconception_root}
                </p>
              )}
            </div>

            {/* Correct Explanation */}
            <div className="diag-section correct">
              <div className="diag-label"><CheckCircle2 size={12} /> Full Correct Explanation</div>
              <p style={{ whiteSpace: 'pre-line' }}>{data.correct_explanation}</p>
            </div>

            {/* Analogy */}
            {data.analogy && (
              <div className="diag-section" style={{ background: 'rgba(139,92,246,0.07)', borderColor: 'rgba(139,92,246,0.2)' }}>
                <div className="diag-label" style={{ color: '#a78bfa' }}><Lightbulb size={12} /> Real-Life Analogy</div>
                <p style={{ color: '#c4b5fd' }}>{data.analogy}</p>
              </div>
            )}

            {/* Interview Tip */}
            {data.interview_tip && (
              <div style={{ padding: '12px 14px', background: 'rgba(245,158,11,0.08)', borderRadius: 'var(--r-md)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: 10 }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={13} /> Golden Interview Rule
                </p>
                <p style={{ fontSize: '0.85rem', color: '#fde68a' }}>{data.interview_tip}</p>
              </div>
            )}

            {/* Related Topics */}
            {data.related_topics?.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <BookOpen size={12} /> Review These Topics
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {data.related_topics.map((t, i) => (
                    <span key={i} className="badge badge-violet" style={{ fontSize: '0.72rem' }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Native Language */}
            <div className="diag-section native">
              <div className="diag-label" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Languages size={12} /> {nativeLang} Explanation</span>
                <button
                  className={speaking ? "btn btn-rose" : "listen-btn"}
                  onClick={toggleSpeech}
                  style={{ marginTop: 0, padding: '4px 12px', fontSize: '0.75rem' }}
                >
                  {speaking ? <><VolumeX size={13} /> Stop Audio</> : <><Volume2 size={13} /> Listen Audio</>}
                </button>
              </div>
              <p>{data.native}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
