import jwt from 'jsonwebtoken';
import connectToDatabase from '../lib/db.js';
import Progress from '../models/Progress.js';
import { getJwtSecret, applyCors } from '../lib/security.js';

export default async function handler(req, res) {
  if (!applyCors(req, res)) return res.status(403).json({ error: 'Forbidden' });
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

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

    await connectToDatabase();
    
    // Find or create progress for user
    let progress = await Progress.findOne({ userId: decoded.userId });
    if (!progress) {
      progress = await Progress.create({ userId: decoded.userId });
    }

    return res.status(200).json({ success: true, progress });

  } catch (error) {
    console.error('Progress get error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
