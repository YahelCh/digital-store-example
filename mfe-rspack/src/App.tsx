import { useUserStore } from 'shellRspack/UserStore';

export default function App() {
  const user = useUserStore((state: any) => state.user);
  const setUser = useUserStore((state: any) => state.setUser);

  return (
    <div style={{ padding: '1rem', background: '#e8f4e8', borderRadius: '4px' }}>
      <h2>MFE (Rspack)</h2>
      <p>User from shared store: <strong>{user.name}</strong> ({user.email})</p>
      <button onClick={() => setUser({ name: 'MFE User', email: 'mfe@example.com' })}>
        Set MFE User
      </button>
    </div>
  );
}
