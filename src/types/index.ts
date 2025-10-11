// Location enum types (matches API spec)
export type LocationCode =
  | "SEOUL"
  | "BUSAN"
  | "DAEGU"
  | "INCHEON"
  | "GWANGJU"
  | "DAEJEON"
  | "ULSAN"
  | "SEJONG"
  | "GYEONGGI"
  | "GANGWON"
  | "CHUNGCHEONGBUK"
  | "CHUNGCHEONGNAM"
  | "JEOLLABUK"
  | "JEOLLANAM"
  | "GYEONGSANGBUK"
  | "GYEONGSANGNAM"
  | "JEJU";

// Location labels in Korean
export const LOCATION_LABELS: Record<LocationCode, string> = {
  SEOUL: "서울",
  BUSAN: "부산",
  DAEGU: "대구",
  INCHEON: "인천",
  GWANGJU: "광주",
  DAEJEON: "대전",
  ULSAN: "울산",
  SEJONG: "세종",
  GYEONGGI: "경기",
  GANGWON: "강원",
  CHUNGCHEONGBUK: "충청북도",
  CHUNGCHEONGNAM: "충청남도",
  JEOLLABUK: "전북",
  JEOLLANAM: "전남",
  GYEONGSANGBUK: "경북",
  GYEONGSANGNAM: "경남",
  JEJU: "제주",
};

// User related types
export type UserType = "regular" | "guide";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: Date;
  provider: "google" | "kakao" | "naver";
  userType: UserType;
  nickname?: string; // 닉네임 추가 (특히 가이드용)
}

// Guide specific types - aligned with API GuideResponse
export interface GuideProfile {
  id: number; // API uses number, not string
  email: string;
  nickname: string; // 가이드 닉네임 (필수)
  profileImageUrl?: string; // API field name
  role: "USER" | "ADMIN" | "GUIDE" | "PENDING";
  location?: LocationCode; // 가이드 활동 지역 (Enum 타입)
  description?: string; // 가이드 소개
  // Legacy User fields for compatibility
  name?: string; // Fallback to nickname
  userType?: "guide";
  joinDate?: Date;
  provider?: "google" | "kakao" | "naver";
  // Additional fields not in API but used in UI (optional for future implementation)
  isOnline?: boolean;
  specialties?: string[];
  languages?: string[];
  averageRating?: number;
  totalReviews?: number;
}

// Chat related types
export type ChatType = "ai" | "guide";

export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  chatType: ChatType;
  guideId?: string; // 가이드 채팅인 경우 가이드 ID
  isActive: boolean; // 채팅 활성화 상태
  endedAt?: Date; // 채팅 종료 시간
  rating?: ChatRating; // 가이드 채팅 종료 후 평가
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai" | "guide";
  senderId?: number; // 실제 발신자 ID
  timestamp: Date;
  readAt?: Date; // 읽음 확인 시간
}

// Rating and Review types
export interface ChatRating {
  id: string;
  chatId: string;
  userId: string;
  guideId: string;
  rating: number; // 1-5 별점
  review?: string; // 리뷰 텍스트
  createdAt: Date;
}

export interface GuideReview {
  id: string;
  guideId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  review?: string;
  createdAt: Date;
}

// Language support
export type Language = "ko" | "en" | "zh-CN" | "ja" | "es";

// Authentication types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Chat state types
export interface ChatState {
  currentChat: Chat | null;
  chatHistory: Chat[];
  loading: boolean;
  error: string | null;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// OAuth provider types
export type OAuthProvider = "google" | "kakao" | "naver";

export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope?: string;
}

// WebSocket related types
export interface SocketMessage {
  type: "message" | "typing" | "read" | "join" | "leave" | "error";
  data: any;
  timestamp: Date;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  isTyping: boolean;
}

// Guide Search types
export interface GuideSearchFilters {
  specialties?: string[];
  languages?: string[];
  minRating?: number;
  isOnlineOnly?: boolean;
  sortBy?: "rating" | "reviews" | "name" | "online";
  sortOrder?: "asc" | "desc";
}

export interface GuideSearchResult {
  guides: GuideProfile[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

// Connection status types
export interface ConnectionStatus {
  isConnected: boolean;
  lastSeen?: Date;
  reconnectAttempts: number;
}

// Message converter utilities
import type { ChatMessageResponse } from "@/lib/generated";

/**
 * Convert API ChatMessageResponse to local Message type
 */
export const convertChatMessageToMessage = (
  apiMessage: ChatMessageResponse
): Message => {
  return {
    id: apiMessage.id?.toString() || "",
    content: apiMessage.content || "",
    sender: "user", // Default to user, update based on senderId logic if needed
    senderId: apiMessage.senderId,
    timestamp: new Date(apiMessage.createdAt || Date.now()),
    readAt: undefined, // readAt not available in current API response
  };
};
