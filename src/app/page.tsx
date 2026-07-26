import { IntroOverlay } from "@/components/interactive/motion/intro-overlay";
import { SmoothScroll } from "@/components/interactive/smooth-scroll";
import { Contact } from "@/components/static/contact";
import { Hero } from "@/components/static/hero";
import { Process } from "@/components/static/process";
import { Services } from "@/components/static/services";
import { SiteHeader } from "@/components/static/site-header";
import { Work } from "@/components/static/work";

export default function Home() {
  return <><IntroOverlay/><SmoothScroll/><SiteHeader/><main><Hero/><Services/><Work/><Process/><Contact/></main></>;
}
