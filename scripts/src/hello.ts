import express from "express";
import { Telegraf } from "telegraf";

const app = express();

const bot = new Telegraf(process.env.8991903471:AAHHGY1w8ult1LaJ2LlZObfwneK9hqG1t14!);

bot.start((ctx) => {
  ctx.reply("Halo, bot aktif 24 jam!");
});

bot.on("text", (ctx) => {
  ctx.reply(Kamu bilang: ${ctx.message.text});
});

bot.launch();

console.log("Bot Telegram aktif");

app.get("/", (req, res) => {
  res.send("Bot hidup");
});

app.listen(3000, () => {
  console.log("Web server aktif");
});

process.on("uncaughtException", (err) => {
  console.log(err);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
});
