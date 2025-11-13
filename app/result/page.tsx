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

export default function ResultPage() {
  const plan = usePlanStore((state) => state.plan);
  const router = useRouter();

  useEffect(() => {
    if (!plan) router.push('/');
  }, [plan, router]);

  if (!plan) return null;

  // === BEAUTIFIER ===
  const sections = useMemo(() => {
    const defaultTitles = [
      "Summary",
      "Workout Plan",
      "Diet Plan",
      "Tips",
      "Motivation",
    ];

    const result: { title: string; content: string }[] = [];

    let currentTitle = "Plan";
    let currentContent = "";

    const lines = plan.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();

      // detect title lines
      if (defaultTitles.some((t) => trimmed.toLowerCase().startsWith(t.toLowerCase()))) {
        // push previous block
        if (currentContent.trim()) {
          result.push({ title: currentTitle, content: currentContent.trim() });
        }
        currentTitle = trimmed.replace(":", "");
        currentContent = "";
      } else {
        currentContent += line + "\n";
      }
    }

    // last block
    if (currentContent.trim()) {
      result.push({ title: currentTitle, content: currentContent.trim() });
    }

    return result;
  }, [plan]);

  // Converts list text to <ul><li>
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");

    return (
      <div className="space-y-2 leading-relaxed text-gray-800 dark:text-gray-300">
        {lines.map((line, i) => {
          const trimmed = line.trim();

          // Bullet points
          if (
            trimmed.startsWith("- ") ||
            trimmed.startsWith("* ") ||
            trimmed.match(/^\d+\.\s/)
          ) {
            return (
              <li key={i} className="ml-5 list-disc">
                {trimmed.replace(/^- |^\* |\d+\. /, "")}
              </li>
            );
          }

          return <p key={i}>{trimmed}</p>;
        })}
      </div>
    );
  };

  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-8">
        Your Personalized Plan
      </h2>

      <div className="space-y-6 max-w-3xl mx-auto">
        {sections.map((sec, idx) => (
          <Card
            key={idx}
            className="shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                {sec.title}
              </CardTitle>
            </CardHeader>
            <CardContent>{renderFormattedText(sec.content)}</CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
