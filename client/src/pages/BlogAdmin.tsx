import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';
import { Trash2, Edit2, Plus, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BlogPost {
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

const INITIAL_POST: Omit<BlogPost, 'id' | 'date'> = {
  title: '',
  excerpt: '',
  category: '',
  imageKeywords: '',
  readTime: '5 min read',
  isAffiliate: false,
  content: ''
};

export default function BlogAdmin() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('posts');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState<Omit<BlogPost, 'id' | 'date'>>(INITIAL_POST);
  const [newCategory, setNewCategory] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  
  // Fetch blog posts
  const { data: posts = [], isLoading: isLoadingPosts } = useQuery({
    queryKey: ['/api/blog-posts'],
    queryFn: async () => {
      const response = await fetch('/api/blog-posts');
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      return response.json();
    }
  });
  
  // Fetch categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/blog-categories'],
    queryFn: async () => {
      const response = await fetch('/api/blog-categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    }
  });
  
  // Create blog post mutation
  const createPostMutation = useMutation({
    mutationFn: async (post: Omit<BlogPost, 'id' | 'date'>) => {
      const response = await fetch('/api/blog-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create blog post');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      setNewPost(INITIAL_POST);
      setIsCreateDialogOpen(false);
      toast({
        title: "Success!",
        description: "Blog post created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    }
  });
  
  // Update blog post mutation
  const updatePostMutation = useMutation({
    mutationFn: async (post: BlogPost) => {
      const response = await fetch(`/api/blog-posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update blog post');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      setEditingPost(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Success!",
        description: "Blog post updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    }
  });
  
  // Delete blog post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await fetch(`/api/blog-posts/${postId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete blog post');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      setPostToDelete(null);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success!",
        description: "Blog post deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    }
  });
  
  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (category: string) => {
      const response = await fetch('/api/blog-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create category');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-categories'] });
      setNewCategory('');
      toast({
        title: "Success!",
        description: "Category created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    }
  });
  
  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (category: string) => {
      const response = await fetch(`/api/blog-categories/${encodeURIComponent(category)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete category');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-categories'] });
      setCategoryToDelete(null);
      setIsCategoryDialogOpen(false);
      toast({
        title: "Success!",
        description: "Category deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    }
  });
  
  // Handle form submissions
  const handleCreatePost = () => {
    createPostMutation.mutate(newPost);
  };
  
  const handleUpdatePost = () => {
    if (editingPost) {
      updatePostMutation.mutate(editingPost);
    }
  };
  
  const handleDeletePost = () => {
    if (postToDelete) {
      deletePostMutation.mutate(postToDelete.id);
    }
  };
  
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      createCategoryMutation.mutate(newCategory);
    }
  };
  
  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete);
    }
  };
  
  // Update form handlers
  const updateNewPost = (field: keyof typeof newPost, value: any) => {
    setNewPost(prev => ({ ...prev, [field]: value }));
  };
  
  const updateEditingPost = (field: keyof BlogPost, value: any) => {
    if (editingPost) {
      setEditingPost({ ...editingPost, [field]: value });
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-[#FF695E]">Blog Administration</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Blog Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        {/* Blog Posts Tab */}
        <TabsContent value="posts">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Blog Posts</h2>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-[#FF695E] hover:bg-[#ff8a7f]"
            >
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Button>
          </div>
          
          {isLoadingPosts ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF695E]"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No blog posts found. Create your first post!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: BlogPost) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {formatDate(post.date)} • {post.readTime} • 
                          <span className="bg-[#e0f2f4] text-[#00a9a7] px-2 py-0.5 rounded-full text-xs ml-2">
                            {post.category}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setEditingPost(post);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500"
                          onClick={() => {
                            setPostToDelete(post);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-4 w-full"
                      onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" /> View Post
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          {/* Create Post Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Blog Post</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new blog post.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      value={newPost.title} 
                      onChange={(e) => updateNewPost('title', e.target.value)}
                      placeholder="Enter post title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newPost.category} 
                      onValueChange={(value) => updateNewPost('category', value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: string) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea 
                    id="excerpt" 
                    value={newPost.excerpt} 
                    onChange={(e) => updateNewPost('excerpt', e.target.value)}
                    placeholder="Brief summary of the post"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageKeywords">Image Keywords</Label>
                    <Input 
                      id="imageKeywords" 
                      value={newPost.imageKeywords} 
                      onChange={(e) => updateNewPost('imageKeywords', e.target.value)}
                      placeholder="Keywords for featured image"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="readTime">Read Time</Label>
                    <Input 
                      id="readTime" 
                      value={newPost.readTime} 
                      onChange={(e) => updateNewPost('readTime', e.target.value)}
                      placeholder="e.g. 5 min read"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isAffiliate" 
                    checked={newPost.isAffiliate} 
                    onCheckedChange={(checked) => updateNewPost('isAffiliate', checked)}
                  />
                  <Label htmlFor="isAffiliate">Contains affiliate links</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea 
                    id="content" 
                    value={newPost.content} 
                    onChange={(e) => updateNewPost('content', e.target.value)}
                    placeholder="Full blog post content"
                    rows={10}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreatePost}
                  className="bg-[#FF695E] hover:bg-[#ff8a7f]"
                  disabled={createPostMutation.isPending}
                >
                  {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Edit Post Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Edit Blog Post</DialogTitle>
                <DialogDescription>
                  Update the blog post details.
                </DialogDescription>
              </DialogHeader>
              
              {editingPost && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input 
                        id="edit-title" 
                        value={editingPost.title} 
                        onChange={(e) => updateEditingPost('title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Category</Label>
                      <Select 
                        value={editingPost.category} 
                        onValueChange={(value) => updateEditingPost('category', value)}
                      >
                        <SelectTrigger id="edit-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category: string) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-excerpt">Excerpt</Label>
                    <Textarea 
                      id="edit-excerpt" 
                      value={editingPost.excerpt} 
                      onChange={(e) => updateEditingPost('excerpt', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-imageKeywords">Image Keywords</Label>
                      <Input 
                        id="edit-imageKeywords" 
                        value={editingPost.imageKeywords || ''} 
                        onChange={(e) => updateEditingPost('imageKeywords', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-readTime">Read Time</Label>
                      <Input 
                        id="edit-readTime" 
                        value={editingPost.readTime} 
                        onChange={(e) => updateEditingPost('readTime', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="edit-isAffiliate" 
                      checked={editingPost.isAffiliate} 
                      onCheckedChange={(checked) => updateEditingPost('isAffiliate', checked)}
                    />
                    <Label htmlFor="edit-isAffiliate">Contains affiliate links</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-content">Content</Label>
                    <Textarea 
                      id="edit-content" 
                      value={editingPost.content || ''} 
                      onChange={(e) => updateEditingPost('content', e.target.value)}
                      rows={10}
                    />
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdatePost}
                  className="bg-[#FF695E] hover:bg-[#ff8a7f]"
                  disabled={updatePostMutation.isPending}
                >
                  {updatePostMutation.isPending ? 'Updating...' : 'Update Post'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Delete Post Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Blog Post</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this blog post? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              
              {postToDelete && (
                <div className="py-4">
                  <p className="font-medium">{postToDelete.title}</p>
                  <p className="text-sm text-gray-500">{formatDate(postToDelete.date)}</p>
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleDeletePost}
                  disabled={deletePostMutation.isPending}
                >
                  {deletePostMutation.isPending ? 'Deleting...' : 'Delete Post'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        {/* Categories Tab */}
        <TabsContent value="categories">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Blog Categories</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Category List */}
            <Card>
              <CardHeader>
                <CardTitle>Current Categories</CardTitle>
                <CardDescription>
                  Manage your blog post categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingCategories ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF695E]"></div>
                  </div>
                ) : categories.length === 0 ? (
                  <p className="text-center py-4 text-gray-500">No categories found</p>
                ) : (
                  <ul className="space-y-2">
                    {categories.map((category: string) => (
                      <li 
                        key={category}
                        className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md"
                      >
                        <span>{category}</span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 h-8 w-8"
                          onClick={() => {
                            setCategoryToDelete(category);
                            setIsCategoryDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            
            {/* Add Category Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
                <CardDescription>
                  Create a new blog post category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newCategory">Category Name</Label>
                    <Input 
                      id="newCategory" 
                      value={newCategory} 
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter category name"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-[#FF695E] hover:bg-[#ff8a7f]"
                    disabled={!newCategory.trim() || createCategoryMutation.isPending}
                  >
                    {createCategoryMutation.isPending ? 'Adding...' : 'Add Category'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Delete Category Dialog */}
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this category? This will not delete posts in this category, but they will need to be reassigned.
                </DialogDescription>
              </DialogHeader>
              
              {categoryToDelete && (
                <div className="py-4">
                  <p className="font-medium">Category: {categoryToDelete}</p>
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCategoryDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleDeleteCategory}
                  disabled={deleteCategoryMutation.isPending}
                >
                  {deleteCategoryMutation.isPending ? 'Deleting...' : 'Delete Category'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}