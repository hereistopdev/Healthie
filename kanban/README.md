# Kanban (Session 2)

## Run locally

```bash
cd kanban
npm install
npm run dev
```

Same as `npm start`. Vite opens **http://localhost:5173/** automatically when possible.

**Node:** 20+ recommended (22 works).

### How the API is loaded

In **development**, the app calls **`/graphql`** on your machine; Vite **proxies** that to `https://rickandmortyapi.com/graphql` (see `vite.config.ts`). That keeps requests same-origin and avoids typical browser CORS problems.

In **production** (`npm run build`), the bundle calls the Rick and Morty URL directly.

```bash
npm run build
npm run preview
```

## If you “can’t see it”

1. **Use the URL Vite prints** in the terminal (e.g. `http://localhost:5173/` or `5174` if 5173 is busy).
2. Try **`http://127.0.0.1:PORT/`** instead of `localhost` (some Windows DNS setups break `localhost`).
3. After `host: true`, Vite also prints a **Network** URL (LAN IP). Use that if you’re on WSL/VM/port forwarding.
4. First run, **Windows Firewall** may ask to allow Node.js — choose allow for private networks.
5. If the page stays on “Loading the board…”, press **F12 → Console** and fix any red errors (or share them).
