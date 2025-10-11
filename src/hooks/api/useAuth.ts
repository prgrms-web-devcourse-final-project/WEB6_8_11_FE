import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  updateUserRole,
  logout,
  refreshAccessToken,
  type RefreshAccessTokenData,
  type UserResponse,
} from "@/lib/generated";
import { setAccessToken, clearAccessToken } from "@/lib/api/request";

export type UserRole = UserResponse["role"];

// 역할 선택
export const useSelectRole = (
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof updateUserRole>>,
      Error,
      { role: UserRole; token?: string }
    >,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: (data: { role: UserRole; token?: string }) => {
      return updateUserRole({
        body: { role: data.role },
        headers: { Authorization: `Bearer ${data.token}` },
      });
    },
    onSuccess: (response, ...rest) => {
      const accessToken = response.data?.data?.accessToken;
      if (accessToken) {
        setAccessToken(accessToken);
      }
      options?.onSuccess?.(response, ...rest);
    },
    ...options,
  });
};

// 로그아웃
export const useLogout = (
  options?: Omit<
    UseMutationOptions<Awaited<ReturnType<typeof logout>>, Error, void>,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: (response, ...rest) => {
      clearAccessToken();
      options?.onSuccess?.(response, ...rest);
    },
    ...options,
  });
};

// 토큰 갱신
export const useRefreshToken = (
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof refreshAccessToken>>,
      Error,
      RefreshAccessTokenData
    >,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: (data: RefreshAccessTokenData) =>
      refreshAccessToken({ ...data, headers: { withCredentials: true } }),
    onSuccess: (response, ...rest) => {
      const accessToken = response.data?.data?.accessToken;
      if (accessToken) {
        setAccessToken(accessToken);
      }
      options?.onSuccess?.(response, ...rest);
    },
    ...options,
  });
};
