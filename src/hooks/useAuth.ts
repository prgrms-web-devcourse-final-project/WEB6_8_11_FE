'use client';

import { useState, useEffect } from 'react';
import { User, AuthState, OAuthProvider } from '@/types';

// Mock user data for development
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '',
  joinDate: new Date('2024-01-01'),
  provider: 'google',
  userType: 'regular',
  nickname: 'JohnD',
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Check for existing authentication on mount
    const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';

    setAuthState({
      user: isLoggedIn ? mockUser : null,
      isAuthenticated: isLoggedIn,
      loading: false,
    });
  }, []);

  const login = async (provider: OAuthProvider): Promise<void> => {
    try {
      // In real implementation, handle OAuth flow here
      console.log(`Logging in with ${provider}`);

      // Mock successful login
      const loggedInUser: User = {
        ...mockUser,
        provider,
      };

      setAuthState({
        user: loggedInUser,
        isAuthenticated: true,
        loading: false,
      });

      localStorage.setItem('isAuthenticated', 'true');
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const logout = (): void => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });

    localStorage.removeItem('isAuthenticated');
  };

  const deleteAccount = async (): Promise<void> => {
    try {
      // In real implementation, call API to delete account
      console.log('Deleting account');

      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });

      localStorage.removeItem('isAuthenticated');
    } catch (error) {
      console.error('Account deletion failed:', error);
    }
  };

  return {
    ...authState,
    login,
    logout,
    deleteAccount,
  };
};