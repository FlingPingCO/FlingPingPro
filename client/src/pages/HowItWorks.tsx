import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  return (
    <div className="py-16 bg-dark">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl text-center mb-12">How <span className="text-teal">FlingPing<span className="text-coral">.co</span></span> Works</h1>
        
        <div className="max-w-4xl mx-auto mb-16">
          <p className="text-lg text-center mb-8">
            <span className="text-teal">FlingPing<span className="text-coral">.co</span></span> makes staying on top of your sexual health simple, discreet, and even a little fun. 
            Here's how our revolutionary system keeps you protected and informed.
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-coral"></div>
          
          {/* Timeline items */}
          <div className="space-y-24 relative">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 text-right">
                <div className="hidden md:block absolute right-0 top-0 transform translate-x-1/2 w-8 h-8 rounded-full bg-coral border-4 border-dark"></div>
                <h3 className="text-2xl mb-4">Sign Up & Get Your PP</h3>
                <p className="text-lg mb-4">Create your account and receive your unique Ping Pin (PP). It's your key to safe encounters and private notifications.</p>
                <p className="text-lg">Your PP is completely anonymous—we don't need your real name, phone number, or any identifying details that might make things awkward later.</p>
              </div>
              <div className="md:w-1/2 md:pl-12 mt-6 md:mt-0">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Mobile app signup" 
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 md:pl-12">
                <div className="hidden md:block absolute left-0 top-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-coral border-4 border-dark"></div>
                <h3 className="text-2xl mb-4">Pound That PP</h3>
                <p className="text-lg mb-4">Before the fun starts, make sure to pound your PP with your partner's. This secure Bluetooth connection ensures you're both linked anonymously in our system.</p>
                <p className="text-lg">Think of it as the grown-up way to say, "We're all good here." It's responsible, it's easy, and it doesn't kill the mood.</p>
              </div>
              <div className="md:w-1/2 md:pr-12 mt-6 md:mt-0">
                <img 
                  src="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Phone connection" 
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 text-right">
                <div className="hidden md:block absolute right-0 top-0 transform translate-x-1/2 w-8 h-8 rounded-full bg-coral border-4 border-dark"></div>
                <h3 className="text-2xl mb-4">Stay in the Loop</h3>
                <p className="text-lg mb-4">If someone reports an issue later, you'll receive a discreet, anonymous notification. No awkward texts, no uncomfortable conversations—just the information you need to stay healthy.</p>
                <p className="text-lg">Our system maintains privacy while still providing critical information. You'll know what you need to know, when you need to know it.</p>
              </div>
              <div className="md:w-1/2 md:pl-12 mt-6 md:mt-0">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Notification concept" 
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 md:pl-12">
                <div className="hidden md:block absolute left-0 top-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-coral border-4 border-dark"></div>
                <h3 className="text-2xl mb-4">Take Action with Confidence</h3>
                <p className="text-lg mb-4">Armed with information, you can make smart decisions about your health. We provide resources to find testing centers, treatment options, and everything else you need.</p>
                <p className="text-lg">No shame, no blame—just practical next steps to keep you at your healthiest.</p>
              </div>
              <div className="md:w-1/2 md:pr-12 mt-6 md:mt-0">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Health concept" 
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-20">
          <h2 className="text-3xl mb-8">Ready to Flip the Script?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join the 250 Founding Flingers who are revolutionizing sexual health with technology that keeps you informed, empowered, and protected.
          </p>
          <Link href="/#founding-flinger">
            <Button className="btn-primary font-poppins font-medium text-center px-8 py-3 rounded-full text-lg">
              Become a Founding Flinger
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
