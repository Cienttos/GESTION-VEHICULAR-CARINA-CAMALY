const fs = require('fs');
const path = require('path');

const PLACE_NAME = 'CC - Gestoria del automotor Mar del Plata';
const PLACE_ID = process.env.GOOGLE_PLACE_ID || 'ChIJK9xR3M7ivJUR1HCGFjOJt8k';
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place//data=!4m4!3m3!1s0x680c3996c072cf2d:0x3b26dfa6fa60710d!9m1!1b1';

function generateAvatar(name) {
  const parts = name.trim().split(/\s+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].substring(0, 2).toUpperCase();
  const colors = ['#2e6a79', '#4faed4', '#1a4a56', '#3d8a9e', '#67c4e0', '#0f3b45', '#5fb8d4', '#2a5f6e'];
  return { initials, bgColor: colors[name.charCodeAt(0) % colors.length] };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  if (GOOGLE_API_KEY && GOOGLE_API_KEY !== 'TU_API_KEY_AQUI') {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,reviews,user_ratings_total&language=es&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.status === 'OK' && data.result && data.result.reviews) {
        const reviews = data.result.reviews.map(r => ({
          ...r,
          profile_photo_url: r.profile_photo_url || '',
          avatar: generateAvatar(r.author_name),
        }));
        reviews.sort((a, b) => b.text.length - a.text.length);
        return res.json({
          place_name: data.result.name,
          rating: data.result.rating,
          total_ratings: data.result.user_ratings_total,
          reviews,
          source: 'google',
          google_maps_url: GOOGLE_MAPS_URL,
        });
      }
    } catch (_) {}
  }

  const scrapedPath = path.join(process.cwd(), 'api', 'scraped-reviews.json');
  if (fs.existsSync(scrapedPath)) {
    const scraped = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));
    const filtered = scraped.reviews.filter(r => r.text && r.text.trim());
    const withAvatars = filtered.map(r => ({
      ...r,
      profile_photo_url: r.profile_photo_url || '',
      avatar: generateAvatar(r.author_name),
    }));
    withAvatars.sort((a, b) => b.text.length - a.text.length);
    return res.json({
      place_name: scraped.place_name || PLACE_NAME,
      rating: scraped.rating || 5.0,
      total_ratings: scraped.total_ratings || withAvatars.length,
      reviews: withAvatars,
      source: 'scraped',
      google_maps_url: GOOGLE_MAPS_URL,
    });
  }

  return res.json({
    place_name: PLACE_NAME,
    rating: 5.0,
    total_ratings: 37,
    reviews: [],
    source: 'empty',
    google_maps_url: GOOGLE_MAPS_URL,
  });
};
