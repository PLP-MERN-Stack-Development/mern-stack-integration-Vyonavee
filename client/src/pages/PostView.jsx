import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postService } from '../api';
import { AuthContext } from '../context/AuthContext';

export default function PostView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    postService.getPost(id).then(res => setPost(res.post)).catch(() => {});
  }, [id]);

  if (!post) return <div className="card">Loading...</div>;

  const handleDelete = () => {
    if (!confirm('Delete this post?')) return;
    postService.deletePost(post._id).then(() => navigate('/')).catch(() => {});
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const res = await postService.addComment(post._id, { content: comment });
    setPost(res.post); // update post with new comments
    setComment('');
  };

  const imageUrl = post.featuredImage
    ? `http://localhost:5000/uploads/${post.featuredImage}`
    : 'https://via.placeholder.com/800x400?text=No+Image';

  return (
    <div>
      <div className="card">
        <img src={imageUrl} alt={post.title} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />
        <h2>{post.title}</h2>
        <p style={{ color: '#666' }}>{post.excerpt}</p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        <small style={{ display: 'block', marginTop: '10px' }}>
          By {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
        </small>
      </div>

      {user && user.id === post.author?._id && (
        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
          <Link to={`/edit/${post._id}`} className="btn">Edit</Link>
          <button onClick={handleDelete} className="btn">Delete</button>
        </div>
      )}

      {/* Comment Section */}
      <div className="card" style={{ marginTop: '1rem' }}>
        <h3>Comments</h3>
        {post.comments.length === 0 && <p>No comments yet</p>}
        {post.comments.map((c, idx) => (
          <div key={idx} style={{ borderTop: '1px solid #eee', padding: '5px 0' }}>
            <strong>{c.user?.name || 'Anonymous'}:</strong> {c.content}
          </div>
        ))}

        {user && (
          <form onSubmit={handleComment} style={{ marginTop: '10px' }}>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} style={{ width: '100%' }} placeholder="Add a comment..." />
            <button type="submit" className="btn" style={{ marginTop: '5px' }}>Post Comment</button>
          </form>
        )}
      </div>
    </div>
  );
}
