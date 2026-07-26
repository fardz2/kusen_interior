# Sahabat Alumunium Landing Design

## Scope
Landing Persuade statis untuk jasa kusen aluminium dan interior. Audiens campuran: rumah, developer, kontraktor, kantor, toko.

## Visitor path
1. Hero menjelaskan dua disiplin dan CTA konsultasi.
2. Service index membedakan aluminium dan interior.
3. Portfolio field menunjukkan kategori kerja tanpa klaim proyek palsu.
4. Process strip menjelaskan konsultasi, ukur, desain, produksi, pemasangan.
5. FAQ menjawab batas informasi dasar.
6. CTA akhir menyiapkan kontak; link sementara memakai anchor sampai nomor Canva tersedia.

## Architecture
- `src/app/page.tsx`: sync composition, tanpa await.
- `src/components/static/*`: RSC sinkron.
- `src/components/interactive/*`: Framer Motion, menu, Lenis saja.
- `src/lib/content/site-content.ts`: konten terketik.
- Tidak ada async data pada fase ini; cacheComponents tetap aktif tanpa cache palsu.

## Acceptance
- Semantik heading/nav/sections jelas.
- Mobile dan desktop.
- Reduced motion menghentikan smooth scroll dan choreography.
- Tidak ada harga, statistik, testimoni, alamat, nomor, atau klaim hasil palsu.
- Vitest menguji struktur dan perilaku reduced motion.
- Typecheck, tests, React Doctor lulus; build hanya Vercel.
