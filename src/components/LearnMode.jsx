import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen, Check, HelpCircle, Languages, Volume2, VolumeX,
  Sparkles, ChevronDown, ChevronRight, X as XIcon,
  RefreshCw, AlertCircle, Bookmark, Search, ArrowLeft, ArrowRight,
  Layers, Brain, FileText, CheckCircle2, Flame, Award, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DiagnosticNode, DeepDiveNode, QuizGenNode } from '../agents/pipeline';
import DiagnosticModal    from './DiagnosticModal';

import { TrackIcon }      from './TrackIcons';
import LessonStepper      from './LessonStepper';
import { TRACKS }         from '../data/index.js';
import ReviewDashboard    from './ReviewDashboard';
import DailyPlanBanner    from './DailyPlanBanner';
import StudyPlanSelector  from './StudyPlanSelector';
import { playSound }      from '../utils/sounds';
import { speakText, stopSpeech } from '../utils/speech';
import { STUDY_PLANS, getCuratedPlanTopics } from '../data/studyPlans.js';

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

export default function LearnMode({ searchSelection, mobileMenuOpen, setMobileMenuOpen }) {
  const { showToast } = useToast();
  const { progress, markTopicCompleted, logMistake, scheduleReview, getDueReviews, recordQuizResult, addXP, nativeLang, setNativeLang } = useAuth();

  const [tracks,      setTracks]      = useState([]);
  const [trackIdx,    setTrackIdx]    = useState(0);
  const [topic,       setTopic]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [expanded,    setExpanded]    = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode,  setFilterMode]  = useState('all'); // all | completed | bookmarked
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
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

  const activePlan = STUDY_PLANS[progress.studyPlan] || STUDY_PLANS.standard;
  const [planFilterActive, setPlanFilterActive] = useState(true);

  /* Curated high-yield topics for active study plan */
  const curatedTopicIds = useMemo(() => {
    const allT = TRACKS.flatMap(t => t?.modules?.flatMap(m => m.topics) || []);
    return new Set(getCuratedPlanTopics(progress.studyPlan, allT).map(t => t.id));
  }, [progress.studyPlan]);

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
    let topics = activeTrack?.modules?.flatMap(m => m.topics) || [];
    if (planFilterActive && progress.studyPlan) {
      topics = topics.filter(t => t && curatedTopicIds.has(t.id));
    }
    return topics;
  }, [activeTrack, planFilterActive, progress.studyPlan, curatedTopicIds]);

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
    if (window.innerWidth <= 768) setSidebarOpen(true);
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
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  const toggleBookmark = (topicId) => {
    playSound.click();
    setBookmarks(prev => {
      const isBookmarked = prev.includes(topicId);
      if (isBookmarked) {
        showToast('Removed from bookmarks', 'info');
        return prev.filter(id => id !== topicId);
      } else {
        showToast('Added to bookmarks!', 'success');
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
      setIsSpeaking(true);
      speakText(text, {
        nativeLang,
        voiceGender,
        rate: 0.95,
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    }
  };

  const stopAudio = () => {
    stopSpeech();
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
      showToast('AI Quiz generation failed: ' + e.message, 'error', 4000);
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
  const totalTopics    = useMemo(() => allTrackTopics.length, [allTrackTopics]);
  const completedCount = useMemo(
    () => allTrackTopics.filter(t => t && isCompleted(t.id)).length,
    [allTrackTopics, progress.completedTopics]
  );
  const nativeText = topic?.native?.[nativeLang] || topic?.native?.Hinglish || '';

  /* Sidebar topic filter (search + plan filter + completed/bookmarked/pending/all) */
  const matchesFilter = (t) => {
    if (!t) return false;
    // In plan view, filter to curated plan topics only
    if (planFilterActive && progress.studyPlan && !curatedTopicIds.has(t.id)) {
      return false;
    }
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = (t.title?.toLowerCase().includes(q) || t.summary?.toLowerCase().includes(q));
    if (!matchesSearch) return false;
    if (filterMode === 'completed') return isCompleted(t.id);
    if (filterMode === 'pending') return !isCompleted(t.id);
    if (filterMode === 'bookmarked') return bookmarks.includes(t.id);
    return true;
  };

  const totalFilteredTopics = useMemo(
    () => (activeTrack?.modules || []).reduce((sum, m) => sum + (m.topics || []).filter(matchesFilter).length, 0),
    [activeTrack, searchQuery, filterMode, bookmarks, progress.completedTopics, planFilterActive, curatedTopicIds]
  );

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

      {/* ── Plan-Aware Filter Bar ── */}
      {progress.studyPlan && (
        <div style={{
          background: planFilterActive ? 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(8,12,20,0.85) 100%)' : 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 14,
          padding: '12px 20px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Flame size={18} style={{ color: 'var(--amber)' }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f1f5f9' }}>
                {activePlan.name} ({curatedTopicIds.size} Curated Topics)
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                {planFilterActive 
                  ? `Showing top ${curatedTopicIds.size} high-importance topics needed for your plan`
                  : 'Showing all 105+ curriculum topics across all tracks'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setPlanFilterActive(prev => !prev)}
            style={{
              background: planFilterActive ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(245,158,11,0.4)',
              color: planFilterActive ? '#fbbf24' : '#e2e8f0',
              padding: '6px 14px',
              borderRadius: 9999,
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            {planFilterActive ? <CheckCircle2 size={13} /> : <BookOpen size={13} />}
            {planFilterActive ? '🔥 High-Yield Plan View (Active)' : '📚 Show All 105 Topics'}
          </button>
        </div>
      )}

      {/* Mobile Sidebar Toggle */}
      <div className="mobile-topic-toggle-wrapper desktop-hide">
        <button 
          className="mobile-topic-toggle btn btn-amber"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={16} /> Select Topic / Track
          {topic && <span className="badge badge-amber" style={{ marginLeft: 8, background: 'rgba(0,0,0,0.2)', color: '#fff', border: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px', display: 'inline-block', verticalAlign: 'middle' }}>{topic.title}</span>}
        </button>
      </div>

      <div className="learn-layout">
        {/* ── Sidebar with Search & Filters ──────────────── */}
        {sidebarOpen && <div className="mobile-drawer-overlay desktop-hide" onClick={() => setSidebarOpen(false)}></div>}
        <aside className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
          <div className="glass sidebar" style={{ padding: '16px 12px' }}>
            {/* Close button for mobile */}
            <button className="mobile-sidebar-close btn btn-ghost desktop-hide" onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, padding: 8 }}>
              <XIcon size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 6, marginBottom: 10 }}>
              <div className="sidebar-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrackIcon trackId={activeTrack.id} size={16} /> Topics
              </div>
              <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>{totalFilteredTopics}</span>
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
              const filteredTopics = (mod.topics || []).filter(matchesFilter);
              const modTopics = mod.topics || [];
              const modDone = modTopics.filter(t => t && isCompleted(t.id)).length;
              const modAllDone = modTopics.length > 0 && modDone === modTopics.length;

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
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`module-count ${modAllDone ? 'done' : ''}`}>
                        {modDone === modTopics.length && modTopics.length > 0 ? <Check size={9} /> : null}
                        {modDone}/{modTopics.length}
                      </span>
                      {expanded[mod.id]
                        ? <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                        : <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
                    </span>
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

                  {filteredTopics.length === 0 && (expanded[mod.id] || searchQuery) && (
                    <div style={{ padding: '8px 12px 12px 12px', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      {filterMode === 'completed'
                        ? 'No completed topics yet — keep going!'
                        : filterMode === 'bookmarked'
                          ? 'No bookmarked topics yet — bookmark topics to see them here.'
                          : filterMode === 'pending'
                            ? 'All topics completed — great job!'
                            : 'No topics available in this module yet.'}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Overall empty state for the whole sidebar */}
            {totalFilteredTopics === 0 && (
              <div className="empty-state" style={{ margin: '6px 4px' }}>
                <Search size={22} className="empty-icon" />
                {searchQuery
                  ? 'No topics match your search.'
                  : filterMode === 'completed'
                    ? 'No completed topics yet — keep going!'
                    : filterMode === 'bookmarked'
                      ? 'No bookmarked topics yet — bookmark topics to see them here.'
                      : 'No topics available in this track yet.'}
              </div>
            )}
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
              onAskWhyWrong={(q, chosenIdx) => {
                setQuiz(q);
                setChosen(chosenIdx);
                setDiagOpen(true);
              }}
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
