# Digital Store Example

This workspace contains two Vite + React 18 projects configured with `@originjs/vite-plugin-federation`:

- `shell/` — host application exposing a Zustand user store as a federated module
- `mfe/` — remote application consuming the shared user store from `shell`

## Setup

Install dependencies in each project:

```bash
cd shell
npm install

cd ../mfe
npm install
```

## Run locally

**Important:** Module federation only works in production builds with this plugin version. Development servers don't generate `remoteEntry.js`.

Build both projects first:

```bash
cd shell
npm run build

cd ../mfe
npm run build
```

Then serve both:

```bash
cd shell
npm run preview

cd ../mfe
npm run preview
```

- Shell serves on `http://localhost:4176` (or next available port)
- MFE serves on `http://localhost:4175` (or next available port)

## Behavior

- `shell` defines and exposes `./src/store/userStore.ts`
- `mfe` imports `shell/UserStore` and renders the same shared Zustand user state
- `shell` also renders the `mfe` component using lazy loading

## Notes

The chosen module federation setup shares `react`, `react-dom`, and `zustand` between both apps.
Ports may vary if other services are running.
