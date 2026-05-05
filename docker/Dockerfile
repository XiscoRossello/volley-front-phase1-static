# ── Stage 1: build ───────────────────────────────────────────────────────────
# Use the LTS Node image to install dependencies and compile the Vite app.
FROM node:20-alpine AS builder

WORKDIR /app

# Copy manifests first so Docker layer-caches the npm install step.
# The source code layer (below) only invalidates when src/ actually changes.
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source and build the production bundle.
COPY . .
RUN npm run build
# Output is in /app/dist


# ── Stage 2: serve ───────────────────────────────────────────────────────────
# Lightweight NGINX image — no Node runtime in the final image.
FROM nginx:alpine AS server

# Remove the default NGINX welcome page.
RUN rm -rf /usr/share/nginx/html/*

# Copy the static bundle from the builder stage.
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our SPA-aware NGINX config (all paths → index.html).
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
