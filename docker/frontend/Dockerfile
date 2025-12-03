# Frontend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY frontend/package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY frontend/ .

# Build de producción
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# Variables de entorno UTF-8
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# Instalar wget para healthcheck
RUN apk add --no-cache wget

# Copiar configuración personalizada de nginx
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos build
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

