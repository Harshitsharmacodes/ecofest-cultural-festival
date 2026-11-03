# 🌿 EcoFest 2026 — Enchanted Nature Cultural Festival

A responsive, high-performance web portal for Greenwood University's annual inter-college cultural festival, built using **Pure Web Fundamentals (HTML5, Modern CSS3, and Vanilla JavaScript)**.

---

## 🌟 Features & Highlights

- **Thematic Consistency ("Enchanted Nature")**:
  - Deep forest palettes (`#06110a`, `#102718`) with bioluminescent glowing accents (Emerald, Mint, Cyan, Gold).
  - 60 FPS HTML5 Canvas particle simulation rendering floating fireflies and spores.
  - Translucent glassmorphism cards with `backdrop-filter: blur(12px)`.
- **Highlighted Pillars**:
  - Nature & Wildlife Photography (Macro flora, golden hour trails).
  - Living Canvas & Bio-Sculptures (Unbaked river clay, organic moss graffiti).
  - Campus Reforestation & Seed Bombing (1,500 sapling drive).
  - Acoustic Forest Symphony (Solar-powered unplugged music).
- **Reactive Event Catalog**:
  - Filter by Category (Photography, Art, Plantation, Music, Green Tech).
  - Filter by Day (Day 1: Sprout, Day 2: Bloom, Day 3: Canopy).
  - Debounced real-time keyword search.
  - "Quick Register" action that auto-fills and navigates to the registration form.
- **The Analytical Challenge (Concurrent Event Time-Slots)**:
  - Adaptive Multi-Track Grid that groups overlapping events under a shared time-slot milestone.
  - Automatically slots simultaneous events into side-by-side equal-width columns partitioned with venue color tokens.
  - Zero content collision, clipping, or visual clutter.
- **Strict Form Validation & Digital EcoPass**:
  - RFC 5322 compliant email regex validation with real-time feedback.
  - 10-digit mobile number and mandatory zero-waste pledge check.
  - Populates a digital pass ticket modal with simulated QR code and a print-to-PDF button.

---

## 🚀 Live Demo & Presentation

- **Judges Defense Guide**: See [`JUDGES_PRESENTATION_GUIDE.md`](./JUDGES_PRESENTATION_GUIDE.md) for 30-second elevator pitch, code line highlights, regex explanations, and viva Q&A.
- **Local Preview**: Open `index.html` in any browser or launch with Live Server in VS Code.

---

## 💻 Tech Stack

- **HTML5**: Semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<dialog>`, `<footer>`), W3C ARIA accessibility.
- **CSS3**: CSS Custom Properties (`:root`), Flexbox, CSS Grid, fluid typography (`clamp()`), keyframe animations, `@media print`.
- **JavaScript (ES6+)**: Vanilla class-based controllers, HTML5 Canvas 2D context, array methods, DOM manipulation. Zero external libraries or npm dependencies.
