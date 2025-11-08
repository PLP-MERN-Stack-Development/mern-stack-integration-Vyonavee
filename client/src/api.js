import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const postService = {
  getAllPosts: async (page = 1, limit = 10, category = null) => {
    let url = `/posts?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    const res = await api.get(url);
    return res.data;
  },
  getPost: async (idOrSlug) => (await api.get(`/posts/${idOrSlug}`)).data,
  createPost: async (postData) => {
    // postData may be FormData
    const headers = postData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const res = await api.post('/posts', postData, { headers });
    return res.data;
  },
  updatePost: async (id, postData) => {
    const headers = postData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const res = await api.put(`/posts/${id}`, postData, { headers });
    return res.data;
  },
  deletePost: async (id) => (await api.delete(`/posts/${id}`)).data,
  addComment: async (postId, commentData) => (await api.post(`/posts/${postId}/comments`, commentData)).data,
  searchPosts: async (query) => (await api.get(`/posts/search?q=${encodeURIComponent(query)}`)).data,
};

export const categoryService = {
  getAllCategories: async () => (await api.get('/categories')).data,
  createCategory: async (categoryData) => (await api.post('/categories', categoryData)).data,
};

export const authService = {
  register: async (userData) => (await api.post('/auth/register', userData)).data,
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  },
};

export default api;
