import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { TRACKS } from '../data/index.js';
import { TrackIcon } from './TrackIcons';
import useDialog from '../hooks/useDialog';

const allTopics = TRACKS.flatMap(track =>
  track.modules.flatMap(mod =>
    (mod.topics || []).map(t => ({ 
      ...t, 
      trackLabel: track.label, 
      trackIcon: track.icon, 
      trackId: track.id 
    }))
  )
);

export default function SearchModal({ onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const { dialogProps } = useDialog({ onClose });

  const filtered = query.trim() === '' 
    ? [] 
    : allTopics.filter(t => 
        t.title?.toLowerCase().includes(query.toLowerCase()) || 
        t.summary?.toLowerCase().includes(query.toLowerCase()) ||
        t.id?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === 'Enter' && filtered.length > 0) {
      e.preventDefault();
      const selected = filtered[selectedIndex];
      onSelect(selected.trackId, selected.id);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="glass"
        {...dialogProps}
        aria-labelledby="search-modal-title"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 600,
          marginTop: '10vh',
          borderRadius: 'var(--r-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--glass-border)',
          background: 'rgba(15, 23, 42, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Visually hidden title for aria-labelledby */}
        <h2 id="search-modal-title" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }}>
          Search Topics
        </h2>
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Search size={20} style={{ color: 'var(--text-muted)', marginRight: 12 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search topics, concepts, tracks..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.2rem',
              fontWeight: 500
            }}
          />
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        {query.trim() !== '' && (
          <div style={{ padding: 8, maxHeight: '60vh', overflowY: 'auto' }}>
            {filtered.length > 0 ? (
              filtered.map((topic, i) => (
                <button
                  key={topic.id}
                  onClick={() => onSelect(topic.trackId, topic.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    marginBottom: 4,
                    background: i === selectedIndex ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--r-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <TrackIcon trackId={topic.trackId} size={12} />
                      {topic.trackLabel}
                    </div>
                    {topic.level && (
                      <span className={`badge ${topic.level}`} style={{ fontSize: '0.65rem' }}>
                        {topic.level}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {topic.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {topic.summary ? topic.summary.substring(0, 80) + (topic.summary.length > 80 ? '...' : '') : 'No summary available.'}
                  </div>
                </button>
              ))
            ) : (
              <div style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No results found for "{query}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
