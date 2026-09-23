if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  // Menú móvil
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    // Efecto ripple en el punto exacto del clic
    const rect = link.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 1.4;
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    link.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());

    // Pequeño "pulso" de color al hacer clic
    link.classList.remove('is-clicked');
    void link.offsetWidth; // reinicia la animación si se hace clic varias veces seguidas
    link.classList.add('is-clicked');

    navLinks.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Mismo efecto ripple + pulso para los botones del hero (Contactar / Ver cuadros)
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 1.4;
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());

    btn.classList.remove('is-clicked');
    void btn.offsetWidth;
    btn.classList.add('is-clicked');
  });
});

// Formulario de personalización: envía las respuestas directamente a WhatsApp
const customModal = document.getElementById('customModal');
const openCustomForm = document.getElementById('openCustomForm');
const openCustomFormFooter = document.getElementById('openCustomFormFooter');
const closeCustomForm = document.getElementById('closeCustomForm');
const customForm = document.getElementById('customForm');

function showCustomForm() {
  customModal.classList.add('is-open');
  customModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => customForm.querySelector('input')?.focus(), 50);
}

function hideCustomForm() {
  customModal.classList.remove('is-open');
  customModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

openCustomForm?.addEventListener('click', showCustomForm);
openCustomFormFooter?.addEventListener('click', showCustomForm);
closeCustomForm?.addEventListener('click', hideCustomForm);
customModal?.querySelector('[data-close-custom]')?.addEventListener('click', hideCustomForm);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && customModal.classList.contains('is-open')) hideCustomForm();
});

customForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(customForm);
  const message = [
    'Hola RUBITEC, quiero solicitar una personalización.',
    '',
    `Nombre: ${data.get('nombre')}`,
    `Tipo: ${data.get('producto')}`,
    `Idea/estilo: ${data.get('idea')}`,
    `Método de envío: ${data.get('envio')}`,
    `Presupuesto: ${data.get('presupuesto')}`
  ].join('\n');
  window.open(`https://wa.me/525656477873?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  hideCustomForm();
});

// Header cambia de estilo al hacer scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });

// Revelado escalonado de las tarjetas al entrar en pantalla
const cards = document.querySelectorAll('.card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('is-visible'), i * 120);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

cards.forEach(card => observer.observe(card));

/* ===== GALERÍA PRO ===== */
(function(){
  const stage = document.getElementById('galleryPro');
  if (!stage) return;
  const slides = document.querySelectorAll('#gallerySlides .gallery-slide');
  const thumbs = document.querySelectorAll('#galleryThumbs .gallery-thumb');
  const captionTitle = document.getElementById('galleryCaptionTitle');
  const captionCount = document.getElementById('galleryCaptionCount');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const progressBar = document.getElementById('galleryProgressBar');
  const titles = ['Árbol de la vida', 'Atardecer y reflejo', 'Cascada entre montañas', 'Paisaje nevado junto al río', 'Montañas y lago'];
  const total = slides.length;
  let index = 0;
  let autoplayTimer = null;

  function pad(n){ return String(n).padStart(2, '0'); }

  function render(){
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    thumbs.forEach((t, i) => t.classList.toggle('is-active', i === index));
    captionTitle.textContent = titles[index];
    captionCount.textContent = pad(index + 1) + ' / ' + pad(total);
  }

  function goTo(i){
    index = (i + total) % total;
    render();
    restartAutoplay();
  }
  function goPrev(){ goTo(index - 1); }
  function goNext(){ goTo(index + 1); }

  function startProgress(){
    progressBar.classList.remove('is-animating');
    void progressBar.offsetWidth;
    progressBar.classList.add('is-animating');
  }

  function restartAutoplay(){
    if (autoplayTimer) clearTimeout(autoplayTimer);
    startProgress();
    autoplayTimer = setTimeout(() => { goNext(); }, 5000);
  }

  function stopAutoplay(){
    if (autoplayTimer) clearTimeout(autoplayTimer);
    progressBar.classList.remove('is-animating');
  }

  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);
  thumbs.forEach((t, i) => t.addEventListener('click', () => goTo(i)));

  stage.addEventListener('mouseenter', stopAutoplay);
  stage.addEventListener('mouseleave', restartAutoplay);

  let startX = null;
  stage.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; stopAutoplay(); }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 40) goPrev();
    else if (diff < -40) goNext();
    else restartAutoplay();
    startX = null;
  });

  render();
  restartAutoplay();
})();
