#!/usr/bin/env bash
set -euo pipefail

APP_NAME="jendo-landing"
APP_PORT="${PORT:-3002}"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT_DIR"
git pull --ff-only origin main
npm ci
npm run build

if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  PORT="$APP_PORT" pm2 restart "$APP_NAME" --update-env
else
  PORT="$APP_PORT" pm2 start deploy/ecosystem.config.cjs --only "$APP_NAME"
fi

pm2 save
echo "==> Jendo on http://127.0.0.1:$APP_PORT"
