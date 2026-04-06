import React, { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Plus, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Calendar,
  Layers
} from "lucide-react";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";

export function TransactionTable({ 
  transactions, 
  role, 
  search, 
  setSearch, 
  filterCategory, 
  setFilterCategory, 
  onDelete, 
  onAdd,
  isAddDialogOpen,
  setIsAddDialogOpen,
  newTx,
  setNewTx,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isGrouped,
  setIsGrouped
}) {
  const exportToCSV = () => {
    console.log("Exporting to CSV triggered. Transactions count:", transactions?.length);
    if (!transactions || transactions.length === 0) {
      console.warn("No transactions to export. Transactions array:", transactions);
      return;
    }
    try {
      const headers = ["Date", "Description", "Category", "Type", "Amount"];
      const rows = transactions.map(tx => [
        `"${tx.date}"`,
        `"${tx.description.replace(/"/g, '""')}"`,
        `"${tx.category}"`,
        `"${tx.type}"`,
        tx.amount
      ]);
      const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `zorvyn_transactions_${format(new Date(), "yyyy-MM-dd")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log("CSV Export successful");
    } catch (error) {
      console.error("CSV Export failed:", error);
    }
  };

  const exportToJSON = () => {
    console.log("Exporting to JSON triggered. Transactions count:", transactions?.length);
    if (!transactions || transactions.length === 0) {
      console.warn("No transactions to export. Transactions array:", transactions);
      return;
    }
    try {
      const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", url);
      downloadAnchorNode.setAttribute("download", `zorvyn_transactions_${format(new Date(), "yyyy-MM-dd")}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      URL.revokeObjectURL(url);
      console.log("JSON Export successful");
    } catch (error) {
      console.error("JSON Export failed:", error);
    }
  };

  const groupedTransactions = useMemo(() => {
    if (!isGrouped) return { "All Transactions": transactions };
    return transactions.reduce((acc, tx) => {
      const key = tx.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(tx);
      return acc;
    }, {});
  }, [transactions, isGrouped]);

  return (
    <Card className="glass-card border-white/5">
      <CardHeader className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Financial Activity</CardTitle>
            <CardDescription>Advanced monitoring and record management.</CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="bg-muted/50 border-white/5" />}>
                <Download className="w-4 h-4 mr-2" /> Export
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Format</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={exportToCSV} onSelect={exportToCSV}>CSV Spreadsheet</DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToJSON} onSelect={exportToJSON}>JSON Data</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant={isGrouped ? "secondary" : "outline"} 
              size="sm" 
              className="bg-muted/50 border-white/5"
              onClick={() => setIsGrouped(!isGrouped)}
            >
              <Layers className="w-4 h-4 mr-2" /> {isGrouped ? "Ungroup" : "Group by Category"}
            </Button>

            {role === "admin" && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90" />}>
                  <Plus className="w-4 h-4 mr-2" /> Add
                </DialogTrigger>
                <DialogContent className="bg-card border-white/10">
                  <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input 
                        placeholder="e.g. Grocery Shopping" 
                        value={newTx.description}
                        onChange={(e) => setNewTx({...newTx, description: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amount</label>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          value={newTx.amount}
                          onChange={(e) => setNewTx({...newTx, amount: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <Select value={newTx.type} onValueChange={(v) => setNewTx({...newTx, type: v})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select value={newTx.category} onValueChange={(v) => setNewTx({...newTx, category: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Transport">Transport</SelectItem>
                          <SelectItem value="Rent">Rent</SelectItem>
                          <SelectItem value="Salary">Salary</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Input 
                        type="date" 
                        value={newTx.date || format(new Date(), "yyyy-MM-dd")}
                        onChange={(e) => setNewTx({...newTx, date: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={onAdd}>Save Transaction</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Advanced Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-10 bg-muted/50 border-white/5 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="bg-muted/50 border-white/5 h-9 w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Rent">Rent</SelectItem>
                <SelectItem value="Salary">Salary</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Start Date</label>
            <Input 
              type="date" 
              className="bg-muted/50 border-white/5 h-9"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">End Date</label>
            <Input 
              type="date" 
              className="bg-muted/50 border-white/5 h-9"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-white/5 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                {role === "admin" && <TableHead className="w-[50px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedTransactions).map(([groupName, groupTxs]) => (
                <React.Fragment key={groupName}>
                  {isGrouped && (
                    <TableRow className="bg-muted/10 hover:bg-muted/10 border-none">
                      <TableCell colSpan={role === "admin" ? 6 : 5} className="py-2 px-4 font-semibold text-primary text-xs uppercase tracking-widest">
                        {groupName} ({groupTxs.length})
                      </TableCell>
                    </TableRow>
                  )}
                  <AnimatePresence mode="popLayout">
                    {groupTxs.length > 0 ? (
                      groupTxs.map((tx) => (
                        <motion.tr
                          key={tx.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="group hover:bg-white/5 transition-colors"
                        >
                          <TableCell className="text-muted-foreground text-xs">
                            {format(parseISO(tx.date), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell className="font-medium">{tx.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-muted/50 font-normal border-white/5">
                              {tx.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              {tx.type === "income" ? (
                                <>
                                  <ArrowUpRight className="w-3 h-3 text-green-400" />
                                  <span className="text-green-400 text-xs font-medium uppercase tracking-wider">Income</span>
                                </>
                              ) : (
                                <>
                                  <ArrowDownRight className="w-3 h-3 text-red-400" />
                                  <span className="text-red-400 text-xs font-medium uppercase tracking-wider">Expense</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className={`text-right font-semibold ${tx.type === "income" ? "text-green-400" : "text-foreground"}`}>
                            {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
                          </TableCell>
                          {role === "admin" && (
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all"
                                onClick={() => onDelete(tx.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          )}
                        </motion.tr>
                      ))
                    ) : null}
                  </AnimatePresence>
                </React.Fragment>
              ))}
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={role === "admin" ? 6 : 5} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 opacity-20" />
                      <p>No transactions found matching your search.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
