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

Start the shell first, then the MFE:

```bash
cd shell
npm run dev
```

```bash
cd mfe
npm run dev
```

- Shell listens on `http://localhost:5173`
- MFE listens on `http://localhost:4173`

## Behavior

- `shell` defines and exposes `./src/store/userStore.ts`
- `mfe` imports `shell/UserStore` and renders the same shared Zustand user state

## Notes

The chosen module federation setup shares `react`, `react-dom`, and `zustand` between both apps.
