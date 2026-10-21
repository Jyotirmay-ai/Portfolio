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
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  
  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// 3D Three.js Engine Variables
let scene, camera, renderer, particlesMesh, cyberCore, innerIco;
let mouseX = 0, mouseY = 0;
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
    "> loading assets...",
    "> initializing 3d engine...",
    "> rendering particles...",
    "> mounting components...",
    "> applying theme...",
    "> ready."
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
      line.innerText = bootLogs[logIndex];
      logsContainer.appendChild(line);
      logsContainer.scrollTop = logsContainer.scrollHeight;
      logIndex++;
    }

    if (progress >= 100) {
      clearInterval(interval);
      if (enterBtn) {
        enterBtn.classList.add('active');
        enterBtn.addEventListener('click', () => {
          preloader.classList.add('fade-out');
        });
      }
    }
  }, 80);
}

function init3D() {
  const container = document.getElementById('webgl-container');
  if (!container) return;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070f, 0.0012);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 750;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // 1. Particle Cloud
  const particlesCount = 900;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);

  const colorCyan = new THREE.Color(0x00f0ff);
  const colorViolet = new THREE.Color(0x8a2be2);
  const colorPink = new THREE.Color(0xff007f);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 2200;
    positions[i + 1] = (Math.random() - 0.5) * 2200;
    positions[i + 2] = (Math.random() - 0.5) * 2200;

    const rand = Math.random();
    let c = colorCyan;
    if (rand > 0.6) c = colorViolet;
    else if (rand > 0.85) c = colorPink;

    colors[i] = c.r;
    colors[i + 1] = c.g;
    colors[i + 2] = c.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 4.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);

  // 2. Interactive Spinning 3D Wireframe Cyber Core (Torus Knot)
  const coreGeo = new THREE.TorusKnotGeometry(140, 30, 100, 16);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });
  cyberCore = new THREE.Mesh(coreGeo, coreMat);
  cyberCore.position.set(380, 0, -200);
  scene.add(cyberCore);

  // 3. Inner Glowing Icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(70, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0xff007f,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });
  innerIco = new THREE.Mesh(icoGeo, icoMat);
  innerIco.position.set(380, 0, -200);
  scene.add(innerIco);

  document.addEventListener('mousemove', onDocumentMouseMove);
  window.addEventListener('resize', onWindowResize);

  function animate() {
    requestAnimationFrame(animate);

    camera.position.x += (mouseX - camera.position.x) * 0.03;
    camera.position.y += (-mouseY - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    particlesMesh.rotation.y += 0.0006;
    particlesMesh.rotation.x += 0.0003;

    cyberCore.rotation.x += 0.005;
    cyberCore.rotation.y += 0.008;

    innerIco.rotation.x -= 0.008;
    innerIco.rotation.y -= 0.01;

    renderer.render(scene, camera);
  }

  animate();
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) * 0.5;
  mouseY = (event.clientY - windowHalfY) * 0.5;
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
- AI/ML & Vector Search: SentenceTransformers (SBERT), FAISS Vector Indexing, Groq LLM API (Llama-3.1), RAG Pipelines, TF-IDF
- Data Science & Data Analytics: Pandas, NumPy, Data Cleaning, Statistical Pre-filtering, Feature Processing
- Programming & Web: Python, JavaScript, HTML5, CSS3, Flask, Socket.IO, REST APIs
- Tools & Operating Systems: Linux, Docker, Git, VS Code, Cursor, Claude Code, MySQL

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
Explore all records: <a href="certificates.html" style="color:var(--neon-green); text-decoration:underline;">certificates.html</a>`,

    certificates: `<span style="color: var(--neon-cyan)">[VERIFIED CERTIFICATIONS ARCHIVE - 20 RECORDS]</span>
- <span style="color: var(--neon-green)">AI & Data Science:</span> Kharagpur Data Science Hackathon (IIT Kharagpur), Ultimate Data Science Course
- <span style="color: var(--neon-pink)">Space & Science:</span> ISRO Technical Program 2026, REFET 2026, NASA Space Apps
- <span style="color: var(--neon-cyan)">Hackathons & Tech:</span> Smart India Hackathon (SIH 2026), Adobe GenSolve, IIT-KGP Fugacity, HackShastra (R1 & R2), Srijan, Product Space, 4th Regional Conclave
- <span style="color: #c084fc">Industry Simulations:</span> Deloitte Cyber Security, Deloitte Technology, Tata Cybersecurity Analyst, EA Sports
- <span style="color: #ffbd2e">Academics:</span> B.Tech CSE (3rd/4th Sems), Diploma in CST, Secondary Board Record
Explore all records: <a href="certificates.html" style="color:var(--neon-green); text-decoration:underline;">certificates.html</a>`,

    skills: `<span style="color: var(--neon-cyan)">[TECHNICAL SKILLS MATRIX]</span>
- AI/ML & NLP: SentenceTransformers (SBERT), FAISS Vector Index, Groq LLM API (Llama-3.1), RAG Architectures
- Data Science & Data Engineering: Pandas, NumPy, Data Cleaning, Statistical Pre-filtering
- Languages & Web: Python, JavaScript, HTML5, CSS3, Flask, Socket.IO, REST APIs
- Environment: Linux, Docker, Git, MySQL`,

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

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value.trim().toLowerCase();

      const cmdLine = document.createElement('div');
      cmdLine.className = 'terminal-line';
      cmdLine.innerHTML = `<span class="terminal-prompt">jyotirmay@portfolio-hud:~$</span> ${val}`;
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
        errLine.innerHTML = `Command not recognized: '${val}'. Type <span style="color: var(--neon-cyan)">help</span> for available commands.`;
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

document.addEventListener('DOMContentLoaded', () => {
  
  initHamburgerMenu();
  initPreloader();
  init3D();
  initSimulators();
  initMatrixRain();
  initResumeTabs();
  initTerminal();
  initCertificateFilters();
});
