"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Card,
  CardContent,
  Skeleton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Explore as ExploreIcon,
} from "@mui/icons-material";
import { useGetAllGuides } from "@/hooks/api/useGuides";
import { useStartChat } from "@/hooks/api/useUserChat";
import { useAuth } from "@/hooks/useAuth";
import { GuideCard } from "@/components/guide/GuideCard";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";
import type { GuideResponse } from "@/lib/generated";

import { LocationName, LOCATION_HIERARCHY, convertLegacyLocationToName } from "@/types";

export default function GuidesPage() {
  const router = useRouter();
  const { t, translateLocation } = useTranslation();
  const { user } = useAuth();
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(
    new Set()
  );

  // 가이드 목록 조회
  const { data: guidesResponse, isLoading, error } = useGetAllGuides();

  // 채팅 시작 mutation
  const startChatMutation = useStartChat({
    onSuccess: (response) => {
      const roomId = response.data?.data?.id;
      if (roomId) {
        router.push(`/chat/${roomId}`);
      }
    },
    onError: (error) => {
      console.error("Failed to start chat:", error);
    },
  });

  // 가이드 데이터 추출
  const guides = guidesResponse?.data || [];

  // 필터링된 가이드 목록
  const filteredGuides = useMemo(() => {
    if (selectedLocations.size === 0) {
      return guides;
    }
    return guides.filter(
      (guide) => guide.location && selectedLocations.has(guide.location)
    );
  }, [guides, selectedLocations]);

  // 가이드 프로필 보기
  const handleGuideSelect = (guide: GuideResponse) => {
    router.push(`/guides/${guide.id}`);
  };

  // 채팅 시작
  const handleChatStart = (guide: GuideResponse) => {
    if (!user?.id) {
      router.push("/login");
      return;
    }

    startChatMutation.mutate({
      guideId: guide.id,
      userId: Number(user.id),
    });
  };

  // 전체 체크박스 핸들러
  const handleAllToggle = () => {
    // 전체를 클릭하면 모든 선택 해제
    setSelectedLocations(new Set());
  };

  // 개별 지역 체크박스 핸들러
  const handleLocationToggle = (location: string) => {
    const newSelected = new Set(selectedLocations);
    if (newSelected.has(location)) {
      newSelected.delete(location);
    } else {
      newSelected.add(location);
    }
    setSelectedLocations(newSelected);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <LanguageSelector />
        </Box>
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={80} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Skeleton
                    variant="circular"
                    width={60}
                    height={60}
                    sx={{ mx: "auto", mb: 2 }}
                  />
                  <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                  <Skeleton variant="text" height={24} sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" height={80} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <LanguageSelector />
        </Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {t("guide.loadError")}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <ExploreIcon sx={{ fontSize: 40, mr: 2, color: "primary.main" }} />
          <Typography variant="h4" component="h1" fontWeight={600}>
            {t("guide.findGuides")}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {t("guide.findGuidesDescription")}
        </Typography>
      </Box>

      {/* Filter Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationIcon sx={{ fontSize: 20, mr: 1, color: "primary.main" }} />
              <Typography variant="h6" fontWeight={600}>
                {t("guide.locationFilter")}
              </Typography>
            </Box>

            {/* 칩 형태의 필터 - 계층 구조 */}
            <Box>
              {/* 전체 칩 */}
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={t("guide.all")}
                  onClick={handleAllToggle}
                  color={selectedLocations.size === 0 ? "primary" : "default"}
                  variant={selectedLocations.size === 0 ? "filled" : "outlined"}
                  sx={{
                    fontWeight: selectedLocations.size === 0 ? 600 : 400,
                  }}
                />
              </Box>

              {/* 시/도별 그룹화된 칩들 */}
              {LOCATION_HIERARCHY.map((region) => (
                <Box key={region.province} sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mb: 1,
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    {region.province}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {region.cities.map((city) => (
                      <Chip
                        key={city}
                        label={city}
                        onClick={() => handleLocationToggle(city)}
                        color={selectedLocations.has(city) ? "primary" : "default"}
                        variant={selectedLocations.has(city) ? "filled" : "outlined"}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="text.secondary">
          {selectedLocations.size === 0
            ? t("guide.totalGuides", { count: String(guides.length) })
            : t("guide.selectedGuides", { count: String(filteredGuides.length) })}
        </Typography>
      </Box>

      {/* Guide Grid */}
      {filteredGuides.length > 0 ? (
        <Grid container spacing={3}>
          {filteredGuides.map((guide) => (
            <Grid item xs={12} sm={6} md={4} key={guide.id}>
              <GuideCard
                guide={{
                  id: guide.id,
                  email: guide.email,
                  nickname: guide.nickname,
                  profileImageUrl: guide.profileImageUrl,
                  role: guide.role,
                  location: convertLegacyLocationToName(guide.location),
                  description: guide.description,
                }}
                onSelect={() => handleGuideSelect(guide)}
                onChatStart={() => handleChatStart(guide)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
          }}
        >
          <LocationIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t("guide.noGuidesInRegion")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("guide.tryOtherRegions")}
          </Typography>
        </Box>
      )}

      {/* Loading overlay for chat start */}
      {startChatMutation.isPending && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
            }}
          >
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body1">{t("guide.creatingChatRoom")}</Typography>
          </Box>
        </Box>
      )}
    </Container>
  );
}
