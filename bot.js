const mineflayer = require('mineflayer');
const config = require('./config.json');

let bot;
let jumpInterval, chatInterval;

function createBot() {
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
    bot.chat('/login 3043AA');

    // 🔁 Anti-AFK jump every 40s
    let toggle = false;
    jumpInterval = setInterval(() => {
      if (!bot || !bot.entity) return;
      bot.setControlState('jump', toggle);
      toggle = !toggle;
    }, 40000);

    // 💬 Roasts every 5 minutes
    const factsAboutAreeb = [
      // Skinny jokes
      "Areeb is so skinny, skeletons ask him for weight tips.",
      "Areeb once walked through iron bars... sideways.",
      "When Areeb turns sideways, he vanishes.",
      "Areeb uses a toothpick as a backrest.",
      "Areeb's shadow is in 2D.",
      "Areeb's armor falls off because there's nothing to hold it.",
      "Zombies don't bother attacking Areeb — not enough meat.",
      "Areeb wears leather armor to avoid being blown away by wind.",
      "Even Endermen think Areeb is underfed.",
      "Areeb eats in-game and still loses weight.",

      // Girlfriend jokes
      "Areeb's girlfriend once sat on his base and crashed the server.",
      "They made a boat together. It sank immediately.",
      "Her armor stand needed diamond reinforcements.",
      "Areeb rides a horse, she rides a Ravager.",

      // Masturbation (clean) jokes
      "Areeb’s favorite potion is... awkward.",
      "Areeb spends too much time in the shower — with his sword.",
      "Villagers close doors when Areeb walks by — they know.",
      "Areeb's favorite block? Smooth quartz.",
      "He tried to smelt 'privacy' in a furnace.",

      // Original funnies
      "Areeb once got lost in a straight hallway.",
      "Areeb thinks gravel is a renewable resource.",
      "Areeb tried to tame a creeper with bones.",
      "Areeb crafted stairs... out of diamonds.",
      "Areeb once tried to eat a furnace thinking it was cake."
    ];

    chatInterval = setInterval(() => {
      if (!bot) return;
      const msg = factsAboutAreeb[Math.floor(Math.random() * factsAboutAreeb.length)];
      bot.chat(`📢 Areeb Fact: ${msg}`);
    }, 300000); // every 5 minutes
  });

  bot.on('end', () => {
    console.log('❌ Bot was disconnected. Reconnecting in 5s...');
    reconnectWithDelay();
  });

  bot.on('error', err => {
    console.log(`⚠️ Bot error: ${err.message}`);
    reconnectWithDelay();
  });
}

function reconnectWithDelay() {
  if (bot) {
    try { bot.quit(); } catch (_) {}
    bot = null;
  }

  clearInterval(jumpInterval);
  clearInterval(chatInterval);

  setTimeout(() => {
    console.log('🔁 Attempting to reconnect...');
    createBot();
  }, 5000); // Reconnect after 5s
}

createBot();
