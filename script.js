/* =========================================================
   SOL & ÁGUA — Interatividade (CORRIGIDO)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navegação ---------- */
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

  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) showPage(hash);

  menuToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
  });

  /* ---------- CORREÇÃO: Botão "Ir aos simuladores" ---------- */
  const btnSimuladores = document.querySelector('.hero .btn-ghost');
  if (btnSimuladores) {
    btnSimuladores.addEventListener('click', (e) => {
      e.preventDefault();
      showPage('simulador');
      history.replaceState(null, '', '#simulador');
    });
  }

  /* ---------- CORREÇÃO: Acessibilidade ---------- */
  let fontScale = 1;
  
  const btnFontPlus = document.getElementById('btn-font-plus');
  const btnFontMinus = document.getElementById('btn-font-minus');
  const btnContrast = document.getElementById('btn-contrast');
  const btnDyslexia = document.getElementById('btn-dyslexia');
  const btnReadingGuide = document.getElementById('btn-reading-guide');

  if (btnFontPlus) {
    btnFontPlus.addEventListener('click', () => {
      fontScale = Math.min(fontScale + 0.1, 1.6);
      document.documentElement.style.setProperty('--fonte-tamanho', (17 * fontScale) + 'px');
      console.log('Fonte aumentada:', fontScale);
    });
  }

  if (btnFontMinus) {
    btnFontMinus.addEventListener('click', () => {
      fontScale = Math.max(fontScale - 0.1, 0.8);
      document.documentElement.style.setProperty('--fonte-tamanho', (17 * fontScale) + 'px');
      console.log('Fonte diminuída:', fontScale);
    });
  }

  if (btnContrast) {
    btnContrast.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const isActive = document.body.classList.contains('high-contrast');
      console.log('Alto contraste:', isActive ? 'ATIVADO' : 'DESATIVADO');
    });
  }

  if (btnDyslexia) {
    btnDyslexia.addEventListener('click', () => {
      document.body.classList.toggle('dyslexia');
      const isActive = document.body.classList.contains('dyslexia');
      console.log('Fonte dislexia:', isActive ? 'ATIVADA' : 'DESATIVADA');
    });
  }

  let guide = document.createElement('div');
  guide.className = 'reading-guide';
  document.body.appendChild(guide);
  
  if (btnReadingGuide) {
    btnReadingGuide.addEventListener('click', () => {
      guide.classList.toggle('active');
      console.log('Régua de leitura:', guide.classList.contains('active') ? 'ATIVA' : 'INATIVA');
    });
  }

  document.addEventListener('mousemove', (e) => {
    if (guide.classList.contains('active')) {
      guide.style.top = (e.clientY - 18) + 'px';
    }
  });

  /* ========================================================
     SIMULADOR 1 — Aquecimento da piscina
     ======================================================== */
  const canvas1 = document.getElementById('sim-canvas');
  const ctx1 = canvas1.getContext('2d');

  const s1 = {
    intensidade: document.getElementById('intensidade'),
    angulo: document.getElementById('angulo'),
    volume: document.getElementById('volume'),
    tempInicial: document.getElementById('temp-inicial'),
    area: document.getElementById('area')
  };
  const l1 = {
    intensidade: document.getElementById('lbl-intensidade'),
    angulo: document.getElementById('lbl-angulo'),
    volume: document.getElementById('lbl-volume'),
    tempInicial: document.getElementById('lbl-temp'),
    area: document.getElementById('lbl-area')
  };
  const out1 = {
    temp: document.getElementById('out-temp'),
    tempo: document.getElementById('out-tempo'),
    pot: document.getElementById('out-pot')
  };

  let estado1 = { temp: 20, tempo: 0, rodando: false, intervalo: null };

  Object.keys(s1).forEach(key => {
    s1[key].addEventListener('input', () => {
      l1[key].textContent = s1[key].value;
      if (key === 'tempInicial' && !estado1.rodando) {
        estado1.temp = parseFloat(s1[key].value);
        atualizar1();
      }
    });
  });

  function calcPot1() {
    const I = parseFloat(s1.intensidade.value);
    const ang = parseFloat(s1.angulo.value) * Math.PI / 180;
    const A = parseFloat(s1.area.value);
    const alpha = 0.7;
    return I * A * Math.sin(ang) * alpha;
  }

  function passo1() {
    const P = calcPot1();
    const V = parseFloat(s1.volume.value);
    const m = V * 1e6;
    const c = 4.186;
    const perda = Math.max(0, (estado1.temp - 20)) * 10 * parseFloat(s1.area.value);
    const Pliq = P - perda;
    const deltaT = (Pliq * 60) / (m * c);
    estado1.temp += deltaT;
    estado1.tempo += 1;
    if (estado1.temp > 60) estado1.temp = 60;
    if (estado1.temp < 5) estado1.temp = 5;
    atualizar1();
  }

  function atualizar1() {
    out1.temp.textContent = estado1.temp.toFixed(1);
    out1.tempo.textContent = estado1.tempo.toFixed(0);
    out1.pot.textContent = calcPot1().toFixed(0);
  }

  function desenhar1() {
    const W = canvas1.width, H = canvas1.height;
    ctx1.clearRect(0, 0, W, H);

    const intens = parseFloat(s1.intensidade.value) / 1361;
    const grad = ctx1.createLinearGradient(0, 0, 0, H * 0.6);
    grad.addColorStop(0, `rgba(244, 228, 193, ${0.5 + 0.5*intens})`);
    grad.addColorStop(1, `rgba(212, 196, 160, 1)`);
    ctx1.fillStyle = grad;
    ctx1.fillRect(0, 0, W, H * 0.6);

    const raioSol = 28 + intens * 18;
    const angSol = (90 - parseFloat(s1.angulo.value)) * Math.PI / 180;
    const solX = W * 0.15 + Math.cos(angSol) * W * 0.3;
    const solY = 40 + Math.sin(angSol) * 80;
    const solGrad = ctx1.createRadialGradient(solX, solY, 4, solX, solY, raioSol);
    solGrad.addColorStop(0, '#ffffff');
    solGrad.addColorStop(0.4, '#fa983a');
    solGrad.addColorStop(1, '#e58e26');
    ctx1.fillStyle = solGrad;
    ctx1.beginPath();
    ctx1.arc(solX, solY, raioSol, 0, Math.PI * 2);
    ctx1.fill();

    ctx1.strokeStyle = 'rgba(229, 142, 38, 0.5)';
    ctx1.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      const x0 = solX + (i - 2.5) * 8;
      const y0 = solY + raioSol;
      const x1 = W * 0.2 + i * 70;
      const y1 = H * 0.6;
      ctx1.beginPath();
      ctx1.moveTo(x0, y0);
      ctx1.lineTo(x1, y1);
      ctx1.stroke();
    }

    const piscinaY = H * 0.6;
    const piscinaH = H * 0.38;
    ctx1.fillStyle = tempParaCor(estado1.temp);
    ctx1.fillRect(0, piscinaY, W, piscinaH);

    ctx1.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx1.lineWidth = 1.5;
    const t = Date.now() / 600;
    for (let i = 0; i < 3; i++) {
      ctx1.beginPath();
      for (let x = 0; x <= W; x += 4) {
        const y = piscinaY + 8 + i * 14 + Math.sin(x / 28 + t + i) * 2.5;
        if (x === 0) ctx1.moveTo(x, y);
        else ctx1.lineTo(x, y);
      }
      ctx1.stroke();
    }

    const termX = W - 36, termY = piscinaY + 18, termH = piscinaH - 36;
    ctx1.fillStyle = '#fff';
    ctx1.fillRect(termX - 6, termY, 12, termH);
    ctx1.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx1.lineWidth = 1;
    ctx1.strokeRect(termX - 6, termY, 12, termH);
    const nivel = Math.min(1, Math.max(0, (estado1.temp - 5) / 55));
    ctx1.fillStyle = '#c0392b';
    ctx1.fillRect(termX - 4, termY + termH * (1 - nivel), 8, termH * nivel);

    ctx1.fillStyle = '#fff';
    ctx1.font = '600 15px Inter, sans-serif';
    ctx1.textAlign = 'center';
    ctx1.fillText(estado1.temp.toFixed(1) + ' °C', W / 2, piscinaY + piscinaH / 2 + 5);
  }

  function tempParaCor(T) {
    const t = Math.min(1, Math.max(0, (T - 5) / 55));
    const r = Math.floor(40 + 180 * t);
    const g = Math.floor(80 + 40 * (1 - Math.abs(t - 0.5) * 2));
    const b = Math.floor(160 - 130 * t);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function animar1() {
    desenhar1();
    requestAnimationFrame(animar1);
  }
  animar1();

  document.getElementById('btn-play').addEventListener('click', () => {
    if (estado1.rodando) return;
    estado1.rodando = true;
    estado1.intervalo = setInterval(passo1, 500);
  });
  document.getElementById('btn-pause').addEventListener('click', () => {
    estado1.rodando = false;
    clearInterval(estado1.intervalo);
  });
  document.getElementById('btn-reset').addEventListener('click', () => {
    estado1.rodando = false;
    clearInterval(estado1.intervalo);
    estado1.temp = parseFloat(s1.tempInicial.value);
    estado1.tempo = 0;
    atualizar1();
  });
  atualizar1();

  /* ========================================================
     SIMULADOR 2 — Penetração da radiação
     ======================================================== */
  const canvas2 = document.getElementById('sim2-canvas');
  const ctx2 = canvas2.getContext('2d');

  const s2 = {
    uv: document.getElementById('uv-int'),
    vis: document.getElementById('vis-int'),
    ir: document.getElementById('ir-int'),
    turb: document.getElementById('turbidez')
  };
  const l2 = {
    uv: document.getElementById('lbl-uv'),
    vis: document.getElementById('lbl-vis'),
    ir: document.getElementById('lbl-ir'),
    turb: document.getElementById('lbl-turb')
  };
  const out2 = {
    surf: document.getElementById('out-surf'),
    p50: document.getElementById('out-50'),
    p2m: document.getElementById('out-2m'),
    total: document.getElementById('out-total')
  };

  const muBase = { uv: 0.8, vis: 0.15, ir: 8.0 };

  Object.keys(s2).forEach(key => {
    s2[key].addEventListener('input', () => {
      l2[key].textContent = s2[key].value;
      atualizar2();
    });
  });

  function atualizar2() {
    const I_uv = parseFloat(s2.uv.value);
    const I_vis = parseFloat(s2.vis.value);
    const I_ir = parseFloat(s2.ir.value);
    const turb = parseFloat(s2.turb.value);

    const mu = {
      uv: muBase.uv * turb,
      vis: muBase.vis * turb,
      ir: muBase.ir * turb
    };

    const z1 = 0.1;
    const z2 = 0.5;
    const z3 = 2.0;

    const I_surf = (I_uv * (1 - Math.exp(-mu.uv * z1)) +
                    I_vis * (1 - Math.exp(-mu.vis * z1)) +
                    I_ir * (1 - Math.exp(-mu.ir * z1)));

    const I_50 = (I_uv * Math.exp(-mu.uv * z2) * (1 - Math.exp(-mu.uv * 0.1)) +
                  I_vis * Math.exp(-mu.vis * z2) * (1 - Math.exp(-mu.vis * 0.1)) +
                  I_ir * Math.exp(-mu.ir * z2) * (1 - Math.exp(-mu.ir * 0.1)));

    const I_2m = (I_uv * Math.exp(-mu.uv * z3) * (1 - Math.exp(-mu.uv * 0.1)) +
                  I_vis * Math.exp(-mu.vis * z3) * (1 - Math.exp(-mu.vis * 0.1)) +
                  I_ir * Math.exp(-mu.ir * z3) * (1 - Math.exp(-mu.ir * 0.1)));

    const I_total = (I_uv * (1 - Math.exp(-mu.uv * 3)) +
                     I_vis * (1 - Math.exp(-mu.vis * 3)) +
                     I_ir * (1 - Math.exp(-mu.ir * 3)));

    out2.surf.textContent = I_surf.toFixed(0);
    out2.p50.textContent = I_50.toFixed(1);
    out2.p2m.textContent = I_2m.toFixed(2);
    out2.total.textContent = I_total.toFixed(0);

    desenhar2(mu, { uv: I_uv, vis: I_vis, ir: I_ir });
  }

  function desenhar2(mu, I) {
    const W = canvas2.width, H = canvas2.height;
    ctx2.clearRect(0, 0, W, H);

    const gradCeu = ctx2.createLinearGradient(0, 0, 0, H * 0.15);
    gradCeu.addColorStop(0, '#f4e4c1');
    gradCeu.addColorStop(1, '#d4c4a0');
    ctx2.fillStyle = gradCeu;
    ctx2.fillRect(0, 0, W, H * 0.15);

    const supY = H * 0.15;
    const aguaH = H * 0.85;

    const gradAgua = ctx2.createLinearGradient(0, supY, 0, H);
    gradAgua.addColorStop(0, 'rgba(60, 99, 130, 0.55)');
    gradAgua.addColorStop(0.3, 'rgba(40, 80, 110, 0.75)');
    gradAgua.addColorStop(1, 'rgba(10, 40, 60, 0.95)');
    ctx2.fillStyle = gradAgua;
    ctx2.fillRect(0, supY, W, aguaH);

    ctx2.fillStyle = 'rgba(255,255,255,0.7)';
    ctx2.font = '500 11px Inter, sans-serif';
    ctx2.textAlign = 'left';
    const profundidades = [0, 0.5, 1, 1.5, 2, 2.5, 3];
    profundidades.forEach(z => {
      const y = supY + (z / 3) * aguaH;
      ctx2.fillText(z.toFixed(1) + ' m', 10, y + 4);
      ctx2.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx2.beginPath();
      ctx2.moveTo(40, y);
      ctx2.lineTo(W - 10, y);
      ctx2.stroke();
    });

    const faixas = [
      { nome: 'UV', cor: 'rgba(142, 68, 173, ', I: I.uv, mu: mu.uv },
      { nome: 'Vis', cor: 'rgba(46, 204, 113, ', I: I.vis, mu: mu.vis },
      { nome: 'IV', cor: 'rgba(231, 76, 60, ', I: I.ir, mu: mu.ir }
    ];

    const larguraFaixa = 60;
    const xInicio = 80;

    faixas.forEach((fx, idx) => {
      const x = xInicio + idx * (larguraFaixa + 60);
      const maxI = Math.max(I.uv, I.vis, I.ir, 1);
      const intensRel = fx.I / maxI;

      ctx2.fillStyle = fx.cor + '0.95)';
      ctx2.font = '600 13px Inter, sans-serif';
      ctx2.textAlign = 'center';
      ctx2.fillText(fx.nome, x + larguraFaixa/2, supY - 8);
      ctx2.font = '400 10px Inter, sans-serif';
      ctx2.fillStyle = 'rgba(255,255,255,0.7)';
      ctx2.fillText(fx.I + ' W/m²', x + larguraFaixa/2, supY - 22);

      const passos = 40;
      for (let i = 0; i < passos; i++) {
        const z1 = (i / passos) * 3;
        const z2 = ((i + 1) / passos) * 3;
        const I_z1 = fx.I * Math.exp(-fx.mu * z1);
        const I_z2 = fx.I * Math.exp(-fx.mu * z2);
        const I_media = (I_z1 + I_z2) / 2;
        const alpha = Math.min(0.9, (I_media / 800) * 0.9);

        const y1 = supY + (z1 / 3) * aguaH;
        const y2 = supY + (z2 / 3) * aguaH;

        ctx2.fillStyle = fx.cor + alpha + ')';
        ctx2.fillRect(x, y1, larguraFaixa, y2 - y1);
      }

      ctx2.strokeStyle = fx.cor + '0.6)';
      ctx2.lineWidth = 1;
      ctx2.strokeRect(x, supY, larguraFaixa, aguaH);
    });

    ctx2.fillStyle = 'rgba(255,255,255,0.85)';
    ctx2.font = '500 11px Inter, sans-serif';
    ctx2.textAlign = 'left';
    ctx2.fillText('Intensidade da radiação em cada profundidade (Beer-Lambert)', 80, H - 10);
  }

  document.getElementById('btn2-reset').addEventListener('click', () => {
    s2.uv.value = 40; l2.uv.textContent = '40';
    s2.vis.value = 470; l2.vis.textContent = '470';
    s2.ir.value = 490; l2.ir.textContent = '490';
    s2.turb.value = 1; l2.turb.textContent = '1';
    atualizar2();
  });

  atualizar2();

  /* ---------- Teclado ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navList.classList.contains('open')) {
      navList.classList.remove('open');
    }
  });

  /* ---------- Debug: verificar se botões existem ---------- */
  console.log('Botões de acessibilidade encontrados:');
  console.log('- Contraste:', !!btnContrast);
  console.log('- Dislexia:', !!btnDyslexia);
  console.log('- Fonte +:', !!btnFontPlus);
  console.log('- Fonte -:', !!btnFontMinus);
  console.log('- Régua:', !!btnReadingGuide);

});
