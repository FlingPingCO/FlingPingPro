import { useState, useEffect } from 'react';
import { 
  illustrations, 
  IllustrationCategory, 
  getIllustrationsByCategory, 
  searchIllustrations 
} from '@/lib/illustrationLibrary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

const CATEGORIES: IllustrationCategory[] = [
  'People',
  'Health',
  'Communication',
  'Technology',
  'Privacy',
  'Community',
  'Relationships',
  'Lifestyle'
];

export default function IllustrationLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IllustrationCategory | 'All'>('All');
  const [filteredIllustrations, setFilteredIllustrations] = useState(illustrations);
  const [copied, setCopied] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Filter illustrations based on search query and selected category
  useEffect(() => {
    let results = illustrations;
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      results = getIllustrationsByCategory(selectedCategory);
    }
    
    // Apply search filter if there's a query
    if (searchQuery.trim()) {
      results = searchIllustrations(searchQuery);
      
      // If a category is selected, further filter the search results
      if (selectedCategory !== 'All') {
        results = results.filter(item => 
          item.category.includes(selectedCategory)
        );
      }
    }
    
    setFilteredIllustrations(results);
  }, [searchQuery, selectedCategory]);
  
  // Handle copying image path
  const handleCopyPath = (src: string) => {
    // Remove the leading slash if it exists
    const imagePath = src.startsWith('/') ? src.substring(1) : src;
    
    navigator.clipboard.writeText(imagePath)
      .then(() => {
        setCopied(src);
        toast({
          title: "Path copied!",
          description: "Image path copied to clipboard",
          variant: "default",
        });
        
        setTimeout(() => setCopied(null), 2000);
      })
      .catch(err => {
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard: " + err,
          variant: "destructive",
        });
      });
  };
  
  return (
    <div className="illustration-library w-full max-w-7xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-coral mb-3">Illustration Library</h1>
        <p className="text-sand max-w-2xl mx-auto">
          Browse our collection of diverse, inclusive health-related illustrations
          for use in your FlingPing.co projects.
        </p>
      </div>
      
      <div className="search-and-filter mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <Label htmlFor="search" className="text-sand mb-2 block">
              Search Illustrations
            </Label>
            <Input
              id="search"
              type="text"
              placeholder="Search by keyword, tag, or description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-dark-background border-sand text-sand"
            />
          </div>
          
          <div className="w-full md:w-1/2">
            <Label className="text-sand mb-2 block">
              Filter by Category
            </Label>
            <Tabs 
              defaultValue="All" 
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as IllustrationCategory | 'All')}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 bg-dark">
                <TabsTrigger value="All" className="text-xs md:text-sm">
                  All
                </TabsTrigger>
                {CATEGORIES.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="text-xs md:text-sm"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Results count */}
      <div className="text-sand mb-4">
        Showing {filteredIllustrations.length} illustration{filteredIllustrations.length !== 1 ? 's' : ''}
      </div>
      
      {/* Illustrations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredIllustrations.length > 0 ? (
          filteredIllustrations.map(illustration => (
            <div 
              key={illustration.id}
              className="bg-dark rounded-xl p-4 border border-dark hover:border-teal transition-all flex flex-col"
            >
              <div className="relative aspect-square bg-[#1a1a1a] rounded-lg overflow-hidden flex items-center justify-center mb-3 p-2">
                <img 
                  src={illustration.src} 
                  alt={illustration.alt}
                  className="object-contain max-h-full max-w-full"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="text-teal text-sm font-medium mb-1">
                  {illustration.alt}
                </h3>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {illustration.category.map(cat => (
                    <span 
                      key={cat} 
                      className="text-xs bg-coral/10 text-coral px-2 py-0.5 rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {illustration.tags.slice(0, 4).map(tag => (
                    <span 
                      key={tag} 
                      className="text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {illustration.tags.length > 4 && (
                    <span className="text-xs text-sand">+{illustration.tags.length - 4} more</span>
                  )}
                </div>
              </div>
              
              <Button
                onClick={() => handleCopyPath(illustration.src)}
                variant="outline"
                className={`w-full mt-auto ${copied === illustration.src ? 'bg-teal text-background' : 'text-teal'}`}
                size="sm"
              >
                {copied === illustration.src ? 'Copied!' : 'Copy Path'}
              </Button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-sand mb-4">No illustrations found.</p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              variant="outline"
              className="text-teal"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}