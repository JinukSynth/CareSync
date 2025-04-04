// // src/renderer/context/RealtimeContext.tsx
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { 
//   subscribeSections, 
//   subscribeRooms, 
//   subscribeStatuses,
//   updateData 
// } from '../../firebase/realtime';

// import { useAuth } from './AuthContext';
// import { FirebaseSection, FirebaseRoom, FirebaseStatus, FirebaseRoomUIState } from '../../firebase/type';

// interface RealtimeContextType {
//   sections: Record<string, FirebaseSection>;
//   rooms: Record<string, FirebaseRoom>;
//   statuses: Record<string, FirebaseStatus>;
//   updateSection: (sectionId: string, updates: Partial<FirebaseSection>) => Promise<void>;
//   updateRoom: (sectionId: string, roomId: string, updates: Partial<FirebaseRoom>) => Promise<void>;
//   updateRoomUIState: (
//     sectionId: string, 
//     roomId: string, 
//     updates: Partial<FirebaseRoomUIState>
//   ) => Promise<void>;
//   updateStatus: (statusId: string, updates: Partial<FirebaseStatus>) => Promise<void>;
// }

// const RealtimeContext = createContext<RealtimeContextType | null>(null);

// export function RealtimeProvider({ children }: { children: React.ReactNode }) {
//   const [sections, setSections] = useState<Record<string, FirebaseSection>>({});
//   const [rooms, setRooms] = useState<Record<string, FirebaseRoom>>({});
//   const [statuses, setStatuses] = useState<Record<string, FirebaseStatus>>({});
//   const { hospitalUser } = useAuth();

//   useEffect(() => {
//     if (!hospitalUser?.hospitalId || !hospitalUser?.departmentId) return;

//     const unsubscribeSections = subscribeSections(
//       hospitalUser.hospitalId,
//       hospitalUser.departmentId,
//       setSections
//     );

//     const unsubscribeRooms = subscribeRooms(
//       hospitalUser.hospitalId,
//       hospitalUser.departmentId,
//       setRooms
//     );

//     const unsubscribeStatuses = subscribeStatuses(
//       hospitalUser.hospitalId,
//       hospitalUser.departmentId,
//       setStatuses
//     );

//     return () => {
//       unsubscribeSections();
//       unsubscribeRooms();
//       unsubscribeStatuses();
//     };
//   }, [hospitalUser?.hospitalId, hospitalUser?.departmentId]);

//   const updateSection = async (
//     sectionId: string, 
//     updates: Partial<FirebaseSection>
//   ) => {
//     if (!hospitalUser?.hospitalId || !hospitalUser?.departmentId) return;
    
//     await updateData(
//       `sections/${hospitalUser.hospitalId}/${hospitalUser.departmentId}/${sectionId}`,
//       updates
//     );
//   };

//   const updateStatus = async (
//     statusId: string, 
//     updates: Partial<FirebaseStatus>
//   ) => {
//     if (!hospitalUser?.hospitalId || !hospitalUser?.departmentId) return;
    
//     await updateData(
//       `statuses/${hospitalUser.hospitalId}/${hospitalUser.departmentId}/${statusId}`,
//       updates
//     );
//   };

//   const updateRoomUIState = async (
//     sectionId: string,
//     roomId: string,
//     updates: Partial<FirebaseRoomUIState>
//   ) => {
//     if (!hospitalUser?.hospitalId || !hospitalUser?.departmentId) return;
    
//     await updateData(
//       `rooms/${hospitalUser.hospitalId}/${hospitalUser.departmentId}/${sectionId}/${roomId}/uiState`,
//       updates
//     );
//   };

//   const updateRoom = async (
//     sectionId: string,
//     roomId: string, 
//     updates: Partial<FirebaseRoom>
//   ) => {
//     if (!hospitalUser?.hospitalId || !hospitalUser?.departmentId) return;
    
//     await updateData(
//       `rooms/${hospitalUser.hospitalId}/${hospitalUser.departmentId}/${sectionId}/${roomId}`,
//       updates
//     );
//   };

//   return (
//     <RealtimeContext.Provider 
//       value={{
//         sections,
//         rooms,
//         statuses,
//         updateSection,
//         updateRoom,
//         updateRoomUIState,
//         updateStatus
//       }}
//     >
//       {children}
//     </RealtimeContext.Provider>
//   );
// }

// export function useRealtime() {
//   const context = useContext(RealtimeContext);
//   if (!context) {
//     throw new Error('useRealtime must be used within a RealtimeProvider');
//   }
//   return context;
// }