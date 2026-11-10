// ============================================
// GARANTE QUE TUDO CARREGOU ANTES DE EXECUTAR
// ============================================
document.addEventListener('DOMContentLoaded', function() {

  // ============================================
  // NAVEGAÇÃO ENTRE SEÇÕES
  // ============================================
  var paginas = document.querySelectorAll('.page');
  var linksMenu = document.querySelectorAll('[data-target]');

  function mostrarPagina(id) {
    paginas.forEach(function(p) { p.classList.remove('active'); });
    var alvo = document.getElementById(id);
    if (alvo) {
      alvo.classList.add('active');
      // Atualiza menu ativo
      document.querySelectorAll('.menu-list a').forEach(function(a) {
        if (a.getAttribute('data-target') === id) {
          a.classList.add('ativo');
        } else {
          a.classList.remove('ativo');
        }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  linksMenu.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var id = this.getAttribute('data-target');
      mostrarPagina(id);
      // Fecha menu mobile
      var menu = document.getElementById('menu-list');
      if (menu) menu.classList.remove('aberto');
    });
  });

  // Menu mobile
  var menuBtn = document.getElementById('menu-btn');
  var menuList = document.getElementById('menu-list');
  if (menuBtn && menuList) {
    menuBtn.addEventListener('click', function() {
      menuList.classList.toggle('aberto');
      var aberto = menuList.classList.contains('aberto');
      menuBtn.setAttribute('aria-expanded', aberto);
    });
  }

  // ============================================
  // ACESSIBILIDADE
  // ============================================
  var tamanhoFonte = 16;

  var btnContraste = document.getElementById('btn-contrast');
  if (btnContraste) {
    btnContraste.addEventListener('click', function() {
      document.body.classList.toggle('contraste');
    });
  }

  var btnFontUp = document.getElementById('btn-font-up');
  if (btnFontUp) {
    btnFontUp.addEventListener('click', function() {
      if (tamanhoFonte < 24) {
        tamanhoFonte += 2;
        document.documentElement.style.fontSize = tamanhoFonte + 'px';
      }
    });
  }

  var btnFontDown = document.getElementById('btn-font-down');
  if (btnFontDown) {
    btnFontDown.addEventListener('click', function() {
      if (tamanhoFonte > 12) {
        tamanhoFonte -= 2;
        document.documentElement.style.fontSize = tamanhoFonte + 'px';
      }
    });
  }

  var btnDislexia = document.getElementById('btn-dyslexic');
  if (btnDislexia) {
    btnDislexia.addEventListener('click', function() {
      document.body.classList.toggle('dislexia');
    });
  }

  // ============================================
  // ESPECTRO INTERATIVO
  // ============================================
  var dadosEspectro = {
    uv: {
      titulo: '☢️ Ultravioleta (UV)',
      texto: 'Comprimento: 100–400 nm. Alta energia. Parcialmente absorvida pelo ozônio. Aquece a superfície e pode degradar materiais. Representa cerca de 7% da energia solar.'
    },
    vis: {
      titulo: '🌈 Visível',
      texto: 'Comprimento: 400–700 nm. Energia média. É a faixa que enxergamos. Penetra alguns metros na água. Representa cerca de 43% da energia solar.'
    },
    ir: {
      titulo: '🔥 Infravermelho (IV)',
      texto: 'Comprimento: 700 nm – 1 mm. Absorvido nos primeiros milímetros da água. Principal responsável pelo aquecimento! Representa cerca de 49% da energia solar.'
    }
  };

  var infoEspectro = document.getElementById('spectrum-info');
  var bandas = document.querySelectorAll('.band');
  bandas.forEach(function(banda) {
    function mostrar() {
      var tipo = banda.getAttribute('data-type');
      var dado = dadosEspectro[tipo];
      if (infoEspectro && dado) {
        infoEspectro.innerHTML = '<h4>' + dado.titulo + '</h4><p>' + dado.texto + '</p>';
      }
    }
    banda.addEventListener('click', mostrar);
    banda.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        mostrar();
      }
    });
  });

  // ============================================
  // SIMULADOR
  // ============================================
  var sIntensity = document.getElementById('s-intensity');
  var sCover = document.getElementById('s-cover');
  var sDepth = document.getElementById('s-depth');
  var sTime = document.getElementById('s-time');
  var sTemp = document.getElementById('s-temp');

  var vIntensity = document.getElementById('v-intensity');
  var vCover = document.getElementById('v-cover');
  var vDepth = document.getElementById('v-depth');
  var vTime = document.getElementById('v-time');
  var vTemp = document.getElementById('v-temp');

  var rTemp = document.getElementById('r-temp');
  var rDelta = document.getElementById('r-delta');
  var rEnergy = document.getElementById('r-energy');
  var rExplanation = document.getElementById('r-explanation');
  var poolWater = document.getElementById('pool-water');
  var poolTemp = document.getElementById('pool-temp');

  // Constantes
  var AREA = 25; // m²
  var VOLUME_BASE = 30; // m³
  var C_AGUA = 4.186; // J/(g·°C)
  var EFICIENCIA = 0.7;

  function calcular() {
    if (!sIntensity) return;

    var I = parseFloat(sIntensity.value);
    var C = parseFloat(sCover.value) / 100;
    var D = parseFloat(sDepth.value);
    var T = parseFloat(sTime.value);
    var Ti = parseFloat(sTemp.value);

    // Atualiza labels
    if (vIntensity) vIntensity.textContent = I;
    if (vCover) vCover.textContent = Math.round(C * 100);
    if (vDepth) vDepth.textContent = D.toFixed(1);
    if (vTime) vTime.textContent = T;
    if (vTemp) vTemp.textContent = Ti;

    // Cálculos
    var areaEfetiva = AREA * (1 - C);
    var potencia = I * areaEfetiva; // W
    var energiaJ = potencia * T * 3600 * EFICIENCIA;
    var energiaKJ = energiaJ / 1000;

    var massa = (D / 1.2) * VOLUME_BASE * 1000000; // gramas
    var deltaT = energiaJ / (massa * C_AGUA);
    var Tf = Ti + deltaT;

    // Atualiza resultados
    if (rTemp) rTemp.textContent = Tf.toFixed(1);
    if (rDelta) rDelta.textContent = (deltaT >= 0 ? '+' : '') + deltaT.toFixed(1);
    if (rEnergy) rEnergy.textContent = Math.round(energiaKJ).toLocaleString('pt-BR');
    if (poolTemp) poolTemp.textContent = Tf.toFixed(1) + ' °C';

    // Cor da piscina
    if (poolWater) {
      var ratio = Math.min(Math.max((Tf - 15) / 25, 0), 1);
      var r = Math.round(ratio * 230);
      var g = Math.round(180 - ratio * 100);
      var b = Math.round(216 - ratio * 150);
      poolWater.style.background = 'linear-gradient(180deg, rgba(' + r + ',' + g + ',' + b + ',0.7), rgba(' + Math.max(r-50,0) + ',' + Math.max(g-50,0) + ',' + Math.max(b-50,0) + ',0.9))';
    }

    // Explicação
    if (rExplanation) {
      var exp = '';
      if (deltaT < 1) exp = '🌥️ Aquecimento pequeno. Aumente a intensidade ou reduza a cobertura.';
      else if (deltaT < 4) exp = '☀️ Aquecimento moderado – típico de um dia ensolarado.';
      else if (deltaT < 7) exp = '🔥 Aquecimento significativo! Piscina agradável.';
      else exp = '🌡️ Aquecimento intenso – atenção para não passar de 30 °C.';
      if (C > 0.5) exp += ' A cobertura está reduzindo muito a área exposta.';
      rExplanation.textContent = exp;
    }
  }

  // Eventos dos sliders
  [sIntensity, sCover, sDepth, sTime, sTemp].forEach(function(s) {
    if (s) s.addEventListener('input', calcular);
  });

  var btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', function() {
      if (sIntensity) sIntensity.value = 800;
      if (sCover) sCover.value = 0;
      if (sDepth) sDepth.value = 1.2;
      if (sTime) sTime.value = 6;
      if (sTemp) sTemp.value = 22;
      calcular();
    });
  }

  // Inicializa
  calcular();

  // ============================================
  // ANIMAÇÃO DO CANVAS
  // ============================================
  var canvas = document.getElementById('canvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var frame = 0;

    function desenhar() {
      var w = canvas.width;
      var h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Fundo
      var grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#03045e');
      grad.addColorStop(0.5, '#0077b6');
      grad.addColorStop(1, '#90e0ef');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Sol
      ctx.fillStyle = '#ffd60a';
      ctx.beginPath();
      ctx.arc(60, h/2, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff9e00';
      ctx.beginPath();
      ctx.arc(60, h/2, 30, 0, Math.PI * 2);
      ctx.fill();

      // Terra
      ctx.fillStyle = '#06a77d';
      ctx.beginPath();
      ctx.arc(w - 60, h/2, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0077b6';
      ctx.beginPath();
      ctx.arc(w - 70, h/2 - 5, 15, 0, Math.PI * 2);
      ctx.fill();

      // Ondas
      for (var i = 0; i < 8; i++) {
        var x = 120 + ((frame + i * 30) % (w - 200));
        var alpha = 0.3 + 0.5 * Math.sin((frame + i * 10) * 0.1);
        ctx.strokeStyle = 'rgba(255, 214, 10, ' + alpha + ')';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (var y = 0; y < h; y += 2) {
          var waveX = x + Math.sin((y + frame) * 0.1) * 10;
          if (y === 0) ctx.moveTo(waveX, y);
          else ctx.lineTo(waveX, y);
        }
        ctx.stroke();
      }

      // Rótulos
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SOL', 60, h - 15);
      ctx.fillText('TERRA', w - 60, h - 15);
      ctx.fillText('Radiação eletromagnética →', w/2, 25);

      frame++;
      requestAnimationFrame(desenhar);
    }
    desenhar();
  }

  // ============================================
  // ATALHOS DE TECLADO
  // ============================================
  document.addEventListener('keydown', function(e) {
    if (e.altKey && !isNaN(e.key) && e.key >= '1' && e.key <= '8') {
      e.preventDefault();
      var ids = ['home', 'sol', 'espectro', 'simulador', 'piscina', 'robotica', 'sustentabilidade', 'mapa'];
      var alvo = ids[parseInt(e.key) - 1];
      if (alvo) mostrarPagina(alvo);
    }
  });

});
