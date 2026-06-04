const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("Bot aktif di Termux 🚀");
});

// 👇 COMMAND /open (SUDAH DITAMBAHKAN)
bot.command("open", (ctx) => {
  ctx.reply("Klik untuk lanjut:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🚀 Lanjut",
            url: "https://yugugun70-ctrl.github.io/telegram-open/"
          }
        ]
      ]
    }
  });
});

bot.on("text", (ctx) => {
  ctx.reply(`Kamu bilang: ${ctx.message.text}`);
});

bot.launch();

console.log("Bot jalan...");