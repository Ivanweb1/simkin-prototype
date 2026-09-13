var hdr = document.getElementById('hdr');
window.addEventListener('scroll', function(){
  hdr.classList.toggle('is-scrolled', window.scrollY > 120);
}, {passive:true});

var burger = document.getElementById('burger');
var mnav = document.getElementById('mnav');
burger.addEventListener('click', function(){
  var open = mnav.classList.toggle('is-open');
  burger.classList.toggle('is-on', open);
  burger.setAttribute('aria-expanded', open);
});
mnav.querySelectorAll('a').forEach(function(a){
  a.addEventListener('click', function(){
    mnav.classList.remove('is-open');
    burger.classList.remove('is-on');
    burger.setAttribute('aria-expanded', false);
  });
});

function closeModals(){
  document.querySelectorAll('.modal.is-open').forEach(function(m){ m.classList.remove('is-open'); });
  document.body.style.overflow = '';
}
document.querySelectorAll('[data-open]').forEach(function(el){
  el.addEventListener('click', function(){
    mnav.classList.remove('is-open');
    burger.classList.remove('is-on');
    var m = document.getElementById(el.getAttribute('data-open') || 'callback');
    if (!m) return;
    m.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });
});
document.querySelectorAll('[data-close]').forEach(function(el){
  el.addEventListener('click', closeModals);
});
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') closeModals();
});

var seg = document.querySelector('[data-seg]');
if (seg) {
  seg.addEventListener('click', function(e){
    var b = e.target.closest('button[data-set]');
    if (!b) return;
    var v = b.getAttribute('data-set');
    seg.querySelectorAll('button').forEach(function(x){ x.classList.toggle('is-on', x === b); });
    document.querySelectorAll('[data-ver]').forEach(function(el){
      el.classList.toggle('is-on', el.getAttribute('data-ver') === v);
    });
  });
}

document.querySelectorAll('[data-gallery]').forEach(function(g){
  var label = g.querySelector('.gallery__main span');
  var thumbs = g.querySelectorAll('.gallery__thumbs button');
  thumbs.forEach(function(b, i){
    b.addEventListener('click', function(){
      thumbs.forEach(function(x){ x.classList.toggle('is-on', x === b); });
      if (label) label.textContent = 'Фотография ' + (i + 1);
    });
  });
});

var reveals = document.querySelectorAll('[data-rv]');
function showAll(){
  reveals.forEach(function(el){ el.classList.add('is-in'); });
}
if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  showAll();
} else {
  var fired = false;
  var io = new IntersectionObserver(function(entries){
    fired = true;
    entries.forEach(function(en){
      if(!en.isIntersecting) return;
      en.target.style.transitionDelay = en.target.style.getPropertyValue('--d') || '0s';
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, {rootMargin: '0px 0px -12% 0px', threshold: 0.08});
  reveals.forEach(function(el){ io.observe(el); });
  // страховка: вкладка открыта в фоне или наблюдатель не сработал — показываем всё
  setTimeout(function(){ if(!fired) showAll(); }, 1600);
}
