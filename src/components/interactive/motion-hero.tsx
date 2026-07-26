"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MagneticLink } from "@/components/interactive/motion/magnetic-link";

type MotionHeroProps = {
  metadata: string[];
  headline: [string, string];
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32 } },
};
const line = {
  hidden: { scaleX: 0, opacity: 0 },
  show: { scaleX: 1, opacity: 1, transition: { duration: 0.4 } },
};

export function MotionHero({ metadata, headline, body, ctaLabel, ctaHref }: MotionHeroProps) {
  const reduced = useReducedMotion();
  const immediate = reduced !== false ? { initial: false as const, transition: { duration: 0 } } : {};
  return <motion.div
    className="hero-inner"
    data-testid="hero-sequence"
    initial={reduced === false ? "hidden" : false}
    animate="show"
    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
  >
    <div className="hero-meta">{metadata.map((item, index) => <motion.span key={index} data-testid="hero-meta-item" variants={rise} {...immediate}>{item}</motion.span>)}</div>
    <h1>{headline.map((text, index) => <span className="hero-headline-mask" key={index} style={{ color: index ? "var(--silver)" : "var(--ink)", display: "block", overflow: "hidden" }}>
      <motion.span data-testid="hero-headline-line" variants={rise} {...immediate} style={{ color: "inherit", display: "block" }}>{text}</motion.span>
    </span>)}</h1>
    <motion.div className="hero-foot" data-testid="hero-foot" variants={rise} {...immediate}>
      <p>{body}</p>
      <MagneticLink className="button-solid" href={ctaHref}>{ctaLabel} <span aria-hidden>↗</span></MagneticLink>
    </motion.div>
    <div className="hero-drawing" aria-hidden>{[0, 1, 2, 3].map((item, index) => <i key={index} data-testid="hero-drawing-line"><motion.span data-testid="hero-drawing-scale" variants={line} {...immediate} style={{ originX: item % 2 ? 1 : 0 }}/></i>)}</div>
  </motion.div>;
}
