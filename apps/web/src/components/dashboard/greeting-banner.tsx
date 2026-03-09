'use client';

import { useSession } from 'next-auth/react';

export function GreetingBanner() {
  const { data: session } = useSession();
  const name = session?.user?.name?.split(' ')[0] || 'there';

  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-teal-600 to-blue-700 p-6 text-white">
      <div className="relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold">
          {greeting}, {name}!
        </h1>
        <p className="mt-1 text-teal-100">{today}</p>
        <p className="mt-2 text-sm text-teal-100/80">
          Welcome to your HRMS dashboard. Here&apos;s what&apos;s happening today.
        </p>
      </div>
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 -right-20 h-32 w-32 rounded-full bg-white/5" />
    </div>
  );
}
