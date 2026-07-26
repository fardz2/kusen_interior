import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ reduced: false as boolean | null, values: [] as Array<{ set: ReturnType<typeof vi.fn> }>, valueIndex: 0, spring: vi.fn() }));
vi.mock("framer-motion", () => ({
  useReducedMotion: () => mocks.reduced,
  useMotionValue: () => mocks.values[mocks.valueIndex++ % 2],
  useSpring: (value: unknown) => { mocks.spring(value); return value; },
  motion: { a: ({ style, ...props }: React.ComponentProps<"a"> & { style?: unknown }) => <a data-motion-style={style ? "yes" : "no"} {...props} /> },
}));

import { MagneticLink } from "@/components/interactive/motion/magnetic-link";

let fine = true;
let mediaListeners: Array<() => void> = [];
beforeEach(() => {
  fine = true; mocks.reduced = false; mocks.values = [{ set: vi.fn() }, { set: vi.fn() }]; mocks.valueIndex = 0; mocks.spring.mockClear(); mediaListeners = [];
  vi.stubGlobal("PointerEvent", MouseEvent);
  vi.stubGlobal("matchMedia", vi.fn(() => ({ get matches() { return fine; }, addEventListener: (_: string, fn: () => void) => mediaListeners.push(fn), removeEventListener: (_: string, fn: () => void) => { mediaListeners = mediaListeners.filter((item) => item !== fn); } })));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("MagneticLink", () => {
  it("preserves semantic href, label, focus, and keyboard activation", () => {
    render(<MagneticLink href="#kontak" className="button-solid">Mulai konsultasi</MagneticLink>);
    const link = screen.getByRole("link", { name: "Mulai konsultasi" });
    expect(link.getAttribute("href")).toBe("#kontak"); expect(link.classList.contains("button-solid")).toBe(true);
    link.focus(); expect(document.activeElement).toBe(link); fireEvent.keyDown(link, { key: "Enter" }); expect(link.getAttribute("href")).toBe("#kontak");
  });

  it("bounds fine-pointer displacement to 8px and resets on leave/cancel", async () => {
    render(<MagneticLink href="/x">X</MagneticLink>); const link = screen.getByRole("link");
    await waitFor(() => expect(link.getAttribute("data-motion-style")).toBe("yes"));
    vi.spyOn(link, "getBoundingClientRect").mockReturnValue({ left: 100, top: 100, width: 40, height: 40, right: 140, bottom: 140, x: 100, y: 100, toJSON: () => ({}) });
    fireEvent.pointerMove(link, { clientX: 500, clientY: 0 });
    expect(mocks.values[0].set).toHaveBeenLastCalledWith(8); expect(mocks.values[1].set).toHaveBeenLastCalledWith(-8);
    fireEvent.pointerLeave(link); expect(mocks.values[0].set).toHaveBeenLastCalledWith(0); expect(mocks.values[1].set).toHaveBeenLastCalledWith(0);
    fireEvent.pointerMove(link, { clientX: 500, clientY: 500 }); fireEvent.pointerCancel(link);
    expect(mocks.values[0].set).toHaveBeenLastCalledWith(0); expect(mocks.values[1].set).toHaveBeenLastCalledWith(0);
  });

  it.each([{ name: "coarse/no-hover", fine: false, reduced: false }, { name: "reduced", fine: true, reduced: true }, { name: "unknown reduced preference", fine: true, reduced: null }])("disables tracking for $name", ({ fine: pointer, reduced }) => {
    fine = pointer; mocks.reduced = reduced; render(<MagneticLink href="/x">X</MagneticLink>); fireEvent.pointerMove(screen.getByRole("link"), { clientX: 50, clientY: 50 });
    expect(mocks.values.every((value) => value.set.mock.calls.every(([offset]) => offset === 0))).toBe(true);
  });

  it("falls back to plain link when matchMedia is missing", () => {
    vi.stubGlobal("matchMedia", undefined);
    render(<MagneticLink href="/x">X</MagneticLink>);
    expect(screen.getByRole("link").getAttribute("data-motion-style")).toBe("no");
  });

  it("resets displacement when pointer capability becomes disabled", async () => {
    render(<MagneticLink href="/x">X</MagneticLink>); const link = screen.getByRole("link");
    await waitFor(() => expect(link.getAttribute("data-motion-style")).toBe("yes"));
    vi.spyOn(link, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 20, height: 20, right: 20, bottom: 20, x: 0, y: 0, toJSON: () => ({}) });
    fireEvent.pointerMove(link, { clientX: 100, clientY: 100 });
    fine = false; fireEvent(window, new Event("noop")); mediaListeners[0]();
    await waitFor(() => expect(link.getAttribute("data-motion-style")).toBe("no"));
    expect(mocks.values[0].set).toHaveBeenLastCalledWith(0); expect(mocks.values[1].set).toHaveBeenLastCalledWith(0);
  });

  it("removes only media-query listener on unmount and installs no global listeners", () => {
    const add = vi.spyOn(window, "addEventListener"); const remove = vi.spyOn(window, "removeEventListener");
    const view = render(<MagneticLink href="/x">X</MagneticLink>); expect(mediaListeners).toHaveLength(1); view.unmount(); expect(mediaListeners).toHaveLength(0); expect(add).not.toHaveBeenCalled(); expect(remove).not.toHaveBeenCalled();
  });

  it("uses legacy listener and matching cleanup", () => {
    const addListener = vi.fn<(listener: () => void) => void>();
    const removeListener = vi.fn<(listener: () => void) => void>();
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true, addListener, removeListener })));
    const view = render(<MagneticLink href="/x">X</MagneticLink>);
    expect(addListener).toHaveBeenCalledOnce(); view.unmount();
    expect(removeListener).toHaveBeenCalledWith(addListener.mock.calls[0][0]);
  });

  it("keeps initial match without listener APIs", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    expect(() => render(<MagneticLink href="/x">X</MagneticLink>)).not.toThrow();
    expect(screen.getByRole("link").getAttribute("data-motion-style")).toBe("yes");
  });
});
