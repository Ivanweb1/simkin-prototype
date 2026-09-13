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

var modal = document.getElementById('callback');
function setModal(open){
  modal.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
document.querySelectorAll('[data-open]').forEach(function(el){
  el.addEventListener('click', function(){
    mnav.classList.remove('is-open');
    burger.classList.remove('is-on');
    setModal(true);
  });
});
document.querySelectorAll('[data-close]').forEach(function(el){
  el.addEventListener('click', function(){ setModal(false); });
});
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') setModal(false);
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
