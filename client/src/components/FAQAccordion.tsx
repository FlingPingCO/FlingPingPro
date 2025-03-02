import { useState } from "react";
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
  const renderAnswerContent = (answer: string, isRefundQuestion: boolean) => {
    // Special handling for refund question
    if (isRefundQuestion) {
      return (
        <div className="text-left">
          Due to the limited nature of Founding Flinger spots and the lifetime access they provide, memberships are non-refundable. Please see our Terms of Service for complete details.
        </div>
      );
    }
    
    if (answer.includes('Ping Pin (PP)')) {
      return (
        <div className="text-left">
          Your Ping Pin (<span className="text-coral">PP</span>) uses end-to-end encryption to create anonymous connections between users. We never store names, phone numbers, or personal details—just randomized IDs that allow for anonymous notifications if necessary.
        </div>
      );
    }
    
    // For answers containing FlingPing.co (marked with span tags)
    if (answer.includes('className="inline-flex"')) {
      return (
        <div className="text-left" dangerouslySetInnerHTML={{ __html: answer
          .replace(/className=/g, 'class=')
          .replace(/text-teal/g, 'text-primary')
          .replace(/text-coral/g, 'text-secondary')
        }} />
      );
    }
    
    // For answers with text-align: left style
    if (answer.includes('style=\'text-align: left;\'')) {
      return (
        <div className="text-left" dangerouslySetInnerHTML={{ __html: answer
          .replace(/style='text-align: left;'/g, '')
          .replace(/<div>/g, '')
          .replace(/<\/div>/g, '')
        }} />
      );
    }
    
    // For regular text answers
    return <div className="text-left">{answer}</div>;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => {
          const isRefundQuestion = item.question.toLowerCase().includes("refund");
          return (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-teal">
              <AccordionTrigger className="text-2xl font-medium py-4 text-teal hover:text-coral">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sand px-4 pb-4 text-lg text-left">
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
