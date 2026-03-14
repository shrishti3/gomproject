import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const footerLinks = {
    Services: ['ODM', 'SCM', 'EMS', 'Wire Harnessing'],
    Company: ['About', 'Careers', 'Press', 'Contact'],
    Legal: ['Privacy', 'Terms', 'Cookies'],
  };

  const handleNavigation = (link) => {
    if (link === 'About') {
      navigate('/about');
    } else if (link === 'Contact') {
      // Navigate to home and scroll to contact section
      navigate('/', { state: { scrollTo: 'contact' } });
      setTimeout(() => {
        const element = document.getElementById('contact');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <footer className="bg-tactical-black border-t border-caution-yellow border-opacity-20">
      <div className="container-tactical py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-tech font-bold neon-text mb-4">MADMANN</h3>
            <p className="text-sm text-stainless-steel">
              Pushing boundaries in aerospace, defense, and electronics.
            </p>
          </motion.div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links], idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <h4 className="text-sm font-tech font-bold uppercase text-caution-yellow mb-4">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => {
                  const isNavigable = link === 'About' || link === 'Contact';

                  return (
                    <li key={link}>
                      {isNavigable ? (
                        <button
                          onClick={() => handleNavigation(link)}
                          className="text-xs text-stainless-steel hover:text-caution-yellow transition-colors cursor-pointer text-left"
                        >
                          {link}
                        </button>
                      ) : (
                        <a
                          href="/"
                          className="text-xs text-stainless-steel hover:text-caution-yellow transition-colors"
                        >
                          {link}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom */}
        <motion.div
          className="border-t border-tactical-dark-grey pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-xs text-stainless-steel text-center md:text-left">
            © {currentYear} MadMann Dynamics. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/" className="text-xs text-stainless-steel hover:text-caution-yellow">
              Twitter
            </a>
            <a href="/" className="text-xs text-stainless-steel hover:text-caution-yellow">
              LinkedIn
            </a>
            <a href="/" className="text-xs text-stainless-steel hover:text-caution-yellow">
              GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
