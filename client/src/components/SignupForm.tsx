import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PaymentModal from "./PaymentModal";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const SignupForm = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/email-signup", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thanks for signing up!",
        description: "You're on our waiting list. Look out for updates soon!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to sign up. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    setFormData(data);
    
    // Skip the payment modal and directly go to Stripe checkout
    window.location.href = `/api/create-checkout-session?name=${encodeURIComponent(data.name)}&email=${encodeURIComponent(data.email)}`;
    
    // Also register for email updates
    signupMutation.mutate(data);
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="text-center mb-4 sm:mb-6">
          <h4 className="text-teal text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Spots Are Limited!</h4>
          <div className="text-yellow text-base sm:text-lg font-medium">Only <span>250</span> Founding Flinger spots left</div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-grow">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg">Your Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-dark border-2 border-coral text-sand focus:outline-none focus:ring-2 focus:ring-teal text-sm sm:text-base"
                      placeholder="Enter your full name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg">Your Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-dark border-2 border-coral text-sand focus:outline-none focus:ring-2 focus:ring-teal text-sm sm:text-base"
                      placeholder="your.email@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full mt-4 sm:mt-6 bg-coral hover:bg-coral/90 text-[#3c3c3c] font-poppins font-medium text-center px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg shadow-lg border-2 border-coral transition-colors duration-300"
            >
              Secure My Spot for $99
            </Button>
            
            <div className="text-center text-xs sm:text-sm mt-3 sm:mt-4">
              <p className="mb-1 sm:mb-2">Secure payment powered by Stripe</p>
              <div className="flex justify-center space-x-1 sm:space-x-2">
                <svg className="h-4 sm:h-6" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="visa-label">
                  <title id="visa-label">Visa</title>
                  <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000" opacity=".07"/>
                  <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#fff"/>
                  <path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#142688"/>
                </svg>
                <svg className="h-4 sm:h-6" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="mastercard-label">
                  <title id="mastercard-label">Mastercard</title>
                  <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000" opacity=".07"/>
                  <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#fff"/>
                  <circle fill="#EB001B" cx="15" cy="12" r="7"/>
                  <circle fill="#F79E1B" cx="23" cy="12" r="7"/>
                  <path d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z" fill="#FF5F00"/>
                </svg>
                <svg className="h-4 sm:h-6" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="amex-label">
                  <title id="amex-label">American Express</title>
                  <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000" opacity=".07"/>
                  <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#006FCF"/>
                  <path d="M8.971 10.268l.774 1.876H8.203l.768-1.876zm16.075-4.878h-7.965v1.944h7.965v-1.944zm-16.075.386L7.46 7.216h1.02l.336-.691h1.775l.336.691h1.014l-1.51-3.44h-.933zm-1.896 2.41h-1.95v-3.44h1.95s.927-.017 1.36.25c.242.149.51.522.51 1.199 0 .676-.157 1.151-.5 1.407-.343.256-1.37.584-1.37.584zm10.24-2.41h.952v3.44h-1.347l-1.743-2.636v2.636H9.814v-3.44h1.394l1.606 2.442v-2.442zm3.77 3.44h-3.585v-3.44h3.585v.697h-2.383v.697h2.322v.697h-2.322v.697h2.383v.652zm1.288-2.743h.993c.167 0 .265.092.265.23 0 .14-.088.233-.265.233h-.993v-.463zm0 1.353h1.076c.21.015.445.097.445.386 0 .26-.183.421-.513.421h-1.008v-.807zm-.317 1.39h1.339c.315 0 .891-.053 1.172-.403.203-.25.132-.597.058-.723.1-.08.316-.275.316-.7 0-1.454-1.776-1.14-2.195-1.14H20.21v-1.777h7.965v8.76H20.21v-2.44h1.856v-1.577zm9.643-5.311h-7.965v1.944h7.965v-1.944zm-4.295 2.897h-.96v.943h.96s.433.02.433-.472c0-.491-.433-.471-.433-.471zm3.031 4.007c.701.045 1.085-.51 1.085-.51s.04-.344.215-.344c.176 0 .588 0 .588 0s.204.014.204.254c0 .916-1.062 1.14-2.031 1.14-1.462 0-2.031-.38-2.031-2.453 0-1.995.952-2.265 2.11-2.265 1.257 0 1.939.738 1.939 2.103v.201s-.9.017-.97.017h-2.302s-.085 1.857 1.193 1.857zm.025-2.243c-.54 0-1.124.363-1.124 1.202h2.083c0-.862-.436-1.202-1.103-1.202h.144z" fill="#fff"/>
                </svg>
              </div>
            </div>
          </form>
        </Form>
      </div>
      
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        formData={formData}
      />
    </>
  );
};

export default SignupForm;
