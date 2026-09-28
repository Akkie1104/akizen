'use strict';
const products = window.KHIND_PRODUCTS;
const money = value => 'RM' + new Intl.NumberFormat('en-MY',{minimumFractionDigits:Number.isInteger(value)?0:2,maximumFractionDigits:2}).format(value);
const today = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const active = (start,end) => today >= start && today <= end;
const q3 = active('2026-07-01','2026-09-30');
const cashCampaign = active('2026-08-18','2026-09-30');
const dryerCampaign = active('2026-10-01','2026-12-31');
const enquiry = text => 'https://wa.me/60174201247?text=' + encodeURIComponent('Salam Hakim, '+text+' Mohon sahkan stok, kelayakan promosi, jumlah awal dan syarat penuh.');
const cashPrice = p => cashCampaign && p.cashPromo ? p.cashPromo : p.cash;
const byId = Object.fromEntries(products.map(p=>[p.id,p]));
const decisionMeta = {
  WM1248:['9kg','3–5 orang','598 × 608 × 845mm'],
  DHP90:['9kg','Heat pump','Waranti RTO 4 tahun'],
  WD1468:['11kg basuh','7kg kering','2-dalam-1'],
  RFS600A:['592L','Side-by-side','Waranti RTO 5 tahun'],
  RFM466A:['466L','Peti sejuk','Waranti RTO 5 tahun'],
  RF480:['480L','Peti sejuk','Waranti RTO 5 tahun'],
  WM150A:['15kg','Muatan atas','Waranti RTO 4 tahun'],
  'ACSON-1.0':['1.0HP','5 servis tahunan','10 kaki paip standard'],
  'ACSON-1.5':['1.5HP','5 servis tahunan','10 kaki paip standard'],
  'ACSON-2.0':['2.0HP','5 servis tahunan','10 kaki paip standard'],
  SI6029BP:['Seterika wap','Waranti 2 tahun','Papan seterika (Premium)'],
  WD1438:['10kg basuh','6kg kering','Sabah sahaja'],
  CD12D:['12kg','Air-vented','Harga belum disahkan']
};
const bundleParts = {
  'COMBO-1':['WM1248','DHP90'],
  'COMBO-2':['WD1468','RFM466A'],
  'COMBO-3':['WD1468','RFS600A'],
  'COMBO-4':['ACSON-1.0','ACSON-1.0'],
  'COMBO-5':['ACSON-1.5','ACSON-1.0'],
  'COMBO-6':['ACSON-1.5','ACSON-1.5'],
  'COMBO-7':['ACSON-2.0','ACSON-2.0'],
  'COMBO-8':['ACSON-1.0','ACSON-2.0'],
  'COMBO-9':['WM150A','RFM466A'],
  'COMBO-10':['WM150A','RFS600A']
};
function schedule(p,plan){
 let first=plan.rate,discount=false,end='';
 if(q3 && p.q3){first=p.category==='bundle'?65:plan.rate/2;discount=true;end='30 September 2026';}
 if(dryerCampaign && p.id==='DHP90'){first=29.75;discount=true;end='31 Disember 2026';}
 return {first,discount,end,total:discount?first*6+plan.rate*(p.months-6):plan.rate*p.months};
}
const heroImage=document.querySelector('#hero-image');
const heroProduct=(dryerCampaign&&byId.DHP90)||byId.WM1248||products[0];
function showHeroFallback(){
  if(!heroImage||heroImage.dataset.failed)return;
  heroImage.dataset.failed='1';
  heroImage.hidden=true;
  const fallback=document.createElement('span');
  fallback.className='hero-image-fallback no-image';
  fallback.textContent='Gambar produk tidak tersedia';
  heroImage.after(fallback);
}
if(heroImage){
  heroImage.src=heroProduct.image||'';
  heroImage.alt=heroProduct.name+' '+heroProduct.id;
  if(!heroProduct.image)showHeroFallback();
  else heroImage.addEventListener('error',showHeroFallback,{once:true});
}
const banner=document.querySelector('#campaign');
if(q3) banner.innerHTML='<b>Promosi hingga 30 September 2026</b><span>50% untuk 6 bulan pertama bagi model terpilih.<small>Kadar biasa bermula bulan ke-7. Kombo terpilih: RM65 sebulan untuk 6 bulan pertama. Tertakluk pengesahan KHIND.</small></span>';
else if(dryerCampaign) banner.innerHTML='<b>Drymaster DHP90 · hingga 31 Disember 2026</b><span>RM29.75 × 6 bulan, kemudian RM85 × 42 bulan.<small>Tertakluk kelayakan dan pengesahan KHIND.</small></span>';
let category='all';
const grid=document.querySelector('#products');
const categoryStory=document.querySelector('#category-story');
const categoryMeta={
  all:{
    number:'00',
    kicker:'MODEL INDIVIDU',
    title:'Pilih ikut rutin, bukan ikut hype.',
    copy:'Mulakan dengan perkara yang paling kerap digunakan di rumah. Bandingkan fungsi, tempoh dan jumlah komitmen sebelum memilih.',
    note:'Semua model individu',
    reverse:false
  },
  laundry:{
    number:'01',
    kicker:'BASUH & KERING',
    title:'Kurangkan kerja yang berulang setiap minggu.',
    copy:'Mesin basuh, pengering dan washer-dryer untuk rutin dobi yang lebih mudah diurus mengikut ruang dan keperluan rumah.',
    note:'Rutin dobi',
    reverse:false
  },
  fridge:{
    number:'02',
    kicker:'PETI SEJUK',
    title:'Lebih ruang untuk cara rumah anda benar-benar digunakan.',
    copy:'Bandingkan kapasiti dan pelan untuk simpanan harian, stok keluarga dan keperluan dapur tanpa sekadar mengejar saiz.',
    note:'Simpanan makanan',
    reverse:true
  },
  cooling:{
    number:'03',
    kicker:'PENYAMAN UDARA',
    title:'Keselesaan yang sesuai dengan ruang, bukan sekadar HP lebih besar.',
    copy:'Pilih kapasiti berdasarkan bilik dan fahami apa yang termasuk dalam pemasangan, servis serta perlindungan pelan.',
    note:'Keselesaan ruang',
    reverse:false
  },
  garment:{
    number:'04',
    kicker:'PENJAGAAN PAKAIAN',
    title:'Peralatan kecil, masa yang boleh dijimatkan setiap hari.',
    copy:'Pilihan untuk memudahkan rutin pakaian apabila fungsi dan penggunaan sebenar lebih penting daripada menambah banyak peralatan.',
    note:'Penjagaan harian',
    reverse:true
  },
  bundle:{
    number:'05',
    kicker:'KOMBO',
    title:'Dua keperluan rumah dalam satu keputusan.',
    copy:'Kombo sesuai bila dua peralatan memang diperlukan. Semak kadar selepas promosi dan jumlah keseluruhan kontrak sebelum bersetuju.',
    note:'Pakej dua peralatan',
    reverse:true
  }
};
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('motion-ready');
const revealObserver=!reduceMotion&&'IntersectionObserver'in window
 ?new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -7% 0px'})
 :null;

function observeMotion(scope=document){
  scope.querySelectorAll('.reveal:not([data-motion-bound])').forEach(el=>{
    el.dataset.motionBound='1';
    if(revealObserver)revealObserver.observe(el);
    else el.classList.add('is-visible');
  });
}
function prepareStaticMotion(){
  const heroCopy=document.querySelector('.hero>div:first-child');
  const heroArt=document.querySelector('.hero-art');
  if(heroCopy)heroCopy.classList.add('reveal','hero-copy');
  if(heroArt)heroArt.classList.add('reveal');
  document.querySelectorAll('.section-head,.campaign,.notice,.faq>div,.contact-panel').forEach(el=>el.classList.add('reveal'));
  document.querySelectorAll('.trust span').forEach((el,i)=>{
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay',i*80+'ms');
  });
  document.querySelectorAll('.steps article').forEach((el,i)=>{
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay',i*90+'ms');
  });
  observeMotion();
}
function prepareProductMotion(){
  [...grid.querySelectorAll('.card')].forEach((card,i)=>{
    card.classList.add('reveal');
    card.style.setProperty('--reveal-delay',Math.min(i%6,5)*55+'ms');
  });
  observeMotion(grid);
}

function renderCategoryStory(shown,term,cash){
  const meta=categoryMeta[category]||categoryMeta.all;
  const visibleCount=shown.length;
  const mode=cash?'Bayaran penuh':'RTO bulanan';
  categoryStory.dataset.category=category;
  categoryStory.innerHTML=`<div class="story-inner"><div><p class="story-kicker">${meta.kicker}</p><h3 class="story-title">${meta.title}</h3><p class="story-copy">${term?'Carian sedang ditapis. ':''}${meta.copy}</p></div><aside class="story-side" aria-label="Ringkasan kategori"><p class="story-number">${meta.number}</p><div class="story-stat"><span>Pilihan dipaparkan</span><b>${visibleCount}</b></div><div class="story-stat"><span>Paparan harga</span><b>${mode}</b></div></aside></div>`;
  categoryStory.classList.remove('refresh');
  void categoryStory.offsetWidth;
  categoryStory.classList.add('refresh');
}

function decisionPoints(p){
  if(decisionMeta[p.id])return decisionMeta[p.id];
  if(p.category==='bundle')return ['2 peralatan',p.months+' bulan','Pelan kombo'];
  return [];
}
function productVisual(p){
  const parts=bundleParts[p.id];
  if(parts){
    return '<div class="combo-art">'+parts.map(id=>{
      const item=byId[id];
      return item&&item.image
        ? '<img src="'+item.image+'" alt="'+item.name+' '+item.id+'" loading="lazy">'
        : '<span class="no-image">Gambar tidak tersedia</span>';
    }).join('')+'</div>';
  }
  return p.image
    ? '<img src="'+p.image+'" alt="'+p.name+' '+p.id+'" loading="lazy">'
    : '<span class="no-image">'+p.id+'</span>';
}
function render(){
 const searchInput=document.querySelector('#search');
 const term=searchInput.value.trim().toLowerCase();
 const cash=document.querySelector('#payment').value==='cash';
 const shown=products.filter(p=>(category==='all'?p.category!=='bundle':p.category===category) && (p.name+' '+p.id+' '+p.description).toLowerCase().includes(term));
 renderCategoryStory(shown,term,cash);
 document.querySelector('#count').textContent=shown.length+' '+(category==='bundle'?'kombo':'model');
 grid.classList.toggle('category-view',category!=='all'&&!term);
 grid.innerHTML=shown.map((p,i)=>{
   const plan=p.plans[0]||null;
   const sched=plan?schedule(p,plan):null;
   const feature=category!=='all'&&!term&&i===0;
   const featureClass=feature?' featured'+(categoryMeta[category]?.reverse?' featured--reverse':''):'';
   const decisions=decisionPoints(p).slice(0,3).map(x=>'<li>'+x+'</li>').join('');
   let pricing='',action='Lihat pelan & butiran →';
   if(cash){
     const amount=cashPrice(p);
     if(amount==null){
       pricing='<div class="cash-unavailable"><strong>Bayaran penuh belum disahkan</strong><span>Tanya Hakim untuk harga terkini.</span></div>';
       action='Semak harga penuh →';
     }else{
       pricing='<div class="price-block cash-price"><div class="price">'+money(amount)+'</div><p class="price-note">Bayaran penuh'+(cashCampaign&&p.cashPromo&&p.cashPromo<p.cash?' · promosi hingga 30 Sep 2026':'')+'</p></div>';
     }
   }else if(sched){
     pricing='<div class="price-block"><div class="price">'+money(sched.first)+'<small> / bulan</small></div>'+
       '<p class="price-period">'+(sched.discount?'Bulan 1–6':'Bulan 1–'+p.months)+'</p>'+
       (sched.discount?'<p class="next-rate"><strong>Kemudian '+money(plan.rate)+' / bulan</strong><span>Bulan 7–'+p.months+'</span></p>':'')+
       '<p class="estimated-total"><span>Jumlah anggaran</span><strong>'+money(sched.total+1)+'</strong><small>Termasuk fi pemprosesan RM1</small></p>'+
       '<p class="price-note">'+(sched.discount?'Promosi hingga '+sched.end+'. ':'')+'Pelan '+plan.name+' · '+p.months+' bulan</p></div>';
   }else{
     pricing='<div class="cash-unavailable"><strong>Pelan belum disahkan</strong><span>Hubungi Hakim untuk semakan.</span></div>';
   }
   return '<article class="card'+featureClass+'" data-model="'+p.id+'"><div class="product-art">'+productVisual(p)+'<span class="tag">'+(p.category==='bundle'?'PAKEJ DUA PERALATAN':p.id)+'</span></div><div class="card-content"><p class="model">'+(p.category==='cooling'?'ACSON · KHIND RTO':'KHIND')+'</p><h3>'+p.name+'</h3><p class="description">'+p.description+'</p><ul class="decision-points" aria-label="Maklumat ringkas">'+decisions+'</ul>'+pricing+'<p class="stock">'+p.stock+'</p><button data-product="'+p.id+'">'+action+'</button></div></article>';
 }).join('') || '<p class="empty">Tiada model sepadan. Cuba nama model lain atau kategori Semua model.</p>';
 grid.querySelectorAll('[data-product]').forEach(b=>b.addEventListener('click',()=>openDetail(products.find(p=>p.id===b.dataset.product))));
 grid.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.replaceWith(Object.assign(document.createElement('span'),{className:'no-image',textContent:'Gambar tidak tersedia'}));},{once:true}));
 prepareProductMotion();
}
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{
 category=button.dataset.category;
 document.querySelectorAll('[data-category]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});render();
}));
const searchInput=document.querySelector('#search');
const clearSearch=document.querySelector('#clear-search');
function syncClearSearch(){clearSearch.hidden=!searchInput.value;}
searchInput.addEventListener('input',()=>{syncClearSearch();render();});
clearSearch.addEventListener('click',()=>{searchInput.value='';syncClearSearch();render();searchInput.focus();});
syncClearSearch();
document.querySelector('#payment').addEventListener('change',render);
const dialog=document.querySelector('#detail');
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';});
function openDetail(p){
 const cashMode=document.querySelector('#payment').value==='cash';
 if(cashMode&&p.cash==null){
   const message='saya mahu semak harga bayaran penuh untuk '+p.name+'.';
   document.querySelector('#detail-content').innerHTML='<p class="eyebrow">'+p.id+'</p><h2 id="detail-title">'+p.name+'</h2><p>'+p.description+'</p><div class="unavailable-panel"><h3>Bayaran penuh belum disahkan</h3><p>Harga bayaran penuh belum tersedia untuk model ini. Paparan kekal dalam mod bayaran penuh supaya maklumat RTO tidak muncul secara tidak sengaja.</p></div><p class="stock">'+p.stock+'</p>'+(p.source?'<a class="source" href="'+p.source+'" target="_blank" rel="noopener">Spesifikasi produk rasmi ↗</a>':'')+'<a class="button dark modal-cta" href="'+enquiry(message)+'" target="_blank" rel="noopener">Tanya harga penuh di WhatsApp ↗</a><p class="fine">Untuk melihat pelan bulanan, tukar “Paparan harga” kepada Bulanan RTO selepas menutup butiran ini.</p>';
   dialog.showModal();
   document.body.style.overflow='hidden';
   return;
 }
 const cashSelected=cashMode&&p.cash!=null;
 const options=p.plans.map((plan,i)=>'<option value="'+i+'">'+plan.name+' · '+money(plan.rate)+'/bulan kadar biasa</option>').join('')+(p.cash!=null?'<option value="cash">Bayaran penuh</option>':'');
 document.querySelector('#detail-content').innerHTML='<p class="eyebrow">'+p.id+'</p><h2 id="detail-title">'+p.name+'</h2><p>'+p.description+'</p>'+(options?'<label>Pilih pelan<select id="plan">'+options+'</select></label>':'')+'<div id="plan-detail"></div><p class="stock">'+p.stock+'</p>'+(p.source?'<a class="source" href="'+p.source+'" target="_blank" rel="noopener">Spesifikasi produk rasmi ↗</a>':'');
 const select=document.querySelector('#plan');
 if(select){if(cashSelected)select.value='cash';select.addEventListener('change',()=>updatePlan(p,select.value));}
 updatePlan(p,select?.value);dialog.showModal();document.body.style.overflow='hidden';
}
function updatePlan(p,value){
 let html='',message='saya berminat dengan '+p.name+'.';
 if(value==='cash'){
 const amount=cashPrice(p);message+=` Pilihan bayaran penuh ${money(amount)}.`;
 html=`<div class="breakdown"><p>Bayaran penuh</p><div class="price">${money(amount)}</div><p>${cashCampaign&&p.cashPromo&&p.cashPromo<p.cash?'Promosi hingga 30 September 2026. Harga biasa '+money(p.cash)+'.':'Harga rujukan; sahkan harga akhir.'}</p></div><p>Waranti bayaran penuh: ${p.category==='cooling'?'3':'2'} tahun. Manfaat pelan sewaan tidak semestinya disertakan.</p>`;
 if(p.id==='WD1438')html+='<p><b>Tawaran berasingan Sabah: RM1,899.</b> Waranti 1 tahun; tarikh tamat dan ketersediaan belum disahkan. Minta pengesahan tawaran ini sebelum membuat bayaran.</p>';
 } else if(p.plans.length){
 const plan=p.plans[Number(value)||0],s=schedule(p,plan);
 message+=` Pelan ${plan.name}: ${s.discount?money(s.first)+' × 6 bulan, kemudian ':''}${money(plan.rate)} × ${s.discount?p.months-6:p.months} bulan. Jumlah sewaan ${money(s.total)} + fi RM1.`;
 html=`<div class="breakdown"><dl>${s.discount?`<div><dt>Bulan 1–6</dt><dd>${money(s.first)} / bulan</dd></div><div><dt>Bulan 7–${p.months}</dt><dd>${money(plan.rate)} / bulan</dd></div>`:`<div><dt>Bulan 1–${p.months}</dt><dd>${money(plan.rate)} / bulan</dd></div>`}<div><dt>Jumlah sewaan</dt><dd>${money(s.total)}</dd></div><div><dt>Fi pemprosesan</dt><dd>RM1</dd></div><div class="total"><dt>Jumlah anggaran</dt><dd>${money(s.total+1)}</dd></div></dl></div><p>${s.discount?'Promosi hingga '+s.end+'. ':''}Anggaran ini tidak termasuk caj kerja tambahan, caj lewat atau penamatan awal. Jumlah bayaran pertama dan kelayakan promosi perlu disahkan oleh KHIND.</p><p><b>Manfaat pelan</b><br>${p.benefits}</p><p>Perlindungan, servis dan relokasi tertakluk kepada skop serta syarat pelan. Semak perjanjian penuh sebelum bersetuju.</p>`;
 if(p.id==='DHP90'&&today<'2026-10-01')html+='<p><b>Akan datang · 1 Oktober–31 Disember 2026:</b> RM29.75 × 6 bulan, kemudian RM85 × 42 bulan. Jumlah sewaan RM3,748.50; fi pemprosesan berasingan. Bukan tawaran aktif hari ini.</p>';
 if(p.category==='cooling')html+='<p><b>Trade-in:</b> varian Semenanjung menawarkan RM150 Touch ’n Go setiap unit. Tempoh, syarat dan gabungan promosi belum disahkan; tanya dahulu.</p>';
 }else html='<p>Harga dan pelan bagi model ini belum disahkan. Hakim boleh menyemak ketersediaan dengan KHIND.</p>';
 html+=`<a class="button dark modal-cta" href="${enquiry(message)}" target="_blank" rel="noopener">Tanya tentang pilihan ini di WhatsApp ↗</a><p class="fine">Membuka WhatsApp sahaja. Ini bukan permohonan atau pengesahan pembelian.</p>`;
 document.querySelector('#plan-detail').innerHTML=html;
}
prepareStaticMotion();
render();



