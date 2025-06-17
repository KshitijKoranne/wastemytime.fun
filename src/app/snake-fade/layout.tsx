import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Snake with a Twist - Fade Game | Waste My Time',
  description: 'Play the classic Snake game with a unique twist - the game gradually fades away as you play, making it increasingly challenging!',
  keywords: ['snake game', 'fading snake', 'challenge game', 'visibility game', 'classic games', 'browser games'],
};

export default function SnakeFadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}