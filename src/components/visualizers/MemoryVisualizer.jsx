import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

export default function MemoryVisualizer({ steps = [] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

  // Derive state from steps up to currentStep
  const { stack, heap } = useMemo(() => {
    const currentStack = [];
    const currentHeap = {};

    for (let i = 0; i <= currentStep; i++) {
      const step = steps[i];
      if (!step) continue;

      switch (step.action) {
        case 'push-stack':
          currentStack.push({ ...step, id: `stack-${i}` });
          break;
        case 'pop-stack':
          currentStack.pop();
          break;
        case 'alloc-heap':
          currentHeap[step.ref] = { ...step, id: `heap-${step.ref}` };
          break;
        case 'gc':
          if (step.targets) {
            step.targets.forEach(target => {
              delete currentHeap[target];
            });
          }
          break;
        default:
          break;
      }
    }
    return { stack: currentStack, heap: Object.values(currentHeap) };
  }, [steps, currentStep]);

  // Handle Autoplay
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1500); // 1.5s per step
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  // Update SVG Reference Lines
  useEffect(() => {
    if (!containerRef.current) return;

    let frameId;
    let lastLinesRef = null;

    const computeLines = () => {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLines = [];

      stack.forEach((item) => {
        if (item.type === 'reference' && item.ref) {
          const stackEl = document.getElementById(item.id);
          const heapEl = document.getElementById(`heap-${item.ref}`);

          if (stackEl && heapEl) {
            const sRect = stackEl.getBoundingClientRect();
            const hRect = heapEl.getBoundingClientRect();

            // Calculate relative coordinates with clean card boundary offsets
            const x1 = sRect.right - containerRect.left - 2;
            const y1 = sRect.top + sRect.height / 2 - containerRect.top;
            const x2 = hRect.left - containerRect.left - 4;
            const y2 = hRect.top + hRect.height / 2 - containerRect.top;

            newLines.push({ id: `${item.id}-${item.ref}`, x1, y1, x2, y2 });
          }
        }
      });
      return newLines;
    };

    const loop = () => {
      const next = computeLines();
      const prev = lastLinesRef;
      // Only call setLines when the coordinates actually changed (e.g. during
      // the card entrance animations); once stable this stops re-rendering.
      const changed =
        !prev ||
        prev.length !== next.length ||
        prev.some((l, i) =>
          l.x1 !== next[i].x1 || l.y1 !== next[i].y1 ||
          l.x2 !== next[i].x2 || l.y2 !== next[i].y2
        );
      if (changed) {
        lastLinesRef = next;
        setLines(next);
      }
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [stack, heap]);

  const handleNext = () => setCurrentStep(p => Math.min(steps.length - 1, p + 1));
  const handlePrev = () => setCurrentStep(p => Math.max(0, p - 1));
  const handleReset = () => setCurrentStep(0);

  return (
    <div className="memory-visualizer" style={{
      display: 'flex', flexDirection: 'column', gap: 16,
      background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 'var(--r-lg)',
      border: '1px solid var(--glass-border)'
    }}>
      <style>{`
        .mem-container {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          min-height: 300px;
        }
        .mem-section {
          background: rgba(14, 19, 32, 0.6);
          border: 1px solid var(--glass-border);
          border-radius: var(--r-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
          z-index: 1;
        }
        .mem-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
          text-align: center;
        }
        .stack-list {
          display: flex;
          flex-direction: column-reverse;
          gap: 8px;
          flex: 1;
          justify-content: flex-start;
        }
        .heap-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-content: flex-start;
          flex: 1;
        }
        .stack-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 10px 12px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 0.8rem;
          color: #e2e8f0;
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .stack-item.frame {
          border-left: 3px solid #8b5cf6;
          background: rgba(139, 92, 246, 0.1);
        }
        .stack-item.variable {
          border-left: 3px solid #10b981;
        }
        .stack-item.reference {
          border-left: 3px solid #f59e0b;
        }
        .heap-obj {
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(14, 165, 233, 0.3);
          padding: 12px;
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.8rem;
          color: #e0f2fe;
          animation: pulseGlow 0.5s ease-out forwards;
          min-width: 120px;
          text-align: center;
          position: relative;
          z-index: 2;
        }
        .heap-addr {
          font-size: 0.65rem;
          color: #38bdf8;
          margin-top: 4px;
        }
        .svg-lines {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          z-index: 10;
        }
        .ref-line {
          stroke: #f59e0b;
          stroke-width: 2;
          stroke-dasharray: 4 4;
          animation: dashMove 1s linear infinite;
        }
        .mem-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid var(--glass-border);
        }
        .mem-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          transition: all 0.2s;
        }
        .mem-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .mem-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .mem-btn.active {
          background: rgba(245, 158, 11, 0.2);
          border-color: #f59e0b;
          color: #f59e0b;
        }
        .step-highlight {
          margin-bottom: 12px;
          padding: 8px 12px;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid #f59e0b;
          border-radius: 6px;
          color: #fcd34d;
          font-family: monospace;
          font-size: 0.85rem;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.2);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0% { opacity: 0; transform: scale(0.9); box-shadow: 0 0 0 rgba(14, 165, 233, 0); }
          50% { box-shadow: 0 0 15px rgba(14, 165, 233, 0.5); }
          100% { opacity: 1; transform: scale(1); box-shadow: 0 0 5px rgba(14, 165, 233, 0.2); }
        }
        @keyframes dashMove {
          to { stroke-dashoffset: -8; }
        }
      `}</style>

      {/* Detailed Teacher Explanation Card */}
      <div style={{
        padding: '14px 18px',
        background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(14,19,32,0.8) 100%)',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: 'var(--r-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
              Step {currentStep + 1} of {steps.length}
            </span>
            <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fbbf24' }}>
              {steps[currentStep]?.title || (
                steps[currentStep]?.action === 'push-stack' ? `Push Frame: ${steps[currentStep]?.name}` :
                steps[currentStep]?.action === 'alloc-heap' ? `Allocate Heap Memory: ${steps[currentStep]?.name}` :
                steps[currentStep]?.action === 'pop-stack' ? `Stack Frame Popped (Method Return)` :
                steps[currentStep]?.action === 'gc' ? `Garbage Collector Sweep` : `Execution Step`
              )}
            </span>
          </div>

          {steps[currentStep]?.codeSnippet && (
            <code style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(0,0,0,0.4)', borderRadius: 4, color: '#38bdf8', fontFamily: 'monospace' }}>
              {steps[currentStep]?.codeSnippet}
            </code>
          )}
        </div>

        <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {steps[currentStep]?.explanation || (
            steps[currentStep]?.action === 'push-stack' ? `A new stack frame or local variable entry "${steps[currentStep]?.name}" is allocated on the Call Stack. Stack memory is fast, thread-private, and auto-cleared when methods complete.` :
            steps[currentStep]?.action === 'alloc-heap' ? `Memory for "${steps[currentStep]?.name}" is dynamically allocated on the Heap at address ${steps[currentStep]?.address || '0x7f'}. Heap objects persist across method returns until Garbage Collection.` :
            steps[currentStep]?.action === 'pop-stack' ? `Method execution finished. The top stack frame is popped off the Call Stack, destroying all local primitive variables and reference pointers.` :
            `Garbage Collection (GC) sweeps unreferenced Heap objects to free system RAM.`
          )}
        </p>
      </div>

      <div className="mem-container" ref={containerRef}>
        <svg className="svg-lines">
          {lines.map((line) => (
            <g key={line.id}>
              <path
                d={`M ${line.x1} ${line.y1} C ${line.x1 + 35} ${line.y1}, ${line.x2 - 35} ${line.y2}, ${line.x2} ${line.y2}`}
                fill="none"
                className="ref-line"
              />
              <circle cx={line.x1} cy={line.y1} r="3" fill="#f59e0b" />
              <circle cx={line.x2} cy={line.y2} r="3" fill="#38bdf8" />
            </g>
          ))}
        </svg>

        {/* Stack */}
        <div className="mem-section">
          <div className="mem-title">Call Stack</div>
          <div className="stack-list">
            {stack.map((item) => (
              <div key={item.id} id={item.id} className={`stack-item ${item.type || ''}`}>
                <span>{item.name}</span>
                {item.value && <span style={{ color: '#10b981', fontWeight: 700 }}>{item.value}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Heap */}
        <div className="mem-section">
          <div className="mem-title">Heap</div>
          <div className="heap-grid">
            {heap.map((obj) => (
              <div key={obj.id} id={obj.id} className="heap-obj">
                <div>{obj.name}</div>
                {obj.address && <div className="heap-addr">{obj.address}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mem-controls">
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Step {currentStep + 1} of {steps.length}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="mem-btn" onClick={handleReset} disabled={currentStep === 0}>
            <RotateCcw size={14} /> Reset
          </button>
          <button className="mem-btn" onClick={handlePrev} disabled={currentStep === 0}>
            <ChevronLeft size={14} /> Back
          </button>
          <button 
            className={`mem-btn ${isPlaying ? 'active' : ''}`} 
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentStep === steps.length - 1}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />} 
            {isPlaying ? 'Pause' : 'Auto Play'}
          </button>
          <button className="mem-btn" onClick={handleNext} disabled={currentStep === steps.length - 1}>
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
