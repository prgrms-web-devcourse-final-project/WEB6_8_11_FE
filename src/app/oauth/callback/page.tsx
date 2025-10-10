'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { setRegisterToken, setAccessToken } from '@/lib/api/request';
import { useRefreshToken } from '@/hooks/api/useAuth';

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const refreshMutation = useRefreshToken();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract tokens from URL parameters
        const registerToken = searchParams.get('registerToken');
        const hasRefreshToken = searchParams.get('refreshToken') === 'true';

        if (registerToken) {
          // New user flow: Save registerToken and redirect to role selection
          setRegisterToken(registerToken);
          router.push('/select-role');
        } else if (hasRefreshToken) {
          // Existing user flow: Use refresh token to get access token
          try {
            const response = await refreshMutation.mutateAsync({ url: '/api/auth/refresh' });
            const accessToken = response.data?.data?.accessToken;

            if (accessToken) {
              setAccessToken(accessToken);
              // Redirect to intended page or default to chat
              const postLoginRedirect = localStorage.getItem('postLoginRedirect') || '/chat';
              localStorage.removeItem('postLoginRedirect');
              router.push(postLoginRedirect);
            } else {
              setError('액세스 토큰을 받을 수 없습니다.');
            }
          } catch (err) {
            console.error('Token refresh failed:', err);
            setError('토큰 갱신에 실패했습니다. 다시 로그인해주세요.');
            setTimeout(() => router.push('/login'), 2000);
          }
        } else {
          // No valid tokens found
          setError('유효한 인증 정보가 없습니다.');
          setTimeout(() => router.push('/login'), 2000);
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    handleCallback();
  }, [searchParams, router, refreshMutation]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        p: 3,
      }}
    >
      {error ? (
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {error}
        </Alert>
      ) : (
        <>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            로그인 처리 중...
          </Typography>
        </>
      )}
    </Box>
  );
}
