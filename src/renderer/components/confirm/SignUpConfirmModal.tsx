import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  styled,
  useTheme
} from '@mui/material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden'
  }
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '12px',
  backgroundColor: theme.palette.grey[50],
  borderRadius: '8px',
}));

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: {
    email: string;
    hospitalName: string;
    departmentName: string;
  };
}

export function SignUpConfirmModal({ isOpen, onClose, onConfirm, data }: ConfirmModalProps) {
  const theme = useTheme();

  return (
    <StyledDialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
          가입 정보를 확인해주세요
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <InfoItem>
            <Typography variant="caption" color="text.secondary">
              이메일
            </Typography>
            <Typography variant="body1">
              {data.email}
            </Typography>
          </InfoItem>

          <InfoItem>
            <Typography variant="caption" color="text.secondary">
              병원 이름
            </Typography>
            <Typography variant="body1">
              {data.hospitalName}
            </Typography>
          </InfoItem>

          <InfoItem>
            <Typography variant="caption" color="text.secondary">
              진료과목
            </Typography>
            <Typography variant="body1">
              {data.departmentName}
            </Typography>
          </InfoItem>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          fullWidth
          sx={{
            borderRadius: '12px',
            py: 1.5,
            color: 'text.primary',
            bgcolor: theme.palette.grey[50],
            '&:hover': {
              bgcolor: theme.palette.grey[100],
            }
          }}
        >
          취소
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          fullWidth
          sx={{
            borderRadius: '12px',
            py: 1.5,
            bgcolor: '#333333',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#1a1a1a',
              boxShadow: 'none',
            }
          }}
        >
          확인
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}