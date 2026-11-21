const app = document.getElementById('app');
const id = new URLSearchParams(location.search).get('id');
const s = byId(id);

if (!s) {
  app.innerHTML = `<div class="wrap nf"><h1>الخدمة غير موجودة</h1><p>تحقق من الرابط أو اختر خدمة من الدليل.</p>
  <a class="btn" href="index.html#services">دليل الخدمات</a></div>`;
} else {
  const cat = catOf(s.id);
  document.title = s.n + ' — بوابة السودان';
  const steps = ['راجع الشروط','جهّز المستندات','قدّم الطلب','تابع واستلم'];
  const isInq = s.t === 'f';
  app.innerHTML = `
  <div class="wrap crumb"><a href="index.html">الرئيسية</a><i>/</i><a href="index.html#services">الخدمات</a><i>/</i><span>${esc(cat[0])}</span><i>/</i><b>${esc(s.n)}</b></div>
  <div class="svc-hero"><div class="wrap">
    <span class="tag ${s.t==='f'?'f':s.t==='p'?'p':'e'}">${TLABEL[s.t]}</span>
    <h1>${esc(s.n)}</h1><p>${esc(s.d)}</p>
    <div class="meta">
      <div><small>الجهة المقدمة</small><b>${esc(s.a)}</b></div>
      <div><small>مدة الإنجاز</small><b>${esc(s.time)}</b></div>
      <div><small>الرسوم</small><b>${esc(s.fee)}</b></div>
      ${s.law?`<div><small>المرجع القانوني</small><b>${esc(s.law)}</b></div>`:''}
    </div>
  </div></div>
  <div class="wrap svc-grid">
    <div class="svc-main">
      <section class="card"><h2>الشروط والأحكام</h2><ul class="terms">${s.terms.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></section>
      <section class="card"><div class="ch"><h2>المستندات والمتطلبات</h2><span id="cnt" class="cnt">${tf('0 من '+s.req.length, '0 of '+s.req.length)}</span></div>
        <div class="bar"><i id="pbar"></i></div>
        <div class="reqs">${s.req.map((r,i)=>`<label class="req"><input type="checkbox" class="rq"><span class="bx"></span><span>${esc(r)}</span></label>`).join('')}</div>
        <p class="hint">علّم على ما جهّزته، فهذا يساعدك على التأكد قبل البدء.</p>
      </section>
      <section class="card"><h2>خطوات الخدمة</h2><ol class="stp">${steps.map((t,i)=>`<li><span>${i+1}</span>${t}</li>`).join('')}</ol></section>
      <div class="note ${s.s?'ok':'warn'}"><b>${s.s?'مصدر المعلومات':'تنبيه'}</b><span>${SRC_NOTE[s.s]}</span></div>
    </div>
    <aside class="svc-side"><div class="card sticky">
      <h3>جاهز للبدء؟</h3>
      <p>${tf('اقرأ الشروط ثم أكّد موافقتك لتبدأ '+(isInq?'الاستعلام':'التقديم')+'.', 'Read the conditions, then confirm your agreement to start the '+(isInq?'inquiry':'application')+'.')}</p>
      <label class="agree"><input type="checkbox" id="ag"><span>قرأت الشروط والمتطلبات وأوافق عليها</span></label>
      <a id="go" class="btn big dis" href="apply.html?id=${s.id}" aria-disabled="true">${isInq?'ابدأ الاستعلام':'ابدأ التقديم'}</a>
      <ul class="facts"><li><small>الجهة</small>${esc(s.a)}</li><li><small>الرسوم</small>${esc(s.fee)}</li></ul>
    </div></aside>
  </div>
  <div class="wrap rel"><h2>${tf('خدمات أخرى في ','Other services in ')}${esc(tx(cat[0]))}</h2><div class="relg">
    ${cat[3].filter(x=>x!==s.id).map(x=>{const r=byId(x);return `<a href="service.html?id=${r.id}" class="rc"><b>${esc(r.n)}</b><span>${esc(r.a)}</span></a>`}).join('')}
  </div></div>`;

  const rq=[...document.querySelectorAll('.rq')], cnt=document.getElementById('cnt'), pb=document.getElementById('pbar');
  rq.forEach(c=>c.addEventListener('change',()=>{const n=rq.filter(x=>x.checked).length;cnt.textContent=tf(n+' من '+rq.length, n+' of '+rq.length);pb.style.width=(n/rq.length*100)+'%'}));
  const ag=document.getElementById('ag'), go=document.getElementById('go');
  ag.addEventListener('change',()=>{go.classList.toggle('dis',!ag.checked);go.setAttribute('aria-disabled',!ag.checked)});
  go.addEventListener('click',e=>{if(!ag.checked){e.preventDefault();say('أكّد قراءتك للشروط أولاً')}});
}
