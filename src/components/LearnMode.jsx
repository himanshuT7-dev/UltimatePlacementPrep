import React, { useState, useEffect, useMemo, Suspense } from 'react';
import {
  BookOpen, Check, HelpCircle, Languages, Volume2, VolumeX,
  Sparkles, ChevronDown, ChevronRight, X as XIcon,
  RefreshCw, AlertCircle, Bookmark, Search, ArrowLeft, ArrowRight,
  Layers, Brain, FileText, CheckCircle2, Flame, Award, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DiagnosticNode, DeepDiveNode, QuizGenNode } from '../agents/pipeline';
import DiagnosticModal    from './DiagnosticModal';
const SQLSandbox = React.lazy(() => import('./SQLSandbox'));
const JSPlayground = React.lazy(() => import('./JSPlayground'));
const CodeDrawer = React.lazy(() => import('./CodeDrawer'));
const InteractiveVisualizer = React.lazy(() => import('./visualizers/InteractiveVisualizer'));

import { TrackIcon }      from './TrackIcons';
import LessonStepper      from './LessonStepper';
import { TRACKS }         from '../data/index.js';
import ReviewDashboard    from './ReviewDashboard';
import DailyPlanBanner    from './DailyPlanBanner';
import StudyPlanSelector  from './StudyPlanSelector';
import { playSound }      from '../utils/sounds';
import { useToast }       from '../context/ToastContext';

const LoadingSpinner = () => (
  <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
    <div className="spinner" style={{ margin: '0 auto 8px' }} />
    Loading component...
  </div>
);

const TRACK_GRADIENTS = [
  'linear-gradient(135deg,#f59e0b,#d97706)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#0ea5e9,#0284c7)',
  'linear-gradient(135deg,#8b5cf6,#7c3aed)',
  'linear-gradient(135deg,#f43f5e,#be123c)',
];

export default function LearnMode({ searchSelection }) {
  const { progress, markTopicCompleted, nativeLang, scheduleReview, recordQuizResult } = useAuth();
  const { showToast } = useToast();

  const [tracks,      setTracks]      = useState([]);
  const [trackIdx,    setTrackIdx]    = useState(0);
  const [topic,       setTopic]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [expanded,    setExpanded]    = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode,  setFilterMode]  = useState('all'); // all | completed | bookmarked
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookmarks,   setBookmarks]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('upp_bookmarks_v1')) || []; } catch { return []; }
  });

  /* Audio state */
  const [isSpeaking, setIsSpeaking] = useState(false);

  /* Active Recall Flashcard state */
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [cardFlipped,   setCardFlipped]   = useState(false);

  /* Deep Dive state */
  const [showNative,   setShowNative]   = useState(false);
  const [deepDive,     setDeepDive]     = useState(null);
  const [deepLoading,  setDeepLoading]  = useState(false);
  const [deepMode,     setDeepMode]     = useState(null);

  /* Quiz state */
  const [quiz,         setQuiz]         = useState(null);
  const [quizLoading,  setQuizLoading]  = useState(false);
  const [chosen,       setChosen]       = useState(null);
  const [submitted,    setSubmitted]    = useState(false);
  const [diagOpen,     setDiagOpen]     = useState(false);
  const [aiQuizMode,   setAiQuizMode]   = useState(false);
  const [askedQuestions, setAskedQuestions] = useState([]);

  /* Study Plan Selector state for changing plan */
  const [showPlanSelector, setShowPlanSelector] = useState(false);

  /* Initialize tracks synchronously */
  useEffect(() => {
    const ts = TRACKS;
    setTracks(ts);
    if (ts.length > 0) {
      const firstTopic = ts[0]?.modules?.[0]?.topics?.[0];
      setTopic(firstTopic || null);
      setQuiz(firstTopic?.quiz || null);
      if (ts[0]?.modules?.[0]?.id) {
        setExpanded({ [ts[0].modules[0].id]: true });
      }
      const total = ts.reduce((sum, t) => sum + (t?.totalTopics || t?.modules?.flatMap(m => m.topics)?.length || 0), 0);
    }
    setLoading(false);
  }, []);

  /* Save bookmarks */
  useEffect(() => {
    try { localStorage.setItem('upp_bookmarks_v1', JSON.stringify(bookmarks)); } catch {}
  }, [bookmarks]);

  /* Handle search selection */
  useEffect(() => {
    if (searchSelection && tracks.length > 0) {
      const { trackId, topicId } = searchSelection;
      const tIdx = tracks.findIndex(t => t.id === trackId);
      if (tIdx !== -1) {
        setTrackIdx(tIdx);
        const mod = tracks[tIdx].modules.find(m => (m.topics || []).some(tp => tp && tp.id === topicId));
        if (mod) {
          setExpanded(prev => ({ ...prev, [mod.id]: true }));
          const foundTopic = mod.topics.find(tp => tp && tp.id === topicId);
          if (foundTopic) selectTopic(foundTopic);
        }
      }
    }
  }, [searchSelection, tracks]);

  const activeTrack = tracks[trackIdx];

  /* Flat list of topics in current active track */
  const allTrackTopics = useMemo(() => {
    return activeTrack?.modules?.flatMap(m => m.topics) || [];
  }, [activeTrack]);

  const currentTopicIndex = useMemo(() => {
    if (!topic || !allTrackTopics.length) return -1;
    return allTrackTopics.findIndex(t => t && t.id === topic.id);
  }, [topic, allTrackTopics]);

  const switchTrack = (idx) => {
    setTrackIdx(idx);
    stopAudio();
    const firstTopic = tracks[idx]?.modules?.[0]?.topics?.[0];
    selectTopic(firstTopic, tracks[idx]);
    setExpanded({ [tracks[idx]?.modules?.[0]?.id]: true });
  };

  const selectTopic = (t) => {
    stopAudio();
    setTopic(t);
    setQuiz(t?.quiz || null);
    setChosen(null);
    setSubmitted(false);
    setDeepDive(null);
    setShowNative(false);
    setAiQuizMode(false);
    setAskedQuestions([]);
    setShowFlashcard(false);
    setCardFlipped(false);
  };

  const toggleBookmark = (topicId) => {
    playSound.click();
    setBookmarks(prev => {
      const isBookmarked = prev.includes(topicId);
      if (isBookmarked) {
        showToast('Removed from bookmarks', 'info');
        return prev.filter(id => id !== topicId);
      } else {
        showToast('Added to bookmarks! 📌', 'success');
        return [...prev, topicId];
      }
    });
  };

  const toggleModule = (mid) =>
    setExpanded(prev => ({ ...prev, [mid]: !prev[mid] }));

  const handleReviewSelect = (t) => {
    const tTrackIdx = tracks.findIndex(tr => tr.modules.some(m => m.topics.some(tp => tp && tp.id === t.id)));
    if (tTrackIdx !== -1 && tTrackIdx !== trackIdx) {
      setTrackIdx(tTrackIdx);
      const mod = tracks[tTrackIdx].modules.find(m => m.topics.some(tp => tp && tp.id === t.id));
      if (mod) setExpanded(prev => ({ ...prev, [mod.id]: true }));
    } else {
      const mod = activeTrack.modules.find(m => m.topics.some(tp => tp && tp.id === t.id));
      if (mod) setExpanded(prev => ({ ...prev, [mod.id]: true }));
    }
    selectTopic(t);
  };

  const isCompleted = (id) => Array.isArray(progress?.completedTopics) && progress.completedTopics.includes(id);

  /* Audio speech control */
  const toggleAudio = (text) => {
    if (isSpeaking) {
      stopAudio();
    } else {
      stopAudio();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis?.speak(u);
    }
  };

  const stopAudio = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  /* Deep Dive */
  const handleDeepDive = async (mode) => {
    if (!topic || !activeTrack) return;
    setDeepLoading(true); setDeepDive(null); setDeepMode(mode);
    try {
      const d = await DeepDiveNode.run(activeTrack.label, topic.title, mode, nativeLang);
      setDeepDive(d);
    } catch (e) {
      setDeepDive({ title: 'Error', sections: [{ heading: 'Error', body: e.message }], keyTakeaway: '' });
    } finally { setDeepLoading(false); }
  };

  /* AI Quiz Generation */
  const generateAIQuiz = async () => {
    if (!topic || !activeTrack) return;
    setQuizLoading(true); setChosen(null); setSubmitted(false);
    try {
      const difficulty = isCompleted(topic.id) ? 'advanced' : 'beginner';
      const q = await QuizGenNode.run(
        activeTrack.label, topic.title, difficulty,
        askedQuestions
      );
      setQuiz(q);
      setAskedQuestions(prev => [...prev, q.question].slice(-20));
      setAiQuizMode(true);
    } catch (e) {
      alert('AI Quiz generation failed: ' + e.message);
    } finally { setQuizLoading(false); }
  };

  const submitQuiz = (idx) => {
    setChosen(idx);
    setSubmitted(true);
    const isCorrect = idx === quiz.correct;
    recordQuizResult(topic.title, isCorrect);
    if (isCorrect) {
      playSound.success();
      markTopicCompleted(topic.id);
      scheduleReview(topic.id, 5);
    } else {
      playSound.error();
      scheduleReview(topic.id, 1);
    }
  };

  /* Computed */
  const totalTopics    = useMemo(() => activeTrack?.modules?.flatMap(m => m.topics)?.length || 0, [activeTrack]);
  const completedCount = useMemo(
    () => (activeTrack?.modules?.flatMap(m => m.topics) || []).filter(t => t && isCompleted(t.id)).length,
    [activeTrack, progress.completedTopics]
  );
  const nativeText = topic?.native?.[nativeLang] || topic?.native?.Hinglish || '';

  if (loading) {
    return (
      <div className="loading-pulse" style={{ padding: '60px 0', justifyContent: 'center' }}>
        <div className="spinner" />
        Loading curriculum…
      </div>
    );
  }

  if (!activeTrack) return null;

  return (
    <div>
      {/* ── Track Tabs ──────────────────────────────────── */}
      <div className="track-tabs" style={{ marginBottom: 20 }}>
        {tracks.map((t, i) => (
          <button
            key={t.id}
            className={`track-tab ${trackIdx === i ? 'active' : ''}`}
            style={trackIdx === i ? { background: TRACK_GRADIENTS[i], color: '#fff' } : {}}
            onClick={() => switchTrack(i)}
          >
            <span
              className="track-icon"
              style={{ background: trackIdx === i ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <TrackIcon trackId={t.id} size={15} />
            </span>
            {t.label}
            <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>
              {(tracks[i]?.modules?.flatMap(m => m.topics) || []).filter(tp => tp && isCompleted(tp.id)).length || 0}/{t.totalTopics || 0}
            </span>
          </button>
        ))}
      </div>

      {/* ── Track Progress Bar ───────────────────────────── */}
      <div style={{
        background: 'rgba(14, 19, 32, 0.65)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--r-xl)',
        padding: '14px 20px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: 8 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{activeTrack.label} Progress</span>
            <span style={{ color: 'var(--amber)' }}>{completedCount}/{totalTopics} topics</span>
          </div>
          <div className="progress-bar-wrap" style={{ height: 6 }}>
            <div className="progress-bar" style={{ width: `${totalTopics ? (completedCount / totalTopics) * 100 : 0}%` }} />
          </div>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flex: '1 1 100%', lineHeight: 1.5, wordBreak: 'break-word' }}>
          {activeTrack.description}
        </span>
      </div>

      <ReviewDashboard onSelectTopic={handleReviewSelect} />
      
      <DailyPlanBanner onChangePlan={() => setShowPlanSelector(true)} />

      {/* Mobile Sidebar Toggle */}
      <button 
        className="sidebar-toggle btn btn-ghost"
        style={{ marginBottom: 16, width: '100%', justifyContent: 'center' }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={16} /> {sidebarOpen ? 'Hide Topics' : 'Show Topics'}
      </button>

      <div className="learn-layout">
        {/* ── Sidebar with Search & Filters ──────────────── */}
        <aside style={{ display: sidebarOpen ? 'block' : 'none' }}>
          <div className="glass sidebar" style={{ padding: '16px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 6, marginBottom: 10 }}>
              <div className="sidebar-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrackIcon trackId={activeTrack.id} size={16} /> Topics
              </div>
              <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>{totalTopics}</span>
            </div>

            {/* Sidebar Search Bar */}
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="glass-input"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 30, fontSize: '0.76rem', height: 32 }}
              />
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
              {['all', 'completed', 'bookmarked'].map(mode => (
                <button
                  key={mode}
                  style={{
                    flex: 1,
                    padding: '4px 6px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    borderRadius: 'var(--r-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    background: filterMode === mode ? 'rgba(234, 88, 12, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: filterMode === mode ? 'var(--amber)' : 'var(--text-muted)',
                  }}
                  onClick={() => setFilterMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Module Accordions */}
            {activeTrack.modules.map(mod => {
              const filteredTopics = (mod.topics || []).filter(t => {
                if (!t) return false;
                const matchesSearch = t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || t.summary?.toLowerCase().includes(searchQuery.toLowerCase());
                if (!matchesSearch) return false;
                if (filterMode === 'completed') return isCompleted(t.id);
                if (filterMode === 'pending') return !isCompleted(t.id);
                if (filterMode === 'bookmarked') return bookmarks.includes(t.id);
                return true;
              });

              if (filteredTopics.length === 0 && searchQuery) return null;

              return (
                <div key={mod.id} className="module-group">
                  <button
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                      padding: '6px 8px', borderRadius: 'var(--r-sm)',
                    }}
                    onClick={() => toggleModule(mod.id)}
                  >
                    <span className="module-group-title" style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{mod.title}</span>
                    {expanded[mod.id]
                      ? <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                      : <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
                  </button>

                  {(expanded[mod.id] || searchQuery) && filteredTopics.map(t => (
                    <button
                      key={t.id}
                      className={`topic-btn ${topic?.id === t.id ? 'active' : ''}`}
                      onClick={() => selectTopic(t)}
                    >
                      <span style={{ flex: 1, fontSize: '0.78rem' }}>{t.title}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {bookmarks.includes(t.id) && (
                          <Bookmark size={12} style={{ color: 'var(--amber)', fill: 'var(--amber)' }} />
                        )}
                        {isCompleted(t.id) && (
                          <span className="topic-check"><Check size={9} /></span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── Main Content ────────────────────────────────── */}
        <main className="topic-content">
          {!topic ? (
            <div className="glass" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              Select a topic from the sidebar to begin learning.
            </div>
          ) : (
            <LessonStepper
              topic={topic}
              activeTrack={activeTrack}
              isCompleted={isCompleted}
              markComplete={markTopicCompleted}
              toggleBookmark={toggleBookmark}
              bookmarks={bookmarks}
              nativeLang={nativeLang}
              scheduleReview={scheduleReview}
              recordQuizResult={recordQuizResult}
              onNextTopic={() => selectTopic(allTrackTopics[currentTopicIndex + 1])}
              onPrevTopic={() => selectTopic(allTrackTopics[currentTopicIndex - 1])}
              hasNext={currentTopicIndex < allTrackTopics.length - 1}
              hasPrev={currentTopicIndex > 0}
            />
          )}
        </main>
      </div>

      {/* Diagnostic Modal */}
      {diagOpen && topic && quiz && chosen !== null && (
        <DiagnosticModal
          track={activeTrack?.label}
          topic={topic.title}
          question={quiz}
          chosenIdx={chosen}
          onClose={() => setDiagOpen(false)}
        />
      )}

      {showPlanSelector && (
        <StudyPlanSelector onClose={() => setShowPlanSelector(false)} forceSelection={false} />
      )}
    </div>
  );
}
