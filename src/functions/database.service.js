const sqlite3 = require("sqlite3");

async function fetchCommonIllnesses() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./healthMate.db");

    const query = `
                SELECT 
                    name
                FROM tb_common_minor_illnesses
                ORDER BY id ASC;
            `;

    db.all(query, [], (err, rows) => {
      db.close();
      if (err) {
        reject(err);
        return;
      }
      const names = rows.map((row) => row.name).join("\n");
      resolve(names);
    });
  });
}

async function getUserByLineId(lineId) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./healthMate.db");
    db.get("SELECT * FROM tb_user WHERE line_id = ?", [lineId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function createUser({ lineId, username }) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./healthMate.db");

    const query = `
            INSERT INTO tb_user (line_id, username, messages)
            VALUES (?, ?, ?);
        `;

    db.run(query, [lineId, username, JSON.stringify([])], function (err) {
      db.close();
      if (err) {
        reject(err);
        return;
      }
      resolve({ success: true, message: "User created successfully." });
    });
  });
}

async function createUcsHistory({ userId, symptom, bookedDate, status = "P" }) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./healthMate.db");

    const query = `
            INSERT INTO tb_ucs_history (id_user, symptom, booked_date, status)
            VALUES (?, ?, ?, ?);
        `;

    db.run(query, [userId, symptom, bookedDate, status], function (err) {
      db.close();
      if (err) {
        reject(err);
        return;
      }
      resolve({
        success: true,
        message: "UCS history created successfully.",
        historyId: this.lastID,
        symptom,
        bookedDate,
      });
    });
  });
}

async function getUcsHistoryByUserId(userId) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./healthMate.db");

    const query = `
            SELECT id, id_user, symptom, booked_date, status 
            FROM tb_ucs_history
            WHERE id_user = ?;
        `;

    db.all(query, [userId], (err, rows) => {
      db.close();
      if (err) {
        reject(err);
        return;
      }
      if (rows.length === 0) {
        resolve({
          success: false,
          message: "No UCS history found for this user.",
          history: [],
        });
      } else {
        resolve({
          success: true,
          message: "UCS history retrieved successfully.",
          history: rows,
        });
      }
    });
  });
}

module.exports = {
  fetchCommonIllnesses,
  getUserByLineId,
  createUser,
  createUcsHistory,
  getUcsHistoryByUserId,
};
