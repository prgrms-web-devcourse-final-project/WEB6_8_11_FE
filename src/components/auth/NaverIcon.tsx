import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

export const NaverIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        fill="#FFFFFF"
        d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"
      />
    </SvgIcon>
  );
};