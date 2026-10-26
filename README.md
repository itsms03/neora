# Neora Alusys — Architectural Aluminium & Glass Systems

Production-ready, Google-friendly, multilingual (English / Italian) website for **Neora Alusys**, showcasing bespoke architectural aluminium and glass systems, minimalist partitions, slim sliding doors, casement windows, luxury shower enclosures, an interactive wall composer, and project enquiry forms.

---

## 📁 Crawlable Multi-Page Architecture

```text
neora-alusys-website/
├── index.html                  # Root landing page (canonical to /en/, hreflang x-default, auto-routing)
├── sitemap.xml                 # XML Sitemap with all 12 localized URLs and reciprocal hreflang tags
├── robots.txt                  # Search engine crawl directives & sitemap location
├── server.js                   # Zero-dependency local and production static web server
├── build-pages.js              # Production static site generator & SEO compiler
├── neora-alusys-production.zip # Production-ready deployable archive
├── package.json                # Project scripts (start, serve, build)
├── en/                         # English localized landing pages
│   ├── index.html              # /en/ (Home)
│   ├── indoor/index.html       # /en/indoor/ (Aluminium Glass Partitions & Internal Doors)
│   ├── outdoor/index.html      # /en/outdoor/ (Aluminium Sliding Doors & Architectural Glazing)
│   ├── compose/index.html      # /en/compose/ (Wall Composer Configurator)
│   ├── process/index.html      # /en/process/ (Engineering & Craftsmanship)
│   └── contact/index.html      # /en/contact/ (Studio Consultation & Enquiry)
├── it/                         # Italian localized landing pages
│   ├── index.html              # /it/ (Home - Sistemi Architetturali)
│   ├── indoor/index.html       # /it/indoor/ (Pareti Divisorie e Porte Interne)
│   ├── outdoor/index.html      # /it/outdoor/ (Sistemi Scorrevoli e Grandi Vetrate)
│   ├── compose/index.html      # /it/compose/ (Configuratore Pareti su Misura)
│   ├── process/index.html      # /it/process/ (Metodo Progettuale e Artigianalità)
│   └── contact/index.html      # /it/contact/ (Consulenza Studio e Contatti)
├── indoor/index.html           # Backward-compatible alias (canonical -> /en/indoor/)
├── outdoor/index.html          # Backward-compatible alias (canonical -> /en/outdoor/)
├── compose/index.html          # Backward-compatible alias (canonical -> /en/compose/)
├── process/index.html          # Backward-compatible alias (canonical -> /en/process/)
├── contact/index.html          # Backward-compatible alias (canonical -> /en/contact/)
├── css/
│   └── style.css               # Shared production stylesheet with responsive & accessibility rules
├── js/
│   └── app.js                  # Shared modular JavaScript (router, animations, composer, forms)
└── assets/
    ├── images/                 # 46 optimized WebP & PNG architectural photography and logos
    ├── fonts/                  # Custom fonts (.woff2, .woff)
    ├── icons/                  # Custom SVG icons
    └── docs/                   # Brochures and technical documentation
```

---

## 🚀 How to Run Locally

### Start Server
```bash
npm start
# or
node server.js
```
The server will start at:
- **Home**: [http://localhost:3000](http://localhost:3000)
- **English**: [http://localhost:3000/en/](http://localhost:3000/en/)
- **Italian**: [http://localhost:3000/it/](http://localhost:3000/it/)
- **Sitemap**: [http://localhost:3000/sitemap.xml](http://localhost:3000/sitemap.xml)
- **Robots**: [http://localhost:3000/robots.txt](http://localhost:3000/robots.txt)

---

## 🔍 Technical SEO Implementation Summary

1. **True Multi-Page Crawlable URLs**:
   - 12 dedicated, pre-rendered static HTML pages across English and Italian.
   - Googlebot crawls rendered HTML directly without relying on client-side JS or hash switches.
2. **Multilingual Hreflang & Canonicals**:
   - Every page features self-referencing canonical URLs and reciprocal `hreflang="en"`, `hreflang="it"`, and `hreflang="x-default"` annotations.
3. **Structured Data (Schema.org JSON-LD)**:
   - `Organization`, `WebSite`, `BreadcrumbList` (on interior pages), and `Service` (for architectural glazing and partition systems) validate with zero errors.
   - Strictly no fake reviews, no fake ratings, and no invented addresses.
4. **Image SEO & Core Web Vitals**:
   - Every image has a real crawlable `src` pointing to progressive WebP/PNG assets.
   - Explicit `width` and `height` attributes eliminate layout shift (CLS).
   - LCP hero image loads with `loading="eager"` and `fetchpriority="high"`.
   - Below-the-fold images load with `loading="lazy"` and `decoding="async"`.
   - HTML document transfer size reduced by **99.2%** (from 4.28 MB down to ~27–30 KB).
5. **Accessibility**:
   - Keyboard accessible `<a href="#main-content" class="skip-link">`.
   - Strictly respects `prefers-reduced-motion`.
