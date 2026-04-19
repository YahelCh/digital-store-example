import React, { useState, useEffect } from 'react'
import { useUserStore } from './store/userStore'
import { RemoteComponent } from './RemoteComponent'
import { fetchRemotesFromServer, getRemoteConfig } from './utils/remotes'
import { RemoteConfig } from './RemoteComponent'

function App() {
  const user = useUserStore((state: any) => state.user)
  const setUser = useUserStore((state: any) => state.setUser)
  const [remotes, setRemotes] = useState<RemoteConfig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRemotes = async () => {
      try {
        const fetchedRemotes = await fetchRemotesFromServer()
        setRemotes(fetchedRemotes)
      } catch (error) {
        console.error('Failed to fetch remotes:', error)
      } finally {
        setLoading(false)
      }
    }
    loadRemotes()
  }, [])

  const mfeConfig = getRemoteConfig(remotes, 'mfe')

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
        <h2>Dynamic Remote MFE from Server</h2>
        {loading && <div>Loading remotes configuration...</div>}
        {!loading && mfeConfig && (
          <RemoteComponent
            {...mfeConfig}
            fallback={<div>Loading MFE component...</div>}
            errorFallback={<div style={{ color: 'red' }}>Failed to load MFE</div>}
            componentProps={{}}
          />
        )}
        {!loading && !mfeConfig && <div style={{ color: 'orange' }}>MFE configuration not found</div>}
      </section>
    </main>
  )
}

export default App
