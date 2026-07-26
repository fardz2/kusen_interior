"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function MotionHero({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return <motion.div className="hero-inner" initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} transition={{ duration: reduced ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>;
}
