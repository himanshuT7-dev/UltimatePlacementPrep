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
    const { email, password, name } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password minimum length (matches User schema)
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Optional name: must be a string, trimmed, capped at 60 chars
    let normalizedName;
    if (name !== undefined) {
      if (typeof name !== 'string') {
        return res.status(400).json({ error: 'Name must be a string' });
      }
      normalizedName = name.trim();
      if (normalizedName.length > 60) {
        return res.status(400).json({ error: 'Name must be 60 characters or fewer' });
      }
    }

    // Rate limiting
    if (!rateLimit('signup:' + getClientIp(req), 5, 60000).allowed) {
      return res.status(429).json({ error: 'Too many attempts' });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      name: normalizedName
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });

  } catch (error) {
    console.error('Signup error:', error);
    if (error?.name === 'ValidationError') {
      const firstMsg = Object.values(error.errors || {})[0]?.message;
      return res.status(400).json({ error: firstMsg || 'Invalid input' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
