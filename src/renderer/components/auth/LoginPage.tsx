import React from 'react';
import {
  Card,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Dialog,
  styled,
  Alert
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SignUpModal } from './SignUpModal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import titleImage from '@assets/image/title.png';


const schema = yup.object().shape({
  email: yup
    .string()
    .required('이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요')
});

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  border: 'none'
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

interface FormInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSignUpModalOpen, setIsSignUpModalOpen] = React.useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
  const [loginError, setLoginError] = React.useState(false); // 로그인 실패 시 에러 메시지


  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = async (data: FormInputs) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setLoginError(true);
      setTimeout(() => {
        setLoginError(false);
      }, 2000);
    }
  };

  const handleSignUpSuccess = () => {
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);  // 3초 후 자동으로 사라짐
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
    {showSuccessAlert && (
        <Alert
          severity="success"
          sx={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#EDF7ED',
            color: '#1E4620',
            '& .MuiAlert-icon': {
              color: '#4CAF50'
            },
            zIndex: 9999,
          }}
        >
          가입이 완료되었습니다! 가입하신 이메일로 로그인해주세요.
        </Alert>
      )}
    {loginError && (
        <Alert
            severity="error"
            sx={{
            position: 'fixed',
            top: showSuccessAlert ? 80 : 20, // showSuccessAlert가 있을 경우 아래에 표시
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#FEF2F2',
            color: '#991B1B',
            '& .MuiAlert-icon': {
                color: '#DC2626'
            },
            zIndex: 9999,
            }}
        >
            이메일과 비밀번호를 확인해주세요.
        </Alert>
        )}
      <Box
        component="img"
        src={titleImage}
        alt="Title"
        sx={{
          maxWidth: '280px',
          width: '100%',
          height: '30%',
          objectFit: 'contain',
        }}
      />
      <StyledCard sx={{ maxWidth: 400, width: '100%' }}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom fontWeight="600" color="text.primary">
            로그인
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            병원 관리 시스템에 오신 것을 환영합니다
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <StyledTextField
                label="이메일"
                placeholder='이메일을 입력해주세요'
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
                placeholder='비밀번호를 입력해주세요'
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
            </Box>

            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
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
                    bgcolor: '#cccccc',
                  }
                }}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>

              <Button
                onClick={() => setIsSignUpModalOpen(true)}
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
                <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>
                    계정이 없으신가요?
                </Box>
                회원가입
              </Button>
            </Box>
          </form>
        </Box>
      </StyledCard>

      <Dialog 
        open={isSignUpModalOpen} 
        onClose={() => setIsSignUpModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <SignUpModal 
            onClose={() => setIsSignUpModalOpen(false)} 
            isOpen={true} 
            onSignUpSuccess={handleSignUpSuccess}
        />
      </Dialog>
    </Box>
  );
}