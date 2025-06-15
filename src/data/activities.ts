export interface Activity {
  id: string;
  title: string;
  description: string;
  emoji: string;
  path: string;
  color: string;
}

export const activities: Activity[] = [
  {
    id: 'click-me',
    title: 'Click Me Forever',
    description: 'A pointless counter that increases every time you click',
    emoji: '👆',
    path: '/click-me',
    color: 'bg-pink-100 hover:bg-pink-200 border-pink-300'
  },
  {
    id: 'bubble-wrap',
    title: 'Virtual Bubble Wrap',
    description: 'Infinite bubble wrap popping satisfaction',
    emoji: '🫧',
    path: '/bubble-wrap',
    color: 'bg-green-100 hover:bg-green-200 border-green-300'
  },
  {
    id: 'progress-bar',
    title: 'Broken Progress Bar',
    description: 'A progress bar that forgot how to progress properly',
    emoji: '🚧',
    path: '/progress-bar',
    color: 'bg-blue-100 hover:bg-blue-200 border-blue-300'
  },
  {
    id: 'achievements',
    title: 'Pointless Achievements',
    description: 'Feel validated for doing nothing important',
    emoji: '🏆',
    path: '/achievements',
    color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300'
  },
  {
    id: 'indian-experiences',
    title: '100 Indian Experiences',
    description: 'Hilarious moments every Indian has lived through',
    emoji: '🇮🇳',
    path: '/indian-experiences',
    color: 'bg-orange-100 hover:bg-orange-200 border-orange-300'
  },
  {
    id: 'indian-mom-gpt',
    title: 'Indian Mom GPT',
    description: 'Coming Soon - AI-powered dramatic Indian mom conversations',
    emoji: '👩‍👦',
    path: '/indian-mom-gpt',
    color: 'bg-gray-100 hover:bg-gray-200 border-gray-300'
  },
  {
    id: 'year-progress',
    title: 'Year Progress Tracker',
    description: 'Watch the current year slip away, second by second',
    emoji: '📅',
    path: '/year-progress',
    color: 'bg-purple-100 hover:bg-purple-200 border-purple-300'
  },
  {
    id: 'scroll-speed',
    title: 'Scroll Speed Challenge',
    description: 'Test how fast you can scroll and break speed records',
    emoji: '🏃‍♂️',
    path: '/scroll-speed',
    color: 'bg-teal-100 hover:bg-teal-200 border-teal-300'
  }
];