'use strict';
const products = window.KHIND_PRODUCTS;
const money = value => 'RM' + new Intl.NumberFormat('en-MY',{minimumFractionDigits:Number.isInteger(value)?0:2,maximumFractionDigits:2}).format(value);
const today = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const active = (start,end) => today >= start && today <= end;
const q3 = false; // retired Q3 campaign
const yearEndCampaign = active('2026-10-01','2026-12-31');
const cashCampaign = active('2026-10-01','2026-10-31');
const dryerCampaign = yearEndCampaign;
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
 let first=plan.rate,discount=false,end='',promoLabel='';
 if(yearEndCampaign){
   discount=true;
   end='31 Disember 2026';
   if(p.id==='DHP90'){
     first=30;
     promoLabel='65% OFF · 6 BULAN PERTAMA';
   }else if(p.category==='bundle'){
     first=65;
     promoLabel='RM65 · 6 BULAN PERTAMA';
   }else{
     first=plan.rate/2;
     promoLabel='50% OFF · 6 BULAN PERTAMA';
   }
 }
 return {first,discount,end,promoLabel,total:discount?first*6+plan.rate*(p.months-6):plan.rate*p.months};
}
const heroImage=document.querySelector('#hero-image');
const heroProduct=byId.DHP90||products[0];
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
  heroImage.closest('.hero-art').dataset.model=heroProduct.id;
  if(!heroProduct.image)showHeroFallback();
  else heroImage.addEventListener('error',showHeroFallback,{once:true});
}
const banner=document.querySelector('#campaign');
if(yearEndCampaign) banner.innerHTML='<b>Promosi 1 Okt – 31 Dis 2026</b><span>Produk individu: 50% untuk 6 bulan pertama · Kombo: RM65 untuk 6 bulan pertama · DHP90: dari RM30 untuk 6 bulan pertama.<small>Kadar biasa bersambung selepas tempoh promosi. Tertakluk kelayakan, stok dan pengesahan KHIND.</small></span>';
let category='all';
const grid=document.querySelector('#products');
const categoryStory=document.querySelector('#category-story');
function renderCategoryStory(term){
  categoryStory.dataset.category=term?'all':category;
  categoryStory.innerHTML='<div class="story-inner"><h3 class="story-title">'+(term?'Hasil carian':category==='all'?'Semua peralatan':categoryLabels[category])+'</h3><p class="story-copy">'+(term?'Carian merangkumi model individu dan kombo.':category==='bundle'?'Dua peralatan, satu pelan. Semak jumlah komitmen sebelum memilih.':'Bandingkan fungsi, tempoh dan jumlah bayaran sebelum memilih.')+'</p></div>';
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
  return yearEndCampaign&&p.plans&&p.plans.length>0;
}
function rtoCardSummary(p,plan,sched){
  const firstLabel=sched.discount?'6 bulan pertama':'Bulan 1–'+p.months;
  const next=sched.discount?'Kemudian '+money(plan.rate)+'/bulan · bulan 7–'+p.months:'Kadar bulanan sepanjang '+p.months+' bulan';
  return '<div class="shop-price" aria-label="Ringkasan RTO"><span class="shop-price-label">'+firstLabel+'</span><div class="shop-price-main"><strong>'+money(sched.first)+'</strong><span>/bulan</span></div><span class="shop-price-next">'+next+'</span><div class="shop-price-total"><span>Jumlah anggaran termasuk fi RM1</span><strong>'+money(sched.total+1)+'</strong></div></div><p class="pricing-foot">'+(sched.discount?'Promosi hingga '+sched.end+' · ':'')+'Tertakluk kelayakan & pengesahan KHIND.</p>';
}
function render(){
 const searchInput=document.querySelector('#search');
 const term=searchInput.value.trim().toLowerCase();
 const cash=document.querySelector('#payment').value==='cash';
 const shown=term
   ?products.filter(p=>searchableText(p).includes(term))
   :products.filter(p=>category==='all'?p.category!=='bundle':p.category===category);
 renderCategoryStory(term);
 document.querySelector('#count').textContent=shown.length+(term?' hasil carian':' '+(category==='bundle'?'kombo':'model'));
 grid.classList.remove('category-view');

 if(cash&&category==='bundle'&&!term){
   grid.innerHTML='<div class="category-state"><p class="eyebrow">KOMBO · RTO SAHAJA</p><h3>Kombo ditawarkan melalui pelan RTO.</h3><p>Bayaran penuh tidak tersedia untuk kategori ini. Tukar ke paparan RTO untuk melihat kadar bulanan dan jumlah komitmen setiap kombo.</p><button id="show-bundle-rto" class="button dark" type="button">Lihat harga RTO →</button></div>';
   document.querySelector('#show-bundle-rto').addEventListener('click',()=>{
     setPaymentMode('rto');
   });   return;
 }

 grid.innerHTML=shown.map((p,index)=>{
   const plan=p.plans[0]||null;
   const sched=plan?schedule(p,plan):null;
   const decisions=decisionPoints(p).slice(0,3).map(x=>'<li>'+x+'</li>').join('');
   const categoryResult=term?'<p class="result-category">'+(categoryLabels[p.category]||'Produk')+'</p>':'';
   const promo=promoEligible(p)&&sched?'<span class="promo-tag">'+sched.promoLabel+'</span>':'';
   const conflict=p.sourceConflict?'<p class="verification-flag">Jumlah di atas berdasarkan '+p.tenure+' bulan · halaman rasmi awam menyatakan '+p.sourceConflict.publicTenureMonths+' bulan. Sahkan tempoh dengan KHIND.</p>':'';
   let pricing='',action='Lihat pelan & butiran',buttonAttr='data-product="'+p.id+'"';
   if(cash){
     const amount=cashPrice(p);
     if(amount==null){
       if(p.category==='bundle'&&p.plans.length){
         pricing='<div class="cash-unavailable"><strong>Kombo ialah pelan RTO</strong><span>Bayaran penuh tidak tersedia.</span></div>';
         action='Lihat harga RTO';
         buttonAttr='data-rto-product="'+p.id+'"';
       }else{
         pricing='<div class="cash-unavailable"><strong>Bayaran penuh belum disahkan</strong><span>Tanya Hakim untuk harga terkini.</span></div>';
         action='Semak harga penuh';
       }
     }else{
       pricing='<div class="price-block cash-price"><span class="shop-price-label">Bayaran penuh</span><div><span class="price">'+money(amount)+'</span>'+(cashCampaign&&p.cashPromo&&p.cashPromo<p.cash?'<span class="cash-original">'+money(p.cash)+'</span>':'')+'</div><p class="price-note">'+(cashCampaign&&p.cashPromo&&p.cashPromo<p.cash?'Promosi hingga 31 Okt 2026':'Harga rujukan · sahkan harga akhir')+'</p></div>';
     }
   }else if(sched){
     pricing=rtoCardSummary(p,plan,sched);
   }else{
     pricing='<div class="cash-unavailable"><strong>Pelan belum disahkan</strong><span>Hubungi Hakim untuk semakan.</span></div>';
   }
   const askUrl=enquiry('saya berminat dengan '+p.name+' ('+p.id+').');
   return '<article class="card" data-model="'+p.id+'" style="animation-delay:'+Math.min(240,index*45)+'ms"><div class="product-art">'+productVisual(p)+'</div><div class="card-content">'+categoryResult+'<p class="model">'+(p.category==='bundle'?'PAKEJ DUA PERALATAN':p.id)+'</p><h3>'+p.name+'</h3><p class="description">'+p.description+'</p><ul class="decision-points" aria-label="Maklumat ringkas">'+decisions+'</ul>'+promo+pricing+conflict+'<p class="stock">'+p.stock+'</p><div class="card-actions"><button aria-label="Lihat butiran '+p.name+' '+p.id+'" '+buttonAttr+'>'+action+'</button><a class="card-whatsapp" href="'+askUrl+'" target="_blank" rel="noopener" aria-label="Tanya Hakim tentang '+p.name+' '+p.id+'"><span class="wa-mark" aria-hidden="true">WA</span><span>Tanya</span></a></div></div></article>';
 }).join('') || '<p class="empty">Tiada model sepadan. Cuba istilah lain seperti aircond, fridge, washer atau dryer.</p>';
 grid.querySelectorAll('[data-product]').forEach(b=>b.addEventListener('click',()=>openDetail(products.find(p=>p.id===b.dataset.product))));
 grid.querySelectorAll('[data-rto-product]').forEach(b=>b.addEventListener('click',()=>{
   setPaymentMode('rto');
   openDetail(products.find(p=>p.id===b.dataset.rtoProduct));
 }));
 grid.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.replaceWith(Object.assign(document.createElement('span'),{className:'no-image',textContent:'Gambar tidak tersedia'}));},{once:true}));}
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{
 category=button.dataset.category;
 searchInput.value='';
 syncClearSearch();
 document.querySelectorAll('[data-category]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});render();
}));
const searchInput=document.querySelector('#search');
const clearSearch=document.querySelector('#clear-search');
function syncClearSearch(){clearSearch.hidden=!searchInput.value;}
searchInput.addEventListener('input',()=>{syncClearSearch();render();});
clearSearch.addEventListener('click',()=>{searchInput.value='';syncClearSearch();render();searchInput.focus();});
syncClearSearch();

document.querySelectorAll('[data-campaign-category],[data-campaign-search]').forEach(link=>link.addEventListener('click',()=>{
  const targetCategory=link.dataset.campaignCategory;
  const targetSearch=link.dataset.campaignSearch;
  if(targetCategory){
    const button=document.querySelector('[data-category="'+targetCategory+'"]');
    if(button)button.click();
  }else if(targetSearch){
    category='all';
    document.querySelectorAll('[data-category]').forEach(b=>{
      const selected=b.dataset.category==='all';
      b.classList.toggle('active',selected);
      b.setAttribute('aria-pressed',String(selected));
    });
    searchInput.value=targetSearch;
    syncClearSearch();
    render();
  }
}));

const paymentSelect=document.querySelector('#payment');
const paymentModeButtons=[...document.querySelectorAll('[data-payment-mode]')];
function syncPaymentModeControls(){
  paymentModeButtons.forEach(button=>{
    const selected=button.dataset.paymentMode===paymentSelect.value;
    button.classList.toggle('active',selected);
    button.setAttribute('aria-pressed',String(selected));
  });
}
function setPaymentMode(mode,shouldRender=true){
  paymentSelect.value=mode;
  syncPaymentModeControls();
  if(shouldRender)render();
}
paymentModeButtons.forEach(button=>button.addEventListener('click',()=>setPaymentMode(button.dataset.paymentMode)));
paymentSelect.addEventListener('change',()=>{syncPaymentModeControls();render();});
syncPaymentModeControls();
const dialog=document.querySelector('#detail');
let lastProductId=null;
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{
 document.body.style.overflow='';
 const trigger=[...grid.querySelectorAll('button')].find(button=>button.dataset.product===lastProductId||button.dataset.rtoProduct===lastProductId);
 (trigger||searchInput).focus({preventScroll:true});
});
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
      detail.innerHTML='<div class="unavailable-panel"><h3>Bayaran penuh tidak tersedia</h3><p>'+(p.category==='bundle'?'Kombo ditawarkan melalui pelan RTO.':'Harga bayaran penuh belum disahkan untuk model ini.')+'</p></div>'+(p.plans.length?'<button id="switch-detail-rto" class="button secondary-action" type="button">Lihat pilihan RTO →</button>':'')+sourceConflictHtml(p)+'<a class="button dark modal-cta" href="'+enquiry('saya mahu semak harga penuh dan ketersediaan '+p.name+' ('+p.id+').')+'" target="_blank" rel="noopener">Semak dengan Hakim di WhatsApp ↗</a>';
      const switchButton=document.querySelector('#switch-detail-rto');
      if(switchButton)switchButton.addEventListener('click',()=>{
        setPaymentMode('rto');
        setDetailMode(p,'rto',0);
      });
      return;
    }
    const message='saya berminat dengan '+p.name+'. Pilihan bayaran penuh '+money(amount)+'.';
    detail.innerHTML='<div class="breakdown cash-breakdown"><p>Bayaran penuh</p><div class="price">'+money(amount)+'</div><p>'+(cashCampaign&&p.cashPromo&&p.cashPromo<p.cash?'Promosi Oktober hingga 31 Oktober 2026. Harga biasa '+money(p.cash)+'.':'Harga rujukan; sahkan harga akhir.')+'</p></div>'+comparisonHtml(p,0)+sourceConflictHtml(p)+'<a class="button dark modal-cta" href="'+enquiry(message)+'" target="_blank" rel="noopener">Tanya tentang pilihan ini di WhatsApp ↗</a><p class="fine">Jangan hantar gambar IC atau butiran kad dalam chat. Gunakan pautan rasmi KHIND untuk dokumen dan pembayaran.</p>';
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
    document.querySelector('#rto-plan').addEventListener('change',event=>{setDetailMode(p,'rto',Number(event.target.value));document.querySelector('#rto-plan').focus();});
  }else{
    planChoice.innerHTML='<p class="single-plan"><span>Pelan RTO</span><b>'+p.plans[0].name+' · '+money(p.plans[0].rate)+'/bulan kadar biasa</b></p>';
  }
  const plan=p.plans[selected],sched=schedule(p,plan);
  const message='saya berminat dengan '+p.name+'. Pelan '+plan.name+': '+(sched.discount?money(sched.first)+' × 6 bulan, kemudian ':'')+money(plan.rate)+' × '+(sched.discount?p.months-6:p.months)+' bulan. Jumlah sewaan '+money(sched.total)+' + fi RM1.';
  detail.innerHTML='<div class="breakdown"><dl>'+(sched.discount?'<div><dt>Bulan 1–6</dt><dd>'+money(sched.first)+' / bulan</dd></div><div><dt>Bulan 7–'+p.months+'</dt><dd>'+money(plan.rate)+' / bulan</dd></div>':'<div><dt>Bulan 1–'+p.months+'</dt><dd>'+money(plan.rate)+' / bulan</dd></div>')+'<div><dt>Jumlah sewaan</dt><dd>'+money(sched.total)+'</dd></div><div><dt>Fi pemprosesan</dt><dd>RM1</dd></div><div class="total"><dt>Jumlah anggaran</dt><dd>'+money(sched.total+1)+'</dd></div></dl></div><div class="plan-benefits"><h3>Termasuk dalam pelan</h3><p>'+p.benefits+'</p></div>'+comparisonHtml(p,selected)+sourceConflictHtml(p)+'<p class="fine">'+(sched.discount?'Promosi hingga '+sched.end+'. ':'')+'Anggaran tidak termasuk caj kerja tambahan, caj lewat atau penamatan awal. Jumlah bayaran pertama dan kelayakan promosi perlu disahkan oleh KHIND.</p>'+(p.id==='DHP90'&&today<'2026-10-01'?'<p class="future-offer"><b>Akan datang · 1 Oktober–31 Disember 2026:</b> RM29.75 × 6 bulan, kemudian RM85 × 42 bulan. Maklumat kempen ini masih tertakluk kepada pengesahan KHIND.</p>':'')+(p.category==='cooling'?'<p><b>Trade-in aircond:</b> 1 Oktober–31 Disember 2026 untuk unit Sejuk Syiok terpilih di Semenanjung Malaysia. Trade-in 1 unit menerima RM150 Touch ’n Go eWallet; 2 unit menerima RM300, tertakluk terma kempen.</p>':'')+'<a class="button dark modal-cta" href="'+enquiry(message)+'" target="_blank" rel="noopener">Tanya tentang pilihan ini di WhatsApp ↗</a><p class="fine">Jangan hantar gambar IC atau butiran kad dalam chat. Gunakan pautan rasmi KHIND untuk dokumen dan pembayaran.</p>';
}
function openDetail(p){
  lastProductId=p.id;
  const globalMode=document.querySelector('#payment').value;
  const decisions=decisionPoints(p).slice(0,3).map(x=>'<li>'+x+'</li>').join('');
  document.querySelector('#detail-content').innerHTML='<p class="eyebrow">'+p.id+'</p><h2 id="detail-title">'+p.name+'</h2><p>'+p.description+'</p><ul class="decision-points modal-decisions" aria-label="Maklumat ringkas">'+decisions+'</ul><fieldset class="payment-method"><legend>Cara pembayaran</legend><div class="segmented"><button type="button" data-detail-payment="rto" aria-pressed="false">RTO</button><button type="button" data-detail-payment="cash" aria-pressed="false">Bayaran penuh</button></div></fieldset><div id="detail-plan-choice"></div><div id="plan-detail"></div><p class="stock">'+p.stock+'</p><p class="verification-meta">Data kempen: '+p.campaignSource+' · disemak '+p.verifiedDate+'.</p>'+(p.source?'<a class="source" href="'+p.source+'" target="_blank" rel="noopener">Spesifikasi produk rasmi ↗</a>':'');
  document.querySelectorAll('[data-detail-payment]').forEach(button=>button.addEventListener('click',()=>{
    const mode=button.dataset.detailPayment;
    setPaymentMode(mode);
    setDetailMode(p,mode,0);
  }));
  setDetailMode(p,globalMode,0);
  dialog.showModal();
  dialog.scrollTop=0;
  document.body.style.overflow='hidden';
}

function renderFeaturedProducts(){
  const host=document.querySelector('#featured-products');
  if(!host)return;
  const ids=['DHP90','WM1248','RFM466A'];
  const featured=ids.map(id=>byId[id]).filter(Boolean);
  host.innerHTML=featured.map(p=>{
    const plan=p.plans[0]||null;
    const sched=plan?schedule(p,plan):null;
    const promo=sched&&sched.promoLabel?sched.promoLabel:'PILIHAN KHIND';
    const price=sched?money(sched.first):'Semak';
    return '<article class="featured-card" data-featured-card="'+p.id+'"><div class="featured-copy"><span class="featured-badge">'+promo+'</span><p class="featured-model">'+p.id+'</p><h3>'+p.name+'</h3><p class="description">'+p.description+'</p><div class="featured-price"><span>'+(sched&&sched.discount?'6 bulan pertama':'Kadar bulanan')+'</span><strong>'+price+'</strong>'+(sched?'<small>/bulan</small>':'')+'</div><button type="button" data-featured-product="'+p.id+'">Lihat pelan & butiran →</button></div><div class="featured-visual">'+productVisual(p)+'</div></article>';
  }).join('');
  host.querySelectorAll('[data-featured-product]').forEach(button=>button.addEventListener('click',()=>{
    const p=byId[button.dataset.featuredProduct];
    if(p)openDetail(p);
  }));
}

render();
renderFeaturedProducts();
document.querySelector('#browse-laundry').addEventListener('click',()=>{
  searchInput.value='';
  syncClearSearch();
  document.querySelector('[data-category="laundry"]').click();
});




const themeToggle=document.querySelector('.theme-toggle');
const themeMedia=window.matchMedia('(prefers-color-scheme: dark)');
let chosenTheme=null;
try {chosenTheme=localStorage.getItem('khind-theme');} catch {}
function applyTheme(){
 const dark=chosenTheme?chosenTheme==='dark':themeMedia.matches;
 document.documentElement.dataset.theme=dark?'dark':'light';
 themeToggle.setAttribute('aria-pressed',String(dark));
 themeToggle.setAttribute('aria-label',dark?'Gunakan tema cerah':'Gunakan tema gelap');
 themeToggle.querySelector('img').src='assets/'+(dark?'sun':'moon')+'.svg';
}
applyTheme();
themeToggle.addEventListener('click',()=>{
 chosenTheme=document.documentElement.dataset.theme==='dark'?'light':'dark';
 try {localStorage.setItem('khind-theme',chosenTheme);} catch {}
 applyTheme();
});
themeMedia.addEventListener('change',applyTheme);





const revealItems=[...document.querySelectorAll('.reveal')];
if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:.08,rootMargin:'0px 0px -7% 0px'});
  revealItems.forEach(item=>revealObserver.observe(item));
}else{
  revealItems.forEach(item=>item.classList.add('is-visible'));
}

const desktopNavLinks=[...document.querySelectorAll('.desktop-nav a[href^="#"]')];
if('IntersectionObserver' in window && desktopNavLinks.length){
  const desktopSections=desktopNavLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const navObserver=new IntersectionObserver(entries=>{
    const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible)return;
    desktopNavLinks.forEach(link=>link.classList.toggle('is-active',link.getAttribute('href')==='#'+visible.target.id));
  },{rootMargin:'-25% 0px -60% 0px',threshold:[0,.12,.3]});
  desktopSections.forEach(section=>navObserver.observe(section));
}

const mobileNavLinks=[...document.querySelectorAll('.mobile-bottom-nav [data-mobile-nav]')];
if('IntersectionObserver'in window&&mobileNavLinks.length){
 const navSections=mobileNavLinks.map(link=>document.getElementById(link.dataset.mobileNav)).filter(Boolean);
 const mobileNavObserver=new IntersectionObserver(entries=>{
   const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
   if(!visible)return;
   mobileNavLinks.forEach(link=>{
     const active=link.dataset.mobileNav===visible.target.id;
     link.classList.toggle('active',active);
     if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
   });
 },{rootMargin:'-22% 0px -58% 0px',threshold:[0,.15,.35]});
 navSections.forEach(section=>mobileNavObserver.observe(section));
}

document.querySelectorAll('.category-image img').forEach(img=>{
 img.addEventListener('error',()=>{
   img.hidden=true;
   const box=img.closest('.category-image');
   if(box)box.classList.add('image-missing');
 },{once:true});
});
