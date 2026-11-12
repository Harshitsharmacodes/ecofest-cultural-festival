/*!
 * EcoFest 2026 – SATI  |  3D Enchanted-Forest Intro + Scroll Journey
 * ---------------------------------------------------------------
 * Drop-in, zero-build script. Add ONE line to your index.html (inside <head>):
 *
 *     <script src="ecofest-3d.js" defer></script>
 *
 * What it does
 *  1. First visit (per browser session): a cinematic 3D intro. A glowing seed drops,
 *     a procedural 3D tree GROWS branch by branch, leaves burst open, fireflies drift,
 *     and "SATI – Samrat Ashok Technological Institute" appears in glowing 3D letters.
 *     Click "Enter the Enchanted Forest" (or wait) and the camera flies through the
 *     canopy into your normal website.
 *  2. Scrolling down: a pinned "Forest Journey" section. The tree grows, blossoms pink,
 *     lights up at night (fireflies + bioluminescent leaves), then turns golden and
 *     drops falling leaves – with 4 story chapters tied to your festival content.
 *  3. Site-wide polish: green scroll-progress bar, drifting leaves, and gentle
 *     reveal-on-scroll for your existing sections.
 *
 * Needs internet (loads Three.js from the jsdelivr CDN). If it can't load, a lightweight
 * CSS fallback intro is shown and the normal site keeps working.
 *
 * Change texts/timings below, or override from your HTML BEFORE this script:
 *     <script>window.ECOFEST_3D_CONFIG = { autoEnterAfter: 0 };</script>
 * Test the intro again any time:  open your site with  ?intro=1  at the end of the URL.
 */
(function () {
  'use strict';
  if (window.__ecofest3d) return;
  window.__ecofest3d = true;

  /* ------------------------------------------------------------------ CONFIG */
  var DEFAULTS = {
    collegeShort: 'SATI',
    collegeName: 'Samrat Ashok Technological Institute',
    presents: 'presents',
    festival: 'ECOFEST 2026',
    tagline: 'Where Culture Blooms in Enchanted Nature',
    enterText: 'Enter the Enchanted Forest',
    loadingText: 'Growing the forest',
    skipText: 'Skip intro',
    showOncePerSession: true,   // false = play the intro on every page load
    autoEnterAfter: 5,          // seconds after the button appears; 0 = wait for click
    insertAfterSelector: '#hero', // the scroll journey is inserted after this element
    registrationHref: '#registration',
    threeUrl: 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js',
    chapters: [
      {
        side: 'l', label: 'Chapter I · Sprout',
        title: 'Every forest begins with a seed',
        text: 'Day 1 opens at The Whispering Banyan Grove – saplings, seed bombs and the first notes of the festival.',
        stat: { value: 3, prefix: '', suffix: '', decimals: 0, label: 'Enchanted Days' }
      },
      {
        side: 'r', label: 'Chapter II · Bloom',
        title: 'Where art & lens meet the wild',
        text: 'Macro photography walks, living-clay bio-sculptures and sun-dyed tapestries – creativity that returns to the soil.',
        stat: { value: 18, prefix: '', suffix: '+', decimals: 0, label: 'Curated Events' }
      },
      {
        side: 'l', label: 'Chapter III · Canopy',
        title: 'When the grove lights up at night',
        text: 'Acoustic Forest Symphony, drum & flute circles and poetry under the stars – powered only by solar.',
        stat: { value: 1500, prefix: '', suffix: '+', decimals: 0, label: 'Saplings Planted' }
      },
      {
        side: 'r', label: 'Chapter IV · Harvest',
        title: 'Take root with SATI',
        text: 'Claim your free EcoPass and walk away with a native seed bomb kit. Zero plastic, 100% impact.',
        stat: { value: 1.5, prefix: '\u20B9', suffix: 'L', decimals: 1, label: 'Green Prize Pool' },
        cta: 'Claim Your EcoPass \u2192'
      }
    ]
  };
  var C = Object.assign({}, DEFAULTS, window.ECOFEST_3D_CONFIG || {});
  var SEEN_KEY = 'ecofest3d-intro-seen';

  /* ----------------------------------------------------------------- HELPERS */
  var prefersReduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MOBILE = Math.min(window.innerWidth, window.innerHeight) < 700 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function sm(a, b, x) { return smooth((x - a) / (b - a)); }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  // Split text into words -> letters so each letter can flip in 3D
  function letters(text, delay0, step) {
    var i = 0;
    return String(text).split(' ').map(function (word) {
      var inner = Array.from(word).map(function (ch) {
        return '<span class="ch" style="--d:' + (delay0 + (i++) * step).toFixed(2) + 's">' + esc(ch) + '</span>';
      }).join('');
      return '<span class="w">' + inner + '</span>';
    }).join('<span class="sp"> </span>');
  }
  function lockScroll() { document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden'; }
  function unlockScroll() { document.documentElement.style.overflow = ''; document.body.style.overflow = ''; }

  /* --------------------------------------------------------------------- CSS */
  function injectAssets() {
    var l1 = el('link'); l1.rel = 'preconnect'; l1.href = 'https://fonts.googleapis.com';
    var l2 = el('link'); l2.rel = 'preconnect'; l2.href = 'https://fonts.gstatic.com'; l2.crossOrigin = 'anonymous';
    var l3 = el('link'); l3.rel = 'stylesheet'; l3.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&display=swap';
    document.head.appendChild(l1); document.head.appendChild(l2); document.head.appendChild(l3);

    var css = '\
:root{--eco-gold:#f6d365;--eco-green:#3ddc97;--eco-deep:#04120d}\
/* ---------- INTRO ---------- */\
.ei{position:fixed;inset:0;z-index:99999;background:#02090a;overflow:hidden;color:#eafff4;transition:opacity 1s ease,visibility 1s;opacity:1;font-family:inherit;--g:0;--mx:0;--my:0}\
.ei.out{opacity:0;visibility:hidden;pointer-events:none}\
.ei-canvas{position:absolute;inset:0;width:100%;height:100%;display:block}\
.ei-glow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 55% 48% at 50% 56%,rgba(61,220,151,calc(.30*var(--g))),transparent 72%)}\
.ei-rays{position:absolute;inset:-25%;pointer-events:none;opacity:calc(var(--g)*.6);mix-blend-mode:screen;transform-origin:50% 0;animation:eiSway 12s ease-in-out infinite alternate;background:conic-gradient(from 145deg at 50% 0%,transparent 0deg,transparent 6deg,rgba(255,240,170,.20) 10deg,transparent 14deg,transparent 22deg,rgba(255,240,170,.13) 25deg,transparent 28deg,transparent 34deg,rgba(190,255,205,.16) 39deg,transparent 44deg,transparent 52deg,rgba(255,240,170,.12) 55deg,transparent 58deg,transparent 66deg,rgba(255,240,170,.18) 70deg,transparent 74deg,transparent 360deg)}\
@keyframes eiSway{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}\
.ei-vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 42%,rgba(0,0,0,.78) 100%)}\
.ei-flash{position:absolute;inset:0;pointer-events:none;opacity:0;background:radial-gradient(circle at 50% 50%,#f6ffd9,#b9ffd0 40%,#3ddc97 85%)}\
.ei-loading{position:absolute;inset:0;display:grid;place-items:center;font:600 12px/1 Cinzel,serif;letter-spacing:.45em;text-transform:uppercase;color:#7fe0b0;transition:opacity .6s;z-index:2;animation:eiBlink 1.4s ease-in-out infinite}\
.ei.ready .ei-loading{opacity:0;pointer-events:none;animation:none}\
@keyframes eiBlink{50%{opacity:.35}}\
.ei-skip{position:absolute;right:16px;top:14px;z-index:5;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.25);color:#e9fff3;padding:8px 14px;border-radius:999px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;backdrop-filter:blur(6px)}\
.ei-skip:hover{background:rgba(255,255,255,.18)}\
.ei-top{position:absolute;left:0;right:0;top:clamp(46px,8vh,86px);text-align:center;perspective:900px;pointer-events:none;padding:0 14px;transform:rotateY(calc(var(--mx)*7deg)) rotateX(calc(var(--my)*-5deg));transition:transform .25s ease-out}\
.ei .w{display:inline-block;white-space:nowrap}\
.ei .sp{display:inline-block;width:.5em}\
.ei .ch{display:inline-block;opacity:0;transform:perspective(600px) rotateX(-95deg) translateY(40px) translateZ(-60px);transform-origin:50% 100%}\
.ei.show-name .ei-top .ch,.ei.show-title .ei-fest .ch{animation:chIn .95s cubic-bezier(.2,.85,.25,1) forwards;animation-delay:var(--d)}\
.ei.static .ch{opacity:1!important;transform:none!important;animation:none!important}\
@keyframes chIn{0%{opacity:0;transform:perspective(600px) rotateX(-95deg) translateY(40px) translateZ(-60px)}60%{opacity:1}100%{opacity:1;transform:perspective(600px) rotateX(0) translateY(0) translateZ(0)}}\
.ei-sati{font-family:Cinzel,Georgia,serif;font-weight:800;font-size:clamp(56px,13vw,160px);letter-spacing:.1em;line-height:1;filter:drop-shadow(0 0 22px rgba(246,211,101,.5)) drop-shadow(0 7px 0 rgba(90,50,0,.35))}\
.ei-sati .ch{background:linear-gradient(180deg,#fffbd0 0%,#f6d365 45%,#d98a1f 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}\
.ei-name{margin-top:8px;font-family:Cinzel,Georgia,serif;font-weight:600;font-size:clamp(11px,2.2vw,23px);letter-spacing:.26em;text-transform:uppercase;color:#dcffec;text-shadow:0 0 14px rgba(61,220,151,.7),0 2px 6px rgba(0,0,0,.6)}\
.ei-bottom{position:absolute;left:0;right:0;bottom:clamp(18px,5vh,56px);text-align:center;padding:0 14px;perspective:900px}\
.ei-presents{font-size:clamp(10px,1.5vw,15px);letter-spacing:.5em;text-transform:uppercase;color:#9fe8c2;opacity:0;transition:opacity 1.2s;text-shadow:0 2px 8px #000}\
.ei.show-title .ei-presents{opacity:1}\
.ei-fest{margin-top:6px;font-family:Cinzel,Georgia,serif;font-weight:800;font-size:clamp(30px,6.4vw,78px);letter-spacing:.12em;line-height:1.05;color:#f2fff7;text-shadow:0 0 26px rgba(61,220,151,.75),0 4px 14px rgba(0,0,0,.65)}\
.ei-tag{margin-top:8px;font-size:clamp(12px,1.7vw,18px);letter-spacing:.18em;color:#c9f5dc;opacity:0;transition:opacity 1.4s .5s;text-shadow:0 2px 8px #000}\
.ei.show-title .ei-tag{opacity:.95}\
.ei-btn{margin-top:18px;opacity:0;transform:translateY(16px);pointer-events:none;transition:opacity .9s,transform .9s;padding:14px 30px;border-radius:999px;border:1px solid rgba(246,211,101,.7);background:linear-gradient(135deg,rgba(61,220,151,.30),rgba(246,211,101,.22));color:#fff;font-weight:600;font-size:clamp(13px,1.6vw,16px);line-height:1;font-family:inherit;letter-spacing:.1em;cursor:pointer;backdrop-filter:blur(8px);box-shadow:0 0 28px rgba(61,220,151,.4)}\
.ei.show-btn .ei-btn{opacity:1;transform:none;pointer-events:auto;animation:eiPulse 2.2s ease-in-out infinite}\
.ei.entering .ei-btn,.ei.entering .ei-skip{opacity:0;pointer-events:none}\
@keyframes eiPulse{50%{box-shadow:0 0 46px rgba(246,211,101,.65);transform:scale(1.04)}}\
.ei-fbwrap{position:absolute;inset:0;display:none}\
.ei.fallback .ei-fbwrap{display:block}\
.ei.fallback .ei-canvas,.ei.fallback .ei-flash{display:none}\
.ei-fb-tree{position:absolute;left:0;right:0;bottom:22%;margin:auto;width:min(60vw,340px);transform-origin:50% 100%;animation:eiGrow 2.6s cubic-bezier(.2,.8,.2,1) both;filter:drop-shadow(0 0 30px rgba(61,220,151,.5))}\
@keyframes eiGrow{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}\
/* hero reveal after the intro */\
body.eco-hero-in #hero>*{animation:ecoHeroIn 1.4s cubic-bezier(.2,.7,.2,1) both}\
@keyframes ecoHeroIn{from{opacity:0;transform:translateY(40px) scale(.97);filter:blur(6px)}to{opacity:1;transform:none;filter:none}}\
/* ---------- GLOBAL ---------- */\
#eco-bar{position:fixed;top:0;left:0;height:3px;width:100%;transform-origin:0 50%;transform:scaleX(0);background:linear-gradient(90deg,#3ddc97,#f6d365);z-index:9998;box-shadow:0 0 12px #3ddc97;pointer-events:none}\
#eco-leaves{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:40}\
.eco-reveal{opacity:0;transform:translateY(36px) scale(.985);transition:opacity .9s cubic-bezier(.2,.7,.2,1) var(--ed,0s),transform .9s cubic-bezier(.2,.7,.2,1) var(--ed,0s)}\
.eco-reveal.eco-in{opacity:1;transform:none}\
/* ---------- JOURNEY ---------- */\
#eco-journey{position:relative;height:520vh;background:#04120d;z-index:1}\
.ej-sticky{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden}\
.ej-canvas{position:absolute;inset:0;width:100%;height:100%;display:block}\
.ej-vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,.6) 100%)}\
.ej-top{position:absolute;left:clamp(16px,4vw,48px);top:18px;font:600 12px/1 Cinzel,serif;letter-spacing:.3em;text-transform:uppercase;color:rgba(220,255,236,.8);text-shadow:0 2px 8px #000;pointer-events:none}\
.ej-card{position:absolute;max-width:min(430px,86vw);padding:22px 26px;border-radius:22px;color:#eafff4;background:rgba(6,28,20,.58);border:1px solid rgba(120,255,190,.28);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 12px 50px rgba(0,0,0,.5),inset 0 0 34px rgba(61,220,151,.09);opacity:0;pointer-events:none;--base:-50%;--ty:0px;transform:translateY(calc(var(--base) + var(--ty)));top:50%}\
.ej-card.l{left:clamp(16px,6vw,96px)}\
.ej-card.r{right:clamp(16px,6vw,96px)}\
.ej-chap{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:#7fe0b0}\
.ej-title{font-family:Cinzel,Georgia,serif;font-weight:800;font-size:clamp(22px,3.2vw,36px);margin:10px 0 10px;line-height:1.15}\
.ej-text{opacity:.88;line-height:1.6;font-size:15px;margin:0}\
.ej-stat{margin-top:16px;display:flex;align-items:baseline;gap:12px}\
.ej-num{font-family:Cinzel,Georgia,serif;font-weight:800;font-size:clamp(34px,4.4vw,52px);color:#f6d365;text-shadow:0 0 22px rgba(246,211,101,.45)}\
.ej-lab{font-size:12px;letter-spacing:.16em;text-transform:uppercase;opacity:.85}\
.ej-cta{display:inline-block;margin-top:16px;padding:12px 24px;border-radius:999px;background:linear-gradient(135deg,#3ddc97,#f6d365);color:#06281c!important;font-weight:700;text-decoration:none;box-shadow:0 0 26px rgba(61,220,151,.45)}\
.ej-rail{position:absolute;right:14px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:12px;pointer-events:none}\
.ej-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.25);transition:all .4s}\
.ej-dot.on{background:#f6d365;box-shadow:0 0 14px #f6d365;transform:scale(1.5)}\
.ej-hint{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:#bfffdc;text-shadow:0 2px 8px #000;transition:opacity .5s;pointer-events:none}\
.ej-hint span{display:block;margin-top:8px;font-size:20px;animation:ejBob 1.6s ease-in-out infinite}\
@keyframes ejBob{50%{transform:translateY(8px)}}\
@media(max-width:700px){.ej-card{left:12px!important;right:12px!important;top:auto;bottom:64px;max-width:none;--base:0%;padding:18px 20px}.ej-text{font-size:14px}.ej-rail{right:8px}}\
@media(prefers-reduced-motion:reduce){.eco-reveal{opacity:1;transform:none;transition:none}body.eco-hero-in #hero>*{animation:none}.ei-rays{animation:none}}\
';
    var st = el('style'); st.id = 'eco3d-css'; st.textContent = css; document.head.appendChild(st);
  }

  /* ============================================================ 3D BUILDING BLOCKS */
  function buildTree(THREE, shared, mobile) {
    var rand = mulberry32(11);
    var SIDES = 6, MAXD = 4, SEGS = 3;
    var STAGES = (MAXD + 1) * SEGS;           // 15 sequential growth stages
    var WOOD_END = 0.72;                      // wood is fully grown at growth = 0.72
    var UNIT = WOOD_END / STAGES;

    var pos = [], nor = [], st = [], bi = [], du = [], idx = [];
    var tips = [];
    var V = THREE.Vector3;

    function addSeg(p0, p1, r0, r1, stage) {
      var ax = new V().subVectors(p1, p0).normalize();
      var ref = Math.abs(ax.y) > 0.9 ? new V(1, 0, 0) : new V(0, 1, 0);
      var u = new V().crossVectors(ax, ref).normalize();
      var v = new V().crossVectors(ax, u).normalize();
      var base = pos.length / 3;
      for (var ring = 0; ring < 2; ring++) {
        var p = ring ? p1 : p0, r = ring ? r1 : r0;
        for (var s = 0; s < SIDES; s++) {
          var a = s / SIDES * Math.PI * 2, cx = Math.cos(a), sy = Math.sin(a);
          var nx = u.x * cx + v.x * sy, ny = u.y * cx + v.y * sy, nz = u.z * cx + v.z * sy;
          pos.push(p.x + nx * r, p.y + ny * r, p.z + nz * r);
          nor.push(nx, ny, nz);
          st.push(p0.x, p0.y, p0.z);
          bi.push(stage * UNIT); du.push(UNIT);
        }
      }
      for (var k = 0; k < SIDES; k++) {
        var a0 = base + k, b0 = base + (k + 1) % SIDES, c0 = base + SIDES + k, d0 = base + SIDES + (k + 1) % SIDES;
        idx.push(a0, c0, b0, b0, c0, d0);
      }
    }

    function spawn(p, d, len, r, depth, stage, count) {
      var ref = Math.abs(d.y) > 0.9 ? new V(1, 0, 0) : new V(0, 1, 0);
      var u = new V().crossVectors(d, ref).normalize();
      var v = new V().crossVectors(d, u).normalize();
      for (var i = 0; i < count; i++) {
        var az = rand() * 6.2832 + i * (6.2832 / count);
        var an = 0.45 + rand() * 0.55;
        var w = u.clone().multiplyScalar(Math.cos(az)).add(v.clone().multiplyScalar(Math.sin(az)));
        var cd = d.clone().multiplyScalar(Math.cos(an)).add(w.multiplyScalar(Math.sin(an)));
        cd.y += 0.12; cd.normalize();
        branch(p, cd, len * (0.70 + rand() * 0.08), r * 0.62, depth + 1, stage);
      }
    }

    function branch(p, dir, len, r, depth, stage0) {
      var cur = p.clone(), d = dir.clone(), segLen = len / SEGS;
      for (var k = 0; k < SEGS; k++) {
        d.x += (rand() - 0.5) * 0.35; d.z += (rand() - 0.5) * 0.35;
        d.y += depth === 0 ? 0.12 : 0.07;
        d.normalize();
        var next = cur.clone().addScaledVector(d, segLen);
        var rr0 = r * (1 - k / SEGS * 0.35), rr1 = r * (1 - (k + 1) / SEGS * 0.35);
        addSeg(cur, next, rr0, rr1, stage0 + k);
        cur = next;
        if (depth < MAXD) {
          if (k === 1) spawn(cur, d, len, r, depth, stage0 + k + 1, 1);
          if (k === 2) spawn(cur, d, len, r, depth, stage0 + k + 1, depth === 0 ? 3 : (rand() < 0.5 ? 2 : 3));
        }
      }
      if (depth >= MAXD - 1) tips.push({ p: cur.clone(), depth: depth });
    }

    branch(new V(0, 0, 0), new V(0, 1, 0), 3.2, 0.34, 0, 0);

    var maxY = 1;
    tips.forEach(function (t) { if (t.p.y > maxY) maxY = t.p.y; });
    shared.uHeight.value = maxY + 1.2;

    /* ---- wood ---- */
    var wg = new THREE.BufferGeometry();
    wg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    wg.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    wg.setAttribute('aStart', new THREE.Float32BufferAttribute(st, 3));
    wg.setAttribute('aBirth', new THREE.Float32BufferAttribute(bi, 1));
    wg.setAttribute('aDur', new THREE.Float32BufferAttribute(du, 1));
    wg.setIndex(idx);
    var wood = new THREE.Mesh(wg, new THREE.ShaderMaterial({
      uniforms: shared, side: THREE.DoubleSide,
      vertexShader: [
        'attribute vec3 aStart; attribute float aBirth; attribute float aDur;',
        'uniform float uGrowth; uniform float uTime; uniform float uWind; uniform float uHeight;',
        'varying vec3 vN; varying float vY;',
        'void main(){',
        '  float g = clamp((uGrowth - aBirth) / aDur, 0.0, 1.0);',
        '  vec3 p = aStart + (position - aStart) * g;',
        '  p.x += sin(uTime*0.8 + p.y*0.6) * 0.03 * uWind * (p.y/uHeight);',
        '  p.z += cos(uTime*0.7 + p.y*0.5) * 0.03 * uWind * (p.y/uHeight);',
        '  vN = normalize(normalMatrix * normal);',
        '  vY = p.y / uHeight;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float uGlow;',
        'varying vec3 vN; varying float vY;',
        'void main(){',
        '  vec3 n = normalize(vN);',
        '  vec3 L = normalize(vec3(-0.35, 0.65, 0.7));',
        '  float d = max(dot(n, L), 0.0);',
        '  vec3 bark = mix(vec3(0.20,0.12,0.07), vec3(0.40,0.28,0.17), clamp(vY,0.0,1.0));',
        '  vec3 col = bark * (0.35 + 0.85 * d);',
        '  float rim = pow(1.0 - abs(n.z), 2.0);',
        '  col += vec3(0.10,0.90,0.70) * rim * uGlow * 0.55;',
        '  col += vec3(0.90,0.70,0.30) * rim * 0.08;',
        '  gl_FragColor = vec4(col, 1.0);',
        '}'
      ].join('\n')
    }));
    wood.frustumCulled = false;

    /* ---- leaves (instanced) ---- */
    var off = [], scl = [], rot = [], birth = [], col = [], alt = [];
    var palette = [[0.16, 0.62, 0.30], [0.25, 0.72, 0.35], [0.45, 0.80, 0.30], [0.10, 0.50, 0.38]];
    var perTip4 = mobile ? 7 : 12, perTip3 = mobile ? 2 : 4;
    tips.forEach(function (t) {
      var n = t.depth >= MAXD ? perTip4 : perTip3, R = t.depth >= MAXD ? 0.95 : 1.15;
      for (var i = 0; i < n; i++) {
        var th = rand() * 6.2832, ph = Math.acos(2 * rand() - 1), rr = Math.cbrt(rand()) * R;
        off.push(t.p.x + rr * Math.sin(ph) * Math.cos(th), t.p.y + rr * Math.cos(ph) * 0.8, t.p.z + rr * Math.sin(ph) * Math.sin(th));
        scl.push(0.45 + rand() * 0.4);
        rot.push(rand() * 6.2832, rand() * 6.2832, rand() * 6.2832);
        birth.push(0.62 + rand() * 0.26);
        var pc = palette[Math.floor(rand() * palette.length)], j = 0.88 + rand() * 0.24;
        col.push(pc[0] * j, pc[1] * j, pc[2] * j);
        alt.push(rand());
      }
    });
    var lg = new THREE.InstancedBufferGeometry();
    lg.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, -0.5, 0.5, 0, 0.5, 0.5, 0, 0, 1.25, 0], 3));
    lg.setIndex([0, 2, 1, 1, 2, 3]);
    lg.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(off), 3));
    lg.setAttribute('aScale', new THREE.InstancedBufferAttribute(new Float32Array(scl), 1));
    lg.setAttribute('aRot', new THREE.InstancedBufferAttribute(new Float32Array(rot), 3));
    lg.setAttribute('aBirth', new THREE.InstancedBufferAttribute(new Float32Array(birth), 1));
    lg.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(col), 3));
    lg.setAttribute('aAlt', new THREE.InstancedBufferAttribute(new Float32Array(alt), 1));
    lg.instanceCount = scl.length;
    var leaves = new THREE.Mesh(lg, new THREE.ShaderMaterial({
      uniforms: shared, side: THREE.DoubleSide,
      vertexShader: [
        'attribute vec3 aOffset; attribute float aScale; attribute vec3 aRot; attribute float aBirth; attribute vec3 aColor; attribute float aAlt;',
        'uniform float uGrowth; uniform float uTime; uniform float uWind; uniform float uHeight;',
        'uniform float uBloom; uniform float uGold; uniform float uGlow;',
        'varying vec3 vColor; varying float vShade; varying float vEdge;',
        'mat3 rotXYZ(vec3 a){',
        '  float cx=cos(a.x), sx=sin(a.x), cy=cos(a.y), sy=sin(a.y), cz=cos(a.z), sz=sin(a.z);',
        '  mat3 mx = mat3(1.0,0.0,0.0, 0.0,cx,sx, 0.0,-sx,cx);',
        '  mat3 my = mat3(cy,0.0,-sy, 0.0,1.0,0.0, sy,0.0,cy);',
        '  mat3 mz = mat3(cz,sz,0.0, -sz,cz,0.0, 0.0,0.0,1.0);',
        '  return mz * my * mx;',
        '}',
        'void main(){',
        '  float g = clamp((uGrowth - aBirth) / 0.12, 0.0, 1.0);',
        '  g = g*g*(3.0 - 2.0*g);',
        '  float pop = g * (1.0 + 0.3 * sin(g * 3.14159));',
        '  float sway = sin(uTime*1.4 + aOffset.x*1.7 + aOffset.z*1.3) * 0.35 * uWind;',
        '  vec3 ang = aRot + vec3(sway*0.5, sway, sway*0.6);',
        '  vec3 world = aOffset + rotXYZ(ang) * (position * aScale * pop);',
        '  world.x += sin(uTime*0.8 + world.y*0.5) * 0.05 * uWind * (world.y/uHeight);',
        '  vec3 pink = vec3(1.0,0.62,0.78) * (0.8 + 0.4*aAlt);',
        '  vec3 gold = vec3(1.0,0.76,0.24) * (0.8 + 0.4*aAlt);',
        '  vec3 c = mix(aColor, pink, uBloom * step(aAlt, 0.65));',
        '  float tg = clamp(uGold*1.5 - aAlt*0.5, 0.0, 1.0);',
        '  c = mix(c, gold, tg);',
        '  c += vec3(0.05,0.95,0.75) * uGlow * 0.35 * (0.5 + aAlt);',
        '  vShade = clamp(0.5 + 0.7 * world.y / uHeight, 0.0, 1.3);',
        '  vColor = c;',
        '  vEdge = abs(position.x) * 1.8;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float uGlow;',
        'varying vec3 vColor; varying float vShade; varying float vEdge;',
        'void main(){',
        '  vec3 c = vColor * vShade * (1.0 - 0.28 * vEdge);',
        '  c = mix(c, vColor, uGlow * 0.5);',
        '  gl_FragColor = vec4(c, 1.0);',
        '}'
      ].join('\n')
    }));
    leaves.frustumCulled = false;

    var group = new THREE.Group();
    group.add(wood); group.add(leaves);
    return { group: group };
  }

  function createWorld(THREE, canvas, opt) {
    var mobile = !!opt.mobile;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: !mobile, alpha: false, powerPreference: 'high-performance' });
    var pr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    renderer.setPixelRatio(pr);

    var scene = new THREE.Scene();
    var bg = new THREE.Color(opt.bg || 0x04120d);
    scene.background = bg;
    scene.fog = new THREE.FogExp2(bg.clone(), 0.028);
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);

    var shared = {
      uGrowth: { value: 0 }, uTime: { value: 0 }, uWind: { value: 1 }, uHeight: { value: 8 },
      uBloom: { value: 0 }, uGold: { value: 0 }, uGlow: { value: 0 }
    };

    var tree = buildTree(THREE, shared, mobile);
    scene.add(tree.group);

    /* ground */
    var ground = new THREE.Mesh(
      new THREE.CircleGeometry(20, 64),
      new THREE.ShaderMaterial({
        transparent: true, depthWrite: false,
        uniforms: { uGrowth: shared.uGrowth, uGlow: shared.uGlow },
        vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: [
          'uniform float uGrowth; uniform float uGlow; varying vec2 vP;',
          'void main(){',
          '  float r = length(vP);',
          '  vec3 base = vec3(0.02,0.10,0.07);',
          '  float glow = exp(-r*0.28) * (0.25 + 0.75*uGrowth);',
          '  vec3 col = base + vec3(0.08,0.55,0.30) * glow * 0.8 + vec3(0.0,0.25,0.2) * uGlow * exp(-r*0.18);',
          '  float a = smoothstep(18.0, 5.0, r) * 0.95;',
          '  gl_FragColor = vec4(col, a);',
          '}'
        ].join('\n')
      })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    /* distant dark forest silhouettes */
    var rnd = mulberry32(5), silMat = new THREE.MeshBasicMaterial({ color: 0x061c15 }), sil = new THREE.Group();
    for (var i = 0; i < (mobile ? 18 : 30); i++) {
      var a = rnd() * 6.2832, r = 17 + rnd() * 20, h = 6 + rnd() * 10;
      var cone = new THREE.Mesh(new THREE.ConeGeometry(1.6 + rnd() * 1.2, h, 7), silMat);
      cone.position.set(Math.cos(a) * r, h / 2 - 0.2, Math.sin(a) * r);
      sil.add(cone);
    }
    scene.add(sil);

    /* fireflies */
    var fN = mobile ? 70 : 150, fPos = new Float32Array(fN * 3), fPh = new Float32Array(fN), fSz = new Float32Array(fN);
    for (var f = 0; f < fN; f++) {
      var fa = rnd() * 6.2832, fr = 2.5 + rnd() * 10;
      fPos[f * 3] = Math.cos(fa) * fr; fPos[f * 3 + 1] = 0.4 + rnd() * 9; fPos[f * 3 + 2] = Math.sin(fa) * fr;
      fPh[f] = rnd(); fSz[f] = 0.6 + rnd() * 0.9;
    }
    var fg = new THREE.BufferGeometry();
    fg.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
    fg.setAttribute('aPhase', new THREE.BufferAttribute(fPh, 1));
    fg.setAttribute('aSize', new THREE.BufferAttribute(fSz, 1));
    var fU = { uTime: shared.uTime, uPix: { value: pr }, uIntensity: { value: 0.6 } };
    var fireflies = new THREE.Points(fg, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: fU,
      vertexShader: [
        'attribute float aPhase; attribute float aSize;',
        'uniform float uTime; uniform float uPix; uniform float uIntensity; varying float vA;',
        'void main(){',
        '  vec3 p = position;',
        '  p.x += sin(uTime*0.4 + aPhase*6.28) * 0.8;',
        '  p.y += sin(uTime*0.55 + aPhase*12.0) * 0.5;',
        '  p.z += cos(uTime*0.35 + aPhase*9.0) * 0.8;',
        '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
        '  gl_PointSize = aSize * uPix * (34.0 / -mv.z);',
        '  gl_Position = projectionMatrix * mv;',
        '  vA = (0.5 + 0.5*sin(uTime*2.0 + aPhase*40.0)) * uIntensity;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying float vA;',
        'void main(){',
        '  float d = length(gl_PointCoord - 0.5);',
        '  float a = smoothstep(0.5, 0.0, d);',
        '  gl_FragColor = vec4(vec3(1.0,0.92,0.45), a*a*vA);',
        '}'
      ].join('\n')
    }));
    fireflies.frustumCulled = false;
    scene.add(fireflies);

    /* falling golden leaves (used in the journey's last chapter) */
    var lN = mobile ? 80 : 180, lPos = new Float32Array(lN * 3), lPh = new Float32Array(lN), lSz = new Float32Array(lN);
    for (var q = 0; q < lN; q++) {
      var qa = rnd() * 6.2832, qr = rnd() * 9;
      lPos[q * 3] = Math.cos(qa) * qr; lPos[q * 3 + 1] = 0; lPos[q * 3 + 2] = Math.sin(qa) * qr;
      lPh[q] = rnd(); lSz[q] = 0.7 + rnd() * 0.8;
    }
    var lgeo = new THREE.BufferGeometry();
    lgeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
    lgeo.setAttribute('aPhase', new THREE.BufferAttribute(lPh, 1));
    lgeo.setAttribute('aSize', new THREE.BufferAttribute(lSz, 1));
    var lU = { uTime: shared.uTime, uPix: { value: pr }, uFall: { value: 0 } };
    var falling = new THREE.Points(lgeo, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, uniforms: lU,
      vertexShader: [
        'attribute float aPhase; attribute float aSize;',
        'uniform float uTime; uniform float uPix; uniform float uFall; varying float vA; varying float vH;',
        'void main(){',
        '  float cyc = mod(uTime * 0.12 * (0.6 + aPhase) + aPhase * 10.0, 1.0);',
        '  vec3 p = position;',
        '  p.y = 12.0 * (1.0 - cyc);',
        '  p.x += sin(uTime*0.9 + aPhase*20.0 + cyc*6.0) * 1.2;',
        '  p.z += cos(uTime*0.7 + aPhase*14.0 + cyc*5.0) * 1.2;',
        '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
        '  gl_PointSize = aSize * uPix * (46.0 / -mv.z);',
        '  gl_Position = projectionMatrix * mv;',
        '  vA = uFall * smoothstep(0.0, 0.08, cyc) * (1.0 - smoothstep(0.92, 1.0, cyc));',
        '  vH = aPhase;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying float vA; varying float vH;',
        'void main(){',
        '  vec2 c = gl_PointCoord - 0.5;',
        '  float d = length(vec2(c.x * 1.5, c.y));',
        '  float a = smoothstep(0.5, 0.22, d);',
        '  vec3 col = mix(vec3(1.0,0.78,0.25), vec3(1.0,0.45,0.15), vH);',
        '  gl_FragColor = vec4(col, a * vA);',
        '}'
      ].join('\n')
    }));
    falling.frustumCulled = false;
    scene.add(falling);

    /* seed orb + ripple (intro only) */
    var og = new THREE.BufferGeometry();
    og.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
    var oU = { uTime: shared.uTime, uPix: { value: pr }, uA: { value: 0 }, uPos: { value: new THREE.Vector3(0, 2.8, 0) }, uSize: { value: 90 } };
    var orb = new THREE.Points(og, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: oU,
      vertexShader: [
        'uniform float uPix; uniform vec3 uPos; uniform float uSize;',
        'void main(){',
        '  vec4 mv = modelViewMatrix * vec4(position + uPos, 1.0);',
        '  gl_PointSize = uSize * uPix * (10.0 / -mv.z);',
        '  gl_Position = projectionMatrix * mv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float uA;',
        'void main(){',
        '  float d = length(gl_PointCoord - 0.5) * 2.0;',
        '  float halo = pow(clamp(1.0 - d, 0.0, 1.0), 2.2);',
        '  float core = smoothstep(0.22, 0.0, d);',
        '  vec3 col = vec3(0.35,1.0,0.7) * halo + vec3(1.0,0.97,0.8) * core;',
        '  gl_FragColor = vec4(col, (halo*0.9 + core) * uA);',
        '}'
      ].join('\n')
    }));
    orb.frustumCulled = false;
    scene.add(orb);

    var ringMat = new THREE.MeshBasicMaterial({ color: 0x7dffc0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
    var ring = new THREE.Mesh(new THREE.RingGeometry(0.92, 1.0, 64), ringMat);
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.03; ring.scale.set(0.01, 0.01, 0.01);
    scene.add(ring);

    var world = {
      renderer: renderer, scene: scene, camera: camera, shared: shared,
      fireflies: fU, falling: lU, orb: oU, ring: ring, bg: bg, fit: 1, px: 0, py: 0,
      resize: function (w, h) {
        renderer.setSize(w, h, false);
        var asp = w / Math.max(1, h);
        camera.aspect = asp;
        camera.fov = asp < 1 ? 55 : 45;
        world.fit = asp < 1 ? Math.min(1.75, 1 + (1 - asp) * 1.4) : 1;
        camera.updateProjectionMatrix();
      },
      setCamera: function (ang, rad, hei, look) {
        camera.position.set(Math.sin(ang) * rad * world.fit + world.px * 0.7, hei + world.py * 0.35, Math.cos(ang) * rad * world.fit);
        camera.lookAt(0, look, 0);
      },
      setBackground: function (c) { bg.copy(c); scene.fog.color.copy(c); },
      render: function (time) { shared.uTime.value = time; renderer.render(scene, camera); },
      dispose: function () {
        scene.traverse(function (o) {
          if (o.geometry) o.geometry.dispose();
          if (o.material) { if (Array.isArray(o.material)) o.material.forEach(function (m) { m.dispose(); }); else o.material.dispose(); }
        });
        renderer.dispose();
        try { renderer.forceContextLoss(); } catch (e) { /* ignore */ }
      }
    };
    return world;
  }

  /* ============================================================== INTRO (3D) */
  function buildIntroDOM() {
    var ov = el('div', 'ei');
    ov.id = 'eco-intro';
    ov.innerHTML =
      '<canvas class="ei-canvas"></canvas>' +
      '<div class="ei-glow"></div><div class="ei-rays"></div><div class="ei-vig"></div>' +
      '<div class="ei-fbwrap"><svg class="ei-fb-tree" viewBox="0 0 200 220" aria-hidden="true">' +
      '<path d="M100 215 C100 170 96 150 100 120 M100 150 C80 130 62 120 50 100 M100 140 C122 122 140 112 154 92 M100 120 C92 100 90 80 96 60" stroke="#8a5a34" stroke-width="7" stroke-linecap="round" fill="none"/>' +
      '<g fill="#3ddc97" opacity=".92"><circle cx="100" cy="70" r="46"/><circle cx="56" cy="100" r="30"/><circle cx="148" cy="96" r="32"/></g></svg></div>' +
      '<div class="ei-top"><div class="ei-sati">' + letters(C.collegeShort, 0, 0.14) + '</div>' +
      '<div class="ei-name">' + letters(C.collegeName, 0.5, 0.035) + '</div></div>' +
      '<div class="ei-bottom">' +
      '<div class="ei-presents">' + esc(C.presents) + '</div>' +
      '<div class="ei-fest">' + letters(C.festival, 0.15, 0.07) + '</div>' +
      '<div class="ei-tag">' + esc(C.tagline) + '</div>' +
      '<button class="ei-btn" type="button">' + esc(C.enterText) + ' \uD83C\uDF3F</button></div>' +
      '<div class="ei-flash"></div>' +
      '<button class="ei-skip" type="button">' + esc(C.skipText) + ' \u203A</button>' +
      '<div class="ei-loading">' + esc(C.loadingText) + '</div>';
    document.body.appendChild(ov);
    return ov;
  }

  function playIntro(THREE, ov) {
    return new Promise(function (resolve, reject) {
      var canvas = ov.querySelector('.ei-canvas');
      var world;
      try { world = createWorld(THREE, canvas, { mobile: MOBILE, bg: 0x03100c }); }
      catch (e) { reject(e); return; }
      ov.classList.add('ready');

      var flashEl = ov.querySelector('.ei-flash');
      var btn = ov.querySelector('.ei-btn');
      var skipBtn = ov.querySelector('.ei-skip');
      var state = 'intro', finished = false, raf = 0, autoTimer = 0, tEnter = 0, btnShown = false;
      var last = { ang: 0, rad: 13, hei: 4.4, look: 4 };
      var start = performance.now();
      var ptr = { x: 0, y: 0, sx: 0, sy: 0 };

      function size() { world.resize(ov.clientWidth || window.innerWidth, ov.clientHeight || window.innerHeight); }
      size();
      window.addEventListener('resize', size);
      function onMove(e) { ptr.x = (e.clientX / window.innerWidth - 0.5) * 2; ptr.y = (e.clientY / window.innerHeight - 0.5) * 2; }
      ov.addEventListener('pointermove', onMove);
      function onKey(e) { if (e.key === 'Escape') finish(); else if ((e.key === 'Enter' || e.key === ' ') && btnShown) { e.preventDefault(); enter(); } }
      window.addEventListener('keydown', onKey);

      function enter() {
        if (state !== 'intro' || finished) return;
        if (prefersReduced) { finish(); return; }
        state = 'enter'; tEnter = performance.now();
        clearTimeout(autoTimer);
        ov.classList.add('entering');
      }
      function finish() {
        if (finished) return;
        finished = true;
        cancelAnimationFrame(raf);
        clearTimeout(autoTimer);
        window.removeEventListener('resize', size);
        window.removeEventListener('keydown', onKey);
        ov.removeEventListener('pointermove', onMove);
        unlockScroll();
        document.body.classList.add('eco-hero-in');
        ov.classList.add('out');
        setTimeout(function () { document.body.classList.remove('eco-hero-in'); }, 2200);
        setTimeout(function () {
          try { world.dispose(); } catch (e) { /* ignore */ }
          if (ov.parentNode) ov.parentNode.removeChild(ov);
          window.dispatchEvent(new Event('ecofest:intro-done'));
          resolve();
        }, 1100);
      }
      btn.addEventListener('click', enter);
      skipBtn.addEventListener('click', finish);

      function drawFrame(t, now) {
        var u = clamp((t - 1.0) / 5.0, 0, 1);
        var growth = state === 'intro' ? smooth(u) : 1;
        world.shared.uGrowth.value = growth;
        ov.style.setProperty('--g', growth.toFixed(3));

        // text / button timeline
        if (t > 4.4) ov.classList.add('show-name');
        if (t > 5.8) ov.classList.add('show-title');
        if (t > 6.8 && !btnShown) {
          btnShown = true; ov.classList.add('show-btn');
          if (C.autoEnterAfter > 0 && !prefersReduced) autoTimer = setTimeout(enter, C.autoEnterAfter * 1000);
        }

        // seed orb falling, then fading as the tree sprouts
        var appear = smooth(t / 0.7);
        var fall = clamp(t / 1.1, 0, 1);
        world.orb.uA.value = appear * (1 - smooth(growth / 0.14));
        world.orb.uPos.value.set(0, lerp(2.8, 0.25, fall * fall), 0);
        world.orb.uSize.value = 90 + Math.sin(t * 6) * 12;
        var rp = clamp((t - 1.05) / 1.5, 0, 1);
        world.ring.scale.setScalar(0.2 + rp * 8);
        world.ring.material.opacity = rp > 0 ? (1 - rp) * 0.8 : 0;

        // camera
        var ang, rad, hei, look;
        if (state === 'intro') {
          var e = smooth(clamp((t - 0.6) / 6.0, 0, 1));
          rad = lerp(6.2, 13.2, e); hei = lerp(1.3, 4.4, e); look = lerp(1.0, 4.0, e);
          ang = lerp(-0.7, 0.0, e) + Math.sin(t * 0.3) * 0.1 * e;
          last.ang = ang; last.rad = rad; last.hei = hei; last.look = look;
          flashEl.style.opacity = 0;
        } else {
          var k = clamp((now - tEnter) / 1900, 0, 1), kk = k * k;
          rad = lerp(last.rad, 1.2, kk); hei = lerp(last.hei, 5.6, kk); look = lerp(last.look, 5.8, kk);
          ang = last.ang + kk * 0.6;
          flashEl.style.opacity = smooth((k - 0.55) / 0.4).toFixed(3);
          if (k >= 1) { world.setCamera(ang, rad, hei, look); world.render(t); finish(); return; }
        }
        ptr.sx += (ptr.x - ptr.sx) * 0.06; ptr.sy += (ptr.y - ptr.sy) * 0.06;
        world.px = ptr.sx; world.py = -ptr.sy;
        ov.style.setProperty('--mx', ptr.sx.toFixed(3));
        ov.style.setProperty('--my', ptr.sy.toFixed(3));
        world.setCamera(ang, rad, hei, look);
        world.render(t);
      }

      if (prefersReduced) {
        ov.classList.add('show-name', 'show-title', 'show-btn', 'static');
        btnShown = true; state = 'intro';
        start = performance.now() - 99000;
        var rr = function () { drawFrame(99, performance.now()); };
        rr(); window.addEventListener('resize', rr);
        return;
      }

      (function loop(now) {
        if (finished) return;
        raf = requestAnimationFrame(loop);
        drawFrame(Math.max(0, (now - start) / 1000), now);
      })(performance.now());
    });
  }

  function fallbackIntro(ov) {
    return new Promise(function (resolve) {
      ov.classList.add('ready', 'fallback', 'show-name', 'show-title', 'show-btn');
      var done = false;
      function finish() {
        if (done) return; done = true;
        unlockScroll();
        document.body.classList.add('eco-hero-in');
        ov.classList.add('out');
        setTimeout(function () { document.body.classList.remove('eco-hero-in'); }, 2200);
        setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); resolve(); }, 1000);
      }
      ov.querySelector('.ei-btn').addEventListener('click', finish);
      ov.querySelector('.ei-skip').addEventListener('click', finish);
      if (C.autoEnterAfter > 0) setTimeout(finish, (C.autoEnterAfter + 2) * 1000);
    });
  }

  /* ================================================================ JOURNEY (scroll) */
  function buildJourneyDOM() {
    var sec = el('section'); sec.id = 'eco-journey';
    var cards = C.chapters.map(function (c, i) {
      return '<div class="ej-card ' + c.side + '" data-i="' + i + '">' +
        '<div class="ej-chap">' + esc(c.label) + '</div>' +
        '<h3 class="ej-title">' + esc(c.title) + '</h3>' +
        '<p class="ej-text">' + esc(c.text) + '</p>' +
        '<div class="ej-stat"><span class="ej-num" data-v="' + c.stat.value + '" data-d="' + c.stat.decimals + '" data-p="' + esc(c.stat.prefix) + '" data-s="' + esc(c.stat.suffix) + '">' + esc(c.stat.prefix) + '0' + esc(c.stat.suffix) + '</span>' +
        '<span class="ej-lab">' + esc(c.stat.label) + '</span></div>' +
        (c.cta ? '<a class="ej-cta" href="' + esc(C.registrationHref) + '">' + esc(c.cta) + '</a>' : '') +
        '</div>';
    }).join('');
    var dots = C.chapters.map(function () { return '<div class="ej-dot"></div>'; }).join('');
    sec.innerHTML = '<div class="ej-sticky"><canvas class="ej-canvas"></canvas><div class="ej-vig"></div>' +
      '<div class="ej-top">' + esc(C.collegeShort) + ' \u00B7 ' + esc(C.festival) + '</div>' + cards +
      '<div class="ej-rail">' + dots + '</div>' +
      '<div class="ej-hint">Scroll to grow the forest<span>\u2193</span></div></div>';
    return sec;
  }

  function initJourney(THREE) {
    var sec = buildJourneyDOM();
    var anchor = document.querySelector(C.insertAfterSelector);
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(sec, anchor.nextSibling);
    else (document.querySelector('main') || document.body).insertBefore(sec, (document.querySelector('main') || document.body).firstChild);

    var sticky = sec.querySelector('.ej-sticky');
    var canvas = sec.querySelector('.ej-canvas');
    var world;
    try { world = createWorld(THREE, canvas, { mobile: MOBILE, bg: 0x0d3b2a }); }
    catch (e) { sec.parentNode.removeChild(sec); console.warn('EcoFest 3D journey disabled:', e); return; }

    function size() { world.resize(sticky.clientWidth || window.innerWidth, sticky.clientHeight || window.innerHeight); }
    size();
    if (window.ResizeObserver) new ResizeObserver(size).observe(sticky); else window.addEventListener('resize', size);
    window.addEventListener('pointermove', function (e) {
      world.px = (e.clientX / window.innerWidth - 0.5) * 2;
      world.py = -(e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    var cards = Array.prototype.slice.call(sec.querySelectorAll('.ej-card'));
    var nums = cards.map(function (c) { return c.querySelector('.ej-num'); });
    var dots = Array.prototype.slice.call(sec.querySelectorAll('.ej-dot'));
    var hint = sec.querySelector('.ej-hint');
    var n = cards.length;

    var dayC = new THREE.Color(0x0d3b2a), nightC = new THREE.Color(0x020a0d), warmC = new THREE.Color(0x2b1a08), tmp = new THREE.Color();
    var visible = false, raf = 0, ps = 0, lastT = performance.now();

    function fmt(v, d) { return d ? v.toFixed(d) : Math.round(v).toLocaleString('en-IN'); }

    function update(now) {
      var dt = Math.min(0.1, (now - lastT) / 1000); lastT = now;
      var r = sec.getBoundingClientRect();
      var total = Math.max(1, r.height - window.innerHeight);
      var p = clamp(-r.top / total, 0, 1);
      ps += (p - ps) * Math.min(1, dt * 6);
      if (Math.abs(p - ps) < 0.0004) ps = p;

      var growth = lerp(0.12, 1, smooth(ps / 0.3));
      var bloom = sm(0.24, 0.34, ps) * (1 - sm(0.5, 0.58, ps));
      var night = sm(0.5, 0.62, ps) * (1 - 0.6 * sm(0.78, 0.9, ps));
      var gold = sm(0.76, 0.9, ps);
      var sh = world.shared;
      sh.uGrowth.value = growth; sh.uBloom.value = bloom; sh.uGlow.value = night; sh.uGold.value = gold;
      world.fireflies.uIntensity.value = 0.45 + 0.9 * night + 0.4 * gold;
      world.falling.uFall.value = gold;
      tmp.copy(dayC).lerp(nightC, night).lerp(warmC, gold * 0.7);
      world.setBackground(tmp);

      var cam = sm(0, 0.4, ps);
      world.setCamera(lerp(-0.6, 1.2, ps), lerp(7.5, 14.5, cam) + sm(0.75, 1, ps) * 2.0, lerp(1.8, 5.0, cam), lerp(1.2, 4.2, cam));
      world.render(now / 1000);

      // chapters
      var best = 0, bestW = -1;
      for (var i = 0; i < n; i++) {
        var c = 0.125 + i * 0.25;
        var w = sm(c - 0.125, c - 0.06, ps);
        if (i < n - 1) w *= 1 - sm(c + 0.06, c + 0.125, ps);
        var dir = ps < c ? 1 : -1;
        cards[i].style.opacity = w.toFixed(3);
        cards[i].style.setProperty('--ty', ((1 - w) * 40 * dir).toFixed(1) + 'px');
        cards[i].style.pointerEvents = w > 0.6 ? 'auto' : 'none';
        var s = C.chapters[i].stat;
        var k = smooth((ps - (c - 0.11)) / 0.1);
        nums[i].textContent = s.prefix + fmt(s.value * k, s.decimals) + s.suffix;
        if (w > bestW) { bestW = w; best = i; }
      }
      for (var d = 0; d < dots.length; d++) dots[d].classList.toggle('on', d === best);
      hint.style.opacity = ps < 0.04 ? 1 : 0;
    }

    function tick(now) {
      if (!visible) { raf = 0; return; }
      raf = requestAnimationFrame(tick);
      update(now);
    }
    var io = new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible && !raf) { lastT = performance.now(); raf = requestAnimationFrame(tick); }
    }, { rootMargin: '200px 0px' });
    io.observe(sec);
    update(performance.now());
  }

  /* ============================================================ SITE-WIDE EXTRAS */
  function addProgressBar() {
    var b = el('div'); b.id = 'eco-bar'; document.body.appendChild(b);
    function upd() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      b.style.transform = 'scaleX(' + (h > 0 ? clamp(window.scrollY / h, 0, 1) : 0) + ')';
    }
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  function addLeaves() {
    if (prefersReduced) return;
    var cv = el('canvas'); cv.id = 'eco-leaves'; document.body.appendChild(cv);
    var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() { W = window.innerWidth; H = window.innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    resize(); window.addEventListener('resize', resize);
    function mk(init) {
      return { x: Math.random() * W, y: init ? Math.random() * H : -30, s: 7 + Math.random() * 9, vy: 22 + Math.random() * 30, vx: -8 + Math.random() * 16, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 1.4, ph: Math.random() * 6.28, gold: Math.random() > 0.78 };
    }
    var L = [], N = MOBILE ? 9 : 20;
    for (var i = 0; i < N; i++) L.push(mk(true));
    var last = performance.now();
    (function loop(now) {
      requestAnimationFrame(loop);
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < L.length; i++) {
        var l = L[i];
        l.y += l.vy * dt; l.x += (l.vx + Math.sin(now / 1000 * 0.9 + l.ph) * 24) * dt; l.rot += l.vr * dt;
        if (l.y > H + 30 || l.x < -40 || l.x > W + 40) { L[i] = l = mk(false); }
        ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.rot);
        ctx.beginPath(); ctx.moveTo(0, -l.s);
        ctx.quadraticCurveTo(l.s * 0.75, -l.s * 0.2, 0, l.s);
        ctx.quadraticCurveTo(-l.s * 0.75, -l.s * 0.2, 0, -l.s);
        ctx.fillStyle = l.gold ? 'rgba(246,200,90,.55)' : 'rgba(70,200,125,.5)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(0, -l.s); ctx.lineTo(0, l.s); ctx.stroke();
        ctx.restore();
      }
    })(performance.now());
  }

  function setupReveal() {
    if (prefersReduced || !window.IntersectionObserver) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target; io.unobserve(t);
        t.classList.add('eco-in');
        var clean = function () { t.classList.remove('eco-reveal', 'eco-in'); t.style.removeProperty('--ed'); };
        t.addEventListener('transitionend', function h(ev) { if (ev.propertyName === 'opacity') { t.removeEventListener('transitionend', h); clean(); } });
        setTimeout(clean, 2200);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('section').forEach(function (sec) {
      if (sec.id === 'hero' || sec.id === 'eco-journey') return;
      var kids = Array.prototype.slice.call(sec.children);
      if (kids.length === 1) kids = Array.prototype.slice.call(kids[0].children);
      kids.forEach(function (k, i) {
        if (/^(SCRIPT|STYLE|CANVAS)$/.test(k.tagName)) return;
        k.classList.add('eco-reveal'); k.style.setProperty('--ed', Math.min(i, 4) * 0.08 + 's');
        io.observe(k);
      });
    });
  }

  /* ========================================================================= MAIN */
  function main() {
    injectAssets();
    var forced = /[?&]intro=1/.test(location.search);
    var seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch (e) { /* private mode */ }
    var needIntro = forced || !(C.showOncePerSession && seen);

    var ov = null;
    if (needIntro) { ov = buildIntroDOM(); lockScroll(); window.scrollTo(0, 0); }
    addProgressBar();

    var threeP = import(C.threeUrl).then(function (m) { return m; }, function () { return null; });
    var introP = Promise.resolve();
    if (needIntro) {
      introP = threeP.then(function (THREE) {
        if (!THREE) return fallbackIntro(ov);
        return playIntro(THREE, ov).catch(function (err) {
          console.warn('EcoFest 3D intro failed, using fallback:', err);
          return fallbackIntro(ov);
        });
      }).then(function () { try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* ignore */ } });
    }
    introP.then(function () { return threeP; }).then(function (THREE) {
      addLeaves();
      setupReveal();
      if (THREE) { try { initJourney(THREE); } catch (e) { console.warn('EcoFest 3D journey failed:', e); } }
    });
  }

  window.EcoFest3D = { replayIntro: function () { try { sessionStorage.removeItem(SEEN_KEY); } catch (e) { /* ignore */ } location.reload(); } };

  if (document.body) main(); else document.addEventListener('DOMContentLoaded', main);
})();
