/**
 * LangGraph-Style AI Agent Pipeline
 * 
 * Implements a directed graph of specialized AI nodes:
 * 
 *  [UserInput] ──► [RouterNode]
 *                     ├──► [DiagnosticNode]    (wrong answer analysis)
 *                     ├──► [DeepDiveNode]      (concept explanation)
 *                     ├──► [QuizGenNode]       (non-repetitive quiz)
 *                     ├──► [InterviewNode]     (voice eval)
 *                     └──► [TranslationNode]  (native language)
 *
 * Each node: { systemPrompt, buildPrompt(state), parseOutput(raw) }
 */

const CACHE_PFX = 'upp_ai_cache_v2_';
let lastCallMs  = 0;
const RATE_MS   = 4500;

/* ── Core Gemini call ──────────────────────────────────── */
const callGemini = async ({ prompt, system = '', json = true, maxTokens = 1500 }) => {
  const cacheKey = CACHE_PFX + btoa(unescape(encodeURIComponent(prompt + system))).slice(0, 60);
  try {
    const c = localStorage.getItem(cacheKey);
    if (c) return JSON.parse(c);
  } catch {}

  const wait = RATE_MS - (Date.now() - lastCallMs);
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastCallMs = Date.now();

  try {
    const r = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, system, json, model: 'gemini-1.5-pro' })
    });

    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e.error || `Server error ${r.status}`);
    }

    const data = await r.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    let parsed = text;
    if (json) {
      try { parsed = JSON.parse(text.replace(/```json|```/g, '').trim()); } catch (e) {
        throw new Error('Failed to parse AI response as JSON.');
      }
    }

    try { localStorage.setItem(cacheKey, JSON.stringify(parsed)); } catch {}
    return parsed;
  } catch (error) {
    console.error('Gemini call failed:', error);
    throw error;
  }
};

/* ══════════════════════════════════════════════════════════
   GRAPH NODES
══════════════════════════════════════════════════════════ */

/* Node 1: Diagnostic — Why was the answer wrong? */
export const DiagnosticNode = {
  name: 'DiagnosticNode',
  system: `You are an empathetic, expert placement mentor. Never shame the student.
Diagnose their exact misconception and explain the correct answer with deep clarity.
Always output valid JSON only.`,

  run: (track, topic, question, chosen, correct, nativeLang) =>
    callGemini({
      system: DiagnosticNode.system,
      prompt: `Track: ${track}
Topic: ${topic}
Question: "${question}"
Student chose: "${chosen}"
Correct answer: "${correct}"
Student's native language preference: ${nativeLang}

Return JSON:
{
  "encouragement": "Warm 1–2 sentence opener that validates effort without praising wrong answer",
  "flaw": "The exact logical flaw or misconception in the student's chosen answer (2–3 sentences)",
  "misconception_root": "The fundamental concept they are misunderstanding (1 sentence)",
  "correct_explanation": "Full step-by-step explanation of why the correct answer is right (4–6 sentences with technical depth)",
  "analogy": "A simple real-life analogy explaining the correct concept",
  "native": "Complete explanation of the correct answer in simple ${nativeLang} (3–4 sentences with everyday analogies)",
  "nativeAudio": "The native language explanation optimised for TTS readout",
  "interview_tip": "One golden rule to remember this concept in future interviews",
  "related_topics": ["Topic 1 to review", "Topic 2 to review"]
}`,
    }),
};

/* Node 2: DeepDive — Thorough concept explanation */
export const DeepDiveNode = {
  name: 'DeepDiveNode',
  system: `You are a world-class technical educator specialising in software engineering placements.
Explain concepts with depth, precision, and relatable analogies. Output valid JSON only.`,

  run: (track, topic, mode, nativeLang) =>
    callGemini({
      system: DeepDiveNode.system,
      maxTokens: 2000,
      prompt: `Track: ${track}
Topic: "${topic}"
Mode: ${mode === 'ELI5' ? 'Explain Like I am 5 — use simple analogies, no jargon' : mode === 'technical' ? 'Advanced technical depth — precise, production-level' : 'Balanced — clear and technical'}
Native Language: ${nativeLang}

Return JSON:
{
  "title": "Descriptive heading for this deep dive",
  "overview": "2-sentence big picture summary",
  "sections": [
    { "heading": "Section heading", "body": "Detailed explanation paragraph" }
  ],
  "keyTakeaway": "Single golden interview rule to remember",
  "commonMistakes": ["Mistake 1 students often make", "Mistake 2"],
  "interviewQuestions": ["Question 1 frequently asked", "Question 2", "Question 3"],
  "native": "Complete explanation in ${nativeLang} with everyday analogies (4–5 sentences)"
}`,
    }),
};

/* Node 3: QuizGenNode — Non-repetitive adaptive quiz */
export const QuizGenNode = {
  name: 'QuizGenNode',
  system: `You are a rigorous technical interviewer creating placement-grade MCQs.
Questions must be distinct, test deep understanding (not just recall), and have plausible distractors.
Output valid JSON only.`,

  run: (track, topic, difficulty, askedBefore = []) =>
    callGemini({
      system: QuizGenNode.system,
      prompt: `Track: ${track}
Topic: "${topic}"
Difficulty: ${difficulty} (beginner | intermediate | advanced)
Already asked (avoid these): ${askedBefore.length ? askedBefore.map((q, i) => `${i + 1}. ${q}`).join('\n') : 'None yet'}

Generate a NEW, DIFFERENT multiple-choice question. Return JSON:
{
  "question": "Full question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Thorough explanation of why the correct answer is right and others are wrong (4-6 sentences)",
  "difficulty": "beginner|intermediate|advanced",
  "conceptTested": "The specific sub-concept this question tests"
}`,
    }),
};

/* Node 4: InterviewNode — Voice answer evaluation */
export const InterviewNode = {
  name: 'InterviewNode',
  system: `You are an experienced technical interviewer at a top software company.
Evaluate spoken answers for technical accuracy, English fluency, and communication quality.
Be constructive, specific, and encouraging. Output valid JSON only.`,

  run: (question, spokenAnswer, stack) =>
    callGemini({
      system: InterviewNode.system,
      maxTokens: 1800,
      prompt: `Interview Question: "${question}"
Candidate's spoken answer: "${spokenAnswer}"
Tech Stack context: ${stack}

Evaluate and return JSON:
{
  "technicalScore": 82,
  "fluencyScore": 76,
  "confidenceScore": 70,
  "overallScore": 76,
  "technicalFeedback": "Detailed technical accuracy feedback (4-5 sentences)",
  "fluencyFeedback": "English fluency and communication quality feedback",
  "grammarCorrections": ["Specific grammar issue 1 with correction", "Issue 2"],
  "fillerWords": ["um", "basically", "like"],
  "fillerCount": 3,
  "missingPoints": ["Key concept not mentioned 1", "Key concept 2"],
  "polishedAnswer": "A polished, interview-ready version of their answer (3-4 sentences)",
  "encouragement": "Specific, warm motivational closing note",
  "nextToImprove": "One concrete thing to work on before the real interview"
}`,
    }),
};

/* Node 5: TranslationNode — Native language concept bridge */
export const TranslationNode = {
  name: 'TranslationNode',
  system: `You are a bilingual technical educator who helps Indian students understand 
complex programming concepts through their native language with everyday analogies.`,

  run: (concept, explanation, nativeLang) =>
    callGemini({
      system: TranslationNode.system,
      json: false,
      maxTokens: 600,
      prompt: `Concept: "${concept}"
Technical explanation: "${explanation}"
Target language: ${nativeLang}

Explain this concept in ${nativeLang} using everyday Indian analogies that any student would relate to.
Keep it conversational, warm, and approximately 3-4 sentences. Do not translate word-for-word — use analogies.`,
    }),
};

