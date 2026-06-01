const express = require("express");
const { Telegraf } = require("telegraf");

const app = express();

const bot = new Telegraf(process.env.BOT_TOKEN);

// command
bot.start((ctx) => {
  ctx.reply("TES NX CREATE");
});

bot.on("text", (ctx) => {
  ctx.reply(`Kamu bilang: ${ctx.message.text}`);
});

// webhook route
app.use(bot.webhookCallback("/webhook"));

app.get("/", (req, res) => {
  res.send("Bot hidup");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  const url = process.env.WEBHOOK_URL;

  await bot.telegram.setWebhook(`${url}/webhook`);

  console.log("Bot webhook aktif:", url);
});
