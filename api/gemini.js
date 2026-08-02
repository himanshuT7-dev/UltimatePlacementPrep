import { applyCors, rateLimit, getClientIp } from './lib/security.js';

// Global in-memory metrics (persists across warm invocations on Vercel)
const metrics = globalThis.__uppMetrics || (globalThis.__uppMetrics = {
  startedAt: Date.now(),
  providers: {
    'Gemini 3.5-flash': { calls: 0, errors: 0, lastUsed: null },
    'Groq Llama-3.3-70b': { calls: 0, errors: 0, lastUsed: null },
    'Gemini flash-latest': { calls: 0, errors: 0, lastUsed: null },
    'Groq Llama-3.1-8b': { calls: 0, errors: 0, lastUsed: null }
  },
  totalCalls: 0,
  totalErrors: 0,
  failovers: 0
});

export { metrics };

export default async function handler(req, res) {
  // CORS
  if (!applyCors(req, res)) return res.status(403).json({ error: 'Forbidden' });

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { prompt, system, json = false } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid prompt provided' });
  }

  // Cap prompt length to limit abuse
  if (prompt.length > 8000) {
    return res.status(400).json({ error: 'Prompt is too long (max 8000 characters)' });
  }

  // Validate system prompt if present
  if (system !== undefined && typeof system !== 'string') {
    return res.status(400).json({ error: 'Invalid system prompt provided' });
  }

  // Coerce json flag to a strict boolean
  const jsonMode = !!json;

  // Rate limiting
  if (!rateLimit('gemini:' + getClientIp(req), 30, 60000).allowed) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  /* ═══════════════════════════════════════════════════════════
     Multi-Provider Failover Chain
     Tries providers in order. If one fails (rate limit, quota,
     or error), automatically falls through to the next.
     ═══════════════════════════════════════════════════════════ */

  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  const providers = [];

  // Provider 1: Gemini 3.5-flash (newest, separate quota)
  if (geminiKey) {
    providers.push({
      name: 'Gemini 3.5-flash',
      call: () => callGemini(geminiKey, 'gemini-3.5-flash', prompt, system, jsonMode)
    });
  }

  // Provider 2: Groq Llama 3.3 70B (14,400 RPD free tier)
  if (groqKey) {
    providers.push({
      name: 'Groq Llama-3.3-70b',
      call: () => callGroq(groqKey, 'llama-3.3-70b-versatile', prompt, system, jsonMode)
    });
  }

  // Provider 3: Gemini flash-latest (alias, separate quota pool)
  if (geminiKey) {
    providers.push({
      name: 'Gemini flash-latest',
      call: () => callGemini(geminiKey, 'gemini-flash-latest', prompt, system, jsonMode)
    });
  }

  // Provider 4: Groq Llama 3.1 8B (fastest, 14,400 RPD)
  if (groqKey) {
    providers.push({
      name: 'Groq Llama-3.1-8b',
      call: () => callGroq(groqKey, 'llama-3.1-8b-instant', prompt, system, jsonMode)
    });
  }

  if (providers.length === 0) {
    return res.status(500).json({ error: 'Server configuration error: No API keys configured (GEMINI_API_KEY or GROQ_API_KEY)' });
  }

  // Try each provider in sequence
  const errors = [];
  for (const provider of providers) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[AI Proxy] Trying ${provider.name}...`);
      }
      const data = await provider.call();
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[AI Proxy] ✓ ${provider.name} succeeded`);
      }
      if (metrics.providers[provider.name]) {
        metrics.providers[provider.name].calls++;
        metrics.providers[provider.name].lastUsed = new Date().toISOString();
      }
      metrics.totalCalls++;
      return res.status(200).json(data);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[AI Proxy] ✗ ${provider.name} failed: ${err.message}`);
      }
      if (metrics.providers[provider.name]) {
        metrics.providers[provider.name].errors++;
      }
      metrics.totalErrors++;
      metrics.failovers++;
      errors.push(`${provider.name}: ${err.message}`);
      // Continue to next provider
    }
  }

  // All providers exhausted
  if (process.env.NODE_ENV !== 'production') {
    console.error('[AI Proxy] All providers exhausted:', errors);
  }
  return res.status(503).json({
    error: 'All AI providers are temporarily exhausted. Please wait a minute and try again.',
    details: errors
  });
}

/* ─── Gemini API Call ─────────────────────────────────────── */
async function callGemini(apiKey, model, prompt, system, json) {
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.45,
      maxOutputTokens: 4096,
      ...(json ? { responseMimeType: 'application/json' } : {})
    },
    ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {})
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error(e.error?.message || `Gemini ${model} error ${r.status}`);
  }

  return await r.json();
}

/* ─── Groq API Call ───────────────────────────────────────── */
async function callGroq(apiKey, model, prompt, system, json) {
  const messages = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push({ role: 'user', content: prompt });

  const body = {
    model,
    messages,
    temperature: 0.45,
    max_tokens: 4096,
    ...(json ? { response_format: { type: 'json_object' } } : {})
  };

  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error(e.error?.message || `Groq ${model} error ${r.status}`);
  }

  const data = await r.json();

  // Normalize Groq's OpenAI-format response to match Gemini's format
  // so the frontend doesn't need to change
  const text = data.choices?.[0]?.message?.content || '';
  return {
    candidates: [{
      content: {
        parts: [{ text }]
      }
    }]
  };
}
