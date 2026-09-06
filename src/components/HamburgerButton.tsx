import React from 'react';
import { Menu, X } from 'lucide-react';

interface HamburgerButtonProps {
  onClick: () => void;
  isOpen?: boolean;
  className?: string;
  title?: string;
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  onClick,
  isOpen = false,
  className = '',
  title = 'Toggle navigation menu'
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      id="hamburger-navigation-button"
      aria-label={title}
      title={title}
      className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
        isOpen
          ? 'bg-[#1A1E25] text-[#00D1FF]'
          : 'text-slate-400 hover:text-slate-100 hover:bg-[#1A1E25]'
      } ${className}`}
    >
      {isOpen ? (
        <X size={20} className="stroke-[2.2]" />
      ) : (
        <Menu size={20} className="stroke-[2.2]" />
      )}
    </button>
  );
};
