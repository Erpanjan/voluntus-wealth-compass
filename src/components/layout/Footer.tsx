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
        {/* Back to Top Button - Moved to the upper part */}
        <div className="flex justify-end mb-8">
          <Button 
            variant="outline"
            onClick={scrollToTop}
            className="rounded-full px-4 py-1 text-xs border border-gray-200 hover:bg-gray-50 flex items-center gap-2 font-light"
          >
            <ChevronUp size={14} />
            <span>Back to top</span>
          </Button>
        </div>
        
        {/* Main Navigation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 mb-12">
          {/* Empty column (logo removed) */}
          <div className="col-span-2 lg:col-span-1">
            {/* Logo removed as requested */}
          </div>

          {/* Links Columns */}
          <div className="col-span-2 lg:col-span-1">
            <p className="text-xs uppercase text-gray-400 mb-5 font-semibold">Company</p>
            <nav className="flex flex-col space-y-3">
              <Link to="/about" className="text-xs text-gray-500 hover:text-black transition-colors font-light">ABOUT</Link>
              <Link to="/services" className="text-xs text-gray-500 hover:text-black transition-colors font-light">SERVICES</Link>
              <Link to="/insight" className="text-xs text-gray-500 hover:text-black transition-colors font-light">INSIGHT</Link>
              <Link to="/event" className="text-xs text-gray-500 hover:text-black transition-colors font-light">EVENT</Link>
              <Link to="/contact" className="text-xs text-gray-500 hover:text-black transition-colors font-light">CONTACT US</Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="col-span-1">
            <p className="text-xs uppercase text-gray-400 mb-5 font-semibold">Social</p>
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">LINKEDIN</a>
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">INSTAGRAM</a>
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">FACEBOOK</a>
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">X</a>
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">WECHAT</a>
            </div>
          </div>

          {/* Legal Links */}
          <div className="col-span-1">
            <p className="text-xs uppercase text-gray-400 mb-5 font-semibold">Legal</p>
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">TERMS OF USE</a>
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">PRIVACY & COOKIES</a>
              <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors font-light">PRESS</a>
            </div>
          </div>
        </div>

        {/* Disclaimer Text */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-[10px] leading-relaxed text-gray-400 max-w-5xl font-light">
            This website is owned and operated by Voluntus Long-term Capital, a Hong Kong-based wealth advisory firm. Our services are only available to Hong Kong-based investors, excluding U.S. Persons.
          </p>
          <p className="text-[10px] leading-relaxed text-gray-400 mt-3 max-w-5xl font-light">
            Unless otherwise stated, all return figures shown are for illustrative purposes only, do not represent actual client or model returns, and are not indicative of future performance. Actual returns may vary significantly based on individual financial circumstances and market conditions. Investment involves risk, and the value of investments, as well as the income derived from them, may fluctuate and even become valueless.
          </p>
          <p className="text-[10px] leading-relaxed text-gray-400 mt-3 max-w-5xl font-light">
            Some statements on this website may be forward-looking and reflect current expectations or forecasts of future events. There is no guarantee that the conditions described will remain the same, and actual results may differ materially.
          </p>
          <p className="text-[10px] leading-relaxed text-gray-400 mt-3 max-w-5xl font-light">
            The information provided on this website is for informational purposes only and should not be construed as an offer, solicitation, or recommendation to buy or sell any investment product or participate in any advisory service. It does not take into account your individual investment objectives, financial situation, or specific needs. You should carefully consider whether any investment strategy or product is suitable for you and seek independent financial advice if necessary.
          </p>
          <p className="text-[10px] leading-relaxed text-gray-400 mt-3 max-w-5xl font-light">
            All advertisements and promotional materials on this website have not been reviewed by the Securities and Futures Commission of Hong Kong or any other regulatory authority.
          </p>
        </div>
        
        {/* Copyright centered at the very bottom */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 font-light">
            © {new Date().getFullYear()} Voluntus Long-term Capital
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
