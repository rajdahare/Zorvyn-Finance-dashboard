import { getTransactions, addTransaction } from "../data.js";

export default function handler(req, res) {
    if (req.method === "GET") {
        return res.status(200).json(getTransactions());
    }

    if (req.method === "POST") {
        const body = req.body;
        const amount = Number(body ? .amount ?? 0);

        if (!body || !body.description || amount <= 0) {
            return res.status(400).json({ message: "Invalid transaction payload" });
        }

        const created = addTransaction(body);
        return res.status(201).json(created);
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ message: "Method not allowed" });
}
