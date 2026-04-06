export const api = {
  getTransactions: async () => {
    const res = await fetch("/api/transactions");
    return res.json();
  },
  getSummary: async () => {
    const res = await fetch("/api/summary");
    return res.json();
  },
  addTransaction: async (transaction) => {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });
    return res.json();
  },
  deleteTransaction: async (id) => {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
  },
};
