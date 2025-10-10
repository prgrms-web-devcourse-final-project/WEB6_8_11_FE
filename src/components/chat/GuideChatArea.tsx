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
import {
  Chat,
  User,
  GuideProfile,
  Message,
  ChatRating,
  convertChatMessageToMessage,
} from "@/types";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useStompSocket } from "@/hooks/useStompSocket";
import { useGetChatMessages } from "@/hooks/api/useUserChat";
import { ChatEndDialog } from "@/components/rating/ChatEndDialog";

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
  websocketUrl = "http://localhost:8080/ws/userchat",
}) => {
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract numeric room ID from currentChat.id (format: "guide-{roomId}")
  const roomId = currentChat?.id
    ? parseInt(currentChat.id.replace("guide-", ""), 10)
    : 0;

  // Fetch message history via HTTP
  const { data: messagesResponse } = useGetChatMessages(roomId, {
    enabled: !!roomId && roomId > 0,
  });

  // Convert API messages to local Message type
  const httpMessages = React.useMemo(() => {
    const apiMessages = messagesResponse?.data?.data || [];
    return apiMessages.map(convertChatMessageToMessage);
  }, [messagesResponse]);

  // STOMP WebSocket connection
  const { isConnected, sendMessage: sendStompMessage } = useStompSocket({
    url: websocketUrl,
    roomId: roomId,
    onMessage: (message) => {
      // Handle incoming real-time message
      const newMessage: Message = {
        id: message.id?.toString() || Date.now().toString(),
        content: message.content || "",
        sender:
          message.senderType === "GUIDE"
            ? ("guide" as const)
            : ("user" as const),
        timestamp: new Date(message.sentAt || Date.now()),
      };

      setRealtimeMessages((prev) => [...prev, newMessage]);
    },
    onConnect: () => {
      console.log("[GuideChatArea] STOMP connected");
    },
    onDisconnect: () => {
      console.log("[GuideChatArea] STOMP disconnected");
    },
    onError: (error) => {
      console.error("[GuideChatArea] STOMP error:", error);
    },
    enabled: !!roomId && roomId > 0,
  });

  // Merge HTTP messages + realtime messages
  const allMessages = React.useMemo(() => {
    const combined = [...httpMessages, ...realtimeMessages];
    // Remove duplicates by id
    const uniqueMessages = Array.from(
      new Map(combined.map((msg) => [msg.id, msg])).values()
    );
    return uniqueMessages.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [httpMessages, realtimeMessages]);

  // Reset realtime messages when chat changes
  useEffect(() => {
    setRealtimeMessages([]);
  }, [currentChat?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const handleSendMessage = (content: string) => {
    if (isConnected && roomId > 0) {
      sendStompMessage(content);
    } else {
      console.error("[GuideChatArea] Cannot send message: not connected");
    }
  };

  const handleEndChat = () => {
    setEndDialogOpen(true);
  };

  const handleSubmitRating = async (
    rating: Omit<ChatRating, "id" | "createdAt">
  ) => {
    await onEndChat(rating);
    setEndDialogOpen(false);
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
            >
              <Avatar src={guide.profileImageUrl} sx={{ width: 40, height: 40, mr: 2 }}>
                {guide.nickname.charAt(0)}
              </Avatar>
            </Badge>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {guide.nickname}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircleIcon
                  sx={{
                    color: isConnected ? "success.main" : "error.main",
                    fontSize: 12,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {isConnected ? "연결됨" : "연결 중..."}
                </Typography>
              </Box>
            </Box>

            {/* Location */}
            {guide.location && (
              <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                <Chip
                  label={guide.location}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ height: 24, fontSize: '0.75rem' }}
                />
              </Box>
            )}
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
      {!isConnected && currentChat.chatType === "guide" && (
        <Alert severity="warning">
          연결이 끊어졌습니다. 재연결을 시도 중입니다...
        </Alert>
      )}

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MessageList
          messages={allMessages}
          currentUser={user}
          guide={currentChat.chatType === "guide" ? guide : undefined}
        />
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={
          !currentChat.isActive ||
          (!isConnected && currentChat.chatType === "guide")
        }
        placeholder={
          currentChat.chatType === "guide"
            ? isConnected
              ? `${guide.nickname}님에게 메시지를 보내세요...`
              : "연결을 기다리는 중..."
            : "메시지를 입력하세요..."
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