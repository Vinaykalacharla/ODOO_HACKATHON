import { cn } from '../../lib/cn';

const variants = {
  card: 'h-44 w-full rounded-3xl',
  text: 'h-4 w-full rounded-full',
  avatar: 'h-12 w-12 rounded-full',
  pill: 'h-6 w-24 rounded-full',
  line: 'h-3 w-full rounded-full',
};

export default function Skeleton({ variant = 'card', className }) {
  return <div className={cn('animate-pulse bg-zinc-200/80', variants[variant] || variants.card, className)} />;
}
