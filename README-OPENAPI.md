# OpenAPI Generator Integration

이 프로젝트는 `@hey-api/openapi-ts`를 사용하여 OpenAPI 명세서로부터 TypeScript 타입과 API 클라이언트를 자동 생성합니다.

## 개요

```
api-specification.yaml  →  @hey-api/openapi-ts  →  src/lib/generated/
                                                      ├── types.gen.ts (TypeScript 타입)
                                                      ├── sdk.gen.ts (API 함수)
                                                      └── client.gen.ts (Axios 클라이언트)
```

## 설치

```bash
npm install
```

필요한 패키지:
- `@tanstack/react-query` - React Query v5
- `@tanstack/react-query-devtools` - 개발 도구
- `axios` - HTTP 클라이언트
- `@hey-api/openapi-ts` (devDependency) - 코드 생성기

## API 클라이언트 생성

### 1. OpenAPI 스펙 파일 업데이트

`api-specification.yaml` 파일을 수정한 후:

```bash
npm run generate:api
```

이 명령은 다음을 실행합니다:
```bash
npx @hey-api/openapi-ts -i api-specification.yaml -o src/lib/generated -c @hey-api/client-axios
```

### 2. 생성된 파일 구조

```
src/lib/generated/
├── types.gen.ts              # TypeScript 타입 정의
│   ├── UserRole, UserResponse, AiChatSession 등
│   └── 모든 요청/응답 타입
├── sdk.gen.ts                # API 함수
│   ├── postApiAuthRole()
│   ├── getApiUsersMe()
│   ├── getApiAichatSessions()
│   └── 모든 API 엔드포인트 함수
├── client.gen.ts             # Axios 클라이언트 설정
├── client-config.ts          # 커스텀 Axios 인스턴스 (수동 작성)
└── index.ts                  # Export
```

## 사용 방법

### 환경 변수 설정

`.env.local` 파일:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### React Query Provider 설정

`app/layout.tsx`:
```tsx
import ReactQueryProvider from '@/providers/ReactQueryProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
```

### 기본 사용 예시

#### 1. 인증 (Auth)

```tsx
import { useSelectRole, useLogout } from '@/hooks/api';
import { UserRole } from '@/lib/generated';

function AuthExample() {
  const selectRole = useSelectRole({
    onSuccess: (response) => {
      console.log('역할 선택 성공:', response.data);
    },
  });

  const logout = useLogout({
    onSuccess: () => {
      console.log('로그아웃 성공');
      window.location.href = '/login';
    },
  });

  return (
    <div>
      <button onClick={() => selectRole.mutate({ role: UserRole.GUIDE })}>
        가이드로 가입
      </button>
      <button onClick={() => logout.mutate()}>
        로그아웃
      </button>
    </div>
  );
}
```

#### 2. 사용자 정보 (Users)

```tsx
import { useGetMe, useUpdateMe } from '@/hooks/api';

function UserProfile() {
  const { data: user, isLoading } = useGetMe();
  const updateMe = useUpdateMe();

  const handleUpdate = () => {
    updateMe.mutate({
      nickname: '새로운 닉네임',
      profileImageUrl: 'https://example.com/image.jpg',
    });
  };

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div>
      <h1>{user?.nickname}</h1>
      <p>{user?.email}</p>
      <button onClick={handleUpdate}>프로필 수정</button>
    </div>
  );
}
```

#### 3. AI 채팅 (AI Chat)

```tsx
import {
  useGetAiChatSessions,
  useCreateAiChatSession,
  useSendAiChatMessage
} from '@/hooks/api';

function AiChat() {
  const { data: sessions } = useGetAiChatSessions();
  const createSession = useCreateAiChatSession();
  const sendMessage = useSendAiChatMessage(sessionId);

  const handleCreateSession = () => {
    createSession.mutate({
      sessionTitle: '새로운 여행 계획',
    });
  };

  const handleSendMessage = (content: string) => {
    sendMessage.mutate({ content });
  };

  return (
    <div>
      <button onClick={handleCreateSession}>새 세션 만들기</button>
      {sessions?.map((session) => (
        <div key={session.id}>{session.sessionTitle}</div>
      ))}
    </div>
  );
}
```

#### 4. 사용자 채팅 (User Chat)

```tsx
import {
  useGetChatRooms,
  useCreateChatRoom,
  useSendChatMessage
} from '@/hooks/api';

function UserChat() {
  const { data: rooms } = useGetChatRooms();
  const createRoom = useCreateChatRoom();
  const sendMessage = useSendChatMessage(roomId);

  const handleCreateRoom = (guideId: number) => {
    createRoom.mutate({
      roomName: '가이드와의 채팅',
      guideId,
    });
  };

  return (
    <div>
      <button onClick={() => handleCreateRoom(123)}>채팅방 만들기</button>
      {rooms?.map((room) => (
        <div key={room.id}>{room.roomName}</div>
      ))}
    </div>
  );
}
```

#### 5. 평가 (Rate)

```tsx
import { useRateAiSession, useRateGuide, useGetMyGuideRatings } from '@/hooks/api';

function Rating() {
  const rateAiSession = useRateAiSession(sessionId);
  const rateGuide = useRateGuide(guideId);
  const { data: myRatings } = useGetMyGuideRatings(); // GUIDE만

  const handleRateAiSession = () => {
    rateAiSession.mutate({
      rating: 5,
      comment: '매우 유용했습니다!',
    });
  };

  const handleRateGuide = () => {
    rateGuide.mutate({
      rating: 4,
      comment: '친절하고 도움이 되었습니다.',
    });
  };

  return (
    <div>
      <button onClick={handleRateAiSession}>AI 세션 평가</button>
      <button onClick={handleRateGuide}>가이드 평가</button>
      {myRatings && (
        <div>
          평균 평점: {myRatings.averageRating} ({myRatings.totalRatings}개)
        </div>
      )}
    </div>
  );
}
```

## TypeScript 타입 사용

생성된 모든 타입은 자동으로 import할 수 있습니다:

```tsx
import type {
  UserRole,
  UserResponse,
  AiChatSession,
  ChatRoom,
  Rate,
  // ... 기타 모든 타입
} from '@/lib/generated';

// 또는
import type { UserRole } from '@/hooks/api';
```

## 고급 기능

### 커스텀 Axios 인터셉터

`src/lib/api/request.ts`에서 설정:
- Access Token 자동 추가
- 401 에러 시 자동 토큰 갱신
- 토큰 갱신 실패 시 로그인 페이지 리다이렉트

### React Query 옵션 커스터마이징

```tsx
const { data } = useGetMe({
  staleTime: 5 * 60 * 1000, // 5분
  retry: 3,
  refetchOnWindowFocus: true,
});
```

### Mutation 성공 시 추가 작업

```tsx
const updateMe = useUpdateMe({
  onSuccess: (response) => {
    console.log('업데이트 성공:', response.data);
    // 추가 작업
  },
  onError: (error) => {
    console.error('업데이트 실패:', error);
  },
});
```

## API 스펙 업데이트 워크플로우

1. `api-specification.yaml` 수정
2. `npm run generate:api` 실행
3. 생성된 코드 확인
4. 타입 오류 수정 (있는 경우)
5. 커밋 및 푸시

## 주의사항

### 생성된 코드 수정하지 않기
- `src/lib/generated/` 내의 `.gen.ts` 파일은 수정하지 마세요
- 재생성 시 변경사항이 사라집니다
- 커스터마이징이 필요한 경우 별도 파일로 분리하세요

### Git 관리
- 생성된 코드는 일반적으로 커밋합니다
- `.gitignore`에 추가하려면 주석을 해제하세요

## 문제 해결

### 생성 실패 시
```bash
# 캐시 삭제 후 재시도
rm -rf src/lib/generated
npm run generate:api
```

### 타입 오류 발생 시
```bash
# TypeScript 체크
npm run type-check
```

### Axios 인스턴스 문제
`src/lib/generated/client-config.ts`에서 설정 확인

## 참고 자료

- [OpenAPI Specification](https://swagger.io/specification/)
- [@hey-api/openapi-ts Documentation](https://heyapi.vercel.app/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
