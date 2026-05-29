const express = require("express");
const { Telegraf } = require("telegraf");

const app = express();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("Halo, bot aktif 24 jam!");
});

bot.on("text", (ctx) => {
  ctx.reply(`Kamu bilang: ${ctx.message.text}`);
});

bot.launch();

console.log("Bot Telegram aktif");

app.get("/", (req, res) => {
  res.send("Bot hidup");
});

app.listen(3000, () => {
  console.log("Web server aktif");
});
