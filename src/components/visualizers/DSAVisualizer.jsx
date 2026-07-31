import React, { useState } from 'react';

export default function DSAVisualizer({ dsType, steps }) {
  const [step, setStep] = useState(0);

  const renderArray = () => {
    const arr = [10, 25, 34, 45, 50, 75, 89];
    const left = 0;
    const right = 6;
    const mid = 3;

    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h4>Binary Search Array Visualization</h4>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', margin: '20px 0' }}>
          {arr.map((val, idx) => {
            let bgColor = '#333';
            let color = 'white';
            if (idx === mid) bgColor = 'var(--amber)';
            else if (idx >= left && idx <= right) bgColor = 'var(--emerald)';
            else color = '#666';

            return (
              <div key={idx} style={{ position: 'relative' }}>
                <div style={{ 
                  width: '50px', height: '50px', backgroundColor: bgColor, color, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  borderRadius: '4px', fontSize: '1.2rem', fontWeight: 'bold' 
                }}>
                  {val}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>{idx}</div>
                {idx === left && <div style={{ color: 'var(--violet)', fontWeight: 'bold' }}>↑ L</div>}
                {idx === right && <div style={{ color: 'var(--violet)', fontWeight: 'bold' }}>↑ R</div>}
                {idx === mid && <div style={{ color: 'var(--amber)', fontWeight: 'bold' }}>↑ M</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLinkedList = () => {
    const nodes = [10, 20, 30, null];
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h4>Linked List Visualization</h4>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
          {nodes.map((val, idx) => (
            <React.Fragment key={idx}>
              <div style={{ display: 'flex', border: '1px solid #555', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ padding: '10px 15px', backgroundColor: '#333' }}>{val !== null ? val : 'NULL'}</div>
                {val !== null && <div style={{ padding: '10px 5px', backgroundColor: '#444', borderLeft: '1px solid #555' }}>•</div>}
              </div>
              {idx < nodes.length - 1 && (
                <div style={{ margin: '0 10px', color: 'var(--emerald)' }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderTree = () => {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h4>Binary Search Tree Visualization</h4>
        <div style={{ margin: '20px 0', position: 'relative', height: '150px' }}>
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
            <line x1="50%" y1="20px" x2="35%" y2="80px" stroke="#555" strokeWidth="2" />
            <line x1="50%" y1="20px" x2="65%" y2="80px" stroke="#555" strokeWidth="2" />
          </svg>
          <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1, 
            width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--amber)', color: 'black', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            50
          </div>
          <div style={{ position: 'absolute', top: '70px', left: '35%', transform: 'translateX(-50%)', zIndex: 1, 
            width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#333', border: '2px solid var(--emerald)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            30
          </div>
          <div style={{ position: 'absolute', top: '70px', left: '65%', transform: 'translateX(-50%)', zIndex: 1, 
            width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#333', border: '2px solid var(--emerald)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            70
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {dsType === 'array' && renderArray()}
      {dsType === 'linkedlist' && renderLinkedList()}
      {dsType === 'tree' && renderTree()}
      {(!dsType || !['array', 'linkedlist', 'tree'].includes(dsType)) && renderArray()}
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        <button className="btn btn-outline" onClick={() => setStep(s => Math.max(0, s - 1))}>Step Back</button>
        <button className="btn btn-primary">Play</button>
        <button className="btn btn-outline" onClick={() => setStep(s => s + 1)}>Step Forward</button>
        <button className="btn btn-outline" onClick={() => setStep(0)}>Reset</button>
      </div>
    </div>
  );
}
