'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Bubble {
  id: number;
  row: number;
  col: number;
  popped: boolean;
}

export default function VirtualBubbleWrap() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [totalBubbles, setTotalBubbles] = useState(0);
  const [gridSize, setGridSize] = useState({ rows: 10, cols: 15 });
  const [isAutoRefill, setIsAutoRefill] = useState(true);
  const [popSound, setPopSound] = useState(true);
  const [celebrationMode, setCelebrationMode] = useState(false);

  const satisfyingMessages = [
    "Pop! 🫧",
    "Satisfying! ✨",
    "Keep going! 💪",
    "So therapeutic! 😌",
    "Pop pop pop! 🎉",
    "Stress relief! 🧘‍♀️",
    "Bubble destroyed! 💥",
    "Oddly satisfying! 😍"
  ];

  const generateBubbles = useCallback(() => {
    const newBubbles: Bubble[] = [];
    let id = 0;
    
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        newBubbles.push({
          id: id++,
          row,
          col,
          popped: false
        });
      }
    }
    
    setBubbles(newBubbles);
    setTotalBubbles(newBubbles.length);
    setPoppedCount(0);
  }, [gridSize]);

  useEffect(() => {
    generateBubbles();
  }, [generateBubbles]);

  const popBubble = (bubbleId: number) => {
    setBubbles(prev => 
      prev.map(bubble => 
        bubble.id === bubbleId ? { ...bubble, popped: true } : bubble
      )
    );
    
    setPoppedCount(prev => prev + 1);

    // Play pop sound effect (visual feedback)
    if (popSound) {
      // We'll use visual feedback instead of actual audio
      const bubble = document.getElementById(`bubble-${bubbleId}`);
      if (bubble) {
        bubble.style.transform = 'scale(1.2)';
        setTimeout(() => {
          bubble.style.transform = 'scale(0)';
        }, 100);
      }
    }

    // Check if all bubbles are popped
    const allPopped = bubbles.filter(b => b.id !== bubbleId).every(b => b.popped);
    if (allPopped) {
      setCelebrationMode(true);
      setTimeout(() => {
        setCelebrationMode(false);
        if (isAutoRefill) {
          generateBubbles();
        }
      }, 2000);
    }
  };

  const resetBubbles = () => {
    generateBubbles();
    setCelebrationMode(false);
  };

  const changeGridSize = (size: 'small' | 'medium' | 'large') => {
    const sizes = {
      small: { rows: 8, cols: 12 },
      medium: { rows: 10, cols: 15 },
      large: { rows: 12, cols: 18 }
    };
    setGridSize(sizes[size]);
  };

  const getBubbleStyle = (bubble: Bubble) => {
    if (bubble.popped) {
      return 'bg-gray-200 border-gray-300 transform scale-0 transition-all duration-200';
    }
    
    return 'bg-gradient-to-br from-blue-200 to-blue-300 border-blue-400 hover:from-blue-300 hover:to-blue-400 transform hover:scale-110 transition-all duration-150 cursor-pointer shadow-lg';
  };

  const getRandomMessage = () => {
    return satisfyingMessages[Math.floor(Math.random() * satisfyingMessages.length)];
  };

  const progress = totalBubbles > 0 ? (poppedCount / totalBubbles) * 100 : 0;

  return (
    <div className="min-h-screen p-4" style={{
      backgroundColor: '#f4f1de',
      backgroundImage: `
        radial-gradient(circle at 25% 25%, #e07a5f 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, #3d5a80 2px, transparent 2px)
      `,
      backgroundSize: '50px 50px'
    }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{
            fontFamily: 'serif',
            color: '#3d5a80',
            textShadow: '3px 3px 0px #e07a5f',
            transform: 'rotate(-2deg)'
          }}>
            Bubble Pop Therapy
          </h1>
          <div className="bg-white border-4 border-black p-3 md:p-4 inline-block transform rotate-1 shadow-lg">
            <p className="text-base md:text-lg font-serif text-gray-800">
              "Satisfaction Guaranteed Since Never!"
            </p>
            <div className="text-sm text-gray-600 mt-2">★ ★ ★ ★ ☆</div>
          </div>

          {celebrationMode && (
            <div className="mt-6 bg-yellow-300 border-4 border-black p-3 md:p-4 inline-block transform -rotate-1 shadow-lg">
              <div className="text-xl md:text-2xl font-bold text-black">
                🎉 CONGRATULATIONS! 🎉
              </div>
              <div className="text-sm">You've achieved bubble mastery!</div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 md:gap-4 justify-center mb-6">
          <div className="bg-white border-2 border-black px-3 md:px-4 py-2 transform rotate-1 shadow-lg">
            <span className="font-serif font-bold text-black text-sm md:text-base">
              Popped: {poppedCount}/{totalBubbles}
            </span>
          </div>
          <div className="bg-white border-2 border-black px-3 md:px-4 py-2 transform -rotate-1 shadow-lg">
            <span className="font-serif font-bold text-black text-sm md:text-base">
              Success Rate: {Math.round(progress)}%
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <button
            onClick={() => changeGridSize('small')}
            className="bg-white border-3 border-black hover:bg-yellow-200 text-black px-3 md:px-4 py-2 font-serif font-bold transform hover:scale-105 transition-all shadow-lg text-sm md:text-base"
          >
            SMALL
          </button>
          <button
            onClick={() => changeGridSize('medium')}
            className="bg-white border-3 border-black hover:bg-yellow-200 text-black px-3 md:px-4 py-2 font-serif font-bold transform hover:scale-105 transition-all shadow-lg text-sm md:text-base"
          >
            MEDIUM
          </button>
          <button
            onClick={() => changeGridSize('large')}
            className="bg-white border-3 border-black hover:bg-yellow-200 text-black px-3 md:px-4 py-2 font-serif font-bold transform hover:scale-105 transition-all shadow-lg text-sm md:text-base"
          >
            LARGE
          </button>
          <button
            onClick={resetBubbles}
            className="bg-red-400 border-3 border-black hover:bg-red-500 text-black px-3 md:px-4 py-2 font-serif font-bold transform hover:scale-105 transition-all shadow-lg text-sm md:text-base"
          >
            RESET
          </button>
          <button
            onClick={() => setIsAutoRefill(!isAutoRefill)}
            className={`${isAutoRefill ? 'bg-green-400' : 'bg-gray-400'} border-3 border-black hover:scale-105 text-black px-3 md:px-4 py-2 font-serif font-bold transform transition-all shadow-lg text-sm md:text-base`}
          >
            AUTO: {isAutoRefill ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="bg-white border-4 border-black p-3 md:p-6 mb-6 transform rotate-1 shadow-xl">
          <div 
            className="grid gap-1 md:gap-2 justify-center"
            style={{ 
              gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
              maxWidth: '100%'
            }}
          >
            {bubbles.map((bubble) => (
              <div
                key={bubble.id}
                id={`bubble-${bubble.id}`}
                className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 md:border-3 border-black transition-all duration-200 ${
                  bubble.popped 
                    ? 'bg-red-300 transform scale-75 opacity-50' 
                    : 'bg-blue-200 hover:bg-blue-300 cursor-pointer transform hover:scale-110 shadow-md'
                }`}
                onClick={() => !bubble.popped && popBubble(bubble.id)}
                style={{
                  aspectRatio: '1/1'
                }}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="bg-white border-4 border-black p-3 md:p-4 max-w-md mx-auto transform -rotate-1 shadow-lg">
            <div className="text-base md:text-lg font-serif font-bold text-black mb-2">Completion Meter</div>
            <div className="bg-black h-4 md:h-6 border-2 border-black">
              <div 
                className="bg-yellow-400 h-full transition-all duration-500 border-r-2 border-black"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white border-2 border-black p-3 md:p-4 max-w-lg mx-auto transform rotate-1 shadow-lg">
            <p className="font-serif text-black text-sm md:text-base">Click the circles to experience authentic bubble satisfaction!</p>
            <p className="font-serif text-xs md:text-sm text-gray-600 mt-2">Warning: May cause excessive relaxation</p>
          </div>
        </div>
      </div>
    </div>
  );
}