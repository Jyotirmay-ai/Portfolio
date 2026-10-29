import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// Hamburger Menu Toggle
function initHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  if (!hamburger || !navMenu) return;
  
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  
  // Close menu helper
  const closeMenu = () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    document.body.style.overflow = '';
  };

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when tapping outside (backdrop click)
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });
  
  // Brand Logo click: navigate to home or smooth-scroll to top if already on home
  const brandLogo = document.querySelector('.brand-logo');
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      closeMenu();

      const isIndex = !window.location.pathname.includes('certificates');
      if (isIndex) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.location.hash) {
          history.pushState(null, '', window.location.pathname);
        }
      }
    });
  }

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

// 3D Three.js Engine Variables — AI Neural Network & Vector Constellation
let scene, camera, renderer, neuralPoints, neuralLines, ambientDustMesh;
let targetCamX = 0, targetCamY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Cyberpunk Preloader Engine
function initPreloader() {
  const preloader = document.getElementById('cyber-preloader');
  const barFill = document.getElementById('preloader-fill');
  const percentText = document.getElementById('preloader-percent');
  const logsContainer = document.getElementById('preloader-logs');
  const enterBtn = document.getElementById('enter-btn');

  if (!preloader || !barFill || !percentText) return;

  const bootLogs = [
    "> establishing <span style=\"color:var(--neon-cyan)\">TLS 1.3</span> encrypted channel...",
    "> validating <span style=\"color:var(--neon-cyan)\">CSP & anti-xss</span> defenses <span style=\"color:#00ff88\">[PASS]</span>",
    "> zero-trust firewall: origin verified <span style=\"color:#00ff88\">[OK]</span>",
    "> initializing 3D neural matrix...",
    "> mounting core interfaces...",
    "> security shield armed. <span style=\"color:#00ff88\">ready.</span>"
  ];

  let progress = 0;
  let logIndex = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress > 100) progress = 100;

    barFill.style.width = `${progress}%`;
    percentText.innerText = `${progress}%`;

    const targetLogIndex = Math.floor((progress / 100) * bootLogs.length);
    if (targetLogIndex > logIndex && logIndex < bootLogs.length) {
      const line = document.createElement('div');
      line.className = 'log-line';
      line.innerHTML = bootLogs[logIndex];
      logsContainer.appendChild(line);
      logsContainer.scrollTop = logsContainer.scrollHeight;
      logIndex++;
    }

    if (progress >= 100) {
      clearInterval(interval);
      const badgeText = preloader.querySelector('.sec-badge-text');
      const pulseDot = preloader.querySelector('.sec-pulse-dot');
      if (badgeText) badgeText.innerText = 'SESSION ENCRYPTED // ACCESS GRANTED';
      if (pulseDot) {
        pulseDot.style.background = '#00ff88';
        pulseDot.style.boxShadow = '0 0 10px #00ff88';
      }

      if (enterBtn) {
        enterBtn.classList.add('active');
        const dismiss = () => {
          preloader.classList.add('fade-out');
          window.removeEventListener('keydown', handleKey);
        };
        const handleKey = (e) => {
          if (e.key === 'Enter') dismiss();
        };
        enterBtn.addEventListener('click', dismiss);
        window.addEventListener('keydown', handleKey);
      }
    }
  }, 75);
}

function init3D() {
  const container = document.getElementById('webgl-container');
  if (!container) return;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030611, 0.001);

  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 720;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Helper: Generates a soft circular glow point texture
  function createPointTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(0, 240, 255, 0.9)');
    grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }

  // 1. AI Vector Embedding Nodes (Neural Graph Points)
  const NODE_COUNT = 135;
  const MAX_DISTANCE = 150;
  const MAX_DISTANCE_SQ = MAX_DISTANCE * MAX_DISTANCE;
  const MAX_LINES = 380;

  const nodePositions = new Float32Array(NODE_COUNT * 3);
  const nodeColors = new Float32Array(NODE_COUNT * 3);
  const nodeVelocities = [];

  const cyan = new THREE.Color(0x00f0ff);
  const violet = new THREE.Color(0x8a2be2);
  const emerald = new THREE.Color(0x00ff88);

  for (let i = 0; i < NODE_COUNT; i++) {
    const i3 = i * 3;
    nodePositions[i3] = (Math.random() - 0.5) * 1400;
    nodePositions[i3 + 1] = (Math.random() - 0.5) * 950;
    nodePositions[i3 + 2] = (Math.random() - 0.5) * 550 - 60;

    nodeVelocities.push({
      x: (Math.random() - 0.5) * 0.32,
      y: (Math.random() - 0.5) * 0.32,
      z: (Math.random() - 0.5) * 0.2
    });

    const rand = Math.random();
    let col = cyan;
    if (rand > 0.65) col = violet;
    else if (rand > 0.85) col = emerald;

    nodeColors[i3] = col.r;
    nodeColors[i3 + 1] = col.g;
    nodeColors[i3 + 2] = col.b;
  }

  const nodesGeometry = new THREE.BufferGeometry();
  nodesGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
  nodesGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

  const nodesMaterial = new THREE.PointsMaterial({
    size: 7.5,
    map: createPointTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  neuralPoints = new THREE.Points(nodesGeometry, nodesMaterial);
  scene.add(neuralPoints);

  // 2. Dynamic Synapse Connection Lines (Vector Cosine Similary Network)
  const linePositions = new Float32Array(MAX_LINES * 2 * 3);
  const lineColors = new Float32Array(MAX_LINES * 2 * 3);

  const linesGeometry = new THREE.BufferGeometry();
  linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

  const linesMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  neuralLines = new THREE.LineSegments(linesGeometry, linesMaterial);
  scene.add(neuralLines);

  // 3. Deep Latent Space Vector Dust (Ambient Depth Stars)
  const dustCount = 300;
  const dustGeometry = new THREE.BufferGeometry();
  const dustPositions = new Float32Array(dustCount * 3);

  for (let i = 0; i < dustCount * 3; i += 3) {
    dustPositions[i] = (Math.random() - 0.5) * 2200;
    dustPositions[i + 1] = (Math.random() - 0.5) * 1800;
    dustPositions[i + 2] = -400 - Math.random() * 1200;
  }

  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  const dustMaterial = new THREE.PointsMaterial({
    size: 2.2,
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  ambientDustMesh = new THREE.Points(dustGeometry, dustMaterial);
  scene.add(ambientDustMesh);

  document.addEventListener('mousemove', onDocumentMouseMove);
  window.addEventListener('resize', onWindowResize);

  function animate() {
    requestAnimationFrame(animate);

    // Silky smooth camera parallax tracking (luxury physics damping)
    camera.position.x += (targetCamX - camera.position.x) * 0.016;
    camera.position.y += (-targetCamY - camera.position.y) * 0.016;
    camera.lookAt(0, 0, 0);

    // Ambient dust slow drift
    ambientDustMesh.rotation.y += 0.00012;

    // Update Neural Node positions
    const pos = nodesGeometry.attributes.position.array;
    for (let i = 0; i < NODE_COUNT; i++) {
      const i3 = i * 3;
      const vel = nodeVelocities[i];

      pos[i3] += vel.x;
      pos[i3 + 1] += vel.y;
      pos[i3 + 2] += vel.z;

      // Gentle bounds bounce
      if (pos[i3] < -720 || pos[i3] > 720) vel.x *= -1;
      if (pos[i3 + 1] < -480 || pos[i3 + 1] > 480) vel.y *= -1;
      if (pos[i3 + 2] < -420 || pos[i3 + 2] > 220) vel.z *= -1;
    }
    nodesGeometry.attributes.position.needsUpdate = true;

    // Dynamically calculate Synaptic Lines between neighboring nodes
    let lineIdx = 0;
    const lPos = linesGeometry.attributes.position.array;
    const lCol = linesGeometry.attributes.color.array;

    for (let i = 0; i < NODE_COUNT && lineIdx < MAX_LINES; i++) {
      const i3 = i * 3;
      const x1 = pos[i3], y1 = pos[i3 + 1], z1 = pos[i3 + 2];
      const r1 = nodeColors[i3], g1 = nodeColors[i3 + 1], b1 = nodeColors[i3 + 2];

      for (let j = i + 1; j < NODE_COUNT && lineIdx < MAX_LINES; j++) {
        const j3 = j * 3;
        const dx = x1 - pos[j3];
        const dy = y1 - pos[j3 + 1];
        const dz = z1 - pos[j3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < MAX_DISTANCE_SQ) {
          const alpha = (1.0 - Math.sqrt(distSq) / MAX_DISTANCE) * 0.72;
          const line6 = lineIdx * 6;

          // Segment Vertex 1
          lPos[line6] = x1;
          lPos[line6 + 1] = y1;
          lPos[line6 + 2] = z1;
          lCol[line6] = r1 * alpha;
          lCol[line6 + 1] = g1 * alpha;
          lCol[line6 + 2] = b1 * alpha;

          // Segment Vertex 2
          lPos[line6 + 3] = pos[j3];
          lPos[line6 + 4] = pos[j3 + 1];
          lPos[line6 + 5] = pos[j3 + 2];
          lCol[line6 + 3] = nodeColors[j3] * alpha;
          lCol[line6 + 4] = nodeColors[j3 + 1] * alpha;
          lCol[line6 + 5] = nodeColors[j3 + 2] * alpha;

          lineIdx++;
        }
      }
    }

    linesGeometry.setDrawRange(0, lineIdx * 2);
    linesGeometry.attributes.position.needsUpdate = true;
    linesGeometry.attributes.color.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();
}

function onDocumentMouseMove(event) {
  targetCamX = (event.clientX - windowHalfX) * 0.1;
  targetCamY = (event.clientY - windowHalfY) * 0.1;
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Live Interactive Project Simulation Modals
function initSimulators() {
  // RAR Simulator Trigger
  window.runRarSimulation = function() {
    const modal = document.getElementById('sim-modal');
    const title = document.getElementById('sim-modal-title');
    const output = document.getElementById('sim-modal-output');
    if (!modal || !output) return;

    title.innerText = "LIVE SIMULATION: AI CANDIDATE RANKING SYSTEM (2-STAGE RAR)";
    output.innerHTML = "<div>[STARTING RAR PIPELINE SIMULATION...]</div>";
    modal.classList.add('active');

    const steps = [
      "> [STAGE 1] Loading candidate dataset: 100,000 profiles...",
      "> Executing behavioral pre-filter rules (-28% unqualified)...",
      "> Pre-filter complete. 72,000 candidates remaining.",
      "> [STAGE 2] Generating SentenceTransformer (SBERT) vector embeddings...",
      "> Building FAISS Index FlatL2 metric index across 384 dimensions...",
      "> Querying top 100 candidates by cosine similarity...",
      "> [STAGE 3] Dispatching top-100 to Groq LLM API (Llama-3.1-8b-instant)...",
      "> Evaluating across 4 dimensions: Tech Fit, Problem Solving, Code Quality, Culture.",
      "> Output Checkpoint saved to candidate_ranks_final.csv.",
      "--------------------------------------------------",
      "TOP MATCH: Candidate #49102 | Score: 98.4/100 | Recommendation: EVALUATION PASSED"
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < steps.length) {
        const line = document.createElement('div');
        line.innerText = steps[idx];
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 400);
  };

  // Ghost Protocol Simulator Trigger
  window.runGhostSimulation = function() {
    const modal = document.getElementById('sim-modal');
    const title = document.getElementById('sim-modal-title');
    const output = document.getElementById('sim-modal-output');
    if (!modal || !output) return;

    title.innerText = "LIVE SIMULATION: GHOST PROTOCOL AES-256 TOR ROUTING";
    output.innerHTML = "<div>[INITIALIZING ZERO-TRUST EPHEMERAL MESH...]</div>";
    modal.classList.add('active');

    const steps = [
      "> Plaintext Input: 'AI & Data Science Learning Roadmap Payload'",
      "> Generating 256-bit AES symmetric key in Web Worker RAM...",
      "> Encrypting plaintext payload -> Ciphertext: 8f3a91c7b04e229d11fa88...",
      "> Initiating SOCKS5 proxy to Tor Hidden Service (.onion)...",
      "> Establishing WebSocket handshake via Socket.IO over RAM...",
      "> Server relaying encrypted payload... (No Database written)",
      "> Recipient received payload & decrypted AES-256 in browser.",
      "> Wiping RAM session keys... Memory cleared safely."
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < steps.length) {
        const line = document.createElement('div');
        line.innerText = steps[idx];
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 450);
  };

  // Career Goal & Roadmap Modal Trigger
  window.openCareerGoalModal = function() {
    const modal = document.getElementById('sim-modal');
    const title = document.getElementById('sim-modal-title');
    const output = document.getElementById('sim-modal-output');
    if (!modal || !output) return;

    title.innerText = "CAREER VISION: TARGETING AI ENGINEER & DATA SCIENTIST ROLES";
    output.innerHTML = `
      <div style="color:var(--neon-cyan); font-weight:700;">JYOTIRMAY BISWAS — CAREER GOAL & SKILL ROADMAP</div>
      <div style="margin:10px 0; color:#fff; line-height:1.7;">
        <strong>Ultimate Objective:</strong> To work as an AI Engineer or Data Scientist, contributing to real-world machine learning models, vector search indexers, and data intelligence pipelines.<br><br>
        <strong>Active Learning & Hands-on Foundation:</strong><br>
        • <strong>AI/ML & Vector Search:</strong> SentenceTransformers (SBERT), FAISS Vector Indexing, Retrieval-Augmented Generation (RAG), Groq LLM API.<br>
        • <strong>Data Science:</strong> Data cleaning, statistical filtering, Pandas, NumPy, and feature processing.<br>
        • <strong>Systems & Tools:</strong> Python core & async programming, Linux, Docker, Git, Cursor, and Claude Code.<br><br>
        <strong>Philosophy:</strong> Highly motivated Computer Science undergraduate eager to learn, adapt, and grow within a fast-paced AI or data team.
      </div>
      <div style="color:var(--neon-green); margin-top:8px;">[STATUS]: OPEN TO ENTRY-LEVEL & INTERNSHIP ROLES</div>
    `;
    modal.classList.add('active');
  };

  window.closeSimModal = function() {
    const modal = document.getElementById('sim-modal');
    if (modal) modal.classList.remove('active');
  };

  // Close modal when clicking the dark backdrop or pressing Escape
  const simModal = document.getElementById('sim-modal');
  if (simModal) {
    simModal.addEventListener('click', (e) => {
      if (e.target === simModal) {
        window.closeSimModal();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && simModal.classList.contains('active')) {
        window.closeSimModal();
      }
    });
  }
}

// Document Preview Modal Engine (Certificates & Resume)
function initDocPreview() {
  window.openDocPreview = function(url, title = 'Document Preview', issuer = '') {
    const modal = document.getElementById('doc-preview-modal');
    const iframe = document.getElementById('doc-modal-iframe');
    const titleEl = document.getElementById('doc-modal-title');
    const issuerEl = document.getElementById('doc-modal-issuer');
    const newTabEl = document.getElementById('doc-modal-newtab');
    const downloadEl = document.getElementById('doc-modal-download');
    const loader = document.getElementById('doc-modal-loader');
    
    if (!modal || !iframe) return;

    if (titleEl) titleEl.innerText = title;
    if (issuerEl) issuerEl.innerText = issuer || 'Verified Credential Archive';
    if (newTabEl) newTabEl.href = url;
    if (downloadEl) downloadEl.href = url;

    if (loader) loader.style.display = 'flex';

    // Set PDF src with embedded viewer parameters
    iframe.src = url + '#toolbar=1&navpanes=0';
    iframe.onload = () => {
      if (loader) loader.style.display = 'none';
    };

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeDocPreview = function() {
    const modal = document.getElementById('doc-preview-modal');
    const iframe = document.getElementById('doc-modal-iframe');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
    if (iframe) {
      setTimeout(() => {
        iframe.src = 'about:blank';
      }, 250);
    }
  };

  const docModal = document.getElementById('doc-preview-modal');
  if (docModal) {
    docModal.addEventListener('click', (e) => {
      if (e.target === docModal) {
        window.closeDocPreview();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && docModal.classList.contains('active')) {
        window.closeDocPreview();
      }
    });
  }

  // Intercept all certificate view buttons for instant in-page preview
  document.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('.btn-cert-view');
    if (viewBtn) {
      const url = viewBtn.getAttribute('href');
      if (url && url.endsWith('.pdf')) {
        e.preventDefault();
        const card = viewBtn.closest('.certificate-card');
        const title = card ? card.querySelector('.certificate-title')?.innerText : 'Verified Certificate';
        const issuer = card ? card.querySelector('.certificate-issuer')?.innerText : '';
        window.openDocPreview(url, title, issuer);
      }
    }
  });
}

// Matrix Rain Animation Engine
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars = '0123456789ABCDEFHIJKLMNOPQRSTUVWXYZ@#$%&*+=-';
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(5, 7, 15, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff88';
    ctx.font = `${fontSize}px 'Fira Code', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(drawMatrix, 40);
}

// Resume Tabs Handler
function initResumeTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

// Copy Resume as Markdown for Recruiters
function copyMarkdownResume() {
  const markdownText = `# JYOTIRMAY BISWAS - RESUME
Contact: Kolkata, India | jyotirmaybiswas.workspace@gmail.com | +91 8017760704

## CAREER GOAL: AI ENGINEER & DATA SCIENTIST

## CAREER OBJECTIVE
Computer Science undergraduate actively building toward a career as an AI Engineer and Data Scientist. Possesses strong Python fundamentals and hands-on project experience — including a 2-stage AI candidate ranking system using vector search (SBERT, FAISS) and LLM explainable scoring. Eager to join an engineering or data team to learn, contribute, and build scalable AI solutions.

## TECHNICAL SKILLS
- Programming Languages: Python, Java (Basics)
- AI/ML & Vector Search: SentenceTransformers (SBERT), FAISS Vector Indexing, Groq LLM API (Llama-3.1), RAG Pipelines, TF-IDF
- Data Science & Data Analytics: Pandas, NumPy, Data Cleaning & Quality, Statistical Pre-filtering, Feature Processing, Model Evaluation
- Tools & Operating Systems: Linux, Docker, Git / GitHub, VS Code, Claude Code

## FEATURED PROJECTS
1. AI Candidate Ranking System (2026):
   - 2-Stage Retrieval-Augmented Ranking (RAR) pipeline filtering 100k job candidates.
   - SBERT + FAISS vector search narrowing 71k to top 100 candidates.
   - Groq LLM API (Llama-3.1-8b) scoring across 4 dimensions with explainable reasoning.

2. Ghost Protocol Chat (2025):
   - Zero-trust ephemeral messaging app over Tor onion routing.
   - Python/Flask backend, static HTML/JS frontend, AES-256 client-side encryption.
   - WebSockets (Socket.IO) RAM-only ephemeral storage.

## EDUCATION
- BTECH in Computer Science & Engineering | Dr. Sudhir Chandra Sur Institute (Exp. 2028)
- Diploma in Computer Science & Technology | K. G. Engineering Institute (2025)`;

  navigator.clipboard.writeText(markdownText).then(() => {
    showToast('SUCCESS: Markdown Resume copied to clipboard!');
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast-notice');
  if (!toast) return;
  toast.innerText = msg;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// Terminal Handler
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-body');
  if (!input || !body) return;

  // Command history buffer
  const commandHistory = [];
  let historyIndex = -1;
  const MAX_HISTORY = 50;

  const commands = {
    help: `Available Commands:
  - <span style="color: var(--neon-cyan)">bio</span>: Profile & career objective
  - <span style="color: var(--neon-cyan)">skills</span>: Technical skills & AI/ML stack matrix
  - <span style="color: var(--neon-cyan)">projects</span>: Detailed real-world engineering & data projects
  - <span style="color: var(--neon-cyan)">certs</span>: 20 verified credentials (ISRO, IIT-KGP, Deloitte, Tata, etc.)
  - <span style="color: var(--neon-cyan)">goal</span>: Career vision for AI Engineer & Data Scientist roles
  - <span style="color: var(--neon-cyan)">matrix</span>: Toggle digital green Matrix rain animation
  - <span style="color: var(--neon-cyan)">contact</span>: Email, phone, location & links
  - <span style="color: var(--neon-cyan)">clear</span>: Clear terminal console
  - <span style="color: var(--neon-cyan)">history</span>: Show command history`,

    bio: `<span style="color: var(--neon-cyan)">[JYOTIRMAY BISWAS]</span>
Computer Science undergraduate passionate about Artificial Intelligence, Data Science, and building intelligent software with Python. Enthusiastic about machine learning models, smart data pipelines, and real-world problem solving. Always eager to learn, build, and collaborate!`,

    certs: `<span style="color: var(--neon-cyan)">[VERIFIED CERTIFICATIONS ARCHIVE - 20 RECORDS]</span>
- <span style="color: var(--neon-green)">AI & Data Science:</span> Kharagpur Data Science Hackathon (IIT Kharagpur), Ultimate Data Science Course
- <span style="color: var(--neon-pink)">Space & Science:</span> ISRO Technical Program 2026, REFET 2026, NASA Space Apps
- <span style="color: var(--neon-cyan)">Hackathons & Tech:</span> Smart India Hackathon (SIH 2026), Adobe GenSolve, IIT-KGP Fugacity, HackShastra (R1 & R2), Srijan, Product Space, 4th Regional Conclave
- <span style="color: #c084fc">Industry Simulations:</span> Deloitte Cyber Security, Deloitte Technology, Tata Cybersecurity Analyst, EA Sports
- <span style="color: #ffbd2e">Academics:</span> B.Tech CSE (3rd/4th Sems), Diploma in CST, Secondary Board Record
Explore all records: <a href="certificates" style="color:var(--neon-green); text-decoration:underline;">/certificates</a>`,

    certificates: `<span style="color: var(--neon-cyan)">[VERIFIED CERTIFICATIONS ARCHIVE - 20 RECORDS]</span>
- <span style="color: var(--neon-green)">AI & Data Science:</span> Kharagpur Data Science Hackathon (IIT Kharagpur), Ultimate Data Science Course
- <span style="color: var(--neon-pink)">Space & Science:</span> ISRO Technical Program 2026, REFET 2026, NASA Space Apps
- <span style="color: var(--neon-cyan)">Hackathons & Tech:</span> Smart India Hackathon (SIH 2026), Adobe GenSolve, IIT-KGP Fugacity, HackShastra (R1 & R2), Srijan, Product Space, 4th Regional Conclave
- <span style="color: #c084fc">Industry Simulations:</span> Deloitte Cyber Security, Deloitte Technology, Tata Cybersecurity Analyst, EA Sports
- <span style="color: #ffbd2e">Academics:</span> B.Tech CSE (3rd/4th Sems), Diploma in CST, Secondary Board Record
Explore all records: <a href="certificates" style="color:var(--neon-green); text-decoration:underline;">/certificates</a>`,

    skills: `<span style="color: var(--neon-cyan)">[TECHNICAL SKILLS MATRIX]</span>
- Programming Languages: Python, Java (Basics)
- AI/ML & Vector Search: SentenceTransformers (SBERT), FAISS Vector Index, Groq LLM API (Llama-3.1), RAG Architectures, TF-IDF
- Data Science & Analytics: Pandas, NumPy, Data Cleaning & Quality, Statistical Pre-filtering, Feature Processing, Model Evaluation
- Tools & OS Environment: Linux, Docker, Git / GitHub, VS Code, Claude Code`,

    projects: `<span style="color: var(--neon-cyan)">[FEATURED PROJECTS]</span>
1. <span style="color: var(--neon-pink)">AI Candidate Ranking System</span> (Python, SBERT, FAISS, Groq LLM)
   - 2-stage RAR pipeline filtering 100k candidates using vector embeddings & Llama-3.1 LLM explainable scoring.
2. <span style="color: var(--neon-pink)">Ghost Protocol Chat</span> (Python, Flask, Socket.IO, Tor, Ngrok, AES-256)
   - Zero-trust encrypted ephemeral messaging app over Tor network with RAM-only storage.`,

    goal: `<span style="color: var(--neon-green)">[CAREER GOAL & VISION]</span>
Actively aspiring to become an AI Engineer or Data Scientist. Focused on building practical experience with vector search, semantic embeddings, data analytics, and modern AI tools. Open to entry-level and internship roles!`,

    contact: `<span style="color: var(--neon-cyan)">[CONTACT INFORMATION]</span>
- Email: jyotirmaybiswas.workspace@gmail.com
- Phone: +91 8017760704
- Location: Kolkata, India`,

    history: `<span style="color: var(--neon-cyan)">[COMMAND HISTORY]</span>
Use <span style="color: var(--neon-green)">↑/↓ arrows</span> to navigate previous commands.
Type <span style="color: var(--neon-cyan)">clear</span> to clear terminal.`
  };

  function addToHistory(cmd) {
    if (cmd && cmd !== commandHistory[commandHistory.length - 1]) {
      commandHistory.push(cmd);
      if (commandHistory.length > MAX_HISTORY) commandHistory.shift();
    }
    historyIndex = commandHistory.length;
  }

  function navigateHistory(direction) {
    if (commandHistory.length === 0) return;
    
    historyIndex = Math.max(0, Math.min(commandHistory.length, historyIndex + direction));
    
    if (historyIndex < commandHistory.length) {
      input.value = commandHistory[historyIndex];
    } else {
      input.value = '';
    }
    
    // Move cursor to end
    input.setSelectionRange(input.value.length, input.value.length);
  }

  function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value.trim().toLowerCase();
      const safeVal = escapeHTML(val);

      const cmdLine = document.createElement('div');
      cmdLine.className = 'terminal-line';
      cmdLine.innerHTML = `<span class="terminal-prompt">jyotirmay@portfolio-hud:~$</span> ${safeVal}`;
      body.appendChild(cmdLine);

      addToHistory(val);

      if (val === 'clear') {
        body.innerHTML = '';
      } else if (val === 'matrix') {
        const matCanvas = document.getElementById('matrix-canvas');
        matCanvas.classList.toggle('active');
        const outLine = document.createElement('div');
        outLine.className = 'terminal-line';
        outLine.innerHTML = `<span style="color: var(--neon-green)">[MATRIX RAIN TOGGLED]</span> Digital rain overlay state flipped.`;
        body.appendChild(outLine);
      } else if (commands[val]) {
        const outLine = document.createElement('div');
        outLine.className = 'terminal-line';
        outLine.innerHTML = commands[val];
        body.appendChild(outLine);
      } else if (val !== '') {
        const errLine = document.createElement('div');
        errLine.className = 'terminal-line';
        errLine.style.color = '#ff5f56';
        errLine.innerHTML = `Command not recognized: '${safeVal}'. Type <span style="color: var(--neon-cyan)">help</span> for available commands.`;
        body.appendChild(errLine);
      }

      input.value = '';
      body.scrollTop = body.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory(1);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Basic tab completion for known commands
      const val = input.value.trim().toLowerCase();
      const matches = Object.keys(commands).filter(cmd => cmd.startsWith(val));
      if (matches.length === 1) {
        input.value = matches[0];
      } else if (matches.length > 1) {
        const outLine = document.createElement('div');
        outLine.className = 'terminal-line';
        outLine.innerHTML = matches.join('  ');
        body.appendChild(outLine);
        body.scrollTop = body.scrollHeight;
      }
    }
  });
}

window.copyMarkdownResume = copyMarkdownResume;


// Certificate Category Filter Handler
function initCertificateFilters() {
  const filterBtns = document.querySelectorAll('.cert-filter-btn');
  const cards = document.querySelectorAll('.certificate-card');
  
  if (!filterBtns.length || !cards.length) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Recruiter Floating Widget Toggle
function initRecruiterWidget() {
  const widget = document.getElementById('recruiter-widget') || document.getElementById('recruiter-panel');
  const btn = document.getElementById('recruiter-widget-btn') || document.getElementById('recruiter-toggle');
  if (!widget || !btn) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = widget.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (widget.classList.contains('open') && !widget.contains(e.target)) {
      widget.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && widget.classList.contains('open')) {
      widget.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });

  // Close when any link inside is clicked
  const links = widget.querySelectorAll('.recruiter-widget-link, .recruiter-panel-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      widget.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Silky Smooth 3D Interactive Tilt & Glare for Avatar Card
function initAvatarInteractiveTilt() {
  const card = document.querySelector('.cyber-avatar-card');
  const wrapper = document.querySelector('.hero-avatar-wrapper');
  if (!card || !wrapper) return;

  let isHovered = false;
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  wrapper.addEventListener('mouseenter', () => {
    isHovered = true;
    card.classList.add('is-tilting');
    card.style.transition = 'box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  wrapper.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Gentle maximum 6.5-degree tilt for subtle luxury feel
    targetRotX = ((centerY - y) / centerY) * 6.5;
    targetRotY = ((x - centerX) / centerX) * 6.5;

    // Update dynamic glare position smoothly
    const glareX = Math.round((x / rect.width) * 100);
    const glareY = Math.round((y / rect.height) * 100);
    card.style.setProperty('--glare-x', `${glareX}%`);
    card.style.setProperty('--glare-y', `${glareY}%`);
  });

  wrapper.addEventListener('mouseleave', () => {
    isHovered = false;
    targetRotX = 0;
    targetRotY = 0;

    // Smooth return transition
    card.style.transition = 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.85s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
    card.style.transform = '';

    setTimeout(() => {
      if (!isHovered) {
        card.classList.remove('is-tilting');
        card.style.transition = '';
      }
    }, 850);
  });

  function renderTilt() {
    if (isHovered) {
      // 0.07 lerp for silky smooth physical damping
      currentRotX += (targetRotX - currentRotX) * 0.07;
      currentRotY += (targetRotY - currentRotY) * 0.07;
      card.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`;
    }
    requestAnimationFrame(renderTilt);
  }
  requestAnimationFrame(renderTilt);
}

// Unique IP Visitor Counter Engine
async function initVisitorCounter() {
  const counterElements = document.querySelectorAll('.visitor-count');
  if (!counterElements.length) return;

  const COUNTER_KEY = 'jyotirmaybiswas_portfolio_visitors_v1';
  const API_BASE = 'https://countapi.mileshilliard.com/api/v1';
  const STORAGE_KEY_VISITED = 'jb_portfolio_has_visited';
  const STORAGE_KEY_SESSION = 'jb_portfolio_session_seen';
  const STORAGE_KEY_IP_HASH = 'jb_portfolio_ip_hash';
  const STORAGE_KEY_LAST_COUNT = 'jb_portfolio_last_count';

  function renderCount(val) {
    if (!val || isNaN(val)) return;
    const num = parseInt(val, 10);
    const formatted = num.toLocaleString();
    counterElements.forEach(el => {
      el.innerText = formatted;
    });
    try {
      localStorage.setItem(STORAGE_KEY_LAST_COUNT, num.toString());
    } catch {}
  }

  // Pre-fill with last known count if available to avoid layout jump
  const cachedCount = localStorage.getItem(STORAGE_KEY_LAST_COUNT);
  if (cachedCount) {
    renderCount(cachedCount);
  }

  // Fast SHA-256 hash for IP privacy & deduplication
  async function hashIP(ip) {
    try {
      const msgBuffer = new TextEncoder().encode(ip.trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 24);
    } catch {
      return btoa(ip).slice(0, 24);
    }
  }

  // Safe fetch with timeout
  async function fetchWithTimeout(url, options = {}, timeoutMs = 3500) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      return response;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  try {
    const previouslyVisitedLocal = localStorage.getItem(STORAGE_KEY_VISITED) === 'true';
    const previouslyVisitedSession = sessionStorage.getItem(STORAGE_KEY_SESSION) === 'true';
    const storedIpHash = localStorage.getItem(STORAGE_KEY_IP_HASH);

    let isReturning = previouslyVisitedLocal || previouslyVisitedSession;

    let currentIpHash = null;
    try {
      const ipRes = await fetchWithTimeout('https://api.ipify.org?format=json', { cache: 'no-store' }, 2800);
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData && ipData.ip) {
          currentIpHash = await hashIP(ipData.ip);
          if (storedIpHash && currentIpHash === storedIpHash) {
            isReturning = true;
          }
        }
      }
    } catch (ipErr) {
      // If ipify is unreachable, fallback to browser storage flag
    }

    if (isReturning) {
      // Returning visit from the same IP/network: Read count only without incrementing
      const getRes = await fetchWithTimeout(`${API_BASE}/get/${COUNTER_KEY}`);
      if (getRes.ok) {
        const data = await getRes.json();
        renderCount(data.value);
      }
    } else {
      // Guard flags immediately in session & local storage to prevent duplicate increments
      try {
        sessionStorage.setItem(STORAGE_KEY_SESSION, 'true');
        localStorage.setItem(STORAGE_KEY_VISITED, 'true');
        if (currentIpHash) {
          localStorage.setItem(STORAGE_KEY_IP_HASH, currentIpHash);
        }
      } catch {}

      // First visit from this unique IP: Increment counter by 1
      const hitRes = await fetchWithTimeout(`${API_BASE}/hit/${COUNTER_KEY}`);
      if (hitRes.ok) {
        const data = await hitRes.json();
        renderCount(data.value);
      } else {
        const fallbackRes = await fetchWithTimeout(`${API_BASE}/get/${COUNTER_KEY}`);
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          renderCount(fallbackData.value);
        }
      }
    }
  } catch (err) {
    // Graceful offline fallback
    if (!cachedCount) {
      renderCount(1);
    }
  }

  // Click & tap toggle support
  const badges = document.querySelectorAll('.visitor-counter-badge');
  badges.forEach(badge => {
    badge.addEventListener('click', (e) => {
      badge.classList.toggle('tooltip-open');
    });
  });

  document.addEventListener('click', (e) => {
    badges.forEach(badge => {
      if (!badge.contains(e.target)) {
        badge.classList.remove('tooltip-open');
      }
    });
  });
}

// Cyber Recent Updates HUD Widget with Live GitHub Sync
function initRecentUpdatesWidget() {
  const widget = document.getElementById('recent-updates-widget');
  const triggerBtn = document.getElementById('updates-trigger-btn');
  const headerTime = document.getElementById('header-update-time');
  const updatesList = document.getElementById('updates-list');

  if (!widget || !triggerBtn) return;

  // Toggle dropdown on click
  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = widget.classList.toggle('open');
    triggerBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!widget.contains(e.target) && widget.classList.contains('open')) {
      widget.classList.remove('open');
      triggerBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && widget.classList.contains('open')) {
      widget.classList.remove('open');
      triggerBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Helper: Format commit date to clean HUD timestamp
  const formatUpdateTime = (isoStr) => {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return 'OCT 29, 2026';
      
      const now = new Date();
      const diffMs = now - d;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 60) return `${diffMins || 1}M AGO`;
      if (diffHours < 24) return `${diffHours}H AGO`;
      if (diffDays <= 7) return `${diffDays}D AGO`;

      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
    } catch {
      return 'OCT 29, 2026';
    }
  };

  // Helper: Escape HTML strings from GitHub commit messages
  const sanitize = (str) => {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  // Live GitHub commits fetch
  fetch('https://api.github.com/repos/Jyotirmay-ai/Portfolio/commits?per_page=3')
    .then(res => res.ok ? res.json() : null)
    .then(commits => {
      if (!Array.isArray(commits) || commits.length === 0) return;

      const latestCommit = commits[0];
      const latestDateStr = latestCommit?.commit?.author?.date || latestCommit?.commit?.committer?.date;
      
      if (headerTime && latestDateStr) {
        headerTime.innerText = formatUpdateTime(latestDateStr);
      }

      if (updatesList) {
        // Prepend live commits from GitHub
        const liveItems = commits.map((item) => {
          const rawMsg = item.commit?.message?.split('\n')[0] || 'Repository Update';
          const msg = sanitize(rawMsg);
          const date = new Date(item.commit?.author?.date || item.commit?.committer?.date);
          const timeStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase() + 
            ' • ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' UTC';
          const shaShort = item.sha ? item.sha.substring(0, 7) : 'git';

          return `
            <div class="update-item" style="border-left-color: var(--neon-cyan);">
              <div class="update-item-meta">
                <span class="update-item-time">${timeStr}</span>
                <span class="update-badge tag-ui">${shaShort}</span>
              </div>
              <div class="update-item-title">${msg}</div>
              <div class="update-item-desc">Verified GitHub repository commit pushed to branch <code>main</code>.</div>
            </div>
          `;
        }).join('');

        updatesList.innerHTML = liveItems;
      }
    })
    .catch(() => {
      // Graceful offline fallback: keep the verified updates pre-rendered in HTML
    });
}

document.addEventListener('DOMContentLoaded', () => {
  initHamburgerMenu();
  initPreloader();
  init3D();
  initSimulators();
  initMatrixRain();
  initResumeTabs();
  initTerminal();
  initCertificateFilters();
  initRecruiterWidget();
  initAvatarInteractiveTilt();
  initDocPreview();
  initVisitorCounter();
  initRecentUpdatesWidget();
});
