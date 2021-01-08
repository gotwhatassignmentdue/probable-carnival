require("dotenv").config();
const db = require("better-sqlite3")("main.db");
const axios = require('axios').default;
const { tapiFF } = require("yatbl");
const tapi = tapiFF(process.env.BOT_TOKEN);

const cron = require('node-cron');
cron.schedule("*/5 * * * * *", sendReminders)

function sendReminders() {
  console.log("test")
  try {
    const row = db.prepare("SELECT userID, token, chat_id FROM users");
    row.all()
    .forEach(async (row) => {
      var toBeSent = "You need complete these soon!\n"

      const response = await axios.get(`http://localhost:3001/task/`, {
      headers : {
        'auth-token' : '8073e7cd'
      }})
        response.data.forEach((row) => {
          if(!row.completed) {
            console.log(row)
            toBeSent += row.module + " - " + row.taskName + " - " + row.endDate + "\n"
          }
        })
      
        console.log(row.chat_id)
      tapi("sendMessage", {
        chat_id: row.chat_id,
        text:toBeSent,
      });
        
      console.log("Successfully Sent");
    }
    );
  } catch (err) {
    console.log(err.message)
  }

  //const row = db.prepare("SELECT userID FROM users");
  //console.log(row)
  //row.all().forEach((row) => {
    
  //});
}

/*
axios.get(`http://localhost:3001/task/`, {
      headers : {
        'auth-token' : '8073e7cd'
      }
    })
    .then((response) => 
      response
      .data
      .forEach((row) => {
        if(!row.completed) {
          console.log(row)
        }
      })));
*/

/*

*/