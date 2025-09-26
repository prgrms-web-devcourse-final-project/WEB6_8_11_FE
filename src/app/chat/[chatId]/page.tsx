'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChatPage } from '@/components/chat/ChatPage';
import { useAuth } from '@/hooks/useAuth';

export default function ChatDetail() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const chatId = params.chatId as string;

  const handleProfileClick = () => {
    router.push('/profile');
  };

  if (!user) {
    return null;
  }

  return <ChatPage user={user} onProfileClick={handleProfileClick} initialChatId={chatId} />;
}