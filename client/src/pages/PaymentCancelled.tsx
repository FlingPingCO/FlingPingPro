import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark p-4">
      <div className="max-w-lg w-full bg-dark border-2 border-teal rounded-xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <svg 
            className="w-20 h-20 text-yellow" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        <h1 className="text-3xl md:text-4xl text-coral font-bold mb-4">Payment Cancelled</h1>
        
        <p className="text-lg mb-6">
          Your payment process was cancelled. No worries - your spot is still available!
        </p>
        
        <p className="mb-8">
          If you encountered any issues or have questions about becoming a Founding Flinger, please don't hesitate to contact us at <span className="text-teal">support@flingping.co</span>
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild className="bg-coral hover:bg-coral/90 text-[#3c3c3c] font-medium px-6 py-3 rounded-full shadow-lg border-2 border-coral transition-colors duration-300">
            <Link href="/">Return to Homepage</Link>
          </Button>
          
          <Button asChild className="bg-dark hover:bg-dark-lighter text-sand font-medium px-6 py-3 rounded-full shadow-lg border-2 border-teal transition-colors duration-300">
            <Link href="/#signup">Try Again</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;