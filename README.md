# Sveltekid

A SvelteKit 5 learning project with a 3D Earth scene, a blog with posts, and GitHub OAuth — built to explore Svelte 5 runes, Threlte (Three.js), Better Auth, Drizzle ORM, and Tiptap.

## Prerequisites

- Node.js ≥ 18
- Docker (for the Postgres database)
- A GitHub OAuth app (for social login — optional, email/password works without it)

## Getting started

### 1. Clone and install

```sh
git clone <your-repo-url>
cd sveltekid
npm install
```

### 2. Configure environment

Copy the example env file and fill it in:

```sh
cp .env.example .env
```

| Variable              | What to put                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `DATABASE_URL`        | `postgres://root:mysecretpassword@localhost:5432/local` (matches Docker default) |
| `ORIGIN`              | `http://localhost:5173` in dev                                              |
| `BETTER_AUTH_SECRET`  | Any random 32-character string                                              |
| `GITHUB_CLIENT_ID`    | From your GitHub OAuth app (Settings → Developer settings → OAuth Apps)    |
| `GITHUB_CLIENT_SECRET`| Same app                                                                    |

GitHub OAuth is only needed if you want the GitHub sign-in button. Email/password auth works without it.

### 3. Start the database

```sh
npm run db:start
```

This runs `docker compose up` and starts a Postgres container on port 5432. Keep it running in its own terminal.

### 4. Push the schema

```sh
npm run db:push
```

This runs `drizzle-kit push`, which reads `src/lib/server/db/schema.ts` and creates the tables directly in the running database. No migration files needed for local dev.

### 5. Start the dev server

```sh
npm run dev
```

App is at `http://localhost:5173`.

---


## Database commands

| Command              | What it does                                      |
| -------------------- | ------------------------------------------------- |
| `npm run db:start`   | Start Postgres in Docker                          |
| `npm run db:push`    | Apply schema changes directly (no migration file) |
| `npm run db:generate`| Generate a migration file from schema diff        |
| `npm run db:migrate` | Run pending migration files                       |
| `npm run db:studio`  | Open Drizzle Studio (visual DB browser)           |

## Auth schema

If you change `src/lib/server/auth.ts`, regenerate the auth schema with:

```sh
npm run auth:schema
```

---

## Other commands

```sh
npm run check        # Type-check with svelte-check
npm run lint         # Prettier + ESLint
npm run format       # Auto-format everything
npm run build        # Production build
npm run preview      # Preview production build locally
```

---

## Stack

- **SvelteKit 5** with Svelte 5 runes — `$state`, `$derived`, `$effect`, `$props`
- **Threlte** — Svelte wrapper for Three.js, runes-native (`@threlte/core`, `@threlte/extras`, `@threlte/studio`, `@threlte/theatre`)
- **Better Auth** — email/password + GitHub OAuth, session stored in Postgres via Drizzle adapter
- **Drizzle ORM** — schema-first, Postgres via `postgres.js`
- **shadcn-svelte / bits-ui** — headless component primitives
- **Tailwind CSS v4** — utility styles with custom OKLCH design tokens
