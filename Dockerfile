FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./

RUN npm ci --force
COPY . .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./

RUN npm install -g serve

ENV NODE_ENV=production

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]

