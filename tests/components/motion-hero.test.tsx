import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { reducedMotionMock } = vi.hoisted(() => ({ reducedMotionMock: vi.fn() }));
vi.mock("framer-motion", () => ({
  useReducedMotion: reducedMotionMock,
  motion: { div: ({ children, initial, transition, ...props }: React.ComponentProps<"div"> & { initial?: unknown; transition?: unknown }) => <div data-initial={JSON.stringify(initial)} data-duration={(transition as { duration?: number })?.duration} {...props}>{children}</div> },
}));
import { MotionHero } from "@/components/interactive/motion-hero";
afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe("MotionHero", () => {
  it("memakai clip reveal pada preferensi motion normal", () => {
    reducedMotionMock.mockReturnValue(false); render(<MotionHero><span>Hero</span></MotionHero>);
    expect(screen.getByText("Hero").parentElement?.dataset.initial).toContain("100%");
  });
  it("menonaktifkan entrance saat reduced motion", () => {
    reducedMotionMock.mockReturnValue(true); render(<MotionHero><span>Hero</span></MotionHero>);
    expect(screen.getByText("Hero").parentElement?.dataset.initial).toBe("false");
    expect(screen.getByText("Hero").parentElement?.dataset.duration).toBe("0");
  });
});
