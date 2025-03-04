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
            <Link href="/blog"><span className="text-sand hover:text-teal cursor-pointer">Blog</span></Link>
            <Link href="/faqs"><span className="text-sand hover:text-teal cursor-pointer">FAQs</span></Link>
            <Link href="/contact"><span className="text-sand hover:text-teal cursor-pointer">Contact</span></Link>
            <Link href="/legal"><span className="text-sand hover:text-teal cursor-pointer">Legal</span></Link>
            <Link href="/legal#affiliate"><span className="text-coral hover:text-teal cursor-pointer">Affiliate Disclosure</span></Link>
          </div>
          
          <div className="flex justify-center md:justify-end space-x-3">
            <a href="https://twitter.com/flingpingco" target="_blank" rel="noopener noreferrer" className="text-coral hover:text-teal transition-colors" title="Twitter/X: @flingpingco">
              <FaTwitter className="h-4 w-4" />
            </a>
            <a href="https://instagram.com/flingping.co" target="_blank" rel="noopener noreferrer" className="text-coral hover:text-teal transition-colors" title="Instagram: @flingping.co">
              <FaInstagram className="h-4 w-4" />
            </a>
            <a href="https://tiktok.com/@flingpingco" target="_blank" rel="noopener noreferrer" className="text-coral hover:text-teal transition-colors" title="TikTok: @flingpingco">
              <FaTiktok className="h-4 w-4" />
            </a>
            <a href="https://linkedin.com/company/flingping.co" target="_blank" rel="noopener noreferrer" className="text-coral hover:text-teal transition-colors" title="LinkedIn: @flingping.co">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
              </svg>
            </a>
            <span className="text-sand text-xs ml-2">&copy; {new Date().getFullYear()}</span>
            <Link href="/illustrations">
              <span className="text-sand text-[10px] ml-1 opacity-50 hover:opacity-100" title="Internal Illustration Library">&bull;</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
