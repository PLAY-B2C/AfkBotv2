const mineflayer = require('mineflayer');
const config = require('./config.json');

let bot;
let jumpInterval, chatInterval;
let reconnecting = false;

function createBot() {
  console.log('🔁 Attempting to connect...');

  bot = mineflayer.createBot({
    host: config.serverHost,
    port: config.serverPort,
    username: config.botUsername,
    auth: 'offline',
    version: "1.21.4",
    viewDistance: 'tiny'
  });

  bot.once('spawn', () => {
    console.log(`✅ ${config.botUsername} joined the server.`);

    setTimeout(() => {
      if (bot && bot.chat) {
        try {
          bot.chat('/login 3043AA');
        } catch (err) {
          console.log('⚠️ Login error:', err.message);
        }
      }
    }, 5000);

    clearAllIntervals();

    let toggle = false;
    jumpInterval = setInterval(() => {
      if (!bot || !bot.entity) return;
      try {
        bot.setControlState('jump', toggle);
        toggle = !toggle;
      } catch (err) {
        console.log('⚠️ Jump error:', err.message);
      }
    }, 40000);

    const intros = [
      "📢 Did you know?",
      "📣 True Story:",
      "🧠 Fun Fact:",
      "💀 Legend says",
      "📚 Weird but true:",
      "🎤 Word on the street:",
      "💬 People say:",
      "📖 In the book of roasts:",
      "😆 Here's one:",
      "🔍 Observation:"
    ];

    const facts = [
      "Areeb is so skinny, skeletons ask him for weight tips.",
      "When Areeb turns sideways, he vanishes.",
      "Areeb once wore armor and disappeared inside it.",
      "Areeb says: I'm LGBTQ – Looking Good, Totally Quirky!",
      "His girlfriend sat on a block and crashed the server.",
      "Areeb got lost in a straight hallway.",
      "Even Endermen think he's fragile.",
      "Areeb uses a fishing rod for confidence boosts.",
    ];

    chatInterval = setInterval(() => {
      if (!bot || !bot.chat || !bot.player) return;
      try {
        const intro = intros[Math.floor(Math.random() * intros.length)];
        const msg = facts[Math.floor(Math.random() * facts.length)];
        bot.chat(`${intro} ${msg}`);
      } catch (err) {
        console.log("⚠️ Chat error:", err.message);
      }
    }, 300000);
  });

  bot.on('end', () => {
    console.log('❌ Bot was disconnected.');
    scheduleReconnect();
  });

  bot.on('error', err => {
    console.log(`⚠️ Bot error: ${err.message}`);
    scheduleReconnect();
  });
}

function scheduleReconnect() {
  if (reconnecting) return;
  reconnecting = true;

  clearAllIntervals();

  try {
    if (bot) bot.quit();
  } catch (_) {}

  bot = null;

  setTimeout(() => {
    reconnecting = false;
    createBot();
  }, 5000);
}

function clearAllIntervals() {
  if (jumpInterval) clearInterval(jumpInterval);
  if (chatInterval) clearInterval(chatInterval);
}

// 🛡️ Catch any unhandled crashes
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  scheduleReconnect();
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Promise Rejection:', reason);
  scheduleReconnect();
});

createBot();
