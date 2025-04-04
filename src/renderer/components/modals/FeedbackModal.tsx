import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box 
} from '@mui/material';

interface ExtendedElectron {
  openFeedbackForm?: (callback: () => void) => void;
  feedbackSubmitted?: () => void;
//   quitWithoutFeedback?: () => void;
}

export default function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 구글 폼 임베드 URL (반드시 ?embedded=true 를 포함)
  const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScU3-TUXHtL-aXFQuXTxS2Co7NQjJneNvCSsfaGPUwcS8UrFQ/viewform?embedded=true';

  useEffect(() => {
    // Electron의 openFeedbackForm 이벤트를 수신하여 모달 열기
    const electron = window.electron as ExtendedElectron;
    if (electron && typeof electron.openFeedbackForm === 'function') {
      electron.openFeedbackForm(() => {
        setIsOpen(true);
      });
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // const electron = window.electron as ExtendedElectron;
    // if (electron && typeof electron.quitWithoutFeedback === 'function') {
    //   electron.quitWithoutFeedback();
    // }
  };

  const handleSubmit = () => {
    // 확인 대화상자 표시
    const isConfirmed = window.confirm("모든 응답을 제출한 후 프로그램을 종료하시겠습니까?");
    if (!isConfirmed) return; // 사용자가 취소하면 아무 작업도 하지 않음
    
    setIsSubmitting(true);
    const electron = window.electron as ExtendedElectron;
    if (electron && typeof electron.feedbackSubmitted === 'function') {
      electron.feedbackSubmitted();
    }
    setIsOpen(false);
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div" fontWeight={600}>
            피드백 및 구매 의향 조사
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            귀하의 소중한 의견과 구매 의향은 서비스 개선에 큰 도움이 됩니다. 아래 각 항목에 성실하게 응답해 주시기 바랍니다.
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ height: '80vh' }}>
          <iframe
            src={googleFormUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            style={{ border: 0 }}
          >
            로딩 중...
          </iframe>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center' }}>
        <Typography 
            variant="body2" 
            sx={{ flex: 1, textAlign: 'left', color: 'red' }}
        >
            ※ 구글 폼을 모두 작성하고 “제출” 버튼을 누른 뒤, 아래의 “제출 완료 및 종료” 버튼을 클릭해 주세요.
        </Typography>
        <Button 
            onClick={handleClose} 
            variant="outlined" 
            color="inherit"
            sx={{ mr: 1 }}
            disabled={isSubmitting}
        >
            취소
        </Button>
        <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
        >
            제출 완료 및 종료
        </Button>
      </DialogActions>
    </Dialog>
  );
}