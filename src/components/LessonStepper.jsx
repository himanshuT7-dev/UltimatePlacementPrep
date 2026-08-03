import React, { useState, useEffect, Suspense } from 'react';
import {
  Check, CheckCircle2, X as XIcon, Languages, Volume2, VolumeX, Bookmark, ArrowRight, ArrowLeft, Mic, HelpCircle, BookOpen
} from 'lucide-react';

const LANGS = ['English','Hinglish','Hindi','Tamil','Telugu','Kannada','Marathi','Bengali','Gujarati'];

// Replicate the stale-hash reload protection used by App.jsx so lazily loaded
// lesson components auto-reload once when a new build changes their asset hash.
function lazyWithRetry(componentImport) {
  return React.lazy(async () => {
    const pageHasAlreadyBeenReloaded = JSON.parse(
      sessionStorage.getItem('page_reloaded_for_new_build') || 'false'
    );
    try {
      const component = await componentImport();
      sessionStorage.setItem('page_reloaded_for_new_build', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenReloaded) {
        sessionStorage.setItem('page_reloaded_for_new_build', 'true');
        window.location.reload();
      }
      throw error;
    }
  });
}

const InteractiveVisualizer = lazyWithRetry(() => import('./visualizers/InteractiveVisualizer'));
const CodeDrawer = lazyWithRetry(() => import('./CodeDrawer'));
const SQLSandbox = lazyWithRetry(() => import('./SQLSandbox'));
const JSPlayground = lazyWithRetry(() => import('./JSPlayground'));
import TopicNotes from './TopicNotes';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/sounds';
import { useAuth } from '../context/AuthContext';
import { speakText, stopSpeech } from '../utils/speech';

const FormatText = ({ text }) => {
  if (!text) return null;
  
  // Auto-format giant blocks of text that lack newlines by breaking after sentences
  let formattedText = text;
  if (!formattedText.includes('\n')) {
    formattedText = formattedText.replace(/([.?!])\s+([A-Z])/g, '$1\n\n$2');
  }
  
  return formattedText.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} style={{ height: 12 }} />;
    
    let isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('—');
    let content = line.trim();
    if (isBullet) content = content.substring(1).trim();
    
    // Parse `code` and **bold**
    const parts = content.split(/(\`[^\`]+\`|\*\*[^\*]+\*\*)/g);
    
    // Bold the part before the first colon if it exists and is short enough to be a label
    const formatColons = (str) => {
      const colonIdx = str.indexOf(':');
      if (colonIdx > 0 && colonIdx < 60) { // arbitrary length limit for a label
        return (
          <>
            <strong style={{ color: 'var(--amber)', fontWeight: 700 }}>{str.slice(0, colonIdx + 1)}</strong>
            {str.slice(colonIdx + 1)}
          </>
        );
      }
      return str;
    };

    return (
      <div key={i} style={{ 
        marginBottom: isBullet ? '6px' : '14px', 
        lineHeight: 1.7, 
        color: 'var(--text-secondary)',
        display: isBullet ? 'flex' : 'block',
        alignItems: 'flex-start',
        marginLeft: isBullet ? (line.startsWith('  ') ? '32px' : '16px') : '0'
      }}>
        {isBullet && <span style={{ color: 'var(--amber)', marginRight: '10px', marginTop: '-1px' }}>•</span>}
        <div>
          {parts.map((part, j) => {
            if (part.startsWith('`') && part.endsWith('`')) {
              return (
                <code key={j} style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--sky)',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  fontFamily: 'var(--mono)',
                  fontSize: '0.85em',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {part.slice(1, -1)}
                </code>
              );
            }
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
            }
            return <span key={j}>{j === 0 ? formatColons(part) : part}</span>;
          })}
        </div>
      </div>
    );
  });
};

export default function LessonStepper({
  topic, activeTrack, isCompleted, markComplete, toggleBookmark, bookmarks, nativeLang: propNativeLang,
  scheduleReview, recordQuizResult,
  onNextTopic, onPrevTopic, hasNext, hasPrev, onAskWhyWrong
}) {
  const [activeStep, setActiveStep] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { user, progress, voiceGender, setVoiceGender, nativeLang, setNativeLang } = useAuth();
  const [chosen, setChosen] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setActiveStep(1);
    setIsSpeaking(false);
    setChosen(null);
    setSubmitted(false);
    stopSpeech();
  }, [topic?.id]);

  const toggleAudio = (text) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(text, {
        nativeLang,
        voiceGender,
        rate: 0.95,
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    }
  };

  const STEPS = ['Intuition', 'Visualize', 'Code', 'Quiz', 'Complete'];

  const quiz = topic?.quiz;
  const nativeText = (() => {
    if (nativeLang === 'English') {
      return topic?.native?.English || topic?.summary || '';
    }
    return topic?.native?.[nativeLang] ||
      topic?.native?.[nativeLang?.toLowerCase?.()] ||
      topic?.native?.Hindi ||
      topic?.native?.Hinglish ||
      (typeof topic?.native === 'string' ? topic.native : '');
  })();

  const submitQuiz = (idx) => {
    setChosen(idx);
    setSubmitted(true);
    const isCorrect = idx === quiz?.correct;
    if (recordQuizResult) recordQuizResult(topic.title, isCorrect);
    if (isCorrect) {
      playSound.success();
      markComplete(topic.id);
      if (scheduleReview) scheduleReview(topic.id, 5);
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.75 }, colors: ['#f59e0b', '#34d399', '#38bdf8', '#a78bfa'] });
    } else {
      playSound.error();
      if (scheduleReview) scheduleReview(topic.id, 1);
    }
  };

  /* Celebration when landing on the Lesson Complete step after a correct quiz */
  useEffect(() => {
    if (activeStep === 5 && submitted && chosen === quiz?.correct) {
      confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 }, colors: ['#f59e0b', '#34d399', '#38bdf8', '#a78bfa', '#fb7185'] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, submitted, chosen, topic?.id]);

  const nextStep = () => setActiveStep(prev => Math.min(5, prev + 1));
  const prevStep = () => setActiveStep(prev => Math.max(1, prev - 1));

  return (
    <div className="lesson-stepper">
      {/* Topic Header area */}
      <div className="topic-header" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>{activeTrack?.label}</span>
          <span>/</span>
          <span style={{ color: 'var(--amber)' }}>{topic.title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
          <div className="topic-badges" style={{ margin: 0 }}>
            <span className={`badge ${topic.badge}`}>{topic.level}</span>
            <span className="badge badge-amber">{activeTrack?.label}</span>
            {isCompleted(topic.id) && (
              <span className="badge badge-emerald"><CheckCircle2 size={11} /> Completed</span>
            )}
          </div>
          <button
            className="btn btn-ghost"
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            onClick={() => toggleBookmark(topic.id)}
          >
            <Bookmark size={13} style={bookmarks.includes(topic.id) ? { color: 'var(--amber)', fill: 'var(--amber)' } : {}} />
            {bookmarks.includes(topic.id) ? 'Bookmarked' : 'Bookmark'}
          </button>
        </div>
        <h1 className="topic-title">{topic.title}</h1>
      </div>

      {/* Progress Bar (Desktop) */}
      <div className="desktop-stepper" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 15, left: 20, right: 20, height: 2, background: 'var(--glass-border)', zIndex: 0 }}>
           <div style={{ 
             height: '100%', 
             background: 'var(--amber)', 
             width: `${((activeStep - 1) / (STEPS.length - 1)) * 100}%`,
             transition: 'width 0.3s ease'
           }} />
        </div>
        {STEPS.map((stepName, i) => {
          const stepNum = i + 1;
          const isCompletedStep = activeStep > stepNum;
          const isActive = activeStep === stepNum;
          return (
            <div key={stepName} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 'bold', transition: 'all 0.3s ease',
                background: isCompletedStep ? 'var(--emerald)' : isActive ? 'var(--amber)' : 'var(--glass)',
                color: isCompletedStep || isActive ? '#fff' : 'var(--text-muted)',
                border: isActive ? '2px solid var(--amber)' : isCompletedStep ? '2px solid var(--emerald)' : '2px solid var(--glass-border)'
              }}>
                {isCompletedStep ? <Check size={16} /> : stepNum}
              </div>
              <span style={{ fontSize: '0.7rem', color: isActive || isCompletedStep ? 'var(--text)' : 'var(--text-muted)', fontWeight: isActive ? 'bold' : 'normal' }}>
                {stepName}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar (Mobile) */}
      <div className="mobile-stepper" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, background: 'rgba(255,255,255,0.04)', padding: '8px 12px', borderRadius: 'var(--r-pill)', border: '1px solid var(--glass-border)' }}>
        <button className="btn btn-ghost" onClick={prevStep} disabled={activeStep === 1} style={{ padding: '6px', borderRadius: '50%', minHeight: 'unset', width: 32, height: 32 }}>
          <ArrowLeft size={16} />
        </button>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Step {activeStep} of {STEPS.length}: <span style={{ color: 'var(--amber)' }}>{STEPS[activeStep - 1]}</span>
        </div>
        <button className="btn btn-ghost" onClick={nextStep} disabled={activeStep === STEPS.length} style={{ padding: '6px', borderRadius: '50%', minHeight: 'unset', width: 32, height: 32 }}>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Step Content */}
      <div className="step-content anim-fade" style={{ minHeight: 300, display: 'flex', flexDirection: 'column' }}>
        {activeStep === 1 && (
          <div className="anim-fade" style={{ flex: 1 }}>
            {/* Integrated Language & Voice Toolbar */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(14,19,32,0.85) 100%)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: 'var(--r-md)',
              padding: '10px 16px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--amber)', fontSize: '0.8rem', fontWeight: 700 }}>
                  <Languages size={15} /> Explanation Language:
                </span>
                <div className="lang-selector" style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 10px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <select value={nativeLang} onChange={e => setNativeLang(e.target.value)} style={{ fontSize: '0.78rem', fontWeight: 600, padding: '2px 4px', background: 'transparent', color: '#f1f5f9', border: 'none' }}>
                    {LANGS.map(l => <option key={l} value={l} style={{ background: '#0f172a', color: '#fff' }}>{l}</option>)}
                  </select>
                </div>
                <div className="lang-selector" style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 10px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mic size={13} style={{ color: 'var(--sky)' }} />
                  <select value={voiceGender} onChange={e => setVoiceGender(e.target.value)} style={{ fontSize: '0.78rem', fontWeight: 600, padding: '2px 4px', background: 'transparent', color: '#f1f5f9', border: 'none' }}>
                    <option value="Female" style={{ background: '#0f172a', color: '#fff' }}>Female Voice</option>
                    <option value="Male" style={{ background: '#0f172a', color: '#fff' }}>Male Voice</option>
                  </select>
                </div>
              </div>

              <button
                className="btn btn-amber"
                style={{ padding: '6px 14px', fontSize: '0.78rem', fontWeight: 700, borderRadius: 9999 }}
                onClick={() => toggleAudio(nativeText || topic.summary)}
              >
                {isSpeaking ? <><VolumeX size={14} /> Stop Audio</> : <><Volume2 size={14} /> Listen to Lesson</>}
              </button>
            </div>

            {/* Main Lesson Summary Content (Dynamically updated according to selected Language) */}
            <div className="topic-summary" style={{ fontSize: '1.05rem', lineHeight: 1.75 }}>
              <FormatText text={nativeText || topic.summary} />
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="anim-fade" style={{ flex: 1 }}>
            <Suspense fallback={<div className="skeleton" style={{ height: 220 }} />}>
              <InteractiveVisualizer topic={topic} nativeText={nativeText} />
            </Suspense>
          </div>
        )}

        {activeStep === 3 && (
          <div className="anim-fade" style={{ flex: 1 }}>
            {topic.lang !== 'sql' && !topic.hasJSPlayground && (
              <Suspense fallback={<div className="skeleton" style={{ height: 220 }} />}>
                <CodeDrawer code={topic.code} lang={topic.lang || 'java'} />
              </Suspense>
            )}
            {topic.hasSandbox && (
              <Suspense fallback={<div className="skeleton" style={{ height: 220 }} />}>
                <SQLSandbox initialQuery={topic.code?.includes('SELECT') ? topic.code : undefined} />
              </Suspense>
            )}
            {topic.hasJSPlayground && (
              <Suspense fallback={<div className="skeleton" style={{ height: 220 }} />}>
                <JSPlayground initialCode={topic.code} />
              </Suspense>
            )}
          </div>
        )}

        {activeStep === 4 && (
          <div className="anim-fade" style={{ flex: 1 }}>
            {quiz ? (
              <div className="quiz-card glass">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <CheckCircle2 size={15} style={{ color: '#059669' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Concept Check
                  </span>
                </div>
                <p className="quiz-q" style={{ fontSize: '1.05rem', marginBottom: 20 }}>{quiz.question}</p>
                <div className="quiz-options">
                  {quiz.options.map((opt, i) => {
                    let cls = 'quiz-option';
                    if (submitted) {
                      if (i === quiz.correct) cls += ' correct';
                      else if (i === chosen)  cls += ' wrong';
                    }
                    return (
                      <button key={i} className={cls} onClick={() => !submitted && submitQuiz(i)} disabled={submitted}>
                        <span className="quiz-option-index">
                          {submitted && i === quiz.correct ? <Check size={12}/> :
                           submitted && i === chosen ? <XIcon size={12}/> :
                           String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {submitted && (
                  <div className="anim-fade" style={{ marginTop: 20 }}>
                    <div className={`quiz-result-banner ${chosen === quiz.correct ? 'correct' : 'wrong'}`}>
                      {chosen === quiz.correct ? <Check size={16} /> : <XIcon size={16} />}
                      {chosen === quiz.correct ? 'Correct! Great job.' : 'Not quite — check the explanation below.'}
                    </div>
                    <div className="diag-section correct" style={{ marginTop: 16 }}>
                      <div className="diag-label"><Check size={14}/> Explanation</div>
                      <p style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', lineHeight: 1.6 }}>{quiz.explanation}</p>
                      {chosen !== quiz.correct && onAskWhyWrong && (
                        <button
                          className="btn btn-ghost"
                          style={{ marginTop: 12, padding: '8px 14px', fontSize: '0.8rem' }}
                          onClick={() => onAskWhyWrong(quiz, chosen)}
                        >
                          <HelpCircle size={13} /> Why was this wrong?
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No quiz available for this topic.</div>
            )}
            
            {/* Topic Notes appended after quiz content */}
            <TopicNotes topicId={topic.id} />
          </div>
        )}

        {activeStep === 5 && (
          <div className="anim-fade" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass" style={{ padding: 40, textAlign: 'center', borderRadius: 'var(--r-xl)', maxWidth: 600, width: '100%' }}>
              <div style={{ width: 64, height: 64, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--emerald)' }}>
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: 16, color: '#fff' }}>Lesson Complete!</h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Quiz Score</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: chosen === quiz?.correct ? 'var(--emerald)' : 'var(--amber)' }}>
                    {chosen === quiz?.correct ? '100%' : '50%'}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>XP Earned</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--blue)' }}>
                    +100 XP
                  </div>
                </div>
              </div>
              
              <div style={{ background: 'rgba(52, 211, 153, 0.05)', border: '1px solid rgba(52, 211, 153, 0.2)', padding: '16px 20px', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, textAlign: 'left' }}>
                <BookOpen size={20} color="var(--emerald)" />
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: '#fff' }}>Mastery Added</strong><br/>
                  This topic is now tracked in your spaced repetition schedule.
                </div>
              </div>
              
              {hasNext && (
                <button className="btn btn-amber" style={{ padding: '14px 28px', fontSize: '1.05rem', width: '100%', display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }} onClick={onNextTopic}>
                  Continue to Next Topic <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Step Navigation */}
      {activeStep < 5 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--glass-border)' }}>
          <button className="btn btn-ghost" onClick={prevStep} disabled={activeStep === 1} style={{ visibility: activeStep === 1 ? 'hidden' : 'visible' }}>
            <ArrowLeft size={16} /> Previous
          </button>
          
          {activeStep === 4 ? (
            <button className="btn btn-emerald" onClick={nextStep} disabled={!submitted}>
              Complete Lesson ✓
            </button>
          ) : (
            <button className="btn btn-amber" onClick={nextStep}>
              Next Step <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
