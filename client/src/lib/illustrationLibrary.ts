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
    src: '/illustrations/friends-no-bg.png',
    alt: 'Diverse group of friends of different ethnicities',
    category: ['People', 'Community'],
    tags: ['diversity', 'friends', 'group', 'inclusive'],
    diversityTags: ['multiethnic', 'group'],
    style: 'flat'
  },
  {
    id: 'students',
    src: '/illustrations/two-college-kids-no-bg.png',
    alt: 'Two college students with books and backpacks',
    category: ['People', 'Lifestyle'],
    tags: ['students', 'education', 'youth', 'college'],
    diversityTags: ['young adults'],
    style: 'flat'
  },
  {
    id: 'person-exit',
    src: '/illustrations/someone-exiting-door-no-bg.png',
    alt: 'Person exiting a door',
    category: ['People', 'Lifestyle'],
    tags: ['exit', 'door', 'leaving', 'movement'],
    style: 'flat'
  },
  {
    id: 'pedestrians',
    src: '/illustrations/two-people-crossing-street-no-bg.png',
    alt: 'Two people crossing a street',
    category: ['People', 'Lifestyle'],
    tags: ['walking', 'street', 'city', 'urban'],
    style: 'flat'
  },
  {
    id: 'shopper',
    src: '/illustrations/woman-with-shopping-bags-no-bg.png',
    alt: 'Woman with shopping bags',
    category: ['People', 'Lifestyle'],
    tags: ['shopping', 'consumer', 'retail', 'bags'],
    diversityTags: ['woman'],
    style: 'flat'
  },
  {
    id: 'doctor',
    src: '/illustrations/doctor-no-bg.png',
    alt: 'Healthcare professional',
    category: ['People', 'Health'],
    tags: ['doctor', 'healthcare', 'medical', 'professional'],
    style: 'flat'
  },
  {
    id: 'family-dog',
    src: '/illustrations/woman-child-dog-no-bg.png',
    alt: 'Woman and child walking a dog',
    category: ['People', 'Lifestyle', 'Relationships'],
    tags: ['family', 'dog', 'walking', 'pets', 'caregiving'],
    diversityTags: ['woman', 'child'],
    style: 'flat'
  },
  
  // COMMUNICATION & TECHNOLOGY
  {
    id: 'thought-bubbles',
    src: '/illustrations/thought-bubbles-no-bg.png',
    alt: 'Communication thought bubbles',
    category: ['Communication'],
    tags: ['thoughts', 'speech', 'conversation', 'communication'],
    style: 'flat'
  },
  {
    id: 'phone-button',
    src: '/illustrations/hand-pushing-phone-button.png',
    alt: 'Hand pushing a button on a phone',
    category: ['Technology', 'Communication'],
    tags: ['phone', 'mobile', 'button', 'digital', 'hand'],
    style: 'flat'
  },
  {
    id: 'phones-pairing',
    src: '/illustrations/wifi-signal-phones-pairing-no-bg.png',
    alt: 'WiFi signal in two phones pairing',
    category: ['Technology', 'Communication'],
    tags: ['wifi', 'connection', 'phones', 'signal', 'pairing'],
    style: 'flat'
  },
  
  // COMMUNITY & RELATIONSHIPS
  {
    id: 'high-five',
    src: '/illustrations/friends-high-five-no-bg.png',
    alt: 'Friends of different ethnicity high-fiving',
    category: ['People', 'Community', 'Relationships'],
    tags: ['high-five', 'celebration', 'friendship', 'support'],
    diversityTags: ['multiethnic'],
    style: 'flat'
  },
  
  // Brand specific
  {
    id: 'logo-transparent',
    src: '/illustrations/FlingPing-logo-tp-bg-removed.png',
    alt: 'FlingPing.co logo with transparent background',
    category: ['Technology'],
    tags: ['logo', 'brand', 'identity'],
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