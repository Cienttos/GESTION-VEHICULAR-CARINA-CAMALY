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

function animateHero() {
  gsap.set('.logo-hero', { opacity: 0, x: -30 });
  gsap.set('.hero-left h1', { opacity: 0, x: -40 });
  gsap.set('.hero-left p', { opacity: 0, x: -30 });
  gsap.set('.hero-btns', { opacity: 0, y: 20 });
  gsap.set('.device-wrapper', { opacity: 0, scale: 0.85 });

  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('.logo-hero', { opacity: 1, x: 0, duration: 0.4 });
  tl.to('.hero-left h1', { opacity: 1, x: 0, duration: 0.5 }, '-=0.15');
  tl.to('.hero-left p', { opacity: 1, x: 0, duration: 0.35 }, '-=0.25');
  tl.to('.hero-btns', { opacity: 1, y: 0, duration: 0.3 }, '-=0.1');
  tl.to('.device-wrapper', { opacity: 1, scale: 1, duration: 0.65, ease: 'back.out(1.4)' }, '-=0.3');
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
