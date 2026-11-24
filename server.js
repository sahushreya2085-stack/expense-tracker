const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// MySQL Connection

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Shreya@1234",
    database: "expense_tracker"
});

db.connect((err) => {
    if (err) {
        console.log("Database Error:", err.message);
    } else {
        console.log("MySQL Connected Successfully!");
    }
});

// Add Transaction

app.post("/add-transaction", (req, res) => {

    const { type, description, amount, category, date } = req.body;

    const sql = `
        INSERT INTO transactions
        (type, description, amount, category, transaction_date)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [type, description, amount, category, date],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Transaction Added Successfully!"
            });
        }
    );
});

// Get Transactions

app.get("/transactions", (req, res) => {

    const sql = "SELECT * FROM transactions ORDER BY id DESC";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(result);
    });
});

// Start Server

app.listen(3000, () => {
    console.log("Server running on port 3000");
});