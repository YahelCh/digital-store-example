import { RemoteConfig } from '../RemoteComponent';

export function getRemotes(): RemoteConfig[] {
  return [
    {
      id: 'mfe-rspack',
      url: 'http://localhost:5012/remoteEntry.js',
      scope: 'mfeRspack',
      module: './MfeApp',
      label: 'MFE (Rspack)',
    },
  ];
}
