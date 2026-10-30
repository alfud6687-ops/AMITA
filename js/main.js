(function () {
  var TYPES = [{"key": "neglect", "film": "munjingui", "human": "Cognitive Neglect", "beast": "MUN JIN GUI", "product": "생각 방치 보장보험", "desc": "검증은 미루고 답만 받아온 당신을 위한 기본 플랜"}, {"key": "faith", "film": "bokyongsu", "human": "Unfiltered Faith", "beast": "BOK YONG SU", "product": "맹신 무해지 종신보험", "desc": "한 번 믿으면 해지가 안 되는 무한 신뢰 플랜"}, {"key": "spread", "film": "jeonpajo", "human": "Lie Spread", "beast": "JEONPAJO", "product": "허위 전파 배상책임보험", "desc": "퍼뜨린 만큼 돌아오는 업보, 미리 대비하세요"}, {"key": "output", "film": "chwaryeongma", "human": "Fabricated Output", "beast": "CHWARYEONGMA", "product": "조작 결과 손해보험", "desc": "AI가 만든 증거, 내 것처럼 들고 다니셨나요?"}];


  /* ---- intro → archive → full-screen case ---- */
  var intro = document.getElementById('intro'), archive = document.getElementById('archive-view');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var panels = document.getElementById('panels'), items = Array.prototype.slice.call(panels.children);
  var live = document.getElementById('a-live'), closeBtn = document.getElementById('a-close');
  var cursor = document.getElementById('cursor'), openIdx = -1, busy = false;
  var OPEN_MS = reduce ? 0 : 1000;
  /* views: intro → cases → karma (character carousel) → site. Buttons move between them; browser back follows the same path. */
  var abv = document.getElementById('about-view');
  var VIEWS = { intro: intro, cases: archive, about: abv };
  var DUR = { intro: 800, cases: 900, about: 650 };
  var view = 'intro', T = null;
  function show(next, push) {
    if (next === view) return;
    clearTimeout(T);
    if (openIdx > -1) { closeCase(); }
    var prev = view; view = next;
    if (push) { try { history.pushState({ v: next }, ''); } catch (err) {} }
    if (next !== 'cases') cursor.classList.remove('is-on', 'is-down', 'is-hover');
    Object.keys(VIEWS).forEach(function (k) { VIEWS[k].classList.remove('is-leaving', 'is-entering'); });
    if (VIEWS[next]) { VIEWS[next].hidden = false; VIEWS[next].classList.add('is-entering'); }
    if (VIEWS[prev]) VIEWS[prev].classList.add('is-leaving');
    T = setTimeout(function () {
      Object.keys(VIEWS).forEach(function (k) { if (k !== next) VIEWS[k].hidden = true; VIEWS[k].classList.remove('is-leaving', 'is-entering'); });
      if (next === 'intro') document.getElementById('intro-go').focus({ preventScroll: true });
      else VIEWS[next].focus({ preventScroll: true });
    }, reduce ? 0 : DUR[next]);
  }
  try { history.replaceState({ v: 'intro' }, ''); } catch (err) {}
  window.addEventListener('popstate', function (e) {
    var v = e.state && e.state.v;
    if (v && (v in DUR)) show(v, false);
  });
  document.getElementById('intro-go').addEventListener('click', function () { show('cases', true); });
  document.getElementById('to-intro').addEventListener('click', function () { show('intro', true); });
  document.getElementById('ab-movies').addEventListener('click', function () { show('cases', true); });
  document.getElementById('a-about').addEventListener('click', function () { show('about', true); });
  document.getElementById('ab-logo').addEventListener('click', function () { show('intro', true); });
  var ABT = {
    ko: "본 프로젝트는 지식의 검증보다 '정보의 가성비'를 우선시하는 인지적 구두쇠들을 위한 업보 사정 시스템이다. 인지적 에너지를 아끼기 위해 AI 자가진단 결과를 맹목적으로 수용하고 확산하는 이들의 행위를 '데이터 악업'으로 규정한다. 이들이 쌓은 악업을 사품왕생 등급으로 분류하여, 스스로의 악업 소비 유형을 환생 짐승을 통해 직면하게 하고 비판적 사고를 회복하여 건강한 현생으로 극락왕생하도록 돕는 가상 브랜딩 프로젝트이다.",
    en: "AMITA is a karma-assessment system for cognitive misers who value cheap, fast information over verified knowledge. It defines the habit of blindly accepting and spreading AI self-diagnosis results to save mental effort as 'data karma'. Sorting that karma into four grades of rebirth, it makes each person face their own consumption type through a reincarnated beast, recover critical thinking, and be reborn into a healthy life. A fictional branding project."
  };
  Array.prototype.forEach.call(abv.querySelectorAll('[data-ablang]'), function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-ablang'), p = document.getElementById('ab-text');
      p.textContent = ABT[l]; p.setAttribute('lang', l);
      Array.prototype.forEach.call(abv.querySelectorAll('[data-ablang]'), function (x) { var on = x === b; x.classList.toggle('is-dark', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    });
  });

  /* archive language toggle: the filled pill is the language on screen */
  var AQ = { en: 'What is your health contents consumption type?', ko: '나의 건강 콘텐츠 소비 유형은?' };
  var PNAMES = {
    munjingui: { en: 'MUN JIN GUI', ko: '문진귀' },
    bokyongsu: { en: 'BOK YONG SU', ko: '복용수' },
    jeonpajo: { en: 'JEONPAJO', ko: '전파조' },
    chwaryeongma: { en: 'CHWARYEONGMA', ko: '촬영마' }
  };
  var PSUBS = {
    munjingui: { en: 'Cognitive Neglect', ko: '생각 방치' },
    bokyongsu: { en: 'Unfiltered Faith', ko: '맹신' },
    jeonpajo: { en: 'Lie Spread', ko: '허위 전파' },
    chwaryeongma: { en: 'Fabricated Output', ko: '조작 결과' }
  };
  Array.prototype.forEach.call(archive.querySelectorAll('[data-alang]'), function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-alang'), q = document.getElementById('a-q');
      q.textContent = AQ[l]; q.setAttribute('lang', l);
      items.forEach(function (li) {
        var film = li.getAttribute('data-film'), nm = PNAMES[film][l], sb = PSUBS[film][l];
        li.querySelector('.p-name').textContent = nm; li.querySelector('.p-sub').textContent = sb;
        var t = li.querySelector('.p-title');
        t.querySelector('span').textContent = li.querySelector('.p-no').textContent + ' · ' + sb;
        t.querySelector('b').textContent = nm;
      });
      Array.prototype.forEach.call(archive.querySelectorAll('[data-alang]'), function (x) { x.classList.toggle('is-dark', x.getAttribute('data-alang') === l); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    });
  });
  var lastSet = 0, lastX = -1, lastY = -1, canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  panels.addEventListener('pointermove', function (e) {
    lastX = e.clientX; lastY = e.clientY;
    var li = e.target.closest && e.target.closest('.panel');
    if (canHover && li && !li.classList.contains('is-active') && e.pointerType !== 'touch' && Date.now() - lastSet > 120) setActive(items.indexOf(li));
  });
  function setActive(i) {
    if (openIdx > -1 || busy) return;
    if (i > -1 && items[i].classList.contains('is-active')) return;
    lastSet = Date.now();
    items.forEach(function (li, j) { li.classList.toggle('is-active', j === i); });
    panels.classList.toggle('has-active', i > -1);
    items.forEach(function (li, j) {
      if (openIdx !== j) li.querySelector('video').pause();
    });
  }
  /* probe each case film once; panels without a file keep their poster */
  items.forEach(function (li, i) {
    var v = li.querySelector('video'), st = li.querySelector('.p-status');
    st.textContent = '시나리오 영상 준비 중';
    v.addEventListener('loadedmetadata', function () { li.classList.add('has-video'); st.textContent = ''; });
    v.addEventListener('error', function () { li.classList.remove('has-video'); });
    /* video ends on its own → return to the grid, same as pressing close */
    v.addEventListener('ended', function () { if (openIdx === i) closeCase(); });
    var film = li.getAttribute('data-film');
    v.src = /^https?:\/\//.test(film) ? film : 'videos/' + film + '.mp4';
    v.preload = 'metadata';
  });
  items.forEach(function (li, i) {
    li.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'touch' || !canHover || lastX < 0) return;
      /* ignore boundary events caused by the panels moving under a still pointer */
      if (Date.now() - lastSet < 700 && Math.abs(e.clientX - lastX) < 3 && Math.abs(e.clientY - lastY) < 3) return;
      setActive(i);
    });
    var hit = li.querySelector('.p-hit');
    hit.addEventListener('focus', function () { if (hit.matches(':focus-visible')) setActive(i); });
    hit.addEventListener('click', function () { openCase(i); });
  });
  panels.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch' && canHover) setActive(-1); });
  panels.addEventListener('focusout', function (e) { if (!panels.contains(e.relatedTarget)) setActive(-1); });
  function openCase(i) {
    if (busy || openIdx > -1) return;
    setActive(i); busy = true; openIdx = i;
    cursor.classList.add('is-down');
    archive.classList.add('is-open');
    items.forEach(function (li, j) { li.querySelector('.p-hit').tabIndex = -1; });
    var li = items[i], v = li.querySelector('video');
    live.textContent = li.querySelector('.p-name').textContent + ' 열림';
    setTimeout(function () {
      busy = false; archive.classList.add('is-settled'); cursor.classList.remove('is-down');
      if (li.classList.contains('has-video')) { v.currentTime = 0; v.muted = false; v.loop = false; var p = v.play(); if (p && p.catch) p.catch(function () { v.muted = true; v.play(); }); }
      closeBtn.focus({ preventScroll: true });
    }, OPEN_MS);
  }
  function closeCase() {
    if (openIdx < 0 || busy) return;
    var li = items[openIdx], v = li.querySelector('video'), i = openIdx;
    busy = true; v.muted = true; v.loop = true;
    archive.classList.remove('is-settled'); archive.classList.remove('is-open');
    setTimeout(function () {
      busy = false; openIdx = -1;
      items.forEach(function (x) { x.querySelector('.p-hit').tabIndex = 0; });
      live.textContent = li.querySelector('.p-name').textContent + ' 닫힘';
      li.querySelector('.p-hit').focus({ preventScroll: true });
      if (!li.matches(':hover')) setActive(-1);
    }, OPEN_MS);
  }
  closeBtn.addEventListener('click', closeCase);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !archive.hidden) closeCase(); });
  /* custom cursor: outlined circle, fills on press; difference blend keeps it visible on light and dark footage */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.documentElement.classList.add('cursor-live');
    var tx = -100, ty = -100, cx = -100, cy = -100, raf = 0;
    var inZone = function (el) { return !!(el && el.closest && el.closest('.intro, .archive')); };
    var tick = function () {
      cx += (tx - cx) * (reduce ? 1 : 0.28); cy += (ty - cy) * (reduce ? 1 : 0.28);
      cursor.style.translate = cx + 'px ' + cy + 'px';
      raf = (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.2) ? requestAnimationFrame(tick) : 0;
    };
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      if (cx < -50) { cx = tx; cy = ty; }
      var on = inZone(e.target) && !intro.classList.contains('is-gone');
      cursor.classList.toggle('is-on', on);
      cursor.classList.toggle('is-hover', !!(e.target.closest && e.target.closest('.p-hit, .intro-go, .a-link, .a-close, .a-home')));
      if (!raf) raf = requestAnimationFrame(tick);
    });
    document.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') cursor.classList.add('is-down'); });
    document.addEventListener('pointerup', function () { if (!busy) cursor.classList.remove('is-down'); });
    document.addEventListener('pointerleave', function () { cursor.classList.remove('is-on'); });
  }
})();
