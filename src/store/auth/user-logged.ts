import { UserLoggedResponse } from "@/models/responses/user-logged-response";
import { create } from "zustand";

interface UserLoggedStoreStoreProps {
  user: UserLoggedResponse | null;
  loadingUserLoggedData: boolean;

  setUser: (user: UserLoggedResponse | null) => void;
  setLoadingUserLoggedData: (status: boolean) => void;
  reset: () => void;
}

const initialState = {
  loadingUserLoggedData: false,
  user: null,
};

export const useUserLoggedStore = create<UserLoggedStoreStoreProps>((set) => ({
  ...initialState,

  setUser: (user: UserLoggedResponse | null) =>
    set(() => ({
      user: user,
    })),

  setLoadingUserLoggedData: (status: boolean) =>
    set(() => ({
      loadingUserLoggedData: status,
    })),

  reset: () => set(initialState),
}));
