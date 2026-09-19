/* PubFile site: nav material edge, scroll reveal, interest form mailto fallback. No dependencies. */
(function () {
  document.documentElement.classList.remove('no-js');

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
    var href = 'mailto:' + to + '?subject=' + encodeURIComponent('PubFile: interested') + '&body=' + encodeURIComponent(body);
    window.location.href = href;
    if (status) {
      status.textContent = 'Your mail app should open with the details filled in. If it did not, email ' + to + ' directly.';
      status.classList.remove('err');
    }
  });
})();
