import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import {
  getMyProfile,
  updateMyProfile,
  deleteMe,
} from '@/lib/generated';

export const userKeys = {
  all: ['users'] as const,
  me: () => [...userKeys.all, 'me'] as const,
};

// 내 정보 조회
export const useGetMe = (
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getMyProfile>>, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => getMyProfile(),
    ...options,
  });
};

// 내 프로필 수정
export const useUpdateMe = (
  options?: Omit<
    UseMutationOptions<Awaited<ReturnType<typeof updateMyProfile>>, Error, { nickname?: string; profileImageUrl?: string }>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { nickname?: string; profileImageUrl?: string }) => updateMyProfile({ body: data }),
    onSuccess: (response, ...rest) => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      options?.onSuccess?.(response, ...rest);
    },
    ...options,
  });
};

// 회원 탈퇴
export const useDeleteMe = (
  options?: Omit<
    UseMutationOptions<Awaited<ReturnType<typeof deleteMe>>, Error, void>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteMe(),
    onSuccess: (response, ...rest) => {
      queryClient.clear();
      options?.onSuccess?.(response, ...rest);
    },
    ...options,
  });
};
