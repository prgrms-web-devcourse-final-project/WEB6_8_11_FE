"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  EmojiEvents as AwardIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { GuideProfile } from "@/types";
import { GuideCard } from "@/components/guide/GuideCard";
import { Header } from "@/components/common/Header";
import { useAuth } from "@/hooks/useAuth";

// Top guides data
const topGuides: GuideProfile[] = [
  {
    id: "guide1",
    name: "김민수",
    nickname: "서울전문가",
    email: "guide1@example.com",
    userType: "guide",
    joinDate: new Date("2023-01-15"),
    provider: "google",
    specialties: ["서울관광", "역사문화", "맛집탐방"],
    description: "서울의 숨겨진 명소와 맛집을 소개해드립니다.",
    languages: ["한국어", "영어"],
    isOnline: true,
    averageRating: 4.8,
    totalReviews: 156,
    profileImage: "/guide1.jpg",
  },
  {
    id: "guide2",
    name: "이영희",
    nickname: "부산가이드",
    email: "guide2@example.com",
    userType: "guide",
    joinDate: new Date("2023-03-20"),
    provider: "kakao",
    specialties: ["부산관광", "해변문화", "야경투어"],
    description: "부산의 아름다운 바다와 야경을 함께 즐겨보세요.",
    languages: ["한국어", "일본어", "영어"],
    isOnline: false,
    averageRating: 4.9,
    totalReviews: 203,
    profileImage: "/guide2.jpg",
  },
  {
    id: "guide3",
    name: "박철수",
    nickname: "제주마스터",
    email: "guide3@example.com",
    userType: "guide",
    joinDate: new Date("2022-11-10"),
    provider: "naver",
    specialties: ["제주관광", "자연체험", "트래킹"],
    description: "제주도의 자연과 함께하는 특별한 여행을 만들어드립니다.",
    languages: ["한국어", "중국어"],
    isOnline: true,
    averageRating: 4.7,
    totalReviews: 98,
    profileImage: "/guide3.jpg",
  },
];

const popularSpecialties = [
  { name: "서울관광", count: 45, icon: "🏛️" },
  { name: "맛집탐방", count: 38, icon: "🍜" },
  { name: "부산관광", count: 32, icon: "🌊" },
  { name: "제주관광", count: 28, icon: "🌴" },
  { name: "역사문화", count: 25, icon: "📚" },
  { name: "자연체험", count: 22, icon: "🏔️" },
];

const stats = [
  { label: "총 가이드 수", value: "150+", icon: <AwardIcon /> },
  { label: "평균 평점", value: "4.7★", icon: <StarIcon /> },
  { label: "온라인 가이드", value: "89", icon: <ScheduleIcon /> },
  { label: "이번 달 신규", value: "12", icon: <TrendingIcon /> },
];

export default function GuidesPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleGuideSelect = (guide: GuideProfile) => {
    router.push(`/guides/${guide.id}`);
  };

  const handleSearchAll = () => {
    router.push("/guides/search");
  };

  const handleSpecialtyClick = (specialty: string) => {
    router.push(`/guides/search?specialties=${encodeURIComponent(specialty)}`);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            gutterBottom
            sx={{
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🧭 전문 가이드 찾기
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            한국 여행의 특별한 순간을 함께할 전문 가이드들을 만나보세요
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            onClick={handleSearchAll}
            sx={{ mt: 2, px: 4, py: 1.5 }}
          >
            모든 가이드 검색하기
          </Button>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  py: 2,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-2px)" },
                }}
              >
                <CardContent>
                  <Box sx={{ color: "primary.main", mb: 1 }}>{stat.icon}</Box>
                  <Typography
                    variant="h4"
                    fontWeight={600}
                    color="primary.main"
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Top Rated Guides */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            ⭐ 인기 가이드
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            높은 평점과 많은 리뷰를 받은 인기 가이드들입니다
          </Typography>

          <Grid container spacing={3}>
            {topGuides.map((guide) => (
              <Grid item xs={12} sm={6} md={4} key={guide.id}>
                <GuideCard
                  guide={guide}
                  onSelect={() => handleGuideSelect(guide)}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button variant="outlined" size="large" onClick={handleSearchAll}>
              더 많은 가이드 보기
            </Button>
          </Box>
        </Box>

        {/* Popular Specialties */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            🏷️ 인기 전문분야
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            많은 가이드들이 전문으로 하는 인기 분야들을 확인해보세요
          </Typography>

          <Grid container spacing={2}>
            {popularSpecialties.map((specialty, index) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => handleSpecialtyClick(specialty.name)}
                >
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {specialty.icon}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      gutterBottom
                    >
                      {specialty.name}
                    </Typography>
                    <Chip
                      label={`${specialty.count}명`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* How it Works */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            fontWeight={600}
            gutterBottom
            textAlign="center"
          >
            🚀 이용 방법
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 4 }}
          >
            간단한 3단계로 전문 가이드와 함께하는 특별한 여행을 시작하세요
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: "center", p: 3, height: "100%" }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: "primary.main",
                    mx: "auto",
                    mb: 2,
                    fontSize: "24px",
                  }}
                >
                  1️⃣
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  가이드 검색
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  원하는 지역이나 전문분야로 가이드를 검색하고 프로필을
                  확인해보세요
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: "center", p: 3, height: "100%" }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: "success.main",
                    mx: "auto",
                    mb: 2,
                    fontSize: "24px",
                  }}
                >
                  2️⃣
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  실시간 채팅
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  온라인 가이드와 실시간 채팅으로 여행 계획을 상담받으세요
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: "center", p: 3, height: "100%" }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: "warning.main",
                    mx: "auto",
                    mb: 2,
                    fontSize: "24px",
                  }}
                >
                  3️⃣
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  리뷰 작성
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  가이드 서비스 후 리뷰를 작성해서 다른 여행자들에게 도움을
                  주세요
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Call to Action */}
        <Card
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            textAlign: "center",
            p: 6,
          }}
        >
          <Typography variant="h4" fontWeight={600} gutterBottom>
            지금 바로 시작해보세요! 🎉
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            완벽한 가이드와 함께하는 특별한 한국 여행
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleSearchAll}
            sx={{
              bgcolor: "white",
              color: "primary.main",
              px: 4,
              py: 1.5,
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}
          >
            가이드 검색하기
          </Button>
        </Card>
      </Container>
    </Box>
  );
}
