// lib/store.ts
import { create } from 'zustand';

export type Exercise = { name: string; sets?: string; notes?: string };
export type WorkoutDay = { day?: string; exercises?: Exercise[]; notes?: string };
export type Meal = { name?: string; items?: string[]; calories?: number };
export type DietDay = { day?: string; meals?: Meal[]; notes?: string };

export type PlanObject = {
  summary?: string;
  workoutPlan?: WorkoutDay[];
  dietPlan?: DietDay[];
  tips?: string[];
  motivation?: string;
  [k: string]: any;
};

// plan can be either structured PlanObject (preferred) or raw string (fallback)
type PlanStore = {
  plan: PlanObject | string | null;
  setPlan: (plan: PlanObject | string | null) => void;
  clearPlan: () => void;
};

export const usePlanStore = create<PlanStore>((set) => ({
  plan: null,
  setPlan: (plan) => set({ plan }),
  clearPlan: () => set({ plan: null }),
}));