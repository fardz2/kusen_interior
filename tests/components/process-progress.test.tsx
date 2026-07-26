import React from "react";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProcessProgress } from "@/components/interactive/motion/process-progress";

const steps = ["Konsultasi", "Pengukuran", "Perencanaan", "Produksi", "Pemasangan"];
let observerCallback: IntersectionObserverCallback;
let disconnect: ReturnType<typeof vi.fn>;
let reduced = false;
const mediaListeners = new Set<(event: MediaQueryListEvent) => void>();

function setReduced(next: boolean) {
  reduced = next;
  const event = { matches: next, media: "(prefers-reduced-motion: reduce)" } as MediaQueryListEvent;
  mediaListeners.forEach((listener) => listener(event));
}

describe("ProcessProgress", () => {
  beforeEach(() => {
    reduced = false;
    disconnect = vi.fn();
    vi.stubGlobal("matchMedia", vi.fn().mockImplementation((query: string) => ({
      matches: reduced,
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => mediaListeners.add(listener),
      removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => mediaListeners.delete(listener),
      addListener: (listener: (event: MediaQueryListEvent) => void) => mediaListeners.add(listener),
      removeListener: (listener: (event: MediaQueryListEvent) => void) => mediaListeners.delete(listener),
      dispatchEvent: () => true,
    })));
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: IntersectionObserverCallback) { observerCallback = callback; }
      observe() {}
      unobserve() {}
      disconnect = disconnect;
      root = null;
      rootMargin = "0px";
      thresholds = [0.2];
      takeRecords = () => [];
    });
  });

  afterEach(() => {
    cleanup();
    mediaListeners.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("keeps list semantics for duplicate labels and empty steps", () => {
    const { rerender } = render(<ProcessProgress steps={["Ukur", "Ukur"]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByLabelText("Tahap 1: Ukur")).toBeTruthy();
    expect(screen.getByLabelText("Tahap 2: Ukur")).toBeTruthy();
    rerender(<ProcessProgress steps={[]} />);
    expect(screen.getByRole("list").children).toHaveLength(0);
    expect(screen.getByTestId("process-progress-line").getAttribute("aria-hidden")).toBe("true");
  });

  it("uses real Framer runtime to hide below fold, reveal, restore on reduced motion, and disconnect", async () => {
    const rectSpy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({ top: innerHeight + 1 } as DOMRect);
    const { unmount } = render(<ProcessProgress steps={steps} />);
    const line = screen.getByTestId("process-progress-line");
    const items = screen.getAllByRole("listitem");

    await waitFor(() => expect(line.style.transform).toContain("scaleX(0)"));
    await waitFor(() => expect(items[0].style.opacity).toBe("0"));

    act(() => observerCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    await waitFor(() => expect(["none", "scaleX(1)"]).toContain(line.style.transform), { timeout: 1500 });
    await waitFor(() => expect(items[0].style.opacity).toBe("1"), { timeout: 1500 });
    expect(disconnect).toHaveBeenCalled();

    rectSpy.mockReturnValue({ top: innerHeight + 1 } as DOMRect);
    act(() => setReduced(false));
    act(() => setReduced(true));
    await waitFor(() => expect(["none", "scaleX(1)"]).toContain(line.style.transform));
    await waitFor(() => expect(items[0].style.opacity).toBe("1"));

    disconnect.mockClear();
    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
    rectSpy.mockRestore();
  });

  it("keeps muted track distinct from layered black animated foreground", () => {
    const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
    expect(css).toMatch(/\.process ol\s*\{[^}]*border-top:\s*1px solid var\(--silver\)/);
    expect(css).toMatch(/\.process-progress-line\s*\{[^}]*z-index:\s*1[^}]*background:\s*#000/);
  });
});
