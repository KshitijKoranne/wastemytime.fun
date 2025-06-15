'use client';

import { useState, useEffect, useRef } from 'react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function PointlessAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [stats, setStats] = useState({
    clickCount: 0,
    hoverCount: 0,
    scrollDistance: 0,
    timeSpent: 0,
    windowResizes: 0,
    idleTime: 0,
    lastActivity: Date.now(),
    refreshCount: 0,
    pageZoom: 100,
    sameButtonClicks: 0,
    lastClickedButton: '',
    konamiSequence: '',
    cornersTouched: new Set(),
    devToolsOpened: false,
    darkModeToggles: 0,
    shareClicks: 0,
    mobileTouch: 0,
    visitCount: 0,
    achievementStartTime: Date.now(),
    achievementsEnabled: false
  });
  const [showTrophyCase, setShowTrophyCase] = useState(false);
  const startTime = useRef(Date.now());
  const idleTimer = useRef<NodeJS.Timeout>();

  const allAchievements: Achievement[] = [
    // Getting Started
    { id: 'opened-page', name: 'Getting Started', description: "Welcome! You've wasted your first second.", icon: '🎉', category: 'Basic', unlocked: false, rarity: 'common' },
    { id: 'first-click', name: 'Clicked Something!', description: 'You touched the void.', icon: '👆', category: 'Basic', unlocked: false, rarity: 'common' },
    { id: 'moved-mouse', name: 'Moved the Mouse', description: 'Great job. You moved your mouse.', icon: '🐭', category: 'Basic', unlocked: false, rarity: 'common' },
    
    // Clicking
    { id: 'serial-clicker', name: 'Serial Clicker', description: 'Who hurt you?', icon: '🔥', category: 'Clicking', unlocked: false, rarity: 'rare' },
    { id: 'click-master', name: 'Click Master', description: 'Your finger is getting a workout.', icon: '💪', category: 'Clicking', unlocked: false, rarity: 'epic' },
    { id: 'hover-master', name: 'Hover Master', description: 'Not brave enough to click, huh?', icon: '👻', category: 'Clicking', unlocked: false, rarity: 'common' },
    
    // Scrolling
    { id: 'scrolled-bit', name: 'Scrolled a Bit', description: 'Going places. Not sure where though.', icon: '📜', category: 'Navigation', unlocked: false, rarity: 'common' },
    { id: 'scrolled-far', name: 'Scrolled Too Far', description: "There's no bottom. Just keep scrolling.", icon: '🌀', category: 'Navigation', unlocked: false, rarity: 'rare' },
    { id: 'scroll-maniac', name: 'Scroll Maniac', description: 'You really went all the way down there.', icon: '🌊', category: 'Navigation', unlocked: false, rarity: 'epic' },
    
    // Time-based
    { id: 'first-minute', name: 'First Minute Wasted', description: "That's a whole minute you'll never get back.", icon: '⏰', category: 'Time', unlocked: false, rarity: 'common' },
    { id: 'marathon-waster', name: 'Marathon Waster', description: "Someone's committed to this.", icon: '🏃', category: 'Time', unlocked: false, rarity: 'rare' },
    { id: 'still-here', name: 'Why Are You Still Here?', description: 'Seriously. Go outside.', icon: '🤔', category: 'Time', unlocked: false, rarity: 'epic' },
    { id: 'time-traveler', name: 'Time Traveler', description: 'Wasting time at peak hours.', icon: '🕰️', category: 'Time', unlocked: false, rarity: 'legendary' },
    
    // Idle & Restraint
    { id: 'no-touch', name: "Didn't Touch Anything", description: 'Wow, what restraint.', icon: '🧘', category: 'Zen', unlocked: false, rarity: 'common' },
    { id: 'zen-master', name: 'Zen Master', description: 'The art of doing absolutely nothing.', icon: '☯️', category: 'Zen', unlocked: false, rarity: 'rare' },
    { id: 'statue-mode', name: 'Statue Mode', description: 'Are you even alive?', icon: '🗿', category: 'Zen', unlocked: false, rarity: 'epic' },
    
    // Window & Browser
    { id: 'found-edge', name: 'Found the Edge', description: 'Bold move, window warrior.', icon: '🪟', category: 'Browser', unlocked: false, rarity: 'common' },
    { id: 'resize-maniac', name: 'Resize Maniac', description: 'Stop playing with the window!', icon: '📐', category: 'Browser', unlocked: false, rarity: 'rare' },
    { id: 'tab-master', name: 'Tab Master', description: 'Welcome back, tab switcher.', icon: '🗂️', category: 'Browser', unlocked: false, rarity: 'common' },
    
    // Special & Hidden
    { id: 'trophy-hunter', name: 'Trophy Hunter', description: 'You opened the trophy case!', icon: '🏆', category: 'Meta', unlocked: false, rarity: 'rare' },
    { id: 'completionist', name: 'Completionist', description: 'You unlocked half the achievements!', icon: '💯', category: 'Meta', unlocked: false, rarity: 'legendary' },
    { id: 'achievement-hunter', name: 'Achievement Hunter', description: 'You really want them all, huh?', icon: '🎯', category: 'Meta', unlocked: false, rarity: 'epic' },
    
    // Silly & Random
    { id: 'fast-clicker', name: 'Speed Demon', description: 'Clicked 10 times in 3 seconds.', icon: '⚡', category: 'Special', unlocked: false, rarity: 'rare' },
    { id: 'midnight-visitor', name: 'Night Owl', description: 'Visiting after midnight. Dedication!', icon: '🦉', category: 'Special', unlocked: false, rarity: 'rare' },
    { id: 'perfectionist', name: 'Perfectionist', description: 'You read every achievement description.', icon: '🔍', category: 'Special', unlocked: false, rarity: 'epic' },
    { id: 'rebel', name: 'The Rebel', description: 'You tried to break something.', icon: '😈', category: 'Special', unlocked: false, rarity: 'legendary' },
    
    // Hacker & Dev
    { id: 'devtools-opened', name: 'Opened DevTools', description: 'Hacker detected. You win nothing.', icon: '👨‍💻', category: 'Hacker', unlocked: false, rarity: 'rare' },
    { id: 'same-button-20', name: 'Clicked The Same Button 20 Times', description: 'That button clearly deserves it.', icon: '👆', category: 'Hacker', unlocked: false, rarity: 'common' },
    { id: 'zoom-artist', name: 'Zoom In Artist', description: 'Enhance!', icon: '🔍', category: 'Hacker', unlocked: false, rarity: 'common' },
    { id: 'ctrl-zero', name: 'Ctrl+Zer0', description: 'And now, it\'s all tiny.', icon: '🔬', category: 'Hacker', unlocked: false, rarity: 'rare' },
    { id: 'rage-refresher', name: 'Rage Refresher', description: 'Trying to fix something pointless?', icon: '🔄', category: 'Hacker', unlocked: false, rarity: 'common' },
    
    // Master Waster
    { id: 'master-nothing', name: 'Master of Nothing', description: 'Emptiness is a skill.', icon: '🕳️', category: 'Master', unlocked: false, rarity: 'epic' },
    { id: 'false-progress', name: 'False Sense of Progress', description: 'Look at all this effort! For what?', icon: '📈', category: 'Master', unlocked: false, rarity: 'rare' },
    { id: 'achievement-addict', name: 'Achievement Addict', description: 'You\'re playing the game of not-a-game.', icon: '🎮', category: 'Master', unlocked: false, rarity: 'epic' },
    { id: 'collector-distractions', name: 'Collector of Distractions', description: 'Curiosity is a curse.', icon: '🧩', category: 'Master', unlocked: false, rarity: 'rare' },
    { id: 'button-masher', name: 'Button Masher', description: 'It\'s a button. Not a vending machine.', icon: '🥊', category: 'Master', unlocked: false, rarity: 'common' },
    
    // Secret & Hidden
    { id: 'konami-code', name: 'Konami Code', description: 'Classic. Still useless.', icon: '🎮', category: 'Secret', unlocked: false, rarity: 'legendary' },
    { id: 'hidden-banana', name: 'Found the Hidden Banana', description: 'You found… *something*.', icon: '🍌', category: 'Secret', unlocked: false, rarity: 'epic' },
    { id: 'typed-waste', name: 'Typed "waste"', description: 'You\'re self-aware.', icon: '⌨️', category: 'Secret', unlocked: false, rarity: 'rare' },
    { id: 'you-broke-it', name: 'You Broke It', description: 'Glorious chaos.', icon: '💥', category: 'Secret', unlocked: false, rarity: 'legendary' },
    { id: 'touched-corners', name: 'Touched Every Corner', description: 'That was… definitely intentional.', icon: '📐', category: 'Secret', unlocked: false, rarity: 'epic' },
    
    // UI & Preferences
    { id: 'dark-mode-enthusiast', name: 'Dark Mode Enthusiast', description: 'Can\'t decide? Same.', icon: '🌙', category: 'UI', unlocked: false, rarity: 'common' },
    { id: 'light-mode-purist', name: 'Light Mode Purist', description: 'You like pain, huh?', icon: '☀️', category: 'UI', unlocked: false, rarity: 'rare' },
    { id: 'shared-wasting', name: 'Shared Your Wasting', description: 'Peer pressure wins again.', icon: '📤', category: 'UI', unlocked: false, rarity: 'common' },
    { id: 'speedrunner', name: 'Speedrunner', description: 'Blazing fast at wasting time.', icon: '🏃‍♂️', category: 'UI', unlocked: false, rarity: 'epic' },
    { id: 'came-back', name: 'Came Back for More', description: 'The addiction begins.', icon: '🔄', category: 'UI', unlocked: false, rarity: 'rare' },
    { id: 'tapped-out', name: 'Tapped Out', description: 'You got thumbs of steel.', icon: '📱', category: 'UI', unlocked: false, rarity: 'common' }
  ];

  useEffect(() => {
    setAchievements(allAchievements);
    
    // Unlock "Getting Started" immediately
    setTimeout(() => unlockAchievement('opened-page'), 1000);
    
    // Add delay before other achievements can be triggered
    const achievementDelay = 7000; // 7 seconds
    setTimeout(() => {
      setStats(prev => ({ ...prev, achievementsEnabled: true }));
    }, achievementDelay);
    
    // Time tracking
    const timeInterval = setInterval(() => {
      const newTimeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      setStats(prev => ({ ...prev, timeSpent: newTimeSpent }));
      
      // Time-based achievements
      if (newTimeSpent === 60) unlockAchievement('first-minute');
      if (newTimeSpent === 600) unlockAchievement('marathon-waster');
      if (newTimeSpent === 1800) unlockAchievement('still-here');
      
      // Midnight check
      const now = new Date();
      if (now.getHours() >= 0 && now.getHours() < 6) {
        unlockAchievement('time-traveler');
      }
    }, 1000);

    // Idle tracking
    const resetIdleTimer = () => {
      setStats(prev => ({ ...prev, lastActivity: Date.now(), idleTime: 0 }));
      if (idleTimer.current) clearTimeout(idleTimer.current);
      
      idleTimer.current = setTimeout(() => {
        unlockAchievement('no-touch');
        setTimeout(() => unlockAchievement('zen-master'), 20000);
        setTimeout(() => unlockAchievement('statue-mode'), 60000);
      }, 10000);
    };

    // Event listeners
    const handleMouseMoveBasic = () => {
      unlockAchievement('moved-mouse');
      resetIdleTimer();
    };

    const handleClick = (e: MouseEvent) => {
      setStats(prev => {
        const newCount = prev.clickCount + 1;
        const target = e.target as HTMLElement;
        const buttonText = target.textContent || target.getAttribute('data-button') || '';
        
        // Same button clicking detection
        let sameButtonCount = prev.sameButtonClicks;
        if (prev.lastClickedButton === buttonText) {
          sameButtonCount++;
          if (sameButtonCount === 20) unlockAchievement('same-button-20');
        } else {
          sameButtonCount = 1;
        }
        
        // Achievement triggers
        if (newCount === 1) unlockAchievement('first-click');
        if (newCount === 100) unlockAchievement('serial-clicker');
        if (newCount === 200) unlockAchievement('button-masher');
        if (newCount === 500) unlockAchievement('click-master');
        
        return { 
          ...prev, 
          clickCount: newCount,
          sameButtonClicks: sameButtonCount,
          lastClickedButton: buttonText
        };
      });
      resetIdleTimer();
    };

    const handleScroll = () => {
      const scrolled = window.scrollY;
      setStats(prev => {
        if (scrolled > 50 && prev.scrollDistance <= 50) unlockAchievement('scrolled-bit');
        if (scrolled > 5000 && prev.scrollDistance <= 5000) unlockAchievement('scrolled-far');
        if (scrolled > 15000 && prev.scrollDistance <= 15000) unlockAchievement('scroll-maniac');
        return { ...prev, scrollDistance: Math.max(prev.scrollDistance, scrolled) };
      });
      resetIdleTimer();
    };

    const handleResize = () => {
      setStats(prev => {
        const newCount = prev.windowResizes + 1;
        if (newCount === 1) unlockAchievement('found-edge');
        if (newCount === 10) unlockAchievement('resize-maniac');
        return { ...prev, windowResizes: newCount };
      });
      resetIdleTimer();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        unlockAchievement('tab-master');
      }
    };

    // New event handlers for additional achievements
    const handleKeyDown = (e: KeyboardEvent) => {
      // DevTools detection
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        unlockAchievement('devtools-opened');
      }
      
      // Zoom detection
      if (e.ctrlKey && e.key === '0') {
        unlockAchievement('ctrl-zero');
      }
      if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
        setTimeout(() => {
          const zoom = Math.round((window.outerWidth / window.innerWidth) * 100);
          if (zoom >= 150) unlockAchievement('zoom-artist');
        }, 100);
      }
      
      // Konami code detection
      const konamiMap: { [key: string]: string } = {
        'ArrowUp': 'U', 'ArrowDown': 'D', 'ArrowLeft': 'L', 'ArrowRight': 'R',
        'KeyB': 'B', 'KeyA': 'A'
      };
      
      if (konamiMap[e.code]) {
        setStats(prev => {
          const newSequence = prev.konamiSequence + konamiMap[e.code];
          const target = 'UUDDLRLRBA';
          
          if (target.startsWith(newSequence)) {
            if (newSequence === target) {
              unlockAchievement('konami-code');
              return { ...prev, konamiSequence: '' };
            }
            return { ...prev, konamiSequence: newSequence };
          }
          return { ...prev, konamiSequence: konamiMap[e.code] };
        });
      }
      
      resetIdleTimer();
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.value.toLowerCase().includes('waste')) {
        unlockAchievement('typed-waste');
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      unlockAchievement('moved-mouse');
      
      // Corner detection
      const margin = 10;
      const { clientX: x, clientY: y } = e;
      const { innerWidth: w, innerHeight: h } = window;
      
      setStats(prev => {
        const corners = new Set(prev.cornersTouched);
        
        if (x <= margin && y <= margin) corners.add('top-left');
        if (x >= w - margin && y <= margin) corners.add('top-right');
        if (x <= margin && y >= h - margin) corners.add('bottom-left');
        if (x >= w - margin && y >= h - margin) corners.add('bottom-right');
        
        if (corners.size === 4) {
          unlockAchievement('touched-corners');
        }
        
        return { ...prev, cornersTouched: corners };
      });
      
      resetIdleTimer();
    };

    const handleTouchStart = () => {
      setStats(prev => {
        const newCount = prev.mobileTouch + 1;
        if (newCount === 100) unlockAchievement('tapped-out');
        return { ...prev, mobileTouch: newCount };
      });
    };

    const handleBeforeUnload = () => {
      setStats(prev => ({ ...prev, refreshCount: prev.refreshCount + 1 }));
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (e.ctrlKey && e.shiftKey) {
        unlockAchievement('devtools-opened');
      }
    };

    // Error boundary for "You Broke It" achievement
    const handleError = () => {
      unlockAchievement('you-broke-it');
    };

    // Check for returning visitor
    if (typeof window !== 'undefined') {
      const lastVisit = localStorage.getItem('wastemytime-last-visit');
      const today = new Date().toDateString();
      if (lastVisit && lastVisit !== today) {
        unlockAchievement('came-back');
      }
      localStorage.setItem('wastemytime-last-visit', today);

      // Track activity visits
      const visitedActivities = JSON.parse(localStorage.getItem('wastemytime-visited') || '[]');
      if (visitedActivities.length >= 5) {
        unlockAchievement('collector-distractions');
      }

      // Check refresh count
      const refreshCount = parseInt(localStorage.getItem('wastemytime-refresh-count') || '0');
      if (refreshCount >= 3) {
        unlockAchievement('rage-refresher');
      }
      localStorage.setItem('wastemytime-refresh-count', (refreshCount + 1).toString());
    }

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMoveBasic);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('input', handleInput, true);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('error', handleError);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    resetIdleTimer();

    return () => {
      clearInterval(timeInterval);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      document.removeEventListener('mousemove', handleMouseMoveBasic);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('input', handleInput, true);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('error', handleError);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const unlockAchievement = (id: string) => {
    // Allow "Getting Started" achievement to unlock immediately, delay others
    if (id !== 'opened-page' && !stats.achievementsEnabled) {
      return;
    }
    
    setAchievements(prev => {
      const updated = prev.map(achievement => 
        achievement.id === id && !achievement.unlocked
          ? { ...achievement, unlocked: true, unlockedAt: new Date() }
          : achievement
      );
      
      const newlyUnlocked = updated.find(a => a.id === id && a.unlocked);
      if (newlyUnlocked && !prev.find(a => a.id === id)?.unlocked) {
        setNewAchievement(newlyUnlocked);
        setTimeout(() => setNewAchievement(null), 4000);
        
        // Meta achievements
        const unlockedCount = updated.filter(a => a.unlocked).length;
        const timeSinceStart = Date.now() - (stats.achievementStartTime || Date.now());
        
        if (unlockedCount === 10) {
          unlockAchievement('false-progress');
          if (timeSinceStart < 120000) { // 2 minutes
            unlockAchievement('speedrunner');
          }
        }
        if (unlockedCount === 25) unlockAchievement('achievement-addict');
        if (unlockedCount === Math.floor(allAchievements.length / 2)) {
          setTimeout(() => unlockAchievement('completionist'), 1000);
        }
        
        // Idle achievement check
        if (timeSinceStart > 60000 && stats.clickCount === 0 && stats.scrollDistance === 0) {
          unlockAchievement('master-nothing');
        }
      }
      
      return updated;
    });
  };

  const openTrophyCase = () => {
    setShowTrophyCase(true);
    unlockAchievement('trophy-hunter');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-800';
      case 'rare': return 'border-blue-400 bg-blue-900';
      case 'epic': return 'border-purple-400 bg-purple-900';
      case 'legendary': return 'border-yellow-400 bg-yellow-900';
      default: return 'border-gray-400 bg-gray-800';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const categories = [...new Set(achievements.map(a => a.category))];

  return (
    <div className="min-h-screen" style={{
      backgroundColor: '#1a1a2e',
      backgroundImage: `
        linear-gradient(45deg, #16213e 25%, transparent 25%),
        linear-gradient(-45deg, #16213e 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #16213e 75%),
        linear-gradient(-45deg, transparent 75%, #16213e 75%)
      `,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
    }}>
      {/* Retro gaming stars pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffd700'%3E%3Cpolygon points='50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }}></div>

      {/* Achievement Notification */}
      {newAchievement && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black p-4 border-4 border-black shadow-2xl max-w-sm font-mono" style={{
            background: 'linear-gradient(45deg, #ffd700, #ff6b35)',
            border: '4px solid #000',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
          }}>
            <div className="flex items-center gap-3">
              <div className="text-2xl animate-bounce">{newAchievement.icon}</div>
              <div>
                <div className="font-bold text-sm uppercase tracking-wide text-black">★ ACHIEVEMENT GET! ★</div>
                <div className="text-lg font-bold text-black">{newAchievement.name}</div>
                <div className="text-xs text-gray-800">{newAchievement.description}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Banana */}
      <div
        className="absolute opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-4xl z-30"
        style={{ 
          top: '200px', 
          right: '50px',
          transform: 'rotate(45deg)'
        }}
        onClick={() => unlockAchievement('hidden-banana')}
        title="🍌"
      >
        🍌
      </div>

      <div className="max-w-6xl mx-auto p-4 pt-20 relative z-10" style={{ color: '#fff' }}>
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-mono px-4" style={{
            color: '#ffd700',
            textShadow: '0 0 20px #ffd700, 4px 4px 0px #000',
            letterSpacing: '2px'
          }}>
            🏆 ACHIEVEMENT ARENA 🏆
          </h1>
          <p className="text-lg md:text-xl mb-8 font-mono px-4" style={{
            color: '#00ff41',
            textShadow: '0 0 10px #00ff41'
          }}>
            "UNLOCK YOUR DESTINY... OR WHATEVER"
          </p>
          
          <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-sm md:max-w-md mx-auto mb-8 px-4">
            <div className="bg-black border-2 md:border-4 border-green-400 p-2 md:p-4 text-center font-mono" style={{
              boxShadow: '0 0 15px rgba(0, 255, 65, 0.3)'
            }}>
              <div className="text-xl md:text-3xl font-bold" style={{ color: '#00ff41' }}>{unlockedAchievements.length}</div>
              <div className="text-xs uppercase tracking-wide" style={{ color: '#00ff41' }}>UNLOCKED</div>
            </div>
            <div className="bg-black border-2 md:border-4 border-blue-400 p-2 md:p-4 text-center font-mono" style={{
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
            }}>
              <div className="text-xl md:text-3xl font-bold text-blue-400">{achievements.length}</div>
              <div className="text-xs text-blue-400 uppercase tracking-wide">TOTAL</div>
            </div>
            <div className="bg-black border-2 md:border-4 border-yellow-400 p-2 md:p-4 text-center font-mono" style={{
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
            }}>
              <div className="text-xl md:text-3xl font-bold text-yellow-400">{Math.round((unlockedAchievements.length / achievements.length) * 100)}%</div>
              <div className="text-xs text-yellow-400 uppercase tracking-wide">COMPLETE</div>
            </div>
          </div>

          <div className="flex flex-col gap-4 items-center px-4">
            <button
              onClick={openTrophyCase}
              className="font-mono font-bold text-base md:text-lg transition-all uppercase tracking-wide border-2 md:border-4 px-6 md:px-8 py-2 md:py-3 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(45deg, #ff6b35, #ffd700)',
                border: '4px solid #000',
                color: '#000',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                textShadow: '1px 1px 0px #fff'
              }}
            >
              ★ ENTER TROPHY VAULT ★
            </button>
            
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
              <button
                onClick={() => {
                  setStats(prev => ({ ...prev, shareClicks: prev.shareClicks + 1 }));
                  unlockAchievement('shared-wasting');
                  navigator.clipboard?.writeText(window.location.href);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 border-2 border-black font-mono font-bold text-sm md:text-base"
              >
                📤 SHARE
              </button>
              
              <input
                type="text"
                placeholder="Type anything..."
                className="bg-black border-2 border-green-400 text-green-400 px-3 md:px-4 py-2 font-mono text-sm md:text-base flex-1"
                style={{ boxShadow: '0 0 10px rgba(0, 255, 65, 0.3)' }}
              />
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center font-mono px-4" style={{
            color: '#00ff41',
            textShadow: '0 0 10px #00ff41, 2px 2px 0px #000'
          }}>⚡ LATEST UNLOCKS ⚡</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 px-4">
            {unlockedAchievements
              .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
              .slice(0, 3)
              .map(achievement => (
                <div key={achievement.id} className={`${getRarityColor(achievement.rarity)} border-2 md:border-4 p-3 md:p-4 text-center font-mono shadow-xl`} style={{
                  boxShadow: `0 0 20px ${achievement.rarity === 'legendary' ? '#ffd700' : achievement.rarity === 'epic' ? '#a855f7' : achievement.rarity === 'rare' ? '#3b82f6' : '#6b7280'}`
                }}>
                  <div className="text-3xl md:text-4xl mb-2 animate-bounce">{achievement.icon}</div>
                  <div className="font-bold text-white text-xs md:text-sm">{achievement.name.toUpperCase()}</div>
                  <div className="text-xs text-gray-300">{achievement.description}</div>
                  <div className="text-xs mt-2 capitalize font-bold border-t border-white/20 pt-2 text-yellow-400">{achievement.rarity}</div>
                </div>
              ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 px-4">
          <div className="bg-black border-2 border-cyan-400 p-2 md:p-4 text-center font-mono" style={{
            boxShadow: '0 0 15px rgba(34, 211, 238, 0.3)'
          }}>
            <div className="text-xl md:text-2xl font-bold text-cyan-400">{stats.clickCount}</div>
            <div className="text-xs md:text-sm text-cyan-400">CLICKS</div>
          </div>
          <div className="bg-black border-2 border-green-400 p-2 md:p-4 text-center font-mono" style={{
            boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)'
          }}>
            <div className="text-xl md:text-2xl font-bold text-green-400">{Math.round(stats.scrollDistance)}px</div>
            <div className="text-xs md:text-sm text-green-400">SCROLLED</div>
          </div>
          <div className="bg-black border-2 border-purple-400 p-2 md:p-4 text-center font-mono" style={{
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)'
          }}>
            <div className="text-xl md:text-2xl font-bold text-purple-400">{Math.floor(stats.timeSpent / 60)}:{(stats.timeSpent % 60).toString().padStart(2, '0')}</div>
            <div className="text-xs md:text-sm text-purple-400">TIME WASTED</div>
          </div>
          <div className="bg-black border-2 border-orange-400 p-2 md:p-4 text-center font-mono" style={{
            boxShadow: '0 0 15px rgba(251, 146, 60, 0.3)'
          }}>
            <div className="text-xl md:text-2xl font-bold text-orange-400">{stats.windowResizes}</div>
            <div className="text-xs md:text-sm text-orange-400">RESIZES</div>
          </div>
        </div>

        {/* Trophy Case Modal */}
        {showTrophyCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(5px)'
          }}>
            <div className="bg-black border-4 border-yellow-400 shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-auto font-mono" style={{
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)'
            }}>
              <div className="p-6 border-b-4 border-yellow-400" style={{
                background: 'linear-gradient(45deg, #1a1a2e, #16213e)'
              }}>
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold" style={{
                    color: '#ffd700',
                    textShadow: '0 0 20px #ffd700'
                  }}>🏆 TROPHY VAULT 🏆</h2>
                  <button
                    onClick={() => setShowTrophyCase(false)}
                    className="text-red-400 hover:text-red-300 text-2xl font-bold border-2 border-red-400 px-3 py-1 hover:bg-red-400 hover:text-black transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6" style={{
                background: 'linear-gradient(45deg, #1a1a2e, #16213e)'
              }}>
                {categories.map(category => (
                  <div key={category} className="mb-8">
                    <h3 className="text-xl font-bold mb-4 font-mono" style={{
                      color: '#00ff41',
                      textShadow: '0 0 10px #00ff41'
                    }}>[ {category.toUpperCase()} ]</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {achievements
                        .filter(a => a.category === category)
                        .map(achievement => (
                          <div
                            key={achievement.id}
                            className={`p-4 border-4 transition-all font-mono ${
                              achievement.unlocked
                                ? `${getRarityColor(achievement.rarity)} text-white shadow-lg transform scale-105 animate-pulse`
                                : 'bg-gray-900 border-gray-600 opacity-50'
                            }`}
                            style={achievement.unlocked ? {
                              boxShadow: `0 0 20px ${achievement.rarity === 'legendary' ? '#ffd700' : achievement.rarity === 'epic' ? '#a855f7' : achievement.rarity === 'rare' ? '#3b82f6' : '#6b7280'}`
                            } : {}}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-2 animate-bounce">{achievement.unlocked ? achievement.icon : '🔒'}</div>
                              <div className="font-bold text-sm">{achievement.unlocked ? achievement.name.toUpperCase() : '???'}</div>
                              <div className="text-xs opacity-90">
                                {achievement.unlocked ? achievement.description : 'LOCKED'}
                              </div>
                              {achievement.unlocked && (
                                <div className="text-xs mt-2 opacity-75 uppercase font-bold border-t border-white/20 pt-2">{achievement.rarity}</div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slide-in {
            animation: slide-in 0.5s ease-out;
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
}