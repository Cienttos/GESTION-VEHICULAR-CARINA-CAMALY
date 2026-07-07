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
