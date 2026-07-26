import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(cleanup);

vi.mock("@/components/interactive/motion-hero", () => ({
  MotionHero: ({ metadata, headline, body, ctaLabel, ctaHref }: {
    metadata?: string[];
    headline: [string, string];
    body: string;
    ctaLabel: string;
    ctaHref: string;
  }) => <>
    {metadata?.map((item) => <span key={item}>{item}</span>)}
    <h1>{headline.map((line) => <span key={line}>{line}</span>)}</h1>
    <p>{body}</p>
    <a href={ctaHref}>{ctaLabel}</a>
  </>,
}));
vi.mock("@/components/interactive/motion/intro-overlay", () => ({ IntroOverlay: () => <div data-testid="intro-overlay" /> }));
vi.mock("@/components/interactive/smooth-scroll", () => ({ SmoothScroll: () => null }));
vi.mock("@/components/interactive/motion/reveal", () => ({
  Reveal: ({ as: Tag = "div", children, variant, direction, index, delay, once, ...props }: React.ComponentProps<"div"> & {
    as?: "div" | "article";
    variant?: unknown;
    direction?: unknown;
    index?: unknown;
    delay?: unknown;
    once?: unknown;
  }) => <Tag data-testid="reveal-wrapper" {...props}>{children}</Tag>,
}));

import Home from "@/app/page";

describe("Sahabat Alumunium landing", () => {
  it("menjelaskan layanan utama dan jalur konsultasi", () => {
    render(<Home />);

    expect(screen.getByTestId("intro-overlay")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1, name: /ruang presisi/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /kusen aluminium/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /desain interior/i })).toBeTruthy();
    expect(screen.getAllByRole("link", { name: /mulai konsultasi/i })[0]?.getAttribute("href")).toBe("#kontak");
  });

  it("menyediakan navigasi dan lima tahap proses", () => {
    render(<Home />);

    const nav = screen.getByRole("navigation", { name: /utama/i });
    expect(within(nav).getByRole("link", { name: /layanan/i }).getAttribute("href")).toBe("#layanan");
    expect(screen.getAllByRole("listitem", { name: /tahap/i })).toHaveLength(5);
  });

  it("renders services, four portfolio panels, and contact through Reveal", () => {
    render(<Home />);

    expect(within(document.querySelector("#layanan")!).getAllByTestId("reveal-wrapper")).toHaveLength(3);
    expect(within(document.querySelector("#karya")!).getAllByTestId("reveal-wrapper")).toHaveLength(5);
    expect(within(document.querySelector("#kontak")!).getAllByTestId("reveal-wrapper")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: /dua disiplin/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /kusen aluminium/i }).closest("article")).toBeTruthy();
    expect(screen.getByRole("heading", { name: /desain interior/i }).closest("article")).toBeTruthy();
    expect(screen.getAllByText(/materi proyek/i)).toHaveLength(4);
    expect(screen.getByRole("heading", { name: /mari ukur/i })).toBeTruthy();
    expect(screen.getByText(/ceritakan jenis ruang/i)).toBeTruthy();
  });
});
