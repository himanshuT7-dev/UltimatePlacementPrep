import React, { useState, useEffect } from 'react';
import { TRACKS as initialTracks } from '../data/index.js';

const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:3001';

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text }

  const [activeTab, setActiveTab] = useState('settings'); // settings | curriculum
  const [tracks, setTracks] = useState(initialTracks);

  const [adminToken, setAdminToken] = useState('');

  // Curriculum state
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [editingTopicId, setEditingTopicId] = useState(null);

  const [editForm, setEditForm] = useState({ title: '', summary: '', nativeText: '' });

  useEffect(() => {
    const savedToken = localStorage.getItem('upp_admin_token') || '';
    setAdminToken(savedToken);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const token = password.trim();
    if (!token) {
      setLoginError('Please enter the admin token.');
      return;
    }
    // No client-side credential check — the token is sent as the Bearer token and
    // validated by the server on save (a wrong token returns 401).
    localStorage.setItem('upp_admin_token', token);
    setAdminToken(token);
    setLoginError('');
    setIsAuthenticated(true);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('upp_admin_token', adminToken.trim());
    setAdminToken(adminToken.trim());
    setFeedback({ type: 'success', text: 'Token saved!' });
  };
  
  const handleEditClick = (topic) => {
    setEditingTopicId(topic.id);
    setEditForm({
      title: topic.title || '',
      summary: topic.summary || '',
      nativeText: topic.nativeText || ''
    });
  };

  const handleSaveTopic = async (trackId, moduleId, topicId) => {
    // 1. Update local state
    let updatedTrack = null;
    const newTracks = tracks.map(t => {
      if (t.id === trackId) {
        const newModules = t.modules.map(m => {
          if (m.id === moduleId) {
            const newTopics = m.topics.map(top => {
              if (top.id === topicId) {
                return { ...top, ...editForm };
              }
              return top;
            });
            return { ...m, topics: newTopics };
          }
          return m;
        });
        return { ...t, modules: newModules };
      }
      return t;
    });
    
    setTracks(newTracks);
    
    // 2. Persist to backend API with Authorization
    try {
      const trackToSave = newTracks.find(t => t.id === trackId);
      const res = await fetch(`${ADMIN_API_URL}/api/save-track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          trackId: trackId,
          trackData: trackToSave
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      setFeedback({ type: 'success', text: 'Saved to server!' });
    } catch (err) {
      console.error('Save error:', err);
      setFeedback({ type: 'error', text: 'Failed to save to server: ' + err.message });
    }

    setEditingTopicId(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '1rem' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: '12px', maxWidth: '300px', width: '100%' }}>
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input
              type="password"
              placeholder="Admin token"
              autoComplete="off"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="glass"
              style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', background: 'transparent', color: 'white' }}
            />
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '-0.5rem' }}>
              Enter the server token that authorizes saving curriculum changes.
            </p>
            {loginError && (
              <p style={{ fontSize: '0.8rem', color: '#f87171', margin: 0 }}>{loginError}</p>
            )}
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      </div>
    );
  }

  const activeTrack = tracks.find(t => t.id === activeTrackId);

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', color: 'white' }}>
      {/* Sidebar */}
      <div className="glass" style={{ width: '250px', maxWidth: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderRight: '1px solid rgba(255,255,255,0.1)', borderRadius: 0 }}>
        <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Admin Portal</h3>
        <button 
          className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-ghost'}`} 
          onClick={() => setActiveTab('settings')}
          style={{ justifyContent: 'flex-start' }}
        >
          Settings
        </button>
        <button 
          className={`btn ${activeTab === 'curriculum' ? 'btn-primary' : 'btn-ghost'}`} 
          onClick={() => setActiveTab('curriculum')}
          style={{ justifyContent: 'flex-start' }}
        >
          Curriculum
        </button>
      </div>
      
      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {activeTab === 'settings' && (
          <div className="admin-section">
            <h2 className="admin-subtitle">Platform Access Control</h2>
            <div className="admin-field">
              <label className="admin-label">Admin Storage Token</label>
              <input
                type="password"
                autoComplete="off"
                className="admin-input"
                value={adminToken}
                onChange={e => setAdminToken(e.target.value)}
                placeholder="Enter the secure token for saving curriculum changes"
              />
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                Required to authorize saving modifications to the JSON curriculum database via the local admin server.
              </p>
            </div>
            <button className="admin-btn" onClick={handleSaveSettings}>Save Token</button>
            {feedback && (
              <p style={{ fontSize: '0.8rem', marginTop: '0.75rem', color: feedback.type === 'error' ? '#f87171' : '#34d399' }}>
                {feedback.text}
              </p>
            )}
          </div>
        )}
        
        {activeTab === 'curriculum' && (
          <div>
            <h2>Curriculum</h2>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {tracks.map(t => (
                <button 
                  key={t.id} 
                  className={`btn ${activeTrackId === t.id ? 'btn-primary' : 'glass'}`}
                  onClick={() => setActiveTrackId(t.id)}
                >
                  {t.title}
                </button>
              ))}
            </div>
            
            {activeTrack && (
              <div style={{ marginTop: '2rem' }}>
                <h3>{activeTrack.title} Modules</h3>
                {activeTrack.modules.map(m => (
                  <div key={m.id} className="glass" style={{ padding: '1rem', marginTop: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#fb7185' }}>{m.title}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {m.topics.map(topic => (
                        <div key={topic.id} style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 'bold' }}>{topic.title}</div>
                            <button className="btn btn-ghost" onClick={() => handleEditClick(topic)} style={{ fontSize: '0.8rem', padding: '4px 8px' }}>Edit</button>
                          </div>
                          
                          {editingTopicId === topic.id && (
                            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <input 
                                type="text" 
                                value={editForm.title} 
                                onChange={e => setEditForm({...editForm, title: e.target.value})}
                                style={{ padding: '0.5rem', width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                              />
                              <textarea 
                                value={editForm.summary} 
                                onChange={e => setEditForm({...editForm, summary: e.target.value})}
                                rows={3}
                                style={{ padding: '0.5rem', width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', resize: 'vertical' }}
                              />
                              <textarea 
                                value={editForm.nativeText} 
                                onChange={e => setEditForm({...editForm, nativeText: e.target.value})}
                                rows={3}
                                placeholder="Native Text"
                                style={{ padding: '0.5rem', width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', resize: 'vertical' }}
                              />
                              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <button className="btn btn-primary" onClick={() => handleSaveTopic(activeTrack.id, m.id, topic.id)}>Save Topic</button>
                                <button className="btn btn-ghost" onClick={() => setEditingTopicId(null)}>Cancel</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
