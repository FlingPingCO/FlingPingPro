import { useState } from "react";
import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const Legal = () => {
  return (
    <div className="py-16 bg-dark">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl text-center mb-12">Legal Information</h1>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-center mb-8">
            At <span className="text-teal">FlingPing<span className="text-coral">.co</span></span>, we're committed to transparency and protecting your privacy. 
            Please review our legal policies below to understand how we operate.
          </p>
          
          <div className="mb-16">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="terms" id="terms" className="border-b border-coral">
                <AccordionTrigger className="text-xl font-medium py-4 text-teal hover:text-primary">
                  Terms of Service
                </AccordionTrigger>
                <AccordionContent className="text-sand px-4 pb-4 space-y-4">
                  <h3 className="text-lg font-medium text-primary">1. Acceptance of Terms</h3>
                  <p>
                    By accessing or using <span className="text-teal">FlingPing<span className="text-coral">.co</span></span>, you agree to be bound by these Terms of Service. 
                    If you disagree with any part of the terms, you may not access the service.
                  </p>
                  
                  <h3 className="text-lg font-medium text-primary">2. Description of Service</h3>
                  <p>
                    <span className="text-teal">FlingPing<span className="text-coral">.co</span></span> provides a platform for anonymous health notifications related to sexual 
                    health. The service is provided "as is" and "as available" without warranties of any kind.
                  </p>
                  
                  <h3 className="text-lg font-medium text-primary">3. Account Registration</h3>
                  <p>
                    To use certain features of the Service, you may be required to register for an account. 
                    You agree to provide accurate information and maintain the security of your account.
                  </p>
                  
                  <h3 className="text-lg font-medium text-primary">4. Founding Flinger Membership</h3>
                  <p>
                    Founding Flinger lifetime membership covers core features and does not expire. The $99 
                    one-time payment grants access to all current and future core features of the <span className="text-teal">FlingPing<span className="text-coral">.co</span></span> 
                    platform. Due to the limited and exclusive nature of this offer, Founding Flinger memberships 
                    are non-refundable.
                  </p>
                  
                  <h3 className="text-lg font-medium text-primary">5. User Conduct</h3>
                  <p>
                    You agree not to misuse the Service or help anyone else do so. Misuse includes attempting 
                    to access or use the service in a fraudulent way, violating others' privacy, or attempting to 
                    bypass our security measures.
                  </p>
                  
                  <h3 className="text-lg font-medium text-primary">6. Limitation of Liability</h3>
                  <p>
                    In no event shall <span className="text-teal">FlingPing<span className="text-coral">.co</span></span>, its directors, employees, partners, agents, suppliers, 
                    or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages.
                  </p>
                  
                  <h3 className="text-lg font-medium text-primary">7. Changes to Terms</h3>
                  <p>
                    We reserve the right to modify these terms at any time. We will provide notice of any 
                    significant changes. Your continued use of the Service after such modifications constitutes 
                    your acceptance of the revised terms.
                  </p>
                  
                  <p className="mt-6 text-sm">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="privacy" id="privacy" className="border-b border-coral">
                <AccordionTrigger className="text-xl font-medium py-4 text-teal hover:text-primary">
                  Privacy Policy
                </AccordionTrigger>
                <AccordionContent className="text-sand px-4 pb-4 space-y-4">
                  <h3 className="text-lg font-medium text-primary">1. Information We Collect</h3>
                  <p>
                    At <span className="text-teal">FlingPing<span className="text-coral">.co</span></span>, we're committed to minimizing data collection. We collect only what's 
                    necessary to provide our service, such as:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Information you provide during registration (email address)</li>
                    <li>Anonymous connection data between users (using randomized identifiers)</li>
                    <li>Payment information for processing transactions (handled securely by our payment processor)</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium text-primary">2. How We Use Your Information</h3>
                  <p>
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide and maintain our service</li>
                    <li>Enable anonymous health notifications between users</li>
                    <li>Process payments and maintain membership records</li>
                    <li>Communicate with you about updates and new features</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium text-primary">3. Data Security</h3>
                  <p>
                    We implement industry-standard security measures to protect your data, including 
                    end-to-end encryption for all sensitive communications and anonymized connection data.
                  </p>
                  
                  <h3 className="text-lg font-medium text-primary">4. Data Sharing</h3>
                  <p>
                    We do not sell your personal information. We may share anonymized, aggregated data 
                    with research partners to improve sexual health outcomes, but this data cannot be 
                    traced back to individuals.
                  </p>
                  
                  <h3 className="text-lg font-medium text-primary">5. Your Rights</h3>
                  <p>
                    You have the right to access, correct, or delete your personal information. To 
                    exercise these rights, please contact us at privacy@flingping.co.
                  </p>
                  
                  <p className="mt-6 text-sm">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="refund" id="refund" className="border-b border-coral">
                <AccordionTrigger className="text-xl font-medium py-4 text-teal hover:text-primary">
                  Refund Policy
                </AccordionTrigger>
                <AccordionContent className="text-sand px-4 pb-4 space-y-4">
                  <h3 className="text-lg font-medium text-primary">Founding Flinger Membership</h3>
                  <p>
                    Due to the limited and exclusive nature of our Founding Flinger program, the $99 
                    lifetime membership is non-refundable. This one-time payment provides perpetual 
                    access to all core features of <span className="text-teal">FlingPing<span className="text-coral">.co</span></span>.
                  </p>
                  
                  <h3 className="text-lg font-medium text-primary">Standard Subscriptions</h3>
                  <p>
                    For standard subscription plans (after public launch), refunds may be requested 
                    within 14 days of purchase if you haven't used the service. To request a refund, 
                    please contact billing@flingping.co with your account information and reason for 
                    the refund request.
                  </p>
                  
                  <h3 className="text-lg font-medium text-primary">Special Circumstances</h3>
                  <p>
                    In exceptional cases (such as accidental purchases or technical issues preventing 
                    service use), we may consider refund requests outside our standard policy. These 
                    are evaluated on a case-by-case basis.
                  </p>
                  
                  <p className="mt-6 text-sm">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="cookies" className="border-b border-coral">
                <AccordionTrigger className="text-xl font-medium py-4 text-teal hover:text-primary">
                  Cookie Policy
                </AccordionTrigger>
                <AccordionContent className="text-sand px-4 pb-4 space-y-4">
                  <h3 className="text-lg font-medium text-primary">What Are Cookies</h3>
                  <p>
                    Cookies are small pieces of data stored on your device that help us improve your 
                    experience with <span className="text-teal">FlingPing<span className="text-coral">.co</span></span> by remembering your preferences and how you use our site.
                  </p>
                  
                  <h3 className="text-lg font-medium text-primary">How We Use Cookies</h3>
                  <p>
                    We use cookies for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Authentication and maintaining your logged-in status</li>
                    <li>Remembering your preferences</li>
                    <li>Analyzing site traffic and performance</li>
                    <li>Enabling certain features of our service</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium text-primary">Types of Cookies We Use</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Essential cookies:</strong> Required for the basic functionality of our service</li>
                    <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
                    <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our site</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium text-primary">Managing Cookies</h3>
                  <p>
                    Most web browsers allow you to control cookies through their settings. However, 
                    if you disable certain cookies, some parts of our service may not function properly.
                  </p>
                  
                  <p className="mt-6 text-sm">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="affiliate" id="affiliate" className="border-b border-coral">
                <AccordionTrigger className="text-xl font-medium py-4 text-teal hover:text-primary">
                  Affiliate Disclosure
                </AccordionTrigger>
                <AccordionContent className="text-sand px-4 pb-4 space-y-4">
                  <h3 className="text-lg font-medium text-primary">FTC Disclosure Compliance</h3>
                  <p>
                    In accordance with the Federal Trade Commission (FTC) guidelines, 
                    <span className="text-teal"> FlingPing<span className="text-coral">.co</span></span> would like to disclose that 
                    this website contains affiliate links. As an affiliate, we may earn a commission from qualifying purchases 
                    made through these links at no additional cost to you.
                  </p>
                  
                  <h3 className="text-lg font-medium text-primary">What Are Affiliate Links?</h3>
                  <p>
                    Affiliate links are special URLs that contain our affiliate ID or tracking code. When you click on these links 
                    and make a purchase, we may receive a small commission from the merchant. These links may be present in our 
                    blog posts, product recommendations, or resource pages.
                  </p>
                  
                  <h3 className="text-lg font-medium text-primary">Our Affiliate Relationships</h3>
                  <p>
                    We currently have affiliate relationships with the following companies:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Sexual health and wellness product retailers</li>
                    <li>Health education platforms</li>
                    <li>Privacy and security service providers</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium text-primary">Our Commitment to You</h3>
                  <p>
                    We want to be completely transparent about our affiliate relationships. Please know that:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>We only recommend products or services that we believe will provide value to our users</li>
                    <li>We will always disclose when content contains affiliate links</li>
                    <li>Your trust is our top priority, and we will never recommend products solely for the purpose of earning commissions</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium text-primary">Identifying Affiliate Links</h3>
                  <p>
                    Affiliate links on our site will be identified with a clear disclosure statement at the beginning of any content 
                    containing such links, or with an indicator next to the link itself like [Affiliate Link].
                  </p>
                  
                  <p className="mt-6 text-sm">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="bg-dark border-2 border-coral rounded-xl p-8 text-center">
            <h2 className="text-2xl mb-4">Have Questions About Our Policies?</h2>
            <p className="text-lg mb-6">
              If you have any questions or concerns about our legal policies, 
              please don't hesitate to reach out to our team.
            </p>
            <Link href="/contact">
              <Button className="btn-primary font-poppins font-medium text-center px-8 py-3 rounded-full text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;
