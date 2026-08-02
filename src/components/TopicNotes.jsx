import React, { useState, useEffect, useCallback } from 'react';
import { Edit3, ChevronDown, ChevronUp, Save, Clock } from 'lucide-react';

import { useToast } from '../context/ToastContext';
import { playSound } from '../utils/sounds';

export default function TopicNotes({ topicId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const { showToast } = useToast();

  const storageKey = `upp-notes-${topicId}`;

  // Load notes on mount or topic change
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setNotes(saved);
    } else {
      setNotes('');
    }
    setLastSaved(null); // Reset last saved on topic change
  }, [topicId, storageKey]);

  // Debounced save
  useEffect(() => {
    const handler = setTimeout(() => {
      const saved = localStorage.getItem(storageKey);
      if (notes !== saved && notes !== '') {
        localStorage.setItem(storageKey, notes);
        setLastSaved(new Date());
        showToast('Notes auto-saved', 'success', 2000);
        playSound.click();
      } else if (notes === '' && saved) {
        localStorage.removeItem(storageKey);
      }
    }, 1000);
    return () => clearTimeout(handler);
  }, [notes, storageKey, showToast]);

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  return (
    <div className="glass" style={{ marginTop: 24, borderRadius: 'var(--r-xl)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="topic-notes-panel"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          font: 'inherit'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600 }}>
          <Edit3 size={18} style={{ color: 'var(--amber)' }} />
          Personal Notes
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isOpen && (
        <div id="topic-notes-panel" style={{ padding: '0 24px 24px 24px' }} className="anim-fade">
          <textarea
            className="glass-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your personal notes for this topic..."
            style={{ 
              width: '100%', 
              minHeight: 150, 
              resize: 'vertical',
              padding: 16,
              marginBottom: 12,
              lineHeight: 1.6
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>{wordCount} words</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={12} />
              {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'No changes'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
