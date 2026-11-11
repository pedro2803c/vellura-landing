(function () {
  var WA = '5500000000000';
  var $ = function (id) { return document.getElementById(id); };

  // Hero video: start only after the page has loaded, and never with reduced motion / data saver
  var v = $('hero-video');
  if (v) {
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var save = navigator.connection && navigator.connection.saveData;
    if (!reduce && !save) {
      var start = function () {
        v.preload = 'auto';
        v.muted = true;
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      };
      if (document.readyState === 'complete') start(); else addEventListener('load', start);
    }
  }

  // Mobile menu
  var btn = $('menu-btn'), menu = $('mobile-menu');
  if (btn && menu) {
    var setMenu = function (open) { menu.hidden = !open; btn.setAttribute('aria-expanded', open); };
    btn.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  }

  // Testimonials
  var T = [
    { q: 'O acompanhamento me ajudou a lidar melhor com a ansiedade e a enxergar a vida com mais clareza.', n: 'Juliana R.', i: 'JR', p: 'assets/av-juliana.webp' },
    { q: 'Encontrei um lugar onde posso falar sem medo de ser julgado e entender melhor o que sinto.', n: 'Rafael M.', i: 'RM' },
    { q: 'Aprendi a respeitar o meu tempo e a cuidar de mim com mais gentileza no dia a dia.', n: 'Carla S.', i: 'CS' }
  ];
  var idx = 0, dots = document.querySelectorAll('.t-dot');
  function show(i) {
    idx = (i + T.length) % T.length;
    var t = T[idx];
    $('t-quote').textContent = '“' + t.q + '”';
    $('t-name').textContent = t.n;
    $('t-photo').hidden = !t.p;
    if (t.p) $('t-photo').src = t.p;
    $('t-initials').hidden = !!t.p;
    $('t-initials').textContent = t.i;
    dots.forEach(function (d, k) { d.setAttribute('aria-current', k === idx ? 'true' : 'false'); });
  }
  if ($('t-quote')) {
    $('t-prev').addEventListener('click', function () { show(idx - 1); });
    $('t-next').addEventListener('click', function () { show(idx + 1); });
    dots.forEach(function (d) { d.addEventListener('click', function () { show(+d.dataset.i); }); });
    show(0);
  }

  // Booking form
  var form = $('agenda-form');
  if (!form) return;
  var mode = 'Presencial';
  var pills = form.querySelectorAll('.pill');
  pills.forEach(function (p) {
    p.addEventListener('click', function () {
      mode = p.textContent;
      pills.forEach(function (o) { o.setAttribute('aria-pressed', o === p ? 'true' : 'false'); });
    });
  });
  var tel = form.tel;
  tel.addEventListener('input', function () {
    var d = tel.value.replace(/\D/g, '').slice(0, 11), v = '';
    if (d.length <= 2) v = d.length ? '(' + d : '';
    else if (d.length <= 6) v = '(' + d.slice(0, 2) + ') ' + d.slice(2);
    else if (d.length <= 10) v = '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    else v = '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
    tel.value = v;
  });
  function flag(input, errId, bad) {
    $(errId).hidden = !bad;
    if (input.type !== 'checkbox') input.setAttribute('aria-invalid', bad ? 'true' : 'false');
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.nome.value.trim();
    var okName = name.length >= 2;
    var okTel = tel.value.replace(/\D/g, '').length >= 10;
    var okLgpd = form.lgpd.checked;
    flag(form.nome, 'e-nome', !okName);
    flag(tel, 'e-tel', !okTel);
    flag(form.lgpd, 'e-lgpd', !okLgpd);
    if (!(okName && okTel && okLgpd)) {
      (!okName ? form.nome : !okTel ? tel : form.lgpd).focus();
      return;
    }
    var msg = 'Olá! Me chamo ' + name + ' e gostaria de agendar uma consulta na Vellura.\nModalidade: ' + mode +
      '\nMelhor período: ' + form.periodo.value + (form.msg.value.trim() ? '\n' + form.msg.value.trim() : '');
    $('ok-name').textContent = name.split(' ')[0];
    $('ok-wa').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
    form.hidden = true;
    $('agenda-ok').hidden = false;
  });
  $('ok-reset').addEventListener('click', function () {
    form.reset();
    mode = 'Presencial';
    pills.forEach(function (o, k) { o.setAttribute('aria-pressed', k ? 'false' : 'true'); });
    $('agenda-ok').hidden = true;
    form.hidden = false;
    form.nome.focus();
  });
})();
