import { create } from 'zustand';

interface AppState {
  selectedMUA: any | null;
  setSelectedMUA: (mua: any) => void;
  selectedService: any | null;
  setSelectedService: (service: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedMUA: null,
  setSelectedMUA: (mua) => set({ selectedMUA: mua }),
  selectedService: null,
  setSelectedService: (service) => set({ selectedService: service }),
}));
