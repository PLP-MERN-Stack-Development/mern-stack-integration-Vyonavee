import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postService } from '../api';
import { AuthContext } from '../context/AuthContext';

export default function PostView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    postService.getPost(id).then(setPost).catch(() => {});
  }, [id]);

  if (!post) return <div className="card">Loading...</div>;

  const handleDelete = () => {
    if (!confirm('Delete this post?')) return;
    postService.deletePost(post._id).then(() => navigate('/')).catch(() => {});
  };

  const imageUrl = post.featuredImage
    ? `http://localhost:5000/uploads/${post.featuredImage}`
    : 'https://via.placeholder.com/800x400?text=No+Image';

  return (
    <div>
      <div className="card">
        <img
          src={imageUrl}
          alt={post.title}
          style={{
            width: '100%',
            height: '400px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '15px',
          }}
        />
        <h2>{post.title}</h2>
        <p style={{ color: '#666' }}>{post.excerpt}</p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        <small>By {post.author?.name}</small>
      </div>

      {user && user.id === post.author?._id && (
        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
          <Link to={`/edit/${post._id}`} className="btn">Edit</Link>
          <button onClick={handleDelete} className="btn">Delete</button>
        </div>
      )}
    </div>
  );
}
