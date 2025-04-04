import React from 'react';
import { Button, Tooltip, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useEditMode } from '../context/EditModeContext';
import { Edit, EditOff } from '@mui/icons-material';

export default function EditModeToggle() {
  const { isEditMode, toggleEditMode } = useEditMode();
  const titleText = isEditMode ? '사용 모드로 전환' : '조작 모드로 전환';

  // Material-UI 테마와 브레이크포인트 활용
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));

  return (
    <Tooltip
      title={<Typography variant="caption">{titleText}</Typography>}
      arrow
    >
      <Button
        onClick={toggleEditMode}
        variant="outlined"
        startIcon={
          isEditMode 
            ? <EditOff sx={{ fontSize: { xs: 16, sm: 18 } }} />
            : <Edit sx={{ fontSize: { xs: 16, sm: 18 } }} />
        }
        sx={{
          /**
           * 화면 크기에 따라 버튼 크기/여백이 달라지도록 설정
           */
          minWidth: { xs: 'auto', sm: '120px' }, // xs에서는 최소 너비를 'auto'로, sm 이상에서는 120px
          height: { xs: 32, sm: 36 },            // xs에서는 32px, sm 이상에서는 36px
          px: { xs: 1.5, sm: 2.5 },              // 좌우 여백
          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.815rem' },
          fontWeight: 600,
          borderRadius: '10px',
          border: '1px solid',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          backgroundColor: isEditMode ? 'rgba(37, 99, 235, 0.04)' : 'white',
          borderColor: isEditMode ? '#2563eb' : 'grey.200',
          color: isEditMode ? '#2563eb' : 'grey.600',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',

          '&:hover': {
            backgroundColor: isEditMode
              ? 'rgba(37, 99, 235, 0.08)'
              : 'rgba(59, 130, 246, 0.04)',
            borderColor: isEditMode ? '#2563eb' : '#3b82f6',
            color: isEditMode ? '#2563eb' : '#3b82f6',
            boxShadow: '0 2px 4px rgba(37,99,235,0.06)',
          },
          '&:active': {
            backgroundColor: isEditMode
              ? 'rgba(37, 99, 235, 0.12)'
              : 'rgba(59, 130, 246, 0.08)',
            transform: 'translateY(1px)',
          },
        }}
      >
        {isEditMode ? '사용 모드' : '조작 모드'}
      </Button>
    </Tooltip>
  );
}