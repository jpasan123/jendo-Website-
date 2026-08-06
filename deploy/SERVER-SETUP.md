# Jendo site — company server

| Item | Value |
|------|--------|
| Domain | `jendo.health`, `www.jendo.health` |
| Path | `/var/www/jendo-landing` |
| Port | `3002` |
| PM2 | `jendo-landing` |

## Deploy

```bash
rsync -avz --exclude node_modules --exclude .next --exclude .git web/ root@168.144.143.156:/var/www/jendo-landing/
ssh root@168.144.143.156 'cd /var/www/jendo-landing && npm ci && npm run build && PORT=3002 pm2 restart jendo-landing'
```

Or on server after `git pull`:

```bash
cd /var/www/jendo-landing && bash deploy/deploy.sh
```

## Vercel

This site is hosted on the company server. Remove the old Vercel project from the Vercel dashboard and point DNS A records for `jendo.health` / `www` to the company server IP.
