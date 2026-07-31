import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, RotateCcw, Star, AlertCircle, Clock, List } from 'lucide-react';

const QUESTION_BANK = [
  // Java
  { type: 'Technical (Java/SQL/JS/React)', text: 'Explain the difference between HashMap and ConcurrentHashMap. When would you choose one over the other?', modelAnswer: 'HashMap is not thread-safe and may throw ConcurrentModificationException. ConcurrentHashMap is thread-safe and allows concurrent reads and writes by dividing the map into segments or using CAS. Choose ConcurrentHashMap in multi-threaded environments.', points: ['Thread safety', 'Lock striping / CAS', 'Performance considerations'], keywords: ['thread', 'safe', 'cas', 'segment', 'lock', 'concurrent'] },
  { type: 'Technical (Java/SQL/JS/React)', text: 'What happens internally when you call `new String("hello")` vs `"hello"` in Java?', modelAnswer: '`"hello"` creates or reuses an object in the String Constant Pool. `new String("hello")` creates a new object in the heap memory even if `"hello"` is already in the pool, resulting in two objects if the pool didn\'t have it.', points: ['String Pool vs Heap', 'Memory efficiency', 'Object creation'], keywords: ['pool', 'heap', 'memory', 'constant', 'reference'] },
  { type: 'Technical (Java/SQL/JS/React)', text: 'Explain the SOLID principles with a real-world Java example.', modelAnswer: 'SOLID stands for Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. They are design principles to make software more maintainable and scalable.', points: ['Single Responsibility', 'Open/Closed', 'Liskov Substitution', 'Interface Segregation', 'Dependency Inversion'], keywords: ['single', 'open', 'liskov', 'interface', 'dependency'] },
  { type: 'Technical (Java/SQL/JS/React)', text: 'What is the diamond problem in Java? How do default methods in interfaces handle it?', modelAnswer: 'The diamond problem occurs in multiple inheritance when a class inherits from two parents that have the same method. Java interfaces with default methods handle this by forcing the implementing class to override the conflicting method and explicitly choose which parent method to call using `Parent.super.method()`.', points: ['Multiple inheritance ambiguity', 'Default methods', 'Explicit overriding'], keywords: ['multiple', 'inheritance', 'default', 'super', 'override', 'conflict'] },
  { type: 'Technical (Java/SQL/JS/React)', text: 'Describe the lifecycle of a thread in Java. What is the difference between `sleep()` and `wait()`?', modelAnswer: 'Thread lifecycle includes New, Runnable, Running, Blocked/Waiting, and Terminated. `sleep()` pauses the thread for a specific time without releasing the lock. `wait()` is called on an object, releases the lock, and waits until `notify()` or `notifyAll()` is called.', points: ['Thread states', 'Lock release', 'Object vs Thread method'], keywords: ['runnable', 'blocked', 'terminated', 'lock', 'release', 'notify'] },
  { type: 'Technical (Java/SQL/JS/React)', text: 'What is the difference between `==` and `.equals()` in Java? Can you override equals without hashCode?', modelAnswer: '`==` compares object references (memory addresses), while `.equals()` is meant to compare object values/contents. You can override equals without hashCode, but it violates the contract that equal objects must have equal hash codes, which breaks hash-based collections like HashMap.', points: ['Reference vs Value comparison', 'hashCode contract', 'Hash-based collections'], keywords: ['reference', 'value', 'address', 'contract', 'hashmap', 'collection'] },
  { type: 'Technical (Java/SQL/JS/React)', text: 'Explain Java Garbage Collection. What are the different GC algorithms available?', modelAnswer: 'Garbage Collection automatically frees memory by destroying unreachable objects. Common algorithms include Serial GC, Parallel GC, CMS (Concurrent Mark Sweep), and G1 (Garbage-First) GC. They vary in throughput and pause times.', points: ['Unreachable objects', 'Mark and sweep', 'G1 / CMS / Parallel'], keywords: ['unreachable', 'memory', 'mark', 'sweep', 'g1', 'cms'] },
  { type: 'Technical (Java/SQL/JS/React)', text: 'What is a ClassLoader in Java? Explain the delegation hierarchy.', modelAnswer: 'A ClassLoader loads Java classes into the JVM dynamically. The delegation hierarchy consists of Bootstrap, Extension (or Platform), and Application (or System) ClassLoaders. It delegates load requests to the parent before attempting to load itself.', points: ['Dynamic loading', 'Bootstrap, Extension, Application', 'Parent delegation model'], keywords: ['jvm', 'bootstrap', 'extension', 'application', 'delegate', 'parent'] },
  
  // SQL
  { type: 'Technical (Java/SQL/JS/React)', text: 'Write a query to find the second highest salary from an Employees table without using LIMIT.', modelAnswer: 'You can use a subquery: SELECT MAX(salary) FROM Employees WHERE salary < (SELECT MAX(salary) FROM Employees). Another approach uses window functions like DENSE_RANK().', points: ['Subquery with MAX', 'DENSE_RANK() approach', 'Self join alternative'], keywords: ['max', 'subquery', 'dense_rank', 'rank', 'nested'] },
  { type: 'Technical (Java/SQL/JS/React)', text: 'Explain the difference between WHERE and HAVING clauses with examples.', modelAnswer: 'WHERE filters rows before any grouping occurs. HAVING filters grouped rows after the GROUP BY clause has been applied. You cannot use aggregate functions in WHERE, but you can in HAVING.', points: ['Row filtering vs Group filtering', 'Execution order', 'Aggregate functions'], keywords: ['before', 'after', 'group', 'aggregate', 'filter'] },
  { type: 'Technical (Java/SQL/JS/React)', text: 'What are database indexes? When should you NOT create an index?', modelAnswer: 'Indexes improve read performance by creating a data structure (like B-Tree) for quick lookups. You should not create them on tables with frequent writes, small tables, or columns with low cardinality as they add storage overhead and slow down inserts/updates.', points: ['Read speed vs Write penalty', 'B-Tree structure', 'Low cardinality / Small tables'], keywords: ['read', 'write', 'overhead', 'b-tree', 'lookup', 'slow'] },
  { type: 'Technical (Java/SQL/JS/React)', text: 'Explain ACID properties with a real-world banking transaction example.', modelAnswer: 'ACID stands for Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don\'t interfere), and Durability (saved permanently). In a bank transfer, atomicity ensures both the deduction and addition occur together.', points: ['Atomicity, Consistency, Isolation, Durability', 'All-or-nothing execution', 'Crash recovery'], keywords: ['atomicity', 'consistency', 'isolation', 'durability', 'commit', 'rollback'] },
  { type: 'Technical (Java/SQL/JS/React)', text: 'What is the difference between DELETE, TRUNCATE, and DROP?', modelAnswer: 'DELETE removes specific rows and can be rolled back. TRUNCATE removes all rows quickly but cannot be rolled back and resets identity columns. DROP completely removes the table structure and its data from the database.', points: ['DML vs DDL', 'Rollback capability', 'Structure removal'], keywords: ['dml', 'ddl', 'rollback', 'structure', 'row', 'commit'] },
  
  // JS/React
  { type: 'Technical (Java/SQL/JS/React)', text: 'Explain the JavaScript Event Loop. What is the difference between microtasks and macrotasks?', modelAnswer: 'The Event Loop handles asynchronous callbacks. Microtasks (Promises, queueMicrotask) have higher priority and are executed before macrotasks (setTimeout, setInterval). The loop checks the call stack, then microtask queue, then macrotask queue.', points: ['Call Stack', 'Microtask priority (Promises)', 'Macrotask (setTimeout)'], keywords: ['stack', 'queue', 'promise', 'settimeout', 'priority', 'asynchronous'] },
  { type: 'Technical (Java/SQL/JS/React)', text: 'What is a closure in JavaScript? Give 3 practical use cases.', modelAnswer: 'A closure is a function that remembers its outer lexical environment even after the outer function has returned. Use cases include data privacy (private variables), currying, and event handlers/callbacks.', points: ['Lexical scoping', 'Data privacy', 'Currying / Partial application'], keywords: ['lexical', 'scope', 'private', 'currying', 'callback', 'environment'] },
  { type: 'Technical (Java/SQL/JS/React)', text: 'Explain the Virtual DOM and React Fiber architecture. Why is reconciliation important?', modelAnswer: 'The Virtual DOM is a lightweight memory representation of the real DOM. Reconciliation compares the new VDOM with the old one to find differences (diffing) and update the real DOM efficiently. React Fiber is a reimplementation of the core algorithm to allow incremental, interruptible rendering.', points: ['Diffing algorithm', 'Efficient updates', 'Interruptible rendering (Fiber)'], keywords: ['diff', 'memory', 'render', 'incremental', 'interruptible', 'efficient'] },
  { type: 'Technical (Java/SQL/JS/React)', text: 'What is the difference between useMemo and useCallback? When should you NOT use them?', modelAnswer: 'useMemo memoizes a computed value, while useCallback memoizes a function reference. You should not use them for cheap calculations or non-expensive renders, as the overhead of memory and comparison can outweigh the benefits.', points: ['Value vs Function', 'Referential equality', 'Performance overhead'], keywords: ['memoize', 'value', 'function', 'reference', 'overhead', 'expensive'] },
  { type: 'Technical (Java/SQL/JS/React)', text: 'Explain how React.lazy and Suspense work for code splitting.', modelAnswer: 'React.lazy allows you to dynamically import a component only when it\'s needed. Suspense is used to wrap the lazy component and provide a fallback UI (like a spinner) while the code is being downloaded.', points: ['Dynamic imports', 'Fallback UI', 'Reducing initial bundle size'], keywords: ['dynamic', 'import', 'fallback', 'bundle', 'spinner', 'download'] },

  // HR
  { type: 'HR & Communication', text: 'Tell me about yourself. Walk me through your resume.', modelAnswer: 'A good answer should provide a brief overview of your education, key skills, most relevant projects or experiences, and why you are interested in this role. Keep it concise and focused on professional achievements.', points: ['Present, Past, Future framework', 'Highlight relevant skills', 'Keep it under 2 minutes'], isHR: true, keywords: ['education', 'project', 'experience', 'skill', 'role', 'interest'] },
  { type: 'HR & Communication', text: 'Why should we hire you over the other candidates?', modelAnswer: 'Focus on your unique combination of skills, your alignment with the company\'s tech stack or culture, and your ability to learn quickly and contribute to the team.', points: ['Unique strengths', 'Cultural fit', 'Value addition'], isHR: true, keywords: ['skill', 'fit', 'culture', 'learn', 'contribute', 'value'] },
  { type: 'HR & Communication', text: 'Describe a challenging project you worked on and how you overcame obstacles.', modelAnswer: 'Use the STAR method (Situation, Task, Action, Result). Describe a specific technical or team challenge, the steps you took to resolve it, and the positive outcome or what you learned.', points: ['STAR method', 'Specific technical detail', 'Focus on your actions'], isHR: true, keywords: ['situation', 'task', 'action', 'result', 'learn', 'overcame'] },
  { type: 'HR & Communication', text: 'Where do you see yourself in 5 years?', modelAnswer: 'Express a desire for growth, taking on more responsibility (like a senior developer or lead role), and a commitment to continuous learning and contributing to impactful projects.', points: ['Ambition and realism', 'Alignment with company path', 'Continuous learning'], isHR: true, keywords: ['growth', 'senior', 'lead', 'learning', 'impact', 'responsibility'] },
  { type: 'HR & Communication', text: 'What is your greatest weakness?', modelAnswer: 'Choose a real but non-fatal weakness, and crucially, explain the actionable steps you are taking to improve it. For example, delegating tasks or public speaking, and how you practice them.', points: ['Honesty without red flags', 'Action plan for improvement', 'Self-awareness'], isHR: true, keywords: ['improve', 'practice', 'working', 'aware', 'step'] },
  { type: 'HR & Communication', text: 'How do you handle pressure and tight deadlines?', modelAnswer: 'Explain your process for prioritization, breaking tasks into smaller chunks, communicating early if there are blockers, and staying calm and focused under stress.', points: ['Prioritization', 'Communication', 'Task breakdown'], isHR: true, keywords: ['prioritize', 'communicate', 'break', 'calm', 'focus'] },
  { type: 'HR & Communication', text: 'Why do you want to join our company?', modelAnswer: 'Show that you have researched the company. Mention specific products, their engineering culture, recent news, or the technologies they use that align with your career goals.', points: ['Company research', 'Alignment of values', 'Specific reasons'], isHR: true, keywords: ['product', 'culture', 'technology', 'goal', 'align', 'research'] },
  { type: 'HR & Communication', text: 'Do you have any questions for us?', modelAnswer: 'Always ask questions! Ask about the day-to-day responsibilities, the team structure, the tech stack, or the biggest challenges the team is currently facing.', points: ['Show interest', 'Ask about the team/tech', 'Clarify role expectations'], isHR: true, keywords: ['team', 'stack', 'challenge', 'responsibility', 'culture'] }
];

export default function MockInterview() {
  const [phase, setPhase] = useState('setup'); // setup, interview, summary
  
  // Setup state
  const [interviewType, setInterviewType] = useState('Technical (Java/SQL/JS/React)');
  const [difficulty, setDifficulty] = useState('Fresher');
  const [companyStyle, setCompanyStyle] = useState('Amazon/Google');
  
  // Interview state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // per question
  
  useEffect(() => {
    let timer;
    if (phase === 'interview' && !showFeedback) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [phase, showFeedback]);

  const startInterview = () => {
    const filtered = QUESTION_BANK.filter(q => q.type === interviewType);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 6);
    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers([]);
    setPhase('interview');
    setTimeElapsed(0);
    setCurrentAnswer('');
    setShowFeedback(false);
  };

  const calculateScore = (answer, question) => {
    if (!answer || answer.trim() === '') return 1;
    const lowerAnswer = answer.toLowerCase();
    const matchCount = question.keywords.filter(k => lowerAnswer.includes(k)).length;
    const percentage = matchCount / question.keywords.length;
    
    if (percentage > 0.7) return 5;
    if (percentage > 0.5) return 4;
    if (percentage > 0.3) return 3;
    if (percentage > 0.1) return 2;
    return 1;
  };

  const submitAnswer = () => {
    const score = calculateScore(currentAnswer, questions[currentIndex]);
    setAnswers(prev => [
      ...prev,
      {
        question: questions[currentIndex],
        userAnswer: currentAnswer,
        score,
        timeTaken: timeElapsed
      }
    ]);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setCurrentAnswer('');
      setShowFeedback(false);
      setTimeElapsed(0);
    } else {
      setPhase('summary');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (phase === 'setup') {
    return (
      <div className="anim-fade" style={{ maxWidth: 600, margin: '0 auto', paddingTop: 20 }}>
        <div className="glass" style={{ padding: 32, borderRadius: 16 }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: '1.5rem' }}>🎯</span> AI Mock Placement Interview
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)' }}>Interview Type</label>
              <select 
                className="input-field" 
                style={{ width: '100%', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }}
                value={interviewType} 
                onChange={e => setInterviewType(e.target.value)}
              >
                <option value="Technical (Java/SQL/JS/React)">Technical (Java/SQL/JS/React)</option>
                <option value="HR & Communication">HR & Communication</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)' }}>Difficulty</label>
              <select 
                className="input-field" 
                style={{ width: '100%', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }}
                value={difficulty} 
                onChange={e => setDifficulty(e.target.value)}
              >
                <option value="Fresher">Fresher</option>
                <option value="Experienced (1-3 yrs)">Experienced (1-3 yrs)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)' }}>Company Style</label>
              <select 
                className="input-field" 
                style={{ width: '100%', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }}
                value={companyStyle} 
                onChange={e => setCompanyStyle(e.target.value)}
              >
                <option value="TCS/Infosys">TCS/Infosys</option>
                <option value="Amazon/Google">Amazon/Google</option>
                <option value="Startup">Startup</option>
              </select>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ marginTop: 16, width: '100%', padding: 16, fontSize: '1.1rem', justifyContent: 'center' }}
              onClick={startInterview}
            >
              <Play size={18} /> Start Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'interview') {
    const question = questions[currentIndex];
    
    return (
      <div className="anim-fade" style={{ maxWidth: 800, margin: '0 auto', paddingTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div className="badge" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
            Q{currentIndex + 1} of {questions.length}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
            <Clock size={16} /> {formatTime(timeElapsed)}
          </div>
        </div>

        <div className="glass" style={{ padding: 32, borderRadius: 16, marginBottom: 24 }}>
          <h3 style={{ fontSize: '1.25rem', lineHeight: 1.6, marginBottom: 24 }}>
            {question.text}
          </h3>

          {!showFeedback ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <textarea
                className="input-field"
                style={{ 
                  width: '100%', 
                  minHeight: 150, 
                  padding: 16, 
                  background: 'var(--surface)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 8, 
                  color: 'var(--text)',
                  resize: 'vertical',
                  lineHeight: 1.5
                }}
                placeholder="Type your answer here... Imagine you are speaking to the interviewer."
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
              />
              <button 
                className="btn btn-primary" 
                style={{ alignSelf: 'flex-end' }}
                onClick={submitAnswer}
                disabled={currentAnswer.trim().length === 0}
              >
                Submit Answer
              </button>
            </div>
          ) : (
            <div className="anim-fade" style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={20} 
                      style={{ 
                        color: star <= answers[answers.length - 1].score ? '#fbbf24' : 'var(--border)',
                        fill: star <= answers[answers.length - 1].score ? '#fbbf24' : 'none'
                      }} 
                    />
                  ))}
                </div>
                <span style={{ fontWeight: 600 }}>Score: {answers[answers.length - 1].score}/5</span>
              </div>
              
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#34d399' }}>
                  <CheckCircle size={16} /> Model Answer
                </h4>
                <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>{question.modelAnswer}</p>
              </div>
              
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#60a5fa' }}>
                  <List size={16} /> Key Points to Cover
                </h4>
                <ul style={{ paddingLeft: 24, margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {question.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {question.isHR && (
                <div className="info-box" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: 16, borderRadius: 8 }}>
                  <strong style={{ color: '#60a5fa', display: 'block', marginBottom: 4 }}>STAR Framework Tip</strong>
                  <span style={{ fontSize: '0.9rem' }}>Structure HR answers using Situation, Task, Action, and Result to provide clear, compelling evidence of your skills.</span>
                </div>
              )}

              <button 
                className="btn btn-primary" 
                style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}
                onClick={nextQuestion}
              >
                {currentIndex + 1 < questions.length ? 'Next Question' : 'Finish Interview'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Summary Phase
  const totalTime = answers.reduce((acc, curr) => acc + curr.timeTaken, 0);
  const avgScore = answers.reduce((acc, curr) => acc + curr.score, 0) / (answers.length || 1);

  return (
    <div className="anim-fade" style={{ maxWidth: 800, margin: '0 auto', paddingTop: 20 }}>
      <div className="glass" style={{ padding: 40, borderRadius: 16, textAlign: 'center' }}>
        <h2 style={{ marginBottom: 32 }}>Interview Summary</h2>
        
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 40, flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12, minWidth: 160 }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fbbf24', marginBottom: 8 }}>{formatTime(totalTime)}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Time</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12, minWidth: 160 }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#34d399', marginBottom: 8 }}>{avgScore.toFixed(1)} <Star size={20} style={{ display: 'inline', color: '#34d399', fill: '#34d399' }} /></div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Average Score</div>
          </div>
        </div>
        
        <div style={{ textAlign: 'left', background: 'var(--surface)', padding: 24, borderRadius: 12, marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1.1rem' }}>Feedback Summary</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
            You completed {answers.length} questions in {interviewType} mode.
            {avgScore >= 4 ? ' Excellent work! You demonstrated strong knowledge and hit most key points.' : 
             avgScore >= 3 ? ' Good effort. Review the model answers to ensure you are covering all required keywords.' : 
             ' This is a great baseline. Focus on incorporating specific technical keywords and structuring your answers clearly.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fb7185', fontSize: '0.95rem' }}>
            <AlertCircle size={16} /> Area to improve: Make sure to mention all key terms highlighted in the model answers.
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          style={{ padding: '12px 24px', fontSize: '1.1rem' }}
          onClick={() => setPhase('setup')}
        >
          <RotateCcw size={18} /> Retake Interview
        </button>
      </div>
    </div>
  );
}
