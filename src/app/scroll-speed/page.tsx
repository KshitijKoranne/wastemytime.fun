'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface ScrollData {
  delta: number;
  timestamp: number;
}

interface Achievement {
  threshold: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export default function ScrollSpeedTest() {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [bestSpeed, setBestSpeed] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [totalScrolled, setTotalScrolled] = useState(0);
  const [scrollAttempts, setScrollAttempts] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { threshold: 1000, title: 'Getting Started', description: 'First 1K pixels per second!', icon: '🚀', unlocked: false },
    { threshold: 5000, title: 'Speed Demon', description: 'Reached 5K pixels per second!', icon: '⚡', unlocked: false },
    { threshold: 10000, title: 'Scroll Master', description: 'Hit 10K pixels per second!', icon: '🌪️', unlocked: false },
    { threshold: 15000, title: 'Tornado Fingers', description: '15K pixels per second achieved!', icon: '🌀', unlocked: false },
    { threshold: 20000, title: 'Superhuman', description: '20K pixels per second - Are you even human?', icon: '🦸', unlocked: false },
    { threshold: 25000, title: 'Scroll God', description: 'The legendary 25K+ pixels per second!', icon: '👑', unlocked: false },
  ]);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  
  const lastSecondData = useRef<ScrollData[]>([]);
  const startTime = useRef<number>(Date.now());
  const animationFrame = useRef<number>();

  // Color interpolation function
  const getColorForSpeed = (speed: number): string => {
    const maxSpeed = 25000;
    const normalizedSpeed = Math.min(speed / maxSpeed, 1);
    
    if (normalizedSpeed < 0.33) {
      // Green to Orange
      const ratio = normalizedSpeed / 0.33;
      const r = Math.floor(46 + (255 - 46) * ratio);
      const g = Math.floor(204 + (154 - 204) * ratio);
      const b = Math.floor(113 + (66 - 113) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (normalizedSpeed < 0.66) {
      // Orange to Red
      const ratio = (normalizedSpeed - 0.33) / 0.33;
      const r = Math.floor(255);
      const g = Math.floor(154 - 78 * ratio);
      const b = Math.floor(66 - 6 * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Red to Purple
      const ratio = (normalizedSpeed - 0.66) / 0.34;
      const r = Math.floor(255 - 124 * ratio);
      const g = Math.floor(76 - 76 * ratio);
      const b = Math.floor(60 + 195 * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const getFontSize = (speed: number): number => {
    return Math.min(32 + (speed / 25000) * 100, 200);
  };

  const calculateSpeed = useCallback(() => {
    const now = Date.now();
    let total = 0;
    
    // Filter data from the last second and sum deltas
    lastSecondData.current = lastSecondData.current.filter(data => {
      if (now - data.timestamp <= 1000) {
        total += data.delta;
        return true;
      }
      return false;
    });

    return Math.round(total);
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = Math.abs(e.deltaY);
    
    lastSecondData.current.push({
      delta,
      timestamp: Date.now()
    });

    setTotalScrolled(prev => prev + delta);
    setIsScrolling(true);

    // Reset scrolling state after a delay
    setTimeout(() => setIsScrolling(false), 100);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Estimate scroll delta from touch movement
    const touch = e.touches[0];
    if (touch) {
      const delta = 50; // Approximate delta for touch
      lastSecondData.current.push({
        delta,
        timestamp: Date.now()
      });
      setTotalScrolled(prev => prev + delta);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 100);
    }
  }, []);

  const updateSpeed = useCallback(() => {
    const speed = calculateSpeed();
    setCurrentSpeed(speed);
    
    if (speed > bestSpeed) {
      setBestSpeed(speed);
      
      // Check for new achievements
      achievements.forEach((achievement, index) => {
        if (speed >= achievement.threshold && !achievement.unlocked) {
          setAchievements(prev => {
            const updated = [...prev];
            updated[index] = { ...achievement, unlocked: true };
            return updated;
          });
          setNewAchievement(achievement);
          setTimeout(() => setNewAchievement(null), 3000);
        }
      });
    }
    
    animationFrame.current = requestAnimationFrame(updateSpeed);
  }, [calculateSpeed, bestSpeed, achievements]);

  const reset = () => {
    setBestSpeed(0);
    setCurrentSpeed(0);
    setTotalScrolled(0);
    setScrollAttempts(0);
    setTimeElapsed(0);
    lastSecondData.current = [];
    startTime.current = Date.now();
    setAchievements(prev => prev.map(a => ({ ...a, unlocked: false })));
  };

  useEffect(() => {
    const handleStart = () => {
      setScrollAttempts(prev => prev + 1);
    };

    // Timer for elapsed time
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('wheel', handleStart, { once: true });
    window.addEventListener('touchmove', handleStart, { once: true });

    // Start animation loop
    animationFrame.current = requestAnimationFrame(updateSpeed);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('wheel', handleStart);
      window.removeEventListener('touchmove', handleStart);
      clearInterval(timer);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [handleWheel, handleTouchMove, updateSpeed]);

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getSpeedRating = (speed: number): string => {
    if (speed >= 25000) return 'LEGENDARY 👑';
    if (speed >= 20000) return 'SUPERHUMAN 🦸';
    if (speed >= 15000) return 'TORNADO 🌀';
    if (speed >= 10000) return 'MASTER 🌪️';
    if (speed >= 5000) return 'DEMON ⚡';
    if (speed >= 1000) return 'FAST 🚀';
    return 'GETTING STARTED 🐌';
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden"
      style={{ 
        backgroundColor: currentSpeed > 0 ? getColorForSpeed(currentSpeed) : '#2ecc71',
      }}
    >
      {/* Particle effects when scrolling fast */}
      {currentSpeed > 5000 && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: Math.min(Math.floor(currentSpeed / 1000), 50) }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/60 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Achievement notification */}
      {newAchievement && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="bg-yellow-400 text-black p-4 rounded-lg border-4 border-black shadow-2xl max-w-sm font-bold">
            <div className="text-center">
              <div className="text-3xl mb-2 animate-bounce">{newAchievement.icon}</div>
              <div className="text-sm uppercase tracking-wide">ACHIEVEMENT UNLOCKED!</div>
              <div className="text-lg">{newAchievement.title}</div>
              <div className="text-xs">{newAchievement.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="text-center relative z-10 px-4">
        {currentSpeed === 0 ? (
          // Welcome screen
          <div className="animate-pulse">
            <h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              style={{
                textShadow: '4px 4px 0px rgba(0,0,0,0.3)',
                animation: 'pulse 1s infinite alternate'
              }}
            >
              Scroll Speed Challenge
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-medium">
              How fast can you scroll? 🏃‍♂️💨
            </p>
            <div className="text-lg md:text-xl text-white/80 mb-6">
              Use your mouse wheel or touchpad to scroll as fast as possible!
            </div>
            {bestSpeed > 0 && (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30 mb-6">
                <div className="text-white text-lg font-bold mb-2">🏆 Your Best Record</div>
                <div className="text-3xl font-bold text-yellow-300">
                  {formatNumber(bestSpeed)} pixels/sec
                </div>
                <div className="text-white/80 text-sm mt-2">{getSpeedRating(bestSpeed)}</div>
              </div>
            )}
            <div className="text-white/60 text-sm">
              💡 Tip: Try different scroll techniques - fast small scrolls vs. big wheel movements!
            </div>
          </div>
        ) : (
          // Active scrolling display
          <div className="text-center">
            <div 
              className="text-white font-bold mb-4 transition-all duration-150"
              style={{ 
                fontSize: `${Math.min(getFontSize(currentSpeed), 120)}px`,
                textShadow: '4px 4px 0px rgba(0,0,0,0.5)',
                lineHeight: '1.1'
              }}
            >
              {formatNumber(currentSpeed)}
            </div>
            <div className="text-xl md:text-2xl text-white font-medium mb-2">
              pixels per second
            </div>
            <div className="text-lg text-white/90">
              {getSpeedRating(currentSpeed)}
            </div>
          </div>
        )}
      </div>

      {/* Stats panel */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80">
        <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-white text-center">
            <div>
              <div className="text-lg font-bold text-yellow-400">{formatNumber(bestSpeed)}</div>
              <div className="text-xs opacity-80">Best Speed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">{formatNumber(Math.floor(totalScrolled))}</div>
              <div className="text-xs opacity-80">Total Pixels</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="text-lg font-bold text-green-400">{achievements.filter(a => a.unlocked).length}/{achievements.length}</div>
              <div className="text-xs opacity-80">Achievements</div>
            </div>
          </div>
          
          {/* Quick reset button */}
          <button
            onClick={reset}
            className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-all"
          >
            🔄 Reset All Stats
          </button>
        </div>
      </div>

      {/* Achievements list */}
      <div className="fixed top-4 left-4 max-w-xs">
        <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
          <h3 className="text-white font-bold mb-3 text-center">🏆 Achievements</h3>
          <div className="space-y-2">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 text-xs transition-all ${
                  achievement.unlocked 
                    ? 'text-yellow-400 transform scale-105' 
                    : 'text-white/40'
                }`}
              >
                <span className="text-base">{achievement.unlocked ? achievement.icon : '🔒'}</span>
                <div>
                  <div className="font-medium">{achievement.title}</div>
                  <div className="text-xs opacity-80">{formatNumber(achievement.threshold)} px/s</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
        
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}