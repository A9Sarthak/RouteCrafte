export async function getDestinationImage(placeName) {
  if (!placeName) return '/images/default-trip.jpg';

  // Bust cache from previous version
  const cacheKey = `img_v2_${placeName.toLowerCase().trim()}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    // Wikipedia API for place thumbnail
    // Clean place name for better Wikipedia matches (e.g. "Agra, Uttar Pradesh" -> "Agra")
    const cleanPlaceName = placeName.split(',')[0].trim();
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(cleanPlaceName)}&prop=pageimages&format=json&pithumbsize=800&origin=*`;
    const response = await fetch(url, { method: 'GET', mode: 'cors' });
    if (!response.ok) throw new Error("Network response was not ok");
    
    const data = await response.json();
    const pages = data.query?.pages;
    if (pages) {
      const pageId = Object.keys(pages)[0];
      if (pageId && pageId !== "-1" && pages[pageId].thumbnail) {
        let sourceUrl = pages[pageId].thumbnail.source;
        
        // Reject flags, maps, logos, and SVG renders from Wikipedia
        const lowerUrl = sourceUrl.toLowerCase();
        if (lowerUrl.includes('.svg') || lowerUrl.includes('flag') || lowerUrl.includes('map') || lowerUrl.includes('logo') || lowerUrl.includes('seal')) {
           console.warn("Rejected non-scenic image (logo/flag/map):", sourceUrl);
           throw new Error("Rejected non-scenic image");
        }
        
        sessionStorage.setItem(cacheKey, sourceUrl);
        return sourceUrl;
      }
    }
  } catch (error) {
    console.warn(`Failed to fetch online image for ${placeName}, falling back to offline mapping.`, error);
  }

  // Fallback to local relevant images if Wikipedia fails (or offline)
  const fallback = getFallbackImage(placeName);
  sessionStorage.setItem(cacheKey, fallback);
  return fallback;
}

function getFallbackImage(placeName) {
  const lower = placeName.toLowerCase();
  
  // Beach/Coastal keywords
  if (lower.match(/beach|goa|miami|hawaii|coast|ocean|island|maldives|bora|bali|phuket|sand|shore|sea/)) {
    return '/images/fallback_beach.png';
  }
  
  // Nature/Mountain keywords
  if (lower.match(/valley|mountain|himalaya|alps|swiss|nature|forest|park|lake|camp|trail|summit|peak|hill/)) {
    return '/images/fallback_nature.png';
  }

  // City/Urban keywords
  if (lower.match(/city|york|london|paris|tokyo|dubai|mumbai|delhi|berlin|sydney|seoul|urban|metro|town|square|capital/)) {
    return '/images/fallback_city.png';
  }

  // The generic fallback is randomly one of the three aesthetic images instead of the map
  const defaultImages = [
    '/images/fallback_city.png',
    '/images/fallback_nature.png',
    '/images/fallback_beach.png'
  ];
  const charCode = lower.charCodeAt(0) || 0; // consistent random tied to name
  return defaultImages[charCode % defaultImages.length];
}
