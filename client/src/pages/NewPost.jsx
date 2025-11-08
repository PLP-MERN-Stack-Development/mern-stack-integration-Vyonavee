import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { postService } from '../api';

export default function NewPost() {
  const navigate = useNavigate();
  const onSubmit = async (form) => {
    try {
      const post = await postService.createPost(form);
      navigate(`/posts/${post._id}`);
    } catch (err) {
      alert('Failed to create post');
    }
  };
  return (
    <div>
      <h1>New Post</h1>
      <PostForm onSubmit={onSubmit} />
    </div>
  );
}
