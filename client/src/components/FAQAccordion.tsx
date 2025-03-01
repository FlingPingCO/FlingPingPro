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
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-b border-coral">
            <AccordionTrigger className="text-2xl font-medium py-4 text-teal hover:text-coral">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sand px-4 pb-4 text-lg">
              {item.answer.includes('Ping Pin (PP)') ? (
                <>
                  Your Ping Pin (<span className="text-coral">PP</span>) uses end-to-end encryption to create anonymous connections between users. We never store names, phone numbers, or personal details—just randomized IDs that allow for anonymous notifications if necessary.
                </>
              ) : item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQAccordion;
