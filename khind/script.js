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
function schedule(p,plan){
 let first=plan.rate,discount=false,end='';
 if(q3 && p.q3){first=p.category==='bundle'?65:plan.rate/2;discount=true;end='30 September 2026';}
 if(dryerCampaign && p.id==='DHP90'){first=29.75;discount=true;end='31 Disember 2026';}
 return {first,discount,end,total:discount?first*6+plan.rate*(p.months-6):plan.rate*p.months};
}
document.querySelector('#hero-image').src=products[0].image;
const banner=document.querySelector('#campaign');
if(q3) banner.innerHTML='<b>Promosi hingga 30 September 2026</b><span>50% untuk 6 bulan pertama bagi model terpilih.<small>Kadar biasa bermula bulan ke-7. Kombo terpilih: RM65 sebulan untuk 6 bulan pertama. Tertakluk pengesahan KHIND.</small></span>';
else if(dryerCampaign) banner.innerHTML='<b>Drymaster DHP90 · hingga 31 Disember 2026</b><span>RM29.75 × 6 bulan, kemudian RM85 × 42 bulan.<small>Tertakluk kelayakan dan pengesahan KHIND.</small></span>';
let category='all';
const grid=document.querySelector('#products');
const categoryStory=document.querySelector('#category-story');
const categoryMeta={
  all:{
    number:'00',
    kicker:'KOLEKSI RUMAH',
    title:'Pilih ikut rutin, bukan ikut hype.',
    copy:'Mulakan dengan perkara yang paling kerap digunakan di rumah. Bandingkan fungsi, tempoh dan jumlah komitmen sebelum memilih.',
    note:'Semua kategori',
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
  categoryStory.innerHTML=`<div class="story-inner"><div><p class="story-kicker">${meta.kicker}</p><h3 class="story-title">${meta.title}</h3><p class="story-copy">${term?`Carian “${term}” sedang digunakan. `:''}${meta.copy}</p></div><aside class="story-side" aria-label="Ringkasan kategori"><p class="story-number">${meta.number}</p><div class="story-stat"><span>Pilihan dipaparkan</span><b>${visibleCount}</b></div><div class="story-stat"><span>Paparan harga</span><b>${mode}</b></div></aside></div>`;
  categoryStory.classList.remove('refresh');
  void categoryStory.offsetWidth;
  categoryStory.classList.add('refresh');
}

function render(){
 const term=document.querySelector('#search').value.trim().toLowerCase();
 const cash=document.querySelector('#payment').value==='cash';
 const shown=products.filter(p=>(category==='all'?p.category!=='bundle':p.category===category) && (p.name+' '+p.id+' '+p.description).toLowerCase().includes(term));
 renderCategoryStory(shown,term,cash);
 document.querySelector('#count').textContent=shown.length+' '+(category==='bundle'?'kombo':'model');
 grid.classList.toggle('category-view',category!=='all'&&!term);
 grid.innerHTML=shown.map((p,i)=>{
 const s=p.plans.length?schedule(p,p.plans[0]):null;
 const amount=cash?cashPrice(p):s?.first;
 const price=amount==null?'Semak harga':money(amount);
 const note=cash?(p.cash?'Bayaran penuh'+(cashCampaign&&p.cashPromo&&p.cashPromo<p.cash?' · promosi hingga 30 Sep 2026':''):'Harga bayaran penuh belum disahkan'):(s?(s.discount?`6 bulan pertama; kemudian ${money(p.plans[0].rate)}/bulan. ${p.months} bulan keseluruhan.`:`${p.months} bulan · Pelan ${p.plans[0].name}`):'Pelan belum disahkan');
 const feature=category!=='all'&&!term&&i===0;
 const featureClass=feature?' featured'+(categoryMeta[category]?.reverse?' featured--reverse':''):'';
 return `<article class="card${featureClass}" data-model="${p.id}"><div class="product-art">${p.image?`<img src="${p.image}" alt="${p.name} ${p.id}" loading="lazy">`:`<span class="no-image">${p.category==='bundle'?'02 / KOMBO':p.id}</span>`}<span class="tag">${p.category==='bundle'?'PAKEJ DUA PERALATAN':p.id}</span></div><div class="card-content"><p class="model">${p.category==='cooling'?'ACSON · KHIND RTO':'KHIND'}</p><h3>${p.name}</h3><p class="description">${p.description}</p><div class="price">${price}${amount!=null&&!cash?'<small> / bulan · dari</small>':''}</div><p class="price-note">${note}</p><p class="stock">${p.stock}</p><button data-product="${p.id}">Lihat pelan & butiran <span>↗</span></button></div></article>`;
 }).join('') || '<p class="empty">Tiada model sepadan. Cuba nama model lain atau kategori Semua.</p>';
 grid.querySelectorAll('[data-product]').forEach(b=>b.addEventListener('click',()=>openDetail(products.find(p=>p.id===b.dataset.product))));
 grid.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.replaceWith(Object.assign(document.createElement('span'),{className:'no-image',textContent:'Gambar tidak tersedia'}));},{once:true}));
 prepareProductMotion();
}
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{
 category=button.dataset.category;
 document.querySelectorAll('[data-category]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});render();
}));
document.querySelector('#search').addEventListener('input',render);
document.querySelector('#payment').addEventListener('change',render);
const dialog=document.querySelector('#detail');
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';});
function openDetail(p){
 const cashSelected=document.querySelector('#payment').value==='cash'&&p.cash!=null;
 const options=p.plans.map((plan,i)=>`<option value="${i}">${plan.name} · ${money(plan.rate)}/bulan kadar biasa</option>`).join('')+(p.cash!=null?'<option value="cash">Bayaran penuh</option>':'');
 document.querySelector('#detail-content').innerHTML=`<p class="eyebrow">${p.id}</p><h2 id="detail-title">${p.name}</h2><p>${p.description}</p>${options?`<label>Pilih pelan<select id="plan">${options}</select></label>`:''}<div id="plan-detail"></div><p class="stock">${p.stock}</p>${p.source?`<a class="source" href="${p.source}" target="_blank" rel="noopener">Spesifikasi produk rasmi ↗</a>`:''}`;
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



