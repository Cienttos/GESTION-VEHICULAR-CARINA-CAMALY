function animateFeatures() {
  gsap.set('.ft-left', { opacity: 0, x: -60 });
  gsap.set('.f-card', { opacity: 0, y: 40 });

  gsap.set('.ft-left', { opacity: 0, x: -40 });
  gsap.set('.f-card', { opacity: 0, y: 25, scale: 0.92 });
  gsap.set('.ft-right', { opacity: 0 });
  var entranceTl = gsap.timeline({ scrollTrigger: { trigger: '.ft-section', start: 'top 90%', toggleActions: 'play none none none' } });
  entranceTl.to('.ft-left', { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
  entranceTl.to('.f-card', { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.2)' }, '-=0.3');
  entranceTl.to('.ft-right', { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');
}

function animateTimeline() {
  /* ===== TIMELINE SCROLL PROGRESS ===== */
  var tlSteps = Array.from(document.querySelectorAll('.timeline-step'));
  var tlProgress = document.getElementById('tlProgress');
  var tlFill = document.getElementById('tlFill');
  var totalSteps = tlSteps.length;

  function setActiveStep(idx) {
    tlSteps.forEach(function(step, i) {
      var isActive = i === idx;
      var isDone = i < idx;
      step.classList.toggle('is-active', isActive);
      step.classList.toggle('is-done', isDone);
      var marker = step.querySelector('.step-marker');
      if (marker && isActive) {
        gsap.fromTo(marker, { scale: 1.6 }, { scale: 1, duration: 0.5, ease: 'back.out(2.5)', overwrite: 'auto' });
      }
    });
    if (tlProgress) tlProgress.textContent = 'PASO ' + (idx + 1) + ' / ' + totalSteps;
  }

  function createTimelineTrigger() {
    if (!tlFill || !document.querySelector('.ft-section')) return;
    var timelineBody = document.querySelector('.timeline-body');
    var section = document.querySelector('.ft-section');

    function getOffsetTop(el, parent) {
      var top = 0;
      var cur = el;
      while (cur && cur !== parent) { top += cur.offsetTop; cur = cur.offsetParent; }
      return top;
    }

    function calcLineBounds() {
      if (!timelineBody || tlSteps.length < 2) return;
      var firstMkr = tlSteps[0].querySelector('.step-marker');
      var lastMkr = tlSteps[tlSteps.length - 1].querySelector('.step-marker');
      if (!firstMkr || !lastMkr) return;
      var t1 = getOffsetTop(firstMkr, timelineBody) + firstMkr.offsetHeight / 2;
      var t2 = getOffsetTop(lastMkr, timelineBody) + lastMkr.offsetHeight / 2;
      document.querySelector('.timeline-line').style.top = t1 + 'px';
      document.querySelector('.timeline-line').style.bottom = (timelineBody.offsetHeight - t2) + 'px';
      tlFill.style.top = t1 + 'px';
      return t2 - t1;
    }

    var fillRange = calcLineBounds() || (timelineBody ? timelineBody.offsetHeight - 20 : 260);

    gsap.set(tlFill, { height: 0 });
    setActiveStep(0);

    function makeScrub(trigger, start, end, scrubVal) {
      ScrollTrigger.create({
        trigger: trigger,
        start: start,
        end: end,
        scrub: scrubVal,
        onUpdate: function(self) {
          var progress = Math.max(0, Math.min(1, self.progress));
          var index = Math.min(totalSteps - 1, Math.floor(progress * totalSteps));
          setActiveStep(index);
          var lastStepAt = (totalSteps - 1) / totalSteps;
          gsap.to(tlFill, { height: fillRange * Math.min(1, progress / lastStepAt), duration: 0.08, overwrite: 'auto' });
          var car = document.getElementById('tlCar');
          if (car) gsap.to(car, { left: (-6 + progress * 70) + '%', duration: 0.08, overwrite: 'auto' });
        }
      });
    }

    var mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", function() { makeScrub('.ft-pinned-wrapper', 'top 100%', 'top top', 0.5); });
    mm.add("(max-width: 768px)", function() { makeScrub('.timeline-body', 'top 100%', 'bottom 40%', 1); });
  }

  createTimelineTrigger();
}

function initDecoElements() {
  var wrapper = document.querySelector('.ft-pinned-wrapper');
  if (!wrapper) return;
  wrapper.querySelectorAll('.deco-item').forEach(function(el){el.remove()});
  var codes = ['AB 123 CD','EF 456 GH','IJ 789 KL','MN 012 OP','QR 345 ST','UV 678 WX'];
  var flagSvg = '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#75aadb"/><rect y="6.66" width="30" height="6.68" fill="#fff"/><circle cx="15" cy="10" r="2.5" fill="#f4b41a"/><path d="M15 6.5l.5 1.5h1.5l-1.2.9.5 1.5-1.3-.8-1.3.8.5-1.5-1.2-.9h1.5z" fill="#f4b41a"/></svg>';
  var configs = [
    { left:'6%', top:'-4%', rot:-12, code:0 },
    { right:'2%', bottom:'2%', rot:-25, code:1 }
  ];
  configs.forEach(function(cfg){
    var el = document.createElement('div');
    el.className = 'deco-item deco-plate';
    el.dataset.rot = cfg.rot + 'deg';
    el.style.left = cfg.left || 'auto';
    el.style.right = cfg.right || 'auto';
    el.style.top = cfg.top || 'auto';
    el.style.bottom = cfg.bottom || 'auto';
    el.dataset.intensity = (0.5 + Math.random() * 0.5).toFixed(2);
    var code = codes[cfg.code % codes.length];
    el.innerHTML = '<div class="p-top"><img class="p-merco" src="/merco.webp" alt="M"/><span class="p-text">REPUBLICA ARGENTINA</span><span class="p-flag">' + flagSvg + '</span></div><div class="p-body"><span class="p-code">' + code + '</span></div>';
    el.style.transform = 'translate(0px, 0px) rotate(' + cfg.rot + 'deg)';
    wrapper.appendChild(el);
  });
  var folder = document.createElement('div');
  folder.className = 'deco-item deco-folder';
  folder.dataset.rot = '14deg';
  folder.style.right = '6%';
  folder.style.top = '-8%';
  folder.dataset.intensity = (0.5 + Math.random() * 0.5).toFixed(2);
  folder.innerHTML = '<div class="folder-body"><div class="folder-elastico tr"></div><div class="folder-elastico br"></div><div class="folder-tape"><span>08</span></div></div>';
  folder.style.transform = 'translate(0px, 0px) rotate(14deg)';
  wrapper.appendChild(folder);

  var folder2 = document.createElement('div');
  folder2.className = 'deco-item deco-folder';
  folder2.dataset.rot = '-26deg';
  folder2.style.left = '8%';
  folder2.style.bottom = '-7%';
  folder2.dataset.intensity = (0.5 + Math.random() * 0.5).toFixed(2);
  folder2.innerHTML = '<div class="folder-body"><div class="folder-elastico tr"></div><div class="folder-elastico br"></div><div class="folder-tape"><span>02</span></div></div>';
  folder2.style.transform = 'translate(0px, 0px) rotate(-26deg)';
  wrapper.appendChild(folder2);
}

var mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', function(e){
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  document.querySelectorAll('.ft-pinned-wrapper .deco-item').forEach(function(el){
    var i = parseFloat(el.dataset.intensity || 0.5);
    var rot = el.dataset.rot || '0deg';
    el.style.transform = 'translate(' + (mouseX * i * 20).toFixed(1) + 'px, ' + (mouseY * i * 20).toFixed(1) + 'px) rotate(' + rot + ')';
  });
});

window.addEventListener('resize', function() {
  ScrollTrigger.refresh();
  lenis.resize();
  setTimeout(function(){
    var tb = document.querySelector('.timeline-body');
    var fl = document.getElementById('tlFill');
    if (!tb || !fl) return;
    var st = document.querySelectorAll('.timeline-step');
    if (st.length < 2) return;
    function off(el, p) { var t=0,c=el; while(c&&c!==p){t+=c.offsetTop;c=c.offsetParent;} return t; }
    var f = st[0].querySelector('.step-marker');
    var l = st[st.length-1].querySelector('.step-marker');
    if (!f||!l) return;
    var t1 = off(f,tb)+f.offsetHeight/2;
    var t2 = off(l,tb)+l.offsetHeight/2;
    document.querySelector('.timeline-line').style.top = t1+'px';
    document.querySelector('.timeline-line').style.bottom = (tb.offsetHeight - t2)+'px';
    fl.style.top = t1+'px';
  }, 100);
  initDecoElements();
});
