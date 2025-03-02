import { useState } from "react";
import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqItems: FAQItem[];
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqItems }) => {
  // Add custom CSS to force left alignment on FAQ content
  useEffect(() => {
    // Create a style element
    const styleEl = document.createElement('style');
    // Set the inner HTML with CSS rules that target accordion content
    styleEl.innerHTML = `
      .faq-content > div {
        text-align: left !important;
        padding-left: 0 !important;
        color: #F4E9D9 !important;
      }
      [data-state="open"] ~ * {
        text-align: left !important;
      }
    `;
    // Append the style element to the document head
    document.head.appendChild(styleEl);
    
    // Cleanup function to remove the style element when component unmounts
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  const renderAnswerContent = (answer: string, isRefundQuestion: boolean) => {
    // Special handling for refund question
    if (isRefundQuestion) {
      return (
        <div className="text-left text-sand">
          Due to the limited nature of Founding Flinger spots and the lifetime access they provide, memberships are non-refundable. Please see our Terms of Service for complete details.
        </div>
      );
    }
    
    if (answer.includes('Ping Pin (PP)')) {
      return (
        <div className="text-left text-sand">
          Your Ping Pin (<span className="text-coral">PP</span>) uses end-to-end encryption to create anonymous connections between users. We never store names, phone numbers, or personal details—just randomized IDs that allow for anonymous notifications if necessary.
        </div>
      );
    }
    
    // For answers containing FlingPing.co (marked with span tags)
    if (answer.includes('className="inline-flex"')) {
      // For answers with inline components, convert but maintain styling
      return (
        <div className="text-left text-sand" dangerouslySetInnerHTML={{ __html: answer
          .replace(/className=/g, 'class=')
          // Ensure proper color classes for the brand name
          .replace(/text-teal/g, 'text-[#0AD3B3]')
          .replace(/text-coral/g, 'text-[#FF695E]')
        }} />
      );
    }
    
    // For answers with text-align: left style
    if (answer.includes('style=\'text-align: left;\'')) {
      return (
        <div className="text-left text-sand" dangerouslySetInnerHTML={{ __html: answer
          .replace(/style='text-align: left;'/g, '')
          .replace(/<div>/g, '')
          .replace(/<\/div>/g, '')
        }} />
      );
    }
    
    // For regular text answers
    return <div className="text-left text-sand">{answer}</div>;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => {
          const isRefundQuestion = item.question.toLowerCase().includes("refund");
          return (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-teal">
              <AccordionTrigger className="text-2xl font-medium py-4 text-teal hover:text-coral text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-6 text-lg text-left faq-content" style={{ color: '#F4E9D9' }}>
                {renderAnswerContent(item.answer, isRefundQuestion)}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default FAQAccordion;
