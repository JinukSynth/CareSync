import { Dialog, DialogContent, Typography, DialogActions, Button } from "@mui/material";
import React from "react";

interface LogoutConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }

export default function  LogoutConfirmModal ({ isOpen, onClose, onConfirm }: LogoutConfirmModalProps) {
    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <DialogContent sx={{ p: 0, mb: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom fontWeight="600">
            로그아웃 하시겠습니까?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            지금까지의 정보는 유지됩니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 0, gap: 1 }}>
          <Button
            onClick={onClose}
            fullWidth
            sx={{
              borderRadius: '12px',
              py: 1.5,
              color: 'text.primary',
              bgcolor: '#f5f5f5',
              '&:hover': {
                bgcolor: '#eeeeee',
              }
            }}
          >
            돌아가기
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            fullWidth
            sx={{
              borderRadius: '12px',
              py: 1.5,
              bgcolor: '#dc2626',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#b91c1c',
                boxShadow: 'none',
              }
            }}
          >
            로그아웃
          </Button>
        </DialogActions>
      </Dialog>
    );
};