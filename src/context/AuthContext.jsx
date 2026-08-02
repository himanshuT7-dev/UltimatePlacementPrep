import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';

const AuthContext = createContext();

const SESSION_KEY  = 'upp_session_v2';
const PROGRESS_KEY = 'upp_progress_v2';
const LANG_KEY     = 'upp_lang_v1';
const VOICE_KEY    = 'upp_voice_v1';

import { getTotalTopics, getAllTopics } from '../data/index.js';
import { generateDailySchedule, STUDY_PLANS } from '../data/studyPlans.js';
import confetti from 'canvas-confetti';
import { useToast } from './ToastContext';

const blankProgress = () => ({
  completedTopics:      [],
  masteryScore:         0,
  mistakeLog:           [],
  preparedModeUnlocked: false,
  streakDays:           0,
  lastActiveDate:       null,
  xp:                   0,
  dailyActivity:        {},
  quizHistory:          [],
  quizScores:           {},
  reviews:              {},
  studyPlan:            null,
  planStartDate:        null,
});

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();

  /* ── Session ──────────────────────────────────────────── */
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
    catch { return null; }
  });

  /* ── Progress ─────────────────────────────────────────── */
  const progressKey = useCallback((s) => `${PROGRESS_KEY}_${s?.email || 'guest'}`, []);

  const loadProgress = useCallback((s) => {
    try {
      const stored = JSON.parse(localStorage.getItem(progressKey(s)));
      if (stored) {
        const bp = blankProgress();
        return {
          ...bp,
          ...stored,
          completedTopics: Array.isArray(stored.completedTopics) ? stored.completedTopics : bp.completedTopics,
          mistakeLog: Array.isArray(stored.mistakeLog) ? stored.mistakeLog : bp.mistakeLog,
          reviews: stored.reviews || bp.reviews,
          dailyActivity: stored.dailyActivity || bp.dailyActivity,
          quizHistory: Array.isArray(stored.quizHistory) ? stored.quizHistory : bp.quizHistory,
          quizScores: stored.quizScores || bp.quizScores,
          xp: stored.xp || bp.xp,
          streakDays: stored.streakDays !== undefined ? stored.streakDays : bp.streakDays,
          lastActiveDate: stored.lastActiveDate || bp.lastActiveDate,
        };
      }
      return blankProgress();
    }
    catch { return blankProgress(); }
  }, [progressKey]);

  const [progress, setProgress] = useState(() => {
    const bp = blankProgress();
    // Immediately restore studyPlan from localStorage to prevent selector flash
    const savedPlan = localStorage.getItem('upp_study_plan');
    if (savedPlan) bp.studyPlan = savedPlan;
    return bp;
  });

  // Refs mirror the latest state so side effects (toasts/confetti/sync) and the
  // debounced network write always read the freshest value, even across rapid calls.
  const progressRef = useRef(progress);
  useEffect(() => { progressRef.current = progress; }, [progress]);

  const sessionRef = useRef(session);
  useEffect(() => { sessionRef.current = session; }, [session]);

  const [initDone, setInitDone] = useState(false);

  /* ── Language & Voice ─────────────────────────────────── */
  const [nativeLang, setNativeLang] = useState(() => localStorage.getItem(LANG_KEY) || 'Hinglish');
  const [voiceGender, setVoiceGender] = useState(() => localStorage.getItem(VOICE_KEY) || 'Female');

  /* ── Persistence ──────────────────────────────────────── */
  // Load initial session and progress. The /auth/me and /progress/get fetches are
  // independent (token already in localStorage), so run them in parallel.
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('upp_auth_token');
      if (token) {
        try {
          const [meRes, progRes] = await Promise.all([
            fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch('/api/progress/get', { headers: { 'Authorization': `Bearer ${token}` } })
          ]);
          const data = await meRes.json();
          if (meRes.ok && data.user) {
            sessionRef.current = data.user;
            setSession(data.user);
            const progData = await progRes.json();
            if (progRes.ok && progData.progress) {
              const merged = { ...blankProgress(), ...progData.progress };
              // Fallback: restore studyPlan from localStorage if backend lost it
              if (!merged.studyPlan) {
                const savedPlan = localStorage.getItem('upp_study_plan');
                if (savedPlan) merged.studyPlan = savedPlan;
              }
              progressRef.current = merged;
              setProgress(merged);
            }
          } else {
            localStorage.removeItem('upp_auth_token');
            setSession(null);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        // Guest mode support uses localstorage
        const guestSession = (() => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } })();
        if (guestSession?.isGuest) {
          sessionRef.current = guestSession;
          setSession(guestSession);
          const loaded = loadProgress(guestSession);
          progressRef.current = loaded;
          setProgress(loaded);
        }
      }
    };
    init().finally(() => setInitDone(true));
  }, [loadProgress]);

  // Debounced progress sync to the server: rapid updates coalesce into a single
  // POST carrying the LATEST progress, so out-of-order writes can't clobber newer
  // state. Guest-mode writes go straight to localStorage (cheap + synchronous).
  const syncTimerRef = useRef(null);

  const syncProgress = useCallback((newProgress) => {
    const currentSession = sessionRef.current;
    if (currentSession?.isGuest) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentSession));
      localStorage.setItem(progressKey(currentSession), JSON.stringify(newProgress));
    } else if (currentSession) {
      const token = localStorage.getItem('upp_auth_token');
      if (token) {
        if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
        syncTimerRef.current = setTimeout(() => {
          fetch('/api/progress/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(progressRef.current)
          }).catch(console.error);
        }, 500);
      }
    }
  }, [progressKey]);

  // Flush any pending debounced write when the page is being unloaded.
  // navigator.sendBeacon can't carry the Authorization header, so use a
  // synchronous final POST instead.
  const flushSync = useCallback(() => {
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
      syncTimerRef.current = null;
    }
    const currentSession = sessionRef.current;
    if (currentSession && !currentSession.isGuest) {
      const token = localStorage.getItem('upp_auth_token');
      if (token) {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/api/progress/update', false); // synchronous final POST
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.send(JSON.stringify(progressRef.current));
        } catch (e) { console.error(e); }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('pagehide', flushSync);
    window.addEventListener('beforeunload', flushSync);
    return () => {
      window.removeEventListener('pagehide', flushSync);
      window.removeEventListener('beforeunload', flushSync);
    };
  }, [flushSync]);

  useEffect(() => { localStorage.setItem(LANG_KEY, nativeLang); }, [nativeLang]);
  useEffect(() => { localStorage.setItem(VOICE_KEY, voiceGender); }, [voiceGender]);

  /* ── Auth actions ─────────────────────────────────────── */
  const login = useCallback(async (user) => {
    sessionRef.current = user;
    setSession(user);
    showToast(`Welcome back, ${user.name}!`, 'success');

    if (user.isGuest) {
      const loaded = loadProgress(user);
      progressRef.current = loaded;
      setProgress(loaded);
    } else {
      const token = localStorage.getItem('upp_auth_token');
      if (token) {
        try {
          const progRes = await fetch('/api/progress/get', { headers: { 'Authorization': `Bearer ${token}` } });
          const progData = await progRes.json();
          if (progRes.ok && progData.progress) {
            const merged = { ...blankProgress(), ...progData.progress };
            // Fallback: restore studyPlan from localStorage if backend lost it
            if (!merged.studyPlan) {
              const savedPlan = localStorage.getItem('upp_study_plan');
              if (savedPlan) merged.studyPlan = savedPlan;
            }
            progressRef.current = merged;
            setProgress(merged);
          }
        } catch (e) {
          console.error('Failed to load progress', e);
        }
      }
    }
  }, [loadProgress, showToast]);

  const logout = useCallback(() => {
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
      syncTimerRef.current = null;
    }
    localStorage.removeItem('upp_auth_token');
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('upp_study_plan');
    sessionRef.current = null;
    setSession(null);
    const bp = blankProgress();
    progressRef.current = bp;
    setProgress(bp);
  }, []);

  /* ── Progress actions ─────────────────────────────────── */
  const markTopicCompleted = useCallback((topicId) => {
    const prev = progressRef.current;
    if (prev.completedTopics.includes(topicId)) return;
    const completed = [...prev.completedTopics, topicId];
    
    // Scale target total to the selected study plan's target topic count (e.g. 20 topics for 1-Day Crash)
    const activePlan  = STUDY_PLANS[prev.studyPlan] || STUDY_PLANS.standard;
    const targetTotal = activePlan.targetTopicCount || getTotalTopics() || 105;
    const mastery     = Math.min(100, Math.round((completed.length / targetTotal) * 100));

    const todayStr = new Date().toISOString().split('T')[0];
    let newStreak = prev.streakDays || 0;
    let newXp = (prev.xp || 0) + 100; // Topic completed +100
    let streakGained = false;

    if (prev.lastActiveDate) {
      if (prev.lastActiveDate !== todayStr) {
        const lastActive = new Date(prev.lastActiveDate);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate - lastActive);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
           newStreak += 1;
           streakGained = true;
        } else {
           newStreak = 1;
        }
        newXp += 25; // Daily streak bonus
      }
    } else {
      newStreak = 1;
      newXp += 25;
    }

    const newDailyActivity = { ...prev.dailyActivity };
    newDailyActivity[todayStr] = (newDailyActivity[todayStr] || 0) + 1;

    // Check level up (every 500 XP)
    const oldLevel = Math.floor((prev.xp || 0) / 500);
    const newLevel = Math.floor(newXp / 500);

    const isPlanCompleted = completed.length >= targetTotal;

    const next = {
      ...prev,
      completedTopics:      completed,
      masteryScore:         mastery,
      preparedModeUnlocked: isPlanCompleted,
      streakDays:           newStreak,
      lastActiveDate:       todayStr,
      xp:                   newXp,
      dailyActivity:        newDailyActivity
    };
    progressRef.current = next;
    setProgress(next);

    // Side effects run AFTER the state update (never inside the updater)
    showToast(`Topic Completed! +100 XP`, 'success');
    if (streakGained) {
      setTimeout(() => showToast(`${newStreak}-Day Streak! +25 Bonus XP`, 'info'), 1500);
    }
    if (newLevel > oldLevel) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => showToast(`Level Up! You reached Level ${newLevel + 1}!`, 'success'), 500);
    }
    // Check plan/curriculum completion
    if (isPlanCompleted) {
      confetti({ particleCount: 300, spread: 120, origin: { y: 0.5 }, colors: ['#f59e0b', '#3b82f6', '#34d399'] });
      setTimeout(() => showToast(`CONGRATULATIONS! You completed the ${activePlan.name}! Prepared Mode unlocked!`, 'success'), 1000);
    }
    syncProgress(next);
  }, [showToast, syncProgress]);

  const addXP = useCallback((amount) => {
    const prev = progressRef.current;
    const newXp = (prev.xp || 0) + amount;
    const oldLevel = Math.floor((prev.xp || 0) / 500);
    const newLevel = Math.floor(newXp / 500);
    const next = { ...prev, xp: newXp };
    progressRef.current = next;
    setProgress(next);
    if (newLevel > oldLevel) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => showToast(`Level Up! You reached Level ${newLevel + 1}!`, 'success'), 500);
    }
    syncProgress(next);
  }, [showToast, syncProgress]);

  const recordQuizResult = useCallback((topicName, isCorrect) => {
    const prev = progressRef.current;
    const todayStr = new Date().toISOString().split('T')[0];
    const newHistory = [{ topicName, isCorrect, date: todayStr }, ...(prev.quizHistory || [])].slice(0, 10);
    const next = {
      ...prev,
      quizHistory: newHistory,
      xp: (prev.xp || 0) + (isCorrect ? 50 : 10)
    };
    progressRef.current = next;
    setProgress(next);
    syncProgress(next);
  }, [syncProgress]);

  const updateQuizScore = useCallback((topicId, score, total) => {
    const prev = progressRef.current;
    const scores = prev.quizScores || {};
    const existing = scores[topicId] || { score: 0, total: 0 };
    if (score > existing.score) {
      const next = { ...prev, quizScores: { ...scores, [topicId]: { score, total } } };

      // Recalculate mastery
      const allScores = Object.values(next.quizScores);
      if (allScores.length > 0) {
        const totalScore = allScores.reduce((acc, curr) => acc + curr.score, 0);
        const totalPossible = allScores.reduce((acc, curr) => acc + curr.total, 0);
        next.masteryScore = Math.round((totalScore / totalPossible) * 100);
      }
      progressRef.current = next;
      setProgress(next);
      syncProgress(next);
    }
  }, [syncProgress]);

  const logMistake = useCallback((entry) => {
    const prev = progressRef.current;
    const next = { ...prev, mistakeLog: [entry, ...prev.mistakeLog.slice(0, 49)] };
    progressRef.current = next;
    setProgress(next);
    syncProgress(next);
  }, [syncProgress]);

  const scheduleReview = useCallback((topicId, quality) => {
    const prev = progressRef.current;
    const currentReview = prev.reviews[topicId] || {
      ease: 2.5,
      interval: 1,
      repetitions: 0,
    };

    let { ease, interval, repetitions } = currentReview;

    if (quality >= 3) {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * ease);
      repetitions += 1;
    } else {
      repetitions = 0;
      interval = 1;
    }

    ease = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

    const today = new Date();
    today.setDate(today.getDate() + interval);
    const nextReview = today.toISOString().split('T')[0];

    const next = {
      ...prev,
      reviews: {
        ...prev.reviews,
        [topicId]: {
          ease,
          interval,
          repetitions,
          nextReview,
          lastQuality: quality,
        }
      }
    };
    progressRef.current = next;
    setProgress(next);
  }, []);

  const getDueReviews = useCallback(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return Object.keys(progress.reviews).filter(topicId => {
      return progress.reviews[topicId].nextReview <= todayStr;
    });
  }, [progress.reviews]);

  /* ── Study Plan actions ───────────────────────────────── */
  const setStudyPlan = useCallback((planId) => {
    // Always save to localStorage as bulletproof fallback
    localStorage.setItem('upp_study_plan', planId);
    const prev = progressRef.current;
    const next = {
      ...prev,
      studyPlan: planId,
      planStartDate: new Date().toISOString(),
    };
    progressRef.current = next;
    setProgress(next);
    syncProgress(next);
  }, [syncProgress]);

  const getStudyDay = useCallback(() => {
    if (!progress.planStartDate) return 1;
    const startDate = new Date(progress.planStartDate);
    if (Number.isNaN(startDate.getTime())) return 1; // guard invalid dates (e.g. bad/null payloads)
    const start = startDate.setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  }, [progress.planStartDate]);

  const getTodaysTopics = useCallback(() => {
    if (!progress.studyPlan) return [];
    const allTopics = getAllTopics();
    const dayNumber = getStudyDay();
    return generateDailySchedule(progress.studyPlan, allTopics, dayNumber);
  }, [progress.studyPlan, getStudyDay]);

  // Memoize the provider value so consumers only re-render when a consumed value
  // actually changes (functions below are stable via useCallback).
  const value = useMemo(() => ({
    session, login, logout,
    user: session,
    isLoggedIn: Boolean(session),
    nativeLang, setNativeLang,
    voiceGender, setVoiceGender,
    progress, markTopicCompleted, logMistake, scheduleReview, getDueReviews,
    addXP, recordQuizResult, setStudyPlan, getStudyDay, getTodaysTopics,
    initDone,
  }), [
    session, login, logout, nativeLang, setNativeLang, voiceGender, setVoiceGender,
    progress, markTopicCompleted, logMistake, scheduleReview, getDueReviews,
    addXP, recordQuizResult, setStudyPlan, getStudyDay, getTodaysTopics, initDone,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
