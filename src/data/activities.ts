export interface Activity {
  id: string;
  title: string;
  description: string;
  emoji: string;
  path: string;
  color: string;
  image?: string;
}

export const activities: Activity[] = [
  {
    id: 'earths-heartbeat',
    title: "Earth's Heartbeat",
    description: 'Feel the pulse of our living planet in real-time',
    emoji: '🌍',
    path: '/earths-heartbeat',
    color: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
    image: '/images/earths_heartbeat.png'
  },
  {
    id: 'life-calendar',
    title: 'Life in Weeks',
    description: 'Visualize your entire life as 4,000 weeks',
    emoji: '📅',
    path: '/life-calendar',
    color: 'bg-slate-100 hover:bg-slate-200 border-slate-300',
    image: '/images/life in weeks.png'
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
  },
  {
    id: 'snake-fade',
    title: 'Snake with a Twist',
    description: 'Classic Snake game that gradually fades away as you play',
    emoji: '🐍',
    path: '/snake-fade',
    color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300'
  },
];