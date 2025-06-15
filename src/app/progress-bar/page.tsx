'use client';

import { useState, useEffect, useRef } from 'react';

export default function ProgressBarSimulator() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Initializing...');
  const [isStarted, setIsStarted] = useState(false);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastGlitch, setLastGlitch] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const timerRef = useRef<NodeJS.Timeout>();

  const messages = [
    "Installing nonsense...",
    "Compiling spaghetti...",
    "Waiting for user validation...",
    "Downloading more RAM...",
    "Calculating infinity...",
    "Warming up the pixels...",
    "Convincing electrons to cooperate...",
    "Teaching AI to procrastinate...",
    "Buffering the buffer...",
    "Loading loading screen...",
    "Optimizing pessimizations...",
    "Debugging the debugger...",
    "Encrypting random numbers...",
    "Translating binary to emoji...",
    "Calibrating quantum flux...",
    "Syncing asynchronous operations...",
    "Herding digital cats...",
    "Untangling network cables virtually...",
    "Asking servers nicely to respond...",
    "Convincing cache to be fresh...",
    "Teaching robots to count backwards...",
    "Organizing pixel dust...",
    "Feeding the algorithm cookies...",
    "Waiting for satellites to align...",
    "Defragmenting compressed air...",
    "Reticulating splines...",
    "Polishing zeros and ones...",
    "Consulting the magic 8-ball...",
    "Summoning digital spirits...",
    "Loading cat videos for motivation...",
    "Converting coffee to code...",
    "Searching for lost packets...",
    "Negotiating with firewalls...",
    "Training neural networks to be social...",
    "Optimizing suboptimal optimizations...",
    "Rendering invisible graphics...",
    "Calculating the meaning of 42...",
    "Waiting for inspiration to load...",
    "Synchronizing random chaos...",
    "Compressing incompressible data..."
  ];

  const glitchMessages = [
    "ERROR: Progress escaped! Recapturing...",
    "OOPS: Something went backwards...",
    "GLITCH: Time paradox detected...",
    "WARNING: Progress machine overheated...",
    "FAULT: User impatience detected...",
    "ALERT: Progress bar rebelled...",
    "ERROR: Lost count, starting over...",
    "ISSUE: Progress got stage fright..."
  ];

  const successMessages = [
    "🎉 Finally! You've mastered the art of waiting!",
    "🏆 Congratulations! You've achieved peak procrastination!",
    "✨ Success! You're now certified in Digital Patience!",
    "🎊 Amazing! You've graduated from Progress Bar University!",
    "🌟 Fantastic! You've unlocked the secret of eternal loading!",
    "🎯 Perfect! You're now a professional time waster!"
  ];

  useEffect(() => {
    if (isStarted && !isFinished) {
      // Timer for elapsed time
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);

      // Progress simulation
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          let newProgress = prev;
          
          // Random chance to glitch backwards (10% chance)
          if (Math.random() < 0.1 && prev > 15 && Date.now() - lastGlitch > 10000) {
            const glitchAmount = Math.random() * 20 + 5; // 5-25% backwards
            newProgress = Math.max(0, prev - glitchAmount);
            setMessage(glitchMessages[Math.floor(Math.random() * glitchMessages.length)]);
            setLastGlitch(Date.now());
            return newProgress;
          }

          // Normal progress (slower as it gets higher)
          const progressRate = prev > 80 ? 0.1 : prev > 60 ? 0.3 : prev > 40 ? 0.5 : 0.8;
          newProgress = Math.min(99.9, prev + Math.random() * progressRate);
          
          // Change message occasionally
          if (Math.random() < 0.3) {
            setMessage(messages[Math.floor(Math.random() * messages.length)]);
          }

          return newProgress;
        });
      }, 500 + Math.random() * 1000); // Variable speed

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isStarted, isFinished, lastGlitch]);

  useEffect(() => {
    // Show finish button after 3 minutes (180 seconds)
    if (timeElapsed >= 180 && !showFinishButton && !isFinished) {
      setShowFinishButton(true);
    }
  }, [timeElapsed, showFinishButton, isFinished]);

  const startProgress = () => {
    setIsStarted(true);
    setProgress(0);
    setTimeElapsed(0);
    setMessage('Initializing quantum processors...');
  };

  const handleProgressBarClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickCount === 4) {
      setMessage("Stop clicking me! I'm trying to load!");
    } else if (clickCount === 9) {
      setMessage("Seriously, clicking won't make me faster!");
    } else if (clickCount === 19) {
      setMessage("Fine... here's 5% for your persistence...");
      setProgress(prev => Math.min(99.9, prev + 5));
    } else if (clickCount > 30) {
      setMessage("You're determined, I'll give you that...");
    }
  };

  const finishProgress = () => {
    setProgress(100);
    setMessage(successMessages[Math.floor(Math.random() * successMessages.length)]);
    setIsFinished(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetProgress = () => {
    setProgress(0);
    setMessage('Initializing...');
    setIsStarted(false);
    setShowFinishButton(false);
    setTimeElapsed(0);
    setIsFinished(false);
    setClickCount(0);
    setLastGlitch(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    if (isFinished) return 'bg-green-500';
    if (progress > 90) return 'bg-yellow-500 animate-pulse';
    if (progress > 70) return 'bg-blue-500';
    if (progress > 40) return 'bg-purple-500';
    return 'bg-blue-500';
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl animate-bounce opacity-20">⚠️</div>
          <div className="absolute top-40 right-20 text-4xl animate-pulse opacity-30 transform rotate-12">🔧</div>
          <div className="absolute bottom-32 left-20 text-5xl animate-spin-slow opacity-25">⚙️</div>
          <div className="absolute bottom-20 right-10 text-3xl animate-bounce opacity-20 transform -rotate-12">💥</div>
          <div className="absolute top-60 left-1/2 text-4xl animate-pulse opacity-25">⛔</div>
          <div className="absolute top-32 left-1/3 text-2xl animate-bounce opacity-30">🚨</div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10">
          <div className="text-center max-w-2xl">
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent animate-pulse">
                Broken Progress Bar
              </h1>
              <div className="text-3xl md:text-4xl animate-bounce">🚧</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mb-8 border-2 border-orange-200">
              <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium animate-pulse">
                "A progress bar that forgot how to progress properly."
              </p>
              <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                Experience the thrill of watching a progress bar that might never finish.
                <br />
                <span className="text-orange-600 font-semibold">Will you have the patience to see it through?</span>
              </p>
              
              <button
                onClick={startProgress}
                className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-lg md:text-xl transition-all transform hover:scale-110 hover:rotate-1 shadow-2xl animate-pulse"
              >
                🚀 Start Loading Something Important
              </button>
            </div>

            <div className="text-sm text-gray-500 animate-bounce">
              ⚠️ Warning: May cause extreme impatience ⚠️
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 text-4xl animate-bounce opacity-20">⏳</div>
        <div className="absolute top-60 right-10 text-3xl animate-pulse opacity-25 transform rotate-45">📊</div>
        <div className="absolute bottom-40 left-10 text-5xl animate-spin-slow opacity-20">🌀</div>
        <div className="absolute bottom-10 right-20 text-2xl animate-bounce opacity-30">⚡</div>
        <div className="absolute top-32 right-1/3 text-3xl animate-pulse opacity-25">🔄</div>
      </div>

      {/* Reset button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={resetProgress}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
        >
          🔄 Start Over
        </button>
      </div>

      {/* Hidden finish button (appears after 3 minutes) */}
      {showFinishButton && !isFinished && (
        <div className="absolute top-20 left-4 animate-bounce z-20">
          <button
            onClick={finishProgress}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-110 shadow-2xl border-2 border-green-300"
          >
            🏁 FINISH
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto pt-20 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent px-4">
            {isFinished ? '🎉 Loading Complete!' : 'Loading Something Very Important...'}
          </h1>
          {!isFinished && (
            <div className="text-base md:text-lg text-gray-600 animate-pulse">
              {timeElapsed > 60 ? '⏰ Still loading...' : '🚀 Processing...'}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border-2 border-purple-200">
          <div className="mb-6">
            <div 
              className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-8 cursor-pointer transition-all hover:h-10 shadow-inner border-2 border-gray-300"
              onClick={handleProgressBarClick}
            >
              <div 
                className={`h-full rounded-full transition-all duration-1000 shadow-lg ${getProgressColor()} ${!isFinished && progress > 50 ? 'animate-pulse' : ''}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-gray-700 mb-3">
              {progress.toFixed(1)}%
            </div>
            <div className={`text-sm md:text-lg ${isFinished ? 'text-green-600' : 'text-purple-600'} font-medium animate-pulse bg-gray-50 rounded-full px-4 md:px-6 py-2 border-2 ${isFinished ? 'border-green-200' : 'border-purple-200'}`}>
              {message}
            </div>
          </div>
        </div>

        {/* Stats and Fun Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-4 md:p-6 border-2 border-blue-200">
            <h3 className="font-bold text-gray-800 mb-4 text-lg md:text-xl">📈 Statistics</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>⏱️ Time wasted:</span>
                <span className="font-bold text-blue-600">{formatTime(timeElapsed)}</span>
              </div>
              <div className="flex justify-between">
                <span>👆 Progress bar clicks:</span>
                <span className="font-bold text-purple-600">{clickCount}</span>
              </div>
              <div className="flex justify-between">
                <span>⏰ Estimated completion:</span>
                <span className="font-bold text-orange-600">{isFinished ? 'DONE! 🎉' : '∞ minutes'}</span>
              </div>
              <div className="flex justify-between">
                <span>🏆 Patience level:</span>
                <span className={`font-bold ${timeElapsed > 120 ? 'text-gold-600' : timeElapsed > 60 ? 'text-green-600' : 'text-gray-600'}`}>
                  {timeElapsed > 120 ? 'Legendary 👑' : timeElapsed > 60 ? 'High 🌟' : 'Normal'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl shadow-xl p-4 md:p-6 border-2 border-yellow-200">
            <h3 className="font-bold text-gray-800 mb-4 text-lg md:text-xl">💡 Pro Tips</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-purple-500">👆</span>
                <span>Try clicking the progress bar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">🧘</span>
                <span>Patience is a virtue (apparently)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-500">⏳</span>
                <span>This might take a while...</span>
              </div>
            </div>
          </div>
        </div>

        {isFinished && (
          <div className="mt-8">
            <div className="bg-gradient-to-r from-green-100 via-emerald-50 to-teal-100 border-2 border-green-300 rounded-3xl p-6 md:p-8 text-center shadow-2xl">
              <div className="text-4xl md:text-6xl mb-4 animate-bounce">🎊</div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                Congratulations!
              </h2>
              <p className="text-lg md:text-xl text-gray-700 mb-4">
                You've successfully waited for absolutely nothing to complete!
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 text-base md:text-lg">
                <div className="bg-white rounded-full px-4 py-2 shadow-lg">
                  ⏱️ Time: <span className="font-bold text-green-600">{formatTime(timeElapsed)}</span>
                </div>
                <div className="bg-white rounded-full px-4 py-2 shadow-lg">
                  👆 Clicks: <span className="font-bold text-purple-600">{clickCount}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
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