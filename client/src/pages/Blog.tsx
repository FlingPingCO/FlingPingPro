import { Link } from "wouter";
import { Button } from "@/components/ui/button";

// Sample blog posts data
const blogPosts = [
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

const Blog = () => {
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
          <Button variant="outline" className="border-teal text-teal hover:bg-teal hover:text-[#3c3c3c] rounded-full text-sm">
            All Posts
          </Button>
          <Button variant="outline" className="border-coral text-coral hover:bg-coral hover:text-[#3c3c3c] rounded-full text-sm">
            Health Tips
          </Button>
          <Button variant="outline" className="border-coral text-coral hover:bg-coral hover:text-[#3c3c3c] rounded-full text-sm">
            Privacy
          </Button>
          <Button variant="outline" className="border-coral text-coral hover:bg-coral hover:text-[#3c3c3c] rounded-full text-sm">
            Technology
          </Button>
          <Button variant="outline" className="border-coral text-coral hover:bg-coral hover:text-[#3c3c3c] rounded-full text-sm">
            Relationships
          </Button>
          <Button variant="outline" className="border-coral text-coral hover:bg-coral hover:text-[#3c3c3c] rounded-full text-sm">
            Product Reviews
          </Button>
        </div>
        
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
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
        </div>
        
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