export interface UserProfile {
    id: string;
    name: string;
    email: string;
}
interface UserState {
    user: UserProfile;
    setUser: (user: UserProfile) => void;
}
export declare const useUserStore: import("zustand").UseBoundStore<import("zustand").StoreApi<UserState>>;
export {};
