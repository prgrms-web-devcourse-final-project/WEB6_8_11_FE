"use client";

import React, { useState, useMemo, Suspense } from "react";
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
  Button,
  Drawer,
  useMediaQuery,
  useTheme,
  IconButton,
  Snackbar,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { GuideProfile, LocationCode, LOCATION_LABELS } from "@/types";
import { GuideCard } from "@/components/guide/GuideCard";
import { Header } from "@/components/common/Header";
import { useAuth } from "@/hooks/useAuth";
import { useGetAllGuides, type GuideResponse } from "@/hooks/api";
import { useStartChat } from "@/hooks/api/useUserChat";

interface GuideSearchFilters {
  locations: string[];
  sortBy: "name" | "recent";
  sortOrder: "asc" | "desc";
}

/**
 * Convert API GuideResponse to GuideProfile type
 */
const convertGuideResponseToProfile = (guide: GuideResponse): GuideProfile => {
  return {
    id: guide.id,
    email: guide.email,
    nickname: guide.nickname || guide.email,
    profileImageUrl: guide.profileImageUrl,
    role: guide.role,
    location: guide.location,
    description: guide.description,
    // Legacy fields for compatibility
    name: guide.nickname || guide.email,
    userType: 'guide',
  };
};

function GuideSearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuth();

  const query = searchParams.get("q") || "";

  const [filters, setFilters] = useState<GuideSearchFilters>({
    locations: [],
    sortBy: "name",
    sortOrder: "asc",
  });

  const [page, setPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // Fetch guides from API
  const { data: guidesData, isLoading, error: apiError } = useGetAllGuides();
  const guides = guidesData?.data || [];

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

  // Get unique locations from guides
  const availableLocations = useMemo(() => {
    const locations = guides
      .map((g) => g.location)
      .filter((loc): loc is LocationCode => !!loc);
    return Array.from(new Set(locations)).sort();
  }, [guides]);

  // Convert API guides to GuideProfile format and apply filters
  const { filteredGuides, totalCount, paginatedGuides } = useMemo(() => {
    let filtered = guides.map(convertGuideResponseToProfile);

    // Apply search query filter
    if (query.trim()) {
      filtered = filtered.filter(
        (guide) =>
          guide.nickname.toLowerCase().includes(query.toLowerCase()) ||
          guide.email.toLowerCase().includes(query.toLowerCase()) ||
          guide.location?.toLowerCase().includes(query.toLowerCase()) ||
          guide.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply location filter
    if (filters.locations.length > 0) {
      filtered = filtered.filter((guide) =>
        guide.location && filters.locations.includes(guide.location)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      if (filters.sortBy === "name") {
        aValue = a.nickname.toLowerCase();
        bValue = b.nickname.toLowerCase();
      } else {
        // "recent" - sort by id (assuming higher id = more recent)
        aValue = a.id;
        bValue = b.id;
      }

      if (filters.sortOrder === "desc") {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    // Pagination
    const limit = 12;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      filteredGuides: filtered,
      totalCount: filtered.length,
      paginatedGuides: paginated,
    };
  }, [guides, query, filters, page]);

  const handleGuideSelect = (guide: GuideProfile) => {
    router.push(`/guides/${guide.id}`);
  };

  const handleChatStart = (guide: GuideProfile) => {
    if (!user) {
      setSnackbar({
        open: true,
        message: "로그인이 필요합니다.",
      });
      return;
    }

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

  const handleLocationToggle = (location: string) => {
    setFilters((prev) => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter((l) => l !== location)
        : [...prev.locations, location],
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
      locations: [],
      sortBy: "name",
      sortOrder: "asc",
    });
    setPage(1);
  };

  const hasActiveFilters = filters.locations.length > 0;

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
            setFilters((prev) => ({
              ...prev,
              sortBy: e.target.value as "name" | "recent"
            }));
            setPage(1);
          }}
        >
          <MenuItem value="name">이름순</MenuItem>
          <MenuItem value="recent">최신순</MenuItem>
        </Select>
      </FormControl>

      {/* 활동 지역 */}
      {availableLocations.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            활동 지역
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {availableLocations.map((location) => (
              <Chip
                key={location}
                label={LOCATION_LABELS[location] || location}
                onClick={() => handleLocationToggle(location)}
                color={
                  filters.locations.includes(location) ? "primary" : "default"
                }
                variant={
                  filters.locations.includes(location) ? "filled" : "outlined"
                }
                size="small"
              />
            ))}
          </Box>
        </Box>
      )}
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
              '{query}' 검색 결과 ({totalCount}명)
            </Typography>
          )}

          {!query && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              전체 가이드 {totalCount}명
            </Typography>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {filters.locations.map((location) => (
                <Chip
                  key={`loc-${location}`}
                  label={location}
                  size="small"
                  onDelete={() => handleLocationToggle(location)}
                  color="primary"
                />
              ))}
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
            {apiError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                가이드 정보를 불러오는 중 오류가 발생했습니다.
              </Alert>
            )}

            {/* Loading State */}
            {isLoading ? (
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
            ) : paginatedGuides.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {paginatedGuides.map((guide) => (
                    <Grid item xs={12} sm={6} lg={4} key={guide.id}>
                      <GuideCard
                        guide={guide}
                        onSelect={() => handleGuideSelect(guide)}
                        onChatStart={() => handleChatStart(guide)}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {totalCount > 12 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <Pagination
                      count={Math.ceil(totalCount / 12)}
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
