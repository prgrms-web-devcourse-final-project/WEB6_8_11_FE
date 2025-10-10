import { useEffect, useRef, useCallback, useState } from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface StompSocketOptions {
  url: string;
  roomId: number;
  onMessage: (message: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  enabled?: boolean;
}

interface StompSocketReturn {
  isConnected: boolean;
  sendMessage: (content: string) => void;
  disconnect: () => void;
  reconnect: () => void;
}

/**
 * STOMP over SockJS hook for real-time guide chat communication
 *
 * @param options - Configuration options for STOMP connection
 * @returns Connection state and control functions
 */
export const useStompSocket = ({
  url,
  roomId,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
  enabled = true,
}: StompSocketOptions): StompSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!enabled || !roomId) return;

    // Clear any pending reconnection
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Create STOMP client with SockJS transport
    const client = new Client({
      webSocketFactory: () => new SockJS(url) as any,

      connectHeaders: {
        // Add JWT token from localStorage if available
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },

      debug: (str) => {
        if (process.env.NODE_ENV === "development") {
          console.log("[STOMP Debug]", str);
        }
      },

      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: (frame) => {
        console.log("[STOMP] Connected:", frame);
        setIsConnected(true);
        onConnect?.();

        // Subscribe to room topic
        const subscription = client.subscribe(
          `/topic/userchat/${roomId}`,
          (message: IMessage) => {
            try {
              const body = JSON.parse(message.body);
              onMessage(body);
            } catch (error) {
              console.error("[STOMP] Failed to parse message:", error);
              onError?.(error);
            }
          }
        );

        subscriptionRef.current = subscription;
      },

      onDisconnect: (frame) => {
        console.log("[STOMP] Disconnected:", frame);
        setIsConnected(false);
        subscriptionRef.current = null;
        onDisconnect?.();
      },

      onStompError: (frame) => {
        console.error("[STOMP] Error:", frame);
        setIsConnected(false);
        onError?.(frame);
      },

      onWebSocketClose: (event) => {
        console.log("[STOMP] WebSocket closed:", event);
        setIsConnected(false);

        // Auto-reconnect after 5 seconds
        if (enabled) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("[STOMP] Attempting to reconnect...");
            client.activate();
          }, 5000);
        }
      },

      onWebSocketError: (event) => {
        console.error("[STOMP] WebSocket error:", event);
        onError?.(event);
      },
    });

    clientRef.current = client;
    client.activate();
  }, [enabled, roomId, url, onMessage, onConnect, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    if (clientRef.current?.active) {
      subscriptionRef.current?.unsubscribe();
      clientRef.current.deactivate();
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(connect, 100);
  }, [connect, disconnect]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!clientRef.current?.connected) {
        console.error("[STOMP] Cannot send message: not connected");
        return;
      }

      try {
        clientRef.current.publish({
          destination: `/pub/userchat/${roomId}/messages`,
          body: JSON.stringify({ content }),
        });
      } catch (error) {
        console.error("[STOMP] Failed to send message:", error);
        onError?.(error);
      }
    },
    [roomId, onError]
  );

  // Connect on mount or when dependencies change
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    sendMessage,
    disconnect,
    reconnect,
  };
};
