import React from 'react';
import { Book, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  return (
    <header className="bg-white border-b border-[var(--border)] sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="flex items-center">
            <div className="flex items-center justify-center w-9 h-9 bg-blue-50 rounded-full">
              <Book className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <span className="ml-2 text-base sm:text-lg font-medium text-[var(--text-primary)] truncate">
              Photofine
            </span>
          </Link>
          
          <div className="hidden sm:block">
            <div className="text-sm text-[var(--text-secondary)]">
              Digital albums with page-turning experience
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="sm:hidden btn-icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-[var(--text-primary)]" />
            ) : (
              <Menu className="w-5 h-5 text-[var(--text-primary)]" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white px-4 py-3 shadow-lg border-t border-[var(--border)]">
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-[var(--text-primary)] py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="#" 
              className="text-[var(--text-secondary)] py-2"
              onClick={() => {
                alert('Feature coming soon!');
                setIsMenuOpen(false);
              }}
            >
              About
            </Link>
            <div className="text-sm text-[var(--text-secondary)] pt-2 border-t border-[var(--border)]">
              Digital albums with page-turning experience
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;