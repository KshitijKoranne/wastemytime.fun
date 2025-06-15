'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const getNavbarStyle = () => {
    switch (pathname) {
      case '/':
        return {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        };
      case '/bubble-wrap':
        return {
          backgroundColor: '#f4f1de',
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #e07a5f 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, #3d5a80 2px, transparent 2px)
          `,
          backgroundSize: '50px 50px',
          borderBottom: '4px solid #000000'
        };
      case '/click-me':
        return {
          backgroundColor: '#f9f7ff',
          backgroundImage: `
            linear-gradient(rgba(139, 69, 19, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 69, 19, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          borderBottom: '3px solid #8b4513'
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
      case '/progress-bar':
        return {
          backgroundColor: '#fed7aa',
          backgroundImage: 'linear-gradient(45deg, rgba(251, 146, 60, 0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(251, 146, 60, 0.1) 25%, transparent 25%)',
          backgroundSize: '20px 20px',
          borderBottom: '3px solid #ea580c'
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
          background: 'linear-gradient(135deg, #2ecc71, #27ae60, #16a085, #0891b2, #0284c7)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease infinite',
          borderBottom: '4px solid #0891b2',
          boxShadow: '0 4px 20px rgba(8, 145, 178, 0.3)'
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
          color: '#ffffff',
          textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 50px rgba(255,255,255,0.4), 2px 2px 0px rgba(0,0,0,0.3)',
          fontWeight: 'bold',
          fontSize: '1.15em',
          transform: 'rotate(-1deg)',
          letterSpacing: '1px'
        };
      case '/bubble-wrap':
        return {
          fontFamily: 'serif',
          color: '#3d5a80',
          textShadow: '3px 3px 0px #e07a5f, 0 0 20px rgba(224, 122, 95, 0.4)',
          transform: 'rotate(-1.5deg)',
          fontWeight: 'bold',
          fontSize: '1.1em',
          letterSpacing: '0.5px'
        };
      case '/click-me':
        return {
          fontFamily: 'cursive',
          color: '#8b4513',
          textShadow: '3px 3px 0px #f9f7ff, 0 0 15px rgba(139, 69, 19, 0.3)',
          transform: 'rotate(-1.2deg)',
          fontWeight: 'bold',
          fontSize: '1.08em',
          letterSpacing: '0.8px'
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
      case '/progress-bar':
        return {
          fontFamily: 'monospace',
          color: '#ea580c',
          fontWeight: 'bold',
          textShadow: '2px 2px 0px #fed7aa, 0 0 15px rgba(234, 88, 12, 0.5)',
          transform: 'rotate(0.5deg)',
          fontSize: '1.05em',
          letterSpacing: '1px'
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
          textShadow: '0 0 25px rgba(8, 145, 178, 0.9), 3px 3px 0px #2ecc71, 0 0 40px rgba(46, 204, 113, 0.3)',
          fontWeight: 'bold',
          fontSize: '1.12em',
          transform: 'skew(-2deg)',
          letterSpacing: '1.2px'
        };
      default:
        return {};
    }
  };

  const getHomeIconStyle = () => {
    switch (pathname) {
      case '/':
        return {
          color: '#ffffff',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '8px',
          padding: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        };
      case '/bubble-wrap':
        return {
          color: '#3d5a80',
          border: '2px solid #3d5a80',
          borderRadius: '0',
          padding: '8px',
          backgroundColor: '#ffffff',
          transform: 'rotate(1deg)'
        };
      case '/click-me':
        return {
          color: '#8b4513',
          border: '2px solid #8b4513',
          borderRadius: '0',
          padding: '8px',
          backgroundColor: '#ffffff',
          transform: 'rotate(1deg)',
          boxShadow: '2px 2px 0px rgba(139, 69, 19, 0.3)'
        };
      case '/achievements':
        return {
          color: '#ffd700',
          border: '2px solid #ffd700',
          borderRadius: '0',
          padding: '8px',
          backgroundColor: '#000000',
          boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
        };
      case '/progress-bar':
        return {
          color: '#ea580c',
          border: '2px solid #ea580c',
          borderRadius: '0',
          padding: '8px',
          backgroundColor: '#fed7aa'
        };
      case '/indian-experiences':
        return {
          color: '#ffffff',
          border: '2px solid #ffffff',
          borderRadius: '0',
          padding: '8px',
          backgroundColor: '#e65100',
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
        };
      case '/indian-mom-gpt':
        return {
          color: '#ffffff',
          border: '3px solid #ffffff',
          borderRadius: '12px',
          padding: '10px',
          backgroundColor: '#dc2626',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.4), 0 0 10px rgba(220, 38, 38, 0.6)',
          transform: 'scale(1.05)'
        };
      case '/year-progress':
        return {
          color: '#ffffff',
          border: '3px solid #a855f7',
          borderRadius: '12px',
          padding: '10px',
          backgroundColor: '#7c3aed',
          boxShadow: '0 0 25px rgba(168, 85, 247, 0.5), 0 0 15px rgba(124, 58, 237, 0.7)',
          transform: 'scale(1.05)'
        };
      case '/scroll-speed':
        return {
          color: '#ffffff',
          border: '3px solid #0891b2',
          borderRadius: '12px',
          padding: '10px',
          backgroundColor: '#16a085',
          boxShadow: '0 0 25px rgba(8, 145, 178, 0.5), 0 0 15px rgba(22, 160, 133, 0.7)',
          transform: 'scale(1.05) rotate(-2deg)'
        };
      default:
        return {
          color: '#6b7280'
        };
    }
  };

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300" style={getNavbarStyle()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          <Link 
            href="/" 
            className="text-lg md:text-2xl font-bold hover:scale-105 transition-transform truncate"
            style={getLogoStyle()}
          >
            Waste My Time.fun
          </Link>
          
          <Link 
            href="/" 
            className="transition-all hover:scale-105 flex-shrink-0"
            title="Home"
            style={getHomeIconStyle()}
          >
            <svg 
              className="w-5 h-5 md:w-6 md:h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}