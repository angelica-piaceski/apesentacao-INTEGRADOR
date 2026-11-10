SOL & ÁGUA — Interatividade
   - Navegação SPA
   - Simulador 1: Aquecimento da piscina
   - Simulador 2: Penetração da radiação (Beer-Lambert)
   - Acessibilidade
   SOL & ÁGUA — Interatividade (CORRIGIDO)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
@@ -37,29 +33,68 @@ document.addEventListener('DOMContentLoaded', () => {
    menuToggle.setAttribute('aria-expanded', open);
  });

  /* ---------- Acessibilidade ---------- */
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
  document.getElementById('btn-font-plus').addEventListener('click', () => {
    fontScale = Math.min(fontScale + 0.1, 1.6);
    document.documentElement.style.setProperty('--fonte-tamanho', (17 * fontScale) + 'px');
  });
  document.getElementById('btn-font-minus').addEventListener('click', () => {
    fontScale = Math.max(fontScale - 0.1, 0.8);
    document.documentElement.style.setProperty('--fonte-tamanho', (17 * fontScale) + 'px');
  });
  document.getElementById('btn-contrast').addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
  });
  document.getElementById('btn-dyslexia').addEventListener('click', () => {
    document.body.classList.toggle('dyslexia');
  });
  
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
  document.getElementById('btn-reading-guide').addEventListener('click', () => {
    guide.classList.toggle('active');
  });
  
  if (btnReadingGuide) {
    btnReadingGuide.addEventListener('click', () => {
      guide.classList.toggle('active');
      console.log('Régua de leitura:', guide.classList.contains('active') ? 'ATIVA' : 'INATIVA');
    });
  }

  document.addEventListener('mousemove', (e) => {
    if (guide.classList.contains('active')) {
      guide.style.top = (e.clientY - 18) + 'px';
@@ -115,7 +150,7 @@ document.addEventListener('DOMContentLoaded', () => {
  function passo1() {
    const P = calcPot1();
    const V = parseFloat(s1.volume.value);
    const m = V * 1e6; // g
    const m = V * 1e6;
    const c = 4.186;
    const perda = Math.max(0, (estado1.temp - 20)) * 10 * parseFloat(s1.area.value);
    const Pliq = P - perda;
@@ -137,15 +172,13 @@ document.addEventListener('DOMContentLoaded', () => {
    const W = canvas1.width, H = canvas1.height;
    ctx1.clearRect(0, 0, W, H);

    // Céu
    const intens = parseFloat(s1.intensidade.value) / 1361;
    const grad = ctx1.createLinearGradient(0, 0, 0, H * 0.6);
    grad.addColorStop(0, `rgba(244, 228, 193, ${0.5 + 0.5*intens})`);
    grad.addColorStop(1, `rgba(212, 196, 160, 1)`);
    ctx1.fillStyle = grad;
    ctx1.fillRect(0, 0, W, H * 0.6);

    // Sol
    const raioSol = 28 + intens * 18;
    const angSol = (90 - parseFloat(s1.angulo.value)) * Math.PI / 180;
    const solX = W * 0.15 + Math.cos(angSol) * W * 0.3;
@@ -159,7 +192,6 @@ document.addEventListener('DOMContentLoaded', () => {
    ctx1.arc(solX, solY, raioSol, 0, Math.PI * 2);
    ctx1.fill();

    // Raios
    ctx1.strokeStyle = 'rgba(229, 142, 38, 0.5)';
    ctx1.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
@@ -173,13 +205,11 @@ document.addEventListener('DOMContentLoaded', () => {
      ctx1.stroke();
    }

    // Piscina
    const piscinaY = H * 0.6;
    const piscinaH = H * 0.38;
    ctx1.fillStyle = tempParaCor(estado1.temp);
    ctx1.fillRect(0, piscinaY, W, piscinaH);

    // Ondas
    ctx1.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx1.lineWidth = 1.5;
    const t = Date.now() / 600;
@@ -193,7 +223,6 @@ document.addEventListener('DOMContentLoaded', () => {
      ctx1.stroke();
    }

    // Termômetro
    const termX = W - 36, termY = piscinaY + 18, termH = piscinaH - 36;
    ctx1.fillStyle = '#fff';
    ctx1.fillRect(termX - 6, termY, 12, termH);
@@ -204,7 +233,6 @@ document.addEventListener('DOMContentLoaded', () => {
    ctx1.fillStyle = '#c0392b';
    ctx1.fillRect(termX - 4, termY + termH * (1 - nivel), 8, termH * nivel);

    // Label
    ctx1.fillStyle = '#fff';
    ctx1.font = '600 15px Inter, sans-serif';
    ctx1.textAlign = 'center';
@@ -244,7 +272,7 @@ document.addEventListener('DOMContentLoaded', () => {
  atualizar1();

  /* ========================================================
     SIMULADOR 2 — Penetração da radiação (Beer-Lambert)
     SIMULADOR 2 — Penetração da radiação
     ======================================================== */
  const canvas2 = document.getElementById('sim2-canvas');
  const ctx2 = canvas2.getContext('2d');
@@ -268,8 +296,6 @@ document.addEventListener('DOMContentLoaded', () => {
    total: document.getElementById('out-total')
  };

  // Coeficientes de absorção (1/m) — água limpa
  // IR é absorvido em cm, UV em dezenas de cm, visível em metros
  const muBase = { uv: 0.8, vis: 0.15, ir: 8.0 };

  Object.keys(s2).forEach(key => {
@@ -291,10 +317,9 @@ document.addEventListener('DOMContentLoaded', () => {
      ir: muBase.ir * turb
    };

    // Profundidades em metros
    const z1 = 0.1;   // 10 cm
    const z2 = 0.5;   // 50 cm
    const z3 = 2.0;   // 2 m
    const z1 = 0.1;
    const z2 = 0.5;
    const z3 = 2.0;

    const I_surf = (I_uv * (1 - Math.exp(-mu.uv * z1)) +
                    I_vis * (1 - Math.exp(-mu.vis * z1)) +
@@ -324,26 +349,22 @@ document.addEventListener('DOMContentLoaded', () => {
    const W = canvas2.width, H = canvas2.height;
    ctx2.clearRect(0, 0, W, H);

    // Céu
    const gradCeu = ctx2.createLinearGradient(0, 0, 0, H * 0.15);
    gradCeu.addColorStop(0, '#f4e4c1');
    gradCeu.addColorStop(1, '#d4c4a0');
    ctx2.fillStyle = gradCeu;
    ctx2.fillRect(0, 0, W, H * 0.15);

    // Superfície da água
    const supY = H * 0.15;
    const aguaH = H * 0.85;

    // Gradiente da água conforme absorção
    const gradAgua = ctx2.createLinearGradient(0, supY, 0, H);
    gradAgua.addColorStop(0, 'rgba(60, 99, 130, 0.55)');
    gradAgua.addColorStop(0.3, 'rgba(40, 80, 110, 0.75)');
    gradAgua.addColorStop(1, 'rgba(10, 40, 60, 0.95)');
    ctx2.fillStyle = gradAgua;
    ctx2.fillRect(0, supY, W, aguaH);

    // Escala de profundidade (lateral)
    ctx2.fillStyle = 'rgba(255,255,255,0.7)';
    ctx2.font = '500 11px Inter, sans-serif';
    ctx2.textAlign = 'left';
@@ -358,7 +379,6 @@ document.addEventListener('DOMContentLoaded', () => {
      ctx2.stroke();
    });

    // Desenhar feixes de cada faixa
    const faixas = [
      { nome: 'UV', cor: 'rgba(142, 68, 173, ', I: I.uv, mu: mu.uv },
      { nome: 'Vis', cor: 'rgba(46, 204, 113, ', I: I.vis, mu: mu.vis },
@@ -373,7 +393,6 @@ document.addEventListener('DOMContentLoaded', () => {
      const maxI = Math.max(I.uv, I.vis, I.ir, 1);
      const intensRel = fx.I / maxI;

      // Label no topo
      ctx2.fillStyle = fx.cor + '0.95)';
      ctx2.font = '600 13px Inter, sans-serif';
      ctx2.textAlign = 'center';
@@ -382,7 +401,6 @@ document.addEventListener('DOMContentLoaded', () => {
      ctx2.fillStyle = 'rgba(255,255,255,0.7)';
      ctx2.fillText(fx.I + ' W/m²', x + larguraFaixa/2, supY - 22);

      // Desenhar a atenuação como barra vertical com gradiente
      const passos = 40;
      for (let i = 0; i < passos; i++) {
        const z1 = (i / passos) * 3;
@@ -399,13 +417,11 @@ document.addEventListener('DOMContentLoaded', () => {
        ctx2.fillRect(x, y1, larguraFaixa, y2 - y1);
      }

      // Borda
      ctx2.strokeStyle = fx.cor + '0.6)';
      ctx2.lineWidth = 1;
      ctx2.strokeRect(x, supY, larguraFaixa, aguaH);
    });

    // Legenda inferior
    ctx2.fillStyle = 'rgba(255,255,255,0.85)';
    ctx2.font = '500 11px Inter, sans-serif';
    ctx2.textAlign = 'left';
@@ -429,4 +445,12 @@ document.addEventListener('DOMContentLoaded', () => {
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
