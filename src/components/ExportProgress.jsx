import React from 'react';
import { Download, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TRACKS } from '../data/index.js';

export default function ExportProgress() {
  const { user, progress } = useAuth();

  const handleExport = () => {
    const totalTopics = TRACKS.reduce((sum, t) => sum + (t.totalTopics || t.modules?.flatMap(m => m.topics)?.length || 0), 0);
    const completedCount = progress?.completedTopics?.length || 0;
    
    // HTML structure for the report
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${user?.name || 'Student'}'s Progress Report</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
            background: #fff;
          }
          h1, h2, h3 { color: #111; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
          .stats-grid { display: flex; gap: 20px; margin-bottom: 40px; justify-content: center; }
          .stat-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; text-align: center; min-width: 150px; }
          .stat-card .num { font-size: 24px; font-weight: bold; color: #f59e0b; display: block; }
          .stat-card .label { font-size: 14px; color: #666; text-transform: uppercase; margin-top: 5px; display: block; }
          .section { margin-bottom: 40px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f9f9f9; font-weight: bold; }
          .completed { color: #10b981; font-weight: bold; }
          .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Ultimate Placement Preparation</h1>
          <h2>Progress Report</h2>
          <p>Student: <strong>${user?.name || 'Guest'}</strong></p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="num">${completedCount} / ${totalTopics}</span>
            <span class="label">Topics Completed</span>
          </div>
          <div class="stat-card">
            <span class="num">${progress?.masteryScore || 0}%</span>
            <span class="label">Mastery Score</span>
          </div>
        </div>

        <div class="section">
          <h3>Curriculum Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>Track</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${TRACKS.map(track => {
                const trackTopics = track.modules?.flatMap(m => m.topics) || [];
                const trackCompleted = trackTopics.filter(t => progress?.completedTopics?.includes(t.id)).length;
                const trackTotal = trackTopics.length;
                return `
                  <tr>
                    <td><strong>${track.label}</strong><br><small>${track.description}</small></td>
                    <td>${trackCompleted} / ${trackTotal} completed</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="footer">
          Generated automatically by Ultimate Placement Preparation platform.
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 500);
          }
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  };

  return (
    <button
      onClick={handleExport}
      className="btn btn-ghost"
      title="Export Progress as PDF"
      style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}
    >
      <Download size={14} /> Export PDF
    </button>
  );
}
