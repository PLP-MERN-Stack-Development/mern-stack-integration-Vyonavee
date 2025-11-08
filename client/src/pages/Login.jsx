import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.login({ email, password });
      login(data);
      navigate('/');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div style={{maxWidth:600, margin:'1rem auto'}}>
      <form className="card" onSubmit={submit}>
        <h2>Login</h2>
        <div className="form-row"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div className="form-row"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div style={{textAlign:'right'}}><button className="btn btn-primary" type="submit">Login</button></div>
      </form>
    </div>
  );
}
