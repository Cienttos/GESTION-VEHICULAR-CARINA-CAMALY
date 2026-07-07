function animateAbout() {
  gsap.to('.carpeta', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.about-section', start: 'top 80%', toggleActions: 'play none none none' } });

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
}
