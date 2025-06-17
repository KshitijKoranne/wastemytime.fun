'use client';

import Link from "next/link";
import { activities } from "@/data/activities";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Buy Me a Coffee - Top Right */}
      <div className="fixed top-20 right-4 z-30 hidden md:block">
        <a
          href="https://buymeacoffee.com/kshitijkorz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md text-sm"
        >
          <span>☕</span>
          <span>Buy me a coffee</span>
        </a>
      </div>

      {/* Buy Me a Coffee - Mobile */}
      <div className="md:hidden fixed top-20 left-1/2 transform -translate-x-1/2 z-30">
        <a
          href="https://buymeacoffee.com/kshitijkorz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-lg font-medium transition-colors duration-200 shadow-sm text-xs"
        >
          <span>☕</span>
          <span>Coffee</span>
        </a>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12 md:mb-20">
          <h1 className="text-5xl md:text-8xl font-bold text-black mb-6" style={{ fontFamily: "'Lorieta Huxley', serif" }}>
            Waste My Time
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A collection of playful, interactive micro-experiences to capture your curiosity
          </p>
        </header>

        {/* Activities grid */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {activities.map((activity, index) => (
              <Link
                key={activity.id}
                href={activity.path}
                className="group"
                onClick={() => {
                  // Track activity visits
                  if (typeof window !== 'undefined') {
                    const visited = JSON.parse(localStorage.getItem('wastemytime-visited') || '[]');
                    if (!visited.includes(activity.id)) {
                      visited.push(activity.id);
                      localStorage.setItem('wastemytime-visited', JSON.stringify(visited));
                    }
                  }
                }}
              >
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 h-56 flex flex-col justify-center items-center text-center hover:border-black hover:bg-gray-50 transition-all duration-200 group-hover:scale-105 relative">
                  {activity.id === 'snake-fade' ? (
                    /* Snake game tile - image fills entire rectangle */
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <img 
                        src="/images/snake.png" 
                        alt="Snake Game"
                        className="w-full h-full object-cover"
                        style={{ 
                          imageRendering: 'crisp-edges'
                        }}
                      />
                    </div>
                  ) : (
                    /* Other activities - normal layout with placeholder */
                    <>
                      <div className="w-20 h-20 mb-4 flex items-center justify-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="w-10 h-10 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-black group-hover:underline mb-2">
                        {activity.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {activity.description}
                      </p>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 border-t border-gray-200 pt-8">
          <p className="text-sm md:text-base">
            Made for people who enjoy wasting time productively
          </p>
          <div className="mt-4 flex justify-center space-x-8 text-xs md:text-sm">
            <div>
              <div className="font-mono text-lg text-black">∞</div>
              <div>Time Wasted</div>
            </div>
            <div>
              <div className="font-mono text-lg text-black">{activities.length}</div>
              <div>Activities</div>
            </div>
            <div>
              <div className="font-mono text-lg text-black">100%</div>
              <div>Pointless</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
