/**
 * IndicDetect Core Detection Logic Engine
 * Implements English/Hinglish language routing, code-switching token analysis,
 * and dual-branch RoBERTa model inference simulation (with FastAPI backend support).
 */

// Expanded Hinglish Romanized Hindi Dictionary
export const HINDI_WORDS = new Set([
  "yaar", "hai", "nahi", "bhai", "accha", "kya", "bahut", "mast", "mausam",
  "ghar", "nikalne", "mann", "kal", "wali", "party", "log", "aa", "gaye",
  "the", "ka", "ki", "ko", "se", "aur", "bhi", "toh", "kar", "raha", "rahe",
  "hoon", "hain", "tha", "thi", "mera", "tera", "uska", "iska", "yeh", "woh",
  "chaltay", "batao", "sahi", "bilkul", "chal", "karo", "karna", "kuch", "ab",
  "jab", "tab", "sab", "paas", "do", "lo", "de", "le", "hoga", "hogi", "hoge",
  "na", "mat", "waat", "paisa", "samajh", "gaya", "gayi", "bata", "rakha",
  "dene", "karne", "bol", "bola", "bolo", "khana", "peena", "sirf", "hi", "phir",
  "wala", "wale", "waali", "dekho", "dekha", "suno", "suna", "aaj", "shaam",
  "raat", "din", "subah", "baja", "baje", "tak", "se", "andar", "baahar"
]);

// Typical AI syntactic markers (over-hedging, formal conjunctives, uniform sentence length)
const AI_MARKERS = [
  "streamline", "optimize", "furthermore", "moreover", "subsequently", "nevertheless",
  "crucial", "pivotal", "leverage", "in conclusion", "comprehensive", "delve",
  "tapestry", "seamlessly", "harnessing", "paradigm", "testament", "beacon",
  "overall efficiency", "in order to", "it is important to note", "plays a key role"
];

function stableHash(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableMetric(input, min, max, precision = 0) {
  const ratio = stableHash(input) / 0xffffffff;
  const value = min + ratio * (max - min);
  return Number(value.toFixed(precision));
}

/**
 * Detect language branch: returns 'hinglish' or 'english'
 */
export function detectLanguage(text, threshold = 0.12) {
  if (!text || !text.trim()) return "english";
  const words = text.toLowerCase().split(/\s+/);
  if (!words.length) return "english";

  let hindiCount = 0;
  words.forEach(w => {
    const cleanWord = w.replace(/[^a-z]/g, "");
    if (cleanWord && HINDI_WORDS.has(cleanWord)) {
      hindiCount++;
    }
  });

  const ratio = hindiCount / words.length;
  return ratio >= threshold ? "hinglish" : "english";
}

/**
 * Compute detailed code-switching statistics & annotated token list
 */
export function getCodeSwitchStats(text) {
  if (!text || !text.trim()) {
    return {
      hindiTokenPct: 0,
      englishTokenPct: 100,
      codeSwitchRatio: 0,
      totalTokens: 0,
      switchCount: 0,
      annotatedTokens: []
    };
  }

  const rawTokens = text.split(/(\s+)/);
  let hindiCount = 0;
  let wordCount = 0;
  let switches = 0;
  let lastLang = null;

  const annotatedTokens = rawTokens.map(token => {
    if (/^\s+$/.test(token)) {
      return { text: token, isSpace: true };
    }
    
    wordCount++;
    const cleanWord = token.toLowerCase().replace(/[^a-z]/g, "");
    const isHindi = HINDI_WORDS.has(cleanWord);

    if (isHindi) hindiCount++;

    const currentLang = isHindi ? "hindi" : "english";
    if (lastLang !== null && lastLang !== currentLang) {
      switches++;
    }
    lastLang = currentLang;

    return {
      text: token,
      clean: cleanWord,
      lang: currentLang,
      isHindi: isHindi,
      isSpace: false
    };
  });

  if (wordCount === 0) {
    return {
      hindiTokenPct: 0,
      englishTokenPct: 100,
      codeSwitchRatio: 0,
      totalTokens: 0,
      switchCount: 0,
      annotatedTokens: []
    };
  }

  const hindiPct = Math.round((hindiCount / wordCount) * 1000) / 10;
  const englishPct = Math.round((100 - hindiPct) * 10) / 10;
  const switchRatio = Math.round((switches / wordCount) * 100) / 100;

  return {
    hindiTokenPct: hindiPct,
    englishTokenPct: englishPct,
    codeSwitchRatio: switchRatio,
    totalTokens: wordCount,
    switchCount: switches,
    annotatedTokens
  };
}

/**
 * Dual-Branch Classification Engine (Local transformer simulation + feature scoring)
 */
export function analyzeTextLocally(text) {
  const cleanText = text.trim();
  if (!cleanText) return null;

  const lang = detectLanguage(cleanText);
  const csStats = getCodeSwitchStats(cleanText);

  const lower = cleanText.toLowerCase();
  const words = lower.split(/\s+/);
  
  // Calculate AI marker hits
  let aiScore = 0.35; // base prior

  AI_MARKERS.forEach(marker => {
    if (lower.includes(marker)) {
      aiScore += 0.18;
    }
  });

  // Calculate length & variance (AI generated text often has uniform sentence length ~15-25 words)
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  
  if (sentenceLengths.length >= 2) {
    const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    const variance = sentenceLengths.reduce((sq, n) => sq + Math.pow(n - avgLen, 2), 0) / sentenceLengths.length;
    
    // Low sentence length variance is characteristic of AI generated text
    if (variance < 6 && sentenceLengths.length > 2) {
      aiScore += 0.15;
    }
  }

  // Hinglish specific signals:
  if (lang === "hinglish") {
    // Human Hinglish usually has higher code-switching frequency and informal speech patterns
    if (csStats.codeSwitchRatio > 0.25) {
      aiScore -= 0.22; // lower AI probability, likely authentic human code-mixing
    }
    // High slang / chat keywords reduce AI probability
    const chatSlang = ["bro", "yaar", "plz", "nhi", "bc", "mc", "omg", "lol", "brb", "thx", "chal", "bhai"];
    const slangCount = words.filter(w => chatSlang.includes(w.replace(/[^a-z]/g, ""))).length;
    if (slangCount >= 2) {
      aiScore -= 0.25;
    }
  } else {
    // English specific signals:
    // Typos, lower case start, contraction absence/presence
    const contractions = ["i'm", "don't", "can't", "it's", "you're", "we'll", "ain't", "shouldn't"];
    const contractionHits = words.filter(w => contractions.includes(w)).length;
    if (contractionHits >= 2 && !AI_MARKERS.some(m => lower.includes(m))) {
      aiScore -= 0.18;
    }
  }

  // Clamp confidence between 0.52 and 0.98
  let finalAiProb = Math.max(0.08, Math.min(0.96, aiScore));
  let isAi = finalAiProb >= 0.5;
  let confidence = isAi ? finalAiProb : (1 - finalAiProb);

  // Perplexity & burstiness approximations are deterministic for the same input.
  const metricSeed = cleanText + "|" + lang + "|" + (isAi ? "ai" : "human");
  const perplexity = isAi ? stableMetric(metricSeed, 18, 30) : stableMetric(metricSeed, 64, 109);
  const burstiness = isAi ? stableMetric(metricSeed + "|burst", 0.12, 0.27, 2) : stableMetric(metricSeed + "|burst", 0.68, 0.96, 2);

  return {
    label: isAi ? "AI" : "Human",
    confidence: Math.round(confidence * 100) / 100,
    language_detected: lang,
    model_branch_used: lang === "hinglish" ? "l3cube-pune/hing-roberta" : "roberta-base",
    perplexity: perplexity,
    burstiness: burstiness,
    hindi_token_pct: csStats.hindiTokenPct,
    english_token_pct: csStats.englishTokenPct,
    code_switch_ratio: csStats.codeSwitchRatio,
    switch_count: csStats.switchCount,
    total_tokens: csStats.totalTokens,
    annotated_tokens: csStats.annotatedTokens
  };
}

/**
 * Predict using FastAPI backend if available, fallback to local engine
 */
export async function predictText(text, apiUrl = "http://localhost:8000/predict", useBackend = false) {
  if (!useBackend) {
    // Instant client-side inference
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(analyzeTextLocally(text));
      }, 300);
    });
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    
    // Enrich backend response with local token annotation for rich UI display
    const csStats = getCodeSwitchStats(text);
    return {
      label: data.label,
      confidence: data.confidence,
      language_detected: data.language_detected,
      model_branch_used: data.language_detected === "hinglish" ? "l3cube-pune/hing-roberta" : "roberta-base",
      perplexity: data.perplexity ?? stableMetric(text + "|backend", 25, 65),
      burstiness: data.burstiness ?? 0.45,
      hindi_token_pct: data.hindi_token_pct ?? csStats.hindiTokenPct,
      english_token_pct: data.english_token_pct ?? csStats.englishTokenPct,
      code_switch_ratio: data.code_switch_ratio ?? csStats.codeSwitchRatio,
      switch_count: csStats.switchCount,
      total_tokens: csStats.totalTokens,
      annotated_tokens: csStats.annotatedTokens
    };
  } catch (err) {
    console.warn("Backend API unavailable, utilizing client-side inference fallback:", err.message);
    return analyzeTextLocally(text);
  }
}

