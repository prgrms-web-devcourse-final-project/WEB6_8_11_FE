// User related types
export type UserType = 'regular' | 'guide';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: Date;
  provider: 'google' | 'kakao' | 'naver';
  userType: UserType;
  nickname?: string; // 닉네임 추가 (특히 가이드용)
}

// Guide specific types
export interface GuideProfile extends User {
  userType: 'guide';
  nickname: string; // 가이드는 닉네임 필수
  specialties: string[]; // 전문 분야
  description?: string; // 가이드 소개
  languages: string[]; // 지원 언어
  isOnline: boolean; // 온라인 상태
  averageRating: number; // 평균 평점
  totalReviews: number; // 총 리뷰 수
  profileImage?: string; // 프로필 이미지
}

// Chat related types
export type ChatType = 'ai' | 'guide';

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
  sender: 'user' | 'ai' | 'guide';
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
export type Language = 'ko' | 'en' | 'zh-CN' | 'ja' | 'es';

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
export type OAuthProvider = 'google' | 'kakao' | 'naver';

export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope?: string;
}

// WebSocket related types
export interface SocketMessage {
  type: 'message' | 'typing' | 'read' | 'join' | 'leave' | 'error';
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
  sortBy?: 'rating' | 'reviews' | 'name' | 'online';
  sortOrder?: 'asc' | 'desc';
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