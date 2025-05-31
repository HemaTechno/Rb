const noblox = require("noblox.js");
require("dotenv").config();

async function payout(username, amount) {
  await noblox.setCookie(process.env.ROBLOX_COOKIE);
  const userId = await noblox.getIdFromUsername(username);
  const isMember = await noblox.getRankInGroup(process.env.GROUP_ID, userId);
  if (isMember === 0) throw new Error("المستخدم مش عضو في الجروب");
  await noblox.groupPayout(process.env.GROUP_ID, [
    { recipientId: userId, amount: Number(amount) }
  ]);
}

module.exports = payout;
