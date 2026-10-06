import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BUNDLED_DB = path.join(__dirname, '..', 'data', 'db.json');
let DB_FILE = BUNDLED_DB;

// If running in Netlify Functions, Vercel, or AWS Lambda, use writable /tmp
if (process.env.NETLIFY || process.env.VERCEL || process.env.LAMBDA_TASK_ROOT) {
  DB_FILE = path.join('/tmp', 'cineverse_db.json');
}

let inMemoryCache = null;

let INITIAL_DATA = { movies: [], showtimes: [], snacks: [], bookings: [], theaters: [] };
try {
  if (fs.existsSync(BUNDLED_DB)) {
    INITIAL_DATA = JSON.parse(fs.readFileSync(BUNDLED_DB, 'utf-8'));
  }
} catch (e) {
  console.warn('Could not load INITIAL_DATA from BUNDLED_DB:', e.message);
}

function ensureDir(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

export function readDb() {
  if (inMemoryCache) {
    return inMemoryCache;
  }
  ensureDir(DB_FILE);
  if (!fs.existsSync(DB_FILE)) {
    // If bundled db.json exists, copy from it; otherwise use INITIAL_DATA
    if (fs.existsSync(BUNDLED_DB)) {
      try {
        const bundledContent = fs.readFileSync(BUNDLED_DB, 'utf-8');
        fs.writeFileSync(DB_FILE, bundledContent, 'utf-8');
        inMemoryCache = JSON.parse(bundledContent);
        return inMemoryCache;
      } catch (e) {}
    }
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
    } catch (e) {}
    inMemoryCache = INITIAL_DATA;
    return INITIAL_DATA;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    inMemoryCache = JSON.parse(raw);
    return inMemoryCache;
  } catch (err) {
    console.error('Error reading DB, using initial data:', err);
    inMemoryCache = INITIAL_DATA;
    return INITIAL_DATA;
  }
}

export function writeDb(data) {
  inMemoryCache = data;
  try {
    ensureDir(DB_FILE);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Notice: Could not write DB to filesystem in serverless mode, preserved in memory:', err.message);
  }
}
