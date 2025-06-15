'use client';

import Link from "next/link";
import { activities } from "@/data/activities";
import { useState, useEffect } from "react";

export default function Home() {
  const [floatingShapes, setFloatingShapes] = useState<Array<{id: number, x: number, y: number, size: number, color: string, speed: number}>>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate floating shapes
    const shapes = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'][Math.floor(Math.random() * 7)],
      speed: Math.random() * 20 + 10
    }));
    setFloatingShapes(shapes);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };


    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite'
    }}>
      {/* Animated floating shapes */}
      {floatingShapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute rounded-full opacity-20 animate-float"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            backgroundColor: shape.color,
            animationDuration: `${shape.speed}s`,
            animationDelay: `${shape.id * 0.5}s`
          }}
        />
      ))}

      {/* Interactive cursor follower */}
      <div
        className="fixed pointer-events-none z-10 rounded-full opacity-30 mix-blend-difference"
        style={{
          left: mousePosition.x - 25,
          top: mousePosition.y - 25,
          width: '50px',
          height: '50px',
          background: 'radial-gradient(circle, #fff 0%, transparent 70%)',
          transition: 'all 0.1s ease'
        }}
      />

      {/* Buy Me a Coffee - Top Right */}
      <div className="fixed top-20 right-4 z-30 hidden md:block">
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-3 border border-white/30 shadow-xl hover:bg-white/30 transition-all duration-300">
          <a
            href="https://buymeacoffee.com/kshitijkorz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:rotate-1 shadow-lg hover:shadow-xl text-sm"
          >
            <span>☕</span>
            <span>Buy me a coffee</span>
          </a>
        </div>
      </div>

      {/* Buy Me a Coffee - Mobile (in header) */}
      <div className="md:hidden fixed top-20 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-2 border border-white/30 shadow-xl hover:bg-white/30 transition-all duration-300">
          <a
            href="https://buymeacoffee.com/kshitijkorz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-3 py-1.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg text-xs"
          >
            <span>☕</span>
            <span>Coffee</span>
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-20 container mx-auto px-4 py-6 md:py-12">
        <header className="text-center mb-8 md:mb-16">
          {/* Main title with glow effect */}
          <div className="relative mb-6 md:mb-8">
            <h1 className="text-4xl md:text-7xl font-bold mb-4 flex flex-col items-center">
              <span 
                className="font-[family-name:var(--font-fredoka)] text-white transform -rotate-1 hover:rotate-0 transition-transform duration-300"
                style={{
                  textShadow: '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.3)',
                  filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.4))'
                }}
              >
                Waste My Time
              </span>
              <span 
                className="font-[family-name:var(--font-dancing-script)] text-3xl md:text-6xl text-yellow-300 transform rotate-2 hover:-rotate-1 transition-transform duration-300"
                style={{
                  textShadow: '0 0 20px rgba(255,255,0,0.8)',
                  filter: 'drop-shadow(0 0 15px rgba(255,255,0,0.6))'
                }}
              >
                .fun
              </span>
            </h1>
            
            {/* Subtitle with typewriter effect */}
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed px-4" style={{
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              A collection of playful, absurd, interactive micro-experiences that capture your curiosity and hold your attention
            </p>
            
            <div className="mt-6 text-white/70 text-base md:text-lg">
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>P</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>r</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.3s' }}>o</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>c</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.5s' }}>r</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.6s' }}>a</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.7s' }}>s</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.8s' }}>t</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.9s' }}>i</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '1.0s' }}>n</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '1.1s' }}>a</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '1.2s' }}>t</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '1.3s' }}>i</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '1.4s' }}>o</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '1.5s' }}>n</span>
              <span className="ml-2">at its finest!</span>
            </div>
          </div>

        </header>

        {/* Activities grid with enhanced styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto mb-8 md:mb-16">
          {activities.map((activity, index) => (
            <Link
              key={activity.id}
              href={activity.path}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => {
                // Track activity visits for achievements
                const visited = JSON.parse(localStorage.getItem('wastemytime-visited') || '[]');
                if (!visited.includes(activity.id)) {
                  visited.push(activity.id);
                  localStorage.setItem('wastemytime-visited', JSON.stringify(visited));
                }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg group-hover:blur-xl"></div>
              
              <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-4 md:p-8 transition-all duration-500 hover:scale-105 hover:rotate-1 border-2 border-white/30 hover:border-white/50">
                {/* Activity emoji with animation */}
                <div className="text-4xl md:text-6xl mb-3 md:mb-4 text-center group-hover:animate-bounce">
                  {activity.emoji}
                </div>
                
                {/* Activity info */}
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4">
                    {activity.description}
                  </p>
                  
                  {/* Interactive button */}
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-sm md:text-base group-hover:from-pink-500 group-hover:to-yellow-500 transition-all duration-300 group-hover:shadow-lg">
                    <span className="group-hover:animate-pulse">Try It Now!</span>
                    <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform duration-300">→</span>
                  </div>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-yellow-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
                <div className="absolute bottom-3 left-3 w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Enhanced footer */}
        <footer className="text-center text-white/80">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-white/20">
            <p className="text-lg mb-3">
              Made with <span className="animate-pulse text-red-400">❤️</span> for people who enjoy 
              <span className="text-yellow-300 font-medium"> wasting time productively</span>
            </p>
            
            {/* Fun stats */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-300">∞</div>
                <div className="text-xs text-white/60">Time Wasted</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-2xl font-bold text-pink-300">{activities.length}</div>
                <div className="text-xs text-white/60">Distractions</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-300">100%</div>
                <div className="text-xs text-white/60">Pointless</div>
              </div>
            </div>

          </div>
        </footer>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
