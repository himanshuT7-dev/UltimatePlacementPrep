import React from 'react';
import { useAuth } from '../context/AuthContext';
import { RefreshCw } from 'lucide-react';
import { TRACKS } from '../data/index.js';

export default function ReviewDashboard({ onSelectTopic }) {
  const { getDueReviews, progress } = useAuth();
  const dueTopics = getDueReviews();

  if (!dueTopics || dueTopics.length === 0) return null;
  
  const allTopics = TRACKS.flatMap(track => track.modules.flatMap(m => m.topics)).filter(Boolean);

  return (
    <div className="glass" style={{
      marginBottom: 20,
      padding: '16px 20px',
      borderLeft: '4px solid var(--amber)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--amber)', fontWeight: 700 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><RefreshCw size={16} /> {dueTopics.length} topics due for revision today</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {dueTopics.map(id => {
          const topicInfo = allTopics.find(t => t.id === id);
          if (!topicInfo) return null;
          
          const reviewData = progress.reviews[id];
          const today = new Date().toISOString().split('T')[0];
          const isOverdue = reviewData.nextReview < today;
          
          let badgeClass = 'badge-amber';
          if (isOverdue) badgeClass = 'badge-rose';

          return (
            <button
              key={id}
              className="btn btn-ghost"
              style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: 8 }}
              onClick={() => onSelectTopic(topicInfo)}
            >
              {topicInfo.title}
              <span className={`badge ${badgeClass}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                {isOverdue ? 'Overdue' : 'Due Today'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
