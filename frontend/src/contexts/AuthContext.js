import { createContext, useContext, useState, useEffect, useCallback  } from 'react';
import '../styles/views/AuthModal.css';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUser(decoded);
      } catch {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, [token]);

  const login = useCallback((newToken, userData = null) => {
    localStorage.setItem('token', newToken); 
    if (userData) {
      localStorage.setItem('currentUser', JSON.stringify(userData)); 
      setUser(userData);
    }
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');     
    localStorage.removeItem('currentUser');
  }, []);
  const value = { user, token, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};