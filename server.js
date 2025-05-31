const express = require("express");
const dotenv = require("dotenv");
const payout = require("./payout");

dotenv.config();
const app = express();
app.use(express.json());

app.post("/api/payout", async (req, res) => {
  const { username, amount } = req.body;
  try {
    await payout(username, amount);
    res.json({ success: true, message: `✅ تم تحويل ${amount} Robux إلى ${username}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(3000, () => console.log("✅ السيرفر شغال"));
