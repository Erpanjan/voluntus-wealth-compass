
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer: React.FC = () => {
  // Function to scroll back to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-white py-12 border-t border-gray-100">
      <div className="container-custom">
        {/* New compact layout */}
        <div className="grid grid-cols-4 gap-8 mb-12">
          {/* Column 1 - Logo or icon */}
          <div className="flex items-start">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L20 20" stroke="black" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 4L4 20" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Column 2 - Company Links */}
          <div className="flex flex-col space-y-5">
            <p className="text-xs uppercase text-gray-400 font-semibold">Company</p>
            <Link to="/about" className="text-xs text-gray-500 hover:text-black transition-colors font-light">ABOUT</Link>
            <Link to="/services" className="text-xs text-gray-500 hover:text-black transition-colors font-light">SERVICES</Link>
            <Link to="/insight" className="text-xs text-gray-500 hover:text-black transition-colors font-light">INSIGHT</Link>
            <Link to="/event" className="text-xs text-gray-500 hover:text-black transition-colors font-light">EVENT</Link>
            <Link to="/contact" className="text-xs text-gray-500 hover:text-black transition-colors font-light">CONTACT US</Link>
          </div>

          {/* Column 3 - Social Links */}
          <div className="flex flex-col space-y-5">
            <p className="text-xs uppercase text-gray-400 font-semibold">Social</p>
            <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">LINKEDIN</a>
            <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">INSTAGRAM</a>
            <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">FACEBOOK</a>
            <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">X</a>
            <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">WECHAT</a>
          </div>

          {/* Column 4 - Legal Links + Back to top */}
          <div className="flex flex-col space-y-5">
            <p className="text-xs uppercase text-gray-400 font-semibold">Legal</p>
            <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">TERMS OF USE</a>
            <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">PRIVACY & COOKIES</a>
            <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">PRESS</a>
            <Button 
              variant="outline"
              onClick={scrollToTop}
              className="mt-auto rounded-full px-4 py-1 text-xs border border-gray-200 hover:bg-gray-50 flex items-center gap-2 font-light w-fit ml-auto"
            >
              <ChevronUp size={14} />
              <span>Back to top</span>
            </Button>
          </div>
        </div>
        
        <Separator className="bg-gray-100" />
        
        {/* Compact bottom section */}
        <div className="flex justify-between items-center pt-4">
          <p className="text-xs text-gray-500 font-light">
            © {new Date().getFullYear()} Voluntus Long-term Capital
          </p>

          <p className="text-[10px] text-gray-400 font-light max-w-md text-right">
            This website is owned and operated by Voluntus Long-term Capital, a Hong Kong-based wealth advisory firm.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
