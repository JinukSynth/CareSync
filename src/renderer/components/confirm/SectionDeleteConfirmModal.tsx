import { Dialog, DialogContent, Typography, DialogActions, Button } from "@mui/material";
import React from "react";

// 삭제 확인 모달 컴포넌트
interface DeleteSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    sectionName: string;
  }
  
export default function DeleteSectionModal ({ isOpen, onClose, onConfirm, sectionName }: DeleteSectionModalProps) {
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
            '{sectionName}' 섹션을 삭제하시겠습니까?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            섹션 내 모든 정보가 지워집니다.
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
            취소
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
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    );
  };