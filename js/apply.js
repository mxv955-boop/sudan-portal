const app = document.getElementById('app');
const sid = new URLSearchParams(location.search).get('id');
const sv = byId(sid);
const STATES = ['الخرطوم','الجزيرة','النيل الأبيض','النيل الأزرق','سنار','القضارف','كسلا','البحر الأحمر','نهر النيل','الشمالية','شمال كردفان','جنوب كردفان','غرب كردفان','شمال دارفور','جنوب دارفور','غرب دارفور','وسط دارفور','شرق دارفور'];
const KEY = 'sd_requests';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const save = a => { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch {} };

if (!sv) {
  app.innerHTML = `<div class="wrap nf"><h1>لم يتم اختيار خدمة</h1><a class="btn" href="index.html#services">دليل الخدمات</a></div>`;
} else {
  const inq = sv.t === 'f';
  document.title = tf((inq ? 'استعلام: ' : 'تقديم: ') + sv.n, (inq ? 'Inquiry: ' : 'Application: ') + tx(sv.n));
  let files = [];
  app.innerHTML = `
  <div class="wrap crumb"><a href="index.html">الرئيسية</a><i>/</i><a href="service.html?id=${sv.id}">${esc(sv.n)}</a><i>/</i><b>${inq?'الاستعلام':'التقديم'}</b></div>
  <div class="wrap ap-grid">
    <form id="f" class="card ap" novalidate>
      <div class="ch"><div><small class="eb">${inq?'استعلام':'طلب جديد'}</small><h1>${esc(sv.n)}</h1></div><span class="safe">محمي وآمن</span></div>
      <div class="demo">نسخة تجريبية: البيانات تُحفظ في متصفحك فقط ولا تُرسل إلى أي جهة حكومية.</div>
      <div class="fg"><label for="nm">الاسم الكامل (رباعي)</label><input id="nm" required autocomplete="name"><em></em></div>
      <div class="row2">
        <div class="fg"><label for="nid">الرقم الوطني</label><input id="nid" inputmode="numeric" dir="ltr" required placeholder="مثال: 12345678901"><em></em></div>
        <div class="fg"><label for="ph">رقم الهاتف</label><input id="ph" inputmode="tel" dir="ltr" required placeholder="+249 9X XXX XXXX"><em></em></div>
      </div>
      <div class="fg"><label for="st">الولاية</label><select id="st" required><option value="">اختر الولاية</option>${STATES.map(x=>`<option>${x}</option>`).join('')}</select><em></em></div>
      ${inq?'':`<div class="fg"><label>رفع المستندات</label>
        <div class="drop2" id="dz"><b>اسحب الملفات هنا أو اضغط للاختيار</b><span>PDF أو JPG أو PNG — الحد الأقصى 5 ميغابايت للملف</span><input type="file" id="fi" multiple accept=".pdf,.jpg,.jpeg,.png" hidden></div>
        <ul id="fl" class="fl"></ul><em></em></div>
        <details class="rd"><summary>${tx('المستندات المطلوبة')} (${sv.req.length})</summary><ul>${sv.req.map(r=>`<li>${esc(r)}</li>`).join('')}</ul></details>`}
      <div class="fg"><label for="nt">ملاحظات (اختياري)</label><textarea id="nt" rows="3"></textarea></div>
      <label class="agree"><input type="checkbox" id="ok"><span>أقرّ بصحة البيانات المدخلة وبمسؤوليتي القانونية عنها</span></label><em id="okE" class="er"></em>
      <button class="btn big" type="submit">${inq?'تنفيذ الاستعلام':'إرسال الطلب'}</button>
    </form>
    <aside class="card side2"><h3>ملخص الخدمة</h3>
      <ul class="facts"><li><small>الجهة</small>${esc(sv.a)}</li><li><small>المدة</small>${esc(sv.time)}</li><li><small>الرسوم</small>${esc(sv.fee)}</li></ul>
      <a class="lnk" href="service.html?id=${sv.id}">العودة إلى الشروط</a></aside>
  </div>`;

  const f = document.getElementById('f');
  const err = (el, m) => { const e = el.parentElement.querySelector('em'); if (e) e.textContent = m || ''; el.classList.toggle('bad', !!m); return !m; };
  const dz = document.getElementById('dz'), fi = document.getElementById('fi'), fl = document.getElementById('fl');
  const drawFiles = () => { fl.innerHTML = files.map((x,i)=>`<li>${esc(x.name)} <button type="button" data-i="${i}" aria-label="حذف">×</button></li>`).join(''); };
  if (dz) {
    dz.onclick = () => fi.click();
    ['dragover','drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); if (ev==='drop') add(e.dataTransfer.files); }));
    fi.onchange = () => { add(fi.files); fi.value=''; };
    fl.onclick = e => { const b=e.target.closest('button'); if(b){files.splice(+b.dataset.i,1);drawFiles();} };
    function add(list){ [...list].forEach(x=>{ if(!/\.(pdf|jpe?g|png)$/i.test(x.name)) return say(tf('نوع الملف غير مدعوم: '+x.name,'Unsupported file type: '+x.name)); if(x.size>5*1024*1024) return say(tf('الملف أكبر من 5 ميغابايت: '+x.name,'File is larger than 5 MB: '+x.name)); files.push(x); }); drawFiles(); }
  }

  f.addEventListener('submit', e => {
    e.preventDefault();
    const nm = f.nm, nid = f.nid, ph = f.ph, st = f.st;
    let ok = true;
    ok = err(nm, nm.value.trim().split(/\s+/).length >= 3 ? '' : 'اكتب الاسم الثلاثي على الأقل') && ok;
    ok = err(nid, /^\d{10,12}$/.test(nid.value.trim()) ? '' : 'الرقم الوطني يتكون من 10 إلى 12 رقماً') && ok;
    ok = err(ph, /^\+?\d[\d\s]{8,14}$/.test(ph.value.trim()) ? '' : 'رقم هاتف غير صحيح') && ok;
    ok = err(st, st.value ? '' : 'اختر الولاية') && ok;
    if (!inq && dz) { const em = fl.parentElement.querySelector('em'); em.textContent = files.length ? '' : 'أرفق مستنداً واحداً على الأقل'; ok = ok && files.length > 0; }
    const okE = document.getElementById('okE'); okE.textContent = f.ok.checked ? '' : 'يجب الإقرار للمتابعة'; ok = ok && f.ok.checked;
    if (!ok) { const b = f.querySelector('.bad, .er:not(:empty)'); if (b) b.scrollIntoView({block:'center'}); return; }

    const ref = 'SD-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random()*900000)+100000);
    const all = load(); all.push({ref, id: sv.id, service: sv.n, name: nm.value.trim(), nid: nid.value.trim(), date: new Date().toISOString(), status: inq ? 'تم الاستعلام' : 'تم الاستلام'});
    save(all);
    f.outerHTML = `<div class="card done"><div class="tick">✓</div><h1>${inq?'تم استلام طلب الاستعلام':'تم استلام طلبك'}</h1>
      <p>احتفظ برقم الطلب لمتابعته في أي وقت دون تسجيل الدخول.</p>
      <div class="ref" dir="ltr">${ref}</div>
      <div class="acts"><button class="btn outline" id="cp" type="button">نسخ الرقم</button><a class="btn" href="track.html?ref=${ref}">تتبع الطلب</a></div></div>`;
    document.getElementById('cp').onclick = () => { navigator.clipboard?.writeText(ref); say('تم نسخ رقم الطلب'); };
    scrollTo({top:0});
  });
}
