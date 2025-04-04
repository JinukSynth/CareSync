import React, { useEffect, useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogContentText,
  Alert,
  AlertTitle,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';;
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface ExpirationAlertProps {
  expirationDate: Date;
}

const ExpirationAlert: React.FC<ExpirationAlertProps> = ({ expirationDate }) => {
  const [open, setOpen] = useState(true);
  // 현재 날짜를 주기적으로 업데이트하는 state
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // 1분마다 현재 날짜를 업데이트 (필요시 더 짧은 주기로도 가능)
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  const getDaysRemaining = () => {
    const nowKST = dayjs().tz('Asia/Seoul');
    const expKST = dayjs(expirationDate).tz('Asia/Seoul');
    const diffDays = expKST.diff(nowKST, 'day');
    const adjustedDays = diffDays; // 시작일과 만료일을 포함하도록 보정
    
    return adjustedDays;
  };

  const daysRemaining = getDaysRemaining();

  const getAlertSeverity = (daysRemaining: number) => {
    if (daysRemaining <= 3) return 'error';
    if (daysRemaining <= 10) return 'warning';
    return 'success';
  };

  const severity = getAlertSeverity(daysRemaining);

  // expirationDate를 한국 시간 기준으로 포맷
  const formattedExpirationDate = dayjs(expirationDate)
    .tz('Asia/Seoul')
    .format('YYYY년 M월 D일');

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogContent sx={{ p: 2 }}>
        <Alert 
          severity={severity}
          sx={{ 
            '& .MuiAlert-message': { 
              width: '100%' 
            }
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setOpen(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <AlertTitle sx={{ mb: 0 }}>서비스 이용 안내</AlertTitle>
          </Box>
          <DialogContentText id="alert-dialog-description" sx={{ mt: 1, mb: 0 }}>
            {daysRemaining > 0 ? (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  MVP 이용 기간이 {daysRemaining}일 남았습니다.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  {formattedExpirationDate} 까지 이용 가능합니다.
                </Typography>
              </>
            ) : (
              '서비스 이용 기간이 만료되었습니다.'
            )}
          </DialogContentText>
        </Alert>
      </DialogContent>
    </Dialog>
  );
};

export default ExpirationAlert;