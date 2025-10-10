import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  getSessions,
  createSession,
  deleteSession,
  getSessionMessages,
  sendMessage1,
  updateSessionTitle,
  type CreateSessionData,
  type SendMessage1Data,
  type UpdateSessionTitleData,
} from "@/lib/generated";

export const aiChatKeys = {
  all: ["aichat"] as const,
  sessions: () => [...aiChatKeys.all, "sessions"] as const,
  session: (sessionId: number) =>
    [...aiChatKeys.all, "sessions", sessionId] as const,
  messages: (sessionId: number) =>
    [...aiChatKeys.session(sessionId), "messages"] as const,
};

// AI 채팅 세션 목록 조회
export const useGetAiChatSessions = (
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getSessions>>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: aiChatKeys.sessions(),
    queryFn: () => getSessions(),
    ...options,
  });
};

// 새 AI 채팅 세션 생성
export const useCreateAiChatSession = (
  options?: Omit<
    UseMutationOptions<Awaited<ReturnType<typeof createSession>>, Error, void>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createSession(),
    onSuccess: (response, ...rest) => {
      // Optimistically add the new session to cache
      const newSession = response.data?.data;
      if (newSession) {
        queryClient.setQueryData(aiChatKeys.sessions(), (old: any) => {
          const currentSessions = old?.data?.data || [];
          return {
            ...old,
            data: {
              ...old?.data,
              data: [newSession, ...currentSessions],
            },
          };
        });
      }

      // Invalidate to ensure data consistency
      queryClient.invalidateQueries({ queryKey: aiChatKeys.sessions() });
      options?.onSuccess?.(response, ...rest);
    },
    ...options,
  });
};

// AI 채팅 세션 삭제
export const useDeleteAiChatSession = (
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof deleteSession>>,
      Error,
      number
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) =>
      deleteSession({ path: { sessionId } }),
    onSuccess: (response, sessionId, ...rest) => {
      queryClient.invalidateQueries({ queryKey: aiChatKeys.sessions() });
      queryClient.removeQueries({ queryKey: aiChatKeys.session(sessionId) });
      options?.onSuccess?.(response, sessionId, ...rest);
    },
    ...options,
  });
};

// AI 채팅 메시지 조회
export const useGetAiChatMessages = (
  sessionId: number,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getSessionMessages>>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: aiChatKeys.messages(sessionId),
    queryFn: () =>
      getSessionMessages({ path: { sessionId } }),
    enabled: !!sessionId,
    ...options,
  });
};

// AI에게 메시지 전송
export const useSendAiChatMessage = (
  sessionId: number,
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof sendMessage1>>,
      Error,
      { message: string }
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { message: string }) =>
      sendMessage1({ path: { sessionId }, body: data }),
    onMutate: async (variables): Promise<{ previousMessages: unknown }> => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: aiChatKeys.messages(sessionId),
      });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(
        aiChatKeys.messages(sessionId)
      );

      // Optimistically update to the new value
      queryClient.setQueryData(aiChatKeys.messages(sessionId), (old: any) => {
        const currentMessages = old?.data?.data || [];
        const newUserMessage = {
          messageId: `temp-${Date.now()}`,
          senderType: "USER",
          content: variables.message,
          timestamp: new Date().toISOString(),
        };

        return {
          ...old,
          data: {
            ...old?.data,
            data: [...currentMessages, newUserMessage],
          },
        };
      });

      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    onError: (err, variables, context: any) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMessages) {
        queryClient.setQueryData(
          aiChatKeys.messages(sessionId),
          context.previousMessages
        );
      }
    },
    onSuccess: (response, variables) => {
      // Invalidate and refetch to get the actual server data (including AI response)
      queryClient.invalidateQueries({
        queryKey: aiChatKeys.messages(sessionId),
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({
        queryKey: aiChatKeys.messages(sessionId),
      });
    },
  });
};

// AI 채팅 세션 제목 수정
export const useUpdateAiChatSessionTitle = (
  sessionId: number,
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof updateSessionTitle>>,
      Error,
      { newTitle: string }
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { newTitle: string }) =>
      updateSessionTitle({
        path: { sessionId },
        body: data,
      }),
    onSuccess: (response, ...rest) => {
      queryClient.invalidateQueries({ queryKey: aiChatKeys.sessions() });
      queryClient.invalidateQueries({
        queryKey: aiChatKeys.session(sessionId),
      });
      options?.onSuccess?.(response, ...rest);
    },
    ...options,
  });
};
