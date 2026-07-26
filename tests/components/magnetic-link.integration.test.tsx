import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/interactive/motion/reveal", () => ({
  Reveal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import { Contact } from "@/components/static/contact";
import { Hero } from "@/components/static/hero";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("MagneticLink integration", () => {
  it("preserves actual hero and contact routes, labels, and classes", () => {
    vi.stubGlobal("PointerEvent", MouseEvent);
    vi.stubGlobal("matchMedia", vi.fn((query: string) => ({
      matches: query.includes("pointer:fine"),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));
    render(<><Hero/><Contact/></>);
    const heroLink = screen.getByRole("link", { name: /Mulai konsultasi/ });
    expect(heroLink.getAttribute("href")).toBe("#kontak"); expect(heroLink.classList.contains("button-solid")).toBe(true);
    expect(screen.getByText("Kontak resmi segera tersedia")).toBeTruthy();
    expect(screen.queryByRole("link", { name: /Kontak resmi segera tersedia/ })).toBeNull();
  });
});
