/**
 * Image Service for FlingPing.co blog
 * Uses Unsplash API to fetch relevant images based on keywords
 */

// Base URL for the Unsplash API
const UNSPLASH_URL = 'https://source.unsplash.com';

/**
 * Get an image URL from Unsplash based on search terms
 * 
 * @param searchTerms - Keywords to search for, separated by commas or spaces
 * @param width - Desired image width (default: 800)
 * @param height - Desired image height (default: 600)
 * @returns URL to an Unsplash image matching the search terms
 */
export function getUnsplashImage(searchTerms: string, width = 800, height = 600): string {
  // Format search terms for the URL (replace spaces with commas)
  const formattedTerms = searchTerms.replace(/\s+/g, ',');
  
  // Generate a cache-busting random parameter
  // This ensures we get different images when using the same search terms
  const random = Math.floor(Math.random() * 1000);
  
  // Construct the URL
  // Format: https://source.unsplash.com/WxWxH/?search-terms&random-param
  return `${UNSPLASH_URL}/${width}x${height}/?${formattedTerms}&random=${random}`;
}

/**
 * Get a themed image URL relevant to FlingPing topics
 * 
 * @param category - Blog post category (used to determine relevant keywords)
 * @param customTerms - Optional additional keywords to include
 * @param width - Desired image width (default: 800)
 * @param height - Desired image height (default: 600)
 * @returns URL to a relevant Unsplash image
 */
export function getThemedBlogImage(
  category: string, 
  customTerms?: string, 
  width = 800, 
  height = 600
): string {
  let searchTerms = '';
  
  // Base terms for all images
  const baseTerms = 'professional,clean';
  
  // Category-specific terms
  switch (category) {
    case 'Health Tips':
      searchTerms = 'health,wellness,medical,healthcare';
      break;
    case 'Privacy':
      searchTerms = 'privacy,secure,protection,lock';
      break;
    case 'Technology':
      searchTerms = 'technology,digital,innovation,app';
      break;
    case 'Relationships':
      searchTerms = 'connection,people,conversation,communication';
      break;
    case 'Product Reviews':
      searchTerms = 'product,review,testing,comparison';
      break;
    case 'Community':
      searchTerms = 'community,group,together,diversity';
      break;
    default:
      searchTerms = 'health,communication,technology';
  }
  
  // Combine base terms with category terms and custom terms if provided
  const combinedTerms = `${baseTerms},${searchTerms}${customTerms ? `,${customTerms}` : ''}`;
  
  return getUnsplashImage(combinedTerms, width, height);
}