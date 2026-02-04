# MindX Engineer Onboarding – Week 1 Project

## Overview

This project is the final result of Week 1 of the MindX Engineer Onboarding program.

The goal was to design and deploy a real full-stack cloud system using containers, Kubernetes, cloud infrastructure, and secure authentication.

Because MindX OpenID requires HTTPS, the project runs in two environments:

1. Learning environment using AKS + Ingress (HTTP, test JWT authentication)
2. Production environment using HTTPS (real MindX OpenID authentication)

   * Backend hosted on Azure Web App Service
   * Frontend hosted on Vercel

This allows both infrastructure learning and real authentication to be demonstrated.

---

## 1. Setup and Infrastructure

### 1.1 Backend

A Node.js API was created to handle:

* Health checks
* Protected routes
* Authentication logic
* Token verification

The backend was containerized and stored in Azure Container Registry.

---

### 1.2 Frontend

A React application was created to:

* Display public and protected pages
* Handle login redirects
* Store and manage JWT tokens
* Communicate with the backend

The frontend was also containerized and pushed to Azure Container Registry.

---

### 1.3 Azure and Kubernetes

The system uses:

* Azure Container Registry to store images
* Azure Kubernetes Service to run containers
* Kubernetes Deployments and Services to manage workloads
* An NGINX Ingress Controller to expose the cluster

---

## 2. Deployment Flow

### 2.1 AKS + Ingress Environment (HTTP)

This environment was built to understand Kubernetes and routing.

* Both frontend and backend run inside AKS
* A single Ingress IP exposes the cluster
* Frontend is accessible via the public IP
* Backend health check is accessible at /health

Example:

* Frontend: [http://20.239.116.30](http://20.239.116.30)
* Backend: [http://20.239.116.30/health](http://20.239.116.30/health)

Authentication here uses test JWT tokens.

---

### 2.2 Production HTTPS Environment

Because OpenID requires HTTPS, a production environment was created:

* Backend deployed on Azure Web App Service
* Frontend deployed on Vercel

This version supports real MindX authentication and secure HTTPS traffic.

---

## 3. Authentication Flow

Two authentication systems were implemented.

### 3.1 Test JWT Authentication (AKS)

This is used in the AKS learning environment.

Flow:

1. User logs in (fake login)
2. Backend issues a JWT
3. Frontend stores the token
4. Token is sent in Authorization headers
5. Backend verifies token using middleware
6. Protected routes are unlocked

---

### 3.2 Real OpenID Authentication (MindX)

This is used in the HTTPS production environment.

Flow:

1. User clicks Login with MindX
2. Frontend redirects to backend login endpoint
3. Backend redirects to MindX OpenID
4. User logs in at MindX
5. MindX redirects back to backend callback
6. Backend exchanges code for ID token
7. Backend creates application JWT
8. Backend redirects back to frontend with token
9. Frontend stores token
10. Protected routes become accessible

Logout clears the token and ends the session.

---

## Final Notes

This project demonstrates:

* Cloud-native deployment
* Kubernetes orchestration
* Secure authentication
* Ingress routing
* Environment separation
* Production deployment readiness

It represents a real-world system architecture rather than a simple demo.

---
