"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  Skeleton,
  Alert,
  CircularProgress,
  SelectChangeEvent,
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

export default function GuidesPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

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

  // 고유한 지역 목록 추출
  const locations = useMemo(() => {
    const uniqueLocations = new Set<string>();
    guides.forEach((guide) => {
      if (guide.location) {
        uniqueLocations.add(guide.location);
      }
    });
    return Array.from(uniqueLocations).sort();
  }, [guides]);

  // 필터링된 가이드 목록
  const filteredGuides = useMemo(() => {
    if (selectedLocation === "all") {
      return guides;
    }
    return guides.filter((guide) => guide.location === selectedLocation);
  }, [guides, selectedLocation]);

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

  // 지역 선택 핸들러
  const handleLocationChange = (event: SelectChangeEvent<string>) => {
    setSelectedLocation(event.target.value);
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
          가이드 목록을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Language Selector */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <LanguageSelector />
      </Box>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <ExploreIcon sx={{ fontSize: 40, mr: 2, color: "primary.main" }} />
          <Typography variant="h4" component="h1" fontWeight={600}>
            가이드 찾기
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          전문 가이드와 함께 특별한 여행을 만들어보세요
        </Typography>
      </Box>

      {/* Filter Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="location-filter-label">지역</InputLabel>
                <Select
                  labelId="location-filter-label"
                  id="location-filter"
                  value={selectedLocation}
                  label="지역"
                  onChange={handleLocationChange}
                >
                  <MenuItem value="all">
                    <em>전체 지역</em>
                  </MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <LocationIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  필터:
                </Typography>
                {selectedLocation === "all" ? (
                  <Chip
                    label="전체"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ) : (
                  <Chip
                    label={selectedLocation}
                    size="small"
                    color="primary"
                    onDelete={() => setSelectedLocation("all")}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="text.secondary">
          {selectedLocation === "all"
            ? `총 ${guides.length}명의 가이드`
            : `${selectedLocation} 지역: ${filteredGuides.length}명의 가이드`}
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
                  location: guide.location,
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
            해당 지역에 가이드가 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary">
            다른 지역을 선택해보세요
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
            <Typography variant="body1">채팅방을 생성하는 중...</Typography>
          </Box>
        </Box>
      )}
    </Container>
  );
}
