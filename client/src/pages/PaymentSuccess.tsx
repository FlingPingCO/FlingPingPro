import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark p-4">
      <div className="max-w-lg w-full bg-dark border-2 border-coral rounded-xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <svg 
            className="w-20 h-20 text-coral" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        
        <h1 className="text-3xl md:text-4xl text-coral font-bold mb-4">Payment Successful!</h1>
        
        <p className="text-lg mb-8">
          Congratulations! You're now officially a Founding Flinger. We're thrilled to have you join our community.
        </p>
        
        <div className="bg-dark-lighter rounded-lg p-6 mb-8">
          <h2 className="text-xl text-teal font-medium mb-3">What Happens Next?</h2>
          <ul className="text-left space-y-3">
            <li className="flex items-start">
              <span className="text-teal mr-2 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>We're sending your confirmation email now</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal mr-2 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>You'll be among the first invited to join the platform when it launches</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal mr-2 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>Your lifetime founding membership is now secured</span>
            </li>
          </ul>
        </div>
        
        <Button asChild className="bg-coral hover:bg-coral/90 text-[#3c3c3c] font-medium px-8 py-3 rounded-full shadow-lg border-2 border-coral transition-colors duration-300">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;