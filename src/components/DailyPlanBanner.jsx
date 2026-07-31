import React from 'react';
import { useAuth } from '../context/AuthContext';
import { STUDY_PLANS } from '../data/studyPlans';
import { CheckCircle2, Circle, Settings2 } from 'lucide-react';

export default function DailyPlanBanner({ onChangePlan }) {
  const { progress, getStudyDay, getTodaysTopics } = useAuth();
  
  if (!progress.studyPlan) return null;

  const plan = STUDY_PLANS[progress.studyPlan];
  const dayNumber = getStudyDay();
  const todaysTopics = getTodaysTopics();
  
  const completedToday = todaysTopics.filter(t => progress.completedTopics.includes(t.id));
  const completionPercent = todaysTopics.length ? Math.round((completedToday.length / todaysTopics.length) * 100) : 100;

  return (
    <div className="glass" style={{
      marginBottom: 24,
      padding: '20px 24px',
      borderLeft: '4px solid var(--amber)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '1.2rem' }}>{plan.emoji}</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              Day {dayNumber} of {plan.duration} · {plan.name}
            </h3>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>
              {todaysTopics.length} topics today
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            {plan.description}
          </p>
        </div>
        <button 
          className="btn btn-ghost" 
          onClick={onChangePlan}
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <Settings2 size={14} /> Change Plan
        </button>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 'var(--r-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>
          <span>Today's Progress</span>
          <span style={{ color: completionPercent === 100 ? '#34d399' : 'var(--amber)' }}>
            {completedToday.length} / {todaysTopics.length} Completed
          </span>
        </div>
        <div className="progress-bar-wrap" style={{ height: 6, marginBottom: 16 }}>
          <div className="progress-bar" style={{ width: `${completionPercent}%`, background: completionPercent === 100 ? '#34d399' : 'var(--amber)' }} />
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {todaysTopics.map(topic => {
            const isDone = progress.completedTopics.includes(topic.id);
            return (
              <div 
                key={topic.id}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 6,
                  padding: '4px 10px',
                  background: isDone ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${isDone ? 'rgba(52, 211, 153, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: 100,
                  fontSize: '0.75rem',
                  color: isDone ? '#34d399' : 'var(--text-secondary)'
                }}
              >
                {isDone ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                {topic.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
