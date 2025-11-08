import React, { useEffect, useState } from 'react';
import { postService } from '../api';
import PostCard from './PostCard';

export default function PostList() {
  const [data, setData] = useState({ posts: [], page:1, pages:1, total:0 });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    postService.getAllPosts(1, 10).then(d => { setData(d); setLoading(false); }).catch(()=>setLoading(false));
  }, []);

  if (loading) return <div className="card">Loading posts...</div>;
  if (!data.posts.length) return <div className="card">No posts yet</div>;

  return (
    <div>
      {data.posts.map(p => <PostCard key={p._id} post={p} />)}
      <div style={{textAlign:'center', marginTop:'1rem'}}>Page {data.page} of {data.pages}</div>
    </div>
  );
}
