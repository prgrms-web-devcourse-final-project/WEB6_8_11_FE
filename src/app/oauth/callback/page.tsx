"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { setAccessToken } from "@/lib/api/request";
import { useRefreshToken } from "@/hooks/api/useAuth";
import { useTranslation } from "@/hooks/useTranslation";

export default function OAuthCallback() {
  const router = useRouter();
  const refreshMutation = useRefreshToken();
  const { t } = useTranslation();

  useEffect(() => {
    const handleCallback = async () => {
      const response = await refreshMutation.mutateAsync({
        url: "/api/auth/refresh",
      });
      const accessToken = response.data?.data?.accessToken;
      if (accessToken) {
        setAccessToken(accessToken);
        router.push("/");
      }
    };
    handleCallback();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        p: 3,
      }}
    >
      {
        <>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            {t("auth.processing")}
          </Typography>
        </>
      }
    </Box>
  );
}
