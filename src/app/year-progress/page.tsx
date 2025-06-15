'use client';

import { useState, useEffect } from 'react';

interface TimeStats {
  yearProgress: number;
  dayProgress: number;
  monthProgress: number;
  weekProgress: number;
  daysCompleted: number;
  daysRemaining: number;
  hoursCompleted: number;
  minutesCompleted: number;
  secondsCompleted: number;
  currentMonth: string;
  currentDay: string;
  currentDate: number;
  weekOfYear: number;
  isLeapYear: boolean;
}

interface Milestone {
  percentage: number;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
}

export default function YearProgress() {
  const [timeStats, setTimeStats] = useState<TimeStats | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMilliseconds, setShowMilliseconds] = useState(false);
  const [userTimezone, setUserTimezone] = useState<string>('');
  const [showGlobalView, setShowGlobalView] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const timeFacts = [
    "Every 4 years we get an extra day to procrastinate! 📅",
    "You blink about 17,000 times per day. Time well spent! 👀",
    "A year has 525,600 minutes. Sing along if you know the song! 🎵",
    "Earth travels 584 million miles around the sun each year! 🌍",
    "The concept of 'New Year' has existed for over 4,000 years! 🎊",
    "Daylight Saving Time affects 1.6 billion people worldwide! ⏰",
    "The shortest month, February, still has 40,320 minutes! ⚡",
    "You'll spend about 2,920 hours sleeping this year! 😴",
    "Time zones mean it's always someone's birthday somewhere! 🎂",
    "A leap second is occasionally added to keep atomic time in sync! ⚛️"
  ];

  const milestones: Milestone[] = [
    { percentage: 10, title: "New Year Hangover Recovery", description: "You've survived the first 10% of the year!", icon: "🎉", achieved: false },
    { percentage: 25, title: "Quarter Century", description: "25% down, 75% to go. Spring has sprung!", icon: "🌸", achieved: false },
    { percentage: 50, title: "Halfway Hero", description: "You're officially past the midpoint. Summer vibes!", icon: "☀️", achieved: false },
    { percentage: 75, title: "Three-Quarter Titan", description: "75% complete! Autumn leaves are falling like your motivation!", icon: "🍂", achieved: false },
    { percentage: 90, title: "Almost There Champion", description: "90% done! Time to panic about New Year's resolutions!", icon: "⚡", achieved: false },
    { percentage: 99, title: "Procrastination Master", description: "99% complete! Still haven't done that thing from January!", icon: "🏆", achieved: false },
  ];

  const calculateTimeStats = (): TimeStats => {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    const startOfMonth = new Date(year, now.getMonth(), 1);
    const endOfMonth = new Date(year, now.getMonth() + 1, 1);
    const startOfDay = new Date(year, now.getMonth(), now.getDate());
    const endOfDay = new Date(year, now.getMonth(), now.getDate() + 1);
    
    // Year calculations
    const yearTotal = endOfYear.getTime() - startOfYear.getTime();
    const yearElapsed = now.getTime() - startOfYear.getTime();
    const yearProgress = (yearElapsed / yearTotal) * 100;
    
    // Month calculations
    const monthTotal = endOfMonth.getTime() - startOfMonth.getTime();
    const monthElapsed = now.getTime() - startOfMonth.getTime();
    const monthProgress = (monthElapsed / monthTotal) * 100;
    
    // Day calculations
    const dayTotal = endOfDay.getTime() - startOfDay.getTime();
    const dayElapsed = now.getTime() - startOfDay.getTime();
    const dayProgress = (dayElapsed / dayTotal) * 100;
    
    // Week calculations
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const weekElapsed = now.getTime() - startOfWeek.getTime();
    const weekTotal = 7 * 24 * 60 * 60 * 1000;
    const weekProgress = (weekElapsed / weekTotal) * 100;
    
    // Additional stats
    const daysInYear = (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
    const daysCompleted = Math.floor(yearElapsed / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.ceil(daysInYear - daysCompleted);
    const hoursCompleted = Math.floor(yearElapsed / (1000 * 60 * 60));
    const minutesCompleted = Math.floor(yearElapsed / (1000 * 60));
    const secondsCompleted = Math.floor(yearElapsed / 1000);
    
    // Week of year calculation
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekOfYear = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    
    // Leap year check
    const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

    return {
      yearProgress,
      dayProgress,
      monthProgress,
      weekProgress,
      daysCompleted,
      daysRemaining,
      hoursCompleted,
      minutesCompleted,
      secondsCompleted,
      currentMonth: months[now.getMonth()],
      currentDay: days[now.getDay()],
      currentDate: now.getDate(),
      weekOfYear,
      isLeapYear
    };
  };

  useEffect(() => {
    // Detect user timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(timezone);
    
    const updateStats = () => {
      const newTime = new Date();
      setCurrentTime(newTime);
      setTimeStats(calculateTimeStats());
    };

    updateStats();
    const interval = setInterval(updateStats, showMilliseconds ? 100 : 1000);

    return () => clearInterval(interval);
  }, [showMilliseconds]);

  const getProgressColor = (percentage: number) => {
    if (percentage < 25) return 'from-green-400 to-green-600';
    if (percentage < 50) return 'from-blue-400 to-blue-600';
    if (percentage < 75) return 'from-yellow-400 to-orange-500';
    if (percentage < 90) return 'from-orange-400 to-red-500';
    return 'from-red-500 to-red-700';
  };

  const getCompletedMilestones = () => {
    if (!timeStats) return [];
    return milestones.map(milestone => ({
      ...milestone,
      achieved: timeStats.yearProgress >= milestone.percentage
    }));
  };

  const formatTime = (date: Date) => {
    if (showMilliseconds) {
      const options: Intl.DateTimeFormatOptions = {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const time24 = date.toLocaleTimeString('en-US', options);
      const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
      const hour = date.getHours();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      
      return `${hour12.toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${milliseconds} ${ampm}`;
    }
    
    const options: Intl.DateTimeFormatOptions = {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    
    return date.toLocaleTimeString('en-US', options);
  };

  const getGlobalTimezones = () => {
    const timezones = [
      { name: 'New York', tz: 'America/New_York', flag: '🇺🇸' },
      { name: 'London', tz: 'Europe/London', flag: '🇬🇧' },
      { name: 'Tokyo', tz: 'Asia/Tokyo', flag: '🇯🇵' },
      { name: 'Sydney', tz: 'Australia/Sydney', flag: '🇦🇺' },
      { name: 'Dubai', tz: 'Asia/Dubai', flag: '🇦🇪' },
      { name: 'Los Angeles', tz: 'America/Los_Angeles', flag: '🇺🇸' },
    ];
    
    return timezones.map(({ name, tz, flag }) => {
      const time = new Date().toLocaleTimeString('en-US', {
        timeZone: tz,
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      const date = new Date().toLocaleDateString('en-US', {
        timeZone: tz,
        month: 'short',
        day: 'numeric'
      });
      
      return { name, time, date, flag, tz };
    });
  };

  if (!timeStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="text-white text-2xl animate-pulse">Loading time data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      background: `
        linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #553c9a 50%, #7c3aed 75%, #a855f7 100%),
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(167, 85, 247, 0.3) 0%, transparent 50%)
      `,
      backgroundAttachment: 'fixed'
    }}>
      {/* Cosmic dust animation */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 md:p-8 border border-white/20 shadow-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Year Progress
            </h1>
            <p className="text-lg md:text-xl text-purple-200 mb-6">
              Watch {currentTime.getFullYear()} slip away, second by second...
            </p>
            
            {/* Live Clock */}
            <div className="bg-black/30 rounded-2xl p-4 md:p-6 border border-purple-500/30">
              <div className="text-2xl md:text-4xl font-mono text-cyan-400 mb-2 break-all">
                {formatTime(currentTime)}
              </div>
              <div className="text-base md:text-lg text-purple-300 mb-2">
                {timeStats.currentDay}, {timeStats.currentMonth} {timeStats.currentDate}, {currentTime.getFullYear()}
              </div>
              <div className="text-xs md:text-sm text-purple-400 mb-4 break-all">
                🌍 Your timezone: {userTimezone}
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  onClick={() => setShowMilliseconds(!showMilliseconds)}
                  className="px-3 md:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all text-xs md:text-sm"
                >
                  {showMilliseconds ? 'Hide' : 'Show'} Milliseconds
                </button>
                <button
                  onClick={() => setShowGlobalView(!showGlobalView)}
                  className="px-3 md:px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all text-xs md:text-sm"
                >
                  {showGlobalView ? 'Hide' : 'Show'} Global Times
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Progress Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
          {/* Year Progress */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 md:p-8 border border-white/20 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-2">
              <h2 className="text-xl md:text-3xl font-bold text-white">🗓️ Year {currentTime.getFullYear()}</h2>
              <div className="text-left sm:text-right">
                <div className="text-xl md:text-3xl font-bold text-cyan-400">{timeStats.yearProgress.toFixed(6)}%</div>
                <div className="text-xs md:text-sm text-purple-300">{timeStats.isLeapYear ? 'Leap Year!' : 'Regular Year'}</div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="w-full bg-black/30 rounded-full h-6 border border-purple-500/30">
                <div 
                  className={`h-6 rounded-full bg-gradient-to-r ${getProgressColor(timeStats.yearProgress)} transition-all duration-1000 relative overflow-hidden`}
                  style={{ width: `${timeStats.yearProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-green-400 font-bold">{timeStats.daysCompleted}</div>
                <div className="text-purple-300">Days Completed</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-red-400 font-bold">{timeStats.daysRemaining}</div>
                <div className="text-purple-300">Days Remaining</div>
              </div>
            </div>
          </div>

          {/* Multiple Time Units */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 md:p-8 border border-white/20 shadow-2xl">
            <h2 className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-6">⏱️ Time Breakdown</h2>
            
            <div className="space-y-4">
              {/* Month Progress */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-purple-300">📅 {timeStats.currentMonth}</span>
                  <span className="text-cyan-400 font-bold">{timeStats.monthProgress.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-1000"
                    style={{ width: `${timeStats.monthProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Week Progress */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-purple-300">📊 Week {timeStats.weekOfYear}</span>
                  <span className="text-cyan-400 font-bold">{timeStats.weekProgress.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-all duration-1000"
                    style={{ width: `${timeStats.weekProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Day Progress */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-purple-300">🌅 {timeStats.currentDay}</span>
                  <span className="text-cyan-400 font-bold">{timeStats.dayProgress.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000"
                    style={{ width: `${timeStats.dayProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 md:p-6 border border-white/20 text-center">
            <div className="text-2xl md:text-4xl mb-2">⏰</div>
            <div className="text-lg md:text-2xl font-bold text-cyan-400">{timeStats.hoursCompleted.toLocaleString()}</div>
            <div className="text-purple-300 text-xs md:text-sm">Hours Completed</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 md:p-6 border border-white/20 text-center">
            <div className="text-2xl md:text-4xl mb-2">⏱️</div>
            <div className="text-lg md:text-2xl font-bold text-cyan-400">{timeStats.minutesCompleted.toLocaleString()}</div>
            <div className="text-purple-300 text-xs md:text-sm">Minutes Completed</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 md:p-6 border border-white/20 text-center">
            <div className="text-2xl md:text-4xl mb-2">⚡</div>
            <div className="text-lg md:text-2xl font-bold text-cyan-400">{timeStats.secondsCompleted.toLocaleString()}</div>
            <div className="text-purple-300 text-xs md:text-sm">Seconds Completed</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 md:p-6 border border-white/20 text-center">
            <div className="text-2xl md:text-4xl mb-2">🗓️</div>
            <div className="text-lg md:text-2xl font-bold text-cyan-400">{timeStats.weekOfYear}</div>
            <div className="text-purple-300 text-xs md:text-sm">Week of Year</div>
          </div>
        </div>

        {/* Global Timezone View */}
        {showGlobalView && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">🌍 Time Around the World</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getGlobalTimezones().map((location, index) => (
                <div
                  key={location.tz}
                  className="bg-black/30 rounded-2xl p-4 border border-purple-500/30"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{location.flag}</span>
                      <span className="text-white font-bold">{location.name}</span>
                    </div>
                    <div className="text-xs text-purple-400">{location.date}</div>
                  </div>
                  <div className="text-cyan-400 font-mono text-lg">{location.time}</div>
                  <div className="text-xs text-purple-300 mt-1">{location.tz}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-purple-200 text-sm">
                ⏰ All times update in real-time • 🌍 Times shown in local format
              </p>
            </div>
          </div>
        )}

        {/* Milestones */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">🏆 Year Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getCompletedMilestones().map((milestone, index) => (
              <div
                key={milestone.percentage}
                className={`p-4 rounded-2xl border-2 transition-all duration-500 ${
                  milestone.achieved
                    ? 'bg-green-500/20 border-green-400 scale-105'
                    : 'bg-black/20 border-purple-500/30'
                }`}
              >
                <div className="text-3xl mb-2">{milestone.icon}</div>
                <div className={`font-bold mb-1 ${milestone.achieved ? 'text-green-400' : 'text-purple-300'}`}>
                  {milestone.title}
                </div>
                <div className="text-sm text-purple-200">{milestone.description}</div>
                <div className="text-xs text-purple-400 mt-2">{milestone.percentage}% Complete</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Facts */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6">🤓 Time Facts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timeFacts.map((fact, index) => (
              <div
                key={index}
                className="bg-black/20 rounded-2xl p-4 border border-purple-500/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className="text-purple-200">{fact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(2deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}