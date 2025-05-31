const TelegramBot = require('node-telegram-bot-api');
const noblox = require('noblox.js');
const fs = require('fs');

// توكن بوت التليجرام
const token = '7980701490:AAGkDG5unlm0LvILYT2Bz-mDjt2TOpwaMkI';
const bot = new TelegramBot(token, { polling: true });

// معرف الجروب ثابت
const GROUP_ID = 11634679; // حط رقم جروبك هنا

// ملف الكوكي (احفظ فيه كوكي روبلوكس)
const cookieFile = './roblox_cookie.txt';

// اقرأ الكوكي
let robloxCookie = '';
try {
  robloxCookie = fs.readFileSync(cookieFile, 'utf8').trim();
  console.log("تم قراءة كوكي روبلوكس");
} catch (err) {
  console.error("لم يتم العثور على ملف الكوكي. ضع الكوكي في roblox_cookie.txt");
  process.exit(1);
}

async function loginRoblox() {
  try {
    const currentUserId = await noblox.setCookie(robloxCookie);
    console.log(`تم تسجيل الدخول كـ: ${currentUserId}`);
    return currentUserId;
  } catch (err) {
    console.error('فشل تسجيل الدخول لروبلكس:', err);
    process.exit(1);
  }
}

// سجل دخول عند بداية التشغيل
loginRoblox();

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `مرحبًا! أرسل لي الأمر بهذا الشكل لتحويل روبكس:\n/transfer <userId> <amount>\nمثال: /transfer 87654321 100\nالجروب ثابت: ${GROUP_ID}`);
});

bot.onText(/\/transfer (\d+) (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = parseInt(match[1]);
  const amount = parseInt(match[2]);

  if (amount <= 0) {
    bot.sendMessage(chatId, `🚫 المبلغ يجب أن يكون أكبر من صفر`);
    return;
  }

  try {
    // تحقق من صلاحية العضو في الجروب
    const rank = await noblox.getRankInGroup(GROUP_ID, userId);
    if(rank === 0){
      bot.sendMessage(chatId, `🚫 المستخدم غير عضو في الجروب.`);
      return;
    }

    // تنفيذ التحويل
    await noblox.groupPayout(GROUP_ID, userId, amount);
    bot.sendMessage(chatId, `✅ تم تحويل ${amount} روبكس لـ userId: ${userId} في جروب ${GROUP_ID}`);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ حدث خطأ أثناء تحويل الروبكس: ${error.message || error}`);
  }
});

bot.on('message', (msg) => {
  if (!msg.text.startsWith('/')) return;
  if (!msg.text.startsWith('/start') && !msg.text.startsWith('/transfer')) {
    bot.sendMessage(msg.chat.id, `❓ أمر غير معروف. استخدم /start لعرض التعليمات.`);
  }
});
