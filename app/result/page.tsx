'use client';

import { usePlanStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";

type Exercise = { name: string; sets?: string; notes?: string };
type WorkoutDay = { day?: string; exercises?: Exercise[]; notes?: string };
type Meal = { name?: string; items?: string[]; calories?: number };
type DietDay = { day?: string; meals?: Meal[]; notes?: string };

type PlanObject = {
  summary?: string;
  workoutPlan?: WorkoutDay[];
  dietPlan?: DietDay[];
  tips?: string[];
  motivation?: string;
  [k: string]: any;
};

export default function ResultPage() {
  const planState = usePlanStore((s: any) => s.plan);
  const router = useRouter();

  // Try to get structured object from store (if already parsed), otherwise try parse JSON string
  const planObj = useMemo<PlanObject | null>(() => {
    if (!planState) return null;
    if (typeof planState === 'object') return planState as PlanObject;
    try {
      return JSON.parse(String(planState)) as PlanObject;
    } catch {
      return null;
    }
  }, [planState]);

  // If nothing at all, go back
  useEffect(() => {
    if (!planState) router.push('/');
  }, [planState, router]);

  if (!planState) return null;

  // Helper: If parsing failed (planObj === null) we fall back to the old section-splitting display
  if (!planObj) {
    // fallback: split by headings as before
    const text = String(planState);
    const defaultTitles = ["Summary", "Workout Plan", "Diet Plan", "Tips", "Motivation"];
    const result: { title: string; content: string }[] = [];
    let currentTitle = "Plan";
    let currentContent = "";
    const lines = text.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (defaultTitles.some((t) => trimmed.toLowerCase().startsWith(t.toLowerCase()))) {
        if (currentContent.trim()) result.push({ title: currentTitle, content: currentContent.trim() });
        currentTitle = trimmed.replace(/:$/, '');
        currentContent = "";
      } else {
        currentContent += line + "\n";
      }
    }
    if (currentContent.trim()) result.push({ title: currentTitle, content: currentContent.trim() });

    const renderFormattedText = (text: string) => {
      const lines = text.split(/\r?\n/);
      return (
        <div className="space-y-2 leading-relaxed text-gray-800 dark:text-gray-300">
          {lines.map((line, i) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
              return <li key={i} className="ml-5 list-disc">{trimmed.replace(/^- |^\* |\d+\. /, '')}</li>;
            }
            return <p key={i}>{trimmed}</p>;
          })}
        </div>
      );
    };

    return (
      <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-8">Your Personalized Plan</h2>
        <div className="space-y-6 max-w-3xl mx-auto">
          {result.map((sec, idx) => (
            <Card key={idx} className="shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-600 dark:text-blue-400">{sec.title}</CardTitle>
              </CardHeader>
              <CardContent>{renderFormattedText(sec.content)}</CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  // --- Structured rendering when we have a PlanObject ---
  const { summary = '', workoutPlan = [], dietPlan = [], tips = [], motivation = '' } = planObj;

  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Your Personalized Plan</h2>

        {/* Summary Card */}
        <Card className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-600">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 dark:text-gray-300">{summary || 'No summary available.'}</p>
          </CardContent>
        </Card>

        {/* Workout Plan Cards */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">Workout Plan</h3>
          <div className="grid gap-4">
            {workoutPlan.length === 0 && <p className="text-sm text-gray-600">No workout plan provided.</p>}
            {workoutPlan.map((day, idx) => (
              <Card key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">{day.day || `Day ${idx + 1}`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="ml-4 list-disc space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {(day.exercises || []).map((ex, i) => (
                      <li key={i}>
                        <div className="font-medium">{ex.name}{ex.sets ? <span className="text-xs text-gray-500"> — {ex.sets}</span> : null}</div>
                        {ex.notes ? <div className="text-xs text-gray-500">{ex.notes}</div> : null}
                      </li>
                    ))}
                  </ul>
                  {day.notes ? <p className="mt-2 text-xs text-gray-500">{day.notes}</p> : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Diet Plan Cards */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">Diet Plan</h3>
          <div className="grid gap-4">
            {dietPlan.length === 0 && <p className="text-sm text-gray-600">No diet plan provided.</p>}
            {dietPlan.map((d, idx) => (
              <Card key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">{d.day || `Day ${idx + 1}`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(d.meals || []).map((meal, m) => (
                      <div key={m} className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
                        <div className="flex justify-between">
                          <div className="text-sm font-medium">{meal.name || 'Meal'}</div>
                          {typeof meal.calories === 'number' ? <div className="text-xs text-gray-500">{meal.calories} kcal</div> : null}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{(meal.items || []).join(', ')}</div>
                      </div>
                    ))}
                  </div>
                  {d.notes ? <p className="mt-2 text-xs text-gray-500">{d.notes}</p> : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">Tips</h3>
          {(!tips || tips.length === 0) ? (
            <p className="text-sm text-gray-600">No tips provided.</p>
          ) : (
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent>
                <ul className="ml-4 list-disc text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  {tips.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Motivation */}
        <Card className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-600">Motivation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 dark:text-gray-300">{motivation || 'Keep going — you got this!'}</p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between gap-4">
          <button className="px-4 py-2 rounded-md border" onClick={() => router.push('/')}>Back</button>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-md bg-indigo-600 text-white"
              onClick={() => {
                try {
                  navigator.clipboard?.writeText(JSON.stringify(planObj, null, 2));
                  alert('Plan JSON copied to clipboard');
                } catch {
                  alert('Copy failed');
                }
              }}
            >
              Copy JSON
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}