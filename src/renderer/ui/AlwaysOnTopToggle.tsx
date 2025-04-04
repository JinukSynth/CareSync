import React, { useState } from 'react';
import { Button, Tooltip, Typography, useTheme, useMediaQuery } from '@mui/material';

declare global {
  interface Window {
    electron: {
      maximizeWindow: () => void;
      minimizeWindow: () => void;
      toggleAlwaysOnTop: () => Promise<boolean>;
    };
  }
}

export default function AlwaysOnTopToggle() {
  const [alwaysOnTop, setAlwaysOnTop] = useState(true);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));

  const handleToggle = async () => {
    const newState = await window.electron.toggleAlwaysOnTop();
    setAlwaysOnTop(newState);
  };

  return (
    <Tooltip
      title={
        <Typography variant="caption">
          {`프로그램이 항상 최상위에 위치하도록: ${alwaysOnTop ? "On" : "Off"}`}
        </Typography>
      }
      arrow
    >
      <Button
        onClick={handleToggle}
        variant="outlined"
        size="small"
        sx={{
          minWidth: { xs: 'auto', sm: '120px' },
          height: { xs: 32, sm: 36 },
          px: { xs: 1.5, sm: 2.5 },
          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.815rem' },
          fontWeight: 600,
          borderRadius: '10px',
          border: '1px solid',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          backgroundColor: alwaysOnTop ? 'rgba(37, 99, 235, 0.04)' : 'white',
          borderColor: alwaysOnTop ? '#2563eb' : 'grey.200',
          color: alwaysOnTop ? '#2563eb' : 'grey.600',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: alwaysOnTop
              ? 'rgba(37, 99, 235, 0.08)'
              : 'rgba(59, 130, 246, 0.04)',
            borderColor: alwaysOnTop ? '#2563eb' : '#3b82f6',
            color: alwaysOnTop ? '#2563eb' : '#3b82f6',
            boxShadow: '0 2px 4px rgba(37,99,235,0.06)',
          },
          '&:active': {
            backgroundColor: alwaysOnTop
              ? 'rgba(37, 99, 235, 0.12)'
              : 'rgba(59, 130, 246, 0.08)',
            transform: 'translateY(1px)',
          },
        }}
      >
        {`최상위: ${alwaysOnTop ? "On" : "Off"}`}
      </Button>
    </Tooltip>
  );
}

export {}; // 모듈 인식을 위해 추가