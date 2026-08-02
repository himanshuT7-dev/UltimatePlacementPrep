import jwt from 'jsonwebtoken';
import connectToDatabase from '../lib/db.js';
import Progress from '../models/Progress.js';
import { getJwtSecret, applyCors, rateLimit, getClientIp } from '../lib/security.js';

// Whitelist of updatable top-level schema paths (matches api/models/Progress.js).
// Anything not listed here is ignored and never written to the database.
const ALLOWED_FIELDS = [
  'completedTopics',
  'masteryScore',
  'mistakeLog',
  'preparedModeUnlocked',
  'streakDays',
  'lastActiveDate',
  'xp',
  'dailyActivity',
  'quizHistory',
  'reviews',
  'studyPlan',
  'planStartDate'
];

export default async function handler(req, res) {
  if (!applyCors(req, res)) return res.status(403).json({ error: 'Forbidden' });
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, getJwtSecret());
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Rate limit lightly (30/min per IP)
    if (!rateLimit('progress:' + getClientIp(req), 30, 60000).allowed) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    // Mass-assignment protection: keep ONLY keys present in ALLOWED_FIELDS,
    // dropping null/undefined values. Unknown/immutable keys are never applied.
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const updates = {};
    for (const key of Object.keys(body)) {
      if (ALLOWED_FIELDS.includes(key) && body[key] != null) {
        updates[key] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No data provided' });
    }

    await connectToDatabase();
    
    // We only update fields provided in the body, using $set
    // We don't overwrite the whole document unless we want to, but mongoose updateOne handles this.
    const progress = await Progress.findOneAndUpdate(
      { userId: decoded.userId },
      { $set: updates },
      { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, progress });

  } catch (error) {
    console.error('Progress update error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
