import { workTypes } from "@/lib/content/site-content";
import { Reveal } from "@/components/interactive/motion/reveal";

export function Work() { return <section className="work" id="karya">
  <Reveal className="work-title section-pad"><p>Bidang pekerjaan</p><h2>Dari garis ukur<br/>menjadi ruang.</h2></Reveal>
  <div className="work-grid">{workTypes.map((item, index) => <Reveal as="article" variant="wipe" direction={index % 2 ? "right" : "left"} index={index} key={item} className={`work-item work-${index + 1}`}><div className="architectural-placeholder"><span>Materi proyek<br/>segera hadir</span></div><h3>{item}</h3><span>0{index + 1}</span></Reveal>)}</div>
</section>; }
