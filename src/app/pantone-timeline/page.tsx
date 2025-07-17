'use client';

import { useState, useEffect, useRef } from 'react';

interface PantoneColor {
  year: number;
  name: string;
  pantoneCode: string;
  hex: string;
  rgb: string;
  description: string;
  culturalContext: string;
  funFact: string;
  theme: 'light' | 'dark';
}

const pantoneColors: PantoneColor[] = [
  {
    year: 2024,
    name: "Peach Fuzz",
    pantoneCode: "PANTONE 13-1023",
    hex: "#FFBE98",
    rgb: "255, 190, 152",
    description: "A velvety gentle peach tone that nurtures mind, body, and soul.",
    culturalContext: "Chosen during post-pandemic healing, representing kindness and human connection in digital spaces.",
    funFact: "First color chosen specifically to promote wellness and mental health awareness.",
    theme: "dark"
  },
  {
    year: 2023,
    name: "Viva Magenta",
    pantoneCode: "PANTONE 18-1750",
    hex: "#BE3455",
    rgb: "190, 52, 85",
    description: "A pulsating color whose exuberance promotes a joyous and optimistic celebration.",
    culturalContext: "Reflects the brave and fearless spirit needed to navigate uncertain times with creativity.",
    funFact: "Inspired by the red of cochineal, one of the most precious dyes in history.",
    theme: "light"
  },
  {
    year: 2022,
    name: "Very Peri",
    pantoneCode: "PANTONE 17-3938",
    hex: "#6667AB",
    rgb: "102, 103, 171",
    description: "A dynamic periwinkle blue hue with a vivifying violet red undertone.",
    culturalContext: "First color created by Pantone in 3 years, symbolizing the transformative times we're living through.",
    funFact: "Represents the fusion of modern life and how digital experiences are changing our reality.",
    theme: "light"
  },
  {
    year: 2021,
    name: "Ultimate Gray + Illuminating",
    pantoneCode: "PANTONE 17-5104 + 13-0647",
    hex: "#939597 + #F5DF4D",
    rgb: "147, 149, 151 + 245, 223, 77",
    description: "A combination of steadfast Ultimate Gray and vibrant Illuminating yellow.",
    culturalContext: "Dual colors representing resilience and optimism during the global pandemic.",
    funFact: "Only the second time in history two colors were chosen, reflecting the need for balance.",
    theme: "dark"
  },
  {
    year: 2020,
    name: "Classic Blue",
    pantoneCode: "PANTONE 19-4052",
    hex: "#0F4C75",
    rgb: "15, 76, 117",
    description: "A timeless and enduring blue hue that instills calm, confidence, and connection.",
    culturalContext: "Chosen to provide a sense of peace and tranquility at the threshold of a new era.",
    funFact: "Represents the desire for a dependable and stable foundation on which to build.",
    theme: "light"
  },
  {
    year: 2019,
    name: "Living Coral",
    pantoneCode: "PANTONE 16-1546",
    hex: "#FF6F61",
    rgb: "255, 111, 97",
    description: "An animating and life-affirming coral hue with a golden undertone.",
    culturalContext: "Reflects our innate need for optimism and joyful pursuits in uncertain times.",
    funFact: "Inspired by the need to protect coral reefs and raise environmental awareness.",
    theme: "dark"
  },
  {
    year: 2018,
    name: "Ultra Violet",
    pantoneCode: "PANTONE 18-3838",
    hex: "#5F4B8B",
    rgb: "95, 75, 139",
    description: "A dramatically provocative and thoughtful purple shade that communicates originality.",
    culturalContext: "Represents the intersection of innovation and artistic expression in the digital age.",
    funFact: "Associated with mindfulness practices and spiritual contemplation gaining popularity.",
    theme: "light"
  },
  {
    year: 2017,
    name: "Greenery",
    pantoneCode: "PANTONE 15-0343",
    hex: "#88B04B",
    rgb: "136, 176, 75",
    description: "A fresh and zesty yellow-green shade that evokes the first days of spring.",
    culturalContext: "Chosen during political upheaval to represent new beginnings and renewal.",
    funFact: "Reflects the growing trend toward plant-based lifestyles and environmental consciousness.",
    theme: "dark"
  },
  {
    year: 2016,
    name: "Rose Quartz + Serenity",
    pantoneCode: "PANTONE 13-1520 + 15-3919",
    hex: "#F7CAC9 + #92A8D1",
    rgb: "247, 202, 201 + 146, 168, 209",
    description: "A combination of warm Rose Quartz and cool Serenity blue.",
    culturalContext: "Dual colors reflecting gender fluidity and the breakdown of traditional color associations.",
    funFact: "First time two colors were chosen, representing balance and wellness trends.",
    theme: "dark"
  },
  {
    year: 2015,
    name: "Marsala",
    pantoneCode: "PANTONE 18-1438",
    hex: "#955251",
    rgb: "149, 82, 81",
    description: "A naturally robust and earthy wine red that enriches mind, body, and soul.",
    culturalContext: "Reflects the growing sophistication in food culture and artisanal experiences.",
    funFact: "Named after the Italian fortified wine, representing the farm-to-table movement.",
    theme: "light"
  },
  {
    year: 2014,
    name: "Radiant Orchid",
    pantoneCode: "PANTONE 18-3224",
    hex: "#B163A3",
    rgb: "177, 99, 163",
    description: "An enchanting harmony of fuchsia, purple, and pink undertones.",
    culturalContext: "Chosen during the rise of social media and digital self-expression.",
    funFact: "Represents the fusion of technology and nature in design and lifestyle.",
    theme: "light"
  },
  {
    year: 2013,
    name: "Emerald",
    pantoneCode: "PANTONE 17-5641",
    hex: "#009B77",
    rgb: "0, 155, 119",
    description: "A lively, radiant, and lush green that enhances our sense of well-being.",
    culturalContext: "Reflects the growing environmental consciousness and sustainability movement.",
    funFact: "Associated with growth, renewal, and the increasing popularity of 'green' technologies.",
    theme: "light"
  },
  {
    year: 2012,
    name: "Tangerine Tango",
    pantoneCode: "PANTONE 17-1463",
    hex: "#DD4124",
    rgb: "221, 65, 36",
    description: "A spirited reddish orange that provides the energy boost needed to recharge.",
    culturalContext: "Chosen during economic recovery to energize and inspire confidence.",
    funFact: "Represents the bold optimism needed to overcome challenges and embrace change.",
    theme: "light"
  },
  {
    year: 2011,
    name: "Honeysuckle",
    pantoneCode: "PANTONE 18-2120",
    hex: "#D94F70",
    rgb: "217, 79, 112",
    description: "A courageous pink that lifts the spirits and encourages confidence.",
    culturalContext: "Reflects the rise of social media and the need for authentic self-expression.",
    funFact: "Chosen to inspire courage and confidence during uncertain global times.",
    theme: "light"
  },
  {
    year: 2010,
    name: "Turquoise",
    pantoneCode: "PANTONE 15-5519",
    hex: "#45B8AC",
    rgb: "69, 184, 172",
    description: "An inviting and luminous blue-green that enhances clarity of thought.",
    culturalContext: "Represents the search for tranquility and spiritual grounding in a chaotic world.",
    funFact: "Associated with healing properties and the growing wellness movement.",
    theme: "dark"
  },
  {
    year: 2009,
    name: "Mimosa",
    pantoneCode: "PANTONE 14-0848",
    hex: "#F0C814",
    rgb: "240, 200, 20",
    description: "A warm and welcoming yellow that emanates hope and reassurance.",
    culturalContext: "Chosen during the global financial crisis to provide optimism and hope.",
    funFact: "Represents the human desire for happiness and spontaneity during difficult times.",
    theme: "dark"
  },
  {
    year: 2008,
    name: "Blue Iris",
    pantoneCode: "PANTONE 18-3943",
    hex: "#5A5B9F",
    rgb: "90, 91, 159",
    description: "A balanced blue-purple that combines the stable blue with the mystical purple.",
    culturalContext: "Reflects the need for spiritual grounding during economic uncertainty.",
    funFact: "Represents the search for higher meaning and contemplation in challenging times.",
    theme: "light"
  },
  {
    year: 2007,
    name: "Chili Pepper",
    pantoneCode: "PANTONE 19-1557",
    hex: "#9B1B30",
    rgb: "155, 27, 48",
    description: "A warm and spicy red that adds excitement and energy to any palette.",
    culturalContext: "Chosen during the rise of global cuisine and cultural exchange.",
    funFact: "Represents the growing appreciation for bold flavors and diverse cultural experiences.",
    theme: "light"
  },
  {
    year: 2006,
    name: "Sand Dollar",
    pantoneCode: "PANTONE 13-1106",
    hex: "#DECDBE",
    rgb: "222, 205, 190",
    description: "A soft and warm beige that evokes the calming qualities of the shore.",
    culturalContext: "Reflects the desire for simplicity and natural beauty in an increasingly digital world.",
    funFact: "Represents the growing trend toward mindfulness and connection with nature.",
    theme: "dark"
  },
  {
    year: 2005,
    name: "Blue Turquoise",
    pantoneCode: "PANTONE 15-5217",
    hex: "#53B0AE",
    rgb: "83, 176, 174",
    description: "A captivating blue-green that combines the serene qualities of blue with the refreshing aspects of green.",
    culturalContext: "Chosen during the early social media era to represent communication and connection.",
    funFact: "Associated with the growth of digital communication and global connectivity.",
    theme: "dark"
  },
  {
    year: 2004,
    name: "Tigerlily",
    pantoneCode: "PANTONE 17-1456",
    hex: "#E2583E",
    rgb: "226, 88, 62",
    description: "A warm and inviting orange that encourages sociability and friendliness.",
    culturalContext: "Reflects the optimism and energy of the early 2000s consumer culture.",
    funFact: "Represents the desire for warmth and human connection in an increasingly digital world.",
    theme: "light"
  },
  {
    year: 2003,
    name: "Aqua Sky",
    pantoneCode: "PANTONE 14-4318",
    hex: "#7BC4C4",
    rgb: "123, 196, 196",
    description: "A soft and ethereal blue-green that evokes feelings of peace and tranquility.",
    culturalContext: "Chosen during post-9/11 healing to provide calm and emotional restoration.",
    funFact: "Represents the need for peace and serenity during times of global uncertainty.",
    theme: "dark"
  },
  {
    year: 2002,
    name: "True Red",
    pantoneCode: "PANTONE 19-1664",
    hex: "#BF1932",
    rgb: "191, 25, 50",
    description: "A bold and confident red that commands attention and respect.",
    culturalContext: "Reflects the patriotic spirit and resilience following the events of 9/11.",
    funFact: "Represents strength, courage, and the American spirit during a time of national unity.",
    theme: "light"
  },
  {
    year: 2001,
    name: "Fuchsia Rose",
    pantoneCode: "PANTONE 17-2031",
    hex: "#C74375",
    rgb: "199, 67, 117",
    description: "A vibrant and empowering pink that exudes confidence and femininity.",
    culturalContext: "Chosen during the early internet boom to represent innovation and bold thinking.",
    funFact: "Represents the growing influence of technology on fashion and lifestyle choices.",
    theme: "light"
  },
  {
    year: 2000,
    name: "Cerulean",
    pantoneCode: "PANTONE 15-4020",
    hex: "#98B2D1",
    rgb: "152, 178, 209",
    description: "A calming blue that suggests the sky on a serene, crystal clear day.",
    culturalContext: "Chosen at the millennium to represent hope and new beginnings for the 21st century.",
    funFact: "The first official Pantone Color of the Year, marking the beginning of this annual tradition.",
    theme: "dark"
  }
];

export default function PantoneTimeline() {
  const [visibleYears, setVisibleYears] = useState<Set<number>>(new Set());
  const [currentYear, setCurrentYear] = useState<number>(2024);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const year = parseInt(entry.target.getAttribute('data-year') || '0');
          if (entry.isIntersecting) {
            setVisibleYears(prev => new Set([...prev, year]));
            setCurrentYear(year);
          }
        });
      },
      { threshold: 0.3 }
    );

    const yearElements = document.querySelectorAll('[data-year]');
    yearElements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const getContrastColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Pantone Color Journey
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 leading-relaxed">
              Dive into 25 years of color history • Discover the stories behind each year's defining hue
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
                <span className="text-lg font-semibold">Currently viewing: {currentYear}</span>
              </div>
              <div className="text-purple-200">
                <span className="text-sm">↓ Scroll to explore the timeline ↓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-400 to-pink-400 opacity-30 h-full"></div>
        
        {/* Color Timeline */}
        <div className="container mx-auto px-4 py-16">
          {pantoneColors.slice().reverse().map((color, index) => (
            <div
              key={color.year}
              data-year={color.year}
              className={`mb-16 md:mb-24 transition-all duration-1000 ${
                visibleYears.has(color.year) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              <div className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center gap-8 md:gap-16`}>
                
                {/* Year Badge */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-2xl">
                    {color.year}
                  </div>
                </div>

                {/* Color Card */}
                <div className="flex-1 max-w-2xl">
                  <div 
                    className="group relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl"
                    style={{
                      background: `linear-gradient(135deg, ${color.hex} 0%, ${color.hex}CC 100%)`,
                      border: `4px solid ${color.hex}`,
                    }}
                  >
                    {/* Color Display */}
                    <div 
                      className="h-48 md:h-64 relative overflow-hidden"
                      style={{ backgroundColor: color.hex }}
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-black/20"></div>
                      
                      {/* Color Info Overlay */}
                      <div className="absolute top-6 left-6 right-6">
                        <h2 
                          className="text-3xl md:text-4xl font-bold mb-2 transition-all duration-300 group-hover:scale-110"
                          style={{ color: getContrastColor(color.hex) }}
                        >
                          {color.name}
                        </h2>
                        <div 
                          className="text-lg opacity-90"
                          style={{ color: getContrastColor(color.hex) }}
                        >
                          <p className="font-mono">{color.pantoneCode}</p>
                          <p className="text-sm mt-1">{color.hex} • RGB({color.rgb})</p>
                        </div>
                      </div>

                      {/* Floating Color Swatches */}
                      <div className="absolute bottom-6 right-6 flex gap-2">
                        <div 
                          className="w-12 h-12 rounded-full shadow-lg border-2 border-white/50"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <div 
                          className="w-8 h-8 rounded-full shadow-lg border-2 border-white/50 mt-2"
                          style={{ backgroundColor: `${color.hex}80` }}
                        ></div>
                      </div>
                    </div>

                    {/* Content Panel */}
                    <div 
                      className={`p-6 md:p-8 ${
                        color.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                      }`}
                    >
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color.hex }}></span>
                            Description
                          </h3>
                          <p className="text-sm leading-relaxed opacity-90">
                            {color.description}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color.hex }}></span>
                            Cultural Context
                          </h3>
                          <p className="text-sm leading-relaxed opacity-90">
                            {color.culturalContext}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color.hex }}></span>
                            Fun Fact
                          </h3>
                          <p className="text-sm leading-relaxed opacity-90">
                            {color.funFact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">25 Years of Color Innovation</h3>
          <p className="text-purple-200 max-w-2xl mx-auto">
            Each Pantone Color of the Year reflects the zeitgeist of its time, capturing the mood, 
            aspirations, and cultural movements that defined each era.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              2000-2024 • 25 Colors
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              Cultural History
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              Color Psychology
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}