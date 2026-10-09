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
    // кнопка может сразу выбрать нужный вариант в форме окна (например, версию курса)
    var v = el.getAttribute('data-version');
    var pick = v && m.querySelector('[data-switch] button[data-val="' + v + '"]');
    if (pick) pick.click();
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

// отправка формы ведёт на «Спасибо»; в адресе только источник, без данных из полей.
// Страница «Спасибо» одна, в корне: из папки design/ к ней ведёт ../
document.querySelectorAll('form[data-thanks]').forEach(function(f){
  f.addEventListener('submit', function(e){
    e.preventDefault();
    var base = /\/design\//.test(location.pathname) ? '../' : '';
    location.href = base + 'thanks.html?from=' + encodeURIComponent(f.getAttribute('data-thanks'));
  });
});

// MAX: прямой ссылки на чат по номеру у мессенджера нет, контакт ищут по
// телефону. Поэтому ссылка открывает окно с номером и кнопками «Скопировать»
// и «Открыть MAX». Без скрипта ссылка просто ведёт в веб-версию MAX.
document.querySelectorAll('[data-max]').forEach(function(a){
  a.addEventListener('click', function(e){
    var m = document.getElementById('maxinfo');
    if (!m) return;
    e.preventDefault();
    mnav.classList.remove('is-open');
    burger.classList.remove('is-on');
    m.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });
});
document.querySelectorAll('[data-copy]').forEach(function(b){
  b.addEventListener('click', function(){
    var text = b.getAttribute('data-copy');
    var label = b.textContent;
    function done(){ b.textContent = 'Номер скопирован'; setTimeout(function(){ b.textContent = label; }, 2000); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function(){});
    } else {
      var t = document.createElement('textarea');
      t.value = text; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(); } catch (err) {}
      t.remove();
    }
  });
});

// текст «Спасибо» зависит от того, из какой формы пришла заявка
var thanksBox = document.querySelector('[data-thanks-page]');
if (thanksBox) {
  var variants = {
    discuss: ['Заявка отправлена', 'Свяжемся с вами, чтобы обсудить задачу.'],
    company: ['Заявка отправлена', 'Свяжемся с вами, уточним задачу и предложим подходящий формат работы.'],
    course: ['Заявка на курс принята', 'Пришлём подробности о курсе и выбранной версии.'],
    contacts: ['Сообщение отправлено', 'Спасибо за обращение – скоро ответим.'],
    partner: ['Заявка отправлена', 'Свяжемся с вами, чтобы обсудить совместную разработку.'],
    launch: ['Вы в списке', 'Сообщим о запуске, как только разработка будет готова.']
  };
  var v = variants[new URLSearchParams(location.search).get('from')] || variants.contacts;
  thanksBox.querySelector('h1').textContent = v[0];
  thanksBox.querySelector('p').textContent = v[1];
}

var reveals = [].slice.call(document.querySelectorAll('[data-rv]'));
function showAll(){
  reveals.forEach(function(el){ el.classList.add('is-in'); });
}
// Первый экран видно без прокрутки, поэтому он проявляется сразу при загрузке,
// а не через наблюдателя: тот не засчитывает нижние 12% экрана, и подпись к фото
// на мобильной — она стоит ровно там — ждала бы скролла.
var atOnce = [].slice.call(document.querySelectorAll('.dhero [data-rv], .dcohero [data-rv]'));
if (atOnce.length) {
  reveals = reveals.filter(function(el){ return atOnce.indexOf(el) === -1; });
  atOnce.forEach(function(el){
    el.style.transitionDelay = el.style.getPropertyValue('--d') || '0s';
  });
  void document.body.offsetHeight; // рефлоу: стартовое состояние зафиксировано, переход сыграет
  atOnce.forEach(function(el){ el.classList.add('is-in'); });
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

// Отзывы компаний: превью-карточки .drev[data-rev] и просмотр скана крупно.
// Скан лежит в design/assets/reviews/<id>.jpg, превью — <id>-sm.jpg; превью
// подставляется только карточкам без hidden (для скрытых файла ещё нет).
// Карточка, у которой превью всё же не загрузилось, скрывается; если скрыты
// все — скрывается и блок, и ссылки на него. Адрес вида #review-<id> (с
// логотипа на главной) прокручивает к карточке и сразу открывает скан.
(function(){
  var cards = [].slice.call(document.querySelectorAll('.drev[data-rev]'));
  if (!cards.length) return;
  // сканы лежат в design/assets/reviews; страницы прототипа — в корне
  var DIR = (/\/design\//.test(location.pathname) ? '' : 'design/') + 'assets/reviews/';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var arrowL = '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9H3M8 4 3 9l5 5"/></svg>';
  var arrowR = '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h12M10 4l5 5-5 5"/></svg>';

  var viewer = document.createElement('div');
  viewer.className = 'modal modal--rev';
  viewer.id = 'revview';
  viewer.innerHTML =
    '<div class="modal__back" data-close></div>' +
    '<div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="drvName">' +
      '<button class="modal__x" data-close aria-label="Закрыть">&times;</button>' +
      '<div class="drv__head"><span class="drv__name" id="drvName"></span><span class="drv__meta"></span></div>' +
      '<div class="drv__sheet"><img alt=""></div>' +
      '<a class="drv__full" target="_blank" rel="noopener">Открыть скан в&nbsp;полном размере</a>' +
      '<div class="drv__nav"><button type="button" data-step="-1">' + arrowL + 'Предыдущий</button>' +
      '<button type="button" data-step="1">Следующий' + arrowR + '</button></div>' +
    '</div>';
  document.body.appendChild(viewer);
  viewer.querySelectorAll('[data-close]').forEach(function(el){ el.addEventListener('click', closeModals); });
  var vName = viewer.querySelector('.drv__name');
  var vMeta = viewer.querySelector('.drv__meta');
  var vImg  = viewer.querySelector('.drv__sheet img');
  var vNav  = viewer.querySelector('.drv__nav');
  var vFull = viewer.querySelector('.drv__full');
  var cur = null;

  function shown(){ return cards.filter(function(c){ return !c.hidden; }); }
  function open(card){
    cur = card;
    var name = card.querySelector('.drev__name').textContent;
    var meta = card.querySelector('.drev__meta');
    vName.textContent = name;
    vMeta.textContent = meta ? meta.textContent : '';
    vImg.src = vFull.href = DIR + card.getAttribute('data-rev') + '.jpg';
    vImg.alt = 'Отзыв компании ' + name;
    vNav.hidden = shown().length < 2;
    viewer.classList.add('is-open');
    viewer.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }
  function step(d){
    var list = shown(), i = list.indexOf(cur);
    if (i < 0) return;
    open(list[(i + d + list.length) % list.length]);
  }
  vNav.addEventListener('click', function(e){
    var b = e.target.closest('[data-step]');
    if (b) step(+b.getAttribute('data-step'));
  });
  document.addEventListener('keydown', function(e){
    if (!viewer.classList.contains('is-open')) return;
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  cards.forEach(function(c){ c.addEventListener('click', function(){ open(c); }); });

  function go(id){
    var card = document.getElementById(id);
    if (card && card.classList.contains('drev') && !card.hidden) {
      cards.forEach(function(c){ c.classList.toggle('is-target', c === card); });
      card.scrollIntoView({block:'center', behavior: reduce ? 'auto' : 'smooth'});
      open(card);
    } else {
      var sec = document.getElementById('reviews');
      if (sec && !sec.hidden) sec.scrollIntoView({behavior: reduce ? 'auto' : 'smooth'});
    }
  }
  document.querySelectorAll('[data-rev-link]').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      go(a.getAttribute('href').slice(1));
    });
  });

  // когда ясно, какие превью есть, прячем пустое и отрабатываем адрес
  var left = cards.length;
  function settled(){
    if (--left > 0) return;
    document.querySelectorAll('[data-reviews]').forEach(function(grid){
      if (grid.querySelector('.drev:not([hidden])')) return;
      var sec = grid.closest('section');
      if (sec) sec.hidden = true;
    });
    document.querySelectorAll('[data-rev-link]').forEach(function(a){
      var c = document.getElementById(a.getAttribute('href').slice(1));
      if (!c || c.hidden) a.hidden = true;
    });
    var sec = document.getElementById('reviews');
    if (sec && sec.hidden) {
      document.querySelectorAll('a[href="#reviews"]').forEach(function(a){
        var box = a.closest('.dsec__btn') || a;
        box.hidden = true;
      });
    }
    if (/^#review-/.test(location.hash)) go(location.hash.slice(1));
  }
  cards.forEach(function(c){
    var img = c.querySelector('img');
    if (c.hidden || !img) { c.hidden = true; settled(); return; }
    img.addEventListener('load', settled);
    img.addEventListener('error', function(){ c.hidden = true; settled(); });
    img.src = DIR + c.getAttribute('data-rev') + '-sm.jpg';
  });
})();

// Вкладки [data-tabs]: список строится по заголовкам панелей [data-tab],
// показана одна панель. Класс --live включает вид вкладок (в CSS — только
// на широком экране); без скрипта панели остаются обычными карточками.
document.querySelectorAll('[data-tabs]').forEach(function(box){
  var panels = [].slice.call(box.querySelectorAll('[data-tab]'));
  if (panels.length < 2) return;
  var nav = document.createElement('div');
  nav.className = 'dk-prog__nav';
  nav.setAttribute('role', 'tablist');
  var tabs = panels.map(function(panel, i){
    var id = 'tab-' + Math.random().toString(36).slice(2, 8);
    var b = document.createElement('button');
    b.type = 'button';
    b.id = id;
    b.setAttribute('role', 'tab');
    b.innerHTML = '<span class="dk-prog__n">' + ('0' + (i + 1)).slice(-2) + '</span>' +
                  '<span class="dk-prog__t">' + panel.querySelector('h3').innerHTML + '</span>';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', id);
    b.addEventListener('click', function(){ show(i); });
    b.addEventListener('keydown', function(e){
      var d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var n = (i + d + panels.length) % panels.length;
      show(n); tabs[n].focus();
    });
    nav.appendChild(b);
    return b;
  });
  function show(n){
    tabs.forEach(function(t, i){
      var on = i === n;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panels[i].classList.toggle('is-on', on);
    });
  }
  box.insertBefore(nav, box.firstChild);
  box.classList.add('dk-prog--live');
  show(0);
});

// Схема «рабочее место — это система» [data-sysmap]: элемент выключается
// и включается нажатием. Выключенный рвёт свою связь с центром, а центр
// показывает, что поза нарушается, — пока выключен хотя бы один элемент.
document.querySelectorAll('[data-sysmap]').forEach(function(map){
  var state = map.querySelector('.dk-map__state');
  function sync(){
    var off = map.querySelectorAll('.dk-map__node.is-off').length;
    map.classList.toggle('is-broken', off > 0);
    if (state) state.textContent = off ? (off === 1 ? 'нарушается из-за одного элемента' : 'нарушается') : '';
  }
  map.querySelectorAll('[data-node]').forEach(function(node){
    var n = node.getAttribute('data-node');
    var link = map.querySelector('[data-link="' + n + '"]');
    node.addEventListener('click', function(){
      var off = node.classList.toggle('is-off');
      node.setAttribute('aria-pressed', off ? 'false' : 'true');
      if (link) link.classList.toggle('is-off', off);
      sync();
    });
  });
});

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
