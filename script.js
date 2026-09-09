/* ==========================================================================
   STUDIO MAXIMA - MAXIMALIST INTERACTIVE JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. WEB AUDIO SYNTHESIZER ENGINE
  // --------------------------------------------------------------------------
  let audioEnabled = true;
  let audioCtx = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
  }

  function playHoverSound() {
    if (!audioEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // Audio context fallbacks
    }
  }

  function playClickSound() {
    if (!audioEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  }

  function playThemeChangeSound() {
    if (!audioEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.04);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.04 + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.04);
        osc.stop(audioCtx.currentTime + idx * 0.04 + 0.1);
      });
    } catch (e) {}
  }

  function playSuccessSynth() {
    if (!audioEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const chord = [440, 554.37, 659.25, 880];
      chord.forEach(freq => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      });
    } catch (e) {}
  }

  // Attach hover sounds to interactive elements
  const interactiveSelector = 'button, a, .project-card, .brutal-card, input, select, textarea';
  document.querySelectorAll(interactiveSelector).forEach(el => {
    el.addEventListener('mouseenter', playHoverSound);
    el.addEventListener('click', playClickSound);
  });

  // --------------------------------------------------------------------------
  // 2. DYNAMIC CHAOS THEME SHIFTER
  // --------------------------------------------------------------------------
  const themes = ['default', 'acid-retro', 'cyber-brutal', 'electric-sunset', 'mono-chaos'];
  const themeNames = {
    'default': 'ACID CYBER NEON',
    'acid-retro': 'ACID RETRO SUNSHINE',
    'cyber-brutal': 'CYBER BRUTAL PUNK',
    'electric-sunset': 'ELECTRIC SUNSET',
    'mono-chaos': 'HIGH-CONTRAST MONO'
  };
  let currentThemeIndex = 0;

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeLabel = document.getElementById('themeLabel');

  themeToggleBtn.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    
    document.body.setAttribute('data-theme', newTheme);
    themeLabel.textContent = `THEME: ${themeNames[newTheme]}`;
    
    playThemeChangeSound();
    createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2);
  });

  // Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuBtn.querySelector('span').textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.querySelector('span').textContent = '☰';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. CUSTOM CURSOR & PARTICLES
  // --------------------------------------------------------------------------
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  window.addEventListener('click', (e) => {
    createSparkleBurst(e.clientX, e.clientY);
  });

  function createSparkleBurst(x, y) {
    const burstCount = 8;
    for (let i = 0; i < burstCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = '8px';
      particle.style.height = '8px';
      particle.style.background = i % 2 === 0 ? 'var(--accent-lime)' : 'var(--accent-pink)';
      particle.style.border = '1px solid #000';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '99999';
      
      const angle = (Math.PI * 2 / burstCount) * i;
      const velocity = 40 + Math.random() * 30;
      const destX = Math.cos(angle) * velocity;
      const destY = Math.sin(angle) * velocity;
      
      document.body.appendChild(particle);
      
      particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${destX}px, ${destY}px) scale(0)`, opacity: 0 }
      ], {
        duration: 500,
        easing: 'cubic-bezier(0,0,0.2,1)'
      }).onfinish = () => particle.remove();
    }
  }

  // --------------------------------------------------------------------------
  // 4. DRAGGABLE STICKER BOARD ENGINE
  // --------------------------------------------------------------------------
  const stickerBoard = document.getElementById('stickerBoard');
  const spawnStickerBtn = document.getElementById('spawnStickerBtn');
  const resetStickersBtn = document.getElementById('resetStickersBtn');

  function initDraggables() {
    document.querySelectorAll('.draggable-sticker').forEach(sticker => {
      let isDragging = false;
      let startX, startY, initialLeft, initialTop;

      sticker.addEventListener('pointerdown', (e) => {
        isDragging = true;
        sticker.setPointerCapture(e.pointerId);
        
        startX = e.clientX;
        startY = e.clientY;
        
        const rect = sticker.getBoundingClientRect();
        const boardRect = stickerBoard.getBoundingClientRect();
        
        initialLeft = rect.left - boardRect.left;
        initialTop = rect.top - boardRect.top;

        playClickSound();
      });

      sticker.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        sticker.style.left = `${initialLeft + dx}px`;
        sticker.style.top = `${initialTop + dy}px`;
      });

      const stopDrag = (e) => {
        if (isDragging) {
          isDragging = false;
          try { sticker.releasePointerCapture(e.pointerId); } catch (err) {}
        }
      };

      sticker.addEventListener('pointerup', stopDrag);
      sticker.addEventListener('pointercancel', stopDrag);
    });
  }

  initDraggables();

  const stickerPresets = [
    { text: '💥 ULTRA CHAOS 💥', bg: 'var(--accent-pink)', color: '#fff' },
    { text: '★ AVANT-GARDE ★', bg: 'var(--accent-lime)', color: '#000' },
    { text: '⚡ MAXIMUM VOLTAGE', bg: 'var(--accent-cyan)', color: '#000' },
    { text: '🔮 2026 CYBER ERA', bg: 'var(--accent-purple)', color: '#fff' },
    { text: '🔥 RAW BRUTALISM', bg: 'var(--accent-yellow)', color: '#000' }
  ];

  spawnStickerBtn.addEventListener('click', () => {
    const preset = stickerPresets[Math.floor(Math.random() * stickerPresets.length)];
    const newSticker = document.createElement('div');
    newSticker.className = 'draggable-sticker';
    
    const randomLeft = 40 + Math.random() * (stickerBoard.clientWidth - 200);
    const randomTop = 40 + Math.random() * (stickerBoard.clientHeight - 100);
    const randomRotation = -15 + Math.random() * 30;

    newSticker.style.left = `${randomLeft}px`;
    newSticker.style.top = `${randomTop}px`;
    newSticker.style.transform = `rotate(${randomRotation}deg)`;

    newSticker.innerHTML = `<div class="sticker-pill" style="background: ${preset.bg}; color: ${preset.color};">${preset.text}</div>`;
    
    stickerBoard.appendChild(newSticker);
    initDraggables();
    
    newSticker.addEventListener('mouseenter', playHoverSound);
    newSticker.addEventListener('click', playClickSound);

    playSuccessSynth();
  });

  resetStickersBtn.addEventListener('click', () => {
    stickerBoard.querySelectorAll('.draggable-sticker').forEach((s, idx) => {
      s.style.left = `${40 + (idx * 60) % (stickerBoard.clientWidth - 150)}px`;
      s.style.top = `${60 + (idx * 50) % (stickerBoard.clientHeight - 80)}px`;
    });
    playClickSound();
  });

  // --------------------------------------------------------------------------
  // 5. GENERATIVE CANVAS ART ENGINE
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('generativeCanvas');
  const ctx = canvas.getContext('2d');

  const sliderChaos = document.getElementById('sliderChaos');
  const sliderSpeed = document.getElementById('sliderSpeed');
  const sliderSize = document.getElementById('sliderSize');
  const selectPattern = document.getElementById('selectPattern');

  const valChaos = document.getElementById('valChaos');
  const valSpeed = document.getElementById('valSpeed');
  const valSize = document.getElementById('valSize');
  const randomizeArtBtn = document.getElementById('randomizeArtBtn');

  function resizeCanvas() {
    if (!canvas.parentElement) return;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  let tick = 0;

  sliderChaos.addEventListener('input', (e) => valChaos.textContent = e.target.value);
  sliderSpeed.addEventListener('input', (e) => valSpeed.textContent = e.target.value);
  sliderSize.addEventListener('input', (e) => valSize.textContent = e.target.value);

  randomizeArtBtn.addEventListener('click', () => {
    sliderChaos.value = Math.floor(20 + Math.random() * 120);
    sliderSpeed.value = Math.floor(1 + Math.random() * 15);
    sliderSize.value = Math.floor(20 + Math.random() * 70);
    
    valChaos.textContent = sliderChaos.value;
    valSpeed.textContent = sliderSpeed.value;
    valSize.textContent = sliderSize.value;

    const options = ['cyberGrid', 'acidVortices', 'brutalRays'];
    selectPattern.value = options[Math.floor(Math.random() * options.length)];
    
    playThemeChangeSound();
  });

  function renderGenerativeArt() {
    if (!canvas.width || !canvas.height) {
      requestAnimationFrame(renderGenerativeArt);
      return;
    }

    const chaos = parseInt(sliderChaos.value, 10);
    const speed = parseInt(sliderSpeed.value, 10) * 0.02;
    const size = parseInt(sliderSize.value, 10);
    const pattern = selectPattern.value;

    tick += speed;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cols = Math.floor(canvas.width / size);
    const rows = Math.floor(canvas.height / size);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * size + size / 2;
        const y = j * size + size / 2;

        if (pattern === 'cyberGrid') {
          const dist = Math.sin(tick + (i * 0.3) + (j * 0.3)) * (chaos * 0.2);
          ctx.strokeStyle = `hsl(${(i * 20 + j * 10 + tick * 50) % 360}, 100%, 50%)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, Math.abs(dist) + 2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (pattern === 'acidVortices') {
          const angle = Math.atan2(y - canvas.height / 2, x - canvas.width / 2) + tick;
          ctx.strokeStyle = (i + j) % 2 === 0 ? '#ccff00' : '#ff007f';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(angle) * (size * 0.6), y + Math.sin(angle) * (size * 0.6));
          ctx.stroke();
        } else if (pattern === 'brutalRays') {
          const glitchY = y + Math.sin(tick * 3 + i) * chaos * 0.1;
          ctx.fillStyle = `hsl(${(i * 40 + tick * 100) % 360}, 90%, 60%)`;
          ctx.fillRect(x - size / 4, glitchY - size / 4, size / 2, size / 2);
        }
      }
    }

    requestAnimationFrame(renderGenerativeArt);
  }
  renderGenerativeArt();

  // --------------------------------------------------------------------------
  // 6. PORTFOLIO FILTER & LIGHTBOX MODAL
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterVal === 'all' || card.getAttribute('data-category') === filterVal) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
      playClickSound();
    });
  });

  const modalOverlay = document.getElementById('modalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalDesc = document.getElementById('modalDesc');

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.project-title').textContent;
      const desc = card.querySelector('.project-desc').textContent;
      const imgSrc = card.querySelector('img').getAttribute('src');

      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modalImage.setAttribute('src', imgSrc);

      modalOverlay.classList.add('active');
      modalOverlay.setAttribute('aria-hidden', 'false');
      playSuccessSynth();
    });
  });

  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    playClickSound();
  }

  // --------------------------------------------------------------------------
  // 7. INTERACTIVE CONTACT FORM
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    playSuccessSynth();
    createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2);

    contactForm.style.opacity = '0.5';
    contactForm.style.pointerEvents = 'none';
    formSuccessMessage.style.display = 'block';

    setTimeout(() => {
      contactForm.reset();
      contactForm.style.opacity = '1';
      contactForm.style.pointerEvents = 'auto';
    }, 4000);
  });

  // --------------------------------------------------------------------------
  // 8. REALTIME SYSTEM CLOCK
  // --------------------------------------------------------------------------
  const systemTimeClock = document.getElementById('systemTimeClock');

  function updateClock() {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const dateStr = now.toISOString().split('T')[0];
    systemTimeClock.textContent = `SYSTEM TIME: ${dateStr} // ${timeStr} UTC`;
  }
  setInterval(updateClock, 1000);
  updateClock();
});
