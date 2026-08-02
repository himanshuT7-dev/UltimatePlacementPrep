/* ═══════════════════════════════════════════════════════════
   Fluent Neural Speech Engine — Natural Text-to-Speech Utility
   ═══════════════════════════════════════════════════════════ */

let cachedVoices = [];

// Initialize voices as soon as browser is ready
if (typeof window !== 'undefined' && window.speechSynthesis) {
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      cachedVoices = voices;
    }
  };
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

/**
 * Strips markdown, code blocks, URLs, and formatting symbols
 * to produce fluent, natural spoken prose.
 */
export const cleanTextForSpeech = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/```[\s\S]*?```/g, 'code block')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_~#>•-]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Returns the highest quality Natural/Neural voice for a target language and gender.
 */
export const getFluentVoice = (nativeLang = 'Hinglish', voiceGender = 'Female') => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const isMale = String(voiceGender).toLowerCase() === 'male';
  const femaleKeywords = ['female', 'woman', 'samantha', 'lekha', 'veena', 'zira', 'victoria', 'karen', 'moira', 'tessa', 'fiona', 'kate', 'serena', 'sara', 'amy', 'jenny', 'aria', 'natasha', 'neerja', 'swara'];
  const maleKeywords = ['male', 'man', 'rishi', 'alex', 'daniel', 'oliver', 'arthur', 'george', 'fred', 'david', 'mark', 'guy', 'prabhat'];

  // Filter by gender preference
  const filterByGender = (list) => {
    if (isMale) {
      const explicitMale = list.filter(v => maleKeywords.some(k => v.name.toLowerCase().includes(k)));
      if (explicitMale.length > 0) return explicitMale;
      const nonFemale = list.filter(v => !femaleKeywords.some(k => v.name.toLowerCase().includes(k)));
      return nonFemale.length > 0 ? nonFemale : list;
    } else {
      const explicitFemale = list.filter(v => femaleKeywords.some(k => v.name.toLowerCase().includes(k)));
      if (explicitFemale.length > 0) return explicitFemale;
      const nonMale = list.filter(v => !maleKeywords.some(k => v.name.toLowerCase().includes(k)));
      return nonMale.length > 0 ? nonMale : list;
    }
  };

  // Helper to find neural/natural/google quality voice
  const findQualityVoice = (candidates) => {
    const gendered = filterByGender(candidates);
    return (
      gendered.find(v => v.name.includes('Natural') || v.name.includes('Neural')) ||
      gendered.find(v => v.name.includes('Google')) ||
      gendered.find(v => v.name.includes('Enhanced') || v.name.includes('Premium')) ||
      gendered[0]
    );
  };

  let langMatches = [];

  if (nativeLang === 'Hinglish') {
    // Hinglish text is written in Latin alphabet — en-IN (Indian English) or Google Neural English sounds best!
    langMatches = voices.filter(v => v.lang === 'en-IN' || v.lang.includes('en-IN') || v.name.includes('India'));
    if (langMatches.length === 0) {
      langMatches = voices.filter(v => v.lang.startsWith('en'));
    }
  } else if (nativeLang === 'Hindi') {
    langMatches = voices.filter(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.name.includes('Lekha') || v.name.includes('Rishi'));
  } else if (nativeLang === 'Tamil') {
    langMatches = voices.filter(v => v.lang.includes('ta'));
  } else if (nativeLang === 'Telugu') {
    langMatches = voices.filter(v => v.lang.includes('te'));
  } else if (nativeLang === 'Kannada') {
    langMatches = voices.filter(v => v.lang.includes('kn'));
  } else if (nativeLang === 'Marathi') {
    langMatches = voices.filter(v => v.lang.includes('mr'));
  } else if (nativeLang === 'Bengali') {
    langMatches = voices.filter(v => v.lang.includes('bn'));
  } else if (nativeLang === 'Gujarati') {
    langMatches = voices.filter(v => v.lang.includes('gu'));
  }

  if (langMatches.length > 0) {
    const best = findQualityVoice(langMatches);
    if (best) return best;
  }

  // Fallback to top-tier English natural voice
  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  return findQualityVoice(englishVoices.length > 0 ? englishVoices : voices);
};

let currentAudio = null;

/**
 * Speaks text using Google Gemini / Neural AI Voice with Web Speech fallback.
 */
export const speakText = (text, { nativeLang = 'Hinglish', voiceGender = 'Female', rate = 0.95, onEnd, onError } = {}) => {
  if (typeof window === 'undefined' || !text) return;

  stopSpeech();
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return;

  // For shorter prompts (<= 180 chars), stream Google Neural AI Voice MP3
  if (cleaned.length <= 180) {
    try {
      const ttsUrl = `/api/tts?text=${encodeURIComponent(cleaned)}&lang=${encodeURIComponent(nativeLang)}`;
      const audio = new Audio(ttsUrl);
      currentAudio = audio;

      audio.onended = () => {
        currentAudio = null;
        onEnd?.();
      };

      audio.onerror = () => {
        currentAudio = null;
        fallbackWebSpeech(cleaned, { nativeLang, voiceGender, rate, onEnd, onError });
      };

      audio.play().catch(() => {
        currentAudio = null;
        fallbackWebSpeech(cleaned, { nativeLang, voiceGender, rate, onEnd, onError });
      });
      return;
    } catch (err) {
      // Fallback below
    }
  }

  // For longer explanations (> 180 chars), use fluent Web Speech engine for uninterrupted full reading
  fallbackWebSpeech(cleaned, { nativeLang, voiceGender, rate, onEnd, onError });
};

const fallbackWebSpeech = (cleaned, { nativeLang, voiceGender, rate, onEnd, onError }) => {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleaned);
  const voice = getFluentVoice(nativeLang, voiceGender);
  if (voice) {
    utterance.voice = voice;
  }

  const isFemale = String(voiceGender).toLowerCase() === 'female';
  utterance.rate = rate;
  utterance.pitch = isFemale ? 1.22 : 0.88;
  utterance.volume = 1.0;

  utterance.onend = () => onEnd?.();
  utterance.onerror = (e) => {
    console.warn('[SpeechEngine] Error during Web Speech synthesis:', e);
    onError?.(e);
  };

  window.speechSynthesis.speak(utterance);
};

/**
 * Cancels active speech synthesis and pauses neural audio stream.
 */
export const stopSpeech = () => {
  if (typeof window !== 'undefined') {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
};
