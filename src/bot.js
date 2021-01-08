// Load the environment variables from .env file
require("dotenv").config();

const { PollingBot, shortHands } = require("yatbl");
const bot = new PollingBot(process.env.BOT_TOKEN);

const db = require("better-sqlite3")("main.db");

bot.addShortHand(shortHands.replyMessage);

bot.onCommand("start", function (parsedCommand, update) {
  const chat_id = update.message.chat.id;

  if (!parsedCommand[0])
    return bot.tapi("sendMessage", {
      chat_id,
      text:
        "Missing registration token! Go luminus to setup your notification integration",
    });

  const token = parsedCommand[0][0];

  // Insert chat_id into DB by token
  const dbUpdate = db
    .prepare("UPDATE users set chat_id = ? WHERE token = ?")
    .run(chat_id, token);

  // If token is invalid, 0 changes will be made
  if (dbUpdate.changes !== 1)
    return bot.tapi("sendMessage", {
      chat_id,
      text: "Invalid registration token! Use link provided in luminus",
    });

  // Notify user of successful registration
  bot.tapi("sendMessage", {
    chat_id,
    text: "Registerd! Notifications will be sent here directly!",
  });
});

bot.startPolling(0);
