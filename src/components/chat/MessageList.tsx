"use client";

import React, { useEffect, useRef } from "react";
import { Box, Paper, Typography, Avatar, Stack } from "@mui/material";
import { Person as PersonIcon, SmartToy as BotIcon } from "@mui/icons-material";
import { Message, User, GuideProfile } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

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

// Extract first image URL from message content
const extractFirstImageUrl = (content: string): string | null => {
  // Priority 1: Markdown image syntax ![alt](url)
  const markdownImageMatch = content.match(/!\[.*?\]\((https?:\/\/[^\)]+)\)/);
  if (markdownImageMatch) return markdownImageMatch[1];

  // Priority 2: Plain image URL
  const urlMatch = content.match(
    /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?[^\s]*)?/i
  );
  if (urlMatch) return urlMatch[0];

  return null;
};

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

  // Extract first image URL from content
  const imageUrl = extractFirstImageUrl(message.content);

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
            "& p": {
              margin: "0.5em 0",
              "&:first-of-type": { marginTop: 0 },
              "&:last-of-type": { marginBottom: 0 },
            },
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              margin: "0.75em 0 0.5em",
              fontWeight: 600,
              "&:first-of-type": { marginTop: 0 },
            },
            "& ul, & ol": {
              margin: "0.5em 0",
              paddingLeft: "1.5em",
            },
            "& li": {
              margin: "0.25em 0",
            },
            "& code": {
              backgroundColor: isMyMessage
                ? "rgba(255, 255, 255, 0.15)"
                : "rgba(0, 0, 0, 0.08)",
              padding: "0.15em 0.4em",
              borderRadius: "3px",
              fontSize: "0.9em",
              fontFamily: "monospace",
            },
            "& pre": {
              margin: "0.5em 0",
              borderRadius: "6px",
              overflow: "auto",
              "& code": {
                backgroundColor: "transparent",
                padding: 0,
              },
            },
            "& a": {
              color: isMyMessage ? "inherit" : "primary.main",
              textDecoration: "underline",
              fontWeight: 500,
              "&:hover": {
                opacity: 0.8,
              },
            },
            "& blockquote": {
              borderLeft: isMyMessage
                ? "3px solid rgba(255, 255, 255, 0.3)"
                : "3px solid rgba(0, 0, 0, 0.2)",
              margin: "0.5em 0",
              paddingLeft: "1em",
              opacity: 0.9,
            },
            "& table": {
              borderCollapse: "collapse",
              width: "100%",
              margin: "0.5em 0",
            },
            "& th, & td": {
              border: isMyMessage
                ? "1px solid rgba(255, 255, 255, 0.3)"
                : "1px solid rgba(0, 0, 0, 0.2)",
              padding: "0.5em",
              textAlign: "left",
            },
            "& th": {
              fontWeight: 600,
              backgroundColor: isMyMessage
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
            },
            "& hr": {
              border: "none",
              borderTop: isMyMessage
                ? "1px solid rgba(255, 255, 255, 0.3)"
                : "1px solid rgba(0, 0, 0, 0.2)",
              margin: "1em 0",
            },
            "& img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: "4px",
              margin: "0.5em 0",
            },
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={isMyMessage ? oneDark : oneLight}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: "6px",
                      fontSize: "0.9em",
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              // Hide images in markdown - they will be displayed separately below
              img() {
                return null;
              },
            }}
          >
            {message.content}
          </ReactMarkdown>

          {/* Display extracted image at the bottom */}
          {imageUrl && (
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: isMyMessage
                  ? "1px solid rgba(255, 255, 255, 0.2)"
                  : "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <Box
                component="img"
                src={imageUrl}
                alt="Message attachment"
                sx={{
                  maxWidth: "100%",
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  display: "block",
                  objectFit: "contain",
                  maxHeight: "400px",
                }}
                onError={(e: any) => {
                  e.target.style.display = "none";
                }}
              />
            </Box>
          )}
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
