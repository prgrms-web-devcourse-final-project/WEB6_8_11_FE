'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProfilePage } from '@/components/profile/ProfilePage';
import { useAuth } from '@/hooks/useAuth';

export default function Profile() {
  const router = useRouter();
  const { user, logout, deleteAccount } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    router.push('/login');
  };

  const handleBack = () => {
    router.back();
  };

  if (!user) {
    return null;
  }

  return (
    <ProfilePage
      user={user}
      onLogout={handleLogout}
      onDeleteAccount={handleDeleteAccount}
      onBack={handleBack}
    />
  );
}