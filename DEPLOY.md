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

## GitHub Repo
`github.com/jmariano19/jeffmariano.com`
