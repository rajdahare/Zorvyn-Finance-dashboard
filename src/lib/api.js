const fetchJson = async(url, options) => {
    const res = await fetch(url, options);
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${body}`);
    }
    return res.json();
};

export const api = {
    getTransactions: async() => fetchJson("/api/transactions"),
    getSummary: async() => fetchJson("/api/summary"),
    addTransaction: async(transaction) =>
        fetchJson("/api/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transaction),
        }),
    deleteTransaction: async(id) => {
        const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
        if (!res.ok) {
            const body = await res.text();
            throw new Error(`${res.status} ${res.statusText}: ${body}`);
        }
    },
};