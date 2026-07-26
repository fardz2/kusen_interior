import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { reducedMotionMock } = vi.hoisted(() => ({ reducedMotionMock: vi.fn() }));
vi.mock("framer-motion", () => {
  const element = (Tag: "div" | "article") => ({ children, initial, animate, variants, transition, ...props }: React.ComponentProps<"div"> & Record<string, unknown>) => <Tag data-initial={JSON.stringify(initial)} data-animate={JSON.stringify(animate)} data-variants={JSON.stringify(variants)} data-transition={JSON.stringify(transition)} {...props}>{children as React.ReactNode}</Tag>;
  return { useReducedMotion: reducedMotionMock, motion: { div: element("div"), article: element("article") } };
});
import { Reveal } from "@/components/interactive/motion/reveal";

function forbiddenRevealProps() {
  // @ts-expect-error motion callbacks are not public Reveal props
  return <Reveal onDrag={() => undefined}>x</Reveal>;
}
void forbiddenRevealProps;
const prop = (name: string) => JSON.parse(screen.getByTestId("reveal").getAttribute(name) ?? "null");

describe("Reveal", () => {
  beforeEach(() => {
    reducedMotionMock.mockReturnValue(false);
    vi.stubGlobal("IntersectionObserver", class {
      observe() {}
      disconnect() {}
    });
  });
  afterEach(() => { cleanup(); vi.clearAllMocks(); vi.unstubAllGlobals(); });
  it("starts final for hydration stability and keeps reveal variants", () => {
    render(<Reveal data-testid="reveal"><h2>Heading</h2></Reveal>);
    expect(prop("data-initial")).toBe(false);
    expect(prop("data-animate")).toBe("visible");
    expect(prop("data-variants")).toMatchObject({ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } });
  });
  it("caps indexed delay", () => {
    render(<Reveal data-testid="reveal" index={99} delay={0.1}>x</Reveal>);
    expect(prop("data-transition")).toMatchObject({ duration: 0.5, delay: 0.5 });
  });
  it.each([true, null])("keeps reduced/unknown visible: %s", (reduced) => {
    reducedMotionMock.mockReturnValue(reduced);
    render(<Reveal data-testid="reveal">x</Reveal>);
    expect(prop("data-initial")).toBe(false);
    expect(prop("data-animate")).toBe("visible");
    expect(prop("data-transition")).toEqual({ duration: 0 });
  });
  it("preserves safe DOM props", () => {
    render(<Reveal data-testid="reveal" as="article" className="panel" id="project"><h3>Project</h3></Reveal>);
    expect(screen.getByTestId("reveal").tagName).toBe("ARTICLE");
    expect(screen.getByTestId("reveal").className).toBe("panel");
  });
});
