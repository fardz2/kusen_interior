import { services } from "@/lib/content/site-content";
import { Reveal } from "@/components/interactive/motion/reveal";

export function Services() { return <section className="services section-pad" id="layanan">
  <Reveal className="section-intro"><p>Apa yang kami kerjakan</p><h2>Dua disiplin.<br/>Satu ruang yang utuh.</h2></Reveal>
  <div className="service-list">{services.map((service, index) => <Reveal as="article" index={index} key={service.title}>
    <span className="service-index">0{index + 1}</span><h3>{service.title}</h3><p>{service.description}</p><small>{service.detail}</small>
  </Reveal>)}</div>
</section>; }
