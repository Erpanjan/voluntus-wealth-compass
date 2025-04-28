
import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Youtube, Instagram, X } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-16 pb-10 border-t border-gray-100">
      <div className="container-custom">
        <div className="grid grid-cols-4 gap-10">
          {/* Logo Column */}
          <div className="col-span-1">
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                <span className="text-voluntus-blue">V</span>
              </div>
            </div>
          </div>

          {/* Nav Links Column 1 */}
          <div className="col-span-1">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-xs uppercase text-gray-500 hover:text-black transition-colors">Neo</Link>
              <Link to="/" className="text-xs uppercase text-gray-500 hover:text-black transition-colors">Eve</Link>
              <Link to="/careers" className="text-xs uppercase text-gray-500 hover:text-black transition-colors">Careers</Link>
              <Link to="/about" className="text-xs uppercase text-gray-500 hover:text-black transition-colors">About</Link>
              <Link to="/stories" className="text-xs uppercase text-gray-500 hover:text-black transition-colors">Stories</Link>
              <Link to="/fleet" className="text-xs uppercase text-gray-500 hover:text-black transition-colors">Robot Fleet</Link>
            </nav>
          </div>

          {/* Nav Links Column 2 */}
          <div className="col-span-1">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-xs uppercase text-gray-500 hover:text-black transition-colors flex items-center gap-2">
                Linkedin
              </a>
              <a href="#" className="text-xs uppercase text-gray-500 hover:text-black transition-colors flex items-center gap-2">
                Youtube
              </a>
              <a href="#" className="text-xs uppercase text-gray-500 hover:text-black transition-colors flex items-center gap-2">
                Instagram
              </a>
              <a href="#" className="text-xs uppercase text-gray-500 hover:text-black transition-colors flex items-center gap-2">
                X
              </a>
            </nav>
          </div>

          {/* Legal Links Column */}
          <div className="col-span-1">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-xs uppercase text-gray-500 hover:text-black transition-colors">Terms of Use</a>
              <a href="#" className="text-xs uppercase text-gray-500 hover:text-black transition-colors">Privacy & Cookies</a>
              <a href="#" className="text-xs uppercase text-gray-500 hover:text-black transition-colors">Press</a>
              <a href="#" className="text-xs uppercase text-gray-500 hover:text-black transition-colors">Get Updates</a>
            </nav>
          </div>
        </div>

        {/* Disclaimer Text - Kept but styled minimally */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 leading-relaxed max-w-5xl">
            This website is owned and operated by Voluntus Long-term Capital, a Hong Kong-based wealth advisory firm. Our services are only available to Hong Kong-based investors, excluding U.S. Persons. Unless otherwise stated, all return figures shown are for illustrative purposes only, do not represent actual client or model returns, and are not indicative of future performance. Investment involves risk, and the value of investments, as well as the income derived from them, may fluctuate and even become valueless. The information provided on this website is for informational purposes only and should not be construed as an offer, solicitation, or recommendation.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8">
          <p className="text-[10px] text-gray-400">
            1X © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
