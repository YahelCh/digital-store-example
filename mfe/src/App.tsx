import { useUserStore } from 'shell/UserStore'

function App() {
  const user = useUserStore((state: any) => state.user)
  const setUser = useUserStore((state: any) => state.setUser)

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>MFE Consumer</h1>
      <section style={{ border: '1px solid #ccc', borderRadius: 12, padding: 16, maxWidth: 420 }}>
        <p>
          <strong>Consumed user name:</strong> {user.name}
        </p>
        <p>
          <strong>Consumed email:</strong> {user.email}
        </p>
        <button
          onClick={() => setUser({ ...user, name: user.name === 'Alice' ? 'Ori' : 'Alice' })}
          style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer' }}
        >
          Toggle User Name from MFE
        </button>
      </section>
    </main>
  )
}

export default App
