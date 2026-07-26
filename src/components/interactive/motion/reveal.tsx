"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export type RevealProps = {
  as?: "div" | "article";
  children: ReactNode;
  className?: string;
  id?: string;
  title?: string;
  "data-testid"?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
  variant?: "rise" | "wipe";
  direction?: "left" | "right";
  index?: number;
  delay?: number;
  once?: boolean;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ as = "div", children, variant = "rise", direction = "left", index = 0, delay = 0, once = true, ...props }: RevealProps) {
  const reduced = useReducedMotion();
  const elementRef = useRef<HTMLElement>(null);
  const setElementRef = (element: HTMLDivElement | HTMLElement | null) => {
    elementRef.current = element;
  };
  const [visible, setVisible] = useState(true);
  const canObserve = reduced === false && typeof IntersectionObserver !== "undefined";
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !canObserve) return;
    // Preserve visible hydration; only prime entries that start below viewport.
    if (element.getBoundingClientRect().top >= window.innerHeight) setVisible(false);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        if (once) observer.disconnect();
      } else if (!once) setVisible(false);
    }, { threshold: 0.2 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [canObserve, once]);
  const variants = variant === "wipe"
    ? {
        hidden: { opacity: 0, x: direction === "left" ? -20 : 20, clipPath: direction === "left" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" },
        visible: { opacity: 1, x: 0, clipPath: "inset(0 0 0 0)" },
      }
    : { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
  const transition = !canObserve
    ? { duration: 0 }
    : { duration: 0.5, delay: Math.min(0.5, Math.max(0, delay + index * 0.08)), ease };
  const domProps = {
    className: props.className,
    id: props.id,
    title: props.title,
    "data-testid": props["data-testid"],
    "aria-label": props["aria-label"],
    "aria-hidden": props["aria-hidden"],
  };
  const motionProps = {
    ...domProps,
    ref: setElementRef,
    initial: false as const,
    animate: visible ? "visible" : "hidden",
    variants,
    transition,
  };

  return as === "article"
    ? <motion.article {...motionProps}>{children}</motion.article>
    : <motion.div {...motionProps}>{children}</motion.div>;
}
