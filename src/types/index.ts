// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: Date;
  provider: 'google' | 'kakao' | 'naver';
}

// Chat related types
export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
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