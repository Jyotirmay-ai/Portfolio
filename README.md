# Jyotirmay Biswas — 3D Cyber HUD Portfolio & Interactive Resume

[![Live Website](https://img.shields.io/badge/Live_Site-www.jyotirmaybiswas.tech-00f0ff?style=for-the-badge&logo=vercel&logoColor=white)](https://www.jyotirmaybiswas.tech/)
[![Security](https://img.shields.io/badge/Security-CSP_v3_%7C_Zero--Trust-00ff88?style=for-the-badge&logo=security&logoColor=white)](https://www.jyotirmaybiswas.tech/)
[![Three.js](https://img.shields.io/badge/3D_Engine-Three.js_WebGL-b000ff?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)

A high-performance, cyberpunk HUD-inspired portfolio and interactive verified credentials center for **Jyotirmay Biswas** (Aspiring AI Engineer & Data Scientist). Built with vanilla web standards, WebGL 3D graphics, enterprise-grade HTTP security headers, and unique visitor tracking.

🌐 **Production Website:** [https://www.jyotirmaybiswas.tech/](https://www.jyotirmaybiswas.tech/)

---

## 🚀 Key Features & Interactive Architecture

### 1. 🛡️ Enterprise Security & Hardening
* **Content Security Policy (CSP)**: Strict origin allowlisting for scripts, styles, fonts, objects, and connect endpoints.
* **DOM-based XSS Sanitization**: Input sanitization engine (`escapeHTML`) neutralizing injection vectors across the interactive Cyber Terminal.
* **Anti-Clickjacking**: Enforced `X-Frame-Options: SAMEORIGIN` and `frame-ancestors 'self'` to block iframe hijacking while permitting local PDF embedding.
* **Probe & Recon Shield**: Route rules in `vercel.json` returning immediate `404` for malicious reconnaissance probing sensitive files (`.git`, `.env*`, `.agents`, `package.json`, etc.).
* **Crawler Policy (`robots.txt`)**: Whitelists legitimate search engine crawlers while blocking aggressive scrapers (`ByteSpider`, `PetalBot`).
* **HSTS & Permissions Policy**: Enforced HTTPS (`max-age=63072000`) and disabled unnecessary hardware permissions (`camera`, `microphone`, `geolocation`).

### 2. 👁️ Unique IP Visitor Counter
* **True Deduplication**: Hashed client IP fingerprinting paired with `localStorage` and `sessionStorage` guards (`1 IP = 1 Count`).
* **Anti-Inflation**: Reopening tabs, refreshing pages, or navigating between pages does not inflate the count.
* **Interactive Tooltip**: Hover (or tap on mobile) displays an informative description of the deduplication protocol.

### 3. 📄 Document & Certificate Preview Modal
* **In-Page PDF Viewer**: Direct preview of all 20 verified certificates and official resume without navigating away.
* **HUD Action Bar**: Quick controls for **Full Screen**, **Open in New Tab**, **Download PDF**, and **Copy Document Link** with animated toast notifications.

### 4. 🧭 Mathematically Centered Navigation
* **Balanced 3-Column Layout**: Left brand identifier (`[JB.DEV]`), true dead-center menu routing (`About`, `Skills`, `Projects`, `Resume_HUD`, `Terminal`, `Contact`), and far-right status telemetry (`Target: AI Engineer` + Visitor Counter).
* **Responsive Drawer**: Seamless transition to a cyberpunk slide-out menu on mobile and tablet viewports.

### 5. ⚡ Cyberpunk Boot Sequence Preloader
* **Zero-Trust Diagnostics**: Real-time animated boot logs validating TLS 1.3 encryption, CSP filters, and neural matrix rendering.
* **Dynamic Security Badge**: Pulsing status dot transitioning to `SESSION ENCRYPTED // ACCESS GRANTED` upon completion.
* **Keyboard Accessible**: Dismissible via mouse click or physical <kbd>Enter</kbd> key.

### 6. 🌐 3D Neural Three.js Engine & Holographic Avatar
* **Particle Field & Torus Knot Wireframe**: Real-time WebGL neural mesh with depth fog and mouse parallax response.
* **3D Avatar Frame**: Physical tilt damping with dynamic light glare responding to cursor position.

### 7. 💻 Interactive Cyber Terminal
* **HUD Terminal CLI**: Functional command line supporting `help`, `bio`, `skills`, `projects`, `certs`, `clear`, `history`, and tab autocompletion.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Core** | Semantic HTML5, Vanilla JavaScript (ES6+ Modules) |
| **Styling** | Vanilla CSS3 (Custom Cyber HUD Design System, HSL Neon Tokens) |
| **3D Graphics** | [Three.js](https://threejs.org/) (WebGL Particle Fields, Torus Knot Wireframe) |
| **Hosting & CI/CD** | [Vercel](https://vercel.com/) with automated Git branch deployments |
| **Security** | CSP v3, HSTS Preload, X-Content-Type-Options, Referrer-Policy, Anti-XSS Sanitizer |
| **Visitor Analytics** | CountAPI + IP Deduplication Protocol |

---

## 📁 Repository Structure

```text
├── index.html              # Main portfolio HUD & interactive terminal
├── certificates.html       # Verified credentials center (20 records)
├── style.css               # Complete cyber HUD design system & responsive styling
├── main.js                 # 3D canvas, preloader, visitor counter, modals & CLI
├── vercel.json             # Security headers, CSP & route blocking rules
├── robots.txt              # Crawler access control & scraper shielding
├── my_resume.pdf           # Primary resume document
└── certificates/           # Verified certification PDFs & media assets
```

---

## 📬 Contact & Connect

* **Developer:** Jyotirmay Biswas
* **Domain:** [https://www.jyotirmaybiswas.tech/](https://www.jyotirmaybiswas.tech/)
* **GitHub:** [@Jyotirmay-ai](https://github.com/Jyotirmay-ai)
* **LinkedIn:** [Jyotirmay Biswas](https://www.linkedin.com/in/jyotirmay-biswas)
* **Email:** [jyotirmaybiswas.workspace@gmail.com](mailto:jyotirmaybiswas.workspace@gmail.com)
