import React, { useState, useEffect } from 'react';
import { Lock, Trophy, CheckCircle2, Mic, Brain, Code2, Timer, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VoiceAgent from './VoiceAgent';
import { getTotalTopics } from '../data/index.js';

const FEATURES = [
  { icon: <Brain size={18} />, title: 'Full Timed Mock Exam', desc: '60-minute placement simulation across all 5 tracks with real-company question patterns.' },
  { icon: <Code2 size={18} />, title: 'Live Coding Challenges', desc: 'SQL under pressure, JS algorithm rounds, and Java OOP design problems with instant feedback.' },
  { icon: <Mic size={18} />, title: 'AI Voice Mock Interviews', desc: '20 curated HR + Technical questions evaluated by Gemini Pro for accuracy, fluency & grammar.' },
  { icon: <Timer size={18} />, title: 'Placement Readiness Score', desc: 'Your personalised mastery score across every topic, with gap analysis and improvement plan.' },
];

export default function PreparedMode({ onSwitchLearn }) {
  const { progress } = useAuth();
  const [totalTopics, setTotalTopics] = useState(105);

  useEffect(() => {
    setTotalTopics(getTotalTopics() || 105);
  }, []);

  const done     = progress.completedTopics.length;
  const pct      = Math.min(100, Math.round((done / totalTopics) * 100));
  const unlocked = progress.preparedModeUnlocked || done >= totalTopics;

  if (!unlocked) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
        <div className="glass locked-card" style={{ maxWidth: 640, textAlign: 'center', padding: 36 }}>
          <div className="locked-icon" style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
          }}>
            <Lock size={32} style={{ color: 'var(--amber)' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 10 }}>
            Placement Preparedness Mode
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: 24 }}>
            Complete all topics in <strong style={{ color: 'var(--amber)' }}>Learn Mode</strong> to unlock the full timed
            placement exam, SQL challenges under pressure, and live AI voice mock interviews — your final placement
            readiness test.
          </p>

          {/* Feature Preview Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--r-lg)',
                textAlign: 'left',
              }}>
                <div style={{ color: 'var(--amber)', marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--r-lg)', padding: '18px 20px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: 10 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Topics Completed</span>
              <span style={{ color: 'var(--amber)' }}>{done} / {totalTopics}</span>
            </div>
            <div
              className="progress-bar-wrap"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={pct}
              aria-label="Topics completed progress"
            >
              <div className="progress-bar" style={{ width: `${pct}%` }} />
            </div>
            <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              {Math.max(0, totalTopics - done)} topics remaining to unlock
            </div>
          </div>

          <button className="btn btn-amber" style={{ fontSize: '0.9rem', padding: '13px 28px', width: '100%' }} onClick={onSwitchLearn}>
            Continue in Learn Mode <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Unlocked Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(14,19,32,0.85) 100%)',
        border: '1px solid rgba(16,185,129,0.25)',
        borderRadius: 'var(--r-2xl)',
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <span className="badge badge-emerald" style={{ marginBottom: 8, display: 'inline-flex' }}>
            <ShieldCheck size={12} /> Unlocked — Placement Ready
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Full Placement Exam & AI Voice Simulator</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>
            Technical + HR timed rounds, live AI voice interviews, and your final placement readiness certificate.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 'var(--r-lg)', padding: '14px 22px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald)', lineHeight: 1 }}>{progress.masteryScore}%</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Mastery Score</div>
          </div>
          <div style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--r-lg)', padding: '14px 22px', textAlign: 'center' }}>
            <Trophy size={28} style={{ color: 'var(--amber)', display: 'block', margin: '0 auto 4px' }} />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Placement Ready</div>
          </div>
        </div>
      </div>

      {/* Completed Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {FEATURES.map((f, i) => (
          <div key={i} style={{
            padding: '16px 18px',
            background: 'rgba(16,185,129,0.05)',
            border: '1px solid rgba(16,185,129,0.15)',
            borderRadius: 'var(--r-lg)',
          }}>
            <div style={{ color: 'var(--emerald)', marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>{f.title}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Voice Agent */}
      <VoiceAgent />
    </div>
  );
}
