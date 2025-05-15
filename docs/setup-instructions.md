# Setup Instructions

## Local with Docker Compose
```bash
docker-compose up --build
```
Visit http://localhost:3000 to interact with the User List.

## Kubernetes
```bash
kubectl apply -f k8s/mongo/
kubectl apply -f k8s/app/
```
Retrieve external IP:
```bash
kubectl get svc app-service
```
Visit the external IP in your browser.