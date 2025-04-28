
import React from 'react';
import { Link } from 'react-router-dom';
import { X, Linkedin, Youtube, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-20 border-t border-gray-100">
      <div className="container-custom">
        <div className="grid grid-cols-4 gap-16">
          {/* Column 1: Logo and Copyright */}
          <div className="col-span-1">
            <div className="flex items-center mb-6">
              <div className="text-2xl font-bold">
                <span className="text-voluntus-blue">V</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              © {currentYear} Voluntus
            </p>
          </div>

          {/* Column 2: Company Links */}
          <div className="col-span-1">
            <div className="space-y-4">
              <Link to="/about" className="block text-sm text-gray-600 hover:text-black">ABOUT</Link>
              <Link to="/careers" className="block text-sm text-gray-600 hover:text-black">CAREERS</Link>
              <Link to="/stories" className="block text-sm text-gray-600 hover:text-black">STORIES</Link>
              <Link to="/robot-fleet" className="block text-sm text-gray-600 hover:text-black">ROBOT FLEET</Link>
            </div>
          </div>

          {/* Column 3: Social Links */}
          <div className="col-span-1">
            <div className="space-y-4">
              <a href="#" className="block text-sm text-gray-600 hover:text-black">LINKEDIN</a>
              <a href="#" className="block text-sm text-gray-600 hover:text-black">YOUTUBE</a>
              <a href="#" className="block text-sm text-gray-600 hover:text-black">INSTAGRAM</a>
              <a href="#" className="block text-sm text-gray-600 hover:text-black">X</a>
            </div>
          </div>

          {/* Column 4: Legal Links */}
          <div className="col-span-1">
            <div className="space-y-4">
              <a href="#" className="block text-sm text-gray-600 hover:text-black">TERMS OF USE</a>
              <a href="#" className="block text-sm text-gray-600 hover:text-black">PRIVACY & COOKIES</a>
              <a href="#" className="block text-sm text-gray-600 hover:text-black">PRESS</a>
              <a href="#" className="block text-sm text-gray-600 hover:text-black">GET UPDATES</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
