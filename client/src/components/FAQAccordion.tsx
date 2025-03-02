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
  const renderAnswerContent = (answer: string) => {
    if (answer.includes('Ping Pin (PP)')) {
      return (
        <>
          Your Ping Pin (<span className="text-coral">PP</span>) uses end-to-end encryption to create anonymous connections between users. We never store names, phone numbers, or personal details—just randomized IDs that allow for anonymous notifications if necessary.
        </>
      );
    }
    
    // For answers containing FlingPing.co (marked with span tags)
    if (answer.includes('className="inline-flex"')) {
      return (
        <div dangerouslySetInnerHTML={{ __html: answer
          .replace(/className=/g, 'class=')
          .replace(/text-teal/g, 'text-primary')
          .replace(/text-coral/g, 'text-secondary')
        }} />
      );
    }
    
    // For regular text answers
    return answer;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-b border-coral">
            <AccordionTrigger className="text-2xl font-medium py-4 text-teal hover:text-coral">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className={`text-sand px-4 pb-4 text-lg ${item.question.toLowerCase().includes("refund") ? "!text-left" : ""}`} style={item.question.toLowerCase().includes("refund") ? {textAlign: "left"} : {}}>
              {renderAnswerContent(item.answer)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQAccordion;
