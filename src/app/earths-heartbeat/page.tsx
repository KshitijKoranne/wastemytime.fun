'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

interface GlobalStat {
  id: string;
  title: string;
  value: number;
  unit: string;
  perSecond: number;
  icon: string;
  color: string;
  category: 'life' | 'environment' | 'economy' | 'technology';
  description: string;
  source: string;
}

interface PersonalContext {
  birthDate: Date | null;
  ageInSeconds: number;
  personalStats: Record<string, number>;
}

interface AIInsight {
  insight: string;
  reflection: string;
  funFact: string;
  statId: string;
  timestamp: string;
}

export default function EarthsHeartbeat() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [selectedStat, setSelectedStat] = useState<GlobalStat | null>(null);
  const [startTime] = useState<Date>(new Date());
  const [aiInsights, setAiInsights] = useState<Record<string, AIInsight>>({});
  const [loadingInsight, setLoadingInsight] = useState<boolean>(false);

  // Global statistics with real-world data (approximate rates per second)
  const globalStats: GlobalStat[] = useMemo(() => [
    {
      id: 'births',
      title: 'Babies Born',
      value: 0,
      unit: 'births',
      perSecond: 4.3, // ~370,000 births per day
      icon: '👶',
      color: 'from-pink-400 to-pink-600',
      category: 'life',
      description: 'New life beginning around the world',
      source: 'UN World Population Prospects'
    },
    {
      id: 'deaths',
      title: 'Lives Completed',
      value: 0,
      unit: 'deaths',
      perSecond: 1.8, // ~150,000 deaths per day
      icon: '🕊️',
      color: 'from-purple-400 to-purple-600',
      category: 'life',
      description: 'Souls returning to the universe',
      source: 'UN World Population Prospects'
    },
    {
      id: 'heartbeats',
      title: 'Human Heartbeats',
      value: 0,
      unit: 'beats',
      perSecond: 608000000, // 8 billion people × 76 bpm average
      icon: '💓',
      color: 'from-red-400 to-red-600',
      category: 'life',
      description: 'The collective rhythm of humanity',
      source: 'Estimated global average'
    },
    {
      id: 'co2',
      title: 'CO₂ Emissions',
      value: 0,
      unit: 'tons',
      perSecond: 1100, // ~36 billion tons per year
      icon: '🌫️',
      color: 'from-gray-400 to-gray-600',
      category: 'environment',
      description: 'Carbon released into our atmosphere',
      source: 'Global Carbon Project'
    },
    {
      id: 'trees',
      title: 'Trees Cut Down',
      value: 0,
      unit: 'trees',
      perSecond: 0.48, // ~15 billion trees per year
      icon: '🌳',
      color: 'from-green-400 to-green-600',
      category: 'environment',
      description: 'Ancient guardians falling',
      source: 'Nature journal estimates'
    },
    {
      id: 'plastic',
      title: 'Plastic Produced',
      value: 0,
      unit: 'kg',
      perSecond: 11000, // ~350 million tons per year
      icon: '🗂️',
      color: 'from-blue-400 to-blue-600',
      category: 'environment',
      description: 'Material that will outlast us all',
      source: 'Plastics Europe'
    },
    {
      id: 'money',
      title: 'Money Spent',
      value: 0,
      unit: 'USD',
      perSecond: 2700000, // ~$85 trillion global GDP
      icon: '💰',
      color: 'from-yellow-400 to-yellow-600',
      category: 'economy',
      description: 'Economic energy flowing globally',
      source: 'World Bank GDP data'
    },
    {
      id: 'internet',
      title: 'Internet Searches',
      value: 0,
      unit: 'searches',
      perSecond: 99000, // ~8.5 billion per day
      icon: '🔍',
      color: 'from-indigo-400 to-indigo-600',
      category: 'technology',
      description: 'Collective human curiosity',
      source: 'Internet Live Stats'
    },
    {
      id: 'emails',
      title: 'Emails Sent',
      value: 0,
      unit: 'emails',
      perSecond: 3400000, // ~300 billion per day
      icon: '📧',
      color: 'from-cyan-400 to-cyan-600',
      category: 'technology',
      description: 'Digital messages crossing the globe',
      source: 'Radicati Group'
    },
    {
      id: 'photos',
      title: 'Photos Taken',
      value: 0,
      unit: 'photos',
      perSecond: 1736, // ~150 million per day
      icon: '📸',
      color: 'from-orange-400 to-orange-600',
      category: 'technology',
      description: 'Moments captured forever',
      source: 'Photutorial estimates'
    },
    {
      id: 'raindrops',
      title: 'Raindrops Falling',
      value: 0,
      unit: 'drops',
      perSecond: 15000000000000, // ~15 trillion drops per second globally
      icon: '💧',
      color: 'from-sky-400 to-sky-600',
      category: 'environment',
      description: 'Nature\'s endless cycle of renewal',
      source: 'Meteorological estimates'
    },
    {
      id: 'breaths',
      title: 'Human Breaths',
      value: 0,
      unit: 'breaths',
      perSecond: 152000000, // 8 billion people × 19 breaths per minute
      icon: '🫁',
      color: 'from-teal-400 to-teal-600',
      category: 'life',
      description: 'The rhythm of life itself',
      source: 'Respiratory physiology data'
    },
    {
      id: 'meteors',
      title: 'Meteors Entering Atmosphere',
      value: 0,
      unit: 'meteors',
      perSecond: 1.16, // ~100,000 per day
      icon: '☄️',
      color: 'from-violet-400 to-violet-600',
      category: 'environment',
      description: 'Cosmic visitors from space',
      source: 'NASA meteor data'
    },
    {
      id: 'lightning',
      title: 'Lightning Strikes',
      value: 0,
      unit: 'strikes',
      perSecond: 100, // ~8.6 million per day
      icon: '⚡',
      color: 'from-yellow-400 to-yellow-600',
      category: 'environment',
      description: 'Nature\'s raw electrical power',
      source: 'Global Lightning Detection Network'
    },
    {
      id: 'pizza',
      title: 'Pizza Slices Eaten',
      value: 0,
      unit: 'slices',
      perSecond: 400, // ~35 million per day globally
      icon: '🍕',
      color: 'from-red-400 to-red-600',
      category: 'life',
      description: 'Universal language of deliciousness',
      source: 'Global food consumption data'
    },
    {
      id: 'solar',
      title: 'Solar Energy Received',
      value: 0,
      unit: 'kWh',
      perSecond: 430000000000, // ~430 billion kWh per second
      icon: '☀️',
      color: 'from-amber-400 to-amber-600',
      category: 'environment',
      description: 'Free energy from our star',
      source: 'Solar irradiance measurements'
    },
    {
      id: 'steps',
      title: 'Human Steps Taken',
      value: 0,
      unit: 'steps',
      perSecond: 34700000, // 8 billion people × ~3,800 steps per day average
      icon: '👣',
      color: 'from-emerald-400 to-emerald-600',
      category: 'life',
      description: 'Humanity on the move',
      source: 'Global activity tracking data'
    },
    {
      id: 'books',
      title: 'Books Published',
      value: 0,
      unit: 'books',
      perSecond: 0.07, // ~2.2 million per year globally
      icon: '📚',
      color: 'from-indigo-400 to-indigo-600',
      category: 'technology',
      description: 'Human knowledge expanding',
      source: 'Publishing industry statistics'
    },
    {
      id: 'coffee',
      title: 'Cups of Coffee Consumed',
      value: 0,
      unit: 'cups',
      perSecond: 30000, // ~2.6 billion cups per day
      icon: '☕',
      color: 'from-amber-600 to-amber-800',
      category: 'life',
      description: 'Liquid motivation flowing globally',
      source: 'International Coffee Organization'
    },
    {
      id: 'waves',
      title: 'Ocean Waves',
      value: 0,
      unit: 'waves',
      perSecond: 50000000, // Estimated global ocean wave activity
      icon: '🌊',
      color: 'from-blue-400 to-blue-600',
      category: 'environment',
      description: 'Earth\'s endless oceanic dance',
      source: 'Oceanographic estimates'
    },
    {
      id: 'songs',
      title: 'Songs Streamed',
      value: 0,
      unit: 'songs',
      perSecond: 2314, // ~200 million streams per day
      icon: '🎵',
      color: 'from-pink-400 to-pink-600',
      category: 'technology',
      description: 'Melodies connecting souls worldwide',
      source: 'Music streaming platforms'
    },
    {
      id: 'cells',
      title: 'Human Cells Replaced',
      value: 0,
      unit: 'cells',
      perSecond: 25000000000000, // ~25 trillion cells regenerated daily in human body
      icon: '🧬',
      color: 'from-purple-400 to-purple-600',
      category: 'life',
      description: 'Your body rebuilding itself constantly',
      source: 'Cellular biology research'
    },
    {
      id: 'satellites',
      title: 'Satellite Orbits Completed',
      value: 0,
      unit: 'orbits',
      perSecond: 0.3, // ~8,000 satellites completing various orbits
      icon: '🛰️',
      color: 'from-slate-400 to-slate-600',
      category: 'technology',
      description: 'Humanity\'s eyes in the sky',
      source: 'Space surveillance networks'
    },
    {
      id: 'earthquakes',
      title: 'Earthquakes',
      value: 0,
      unit: 'quakes',
      perSecond: 0.6, // ~50,000 detectable earthquakes per year
      icon: '🌍',
      color: 'from-orange-500 to-orange-700',
      category: 'environment',
      description: 'Earth\'s tectonic heartbeat',
      source: 'Global seismic monitoring'
    }
  ], []);

  // Calculate elapsed seconds since component mount
  const elapsedSeconds = useMemo(() => {
    return (currentTime.getTime() - startTime.getTime()) / 1000;
  }, [currentTime, startTime]);

  // Calculate personal context
  const personalContext = useMemo((): PersonalContext => {
    if (!birthDate) {
      return { birthDate: null, ageInSeconds: 0, personalStats: {} };
    }

    const ageInSeconds = (currentTime.getTime() - birthDate.getTime()) / 1000;
    const personalStats: Record<string, number> = {};

    globalStats.forEach(stat => {
      personalStats[stat.id] = Math.floor(stat.perSecond * ageInSeconds);
    });

    return { birthDate, ageInSeconds, personalStats };
  }, [birthDate, currentTime, globalStats]);

  // Update statistics in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 100); // Update every 100ms for smooth animations

    return () => clearInterval(interval);
  }, []);

  // Handle date selection
  const handleDateSelect = (dateString: string) => {
    if (dateString && dateString.length === 10 && dateString.includes('-')) {
      const date = new Date(dateString);
      if (!isNaN(date.getTime()) && date <= new Date()) {
        setBirthDate(date);
        setShowDatePicker(false);
      }
    }
  };

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num).toLocaleString();
  };

  // Get current stat value (since page load)
  const getCurrentValue = (stat: GlobalStat): number => {
    return Math.floor(stat.perSecond * elapsedSeconds);
  };

  // Fetch AI insights for a statistic
  const fetchAIInsight = useCallback(async (stat: GlobalStat) => {
    const cacheKey = `earth_insight_${stat.id}`;
    
    // Check localStorage cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const cachedInsight: AIInsight = JSON.parse(cached);
        setAiInsights(prev => ({ ...prev, [stat.id]: cachedInsight }));
        return;
      } catch (e) {
        // Invalid cache, continue to fetch
      }
    }

    setLoadingInsight(true);
    
    try {
      const currentValue = getCurrentValue(stat);
      const lifetimeValue = birthDate ? personalContext.personalStats[stat.id] : undefined;
      const userAge = birthDate ? Math.floor(personalContext.ageInSeconds / (365.25 * 24 * 3600)) : undefined;

      const response = await fetch('/api/earth-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statId: stat.id,
          statTitle: stat.title,
          currentValue,
          lifetimeValue,
          userAge,
          category: stat.category,
          description: stat.description
        }),
      });

      if (response.ok) {
        const insight: AIInsight = await response.json();
        setAiInsights(prev => ({ ...prev, [stat.id]: insight }));
        
        // Cache in localStorage
        localStorage.setItem(cacheKey, JSON.stringify(insight));
      }
    } catch (error) {
      console.error('Failed to fetch AI insight:', error);
    } finally {
      setLoadingInsight(false);
    }
  }, [getCurrentValue, birthDate, personalContext]);

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0c1445 0%, #1a1f3a 25%, #2d3561 50%, #1e2a5e 75%, #0f1b4c 100%)',
      backgroundSize: '400% 400%',
      animation: 'earthPulse 20s ease infinite'
    }}>
      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border-2 border-blue-500 rounded-2xl p-8 max-w-md w-full shadow-2xl" style={{
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)'
          }}>
            <h2 className="text-2xl font-bold text-white mb-4 text-center" style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
            }}>
              🌍 When did your journey begin?
            </h2>
            <p className="text-slate-300 mb-6 text-center">
              Discover your place in Earth's grand story
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const dateValue = formData.get('birthDate') as string;
              handleDateSelect(dateValue);
            }}>
              <input
                name="birthDate"
                type="date"
                className="w-full p-4 bg-slate-800 border-2 border-blue-500 text-white rounded-lg text-lg focus:border-blue-400 focus:outline-none mb-4"
                max={new Date().toISOString().split('T')[0]}
                required
              />
              <button
                type="submit"
                className="w-full p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-lg font-medium transition-all mb-3 border border-blue-400"
                style={{
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
                }}
              >
                🌟 Begin Your Earth Story
              </button>
            </form>
            <button
              onClick={() => setShowDatePicker(false)}
              className="w-full p-3 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Explore without personal context
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4" style={{
            fontFamily: 'serif',
            textShadow: '0 0 30px rgba(255, 255, 255, 0.5), 3px 3px 0px rgba(0, 0, 0, 0.7)'
          }}>
            Earth's Heartbeat
          </h1>
          <div className="bg-slate-900/60 backdrop-blur-sm border border-blue-500 rounded-2xl p-6 max-w-4xl mx-auto" style={{
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)'
          }}>
            <p className="text-xl md:text-2xl text-slate-200 leading-relaxed mb-4">
              Feel the pulse of our living planet
            </p>
            <p className="text-lg text-slate-300">
              Every second, millions of events shape our world. This is happening right now.
            </p>
          </div>
        </div>

        {/* Real-time Global Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {globalStats.map((stat) => (
            <div 
              key={stat.id}
              onClick={() => setSelectedStat(stat)}
              className="bg-slate-900/70 backdrop-blur-sm border border-slate-600 rounded-xl p-6 hover:border-slate-400 transition-all duration-300 cursor-pointer group hover:scale-105"
              style={{
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl filter drop-shadow-lg">{stat.icon}</span>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {stat.title}
                  </h3>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${stat.color} text-white`}>
                  {stat.category}
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1" style={{
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                  }}>
                    {formatNumber(getCurrentValue(stat))}
                  </div>
                  <div className="text-sm text-slate-400">
                    since you opened this page
                  </div>
                </div>

                {birthDate && personalContext.personalStats[stat.id] > 0 && (
                  <div className="pt-3 border-t border-slate-700">
                    <div className="text-lg font-semibold text-blue-300">
                      {formatNumber(personalContext.personalStats[stat.id])}
                    </div>
                    <div className="text-xs text-slate-400">
                      during your lifetime
                    </div>
                  </div>
                )}

                <div className="text-xs text-slate-500 pt-2">
                  +{stat.perSecond >= 1 ? formatNumber(stat.perSecond) : stat.perSecond.toFixed(2)} per second
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Personal Timeline Summary */}
        {birthDate && (
          <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-blue-500 rounded-2xl p-6 md:p-8 mb-8" style={{
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)'
          }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
              Your Earth Story
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="bg-slate-800/60 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">
                  {Math.floor(personalContext.ageInSeconds / (365.25 * 24 * 3600))}
                </div>
                <div className="text-slate-300 text-sm">Years on Earth</div>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">
                  {formatNumber(personalContext.ageInSeconds * 76 / 60)} {/* approximate heartbeats */}
                </div>
                <div className="text-slate-300 text-sm">Your Heartbeats</div>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">
                  {formatNumber(personalContext.ageInSeconds / 86400)}
                </div>
                <div className="text-slate-300 text-sm">Days Experienced</div>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-400">
                  {formatNumber(personalContext.ageInSeconds)}
                </div>
                <div className="text-slate-300 text-sm">Seconds Alive</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Detail Modal */}
      {selectedStat && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border-2 border-slate-600 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedStat.icon}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  {selectedStat.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStat(null)}
                className="text-slate-400 hover:text-white text-3xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800/60 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Description</h4>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {selectedStat.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/60 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Rate</h4>
                  <div className="text-2xl font-bold text-blue-400">
                    {selectedStat.perSecond >= 1 ? formatNumber(selectedStat.perSecond) : selectedStat.perSecond.toFixed(2)}
                  </div>
                  <div className="text-slate-400 text-sm">per second</div>
                </div>

                <div className="bg-slate-800/60 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Since Page Load</h4>
                  <div className="text-2xl font-bold text-green-400">
                    {formatNumber(getCurrentValue(selectedStat))}
                  </div>
                  <div className="text-slate-400 text-sm">{selectedStat.unit}</div>
                </div>
              </div>

              {birthDate && (
                <div className="bg-slate-800/60 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">During Your Lifetime</h4>
                  <div className="text-3xl font-bold text-purple-400">
                    {formatNumber(personalContext.personalStats[selectedStat.id])}
                  </div>
                  <div className="text-slate-400 text-sm">{selectedStat.unit}</div>
                </div>
              )}

              {/* AI Insights Section */}
              <div className="bg-slate-800/60 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  🤖 AI Insights
                </h4>
                {loadingInsight ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                    <span className="ml-3 text-slate-300">Generating insights...</span>
                  </div>
                ) : aiInsights[selectedStat.id] ? (
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <h5 className="text-sm font-semibold text-blue-300 mb-2">💡 Insight</h5>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {aiInsights[selectedStat.id].insight}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <h5 className="text-sm font-semibold text-green-300 mb-2">🌱 Reflection</h5>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {aiInsights[selectedStat.id].reflection}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <h5 className="text-sm font-semibold text-yellow-300 mb-2">✨ Fun Fact</h5>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {aiInsights[selectedStat.id].funFact}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <button
                      onClick={() => fetchAIInsight(selectedStat)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm"
                    >
                      Generate AI Insights
                    </button>
                    <p className="text-xs text-slate-400 mt-2">
                      Discover deeper meaning in this statistic
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-slate-800/60 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Data Source</h4>
                <p className="text-slate-300 text-sm">{selectedStat.source}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS animations */}
      <style jsx>{`
        @keyframes earthPulse {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1e293b;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}