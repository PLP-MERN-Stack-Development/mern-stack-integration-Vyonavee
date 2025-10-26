import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import PostPage from './pages/PostPage'
import CreateEdit from './pages/CreateEdit'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  const location = useLocation()

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-all duration-500">
        {/* Header */}
        <header className="backdrop-blur-md bg-white/70 dark:bg-gray-800/60 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto flex items-center justify-between px-6 py-4">
            <Link 
              to="/" 
              className="text-3xl font-bold text-rose-500 hover:text-rose-600 transition duration-300"
            >
              ✨ MERN Blog
            </Link>

            <nav className="flex gap-6 items-center text-lg">
              <Link 
                to="/" 
                className="hover:text-rose-600 transition duration-300"
              >
                Home
              </Link>
              <Link 
                to="/create" 
                className="hover:text-rose-600 transition duration-300"
              >
                Create
              </Link>
              <div className="flex gap-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 bg-rose-500 text-white rounded-full shadow hover:bg-rose-600 transition-all duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full shadow hover:from-rose-500 hover:to-pink-600 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {/* Page transitions */}
        <main className="container mx-auto px-6 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/posts/:id" element={<PostPage />} />
                <Route path="/create" element={<CreateEdit />} />
                <Route path="/edit/:id" element={<CreateEdit />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 mt-10">
          <p className="text-sm">
            Made with ❤️ by Vyonavee✨
          </p>
        </footer>
      </div>
    </AuthProvider>
  )
}
