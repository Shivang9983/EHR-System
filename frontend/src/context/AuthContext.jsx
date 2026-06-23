const API_URL = import.meta.env.VITE_API_URL;
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('user_token') || '');
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setApiError('Unable to connect to database server.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    setApiError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        setUser({
          _id: data._id,
          username: data.username,
          role: data.role,
        });
        localStorage.setItem('user_token', data.token);
        return { success: true };
      } else {
        setApiError(data.message || 'Login details incorrect.');
        return { success: false, message: data.message };
      }
    } catch (err) {
      setApiError('Unable to connect to MERN backend API.');
      return { success: false, message: 'Server unreachable' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, password, role) => {
    setLoading(true);
    setApiError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        setUser({
          _id: data._id,
          username: data.username,
          role: data.role,
        });
        localStorage.setItem('user_token', data.token);
        return { success: true };
      } else {
        setApiError(data.message || 'Registration failed.');
        return { success: false, message: data.message };
      }
    } catch (err) {
      setApiError('Unable to connect to MERN backend API.');
      return { success: false, message: 'Server unreachable' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('user_token');
  };

  const authFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
  ...options,
  headers,
});

    if (response.status === 401) {
      logout();
      throw new Error('Your session expired! Please log back in.');
    }

    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error: apiError,
        setError: setApiError,
        login,
        signup,
        logout,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
