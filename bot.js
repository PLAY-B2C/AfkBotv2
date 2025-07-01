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

    if (config.loginCommand) {
      bot.chat(config.loginCommand);
    }

    let toggle = false;
    setInterval(() => {
      bot.setControlState('jump', toggle);
      toggle = !toggle;
    }, 40000);

    const messages = config.autoMessages || [];
    let index = 0;
    setInterval(() => {
      if (messages.length > 0) {
        bot.chat(messages[index]);
        index = (index + 1) % messages.length;
      }
    }, 120000);
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
