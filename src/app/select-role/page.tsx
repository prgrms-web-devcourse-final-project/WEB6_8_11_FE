'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Alert } from '@mui/material';
import { RoleSelection } from '@/components/auth/RoleSelection';
import { VideoBackground } from '@/components/common/VideoBackground';
import { useSelectRole, type UserRole } from '@/hooks/api/useAuth';
import {
  getRegisterToken,
  clearRegisterToken,
  setAccessToken,
} from '@/lib/api/request';

export default function SelectRole() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const selectRoleMutation = useSelectRole({
    onSuccess: (response) => {
      const accessToken = response.data?.data?.accessToken;
      if (accessToken) {
        setAccessToken(accessToken);
        clearRegisterToken();

        // Redirect to intended page or default to chat
        const postLoginRedirect = localStorage.getItem('postLoginRedirect') || '/chat';
        localStorage.removeItem('postLoginRedirect');
        router.push(postLoginRedirect);
      }
    },
    onError: (err) => {
      console.error('Role selection failed:', err);
      setError('역할 선택에 실패했습니다. 다시 시도해주세요.');
    },
  });

  useEffect(() => {
    // Check if registerToken exists
    const registerToken = getRegisterToken();
    if (!registerToken) {
      // No registerToken, redirect to login
      router.push('/login');
    }
  }, [router]);

  const handleRoleSelect = async (role: UserRole) => {
    setError(null);
    try {
      await selectRoleMutation.mutateAsync({ role });
    } catch (err) {
      // Error already handled in onError
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <VideoBackground videoSrc="/background.mp4" overlayOpacity={0.6} />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        <Box
          sx={{
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <RoleSelection
            onSelectRole={handleRoleSelect}
            loading={selectRoleMutation.isPending}
          />
        </Box>
      </Container>
    </Box>
  );
}
