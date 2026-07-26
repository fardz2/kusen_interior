# Architectural Cinematic Motion Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Membuat motion Sahabat Alumunium terasa sinematik dan jelas pada load serta scroll tanpa mengorbankan aksesibilitas atau performa.

**Architecture:** Static sections tetap sync Server Components. Motion dibatasi ke client leaves dalam `src/components/interactive/motion/`; setiap leaf mendeteksi reduced motion dan pointer capability sendiri. Framer Motion mengatur reveal/viewport progress; Lenis tetap satu-satunya RAF scroll loop.

**Tech Stack:** Next.js 16.2, React 19, Framer Motion 12, Lenis 1.3, Vitest, Testing Library.

---

### Task 1: Intro overlay sekali per tab

**Files:**
- Create: `src/components/interactive/motion/intro-overlay.tsx`
- Create: `tests/components/intro-overlay.test.tsx`
- Modify: `src/app/page.tsx`

1. Tulis test first visit, session repeat, reduced motion, dan overlay non-interaktif.
2. Jalankan `bun run test:run tests/components/intro-overlay.test.tsx`; expected FAIL karena modul belum ada.
3. Implement panel transform-only, `aria-hidden`, sessionStorage guard, durasi maksimal 900ms.
4. Jalankan focused test; expected PASS.

### Task 2: Hero choreography kuat

**Files:**
- Replace: `src/components/interactive/motion-hero.tsx`
- Modify: `src/components/static/hero.tsx`
- Modify: `tests/components/motion-hero.test.tsx`

1. Tambah test stagger normal, final state reduced motion, dan semantic children tetap terbaca.
2. Verifikasi RED.
3. Implement mask per baris, metadata stagger, copy/CTA entrance, construction-line drawing.
4. Verifikasi GREEN.

### Task 3: Shared in-view reveal

**Files:**
- Create: `src/components/interactive/motion/reveal.tsx`
- Create: `tests/components/reveal.test.tsx`
- Modify: `src/components/static/services.tsx`
- Modify: `src/components/static/work.tsx`
- Modify: `src/components/static/contact.tsx`

1. Test hidden→visible, `once`, delay index, reduced-motion final state.
2. Verifikasi RED.
3. Implement satu primitive dengan props serializable dan transform/opacity/clip-path saja.
4. Integrasikan ke heading, service rows, portfolio panel wipe, dan contact finale.
5. Verifikasi focused + integration tests.

### Task 4: Process progress line

**Files:**
- Create: `src/components/interactive/motion/process-progress.tsx`
- Create: `tests/components/process-progress.test.tsx`
- Modify: `src/components/static/process.tsx`

1. Test semantic list tetap utuh, progress bounded, reduced-motion final state.
2. Verifikasi RED.
3. Implement `useScroll` + `useSpring` pada `scaleY`; tanpa layout animation.
4. Verifikasi GREEN.

### Task 5: Magnetic CTA pointer-only

**Files:**
- Create: `src/components/interactive/motion/magnetic-link.tsx`
- Create: `tests/components/magnetic-link.test.tsx`
- Modify: `src/components/static/hero.tsx`
- Modify: `src/components/static/contact.tsx`

1. Test fine pointer offset/reset, coarse pointer no-op, reduced-motion no-op, href/keyboard semantics.
2. Verifikasi RED.
3. Implement offset maksimal 6px dan spring reset.
4. Verifikasi GREEN.

### Task 6: Visual system and responsive polish

**Files:**
- Modify: `src/app/globals.css`
- Modify: `DESIGN.md` hanya jika token final berubah.

1. Tambah intro panels, masks, reveal wrappers, construction lines, process rail, focus-visible, minimum touch target 44px.
2. Pastikan mobile mengurangi amplitudo/delay dan tidak horizontal overflow.
3. Jalankan Impeccable detector dan UI/UX Pro Max checklist.

### Task 7: Full verification and deployment

1. `bun run test:run` — expected seluruh files/tests PASS.
2. `bun run typecheck` — expected exit 0.
3. `bun run doctor:ci` — expected 100/100.
4. `git diff --check` — expected exit 0.
5. Commit implementation dengan pesan deskriptif; push `main`.
6. Pantau Vercel sampai `READY`.
7. Verifikasi production HTTP, desktop/mobile visual, reduced-motion, dan console errors.

## Non-goals

- GSAP, WebGL, custom cursor, perpetual marquee, scroll hijack.
- Foto/testimoni/statistik palsu.
- Async RSC atau cache tanpa data async.
