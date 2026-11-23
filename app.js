(function(){
  var d=document,top=d.getElementById('top'),bg=d.getElementById('burger');
  function $$(s,r){return [].slice.call((r||d).querySelectorAll(s))}
  /* menu */
  function zamknij(){top.classList.remove('open');bg.setAttribute('aria-expanded','false');bg.setAttribute('aria-label','Otwórz menu')}
  bg.addEventListener('click',function(){var o=top.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
  var tk=false,mob=d.getElementById('mob');
  function sc(){if(tk)return;tk=true;requestAnimationFrame(function(){var y=window.pageYOffset;top.classList.toggle('sc',y>8);if(mob)mob.classList.toggle('widac',y>520);tk=false})}
  addEventListener('scroll',sc,{passive:true});
  /* tory i karuzele: palec natywnie, mysz przeciąganiem */
  $$('[data-tor]').forEach(function(tor){
    var down=false,sx=0,sl=0,moved=false;
    function step(){var k=tor.children[0];return k?k.getBoundingClientRect().width+parseFloat(getComputedStyle(tor).columnGap||0):300}
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0||tor.scrollWidth<=tor.clientWidth+2)return;if(e.target.closest('[data-tor]')!==tor)return;down=true;moved=false;sx=e.clientX;sl=tor.scrollLeft});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>5){moved=true;tor.classList.add('drag')}if(moved)tor.scrollLeft=sl-dx});
    addEventListener('pointerup',function(){if(!down)return;down=false;if(moved){var w=step();tor.scrollTo({left:Math.round(tor.scrollLeft/w)*w,behavior:'smooth'});setTimeout(function(){tor.classList.remove('drag')},60)}});
    tor.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    tor.addEventListener('dragstart',function(e){e.preventDefault()});
    var box=tor.parentNode,ile=box.querySelector('.ile'),n=tor.children.length;
    function upd(){if(ile){var i=Math.round(tor.scrollLeft/Math.max(1,step()))+1;ile.textContent=Math.min(i,n)+' / '+n}}
    var t2=false;tor.addEventListener('scroll',function(){if(t2)return;t2=true;requestAnimationFrame(function(){upd();t2=false})},{passive:true});
    $$('[data-k]',box).forEach(function(b){if(b.closest('[data-tor]')&&b.closest('[data-tor]')!==tor)return;b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var w=step(),k=+b.dataset.k,mx=tor.scrollWidth-tor.clientWidth;var nl=tor.scrollLeft+w*k;if(nl>mx+2)nl=0;if(nl<-2)nl=mx;tor.scrollTo({left:nl,behavior:'smooth'})})});
    var nav=d.querySelector('[data-nav="'+tor.id+'"]');
    if(nav){$$('button',nav).forEach(function(b){b.addEventListener('click',function(){tor.scrollBy({left:step()*(+b.dataset.s),behavior:'smooth'})})});
      function wid(){nav.style.visibility=tor.scrollWidth>tor.clientWidth+2?'visible':'hidden'}addEventListener('load',function(){requestAnimationFrame(wid)});addEventListener('resize',wid)}
  });
  /* karty: kolejne zdjęcia dopiero przy pierwszym kontakcie */
  function doladuj(k){$$('img[data-src]',k).forEach(function(i){i.srcset=i.dataset.srcset;i.src=i.dataset.src;delete i.dataset.src;delete i.dataset.srcset})}
  $$('.wy .kar').forEach(function(k){['pointerenter','touchstart','focusin'].forEach(function(ev){k.addEventListener(ev,function(){doladuj(k)},{once:true,passive:true})});k.querySelector('.sl').addEventListener('scroll',function(){doladuj(k)},{once:true,passive:true})});
  /* lightbox */
  var lb=d.getElementById('lb'),lbi=lb.querySelector('img'),lbc=lb.querySelector('figcaption'),grp=[],ix=0,last=null,tx0=null;
  function pokaz(){var b=grp[ix];lbi.src=b.dataset.src;lbi.alt=(b.querySelector('img')||{}).alt||'';lbc.textContent=(b.dataset.cap||'')+(grp.length>1?'  ('+(ix+1)+' / '+grp.length+')':'')}
  function otworz(b){grp=$$('[data-lb="'+b.dataset.lb+'"]');ix=grp.indexOf(b);last=b;pokaz();lb.classList.add('on');d.body.style.overflow='hidden';lb.querySelector('.x').focus();var m=grp.length>1;lb.querySelector('.p').hidden=!m;lb.querySelector('.n').hidden=!m}
  function zam(){lb.classList.remove('on');d.body.style.overflow='';lbi.removeAttribute('src');if(last)last.focus()}
  function kr(k){ix=(ix+k+grp.length)%grp.length;pokaz()}
  d.addEventListener('click',function(e){var b=e.target.closest('[data-lb]');if(b){e.preventDefault();otworz(b)}});
  lb.querySelector('.x').addEventListener('click',zam);lb.querySelector('.p').addEventListener('click',function(){kr(-1)});lb.querySelector('.n').addEventListener('click',function(){kr(1)});
  lb.addEventListener('click',function(e){if(e.target===lb||e.target.tagName==='FIGURE')zam()});
  lb.addEventListener('touchstart',function(e){tx0=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(tx0===null)return;var dx=e.changedTouches[0].clientX-tx0;if(Math.abs(dx)>50&&grp.length>1)kr(dx<0?1:-1);tx0=null});
  d.addEventListener('keydown',function(e){if(lb.classList.contains('on')){if(e.key==='Escape')zam();if(e.key==='ArrowRight')kr(1);if(e.key==='ArrowLeft')kr(-1)}else if(e.key==='Escape')zamknij()});
  /* filmy YouTube: odtwarzacz dopiero po kliknięciu */
  d.addEventListener('click',function(e){var y=e.target.closest('.yt');if(!y||y.querySelector('iframe'))return;var f=d.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+y.dataset.yt+'?autoplay=1&rel=0';f.title=y.getAttribute('aria-label')||'Film';f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;y.appendChild(f)});
  /* filtr kierunków na liście wycieczek */
  var fl=d.getElementById('filtr');
  if(fl){var bt=$$('button',fl),karty=$$('[data-reg]');
    function ustaw(r){bt.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.r===r)});karty.forEach(function(k){k.hidden=r!=='wszystkie'&&k.dataset.reg.split(' ').indexOf(r)<0})}
    bt.forEach(function(b){b.addEventListener('click',function(){ustaw(b.dataset.r);history.replaceState(null,'',b.dataset.r==='wszystkie'?location.pathname:'#'+b.dataset.r)})});
    var h=location.hash.slice(1);if(h&&bt.some(function(b){return b.dataset.r===h}))ustaw(h)}
  /* rezerwacja: wybór terminu i wycena orientacyjna */
  var fr=d.getElementById('rez');
  if(fr){var st=fr.querySelector('[name=termin]'),os=fr.querySelector('[name=osoby]'),jed=fr.querySelector('[name=pokoj1]'),ile1=fr.querySelector('[name=ile1]'),sm=d.getElementById('suma');
    function zl(v){return String(v).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' zł'}
    function licz(){var o=st.options[st.selectedIndex],c=+(o&&o.dataset.cena||0),p=+(o&&o.dataset.pokoj||0),n=Math.max(1,+os.value||1);if(!c){sm.textContent='cenę potwierdzimy';return}var s=c*n;if(jed&&jed.checked&&p)s+=p*Math.max(1,Math.min(n,+(ile1&&ile1.value)||1));sm.textContent=zl(s)}
    [st,os,jed,ile1].forEach(function(x){if(x){x.addEventListener('change',licz);x.addEventListener('input',licz)}});licz();
    $$('[data-termin]').forEach(function(b){b.addEventListener('click',function(){st.value=b.dataset.termin;licz()})})}
  /* formularze pokazowe */
  $$('form.fx').forEach(function(f){var msg=f.querySelector('.msg');
    f.addEventListener('submit',function(e){e.preventDefault();var ok=true;$$('[required]',f).forEach(function(i){var v=i.type==='checkbox'?(i.checked?'1':''):i.value.trim();var bad=!v||(i.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v));i.setAttribute('aria-invalid',bad);if(bad&&ok){ok=false;i.focus()}});if(!ok)return;msg.hidden=false;f.reset();msg.scrollIntoView({block:'nearest',behavior:'smooth'})})});
  /* cookies i mapa */
  var ck=d.getElementById('cookies'),K='bk-zgody',z=null;try{z=JSON.parse(localStorage.getItem(K)||'null')}catch(e){}
  var mapa=d.getElementById('mapa'),widac=false;
  function wstawMape(){if(!mapa||mapa.querySelector('iframe'))return;var i=d.createElement('iframe');i.src=mapa.dataset.src;i.title='Mapa dojazdu: Biuro Turystyczne Bezkresy, ul. Marszałkowska 115, Warszawa';i.loading='lazy';i.referrerPolicy='no-referrer-when-downgrade';mapa.appendChild(i);var zm=mapa.querySelector('.zm');if(zm)zm.hidden=true}
  function moze(){if(widac&&(!z||z.mapy))wstawMape()}
  function zapisz(o){z={mapy:!!o.mapy,analityka:!!o.analityka,marketing:!!o.marketing,t:Date.now()};try{localStorage.setItem(K,JSON.stringify(z))}catch(e){}ck.hidden=true;moze()}
  if(z&&Date.now()-(z.t||0)>365*864e5)z=null;
  var u=ck.querySelector('.ck-u'),zap=ck.querySelector('[data-c=zapisz]');
  ck.querySelector('[data-c=tak]').addEventListener('click',function(){zapisz({mapy:1,analityka:1,marketing:1})});
  ck.querySelector('[data-c=nie]').addEventListener('click',function(){zapisz({})});
  ck.querySelector('[data-c=ust]').addEventListener('click',function(){u.hidden=false;zap.hidden=false;this.hidden=true});
  zap.addEventListener('click',function(){var o={};$$('input[data-k]',u).forEach(function(i){o[i.dataset.k]=i.checked});zapisz(o)});
  $$('[data-cookies]').forEach(function(b){b.addEventListener('click',function(){if(z)$$('input[data-k]',u).forEach(function(i){i.checked=!!z[i.dataset.k]});ck.hidden=false;u.hidden=false;zap.hidden=false;ck.querySelector('[data-c=ust]').hidden=true})});
  if(mapa){var pm=d.getElementById('pokaz-mape');if(pm)pm.addEventListener('click',function(){zapisz({mapy:1,analityka:z&&z.analityka,marketing:z&&z.marketing});wstawMape()});
    if(z&&!z.mapy){}
    if('IntersectionObserver' in window){new IntersectionObserver(function(es){if(es[0].isIntersecting){widac=true;moze()}},{rootMargin:'300px'}).observe(mapa)}else{widac=true;moze()}}
  /* podnawigacja na stronie wyjazdu */
  var pn=$$('.podnav a');
  if(pn.length&&'IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)pn.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})})},{rootMargin:'-40% 0px -55% 0px'});pn.forEach(function(a){var t=d.querySelector(a.getAttribute('href'));if(t)io.observe(t)})}
  var r=d.getElementById('rok');if(r)r.textContent=new Date().getFullYear();
})();
