import React, { ReactNode, useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';

export interface RemoteConfig {
  id: string;
  url: string;
  scope: string;
  module: string;
  label: string;
  from: "vite" | "webpack";
  format?: "esm" | "var" | "systemjs";
}

const registeredRemotes = new Map<string, any>();

function DefaultSkeleton() {
  return (
    <div style={{
      height: 120,
      background: "#f0f0f0",
      borderRadius: 8,
      animation: "pulse 1.5s infinite"
    }} />
  );
}

// דינאמיק load של remoteEntry וקבלת המודול
export async function loadFederatedComponent(
  config: RemoteConfig
): Promise<React.ComponentType<any>> {
  const { url, scope, module } = config;

  // אם כבר הטענו את ה-remote הזה, נשתמש בכשהו שלו
  if (registeredRemotes.has(scope)) {
    const container = registeredRemotes.get(scope);
    const factory = await container.get(module);
    const Component = factory();
    return Component.default ?? Component;
  }

  // ראשית, וודא שה-shell container עצמו זמין (כדי ש-MFE יוכל לגשת לשלו)
  if (scope !== 'shell') {
    await ensureShellContainerAvailable();
  }

  // דרך 1: נסה דרך import() דינאמית
  let container: any = null;
  
  try {
    // נסה להעלות את ה-remoteEntry כ-ESM module
    const remoteEntry = await import(/* @vite-ignore */ url);
    console.log(`[Federation] Loaded remoteEntry as ESM from ${url}`, Object.keys(remoteEntry));
    
    if (remoteEntry.get && remoteEntry.init) {
      // זה עבד - בנו את ה-container מה-exports
      container = remoteEntry;
    }
  } catch (err) {
    console.warn(`[Federation] Failed to import remoteEntry as ESM: ${err}`);
  }

  // דרך 2: אם import() לא עבדה, נדלק script tag וה-container יופיע על window
  if (!container) {
    // בדוק אם כבר יש script בDOM
    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = url;
      script.type = 'module';

      await new Promise<void>((resolve, reject) => {
        script.onload = () => {
          console.log(`[Federation] Script loaded from ${url}`);
          resolve();
        };
        script.onerror = () => {
          console.error(`[Federation] Failed to load script from ${url}`);
          reject(new Error(`Failed to load remote: ${url}`));
        };
        document.head.appendChild(script);
      });

      // תן זמן קט לVite federation להרשום את ה-container
      await new Promise(r => setTimeout(r, 100));
    }

    // בדוק אם ה-container הופיע על window
    container = (window as any)[scope];
    if (!container) {
      console.error(`[Federation] Remote container "${scope}" not found on window after loading`);
      console.log(`[Federation] Available on window:`, Object.keys(window as any).filter(k => typeof (window as any)[k] === 'object'));
      throw new Error(`Remote container "${scope}" not found on window`);
    }
  }

  if (!container || typeof container.get !== 'function') {
    console.error(`[Federation] Container invalid. Has methods:`, {
      init: typeof container?.init,
      get: typeof container?.get,
      keys: Object.keys(container || {})
    });
    throw new Error(`Remote container is missing 'get' function`);
  }

  // הכנת shareScope עם React של ה-shell
  const shareScope = {
    default: {
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
      zustand: {
        latest: {
          get: () => import('zustand').then(m => () => m),
          from: 'shell',
          eager: true,
          loaded: 1,
        },
      },
    },
  };

  // אתחול ה-remote עם ה-shareScope
  if (container.init && typeof container.init === 'function') {
    try {
      await container.init(shareScope);
      console.log('[Federation] Container initialized successfully with shareScope');
    } catch (err) {
      console.warn('[Federation] Warning during init:', err);
    }
  }

  // קבלת ה-factory ואז קרא לה
  try {
    const factory = await container.get(module);
    console.log(`[Federation] Got factory for ${module}`);
    const Component = factory();
    console.log(`[Federation] Got component`);

    // שמור את ה-container כדי לא לטעון שוב
    registeredRemotes.set(scope, container);

    return Component.default ?? Component;
  } catch (err) {
    console.error(`[Federation] Error getting module ${module}:`, err);
    throw err;
  }
}

// Helper function to ensure shell container is available for MFE remotes config
async function ensureShellContainerAvailable() {
  const shellContainer = (window as any).shell;
  if (shellContainer) {
    console.log('[Federation] Shell container already available');
    return;
  }

  console.log('[Federation] Shell container not found, registering...');
  // Shell module is exposed by our own remoteEntry
  // Register it so MFE can access it via its remotes config
  (window as any).shell = {
    get: async (module: string) => {
      console.log(`[Federation] Getting shell module: ${module}`);
      // Shell exposes ./UserStore
      if (module === './UserStore') {
        const mod = await import('./store/userStore');
        return () => mod;
      }
      throw new Error(`Shell module ${module} not found`);
    },
    init: (shareScope: any) => {
      console.log('[Federation] Shell init called with shareScope');
      // Share our React with dependents
      if (shareScope?.default) {
        Object.assign(shareScope.default, {
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
        });
      }
    },
  };
}

type Status = "idle" | "loading" | "success" | "error";

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
  const [status, setStatus] = useState<Status>("idle");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const comp = await loadFederatedComponent(remoteConfig);
      setComponent(() => comp);
      setStatus("success");
    } catch (err) {
      console.error(
        `[Federation] Failed to load ${remoteConfig.scope}/${remoteConfig.module}`,
        err
      );
      setStatus("error");
    }
  }, [remoteConfig.url, remoteConfig.scope, remoteConfig.module]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === "error") {
    return (
      <>
        {errorFallback ?? (
          <div style={{ color: "red", padding: 16, border: "1px solid red" }}>
            ❌ Failed to load: {remoteConfig.label}
          </div>
        )}
      </>
    );
  }

  if (status === "loading" || status === "idle" || !Component) {
    return <>{fallback ?? <DefaultSkeleton />}</>;
  }

  return <Component {...componentProps} />;
}
