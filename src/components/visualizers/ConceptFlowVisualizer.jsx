import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles, Code2, ArrowRight } from 'lucide-react';

export default function ConceptFlowVisualizer({ topic, nativeText }) {
  const [step, setStep] = useState(0);

  if (!topic) return null;

  // Split summary into clean bullet sentences for steps
  const summarySentences = (topic.summary || '')
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 15);

  const codeLines = (topic.code || '')
    .split('\n')
    .filter(l => l.trim().length > 0 && !l.trim().startsWith('//') && !l.trim().startsWith('/*'));

  // Build steps automatically
  const steps = [
    {
      title: `1. Core Concept Overview`,
      text: summarySentences[0] || topic.summary?.slice(0, 150),
      badge: 'badge-sky',
      codeSnippet: codeLines[0] || null,
      type: 'concept'
    }
  ];

  if (nativeText && nativeText !== topic.summary) {
    steps.push({
      title: `2. Simplified Breakdown`,
      text: nativeText,
      badge: 'badge-amber',
      codeSnippet: codeLines[1] || codeLines[0] || null,
      type: 'mechanics'
    });
  } else {
    steps.push({
      title: `2. Deep Mechanics & Behavior`,
      text: summarySentences[1] || summarySentences[0] || 'Understand how the runtime executes this logic step-by-step.',
      badge: 'badge-amber',
      codeSnippet: codeLines[1] || codeLines[0] || null,
      type: 'mechanics'
    });
  }

  steps.push({
    title: `3. Interview & Placement Gotchas`,
    text: summarySentences[2] || 'Always remember performance implications, edge cases, and time/space complexity during interview discussions.',
    badge: 'badge-emerald',
    codeSnippet: codeLines[2] || codeLines[1] || null,
    type: 'interview'
  });

  if (summarySentences.length > 3) {
    steps.push({
      title: `4. Advanced Usage & Edge Cases`,
      text: summarySentences.slice(3).join(' '),
      badge: 'badge-violet',
      codeSnippet: codeLines[3] || null,
      type: 'advanced'
    });
  }

  const current = steps[step] || steps[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Node Progress Pipeline */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--glass-border)' }}>
        {steps.map((s, idx) => (
          <React.Fragment key={idx}>
            <button
              onClick={() => setStep(idx)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 'var(--r-pill)',
                background: step === idx ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)',
                border: step === idx ? '1px solid var(--amber)' : '1px solid var(--glass-border)',
                color: step === idx ? '#fbbf24' : 'var(--text-muted)',
                fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: step === idx ? 'var(--amber)' : 'rgba(255,255,255,0.1)', color: step === idx ? '#0f172a' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>
                {idx + 1}
              </span>
              <span>{s.type.toUpperCase()}</span>
            </button>
            {idx < steps.length - 1 && (
              <ArrowRight size={14} style={{ color: step > idx ? 'var(--amber)' : 'var(--text-muted)', opacity: 0.5 }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Visual Card */}
      <div className="glass anim-fade" style={{ padding: 20, borderLeft: '4px solid var(--amber)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} style={{ color: 'var(--amber)' }} />
            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>{current.title}</span>
          </div>
          <span className={`badge ${current.badge}`}>{current.type}</span>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
          {current.text}
        </p>

        {current.codeSnippet && (
          <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--r-md)', border: '1px solid var(--glass-border)', fontFamily: 'var(--mono)', fontSize: '0.78rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto' }}>
            <Code2 size={14} style={{ flexShrink: 0, color: 'var(--amber)' }} />
            <code>{current.codeSnippet}</code>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Step {step + 1} of {steps.length}
        </span>

        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.75rem' }} disabled={step === 0} onClick={() => setStep(s => s - 1)}>
            <ChevronLeft size={14} /> Back
          </button>
          <button className="btn btn-amber" style={{ padding: '6px 14px', fontSize: '0.75rem' }} disabled={step === steps.length - 1} onClick={() => setStep(s => s + 1)}>
            Next Step <ChevronRight size={14} />
          </button>
          <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={() => setStep(0)}>
            <RotateCcw size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
