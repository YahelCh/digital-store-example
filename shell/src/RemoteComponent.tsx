import React, { ReactNode, useState, useCallback, useEffect } from 'react';

declare const __webpack_init_sharing__: (scope: string) => Promise<void>;
declare const __webpack_share_scopes__: { [scope: string]: any };

export interface RemoteConfig {
  id: string;
  url: string;
  scope: string;
  module: string;
  label: string;
}

const containerCache = new Map<string, any>();
const loadedScripts = new Set<string>();

function DefaultSkeleton() {
  return (
    <div style={{
      height: 120,
      background: '#f0f0f0',
      borderRadius: 8,
      animation: 'pulse 1.5s infinite',
    }} />
  );
}

export async function loadFederatedComponent(config: RemoteConfig): Promise<React.ComponentType<any>> {
  const { url, scope, module } = config;

  if (!loadedScripts.has(url)) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load remote script: ${url}`));
      document.head.appendChild(script);
    });
    loadedScripts.add(url);
  }

  if (!containerCache.has(scope)) {
    const container = (window as any)[scope];
    if (!container) throw new Error(`Webpack container "${scope}" not found on window`);

    await __webpack_init_sharing__('default');
    await container.init(__webpack_share_scopes__.default);
    containerCache.set(scope, container);
  }

  const container = containerCache.get(scope)!;
  const factory = await container.get(module);
  const mod = factory();
  return mod.default ?? mod;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

interface Props extends RemoteConfig {
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  componentProps?: Record<string, any>;
}

export function RemoteComponent({
  fallback,
  errorFallback,
  componentProps = {},
  ...remoteConfig
}: Props) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const comp = await loadFederatedComponent(remoteConfig);
      setComponent(() => comp);
      setStatus('success');
    } catch (err) {
      console.error(`[Federation] Failed to load ${remoteConfig.scope}/${remoteConfig.module}`, err);
      setStatus('error');
    }
  }, [remoteConfig.url, remoteConfig.scope, remoteConfig.module]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === 'error') {
    return (
      <>
        {errorFallback ?? (
          <div style={{ color: 'red', padding: 16, border: '1px solid red' }}>
            Failed to load: {remoteConfig.label}
          </div>
        )}
      </>
    );
  }

  if (status === 'loading' || status === 'idle' || !Component) {
    return <>{fallback ?? <DefaultSkeleton />}</>;
  }

  return <Component {...componentProps} />;
}
