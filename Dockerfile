# Estágio 1: Build
FROM node:22-slim AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build

# Estágio 2: Runner (Servidor Web)
FROM nginx:alpine AS runner
# Copia o build do Vite para a pasta do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Copia a configuração do Nginx que vamos criar abaixo
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]