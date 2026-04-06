import React from "react";

export function Footer() {
  return (
    <footer className="mt-12 py-8 border-t border-white/5 text-center text-muted-foreground text-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-6 mb-2">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
        </div>
        <p>© 2026 Zorvyn Finance. Built for secure financial intelligence.</p>
      </div>
    </footer>
  );
}
