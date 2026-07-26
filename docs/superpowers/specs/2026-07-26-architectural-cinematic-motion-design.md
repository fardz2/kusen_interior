# Sahabat Alumunium Architectural Cinematic Motion

## Goal

Ubah landing editorial yang terasa statis menjadi pengalaman arsitektural sinematik. Motion harus memperjelas urutan, material, dan proses—bukan dekorasi acak. Identitas Studio Few tetap monokrom, lapang, presisi.

## Standards

- Impeccable: craft, animate, audit, polish.
- UI/UX Pro Max: aksesibilitas, target sentuh 44px, performa, responsive, kontinuitas spasial, reduced motion.
- Next.js 16: `page.tsx` tetap sync composition; semua browser API dan motion berada pada client leaves.
- Framer Motion dan Lenis yang sudah terpasang. Tidak menambah GSAP.

## Motion System

### 1. Opening sequence

- Intro overlay singkat menampilkan monogram `SA` dan dua garis ukur.
- Overlay terbuka seperti dua panel aluminium dalam 700–900ms.
- Tidak mengunci halaman lebih dari satu detik.
- Session storage mencegah intro penuh berulang pada navigasi dalam tab yang sama.

### 2. Hero choreography

- Metadata masuk stagger.
- Dua baris headline terungkap dari mask berbeda.
- Garis konstruksi menggambar melalui transform dan scale; tidak menganimasikan layout properties.
- Copy dan CTA naik lembut setelah headline.
- Pointer parallax hanya pada perangkat fine pointer; amplitudo kecil agar teks tetap stabil.

### 3. Scroll choreography

- Shared reveal primitive memakai IntersectionObserver melalui Framer Motion `whileInView`.
- Heading section, service rows, portfolio panels, dan process rows masuk berurutan.
- Portfolio memakai panel wipe horizontal bergantian.
- Process menampilkan progress line yang bertambah berdasarkan viewport progress.
- Contact finale memiliki word reveal dan garis footer yang membuka.

### 4. Micro-interactions

- CTA memiliki magnetic offset maksimal 6px pada fine pointer, lalu kembali dengan spring.
- Arrow bergerak 3–4px pada hover/focus.
- Navigation underline tetap tersedia; focus state tidak bergantung hover.
- Tidak ada cursor custom, scroll hijack, auto-marquee, atau motion tanpa fungsi.

## Accessibility and Performance

- `prefers-reduced-motion: reduce`: intro tidak ditampilkan, Lenis tidak dibuat, reveal langsung final, parallax/magnetic dimatikan.
- Touch tidak menjalankan pointer parallax atau magnetic interaction.
- Semua konten tetap berada di DOM dan terbaca tanpa JavaScript.
- Motion hanya memakai `transform`, `opacity`, dan `clip-path`; hindari width/height/top/left loops.
- Satu RAF loop Lenis; lifecycle cleanup wajib membatalkan RAF dan destroy instance.
- Durasi supporting motion 180–500ms; sequence utama maksimal 900ms.
- Tidak ada layout shift atau aset berat baru.

## Component Boundaries

```text
src/components/interactive/motion/
├── motion-provider.tsx       shared reduced-motion-safe config
├── intro-overlay.tsx         one-shot opening panels
├── hero-choreography.tsx     hero stagger + construction lines
├── reveal.tsx                reusable in-view reveal primitive
├── magnetic-link.tsx         pointer-only CTA feedback
└── process-progress.tsx      viewport progress line
```

Static section components tetap server components. Mereka hanya membungkus bagian visual dengan client leaves dan mengirim props serializable.

## Testing

Tests tetap di top-level `tests/`:

- Intro: first visit, repeated visit, reduced motion, cleanup.
- Hero: normal and reduced-motion variants.
- Reveal: hidden/start, visible/end, once behavior.
- Magnetic CTA: fine pointer, touch/coarse pointer, reset, keyboard semantics.
- Process progress: bounded 0–1 transform.
- Lenis: normal, reduced motion, RAF cleanup.
- Landing integration: semantic content/navigation tetap utuh.

Assertions menguji behavior dan accessibility, bukan snapshot style rapuh.

## Acceptance

- Motion terlihat jelas pada load dan scroll tanpa terasa seperti template efek.
- Desktop dan mobile tidak horizontal overflow.
- Keyboard, touch, dan reduced-motion paths tetap usable.
- Tidak ada klaim bisnis/foto/testimoni palsu.
- Vitest, typecheck, React Doctor, Impeccable detector lulus.
- Vercel deployment `READY`; production URL merender versi baru.
