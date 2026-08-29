# node:20-bookworm-slim is Debian 12 (bookworm), not alpine — build stage only.
FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# caddy:2 is Debian-based (bookworm) by default — static runtime, no Node process.
# Named explicitly (and referenced via docker-compose's `target:`) so it stays
# the one built by `docker build` with no --target, regardless of stage order.
FROM caddy:2 AS production
COPY --from=build /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80

# --- dev stage: Vite dev server with HMR + full error overlay/source maps,
# for the frontend-react-dev compose service. Source is bind-mounted over
# /app at runtime (see docker-compose.yml), so `COPY . .` here only matters
# for a plain `docker build --target dev` without the compose bind mount.
FROM node:20-bookworm-slim AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
