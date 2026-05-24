const PLACE_NAME = 'CC - Gestoria del automotor Mar del Plata';
const PLACE_ID = process.env.GOOGLE_PLACE_ID || 'ChIJK9xR3M7ivJUR1HCGFjOJt8k';
const GOOGLE_MAPS_URL = `https://www.google.com/maps/place/?q=place_id:${PLACE_ID}`;

const MOCK_REVIEWS = [
  { author_name: "Yamina Rubilar", rating: 5, text: "Excelente atención! Carina me ayudó con la transferencia de mi auto y fue todo muy rápido y sin complicaciones. Es muy profesional y dedicada, me asesoró en todo el proceso de compra de mi 0km. La gestoría más confiable de Mar del Plata. Sin dudas la recomiendo totalmente, hace años que confío en ella para todos mis trámites. Es eficiente, honesta y siempre va un paso más allá. La recomiendo una y otra vez!", relative_time_description: "Hace 4 meses" },
  { author_name: "Yok Koto", rating: 5, text: "Excelente servicio, muy profesional y eficiente. Carina me ayudó con todos los trámites de mi vehículo de forma rápida y sencilla. Muy recomendada para cualquier gestión vehicular en Mar del Plata. Desde la transferencia hasta los informes de dominio, todo perfecto.", relative_time_description: "Hace 4 meses" },
  { author_name: "Lucía Ramírez", rating: 5, text: "La mejor gestoría de Mar del Plata. Carina es muy amable, paciente y explica todo claramente. Me resolvió unos temas complicados con la cancelación de prenda que en otro lado no podían resolver. Súper agradecida por su profesionalismo y dedicación. Sin dudas la recomiendo a todos mis conocidos.", relative_time_description: "Hace 2 semanas" },
  { author_name: "Diego Rodríguez", rating: 5, text: "Hice el cambio de radicación de mi vehículo y lo resolvió en tiempo récord. Siempre atenta y respondiendo todas mis dudas. ¡Super recomendada!", relative_time_description: "Hace 1 mes" },
  { author_name: "Ana González", rating: 5, text: "Hace años que confío en Carina para todos mis trámites vehiculares. Es eficiente, honesta y siempre va un paso más allá. La recomiendo una y otra vez! Siempre resuelve todo rápido y sin complicaciones.", relative_time_description: "Hace 5 meses" },
  { author_name: "Mariano Gutiérrez", rating: 5, text: "Excelente atención! Carina me ayudó con la transferencia de mi auto y fue todo muy rápido y sin complicaciones. La recomiendo totalmente.", relative_time_description: "Hace 2 meses" },
  { author_name: "Laura Pérez", rating: 5, text: "Muy profesional y dedicada. Me asesoró en todo el proceso de compra de mi 0km. La gestoría más confiable de Mar del Plata.", relative_time_description: "Hace 3 meses" },
  { author_name: "Sofía Martínez", rating: 5, text: "Trámite de informe de dominio en 24hs. Carina es muy amable y resuelve todo con rapidez. Sin dudas la mejor opción en MDP.", relative_time_description: "Hace 2 semanas" },
  { author_name: "Carlos Fernández", rating: 5, text: "Me ayudó con la denuncia de venta y la cancelación de prenda. Todo online, sin moverme de casa. Muy conforme con el servicio.", relative_time_description: "Hace 1 semana" },
  { author_name: "Pedro Martínez", rating: 5, text: "Muy buena atención, me resolvió todo rápido y sin vueltas. La recomiendo para cualquier trámite vehicular en Mar del Plata.", relative_time_description: "Hace 3 semanas" },
  { author_name: "María López", rating: 5, text: "Excelente gestora, muy atenta y profesional. Me ayudó con la transferencia de mi auto usado y todo salió perfecto. Sin dudas la mejor.", relative_time_description: "Hace 2 meses" },
  { author_name: "Juan Pérez", rating: 5, text: "Carina es una excelente profesional. Me ayudó con el cambio de radicación y la transferencia. Todo rápido y sin problemas. Muy recomendable.", relative_time_description: "Hace 1 mes" },
];

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

  const mockWithAvatars = MOCK_REVIEWS.map(r => ({
    ...r,
    profile_photo_url: '',
    avatar: generateAvatar(r.author_name),
  }));
  mockWithAvatars.sort((a, b) => b.text.length - a.text.length);

  return res.json({
    place_name: PLACE_NAME,
    rating: 5.0,
    total_ratings: 37,
    reviews: mockWithAvatars,
    source: 'demo',
    google_maps_url: GOOGLE_MAPS_URL,
  });
};
