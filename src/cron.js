require("dotenv").config();
const db = require("better-sqlite3")("main.db");
const axios = require("axios").default;
const { tapiFF } = require("yatbl");
const tapi = tapiFF(process.env.BOT_TOKEN);

const cron = require("node-cron");
cron.schedule("*/5 * * * * *", pollAndSendReminders);

function pollAndSendReminders() {
  console.log("Polling luminus API for tasks");

  try {
    // Create statement to load all users from DB
    const row = db.prepare("SELECT userID, token, chat_id FROM users");

    // Poll API for every single user
    row.all().forEach(async function (row) {
      const response = await axios.get(`http://localhost:3001/task/`, {
        headers: {
          // "auth-token": "8073e7cd",
          "auth-token": row.userID,
        },
      });

      const toBeSent = [];

      // Loop through all the tasks to find tasks that have yet to be completed
      // Push the message with a newline into the array of tasks to update user with
      response.data.forEach(function (task) {
        if (!task.completed)
          toBeSent.push(
            task.module + " - " + task.taskName + " - " + task.endDate + "\n"
          );
      });

      // If there are any upcoming tasks
      if (toBeSent.length) {
        await tapi("sendMessage", {
          chat_id: row.chat_id,
          text: "You need complete these soon!\n" + toBeSent.join(""),
        });

        console.log(`Notification for user ${row.userID} sent!`);
      } else console.log(`No upcoming tasks for user ${row.userID}!`);
    });
  } catch (error) {
    console.error(error);
  }
}
