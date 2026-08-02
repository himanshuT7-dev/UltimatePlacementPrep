import { metrics } from './gemini.js';
import { applyCors } from './lib/security.js';

export default function handler(req, res) {
  if (!applyCors(req, res)) return res.status(403).json({ error: 'Forbidden' });
  if (req.method === 'OPTIONS') return res.status(200).end();

  res.setHeader('Cache-Control', 'no-store');

  const uptimeMs = Date.now() - (metrics?.startedAt || Date.now());
  const uptimeSeconds = Math.floor(uptimeMs / 1000);
  const failoverRate = metrics.totalCalls > 0
    ? ((metrics.failovers / metrics.totalCalls) * 100).toFixed(1) + '%'
    : '0.0%';

  const providerList = Object.entries(metrics.providers).map(([name, data]) => ({
    name,
    status: data.lastUsed ? 'ACTIVE' : 'STANDBY',
    calls: data.calls,
    errors: data.errors,
    lastUsed: data.lastUsed || null
  }));

  return res.status(200).json({
    status: metrics.totalErrors < metrics.totalCalls || metrics.totalCalls === 0 ? 'healthy' : 'degraded',
    uptimeSeconds,
    totalCalls: metrics.totalCalls,
    totalErrors: metrics.totalErrors,
    failoverRate,
    providers: providerList
  });
}
