/**
 * Image Service for FlingPing.co blog
 * Provides illustration-style images for blog posts to match the site's aesthetic
 */

// Map of illustration image URLs organized by category
const IMAGE_MAP: Record<string, string[]> = {
  'Health Tips': [
    'https://cdn.pixabay.com/photo/2017/01/31/22/32/doctor-2027768_1280.png', // Doctor illustration
    'https://cdn.pixabay.com/photo/2020/09/07/17/40/doctor-5551985_1280.png', // Health illustration
    'https://cdn.pixabay.com/photo/2016/07/08/23/17/doctor-1505393_1280.jpg', // Medical illustration
  ],
  'Privacy': [
    'https://cdn.pixabay.com/photo/2017/01/24/10/58/security-2005395_1280.png', // Security illustration
    'https://cdn.pixabay.com/photo/2017/11/26/15/16/smiley-2979107_1280.jpg', // Privacy concept
    'https://cdn.pixabay.com/photo/2018/05/06/00/05/cyber-security-3378252_1280.jpg', // Data protection
  ],
  'Technology': [
    'https://cdn.pixabay.com/photo/2019/08/06/22/48/artificial-intelligence-4389372_1280.jpg', // Tech illustration
    'https://cdn.pixabay.com/photo/2018/09/28/19/07/artificial-intelligence-3709677_1280.png', // Digital concept
    'https://cdn.pixabay.com/photo/2021/03/09/08/03/online-diagnosis-6082324_1280.png', // Digital health tech
  ],
  'Relationships': [
    'https://cdn.pixabay.com/photo/2022/01/30/18/38/dialogue-6980885_1280.jpg', // Conversation illustration
    'https://cdn.pixabay.com/photo/2021/02/07/08/35/conversation-5991102_1280.jpg', // Communication
    'https://cdn.pixabay.com/photo/2021/01/17/09/11/people-5924968_1280.jpg', // Relationships
  ],
  'Product Reviews': [
    'https://cdn.pixabay.com/photo/2019/10/02/13/35/feedback-4521661_1280.png', // Review illustration
    'https://cdn.pixabay.com/photo/2017/06/10/07/30/hygiene-2389251_1280.png', // Health products
    'https://cdn.pixabay.com/photo/2013/07/13/12/43/package-160170_1280.png', // Products illustration
  ],
  'Community': [
    'https://cdn.pixabay.com/photo/2020/11/08/00/18/social-networking-5722084_1280.png', // Community illustration
    'https://cdn.pixabay.com/photo/2021/01/05/06/40/network-5889416_1280.png', // Team illustration
    'https://cdn.pixabay.com/photo/2017/01/14/10/56/people-1979261_1280.jpg', // Support group
  ],
  // Fallback category
  'Default': [
    'https://cdn.pixabay.com/photo/2020/12/16/10/46/relay-5837050_1280.jpg', // Communication
    'https://cdn.pixabay.com/photo/2016/06/03/13/57/digital-marketing-1433427_1280.jpg', // Digital
    'https://cdn.pixabay.com/photo/2018/09/04/10/27/health-3653380_1280.jpg', // Health concept
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