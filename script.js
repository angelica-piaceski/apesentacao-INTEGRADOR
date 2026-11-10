// NAVEGAÇÃO
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('menu').classList.add('hidden');
  window.scrollTo(0, 0);
}

function toggleMenu() {
  document.getElementById('menu').classList.toggle('hidden');
}

// ACESSIBILIDADE
let fontSize = 16;
function changeFontSize(delta) {
  fontSize = Math.max(12, Math.min(24, fontSize + delta));
  document.documentElement.style.fontSize = fontSize + 'px';
}
function toggleContrast() { document.body.classList.toggle('contraste'); }
function toggleDyslexia() { document.body.classList.toggle('dislexia'); }

// ESPECTRO
const specData = {
  uv: "<strong>Ultravioleta (UV):</strong> 100-400 nm. Alta energia. Aquece a superfície e pode degradar o cloro.",
  vis: "<strong>Visível:</strong> 400-700 nm. Penetra alguns metros na água e é convertida em calor.",
  ir: "<strong>Infravermelho (IV):</strong> 700 nm - 1 mm. Principal responsável pelo aquecimento direto da superfície!"
};
function showSpectrum(type) {
  document.getElementById('spec-info').innerHTML = specData[type];
}

// SIMULADOR
function calc() {
  const I = parseFloat(document.getElementById('s-int').value);
  const C = parseFloat(document.getElementById('s-cov').value) / 100;
  const D = parseFloat(document.getElementById('s-dep').value);
  const T = parseFloat(document.getElementById('s-time').value);
  const Ti = parseFloat(document.getElementById('s-temp').value);

  document.getElementById('v-int').textContent = I;
  document.getElementById('v-cov').textContent = Math.round(C * 100);
  document.getElementById('v-dep').textContent = D.toFixed(1);
  document.getElementById('v-time').textContent = T;
  document.getElementById('v-temp').textContent = Ti;

  const area = 25 * (1 - C);
  const energiaJ = I * area * T * 3600 * 0.7;
  const massa = (D / 1.2) * 30000000; // gramas (base 30m³)
  const deltaT = energiaJ / (massa * 4.186);
  const Tf = Ti + deltaT;

  document.getElementById('r-temp').textContent = Tf.toFixed(1);
  document.getElementById('r-delta').textContent = (deltaT >= 0 ? '+' : '') + deltaT.toFixed(1);
  document.getElementById('r-energy').textContent = Math.round(energiaJ / 1000).toLocaleString('pt-BR');
  document.getElementById('pool-temp').textContent = Tf.toFixed(1) + ' °C';

  // Cor da água
  const ratio = Math.min(Math.max((Tf - 15) / 25, 0), 1);
  const r = Math.round(ratio * 230), g = Math.round(180 - ratio * 100), b = Math.round(216 - ratio * 150);
  document.getElementById('pool-water').style.background = `linear-gradient(180deg, rgba(${r},${g},${b},0.8), rgba(${Math.max(r-50,0)},${Math.max(g-50,0)},${Math.max(b-50,0)},0.9))`;

  let msg = "Ajuste os controles.";
  if (deltaT < 1) msg = "🌥️ Aquecimento mínimo.";
  else if (deltaT < 4) msg = "☀️ Aquecimento moderado e agradável.";
  else if (deltaT < 7) msg = "🔥 Aquecimento significativo!";
  else msg = "🌡️ Aquecimento intenso (cuidado > 30°C).";
  if (C > 0.5) msg += " A cobertura está bloqueando muito o sol.";
  document.getElementById('r-msg').textContent = msg;
}

function resetSim() {
  document.getElementById('s-int').value = 800;
  document.getElementById('s-cov').value = 0;
  document.getElementById('s-dep').value = 1.2;
  document.getElementById('s-time').value = 6;
  document.getElementById('s-temp').value = 22;
  calc();
}

// ANIMAÇÃO CANVAS
const canvas = document.getElementById('canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Sol
    ctx.fillStyle = '#ffd60a'; ctx.beginPath(); ctx.arc(50, 75, 30, 0, Math.PI*2); ctx.fill();
    // Terra
    ctx.fillStyle = '#06a77d'; ctx.beginPath(); ctx.arc(550, 75, 25, 0, Math.PI*2); ctx.fill();
    // Ondas
    for (let i = 0; i < 6; i++) {
      let x = 100 + ((frame + i * 40) % 400);
      ctx.strokeStyle = `rgba(255, 214, 10, ${0.4 + 0.4 * Math.sin((frame + i * 10) * 0.1)})`;
      ctx.lineWidth = 2; ctx.beginPath();
      for (let y = 0; y < 150; y += 2) {
        let wx = x + Math.sin((y + frame) * 0.15) * 8;
        y === 0 ? ctx.moveTo(wx, y) : ctx.lineTo(wx, y);
      }
      ctx.stroke();
    }
    ctx.fillStyle = 'white'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('SOL', 50, 140); ctx.fillText('TERRA', 550, 140);
    frame++; requestAnimationFrame(draw);
  }
  draw();
}

// Inicializa
calc();
