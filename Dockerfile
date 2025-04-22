FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install @astrojs/node
COPY . .
RUN npm run build

# Etapa final con Node.js (para SSR)
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json
RUN npm install --production 
EXPOSE 8080
CMD ["node", "dist/server/entry.mjs"]
