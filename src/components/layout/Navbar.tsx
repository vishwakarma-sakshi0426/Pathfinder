import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Briefcase, Map, TrendingUp, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItemData {
  name: string;
  link: string;
  icon: React.ReactNode;
}

const navItems: NavItemData[] = [
  { name: 'Roadmap Generation', link: '/roadmap', icon: <Map size={18} aria-hidden="true" /> },
  { name: 'My Progress', link: '/progress', icon: <TrendingUp size={18} aria-hidden="true" /> },
  { name: 'Build Your Resume', link: '/resume', icon: <Briefcase size={18} aria-hidden="true" /> },
  { name: 'Find Jobs', link: '/jobs', icon: <Search size={18} aria-hidden="true" /> },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <>
      <div className="h-20" />
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 font-sans transition-colors duration-300 ease-in-out
          ${isScrolled ? 'shadow-lg backdrop-blur-sm bg-teal-700/95' : 'bg-teal-700'}
        `}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link
              to="/"
              className="flex-shrink-0 text-xl font-medium text-white sm:text-2xl lg:text-3xl"
              aria-label="PathFinder Home"
            >
              PathFinder
            </Link>
            <DesktopNav location={location} />
            <div className="flex items-center space-x-2 sm:space-x-4">
              <MobileMenuToggle isOpen={isOpen} toggleMenu={toggleMenu} />
            </div>
          </div>
        </div>
        <MobileMenu isOpen={isOpen} location={location} toggleMenu={toggleMenu} />
      </motion.nav>
    </>
  );
}

interface DesktopNavProps {
  location: ReturnType<typeof useLocation>;
}

function DesktopNav({ location }: DesktopNavProps) {
  return (
    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
      {navItems.map((item, index) => (
        <NavItem
          key={item.name}
          to={item.link}
          text={item.name}
          icon={item.icon}
          index={index}
          isActive={location.pathname === item.link}
        />
      ))}
    </div>
  );
}

interface NavItemProps {
  to: string;
  text: string;
  icon: React.ReactNode;
  index: number;
  isActive: boolean;
}

function NavItem({ to, text, icon, index, isActive }: NavItemProps) {
  return (
    <motion.div
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        isActive ? 'text-amber-400 bg-teal-600' : 'text-white hover:text-amber-300 hover:bg-teal-600'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index }}
    >
      <Link to={to} className="flex items-center space-x-2" aria-current={isActive ? 'page' : undefined}>
        {icon}
        <span>{text}</span>
      </Link>
    </motion.div>
  );
}

interface MobileMenuToggleProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

function MobileMenuToggle({ isOpen, toggleMenu }: MobileMenuToggleProps) {
  return (
    <motion.button
      onClick={toggleMenu}
      type="button"
      className="inline-flex justify-center items-center p-2 ml-4 rounded-md sm:hidden hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-400"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <span className="sr-only">{isOpen ? 'Close main menu' : 'Open main menu'}</span>
      {isOpen ? <X className="w-6 h-6 text-white" aria-hidden="true" /> : <Menu className="w-6 h-6 text-white" aria-hidden="true" />}
    </motion.button>
  );
}

interface MobileMenuProps {
  isOpen: boolean;
  location: ReturnType<typeof useLocation>;
  toggleMenu: () => void;
}

function MobileMenu({ isOpen, location, toggleMenu }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-menu"
          className="backdrop-blur-sm sm:hidden bg-teal-700/95"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number] }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <MobileNavItem
                key={item.name}
                to={item.link}
                text={item.name}
                icon={item.icon}
                isActive={location.pathname === item.link}
                onClick={toggleMenu}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface MobileNavItemProps {
  to: string;
  text: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function MobileNavItem({ to, text, icon, isActive, onClick }: MobileNavItemProps) {
  return (
    <motion.div
      className="block overflow-hidden rounded-md"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={to} className="block" onClick={onClick} aria-current={isActive ? 'page' : undefined}>
        <motion.div
          className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
            isActive ? 'text-amber-400 bg-teal-600' : 'text-white hover:bg-teal-600'
          }`}
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-2">
            {icon}
            <span>{text}</span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
