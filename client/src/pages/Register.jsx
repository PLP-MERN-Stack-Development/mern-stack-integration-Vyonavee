import React, { useState } from 'react';
import { authService } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Viewer'); // default role
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register({ name, email, password, role });
      alert('Registered successfully!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Register</h2>
      <div className="form-row">
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="form-row">
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="form-row">
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <div className="form-row">
        <label>Role</label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="Viewer">Viewer</option>
          <option value="Blogger">Blogger</option>
        </select>
      </div>
      <div style={{ textAlign: 'right' }}>
        <button type="submit" className="btn btn-primary">Register</button>
      </div>
    </form>
  );
}
