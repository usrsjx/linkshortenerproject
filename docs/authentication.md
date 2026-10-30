# Authentication

## Rules

- All authentication is handled by **Clerk** (`@clerk/nextjs`). Do NOT add or use any other auth method (custom sessions, JWTs, NextAuth, Auth.js, passwords, cookies, etc.).
- Clerk sign-in and sign-up MUST always open as a **modal**. Never link or redirect users to a full-page sign-in or sign-up flow.
- `proxy.ts` installs `clerkMiddleware()`. Keep it bare; it does not protect routes on its own.

## Route access

| Route        | Access                                                                 |
| ------------ | ---------------------------------------------------------------------- |
| `/`          | Public for signed-out users. Signed-in users are redirected to `/dashboard`. |
| `/dashboard` | Protected. Requires a signed-in user.                                  |

Any new page, route handler, or server action that needs a user must verify auth itself on the server.

## Implementation

- Server-side identity: `await auth()` from `@clerk/nextjs/server` (it is async). Use client hooks (`useAuth`) only in client components.
- Protect `/dashboard` in its page (and any child routes, handlers, or actions) with `await auth.protect()`.
- Redirect signed-in users away from `/` in `app/page.tsx` on the server:

  ```tsx
  import { auth } from "@clerk/nextjs/server";
  import { redirect } from "next/navigation";

  export default async function Home() {
    const { isAuthenticated } = await auth();
    if (isAuthenticated) redirect("/dashboard");
    // render public homepage
  }
  ```

- Launch auth as a modal with the `mode="modal"` prop:

  ```tsx
  <SignInButton mode="modal" />
  <SignUpButton mode="modal" />
  ```

  Every sign-in or sign-up trigger in the app (header, homepage CTAs, etc.) must set `mode="modal"`.
- Use `<Show when="signed-in">` / `<Show when="signed-out">` for conditional UI only; it is not an authorization check.
- The existing `app/sign-in/` and `app/sign-up/` pages are scaffolding. Do not link to them from the UI.

## Data access

- Derive the user ID from `auth()` on the server. Never trust a user ID supplied by the client.
- Scope all reads, updates, and deletes of user-owned data to that user ID.
- Return an unauthenticated error (401) from route handlers and server actions when there is no session.
