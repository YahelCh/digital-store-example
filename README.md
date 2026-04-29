# Digital Store Example

Monorepo demonstrating **Module Federation** with React 18 and a shared Zustand store, implemented in two bundler stacks: Webpack 5 and Rspack.

## Projects

### Webpack 5

| App | Port | Role |
|-----|------|------|
| `shell/` | 5001 | Host — exposes `UserStore`, loads MFEs dynamically |
| `mfe/` | 5002 | Remote — consumes `shell/UserStore`, exposes `./MfeApp` |
| `mfe-webpack/` | 5003 | Remote — standalone Webpack MFE |

### Rspack

| App | Port | Role |
|-----|------|------|
| `shell-rspack/` | 5011 | Host — exposes `UserStore`, loads MFEs dynamically |
| `mfe-rspack/` | 5012 | Remote — consumes `shellRspack/UserStore`, exposes `./MfeApp` |

## Architecture

- `shell` / `shell-rspack` expose `./UserStore` (Zustand store) as a federated module
- The MFE declares the shell as a static remote and imports `useUserStore` directly — same store instance at runtime
- The shell loads remotes **dynamically** via `RemoteComponent`, without declaring them in its bundler config
- `RemoteComponent` uses the `__webpack_init_sharing__` / `__webpack_share_scopes__` API (compatible with both Webpack and Rspack) to share React and Zustand with every loaded remote
- MFEs are **lazy-loaded on button click** and can be hidden without unmounting

## Setup

```bash
# Webpack projects
cd shell && npm install
cd ../mfe && npm install
cd ../mfe-webpack && npm install

# Rspack projects
cd ../shell-rspack && npm install
cd ../mfe-rspack && npm install
```

## Run — Webpack (dev mode)

Open three terminals:

```bash
# Terminal 1
cd mfe-webpack && npm run dev

# Terminal 2
cd mfe && npm run dev

# Terminal 3
cd shell && npm run dev
```

Open `http://localhost:5001`

## Run — Rspack (dev mode)

Open two terminals:

```bash
# Terminal 1
cd shell-rspack && npm run dev

# Terminal 2
cd mfe-rspack && npm run dev
```

Open `http://localhost:5011`

> Start the shell before opening the browser. The MFE dev server must be running before clicking "Load MFE" in the shell.

## Run (production)

```bash
# Webpack
cd mfe-webpack && npm run build && npm run preview
cd mfe         && npm run build && npm run preview
cd shell       && npm run build && npm run preview

# Rspack
cd mfe-rspack   && npm run build && npm run preview
cd shell-rspack && npm run build && npm run preview
```

## Shared state

Toggling the user in the shell or in the MFE updates the same Zustand store — changes are reflected in both simultaneously.
