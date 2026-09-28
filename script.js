const MAX_CANDLES = 100;

const configForm = document.getElementById('config-form');
const configAgeInput = document.getElementById('age-input');
const configMessage = document.getElementById('message');

if (configForm && configAgeInput && configMessage) {
  configForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const age = configAgeInput.valueAsNumber;

    if (!Number.isFinite(age) || !Number.isInteger(age) || age < 1) {
      configMessage.textContent = 'Please enter a whole number age from 1 to 100.';
      return;
    }

    window.location.href = `candles.html?age=${encodeURIComponent(age)}`;
  });
}

const candles = document.getElementById('candles');
const cakeScene = document.getElementById('cake-scene');
const candleTemplate = document.getElementById('candle-template');
const resetButton = document.getElementById('reset-button');
const candlesMessage = configForm ? null : document.getElementById('message');

if (candles && cakeScene && candleTemplate && resetButton && candlesMessage) {
  const params = new URLSearchParams(window.location.search);
  const requestedAge = Number(params.get('age'));

  let activeCount = 0;
  let currentCount = 0;

  function setMessage(text) {
    candlesMessage.textContent = text;
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

    setMessage(`Tap any candle to blow it out, or tap elsewhere to blow out all ${count}.`);
  }

  function blowOutAllCandles() {
    if (activeCount === 0) {
      return;
    }

    candles.querySelectorAll('.candle:not(.out)').forEach((candle) => {
      blowOutCandle(candle);
    });
  }

  const hasValidAge = Number.isFinite(requestedAge) && Number.isInteger(requestedAge) && requestedAge >= 1;

  if (!hasValidAge) {
    resetButton.disabled = true;
    setMessage('Please go back and enter a whole number age from 1 to 100.');
  } else if (requestedAge > MAX_CANDLES) {
    renderCandles(MAX_CANDLES);
    setMessage(`That is a lot of candles, so we lit the first ${MAX_CANDLES} for you.`);
  } else {
    renderCandles(requestedAge);
  }

  resetButton.addEventListener('click', () => {
    if (currentCount > 0) {
      renderCandles(currentCount);
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest('.candle') || target.closest('.actions')) {
      return;
    }

    blowOutAllCandles();
  });
}
