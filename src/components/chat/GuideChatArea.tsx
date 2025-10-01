'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Alert,
  Button,
  Toolbar,
  AppBar,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  MoreVert as MoreVertIcon,
  CallEnd as CallEndIcon,
  Circle as CircleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Chat, User, GuideProfile, Message, TypingIndicator, ChatRating } from '@/types';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useSocket } from '@/hooks/useSocket';
import { ChatEndDialog } from '@/components/rating/ChatEndDialog';

interface GuideChatAreaProps {
  currentChat: Chat | null;
  user: User;
  guide: GuideProfile;
  onSendMessage: (content: string) => void;
  onMenuClick: () => void;
  onEndChat: (rating: Omit<ChatRating, 'id' | 'createdAt'>) => Promise<void>;
  showMenuButton?: boolean;
  websocketUrl?: string;
}

export const GuideChatArea: React.FC<GuideChatAreaProps> = ({
  currentChat,
  user,
  guide,
  onSendMessage,
  onMenuClick,
  onEndChat,
  showMenuButton = false,
  websocketUrl = 'ws://localhost:8080/chat',
}) => {
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [typingMessage, setTypingMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WebSocket 연결
  const {
    connectionStatus,
    messages: socketMessages,
    typingUsers,
    sendMessage: sendSocketMessage,
    sendTyping,
    markAsRead,
    connect,
    disconnect,
  } = useSocket({
    url: websocketUrl,
    userId: user.id,
    chatId: currentChat?.id || '',
    autoConnect: !!currentChat,
  });

  // 메시지를 합친 목록 (기존 메시지 + 실시간 메시지)
  const allMessages = React.useMemo(() => {
    const chatMessages = currentChat?.messages || [];
    const combined = [...chatMessages, ...socketMessages];
    return combined.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [currentChat?.messages, socketMessages]);

  // 타이핑 표시 메시지 생성
  useEffect(() => {
    const guideTyping = typingUsers.find(user => user.userId === guide.id);
    if (guideTyping && guideTyping.isTyping) {
      setTypingMessage(`${guide.nickname}님이 입력 중입니다...`);
    } else {
      setTypingMessage('');
    }
  }, [typingUsers, guide.id, guide.nickname]);

  // 메시지 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages, typingMessage]);

  // 메시지 읽음 처리
  useEffect(() => {
    const unreadMessages = allMessages.filter(
      msg => msg.sender === 'guide' && !msg.readAt
    );

    unreadMessages.forEach(msg => {
      markAsRead(msg.id);
    });
  }, [allMessages, markAsRead]);

  const handleSendMessage = (content: string) => {
    if (connectionStatus.isConnected && currentChat?.chatType === 'guide') {
      // WebSocket으로 실시간 전송
      sendSocketMessage(content);
    } else {
      // 기존 AI 채팅 방식
      onSendMessage(content);
    }
  };

  const handleInputChange = (value: string) => {
    if (connectionStatus.isConnected) {
      // 타이핑 상태 전송 (디바운싱)
      if (value.length > 0) {
        sendTyping(true);
      } else {
        sendTyping(false);
      }
    }
  };

  const handleEndChat = () => {
    setEndDialogOpen(true);
  };

  const handleSubmitRating = async (rating: Omit<ChatRating, 'id' | 'createdAt'>) => {
    await onEndChat(rating);
    setEndDialogOpen(false);
    disconnect();
  };

  if (!currentChat) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50',
        }}
      >
        <Typography variant="body1" color="text.secondary">
          가이드를 선택하여 채팅을 시작하세요
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Chat Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          {showMenuButton && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={onMenuClick}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Guide Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <CircleIcon
                  sx={{
                    color: guide.isOnline ? 'success.main' : 'grey.400',
                    fontSize: 16,
                    bgcolor: 'background.paper',
                    borderRadius: '50%',
                  }}
                />
              }
            >
              <Avatar src={guide.profileImage} sx={{ width: 40, height: 40, mr: 2 }}>
                {guide.nickname.charAt(0)}
              </Avatar>
            </Badge>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {guide.nickname}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircleIcon
                  sx={{
                    color: connectionStatus.isConnected
                      ? guide.isOnline ? 'success.main' : 'warning.main'
                      : 'error.main',
                    fontSize: 12,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {connectionStatus.isConnected
                    ? guide.isOnline ? '온라인' : '오프라인'
                    : '연결 중...'}
                </Typography>
              </Box>
            </Box>

            {/* Specialties */}
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              {guide.specialties.slice(0, 2).map((specialty, index) => (
                <Chip
                  key={index}
                  label={specialty}
                  size="small"
                  variant="outlined"
                  sx={{ height: 24, fontSize: '0.75rem' }}
                />
              ))}
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit">
              <InfoIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={handleEndChat}
              disabled={!currentChat.isActive}
            >
              <CallEndIcon />
            </IconButton>
            <IconButton color="inherit">
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Connection Status Alert */}
      {!connectionStatus.isConnected && currentChat.chatType === 'guide' && (
        <Alert
          severity="warning"
          action={
            <Button color="inherit" size="small" onClick={connect}>
              재연결
            </Button>
          }
        >
          연결이 끊어졌습니다. 재연결을 시도 중입니다... ({connectionStatus.reconnectAttempts}/5)
        </Alert>
      )}

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <MessageList
          messages={allMessages}
          currentUser={user}
          guide={currentChat.chatType === 'guide' ? guide : undefined}
          typingMessage={typingMessage}
        />
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onInputChange={handleInputChange}
        disabled={!currentChat.isActive || (!connectionStatus.isConnected && currentChat.chatType === 'guide')}
        placeholder={
          currentChat.chatType === 'guide'
            ? connectionStatus.isConnected
              ? `${guide.nickname}님에게 메시지를 보내세요...`
              : '연결을 기다리는 중...'
            : '메시지를 입력하세요...'
        }
      />

      {/* Chat End Dialog */}
      <ChatEndDialog
        open={endDialogOpen}
        onClose={() => setEndDialogOpen(false)}
        guide={guide}
        chatId={currentChat.id}
        onSubmitRating={handleSubmitRating}
      />
    </Box>
  );
};