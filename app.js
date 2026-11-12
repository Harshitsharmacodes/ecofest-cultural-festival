/**
 * ==============================================================================
 * EcoFest 2026 - Enchanted Nature Application Logic
 * Pure Fundamentals: HTML5, CSS3, Modern Vanilla JavaScript (ES6+)
 * Powered by Three.js & GSAP ScrollTrigger for 3D Scroll Hero Experience
 * Hosted on GitHub Pages (No Build Tools Required)
 * ==============================================================================
 */

'use strict';

/* ==============================================================================
   0. CONFIGURATION OBJECT
   Easily customize college name, festival title, dates, colors, and timings
   ============================================================================== */
const ECOFEST_CONFIG = {
  // Replace with your actual college name (e.g., "Greenwood Institute of Technology")
  collegeName: "Greenwood University",
  festivalName: "ECOFEST 2026",
  tagline: "Where Culture Blooms in Harmony with Enchanted Nature",
  dates: "Nov 14 – 16, 2026",
  venue: "The Whispering Banyan Grove",
  colors: {
    emerald: 0x10b981,
    mint: 0x6ee7b7,
    cyan: 0x06b6d4,
    gold: 0xfbbf24,
    amber: 0xf59e0b,
    coral: 0xfb7185,
    deepForest: 0x06110a,
    bark: 0x14281d,
    moonlight: 0xa7f3d0
  },
  tree: {
    trunkHeight: 13,
    branchesCount: 14,
    foliageCount: 180,
    firefliesDesktop: 190,
    firefliesMobile: 65
  },
  timings: {
    introEnd: 0.25,
    growthEnd: 0.60,
    climaxEnd: 0.85
  }
};

/* ==============================================================================
   1. MASTER FESTIVAL EVENTS DATASET
   Includes exact Day, Date, Time Slot, and Assigned Campus Venue
   ============================================================================== */
const ECOFEST_EVENTS = [
  {
    id: 'EVT-01',
    title: 'Great Campus Seed Bomb Reforestation',
    category: 'Plantation',
    day: 'Day 1',
    dateStr: 'Nov 14, 2026',
    timeSlot: '10:00 AM – 12:30 PM',
    venue: 'Sunshine Grove & Nursery (Zone D)',
    venueClass: 'venue-canopy',
    seatsLeft: 42,
    status: 'Filling Fast',
    description: 'Hands-on guerrilla gardening drive. Roll 1,500 indigenous seed balls with clay and compost, then broadcast across campus hillsides.',
    icon: '🌱'
  },
  {
    id: 'EVT-03',
    title: 'Macro Flora & Dewdrop Photography Walk',
    category: 'Photography',
    day: 'Day 1',
    dateStr: 'Nov 14, 2026',
    timeSlot: '10:00 AM – 12:30 PM', // CONCURRENT WITH EVT-01 (Analytical Challenge)
    venue: 'Botanical Banyan Trail (Zone A)',
    venueClass: 'venue-banyan',
    seatsLeft: 18,
    status: 'Limited Seats',
    description: 'Capture nature at 1:1 magnification. Professional wildlife mentors guide attendees in capturing morning dew, spider silk, and moss spore capsules.',
    icon: '📷'
  },
  {
    id: 'EVT-02',
    title: 'Acoustic Canopy Symphony & Folk Recital',
    category: 'Music & Performance',
    day: 'Day 1',
    dateStr: 'Nov 14, 2026',
    timeSlot: '03:00 PM – 05:30 PM',
    venue: 'Emerald Amphitheatre (Zone B)',
    venueClass: 'venue-amphitheatre',
    seatsLeft: 120,
    status: 'Open Access',
    description: 'Unplugged acoustic instruments echoing through the trees. Wooden harps, bamboo flutes, and overtone singing powered entirely by solar batteries.',
    icon: '🎶'
  },
  {
    id: 'EVT-04',
    title: 'Living Clay & Terracotta Sculpture Contest',
    category: 'Art & Craft',
    day: 'Day 2',
    dateStr: 'Nov 15, 2026',
    timeSlot: '10:00 AM – 01:00 PM',
    venue: 'Moss & Bio-Mineral Lab (Zone C)',
    venueClass: 'venue-lab',
    seatsLeft: 25,
    status: 'Registration Open',
    description: 'Shape organic, unbaked river clay infused with living moss spores. Sculptures will be placed in the botanical gardens to naturally bio-integrate.',
    icon: '🎨'
  },
  {
    id: 'EVT-05',
    title: 'Adopt-a-Heritage Sapling Geotag Drive',
    category: 'Plantation',
    day: 'Day 2',
    dateStr: 'Nov 15, 2026',
    timeSlot: '10:00 AM – 01:00 PM', // CONCURRENT WITH EVT-04 (Analytical Challenge)
    venue: 'The Whispering Banyan Grove (Zone A)',
    venueClass: 'venue-banyan',
    seatsLeft: 30,
    status: 'Filling Fast',
    description: 'Plant rare native saplings, embed permanent RFID/GPS tags, and commit to digital health monitoring through Greenwood University\'s open ecology portal.',
    icon: '🌿'
  },
  {
    id: 'EVT-06',
    title: 'Whispering Banyan Drum & Flute Circle',
    category: 'Music & Performance',
    day: 'Day 2',
    dateStr: 'Nov 15, 2026',
    timeSlot: '02:30 PM – 05:00 PM',
    venue: 'Emerald Amphitheatre (Zone B)',
    venueClass: 'venue-amphitheatre',
    seatsLeft: 60,
    status: 'Open Access',
    description: 'A participatory sonic gathering where visitors are given wooden cajons, bamboo shakers, and clay flutes to compose an organic forest trance.',
    icon: '🥁'
  },
  {
    id: 'EVT-07',
    title: 'Recycled Botanical Scrap Sculpture',
    category: 'Art & Craft',
    day: 'Day 2',
    dateStr: 'Nov 15, 2026',
    timeSlot: '02:30 PM – 05:00 PM', // CONCURRENT WITH EVT-06 (Analytical Challenge)
    venue: 'Moss & Bio-Mineral Lab (Zone C)',
    venueClass: 'venue-lab',
    seatsLeft: 15,
    status: 'Limited Seats',
    description: 'Transform fallen branches, discarded bamboo scaffolding, and coconut husks into large-scale animal sculptures celebrating endangered woodland fauna.',
    icon: '🪴'
  },
  {
    id: 'EVT-08',
    title: 'Twilight Bioluminescence Photography Hunt',
    category: 'Photography',
    day: 'Day 2',
    dateStr: 'Nov 15, 2026',
    timeSlot: '06:00 PM – 08:30 PM',
    venue: 'The Whispering Banyan Grove (Zone A)',
    venueClass: 'venue-banyan',
    seatsLeft: 22,
    status: 'Filling Fast',
    description: 'Nighttime long-exposure photography walk exploring naturally glowing fungal strains, firefly meadows, and UV-reactive campus lichens.',
    icon: '✨'
  },
  {
    id: 'EVT-09',
    title: 'Biomimicry Innovation Pitch Challenge',
    category: 'Eco-Innovation',
    day: 'Day 3',
    dateStr: 'Nov 16, 2026',
    timeSlot: '11:00 AM – 01:30 PM',
    venue: 'Moss & Bio-Mineral Lab (Zone C)',
    venueClass: 'venue-lab',
    seatsLeft: 12,
    status: 'Final Slots',
    description: 'Student engineering and design teams present working prototypes that solve urban problems inspired by nature\'s mechanics.',
    icon: '💡'
  },
  {
    id: 'EVT-10',
    title: 'Micro-Forest Mycology & Soil Workshop',
    category: 'Plantation',
    day: 'Day 3',
    dateStr: 'Nov 16, 2026',
    timeSlot: '11:00 AM – 01:30 PM', // CONCURRENT WITH EVT-09 (Analytical Challenge)
    venue: 'Sunshine Grove & Nursery (Zone D)',
    venueClass: 'venue-canopy',
    seatsLeft: 35,
    status: 'Open Access',
    description: 'Learn the secret fungal internet. Inoculate compost piles with mycorrhizal spores to accelerate sapling root absorption by 400%.',
    icon: '🍄'
  },
  {
    id: 'EVT-11',
    title: 'Sun-Dyed Natural Pigment Tapestry',
    category: 'Art & Craft',
    day: 'Day 3',
    dateStr: 'Nov 16, 2026',
    timeSlot: '02:30 PM – 05:00 PM',
    venue: 'Moss & Bio-Mineral Lab (Zone C)',
    venueClass: 'venue-lab',
    seatsLeft: 20,
    status: 'Registration Open',
    description: 'Extract brilliant dyes from turmeric, indigo, beetroot, and pomegranate rinds to create an 80-foot collaborative silk tapestry for the campus library.',
    icon: '🎨'
  },
  {
    id: 'EVT-12',
    title: 'Starlight Acoustic Grand Finale & Awards',
    category: 'Music & Performance',
    day: 'Day 3',
    dateStr: 'Nov 16, 2026',
    timeSlot: '06:00 PM – 09:30 PM',
    venue: 'Emerald Amphitheatre (Zone B)',
    venueClass: 'venue-amphitheatre',
    seatsLeft: 200,
    status: 'Open Access',
    description: 'The monumental closing concert honoring green innovators, announcing photography winners, and celebrating the planting of 1,500 trees.',
    icon: '🌟'
  }
];

/* ==============================================================================
   2. SCROLL-DRIVEN 3D HERO EXPERIENCE (Three.js & GSAP ScrollTrigger)
   - 400vh Scroll-driven 3D Tree Growth Simulation
   - Procedural trunk, branches, leaves, blossoms, and swirling firefly vortex
   - Mouse & phone-tilt parallax
   - GPU-optimized: pauses rendering loop when scrolled out of view
   ============================================================================== */
class Scroll3DHero {
  constructor() {
    this.canvas = document.getElementById('threeHeroCanvas');
    this.fallback = document.getElementById('threeWebGlFallback');
    this.track = document.getElementById('hero');
    this.stages = {
      s1: document.getElementById('stage1Intro'),
      s2: document.getElementById('stage2Growth'),
      s3: document.getElementById('stage3Climax')
    };
    this.prompt = document.getElementById('scrollBeginPrompt');
    this.hudBar = document.getElementById('hudProgressFill');
    this.hudVal = document.getElementById('hudProgressVal');

    this.collegeTitle = document.getElementById('collegeSubTitle');
    if (this.collegeTitle && ECOFEST_CONFIG.collegeName) {
      this.collegeTitle.textContent = `${ECOFEST_CONFIG.collegeName} Presents`;
    }

    // Parallax tracking variables
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.isHeroVisible = true;
    this.rafId = null;

    // Branches & foliage storage for growth transforms
    this.branches = [];
    this.foliage = [];
    this.fireflies = [];

    this.init();
  }

  isWebGLAvailable() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  init() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!this.canvas || !window.THREE || !window.gsap || !this.isWebGLAvailable() || prefersReducedMotion) {
      if (this.fallback) this.fallback.classList.remove('hidden');
      if (this.canvas) this.canvas.style.display = 'none';
      return;
    }

    this.setupThreeScene();
    this.buildProceduralTree();
    this.buildFireflySwarm();
    this.setupScrollTrigger();
    this.setupParallaxListeners();
    this.setupVisibilityObserver();

    // Start 60fps render loop
    this.animate();
  }

  setupThreeScene() {
    // 1. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    // 2. Scene with natural mist
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(ECOFEST_CONFIG.colors.deepForest, 0.042);

    // 3. Camera
    this.camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 1.8, 7.5);

    // 4. Lights
    this.ambientLight = new THREE.AmbientLight(0x0f2d19, 1.6);
    this.scene.add(this.ambientLight);

    // Moonlight
    this.moonLight = new THREE.DirectionalLight(ECOFEST_CONFIG.colors.moonlight, 0.85);
    this.moonLight.position.set(6, 16, 8);
    this.scene.add(this.moonLight);

    // Glowing Seed PointLight (Initial glow)
    this.seedLight = new THREE.PointLight(ECOFEST_CONFIG.colors.gold, 2.6, 10);
    this.seedLight.position.set(0, 0.6, 0);
    this.scene.add(this.seedLight);

    // Canopy PointLight (Activates during Stage 3 Climax)
    this.canopyLight = new THREE.PointLight(ECOFEST_CONFIG.colors.emerald, 0.1, 26);
    this.canopyLight.position.set(0, 7.5, 0);
    this.scene.add(this.canopyLight);

    // Window resize handler
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  buildProceduralTree() {
    this.treeGroup = new THREE.Group();
    this.scene.add(this.treeGroup);

    // A. Sacred Glowing Seed (Stage 1 Core)
    const seedGeo = new THREE.SphereGeometry(0.38, 24, 24);
    const seedMat = new THREE.MeshStandardMaterial({
      color: ECOFEST_CONFIG.colors.gold,
      emissive: ECOFEST_CONFIG.colors.gold,
      emissiveIntensity: 0.95,
      roughness: 0.2
    });
    this.seedMesh = new THREE.Mesh(seedGeo, seedMat);
    this.seedMesh.position.set(0, 0.5, 0);
    this.treeGroup.add(this.seedMesh);

    // B. Procedural Trunk (Tapered Cylinder scaled from base)
    const trunkHeight = ECOFEST_CONFIG.tree.trunkHeight;
    const trunkGeo = new THREE.CylinderGeometry(0.35, 0.85, trunkHeight, 18, 12);
    trunkGeo.translate(0, trunkHeight / 2, 0);

    const trunkMat = new THREE.MeshStandardMaterial({
      color: ECOFEST_CONFIG.colors.bark,
      roughness: 0.88,
      metalness: 0.08
    });
    this.trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
    this.trunkMesh.scale.set(0.01, 0.001, 0.01);
    this.treeGroup.add(this.trunkMesh);

    // C. Procedural Branches (Sprouting in golden-ratio spiral)
    const branchesCount = ECOFEST_CONFIG.tree.branchesCount;
    const branchMat = new THREE.MeshStandardMaterial({
      color: ECOFEST_CONFIG.colors.bark,
      roughness: 0.85
    });

    for (let i = 0; i < branchesCount; i++) {
      const bHeight = 3.6 + (i % 3) * 0.7;
      const bGeo = new THREE.CylinderGeometry(0.08, 0.22, bHeight, 10);
      bGeo.translate(0, bHeight / 2, 0);

      const branchMesh = new THREE.Mesh(bGeo, branchMat);
      const branchAnchor = new THREE.Group();

      const yPos = 3.2 + i * 0.65;
      const angle = i * 2.39996;

      branchAnchor.position.set(0, yPos, 0);
      branchAnchor.rotation.y = angle;
      branchAnchor.rotation.z = THREE.MathUtils.degToRad(42 + (i % 4) * 5);

      branchMesh.scale.set(0.001, 0.001, 0.001);
      branchAnchor.add(branchMesh);
      this.treeGroup.add(branchAnchor);

      this.branches.push({
        mesh: branchMesh,
        anchor: branchAnchor,
        targetY: yPos,
        triggerProgress: 0.28 + (i / branchesCount) * 0.24
      });

      // D. Leaves and Bioluminescent Blossoms at branch tips
      const clusterCount = 12;
      for (let j = 0; j < clusterCount; j++) {
        const isBlossom = Math.random() > 0.65;
        let fGeo, fMat;

        if (isBlossom) {
          fGeo = new THREE.SphereGeometry(0.18 + Math.random() * 0.1, 8, 8);
          const colorChoice = Math.random() > 0.5 ? ECOFEST_CONFIG.colors.cyan : ECOFEST_CONFIG.colors.gold;
          fMat = new THREE.MeshStandardMaterial({
            color: colorChoice,
            emissive: colorChoice,
            emissiveIntensity: 0.8,
            roughness: 0.3
          });
        } else {
          fGeo = new THREE.IcosahedronGeometry(0.24 + Math.random() * 0.12, 0);
          fMat = new THREE.MeshStandardMaterial({
            color: Math.random() > 0.5 ? ECOFEST_CONFIG.colors.emerald : ECOFEST_CONFIG.colors.mint,
            emissive: ECOFEST_CONFIG.colors.emerald,
            emissiveIntensity: 0.35,
            roughness: 0.5
          });
        }

        const foliageMesh = new THREE.Mesh(fGeo, fMat);
        foliageMesh.position.set(
          (Math.random() - 0.5) * 1.4,
          bHeight + (Math.random() - 0.3) * 1.2,
          (Math.random() - 0.5) * 1.4
        );
        foliageMesh.scale.set(0, 0, 0);
        branchAnchor.add(foliageMesh);

        this.foliage.push({
          mesh: foliageMesh,
          maxScale: 0.85 + Math.random() * 0.4,
          triggerProgress: 0.38 + (i / branchesCount) * 0.22
        });
      }
    }
  }

  buildFireflySwarm() {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? ECOFEST_CONFIG.tree.firefliesMobile : ECOFEST_CONFIG.tree.firefliesDesktop;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const c1 = new THREE.Color(ECOFEST_CONFIG.colors.mint);
    const c2 = new THREE.Color(ECOFEST_CONFIG.colors.gold);
    const c3 = new THREE.Color(ECOFEST_CONFIG.colors.cyan);

    for (let i = 0; i < count; i++) {
      const radius = 2.5 + Math.random() * 6.5;
      const angle = Math.random() * Math.PI * 2;
      const y = Math.random() * 14;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      const chosenColor = Math.random() > 0.6 ? c1 : (Math.random() > 0.5 ? c2 : c3);
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;

      this.fireflies.push({
        radius,
        angle,
        baseY: y,
        speed: (0.2 + Math.random() * 0.4) * (Math.random() > 0.5 ? 1 : -1),
        yVel: (Math.random() - 0.5) * 0.015,
        phase: Math.random() * Math.PI * 2
      });
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: isMobile ? 0.38 : 0.48,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.fireflySwarm = new THREE.Points(geo, mat);
    this.scene.add(this.fireflySwarm);
  }

  setupScrollTrigger() {
    if (!window.ScrollTrigger) return;

    ScrollTrigger.create({
      trigger: this.track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        this.updateSceneProgress(self.progress);
      },
      onToggle: (self) => {
        this.isHeroVisible = self.isActive;
      }
    });
  }

  updateSceneProgress(p) {
    this.scrollProgress = p;

    // 1. Update Floating HUD
    if (this.hudBar) this.hudBar.style.width = `${Math.min(100, Math.round(p * 100))}%`;
    if (this.hudVal) this.hudVal.textContent = `${Math.min(100, Math.round(p * 100))}%`;

    // 2. Hide scroll prompt after initial scroll
    if (this.prompt) {
      if (p > 0.04) {
        this.prompt.classList.add('fade-out');
      } else {
        this.prompt.classList.remove('fade-out');
      }
    }

    // 3. Stage Overlay Opacities
    if (this.stages.s1) {
      if (p <= 0.23) {
        this.stages.s1.classList.add('active');
      } else {
        this.stages.s1.classList.remove('active');
      }
    }

    if (this.stages.s2) {
      if (p > 0.24 && p <= 0.58) {
        this.stages.s2.classList.add('active');
      } else {
        this.stages.s2.classList.remove('active');
      }
    }

    if (this.stages.s3) {
      if (p > 0.59 && p <= 0.86) {
        this.stages.s3.classList.add('active');
      } else {
        this.stages.s3.classList.remove('active');
      }
    }

    // 4. Procedural 3D Growth Transforms
    if (this.seedMesh) {
      const seedFade = Math.max(0, 1 - (p / 0.32));
      this.seedMesh.scale.setScalar(Math.max(0.01, seedFade));
      if (this.seedLight) {
        this.seedLight.intensity = seedFade * 2.6;
      }
    }

    // Trunk growth
    if (this.trunkMesh) {
      const trunkProgress = THREE.MathUtils.clamp((p - 0.22) / 0.38, 0.001, 1);
      this.trunkMesh.scale.y = trunkProgress;
      this.trunkMesh.scale.x = Math.max(0.05, trunkProgress);
      this.trunkMesh.scale.z = Math.max(0.05, trunkProgress);
    }

    // Branches growth
    this.branches.forEach(b => {
      if (p >= b.triggerProgress) {
        const bProgress = THREE.MathUtils.clamp((p - b.triggerProgress) / 0.18, 0.001, 1);
        b.mesh.scale.set(bProgress, bProgress, bProgress);
      } else {
        b.mesh.scale.set(0.001, 0.001, 0.001);
      }
    });

    // Foliage & Blossoms bloom
    this.foliage.forEach(f => {
      if (p >= f.triggerProgress) {
        const fProgress = THREE.MathUtils.clamp((p - f.triggerProgress) / 0.16, 0, 1);
        const s = fProgress * f.maxScale;
        f.mesh.scale.set(s, s, s);
      } else {
        f.mesh.scale.set(0, 0, 0);
      }
    });

    // Canopy PointLight Climax Intensity
    if (this.canopyLight) {
      if (p > 0.58) {
        const climaxFactor = THREE.MathUtils.clamp((p - 0.58) / 0.24, 0, 1);
        this.canopyLight.intensity = 0.2 + climaxFactor * 3.4;
      } else {
        this.canopyLight.intensity = 0.1;
      }
    }

    // 5. Camera Choreography
    if (p <= 0.60) {
      const orbitAngle = p * Math.PI * 0.75;
      const camRadius = 7.2 + p * 3.8;
      this.camera.position.x = Math.sin(orbitAngle) * camRadius;
      this.camera.position.z = Math.cos(orbitAngle) * camRadius;
      this.camera.position.y = 1.8 + p * 6.5;
      this.camera.lookAt(0, 2.5 + p * 4.5, 0);
    } else if (p <= 0.85) {
      const t = (p - 0.60) / 0.25;
      this.camera.position.y = 5.7 + t * 1.5;
      this.camera.position.z = 10.5 - t * 1.8;
      this.camera.lookAt(0, 6.5, 0);
    } else {
      const t = (p - 0.85) / 0.15;
      this.camera.position.z = 8.7 - t * 7.5;
      this.camera.position.y = 7.2 + t * 4.5;
      this.camera.lookAt(0, 7.5, -5);
    }
  }

  setupParallaxListeners() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) - 0.5;
      this.mouse.targetY = (e.clientY / window.innerHeight) - 0.5;
    });

    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null) {
        this.mouse.targetX = THREE.MathUtils.clamp(e.gamma / 35, -0.5, 0.5);
        this.mouse.targetY = THREE.MathUtils.clamp((e.beta - 45) / 35, -0.5, 0.5);
      }
    });
  }

  setupVisibilityObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isHeroVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });

    if (this.track) observer.observe(this.track);
  }

  animate() {
    this.rafId = requestAnimationFrame(() => this.animate());

    if (!this.isHeroVisible) return;

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    if (this.treeGroup) {
      this.treeGroup.rotation.y = this.mouse.x * 0.45;
      this.treeGroup.rotation.x = this.mouse.y * 0.25;
    }

    if (this.fireflySwarm && this.fireflies.length > 0) {
      const positions = this.fireflySwarm.geometry.attributes.position.array;
      const swirlFactor = this.scrollProgress > 0.55 ? 2.5 : 1.0;

      for (let i = 0; i < this.fireflies.length; i++) {
        const f = this.fireflies[i];
        f.angle += f.speed * 0.015 * swirlFactor;
        f.phase += 0.03;

        positions[i * 3] = Math.cos(f.angle) * f.radius;
        positions[i * 3 + 1] = f.baseY + Math.sin(f.phase) * 0.45;
        positions[i * 3 + 2] = Math.sin(f.angle) * f.radius;
      }
      this.fireflySwarm.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

/* ==============================================================================
   3. BACKGROUND 2D FIREFLIES CANVAS (For subsequent page sections)
   ============================================================================== */
class FireflyEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.fireflies = [];
    this.fireflyCount = 35;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) this.fireflyCount = 10;

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    const glowColors = [
      'rgba(16, 185, 129,',
      'rgba(110, 231, 183,',
      'rgba(6, 182, 212,',
      'rgba(251, 191, 36,'
    ];

    for (let i = 0; i < this.fireflyCount; i++) {
      this.fireflies.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2.2 + 0.8,
        colorBase: glowColors[Math.floor(Math.random() * glowColors.length)],
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        alphaSpeed: Math.random() * 0.02 + 0.005,
        pulseDirection: Math.random() > 0.5 ? 1 : -1
      });
    }

    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let f of this.fireflies) {
      f.x += f.vx;
      f.y += f.vy;

      if (f.x < -10) f.x = this.canvas.width + 10;
      if (f.x > this.canvas.width + 10) f.x = -10;
      if (f.y < -10) f.y = this.canvas.height + 10;
      if (f.y > this.canvas.height + 10) f.y = -10;

      f.alpha += f.alphaSpeed * f.pulseDirection;
      if (f.alpha >= 0.95) {
        f.alpha = 0.95;
        f.pulseDirection = -1;
      } else if (f.alpha <= 0.15) {
        f.alpha = 0.15;
        f.pulseDirection = 1;
      }

      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.radius * 3.2, 0, Math.PI * 2);
      this.ctx.fillStyle = `${f.colorBase} ${f.alpha * 0.25})`;
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${f.colorBase} ${f.alpha})`;
      this.ctx.fill();
    }

    requestAnimationFrame(() => this.animate());
  }
}

/* ==============================================================================
   4. MULTI-CRITERIA EVENT FILTERING ENGINE
   ============================================================================== */
class EventCatalogController {
  constructor(events) {
    this.events = events;
    this.activeCategory = 'all';
    this.activeDay = 'all';
    this.searchQuery = '';

    this.gridElement = document.getElementById('eventsGrid');
    this.countDisplay = document.getElementById('eventCountDisplay');
    this.emptyState = document.getElementById('emptyStateCard');
    this.categoryPills = document.querySelectorAll('.filter-pills [data-category]');
    this.dayPills = document.querySelectorAll('.filter-pills [data-day]');
    this.searchInput = document.getElementById('eventSearchInput');
    this.resetBtn = document.getElementById('resetFiltersBtn');
    this.emptyResetBtn = document.getElementById('emptyResetBtn');

    this.init();
  }

  init() {
    this.categoryPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        this.activeCategory = e.currentTarget.getAttribute('data-category');
        this.updatePillUI(this.categoryPills, e.currentTarget);
        this.applyFilters();
      });
    });

    this.dayPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        this.activeDay = e.currentTarget.getAttribute('data-day');
        this.updatePillUI(this.dayPills, e.currentTarget);
        this.applyFilters();
      });
    });

    let debounceTimer;
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.searchQuery = e.target.value.trim().toLowerCase();
          this.applyFilters();
        }, 200);
      });
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.resetAllFilters());
    }
    if (this.emptyResetBtn) {
      this.emptyResetBtn.addEventListener('click', () => this.resetAllFilters());
    }

    document.querySelectorAll('.activity-link[data-filter]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetCategory = e.currentTarget.getAttribute('data-filter');
        this.setCategoryFromExternal(targetCategory);
      });
    });

    this.applyFilters();
  }

  updatePillUI(pillGroup, activePill) {
    pillGroup.forEach(pill => {
      pill.classList.remove('active');
      pill.setAttribute('aria-checked', 'false');
    });
    activePill.classList.add('active');
    activePill.setAttribute('aria-checked', 'true');
  }

  setCategoryFromExternal(category) {
    this.activeCategory = category;
    this.categoryPills.forEach(pill => {
      if (pill.getAttribute('data-category') === category) {
        this.updatePillUI(this.categoryPills, pill);
      }
    });
    this.applyFilters();
  }

  resetAllFilters() {
    this.activeCategory = 'all';
    this.activeDay = 'all';
    this.searchQuery = '';
    if (this.searchInput) this.searchInput.value = '';

    const allCatPill = document.querySelector('[data-category="all"]');
    if (allCatPill) this.updatePillUI(this.categoryPills, allCatPill);

    const allDayPill = document.querySelector('[data-day="all"]');
    if (allDayPill) this.updatePillUI(this.dayPills, allDayPill);

    this.applyFilters();
    showToast('Filters cleared. Showing all 12 festival events.', 'info');
  }

  applyFilters() {
    const filtered = this.events.filter(event => {
      const matchesCategory = (this.activeCategory === 'all') || (event.category === this.activeCategory);
      const matchesDay = (this.activeDay === 'all') || (event.day === this.activeDay);
      const matchesSearch = !this.searchQuery || 
        event.title.toLowerCase().includes(this.searchQuery) ||
        event.description.toLowerCase().includes(this.searchQuery) ||
        event.venue.toLowerCase().includes(this.searchQuery) ||
        event.category.toLowerCase().includes(this.searchQuery);

      return matchesCategory && matchesDay && matchesSearch;
    });

    this.renderCards(filtered);
    this.updateResultCount(filtered.length);
  }

  updateResultCount(count) {
    if (this.countDisplay) {
      this.countDisplay.textContent = `Showing ${count} ${count === 1 ? 'event' : 'events'}`;
    }

    if (count === 0) {
      if (this.emptyState) this.emptyState.classList.remove('hidden');
      if (this.gridElement) this.gridElement.innerHTML = '';
    } else {
      if (this.emptyState) this.emptyState.classList.add('hidden');
    }
  }

  renderCards(events) {
    if (!this.gridElement) return;
    this.gridElement.innerHTML = '';

    events.forEach(evt => {
      const card = document.createElement('article');
      card.className = 'event-card';
      card.setAttribute('data-id', evt.id);

      card.innerHTML = `
        <div class="event-card-top">
          <span class="event-category-badge">${evt.category}</span>
          <span class="event-status-pill">${evt.status}</span>
        </div>

        <h3 class="event-title">${evt.icon} ${evt.title}</h3>
        <p class="event-desc">${evt.description}</p>

        <div class="event-meta-block">
          <div class="meta-row">
            <span class="meta-icon" aria-hidden="true">📅</span>
            <span><strong>${evt.day}:</strong> ${evt.dateStr}</span>
          </div>
          <div class="meta-row">
            <span class="meta-icon" aria-hidden="true">⏰</span>
            <span><strong>Time:</strong> ${evt.timeSlot}</span>
          </div>
          <div class="meta-row">
            <span class="meta-icon" aria-hidden="true">📍</span>
            <span class="meta-venue-chip ${evt.venueClass}">${evt.venue}</span>
          </div>
          <div class="meta-row">
            <span class="meta-icon" aria-hidden="true">🎟️</span>
            <span>Available Seats: <strong>${evt.seatsLeft}</strong></span>
          </div>
        </div>

        <div class="event-card-actions">
          <button class="btn btn-primary btn-card-register" data-quick-register="${evt.id}" data-event-title="${evt.id}: ${evt.title}">
            <span>Quick Register (⏰ ${evt.timeSlot})</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      `;

      this.gridElement.appendChild(card);
    });

    this.gridElement.querySelectorAll('[data-quick-register]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const eventId = e.currentTarget.getAttribute('data-quick-register');
        handleQuickRegistration(eventId);
      });
    });
  }
}

/* ==============================================================================
   5. SCHEDULE & ANALYTICAL CHALLENGE RESOLUTION
   ============================================================================== */
class ScheduleController {
  constructor(events) {
    this.events = events;
    this.currentDay = 'Day 1';

    this.container = document.getElementById('timelineSlotContainer');
    this.tabs = document.querySelectorAll('.schedule-tab');
    this.viewIndicator = document.getElementById('scheduleViewIndicator');

    this.init();
  }

  init() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const selectedDay = e.currentTarget.getAttribute('data-tab');
        this.switchDay(selectedDay, e.currentTarget);
      });
    });

    this.renderScheduleForDay(this.currentDay);
  }

  switchDay(day, tabElement) {
    this.currentDay = day;
    this.tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tabElement.classList.add('active');
    tabElement.setAttribute('aria-selected', 'true');

    if (this.viewIndicator) {
      this.viewIndicator.textContent = `Showing: ${day} Schedule`;
    }

    this.renderScheduleForDay(day);
  }

  renderScheduleForDay(day) {
    if (!this.container) return;
    const dayEvents = this.events.filter(e => e.day === day);

    const timeSlotsMap = new Map();
    dayEvents.forEach(event => {
      if (!timeSlotsMap.has(event.timeSlot)) {
        timeSlotsMap.set(event.timeSlot, []);
      }
      timeSlotsMap.get(event.timeSlot).push(event);
    });

    this.container.innerHTML = '';

    timeSlotsMap.forEach((eventsInSlot, slotTime) => {
      const isConcurrent = eventsInSlot.length > 1;

      const slotBlock = document.createElement('div');
      slotBlock.className = 'time-slot-block';

      const pillarHTML = `
        <div class="time-pillar">
          <span class="time-badge">${slotTime.split('–')[0].trim()}</span>
          <span class="time-duration">${slotTime}</span>
          ${isConcurrent ? `<span class="time-concurrency-tag">⚡ ${eventsInSlot.length} Parallel Tracks</span>` : ''}
        </div>
      `;

      let tracksHTML = `<div class="parallel-events-track">`;

      eventsInSlot.forEach(evt => {
        tracksHTML += `
          <div class="timeline-event-card" style="border-left: 3px solid var(--${evt.venueClass}-border);">
            <div class="t-event-top">
              <span class="t-event-venue ${evt.venueClass}">${evt.venue}</span>
              <span class="t-event-category">${evt.category}</span>
            </div>
            <h4 class="t-event-title">${evt.icon} ${evt.title}</h4>
            <p class="t-event-summary">${evt.description}</p>
            <div class="t-event-footer">
              <span>🎟️ Seats: ${evt.seatsLeft}</span>
              <button class="t-event-slot-btn" data-slot-register="${evt.id}">
                Quick Register (⏰ ${evt.timeSlot}) →
              </button>
            </div>
          </div>
        `;
      });

      tracksHTML += `</div>`;

      slotBlock.innerHTML = pillarHTML + tracksHTML;
      this.container.appendChild(slotBlock);
    });

    this.container.querySelectorAll('[data-slot-register]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-slot-register');
        handleQuickRegistration(id);
      });
    });
  }
}

/* ==============================================================================
   6. QUICK REGISTRATION BRIDGE & SELECTED EVENT PREVIEW
   Clearly displays exact Venue and Time Slot in the registration form
   ============================================================================== */
function updateSelectedEventPreview(eventId) {
  const timePill = document.getElementById('selectedCardTimePill');
  const timeDisplay = document.getElementById('selectedEventTime');
  const venueDisplay = document.getElementById('selectedEventVenue');

  const matchedEvent = ECOFEST_EVENTS.find(e => e.id === eventId);

  if (matchedEvent) {
    if (timePill) timePill.textContent = `${matchedEvent.day} (${matchedEvent.dateStr})`;
    if (timeDisplay) timeDisplay.textContent = `${matchedEvent.day} • ${matchedEvent.dateStr} • ${matchedEvent.timeSlot}`;
    if (venueDisplay) venueDisplay.textContent = matchedEvent.venue;
  } else {
    if (timePill) timePill.textContent = 'All-Day Festival Pass';
    if (timeDisplay) timeDisplay.textContent = 'Nov 14 – 16, 2026 • Full Festival Visitor Access';
    if (venueDisplay) venueDisplay.textContent = 'The Whispering Banyan Grove (All Zones A, B, C, D)';
  }
}

function handleQuickRegistration(eventId) {
  const formSection = document.getElementById('registration');
  const eventSelect = document.getElementById('eventSelect');

  if (eventSelect) {
    eventSelect.value = eventId;
    eventSelect.classList.add('is-valid');
    setTimeout(() => {
      eventSelect.classList.remove('is-valid');
    }, 1800);
  }

  // Update dynamic preview card with venue and time
  updateSelectedEventPreview(eventId);

  // Smooth scroll to registration form
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
  }

  const matchedEvent = ECOFEST_EVENTS.find(e => e.id === eventId);
  if (matchedEvent) {
    showToast(`Quick Register: ${matchedEvent.title} (⏰ ${matchedEvent.timeSlot} at 📍 ${matchedEvent.venue})`, 'success');
  } else {
    showToast('General Festival Pass selected.', 'info');
  }
}

/* ==============================================================================
   7. STRICT FORM VALIDATION & DIGITAL PASS GENERATION
   ============================================================================== */
class RegistrationFormController {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) return;

    this.fields = {
      fullName: document.getElementById('fullName'),
      email: document.getElementById('emailAddress'),
      phone: document.getElementById('phoneNumber'),
      college: document.getElementById('collegeName'),
      eventSelect: document.getElementById('eventSelect'),
      ecoPledge: document.getElementById('ecoPledge')
    };

    this.errors = {
      fullName: document.getElementById('fullNameError'),
      email: document.getElementById('emailAddressError'),
      phone: document.getElementById('phoneNumberError'),
      college: document.getElementById('collegeNameError'),
      eventSelect: document.getElementById('eventSelectError'),
      ecoPledge: document.getElementById('ecoPledgeError')
    };

    this.modal = document.getElementById('passConfirmationModal');
    this.closeBtn = document.getElementById('closeModalBtn');
    this.dismissBtn = document.getElementById('dismissModalBtn');
    this.printBtn = document.getElementById('printTicketBtn');

    this.init();
  }

  init() {
    this.fields.fullName.addEventListener('blur', () => this.validateName());
    this.fields.fullName.addEventListener('input', () => this.clearError('fullName'));

    this.fields.email.addEventListener('blur', () => this.validateEmail());
    this.fields.email.addEventListener('input', () => this.clearError('email'));

    this.fields.phone.addEventListener('blur', () => this.validatePhone());
    this.fields.phone.addEventListener('input', () => this.clearError('phone'));

    this.fields.college.addEventListener('blur', () => this.validateCollege());
    this.fields.college.addEventListener('input', () => this.clearError('college'));

    this.fields.eventSelect.addEventListener('change', (e) => {
      this.validateEventSelect();
      updateSelectedEventPreview(e.target.value);
    });

    this.fields.ecoPledge.addEventListener('change', () => this.validatePledge());

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeModal());
    if (this.dismissBtn) this.dismissBtn.addEventListener('click', () => this.closeModal());
    if (this.printBtn) this.printBtn.addEventListener('click', () => window.print());

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        const d = this.modal.getBoundingClientRect();
        if (e.clientX < d.left || e.clientX > d.right || e.clientY < d.top || e.clientY > d.bottom) {
          this.closeModal();
        }
      });
    }

    // Populate dropdown with rich Time & Venue labels
    this.enhanceDropdownOptions();
  }

  enhanceDropdownOptions() {
    if (!this.fields.eventSelect) return;
    const select = this.fields.eventSelect;

    Array.from(select.options).forEach(opt => {
      const val = opt.value;
      const matched = ECOFEST_EVENTS.find(e => e.id === val);
      if (matched) {
        opt.textContent = `${matched.id}: ${matched.title} [⏰ ${matched.day}, ${matched.timeSlot} | 📍 ${matched.venue}]`;
      }
    });
  }

  validateName() {
    const val = this.fields.fullName.value.trim();
    if (val.length < 2) {
      this.setError('fullName', 'Please enter your full name (minimum 2 characters).');
      return false;
    }
    this.setValid('fullName');
    return true;
  }

  validateEmail() {
    const val = this.fields.email.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!val) {
      this.setError('email', 'Email address is required.');
      return false;
    }
    if (!emailRegex.test(val)) {
      this.setError('email', 'Please provide a valid email address (e.g. name@domain.com).');
      return false;
    }
    this.setValid('email');
    return true;
  }

  validatePhone() {
    const val = this.fields.phone.value.trim().replace(/[\s-]/g, '');
    const phoneRegex = /^[0-9]{10}$/;
    if (!val) {
      this.setError('phone', 'Contact number is required for entry verification.');
      return false;
    }
    if (!phoneRegex.test(val)) {
      this.setError('phone', 'Please enter a valid 10-digit mobile number.');
      return false;
    }
    this.setValid('phone');
    return true;
  }

  validateCollege() {
    const val = this.fields.college.value.trim();
    if (val.length < 3) {
      this.setError('college', 'Please specify your college or university department.');
      return false;
    }
    this.setValid('college');
    return true;
  }

  validateEventSelect() {
    const val = this.fields.eventSelect.value;
    if (!val) {
      this.setError('eventSelect', 'Please select an event or general festival pass.');
      return false;
    }
    this.setValid('eventSelect');
    return true;
  }

  validatePledge() {
    if (!this.fields.ecoPledge.checked) {
      this.setError('ecoPledge', 'You must agree to the Enchanted Nature zero-waste pledge.');
      return false;
    }
    this.clearError('ecoPledge');
    return true;
  }

  setError(fieldKey, message) {
    const input = this.fields[fieldKey];
    const errBox = this.errors[fieldKey];
    if (input) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    }
    if (errBox) errBox.textContent = message;
  }

  setValid(fieldKey) {
    const input = this.fields[fieldKey];
    const errBox = this.errors[fieldKey];
    if (input) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    }
    if (errBox) errBox.textContent = '';
  }

  clearError(fieldKey) {
    const input = this.fields[fieldKey];
    const errBox = this.errors[fieldKey];
    if (input) input.classList.remove('is-invalid');
    if (errBox) errBox.textContent = '';
  }

  handleSubmit(e) {
    e.preventDefault();

    const isNameOk = this.validateName();
    const isEmailOk = this.validateEmail();
    const isPhoneOk = this.validatePhone();
    const isCollegeOk = this.validateCollege();
    const isEventOk = this.validateEventSelect();
    const isPledgeOk = this.validatePledge();

    if (!isNameOk || !isEmailOk || !isPhoneOk || !isCollegeOk || !isEventOk || !isPledgeOk) {
      showToast('Please correct highlighted errors in the form.', 'error');
      return;
    }

    const participationType = this.form.querySelector('input[name="participationType"]:checked')?.value || 'solo';
    const typeLabel = participationType === 'team' ? 'Team Entry (2-4)' : 'Solo Explorer';

    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const passId = `ECO-2026-${randomHex}`;

    const selectedVal = this.fields.eventSelect.value;
    const matchedEvent = ECOFEST_EVENTS.find(ev => ev.id === selectedVal);

    const eventName = matchedEvent ? `${matchedEvent.id}: ${matchedEvent.title}` : 'General Festival Pass';
    const scheduledTime = matchedEvent ? `${matchedEvent.day} • ${matchedEvent.dateStr} • ${matchedEvent.timeSlot}` : 'Nov 14–16, 2026 • All-Day Access';
    const assignedVenue = matchedEvent ? matchedEvent.venue : 'The Whispering Banyan Grove (Zone A)';

    // Populate Pass Modal Details including Time and Venue!
    document.getElementById('ticketIdDisplay').textContent = passId;
    document.getElementById('ticketNameDisplay').textContent = this.fields.fullName.value.trim();
    document.getElementById('ticketEventDisplay').textContent = eventName;
    document.getElementById('ticketTimeDisplay').textContent = scheduledTime;
    document.getElementById('ticketVenueDisplay').textContent = assignedVenue;
    document.getElementById('ticketCollegeDisplay').textContent = this.fields.college.value.trim();
    document.getElementById('ticketTypeDisplay').textContent = typeLabel;

    if (this.modal) {
      if (typeof this.modal.showModal === 'function') {
        this.modal.showModal();
      } else {
        this.modal.setAttribute('open', '');
      }
    }

    showToast('EcoPass generated successfully! Time and Venue confirmed.', 'success');
  }

  closeModal() {
    if (this.modal) {
      if (typeof this.modal.close === 'function') {
        this.modal.close();
      } else {
        this.modal.removeAttribute('open');
      }
    }
  }
}

/* ==============================================================================
   8. NOTIFICATION TOAST HELPER
   ============================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '🌱' : type === 'error' ? '⚠️' : '🍃';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ==============================================================================
   9. MOBILE NAVIGATION & SCROLL SPY
   ============================================================================== */
function initNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id], div[id="hero"]');
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==============================================================================
   10. APPLICATION BOOTSTRAPPER
   ============================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Scroll-Driven 3D Hero Experience (Three.js & GSAP ScrollTrigger)
  new Scroll3DHero();

  // 2. Initialize 2D Ambient Fireflies Canvas for page body
  new FireflyEngine('fireflyCanvas');

  // 3. Initialize Event Catalog Filter
  new EventCatalogController(ECOFEST_EVENTS);

  // 4. Initialize Schedule & Analytical Challenge Solution
  new ScheduleController(ECOFEST_EVENTS);

  // 5. Initialize Registration Form with Venue & Time Previews
  new RegistrationFormController('ecoRegistrationForm');

  // 6. Initialize Navigation & Mobile Drawer
  initNavigation();

  console.log('%c🌿 EcoFest 2026: Scroll-Driven 3D Hero & Event Engine Initialized!', 'color: #10b981; font-weight: bold; font-size: 14px;');
});
