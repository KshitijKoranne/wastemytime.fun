'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

interface HistoricalEvent {
  year: number;
  event: string;
  category: 'technology' | 'culture' | 'politics' | 'science' | 'disaster' | 'sports';
}

interface WeekInfo {
  weekNumber: number;
  ageYears: number;
  ageWeeks: number;
  lifeStage: 'childhood' | 'education' | 'career' | 'retirement';
  isLived: boolean;
  isCurrent: boolean;
  year: number;
  historicalEvents: HistoricalEvent[];
}

interface AIInsight {
  insight?: string;
  lifeStageInsight?: string;
  funFact?: string;
  weekNumber: number;
  timestamp: string;
}

export default function LifeCalendar() {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [selectedWeek, setSelectedWeek] = useState<WeekInfo | null>(null);
  const [currentAge, setCurrentAge] = useState<number>(0);
  const [livedWeeks, setLivedWeeks] = useState<number>(0);
  const [aiInsights, setAiInsights] = useState<Record<number, AIInsight>>({});
  const [loadingInsight, setLoadingInsight] = useState<boolean>(false);
  const [loadingLifeStage, setLoadingLifeStage] = useState<boolean>(false);
  const [loadingFunFact, setLoadingFunFact] = useState<boolean>(false);

  // Historical events database (comprehensive selection)
  const historicalEvents: HistoricalEvent[] = useMemo(() => [
    // 1960s
    { year: 1963, event: "JFK assassination shocks the world", category: 'politics' },
    { year: 1964, event: "Beatles arrive in America, Beatlemania begins", category: 'culture' },
    { year: 1967, event: "First human heart transplant performed", category: 'science' },
    { year: 1969, event: "Moon landing - Neil Armstrong takes first steps", category: 'science' },
    { year: 1969, event: "Woodstock festival defines a generation", category: 'culture' },
    
    // 1970s
    { year: 1971, event: "First email sent, digital communication begins", category: 'technology' },
    { year: 1972, event: "Watergate scandal breaks", category: 'politics' },
    { year: 1975, event: "Microsoft founded by Bill Gates and Paul Allen", category: 'technology' },
    { year: 1976, event: "Apple Computer founded in a garage", category: 'technology' },
    { year: 1977, event: "Star Wars revolutionizes cinema", category: 'culture' },
    { year: 1979, event: "Sony Walkman changes how we listen to music", category: 'technology' },
    
    // 1980s
    { year: 1980, event: "CNN launches 24-hour news cycle", category: 'culture' },
    { year: 1981, event: "MTV launches with 'Video Killed the Radio Star'", category: 'culture' },
    { year: 1982, event: "Time magazine names computer 'Person of the Year'", category: 'technology' },
    { year: 1984, event: "Apple Macintosh introduces GUI to masses", category: 'technology' },
    { year: 1985, event: "Live Aid concert raises awareness for famine", category: 'culture' },
    { year: 1986, event: "Chernobyl nuclear disaster", category: 'disaster' },
    { year: 1989, event: "Berlin Wall falls, Germany reunites", category: 'politics' },
    { year: 1989, event: "World Wide Web invented by Tim Berners-Lee", category: 'technology' },
    
    // 1990s
    { year: 1990, event: "Hubble Space Telescope launched", category: 'science' },
    { year: 1991, event: "Soviet Union dissolves, ending Cold War", category: 'politics' },
    { year: 1993, event: "Mosaic browser makes web accessible", category: 'technology' },
    { year: 1994, event: "Nelson Mandela becomes president of South Africa", category: 'politics' },
    { year: 1995, event: "Windows 95 brings computing to masses", category: 'technology' },
    { year: 1996, event: "Dolly the sheep cloned successfully", category: 'science' },
    { year: 1997, event: "Harry Potter first book published", category: 'culture' },
    { year: 1998, event: "Google founded, internet search transformed", category: 'technology' },
    { year: 1999, event: "Y2K fears grip the world", category: 'technology' },
    
    // 2000s
    { year: 2000, event: "Human Genome Project draft completed", category: 'science' },
    { year: 2001, event: "September 11 attacks change the world", category: 'disaster' },
    { year: 2001, event: "Wikipedia launches, knowledge becomes collaborative", category: 'culture' },
    { year: 2003, event: "Skype revolutionizes long-distance communication", category: 'technology' },
    { year: 2004, event: "Facebook launches, social media revolution begins", category: 'technology' },
    { year: 2005, event: "YouTube founded, video sharing explodes", category: 'technology' },
    { year: 2006, event: "Twitter launches, microblogging is born", category: 'technology' },
    { year: 2007, event: "iPhone introduced, smartphone era starts", category: 'technology' },
    { year: 2008, event: "Global financial crisis impacts worldwide", category: 'politics' },
    { year: 2008, event: "Barack Obama elected first Black US president", category: 'politics' },
    { year: 2009, event: "Bitcoin whitepaper published", category: 'technology' },
    
    // 2010s
    { year: 2010, event: "Instagram launches, photo sharing transformed", category: 'technology' },
    { year: 2011, event: "Arab Spring movements spread via social media", category: 'politics' },
    { year: 2012, event: "Gangnam Style becomes first billion-view YouTube video", category: 'culture' },
    { year: 2013, event: "Edward Snowden reveals NSA surveillance", category: 'politics' },
    { year: 2014, event: "Ice Bucket Challenge goes viral", category: 'culture' },
    { year: 2015, event: "Marriage equality legalized in US", category: 'politics' },
    { year: 2016, event: "Pokemon GO creates augmented reality craze", category: 'technology' },
    { year: 2017, event: "#MeToo movement gains global momentum", category: 'culture' },
    { year: 2018, event: "Black Panther breaks cultural barriers", category: 'culture' },
    { year: 2019, event: "Greta Thunberg sparks climate activism", category: 'politics' },
    
    // 2020s
    { year: 2020, event: "COVID-19 pandemic reshapes global society", category: 'disaster' },
    { year: 2021, event: "NFTs and cryptocurrency boom", category: 'technology' },
    { year: 2022, event: "ChatGPT launches AI revolution", category: 'technology' },
    { year: 2023, event: "AI tools transform creative industries", category: 'technology' },
    { year: 2024, event: "Climate change becomes mainstream concern", category: 'science' },
    
    // Sports milestones
    { year: 1994, event: "FIFA World Cup hosted by USA", category: 'sports' },
    { year: 2008, event: "Beijing Olympics showcase China to world", category: 'sports' },
    { year: 2012, event: "London Olympics inspire a generation", category: 'sports' },
    { year: 2016, event: "Rio Olympics in South America", category: 'sports' },
    { year: 2021, event: "Tokyo Olympics held during pandemic", category: 'sports' },
  ], []);

  // Life statistics
  const lifeStats = useMemo(() => ({
    totalWeeks: 4000, // ~77 years
    sleepWeeks: 1540, // ~30 years of sleep
    workWeeks: 1924, // ~37 years of work
    schoolWeeks: 832, // ~16 years of education
    weekendWeeks: 1152, // ~22 years of weekends
  }), []);

  // Calculate age and lived weeks
  const calculateAge = useCallback((birth: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    const diffYears = Math.floor(diffWeeks / 52);
    return { years: diffYears, weeks: diffWeeks };
  }, []);

  // Get life stage based on age
  const getLifeStage = (ageYears: number): WeekInfo['lifeStage'] => {
    if (ageYears < 13) return 'childhood';
    if (ageYears < 23) return 'education';
    if (ageYears < 65) return 'career';
    return 'retirement';
  };

  // Get stage colors
  const getStageColor = (stage: WeekInfo['lifeStage'], isLived: boolean, isCurrent: boolean) => {
    if (isCurrent) return 'bg-yellow-400 border-yellow-300 animate-pulse';
    if (!isLived) return 'bg-slate-700 border-slate-600';
    
    switch (stage) {
      case 'childhood': return 'bg-blue-400 border-blue-300 hover:bg-blue-300';
      case 'education': return 'bg-green-400 border-green-300 hover:bg-green-300';
      case 'career': return 'bg-orange-400 border-orange-300 hover:bg-orange-300';
      case 'retirement': return 'bg-purple-400 border-purple-300 hover:bg-purple-300';
    }
  };

  // Generate week info
  const generateWeekInfo = useCallback((weekIndex: number): WeekInfo => {
    const ageWeeks = weekIndex;
    const ageYears = Math.floor(ageWeeks / 52);
    const year = birthDate ? birthDate.getFullYear() + ageYears : new Date().getFullYear() - currentAge + ageYears;
    const lifeStage = getLifeStage(ageYears);
    const isLived = birthDate ? ageWeeks < livedWeeks : false;
    const isCurrent = birthDate ? ageWeeks === livedWeeks : false;
    
    const relevantEvents = historicalEvents.filter(event => 
      Math.abs(event.year - year) <= 1
    );

    return {
      weekNumber: weekIndex,
      ageYears,
      ageWeeks,
      lifeStage,
      isLived,
      isCurrent,
      year,
      historicalEvents: relevantEvents,
    };
  }, [birthDate, livedWeeks, currentAge, historicalEvents]);

  // Handle date selection with DD/MM/YYYY format
  const handleDateSelect = (dateString: string) => {
    console.log('handleDateSelect called with:', dateString);
    
    // Parse DD/MM/YYYY format
    if (dateString && dateString.length === 10 && dateString.includes('/')) {
      const [day, month, year] = dateString.split('/').map(num => parseInt(num));
      console.log('Parsed date components:', { day, month, year });
      
      // Validate date components
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= new Date().getFullYear()) {
        const date = new Date(year, month - 1, day); // month is 0-indexed
        console.log('Created date object:', date);
        
        // Validate that the date is real (handles invalid dates like 31/02/2000)
        if (date.getDate() === day && date.getMonth() === (month - 1) && date.getFullYear() === year && date <= new Date()) {
          console.log('Date validation passed, setting birth date');
          setBirthDate(date);
          const age = calculateAge(date);
          setCurrentAge(age.years);
          setLivedWeeks(age.weeks);
          setShowDatePicker(false);
          console.log('Timeline creation completed');
        } else {
          console.log('Date validation failed');
        }
      } else {
        console.log('Date component validation failed');
      }
    } else {
      console.log('Date format validation failed');
    }
  };

  // Format date input as user types
  const formatDateInput = (value: string): string => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Format as DD/MM/YYYY
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  // Generate all weeks
  const allWeeks = useMemo(() => {
    return Array.from({ length: lifeStats.totalWeeks }, (_, i) => generateWeekInfo(i));
  }, [lifeStats.totalWeeks, generateWeekInfo]);

  // Fetch AI insights for a week
  const fetchAIInsight = useCallback(async (week: WeekInfo, type: 'full' | 'life-stage' | 'fun-fact' = 'full') => {
    const cacheKey = `life_insight_${week.weekNumber}_${type}`;
    
    // Check localStorage cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const cachedInsight: AIInsight = JSON.parse(cached);
        setAiInsights(prev => ({ 
          ...prev, 
          [week.weekNumber]: { 
            ...prev[week.weekNumber], 
            ...cachedInsight 
          } 
        }));
        return;
      } catch (e) {
        // Invalid cache, continue to fetch
      }
    }

    // Set appropriate loading state
    if (type === 'full') setLoadingInsight(true);
    else if (type === 'life-stage') setLoadingLifeStage(true);
    else if (type === 'fun-fact') setLoadingFunFact(true);
    
    try {
      const startDate = new Date(birthDate!);
      startDate.setDate(startDate.getDate() + (week.weekNumber * 7));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);

      const response = await fetch('/api/life-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weekNumber: week.weekNumber,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          userAge: week.ageYears,
          lifeStage: week.lifeStage,
          historicalEvents: week.historicalEvents.map(event => `${event.year}: ${event.event}`),
          insightType: type
        }),
      });

      if (response.ok) {
        const insight: AIInsight = await response.json();
        setAiInsights(prev => ({ 
          ...prev, 
          [week.weekNumber]: { 
            ...prev[week.weekNumber], 
            ...insight 
          } 
        }));
        
        // Cache in localStorage
        localStorage.setItem(cacheKey, JSON.stringify(insight));
      }
    } catch (error) {
      console.error('Failed to fetch AI insight:', error);
    } finally {
      // Clear appropriate loading state
      if (type === 'full') setLoadingInsight(false);
      else if (type === 'life-stage') setLoadingLifeStage(false);
      else if (type === 'fun-fact') setLoadingFunFact(false);
    }
  }, [birthDate]);

  // Handle week click
  const handleWeekClick = (week: WeekInfo) => {
    setSelectedWeek(week);
    
    // Fetch AI insight if birthDate is available and we don't have it cached
    if (birthDate && !aiInsights[week.weekNumber]) {
      fetchAIInsight(week);
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite'
    }}>
      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border-2 border-slate-600 rounded-2xl p-8 max-w-md w-full shadow-2xl" style={{
            boxShadow: '0 0 30px rgba(100, 116, 139, 0.4)'
          }}>
            <h2 className="text-2xl font-bold text-white mb-4 text-center" style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
            }}>
              When were you born?
            </h2>
            <p className="text-slate-300 mb-6 text-center">
              Unlock the timeline of your existence
            </p>
            <div className="mb-4">
              <label className="block text-slate-300 text-sm mb-2">
                Enter your birth date (DD/MM/YYYY)
              </label>
              <input
                type="text"
                placeholder="25/12/1990"
                value={inputValue}
                className="w-full p-4 bg-slate-800 border-2 border-slate-600 text-white rounded-lg text-lg focus:border-slate-400 focus:outline-none"
                maxLength={10}
                onChange={(e) => {
                  const formatted = formatDateInput(e.target.value);
                  setInputValue(formatted);
                }}
                onKeyDown={(e) => {
                  // Allow: backspace, delete, tab, escape, enter
                  if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                      (e.keyCode === 65 && e.ctrlKey === true) ||
                      (e.keyCode === 67 && e.ctrlKey === true) ||
                      (e.keyCode === 86 && e.ctrlKey === true) ||
                      (e.keyCode === 88 && e.ctrlKey === true)) {
                    return;
                  }
                  // Ensure that it is a number and stop the keypress
                  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (inputValue.trim()) {
                console.log('Submitting date:', inputValue.trim());
                handleDateSelect(inputValue.trim());
              } else {
                console.log('Input value is empty:', inputValue);
              }
            }}>
              <button
                type="submit"
                className="w-full p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-lg font-medium transition-all mb-3 border border-slate-500"
                style={{
                  boxShadow: '0 0 15px rgba(100, 116, 139, 0.3)'
                }}
              >
                ⏳ Create My Timeline
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{
            fontFamily: 'serif',
            textShadow: '0 0 30px rgba(255, 255, 255, 0.5), 3px 3px 0px rgba(0, 0, 0, 0.7)'
          }}>
            Life Timeline
          </h1>
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600 rounded-2xl p-4 md:p-6 max-w-4xl mx-auto" style={{
            boxShadow: '0 0 25px rgba(100, 116, 139, 0.3)'
          }}>
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed">
              Each glowing square represents one week of human existence
            </p>
            {birthDate && (
              <div className="mt-4 p-4 bg-slate-700/50 rounded-lg border border-slate-500">
                <p className="text-slate-200 text-lg">
                  <span className="text-slate-300">Timeline Status:</span> <br />
                  <span className="text-white font-semibold">
                    {currentAge} years • {livedWeeks.toLocaleString()} weeks experienced
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Life Stage Legend */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-2xl p-4 mb-6 max-w-4xl mx-auto" style={{
          boxShadow: '0 0 20px rgba(100, 116, 139, 0.2)'
        }}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-6 h-6 bg-blue-400 border-2 border-blue-300 rounded shadow-lg" style={{
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
              }}></div>
              <span className="text-xs md:text-sm font-medium text-slate-200">Childhood<br /><span className="text-slate-400">(0-12)</span></span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-6 h-6 bg-green-400 border-2 border-green-300 rounded shadow-lg" style={{
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
              }}></div>
              <span className="text-xs md:text-sm font-medium text-slate-200">Education<br /><span className="text-slate-400">(13-22)</span></span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-6 h-6 bg-orange-400 border-2 border-orange-300 rounded shadow-lg" style={{
                boxShadow: '0 0 10px rgba(251, 146, 60, 0.5)'
              }}></div>
              <span className="text-xs md:text-sm font-medium text-slate-200">Career<br /><span className="text-slate-400">(23-64)</span></span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-6 h-6 bg-purple-400 border-2 border-purple-300 rounded shadow-lg" style={{
                boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)'
              }}></div>
              <span className="text-xs md:text-sm font-medium text-slate-200">Wisdom<br /><span className="text-slate-400">(65+)</span></span>
            </div>
            {birthDate && (
              <div className="flex flex-col items-center space-y-2 col-span-2 md:col-span-1">
                <div className="w-6 h-6 bg-yellow-400 border-2 border-yellow-300 rounded shadow-lg animate-pulse" style={{
                  boxShadow: '0 0 15px rgba(250, 204, 21, 0.7)'
                }}></div>
                <span className="text-xs md:text-sm font-medium text-slate-200">Current<br /><span className="text-slate-400">Week</span></span>
              </div>
            )}
          </div>
        </div>

        {/* Life Calendar Grid */}
        <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-slate-600 rounded-2xl p-4 md:p-6 mb-6 overflow-x-auto max-w-6xl mx-auto" style={{
          boxShadow: '0 0 40px rgba(100, 116, 139, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.3)'
        }}>
          <div className="flex justify-center">
            <div className="inline-block">
              {/* Week squares organized by year */}
              <div className="space-y-1">
                {Array.from({ length: Math.ceil(lifeStats.totalWeeks / 52) }, (_, yearIndex) => (
                  <div key={`year-${yearIndex}`} className="flex items-center gap-1">
                    {/* Year label */}
                    <div className="w-8 md:w-12 text-xs text-slate-400 text-right mr-2 font-mono">
                      {yearIndex % 10 === 0 ? `${yearIndex}` : ''}
                    </div>
                    
                    {/* 52 weeks for this year */}
                    <div className="flex gap-1">
                      {Array.from({ length: 52 }, (_, weekIndex) => {
                        const weekNumber = yearIndex * 52 + weekIndex;
                        if (weekNumber >= lifeStats.totalWeeks) return null;
                        
                        const week = allWeeks[weekNumber];
                        return (
                          <button
                            key={weekNumber}
                            onClick={() => handleWeekClick(week)}
                            className={`
                              w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 border border-slate-700 rounded-sm transition-all duration-300 hover:scale-150 hover:z-10 relative hover:border-white
                              ${getStageColor(week.lifeStage, week.isLived, week.isCurrent)}
                            `}
                            style={{
                              filter: week.isLived ? 'brightness(1.2)' : 'brightness(0.6)',
                              boxShadow: week.isCurrent ? '0 0 10px rgba(250, 204, 21, 0.8)' : week.isLived ? '0 0 3px rgba(255, 255, 255, 0.2)' : 'none'
                            }}
                            title={`Week ${week.weekNumber + 1} - Age ${week.ageYears} years, ${week.ageWeeks % 52} weeks`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Decade markers */}
              <div className="mt-4 text-center">
                <div className="text-xs text-slate-400 font-mono">
                  ← Each row represents one year of life (52 weeks) →
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Panel */}
        {birthDate && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 max-w-4xl mx-auto">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600 rounded-xl p-4 md:p-6 text-center" style={{
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
            }}>
              <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">{livedWeeks.toLocaleString()}</div>
              <div className="text-slate-300 text-sm md:text-base">Weeks Experienced</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600 rounded-xl p-4 md:p-6 text-center" style={{
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
            }}>
              <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">{currentAge}</div>
              <div className="text-slate-300 text-sm md:text-base">Years of Stories</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600 rounded-xl p-4 md:p-6 text-center" style={{
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)'
            }}>
              <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">
                {Math.floor(livedWeeks * 7).toLocaleString()}
              </div>
              <div className="text-slate-300 text-sm md:text-base">Days of Adventures</div>
            </div>
          </div>
        )}
      </div>

      {/* Week Details Sidebar */}
      {selectedWeek && (
        <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-slate-900 border-l-2 border-slate-600 shadow-2xl transform transition-transform z-40 overflow-y-auto" style={{
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)'
        }}>
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-white" style={{
                textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
              }}>
                Week {selectedWeek.weekNumber + 1}
              </h3>
              <button
                onClick={() => setSelectedWeek(null)}
                className="text-slate-400 hover:text-white text-2xl md:text-3xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 md:space-y-6">
              {/* Age Info */}
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600 rounded-lg p-4" style={{
                boxShadow: '0 0 15px rgba(100, 116, 139, 0.2)'
              }}>
                <h4 className="font-semibold text-white mb-3 text-lg">Timeline Position</h4>
                <div className="space-y-2 text-slate-200">
                  <p><span className="text-slate-400">Age:</span> {selectedWeek.ageYears} years, {selectedWeek.ageWeeks % 52} weeks</p>
                  <p><span className="text-slate-400">Life Stage:</span> {selectedWeek.lifeStage.charAt(0).toUpperCase() + selectedWeek.lifeStage.slice(1)}</p>
                  <p><span className="text-slate-400">Year:</span> {selectedWeek.year}</p>
                </div>
              </div>

              {/* AI Insights */}
              {birthDate && (
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600 rounded-lg p-4" style={{
                  boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)'
                }}>
                  <h4 className="font-semibold text-white mb-3 text-lg flex items-center gap-2">
                    🤖 AI Life Insights
                  </h4>
                  {loadingInsight ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                      <span className="ml-3 text-slate-300">Generating insights...</span>
                    </div>
                  ) : aiInsights[selectedWeek.weekNumber] ? (
                    <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                      {aiInsights[selectedWeek.weekNumber].insight}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <button
                        onClick={() => fetchAIInsight(selectedWeek)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors text-sm"
                      >
                        Generate AI Insights
                      </button>
                      <p className="text-xs text-slate-400 mt-2">
                        Get personalized historical context and reflections
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Historical Events */}
              {selectedWeek.historicalEvents.length > 0 && (
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600 rounded-lg p-4" style={{
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
                }}>
                  <h4 className="font-semibold text-white mb-3 text-lg">Historical Context</h4>
                  <div className="space-y-3">
                    {selectedWeek.historicalEvents.map((event, index) => (
                      <div key={index} className="text-sm text-slate-200 p-3 bg-slate-700/50 rounded border border-slate-600">
                        <span className="font-medium text-blue-400">{event.year}:</span> {event.event}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Life Stage Insights */}
              {birthDate && (
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600 rounded-lg p-4" style={{
                  boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)'
                }}>
                  <h4 className="font-semibold text-white mb-3 text-lg flex items-center gap-2">
                    🌱 Life Stage Insights
                  </h4>
                  {loadingLifeStage ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                      <span className="ml-3 text-slate-300">Generating insights...</span>
                    </div>
                  ) : aiInsights[selectedWeek.weekNumber]?.lifeStageInsight ? (
                    <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                      {aiInsights[selectedWeek.weekNumber].lifeStageInsight}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <button
                        onClick={() => fetchAIInsight(selectedWeek, 'life-stage')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors text-sm"
                      >
                        Generate Life Stage Insights
                      </button>
                      <p className="text-xs text-slate-400 mt-2">
                        Get personalized insights about this life stage
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* AI Fun Facts */}
              {birthDate && (
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600 rounded-lg p-4" style={{
                  boxShadow: '0 0 15px rgba(250, 204, 21, 0.3)'
                }}>
                  <h4 className="font-semibold text-white mb-3 text-lg flex items-center gap-2">
                    ✨ AI Fun Facts
                  </h4>
                  {loadingFunFact ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                      <span className="ml-3 text-slate-300">Generating fun facts...</span>
                    </div>
                  ) : aiInsights[selectedWeek.weekNumber]?.funFact ? (
                    <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                      {aiInsights[selectedWeek.weekNumber].funFact}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <button
                        onClick={() => fetchAIInsight(selectedWeek, 'fun-fact')}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors text-sm"
                      >
                        Generate Fun Facts
                      </button>
                      <p className="text-xs text-slate-400 mt-2">
                        Discover fascinating facts about this age
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Background overlay when sidebar is open */}
      {selectedWeek && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:bg-black/20"
          onClick={() => setSelectedWeek(null)}
        />
      )}

      {/* CSS animations and styles */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        
        /* Smooth scrollbar for sidebar */
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