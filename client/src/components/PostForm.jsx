import React, { useState, useEffect } from 'react';
import { categoryService } from '../api';

export default function PostForm({ initial = {}, onSubmit }) {
  const [title, setTitle] = useState(initial.title || '');
  const [content, setContent] = useState(initial.content || '');
  const [category, setCategory] = useState(initial.category?._id || '');
  const [excerpt, setExcerpt] = useState(initial.excerpt || '');
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState((initial.tags || []).join(', '));
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.getAllCategories().then(setCategories).catch(()=>{});
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', title);
    form.append('content', content);
    form.append('category', category);
    form.append('excerpt', excerpt);
    form.append('tags', tags);
    if (file) form.append('featuredImage', file);
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="card">
      <div className="form-row"><label>Title</label><input value={title} onChange={e=>setTitle(e.target.value)} /></div>
      <div className="form-row"><label>Excerpt</label><input value={excerpt} onChange={e=>setExcerpt(e.target.value)} /></div>
      <div className="form-row"><label>Category</label>
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="">Select category</option>
          {categories.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>
      <div className="form-row"><label>Content</label><textarea rows="8" value={content} onChange={e=>setContent(e.target.value)} /></div>
      <div className="form-row"><label>Tags (comma separated)</label><input value={tags} onChange={e=>setTags(e.target.value)} /></div>
      <div className="form-row"><label>Featured Image</label><input type="file" onChange={e=>setFile(e.target.files[0])} /></div>
      <div style={{textAlign:'right'}}><button className="btn btn-primary" type="submit">Publish</button></div>
    </form>
  );
}
