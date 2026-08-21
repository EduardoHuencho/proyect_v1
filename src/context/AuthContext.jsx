import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || null);

  useEffect(() => {
    console.log('userId actual:', userId);
  }, [userId]);

  const login = (id) => {
    localStorage.setItem('userId', id);
    setUserId(id);
    console.log('userId actual:', id);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);