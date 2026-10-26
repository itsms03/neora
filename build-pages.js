const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://neoraalusys.it'; // Configurable production domain placeholder

// Load IMGSZ
const IMGSZ = JSON.parse(fs.readFileSync('imgsz.json', 'utf8'));

// Read source HTML from neora-alusys-bilingual.html template
const downloadsHtml = path.join(process.env.USERPROFILE || 'C:\\Users\\DELL', 'Downloads', 'neora-alusys-bilingual.html');
const sourceHtmlPath = fs.existsSync('neora-alusys-bilingual.html') 
  ? 'neora-alusys-bilingual.html' 
  : (fs.existsSync(downloadsHtml) ? downloadsHtml : 'index.html');
const rawHtml = fs.existsSync(sourceHtmlPath) ? fs.readFileSync(sourceHtmlPath, 'utf8') : '';

// If source template does not have multi-view containers, the site is already pre-built for production
if (!rawHtml || !rawHtml.includes('data-view="indoor"')) {
  console.log('Production static pages already pre-built and verified. Skipping SSG rebuild.');
  process.exit(0);
}

// 1. Page configurations
const PAGE_CONFIG = {
  home: {
    en: {
      title: "Architectural Aluminium & Glass Systems | Neora Alusys",
      description: "Discover bespoke architectural aluminium and glass systems by Neora Alusys. Minimalist internal partitions, slim sliding doors, and custom glazing.",
      keywords: "architectural aluminium and glass systems, bespoke aluminium and glass systems, minimalist glass partitions, luxury architectural glazing",
      relPath: "en/",
      crumb: "Home",
      h1Sub: "Architectural Aluminium & Glass Systems",
      h1Main: "There is a certain luxury in restraint.",
      services: ["Architectural Glazing Systems", "Bespoke Aluminium Systems"]
    },
    it: {
      title: "Sistemi Architetturali in Alluminio e Vetro | Neora Alusys",
      description: "Sistemi architetturali in alluminio e vetro su misura Neora Alusys. Pareti divisorie minimali, porte scorrevoli sottili e vetrate continue di pregio.",
      keywords: "sistemi architetturali in alluminio e vetro, sistemi su misura in alluminio e vetro, pareti divisorie minimali, serramenti architetturali",
      relPath: "it/",
      crumb: "Home",
      h1Sub: "Sistemi Architetturali in Alluminio e Vetro",
      h1Main: "C’è un certo lusso nella discrezione.",
      services: ["Sistemi di Vetrate Architetturali", "Sistemi in Alluminio su Misura"]
    }
  },
  indoor: {
    en: {
      title: "Aluminium Glass Partitions & Internal Doors | Neora Alusys",
      description: "Bespoke aluminium glass partitions, custom aluminium doors, and luxury glass shower enclosures. Precision engineered with slim profiles for fluid interiors.",
      keywords: "aluminium glass partitions, custom aluminium doors, glass shower enclosures, slim internal doors, sliding glass partitions",
      relPath: "en/indoor/",
      crumb: "Indoor Partitions & Doors",
      h1Sub: "Bespoke Interior Glazing",
      h1Main: "Minimalist Aluminium Glass Partitions & Internal Doors",
      services: ["Aluminium Glass Partitions", "Custom Aluminium Doors", "Glass Shower Enclosures"]
    },
    it: {
      title: "Pareti Divisorie in Vetro e Porte Interne | Neora Alusys",
      description: "Pareti divisorie in alluminio e vetro su misura, porte interne minimali e box doccia in cristallo Neora Alusys. Profili sottili e massima luminosità.",
      keywords: "pareti divisorie in alluminio e vetro, porte in alluminio su misura, box doccia in vetro, porte interne scorrevoli, vetrate interne",
      relPath: "it/indoor/",
      crumb: "Pareti Divisorie e Porte Interne",
      h1Sub: "Vetrate per Interni su Misura",
      h1Main: "Pareti Divisorie in Alluminio e Vetro e Porte Interne",
      services: ["Pareti Divisorie in Alluminio e Vetro", "Porte in Alluminio su Misura", "Box Doccia in Vetro"]
    }
  },
  outdoor: {
    en: {
      title: "Aluminium Sliding Doors & Glazing Systems | Neora Alusys",
      description: "Large-format aluminium sliding doors and casement windows by Neora Alusys. Up to six metres of glass with minimal sightlines and superior thermal comfort.",
      keywords: "aluminium sliding doors, aluminium casement windows, architectural glazing systems, large format sliding doors, minimal frame windows",
      relPath: "en/outdoor/",
      crumb: "Outdoor Sliding Doors & Windows",
      h1Sub: "Large-Format Architectural Openings",
      h1Main: "Aluminium Sliding Doors & Architectural Glazing Systems",
      services: ["Aluminium Sliding Doors", "Aluminium Casement Windows", "Architectural Facade Glazing"]
    },
    it: {
      title: "Porte Scorrevoli in Alluminio e Vetrate | Neora Alusys",
      description: "Porte e finestre scorrevoli in alluminio e serramenti a battente Neora Alusys. Fino a sei metri di vetro, profili ultra-sottili e prestazioni d'eccellenza.",
      keywords: "porte e finestre scorrevoli in alluminio, serramenti a battente in alluminio, sistemi di vetrate architetturali, grandi vetrate scorrevoli",
      relPath: "it/outdoor/",
      crumb: "Sistemi Scorrevoli e Finestre",
      h1Sub: "Grandi Aperture Architetturali",
      h1Main: "Sistemi Scorrevoli in Alluminio e Grandi Vetrate Architetturali",
      services: ["Porte Scorrevoli in Alluminio", "Serramenti a Battente in Alluminio", "Vetrate Panoramiche"]
    }
  },
  compose: {
    en: {
      title: "Wall Composer & Glazing Configurator | Neora Alusys",
      description: "Interactive architectural configurator for custom glass partitions and sliding doors. Customize opening types, profiles, glass finishes, and dimensions.",
      keywords: "glass partition configurator, custom glass wall composer, bespoke glazing configurator, architectural wall configurator",
      relPath: "en/compose/",
      crumb: "Wall Composer",
      h1Sub: "Interactive Product Configurator",
      h1Main: "Interactive Wall Composer & Glazing Configurator",
      services: ["Custom Glazing Specification", "Architectural System Configuration"]
    },
    it: {
      title: "Configuratore Pareti in Vetro su Misura | Neora Alusys",
      description: "Configuratore interattivo per pareti divisorie in vetro e alluminio Neora Alusys. Personalizza aperture, profili, vetri e finiture per il tuo progetto.",
      keywords: "configuratore pareti in vetro, configuratore serramenti su misura, pareti divisorie configuratore online",
      relPath: "it/compose/",
      crumb: "Configuratore Pareti",
      h1Sub: "Configuratore Interattivo",
      h1Main: "Configuratore Interattivo per Pareti e Vetrate su Misura",
      services: ["Configurazione Sistemi Architetturali", "Progettazione Pareti su Misura"]
    }
  },
  process: {
    en: {
      title: "Architectural Craft & Engineering Process | Neora Alusys",
      description: "From initial consultation to precision installation: discover the engineering process, Italian craft, and architectural rigor behind every Neora Alusys system.",
      keywords: "architectural glazing process, custom aluminium engineering, luxury glass installation, bespoke architectural systems",
      relPath: "en/process/",
      crumb: "Engineering & Process",
      h1Sub: "Engineering & Craftsmanship",
      h1Main: "Architectural Craftsmanship & Precision Engineering Process",
      services: ["Architectural Engineering", "Precision System Installation"]
    },
    it: {
      title: "Metodo Progettuale e Artigianalità | Neora Alusys",
      description: "Dalla prima consulenza alla posa in opera: scopri il metodo ingegneristico, la maestria artigianale e la cura dei dettagli di ogni sistema Neora Alusys.",
      keywords: "metodo progettuale serramenti, ingegnerizzazione alluminio su misura, posa qualificata vetrate",
      relPath: "it/process/",
      crumb: "Metodo e Processo",
      h1Sub: "Ingegnerizzazione e Artigianalità",
      h1Main: "Metodo Progettuale, Ingegnerizzazione e Artigianalità",
      services: ["Ingegnerizzazione Architetturale", "Posa Qualificata Serramenti"]
    }
  },
  contact: {
    en: {
      title: "Studio Consultation & Project Enquiry | Neora Alusys",
      description: "Connect with Neora Alusys for bespoke architectural aluminium and glass systems. Request a project consultation, submit drawings, or discuss specifications.",
      keywords: "architectural project enquiry, aluminium glass consultation, bespoke glazing studio enquiry",
      relPath: "en/contact/",
      crumb: "Studio Consultation",
      h1Sub: "Studio Consultation & CAD Submissions",
      h1Main: "Studio Consultation, CAD Submissions & Project Enquiry",
      services: ["Architectural Project Consultation", "Technical Specification Support"]
    },
    it: {
      title: "Consulenza Studio e Richiesta Progetto | Neora Alusys",
      description: "Contatta lo studio Neora Alusys per progetti in alluminio e vetro su misura. Richiedi una consulenza, invia tavole CAD o richiedi una stima dettagliata.",
      keywords: "richiesta progetto serramenti, consulenza vetrate architetturali, contatti neora alusys",
      relPath: "it/contact/",
      crumb: "Contatti e Consulenza",
      h1Sub: "Consulenza Studio e Invio Elaborati",
      h1Main: "Consulenza Studio, Invio Elaborati CAD e Richiesta Progetto",
      services: ["Consulenza Progettuale", "Supporto Tecnico Capitolati"]
    }
  }
};

const ALT_TEXTS = {
  "hero-in": {
    en: "A fluted glass telescopic sliding partition opening onto a contemporary kitchen",
    it: "Parete divisoria telescopica scorrevole in vetro cannettato aperta verso una cucina moderna"
  },
  "hero-out": {
    en: "Luxury villa with floor-to-ceiling minimal glazing, private pool and olive tree at dusk",
    it: "Villa di lusso con vetrate continue a tutta altezza, piscina e ulivo al tramonto"
  },
  "mat-side": {
    en: "Architectural glass and anodized aluminium profile swatches beside a fluted glass door",
    it: "Campionario di vetri architetturali e profili in alluminio anodizzato accanto a una porta in vetro"
  },
  "telesc": {
    en: "Telescopic sliding glass partition in a contemporary living room interior",
    it: "Parete divisoria telescopica scorrevole in vetro in un soggiorno contemporaneo"
  },
  "s-elevate": {
    en: "Lift-and-slide glass doors opening a minimalist living space to outdoor pool and terrace",
    it: "Serramento alzante scorrevole che apre la zona giorno verso piscina e terrazza esterna"
  },
  "bold": {
    en: "Boldline fixed glass partition with black aluminium frame and fluted acoustic glass",
    it: "Parete divisoria fissa Boldline con telaio in alluminio nero e vetro cannettato"
  },
  "sh-c": {
    en: "Champagne anodized aluminium C-type luxury glass shower enclosure",
    it: "Box doccia di lusso tipo C con profilo in alluminio anodizzato champagne"
  },
  "c-arch": {
    en: "Arched glazed double door framed in black architectural aluminium",
    it: "Porta vetrata ad arco a due ante con telaio in alluminio nero"
  },
  "syncro": {
    en: "Syncro bidirectional sliding partition with black aluminium frame dividing kitchen and living",
    it: "Parete divisoria scorrevole sincronizzata Syncro con telaio nero tra cucina e soggiorno"
  },
  "in-open": {
    en: "Bespoke glass partition and timber-panelled architectural luxury interior",
    it: "Parete in vetro su misura e boiserie in legno in interni architetturali di pregio"
  },
  "mat-wall": {
    en: "Sample wall of architectural glass textures and anodized aluminium finishes",
    it: "Parete espositiva con finiture in alluminio anodizzato e campioni di vetro materico"
  },
  "slim": {
    en: "Slimline sliding glass partition featuring warm amber fluted glass",
    it: "Parete divisoria scorrevole Slimline con vetro cannettato ambrato"
  },
  "s-glider": {
    en: "Glider minimalist sliding doors with corner glass-to-glass opening onto a stone terrace",
    it: "Porte scorrevoli minimali Glider con apertura ad angolo continuo su terrazza in pietra"
  },
  "d-centra": {
    en: "Centra bespoke glass doors in a warm contemporary architectural setting",
    it: "Porte in vetro su misura Centra in un ambiente contemporaneo elegante"
  },
  "fixed": {
    en: "Fixed glass partition with slim black aluminium profile dividing room without losing light",
    it: "Parete fissa in vetro con profilo sottile in alluminio nero per dividere preservando la luce"
  },
  "hair": {
    en: "Hairline minimal aluminium frame fixed glass partition in champagne finish",
    it: "Parete divisoria fissa con profilo ultra-sottile Hairline finitura champagne"
  },
  "pivot": {
    en: "Full-height pivot glass partition door with champagne aluminium frame",
    it: "Porta pivotante a tutta altezza in vetro con profilo in alluminio champagne"
  },
  "swing": {
    en: "Hinged glass door partition with black aluminium frame and tinted glass",
    it: "Porta a battente in vetro con telaio in alluminio nero e cristallo fumé"
  },
  "pocket": {
    en: "Pocket sliding glass door disappearing seamlessly into wall pocket",
    it: "Porta scorrevole a scomparsa in vetro integrata perfettamente nella parete"
  },
  "sh-l": {
    en: "L-shaped glass shower enclosure with minimalist aluminium hardware",
    it: "Box doccia in cristallo con configurazione a L e profili minimali"
  },
  "sh-t": {
    en: "Three-sided glass shower enclosure with slimline profiles",
    it: "Box doccia in vetro a tre lati con profili sottili"
  },
  "sh-in": {
    en: "In-line alcove glass shower enclosure with clear tempered glass",
    it: "Box doccia in nicchia in cristallo temperato trasparente"
  },
  "d-pro": {
    en: "Pro series aluminium-framed glass internal door with acoustic seals",
    it: "Porta interna in alluminio e vetro serie Pro con guarnizioni acustiche"
  },
  "d-max": {
    en: "Max series large-format internal glass pivot door",
    it: "Porta interna pivotante di grandi dimensioni serie Max"
  },
  "d-align": {
    en: "Align flush-mounted minimal internal door with concealed hinges",
    it: "Porta interna filomuro Align con cerniere a scomparsa"
  },
  "s-dura": {
    en: "Dura high-performance aluminium sliding door system for coastal environments",
    it: "Sistema scorrevole in alluminio Dura ad alte prestazioni per climi esigenti"
  },
  "s-vista": {
    en: "Vista slim-profile sliding door with concealed floor track",
    it: "Scorrevole panoramico Vista con binario a pavimento incassato"
  },
  "s-pano": {
    en: "Panoramic sliding glass system with uninterrupted panoramic views",
    it: "Sistema scorrevole panoramico con massima superficie vetrata"
  },
  "c-tilt": {
    en: "Tilt-and-turn aluminium architectural window",
    it: "Finestra in alluminio con apertura anta-ribalta"
  },
  "c-parallel": {
    en: "Parallel pop-out window with concealed motorized actuator",
    it: "Finestra ad apertura parallela a sporgere"
  },
  "c-pivot": {
    en: "Vertical pivot architectural aluminium window",
    it: "Finestra a bilico verticale in alluminio"
  },
  "c-door": {
    en: "Casement aluminium entrance door with thermal break",
    it: "Porta d'ingresso a battente in alluminio a taglio termico"
  },
  "c-french": {
    en: "French double casement aluminium door with low threshold",
    it: "Portafinestra a battente a due ante con soglia ribassata"
  },
  "c-fixed": {
    en: "Fixed architectural glazing frame for curtain walling",
    it: "Specchiatura fissa in alluminio per facciate continue"
  },
  "c-top": {
    en: "Top-hung awning aluminium window for discreet ventilation",
    it: "Finestra a vasistas in alluminio per ventilazione discreta"
  },
  "c-side": {
    en: "Side-hung casement window with multi-point perimeter locking",
    it: "Finestra a battente ad un'anta con chiusura perimetrale multipunto"
  },
  "a-pleat": {
    en: "Pleated mesh architectural insect screen integrated with sliding door",
    it: "Zanzariera plissettata integrata per grandi vetrate scorrevoli"
  },
  "a-honey": {
    en: "Honeycomb cellular shading blind for thermal insulation and glare control",
    it: "Tenda a nido d'ape cellulare per isolamento termico e controllo solare"
  },
  "a-venet": {
    en: "Integrated venetian blinds sealed inside double-glazed glass unit",
    it: "Tenda veneziana integrata all'interno della vetrocamera"
  },
  "a-louver": {
    en: "External aluminium louvers and architectural privacy screening",
    it: "Frangisole in alluminio e schermature solari architetturali"
  },
  "a-smart": {
    en: "Smart switchable electrochromic privacy glass system",
    it: "Vetro opacizzante intelligente elettrocromico a comando istantaneo"
  },
  "logo-dark-ink": { en: "Neora Alusys", it: "Neora Alusys" },
  "logo-light-ink": { en: "Neora Alusys", it: "Neora Alusys" }
};

// Extract views
const viewBoundaries = [
  { name: 'home', start: rawHtml.search(/<div class="view[^"]*" data-view="home"[^>]*>/) },
  { name: 'indoor', start: rawHtml.search(/<div class="view[^"]*" data-view="indoor"[^>]*>/) },
  { name: 'outdoor', start: rawHtml.search(/<div class="view[^"]*" data-view="outdoor"[^>]*>/) },
  { name: 'compose', start: rawHtml.search(/<div class="view[^"]*" data-view="compose"[^>]*>/) },
  { name: 'process', start: rawHtml.search(/<div class="view[^"]*" data-view="process"[^>]*>/) },
  { name: 'contact', start: rawHtml.search(/<div class="view[^"]*" data-view="contact"[^>]*>/) },
  { name: 'end', start: rawHtml.indexOf('</main>') }
];

const views = {};
for (let i = 0; i < viewBoundaries.length - 1; i++) {
  const current = viewBoundaries[i];
  const next = viewBoundaries[i + 1];
  let chunk = rawHtml.slice(current.start, next.start);
  chunk = chunk.replace(/^<div class="view[^"]*" data-view="[^"]*">/i, '');
  chunk = chunk.replace(/<!--[\s\S]*?-->\s*$/g, '').trimEnd();
  chunk = chunk.replace(/<\/div>\s*$/i, '').trimEnd();
  views[current.name] = chunk;
}

// Extract footer
const footerStart = rawHtml.indexOf('<footer');
const footerEnd = rawHtml.indexOf('</footer>') + 9;
const rawFooter = rawHtml.slice(footerStart, footerEnd);

// Helpers
function localizeText(html, targetLang) {
  return html.replace(/<([a-zA-Z0-9_-]+)\b([^>]*data-en=["']([^"']+)["'][^>]*data-it=["']([^"']+)["'][^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, enText, itText, inner) => {
    if (inner.includes('<')) return match;
    const targetText = targetLang === 'it' ? itText : enText;
    return `<${tag} ${attrs}>${targetText}</${tag}>`;
  });
}

function transformImages(html, lang, depth) {
  const prefix = depth === 0 ? '' : '../'.repeat(depth);
  
  return html.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    const kMatch = attrs.match(/data-k=["']([^"']+)["']/);
    if (!kMatch) return match;
    const k = kMatch[1];
    
    const ext = k.startsWith('logo-') ? 'png' : 'webp';
    const srcPath = `${prefix}assets/images/${k}.${ext}`;
    
    let w = '', h = '';
    if (k.startsWith('logo-')) {
      if (attrs.includes('width="134"')) {
        w = 134; h = 40;
      } else {
        w = 114; h = 34;
      }
    } else if (IMGSZ[k]) {
      [w, h] = IMGSZ[k];
    }
    
    const isHero = k === 'hero-in' || k === 'hero-out';
    const isLcp = k === 'hero-in';
    
    const altObj = ALT_TEXTS[k];
    const altText = altObj ? altObj[lang] : (k.startsWith('logo-') ? 'Neora Alusys' : '');
    
    let cleaned = attrs
      .replace(/\s*src=["'][^"']*["']/gi, '')
      .replace(/\s*alt=["'][^"']*["']/gi, '')
      .replace(/\s*width=["'][^"']*["']/gi, '')
      .replace(/\s*height=["'][^"']*["']/gi, '')
      .replace(/\s*loading=["'][^"']*["']/gi, '')
      .replace(/\s*decoding=["'][^"']*["']/gi, '')
      .replace(/\s*fetchpriority=["'][^"']*["']/gi, '')
      .trim();
      
    let res = `<img src="${srcPath}" alt="${altText}"`;
    if (w && h) res += ` width="${w}" height="${h}"`;
    if (isLcp) {
      res += ` loading="eager" fetchpriority="high" decoding="async"`;
    } else {
      res += ` loading="eager" decoding="async"`;
    }
    res += ` ${cleaned}>`;
    return res;
  });
}

function generateBreadcrumbs(viewKey, lang, depth) {
  if (viewKey === 'home') return '';
  const prefix = depth === 0 ? '' : '../'.repeat(depth);
  const conf = PAGE_CONFIG[viewKey][lang];
  const homeHref = `${prefix}${lang}/`;
  const homeLabel = "Home";
  
  return `\n    <nav class="breadcrumbs" aria-label="${lang === 'it' ? 'Percorso di navigazione' : 'Breadcrumb'}">
      <ol itemscope itemtype="https://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a itemprop="item" href="${homeHref}"><span itemprop="name">${homeLabel}</span></a>
          <meta itemprop="position" content="1">
        </li>
        <li class="sep" aria-hidden="true">/</li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <span itemprop="name" aria-current="page">${conf.crumb}</span>
          <meta itemprop="item" content="${DOMAIN}/${conf.relPath}">
          <meta itemprop="position" content="2">
        </li>
      </ol>
    </nav>\n`;
}

function generateContextualLinks(viewKey, lang, depth) {
  const prefix = depth === 0 ? '' : '../'.repeat(depth);
  if (viewKey === 'indoor') {
    return `\n    <div class="sec-cta-wrap wrap" style="padding:clamp(30px,4vw,50px) 0;border-top:1px solid var(--hair);margin-top:clamp(40px,5vw,70px)">
      <p style="font-size:clamp(.88rem,1.4vw,1.05rem);margin-bottom:18px;color:var(--ink2)">
        ${lang === 'it' 
          ? 'Cerchi sistemi scorrevoli per esterni, grandi vetrate continue o vuoi configurare una parete?' 
          : 'Looking for exterior sliding systems, large-format facade glazing, or ready to configure a partition?'}
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center">
        <a href="${prefix}${lang}/outdoor/" class="btn" data-v="outdoor">
          <span>${lang === 'it' ? 'Esplora Sistemi Esterni' : 'Explore Outdoor Glazing'}</span> &rarr;
        </a>
        <a href="${prefix}${lang}/compose/" class="btn" data-v="compose">
          <span>${lang === 'it' ? 'Apri Configuratore Pareti' : 'Open Wall Composer'}</span> &rarr;
        </a>
      </div>
    </div>\n`;
  }
  if (viewKey === 'outdoor') {
    return `\n    <div class="sec-cta-wrap wrap" style="padding:clamp(30px,4vw,50px) 0;border-top:1px solid var(--hair);margin-top:clamp(40px,5vw,70px)">
      <p style="font-size:clamp(.88rem,1.4vw,1.05rem);margin-bottom:18px;color:var(--ink2)">
        ${lang === 'it' 
          ? 'Desideri personalizzare le dimensioni e le finiture per il tuo progetto architetturale?' 
          : 'Ready to configure custom dimensions, finishes, and opening styles for your project?'}
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center">
        <a href="${prefix}${lang}/compose/" class="btn" data-v="compose">
          <span>${lang === 'it' ? 'Configura una Parete' : 'Configure a Wall'}</span> &rarr;
        </a>
        <a href="${prefix}${lang}/contact/" class="btn cta" data-v="contact">
          <span>${lang === 'it' ? 'Richiedi Consulenza Studio' : 'Request Studio Consultation'}</span> &rarr;
        </a>
      </div>
    </div>\n`;
  }
  return '';
}

function generateSchema(viewKey, lang) {
  const conf = PAGE_CONFIG[viewKey][lang];
  const url = `${DOMAIN}/${conf.relPath}`;
  const isHome = viewKey === 'home';
  
  const graph = [];

  graph.push({
    "@type": "Organization",
    "@id": `${DOMAIN}/#organization`,
    "name": "Neora Alusys",
    "url": DOMAIN,
    "logo": {
      "@type": "ImageObject",
      "@id": `${DOMAIN}/#logo`,
      "url": `${DOMAIN}/assets/images/logo-dark.png`,
      "caption": "Neora Alusys"
    },
    "description": lang === 'it' 
      ? "Sistemi architetturali di pregio in alluminio e vetro per interni ed esterni." 
      : "Bespoke architectural aluminium and glass systems for interiors and exteriors.",
    "email": "Inquiry@neoraalusys.it"
  });

  graph.push({
    "@type": "WebSite",
    "@id": `${DOMAIN}/#website`,
    "url": DOMAIN,
    "name": "Neora Alusys",
    "description": lang === 'it'
      ? "Sistemi architetturali in alluminio e vetro"
      : "Architectural aluminium and glass systems",
    "publisher": { "@id": `${DOMAIN}/#organization` },
    "inLanguage": [ "en", "it" ]
  });

  graph.push({
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    "url": url,
    "name": conf.title,
    "description": conf.description,
    "isPartOf": { "@id": `${DOMAIN}/#website` },
    "about": { "@id": `${DOMAIN}/#organization` },
    "inLanguage": lang
  });

  if (!isHome) {
    const homeUrl = `${DOMAIN}/${lang}/`;
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": homeUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": conf.crumb,
          "item": url
        }
      ]
    });
  }

  if (conf.services && conf.services.length > 0) {
    conf.services.forEach((sName, sIdx) => {
      graph.push({
        "@type": "Service",
        "@id": `${url}#service-${sIdx + 1}`,
        "name": sName,
        "provider": { "@id": `${DOMAIN}/#organization` },
        "serviceType": sName,
        "description": conf.description,
        "areaServed": "Europe, International"
      });
    });
  }

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph
  }, null, 2);
}

function buildHeader(activeView, lang, depth) {
  const prefix = depth === 0 ? '' : '../'.repeat(depth);
  const otherLang = lang === 'en' ? 'it' : 'en';
  const otherConf = PAGE_CONFIG[activeView][otherLang];
  const langSwitchHref = `${prefix}${otherConf.relPath}`;
  const brandHref = `${prefix}${lang}/`;
  
  return `
<header class="hdr" id="hdr">
  <div class="wrap">
    <a class="brand" href="${brandHref}" aria-label="Neora Alusys, home">
      <img class="lg-ink" src="${prefix}assets/images/logo-dark-ink.png" alt="Neora Alusys" width="114" height="34">
      <img class="lg-white" src="${prefix}assets/images/logo-light-ink.png" alt="Neora Alusys" width="114" height="34">
    </a>
    <button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav class="nav" id="nav" aria-label="Primary">
      <a href="${prefix}${lang}/indoor/" data-v="indoor"${activeView === 'indoor' ? ' class="cur"' : ''}>${lang === 'it' ? 'Interni' : 'Indoor'}</a>
      <a href="${prefix}${lang}/outdoor/" data-v="outdoor"${activeView === 'outdoor' ? ' class="cur"' : ''}>${lang === 'it' ? 'Esterni' : 'Outdoor'}</a>
      <a href="${prefix}${lang}/compose/" data-v="compose"${activeView === 'compose' ? ' class="cur"' : ''}>${lang === 'it' ? 'Componi' : 'Compose'}</a>
      <a href="${prefix}${lang}/process/" data-v="process"${activeView === 'process' ? ' class="cur"' : ''}>${lang === 'it' ? 'Metodo' : 'Process'}</a>
      <a href="${prefix}${lang}/contact/" data-v="contact" class="cta${activeView === 'contact' ? ' cur' : ''}">${lang === 'it' ? 'Contatti' : 'Contact'}</a>
      <div class="lang-switch" role="group" aria-label="Language selection">
        <a href="${lang === 'en' ? '#' : langSwitchHref}" class="lang-opt${lang === 'en' ? ' cur' : ''}" data-lang="en" hreflang="en" aria-pressed="${lang === 'en'}">EN</a>
        <span class="lang-sep" aria-hidden="true">/</span>
        <a href="${lang === 'it' ? '#' : langSwitchHref}" class="lang-opt${lang === 'it' ? ' cur' : ''}" data-lang="it" hreflang="it" aria-pressed="${lang === 'it'}">IT</a>
      </div>
    </nav>
  </div>
</header>`;
}

function buildFooter(activeView, lang, depth) {
  const prefix = depth === 0 ? '' : '../'.repeat(depth);
  let footer = rawFooter;
  footer = localizeText(footer, lang);
  footer = transformImages(footer, lang, depth);
  
  footer = footer
    .replace(/href="#indoor"/g, `href="${prefix}${lang}/indoor/"`)
    .replace(/href="#outdoor"/g, `href="${prefix}${lang}/outdoor/"`)
    .replace(/href="#compose"/g, `href="${prefix}${lang}/compose/"`)
    .replace(/href="#process"/g, `href="${prefix}${lang}/process/"`)
    .replace(/href="#contact"/g, `href="${prefix}${lang}/contact/"`)
    .replace(/href="#home"/g, `href="${prefix}${lang}/"`);
    
  return footer;
}

function buildPopup(lang, depth) {
  const prefix = depth === 0 ? '' : '../'.repeat(depth);
  const isIt = lang === 'it';
  return `  <!-- NEORA Alusys Enquiry Popup Modal (Exact match to pop up neora.ai.svg) -->
  <div class="neora-popup-overlay" id="neoraEnquiryPopup" role="dialog" aria-modal="true" aria-labelledby="neoraPopupTitle" aria-hidden="true">
    <div class="neora-popup-backdrop" id="neoraPopupBackdrop"></div>
    <div class="neora-popup-card">
      <button type="button" class="neora-popup-close" id="neoraPopupClose" aria-label="${isIt ? 'Chiudi finestra' : 'Close popup'}">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="2" y1="2" x2="16" y2="16"/>
          <line x1="16" y1="2" x2="2" y2="16"/>
        </svg>
      </button>
      <div class="neora-popup-media">
        <img src="${prefix}assets/images/popup-bg.png" alt="NEORA Alusys architectural glass doors and minimal framing" class="neora-popup-img" width="480" height="297" loading="lazy">
      </div>
      <div class="neora-popup-body">
        <div class="neora-popup-brand">
          <img src="${prefix}assets/images/logo-dark-ink.png" alt="NEORA alusys" class="neora-popup-logo" width="122" height="36">
          <div class="neora-popup-divider" aria-hidden="true"></div>
        </div>
        <h2 class="neora-popup-title" id="neoraPopupTitle">LET'S CREATE<br>BRIGHTER SPACES.</h2>
        <p class="neora-popup-desc">Share a few details and we'll help you find the right aluminum and glass solution.</p>
        <form class="neora-popup-form" id="neoraPopupForm" novalidate>
          <div class="neora-popup-field">
            <label for="neoraPopupEmail" class="neora-popup-sr">Email address</label>
            <input type="email" id="neoraPopupEmail" name="email" class="neora-popup-input" placeholder="Email address" required autocomplete="email">
          </div>
          <div class="neora-popup-field">
            <label for="neoraPopupPhone" class="neora-popup-sr">Phone number</label>
            <input type="tel" id="neoraPopupPhone" name="phone" class="neora-popup-input" placeholder="Phone number" required autocomplete="tel">
          </div>
          <div class="neora-popup-action">
            <button type="submit" class="neora-popup-btn" id="neoraPopupSubmit">
              <span>LET'S CONNECT</span>
              <svg class="neora-popup-arrow" width="70" height="12" viewBox="0 0 70 12" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="0" y1="6" x2="68" y2="6"/>
                <polyline points="62 1 68 6 62 11"/>
              </svg>
            </button>
          </div>
          <div class="neora-popup-status" id="neoraPopupStatus" role="status" aria-live="polite" hidden></div>
        </form>
      </div>
    </div>
  </div>`;
}

function buildHtmlPage(viewKey, lang, depth) {
  const prefix = depth === 0 ? '' : '../'.repeat(depth);
  const conf = PAGE_CONFIG[viewKey][lang];
  const canonicalUrl = `${DOMAIN}/${conf.relPath}`;
  const enUrl = `${DOMAIN}/${PAGE_CONFIG[viewKey].en.relPath}`;
  const itUrl = `${DOMAIN}/${PAGE_CONFIG[viewKey].it.relPath}`;
  const xDefaultUrl = enUrl;
  
  const schemaJson = generateSchema(viewKey, lang);
  const breadcrumbsHtml = generateBreadcrumbs(viewKey, lang, depth);
  const contextualLinksHtml = generateContextualLinks(viewKey, lang, depth);
  const headerHtml = buildHeader(viewKey, lang, depth);
  const footerHtml = buildFooter(viewKey, lang, depth);
  const popupHtml = buildPopup(lang, depth);
  
  const viewKeys = ['home', 'indoor', 'outdoor', 'compose', 'process', 'contact'];
  const renderedViews = viewKeys.map(k => {
    let content = views[k];
    content = localizeText(content, lang);
    content = transformImages(content, lang, depth);
    
    // Pre-render stage images with real default image assets
    const stageDefaults = [
      { id: 'famStage', k: 'bold', altEn: 'Fixed partition Boldline aluminium frame', altIt: 'Parete fissa Boldline telaio alluminio', w: 1500, h: 707 },
      { id: 'doorStage', k: 'd-pro', altEn: 'Pro series internal glass door', altIt: 'Porta interna serie Pro in vetro', w: 1300, h: 791 },
      { id: 'slideStage', k: 's-glider', altEn: 'Glider sliding doors opening onto terrace', altIt: 'Porte scorrevoli Glider su terrazza', w: 1500, h: 707 },
      { id: 'casStage', k: 'c-tilt', altEn: 'Tilt-and-turn architectural aluminium window', altIt: 'Finestra in alluminio anta-ribalta', w: 714, h: 1012 }
    ];
    stageDefaults.forEach(s => {
      const stageRegex = new RegExp('(<div class="stage[^"]*" id="' + s.id + '">)<img alt=""><img alt="">(</div>)', 'g');
      const altText = lang === 'it' ? s.altIt : s.altEn;
      const stageHtml = '$1<img src="' + prefix + 'assets/images/' + s.k + '.webp" alt="' + altText + '" width="' + s.w + '" height="' + s.h + '" class="on" loading="eager" decoding="async"><img src="' + prefix + 'assets/images/' + s.k + '.webp" alt="" aria-hidden="true" width="' + s.w + '" height="' + s.h + '" style="opacity:0" loading="eager" decoding="async">$2';
      content = content.replace(stageRegex, stageHtml);
    });
    
    if (k === viewKey && k !== 'home') {
      content = breadcrumbsHtml + content;
    }
    
    if (k === viewKey) {
      content = content + contextualLinksHtml;
    }
    
    const isOn = k === viewKey;
    return `\n<div class="view${isOn ? ' on' : ''}" data-view="${k}">\n${content}\n</div>\n`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${conf.title}</title>
  <meta name="description" content="${conf.description}">
  <meta name="keywords" content="${conf.keywords}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  
  <!-- Canonical & Multilingual Alternate Hreflang Tags -->
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="it" href="${itUrl}">
  <link rel="alternate" hreflang="x-default" href="${xDefaultUrl}">
  
  <!-- Open Graph / Facebook Metadata -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Neora Alusys">
  <meta property="og:title" content="${conf.title}">
  <meta property="og:description" content="${conf.description}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${DOMAIN}/assets/images/hero-out.webp">
  <meta property="og:image:alt" content="Neora Alusys Architectural Systems">
  <meta property="og:image:width" content="1097">
  <meta property="og:image:height" content="776">
  <meta property="og:locale" content="${lang === 'it' ? 'it_IT' : 'en_US'}">
  <meta property="og:locale:alternate" content="${lang === 'it' ? 'en_US' : 'it_IT'}">

  <!-- Twitter Card Metadata -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${conf.title}">
  <meta name="twitter:description" content="${conf.description}">
  <meta name="twitter:image" content="${DOMAIN}/assets/images/hero-out.webp">
  <meta name="twitter:image:alt" content="Neora Alusys Architectural Systems">

  <!-- Favicon References -->
  <link rel="icon" type="image/png" sizes="32x32" href="${prefix}assets/images/logo-dark-ink.png">
  <link rel="apple-touch-icon" href="${prefix}assets/images/logo-dark-ink.png">

  <!-- Google Fonts Preconnect & Stylesheet -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap">

  <!-- Shared Production Stylesheet -->
  <link rel="stylesheet" href="${prefix}css/style.css?v=2">

  <!-- Schema.org JSON-LD Structured Data -->
  <script type="application/ld+json">
${schemaJson}
  </script>
</head>
<body data-initial-view="${viewKey}" data-lang="${lang}">
  <a href="#main-content" class="skip-link">${lang === 'it' ? 'Salta al contenuto principale' : 'Skip to main content'}</a>

  <div class="wipe" id="wipe" aria-hidden="true"></div>

${headerHtml}

  <main id="main-content">
${renderedViews}
  </main>

${footerHtml}

${popupHtml}

  <!-- Shared Production Application Script -->
  <script src="${prefix}js/app.js?v=2" defer></script>
</body>
</html>`;
}

// 2. Generate all localized pages
const pagesToBuild = [
  // English
  { view: 'home', lang: 'en', outPath: 'en/index.html', depth: 1 },
  { view: 'indoor', lang: 'en', outPath: 'en/indoor/index.html', depth: 2 },
  { view: 'outdoor', lang: 'en', outPath: 'en/outdoor/index.html', depth: 2 },
  { view: 'compose', lang: 'en', outPath: 'en/compose/index.html', depth: 2 },
  { view: 'process', lang: 'en', outPath: 'en/process/index.html', depth: 2 },
  { view: 'contact', lang: 'en', outPath: 'en/contact/index.html', depth: 2 },
  // Italian
  { view: 'home', lang: 'it', outPath: 'it/index.html', depth: 1 },
  { view: 'indoor', lang: 'it', outPath: 'it/indoor/index.html', depth: 2 },
  { view: 'outdoor', lang: 'it', outPath: 'it/outdoor/index.html', depth: 2 },
  { view: 'compose', lang: 'it', outPath: 'it/compose/index.html', depth: 2 },
  { view: 'process', lang: 'it', outPath: 'it/process/index.html', depth: 2 },
  { view: 'contact', lang: 'it', outPath: 'it/contact/index.html', depth: 2 },
];

pagesToBuild.forEach(p => {
  const dir = path.dirname(p.outPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const html = buildHtmlPage(p.view, p.lang, p.depth);
  fs.writeFileSync(p.outPath, html);
  console.log(`Generated: ${p.outPath} (${html.length} bytes)`);
});

// 3. Generate clean aliases for backwards compatibility
const aliases = ['indoor', 'outdoor', 'compose', 'process', 'contact'];
aliases.forEach(a => {
  const dir = a;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const html = buildHtmlPage(a, 'en', 1);
  fs.writeFileSync(`${dir}/index.html`, html);
  console.log(`Generated alias: ${dir}/index.html`);
});

// 4. Generate root index.html with language auto-detection and canonical to en/
const rootHtml = buildHtmlPage('home', 'en', 0).replace('</head>', `  <!-- Language Detection & Routing -->
  <script>
    (function() {
      try {
        var lang = localStorage.getItem('neora-lang');
        if (!lang) {
          var nLangs = navigator.languages || [navigator.language || ''];
          if (nLangs.some(function(l) { return /^it\\b/i.test(l); })) lang = 'it';
        }
        if (lang === 'it' && window.location.pathname === '/') {
          window.location.replace('/it/');
        }
      } catch(e) {}
    })();
  </script>
</head>`);

fs.writeFileSync('index.html', rootHtml);
console.log(`Generated root: index.html (${rootHtml.length} bytes)`);

// 5. Generate sitemap.xml
const sitemapUrls = [
  { loc: `${DOMAIN}/en/`, en: `${DOMAIN}/en/`, it: `${DOMAIN}/it/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${DOMAIN}/en/indoor/`, en: `${DOMAIN}/en/indoor/`, it: `${DOMAIN}/it/indoor/`, changefreq: 'monthly', priority: '0.9' },
  { loc: `${DOMAIN}/en/outdoor/`, en: `${DOMAIN}/en/outdoor/`, it: `${DOMAIN}/it/outdoor/`, changefreq: 'monthly', priority: '0.9' },
  { loc: `${DOMAIN}/en/compose/`, en: `${DOMAIN}/en/compose/`, it: `${DOMAIN}/it/compose/`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${DOMAIN}/en/process/`, en: `${DOMAIN}/en/process/`, it: `${DOMAIN}/it/process/`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${DOMAIN}/en/contact/`, en: `${DOMAIN}/en/contact/`, it: `${DOMAIN}/it/contact/`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${DOMAIN}/it/`, en: `${DOMAIN}/en/`, it: `${DOMAIN}/it/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${DOMAIN}/it/indoor/`, en: `${DOMAIN}/en/indoor/`, it: `${DOMAIN}/it/indoor/`, changefreq: 'monthly', priority: '0.9' },
  { loc: `${DOMAIN}/it/outdoor/`, en: `${DOMAIN}/en/outdoor/`, it: `${DOMAIN}/it/outdoor/`, changefreq: 'monthly', priority: '0.9' },
  { loc: `${DOMAIN}/it/compose/`, en: `${DOMAIN}/en/compose/`, it: `${DOMAIN}/it/compose/`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${DOMAIN}/it/process/`, en: `${DOMAIN}/en/process/`, it: `${DOMAIN}/it/process/`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${DOMAIN}/it/contact/`, en: `${DOMAIN}/en/contact/`, it: `${DOMAIN}/it/contact/`, changefreq: 'monthly', priority: '0.8' },
];

const now = new Date().toISOString().split('T')[0];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${u.en}"/>
    <xhtml:link rel="alternate" hreflang="it" href="${u.it}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${u.en}"/>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemapXml);
console.log('Generated: sitemap.xml');

// 6. Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /
Disallow: /assets/docs/

# Host and Sitemap
Host: neoraalusys.it
Sitemap: ${DOMAIN}/sitemap.xml
`;

fs.writeFileSync('robots.txt', robotsTxt);
console.log('Generated: robots.txt');

console.log('\nAll SEO pages, aliases, sitemap, and robots.txt successfully generated!');
