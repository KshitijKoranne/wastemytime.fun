'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'mom';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

interface MomMood {
  type: 'disappointed' | 'proud' | 'worried' | 'roast' | 'nostalgic';
  intensity: number;
}

export default function IndianMomGPT() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [momMood, setMomMood] = useState<MomMood>({ type: 'roast', intensity: 7 });
  const [isLoading, setIsLoading] = useState(false);
  const [lastActiveTime, setLastActiveTime] = useState(new Date());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with a welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      text: "Beta! Finally you remembered your poor mummy! 😤 How are you? Have you eaten anything proper today or just that junk food again?",
      sender: 'mom',
      timestamp: new Date(),
      status: 'delivered'
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Track user activity for realistic mom responses
  useEffect(() => {
    const interval = setInterval(() => {
      setLastActiveTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const generateMomResponse = async (userMessage: string): Promise<string> => {
    // Get user's actual local time
    const currentTime = new Date();
    const hourOfDay = currentTime.getHours();
    
    // More specific time categorization
    let timeOfDay: 'late night' | 'early morning' | 'morning' | 'afternoon' | 'evening' | 'night';
    let timeDescription: string;
    
    if (hourOfDay >= 0 && hourOfDay < 5) {
      timeOfDay = 'late night';
      timeDescription = `very late night (${hourOfDay}:${currentTime.getMinutes().toString().padStart(2, '0')})`;
    } else if (hourOfDay >= 5 && hourOfDay < 8) {
      timeOfDay = 'early morning';
      timeDescription = `early morning (${hourOfDay}:${currentTime.getMinutes().toString().padStart(2, '0')})`;
    } else if (hourOfDay >= 8 && hourOfDay < 12) {
      timeOfDay = 'morning';
      timeDescription = `morning (${hourOfDay}:${currentTime.getMinutes().toString().padStart(2, '0')})`;
    } else if (hourOfDay >= 12 && hourOfDay < 17) {
      timeOfDay = 'afternoon';
      timeDescription = `afternoon (${hourOfDay}:${currentTime.getMinutes().toString().padStart(2, '0')})`;
    } else if (hourOfDay >= 17 && hourOfDay < 21) {
      timeOfDay = 'evening';
      timeDescription = `evening (${hourOfDay}:${currentTime.getMinutes().toString().padStart(2, '0')})`;
    } else {
      timeOfDay = 'night';
      timeDescription = `night (${hourOfDay}:${currentTime.getMinutes().toString().padStart(2, '0')})`;
    }
    
    // Context for the AI
    const context = {
      userMessage,
      mood: momMood.type,
      timeOfDay,
      timeDescription,
      previousMessages: messages.slice(-3).map(m => ({ sender: m.sender, text: m.text }))
    };

    try {
      console.log('Sending request to API:', context);
      
      const response = await fetch('/api/indian-mom-gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(context),
      });

      console.log('API Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('API Response data:', data);
        return data.response;
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Error generating mom response:', error);
      // Fallback responses in authentic Indian mom style
      const fallbackResponses = [
        "Beta, network problem hai! But anyway, khana khaya? Proper meal or just chips? 😤",
        "Arrey wait beta, phone hang ho gaya! Technology ka bharosa nahi... Anyway, how is work going? 🤨",
        "Beta something went wrong! But listen, Sharma aunty's daughter got engaged... when is your turn? 😢",
        "Technical issue beta! In my time letters came faster than this internet! Call me na! 📞",
        "Haaye, system failure! But more importantly - have you been eating home food or outside junk? 💔",
        "Beta connection problem! But remember to drink warm water and take vitamins! ❤️"
      ];
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const momResponseText = await generateMomResponse(userMessage.text);
      
      const momResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: momResponseText,
        sender: 'mom',
        timestamp: new Date(),
        status: 'delivered'
      };

      setMessages(prev => [...prev, momResponse]);
      setIsTyping(false);
      setIsLoading(false);

      // Update mom's mood based on conversation
      updateMomMood(userMessage.text);
    }, Math.random() * 2000 + 1000); // 1-3 seconds typing delay
  };

  const updateMomMood = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('sorry') || lowerMessage.includes('sorry mom')) {
      setMomMood({ type: 'proud', intensity: 6 });
    } else if (lowerMessage.includes('job') || lowerMessage.includes('work') || lowerMessage.includes('salary')) {
      setMomMood({ type: 'roast', intensity: 8 });
    } else if (lowerMessage.includes('sick') || lowerMessage.includes('not feeling well')) {
      setMomMood({ type: 'worried', intensity: 9 });
    } else if (lowerMessage.includes('marriage') || lowerMessage.includes('boyfriend') || lowerMessage.includes('girlfriend')) {
      setMomMood({ type: 'disappointed', intensity: 7 });
    } else {
      // Random mood shift
      const moods: MomMood['type'][] = ['disappointed', 'proud', 'worried', 'roast', 'nostalgic'];
      setMomMood({ 
        type: moods[Math.floor(Math.random() * moods.length)], 
        intensity: Math.floor(Math.random() * 10) + 1 
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMoodEmoji = () => {
    switch (momMood.type) {
      case 'disappointed': return '😤';
      case 'proud': return '😌';
      case 'worried': return '😰';
      case 'roast': return '🔥';
      case 'nostalgic': return '🥺';
      default: return '😊';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div 
      className="h-screen overflow-hidden flex items-center justify-center p-2 sm:p-4 relative"
      style={{
        background: `
          linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #fbcfe8 50%, #f9a8d4 75%, #ec4899 100%),
          radial-gradient(circle at 20% 80%, #fed7e2 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, #fce7f3 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, #f3e8ff 0%, transparent 50%)
        `
      }}
    >
      {/* Samsung Galaxy S24 Phone Mockup */}
      <div className="relative">
        {/* Phone Frame - Accurate Samsung Galaxy S24 Design */}
        <div className="relative w-[320px] h-[640px] sm:w-[340px] sm:h-[680px]">
          {/* Phone Body */}
          <div 
            className="w-full h-full bg-gradient-to-b from-gray-900 via-black to-gray-900 rounded-[50px] relative"
            style={{
              boxShadow: `
                0 0 0 2px #1a1a1a,
                0 0 0 3px #333,
                0 20px 40px rgba(0,0,0,0.4),
                inset 0 2px 4px rgba(255,255,255,0.1)
              `
            }}
          >
            {/* Power Button */}
            <div className="absolute right-[-2px] top-[120px] w-1 h-16 bg-gray-700 rounded-l-sm"></div>
            
            {/* Volume Buttons */}
            <div className="absolute left-[-2px] top-[100px] w-1 h-12 bg-gray-700 rounded-r-sm"></div>
            <div className="absolute left-[-2px] top-[130px] w-1 h-12 bg-gray-700 rounded-r-sm"></div>
            
            {/* Screen Area */}
            <div className="absolute top-[12px] left-[12px] w-[296px] h-[616px] sm:w-[316px] sm:h-[656px] bg-black rounded-[45px] overflow-hidden">
              {/* Screen with subtle bezel */}
              <div className="w-full h-full bg-black rounded-[45px] p-[3px]">
                <div className="w-full h-full bg-white rounded-[42px] overflow-hidden relative">
                  {/* Camera Hole Punch */}
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-black rounded-full z-50"></div>
                  
                  {/* Chat Interface */}
                  <div className="w-full h-full flex flex-col bg-gray-100 pt-6">
                    {/* WhatsApp-style header */}
                    <div 
                      className="flex items-center p-2 sm:p-3 text-white shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #ff9a56, #ffad56, #fb8c00)',
                        borderBottom: '2px solid #dc2626'
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-white overflow-hidden mr-2 border border-white flex items-center justify-center">
                        <img 
                          src="/images/indian-mom-avatar.png" 
                          alt="Indian Mom" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling!.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-orange-200 to-red-300 rounded-full hidden items-center justify-center text-lg">
                          👩‍👧‍👦
                        </div>
                      </div>
                      <div className="flex-1">
                        <h1 className="font-bold text-sm">Mummy ❤️</h1>
                        <p className="text-xs opacity-90">
                          {isTyping ? 'typing...' : `last seen today at ${formatTime(new Date())}`}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <span className="text-sm">{getMoodEmoji()}</span>
                        <div className="text-xs">
                          <div>📞</div>
                        </div>
                      </div>
                    </div>

                    {/* Chat messages */}
                    <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3 bg-gradient-to-b from-orange-50 to-red-50">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[180px] sm:max-w-[200px] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-sm text-xs sm:text-sm ${
                              message.sender === 'user'
                                ? 'bg-green-500 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                            }`}
                          >
                            <p className="text-xs leading-relaxed">{message.text}</p>
                            <div className="flex items-center justify-end mt-0.5 sm:mt-1 space-x-1">
                              <span className="text-xs opacity-70">
                                {formatTime(message.timestamp)}
                              </span>
                              {message.sender === 'user' && (
                                <div className="flex">
                                  <span className="text-xs">✓✓</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Typing indicator */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white text-gray-800 rounded-lg rounded-bl-none px-3 py-2 border border-gray-200 shadow-sm">
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <div className="p-2 sm:p-3 bg-white border-t border-gray-300">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 relative">
                          <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            className="w-full p-2 pr-8 sm:pr-10 border border-gray-300 rounded-full focus:outline-none focus:border-orange-500 text-gray-800 bg-white text-sm"
                            disabled={isLoading}
                          />
                          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            😊
                          </button>
                        </div>
                        <button
                          onClick={sendMessage}
                          disabled={!inputText.trim() || isLoading}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 rounded-full flex items-center justify-center text-white transition-colors"
                        >
                          {isLoading ? (
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}