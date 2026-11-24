const form = document.getElementById("transactionForm");
const message = document.getElementById("message");

const transactionList = document.getElementById("transactionList");

const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const totalBalance = document.getElementById("totalBalance");

// Add Transaction

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const transaction = {
        type: document.getElementById("type").value,
        description: document.getElementById("description").value.trim(),
        amount: Number(document.getElementById("amount").value),
        category: document.getElementById("category").value,
        date: document.getElementById("date").value
    };

    if (
        !transaction.type ||
        !transaction.description ||
        !Number.isFinite(transaction.amount) ||
        transaction.amount <= 0 ||
        !transaction.category ||
        !transaction.date
    ) {
        message.textContent = "Please enter valid details.";
        return;
    }

    try {

        const response = await fetch("/add-transaction", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(transaction)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Unable to save transaction");
        }

        message.textContent = "Transaction added successfully!";

        form.reset();

        loadTransactions();

    } catch (error) {

        message.textContent = error.message;

    }

});


// Load Transactions

async function loadTransactions() {

    try {

        const response = await fetch("/transactions");

        if (!response.ok) {
            throw new Error("Unable to load transactions");
        }

        const transactions = await response.json();

        transactionList.innerHTML = "";

        let income = 0;
        let expense = 0;

        transactions.forEach((item) => {

            const amount = Number(item.amount);

            if (item.type === "Income") {
                income += amount;
            } else {
                expense += amount;
            }

            const row = document.createElement("tr");

            const values = [
                item.id,
                item.type,
                item.description,
                "₹" + amount.toFixed(2),
                item.category,
                new Date(item.transaction_date).toLocaleDateString("en-IN")
            ];

            values.forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            transactionList.appendChild(row);

        });

        totalIncome.textContent = "₹" + income.toFixed(2);
        totalExpense.textContent = "₹" + expense.toFixed(2);
        totalBalance.textContent = "₹" + (income - expense).toFixed(2);

    } catch (error) {

        message.textContent = error.message;

    }

}


// Load data when page opens

loadTransactions();