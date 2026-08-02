import React, { useState, useEffect } from 'react';
import { Sprout, Zap, Flame, Diamond, Trophy, BarChart2, BookOpen, TrendingUp, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { TrackIcon } from './TrackIcons';
import { useAuth } from '../context/AuthContext';
import { TRACKS, getTotalTopics } from '../data/index';
import useDialog from '../hooks/useDialog';

// XP Levels
const XP_LEVELS = [
  { max: 500, label: 'Beginner', icon: <Sprout size={16} /> },
  { max: 2000, label: 'Intermediate', icon: <Zap size={16} color="#eab308" /> },
  { max: 5000, label: 'Advanced', icon: <Flame size={16} color="#f97316" /> },
  { max: 10000, label: 'Expert', icon: <Diamond size={16} color="#3b82f6" /> },
  { max: Infinity, label: 'Master', icon: <Trophy size={16} color="#eab308" /> },
];

export const getXpLevel = (xp) => {
  return XP_LEVELS.find(l => xp < l.max) || XP_LEVELS[XP_LEVELS.length - 1];
};

/* Animated count-up — eases a number from 0 to target over `duration` ms */
function useCountUp(target, duration = 850) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target || target <= 0) { setVal(0); return; }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

/* SVG progress ring with a soft glow */
const ProgressRing = ({ pct, size = 76, stroke = 7, color, children }) => {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)', filter: `drop-shadow(0 0 6px ${color}55)` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
};

const ProgressDashboard = ({ onClose }) => {
  const { progress, initDone } = useAuth();
  const { dialogProps } = useDialog({ onClose });
  const {
    completedTopics = [],
    streakDays = 0,
    masteryScore = 0,
    xp = 0,
    dailyActivity = {},
    quizHistory = [],
    studyPlan = null,
    planStartDate = null,
  } = progress;

  const totalTopicsCount = getTotalTopics();

  // Animated counters (hooks must run before the early skeleton return)
  const animatedXp = useCountUp(xp);
  const animatedStreak = useCountUp(streakDays);
  const animatedMastery = useCountUp(masteryScore);

  // Completion + level progress
  const completionPct = totalTopicsCount ? Math.round((completedTopics.length / totalTopicsCount) * 100) : 0;
  const level = getXpLevel(xp);
  const levelIdx = XP_LEVELS.indexOf(level);
  const levelPrevMax = levelIdx > 0 ? XP_LEVELS[levelIdx - 1].max : 0;
  const levelPct = xp <= 0 ? 0 : Math.round(((xp - levelPrevMax) / (level.max - levelPrevMax)) * 100);

  // Calculate Plan Progress
  let planProgressText = "No Plan Active";
  if (studyPlan && planStartDate) {
    const daysSinceStart = Math.floor((new Date() - new Date(planStartDate)) / (1000 * 60 * 60 * 24));
    planProgressText = `Day ${daysSinceStart + 1}`;
  }

  // Calculate track progress
  const trackStats = TRACKS.map(track => {
    const trackTopics = track.modules ? track.modules.flatMap(m => m.topics || []) : [];
    const trackTotal = trackTopics.length;
    const trackCompleted = trackTopics.filter(t => completedTopics.includes(t.id)).length;
    const pct = trackTotal > 0 ? (trackCompleted / trackTotal) * 100 : 0;
    
    return {
      id: track.id,
      name: track.label || track.id,
      color: track.color || '#3b82f6',
      completed: trackCompleted,
      total: trackTotal,
      pct
    };
  });

  // Heatmap generation
  const today = new Date();
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    const count = dailyActivity[dStr] || 0;
    days.push({ date: dStr, count });
  }

  const getHeatmapColor = (count) => {
    if (count === 0) return 'rgba(255,255,255,0.03)';
    if (count <= 2) return 'rgba(245,158,11,0.2)';
    if (count <= 5) return 'rgba(245,158,11,0.4)';
    return 'rgba(245,158,11,0.7)';
  };

  // Show skeletons while the auth context is still hydrating progress
  // (avoids flashing "0/105", "0%", "0 XP" before real data loads).
  if (!initDone) {
    return (
      <div className="glass" {...dialogProps} aria-labelledby="progress-modal-title" style={{ padding: '2rem', borderRadius: '1rem', color: '#fff', maxWidth: '800px', margin: '0 auto', maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 id="progress-modal-title" style={{ fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><BarChart2 size={24} /> Progress Analytics</h2>
          {onClose && <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: 96 }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: 18, width: '40%', marginBottom: '1rem' }} />
        {[0, 1, 2].map(i => (
          <div key={i} className="skeleton" style={{ height: 44, marginBottom: '1rem' }} />
        ))}
        <div className="skeleton" style={{ height: 18, width: '40%', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ height: 120 }} />
      </div>
    );
  }

  return (
    <div className="glass" {...dialogProps} aria-labelledby="progress-modal-title" style={{ padding: '2rem', borderRadius: '1rem', color: '#fff', maxWidth: '800px', margin: '0 auto', maxHeight: '80vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 id="progress-modal-title" style={{ fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><BarChart2 size={24} /> Progress Analytics</h2>
        {onClose && <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>}
      </div>

      {/* Section 1: Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="stat-card">
          <ProgressRing pct={completionPct} color="var(--amber)">
            <BookOpen size={18} style={{ color: 'var(--amber)' }} />
          </ProgressRing>
          <div>
            <div className="stat-value">{completedTopics.length}<span style={{ opacity: 0.55, fontWeight: 600 }}>/{totalTopicsCount}</span></div>
            <div className="stat-label">Topics Completed</div>
          </div>
        </div>

        <div className="stat-card">
          <ProgressRing pct={masteryScore} color="var(--emerald)">
            <TrendingUp size={18} style={{ color: 'var(--emerald)' }} />
          </ProgressRing>
          <div>
            <div className="stat-value">{animatedMastery}%</div>
            <div className="stat-label">Mastery Score</div>
          </div>
        </div>

        <div className="stat-card">
          <ProgressRing pct={levelPct} color="var(--violet)">
            {level.icon}
          </ProgressRing>
          <div>
            <div className="stat-value">{animatedXp} XP</div>
            <div className="stat-label">{level.label}</div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 76, height: 76, borderRadius: '50%', border: '1px dashed rgba(249,115,22,0.4)', background: 'rgba(249,115,22,0.08)' }}>
            <Flame size={30} color="#f97316" />
          </div>
          <div>
            <div className="stat-value">{animatedStreak} <span role="img" aria-label="fire">🔥</span></div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 76, height: 76, borderRadius: '50%', border: '1px dashed rgba(56,189,248,0.4)', background: 'rgba(56,189,248,0.08)' }}>
            <Calendar size={30} color="#38bdf8" />
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: '1.05rem' }}>{planProgressText}</div>
            <div className="stat-label">Plan Progress</div>
          </div>
        </div>
      </div>

      {/* Section 2: Track Completion Bars */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Track Progress</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {trackStats.map(track => (
            <div key={track.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><TrackIcon trackId={track.id} size={14} /> {track.name}</span>
                <span style={{ opacity: 0.8 }}>{track.completed} / {track.total} topics · <b style={{ color: track.color }}>{Math.round(track.pct)}%</b></span>
              </div>
              <div
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={Math.round(track.pct)}
                aria-label={`${track.name} progress`}
                style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '999px', height: '9px', overflow: 'hidden' }}
              >
                <div style={{ width: `${track.pct}%`, height: '100%', background: `linear-gradient(90deg, ${track.color}88, ${track.color})`, borderRadius: '999px', transition: 'width 0.6s var(--ease-gpu)', boxShadow: `0 0 10px ${track.color}55` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Weekly Activity Heatmap */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Activity (Last 28 Days)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
          {days.map((day, idx) => (
            <div
              key={idx}
              tabIndex={0}
              role="img"
              title={`${day.date}: ${day.count} topics`}
              aria-label={`${day.count} topics on ${day.date}`}
              style={{
                aspectRatio: '1',
                background: getHeatmapColor(day.count),
                borderRadius: '0.25rem'
              }}
            />
          ))}
        </div>
      </div>

      {/* Section 4: Recent Quiz Performance */}
      <div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Recent Quizzes</h3>
        {quizHistory.length === 0 ? (
          <div className="empty-state">
            <TrendingUp size={26} className="empty-icon" />
            <span>No quizzes taken yet — head to <b style={{ color: 'var(--amber)' }}>Learn</b> and test yourself on a topic!</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {quizHistory.map((quiz, i) => (
              <div key={i} className="glass" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span>{quiz.isCorrect ? <CheckCircle size={16} color="#34d399"/> : <XCircle size={16} color="#ef4444"/>}</span>
                  <span>{quiz.topicName}</span>
                </div>
                <span style={{ opacity: 0.6 }}>{quiz.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressDashboard;
