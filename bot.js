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

    // 🔁 Anti-AFK movement loop
    let toggle = false;
    setInterval(() => {
      bot.setControlState('jump', toggle);
      toggle = !toggle;
    }, 40000); // every 40s

    // 💬 Auto chat every 120s
    const messages = ["I'm Areeb I like boys", "Areeb loves Dihh"];
    let msgIndex = 0;
    setInterval(() => {
      bot.chat(messages[msgIndex]);
      msgIndex = (msgIndex + 1) % messages.length;
    }, 120000); // every 120s
  });

  bot.on('end', () => {
    console.log('❌ Disconnected. Reconnecting in 30s...');
    setTimeout(createBot, 30000);
  });

  bot.on('error', err => {
    console.log('⚠️ Bot error:', err);
  });
}

createBot();
