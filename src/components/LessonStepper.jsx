import React, { useState, useEffect } from 'react';
import {
  Check, CheckCircle2, X as XIcon, Languages, Volume2, VolumeX, Bookmark, ArrowRight, ArrowLeft
} from 'lucide-react';
import InteractiveVisualizer from './visualizers/InteractiveVisualizer';
import CodeDrawer from './CodeDrawer';
import SQLSandbox from './SQLSandbox';
import JSPlayground from './JSPlayground';
import TopicNotes from './TopicNotes';
import { playSound } from '../utils/sounds';

export default function LessonStepper({
  topic, activeTrack, isCompleted, markComplete, toggleBookmark, bookmarks, nativeLang,
  scheduleReview, recordQuizResult,
  onNextTopic, onPrevTopic, hasNext, hasPrev
}) {
  const [activeStep, setActiveStep] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chosen, setChosen] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setActiveStep(1);
    setIsSpeaking(false);
    setChosen(null);
    setSubmitted(false);
    window.speechSynthesis?.cancel();
  }, [topic]);

  const toggleAudio = (text) => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis?.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis?.speak(u);
    }
  };

  const STEPS = ['Intuition', 'Visualize', 'Code', 'Quiz', 'Summary'];

  const quiz = topic?.quiz;
  const nativeText = topic?.native?.[nativeLang] || topic?.native?.Hinglish || '';

  const submitQuiz = (idx) => {
    setChosen(idx);
    setSubmitted(true);
    const isCorrect = idx === quiz?.correct;
    if (recordQuizResult) recordQuizResult(topic.title, isCorrect);
    if (isCorrect) {
      playSound.success();
      markComplete(topic.id);
      if (scheduleReview) scheduleReview(topic.id, 5);
    } else {
      playSound.error();
      if (scheduleReview) scheduleReview(topic.id, 1);
    }
  };

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

      {/* Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, position: 'relative' }}>
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

      {/* Step Content */}
      <div className="step-content anim-fade" style={{ minHeight: 300, display: 'flex', flexDirection: 'column' }}>
        {activeStep === 1 && (
          <div className="anim-fade" style={{ flex: 1 }}>
            <div className="topic-summary" style={{ whiteSpace: 'pre-line', fontSize: '1.1rem', marginBottom: 24, lineHeight: 1.6 }}>
              {topic.summary.split('.').slice(0, 3).join('.') + '.'}
            </div>
            {nativeText && (
              <div className="diag-section native" style={{ background: 'rgba(234, 88, 12, 0.05)', border: '1px solid rgba(234, 88, 12, 0.2)', padding: 20, borderRadius: 'var(--r-md)' }}>
                <div className="diag-label" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--amber)' }}><Languages size={15} /> {nativeLang} Explanation</span>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                    onClick={() => toggleAudio(nativeText)}
                  >
                    {isSpeaking ? <><VolumeX size={12} /> Stop</> : <><Volume2 size={12} /> Listen</>}
                  </button>
                </div>
                <p style={{ lineHeight: 1.75, fontSize: '0.95rem' }}>{nativeText}</p>
              </div>
            )}
          </div>
        )}

        {activeStep === 2 && (
          <div className="anim-fade" style={{ flex: 1 }}>
            <InteractiveVisualizer topic={topic} />
          </div>
        )}

        {activeStep === 3 && (
          <div className="anim-fade" style={{ flex: 1 }}>
            {topic.lang !== 'sql' && !topic.hasJSPlayground && (
              <CodeDrawer code={topic.code} lang={topic.lang || 'java'} />
            )}
            {topic.hasSandbox && (
              <SQLSandbox initialQuery={topic.code?.includes('SELECT') ? topic.code : undefined} />
            )}
            {topic.hasJSPlayground && (
              <JSPlayground initialCode={topic.code} />
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
                  <div className="diag-section correct anim-fade" style={{ marginTop: 20 }}>
                    <div className="diag-label"><Check size={14}/> Explanation</div>
                    <p style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', lineHeight: 1.6 }}>{quiz.explanation}</p>
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
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Quiz Result</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: chosen === quiz?.correct ? 'var(--emerald)' : 'var(--rose)' }}>
                    {chosen === quiz?.correct ? 'Correct' : 'Needs Review'}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: 24, borderRadius: 'var(--r-md)', fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                <strong>Full Summary:</strong><br/>
                {topic.summary}
              </div>
              
              {hasNext && (
                <button className="btn btn-amber" style={{ marginTop: 32, padding: '12px 24px', fontSize: '1rem', width: '100%' }} onClick={onNextTopic}>
                  Next Topic <ArrowRight size={16} />
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
