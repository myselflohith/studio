# Dockerfile

# Step 1: Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Production Image
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/tsconfig.json ./

EXPOSE 3000

CMD ["npm", "start"]
