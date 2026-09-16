// --- CONTADOR ---
const START_DATE = new Date(2026, 3, 15, 0, 0, 0); 

function updateCounter() {
  const now = new Date();
  let diff = now - START_DATE; 
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

updateCounter();
setInterval(updateCounter, 60 * 1000);

// --- AUDIO ---
const playButton = document.getElementById('playButton');
const audioPlayer = document.getElementById('audioPlayer');

if (playButton && audioPlayer) {
  let isPlaying = false;

  function updateButtonState() {
    playButton.querySelector('span.icon').textContent = isPlaying ? '⏸️' : '▶️';
  }

  playButton.addEventListener('click', async () => {
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

  audioPlayer.addEventListener('ended', () => {
    isPlaying = false;
    updateButtonState();
  });
}

// --- GALERÍA (RUTAS CORRECTAS) ---
const galleryConfig = {
  'con-beibi': [
    { base: 'web/imagenes/con-beibis/con-beibi1', caption: 'Soñamos con este momento.' },
    { base: 'web/imagenes/con-beibis/con-beibi2', caption: 'Imaginando risas en el parque.' },
    { base: 'web/imagenes/con-beibis/con-beibi3', caption: 'Pequeños pasos, grandes sueños.' }
  ],
  'juntos': [
    { base: 'web/imagenes/juntos/juntos', caption: 'Momentos felices juntos.' },
    { base: 'web/imagenes/juntos/juntos2', caption: 'Riendo sin prisa.' },
    { base: 'web/imagenes/juntos/juntos3', caption: 'Cada día contigo es especial.' },
    { base: 'web/imagenes/juntos/juntos4', caption: 'Momentos simples que valen oro.' }
  ]
};

let currentCategory = 'juntos';
let currentIndex = 0;

const galleryImage = document.getElementById('galleryImage');
const galleryCaption = document.getElementById('galleryCaption');

// Comprueba si la imagen existe
function testImage(url){
  return new Promise(resolve=>{
    const img = new Image();
    img.onload = ()=> resolve(true);
    img.onerror = ()=> resolve(false);
    img.src = url;
  });
}

// Devuelve la ruta correcta con extensión
async function resolveImage(base){
  const exts = ['.jpg','.jpeg','.png','.webp'];
  for(const ext of exts){
    const candidate = base + ext;
    if(await testImage(candidate)) return candidate;
  }
  return '';
}

async function renderGallery(){
  const item = galleryConfig[currentCategory][currentIndex];
  const src = await resolveImage(item.base);

  galleryImage.src = src;
  galleryCaption.textContent = item.caption;
}

document.getElementById('prevBtn').addEventListener('click', ()=>{
  currentIndex = (currentIndex - 1 + galleryConfig[currentCategory].length) % galleryConfig[currentCategory].length;
  renderGallery();
});

document.getElementById('nextBtn').addEventListener('click', ()=>{
  currentIndex = (currentIndex + 1) % galleryConfig[currentCategory].length;
  renderGallery();
});

document.querySelectorAll('.cat-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.cat;
    currentIndex = 0;
    renderGallery();
  });
});

renderGallery();
