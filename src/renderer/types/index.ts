// types/index.ts
import { FirebaseStatus } from "../../firebase/type";

export interface Section {
  id: string;
  name: string;
  createdAt: number;  // 추가
  rooms: Record<string, Room>;
  statuses: Record<string, FirebaseStatus>;
  hospitalId: string;    // 추가
  departmentId: string;
}

export interface Room {
  id: string;
  name: string;
  patientName: string;
  statusId: string;
  memo?: string;
  timer: {
    type: 'countdown' | 'countup';
    currentTime: number;
    targetTime?: number;
    isRunning: boolean;
    startedAt?: number;
  };
  createdAt: number;
}