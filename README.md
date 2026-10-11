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

No build step needed. Just open the files directly:

```bash
# Option 1: open directly in browser
open public/catalog.html
open public/admin.html

# Option 2: simple local server (avoids CORS on some browsers)
npx serve public
# then open http://localhost:3000
```

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

No `.env` files needed — the Supabase publishable key is safe to commit (it's read-only public access). The admin password is hardcoded in `admin.html`.

Netlify secrets (set in Netlify dashboard → Site settings → Environment variables):
- `NETLIFY_AUTH_TOKEN` — for GitHub Actions deploy (set as GitHub secret)
- `NETLIFY_SITE_ID` — your Netlify site ID (set as GitHub secret)
