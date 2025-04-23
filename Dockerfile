FROM node:18-alpine AS build
WORKDIR /app
RUN npm install -g pnpm
COPY package*.json ./
RUN pnpm install
RUN pnpm install @astrojs/node
COPY . .
RUN pnpm run build

# Etapa final con Node.js (para SSR)
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json
RUN npm install -g pnpm && pnpm install --production
EXPOSE 8080
CMD ["node", "dist/server/entry.mjs"]
