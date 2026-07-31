import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Database, AlertTriangle, CheckCircle2, Table } from 'lucide-react';
import initSqlJs from 'sql.js';

const SEED_SQL = `
CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  track VARCHAR(30),
  score INT
);

INSERT INTO students VALUES (1, 'Aishwarya', 'Java', 92);
INSERT INTO students VALUES (2, 'Karan', 'SQL', 88);
INSERT INTO students VALUES (3, 'Priyanka', 'JavaScript', 95);
INSERT INTO students VALUES (4, 'Rahul', 'React', 84);
INSERT INTO students VALUES (5, 'Sneha', 'Communication', 90);

CREATE TABLE offers (
  id INT PRIMARY KEY,
  student_id INT,
  company VARCHAR(50),
  ctc_lpa DECIMAL(4,2)
);

INSERT INTO offers VALUES (101, 1, 'Oracle India', 16.50);
INSERT INTO offers VALUES (102, 2, 'Infosys BPM', 9.20);
INSERT INTO offers VALUES (103, 3, 'TCS Digital', 11.00);
`;

const DEFAULT_QUERY = `SELECT s.name, s.track, o.company, o.ctc_lpa
FROM students s
INNER JOIN offers o ON s.id = o.student_id
WHERE s.score >= 85
ORDER BY o.ctc_lpa DESC;`;

export default function SQLSandbox({ initialQuery }) {
  const [db, setDb]           = useState(null);
  const [query, setQuery]     = useState(initialQuery || DEFAULT_QUERY);
  const [results, setResults] = useState(null);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const SQL = await initSqlJs({
          locateFile: file => `https://sql.js.org/dist/${file}`
        });
        const instance = new SQL.Database();
        instance.run(SEED_SQL);
        if (alive) {
          setDb(instance);
          const res = instance.exec(initialQuery || DEFAULT_QUERY);
          setResults(res);
          setLoading(false);
        }
      } catch (e) {
        if (alive) { setError(e.message); setLoading(false); }
      }
    })();
    return () => { alive = false; };
  }, []);

  const runQuery = () => {
    if (!db) return;
    setError(null);
    try {
      const res = db.exec(query);
      setResults(res);
    } catch (e) {
      setError(e.message);
      setResults(null);
    }
  };

  const resetDB = () => {
    if (!db) return;
    try {
      db.run("DROP TABLE IF EXISTS students; DROP TABLE IF EXISTS offers;");
      db.run(SEED_SQL);
      setQuery(initialQuery || DEFAULT_QUERY);
      const res = db.exec(initialQuery || DEFAULT_QUERY);
      setResults(res);
      setError(null);
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="glass sandbox-card" style={{ marginTop: 20 }}>
      <div className="sandbox-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Database size={18} style={{ color: '#38bdf8' }} />
          <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Live SQL Execution Sandbox</span>
          <span className="badge badge-sky" style={{ fontSize: '0.62rem' }}>SQLite Engine</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={resetDB}>
            <RotateCcw size={13} /> Reset DB
          </button>
          <button className="btn btn-emerald" style={{ padding: '6px 16px', fontSize: '0.78rem' }} onClick={runQuery} disabled={loading || !db}>
            <Play size={13} /> Run Query
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>
          SQL Query (Tables: <span style={{ color: '#38bdf8' }}>students</span>, <span style={{ color: '#38bdf8' }}>offers</span>)
        </label>
        <textarea
          className="glass-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.84rem',
            minHeight: 100,
            resize: 'vertical',
          }}
        />
      </div>

      {loading && (
        <div className="loading-pulse" style={{ padding: '20px 0', justifyContent: 'center' }}>
          <div className="spinner" />
          Loading in-browser SQLite engine…
        </div>
      )}

      {error && (
        <div className="info-box error" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
          <AlertTriangle size={15} style={{ flexShrink: 0 }} />
          <span>SQL Error: {error}</span>
        </div>
      )}

      {results && results.length > 0 && (
        <div className="sandbox-results anim-fade" style={{ marginTop: 14 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Table size={13} /> Query Results ({results[0].values.length} rows)
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                  {results[0].columns.map(col => (
                    <th key={col} style={{ padding: '10px 14px', textAlign: 'left', color: '#38bdf8', fontWeight: 700 }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results[0].values.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    {row.map((val, j) => (
                      <td key={j} style={{ padding: '9px 14px', color: 'var(--text-secondary)' }}>
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
