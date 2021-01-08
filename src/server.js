// Load env variables from .env
require("dotenv").config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const generateToken = require("./utils/generateToken");
const db = require("better-sqlite3")("main.db");

// On every load, read the sql file to create the table if table does not exist
const fs = require("fs");
const path = require("path");
db.exec(fs.readFileSync(path.join(__dirname, "./schema.sql"), "utf8"));

/**
 * Ping / Health probe API
 * @name GET /
 * @returns 200 OK
 */
app.get("/", (req, res) => res.status(200).json({ ok: true }));

/**
 * Request for a new telegram deep link
 * @name POST /link/new/:userID
 * @returns 201 created with link
 */
app.post("/link/new/:userID", (req, res) => {
  try {
    const { userID } = req.params;

    // Generate a new random token
    const token = generateToken();

    // Insert userID and new token into the DB
    db.prepare(
      "INSERT INTO users (userID, token) VALUES (@userID, @token)"
    ).run({ userID, token });

    res.status(201).json({
      ok: true,
      link: `https://t.me/gotwhatassignmentduebot?start=${token}`,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({ ok: false, error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
