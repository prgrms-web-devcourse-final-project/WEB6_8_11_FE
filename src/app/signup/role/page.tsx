"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Container, Alert } from "@mui/material";
import { RoleSelection } from "@/components/auth/RoleSelection";
import { VideoBackground } from "@/components/common/VideoBackground";
import { useSelectRole, type UserRole } from "@/hooks/api/useAuth";
import {
  setRegisterToken,
  clearRegisterToken,
  setAccessToken,
} from "@/lib/api/request";

export default function SignupRole() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const handleLoginRedirect = () => {
    const postLoginRedirect =
      localStorage.getItem("postLoginRedirect") || "/chat";
    localStorage.removeItem("postLoginRedirect");
    router.push(postLoginRedirect);
  };

  const selectRoleMutation = useSelectRole({
    onSuccess: (response) => {
      const accessToken = response.data?.data?.accessToken;
      if (accessToken) {
        setAccessToken(accessToken);
        clearRegisterToken();
        handleLoginRedirect();
      }
    },
    onError: (err: any) => {
      console.error("Role selection failed:", err);

      // 409 Conflict: 이미 역할이 선택된 경우 - 자동 로그인 처리
      if (err?.status === 409 || err?.response?.status === 409) {
        const token = searchParams.get("token");
        if (token) {
          // registerToken을 accessToken으로 사용
          setAccessToken(token);
          clearRegisterToken();
          handleLoginRedirect();
        }
      } else {
        // 그 외의 에러는 에러 메시지 표시
        setError("역할 선택에 실패했습니다. 다시 시도해주세요.");
      }
    },
  });

  useEffect(() => {
    // Get token from URL parameter
    const token = searchParams.get("token");

    if (token) {
      // Save token to localStorage for API calls
      setRegisterToken(token);
    } else {
      // No token, redirect to login
      router.push("/login");
    }
  }, [searchParams, router]);

  const handleRoleSelect = async (role: UserRole) => {
    setError(null);
    try {
      await selectRoleMutation.mutateAsync({ role });
    } catch (err) {
      // Error already handled in onError
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <VideoBackground videoSrc="/background.mp4" overlayOpacity={0.6} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 8 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(211, 47, 47, 0.15)",
              border: "1px solid rgba(211, 47, 47, 0.3)",
              color: "white",
              "& .MuiAlert-icon": {
                color: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            {error}
          </Alert>
        )}

        <RoleSelection
          onSelectRole={handleRoleSelect}
          loading={selectRoleMutation.isPending}
        />
      </Container>
    </Box>
  );
}
