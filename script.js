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

// фильтр тем: одна активная, повторный клик снимает выбор
document.querySelectorAll('[data-topics]').forEach(function(box){
  var btns = box.querySelectorAll('button');
  btns.forEach(function(b){
    b.addEventListener('click', function(){
      var on = !b.classList.contains('is-on');
      btns.forEach(function(x){ x.classList.remove('is-on'); });
      b.classList.toggle('is-on', on);
    });
  });
});

// «Показать ещё» раскрывает скрытые карточки и прячется
document.querySelectorAll('[data-more]').forEach(function(btn){
  btn.addEventListener('click', function(){
    var grid = document.getElementById(btn.getAttribute('data-more'));
    if (grid) grid.classList.add('is-expanded');
    btn.parentNode.style.display = 'none';
  });
});

// содержание статьи подсвечивает текущий раздел
var toc = document.querySelector('[data-toc]');
if (toc) {
  var tocLinks = toc.querySelectorAll('a');
  var tocHeads = Array.prototype.map.call(tocLinks, function(a){ return document.querySelector(a.getAttribute('href')); });
  var syncToc = function(){
    var cur = 0;
    tocHeads.forEach(function(h, i){ if (h && h.getBoundingClientRect().top < 170) cur = i; });
    tocLinks.forEach(function(a, i){ a.classList.toggle('is-on', i === cur); });
  };
  window.addEventListener('scroll', syncToc, {passive:true});
  syncToc();
}

// переключатель внутри формы: «для себя / для компании» показывает свой набор полей
document.querySelectorAll('[data-switch]').forEach(function(seg){
  var form = seg.closest('form');
  var hidden = form && form.querySelector('input[name="' + seg.getAttribute('data-switch') + '"]');
  seg.addEventListener('click', function(e){
    var b = e.target.closest('button[data-val]');
    if (!b) return;
    seg.querySelectorAll('button').forEach(function(x){ x.classList.toggle('is-on', x === b); });
    var val = b.getAttribute('data-val');
    form.querySelectorAll('[data-show]').forEach(function(el){ el.hidden = el.getAttribute('data-show') !== val; });
    if (hidden) hidden.value = b.textContent.trim();
  });
});

// плитка темы подставляет тему в форму обращения
document.querySelectorAll('[data-topic]').forEach(function(t){
  t.addEventListener('click', function(){
    var field = document.getElementById(t.getAttribute('data-target'));
    if (field) field.value = t.getAttribute('data-topic');
    document.querySelectorAll('[data-topic]').forEach(function(x){ x.classList.toggle('is-on', x === t); });
    var form = field && field.closest('form');
    if (!form) return;
    var label = form.querySelector('[data-topic-label]');
    if (label) label.textContent = t.textContent.trim();
    // форма рядом — не дёргаем страницу; на телефоне она ниже плиток, туда и ведём
    if (form.getBoundingClientRect().top > window.innerHeight * 0.6) {
      form.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// отправка формы ведёт на «Спасибо»; в адресе только источник, без данных из полей
document.querySelectorAll('form[data-thanks]').forEach(function(f){
  f.addEventListener('submit', function(e){
    e.preventDefault();
    location.href = 'thanks.html?from=' + encodeURIComponent(f.getAttribute('data-thanks'));
  });
});

// текст «Спасибо» зависит от того, из какой формы пришла заявка
var thanksBox = document.querySelector('[data-thanks-page]');
if (thanksBox) {
  var variants = {
    discuss: ['Заявка отправлена', 'Свяжемся, чтобы обсудить задачу. Ответим в течение 00 часов.'],
    course: ['Заявка на курс принята', 'Пришлём подробности о курсе и выбранной версии. Ответим в течение 00 часов.'],
    contacts: ['Сообщение отправлено', 'Ответим на обращение в течение 00 часов.']
  };
  var v = variants[new URLSearchParams(location.search).get('from')] || variants.contacts;
  thanksBox.querySelector('h1').textContent = v[0];
  thanksBox.querySelector('p').textContent = v[1];
}

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

// финальная форма: выбор канала связи показывает поле под этот канал
document.querySelectorAll('[data-channels]').forEach(function(form){
  var input = form.querySelector('[data-contact]');
  var kinds = {
    tg:   ['text',  'Ник или номер в Telegram'],
    max:  ['tel',   'Номер телефона в MAX'],
    wa:   ['tel',   'Номер телефона в WhatsApp'],
    mail: ['email', 'Электронная почта'],
    tel:  ['tel',   'Телефон']
  };
  form.querySelectorAll('[data-ch]').forEach(function(b){
    b.addEventListener('click', function(){
      form.querySelectorAll('[data-ch]').forEach(function(x){ x.classList.toggle('is-on', x === b); });
      var k = kinds[b.getAttribute('data-ch')];
      input.type = k[0];
      input.placeholder = k[1];
      input.required = true;
      input.hidden = false;
      input.value = '';
      input.focus();
    });
  });
});
