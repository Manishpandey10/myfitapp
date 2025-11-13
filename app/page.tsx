"use client";

import { useState } from "react";
import UserForm from "./UserForm";
import PlanDisplay from "./PlanDispay";

export default function HomePage() {
  const [plan, setPlan] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    const res = await fetch("/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const result = await res.json();

    console.log("Gemini Response:", result); // 

    setPlan(result.plan || "");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        AI Fitness Assistant
      </h1>
      <UserForm onSubmit={handleSubmit} />
      {loading && <p className="text-center mt-4">Generating your plan...</p>}
      {plan && <PlanDisplay plan={plan} />}
    </main>
  );
}
