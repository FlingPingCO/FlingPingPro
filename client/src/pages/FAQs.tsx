import FAQAccordion from "@/components/FAQAccordion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const FAQs = () => {
  const faqItems = [
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
    },
    {
      question: "What if I don't have someone's phone number?",
      answer: "That's the beauty of FlingPing.co—you don't need their number, name, or any personal information. The app creates anonymous connections through Bluetooth pairing, so you can stay informed without the awkward exchanges."
    },
    {
      question: "Is my information really anonymous?",
      answer: "Absolutely. We use end-to-end encryption and never store personally identifiable information. Your privacy is our priority, which is why we've built our entire system around keeping your personal life personal."
    },
    {
      question: "How many Founding Flinger spots are available?",
      answer: "We're limiting Founding Flinger membership to just 250 people. Once these spots are filled, the only way to access FlingPing.co will be through our regular subscription model."
    },
    {
      question: "When will the app be available?",
      answer: "We're currently in development with an anticipated launch in the coming months. Founding Flingers will get early access to the beta version before the public launch."
    },
    {
      question: "What happens if I get a notification?",
      answer: "If you receive a notification, it means someone you've connected with has reported a potential health concern. The app will provide resources for testing locations near you and information about next steps, all while maintaining complete anonymity."
    },
    {
      question: "Can I request a refund for my Founding Flinger membership?",
      answer: "Due to the limited nature of Founding Flinger spots and the lifetime access they provide, memberships are non-refundable. Please see our Terms of Service for complete details."
    },
    {
      question: "How do I contact support?",
      answer: "For any questions or concerns, you can reach our support team at info@flingping.co. We're committed to providing prompt and helpful assistance to all users."
    }
  ];

  return (
    <div className="py-16 bg-dark">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl text-center mb-8">Frequently Asked Questions</h1>
        
        <p className="text-lg text-center mb-12 max-w-2xl mx-auto">
          Get answers to common questions about FlingPing.co, our Founding Flinger program, 
          and how our technology is revolutionizing sexual health communication.
        </p>
        
        <FAQAccordion faqItems={faqItems} />
        
        <div className="text-center mt-20">
          <h2 className="text-2xl mb-6">Still have questions?</h2>
          <p className="text-lg mb-8">
            We're happy to help! Reach out to our team directly and we'll get back to you as soon as possible.
          </p>
          <Link href="/contact">
            <Button className="btn-primary font-poppins font-medium text-center px-8 py-3 rounded-full text-lg">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
