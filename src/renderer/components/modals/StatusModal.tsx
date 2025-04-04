// // StatusModal.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Box,
//   Grid
// } from '@mui/material';
// import Grid2 from '@mui/material/Grid2';
// import { dbService } from '../../../firebase/database';
// import { FirebaseRoom, FirebaseStatus } from '../../../firebase/type';
// import ResetConfirmModal from '../confirm/ResetConfirmModal';

// interface StatusModalProps {
//   open: boolean;
//   onClose: () => void;
//   sectionId: string;
//   roomId: string;
//   roomData: Partial<FirebaseRoom> | null;
//   hospitalId: string;
//   departmentId: string;
// }

// export default function StatusModal ({ hospitalId, departmentId, open, onClose, sectionId, roomId, roomData }: StatusModalProps) {
//   // 섹션 내 status 정보 (color 포함)
//   const [statuses, setStatuses] = useState<Record<string, FirebaseStatus>>({});
//   const [selectedStatusId, setSelectedStatusId] = useState<string>('');
//   // 환자 이름, 메모는 사용자가 입력
//   const [patientName, setPatientName] = useState<string>('');
//   const [memo, setMemo] = useState<string>('');
//   // 상태 색상을 별도 state로 관리
//   const [statusColor, setStatusColor] = useState<string>('');
//   // 타이머 입력: 분과 초 (초는 기본값 0)
//   const [timerMinutes, setTimerMinutes] = useState<number>(0);
//   const [timerSeconds, setTimerSeconds] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(true);

//   // 유효성 검사
//   const [formValid, setFormValid] = useState<boolean>(false);
//   const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

//   // 폼 유효성 검사 함수 추가
//   const validateForm = () => {
//     // 1. 환자 이름 검사
//     const isPatientNameValid = patientName.trim().length > 0;
  
//     // 2. 상태 선택 검사
//     const isStatusSelected = selectedStatusId !== '';
  
//     // 3. 타이머 설정 검사 (countdown 타입일 때)
//     const isTimerValid = 
//       selectedStatusId && 
//       statuses[selectedStatusId] ? (
//         statuses[selectedStatusId].timerType === 'countdown' ? 
//           (timerMinutes > 0 || timerSeconds > 0) : // 분이나 초 중 하나라도 0보다 크면 유효
//           true // countup일 때는 타이머 설정 불필요
//       ) : false;
  
//     // 모든 조건이 충족되어야 true 반환
//     return isPatientNameValid && isStatusSelected && isTimerValid;
//   };

//   // 초기화 버튼 클릭 시 확인 모달을 여는 함수
//     const handleResetClick = () => {
//         setResetConfirmOpen(true);
//     };
    
//     // 확인 모달에서 확인 클릭 시 실제 초기화를 수행하는 함수
//     const handleResetConfirm = async () => {
//         await handleReset();
//         setResetConfirmOpen(false);
//     };
    
//     // 확인 모달 닫기 함수
//     const handleResetCancel = () => {
//         setResetConfirmOpen(false);
//     };
  
//   // useEffect에서 폼 유효성 상태 업데이트
//   useEffect(() => {
//     setFormValid(validateForm());
//   }, [patientName, selectedStatusId, timerMinutes,  timerSeconds, statuses]);
  

//   // 섹션 내 status 정보를 불러옴 (모달이 열릴 때)
//   useEffect(() => {
//     if (open) {
//       setLoading(true);
//       // hospitalId와 departmentId 가져오기
//       const fetchStatuses = async () => {
//         try {
//           // 섹션 정보 먼저 가져오기
//           const sectionData = await dbService.getSection(hospitalId, departmentId, sectionId);
//           if (!sectionData) {
//             console.error('섹션을 찾을 수 없습니다.');
//             return;
//           }
  
//           const statusesData = await dbService.getSectionStatuses(
//             sectionData.hospitalId,
//             sectionData.departmentId,
//             sectionId
//           );
  
//           if (statusesData) {
//             setStatuses(statusesData);
//             if (roomData && roomData.statusId) {
//               setSelectedStatusId(roomData.statusId);
//             } else {
//               const firstKey = Object.keys(statusesData)[0];
//               if (firstKey) {
//                 setSelectedStatusId(firstKey);
//               }
//             }
//           }
//         } catch (error) {
//           console.error('status 정보를 불러오는 중 오류 발생:', error);
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       fetchStatuses();
//     }
//   }, [open, sectionId, roomData]);

//   // selectedStatusId나 statuses 변경 시 statusColor 업데이트
//   useEffect(() => {
//     if (selectedStatusId && statuses[selectedStatusId]) {
//       setStatusColor(statuses[selectedStatusId].color);
//     }
//   }, [selectedStatusId, statuses]);

//   // roomData가 변경되면 기존에 저장된 데이터를 필드에 반영
//   useEffect(() => {
//     if (roomData) {
//       setPatientName(roomData.patientName || '');
//       setMemo(roomData.memo || '');
//       if (roomData.statusId) {
//         setSelectedStatusId(roomData.statusId);
//       }
//       if (
//         roomData.timer &&
//         roomData.timer.type === 'countdown' &&
//         roomData.timer.targetTime
//       ) {
//         const totalSeconds = roomData.timer.targetTime;
//         setTimerMinutes(Math.floor(totalSeconds / 60));
//         setTimerSeconds(totalSeconds % 60);
//         setStatusColor(roomData.statusColor || '');
//       } else {
//         setTimerMinutes(0);
//         setTimerSeconds(0);
//       }
//     } else {
//       setPatientName('');
//       setMemo('');
//       setTimerMinutes(0);
//       setTimerSeconds(0);
//     }
//   }, [roomData]);

//   // 저장 버튼 클릭 시, 입력 데이터를 룸 정보 업데이트에 사용
//   const handleSave = async () => {
//     if (!validateForm()) {
//         let errorMessage = '';
//         if (!patientName.trim()) {
//           errorMessage += '환자 이름을 입력해주세요.\n';
//         }
//         if (!selectedStatusId) {
//           errorMessage += '상태를 선택해주세요.\n';
//         }
//         if (selectedStatusId && 
//             statuses[selectedStatusId] && 
//             statuses[selectedStatusId].timerType === 'countdown' && 
//             timerMinutes === 0) {
//           errorMessage += '타이머는 최소 1초 이상 설정해주세요.';
//         }
//         alert(errorMessage);
//         return;
//       }

      
//     const currentStatus = statuses[selectedStatusId];
//     if (!currentStatus) {
//       console.error('선택된 상태 정보가 없습니다:', selectedStatusId);
//       return;
//     }
  
//     try {
//       console.log('저장할 데이터:', {
//         patientName,
//         memo,
//         statusId: selectedStatusId,
//         statusColor: currentStatus.color,
//         currentStatus
//       });
  
//       const roomDataToSave: Partial<FirebaseRoom> = {
//         patientName,
//         memo: memo || '',
//         statusId: selectedStatusId,
//         statusColor,
//         timer: {
//           type: currentStatus.timerType,
//           currentTime: 0,
//           isRunning: false,
//           startedAt: Date.now(),
//           updatedAt: Date.now(),
//           ...(currentStatus.timerType === 'countdown'
//             ? { targetTime: (timerMinutes * 60) + timerSeconds }
//             : {})
//         }
//       };
  
//       console.log('최종 저장 데이터:', roomDataToSave);
//       await dbService.saveRoomStatus(hospitalId, departmentId, sectionId, roomId, roomDataToSave);
//       console.log('저장 성공');
//       onClose();
//     } catch (error) {
//       console.error('룸 상태 저장 오류:', error);
//     }
//   };

//   // 초기화(룸 데이터 delete) 버튼 클릭 시 처리하는 함수
//   const handleReset = async () => {
//     try {
//       // 상태 목록의 첫 번째 status를 기본 선택값으로 사용
//       const firstKey = Object.keys(statuses)[0] || '';
//       // 첫 번째 status에 해당하는 timerType을 가져오거나 기본값('countdown')을 사용
//       const defaultTimerType = statuses[firstKey]?.timerType || 'countdown';
  
//       // DB에 저장할 초기화 데이터 객체 (statusColor 포함)
//       const resetData: Partial<FirebaseRoom> = {
//         patientName: '',
//         memo: '',
//         statusId: firstKey,
//         statusColor: '', // 색상정보 초기화
//         timer: {
//           type: defaultTimerType,
//           currentTime: 0,
//           isRunning: false,
//           startedAt: 0,
//           updatedAt: Date.now()
//         }
//       };
  
//       // DB 업데이트 (초기화 데이터 저장)
//       await dbService.saveRoomStatus(hospitalId, departmentId, sectionId, roomId, resetData);
//       console.log('룸 데이터 초기화(삭제) 성공');
  
//       // 로컬 state도 초기값으로 리셋
//       setPatientName('');
//       setMemo('');
//       setSelectedStatusId(firstKey);
//       setTimerMinutes(0);
//       setTimerSeconds(0);
//       setStatusColor('');
//       onClose();
//     } catch (error) {
//       console.error('룸 데이터 초기화(삭제) 오류:', error);
//     }
//   };

//   return (
//     <>
//       <Dialog 
//         open={open} 
//         onClose={onClose} 
//         fullWidth 
//         maxWidth="sm"
//         PaperProps={{
//             sx: {
//             borderRadius: '12px',
//             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
//             overflow: 'hidden'
//             }
//         }}
//         >
//         <DialogTitle 
//             sx={{ 
//             p: 3, 
//             fontSize: '1.25rem',
//             fontWeight: 600,
//             borderBottom: '1px solid',
//             borderColor: 'grey.100'
//             }}
//         >
//             룸 정보 입력
//         </DialogTitle>
//         <DialogContent sx={{ p: 3 }}>
//             {loading ? (
//             <Typography sx={{ color: 'grey.600' }}>status 정보를 불러오는 중...</Typography>
//             ) : (
//             <>
//                 <TextField
//                 label="환자 이름"
//                 fullWidth
//                 margin="normal"
//                 value={patientName}
//                 onChange={(e) => setPatientName(e.target.value)}
//                 sx={{
//                     '& .MuiOutlinedInput-root': {
//                     borderRadius: '8px',
//                     }
//                 }}
//                 />
//                 <TextField
//                 label="특이 사항을 입력해주세요."
//                 fullWidth
//                 margin="normal"
//                 multiline
//                 rows={3}
//                 value={memo}
//                 onChange={(e) => setMemo(e.target.value)}
//                 sx={{
//                     '& .MuiOutlinedInput-root': {
//                     borderRadius: '8px',
//                     }
//                 }}
//                 />
//                 <FormControl fullWidth margin="normal">
//                 <InputLabel id="status-select-label">상태</InputLabel>
//                 <Select
//                     labelId="status-select-label"
//                     value={selectedStatusId}
//                     label="상태"
//                     onChange={(e) => setSelectedStatusId(e.target.value)}
//                     sx={{
//                     borderRadius: '8px',
//                     '& .MuiOutlinedInput-root': {
//                         '&:hover fieldset': {
//                         borderColor: 'primary.main',
//                         }
//                     }
//                     }}
//                 >
//                     {Object.values(statuses).map((status) => (
//                     <MenuItem 
//                         key={status.id} 
//                         value={status.id}
//                         sx={{
//                         '&:hover': {
//                             backgroundColor: 'primary.50'
//                         }
//                         }}
//                     >
//                         <Box
//                         component="span"
//                         sx={{
//                             display: 'inline-block',
//                             width: 14,
//                             height: 14,
//                             backgroundColor: status.color,
//                             marginRight: 1.5,
//                             borderRadius: '50%',
//                             border: '2px solid',
//                             borderColor: 'grey.100'
//                         }}
//                         />
//                         {status.name}
//                     </MenuItem>
//                     ))}
//                 </Select>
//                 </FormControl>

//                 {selectedStatusId &&
//                 statuses[selectedStatusId] &&
//                 statuses[selectedStatusId].timerType === 'countdown' && (
//                 <>
//                     <Typography 
//                     variant="subtitle1" 
//                     sx={{ 
//                         mt: 3, 
//                         mb: 1,
//                         fontWeight: 600,
//                         color: 'grey.700'
//                     }}
//                     >
//                     타이머 설정 (분:초)
//                     </Typography>
//                     <Grid2 container spacing={2} alignItems="center">
//                     <Grid xs={6}>
//                         <TextField
//                         label="분"
//                         type="number"
//                         fullWidth
//                         value={timerMinutes}
//                         onChange={(e) => setTimerMinutes(Math.max(0, Number(e.target.value)))}
//                         inputProps={{ min: 0 }}
//                         required
//                         sx={{
//                             '& .MuiOutlinedInput-root': {
//                             borderRadius: '8px',
//                             }
//                         }}
//                         />
//                     </Grid>
//                     <Grid xs={6}>
//                         <TextField
//                         label="초"
//                         type="number"
//                         fullWidth
//                         value={timerSeconds}
//                         onChange={(e) => setTimerSeconds(Math.max(0, Number(e.target.value)))}
//                         inputProps={{ min: 0 }}
//                         sx={{
//                             '& .MuiOutlinedInput-root': {
//                             borderRadius: '8px',
//                             }
//                         }}
//                         />
//                     </Grid>
//                     </Grid2>
//                 </>
//                 )}

//                 {selectedStatusId &&
//                 statuses[selectedStatusId] &&
//                 statuses[selectedStatusId].timerType === 'countup' && (
//                 <Typography 
//                     variant="body2" 
//                     sx={{ 
//                     mt: 2,
//                     color: 'grey.600',
//                     backgroundColor: 'grey.50',
//                     p: 2,
//                     borderRadius: '8px',
//                     border: '1px solid',
//                     borderColor: 'grey.200'
//                     }}
//                 >
//                     타이머는 00:00부터 시작해서 Countup 방식으로 동작합니다.
//                 </Typography>
//                 )}
//             </>
//             )}
//         </DialogContent>
//             <DialogActions 
//             sx={{ 
//                 p: 3,
//                 gap: 1.5,
//                 borderTop: '1px solid',
//                 borderColor: 'grey.100'
//             }}
//             >
//             <Button 
//                 onClick={onClose}
//                 variant="outlined"
//                 sx={{
//                 minWidth: '88px',
//                 height: '42px',
//                 color: 'grey.700',
//                 borderColor: 'grey.200',
//                 fontSize: '0.925rem',
//                 fontWeight: 500,
//                 '&:hover': {
//                     backgroundColor: 'grey.50',
//                     borderColor: 'grey.300'
//                 }
//                 }}
//             >
//                 취소
//             </Button>
//             <Button 
//                 onClick={handleResetClick}
//                 variant="outlined"
//                 sx={{
//                 minWidth: '88px',
//                 height: '42px',
//                 color: 'error.main',
//                 borderColor: 'error.main',
//                 fontSize: '0.925rem',
//                 fontWeight: 500,
//                 '&:hover': {
//                     backgroundColor: 'error.50',
//                     borderColor: 'error.dark'
//                 }
//                 }}
//             >
//                 초기화
//             </Button>
//             <Button 
//                 onClick={handleSave}
//                 variant="contained"
//                 disabled={!formValid}
//                 sx={{
//                 minWidth: '88px',
//                 height: '42px',
//                 fontSize: '0.925rem',
//                 fontWeight: 600,
//                 boxShadow: 'none',
//                 backgroundColor: 'primary.main',
//                 '&:hover': {
//                     boxShadow: 'none',
//                     backgroundColor: 'primary.dark'
//                 },
//                 '&:disabled': {
//                     backgroundColor: 'grey.300',
//                     color: 'white'
//                 }
//                 }}
//             >
//                 저장
//             </Button>
//             </DialogActions>
//       </Dialog>

//       {/* 초기화 확인 모달 */}
//       <ResetConfirmModal
//         open={resetConfirmOpen}
//         onCancel={handleResetCancel}
//         onConfirm={handleResetConfirm}
//       />
//     </>    
//   );
// }

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { dbService } from '../../../firebase/database';
import { FirebaseRoom, FirebaseStatus } from '../../../firebase/type';
import ResetConfirmModal from '../confirm/ResetConfirmModal';

interface StatusModalProps {
  open: boolean;
  onClose: () => void;
  sectionId: string;
  roomId: string;
  roomData: Partial<FirebaseRoom> | null;
  hospitalId: string;
  departmentId: string;
}

function StatusModal({ hospitalId, departmentId, open, onClose, sectionId, roomId, roomData }: StatusModalProps) {
  const [statuses, setStatuses] = useState<Record<string, FirebaseStatus>>({});
  const [selectedStatusId, setSelectedStatusId] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [statusColor, setStatusColor] = useState<string>('');
  const [timerMinutes, setTimerMinutes] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [formValid, setFormValid] = useState<boolean>(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const validateForm = () => {
    const isPatientNameValid = patientName.trim().length > 0;
    const isStatusSelected = selectedStatusId !== '';
    const isTimerValid =
      selectedStatusId &&
      statuses[selectedStatusId]
        ? statuses[selectedStatusId].timerType === 'countdown'
          ? timerMinutes > 0 || timerSeconds > 0
          : true
        : false;
    return isPatientNameValid && isStatusSelected && isTimerValid;
  };

  const handleResetClick = () => {
    setResetConfirmOpen(true);
  };

  const handleResetConfirm = async () => {
    await handleReset();
    setResetConfirmOpen(false);
  };

  const handleResetCancel = () => {
    setResetConfirmOpen(false);
  };

  useEffect(() => {
    setFormValid(validateForm());
  }, [patientName, selectedStatusId, timerMinutes, timerSeconds, statuses]);

  // 모달이 열릴 때 status 정보를 불러오고, 내부 state를 초기화
  useEffect(() => {
    if (open) {
      setLoading(true);
      const fetchStatuses = async () => {
        try {
          const sectionData = await dbService.getSection(hospitalId, departmentId, sectionId);
          if (!sectionData) {
            console.error('섹션을 찾을 수 없습니다.');
            return;
          }
  
          const statusesData = await dbService.getSectionStatuses(
            sectionData.hospitalId,
            sectionData.departmentId,
            sectionId
          );
  
          if (statusesData) {
            setStatuses(statusesData);
            if (roomData && roomData.statusId) {
              setSelectedStatusId(roomData.statusId);
            } else {
              const firstKey = Object.keys(statusesData)[0];
              if (firstKey) {
                setSelectedStatusId(firstKey);
              }
            }
          }
        } catch (error) {
          console.error('status 정보를 불러오는 중 오류 발생:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchStatuses();
  
      // ← **중요:** 모달이 열릴 때 한 번만 초기화 (roomData 변화에 의한 재초기화를 방지)
      setPatientName(roomData?.patientName || '');
      setMemo(roomData?.memo || '');
      setSelectedStatusId(roomData?.statusId || '');
      if (roomData?.timer && roomData.timer.type === 'countdown' && roomData.timer.targetTime) {
        const totalSeconds = roomData.timer.targetTime;
        setTimerMinutes(Math.floor(totalSeconds / 60));
        setTimerSeconds(totalSeconds % 60);
        setStatusColor(roomData.statusColor || '');
      } else {
        setTimerMinutes(0);
        setTimerSeconds(0);
      }
    }
  }, [open, hospitalId, departmentId, sectionId]);

  useEffect(() => {
    if (selectedStatusId && statuses[selectedStatusId]) {
      setStatusColor(statuses[selectedStatusId].color);
    }
  }, [selectedStatusId, statuses]);

  const handleSave = async () => {
    if (!validateForm()) {
      let errorMessage = '';
      if (!patientName.trim()) {
        errorMessage += '환자 이름을 입력해주세요.\n';
      }
      if (!selectedStatusId) {
        errorMessage += '상태를 선택해주세요.\n';
      }
      if (
        selectedStatusId &&
        statuses[selectedStatusId] &&
        statuses[selectedStatusId].timerType === 'countdown' &&
        timerMinutes === 0
      ) {
        errorMessage += '타이머는 최소 1초 이상 설정해주세요.';
      }
      alert(errorMessage);
      return;
    }
      
    const currentStatus = statuses[selectedStatusId];
    if (!currentStatus) {
      console.error('선택된 상태 정보가 없습니다:', selectedStatusId);
      return;
    }
  
    try {
      console.log('저장할 데이터:', {
        patientName,
        memo,
        statusId: selectedStatusId,
        statusColor: currentStatus.color,
        currentStatus
      });
  
      const roomDataToSave: Partial<FirebaseRoom> = {
        patientName,
        memo: memo || '',
        statusId: selectedStatusId,
        statusColor,
        timer: {
          type: currentStatus.timerType,
          currentTime: 0,
          isRunning: false,
          startedAt: Date.now(),
          updatedAt: Date.now(),
          ...(currentStatus.timerType === 'countdown'
            ? { targetTime: (timerMinutes * 60) + timerSeconds }
            : {})
        }
      };
  
      console.log('최종 저장 데이터:', roomDataToSave);
      await dbService.saveRoomStatus(hospitalId, departmentId, sectionId, roomId, roomDataToSave);
      console.log('저장 성공');
      onClose();
    } catch (error) {
      console.error('룸 상태 저장 오류:', error);
    }
  };

  const handleReset = async () => {
    try {
      const firstKey = Object.keys(statuses)[0] || '';
      const defaultTimerType = statuses[firstKey]?.timerType || 'countdown';
  
      const resetData: Partial<FirebaseRoom> = {
        patientName: '',
        memo: '',
        statusId: firstKey,
        statusColor: '',
        timer: {
          type: defaultTimerType,
          currentTime: 0,
          isRunning: false,
          startedAt: 0,
          updatedAt: Date.now()
        }
      };
  
      await dbService.saveRoomStatus(hospitalId, departmentId, sectionId, roomId, resetData);
      console.log('룸 데이터 초기화(삭제) 성공');
  
      setPatientName('');
      setMemo('');
      setSelectedStatusId(firstKey);
      setTimerMinutes(0);
      setTimerSeconds(0);
      setStatusColor('');
      onClose();
    } catch (error) {
      console.error('룸 데이터 초기화(삭제) 오류:', error);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            p: 3, 
            fontSize: '1.25rem',
            fontWeight: 600,
            borderBottom: '1px solid',
            borderColor: 'grey.100'
          }}
        >
          룸 정보 입력
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {loading ? (
            <Typography sx={{ color: 'grey.600' }}>status 정보를 불러오는 중...</Typography>
          ) : (
            <>
              <TextField
                label="환자 이름"
                fullWidth
                margin="normal"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
              <TextField
                label="특이 사항을 입력해주세요."
                fullWidth
                margin="normal"
                multiline
                rows={3}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-select-label">상태</InputLabel>
                <Select
                  labelId="status-select-label"
                  value={selectedStatusId}
                  label="상태"
                  onChange={(e) => setSelectedStatusId(e.target.value)}
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      }
                    }
                  }}
                >
                  {Object.values(statuses).map((status) => (
                    <MenuItem 
                      key={status.id} 
                      value={status.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'primary.50'
                        }
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-block',
                          width: 14,
                          height: 14,
                          backgroundColor: status.color,
                          marginRight: 1.5,
                          borderRadius: '50%',
                          border: '2px solid',
                          borderColor: 'grey.100'
                        }}
                      />
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedStatusId &&
                statuses[selectedStatusId] &&
                statuses[selectedStatusId].timerType === 'countdown' && (
                  <>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        mt: 3, 
                        mb: 1,
                        fontWeight: 600,
                        color: 'grey.700'
                      }}
                    >
                      타이머 설정 (분:초)
                    </Typography>
                    <Grid2 container spacing={2} alignItems="center">
                      <Grid xs={6}>
                        <TextField
                          label="분"
                          type="number"
                          fullWidth
                          value={timerMinutes}
                          onChange={(e) => setTimerMinutes(Math.max(0, Number(e.target.value)))}
                          inputProps={{ min: 0 }}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                            }
                          }}
                        />
                      </Grid>
                      <Grid xs={6}>
                        <TextField
                          label="초"
                          type="number"
                          fullWidth
                          value={timerSeconds}
                          onChange={(e) => setTimerSeconds(Math.max(0, Number(e.target.value)))}
                          inputProps={{ min: 0 }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                            }
                          }}
                        />
                      </Grid>
                    </Grid2>
                  </>
                )}

              {selectedStatusId &&
                statuses[selectedStatusId] &&
                statuses[selectedStatusId].timerType === 'countup' && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 2,
                      color: 'grey.600',
                      backgroundColor: 'grey.50',
                      p: 2,
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: 'grey.200'
                    }}
                  >
                    타이머는 00:00부터 시작해서 Countup 방식으로 동작합니다.
                  </Typography>
                )}
            </>
          )}
        </DialogContent>
        <DialogActions 
          sx={{ 
            p: 3,
            gap: 1.5,
            borderTop: '1px solid',
            borderColor: 'grey.100'
          }}
        >
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{
              minWidth: '88px',
              height: '42px',
              color: 'grey.700',
              borderColor: 'grey.200',
              fontSize: '0.925rem',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'grey.50',
                borderColor: 'grey.300'
              }
            }}
          >
            취소
          </Button>
          <Button 
            type="button"
            onClick={handleResetClick}
            variant="outlined"
            sx={{
              minWidth: '88px',
              height: '42px',
              color: 'error.main',
              borderColor: 'error.main',
              fontSize: '0.925rem',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'error.50',
                borderColor: 'error.dark'
              }
            }}
          >
            초기화
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            disabled={!formValid}
            sx={{
              minWidth: '88px',
              height: '42px',
              fontSize: '0.925rem',
              fontWeight: 600,
              boxShadow: 'none',
              backgroundColor: 'primary.main',
              '&:hover': {
                boxShadow: 'none',
                backgroundColor: 'primary.dark'
              },
              '&:disabled': {
                backgroundColor: 'grey.300',
                color: 'white'
              }
            }}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>

      <ResetConfirmModal
        open={resetConfirmOpen}
        onCancel={handleResetCancel}
        onConfirm={handleResetConfirm}
      />
    </>
  );
}

export default React.memo(StatusModal);