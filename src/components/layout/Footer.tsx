
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
    <footer className="bg-voluntus-gray-light pt-16 pb-8">
      <div className="container-custom">
        {/* Back to Top Button */}
        <div className="flex justify-center mb-12">
          <Button 
            variant="outline"
            onClick={scrollToTop}
            className="rounded-full px-6 py-2 bg-white hover:bg-voluntus-gray flex items-center gap-2"
          >
            <ChevronUp size={18} />
            <span>BACK TO THE TOP</span>
          </Button>
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl font-bold">
                <span className="text-voluntus-blue">V</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg leading-none">VOLUNTUS</span>
                <span className="text-xs text-voluntus-text-secondary leading-none">LONG-TERM CAPITAL</span>
              </div>
            </div>
            <p className="text-sm text-voluntus-text-secondary mt-4">
              A Hong Kong-based wealth advisory firm dedicated to helping households secure their financial future.
            </p>
          </div>

          {/* Page Links */}
          <div className="col-span-1">
            <h4 className="font-semibold mb-4 text-voluntus-text-primary">Pages</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-voluntus-text-secondary hover:text-voluntus-blue transition-colors">HOME</Link>
              <Link to="/services" className="text-sm text-voluntus-text-secondary hover:text-voluntus-blue transition-colors">SERVICE & PRICING</Link>
              <Link to="/insight" className="text-sm text-voluntus-text-secondary hover:text-voluntus-blue transition-colors">INSIGHT</Link>
              <Link to="/event" className="text-sm text-voluntus-text-secondary hover:text-voluntus-blue transition-colors">EVENT</Link>
              <Link to="/about" className="text-sm text-voluntus-text-secondary hover:text-voluntus-blue transition-colors">ABOUT</Link>
              <Link to="/contact" className="text-sm text-voluntus-text-secondary hover:text-voluntus-blue transition-colors">CONTACT US</Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="col-span-1">
            <h4 className="font-semibold mb-4 text-voluntus-text-primary">Social</h4>
            <div className="flex flex-col space-y-2">
              <a href="#" className="text-sm text-voluntus-text-secondary hover:text-voluntus-blue transition-colors flex items-center gap-2">
                <Facebook size={16} /> FACEBOOK
              </a>
              <a href="#" className="text-sm text-voluntus-text-secondary hover:text-voluntus-blue transition-colors flex items-center gap-2">
                <Instagram size={16} /> INSTAGRAM
              </a>
              <a href="#" className="text-sm text-voluntus-text-secondary hover:text-voluntus-blue transition-colors flex items-center gap-2">
                <Mail size={16} /> WHATSAPP
              </a>
              <a href="#" className="text-sm text-voluntus-text-secondary hover:text-voluntus-blue transition-colors flex items-center gap-2">
                <Mail size={16} /> WECHAT
              </a>
              <a href="#" className="text-sm text-voluntus-text-secondary hover:text-voluntus-blue transition-colors flex items-center gap-2">
                <Linkedin size={16} /> LINKEDIN
              </a>
              <a href="#" className="text-sm text-voluntus-text-secondary hover:text-voluntus-blue transition-colors flex items-center gap-2">
                <Mail size={16} /> X
              </a>
            </div>
          </div>

          {/* Policy Links */}
          <div className="col-span-1">
            <h4 className="font-semibold mb-4 text-voluntus-text-primary">Legal</h4>
            <div className="flex flex-col space-y-2">
              <a href="#" className="text-sm text-voluntus-text-secondary hover:text-voluntus-blue transition-colors">TERMS OF USE</a>
              <a href="#" className="text-sm text-voluntus-text-secondary hover:text-voluntus-blue transition-colors">PRIVACY & COOKIES</a>
              <a href="#" className="text-sm text-voluntus-text-secondary hover:text-voluntus-blue transition-colors">PRESS</a>
            </div>
          </div>
        </div>

        {/* Disclaimer Text */}
        <div className="mt-16 border-t border-voluntus-gray pt-8">
          <p className="text-xs text-voluntus-text-secondary leading-relaxed">
            This website is owned and operated by Voluntus Long-term Capital, a Hong Kong-based wealth advisory firm. Our services are only available to Hong Kong-based investors, excluding U.S. Persons.
          </p>
          <p className="text-xs text-voluntus-text-secondary mt-4 leading-relaxed">
            Unless otherwise stated, all return figures shown are for illustrative purposes only, do not represent actual client or model returns, and are not indicative of future performance. Actual returns may vary significantly based on individual financial circumstances and market conditions. Investment involves risk, and the value of investments, as well as the income derived from them, may fluctuate and even become valueless.
          </p>
          <p className="text-xs text-voluntus-text-secondary mt-4 leading-relaxed">
            Some statements on this website may be forward-looking and reflect current expectations or forecasts of future events. There is no guarantee that the conditions described will remain the same, and actual results may differ materially.
          </p>
          <p className="text-xs text-voluntus-text-secondary mt-4 leading-relaxed">
            The information provided on this website is for informational purposes only and should not be construed as an offer, solicitation, or recommendation to buy or sell any investment product or participate in any advisory service. It does not take into account your individual investment objectives, financial situation, or specific needs. You should carefully consider whether any investment strategy or product is suitable for you and seek independent financial advice if necessary.
          </p>
          <p className="text-xs text-voluntus-text-secondary mt-4 leading-relaxed">
            All advertisements and promotional materials on this website have not been reviewed by the Securities and Futures Commission of Hong Kong or any other regulatory authority.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-xs text-voluntus-text-secondary">
            © {new Date().getFullYear()} Voluntus Long-term Capital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
