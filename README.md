# Aabharan by Mallika

[![CI](https://github.com/abmjdallas-hue/aabharan-by-mallika/actions/workflows/ci.yml/badge.svg)](https://github.com/abmjdallas-hue/aabharan-by-mallika/actions/workflows/ci.yml)

E-commerce storefront for **Aabharan by Mallika**, a luxury Indian jewelry brand.

- **Live:** https://aabharanbymallikausa.com
- **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase · Stripe · FedEx Ship API · Resend

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Create a `.env.local` with the required keys (Supabase, Stripe, FedEx, Resend) — see
`src/lib/supabase.ts` and the API routes under `src/app/api/` for the variables each feature needs.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`next lint`) |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run test` | Run vitest in watch mode |
| `npm run test:run` | Run vitest once (used in CI) |

## Tests & CI

Tests live in `tests/**/*.test.ts` and run with [vitest](https://vitest.dev). On every push and
pull request to `main`, [CI](.github/workflows/ci.yml) runs lint, typecheck, and the test suite.

## Deployment

Pushing to `main` auto-deploys to production via Vercel — there is no separate deploy step.
