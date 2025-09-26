'use client';

import React, { useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Person as PersonIcon,
  SmartToy as BotIcon,
} from '@mui/icons-material';
import { Message, User } from '@/types';

interface MessageListProps {
  messages: Message[];
  user: User | null;
}

interface MessageBubbleProps {
  message: Message;
  user: User | null;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, user }) => {
  const isUser = message.sender === 'user';

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 1,
        mb: 2,
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: isUser ? 'primary.main' : 'secondary.main',
        }}
        src={isUser ? user?.avatar : undefined}
      >
        {isUser ? (
          user?.avatar ? null : <PersonIcon sx={{ fontSize: 18 }} />
        ) : (
          <BotIcon sx={{ fontSize: 18 }} />
        )}
      </Avatar>

      {/* Message Content */}
      <Box
        sx={{
          maxWidth: '70%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start',
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: isUser ? 'primary.main' : 'grey.100',
            color: isUser ? 'primary.contrastText' : 'text.primary',
            maxWidth: '100%',
            wordBreak: 'break-word',
            ...(isUser
              ? {
                  borderBottomRightRadius: 4,
                }
              : {
                  borderBottomLeftRadius: 4,
                }),
          }}
        >
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
            }}
          >
            {message.content}
          </Typography>
        </Paper>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mt: 0.5,
            mx: 1,
            fontSize: '0.75rem',
          }}
        >
          {formatTime(message.timestamp)}
        </Typography>
      </Box>
    </Box>
  );
};

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  user,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {messages.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          <Stack spacing={2} alignItems="center">
            <BotIcon sx={{ fontSize: 64, opacity: 0.3 }} />
            <Typography variant="h6" sx={{ opacity: 0.7 }}>
              안녕하세요! 👋
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              한국 여행에 대해 궁금한 것이 있으시면 언제든 물어보세요!
            </Typography>
          </Stack>
        </Box>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            user={user}
          />
        ))
      )}

      <div ref={messagesEndRef} />
    </Box>
  );
};