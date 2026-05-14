# Healthie pairing prep — presentation & 60 Q&As

**Repository:** `Healthie` (Session 1: `session1/`, Session 2: `kanban/`).  
**Purpose:** Full-stack pairing interview pre-work — data model + React Kanban.

---

## Part A — Executive summary (for your walkthrough)

### Session 1 (`session1/`)

- **Stack:** ActiveRecord + SQLite + Rake (no full Rails app — allowed by the brief as “standalone migrations + models”).
- **Entities:** `Provider` and `Client` (name, email); many-to-many via `Enrollment` with **per-pair** `plan` (`basic` / `premium`); `JournalEntry` belongs to `Client` with freeform `body`.
- **Queries (in `lib/queries.rb`):** (1) clients for a provider, (2) providers for a client, (3) journal entries for a client sorted by `created_at` ascending, (4) all journal entries for clients linked to a provider, distinct + chronological.

### Session 2 (`kanban/`)

- **Stack:** Vite, React 19, TypeScript.
- **Features:** Columns **To Do / Doing / Done**; Rick and Morty **GraphQL** roster; **form** creates cards with a **required** character; **drag** across columns + **reorder** within column; **confetti** when a card moves into **Done** from elsewhere.
- **Dev detail:** Vite **proxies** `/graphql` to the public API to reduce CORS friction locally.

### How the two tasks relate

- **No code coupling** between folders; two independent deliverables matching two pairing sessions.
- **Thematic link:** Session 1 resembles provider/client/journal modeling; Session 2 is a self-contained UI exercise.

---

## Part B — 60 questions & answers

### Session 1 — schema & modeling

**Q1. Why are Session 1 and Session 2 in separate folders?**  
**A.** The interview guide describes two separate pairing sessions. Keeping two runtimes avoids fake integration and matches how reviewers will step through the prep.

**Q2. Is there a database or API connecting the Kanban to the ActiveRecord models?**  
**A.** No. The brief does not require integration. The Kanban uses in-memory React state and the public Rick and Morty API only.

**Q3. Why use ActiveRecord without a full Rails application?**  
**A.** The PDF explicitly allows a standalone migrations + models approach. This keeps the surface area small while still demonstrating migrations, associations, and query objects you can open in console.

**Q4. Why name the join model `Enrollment` instead of `ProviderClient`?**  
**A.** Either name works if consistent. `Enrollment` reads well for “client is signed up with a provider” and leaves room for future attributes on the relationship (status dates, billing flags) without sounding like a pure associative name only.

**Q5. Why is `plan` stored on `enrollments` rather than on `clients`?**  
**A.** A client can relate to multiple providers; each relationship can have its own tier. A single `plan` on `Client` would be ambiguous.

**Q6. Could `plan` live on `providers`?**  
**A.** No for this requirement — the brief states the plan is **for each provider a client is signed up with**, i.e., per pair, not global per provider.

**Q7. Why enforce unique `[provider_id, client_id]` on enrollments?**  
**A.** Prevents duplicate links and makes the join row a reliable place to read or update that pair’s plan.

**Q8. Why unique indexes on provider and client email?**  
**A.** Reasonable demo constraint for natural identities; production might separate login email from profile email or allow duplicates with verification flows.

**Q9. Why is `journal_entries.body` a `text` column?**  
**A.** Journal content is unbounded freeform; `text` avoids arbitrary string limits in SQLite/MySQL-style schemas.

**Q10. Why sort journal entries ascending by `created_at`?**  
**A.** The brief asks for entries “sorted by date.” Chronological order matches how people read a journal timeline; if the product prefers “newest first,” that is an explicit product choice you can defend either way.

**Q11. Why use `distinct` in the provider-wide journal query?**  
**A.** Joining through enrollments can duplicate rows if the graph ever allows multiple matching paths. `distinct` keeps the result set row-safe at the application level.

**Q12. How would you prevent N+1 queries when listing clients with their latest journal entry?**  
**A.** Use controlled preloading (`includes`, `preload`, or a window function query) and measure in development with the bullet gem or logging.

**Q13. What is the difference between `has_many :through` and `has_and_belongs_to_many`?**  
**A.** `has_many :through` uses an explicit join model (`Enrollment`) so you can attach attributes and validations. HABTM is a hidden join table with no first-class model — fine for pure tagging, wrong here because of `plan`.

**Q14. What does `dependent: :destroy` on associations imply?**  
**A.** Deleting a parent deletes children. That is convenient for referential cleanliness in demos but can be dangerous in production without auditing; sometimes `restrict_with_error` or soft deletes are better.

**Q15. Why SQLite for this prep?**  
**A.** Zero external services for reviewers; one file database. Production at scale would more likely be Postgres with stronger concurrency guarantees.

**Q16. How would you add a `phone_number` to clients?**  
**A.** Add a migration with a new string column, normalize/format in the model or a form object, and consider uniqueness and validation rules per region.

**Q17. How would you model a client pausing a relationship with a provider without deleting history?**  
**A.** Add `enrolled_at`, `paused_at`, or a `status` enum on `Enrollment` rather than deleting rows, so journals and billing history remain explainable.

**Q18. Can the same client be `premium` with Provider A and `basic` with Provider B?**  
**A.** Yes — that is exactly what per-enrollment `plan` enables.

**Q19. What index would you add first if `journal_entries` grew huge?**  
**A.** Composite index on `(client_id, created_at)` to accelerate the per-client timeline query.

**Q20. When would you denormalize `provider_id` onto `journal_entries`?**  
**A.** If analytics repeatedly need “all entries for provider X” at massive scale and the join cost is proven by profiling — trade write complexity and consistency rules for read speed.

### Session 1 — ActiveRecord mechanics & operations

**Q21. Where are the four required queries implemented?**  
**A.** In `session1/lib/queries.rb` as `InterviewQueries` module methods, runnable from `ruby bin/console` after migrate/seed.

**Q22. How do you run the database tasks?**  
**A.** `bundle install`, `rake db:migrate`, optional `rake db:seed`, then `ruby bin/console` or `ruby lib/queries.rb`.

**Q23. What does `enum :plan` do in Rails 7+ style?**  
**A.** It maps symbolic names (`basic`, `premium`) to integers in the database while exposing predicate methods and scopes on the model.

**Q24. Why does `ApplicationRecord` exist?**  
**A.** Convention for shared base configuration across models (`primary_abstract_class` in modern Rails-style apps).

**Q25. Could you use `default_scope` on journals?**  
**A.** You could, but default scopes often surprise callers; prefer explicit scopes like `chronological` / `recent` used at call sites.

**Q26. How would you test `InterviewQueries`?**  
**A.** Model specs with factories/fixtures asserting SQL counts, order, and edge cases (client with two providers, etc.).

**Q27. What migration risk exists when adding a non-null column to a large table?**  
**A.** Long locks and backfill complexity; use multi-step deploys (add nullable, backfill, enforce) in real production systems.

**Q28. How would you represent money for plan pricing if needed later?**  
**A.** Avoid floats; use integer cents + currency, or a dedicated money type; keep pricing off the enrollment row until requirements are clear.

**Q29. Why seeds?**  
**A.** They give interviewers and you a reproducible dataset for console demos without manual inserts.

**Q30. How would you expose this schema via JSON API in a real app?**  
**A.** Add a web framework layer (Rails API, Roda, etc.), serializers, authentication, and pagination; keep AR models as persistence.

### Session 2 — Kanban product & behavior

**Q31. Do the columns literally match “To Do, Doing, Done”?**  
**A.** Yes in the UI copy; internal React keys remain `todo`, `doing`, `done` for stable drag-and-drop identifiers.

**Q32. How are new cards created?**  
**A.** `AddCardForm` requires choosing a character from the roster fetched via GraphQL; optional text is stored as `blurb`.

**Q33. Where does new work land on the board?**  
**A.** New cards are inserted at the front of the **To Do** column in `App.tsx`’s `addCard` handler.

**Q34. Which library handles drag-and-drop?**  
**A.** `@dnd-kit/core` and `@dnd-kit/sortable` with `closestCorners` collision detection and a `DragOverlay` for the active card preview.

**Q35. Why a separate `CardPreview` for the overlay?**  
**A.** `useSortable` must run inside a `SortableContext`. The overlay renders outside that tree, so a presentational duplicate avoids invalid hook usage.

**Q36. How is reordering within a column implemented?**  
**A.** Same-column drops use `arrayMove` from `@dnd-kit/sortable` on the column’s card array.

**Q37. How is cross-column movement implemented?**  
**A.** Remove the card from the source column array and splice it into the destination column at the computed insertion index.

**Q38. When exactly does confetti run?**  
**A.** On drag end, when the destination column is `done` and the source column was not already `done`, so pure reorders inside Done do not spam confetti.

**Q39. Why `canvas-confetti`?**  
**A.** Lightweight browser effect without building a custom particle system; easy to tune colors to match the UI palette.

**Q40. Is board state persisted?**  
**A.** Not in this prep version; refreshing the page resets the board — a natural pairing extension is `localStorage` or a backend.

### Session 2 — engineering & web platform

**Q41. How does the app call the Rick and Morty GraphQL API in development?**  
**A.** The client posts to `/graphql` on the Vite dev server, which proxies to `https://rickandmortyapi.com/graphql` per `vite.config.ts`.

**Q42. What URL does production build use?**  
**A.** `import.meta.env.DEV` selects the proxy path only in dev; production bundles call the HTTPS API URL directly.

**Q43. What failure mode exists if the API is unreachable?**  
**A.** `App.tsx` shows an error message and the character `<select>` stays disabled until roster load succeeds.

**Q44. Does the GraphQL query paginate characters?**  
**A.** It requests the default `characters { results { ... } }` page; adding `page` variable and infinite scroll would be a pairing follow-up.

**Q45. Why TypeScript for the Kanban?**  
**A.** The brief requires TypeScript; it also catches shape errors between GraphQL JSON and React props early.

**Q46. Why lift `columns` state to `App` instead of only `Board`?**  
**A.** The form in `App` needs to push new cards into the todo column without prop drilling callbacks through unrelated layers beyond what you already pass.

**Q47. What accessibility considerations exist for drag-and-drop?**  
**A.** dnd-kit supports keyboard sensors; further work includes focus management, ARIA live regions on moves, and ensuring every card has visible name text (character name is shown).

**Q48. Could you use React Server Components here?**  
**A.** This deliverable is a Vite SPA as requested; RSC would be a framework choice (Next.js) and changes deployment and data fetching patterns.

**Q49. How would you add optimistic UI for moves?**  
**A.** Update state immediately on `onDragStart`/`onDragOver` patterns or keep current end-of-drag commit if simplicity is preferred; measure UX tradeoffs.

**Q50. How would you unit test drag behavior?**  
**A.** Prefer testing pure reducers/state transitions extracted from `onDragEnd` rather than simulating pointer physics in JSDOM.

### Cross-cutting — interview, tradeoffs, delivery

**Q51. What should you emphasize in the first 10 minutes of Session 1 walkthrough?**  
**A.** The join model rationale, uniqueness constraints, and reading the four query methods aloud with one example row each.

**Q52. What should you emphasize in the first 10 minutes of Session 2 walkthrough?**  
**A.** GraphQL fetch path, form validation, drag state ownership, and the Done-column delight behavior.

**Q53. How does Healthie’s stated AI policy apply?**  
**A.** AI tools are allowed; be ready to explain every line and tradeoff as if you wrote it collaboratively.

**Q54. What is a strong answer to “How would this change at very large scale?” for Session 1?**  
**A.** Indexes, avoiding `distinct` hot paths via modeling, read replicas, archiving old journal rows, and bounding list endpoints.

**Q55. What is a strong answer for very large scale in Session 2?**  
**A.** Virtualize long columns, paginate roster, debounce network refetches, and persist moves with idempotent APIs.

**Q56. How would you version this API if it were internal?**  
**A.** Add explicit schema versioning, backwards-compatible fields, and consumer-driven contract tests.

**Q57. What security topic applies to external character images?**  
**A.** Loading third-party images is generally fine with HTTPS, but content policies and privacy considerations matter if you ever proxy or cache them.

**Q58. What is a sensible first pairing feature to add?**  
**A.** Persist columns in `localStorage` with migration/version key, or add filtering by character species — both are contained and testable.

**Q59. What would you refactor with more time?**  
**A.** Extract board update logic into a pure `moveCard(state, event)` module with exhaustive tests; consider `useReducer` for clearer transitions.

**Q60. What is the single best closing sentence before discussion time?**  
**A.** “Both parts map directly to the prep doc, run locally from the README, and I’m ready to extend validations, queries, or persistence in whichever direction you want to pair.”

---

## Appendix — quick commands

**Session 1**

```bash
cd session1
bundle install
rake db:migrate
rake db:seed
ruby bin/console
```

**Session 2**

```bash
cd kanban
npm install
npm run dev
```

---

*End of document.*
