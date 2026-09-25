import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('\n=============================================================');
console.log('🚀 Starting CineVerse 3D Unified Development Servers...');
console.log('🎬 Project by Kombaiya & Ashik Chandru');
console.log('=============================================================\n');

// 1. Start Backend API Server (Port 5000)
console.log('⚙️  Starting Node.js Express Backend on http://localhost:5000 ...');
const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// 2. Start Frontend Vite Development Server (Port 5173)
console.log('🎨 Starting React + Three.js Frontend on http://localhost:5173 ...\n');
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\n🛑 Shutting down CineVerse 3D development servers...');
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
