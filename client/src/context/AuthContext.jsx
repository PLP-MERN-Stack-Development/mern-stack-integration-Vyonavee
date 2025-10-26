import React, { createContext, useState, useEffect } from 'react';
const AuthContext = createContext();
export function AuthProvider({children}){
  const [user, setUser] = useState(()=> {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  });
  useEffect(()=> { localStorage.setItem('user', JSON.stringify(user)) }, [user]);
  const login = (payload) => setUser(payload);
  const logout = () => { setUser(null); localStorage.removeItem('token'); localStorage.removeItem('user'); }
  return <AuthContext.Provider value={{user, login, logout}}>{children}</AuthContext.Provider>
}
export default AuthContext;
