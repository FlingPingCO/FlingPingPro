import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Convert callback-based fs methods to promise-based
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Base paths for blog data files
const blogPostsPath = path.resolve('./server/data/blog-posts.json');
const blogCategoriesPath = path.resolve('./server/data/blog-categories.json');

// Interface for blog post
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageKeywords?: string;
  readTime: string;
  isAffiliate: boolean;
  content?: string;
}

/**
 * Get all blog posts
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const data = await readFile(blogPostsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading blog posts file:', error);
    return [];
  }
}

/**
 * Get a single blog post by ID
 */
export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  try {
    const posts = await getAllBlogPosts();
    return posts.find(post => post.id === id) || null;
  } catch (error) {
    console.error('Error getting blog post by ID:', error);
    return null;
  }
}

/**
 * Create a new blog post
 */
export async function createBlogPost(post: Omit<BlogPost, 'id' | 'date'>): Promise<BlogPost | null> {
  try {
    // Get existing posts
    const posts = await getAllBlogPosts();
    
    // Create new post with generated ID and date
    const newPost: BlogPost = {
      id: Math.max(0, ...posts.map(p => p.id)) + 1,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      imageKeywords: post.imageKeywords,
      readTime: post.readTime,
      isAffiliate: post.isAffiliate,
      content: post.content,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    
    // Add to posts and save
    posts.push(newPost);
    await writeFile(blogPostsPath, JSON.stringify(posts, null, 2), 'utf8');
    
    return newPost;
  } catch (error) {
    console.error('Error creating blog post:', error);
    return null;
  }
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(id: number, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    // Get existing posts
    const posts = await getAllBlogPosts();
    
    // Find post to update
    const postIndex = posts.findIndex(post => post.id === id);
    if (postIndex === -1) return null;
    
    // Create updated post
    const updatedPost: BlogPost = {
      ...posts[postIndex],
      ...updates,
      id // Ensure ID doesn't change
    };
    
    // Update post and save
    posts[postIndex] = updatedPost;
    await writeFile(blogPostsPath, JSON.stringify(posts, null, 2), 'utf8');
    
    return updatedPost;
  } catch (error) {
    console.error('Error updating blog post:', error);
    return null;
  }
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: number): Promise<boolean> {
  try {
    // Get existing posts
    const posts = await getAllBlogPosts();
    
    // Filter out the post to delete
    const filteredPosts = posts.filter(post => post.id !== id);
    
    // If no post was removed, return false
    if (filteredPosts.length === posts.length) return false;
    
    // Save updated posts
    await writeFile(blogPostsPath, JSON.stringify(filteredPosts, null, 2), 'utf8');
    
    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
}

/**
 * Get all blog categories
 */
export async function getAllCategories(): Promise<string[]> {
  try {
    const data = await readFile(blogCategoriesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading blog categories file:', error);
    return [];
  }
}

/**
 * Add a new category
 */
export async function addCategory(category: string): Promise<boolean> {
  try {
    // Get existing categories
    const categories = await getAllCategories();
    
    // Check if category already exists
    if (categories.includes(category)) return false;
    
    // Add category and save
    categories.push(category);
    await writeFile(blogCategoriesPath, JSON.stringify(categories, null, 2), 'utf8');
    
    return true;
  } catch (error) {
    console.error('Error adding category:', error);
    return false;
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(category: string): Promise<boolean> {
  try {
    // Get existing categories
    const categories = await getAllCategories();
    
    // Filter out the category to delete
    const filteredCategories = categories.filter(c => c !== category);
    
    // If no category was removed, return false
    if (filteredCategories.length === categories.length) return false;
    
    // Save updated categories
    await writeFile(blogCategoriesPath, JSON.stringify(filteredCategories, null, 2), 'utf8');
    
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
}

/**
 * Make a backup of the blog data files
 */
export async function backupBlogData(): Promise<boolean> {
  try {
    // Read current data
    const postsData = await readFile(blogPostsPath, 'utf8');
    const categoriesData = await readFile(blogCategoriesPath, 'utf8');
    
    // Create backup filenames with timestamps
    const timestamp = new Date().toISOString().replace(/[:\.]/g, '-');
    const postsBackupPath = path.resolve(`./server/data/blog-posts.${timestamp}.bak.json`);
    const categoriesBackupPath = path.resolve(`./server/data/blog-categories.${timestamp}.bak.json`);
    
    // Write backup files
    await writeFile(postsBackupPath, postsData, 'utf8');
    await writeFile(categoriesBackupPath, categoriesData, 'utf8');
    
    return true;
  } catch (error) {
    console.error('Error backing up blog data:', error);
    return false;
  }
}