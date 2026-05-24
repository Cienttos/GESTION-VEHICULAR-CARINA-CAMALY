(function () {
  const REVIEWS_API = '/api/reviews';
  const INITIAL_COUNT = 6;

  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    let stars = '';
    for (let i = 0; i < full; i++) stars += '<i class="fas fa-star"></i>';
    if (half) stars += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < empty; i++) stars += '<i class="far fa-star"></i>';
    return stars;
  }

  function createReviewCard(review, index) {
    const avatar = review.avatar || { initials: review.author_name.substring(0, 2).toUpperCase(), bgColor: '#2e6a79' };
    const card = document.createElement('div');
    card.className = 'bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 review-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String((index % 3) * 100));
    if (index >= INITIAL_COUNT) {
      card.classList.add('hidden-review');
    }
    card.innerHTML = `
      <div class="flex items-center mb-4">
        <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style="background-color: ${avatar.bgColor}">
          ${avatar.initials}
        </div>
        <div class="ml-4 text-left min-w-0">
          <p class="font-semibold text-gray-800 truncate">${review.author_name}</p>
          <div class="text-yellow-400 text-sm">${renderStars(review.rating || 5)}</div>
          ${review.relative_time_description ? `<span class="text-xs text-gray-400">${review.relative_time_description}</span>` : ''}
        </div>
      </div>
      <p class="text-gray-600 text-left text-sm leading-relaxed">${review.text}</p>
    `;
    return card;
  }

  function renderReviews(data) {
    const container = document.getElementById('reviews-container');
    const infoBar = document.getElementById('reviews-info');
    if (!container) return;

    container.innerHTML = '';

    const sorted = [...data.reviews].sort((a, b) => b.text.length - a.text.length);

    sorted.forEach((review, index) => {
      container.appendChild(createReviewCard(review, index));
    });

    if (infoBar) {
      const mapsLink = data.google_maps_url || 'https://www.google.com/maps/place/?q=place_id:ChIJK9xR3M7ivJUR1HCGFjOJt8k';
      infoBar.innerHTML = `
        <div class="flex flex-col items-center gap-4">
          <p class="text-gray-600 inline-block bg-white px-6 py-3 rounded-full shadow-md">
            <i class="fab fa-google text-[#4faed4] mr-2"></i>
            Calificación promedio:
            <span class="text-yellow-400 font-bold">${renderStars(data.rating || 5)}</span>
            <span class="font-semibold text-[#2e6a79]">${(data.rating || 5).toFixed(1)}</span>
            <span class="text-gray-400 text-sm">(${data.total_ratings || 0} reseñas)</span>
          </p>
          <a href="${mapsLink}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm text-[#4faed4] hover:text-[#2e6a79] transition-colors">
            <i class="fas fa-external-link-alt"></i>
            Ver todas las reseñas en Google Maps
          </a>
        </div>
      `;
    }

    const seeMoreBtn = document.getElementById('see-more-btn');
    const hiddenCount = sorted.length - INITIAL_COUNT;

    if (seeMoreBtn) {
      if (hiddenCount > 0) {
        seeMoreBtn.classList.remove('hidden');
        seeMoreBtn.querySelector('.btn-text').textContent = `Ver más (${hiddenCount})`;
        seeMoreBtn.onclick = function () {
          const hiddenCards = container.querySelectorAll('.hidden-review');
          hiddenCards.forEach(card => card.classList.remove('hidden-review'));
          seeMoreBtn.classList.add('hidden');
        };
      } else {
        seeMoreBtn.classList.add('hidden');
      }
    }
  }

  function showError() {
    const container = document.getElementById('reviews-container');
    if (container) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-gray-500 text-lg">No se pudieron cargar las reseñas en este momento.</p>
          <p class="text-gray-400 text-sm mt-2">Intentá de nuevo más tarde.</p>
        </div>
      `;
    }
  }

  async function loadReviews() {
    try {
      const response = await fetch(REVIEWS_API);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      if (data.reviews && data.reviews.length > 0) {
        renderReviews(data);
      } else {
        showError();
      }
    } catch {
      showError();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadReviews);
  } else {
    loadReviews();
  }
})();
