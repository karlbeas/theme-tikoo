/**
 * TIKOO.JS — Core JavaScript
 * Platform: Tikoo Professional Network
 * Version: 1.0
 */
(function(){
  'use strict';
  var THEME_KEY='tikoo-theme';

  /* ---- THEME ---- */
  function applyTheme(t){
    document.documentElement.setAttribute('data-theme',t);
    document.querySelectorAll('[data-theme-icon]').forEach(function(el){
      el.innerHTML=t==='dark'?'<i class="bi bi-sun-fill"></i>':'<i class="bi bi-moon-fill"></i>';
    });
  }
  function toggleTheme(){
    var c=document.documentElement.getAttribute('data-theme');
    var n=c==='dark'?'light':'dark';
    localStorage.setItem(THEME_KEY,n);
    applyTheme(n);
  }

  /* ---- SIDEBAR ---- */
  function initSidebar(){
    var sidebar=document.getElementById('tko-sidebar');
    var overlay=document.getElementById('tko-overlay');
    var toggles=document.querySelectorAll('[data-sidebar-toggle]');
    if(!sidebar)return;
    function open(){sidebar.classList.add('show');if(overlay)overlay.classList.add('show');document.body.style.overflow='hidden';}
    function close(){sidebar.classList.remove('show');if(overlay)overlay.classList.remove('show');document.body.style.overflow='';}
    toggles.forEach(function(btn){btn.addEventListener('click',open);});
    if(overlay)overlay.addEventListener('click',close);
    window.addEventListener('resize',function(){if(window.innerWidth>991)close();});
  }

  /* ---- TABS ---- */
  function initTabs(){
    document.querySelectorAll('.tko-tabs-wrap').forEach(function(wrap){
      wrap.querySelectorAll('.tko-tab').forEach(function(tab){
        tab.addEventListener('click',function(){
          wrap.querySelectorAll('.tko-tab').forEach(function(t){t.classList.remove('active');});
          this.classList.add('active');
        });
      });
    });
  }

  /* ---- CHIPS ---- */
  function initChips(){
    document.querySelectorAll('.tko-chip-group').forEach(function(g){
      var multi=g.dataset.multi==='true';
      g.querySelectorAll('.tko-chip').forEach(function(c){
        c.addEventListener('click',function(){
          if(multi){this.classList.toggle('active');}else{
            g.querySelectorAll('.tko-chip').forEach(function(x){x.classList.remove('active');});
            this.classList.add('active');
          }
        });
      });
    });
  }

  /* ---- POST ACTIONS ---- */
  function initPostActions(){
    document.querySelectorAll('.tko-post-action[data-action]').forEach(function(btn){
      btn.addEventListener('click',function(){
        var a=this.dataset.action,count=this.querySelector('.ac'),icon=this.querySelector('i'),n;
        if(a==='like'){this.classList.toggle('liked');if(count){n=parseInt(count.textContent)||0;count.textContent=this.classList.contains('liked')?n+1:Math.max(0,n-1);}}
        if(a==='save'){this.classList.toggle('saved');if(icon)icon.className=this.classList.contains('saved')?'bi bi-bookmark-fill':'bi bi-bookmark';}
        if(a==='repost'){this.classList.toggle('reposted');if(icon)icon.style.color=this.classList.contains('reposted')?'var(--tko-success)':'';if(count){n=parseInt(count.textContent)||0;count.textContent=this.classList.contains('reposted')?n+1:Math.max(0,n-1);}}
      });
    });
  }

  /* ---- COMPOSER ---- */
  function initComposer(){
    document.querySelectorAll('.tko-composer-input').forEach(function(ta){
      ta.addEventListener('input',function(){this.style.height='auto';this.style.height=Math.min(this.scrollHeight,200)+'px';});
    });
  }

  /* ---- SMART SEARCH ---- */
  var SUGGESTIONS=[
    'Plombier disponible à Douala Akwa',
    'Photographe professionnel Bonapriso',
    'Comptable agréé OHADA près de moi',
    'Développeur PHP freelance Yaoundé',
    'Mécanicien auto ouvert maintenant',
    'Professeur d\'anglais Bonamoussadi',
    'Avocat droit des affaires Douala',
    'Designer graphique logo urgent',
    'Électricien certifié Akwa Nord',
    'Marketing manager Yaoundé Bastos'
  ];

  function initSearch(){
    document.querySelectorAll('.tko-search-smart').forEach(function(input){
      var w=input.parentElement;if(!w)return;
      w.style.position='relative';
      var dd=document.createElement('div');
      Object.assign(dd.style,{position:'absolute',top:'100%',left:'0',right:'0',background:'var(--tko-surface)',border:'1px solid var(--tko-border)',borderRadius:'var(--tko-radius)',boxShadow:'var(--tko-shadow-lg)',zIndex:'2000',display:'none',marginTop:'6px',overflow:'hidden'});
      w.appendChild(dd);
      function render(list){
        if(!list.length){dd.style.display='none';return;}
        dd.innerHTML=list.map(function(s){return'<div class="tko-si" style="display:flex;align-items:center;gap:.6rem;padding:.65rem 1rem;cursor:pointer;font-size:13px;color:var(--tko-text-secondary);"><i class="bi bi-search" style="color:var(--tko-text-muted);font-size:12px;"></i><span>'+s+'</span></div>';}).join('');
        dd.style.display='block';
        dd.querySelectorAll('.tko-si').forEach(function(item){
          item.addEventListener('mouseenter',function(){this.style.background='var(--tko-primary-light)';});
          item.addEventListener('mouseleave',function(){this.style.background='';});
          item.addEventListener('click',function(){input.value=this.querySelector('span').textContent;dd.style.display='none';});
        });
      }
      input.addEventListener('focus',function(){render(SUGGESTIONS.slice(0,5));});
      input.addEventListener('input',function(){var q=this.value.toLowerCase().trim();render(q?SUGGESTIONS.filter(function(s){return s.toLowerCase().includes(q);}):SUGGESTIONS.slice(0,5));});
      document.addEventListener('click',function(e){if(!w.contains(e.target))dd.style.display='none';});
    });
  }

  /* ---- TOAST ---- */
  function showToast(msg,type){
    type=type||'success';
    var c={success:'var(--tko-primary)',error:'var(--tko-danger)',info:'var(--tko-info)',warning:'var(--tko-warning)'};
    var t=document.createElement('div');
    Object.assign(t.style,{position:'fixed',bottom:'1.5rem',right:'1.5rem',background:'var(--tko-surface)',border:'1px solid var(--tko-border)',borderLeft:'4px solid '+(c[type]||c.success),borderRadius:'var(--tko-radius)',padding:'.875rem 1.25rem',boxShadow:'var(--tko-shadow-xl)',zIndex:'9999',fontSize:'14px',color:'var(--tko-text)',maxWidth:'320px',animation:'tkoSlideIn .3s ease'});
    t.innerHTML=msg;
    if(!document.getElementById('_tks')){var s=document.createElement('style');s.id='_tks';s.textContent='@keyframes tkoSlideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}';document.head.appendChild(s);}
    document.body.appendChild(t);
    setTimeout(function(){t.style.transition='opacity .3s';t.style.opacity='0';setTimeout(function(){t.remove();},300);},3500);
  }
  window.TikooToast=showToast;

  /* ---- ACTIVE NAV ---- */
  function setActiveNav(){
    var page=window.location.pathname.split('/').pop()||'index.html';
    document.querySelectorAll('.tko-nav-item,.tko-bottom-nav-item').forEach(function(item){
      var href=item.getAttribute('href')||'';
      item.classList.toggle('active',href!==''&&href.includes(page));
    });
  }

  /* ---- INIT ---- */
  document.addEventListener('DOMContentLoaded',function(){
    applyTheme(localStorage.getItem(THEME_KEY)||'light');
    initSidebar();
    initTabs();
    initChips();
    initPostActions();
    initComposer();
    initSearch();
    setActiveNav();
    document.querySelectorAll('[data-toggle-theme]').forEach(function(btn){
      btn.addEventListener('click',toggleTheme);
    });
  });
})();
