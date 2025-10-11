"use client";

import React from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Chat, User } from "@/types";

interface ChatAreaProps {
  currentChat: Chat | null;
  currentUser: User | null;
  onSendMessage: (message: string) => void;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  isAiTyping?: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  currentChat,
  currentUser,
  onSendMessage,
  onMenuClick,
  showMenuButton = false,
  isAiTyping = false,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "background.default",
      }}
    >
      {/* Chat Header */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          backgroundColor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          {showMenuButton && (
            <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ flex: 1 }}>
            {currentChat ? (
              <Stack spacing={0.5}>
                <Typography
                  variant="h6"
                  component="h1"
                  sx={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {currentChat.title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <ScheduleIcon
                    sx={{
                      fontSize: 14,
                      color: "text.secondary",
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {formatDate(currentChat.createdAt)}
                  </Typography>
                </Box>
              </Stack>
            ) : (
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                새 채팅
              </Typography>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          px: { xs: 0, sm: 2, md: 3 },
          pt: 2,
        }}
      >
        <MessageList
          messages={currentChat?.messages || []}
          currentUser={currentUser}
          typingMessage={isAiTyping ? "AI가 응답을 작성하고 있습니다..." : undefined}
        />

        {/* Message Input */}
        <Box sx={{ py: 2, maxWidth: 800, width: "100%", mx: "auto" }}>
          <MessageInput onSendMessage={onSendMessage} />
        </Box>
      </Box>
    </Box>
  );
};
