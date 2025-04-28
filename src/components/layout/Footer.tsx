
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, ChevronUp, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Footer: React.FC = () => {
  // Function to scroll back to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-white pt-16 pb-12 border-t border-gray-100">
      <div className="container-custom">
        {/* Logo & Main Navigation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 mb-12">
          {/* Logo */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center mb-6">
              <img 
                src="/lovable-uploads/d8ffd81b-bc8d-4b05-8575-464c7deef1ca.png" 
                alt="Voluntus Logo" 
                className="h-8" 
              />
            </div>
            <p className="text-xs text-gray-500 mb-6">
              © {new Date().getFullYear()} Voluntus Long-term Capital
            </p>
            <Button 
              variant="outline"
              onClick={scrollToTop}
              className="rounded-full px-4 py-1 text-xs border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
            >
              <ChevronUp size={14} />
              <span>Back to top</span>
            </Button>
          </div>

          {/* Links Columns */}
          <div className="col-span-2 lg:col-span-1">
            <p className="text-xs uppercase text-gray-400 mb-5">Company</p>
            <nav className="flex flex-col space-y-3">
              <Link to="/about" className="text-sm text-gray-500 hover:text-black transition-colors">ABOUT</Link>
              <Link to="/services" className="text-sm text-gray-500 hover:text-black transition-colors">SERVICES</Link>
              <Link to="/insight" className="text-sm text-gray-500 hover:text-black transition-colors">INSIGHT</Link>
              <Link to="/event" className="text-sm text-gray-500 hover:text-black transition-colors">EVENT</Link>
              <Link to="/contact" className="text-sm text-gray-500 hover:text-black transition-colors">CONTACT US</Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="col-span-1">
            <p className="text-xs uppercase text-gray-400 mb-5">Social</p>
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">LINKEDIN</a>
              <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">INSTAGRAM</a>
              <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">FACEBOOK</a>
              <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">X</a>
              <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">WECHAT</a>
            </div>
          </div>

          {/* Legal Links */}
          <div className="col-span-1">
            <p className="text-xs uppercase text-gray-400 mb-5">Legal</p>
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">TERMS OF USE</a>
              <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">PRIVACY & COOKIES</a>
              <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">PRESS</a>
            </div>
          </div>
        </div>

        {/* Disclaimer Text - Redesigned with smaller font */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-[10px] leading-relaxed text-gray-400 max-w-5xl">
            This website is owned and operated by Voluntus Long-term Capital, a Hong Kong-based wealth advisory firm. Our services are only available to Hong Kong-based investors, excluding U.S. Persons.
          </p>
          <p className="text-[10px] leading-relaxed text-gray-400 mt-3 max-w-5xl">
            Unless otherwise stated, all return figures shown are for illustrative purposes only, do not represent actual client or model returns, and are not indicative of future performance. Actual returns may vary significantly based on individual financial circumstances and market conditions. Investment involves risk, and the value of investments, as well as the income derived from them, may fluctuate and even become valueless.
          </p>
          <p className="text-[10px] leading-relaxed text-gray-400 mt-3 max-w-5xl">
            Some statements on this website may be forward-looking and reflect current expectations or forecasts of future events. There is no guarantee that the conditions described will remain the same, and actual results may differ materially.
          </p>
          <p className="text-[10px] leading-relaxed text-gray-400 mt-3 max-w-5xl">
            The information provided on this website is for informational purposes only and should not be construed as an offer, solicitation, or recommendation to buy or sell any investment product or participate in any advisory service. It does not take into account your individual investment objectives, financial situation, or specific needs. You should carefully consider whether any investment strategy or product is suitable for you and seek independent financial advice if necessary.
          </p>
          <p className="text-[10px] leading-relaxed text-gray-400 mt-3 max-w-5xl">
            All advertisements and promotional materials on this website have not been reviewed by the Securities and Futures Commission of Hong Kong or any other regulatory authority.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
