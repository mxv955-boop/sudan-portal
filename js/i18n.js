/* Language switcher: Arabic (default) <-> English. The choice is saved in localStorage (sd_lang)
   so it survives page refreshes and navigation until the user switches again. */
(function () {
  var KEY = 'sd_lang', LANG = 'ar';
  try { if (localStorage.getItem(KEY) === 'en') LANG = 'en'; } catch (e) {}
  var de = document.documentElement;
  de.lang = LANG;
  de.dir = LANG === 'en' ? 'ltr' : 'rtl';
  window.LANG = LANG;

  var AR = /[\u0600-\u06FF]/, D = {}, src = window.EN_DICT || {};
  for (var k in src) D[k.trim()] = src[k];

  /* tx: translate an Arabic string (exact match, whitespace preserved). tf: pick by language. */
  function tx(s) {
    if (LANG !== 'en' || typeof s !== 'string') return s;
    var tr = s.trim();
    if (!tr || !AR.test(tr)) return s;
    var v = D[tr];
    return v === undefined ? s : s.replace(tr, function () { return v; });
  }
  window.tx = tx;
  window.tf = function (ar, en) { return LANG === 'en' ? en : ar; };

  /* hide the page until it has been translated, so Arabic never flashes */
  if (LANG === 'en') {
    de.classList.add('i18n-pending');
    setTimeout(function () { de.classList.remove('i18n-pending'); }, 2500);
  }

  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1 };
  function skip(n) {
    for (var e = n.nodeType === 1 ? n : n.parentElement; e; e = e.parentElement) {
      if (SKIP[e.tagName] || (e.hasAttribute && e.hasAttribute('data-keep'))) return true;
    }
    return false;
  }
  function doText(n) {
    var v = n.nodeValue;
    if (v && AR.test(v)) { var r = tx(v); if (r !== v) n.nodeValue = r; }
  }
  var ATTRS = ['placeholder', 'aria-label', 'alt', 'title'];
  function doEl(el) {
    for (var i = 0; i < ATTRS.length; i++) {
      var v = el.getAttribute(ATTRS[i]);
      if (v && AR.test(v)) { var r = tx(v); if (r !== v) el.setAttribute(ATTRS[i], r); }
    }
  }
  function walk(root) {
    if (root.nodeType === 3) { if (!skip(root)) doText(root); return; }
    if (root.nodeType === 1) { if (skip(root)) return; doEl(root); }
    else if (root.nodeType !== 9 && root.nodeType !== 11) return;
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null), n;
    while ((n = tw.nextNode())) {
      if (n.nodeType === 3) { if (!skip(n)) doText(n); }
      else if (!skip(n)) doEl(n);
    }
  }
  function translateTitle() {
    if (AR.test(document.title)) document.title = document.title.split(' — ').map(tx).join(' — ');
  }

  function setupButton() {
    var b = document.getElementById('lang');
    if (!b) return;
    var sp = b.querySelector('span');
    if (sp) {
      sp.textContent = LANG === 'en' ? 'العربية' : 'English';
      sp.setAttribute('data-keep', '');
      sp.setAttribute('lang', LANG === 'en' ? 'ar' : 'en');
    }
    b.setAttribute('title', LANG === 'en' ? 'التبديل إلى العربية' : 'Switch to English');
    b.setAttribute('data-keep', '');
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest('#lang')) return;
    try { localStorage.setItem(KEY, LANG === 'en' ? 'ar' : 'en'); } catch (err) {}
    location.reload();
  });

  var started = false;
  function start() {
    if (started) return; started = true;
    setupButton();
    if (LANG === 'en') {
      walk(document.body);
      translateTitle();
      /* keep translating anything the page adds later (toasts, errors, results) */
      var mo = new MutationObserver(function (ms) {
        for (var i = 0; i < ms.length; i++) {
          var m = ms[i];
          if (m.type === 'characterData') { if (!skip(m.target)) doText(m.target); }
          else if (m.type === 'attributes') { if (!skip(m.target)) doEl(m.target); }
          else for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
        }
        mo.takeRecords();
      });
      mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    }
    de.classList.remove('i18n-pending');
  }
  window.I18N = { start: start, translate: walk };
})();
