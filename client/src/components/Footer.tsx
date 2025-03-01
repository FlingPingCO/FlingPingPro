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
                <li><Link href="/"><a className="nav-link">Home</a></Link></li>
                <li><Link href="/about"><a className="nav-link">About</a></Link></li>
                <li><Link href="/how-it-works"><a className="nav-link">How It Works</a></Link></li>
                <li><Link href="/faqs"><a className="nav-link">FAQs</a></Link></li>
                <li><Link href="/contact"><a className="nav-link">Contact</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-coral font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/legal#terms"><a className="nav-link">Terms of Service</a></Link></li>
                <li><Link href="/legal#privacy"><a className="nav-link">Privacy Policy</a></Link></li>
                <li><Link href="/legal#refund"><a className="nav-link">Refund Policy</a></Link></li>
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
