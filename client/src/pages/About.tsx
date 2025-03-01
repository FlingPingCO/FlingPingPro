import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="py-8 sm:py-12 md:py-16 bg-dark">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-center mb-8 sm:mb-12">About <span className="text-teal">FlingPing<span className="text-coral">.co</span></span>.</h1>
        
        <div className="flex flex-col md:flex-row items-center mb-12 sm:mb-16 md:mb-20">
          <div className="md:w-1/2 md:pr-8 lg:pr-12 order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl mb-6">Our Mission</h2>
            <p className="text-lg mb-4">We're on a mission to revolutionize how people approach sexual health in a digital age. By combining technology with responsibility, we're creating a safer, smarter community.</p>
            <p className="text-lg mb-4"><span className="text-teal">FlingPing<span className="text-coral">.co</span></span> was born from a simple idea: what if we could make responsible sexual health as easy as sending a text? No awkward conversations, no forgotten names, no guesswork—just peace of mind.</p>
            <p className="text-lg">Our team of health experts and tech innovators came together to build more than just an app—we're building what we call "digital herd immunity" that makes everyone safer.</p>
          </div>
          <div className="md:w-1/2 mb-12 md:mb-0 order-1 md:order-2">
            <img 
              src="/images/doctor.png" 
              alt="Doctor illustration" 
              className="rounded-xl w-full max-w-md mx-auto md:max-w-full"
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center mb-12 sm:mb-16 md:mb-20">
          <div className="md:w-1/2 mb-8 sm:mb-10 md:mb-0">
            <img 
              src="/images/phones-pairing.png" 
              alt="Connected phones concept" 
              className="rounded-xl w-full max-w-md mx-auto md:max-w-full"
            />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl md:text-4xl mb-6">Our Approach</h2>
            <p className="text-lg mb-4">The statistics don't lie: sexually transmitted infections are on the rise, and the healthcare costs exceed $16 billion annually in the US alone. But beyond the numbers are real people facing real challenges.</p>
            <p className="text-lg mb-4">We believe technology should work for you, not against you. That's why <span className="text-teal">FlingPing<span className="text-coral">.co</span></span> uses anonymous, secure connections to keep you informed without compromising your privacy or dignity.</p>
            <p className="text-lg">Our playful approach to a serious topic makes taking care of your sexual health less intimidating and more empowering. Because being responsible shouldn't come with an awkward side of regret.</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 lg:pr-12 order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl mb-6">Join the Movement</h2>
            <p className="text-lg mb-4"><span className="text-teal">FlingPing<span className="text-coral">.co</span></span> isn't just about technology—it's about creating a cultural shift where being proactive about sexual health becomes the norm.</p>
            <p className="text-lg mb-4">As a Founding Flinger, you're not just getting lifetime access to an app; you're becoming part of a community that values both pleasure and responsibility.</p>
            <p className="text-lg mb-8">Ready to flip the script on sexual health? Join us and be part of the solution.</p>
            
            <Link href="/#founding-flinger">
              <Button className="btn-primary font-poppins font-medium text-center px-8 py-3 rounded-full text-lg text-[#3c3c3c]">
                Become a Founding Flinger
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2 mb-12 md:mb-0 order-1 md:order-2">
            <img 
              src="/images/friends-high-five.png" 
              alt="Friends high fiving" 
              className="rounded-xl w-full max-w-md mx-auto md:max-w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
