require("dotenv").config();
const db = require("better-sqlite3")("main.db");

const cron = require('node-cron');
cron.schedule("3 * * * * *", sendReminders)

function sendReminders() {
  const row = db.prepare("SELECT userID FROM users");
  console.log(row.all());
  console.log("hello world!");
}


/*
const { tapiFF } = require("yatbl");
const tapi = tapiFF(process.env.BOT_TOKEN);

tapi("sendMessage", {
  chat_id,
  text:
    "Missing registration token! Go luminus to setup your notification integration",
});
*/