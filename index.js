const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("Bot aktif di Termux 🚀");
});

bot.on("text", (ctx) => {
  ctx.reply(`Kamu bilang: ${ctx.message.text}`);
});

bot.launch();

console.log("Bot jalan...");