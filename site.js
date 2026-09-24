/* PubFile site: nav material edge, scroll reveal, interest form mailto fallback. No dependencies. */
(function () {

  // Compact nav: the <details> is open (links visible) on wide screens, closed by default on narrow ones.
  var menu = document.querySelector('.menu');
  if (menu) {
    var mq = window.matchMedia('(max-width: 760px)');
    var setMenu = function () { menu.open = !mq.matches; };
    setMenu();
    mq.addEventListener ? mq.addEventListener('change', setMenu) : mq.addListener(setMenu);
    document.addEventListener('click', function (e) { if (mq.matches && menu.open && !menu.contains(e.target)) menu.open = false; });
  }

  // Nav hairline only once content scrolls under the material.
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 4); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Reveal once, staggered by DOM order within a parent.
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var siblings = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); }) : [el];
        var idx = siblings.indexOf(el);
        el.style.transitionDelay = Math.min(idx, 5) * 70 + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0 });
    els.forEach(function (el) { io.observe(el); });
    // Safety net: never leave content hidden (print, odd viewports, screenshot tools).
    setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 2500);
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // Screenshot strip: prev/next buttons + counter.
  var shots = document.querySelector('.shots');
  var snav = document.querySelector('.shots-nav');
  if (shots && snav) {
    var prev = snav.querySelector('[data-dir=prev]'), next = snav.querySelector('[data-dir=next]'), counter = snav.querySelector('.t-caption');
    var n = shots.children.length;
    var step = function () { return shots.firstElementChild.getBoundingClientRect().width + 18; };
    var update = function () {
      var i = Math.round(shots.scrollLeft / step());
      prev.disabled = shots.scrollLeft < 8;
      next.disabled = shots.scrollLeft + shots.clientWidth >= shots.scrollWidth - 8;
      if (counter) counter.textContent = (Math.min(i, n - 1) + 1) + ' of ' + n;
    };
    prev.addEventListener('click', function () { shots.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { shots.scrollBy({ left: step(), behavior: 'smooth' }); });
    shots.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // Interest form. If action is mailto:, compose a readable body and open the mail app.
  var form = document.getElementById('interest-form');
  if (!form) return;
  var status = form.querySelector('.form-status');
  form.addEventListener('submit', function (ev) {
    var email = form.querySelector('[name=email]');
    if (!email.checkValidity()) { email.reportValidity(); ev.preventDefault(); return; }
    if (form.querySelector('[name=_gotcha]').value) { ev.preventDefault(); return; }
    var to = form.getAttribute('data-mailto');
    if (!to) return; // real endpoint: let the browser POST
    ev.preventDefault();
    var fd = new FormData(form);
    var needs = fd.getAll('need').join(', ') || 'not specified';
    var body = [
      'Email: ' + fd.get('email'),
      'Number of .pub files: ' + (fd.get('files') || 'not specified'),
      'Needs: ' + needs,
      'Notes: ' + (fd.get('note') || '-'),
      'Page: ' + (fd.get('page') || location.pathname)
    ].join('\n');
    var href = 'mailto:' + to + '?subject=' + encodeURIComponent('PubFile: send me the App Store link') + '&body=' + encodeURIComponent(body);
    window.location.href = href;
    if (status) {
      status.textContent = 'Your mail app should now be open with the message ready; press Send there. If nothing opened, email ' + to + ' directly.';
      status.classList.remove('err');
    }
  });
})();
