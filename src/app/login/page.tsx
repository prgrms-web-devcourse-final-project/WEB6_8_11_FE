'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginPage } from '@/components/auth/LoginPage';
import { useAuth } from '@/hooks/useAuth';
import { OAuthProvider } from '@/types';

export default function Login() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/chat');
    }
  }, [isAuthenticated, router]);

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    await login(provider);
  };

  return <LoginPage onOAuthLogin={handleOAuthLogin} />;
}