import React, { useState, useEffect } from 'react';

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

const orders = [
  { oid: 101, uid: 1, amount: 250 },
  { oid: 102, uid: 2, amount: 400 },
  { oid: 103, uid: 4, amount: 150 }
];

const JOIN_TYPES = ['INNER', 'LEFT', 'RIGHT', 'FULL OUTER'];

export default function JoinVisualizer() {
  const [joinType, setJoinType] = useState('INNER');
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Compute matched pairs based on cross product and filter logic
  const pairs = [];
  const uLen = users.length;
  const oLen = orders.length;

  // Build full set of operations based on join type
  useEffect(() => {
    // Basic step logic simulation
  }, [joinType]);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep((s) => (s + 1) % 10); // Dummy max steps, to be replaced by actual step logic
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const generateResults = () => {
    let results = [];
    if (joinType === 'INNER') {
      users.forEach(u => {
        orders.forEach(o => {
          if (u.id === o.uid) results.push({ ...u, ...o });
        });
      });
    } else if (joinType === 'LEFT') {
      users.forEach(u => {
        let matched = false;
        orders.forEach(o => {
          if (u.id === o.uid) { results.push({ ...u, ...o }); matched = true; }
        });
        if (!matched) results.push({ ...u, oid: null, uid: null, amount: null });
      });
    } else if (joinType === 'RIGHT') {
      orders.forEach(o => {
        let matched = false;
        users.forEach(u => {
          if (u.id === o.uid) { results.push({ ...u, ...o }); matched = true; }
        });
        if (!matched) results.push({ id: null, name: null, ...o });
      });
    } else if (joinType === 'FULL OUTER') {
       users.forEach(u => {
        let matched = false;
        orders.forEach(o => {
          if (u.id === o.uid) { results.push({ ...u, ...o }); matched = true; }
        });
        if (!matched) results.push({ ...u, oid: null, uid: null, amount: null });
      });
      orders.forEach(o => {
        let matched = false;
        users.forEach(u => {
          if (u.id === o.uid) matched = true;
        });
        if (!matched) results.push({ id: null, name: null, ...o });
      });
    }
    return results;
  };

  const results = generateResults();

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {JOIN_TYPES.map(type => (
          <button
            key={type}
            className={`btn ${joinType === type ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setJoinType(type); setStep(0); setIsPlaying(false); }}
          >
            {type}
          </button>
        ))}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
        <div style={{ flex: 1 }} className="glass">
          <h4 style={{ color: 'var(--emerald)' }}>Users (Table A)</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th>id</th><th>name</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td><td>{u.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ flex: 1 }} className="glass">
          <h4 style={{ color: 'var(--violet)' }}>Orders (Table B)</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th>oid</th><th>uid</th><th>amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.oid}>
                  <td>{o.oid}</td><td>{o.uid}</td><td>{o.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '20px' }} className="glass anim-fade">
        <h4 style={{ color: 'var(--amber)' }}>Result</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th>id</th><th>name</th><th>oid</th><th>uid</th><th>amount</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className="anim-fade">
                <td>{r.id !== null ? r.id : 'NULL'}</td>
                <td>{r.name !== null ? r.name : 'NULL'}</td>
                <td>{r.oid !== null ? r.oid : 'NULL'}</td>
                <td>{r.uid !== null ? r.uid : 'NULL'}</td>
                <td>{r.amount !== null ? r.amount : 'NULL'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button className="btn btn-outline" onClick={() => setStep(s => Math.max(0, s - 1))}>Step Back</button>
        <button className="btn btn-primary" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button className="btn btn-outline" onClick={() => setStep(s => s + 1)}>Step Forward</button>
        <button className="btn btn-outline" onClick={() => { setStep(0); setIsPlaying(false); }}>Reset</button>
      </div>
    </div>
  );
}
