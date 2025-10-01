'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { SocketMessage, Message, TypingIndicator, ConnectionStatus } from '@/types';

interface UseSocketOptions {
  url: string;
  userId: string;
  chatId: string;
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

interface UseSocketReturn {
  connectionStatus: ConnectionStatus;
  messages: Message[];
  typingUsers: TypingIndicator[];
  sendMessage: (content: string) => void;
  sendTyping: (isTyping: boolean) => void;
  markAsRead: (messageId: string) => void;
  connect: () => void;
  disconnect: () => void;
  clearMessages: () => void;
}

export const useSocket = ({
  url,
  userId,
  chatId,
  autoConnect = true,
  reconnectAttempts = 5,
  reconnectInterval = 3000,
}: UseSocketOptions): UseSocketReturn => {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    reconnectAttempts: 0,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const socket = new WebSocket(`${url}?userId=${userId}&chatId=${chatId}`);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus(prev => ({
          ...prev,
          isConnected: true,
          reconnectAttempts: 0,
        }));

        // 채팅방 참여 메시지 전송
        const joinMessage: SocketMessage = {
          type: 'join',
          data: { userId, chatId },
          timestamp: new Date(),
        };
        socket.send(JSON.stringify(joinMessage));
      };

      socket.onmessage = (event) => {
        try {
          const socketMessage: SocketMessage = JSON.parse(event.data);
          handleSocketMessage(socketMessage);
        } catch (error) {
          console.error('Failed to parse socket message:', error);
        }
      };

      socket.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setConnectionStatus(prev => ({
          ...prev,
          isConnected: false,
          lastSeen: new Date(),
        }));

        // 의도적인 종료가 아닌 경우 재연결 시도
        if (event.code !== 1000 && connectionStatus.reconnectAttempts < reconnectAttempts) {
          attemptReconnect();
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus(prev => ({
          ...prev,
          isConnected: false,
        }));
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      attemptReconnect();
    }
  }, [url, userId, chatId, reconnectAttempts, connectionStatus.reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (socketRef.current) {
      socketRef.current.close(1000, 'User disconnected');
      socketRef.current = null;
    }

    setConnectionStatus({
      isConnected: false,
      reconnectAttempts: 0,
    });
  }, []);

  const attemptReconnect = useCallback(() => {
    if (connectionStatus.reconnectAttempts >= reconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    setConnectionStatus(prev => ({
      ...prev,
      reconnectAttempts: prev.reconnectAttempts + 1,
    }));

    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`Attempting to reconnect (${connectionStatus.reconnectAttempts + 1}/${reconnectAttempts})`);
      connect();
    }, reconnectInterval);
  }, [connectionStatus.reconnectAttempts, reconnectAttempts, reconnectInterval, connect]);

  const handleSocketMessage = (socketMessage: SocketMessage) => {
    switch (socketMessage.type) {
      case 'message':
        const newMessage: Message = socketMessage.data;
        setMessages(prev => {
          // 중복 메시지 방지
          if (prev.some(msg => msg.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        });
        break;

      case 'typing':
        const typingData: TypingIndicator = socketMessage.data;
        setTypingUsers(prev => {
          const filtered = prev.filter(user => user.userId !== typingData.userId);
          if (typingData.isTyping) {
            return [...filtered, typingData];
          }
          return filtered;
        });
        break;

      case 'read':
        const { messageId, readBy } = socketMessage.data;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { ...msg, readAt: new Date() }
              : msg
          )
        );
        break;

      case 'error':
        console.error('Socket error message:', socketMessage.data);
        break;

      default:
        console.log('Unknown socket message type:', socketMessage.type);
    }
  };

  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return;
    }

    const message: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    const socketMessage: SocketMessage = {
      type: 'message',
      data: message,
      timestamp: new Date(),
    };

    socketRef.current.send(JSON.stringify(socketMessage));

    // 낙관적 업데이트: 메시지를 즉시 UI에 추가
    setMessages(prev => [...prev, message]);
  }, []);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    // 이전 타이핑 타이머 클리어
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const typingMessage: SocketMessage = {
      type: 'typing',
      data: {
        userId,
        userName: 'Current User', // 실제로는 user context에서 가져와야 함
        isTyping,
      },
      timestamp: new Date(),
    };

    socketRef.current.send(JSON.stringify(typingMessage));

    // 타이핑 상태가 true인 경우, 3초 후 자동으로 false로 설정
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(false);
      }, 3000);
    }
  }, [userId]);

  const markAsRead = useCallback((messageId: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const readMessage: SocketMessage = {
      type: 'read',
      data: {
        messageId,
        readBy: userId,
      },
      timestamp: new Date(),
    };

    socketRef.current.send(JSON.stringify(readMessage));
  }, [userId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // 컴포넌트 마운트 시 자동 연결
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    connectionStatus,
    messages,
    typingUsers,
    sendMessage,
    sendTyping,
    markAsRead,
    connect,
    disconnect,
    clearMessages,
  };
};