import React, { useState, useEffect, Suspense } from 'react';

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
const componentCache = new Map<string, React.ComponentType<any>>();

async function loadFederatedComponent(config: RemoteConfig): Promise<React.ComponentType<any>> {
  const { url, scope, module: moduleName } = config;
  const cacheKey = `${scope}${moduleName}`;

  if (componentCache.has(cacheKey)) {
    return componentCache.get(cacheKey)!;
  }

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
    if (!container) throw new Error(`Rspack container "${scope}" not found on window`);
    await __webpack_init_sharing__('default');
    await container.init(__webpack_share_scopes__.default);
    containerCache.set(scope, container);
  }

  const container = containerCache.get(scope)!;
  const factory = await container.get(moduleName);
  const mod = factory();
  const Component = mod.default ?? mod;
  componentCache.set(cacheKey, Component);
  return Component;
}

interface Props {
  config: RemoteConfig;
  componentProps?: Record<string, any>;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export function RemoteComponent({ config, componentProps = {}, fallback, errorFallback }: Props) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFederatedComponent(config)
      .then(comp => setComponent(() => comp))
      .catch((err) => setError(err.message));
  }, [config.id]);

  if (error) return <>{errorFallback ?? <div>Error: {error}</div>}</>;
  if (!Component) return <>{fallback ?? <div>Loading...</div>}</>;
  return <Component {...componentProps} />;
}
