FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Remove development dependencies
RUN npm prune --production

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "build/index.js"]
