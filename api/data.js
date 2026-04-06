const transactions = [
    { id: "1", date: "2026-04-01", amount: 2500, category: "Salary", type: "income", description: "Monthly Salary" },
    { id: "2", date: "2026-04-02", amount: 120, category: "Food", type: "expense", description: "Grocery Shopping" },
    { id: "3", date: "2026-04-02", amount: 45, category: "Transport", type: "expense", description: "Uber Ride" },
    { id: "4", date: "2026-04-03", amount: 800, category: "Rent", type: "expense", description: "Apartment Rent" },
    { id: "5", date: "2026-04-03", amount: 150, category: "Entertainment", type: "expense", description: "Movie & Dinner" },
    { id: "6", date: "2026-03-28", amount: 300, category: "Freelance", type: "income", description: "Logo Design Project" },
];

const getTransactions = () => transactions;

const addTransaction = (tx) => {
    const amount = Number(tx.amount ?? 0);
    const newTx = {
        id: Math.random().toString(36).substr(2, 9),
        date: tx.date || new Date().toISOString().split("T")[0],
        amount,
        category: tx.category || "Misc",
        type: tx.type === "income" ? "income" : "expense",
        description: tx.description || "",
    };

    transactions.unshift(newTx);
    return newTx;
};

const deleteTransaction = (id) => {
    const index = transactions.findIndex((tx) => tx.id === id);
    if (index === -1) return false;
    transactions.splice(index, 1);
    return true;
};

const getSummary = () => {
    const totalIncome = transactions
        .filter((tx) => tx.type === "income")
        .reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpenses = transactions
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0);

    return {
        balance: totalIncome - totalExpenses,
        income: totalIncome,
        expenses: totalExpenses,
        transactionCount: transactions.length,
    };
};

export { getTransactions, addTransaction, deleteTransaction, getSummary };
