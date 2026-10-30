<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->

## Project overview

- This repository is a link-shortener web application built with Next.js 16 App Router, React, and strict TypeScript.
- Authentication is provided by Clerk. The root layout supplies `ClerkProvider`, and the sign-in and sign-up pages live under `app/sign-in/` and `app/sign-up/`.
- PostgreSQL access is set up with Neon Serverless and Drizzle. The schema and database client are in `db/schema.ts` and `db/index.ts`.
- Styling uses Tailwind CSS v4, CSS variables in `app/globals.css`, and shadcn/ui conventions. Shared UI components belong in `components/ui/`; the `@/*` alias maps to the project root.
- Treat the current routes and database setup as scaffolding, not evidence that link creation, redirects, analytics, or account-level data isolation are already implemented.
- Additional agent instructions will be maintained in separate Markdown files in the root `docs/` directory. Add focused, topic-specific guidance there rather than expanding this file with lengthy specialized instructions; keep this file as the project-wide entry point and link to relevant docs when they exist. 

## Mandatory `/docs` review before writing code

Before generating, writing, or modifying ANY code, first identify and read every individual instruction file in `/docs` that is relevant to the task. This is a mandatory prerequisite, not an optional reference step: do not start coding until those files have been read. If a task spans multiple topics, read every applicable instruction file (for example, read both [docs/authentication.md](docs/authentication.md) and [docs/ui-components.md](docs/ui-components.md) when both areas are involved). If it is unclear which instructions apply, inspect the files in `/docs` and read the potentially relevant ones before coding. Revisit the instructions if the task scope changes.

## Agent docs

- [docs/authentication.md](docs/authentication.md): Clerk-only authentication, modal sign-in/sign-up, protected `/dashboard`, and homepage redirect for signed-in users.
- [docs/ui-components.md](docs/ui-components.md): shadcn/ui only for all UI elements; no custom components.

## Coding conventions

- Keep TypeScript strict. Prefer explicit, narrow types and validate untrusted input at the boundary instead of using `any`, non-null assertions, or unchecked casts.
- Use the App Router conventions already present: route-specific UI in `app/`, shared presentational components in `components/`, and reusable non-UI helpers in `lib/` or the relevant domain folder.
- Keep components server-rendered by default. Add `"use client"` only when a component needs browser APIs, client-side state, event handlers, or a client-only library; keep the client boundary as small as practical.
- Use the `@/*` import alias for project modules. Follow the local file's formatting and import style when editing existing code.
- Prefer Tailwind utility classes and the existing CSS variables/theme tokens over one-off styles. Reuse existing UI primitives before adding dependencies or duplicating components.
- Use semantic HTML, accessible labels and names, visible keyboard focus, and responsive layouts for interactive UI.
- Keep route handlers, server actions, database access, and secrets on the server. Do not expose private environment variables to client components or return secrets in responses.

## Authentication and data access

- Use Clerk's supported Next.js APIs for identity and session checks. `proxy.ts` installs Clerk middleware; do not assume middleware alone protects a page, action, or API.
- Authorize each protected operation on the server. When link records are associated with a user, scope reads, updates, and deletes to the authenticated owner; never trust a submitted user ID as proof of ownership.
- Use the shared Drizzle client from `db/index.ts` and define or update database tables and relations in `db/schema.ts`. Keep schema changes and migration/configuration changes aligned.
- Use parameterized Drizzle queries. Validate and normalize URLs and short codes before storing or redirecting; only allow redirect schemes the product explicitly supports (normally HTTP and HTTPS).
- Handle missing configuration and database failures explicitly. Do not turn errors into successful-looking empty results or silently ignore failed writes.
- Keep credentials in ignored local environment files or deployment secrets. Never print, commit, or include secret values in source, logs, examples, or test fixtures.

## Next.js-specific guidance

- This project enables Next.js `cacheComponents`, `partialPrefetching`, and experimental agent feedback. Before changing Next.js routing, caching, rendering, middleware/proxy, or server/client boundaries, consult the relevant installed guide under `node_modules/next/dist/docs/` as required by the generated instructions above.
- Be deliberate with caching: do not share cached responses or data across users when the result depends on authentication, ownership, or other request-specific data. Follow the installed Next.js documentation for the current cache APIs rather than relying on older Next.js examples.
- Preserve the generated Next.js instruction and feedback blocks in this file. Next.js may restore them automatically, so make project-specific additions outside those blocks.

## Validation

- Run `npm run lint` for lint checks and `npm run build` for a production build when the change affects application code or configuration.
- There is currently no test script in `package.json`. If tests are added, use the repository's chosen test runner and add focused coverage for new behavior, especially URL validation, authorization, redirect handling, and database operations.
- Do not claim a check passed unless it was run; report any environment or configuration requirement that prevented validation.
