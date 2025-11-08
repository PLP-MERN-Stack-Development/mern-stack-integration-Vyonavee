import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { postService } from '../api';

export default function EditPost() {
  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    postService.getPost(id).then(setInitial).catch(()=>{});
  }, [id]);

  const onSubmit = async (form) => {
    try {
      const updated = await postService.updatePost(id, form);
      navigate(`/posts/${updated._id}`);
    } catch (err) {
      alert('Failed to update');
    }
  };

  if (!initial) return <div className="card">Loading...</div>;

  return (
    <div>
      <h1>Edit Post</h1>
      <PostForm initial={initial} onSubmit={onSubmit} />
    </div>
  );
}
