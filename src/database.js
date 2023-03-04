import sqlite3 from "sqlite3";
import { open } from "sqlite";

const DEFAULT_MESSAGES_TO_RETRIEVE = 10;

class Database {
  constructor(dbFilePath = "./database.sqlite") {
    this.db = null;
    this.dbFilePath = dbFilePath;
  }

  async initialize() {
    this.db = await open({
      filename: this.dbFilePath,
      driver: sqlite3.Database,
    });

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        content TEXT,
        role TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await this.db.exec(createTableQuery);
  }

  async addMessage(userId, content, role) {
    const insertQuery = `
      INSERT INTO messages (userId, content, role)
      VALUES (?, ?, ?)
    `;
    await this.db.run(insertQuery, [userId, content, role]);
  }

  async getMessages(userId, n = DEFAULT_MESSAGES_TO_RETRIEVE) {
    const selectQuery = `
      SELECT content, role
      FROM messages
      WHERE userId = ?
      ORDER BY created_at ASC
      LIMIT ?
    `;
    const rows = await this.db.all(selectQuery, [userId, n]);
    console.log(rows)
    return rows;
  }
}

export default Database;