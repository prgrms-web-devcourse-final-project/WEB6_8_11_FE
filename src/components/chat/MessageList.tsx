"use client";

import React, { useEffect, useRef } from "react";
import { Box, Paper, Typography, Avatar, Stack } from "@mui/material";
import { Person as PersonIcon, SmartToy as BotIcon } from "@mui/icons-material";
import { Message, User, GuideProfile } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

interface MessageListProps {
  messages: Message[];
  currentUser: User | null;
  guide?: GuideProfile;
  typingMessage?: string;
}

interface MessageBubbleProps {
  message: Message;
  currentUser: User | null;
  guide?: GuideProfile;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUser,
  guide,
}) => {
  const isMyMessage = message.senderId
    ? message.senderId === Number(currentUser?.id)
    : message.sender === "user";
  const isAI = message.sender === "ai";

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMyMessage ? "row-reverse" : "row",
        alignItems: "flex-start",
        gap: 1,
        mb: 2,
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: isMyMessage
            ? "primary.main"
            : isAI
            ? "secondary.main"
            : "success.main",
        }}
        src={
          isMyMessage
            ? currentUser?.avatar
            : isAI
            ? undefined
            : guide?.profileImageUrl
        }
      >
        {isMyMessage ? (
          currentUser?.avatar ? null : (
            <PersonIcon sx={{ fontSize: 18 }} />
          )
        ) : isAI ? (
          <BotIcon sx={{ fontSize: 18 }} />
        ) : guide?.profileImageUrl ? null : (
          guide?.nickname.charAt(0) || "G"
        )}
      </Avatar>

      {/* Message Content */}
      <Box
        sx={{
          maxWidth: "70%",
          display: "flex",
          flexDirection: "column",
          alignItems: isMyMessage ? "flex-end" : "flex-start",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: isMyMessage
              ? "primary.main"
              : isAI
              ? "grey.100"
              : "success.100",
            color: isMyMessage
              ? "primary.contrastText"
              : isAI
              ? "text.primary"
              : "success.800",
            maxWidth: "100%",
            wordBreak: "break-word",
            ...(isMyMessage
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
              whiteSpace: "pre-wrap",
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
            fontSize: "0.75rem",
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
  currentUser,
  guide,
  typingMessage,
}) => {
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessage]);

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {messages.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          <Stack spacing={2} alignItems="center">
            <BotIcon sx={{ fontSize: 64, opacity: 0.3 }} />
            <Typography variant="h6" sx={{ opacity: 0.7 }}>
              {t("chat.welcome")}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {t("chat.welcomeMessage")}
            </Typography>
          </Stack>
        </Box>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            currentUser={currentUser}
            guide={guide}
          />
        ))
      )}

      {/* Typing Indicator */}
      {typingMessage && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 1,
            mb: 2,
          }}
        >
          {/* Avatar */}
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "secondary.main",
            }}
          >
            <BotIcon sx={{ fontSize: 18 }} />
          </Avatar>

          {/* Typing Bubble */}
          <Paper
            elevation={1}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "grey.100",
              borderBottomLeftRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 48,
              minWidth: 60,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {[0, 1, 2].map((index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "grey.500",
                    animation: "wave 1.1s ease-in-out infinite",
                    animationDelay: `${index * 0.15}s`,
                    "@keyframes wave": {
                      "0%, 60%, 100%": {
                        transform: "translateY(0)",
                      },
                      "30%": {
                        transform: "translateY(-8px)",
                      },
                    },
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Box>
      )}

      <div ref={messagesEndRef} />
    </Box>
  );
};
