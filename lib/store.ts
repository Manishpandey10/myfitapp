import { create } from 'zustand';

type PlanStore = {
  plan: string;
  setPlan: (plan: string) => void;
};

export const usePlanStore = create<PlanStore>((set) => ({
  plan: '',
  setPlan: (plan) => set({ plan }),
}));
