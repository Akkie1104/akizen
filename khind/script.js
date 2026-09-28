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
const categoryLabels={
  laundry:'Basuh & kering',
  fridge:'Peti sejuk',
  cooling:'Penyaman udara',
  garment:'Penjagaan pakaian',
  bundle:'Kombo'
};
const decisionMeta = {
  WM1248:['9kg','3–5 orang','598 × 608 × 845mm'],
  DHP90:['9kg','Heat pump','598 × 652 × 845mm'],
  WD1468:['11kg basuh','7kg kering','2-dalam-1'],
  RFS600A:['592L','Side-by-side','Waranti RTO 5 tahun'],
  RFM466A:['466L','Multi-door','Waranti RTO 5 tahun'],
  RF480:['480L','Peti sejuk','Waranti RTO 5 tahun'],
  WM150A:['15kg','Muatan atas','Waranti RTO 4 tahun'],
  'ACSON-1.0':['1.0HP','5 servis tahunan','10 kaki paip standard'],
  'ACSON-1.5':['1.5HP','5 servis tahunan','10 kaki paip standard'],
  'ACSON-2.0':['2.0HP','5 servis tahunan','10 kaki paip standard'],
  SI6029BP:['Seterika wap','Papan seterika (Premium)','Waranti 2 tahun'],
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
  const meta=term?{
    number:'⌕',
    kicker:'CARIAN SEMUA KATEGORI',
    title:'Hasil carian tanpa had kategori.',
    copy:'Carian merangkumi model individu dan kombo menggunakan nama model serta istilah harian seperti aircond, fridge, washer dan dryer.'
  }:(categoryMeta[category]||categoryMeta.all);
  const visibleCount=shown.length;
  const mode=cash?'Bayaran penuh':'RTO bulanan';
  categoryStory.dataset.category=term?'all':category;
  categoryStory.innerHTML='<div class="story-inner"><div><p class="story-kicker">'+meta.kicker+'</p><h3 class="story-title">'+meta.title+'</h3><p class="story-copy">'+meta.copy+'</p></div><aside class="story-side" aria-label="Ringkasan kategori"><p class="story-number">'+meta.number+'</p><div class="story-stat"><span>Pilihan dipaparkan</span><b>'+visibleCount+'</b></div><div class="story-stat"><span>Paparan harga</span><b>'+mode+'</b></div></aside></div>';
  categoryStory.classList.remove('refresh');
  void categoryStory.offsetWidth;
  categoryStory.classList.add('refresh');
}

function decisionPoints(p){
  if(decisionMeta[p.id])return decisionMeta[p.id];
  if(p.category==='bundle')return ['2 unit','KHIND Care Plan','Insurans + relokasi'];
  return [];
}
function productVisual(p){
  const parts=bundleParts[p.id];
  if(parts){
    return '<div class="combo-art">'+parts.map(id=>{
      const item=byId[id];
      return item&&item.image
        ? '<img src="'+item.image+'" alt="" loading="lazy">'
        : '<span class="no-image" aria-hidden="true">Gambar tidak tersedia</span>';
    }).join('')+'</div>';
  }
  return p.image
    ? '<img src="'+p.image+'" alt="'+p.name+' '+p.id+'" loading="lazy">'
    : '<span class="no-image">'+p.id+'</span>';
}
function searchableText(p){
  return [p.name,p.id,p.description,categoryLabels[p.category],...(p.keywords||[])].filter(Boolean).join(' ').toLowerCase();
}
function promoEligible(p){
  return (q3&&p.q3)||(dryerCampaign&&p.id==='DHP90');
}
function rtoCardSummary(p,plan,sched){
  const firstLabel=sched.discount?'Bulan 1–6':'Bulan 1–'+p.months;
  const later=sched.discount?'<div><span>Bulan 7–'+p.months+'</span><strong>'+money(plan.rate)+'</strong></div>':'';
  return '<div class="card-pricing" aria-label="Ringkasan RTO"><div><span>'+firstLabel+'</span><strong>'+money(sched.first)+'</strong></div>'+later+'<div class="summary-total"><span>Jumlah anggaran</span><strong>'+money(sched.total+1)+'</strong></div></div><p class="pricing-foot">Termasuk fi pemprosesan RM1'+(sched.discount?' · promosi hingga '+sched.end:'')+'</p>';
}
function render(){
 const searchInput=document.querySelector('#search');
 const term=searchInput.value.trim().toLowerCase();
 const cash=document.querySelector('#payment').value==='cash';
 const shown=term
   ?products.filter(p=>searchableText(p).includes(term))
   :products.filter(p=>category==='all'?p.category!=='bundle':p.category===category);
 renderCategoryStory(shown,term,cash);
 document.querySelector('#count').textContent=shown.length+(term?' hasil carian':' '+(category==='bundle'?'kombo':'model'));
 grid.classList.remove('category-view');

 if(cash&&category==='bundle'&&!term){
   grid.innerHTML='<div class="category-state"><p class="eyebrow">KOMBO · RTO SAHAJA</p><h3>Kombo ditawarkan melalui pelan RTO.</h3><p>Bayaran penuh tidak tersedia untuk kategori ini. Tukar ke paparan RTO untuk melihat kadar bulanan dan jumlah komitmen setiap kombo.</p><button id="show-bundle-rto" class="button dark" type="button">Lihat harga RTO →</button></div>';
   document.querySelector('#show-bundle-rto').addEventListener('click',()=>{
     document.querySelector('#payment').value='rto';
     render();
   });
   prepareProductMotion();
   return;
 }

 grid.innerHTML=shown.map(p=>{
   const plan=p.plans[0]||null;
   const sched=plan?schedule(p,plan):null;
   const decisions=decisionPoints(p).slice(0,3).map(x=>'<li>'+x+'</li>').join('');
   const categoryResult=term?'<p class="result-category">'+(categoryLabels[p.category]||'Produk')+'</p>':'';
   const promo=promoEligible(p)?'<span class="promo-tag">PROMO · 6 BULAN PERTAMA</span>':'';
   const conflict=p.sourceConflict?'<p class="verification-flag">Tempoh perlu pengesahan · sumber awam berbeza</p>':'';
   let pricing='',action='Lihat pelan & butiran →',buttonAttr='data-product="'+p.id+'"';
   if(cash){
     const amount=cashPrice(p);
     if(amount==null){
       if(p.category==='bundle'&&p.plans.length){
         pricing='<div class="cash-unavailable"><strong>Kombo ialah pelan RTO</strong><span>Bayaran penuh tidak tersedia.</span></div>';
         action='Lihat harga RTO →';
         buttonAttr='data-rto-product="'+p.id+'"';
       }else{
         pricing='<div class="cash-unavailable"><strong>Bayaran penuh belum disahkan</strong><span>Tanya Hakim untuk harga terkini.</span></div>';
         action='Semak harga penuh →';
       }
     }else{
       pricing='<div class="price-block cash-price"><div class="price">'+money(amount)+'</div><p class="price-note">Bayaran penuh'+(cashCampaign&&p.cashPromo&&p.cashPromo<p.cash?' · promosi hingga 30 Sep 2026':'')+'</p></div>';
     }
   }else if(sched){
     pricing=rtoCardSummary(p,plan,sched);
   }else{
     pricing='<div class="cash-unavailable"><strong>Pelan belum disahkan</strong><span>Hubungi Hakim untuk semakan.</span></div>';
   }
   return '<article class="card" data-model="'+p.id+'"><div class="product-art">'+productVisual(p)+'<span class="tag">'+(p.category==='bundle'?'PAKEJ DUA PERALATAN':p.id)+'</span>'+promo+'</div><div class="card-content">'+categoryResult+'<p class="model">'+(p.category==='cooling'?'ACSON · KHIND RTO':'KHIND')+'</p><h3>'+p.name+'</h3><p class="description">'+p.description+'</p><ul class="decision-points" aria-label="Maklumat ringkas">'+decisions+'</ul>'+pricing+conflict+'<p class="stock">'+p.stock+'</p><button '+buttonAttr+'>'+action+'</button></div></article>';
 }).join('') || '<p class="empty">Tiada model sepadan. Cuba istilah lain seperti aircond, fridge, washer atau dryer.</p>';
 grid.querySelectorAll('[data-product]').forEach(b=>b.addEventListener('click',()=>openDetail(products.find(p=>p.id===b.dataset.product))));
 grid.querySelectorAll('[data-rto-product]').forEach(b=>b.addEventListener('click',()=>{
   document.querySelector('#payment').value='rto';
   render();
   openDetail(products.find(p=>p.id===b.dataset.rtoProduct));
 }));
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
function sourceConflictHtml(p){
  if(!p.sourceConflict)return '';
  return '<div class="source-conflict" role="note"><b>Perlu pengesahan tempoh</b><p>'+p.sourceConflict.note+'</p><small>Data kempen ejen: '+p.tenure+' bulan · halaman awam: '+p.sourceConflict.publicTenureMonths+' bulan · disemak '+p.verifiedDate+'.</small></div>';
}
function comparisonHtml(p,planIndex){
  if(p.cash==null||!p.plans.length)return '';
  const plan=p.plans[planIndex]||p.plans[0];
  const sched=schedule(p,plan);
  const cashAmount=cashPrice(p);
  const monthly=sched.discount
    ?money(sched.first)+'/bln (1–6), kemudian '+money(plan.rate)+'/bln'
    :money(plan.rate)+'/bln';
  return '<section class="payment-comparison" aria-labelledby="compare-title"><h3 id="compare-title">RTO berbanding bayaran penuh</h3><p>Jumlah RTO boleh lebih tinggi kerana manfaat servis, perlindungan dan sokongan bergantung pada pelan. Semak manfaat sebenar dalam perjanjian sebelum membuat keputusan.</p><div class="compare-grid"><div class="compare-head"><span></span><b>Bayaran penuh</b><b>RTO</b></div><div><span>Cara bayar</span><strong>Sekali</strong><strong>'+monthly+'</strong></div><div><span>Jumlah</span><strong>'+money(cashAmount)+'</strong><strong>'+money(sched.total+1)+'</strong></div><div><span>Servis / perlindungan</span><strong>Manfaat RTO tidak semestinya disertakan</strong><strong>Mengikut manfaat pelan</strong></div><div><span>Pemilikan</span><strong>Selepas bayaran penuh</strong><strong>Selepas semua bayaran RTO selesai</strong></div></div></section>';
}
function setDetailMode(p,mode,planIndex=0){
  document.querySelectorAll('[data-detail-payment]').forEach(button=>{
    const selected=button.dataset.detailPayment===mode;
    button.classList.toggle('active',selected);
    button.setAttribute('aria-pressed',String(selected));
  });
  const planChoice=document.querySelector('#detail-plan-choice');
  const detail=document.querySelector('#plan-detail');

  if(mode==='cash'){
    planChoice.innerHTML='';
    const amount=cashPrice(p);
    if(amount==null){
      detail.innerHTML='<div class="unavailable-panel"><h3>Bayaran penuh tidak tersedia</h3><p>'+(p.category==='bundle'?'Kombo ditawarkan melalui pelan RTO.':'Harga bayaran penuh belum disahkan untuk model ini.')+'</p></div>'+(p.plans.length?'<button id="switch-detail-rto" class="button secondary-action" type="button">Lihat pilihan RTO →</button>':'')+sourceConflictHtml(p);
      const switchButton=document.querySelector('#switch-detail-rto');
      if(switchButton)switchButton.addEventListener('click',()=>{
        document.querySelector('#payment').value='rto';
        render();
        setDetailMode(p,'rto',0);
      });
      return;
    }
    const message='saya berminat dengan '+p.name+'. Pilihan bayaran penuh '+money(amount)+'.';
    detail.innerHTML='<div class="breakdown cash-breakdown"><p>Bayaran penuh</p><div class="price">'+money(amount)+'</div><p>'+(cashCampaign&&p.cashPromo&&p.cashPromo<p.cash?'Promosi hingga 30 September 2026. Harga biasa '+money(p.cash)+'.':'Harga rujukan; sahkan harga akhir.')+'</p></div>'+comparisonHtml(p,0)+sourceConflictHtml(p)+'<a class="button dark modal-cta" href="'+enquiry(message)+'" target="_blank" rel="noopener">Tanya tentang pilihan ini di WhatsApp ↗</a><p class="fine">Jangan hantar gambar IC atau butiran kad dalam chat. Gunakan pautan rasmi KHIND untuk dokumen dan pembayaran.</p>';
    return;
  }

  if(!p.plans.length){
    planChoice.innerHTML='';
    detail.innerHTML='<div class="unavailable-panel"><h3>Pelan RTO belum disahkan</h3><p>Hakim boleh menyemak harga dan ketersediaan model ini dengan KHIND.</p></div>'+sourceConflictHtml(p)+'<a class="button dark modal-cta" href="'+enquiry('saya mahu semak pelan untuk '+p.name+'.')+'" target="_blank" rel="noopener">Semak dengan Hakim ↗</a>';
    return;
  }

  const selected=Math.min(planIndex,p.plans.length-1);
  if(p.plans.length>1){
    planChoice.innerHTML='<label>Pelan RTO<select id="rto-plan">'+p.plans.map((plan,i)=>'<option value="'+i+'"'+(i===selected?' selected':'')+'>'+plan.name+' · '+money(plan.rate)+'/bulan kadar biasa</option>').join('')+'</select></label>';
    document.querySelector('#rto-plan').addEventListener('change',event=>setDetailMode(p,'rto',Number(event.target.value)));
  }else{
    planChoice.innerHTML='<p class="single-plan"><span>Pelan RTO</span><b>'+p.plans[0].name+' · '+money(p.plans[0].rate)+'/bulan kadar biasa</b></p>';
  }
  const plan=p.plans[selected],sched=schedule(p,plan);
  const message='saya berminat dengan '+p.name+'. Pelan '+plan.name+': '+(sched.discount?money(sched.first)+' × 6 bulan, kemudian ':'')+money(plan.rate)+' × '+(sched.discount?p.months-6:p.months)+' bulan. Jumlah sewaan '+money(sched.total)+' + fi RM1.';
  detail.innerHTML='<div class="breakdown"><dl>'+(sched.discount?'<div><dt>Bulan 1–6</dt><dd>'+money(sched.first)+' / bulan</dd></div><div><dt>Bulan 7–'+p.months+'</dt><dd>'+money(plan.rate)+' / bulan</dd></div>':'<div><dt>Bulan 1–'+p.months+'</dt><dd>'+money(plan.rate)+' / bulan</dd></div>')+'<div><dt>Jumlah sewaan</dt><dd>'+money(sched.total)+'</dd></div><div><dt>Fi pemprosesan</dt><dd>RM1</dd></div><div class="total"><dt>Jumlah anggaran</dt><dd>'+money(sched.total+1)+'</dd></div></dl></div><div class="plan-benefits"><h3>Termasuk dalam pelan</h3><p>'+p.benefits+'</p></div>'+comparisonHtml(p,selected)+sourceConflictHtml(p)+'<p class="fine">'+(sched.discount?'Promosi hingga '+sched.end+'. ':'')+'Anggaran tidak termasuk caj kerja tambahan, caj lewat atau penamatan awal. Jumlah bayaran pertama dan kelayakan promosi perlu disahkan oleh KHIND.</p>'+(p.id==='DHP90'&&today<'2026-10-01'?'<p class="future-offer"><b>Akan datang · 1 Oktober–31 Disember 2026:</b> RM29.75 × 6 bulan, kemudian RM85 × 42 bulan. Maklumat kempen ini masih tertakluk kepada pengesahan KHIND.</p>':'')+(p.category==='cooling'?'<p><b>Trade-in:</b> varian Semenanjung menawarkan RM150 Touch ’n Go setiap unit. Tempoh, syarat dan gabungan promosi belum disahkan; tanya dahulu.</p>':'')+'<a class="button dark modal-cta" href="'+enquiry(message)+'" target="_blank" rel="noopener">Tanya tentang pilihan ini di WhatsApp ↗</a><p class="fine">Jangan hantar gambar IC atau butiran kad dalam chat. Gunakan pautan rasmi KHIND untuk dokumen dan pembayaran.</p>';
}
function openDetail(p){
  const globalMode=document.querySelector('#payment').value;
  const decisions=decisionPoints(p).slice(0,3).map(x=>'<li>'+x+'</li>').join('');
  document.querySelector('#detail-content').innerHTML='<p class="eyebrow">'+p.id+'</p><h2 id="detail-title">'+p.name+'</h2><p>'+p.description+'</p><ul class="decision-points modal-decisions" aria-label="Maklumat ringkas">'+decisions+'</ul><fieldset class="payment-method"><legend>Cara pembayaran</legend><div class="segmented"><button type="button" data-detail-payment="rto" aria-pressed="false">RTO</button><button type="button" data-detail-payment="cash" aria-pressed="false">Bayaran penuh</button></div></fieldset><div id="detail-plan-choice"></div><div id="plan-detail"></div><p class="stock">'+p.stock+'</p><p class="verification-meta">Data kempen: '+p.campaignSource+' · disemak '+p.verifiedDate+'.</p>'+(p.source?'<a class="source" href="'+p.source+'" target="_blank" rel="noopener">Spesifikasi produk rasmi ↗</a>':'');
  document.querySelectorAll('[data-detail-payment]').forEach(button=>button.addEventListener('click',()=>{
    const mode=button.dataset.detailPayment;
    document.querySelector('#payment').value=mode;
    render();
    setDetailMode(p,mode,0);
  }));
  setDetailMode(p,globalMode,0);
  dialog.showModal();
  document.body.style.overflow='hidden';
}
prepareStaticMotion();
render();



