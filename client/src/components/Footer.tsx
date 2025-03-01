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
                <span className="logo-text-primary">Fling<span className="logo-text-primary">Ping</span><span className="logo-text-secondary">.co</span></span>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
            <div>
              <h4 className="text-coral font-bold mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li><Link href="/"><span className="nav-link cursor-pointer">Home</span></Link></li>
                <li><Link href="/about"><span className="nav-link cursor-pointer">About</span></Link></li>
                <li><Link href="/how-it-works"><span className="nav-link cursor-pointer">How It Works</span></Link></li>
                <li><Link href="/faqs"><span className="nav-link cursor-pointer">FAQs</span></Link></li>
                <li><Link href="/contact"><span className="nav-link cursor-pointer">Contact</span></Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-coral font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/legal#terms"><span className="nav-link cursor-pointer">Terms of Service</span></Link></li>
                <li><Link href="/legal#privacy"><span className="nav-link cursor-pointer">Privacy Policy</span></Link></li>
                <li><Link href="/legal#refund"><span className="nav-link cursor-pointer">Refund Policy</span></Link></li>
              </ul>
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
