// ==================== ACESSIBILIDADE ====================
const accessibilityToggle = document.getElementById('accessibility-toggle');
const accessibilityPanel = document.getElementById('accessibility-panel');
const closePanel = document.querySelector('.close-panel');
const openAccessibilityFooter = document.getElementById('open-accessibility-footer');

function toggleAccessibilityPanel() {
    const isActive = accessibilityPanel.classList.contains('active');
    if (isActive) {
        accessibilityPanel.classList.remove('active');
        accessibilityPanel.setAttribute('aria-hidden', 'true');
        accessibilityToggle.setAttribute('aria-expanded', 'false');
    } else {
        accessibilityPanel.classList.add('active');
        accessibilityPanel.setAttribute('aria-hidden', 'false');
        accessibilityToggle.setAttribute('aria-expanded', 'true');
        closePanel.focus();
    }
}

accessibilityToggle.addEventListener('click', toggleAccessibilityPanel);
closePanel.addEventListener('click', toggleAccessibilityPanel);
openAccessibilityFooter.addEventListener('click', toggleAccessibilityPanel);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && accessibilityPanel.classList.contains('active')) {
        toggleAccessibilityPanel();
        accessibilityToggle.focus();
    }
});

// Alto Contraste
const highContrastToggle = document.getElementById('high-contrast');
highContrastToggle.addEventListener('change', (e) => {
    document.body.classList.toggle('high-contrast', e.target.checked);
    localStorage.setItem('highContrast', e.target.checked);
});

// Fonte para Dislexia
const dyslexiaFontToggle = document.getElementById('dyslexia-font');
dyslexiaFontToggle.addEventListener('change', (e) => {
    document.body.classList.toggle('dyslexia-font', e.target.checked);
    localStorage.setItem('dyslexiaFont', e.target.checked);
});

// Espaçamento
const increaseSpacingToggle = document.getElementById('increase-spacing');
increaseSpacingToggle.addEventListener('change', (e) => {
    document.body.classList.toggle('increased-spacing', e.target.checked);
    localStorage.setItem('increaseSpacing', e.target.checked);
});

// Tamanho da Fonte
const fontSizeSlider = document.getElementById('font-size');
const fontSizeValue = document.getElementById('font-size-value');
fontSizeSlider.addEventListener('input', (e) => {
    const size = e.target.value;
    document.documentElement.style.fontSize = `${size}%`;
    fontSizeValue.textContent = `${size}%`;
    localStorage.setItem('fontSize', size);
});

// Carregar configurações salvas
window.addEventListener('load', () => {
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
        highContrastToggle.checked = true;
    }
    if (localStorage.getItem('dyslexiaFont') === 'true') {
        document.body.classList.add('dyslexia-font');
        dyslexiaFontToggle.checked = true;
    }
    if (localStorage.getItem('increaseSpacing') === 'true') {
        document.body.classList.add('increased-spacing');
        increaseSpacingToggle.checked = true;
    }
    if (localStorage.getItem('fontSize')) {
        const size = localStorage.getItem('fontSize');
        document.documentElement.style.fontSize = `${size}%`;
        fontSizeSlider.value = size;
        fontSizeValue.textContent = `${size}%`;
    }
});

// ==================== MENU MOBILE ====================
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
});

navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

// ==================== SIMULADOR CANVAS ====================
const canvas = document.getElementById('simulator-canvas');
const ctx = canvas.getContext('2d');
const temperatureDisplay = document.getElementById('temperature-display');
const sunIntensity = document.getElementById('sun-intensity');
const intensityValue = document.getElementById('intensity-value');
const startSimulation = document.getElementById('start-simulation');
const resetSimulation = document.getElementById('reset-simulation');

let currentTemperature = 25;
let targetTemperature = 25;
let isSimulating = false;
let photons = [];
let molecules = [];
let animationId = null;

// Ajustar canvas para responsividade
function resizeCanvas() {
    const wrapper = canvas.parentElement;
    const rect = wrapper.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.width * 0.625; // Proporção 800x500
    initMolecules();
}

// Inicializar moléculas de água
function initMolecules() {
    molecules = [];
    const waterTop = canvas.height * 0.55;
    const waterBottom = canvas.height * 0.95;
    const numMolecules = 40;
    
    for (let i = 0; i < numMolecules; i++) {
        molecules.push({
            x: Math.random() * canvas.width,
            y: waterTop + Math.random() * (waterBottom - waterTop),
            baseX: 0,
            baseY: 0,
            radius: 4 + Math.random() * 3,
            vx: 0,
            vy: 0,
            phase: Math.random() * Math.PI * 2
        });
        molecules[i].baseX = molecules[i].x;
        molecules[i].baseY = molecules[i].y;
    }
}

// Criar fóton
function createPhoton(type) {
    const colors = {
        uv: { color: '#8B00FF', glow: 'rgba(139, 0, 255, 0.5)', heat: 0.1 },
        visible: { color: '#FFD700', glow: 'rgba(255, 215, 0, 0.5)', heat: 0.3 },
        infrared: { color: '#FF3300', glow: 'rgba(255, 51, 0, 0.6)', heat: 0.6 },
        all: { 
            color: ['#8B00FF', '#FFD700', '#FF3300'][Math.floor(Math.random() * 3)],
            glow: 'rgba(255, 200, 0, 0.5)',
            heat: 0.4
        }
    };
    
    const config = colors[type];
    return {
        x: Math.random() * canvas.width,
        y: -20,
        vy: 2 + Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.5,
        radius: 4 + Math.random() * 2,
        color: config.color,
        glow: config.glow,
        heat: config.heat,
        active: true
    };
}

// Desenhar fundo (céu + água)
function drawBackground() {
    // Céu
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.55);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#B0E0E6');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.55);
    
    // Sol
    const sunX = canvas.width * 0.15;
    const sunY = canvas.height * 0.18;
    const sunRadius = 40;
    
    // Brilho do sol
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2.5);
    sunGlow.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
    sunGlow.addColorStop(0.5, 'rgba(255, 180, 0, 0.3)');
    sunGlow.addColorStop(1, 'rgba(255, 180, 0, 0)');
    ctx.fillStyle = sunGlow;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.55);
    
    // Sol central
    const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
    sunGradient.addColorStop(0, '#FFF59D');
    sunGradient.addColorStop(0.7, '#FFD700');
    sunGradient.addColorStop(1, '#FFA500');
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Água
    const waterGradient = ctx.createLinearGradient(0, canvas.height * 0.55, 0, canvas.height);
    waterGradient.addColorStop(0, '#48CAE4');
    waterGradient.addColorStop(0.5, '#0096B7');
    waterGradient.addColorStop(1, '#0077A3');
    ctx.fillStyle = waterGradient;
    ctx.fillRect(0, canvas.height * 0.55, canvas.width, canvas.height * 0.45);
    
    // Linha da superfície da água
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.55);
    ctx.lineTo(canvas.width, canvas.height * 0.55);
    ctx.stroke();
    
    // Bordas da piscina
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, canvas.height * 0.55, canvas.width - 4, canvas.height * 0.43);
}

// Desenhar moléculas
function drawMolecules(intensity) {
    const agitation = intensity / 100;
    
    molecules.forEach(m => {
        m.phase += 0.02 + agitation * 0.1;
        const offsetX = Math.sin(m.phase) * (3 + agitation * 15);
        const offsetY = Math.cos(m.phase * 1.3) * (3 + agitation * 15);
        
        const drawX = m.baseX + offsetX;
        const drawY = m.baseY + offsetY;
        
        // Brilho
        const glow = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, m.radius * 3);
        glow.addColorStop(0, `rgba(255, 255, 255, ${0.4 + agitation * 0.3})`);
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(drawX, drawY, m.radius * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Molécula
        const moleculeColor = `rgba(255, 255, 255, ${0.6 + agitation * 0.3})`;
        ctx.fillStyle = moleculeColor;
        ctx.beginPath();
        ctx.arc(drawX, drawY, m.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Desenhar fótons
function drawPhotons() {
    photons.forEach(p => {
        if (!p.active) return;
        
        // Brilho
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
        glow.addColorStop(0, p.glow);
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Fóton
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Rastro
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 5, p.y - p.vy * 5);
        ctx.stroke();
        ctx.globalAlpha = 1;
    });
}

// Loop de animação
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const intensity = parseFloat(sunIntensity.value);
    
    drawBackground();
    drawMolecules(intensity);
    
    if (isSimulating) {
        // Criar novos fótons
        const radiationType = document.querySelector('input[name="radiation"]:checked').value;
        if (Math.random() < intensity / 50) {
            photons.push(createPhoton(radiationType));
        }
        
        // Atualizar fótons
        const waterTop = canvas.height * 0.55;
        photons.forEach(p => {
            if (!p.active) return;
            p.x += p.vx;
            p.y += p.vy;
            
            // Atingiu a água
            if (p.y >= waterTop) {
                p.active = false;
                targetTemperature += p.heat * (intensity / 100) * 0.05;
                if (targetTemperature > 45) targetTemperature = 45;
            }
        });
        
        // Remover fótons inativos
        photons = photons.filter(p => p.active && p.y < canvas.height);
        
        // Aproximar temperatura atual da alvo
        currentTemperature += (targetTemperature - currentTemperature) * 0.05;
    }
    
    drawPhotons();
    
    // Atualizar display
    temperatureDisplay.textContent = `${currentTemperature.toFixed(1)}°C`;
    
    animationId = requestAnimationFrame(animate);
}

// Controles
sunIntensity.addEventListener('input', (e) => {
    intensityValue.textContent = `${e.target.value}%`;
});

startSimulation.addEventListener('click', () => {
    isSimulating = !isSimulating;
    startSimulation.textContent = isSimulating ? '⏸ Pausar' : '▶ Iniciar';
    startSimulation.classList.toggle('active', isSimulating);
});

resetSimulation.addEventListener('click', () => {
    isSimulating = false;
    startSimulation.textContent = '▶ Iniciar';
    startSimulation.classList.remove('active');
    currentTemperature = 25;
    targetTemperature = 25;
    photons = [];
    initMolecules();
});

// Inicializar
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animate();

// ==================== CALCULADORA ====================
const calculateSavings = document.getElementById('calculate-savings');
const poolSize = document.getElementById('pool-size');
const heatingMethod = document.getElementById('heating-method');
const monthlySavings = document.getElementById('monthly-savings');
const yearlySavings = document.getElementById('yearly-savings');
const co2Saved = document.getElementById('co2-saved');

calculateSavings.addEventListener('click', () => {
    const size = parseFloat(poolSize.value);
    const method = heatingMethod.value;
    
    const costs = { electric: 180, gas: 120 };
    const solarCost = 20;
    
    const monthlyCost = costs[method] * (size / 20);
    const savings = monthlyCost - solarCost * (size / 20);
    
    const co2 = savings * 12 * 0.4;
    
    // Animação dos números
    animateValue(monthlySavings, `R$ ${savings.toFixed(2)}`);
    animateValue(yearlySavings, `R$ ${(savings * 12).toFixed(2)}`);
    animateValue(co2Saved, `${co2.toFixed(1)} kg`);
});

function animateValue(element, finalValue) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        element.textContent = finalValue;
        element.style.transition = 'all 0.4s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 150);
}

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.info-card, .spectrum-card, .robotics-card, .impact-card').forEach(el => {
    observer.observe(el);
});

// ==================== NAVEGAÇÃO SUAVE ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    });
});

// ==================== TRAP FOCUS NO PAINEL ====================
accessibilityPanel.addEventListener('keydown', (e) => {
    const focusable = accessibilityPanel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

console.log('🌞💧 Site Sol + Água carregado com sucesso!');
