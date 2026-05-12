"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Waypoints, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#demo", label: "Live Demo" },
  { href: "#features", label: "Features" },
  { href: "#how", label: "How It Works" },
  { href: "#analytics", label: "Analytics" },
  { href: "#tech", label: "Tech" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors",
        scrolled
          ? "bg-white/85 backdrop-blur border-b border-zinc-200"
          : "bg-transparent"
      )}
    >
      <div className="container">
        <nav className="flex h-16 items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
              <Waypoints className="h-4 w-4" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              LaneAI
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-md px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
            <Button variant="primary" size="sm" asChild>
              <a href="#demo">Start Detection</a>
            </Button>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-md text-zinc-700 hover:bg-zinc-100 lg:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-zinc-200 lg:hidden"
            >
              <ul className="flex flex-col gap-1 py-3">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
                <li className="flex gap-2 pt-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    Sign in
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1" asChild>
                    <a href="#demo" onClick={() => setOpen(false)}>
                      Start Detection
                    </a>
                  </Button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
