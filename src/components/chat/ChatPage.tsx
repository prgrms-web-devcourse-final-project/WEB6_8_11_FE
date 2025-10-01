"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Sidebar } from "./Sidebar";
import { ChatArea } from "./ChatArea";
import { Chat, User, Message } from "@/types";

interface ChatPageProps {
  user: User;
  onProfileClick: () => void;
  initialChatId?: string;
}

// Mock data for development
const mockChats: Chat[] = [
  {
    id: "1",
    title: "서울 관광 명소 추천",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    chatType: "ai",
    isActive: true,
    messages: [
      {
        id: "1",
        content: "서울에서 가볼 만한 관광 명소를 추천해 주세요.",
        sender: "user",
        timestamp: new Date("2024-01-15T10:00:00"),
      },
      {
        id: "2",
        content:
          "서울의 대표적인 관광 명소를 추천해드릴게요! 🏰\n\n1. 경복궁 - 조선왕조의 정궁\n2. 명동 - 쇼핑과 먹거리의 중심지\n3. 남산타워 - 서울의 전경을 한눈에\n4. 홍대 - 젊음과 문화의 거리\n5. 강남 - 현대적인 서울의 모습\n\n어떤 곳에 더 관심이 있으신가요?",
        sender: "ai",
        timestamp: new Date("2024-01-15T10:01:00"),
      },
    ],
  },
  {
    id: "2",
    title: "한국 음식 추천",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
    chatType: "ai",
    isActive: true,
    messages: [
      {
        id: "3",
        content: "한국 음식 중에 꼭 먹어봐야 할 음식은 뭐가 있을까요?",
        sender: "user",
        timestamp: new Date("2024-01-14T15:00:00"),
      },
    ],
  },
  {
    id: "3",
    title: "김민수 가이드와 채팅",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    chatType: "guide",
    guideId: "guide1",
    isActive: true,
    messages: [
      {
        id: "4",
        content:
          "안녕하세요! 서울 여행에 대해 궁금한 것이 있으시면 언제든 물어보세요.",
        sender: "guide",
        timestamp: new Date("2024-01-20T14:00:00"),
      },
      {
        id: "5",
        content: "안녕하세요! 경복궁 주변에서 점심 먹기 좋은 곳이 있을까요?",
        sender: "user",
        timestamp: new Date("2024-01-20T14:05:00"),
      },
    ],
  },
];

export const ChatPage: React.FC<ChatPageProps> = ({
  user,
  onProfileClick,
  initialChatId,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [chatHistory, setChatHistory] = useState<Chat[]>(mockChats);
  const [currentChatId, setCurrentChatId] = useState<string>(
    initialChatId || "1"
  );
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const currentChat =
    chatHistory.find((chat) => chat.id === currentChatId) || null;

  useEffect(() => {
    if (initialChatId) {
      setCurrentChatId(initialChatId);
    }
  }, [initialChatId]);

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat: Chat = {
      id: newChatId,
      title: "새 채팅",
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      chatType: "ai",
      isActive: true,
    };

    setChatHistory((prev) => [newChat, ...prev]);
    router.push(`/chat/${newChatId}`);

    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleSelectChat = (chatId: string) => {
    router.push(`/chat/${chatId}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentChatId) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `AI 응답: ${content}에 대한 답변입니다. 더 궁금한 것이 있으시면 언제든 물어보세요!`,
      sender: "ai",
      timestamp: new Date(),
    };

    setChatHistory((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage, aiMessage],
              title:
                chat.messages.length === 0 ? content.slice(0, 30) : chat.title,
              updatedAt: new Date(),
            }
          : chat
      )
    );
  };

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <Box sx={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <Sidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        user={user}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onProfileClick={onProfileClick}
        variant={isMobile ? "temporary" : "permanent"}
      />

      <ChatArea
        currentChat={currentChat}
        currentUser={user}
        onSendMessage={handleSendMessage}
        onMenuClick={handleMenuClick}
        showMenuButton={isMobile}
      />
    </Box>
  );
};
