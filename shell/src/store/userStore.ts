import { create } from 'zustand'

export interface UserProfile {
  id: string
  name: string
  email: string
}

interface UserState {
  user: UserProfile
  setUser: (user: UserProfile) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    id: '1',
    name: 'Alice',
    email: 'alice@example.com'
  },
  setUser: (user) => set({ user })
}))
