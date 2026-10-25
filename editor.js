(() => {
  'use strict';
  const key = 'nipuna-site-draft-v1';
  let draft = JSON.parse(JSON.stringify(window.SITE_CONTENT));
  let selected = 'profile';
  const status = document.querySelector('#editor-status');
  const form = document.querySelector('#editor-form');
  const nav = document.querySelector('.editor-nav');
  const esc = v => String(v || '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function valid(data) {
    const keys = ['name','role','department','university','email','location','headline','intro','photo'];
    const ids = ['home','news','research','teaching','extension','community','contact'];
    return data && data.profile && keys.every(k=>typeof data.profile[k] === 'string') && Array.isArray(data.sections) && data.sections.length === ids.length && ids.every(id=>data.sections.filter(s=>s && s.id===id).length===1) && data.sections.every(s=>typeof s.label==='string' && typeof s.title==='string' && typeof s.intro==='string' && Array.isArray(s.items) && s.items.every(i=>i && typeof i.title==='string' && typeof i.body==='string' && ['category','date','url','linkText'].every(k=>i[k]===undefined || typeof i[k]==='string')));
  }
  function migrate(value) {
    if(value && Array.isArray(value.sections) && !value.sections.some(s=>s && s.id==='news')) value.sections.splice(1,0,JSON.parse(JSON.stringify(window.SITE_CONTENT.sections.find(s=>s.id==='news'))));
    return value;
  }
  try { const saved = migrate(JSON.parse(localStorage.getItem(key))); if (valid(saved)) { draft = saved; status.textContent='Saved browser draft restored. News editing is available.'; } } catch { status.textContent='Browser storage unavailable. Export a backup to keep edits.'; }
  function save() { try { localStorage.setItem(key,JSON.stringify(draft)); status.textContent='Draft saved in this browser · not published.'; } catch { status.textContent='Changes in memory only. Export a backup before closing.'; } }
  function field(label, name, value, multiline=false) { return `<label>${esc(label)}${multiline ? `<textarea name="${name}">${esc(value)}</textarea>` : `<input name="${name}" value="${esc(value)}">`}</label>`; }
  function render() {
    nav.innerHTML = [{id:'profile',label:'Profile & home banner'},...draft.sections].map(s=>`<button type="button" data-select="${s.id}" aria-pressed="${s.id===selected}">${esc(s.label)}</button>`).join('');
    if (selected==='profile') {
      const labels={name:'Full name',role:'Position',department:'Department',university:'University',email:'Email',location:'Location',headline:'Homepage headline',intro:'Homepage introduction',photo:'Portrait path (inside assets/)'};
      form.innerHTML=`<h2>Profile & home banner</h2>${Object.keys(labels).map(k=>field(labels[k],k,draft.profile[k],k==='intro')).join('')}<p class="notice">To change the portrait, add a photo to assets/ and enter its relative path above.</p>`;
    } else {
      const s=draft.sections.find(s=>s.id===selected);
      form.innerHTML=`<h2>${esc(s.label)}</h2>${field('Tab label','label',s.label)}${field('Page heading','title',s.title)}${field('Introduction','intro',s.intro,true)}<h3>Entries</h3><p>${s.id==='news'?'Add news with dates in YYYY-MM-DD format. Newest dates appear first; the homepage shows the latest three.':'Open an entry to edit it. Add papers, projects, course materials, events, talks, or social activities.'}</p><div id="entries">${s.items.map((i,n)=>`<details class="entry-editor"><summary>${esc(i.title||'Untitled entry')}</summary><div class="entry-fields" data-index="${n}"><div class="field-row">${field('Category','category',i.category)}${field('Date or year (optional)','date',i.date)}</div>${field('Title','title',i.title)}${field('Description','body',i.body,true)}${field('Link URL (optional)','url',i.url)}${field('Link label','linkText',i.linkText)}<div class="entry-actions"><button type="button" class="secondary" data-action="up" data-index="${n}" ${n===0?'disabled':''}>Move up</button><button type="button" class="secondary" data-action="down" data-index="${n}" ${n===s.items.length-1?'disabled':''}>Move down</button><button type="button" class="secondary" data-action="remove" data-index="${n}">Remove entry</button></div></div></details>`).join('')}</div><button class="button" type="button" id="add-entry">+ ${s.id==='news'?'Add news':'Add entry'}</button>`;
    }
  }
  form.addEventListener('submit',e=>e.preventDefault());
  form.addEventListener('input',e=>{
    if (!e.target.name) return;
    if (selected==='profile') draft.profile[e.target.name]=e.target.value;
    else {
      const section=draft.sections.find(s=>s.id===selected), entry=e.target.closest('[data-index]');
      if(entry) { section.items[Number(entry.dataset.index)][e.target.name]=e.target.value; if(e.target.name==='title') entry.closest('details').querySelector('summary').textContent=e.target.value||'Untitled entry'; }
      else section[e.target.name]=e.target.value;
    }
    save();
  });
  nav.addEventListener('click',e=>{ const button=e.target.closest('[data-select]'); if(button){selected=button.dataset.select;render();} });
  form.addEventListener('click',e=>{
    const button=e.target.closest('button');if(!button)return;
    const s=draft.sections.find(s=>s.id===selected);if(!s)return;
    if(button.id==='add-entry') {s.items.push({category:'',date:'',title:'New entry',body:'',url:'',linkText:'Learn more'});save();render();const entries=form.querySelectorAll('details');entries[entries.length-1].open=true;entries[entries.length-1].querySelector('input[name="title"]').focus();return;}
    const n=Number(button.dataset.index);
    if(button.dataset.action==='remove') {s.items.splice(n,1);save();render();}
    if(button.dataset.action==='up' && n>0) {[s.items[n-1],s.items[n]]=[s.items[n],s.items[n-1]];save();render();}
    if(button.dataset.action==='down' && n<s.items.length-1) {[s.items[n+1],s.items[n]]=[s.items[n],s.items[n+1]];save();render();}
  });
  function download(name,text,type) {const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  document.querySelector('#download').addEventListener('click',()=>{download('content.js','/* Website content. Edit using editor.html. */\nwindow.SITE_CONTENT = '+JSON.stringify(draft,null,2).replace(/</g,'\\u003c')+';\n','text/javascript');status.textContent='content.js downloaded. Replace the website file to publish.';});
  document.querySelector('#backup').addEventListener('click',()=>download('nipuna-website-draft.json',JSON.stringify(draft,null,2),'application/json'));
  document.querySelector('#import-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const value=migrate(JSON.parse(await file.text()));if(!valid(value))throw new Error('This backup does not match the website format.');draft=value;save();render();status.textContent='Backup imported into this browser draft.';}catch(err){status.textContent='Import failed: '+err.message;}e.target.value='';});
  const dialog=document.querySelector('#preview-dialog');
  document.querySelector('#preview').addEventListener('click',()=>{
    const box=dialog.querySelector('.preview-body');
    if(selected==='profile')box.innerHTML=`<p class="eyebrow">PROFILE PREVIEW</p><h1>${esc(draft.profile.name)}<span>${esc(draft.profile.headline)}</span></h1><p>${esc(draft.profile.role)} · ${esc(draft.profile.university)}</p><p class="intro">${esc(draft.profile.intro)}</p>`;
    else {const s=draft.sections.find(s=>s.id===selected);box.innerHTML=`<p class="eyebrow">${esc(s.label)}</p><h1>${esc(s.title)}</h1><p class="intro">${esc(s.intro)}</p><div class="cards">${s.items.map(i=>`<article class="card"><div class="card-meta"><span>${esc(i.category)}</span><span>${esc(i.date)}</span></div><h3>${esc(i.title)}</h3><p>${esc(i.body)}</p>${i.url?`<span class="card-link">${esc(i.linkText||'Learn more')} ↗</span>`:''}</article>`).join('')}</div>`;}
    dialog.showModal();
  });
  document.querySelector('#close-preview').addEventListener('click',()=>dialog.close());
  render();
})();
