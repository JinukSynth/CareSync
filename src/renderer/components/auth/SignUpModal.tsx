import React from 'react';
import { authService } from '../../../firebase/auth';
import {
  Dialog,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  styled,
  CircularProgress,
  useTheme,
  Alert
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BusinessIcon from '@mui/icons-material/Business';
import { SignUpConfirmModal } from '../confirm/SignUpConfirmModal';

const schema = yup.object().shape({
  email: yup
    .string()
    .required('이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요')
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  confirmPassword: yup
    .string()
    .required('비밀번호 확인을 입력해주세요')
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다'),
  hospitalName: yup
    .string()
    .required('병원 이름을 입력해주세요'),
  departmentName: yup
    .string()
    .required('진료과목을 입력해주세요'),
});

// 스타일된 컴포넌트
const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden'
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: theme.palette.grey[50],
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
    },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      boxShadow: '0 0 0 2px rgba(51, 51, 51, 0.1)',
    },
    '&.Mui-error': {
      backgroundColor: '#FEF2F2',
      '&:hover': {
        backgroundColor: '#FEF2F2',
      },
      '&.Mui-focused': {
        backgroundColor: '#FEF2F2',
        boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)',
      }
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '& .MuiFormHelperText-root': {
    marginLeft: '4px',
    fontSize: '0.75rem'
  }
}));

const InputAdornmentIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.grey[400],
  marginRight: theme.spacing(1),
  display: 'flex',
  alignItems: 'center'
}));

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpSuccess?: () => void;  // 추가
}

interface FormInputs {
  email: string;
  password: string;
  confirmPassword: string;
  hospitalName: string;
  departmentName: string;
}

export function SignUpModal({ isOpen, onClose, onSignUpSuccess }: SignUpModalProps) {
  const theme = useTheme();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<FormInputs | null>(null);
  const [signUpError, setSignUpError] = React.useState(false);
  

  const handleFormSubmit = (data: FormInputs) => {
    setFormData(data);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!formData) return;
    
    try {
      await authService.signUp({
        email: formData.email,
        password: formData.password,
        hospitalName: formData.hospitalName,
        departmentName: formData.departmentName
      });
      setIsConfirmOpen(false);
      onSignUpSuccess?.();  // 성공 콜백 호출
      onClose();
    } catch (err) {
      console.error('회원가입 중 오류가 발생했습니다:', err);
      setSignUpError(true);
        setIsConfirmOpen(false); // 확인 모달 닫기
        // 2초 후에 에러 메시지 숨기기
        setTimeout(() => {
        setSignUpError(false);
        }, 2000);
    }
  };

  return (
    <>
    {signUpError && (
      <Alert
        severity="error"
        sx={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#FEF2F2',
          color: '#991B1B',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '& .MuiAlert-icon': {
            color: '#DC2626'
          },
          zIndex: 9999,
          opacity: 1,  // 완전 불투명하게 설정
        }}
      >
        이미 존재하는 이메일입니다. 다른 이메일을 사용해주세요.
      </Alert>
    )}
    <StyledDialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      container={document.body}
      aria-labelledby="signup-dialog-title"
      closeAfterTransition
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Box sx={{ 
        position: 'relative',
        bgcolor: 'background.paper',
      }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500'
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ p: 4, pb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="600" color="text.primary">
            시작하기
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            계정을 만들어 환자 관리 시스템을 시작해보세요.
        </Typography>

          <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <StyledTextField
                label="이메일"
                placeholder='실제 사용 가능한 이메일을 입력해주세요'
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornmentIcon>
                      <EmailIcon />
                    </InputAdornmentIcon>
                  ),
                }}
                {...register('email')}
              />

              <StyledTextField
                label="비밀번호"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornmentIcon>
                      <LockIcon />
                    </InputAdornmentIcon>
                  ),
                }}
                {...register('password')}
              />

              <StyledTextField
                label="비밀번호 확인"
                type="password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornmentIcon>
                      <LockIcon />
                    </InputAdornmentIcon>
                  ),
                }}
                {...register('confirmPassword')}
              />

              <StyledTextField
                label="병원 이름"
                error={!!errors.hospitalName}
                helperText={errors.hospitalName?.message}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornmentIcon>
                      <LocalHospitalIcon />
                    </InputAdornmentIcon>
                  ),
                }}
                {...register('hospitalName')}
              />

              <StyledTextField
                label="진료과목"
                placeholder='예: 내과, 외과, 신경외과'
                error={!!errors.departmentName}
                helperText={errors.departmentName?.message}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornmentIcon>
                      <BusinessIcon />
                    </InputAdornmentIcon>
                  ),
                }}
                {...register('departmentName')}
              />
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                onClick={onClose}
                disabled={isSubmitting}
                fullWidth
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  color: 'text.primary',
                  bgcolor: theme.palette.grey[50],
                  '&:hover': {
                    bgcolor: theme.palette.grey[100],
                  },
                  '&:disabled': {
                    color: theme.palette.grey[400],
                    bgcolor: theme.palette.grey[100],
                  }
                }}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                fullWidth
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  bgcolor: '#333333',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#1a1a1a',
                    boxShadow: 'none',
                  },
                  '&:disabled': {
                    bgcolor: theme.palette.grey[300],
                  }
                }}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? '처리중...' : '가입하기'}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </StyledDialog>

    {formData && (
        <SignUpConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        data={formData}
        />
    )}
  </>
  );
}