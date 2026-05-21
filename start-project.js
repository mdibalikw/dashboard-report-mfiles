import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting M-Files Dashboard Backend & Frontend...');

// Start Backend
const backend = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

backend.on('error', (err) => {
  console.error('Failed to start backend:', err);
});

// Start Frontend
const frontendPath = path.join(__dirname, 'frontend', 'node_modules', 'vite', 'bin', 'vite.js');
const frontend = spawn('node', [frontendPath], {
  stdio: 'inherit',
  cwd: path.join(__dirname, 'frontend')
});

frontend.on('error', (err) => {
  console.error('Failed to start frontend:', err);
});

// Handle exit
process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
