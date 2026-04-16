# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Ensure the database file exists and is writable
RUN touch prim_uslugi.db && chmod 666 prim_uslugi.db

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/seed_services.js ./seed_services.js
COPY --from=builder /app/src/lib/start-polling.js ./src/lib/start-polling.js
# COPY --from=builder /app/prim_uslugi.db ./prim_uslugi.db 

EXPOSE 3000

# Start both the Telegram bot poller in background and NextJS in foreground
CMD ["sh", "-c", "node src/lib/start-polling.js & npm start"]
