import { create } from "zustand";

interface FeatureState {
  isDonator: boolean;
  enableDonator: () => void;
  disableDonator: () => void;
  screenshotModeEnabled: boolean;
  toggleScreenshotMode: () => void;
}

export const useFeatureStore = create<FeatureState>((set) => ({
  isDonator: false,
  enableDonator: () => set({ isDonator: true }),
  disableDonator: () => set({ isDonator: false }),
  screenshotModeEnabled: false,
  toggleScreenshotMode: () =>
    set((state) => ({ screenshotModeEnabled: !state.screenshotModeEnabled })),
}));
