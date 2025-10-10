'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { getRegisterToken } from '@/lib/api/request';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, loading, isNewUser } = useAuth();

  useEffect(() => {
    // Check if user has registerToken (new user who hasn't selected role)
    const registerToken = getRegisterToken();
    if (registerToken) {
      router.push('/select-role');
      return;
    }

    // Check if user is authenticated but hasn't selected role (PENDING state)
    if (!loading && isAuthenticated && isNewUser) {
      router.push('/select-role');
      return;
    }

    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, isNewUser, router]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};