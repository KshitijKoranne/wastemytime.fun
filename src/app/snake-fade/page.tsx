'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function SnakeFade() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [score, setScore] = useState(0);
  const [contrast, setContrast] = useState(1);
  const [snakePositions, setSnakePositions] = useState([168, 169, 170, 171]);
  const [applePosition, setApplePosition] = useState(100);
  const [inputs, setInputs] = useState<string[]>([]);

  const tilesRef = useRef<(HTMLDivElement | null)[]>([]);
  const animationRef = useRef<number>();
  const startTimestampRef = useRef<number>();
  const lastTimestampRef = useRef<number>();
  const stepsTakenRef = useRef(-1);
  const snakePositionsRef = useRef([168, 169, 170, 171]);
  const applePositionRef = useRef(100);
  const inputsRef = useRef<string[]>([]);
  const scoreRef = useRef(0);
  const hardModeRef = useRef(false);
  const gameStartedRef = useRef(false);
  const gameOverRef = useRef(false);

  // Configuration
  const width = 15;
  const height = 15;
  const speed = 200;
  const initialFadeSpeed = 5000;
  const hardFadeSpeed = 4000;
  const fadeExponential = 1.024;
  const hardFadeExponential = 1.025;
  const contrastIncrease = 0.5;

  const setTile = useCallback((index: number, styles: Record<string, string> = {}) => {
    const tile = tilesRef.current[index];
    if (!tile) return;

    const defaults = {
      width: '100%',
      height: '100%',
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto',
      backgroundColor: 'transparent',
      borderRadius: '0'
    };

    const cssProperties = { ...defaults, ...styles };
    Object.entries(cssProperties).forEach(([key, value]) => {
      tile.style.setProperty(key.replace(/([A-Z])/g, '-$1').toLowerCase(), value);
    });
  }, []);

  const resetGame = useCallback(() => {
    const initialSnakePositions = [168, 169, 170, 171];
    const initialApplePosition = 100;
    
    // Update refs
    snakePositionsRef.current = initialSnakePositions;
    applePositionRef.current = initialApplePosition;
    inputsRef.current = [];
    scoreRef.current = 0;
    gameStartedRef.current = false;
    gameOverRef.current = false;
    
    // Update state
    setSnakePositions(initialSnakePositions);
    setApplePosition(initialApplePosition);
    setScore(0);
    setContrast(1);
    setGameStarted(false);
    setGameOver(false);
    setInputs([]);
    
    startTimestampRef.current = undefined;
    lastTimestampRef.current = undefined;
    stepsTakenRef.current = -1;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Clear all tiles
    for (let i = 0; i < width * height; i++) {
      setTile(i);
    }

    // Render apple
    setTile(initialApplePosition, {
      backgroundColor: '#00ff00',
      borderRadius: '50%',
      boxShadow: '0 0 10px #00ff00'
    });

    // Render snake
    [169, 170, 171].forEach(position => {
      setTile(position, { 
        backgroundColor: '#00ff00',
        boxShadow: '0 0 5px #00ff00'
      });
    });
  }, [setTile]);

  const addNewApple = useCallback(() => {
    let newPosition;
    do {
      newPosition = Math.floor(Math.random() * width * height);
    } while (snakePositions.includes(newPosition));

    setTile(newPosition, {
      backgroundColor: 'black',
      borderRadius: '50%'
    });

    setApplePosition(newPosition);
  }, [snakePositions, setTile]);

  const getDirection = (first: number, second: number) => {
    if (first - 1 === second) return 'right';
    if (first + 1 === second) return 'left';
    if (first - width === second) return 'down';
    if (first + width === second) return 'up';
    return 'right'; // default
  };

  const headDirection = useCallback(() => {
    if (snakePositions.length < 2) return 'right';
    const head = snakePositions[snakePositions.length - 1];
    const neck = snakePositions[snakePositions.length - 2];
    return getDirection(head, neck);
  }, [snakePositions]);

  const getNextPosition = useCallback(() => {
    const headPosition = snakePositions[snakePositions.length - 1];
    const snakeDirection = inputs[0] || headDirection();
    
    switch (snakeDirection) {
      case 'right': {
        const nextPosition = headPosition + 1;
        if (nextPosition % width === 0) throw new Error('The snake hit the wall');
        if (snakePositions.slice(1).includes(nextPosition))
          throw new Error('The snake bit itself');
        return nextPosition;
      }
      case 'left': {
        const nextPosition = headPosition - 1;
        if (nextPosition % width === width - 1 || nextPosition < 0)
          throw new Error('The snake hit the wall');
        if (snakePositions.slice(1).includes(nextPosition))
          throw new Error('The snake bit itself');
        return nextPosition;
      }
      case 'down': {
        const nextPosition = headPosition + width;
        if (nextPosition > width * height - 1)
          throw new Error('The snake hit the wall');
        if (snakePositions.slice(1).includes(nextPosition))
          throw new Error('The snake bit itself');
        return nextPosition;
      }
      case 'up': {
        const nextPosition = headPosition - width;
        if (nextPosition < 0) throw new Error('The snake hit the wall');
        if (snakePositions.slice(1).includes(nextPosition))
          throw new Error('The snake bit itself');
        return nextPosition;
      }
      default:
        throw new Error('Invalid direction');
    }
  }, [snakePositions, inputs, headDirection]);

  const gameLoop = useCallback((timestamp: number) => {
    if (!gameStartedRef.current || gameOverRef.current) return;

    try {
      if (!startTimestampRef.current) startTimestampRef.current = timestamp;
      const totalElapsedTime = timestamp - startTimestampRef.current;
      const timeElapsedSinceLastCall = lastTimestampRef.current ? 
        timestamp - lastTimestampRef.current : 0;

      const stepsShouldHaveTaken = Math.floor(totalElapsedTime / speed);

      // Move snake when it's time for a new step
      if (stepsTakenRef.current !== stepsShouldHaveTaken) {
        const currentSnakePositions = snakePositionsRef.current;
        const currentApplePosition = applePositionRef.current;
        const currentInputs = inputsRef.current;
        
        // Get next position
        const headPosition = currentSnakePositions[currentSnakePositions.length - 1];
        const snakeDirection = currentInputs[0] || (() => {
          if (currentSnakePositions.length < 2) return 'right';
          const head = currentSnakePositions[currentSnakePositions.length - 1];
          const neck = currentSnakePositions[currentSnakePositions.length - 2];
          if (head - 1 === neck) return 'right';
          if (head + 1 === neck) return 'left';
          if (head - width === neck) return 'down';
          if (head + width === neck) return 'up';
          return 'right';
        })();
        
        let newHeadPosition;
        switch (snakeDirection) {
          case 'right': {
            newHeadPosition = headPosition + 1;
            if (newHeadPosition % width === 0) throw new Error('The snake hit the wall');
            if (currentSnakePositions.slice(1).includes(newHeadPosition))
              throw new Error('The snake bit itself');
            break;
          }
          case 'left': {
            newHeadPosition = headPosition - 1;
            if (newHeadPosition % width === width - 1 || newHeadPosition < 0)
              throw new Error('The snake hit the wall');
            if (currentSnakePositions.slice(1).includes(newHeadPosition))
              throw new Error('The snake bit itself');
            break;
          }
          case 'down': {
            newHeadPosition = headPosition + width;
            if (newHeadPosition > width * height - 1)
              throw new Error('The snake hit the wall');
            if (currentSnakePositions.slice(1).includes(newHeadPosition))
              throw new Error('The snake bit itself');
            break;
          }
          case 'up': {
            newHeadPosition = headPosition - width;
            if (newHeadPosition < 0) throw new Error('The snake hit the wall');
            if (currentSnakePositions.slice(1).includes(newHeadPosition))
              throw new Error('The snake bit itself');
            break;
          }
          default:
            throw new Error('Invalid direction');
        }
        
        const newSnakePositions = [...currentSnakePositions, newHeadPosition];
        
        // Clear previous tail
        setTile(currentSnakePositions[0]);

        if (newHeadPosition !== currentApplePosition) {
          // Remove tail
          newSnakePositions.shift();
        } else {
          // Apple eaten
          scoreRef.current++;
          setScore(scoreRef.current);
          setContrast(prev => Math.min(1, prev + contrastIncrease));
          
          // Add new apple
          let newApplePosition;
          do {
            newApplePosition = Math.floor(Math.random() * width * height);
          } while (newSnakePositions.includes(newApplePosition));
          
          setTile(newApplePosition, {
            backgroundColor: '#00ff00',
            borderRadius: '50%',
            boxShadow: '0 0 10px #00ff00'
          });
          
          applePositionRef.current = newApplePosition;
          setApplePosition(newApplePosition);
        }

        // Set previous head to full size
        if (currentSnakePositions.length > 1) {
          setTile(currentSnakePositions[currentSnakePositions.length - 2], { 
            backgroundColor: '#00ff00',
            boxShadow: '0 0 5px #00ff00'
          });
        }

        // Set new head
        setTile(newHeadPosition, { 
          backgroundColor: '#00ff00',
          boxShadow: '0 0 5px #00ff00'
        });

        // Update refs and state
        snakePositionsRef.current = newSnakePositions;
        setSnakePositions(newSnakePositions);
        
        inputsRef.current = currentInputs.slice(1);
        setInputs(inputsRef.current);
        
        stepsTakenRef.current = stepsShouldHaveTaken;
      }

      // Always decrease contrast over time
      if (lastTimestampRef.current && timeElapsedSinceLastCall > 0) {
        const fadeSpeed = hardModeRef.current ? hardFadeSpeed : initialFadeSpeed;
        const fadeExp = hardModeRef.current ? hardFadeExponential : fadeExponential;
        const contrastDecrease = timeElapsedSinceLastCall / 
          (Math.pow(fadeExp, scoreRef.current) * fadeSpeed);
        
        setContrast(prev => {
          const newContrast = Math.max(0, prev - contrastDecrease);
          return newContrast;
        });
      }

      lastTimestampRef.current = timestamp;
      // Continue the game loop
      animationRef.current = requestAnimationFrame(gameLoop);
    } catch (error) {
      gameOverRef.current = true;
      gameStartedRef.current = false;
      setGameOver(true);
      setGameStarted(false);
      setContrast(1); // Reset contrast to 100% when game ends
    }
  }, [setTile]);

  const startGame = useCallback(() => {
    gameStartedRef.current = true;
    gameOverRef.current = false;
    setGameStarted(true);
    setGameOver(false);
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', ' ', 'H', 'h', 'E', 'e'].includes(event.key)) {
      return;
    }

    event.preventDefault();

    if (event.key === ' ') {
      resetGame();
      setTimeout(startGame, 100);
      return;
    }

    if (event.key === 'H' || event.key === 'h') {
      hardModeRef.current = true;
      setHardMode(true);
      resetGame();
      return;
    }

    if (event.key === 'E' || event.key === 'e') {
      hardModeRef.current = false;
      setHardMode(false);
      resetGame();
      return;
    }

    const currentInputs = inputsRef.current;
    const currentSnakePositions = snakePositionsRef.current;
    
    const getCurrentDirection = () => {
      if (currentInputs.length > 0) return currentInputs[currentInputs.length - 1];
      if (currentSnakePositions.length < 2) return 'right';
      const head = currentSnakePositions[currentSnakePositions.length - 1];
      const neck = currentSnakePositions[currentSnakePositions.length - 2];
      if (head - 1 === neck) return 'right';
      if (head + 1 === neck) return 'left';
      if (head - width === neck) return 'down';
      if (head + width === neck) return 'up';
      return 'right';
    };

    const currentDirection = getCurrentDirection();
    
    // Only allow arrow keys to start game if game is not over
    if (!gameOverRef.current) {
      if (event.key === 'ArrowLeft' && currentDirection !== 'left' && currentDirection !== 'right') {
        inputsRef.current = [...currentInputs, 'left'];
        setInputs(inputsRef.current);
        if (!gameStartedRef.current) startGame();
      } else if (event.key === 'ArrowUp' && currentDirection !== 'up' && currentDirection !== 'down') {
        inputsRef.current = [...currentInputs, 'up'];
        setInputs(inputsRef.current);
        if (!gameStartedRef.current) startGame();
      } else if (event.key === 'ArrowRight' && currentDirection !== 'right' && currentDirection !== 'left') {
        inputsRef.current = [...currentInputs, 'right'];
        setInputs(inputsRef.current);
        if (!gameStartedRef.current) startGame();
      } else if (event.key === 'ArrowDown' && currentDirection !== 'down' && currentDirection !== 'up') {
        inputsRef.current = [...currentInputs, 'down'];
        setInputs(inputsRef.current);
        if (!gameStartedRef.current) startGame();
      }
    }
  }, [resetGame, startGame]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleKeyDown]);

  return (
    <div className="h-screen overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%, #0a0a0a 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 10s ease infinite'
    }}>
      {/* Stats in top right corner */}
      <div className="absolute top-20 right-4 z-10 flex space-x-4">
        <div className="bg-black border border-green-400 px-3 py-2 font-mono" style={{
          boxShadow: 'inset 0 0 10px rgba(0, 255, 0, 0.2)'
        }}>
          <div className="text-xs text-green-400">CONTRAST</div>
          <div className="font-bold text-green-400 text-base">
            {Math.floor(contrast * 100)}%
          </div>
        </div>
        <div className="bg-black border border-green-400 px-3 py-2 font-mono" style={{
          boxShadow: 'inset 0 0 10px rgba(0, 255, 0, 0.2)'
        }}>
          <div className="text-xs text-green-400">SCORE</div>
          <div className="font-bold text-green-400 text-base">
            {hardMode ? `HARD ${score}` : score}
          </div>
        </div>
      </div>

      {/* Game area with controlled opacity */}
      <div className="h-full flex items-center justify-center px-2 sm:px-4">
        <div 
          className="flex flex-col items-center justify-center text-center"
          style={{ opacity: contrast }}
        >
          {/* Title Section */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-4 text-green-400 font-mono" style={{
              textShadow: '0 0 20px #00ff00, 0 0 40px #00ff00, 2px 2px 0px #000'
            }}>
              SNAKE.EXE
            </h1>
            <div className="bg-black border-2 border-green-400 p-2 sm:p-3 inline-block" style={{
              boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)'
            }}>
              <p className="text-green-400 font-mono text-sm sm:text-base">
                > VISIBILITY_PROTOCOL_ACTIVE
              </p>
            </div>
          </div>


          {/* Game Board */}
          <div className="bg-black border-2 border-green-400 p-2 sm:p-3 md:p-4" style={{
            boxShadow: '0 0 25px rgba(0, 255, 0, 0.3), inset 0 0 15px rgba(0, 255, 0, 0.1)'
          }}>
            <div 
              className="grid gap-0 bg-black"
              style={{ 
                gridTemplateColumns: `repeat(${width}, 1fr)`,
                gridTemplateRows: `repeat(${height}, 1fr)`,
                maxWidth: '80vw',
                maxHeight: '60vh',
                aspectRatio: '1/1'
              }}
            >
              {Array.from({ length: width * height }, (_, i) => (
                <div
                  key={i}
                  className="border border-green-900 bg-black"
                  style={{
                    width: 'clamp(12px, 4vw, 24px)',
                    height: 'clamp(12px, 4vw, 24px)'
                  }}
                >
                  <div
                    ref={el => {
                      tilesRef.current[i] = el;
                    }}
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Game Status Messages - Positioned over game */}
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="bg-black border border-green-400 p-4 font-mono" style={{
                boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)'
              }}>
                <p className="text-green-400 mb-2 text-base">> PRESS ARROW KEY OR SPACE TO START</p>
                <p className="text-green-400 text-sm opacity-80">
                  > PRESS H FOR HARD MODE
                </p>
              </div>
            </div>
          )}
          
          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="bg-red-900 border border-red-400 p-4 font-mono" style={{
                boxShadow: '0 0 15px rgba(255, 0, 0, 0.3)'
              }}>
                <p className="text-red-400 text-lg font-bold mb-2">> GAME TERMINATED</p>
                <p className="text-red-400 mb-2 text-base">> PRESS SPACE TO RESTART</p>
                <p className="text-red-400 text-sm opacity-80">
                  {hardMode 
                    ? "> PRESS E FOR EASY MODE"
                    : "> PRESS H FOR HARD MODE"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS animations and styles */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Prevent zoom on mobile */
        button {
          touch-action: manipulation;
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .container {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}