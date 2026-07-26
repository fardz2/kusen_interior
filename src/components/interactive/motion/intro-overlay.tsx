"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const SEEN_KEY = "kusen-intro-seen";

export function IntroOverlay() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion === null) return;

    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      // Storage can be unavailable; continue without persistence.
    }

    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Intro still runs at most once for this mount.
    }

    if (reducedMotion === false) setVisible(true);
  }, [reducedMotion]);

  if (!visible) return null;

  return (
    <motion.div
      data-testid="intro-overlay"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 grid place-items-center bg-black text-white"
      initial={{ opacity: 1, scale: 1.02 }}
      animate={{ opacity: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => setVisible(false)}
    >
      <strong className="text-sm uppercase tracking-[0.3em]">Sahabat Alumunium</strong>
    </motion.div>
  );
}
