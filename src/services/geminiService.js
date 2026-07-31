/* Gemini Pro API Service — Direct, throttled, cached */

const KEY_STORE  = 'upp_founder_key_v1';
const CACHE_PFX  = 'upp_gemini_cache_v1_';
const MIN_GAP_MS = 4000;
let lastCall     = 0;

export const getFounderKey  = ()  => localStorage.getItem(KEY_STORE) || import.meta.env.VITE_GEMINI_API_KEY || '';
export const setFounderKey  = (k) => k ? localStorage.setItem(KEY_STORE, k.trim()) : localStorage.removeItem(KEY_STORE);

export const testConnection = async (key) => {
  const k = key || getFounderKey();
  if (!k) return { ok: false, msg: 'No API key provided.' };
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${k}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'ping' }] }], generationConfig: { maxOutputTokens: 5 } }) }
    );
    if (!r.ok) { const e = await r.json(); return { ok: false, msg: e.error?.message || 'API error' }; }
    return { ok: true, msg: '✓ Connected to Gemini Pro successfully!' };
  } catch (e) { return { ok: false, msg: e.message }; }
};

const call = async (prompt, system = '', json = false) => {
  const key = getFounderKey();
  if (!key) throw new Error('Founder API key not configured. Open Founder Settings in the header.');

  const ck = CACHE_PFX + btoa(unescape(encodeURIComponent(prompt + system))).slice(0, 48);
  const cached = localStorage.getItem(ck);
  if (cached) { try { return JSON.parse(cached); } catch {} }

  const wait = MIN_GAP_MS - (Date.now() - lastCall);
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastCall = Date.now();

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.45, maxOutputTokens: 1400, ...(json ? { responseMimeType: 'application/json' } : {}) },
    ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {})
  };

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${key}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );

  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error?.message || `Gemini error ${r.status}`); }
  const data = await r.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  let out = text;
  if (json) { try { out = JSON.parse(text.replace(/```json|```/g, '').trim()); } catch {} }

  try { localStorage.setItem(ck, JSON.stringify(out)); } catch {}
  return out;
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
