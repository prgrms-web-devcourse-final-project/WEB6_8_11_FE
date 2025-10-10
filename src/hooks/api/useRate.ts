import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import {
  rateAiSession,
  rateGuide,
  getAllAiSessionRatings,
  getMyGuideRatings,
} from '@/lib/generated';

export const rateKeys = {
  all: ['rate'] as const,
  aiSessions: () => [...rateKeys.all, 'aiSessions'] as const,
  myGuide: () => [...rateKeys.all, 'myGuide'] as const,
};

// AI 세션 평가
export const useRateAiSession = (
  sessionId: number,
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof rateAiSession>>,
      Error,
      { rating: number; comment?: string }
    >,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { rating: number; comment?: string }) =>
      rateAiSession({ path: { sessionId }, body: data }),
    onSuccess: (response, ...rest) => {
      queryClient.invalidateQueries({ queryKey: rateKeys.aiSessions() });
      options?.onSuccess?.(response, ...rest);
    },
    ...options,
  });
};

// 가이드 평가
export const useRateGuide = (
  guideId: number,
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof rateGuide>>,
      Error,
      { rating: number; comment?: string }
    >,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { rating: number; comment?: string }) =>
      rateGuide({ path: { guideId }, body: data }),
    onSuccess: (response, ...rest) => {
      queryClient.invalidateQueries({ queryKey: rateKeys.myGuide() });
      options?.onSuccess?.(response, ...rest);
    },
    ...options,
  });
};

// 모든 AI 세션 평가 조회 (ADMIN만)
export const useGetAllAiSessionRatings = (
  page?: number,
  size?: number,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getAllAiSessionRatings>>, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [...rateKeys.aiSessions(), { page, size }],
    queryFn: () => getAllAiSessionRatings({
      query: {
        pageable: {
          page: page ?? 0,
          size: size ?? 20
        }
      }
    }),
    ...options,
  });
};

// 내가 받은 가이드 평가 조회 (GUIDE만)
export const useGetMyGuideRatings = (
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getMyGuideRatings>>, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: rateKeys.myGuide(),
    queryFn: () => getMyGuideRatings(),
    ...options,
  });
};
