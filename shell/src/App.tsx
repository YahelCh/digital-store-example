import React, { Suspense } from 'react'
import { useUserStore } from './store/userStore'

const MfeApp = React.lazy(() => import('mfe/MfeApp'))

function App() {
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>Shell App</h1>
      <section style={{ border: '1px solid #ccc', borderRadius: 12, padding: 16, maxWidth: 420 }}>
        <p>
          <strong>User name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <button
          onClick={() => setUser({ ...user, name: user.name === 'Alice' ? 'Ori' : 'Alice' })}
          style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer' }}
        >
          Toggle User Name
        </button>
      </section>

      <section style={{ marginTop: 32, padding: 16, border: '1px solid #d1d5db', borderRadius: 12 }}>
        <h2>Remote MFE rendered in shell</h2>
        <Suspense fallback={<div>Loading remote MFE...</div>}>
          <MfeApp />
        </Suspense>
      </section>
    </main>
  )
}

export default App
