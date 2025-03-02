import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. We'll get back to you soon!",
      });
      form.reset();
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // Send to existing backend
    contactMutation.mutate(data);
    
    // Pipedream webhook integration - ENABLED with actual webhook URL
    
    try {
      // Since we're getting errors with the response JSON, let's create our own personalized message
      fetch("https://eodj9vlvbo65l1i.m.pipedream.net", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          form_type: "contact_message" // Adding form type to differentiate in Pipedream
        }),
      })
      .then(response => {
        console.log("Pipedream raw response:", response);
        
        // Instead of waiting for the Pipedream response, show our own personalized message
        setTimeout(() => {
          toast({
            title: "From FlingPing.co",
            description: `Thank you, ${data.name}! FlingPing.co is happy to have you join the fight for herd awareness. We'll be in touch soon.`,
            duration: 6000, // Show the toast for a bit longer
          });
        }, 1500); // Small delay so it appears after the initial toast
        
        // Still try to get the response body if possible
        return response.text().catch(e => {
          console.log("Could not parse response text:", e);
          return null;
        });
      })
      .then(responseText => {
        if (responseText) {
          console.log("Pipedream response text:", responseText);
          try {
            const responseData = JSON.parse(responseText);
            console.log("Pipedream parsed JSON:", responseData);
          } catch (e) {
            console.log("Could not parse JSON from response text");
          }
        }
      })
      .catch(error => {
        console.error("Pipedream error:", error);
        // Silently fail - the regular form submission will still work
      });
    } catch (error) {
      console.error("Error sending to Pipedream:", error);
      // Continue with the regular form submission flow
    }
    
    // Pipedream returns a personalized message like:
    // {
    //   "status": "success",
    //   "message": `Thank you, ${name}! FlingPing.co is happy to have you join the fight for herd awareness. We'll be in touch soon.`
    // }
    
    // Log that we are sending to Pipedream
    console.log("Sending data to Pipedream webhook", {
      ...data,
      form_type: "contact_message"
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-dark border-2 border-teal rounded-lg p-5 space-y-5 w-full h-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sand">Your Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full px-4 py-2 rounded-lg bg-dark border border-coral text-sand focus:outline-none focus:ring-2 focus:ring-teal"
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
              <FormLabel className="text-sand">Your Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  className="w-full px-4 py-2 rounded-lg bg-dark border border-coral text-sand focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sand">Message</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-dark border border-coral text-sand focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-teal text-[#3c3c3c] hover:bg-teal/90 font-poppins font-medium text-center px-6 py-3 rounded-full text-lg mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
