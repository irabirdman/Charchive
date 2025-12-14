'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SignOutButton } from './SignOutButton';

interface AdminNavProps {
  userEmail: string;
}

export function AdminNav({ userEmail }: AdminNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside or on route change
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/admin', label: 'Home' },
    { href: '/admin/worlds', label: 'Worlds' },
    { href: '/admin/ocs', label: 'OCs' },
    { href: '/admin/timelines', label: 'Timelines' },
    { href: '/admin/world-lore', label: 'Lore' },
    { href: '/admin/fields', label: 'Fields' },
    { href: '/admin/dropdown-options', label: 'Options' },
    { href: '/admin/stats', label: 'Stats' },
  ];

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link
            href="/admin"
            className="text-lg sm:text-xl font-bold text-white flex-shrink-0"
            onClick={closeMobileMenu}
          >
            Admin Home
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-purple-400 transition-colors font-medium text-sm lg:text-base"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pl-4 lg:pl-6 border-l border-gray-700">
              <span className="text-xs lg:text-sm text-gray-400 hidden lg:inline">
                {userEmail}
              </span>
              <SignOutButton />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleMobileMenu();
            }}
            className="md:hidden p-2 -mr-2 text-gray-300 hover:text-purple-400 active:text-purple-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg touch-manipulation relative z-50"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <i className="fas fa-times text-xl sm:text-2xl" aria-hidden="true"></i>
            ) : (
              <i className="fas fa-bars text-xl sm:text-2xl" aria-hidden="true"></i>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <div className="fixed top-14 sm:top-16 left-0 right-0 bottom-0 bg-gray-900/98 backdrop-blur-md z-40 md:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto translate-x-0">
            <div className="flex flex-col p-4 sm:p-6 space-y-2 sm:space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="text-gray-300 hover:text-purple-400 active:text-purple-400 active:bg-gray-800/70 transition-colors font-medium text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-5 rounded-lg hover:bg-gray-800/50 touch-manipulation min-h-[44px] flex items-center"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-700/50 space-y-3">
                <div className="px-4 sm:px-5">
                  <span className="text-sm text-gray-400">{userEmail}</span>
                </div>
                <div className="px-4 sm:px-5">
                  <SignOutButton />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
