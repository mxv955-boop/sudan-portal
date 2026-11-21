/* قائمة الجوال */
(function(){
  const btn=document.querySelector('.menu-btn'), nav=document.querySelector('header nav');
  if(!btn||!nav) return;
  const set=o=>{nav.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);btn.classList.toggle('on',o)};
  btn.addEventListener('click',()=>set(!nav.classList.contains('open')));
  nav.addEventListener('click',e=>{if(e.target.closest('a'))set(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
  document.addEventListener('click',e=>{if(!e.target.closest('header'))set(false)});
  matchMedia('(min-width:901px)').addEventListener('change',()=>set(false));
})();
