import { MotionHero } from "@/components/interactive/motion-hero";

export function Hero() {
  return <section className="hero" id="atas">
    <MotionHero>
      <div className="hero-meta"><span>Kusen aluminium</span><span>Desain interior</span><span>Indonesia</span></div>
      <h1>Ruang presisi.<br/><span>Hidup lebih berarti.</span></h1>
      <div className="hero-foot">
        <p>Kami merancang elemen aluminium dan interior sebagai satu kesatuan ruang—terukur, fungsional, dan dibuat untuk digunakan setiap hari.</p>
        <a className="button-solid" href="#kontak">Mulai konsultasi <span aria-hidden>↗</span></a>
      </div>
      <div className="hero-drawing" aria-hidden><i/><i/><i/><i/></div>
    </MotionHero>
  </section>;
}
