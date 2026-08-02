import React, { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle, Star, Clock, List, Target, Mic, Camera, AlertTriangle, ShieldAlert, Loader2, Award, ChevronDown, ChevronUp, Sparkles, UserCheck, Square, Volume2, ShieldCheck, XCircle, LogOut, CalendarDays, Layers, RefreshCw } from 'lucide-react';
import { generateInterviewQuestions, generateInterviewSummary, ROUND_MODES } from '../services/geminiService';
import { useToast } from '../context/ToastContext';

export default function MockInterview() {
  const { showToast } = useToast();
  const [phase, setPhase] = useState('setup'); // setup, loading, interview, loading-summary, summary
  const phaseRef = useRef(phase);
  
  // Setup state
  const [interviewType, setInterviewType] = useState('Java Full Stack Developer');
  const [difficulty, setDifficulty] = useState('Fresher / New Grad');
  const [companyStyle, setCompanyStyle] = useState('Amazon / Google (Deep Dive & System Design)');
  const [roundMode, setRoundMode] = useState('quick');
  
  // Interview state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Proctoring & Media State
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const streamRef = useRef(null);
  const blazefaceModelRef = useRef(null);
  // tfjs/blazeface are loaded lazily after the user opts into proctoring
  const tfRef = useRef(null);
  const bfRef = useRef(null);
  const [proctorLoading, setProctorLoading] = useState(false);
  const [anomalies, setAnomalies] = useState(0);
  const [proctorWarning, setProctorWarning] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [finalSummary, setFinalSummary] = useState(null);
  const [summaryError, setSummaryError] = useState(null);
  const [showGenericReport, setShowGenericReport] = useState(false);
  const [expandedQIndex, setExpandedQIndex] = useState(null);

  const [terminationReason, setTerminationReason] = useState('');

  // UI Dialog state for stopping interview early
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  // Keep phaseRef in sync with phase state to fix closure staleness
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Auto-terminate interview when 3 anomalies are detected
  useEffect(() => {
    if (anomalies >= 3 && phaseRef.current === 'interview') {
      window.speechSynthesis?.cancel();
      stopProctoring();
      const reason = proctorWarning || "3 proctoring security anomalies detected (camera covered, face missing, or tab switched).";
      setTerminationReason(reason);
      setPhase('terminated');
      speak("Interview terminated due to multiple proctoring security violations.");
      showToast("Interview terminated: 3 anti-cheating anomalies detected.", 'error', 6000);
    }
  }, [anomalies]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setCurrentAnswer(prev => (prev ? prev + ' ' + finalTranscript : finalTranscript));
        }
      };

      recognition.onerror = (event) => console.error("Speech error", event);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');

  // Asynchronously load and populate high-quality natural/neural speech voices
  useEffect(() => {
    if (!window.speechSynthesis) return;

    const populateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const englishVoices = voices.filter(v => v.lang.startsWith('en'));
        const sorted = (englishVoices.length > 0 ? englishVoices : voices).sort((a, b) => {
          const aIsNatural = a.name.includes('Natural') || a.name.includes('Neural') || a.name.includes('Google') || a.name.includes('Enhanced');
          const bIsNatural = b.name.includes('Natural') || b.name.includes('Neural') || b.name.includes('Google') || b.name.includes('Enhanced');
          return bIsNatural - aIsNatural;
        });

        setAvailableVoices(sorted);
        if (!selectedVoiceName && sorted.length > 0) {
          setSelectedVoiceName(sorted[0].name);
        }
      }
    };

    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speak = (text) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();

    // Clean text: strip markdown syntax, asterisks, code blocks for fluent natural prose
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'code block')
      .replace(/[`*_~#>•]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    
    let chosenVoice = voices.find(v => v.name === selectedVoiceName);
    if (!chosenVoice) {
      chosenVoice = voices.find(v => 
        v.name.includes('Natural') || 
        v.name.includes('Neural') || 
        v.name.includes('Google US English') || 
        v.name.includes('Google UK English') ||
        v.name.includes('Samantha (Enhanced)') ||
        v.name.includes('Enhanced')
      ) || voices.find(v => v.lang.startsWith('en')) || null;
    }

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.rate = 0.98;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  };

  // Start webcam and initialize proctoring loop
  const startProctoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Lazy-load TensorFlow.js + BlazeFace only after the user opts into proctoring.
      // This keeps the ~1.8 MB model bundle out of the initial/lazy component chunk.
      setProctorLoading(true);
      try {
        const [tf, blazeface] = await Promise.all([
          import('@tensorflow/tfjs'),
          import('@tensorflow-models/blazeface')
        ]);
        tfRef.current = tf;
        bfRef.current = blazeface;
      } catch (err) {
        console.warn("AI proctor model script failed to load:", err);
      }

      // Load BlazeFace model if not loaded
      if (!blazefaceModelRef.current && bfRef.current) {
        try {
          blazefaceModelRef.current = await bfRef.current.load({ modelUrl: '/models/blazeface/model.json' });
        } catch (err) {
          console.warn("BlazeFace load failed, falling back to camera brightness checks:", err);
        }
      }
      setProctorLoading(false);
      
      // Tab switching detection
      const handleVisibility = () => {
        if (document.hidden && phaseRef.current === 'interview') {
          setAnomalies(prev => prev + 1);
          setProctorWarning('Tab switched! Do not leave the interview screen.');
        }
      };
      document.addEventListener('visibilitychange', handleVisibility);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibility);
      };
      
    } catch (err) {
      console.error("Proctoring setup failed", err);
      showToast("Camera and Microphone permissions are required for the AI Mock Interview.", 'error', 5000);
    }
  };

  // Active proctoring loop for face detection & camera coverage
  useEffect(() => {
    if (phase !== 'interview') return;

    const interval = setInterval(async () => {
      if (phaseRef.current !== 'interview' || !videoRef.current) return;
      const video = videoRef.current;

      if (video.readyState === 4 && video.videoWidth > 0) {
        let warning = '';

        // 1. Brightness check (detect camera covered by hand/object)
        try {
          const canvas = canvasRef.current;
          canvas.width = 32;
          canvas.height = 32;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, 32, 32);
          const imgData = ctx.getImageData(0, 0, 32, 32).data;
          let sum = 0;
          for (let i = 0; i < imgData.length; i += 4) {
            sum += (imgData[i] + imgData[i + 1] + imgData[i + 2]) / 3;
          }
          const avgBrightness = sum / (imgData.length / 4);

          if (avgBrightness < 18) {
            warning = 'Camera covered / Dark lens detected!';
          }
        } catch {}

        // 2. BlazeFace face count & gaze check
        if (!warning && blazefaceModelRef.current) {
          try {
            const predictions = await blazefaceModelRef.current.estimateFaces(video, false);
            if (predictions.length === 0) {
              warning = 'No face detected! Please look at the camera.';
            } else if (predictions.length > 1) {
              warning = 'Multiple faces detected! You must be alone.';
            }
          } catch {}
        }

        if (warning) {
          setAnomalies(prev => prev + 1);
          setProctorWarning(warning);
        } else {
          setProctorWarning('');
        }
      }
    }, 600);

    return () => clearInterval(interval);
  }, [phase]);

  const stopProctoring = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Timer loop during interview
  useEffect(() => {
    let timer;
    if (phase === 'interview') {
      timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [phase]);

  const startInterview = async () => {
    setPhase('loading');
    try {
      const data = await generateInterviewQuestions(interviewType, difficulty, companyStyle, roundMode);
      
      let qList = null;
      if (data && data.questions && Array.isArray(data.questions)) {
        qList = data.questions;
      } else if (Array.isArray(data)) {
        qList = data;
      } else if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data.replace(/```json|```/g, '').trim());
          qList = parsed.questions || parsed;
        } catch {}
      }
      
      const mode = ROUND_MODES[roundMode] || ROUND_MODES.quick;
      if (qList && qList.length > 0) {
        const sliced = qList.slice(0, mode.total);
        setQuestions(sliced);
        setCurrentIndex(0);
        setAnswers([]);
        setAnomalies(0);
        setTimeElapsed(0);
        setCurrentAnswer('');
        setFinalSummary(null);
        setSummaryError(null);
        setShowGenericReport(false);
        setPhase('interview');
        await startProctoring();
        
        // Announce the first round and speak first question
        const firstRound = sliced[0]?.round || mode.rounds[0]?.name || 'Interview';
        speak(`Welcome to your ${mode.label} session. Starting Round 1: ${firstRound}. Here is your first question. ${sliced[0].text}`);
      } else {
        throw new Error("AI returned an unexpected question format. Please try again.");
      }
    } catch (err) {
      console.error('[MockInterview] Error:', err);
      showToast(err.message || "Error generating interview questions. Please try again.", 'error', 4000);
      setPhase('setup');
    }
  };

  const toggleListen = () => {
    if (!recognitionRef.current) {
      showToast("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.", 'info', 5000);
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Mic start error", err);
      }
    }
  };

  const handleQuitRequest = () => {
    setShowQuitConfirm(true);
  };

  const confirmQuitInterview = () => {
    setShowQuitConfirm(false);
    window.speechSynthesis?.cancel();
    stopProctoring();
    setPhase('setup');
    setQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setCurrentAnswer('');
    setAnomalies(0);
    setFinalSummary(null);
    setSummaryError(null);
    setShowGenericReport(false);
    showToast("Interview ended early. No evaluation report was generated.", 'info', 3000);
  };

  // Generate the evaluation report. Reused by the initial submission and the
  // "Retry" button on the summary screen so we never fabricate a score/verdict.
  const generateSummaryReport = async (answersList) => {
    setSummaryError(null);
    setShowGenericReport(false);
    setFinalSummary(null);
    setPhase('loading-summary');
    try {
      const summaryData = await generateInterviewSummary(
        answersList,
        anomalies,
        interviewType,
        difficulty,
        companyStyle
      );
      setFinalSummary(summaryData);
      setPhase('summary');

      if (summaryData?.verdict) {
        speak(`Interview completed! Your final verdict is ${summaryData.verdict}. Here is your detailed performance report.`);
      }
    } catch (err) {
      console.error("Failed to generate summary", err);
      setSummaryError(err?.message || "AI evaluation failed. Please try again.");
      setFinalSummary(null);
      setPhase('summary');
    }
  };

  // Proceed to next question or finish interview
  const handleNextQuestion = async () => {
    if (isListening && recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
    
    // Save answer for current question
    const currentQ = questions[currentIndex];
    const newAnswerRecord = {
      question: currentQ,
      userAnswer: currentAnswer.trim() || 'No verbal answer recorded',
      timeTaken: timeElapsed
    };
    
    const updatedAnswers = [...answers, newAnswerRecord];
    setAnswers(updatedAnswers);
    setCurrentAnswer('');

    if (currentIndex + 1 < questions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      // Detect sub-round transition and announce it
      const currentRound = currentQ.round;
      const nextRound = questions[nextIdx]?.round;
      if (nextRound && currentRound !== nextRound) {
        speak(`${currentRound} round complete. Now moving to the next round: ${nextRound}. Here is your next question. ${questions[nextIdx].text}`);
      } else {
        speak(questions[nextIdx].text);
      }
    } else {
      window.speechSynthesis?.cancel();
      stopProctoring();
      await generateSummaryReport(updatedAnswers);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProctoring();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  /* ─────────────────────────────────────────────────────────
     PHASE: SETUP
  ───────────────────────────────────────────────────────── */
  if (phase === 'setup') {
    return (
      <div className="anim-fade" style={{ maxWidth: 650, margin: '0 auto', paddingTop: 20 }}>
        
        <div className="info-box" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: 16, borderRadius: 12, marginBottom: 24 }}>
          <strong style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <AlertTriangle size={18} /> Browser Requirement & Proctoring Rules
          </strong>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: 'block' }}>
            • <b>Voice-to-Voice AI Interview</b>: The AI will speak questions aloud. Click the microphone to speak your response.<br />
            • <b>Active AI Proctoring</b>: Camera feed is monitored in real-time. Looking away, covering the camera, or tab switching will trigger anomaly flags.
          </span>
        </div>

        <div className="glass" style={{ padding: 32, borderRadius: 16 }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, fontSize: '1.4rem' }}>
            <Target size={24} style={{ color: 'var(--amber)' }} /> AI Voice-to-Voice Mock Interview
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)', fontWeight: 600 }}>Target Role / Domain</label>
              <select className="glass-input" style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }} value={interviewType} onChange={e => setInterviewType(e.target.value)}>
                <option value="Java Full Stack Developer">Java Full Stack Developer</option>
                <option value="Frontend Developer (React)">Frontend Developer (React)</option>
                <option value="Backend Developer (Node/SQL)">Backend Developer (Node/SQL)</option>
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="HR & Behavioral Interview">HR & Behavioral (STAR Method)</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)', fontWeight: 600 }}>Experience Level</label>
              <select className="glass-input" style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option value="Fresher / New Grad">Fresher / New Grad (Campus Placement)</option>
                <option value="Experienced (1-3 yrs)">Experienced (1-3 yrs)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)', fontWeight: 600 }}>Target Company Standard</label>
              <select className="glass-input" style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }} value={companyStyle} onChange={e => setCompanyStyle(e.target.value)}>
                <option value="TCS / Infosys / Wipro (Standard Technical)">TCS / Infosys / Wipro (Standard Technical)</option>
                <option value="Cognizant / Accenture / Deloitte (Practical)">Cognizant / Accenture / Deloitte (Practical)</option>
                <option value="Amazon / Google (Deep System Design & Edge Cases)">Amazon / Google (Deep System Design & Edge Cases)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)', fontWeight: 600 }}>Interview Format & Round Structure</label>
              <select className="glass-input" style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }} value={roundMode} onChange={e => setRoundMode(e.target.value)}>
                {Object.entries(ROUND_MODES).map(([key, mode]) => (
                  <option key={key} value={key}>{mode.label}</option>
                ))}
              </select>
              {ROUND_MODES[roundMode] && (
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {ROUND_MODES[roundMode].rounds.map((r, i) => (
                    <span key={i} style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>
                      R{i+1}: {r.name} ({r.count}Q)
                    </span>
                  ))}
                </div>
              )}
            </div>

            {availableVoices.length > 0 && (
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)', fontWeight: 600 }}>AI Interviewer Voice</label>
                <select className="glass-input" style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }} value={selectedVoiceName} onChange={e => setSelectedVoiceName(e.target.value)}>
                  {availableVoices.map((v, i) => (
                    <option key={i} value={v.name}>{v.name} ({v.lang})</option>
                  ))}
                </select>
              </div>
            )}

            <button className="btn btn-primary" style={{ marginTop: 12, width: '100%', padding: 16, fontSize: '1.05rem', justifyContent: 'center', borderRadius: 12 }} onClick={startInterview}>
              <Play size={18} /> Begin Voice Interview & Enable Proctoring
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────
     PHASE: LOADING & LOADING SUMMARY
  ───────────────────────────────────────────────────────── */
  if (phase === 'loading' || phase === 'loading-summary') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: 16 }}>
        <Loader2 size={48} className="spinner" style={{ color: 'var(--amber)' }} />
        <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 600 }}>
          {phase === 'loading' ? 'Generating Custom Voice Interview Questions...' : 'Analyzing Spoken Answers & Proctoring Report...'}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {phase === 'loading' ? 'Connecting to AI Interview Server' : 'Evaluating Technical Accuracy, Speech Fluency & Trust Score'}
        </p>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────
     PHASE: INTERVIEW
  ───────────────────────────────────────────────────────── */
  if (phase === 'interview') {
    const question = questions[currentIndex];
    
    return (
      <div className="anim-fade" style={{ maxWidth: 960, margin: '0 auto', paddingTop: 16 }}>
        
        {/* Custom Confirmation Modal for Stop Interview */}
        {showQuitConfirm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(12px)',
            padding: 20
          }}>
            <div className="glass anim-fade" style={{ maxWidth: 450, width: '100%', padding: 28, borderRadius: 16, border: '1px solid rgba(239, 68, 68, 0.3)', background: 'linear-gradient(165deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, color: '#f87171' }}>
                <ShieldAlert size={24} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#fff' }}>Stop Interview Early?</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 24 }}>
                Are you sure you want to quit? No evaluation report or score will be generated because the interview was not completed.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button className="btn" onClick={() => setShowQuitConfirm(false)} style={{ padding: '10px 20px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Resume Interview
                </button>
                <button className="btn" onClick={confirmQuitInterview} style={{ padding: '10px 20px', borderRadius: 8, background: '#ef4444', color: '#fff', border: 'none' }}>
                  Quit Interview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span className="badge" style={{ padding: '6px 14px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            {question.round && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24', padding: '5px 14px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 700 }}>
                <Layers size={14} /> {question.round}
              </span>
            )}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {interviewType} ({difficulty})
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {proctorWarning && (
              <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 700, background: 'rgba(239, 68, 68, 0.15)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(239, 68, 68, 0.3)', animation: 'pulse 1.5s infinite' }}>
                <ShieldAlert size={15} /> {proctorWarning}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <Clock size={16} /> {formatTime(timeElapsed)}
            </div>
            <button 
              onClick={handleQuitRequest}
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '6px 14px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}
              title="Stop Interview Early"
            >
              <Square size={13} fill="#f87171" /> Stop Interview
            </button>
          </div>
        </div>

        <div className="interview-grid" style={{ gap: 20 }}>

          {/* Question & Answer Card */}
          <div className="glass" style={{ padding: 28, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: 'var(--amber)', color: '#000', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem' }}>AI</div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>AI Interviewer</span>
              </div>
              <button 
                onClick={() => speak(question.text)}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Volume2 size={14} /> Replay Question
              </button>
            </div>
            
            <h3 style={{ fontSize: '1.25rem', lineHeight: 1.6, marginBottom: 28, color: '#fff', fontWeight: 700 }}>
              {question.text}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ position: 'relative' }}>
                <textarea
                  className="glass-input"
                  style={{ width: '100%', minHeight: 160, padding: '16px 16px 16px 52px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#fff', resize: 'vertical', lineHeight: 1.6, fontSize: '0.95rem' }}
                  placeholder="Click microphone to dictate your answer or type manually..."
                  value={currentAnswer}
                  onChange={e => setCurrentAnswer(e.target.value)}
                />
                <button 
                  onClick={toggleListen}
                  style={{ position: 'absolute', top: 16, left: 14, background: isListening ? '#ef4444' : 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                  title="Toggle Microphone"
                >
                  <Mic size={18} />
                </button>
                {isListening && (
                  <div style={{ position: 'absolute', top: 22, left: 56, fontSize: '0.8rem', color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%', animation: 'pulse 1s infinite' }}></div>
                    Listening...
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words spoken
                </span>

                <button 
                  className="btn btn-primary" 
                  style={{ padding: '12px 24px', borderRadius: 10, fontSize: '0.95rem' }}
                  onClick={handleNextQuestion}
                >
                  {currentIndex + 1 < questions.length ? 'Next Question ➔' : 'Finish & Submit Interview'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar: Live Camera & Proctoring Feed */}
          <div>
            <div style={{ background: '#000', borderRadius: 14, overflow: 'hidden', position: 'relative', border: '2px solid rgba(255,255,255,0.15)', aspectRatio: '4/3' }}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
              />
              {proctorLoading ? (
                <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6, color: '#fff' }}>
                  <div style={{ width: 8, height: 8, background: '#fbbf24', borderRadius: '50%', animation: 'pulse 1s infinite' }}></div>
                  Loading AI proctor…
                </div>
              ) : (
                <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6, color: '#fff' }}>
                  <div style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                  AI PROCTOR ACTIVE
                </div>
              )}
              {anomalies > 0 && (
                <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(239,68,68,0.9)', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 'bold' }}>
                  Anomalies: {anomalies}
                </div>
              )}
            </div>
            <div style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5 }}>
              <Camera size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
              Face Detection & Anti-Cheating Active
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────
     PHASE: TERMINATED (3 Proctoring Anomalies)
  ───────────────────────────────────────────────────────── */
  if (phase === 'terminated') {
    return (
      <div className="anim-fade" style={{ maxWidth: 620, margin: '0 auto', paddingTop: 24 }}>
        <div className="glass" style={{ padding: 40, borderRadius: 20, textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'linear-gradient(165deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#ef4444' }}>
            <XCircle size={32} />
          </div>
          
          <div style={{ display: 'inline-block', background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '4px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16, border: '1px solid rgba(239,68,68,0.3)' }}>
            Interview Disqualified
          </div>
          
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: 12 }}>
            Interview Terminated Early
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: 500, margin: '0 auto 28px auto' }}>
            Your interview was automatically terminated because <b>3 proctoring security anomalies</b> were detected. In live company assessments, these lead to immediate disqualification.
          </p>

          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(239,68,68,0.25)', padding: 18, borderRadius: 12, textAlign: 'left', marginBottom: 32 }}>
            <strong style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', marginBottom: 6 }}>
              <ShieldAlert size={16} /> Termination Trigger:
            </strong>
            <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.5, display: 'block' }}>
              {terminationReason || "Multiple anti-cheating anomalies detected (face missing, camera covered, or tab switched)."}
            </span>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={() => { setPhase('setup'); setAnomalies(0); setProctorWarning(''); setTerminationReason(''); }}
            style={{ padding: '12px 32px', fontSize: '0.95rem', borderRadius: 12, background: 'linear-gradient(135deg,#ef4444,#dc2626)', border: 'none' }}
          >
            Return to Setup & Retry
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────
     PHASE: FINAL SUMMARY & EVALUATION REPORT
  ───────────────────────────────────────────────────────── */
  const totalTime = answers.reduce((acc, curr) => acc + curr.timeTaken, 0);
  const trustScore = Math.max(0, 100 - (anomalies * 12));

  return (
    <div className="anim-fade" style={{ maxWidth: 880, margin: '0 auto', paddingTop: 16, paddingBottom: 40 }}>
      <div className="glass" style={{ padding: 36, borderRadius: 20 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', padding: '6px 16px', borderRadius: 20, color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            <Award size={16} /> Official Interview Assessment Report
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>Candidate Performance Summary</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
            {interviewType} • {difficulty} • {companyStyle}
          </p>
        </div>
        
        {/* Error panel — never fabricate a score/verdict */}
        {summaryError && !showGenericReport && (
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: 24, borderRadius: 14, marginBottom: 32, textAlign: 'center' }}>
            <AlertTriangle size={22} style={{ color: '#f87171', margin: '0 auto 10px auto' }} />
            <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>AI evaluation failed. Please try again.</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16 }}>
              We couldn't generate your personalized performance report.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => generateSummaryReport(answers)} style={{ padding: '10px 22px', borderRadius: 10 }}>
                <RefreshCw size={14} /> Retry
              </button>
              <button className="btn btn-ghost" onClick={() => setShowGenericReport(true)} style={{ padding: '10px 22px', borderRadius: 10 }}>
                Show generic report
              </button>
            </div>
          </div>
        )}

        {(!summaryError || showGenericReport) && (
          <>
        {showGenericReport && (
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: 16, borderRadius: 14, marginBottom: 28, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <AlertTriangle size={16} style={{ color: '#fbbf24', flexShrink: 0, marginTop: 2 }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: '#fbbf24' }}>Generic report:</strong> The AI evaluation failed, so this is <em>not</em> an assessment of your answers. It only shows general study pointers. Tap "Retry" above for your personalized report.
            </p>
          </div>
        )}

        {/* Top Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          {finalSummary?.overallScore != null && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: 20, borderRadius: 14, textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#60a5fa', marginBottom: 4 }}>{finalSummary.overallScore}%</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Technical Rating</div>
            </div>
          )}

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: 20, borderRadius: 14, textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: trustScore >= 80 ? '#34d399' : '#f87171', marginBottom: 4 }}>{trustScore}%</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Proctor Trust Score</div>
          </div>

          {finalSummary?.verdict && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: 20, borderRadius: 14, textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', marginBottom: 4, marginTop: 8 }}>{finalSummary.verdict}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Hiring Verdict</div>
            </div>
          )}

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: 20, borderRadius: 14, textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a78bfa', marginBottom: 4, marginTop: 8 }}>{formatTime(totalTime)}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Duration</div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="playground-grid" style={{ marginBottom: 28 }}>
          <div style={{ background: 'rgba(52, 211, 153, 0.06)', border: '1px solid rgba(52, 211, 153, 0.2)', padding: 20, borderRadius: 14 }}>
            <h4 style={{ color: '#34d399', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem', fontWeight: 700 }}>
              <CheckCircle size={18} /> Candidate Strengths (Goods)
            </h4>
            <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {finalSummary?.strengths?.map((s, i) => <li key={i} style={{ marginBottom: 6 }}>{s}</li>) || (
                <>
                  <li>Demonstrated solid grasp of core technical principles.</li>
                  <li>Clear communication style when explaining logic.</li>
                </>
              )}
            </ul>
          </div>

          <div style={{ background: 'rgba(248, 113, 113, 0.06)', border: '1px solid rgba(248, 113, 113, 0.2)', padding: 20, borderRadius: 14 }}>
            <h4 style={{ color: '#f87171', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem', fontWeight: 700 }}>
              <AlertTriangle size={18} /> Areas to Improve (Bads / Weaknesses)
            </h4>
            <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {finalSummary?.improvements?.map((s, i) => <li key={i} style={{ marginBottom: 6 }}>{s}</li>) || (
                <>
                  <li>Could provide deeper architectural details on complex questions.</li>
                  <li>Practice structuring responses using the STAR format.</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Strategic Mentor Guidance */}
        {finalSummary?.guidance && (
          <div style={{ background: 'rgba(167, 139, 250, 0.08)', border: '1px solid rgba(167, 139, 250, 0.25)', padding: 20, borderRadius: 14, marginBottom: 28 }}>
            <h4 style={{ color: '#c084fc', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem', fontWeight: 700 }}>
              <Sparkles size={18} /> Mentor Strategic Guidance
            </h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.92rem' }}>
              {finalSummary.guidance}
            </p>
          </div>
        )}

        {/* Round-by-Round Performance Scorecard */}
        {finalSummary?.roundScores && finalSummary.roundScores.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h4 style={{ color: '#60a5fa', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem', fontWeight: 700 }}>
              <Layers size={18} /> Round-by-Round Performance
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {finalSummary.roundScores.map((rs, i) => (
                <div key={i} style={{ background: 'rgba(96, 165, 250, 0.06)', border: '1px solid rgba(96, 165, 250, 0.2)', padding: 16, borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ color: '#93c5fd', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>R{i+1}: {rs.round}</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: rs.score >= 70 ? '#34d399' : rs.score >= 50 ? '#fbbf24' : '#f87171' }}>{rs.score}%</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.4, margin: 0 }}>{rs.remark}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7-Day Remedial Study Plan */}
        {finalSummary?.remedialPlan && finalSummary.remedialPlan.length > 0 && (
          <div style={{ background: 'rgba(52, 211, 153, 0.06)', border: '1px solid rgba(52, 211, 153, 0.2)', padding: 24, borderRadius: 14, marginBottom: 28 }}>
            <h4 style={{ color: '#34d399', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.05rem', fontWeight: 700 }}>
              <CalendarDays size={18} /> Your Personalized 7-Day Remedial Study Plan
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {finalSummary.remedialPlan.map((day, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: 'rgba(0,0,0,0.2)', padding: '14px 16px', borderRadius: 10, borderLeft: `3px solid ${i === 6 ? '#fbbf24' : '#34d399'}` }}>
                  <div style={{ minWidth: 48, textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: i === 6 ? '#fbbf24' : '#34d399' }}>Day</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{day.day || i + 1}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>{day.focus}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{day.task}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </>
        )}

        {/* Proctoring Audit Log */}
        <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)', padding: 18, borderRadius: 14, marginBottom: 32 }}>
          <h4 style={{ color: '#fbbf24', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem' }}>
            <ShieldAlert size={16} /> Proctoring Audit Log
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
            Total Anomalies Detected: <b>{anomalies}</b> (Tab switches, camera occlusions, or gaze departures).<br />
            {finalSummary?.proctoringNote || `Session completed with a ${trustScore}% Trust Verification Rating.`}
          </p>
        </div>

        {/* Detailed Question Breakdown */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
          <List size={20} style={{ color: 'var(--amber)' }} /> Question-by-Question Detailed Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
          {answers.map((a, i) => {
            const feedback = finalSummary?.questionFeedback?.find(q => q.qIndex === i + 1) || null;
            const isExpanded = expandedQIndex === i;
            
            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
                <div 
                  onClick={() => setExpandedQIndex(isExpanded ? null : i)}
                  style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: isExpanded ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, paddingRight: 16 }}>
                    <span style={{ fontWeight: 800, color: 'var(--amber)', fontSize: '0.9rem' }}>Q{i+1}</span>
                    {a.question.round && (
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#93c5fd', background: 'rgba(96,165,250,0.1)', padding: '2px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>{a.question.round}</span>
                    )}
                    <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.question.text}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {feedback?.score && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '2px 8px', borderRadius: 6 }}>
                        {feedback.score}/100
                      </span>
                    )}
                    {isExpanded ? <ChevronUp size={18} color="var(--text-secondary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                    <div style={{ marginBottom: 14 }}>
                      <strong style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Spoken Answer:</strong>
                      <p style={{ color: '#fff', fontSize: '0.92rem', marginTop: 4, background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, lineHeight: 1.5 }}>
                        "{a.userAnswer}"
                      </p>
                    </div>

                    {feedback?.feedback && (
                      <div style={{ marginBottom: 14 }}>
                        <strong style={{ color: '#60a5fa', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Feedback:</strong>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4, lineHeight: 1.5 }}>
                          {feedback.feedback}
                        </p>
                      </div>
                    )}

                    {feedback?.polishedAnswer && (
                      <div>
                        <strong style={{ color: '#34d399', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Polished Ideal Answer:</strong>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4, fontStyle: 'italic', background: 'rgba(52, 211, 153, 0.05)', padding: 12, borderRadius: 8, lineHeight: 1.5, borderLeft: '3px solid #34d399' }}>
                          "{feedback.polishedAnswer}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={() => setPhase('setup')} style={{ padding: '14px 36px', fontSize: 1.0, borderRadius: 12 }}>
            Start New Mock Interview
          </button>
        </div>

      </div>
    </div>
  );
}
