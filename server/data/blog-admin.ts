import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import { fileURLToPath } from 'url';

// Define the blog post interface
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

// Get the directory path for ES modules (replacing __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const postsFilePath = path.join(__dirname, 'blog-posts.json');
const categoriesFilePath = path.join(__dirname, 'blog-categories.json');
const backupDir = path.join(__dirname, 'backups');

// Helper function to ensure backup directory exists
async function ensureBackupDirExists() {
  try {
    await fsPromises.access(backupDir);
  } catch (err) {
    await fsPromises.mkdir(backupDir, { recursive: true });
  }
}

// Helper function to read posts from file
async function readPosts(): Promise<BlogPost[]> {
  try {
    const data = await fsPromises.readFile(postsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading blog posts:', err);
    return [];
  }
}

// Helper function to write posts to file
async function writePosts(posts: BlogPost[]): Promise<boolean> {
  try {
    await fsPromises.writeFile(
      postsFilePath,
      JSON.stringify(posts, null, 2),
      'utf-8'
    );
    return true;
  } catch (err) {
    console.error('Error writing blog posts:', err);
    return false;
  }
}

// Helper function to read categories from file
async function readCategories(): Promise<string[]> {
  try {
    const data = await fsPromises.readFile(categoriesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading blog categories:', err);
    return [];
  }
}

// Helper function to write categories to file
async function writeCategories(categories: string[]): Promise<boolean> {
  try {
    await fsPromises.writeFile(
      categoriesFilePath,
      JSON.stringify(categories, null, 2),
      'utf-8'
    );
    return true;
  } catch (err) {
    console.error('Error writing blog categories:', err);
    return false;
  }
}

/**
 * Get all blog posts
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return await readPosts();
}

/**
 * Get a single blog post by ID
 */
export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const posts = await readPosts();
  const post = posts.find(p => p.id === id);
  return post || null;
}

/**
 * Create a new blog post
 */
export async function createBlogPost(post: Omit<BlogPost, 'id' | 'date'>): Promise<BlogPost | null> {
  try {
    const posts = await readPosts();
    
    // Calculate next ID
    const maxId = posts.length > 0 
      ? Math.max(...posts.map(p => p.id)) 
      : 0;
    
    const newPost: BlogPost = {
      id: maxId + 1,
      date: new Date().toISOString(),
      ...post
    };
    
    posts.push(newPost);
    
    if (await writePosts(posts)) {
      return newPost;
    }
    return null;
  } catch (err) {
    console.error('Error creating blog post:', err);
    return null;
  }
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(id: number, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const posts = await readPosts();
    const index = posts.findIndex(p => p.id === id);
    
    if (index === -1) {
      return null;
    }
    
    // Don't allow changing id or date
    const { id: _, date: __, ...validUpdates } = updates;
    
    const updatedPost: BlogPost = {
      ...posts[index],
      ...validUpdates
    };
    
    posts[index] = updatedPost;
    
    if (await writePosts(posts)) {
      return updatedPost;
    }
    return null;
  } catch (err) {
    console.error('Error updating blog post:', err);
    return null;
  }
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: number): Promise<boolean> {
  try {
    const posts = await readPosts();
    const filteredPosts = posts.filter(p => p.id !== id);
    
    if (filteredPosts.length === posts.length) {
      // No post was filtered out
      return false;
    }
    
    return await writePosts(filteredPosts);
  } catch (err) {
    console.error('Error deleting blog post:', err);
    return false;
  }
}

/**
 * Get all blog categories
 */
export async function getAllCategories(): Promise<string[]> {
  return await readCategories();
}

/**
 * Add a new category
 */
export async function addCategory(category: string): Promise<boolean> {
  try {
    const categories = await readCategories();
    
    // Don't add duplicate categories
    if (categories.includes(category)) {
      return true; // Already exists, consider it a success
    }
    
    categories.push(category);
    return await writeCategories(categories);
  } catch (err) {
    console.error('Error adding category:', err);
    return false;
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(category: string): Promise<boolean> {
  try {
    const categories = await readCategories();
    const index = categories.indexOf(category);
    
    if (index === -1) {
      return false;
    }
    
    categories.splice(index, 1);
    return await writeCategories(categories);
  } catch (err) {
    console.error('Error deleting category:', err);
    return false;
  }
}

/**
 * Make a backup of the blog data files
 */
export async function backupBlogData(): Promise<boolean> {
  try {
    await ensureBackupDirExists();
    
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const postsBackupPath = path.join(backupDir, `blog-posts-${timestamp}.json`);
    const categoriesBackupPath = path.join(backupDir, `blog-categories-${timestamp}.json`);
    
    // Make copies of current files
    await fsPromises.copyFile(postsFilePath, postsBackupPath);
    await fsPromises.copyFile(categoriesFilePath, categoriesBackupPath);
    
    return true;
  } catch (err) {
    console.error('Error backing up blog data:', err);
    return false;
  }
}