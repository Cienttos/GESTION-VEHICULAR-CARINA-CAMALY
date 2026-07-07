gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({ duration: 1.1, easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true, wheelMultiplier: 1 });

lenis.on('scroll', function(e) { ScrollTrigger.update(); });

gsap.ticker.add(function(time) { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

window.addEventListener('load', function() {
  ScrollTrigger.refresh();
  lenis.resize();
});

window.addEventListener('DOMContentLoaded', function() {
  lenis.stop();
  initDecoElements();
  initThreeHero();
  initDeviceTilt();
  initHeroCars();
  animateHero();
  animateFeatures();
  animateTimeline();
  animateAbout();
  animateServices();
  animateReviews();
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
