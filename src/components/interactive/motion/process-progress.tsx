"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProcessProgress({ steps }: { steps: string[] }) {
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const canObserve = reduced === false && typeof IntersectionObserver !== "undefined";

  useEffect(() => {
    const list = listRef.current;
    if (!canObserve) {
      setVisible(true);
      return;
    }
    if (!list) return;
    // Preserve visible hydration; only prime content starting below viewport.
    if (list.getBoundingClientRect().top >= window.innerHeight) setVisible(false);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(list);
    return () => observer.disconnect();
  }, [canObserve]);

  const transition = (delay = 0) => canObserve
    ? { duration: 0.5, delay: Math.min(0.5, delay), ease }
    : { duration: 0 };

  return <div className="process-progress" ref={listRef}>
    <motion.div
      aria-hidden="true"
      className="process-progress-line"
      data-testid="process-progress-line"
      initial={false}
      animate={visible ? "visible" : "hidden"}
      variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
      transition={transition()}
    />
    <ol>{steps.map((step, index) => <motion.li
      aria-label={`Tahap ${index + 1}: ${step}`}
      key={`${index}-${step}`}
      initial={false}
      animate={visible ? "visible" : "hidden"}
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      transition={transition(index * 0.08)}
    ><span>0{index + 1}</span><strong>{step}</strong><i aria-hidden>→</i></motion.li>)}</ol>
  </div>;
}
