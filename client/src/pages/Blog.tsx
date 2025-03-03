import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

// Interface for blog post data
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime: string;
  isAffiliate: boolean;
}

// Interface for category data
interface CategoryData {
  name: string;
  isActive: boolean;
}

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Posts");
  const [categories, setCategories] = useState<CategoryData[]>([]);

  // Fetch blog posts
  const { data: blogPosts, isLoading: isLoadingPosts, error: postsError } = useQuery({
    queryKey: ['/api/blog-posts'],
    queryFn: () => apiRequest<BlogPost[]>({ path: '/api/blog-posts', on401: "throw" })
  });

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/blog-categories'],
    queryFn: () => apiRequest<string[]>({ path: '/api/blog-categories', on401: "throw" })
  });

  // Update categories when data is fetched
  useEffect(() => {
    if (categoriesData) {
      const formattedCategories = categoriesData.map(cat => ({
        name: cat,
        isActive: cat === selectedCategory
      }));
      setCategories(formattedCategories);
    }
  }, [categoriesData, selectedCategory]);

  // Filter posts by selected category
  const filteredPosts = blogPosts?.filter(post => 
    selectedCategory === "All Posts" || post.category === selectedCategory
  );

  // Handle category selection
  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl text-center mb-6">
            The <span className="text-teal">FlingPing<span className="text-coral">.co</span></span> Blog
          </h1>
          <p className="text-lg text-center max-w-3xl mx-auto">
            Insights, education, and inspiration for a healthier, more confident approach to sexual wellness and communication.
          </p>
        </div>
        
        {/* Categories */}
        {isLoadingCategories ? (
          <div className="flex justify-center mb-10">
            <p className="text-sand">Loading categories...</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(category => (
              <Button 
                key={category.name}
                variant="outline" 
                className={`${
                  category.name === selectedCategory 
                    ? "border-teal text-teal bg-teal/10" 
                    : "border-coral text-coral"
                } hover:bg-coral hover:text-[#3c3c3c] rounded-full text-sm`}
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        )}
        
        {/* Blog Posts Grid */}
        {isLoadingPosts ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-teal text-lg mb-4">Loading blog posts...</p>
            <div className="w-12 h-12 border-4 border-sand border-t-coral rounded-full animate-spin"></div>
          </div>
        ) : postsError ? (
          <div className="bg-coral/20 p-4 rounded-xl border border-coral text-center my-8">
            <p className="text-coral">Failed to load blog posts. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts && filteredPosts.map(post => (
              <div key={post.id} className="bg-background border-2 border-teal rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                {/* Placeholder for blog post image */}
                <div className="h-48 bg-dark flex items-center justify-center">
                  <div className="text-center px-6">
                    <span className="text-teal font-medium">[Featured Image]</span>
                    <p className="text-xs text-sand mt-1">Image would display here in production</p>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-medium text-coral">{post.category}</span>
                    <span className="text-xs text-sand">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-teal">
                    {post.title}
                    {post.isAffiliate && (
                      <span className="text-xs text-coral ml-2 align-top">[Affiliate]</span>
                    )}
                  </h3>
                  
                  <p className="mb-4 text-sm text-sand flex-grow">{post.excerpt}</p>
                  
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xs text-sand">{post.date}</span>
                    <Button variant="link" className="text-teal p-0 hover:text-coral">
                      Read More →
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredPosts?.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-sand">No posts found in this category.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Newsletter Sign-up */}
        <div className="mt-16 bg-dark border-2 border-coral rounded-xl p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl mb-4 text-teal">Stay Updated with the Latest Articles</h2>
          <p className="text-sand mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive exclusive content, valuable resources, and important updates directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-full bg-[#3c3c3c] text-sand border-2 border-sand focus:border-teal focus:outline-none"
            />
            <Button className="bg-coral text-[#3c3c3c] hover:bg-yellow hover:text-[#3c3c3c] rounded-full">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-sand mt-4">
            By subscribing, you agree to our <Link href="/legal" className="text-teal hover:underline">Privacy Policy</Link>. We respect your privacy and will never share your information.
          </p>
        </div>
        
        {/* Affiliate Disclosure */}
        <div className="mt-12 text-center">
          <p className="text-sm text-sand">
            <span className="text-coral">Affiliate Disclosure:</span> Some links in our blog posts are affiliate links, which means we may earn a commission if you make a purchase through these links, at no additional cost to you. 
            <Link href="/legal#affiliate">
              <span className="text-teal ml-1 hover:underline cursor-pointer">Learn more</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;