import jwt from 'jsonwebtoken';
import connectToDatabase from '../lib/db.js';
import User from '../models/User.js';
import { getJwtSecret, applyCors } from '../lib/security.js';

export default async function handler(req, res) {
  if (!applyCors(req, res)) return res.status(403).json({ error: 'Forbidden' });
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, getJwtSecret());
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }

    await connectToDatabase();
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: { id: user._id, email: user.email, name: user.name }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
