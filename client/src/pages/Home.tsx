import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import FAQAccordion from "@/components/FAQAccordion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Import illustrations
import peopleCrossingStreet from "@/assets/illustrations/people-crossing-street.gif";
import deliveryDriver from "@/assets/illustrations/delivery-driver.gif";
import womanWalkingDog from "@/assets/illustrations/woman-walking-dog.gif";
import lifestyleDiversePeople from "@/assets/illustrations/lifestyle-diverse-people.gif"; // New diverse people illustration
import womanShopping from "@/assets/illustrations/woman-shopping.png";
import collegeStudents from "@/assets/illustrations/college-students.png";

interface HomeProps {
  paymentSuccess?: boolean;
  paymentCancelled?: boolean;
}

const Home: React.FC<HomeProps> = ({ paymentSuccess, paymentCancelled }) => {
  const { toast } = useToast();

  useEffect(() => {
    if (paymentSuccess) {
      toast({
        title: "Payment Successful!",
        description: "Welcome to the Founding Flingers! You now have lifetime access to FlingPing.co.",
        variant: "default",
      });
    } else if (paymentCancelled) {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was not completed. You can try again when you're ready.",
        variant: "destructive",
      });
    }
  }, [paymentSuccess, paymentCancelled, toast]);

  const testimonials = [
    {
      text: "Finally, a way to stay safe about sex without the cringe convos.",
      source: "Jessica L."
    },
    {
      text: "I feel confident and in control—it's an absolute game changer.",
      source: "Tommy D."
    },
    {
      text: "This is exactly what I needed to take charge of my sexual health.",
      source: "John L."
    },
    {
      text: "Now I won't stress out about not exchanging phone numbers anymore.",
      source: "Nicky P."
    },
    {
      text: "Where was this app years ago? It's made things so much easier.",
      source: "Lisa B."
    },
    {
      text: "Surprisingly simple and discreet—I'm a total convert.",
      source: "Max R."
    },
    {
      text: "It's crazy how something so small can make me feel so much safer.",
      source: "Sarah K."
    }
  ];

  const features = [
    {
      icon: "brain",
      title: "Stay Smart",
      description: "A bold new way to take charge of your sexual health with cutting-edge technology."
    },
    {
      icon: "lock",
      title: "Stay Private",
      description: "Keep your personal life personal with encrypted, anonymous communication. No names, no numbers—just peace of mind."
    },
    {
      icon: "zap",
      title: "Stay Ahead",
      description: "Get instant, discreet notifications if you or a past partner has been exposed. We've got your back."
    },
    {
      icon: "smile",
      title: "Stay Fun",
      description: "Who knew safe sex could be this empowering? Confidence never looked so good."
    }
  ];

  // Carousel options for testimonials
  const carouselOptions = { loop: true };

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          {paymentSuccess && (
            <Alert className="mb-8 bg-background border-teal">
              <CheckCircle2 className="h-4 w-4 text-teal" />
              <AlertTitle>Payment Successful!</AlertTitle>
              <AlertDescription>
                Welcome to the Founding Flingers! You now have lifetime access to <span className="inline-flex"><span className="text-teal">FlingPing</span><span className="text-coral">.co</span></span>.
              </AlertDescription>
            </Alert>
          )}

          {paymentCancelled && (
            <Alert className="mb-8 bg-background border-coral">
              <AlertCircle className="h-4 w-4 text-coral" />
              <AlertTitle>Payment Cancelled</AlertTitle>
              <AlertDescription>
                Your payment was not completed. You can try again when you're ready.
              </AlertDescription>
            </Alert>
          )}

          <div className="w-full text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-[90%] mx-auto"><span className="text-teal">Welcome to <br className="sm:hidden" /><span className="inline-flex">FlingPing<span className="text-coral">.co</span></span>!</span></h1>
          </div>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h2 className="text-2xl md:text-3xl text-coral mb-6">Flip the Script on Sexual Health.</h2>
              <p className="text-lg mb-8">The First App to Outsmart STDs – Smart, Private, and Empowering.</p>
              <p className="mb-8 text-lg"><span className="inline-flex"><span className="text-teal">FlingPing</span><span className="text-coral">.co</span></span> is the bold, game-changing app that turns awkward conversations into confidence and empowerment. Say goodbye to uncomfortable "uh-oh" moments and hello to a smarter, safer, and discreet way to stay ahead of your sexual health.</p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="#founding-flinger">
                  <Button variant="outline" className="border-2 border-coral text-coral hover:bg-coral hover:text-[#3c3c3c] transition-all duration-300 font-poppins font-medium text-center px-8 py-3 rounded-full text-lg w-full sm:w-auto shadow-md" onClick={() => {
                    document.getElementById('founding-flinger')?.scrollIntoView({behavior: 'smooth'});
                  }}>
                    Become a Founding Flinger
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button className="bg-teal text-[#3c3c3c] hover:bg-teal/90 hover:text-[#3c3c3c] transition-all duration-300 font-poppins font-medium text-center px-8 py-3 rounded-full text-lg w-full sm:w-auto shadow-md">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
              <img src={lifestyleDiversePeople} alt="Diverse friends high fiving" className="h-[240px] md:h-[300px] lg:h-[360px] object-contain mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Why FlingPing Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-12">Why <span className="inline-flex"><span className="text-teal">FlingPing</span><span className="text-coral">.co</span></span>?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background border-2 border-teal rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
              <div className="text-teal text-4xl mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Stay Private</h3>
              <p className="text-center">Keep your personal life personal with encrypted, anonymous communication. No names, no numbers—just peace of mind.</p>
            </div>
            
            <div className="bg-background border-2 border-teal rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
              <div className="text-teal text-4xl mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Stay Ahead</h3>
              <p className="text-center">Get instant, discreet notifications if you or a past partner has been exposed. We've got your back.</p>
            </div>
            
            <div className="bg-background border-2 border-teal rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
              <div className="text-teal text-4xl mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Stay Smart</h3>
              <p className="text-center">A bold new way to take charge of your sexual health with cutting-edge technology and evidence-based insights.</p>
            </div>
            
            <div className="bg-background border-2 border-teal rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
              <div className="text-teal text-4xl mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Stay Fun</h3>
              <p className="text-center">Who knew safe sex could be this empowering? Confidence never looked so good.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-8 text-coral">Why Our Early Adopters Love <span className="inline-flex"><span className="text-teal">FlingPing</span><span className="text-coral">.co</span></span>?</h2>
          
          <div className="flex justify-center mb-12">
            {/* Image removed */}
          </div>
          
          <div className="mx-auto max-w-6xl">
            <Carousel className="w-full" opts={carouselOptions}>
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/3">
                    <div className="bg-background border-2 border-coral rounded-xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col h-full mx-2">
                      <div className="flex items-center justify-center mb-4">
                        <div className="text-yellow text-xl">★★★★★</div>
                      </div>
                      <p className="mb-4 italic text-center flex-grow text-sand">"{testimonial.text}"</p>
                      <div className="text-teal text-center">- {testimonial.source}</div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-6 space-x-4">
                <CarouselPrevious className="relative left-0 right-0 top-0 h-8 w-8 border-coral text-coral hover:bg-coral hover:text-[#3c3c3c]" />
                <CarouselNext className="relative left-0 right-0 top-0 h-8 w-8 border-coral text-coral hover:bg-coral hover:text-[#3c3c3c]" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>
      
      {/* Founding Flinger Offer */}
      <section id="founding-flinger" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 border-2 border-teal shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              <div className="bg-[#f4e9d9] rounded-3xl p-4 sm:p-6 md:p-8 shadow-md flex flex-col h-full">
                <div className="flex justify-center mb-6">
                  <div className="bg-coral text-[#3c3c3c] font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-full whitespace-nowrap shadow-sm text-base sm:text-xl md:text-2xl text-center">
                    Lifetime Access for $99
                  </div>
                </div>
                
                <h4 className="font-bold text-xl mb-4 text-teal text-center">Limited Time Founding Flinger Offer</h4>
                
                <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-[#3c3c3c] flex-grow pl-3 sm:pl-6 pr-2 sm:pr-4">
                  <li>
                    <div className="flex items-start">
                      <span className="text-coral mr-2 flex-shrink-0 text-lg font-bold">✓</span>
                      <div>
                        <span className="font-medium">Lifetime Membership:</span> Pay once and unlock a lifetime of <span className="inline-flex"><span className="text-teal">FlingPing</span><span className="text-coral">.co</span></span>'s core features.
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-start">
                      <span className="text-coral mr-2 flex-shrink-0 text-lg font-bold">✓</span>
                      <div>
                        <span className="font-medium">Be a Founding Flinger:</span> Get exclusive early access and shape <span className="inline-flex"><span className="text-teal">FlingPing</span><span className="text-coral">.co</span></span> with your feedback.
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-start">
                      <span className="text-coral mr-2 flex-shrink-0 text-lg font-bold">✓</span>
                      <div>
                        <span className="font-medium">Support Innovation:</span> Be part of the movement creating digital heard awareness.
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-start">
                      <span className="text-coral mr-2 flex-shrink-0 text-lg font-bold">✓</span>
                      <div>
                        <span className="font-medium">Limited Time Flinger Swag:</span> Exclusive to founding members only.
                      </div>
                    </div>
                  </li>
                </ul>
                
                <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6">
                  <div className="text-xl sm:text-2xl font-bold text-coral line-through opacity-75">$199</div>
                  <div className="text-xl sm:text-2xl font-bold text-teal">$99</div>
                </div>
              </div>
              
              <div className="bg-background rounded-3xl border-2 border-coral p-4 sm:p-6 md:p-8 shadow-md flex flex-col justify-center h-full">
                {/* Form Header */}
                <div className="mb-5 text-center">
                  <h3 className="text-teal text-xl sm:text-2xl font-bold mb-2">Spots Are Limited!</h3>
                  <p className="text-yellow text-base sm:text-lg">Only 250 Founding Flinger spots left</p>
                </div>
                
                {/* Custom Form with Systeme.io Integration */}
                <div className="w-full mx-auto mb-4">
                  <div className="bg-sand rounded-lg p-5 sm:p-6">
                    <form action="https://1903-brad.systeme.io/42eeb962" method="post" target="_blank" className="space-y-5">
                      <div>
                        <input 
                          type="text" 
                          name="name" 
                          placeholder="Full name*" 
                          required
                          className="w-full px-4 py-3 border-2 border-coral rounded-lg bg-white text-dark focus:outline-none focus:ring-2 focus:ring-teal"
                        />
                      </div>
                      
                      <div>
                        <input 
                          type="email" 
                          name="email" 
                          placeholder="Email address*" 
                          required
                          className="w-full px-4 py-3 border-2 border-coral rounded-lg bg-white text-dark focus:outline-none focus:ring-2 focus:ring-teal"
                        />
                      </div>
                      
                      <div className="pt-3">
                        <button 
                          type="submit"
                          className="w-full bg-teal hover:bg-yellow text-dark font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md text-lg"
                        >
                          Secure My Spot for $99
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                
                {/* Secure Payment Notice */}
                <div className="text-center mt-2">
                  <p className="text-sm text-gray-400 mb-2">Secure payment powered by Stripe</p>
                  <div className="flex justify-center space-x-3">
                    <img src="https://cdn.systeme.io/img/payment/visa.svg" alt="Visa" className="h-5" />
                    <img src="https://cdn.systeme.io/img/payment/mastercard.svg" alt="Mastercard" className="h-5" />
                    <img src="https://cdn.systeme.io/img/payment/amex.svg" alt="American Express" className="h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="flex justify-center mb-12">
            {/* Image removed */}
          </div>
          
          <FAQAccordion 
            faqItems={[
              {
                question: "What is FlingPing.co?",
                answer: "FlingPing.co is your bold, secure partner in smarter sexual health. Designed to empower you with tools to stay informed and in control, it reimagines how technology can keep you ahead of the curve."
              },
              {
                question: "Who are the Flingers?",
                answer: "Flingers are the bold trailblazers redefining what it means to take control, stay informed, and outsmart STDs. Together, they're shaping a smarter, healthier future—one fling or one ping at a time."
              },
              {
                question: "How does Lifetime Access work?",
                answer: "Pay $99 once and you're in for life—no recurring fees, just ongoing innovations. Lifetime membership covers all core features of the app and does not expire."
              },
              {
                question: "What happens after I sign up?",
                answer: "You'll receive email updates on development milestones, sneak peeks, and opportunities to shape the app's future. Founding Flingers will also receive exclusive swag as a thank-you for joining the revolution."
              },
              {
                question: "How does the Ping Pin protect my privacy?",
                answer: "Your Ping Pin (PP) uses end-to-end encryption to create anonymous connections between users. We never store names, phone numbers, or personal details—just randomized IDs that allow for anonymous notifications if necessary."
              }
            ]}
          />
          
          <div className="mt-12 sm:mt-16 flex justify-center px-4">
            <div className="rounded-xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 max-w-2xl text-center border-2 border-teal">
              <h3 className="text-coral text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Still have questions?</h3>
              <p className="mb-6 font-sans">We're here to help. Reach out to our team for any questions not covered in our FAQs.</p>
              <div className="flex justify-center">
                <Link href="/contact">
                  <Button variant="outline" className="border-2 border-teal text-teal hover:bg-teal hover:text-[#3c3c3c] transition-all duration-300 font-sans text-center px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base shadow-sm">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
