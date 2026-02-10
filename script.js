/* ============================================================
   SHAIRAPORTRAIT — script.js (FULL FIXED)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  const envStage = document.getElementById('envelope-stage');
  const letStage = document.getElementById('letter-stage');
  const mainStage = document.getElementById('main-stage');

  if (envStage) {
    envStage.style.opacity = '1';
    envStage.style.visibility = 'visible';
  }
  if (letStage) letStage.classList.remove('active');
  if (mainStage) mainStage.classList.remove('active');

  spawnPetals();
});

/* ================= PETALS ================= */

function spawnPetals() {
  const bg = document.getElementById('petalsBg');
  if (!bg) return;

  const colors = ['#c9344a', '#e86070', '#f0a0b0', '#d4607a', '#ff8898'];

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = Math.random() * -60 + 'px';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.width = (8 + Math.random() * 8) + 'px';
    p.style.height = (12 + Math.random() * 10) + 'px';
    p.style.opacity = 0.1 + Math.random() * 0.15;
    p.style.animationDuration = (6 + Math.random() * 10) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    bg.appendChild(p);
  }
}

/* ================= ENVELOPE ================= */

let envelopeOpened = false;

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  const flap = document.getElementById('envFlap');
  const peek = document.getElementById('letterPeek');
  const seal = document.getElementById('waxSeal');
  const hint = document.querySelector('.tap-hint');

  if (seal) seal.classList.add('hide');
  if (hint) hint.style.opacity = '0';

  setTimeout(() => flap && flap.classList.add('open'), 200);
  setTimeout(() => peek && peek.classList.add('risen'), 700);
  setTimeout(showLetterStage, 1600);
}

function showLetterStage() {
  const envStage = document.getElementById('envelope-stage');
  const letStage = document.getElementById('letter-stage');

  if (envStage) {
    envStage.style.opacity = '0';
    envStage.style.visibility = 'hidden';
  }
  if (letStage) letStage.classList.add('active');

  setTimeout(renderTypoPortrait, 400);
}

/* ================= TYPOGRAPHIC PORTRAIT ================= */

function renderTypoPortrait() {
  const canvas = document.getElementById('typoCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const words = [
    'love','you','always','forever','heart','smile','dream','light','mine',
    'beautiful','darling','soul','gentle','grace','tender','warmth','glow',
    'cherish','bloom','dear','adore','embrace','soft','calm','kind','sweet',
    'wonder','together','home','true','pure','fond','precious','breathe',
    'yours','infinity','magic','stars'
  ];

  const INTERNAL_W = 700;
  const FONT_SIZE = 8;
  const COL_W = 36;
  const ROW_H = 10;

  const img = new Image();
  img.src = 'photo.png';

  img.onload = function () {
    const aspect = img.naturalHeight / img.naturalWidth;
    const INTERNAL_H = Math.round(INTERNAL_W * aspect);

    const off = document.createElement('canvas');
    off.width = INTERNAL_W;
    off.height = INTERNAL_H;
    const octx = off.getContext('2d');
    octx.drawImage(img, 0, 0, INTERNAL_W, INTERNAL_H);

    const data = octx.getImageData(0, 0, INTERNAL_W, INTERNAL_H).data;

    const containerW = canvas.parentElement?.clientWidth || 520;
    const scaleOut = containerW / INTERNAL_W;

    canvas.width = containerW;
    canvas.height = Math.round(INTERNAL_H * scaleOut);

    ctx.fillStyle = '#fdf5ec';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textBaseline = 'top';

    let wordIdx = 0;

    for (let y = 0; y < INTERNAL_H; y += ROW_H) {
      for (let x = 0; x < INTERNAL_W; x += COL_W) {
        const idx = (y * INTERNAL_W + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        if (a < 10) continue;

        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        if (brightness > 0.92) continue;

        const t = 1 - brightness;
        const lightness = Math.round(15 + (1 - t) * 60);
        const alpha = 0.25 + t * 0.75;
        const fSize = Math.round(FONT_SIZE * (0.85 + t * 0.4));
        const italic = t > 0.5 ? 'italic ' : '';

        ctx.font = `${italic}${fSize}px "Cormorant Garamond", serif`;
        ctx.fillStyle = `hsla(350,65%,${lightness}%,${alpha})`;
        ctx.fillText(
          words[wordIdx % words.length],
          x * scaleOut,
          y * scaleOut
        );
        wordIdx++;
      }
    }

    canvas.style.opacity = '0';
    canvas.style.transition = 'opacity 1.6s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => (canvas.style.opacity = '1'));
    });
  };
}

/* ================= TRANSITION TO MAIN ================= */

function transitionToMain() {
  const letStage = document.getElementById('letter-stage');
  const mainStage = document.getElementById('main-stage');

  if (!letStage || !mainStage) return;

  letStage.style.opacity = '0';
  letStage.style.transition = 'opacity 1s ease';

  setTimeout(() => {
    letStage.style.visibility = 'hidden';
    mainStage.classList.add('active');
    startMusic();
    spawnFloatingHearts();
    setupCardToggle();
  }, 900);
}

/* ================= CARD TOGGLE (FIXED) ================= */

let cardVisible = true;

function setupCardToggle() {
  const card = document.getElementById('messageCard');
  const hint = document.getElementById('toggleHint');
  const stage = document.getElementById('main-stage');

  if (!card || !hint || !stage) return;

  setTimeout(() => {
    card.style.animation = 'none';
    card.offsetHeight;
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0) scale(1)';
    card.style.pointerEvents = 'all';

    hint.textContent = 'click the card to hide it';
    hint.style.opacity = '1';
    setTimeout(() => (hint.style.opacity = '0'), 3000);
  }, 2200);

  card.addEventListener('click', function (e) {
    e.stopPropagation();

    if (!cardVisible) return;
    cardVisible = false;

    card.style.opacity = '0';
    card.style.transform = 'translateY(12px) scale(0.96)';
    card.style.pointerEvents = 'none';

    hint.textContent = 'click anywhere to show again';
    hint.style.opacity = '1';
    setTimeout(() => (hint.style.opacity = '0'), 3000);
  });

  stage.addEventListener('click', function (e) {
    if (e.target.closest('.music-bar')) return;
    if (cardVisible) return;

    cardVisible = true;
    card.style.opacity = '1';
    card.style.transform = 'translateY(0) scale(1)';
    card.style.pointerEvents = 'all';

    hint.textContent = 'click the card to hide it';
    hint.style.opacity = '1';
    setTimeout(() => (hint.style.opacity = '0'), 2500);
  });
}

/* ================= MUSIC ================= */

function startMusic() {
  const music = document.getElementById('bgMusic');
  if (!music) return;

  music.volume = 0;

  music.play().catch(() => {
    document.addEventListener(
      'click',
      () => {
        music.play();
        fadeInMusic(music);
      },
      { once: true }
    );
  });

  fadeInMusic(music);
}

function fadeInMusic(audio) {
  let vol = 0;
  const i = setInterval(() => {
    vol = Math.min(1, vol + 0.02);
    audio.volume = vol;
    if (vol >= 1) clearInterval(i);
  }, 80);
}

/* ================= FLOATING HEARTS ================= */

function spawnFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  if (!container) return;

  const symbols = ['♥', '❤', '♡', '❥'];

  function addHeart() {
    const h = document.createElement('div');
    h.className = 'fheart';
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = (0.8 + Math.random() * 1.4) + 'rem';
    h.style.animationDuration = (7 + Math.random() * 10) + 's';
    h.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(h);
    setTimeout(() => h.remove(), 20000);
  }

  for (let i = 0; i < 8; i++) setTimeout(addHeart, i * 600);
  setInterval(addHeart, 2200);
}
