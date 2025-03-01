import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: { name: string; email: string } | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, formData }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const checkoutMutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      const response = await apiRequest("POST", "/api/create-checkout-session", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      setIsProcessing(false);
      toast({
        title: "Payment Error",
        description: error.message || "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProceedToPayment = () => {
    if (!formData) return;
    
    setIsProcessing(true);
    checkoutMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark border-2 border-coral text-sand sm:max-w-md p-4 sm:p-6">
        <DialogHeader className="space-y-1 sm:space-y-2 pb-0 sm:pb-1">
          <DialogTitle className="text-xl sm:text-2xl text-center">Become a Founding Flinger</DialogTitle>
          <DialogDescription className="text-sand text-center text-sm sm:text-base">
            You're about to secure lifetime access to FlingPing.co for just $99.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2 sm:py-4">
          <div className="bg-[#3C3C3C] border border-coral rounded-lg p-3 sm:p-4 mb-4">
            <h4 className="text-base sm:text-lg text-teal mb-1 sm:mb-2">What you'll get:</h4>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
              <li className="flex items-start">
                <span className="text-coral mr-2">✓</span>
                <span>Lifetime access to all core features</span>
              </li>
              <li className="flex items-start">
                <span className="text-coral mr-2">✓</span>
                <span>Early app preview and beta testing</span>
              </li>
              <li className="flex items-start">
                <span className="text-coral mr-2">✓</span>
                <span>Help shape the future of sexual health technology</span>
              </li>
              <li className="flex items-start">
                <span className="text-coral mr-2">✓</span>
                <span>Exclusive Founding Flinger merch</span>
              </li>
            </ul>
          </div>
          
          <div className="text-center mb-3 sm:mb-4">
            <p className="text-lg sm:text-xl font-bold">Total: <span className="text-yellow">$99</span></p>
            <p className="text-xs sm:text-sm text-sand opacity-70">One-time payment, no subscriptions or hidden fees</p>
          </div>
          
          <div className="flex space-x-2 sm:space-x-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-coral text-sand hover:bg-coral hover:text-sand text-xs sm:text-sm py-1 sm:py-2 h-auto"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleProceedToPayment}
              className="flex-1 btn-primary text-xs sm:text-sm py-1 sm:py-2 h-auto"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span className="whitespace-nowrap">Processing...</span>
                </>
              ) : (
                <span className="whitespace-nowrap">Proceed to Payment</span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
