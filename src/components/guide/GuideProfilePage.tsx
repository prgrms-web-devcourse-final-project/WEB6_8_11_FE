'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Button,
  Divider,
  Rating,
  Chip,
  Grid,
  Paper,
  LinearProgress,
  Pagination,
  Alert,
  Badge,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Chat as ChatIcon,
  Star as StarIcon,
  Person as PersonIcon,
  Language as LanguageIcon,
  CalendarToday as CalendarIcon,
  Circle as CircleIcon,
  LocationOn as LocationIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { GuideProfile, GuideReview } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSelector } from '@/components/common/LanguageSelector';

interface GuideProfilePageProps {
  guide: GuideProfile;
  reviews: GuideReview[];
  onBack: () => void;
  onStartChat: () => void;
  totalReviews?: number;
  averageRating?: number;
}

// Mock reviews for development
const mockReviews: GuideReview[] = [
  {
    id: 'review1',
    guideId: 'guide1',
    userId: 'user1',
    userName: '김철수',
    userAvatar: '/user1.jpg',
    rating: 5,
    review: '정말 친절하고 전문적인 가이드였습니다. 서울의 숨겨진 명소들을 알려주셔서 특별한 여행이 되었어요. 강력 추천합니다!',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'review2',
    guideId: 'guide1',
    userId: 'user2',
    userName: '이영희',
    userAvatar: '/user2.jpg',
    rating: 4,
    review: '가이드님 덕분에 맛있는 음식점들을 많이 알게 되었어요. 다음에도 또 부탁드리고 싶습니다.',
    createdAt: new Date('2024-01-18'),
  },
  {
    id: 'review3',
    guideId: 'guide1',
    userId: 'user3',
    userName: '박민수',
    userAvatar: '/user3.jpg',
    rating: 5,
    review: '역사에 대한 지식이 풍부하시고 설명도 재미있게 해주셔서 지루하지 않았습니다.',
    createdAt: new Date('2024-01-15'),
  },
];

const getRatingDistribution = (reviews: GuideReview[]) => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++;
  });

  const total = reviews.length;
  return Object.entries(distribution).map(([rating, count]) => ({
    rating: parseInt(rating),
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
  })).reverse();
};

export const GuideProfilePage: React.FC<GuideProfilePageProps> = ({
  guide,
  reviews = mockReviews,
  onBack,
  onStartChat,
  totalReviews,
  averageRating,
}) => {
  const { t } = useTranslation();
  const [reviewPage, setReviewPage] = useState(1);
  const reviewsPerPage = 5;

  const ratingDistribution = getRatingDistribution(reviews);
  const displayedReviews = reviews.slice(
    (reviewPage - 1) * reviewsPerPage,
    reviewPage * reviewsPerPage
  );

  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
    }).format(date);
  };

  const formatReviewDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <LanguageSelector />
      </Box>
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ color: 'text.secondary' }}
          >
            {t('common.back')}
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Guide Info */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ position: 'sticky', top: 20 }}>
              <CardContent sx={{ p: 3 }}>
                {/* Profile Header */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <CircleIcon
                        sx={{
                          color: guide.isOnline ? 'success.main' : 'grey.400',
                          fontSize: 20,
                          bgcolor: 'background.paper',
                          borderRadius: '50%',
                        }}
                      />
                    }
                  >
                    <Avatar
                      src={guide.profileImage}
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: 'primary.main',
                        mb: 2,
                        border: '4px solid',
                        borderColor: 'background.paper',
                        boxShadow: 3,
                      }}
                    >
                      {!guide.profileImage && guide.nickname.charAt(0)}
                    </Avatar>
                  </Badge>

                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {guide.nickname}
                    <VerifiedIcon sx={{ ml: 1, color: 'primary.main', fontSize: 20 }} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {guide.name}
                  </Typography>

                  {/* Online Status */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <CircleIcon
                      sx={{
                        color: guide.isOnline ? 'success.main' : 'grey.400',
                        fontSize: 12,
                        mr: 0.5,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {guide.isOnline ? '온라인' : '오프라인'}
                    </Typography>
                  </Box>

                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Rating
                      value={averageRating || guide.averageRating}
                      precision={0.1}
                      readOnly
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="h6" fontWeight={600}>
                      {(averageRating || guide.averageRating).toFixed(1)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {totalReviews || guide.totalReviews}개 리뷰
                  </Typography>
                </Box>

                {/* Description */}
                {guide.description && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {guide.description}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Details */}
                <Stack spacing={2}>
                  {/* Specialties */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      전문분야
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {guide.specialties.map((specialty, index) => (
                        <Chip
                          key={index}
                          label={specialty}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Languages */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      지원언어
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LanguageIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {guide.languages.join(', ')}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Join Date */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      가입일
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatJoinDate(guide.joinDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* Action Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<ChatIcon />}
                  onClick={onStartChat}
                  disabled={!guide.isOnline}
                  sx={{ height: 48, fontWeight: 600 }}
                >
                  {guide.isOnline ? '채팅 시작' : '오프라인'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Reviews */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              리뷰 ({totalReviews || guide.totalReviews})
            </Typography>

            {/* Rating Overview */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" fontWeight={600} color="primary.main">
                        {(averageRating || guide.averageRating).toFixed(1)}
                      </Typography>
                      <Rating
                        value={averageRating || guide.averageRating}
                        precision={0.1}
                        readOnly
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {totalReviews || guide.totalReviews}개 리뷰
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={8}>
                    <Stack spacing={1}>
                      {ratingDistribution.map(({ rating, count, percentage }) => (
                        <Box key={rating} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 60 }}>
                            <Typography variant="body2">{rating}</Typography>
                            <StarIcon sx={{ fontSize: 16, ml: 0.5 }} />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{ flex: 1, height: 8, borderRadius: 1 }}
                          />
                          <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'right' }}>
                            {count}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Reviews List */}
            {displayedReviews.length > 0 ? (
              <Stack spacing={2}>
                {displayedReviews.map((review) => (
                  <Card key={review.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar src={review.userAvatar} sx={{ width: 40, height: 40 }}>
                          {review.userName.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {review.userName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatReviewDate(review.createdAt)}
                            </Typography>
                          </Box>
                          <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
                          {review.review && (
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                              {review.review}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}

                {/* Pagination */}
                {reviews.length > reviewsPerPage && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={Math.ceil(reviews.length / reviewsPerPage)}
                      page={reviewPage}
                      onChange={(event, value) => setReviewPage(value)}
                      color="primary"
                    />
                  </Box>
                )}
              </Stack>
            ) : (
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <StarIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    아직 리뷰가 없습니다
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    이 가이드와 첫 번째 채팅을 시작해보세요!
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
    </Container>
  );
};