import { navigation } from "@/lib/content/site-content";

export function SiteHeader() {
  return <header className="site-header">
    <a className="wordmark" href="#atas" aria-label="Sahabat Alumunium, beranda"><span>SA</span><strong>Sahabat<br/>Alumunium</strong></a>
    <nav aria-label="Navigasi utama"><ul>{navigation.map((item) => <li key={item.href}><a href={item.href}>{item.label}</a></li>)}</ul></nav>
    <a className="header-cta" href="#kontak">Konsultasi <span aria-hidden>↗</span></a>
  </header>;
}
