const app = document.getElementById('app');
const KEY = 'sd_requests';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const norm = s => String(s).replace(/[\u064B-\u0652\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/\s+/g, ' ').trim().toLowerCase();
const STAGES = [
  ['تم الاستلام', 'استلمنا طلبك وبياناتك ومستنداتك.'],
  ['قيد المراجعة', 'يراجع الفريق اكتمال المستندات وصحتها.'],
  ['محال للجهة', 'أُحيل طلبك إلى الجهة المختصة لاتخاذ القرار.'],
  ['جاهز', 'اكتمل الطلب، ويمكنك الاستلام.']
];
/* عرض تجريبي: تتقدم الحالة تلقائياً كل دقيقة منذ وقت التقديم */
const stageOf = r => Math.min(3, Math.max(0, Math.floor((Date.now() - new Date(r.date)) / 60000)));
const fmt = d => new Date(d).toLocaleString(tf('ar','en-GB'), { dateStyle: 'medium', timeStyle: 'short' });

const ILLUS = `<svg viewBox="0 0 320 260" aria-hidden="true" class="illus">
 <defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#e3f3e8"/></linearGradient></defs>
 <ellipse cx="160" cy="236" rx="120" ry="12" fill="#000" opacity=".18"/>
 <path d="M30 190 C70 150 90 210 130 170 S210 120 250 150" fill="none" stroke="#d9b45a" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>
 <circle cx="30" cy="190" r="7" fill="#d9b45a"/>
 <g transform="rotate(-6 150 120)">
  <rect x="78" y="34" width="150" height="188" rx="16" fill="url(#g1)" stroke="#bddcc6" stroke-width="2"/>
  <rect x="114" y="22" width="78" height="26" rx="9" fill="#0a7a32"/>
  <circle cx="153" cy="35" r="5" fill="#fff"/>
  <rect x="98" y="70" width="110" height="9" rx="4.5" fill="#cfe3d5"/>
  <rect x="98" y="92" width="86" height="9" rx="4.5" fill="#cfe3d5"/>
  <rect x="98" y="114" width="98" height="9" rx="4.5" fill="#cfe3d5"/>
  <circle cx="112" cy="168" r="17" fill="#0a7a32"/><path d="M104 168l6 6 11-12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="138" y="156" width="62" height="9" rx="4.5" fill="#0a7a32" opacity=".85"/><rect x="138" y="172" width="44" height="9" rx="4.5" fill="#cfe3d5"/>
 </g>
 <g transform="translate(206 110)"><circle cx="34" cy="34" r="30" fill="#fff" fill-opacity=".92" stroke="#d9b45a" stroke-width="7"/><path d="M56 56l32 32" stroke="#d9b45a" stroke-width="11" stroke-linecap="round"/><path d="M22 36l9 9 17-19" fill="none" stroke="#d4153c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>
 <g transform="translate(244 26)"><path d="M18 0C8 0 0 8 0 18c0 14 18 30 18 30s18-16 18-30C36 8 28 0 18 0z" fill="#d4153c"/><circle cx="18" cy="18" r="7" fill="#fff"/></g>
</svg>`;

const CHECK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';

function timeline(r) {
  const st = stageOf(r), sv = byId(r.id);
  const done = st === 3;
  return `<div class="res">
   <div class="rh"><div class="rico">${CHECK.replace('#fff', 'currentColor')}</div>
    <div><small>رقم الطلب</small><b class="rno" dir="ltr">${esc(r.ref)}</b></div>
    <span class="bd s${st}">${STAGES[st][0]}</span></div>
   <h3>${esc(r.service)}</h3>
   <div class="rm">
    <div><small>مقدم الطلب</small><b>${esc(r.name)}</b></div>
    <div><small>تاريخ التقديم</small><b>${fmt(r.date)}</b></div>
    <div><small>الجهة المختصة</small><b>${sv ? esc(sv.a) : '—'}</b></div>
   </div>
   <div class="pbar"><i style="width:${(st + 1) * 25}%"></i></div>
   <ol class="tl">${STAGES.map((s, i) => `<li class="${i < st ? 'done' : i === st ? (done ? 'done' : 'cur') : ''}">
     <span class="mk">${i < st || (i === st && done) ? CHECK : i + 1}</span><div><b>${s[0]}</b><p>${s[1]}</p></div></li>`).join('')}</ol>
   <div class="nx"><b>${done ? 'طلبك جاهز' : 'ماذا بعد؟'}</b><span>${done ? 'توجّه إلى الجهة المختصة أو الوكيل المعتمد لاستلام نتيجة طلبك وأحضر رقم الطلب والرقم الوطني.' : 'لا يلزمك فعل شيء الآن. ستتقدم الحالة تلقائياً، ويمكنك العودة لهذه الصفحة في أي وقت.'}</span></div>
   <div class="acts"><button class="btn outline" type="button" data-copy="${esc(r.ref)}">نسخ رقم الطلب</button>${sv ? `<a class="btn" href="service.html?id=${sv.id}">عرض الخدمة</a>` : ''}</div>
   <p class="demo2">عرض تجريبي: تتقدم الحالة تلقائياً كل دقيقة، والبيانات محفوظة في متصفحك فقط.</p>
  </div>`;
}
const empty = (t, d) => `<div class="emp">${ILLUS.replace('illus', 'illus sm')}<h3>${t}</h3><p>${d}</p><a class="btn" href="index.html#services">قدّم طلباً جديداً</a></div>`;

app.innerHTML = `
 <div class="trk-hero"><div class="wrap">
  <div class="th-t"><span class="pill2">تتبّع الطلبات</span><h1>أين وصل طلبك؟</h1>
   <p>اكتب رقم الطلب، أو ابحث باسمك أو رقمك الوطني، وتعرف مرحلة طلبك الآن دون تسجيل دخول.</p>
   <ul class="tpts"><li>بدون حساب</li><li>حالة لحظية</li><li>على الهاتف والحاسوب</li></ul></div>
  <div class="th-i">${ILLUS}</div>
 </div></div>
 <div class="wrap trk-main">
  <section class="card tcard">
   <div class="ttabs" role="tablist"><button class="on" data-t="ref" role="tab">برقم الطلب</button><button data-t="who" role="tab">بالاسم أو الرقم الوطني</button></div>
   <form id="fr" class="tf" novalidate>
    <div class="fg"><label for="ri">رقم الطلب</label><input id="ri" dir="ltr" placeholder="SD-2026-123456" autocomplete="off" inputmode="text"><em></em></div>
    <button class="btn big" type="submit">عرض الحالة</button></form>
   <form id="fw" class="tf" hidden novalidate>
    <div class="fg"><label for="wi">الاسم الكامل أو الرقم الوطني</label><input id="wi" placeholder="مثال: محمد أحمد علي، أو 12345678901" autocomplete="off"><em></em></div>
    <button class="btn big" type="submit">بحث عن طلباتي</button></form>
   <div id="rc" class="rc2"></div>
  </section>
  <div id="out" aria-live="polite"></div>
  <section class="info">
   <h2>كيف تتتبع طلبك؟</h2>
   <div class="pc">
    <div><span class="n1">1</span><b>اكتب بياناتك</b><p>رقم الطلب الذي وصلك عند التقديم، أو اسمك أو رقمك الوطني.</p></div>
    <div><span class="n1">2</span><b>اعرف المرحلة</b><p>ترى أين وصل الطلب وما الخطوة التالية.</p></div>
    <div><span class="n1">3</span><b>استلم نتيجتك</b><p>عند اكتمال الطلب تتوجه لاستلامه أو تحصل عليه إلكترونياً.</p></div>
   </div>
   <h2>ماذا تعني كل حالة؟</h2>
   <ol class="tl lg">${STAGES.map((s, i) => `<li><span class="mk">${i + 1}</span><div><b>${s[0]}</b><p>${s[1]}</p></div></li>`).join('')}</ol>
   <div class="note ok"><b>تحتاج مساعدة؟</b><span>راجع <a href="pages.html?p=faq">الأسئلة الشائعة</a> أو اتصل بالخط الساخن <b dir="ltr">+249 155 000 000</b>.</span></div>
  </section>
 </div>`;

const out = document.getElementById('out'), rc = document.getElementById('rc');
const fr = document.getElementById('fr'), fw = document.getElementById('fw');
const show = html => { out.innerHTML = html; out.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

/* التبويبات */
document.querySelectorAll('.ttabs button').forEach(b => b.onclick = () => {
  document.querySelectorAll('.ttabs button').forEach(x => x.classList.toggle('on', x === b));
  fr.hidden = b.dataset.t !== 'ref'; fw.hidden = b.dataset.t !== 'who'; out.innerHTML = '';
});

/* طلباتك الأخيرة */
const all = load().slice().reverse();
if (all.length) {
  rc.innerHTML = `<small>طلباتك الأخيرة على هذا الجهاز</small><div class="chips">${all.slice(0, 4).map(r => `<button type="button" data-ref="${esc(r.ref)}">${esc(tx(r.service))} · <i dir="ltr">${esc(r.ref)}</i></button>`).join('')}</div>`;
  rc.onclick = e => { const b = e.target.closest('[data-ref]'); if (b) byRef(b.dataset.ref); };
}

function byRef(ref) {
  const v = ref.trim().toUpperCase(); const r = load().find(x => x.ref === v);
  show(r ? timeline(r) : empty('لم نجد طلباً بهذا الرقم', 'تأكد من الرقم كما ظهر لك عند التقديم، مثل SD-2026-123456.'));
}
fr.addEventListener('submit', e => {
  e.preventDefault(); const i = document.getElementById('ri'), em = i.parentElement.querySelector('em');
  if (!/^SD-\d{4}-\d{6}$/i.test(i.value.trim())) { em.textContent = 'الصيغة: SD-2026-123456'; i.classList.add('bad'); return; }
  em.textContent = ''; i.classList.remove('bad'); byRef(i.value);
});
fw.addEventListener('submit', e => {
  e.preventDefault(); const i = document.getElementById('wi'), em = i.parentElement.querySelector('em'), v = i.value.trim();
  if (v.length < 3) { em.textContent = 'اكتب 3 أحرف أو أرقام على الأقل'; i.classList.add('bad'); return; }
  em.textContent = ''; i.classList.remove('bad');
  const digits = /^\d+$/.test(v), q = norm(v);
  const found = load().filter(r => digits ? r.nid === v : norm(r.name).includes(q)).reverse();
  if (!found.length) return show(empty('لا توجد طلبات مطابقة', 'جرّب كتابة الاسم كما أدخلته عند التقديم، أو ابحث برقم الطلب.'));
  if (found.length === 1) return show(timeline(found[0]));
  show(`<div class="card"><h2 class="fh">${tf('وجدنا '+found.length+' طلبات','We found '+found.length+' requests')}</h2><div class="rl">${found.map(r => `<button type="button" class="ri" data-ref="${esc(r.ref)}">
    <b>${esc(r.service)}</b><span dir="ltr">${esc(r.ref)}</span><span class="bd s${stageOf(r)}">${STAGES[stageOf(r)][0]}</span></button>`).join('')}</div></div>`);
});
out.addEventListener('click', e => {
  const c = e.target.closest('[data-copy]'); if (c) { navigator.clipboard?.writeText(c.dataset.copy); return say('تم نسخ رقم الطلب'); }
  const b = e.target.closest('.ri'); if (b) byRef(b.dataset.ref);
});

const pr = new URLSearchParams(location.search).get('ref');
if (pr) { document.getElementById('ri').value = pr; byRef(pr); }
