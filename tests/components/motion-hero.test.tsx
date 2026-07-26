import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { reducedMotionMock } = vi.hoisted(() => ({ reducedMotionMock: vi.fn() }));
vi.mock("framer-motion", () => {
  const element = (tag: "div" | "span") => ({ children, initial, animate, variants, transition, ...props }: React.ComponentProps<"div"> & { initial?: unknown; animate?: unknown; variants?: unknown; transition?: unknown }) => {
    const Tag = tag;
    return <Tag data-initial={JSON.stringify(initial)} data-animate={JSON.stringify(animate)} data-variants={JSON.stringify(variants)} data-transition={JSON.stringify(transition)} {...props}>{children}</Tag>;
  };
  const value = { set: vi.fn() };
  return { useReducedMotion: reducedMotionMock, useMotionValue: () => value, useSpring: (item: unknown) => item, motion: { div: element("div"), span: element("span"), a: ({ children, style: _style, ...props }: React.ComponentProps<"a">) => <a {...props}>{children}</a> } };
});
import { MotionHero } from "@/components/interactive/motion-hero";

afterEach(() => { cleanup(); vi.clearAllMocks(); });

const hero = <MotionHero metadata={["Kusen aluminium", "Desain interior", "Indonesia"]} headline={["Ruang presisi.", "Hidup lebih berarti."]} body="Kami merancang ruang terukur." ctaLabel="Mulai konsultasi" ctaHref="#kontak" />;

function parsed(element: HTMLElement, key: "initial" | "animate" | "variants" | "transition") {
  return JSON.parse(element.dataset[key] ?? "null");
}

describe("MotionHero", () => {
  it("stages metadata, separately masked headline lines, then body and CTA", () => {
    reducedMotionMock.mockReturnValue(false); render(hero);
    expect(parsed(screen.getByTestId("hero-sequence"), "variants").show.transition.staggerChildren).toBeGreaterThan(0);
    expect(screen.getAllByTestId("hero-meta-item")).toHaveLength(3);
    const lines = screen.getAllByTestId("hero-headline-line");
    expect(lines).toHaveLength(2);
    expect(lines.every((line) => line.parentElement?.className.includes("hero-headline-mask"))).toBe(true);
    expect(parsed(lines[0], "variants").hidden).toMatchObject({ opacity: 0, y: expect.any(Number) });
    expect(parsed(screen.getByTestId("hero-foot"), "variants").show.transition.duration).toBeLessThanOrEqual(0.5);
  });

  it.each([true, null])("renders immediate final state when reduced motion is %s", (reduced) => {
    reducedMotionMock.mockReturnValue(reduced); render(hero);
    expect(parsed(screen.getByTestId("hero-sequence"), "initial")).toBe(false);
    for (const node of screen.getAllByTestId(/hero-(meta-item|headline-line|foot|drawing-scale)/)) expect(parsed(node, "initial")).toBe(false);
  });

  it("keeps semantic content DOM-readable and heading hierarchy unchanged", () => {
    reducedMotionMock.mockReturnValue(false); render(hero);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Ruang presisi.Hidup lebih berarti.");
    expect(screen.getByText("Kami merancang ruang terukur.")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Mulai konsultasi" }).getAttribute("href")).toBe("#kontak");
  });

  it("keeps CSS-skewed hosts separate from animated scales", () => {
    reducedMotionMock.mockReturnValue(false); render(hero);
    const hosts = screen.getAllByTestId("hero-drawing-line");
    const scales = screen.getAllByTestId("hero-drawing-scale");
    expect(hosts).toHaveLength(4);
    expect(scales.every((scale, index) => scale.parentElement === hosts[index])).toBe(true);
    expect(hosts.every((host) => host.getAttribute("style") === null)).toBe(true);
    expect(scales.map((scale) => parsed(scale, "variants").hidden.scaleX)).toEqual([0, 0, 0, 0]);
  });

  it("finishes ten-item focal choreography within 900ms", () => {
    reducedMotionMock.mockReturnValue(false); render(hero);
    const stagger = parsed(screen.getByTestId("hero-sequence"), "variants").show.transition.staggerChildren;
    const duration = parsed(screen.getAllByTestId("hero-drawing-scale")[0], "variants").show.transition.duration;
    expect(9 * stagger + duration).toBeLessThanOrEqual(0.9);
  });
});
