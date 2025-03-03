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
  content?: string;
}

// Interface for category data
interface CategoryData {
  name: string;
  isActive: boolean;
}

// Sample blog posts data - fallback if API fails
const defaultBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "5 Ways to Prioritize Your Sexual Health in 2025",
    excerpt: "Taking charge of your sexual health has never been more important. Here are our top tips for navigating a healthier, more confident you in 2025.",
    date: "March 1, 2025",
    category: "Health Tips",
    imageUrl: "/images/blog/sexual-health-tips.jpg",
    readTime: "4 min read",
    isAffiliate: true
  },
  {
    id: 2,
    title: "The Evolution of Health Communication: Why Privacy Matters",
    excerpt: "From awkward face-to-face conversations to anonymous digital notifications, the way we communicate about health has transformed dramatically.",
    date: "February 25, 2025",
    category: "Privacy",
    imageUrl: "/images/blog/health-communication.jpg",
    readTime: "6 min read",
    isAffiliate: false
  },
  {
    id: 3,
    title: "Smart Tech, Smarter Health: Digital Tools You Need to Know About",
    excerpt: "Discover the cutting-edge technology that's revolutionizing how we approach sexual health and wellness in the digital age.",
    date: "February 18, 2025",
    category: "Technology",
    imageUrl: "/images/blog/health-tech.jpg",
    readTime: "5 min read",
    isAffiliate: true
  },
  {
    id: 4,
    title: "Dating in 2025: Navigating Modern Relationships with Confidence",
    excerpt: "The dating landscape continues to evolve, but one thing remains constant: the importance of open communication and mutual respect.",
    date: "February 10, 2025",
    category: "Relationships",
    imageUrl: "/images/blog/modern-dating.jpg",
    readTime: "7 min read",
    isAffiliate: false
  },
  {
    id: 5,
    title: "The Best STI Prevention Products of 2025 [Reviewed]",
    excerpt: "Our comprehensive review of the most effective, user-friendly sexual health products on the market today.",
    date: "February 3, 2025",
    category: "Product Reviews",
    imageUrl: "/images/blog/prevention-products.jpg",
    readTime: "8 min read",
    isAffiliate: true
  },
  {
    id: 6,
    title: "Founding Flingers: Meet the Early Adopters Changing Health Communication",
    excerpt: "Interviews with our pioneering members who are leading the charge in revolutionizing how we think about sexual health notifications.",
    date: "January 28, 2025",
    category: "Community",
    imageUrl: "/images/blog/founding-flingers.jpg",
    readTime: "5 min read",
    isAffiliate: false
  }
];

// Default categories
const defaultCategories = [
  "All Posts",
  "Health Tips",
  "Privacy",
  "Technology",
  "Relationships",
  "Product Reviews",
  "Community"
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Posts");
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [email, setEmail] = useState<string>("");
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState<boolean>(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  // Initialize with default categories
  useEffect(() => {
    const initialCategories = defaultCategories.map(cat => ({
      name: cat,
      isActive: cat === "All Posts"
    }));
    setCategories(initialCategories);
  }, []);

  // Handle category selection
  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCategories(prevCategories => 
      prevCategories.map(cat => ({
        ...cat,
        isActive: cat.name === categoryName
      }))
    );
  };

  // Filter posts by selected category
  const filteredPosts = defaultBlogPosts.filter(post => 
    selectedCategory === "All Posts" || post.category === selectedCategory
  );

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubscribeError("Please enter a valid email address");
      return;
    }
    
    setIsSubscribing(true);
    setSubscribeError(null);
    
    try {
      // Use the same endpoint as the email signup form
      const response = await fetch('/api/email-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error('Subscription request failed');
      }
      
      setSubscribeSuccess(true);
      setEmail("");
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubscribeSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setSubscribeError("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubscribing(false);
    }
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
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
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
        
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts && filteredPosts.map((post) => (
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
          
          {filteredPosts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-sand">No posts found in this category.</p>
            </div>
          )}
        </div>
        
        {/* Newsletter Sign-up */}
        <div className="mt-16 bg-dark border-2 border-coral rounded-xl p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl mb-4 text-teal">Stay Updated with the Latest Articles</h2>
          <p className="text-sand mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive exclusive content, valuable resources, and important updates directly to your inbox.
          </p>
          
          {subscribeSuccess ? (
            <div className="bg-teal/20 text-teal p-4 rounded-xl border border-teal max-w-lg mx-auto mb-4">
              Thank you for subscribing! You'll start receiving our updates shortly.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className={`flex-grow px-4 py-3 rounded-full bg-[#3c3c3c] text-sand border-2 ${
                    subscribeError ? "border-coral" : "border-sand"
                  } focus:border-teal focus:outline-none`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubscribing}
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-coral text-[#3c3c3c] hover:bg-yellow hover:text-[#3c3c3c] rounded-full"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? (
                    <>
                      <span className="mr-2">Subscribing</span>
                      <div className="w-4 h-4 border-2 border-[#3c3c3c] border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>
              
              {subscribeError && (
                <p className="mt-2 text-coral text-sm">{subscribeError}</p>
              )}
            </form>
          )}
          
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