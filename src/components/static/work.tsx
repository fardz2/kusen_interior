import { workTypes } from "@/lib/content/site-content";

export function Work() { return <section className="work" id="karya">
  <div className="work-title section-pad"><p>Bidang pekerjaan</p><h2>Dari garis ukur<br/>menjadi ruang.</h2></div>
  <div className="work-grid">{workTypes.map((item, index) => <article key={item} className={`work-item work-${index + 1}`}><div className="architectural-placeholder"><span>Materi proyek<br/>segera hadir</span></div><h3>{item}</h3><span>0{index + 1}</span></article>)}</div>
</section>; }
