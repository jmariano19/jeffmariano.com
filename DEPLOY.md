# Deployment — jeffmariano.com

## Platform
Easypanel on `projecto-1` — app: `jeffmariano_portfolio`

## Auto-deploy
Push to `main` → GitHub Actions → Easypanel auto-rebuild.
If auto-deploy doesn't trigger, use the webhook below.

## Manual Deploy Webhook
Store the deployment webhook outside the repository, then invoke it locally:

```
curl "$EASYPANEL_DEPLOY_WEBHOOK"
```

If a webhook has ever been committed to the repository, regenerate it in Easypanel
before using it again.

## Analytics
Google Analytics uses the GA4 measurement ID `G-8CP707HCMG` by default.
It can be overridden with this environment variable:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Set it in Easypanel before deploying so the tracking script is included in the
production build.

## GitHub Repo
`github.com/jmariano19/jeffmariano.com`
