'use client';

import React from 'react';
import {
  Button,
  Typography,
  Stack,
} from '@mui/material';
import { useTranslation } from '@/hooks/useTranslation';
import { OAuthProvider } from '@/types';
import { GoogleIcon } from './GoogleIcon';
import { KakaoIcon } from './KakaoIcon';
import { NaverIcon } from './NaverIcon';

interface OAuthButtonsProps {
  onOAuthLogin: (provider: OAuthProvider) => void;
  loading?: boolean;
}

const oauthProviders: {
  provider: OAuthProvider;
  name: string;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  hoverBackgroundColor: string;
  icon: React.ComponentType<any>;
}[] = [
  {
    provider: 'google',
    name: 'Google',
    backgroundColor: '#ffffff',
    textColor: '#1f1f1f',
    borderColor: '#dadce0',
    hoverBackgroundColor: '#f8f9fa',
    icon: GoogleIcon,
  },
  {
    provider: 'kakao',
    name: 'Kakao',
    backgroundColor: '#fee500',
    textColor: '#000000',
    hoverBackgroundColor: '#fdd835',
    icon: KakaoIcon,
  },
  {
    provider: 'naver',
    name: 'Naver',
    backgroundColor: '#03c75a',
    textColor: '#ffffff',
    hoverBackgroundColor: '#02b350',
    icon: NaverIcon,
  },
];

export const OAuthButtons: React.FC<OAuthButtonsProps> = ({
  onOAuthLogin,
  loading = false,
}) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 300 }}>
      {oauthProviders.map((provider) => {
        const IconComponent = provider.icon;

        return (
          <Button
            key={provider.provider}
            variant="outlined"
            size="large"
            disabled={loading}
            onClick={() => onOAuthLogin(provider.provider)}
            sx={{
              height: 56,
              backgroundColor: provider.backgroundColor,
              color: provider.textColor,
              borderColor: provider.borderColor || provider.backgroundColor,
              borderRadius: 2,
              borderWidth: 1,
              '&:hover': {
                backgroundColor: provider.hoverBackgroundColor,
                borderColor: provider.borderColor || provider.backgroundColor,
              },
              '&.Mui-disabled': {
                backgroundColor: provider.backgroundColor,
                color: provider.textColor,
                opacity: 0.6,
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              textTransform: 'none',
            }}
          >
            <IconComponent sx={{ width: 20, height: 20 }} />
            <Typography variant="body1" fontWeight={500} color="inherit">
              {t('auth.loginWith', { provider: provider.name })}
            </Typography>
          </Button>
        );
      })}
    </Stack>
  );
};