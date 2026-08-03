import React from 'react';
import { Zap } from 'lucide-react';
import MemoryVisualizer from './MemoryVisualizer';
import JoinVisualizer from './JoinVisualizer';
import DSAVisualizer from './DSAVisualizer';
import ConceptFlowVisualizer from './ConceptFlowVisualizer';

export default function InteractiveVisualizer({ topic, nativeText }) {
  if (!topic) return null;

  // Custom visualizer attached to topic
  if (topic.visualizer) {
    const { engine, title, steps, dsType } = topic.visualizer;

    if (engine === 'memory') {
      return (
        <div className="glass anim-fade" style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
          <h3 style={{ marginBottom: 16, color: 'var(--amber)', fontSize: '1.1rem' }}>{title}</h3>
          <MemoryVisualizer steps={steps} />
        </div>
      );
    }

    if (engine === 'sql-join') {
      return (
        <div className="glass anim-fade" style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
          <h3 style={{ marginBottom: 16, color: 'var(--amber)', fontSize: '1.1rem' }}>{title}</h3>
          <JoinVisualizer steps={steps} />
        </div>
      );
    }

    if (engine === 'dsa') {
      return (
        <div className="glass anim-fade" style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
          <h3 style={{ marginBottom: 16, color: 'var(--amber)', fontSize: '1.1rem' }}>{title}</h3>
          <DSAVisualizer steps={steps} dsType={dsType} />
        </div>
      );
    }
  }

  // Universal dynamic Concept Flow visualizer fallback for ALL subjects/topics
  return (
    <div className="glass anim-fade" style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
      <h3 style={{ marginBottom: 16, color: 'var(--amber)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Zap size={18} /> Interactive Concept Flow & Execution Breakdown
      </h3>
      <ConceptFlowVisualizer topic={topic} nativeText={nativeText} />
    </div>
  );
}
