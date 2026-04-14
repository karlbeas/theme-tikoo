/**
 * TIKOO.JS — Core JavaScript
 * Platform: Tikoo Professional Network
 * Version: 1.0
 */
(function () {
  'use strict';
  var THEME_KEY = 'tikoo-theme';

  function getTheme() { return localStorage.getItem(THEME_KEY) || 'light'; }
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    document.querySelectorAll('[data-theme-icon]').forEach(function (el) {
      el.innerHTML = t === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
    });
  }
  function toggleTheme() {
    var n = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, n); applyTheme(n);
  }

  function initSidebar() {
    var sidebar = document.getElementById('tko-sidebar');
    var overlay = document.getElementById('tko-overlay');
    if (!sidebar) return;
    function open() { sidebar.classList.add('show'); if (overlay) overlay.classList.add('show'); document.body.style.overflow = 'hidden'; }
    function close() { sidebar.classList.remove('show'); if (overlay) overlay.classList.remove('show'); document.body.style.overflow = ''; }
    document.querySelectorAll('[data-sidebar-toggle]').forEach(function (b) { b.addEventListener('click', open); });
    if (overlay) overlay.addEventListener('click', close);
    window.addEventListener('resize', function () { if (window.innerWidth > 991) close(); });
  }

  function initTabs() {
    document.querySelectorAll('.tko-tabs-wrap').forEach(function (wrap) {
      wrap.querySelectorAll('.tko-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          wrap.querySelectorAll('.tko-tab').forEach(function (t) { t.classList.remove('active'); });
          this.classList.add('active');
        });
      });
    });
  }

  function initChips() {
    document.querySelectorAll('.tko-chip-group').forEach(function (g) {
      var multi = g.dataset.multi === 'true';
      g.querySelectorAll('.tko-chip').forEach(function (c) {
        c.addEventListener('click', function () {
          if (multi) { this.classList.toggle('active'); }
          else { g.querySelectorAll('.tko-chip').forEach(function (x) { x.classList.remove('active'); }); this.classList.add('active'); }
        });
      });
    });
  }

  function initPostActions() {
    document.querySelectorAll('.tko-post-action[data-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var a = this.dataset.action, icon = this.querySelector('i'), cnt = this.querySelector('.action-count');
        if (a === 'like') {
          this.classList.toggle('liked');
          if (cnt) { var n = parseInt(cnt.textContent)||0; cnt.textContent = this.classList.contains('liked') ? n+1 : Math.max(0,n-1); }
        }
        if (a === 'save') {
          this.classList.toggle('saved');
          if (icon) icon.className = this.classList.contains('saved') ? 'bi bi-bookmark-fill' : 'bi bi-bookmark';
        }
        if (a === 'repost') {
          this.classList.toggle('reposted');
          if (icon) icon.style.color = this.classList.contains('reposted') ? 'var(--tko-success)' : '';
          if (cnt) { var n2 = parseInt(cnt.textContent)||0; cnt.textContent = this.classList.contains('reposted') ? n2+1 : Math.max(0,n2-1); }
        }
      });
    });
  }

  function initComposer() {
    document.querySelectorAll('.tko-composer-input').forEach(function (ta) {
      ta.addEventListener('input', function () { this.style.height = 'auto'; this.style.height = Math.min(this.scrollHeight, 200)+'px'; });
    });
  }

  var SUGGESTIONS = [
    'Plombier disponible à Douala Akwa',
    'Photographe professionnel Bonapriso',
    'Comptable agréé OHADA près de moi',
    'Développeur PHP freelance Yaoundé',
    'Mécanicien auto ouvert maintenant',
    "Professeur d'anglais Bonamoussadi",
    'Avocat droit des affaires Douala',
    'Designer graphique logo urgent',
    'Électricien certifié Akwa Nord',
    'Marketing manager emploi Bastos',
  ];

  function initSearch() {
    document.querySelectorAll('.tko-search-smart').forEach(function (input) {
      var wrapper = input.parentElement;
      if (!wrapper) return;
      wrapper.style.position = 'relative';
      var dd = document.createElement('div');
      Object.assign(dd.style, { position:'absolute', top:'100%', left:'0', right:'0', background:'var(--tko-surface)', border:'1px solid var(--tko-border)', borderRadius:'var(--tko-radius)', boxShadow:'var(--tko-shadow-lg)', zIndex:'2000', display:'none', marginTop:'6px', overflow:'hidden' });
      wrapper.appendChild(dd);
      function render(list) {
        if (!list.length) { dd.style.display='none'; return; }
        dd.innerHTML = list.map(function(s){ return '<div class="tko-sug" style="display:flex;align-items:center;gap:.6rem;padding:.65rem 1rem;cursor:pointer;font-size:13px;color:var(--tko-text-secondary);"><i class="bi bi-search" style="color:var(--tko-text-muted);font-size:12px;"></i><span>'+s+'</span></div>'; }).join('');
        dd.style.display='block';
        dd.querySelectorAll('.tko-sug').forEach(function(item){
          item.addEventListener('mouseenter', function(){ this.style.background='var(--tko-primary-light)'; });
          item.addEventListener('mouseleave', function(){ this.style.background=''; });
          item.addEventListener('click', function(){ input.value=this.querySelector('span').textContent; dd.style.display='none'; });
        });
      }
      input.addEventListener('focus', function(){ render(SUGGESTIONS.slice(0,5)); });
      input.addEventListener('input', function(){
        var q=this.value.toLowerCase().trim();
        render(q ? SUGGESTIONS.filter(function(s){return s.toLowerCase().includes(q);}) : SUGGESTIONS.slice(0,5));
      });
      document.addEventListener('click', function(e){ if(!wrapper.contains(e.target)) dd.style.display='none'; });
    });
  }

  function showToast(msg, type) {
    type = type||'success';
    var colors = {success:'var(--tko-primary)',error:'var(--tko-danger)',info:'var(--tko-info)',warning:'var(--tko-warning)'};
    var t = document.createElement('div');
    Object.assign(t.style, { position:'fixed', bottom:'1.5rem', right:'1.5rem', background:'var(--tko-surface)', border:'1px solid var(--tko-border)', borderLeft:'4px solid '+(colors[type]||colors.success), borderRadius:'var(--tko-radius)', padding:'.875rem 1.25rem', boxShadow:'var(--tko-shadow-xl)', zIndex:'9999', fontSize:'14px', color:'var(--tko-text)', maxWidth:'320px', animation:'tkoIn .3s ease' });
    t.innerHTML = msg;
    if (!document.getElementById('tko-t-style')) { var s=document.createElement('style'); s.id='tko-t-style'; s.textContent='@keyframes tkoIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}'; document.head.appendChild(s); }
    document.body.appendChild(t);
    setTimeout(function(){ t.style.transition='opacity .3s'; t.style.opacity='0'; setTimeout(function(){ t.remove(); },300); }, 3500);
  }
  window.TikooToast = showToast;

  function setActiveNav() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.tko-nav-item').forEach(function(i){ var h=i.getAttribute('href')||''; i.classList.toggle('active', h!==''&&h.includes(page)); });
    document.querySelectorAll('.tko-bottom-nav-item').forEach(function(i){ var h=i.getAttribute('href')||''; i.classList.toggle('active', h!==''&&h.includes(page)); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getTheme());
    initSidebar();
    initTabs();
    initChips();
    initPostActions();
    initComposer();
    initSearch();
    setActiveNav();
    document.querySelectorAll('[data-toggle-theme]').forEach(function (b) { b.addEventListener('click', toggleTheme); });
  });
})();
