import { describe, expect, it } from "vitest";
import { navigation, processSteps, services, workTypes } from "@/lib/content/site-content";

describe("site content", () => {
  it("memakai anchor unik dan valid untuk semua navigasi", () => {
    expect(new Set(navigation.map((item) => item.href)).size).toBe(navigation.length);
    expect(navigation.every((item) => item.href.startsWith("#") && item.label.length > 0)).toBe(true);
  });
  it("menjaga layanan, kategori karya, dan proses tetap lengkap", () => {
    expect(services.map((service) => service.title)).toEqual(["Kusen Aluminium", "Desain Interior"]);
    expect(workTypes).toHaveLength(4); expect(processSteps).toHaveLength(5);
    expect([...processSteps]).toEqual(["Konsultasi", "Pengukuran", "Perencanaan", "Produksi", "Pemasangan"]);
  });
});
