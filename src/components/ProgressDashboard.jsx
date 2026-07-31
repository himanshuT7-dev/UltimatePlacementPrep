import React from 'react';
import { useAuth } from '../context/AuthContext';
import { TRACKS, getTotalTopics } from '../data/index';

// XP Levels
const XP_LEVELS = [
  { max: 500, label: 'Beginner', icon: '🌱' },
  { max: 2000, label: 'Intermediate', icon: '⚡' },
  { max: 5000, label: 'Advanced', icon: '🔥' },
  { max: 10000, label: 'Expert', icon: '💎' },
  { max: Infinity, label: 'Master', icon: '🏆' },
];

export const getXpLevel = (xp) => {
  return XP_LEVELS.find(l => xp < l.max) || XP_LEVELS[XP_LEVELS.length - 1];
};

const ProgressDashboard = ({ onClose }) => {
  const { progress } = useAuth();
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
      name: track.label || track.id,
      icon: track.icon || '📚',
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

  return (
    <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', color: '#fff', maxWidth: '800px', margin: '0 auto', maxHeight: '80vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>📊 Progress Analytics</h2>
        {onClose && <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>}
      </div>

      {/* Section 1: Overview Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass" style={{ padding: '1rem', borderRadius: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📚</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{completedTopics.length} / {totalTopicsCount}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Topics Completed</div>
        </div>
        <div className="glass" style={{ padding: '1rem', borderRadius: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔥</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{streakDays}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Day Streak</div>
        </div>
        <div className="glass" style={{ padding: '1rem', borderRadius: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{masteryScore}%</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Mastery Score</div>
        </div>
        <div className="glass" style={{ padding: '1rem', borderRadius: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✨</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{xp}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Total XP</div>
        </div>
        <div className="glass" style={{ padding: '1rem', borderRadius: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📅</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{planProgressText}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Plan Progress</div>
        </div>
      </div>

      {/* Section 2: Track Completion Bars */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Track Progress</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {trackStats.map(track => (
            <div key={track.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span>{track.icon} {track.name}</span>
                <span style={{ opacity: 0.8 }}>{track.completed} / {track.total} topics</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${track.pct}%`, height: '100%', background: track.color, borderRadius: '999px', transition: 'width 0.5s ease' }} />
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
              title={`${day.date}: ${day.count} topics`}
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
          <div style={{ opacity: 0.5, fontSize: '0.9rem' }}>No quizzes taken yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {quizHistory.map((quiz, i) => (
              <div key={i} className="glass" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span>{quiz.isCorrect ? '✅' : '❌'}</span>
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
