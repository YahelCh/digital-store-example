import { create } from 'zustand';

interface User {
  name: string;
  email: string;
}

interface UserState {
  user: User;
  setUser: (user: User) => void;
}

const STORE_KEY = '__shellRspack_userStore__';

if (!(window as any)[STORE_KEY]) {
  (window as any)[STORE_KEY] = create<UserState>((set) => ({
    user: { name: 'Alice', email: 'alice@example.com' },
    setUser: (user) => set({ user }),
  }));
}

export const useUserStore: ReturnType<typeof create<UserState>> = (window as any)[STORE_KEY];
