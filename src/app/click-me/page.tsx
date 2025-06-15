'use client';

import { useState, useEffect } from 'react';

export default function ClickMeForever() {
  const [count, setCount] = useState(0);
  const [clickEffect, setClickEffect] = useState<{id: number, x: number, y: number}[]>([]);
  const [screenClicks, setScreenClicks] = useState<{id: number, x: number, y: number, color: string, rotation: number}[]>([]);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const messages = [
    "Keep going! You're doing great!",
    "This is definitely productive...",
    "Your finger is getting stronger!",
    "The internet is proud of you",
    "This is totally not a waste of time",
    "You're in the zone now!",
    "Click harder! With feeling!",
    "Your dedication is admirable",
    "This is going on your resume",
    "Breaking news: Person clicks button!",
  ];

  const milestones = [
    { count: 10, message: "🎉 Double digits! You're unstoppable!" },
    { count: 50, message: "🚀 Halfway to 100! What a legend!" },
    { count: 100, message: "💯 CENTURY! You're officially awesome!" },
    { count: 250, message: "🌟 Quarter-thousand clicks! Why stop now?" },
    { count: 500, message: "🔥 500 clicks! Your dedication is concerning..." },
    { count: 1000, message: "🎯 ONE THOUSAND! You might have a problem..." },
  ];

  const realFacts = [
    "Honey never spoils - archaeologists found edible honey in Egyptian tombs over 3000 years old",
    "Octopuses have three hearts and blue blood",
    "A group of flamingos is called a 'flamboyance'",
    "Bananas are berries, but strawberries aren't",
    "Wombat poop is cube-shaped",
    "A shrimp's heart is in its head",
    "Butterflies taste with their feet",
    "Sea otters hold hands while sleeping to avoid drifting apart",
    "Penguins have knees, they're just hidden under their feathers",
    "A cow gives nearly 200,000 glasses of milk in her lifetime",
    "Dolphins have names for each other",
    "Elephants are afraid of bees",
    "A group of owls is called a 'parliament'",
    "Koalas sleep 22 hours a day",
    "A single cloud can weigh more than a million pounds",
    "Your nose can remember 50,000 different scents",
    "A jiffy is an actual unit of time - 1/100th of a second",
    "The unicorn is Scotland's national animal",
    "Bubble wrap was originally invented as wallpaper",
    "The longest recorded flight of a chicken is 13 seconds",
    "A group of pandas is called an 'embarrassment'",
    "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid",
    "There are more possible games of chess than atoms in the observable universe",
    "A day on Venus is longer than its year",
    "Pineapples take two years to grow",
    "The fear of long words is called hippopotomonstrosesquippedaliophobia",
    "A group of zebras is called a 'dazzle'",
    "Goldfish can live for decades with proper care",
    "The shortest war in history lasted 38-45 minutes",
    "Lobsters were once considered prison food",
    "A group of crows is called a 'murder'",
    "Sharks have been around longer than trees",
    "The human brain uses 20% of the body's energy",
    "A single strand of spaghetti is called a 'spaghetto'",
    "Avocados are toxic to birds",
    "The Great Wall of China isn't visible from space with the naked eye",
    "A group of jellyfish is called a 'smack'",
    "Polar bears' skin is black underneath their white fur",
    "The inventor of the Pringles can is buried in one",
    "There are more trees on Earth than stars in the Milky Way galaxy",
    "A group of pugs is called a 'grumble'",
    "Pistol shrimp can snap their claws so fast it creates a bubble that collapses with the force of a bullet",
    "Mantis shrimp have 16 types of color receptors (humans have 3)",
    "A group of ferrets is called a 'business'",
    "Cats have a third eyelid called a nictitating membrane",
    "A group of rhinos is called a 'crash'",
    "The longest recorded lifespan of a mayfly is 24 hours",
    "A group of hippos is called a 'bloat'",
    "Hummingbirds are the only birds that can fly backwards",
    "A group of ravens is called an 'unkindness'",
    "Seahorses are the only species where males get pregnant",
    "A group of kangaroos is called a 'mob'",
    "Sloths only defecate once a week",
    "A group of lemurs is called a 'conspiracy'",
    "Tardigrades can survive in space",
    "A group of hedgehogs is called a 'prickle'",
    "Axolotls can regenerate entire limbs",
    "A group of otters is called a 'romp'",
    "Male platypuses are venomous",
    "A group of bats is called a 'colony'",
    "Flamingos are pink because of the shrimp they eat",
    "A group of peacocks is called an 'ostentation'",
    "Giraffes have the same number of neck vertebrae as humans (7)",
    "A group of meerkats is called a 'mob'",
    "Cheetahs can't roar, they can only chirp and purr",
    "A group of lions is called a 'pride'",
    "Polar bears are actually black under their white fur",
    "A group of wolves is called a 'pack'",
    "Penguins can drink saltwater because they have a gland that filters salt",
    "A group of fish is called a 'school'",
    "Jellyfish are 95% water",
    "A group of geese is called a 'gaggle' on land and a 'skein' in flight",
    "Hummingbirds weigh less than a penny",
    "A group of turkeys is called a 'rafter'",
    "Owls can't move their eyes, so they have to turn their heads",
    "A group of chickens is called a 'flock'",
    "Woodpeckers have a special bone that wraps around their brain to prevent concussions",
    "A group of ducks is called a 'paddling'",
    "Cardinals mate for life",
    "A group of eagles is called a 'convocation'",
    "Albatrosses can sleep while flying",
    "A group of swans is called a 'bevy'",
    "Parrots name their babies",
    "A group of crows in flight is called a 'murder'",
    "Crows can remember human faces for years",
    "A group of starlings is called a 'murmuration'",
    "Ravens can learn to mimic human speech better than some parrots",
    "A group of robins is called a 'round'",
    "Blue jays are excellent mimics and can imitate hawk calls",
    "A group of cardinals is called a 'college'",
    "Hummingbirds have the highest metabolism of any homeothermic animal",
    "A group of finches is called a 'charm'",
    "Pigeons can see ultraviolet light",
    "A group of sparrows is called a 'host'",
    "Owls have asymmetrical ear openings to help them locate prey",
    "A group of hawks is called a 'kettle'",
    "Falcons are the fastest animals on Earth when diving",
    "A group of vultures is called a 'wake'",
    "Condors can soar for hours without flapping their wings",
    "A group of pelicans is called a 'squadron'",
    "Flamingos can only eat with their heads upside down",
    "A group of storks is called a 'mustering'",
    "Cranes are symbols of longevity in many cultures",
    "A group of herons is called a 'siege'",
    "Ibises were sacred to ancient Egyptians",
    "A group of spoonbills is called a 'bowl'",
    "Ostriches are the largest living birds",
    "A group of emus is called a 'mob'",
    "Kiwi birds are flightless and lay eggs that are 20% of their body weight",
    "A group of cassowaries is called a 'shock'"
  ];

  const colors = [
    'text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500',
    'text-purple-500', 'text-pink-500', 'text-orange-500', 'text-teal-500',
    'text-indigo-500', 'text-cyan-500'
  ];

  useEffect(() => {
    const milestone = milestones.find(m => m.count === count);
    if (milestone) {
      setMotivationalMessage(milestone.message);
    } else if (count > 0 && count % 25 === 0) {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setMotivationalMessage(randomMessage);
    }
  }, [count]);

  // Change fact every 3 seconds
  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFactIndex(prev => (prev + 1) % realFacts.length);
    }, 3000);

    return () => clearInterval(factInterval);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCount(prev => prev + 1);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newEffect = { id: Date.now(), x, y };
    setClickEffect(prev => [...prev, newEffect]);
    
    // Add random screen click effect
    const screenX = Math.random() * window.innerWidth;
    const screenY = Math.random() * window.innerHeight;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomRotation = Math.random() * 360 - 180; // -180 to 180 degrees
    
    const screenClick = {
      id: Date.now() + Math.random(),
      x: screenX,
      y: screenY,
      color: randomColor,
      rotation: randomRotation
    };
    
    setScreenClicks(prev => [...prev, screenClick]);
    
    setTimeout(() => {
      setClickEffect(prev => prev.filter(effect => effect.id !== newEffect.id));
      setScreenClicks(prev => prev.filter(click => click.id !== screenClick.id));
    }, 1000);
  };

  const getButtonColor = () => {
    if (count < 10) return 'bg-blue-500 hover:bg-blue-600';
    if (count < 50) return 'bg-green-500 hover:bg-green-600';
    if (count < 100) return 'bg-purple-500 hover:bg-purple-600';
    if (count < 250) return 'bg-pink-500 hover:bg-pink-600';
    if (count < 500) return 'bg-orange-500 hover:bg-orange-600';
    return 'bg-red-500 hover:bg-red-600 animate-pulse';
  };

  const getButtonSize = () => {
    const baseSize = Math.min(200 + count * 0.5, 400);
    return `${baseSize}px`;
  };

  const getCurrentFact = () => {
    return realFacts[currentFactIndex];
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      backgroundColor: '#f9f7ff',
      backgroundImage: `
        linear-gradient(rgba(139, 69, 19, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139, 69, 19, 0.1) 1px, transparent 1px)
      `,
      backgroundSize: '30px 30px'
    }}>
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23654321' fill-opacity='0.03'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z'/%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Doodles around the page based on clicks */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: Math.min(count, 15) }, (_, i) => {
          const doodles = ['★', '♦', '●', '▲', '♠', '♥', '♣', '◆', '▼', '◀', '▶', '♫', '☀', '☁', '⚡'];
          return (
            <div
              key={i}
              className="absolute animate-pulse text-2xl"
              style={{
                left: `${(i * 123 + count * 7) % 90 + 5}%`,
                top: `${(i * 97 + count * 11) % 80 + 10}%`,
                color: '#8b4513',
                opacity: 0.3,
                transform: `rotate(${(i * count) % 360}deg)`,
                animationDelay: `${i * 0.2}s`
              }}
            >
              {doodles[i % doodles.length]}
            </div>
          );
        })}
      </div>

      {/* Reset button in top right */}
      {count > 100 && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setCount(0)}
            className="bg-red-200 border-2 border-red-600 hover:bg-red-300 text-red-600 px-4 py-2 font-serif font-bold transition-all transform hover:scale-105 shadow-lg"
            style={{ 
              borderColor: '#dc2626',
              backgroundColor: '#fecaca',
              color: '#dc2626'
            }}
          >
            ERASE
          </button>
        </div>
      )}

      {/* Random "Pop!" text around screen */}
      {screenClicks.map((click) => (
        <div
          key={click.id}
          className="absolute pointer-events-none text-2xl font-bold animate-ping z-20 font-serif"
          style={{
            left: click.x,
            top: click.y,
            transform: `translate(-50%, -50%) rotate(${click.rotation}deg)`,
            color: '#8b4513'
          }}
        >
          Pop!
        </div>
      ))}

      <div className="flex flex-col items-center justify-center p-4 pt-24 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ 
            fontFamily: 'cursive',
            color: '#8b4513',
            textShadow: '2px 2px 0px #f9f7ff',
            transform: 'rotate(-2deg)'
          }}>
            Click Counter
          </h1>
          <p className="text-brown-600 mb-6 font-serif italic text-sm md:text-base" style={{ color: '#8b4513' }}>
            "Keep track of your clicking adventures!"
          </p>
          <div className="bg-white border-4 border-brown-600 p-4 md:p-6 mb-6 font-serif transform rotate-1 shadow-lg" style={{
            borderColor: '#8b4513',
            boxShadow: '4px 4px 0px rgba(139, 69, 19, 0.3)'
          }}>
            <div className="text-4xl md:text-6xl font-bold" style={{ color: '#8b4513' }}>
              {count.toLocaleString()}
            </div>
            <div className="text-xs md:text-sm mt-2" style={{ color: '#8b4513' }}>Total Clicks</div>
          </div>
          {motivationalMessage && (
            <div className="bg-yellow-100 border-2 border-brown-600 px-4 md:px-6 py-3 mb-6 font-serif transform -rotate-1 shadow-md" style={{
              borderColor: '#8b4513',
              color: '#8b4513'
            }}>
              <div className="italic text-sm md:text-base">
                {motivationalMessage}
              </div>
            </div>
          )}
        </div>

        <div className="relative mb-8">
          <button
            onClick={handleClick}
            className="bg-white border-4 text-brown-600 font-bold font-serif text-lg md:text-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 relative overflow-hidden shadow-lg hover:shadow-xl"
            style={{ 
              width: getButtonSize(), 
              height: getButtonSize(),
              borderColor: '#8b4513',
              backgroundColor: '#fffef7',
              boxShadow: '6px 6px 0px rgba(139, 69, 19, 0.3)',
              color: '#8b4513',
              borderRadius: '50%'
            }}
          >
            CLICK ME!
            
            {clickEffect.map((effect) => (
              <div
                key={effect.id}
                className="absolute pointer-events-none font-bold animate-ping text-xl font-serif"
                style={{
                  left: effect.x,
                  top: effect.y,
                  transform: 'translate(-50%, -50%)',
                  color: '#8b4513'
                }}
              >
                +1
              </div>
            ))}
          </button>
        </div>

        <div className="bg-white border-3 border-brown-600 p-4 md:p-6 max-w-2xl font-serif text-brown-600 text-xs md:text-sm transform rotate-1 shadow-lg" style={{
          borderColor: '#8b4513',
          color: '#8b4513',
          backgroundColor: '#fffef7'
        }}>
          <div className="text-center">
            <div className="mb-2 font-bold text-sm md:text-base">📝 Random Fact:</div>
            <p className="italic leading-relaxed">{getCurrentFact()}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}