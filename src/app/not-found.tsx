'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const funnyMessages = [
    "Oops! You found a page that doesn't exist!",
    "404: Page not found, but banana found!",
    "This page went to get bananas and never came back!",
    "Error 404: Page is probably at a banana convention",
    "Page not found, but hey, at least there's a dancing banana!",
    "This URL is as lost as a banana in a fruit salad!",
    "404: Even our banana can't find this page!"
  ];

  const bananaFacts = [
    "Bananas are berries, but strawberries aren't!",
    "Bananas are radioactive (but safe to eat)!",
    "A banana plant is actually a herb, not a tree!",
    "Bananas can help you sleep better!",
    "The banana emoji is the most used fruit emoji!",
    "Bananas share 50% of their DNA with humans!",
    "Bananas are naturally slightly radioactive!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const handleBananaClick = () => {
    setClickCount(prev => prev + 1);
  };

  const getCurrentMessage = () => {
    return funnyMessages[clickCount % funnyMessages.length];
  };

  const getCurrentFact = () => {
    return bananaFacts[clickCount % bananaFacts.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-orange-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {getCurrentMessage()}
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            You wasted your time finding a broken page. Here's entertainment instead!
          </p>
        </div>

        <div className="mb-8">
          <div 
            className={`cursor-pointer hover:scale-110 transition-all duration-300 inline-block ${
              isAnimating ? 'animate-bounce' : ''
            } ${clickCount > 0 ? 'animate-pulse' : ''}`}
            onClick={handleBananaClick}
          >
            <img 
              src="/images/dancing-banana.jpg" 
              alt="Dancing Banana" 
              className="w-32 h-32 md:w-40 md:h-40 object-contain mx-auto rounded-2xl shadow-lg"
              style={{
                transform: isAnimating ? 'rotate(5deg)' : 'rotate(-5deg)',
                transition: 'transform 0.3s ease-in-out'
              }}
            />
          </div>
          <div className="mt-4 text-gray-600">
            {clickCount > 0 && (
              <div className="animate-bounce">
                <p className="font-semibold">Banana clicks: {clickCount}</p>
                <p className="text-sm mt-2">🍌 Fun fact: {getCurrentFact()}</p>
              </div>
            )}
            {clickCount === 0 && (
              <p className="text-sm">👆 Click the banana to make it dance more!</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Since you're here, why not try one of these?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/earths-heartbeat" 
              className="group"
            >
              <div className="bg-white border-2 border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all duration-200 group-hover:scale-105 relative w-full h-32">
                {/* Earth's Heartbeat tile - image fills entire rectangle */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <img 
                    src="/images/earths_heartbeat.png" 
                    alt="Earth's Heartbeat"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Link>
            <Link 
              href="/snake-fade" 
              className="group"
            >
              <div className="bg-white border-2 border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all duration-200 group-hover:scale-105 relative w-full h-32">
                {/* Snake game tile - image fills entire rectangle */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <img 
                    src="/images/snake.png" 
                    alt="Snake Game"
                    className="w-full h-full object-cover"
                    style={{ 
                      imageRendering: 'crisp-edges'
                    }}
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <Link 
            href="/" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
          >
            🏠 Take me home
          </Link>
          
          <div className="text-gray-500 text-sm">
            <p>Fun fact: You've now seen a dancing banana, so your day is officially better!</p>
            <p className="mt-2">This 404 page is probably more entertaining than the page you were looking for anyway. 🤷‍♂️</p>
          </div>
        </div>

        {clickCount > 10 && (
          <div className="mt-8 p-4 bg-yellow-100 border-2 border-yellow-300 rounded-lg">
            <p className="text-yellow-800 font-semibold">
              🏆 Banana Master! You've clicked the banana {clickCount} times!
            </p>
            <p className="text-yellow-700 text-sm mt-1">
              You're clearly dedicated to the art of banana clicking. Respect! 🍌
            </p>
          </div>
        )}
      </div>
    </div>
  );
}