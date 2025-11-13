'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UserForm from './UserForm';
import { usePlanStore } from '@/lib/store';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [readyToView, setReadyToView] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setPlan = usePlanStore((state) => state.setPlan);
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setReadyToView(false);
    setError(null);

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // parse json regardless of status
      const result = await res.json();

      if (!res.ok) {
        // server provided an error msg, handle explicitly
        const msg = result?.error || `Server returned ${res.status}`;
        setError(msg);
        setPlan(''); // clear any previous values
        setReadyToView(false);
        return;
      }

      // Only set plan if plan exists
      if (result?.plan) {
        setPlan(result.plan);
        setReadyToView(true);
        setError(null);
      } else {
        setError('No plan returned from server.');
        setPlan('');
        setReadyToView(false);
      }
    } catch (err: any) {
      console.error('Failed to generate plan:', err);
      setError(err?.message || 'Network error. Please try again.');
      setPlan('');
      setReadyToView(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-center mb-6">AI Fitness Assistant</h1>

      <UserForm onSubmit={handleSubmit} />

      {loading && (
        <p className="text-center mt-4 text-blue-600 animate-pulse">
          Generating your personalised plan...
        </p>
      )}

      {error && !loading && (
        <div className="max-w-xl mx-auto mt-6 text-center">
          <p className="text-red-500 mb-2">Error: {error}</p>
          <button
            onClick={() => {
              setError(null);
              // Optionally let user resubmit by focus or show retry
            }}
            className="px-4 py-2 border rounded"
          >
            OK
          </button>
        </div>
      )}

      {!loading && readyToView && (
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/result')}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            View Your Plan
          </button>
        </div>
      )}
    </main>
  );
}
