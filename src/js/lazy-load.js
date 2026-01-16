// Lazy load non-critical resources for better performance
(function () {
  "use strict";

  // Load AOS library after page load
  function loadAOS() {
    if (window.AOS) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js";
    script.onload = function () {
      AOS.init({ duration: 1200, once: false });
    };
    document.body.appendChild(script);
  }

  // Load Swiper library when services section is near viewport
  function loadSwiper() {
    if (window.Swiper) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.5/swiper-bundle.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.5/swiper-bundle.min.js";
    script.onload = initSwipers;
    document.body.appendChild(script);
  }

  // Initialize Swiper carousels
  function initSwipers() {
    if (!window.Swiper) return;

    // Carousel 1 - Right direction
    new Swiper(".swiper1", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      speed: 3000,
      autoplay: { delay: 0, disableOnInteraction: false },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 3, spaceBetween: 30 },
        1024: { slidesPerView: 4, spaceBetween: 30 },
      },
    });

    // Carousel 2 - Left direction
    new Swiper(".swiper2", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      speed: 3000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        reverseDirection: true,
      },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 3, spaceBetween: 30 },
        1024: { slidesPerView: 4, spaceBetween: 30 },
      },
    });
  }

  // Load Font Awesome
  function loadFontAwesome() {
    if (document.querySelector('link[href*="font-awesome"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
    document.head.appendChild(link);
  }

  // Load Material Icons
  function loadMaterialIcons() {
    if (document.querySelector('link[href*="Material+Icons"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    document.head.appendChild(link);
  }

  // Intersection Observer for lazy loading Swiper
  const swiperObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          loadSwiper();
          swiperObserver.disconnect();
        }
      });
    },
    { rootMargin: "200px" }
  );

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    // Load AOS immediately after DOM ready
    loadAOS();

    // Load Font Awesome
    loadFontAwesome();

    // Load Material Icons
    loadMaterialIcons();

    // Observe services section for Swiper
    const servicesSection = document.querySelector(".swiper-container");
    if (servicesSection) {
      swiperObserver.observe(servicesSection);
    }
  }
})();
