import { Link } from "wouter";
import logo from "@/assets/logo.svg";
import { FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark border-t border-coral">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col justify-between items-center">
          <div className="mb-8 text-center">
            <Link href="/">
              <div className="flex items-center justify-center mb-4 cursor-pointer">
                <img src={logo} alt="FlingPing.co Logo" className="h-10 mr-2" />
              </div>
            </Link>
            <p className="max-w-md mx-auto text-sand text-center">
              Flip the script on sexual health with innovative technology that keeps you informed, empowered, and protected.
            </p>
            
            <div className="flex justify-center space-x-6 mt-6">
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-coral hover:text-teal transition-colors">
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-coral hover:text-teal transition-colors">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" className="text-coral hover:text-teal transition-colors">
                <FaTiktok className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-4">
              <h4 className="text-coral font-medium text-xl inline-block">Navigation</h4>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8">
              <Link href="/"><span className="text-sand hover:text-primary cursor-pointer">Home</span></Link>
              <Link href="/about"><span className="text-sand hover:text-primary cursor-pointer">About</span></Link>
              <Link href="/how-it-works"><span className="text-sand hover:text-primary cursor-pointer">How It Works</span></Link>
              <Link href="/faqs"><span className="text-sand hover:text-primary cursor-pointer">FAQs</span></Link>
              <Link href="/contact"><span className="text-sand hover:text-primary cursor-pointer">Contact</span></Link>
            </div>
            
            <div className="text-center mb-4">
              <h4 className="text-coral font-medium text-xl inline-block">Legal</h4>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              <Link href="/legal#refund"><span className="text-sand hover:text-primary cursor-pointer">Refund Policy</span></Link>
              <Link href="/legal#terms"><span className="text-sand hover:text-primary cursor-pointer">Terms of Service</span></Link>
              <Link href="/legal#privacy"><span className="text-sand hover:text-primary cursor-pointer">Privacy Policy</span></Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-coral mt-12 pt-8 text-center">
          <p className="text-sand">&copy; {new Date().getFullYear()} FlingPing.co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
