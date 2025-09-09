#!/usr/bin/env bash
set -euo pipefail

# === Paramètres ===
BRANCH="${1:-preprod}"
REPO_DIR="/root/apps/Au-paradis-ofer-preprod"
APP_DIR="$REPO_DIR/apps/frontend"
PM2_APP="au-paradis-ofer-preprod"
PM2_ECOSYS="$APP_DIR/ecosystem.config.cjs"

log() { echo "[$(date '+%F %T')] $*"; }
fail(){ echo "[$(date '+%F %T')] ❌ $*" >&2; exit 1; }
trap 'fail "Déploiement interrompu (code $?)"' ERR

command -v pnpm >/dev/null || fail "pnpm introuvable"
command -v pm2  >/dev/null || fail "pm2 introuvable"
command -v git  >/dev/null || fail "git introuvable"

log "== Déploiement PREPROD sur branche « ${BRANCH} » =="

# 1) Git sync
cd "$REPO_DIR"
log "→ Git fetch/reset sur origin/${BRANCH}"
git fetch --all --prune
git checkout "$BRANCH"
git reset --hard "origin/${BRANCH}"
git clean -fd

# 2) Ne pas laisser Next lire .env.local en serveur
[ -f "$APP_DIR/.env.local" ] && mv "$APP_DIR/.env.local" "$APP_DIR/.env.local.devonly" || true

# 3) Install (monorepo root) AVEC devDeps (PostCSS/Tailwind requis au build)
log "→ Install (monorepo, devDeps inclus)"
ORIG_NODE_ENV="${NODE_ENV-}"; unset NODE_ENV
pnpm install --frozen-lockfile --prod=false
# Ceinture + bretelles : s'assurer que les plugins sont bien présents au root
pnpm add -w -D @tailwindcss/postcss@4.1.12 tailwindcss@4.1.12 postcss@8 autoprefixer@10 >/dev/null 2>&1 || true
[ -n "${ORIG_NODE_ENV-}" ] && export NODE_ENV="${ORIG_NODE_ENV}"

# 4) Build frontend
log "→ Build frontend"
cd "$APP_DIR"
pnpm build

# 5) PM2 : (re)charger uniquement la PREPROD
log "→ PM2 startOrReload (only: ${PM2_APP})"
pm2 startOrReload "$PM2_ECOSYS" --only "$PM2_APP"
pm2 save

# 6) Checks
log "→ Sanity checks"
ss -lntp | grep -q ':3001 ' && log "Port 3001 à l'écoute" || fail "Port 3001 non ouvert"
pm2 env "$PM2_APP" | egrep -q '^STRIPE_SECRET_KEY=' || log "⚠ STRIPE_SECRET_KEY absente dans PM2 env"
pm2 env "$PM2_APP" | egrep -q '^CALENDAR_ICS_URL=' || log "⚠ CALENDAR_ICS_URL absente dans PM2 env"

log "✅ OK : PREPROD déployée"
