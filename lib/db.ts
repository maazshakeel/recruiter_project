import sqlite from "sqlite3";

const db = new sqlite.Database("./test.db", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

export default db;
