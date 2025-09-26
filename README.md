# Korea Travel Guide Chatbot

한국을 방문하는 외국인 여행객을 위한 AI 기반 실시간 여행 가이드 서비스입니다.

## 기술 스택

- **Frontend**: Next.js 15 (App Router)
- **UI Library**: Material-UI (MUI) v6
- **Language**: TypeScript
- **Styling**: MUI Theme + Custom CSS
- **State Management**: React Context API + Custom Hooks
- **Internationalization**: next-i18next

## 지원 언어

- 🇰🇷 한국어 (ko)
- 🇺🇸 English (en)
- 🇨🇳 中文 简体 (zh-CN)
- 🇯🇵 日本語 (ja)
- 🇪🇸 Español (es)

## 주요 기능

### 🔐 인증 시스템
- OAuth 2.0 기반 소셜 로그인
- 지원 제공자: Google, Kakao, Naver
- 자동 세션 관리

### 💬 챗봇 인터페이스
- 실시간 AI 대화
- 채팅 히스토리 관리
- 반응형 메시지 UI
- 무한 스크롤 지원

### 👤 사용자 관리
- 프로필 정보 조회
- 계정 설정 관리
- 로그아웃 및 회원탈퇴

### 🌍 다국어 지원
- 브라우저 언어 자동 감지
- 실시간 언어 변경
- 모든 UI 요소 현지화

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── common/         # 공통 컴포넌트
│   ├── auth/           # 인증 관련 컴포넌트
│   ├── chat/           # 채팅 관련 컴포넌트
│   └── profile/        # 프로필 관련 컴포넌트
├── app/                # Next.js App Router
├── hooks/              # Custom React Hooks
├── lib/                # 라이브러리 설정
├── types/              # TypeScript 타입 정의
└── utils/              # 유틸리티 함수

public/
└── locales/            # 다국어 번역 파일
    ├── ko/             # 한국어
    ├── en/             # 영어
    ├── zh-CN/          # 중국어
    ├── ja/             # 일본어
    └── es/             # 스페인어
```

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

### 타입 체크

```bash
npm run type-check
```

### 린트

```bash
npm run lint
```

## 환경 설정

프로덕션 환경에서는 다음 환경 변수들을 설정해야 합니다:

```env
# OAuth 설정
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret

NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret

# API 엔드포인트
NEXT_PUBLIC_API_URL=your_api_endpoint

# 기타 설정
NEXT_PUBLIC_APP_ENV=production
```

## 페이지 구성

### 로그인 페이지 (`/`)
- 서비스 소개 및 슬로건
- OAuth 소셜 로그인 버튼
- 언어 선택기

### 메인 채팅 페이지 (`/chat`)
- 사이드바: 새 채팅, 채팅 히스토리, 사용자 프로필
- 채팅 영역: 메시지 목록, 입력창
- 반응형 디자인 (모바일 지원)

### 프로필 페이지 (`/profile`)
- 사용자 정보 표시
- 계정 관리 (로그아웃, 회원탈퇴)
- 언어 설정

## 기능 명세

### 인증 플로우
```
미인증 → 로그인 페이지 → OAuth 선택 → 외부 인증 → 토큰 획득 → 메인 페이지
```

### 채팅 플로우
```
새 채팅 시작 → 메시지 입력 → AI 응답 → 히스토리 저장 → 반복
```

### 다국어 지원
- 브라우저 언어 자동 감지
- 언어별 번역 파일 관리
- 실시간 언어 변경 지원

## 성능 최적화

- Next.js SSR/SSG 활용
- 컴포넌트 레벨 코드 스플리팅
- 이미지 최적화
- 메시지 가상화 (긴 채팅)
- 캐싱 전략

## 접근성

- WCAG 2.1 AA 준수
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 적절한 색상 대비율

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 문의

프로젝트에 대한 문의사항이나 제안이 있으시면 이슈를 생성해주세요.