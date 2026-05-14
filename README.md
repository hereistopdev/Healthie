# Healthie pairing prep

Two folders, one repo — what the interview guide asked for.

## Session 1 (`session1/`)

ActiveRecord + SQLite (no Rails stack). Models, migration, seeds, and `lib/queries.rb` with the four requested relations.

See `session1/README.md`.

## Session 2 (`kanban/`)

Vite + React + TypeScript. From repo root:

```powershell
cd kanban
npm install
npm run dev
```

That starts **http://localhost:5173/** (browser may open automatically). Use `npm start` if you prefer.

Build + static preview:

```powershell
npm run build
npm run preview
```

## Notes

- Rick and Morty GraphQL endpoint: `https://rickandmortyapi.com/graphql` (public, no auth).
- Ruby was not available on the machine used to scaffold this; run `bundle install` locally once to verify Session 1.
