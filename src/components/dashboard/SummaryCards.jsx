import React from "react";
import { motion } from "motion/react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function SummaryCards({ summary }) {
  const items = [
    { title: "Total Balance", value: summary?.balance, icon: Wallet, color: "text-blue-400" },
    { title: "Total Income", value: summary?.income, icon: TrendingUp, color: "text-green-400" },
    { title: "Total Expenses", value: summary?.expenses, icon: TrendingDown, color: "text-red-400" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="glass-card overflow-hidden relative border-white/5 hover:border-white/10 transition-colors">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12`} />
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                {item.title}
              </CardDescription>
              <CardTitle className="text-3xl font-bold">
                ${item.value?.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
