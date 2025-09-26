'use client';

import React from 'react';
import { Box } from '@mui/material';

interface VideoBackgroundProps {
  videoSrc: string;
  overlayOpacity?: number;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoSrc,
  overlayOpacity = 0.5,
}) => {
  return (
    <>
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -2,
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </Box>

      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, rgba(0, 0, 0, ${overlayOpacity}) 0%, rgba(0, 0, 0, ${overlayOpacity * 0.7}) 100%)`,
          zIndex: -1,
        }}
      />
    </>
  );
};