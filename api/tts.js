import { applyCors, rateLimit, getClientIp } from './lib/security.js';

// Map app native language setting to Google Neural Voice locale
const langMap = {
  'Hinglish': 'en-IN',
  'English': 'en-US',
  'Hindi': 'hi',
  'Tamil': 'ta',
  'Telugu': 'te',
  'Kannada': 'kn',
  'Marathi': 'mr',
  'Bengali': 'bn',
  'Gujarati': 'gu'
};

export default async function handler(req, res) {
  // CORS
  if (!applyCors(req, res)) return res.status(403).json({ error: 'Forbidden' });

  if (req.method === 'OPTIONS') return res.status(200).end();

  const text = req.query?.text || req.body?.text;
  const lang = req.query?.lang || req.body?.lang || 'Hinglish';

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text prompt is required' });
  }

  // Validate language against the known locale map
  if (typeof lang !== 'string' || !Object.prototype.hasOwnProperty.call(langMap, lang)) {
    return res.status(400).json({ error: 'Invalid language' });
  }

  // Rate limiting
  if (!rateLimit('tts:' + getClientIp(req), 40, 60000).allowed) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  // Clean text: strip markdown syntax, code fences, asterisks, URLs, em-dashes, and special quotes
  let cleanedText = text
    .replace(/```[\s\S]*?```/g, 'code block')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[—–]/g, ', ')
    .replace(/[""]/g, '"')
    .replace(/[*_~#>•-]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Google Translate TTS enforces a strict 160-character limit per request
  if (cleanedText.length > 160) {
    // Find the last period or comma before 160 chars for natural sentence break
    const sub = cleanedText.slice(0, 160);
    const lastPunct = Math.max(sub.lastIndexOf('.'), sub.lastIndexOf(','), sub.lastIndexOf('!'));
    cleanedText = lastPunct > 40 ? sub.slice(0, lastPunct + 1) : sub;
  }

  const targetLang = langMap[lang];

  try {
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${targetLang}&q=${encodeURIComponent(cleanedText)}`;

    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(400).json({ error: `TTS service unavailable (${response.status})`, fallback: true });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).send(buffer);

  } catch (err) {
    console.warn('[AI Voice Proxy] Error fetching neural audio:', err.message);
    return res.status(400).json({ error: err.message, fallback: true });
  }
}
