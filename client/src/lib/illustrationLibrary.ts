/**
 * FlingPing.co Illustration Library
 * 
 * A collection of diverse, inclusive health-related illustrations
 * organized by categories for use throughout the website.
 */

// Define categories for our illustration library
export type IllustrationCategory = 
  | 'People' 
  | 'Communication' 
  | 'Health' 
  | 'Technology' 
  | 'Privacy' 
  | 'Community' 
  | 'Relationships' 
  | 'Lifestyle';

// Type for individual illustration metadata
export interface Illustration {
  id: string;
  src: string; 
  alt: string;
  category: IllustrationCategory[];
  tags: string[];
  diversityTags?: string[]; // Optional tags for search by representation
  style: 'flat' | 'outlined' | 'isometric' | 'cartoon';
}

// The complete illustration collection
export const illustrations: Illustration[] = [
  // PEOPLE - Diverse representations
  {
    id: 'diverse-group',
    src: '/illustrations/no-background--friends-of-different-ethnicity-high.gif',
    alt: 'Diverse group of friends of different ethnicities high-fiving',
    category: ['People', 'Community'],
    tags: ['diversity', 'friends', 'group', 'inclusive', 'high-five'],
    diversityTags: ['multiethnic', 'group'],
    style: 'flat'
  },
  {
    id: 'students',
    src: '/illustrations/no-background---two-college-kids-with-books-and-a- Background Removed.png',
    alt: 'Two college students with books and backpacks',
    category: ['People', 'Lifestyle'],
    tags: ['students', 'education', 'youth', 'college'],
    diversityTags: ['young adults'],
    style: 'flat'
  },
  {
    id: 'person-exit',
    src: '/illustrations/no-background--someone-exiting-a-door.gif',
    alt: 'Person exiting a door',
    category: ['People', 'Lifestyle'],
    tags: ['exit', 'door', 'leaving', 'movement'],
    style: 'flat'
  },
  {
    id: 'pedestrians',
    src: '/illustrations/no-background--two-people-crossing-a-street.gif',
    alt: 'Two people crossing a street',
    category: ['People', 'Lifestyle'],
    tags: ['walking', 'street', 'city', 'urban'],
    style: 'flat'
  },
  {
    id: 'shopper',
    src: '/illustrations/no-background--woman-with-shopping-bags Background Removed.png',
    alt: 'Woman with shopping bags',
    category: ['People', 'Lifestyle'],
    tags: ['shopping', 'consumer', 'retail', 'bags'],
    diversityTags: ['woman'],
    style: 'flat'
  },
  {
    id: 'doctor',
    src: '/illustrations/a-doctor Background Removed.png',
    alt: 'Healthcare professional',
    category: ['People', 'Health'],
    tags: ['doctor', 'healthcare', 'medical', 'professional'],
    style: 'flat'
  },
  {
    id: 'family-dog',
    src: '/illustrations/no-background---woman-and-child-walking-a-dog.gif',
    alt: 'Woman and child walking a dog',
    category: ['People', 'Lifestyle', 'Relationships'],
    tags: ['family', 'dog', 'walking', 'pets', 'caregiving'],
    diversityTags: ['woman', 'child'],
    style: 'flat'
  },
  
  // COMMUNICATION & TECHNOLOGY
  {
    id: 'thought-bubbles',
    src: '/illustrations/THought_Bubbles-noBG.png',
    alt: 'Communication thought bubbles',
    category: ['Communication'],
    tags: ['thoughts', 'speech', 'conversation', 'communication'],
    style: 'flat'
  },
  {
    id: 'phone-button',
    src: '/illustrations/a-hand-pushing-a-button-on-a-phone.png',
    alt: 'Hand pushing a button on a phone',
    category: ['Technology', 'Communication'],
    tags: ['phone', 'mobile', 'button', 'digital', 'hand'],
    style: 'flat'
  },
  {
    id: 'phones-pairing',
    src: '/illustrations/wifi-signal-in-two-phones-pairing Background Removed.png',
    alt: 'WiFi signal in two phones pairing',
    category: ['Technology', 'Communication'],
    tags: ['wifi', 'connection', 'phones', 'signal', 'pairing'],
    style: 'flat'
  },
  
  // COMMUNITY & RELATIONSHIPS
  {
    id: 'delivery-driver',
    src: '/illustrations/no-background----full-body-shot-of-a-delivery-driv.gif',
    alt: 'Full body shot of a delivery driver',
    category: ['People', 'Lifestyle'],
    tags: ['delivery', 'service', 'work', 'job'],
    style: 'flat'
  },
  
  // Additional animated people
  {
    id: 'animated-people',
    src: '/illustrations/no-background--lifestyle-shots-of-animated-people-.gif',
    alt: 'Lifestyle shots of animated people',
    category: ['People', 'Lifestyle'],
    tags: ['lifestyle', 'animated', 'illustration', 'diverse'],
    style: 'flat'
  }
];

/**
 * Get illustrations by category
 * @param category - The category to filter by
 * @returns Array of illustrations in the specified category
 */
export function getIllustrationsByCategory(category: IllustrationCategory): Illustration[] {
  return illustrations.filter(illustration => 
    illustration.category.includes(category)
  );
}

/**
 * Get illustrations by tag
 * @param tag - The tag to search for
 * @returns Array of illustrations with the specified tag
 */
export function getIllustrationsByTag(tag: string): Illustration[] {
  return illustrations.filter(illustration => 
    illustration.tags.includes(tag.toLowerCase()) || 
    illustration.diversityTags?.includes(tag.toLowerCase())
  );
}

/**
 * Get a random illustration
 * @param category - Optional category to filter by
 * @returns A random illustration, filtered by category if provided
 */
export function getRandomIllustration(category?: IllustrationCategory): Illustration {
  const pool = category ? getIllustrationsByCategory(category) : illustrations;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * Search illustrations by keyword
 * @param query - The search query
 * @returns Array of illustrations matching the search query
 */
export function searchIllustrations(query: string): Illustration[] {
  const lowercaseQuery = query.toLowerCase();
  
  return illustrations.filter(illustration => 
    illustration.alt.toLowerCase().includes(lowercaseQuery) ||
    illustration.tags.some(tag => tag.includes(lowercaseQuery)) ||
    illustration.diversityTags?.some(tag => tag.includes(lowercaseQuery)) ||
    illustration.category.some(cat => cat.toLowerCase().includes(lowercaseQuery))
  );
}