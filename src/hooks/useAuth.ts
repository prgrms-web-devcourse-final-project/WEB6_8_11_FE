'use client';

import { useRouter } from 'next/navigation';
import { User, AuthState, OAuthProvider } from '@/types';
import { useGetMe, useDeleteMe } from './api/useUsers';
import { useLogout as useLogoutMutation, useSelectRole, type UserRole } from './api/useAuth';
import { getAccessToken } from '@/lib/api/request';
import type { UserResponse as ApiUser } from '@/lib/generated';

/**
 * Convert API User to local User type
 */
const convertApiUserToUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser.id?.toString() || '',
    name: apiUser.nickname || apiUser.email || 'User',
    email: apiUser.email || '',
    avatar: apiUser.profileImageUrl || undefined,
    joinDate: new Date(), // API doesn't provide joinDate, use current date
    provider: 'google', // Default provider, can be updated when API provides this field
    userType: apiUser.role === 'GUIDE' ? 'guide' : 'regular',
    nickname: apiUser.nickname || undefined,
  };
};

export const useAuth = () => {
  const router = useRouter();

  // Fetch current user data
  const {
    data: apiUserResponse,
    isLoading,
    error,
    refetch: refetchUser
  } = useGetMe({
    enabled: !!getAccessToken(), // Only fetch if token exists
    retry: false,
  });

  // Mutations
  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      router.push('/login');
    },
  });

  const deleteMutation = useDeleteMe({
    onSuccess: () => {
      router.push('/login');
    },
  });

  const selectRoleMutation = useSelectRole();

  // Extract user data from API response
  const apiUser = apiUserResponse?.data?.data;
  const user = apiUser ? convertApiUserToUser(apiUser) : null;
  const isAuthenticated = !!user && !!getAccessToken();
  const isNewUser = apiUser?.role === 'PENDING';

  const authState: AuthState = {
    user,
    isAuthenticated,
    loading: isLoading,
  };

  /**
   * OAuth login - redirect to backend OAuth endpoint
   */
  const login = async (provider: OAuthProvider): Promise<void> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    const redirectUrl = `${baseUrl}/oauth2/authorization/${provider}`;

    // Store the intended destination for post-login redirect
    if (typeof window !== 'undefined') {
      localStorage.setItem('postLoginRedirect', window.location.pathname);
    }

    window.location.href = redirectUrl;
  };

  /**
   * Select role after OAuth login (for PENDING users)
   */
  const selectRole = async (role: UserRole): Promise<void> => {
    await selectRoleMutation.mutateAsync({ role });
    await refetchUser(); // Refresh user data after role selection
  };

  /**
   * Logout - calls API and clears local state
   */
  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync();
  };

  /**
   * Delete account - calls API and redirects to login
   */
  const deleteAccount = async (): Promise<void> => {
    await deleteMutation.mutateAsync();
  };

  return {
    ...authState,
    login,
    logout,
    deleteAccount,
    selectRole,
    refetchUser,
    isNewUser,
    // Expose mutation states for loading/error handling
    isLoggingOut: logoutMutation.isPending,
    isDeletingAccount: deleteMutation.isPending,
    isSelectingRole: selectRoleMutation.isPending,
  };
};