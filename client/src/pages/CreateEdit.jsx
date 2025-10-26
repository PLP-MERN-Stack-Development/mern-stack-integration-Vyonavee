import React, {useState, useEffect, useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import AuthContext from '../context/AuthContext';

export default function CreateEdit(){
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [title,setTitle] = useState(''); const [content,setContent]=useState(''); const [category,setCategory]=useState('');
  const [file,setFile] = useState(null); const [error,setError]=useState(null);

  useEffect(()=> {
    if (id) API.get('/posts/'+id).then(r=>{
      const p=r.data; setTitle(p.title); setContent(p.content); setCategory(p.category?._id||'');
    }).catch(()=>{});
  },[id]);

  async function submit(e){
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('title',title); form.append('content',content); form.append('category',category);
      if (file) form.append('featuredImage', file);
      const res = await API.request({ url: '/posts' + (id?('/'+id):''), method: id?'put':'post', data: form, headers: {'Content-Type':'multipart/form-data'} });
      navigate('/');
    } catch (err) { setError(err.response?.data?.error || err.message) }
  }

  if (!user) return <div>Please login to create posts.</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">{id ? 'Edit' : 'Create'} post</h1>
      <form onSubmit={submit} className="space-y-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
        <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category ID" className="w-full p-2 border rounded" />
        <textarea value={content} onChange={e=>setContent(e.target.value)} rows={10} placeholder="Content (HTML accepted)" className="w-full p-2 border rounded" />
        <input type="file" onChange={e=>setFile(e.target.files[0])} />
        <div><button className="px-4 py-2 bg-indigo-600 text-white rounded">{id?'Update':'Publish'}</button></div>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  )
}
