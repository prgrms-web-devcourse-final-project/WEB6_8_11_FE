'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChatPage } from '@/components/chat/ChatPage';
import { useAuth } from '@/hooks/useAuth';

export default function Chat() {
  const router = useRouter();
  const { user } = useAuth();

  const handleProfileClick = () => {
    router.push('/profile');
  };

  if (!user) {
    return null;
  }

  return <ChatPage user={user} onProfileClick={handleProfileClick} />;
}