/**
 * Image Service for FlingPing.co blog
 * Provides reliable image URLs for blog posts
 */

// Map of direct image URLs organized by category
const IMAGE_MAP: Record<string, string[]> = {
  'Health Tips': [
    'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg', // Healthcare professional
    'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg', // Health consultation
    'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg', // Medical check
  ],
  'Privacy': [
    'https://images.pexels.com/photos/954626/pexels-photo-954626.jpeg', // Security
    'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg', // Digital security
    'https://images.pexels.com/photos/2882566/pexels-photo-2882566.jpeg', // Data protection
  ],
  'Technology': [
    'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg', // Technology
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg', // Digital devices
    'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg', // Tech innovation
  ],
  'Relationships': [
    'https://images.pexels.com/photos/6462776/pexels-photo-6462776.jpeg', // Couple talking
    'https://images.pexels.com/photos/5698901/pexels-photo-5698901.jpeg', // Relationship
    'https://images.pexels.com/photos/4559592/pexels-photo-4559592.jpeg', // Communication
  ],
  'Product Reviews': [
    'https://images.pexels.com/photos/4464821/pexels-photo-4464821.jpeg', // Product review
    'https://images.pexels.com/photos/7319161/pexels-photo-7319161.jpeg', // Health products
    'https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg', // Medical products
  ],
  'Community': [
    'https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg', // Team working together
    'https://images.pexels.com/photos/3810756/pexels-photo-3810756.jpeg', // Community support
    'https://images.pexels.com/photos/7148384/pexels-photo-7148384.jpeg', // Group discussion
  ],
  // Fallback category
  'Default': [
    'https://images.pexels.com/photos/6382300/pexels-photo-6382300.jpeg', // Healthcare
    'https://images.pexels.com/photos/8365688/pexels-photo-8365688.jpeg', // Medical
    'https://images.pexels.com/photos/935835/pexels-photo-935835.jpeg', // Digital health
  ]
};

/**
 * Get a themed image URL relevant to FlingPing topics
 * 
 * @param category - Blog post category (used to determine relevant image)
 * @param customTerms - Optional additional keywords (used to deterministically select an image)
 * @returns URL to a relevant image
 */
export function getThemedBlogImage(
  category: string, 
  customTerms?: string
): string {
  // Get the appropriate image list based on category
  const imageList = IMAGE_MAP[category] || IMAGE_MAP['Default'];
  
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
  
  // Return the selected image URL
  return imageList[index];
}