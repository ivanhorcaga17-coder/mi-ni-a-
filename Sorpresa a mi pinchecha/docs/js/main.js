// Copia de main.js para docs/
// Contador desde 15/04/2026 y controlador de audio para el botón.

// CONFIG: si quieres cambiar la fecha de inicio, edítala aquí
const START_DATE = new Date(2026, 3, 15, 0, 0, 0); // Abril = 3 (meses 0-based)

function updateCounter() {
  const now = new Date();
  let diff = now - START_DATE; // diferencia en ms
  if (diff < 0) diff = 0;

  const minutesTotal = Math.floor(diff / (1000 * 60));
  const days = Math.floor(minutesTotal / (60 * 24));
  const hours = Math.floor((minutesTotal % (60 * 24)) / 60);
  const minutes = Math.floor(minutesTotal % 60);

  const el = document.getElementById('counter');
  if (el) {
    el.textContent = `${days} días, ${hours} horas y ${minutes} minutos contigo 💙`;
  }
}

// Actualiza inmediatamente y cada minuto
updateCounter();
setInterval(updateCounter, 60 * 1000);

// Reproducción de audio
const playButton = document.getElementById('playButton');
const audioPlayer = document.getElementById('audioPlayer');

if (playButton && audioPlayer) {
  // Comentario: coloca tu archivo en docs/audio/audio.mp3
  // Ejemplo de ruta relativa ya incluida en HTML: audio/audio.mp3

  let isPlaying = false;

  function updateButtonState() {
    if (!playButton) return;
    if (isPlaying) {
      playButton.classList.add('playing');
      playButton.querySelector('span.icon').textContent = '⏸️';
    } else {
      playButton.classList.remove('playing');
      playButton.querySelector('span.icon').textContent = '▶️';
    }
  }

  playButton.addEventListener('click', async () => {
    // Si no hay src, avisa al usuario
    if (!audioPlayer.src || audioPlayer.src.trim() === '') {
      alert('No hay audio configurado. Coloca tu archivo en /docs/audio/audio.mp3');
      return;
    }

    try {
      if (!isPlaying) {
        await audioPlayer.play();
        isPlaying = true;
      } else {
        audioPlayer.pause();
        isPlaying = false;
      }
    } catch (err) {
      console.warn('Error al reproducir audio:', err);
    }
    updateButtonState();
  });

  // Cuando termina el audio, restablece el botón
  audioPlayer.addEventListener('ended', () => {
    isPlaying = false;
    updateButtonState();
  });
}

// --- GALERÍA INTERACTIVA ---
// Configuración: coloca imágenes en estas carpetas o cambia los arrays abajo
// - docs/img/con-beibi/1.jpg, 2.jpg, 3.jpg  (imágenes IA con bebés)
// - docs/img/juntos/1.jpg, 2.jpg, 3.jpg    (fotos juntos)

// Ahora usamos 'base' sin extensión para que el script pruebe varias extensiones y rutas.
const galleryConfig = {
  'con-beibi': [
    { base: 'img/con-beibi/1', caption: 'Soñamos con este momento: aquí imaginamos nuestro futuro con pequeños. Nombres que nos gustan: Alan, Iván (chicos) y Atenea, Laura (chicas).' },
    { base: 'img/con-beibi/2', caption: 'Imaginando risas en el parque, abrazos y noches contando estrellas.' },
    { base: 'img/con-beibi/3', caption: 'Pequeños pasos, grandes sueños — cuando podamos, será nuestro mejor plan.' }
  ],
  'juntos': [
    { base: 'img/juntos/1', caption: 'Uno de nuestros momentos favoritos, juntos y felices.' },
    { base: 'img/juntos/2', caption: 'Riendo sin prisa, construyendo recuerdos que duran.' },
    { base: 'img/juntos/3', caption: 'Cada día contigo es un capítulo nuevo que quiero leer siempre.' }
  ]
};

let currentCategory = 'juntos';
let currentIndex = 0;
let autoplayTimer = null;

const galleryImage = document.getElementById('galleryImage');
const galleryCaption = document.getElementById('galleryCaption');
const galleryDots = document.getElementById('galleryDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const catButtons = document.querySelectorAll('.cat-btn');
const galleryDisplay = document.getElementById('galleryDisplay');

const PLACEHOLDER_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#071024"/><text x="50%" y="50%" fill="#7fbfff" font-size="28" font-family="Arial,Helvetica,sans-serif" text-anchor="middle">Coloca tus imágenes en /docs/img/ (con-beibi, juntos)</text></svg>'
);

function testImage(url){
  return new Promise((resolve)=>{
    const img = new Image();
    img.onload = ()=> resolve(true);
    img.onerror = ()=> resolve(false);
    img.src = url;
  });
}

// Intenta varias extensiones y rutas posibles (incluye carpeta alternativas), devuelve la primera válida o el placeholder
async function resolveImage(base){
  const exts = ['.jpg','.jpeg','.png','.webp','.gif'];
  const prefixes = ['', 'imagenes/']; // prueba también la carpeta 'imagenes/' si tus ficheros vienen así

  for(const p of prefixes){
    for(const e of exts){
      const candidate = p + base + e;
      // Si ya es una URL absoluta (http), pruébala tal cual
      if(/^https?:\/\//.test(base)){
        const ok = await testImage(base);
        if(ok) return base;
        break;
      }
      const ok = await testImage(candidate);
      if(ok) return candidate;
    }
  }
  return PLACEHOLDER_SVG;
}

function renderDots(count){
  if(!galleryDots) return;
  galleryDots.innerHTML = '';
  for(let i=0;i<count;i++){
    const d = document.createElement('div');
    d.className = 'dot' + (i===currentIndex? ' active':'');
    d.dataset.index = i;
    d.addEventListener('click', ()=>{ currentIndex = i; renderGallery(); resetAutoplay(); });
    galleryDots.appendChild(d);
  }
}

async function renderGallery(){
  const list = galleryConfig[currentCategory] || [];
  if(list.length===0){
    galleryImage.src = PLACEHOLDER_SVG;
    galleryCaption.textContent = '';
    renderDots(0);
    return;
  }
  if(currentIndex < 0) currentIndex = list.length - 1;
  if(currentIndex >= list.length) currentIndex = 0;

  const item = list[currentIndex];
  const src = await resolveImage(item.base || item.src || '');
  galleryImage.src = src;
  galleryImage.alt = item.caption || 'Foto';
  galleryCaption.textContent = item.caption || '';
  renderDots(list.length);
}

function prevImage(){ currentIndex--; renderGallery(); resetAutoplay(); }
function nextImage(){ currentIndex++; renderGallery(); resetAutoplay(); }

prevBtn && prevBtn.addEventListener('click', prevImage);
nextBtn && nextBtn.addEventListener('click', nextImage);

catButtons && catButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    catButtons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    if(cat && galleryConfig[cat]){
      currentCategory = cat;
      currentIndex = 0;
      renderGallery();
      resetAutoplay();
    }
  });
});

// Autoplay
function startAutoplay(){
  stopAutoplay();
  autoplayTimer = setInterval(()=>{ currentIndex++; renderGallery(); }, 5000);
}
function stopAutoplay(){ if(autoplayTimer){ clearInterval(autoplayTimer); autoplayTimer = null; } }
function resetAutoplay(){ stopAutoplay(); startAutoplay(); }

// Pausa al pasar el ratón
if(galleryDisplay){
  galleryDisplay.addEventListener('mouseenter', stopAutoplay);
  galleryDisplay.addEventListener('mouseleave', startAutoplay);
}

// Modal fullscreen al clicar
function openModal(src){
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `<button class="close">✕</button><img src="${src}" alt="Imagen grande">`;
  modal.querySelector('.close').addEventListener('click', ()=>document.body.removeChild(modal));
  modal.addEventListener('click', (e)=>{ if(e.target===modal) document.body.removeChild(modal); });
  document.body.appendChild(modal);
}

galleryImage && galleryImage.addEventListener('click', ()=> openModal(galleryImage.src));

// Inicializa
renderGallery();
startAutoplay();

// --- Minijuego: Atrapa corazones (docs) ---
const openGameBtn = document.getElementById('openGameBtn');
const gameModal = document.getElementById('gameModal');
const closeGame = document.getElementById('closeGame');
const startGameBtn = document.getElementById('startGame');
const resetGameBtn = document.getElementById('resetGame');
const gameArea = document.getElementById('gameArea');
const gameTimerEl = document.getElementById('gameTimer');
const gameScoreEl = document.getElementById('gameScore');
const gameResult = document.getElementById('gameResult');

let gameInterval = null;
let spawnInterval = null;
let gameTime = 20;
let gameScore = 0;

function openGame(){ if(gameModal) gameModal.setAttribute('aria-hidden','false'); }
function closeGameModal(){ if(gameModal) gameModal.setAttribute('aria-hidden','true'); stopGame(); }

function startGame(){
  stopGame();
  gameTime = 20; gameScore = 0; updateGameUI();
  gameInterval = setInterval(()=>{
    gameTime--; if(gameTimerEl) gameTimerEl.textContent = gameTime;
    if(gameTime <= 0){ stopGame(); showResult(); }
  },1000);
  spawnInterval = setInterval(spawnHeart,700);
}

function stopGame(){ if(gameInterval){ clearInterval(gameInterval); gameInterval=null;} if(spawnInterval){ clearInterval(spawnInterval); spawnInterval=null;} clearHearts(); }

function resetGame(){ stopGame(); gameTime = 20; gameScore=0; updateGameUI(); }

function updateGameUI(){ if(gameTimerEl) gameTimerEl.textContent = gameTime; if(gameScoreEl) gameScoreEl.textContent = gameScore; }

function spawnHeart(){ if(!gameArea) return; const h = document.createElement('div'); h.className='heart'; h.textContent='❤';
  const areaRect = gameArea.getBoundingClientRect();
  const size = 48;
  const x = Math.random()*(areaRect.width - size);
  const y = Math.random()*(areaRect.height - size);
  h.style.left = `${x}px`; h.style.top = `${y}px`;
  h.addEventListener('click', ()=>{ gameScore+=1; updateGameUI(); popHeart(h); });
  gameArea.appendChild(h);
  // fade out after 2.5s if not clicked
  setTimeout(()=>{ if(h.parentNode){ h.style.opacity='0'; setTimeout(()=>h.remove(),300); } },2500);
}

function popHeart(el){ if(!el) return; el.style.transform='scale(0.6)'; el.style.opacity='0'; setTimeout(()=>{ if(el.parentNode) el.parentNode.removeChild(el); },220); }

function clearHearts(){ if(!gameArea) return; gameArea.querySelectorAll('.heart').forEach(h=>h.remove()); }

function showResult(){ updateGameUI(); if(gameResult) gameResult.textContent = `Has conseguido ${gameScore} ♥. ¡Eres increíble!`; }

// Events
openGameBtn && openGameBtn.addEventListener('click', openGame);
closeGame && closeGame.addEventListener('click', closeGameModal);
startGameBtn && startGameBtn.addEventListener('click', startGame);
resetGameBtn && resetGameBtn.addEventListener('click', resetGame);

