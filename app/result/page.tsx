'use client';

import { usePlanStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ResultPage() {
  const plan = usePlanStore((state) => state.plan);
  const router = useRouter();

  useEffect(() => {
    if (!plan) router.push('/'); // If no plan exists, go back to home
  }, [plan, router]);

  if (!plan) return null;

  return (
    <main className="min-h-screen p-6 bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-semibold text-center mb-4">
        📝 Your Personalized Plan
      </h2>
      <pre className="whitespace-pre-wrap p-4 bg-gray-100 dark:bg-gray-800 text-sm rounded-md overflow-x-auto">
        {plan}
      </pre>
    </main>
  );
}
