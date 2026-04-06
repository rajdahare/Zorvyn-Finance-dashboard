import { deleteTransaction } from "../data.js";

export default function handler(req, res) {
    if (req.method !== "DELETE") {
        res.setHeader("Allow", "DELETE");
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { id } = req.query;
    if (!id || !deleteTransaction(id)) {
        return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(204).end();
}