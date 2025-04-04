// src/renderer/components/Main.tsx
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Section } from '../types';
import Room from './Room';
import { v4 as uuidv4 } from 'uuid';
import { useEditMode } from '../context/EditModeContext';
import { useSections } from '../hooks/useSection';
import { FirebaseSection } from '../../firebase/type';
import EditStatusModal from './modals/EditStatusModal';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Alert,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Navigate } from 'react-router-dom';
import { authService } from '../../firebase/auth';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from './confirm/LogoutConfirmModal';
import DeleteSectionModal from './confirm/SectionDeleteConfirmModal';
import Header from '../ui/Header';
import ExpirationAlert from '../ui/ExpirationAlert';
import { dbService } from '../../firebase/database';

export default function Main() {
  // auth
  const { user, isLoading: authLoading } = useAuth();
  const [hospitalData, setHospitalData] = useState<{
    hospitalId: string;
    departmentId: string;
    hospitalName: string;
    departmentName: string;
  } | null>(null);

  // get sections from firebase
  const { sections: fbSections, loading, error, addSection: addFbSection, removeSection: removeFbSection } 
    = useSections(hospitalData?.hospitalId, hospitalData?.departmentId);
  const { isEditMode } = useEditMode();
  
  // Section Name 관련 상태관리
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionNameInput, setSectionNameInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<{id: string, name: string} | null>(null);

  const navigate = useNavigate();

  // 만료기간 안내: 21일 후로 설정
  const [expirationDate] = useState(new Date('2025-03-13'));

  const theme = useTheme();
  // 브라우저 창 너비가 최소 크기(300px) 근처일 때를 감지
  const isAtMinWidth = useMediaQuery('(max-width:390px)');


  // Firebase sections를 기존 UI에 맞게 변환
  const sections: Section[] = fbSections
  ? Object.values(fbSections)
      .map(fbSection => ({
        id: fbSection.id,
        name: fbSection.name,
        createdAt: fbSection.createdAt,
        rooms: fbSection.rooms || {},
        statuses: fbSection.statuses || {},
        hospitalId: fbSection.hospitalId,
        departmentId: fbSection.departmentId
      }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  : [];

  // 전역 구독: 각 섹션의 모든 룸 데이터를 실시간으로 업데이트하여,
  // 사용자가 별도 액션 없이 최신 데이터를 받도록 합니다.
  useEffect(() => {
    if (!hospitalData || !fbSections) return;
    
    const unsubscribes: (() => void)[] = [];
    
    sections.forEach(section => {
      if (!fbSections[section.id]) return;
      
      Object.values(section.rooms).forEach(room => {
        const unsubscribe = dbService.subscribeToRoomData(
          section.hospitalId,
          section.departmentId,
          section.id,
          room.id,
          (updatedRoomData) => {
            console.log(`룸 데이터 업데이트 수신 (${section.id}/${room.id}):`, updatedRoomData);
            if (!fbSections[section.id]) return;
            const updatedSection = { ...fbSections[section.id] };
            updatedSection.rooms = {
              ...updatedSection.rooms,
              [room.id]: {
                ...updatedSection.rooms[room.id],
                ...updatedRoomData,
              },
            };
            addFbSection(updatedSection);
          }
        );
        unsubscribes.push(unsubscribe);
      });
    });
    
    return () => {
      unsubscribes.forEach(unsubscribe => {
        console.log('룸 리스너 정리');
        unsubscribe();
      });
    };
  }, [sections, hospitalData, fbSections, addFbSection]);
  
  // 사용자 병원 정보 가져오기
  useEffect(() => {
    const fetchHospitalData = async () => {
      if (user) {
        const userData = await authService.getUserHospital(user.uid);
        if (userData) {
          setHospitalData({
            hospitalId: userData.hospitalId,
            departmentId: userData.departmentId,
            hospitalName: userData.hospitalName,
            departmentName: userData.departmentName
          });
        }
      }
    };
    fetchHospitalData();
  }, [user]);

  const handleOpenEditModal = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setSelectedSectionId(null);
    setEditModalOpen(false);
  };

  // 섹션 추가 함수
  const addSection = async () => {
    if (!hospitalData) return;
    
    const newSection: FirebaseSection = {
      id: uuidv4(),
      hospitalId: hospitalData.hospitalId,
      departmentId: hospitalData.departmentId,
      name: `시술실 ${sections.length + 1}`,
      createdAt: Date.now(),
      rooms: {},
      statuses: {}
    };
    await addFbSection(newSection);
  };
  
  // 섹션 삭제 함수
  const removeSectionHandler = async (sectionId: string) => {
    console.log('Removing section with ID:', sectionId);
    await removeFbSection(sectionId);
    console.log('Section removed successfully:', sectionId);
  };

  const handleDeleteClick = (sectionId: string, sectionName: string) => {
    setSectionToDelete({ id: sectionId, name: sectionName });
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (sectionToDelete) {
      await removeSectionHandler(sectionToDelete.id);
      setIsDeleteModalOpen(false);
      setSectionToDelete(null);
    }
  };
    
  // 섹션 이름 관련 함수
  const updateSectionName = async (sectionId: string, newName: string) => {
    console.log('Updating section name for ID:', sectionId, 'to:', newName);
    const section = fbSections?.[sectionId];
    if (section) {
      await addFbSection({
        ...section,
        name: newName
      });
      console.log('Section name updated successfully:', sectionId);
    }
  };

  const startEditing = (sectionId: string, currentName: string) => {
    setEditingSectionId(sectionId);
    setSectionNameInput(currentName);
  };

  const handleSectionNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSectionNameInput(e.target.value);
  };

  const handleSectionNameSave = async (sectionId: string) => {
    if (isSaving) return;
    setIsSaving(true);
    
    if (sectionNameInput.trim()) {
      await updateSectionName(sectionId, sectionNameInput);
    }
    setEditingSectionId(null);
    setIsSaving(false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleInputBlur = async () => {
    if (!isSaving) {
      await handleSectionNameSave(editingSectionId as string);
    }
  };

  // 룸 추가/삭제 함수
  const addRoom = async (sectionId: string) => {
    console.log('Adding room to section ID:', sectionId);
    const section = fbSections?.[sectionId];
    if (section) {
      const newRoom = {
        id: uuidv4(),
        sectionName: section.name,
        name: `${Object.keys(section.rooms || {}).length + 1}번방`,
        patientName: '',
        statusId: 'default',
        timer: {
          type: 'countdown',
          currentTime: 0,
          targetTime: 0,
          isRunning: false
        },
        createdAt: Date.now()
      };

      await addFbSection({
        ...section,
        rooms: {
          ...(section.rooms || {}),
          [newRoom.id]: newRoom
        }
      });
      console.log('Room added successfully:', newRoom);
    }
  };

  const removeRoom = async (sectionId: string, roomId: string) => {
    console.log('Removing room with ID:', roomId, 'from section ID:', sectionId);
    const section = fbSections?.[sectionId];
    if (section && section.rooms) {
      const { [roomId]: removedRoom, ...remainingRooms } = section.rooms;
      await addFbSection({
        ...section,
        rooms: remainingRooms
      });
      console.log('Room removed successfully:', roomId);
    }
  };

  const updateRoomName = async (sectionId: string, roomId: string, newName: string) => {
    console.log('Updating room name for ID:', roomId, 'to:', newName);
    const section = fbSections?.[sectionId];
    if (section && section.rooms && section.rooms[roomId]) {
      await addFbSection({
        ...section,
        rooms: {
          ...section.rooms,
          [roomId]: {
            ...section.rooms[roomId],
            name: newName
          }
        }
      });
      console.log('Room name updated successfully:', roomId);
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="text-4xl font-semibold">인증 확인 중...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="text-4xl font-semibold">로딩 중...</div>
    </div>
  );

  if (error) return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Alert severity="error" sx={{ width: '100%', maxWidth: 600, textAlign: 'center' }}>
        <strong>사용 기간이 만료되어 계정을 이용하실 수 없습니다.</strong>
      </Alert>
    </Box>
  );

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <ExpirationAlert expirationDate={expirationDate} />

      <Header 
        hospitalData={hospitalData}
        onLogout={handleLogoutClick}
      />
  
      <Box sx={{ height: 80 }} /> {/* 상단 여백 */}
  
      <Stack spacing={4}>
        {sections.length === 0 ? (
          <Box 
            sx={{ 
              height: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {isEditMode ? (
              <>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'grey.400',
                    fontWeight: 500,
                    textAlign: 'center',
                    letterSpacing: '-0.01em'
                  }}
                >
                  '섹션 추가'를 통해 공간을 만들어보세요.
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'grey.400',
                    backgroundColor: 'grey.50',
                    px: 3,
                    py: 1,
                    borderRadius: 2
                  }}
                >
                  섹션이 추가되면 룸 추가 버튼을 통해 룸을 만들 수 있습니다.
                </Typography>
              </>
            ) : (
              <>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'grey.400',
                    fontWeight: 500,
                    textAlign: 'center',
                    letterSpacing: '-0.01em'
                  }}
                >
                  '조작 모드'에서 업무 환경을 셋팅해보세요.
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'grey.400',
                    backgroundColor: 'grey.50',
                    px: 3,
                    py: 1,
                    borderRadius: 2
                  }}
                >
                  왼쪽 상단에 있는 '시스템 사용 안내'를 통해 시스템 사용법을 확인할 수 있습니다.
                </Typography>
              </>
            )}
          </Box>
        ) : (
          sections.map(section => (
            <Paper 
              key={section.id} 
              sx={{ 
                bgcolor: 'grey.50', 
                p: 4, 
                borderRadius: 2 
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                {isEditMode ? (
                  <>
                    <TextField
                      value={editingSectionId === section.id ? sectionNameInput : section.name}
                      onFocus={() => startEditing(section.id, section.name)}
                      onChange={handleSectionNameChange}
                      onKeyDown={handleKeyDown}
                      onBlur={handleInputBlur}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-input': {
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          py: 1,
                          px: 2
                        }
                      }}
                    />
                    <Button 
                      onClick={() => handleDeleteClick(section.id, section.name)}
                      color="error"
                      sx={{ '&:hover': { color: 'error.dark' } }}
                    >
                      삭제
                    </Button>
                    <Button 
                      onClick={() => handleOpenEditModal(section.id)}
                      color="primary"
                      sx={{ '&:hover': { color: 'primary.dark' } }}
                    >
                      상태 관리
                    </Button>
                  </>
                ) : (
                  <Typography variant="h6" component="h6" fontWeight={600}>
                    {section.name}
                  </Typography>
                )}
              </Box>

              <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12, lg: 20 }}>
                {Object.values(section.rooms)
                  .sort((a, b) => a.createdAt - b.createdAt)
                  .map((room) => (
                    <Grid item xs={isAtMinWidth ? 12 : 6} sm={6} md={3} lg={4} key={room.id}>
                      <Room
                        room={room}
                        sectionId={section.id}
                        section={section}
                        onUpdateName={
                          isEditMode
                            ? (newName: string) => updateRoomName(section.id, room.id, newName)
                            : undefined
                        }
                        onRemove={isEditMode ? () => removeRoom(section.id, room.id) : undefined}
                      />
                    </Grid>
                  ))}
                {isEditMode && (
                  <Grid item xs={isAtMinWidth ? 12 : 6} sm={6} md={3} lg={4}>
                    <Button
                      onClick={() => addRoom(section.id)}
                      fullWidth
                      sx={{
                        height: '11rem',
                        border: '2px dashed',
                        borderColor: 'grey.300',
                        borderRadius: 2,
                        color: 'text.secondary',
                        '&:hover': {
                          borderColor: 'primary.main',
                          color: 'primary.main'
                        }
                      }}
                    >
                      + 룸 추가
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Paper>
          ))
        )}

        {isEditMode && (
          <Button
            onClick={addSection}
            fullWidth
            sx={{
              py: 3,
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 2,
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main'
              }
            }}
          >
            + 섹션 추가
          </Button>
        )}
      </Stack>
          
      {editModalOpen && selectedSectionId && hospitalData && (
        <EditStatusModal
          sectionId={selectedSectionId}
          section={fbSections?.[selectedSectionId] as FirebaseSection}
          statuses={fbSections?.[selectedSectionId]?.statuses || {}}
          onClose={handleCloseEditModal}
          hospitalId={hospitalData.hospitalId} 
          departmentId={hospitalData.departmentId}
        />
      )}
  
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
  
      {sectionToDelete && (
        <DeleteSectionModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSectionToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          sectionName={sectionToDelete.name}
        />
      )}
    </Box>
  );
}