gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({ duration: 1.1, easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true, wheelMultiplier: 1 });

lenis.on('scroll', function(e) { ScrollTrigger.update(); });

gsap.ticker.add(function(time) { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

var navPill = document.querySelector('.nav-pill');
var navLinks = document.querySelectorAll('nav a');
var logoImg = document.querySelector('.logo-icon img');
function updateNav(on) {
  gsap.to(navPill, { background: on ? '#ffffff' : 'rgba(255,255,255,0.08)', borderColor: on ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.12)', boxShadow: on ? '0 4px 24px rgba(0,0,0,0.08)' : 'none', duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
  gsap.to(navLinks, { color: on ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)', duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
  if (on) logoImg.classList.add('nav-scrolled');
  else logoImg.classList.remove('nav-scrolled');
}
var scrolled = false;
lenis.on('scroll', function(e) {
  var y = e.scroll || e.animatedScroll || e.offset || 0;
  if (y > 80 && !scrolled) { scrolled = true; updateNav(true); }
  else if (y <= 80 && scrolled) { scrolled = false; updateNav(false); }
});

window.addEventListener('load', function() {
  ScrollTrigger.refresh();
  lenis.resize();
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
});

function initThreeHero() {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  var w = canvas.parentElement.clientWidth;
  var h = canvas.parentElement.clientHeight;
  var scene = new THREE.Scene();
  var camera = new THREE.OrthographicCamera(-w/200, w/200, h/200, -h/200, 0.1, 100);
  camera.position.z = 10;
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var particlesGeo = new THREE.BufferGeometry();
  var count = 80;
  var pos = new Float32Array(count * 3);
  for (var i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 8;
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  var particlesMat = new THREE.PointsMaterial({ color: 0x4faed4, size: 0.03, transparent: true, opacity: 0.2 });
  var particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.001;
    renderer.render(scene, camera);
  }
  animate();

  var resizeId;
  window.addEventListener('resize', function() {
    clearTimeout(resizeId);
    resizeId = setTimeout(function() {
      var pw = canvas.parentElement.clientWidth;
      var ph = canvas.parentElement.clientHeight;
      camera.left = -pw/200;
      camera.right = pw/200;
      camera.top = ph/200;
      camera.bottom = -ph/200;
      camera.updateProjectionMatrix();
      renderer.setSize(pw, ph);
    }, 200);
  });
}

function initDeviceTilt() {
  var wrapper = document.getElementById('device-wrapper');
  var tablet = document.getElementById('device-tablet');
  var shadow = document.getElementById('device-shadow');
  if (!wrapper || !tablet) return;
  var currentX = 2, currentY = -4, currentSX = 0;
  var targetX = 2, targetY = -4, targetSX = 0;

  document.addEventListener('mousemove', function(e) {
    var rect = wrapper.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    var deltaX = (e.clientX - centerX) / (rect.width / 2);
    var deltaY = (e.clientY - centerY) / (rect.height / 2);
    targetY = deltaX * 10;
    targetX = -deltaY * 7;
    targetSX = deltaX * -8;
  });

  gsap.ticker.add(function() {
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;
    currentSX += (targetSX - currentSX) * 0.05;
    tablet.style.transform = 'rotateX(' + currentX + 'deg) rotateY(' + currentY + 'deg)';
    if (shadow) shadow.style.transform = 'translateX(calc(-50% + ' + currentSX + 'px)) scaleX(' + (1 + Math.abs(currentX) * 0.005) + ') scaleY(' + Math.max(0.6, 1 - Math.abs(currentX) * 0.015) + ')';
  });
}

function animateElements() {
  gsap.set('.logo-hero', { opacity: 0, x: -30 });
  gsap.set('.hero-left h1', { opacity: 0, x: -40 });
  gsap.set('.hero-left p', { opacity: 0, x: -30 });
  gsap.set('.hero-btns', { opacity: 0, y: 20 });
  gsap.set('.device-wrapper', { opacity: 0, scale: 0.85 });
  gsap.set('.ft-left', { opacity: 0, x: -60 });
  gsap.set('.f-card', { opacity: 0, y: 40 });
  gsap.set('.carpeta', { opacity: 0, y: 60 });
  gsap.set('.s-card', { opacity: 0, y: 30 });

  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('.logo-hero', { opacity: 1, x: 0, duration: 0.4 });
  tl.to('.hero-left h1', { opacity: 1, x: 0, duration: 0.5 }, '-=0.15');
  tl.to('.hero-left p', { opacity: 1, x: 0, duration: 0.35 }, '-=0.25');
  tl.to('.hero-btns', { opacity: 1, y: 0, duration: 0.3 }, '-=0.1');
  tl.to('.device-wrapper', { opacity: 1, scale: 1, duration: 0.65, ease: 'back.out(1.4)' }, '-=0.3');

  gsap.to('.carpeta', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.about-section', start: 'top 80%', toggleActions: 'play none none none' } });

  /* ===== SERVICES SCROLL ANIMATION ===== */
  (function() {
    var row1 = Array.from(document.querySelectorAll('.brick-card[data-svc-row="1"]'));
    var row2 = Array.from(document.querySelectorAll('.brick-card[data-svc-row="2"]'));
    if (!row1.length && !row2.length) return;

    var mm = gsap.matchMedia();

    /* Desktop + Tablet: animaci├│n con scrub (reversible al subir) */
    mm.add('(min-width: 600px)', function() {
      /* Esconder inicialmente */
      gsap.set(row1, { opacity: 1, x: '-120vw' });
      gsap.set(row2, { opacity: 1, x: '120vw' });

      /* Fila 1: entra de izquierda ÔåÆ derecha */
      gsap.to(row1, {
        x: 0,
        duration: 1,
        stagger: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.services-section',
          start: 'top 95%',
          end: 'top 38%',
          scrub: 1,
          toggleActions: 'play reverse play reverse'
        }
      });

      /* Fila 2: entra de derecha ÔåÆ izquierda */
      gsap.to(row2, {
        x: 0,
        duration: 1,
        stagger: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.services-section',
          start: 'top 90%',
          end: 'top 32%',
          scrub: 1,
          toggleActions: 'play reverse play reverse'
        }
      });
    });

    /* Mobile: animaci├│n simple sin scrub */
    mm.add('(max-width: 599px)', function() {
      var allCards = row1.concat(row2);
      gsap.set(allCards, { opacity: 0, y: 25 });
      gsap.to(allCards, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out',
        scrollTrigger: { trigger: '.services-section', start: 'top 88%', toggleActions: 'play none none none' }
      });
    });
  })();


  gsap.set('.ft-left', { opacity: 0, x: -40 });
  gsap.set('.f-card', { opacity: 0, y: 25, scale: 0.92 });
  gsap.set('.ft-right', { opacity: 0 });
  var entranceTl = gsap.timeline({ scrollTrigger: { trigger: '.ft-section', start: 'top 90%', toggleActions: 'play none none none' } });
  entranceTl.to('.ft-left', { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
  entranceTl.to('.f-card', { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.2)' }, '-=0.3');
  entranceTl.to('.ft-right', { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');

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

  /* ===== POST-IT SCROLL (de a pares, onEnter/onLeaveBack) ===== */
  var postitEls = document.querySelectorAll('.about-postit');
  if (postitEls.length) {
    var pairs = [[0,3],[1,4],[2,5]];
    var pairStarts = ['top 92%', 'top 58%', 'top 24%'];
    gsap.set(postitEls, { scale: 0.5, opacity: 0 });
    pairs.forEach(function(pair, pairIdx) {
      pair.forEach(function(idx) {
        var el = postitEls[idx];
        var tw = gsap.to(el, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.5)', paused: true });
        ScrollTrigger.create({
          trigger: '.about-section',
          start: pairStarts[pairIdx],
          onEnter: function() { tw.play(); },
          onLeaveBack: function() { tw.reverse(); }
        });
      });
    });
  }

  /* ===== REVIEWS POST-IT SCROLL ===== */
  var reviewsPostitEls = document.querySelectorAll('.reviews-postit');
  if (reviewsPostitEls.length) {
    var reviewsStarts = ['top 85%', 'top 60%', 'top 35%'];
    gsap.set(reviewsPostitEls, { scale: 0.5, opacity: 0 });
    reviewsPostitEls.forEach(function(el, idx) {
      var tw = gsap.to(el, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.5)', paused: true });
      ScrollTrigger.create({
        trigger: '.reviews-section',
        start: reviewsStarts[idx] || 'top 60%',
        onEnter: function() { tw.play(); },
        onLeaveBack: function() { tw.reverse(); }
      });
    });
  }

  /* ===== REVIEWS BACKGROUND STARS SCROLL ===== */
  var reviewsStarEls = document.querySelectorAll('.reviews-paper-star-wrapper');
  if (reviewsStarEls.length) {
    gsap.set(reviewsStarEls, { scale: 0.5, opacity: 0 });
    var starsTw = gsap.to(reviewsStarEls, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'back.out(2.2)', paused: true });
    ScrollTrigger.create({
      trigger: '.reviews-section',
      start: 'top 80%',
      onEnter: function() { starsTw.play(); },
      onLeaveBack: function() { starsTw.reverse(); }
    });
  }
}

function initHeroCars() {
  var container = document.getElementById('heroCars');
  if (!container) return;

  function rnd(min, max) { return Math.random() * (max - min) + min; }

  function createDiagonalRoad(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var px = dx / 100 * window.innerWidth;
    var py = dy / 100 * window.innerHeight;
    var dist = Math.sqrt(px * px + py * py);
    var roadW = dist / window.innerWidth * 100;
    var angle = Math.atan2(py, px);
    var midX = (x1 + x2) / 2;
    var midY = (y1 + y2) / 2;
    var roadH = 'clamp(190px,20vw,300px)';
    var bW = 'clamp(2px,0.15vw,3px)';

    var road = document.createElement('div');
    road.style.cssText = [
      'position:absolute',
      'left:' + midX + 'vw',
      'top:' + midY + 'vh',
      'width:' + roadW + 'vw',
      'height:' + roadH,
      'background:transparent',
      'border-top:' + bW + ' solid rgba(255,255,255,0.35)',
      'border-bottom:' + bW + ' solid rgba(255,255,255,0.35)',
      'transform:translate(-50%,-50%) rotate(' + (angle * 180 / Math.PI) + 'deg)',
      'pointer-events:none',
      'z-index:0'
    ].join(';');

    var dashH = 'clamp(2px,0.2vw,4px)';
    var line = document.createElement('div');
    line.style.cssText = [
      'position:absolute',
      'top:50%',
      'left:0',
      'width:100%',
      'height:' + dashH,
      'background:repeating-linear-gradient(90deg,white 0,white 40px,transparent 40px,transparent 70px)',
      'transform:translateY(-50%)',
      'pointer-events:none',
      'opacity:0.5'
    ].join(';');
    road.appendChild(line);
    container.appendChild(road);
  }

  function createDiagonalCar(x1, y1, x2, y2, speed, reverse, startOffset) {
    var car = document.createElement('div');
    car.className = 'car-anim';
    var w = 'clamp(110px,12vw,180px)';
    startOffset = startOffset || 0;

    var sx = reverse ? x2 : x1;
    var sy = reverse ? y2 : y1;
    var ex = reverse ? x1 : x2;
    var ey = reverse ? y1 : y2;

    var dx = ex - sx;
    var dy = ey - sy;
    var px = dx / 100 * window.innerWidth;
    var py = dy / 100 * window.innerHeight;
    var angle = Math.atan2(py, px);
    var rot = angle * 180 / Math.PI;

    var roadDx = x2 - x1;
    var roadDy = y2 - y1;
    var roadPx = roadDx / 100 * window.innerWidth;
    var roadPy = roadDy / 100 * window.innerHeight;
    var roadAngle = Math.atan2(roadPy, roadPx);
    var perpX = -Math.sin(roadAngle);
    var perpY = Math.cos(roadAngle);
    var roadWPx = Math.min(Math.max(190, window.innerWidth * 0.20), 300);
    var off = roadWPx / window.innerWidth * 30;
    var loX = (reverse ? 1 : -1) * off * perpX;
    var loY = (reverse ? 1 : -1) * off * perpY * (window.innerWidth / window.innerHeight);

    car.style.cssText = [
      'width:' + w,
      'position:absolute',
      'z-index:1',
      'pointer-events:none',
      'top:0',
      'left:0',
      'transform:translate(-50%,-50%) rotate(' + rot + 'deg)'
    ].join(';');

    var img = document.createElement('img');
    img.src = '/auto_' + (Math.floor(Math.random() * 6) + 1) + '.png';
    img.alt = '';
    img.draggable = false;
    car.appendChild(img);
    container.appendChild(car);

    var ssx = sx + dx * startOffset;
    var ssy = sy + dy * startOffset;
    var firstDuration = speed * (1 - startOffset);

    function firstLeg() {
      gsap.set(car, { left: (ssx + loX) + 'vw', top: (ssy + loY) + 'vh' });
      gsap.to(car, {
        left: (ex + loX) + 'vw',
        top: (ey + loY) + 'vh',
        duration: firstDuration,
        ease: 'none',
        overwrite: 'auto',
        onComplete: drive
      });
    }

    function drive() {
      gsap.set(car, { left: (sx + loX) + 'vw', top: (sy + loY) + 'vh' });
      gsap.to(car, {
        left: (ex + loX) + 'vw',
        top: (ey + loY) + 'vh',
        duration: speed,
        ease: 'none',
        overwrite: 'auto',
        onComplete: drive
      });
    }

    if (img.complete) { firstLeg(); } else { img.onload = firstLeg; }
  }

  var s1 = rnd(16, 22), s2 = rnd(16, 22);
  createDiagonalRoad(-11.4, 120, 31.8, -15);
  createDiagonalCar(-11.4, 120, 31.8, -15, s1, false, 0);
  createDiagonalCar(-11.4, 120, 31.8, -15, s1, false, 0.5);
  createDiagonalCar(-11.4, 120, 31.8, -15, s2, true, 0);
  createDiagonalCar(-11.4, 120, 31.8, -15, s2, true, 0.5);

  var s3 = rnd(16, 22), s4 = rnd(16, 22);
  createDiagonalRoad(70.14, -15, 99.86, 115);
  createDiagonalCar(70.14, -15, 99.86, 115, s3, false, 0);
  createDiagonalCar(70.14, -15, 99.86, 115, s3, false, 0.5);
  createDiagonalCar(70.14, -15, 99.86, 115, s4, true, 0);
  createDiagonalCar(70.14, -15, 99.86, 115, s4, true, 0.5);
}

function setupCarousel(id, dir) {
  var track = document.getElementById(id);
  if (!track) return;
  var scrollAmount = 0;
  var speed = 0.7;
  var animId;
  function autoScroll() {
    var maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) { animId = requestAnimationFrame(autoScroll); return; }
    if (dir === 'right') {
      scrollAmount += speed;
      if (scrollAmount >= maxScroll) scrollAmount = 0;
    } else {
      scrollAmount -= speed;
      if (scrollAmount <= 0) scrollAmount = maxScroll;
    }
    track.scrollLeft = scrollAmount;
    animId = requestAnimationFrame(autoScroll);
  }
  animId = requestAnimationFrame(autoScroll);
  track.addEventListener('mouseleave', function() { animId = requestAnimationFrame(autoScroll); });
}

var reviewsData = [
  {"author_name":"Joel Pascuan","rating":5,"text":"Carina me solucion├│ todos los inconvenientes y me hizo ahorrar mucho tiempo. Necesitaba tramitar un patentamiento pero por mi cuenta se iba a complicar demasiado. Fue muy amable y atenta desde el minuto 1.","avatar":{"initials":"JP","bgColor":"#2e6a79"}},
  {"author_name":"Natalia Gandara","rating":5,"text":"┬íExcelente servicio! Carina gestion├│ todo de manera impecable, con much├¡sima rapidez y sin ning├║n tipo de inconveniente. El asesoramiento fue sumamente claro y profesional desde el primer momento. Una experiencia impecable y s├║per recomendable.","avatar":{"initials":"NG","bgColor":"#3d8a9e"}},
  {"author_name":"Carina Cipolletti","rating":5,"text":"Una excelente profesional. Me acompa├▒├│ en todo el proceso con responsabilidad, compromiso y mucha claridad. Siempre atenta a cada detalle y resolviendo todo con rapidez y buena predisposici├│n. Da mucha tranquilidad saber que est├í al tanto de todo y que pod├®s confiar plenamente en su trabajo. ┬íSin dudas la volver├¡a a elegir!","avatar":{"initials":"CC","bgColor":"#1a4a56"}},
  {"author_name":"Mateo Cientofante","rating":5,"text":"Servicio impecable y s├║per recomendable. Tuve una excelente experiencia con esta gestor├¡a. Me ayudaron en todo momento, explic├índome cada paso con claridad y resolviendo los tr├ímites de forma r├ípida y profesional.","avatar":{"initials":"MC","bgColor":"#1a4a56"}},
  {"author_name":"Fabi├ín Mazza","rating":5,"text":"Excelente servicio y de confianza. Me ayud├│ con la baja de un auto que me robaron, sali├│ todo bien y r├ípido. Me asisti├│ con todo lo que me ped├¡a el seguro. 100% recomendable.","avatar":{"initials":"FM","bgColor":"#2e6a79"}},
  {"author_name":"Mariana S├íez","rating":5,"text":"No conozco personalmente a Carina y la contact├® virtualmente. Le hice una consulta concreta y me respondi├│ no solo extremadamente profesional, amable y concreta, sino que no dudo un instante en ayudarme. 10/10.","avatar":{"initials":"MS","bgColor":"#4faed4"}},
  {"author_name":"Stella Di Paola","rating":5,"text":"Muy conforme con la gesti├│n de la venta del auto. Carina fue muy eficiente, clara y profesional en todo el proceso. Gracias!!!","avatar":{"initials":"SD","bgColor":"#4faed4"}},
  {"author_name":"Rosana Behotaz","rating":5,"text":"Excelente la atenci├│n, muy profesional. Es para recomendar. Nos agiliz├│ el patentado de un veh├¡culo. Muchas gracias Carina.","avatar":{"initials":"RB","bgColor":"#2e6a79"}},
  {"author_name":"Claudia Borneo","rating":5,"text":"Super recomendable! Siempre dispuesta a responder mis consultas y el tr├ímite sali├│ muy r├ípido.","avatar":{"initials":"CB","bgColor":"#2a5f6e"}},
  {"author_name":"Fernando Cientofante","rating":5,"text":"Rapidez y eficacia en los tr├ímites. Particularmente en baja de siniestro por destrucci├│n total.","avatar":{"initials":"FC","bgColor":"#2e6a79"}}
];


function renderStars(rating) {
  var s = '';
  for (var i = 0; i < 5; i++) s += i < rating ? 'Ôÿà' : 'Ôÿå';
  return s;
}

function loadReviews() {
  var container = document.getElementById('reviews-container');
  if (!container) return;
  container.innerHTML = '';
  reviewsData.forEach(function(r, i) {
    var card = document.createElement('div');
    card.className = 'r-card';
    card.style.opacity = '0';
    card.innerHTML =
      '<div class="r-header"><div class="r-avatar" style="background:' + r.avatar.bgColor + '">' + r.avatar.initials +
      '</div><div><div class="r-name">' + r.author_name + '</div><div class="r-stars">' + renderStars(r.rating) +
      '</div></div></div><p>' + r.text + '</p>';
    container.appendChild(card);
    gsap.fromTo(card,
      { opacity: 0, scale: 0.85, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, delay: i * 0.06, ease: 'back.out(1.8)', scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play reverse play reverse' } }
    );
  });
  setTimeout(function(){
    setupCarousel('reviews-container', 'right');
    var wrap = document.getElementById('reviews-truck-wrap');
    var grid = document.getElementById('reviews-container');
    if (wrap && grid) {
      var scrollTimer;
      grid.addEventListener('scroll', function(){
        wrap.classList.add('scrolling');
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function(){ wrap.classList.remove('scrolling'); }, 300);
      });
    }
  }, 800);
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
    el.style.transform = 'translate(' + (mouseX * i * 12).toFixed(1) + 'px, ' + (mouseY * i * 12).toFixed(1) + 'px) rotate(' + rot + ')';
  });
});

window.addEventListener('resize', initDecoElements);

window.addEventListener('DOMContentLoaded', function() {
  lenis.stop();
  initDecoElements();
  initThreeHero();
  initDeviceTilt();
  initHeroCars();
  animateElements();
  setupCarousel('carousel1', 'right');
  setupCarousel('carousel2', 'left');
  loadReviews();
  ScrollTrigger.refresh();
  setTimeout(function() {
    ScrollTrigger.refresh();
    lenis.start();
  }, 400);
  setTimeout(function() { ScrollTrigger.refresh(); }, 1000);
});
