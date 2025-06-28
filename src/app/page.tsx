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
      <div className="md:hidden fixed top-20 right-4 z-30">
        <a
          href="https://buymeacoffee.com/kshitijkorz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-black w-10 h-10 rounded-full font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
          title="Buy me a coffee"
        >
          <span className="text-lg">☕</span>
        </a>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12 md:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-black mb-6" style={{ fontFamily: "'Lorieta Huxley', serif" }}>
            Waste My Time
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            A collection of playful, interactive micro-experiences to capture your curiosity
          </p>
        </header>

        {/* Activities grid */}
        <div className="max-w-none mx-auto mb-16 px-4 xl:block">
          {/* Mobile Grid */}
          <div className="xl:hidden grid grid-cols-1 gap-6 justify-items-center max-w-sm mx-auto">
            {activities.map((activity, index) => (
              <Link
                key={activity.id}
                href={activity.path}
                className="group w-full"
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
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-row items-center text-left hover:border-black hover:bg-gray-50 transition-all duration-200 group-hover:scale-105 relative w-full h-32">
                  {activity.id === 'snake-fade' ? (
                    /* Snake game tile - image fills entire rectangle */
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
                  ) : activity.id === 'indian-experiences' ? (
                    /* Indian Experiences tile - image fills entire rectangle */
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <img 
                        src="/images/Indian_Experiences.png" 
                        alt="Indian Experiences"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : activity.id === 'achievements' ? (
                    /* Pointless Achievements tile - image fills entire rectangle */
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <img 
                        src="/images/pointless_achievement.png" 
                        alt="Pointless Achievements"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : activity.id === 'year-progress' ? (
                    /* Year Progress Tracker tile - image fills entire rectangle */
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <img 
                        src="/images/year progress tracker.png" 
                        alt="Year Progress Tracker"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : activity.id === 'scroll-speed' ? (
                    /* Scroll Speed Challenge tile - image fills entire rectangle */
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <img 
                        src="/images/scroll_speed.png" 
                        alt="Scroll Speed Challenge"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : activity.id === 'life-calendar' ? (
                    /* Life Calendar tile - image fills entire rectangle */
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <img 
                        src="/images/life in weeks.png" 
                        alt="Life in Weeks"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : activity.id === 'earths-heartbeat' ? (
                    /* Earth's Heartbeat tile - image fills entire rectangle */
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <img 
                        src="/images/earths_heartbeat.png" 
                        alt="Earth's Heartbeat"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    /* Other activities - horizontal layout */
                    <>
                      <div className="w-10 h-10 mr-3 flex items-center justify-center flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-lg">{activity.emoji}</div>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-black group-hover:underline mb-1">
                          {activity.title}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {activity.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
          
          {/* Desktop Grid */}
          <div className="hidden xl:grid grid-cols-3 gap-12 justify-items-center" style={{ minWidth: '1400px' }}>
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
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-row items-center text-left hover:border-black hover:bg-gray-50 transition-all duration-200 group-hover:scale-105 relative" style={{ width: '416px', height: '157px' }}>
                  {activity.id === 'snake-fade' ? (
                    /* Snake game tile - image fills entire rectangle */
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
                  ) : activity.id === 'indian-experiences' ? (
                    /* Indian Experiences tile - image fills entire rectangle */
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <img 
                        src="/images/Indian_Experiences.png" 
                        alt="Indian Experiences"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : activity.id === 'achievements' ? (
                    /* Pointless Achievements tile - image fills entire rectangle */
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <img 
                        src="/images/pointless_achievement.png" 
                        alt="Pointless Achievements"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : activity.id === 'year-progress' ? (
                    /* Year Progress Tracker tile - image fills entire rectangle */
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <img 
                        src="/images/year progress tracker.png" 
                        alt="Year Progress Tracker"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : activity.id === 'scroll-speed' ? (
                    /* Scroll Speed Challenge tile - image fills entire rectangle */
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <img 
                        src="/images/scroll_speed.png" 
                        alt="Scroll Speed Challenge"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : activity.id === 'life-calendar' ? (
                    /* Life Calendar tile - image fills entire rectangle */
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <img 
                        src="/images/life in weeks.png" 
                        alt="Life in Weeks"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : activity.id === 'earths-heartbeat' ? (
                    /* Earth's Heartbeat tile - image fills entire rectangle */
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <img 
                        src="/images/earths_heartbeat.png" 
                        alt="Earth's Heartbeat"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    /* Other activities - horizontal layout */
                    <>
                      <div className="w-12 h-12 mr-4 flex items-center justify-center flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-xl">{activity.emoji}</div>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-black group-hover:underline mb-1">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {activity.description}
                        </p>
                      </div>
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
          <div className="mt-4 flex justify-center space-x-4 sm:space-x-8 text-xs md:text-sm">
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
