/**
 * Image Service for FlingPing.co blog
 * Uses curated Unsplash image IDs to display relevant images
 */

// Map of predefined Unsplash image IDs organized by category
// These are selected high-quality images that match our topics
const UNSPLASH_IMAGE_MAP: Record<string, string[]> = {
  'Health Tips': [
    'L8tWZT4CcVQ', // Doctor with patient
    'hIgeoQjS_iE', // Medical healthcare concept
    'NTyBbu66_SI', // Wellness center
    '7jjnJ-QA9fY', // Health checkup
    'oZ61KFUQsus', // Medical professional
  ],
  'Privacy': [
    'C2P00tDJgYA', // Lock and security
    '_9a-3NO5KJE', // Privacy shield
    'uBe2mknURG4', // Secure data concept
    'H7SCRwU1aiM', // Digital privacy
    '60GsdOMRFGc', // Data protection
  ],
  'Technology': [
    'XJXWbfSo2f0', // Tech innovation
    '8qEB0fTwXnU', // Smart devices
    'JpZ_0dIzP7w', // Digital health tech
    '77JACslA8G0', // Tech innovation
    'IgUR1iX0mqM', // Futuristic technology
  ],
  'Relationships': [
    'cYrMQA7a3Wc', // Couple talking
    '1K8pIbIrhkQ', // Coffee date
    '8VI6WwEEEHY', // People connecting
    'YwdqvZU-L_I', // Friends conversation
    'V5vqWC9gyEU', // Meaningful connection
  ],
  'Product Reviews': [
    'LqKhnDzSF-8', // Product review
    'ZihPQeQBNSk', // Testing products
    'gcsNOsPEXfs', // Product comparison
    '0-frPETzEb8', // Product showcase
    'FRDDb5sgzVI', // Review concept
  ],
  'Community': [
    'yCdPU73kGSc', // Community group
    'HOrhCnQsxnQ', // Diverse community
    '9Q_pLLP86Yg', // Community support
    'UJm-Fkt2yvk', // Team collaboration
    'gMsnXqILjp4', // Community gathering
  ],
  // Fallback category
  'Default': [
    'L8tWZT4CcVQ', // Healthcare
    'RLw-UC03Gwc', // Professional meeting
    '6anudmpILw4', // Technology
    'ZihPQeQBNSk', // Products
    'yCdPU73kGSc', // Community
  ]
};

/**
 * Get an Unsplash image URL using a fixed photo ID
 * 
 * @param photoId - Unsplash photo ID
 * @param width - Desired image width (optional)
 * @param height - Desired image height (optional)
 * @returns URL to the Unsplash image
 */
export function getUnsplashImageById(photoId: string, width?: number, height?: number): string {
  let url = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80`;
  
  if (width && height) {
    url += `&w=${width}&h=${height}`;
  }
  
  return url;
}

/**
 * Get a themed image URL relevant to FlingPing topics
 * 
 * @param category - Blog post category (used to determine relevant image)
 * @param customTerms - Optional additional keywords (used to deterministically select an image)
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
  // Get the appropriate image list based on category
  const imageList = UNSPLASH_IMAGE_MAP[category] || UNSPLASH_IMAGE_MAP['Default'];
  
  // Use customTerms to deterministically select an image if provided
  // Otherwise, use a random selection
  let index = 0;
  
  if (customTerms) {
    // Create a simple hash from customTerms to consistently select the same image
    // This is useful for ensuring blog posts always get the same image
    const hash = customTerms.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    index = hash % imageList.length;
  } else {
    // Random selection if no customTerms provided
    index = Math.floor(Math.random() * imageList.length);
  }
  
  // Get the selected image ID
  const photoId = imageList[index];
  
  // Return the full Unsplash URL
  return getUnsplashImageById(photoId, width, height);
}