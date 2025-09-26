'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
  DeleteForever as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useTranslation } from '@/hooks/useTranslation';
import { Layout } from '@/components/common/Layout';
import { User } from '@/types';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onLogout,
  onDeleteAccount,
  onBack,
}) => {
  const { t } = useTranslation();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getProviderDisplayName = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'Google';
      case 'kakao':
        return 'Kakao';
      case 'naver':
        return 'Naver';
      default:
        return provider;
    }
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    onLogout();
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    onDeleteAccount();
  };

  return (
    <Layout showLanguageSelector>
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: 4,
        }}
      >
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ color: 'text.secondary' }}
          >
            {t('common.back')}
          </Button>
        </Box>

        {/* Profile Card */}
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: 'visible',
          }}
        >
          <CardContent
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* Profile Avatar */}
            <Avatar
              src={user.avatar}
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'primary.main',
                mb: 3,
                border: '4px solid',
                borderColor: 'background.paper',
                boxShadow: 3,
              }}
            >
              {!user.avatar && <PersonIcon sx={{ fontSize: 60 }} />}
            </Avatar>

            {/* User Information */}
            <Stack spacing={3} alignItems="center" sx={{ width: '100%', maxWidth: 400 }}>
              <Typography
                variant="h4"
                component="h1"
                fontWeight={600}
                textAlign="center"
                color="text.primary"
              >
                {user.name}
              </Typography>

              {/* User Details */}
              <Stack spacing={2} sx={{ width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                  }}
                >
                  <EmailIcon sx={{ color: 'text.secondary' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('profile.email')}
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                  }}
                >
                  <CalendarIcon sx={{ color: 'text.secondary' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('profile.joinDate')}
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatJoinDate(user.joinDate)}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                  }}
                >
                  <PersonIcon sx={{ color: 'text.secondary' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      로그인 방법
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {getProviderDisplayName(user.provider)}
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              <Divider sx={{ width: '100%', my: 2 }} />

              {/* Action Buttons */}
              <Stack spacing={2} sx={{ width: '100%' }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<LogoutIcon />}
                  onClick={() => setLogoutDialogOpen(true)}
                  sx={{
                    height: 48,
                    borderColor: 'orange.main',
                    color: 'orange.main',
                    '&:hover': {
                      borderColor: 'orange.dark',
                      backgroundColor: 'orange.50',
                    },
                  }}
                >
                  {t('auth.logout')}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{
                    height: 48,
                    borderColor: 'error.main',
                    color: 'error.main',
                    '&:hover': {
                      borderColor: 'error.dark',
                      backgroundColor: 'error.50',
                    },
                  }}
                >
                  {t('auth.deleteAccount')}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Logout Confirmation Dialog */}
        <Dialog
          open={logoutDialogOpen}
          onClose={() => setLogoutDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {t('auth.logout')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              정말로 로그아웃하시겠습니까?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setLogoutDialogOpen(false)}
              color="inherit"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleLogoutConfirm}
              color="primary"
              variant="contained"
            >
              {t('auth.logout')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Account Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ color: 'error.main' }}>
            {t('auth.deleteAccount')}
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              이 작업은 되돌릴 수 없습니다!
            </Alert>
            <DialogContentText>
              계정을 삭제하면 모든 채팅 기록과 개인정보가 영구적으로 삭제됩니다.
              정말로 계정을 삭제하시겠습니까?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              color="inherit"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              {t('auth.deleteAccount')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};