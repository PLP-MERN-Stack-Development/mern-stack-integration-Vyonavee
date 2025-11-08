import React from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const imageUrl = post.featuredImage
    ? `http://localhost:5000/uploads/${post.featuredImage}`
    : 'https://via.placeholder.com/600x400?text=No+Image'; // fallback image

  return (
    <div className="card">
      <Link to={`/posts/${post._id}`}>
        <img
          src={imageUrl}
          alt={post.title}
          style={{
            width: '100%',
            height: '250px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '10px',
          }}
        />
      </Link>
      <h3><Link to={`/posts/${post._id}`}>{post.title}</Link></h3>
      <p style={{ color: '#666' }}>{post.excerpt}</p>
      <small>By {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}</small>
    </div>
  );
}
