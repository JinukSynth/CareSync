// src/firebase/types.ts
// Firebase Realtime Database에서 사용할 데이터 타입들을 정의

export interface Hospital {
    id: string;
    name: string;
    departments: Record<string, Department>;
    createdAt: number;
  }
  
  export interface Department {
    id: string;
    name: string;
  }
  
  export interface HospitalUser {
    email: string;
    hospitalId: string;
    departmentId: string;
    role: 'user' | 'admin';
    createdAt: number;
    hospitalName: string;    // 추가
    departmentName: string;  // 추가
  }
  

// 섹션(시술실) 데이터 타입
export interface FirebaseSection {
    id: string;        // 고유 식별자
    hospitalId: string;    // 추가: 소속 병원 ID
    departmentId: string;  // 추가: 소속 부서 ID
    name: string;      // 섹션 이름 (예: "시술실 1")
    createdAt: number;  // 생성 시간 (타임스탬프)
    rooms: Record<string, FirebaseRoom>; // 룸 목록 (key: roomId, value: room 데이터)
    statuses: Record<string, FirebaseStatus>;
}
   
// 룸(방) 데이터 타입
export interface FirebaseRoom {
    id: string;
    name: string;
    patientName: string;
    statusId: string;
    memo?: string;
    statusColor?: string;
    timer: {
        type: 'countdown' | 'countup';
        currentTime: number;
        targetTime?: number; // countdown: 시작시간, countup: 목표시간
        isRunning: boolean;
        startedAt?: number;
        updatedAt?: number;
      };
    createdAt: number;
    // uiState: FirebaseRoomUIState;
  }

  // firebase/type.ts에 추가
export interface FirebaseRoomUIState {
  isModalOpen: boolean;
  isEditingName: boolean;
  nameInput: string;
  backgroundColor: string;
  timer: {
    isRunning: boolean;
    currentTime: number;
    startedAt: number;
    targetTime?: number;
    type: 'countdown' | 'countup';
  };
}
   
// 상태 데이터 타입
export interface FirebaseStatus {
    id: string;
    name: string;
    timerType: 'countdown' | 'countup';
    targetTime?: number;
    color: string;
    sectionId: string;
  }
   
// 데이터베이스 경로 상수: FIREBASE에서 데이터를 저장하고 접근할 수 있도록 정의해놓은 것
// DB_PATHS 수정
export const DB_PATHS = {
    HOSPITALS: 'hospitals',    // 추가
    DEPARTMENTS: 'departments', // 추가
    USERS: 'users',
    SECTIONS: 'sections',
    ROOMS: 'rooms',
    STATUSES: 'statuses'
} as const;