import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Filter } from "lucide-react";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { SummaryCards } from "./components/dashboard/SummaryCards";
import { DashboardCharts } from "./components/dashboard/Charts";
import { TransactionTable } from "./components/transactions/TransactionTable";
import { api } from "./lib/api";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [role, setRole] = useState("admin");
  const [theme, setTheme] = useState("dark");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isGrouped, setIsGrouped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form State
  const [newTx, setNewTx] = useState({
    amount: 0,
    category: "Food",
    type: "expense",
    description: ""
  });

  const fetchData = async () => {
    try {
      const [txs, summ] = await Promise.all([api.getTransactions(), api.getSummary()]);
      setTransactions(txs);
      setSummary(summ);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTransaction = async () => {
    if (newTx.amount <= 0 || !newTx.description) return;
    await api.addTransaction(newTx);
    setIsAddDialogOpen(false);
    setNewTx({ amount: 0, category: "Food", type: "expense", description: "" });
    fetchData();
  };

  const handleDelete = async (id) => {
    if (role !== "admin") return;
    await api.deleteTransaction(id);
    fetchData();
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) || 
                           t.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === "all" || t.category === filterCategory;
      
      let matchesDate = true;
      if (startDate || endDate) {
        const txDate = parseISO(t.date);
        const start = startDate ? startOfDay(parseISO(startDate)) : new Date(0);
        const end = endDate ? endOfDay(parseISO(endDate)) : new Date();
        matchesDate = isWithinInterval(txDate, { start, end });
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [transactions, search, filterCategory, startDate, endDate]);

  const chartData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
    let runningBalance = 0;
    return sorted.map(t => {
      runningBalance += t.type === "income" ? t.amount : -t.amount;
      return {
        date: format(parseISO(t.date), "MMM dd"),
        balance: runningBalance
      };
    });
  }, [transactions]);

  const pieData = useMemo(() => {
    const categories = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const insights = useMemo(() => {
    if (transactions.length === 0) return [];
    const highestExpense = [...transactions]
      .filter(t => t.type === "expense")
      .sort((a, b) => b.amount - a.amount)[0];
    
    const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0;

    return [
      { title: "Highest Expense", value: highestExpense ? `$${highestExpense.amount} (${highestExpense.category})` : "N/A", icon: <TrendingDown className="w-4 h-4 text-red-400" /> },
      { title: "Savings Rate", value: `${savingsRate}%`, icon: <TrendingUp className="w-4 h-4 text-green-400" /> },
      { title: "Active Categories", value: pieData.length, icon: <Filter className="w-4 h-4 text-blue-400" /> }
    ];
  }, [transactions, pieData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-background text-foreground dark" : "bg-slate-50 text-slate-900"}`}>
      <div className="p-4 md:p-8 lg:p-12">
        <Header role={role} setRole={setRole} theme={theme} setTheme={setTheme} />

        <main className="max-w-7xl mx-auto">
        <SummaryCards summary={summary} />

        <DashboardCharts chartData={chartData} pieData={pieData} />

        {/* Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {insights.map((insight, i) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-muted/30 border-white/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{insight.title}</p>
                    {insight.icon}
                  </div>
                  <p className="text-xl font-semibold">{insight.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <TransactionTable 
          transactions={filteredTransactions}
          role={role}
          search={search}
          setSearch={setSearch}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          isGrouped={isGrouped}
          setIsGrouped={setIsGrouped}
          onDelete={handleDelete}
          onAdd={handleAddTransaction}
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          newTx={newTx}
          setNewTx={setNewTx}
        />
      </main>

      <Footer />
      </div>
    </div>
  );
}
