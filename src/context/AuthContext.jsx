import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const SESSION_KEY  = 'upp_session_v2';
const PROGRESS_KEY = 'upp_progress_v2';
const LANG_KEY     = 'upp_lang_v1';

import { getTotalTopics, getAllTopics } from '../data/index.js';
import { generateDailySchedule } from '../data/studyPlans.js';
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
  const progressKey = (s) => `${PROGRESS_KEY}_${s?.email || 'guest'}`;

  const loadProgress = (s) => {
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
          xp: stored.xp || bp.xp,
          streakDays: stored.streakDays !== undefined ? stored.streakDays : bp.streakDays,
          lastActiveDate: stored.lastActiveDate || bp.lastActiveDate,
        };
      }
      return blankProgress();
    }
    catch { return blankProgress(); }
  };

  const [progress, setProgress] = useState(() => loadProgress(
    (() => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } })()
  ));

  /* ── Language ─────────────────────────────────────────── */
  const [nativeLang, setNativeLang] = useState(() => localStorage.getItem(LANG_KEY) || 'Hinglish');

  /* ── Persistence ──────────────────────────────────────── */
  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session]);

  useEffect(() => {
    if (session) localStorage.setItem(progressKey(session), JSON.stringify(progress));
  }, [progress, session]);

  useEffect(() => { localStorage.setItem(LANG_KEY, nativeLang); }, [nativeLang]);

  /* ── Auth actions ─────────────────────────────────────── */
  const login = (user) => {
    setSession(user);
    setProgress(loadProgress(user));
    showToast(`Welcome back, ${user.name}!`, 'success');
  };

  const logout = () => {
    setSession(null);
    setProgress(blankProgress());
  };

  /* ── Progress actions ─────────────────────────────────── */
  const markTopicCompleted = useCallback((topicId) => {
    setProgress(prev => {
      if (prev.completedTopics.includes(topicId)) return prev;
      const completed = [...prev.completedTopics, topicId];
      const total     = getTotalTopics() || 100;
      const mastery   = Math.min(100, Math.round((completed.length / total) * 100));
      
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

      // Toast feedback
      showToast(`Topic Completed! +100 XP`, 'success');
      if (streakGained) {
        setTimeout(() => showToast(`🔥 ${newStreak}-Day Streak! +25 Bonus XP`, 'info'), 1500);
      }

      // Check level up (every 500 XP)
      const oldLevel = Math.floor((prev.xp || 0) / 500);
      const newLevel = Math.floor(newXp / 500);
      if (newLevel > oldLevel) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => showToast(`🎉 Level Up! You reached Level ${newLevel + 1}!`, 'success'), 500);
      }

      // Check overall track completion
      if (completed.length === total) {
        confetti({ particleCount: 300, spread: 120, origin: { y: 0.5 }, colors: ['#f59e0b', '#3b82f6', '#34d399'] });
        setTimeout(() => showToast(`🏆 INCREDIBLE! You finished the entire curriculum!`, 'success'), 1000);
      }

      return {
        ...prev,
        completedTopics:      completed,
        masteryScore:         mastery,
        preparedModeUnlocked: completed.length >= total,
        streakDays:           newStreak,
        lastActiveDate:       todayStr,
        xp:                   newXp,
        dailyActivity:        newDailyActivity
      };
    });
  }, [showToast]);

  const addXP = useCallback((amount) => {
    setProgress(prev => {
      const newXp = (prev.xp || 0) + amount;
      const oldLevel = Math.floor((prev.xp || 0) / 500);
      const newLevel = Math.floor(newXp / 500);
      if (newLevel > oldLevel) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => showToast(`🎉 Level Up! You reached Level ${newLevel + 1}!`, 'success'), 500);
      }
      return { ...prev, xp: newXp };
    });
  }, [showToast]);

  const recordQuizResult = useCallback((topicName, isCorrect) => {
    setProgress(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      const newHistory = [{ topicName, isCorrect, date: todayStr }, ...(prev.quizHistory || [])].slice(0, 10);
      return {
        ...prev,
        quizHistory: newHistory,
        xp: (prev.xp || 0) + (isCorrect ? 50 : 10)
      };
    });
  }, []);

  const logMistake = useCallback((entry) => {
    setProgress(prev => ({ ...prev, mistakeLog: [entry, ...prev.mistakeLog.slice(0, 49)] }));
  }, []);

  const scheduleReview = useCallback((topicId, quality) => {
    setProgress(prev => {
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

      return {
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
    });
  }, []);

  const getDueReviews = useCallback(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return Object.keys(progress.reviews).filter(topicId => {
      return progress.reviews[topicId].nextReview <= todayStr;
    });
  }, [progress.reviews]);

  /* ── Study Plan actions ───────────────────────────────── */
  const setStudyPlan = useCallback((planId) => {
    setProgress(prev => ({
      ...prev,
      studyPlan: planId,
      planStartDate: new Date().toISOString(),
    }));
  }, []);

  const getStudyDay = useCallback(() => {
    if (!progress.planStartDate) return 1;
    const start = new Date(progress.planStartDate).setHours(0,0,0,0);
    const today = new Date().setHours(0,0,0,0);
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

  return (
    <AuthContext.Provider value={{
      session, login, logout,
      user: session,
      isLoggedIn: Boolean(session),
      nativeLang, setNativeLang,
      progress, markTopicCompleted, logMistake, scheduleReview, getDueReviews,
      addXP, recordQuizResult, setStudyPlan, getStudyDay, getTodaysTopics,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
