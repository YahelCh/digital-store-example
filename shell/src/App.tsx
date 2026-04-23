import { useState, useEffect } from 'react'
import { useUserStore } from './store/userStore'
import { RemoteComponent } from './RemoteComponent'
import { fetchRemotesFromServer, getRemoteConfig } from './utils/remotes'
import { RemoteConfig } from './RemoteComponent'

function MfeSection({
  config,
  label,
  componentProps,
}: {
  config: RemoteConfig
  label: string
  componentProps?: Record<string, any>
}) {
  const [visible, setVisible] = useState(false)

  return (
    <section style={{ marginTop: 32, padding: 16, border: '1px solid #d1d5db', borderRadius: 12 }}>
      <h2>{label}</h2>
      {!visible && (
        <button
          onClick={() => setVisible(true)}
          style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#3b82f6', color: '#fff' }}
        >
          Load MFE
        </button>
      )}
      {visible && (
        <>
          <RemoteComponent
            {...config}
            fallback={<div>Loading MFE component...</div>}
            errorFallback={<div style={{ color: 'red' }}>Failed to load MFE</div>}
            componentProps={componentProps ?? {}}
          />
          <button
            onClick={() => setVisible(false)}
            style={{ marginTop: 12, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#e5e7eb', color: '#111' }}
          >
            Hide MFE
          </button>
        </>
      )}
    </section>
  )
}

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
  const mfeWebpackConfig = getRemoteConfig(remotes, 'mfe-webpack')

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

      {loading && <div style={{ marginTop: 32 }}>Loading remotes configuration...</div>}

      {!loading && mfeConfig && (
        <MfeSection config={mfeConfig} label="Vite MFE" componentProps={{ user, setUser }} />
      )}

      {!loading && mfeWebpackConfig && (
        <MfeSection config={mfeWebpackConfig} label="Webpack MFE" />
      )}
    </main>
  )
}

export default App
