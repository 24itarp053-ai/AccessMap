import apiClient from './api';
import { AHMEDABAD_PLACES } from './sampleData';

/**
 * Validates whether latitude and longitude are valid numeric geographic coordinates.
 */
function isValidCoordinate(lat, lng) {
  const numLat = parseFloat(lat);
  const numLng = parseFloat(lng);
  if (isNaN(numLat) || isNaN(numLng)) return false;
  if (numLat < -90 || numLat > 90) return false;
  if (numLng < -180 || numLng > 180) return false;
  return true;
}

/**
 * Normalizes a raw place object from backend OR mock data into a unified frontend place structure.
 * Does not invent fake coordinates, accessibility scores, or status when missing.
 */
export function normalizePlace(rawPlace) {
  if (!rawPlace || typeof rawPlace !== 'object') return null;

  const id = rawPlace._id || rawPlace.id || `place-${Math.random().toString(36).slice(2, 7)}`;
  const name = rawPlace.name || 'Unnamed Location';
  const category = rawPlace.category || 'Public Venue';
  const address = rawPlace.address || (rawPlace.area ? `${rawPlace.area}, Ahmedabad` : 'Ahmedabad, Gujarat');
  const description = rawPlace.description || 'No description provided.';

  // Coordinates extraction & strict validation (null if invalid or missing)
  let lat = null;
  let lng = null;

  if (rawPlace.location && typeof rawPlace.location === 'object') {
    const rawLat = parseFloat(rawPlace.location.latitude ?? rawPlace.location.lat);
    const rawLng = parseFloat(rawPlace.location.longitude ?? rawPlace.location.lng);
    if (isValidCoordinate(rawLat, rawLng)) {
      lat = rawLat;
      lng = rawLng;
    }
  } else if (rawPlace.lat !== undefined && rawPlace.lng !== undefined) {
    const rawLat = parseFloat(rawPlace.lat);
    const rawLng = parseFloat(rawPlace.lng);
    if (isValidCoordinate(rawLat, rawLng)) {
      lat = rawLat;
      lng = rawLng;
    }
  }

  // Features mapping - preserve actual data or empty array if absent
  let features = [];
  if (Array.isArray(rawPlace.accessibilityFeatures)) {
    features = rawPlace.accessibilityFeatures.map((feat) => {
      if (typeof feat === 'string') {
        return { key: feat.toLowerCase(), label: feat, available: true };
      }
      return feat;
    });
  } else if (Array.isArray(rawPlace.features)) {
    features = rawPlace.features;
  }

  // Accessibility score - preserve actual numeric value or null
  const accessibilityScore = typeof rawPlace.accessibilityScore === 'number'
    ? rawPlace.accessibilityScore
    : null;

  // Accessibility status - preserve actual string or 'Unrated'
  const accessibilityStatus = rawPlace.accessibilityStatus ||
    (accessibilityScore !== null
      ? (accessibilityScore >= 80 ? 'Fully Accessible' : accessibilityScore >= 50 ? 'Partially Accessible' : 'Inaccessible / High Barriers')
      : 'Unrated / Pending Review');

  const image = rawPlace.image || 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1000&q=80';
  const dataStatus = rawPlace.dataStatus || (rawPlace._id ? 'Verified Backend Record' : 'Sample Mock Data');
  const isMock = !rawPlace._id;

  return {
    id,
    _id: rawPlace._id || id,
    name,
    category,
    address,
    area: rawPlace.area || '',
    description,
    lat,
    lng,
    features,
    accessibilityNotes: rawPlace.accessibilityNotes || '',
    accessibilityScore,
    accessibilityStatus,
    image,
    dataStatus,
    isMock,
  };
}

/**
 * Fetch all places from backend GET /places with automatic fallback to mock data
 */
export async function getPlaces() {
  try {
    const response = await apiClient.get('/places');
    const resData = response.data;

    // Extract array from response payload
    let rawList = [];
    if (Array.isArray(resData)) {
      rawList = resData;
    } else if (resData && Array.isArray(resData.places)) {
      rawList = resData.places;
    } else if (resData && resData.data && Array.isArray(resData.data.places)) {
      rawList = resData.data.places;
    } else if (resData && Array.isArray(resData.data)) {
      rawList = resData.data;
    }

    if (rawList && rawList.length > 0) {
      const normalized = rawList.map(normalizePlace).filter(Boolean);
      return { places: normalized, isFallback: false, source: 'backend' };
    }

    // Fallback to mock data if backend array is empty
    const fallbackList = AHMEDABAD_PLACES.map(normalizePlace);
    return { places: fallbackList, isFallback: true, source: 'mock' };
  } catch (error) {
    console.warn('[placeService.getPlaces] API call failed or server offline. Falling back to mock data:', error.message);
    const fallbackList = AHMEDABAD_PLACES.map(normalizePlace);
    return { places: fallbackList, isFallback: true, source: 'mock', error: error.message };
  }
}

/**
 * Fetch single place by ID from backend GET /places/:id with automatic fallback to mock data
 */
export async function getPlaceById(id) {
  try {
    const response = await apiClient.get(`/places/${id}`);
    const resData = response.data;

    let rawPlace = null;
    if (resData && resData.place) {
      rawPlace = resData.place;
    } else if (resData && resData.data && resData.data.place) {
      rawPlace = resData.data.place;
    } else if (resData && resData.data) {
      rawPlace = resData.data;
    } else if (resData && typeof resData === 'object' && resData.name) {
      rawPlace = resData;
    }

    if (rawPlace) {
      return { place: normalizePlace(rawPlace), isFallback: false, source: 'backend' };
    }
  } catch (error) {
    console.warn(`[placeService.getPlaceById] API call failed for ID ${id}. Checking mock data:`, error.message);
  }

  // Fallback search in mock data
  const mockPlace = AHMEDABAD_PLACES.find((p) => p.id === id || p._id === id) || AHMEDABAD_PLACES[0];
  return { place: normalizePlace(mockPlace), isFallback: true, source: 'mock' };
}
