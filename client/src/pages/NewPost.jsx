import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { postService } from '../api';

export default function NewPost() {
  const navigate = useNavigate();

  const onSubmit = async (form) => {
    try {
      // Create a new post via API
      const response = await postService.createPost(form);

      // Extract the actual post object
      const createdPost = response.post;

      // Navigate to the new post page
      navigate(`/posts/${createdPost._id}`);
    } catch (err) {
      console.error('Error creating post:', err);
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
