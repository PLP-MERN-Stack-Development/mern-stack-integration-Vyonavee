import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav">
      <div><Link to="/"><strong>MERN Blog</strong></Link></div>
      <div>
        <Link to="/">Home</Link>
        {user && <Link to="/new">New Post</Link>}
        {user ? (
          <>
            <span style={{marginLeft: '1rem'}}>Hi, {user.name}</span>
            <button className="btn" style={{marginLeft: '0.5rem'}} onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{marginLeft: '1rem'}}>Login</Link>
            <Link to="/register" style={{marginLeft: '0.5rem'}}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
