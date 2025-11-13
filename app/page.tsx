'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UserForm from './UserForm';
import { usePlanStore } from '@/lib/store';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [readyToView, setReadyToView] = useState(false);
  const setPlan = usePlanStore((state) => state.setPlan);
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setReadyToView(false);

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      setPlan(result.plan || '');
      setReadyToView(true);
    } catch (err) {
      console.error('Failed to generate plan:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-center mb-6">
        AI Fitness Assistant
      </h1>

      <UserForm onSubmit={handleSubmit} />

      {loading && (
        <p className="text-center mt-4 text-blue-600 animate-pulse">
          🧠 Generating your plan...
        </p>
      )}

      {!loading && readyToView && (
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/result')}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            ✅ View Your Plan
          </button>
        </div>
      )}
    </main>
  );
}
