FROM node:24-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_SITE_URL=https://tapetarijaalekom.rs
ARG NEXT_PUBLIC_ALLOW_INDEXING=true
ARG NEXT_PUBLIC_CONTACT_FORM_ENABLED=false
ARG NEXT_PUBLIC_SHOW_DEMO_PROJECTS=true
ARG NEXT_PUBLIC_GA_ID

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_ALLOW_INDEXING=$NEXT_PUBLIC_ALLOW_INDEXING \
    NEXT_PUBLIC_CONTACT_FORM_ENABLED=$NEXT_PUBLIC_CONTACT_FORM_ENABLED \
    NEXT_PUBLIC_SHOW_DEMO_PROJECTS=$NEXT_PUBLIC_SHOW_DEMO_PROJECTS \
    NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
