import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { animationComplete, reducedMotionMock } = vi.hoisted(() => ({
  animationComplete: { current: undefined as undefined | (() => void) },
  reducedMotionMock: vi.fn(),
}));
vi.mock("framer-motion", () => ({
  useReducedMotion: reducedMotionMock,
  motion: {
    div: ({ initial, animate, transition, onAnimationComplete, ...props }: React.ComponentProps<"div"> & { initial?: unknown; animate?: unknown; transition?: unknown; onAnimationComplete?: () => void }) => {
      animationComplete.current = onAnimationComplete;
      return <div data-initial={JSON.stringify(initial)} data-animate={JSON.stringify(animate)} data-transition={JSON.stringify(transition)} {...props} />;
    },
  },
}));

import { IntroOverlay } from "@/components/interactive/motion/intro-overlay";

beforeEach(() => {
  sessionStorage.clear();
  animationComplete.current = undefined;
  reducedMotionMock.mockReturnValue(false);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("IntroOverlay", () => {
  it("shows a decorative, non-interactive transform/opacity intro once per tab", async () => {
    render(<IntroOverlay />);
    const overlay = await screen.findByTestId("intro-overlay");

    expect(overlay.getAttribute("aria-hidden")).toBe("true");
    expect(overlay.className).toContain("pointer-events-none");
    expect(JSON.parse(overlay.dataset.initial ?? "{}")).toEqual({ opacity: 1, scale: 1.02 });
    expect(JSON.parse(overlay.dataset.animate ?? "{}")).toEqual({ opacity: 0, scale: 1 });
    expect(JSON.parse(overlay.dataset.transition ?? "{}").duration).toBeLessThanOrEqual(0.9);
    expect(sessionStorage.getItem("kusen-intro-seen")).toBe("1");

    act(() => animationComplete.current?.());
    expect(screen.queryByTestId("intro-overlay")).toBeNull();

    render(<IntroOverlay />);
    await waitFor(() => expect(screen.queryByTestId("intro-overlay")).toBeNull());
  });

  it("skips intro when reduced motion is preferred", async () => {
    reducedMotionMock.mockReturnValue(true);
    render(<IntroOverlay />);

    await waitFor(() => expect(screen.queryByTestId("intro-overlay")).toBeNull());
    expect(sessionStorage.getItem("kusen-intro-seen")).toBe("1");
  });

  it("waits for reduced-motion preference, then skips and marks seen", async () => {
    reducedMotionMock.mockReturnValue(null);
    const view = render(<IntroOverlay />);

    expect(screen.queryByTestId("intro-overlay")).toBeNull();
    expect(sessionStorage.getItem("kusen-intro-seen")).toBeNull();

    reducedMotionMock.mockReturnValue(true);
    view.rerender(<IntroOverlay />);
    await waitFor(() => expect(sessionStorage.getItem("kusen-intro-seen")).toBe("1"));
    expect(screen.queryByTestId("intro-overlay")).toBeNull();
  });

  it("stays usable and shows one mount intro when storage reads throw", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new DOMException("blocked", "SecurityError"); });

    render(<IntroOverlay />);
    expect(await screen.findByTestId("intro-overlay")).toBeTruthy();
    act(() => animationComplete.current?.());
    expect(screen.queryByTestId("intro-overlay")).toBeNull();
  });

  it("stays usable and honors reduced motion when storage writes throw", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("blocked", "SecurityError"); });
    reducedMotionMock.mockReturnValue(true);

    render(<IntroOverlay />);
    await waitFor(() => expect(screen.queryByTestId("intro-overlay")).toBeNull());
  });
});
