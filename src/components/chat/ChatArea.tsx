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
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { Chat, User } from "@/types";

interface ChatAreaProps {
  currentChat: Chat | null;
  user: User | null;
  onSendMessage: (message: string) => void;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  currentChat,
  user,
  onSendMessage,
  onMenuClick,
  showMenuButton = false,
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
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Chat Header */}
      <AppBar
        position="static"
        color="transparent"
        elevation={1}
        sx={{
          backgroundColor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
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
                    fontSize: "1.1rem",
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
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                새 채팅
              </Typography>
            )}
          </Box>

          {/* Language Selector */}
          <Box sx={{ ml: 2 }}>
            <LanguageSelector variant="default" />
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
          backgroundColor: "background.default",
        }}
      >
        <MessageList messages={currentChat?.messages || []} user={user} />

        {/* Message Input */}
        <Box sx={{ p: 2, pt: 0 }}>
          <MessageInput onSendMessage={onSendMessage} />
        </Box>
      </Box>
    </Box>
  );
};
