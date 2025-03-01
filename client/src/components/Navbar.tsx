import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.svg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Investors", path: "/investors" },
    { name: "FAQs", path: "/faqs" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center">
            <img src={logo} alt="FlingPing.co Logo" className="h-10 mr-2" />
            <span className="logo-text-primary">Fling<span className="logo-text-primary">Ping</span><span className="logo-text-secondary">.co</span></span>
          </a>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <a className={`nav-link ${location === link.path ? "text-primary" : ""}`}>
                {link.name}
              </a>
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-sand"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobile && (
        <nav 
          className={`${isMenuOpen ? "block" : "hidden"} md:hidden bg-dark py-4 px-4 absolute w-full z-50`}
        >
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <a className={`nav-link ${location === link.path ? "text-primary" : ""}`}>
                  {link.name}
                </a>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
