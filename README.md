# SIT323/SIT737 - Practical 9.1P: Adding a Database to Your Application

## 1. Task Overview
This practical guides you through integrating a MongoDB database into an existing containerized Node.js microservice. Key steps include:

- Deploy MongoDB in a Kubernetes cluster (standalone or replica set)  
- Create a database user with appropriate permissions  
- Configure persistent storage (PV & PVC)  
- Manage credentials securely with Kubernetes Secrets  
- Update Deployment manifests to inject database connection parameters  
- Modify application code to connect and perform CRUD operations  
- Test end-to-end functionality  
- Implement backup and monitoring solutions  

---

## 2. Prerequisites

- Git  
- Visual Studio Code  
- Node.js (v18+)  
- Docker & Docker Compose  
- Kubernetes & kubectl (configured)  
- MongoDB (v6.x)  

---

## 3. Deploy MongoDB in Kubernetes

### 3.1 Create PersistentVolume & PersistentVolumeClaim
```bash
kubectl apply -f k8s/mongo/mongo-pv.yaml
kubectl apply -f k8s/mongo/mongo-pvc.yaml
```

### 3.2 Create Secret for Credentials
```bash
kubectl apply -f k8s/mongo/mongo-secret.yaml
```
- Secret name: `mongo-secret`
- Keys: `mongo-root-username`, `mongo-root-password`

### 3.3 Deploy and Expose MongoDB
```bash
kubectl apply -f k8s/mongo/mongo-deployment.yaml
kubectl apply -f k8s/mongo/mongo-service.yaml
```
- MongoDB listens on port **27017**
- Data is persisted under /data/db

---
## 4.Application Configuration & Local Testing

### 4.1 Dockerfile
- Builds the Node.js application image
- Copies source code and installs dependencies

### 4.2 Docker Compose (Local)
```bash
docker-compose up --build
```
- Starts both `mongo` and `app` services
- Mounts a local volume for MongoDB data
- App connects via:
```bash
MONGO_URI=mongodb://root:example@localhost:27017/mydb?authSource=admin
```
### 4.3 Kubernetes Deployment for App
```bash
kubectl apply -f k8s/app/app-deployment.yaml
kubectl apply -f k8s/app/app-service.yaml
```
- `app-deploymen`t injects `MONGO_URI` from Secret
- Service exposes port 80, forwarding to container port 3000

---
## 5.Application Code Changes

### 5.1 Database Connection (src/index.js)
```javascript
require('dotenv').config();  // if using a .env file
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
```
### 5.2 CRUD API
- Model: `src/models/user.js`
- Routes: `src/routes/users.js` (GET, POST, PUT, DELETE)
- Static front-end: served from` public/`
  
---

## 6.Testing
### 6.1 Local (Docker Compose)
1. Run:
```bash
docker-compose up --build
```
2.Visit `http://localhost:3000`
3.Use the **User List** to Create, Read, Update, Delete users

### 6.2 Kubernetes
1.Check pods and services:
```bash
kubectl get pods,svc
```
2.Port-forward or use LoadBalancer IP:
```bash
kubectl port-forward svc/app-service 8080:80
```
3.Visit `http://localhost:8080` and verify CRUD operations

---
## 7.Monitoring
- **Monitoring**: Use `kubectl top pod` or integrate with Prometheus & Grafana.
---
## 8.Final Status
- MongoDB is deployed with persistent storage and secure credentials.
- Application logs show `MongoDB connected`.
- CRUD functionality works under both Docker Compose and Kubernetes.
- Monitoring strategy is in place.
---  

 ## 9.Conclusion

This exercise demonstrated how to integrate MongoDB into a containerized Node.js microservice, covering persistent storage, credential management, Deployment updates, code modifications, and testing. The result is a secure, resilient, and observable cloud-native setup ready for production deployment.












