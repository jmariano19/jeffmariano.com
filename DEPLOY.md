# Deployment — jeffmariano.com

## Platform
Easypanel on `projecto-1` — app: `jeffmariano_portfolio`

## Auto-deploy
Push to `main` → GitHub Actions → Easypanel auto-rebuild.
If auto-deploy doesn't trigger, use the webhook below.

## Manual Deploy Webhook
```
curl "http://85.209.95.19:3000/api/deploy/7195a23b11b9098155b269762d43aa22a6b3452e4961a083"
```

## GitHub Repo
`github.com/jmariano19/jeffmariano.com`
