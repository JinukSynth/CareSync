// src/firebase/database.ts

import { ref, set, get, remove, child, update, onValue } from 'firebase/database';
import { firebaseService } from './index';
import { DB_PATHS, FirebaseRoom, FirebaseSection, FirebaseStatus } from './type';

export const dbService = {
// 예시 (Firebase Realtime DB 사용 시)

subscribeToRoomData: (hospitalId, departmentId, sectionId, roomId, callback) => {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');
  const roomRef = ref(db, `hospitals/${hospitalId}/departments/${departmentId}/sections/${sectionId}/rooms/${roomId}`);
  
  // onValue는 최초 로드 시 null일 수도 있는 데이터를 포함하여 항상 콜백 호출
  const unsubscribe = onValue(roomRef, (snapshot) => {
    const data = snapshot.val();
    callback(data); // 데이터가 null이어도 전달하여 초기 로드 누락 방지
  }, (error) => {
    console.error('Room data listener error:', error);
  });
  
  return unsubscribe;
},
 // ===== 섹션(Section) 관련 함수들 =====
 
 // 새로운 섹션 생성
async createSection(hospitalId: string, departmentId: string, section: FirebaseSection) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');
  
  console.log('Creating section at path:', `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${section.id}`);
  
  try {
    // 섹션 데이터 저장
    await set(
      ref(db, `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${section.id}`), 
      {
        ...section,
        hospitalId,
        departmentId
      }
    );
    console.log('Section created successfully');
  } catch (error) {
    console.error('Error creating section:', error);
    throw error;
  }
},

// 특정 ID의 섹션 조회
async getSection(hospitalId: string, departmentId: string, sectionId: string) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');

  const snapshot = await get(child(ref(db), `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}`));
  return snapshot.val() as FirebaseSection | null;
},

// 특정 병원/부서의 모든 섹션 목록 조회
async getAllSections(hospitalId: string, departmentId: string) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');

  const snapshot = await get(child(ref(db), `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}`));
  return snapshot.val() as Record<string, FirebaseSection> | null;
},

// 특정 섹션 삭제
async deleteSection(hospitalId: string, departmentId: string, sectionId: string) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');

  await remove(ref(db, `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}`));
},

// 섹션 정보 업데이트
async updateSection(hospitalId: string, departmentId: string, sectionId: string, updates: Partial<FirebaseSection>) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');

  const sectionRef = ref(db, `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}`);
  const snapshot = await get(sectionRef);
  const currentSection = snapshot.val() as FirebaseSection;

  if (!currentSection) throw new Error('Section not found');

  await update(sectionRef, updates);
},


 // ===== 룸(Room) 관련 함수들 =====
 
 // 새로운 룸 생성
 async createRoom(hospitalId: string, departmentId: string, sectionId: string, room: FirebaseRoom) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');
  
  await set(ref(db, `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}/rooms/${room.id}`), room);
},

// 특정 섹션의 모든 룸 조회
async getRoomsInSection(hospitalId: string, departmentId: string, sectionId: string) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');
  
  const snapshot = await get(child(ref(db), `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}/rooms`));
  return snapshot.val() as Record<string, FirebaseRoom> | null;
},

 // 특정 룸 삭제
 async deleteRoom(hospitalId: string, departmentId: string, sectionId: string, roomId: string) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');
  await remove(ref(db, `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}/rooms/${roomId}`));
},

// 룸 정보 업데이트
async updateRoom(hospitalId: string, departmentId: string, sectionId: string, roomId: string, updates: Partial<FirebaseRoom>) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');
  const roomRef = ref(db, `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}/rooms/${roomId}`);
  const snapshot = await get(roomRef);
  const currentRoom = snapshot.val() as FirebaseRoom;
  if (!currentRoom) throw new Error('Room not found');
  await set(roomRef, { ...currentRoom, ...updates });
},

 // ===== 섹션(Section) / 상태(Status) 관련 함수들 =====
 
 // Status 관련 함수 수정
 async createStatus(hospitalId: string, departmentId: string, sectionId: string, status: FirebaseStatus) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');
  
  const sectionRef = ref(db, `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}`);
  const snapshot = await get(sectionRef);
  const currentSection = snapshot.val() as FirebaseSection;
  
  if (!currentSection) throw new Error('Section not found');
  
  // 여기서 상태를 추가할 때 제대로 된 경로에 저장되는지 확인
  console.log('업데이트 전 섹션 정보:', currentSection);
  console.log('추가된 상태:', status);
  
  await update(sectionRef, {
    statuses: {
      ...(currentSection.statuses || {}),
      [status.id]: status
    }
  });
},

 // 특정 섹션의 모든 상태 조회
 async getSectionStatuses(hospitalId: string, departmentId: string, sectionId: string) {
  console.log('Getting statuses for section:', sectionId);
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');
  
  const path = `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}/statuses`;
  console.log('DB path:', path);
  
  const snapshot = await get(child(ref(db), path));
  console.log('DB snapshot:', snapshot.val());
  
  return snapshot.val() as Record<string, FirebaseStatus> | null;
},

 // 특정 섹션의 특정 상태 삭제
async deleteStatus(hospitalId: string, departmentId: string, sectionId: string, statusId: string) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');

  const sectionRef = ref(db, `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}`);
  const snapshot = await get(sectionRef);
  const currentSection = snapshot.val() as FirebaseSection;

  if (!currentSection) throw new Error('Section not found');

  const { [statusId]: removedStatus, ...remainingStatuses } = currentSection.statuses || {};
  
  // 섹션의 statuses 업데이트
  await update(sectionRef, {
    statuses: remainingStatuses
  });
},

 // 특정 섹션의 특정 상태 업데이트
 async updateStatus(
  hospitalId: string, 
  departmentId: string, 
  sectionId: string, 
  statusId: string, 
  updates: Partial<FirebaseStatus>
) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');

  const statusRef = ref(db, `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}/statuses/${statusId}`);
  const snapshot = await get(statusRef);
  const currentStatus = snapshot.val() as FirebaseStatus;

  if (!currentStatus) throw new Error('Status not found');
  
  await set(statusRef, { ...currentStatus, ...updates });
  console.log('Status updated successfully:', statusId, updates);
},

 // 룸의 상태 업데이트 (타이머 포함)
 async updateRoomStatus(
  hospitalId: string,
  departmentId: string,
  sectionId: string, 
  roomId: string, 
  statusId: string, 
  timerData?: FirebaseRoom['timer']
) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');

  const roomRef = ref(db, `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}/rooms/${roomId}`);
  const snapshot = await get(roomRef);
  const currentRoom = snapshot.val() as FirebaseRoom;

  if (!currentRoom) throw new Error('Room not found');

  await update(roomRef, {
    statusId,
    ...(timerData && { timer: timerData })
  });
},

 //  ===== 룸(Room) / 상태(Status) 및 환자 정보(Patient Info) 관련 함수들 =====
 // 룸의 상태와 타이머 정보 저장
 async saveRoomStatus(
  hospitalId: string,
  departmentId: string,
  sectionId: string,
  roomId: string,
  data: Partial<Omit<FirebaseRoom, 'id' | 'name' | 'createdAt'>>
) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');
  
  const roomRef = ref(db, `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}/rooms/${roomId}`);
  await update(roomRef, data);
},

 // 룸 상태 초기화 (환자 퇴실 등)
 async resetRoomStatus(hospitalId: string, departmentId: string, sectionId: string, roomId: string) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');
  const roomRef = ref(db, `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}/rooms/${roomId}`);
  await update(roomRef, {
    patientName: '',
    memo: '',
    statusId: 'default',
    timer: {
      type: 'countdown',
      currentTime: 0,
      isRunning: false,
      startedAt: 0
    }
  });
},

 // 타이머 업데이트
async updateRoomTimer(
  hospitalId: string,
  departmentId: string,
  sectionId: string,
  roomId: string,
  timerData: {
    currentTime: number;
    isRunning: boolean;
    startedAt: number | null;
  }
) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');
  
  const roomRef = ref(db, `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}/rooms/${roomId}/timer`);
  await update(roomRef, timerData);
},

 //  ===== 룸(Room)에 들어가 있는 RoomData 관련 함수 // 

 // 룸 데이터 가져오기
 async getRoomData(hospitalId: string, departmentId: string, sectionId: string, roomId: string) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');
  const roomRef = ref(db, `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}/rooms/${roomId}`);
  const snapshot = await get(roomRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
},

 // 룸 데이터 초기화하기
 async resetRoomData(hospitalId: string, departmentId: string, sectionId: string, roomId: string) {
  const db = firebaseService.getDatabase();
  if (!db) throw new Error('Database not initialized');
  const roomRef = ref(db, `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}/${sectionId}/rooms/${roomId}`);
  
  const resetData = {
    patientName: "",
    statusId: "",
    memo: "",
    timer: {
      currentTime: 0,
      targetTime: 0,
      isRunning: false,
      startedAt: 0,
    }
  };

  try {
    await update(roomRef, resetData);
    console.log(`Room data reset successful: section ${sectionId}, room ${roomId}`);
  } catch (error) {
    console.error(`Error resetting room data: section ${sectionId}, room ${roomId}`, error);
    throw error;
  }
}

};