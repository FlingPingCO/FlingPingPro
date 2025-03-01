import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SignupForm from "@/components/SignupForm";
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
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {paymentSuccess && (
            <Alert className="mb-8 bg-dark border-teal">
              <CheckCircle2 className="h-4 w-4 text-teal" />
              <AlertTitle>Payment Successful!</AlertTitle>
              <AlertDescription>
                Welcome to the Founding Flingers! You now have lifetime access to FlingPing.co.
              </AlertDescription>
            </Alert>
          )}

          {paymentCancelled && (
            <Alert className="mb-8 bg-dark border-coral">
              <AlertCircle className="h-4 w-4 text-coral" />
              <AlertTitle>Payment Cancelled</AlertTitle>
              <AlertDescription>
                Your payment was not completed. You can try again when you're ready.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Welcome to <span className="text-teal">FlingPing.co</span></h1>
              <h2 className="text-2xl md:text-3xl text-coral mb-6">Flip the Script on Sexual Health.</h2>
              <p className="text-lg mb-8">The First App to Outsmart STDs – Smart, Private, and Empowering.</p>
              <p className="mb-8 text-lg">FlingPing.co is the bold, game-changing app that turns awkward conversations into confidence and empowerment. Say goodbye to uncomfortable "uh-oh" moments and hello to a smarter, safer, and discreet way to stay ahead of your sexual health.</p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="#founding-flinger">
                  <Button variant="outline" className="border-2 border-teal text-teal hover:bg-teal hover:text-[#3c3c3c] transition-all duration-300 font-poppins font-medium text-center px-8 py-3 rounded-full text-lg w-full sm:w-auto">
                    Become a Founding Flinger
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button className="bg-coral text-[#3c3c3c] hover:bg-coral/90 font-poppins font-medium text-center px-8 py-3 rounded-full text-lg w-full sm:w-auto">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <div className="rounded-xl bg-dark border-2 border-teal shadow-2xl w-full p-6 flex flex-col items-center justify-center">
                <div className="text-teal text-5xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl text-center mb-2 text-coral">Secure. Anonymous. Simple.</h3>
                <p className="text-center text-sand mb-4">No awkward conversations or uncomfortable reveals.</p>
                <div className="flex justify-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dark border border-coral text-coral text-lg mr-2">1</div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-coral text-[#3c3c3c] text-lg mr-2">2</div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dark border border-coral text-coral text-lg">3</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why FlingPing Section */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-16">Why <span className="text-teal">FlingPing.co</span>?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-dark border border-coral rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-coral text-4xl mb-4">
                  {feature.icon === "brain" && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {feature.icon === "lock" && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  {feature.icon === "zap" && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {feature.icon === "smile" && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Flinger Offer */}
      <section id="founding-flinger" className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-teal to-coral bg-opacity-20 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl text-center mb-8">Join the <span className="text-teal">FlingPing.co</span> Revolution</h2>
            <h3 className="text-2xl text-center text-yellow mb-12">Founding Flinger Perks</h3>
            
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 md:pr-12">
                <div className="text-center md:text-left">
                  <div className="bg-[#f4e9d9] rounded-3xl p-8 text-left mb-6">
                    <div className="inline-block bg-coral text-[#3c3c3c] text-2xl md:text-3xl font-bold px-6 py-3 rounded-full mb-6">
                      Lifetime Access for $99
                    </div>
                    
                    <h4 className="font-bold text-xl mb-4 text-teal">Limited Time Founding Flinger Offer</h4>
                    
                    <ul className="space-y-4 text-lg text-[#3c3c3c]">
                      <li className="flex items-start">
                        <span className="text-coral mr-2">✓</span>
                        <span>Lifetime Membership - Pay once and unlock a lifetime of <span className="text-teal">Fling<span className="text-coral">.co</span></span>'s core features.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-coral mr-2">✓</span>
                        <span>Be a Founding Flinger - Get exclusive early access and shape <span className="text-teal">Fling<span className="text-coral">.co</span></span> with your feedback.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-coral mr-2">✓</span>
                        <span>Support Innovation - Be part of the movement creating digital herd immunity.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-coral mr-2">✓</span>
                        <span>Limited Time Flinger Swag - Exclusive to founding members only.</span>
                      </li>
                    </ul>
                    
                    <div className="flex items-center justify-center mt-6">
                      <div className="text-2xl font-bold text-coral line-through opacity-75 mr-3">$199</div>
                      <div className="text-2xl font-bold text-teal">$99</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 mt-12 md:mt-0">
                <SignupForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-16">Why Our Early Adopters Love <span className="text-teal">FlingPing.co</span></h2>
          
          <div className="mx-auto max-w-5xl">
            <Carousel
              opts={carouselOptions}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="h-full bg-dark border border-coral rounded-lg p-6 mx-2">
                      <div className="flex items-center mb-4">
                        <div className="text-yellow text-xl">★★★★★</div>
                      </div>
                      <p className="mb-4 italic">"{testimonial.text}"</p>
                      <div className="text-coral">- {testimonial.source}</div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-8 gap-2">
                <CarouselPrevious className="static bg-coral border border-coral text-[#3c3c3c] hover:bg-coral/90 transition-all" />
                <CarouselNext className="static bg-coral border border-coral text-[#3c3c3c] hover:bg-coral/90 transition-all" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-16">Frequently Asked Questions</h2>
          
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
          
          <div className="mt-16 flex justify-center">
            <div className="bg-[#f4e9d9] rounded-full px-8 py-6 max-w-2xl text-center">
              <h3 className="text-teal text-2xl font-bold mb-3">Still have questions?</h3>
              <p className="text-[#3c3c3c] mb-4">We're here to help. Reach out to our team for any questions not covered in our FAQs.</p>
              <Link href="/contact">
                <span className="inline-block bg-coral text-[#3c3c3c] hover:bg-coral/90 transition-all duration-300 font-poppins font-medium text-center px-8 py-3 rounded-full cursor-pointer">
                  Contact Us
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
