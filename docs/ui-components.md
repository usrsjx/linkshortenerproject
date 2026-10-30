# UI Components

## Rules

- ALL UI elements MUST use **shadcn/ui** components. Do NOT create custom components.
- Do NOT hand-build UI from raw HTML elements (`<button>`, `<input>`, `<dialog>`, etc.) when a shadcn/ui component exists for it.
- Do NOT add another component library (MUI, Chakra, Radix primitives used directly, etc.).
- Do NOT write wrapper or composite components. Compose shadcn/ui components directly in the page or layout that uses them.

## Adding components

- Components live in `components/ui/` and are installed with the shadcn CLI, e.g. `npx shadcn@latest add card`.
- Always install the component via the CLI before using it. Never hand-write a file in `components/ui/`.
- Config is in `components.json` (style `base-nova`, icons from `lucide-react`). Use the `@/components/ui/*` import alias.
- Edit an installed `components/ui/` file only when a change to shadcn/ui defaults is explicitly required.

## Usage

- Style with Tailwind utility classes (via `className`) and the theme tokens in `app/globals.css`; use `cn()` from `@/lib/utils` to merge classes.
- Use variants and sizes the component provides before adding custom classes.
- Use `lucide-react` for icons.
- Clerk's `SignInButton` / `SignUpButton` should wrap a shadcn/ui `Button` (see [authentication.md](authentication.md) for the required `mode="modal"`).
