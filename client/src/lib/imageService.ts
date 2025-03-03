/**
 * Image Service for FlingPing.co blog
 * Provides illustration-style images for blog posts to match the site's aesthetic
 */

// Map of illustration image URLs organized by category (using our local illustrations)
const IMAGE_MAP: Record<string, string[]> = {
  'Health Tips': [
    '/illustrations/a-doctor Background Removed.png', 
    '/illustrations/THought_Bubbles-noBG.png', 
    '/illustrations/Friends_NoBG.png', 
  ],
  'Privacy': [
    '/illustrations/wifi-signal-in-two-phones-pairing Background Removed.png', 
    '/illustrations/a-hand-pushing-a-button-on-a-phone.png', 
    '/illustrations/THought_Bubbles-noBG.png', 
  ],
  'Technology': [
    '/illustrations/a-hand-pushing-a-button-on-a-phone.png', 
    '/illustrations/wifi-signal-in-two-phones-pairing Background Removed.png', 
    '/illustrations/no-background--lifestyle-shots-of-animated-people-.gif', 
  ],
  'Relationships': [
    '/illustrations/no-background--friends-of-different-ethnicity-high.gif', 
    '/illustrations/no-background---woman-and-child-walking-a-dog.gif', 
    '/illustrations/no-background---two-college-kids-with-books-and-a- Background Removed.png', 
  ],
  'Product Reviews': [
    '/illustrations/no-background--woman-with-shopping-bags Background Removed.png', 
    '/illustrations/a-hand-pushing-a-button-on-a-phone.png', 
    '/illustrations/no-background----full-body-shot-of-a-delivery-driv.gif', 
  ],
  'Community': [
    '/illustrations/no-background--friends-of-different-ethnicity-high.gif', 
    '/illustrations/no-background---two-college-kids-with-books-and-a- Background Removed.png', 
    '/illustrations/no-background--two-people-crossing-a-street.gif', 
  ],
  // Fallback category
  'Default': [
    '/illustrations/THought_Bubbles-noBG.png', 
    '/illustrations/no-background--lifestyle-shots-of-animated-people-.gif', 
    '/illustrations/no-background--friends-of-different-ethnicity-high.gif', 
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