/* Gemini Pro API Service — Direct, throttled, cached */

const CACHE_PFX  = 'upp_gemini_cache_v2_';
const MIN_GAP_MS = 4000;
let lastCall     = 0;

/* ═══ Interview Round Definitions ═══════════════════════ */
export const ROUND_MODES = {
  quick: {
    label: 'Quick Practice (5 Questions)',
    total: 5,
    rounds: [
      { name: 'Mixed Technical & HR', type: 'mixed', count: 5 }
    ]
  },
  tcs: {
    label: 'TCS / Infosys / Wipro Campus Drive (8 Questions)',
    total: 8,
    rounds: [
      { name: 'CS Fundamentals', type: 'cs_fundamentals', count: 3 },
      { name: 'DBMS & Project Verification', type: 'dbms_project', count: 3 },
      { name: 'HR & Cultural Fit', type: 'hr', count: 2 }
    ]
  },
  cognizant: {
    label: 'Cognizant / Deloitte Assessment Loop (10 Questions)',
    total: 10,
    rounds: [
      { name: 'Technical Depth & Code Scenarios', type: 'technical_deep', count: 4 },
      { name: 'JAM / Extempore & Communication', type: 'jam_extempore', count: 2 },
      { name: 'Behavioral & Situational Judgment (STAR)', type: 'behavioral_star', count: 4 }
    ]
  },
  amazon: {
    label: 'Amazon / Google Bar Raiser (12 Questions)',
    total: 12,
    rounds: [
      { name: 'Data Structures & Algorithms', type: 'dsa', count: 3 },
      { name: 'System Design & Scalability', type: 'system_design', count: 3 },
      { name: 'Low-Level Design & Code Execution', type: 'lld', count: 3 },
      { name: 'Leadership Principles & Behavioral', type: 'leadership', count: 3 }
    ]
  }
};

export const testConnection = async () => {
  try {
    const r = await fetch('/api/gemini', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'ping' })
    });
    if (!r.ok) { const e = await r.json(); return { ok: false, msg: e.error || 'API error' }; }
    return { ok: true, msg: '✓ Connected to Gemini Pro successfully via secure proxy!' };
  } catch (e) { return { ok: false, msg: e.message }; }
};

const parseJsonSafely = (text) => {
  if (!text || typeof text !== 'string') return null;
  let cleaned = text
    .replace(/```(?:json)?\s*/gi, '')
    .replace(/\s*```\s*/g, '')
    .trim();

  // 1. Direct parse attempt
  try { return JSON.parse(cleaned); } catch {}

  // 2. Extract JSON block boundaries
  const match = cleaned.match(/[\{\[][\s\S]*[\}\]]/);
  if (match) {
    let str = match[0];
    try { return JSON.parse(str); } catch {}

    // Sanitize trailing commas before } or ]
    str = str.replace(/,\s*([\}\]])/g, '$1');

    // Fix unescaped control characters in JSON strings
    str = str.replace(/[\x00-\x1F\x7F-\x9F]/g, (m) => {
      if (m === '\n') return '\\n';
      if (m === '\r') return '\\r';
      if (m === '\t') return '\\t';
      return '';
    });

    try { return JSON.parse(str); } catch {}

    // Auto-repair truncated JSON objects/arrays by balancing missing brackets
    let openBrackets = (str.match(/\[/g) || []).length - (str.match(/\]/g) || []).length;
    let openBraces = (str.match(/\{/g) || []).length - (str.match(/\}/g) || []).length;

    while (openBraces > 0) { str += '}'; openBraces--; }
    while (openBrackets > 0) { str += ']'; openBrackets--; }

    try { return JSON.parse(str); } catch {}
  }
  return null;
};

const call = async (prompt, system = '', json = false, retries = 3, skipCache = false) => {
  const ck = CACHE_PFX + btoa(unescape(encodeURIComponent(prompt + system))).slice(0, 48);
  if (!skipCache) {
    const cached = localStorage.getItem(ck);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (!json || (typeof parsed === 'object' && parsed !== null)) {
          return parsed;
        }
      } catch {}
      localStorage.removeItem(ck);
    }
  }

  const wait = MIN_GAP_MS - (Date.now() - lastCall);
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastCall = Date.now();

  for (let attempt = 0; attempt < retries; attempt++) {
    let r;
    try {
      r = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, system, json })
      });
    } catch (networkErr) {
      console.warn(`[GeminiService] Network error on attempt ${attempt + 1}: ${networkErr.message}. Retrying...`);
      if (attempt < retries - 1) {
        await new Promise(res => setTimeout(res, 2500));
        continue;
      }
      throw new Error("Network connection interrupted. Please check your internet connection and try again.");
    }

    if (r.status === 429 || (r.status === 503 && attempt < retries - 1)) {
      const backoff = Math.min(5000 * Math.pow(2, attempt), 30000);
      console.warn(`Rate limited, retrying in ${backoff / 1000}s (attempt ${attempt + 1}/${retries})`);
      await new Promise(res => setTimeout(res, backoff));
      continue;
    }

    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      if (e.error && e.error.includes('retry in') && attempt < retries - 1) {
        const match = e.error.match(/retry in ([\d.]+)s/);
        const waitTime = match ? Math.ceil(parseFloat(match[1])) * 1000 : 10000;
        console.warn(`Quota exceeded, waiting ${waitTime / 1000}s before retry`);
        await new Promise(r => setTimeout(r, waitTime));
        continue;
      }
      throw new Error(e.error || `Server error ${r.status}`);
    }

    const data = await r.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let out = text;
    if (json) {
      const parsed = parseJsonSafely(text);
      if (parsed) {
        out = parsed;
      } else if (attempt < retries - 1) {
        console.warn(`[GeminiService] Failed to parse JSON on attempt ${attempt + 1}, retrying...`);
        await new Promise(r => setTimeout(r, 2000));
        continue;
      } else {
        throw new Error('AI response was not valid JSON after multiple attempts.');
      }
    }

    // Only cache if valid object when json=true, or non-empty string when json=false
    if (!json || (typeof out === 'object' && out !== null)) {
      try { localStorage.setItem(ck, JSON.stringify(out)); } catch {}
    }
    return out;
  }

  throw new Error('Max retries exceeded. Please wait a minute and try again.');
};

/* ── Public API functions ── */

export const getDiagnostic = (topic, question, chosen, correct, lang) =>
  call(
    `Topic: ${topic}\nQuestion: ${question}\nStudent chose: "${chosen}"\nCorrect answer: "${correct}"\nLanguage: ${lang}

Return JSON:
{
  "encouragement": "Warm, empathetic 1-sentence message",
  "flaw": "Exact logical flaw in student's choice",
  "misconception": "Core concept they misunderstood",
  "correct": "Clear step-by-step explanation of correct answer",
  "native": "Same explanation in simple ${lang} using everyday analogy",
  "nativeAudio": "Text to read aloud in ${lang}"
}`,
    'You are a warm, supportive placement mentor. Never shame the student. Be empathetic and educational. Output only valid JSON.',
    true
  );

export const getDeepDive = (track, concept, mode, lang) =>
  call(
    `Track: ${track}\nConcept: ${concept}\nMode: ${mode}\nNative Language: ${lang}

Return JSON:
{
  "title": "Deep dive heading",
  "explanation": "Thorough ${mode === 'ELI5' ? 'simple analogy-based' : 'step-by-step technical'} explanation in 4-6 paragraphs",
  "keyTakeaway": "One golden interview rule",
  "native": "Explanation in ${lang} with real-life analogy"
}`,
    'You are an expert technical educator. Be thorough, clear, and encouraging. Output only valid JSON.',
    true
  );

export const evaluateInterview = (question, answer, stack) =>
  call(
    `Interview Question: "${question}"\nStudent's spoken answer: "${answer}"\nTech Stack: ${stack}

Return JSON:
{
  "technicalScore": 82,
  "fluencyScore": 76,
  "technicalFeedback": "Detailed constructive feedback on technical accuracy",
  "grammarNote": "Specific grammar or tense corrections needed",
  "polished": "Ideal version of their answer in professional English",
  "fillers": ["um", "basically"],
  "encouragement": "Brief motivating closing remark"
}`,
    'You are an experienced technical interviewer. Be constructive and warm. Output only valid JSON.',
    true
  );

const FOCUS_TOPICS = [
  'Memory Leak & Garbage Collection Internals',
  'Concurrency, Threading & Lock Contention',
  'Database Indexing, B-Trees & Query Optimization',
  'Microservices, API Gateway & Distributed Caching',
  'Event Loop, Microtasks & Async Promises',
  'Data Structures, Graph Traversals & Dynamic Programming',
  'System Scalability, Load Balancing & Partitioning',
  'STAR Method Behavioral & Crisis Management'
];

export const generateInterviewQuestions = (type, difficulty, company, roundModeKey = 'quick') => {
  const mode = ROUND_MODES[roundModeKey] || ROUND_MODES.quick;
  const roundSpec = mode.rounds.map(r => `  - Round "${r.name}" (type: ${r.type}): exactly ${r.count} questions`).join('\n');
  
  // Pick random focal topics to guarantee maximum freshness on every single attempt
  const randomSeed = Math.floor(Math.random() * 100000);
  const randomFocus = [...FOCUS_TOPICS].sort(() => 0.5 - Math.random()).slice(0, 3).join(', ');

  return call(
    `Role: ${type}
Experience Level: ${difficulty}
Target Company Style: ${company}
Session Seed: ${Date.now()}-${randomSeed}
Focal Areas: ${randomFocus}

You are an expert lead interviewer. Conduct a realistic ${mode.label} mock interview.
Generate exactly ${mode.total} brand-new, non-generic, highly realistic interview questions organized into these sub-rounds:
${roundSpec}

CRITICAL REQUIREMENTS:
- Every question MUST have an exact "round" property matching one of the sub-round names above.
- Make questions specific to ${company} and the ${type} role. Do NOT repeat generic questions.
- Keep modelAnswer concise (2 sentences max) to ensure clean output.

Return ONLY a valid JSON object matching this structure:
{
  "questions": [
    {
      "text": "The exact question string to ask the candidate",
      "round": "Exact round name from above",
      "modelAnswer": "Concise 2-sentence ideal response",
      "points": ["Key point 1", "Key point 2"],
      "keywords": ["keyword1", "keyword2"],
      "isHR": false
    }
  ]
}`,
    'You are a senior tech recruiter and hiring committee lead. Respond ONLY with valid JSON. Do not include markdown formatting or extra text.',
    true,
    4,
    true
  );
};

export const generateInterviewSummary = (answers, anomalies, type, difficulty, company) => {
  const formattedHistory = answers.map((a, i) => `Q${i+1} [Round: ${a.question.round || 'General'}] (${a.question.text}):\nCandidate Answer: "${a.userAnswer || 'No answer provided'}"`).join('\n\n');
  
  return call(
    `Role: ${type}\nLevel: ${difficulty}\nCompany Standard: ${company}\nProctoring Anomalies Detected: ${anomalies}\nSession Seed: ${Date.now()}\n\nInterview Transcript:\n${formattedHistory}

Evaluate the complete candidate interview packet. Pay attention to the [Round: ...] tags and evaluate per-round performance.
Return JSON:
{
  "overallScore": 82,
  "verdict": "Strong Hire / Hire / Lean Hire / Needs Preparation",
  "strengths": ["3-4 clear bullet points of what the candidate did exceptionally well (Goods)"],
  "improvements": ["3-4 clear bullet points of technical flaws, missing concepts, or weaknesses (Bads)"],
  "guidance": "Actionable, empathetic 2-3 sentence strategic advice on how the candidate can crack top companies",
  "proctoringNote": "Professional observation on proctoring integrity and trust score based on ${anomalies} anomalies",
  "roundScores": [
    { "round": "Round Name", "score": 78, "remark": "Brief evaluation of this round" }
  ],
  "questionFeedback": [
    {
      "qIndex": 1,
      "score": 85,
      "feedback": "Constructive feedback on their answer",
      "polishedAnswer": "Ideal response expected by interviewers"
    }
  ],
  "remedialPlan": [
    { "day": 1, "focus": "Specific weak topic to study", "task": "Concrete action item (e.g., Solve 5 LeetCode problems on Binary Trees)" },
    { "day": 2, "focus": "Another weak topic", "task": "Concrete action item" },
    { "day": 3, "focus": "Topic", "task": "Task" },
    { "day": 4, "focus": "Topic", "task": "Task" },
    { "day": 5, "focus": "Topic", "task": "Task" },
    { "day": 6, "focus": "Topic", "task": "Task" },
    { "day": 7, "focus": "Comprehensive revision & mock re-attempt", "task": "Task" }
  ]
}`,
    'You are a Chief Technology Officer and Hiring Committee Lead evaluating a candidate. Be rigorous, constructive, and highly detailed. Generate a personalized 7-day remedial study plan based on the specific weak areas you identified. Output only valid JSON.',
    true,
    3,
    true
  );
};
