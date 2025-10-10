import { useQuery, useMutation, useQueryClient, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { getAllGuides, getGuideById, updateMyGuideProfile } from '@/lib/generated';
import type { GuideResponse, GuideUpdateRequest } from '@/lib/generated';

// Query keys for React Query
export const guideKeys = {
  all: ['guides'] as const,
  lists: () => [...guideKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...guideKeys.lists(), filters] as const,
  details: () => [...guideKeys.all, 'detail'] as const,
  detail: (id: number) => [...guideKeys.details(), id] as const,
};

/**
 * Hook to fetch all guides
 */
export const useGetAllGuides = (
  options?: Omit<UseQueryOptions<{ msg: string; data?: GuideResponse[] }, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: guideKeys.lists(),
    queryFn: async () => {
      const response = await getAllGuides();
      if (!response.data) {
        throw new Error('Failed to fetch guides');
      }
      return response.data;
    },
    ...options,
  });
};

/**
 * Hook to fetch a single guide by ID
 */
export const useGetGuideById = (
  guideId: number,
  options?: Omit<UseQueryOptions<{ msg: string; data?: GuideResponse }, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: guideKeys.detail(guideId),
    queryFn: async () => {
      const response = await getGuideById({
        path: { guideId },
      });
      if (!response.data) {
        throw new Error('Failed to fetch guide');
      }
      return response.data;
    },
    enabled: !!guideId,
    ...options,
  });
};

/**
 * Hook to update my guide profile (for GUIDE users only)
 */
export const useUpdateMyGuideProfile = (
  options?: Omit<
    UseMutationOptions<{ msg: string; data?: GuideResponse }, Error, GuideUpdateRequest>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: GuideUpdateRequest) => {
      const response = await updateMyGuideProfile({
        body: updateData,
      });
      if (!response.data) {
        throw new Error('Failed to update guide profile');
      }
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate guides list to refetch
      queryClient.invalidateQueries({ queryKey: guideKeys.lists() });

      // If we have the guide ID, invalidate the specific guide detail
      if (data?.data?.id) {
        queryClient.invalidateQueries({ queryKey: guideKeys.detail(data.data.id) });
      }
    },
    ...options,
  });
};
