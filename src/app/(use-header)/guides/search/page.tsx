"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Alert,
  Pagination,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Drawer,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { GuideProfile, GuideSearchFilters, GuideSearchResult } from "@/types";
import { GuideCard } from "@/components/guide/GuideCard";
import { Header } from "@/components/common/Header";
import { useAuth } from "@/hooks/useAuth";

// Mock data for development - same as GuideSearchPage
const mockGuides: GuideProfile[] = [
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
  {
    id: "guide4",
    name: "최지원",
    nickname: "경주가이드",
    email: "guide4@example.com",
    userType: "guide",
    joinDate: new Date("2023-06-05"),
    provider: "google",
    specialties: ["경주관광", "역사문화", "전통문화"],
    description: "천년고도 경주의 역사와 문화를 생생하게 전해드립니다.",
    languages: ["한국어", "영어", "중국어"],
    isOnline: true,
    averageRating: 4.6,
    totalReviews: 87,
    profileImage: "/guide4.jpg",
  },
  {
    id: "guide5",
    name: "정수연",
    nickname: "전주맛집러",
    email: "guide5@example.com",
    userType: "guide",
    joinDate: new Date("2023-04-12"),
    provider: "kakao",
    specialties: ["전주관광", "맛집탐방", "전통문화"],
    description: "전주 한옥마을과 맛집을 누구보다 잘 아는 로컬 가이드입니다.",
    languages: ["한국어", "일본어"],
    isOnline: false,
    averageRating: 4.5,
    totalReviews: 142,
    profileImage: "/guide5.jpg",
  },
];

const specialtyOptions = [
  "서울관광",
  "부산관광",
  "제주관광",
  "경주관광",
  "전주관광",
  "역사문화",
  "해변문화",
  "자연체험",
  "맛집탐방",
  "야경투어",
  "트래킹",
  "쇼핑투어",
  "전통문화",
];

const languageOptions = [
  "한국어",
  "영어",
  "일본어",
  "중국어",
  "스페인어",
  "프랑스어",
];

function GuideSearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuth();

  const query = searchParams.get("q") || "";

  const [filters, setFilters] = useState<GuideSearchFilters>({
    specialties: [],
    languages: [],
    minRating: 0,
    isOnlineOnly: false,
    sortBy: "rating",
    sortOrder: "desc",
  });

  const [searchResult, setSearchResult] = useState<GuideSearchResult | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // 검색 함수
  const searchGuides = useCallback(
    async (
      searchQuery: string,
      searchFilters: GuideSearchFilters,
      currentPage: number
    ) => {
      setLoading(true);
      setError(null);

      try {
        // 실제 API 호출 대신 mock data 사용
        await new Promise((resolve) => setTimeout(resolve, 500));

        let filteredGuides = [...mockGuides];

        // 검색어 필터링
        if (searchQuery.trim()) {
          filteredGuides = filteredGuides.filter(
            (guide) =>
              guide.nickname
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              guide.specialties.some((specialty) =>
                specialty.toLowerCase().includes(searchQuery.toLowerCase())
              ) ||
              guide.description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
          );
        }

        // 필터 적용
        if (searchFilters.specialties && searchFilters.specialties.length > 0) {
          filteredGuides = filteredGuides.filter((guide) =>
            searchFilters.specialties!.some((specialty) =>
              guide.specialties.includes(specialty)
            )
          );
        }

        if (searchFilters.languages && searchFilters.languages.length > 0) {
          filteredGuides = filteredGuides.filter((guide) =>
            searchFilters.languages!.some((language) =>
              guide.languages.includes(language)
            )
          );
        }

        if (searchFilters.minRating && searchFilters.minRating > 0) {
          filteredGuides = filteredGuides.filter(
            (guide) => guide.averageRating >= searchFilters.minRating!
          );
        }

        if (searchFilters.isOnlineOnly) {
          filteredGuides = filteredGuides.filter((guide) => guide.isOnline);
        }

        // 정렬
        if (searchFilters.sortBy) {
          filteredGuides.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (searchFilters.sortBy) {
              case "rating":
                aValue = a.averageRating;
                bValue = b.averageRating;
                break;
              case "reviews":
                aValue = a.totalReviews;
                bValue = b.totalReviews;
                break;
              case "name":
                aValue = a.nickname;
                bValue = b.nickname;
                break;
              case "online":
                aValue = a.isOnline ? 1 : 0;
                bValue = b.isOnline ? 1 : 0;
                break;
              default:
                return 0;
            }

            if (searchFilters.sortOrder === "desc") {
              return bValue > aValue ? 1 : -1;
            } else {
              return aValue > bValue ? 1 : -1;
            }
          });
        }

        const limit = 12;
        const start = (currentPage - 1) * limit;
        const paginatedGuides = filteredGuides.slice(start, start + limit);

        const result: GuideSearchResult = {
          guides: paginatedGuides,
          total: filteredGuides.length,
          page: currentPage,
          limit,
          hasNext: start + limit < filteredGuides.length,
        };

        setSearchResult(result);
      } catch (err) {
        setError("가이드 검색 중 오류가 발생했습니다.");
        console.error("Guide search error:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // URL 파라미터 변경 시 검색
  useEffect(() => {
    if (query) {
      searchGuides(query, filters, page);
    }
  }, [query, filters, page, searchGuides]);

  const handleGuideSelect = (guide: GuideProfile) => {
    router.push(`/guides/${guide.id}`);
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFilters((prev) => ({
      ...prev,
      specialties: prev.specialties?.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...(prev.specialties || []), specialty],
    }));
    setPage(1);
  };

  const handleLanguageToggle = (language: string) => {
    setFilters((prev) => ({
      ...prev,
      languages: prev.languages?.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...(prev.languages || []), language],
    }));
    setPage(1);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setFilters({
      specialties: [],
      languages: [],
      minRating: 0,
      isOnlineOnly: false,
      sortBy: "rating",
      sortOrder: "desc",
    });
    setPage(1);
  };

  const hasActiveFilters =
    (filters.specialties && filters.specialties.length > 0) ||
    (filters.languages && filters.languages.length > 0) ||
    filters.minRating > 0 ||
    filters.isOnlineOnly;

  const renderFilters = () => (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          필터
        </Typography>
        {hasActiveFilters && (
          <Button size="small" startIcon={<ClearIcon />} onClick={clearFilters}>
            초기화
          </Button>
        )}
      </Box>

      {/* 정렬 */}
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <InputLabel>정렬</InputLabel>
        <Select
          value={filters.sortBy}
          label="정렬"
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }));
            setPage(1);
          }}
        >
          <MenuItem value="rating">평점순</MenuItem>
          <MenuItem value="reviews">리뷰수순</MenuItem>
          <MenuItem value="name">이름순</MenuItem>
          <MenuItem value="online">온라인순</MenuItem>
        </Select>
      </FormControl>

      {/* 최소 평점 */}
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <InputLabel>최소 평점</InputLabel>
        <Select
          value={filters.minRating}
          label="최소 평점"
          onChange={(e) => {
            setFilters((prev) => ({
              ...prev,
              minRating: e.target.value as number,
            }));
            setPage(1);
          }}
        >
          <MenuItem value={0}>전체</MenuItem>
          <MenuItem value={4.0}>4.0★ 이상</MenuItem>
          <MenuItem value={4.5}>4.5★ 이상</MenuItem>
          <MenuItem value={4.8}>4.8★ 이상</MenuItem>
        </Select>
      </FormControl>

      {/* 온라인 가이드만 */}
      <FormControlLabel
        control={
          <Switch
            checked={filters.isOnlineOnly}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                isOnlineOnly: e.target.checked,
              }));
              setPage(1);
            }}
          />
        }
        label="온라인 가이드만"
        sx={{ mb: 3 }}
      />

      {/* 전문분야 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          전문분야
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {specialtyOptions.map((specialty) => (
            <Chip
              key={specialty}
              label={specialty}
              onClick={() => handleSpecialtyToggle(specialty)}
              color={
                filters.specialties?.includes(specialty) ? "primary" : "default"
              }
              variant={
                filters.specialties?.includes(specialty) ? "filled" : "outlined"
              }
              size="small"
            />
          ))}
        </Box>
      </Box>

      {/* 지원언어 */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          지원언어
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {languageOptions.map((language) => (
            <Chip
              key={language}
              label={language}
              onClick={() => handleLanguageToggle(language)}
              color={
                filters.languages?.includes(language) ? "secondary" : "default"
              }
              variant={
                filters.languages?.includes(language) ? "filled" : "outlined"
              }
              size="small"
            />
          ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search Header */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h4" component="h1" fontWeight={600}>
              가이드 검색 결과
            </Typography>

            {/* Mobile Filter Button */}
            {isMobile && (
              <IconButton
                onClick={() => setFilterDrawerOpen(true)}
                color="primary"
              >
                <FilterIcon />
              </IconButton>
            )}
          </Box>

          {query && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              <SearchIcon
                sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
              />
              '{query}' 검색 결과
              {searchResult && ` (${searchResult.total}명)`}
            </Typography>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {filters.specialties?.map((specialty) => (
                <Chip
                  key={`spec-${specialty}`}
                  label={specialty}
                  size="small"
                  onDelete={() => handleSpecialtyToggle(specialty)}
                  color="primary"
                />
              ))}
              {filters.languages?.map((language) => (
                <Chip
                  key={`lang-${language}`}
                  label={language}
                  size="small"
                  onDelete={() => handleLanguageToggle(language)}
                  color="secondary"
                />
              ))}
              {filters.minRating > 0 && (
                <Chip
                  label={`${filters.minRating}★ 이상`}
                  size="small"
                  onDelete={() =>
                    setFilters((prev) => ({ ...prev, minRating: 0 }))
                  }
                />
              )}
              {filters.isOnlineOnly && (
                <Chip
                  label="온라인만"
                  size="small"
                  onDelete={() =>
                    setFilters((prev) => ({ ...prev, isOnlineOnly: false }))
                  }
                />
              )}
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Desktop Filters */}
          {!isMobile && (
            <Box sx={{ width: 280, flexShrink: 0 }}>
              <Card>{renderFilters()}</Card>
            </Box>
          )}

          {/* Results */}
          <Box sx={{ flex: 1 }}>
            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Results */}
            {loading ? (
              <Grid container spacing={3}>
                {[...Array(12)].map((_, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={index}>
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
            ) : searchResult && searchResult.guides.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {searchResult.guides.map((guide) => (
                    <Grid item xs={12} sm={6} lg={4} key={guide.id}>
                      <GuideCard
                        guide={guide}
                        onSelect={() => handleGuideSelect(guide)}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {searchResult.total > searchResult.limit && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <Pagination
                      count={Math.ceil(searchResult.total / searchResult.limit)}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                    />
                  </Box>
                )}
              </>
            ) : (
              <Card>
                <CardContent sx={{ textAlign: "center", py: 8 }}>
                  <SearchIcon
                    sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {query
                      ? `'${query}'에 대한 검색 결과가 없습니다`
                      : "검색 조건에 맞는 가이드를 찾을 수 없습니다"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    다른 검색어나 필터 조건을 시도해보세요
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="right"
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: 320,
              maxWidth: "90vw",
            },
          }}
        >
          {renderFilters()}
        </Drawer>
      </Container>
    </Box>
  );
}

export default function GuideSearchPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
          <Header />
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Skeleton variant="rectangular" height={400} />
          </Container>
        </Box>
      }
    >
      <GuideSearchResults />
    </Suspense>
  );
}
