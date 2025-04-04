import React, { useState, useEffect } from 'react';
import { dbService } from '../../../firebase/database';
import { FirebaseSection, FirebaseStatus } from '../../../firebase/type';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Stack,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TimerIcon from '@mui/icons-material/Timer';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ColorPicker from '../../ui/ColorPicker';
import StatusGuideModal from '../../ui/StatusGuide';


interface EditStatusModalProps {
  sectionId: string;
  section: FirebaseSection;
  statuses: Record<string, FirebaseStatus>;
  onClose: () => void;
  hospitalId: string;    // 추가
  departmentId: string;  // 추가
}

export default function EditStatusModal({ hospitalId, departmentId, sectionId, section, onClose }: EditStatusModalProps) {
  const [newStatusName, setNewStatusName] = useState('');
  const [timerType, setTimerType] = useState<'countdown' | 'countup'>('countdown');
  const [statusColor, setStatusColor] = useState('#FF6B6B');
  const [editingStatus, setEditingStatus] = useState<FirebaseStatus | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // 기존 useEffect 및 함수들은 그대로 유지
  useEffect(() => {
    const loadStatuses = async () => {
      try {
        console.log('Loading statuses for:', { hospitalId, departmentId, sectionId });
        const statuses = await dbService.getSectionStatuses(hospitalId, departmentId, sectionId);
        console.log('Response from getSectionStatuses:', statuses);
      } catch (error) {
        console.error('상태 불러오기 실패. 에러 상세:', error);
      }
    };
    loadStatuses();
  }, [hospitalId, departmentId, sectionId]);


  const handleAddStatus = async () => {
    if (!newStatusName.trim()) return;
    const newStatus: FirebaseStatus = {
      id: crypto.randomUUID(),
      name: newStatusName.trim(),
      timerType,
      color: statusColor,
      sectionId
    };
    try {
      await dbService.createStatus(hospitalId, departmentId, sectionId, newStatus);
      console.log('Status added successfully:', newStatus);
      resetForm();
    } catch (error) {
      console.error('상태 템플릿 추가 실패:', error);
    }
  };


  const handleUpdateStatus = async () => {
    if (!editingStatus) return;
    try {
      await dbService.updateStatus(
        hospitalId,
        departmentId,
        sectionId, 
        editingStatus.id, 
        {
          name: newStatusName,
          timerType,
          color: statusColor
        }
      );
      resetForm();
    } catch (error) {
      console.error('상태 템플릿 수정 실패:', error);
    }
  };

  const handleDeleteStatus = async (statusId: string) => {
    try {
      await dbService.deleteStatus(hospitalId, departmentId, sectionId, statusId);
      if (editingStatus?.id === statusId) {
        resetForm();
      }
    } catch (error) {
      console.error('상태 템플릿 삭제 실패:', error);
    }
  };

  const resetForm = () => {
    setNewStatusName('');
    setTimerType('countdown');
    setStatusColor('#000000');
    setEditingStatus(null);
  };

  const startEditing = (status: FirebaseStatus) => {
    setEditingStatus(status);
    setNewStatusName(status.name);
    setTimerType(status.timerType);
    setStatusColor(status.color);
  };

  const OpenGuide = () => {
    setIsGuideOpen(true);
  }

  return (
    <>
      <Dialog
        open={true}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            p: 1.8,  // p: 3 -> p: 2
            ml: 1.0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'grey.100'
          }}
          >
          <Box display="flex" alignItems="center" gap={1}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: '1.1rem',
                fontWeight: 600 
              }}
            >
              상태 관리
            </Typography>
            <Tooltip title="상태 설정 가이드" arrow>
              <IconButton
                size="small"
                onClick={OpenGuide}
                sx={{
                  color: 'grey.400',
                  '&:hover': {
                    backgroundColor: 'grey.50',
                    color: 'primary.main'
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: 'pulseGlow 1.5s infinite',
                  '@keyframes pulseGlow': {
                    '0%': {
                      boxShadow: '0 0 0 0 rgba(33, 150, 243, 0.7)',
                    },
                    '70%': {
                      boxShadow: '0 0 6px 2px rgba(33, 150, 243, 0)',
                    },
                    '100%': {
                      boxShadow: '0 0 0 0 rgba(33, 150, 243, 0)',
                    },
                  },
                }}
              >
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: 'grey.500',
              p: 1,  // 패딩 추가로 클릭 영역 확보하면서 전체 높이는 줄임
              '&:hover': {
                backgroundColor: 'grey.50'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
  
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* 왼쪽: 상태 목록 */}
            <Grid item xs={6}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, mt: 2 }}>
                등록된 상태 목록
              </Typography>
              <Box sx={{ maxHeight: 425, overflowY: 'auto', pr: 1 }}>
                {Object.values(section.statuses || {}).length === 0 ? (
                  <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    height={425}
                    sx={{ 
                      backgroundColor: 'grey.50',
                      borderRadius: 2,
                      border: '1px dashed',
                      borderColor: 'grey.200'
                    }}
                  >
                    <Typography color="grey.500">등록된 상태가 없습니다</Typography>
                  </Box>
                ) : (
                  <Stack spacing={1.5}>
                    {Object.values(section.statuses || {}).map(status => (
                      <Paper
                        key={status.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          border: '1px solid',
                          borderColor: editingStatus?.id === status.id ? 'primary.main' : 'grey.100',
                          backgroundColor: editingStatus?.id === status.id ? 'primary.50' : 'white',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                          borderRadius: '8px',
                          '&:hover': {
                            backgroundColor: editingStatus?.id === status.id ? 'primary.50' : 'grey.50',
                            '& .delete-button': {
                              opacity: 1
                            }
                          }
                        }}
                        onClick={() => startEditing(status)}
                      >
                        <Box sx={{ mb: 1.5 }}>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                backgroundColor: status.color,
                                border: '2px solid white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                            />
                            <Typography variant="subtitle2" fontWeight={600}>
                              {status.name}
                            </Typography>
                          </Box>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <TimerIcon fontSize="small" sx={{ color: 'grey.400' }} />
                          <Typography variant="body2" color="grey.600">
                            {status.timerType === 'countdown' ? '카운트다운 타이머' : '카운트업 타이머'}
                          </Typography>
                        </Box>
                        <IconButton
                          className="delete-button"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStatus(status.id);
                          }}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            opacity: 0,
                            color: 'error.main',
                            backgroundColor: 'error.50',
                            transition: 'opacity 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'error.100'
                            }
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Box>
            </Grid>
  
            {/* 오른쪽: 추가/편집 폼 */}
            <Grid item xs={6}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, mt: 2 }}>
                {editingStatus ? '상태 편집' : '새 상태 추가'}
              </Typography>
              <Stack spacing={3}>
                <TextField
                  label="상태 이름"
                  value={newStatusName}
                  onChange={(e) => setNewStatusName(e.target.value)}
                  placeholder="예: 시술 중, 대기 중"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />
  
                <FormControl fullWidth>
                  <InputLabel>타이머 유형</InputLabel>
                  <Select
                    value={timerType}
                    label="타이머 유형"
                    onChange={(e) => setTimerType(e.target.value as 'countdown' | 'countup')}
                    sx={{
                      borderRadius: '8px'
                    }}
                  >
                    <MenuItem value="countdown">카운트다운</MenuItem>
                    <MenuItem value="countup">카운트업</MenuItem>
                  </Select>
                </FormControl>
  
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight={500}>
                    상태 색상
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box 
                      sx={{ 
                        position: 'relative',
                        width: 80, 
                        height: 45
                      }}
                    >
                      <ColorPicker
                        value={statusColor}
                        onChange={setStatusColor}
                      />
                    </Box>
                    <Box
                      flex={1}
                      height={45}
                      sx={{
                        borderRadius: '8px',
                        backgroundColor: `${statusColor}20`,
                        border: '1px solid',
                        borderColor: `${statusColor}40`
                      }}
                    />
                  </Box>
                </Box>
  
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight={500}>
                    미리보기
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      backgroundColor: `${statusColor}08`,
                      border: '1px solid',
                      borderColor: `${statusColor}20`,
                      borderRadius: '8px'
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: statusColor,
                          border: '2px solid white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Typography fontWeight={500} sx={{ color: 'grey.600' }}>
                        {newStatusName || '상태 이름을 입력하세요'}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
  
                <Box sx={{ pt: 1 }}>
                  {editingStatus ? (
                    <Box display="flex" gap={1.5}>
                      <Button
                        variant="contained"
                        onClick={handleUpdateStatus}
                        fullWidth
                        sx={{
                          height: 48,
                          borderRadius: '8px',
                          fontWeight: 600,
                          boxShadow: 'none',
                          '&:hover': {
                            boxShadow: 'none',
                            backgroundColor: 'primary.dark'
                          }
                        }}
                      >
                        수정 완료
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={resetForm}
                        sx={{
                          height: 48,
                          borderRadius: '8px',
                          fontWeight: 600,
                          borderColor: 'grey.200',
                          color: 'grey.700',
                          '&:hover': {
                            backgroundColor: 'grey.50',
                            borderColor: 'grey.300'
                          }
                        }}
                      >
                        취소
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleAddStatus}
                      fullWidth
                      disabled={!newStatusName.trim()}
                      sx={{
                        height: 48,
                        borderRadius: '8px',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: 'none',
                          backgroundColor: 'primary.dark'
                        }
                      }}
                    >
                      상태 추가
                    </Button>
                  )}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {isGuideOpen && (
        <StatusGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />
      )}
  </>
  );
}