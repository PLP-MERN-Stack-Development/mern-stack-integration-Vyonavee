import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import PostPage from './pages/PostPage'
import CreateEdit from './pages/CreateEdit'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from './context/AuthContext'

export default function App(){
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="container flex items-center justify-between py-4">
            <Link to="/" className="text-2xl font-bold">MERN Blog</Link>
            <nav className="flex gap-4 items-center">
              <Link to="/">Home</Link>
              <Link to="/create">Create</Link>
              <Link to="/login">Login</Link>
            </nav>
          </div>
        </header>
        <main className="container py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:id" element={<PostPage />} />
            <Route path="/create" element={<CreateEdit />} />
            <Route path="/edit/:id" element={<CreateEdit />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}
