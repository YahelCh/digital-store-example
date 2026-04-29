import { useState } from 'react';
import { RemoteComponent, RemoteConfig } from './RemoteComponent';
import { getRemotes } from './utils/remotes';
import { useUserStore } from './store/userStore';

function MfeSection({ config }: { config: RemoteConfig }) {
  const [visible, setVisible] = useState(false);
  return (
    <section style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
      <h3>{config.label}</h3>
      {!visible && (
        <button onClick={() => setVisible(true)}>Load {config.label}</button>
      )}
      {visible && (
        <>
          <RemoteComponent
            config={config}
            fallback={<div>Loading {config.label}...</div>}
            errorFallback={<div>Failed to load {config.label}</div>}
          />
          <button onClick={() => setVisible(false)} style={{ marginTop: '0.5rem' }}>
            Hide {config.label}
          </button>
        </>
      )}
    </section>
  );
}

export default function App() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const remotes = getRemotes();

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Shell (Rspack)</h1>
      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f5f5f5' }}>
        <h2>User Store</h2>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <button onClick={() => setUser({ name: 'Bob', email: 'bob@example.com' })}>
          Switch to Bob
        </button>
        <button onClick={() => setUser({ name: 'Alice', email: 'alice@example.com' })} style={{ marginLeft: '0.5rem' }}>
          Switch to Alice
        </button>
      </div>
      {remotes.map((config) => (
        <MfeSection key={config.id} config={config} />
      ))}
    </div>
  );
}
