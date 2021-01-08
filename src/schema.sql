CREATE TABLE IF NOT EXISTS users (
    userID TEXT PRIMARY KEY,
    chat_id INTEGER,
    token TEXT -- Will be deleted after account linking
);