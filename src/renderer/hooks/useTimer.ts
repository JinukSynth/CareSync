// // hooks/useTimer.ts
// import { useState, useEffect } from 'react';
// import { dbService } from '../../firebase/database';

// export interface TimerState {
//   type: 'countdown' | 'countup';
//   currentTime: number;   // 초 단위 현재 시간 (남은 시간 또는 경과 시간)
//   isRunning: boolean;
//   startedAt: number;     // 타이머 시작 시점 (밀리초 단위)
//   targetTime?: number;   // countdown인 경우 목표 시간 (초)
// }

// /**
//  * useTimer 훅
//  *
//  * - countdown: 목표 시간에서 경과한 초를 빼서 남은 시간을 계산하며, 0 이하가 되면 타이머 종료.
//  * - countup: 타이머 시작 시점부터 경과한 초를 currentTime에 반영.
//  *
//  * @param sectionId 섹션 ID (DB 업데이트에 사용)
//  * @param roomId 룸 ID (DB 업데이트에 사용)
//  * @param initialTimer 초기에 설정할 타이머 상태 (없으면 null)
//  */
// export function useTimer(
//   hospitalId: string,
//   departmentId: string,
//   sectionId: string,
//   roomId: string,
//   initialTimer?: TimerState | null
// ) {
//   // 초기 상태: DB에서 가져온 초기 타이머 상태가 있으면 사용
//   const [timer, setTimer] = useState<TimerState | null>(initialTimer || null);
//   const [isTimeUp, setIsTimeUp] = useState(false); // 타이머 종료 여부 flag


//   // DB에서 전달받은 최신 타이머 값이 있으면 로컬 상태에 반영
//   useEffect(() => {
//     if (initialTimer) {
//       setTimer(initialTimer);
//     } else {
//       // initialTimer가 null인 경우 타이머를 명시적으로 초기화
//       setTimer(null);
//       setIsTimeUp(false);
//     }
//   }, [initialTimer]);

//   useEffect(() => {
//     if (!timer) {
//       setIsTimeUp(false);
//     }
//   }, [timer]);
  
//   // 타이머가 실행 중일 때 1초 간격으로 업데이트
//   useEffect(() => {
//     if (!timer || !timer.isRunning) return;

//     const intervalId = setInterval(() => {
//       // 함수형 업데이트를 통해 이전 상태(prev)를 기준으로 최신 값을 계산
//       setTimer(prev => {
//         if (!prev) return prev;
//         const now = Date.now();
//         const elapsedSeconds = Math.floor((now - prev.startedAt) / 1000);

//         if (prev.type === 'countdown') {
//           // 남은 시간 계산: 목표 시간에서 경과한 시간 빼기
//           const remainingTime = (prev.targetTime || 0) - elapsedSeconds;

//           if (remainingTime <= 0) {
//             // 타이머 종료: 남은 시간이 0 이하이면 종료 상태로 전환
//             setIsTimeUp(true);
//             dbService.updateRoomTimer( hospitalId, departmentId, sectionId, roomId, {
//               currentTime: 0,
//               isRunning: false,
//               startedAt: 0,
//             });
//             return { ...prev, currentTime: 0, isRunning: false };
//           } else {
//             setIsTimeUp(false);
//             dbService.updateRoomTimer(hospitalId, departmentId, sectionId, roomId, {
//               currentTime: remainingTime,
//               isRunning: true,
//               startedAt: prev.startedAt,
//             });
//             return { ...prev, currentTime: remainingTime };
//           }
//         } else {
//           // countup: 경과한 시간 업데이트
//           const updatedTimer = {
//             ...prev,
//             currentTime: elapsedSeconds,
//             isRunning: true,  // isRunning 상태 명시적 유지
//           };
//           setIsTimeUp(false);
//           dbService.updateRoomTimer(hospitalId, departmentId, sectionId, roomId, {
//             currentTime: elapsedSeconds,
//             isRunning: true,
//             startedAt: prev.startedAt,
//           });
          
//           return updatedTimer;
//         }
//       });
//     }, 1000);

//     return () => clearInterval(intervalId);
//   }, [timer?.isRunning, sectionId, roomId]);

//   return {
//     timer,
//     setTimer,
//     isTimeUp, // 타이머 종료 상태 반환
//   };
// }

import { useState, useEffect } from 'react';
import { dbService } from '../../firebase/database';

export interface TimerState {
  type: 'countdown' | 'countup';
  currentTime: number;   // 초 단위 현재 시간 (남은 시간 또는 경과 시간)
  isRunning: boolean;
  startedAt: number;     // 타이머 시작 시점 (밀리초 단위)
  targetTime?: number;   // countdown인 경우 목표 시간 (초)
}

/**
 * useTimer 훅
 *
 * - countdown: 목표 시간에서 경과한 초를 빼서 남은 시간을 계산하며, 0 이하가 되면 타이머 종료.
 * - countup: 타이머 시작 시점부터 경과한 초를 currentTime에 반영.
 *
 * @param hospitalId 병원 ID (DB 업데이트에 사용)
 * @param departmentId 부서 ID (DB 업데이트에 사용)
 * @param sectionId 섹션 ID (DB 업데이트에 사용)
 * @param roomId 룸 ID (DB 업데이트에 사용)
 * @param initialTimer 초기에 설정할 타이머 상태 (없으면 null)
 */
export function useTimer(
  hospitalId: string,
  departmentId: string,
  sectionId: string,
  roomId: string,
  initialTimer?: TimerState | null
) {
  // 초기 상태: DB에서 가져온 초기 타이머 상태가 있으면 사용
  const [timer, setTimer] = useState<TimerState | null>(initialTimer || null);
  const [isTimeUp, setIsTimeUp] = useState(false); // 타이머 종료 여부 flag

  // DB에서 전달받은 초기 타이머 값 반영
  useEffect(() => {
    if (initialTimer) {
      setTimer(initialTimer);
    } else {
      setTimer(null);
      setIsTimeUp(false);
    }
  }, [initialTimer]);

  // timer 상태에 따라 isTimeUp을 업데이트하는 효과
  useEffect(() => {
    if (timer) {
      if (timer.currentTime === 0 && !timer.isRunning) {
        setIsTimeUp(true);
      } else {
        setIsTimeUp(false);
      }
    } else {
      setIsTimeUp(false);
    }
  }, [timer]);

  // 타이머가 실행 중일 때 1초 간격으로 업데이트
  useEffect(() => {
    if (!timer || !timer.isRunning) return;

    const intervalId = setInterval(() => {
      setTimer(prev => {
        if (!prev) return prev;
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - prev.startedAt) / 1000);

        if (prev.type === 'countdown') {
          const remainingTime = (prev.targetTime || 0) - elapsedSeconds;
          if (remainingTime <= 0) {
            // 타이머 종료: 모든 클라이언트에서 동일하게 0, false 처리
            setIsTimeUp(true);
            dbService.updateRoomTimer(hospitalId, departmentId, sectionId, roomId, {
              currentTime: 0,
              isRunning: false,
              startedAt: 0,
            });
            return { ...prev, currentTime: 0, isRunning: false };
          } else {
            setIsTimeUp(false);
            dbService.updateRoomTimer(hospitalId, departmentId, sectionId, roomId, {
              currentTime: remainingTime,
              isRunning: true,
              startedAt: prev.startedAt,
            });
            return { ...prev, currentTime: remainingTime };
          }
        } else {
          // countup 방식: 경과한 시간 업데이트
          const updatedSeconds = elapsedSeconds;
          setIsTimeUp(false);
          dbService.updateRoomTimer(hospitalId, departmentId, sectionId, roomId, {
            currentTime: updatedSeconds,
            isRunning: true,
            startedAt: prev.startedAt,
          });
          return { ...prev, currentTime: updatedSeconds };
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer?.isRunning, hospitalId, departmentId, sectionId, roomId]);

  return {
    timer,
    setTimer,
    isTimeUp,
  };
}