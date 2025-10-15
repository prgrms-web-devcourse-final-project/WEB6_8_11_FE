"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Sidebar } from "./Sidebar";
import { ChatArea } from "./ChatArea";
import { GuideChatArea } from "./GuideChatArea";
import { Chat, User, Message, GuideProfile, ChatRating, convertLegacyLocationToName } from "@/types";
import {
  useGetAiChatSessions,
  useCreateAiChatSession,
  useGetAiChatMessages,
  useSendAiChatMessage,
  useDeleteAiChatSession,
  useGetChatRooms,
  useGetGuideById,
} from "@/hooks/api";
import { useRateGuideWithId, useDeleteChatRoom } from "@/hooks/api/useUserChat";
import type {
  SessionsResponse,
  SessionMessagesResponse,
  ChatRoomResponse,
} from "@/lib/generated";
import { useTranslation } from "@/hooks/useTranslation";

interface ChatPageProps {
  user: User;
  onProfileClick: () => void;
  initialChatId?: string;
}

/**
 * Convert API SessionsResponse to local Chat type (AI Chat)
 */
const convertSessionToChat = (
  session: SessionsResponse,
  messages: SessionMessagesResponse[] = [],
  aiChatLabel: string = "AI Chat"
): Chat => {
  return {
    id: `ai-${session.sessionId}` || "",
    title: session.sessionTitle || aiChatLabel,
    createdAt: new Date(),
    updatedAt: new Date(),
    chatType: "ai",
    isActive: true,
    messages: messages.map((msg, index) => ({
      id: index.toString(),
      content: msg.content || "",
      sender: msg.senderType === "USER" ? ("user" as const) : ("ai" as const),
      timestamp: new Date(),
    })),
  };
};

/**
 * Convert API ChatRoomResponse to local Chat type (Guide Chat)
 */
const convertRoomToChat = (
  room: ChatRoomResponse,
  guideChatLabel: string = "Guide Chat"
): Chat => {
  return {
    id: `guide-${room.id}` || "",
    title: room.title || guideChatLabel,
    createdAt: new Date(room.updatedAt),
    updatedAt: new Date(room.updatedAt),
    chatType: "guide",
    guideId: room.guideId?.toString(),
    isActive: true,
    messages: [],
  };
};

export const ChatPage: React.FC<ChatPageProps> = ({
  user,
  onProfileClick,
  initialChatId,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [currentChatId, setCurrentChatId] = useState<string>(
    initialChatId || ""
  );
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Fetch AI chat sessions
  const { data: sessionsResponse, isLoading: sessionsLoading } =
    useGetAiChatSessions();
  const sessions = sessionsResponse?.data?.data || [];

  // Fetch guide chat rooms
  const { data: roomsResponse, isLoading: roomsLoading } = useGetChatRooms();
  const rooms = roomsResponse?.data?.data?.rooms || [];

  // Extract chat type and ID from currentChatId
  const chatType = currentChatId?.startsWith("ai-")
    ? "ai"
    : currentChatId?.startsWith("guide-")
    ? "guide"
    : null;
  const numericChatId = currentChatId
    ? parseInt(currentChatId.replace(/^(ai|guide)-/, ""), 10)
    : undefined;

  // Fetch messages for current AI chat
  const { data: messagesResponse, isLoading: messagesLoading } =
    useGetAiChatMessages(numericChatId!, {
      enabled: !!numericChatId && chatType === "ai",
    });
  const messagesData = messagesResponse?.data?.data || [];

  // Mutations
  const createSession = useCreateAiChatSession({
    onSuccess: (response) => {
      const newSessionId = response.data?.data?.sessionId?.toString();
      if (newSessionId) {
        router.push(`/chat/ai-${newSessionId}`);
      }
    },
  });

  const sendMessage = useSendAiChatMessage(numericChatId!, {
    onSuccess: () => {
      // Messages will be automatically refetched due to query invalidation
    },
  });

  const deleteSession = useDeleteAiChatSession({
    onSuccess: () => {
      // Navigate to first available chat or create new one
      const allChats = [...aiChats, ...guideChats];
      if (allChats.length > 1) {
        const remaining = allChats.filter((c) => c.id !== currentChatId);
        const firstChat = remaining[0];
        if (firstChat?.id) {
          router.push(`/chat/${firstChat.id}`);
        }
      } else {
        router.push("/chat");
      }
    },
  });

  const deleteRoom = useDeleteChatRoom({
    onSuccess: () => {
      // Navigate to first available chat or create new one
      const allChats = [...aiChats, ...guideChats];
      if (allChats.length > 1) {
        const remaining = allChats.filter((c) => c.id !== currentChatId);
        const firstChat = remaining[0];
        if (firstChat?.id) {
          router.push(`/chat`);
        }
      } else {
        router.push("/chat");
      }
    },
  });

  const rateGuideMutation = useRateGuideWithId({
    onSuccess: () => {
      // Navigate to chat list after rating
      router.push("/chat");
    },
    onError: (error) => {
      console.error("Failed to rate guide:", error);
    },
  });

  // Convert sessions to Chat format
  const aiChats = useMemo(() => {
    if (!sessions) return [];
    return sessions.map((session) =>
      convertSessionToChat(session, [], t("chat.aiChat"))
    );
  }, [sessions, t]);

  // Convert rooms to Chat format
  const guideChats = useMemo(() => {
    if (!rooms) return [];
    return rooms.map((room) => convertRoomToChat(room, t("chat.guideChat")));
  }, [rooms, t]);

  // Merge and sort all chats by updatedAt
  const chatHistory = useMemo(() => {
    const allChats = [...aiChats, ...guideChats];
    return allChats.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }, [aiChats, guideChats]);

  // Current chat with messages
  const currentChat = useMemo(() => {
    if (!currentChatId) return null;

    if (chatType === "ai") {
      const session = sessions?.find(
        (s) => `ai-${s.sessionId}` === currentChatId
      );
      if (!session) return null;
      return convertSessionToChat(
        session,
        messagesData || [],
        t("chat.aiChat")
      );
    } else if (chatType === "guide") {
      const room = rooms?.find((r) => `guide-${r.id}` === currentChatId);
      if (!room) return null;
      return convertRoomToChat(room, t("chat.guideChat"));
    }

    return null;
  }, [sessions, rooms, currentChatId, messagesData, chatType, t]);

  // Set initial chat ID
  useEffect(() => {
    if (initialChatId) {
      setCurrentChatId(initialChatId);
    } else if (!currentChatId && chatHistory.length > 0) {
      // Auto-select first chat if no chat is selected
      const firstChat = chatHistory[0];
      if (firstChat?.id) {
        setCurrentChatId(firstChat.id);
        router.push(`/chat/${firstChat.id}`);
      }
    }
  }, [initialChatId, chatHistory, currentChatId, router]);

  const handleNewChat = async () => {
    try {
      await createSession.mutateAsync();
      if (isMobile) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  const handleSelectChat = (chatId: string) => {
    router.push(`/chat/${chatId}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentChatId || !numericChatId) {
      console.error("No chat selected");
      return;
    }

    // Only AI chat uses HTTP REST API
    // Guide chat uses WebSocket/STOMP in GuideChatArea
    if (chatType !== "ai") {
      console.warn("Guide chat handled by GuideChatArea");
      return;
    }

    try {
      await sendMessage.mutateAsync({ message: content });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleEndChat = async (
    rating: Omit<ChatRating, "id" | "createdAt">
  ) => {
    try {
      await rateGuideMutation.mutateAsync({
        guideId: parseInt(rating.guideId, 10),
        rating: rating.rating,
        comment: rating.review,
      });
    } catch (error) {
      console.error("Failed to end chat and rate guide:", error);
    }
  };

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const chatType = chatId?.startsWith("ai-")
        ? "ai"
        : chatId?.startsWith("guide-")
        ? "guide"
        : null;

      if (!chatType) return;

      const numericId = parseInt(chatId.replace(/^(ai|guide)-/, ""), 10);

      if (chatType === "ai") {
        await deleteSession.mutateAsync(numericId);
      } else if (chatType === "guide") {
        await deleteRoom.mutateAsync(numericId);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Get guide ID for guide chat
  const guideId =
    chatType === "guide" && currentChat?.guideId
      ? parseInt(currentChat.guideId, 10)
      : undefined;

  // Fetch guide info when in guide chat
  const { data: guideData } = useGetGuideById(guideId!, {
    enabled: !!guideId,
  });

  // Convert API guide data to GuideProfile
  const guideInfo: GuideProfile | undefined = useMemo(() => {
    if (chatType !== "guide" || !guideData?.data) return undefined;

    const guide = guideData.data;
    return {
      id: guide.id,
      email: guide.email,
      nickname: guide.nickname,
      profileImageUrl: guide.profileImageUrl,
      role: guide.role,
      location: convertLegacyLocationToName(guide.location),
      description: guide.description,
      name: guide.nickname,
      userType: "guide",
    };
  }, [chatType, guideData]);

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
        onDeleteChat={handleDeleteChat}
        onProfileClick={onProfileClick}
        variant={isMobile ? "temporary" : "permanent"}
      />

      {chatType === "guide" && guideInfo ? (
        <GuideChatArea
          currentChat={currentChat}
          guide={guideInfo}
          currentUser={user}
          onMenuClick={handleMenuClick}
          onEndChat={handleEndChat}
          showMenuButton={isMobile}
        />
      ) : (
        <ChatArea
          currentChat={currentChat}
          currentUser={user}
          onSendMessage={handleSendMessage}
          onMenuClick={handleMenuClick}
          showMenuButton={isMobile}
          isAiTyping={sendMessage.isPending}
        />
      )}
    </Box>
  );
};
