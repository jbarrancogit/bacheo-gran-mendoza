"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AlsoSawButton({ initialCount }: { initialCount: number }) {
  const [voted, setVoted] = useState(false);
  const count = voted ? initialCount + 1 : initialCount;

  return (
    <Button
      onClick={() => setVoted((v) => !v)}
      variant={voted ? "default" : "outline"}
      className="gap-2"
      aria-pressed={voted}
    >
      <AnimatePresence mode="wait" initial={false}>
        {voted ? (
          <motion.span
            key="voted"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2"
          >
            <Check className="h-4 w-4" aria-hidden />
            Yo también lo vi
          </motion.span>
        ) : (
          <motion.span
            key="unvoted"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2"
          >
            <Eye className="h-4 w-4" aria-hidden />
            Yo también lo vi
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span
        key={count}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold tabular-nums"
      >
        {count}
      </motion.span>
    </Button>
  );
}
