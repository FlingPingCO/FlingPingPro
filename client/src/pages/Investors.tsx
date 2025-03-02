import { Button } from "@/components/ui/button";

const Investors = () => {
  return (
    <div className="py-16 bg-dark">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl text-center mb-8 text-teal">Be Part of the Next Big Innovation in Digital Sexual Health</h1>
        
        <div className="max-w-3xl mx-auto mb-16">
          <p className="text-lg text-center mb-6 text-white">
            STDs cost the U.S. healthcare system <span className="text-yellow font-bold">$16 billion annually</span>, and that number is rising. <span className="text-teal">Fling</span><span className="text-coral">Ping</span>.co is stepping in with a <span className="text-blue">first-to-market</span>, anonymous notification system that protects users while reshaping how we handle sexual health.
          </p>
          
          <p className="text-lg text-center mb-6 text-white">
            Early investors have the chance to get in on the ground floor of a scalable, high-growth opportunity. We're not just creating an app—we're building a movement.
          </p>
        </div>
        
        <div className="bg-dark border-2 border-teal rounded-xl p-8 md:p-10 mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl mb-8 text-coral">Why Invest?</h2>
          <ul className="space-y-5">
            <li className="flex items-start">
              <span className="text-coral mr-3 text-xl">•</span>
              <span className="text-lg">
                Projected <span className="text-yellow font-bold">$30M annual revenue</span> within 3 years
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-coral mr-3 text-xl">•</span>
              <span className="text-lg">
                Massive market demand for <span className="text-yellow">privacy-focused health solutions</span>
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-coral mr-3 text-xl">•</span>
              <span className="text-lg">
                Strategic partnerships in progress with healthcare & dating platforms
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-coral mr-3 text-xl">•</span>
              <span className="text-lg">
                Anonymized data insights—high-value for research & public health sectors
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-coral mr-3 text-xl">•</span>
              <span className="text-lg">
                <span className="text-yellow font-bold">Limited early investment spots available</span>
              </span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-r from-teal to-coral bg-opacity-20 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl mb-6 text-coral">Let's Talk About Your ROI</h2>
          
          <Button 
            onClick={() => window.location.href = "mailto:investments@flingping.co"}
            className="font-poppins font-medium text-center px-8 py-3 rounded-full text-lg mt-4 mb-4 hover:bg-opacity-90 transition-all bg-transparent border-2 border-coral text-coral"
          >
            Claim Your Stake in <span className="text-teal">Fling</span><span className="text-coral">Ping</span>.co
          </Button>
          
          <p className="mt-4 text-lg">
            investments@flingping.co
          </p>
        </div>
      </div>
    </div>
  );
};

export default Investors;
