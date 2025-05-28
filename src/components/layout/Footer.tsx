
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-4 pb-3 border-t border-gray-100">
      <div className="container-custom">
        {/* Footer Bottom Section */}
        <div className="flex justify-between items-center pt-2">
          <p className="text-xs text-gray-500 font-light">
            © {new Date().getFullYear()} Voluntas Long-term Capital
          </p>

          {/* Disclaimer Text - Hidden in smaller screens, visible in larger ones */}
          <div className="hidden md:block max-w-3xl">
            <p className="text-[10px] text-gray-400 font-light">
              This website is owned and operated by Voluntas Long-term Capital, a Hong Kong-based wealth advisory firm.
            </p>
          </div>
        </div>
        
        {/* Full disclaimer on mobile - hidden on larger screens */}
        <div className="mt-4 pt-2 md:hidden">
          <p className="text-[10px] leading-relaxed text-gray-400 max-w-5xl font-light">
            This website is owned and operated by Voluntas Long-term Capital, a Hong Kong-based wealth advisory firm. Our services are only available to Hong Kong-based investors, excluding U.S. Persons.
          </p>
          <p className="text-[10px] leading-relaxed text-gray-400 mt-2 max-w-5xl font-light">
            Unless otherwise stated, all return figures shown are for illustrative purposes only, do not represent actual client or model returns, and are not indicative of future performance.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
