import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider
} from '@mui/material';
import managementButton from '../assets/image/managementButton.png'; 

interface TutorialGuideModalProps {
  open: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    label: '조작 모드',
    description: '상단의 "조작 모드" 버튼을 클릭하여 시스템 설정을 시작할 수 있습니다.',
    image: { managementButton }
  },
  {
    label: '섹션 추가',
    description: '조작 모드에서 "섹션 추가" 버튼을 클릭하여 새로운 공간을 생성할 수 있습니다.',
  },
  {
    label: '상태 관리',
    description: '각 섹션의 "상태 관리" 버튼을 통해 환자 상태를 정의하고 관리할 수 있습니다.',
  },
  {
    label: '룸 추가',
    description: '섹션 내의 "룸 추가" 버튼을 클릭하여 세부 공간을 생성할 수 있습니다.',
  },
  {
    label: '최상위 버튼',
    description:
      '이 버튼을 클릭하면 창의 항상 최상위 상태를 전환할 수 있습니다. 버튼은 현재 상태에 따라 "On" 또는 "Off"로 표시되며, 시스템 내 다른 창들보다 우선적으로 표시됩니다.',
  },
  {
    label: '환자 정보 관리',
    description: '각 룸을 클릭하여 환자 정보를 입력하고 상태를 설정할 수 있습니다. 상태에 따른 타이머 유형으로 환자를 관리할 수 있습니다.',
  }
];

export default function TutorialGuideModal({ open, onClose }: TutorialGuideModalProps) {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleClose = () => {
    setActiveStep(0);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }
      }}
    >
      <DialogTitle component="div" sx={{ p: 3, pb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          시스템 사용 안내
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          {tutorialSteps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography fontWeight={500}>{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Typography color="grey.600" sx={{ mt: 1, mb: 2 }}>
                  {step.description}
                </Typography>
                {step.image && (
                  <Box sx={{ mb: 2 }}>
                    <img src={step.image.managementButton} alt={step.label} style={{ maxWidth: '100%', borderRadius: '8px' }} />
                  </Box>
                )}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ minWidth: '80px' }}
                  >
                    이전
                  </Button>
                  <Button
                    variant="contained"
                    onClick={index === tutorialSteps.length - 1 ? handleClose : handleNext}
                    sx={{ minWidth: '80px' }}
                  >
                    {index === tutorialSteps.length - 1 ? '완료' : '다음'}
                  </Button>
                </Box>
              </StepContent>
              {index !== tutorialSteps.length - 1 && <Divider sx={{ my: 2 }} />}
            </Step>
          ))}
        </Stepper>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleClose} color="inherit">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}