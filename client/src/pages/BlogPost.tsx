import { useState, useEffect } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { getThemedBlogImage, getAlternativeBlogImage } from "@/lib/imageService";

// Interface for blog post data
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl?: string;
  imageKeywords?: string;
  readTime: string;
  isAffiliate: boolean;
  content?: string;
}

const BlogPost = () => {
  const [match, params] = useRoute("/blog/:id");
  const [, setLocation] = useLocation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!params?.id) {
        setLocation("/blog");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/blog-posts/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog post");
        }
        
        const postData = await response.json();
        setPost(postData);
        
        // Fetch related posts
        const allPostsResponse = await fetch('/api/blog-posts');
        if (allPostsResponse.ok) {
          const allPosts = await allPostsResponse.json();
          // Filter out current post and get up to 3 related posts from the same category
          const related = allPosts
            .filter((p: BlogPost) => p.id !== postData.id && p.category === postData.category)
            .slice(0, 3);
          setRelatedPosts(related);
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Unable to load the blog post. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [params?.id, setLocation]);

  // Format content with proper paragraphs
  const formatContent = (content: string) => {
    if (!content) return "";
    // Split by double newlines to get paragraphs
    return content.split('\n\n').map((paragraph, index) => {
      // Check if paragraph is a heading (starts with **)
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        const headingText = paragraph.replace(/\*\*/g, '');
        return <h2 key={index} className="text-2xl text-teal font-semibold mt-8 mb-4">{headingText}</h2>;
      }
      
      // Format paragraph with emphasis tags (using *)
      const formattedText = paragraph.split('*').map((text, i) => 
        i % 2 === 0 ? text : <em key={i} className="text-coral">{text}</em>
      );
      
      return <p key={index} className="mb-5 text-sand leading-relaxed">{formattedText}</p>;
    });
  };

  if (isLoading) {
    return (
      <div className="py-16 bg-background min-h-screen">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sand">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="py-16 bg-background min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 text-coral mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-2xl text-coral mb-4">Oops! Something went wrong</h1>
          <p className="text-sand mb-6">{error || "We couldn't find the blog post you're looking for."}</p>
          <Link href="/blog">
            <Button className="bg-teal text-dark hover:bg-coral">
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Article Header */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/blog" className="self-start">
            <Button variant="ghost" className="text-teal mb-6 pl-0 hover:bg-transparent hover:text-coral">
              ← Back to Blog
            </Button>
          </Link>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-teal/20 text-teal px-3 py-1 rounded-full text-sm">{post.category}</span>
            {post.isAffiliate && (
              <span className="bg-coral/20 text-coral px-3 py-1 rounded-full text-sm">Affiliate</span>
            )}
            <span className="text-sand text-sm">{post.readTime}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-center mb-6 text-teal font-bold leading-tight max-w-4xl">
            {post.title}
          </h1>
          
          <p className="text-xl text-center text-sand mb-8 max-w-3xl">
            {post.excerpt}
          </p>
          
          <p className="text-sand text-sm mb-10">{post.date}</p>
        </div>
        
        {/* Featured Image */}
        <div className="relative w-full max-w-4xl mx-auto mb-12 rounded-xl overflow-hidden">
          <div className="aspect-w-16 aspect-h-9 bg-dark">
            <img 
              src={getThemedBlogImage(post.category, post.imageKeywords)}
              alt={post.title}
              className="w-full h-full object-contain p-6 bg-gradient-to-br from-teal/10 to-coral/10"
              onError={(e) => {
                // If the primary image fails to load, try an alternative
                const target = e.target as HTMLImageElement;
                const alternativeImage = getAlternativeBlogImage(post.category, post.imageKeywords);
                target.src = alternativeImage;
                console.log(`Using alternative featured image for post ${post.id}`);
                
                // Add a second error handler in case the alternative also fails
                target.onerror = () => {
                  target.src = "/illustrations/THought_Bubbles-noBG.png";
                  console.log(`Alternative featured image also failed, using default fallback`);
                  target.onerror = null; // Remove handler to prevent infinite loop
                };
              }}
            />
          </div>
          <div className="absolute inset-0 border-2 border-teal rounded-xl pointer-events-none"></div>
        </div>
        
        {/* Article Content */}
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg prose-invert max-w-none">
            {post.content ? (
              formatContent(post.content)
            ) : (
              <p className="text-sand">Content not available.</p>
            )}
          </div>
          
          {/* Article Footer */}
          <div className="mt-12 border-t-2 border-teal/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-teal font-medium">Published on {post.date}</p>
                <p className="text-sand text-sm">Category: {post.category}</p>
              </div>
              
              <div className="flex gap-4">
                <a 
                  href={`https://twitter.com/intent/tweet?text=Check out this article: ${post.title}&url=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sand hover:text-teal transition-colors"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.049 10.049 0 01-3.128 1.196 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.473c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59"></path>
                  </svg>
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sand hover:text-teal transition-colors"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12"></path>
                  </svg>
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sand hover:text-teal transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl text-teal text-center mb-10">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="bg-background border-2 border-teal rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                  <div className="h-40 bg-dark overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal/10 to-coral/10 z-0"></div>
                    <img 
                      src={getThemedBlogImage(relatedPost.category, relatedPost.imageKeywords)}
                      alt={relatedPost.title}
                      className="w-full h-full object-contain p-2 transition-all duration-500 hover:scale-105 z-10 relative"
                      loading="lazy"
                      onError={(e) => {
                        // Try alternative image for related posts
                        const target = e.target as HTMLImageElement;
                        const alternativeImage = getAlternativeBlogImage(relatedPost.category, relatedPost.imageKeywords);
                        target.src = alternativeImage;
                        console.log(`Using alternative image for related post ${relatedPost.id}`);
                        
                        // Add second error handler for fallback
                        target.onerror = () => {
                          target.src = "/illustrations/THought_Bubbles-noBG.png";
                          console.log(`Alternative image failed for related post ${relatedPost.id}, using default`);
                          target.onerror = null;
                        };
                      }}
                    />
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-coral">{relatedPost.category}</span>
                      <span className="text-xs text-sand">{relatedPost.readTime}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 text-teal line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    
                    <Link href={`/blog/${relatedPost.id}`}>
                      <Button variant="link" className="text-teal p-0 hover:text-coral mt-auto">
                        Read Article →
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Newsletter CTA */}
        <div className="mt-20 bg-dark border-2 border-coral rounded-xl p-8 text-center">
          <h2 className="text-2xl text-teal mb-3">Enjoyed this article?</h2>
          <p className="text-sand mb-5">Subscribe to our newsletter for more insights on sexual health and wellness.</p>
          <Link href="/blog#newsletter">
            <Button className="bg-coral text-[#3c3c3c] hover:bg-yellow hover:text-[#3c3c3c] rounded-full">
              Subscribe to Updates
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;