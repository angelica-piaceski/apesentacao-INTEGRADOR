/* ============================================
   NAVEGAÇÃO ENTRE SEÇÕES (SPA)
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');
  const menuLinks = document.querySelectorAll('[data-section]');

  function showSection(id) {
    sections.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Atualiza menu ativo
      document.querySelectorAll('.menu-list a').forEach(a => {
        a.classList.toggle('active', a.dataset.section === id);
      });
    }
  }

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.dataset.section;
      showSection(id);
      history.pushState({ section: id }, '', '#' + id);
      // Fecha menu mobile
      document.getElementById('menu-principal').classList.remove('open');
      document.getElementById('menu-toggle').setAttribute('aria-expanded', 'false');
    });
  });

  // Suporte ao botão voltar/avançar
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.section) showSection(e.state.section);
  });

  // Carrega seção baseada no hash inicial
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById(initialHash)) {
    showSection(initialHash);
  }

  // Menu mobile
  const menuToggle = document.getElementById('menu-toggle');
  const menuList = document.getElementById('menu-principal');
  menuToggle.addEventListener('click', () => {
    const isOpen = menuList.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  /* ============================================
     FERRAMENTAS DE ACESSIBILIDADE
     ============================================ */
  const body = document.body;
  let fontSize = 16;

  document.getElementById('btn-contrast').addEventListener('click', (e) => {
    body.classList.toggle('high-contrast');
    e.target.setAttribute('aria-pressed', body.classList.contains('high-contrast'));
  });

  document.getElementById('btn-font-up').addEventListener('click', () => {
    if (fontSize < 24) {
      fontSize += 2;
      document.documentElement.style.fontSize = fontSize + 'px';
    }
  });

  document.getElementById('btn-font-down').addEventListener('click', () => {
    if (fontSize > 12) {
      fontSize -= 2;
      document.documentElement.style.fontSize = fontSize + 'px';
    }
  });

  document.getElementById('btn-dyslexic').addEventListener('click', (e) => {
    body.classList.toggle('dyslexic-font');
    e.target.setAttribute('aria-pressed', body.classList.contains('dyslexic-font'));
  });

  document.getElementById('btn-readable').addEventListener('click', (e) => {
    body.classList.toggle('readable-mode');
    e.target.setAttribute('aria-pressed', body.classList.contains('readable-mode'));
  });

  /* ============================================
     ESPECTRO INTERATIVO
     ============================================ */
  const spectrumInfo = document.getElementById('spectrum-info');
  const spectrumData = {
    uv: {
      title: '☢️ Ultravioleta (UV)',
      text: 'Comprimento de onda: 100–400 nm. Alta energia. É parcialmente absorvida pela camada de ozônio. Atinge a superfície da piscina e pode degradar materiais plásticos e cloro da água. Representa cerca de 7% da energia solar que chega à Terra.'
    },
    vis: {
      title: '🌈 Visível',
      text: 'Comprimento de onda: 400–700 nm. Energia média. É a faixa que nossos olhos enxergam. Consegue penetrar alguns metros na água antes de ser totalmente absorvida. Representa cerca de 43% da energia solar que atinge a superfície.'
    },
    ir: {
      title: '🔥 Infravermelho (IV)',
      text: 'Comprimento de onda: 700 nm – 1 mm. Baixa energia por fóton, mas alta quantidade. É absorvido nos primeiros milímetros da água, aquecendo a superfície diretamente. Representa cerca de 49% da energia solar – o principal responsável pelo aquecimento da piscina!'
    }
  };

  document.querySelectorAll('.spectrum-band').forEach(band => {
    const showInfo = () => {
      const type = band.dataset.type;
      const data = spectrumData[type];
      spectrumInfo.innerHTML = `<h4>${data.title}</h4><p>${data.text}</p>`;
    };
    band.addEventListener('click', showInfo);
    band.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showInfo();
      }
    });
  });

  /* ============================================
     SIMULADOR DE AQUECIMENTO DA PISCINA
     ============================================ */
  const sliders = {
    intensity: document.getElementById('slider-intensity'),
    cover: document.getElementById('slider-cover'),
    depth: document.getElementById('slider-depth'),
    time: document.getElementById('slider-time'),
    tempInit: document.getElementById('slider-temp-init')
  };
  const values = {
    intensity: document.getElementById('val-intensity'),
    cover: document.getElementById('val-cover'),
    depth: document.getElementById('val-depth'),
    time: document.getElementById('val-time'),
    tempInit: document.getElementById('val-temp-init')
  };

  // Parâmetros fixos da piscina (exemplo didático)
  const AREA_PISCINA = 25; // m²
  const VOLUME_PISCINA = 30; // m³ (30.000 L)
  const MASSA_AGUA = VOLUME_PISCINA * 1000 * 1000; // gramas
  const C_AGUA = 4.186; // J/(g·°C)
  const EFICIENCIA_ABSORCAO = 0.7; // 70% da radiação é efetivamente absorvida

  function atualizarSimulador() {
    const I = parseFloat(sliders.intensity.value);     // W/m²
    const C = parseFloat(sliders.cover.value) / 100;   // fração coberta
    const D = parseFloat(sliders.depth.value);         // m
    const T = parseFloat(sliders.time.value);          // h
    const Ti = parseFloat(sliders.tempInit.value);     // °C

    // Atualiza labels
    values.intensity.textContent = I;
    values.cover.textContent = Math.round(C * 100);
    values.depth.textContent = D.toFixed(1);
    values.time.textContent = T;
    values.tempInit.textContent = Ti;

    // Cálculos
    const areaEfetiva = AREA_PISCINA * (1 - C); // área exposta ao sol
    const potencia = I * areaEfetiva; // W
    const energiaJ = potencia * T * 3600 * EFICIENCIA_ABSORCAO; // Joules
    const energiaKJ = energiaJ / 1000;

    // Massa real depende da profundidade (ajuste proporcional)
    const massaReal = (D / 1.2) * MASSA_AGUA;
    const deltaT = energiaJ / (massaReal * C_AGUA);
    const Tf = Ti + deltaT;

    // Atualiza resultados
    document.getElementById('result-temp').textContent = Tf.toFixed(1);
    document.getElementById('result-delta').textContent = (deltaT >= 0 ? '+' : '') + deltaT.toFixed(1);
    document.getElementById('result-energy').textContent = Math.round(energiaKJ).toLocaleString('pt-BR');
    document.getElementById('pool-temp').textContent = Tf.toFixed(1) + ' °C';

    // Cor da piscina baseada na temperatura
    const poolWater = document.getElementById('pool-water');
    const ratio = Math.min(Math.max((Tf - 15) / 25, 0), 1);
    const r = Math.round(0 + ratio * 230);
    const g = Math.round(180 - ratio * 100);
    const b = Math.round(216 - ratio * 150);
    poolWater.style.background = `linear-gradient(180deg, rgba(${r},${g},${b},0.7), rgba(${Math.max(r-50,0)},${Math.max(g-50,0)},${Math.max(b-50,0)},0.9))`;

    // Explicação didática
    let explanation = '';
    if (deltaT < 1) {
      explanation = '🌥️ Aquecimento pequeno. Tente aumentar a intensidade solar ou reduzir a cobertura.';
    } else if (deltaT < 4) {
      explanation = '☀️ Aquecimento moderado – típico de um dia ensolarado sem cobertura.';
    } else if (deltaT < 7) {
      explanation = '🔥 Aquecimento significativo! A piscina ficará bem agradável.';
    } else {
      explanation = '🌡️ Aquecimento intenso – atenção para não passar da temperatura ideal (28–30 °C).';
    }
    if (C > 0.5) {
      explanation += ' A cobertura está reduzindo muito a área exposta ao sol.';
    }
    document.getElementById('result-explanation').textContent = explanation;
  }

  // Eventos dos sliders
  Object.values(sliders).forEach(slider => {
    slider.addEventListener('input', atualizarSimulador);
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    sliders.intensity.value = 800;
    sliders.cover.value = 0;
    sliders.depth.value = 1.2;
    sliders.time.value = 6;
    sliders.tempInit.value = 22;
    atualizarSimulador();
  });

  // Inicializa simulador
  atualizarSimulador();

  /* ============================================
     ANIMAÇÃO: PROPAGAÇÃO SOL → TERRA
     ============================================ */
  const canvas = document.getElementById('canvas-propagation');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let frame = 0;

    function drawPropagation() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Fundo espacial
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#03045e');
      grad.addColorStop(0.5, '#0077b6');
      grad.addColorStop(1, '#90e0ef');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Sol
      ctx.fillStyle = '#ffd60a';
      ctx.beginPath();
      ctx.arc(60, h / 2, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff9e00';
      ctx.beginPath();
      ctx.arc(60, h / 2, 30, 0, Math.PI * 2);
      ctx.fill();

      // Terra
      ctx.fillStyle = '#06a77d';
      ctx.beginPath();
      ctx.arc(w - 60, h / 2, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0077b6';
      ctx.beginPath();
      ctx.arc(w - 70, h / 2 - 5, 15, 0, Math.PI * 2);
      ctx.fill();

      // Ondas eletromagnéticas
      for (let i = 0; i < 8; i++) {
        const x = 120 + ((frame + i * 30) % (w - 200));
        const alpha = 0.3 + 0.5 * Math.sin((frame + i * 10) * 0.1);
        ctx.strokeStyle = `rgba(255, 214, 10, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let y = 0; y < h; y += 2) {
          const waveX = x + Math.sin((y + frame) * 0.1) * 10;
          if (y === 0) ctx.moveTo(waveX, y);
          else ctx.lineTo(waveX, y);
        }
        ctx.stroke();
      }

      // Rótulos
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SOL', 60, h - 15);
      ctx.fillText('TERRA', w - 60, h - 15);
      ctx.fillText('Radiação eletromagnética →', w / 2, 25);

      frame++;
      requestAnimationFrame(drawPropagation);
    }
    drawPropagation();
  }

  /* ============================================
     NAVEGAÇÃO POR TECLADO (atalhos)
     ============================================ */
  document.addEventListener('keydown', (e) => {
    // Alt + 1..8 navega entre seções
    if (e.altKey && !isNaN(e.key) && e.key >= '1' && e.key <= '8') {
      e.preventDefault();
      const ids = ['home', 'sol', 'espectro', 'simulador', 'piscina', 'robotica', 'sustentabilidade', 'mapa'];
      const target = ids[parseInt(e.key) - 1];
      if (target) showSection(target);
    }
  });
});
