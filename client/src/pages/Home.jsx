import React, { useState } from "react";
import usePosts from "../hooks/usePosts";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const [search, setSearch] = useState("");
  const { data, loading } = usePosts({ search, limit: 10 });
  const posts = data.data || [];

  return (
    <div className="space-y-16">
      {/* 🌅 Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-100 via-pink-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-lg">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 flex flex-col items-center text-center py-24 px-6">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
          >
            BLOGGERS TEA SPOT ✨
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl"
          >
            Get to connect with besties from  all around the world.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10"
          >
            <Link
              to="/create"
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full text-lg shadow-md hover:shadow-xl transition-all duration-300"
            >
              Write Your Story
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 🔍 Search and Posts */}
      <section>
        <div className="flex items-center mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="flex-1 p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-full shadow-sm focus:ring-2 focus:ring-rose-400 outline-none"
          />
        </div>

        {loading && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading posts...
          </div>
        )}

        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10"
        >
          {posts.map((p, i) => (
            <motion.article
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {p.image && (
                <img
                  src={`http://localhost:5000${p.image}`}
                  alt={p.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  <Link to={`/posts/${p._id}`}>{p.title}</Link>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {p.category?.name || "Uncategorized"} •{" "}
                  {new Date(p.createdAt).toLocaleString()}
                </p>
                <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                  {p.content?.slice(0, 200)}...
                </p>
                <Link
                  to={`/posts/${p._id}`}
                  className="inline-block mt-4 text-rose-500 hover:text-rose-600 font-medium"
                >
                  Read More →
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
