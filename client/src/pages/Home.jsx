import React, {useState} from 'react';
import usePosts from '../hooks/usePosts';
import { Link } from 'react-router-dom';

export default function Home(){
  const [search, setSearch] = useState('');
  const { data, loading } = usePosts({search, limit:10});
  const posts = data.data || [];
  return (
    <div>
      <div className="flex items-center mb-6">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search posts..." className="flex-1 p-2 border rounded" />
        <Link to="/create" className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded">New</Link>
      </div>
      {loading && <div>Loading...</div>}
      <div className="grid gap-6">
        {posts.map(p => (
          <article key={p._id} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h2 className="text-xl font-semibold"><Link to={`/posts/${p._id}`}>{p.title}</Link></h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{p.category?.name} • {new Date(p.createdAt).toLocaleString()}</p>
            <p className="mt-2 line-clamp-3">{p.content?.slice(0,200)}...</p>
          </article>
        ))}
      </div>
    </div>
  )
}
