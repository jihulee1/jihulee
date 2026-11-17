// Site navigation, case-study rendering, and interactive engineering demos.
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function missing(el) {
  const fallback = el.getAttribute("data-fallback");
  if (fallback) { el.removeAttribute("data-fallback"); el.src = fallback; return; }
  const d = document.createElement("div");
  d.className = "ph";
  d.textContent = el.alt || "Project image";
  el.replaceWith(d);
}

const IMAGE_FALLBACKS = {"https://ugc.production.linktr.ee/YpdCtajRrms1BJfDMRmv_fXePR3elgSa8PhF1?io=true&size=avatar-v3_0": "https://www.sasetx.org/home/logos.png"};
const EMBEDDED = window.EMBEDDED_IMAGES || {};
const photo = (src, alt, zoom, fit) =>
  `<img src="${esc(EMBEDDED[src] || src)}" data-src="${esc(src)}" alt="${esc(alt)}" loading="lazy"${IMAGE_FALLBACKS[src] ? ` data-fallback="${esc(IMAGE_FALLBACKS[src])}"` : ""} onerror="missing(this)"${zoom ? ' data-zoom' : ''}${fit ? ` style="object-fit:${esc(fit)}"` : ''}>`;

// Resume: use the copy built into this page if there is one, otherwise the files next to it
let RESUME_URL = SITE.resume, RESUME_PIC = SITE.resumeImage;
try {
  if (window.RESUME_PDF_B64) {
    const bytes = Uint8Array.from(atob(window.RESUME_PDF_B64), c => c.charCodeAt(0));
    RESUME_URL = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  }
  if (window.RESUME_IMG) RESUME_PIC = window.RESUME_IMG;
} catch (e) { console.warn("Using resume files instead of the built-in copy", e); }
const RESUME_FILENAME = SITE.name.replace(/\s+/g, "_") + "_Resume.pdf";

function renderHome() {
  document.title = `${SITE.name} | Environmental Engineering`;
  document.getElementById("logo").textContent = SITE.name;
  document.getElementById("foot").textContent = `${SITE.name}, ${new Date().getFullYear()}`;

  const card = p => `
    <a class="card" href="#${esc(p.id)}">
      <div class="cimg${p.coverFit ? " fit-" + esc(p.coverFit) : ""}">${photo(p.cover, p.title, false, p.coverFit ? "contain" : undefined)}</div>
      <div class="cbody">
        <div class="kind"><b>${esc(p.kind)}</b>${p.when ? `, ${esc(p.when)}` : ""}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.summary)}</p>
        <span class="btn primary">Explore project <span aria-hidden="true">↗</span></span>
      </div>
    </a>`;
  const projects = PROJECTS.map(card).join("");
  const experience = EXPERIENCE.map(p => card(p).replace("Explore project", "Read my experience")).join("");


  const resume = RESUME_URL ? `
    <section class="block" id="resume"><div class="wrap">
      <div class="head"><h2>Resume</h2></div>
      <div class="resume">
        <a class="sheet" href="${esc(RESUME_URL)}" target="_blank" rel="noopener">${photo(RESUME_PIC, SITE.name + " resume")}</a>
        <div class="btns">
          <a class="btn primary" href="${esc(RESUME_URL)}" download="${esc(RESUME_FILENAME)}">Download PDF</a>
          <a class="btn ghost" href="${esc(RESUME_URL)}" target="_blank" rel="noopener">Open in new tab</a>
        </div>
      </div>
    </div></section>` : "";

  document.getElementById("home").innerHTML = `
    <div class="wrap" id="top">
      <section class="hero">
        <div>
          <div class="ut-identity"><div><span class="ut-name">UT Austin</span><span class="ut-major">Environmental Engineering</span></div></div><h1>${esc(SITE.name)}</h1><div class="hero-focus">Water. Air. Energy.<br>Connected by design.</div>
          <p>${esc(SITE.intro)}</p>
          <div class="btns hero-actions">
            <a class="btn primary" href="#projects">Projects <span aria-hidden="true">→</span></a>
            <a class="btn primary" href="#experience">Leadership &amp; Experience <span aria-hidden="true">→</span></a>
            <a class="btn primary" href="${esc(RESUME_URL)}" target="_blank" rel="noopener">View résumé <span aria-hidden="true">↗</span></a>
            <a class="btn primary" href="#contact">Let’s connect <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <figure class="profile-portrait"><img src="${esc(SITE.heroPhoto)}" alt="${esc(SITE.heroCaption)}" width="600" height="750" fetchpriority="high"></figure>
      </section>
      <dl class="facts">${SITE.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    </div>
    <section class="block" id="projects"><div class="wrap">
      <div class="head"><h2>Projects</h2></div>
      <div class="cards">${projects}</div>
    </div></section>
    <section class="block" id="experience"><div class="wrap">
      <div class="head"><h2>Leadership &amp; Experience</h2></div>
      <div class="cards">${experience}</div>
    </div></section>
    <section class="block" id="publications-overview"><div class="wrap">
      <div class="head"><h2>Publications</h2><p>${esc(PUBLICATION_RESEARCH.intro)}</p></div>
      ${publicationsMarkup()}
    </div></section>
    ${resume}
    <section class="block" id="contact"><div class="wrap">
      <div class="contact">
        <h2>Get in touch</h2>
        <p>${esc(SITE.contactLine)}</p>
        <div class="btns">
          <a class="btn primary" href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>
          ${SITE.linkedin ? `<a class="btn" href="${esc(SITE.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ""}
          ${RESUME_URL ? `<a class="btn" href="${esc(RESUME_URL)}" target="_blank" rel="noopener">Resume</a>` : ""}
        </div>
      </div>
    </div></section>`;
}


function publicationsMarkup(detailed = false) {
  if (!PUBLICATIONS.length) return `<div class="publications-empty"><p>Publication details will be added soon.</p></div>`;
  return `<div class="publication-list">${PUBLICATIONS.map(publication => {
    const linked = /^https?:\/\//i.test(publication.url || "");
    const sources = detailed && publication.sources && publication.sources.length ? `<p class="publication-sources">${publication.sources.map(([label,url]) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)} <span aria-hidden="true">↗</span></a>`).join(" · ")}</p>` : "";
    return `<article class="publication-entry">
      <div class="kind"><b>${esc(publication.type || "Publication")}</b>${publication.year ? ` · ${esc(publication.year)}` : ""}${publication.role ? ` · ${esc(publication.role)}` : ""}</div>
      <h3>${linked ? `<a href="${esc(publication.url)}" target="_blank" rel="noopener">${esc(publication.title)} <span aria-hidden="true">↗</span></a>` : esc(publication.title)}</h3>
      ${publication.authors ? `<p class="publication-authors">${esc(publication.authors)}</p>` : ""}
      ${publication.venue ? `<p class="publication-venue">${esc(publication.venue)}</p>` : ""}
      ${publication.summary ? `<p class="publication-summary">${esc(publication.summary)}</p>` : ""}
      ${detailed && publication.doi ? `<p class="publication-doi">DOI: <a href="https://doi.org/${esc(publication.doi)}" target="_blank" rel="noopener">${esc(publication.doi)}</a></p>` : ""}
      ${detailed && publication.citation ? `<details class="publication-citation"><summary>Citation</summary><p>${esc(publication.citation)}</p></details>` : ""}
      ${sources}
    </article>`;
  }).join("")}</div>`;
}

function renderPublications() {
  document.title = `Publications | ${SITE.name}`;
  document.getElementById("case").innerHTML = `
    <div class="wrap case publications-page">
      <a class="back" href="#experience">Back to leadership &amp; experience</a>
      <div class="case-top"><h1>Publications</h1><p class="intro">${esc(PUBLICATION_RESEARCH.intro)}</p></div>
      <section class="chapter" aria-label="Publications">${publicationsMarkup(true)}</section>
      <section class="chapter publication-role">
        <h2>My contributions</h2>
        <p>${esc(PUBLICATION_RESEARCH.roleSummary)}</p>
        <div class="publication-contributions">${PUBLICATION_RESEARCH.contributions.map(contribution => `<article class="contribution-card"><h3>${esc(contribution.title)}</h3><p>${esc(contribution.text)}</p></article>`).join("")}</div>
      </section>
    </div>`;
}

const FORMULA = c => `<div class="formula">
        ${c.formulaTitle ? `<h3>${esc(c.formulaTitle)}</h3>` : ""}
        <div class="formula-grid${c.terms ? "" : " single"}">
          <div class="math">${c.formula}</div>
          ${c.terms ? `<dl class="terms">${c.terms.map(([t, d]) => `<div><dt class="math">${t}</dt><dd>${esc(d)}</dd></div>`).join("")}</dl>` : ""}
        </div>
        ${c.formulaNote ? `<p>${esc(c.formulaNote)}</p>` : ""}
      </div>`;

function renderCase(p, back = { href: "#projects", label: "projects" }) {
  const paras = t => (Array.isArray(t) ? t : (t ? [t] : [])).map(x => `<p>${esc(x)}</p>`).join("");
  const chapters = p.chapters.map(c => `
    <section class="chapter">
      <h2>${esc(c.heading)}</h2>
      ${paras(c.text)}
      ${c.steps ? `<ol class="steps">${c.steps.map(([t, d]) => `<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join("")}</ol>` : ""}
      ${c.formula && !c.cards ? FORMULA(c) : ""}
      ${c.cards ? `<div class="rules${c.cards.length === 3 ? " rules-3" : ""}">${c.cards.map(k => `
        <article class="rule tone-${esc(k.tone)}">
          <span class="tag">${esc(k.tag)}</span>
          <h3>${esc(k.title)}</h3>
          <p>${esc(k.text)}</p>
          ${k.formula ? `<div class="math">${k.formula}</div>` : ""}
        </article>`).join("")}</div>` : ""}
      ${c.formula && c.cards ? FORMULA(c) : ""}
      ${c.widget ? `<div class="${c.widget === "wind-sim" ? "sim" : "aqw w-" + esc(c.widget)}" data-widget="${esc(c.widget)}"></div>` : ""}
      ${c.list ? `<ul class="scen">${c.list.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      ${c.after ? `<p>${esc(c.after)}</p>` : ""}${c.heading === "Quality targets and next steps" ? `<p class="source-note">Technical reference: <a href="https://www.dupont.com/content/dam/water/amer/us/en/water/public/documents/en/IER-AmberTec-UP6040-H-OH-PDS-45-D00883-en.pdf" target="_blank" rel="noopener">DuPont final-polishing UPW resin data sheet ↗</a></p>` : ""}
      ${c.photos && c.photos.length ? `<div class="gallery">${c.photos.map(ph => `
        <figure>${photo(ph.src, ph.caption, true, ph.fit)}<figcaption>${esc(ph.caption)}</figcaption></figure>`).join("")}</div>` : ""}
    </section>`).join("");

  document.getElementById("case").innerHTML = `
    <div class="wrap case">
      <a class="back" href="${back.href}">All ${back.label}</a>
      <div class="case-top">
        ${p.logo ? `<div class="case-logo">${photo(p.logo, "Logo")}</div>` : ""}
        <div class="kind"><b>${esc(p.kind)}</b>${p.when ? `, ${esc(p.when)}` : ""}</div>
        <h1>${esc(p.title)}</h1>
        <p class="intro">${esc(p.intro)}</p>
        ${p.links ? `<div class="btns case-links">${p.links.map(([label,url]) => `<a class="btn ghost" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)} ↗</a>`).join("")}</div>` : ""}
        ${p.question ? `<div class="question"><span>Research question</span><p>${esc(p.question)}</p></div>` : ""}
        <dl class="meta">${p.meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      </div>
      ${p.heroPhoto ? `<figure class="heroimg${p.heroPhoto.fit ? " fit-" + esc(p.heroPhoto.fit) : ""}">${photo(p.heroPhoto.src, p.heroPhoto.caption, true, p.heroPhoto.fit === "contain" ? "contain" : undefined)}
        <figcaption>${esc(p.heroPhoto.caption)}</figcaption></figure>` : ""}
      ${chapters}
      <p style="margin-top:72px"><a class="btn ghost" href="${back.href}">Back to all ${back.label}</a></p>
    </div>`;
  document.title = `${p.title} | ${SITE.name}`;
  document.querySelectorAll("#case [data-widget]").forEach(el => (WIDGETS[el.dataset.widget] || (() => {}))(el));
}

/* ---------- Interactive wind / electrolyzer / battery simulation ---------- */
// Illustrative wind -> PEM -> BESS simulation (shared with the page)
const SIM = (() => {
  const PW_RATED = 15, ETA_W = 0.977, PCAP = 0.9 * PW_RATED, PMIN = 0.1 * PCAP;
  const ETA = 0.9486833, SOCMIN = 0.1, SOCMAX = 0.9, SOC0 = 0.5, RESTART_SOC = 0.5;
  const DT = 0.25, HOURS = 48, N = HOURS / DT + 1, RMAX = 8; // MW per hour
  const clamp = (x, a, b) => Math.min(Math.max(x, a), b);
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const anchors = [[0,8],[6,10],[10,14],[14.75,15],[15.75,6.4],[17,5.8],[22,5.7],[23,3.4],[25,3.1],[26,5.7],[29,5.9],[32,11],[36.5,22],[37,25.8],[37.75,26.3],[38,21],[41,12],[48,9]];
  function speedAt(h) { for (let k = 0; k < anchors.length - 1; k++) { const [h0,v0] = anchors[k], [h1,v1] = anchors[k+1];
      if (h <= h1) return v0 + (v1 - v0) * (h - h0) / (h1 - h0); } return anchors[anchors.length-1][1]; }
  const r = rng(3); let n = 0; const V = [], AV = [];
  for (let i = 0; i < N; i++) { n = 0.7 * n + 0.6 * (r() - 0.5) * 2; const h = i * DT;
    const quiet = (h > 36.9 && h < 38.0) || (h > 23 && h < 25.2); V.push(Math.max(0, speedAt(h) + (quiet ? 0.25 * n : n))); }
  for (const v of V) { let p = 0; if (v >= 3 && v < 25) p = v >= 12 ? PW_RATED : PW_RATED * (v**3 - 27) / (1728 - 27); AV.push(ETA_W * p); }

  function simulate(E) {
    const Pb = E, R = RMAX * DT, steps = [];
    let soc = SOC0, on = AV[0] >= PMIN, prev = on ? clamp(AV[0], PMIN, PCAP) : 0, shut = 0, breaks = 0, down = 0, curt = 0;
    for (let i = 0; i < N; i++) {
      const a = AV[i]; let P = 0, ch = 0, dis = 0, c = 0, mode = "normal";
      const canDis = E > 0 ? Math.max(0, Math.min(Pb, (soc - SOCMIN) * E * ETA / DT)) : 0;
      const canCh = E > 0 ? Math.max(0, Math.min(Pb, (SOCMAX - soc) * E / (ETA * DT))) : 0;
      let restarted = false;
      if (!on && a >= PMIN && (E === 0 || soc >= RESTART_SOC - 1e-9)) { on = true; prev = 0; restarted = true; }
      if (!on) { ch = Math.min(a, canCh); c = a - ch; mode = "shutdown"; }
      else {
        const target = clamp(a, PMIN, PCAP);
        const lo = prev > 0 ? prev - R : 0, hi = prev > 0 ? prev + R : Math.max(PMIN, R);
        P = clamp(clamp(target, lo, hi), PMIN, PCAP);
        const gap = P - a;
        if (gap > 1e-9) {
          if (canDis >= gap - 1e-9) { dis = gap; mode = a < PMIN ? "discharge" : "rampDown"; }
          else {
            const alt = a + canDis;
            if (alt >= PMIN) { dis = canDis; P = alt;
              if (prev > 0 && Math.abs(P - prev) > R + 1e-6) { breaks++; mode = "rampBreak"; } else mode = a < PMIN ? "discharge" : "rampDown"; }
            else { on = false; shut++; P = 0; ch = Math.min(a, canCh); c = a - ch; mode = "shutdown"; }
          }
        } else if (gap < -1e-9) { const s = -gap; ch = Math.min(s, canCh); c = s - ch;
          mode = (a > PCAP && P >= PCAP - 1e-9) ? (E > 0 ? "charge" : "curtail") : "rampUp";
          if (mode === "rampUp" && c > 1e-6 && prev > 0) { /* extra curtailed: wind rose too fast and battery full */ }
        }
        if (restarted && mode === "normal") mode = "restart";
      }
      if (E > 0) soc = clamp(soc + (ETA * ch * DT - dis * DT / ETA) / E, 0, 1);
      if (mode === "shutdown") down += DT;
      curt += c * DT;
      steps.push({ h: i * DT, a, P, ch, dis, c, soc: E > 0 ? soc : null, mode });
      prev = P;
    }
    return { steps, shut, breaks, down, curt };
  }
  return { simulate, N, DT, HOURS, PCAP, PMIN, RMAX, PW_RATED };
})();

let simTimer = null;
function mountWindSim(root) {
  const { simulate, N, DT, HOURS, PCAP, PMIN, RMAX } = SIM;
  const X0 = 52, X1 = 788, YT = 18, YB = 230, PMAX = 16;
  const x = i => X0 + i * (X1 - X0) / (N - 1);
  const yP = p => YB - p / PMAX * (YB - YT);
  const yS = s => 324 - s * 52;
  const f1 = v => v.toFixed(1);
  const MODES = {
    normal: "Safe operation", restart: "Safe operation", charge: "Battery charging", curtail: "Extra wind curtailed", discharge: "Battery discharging",
    rampUp: "Ramp smoothed", rampDown: "Ramp smoothed", rampBreak: "Ramp limit broken", shutdown: "Shut down",
  };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.innerHTML = `
    <div class="sim-grid">
      <div class="chart-wrap"><svg class="sim-chart" viewBox="0 0 800 340" role="img" aria-label="Wind power, electrolyzer power and battery charge over 48 hours">
        <g class="grid"></g><path class="wind-area"/><path class="wind-line"/><path class="pem-line"/>
        <line class="lim" x1="${X0}" x2="${X1}" y1="${yP(PCAP)}" y2="${yP(PCAP)}"/>
        <text class="lim-t" x="${x(17 / DT)}" y="${yP(PCAP) - 6}">Electrolyzer capacity, ${f1(PCAP)} MW</text>
        <line class="lim" x1="${X0}" x2="${X1}" y1="${yP(PMIN)}" y2="${yP(PMIN)}"/>
        <text class="lim-t" x="${X0 + 8}" y="${yP(PMIN) - 6}">Safe minimum, ${PMIN.toFixed(2)} MW</text>
        <g class="strip"></g>
        <line class="lim soc-lim" x1="${X0}" x2="${X1}" y1="${yS(0.9)}" y2="${yS(0.9)}"/>
        <line class="lim soc-lim" x1="${X0}" x2="${X1}" y1="${yS(0.1)}" y2="${yS(0.1)}"/>
        <path class="soc-line"/><text class="axis-t soc-t" x="${X0 - 8}" y="${yS(0.5) + 4}" text-anchor="end">SOC</text>
        <line class="cursor" y1="${YT}" y2="330"/><circle class="dot wind-dot" r="5"/><circle class="dot pem-dot" r="5"/><circle class="dot soc-dot" r="4"/>
      </svg></div>
      <div class="sim-side">
        <svg class="flow" viewBox="0 0 300 250" aria-hidden="true">
          <defs>${["on", "off"].map(k => `<marker id="ar-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="mk-${k}"/></marker>`).join("")}</defs>
          <path class="fl f-wp" d="M92 112 H140 V48 H196"/>
          <path class="fl f-wb" d="M92 134 H158 V204 H196"/>
          <path class="fl f-bp" d="M246 176 V84"/>
          <path class="fl f-wc" d="M48 152 V196"/>
          <rect class="bx" x="6" y="92" width="86" height="60" rx="12"/><text class="bx-t" x="49" y="116" text-anchor="middle">Wind</text><text class="bx-v v-w" x="49" y="136" text-anchor="middle"></text>
          <rect class="bx" x="196" y="22" width="100" height="60" rx="12"/><text class="bx-t" x="246" y="46" text-anchor="middle">PEM</text><text class="bx-v v-p" x="246" y="66" text-anchor="middle"></text>
          <rect class="bx" x="196" y="178" width="100" height="60" rx="12"/><text class="bx-t" x="246" y="202" text-anchor="middle">Battery</text>
          <rect class="soc-bg" x="210" y="214" width="72" height="10" rx="5"/><rect class="soc-fill" x="210" y="214" width="0" height="10" rx="5"/>
          <text class="bx-v small c-lbl" x="48" y="214" text-anchor="middle">Curtailed</text><text class="bx-v small v-c" x="48" y="230" text-anchor="middle"></text>
        </svg>
        <div class="sim-mode"></div>
        <p class="sim-now"></p>
      </div>
    </div>
    <div class="sim-controls">
      <button type="button" class="btn primary sim-play">Pause</button>
      <label class="sim-range">Time <input type="range" class="sim-time" min="0" max="${N - 1}" value="0" aria-label="Time in hours"></label>
      <label class="sim-range">Battery size <output class="sim-size-o"></output><input type="range" class="sim-size" min="0" max="20" step="1" value="6" aria-label="Battery size in MWh"></label>
    </div>
    <div class="sim-stats"></div>
    <div class="legend">${[["normal", "Safe operation"], ["charge", "Battery charging"], ["curtail", "Extra wind curtailed"], ["discharge", "Battery discharging"], ["rampUp", "Ramp smoothed"], ["rampBreak", "Ramp limit broken"], ["shutdown", "Shut down"]]
      .map(([k, l]) => `<span><i class="m-${k}"></i>${l}</span>`).join("")}<span><i class="sw-wind"></i>Available wind</span><span><i class="sw-pem"></i>Electrolyzer power</span></div>
    <p class="sim-note">Illustrative inputs: 15 MW wind farm, 15-minute steps, ramp limit ${RMAX} MW per hour, battery power in MW equal to its size in MWh.</p>`;

  const $ = s => root.querySelector(s);
  const grid = $(".grid");
  grid.innerHTML = [0, 5, 10, 15].map(p => `<line x1="${X0}" x2="${X1}" y1="${yP(p)}" y2="${yP(p)}"/><text class="axis-t" x="${X0 - 8}" y="${yP(p) + 4}" text-anchor="end">${p}</text>`).join("")
    + `<text class="axis-t" x="${X0 - 8}" y="${YT - 4}" text-anchor="end">MW</text>`
    + [0, 12, 24, 36, 48].map(h => `<text class="axis-t" x="${x(h / DT)}" y="338" text-anchor="middle">${h}h</text>`).join("");

  const base = simulate(0);
  let run, i = 0, playing = !reduce, last = 0;

  function draw() {
    const E = +$(".sim-size").value;
    run = simulate(E);
    $(".sim-size-o").textContent = E ? `${E} MWh / ${E} MW` : "No battery";
    const S = run.steps;
    const wl = S.map((s, k) => `${k ? "L" : "M"}${x(k).toFixed(1)} ${yP(s.a).toFixed(1)}`).join("");
    $(".wind-line").setAttribute("d", wl);
    $(".wind-area").setAttribute("d", `${wl}L${X1} ${YB}L${X0} ${YB}Z`);
    $(".pem-line").setAttribute("d", S.map((s, k) => `${k ? "L" : "M"}${x(k).toFixed(1)} ${yP(s.P).toFixed(1)}`).join(""));
    const w = (X1 - X0) / (N - 1);
    $(".strip").innerHTML = S.map((s, k) => `<rect class="m-${s.mode === "restart" ? "normal" : s.mode === "rampDown" ? "rampUp" : s.mode}" x="${(x(k) - w / 2).toFixed(1)}" y="240" width="${(w + 0.4).toFixed(1)}" height="12"/>`).join("");
    $(".soc-line").setAttribute("d", E ? S.map((s, k) => `${k ? "L" : "M"}${x(k).toFixed(1)} ${yS(s.soc).toFixed(1)}`).join("") : "");
    const st = $(".soc-t"); st.textContent = E ? "SOC" : "No battery";
    st.setAttribute("x", E ? X0 - 8 : (X0 + X1) / 2); st.setAttribute("text-anchor", E ? "end" : "middle");
    const tile = (label, val, cmp) => `<div><dt>${label}</dt><dd>${val}${cmp !== undefined ? `<small>no battery: ${cmp}</small>` : ""}</dd></div>`;
    $(".sim-stats").innerHTML = `<dl>
      ${tile("Shutdowns", run.shut, E ? base.shut : undefined)}
      ${tile("Ramp limit broken", run.breaks, E ? base.breaks : undefined)}
      ${tile("Hours shut down", run.down, E ? base.down : undefined)}
      ${tile("Wind curtailed", f1(run.curt) + " MWh", E ? f1(base.curt) + " MWh" : undefined)}</dl>`;
    frame();
  }

  function describe(s, E) {
    const h = `Hour ${f1(s.h)}: `, a = f1(s.a);
    switch (s.mode) {
      case "charge": return h + `wind (${a} MW) is above the ${f1(PCAP)} MW electrolyzer limit. ` + (s.ch > 0.05 ? `${f1(s.ch)} MW charges the battery` + (s.c > 0.05 ? ` and ${f1(s.c)} MW is curtailed.` : ".") : (E ? "The battery is full, so the extra is curtailed." : "With no battery, the extra is curtailed."));
      case "curtail": return h + `wind (${a} MW) is above the ${f1(PCAP)} MW electrolyzer limit. With no battery, the extra ${f1(s.c)} MW is curtailed.`;
      case "discharge": return h + `wind (${a} MW) is below the ${PMIN.toFixed(2)} MW safe load. The battery adds ${f1(s.dis)} MW to keep the electrolyzer running.`;
      case "rampUp": return h + `wind rose faster than the ramp limit. The electrolyzer steps up gradually` + (s.ch > 0.05 ? ` and the battery takes the extra ${f1(s.ch)} MW.` : ", and the extra wind is curtailed.");
      case "rampDown": return h + `wind fell faster than the ramp limit. The battery fills ${f1(s.dis)} MW so the electrolyzer can step down gradually.`;
      case "rampBreak": return h + (E ? `wind fell faster than the ramp limit and the battery couldn’t cover it all, so the electrolyzer changed power too fast.` : `wind fell faster than the ramp limit, and with no battery the electrolyzer has to follow it.`);
      case "shutdown": return h + (E ? `the battery couldn’t cover the gap, so the electrolyzer is shut down. It restarts when wind is back above the safe load and the battery is at 50%.` : `wind (${a} MW) is below the safe load and there’s no battery, so the electrolyzer is shut down.`);
      case "restart": return h + `wind is back above the safe load` + (E ? ` and the battery reached 50%, so the electrolyzer restarts.` : `, so the electrolyzer restarts.`);
      default: return h + `wind (${a} MW) is inside the safe window, so it all goes to the electrolyzer.`;
    }
  }

  function frame() {
    const s = run.steps[i], E = +$(".sim-size").value;
    $(".cursor").setAttribute("x1", x(i)); $(".cursor").setAttribute("x2", x(i));
    $(".wind-dot").setAttribute("cx", x(i)); $(".wind-dot").setAttribute("cy", yP(s.a));
    $(".pem-dot").setAttribute("cx", x(i)); $(".pem-dot").setAttribute("cy", yP(s.P));
    $(".soc-dot").style.display = E ? "" : "none";
    if (E) { $(".soc-dot").setAttribute("cx", x(i)); $(".soc-dot").setAttribute("cy", yS(s.soc)); }
    $(".sim-time").value = i;
    $(".v-w").textContent = f1(s.a) + " MW";
    $(".v-p").textContent = s.mode === "shutdown" ? "Off" : f1(s.P) + " MW";
    $(".v-c").textContent = f1(s.c) + " MW";
    $(".soc-fill").setAttribute("width", E ? (72 * s.soc).toFixed(1) : 0);
    const on = (sel, v) => { const el = $(sel); el.classList.toggle("on", v); el.setAttribute("marker-end", `url(#ar-${v ? "on" : "off"})`); };
    on(".f-wp", s.P > 0.01 && s.a > 0.01);
    on(".f-wb", s.ch > 0.01);
    on(".f-bp", s.dis > 0.01);
    on(".f-wc", s.c > 0.01);
    const m = s.mode === "restart" ? "normal" : s.mode === "rampDown" ? "rampUp" : s.mode;
    $(".sim-mode").innerHTML = `<i class="m-${m}"></i>${MODES[s.mode]}`;
    $(".sim-now").textContent = describe(s, E);
  }

  function tick(t) {
    if (!root.isConnected) return;
    if (playing && t - last > 110) { i = (i + 1) % N; last = t; frame(); }
    simTimer = requestAnimationFrame(tick);
  }
  const setPlay = v => { playing = v; $(".sim-play").textContent = v ? "Pause" : "Play"; };
  $(".sim-play").addEventListener("click", () => setPlay(!playing));
  $(".sim-time").addEventListener("input", e => { setPlay(false); i = +e.target.value; frame(); });
  $(".sim-size").addEventListener("input", draw);
  setPlay(playing);
  draw();
  if (simTimer) cancelAnimationFrame(simTimer);
  simTimer = requestAnimationFrame(tick);
}

/* ---------- Air quality project data and widgets ---------- */
// Values from the public TCEQ permit filing (cell materials process, Tesla Giga Texas)
const AQ_POLLUTANTS = ["PM10", "PM2.5", "Ammonia", "Sulfuric acid", "Aluminum", "Cobalt", "Manganese", "Nickel", "Lithium"];
// [emission point, source, then lb/hr & tpy pairs in AQ_POLLUTANTS order; null = not emitted at this point]
const AQ_POINTS = [
  ["H2SO4-TK1", "Sulfuric acid tote 1", null, null, null, null, null, null, 2.3e-9, 1.0e-8, null, null, null, null, null, null, null, null, null, null],
  ["H2SO4-TK2", "Sulfuric acid tote 2", null, null, null, null, null, null, 2.3e-9, 1.0e-8, null, null, null, null, null, null, null, null, null, null],
  ["CB1-P1-001", "Step 1 + Step 2", 3.5e-5, 1.5e-4, 3.5e-5, 1.5e-4, null, null, null, null, 6.4e-6, 2.8e-5, 1.7e-8, 7.4e-8, 9.9e-7, 4.3e-6, 1.5e-7, 6.7e-7, 8.0e-7, 3.5e-6],
  ["CB1-P1-002", "Step 3", 3.4e-4, 1.5e-3, 3.4e-4, 1.5e-3, null, null, null, null, 2.8e-4, 1.2e-3, 7.3e-7, 3.2e-6, 4.3e-5, 1.9e-4, 6.6e-6, 2.9e-5, 1.4e-5, 6.2e-5],
  ["CB1-P1-003", "Step 3", 3.4e-4, 1.5e-3, 3.4e-4, 1.5e-3, null, null, null, null, 0, 0, 0, 0, 0, 0, 0, 0, 1.4e-5, 6.2e-5],
  ["CB1-P1-004", "Step 3", 3.4e-4, 1.5e-3, 3.4e-4, 1.5e-3, null, null, null, null, 0, 0, 0, 0, 0, 0, 0, 0, 1.4e-5, 6.2e-5],
  ["CB1-P1-005", "Step 4", 2.1e-5, 9.1e-5, 2.1e-5, 9.1e-5, null, null, null, null, 1.7e-5, 7.4e-5, 4.4e-8, 1.9e-7, 2.6e-6, 1.1e-5, 4.0e-7, 1.7e-6, 8.5e-7, 3.7e-6],
  ["CB1-P1-006", "Step 4", 9.2e-4, 4.0e-3, 9.2e-4, 4.0e-3, null, null, null, null, 7.5e-4, 3.3e-3, 2.0e-6, 8.7e-6, 1.2e-4, 5.0e-4, 1.8e-5, 7.8e-5, 3.8e-5, 1.7e-4],
  ["CB1-P1-007", "Step 4", 3.1e-4, 1.4e-3, 3.1e-4, 1.4e-3, null, null, null, null, 2.5e-4, 1.1e-3, 6.6e-7, 2.9e-6, 3.9e-5, 1.7e-4, 5.9e-6, 2.6e-5, 1.3e-5, 5.6e-5],
  ["CB1-P1-008", "Step 5", 3.3e-4, 1.4e-3, 3.3e-4, 1.4e-3, null, null, null, null, 2.7e-4, 1.2e-3, 7.1e-7, 3.1e-6, 4.1e-5, 1.8e-4, 6.3e-6, 2.8e-5, 1.4e-5, 5.9e-5],
  ["CB1-P1-009", "Step 5", 1.7e-5, 7.5e-5, 1.7e-5, 7.5e-5, null, null, null, null, 1.4e-5, 6.1e-5, 3.7e-8, 1.6e-7, 2.1e-6, 9.3e-6, 3.3e-7, 1.4e-6, 7.0e-7, 3.1e-6],
  ["CB1-P1-010", "Step 5", 1.7e-5, 7.5e-5, 1.7e-5, 7.5e-5, null, null, null, null, 1.4e-5, 6.1e-5, 3.7e-8, 1.6e-7, 2.1e-6, 9.3e-6, 3.3e-7, 1.4e-6, 7.0e-7, 3.1e-6],
  ["CB1-P1-011", "Step 6", 4.5e-5, 2.0e-4, 4.5e-5, 2.0e-4, 3.9e-2, 1.7e-1, null, null, 3.7e-5, 1.6e-4, 9.7e-8, 4.3e-7, 5.7e-6, 2.5e-5, 8.7e-7, 3.8e-6, 1.9e-6, 8.2e-6],
  ["CB1-P1-012", "Step 6 + 7", 4.0e-5, 1.7e-4, 4.0e-5, 1.7e-4, null, null, null, null, 3.2e-5, 1.4e-4, 8.5e-8, 3.7e-7, 5.0e-6, 2.2e-5, 7.6e-7, 3.3e-6, 1.6e-6, 7.1e-6],
  ["CB1-P1-013", "Step 8", 1.6e-5, 7.1e-5, 1.6e-5, 7.1e-5, null, null, null, null, 1.3e-5, 5.8e-5, 3.5e-8, 1.5e-7, 2.0e-6, 8.9e-6, 3.1e-7, 1.4e-6, 6.7e-7, 2.9e-6],
];
// [group, chemical, rule, L (mg/m3), emitted lb/hr, limit lb/hr, emitted tpy, limit tpy]
const AQ_LIMITS = [
  ["Particulate matter", "PM10 / PM2.5", "§106.261(a)(3)", null, 2.78e-3, 1.00, 1.22e-2, 4.38],
  ["Ammonia", "Ammonia", "§106.262(a)(2)", 17, 3.91e-2, 17 / 139, 1.71e-1, 17 / 139 * 4.38],
  ["Sulfuric acid", "Sulfuric acid", "PSD threshold", null, 4.6e-9, null, 2.02e-8, 25],
  ["Battery materials", "Aluminum", "§106.262(a)(2)", 10, 1.68e-3, 7.19e-2, 7.37e-3, 3.15e-1],
  ["Battery materials", "Cobalt", "§106.262(a)(2)", 0.2, 4.43e-6, 1.44e-3, 1.94e-5, 6.30e-3],
  ["Battery materials", "Lithium", "§106.261(a)(3)", null, 1.14e-4, 1.00, 4.98e-4, 4.38],
  ["Battery materials", "Manganese", "§106.262(a)(2)", 0.2, 2.58e-4, 1.44e-3, 1.13e-3, 6.30e-3],
  ["Battery materials", "Nickel", "§106.262(a)(2)", 0.015, 3.97e-5, 1.08e-4, 1.74e-4, 4.73e-4],
];
const AQ_GROUP_CLASS = { "Particulate matter": "g-pm", "Ammonia": "g-nh3", "Sulfuric acid": "g-acid", "Battery materials": "g-bat" };

function sci(x) {
  if (x === null || x === undefined) return "–";
  if (x === 0) return "0";
  if (x >= 0.01 && x < 1000) return (+x.toPrecision(3)).toString();
  const e = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** e;
  return `${(+m.toFixed(2))} × 10<sup>${e}</sup>`.replace("-", "−");
}
const pct = (a, b) => (a !== null && b) ? a / b * 100 : null;
const fmtPct = p => p === null ? "–" : p >= 1 ? p.toFixed(1) + "%" : p >= 0.01 ? p.toFixed(2) + "%" : "&lt;0.01%";

function aqTidyCSV() {
  const rows = [["emission_point", "source", "pollutant", "short_term_lb_per_hr", "long_term_tons_per_yr"]];
  AQ_POINTS.forEach(r => AQ_POLLUTANTS.forEach((p, k) => {
    const h = r[2 + 2 * k], y = r[3 + 2 * k];
    if (h !== null) rows.push([r[0], r[1], p, h.toExponential(1).toUpperCase(), y.toExponential(1).toUpperCase()]);
  }));
  return rows;
}

function mountPdfCsv(root) {
  const rows = aqTidyCSV();
  const preview = rows.slice(0, 11).map(r => r.join(",")).join("\n");
  root.innerHTML = `
    <div class="pipe">
      <figure class="pipe-in">
        <div class="pipe-label">Before: a table inside the permit PDF</div>
        ${photo("images/project-four/pdf-table.jpg", "Emission table from the permit PDF", true)}
      </figure>
      <div class="pipe-arrow" aria-hidden="true"><span>Python pipeline</span></div>
      <div class="pipe-out">
        <div class="pipe-label">After: one tidy row per emission point and pollutant</div>
        <pre>${esc(preview)}\n…</pre>
        <div class="btns"><button type="button" class="btn primary csv-dl">Download sample CSV (${rows.length - 1} rows)</button></div>
      </div>
    </div>`;
  root.querySelector(".csv-dl").addEventListener("click", () => {
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "giga_texas_cell_materials_emissions.csv";
    document.body.appendChild(a); a.click(); a.remove();
  });
}

function mountAqData(root) {
  const rows = AQ_LIMITS.map(r => ({ group: r[0], name: r[1], rule: r[2], L: r[3], h: r[4], hl: r[5], y: r[6], yl: r[7],
    p: r[5] ? pct(r[4], r[5]) : pct(r[6], r[7]) }));
  const sorted = [...rows].sort((a, b) => b.p - a.p);
  const W = 760, LBL = 130, X1 = 700, MAX = 40, RH = 34;
  const xs = v => LBL + Math.min(v, MAX) / MAX * (X1 - LBL);
  const H = sorted.length * RH + 40;
  const bars = sorted.map((r, k) => {
    const y = 10 + k * RH;
    return `<text class="axis-t bar-l" x="${LBL - 10}" y="${y + 19}" text-anchor="end">${esc(r.name)}</text>
      <rect class="bar-bg" x="${LBL}" y="${y + 6}" width="${X1 - LBL}" height="18" rx="9"/>
      <rect class="bar ${AQ_GROUP_CLASS[r.group]}" x="${LBL}" y="${y + 6}" width="${Math.max(3, xs(r.p) - LBL).toFixed(1)}" height="18" rx="9"/>
      <text class="bar-v" x="${Math.max(xs(r.p), LBL + 3) + 8}" y="${y + 19}">${fmtPct(r.p)}</text>`;
  }).join("");
  const ticks = [0, 10, 20, 30, 40].map(t => `<text class="axis-t" x="${xs(t)}" y="${H - 6}" text-anchor="middle">${t}%</text><line class="tick" x1="${xs(t)}" x2="${xs(t)}" y1="10" y2="${H - 22}"/>`).join("");

  const pm = AQ_POINTS.filter(r => r[2] !== null);
  const pmMax = Math.max(...pm.map(r => r[2]));
  const PW = 760, PX0 = 56, PX1 = 750, PY0 = 16, PY1 = 196, bw = (PX1 - PX0) / pm.length;
  const pmBars = pm.map((r, k) => {
    const h = r[2] / 1e-3 / 1.0 * (PY1 - PY0), x = PX0 + k * bw + 6, top = PY1 - h;
    return `<rect class="pbar${r[0] === "CB1-P1-006" ? " top" : ""}" x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${(bw - 12).toFixed(1)}" height="${h.toFixed(1)}" rx="5"><title>${r[0]} (${r[1]}): ${r[2].toExponential(1)} lb/hr</title></rect>
      <text class="axis-t" x="${(x + (bw - 12) / 2).toFixed(1)}" y="${PY1 + 16}" text-anchor="middle">${r[0].slice(-3)}</text>
      <text class="axis-t small" x="${(x + (bw - 12) / 2).toFixed(1)}" y="${PY1 + 30}" text-anchor="middle">${esc({ "Step 1 + Step 2": "Steps 1–2", "Step 6 + 7": "Steps 6–7" }[r[1]] || r[1])}</text>`;
  }).join("");
  const pmTicks = [0, 0.25, 0.5, 0.75, 1].map(t => `<line class="tick" x1="${PX0}" x2="${PX1}" y1="${PY1 - t * (PY1 - PY0)}" y2="${PY1 - t * (PY1 - PY0)}"/><text class="axis-t" x="${PX0 - 8}" y="${PY1 - t * (PY1 - PY0) + 4}" text-anchor="end">${t ? (t * 1).toFixed(2) : "0"}</text>`).join("");

  root.innerHTML = `
    <div class="aq-block">
      <h3>How close each chemical gets to its limit</h3>
      <p class="aq-sub">Emission as a share of its allowed short-term limit</p>
      <div class="hbars" role="img" aria-label="Each chemical's emission as a percent of its limit">${sorted.map(r => `
        <div class="hbar"><span class="hb-l">${esc(r.name)}</span>
          <span class="hb-t"><span class="hb-f ${AQ_GROUP_CLASS[r.group]}" style="width:${Math.max(0.8, Math.min(r.p, MAX) / MAX * 100).toFixed(1)}%"></span></span>
          <span class="hb-v">${fmtPct(r.p)}</span></div>`).join("")}
        <div class="hbar hb-axis"><span></span><span class="hb-t">${[0, 10, 20, 30, 40].map(t => `<i style="left:${t / MAX * 100}%">${t}%</i>`).join("")}</span><span></span></div>
      </div>
      <div class="legend"><span><i class="g-pm"></i>Particulate matter</span><span><i class="g-nh3"></i>Ammonia</span><span><i class="g-acid"></i>Sulfuric acid</span><span><i class="g-bat"></i>Battery materials</span></div>
      <p class="aq-take">The chemicals that come closest to their limits are mostly battery materials: nickel (36.8%) and manganese (17.9%) are two of the top three. Their limit values are among the strictest in the filing, so even trace amounts from the cell materials process count. Ammonia from the scrubber is the only non-battery chemical near the top, at 32%.</p>
      <p class="aq-note">Sulfuric acid is compared with the 25 tons/yr threshold listed in the filing, since it has no hourly limit there.</p>
    </div>
    <div class="aq-block">
      <h3>Particulate matter by emission point</h3>
      <p class="aq-sub">PM10 from each dust collector stack (thousandths of a lb/hr)</p>
      <div class="chart-wrap"><svg class="aq-chart pm" viewBox="0 0 ${PW} 240" role="img" aria-label="PM10 emissions from each of the 13 stacks">${pmTicks}${pmBars}</svg></div>
    </div>
    <p class="aq-note">Source: Tesla, Inc. Permit-By-Rule Authorization Application to TCEQ (public copy), cell materials process.</p>`;
}

function mountKSlider(root) {
  const KT = [[100, 326], [200, 200], [300, 139], [400, 104], [600, 65], [700, 54], [800, 46], [900, 39], [1000, 34], [2000, 14], [3000, 8]];
  const kAt = d => { if (d <= 100) return 326; if (d >= 3000) return 8;
    for (let i = 0; i < KT.length - 1; i++) { const [d0, k0] = KT[i], [d1, k1] = KT[i + 1]; if (d <= d1) return k0 + (k1 - k0) * (d - d0) / (d1 - d0); } };
  const chems = [["Nickel", 0.015, 3.97e-5], ["Manganese", 0.2, 2.58e-4], ["Ammonia", 17, 3.91e-2]];
  root.innerHTML = `
    <label class="sim-range">Distance to the nearest home or school <output class="k-o"></output>
      <input type="range" class="k-d" min="100" max="3000" step="50" value="300" aria-label="Distance in feet"></label>
    <div class="k-rows"></div>
    <p class="aq-note">K values from TCEQ’s table, interpolated between listed distances. The allowed rate never goes above 6 lb/hr.</p>`;
  const draw = () => {
    const d = +root.querySelector(".k-d").value, K = kAt(d);
    root.querySelector(".k-o").textContent = `${d.toLocaleString()} ft, so K = ${K.toFixed(0)}${d === 300 ? " (the real distance in this filing)" : ""}`;
    root.querySelector(".k-rows").innerHTML = chems.map(([n, L, a]) => {
      const E = Math.min(L / K, 6), p = a / E * 100;
      return `<div class="k-row"><div class="k-name">${n}<small>L = ${L} mg/m³</small></div>
        <div class="k-bar"><span style="width:${Math.min(p, 100).toFixed(1)}%" class="${p > 100 ? "over" : ""}"></span></div>
        <div class="k-val">${p > 100 ? "Over limit" : fmtPct(p) + " of limit"}<small>allowed ${sci(E)} lb/hr</small></div></div>`;
    }).join("");
  };
  root.querySelector(".k-d").addEventListener("input", draw);
  draw();
}


const FAB_STREAMS = [
 {id:'upw_rinse',label:'UPW rinse reclaim',short:'Rinse',flow:15120,capture:85,tds:350,color:'#398a85'},
 {id:'hf_acid',label:'HF / acid stream',short:'HF / acid',flow:3888,capture:10,tds:1200,color:'#ab824e'},
 {id:'copper',label:'Copper-bearing stream',short:'Copper',flow:2592,capture:10,tds:900,color:'#aa6256'},
 {id:'cooling',label:'Cooling wastewater',short:'Cooling',flow:5400,capture:30,tds:1500,color:'#5686b0'},
 {id:'utility',label:'Scrubbers / facilities',short:'Utility',flow:3000,capture:20,tds:700,color:'#7b76a6'}
];
const FAB_DEFAULT_CAPTURE = Object.fromEntries(FAB_STREAMS.map(s=>[s.id,s.capture]));
const formatWater = (v,digits=0)=>v.toLocaleString('en-US',{minimumFractionDigits:digits,maximumFractionDigits:digits});
function fabBalance(captures=FAB_DEFAULT_CAPTURE,basis='wave') {
 const streams=FAB_STREAMS.map(s=>{
  const capture=Math.max(0,Math.min(100,Number(captures[s.id] ?? s.capture)));
  const evaporated=s.id==='cooling'?s.flow*.015:0;
  const wastewater=s.flow-evaporated;
  const captured=wastewater*capture/100;
  const recovery=basis==='step1'?.75:(s.id==='upw_rinse'?8674/12852:.675);
  const tds=basis==='step1'?s.tds*.02:(s.id==='upw_rinse'?1.498:s.tds*(1-.99582));
  const recovered=captured*recovery;
  return {...s,capture,evaporated,wastewater,captured,recovery,recovered,tds,reject:captured-recovered,discharged:wastewater-recovered};
 });
 const sum=key=>streams.reduce((v,s)=>v+s[key],0);
 const demand=30000,recovered=sum('recovered'),evaporated=sum('evaporated'),discharged=sum('discharged');
 return {basis,streams,demand,recovered,evaporated,discharged,freshwater:demand-recovered,rate:recovered/demand*100};
}
function multiSourceCooling(fab,cycles=4,requests={upw_rinse:25,hf_acid:0,copper:0,cooling:20,utility:35}) {
 const evaporation=81;
 const c=Math.max(2,Math.min(8,cycles));
 const blowdown=evaporation/(c-1),makeup=evaporation+blowdown;
 const allocations=fab.streams.map(s=>{
  // The tower can recover only its own current blowdown, not the fab's cooling-flow placeholder.
  const available=s.id==='cooling'?blowdown*s.capture/100*s.recovery:s.recovered;
  const requested=makeup*Math.max(0,Math.min(100,Number(requests[s.id]??0)))/100;
  return {...s,available,requested,used:Math.min(available,requested)};
 });
 const requestedTotal=allocations.reduce((v,s)=>v+s.used,0);
 const scale=requestedTotal>makeup?makeup/requestedTotal:1;
 allocations.forEach(s=>s.used*=scale);
 const reused=allocations.reduce((v,s)=>v+s.used,0);
 const freshwater=Math.max(0,makeup-reused);
 const internal=allocations.find(s=>s.id==='cooling').used;
 const external=reused-internal;
 const tds=(allocations.reduce((v,s)=>v+s.used*s.tds,0)+freshwater*300)/makeup;
 return {cycles:c,evaporation,blowdown,makeup,allocations,reused,freshwater,internal,external,netBlowdown:blowdown-internal,tds,scale};
}

function mountFabBaseline(root) {
 const b=fabBalance(FAB_DEFAULT_CAPTURE,'step1');
 root.innerHTML=`<div class="baseline-metrics"><div><span>Daily end-use demand</span><b>30,000 <small>m³/day</small></b></div><div><span>Step 1 recovered water</span><b>${formatWater(b.recovered)} <small>m³/day</small></b></div><div><span>Step 1 recovery fraction</span><b>${b.rate.toFixed(1)}<small>%</small></b></div></div>
 <div class="results-table"><table><caption class="sr-only">Step 1 water balance reproduced from the supplied Python code</caption><thead><tr><th scope="col">Wastewater stream</th><th scope="col">Available flow</th><th scope="col">Capture</th><th scope="col">Recovered at 75%</th></tr></thead><tbody>${b.streams.map(s=>`<tr><th scope="row">${esc(s.label)}</th><td>${formatWater(s.wastewater,1)} m³/day</td><td>${s.capture}%</td><td>${formatWater(s.recovered,1)} m³/day</td></tr>`).join('')}</tbody></table></div>
 <p class="source-note">Reproduced from <a href="assets/step_1_waterbalancemodel.py" target="_blank" rel="noopener">my Step 1 code</a>. Cooling evaporation is 81 m³/day; model discharge is ${formatWater(b.discharged)} m³/day. This is a volumetric recovery calculation, before a complete reuse-quality and discharge assessment.</p>`;
}

function mountWaterBalance(root) {
 root.innerHTML=`<div class="balance fab-explorer"><div class="explorer-top"><div><div class="eyebrow">FIVE STREAMS · ONE BALANCE</div><h3>Follow every source.</h3></div><label class="basis-control">Treatment basis<select class="fab-basis" aria-label="Water treatment input basis"><option value="wave">Step 3 inputs · WAVE-based</option><option value="step1">Step 1 assumptions</option></select></label></div>
 <p class="explorer-sub">Adjust the share of each wastewater stream captured for treatment.</p>
 <div class="fab-explorer-layout"><div class="fab-source-controls">${FAB_STREAMS.map(s=>`<label class="source-control" style="--source:${s.color}"><span class="source-heading"><span>${esc(s.label)}</span><output class="capture-${s.id}" id="capture-${s.id}">${s.capture}%</output></span><input type="range" class="capture-input" data-source="${s.id}" min="0" max="100" step="1" value="${s.capture}" aria-label="Capture percentage for ${esc(s.label)}" aria-describedby="capture-${s.id}"><span class="source-detail detail-${s.id}"></span></label>`).join('')}</div>
 <div><dl class="water-metrics" aria-live="polite" aria-atomic="true"><div><dt>Potential recovered water</dt><dd class="fab-recovered"></dd></div><div><dt>Remaining freshwater volume</dt><dd class="fab-fresh"></dd></div><div><dt>Recovery fraction</dt><dd class="fab-rate"></dd></div><div><dt>Discharge volume</dt><dd class="fab-discharge"></dd></div></dl>
 <div class="fab-stack" role="img" aria-label="Recovered volume by source"></div><div class="source-key">${FAB_STREAMS.map(s=>`<span><i style="background:${s.color}"></i>${esc(s.short)}</span>`).join('')}</div><p class="fab-basis-note source-note"></p></div></div>
 <p class="balance-equation fab-equation"></p><div class="explorer-bottom"><button class="btn ghost reset-fab" type="button">Reset my inputs</button><span class="source-note">Quantity scenario; not an optimized or quality-certified reuse result.</span></div></div>`;
 const q=s=>root.querySelector(s);
 const inputs=[...root.querySelectorAll('.capture-input')];
 const draw=()=>{
  const cap=Object.fromEntries(inputs.map(el=>[el.dataset.source,+el.value]));
  const b=fabBalance(cap,q('.fab-basis').value);
  b.streams.forEach(s=>{q('.capture-'+s.id).textContent=s.capture+'%';q('.detail-'+s.id).textContent=`${formatWater(s.captured)} captured → ${formatWater(s.recovered)} m³/day recovered`;});
  const amount=v=>formatWater(v)+' <small>m³/day</small>';
  q('.fab-recovered').innerHTML=amount(b.recovered);q('.fab-fresh').innerHTML=amount(b.freshwater);q('.fab-rate').innerHTML=b.rate.toFixed(1)+'<small>%</small>';q('.fab-discharge').innerHTML=amount(b.discharged);
  q('.fab-stack').innerHTML=b.streams.map(s=>`<span style="width:${s.recovered/b.demand*100}%;background:${s.color}" title="${esc(s.label)}: ${formatWater(s.recovered)} m³/day"></span>`).join('')+`<span style="flex:1;background:var(--rule)" title="Remaining freshwater volume"></span>`;
  q('.fab-stack').setAttribute('aria-label',b.rate.toFixed(1)+' percent recovered; '+(100-b.rate).toFixed(1)+' percent remaining freshwater volume');
  q('.fab-equation').textContent=`${formatWater(b.demand)} demand = ${formatWater(b.recovered,1)} potential recovery + ${formatWater(b.discharged,1)} discharge + ${formatWater(b.evaporated)} evaporation (m³/day)`;
  q('.fab-basis-note').textContent=b.basis==='step1'?'Original inputs: 75% RO water recovery and 98% TDS removal for all five streams.':'Rinse reclaim uses the reported WAVE design point: 8,674 m³/day at the original capture setting and 1.498 mg/L TDS. The other four streams use the Step 3 code’s estimated 67.5% recovery and 99.582% TDS removal.';
  const coolingRoot=document.querySelector('#case [data-widget="cooling-sources"]');
  if(coolingRoot&&coolingRoot.updateFab)coolingRoot.updateFab(b);
 };
 inputs.forEach(el=>el.addEventListener('input',draw));q('.fab-basis').addEventListener('change',draw);
 q('.reset-fab').addEventListener('click',()=>{inputs.forEach(el=>el.value=FAB_DEFAULT_CAPTURE[el.dataset.source]);q('.fab-basis').value='wave';draw();});
 root.currentBalance=()=>fabBalance(Object.fromEntries(inputs.map(el=>[el.dataset.source,+el.value])),q('.fab-basis').value);
 draw();
}

function mountCoolingSources(root) {
 const defaults={upw_rinse:25,hf_acid:0,copper:0,cooling:20,utility:35};
 let fab=fabBalance();
 const upstream=document.querySelector('#case [data-widget="water-balance"]');
 if(upstream&&upstream.currentBalance)fab=upstream.currentBalance();
 root.innerHTML=`<div class="balance cooling-explorer"><div class="explorer-top"><div><div class="eyebrow">MULTIPLE SOURCES · COOLING MAKEUP</div><h3>Build a makeup-water mix.</h3></div><label class="cooling-cycle-control">Cycles of concentration <output class="cycles-value" id="tower-cycles"></output><input class="tower-cycles" type="range" min="2" max="8" step=".5" value="4" aria-label="Tower cycles of concentration" aria-describedby="tower-cycles"></label></div>
 <p class="explorer-sub">Set the share of makeup you would like each recovered source to supply. Actual flow is capped by available recovery; requests above total demand are scaled together.</p>
 <div class="fab-explorer-layout"><div class="fab-source-controls">${FAB_STREAMS.map(s=>`<label class="source-control" style="--source:${s.color}"><span class="source-heading"><span>${s.id==='cooling'?'Tower blowdown recycle':esc(s.label)}</span><output class="share-${s.id}" id="share-${s.id}">${defaults[s.id]}%</output></span><input class="mix-input" data-source="${s.id}" type="range" min="0" max="100" step="1" value="${defaults[s.id]}" aria-label="Requested makeup share from ${s.id==='cooling'?'tower blowdown recycle':esc(s.label)}" aria-describedby="share-${s.id}"><span class="source-detail use-${s.id}"></span></label>`).join('')}</div>
 <div><dl class="water-metrics" aria-live="polite" aria-atomic="true"><div><dt>Freshwater makeup</dt><dd class="tower-fresh"></dd></div><div><dt>Reclaimed makeup</dt><dd class="tower-reuse"></dd></div><div><dt>Net blowdown purge</dt><dd class="tower-purge"></dd></div><div><dt>Freshwater displaced</dt><dd class="tower-saving"></dd></div></dl><div class="tower-stack fab-stack" role="img"></div><div class="source-key">${FAB_STREAMS.map(s=>`<span><i style="background:${s.color}"></i>${esc(s.short)}</span>`).join('')}<span><i style="background:#c9d1d8"></i>Freshwater</span></div><p class="tower-quality source-note"></p></div></div>
 <p class="tower-equation balance-equation"></p><p class="tower-state source-note"></p><div class="explorer-bottom"><button class="btn ghost reset-tower" type="button">Reset water mix</button></div>
 <p class="source-note">Separate tower scenario: evaporation is fixed at 81 m³/day; drift is neglected. The 5,400 m³/day cooling-use placeholder in Step 1 is not treated as calculated tower makeup. Blowdown recycle is limited to this tower’s actual blowdown. HF/acid and copper sources assume appropriate pretreatment; TDS alone does not establish reuse suitability. <a href="https://www.energy.gov/cmei/femp/best-management-practice-10-cooling-tower-management" target="_blank" rel="noopener">Water balance reference ↗</a></p></div>`;
 const q=s=>root.querySelector(s),inputs=[...root.querySelectorAll('.mix-input')];
 const draw=()=>{
  const requests=Object.fromEntries(inputs.map(el=>[el.dataset.source,+el.value]));
  const c=multiSourceCooling(fab,+q('.tower-cycles').value,requests);
  q('.cycles-value').textContent=c.cycles.toFixed(1)+' cycles';
  c.allocations.forEach(s=>{q('.share-'+s.id).textContent=requests[s.id]+'% requested';q('.use-'+s.id).textContent=`${formatWater(s.used,1)} supplied / ${formatWater(s.available,1)} available m³/day`;});
  const amount=v=>formatWater(v,1)+' <small>m³/day</small>';
  q('.tower-fresh').innerHTML=amount(c.freshwater);q('.tower-reuse').innerHTML=amount(c.reused);q('.tower-purge').innerHTML=amount(c.netBlowdown);q('.tower-saving').textContent=(c.reused/c.makeup*100).toFixed(1)+'%';
  q('.tower-stack').innerHTML=c.allocations.map(s=>`<span style="width:${s.used/c.makeup*100}%;background:${s.color}"></span>`).join('')+`<span style="width:${c.freshwater/c.makeup*100}%;background:#c9d1d8"></span>`;
  q('.tower-stack').setAttribute('aria-label',`Tower makeup: ${formatWater(c.reused,1)} reclaimed and ${formatWater(c.freshwater,1)} freshwater cubic meters per day`);
  q('.tower-equation').textContent=`${formatWater(c.makeup,1)} makeup = 81.0 evaporation + ${formatWater(c.blowdown,1)} gross blowdown (m³/day)`;
  q('.tower-quality').textContent=`Estimated blended makeup TDS: ${c.tds.toFixed(1)} mg/L (model cooling limit: 600 mg/L).`;
  q('.tower-state').textContent=`${formatWater(c.external,1)} m³/day comes from other fab streams; ${formatWater(c.internal,1)} m³/day is the tower’s internal blowdown return. ${c.scale<1?'Requests were scaled to avoid overfilling tower makeup.':''}`;
 };
 root.updateFab=next=>{fab=next;draw();};
 inputs.forEach(el=>el.addEventListener('input',draw));q('.tower-cycles').addEventListener('input',draw);
 q('.reset-tower').addEventListener('click',()=>{inputs.forEach(el=>el.value=defaults[el.dataset.source]);q('.tower-cycles').value=4;draw();});
 draw();
}

function mountSolarResults(root) {
 root.innerHTML=`<div class="results-table"><table><caption class="sr-only">Selected modeled PV and battery storage results from the solar research report</caption><thead><tr><th scope="col">Site</th><th scope="col">PV</th><th scope="col">Battery power</th><th scope="col">Battery energy</th><th scope="col">25-year savings</th></tr></thead><tbody>
 <tr><td><b>University Teaching Center</b><br>Conservative building-area case</td><td>221 kW</td><td>26 kW</td><td>70 kWh</td><td>$202,476</td></tr>
 <tr><td><b>East Campus Garage</b><br>Garage case with assumed EV charging</td><td>304 kW</td><td>183 kW</td><td>547 kWh</td><td>$220,598</td></tr>
 </tbody></table></div><p class="source-note">Source: <a href="assets/UT_Austin_Solar_Research_Report.pdf#page=14" target="_blank" rel="noopener">research report, Tables 3–4 and conclusion (pp. 14–19)</a>. Savings are modeled over 25 years using the study’s assumptions, not guaranteed returns. The report does not demonstrate installation.</p>`;
}

const WIDGETS = { "fab-baseline": mountFabBaseline, "cooling-sources": mountCoolingSources, "water-balance": mountWaterBalance, "solar-results": mountSolarResults, "wind-sim": mountWindSim, "pdf-csv": mountPdfCsv, "aq-data": mountAqData, "k-slider": mountKSlider };

let currentView = decodeURIComponent(location.hash.slice(1));

function route(id = currentView) {
  currentView = id;
  const exp = EXPERIENCE.find(p => p.id === id);
  const project = PROJECTS.find(p => p.id === id) || exp;
  const home = document.getElementById("home"), cs = document.getElementById("case");
  if (id === "publications") {
    renderPublications();
    home.hidden = true; cs.hidden = false;
    window.scrollTo(0, 0);
    cs.focus({preventScroll:true});
  } else if (project) {
    renderCase(project, exp ? { href: "#experience", label: "experience" } : undefined);
    home.hidden = true; cs.hidden = false;
    window.scrollTo(0, 0);
    cs.focus({preventScroll:true});
  } else {
    document.title = `${SITE.name} | Environmental Engineering`;
    const wasCase = !cs.hidden;
    cs.hidden = true; home.hidden = false;
    const target = id && document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: wasCase ? "auto" : "smooth" });
    else window.scrollTo(0, 0);
  }
}

// Links like href="#projects" or a project card are handled here, so they work everywhere:
// on GitHub Pages, opened from your computer, or inside a preview window.
document.addEventListener("click", e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  const id = decodeURIComponent(a.getAttribute("href").slice(1));
  try { history.pushState(null, "", "#" + id); } catch (err) { /* some previews block this; navigation still works */ }
  route(id);
});
window.addEventListener("popstate", () => route(decodeURIComponent(location.hash.slice(1))));

// Click a case-study photo to see it bigger
const box = document.getElementById("lightbox");
document.addEventListener("click", e => {
  const img = e.target.closest("img[data-zoom]");
  if (img) {
    box.querySelector("img").src = img.src;
    box.querySelector("p").textContent = img.alt;
    box.showModal();
  } else if (e.target.closest("dialog")) box.close();
});

renderHome();
window.addEventListener("hashchange", () => route(decodeURIComponent(location.hash.slice(1))));
route();
