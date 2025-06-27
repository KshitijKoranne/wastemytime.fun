'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const getNavbarStyle = () => {
    switch (pathname) {
      case '/':
        return {
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        };
      case '/achievements':
        return {
          backgroundColor: '#1a1a2e',
          backgroundImage: `
            linear-gradient(45deg, #16213e 25%, transparent 25%),
            linear-gradient(-45deg, #16213e 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #16213e 75%),
            linear-gradient(-45deg, transparent 75%, #16213e 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          borderBottom: '4px solid #ffd700'
        };
      case '/indian-experiences':
        return {
          background: 'linear-gradient(90deg, #ff9a56, #ffad56, #fb8c00)',
          backgroundSize: '200% 100%',
          animation: 'gradientMove 3s ease infinite',
          borderBottom: '4px solid #e65100'
        };
      case '/indian-mom-gpt':
        return {
          background: 'linear-gradient(135deg, #ff9a56, #ffad56, #fb8c00)',
          backgroundSize: '200% 100%',
          animation: 'gradientMove 3s ease infinite',
          borderBottom: '4px solid #dc2626',
          boxShadow: '0 4px 20px rgba(220, 38, 38, 0.3)'
        };
      case '/year-progress':
        return {
          background: 'linear-gradient(135deg, #1e1b4b, #312e81, #553c9a, #7c3aed, #a855f7)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 10s ease infinite',
          borderBottom: '4px solid #a855f7',
          boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3)'
        };
      case '/scroll-speed':
        return {
          background: 'linear-gradient(135deg, #63b3ed, #40e0d0, #86efac, #fbbf80, #c4b5fd)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease infinite',
          borderBottom: '4px solid #63b3ed',
          boxShadow: '0 4px 20px rgba(99, 179, 237, 0.3)'
        };
      case '/snake-fade':
        return {
          background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d, #404040, #1a1a1a)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 6s ease infinite',
          borderBottom: '4px solid #00ff00',
          boxShadow: '0 4px 20px rgba(0, 255, 0, 0.2)'
        };
      default:
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e5e7eb'
        };
    }
  };

  const getLogoStyle = () => {
    switch (pathname) {
      case '/':
        return {
          fontFamily: 'cursive',
          color: '#000000',
          textShadow: '0 0 10px rgba(0,0,0,0.2), 1px 1px 0px rgba(255,255,255,0.8)',
          fontWeight: 'bold',
          fontSize: '1.15em',
          transform: 'rotate(-1deg)',
          letterSpacing: '1px'
        };
      case '/achievements':
        return {
          fontFamily: 'monospace',
          color: '#ffd700',
          textShadow: '0 0 20px #ffd700, 3px 3px 0px #000, 0 0 40px rgba(255, 215, 0, 0.3)',
          fontWeight: 'bold',
          fontSize: '1.1em',
          letterSpacing: '2px',
          transform: 'rotate(0.5deg)'
        };
      case '/indian-experiences':
        return {
          fontFamily: 'serif',
          color: '#ffffff',
          textShadow: '0 0 15px rgba(255,255,255,0.9), 3px 3px 0px #e65100, 0 0 30px rgba(230, 81, 0, 0.4)',
          fontWeight: 'bold',
          fontSize: '1.1em',
          transform: 'rotate(-0.8deg)',
          letterSpacing: '0.5px'
        };
      case '/indian-mom-gpt':
        return {
          fontFamily: 'cursive',
          color: '#ffffff',
          textShadow: '0 0 20px rgba(255,255,255,0.9), 4px 4px 0px #dc2626, 0 0 35px rgba(220, 38, 38, 0.4)',
          fontWeight: 'bold',
          fontSize: '1.15em',
          transform: 'rotate(-0.8deg)',
          letterSpacing: '1px'
        };
      case '/year-progress':
        return {
          fontFamily: 'sans-serif',
          color: '#ffffff',
          textShadow: '0 0 25px rgba(168, 85, 247, 0.9), 3px 3px 0px #1e1b4b, 0 0 40px rgba(168, 85, 247, 0.4)',
          fontWeight: 'bold',
          fontSize: '1.12em',
          letterSpacing: '1px',
          transform: 'rotate(0.3deg)'
        };
      case '/scroll-speed':
        return {
          fontFamily: 'sans-serif',
          color: '#ffffff',
          textShadow: '0 0 25px rgba(99, 179, 237, 0.9), 3px 3px 0px #40e0d0, 0 0 40px rgba(64, 224, 208, 0.4)',
          fontWeight: 'bold',
          fontSize: '1.12em',
          transform: 'skew(-1deg)',
          letterSpacing: '1.2px'
        };
      case '/snake-fade':
        return {
          fontFamily: 'monospace',
          color: '#00ff00',
          textShadow: '0 0 20px #00ff00, 2px 2px 0px #000, 0 0 40px rgba(0, 255, 0, 0.4)',
          fontWeight: 'bold',
          fontSize: '1.08em',
          letterSpacing: '2px',
          transform: 'rotate(0deg)'
        };
      default:
        return {};
    }
  };


  return (
    <nav className="sticky top-0 z-50 transition-all duration-300" style={getNavbarStyle()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start items-center h-14 md:h-16">
          <Link 
            href="/" 
            className="text-lg md:text-2xl font-bold hover:scale-105 transition-transform truncate"
            style={getLogoStyle()}
          >
            WMT
          </Link>
        </div>
      </div>
    </nav>
  );
}