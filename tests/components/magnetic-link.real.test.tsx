import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MagneticLink } from "@/components/interactive/motion/magnetic-link";

beforeEach(() => {
  vi.stubGlobal("PointerEvent", MouseEvent);
  vi.stubGlobal("matchMedia", vi.fn((query: string) => ({
    matches: query.includes("pointer:fine"),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("uses real Framer Motion for bounded pointer attraction and reset", async () => {
  render(<MagneticLink href="#kontak">Kontak</MagneticLink>);
  const link = screen.getByRole("link", { name: "Kontak" });
  vi.spyOn(link, "getBoundingClientRect").mockReturnValue({
    left: 100, top: 100, width: 40, height: 40,
    right: 140, bottom: 140, x: 100, y: 100,
    toJSON: () => ({}),
  });

  await waitFor(() => {
    fireEvent.pointerMove(link, { clientX: 500, clientY: 0 });
    expect(link.style.transform).not.toBe("");
    expect(link.style.transform).not.toBe("none");
  });

  fireEvent.pointerLeave(link);
  await waitFor(() => expect(["", "none", "translateX(0px) translateY(0px)"]).toContain(link.style.transform), { timeout: 1500 });
  expect(link.getAttribute("href")).toBe("#kontak");
});
