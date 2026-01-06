import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check if user is already logged in (on page refresh)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 2. Login Function (Connects to Backend)
  const login = async (email, password) => {
    try {
      const res = await axios.post('https://swift-q.onrender.com/api/auth/login', { email, password });
      
      if (res.data.success) {
        // Save session
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return { success: true };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      return { success: false, message: "Server connection failed" };
    }
  };

  // 3. Register Function
  const register = async (userData) => {
    try {
      const res = await axios.post('https://swift-q.onrender.com/api/auth/register', userData);
      return res.data; // Returns { success: true/false, message: ... }
    } catch (error) {
      return { success: false, message: "Registration failed" };
    }
  };

  // 4. Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);