import { useState, useEffect } from 'react';
import API from '../services/api';

export default function usePosts({page=1, limit=10, search='', category=''} = {}) {
  const [data, setData] = useState({data:[], meta:{}});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    API.get('/posts', { params: { page, limit, search, category }})
      .then(r => setData(r.data))
      .catch(e => setError(e.message))
      .finally(()=>setLoading(false));
  }, [page,limit,search,category]);

  return { data, loading, error };
}
