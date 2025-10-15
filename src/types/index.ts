// Hierarchical location system with Korean place names
export type LocationName =
  // 서울특별시
  | "서울"
  // 부산광역시
  | "부산"
  // 대구광역시
  | "대구"
  // 인천광역시
  | "인천" | "백령도" | "강화"
  // 광주광역시
  | "광주"
  // 대전광역시
  | "대전"
  // 울산광역시
  | "울산"
  // 세종특별자치시
  | "세종"
  // 경기도
  | "과천" | "광명" | "김포" | "시흥" | "안산" | "부천"
  | "의정부" | "고양" | "양주" | "파주"
  | "동두천" | "연천" | "포천" | "가평"
  | "구리" | "남양주" | "양평" | "하남"
  | "수원" | "안양" | "오산" | "화성" | "성남" | "평택" | "의왕" | "군포" | "안성" | "용인"
  | "이천" | "여주"
  // 강원특별자치도
  | "철원" | "화천"
  | "인제" | "양구"
  | "춘천" | "홍천"
  | "원주" | "횡성"
  | "영월" | "정선" | "평창" | "대관령"
  | "태백"
  | "속초" | "양양"
  | "강릉"
  | "동해" | "삼척"
  // 충청북도
  | "충주" | "진천" | "음성"
  | "제천" | "단양"
  | "청주" | "보은" | "괴산" | "증평"
  | "추풍령" | "영동" | "옥천"
  // 충청남도
  | "서산" | "태안" | "당진" | "홍성"
  | "보령" | "서천"
  | "천안" | "아산" | "예산"
  | "공주" | "계룡"
  | "부여" | "청양"
  | "금산" | "논산"
  // 전북특별자치도
  | "전주" | "익산" | "정읍" | "완주"
  | "장수" | "무주" | "진안"
  | "남원" | "임실" | "순창"
  | "군산" | "김제"
  | "고창" | "부안"
  // 전라남도
  | "함평" | "영광"
  | "진도" | "완도" | "해남" | "강진" | "장흥"
  | "여수" | "광양" | "고흥" | "보성" | "순천"
  | "장성" | "나주" | "담양" | "화순"
  | "구례" | "곡성"
  | "흑산도"
  | "목포" | "영암" | "신안" | "무안"
  // 경상북도
  | "울릉도" | "독도"
  | "울진" | "영덕"
  | "포항" | "경주"
  | "문경" | "상주" | "예천"
  | "영주" | "봉화" | "영양"
  | "안동" | "의성" | "청송"
  | "김천" | "구미" | "군위" | "고령" | "성주"
  | "영천" | "경산" | "청도" | "칠곡"
  // 경상남도
  | "창원" | "김해"
  | "통영" | "사천" | "거제" | "고성" | "남해"
  | "함양" | "거창" | "합천"
  | "밀양" | "의령" | "함안" | "창녕"
  | "진주" | "산청" | "하동"
  | "양산"
  // 제주특별자치도
  | "제주" | "서귀포" | "성산" | "성판악" | "고산" | "이어도" | "추자도";

export interface LocationRegion {
  province: string;
  cities: LocationName[];
}

export const LOCATION_HIERARCHY: LocationRegion[] = [
  { province: "서울특별시", cities: ["서울"] },
  { province: "부산광역시", cities: ["부산"] },
  { province: "대구광역시", cities: ["대구"] },
  { province: "인천광역시", cities: ["인천", "백령도", "강화"] },
  { province: "광주광역시", cities: ["광주"] },
  { province: "대전광역시", cities: ["대전"] },
  { province: "울산광역시", cities: ["울산"] },
  { province: "세종특별자치시", cities: ["세종"] },
  {
    province: "경기도",
    cities: [
      "과천", "광명", "김포", "시흥", "안산", "부천",
      "의정부", "고양", "양주", "파주",
      "동두천", "연천", "포천", "가평",
      "구리", "남양주", "양평", "하남",
      "수원", "안양", "오산", "화성", "성남", "평택", "의왕", "군포", "안성", "용인",
      "이천", "여주"
    ]
  },
  {
    province: "강원특별자치도",
    cities: [
      "철원", "화천",
      "인제", "양구",
      "춘천", "홍천",
      "원주", "횡성",
      "영월", "정선", "평창", "대관령",
      "태백",
      "속초", "양양",
      "강릉",
      "동해", "삼척"
    ]
  },
  {
    province: "충청북도",
    cities: [
      "충주", "진천", "음성",
      "제천", "단양",
      "청주", "보은", "괴산", "증평",
      "추풍령", "영동", "옥천"
    ]
  },
  {
    province: "충청남도",
    cities: [
      "서산", "태안", "당진", "홍성",
      "보령", "서천",
      "천안", "아산", "예산",
      "공주", "계룡",
      "부여", "청양",
      "금산", "논산"
    ]
  },
  {
    province: "전북특별자치도",
    cities: [
      "전주", "익산", "정읍", "완주",
      "장수", "무주", "진안",
      "남원", "임실", "순창",
      "군산", "김제",
      "고창", "부안"
    ]
  },
  {
    province: "전라남도",
    cities: [
      "함평", "영광",
      "진도", "완도", "해남", "강진", "장흥",
      "여수", "광양", "고흥", "보성", "순천",
      "장성", "나주", "담양", "화순",
      "구례", "곡성",
      "흑산도",
      "목포", "영암", "신안", "무안"
    ]
  },
  {
    province: "경상북도",
    cities: [
      "울릉도", "독도",
      "울진", "영덕",
      "포항", "경주",
      "문경", "상주", "예천",
      "영주", "봉화", "영양",
      "안동", "의성", "청송",
      "김천", "구미", "군위", "고령", "성주",
      "영천", "경산", "청도", "칠곡"
    ]
  },
  {
    province: "경상남도",
    cities: [
      "창원", "김해",
      "통영", "사천", "거제", "고성", "남해",
      "함양", "거창", "합천",
      "밀양", "의령", "함안", "창녕",
      "진주", "산청", "하동",
      "양산"
    ]
  },
  {
    province: "제주특별자치도",
    cities: ["제주", "서귀포", "성산", "성판악", "고산", "이어도", "추자도"]
  }
];

// Helper functions
export const getAllLocations = (): LocationName[] => {
  return LOCATION_HIERARCHY.flatMap(region => region.cities);
};

export const getProvinceForCity = (city: LocationName): string | undefined => {
  return LOCATION_HIERARCHY.find(region => region.cities.includes(city))?.province;
};

// Legacy LocationCode mapping (for API response compatibility only)
// API now accepts Korean place names directly, but may still return English codes in responses
type LegacyLocationCode =
  | "SEOUL" | "BUSAN" | "DAEGU" | "INCHEON" | "GWANGJU" | "DAEJEON"
  | "ULSAN" | "SEJONG" | "GYEONGGI" | "GANGWON" | "CHUNGCHEONGBUK"
  | "CHUNGCHEONGNAM" | "JEOLLABUK" | "JEOLLANAM" | "GYEONGSANGBUK"
  | "GYEONGSANGNAM" | "JEJU";

const LEGACY_LOCATION_MAP: Record<LegacyLocationCode, LocationName> = {
  SEOUL: "서울",
  BUSAN: "부산",
  DAEGU: "대구",
  INCHEON: "인천",
  GWANGJU: "광주",
  DAEJEON: "대전",
  ULSAN: "울산",
  SEJONG: "세종",
  GYEONGGI: "수원", // 경기도 대표 도시
  GANGWON: "춘천", // 강원도 대표 도시
  CHUNGCHEONGBUK: "청주", // 충청북도 대표 도시
  CHUNGCHEONGNAM: "천안", // 충청남도 대표 도시
  JEOLLABUK: "전주", // 전라북도 대표 도시
  JEOLLANAM: "목포", // 전라남도 대표 도시
  GYEONGSANGBUK: "포항", // 경상북도 대표 도시
  GYEONGSANGNAM: "창원", // 경상남도 대표 도시
  JEJU: "제주",
};

// Convert legacy location code from API response to LocationName
// Only used for reading API responses that still use English codes
export const convertLegacyLocationToName = (code: LegacyLocationCode | undefined): LocationName | undefined => {
  return code ? LEGACY_LOCATION_MAP[code] : undefined;
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
  location?: LocationName; // 가이드 활동 지역 (한글 지명)
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
