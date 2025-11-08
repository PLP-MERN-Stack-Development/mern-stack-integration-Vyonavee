# MERN Blog — Week 4 Assignment

A full-stack MERN blog application built for the Week 4 MERN Stack Integration assignment.

## Features
- User registration and login (JWT)
- Create, read, update, delete posts
- Categories
- Image upload for featured images
- Comments on posts
- Pagination support
- Frontend built with React (Vite) and backend with Express + MongoDB

## Quick start (local)

### Prereqs
- Node.js v18+ and npm
- MongoDB running locally or a MongoDB URI

### Server
```bash
cd server
cp .env.example .env
# edit .env to set MONGODB_URI and JWT_SECRET
npm install
npm run dev

CLIENT
cd client
cp .env.example .env
# edit if necessary
npm install
npm run dev

Frontend will run on http://localhost:5173 and backend API on http://localhost:5000/api.