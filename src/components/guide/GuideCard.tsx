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
} from '@mui/material';
import {
  Chat as ChatIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { GuideProfile } from '@/types';

interface GuideCardProps {
  guide: GuideProfile;
  onSelect: () => void;
  onChatStart?: () => void;
  variant?: 'default' | 'compact';
}

export const GuideCard: React.FC<GuideCardProps> = ({
  guide,
  onSelect,
  onChatStart,
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
          <Avatar
            src={guide.profileImageUrl}
            sx={{
              width: isCompact ? 48 : 60,
              height: isCompact ? 48 : 60,
              bgcolor: 'primary.main',
            }}
          >
            {guide.nickname.charAt(0)}
          </Avatar>
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
              {guide.email}
            </Typography>
          </Box>
        </Box>

        {/* Location */}
        {guide.location && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationIcon sx={{ fontSize: 18, mr: 0.5, color: 'primary.main' }} />
            <Chip
              label={guide.location}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          </Box>
        )}

        {/* Description */}
        {guide.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: isCompact ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: isCompact ? '2.8em' : '4.2em',
            }}
          >
            {guide.description}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ p: isCompact ? 1 : 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ChatIcon />}
          onClick={(e) => {
            e.stopPropagation();
            if (onChatStart) {
              onChatStart();
            } else {
              onSelect();
            }
          }}
          sx={{
            height: 40,
            fontWeight: 600,
          }}
        >
          대화하기
        </Button>
      </CardActions>
    </Card>
  );
};