import { CityLocation } from '../types';
import { CITIES } from './panchanga';
import { COUNTRIES_AND_CITIES, findClosestCity } from './worldPlaces';

export interface GeocodedPlace {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
  formattedAddress: string;
}

// Extract lat/lng from common string formats (e.g., "12.9716, 77.5946" or "12.9716 N, 77.5946 E" or Google Maps URLs)
export function parseCoordinatesInput(input: string): { lat: number; lng: number } | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Check for Google Maps URL pattern containing @lat,lng
  const urlMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (urlMatch) {
    const lat = parseFloat(urlMatch[1]);
    const lng = parseFloat(urlMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  // Check for "lat, lng" or "lat lng"
  const commaMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)$/);
  if (commaMatch) {
    const lat = parseFloat(commaMatch[1]);
    const lng = parseFloat(commaMatch[2]);
    if (!isNaN(lat) && !isNaN(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return { lat, lng };
    }
  }

  return null;
}

// Calculate timezone estimate based on longitude (15 degrees per hour)
export function estimateTimezoneOffset(lng: number, countryCode?: string): string {
  if (countryCode === 'IN' || (lng >= 68 && lng <= 97)) {
    return 'Asia/Kolkata';
  }
  const hours = lng / 15;
  const sign = hours >= 0 ? '+' : '-';
  const absHours = Math.floor(Math.abs(hours));
  const absMinutes = Math.round((Math.abs(hours) - absHours) * 60);
  return `UTC${sign}${String(absHours).padStart(2, '0')}:${String(absMinutes).padStart(2, '0')}`;
}

export async function searchWorldwidePlaces(query: string): Promise<GeocodedPlace[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  // Check if query is directly coordinates
  const coords = parseCoordinatesInput(q);
  if (coords) {
    const closest = findClosestCity(coords.lat, coords.lng);
    return [{
      name: `Custom Location (${coords.lat.toFixed(4)}°, ${coords.lng.toFixed(4)}°)`,
      state: closest.state,
      country: closest.country,
      lat: coords.lat,
      lng: coords.lng,
      timezone: closest.timezone || 'Asia/Kolkata',
      formattedAddress: `Coordinates: ${coords.lat.toFixed(4)}°N, ${coords.lng.toFixed(4)}°E (Near ${closest.name})`
    }];
  }

  const results: GeocodedPlace[] = [];
  const lowerQ = q.toLowerCase();

  // 1. Search in-memory curated global database
  for (const country of COUNTRIES_AND_CITIES) {
    for (const city of country.cities) {
      const matchName = city.name.toLowerCase().includes(lowerQ);
      const matchLocal = city.nameLocalized && Object.values(city.nameLocalized).some(v => v.toLowerCase().includes(lowerQ));
      const matchState = city.state && city.state.toLowerCase().includes(lowerQ);

      if (matchName || matchLocal || matchState) {
        results.push({
          name: city.name,
          state: city.state,
          country: country.name.en,
          lat: city.lat,
          lng: city.lng,
          timezone: city.timezone || 'Asia/Kolkata',
          formattedAddress: `${city.name}, ${city.state ? city.state + ', ' : ''}${country.name.en}`
        });
      }
      if (results.length >= 8) break;
    }
    if (results.length >= 8) break;
  }

  // 2. Query Google Geocoding API if API key is present
  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCZyYeIUnxBDoClVb-eAtO0l3jDO-_hPuk';
  if (googleMapsKey) {
    try {
      const gUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&key=${googleMapsKey}`;
      const res = await fetch(gUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'OK' && Array.isArray(data.results)) {
          for (const item of data.results) {
            const loc = item.geometry?.location;
            if (loc && typeof loc.lat === 'number' && typeof loc.lng === 'number') {
              // Extract country and locality
              let cityName = '';
              let stateName = '';
              let countryName = '';

              for (const comp of item.address_components || []) {
                if (comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')) {
                  if (!cityName) cityName = comp.long_name;
                }
                if (comp.types.includes('administrative_area_level_1')) {
                  stateName = comp.long_name;
                }
                if (comp.types.includes('country')) {
                  countryName = comp.long_name;
                }
              }

              const resolvedName = cityName || item.formatted_address.split(',')[0] || q;

              // Avoid duplicate coordinates
              const exists = results.some(r => Math.abs(r.lat - loc.lat) < 0.01 && Math.abs(r.lng - loc.lng) < 0.01);
              if (!exists) {
                results.push({
                  name: resolvedName,
                  state: stateName,
                  country: countryName || 'World',
                  lat: loc.lat,
                  lng: loc.lng,
                  timezone: estimateTimezoneOffset(loc.lng),
                  formattedAddress: item.formatted_address
                });
              }
            }
          }
        }
      }
    } catch {
      // Fallback silently if network fails
    }
  }

  // 3. Fallback to OpenStreetMap Nominatim for small villages / towns worldwide
  if (results.length < 5) {
    try {
      const osmUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`;
      const res = await fetch(osmUrl, {
        headers: { 'Accept-Language': 'en,kn,hi' }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          for (const item of data) {
            const lat = parseFloat(item.lat);
            const lng = parseFloat(item.lon);
            if (!isNaN(lat) && !isNaN(lng)) {
              const addr = item.address || {};
              const placeName = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || item.display_name.split(',')[0];
              const state = addr.state || addr.province || '';
              const country = addr.country || '';

              const exists = results.some(r => Math.abs(r.lat - lat) < 0.01 && Math.abs(r.lng - lng) < 0.01);
              if (!exists) {
                results.push({
                  name: placeName,
                  state,
                  country,
                  lat,
                  lng,
                  timezone: estimateTimezoneOffset(lng, addr.country_code?.toUpperCase()),
                  formattedAddress: item.display_name
                });
              }
            }
          }
        }
      }
    } catch {
      // Fallback silently
    }
  }

  return results.slice(0, 10);
}
