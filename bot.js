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

    // Wait before sending login to avoid disconnect spam
    setTimeout(() => {
      if (bot && bot.chat) {
        bot.chat('/login 3043AA');
      }
    }, 3000); // wait 3 seconds

    clearInterval(jumpInterval);
    clearInterval(chatInterval);

    // 🔁 Anti-AFK jump every 40s
    let toggle = false;
    jumpInterval = setInterval(() => {
      if (!bot || !bot.entity) return;
      bot.setControlState('jump', toggle);
      toggle = !toggle;
    }, 40000);

    // 💬 Roast Areeb every 5 minutes
    const factsAboutAreeb = [
      // Skinny roasts
      "Areeb is so skinny, skeletons ask him for weight tips.",
      "Areeb once walked through iron bars... sideways.",
      "When Areeb turns sideways, he vanishes.",
      "Areeb uses a toothpick as a backrest.",
      "Areeb's shadow is in 2D.",
      "Areeb's armor falls off because there's nothing to hold it.",
      "Zombies don’t attack Areeb — not enough meat.",
      "Even Endermen worry he might snap.",
      "Areeb eats food and loses weight anyway.",
      "Areeb once wore armor — and disappeared inside it.",

      // Girlfriend jokes
      "Areeb's girlfriend once sat on his base and crashed the server.",
      "They built a boat together... it sank instantly.",
      "Her armor stand needed obsidian reinforcements.",
      "Areeb rides a horse, she rides a Ravager.",

      // PG jokes about habits
      "Areeb’s favorite potion is... awkward.",
      "He spends too much time in the AFK room.",
      "Villagers shut doors when Areeb logs in.",
      "He tried to craft 'privacy' using 8 glass blocks.",
      "Favorite block? Smooth quartz. No questions.",

      // Proud quote
      "Areeb says proudly: I'm LGBTQ – Looking Good, Totally Quirky!",
      "Areeb identifies as a full stack of bones 🦴.",
      "Areeb once tried to enchant a fishing rod with confidence.",
      "Areeb’s gender is `function() { return false; }`",
      "He says he's straight... until he meets an Enderman with fashion.",

      // Silly
      "Areeb tried to tame a creeper with bones.",
      "He crafted stairs out of diamonds.",
      "He once ate a furnace thinking it was cake.",
      "Areeb got lost in a straight hallway."
    ];

    chatInterval = setInterval(() => {
      if (!bot || !bot.player) return;
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

const intro = intros[Math.floor(Math.random() * intros.length)];
const msg = factsAboutAreeb[Math.floor(Math.random() * factsAboutAreeb.length)];
bot.chat(`${intro} ${msg}`);

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
  }, 5000);
}

createBot();
