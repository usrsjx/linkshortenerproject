---
description: Guidelines for data mutations, server actions, and database helper boundaries.
applyTo: **/*
---

# Server Actions and Mutations

- Perform all application data mutations through Next.js server actions. Call server actions from client components.
- Put server actions in a file named `actions.ts`, colocated with the directory of the client component that calls them.
- Give action parameters and return values appropriate TypeScript types. Do not use the `FormData` type; define explicit input shapes instead.
- Do not throw errors from server actions. Return a typed result object with either a `success` or `error` property.
- Validate all action input with Zod in the server action before using it.
- At the start of each action, verify the user is signed in with Clerk before proceeding. Derive the user ID from the authenticated server context; never trust a client-supplied user ID.
- Perform database work only through helper functions in `/data`. Those helpers wrap Drizzle queries; server actions must not issue Drizzle queries directly.
