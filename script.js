// ==================== ACESSIBILIDADE ====================

// Painel de Acessibilidade
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

// Fechar painel com ESC
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

// Aumentar Espaçamento
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
    document.documentElement.style.setProperty('--font-size-base', `${size / 100}rem`);
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
        document.documentElement.style.setProperty('--font-size-base', `${size / 100}rem`);
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

// Fechar menu ao clicar em um link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

// ==================== SIMULADOR ====================

const sunIntensity = document.getElementById('sun-intensity');
const intensityValue = document.getElementById('intensity-value');
const radiationType = document.getElementById('radiation-type');
const startSimulation = document.getElementById('start-simulation');
const resetSimulation = document.getElementById('reset-simulation');
const thermometerFill = document.getElementById('thermometer-fill');
const temperatureDisplay = document.getElementById('temperature-display');
const waterMolecules = document.getElementById('water-molecules');
const sunSimulator = document.getElementById('sun-simulator');

let simulationInterval;
let currentTemperature = 25;
let molecules = [];

// Atualizar valor da intensidade
sunIntensity.addEventListener('input', (e) => {
    intensityValue.textContent = `${e.target.value}%`;
});

// Criar moléculas de água
function createMolecules() {
    waterMolecules.innerHTML = '';
    molecules = [];
    
    for (let i = 0; i < 20; i++) {
        const molecule = document.createElement('div');
        molecule.className = 'molecule';
        molecule.style.left = `${Math.random() * 90}%`;
        molecule.style.top = `${Math.random() * 90}%`;
        molecule.style.animationDelay = `${Math.random() * 3}s`;
        waterMolecules.appendChild(molecule);
        molecules.push(molecule);
    }
}

// Iniciar simulação
startSimulation.addEventListener('click', () => {
    if (simulationInterval) {
        clearInterval(simulationInterval);
    }
    
    const intensity = sunIntensity.value / 100;
    const type = radiationType.value;
    
    // Calcular taxa de aquecimento baseada no tipo de radiação
    let heatingRate = 0;
    switch(type) {
        case 'uv':
            heatingRate = 0.1 * intensity;
            break;
        case 'visible':
            heatingRate = 0.3 * intensity;
            break;
        case 'infrared':
            heatingRate = 0.5 * intensity;
            break;
        case 'all':
            heatingRate = 0.9 * intensity;
            break;
    }
    
    // Animar moléculas
    molecules.forEach(molecule => {
        const speed = 3 - (intensity * 2);
        molecule.style.animationDuration = `${speed}s`;
    });
    
    // Aumentar temperatura
    simulationInterval = setInterval(() => {
        if (currentTemperature < 45) {
            currentTemperature += heatingRate * 0.1;
            const percentage = ((currentTemperature - 25) / 20) * 100;
            thermometerFill.style.height = `${Math.min(percentage, 100)}%`;
            temperatureDisplay.textContent = `${currentTemperature.toFixed(1)}°C`;
        }
    }, 100);
    
    // Mudar cor do sol baseado na intensidade
    const sunColor = intensity > 0.7 ? '#FF4500' : intensity > 0.4 ? '#FFA500' : '#FFD700';
    sunSimulator.style.background = `radial-gradient(circle, ${sunColor}, #FFA500)`;
});

// Resetar simulação
resetSimulation.addEventListener('click', () => {
    if (simulationInterval) {
        clearInterval(simulationInterval);
    }
    currentTemperature = 25;
    thermometerFill.style.height = '30%';
    temperatureDisplay.textContent = '25°C';
    sunSimulator.style.background = 'radial-gradient(circle, #FFD700, #FFA500)';
    createMolecules();
});

// Inicializar moléculas
createMolecules();

// ==================== CALCULADORA DE ECONOMIA ====================

const calculateSavings = document.getElementById('calculate-savings');
const poolSize = document.getElementById('pool-size');
const heatingMethod = document.getElementById('heating-method');
const monthlySavings = document.getElementById('monthly-savings');
const yearlySavings = document.getElementById('yearly-savings');
const co2Saved = document.getElementById('co2-saved');

calculateSavings.addEventListener('click', () => {
    const size = parseFloat(poolSize.value);
    const method = heatingMethod.value;
    
    // Custos estimados por m³ por mês
    const costs = {
        electric: 150,
        gas: 100,
        solar: 20
    };
    
    const monthlyCost = costs[method] * size;
    const solarCost = costs.solar * size;
    const savings = monthlyCost - solarCost;
    
    // CO2 evitado (kg por kWh)
    const co2PerKWh = 0.4;
    const energySaved = (monthlyCost - solarCost) / 0.8;
    const co2 = energySaved * co2PerKWh;
    
    monthlySavings.textContent = `R$ ${savings.toFixed(2)}`;
    yearlySavings.textContent = `R$ ${(savings * 12).toFixed(2)}`;
    co2Saved.textContent = `${co2.toFixed(1)} kg`;
});

// ==================== ANIMAÇÕES DE SCROLL ====================

// Observador de Interseção para animações
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos
document.querySelectorAll('.info-card, .spectrum-card, .robotics-card, .impact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
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

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== ACESSIBILIDADE POR TECLADO ====================

// Navegação por teclado no painel de acessibilidade
accessibilityPanel.addEventListener('keydown', (e) => {
    const focusableElements = accessibilityPanel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});

console.log('Site carregado com sucesso! 🌞💧');
