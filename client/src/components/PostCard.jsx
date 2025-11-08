import React from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="card">
      <h3><Link to={`/posts/${post._id}`}>{post.title}</Link></h3>
      <p style={{color:'#666'}}>{post.excerpt}</p>
      <small>By {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}</small>
    </div>
  );
}
