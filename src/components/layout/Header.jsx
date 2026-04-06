import React from "react";
import { motion } from "motion/react";
import { Wallet, Eye, Shield, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({ role, setRole, theme, setTheme }) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Zorvyn Finance</h1>
        </div>
        <p className="text-muted-foreground">Secure, intelligent financial monitoring.</p>
      </motion.div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-muted/50 border border-white/5"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 bg-muted/50 p-1 rounded-full border border-white/5"
        >
          <Button 
            variant={role === "viewer" ? "secondary" : "ghost"} 
            size="sm" 
            className="rounded-full px-6"
            onClick={() => setRole("viewer")}
          >
            <Eye className="w-4 h-4 mr-2" /> Viewer
          </Button>
          <Button 
            variant={role === "admin" ? "secondary" : "ghost"} 
            size="sm" 
            className="rounded-full px-6"
            onClick={() => setRole("admin")}
          >
            <Shield className="w-4 h-4 mr-2" /> Admin
          </Button>
        </motion.div>
      </div>
    </header>
  );
}
