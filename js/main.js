const I = {
  id:'<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="2"/><path d="M9 16h6"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5a3 3 0 0 1 0 6M18 14c2 .7 3 2.7 3 6"/>',
  bag:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4h6v3M3 13h18"/>',
  car:'<path d="M5 16l1.5-5h11L19 16M4 16h16v3H4zM7 19v1M17 19v1"/><circle cx="8" cy="16" r=".5"/><circle cx="16" cy="16" r=".5"/>',
  cap:'<path d="M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5"/>',
  heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/><path d="M9 11h6M12 8v6"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  build:'<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-5h4v5"/>'
};
const ic = k => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${I[k]}</svg>`;
document.getElementById('cats').innerHTML = CATS.map(c => `
 <div class="cat">
  <div class="top"><span class="ico">${ic(c[2])}</span><span class="n">${tf(c[1]+' خدمة', c[1]+' services')}</span></div>
  <h3>${c[0]}<svg class="arr" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></h3>
  <ul>${c[3].map(id=>`<li><a href="service.html?id=${id}">${byId(id).n}</a></li>`).join('')}</ul></div>`).join('');

/* toast */
const toast = document.getElementById('toast'); let tt;
function say(m){toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('show'),2200)}
document.addEventListener('click',e=>{const el=e.target.closest('[data-msg]');if(el){e.preventDefault();say(el.dataset.msg)}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.classList.contains('cat'))say(e.target.dataset.msg)});

/* table */
const ck = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const data = {
 'الأكثر استخداماً':['birth-cert','passport-renew','traffic-fines'],
 'خدمات الأفراد':['national-number','driving-license','appointment'],
 'خدمات الأعمال':['company-register','license-renew','trade-name'],
 'خدمات المقيمين':['entry-visa','criminal-record','health-cert']
};
const tabs=document.getElementById('tabs'), tbl=document.getElementById('tbl');
function renderTbl(k){
  tbl.innerHTML = `<div class="r h"><span>الخدمة</span><span>الجهة المقدمة</span><span>نوع الخدمة</span><span>مدة الإنجاز</span><span>الرسوم</span><span></span></div>` +
  data[k].map(id=>{const r=byId(id);return `<div class="rw"><div class="r" tabindex="0"><b>${r.n}</b><span>${r.a}</span>
   <span><span class="tag ${r.t}">${TLABEL[r.t]}</span></span><span class="dur">${ck}${r.time}</span><span class="fee">${r.fee}</span>
   <svg class="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg></div>
   <div class="detail">${r.d} <a href="service.html?id=${r.id}" style="color:var(--green);font-weight:600">عرض الشروط والتقديم ←</a></div></div>`}).join('');
}
function setTab(k){[...tabs.children].forEach(b=>b.classList.toggle('on',b.dataset.k===k));renderTbl(k)}
Object.keys(data).forEach(k=>{const b=document.createElement('button');b.textContent=k;b.dataset.k=k;b.type='button';b.setAttribute('role','tab');b.onclick=()=>setTab(k);tabs.appendChild(b)});
tbl.addEventListener('click',e=>{const r=e.target.closest('.r:not(.h)');if(!r)return;r.classList.toggle('open');r.nextElementSibling.classList.toggle('show')});
tbl.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('.r:not(.h)'))e.target.click()});
setTab('الأكثر استخداماً');

/* steps */
const steps=[['اختر الخدمة','اطلع على الشروط والرسوم ومدة الإنجاز.'],['أرفق وثائقك','ارفع صور الهوية والمستندات بوضوح وأمان.'],['راجع وادفع','اختر وسيلة الدفع المناسبة أو وكيلاً معتمداً.'],['استلم النتيجة','تابع حالة الطلب واستلم إشعار الإنجاز.']];
const pct=[25,50,75,100]; let cur=1, front=true;
const sl=document.getElementById('stepList'), mock=document.getElementById('mock');
const titles=['اختيار الخدمة','إرفاق صورة الهوية','المراجعة والدفع','استلام النتيجة'];
function renderSteps(){
  sl.innerHTML=steps.map((s,i)=>`<div class="st ${i===cur?'on':''}" data-i="${i}" tabindex="0"><div class="num">0${i+1}</div><div><b>${s[0]}</b><span>${s[1]}</span></div></div>`).join('');
  const body = cur===1 ? `<div class="warn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>صوّر البطاقة كاملة على سطح داكن، وتأكد من وضوح النص وعدم وجود انعكاس أو قص للحواف.</div>
   <div class="drops"><div class="drop done"><div class="card"></div><span class="ok">تم الرفع بنجاح ✓</span><u>إعادة الرفع</u></div>
   <div class="drop" id="back"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 3h9l4 4v14H6zM9 13h7M9 17h5"/></svg><b>الوجه الخلفي</b><span>اسحب الملف أو اضغط للاختيار</span><button type="button" id="pick">اختيار الملف</button></div></div>
   <div class="limit">PDF أو JPG، PNG — الحد الأقصى 5 ميغابايت للملف.</div>`
   : `<p style="padding:40px 10px;text-align:center;color:var(--muted);font-size:14px">${steps[cur][1]}</p>`;
  mock.innerHTML=`<div class="mh"><div><small>${tf('الخطوة '+(cur+1)+' من 4','Step '+(cur+1)+' of 4')}</small><b>${titles[cur]}</b></div><span class="safe">محمي وآمن</span></div><div class="mb">${body}<div class="prog"><span>${pct[cur]}%</span><div class="bar"><i style="width:${pct[cur]}%"></i></div></div></div>`;
}
sl.addEventListener('click',e=>{const s=e.target.closest('.st');if(s){cur=+s.dataset.i;renderSteps()}});
sl.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.classList.contains('st'))e.target.click()});
mock.addEventListener('click',e=>{if(e.target.id==='pick'){const d=document.getElementById('back');d.className='drop done';d.innerHTML='<div class="card"></div><span class="ok">تم الرفع بنجاح ✓</span>';say('تم رفع الوجه الخلفي')}});
renderSteps();

/* search */
const q=document.getElementById('q');
document.querySelector('.ideas').addEventListener('click',e=>{if(e.target.tagName==='BUTTON'){q.value=e.target.textContent;q.focus()}});
document.getElementById('searchForm').addEventListener('submit',e=>{
  e.preventDefault();const v=q.value.trim();if(!v){say('اكتب اسم الخدمة أولاً');return}
  const vl=v.toLowerCase();
  const hit=SERVICES.find(s=>[s.n,tx(s.n)].some(x=>{x=x.toLowerCase();return x.includes(vl)||vl.includes(x)}));
  if(hit){location.href='service.html?id='+hit.id;return}
  say(tf('لا توجد نتائج لـ «'+v+'»','No results for “'+v+'”'));
});

/* track */
const tr=document.getElementById('trackResult');
document.getElementById('trackForm').addEventListener('submit',e=>{
  e.preventDefault();const v=document.getElementById('ref').value.trim().toUpperCase();
  let list=[];try{list=JSON.parse(localStorage.getItem('sd_requests'))||[]}catch{}
  const r=list.find(x=>x.ref===v);
  if(r){tr.className='ok';const d=new Date(r.date).toLocaleDateString(tf('ar','en-GB'));tr.textContent=tf('الطلب '+r.ref+' ('+r.service+'): '+r.status+' بتاريخ '+d+'.','Request '+r.ref+' ('+tx(r.service)+'): '+tx(r.status)+' on '+d+'.')}
  else{tr.className='err';tr.textContent='لم يُعثر على طلب بهذا الرقم. تأكد من الرقم (مثال: SD-2026-123456).'}
});

/* تتبع مباشر من رابط ?ref= */
const pr=new URLSearchParams(location.search).get('ref');
if(pr){document.getElementById('ref').value=pr;document.getElementById('trackForm').requestSubmit();document.getElementById('trackForm').scrollIntoView({block:'center'})}
