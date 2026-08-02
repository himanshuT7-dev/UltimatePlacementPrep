import React, { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, RefreshCw, ChevronRight, ArrowRight, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { InterviewNode } from '../agents/pipeline';

const QUESTIONS = [
  /* HR / Behavioural */
  'Tell me about yourself in 60 seconds. Focus on your technical journey.',
  'Describe the most technically challenging project you built. What was the core problem and how did you solve it?',
  'Tell me about a time you disagreed with a team member. How did you resolve it constructively?',
  'What is your greatest technical weakness and what are you actively doing to improve it?',
  'Why do you want to join a software company? What excites you most about software engineering?',
  'Describe a situation where you had to learn a new technology very quickly under deadline pressure.',
  'Where do you see yourself in 3 years as a software engineer?',
  'Tell me about a bug that took you a long time to fix. What was your debugging process?',

  /* Java */
  'What is the difference between HashMap and ConcurrentHashMap in Java? When would you use each?',
  'Explain the concept of Dependency Injection and why it matters for testability.',
  'What is the difference between abstract classes and interfaces in Java 8+?',
  'Explain how the Java Garbage Collector works. What are the different GC algorithms?',

  /* JavaScript / React */
  'How does the JavaScript Event Loop work? Walk me through micro-tasks vs macro-tasks.',
  'What is the difference between useState and useReducer in React? When do you prefer useReducer?',
  'Explain React\'s reconciliation algorithm and how the Virtual DOM works.',
  'What are closures in JavaScript? Give a practical use case in React.',

  /* SQL / Databases */
  'What is the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN? Give examples.',
  'What are database indexes? How do they speed up queries and what are the trade-offs?',
  'What is the N+1 query problem and how do you solve it in an ORM?',
  'Explain ACID properties of database transactions with a real-world example.',
];

/* ScoreRing lives at module scope so it is a stable component type —
   defining it inside the render caused 4 SVGs to remount on every keystroke. */
const ScoreRing = ({ value, color, label }) => {
  const r = 30, circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" role="img" aria-label={`${label} score: ${value}%`}>
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="6"/>
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 40 40)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}/>
        <text x="40" y="44" textAnchor="middle" fill={color} fontSize="14" fontWeight="800">{value}%</text>
      </svg>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
    </div>
  );
};

export default function VoiceAgent() {
  const [qIdx,       setQIdx]       = useState(0);
  const [recording,  setRecording]  = useState(false);
  const [transcript, setTranscript] = useState('');
  const [eval_,      setEval]       = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [rec,        setRec]        = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const question = QUESTIONS[qIdx];

  const nextQ = () => {
    stopAudio();
    setQIdx(i => (i + 1) % QUESTIONS.length);
    setTranscript(''); setEval(null); setError('');
  };

  const prevQ = () => {
    stopAudio();
    setQIdx(i => (i - 1 + QUESTIONS.length) % QUESTIONS.length);
    setTranscript(''); setEval(null); setError('');
  };

  const toggleAudio = () => {
    if (isSpeaking) {
      stopAudio();
    } else {
      stopAudio();
      const u = new SpeechSynthesisUtterance(question);
      u.rate = 0.88;
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis?.speak(u);
    }
  };

  const stopAudio = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const toggleRec = () => {
    if (recording) {
      rec?.stop(); setRecording(false); return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError('Speech Recognition not supported in this browser. Please type your answer below.'); return; }
    const r = new SR();
    r.continuous = true; r.interimResults = true; r.lang = 'en-US';
    r.onresult = e => {
      let t = '';
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript + ' ';
      setTranscript(t);
    };
    r.onerror = e => { setError('Microphone error: ' + e.error); setRecording(false); };
    r.onend   = () => setRecording(false);
    r.start();
    setRec(r); setRecording(true); setTranscript(''); setEval(null); setError('');
  };

  const evaluate = async () => {
    if (!transcript.trim()) { setError('Please record or type a response first.'); return; }
    setLoading(true); setError('');
    try {
      const result = await InterviewNode.run(question, transcript.trim(), 'Software Engineering (Java/React/SQL/Communication)');
      setEval(result);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="glass voice-card">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--rose)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            AI Voice Mock Interviewer · Communication Coach
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {QUESTIONS.length} questions · Technical + HR · English fluency scoring · Filler word detection
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className={isSpeaking ? "btn btn-rose" : "btn btn-ghost"} style={{ fontSize: '0.78rem', padding: '7px 14px' }} onClick={toggleAudio}>
            {isSpeaking ? <><VolumeX size={14} /> Stop Audio</> : <><Volume2 size={14} /> Hear Question</>}
          </button>
          <button className="btn btn-ghost" style={{ fontSize: '0.78rem', padding: '7px 14px' }} onClick={prevQ}>
            ← Prev
          </button>
          <button className="btn btn-ghost" style={{ fontSize: '0.78rem', padding: '7px 14px' }} onClick={nextQ}>
            <RefreshCw size={14} /> Next
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="voice-question-box">
        <div className="voice-q-label">
          <span>Question {qIdx + 1} of {QUESTIONS.length}</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            · {qIdx < 8 ? 'HR / Behavioural' : qIdx < 12 ? 'Java' : qIdx < 16 ? 'JavaScript & React' : 'SQL & Databases'}
          </span>
        </div>
        <div className="voice-q-text">{question}</div>
      </div>

      {/* Recording Controls */}
      <div className="voice-controls">
        <button className={`btn-rose ${recording ? 'recording' : ''}`} onClick={toggleRec}>
          {recording ? <MicOff size={20} /> : <Mic size={20} />}
          {recording ? 'Stop Recording' : 'Press & Speak Your Answer'}
        </button>
        {recording && (
          <div className="visualizer">
            {[...Array(9)].map((_, i) => <div key={i} className="v-bar" />)}
          </div>
        )}
        <div style={{ width: '100%' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
            Your spoken transcript (or type your answer here):
          </label>
          <textarea
            className="glass-input"
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            placeholder="Start speaking above, or type your answer here to get AI feedback…"
            style={{ minHeight: 100 }}
          />
        </div>
        <button
          className="btn btn-emerald"
          onClick={evaluate}
          disabled={loading || !transcript.trim()}
          style={{ alignSelf: 'flex-end' }}
        >
          <Sparkles size={15} />
          {loading ? 'Evaluating via Gemini Pro…' : 'Evaluate My Answer'}
        </button>
      </div>

      {error && (
        <div className="diag-section flaw" style={{ marginBottom: 16 }}>
          <p>{error}</p>
        </div>
      )}

      {/* Evaluation Results */}
      {eval_ && (
        <div className="anim-fade" style={{ marginTop: 24 }}>
          {/* Score Rings */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 24, flexWrap: 'wrap' }}>
            <ScoreRing value={eval_.technicalScore  || 0} color="var(--emerald)" label="Technical" />
            <ScoreRing value={eval_.fluencyScore    || 0} color="#38bdf8" label="Fluency" />
            <ScoreRing value={eval_.confidenceScore || 0} color="#a78bfa" label="Confidence" />
            <ScoreRing value={eval_.overallScore    || 0} color="var(--amber)" label="Overall" />
          </div>

          {/* Technical Feedback */}
          <div className="eval-field">
            <div className="eval-field-title" style={{ color: 'var(--emerald)' }}>Technical Accuracy</div>
            <p>{eval_.technicalFeedback}</p>
            {eval_.missingPoints?.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--rose)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Key Points You Missed</p>
                {eval_.missingPoints.map((pt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: '0.83rem', color: '#fda4af' }}>
                    <ArrowRight size={12} /><span>{pt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fluency + Grammar */}
          <div className="eval-field">
            <div className="eval-field-title" style={{ color: '#38bdf8' }}>English Fluency & Communication</div>
            <p>{eval_.fluencyFeedback}</p>
            {eval_.grammarCorrections?.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--amber)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Grammar Corrections</p>
                {eval_.grammarCorrections.map((g, i) => (
                  <p key={i} style={{ fontSize: '0.82rem', color: '#fde68a', marginBottom: 4 }}>• {g}</p>
                ))}
              </div>
            )}
            {eval_.fillerWords?.length > 0 && (
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Filler words ({eval_.fillerCount || eval_.fillerWords.length}×):
                </span>
                {eval_.fillerWords.map(f => (
                  <span key={f} className="badge badge-rose" style={{ fontSize: '0.68rem' }}>{f}</span>
                ))}
              </div>
            )}
          </div>

          {/* Polished Answer */}
          <div className="eval-field">
            <div className="eval-field-title" style={{ color: '#a78bfa', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={13} /> Ideal Interview-Ready Answer
            </div>
            <p style={{ fontStyle: 'italic', color: '#c4b5fd', lineHeight: 1.75 }}>"{eval_.polishedAnswer}"</p>
          </div>

          {/* Next to improve */}
          {eval_.nextToImprove && (
            <div style={{ padding: '12px 16px', background: 'rgba(245,158,11,0.08)', borderRadius: 'var(--r-lg)', border: '1px solid rgba(245,158,11,0.2)', marginTop: 8, fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--amber)', fontWeight: 700 }}>Focus for next time: </span>
              <span style={{ color: '#fde68a' }}>{eval_.nextToImprove}</span>
            </div>
          )}

          {/* Encouragement */}
          <div className="info-box success" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={16} /> {eval_.encouragement}
          </div>

          {/* Next Question CTA */}
          <button
            className="btn btn-ghost"
            style={{ marginTop: 16, width: '100%', padding: '12px', justifyContent: 'center', fontSize: '0.85rem' }}
            onClick={nextQ}
          >
            Next Question <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
