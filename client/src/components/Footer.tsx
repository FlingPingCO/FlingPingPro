import { Link } from "wouter";
import logo from "@/assets/logo.svg";
import { FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark border-t border-coral">
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
          <div className="text-center md:text-left">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img src={logo} alt="FlingPing.co Logo" className="h-8 mr-1" />
              </div>
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-4 text-xs">
            <Link href="/"><span className="text-sand hover:text-teal cursor-pointer">Home</span></Link>
            <Link href="/about"><span className="text-sand hover:text-teal cursor-pointer">About</span></Link>
            <Link href="/how-it-works"><span className="text-sand hover:text-teal cursor-pointer">How It Works</span></Link>
            <Link href="/faqs"><span className="text-sand hover:text-teal cursor-pointer">FAQs</span></Link>
            <Link href="/contact"><span className="text-sand hover:text-teal cursor-pointer">Contact</span></Link>
            <Link href="/legal"><span className="text-sand hover:text-teal cursor-pointer">Legal</span></Link>
            <Link href="/legal#affiliate"><span className="text-coral hover:text-teal cursor-pointer">Affiliate Disclosure</span></Link>
          </div>
          
          <div className="flex justify-center md:justify-end space-x-3">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-coral hover:text-teal transition-colors">
              <FaTwitter className="h-4 w-4" />
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-coral hover:text-teal transition-colors">
              <FaInstagram className="h-4 w-4" />
            </a>
            <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" className="text-coral hover:text-teal transition-colors">
              <FaTiktok className="h-4 w-4" />
            </a>
            <span className="text-sand text-xs ml-2">&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
