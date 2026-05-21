import React from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (href) => {
    if (href.startsWith('/#')) {
      // If it's a hash link and we're not on home, navigate to home first
      if (location.pathname !== '/') {
        window.location.href = href;
      } else {
        // We're on home, just scroll to section
        const sectionId = href.substring(2);
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-tactical-black bg-opacity-95 border-b border-caution-yellow border-opacity-30">
      <div className="container-tactical">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold font-tech neon-text"
          >
            MADMANN
            <span className="text-xs ml-1 text-caution-yellow">DYNAMICS</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <motion.div key={item.label}>
                {item.href.startsWith('/#') ? (
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="text-sm font-tech uppercase tracking-wider text-stainless-steel hover:text-caution-yellow transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className="text-sm font-tech uppercase tracking-wider text-stainless-steel hover:text-caution-yellow transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/#contact');
            }}
            className="hidden md:block btn-tactical cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={toggleMenu}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-caution-yellow" />
            ) : (
              <Menu className="w-6 h-6 text-caution-yellow" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 space-y-2"
          >
            {menuItems.map((item) => (
              <div key={item.label}>
                {item.href.startsWith('/#') ? (
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="block py-2 text-sm font-tech uppercase text-stainless-steel hover:text-caution-yellow cursor-pointer"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className="block py-2 text-sm font-tech uppercase text-stainless-steel hover:text-caution-yellow"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/#contact');
              }}
              className="block pt-4 cursor-pointer"
            >
              <button className="w-full btn-tactical">Get Started</button>
            </a>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
