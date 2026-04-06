import { TransactionModel } from "../models/transactionModel.js";

export const getTransactions = (req, res) => {
  try {
    const transactions = TransactionModel.getAll();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

export const addTransaction = (req, res) => {
  try {
    const newTransaction = TransactionModel.add(req.body);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error adding transaction" });
  }
};

export const deleteTransaction = (req, res) => {
  try {
    TransactionModel.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction" });
  }
};
