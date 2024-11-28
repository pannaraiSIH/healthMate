CREATE TABLE tb_common_minor_illnesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE tb_user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    line_id TEXT NOT NULL,
    username TEXT NOT NULL,
    messages JSON
);

CREATE TABLE tb_ucs_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    symptom TEXT,
    booked_date DATETIME,
    status TEXT NOT NULL DEFAULT "P",  -- p=pending, c=cancelled, d=done
    FOREIGN KEY (id_user) REFERENCES tb_user(id)
);