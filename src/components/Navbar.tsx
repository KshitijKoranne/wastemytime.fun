'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const getNavbarStyle = () => {
    // Handle 404 pages and unknown routes
    if (pathname === '/not-found' || !pathname || pathname.includes('404')) {
      return {
        background: 'rgba(255, 165, 0, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '3px solid #ea580c',
        boxShadow: '0 8px 32px rgba(234, 88, 12, 0.3)'
      };
    }
    
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
      case '/life-calendar':
        return {
          background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0, #cbd5e1, #94a3b8, #64748b)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 12s ease infinite',
          borderBottom: '4px solid #64748b',
          boxShadow: '0 4px 20px rgba(100, 116, 139, 0.3)'
        };
      case '/earths-heartbeat':
        return {
          background: 'linear-gradient(135deg, #0c1445, #1a1f3a, #2d3561, #1e2a5e, #0f1b4c)',
          backgroundSize: '400% 400%',
          animation: 'earthPulse 15s ease infinite',
          borderBottom: '4px solid #3b82f6',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)'
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
    // Handle 404 pages and unknown routes
    if (pathname === '/not-found' || !pathname || pathname.includes('404')) {
      return {
        fontFamily: 'cursive',
        color: '#ffffff',
        textShadow: '0 0 15px rgba(255,255,255,0.9), 3px 3px 0px #ea580c, 0 0 30px rgba(234, 88, 12, 0.4)',
        fontWeight: 'bold',
        fontSize: '1.15em',
        transform: 'rotate(-1deg)',
        letterSpacing: '1px'
      };
    }
    
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
      case '/life-calendar':
        return {
          fontFamily: 'monospace',
          color: '#1e293b',
          textShadow: '0 0 30px rgba(255, 255, 255, 0.9), 2px 2px 0px #ffffff, 0 0 20px rgba(30, 41, 59, 0.8)',
          fontWeight: 'bold',
          fontSize: '1.15em',
          transform: 'rotate(-1deg)',
          letterSpacing: '2px',
          background: 'linear-gradient(45deg, #ffffff, #f8fafc, #e2e8f0)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(2px 2px 0px #1e293b)',
          border: '2px solid #64748b',
          padding: '4px 8px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)'
        };
      case '/earths-heartbeat':
        return {
          fontFamily: 'fantasy',
          color: '#60a5fa',
          textShadow: '0 0 30px rgba(96, 165, 250, 0.9), 3px 3px 0px #1e3a8a, 0 0 50px rgba(59, 130, 246, 0.6)',
          fontWeight: 'bold',
          fontSize: '1.2em',
          letterSpacing: '1.5px',
          transform: 'rotate(0.3deg)',
          background: 'linear-gradient(135deg, #dbeafe, #93c5fd, #60a5fa, #3b82f6)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(2px 2px 0px #1e3a8a) drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))',
          border: '2px solid #3b82f6',
          padding: '6px 12px',
          borderRadius: '12px',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          animation: 'cosmicGlow 3s ease-in-out infinite alternate'
        };
      default:
        return {};
    }
  };


  return (
    <>
      <nav className="sticky top-0 z-50 transition-all duration-300" style={getNavbarStyle()}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start items-center h-14 md:h-16">
            <div className="group relative transition-all duration-500">
              <Link 
                href="/" 
                className="block font-bold transition-all duration-500"
                style={getLogoStyle()}
              >
                <span className="text-lg md:text-2xl group-hover:opacity-0 transition-opacity duration-300 inline-block min-w-[3ch]">
                  WMT
                </span>
                <span 
                  className="absolute top-0 left-0 text-sm md:text-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-full group-hover:translate-x-0 whitespace-nowrap"
                  style={getLogoStyle()}
                >
                  Waste My Time
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* CSS animations for navbar styles */}
      <style jsx>{`
        @keyframes cosmicGlow {
          0% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.4), inset 0 0 10px rgba(59, 130, 246, 0.2);
          }
          100% { 
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.8), inset 0 0 20px rgba(59, 130, 246, 0.4);
          }
        }
        
        /* Enhanced hover effects for logo expansion */
        .group {
          overflow: visible;
          width: auto;
          min-width: 3rem;
        }
        
        .group:hover {
          transform: scale(1.02);
          width: auto;
        }
        
        .group .absolute {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          z-index: 10;
        }
        
        /* Ensure expanded text is fully visible */
        .group:hover .absolute {
          position: absolute;
          top: 0;
          left: 0;
          transform: translateX(0);
          opacity: 1;
          width: auto;
          min-width: max-content;
        }
        
        /* Smooth slide-in animation */
        @keyframes slideInFromRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        /* Ensure navbar has enough space */
        nav {
          overflow: visible;
        }
        
        .max-w-7xl {
          overflow: visible;
        }
      `}</style>
    </>
  );
}