const axios = require('axios');
const { RateLimiter } = require('limiter');
const cache = require('memory-cache');

const GEOCODING_CACHE_MS = 1 * 60 * 60 * 1000; // 1 heure au lieu de 24h
const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 1000 });

const CITY_FALLBACKS = {
  'tunis': [10.1815, 36.8065],
  'sfax': [10.7663, 34.7476],
  'sousse': [10.6369, 35.8254],
  'monastir': [10.8262, 35.7780],
  'mahdia': [11.0622, 35.5047],
  'kairouan': [10.1005, 35.6712],    
    'bizerte': [9.8734, 37.2745],      
    'gabes': [10.0975, 33.8881],       
    'gafsa': [8.7848, 34.4311],       
    'tozeur': [8.1346, 33.9197],     
    'beja': [9.1817, 36.7256],        
    'jendouba': [8.7757, 36.5012],     
    'kasserine': [8.7930, 35.1676],   
    'sidi bouzid': [9.4839, 35.0383], 
    'nabeul': [10.7377, 36.4561],     
    'zaghouan': [10.1429, 36.4029],    
    'kebili': [8.9715, 33.7079],      
    'tataouine': [10.4516, 32.9297],   
    'medenine': [10.4956, 33.3549],    
    'manouba': [10.0972, 36.8080],    
    'ariana': [10.1647, 36.8663],      
    'ben arous': [10.2158, 36.7531],  
    'kelibia': [11.0933, 36.8475],     
    'el kef': [8.7148, 36.1676],       
  'default': [9.0, 34.0] // Centre de la Tunisie
};

const normalizeCityName = (city) => {
  return city.toLowerCase().trim();
};

const geocodeWithFallback = async (address) => {
  const cacheKey = `geo:${address}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    await limiter.removeTokens(1);

    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1,
        countrycodes: 'tn',
        'accept-language': 'fr',
        addressdetails: 1 
      },
      headers: {
        'User-Agent': 'YourAppName/1.0 (contact@yourdomain.com)'
      }
    });

    if (response.data?.length) {
      const result = {
        success: true,
        coordinates: [
          parseFloat(response.data[0].lon),
          parseFloat(response.data[0].lat)
        ],
        formattedAddress: response.data[0].display_name
      };
      cache.put(cacheKey, result, GEOCODING_CACHE_MS);
      return result;
    }
  } catch (error) {
    console.warn('Geocoding error:', error.message);
  }

  // Fallback: Trouver la ville dans l'adresse
  const cityMatch = address.match(/([^,]+),?\s*Tunisie?$/i);
  const city = cityMatch ? normalizeCityName(cityMatch[1]) : 'default';

  const result = {
    success: false,
    coordinates: CITY_FALLBACKS[city] || CITY_FALLBACKS.default,
    formattedAddress: city !== 'default' 
      ? `Centre de ${city.charAt(0).toUpperCase() + city.slice(1)}`
      : 'Localisation inconnue (Tunisie)'
  };

  cache.put(cacheKey, result, GEOCODING_CACHE_MS);
  return result;
};

module.exports = { geocodeWithFallback };