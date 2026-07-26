import { ProcessProgress } from "@/components/interactive/motion/process-progress";
import { processSteps } from "@/lib/content/site-content";

export function Process() { return <section className="process section-pad" id="proses"><div className="section-intro"><p>Cara bekerja</p><h2>Terukur sejak<br/>percakapan pertama.</h2></div><ProcessProgress steps={[...processSteps]} /></section>; }
