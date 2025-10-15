"use client";

import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  SmartToy as AIIcon,
  AccountCircle as GuideIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useTranslation } from "@/hooks/useTranslation";
import { Chat, User } from "@/types";
import { aiChatKeys } from "@/hooks/api";
import { useQueryClient } from "@tanstack/react-query";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  chatHistory: Chat[];
  currentChatId?: string;
  user: User | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onProfileClick: () => void;
  variant?: "permanent" | "temporary";
  width?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  chatHistory,
  currentChatId,
  user,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onProfileClick,
  variant = "permanent",
  width = 280,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const truncateText = (text: string, maxLength: number = 30) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const sidebarContent = (
    <Box
      sx={{
        width: width,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      {/* New Chat Button */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={onNewChat}
          sx={{
            height: 48,
            borderRadius: 2,
          }}
        >
          {t("chat.newChat")}
        </Button>
      </Box>

      <Divider />

      {/* Chat History */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h6" color="text.secondary" fontSize="0.875rem">
            {t("chat.chatHistory")}
          </Typography>
        </Box>

        <List sx={{ flex: 1, overflow: "auto", px: 1 }}>
          {chatHistory.map((chat) => {
            const firstMessage = chat.messages[0];
            const preview = firstMessage ? firstMessage.content : "";
            const isSelected = chat.id === currentChatId;

            // Chat type icon and color
            const isAIChat = chat.chatType === "ai";
            const ChatTypeIcon = isAIChat ? AIIcon : GuideIcon;
            const chatTypeColor = isAIChat ? "info.main" : "success.main";

            return (
              <ListItem
                key={chat.id}
                disablePadding
                sx={{ mb: 0.5 }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await onDeleteChat(chat.id);
                      await queryClient.invalidateQueries({
                        queryKey: aiChatKeys.sessions(),
                      });
                    }}
                    sx={{
                      color: isSelected
                        ? "primary.contrastText"
                        : "text.secondary",
                      opacity: 0.7,
                      "&:hover": {
                        opacity: 1,
                        color: "error.main",
                      },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                }
              >
                <ListItemButton
                  selected={isSelected}
                  onClick={() => onSelectChat(chat.id)}
                  sx={{
                    borderRadius: 1,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    py: 1.5,
                    px: 2,
                    pr: 6,
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <ChatTypeIcon
                      sx={{
                        fontSize: 16,
                        opacity: 0.7,
                        color: isSelected ? "inherit" : chatTypeColor,
                      }}
                    />
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {truncateText(chat.title, 25)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.7,
                        fontSize: "0.75rem",
                      }}
                    >
                      {formatDate(chat.updatedAt)}
                    </Typography>
                  </Box>

                  {preview && (
                    <Typography
                      variant="caption"
                      sx={{
                        width: "100%",
                        opacity: 0.7,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "0.75rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {truncateText(preview, 40)}
                    </Typography>
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}

          {chatHistory.length === 0 && (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <ChatIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                시작할 새 채팅이 없습니다
              </Typography>
            </Box>
          )}
        </List>
      </Box>

      <Divider />

      {/* User Profile */}
      {user && (
        <Box sx={{ p: 2 }}>
          <ListItemButton
            onClick={onProfileClick}
            sx={{
              borderRadius: 1,
              p: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Avatar
              src={user.avatar}
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
              }}
            >
              {!user.avatar && <PersonIcon />}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {user.email}
              </Typography>
            </Box>
          </ListItemButton>
        </Box>
      )}
    </Box>
  );

  if (variant === "temporary") {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Box
      component="div"
      sx={{
        width: width,
        flexShrink: 0,

        borderRight: "1px solid",
        borderColor: "divider",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {sidebarContent}
    </Box>
  );
};
