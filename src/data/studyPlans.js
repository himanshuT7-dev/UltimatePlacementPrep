export const STUDY_PLANS = {
  'crash': {
    id: 'crash',
    name: '1-Day Crash Sprint',
    iconName: 'Zap',
    duration: 1,
    durationLabel: '1 Day',
    targetTopicCount: 20,
    topicsPerDay: 20,
    allowedImportance: ['high'],
    description: 'Focus ONLY on the top 20 highest-yielding placement questions. Zero fluff, maximum ROI.',
    features: ['Top 20 High-Yield Core Topics', 'Key placement questions', 'Quick revision mode'],
    skipCode: true,
    skipQuiz: false,
    revisionCycles: 0,
    mockInterviews: 1,
  },
  'sprint': {
    id: 'sprint',
    name: '10-Day Sprint',
    iconName: 'Flame',
    duration: 10,
    durationLabel: '10 Days',
    targetTopicCount: 45,
    topicsPerDay: 4.5,
    allowedImportance: ['high', 'medium'],
    description: 'Intensive 10-day bootcamp covering 45 core and medium placement topics.',
    features: ['45 Curated High & Medium Topics', 'Code examples & quizzes', 'Visualizers', 'Mock interview'],
    skipCode: false,
    skipQuiz: false,
    revisionCycles: 1,
    mockInterviews: 1,
  },
  'standard': {
    id: 'standard',
    name: '30-Day Placement Ready',
    iconName: 'BookOpen',
    duration: 30,
    durationLabel: '1 Month',
    targetTopicCount: 75,
    topicsPerDay: 2.5,
    allowedImportance: ['high', 'medium', 'standard'],
    description: 'Balanced month-long preparation. Covers 75 comprehensive topics with full practice.',
    features: ['75 Comprehensive Topics', 'Full code practice', 'Quizzes & Sandboxes', '2 Mock interviews'],
    skipCode: false,
    skipQuiz: false,
    revisionCycles: 2,
    mockInterviews: 2,
  },
  'thorough': {
    id: 'thorough',
    name: 'Thorough 6-Month Prep',
    iconName: 'Target',
    duration: 180,
    durationLabel: '6 Months',
    targetTopicCount: 105,
    topicsPerDay: 1,
    allowedImportance: ['high', 'medium', 'standard'],
    description: 'Deep preparation across all 105+ topics with spaced repetition and portfolio tracking.',
    features: ['All 105+ Topics', 'Spaced repetition', '6 Mock interviews', 'Notes & Sandboxes'],
    skipCode: false,
    skipQuiz: false,
    revisionCycles: 4,
    mockInterviews: 6,
  },
  'mastery': {
    id: 'mastery',
    name: '1-Year Engineering Mastery',
    iconName: 'Trophy',
    duration: 365,
    durationLabel: '1 Year',
    targetTopicCount: 105,
    topicsPerDay: 0.5,
    allowedImportance: ['high', 'medium', 'standard'],
    description: 'Complete technical & architectural mastery. All topics, weekly mocks, multiple revisions.',
    features: ['All 105+ Topics', 'Deep System Design', '12 Mock interviews', 'Spaced repetition'],
    skipCode: false,
    skipQuiz: false,
    revisionCycles: 6,
    mockInterviews: 12,
  },
};

const IMPORTANCE_WEIGHTS = { high: 3, medium: 2, standard: 1 };

export function getCuratedPlanTopics(planId, allTopics = []) {
  const plan = STUDY_PLANS[planId] || STUDY_PLANS.standard;
  if (!allTopics || allTopics.length === 0) return [];

  // Filter topics by allowed importance while preserving natural track & module order
  const allowed = new Set(plan.allowedImportance || ['high', 'medium', 'standard']);
  
  const filtered = allTopics.filter(t => {
    const imp = t.importance || (t.level === 'Beginner' ? 'high' : t.level === 'Intermediate' ? 'medium' : 'standard');
    return allowed.has(imp);
  });

  // Return the curated subset up to targetTopicCount in curriculum order
  return filtered.slice(0, plan.targetTopicCount || allTopics.length);
}

/**
 * Generates the daily schedule topics for a specific day in the plan.
 */
export function generateDailySchedule(planId, allTopics = [], dayNumber = 1) {
  const plan = STUDY_PLANS[planId] || STUDY_PLANS.standard;
  const curatedTopics = getCuratedPlanTopics(planId, allTopics);
  
  const perDay = Math.max(1, Math.ceil(curatedTopics.length / plan.duration));
  const start = (dayNumber - 1) * perDay;
  return curatedTopics.slice(start, start + perDay);
}

