#!/bin/bash
# ============================================
# MTTO Pro - Deploy to Minikube
# ============================================

set -e

echo "============================================"
echo "  MTTO Pro - Deployment to Minikube"
echo "============================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if minikube is running
echo -e "\n${YELLOW}[1/8]${NC} Checking Minikube status..."
if ! minikube status | grep -q "Running"; then
    echo -e "${YELLOW}Starting Minikube...${NC}"
    minikube start --memory=4096 --cpus=2 --driver=docker
fi
echo -e "${GREEN}✓ Minikube is running${NC}"

# Configure Docker to use Minikube's daemon
echo -e "\n${YELLOW}[2/8]${NC} Configuring Docker environment..."
eval $(minikube docker-env)
echo -e "${GREEN}✓ Docker configured${NC}"

# Build Docker images
echo -e "\n${YELLOW}[3/8]${NC} Building Docker images..."

echo "Building frontend image..."
docker build -t mtto-frontend:latest -f docker/frontend/Dockerfile .

echo "Building backend image..."
docker build -t mtto-backend:latest -f docker/backend/Dockerfile.mysql .

echo -e "${GREEN}✓ Images built${NC}"

# Enable ingress addon
echo -e "\n${YELLOW}[4/8]${NC} Enabling Minikube addons..."
minikube addons enable ingress
minikube addons enable metrics-server
echo -e "${GREEN}✓ Addons enabled${NC}"

# Create namespace
echo -e "\n${YELLOW}[5/8]${NC} Creating namespace..."
kubectl apply -f k8s/namespace.yaml
echo -e "${GREEN}✓ Namespace created${NC}"

# Create ConfigMaps and Secrets
echo -e "\n${YELLOW}[6/8]${NC} Creating ConfigMaps and Secrets..."
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# Create ConfigMap for MySQL init scripts
kubectl create configmap mysql-init-config \
    --from-file=schema.sql=database/schema.sql \
    -n mtto-system \
    --dry-run=client -o yaml | kubectl apply -f -

echo -e "${GREEN}✓ ConfigMaps and Secrets created${NC}"

# Deploy MySQL
echo -e "\n${YELLOW}[7/8]${NC} Deploying MySQL..."
kubectl apply -f k8s/mysql-pv.yaml
kubectl apply -f k8s/mysql-deployment.yaml

echo "Waiting for MySQL to be ready..."
kubectl wait --for=condition=ready pod -l app=mysql -n mtto-system --timeout=120s
echo -e "${GREEN}✓ MySQL deployed${NC}"

# Deploy Backend and Frontend
echo -e "\n${YELLOW}[8/8]${NC} Deploying Backend and Frontend..."
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml

echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available deployment/backend -n mtto-system --timeout=120s
kubectl wait --for=condition=available deployment/frontend -n mtto-system --timeout=120s
echo -e "${GREEN}✓ All services deployed${NC}"

# Get service URLs
echo ""
echo "============================================"
echo -e "  ${GREEN}✓ Deployment Complete!${NC}"
echo "============================================"
echo ""

MINIKUBE_IP=$(minikube ip)
FRONTEND_PORT=$(kubectl get svc frontend-service -n mtto-system -o jsonpath='{.spec.ports[0].nodePort}')

echo "Services:"
echo "  Frontend: http://${MINIKUBE_IP}:${FRONTEND_PORT}"
echo "  Backend:  http://${MINIKUBE_IP}:${FRONTEND_PORT}/api"
echo ""
echo "Or use: minikube service frontend-service -n mtto-system"
echo ""
echo "To add hostname to /etc/hosts:"
echo "  echo '${MINIKUBE_IP} mtto.local' | sudo tee -a /etc/hosts"
echo ""
echo "Dashboard:"
echo "  minikube dashboard"
echo ""

