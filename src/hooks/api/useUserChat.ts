import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  listRooms,
  deleteRoom,
  listMessages,
  sendMessage,
  startChat,
  rateGuide as rateGuideAPI,
} from "@/lib/generated";

export const userChatKeys = {
  all: ["userchat"] as const,
  rooms: () => [...userChatKeys.all, "rooms"] as const,
  room: (roomId: number) => [...userChatKeys.all, "rooms", roomId] as const,
  messages: (roomId: number) =>
    [...userChatKeys.room(roomId), "messages"] as const,
};

// 내 채팅방 목록 조회
export const useGetChatRooms = (
  limit?: number,
  cursor?: string,
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof listRooms>>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: [...userChatKeys.rooms(), { limit, cursor }],
    queryFn: () => listRooms({ query: { limit, cursor } }),
    ...options,
  });
};

// 채팅방 삭제
export const useDeleteChatRoom = (
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof deleteRoom>>,
      Error,
      number
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: number) =>
      deleteRoom({ path: { roomId } }),
    onSuccess: (response, roomId, ...rest) => {
      queryClient.invalidateQueries({ queryKey: userChatKeys.rooms() });
      queryClient.removeQueries({ queryKey: userChatKeys.room(roomId) });
      options?.onSuccess?.(response, roomId, ...rest);
    },
    ...options,
  });
};

// 채팅방 메시지 조회
export const useGetChatMessages = (
  roomId: number,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof listMessages>>,
      Error
    >,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: userChatKeys.messages(roomId),
    queryFn: () => listMessages({ path: { roomId } }),
    enabled: !!roomId,
    ...options,
  });
};

// 채팅방에 메시지 전송
export const useSendChatMessage = (
  roomId: number,
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof sendMessage>>,
      Error,
      { content: string }
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { content: string }) =>
      sendMessage({ path: { roomId }, body: data }),
    onSuccess: (response, ...rest) => {
      queryClient.invalidateQueries({
        queryKey: userChatKeys.messages(roomId),
      });
      options?.onSuccess?.(response, ...rest);
    },
    ...options,
  });
};

// 가이드와 채팅 시작
export const useStartChat = (
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof startChat>>,
      Error,
      { guideId: number; userId: number }
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { guideId: number; userId: number }) =>
      startChat({ body: data }),
    onSuccess: (response, ...rest) => {
      queryClient.invalidateQueries({ queryKey: userChatKeys.rooms() });
      options?.onSuccess?.(response, ...rest);
    },
    ...options,
  });
};

// 가이드 평가 (레거시: useRate.ts의 useRateGuide 사용 권장)
export const useRateGuideWithId = (
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof rateGuideAPI>>,
      Error,
      { guideId: number; rating: number; comment?: string }
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { guideId: number; rating: number; comment?: string }) =>
      rateGuideAPI({ path: { guideId: data.guideId }, body: { rating: data.rating, comment: data.comment } }),
    onSuccess: (response, ...rest) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["guides"] });
      options?.onSuccess?.(response, ...rest);
    },
    ...options,
  });
};
