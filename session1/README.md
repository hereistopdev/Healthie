# Session 1 — data model (ActiveRecord, no Rails)

Lightweight setup: migrations + models only, SQLite on disk. Easier to ship than a full Rails app if you just need the schema for the interview walkthrough.

## Run it

```bash
cd session1
bundle install
rake db:migrate
rake db:seed
ruby lib/queries.rb
```

Console:

```bash
ruby bin/console
```

Then try, for example:

```ruby
p = Provider.first
InterviewQueries.clients_for_provider(p)
InterviewQueries.journal_entries_for_provider(p)
```

## Schema (in words)

- `providers` and `clients` each store `name` + `email`.
- Many-to-many via `enrollments` with a per-pair `plan` enum (`basic` / `premium`).
- `journal_entries` belong to a client and hold freeform `body` text.

If you prefer a full Rails app instead, you can copy the migration + models into `rails new` — the shapes stay the same.
