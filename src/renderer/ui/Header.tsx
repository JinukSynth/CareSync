import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Grid, 
  Typography, 
  Box, 
  Button, 
  Divider, 
  Tooltip,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import EditModeToggle from '../ui/EditModeToggle';
import WindowControls from '../ui/WindowControls';
import AlwaysOnTopToggle from '../ui/AlwaysOnTopToggle';
import TutorialGuideModal from './Guide';

interface HeaderProps {
  hospitalData: {
    hospitalName: string;
    departmentName: string;
  } | null;
  onLogout: () => void;
}

export default function Header({ hospitalData, onLogout }: HeaderProps) {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const theme = useTheme();
  
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  
  const flexDirection = (isXs || isSm) ? 'column' : 'row';
  const alignItems = (isXs || isSm) ? 'flex-start' : 'center';
  const leftGridSize = (isXs || isSm) ? 12 : 6;
  const rightGridSize = (isXs || isSm) ? 12 : 6;
  
  // Divider 스타일 (흐릿한 세로 구분선)
  const dividerSx = {
    borderColor: 'grey.300',
    opacity: 0.6,
    mx: { xs: 1, sm: 1.5 },
    height: { xs: 24, sm: 28 },
    mt: 0.3
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(6px)',
          borderBottom: '1px solid',
          borderColor: 'grey.100',
          color: 'text.primary',
          minHeight: 76,
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            opacity: 0.9,
          }
        }}
      >
        <Toolbar 
          sx={{ 
            minHeight: 76, 
            px: { xs: 1, sm: 2, md: 4 },
            transition: 'padding 0.2s ease',
            mt: { xs: 1, sm: 1, md: 1 },
            flexDirection: flexDirection,
            alignItems: alignItems
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            {/* 왼쪽 영역: 제목 및 병원 정보 */}
            <Grid item xs={leftGridSize} sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center'
            }}>
              {hospitalData && (
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 0.5, sm: 1 }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'baseline',
                    flexWrap: 'wrap'
                  }}>
                    <Typography 
                      variant="h5" 
                      component="h1" 
                      sx={{
                        fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem', lg: '1.8rem' },
                        color: 'black',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        background: 'linear-gradient(135deg, #1a1a1a, #333333, #808080, #f5f5f5)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 1px 2px rgba(0,0,0,0.03)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {hospitalData.hospitalName}
                    </Typography>
                    <Box 
                      component="span" 
                      sx={{ 
                        mx: { xs: 0.5, sm: 1 },
                        color: 'grey.300',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        fontWeight: 300
                      }}
                    >
                      /
                    </Box>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.3rem' },
                        fontWeight: 600,
                        color: 'grey.600',
                        letterSpacing: '-0.01em',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {hospitalData.departmentName}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: { xs: 1, sm: 1.5 }
                  }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: 'grey.400',
                        letterSpacing: '0.06em',
                        fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.8rem' },
                        fontWeight: 500,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      CareSync: Patient Management Sys
                    </Typography>
                    <Tooltip title="시스템 사용 안내" arrow>
                      <IconButton
                        onClick={() => setIsTutorialOpen(true)}
                        sx={{
                          width: { xs: 32, sm: 36 },
                          height: { xs: 32, sm: 36 },
                          color: 'grey.400',
                          backgroundColor: 'transparent',
                          p: 0,
                          '&:hover': {
                            backgroundColor: 'grey.50',
                            color: 'primary.main'
                          },
                          '&:active': {
                            transform: 'translateY(1px)'
                          },
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          animation: 'pulseGlow 1.5s infinite',
                          '@keyframes pulseGlow': {
                            '0%': {
                              boxShadow: '0 0 0 0 rgba(33, 150, 243, 0.7)',
                            },
                            '70%': {
                              boxShadow: '0 0 8px 3px rgba(33, 150, 243, 0)',
                            },
                            '100%': {
                              boxShadow: '0 0 0 0 rgba(33, 150, 243, 0)',
                            },
                          },
                        }}
                      >
                        <HelpOutlineIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              )}
            </Grid>
 
            {/* 오른쪽 영역: 편집 모드 토글, 윈도우 컨트롤, 항상 최상위 토글, 로그아웃 버튼 */}
            <Grid item xs={rightGridSize} sx={{ 
              display: 'flex', 
              justifyContent: (isXs || isSm) ? 'center' : 'flex-end',
              alignItems: 'center',
              // gap 대신 각 버튼 사이에 Divider 추가
              mt: { xs: 1, sm: 1, md: -0.6 },
              mb: { xs: 3, sm: 3, md: 0 },
              pl: { xs: 2, sm: 4 }
            }}>
              <EditModeToggle />
              <Divider orientation="vertical" flexItem sx={dividerSx} />
              <WindowControls />
              <Divider orientation="vertical" flexItem sx={dividerSx} />
              <Box sx={{ flexShrink: 0 }}>
                <AlwaysOnTopToggle />
              </Box>
              <Divider orientation="vertical" flexItem sx={dividerSx} />
              <Button
                variant="outlined"
                onClick={onLogout}
                size="small"
                startIcon={
                  <LogoutIcon
                    sx={{
                      fontSize: { xs: 14, sm: 16 },
                      transition: 'all 0.2s ease',
                      color: 'error.main'
                    }}
                  />
                }
                sx={{
                  height: { xs: 32, sm: 36 },
                  minWidth: { xs: 'auto', sm: '120px' },
                  px: { xs: 1.5, sm: 2.5 },
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.815rem' },
                  fontWeight: 600,
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: 'error.main',
                  backgroundColor: 'error.50',
                  color: 'error.main',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'error.main',
                    backgroundColor: 'error.main',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(239,68,68,0.16)',
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                      transform: 'translateX(-2px)'
                    }
                  },
                  '&:active': {
                    backgroundColor: 'grey.50',
                    transform: 'translateY(1px)'
                  }
                }}
              >
                로그아웃
              </Button>
              
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
 
      <TutorialGuideModal
        open={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </>
  );
}