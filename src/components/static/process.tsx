import { processSteps } from "@/lib/content/site-content";

export function Process() { return <section className="process section-pad" id="proses"><div className="section-intro"><p>Cara bekerja</p><h2>Terukur sejak<br/>percakapan pertama.</h2></div><ol>{processSteps.map((step, index) => <li aria-label={`Tahap ${index + 1}: ${step}`} key={step}><span>0{index + 1}</span><strong>{step}</strong><i aria-hidden>→</i></li>)}</ol></section>; }
