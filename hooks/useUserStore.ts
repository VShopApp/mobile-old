import { create } from "zustand";
import { defaultUser } from "~/utils/valorant-api";

interface UserState {
  user: typeof defaultUser;
  setUser: (user: typeof defaultUser) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: defaultUser,
  setUser: (user) => set({ user }),
}));
