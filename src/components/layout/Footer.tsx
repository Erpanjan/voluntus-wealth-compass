
import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from "@/components/ui/separator";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-8 pb-6 border-t border-gray-100">
      <div className="container-custom">
        {/* Links section with horizontal layout */}
        <div className="grid grid-cols-3 gap-8 mb-10">
          {/* Company Links */}
          <div className="flex flex-col">
            <div className="grid grid-cols-1 gap-3">
              <Link to="/about" className="text-xs text-gray-500 hover:text-black transition-colors font-light">ABOUT</Link>
              <Link to="/services" className="text-xs text-gray-500 hover:text-black transition-colors font-light">SERVICES</Link>
              <Link to="/insight" className="text-xs text-gray-500 hover:text-black transition-colors font-light">INSIGHT</Link>
              <Link to="/event" className="text-xs text-gray-500 hover:text-black transition-colors font-light">EVENT</Link>
              <Link to="/contact" className="text-xs text-gray-500 hover:text-black transition-colors font-light">CONTACT US</Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col">
            <div className="grid grid-cols-1 gap-3">
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">LINKEDIN</a>
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">INSTAGRAM</a>
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">FACEBOOK</a>
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">X</a>
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">WECHAT</a>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col">
            <div className="grid grid-cols-1 gap-3">
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">TERMS OF USE</a>
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">PRIVACY & COOKIES</a>
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">PRESS</a>
            </div>
          </div>
        </div>

        <Separator className="my-4 bg-gray-100" />
        
        {/* Footer Bottom Section */}
        <div className="flex justify-between items-center pt-3">
          <p className="text-xs text-gray-500 font-light">
            © {new Date().getFullYear()} Voluntus Long-term Capital
          </p>

          {/* Disclaimer Text - Hidden in smaller screens, visible in larger ones */}
          <div className="hidden md:block max-w-3xl">
            <p className="text-[10px] text-gray-400 font-light">
              This website is owned and operated by Voluntus Long-term Capital, a Hong Kong-based wealth advisory firm.
            </p>
          </div>
        </div>
        
        {/* Full disclaimer on mobile - hidden on larger screens */}
        <div className="mt-6 pt-4 md:hidden">
          <p className="text-[10px] leading-relaxed text-gray-400 max-w-5xl font-light">
            This website is owned and operated by Voluntus Long-term Capital, a Hong Kong-based wealth advisory firm. Our services are only available to Hong Kong-based investors, excluding U.S. Persons.
          </p>
          <p className="text-[10px] leading-relaxed text-gray-400 mt-3 max-w-5xl font-light">
            Unless otherwise stated, all return figures shown are for illustrative purposes only, do not represent actual client or model returns, and are not indicative of future performance.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
