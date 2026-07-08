var reviewsData = [
  {"author_name":"Joel Pascuan","rating":5,"text":"Carina me solucionó todos los inconvenientes y me hizo ahorrar mucho tiempo. Necesitaba tramitar un patentamiento pero por mi cuenta se iba a complicar demasiado. Fue muy amable y atenta desde el minuto 1.","avatar":{"initials":"JP","bgColor":"#2e6a79"}},
  {"author_name":"Natalia Gandara","rating":5,"text":"¡Excelente servicio! Carina gestionó todo de manera impecable, con muchísima rapidez y sin ningún tipo de inconveniente. El asesoramiento fue sumamente claro y profesional desde el primer momento. Una experiencia impecable y súper recomendable.","avatar":{"initials":"NG","bgColor":"#3d8a9e"}},
  {"author_name":"Carina Cipolletti","rating":5,"text":"Una excelente profesional. Me acompañó en todo el proceso con responsabilidad, compromiso y mucha claridad. Siempre atenta a cada detalle y resolviendo todo con rapidez y buena predisposición. Da mucha tranquilidad saber que está al tanto de todo y que podés confiar plenamente en su trabajo. ¡Sin dudas la volvería a elegir!","avatar":{"initials":"CC","bgColor":"#1a4a56"}},
  {"author_name":"Mateo Cientofante","rating":5,"text":"Servicio impecable y súper recomendable. Tuve una excelente experiencia con esta gestoría. Me ayudaron en todo momento, explicándome cada paso con claridad y resolviendo los trámites de forma rápida y profesional.","avatar":{"initials":"MC","bgColor":"#1a4a56"}},
  {"author_name":"Fabián Mazza","rating":5,"text":"Excelente servicio y de confianza. Me ayudó con la baja de un auto que me robaron, salió todo bien y rápido. Me asistió con todo lo que me pedía el seguro. 100% recomendable.","avatar":{"initials":"FM","bgColor":"#2e6a79"}},
  {"author_name":"Mariana Sáez","rating":5,"text":"No conozco personalmente a Carina y la contacté virtualmente. Le hice una consulta concreta y me respondió no solo extremadamente profesional, amable y concreta, sino que no dudo un instante en ayudarme. 10/10.","avatar":{"initials":"MS","bgColor":"#4faed4"}},
  {"author_name":"Stella Di Paola","rating":5,"text":"Muy conforme con la gestión de la venta del auto. Carina fue muy eficiente, clara y profesional en todo el proceso. Gracias!!!","avatar":{"initials":"SD","bgColor":"#4faed4"}},
  {"author_name":"Rosana Behotaz","rating":5,"text":"Excelente la atención, muy profesional. Es para recomendar. Nos agilizó el patentado de un vehículo. Muchas gracias Carina.","avatar":{"initials":"RB","bgColor":"#2e6a79"}},
  {"author_name":"Claudia Borneo","rating":5,"text":"Super recomendable! Siempre dispuesta a responder mis consultas y el trámite salió muy rápido.","avatar":{"initials":"CB","bgColor":"#2a5f6e"}},
  {"author_name":"Fernando Cientofante","rating":5,"text":"Rapidez y eficacia en los trámites. Particularmente en baja de siniestro por destrucción total.","avatar":{"initials":"FC","bgColor":"#2e6a79"}}
];

function renderStars(rating) {
  var s = '';
  for (var i = 0; i < 5; i++) s += i < rating ? '\u2605' : '\u2606';
  return s;
}

function loadReviews() {
  var container = document.getElementById('reviews-container');
  if (!container) return;
  container.innerHTML = '';
  var colsPerRow = 2;
  reviewsData.forEach(function(r, i) {
    var card = document.createElement('div');
    card.className = 'r-card';
    card.style.opacity = '0';
    card.innerHTML =
      '<div class="r-header"><div class="r-avatar" style="background:' + r.avatar.bgColor + '">' + r.avatar.initials +
      '</div><div><div class="r-name">' + r.author_name + '</div><div class="r-stars">' + renderStars(r.rating) +
      '</div></div></div><p>' + r.text + '</p>';
    container.appendChild(card);
    var rowDelay = Math.floor(i / colsPerRow) * 0.25;
    gsap.fromTo(card,
      { opacity: 0, scale: 0.85, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, delay: rowDelay, ease: 'back.out(1.8)', scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play reverse play reverse' } }
    );
  });
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

function animateReviews() {
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
