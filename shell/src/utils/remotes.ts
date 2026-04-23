import { RemoteConfig } from '../RemoteComponent';

export async function fetchRemotesFromServer(): Promise<RemoteConfig[]> {
  return [
    {
      id: 'mfe',
      url: 'http://localhost:5002/remoteEntry.js',
      scope: 'mfe',
      module: './MfeApp',
      label: 'MFE App (Vite)',
      from: 'vite',
      format: 'esm',
    },
    {
      id: 'mfe-webpack',
      url: 'http://localhost:5003/remoteEntry.js',
      scope: 'mfeWebpack',
      module: './App',
      label: 'MFE Webpack',
      from: 'webpack',
      format: 'var',
    },
  ];
}

export function getRemoteConfig(remotes: RemoteConfig[], id: string): RemoteConfig | undefined {
  return remotes.find(r => r.id === id);
}
