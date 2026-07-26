import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(cleanup);

vi.mock("@/components/interactive/motion-hero", () => ({
  MotionHero: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/components/interactive/smooth-scroll", () => ({ SmoothScroll: () => null }));

import Home from "@/app/page";

describe("Sahabat Alumunium landing", () => {
  it("menjelaskan layanan utama dan jalur konsultasi", () => {
    render(<Home />);

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
});
