import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlusCircle, Trash2, Edit, Save, XCircle, FileText } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  category: string;
  imageKeywords?: string;
  readTime: string;
  isAffiliate: boolean;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default function BlogAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const { checkAuth, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [deletingCategory, setDeletingCategory] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [showCategoryDeleteDialog, setShowCategoryDeleteDialog] = useState(false);

  // Form state
  const [formState, setFormState] = useState<Partial<BlogPost>>({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    imageKeywords: "",
    readTime: "",
    isAffiliate: false
  });

  // Fetch blog posts
  const { 
    data: posts, 
    isLoading: postsLoading, 
    isError: postsError 
  } = useQuery({
    queryKey: ['/api/blog-posts'],
    queryFn: async () => {
      const response = await fetch('/api/blog-posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json() as Promise<BlogPost[]>;
    },
  });

  // Fetch categories
  const { 
    data: categories, 
    isLoading: categoriesLoading, 
    isError: categoriesError 
  } = useQuery({
    queryKey: ['/api/blog-categories'],
    queryFn: async () => {
      const response = await fetch('/api/blog-categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json() as Promise<string[]>;
    },
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (newPost: Omit<BlogPost, 'id' | 'date'>) => {
      const response = await fetch('/api/blog-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      toast({
        title: "Success!",
        description: "Blog post created successfully",
      });
      resetForm();
      setIsCreating(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, post }: { id: number, post: Partial<BlogPost> }) => {
      const response = await fetch(`/api/blog-posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update post');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      toast({
        title: "Success!",
        description: "Blog post updated successfully",
      });
      resetForm();
      setIsEditing(false);
      setEditingPost(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/blog-posts/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      toast({
        title: "Success!",
        description: "Blog post deleted successfully",
      });
      setPostToDelete(null);
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (category: string) => {
      const response = await fetch('/api/blog-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add category');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-categories'] });
      toast({
        title: "Success!",
        description: "Category added successfully",
      });
      setNewCategory("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (category: string) => {
      const response = await fetch(`/api/blog-categories/${encodeURIComponent(category)}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-categories'] });
      toast({
        title: "Success!",
        description: "Category deleted successfully",
      });
      setDeletingCategory("");
      setShowCategoryDeleteDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormState({
      ...formState,
      isAffiliate: checked
    });
  };

  const handleSelectChange = (value: string) => {
    setFormState({
      ...formState,
      category: value
    });
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormState({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || '',
      category: post.category,
      imageKeywords: post.imageKeywords || '',
      readTime: post.readTime,
      isAffiliate: post.isAffiliate
    });
    setIsEditing(true);
    setActiveTab("editor");
  };

  const handleCreatePost = () => {
    setIsCreating(true);
    resetForm();
    setActiveTab("editor");
  };

  const handleSavePost = () => {
    if (!formState.title || !formState.excerpt || !formState.content || !formState.category || !formState.readTime) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && editingPost) {
      updatePostMutation.mutate({ 
        id: editingPost.id, 
        post: formState as BlogPost 
      });
    } else if (isCreating) {
      createPostMutation.mutate(formState as Omit<BlogPost, 'id' | 'date'>);
    }
  };

  const confirmDeletePost = (id: number) => {
    setPostToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDeletePost = () => {
    if (postToDelete !== null) {
      deletePostMutation.mutate(postToDelete);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    addCategoryMutation.mutate(newCategory);
  };

  const confirmDeleteCategory = (category: string) => {
    setDeletingCategory(category);
    setShowCategoryDeleteDialog(true);
  };

  const handleDeleteCategory = () => {
    if (deletingCategory) {
      deleteCategoryMutation.mutate(deletingCategory);
    }
  };

  const resetForm = () => {
    setFormState({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      imageKeywords: "",
      readTime: "",
      isAffiliate: false
    });
  };

  const cancelEdit = () => {
    resetForm();
    setIsEditing(false);
    setIsCreating(false);
    setEditingPost(null);
    setActiveTab("posts");
  };

  // Check authentication on component mount
  useEffect(() => {
    // Redirect to login if not authenticated
    checkAuth();
  }, []);

  useEffect(() => {
    // Reset form when switching away from editor tab
    if (activeTab !== "editor") {
      setIsEditing(false);
      setIsCreating(false);
      setEditingPost(null);
      resetForm();
    }
  }, [activeTab]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary-600">Blog Admin</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="flex items-center gap-1"
          >
            Logout
          </Button>
        </div>
        <p className="text-muted-foreground">Manage blog posts and categories for FlingPing.co</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="editor" disabled={!isEditing && !isCreating}>
            {isEditing ? "Edit Post" : isCreating ? "Create Post" : "Editor"}
          </TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Blog Posts</CardTitle>
                <Button onClick={handleCreatePost} className="flex items-center gap-1">
                  <PlusCircle className="w-4 h-4" /> Add Post
                </Button>
              </div>
              <CardDescription>
                Manage your blog posts. Click on a post to edit its content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div className="flex justify-center py-8">Loading posts...</div>
              ) : postsError ? (
                <div className="text-red-500 py-8 text-center">
                  Error loading posts. Please try refreshing the page.
                </div>
              ) : posts && posts.length > 0 ? (
                <ScrollArea className="h-[500px]">
                  <Accordion type="single" collapsible className="w-full">
                    {posts.map((post) => (
                      <AccordionItem key={post.id} value={post.id.toString()}>
                        <AccordionTrigger className="hover:bg-accent/50 px-4 py-2 rounded-md">
                          <div className="flex-1 text-left mr-4">
                            <span className="font-medium">{post.title}</span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              {formatDate(post.date)} • {post.category}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium text-muted-foreground">Excerpt</Label>
                              <p>{post.excerpt}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <Label className="text-sm font-medium text-muted-foreground">Read Time</Label>
                                <p>{post.readTime}</p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-sm font-medium text-muted-foreground">Affiliate Post</Label>
                                <p>{post.isAffiliate ? "Yes" : "No"}</p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-sm font-medium text-muted-foreground">Image Keywords</Label>
                                <p>{post.imageKeywords || "None"}</p>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDeletePost(post.id)}
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleEditPost(post)}
                                className="flex items-center gap-1"
                              >
                                <Edit className="w-4 h-4" /> Edit
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No blog posts found. Click "Add Post" to create your first post.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Blog Categories</CardTitle>
              <CardDescription>
                Manage blog categories. These categories are used to organize your blog posts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="new-category">Add New Category</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-category"
                      placeholder="Enter category name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAddCategory} disabled={addCategoryMutation.isPending}>
                      {addCategoryMutation.isPending ? "Adding..." : "Add Category"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Existing Categories</h3>
                  {categoriesLoading ? (
                    <div className="flex justify-center py-4">Loading categories...</div>
                  ) : categoriesError ? (
                    <div className="text-red-500 py-4 text-center">
                      Error loading categories. Please try refreshing the page.
                    </div>
                  ) : categories && categories.length > 0 ? (
                    <ul className="space-y-2">
                      {categories.map((category) => (
                        <li
                          key={category}
                          className="flex justify-between items-center p-3 border rounded-md"
                        >
                          <span>{category}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => confirmDeleteCategory(category)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No categories found. Add some categories to organize your blog posts.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Editor Tab */}
        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Post" : "Create New Post"}</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Make changes to the selected blog post."
                  : "Create a new blog post by filling out the form below."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title*</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter post title"
                    value={formState.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt* (Brief summary)</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    placeholder="Enter a brief summary of the post"
                    value={formState.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content* (Markdown supported)</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Write your blog post content here (Markdown is supported)"
                    value={formState.content}
                    onChange={handleInputChange}
                    rows={12}
                    className="font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category*</Label>
                    <Select 
                      value={formState.category} 
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories && categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="readTime">Read Time*</Label>
                    <Input
                      id="readTime"
                      name="readTime"
                      placeholder="e.g. 5 min read"
                      value={formState.readTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageKeywords">Image Keywords (comma-separated)</Label>
                  <Input
                    id="imageKeywords"
                    name="imageKeywords"
                    placeholder="Enter keywords for the featured image"
                    value={formState.imageKeywords}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    These keywords will be used to generate an appropriate post image
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isAffiliate"
                    checked={formState.isAffiliate}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="isAffiliate">
                    This post contains affiliate links
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={cancelEdit}
                className="flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" /> Cancel
              </Button>
              <Button 
                onClick={handleSavePost}
                disabled={createPostMutation.isPending || updatePostMutation.isPending}
                className="flex items-center gap-1"
              >
                <Save className="w-4 h-4" />
                {isEditing 
                  ? updatePostMutation.isPending ? "Updating..." : "Update Post"
                  : createPostMutation.isPending ? "Creating..." : "Create Post"
                }
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Post Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePost}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Category Dialog */}
      <AlertDialog open={showCategoryDeleteDialog} onOpenChange={setShowCategoryDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category "{deletingCategory}".
              Any posts assigned to this category will need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}