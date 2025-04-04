// components/modals/ResetConfirmModal.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

interface ResetConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ResetConfirmModal({ open, onCancel, onConfirm }: ResetConfirmModalProps) {
    return (
        <Dialog
          open={open}
          onClose={onCancel}
          maxWidth="xs"
          fullWidth
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
          keepMounted={false}
          disablePortal={false}
          container={document.body}
          style={{ position: 'absolute' }}
          PaperProps={{
            sx: {
              position: 'fixed',      // 추가: 화면 중앙 고정
              top: '50%',             // 추가
              left: '48%',            // 추가
              transform: 'translate(-50%, -50%)', // 추가
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden'
            }
          }}
          slotProps={{
            backdrop: {
              style: { 
                position: 'fixed',     // backdrop가 전체 화면을 덮도록 고정
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.4)'
              }
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              p: 3,
              pb: 1,
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'grey.800'
            }}
          >
            초기화 확인
          </DialogTitle>
          <DialogContent sx={{ p: 3, pt: 2 }}>
            <Typography
              sx={{
                color: 'grey.600',
                fontSize: '0.95rem',
                lineHeight: 1.5
              }}
            >
              환자 정보를 초기화하시겠습니까?
            </Typography>
          </DialogContent>
          <DialogActions 
            sx={{ 
              p: 2.5,
              gap: 1,
              borderTop: '1px solid',
              borderColor: 'grey.100'
            }}
          >
            <Button 
              onClick={onCancel}
              sx={{
                minWidth: '72px',
                fontWeight: 500,
                color: 'grey.700',
                '&:hover': {
                  backgroundColor: 'grey.50'
                }
              }}
            >
              취소
            </Button>
            <Button
              onClick={onConfirm}
              variant="contained"
              color="error"
              sx={{
                minWidth: '72px',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                  backgroundColor: 'error.dark'
                }
              }}
              autoFocus={false}
            >
              확인
            </Button>
          </DialogActions>
        </Dialog>
      );
}