This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Configure Clerk and `DATABASE_URL` in your local environment, and apply the Drizzle schema before using the dashboard. Signed-in users can create links from the dashboard by entering an HTTP or HTTPS destination and an optional custom slug. Slugs are case-sensitive, globally unique, at most 64 characters, start with a letter or number, and contain only letters, numbers, hyphens, or underscores. If the slug is left blank, a short path is generated automatically. Short links use `/l/<slug>` and redirect to the destination; slugs can match application route names.

Existing link records retain their slugs, but previously shared root-level URLs (`/<slug>`) no longer redirect. Share the corresponding `/l/<slug>` URLs instead.

The dashboard shows each link's creation timestamp in UTC and lets owners edit a link's destination or slug and delete links after confirmation. Changing a slug or deleting a link stops the previous short URL from working.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
