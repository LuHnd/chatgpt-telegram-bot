import Telegraf from "telegraf";
import getResponseMessage from "./src/getResponseMessage.js";
import dotenv from "dotenv";
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on("text", async (ctx) => {
  const message = ctx.update.message;
  const userId = ctx.update.message.from.id.toString();

  if (
    !message?.text?.includes(bot?.context?.botInfo?.username) &&
    message?.reply_to_message?.from?.id != bot?.context?.botInfo?.id
  ) {
    return;
  }

  ctx.replyWithChatAction('typing');
  const responseMessage = await getResponseMessage(userId, message?.text);

  ctx.reply(responseMessage, { reply_to_message_id: ctx.message.message_id });
});

bot.launch();
