# Srijan Sarees — Web Portal

WhatsApp saree marketplace with customer catalog and admin portal.

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Customer Catalog | `/catalog.html?token=TOKEN` | Luxury catalog sent to customers via WhatsApp |
| Admin Portal | `/admin.html` | Add/edit sarees, manage listings, generate catalog links |

## Stack

- **Frontend**: Vanilla HTML/CSS/JS — no build step, no dependencies
- **Database**: Supabase (PostgreSQL via REST API)
- **Storage**: Supabase Storage (`saree-images` bucket)
- **Hosting**: Netlify (auto-deploy from `main` branch)
- **WhatsApp**: Make.com + Interakt

## Branches

| Branch | Purpose | Deploys to |
|--------|---------|------------|
| `main` | Production | `srijan-sarees.netlify.app` |
| `staging` | Testing changes | `staging--srijan-sarees.netlify.app` |
| `feature/*` | New features | PR preview URL |

## Local Development

The catalog page has no build step — open it directly:

```bash
open public/catalog.html
```

The admin portal's login now calls a Netlify Function (`netlify/functions/login.js`), so it needs the Netlify CLI to run locally:

```bash
npm install -g netlify-cli   # one-time
netlify dev
# then open http://localhost:8888/admin.html
```

`netlify dev` picks up `ADMIN_PASSWORD` / `SESSION_SECRET` from a local `.env` file (gitignored) or from `netlify env:import`.

## Deploying

Push to `main` → Netlify auto-deploys within ~30 seconds.

```bash
git add .
git commit -m "describe your change"
git push origin main
```

## Adding a Developer

1. Go to GitHub repo → Settings → Collaborators → Add people
2. Give them `Write` access (can push to branches, open PRs)
3. They should **never push directly to `main`** — open a PR instead

## Environment / Secrets

The Supabase publishable key is committed in both HTML files — this is safe only to the extent that Supabase Row Level Security policies on `products`, `weavers`, `saree_photos`, and `catalog_tokens` are locked down; it is not a read-only key by default.

The admin password is **not** in the repo. It's checked server-side by `netlify/functions/login.js`. Set these in Netlify dashboard → Site settings → Environment variables:
- `ADMIN_PASSWORD` — the admin portal password
- `SESSION_SECRET` — random string used to sign session tokens (e.g. `openssl rand -hex 32`)

Netlify secrets for GitHub Actions deploy (set as GitHub repo secrets):
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`
