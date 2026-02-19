# Project Management System (MongoDB Atlas)

This project is split into a **Frontend** (Next.js) and a **Backend** (Express + MongoDB).

## Folder Structure
- `/frontend`: Next.js application with Tailwind CSS.
- `/backend`: Node.js/Express server connecting to MongoDB Atlas.

## Setup Instructions

### 1. Database Setup
- Create a Cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Get your connection string and add it to `/backend/.env` as `MONGODB_URI`.

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend will run on `http://localhost:5001`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:3000`.

## Features
- Aesthetic Login & Signup pages.
- MongoDB Atlas integration using Mongoose.
- JWT authentication.
- Secure password hashing with `bcryptjs`.
- Project and Task management.
