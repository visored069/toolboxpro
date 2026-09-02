# Run: ToolBox Pro (Static HTML)

## How to reproduce
No build step needed — this is a pure static HTML site.
All files are served directly from the project root.

## How to run the server
Node.js static server (no dependencies, clean URL support):
  node .freebuff/server.js

Or use Python:
  python -m http.server 8000 --bind 127.0.0.1

The site is accessible at http://127.0.0.1:8000/
Clean URLs supported: /about, /contact, /privacy, etc.

## 3D Background (Premium Skill Optimized)
The Three.js 3D scene (wireframe polyhedra, bloom, particles) and GLSL shader are in index.html.
Currently HTML-commented out to avoid WebGL context crashes in the preview webview.
To activate for production: uncomment the `<script type="module">` and GLSL `<script>` blocks at the bottom of index.html.
Optimizations applied per premium-3d-website skill:
  - DPR capped at 2 (Math.min(devicePixelRatio, 2))
  - Antialiasing disabled (bloom post-processing handles it)
  - powerPreference: 'high-performance'
  - requestIdleCallback lazy-loading (1500ms fallback)

## Animation Libraries (CDN) - 6 total
  - **Lenis** (unpkg) - Buttery smooth scrolling with inertia
  - **GSAP 3.12.5** + ScrollTrigger (cdnjs) - Scroll-driven animations on hero, cards, FAQ
  - **vanilla-tilt.js 1.8.1** (jsdelivr) - 3D perspective tilt + glare on tool cards
  - **Anime.js 3.2.2** (jsdelivr) - Micro-animations: icon bounce, stat counter, FAQ expand
  - **Trig-JS 4.2.0** (jsdelivr) - CSS-driven scroll reveal via data attributes + CSS vars
  - GSAP `fromTo` animations for staggered card reveals, section headers, footer
  - Safety fallback: elements forced visible after 3s if GSAP animations don't complete
  - Lenis synced with ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`

## Visual Effects (CSS-only, always visible)
10 premium CSS effects in styles.css:
  1. Gradient shimmer on hero heading (indigo->violet->amber cycle)
  2. Glowing aurora border on tool cards (box-shadow pulse on hover)
  3. Pulsing glow on hero stat numbers
  4. Badge shimmer animation (FREE/NEW tags)
  5. Logo icon glow pulse
  6. Search bar glow ring on focus
  7. Hero mesh drift
  8. Ambient blob color shift (hue-rotate)
  9. Section header gradient text
 10. FAQ chevron bounce on hover
 11. Animated gradient border on hero section

## New Interactive Effects (JS + CSS)
- **Preloader**: Full-screen 3D spinning cube with loading bar, fades out after 1.8s
- **Scroll Progress Bar**: Gradient bar at top showing scroll position
- **Card Entrance Stagger**: Each card has increasing delay for staggered reveal
- **Text Scramble**: Hero heading span decodes from random chars to final text
- **Cursor Glow**: 400px radial glow that follows the mouse cursor
- **Magnetic Buttons**: Tool buttons scale up on hover with spring physics
- **Page Transition Overlay**: Gradient wipe for page transitions

## Additional pages
- 3D Visual Demo: http://127.0.0.1:8000/3d-ultra-demo.html (standalone, showcases premium 3D effects)
