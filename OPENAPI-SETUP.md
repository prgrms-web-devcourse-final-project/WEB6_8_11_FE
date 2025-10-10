# OpenAPI Generator 설정 완료

## ✅ 완료된 작업

### 1. 패키지 설치 및 설정
- ✅ `@tanstack/react-query` v5.62.11
- ✅ `@tanstack/react-query-devtools` v5.62.11
- ✅ `axios` v1.7.9
- ✅ `@7nohe/openapi-react-query-codegen` v1.6.1 (devDependency)

### 2. 코드 생성 완료
- ✅ `@hey-api/openapi-ts` 사용하여 API 클라이언트 생성
- ✅ `src/lib/generated/` 폴더에 TypeScript 타입 및 SDK 생성
  - `types.gen.ts` - 모든 TypeScript 타입 정의
  - `sdk.gen.ts` - API 호출 함수들
  - `client.gen.ts` - Axios 클라이언트

### 3. React Query 훅 작성
생성된 SDK를 래핑한 React Query 훅 작성:
- ✅ `src/hooks/api/useAuth.ts` - 인증 (useSelectRole, useLogout, useRefreshToken)
- ✅ `src/hooks/api/useUsers.ts` - 사용자 (useGetMe, useUpdateMe, useDeleteMe)
- ✅ `src/hooks/api/useAiChat.ts` - AI 채팅 (5개 훅)
- ✅ `src/hooks/api/useUserChat.ts` - 사용자 채팅 (5개 훅)
- ✅ `src/hooks/api/useRate.ts` - 평가 (4개 훅)

### 4. 설정 파일
- ✅ `openapi-codegen.config.ts` - 코드 생성 설정
- ✅ `src/lib/api/request.ts` - 커스텀 Axios 인스턴스 (인터셉터 포함)
- ✅ `src/lib/generated/client-config.ts` - 클라이언트 설정
- ✅ `src/providers/ReactQueryProvider.tsx` - React Query Provider
- ✅ `.env.example` - 환경 변수 예시

### 5. 문서화
- ✅ `README-OPENAPI.md` - 상세 사용 가이드
- ✅ `.gitignore` 업데이트

## 📁 최종 파일 구조

```
├── api-specification.yaml                 # OpenAPI 스펙 (소스)
├── openapi-codegen.config.ts             # 코드 생성 설정
├── .env.example                          # 환경 변수 예시
│
├── src/
│   ├── lib/
│   │   ├── api/
│   │   │   └── request.ts                # 커스텀 Axios (인터셉터)
│   │   └── generated/                    # 🤖 자동 생성
│   │       ├── types.gen.ts              # TypeScript 타입
│   │       ├── sdk.gen.ts                # API 함수들
│   │       ├── client.gen.ts             # Axios 클라이언트
│   │       ├── client-config.ts          # 클라이언트 설정 (수동)
│   │       └── index.ts
│   │
│   ├── hooks/api/                        # React Query 훅
│   │   ├── useAuth.ts
│   │   ├── useUsers.ts
│   │   ├── useAiChat.ts
│   │   ├── useUserChat.ts
│   │   ├── useRate.ts
│   │   └── index.ts
│   │
│   └── providers/
│       └── ReactQueryProvider.tsx
│
└── package.json                          # generate:api 스크립트 추가
```

## 🚀 사용 방법

### 1. 환경 변수 설정

`.env.local` 파일 생성:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 2. API 클라이언트 재생성

OpenAPI 스펙 변경 시:
```bash
npm run generate:api
```

### 3. 기본 사용 예시

```tsx
import { useGetMe, useUpdateMe } from '@/hooks/api';

function Profile() {
  const { data: user, isLoading } = useGetMe();
  const updateMe = useUpdateMe();

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div>
      <h1>{user?.nickname}</h1>
      <button onClick={() => updateMe.mutate({ nickname: '새 닉네임' })}>
        수정
      </button>
    </div>
  );
}
```

## 🔑 주요 기능

### 1. 자동 토큰 관리
- Access Token 자동 추가 (Request Interceptor)
- 401 에러 시 자동 토큰 갱신 (Response Interceptor)
- 갱신 실패 시 로그인 페이지 리다이렉트

### 2. React Query 통합
- 자동 캐싱 및 리페칭
- Optimistic Updates
- Query Invalidation
- DevTools 지원

### 3. TypeScript 완벽 지원
- 모든 API 요청/응답 타입 자동 생성
- IDE 자동완성 지원
- 런타임 타입 안정성

## ⚠️ 중요 사항

### 생성된 코드 수정 금지
- `src/lib/generated/` 내 `.gen.ts` 파일은 수정하지 마세요
- 재생성 시 변경사항이 사라집니다

### Git 관리
- 생성된 코드는 일반적으로 커밋합니다
- 제외하려면 `.gitignore`의 주석을 해제하세요

## 📚 추가 문서

- [README-OPENAPI.md](README-OPENAPI.md) - 상세 사용 가이드 및 예제
- [OpenAPI Specification](./api-specification.yaml) - API 스펙

## 🛠️ 문제 해결

### 생성 실패 시
```bash
rm -rf src/lib/generated
npm run generate:api
```

### 타입 오류 발생 시
```bash
npm run type-check
```

## 🎯 다음 단계

1. ✅ `npm install` 실행 (이미 생성된 코드 사용)
2. ✅ `.env.local` 파일 생성
3. ✅ React Query Provider 설정 (app/layout.tsx)
4. ✅ 컴포넌트에서 훅 사용

모든 설정이 완료되었습니다! 🎉
