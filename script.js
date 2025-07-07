// Airlines mit Überlebens- und Absturzwahrscheinlichkeit
const airlines = [
  { name: 'Cathay Pacific', survive: 99.4, crash: 0.006 },
  { name: 'EVA Air', survive: 99.2, crash: 0.008 },
  { name: 'Air Canada', survive: 99.0, crash: 0.01 },
  { name: 'Air New Zealand', survive: 99.0, crash: 0.01 },
  { name: 'Qantas', survive: 98.7, crash: 0.013 },
  { name: 'Etihad Airways', survive: 98.6, crash: 0.014 },
  { name: 'Lufthansa', survive: 98.4, crash: 0.016 },
  { name: 'Qatar Airways', survive: 97.3, crash: 0.027 },
  { name: 'EasyJet', survive: 97.3, crash: 0.027 },
  { name: 'Southwest Airlines', survive: 96.7, crash: 0.033 },
  { name: 'Ryanair', survive: 92.9, crash: 0.071 },
  { name: 'Aeroflot', survive: 89.4, crash: 0.106 },
  { name: 'Air Dolomiti', survive: 97.8, crash: 0.022 },
  { name: 'Eurowings', survive: 96.5, crash: 0.035 }
];

const searchInput = document.getElementById('search');
const airlineList = document.getElementById('airline-list');
const probabilityDisplay = document.getElementById('probability-display');
const simulateBtn = document.getElementById('simulate-btn');
const animationArea = document.getElementById('animation-area');
const resultMessage = document.getElementById('result-message');
const useCustomProbBtn = document.getElementById('use-custom-prob');
const customProbInput = document.getElementById('custom-prob');
const resultOverlay = document.getElementById('result-overlay');

let filteredAirlines = airlines;
let selectedAirline = null;
let customProbability = null;

function renderAirlineList() {
  airlineList.innerHTML = '';
  filteredAirlines.forEach((airline, idx) => {
    const option = document.createElement('option');
    option.value = idx;
    option.textContent = airline.name;
    airlineList.appendChild(option);
  });
  if (filteredAirlines.length > 0) {
    airlineList.selectedIndex = 0;
    updateProbabilityDisplay();
  } else {
    probabilityDisplay.textContent = '';
  }
}

function updateProbabilityDisplay() {
  const idx = airlineList.selectedIndex;
  if (customProbability !== null) {
    probabilityDisplay.textContent = `Eigene Absturzwahrscheinlichkeit: ${parseFloat(customProbability).toFixed(3)}% | Überlebenswahrscheinlichkeit: ${(100 - parseFloat(customProbability)).toFixed(3)}%`;
  } else if (idx >= 0 && filteredAirlines[idx]) {
    selectedAirline = filteredAirlines[idx];
    const absturz = selectedAirline.crash;
    const survive = 100 - absturz;
    probabilityDisplay.textContent = `Überlebenswahrscheinlichkeit: ${survive.toFixed(3)}% | Absturz: ${absturz.toFixed(3)}%`;
  } else {
    selectedAirline = null;
    probabilityDisplay.textContent = '';
  }
}

function expandAirlineList() {
  airlineList.size = 8;
  airlineList.classList.add('expanded');
}
function collapseAirlineList() {
  airlineList.size = 1;
  airlineList.classList.remove('expanded');
}

searchInput.addEventListener('focus', expandAirlineList);
searchInput.addEventListener('input', expandAirlineList);
airlineList.addEventListener('focus', expandAirlineList);
airlineList.addEventListener('blur', collapseAirlineList);
searchInput.addEventListener('blur', () => setTimeout(collapseAirlineList, 200));

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  filteredAirlines = airlines.filter(a => a.name.toLowerCase().includes(query));
  renderAirlineList();
});

airlineList.addEventListener('change', () => {
  updateProbabilityDisplay();
  resetCustomProbability();
  collapseAirlineList();
});

useCustomProbBtn.addEventListener('click', () => {
  const val = parseFloat(customProbInput.value.replace(',', '.'));
  if (!isNaN(val) && val >= 0 && val <= 100) {
    customProbability = val;
    probabilityDisplay.textContent = `Eigene Absturzwahrscheinlichkeit: ${customProbability}% | Überlebenswahrscheinlichkeit: ${(100 - customProbability).toFixed(3)}%`;
    selectedAirline = null;
    airlineList.selectedIndex = -1;
  } else {
    probabilityDisplay.textContent = 'Bitte eine gültige Wahrscheinlichkeit (0-100) eingeben!';
    customProbability = null;
  }
});

function getCurrentCrashProbability() {
  if (customProbability !== null) {
    return customProbability;
  } else if (selectedAirline) {
    return selectedAirline.crash;
  }
  return null;
}

function getCurrentSurviveProbability() {
  if (customProbability !== null) {
    return 100 - customProbability;
  } else if (selectedAirline) {
    return selectedAirline.survive;
  }
  return null;
}

function resetCustomProbability() {
  customProbability = null;
  customProbInput.value = '';
}

function createPlaneEmoji() {
  const plane = document.createElement('span');
  plane.className = 'plane-emoji';
  plane.textContent = '✈️';
  return plane;
}

function spawnConfetti() {
  const colors = ['#ffb347', '#43cea2', '#00ffb3', '#ff3c3c', '#ffcc33', '#b3d1ff'];
  for (let i = 0; i < 32; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti';
    conf.style.left = Math.random() * 90 + '%';
    conf.style.background = colors[Math.floor(Math.random() * colors.length)];
    conf.style.transform = `rotate(${Math.random() * 360}deg)`;
    conf.style.animationDelay = (Math.random() * 0.7) + 's';
    animationArea.appendChild(conf);
    setTimeout(() => conf.remove(), 1800);
  }
}

function createRandomPathPoints(width, height, steps = 24, didCrash = false) {
  // Sehr große Amplitude, smooth, Endphase orientiert sich am Ziel
  const points = [];
  let lastY = height * 0.5;
  for (let i = 0; i <= steps; i++) {
    let y;
    if (i === 0) {
      y = lastY;
    } else if (i >= steps - 4) {
      // Letzte 4 Punkte orientieren sich ans Ziel
      y = didCrash ? height - 2 : 2;
      // Leichtes Glätten mit vorherigen Punkten
      if (i > 1) y = (y + points[i-1] + points[i-2]) / 3;
    } else {
      // Sehr große Amplitude
      y = lastY + (Math.random() - 0.5) * height * 0.95;
      y = Math.max(2, Math.min(height - 2, y));
      // Stärkeres Glätten
      if (i > 3) {
        y = (y + points[i-1] + points[i-2] + points[i-3] + points[i-4]) / 5;
      } else if (i > 1) {
        y = (y + points[i-1] + points[i-2]) / (i+1);
      }
    }
    points.push(y);
    lastY = y;
  }
  // Zielpunkt: oben (überlebt) oder unten (abgestürzt)
  points[points.length - 1] = didCrash ? height - 2 : 2;
  return points;
}

function createPlaneWithSVGTrail(areaWidth, areaHeight) {
  // SVG für Kondensstreifen
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('condensation-svg');
  svg.setAttribute('width', areaWidth);
  svg.setAttribute('height', areaHeight);
  svg.setAttribute('viewBox', `0 0 ${areaWidth} ${areaHeight}`);
  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  polyline.classList.add('condensation-polyline');
  svg.appendChild(polyline);
  const wrapper = document.createElement('div');
  wrapper.className = 'plane-emoji-wrapper';
  const plane = createPlaneEmoji();
  wrapper.appendChild(plane);
  return { wrapper, plane, svg, polyline };
}

function animatePlaneAlongPath(plane, duration, onEnd, didCrash, polyline, areaWidth) {
  const area = document.querySelector('.animation-area');
  const width = areaWidth || area.offsetWidth;
  const height = area.offsetHeight - 60;
  const steps = 24;
  const points = createRandomPathPoints(width, height, steps, didCrash);
  let start = null;
  const trailPoints = [];

  function lerp(a, b, t) { return a + (b - a) * t; }

  function getY(x) {
    const idx = Math.floor(x * steps);
    const t = (x * steps) - idx;
    if (idx >= steps) return points[steps];
    return lerp(points[idx], points[idx + 1], t);
  }

  function frame(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;
    const t = Math.min(elapsed / duration, 1);
    const x = t;
    const y = getY(x / 1.0);
    const px = x * width;
    plane.style.left = `${px + 40}px`;
    plane.style.top = `${y}px`;
    plane.style.transform = `rotate(${Math.sin(x * Math.PI * 2) * 10}deg) scale(1.1)`;
    // SVG-Trail: Punkte sammeln und Polyline aktualisieren
    trailPoints.push(`${px + 60},${y + 65}`);
    if (polyline) {
      polyline.setAttribute('points', trailPoints.join(' '));
    }
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      if (onEnd) onEnd();
    }
  }
  requestAnimationFrame(frame);
}

function showResultOverlay(type, text) {
  resultOverlay.textContent = text;
  resultOverlay.className = 'result-overlay visible ' + type;
  resultOverlay.style.display = 'flex';
  setTimeout(() => {
    resultOverlay.style.opacity = '1';
  }, 10);
}

function hideResultOverlay() {
  resultOverlay.className = 'result-overlay';
  resultOverlay.style.opacity = '0';
  setTimeout(() => {
    resultOverlay.style.display = 'none';
    resultOverlay.textContent = '';
  }, 500);
}

function spawnFlameConfetti() {
  // Flammen sollen über den gesamten Bildschirm fallen
  const screenWidth = window.innerWidth;
  for (let i = 0; i < 28; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti flame';
    conf.textContent = '🔥';
    // Zufällige X-Position über den gesamten Bildschirm
    conf.style.position = 'fixed';
    conf.style.left = Math.random() * (screenWidth - 40) + 'px';
    conf.style.top = '-32px';
    conf.style.animationDelay = (Math.random() * 0.7) + 's';
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 2200);
  }
}

function startSimulation() {
  animationArea.innerHTML = '';
  resultMessage.textContent = '';
  resultMessage.className = 'result-message';
  hideResultOverlay();

  const crashProb = getCurrentCrashProbability();
  if (crashProb === null) return;

  // Flugzeug-Emoji mit SVG-Kondensstreifen
  const areaWidth = animationArea.offsetWidth;
  const areaHeight = animationArea.offsetHeight;
  const { wrapper, plane, svg, polyline } = createPlaneWithSVGTrail(areaWidth, areaHeight);
  animationArea.appendChild(svg);
  animationArea.appendChild(wrapper);

  // Zufallsergebnis
  const didCrash = Math.random() < (crashProb / 100);

  // Animation: Flugzeug folgt Graph, Zielpunkt je nach Ergebnis
  animatePlaneAlongPath(plane, 7000, () => {
    setTimeout(() => {
      if (didCrash) {
        plane.classList.add('crash');
        showResultOverlay('crash', 'Abgestürzt!');
        spawnFlameConfetti();
      } else {
        plane.classList.add('survive');
        showResultOverlay('survive', 'Du hättest überlebt!');
        spawnConfetti();
      }
      setTimeout(() => {
        plane.style.transition = 'opacity 1.2s cubic-bezier(.7,.1,.9,1.2)';
        plane.style.opacity = '0';
        if (svg) svg.style.transition = 'opacity 1.2s cubic-bezier(.7,.1,.9,1.2)';
        if (svg) svg.style.opacity = '0';
      }, 1200);
    }, 200);
  }, didCrash, polyline, areaWidth);
}

simulateBtn.addEventListener('click', startSimulation);

// Initiales Rendern
renderAirlineList(); 