"use client";

import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
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
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";

interface GuideChatAreaProps {
  currentChat: Chat | null;
  guide: GuideProfile;
  currentUser: User; // 현재 로그인한 사용자
  onMenuClick: () => void;
  onEndChat: (rating: Omit<ChatRating, "id" | "createdAt">) => Promise<void>;
  showMenuButton?: boolean;
  websocketUrl?: string;
}

const getDefaultWebSocketUrl = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  return `${baseUrl}/ws/userchat`;
};

export const GuideChatArea: React.FC<GuideChatAreaProps> = ({
  currentChat,
  guide,
  currentUser,
  onMenuClick,
  onEndChat,
  showMenuButton = false,
  websocketUrl = getDefaultWebSocketUrl(),
}) => {
  const { user: me } = useAuth();
  const { t, translateLocation } = useTranslation();

  // 채팅 상대방 결정: 내가 가이드면 currentUser(유저), 내가 유저면 guide
  const isGuide = me?.userType === "guide";
  const chatPartner = isGuide
    ? { nickname: currentUser.nickname || currentUser.name, avatar: currentUser.avatar }
    : { nickname: guide.nickname, avatar: guide.profileImageUrl };
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
      // message.data contains the actual message object
      const messageData = message.data;
      if (!messageData) return;

      const myRole = me?.userType === "guide" ? "guide" : "user";
      const otherRole = me?.userType === "guide" ? "user" : "guide";

      // Handle incoming real-time message
      const newMessage: Message = {
        id: messageData.id?.toString() || Date.now().toString(),
        content: messageData.content || "",
        senderId: messageData.senderId,
        sender: messageData.senderId === Number(me?.id) ? myRole : otherRole,
        timestamp: new Date(messageData.createdAt || Date.now()),
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.50",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {t("chat.selectGuide")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}
    >
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

          {/* Chat Partner Info */}
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Avatar
                src={chatPartner.avatar}
                sx={{ width: 40, height: 40, mr: 2 }}
              >
                {chatPartner.nickname?.charAt(0)}
              </Avatar>
            </Badge>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {chatPartner.nickname}
              </Typography>
            </Box>

            {/* Location - only show when viewing guide's profile */}
            {!isGuide && guide.location && (
              <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
                <Chip
                  label={translateLocation(guide.location)}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ height: 24, fontSize: "0.75rem" }}
                />
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleEndChat}
              size="small"
              disabled={!currentChat.isActive}
              sx={{ height: 36, fontSize: "0.75rem", px: "0.75rem" }}
            >
              {t("chat.endChat")}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Connection Status Alert */}
      {!isConnected && currentChat.chatType === "guide" && (
        <Alert severity="warning">
          {t("chat.reconnecting")}
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
          currentUser={currentUser}
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
              ? t("chat.messagePlaceholder", { name: guide.nickname })
              : t("chat.connecting")
            : t("chat.typeMessage")
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
