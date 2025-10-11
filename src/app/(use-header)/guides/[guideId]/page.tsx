"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Skeleton,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Chat as ChatIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { Header } from "@/components/common/Header";
import { useAuth } from "@/hooks/useAuth";
import { useGetGuideById } from "@/hooks/api";
import { useStartChat } from "@/hooks/api/useUserChat";
import { useTranslation } from "@/hooks/useTranslation";

export default function GuideDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { translateLocation } = useTranslation();
  const guideId = parseInt(params.guideId as string);

  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // Fetch guide data
  const { data: guideData, isLoading, error } = useGetGuideById(guideId);
  const guide = guideData?.data;

  // Start chat mutation
  const startChatMutation = useStartChat({
    onSuccess: (response) => {
      const roomId = response?.data?.data?.id;
      if (roomId) {
        router.push(`/chat/guide-${roomId}`);
      }
    },
    onError: (error: any) => {
      setSnackbar({
        open: true,
        message: error?.message || "채팅 시작에 실패했습니다.",
      });
    },
  });

  const handleChatStart = () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: "로그인이 필요합니다.",
      });
      return;
    }

    if (!guide) return;

    if (user.id === guide.id.toString()) {
      setSnackbar({
        open: true,
        message: "자기 자신과는 채팅할 수 없습니다.",
      });
      return;
    }

    startChatMutation.mutate({
      guideId: guide.id,
      userId: parseInt(user.id),
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
        <Header />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Skeleton variant="circular" width={120} height={120} />
                <Box sx={{ ml: 3, flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={40} />
                  <Skeleton variant="text" width="40%" height={30} />
                </Box>
              </Box>
              <Skeleton variant="rectangular" height={200} />
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  if (error || !guide) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
        <Header />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            가이드 정보를 불러오는 중 오류가 발생했습니다.
          </Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/guides/search")}
          >
            목록으로 돌아가기
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <Header />
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/guides/search")}
          sx={{ mb: 3 }}
        >
          목록으로
        </Button>

        <Card>
          <CardContent sx={{ p: 4 }}>
            {/* Profile Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 4,
                flexDirection: { xs: "column", sm: "row" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Avatar
                src={guide.profileImageUrl}
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: "primary.main",
                  fontSize: "3rem",
                  mb: { xs: 2, sm: 0 },
                }}
              >
                {guide.nickname.charAt(0)}
              </Avatar>
              <Box sx={{ ml: { sm: 3 }, flex: 1 }}>
                <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
                  {guide.nickname}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1, justifyContent: { xs: "center", sm: "flex-start" } }}>
                  <EmailIcon sx={{ fontSize: 18, mr: 1, color: "text.secondary" }} />
                  <Typography variant="body1" color="text.secondary">
                    {guide.email}
                  </Typography>
                </Box>
                {guide.location && (
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "center", sm: "flex-start" } }}>
                    <LocationIcon sx={{ fontSize: 18, mr: 0.5, color: "primary.main" }} />
                    <Chip
                      label={translateLocation(guide.location)}
                      size="medium"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            {/* Description */}
            {guide.description && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  소개
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
                >
                  {guide.description}
                </Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<ChatIcon />}
                onClick={handleChatStart}
                disabled={startChatMutation.isPending}
                sx={{
                  height: 56,
                  fontWeight: 600,
                  fontSize: "1.1rem",
                }}
              >
                {startChatMutation.isPending ? "시작 중..." : "대화 시작하기"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ open: false, message: "" })}
          message={snackbar.message}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </Container>
    </Box>
  );
}
