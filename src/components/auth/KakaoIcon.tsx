import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

export const KakaoIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        fill="#000000"
        d="M12 3C6.486 3 2 6.262 2 10.333c0 2.653 1.727 4.98 4.333 6.373-.173.637-.566 2.097-.651 2.433-.098.387.142.382.298.277.119-.08 1.903-1.281 2.635-1.779.618.084 1.256.128 1.918.128 5.514 0 9.967-3.262 9.967-7.279C21.5 6.262 17.514 3 12 3z"
      />
    </SvgIcon>
  );
};