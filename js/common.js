const toast = document.getElementById('toast'); let tt;
function say(m){toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('show'),2400)}
document.addEventListener('click',e=>{const el=e.target.closest('[data-msg]');if(el){e.preventDefault();say(el.dataset.msg)}});
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SRC_NOTE = {
  1:'المعلومات مأخوذة من مصادر سودانية منشورة (الإدارة العامة للجوازات والهجرة، سفارات السودان، اليونيسف، قانون الشركات 2015 وشروحه).',
  0:'إرشادات عامة. تأكد من الشروط والرسوم المحدثة من الجهة المختصة قبل التقديم، فقد تختلف بحسب الولاية والجهة.'
};
