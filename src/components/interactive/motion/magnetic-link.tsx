"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

type MagneticLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

const FINE_POINTER = "(hover:hover) and (pointer:fine)";
const spring = { stiffness: 300, damping: 24 };

export function MagneticLink({ href, children, className, "aria-label": ariaLabel }: MagneticLinkProps) {
  const reduced = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);
  const enabled = finePointer && reduced === false;

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(FINE_POINTER);
    const update = () => setFinePointer(query.matches);
    update();
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    }
    if (typeof query.addListener === "function") {
      query.addListener(update);
      return () => query.removeListener(update);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      x.set(0);
      y.set(0);
    }
  }, [enabled, x, y]);

  const reset = () => {
    if (!enabled) return;
    x.set(0);
    y.set(0);
  };

  return <motion.a
    href={href}
    className={className}
    aria-label={ariaLabel}
    style={enabled ? { x: springX, y: springY } : undefined}
    onPointerMove={enabled ? (event) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      x.set(Math.max(-8, Math.min(8, event.clientX - (bounds.left + bounds.width / 2))));
      y.set(Math.max(-8, Math.min(8, event.clientY - (bounds.top + bounds.height / 2))));
    } : undefined}
    onPointerLeave={enabled ? reset : undefined}
    onPointerCancel={enabled ? reset : undefined}
  >{children}</motion.a>;
}
