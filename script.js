const MAX_CANDLES = 100;

const form = document.getElementById('candle-form');
const ageInput = document.getElementById('age-input');
const resetButton = document.getElementById('reset-button');
const message = document.getElementById('message');
const candles = document.getElementById('candles');
const cakeScene = document.getElementById('cake-scene');
const candleTemplate = document.getElementById('candle-template');

let activeCount = 0;
let currentCount = 0;

function setMessage(text) {
  message.textContent = text;
}

function clearCelebration() {
  cakeScene.querySelectorAll('.celebration, .confetti').forEach((node) => node.remove());
}

function showCelebration() {
  clearCelebration();

  const banner = document.createElement('div');
  banner.className = 'celebration';
  banner.textContent = '🎉 Happy Birthday! 🎉';
  cakeScene.appendChild(banner);

  ['🎊', '✨', '🎉', '⭐', '🎈', '🥳'].forEach((icon, index) => {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.textContent = icon;
    piece.style.setProperty('--x', `${-180 + index * 72}px`);
    piece.style.setProperty('--r', `${-180 + index * 70}deg`);
    cakeScene.appendChild(piece);
  });
}

function blowOutCandle(candle) {
  if (candle.classList.contains('out')) {
    return;
  }

  candle.classList.add('out');
  candle.setAttribute('aria-label', 'Candle blown out');
  activeCount -= 1;

  if (activeCount === 0 && currentCount > 0) {
    setMessage('🎉 Every candle is out! Make a wish! 🎉');
    showCelebration();
  } else {
    setMessage(`${activeCount} candle${activeCount === 1 ? '' : 's'} still glowing.`);
  }
}

function createCandle() {
  const candle = candleTemplate.content.firstElementChild.cloneNode(true);
  candle.addEventListener('click', () => blowOutCandle(candle));
  return candle;
}

function renderCandles(count) {
  candles.replaceChildren();
  clearCelebration();

  currentCount = count;
  activeCount = count;

  for (let i = 0; i < count; i += 1) {
    candles.appendChild(createCandle());
  }

  resetButton.hidden = count === 0;
  setMessage(`Tap the candles to blow them out — ${count} total!`);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const age = ageInput.valueAsNumber;

  if (!Number.isFinite(age) || !Number.isInteger(age) || age < 1) {
    resetButton.hidden = true;
    candles.replaceChildren();
    clearCelebration();
    currentCount = 0;
    activeCount = 0;
    setMessage('Please enter a whole number age from 1 to 100.');
    return;
  }

  if (age > MAX_CANDLES) {
    renderCandles(MAX_CANDLES);
    setMessage(`That is a lot of candles, so we lit the first ${MAX_CANDLES} for you.`);
    return;
  }

  renderCandles(age);
});

resetButton.addEventListener('click', () => {
  if (currentCount > 0) {
    renderCandles(currentCount);
  }
});
