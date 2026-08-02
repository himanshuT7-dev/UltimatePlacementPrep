import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../lib/db.js';
import User from '../models/User.js';
import { getJwtSecret, applyCors, rateLimit, getClientIp } from '../lib/security.js';

export default async function handler(req, res) {
  // CORS
  if (!applyCors(req, res)) return res.status(403).json({ error: 'Forbidden' });
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Validate inputs BEFORE querying (prevents NoSQL operator injection)
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Rate limiting
    if (!rateLimit('login:' + getClientIp(req), 10, 60000).allowed) {
      return res.status(429).json({ error: 'Too many attempts' });
    }

    await connectToDatabase();

    // Include the password explicitly because it has select: false in schema
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
