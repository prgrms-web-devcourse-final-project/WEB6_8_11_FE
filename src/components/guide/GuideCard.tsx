'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Box,
  Chip,
  Button,
  Rating,
  Badge,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Star as StarIcon,
  Circle as CircleIcon,
  Language as LanguageIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { GuideProfile } from '@/types';

interface GuideCardProps {
  guide: GuideProfile;
  onSelect: () => void;
  variant?: 'default' | 'compact';
}

export const GuideCard: React.FC<GuideCardProps> = ({
  guide,
  onSelect,
  variant = 'default',
}) => {
  const isCompact = variant === 'compact';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        cursor: 'pointer',
      }}
      onClick={onSelect}
    >
      <CardContent sx={{ flex: 1, p: isCompact ? 2 : 3 }}>
        {/* Profile Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <CircleIcon
                sx={{
                  color: guide.isOnline ? 'success.main' : 'grey.400',
                  fontSize: 16,
                  bgcolor: 'background.paper',
                  borderRadius: '50%',
                }}
              />
            }
          >
            <Avatar
              src={guide.profileImage}
              sx={{
                width: isCompact ? 48 : 60,
                height: isCompact ? 48 : 60,
                bgcolor: 'primary.main',
              }}
            >
              {guide.nickname.charAt(0)}
            </Avatar>
          </Badge>
          <Box sx={{ ml: 2, flex: 1 }}>
            <Typography
              variant={isCompact ? 'body1' : 'h6'}
              component="h3"
              fontWeight={600}
              noWrap
            >
              {guide.nickname}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
            >
              {guide.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <CircleIcon
                sx={{
                  color: guide.isOnline ? 'success.main' : 'grey.400',
                  fontSize: 12,
                  mr: 0.5,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {guide.isOnline ? '온라인' : '오프라인'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating
            value={guide.averageRating}
            precision={0.1}
            readOnly
            size={isCompact ? 'small' : 'medium'}
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" fontWeight={500}>
            {guide.averageRating.toFixed(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({guide.totalReviews}개 리뷰)
          </Typography>
        </Box>

        {/* Description */}
        {!isCompact && guide.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {guide.description}
          </Typography>
        )}

        {/* Specialties */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            전문분야
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {guide.specialties.slice(0, isCompact ? 2 : 3).map((specialty, index) => (
              <Chip
                key={index}
                label={specialty}
                size="small"
                variant="outlined"
                sx={{ height: 24, fontSize: '0.75rem' }}
              />
            ))}
            {guide.specialties.length > (isCompact ? 2 : 3) && (
              <Chip
                label={`+${guide.specialties.length - (isCompact ? 2 : 3)}`}
                size="small"
                variant="outlined"
                sx={{ height: 24, fontSize: '0.75rem' }}
              />
            )}
          </Box>
        </Box>

        {/* Languages */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LanguageIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {guide.languages.join(', ')}
          </Typography>
        </Box>

        {/* Join Date */}
        <Typography variant="caption" color="text.secondary">
          가입일: {new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'short',
          }).format(guide.joinDate)}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: isCompact ? 1 : 2, pt: 0 }}>
        <Button
          fullWidth
          variant={guide.isOnline ? 'contained' : 'outlined'}
          startIcon={<ChatIcon />}
          disabled={!guide.isOnline}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          sx={{
            height: 40,
            fontWeight: 600,
          }}
        >
          {guide.isOnline ? '채팅 시작' : '오프라인'}
        </Button>
      </CardActions>
    </Card>
  );
};