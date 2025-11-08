import React from 'react';
import PostList from '../components/PostList';

export default function Home() {
  return (
    <div>
      <h1 style={{marginTop:'1rem'}}>Latest Posts</h1>
      <PostList />
    </div>
  );
}
