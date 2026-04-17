# 🌐 Cloud Attack Path Visualizer using Graph-Based Permission Modelling and Risk Prediction (CAPV)

A web application to detect cloud attack paths using graph algorithms, calculate risk, and identify critical vulnerabilities.

--------------------------------------------------

## 🛠️ TECHNOLOGIES

Frontend: React, Axios, Cytoscape.js  
Backend: Flask, Flask-JWT-Extended, NetworkX, SQLAlchemy  
Database: SQLite  

--------------------------------------------------

## 📦 INSTALLATION & RUN

### 1️⃣ Clone Project

git clone https://github.com/yourusername/cloud-attack-visualizer.git  
cd cloud-attack-visualizer  

--------------------------------------------------

### 2️⃣ BACKEND SETUP

cd backend  

# (optional virtual environment)
python -m venv venv  
venv\Scripts\activate  

# install libraries
pip install flask flask-cors flask-jwt-extended flask-sqlalchemy networkx werkzeug  

# run backend
python app.py  

👉 Runs on: http://localhost:5000  

--------------------------------------------------

### 3️⃣ FRONTEND SETUP

cd ../frontend  

# install dependencies
npm install  

# run frontend
npm start  

👉 Runs on: http://localhost:3000  

--------------------------------------------------

## 📊 SAMPLE INPUT

{
  "resources": [
    {"id": "EC2-1", "public": true, "privilege": 2, "sensitivity": 2},
    {"id": "IAM-Admin", "privilege": 5, "sensitivity": 3},
    {"id": "S3-1", "privilege": 3, "sensitivity": 4},
    {"id": "DB-1", "privilege": 5, "sensitivity": 5}
  ],
  "connections": [
    {"from": "EC2-1", "to": "IAM-Admin"},
    {"from": "IAM-Admin", "to": "S3-1"},
    {"from": "S3-1", "to": "DB-1"}
  ]
}

--------------------------------------------------

## ⚙️ WORKING

1. Login → get JWT token  
2. Send data to /analyze  
3. Graph is created using NetworkX  
4. DFS finds attack paths  
5. Risk = privilege × sensitivity  
6. Critical path = highest risk  
7. Result displayed & stored  

--------------------------------------------------

## 🚀 RUN SUMMARY

Backend → python app.py  
Frontend → npm start  

