declare module 'shellRspack/UserStore' {
  import { StoreApi, UseBoundStore } from 'zustand';

  interface User {
    name: string;
    email: string;
  }

  interface UserState {
    user: User;
    setUser: (user: User) => void;
  }

  export const useUserStore: UseBoundStore<StoreApi<UserState>>;
}
