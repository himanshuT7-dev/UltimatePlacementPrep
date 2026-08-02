import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.join(__dirname, 'src', 'data', 'tracks');

const app = express();
// Restrict CORS to localhost dev origins only
app.use(cors({ origin: [/^http:\/\/localhost:\d+$/] }));
app.use(express.json({ limit: '50mb' }));

const ADMIN_SECRET = process.env.ADMIN_TOKEN || crypto.randomBytes(24).toString('hex');

// One-time warning to the operator when ADMIN_TOKEN is not configured.
if (!process.env.ADMIN_TOKEN) {
  const showToken = process.env.NODE_ENV !== 'production';
  console.warn(
    showToken
      ? `[Admin CMS] ADMIN_TOKEN is not set. Generated a temporary token for this run: ${ADMIN_SECRET}. Set ADMIN_TOKEN in your environment for a stable secret.`
      : '[Admin CMS] ADMIN_TOKEN is not set. Using a random secret; set ADMIN_TOKEN in your environment.'
  );
}

app.post('/api/save-track', (req, res) => {
  // Authentication Check
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing Admin Token' });
  }

  const { trackId, trackData } = req.body;
  if (!trackId || !trackData) return res.status(400).json({ error: 'Missing track data' });

  // Input Validation (Parameterized/schema check concept)
  if (typeof trackId !== 'string' || !trackId.match(/^[a-z]+$/)) {
    return res.status(400).json({ error: 'Invalid trackId format' });
  }

  // Prevent arbitrary code injection by strictly stringifying the data
  // Even if someone types JS code into a summary field, it gets saved as a string literal.
  const safeData = JSON.stringify(trackData, null, 2);

  // Map track IDs to their filenames and export names
  const TRACK_MAP = {
    'java': { file: 'java.js', exportName: 'JAVA_TRACK' },
    'sql': { file: 'sql.js', exportName: 'SQL_TRACK' },
    'javascript': { file: 'javascript.js', exportName: 'JS_TRACK' },
    'react': { file: 'react.js', exportName: 'REACT_TRACK' },
    'communication': { file: 'communication.js', exportName: 'COMMUNICATION_TRACK' }
  };

  const trackInfo = TRACK_MAP[trackId];
  if (!trackInfo) return res.status(400).json({ error: 'Invalid track ID' });

  const filePath = path.join(SRC_DIR, trackInfo.file);
  
  // Format the data as a JS module export using the sanitized JSON
  const fileContent = `export const ${trackInfo.exportName} = ${safeData};\n`;

  try {
    fs.writeFileSync(filePath, fileContent, 'utf8');
    res.json({ success: true, message: `Saved ${trackInfo.file}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to write file' });
  }
});

const PORT = 3001;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Admin CMS Server running on http://127.0.0.1:${PORT}`);
});
