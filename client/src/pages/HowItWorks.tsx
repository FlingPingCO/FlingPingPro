import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl text-center mb-12"><span className="text-coral">How</span> <span className="text-teal">FlingPing<span className="text-coral">.co</span></span> <span className="text-coral">works?</span></h1>
        
        <div className="max-w-4xl mx-auto mb-16">
          <p className="text-lg text-center mb-8">
            <span className="text-teal">FlingPing<span className="text-coral">.co</span></span> makes staying on top of your sexual health simple, discreet, and even a little fun. 
            Here's how our revolutionary system keeps you protected and informed.
          </p>
        </div>
        
        <div className="relative">
          
          {/* Timeline items */}
          <div className="space-y-24 relative">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 text-right">
                <h3 className="text-2xl mb-4"><span className="text-coral">Sign Up</span> & <span className="text-coral">Get Your PP</span></h3>
                <p className="text-lg mb-4">Create your account and receive your unique Ping Pin (PP). It's your key to safe encounters and private notifications.</p>
                <p className="text-lg">Your PP is completely anonymous—we don't need your real name, phone number, or any identifying details that might make things awkward later.</p>
              </div>
              <div className="md:w-1/2 md:pl-12 mt-6 md:mt-0">
                <img 
                  src="/attached_assets/sign-up-form Background Removed.png" 
                  alt="Mobile sign-up form for creating an account and getting a Ping Pin (PP)" 
                  className="rounded-xl w-full max-w-sm mx-auto"
                />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 md:pl-12">
                <h3 className="text-2xl mb-4"><span className="text-coral">Pound</span> That <span className="text-coral">PP</span></h3>
                <p className="text-lg mb-4">Before the fun starts, make sure to pound your PP with your partner's. This secure Bluetooth connection ensures you're both linked anonymously in our system.</p>
                <p className="text-lg">Think of it as the grown-up way to say, "We're all good here." It's responsible, it's easy, and it doesn't kill the mood.</p>
              </div>
              <div className="md:w-1/2 md:pr-12 mt-6 md:mt-0">
                <img 
                  src="/attached_assets/wifi-signal-in-two-phones-pairing Background Removed.png" 
                  alt="Two phones connecting securely via Bluetooth, representing the PP pairing process" 
                  className="rounded-xl w-full max-w-sm mx-auto"
                />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 text-right">
                <h3 className="text-2xl mb-4">Stay In The Loop</h3>
                <p className="text-lg mb-4">If someone reports an issue later, you'll receive a discreet, anonymous notification. No awkward texts, no uncomfortable conversations—just the information you need to stay healthy.</p>
                <p className="text-lg mb-4">But here's the real kicker: it's not just your flings being tracked—it's their flings too. Because let's be real, STDs don't stop at one connection. If a previous partner of your fling has something that could now affect you, you'll get the heads-up before it becomes your problem.</p>
                <p className="text-lg">Our system keeps things private while still keeping you informed. You'll know what you need to know, when you need to know it—without the stress, the shame, or the guesswork.</p>
              </div>
              <div className="md:w-1/2 md:pl-12 mt-6 md:mt-0">
                <img 
                  src="/attached_assets/THought_Bubbles-noBG.png" 
                  alt="Colorful thought bubbles in teal, blue, coral and yellow representing anonymous communication" 
                  className="rounded-xl w-full max-w-sm mx-auto"
                />
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 md:pl-12">
                <h3 className="text-2xl mb-4">Take Action With Confidence</h3>
                <p className="text-lg mb-4">Armed with information, you can make smart decisions about your health. We provide resources to find testing centers, treatment options, and everything else you need.</p>
                <p className="text-lg">No shame, no blame—just practical next steps to keep you at your healthiest.</p>
              </div>
              <div className="md:w-1/2 md:pr-12 mt-6 md:mt-0">
                <img 
                  src="/attached_assets/no-background--someone-exiting-a-door.gif" 
                  alt="Person confidently exiting through a doorway, representing taking action with health information" 
                  className="rounded-xl w-full max-w-sm mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* What is your PP section */}
        <div className="max-w-4xl mx-auto my-20 px-4">
          <div className="bg-background border-2 border-coral rounded-xl p-6 md:p-8 shadow-xl">
            <h3 className="text-2xl mb-6 text-center text-teal">What is your <span className="text-coral">PP</span>, that's embarrassing!?</h3>
            <p className="text-lg">
              Your <span className="text-coral">PP</span> or Ping Pin is like that one sock that always disappears in the laundry—except instead of getting lost, it keeps you from being found. It's your anonymous, encrypted, and oh-so-clever way to stay in the loop without handing out your digits like a free sample at the grocery store. Go pound it!
            </p>
          </div>
        </div>
        
        <div className="text-center mt-20">
          <h2 className="text-3xl mb-8">Ready to Flip the Script?</h2>
          
          <div className="flex justify-center mb-8">
            <img 
              src="/attached_assets/Friends_NoBG.png" 
              alt="Diverse group of friends celebrating with high-fives, representing the Founding Flinger community" 
              className="h-[200px] md:h-[240px] object-contain mx-auto"
            />
          </div>
          
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join the 250 Founding Flingers who are revolutionizing sexual health with technology that keeps you informed, empowered, and protected.
          </p>
          <Link href="/#founding-flinger">
            <Button className="btn-primary font-poppins font-medium text-center px-8 py-3 rounded-full text-lg text-[#3c3c3c]">
              Become a Founding Flinger
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
