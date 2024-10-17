import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistState {
  notificationEnabled: boolean;
  setNotificationEnabled: (value: boolean) => void;
  skinIds: string[];
  toggleSkin: (uuid: string) => void;
}
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      notificationEnabled: false,
      setNotificationEnabled: (value) => {
        set({ notificationEnabled: value });
      },
      skinIds: [],
      toggleSkin: (uuid: string) =>
        set({
          skinIds: get().skinIds.includes(uuid)
            ? get().skinIds.filter((el) => el !== uuid)
            : [...get().skinIds, uuid],
        }),
    }),
    {
      name: "wishlist",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
