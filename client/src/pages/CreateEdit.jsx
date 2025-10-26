import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import AuthContext from '../context/AuthContext';

export default function CreateEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Fetch categories safely
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await API.get('/categories');
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.error('Categories response is not an array:', res.data);
          setCategories([]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      }
    }
    loadCategories();
  }, []);

  // ✅ Fetch post details if editing
  useEffect(() => {
    if (id) {
      API.get(`/posts/${id}`)
        .then((r) => {
          const p = r.data;
          setTitle(p.title || '');
          setContent(p.content || '');
          setCategory(p.category?._id || p.category || '');
        })
        .catch((err) => console.error('Error fetching post:', err));
    }
  }, [id]);

  // ✅ Handle form submission
  async function submit(e) {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('content', content);
      form.append('category', category);
      if (file) form.append('featuredImage', file);

      await API.request({
        url: '/posts' + (id ? '/' + id : ''),
        method: id ? 'put' : 'post',
        data: form,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/');
    } catch (err) {
      console.error('Error submitting post:', err);
      setError(err.response?.data?.error || err.message);
    }
  }

  if (!user) return <div className="text-center text-gray-600">Please login to create posts.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md text-black">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        {id ? 'Edit Post' : 'Create New Post'}
      </h1>

      <form onSubmit={submit} className="space-y-4">
        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          required
        />

        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          required
        >
          <option value="">Select category</option>
          {categories?.map((cat, idx) => (
            <option key={cat._id || idx} value={cat.name || ''}>
              {cat.name || 'Unnamed Category'}
            </option>
          ))}
        </select>

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          placeholder="Write your blog content here..."
          className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          required
        />

        {/* Image Upload */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 transition"
        >
          {id ? 'Update Post' : 'Publish Post'}
        </button>

        {error && <div className="text-red-500 text-center">{error}</div>}
      </form>
    </div>
  );
}
