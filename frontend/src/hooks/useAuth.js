import { useState, useEffect } from 'react';

// Placeholder authentication hook
// Will be implemented in Phase 2

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    // This will be implemented in Phase 2
    setIsAuthenticated(true);
    setUser({ name: 'John Doe', email: 'john@example.com' });
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Will be implemented in Phase 2
    console.log('Login', email, password);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    // Will be implemented in Phase 2
    console.log('Logout');
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, loading, login, logout };
};