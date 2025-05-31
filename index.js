const { Client, GatewayIntentBits } = require('discord.js');
const noblox = require('noblox.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

async function loginRoblox() {
  try {
    await noblox.setCookie(process.env.ROBLOX_COOKIE);
    const currentUser = await noblox.getCurrentUser();
    console.log(`✅ Logged in as ${currentUser.UserName}`);
  } catch (err) {
    console.error("❌ Roblox login failed:", err);
  }
}

client.once('ready', () => {
  console.log(`🤖 Bot ready: ${client.user.tag}`);
  loginRoblox();
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice(1).split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'payout') {
    const username = args[0];
    const amount = parseInt(args[1], 10);

    if (!username || isNaN(amount)) {
      return message.reply('❗ استخدم الأمر كده: `!payout username amount`');
    }

    try {
      const userId = await noblox.getIdFromUsername(username);
      await noblox.groupPayout(process.env.GROUP_ID, userId, amount);
      message.reply(`✅ تم تحويل ${amount} Robux إلى ${username} بنجاح!`);
    } catch (err) {
      console.error(err);
      message.reply('❌ حصل خطأ. تأكد من الاسم أو التوكن.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
