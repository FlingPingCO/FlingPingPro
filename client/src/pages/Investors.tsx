import { Button } from "@/components/ui/button";

const Investors = () => {
  return (
    <div className="py-16 bg-dark">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl text-center mb-12">Investor Information</h1>
        
        <div className="max-w-4xl mx-auto mb-16">
          <p className="text-lg text-center mb-8">
            FlingPing.co represents a unique opportunity in the digital health space, 
            addressing a $16 billion market with innovative technology and multiple revenue streams.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-dark border-2 border-teal rounded-xl p-8">
            <h2 className="text-2xl mb-6">The Market Opportunity</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-coral mr-3 text-xl">•</span>
                <span className="text-lg">
                  <span className="text-yellow font-bold">$16 Billion</span> annual healthcare cost related to STIs in the US alone
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-coral mr-3 text-xl">•</span>
                <span className="text-lg">
                  <span className="text-yellow font-bold">20 million</span> new STI cases reported each year
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-coral mr-3 text-xl">•</span>
                <span className="text-lg">
                  <span className="text-yellow font-bold">50%</span> of new STIs occur in people aged 15-24
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-coral mr-3 text-xl">•</span>
                <span className="text-lg">
                  <span className="text-yellow font-bold">Growing demand</span> for digital health solutions, especially those focused on privacy
                </span>
              </li>
            </ul>
          </div>
          
          <div className="bg-dark border-2 border-teal rounded-xl p-8">
            <h2 className="text-2xl mb-6">Our Revenue Model</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-coral mr-3 text-xl">•</span>
                <span className="text-lg">
                  <span className="text-primary font-bold">Premium Subscriptions:</span> Tiered membership model with enhanced features
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-coral mr-3 text-xl">•</span>
                <span className="text-lg">
                  <span className="text-primary font-bold">Founding Flinger Lifetime Memberships:</span> Early adopter revenue with $99 one-time payments
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-coral mr-3 text-xl">•</span>
                <span className="text-lg">
                  <span className="text-primary font-bold">Partnerships:</span> Collaborations with healthcare providers and testing facilities
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-coral mr-3 text-xl">•</span>
                <span className="text-lg">
                  <span className="text-primary font-bold">Anonymized Data Insights:</span> Aggregated, anonymized health trends for research organizations
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-dark border-2 border-coral rounded-xl p-8 mb-20">
          <h2 className="text-2xl mb-6">Our Competitive Advantage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl text-yellow mb-4">Technology</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-coral mr-2">✓</span>
                  <span>Proprietary anonymous Bluetooth pairing system</span>
                </li>
                <li className="flex items-start">
                  <span className="text-coral mr-2">✓</span>
                  <span>End-to-end encryption for maximum privacy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-coral mr-2">✓</span>
                  <span>No personal data collection or storage</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl text-yellow mb-4">Market Position</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-coral mr-2">✓</span>
                  <span>First-mover advantage in digital STI notification</span>
                </li>
                <li className="flex items-start">
                  <span className="text-coral mr-2">✓</span>
                  <span>Unique brand voice that destigmatizes sexual health</span>
                </li>
                <li className="flex items-start">
                  <span className="text-coral mr-2">✓</span>
                  <span>Strong appeal to privacy-conscious younger demographics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-teal to-coral bg-opacity-20 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl mb-6">Interested in Investing?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            We're currently seeking strategic partners and investors who share our vision for transforming sexual health through technology. 
            For investment inquiries, please contact us directly.
          </p>
          
          <Button 
            onClick={() => window.location.href = "mailto:investments@flingping.co"}
            className="btn-primary font-poppins font-medium text-center px-8 py-3 rounded-full text-lg"
          >
            Contact Our Investment Team
          </Button>
          
          <p className="mt-4 text-sm">
            investments@flingping.co
          </p>
        </div>
      </div>
    </div>
  );
};

export default Investors;
