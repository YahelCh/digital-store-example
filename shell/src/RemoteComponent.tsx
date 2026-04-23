import React, { ReactNode, useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';

export interface RemoteConfig {
  id: string;
  url: string;
  scope: string;
  module: string;
  label: string;
  from: 'vite' | 'webpack';
  format?: 'esm' | 'var' | 'systemjs';
}

const viteContainerCache = new Map<string, any>();
const loadedWebpackScripts = new Set<string>();

function DefaultSkeleton() {
  return (
    <div style={{
      height: 120,
      background: '#f0f0f0',
      borderRadius: 8,
      animation: 'pulse 1.5s infinite'
    }} />
  );
}

async function loadViteRemote(config: RemoteConfig): Promise<React.ComponentType<any>> {
  const { url, scope, module } = config;

  if (!viteContainerCache.has(scope)) {
    // Dynamic import loads the ESM remoteEntry correctly (unlike script injection)
    const container = await import(/* @vite-ignore */ url);
    try {
      await container.init({});
    } catch {
      // runtime may already be initialized
    }
    viteContainerCache.set(scope, container);
  }

  const container = viteContainerCache.get(scope)!;
  const factory = await container.get(module);
  const mod = factory();
  return mod.default ?? mod;
}

async function loadWebpackRemote(config: RemoteConfig): Promise<React.ComponentType<any>> {
  const { url, scope, module } = config;

  if (!loadedWebpackScripts.has(url)) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load webpack remote: ${url}`));
      document.head.appendChild(script);
    });
    loadedWebpackScripts.add(url);
  }

  const container = (window as any)[scope];
  if (!container) throw new Error(`Webpack container "${scope}" not found on window`);

  const shareScope = {
    react: {
      [React.version]: {
        get: () => Promise.resolve(() => React),
        from: 'shell',
        eager: true,
        loaded: 1,
      },
    },
    'react-dom': {
      [ReactDOM.version]: {
        get: () => Promise.resolve(() => ReactDOM),
        from: 'shell',
        eager: true,
        loaded: 1,
      },
    },
  };

  try {
    await container.init(shareScope);
  } catch {
    // already initialized
  }

  const factory = await container.get(module);
  const mod = factory();
  return mod.default ?? mod;
}

export async function loadFederatedComponent(config: RemoteConfig): Promise<React.ComponentType<any>> {
  return config.from === 'webpack'
    ? loadWebpackRemote(config)
    : loadViteRemote(config);
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
