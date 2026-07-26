import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { constructorMock, destroyMock, rafMock } = vi.hoisted(() => ({
  constructorMock: vi.fn(), destroyMock: vi.fn(), rafMock: vi.fn(),
}));
vi.mock("lenis", () => ({ default: class { constructor(options: unknown) { constructorMock(options); } raf = rafMock; destroy = destroyMock; } }));

import { SmoothScroll } from "@/components/interactive/smooth-scroll";

let reduced = false;
beforeEach(() => {
  vi.clearAllMocks(); reduced = false;
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: reduced })));
  vi.stubGlobal("requestAnimationFrame", vi.fn(() => 77));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("SmoothScroll", () => {
  it("tidak mengaktifkan Lenis saat reduced motion diminta", () => {
    reduced = true; render(<SmoothScroll />); expect(constructorMock).not.toHaveBeenCalled();
  });
  it("mengaktifkan Lenis dengan konfigurasi lembut", () => {
    render(<SmoothScroll />); expect(constructorMock).toHaveBeenCalledWith({ duration: 1.05, smoothWheel: true });
  });
  it("membersihkan frame dan instance saat unmount", () => {
    const view = render(<SmoothScroll />); view.unmount();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(77); expect(destroyMock).toHaveBeenCalledOnce();
  });
});
