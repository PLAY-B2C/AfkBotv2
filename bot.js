const mineflayer = require('mineflayer');
const config = require('./config.json');
const { Vec3 } = require('vec3');

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: config.serverHost,
    port: config.serverPort,
    username: config.botUsername,
    auth: 'offline',
    version: false,
    viewDistance: 'tiny'
  });

  bot.once('spawn', () => {
    console.log(`✅ ${config.botUsername} joined the server.`);
    bot.chat('/login 3043AA');

    // 🔁 Anti-AFK jump every 40s
    let toggle = false;
    setInterval(() => {
      bot.setControlState('jump', toggle);
      toggle = !toggle;
    }, 40000);

    // 💬 Auto chat every 120s
    const messages = ["I'm Areeb I like boys", "Areeb loves Dihh"];
    let msgIndex = 0;
    setInterval(() => {
      bot.chat(messages[msgIndex]);
      msgIndex = (msgIndex + 1) % messages.length;
    }, 120000);

    // 🔁 Auto rotate slightly every 1s
    let yaw = 0;
    setInterval(() => {
      yaw += 0.1;
      bot.look(yaw, 0, true);
    }, 1000);
  });

  bot.on('end', () => {
    console.log('❌ Bot was disconnected. Reconnecting in 10s...');
    reconnectWithDelay();
  });

  bot.on('error', err => {
    console.log(`⚠️ Bot error: ${err.message}`);
    reconnectWithDelay();
  });
}

function reconnectWithDelay() {
  if (bot) {
    try {
      bot.quit();
    } catch (_) {}
    bot = null;
  }
  setTimeout(() => {
    console.log('🔁 Attempting to reconnect...');
    createBot();
  }, 10000); // 10 seconds
}

createBot();
