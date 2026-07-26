import React, { act } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "@/components/interactive/motion/reveal";

class Observer {
  static instances: Observer[] = [];
  callback: IntersectionObserverCallback;
  element?: Element;
  disconnect = vi.fn();
  unobserve = vi.fn();
  observe = vi.fn((element: Element) => { this.element = element; });
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = "0px";
  thresholds = [0.2];

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    Observer.instances.push(this);
  }

  intersect(isIntersecting: boolean) {
    if (!this.element) throw new Error("observer has no target");
    this.callback([{ isIntersecting, target: this.element } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

const media = (matches: boolean) => ({ matches, media: "(prefers-reduced-motion: reduce)", onchange: null, addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn() });

beforeEach(() => {
  Observer.instances = [];
  vi.stubGlobal("matchMedia", vi.fn(() => media(false)));
  vi.stubGlobal("IntersectionObserver", Observer);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: 1000, bottom: 1100, left: 0, right: 100, width: 100, height: 100, x: 0, y: 1000, toJSON: () => ({}) });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); document.body.innerHTML = ""; });

describe("Reveal with real Framer Motion", () => {
  it("reveals on intersection and once=true never hides again", async () => {
    render(<Reveal data-testid="reveal"><h2>Observed</h2></Reveal>);
    await waitFor(() => expect(Observer.instances[0]?.element).toBe(screen.getByTestId("reveal")));
    await waitFor(() => expect(Number(screen.getByTestId("reveal").style.opacity)).toBeLessThan(0.05));
    act(() => Observer.instances[0].intersect(true));
    await waitFor(() => expect(screen.getByTestId("reveal").style.opacity).toBe("1"));
    act(() => Observer.instances[0].intersect(false));
    expect(screen.getByTestId("reveal").style.opacity).toBe("1");
  });

  it("fails visible without IntersectionObserver", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Reveal data-testid="reveal"><span>Readable</span></Reveal>);
    await act(async () => {});
    expect(screen.getByText("Readable")).toBeTruthy();
    expect(screen.getByTestId("reveal").style.opacity).not.toBe("0");
  });

  it("hydrates visible without mismatch or visible-to-hidden change", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: 0, bottom: 100, left: 0, right: 100, width: 100, height: 100, x: 0, y: 0, toJSON: () => ({}) });
    vi.stubGlobal("matchMedia", undefined);
    const html = renderToString(<Reveal data-testid="reveal"><h2>Stable</h2></Reveal>);
    const host = document.createElement("div");
    host.innerHTML = html;
    document.body.append(host);
    expect(host.querySelector<HTMLElement>("[data-testid=reveal]")?.style.opacity).not.toBe("0");
    vi.stubGlobal("matchMedia", vi.fn(() => media(false)));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await act(async () => { hydrateRoot(host, <Reveal data-testid="reveal"><h2>Stable</h2></Reveal>); });
    expect(host.textContent).toContain("Stable");
    expect(host.querySelector<HTMLElement>("[data-testid=reveal]")?.style.opacity).not.toBe("0");
    expect(error.mock.calls.flat().join(" ")).not.toMatch(/hydration|did not match/i);
  });
});
