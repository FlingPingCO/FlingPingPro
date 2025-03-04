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
    '/illustrations/no-background--lifestyle-shots-of-animated-people-.gif',
    '/illustrations/no-background---two-college-kids-with-books-and-a- Background Removed.png',
    '/illustrations/thought-bubbles.png'
  ],
  'Privacy': [
    '/illustrations/wifi-signal-in-two-phones-pairing Background Removed.png', 
    '/illustrations/a-hand-pushing-a-button-on-a-phone.png', 
    '/illustrations/THought_Bubbles-noBG.png',
    '/illustrations/no-background--someone-exiting-a-door.gif',
    '/illustrations/no-background--two-people-crossing-a-street.gif',
    '/illustrations/no-background---two-college-kids-with-books-and-a- Background Removed.png'
  ],
  'Technology': [
    '/illustrations/a-hand-pushing-a-button-on-a-phone.png', 
    '/illustrations/wifi-signal-in-two-phones-pairing Background Removed.png', 
    '/illustrations/no-background--lifestyle-shots-of-animated-people-.gif',
    '/illustrations/no-background--two-people-crossing-a-street.gif',
    '/illustrations/no-background--someone-exiting-a-door.gif',
    '/illustrations/sign-up-form Background Removed.png'
  ],
  'Relationships': [
    '/illustrations/no-background--friends-of-different-ethnicity-high.gif', 
    '/illustrations/no-background---woman-and-child-walking-a-dog.gif', 
    '/illustrations/no-background---two-college-kids-with-books-and-a- Background Removed.png',
    '/illustrations/Friends_NoBG.png',
    '/illustrations/no-background--lifestyle-shots-of-animated-people-.gif',
    '/illustrations/no-background--two-people-crossing-a-street.gif'
  ],
  'Product Reviews': [
    '/illustrations/no-background--woman-with-shopping-bags Background Removed.png', 
    '/illustrations/a-hand-pushing-a-button-on-a-phone.png', 
    '/illustrations/no-background----full-body-shot-of-a-delivery-driv.gif',
    '/illustrations/no-background--woman-with-shopping-bags Background Removed 2.png',
    '/illustrations/sign-up-form Background Removed.png',
    '/illustrations/no-background--someone-exiting-a-door.gif'
  ],
  'Community': [
    '/illustrations/no-background--friends-of-different-ethnicity-high.gif', 
    '/illustrations/no-background---two-college-kids-with-books-and-a- Background Removed.png', 
    '/illustrations/no-background--two-people-crossing-a-street.gif',
    '/illustrations/Friends_NoBG.png',
    '/illustrations/no-background---woman-and-child-walking-a-dog.gif',
    '/illustrations/no-background--lifestyle-shots-of-animated-people-.gif'
  ],
  // Fallback category
  'Default': [
    '/illustrations/THought_Bubbles-noBG.png', 
    '/illustrations/no-background--lifestyle-shots-of-animated-people-.gif', 
    '/illustrations/no-background--friends-of-different-ethnicity-high.gif',
    '/illustrations/Friends_NoBG.png',
    '/illustrations/no-background--two-people-crossing-a-street.gif',
    '/illustrations/thought-bubbles.png'
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
    // Create a weighted selection based on keywords to get better variety
    if (typeof customTerms === 'string' && customTerms.includes(',')) {
      // Parse the comma-separated keywords
      const keywords = customTerms.split(',').map(k => k.trim());
      
      // Create a more sophisticated hash that uses keyword matching
      // to select the most appropriate image from the category
      let totalWeight = 0;
      
      // Use the first keyword as the primary selector if possible
      if (keywords.length > 0) {
        const primaryWord = keywords[0];
        totalWeight = primaryWord.split('').reduce((acc, char) => {
          return acc + char.charCodeAt(0);
        }, 0);
        
        // Add additional influence from other keywords (with less weight)
        if (keywords.length > 1) {
          for (let i = 1; i < keywords.length; i++) {
            const secondaryWord = keywords[i];
            const secondaryWeight = secondaryWord.split('').reduce((acc, char) => {
              return acc + char.charCodeAt(0);
            }, 0);
            
            // Give secondary keywords less influence (30%)
            totalWeight += Math.floor(secondaryWeight * 0.3);
          }
        }
      }
      
      index = totalWeight % imageList.length;
    } else {
      // Fallback to simple hash for single keywords
      const hash = customTerms.split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0);
      }, 0);
      
      index = hash % imageList.length;
    }
  } else {
    // Random selection if no customTerms provided
    index = Math.floor(Math.random() * imageList.length);
  }
  
  // Return the selected image URL
  return imageList[index];
}

/**
 * Get an alternative blog image if the default one is unsuitable
 * Different from getThemedBlogImage, this function ensures it returns
 * a different image than what would be returned by the default algorithm
 * 
 * @param category - Blog post category
 * @param customTerms - Original keywords used
 * @returns URL to an alternative image from the same category
 */
export function getAlternativeBlogImage(
  category: string,
  customTerms?: string
): string {
  const imageList = IMAGE_MAP[category] || IMAGE_MAP['Default'];
  
  // If there's only one image, we can't provide an alternative
  if (imageList.length <= 1) {
    return imageList[0];
  }
  
  // Get the original index that would have been selected
  let originalIndex = 0;
  
  if (customTerms) {
    const hash = customTerms.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    originalIndex = hash % imageList.length;
  }
  
  // Select a different index
  let newIndex = (originalIndex + 1) % imageList.length;
  
  // If we have more than 2 images, we can be more random with our alternative
  if (imageList.length > 2) {
    // Get a random index that's not the original
    while (newIndex === originalIndex) {
      newIndex = Math.floor(Math.random() * imageList.length);
    }
  }
  
  return imageList[newIndex];
}