import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "../../data.json");

// Initial data if file doesn't exist
const initialTransactions = [
  { id: "1", date: "2026-04-01", amount: 2500, category: "Salary", type: "income", description: "Monthly Salary" },
  { id: "2", date: "2026-04-02", amount: 120, category: "Food", type: "expense", description: "Grocery Shopping" },
  { id: "3", date: "2026-04-02", amount: 45, category: "Transport", type: "expense", description: "Uber Ride" },
  { id: "4", date: "2026-04-03", amount: 800, category: "Rent", type: "expense", description: "Apartment Rent" },
  { id: "5", date: "2026-04-03", amount: 150, category: "Entertainment", type: "expense", description: "Movie & Dinner" },
  { id: "6", date: "2026-03-28", amount: 300, category: "Freelance", type: "income", description: "Logo Design Project" },
];

const loadData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf8");
      return JSON.parse(data);
    }
    return initialTransactions;
  } catch (error) {
    console.error("Error loading data:", error);
    return initialTransactions;
  }
};

const saveData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

let transactions = loadData();

export const TransactionModel = {
  getAll: () => transactions,
  add: (tx) => {
    const newTx = {
      id: Math.random().toString(36).substr(2, 9),
      ...tx,
      date: tx.date || new Date().toISOString().split('T')[0]
    };
    transactions.unshift(newTx);
    saveData(transactions);
    return newTx;
  },
  delete: (id) => {
    transactions = transactions.filter(t => t.id !== id);
    saveData(transactions);
    return true;
  },
  getSummary: () => {
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      balance: totalIncome - totalExpenses,
      income: totalIncome,
      expenses: totalExpenses,
      transactionCount: transactions.length
    };
  }
};
