import { RemoteConfig } from '../RemoteComponent';

export async function fetchRemotesFromServer(): Promise<RemoteConfig[]> {
  // זה מחקי מהשרת - במציאות זה יבוא מ־API אמיתי
  return [
    {
      id: 'mfe',
      url: 'http://localhost:4177/assets/remoteEntry.js',
      scope: 'mfe',
      module: './MfeApp',
      label: 'MFE App',
      from: 'vite',
      format: 'esm'
    }
  ];
}

export function getRemoteConfig(remotes: RemoteConfig[], id: string): RemoteConfig | undefined {
  return remotes.find(r => r.id === id);
}
