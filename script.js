/* =========================================================
   SOL & ÁGUA — Interatividade
   - Navegação SPA entre páginas
   - Simulador de aquecimento (canvas)
   - Acessibilidade (fonte, contraste, dislexia, régua)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navegação entre páginas ---------- */
  const navLinks = document.querySelectorAll('.nav-link');
  const pages = document.querySelectorAll('.page');
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');

  function showPage(pageId) {
    pages.forEach(p => p.classList.toggle('active', p.id === pageId));
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.page === pageId));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (navList.classList.contains('open')) navList.classList.remove('open');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(link.dataset.page);
      history.replaceState(null, '', '#' + link.dataset.page);
    });
  });

  // Carregar página a partir da URL
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) showPage(hash);

  // Menu mobile
  menuToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
  });

  /* ---------- Acessibilidade ---------- */
  let fontScale = 1;
  const body = document.body;

  document.getElementById('btn-font-plus').addEventListener('click', () => {
    fontScale = Math.min(fontScale + 0.1, 1.6);
    document.documentElement.style.setProperty('--fonte-tamanho', (17 * fontScale) + 'px');
  });
  document.getElementById('btn-font-minus').addEventListener('click', () => {
    fontScale = Math.max(fontScale - 0.1, 0.8);
    document.documentElement.style.setProperty('--fonte-tamanho', (17 * fontScale) + 'px');
  });
  document.getElementById('btn-contrast').addEventListener('click', () => {
    body.classList.toggle('high-contrast');
  });
  document.getElementById('btn-dyslexia').addEventListener('click', () => {
    body.classList.toggle('dyslexia');
  });

  // Régua de leitura
  let guide = document.createElement('div');
  guide.className = 'reading-guide';
  document.body.appendChild(guide);
  document.getElementById('btn-reading-guide').addEventListener('click', () => {
    guide.classList.toggle('active');
  });
  document.addEventListener('mousemove', (e) => {
    if (guide.classList.contains('active')) {
      guide.style.top = (e.clientY - 20) + 'px';
    }
  });

  /* ---------- Simulador de Aquecimento ---------- */
  const canvas = document.getElementById('sim-canvas');
  const ctx = canvas.getContext('2d');

  const sliders = {
    intensidade: document.getElementById('intensidade'),
    angulo: document.getElementById('angulo'),
    volume: document.getElementById('volume'),
    tempInicial: document.getElementById('temp-inicial'),
    area: document.getElementById('area')
  };
  const labels = {
    intensidade: document.getElementById('lbl-intensidade'),
    angulo: document.getElementById('lbl-angulo'),
    volume: document.getElementById('lbl-volume'),
    tempInicial: document.getElementById('lbl-temp'),
    area: document.getElementById('lbl-area')
  };
  const outTemp = document.getElementById('out-temp');
  const outTempo = document.getElementById('out-tempo');
  const outPot = document.getElementById('out-pot');

  let estado = {
    temp: 20,
    tempo: 0,       // em minutos
    rodando: false,
    intervalo: null
  };

  // Atualizar labels dos sliders
  Object.keys(sliders).forEach(key => {
    sliders[key].addEventListener('input', () => {
      const lblKey = key === 'tempInicial' ? 'tempInicial' : key;
      labels[lblKey].textContent = sliders[key].value;
      if (key === 'tempInicial' && !estado.rodando) {
        estado.temp = parseFloat(sliders[key].value);
        atualizarReadout();
        desenhar();
      }
    });
  });

  function calcularPotencia() {
    const I = parseFloat(sliders.intensidade.value);      // W/m²
    const ang = parseFloat(sliders.angulo.value) * Math.PI / 180;
    const A = parseFloat(sliders.area.value);             // m²
    const alpha = 0.7;                                     // absorvividade da água
    return I * A * Math.cos(Math.PI/2 - ang) * alpha;     // cos do ângulo de incidência
  }

  function passo() {
    const P = calcularPotencia();                          // W (J/s)
    const V = parseFloat(sliders.volume.value);            // m³
    const m = V * 1000 * 1000;                             // g (1 m³ = 10⁶ g)
    const c = 4.186;                                       // J/(g·°C)

    // Perdas por convecção/evaporação (aproximação): ~10 W/m² por °C acima de 20
    const perda = Math.max(0, (estado.temp - 20)) * 10 * parseFloat(sliders.area.value);
    const Pliq = P - perda;

    const dt = 1;                                          // 1 minuto por passo
    const deltaT = (Pliq * dt * 60) / (m * c);             // °C por minuto

    estado.temp += deltaT;
    estado.tempo += dt;

    // Limites físicos
    if (estado.temp > 60) estado.temp = 60;
    if (estado.temp < 5) estado.temp = 5;

    atualizarReadout();
    desenhar();
  }

  function atualizarReadout() {
    outTemp.textContent = estado.temp.toFixed(1);
    outTempo.textContent = estado.tempo.toFixed(0);
    outPot.textContent = calcularPotencia().toFixed(0);
  }

  /* ---------- Desenho do canvas ---------- */
  function desenhar() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Céu (gradiente conforme intensidade)
    const intens = parseFloat(sliders.intensidade.value) / 1361;
    const grad = ctx.createLinearGradient(0, 0, 0, H * 0.6);
    grad.addColorStop(0, `rgba(255, ${180 + 75*intens}, 100, 1)`);
    grad.addColorStop(1, `rgba(135, 206, 235, 1)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H * 0.6);

    // Sol
    const raioSol = 30 + intens * 20;
    const angSol = (90 - parseFloat(sliders.angulo.value)) * Math.PI / 180;
    const solX = W * 0.15 + Math.cos(angSol) * W * 0.3;
    const solY = 40 + Math.sin(angSol) * 80;
    const solGrad = ctx.createRadialGradient(solX, solY, 5, solX, solY, raioSol);
    solGrad.addColorStop(0, '#fff700');
    solGrad.addColorStop(1, '#fb8500');
    ctx.fillStyle = solGrad;
    ctx.beginPath();
    ctx.arc(solX, solY, raioSol, 0, Math.PI * 2);
    ctx.fill();

    // Raios solares (setas até a piscina)
    ctx.strokeStyle = 'rgba(255, 200, 0, 0.7)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const x0 = solX + (i - 2) * 10;
      const y0 = solY + raioSol;
      const x1 = W * 0.3 + i * 60;
      const y1 = H * 0.6;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }

    // Piscina
    const piscinaY = H * 0.6;
    const piscinaH = H * 0.35;
    const corAgua = temperaturaParaCor(estado.temp);
    ctx.fillStyle = corAgua;
    ctx.fillRect(0, piscinaY, W, piscinaH);

    // Ondas
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    const t = Date.now() / 500;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 5) {
        const y = piscinaY + 10 + i * 15 + Math.sin(x / 30 + t + i) * 3;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Termômetro lateral
    const termX = W - 40, termY = piscinaY + 20, termH = piscinaH - 40;
    ctx.fillStyle = '#fff';
    ctx.fillRect(termX - 8, termY, 16, termH);
    ctx.strokeStyle = '#333';
    ctx.strokeRect(termX - 8, termY, 16, termH);
    const nivel = Math.min(1, Math.max(0, (estado.temp - 5) / 55));
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(termX - 6, termY + termH * (1 - nivel), 12, termH * nivel);

    // Label da temperatura
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(estado.temp.toFixed(1) + '°C', W / 2, piscinaY + piscinaH / 2);
  }

  function temperaturaParaCor(T) {
    // De azul frio (5°C) a vermelho quente (60°C)
    const t = Math.min(1, Math.max(0, (T - 5) / 55));
    const r = Math.floor(30 + 225 * t);
    const g = Math.floor(100 + 50 * (1 - Math.abs(t - 0.5) * 2));
    const b = Math.floor(200 - 180 * t);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Animação contínua das ondas
  function animar() {
    desenhar();
    requestAnimationFrame(animar);
  }
  animar();

  // Botões do simulador
  document.getElementById('btn-play').addEventListener('click', () => {
    if (estado.rodando) return;
    estado.rodando = true;
    estado.intervalo = setInterval(passo, 500);
  });
  document.getElementById('btn-pause').addEventListener('click', () => {
    estado.rodando = false;
    clearInterval(estado.intervalo);
  });
  document.getElementById('btn-reset').addEventListener('click', () => {
    estado.rodando = false;
    clearInterval(estado.intervalo);
    estado.temp = parseFloat(sliders.tempInicial.value);
    estado.tempo = 0;
    atualizarReadout();
    desenhar();
  });

  atualizarReadout();
  desenhar();

  /* ---------- Navegação por teclado (Enter/Esc) ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (navList.classList.contains('open')) navList.classList.remove('open');
    }
  });

});
