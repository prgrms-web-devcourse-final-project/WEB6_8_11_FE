'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Skeleton,
  Alert,
  Pagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { GuideProfile, GuideSearchFilters, GuideSearchResult } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { GuideCard } from './GuideCard';
import { LanguageSelector } from '@/components/common/LanguageSelector';

interface GuideSearchPageProps {
  onGuideSelect: (guide: GuideProfile) => void;
  onBack: () => void;
}

// Mock data for development
const mockGuides: GuideProfile[] = [
  {
    id: 'guide1',
    name: '김민수',
    nickname: '서울전문가',
    email: 'guide1@example.com',
    userType: 'guide',
    joinDate: new Date('2023-01-15'),
    provider: 'google',
    specialties: ['서울관광', '역사문화', '맛집탐방'],
    description: '서울의 숨겨진 명소와 맛집을 소개해드립니다.',
    languages: ['한국어', '영어'],
    isOnline: true,
    averageRating: 4.8,
    totalReviews: 156,
    profileImage: '/guide1.jpg',
  },
  {
    id: 'guide2',
    name: '이영희',
    nickname: '부산가이드',
    email: 'guide2@example.com',
    userType: 'guide',
    joinDate: new Date('2023-03-20'),
    provider: 'kakao',
    specialties: ['부산관광', '해변문화', '야경투어'],
    description: '부산의 아름다운 바다와 야경을 함께 즐겨보세요.',
    languages: ['한국어', '일본어', '영어'],
    isOnline: false,
    averageRating: 4.9,
    totalReviews: 203,
    profileImage: '/guide2.jpg',
  },
  {
    id: 'guide3',
    name: '박철수',
    nickname: '제주마스터',
    email: 'guide3@example.com',
    userType: 'guide',
    joinDate: new Date('2022-11-10'),
    provider: 'naver',
    specialties: ['제주관광', '자연체험', '트래킹'],
    description: '제주도의 자연과 함께하는 특별한 여행을 만들어드립니다.',
    languages: ['한국어', '중국어'],
    isOnline: true,
    averageRating: 4.7,
    totalReviews: 98,
    profileImage: '/guide3.jpg',
  },
];

const specialtyOptions = [
  '서울관광', '부산관광', '제주관광', '경주관광',
  '역사문화', '해변문화', '자연체험', '맛집탐방',
  '야경투어', '트래킹', '쇼핑투어', '전통문화'
];

const languageOptions = [
  '한국어', '영어', '일본어', '중국어', '스페인어', '프랑스어'
];

export const GuideSearchPage: React.FC<GuideSearchPageProps> = ({
  onGuideSelect,
  onBack,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<GuideSearchFilters>({
    specialties: [],
    languages: [],
    minRating: 0,
    isOnlineOnly: false,
    sortBy: 'rating',
    sortOrder: 'desc',
  });
  const [searchResult, setSearchResult] = useState<GuideSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // 검색 함수 (디바운싱 적용)
  const searchGuides = useCallback(async (query: string, searchFilters: GuideSearchFilters, currentPage: number) => {
    setLoading(true);
    setError(null);

    try {
      // 실제 API 호출 대신 mock data 사용
      await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션

      let filteredGuides = [...mockGuides];

      // 검색어 필터링
      if (query.trim()) {
        filteredGuides = filteredGuides.filter(guide =>
          guide.nickname.toLowerCase().includes(query.toLowerCase()) ||
          guide.name.toLowerCase().includes(query.toLowerCase()) ||
          guide.specialties.some(specialty =>
            specialty.toLowerCase().includes(query.toLowerCase())
          )
        );
      }

      // 전문분야 필터링
      if (searchFilters.specialties && searchFilters.specialties.length > 0) {
        filteredGuides = filteredGuides.filter(guide =>
          searchFilters.specialties!.some(specialty =>
            guide.specialties.includes(specialty)
          )
        );
      }

      // 언어 필터링
      if (searchFilters.languages && searchFilters.languages.length > 0) {
        filteredGuides = filteredGuides.filter(guide =>
          searchFilters.languages!.some(language =>
            guide.languages.includes(language)
          )
        );
      }

      // 평점 필터링
      if (searchFilters.minRating && searchFilters.minRating > 0) {
        filteredGuides = filteredGuides.filter(guide =>
          guide.averageRating >= searchFilters.minRating!
        );
      }

      // 온라인 상태 필터링
      if (searchFilters.isOnlineOnly) {
        filteredGuides = filteredGuides.filter(guide => guide.isOnline);
      }

      // 정렬
      if (searchFilters.sortBy) {
        filteredGuides.sort((a, b) => {
          let aValue: any, bValue: any;

          switch (searchFilters.sortBy) {
            case 'rating':
              aValue = a.averageRating;
              bValue = b.averageRating;
              break;
            case 'reviews':
              aValue = a.totalReviews;
              bValue = b.totalReviews;
              break;
            case 'name':
              aValue = a.nickname;
              bValue = b.nickname;
              break;
            case 'online':
              aValue = a.isOnline ? 1 : 0;
              bValue = b.isOnline ? 1 : 0;
              break;
            default:
              return 0;
          }

          if (searchFilters.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          } else {
            return aValue > bValue ? 1 : -1;
          }
        });
      }

      const limit = 6;
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
      setError('가이드 검색 중 오류가 발생했습니다.');
      console.error('Guide search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 디바운싱된 검색
  useEffect(() => {
    const timer = setTimeout(() => {
      searchGuides(searchQuery, filters, page);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, page, searchGuides]);

  const handleSpecialtyToggle = (specialty: string) => {
    setFilters(prev => ({
      ...prev,
      specialties: prev.specialties?.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...(prev.specialties || []), specialty]
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages?.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...(prev.languages || []), language]
    }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <LanguageSelector />
      </Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
            🧭 가이드 찾기
          </Typography>
          <Typography variant="body1" color="text.secondary">
            전문 가이드와 함께 특별한 여행을 만들어보세요
          </Typography>
        </Box>

        {/* Search Bar */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="가이드 이름이나 전문분야로 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Filters */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>정렬</InputLabel>
                  <Select
                    value={filters.sortBy}
                    label="정렬"
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  >
                    <MenuItem value="rating">평점순</MenuItem>
                    <MenuItem value="reviews">리뷰수순</MenuItem>
                    <MenuItem value="name">이름순</MenuItem>
                    <MenuItem value="online">온라인순</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>최소 평점</InputLabel>
                  <Select
                    value={filters.minRating}
                    label="최소 평점"
                    onChange={(e) => setFilters(prev => ({ ...prev, minRating: e.target.value as number }))}
                  >
                    <MenuItem value={0}>전체</MenuItem>
                    <MenuItem value={4.0}>4.0★ 이상</MenuItem>
                    <MenuItem value={4.5}>4.5★ 이상</MenuItem>
                    <MenuItem value={4.8}>4.8★ 이상</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.isOnlineOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, isOnlineOnly: e.target.checked }))}
                    />
                  }
                  label="온라인 가이드만"
                />
              </Grid>
            </Grid>

            {/* Specialty Filters */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>전문분야</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {specialtyOptions.map((specialty) => (
                  <Chip
                    key={specialty}
                    label={specialty}
                    onClick={() => handleSpecialtyToggle(specialty)}
                    color={filters.specialties?.includes(specialty) ? 'primary' : 'default'}
                    variant={filters.specialties?.includes(specialty) ? 'filled' : 'outlined'}
                    size="small"
                  />
                ))}
              </Box>
            </Box>

            {/* Language Filters */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>지원언어</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {languageOptions.map((language) => (
                  <Chip
                    key={language}
                    label={language}
                    onClick={() => handleLanguageToggle(language)}
                    color={filters.languages?.includes(language) ? 'secondary' : 'default'}
                    variant={filters.languages?.includes(language) ? 'filled' : 'outlined'}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Results */}
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="circular" width={60} height={60} sx={{ mx: 'auto', mb: 2 }} />
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
            <Typography variant="h6" gutterBottom>
              총 {searchResult.total}명의 가이드를 찾았습니다
            </Typography>
            <Grid container spacing={3}>
              {searchResult.guides.map((guide) => (
                <Grid item xs={12} sm={6} md={4} key={guide.id}>
                  <GuideCard
                    guide={guide}
                    onSelect={() => onGuideSelect(guide)}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {searchResult.total > searchResult.limit && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={Math.ceil(searchResult.total / searchResult.limit)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              검색 조건에 맞는 가이드를 찾을 수 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary">
              다른 검색어나 필터 조건을 시도해보세요
            </Typography>
          </Box>
        )}
    </Container>
  );
};