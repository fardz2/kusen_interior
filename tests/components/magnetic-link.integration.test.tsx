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
    const links = screen.getAllByRole("link", { name: /Mulai konsultasi/ });
    expect(links[0].getAttribute("href")).toBe("#kontak"); expect(links[0].classList.contains("button-solid")).toBe(true);
    expect(links[1].getAttribute("href")).toBe("mailto:halo@sahabatalumunium.id"); expect(links[1].classList.contains("button-light")).toBe(true);
  });
});
