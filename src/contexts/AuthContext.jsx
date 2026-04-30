import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Axios defaults using environment variables
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email); // OAuth2 expects username
      formData.append('password', password);
      
      const response = await axios.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      await fetchUser();
      return true;
    } catch (error) {
      console.error("Login error", error);
      throw error.response?.data?.detail || "Login failed";
    }
  };

  const signup = async (email, password) => {
    try {
      await axios.post('/auth/signup', { email, password });
      return true;
    } catch (error) {
      let errorMsg = "Signup failed";
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          errorMsg = detail[0].msg || "Validation error";
        } else {
          errorMsg = detail;
        }
      }
      throw errorMsg;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
