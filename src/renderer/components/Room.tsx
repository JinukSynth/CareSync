// src/renderer/components/Room.tsx
import React, { useState, useEffect } from 'react';
import { Room as RoomType } from '../types';
import { useEditMode } from '../context/EditModeContext';
import { FirebaseRoom, FirebaseSection } from '../../firebase/type';
import StatusModal from './modals/StatusModal';
import { useTimer } from '../hooks/useTimer'; // useTimer 훅 import
import '../css/Room.css';

interface RoomProps {
  room: RoomType;
  sectionId: string;
  section: FirebaseSection;
  onRemove?: () => void;
  onUpdateName?: (newName: string) => void;
  onClick?: () => void;
  hospitalId?: string;
  departmentId?: string; 
}

interface TimerData {
  type: 'countdown' | 'countup';
  targetTime?: number;
  startedAt: number;
}

interface RoomTimerData {
  timer?: {
    type: 'countdown' | 'countup';
    targetTime?: number;
    startedAt: number;
    currentTime?: number;
    isRunning?: boolean;
  };
}

export default function Room({ room, sectionId, section, onRemove, onUpdateName }: RoomProps) {
  const { isEditMode } = useEditMode();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(room.name);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // local state now mirrors the room prop from Main.tsx
  const [roomData, setRoomData] = useState<Partial<FirebaseRoom> | null>(room);

  // useTimer 훅 사용 (타이머 관련 로직)
  const { timer, setTimer, isTimeUp } = useTimer(section.hospitalId, section.departmentId, sectionId, room.id, null);

  // 타이머 초기화 조건 체크 함수
  const shouldResetTimer = (timerData: TimerData) => {
    return (
      !timerData ||
      (timerData.type === 'countdown' && (!timerData.targetTime || timerData.targetTime === 0)) ||
      (timerData.type === 'countup' && timerData.startedAt === 0)
    );
  };

  // 타이머 설정 로직
  const setupTimer = async (data: RoomTimerData) => {
    if (!data?.timer || shouldResetTimer(data.timer)) {
      setTimer(null);
      return;
    }
   
    const { timer: timerData } = data;
    let startedAt = timerData.startedAt;
   
    if (timerData.type === 'countdown' && timerData.targetTime && timerData.targetTime > 0) {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = timerData.targetTime - elapsed;
      if (remaining <= 0) {
        setTimer({
          type: 'countdown',
          currentTime: 0,
          isRunning: false,
          startedAt: startedAt,
          targetTime: timerData.targetTime,
        });
        return;
      }
      if (!startedAt || startedAt === 0) {
        startedAt = Date.now();
        await Promise.resolve(); // dbService.updateRoomTimer 등 호출이 필요하면 추가
      }
      setTimer({
        type: 'countdown',
        currentTime: remaining,
        isRunning: true,
        startedAt: startedAt,
        targetTime: timerData.targetTime,
      });
    } else if (timerData.type === 'countup') {
      if (!startedAt || startedAt === 0) {
        startedAt = Date.now();
        await Promise.resolve(); // dbService.updateRoomTimer 등 호출이 필요하면 추가
      }
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setTimer({
        type: 'countup',
        currentTime: elapsed,
        isRunning: true,
        startedAt: startedAt,
      });
    }
  };

  // 이제 개별 구독 대신, room prop이 변경될 때마다 local state와 타이머를 업데이트합니다.
  useEffect(() => {
    setRoomData(room);
    (async () => {
      if (room && (room as any).timer) {
        await setupTimer({ timer: (room as any).timer });
      } else {
        setTimer(null);
      }
    })();
  }, [room, setTimer]);

  // handleModalClose 단순히 모달 닫기
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
    
  const handleStatusModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditMode) {
      setIsModalOpen(true);
      console.log('modal opened for room:', room);
    }
  };

  const handleNameSave = () => {
    if (nameInput.trim() && onUpdateName) {
      onUpdateName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTextColor = (backgroundColor: string) => {
    const isDark = (color: string) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return ((r * 299) + (g * 587) + (b * 114)) / 1000 < 128;
    };
    return isDark(backgroundColor) ? 'text-gray-300' : 'text-gray-800';
  };

  return (
    <>
      <div 
        style={{ backgroundColor: roomData?.statusColor || 'white' }}
        className={`relative p-4 rounded-lg shadow-sm h-44 bg-white ${
          isEditMode ? 'border-blue-500 border-2' : 'border'
        } ${isTimeUp ? 'timer-ended' : ''}`}
        onClick={handleStatusModal}
      >
        {isEditMode && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm"
          >
            ✕
          </button>
        )}
        {isEditMode && onUpdateName && isEditingName ? (
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleNameSave();
                e.currentTarget.blur();
              }
            }}
            onBlur={handleNameSave}
            className="text-xl font-bold w-4/5 px-2 py-1 border rounded"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div 
            className={`text-xl font-bold ${
              isEditMode && onUpdateName ? 'cursor-pointer hover:bg-gray-100 p-1 rounded' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (isEditMode && onUpdateName) {
                setIsEditingName(true);
              }
            }}
          >
            {room.name}
          </div>
        )}
        {!isEditMode && (
        <div className="mt-4 space-y-1">
          {(!roomData?.patientName || roomData.patientName.trim() === '') ? (
            <div className={`${getTextColor(roomData?.statusColor || 'white')} text-opacity-90`}>
              <span className='text-gray-500'>환자 없음</span>
            </div>
          ) : (
            <>
              {roomData.patientName && (
                <div className={`${getTextColor(roomData?.statusColor || 'white')} text-opacity-90 text-sm`}>
                  <span className="font-semibold">이름:</span> {roomData.patientName}
                </div>
              )}
              {roomData.memo && (
                <div className={`${getTextColor(roomData?.statusColor || 'white')} text-opacity-90 text-sm`}>
                  <span className="font-semibold">특이 사항: </span> {roomData.memo ? roomData.memo : '없음'}
                </div>
              )}
              {roomData.statusId && (
                <div className={`${getTextColor(roomData?.statusColor || 'white')} text-opacity-90 flex text-sm items-center`}>
                  <span className="font-semibold">상태:</span>
                  <div className="flex items-center">
                    <span
                      className="inline-block w-1 h-3 rounded-full"
                      style={{ backgroundColor: roomData.statusColor || 'transparent' }}
                    />
                    {section.statuses?.[roomData.statusId]?.name || ''}
                  </div>
                </div>
              )}
              {timer && (
                <div className="mt-2 text-right">
                  <div className={`${getTextColor(roomData?.statusColor || 'white')} text-opacity-90 text-xl font-stretch-100%`}>
                    <span className='text-sm font-semibold'>타이머: </span>{formatTime(timer.currentTime)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      </div>
      {!isEditMode && (
        <StatusModal
          open={isModalOpen}
          onClose={handleModalClose}
          sectionId={sectionId}
          roomId={room.id}
          roomData={roomData}
          hospitalId={section.hospitalId}
          departmentId={section.departmentId}
        />
      )}
    </>
  );
}