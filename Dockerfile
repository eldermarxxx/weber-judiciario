# Estágio 1: build do painel (Vite). O painel não lê variável de ambiente, então o build não precisa de segredo.
FROM node:22-alpine AS build
WORKDIR /app/web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

# Estágio 2: serve o build estático. Só o painel: o backend ainda não tem servidor que suba (ver src/server.js).
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/web/dist /usr/share/nginx/html
EXPOSE 80
