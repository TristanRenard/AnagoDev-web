# Utilisation de Node.js comme base
FROM node:22-alpine AS base

# Installer les dépendances système
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Étape pour installer les dépendances
FROM base AS deps
COPY knexfile.js package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
COPY ./src/db/migrations/* ./src/db/migrations/
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# execute knex migration
RUN pnpm run-prod-migrations; exit 0
RUN yarn run-prod-migrations; exit 0
RUN npm run run-prod-migrations; exit 0


# Étape pour builder le projet
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f yarn.lock ]; then yarn build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Préparation de l'image pour la production
FROM base AS runner
WORKDIR /app

# Définit l'environnement en production
ENV NODE_ENV=production

# Ajout d'un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copier les fichiers nécessaires depuis le build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Configurer les permissions
RUN chown -R nextjs:nodejs /app

# Exécution en tant qu'utilisateur non-root
USER nextjs

# Exposer le port et démarrer l'application
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
