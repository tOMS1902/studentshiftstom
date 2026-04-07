/**
 * Geocoding via OpenStreetMap Nominatim (free, no API key).
 * Returns { lat, lng, displayName } or null on failure.
 *
 * Automatically constrained to Ireland (countrycodes=ie).
 * Eircode-shaped queries (e.g. "H91 A2PA") use the postalcode
 * parameter for a more precise lookup.
 */
const EIRCODE_RE = /^[A-Za-z]\d{2}\s?[A-Za-z\d]{4}$/;
const HEADERS = { "Accept-Language": "en", "User-Agent": "StudentShifts-Demo/1.0" };

// Ireland bounding box for Photon (left, bottom, right, top)
const IE_BBOX = "-10.56,51.39,-5.43,55.43";

async function nominatimFetch(params) {
  const qs = new URLSearchParams({ format: "json", limit: "1", countrycodes: "ie", ...params });
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${qs}`, { headers: HEADERS });
  const data = await res.json();
  if (!data.length) return null;
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}

// Photon (komoot) — better Irish townland/village coverage, free, no API key
async function photonFetch(query) {
  const qs = new URLSearchParams({ q: query, limit: "1", lang: "en", bbox: IE_BBOX });
  const res = await fetch(`https://photon.komoot.io/api/?${qs}`, { headers: HEADERS });
  const data = await res.json();
  if (!data.features?.length) return null;
  const feat = data.features[0];
  const p = feat.properties;
  const parts = [p.name, p.street, p.city || p.town || p.village, p.state, "Ireland"].filter(Boolean);
  return {
    lat: feat.geometry.coordinates[1],
    lng: feat.geometry.coordinates[0],
    displayName: parts.join(", "),
  };
}

export async function geocodeAddress(rawQuery) {
  try {
    // Strip trailing ", Ireland" — we constrain via countrycodes/bbox instead
    const query = rawQuery.replace(/,?\s*ireland\s*$/i, "").trim();

    if (EIRCODE_RE.test(query)) {
      // Try Nominatim postalcode first for Eircodes
      const code = query.replace(/\s/g, "");
      const result = await nominatimFetch({ postalcode: code });
      if (result) return result;
    }

    // Try Nominatim free-text
    const nominatim = await nominatimFetch({ q: query });
    if (nominatim) return nominatim;

    // Fall back to Photon — better for Irish villages and townlands
    return await photonFetch(query);
  } catch {
    return null;
  }
}

/**
 * Get the device's current GPS position via browser API.
 * Returns { lat, lng } or null if denied/unavailable.
 */
export function getCurrentPosition() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()    => resolve(null),
      { timeout: 8000 }
    );
  });
}

/**
 * Haversine distance between two lat/lng points, returned in km.
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Human-readable distance string.
 */
export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)}m away`;
  return `${km.toFixed(1)}km away`;
}

/**
 * Approximate coordinates for the mock job location strings (Galway, Ireland).
 * Used to show distances on mock jobs without geocoding each one.
 */
export const mockLocationCoords = {
  "City Centre": { lat: 53.2707, lng: -9.0568 },
  "Near Campus":  { lat: 53.2835, lng: -9.0615 },
  "5 min walk":   { lat: 53.2800, lng: -9.0580 },
  "10 min walk":  { lat: 53.2750, lng: -9.0540 },
  "Downtown":     { lat: 53.2720, lng: -9.0540 },
  "On-Campus":    { lat: 53.2835, lng: -9.0615 },
};
