import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileHeaderProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

function MobileHeader({ mobileMenuOpen, toggleMobileMenu }: MobileHeaderProps) {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-10">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold text-blue-600">MedConnect</h1>
        <button onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
}

export default MobileHeader;