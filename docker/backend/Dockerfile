# Backend Dockerfile
FROM node:20-alpine

# Instalar Python y dependencias necesarias
RUN apk add --no-cache python3 py3-pip

WORKDIR /app

# Copiar archivos de dependencias de Node
COPY backend/package*.json ./

# Instalar dependencias de Node
RUN npm ci --only=production

# Crear entorno virtual de Python e instalar dependencias
COPY requirements.txt ./
RUN python3 -m venv /app/venv && \
    /app/venv/bin/pip install --no-cache-dir -r requirements.txt

# Copiar código del backend
COPY backend/ .

# Variables de entorno
ENV NODE_ENV=production
ENV PYTHON_PATH=/app/venv/bin/python

# Exponer puerto
EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3001/api/health || exit 1

CMD ["node", "server.js"]

