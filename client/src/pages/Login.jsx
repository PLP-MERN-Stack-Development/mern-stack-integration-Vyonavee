import React, {useState, useContext} from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [error,setError]=useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      login(res.data.user);
      navigate('/');
    } catch (err) { setError(err.response?.data?.error || err.message) }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border rounded" />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Login</button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  )
}
