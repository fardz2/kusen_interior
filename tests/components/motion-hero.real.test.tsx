import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MotionHero } from "@/components/interactive/motion-hero";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true, media: "(prefers-reduced-motion: reduce)", onchange: null, addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn() })));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("uses real Framer Motion to show reduced-motion content and preserve drawing skew hosts", () => {
  render(<MotionHero metadata={["Sama", "Sama"]} headline={["Ruang presisi.", "Hidup berarti."]} body="Isi hero." ctaLabel="Kontak" ctaHref="#kontak" />);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Ruang presisi.Hidup berarti.");
  expect(screen.getByText("Isi hero.").style.opacity).not.toBe("0");
  expect(screen.getByRole("link", { name: "Kontak" })).toBeTruthy();
  for (const host of screen.getAllByTestId("hero-drawing-line")) {
    expect(host.tagName).toBe("I");
    expect(host.style.transform).toBe("");
    expect(host.firstElementChild?.getAttribute("data-testid")).toBe("hero-drawing-scale");
  }
});
