import { MotionHero } from "@/components/interactive/motion-hero";

export function Hero() {
  return <section className="hero" id="atas">
    <MotionHero
      metadata={["Kusen aluminium", "Desain interior", "Indonesia"]}
      headline={["Ruang presisi.", "Hidup lebih berarti."]}
      body="Kami merancang elemen aluminium dan interior sebagai satu kesatuan ruang—terukur, fungsional, dan dibuat untuk digunakan setiap hari."
      ctaLabel="Mulai konsultasi"
      ctaHref="#kontak"
    />
  </section>;
}
