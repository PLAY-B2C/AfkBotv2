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
    console.log('❌ Disconnected. Reconnecting in 30s...');
    setTimeout(createBot, 30000);
  });

  bot.on('error', err => {
    console.log('⚠️ Bot error:', err);
  });
}

createBot();
