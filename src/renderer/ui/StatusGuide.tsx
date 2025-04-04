import { Dialog, DialogTitle, Typography, IconButton, DialogContent, Stack, Box, Paper, DialogActions, Button } from "@mui/material";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';

interface GuideModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  const StatusGuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }
        }}
      >
        <DialogTitle
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'grey.100'
          }}
        >
          <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
            상태 설정이란?
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: 'grey.500',
              '&:hover': { backgroundColor: 'grey.50' }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
  
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                상태란?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                환자의 현재 진료 상태를 나타내는 지표입니다. 예를 들어 '대기 중', '진료 중', '수납 대기' 등으로 설정할 수 있습니다.
              </Typography>
            </Box>
  
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                타이머 유형
              </Typography>
              <Stack spacing={2}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: 'grey.50',
                    borderRadius: '8px'
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    카운트업
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    상태가 시작된 시점부터 경과된 시간을 보여줍니다. 대기 시간이나 진료 시간을 측정할 때 유용합니다.
                  </Typography>
                </Paper>
                
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: 'grey.50',
                    borderRadius: '8px'
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    카운트다운
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    설정된 시간부터 감소하는 타이머입니다. 예약된 시간까지 남은 시간을 표시할 때 사용할 수 있습니다.
                  </Typography>
                </Paper>
              </Stack>
            </Box>
  
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                색상 설정
              </Typography>
              <Typography variant="body2" color="text.secondary">
                각 상태를 구분하기 쉽도록 서로 다른 색상을 지정할 수 있습니다. 색상은 상태 표시와 타이머에 반영됩니다.
              </Typography>
              <Typography variant="caption" color="error.main" sx={{ mt: 1, display: 'block' }}>
                ※ 검은색은 룸 이름이 보이지 않으니 사용하지 않는 것을 권장드립니다.
              </Typography>
          </Box>
          </Stack>
        </DialogContent>
  
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'grey.100' }}>
          <Button
            onClick={onClose}
            variant="contained"
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
            확인
          </Button>
        </DialogActions>
      </Dialog>
    );
};

export default StatusGuideModal;