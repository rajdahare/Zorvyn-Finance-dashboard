import { TransactionModel } from "../models/transactionModel.js";

export const getSummary = (req, res) => {
  try {
    const summary = TransactionModel.getSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Error fetching summary" });
  }
};
