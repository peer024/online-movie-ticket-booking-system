import fs from 'fs';
import { execSync } from 'child_process';

if (fs.existsSync('frontend')) {
  console.log('📦 Building frontend from root directory...');
  execSync('npm --prefix frontend install', { stdio: 'inherit' });
  execSync('npm --prefix frontend run build', { stdio: 'inherit' });
  if (fs.existsSync('frontend/dist')) {
    fs.cpSync('frontend/dist', 'dist', { recursive: true });
    console.log('✅ Copied frontend/dist to dist successfully.');
  }
} else {
  console.log('📦 Already inside frontend directory, running vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
}
