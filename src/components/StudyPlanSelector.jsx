import React from 'react';
import { useAuth } from '../context/AuthContext';
import { STUDY_PLANS } from '../data/studyPlans';
import { Sparkles, X, ChevronRight, Zap, Flame, BookOpen, Target, Trophy } from 'lucide-react';
import useDialog from '../hooks/useDialog';

const iconMap = {
  Zap: <Zap size={24} color="#fcd34d" />,
  Flame: <Flame size={24} color="#f97316" />,
  BookOpen: <BookOpen size={24} color="#60a5fa" />,
  Target: <Target size={24} color="#f43f5e" />,
  Trophy: <Trophy size={24} color="#fbbf24" />
};

export default function StudyPlanSelector({ onClose, forceSelection }) {
  const { setStudyPlan } = useAuth();
  const { dialogProps } = useDialog({ onClose });

  const handleSelect = (planId) => {
    setStudyPlan(planId);
    if (onClose) onClose();
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal-content glass"
        {...dialogProps}
        aria-labelledby="study-plan-title"
        style={{ maxWidth: 850, width: '100%', padding: '24px 24px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {!forceSelection && (
          <button className="modal-close" onClick={onClose} aria-label="Close" style={{ position: 'absolute', right: 16, top: 16 }}>
            <X size={18} />
          </button>
        )}

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h2 id="study-plan-title" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Sparkles size={20} style={{ color: 'var(--amber)' }} />
            Choose Your Placement Preparation Timeline
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            We'll pace your learning journey to match your schedule
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
          gap: 12
        }}>
          {Object.values(STUDY_PLANS).map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => handleSelect(plan.id)}
              className="plan-card"
              aria-label={`Select ${plan.name} plan (${plan.durationLabel})`}
              style={{
                width: '100%',
                textAlign: 'left',
                font: 'inherit',
                color: 'inherit',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--r-md)',
                padding: '16px 14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--amber)';
                e.currentTarget.style.background = 'rgba(245,158,11,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ display: 'flex' }}>{iconMap[plan.iconName]}</span>
                <span className="badge" style={{ background: 'rgba(245,158,11,0.2)', color: 'var(--amber)', fontSize: '0.65rem', padding: '3px 8px' }}>
                  {plan.durationLabel}
                </span>
              </div>
              
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 4 }}>{plan.name}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.4 }}>
                {plan.description}
              </p>

              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--r-sm)', padding: '10px 12px', marginBottom: 12, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Pace</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>~{plan.topicsPerDay}/day</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Revision Cycles</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{plan.revisionCycles}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Mock Interviews</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{plan.mockInterviews}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--amber)', fontSize: '0.8rem', fontWeight: 600, marginTop: 'auto' }}>
                Select Plan <ChevronRight size={14} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
