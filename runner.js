const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Prim-Uslugi Project and Bot...');

// 1. Start Next.js (Web App)
const nextApp = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// 2. Start the Bot (Polling mode)
const bot = spawn('node', [path.join(__dirname, 'src/lib/start-polling.js')], {
  stdio: 'inherit',
  shell: true
});

nextApp.on('close', (code) => {
  console.log(`Web App process exited with code ${code}`);
  bot.kill();
});

bot.on('close', (code) => {
  console.log(`Bot process exited with code ${code}. Next.js app will continue running.`);
  // nextApp.kill(); // Commented out to prevent app crash if bot conflicts
});

process.on('SIGINT', () => {
  nextApp.kill();
  bot.kill();
  process.exit();
});
