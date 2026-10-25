(() => {
  'use strict';
  const data = window.SITE_CONTENT;
  const main = document.querySelector('main'), nav = document.querySelector('nav'), menu = document.querySelector('.menu');
  const esc = v => String(v || '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeURL = v => {try{return ['https:','http:','mailto:'].includes(new URL(v,location.href).protocol)?v:'#';}catch{return '#';}};
  const brand=document.querySelector('.brand');
  if(brand)brand.innerHTML=`${esc(data.profile.name)}<span>Research · Teaching · Outreach</span>`;
  const image = /^assets\/[a-zA-Z0-9_./-]+$/.test(data.profile.photo) && !data.profile.photo.includes('..') ? data.profile.photo : 'assets/nipuna-chamara.jpg';
  let page=0, query='', active='';
  const pageSize=4;
  const entry = i => `<details class="content-row"><summary><span class="row-date">${esc(i.date||i.category)}</span><span class="row-heading">${esc(i.title)}</span><span class="expand" aria-hidden="true">+</span></summary><div class="row-body"><p class="eyebrow">${esc(i.category)}</p><p>${esc(i.body)}</p>${i.url?`<a class="underlined" href="${esc(safeURL(i.url))}">${esc(i.linkText||'Learn more')} ↗</a>`:''}</div></details>`;
  function sorted(items){return [...items].sort((a,b)=>(b.date||'').localeCompare(a.date||''));}
  function drawRows(section){
    const results=(section.id==='news'?sorted(section.items):section.items).filter(i=>[i.title,i.body,i.category,i.date].join(' ').toLowerCase().includes(query));
    page=Math.min(page,Math.max(0,Math.ceil(results.length/pageSize)-1));
    document.querySelector('#cards').innerHTML=results.slice(page*pageSize,(page+1)*pageSize).map(entry).join('')||'<p class="empty">No matching entries. Try another search.</p>';
    document.querySelector('#result-status').textContent=results.length?`${page*pageSize+1}–${Math.min((page+1)*pageSize,results.length)} of ${results.length} entries`:'0 results';
    const pager=document.querySelector('#pager');
    pager.innerHTML=results.length>pageSize?`<button type="button" data-step="-1" ${page===0?'disabled':''}>← Previous</button><span>Page ${page+1} of ${Math.ceil(results.length/pageSize)}</span><button type="button" data-step="1" ${(page+1)*pageSize>=results.length?'disabled':''}>Next →</button>`:'';
    pager.onclick=e=>{const b=e.target.closest('[data-step]');if(!b||b.disabled)return;page+=Number(b.dataset.step);drawRows(section);document.querySelector('#results-heading')?.focus({preventScroll:true});};
  }
  function render(focus=false){
    const section=data.sections.find(s=>s.id===(location.hash.slice(1)||'home'))||data.sections[0];
    if(active!==section.id){page=0;query='';active=section.id;}
    nav.innerHTML=data.sections.map(s=>`<a href="#${s.id}" ${s===section?'aria-current="page"':''}>${esc(s.label)}</a>`).join('');
    document.title=`${section.label} | ${data.profile.name}`;
    if(section.id==='home'){
      const p=data.profile,news=data.sections.find(s=>s.id==='news');
      main.innerHTML=`<section class="dashboard"><aside class="profile-panel"><img src="${esc(image)}" alt="Portrait of ${esc(p.name)}" width="390" height="390"><p class="profile-role">${esc(p.role)}</p><p>${esc(p.department)}<br>${esc(p.location)}</p><a href="#contact">Get in touch ↗</a></aside><div class="dashboard-main"><p class="eyebrow">DIGITAL AGRICULTURE · AI · CONNECTED SENSING</p><h1>${esc(p.name)}</h1><h2>${esc(p.headline)}</h2><p class="intro">${esc(p.intro)}</p><div class="quick-links"><a href="#research">Research ↗</a><a href="#teaching">Teaching ↗</a><a href="#extension">Outreach ↗</a></div><div class="news-heading"><h2>Latest news</h2><a href="#news">All news →</a></div><div class="latest-news">${news&&news.items.length?sorted(news.items).slice(0,3).map(entry).join(''):'<p>News updates will appear here.</p>'}</div><details class="background"><summary>About & education</summary><h3>${esc(section.title)}</h3><p>${esc(section.intro)}</p>${section.items.map(entry).join('')}</details></div></section>`;
    } else {
      main.innerHTML=`<section class="compact-page"><div class="compact-heading"><p class="eyebrow">${esc(section.label)}</p><h1 id="results-heading" tabindex="-1">${esc(section.title)}</h1><p>${esc(section.intro)}</p></div><div class="compact-search"><label for="search">Search ${esc(section.label.toLowerCase())}</label><input type="search" id="search" placeholder="Title, topic, or year…" value="${esc(query)}">${section.id==='research'?'<a href="https://scholar.google.com/citations?hl=en&user=3K-85AcAAAAJ">Google Scholar ↗</a>':''}</div><p class="browse-hint">Select an entry to see details and related links.</p><div id="cards"></div><div class="results-footer"><p id="result-status" role="status"></p><div id="pager" aria-label="Entry pagination"></div></div></section>`;
      drawRows(section);
      document.querySelector('#search').addEventListener('input',e=>{query=e.target.value.toLowerCase().trim();page=0;drawRows(section);});
    }
    menu.setAttribute('aria-expanded','false');nav.classList.remove('open');
    if(focus){window.scrollTo(0,0);main.focus({preventScroll:true});}
  }
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
  window.addEventListener('hashchange',()=>render(true));
  document.querySelector('#year').textContent=new Date().getFullYear();
  render();
})();
