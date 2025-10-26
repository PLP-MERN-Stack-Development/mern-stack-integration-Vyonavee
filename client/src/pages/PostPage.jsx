import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import AuthContext from "../context/AuthContext";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    API.get("/posts/" + id)
      .then((r) => setPost(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  function submitComment(e) {
    e.preventDefault();
    API.post(`/posts/${id}/comments`, {
      text: comment,
      authorName: user?.name || "Guest",
    })
      .then((r) => setPost(r.data))
      .catch(() => {});
    setComment("");
  }

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Not found</div>;

  return (
    <article className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {post.title}
      </h1>

      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt=""
          className="w-full rounded-lg mb-6 shadow-md"
        />
      )}

      <div
        className="prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <section className="mt-10">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Comments
        </h3>

        <ul className="space-y-3">
          {post.comments?.map((c, i) => (
            <li
              key={i}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
            >
              <span className="font-semibold">{c.authorName}:</span>{" "}
              {c.text}
            </li>
          ))}
        </ul>

        <form onSubmit={submitComment} className="mt-5 flex gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 p-2 border rounded text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Write a comment..."
          />
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Comment
          </button>
        </form>
      </section>
    </article>
  );
}
