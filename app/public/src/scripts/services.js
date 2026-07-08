function animateServices() {
  /* ===== SERVICES SCROLL ANIMATION ===== */
  (function() {
    var svcRow1 = document.querySelector('.svc-row-1');
    var svcRow2 = document.querySelector('.svc-row-2');
    if (!svcRow1) return;

    var mm = gsap.matchMedia();

    /* Desktop + Tablet: animación con scrub (reversible al subir) */
    mm.add('(min-width: 600px)', function() {
      gsap.set(svcRow1, { x: '-120vw' });
      gsap.set(svcRow2, { x: '120vw' });

      gsap.to(svcRow1, {
        x: '8vw',
        duration: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.services-section',
          start: 'top 110%',
          end: 'bottom 60%',
          scrub: 2,
          toggleActions: 'play reverse play reverse'
        }
      });

      gsap.to(svcRow2, {
        x: '-8vw',
        duration: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.services-section',
          start: 'top 110%',
          end: 'bottom 60%',
          scrub: 2,
          toggleActions: 'play reverse play reverse'
        }
      });
    });

    /* 1366px: recorrido reducido */
    mm.add('(min-width: 1200px) and (max-width: 1440px)', function() {
      gsap.set(svcRow1, { x: '-8vw' });
      gsap.set(svcRow2, { x: '8vw' });

      gsap.to(svcRow1, {
        x: '0vw',
        duration: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.services-section',
          start: 'top 110%',
          end: 'bottom 60%',
          scrub: 2,
          toggleActions: 'play reverse play reverse'
        }
      });

      gsap.to(svcRow2, {
        x: '-0vw',
        duration: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.services-section',
          start: 'top 110%',
          end: 'bottom 60%',
          scrub: 2,
          toggleActions: 'play reverse play reverse'
        }
      });
    });

    /* Mobile: animación simple sin scrub */
    mm.add('(max-width: 599px)', function() {
      gsap.set(svcRow1, { x: '-100vw' });
      gsap.set(svcRow2, { x: '100vw' });
      gsap.to(svcRow1, {
        x: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.services-section', start: 'top 88%', toggleActions: 'play none none none' }
      });
      gsap.to(svcRow2, {
        x: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.services-section', start: 'top 88%', toggleActions: 'play none none none' }
      });
    });
  })();
}
